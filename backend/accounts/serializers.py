from rest_framework import serializers
from .models import Department, Student

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'  # Includes all fields

class StudentSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)  # Nested representation
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), source='department', write_only=True
    )

    class Meta:
        model = Student
        fields = ['id', 'student_id', 'name', 'email', 'department', 'department_id']
