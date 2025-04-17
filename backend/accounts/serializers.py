from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser, Department, VerificationCode
from .utils import send_verification_email
from django.utils.timezone import now
from datetime import timedelta
import random

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['role', 'institutional_email', 'email', 'student_number', 'lecturer_id', 'year_of_study', 'is_verified', 'registrar_id']

class VerificationCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationCode
        fields = ['user', 'code', 'created_at', 'expires_at'] #'user' identifies who the verification code belongs to

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'  # Includes all fields
              
#serializer for handling user registration and verification

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ['username', 'first_name', 'last_name', 'password', 'confirm_password', 'role', 'institutional_email', 'student_number', "email", 'lecturer_id', 'year_of_study', 'registrar_id']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        
        role = data.get("role")
        if role == "student":
            if not data.get("student_number") or not data.get("year_of_study"):
                raise serializers.ValidationError("Student number and year of study are required for students.")
            # Additional validation: compare current year last 2 digits with student_number prefix
            current_year = now().year % 100
            try:
                student_prefix = int(str(data["student_number"])[:2])
            except ValueError:
                raise serializers.ValidationError("Invalid student number format.")
            if (current_year - student_prefix) > 6:
                raise serializers.ValidationError("Registration denied, please visit the Registrar.")
        elif role == "lecturer":
            if not data.get("lecturer_id"):
                raise serializers.ValidationError("Lecturer ID is required for lecturers.")
        elif role == "registrar":
            if not data.get("registrar_id"):
                raise serializers.ValidationError("Registrar ID is required for registrars.")
        return data
    
    def create(self, validated_data):
        validated_data.pop("confirm_password")  # Remove confirm_password from validated data
        user = CustomUser.objects.create_user(**validated_data)

        # Generate Verification Code
        user.verification_code = str(random.randint(100000, 999999))
        user.verification_expiry = now() + timedelta(minutes=10)
        user.save()

        # Send email
        send_verification_email(user, "AITS Registration Verification Code")

        return user

class VerifyAccountSerializer(serializers.Serializer):
    institutional_email = serializers.EmailField()
    verification_code = serializers.CharField()

    def validate(self, data):
        try:
            user = CustomUser.objects.get(institutional_email=data['institutional_email'], verification_code=data['verification_code'])
            if user.verification_expiry < now():
                raise serializers.ValidationError("Verification code has expired.")
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Invalid verification code.")
        return data
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['institutional_email'] = user.institutional_email
        token['role'] = user.role
        return token

    username_field='institutional_email'
    def validate(self, attrs):
        institutional_email = attrs.get("institutional_email")
        password = attrs.get("password")

        print(f"Login attempt: email={institutional_email}")
        
        if not institutional_email or not password:
            raise serializers.ValidationError({"detail": "Both institutional_email and password are required."})

        try:
            user = CustomUser.objects.get(institutional_email=institutional_email)
            if not user.check_password(password):
                raise serializers.ValidationError({"detail": "Invalid password."})
            if not user.is_active:
                raise serializers.ValidationError({"detail": "This account is inactive."})
            if not user.is_verified:
                raise serializers.ValidationError({"detail": "Your account is not verified. Please check your email."})

            refresh = self.get_token(user)
            return {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    "institutional_email": user.institutional_email,
                    "role": user.role,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                }
            }
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({"detail": "User not found."})
        
class LecturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['lecturer_id', 'first_name', 'last_name', 'institutional_email', 'department']    