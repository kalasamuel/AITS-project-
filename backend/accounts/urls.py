from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns=[
    # path('api/', include(router.urls)),
    path('verify/', VerifyAccountView.as_view(), name='verify-account'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify/', VerifyAccountView.as_view(), name='verify-account'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path("lecturers/", LecturerListView.as_view(), name="lecturer-list"),
    
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("profile/upload-picture/", ProfilePictureUploadView.as_view(), name="upload-profile-picture"),
    path("profile/update/", UserProfileView.as_view(), name="update-profile"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
]