from django.shortcuts import render
# Create your views here.
from .models import User, Student, Lecturer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.utils.timezone import now
from rest_framework import status
from .utils import send_verification_email

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
        student_id = data.get("Std_ID", "").strip()
        year_of_study = data.get("Year_of_Study", "").strip()
        lecturer_id = data.get("Lect_ID", "").strip()
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

        # Ensures email is not already registered
        if User.objects.filter(Institutional_Email=email).exists():
            return Response({"error": "Email is already registered."}, status=status.HTTP_400_BAD_REQUEST)

        if role == "student":
            try:
                student_id_first_2 = int(student_id[:2])
                current_year_last_2 = int(str(now().year)[-2:])
                if (current_year_last_2 - student_id_first_2) > 6:
                    return Response({"error": "Registration denied, please visit the Registrar."}, status=status.HTTP_403_FORBIDDEN)
            except ValueError:
                return Response({"error": "Invalid student number format."}, status=status.HTTP_400_BAD_REQUEST)

        # Create user but set inactive until verification
        user = User.objects.create(
            Institutional_Email=email,
            Email=personal_email,
            First_Name=first_name, 
            Last_Name=last_name,  
            Std_ID=student_id if role == "student" else None,
            Lect_ID=lecturer_id if role == "lecturer" else None,
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
        else:
            return Response({"error": "Registration failed. Could not send verification email."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        