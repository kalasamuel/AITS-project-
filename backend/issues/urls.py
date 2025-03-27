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
    path("assign-course/", AssignCourseView.as_view(), name="assign-course"),

    # ISSUE MANAGEMENT
    path("log-issue/", LogIssueView.as_view(), name="log-issue"),
    path("lecturer/issues/", LecturerIssuesView.as_view(), name="lecturer-issues"),
    path("lecturer/issues/<int:issue_id>/update/", LecturerIssuesView.as_view(), name="update-issue-status"),  
    path("assign-issue/", AssignIssueView.as_view(), name="assign-issue"),
    path("courses/", CourseListAPIView.as_view(), name='course-list'),
    path("assignments/", AssignmentListAPIView.as_view(), name="assignment-list"),
]