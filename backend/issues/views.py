# Create your views here.
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from accounts.permissions import IsStudent, IsLecturer, IsRegitrar
from .serializers import IssueSerializer, CourseSerializer, EnrollmentSerializer
from accounts.models  import CustomUser
from .models import Course, Enrollment, Issue

class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class =IssueSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perfoem_create(self, serializer):
        serializer.szve(created_by=self.request.user)
        
#Student Logs an issue
class LogIssueView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]  #Allows only students to log issues
    
    def post(self, request):
        
        serializer = IssueSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(student=request.user)
            return Response({"message": "Issue logged successful"})
        return Response(serializer.errors, status=status.HTTP_404_REQUEST)
    
#Only lecturers can view issues assigned to them filtered from the db 
class LecturerIssuesView(APIView):
    permission_classes=[IsAuthenticated, IsLecturer]# only lecturers access
    
    def get(self, request):
        issues= Issue.objects.filter(assigned_lecturer=request.user)
        serializer = IssueSerializer(issues, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, issue_id):
        issue=get_object_or_404(Issue, id=issue_id, assigned_lecturer=request.user)
    