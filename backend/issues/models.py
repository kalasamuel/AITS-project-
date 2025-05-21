from django.db import models
from accounts.models import *
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import CustomUser
from django.conf import settings
COURSES = (
    ("BSCS", "Bachelor of Science in Computer Science"), ("BIT", "Bachelor of Information Technology"),
    ("BSE", "Bachelor of Software Engineering"),
    ("BBA", "Bachelor of Business Administration"),
    ("LLB", "Bachelor of Laws"),
    ("BME", "Bachelor of Mechanical Engineering"),
    ("BEE", "Bachelor of Electrical Engineering"),
    ("BCE", "Bachelor of Civil Engineering"),
    ("BFA", "Bachelor of Fine Arts"),
    ("BEd", "Bachelor of Education"),
    ("BSc", "Bachelor of Science"),
    ("BPH", "Bachelor of Public Health"),
    ("BVM", "Bachelor of Veterinary Medicine"),
    ("BAG", "Bachelor of Agricultural Sciences"),
    ("BNS", "Bachelor of Nursing Sciences"),
    ("BPHARM", "Bachelor of Pharmacy"),
    ("BDS", "Bachelor of Dental Surgery"),
    ("BSTAT", "Bachelor of Statistics"),
    ("BPS", "Bachelor of Procurement and Supply Chain Management"),
    ("BHRM", "Bachelor of Human Resource Management"),
    ("BPA", "Bachelor of Public Administration"),
    ("BDEV", "Bachelor of Development Studies"),
    ("BPSY", "Bachelor of Psychology"),
    ("BAS", "Bachelor of Arts in Social Sciences"),
    ("BAE", "Bachelor of Arts in Economics"),
    ("BMC", "Bachelor of Mass Communication"),
    ("BIS", "Bachelor of Information Systems"),
    ("BENV", "Bachelor of Environmental Science"),
    ("BLS", "Bachelor of Library and Information Science"),
    ("BAGRIC", "Bachelor of Agricultural Engineering"),
    ("BFOOD", "Bachelor of Food Science and Technology"),
    ("BFORE", "Bachelor of Forestry"),
    ("BTOUR", "Bachelor of Tourism"),
    ("BHM", "Bachelor of Hospitality Management"),
    ("BARCH", "Bachelor of Architecture"),
    ("BPLAN", "Bachelor of Urban and Regional Planning"),
)
COURSE_CODES = (
    ("BSCS", "BSCS"), ("BIT", "BIT"), ("BSE", "BSE"),
    ("BBA", "BBA"), ("LLB", "LLB"), ("BME", "BME"),
    ("BEE", "BEE"), ("BCE", "BCE"), ("BFA", "BFA"),
    ("BEd", "BEd"), ("BSc", "BSc"), ("BPH", "BPH"),
    ("BVM", "BVM"), ("BAG", "BAG"), ("BNS", "BNS"),
    ("BPHARM", "BPHARM"), ("BDS", "BDS"), ("BSTAT", "BSTAT"),
    ("BPS", "BPS"), ("BHRM", "BHRM"), ("BPA", "BPA"),
    ("BDEV", "BDEV"), ("BPSY", "BPSY"), ("BAS", "BAS"),
    ("BAE", "BAE"), ("BMC", "BMC"), ("BIS", "BIS"),
    ("BENV", "BENV"), ("BLS", "BLS"), ("BAGRIC", "BAGRIC"),
    ("BFOOD", "BFOOD"), ("BFORE", "BFORE"), ("BTOUR", "BTOUR"),
    ("BHM", "BHM"), ("BARCH", "BARCH"), ("BPLAN", "BPLAN"),
)

DEPARTMENT_COURSECODE={
    "cocis": ["BSCS", "BIT", "BSE", "BIS"],
    "cedat": ["BME", "BEE", "BCE", "BARCH", "BPLAN", "BAGRIC"],
    "chuss": ["BAS", "BAE", "BMC", "BLS"],
    "conas": ["BSc", "BSTAT", "BENV"],
    "law": ["LLB"],
    "cobams": ["BBA", "BPS", "BHRM", "BPA", "BDEV"],
    "cees": ["BEd"],
    "cahs": ["BAG", "BFOOD", "BFORE", "BTOUR"],
    "chs": ["BPH", "BNS", "BPHARM", "BDS"],
    "vet": ["BVM"]
}

class Course(models.Model):
    name = models.CharField(max_length=255, choices=COURSES)
    code = models.CharField(max_length=20, choices=COURSE_CODES, unique=True)
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
        ("wrong_registration_number", "Wrong Registration Number"),
        ("wrong_marks", "Wrong Marks"),
        ("other", "Other"),
    )
    DEPARTMENTS = (
        ("cocis", "College of Computing and Information Sciences (COCIS)"),
        ("cedat", "College of Engineering, Design, Art and Technology (CEDAT)"),
        ("chuss", "College of Humanities and Social Sciences (CHUSS)"),
        ("conas", "College of Natural Sciences (CONAS)"),
        ("law", "School of Law"),
        ("cobams", "College of Business and Management Sciences (COBAMS)"),
        ("cees", "College of Education and External Studies (CEES)"),
        ("cahs", "College of Agricultural and Environmental Sciences (CAES)"),
        ("chs", "College of Health Sciences (CHS)"),
        ("vet", "College of Veterinary Medicine, Animal Resources and Biosecurity (COVAB)"),
    )
    STATUS_CHOICES = [
    ('open', 'Open'),
    ('in_progress', 'In Progress'),
    ('resolved', 'Resolved'),
    ('rejected', 'Rejected'),
    ]
    
    issue_id = models.AutoField(primary_key=True)
    issue_type = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(max_length=250)
    support_file = models.FileField(upload_to='issue_support_files/', blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="course_issues")
    department = models.CharField(max_length=100, choices=DEPARTMENTS, default=None)
    student = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'student'},
        null=True, blank=True, related_name="student_issues"
    )
    assigned_to = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, limit_choices_to={'role': 'lecturer'},
        null=True, blank=True, related_name="assigned_issues"
    )

    def __str__(self):
        return f"Issue {self.issue_id}: {self.issue_type}"

    class Meta:
        verbose_name = "Issue"
        verbose_name_plural = "Issues"
        ordering = ['-created_at']  # Show latest issues first

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('issue', 'Issue'),
        ('announcement', 'Announcement'),
        ('reminder', 'Reminder'),
        ('comment', 'Comment'),
        ('event', 'Event'),
        ('finance', 'Finance'),
        ('rejected', 'Rejected'),
        ('general', 'General'),
    ]

    notification_id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='general')
    title = models.CharField(max_length=255, blank=True, null=True)
    message = models.TextField()
    issue = models.ForeignKey(
        'Issue', on_delete=models.CASCADE, related_name='issue_notifications', blank=True, null=True
    )
    link = models.URLField(blank=True, null=True)
    due_date = models.DateTimeField(blank=True, null=True)
    event_date = models.DateTimeField(blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
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
                settings.EMAIL_HOST_USER,
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
                settings.EMAIL_HOST_USER,
                [student_email],
                fail_silently=True,
            )