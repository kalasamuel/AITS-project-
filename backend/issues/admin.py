from django.contrib import admin
from .models import Issue, Notification, Course, Assignment, Enrollment

# Register your models here.
admin.site.register(Issue)
admin.site.register(Notification)
admin.site.register(Course)
admin.site.register(Assignment)
admin.site.register(Enrollment)