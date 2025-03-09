from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('user_details', views.user_details, name='details')
]
