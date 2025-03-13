from django.shortcuts import render, redirect
# Create your views here.
from .models import CustomUser, Department, Student, VerificationCode
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.utils.timezone import now, timedelta
from rest_framework import status
from .utils import send_verification_email
from rest_framework import viewsets
from .serializers import DepartmentSerializer, StudentSerializer
from django.core.mail import send_mail
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import uuid

# Predefined Registrar Code (This should be stored securely in settings)
REGISTRAR_CODE = "REG123456"  # This will be required during registration


# self-registration API (Students and Lecturers)
class SelfRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        email = data.get("Institutional_Email", "").strip().lower()
        role = data.get("Role", "").strip().lower()
        first_name = data.get("First_Name", "").strip()
        last_name = data.get("Last_Name", "").strip()
        student_number = data.get("Student_Number", "").strip()
        year_of_study = data.get("Year_of_Study", "").strip()
        lecturer_id = data.get("Lecturer_ID", "").strip()
        password = data.get("password", "").strip()
        confirm_password = data.get("confirm_password", "").strip()
        personal_email = data.get("Email", "").strip()
        registrar_code = data.get("Registrar_Code", "").strip()
        
        # Ensures all fields are provided
        if not email or not password or not confirm_password or not first_name or not last_name:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Ensures passwords match
        if password != confirm_password:
            return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        # Validates institutional email format
        if role == "student" and not email.endswith("@students.mak.ac.ug"):
            return Response({"error": "Invalid institutional email for students."}, status=status.HTTP_400_BAD_REQUEST)
        if role == "lecturer" and not email.endswith("@mak.ac.ug"):
            return Response({"error": "Invalid institutional email for lecturers."}, status=status.HTTP_400_BAD_REQUEST)
        if role == "registrar" and registrar_code !=REGISTRAR_CODE:
            return Response({"error":"Invalid Registrar Code. Please contact the Admin."}, status=403)
        
        # Ensures email is not already registered
        if CustomUser.objects.filter(Institutional_Email=email).exists():
            return Response({"error": "Email is already registered."}, status=status.HTTP_400_BAD_REQUEST)

        if role == "student":
            try:
                student_number_first_2 = int(student_number[:2])
                current_year_last_2 = now().year % 100
                if (current_year_last_2 - student_number_first_2) > 6:
                    return Response({"error": "Registration denied, please visit the Registrar."}, status=status.HTTP_403_FORBIDDEN)
            except ValueError:
                return Response({"error": "Invalid student number format."}, status=status.HTTP_400_BAD_REQUEST)

        # Create user but set inactive until verification
        user = CustomUser.objects.create(
            username=email,            
            Institutional_Email=email,
            Email=personal_email,
            First_Name=first_name, 
            Last_Name=last_name,  
            Student_Number=student_number if role == "student" else None,
            Lecturer_ID=lecturer_id if role == "lecturer" else None,
            Year_of_Study=year_of_study if role == "student" else None,
             # we shall bypass verification by marking user as verified immediately for now
            is_verified=True,  # when set to false user must verify email before activation
            Role=role
        )
        
        user.set_password(password) # This ensures the password is properly hashed
        user.generate_verification_code()
        user.save()

        # Use reusable function to send email
        email_sent = send_verification_email(user, "AITS Registration Verification Code")
        if email_sent:
            return Response({"message": "Registration successful. Check your email for the verification code."}, status=status.HTTP_201_CREATED)
        
        #verifying whether the code exists
        elif request.method == "POST":
            email = request.POST.get("email")
            code = request.POST.get("code")

            try:
                user = CustomUser.objects.get(Institutional_Email=email)
                verification = VerificationCode.objects.get(user=user, code=code)

                if verification.is_expired():
                    return JsonResponse({"error": "Verification code has expired."}, status=400)

                user.is_verified = True
                user.save()
                verification.delete()  # Remove used verification code
                login(request, user)
                return JsonResponse({"message": "Verification successful. Redirecting to dashboard."})
            except (CustomUser.DoesNotExist, VerificationCode.DoesNotExist):
                return JsonResponse({"error": "Invalid verification code."}, status=400)

            return render(request, "verify.html")       
        else:
            return Response({"error": "Registration failed. Could not send verification email."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DepartmentViewSet(viewsets.ModelViewSet):
    """API for managing Departments"""
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class StudentViewSet(viewsets.ModelViewSet):
    """API for managing Students"""
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

