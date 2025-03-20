from django.db import models
from accounts.models import CustomUser, Student, Lecturer, AcademicRegistrar, Department # Import user models

class Issue(models.Model):
    """
    Represents an issue in the system.
    """
    STATUS_CHOICES = [
    ('open', 'Open'),
    ('in_progress', 'In Progress'),
    ('resolved', 'Resolved'),
    ]
    
    issue_id = models.AutoField(primary_key=True)
    issue_type = models.CharField(max_length=255)
    Description = models.TextField()
    support_file = models.FileField(upload_to='issue_support_files/', blank=True, null=True)
    Status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='open')
    Created_at = models.DateTimeField(auto_now_add=True)
    Updated_at = models.DateTimeField(auto_now=True)
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'student'}, null=True, blank=True, related_name='student_issues')
    Lecturer = models.ForeignKey(Lecturer, on_delete=models.SET_NULL, null=True, blank=True, related_name='lecturer_issues')
    Registrar = models.ForeignKey(AcademicRegistrar, on_delete=models.SET_NULL, null=True, blank=True, related_name='registrar_issues')
    Department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='department_issues') # Categorization
    assigned_to = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, limit_choices_to={'role': 'lecturer'}, null=True, blank=True, related_name='assigned_issues')


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
    Recipient = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True,related_name='notifications')

    def __str__(self):
        return f"Notification {self.Notification_ID}: {self.Message[:50]}..."

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        
class Course(models.Model):
    name = models.CharField(max_length=255)
    course_code = models.CharField(max_length=20, unique=True)
    lecturer = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, limit_choices_to={'role': 'lecturer'}) 
    department=models.ForeignKey(Department,on_delete=models.CASCADE) #links to department

    def __str__(self):
        return f"{self.course_code}=> {self.name}"
    
class Assignment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.course.course_code})"
#links student (from CustomUser) to a course
class Enrollment(models.Model):
    student=models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role':'student'})
    course=models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at=models.DateTimeField(auto_now_add=True) # automatically records the time
    
    def __str__(self):
        return f"{self.student.last_name} {self.student.first_name} enrolled in {self.course.name}"
    
    class Meta:
        unique_together = ('student', 'course') #ensure no duplictae enrollments