from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.status import HTTP_200_OK, HTTP_403_FORBIDDEN

from accounts.permissions import IsStudent, IsLecturer, IsRegistrar
from .serializers import *
from accounts.models import CustomUser
from .models import *
# Create your views here.
#CRUD for issues
class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)  #shows the student who raised the issue


#STUDENT: Logs an issue   Students can log issues but cannot assign them.
class LogIssueView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request):
        serializer = IssueSerializer(data=request.data)
        if serializer.is_valid():
            # Save issue with student and course info
            serializer.save(student=request.user) #ensures issue is linked to student
            return Response({"message": "Issue logged successfully.", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# LECTURER: View assigned issues Lecturers only see issues assigned to them (filtered from DB).
class LecturerIssuesView(APIView):
    permission_classes = [IsAuthenticated, IsLecturer]  # Only lecturers can access

    def get(self, request):
        """Lecturers can only view issues assigned to them."""
        issues = Issue.objects.filter(assigned_to=request.user)
        serializer = IssueSerializer(issues, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, issue_id):
        issue = get_object_or_404(Issue, issue_id=issue_id, assigned_to=request.user)
        status_update = request.data.get("status")
        if status_update not in ["open", "in_progress", "resolved"]:
            return Response({"error": "Invalid status value."}, status=status.HTTP_400_BAD_REQUEST)
        issue.status = status_update
        issue.save()
        return Response({"message": "Issue status updated successfully.", "data": IssueSerializer(issue).data}, status=status.HTTP_200_OK)

#REGISTRAR: Assign issues to lecturers  Registrars can assign issues to lecturers.
class AssignIssueView(APIView):
    permission_classes = [IsAuthenticated, IsRegistrar]  # Only registrars can assign issues

    def post(self, request):
        """Assign an issue to a lecturer (Only registrar can perform this action)."""
        issue_id = request.data.get("issue_id")
        lecturer_id = request.data.get("lecturer_id")

        # Validate inputs
        if not issue_id or not lecturer_id:
            return Response({"error": "Issue ID and Lecturer ID are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch issue and lecturer
        issue = get_object_or_404(Issue, issue_id=issue_id)
        lecturer = get_object_or_404(CustomUser, lecturer_id=lecturer_id, role="lecturer")

        # Assign issue
        issue.assigned_to = lecturer
        issue.save()

        return Response({"message": f"Issue assigned to {lecturer.last_name} successfully."}, status=status.HTTP_200_OK)


#views for course management with strict access control.
# STUDENT: Enrolls in a course
class EnrollCourseView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request):
        """Allow students to enroll in a course."""
        course_id = request.data.get("course_id")

        # Validate input
        if not course_id:
            return Response({"error": "Course ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch course
        course = get_object_or_404(Course, code=course_id)

        # Check if already enrolled
        if Enrollment.objects.filter(student=request.user, course=course).exists():
            return Response({"error": "You are already enrolled in this course."}, status=status.HTTP_400_BAD_REQUEST)

        # Enroll student
        enrollment = Enrollment.objects.create(student=request.user, course=course)
        return Response({
            "message": "Enrollment successful.",
            "data": EnrollmentSerializer(enrollment).data
        }, status=status.HTTP_201_CREATED)
        
#LECTURER: View assigned courses
class LecturerCoursesView(APIView):
    permission_classes = [IsAuthenticated, IsLecturer]

    def get(self, request):
        """Allow lecturers to view only courses assigned to them."""  # Filtering courses using the 'assigned_lecturer' field
        courses = Course.objects.filter(assigned_lecturer=request.user)
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CourseListAPIView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class AssignmentListAPIView(generics.ListAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    
class IssueSubmissionView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        serializer = IssueSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            issue = serializer.save()
            return Response({
                "message": "Issue submitted successfully.",
                "issue_id": issue.issue_id,
                "status": issue.status
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RegistrarAllIssuesView(APIView):
    permission_classes = [IsAuthenticated, IsRegistrar]

    def get(self, request):
        issues = Issue.objects.all().order_by('-created_at')
        serializer = IssueSerializer(issues, many=True)
        return Response(serializer.data, status=200)

class StudentNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != 'student':
            return Response({"error": "Only students can access this endpoint."}, status=403)

        notifications = Notification.objects.filter(recipient=user).order_by('-created_at')[:20]
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

class StudentIssuesView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        student = request.user
        print("Authenticated user:", request.user)
        print("User role:", request.user.role)
        issues = Issue.objects.filter(student=student).order_by('-created_at')
        serializer = IssueSerializer(issues, many=True)
        return Response(serializer.data, status=200)

class StudentResolvedIssuesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student = request.user
        resolved_issues = Issue.objects.filter(student=student, status="resolved")
        serializer = IssueSerializer(resolved_issues, many=True)
        return Response(serializer.data)

class AssignedIssuesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'lecturer':
            # Fetch only the issues assigned to this specific lecturer
            assigned_issues = Issue.objects.filter(assigned_to=request.user)
            serializer = IssueSerializer(assigned_issues, many=True)
            return Response(serializer.data, status=HTTP_200_OK)
        else:
            return Response({"error": "You do not have permission to view this resource."}, status=HTTP_403_FORBIDDEN)

class RegistrarAssignedIssuesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Check if the user is a registrar
        if user.role != 'registrar':
            return Response({"error": "Forbidden: You do not have permission to view assigned issues."}, status=403)

        # Fetch all assigned issues
        assigned_issues = Issue.objects.filter(assigned_to__isnull=False)
        serializer = IssueSerializer(assigned_issues, many=True)
        return Response(serializer.data, status=200)

class LecturerNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != "lecturer":
            return Response({"error": "Unauthorized"}, status=403)

        notifications = Notification.objects.filter(recipient=user).order_by("-created_at")
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

