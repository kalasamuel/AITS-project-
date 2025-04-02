from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status, generics, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.timezone import now, timedelta
from django.contrib.auth import login
from django.contrib.auth import get_user_model
from .models import CustomUser, Department, VerificationCode
from .utils import send_verification_email
from .serializers import *
import uuid

# Registrar Code (Store securely in settings)
REGISTRAR_CODE = "REG123456"


### Helper Functions for Role-Based Validation ###
def validate_student_registration(data):
    """
    Validates Student registration fields.
    """
    student_number = data.get("student_number", "").strip()
    if len(student_number) != 10 and not student_number.isdigit():
        print("Invalid input! Check student number.")
    year_of_study = data.get("year_of_study", "").strip()
    if int(year_of_study) >= 6 and not year_of_study.isdigit():
        print("Invalid year of study.")
    
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
    lecturer_id = data.get("lecturer_id", "").strip()
    if not lecturer_id and not len(lecturer_id )!=10:
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
        # return Response({"message": "Registration successful. Check your email for the verification code."}, status=status.HTTP_201_CREATED)

        data = request.data
        institutional_email = data.get("institutional_email", "").strip().lower()
        role = data.get("role", "").strip().lower()
        first_name = data.get("first_name", "").strip()
        last_name = data.get("last_name", "").strip()
        password = data.get("password", "").strip()
        confirm_password = data.get("confirm_password", "").strip()
        email= data.get("email", "").strip()

        # Basic Validations
        if not institutional_email or not password or not confirm_password or not first_name or not last_name:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if password != confirm_password:
            return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(institutional_email=institutional_email).exists():
            return Response({"error": "institutional_email is already registered."}, status=status.HTTP_400_BAD_REQUEST)

        # Role-specific email suffix checks
        if role == "student":
            if not institutional_email.endswith("@students.mak.ac.ug"):
                return Response({"error": "Invalid Makerere Webmail address for students."}, status=status.HTTP_400_BAD_REQUEST)
        elif role == "lecturer":
            if not institutional_email.endswith("@lecturers.mak.ac.ug"):
                return Response({"error": "Invalid Makerere Webmail address for lecturers."}, status=status.HTTP_400_BAD_REQUEST)
        elif role == "registrar":
            if not institutional_email.endswith("@registrar.mak.ac.ug"):
                return Response({"error": "Invalid Makerere Webmail address for registrar."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Invalid role selected."}, status=status.HTTP_400_BAD_REQUEST)

        # Create User (Inactive until verification)
        user = CustomUser.objects.create(
            username=institutional_email,
            # institutional_email=institutional_email,
            email=email,
            first_name=first_name,
            last_name=last_name,
            student_number=data.get("student_number", None) if role == "student" else None,
            lecturer_id=data.get("lecturer_id", None) if role == "lecturer" else None,
            year_of_study=data.get("year_of_study", None) if role == "student" else None,
            registrar_id=data.get("registrar_id", None) if role == "registrar" else None,
            is_verified=False,
            role=role
        )


        user.set_password(password)
        user.save()

        # Generate and Send Verification Code
        verification_code = VerificationCode.objects.create(
            user=user, code=str(uuid.uuid4()), expires_at=now() + timedelta(minutes=10)
        )
        email_sent = send_verification_email(user, verification_code.code)

        if email_sent:
            return Response({"message": "Registration successful. Check your email for the verification code."}, status=status.HTTP_201_CREATED)
        
        return Response({"error": "Could not send verification email."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


### Verify Account View ###
class VerifyAccountView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        institutional_email = request.data.get("institutional_email", "").strip().lower()
        code = request.data.get("code", "").strip()

        try:
            user = CustomUser.objects.get(institutional_email=institutional_email)
            verification = VerificationCode.objects.get(user=user, code=code)
            if verification.expires_at < now():
                return Response({"error": "Verification code has expired."}, status=status.HTTP_400_BAD_REQUEST)
            user.is_verified = True  # Activate user after successful verification
            user.save()
            verification.delete()  # Remove the used code
            login(request, user)
            return Response({"message": "Verification successful. Redirecting to dashboard."}, status=status.HTTP_200_OK)
        except (CustomUser.DoesNotExist, VerificationCode.DoesNotExist):
            return Response({"error": "Invalid verification code."}, status=status.HTTP_400_BAD_REQUEST)


### Department Management API ###
class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

### Alternative User Registration API ###
class RegisterUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [AllowAny]

### Login View using JWT ###
class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CustomTokenObtainPairSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return Response({
                "access_token": access_token,
                "refresh_token": str(refresh),
                "user": {
                    "institutional_email": user.institutional_email,
                    "role": user.role,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
