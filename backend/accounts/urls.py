from django.urls import path, include 
from rest_framework.routers import DefaultRouter
from .views import *

from rest_framework_simplejwt.views import TokenRefreshView

router=DefaultRouter()
router.register(r'departments', DepartmentViewSet)

urlpatterns=[
    path('api/', include(router.urls)),
    path('register/', RegisterUserView.as_view(), name='register'), # for user registration
    path('verify/', VerifyAccountView.as_view(), name='verify-account'),
    #path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("login/", LoginView.as_view(), name="login"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]