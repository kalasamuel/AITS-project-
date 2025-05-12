from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.timezone import now
import random, datetime

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and return a superuser with an email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        
        return self.create_user(email, password, **extra_fields)
    

# Custom User Model
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('lecturer', 'Lecturer'),
        ('registrar', 'Registrar'),
    )
    username = None  # Remove the username field
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    institutional_email = models.EmailField(unique=True, null=True, blank=True)
    email = models.EmailField()  # For notifications and password reset
    student_number = models.CharField(max_length=10, blank=True, null=True)  # Only for students
    lecturer_id = models.CharField(max_length=20, blank=True, null=True)  # Only for lecturers
    registrar_id = models.CharField(max_length=10, blank=True, null=True)
    year_of_study = models.PositiveIntegerField(blank=True, null=True)  # Only for students
    notifications = models.TextField(blank=True, null=True)
    verification_code = models.CharField(max_length=6, blank=True, null=True)
    verification_expiry = models.DateTimeField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    try:
        def validate_student_year(self):
            if self.role == 'student' and self.student_number:
                current_year = now().year % 100
                student_entry_year = int(self.student_number[:2]) if self.student_number else 0
                return (current_year - student_entry_year) <= 6
            return True

        def save(self, *args, **kwargs):
            if self.role == "student" and not self.validate_student_year():
                raise ValueError("Registration denied, please visit the Registrar.")
            super().save(*args, **kwargs)
    except Exception as e:
        e="Registration denied, please visit the Registrar."
        print(e)
        
    def generate_verification_code(self):
        self.verification_code = str(random.randint(100000, 999999))
        self.verification_expiry = now() + datetime.timedelta(minutes=10)  # 10 minutes expiry
        self.save()
        
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

    USERNAME_FIELD = 'institutional_email'

    objects = CustomUserManager()
    
    def __str__(self):
        return f"{self.last_name} {self.first_name} ({self.role})"

# Department Model
class Department(models.Model):
    department_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    faculty = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Department"
        verbose_name_plural = "Departments"
        
class VerificationCode(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    code = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def is_expired(self):
        return now() > self.expires_at
