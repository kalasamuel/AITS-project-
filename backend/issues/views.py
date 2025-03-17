# Create your views here.
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

<<<<<<< Updated upstream
from accounts.permissions import IsStudent, IsLecturer, IsRegitrar
=======
from accounts.permissions import IsStudent, IsLecturer, IsRegistrar
from .serializers import IssueSerializer, CourseSerializer, EnrollmentSerializer
from accounts.models import CustomUser
from .models import Course, Enrollment, Issue

class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
>>>>>>> Stashed changes
