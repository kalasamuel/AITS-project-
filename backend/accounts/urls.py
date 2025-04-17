from django.urls import path, include 
from rest_framework.routers import DefaultRouter
from .views import *

from rest_framework_simplejwt.views import TokenRefreshView

# router=DefaultRouter()
# router.register(r'departments', DepartmentViewSet)

urlpatterns=[
    # path('api/', include(router.urls)),
    path('verify/', VerifyAccountView.as_view(), name='verify-account'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify/', VerifyAccountView.as_view(), name='verify-account'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path("lecturers/", LecturerListView.as_view(), name="lecturer-list"),
]