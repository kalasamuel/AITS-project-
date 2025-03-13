from rest_framework import serializers
from .models import CustomUser, VerificationCode, Student, Lecturer, Department, AcademicRegistrar

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['role', 'Institutional_Email', 'Email', 
                  'Student_Number', 'Lecturer_ID', 'Year_of_Study', 'is_verified']

class VerificationCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationCode
        fields = ['code', 'created_at', 'expires_at']

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