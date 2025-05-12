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
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import TokenObtainPairView
from accounts.views import SelfRegisterView, LoginView
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

FRONTEND_EXCLUDES = "|".join([
    "api/",
    "admin/",
    "auth/",
    "static/",
    "media/",
])

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/register/', SelfRegisterView.as_view()),
    path('auth/login/', LoginView.as_view(), name="login"),
    path('api/accounts/', include('accounts.urls')),
    path('api/issues/', include('issues.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    re_path(f'^(?!{FRONTEND_EXCLUDES}).*$', TemplateView.as_view(template_name='index.html'), name='reactapp'),  # Catch-all for React routing
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)