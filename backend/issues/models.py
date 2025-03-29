from django.db import models
from accounts.models import *
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import CustomUser

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
        ordering = ['-created_at']  # Show latest issues first

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


# Signal to notify the academic registrar and student when an issue is created
@receiver(post_save, sender=Issue)
def notify_on_issue_creation(sender, instance, created, **kwargs):
    if created:
        student_email = instance.student.email if instance.student else None
        
        # Fetch the Academic Registrar (assuming there's only one)
        registrar = CustomUser.objects.filter(role='registrar').first()
        registrar_email = registrar.email if registrar else None

        subject = "New Issue Submitted"
        message = f"""
        A new issue has been reported by {instance.student.first_name} {instance.student.last_name}.

        Issue Details:
        - Type: {instance.issue_type}
        - Description: {instance.description}
        - Status: {instance.status}

        Please review and take necessary action.
        """

        # Send email to Academic Registrar
        if registrar_email:
            send_mail(
                subject, message, 'admin@aits.com', [registrar_email], fail_silently=True
            )

        # Send email to Student (confirmation)
        if student_email:
            send_mail(
                "Issue Submitted Successfully",
                f"Dear {instance.student.first_name},\n\n"
                "Your issue has been successfully submitted and is under review.\n\n"
                f"Issue ID: {instance.issue_id}\n"
                f"Type: {instance.issue_type}\n"
                f"Status: {instance.status}\n\n"
                "We will notify you once it is resolved.\n\n"
                "Best Regards,\nAITS Support Team",
                'admin@aits.com',
                [student_email],
                fail_silently=True,
            )


# Signal to notify student when issue is resolved
@receiver(post_save, sender=Issue)
def notify_student_on_resolution(sender, instance, **kwargs):
    if instance.status == "resolved":
        student_email = instance.student.email if instance.student else None

        if student_email:
            send_mail(
                "Issue Resolved",
                f"Dear {instance.student.first_name},\n\n"
                "Your reported issue has been resolved.\n\n"
                f"Issue ID: {instance.issue_id}\n"
                f"Type: {instance.issue_type}\n"
                f"Final Status: {instance.status}\n\n"
                "If you need further assistance, please contact the registrar.\n\n"
                "Best Regards,\nAITS Support Team",
                'admin@aits.com',
                [student_email],
                fail_silently=True,
            )