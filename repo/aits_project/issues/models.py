from django.db import models
from accounts.models import User, Student, Lecturer, AcademicRegistrar, Department # Import user models



class Issue(models.Model):
    """
    Represents an issue in the system.
    """
    Issue_ID = models.AutoField(primary_key=True)
    Issue_Type = models.CharField(max_length=255)
    Description = models.TextField()
    SupportFile = models.FileField(upload_to='issue_support_files/', blank=True, null=True)
    Status = models.CharField(max_length=50, default='Open')
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)
    Student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True, related_name='student_issues')
    Lecturer = models.ForeignKey(Lecturer, on_delete=models.SET_NULL, null=True, blank=True, related_name='lecturer_issues')
    Registrar = models.ForeignKey(AcademicRegistrar, on_delete=models.SET_NULL, null=True, blank=True, related_name='registrar_issues')
    Department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='department_issues') # Categorization
    Assigned_to = models.ForeignKey('accounts.Lecturer', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_issues')


    def __str__(self):
        return f"Issue {self.Issue_ID}: {self.Issue_Type}"

    class Meta:
        verbose_name = "Issue"
        verbose_name_plural = "Issues"

class Notification(models.Model):
    """
    Represents a notification in the system.
    """
    Notification_ID = models.AutoField(primary_key=True)
    Message = models.TextField()
    Issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='issue_notifications') # Link to related issue
    Created_at = models.DateTimeField(auto_now_add=True)
    Student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True, related_name='student_notifications') # Recipient
    Lecturer = models.ForeignKey(Lecturer, on_delete=models.SET_NULL, null=True, blank=True, related_name='lecturer_notifications') # Recipient
    Registrar = models.ForeignKey(AcademicRegistrar, on_delete=models.SET_NULL, null=True, blank=True, related_name='registrar_notifications') # Recipient

    def __str__(self):
        return f"Notification {self.Notification_ID}: {self.Message[:50]}..."

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"