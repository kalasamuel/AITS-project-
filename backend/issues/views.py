from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from rest_framework.status import HTTP_200_OK, HTTP_403_FORBIDDEN
from django.db import transaction
from django.core.mail import send_mail
from django.template.loader import render_to_string

from accounts.permissions import IsStudent, IsLecturer, IsRegistrar
from .serializers import *
from accounts.models import CustomUser
from .models import *
from aits_project.settings import EMAIL_HOST_USER
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
        issues = Issue.objects.filter(student=student,
                                      status__in =["resolved", "rejected", "in_progress"] ).order_by('-created_at')
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
        if request.user.role == 'lecturer' or request.user.role == 'registrar':
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

class LecturerStudentUpdatesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != "lecturer":
            return Response({"error": "Unauthorized"}, status=403)

        # Example: Fetch issues assigned to this lecturer that are not resolved
        updates = Issue.objects.filter(assigned_to=user).exclude(status="resolved").order_by('-created_at')
        # You can customize the serializer or fields as needed
        data = [
            {
                "institutional_email": issue.student.institutional_email,
                "issue_type": issue.issue_type,
                "message": issue.description,
                "status": issue.status,
                "created_at": issue.created_at,
            }
            for issue in updates
        ]
        return Response({"updates": data}, status=200)
    
class LecturerIssueResolutionView(APIView):
    serializer_class = IssueStatusUpdateSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, issue_id, *args, **kwargs):
        user = request.user
        try:
            issue = Issue.objects.get(issue_id=issue_id, assigned_to=user)
            new_status = request.data.get("status")

            if not new_status or new_status not in ["resolved", "in_progress", "rejected"]:
                return Response({"error": "Invalid status value."}, status=status.HTTP_400_BAD_REQUEST)

            old_status = issue.status

            if old_status == new_status:
                return Response({"detail": "Issue already in this status."}, status=status.HTTP_200_OK)

            try:
                with transaction.atomic():
                    issue.status = new_status
                    issue.save()

                    # --- Email Sending Logic ---
                    student = issue.student
                    if student and student.email:
                        email_subject = f"Your Issue '{issue.issue_type}' Status Update"

                        formatted_old_status = old_status.replace('_', ' ').title()
                        formatted_new_status = new_status.replace('_', ' ').title()
                        
                        old_status_class = old_status.lower().replace(' ', '_')
                        new_status_class = new_status.lower().replace(' ', '_')

                        email_html_message = render_to_string('emails/issue_status_update_email.html', {
                            'student_name': student.first_name,
                            'issue_type': issue.issue_type,
                            'old_status': formatted_old_status,
                            'new_status': formatted_new_status, 
                            'old_status_class': old_status_class, 
                            'new_status_class': new_status_class, 
                            'lecturer_name': user.first_name + " " + user.last_name,
                            'issue_description': issue.description,
                            'timestamp': issue.updated_at,
                            'contact_email': settings.EMAIL_HOST_USER 
                        })
                        
                        email_plain_message = (
                            f"Dear {student.first_name},\n\n"
                            f"The status of your issue '{issue.issue_type}' (ID: {issue.issue_id}) "
                            f"has been updated from '{formatted_old_status}' to '{formatted_new_status}' "
                            f"by Lecturer {user.first_name} {user.last_name}.\n\n"
                            f"Issue Description: {issue.description}\n"
                            f"Updated On: {issue.updated_at.strftime('%Y-%m-%d %H:%M:%S')}\n\n"
                            "Please log in to the AITS system for more details.\n\n"
                            "Sincerely,\n"
                            "The AITS Team"
                        )

                        try:
                            send_mail(
                                subject=email_subject,
                                message=email_plain_message,
                                html_message=email_html_message,
                                from_email=settings.EMAIL_HOST_USER,
                                recipient_list=[student.email],
                                fail_silently=False,
                            )
                            print(f"Email sent to {student.email} for issue {issue.issue_id} status update.")
                        except Exception as email_err:
                            print(f"Error sending issue status update email to {student.email}: {email_err}")
                            pass
                    else:
                        print(f"Skipping email for issue {issue.issue_id}: Student or student's 'email' field is empty/None.")

                serializer = IssueSerializer(issue)
                return Response(serializer.data, status=status.HTTP_200_OK)

            except Exception as transaction_err:
                print(f"Error during atomic transaction for issue update: {transaction_err}")
                return Response(
                    {"detail": "An internal server error occurred during the update transaction."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Issue.DoesNotExist:
            return Response({"error": "Issue not found or not assigned to this lecturer."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
class StudentAllIssuesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student = request.user
        issues = Issue.objects.filter(student=student).order_by('-created_at')
        serializer = IssueSerializer(issues, many=True)
        return Response(serializer.data, status=200)

class DismissNotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        user = request.user
        try:
            notification = Notification.objects.get(notification_id=id, recipient=user)
            notification.delete()  # Or set a 'dismissed' flag if you want to keep it
            return Response({'detail': 'Notification dismissed.'}, status=status.HTTP_204_NO_CONTENT)
        except Notification.DoesNotExist:
            return Response({'detail': 'Notification not found.'}, status=status.HTTP_404_NOT_FOUND)
        