from rest_framework import serializers
from .models import *
from .utils import send_verification_email
from django.utils.timezone import now
from datetime import timedelta
import random

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'institutional_email', 'email', 'role', 'student_number', 'lecturer_id', 'year_of_study', 'is_verified']

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
        fields = ['id', 'username', 'email', 'role', 'student_number', 'lecturer_id', 'year_of_study', 'password', 'confirm_password', 'registrar_id']


    def validate(self, data):
        role = data.get("role")
        student_number = data.get("student_number")
        year_of_study = data.get("year_of_study")
        lecturer_id = data.get("lecturer_id")
        current_year = now().year % 100  # Get last two digits of current year

        if role == "student":
            if not student_number or not year_of_study:
                raise serializers.ValidationError("Student ID and Year of Study are required for students.")
            if (current_year - int(str(student_number)[:2])) > 6:
                raise serializers.ValidationError("Registration denied, please visit the Registrar.")

        elif role == "lecturer":
            if not lecturer_id:
                raise serializers.ValidationError("Lecturer ID is required for lecturers.")

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

class StudentSerializer(serializers.Serializer):
    class Meta:
        model = Student
        fields = '__all__'

class LecturerSerializer(serializers.Serializer):
    class Meta:
        model= Lecturer
        fields = '__all__'
        
class RegistrarSerializer(serializers.ModelSerializer):
    class Meta:
        model =Registrar
        fields = '__all__'