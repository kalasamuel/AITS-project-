from django.db import models
from django.contrib.auth.models import AbstractUser  
from django.utils.timezone import now
import random
import uuid

# Custom User Model
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('lecturer', 'Lecturer'),
        ('registrar', 'Registrar'),
    )
    user = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    First_Name =models.CharField(max_length=25)
    Last_Name =models.CharField(max_length=25)
    Institutional_Email = models.EmailField(unique=True)
    Email = models.EmailField()  # For issue notifications and forgot password
    Student_Number = models.CharField(max_length=10, blank=True, null=True)  # Only for students
    Lecturer_ID = models.CharField(max_length=20, blank=True, null=True)  # Only for lecturers
    Year_of_Study = models.PositiveIntegerField(blank=True, null=True)  # Only for students
    is_verified = models.BooleanField(default=False)

    def validate_student_year(self):
        if self.role == 'student' and self.Student_Number:
            current_year = now().year % 100
            student_entry_year = int(self.Student_Number[:2]) if self.Student_Number else 0
            return (current_year - student_entry_year) <= 6
        return True

    def generate_verification_code(self):
        self.verification_code = str(random.randint(100000, 999999))
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
    
    def __str__(self):
        return f"{self.username} ({self.role})"

# Department Model
class Department(models.Model):
    Dept_ID = models.AutoField(primary_key=True)
    Name = models.CharField(max_length=255)
    Faculty = models.CharField(max_length=255)

    def __str__(self):
        return self.Name

    class Meta:
        verbose_name = "Department"
        verbose_name_plural = "Departments"

# Student Model
class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    Student_Number = models.CharField(max_length=10, primary_key=True, default="2400725045")
    Reg_No = models.CharField(max_length=20, unique=True)
    # Removed First_Name and Last_Name fields we using role.First_Name and role.Last_Name instead
    Institutional_Email = models.EmailField(default="")
    Email = models.EmailField()
    Phone_Number = models.CharField(max_length=15)
    Department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    Course = models.CharField(max_length=255)
    Year_of_Study = models.IntegerField()

    def __str__(self):
        return f"{self.role.First_Name} {self.role.Last_Name} ({self.Reg_No})"

    class Meta:
        verbose_name = "Student"
        verbose_name_plural = "Students"

# Lecturer Model
class Lecturer(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'lecturer'})
    Lect_ID = models.AutoField(primary_key=True)
    # Removed First_Name and Last_Name fields we using role.First_Name and role.Last_Name instead
    Institutional_Email = models.EmailField(default="")
    Department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.role.First_Name} {self.role.Last_Name}"

    class Meta:
        verbose_name = "Lecturer"
        verbose_name_plural = "Lecturers"

# Academic Registrar Model
class AcademicRegistrar(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'registrar'})
    Registrar_ID = models.AutoField(primary_key=True)
    # Removed First_Name and Last_Name fields we using role.First_Name and role.Last_Name instead
    Email = models.EmailField()
    Institutional_Email = models.EmailField(default="")
    Notifications = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.role.First_Name} {self.role.Last_Name}"

    class Meta:
        verbose_name = "Academic Registrar"
        verbose_name_plural = "Academic Registrars"

# Issue Model
class Issue(models.Model):
    CATEGORY_CHOICES = (
        ('missing_marks', 'Missing Marks'),
        ('course_registration', 'Course Registration'),
        ('timetable_conflict', 'Timetable Conflict'),
        ('general_complaint', 'General Complaint'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    assigned_lecturer = models.ForeignKey(Lecturer, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.title} ({self.status})"

class VerificationCode(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    code = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def is_expired(self):
        return now() > self.expires_at
