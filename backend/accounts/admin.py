from django.contrib import admin
from .models import CustomUser, Lecturer, Student, AcademicRegistrar, Department
 
#registering models here
admin.site.register(CustomUser)
admin.site.register(Lecturer)
admin.site.register(Student)
admin.site.register(AcademicRegistrar)
admin.site.register(Department)

