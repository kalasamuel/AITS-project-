from django.db import models
from issue.models import Issue


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


class Notification(models.Model):
    notification_id = models.AutoField(primary_key=True)
    registrar = models.ForeignKey(Registrar, on_delete=models.CASCADE, related_name='notifications')
    issue = models.ForeignKey('issue.Issue', on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification {self.notification_id} for Issue {self.issue.issue_id}"
