#defining API endpoints so that our frontend can interact with them
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import *
# DRF Router for IssueViewSet
router = DefaultRouter()
router.register(r'issues', IssueViewSet)

urlpatterns = [
    path('', include(router.urls)),  

    # COURSE MANAGEMENT
    path("enroll/", EnrollCourseView.as_view(), name="enroll-course"),
    path("lecturer/courses/", LecturerCoursesView.as_view(), name="lecturer-courses"),
    # ISSUE MANAGEMENT
    path("log-issue/", LogIssueView.as_view(), name="log-issue"),
    path("lecturer/issues/", LecturerIssuesView.as_view(), name="lecturer-issues"),
    path("lecturer/issues/<int:issue_id>/update/", LecturerIssuesView.as_view(), name="update-issue-status"),  
    path("assign-issue/", AssignIssueView.as_view(), name="assign-issue"),
    path("courses/", CourseListAPIView.as_view(), name='course-list'),
    path("assignments/", AssignmentListAPIView.as_view(), name="assignment-list"),
    path("submit-issue/", IssueSubmissionView.as_view(), name='submit-issue'),
    path("registrar/all-issues/", RegistrarAllIssuesView.as_view(), name="registrar-all-issues"),
    path('notifications/student/', StudentNotificationsView.as_view(), name='student-notifications'),
    path("student/", StudentIssuesView.as_view(), name="student-issues"),
    path("student/resolved/", StudentResolvedIssuesView.as_view(), name="student-resolved-issues"),
    #path("assigned/", AssignedIssuesView.as_view(), name="assigned-issues"),
    path("assigned/", RegistrarAssignedIssuesView.as_view(), name="registrar-assigned-issues"),
    path("lecturer/notifications/", LecturerNotificationsView.as_view(), name="lecturer-notifications"),
    path("lecturer/student-updates/", LecturerStudentUpdatesView.as_view(), name="lecturer-student-updates"),
    path("lecturer/issues/<int:issue_id>/resolve/", LecturerIssueResolutionView.as_view(), name="resolve-issue"),
    path("student/all/", StudentAllIssuesView.as_view(), name="student-all-issues"),
    path('notifications/<int:id>/dismiss/', DismissNotificationView.as_view(), name='dismiss-notification'),
    ]