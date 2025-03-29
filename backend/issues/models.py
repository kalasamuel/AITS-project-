from django.db import models
from accounts.models import *

class Course(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=20, unique=True)
    assigned_lecturer = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, limit_choices_to={'role': 'lecturer'},
        null=True, blank=True, related_name='assigned_courses'
    )

    def __str__(self):
        return f"{self.code} - {self.name}"
    
class Issue(models.Model):
    """
    Represents an issue in the system.
    """
    CATEGORY_CHOICES = (
        ('missing_marks', 'Missing Marks'),
        ('course_registration', 'Course Registration'),
        ('timetable_conflict', 'Timetable Conflict'),
        ('general_complaint', 'General Complaint'),
    )
    STATUS_CHOICES = [
    ('open', 'Open'),
    ('in_progress', 'In Progress'),
    ('resolved', 'Resolved'),
    ]
    
    issue_id = models.AutoField(primary_key=True)
    issue_type = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(max_length=250)
    support_file = models.FileField(upload_to='issue_support_files/', blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="course_issues")
    student = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'student'},
        null=True, blank=True, related_name="student_issues"
    )
    assigned_to = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, limit_choices_to={'role': 'lecturer'},
        null=True, blank=True, related_name="assigned_issues"
    )

    def __str__(self):
        return f"Issue {self.Issue_ID}: {self.Issue_Type}"

    class Meta:
        verbose_name = "Issue"
        verbose_name_plural = "Issues"

class Notification(models.Model):
    '''Represents a notification in the system.'''
    notification_id = models.AutoField(primary_key=True)
    message = models.TextField()
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='issue_notifications') 
    created_at = models.DateTimeField(auto_now_add=True)
    recipient = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='user_notifications'
    )
    def __str__(self):
        return f"Notification {self.notification_id}: {self.message[:50]}..."

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
    
class Assignment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    due_date = models.DateField()
    assignment_id = models.CharField(max_length=10, primary_key=True)

    def __str__(self):
        return f"Assignment: {self.title} ({self.course.name})"

#Links student (from CustomUser) to a course
class Enrollment(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.last_name} {self.student.first_name} enrolled in {self.course.name}"

    class Meta:
        unique_together = ('student', 'course') # Ensure no duplicate enrollments