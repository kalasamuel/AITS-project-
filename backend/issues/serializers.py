from rest_framework import serializers
from .models import Issue, Enrollment, Course
from accounts.models import CustomUser  # Use CustomUser instead of Student

class IssueSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='Student.username', read_only=True)
    assigned_to = serializers.CharField(source="Assigned_to.username", read_only=True)
    class Meta:
        model = Issue
        fields = ['Issue_ID', 'Issue_Type', 'Description', 'Status', 'Assigned_to', 'student_name', 'Created_at']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'  # Include all fields from the Course model

#Returns structured data for enrolled students.
class EnrollmentSerializer(serializers.ModelSerializer):
    student_mail = serializers.CharField(source="student.Institutional_Email", read_only=True)
    course_name = serializers.CharField(source="course.name", read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'student_mail', 'course', 'course_name', 'enrolled_at']
        