from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status, generics, viewsets
from django.utils.timezone import now, timedelta
from django.contrib.auth import login
from django.contrib.auth import get_user_model
from .models import CustomUser, Department, VerificationCode
from .utils import send_verification_email
from .serializers import *
import uuid

# Registrar Code (Store securely in settings)
REGISTRAR_CODE = "REG123456"

CustomUser = get_user_model()


### Helper Functions for Role-Based Validation ###
def validate_student_registration(data):
    """
    Validates Student registration fields.
    """
    student_number = data.get("Student_Number", "").strip()
    year_of_study = data.get("Year_of_Study", "").strip()
    
    try:
        student_number_first_2 = int(student_number[:2])
        current_year_last_2 = now().year % 100
        if (current_year_last_2 - student_number_first_2) > 6:
            return {"error": "Registration denied, please visit the Registrar."}
    except ValueError:
        return {"error": "Invalid student number format."}
    
    return None


def validate_lecturer_registration(data):
    """
    Validates Lecturer registration fields.
    """
    lecturer_id = data.get("Lecturer_ID", "").strip()
    if not lecturer_id:
        return {"error": "Lecturer ID is required."}
    return None


def validate_registrar_registration(data):
    """
    Validates Registrar registration using a predefined code.
    """
    registrar_code = data.get("Registrar_Code", "").strip()
    if registrar_code != REGISTRAR_CODE:
        return {"error": "Invalid Registrar Code. Please contact the Admin."}
    return None


### Self-Registration View ###
class SelfRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handles self-registration for Students, Lecturers, and Registrars.
        """
        data = request.data
        email = data.get("institutional_email", "").strip().lower()
        role = data.get("role", "").strip().lower()
        first_name = data.get("first_name", "").strip()
        last_name = data.get("last_name", "").strip()
        password = data.get("password", "").strip()
        confirm_password = data.get("confirm_password", "").strip()
        personal_email = data.get("email", "").strip()

        # Basic Validations
        if not email or not password or not confirm_password or not first_name or not last_name:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if password != confirm_password:
            return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(institutional_email=email).exists():
            return Response({"error": "Email is already registered."}, status=status.HTTP_400_BAD_REQUEST)

        # Role-Specific Validations
        if role == "student":
            if not email.endswith("@students.mak.ac.ug"):
                return Response({"error": "Invalid institutional email for students."}, status=status.HTTP_400_BAD_REQUEST)
            validation_error = validate_student_registration(data)
            if validation_error:
                return Response(validation_error, status=status.HTTP_400_BAD_REQUEST)

        elif role == "lecturer":
            if not email.endswith("@lecturers.mak.ac.ug"):
                return Response({"error": "Invalid institutional email for lecturers."}, status=status.HTTP_400_BAD_REQUEST)
            validation_error = validate_lecturer_registration(data)
            if validation_error:
                return Response(validation_error, status=status.HTTP_400_BAD_REQUEST)

        elif role == "registrar":
            validation_error = validate_registrar_registration(data)
            if validation_error:
                return Response(validation_error, status=status.HTTP_403_FORBIDDEN)

        else:
            return Response({"error": "Invalid role selected."}, status=status.HTTP_400_BAD_REQUEST)

        # Create User (Inactive until verification)
        user = CustomUser.objects.create(
            username=email,
            institutional_email=email,
            email=personal_email,
            student_number=data.get("student_number", None) if role == "student" else None,
            lecturer_id=data.get("lecturer_id", None) if role == "lecturer" else None,
            year_of_study=data.get("year_of_study", None) if role == "student" else None,
            is_verified=False,
            role=role
        )

        user.set_password(password)
        user.save()

        # Generate and Send Verification Code
        verification_code = VerificationCode.objects.create(
            user=user, code=str(uuid.uuid4())[:6], expires_at=now() + timedelta(minutes=10)
        )
        email_sent = send_verification_email(user, verification_code.code)

        if email_sent:
            return Response({"message": "Registration successful. Check your email for the verification code."}, status=status.HTTP_201_CREATED)
        
        return Response({"error": "Could not send verification email."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


###Verify Account View ###
class VerifyAccountView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handles account verification via email verification code.
        """
        email = request.data.get("email", "").strip().lower()
        code = request.data.get("code", "").strip()

        try:
            user = CustomUser.objects.get(institutional_email=email)
            verification = VerificationCode.objects.get(user=user, code=code)

            if verification.expires_at < now():
                return Response({"error": "Verification code has expired."}, status=status.HTTP_400_BAD_REQUEST)

            # Activate user and delete verification code
            user.is_verified = False #Turn to True if you want to by-pass registration for now
            user.save()
            verification.delete()
            login(request, user)

            return Response({"message": "Verification successful. Redirecting to dashboard."}, status=status.HTTP_200_OK)

        except (CustomUser.DoesNotExist, VerificationCode.DoesNotExist):
            return Response({"error": "Invalid verification code."}, status=status.HTTP_400_BAD_REQUEST)


### Department Management API ###
class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


###User Registration API (Alternative) ###
class RegisterUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [AllowAny]