from django.db import models
from django.contrib.auth.models import User


class Lecturer(models.Model):
    lecturer_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Issue(models.Model):
    issue_id = models.AutoField(primary_key=True)
    issue_type = models.CharField(max_length=255)
    description = models.TextField()
    support_file = models.FileField(upload_to='support_files/', null=True, blank=True)
    status = models.CharField(max_length=30, choices=[
        ('in_progress', 'In Progress'),
        ('pending', 'Pending'),
        ('resolved', 'Resolved'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    stud_id = models.ForeignKey('Student', on_delete=models.SET_NULL, null=True, blank=True,
                                related_name='student_issues')
    lect_id = models.ForeignKey(Lecturer, on_delete=models.SET_NULL, null=True, blank=True,
                                related_name='lecturer_issues')
    registrar_id = models.ForeignKey('Registrar', on_delete=models.SET_NULL, null=True, blank=True,
                                     related_name='registrar_issues')
    department_id = models.ForeignKey('Department', on_delete=models.SET_NULL, null=True, blank=True,
                                      related_name='department_issues')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,
                                    related_name='assigned_issues')

    def __str__(self):
        return f"Issue {self.issue_id}: {self.issue_type}"


class Registrar(models.Model):
    registrar_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Department(models.Model):
    dept_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    faculty = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Student(models.Model):
    student_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Notification(models.Model):
    notification_id = models.AutoField(primary_key=True)
    registrar = models.ForeignKey(Registrar, on_delete=models.CASCADE, related_name='notifications')
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification {self.notification_id} for Issue {self.issue_id}"
