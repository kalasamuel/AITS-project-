from django.test import TestCase

# Create your tests here.
from django.test import TestCase
from django.core.mail import outbox
from accounts.models import CustomUser
from issue_tracking.models import Course, Issue, Notification, Assignment, Enrollment
from issue_tracking.serializers import IssueSerializer, CourseSerializer, EnrollmentSerializer, AssignmentSerializer

class ModelTestCase(TestCase):
    def setUp(self):
        self.lecturer = CustomUser.objects.create_user(email='lecturer@example.com', role='lecturer', password='testpass')
        self.student = CustomUser.objects.create_user(email='student@example.com', role='student', password='testpass')
        self.registrar = CustomUser.objects.create_user(email='registrar@example.com', role='registrar', password='testpass')
        
        self.course = Course.objects.create(name='Data Structures', code='DSA101', assigned_lecturer=self.lecturer)
        self.issue = Issue.objects.create(
            issue_type='missing_marks',
            description='My marks are missing for the final exam.',
            status='open',
            course=self.course,
            student=self.student,
            assigned_to=self.lecturer
        )
        self.assignment = Assignment.objects.create(course=self.course, title='Assignment 1', due_date='2025-05-01', assignment_id='A1')
        self.enrollment = Enrollment.objects.create(student=self.student, course=self.course)
    
    def test_course_creation(self):
        self.assertEqual(self.course.name, 'Data Structures')
        self.assertEqual(self.course.code, 'DSA101')
        self.assertEqual(self.course.assigned_lecturer, self.lecturer)
    
    def test_issue_creation(self):
        self.assertEqual(self.issue.issue_type, 'missing_marks')
        self.assertEqual(self.issue.description, 'My marks are missing for the final exam.')
        self.assertEqual(self.issue.status, 'open')
        self.assertEqual(self.issue.student, self.student)
        self.assertEqual(self.issue.assigned_to, self.lecturer)
    
    def test_notification_creation(self):
        notification = Notification.objects.create(message='New issue reported', issue=self.issue, recipient=self.registrar)
        self.assertEqual(notification.message, 'New issue reported')
        self.assertEqual(notification.issue, self.issue)
        self.assertEqual(notification.recipient, self.registrar)
    
    def test_assignment_creation(self):
        self.assertEqual(self.assignment.title, 'Assignment 1')
        self.assertEqual(self.assignment.course, self.course)
    
    def test_enrollment_creation(self):
        self.assertEqual(self.enrollment.student, self.student)
        self.assertEqual(self.enrollment.course, self.course)
    
    def test_issue_creation_sends_email(self):
        self.assertEqual(len(outbox), 2)  # One email to registrar, one to student
        self.assertIn('New Issue Submitted', outbox[0].subject)
        self.assertIn('Issue Submitted Successfully', outbox[1].subject)
    
    def test_issue_resolution_sends_email(self):
        self.issue.status = 'resolved'
        self.issue.save()
        self.assertEqual(len(outbox), 3)  # Additional email sent upon resolution
        self.assertIn('Issue Resolved', outbox[2].subject)
    
    def test_issue_serializer(self):
        serializer = IssueSerializer(instance=self.issue)
        self.assertEqual(serializer.data['issue_type'], 'missing_marks')
        self.assertEqual(serializer.data['description'], 'My marks are missing for the final exam.')
    
    