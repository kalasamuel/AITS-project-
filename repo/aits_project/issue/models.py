from django.db import models
from django.contrib.auth.models import User
from lecturer_dashboard.models import Lecturer
from student_dashboard.models import Student
from registrar_dashboard.models import Registrar, Department


class Issue(models.Model):
    issue_id = models.AutoField(primary_key=True)
    issue_type = models.CharField(max_length=255)
    description = models.TextField()
    support_file = models.FileField(upload_to='support_files/', null=True, blank=True)
    status = models.CharField(max_length=30, choices=[
        ('pending', 'Pending'),  # Initial status
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ], default='pending')  # Set default status to 'pending'
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True,
                                related_name='student_issues')
    lecturer = models.ForeignKey(Lecturer, on_delete=models.SET_NULL, null=True, blank=True,
                                 related_name='lecturer_issues')
    registrar = models.ForeignKey('registrar_dashboard.Registrar', on_delete=models.SET_NULL, null=True, blank=True,
                                  related_name='registrar_issues')
    department = models.ForeignKey('registrar_dashboard.Department', on_delete=models.SET_NULL, null=True, blank=True,
                                   related_name='department_issues')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,
                                    related_name='assigned_issues')

    def __str__(self):
        return f"Issue {self.issue_id}: {self.issue_type}"
