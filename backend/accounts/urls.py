from django.urls import path
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
    
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("profile/iupload-picture/", ProfilePictureUploadView.as_view(), name="upload-picture"),
    path("profile/update/", UserProfileView.as_view(), name="update-profile"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
]