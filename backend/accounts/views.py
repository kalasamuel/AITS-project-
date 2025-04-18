from django.shortcuts import render, redirect, get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.hashers import check_password
from rest_framework.response import Response
from rest_framework import status, generics, viewsets
from django.utils.timezone import now
from .models import CustomUser, Department, VerificationCode
from .utils import send_verification_email
from .serializers import RegistrationSerializer, DepartmentSerializer, CustomTokenObtainPairSerializer, LecturerSerializer, CustomUserSerializer
from datetime import timedelta
from django.utils import timezone
from .models import VerificationCode 
import random

# Registrar Code (to be stored securely in settings)
REGISTRAR_CODE = "REG123456"

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

def create_verification_code_db(user, code):
    # Get the current time
    current_time = timezone.now()

    # Calculate the expiration time (30 minutes from now)
    expires_at = current_time + timedelta(minutes=30)

    # Create and save the VerificationCode object
    verification_code = VerificationCode.objects.create(
        user=user,
        code=code,
        expires_at=expires_at
    )

    return verification_code


### Self-Registration View ###
class SelfRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handles self-registration for Students, Lecturers, and Registrars.
        """
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
        if len(password) < 8:
            return Response({"error": "Password must be at least 8 characters long."}, status=status.HTTP_400_BAD_REQUEST)
        
        if CustomUser.objects.filter(institutional_email=institutional_email).exists():
            return Response({"error": "Webmail is already registered."}, status=status.HTTP_400_BAD_REQUEST)

        # Role-specific email suffix checks
        if role == "student":
            if not institutional_email.endswith("@students.mak.ac.ug"):
                return Response({"error": "Invalid Makerere Webmail address for students."}, status=status.HTTP_400_BAD_REQUEST)
        elif role == "lecturer":
            if not institutional_email.endswith("@gmail.com"): # Just for development purposes, should be @lecturer.mak.ac.ug
                return Response({"error": "Invalid Makerere Webmail address for lecturers."}, status=status.HTTP_400_BAD_REQUEST)
        elif role == "registrar":
            if not institutional_email.endswith("@gmail.com"): # Just for development purposes, should be @registrar.mak.ac.ug
                return Response({"error": "Invalid Makerere Webmail address for registrar."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Invalid role selected."}, status=status.HTTP_400_BAD_REQUEST)

        # Create User (Inactive until verification)
        user = CustomUser.objects.create(
            username=institutional_email,
            institutional_email=institutional_email,
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

        # Generate and save verification code
        verification_code = random.randint(100000, 999999)
        user.verification_code = verification_code

        create_verification_code_db(user, verification_code)

        user.save()

        # Send verification email
        send_verification_email(user.institutional_email, verification_code)

        return Response({"message": "Registration successful. Check your email for the verification code."}, status=status.HTTP_201_CREATED)

### Verify Account View ###

class VerifyAccountView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handles OTP verification for account activation.
        """
        email = request.data.get("email")
        print(f"The Webmail received from the Frontend is: {email}")
        otp = request.data.get("otp")
        print(f"The Code received from the Frontend is: {otp}")

        if not email or not otp:
            return Response({"error": "Missing email or OTP"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(CustomUser, institutional_email=email)

        if user.verification_code == otp:
            user.is_verified = True
            user.verification_code = None  # Clears code after verification
            user.save()
            return Response({"message": "OTP verified successfully. Your account is now active."}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class RegisterUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [AllowAny]

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = CustomTokenObtainPairSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
    
class LecturerListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        lecturers= CustomUser.objects.filter(role='lecturer')
        serializer = LecturerSerializer(lecturers, many=True)
        return Response(serializer.data, status=200)
    
#User profile view
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)
    
class ProfilePictureUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        user = request.user
        file = request.FILES.get('profile_picture')

        if not file:
            return Response({"error": "No file uploaded."}, status=400)

        if not file.content_type.startswith("image/"):
            return Response({"error": "Invalid file type. Please upload an image."}, status=400)

        if file.size > 5 * 1024 * 1024:  # 5MB limit
            return Response({"error": "File size exceeds the 5MB limit."}, status=400)

        user.profile_picture = file
        user.save()
        return Response({"message": "Profile picture uploaded successfully."})
    
class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        data = request.data
        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.institutional_email = data.get("institutional_email", user.institutional_email)
        if user.role != "registrar":
            user.registration_number = data.get("registration_number", user.registration_number)
            user.program = data.get("program", user.program)

        user.save()
        return Response({"message": "Profile updated successfully."})
    
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

def post(self, request):
    user = request.user
    current = request.data.get("currentPassword")
    new = request.data.get("newPassword")

    if not current or not new:
        return Response({"error": "Both current and new passwords are required."}, status=400)

    if not user.check_password(current):
        return Response({"error": "Current password is incorrect."}, status=400)

    if len(new) < 8:
        return Response({"error": "New password must be at least 8 characters long."}, status=400)

    user.set_password(new)
    user.save()
    return Response({"message": "Password changed successfully."})