#this model defines the user roles and authentication system 
#it includes models for students, lecturers, academic registrars, departments, and verification codes
from django.db import models
from django.contrib.auth.models import AbstractUser  
from django.utils.timezone import now #now: retrieves the current time for time-based operations.
import random, uuid, datetime #random & uuid: used for generating random and unique verification codes

# Custom User Model
class CustomUser(AbstractUser):

    #defines allowed roles in the system
    ROLE_CHOICES = ( 
        ('student', 'Student'),
        ('lecturer', 'Lecturer'),
        ('registrar', 'Registrar'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student') #store role of the user and if no role is provides, it defaults to student 
    institutional_email = models.EmailField(max_length=255, unique=True, null=True, blank=True)
    email = models.EmailField()  # For notifications and password reset
    student_number = models.CharField(max_length=10, blank=True, null=True)  # Only for students
    lecturer_id = models.CharField(max_length=20, blank=True, null=True)  # Only for lecturers
    year_of_study = models.PositiveIntegerField(blank=True, null=True)  # Only for students
    verification_code = models.CharField(max_length=6, blank=True, null=True)
    verification_expiry = models.DateTimeField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    
    def validate_student_year(self):
        if self.role == 'student' and self.student_number:
            current_year = now().year % 100
            student_entry_year = int(self.student_number[:2]) if self.student_number else 0
            return (current_year - student_entry_year) <= 6
        return True

    def save(self, *args, **kwargs):
        #ensures students must be within the valid academic range before being saved to the database
        if self.role == "student" and not self.validate_student_year():
            raise ValueError("Registration denied, please visit the Registrar.")
        super().save(*args, **kwargs)

    #creates random 6-digit verification code
    def generate_verification_code(self):
        self.verification_code = str(random.randint(100000, 999999))
        self.verification_expiry = now() + datetime.timedelta(minutes=10)  # 10 minutes expiry
        self.save()

    #user permissions and groups    
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name="issues_user_groups",  
        related_query_name="issues_user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="issues_user_permissions",  
        related_query_name="issues_user",
    )
    
    def __str__(self):
        return f"{self.last_name} {self.first_name} ({self.role})"

class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    student_number = models.CharField(max_length=10, unique=True)
    year_of_study = models.IntegerField()
    
    def validate_year_of_study(self):
        current_year = now().year % 100
        student_entry_year = int(self.student_number[:2])
        return (current_year - student_entry_year) <= 6

# Department Model
class Department(models.Model):
    department_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    faculty = models.CharField(max_length=255)

    def __str__(self):
        return self.Name

    class Meta:
        verbose_name = "Department"
        verbose_name_plural = "Departments"
        
class Lecturer(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    lecturer_id = models.CharField(max_length=20, unique=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    def __str__(self):
        return f"{self.role.first_name} {self.role.last_name}"

# Academic Registrar Model
class Registrar(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'registrar'})
    registrar_id = models.AutoField(primary_key=True)
    # Removed first_name and Last_Name fields we using role.first_name and role.Last_Name instead
    email = models.EmailField()
    institutional_email = models.EmailField(default="")
    notifications = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.role.first_name} {self.role.Last_Name}"

    class Meta:
        verbose_name = "Academic Registrar"
        verbose_name_plural = "Academic Registrars"

# Admin Model
class Admin(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'admin'})
    admin_id = models.AutoField(primary_key=True)
    permissions = models.TextField(default="Full Access")

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - Admin"

    class Meta:
        verbose_name = "Admin"
        verbose_name_plural = "Admins"

# Verification code model
class VerificationCode(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    code = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def is_expired(self):
        return now() > self.expires_at
