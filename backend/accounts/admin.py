from django.contrib import admin
from .models import *
 
#registering models here
@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'last_name', 'first_name', 'institutional_email', 'role', 'is_verified')
    search_fields = ('username','last_name', 'first_name', 'institutional_email', 'role')

admin.site.register(Department)

