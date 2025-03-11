from django.db import models
from django.contrib.auth.models import AbstractUser  


#custom User Model
class User(AbstractUser):
    is_student = models.BooleanField(default=False)
    is_lecturer = models.BooleanField(default=False)
    is_registrar = models.BooleanField(default=False)
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
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

# Student Model
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    Stud_ID = models.AutoField(primary_key=True)
    Reg_No = models.CharField(max_length=20, unique=True)
    First_Name = models.CharField(max_length=255)
    Last_Name = models.CharField(max_length=255)
    Email = models.EmailField()
    Phone_Number = models.CharField(max_length=15)
    Department = models.CharField(max_length=255)  # You might want to use a ForeignKey to the Department model here
    Course = models.CharField(max_length=255)
    Year_of_Study = models.IntegerField()

    def __str__(self):
        return f"{self.First_Name} {self.Last_Name} ({self.Reg_No})"

    class Meta:
        verbose_name = "Student"
        verbose_name_plural = "Students"


# Lecturer Model
class Lecturer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    Lect_ID = models.AutoField(primary_key=True)
    First_Name = models.CharField(max_length=255)
    Last_Name = models.CharField(max_length=255)
    Email = models.EmailField()
    Department = models.ForeignKey('Department', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.First_Name} {self.Last_Name}"

    class Meta:
        verbose_name = "Lecturer"
        verbose_name_plural = "Lecturers"


# Academic Registrar Model
class AcademicRegistrar(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    Registrar_ID = models.AutoField(primary_key=True)
    First_Name = models.CharField(max_length=255)
    Last_Name = models.CharField(max_length=255)
    Email = models.EmailField()
    Notifications = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.First_Name} {self.Last_Name}"

    class Meta:
        verbose_name = "Academic Registrar"
        verbose_name_plural = "Academic Registrars"


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
