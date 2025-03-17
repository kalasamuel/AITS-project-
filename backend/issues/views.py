# Create your views here.
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from accounts.permissions import IsStudent, IsLecturer, IsRegitrar