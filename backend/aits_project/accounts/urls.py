from django.urls import path, include 
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, StudentViewSet

router=DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'students', StudentViewSet)

urlpatterns=[
    path('api/', include(router.urls)),
]
