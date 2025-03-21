from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    IssueViewSet, EnrollCourseView, LecturerIssuesView, AssignCourseView,
    LogIssueView, LecturerIssuesView, AssignIssueView
)
router =DefaultRouter()
router.register(r'issues', IssueViewSet)

urlpatterns = [
    #path('', views.index, name='index')
    path('', include(router.urls)), #Register Viewset URLs properly
    
    '''course management'''
    path('enroll/', EnrollCourseView.as_view(),name="enroll-course"),
    path('lecturer/courses/', LecturerIssuesView.as_view(), name='lecturer-courses'),
    path('assign-course/', AssignCourseView.as_view(), name="assign-course"),
    
    """issue management"""
    path('log-issue/', LogIssueView.as_view(), name="log-issue"),
    path('lectuer/issues/', LecturerIssuesView.as_view(), name='lecturer-issues'),
    path('lecturer/issues/<int:issue_id>/update/', AssignIssueView.as_view(), name='update-issue-status'),
    path('assign-issue/', AssignIssueView.as_view(), name="assign-issue",)
]