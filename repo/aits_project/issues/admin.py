from django.contrib import admin
from .models import Issue, Notification

# Register your models here.
admin.site.register(Issue)
admin.site.register(Notification)