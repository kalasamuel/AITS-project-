from rest_framework import serializers
from .models import CustomUser, VerificationCode, Student, Lecturer, Department, AcademicRegistrar
from django.contrib.auth import get_user_model
from .utils import send_verification_email
from django.utils.timezone import now
from datetime import timedelta

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['role', 'Institutional_Email', 'Email', 
                  'Student_Number', 'Lecturer_ID', 'Year_of_Study', 'is_verified']

class VerificationCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationCode
        fields = ['user', 'code', 'created_at', 'expires_at'] #'user' identifies who the verification code belongs to

# Serializers for role-specific models 
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class LecturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecturer
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'  # Includes all fields

class AcademicRegistrarSerializer(serializers.ModelSerializer):
    class Meta:
        model =AcademicRegistrar
        fields ='__all__'
        
             
#serializer for handling user registration and verification

CustomUser = get_user_model()

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'Student_Number', 'Lecturer_ID', 'year_of_study', 'password', 'confirm_password']


    def validate(self, data):
        role = data.get("role")
        Student_Number = data.get("Student_Number")
        year_of_study = data.get("year_of_study")
        lecturer_id = data.get("lecturer_id")
        current_year = now().year % 100  # Get last two digits of current year

        if role == "student":
            if not Student_Number or not year_of_study:
                raise serializers.ValidationError("Student ID and Year of Study are required for students.")
            if (current_year - int(str(Student_Number)[:2])) > 6:
                raise serializers.ValidationError("Registration denied, please visit the Registrar.")

        elif role == "lecturer":
            if not lecturer_id:
                raise serializers.ValidationError("Lecturer ID is required for lecturers.")

        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")  # Remove confirm_password from the validated data
        user = CustomUser.objects.create_user(**validated_data)
        user.verification_code = send_verification_email()
        user.verification_expiry = now() + timedelta(minutes=10)
        user.save()
        return user

class VerifyAccountSerializer(serializers.Serializer):
    email = serializers.EmailField()
    verification_code = serializers.CharField()

    def validate(self, data):
        try:
            user = CustomUser.objects.get(email=data['email'], verification_code=data['verification_code'])
            if user.verification_expiry < now():
                raise serializers.ValidationError("Verification code has expired.")
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Invalid verification code.")
        return data
