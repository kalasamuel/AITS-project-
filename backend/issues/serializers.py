from rest_framework import serializers
from .models import Issue, Enrollment, Course, Assignment

class IssueSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    assigned_to_username = serializers.CharField(source="assigned_to.username", read_only=True)
    class Meta:
        model = Issue
        fields = ['issue_id', 'issue_type', 'description', 'status', 'assigned_to_username', 'student_name', 'created_at']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'  # Include all fields from the Course model

#Returns structured data for enrolled students.
class EnrollmentSerializer(serializers.ModelSerializer):
    student_mail = serializers.CharField(source="student.institutional_email", read_only=True)
    course_name = serializers.CharField(source="course.name", read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'student_mail', 'course', 'course_name', 'enrolled_at']

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'   