from django.shortcuts import render, redirect, get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status, generics, viewsets
from .models import CustomUser, Department, VerificationCode
from .utils import send_verification_email
from .serializers import EmailSerializer, PasswordResetConfirmSerializer, RegistrationSerializer, DepartmentSerializer, CustomTokenObtainPairSerializer, LecturerSerializer, CustomUserSerializer
from datetime import timedelta
from django.utils import timezone
from .models import VerificationCode 
import random
from .serializers import *
from aits_project.settings import REGISTRAR_CODE, EMAIL_HOST_USER
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.db import transaction

class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = EmailSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = CustomUser.objects.get(institutional_email=email)
        except CustomUser.DoesNotExist:
            return Response({'message': 'If an account with that email exists, a password reset link has been sent.'}, status=status.HTTP_200_OK)

        with transaction.atomic():
            # token and UID generation
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            # the reset link (Frontend URL)
            reset_link = f"https://aits-group-t-3712bf6213e8.herokuapp.com/reset-password/{uid}/{token}/"

            # email content
            email_subject = "Password Reset Request for AITS"
            email_html_message = render_to_string('emails/password_reset_email.html', {
                'user': user,
                'reset_link': reset_link,
                'domain': 'aits-group-t-3712bf6213e8.herokuapp.com/'
            })
            email_plain_message = f"""
            Hi {user.last_name} {user.first_name},

            You requested a password reset for your AITS account.

            Please go to the following page and choose a new password:
            {reset_link}

            If you didn't request a password reset, you can ignore this email.

            Thank you,
            AITS Team
            """

            # Send email
            try:
                send_mail(
                    subject=email_subject,
                    message=email_plain_message,
                    html_message=email_html_message,
                    from_email=EMAIL_HOST_USER,
                    recipient_list=[user.institutional_email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Error sending password reset email: {e}")
                return Response({'error': 'Failed to send reset email. Please try again later.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        return Response({'message': 'If an account with that email exists, a password reset link has been sent.'}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uidb64 = serializer.validated_data['uid']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = CustomUser._default_manager.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            with transaction.atomic():
                user.set_password(new_password)
                user.save()

            return Response({'message': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'The reset link is invalid or has expired.'}, status=status.HTTP_400_BAD_REQUEST)

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
    # current time
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
        print("The data received from the Frontend is: ", request.data)
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
            #username=institutional_email,
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


### Self-Registration View ###
class VerifyAccountView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handles OTP verification for account activation.
        """
        serializer = VerifyAccountSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        
        # Log for debugging (remove in production)
        print(f"The Webmail received from the Frontend is: {email}")
        print(f"The Code received from the Frontend is: {otp}")
        
        try:
            # Look up the user by institutional email
            user = get_object_or_404(CustomUser, institutional_email=email)
            
            # Check if verification code matches
            if user.verification_code == otp:
                user.is_verified = True
                user.verification_code = None  # Clear code after successful verification
                user.save()
                
                return Response({
                    "message": "OTP verified successfully. Your account is now active.",
                    "is_verified": True
                }, status=status.HTTP_200_OK)
                
            # Code doesn't match
            return Response({
                "error": "Invalid verification code. Please check and try again."
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            # Log the error (remove in production)
            print(f"Verification error: {str(e)}")
            return Response({
                "error": "Account verification failed. Please contact support."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)        

class NV(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("The data received from the Frontend is: ", request.data)
        return Response({"message": "Registration successful."}, status=status.HTTP_201_CREATED)

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
        return Response({"message": "Profile picture uploaded successfully.", "profile_picture": user.profile_picture.url})
    
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