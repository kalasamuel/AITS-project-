from rest_framework import serializers
from .models import Issue, Enrollment, Course, Assignment, Notification
from rest_framework.response import Response
from accounts.models import CustomUser

class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'registration_number']

class CourseSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"
        
class IssueSerializer(serializers.ModelSerializer):
    student = UserSimpleSerializer(read_only=True)
    assigned_to = UserSimpleSerializer(read_only=True)
    course = CourseSimpleSerializer(read_only=True)
    course_code = serializers.CharField(write_only=True)
    student_name = serializers.CharField(read_only=True)
    registration_number = serializers.SerializerMethodField()
    resolution_time = serializers.SerializerMethodField()
    class Meta:
        model = Issue
        fields = '__all__'
    
    def get_student_name(self, obj):
        return f"{obj.student.last_name} {obj.student.first_name}"
    
    def get_registration_number(self, obj):
        return obj.student.student_number
    
    def get_resolution_time(self, obj):
        if hasattr(obj, 'deadline') and obj.deadline:
            days= (obj.deadline - obj.created_at.date()).days
            return f"{days} days"
        return "N/A"

    def validate_department(self, value):
        allowed_departments = dict(Issue.DEPARTMENTS).keys()
        if value.lower() not in allowed_departments:
            raise serializers.ValidationError("Invalid department selected.")
        return value.lower()

    def validate_course_code(self, value):
        try:
            course = Course.objects.get(code=value)
            return course
        except Course.DoesNotExist:
            raise serializers.ValidationError("Course with the given code does not exist.")

    def create(self, validated_data):
        course = validated_data.pop('course_code')
        validated_data['course'] = course
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)

        
def create_issue(request):
    course_code = request.data.get('course_code')
    course = Course.objects.filter(code=course_code).first()
    if not course:
        return Response({"error": "Course not found."}, status=400)

    issue = Issue.objects.create(
        issue_type=request.data.get('issue_type'),
        description=request.data.get('description'),
        department=request.data.get('department'),
        course=course,
        student=request.user,
        support_file=request.FILES.get('support_file'),
    )
    return Response({"message": "Issue submitted successfully."}, status=201)


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

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

# issues/serializers.py

class IssueSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ['issue_id', 'issue_type', 'status']

class NotificationSerializer(serializers.ModelSerializer):
    issue = IssueSimpleSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ['notification_id', 'message', 'created_at', 'issue', 'recipient']
