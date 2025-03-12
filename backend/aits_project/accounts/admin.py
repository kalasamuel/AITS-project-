from django.contrib import admin
from .models import User, Lecturer, Student, AcademicRegistrar, Department
 
# Register your models here.
admin.site.register(User)
admin.site.register(Lecturer)
admin.site.register(Student)
admin.site.register(AcademicRegistrar)
admin.site.register(Department)

