from django.contrib import admin
from .models import *

# Register CustomUser with a custom admin class
@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('last_name', 'first_name', 'institutional_email', 'role', 'is_verified')
    search_fields = ('last_name', 'first_name', 'institutional_email', 'role')

admin.site.register(Department)
