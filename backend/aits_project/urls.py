"""
URL configuration for aits_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView # imports JWT authentication view to provide access tokens
from rest_framework.routers import DefaultRouter # imports DRF's routers which automatically generate URL routes for viewsets
from accounts.views import SelfRegisterView, VerifyAccountView, DepartmentViewSet
from issues.views import IssueViewSet # to manage academic issue tracking

#creating a router for viewsets
router = DefaultRouter() # creates a REST framework router to automatically handle URL routing for viewsets
router.register(r'departments', DepartmentViewSet)
router.register(r'issues', IssueViewSet)  # issue tracking API


urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('api/issues/', include('issues.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/register/', SelfRegisterView.as_view(), name='register'),
    path('api/auth/verify/', VerifyAccountView.as_view(), name='verify'),
    path('api/', include(router.urls)),  # includes issues and departments
]
