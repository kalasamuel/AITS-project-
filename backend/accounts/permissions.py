# Restricting API access for students, lecturers, and registrars.
from rest_framework import permissions

class IsStudent(permissions.BasePermission):
    """Permission to allow only students."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "student"

class IsLecturer(permissions.BasePermission):
    """Permission to allow only lecturers."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "lecturer"

class IsRegistrar(permissions.BasePermission):
    """Permission to allow only registrars."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "registrar"