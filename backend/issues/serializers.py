from rest_framework import serializers
from .models import Issue, Enrollment, Course, Assignment, Notification
from accounts.models import Student

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ["Issue_Id", 'Issue_Type', 'Description', 'SupportFile', 'Status', 'Created_at', 'Updated_at', 'Assigned_to']
        
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields ='__all__' # including all fields from the Course model
        
class EnrollmentSerializer(serializers.ModelSerializer):
    student_mail = serializers.CharField(source = Student.Institutional_Email, read_only =True)
    course_name =serializers.CharField(source = 'course.name', read_only =True)
    class Meta:
        model =Enrollment
        fields =['id', 'student', 'course', 'enrolled_at']