#Restricting API access to its users
from rest_framework import permissions

class IsStudent(permissions.BasePermission):
    """Allow access only to student users."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "student"

class IsLecturer(permissions.BasePermission):
    """Allow access only to lecturer users."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "lecturer"

class IsRegistrar(permissions.BasePermission):
    """Allow access only to registrar users."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "registrar"
