from django.urls import path, include 
from rest_framework.routers import DefaultRouter
from .views import *

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router=DefaultRouter()
router.register(r'departments', DepartmentViewSet)
#router.register(r'students', StudentViewSet)

urlpatterns=[
    path('api/', include(router.urls)),
    path('register/', RegisterUserView.as_view(), name='register'), # for user registration
    path('verify/', VerifyAccountView.as_view(), name='verify-account'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]