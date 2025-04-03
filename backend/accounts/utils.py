import random
import datetime
from django.core.mail import send_mail, EmailMessage
from django.contrib import messages
from django.utils.timezone import now
from django.conf import settings
from django.template.loader import render_to_string

def send_verification_email(user):
    """
    Generates a verification code, sets an expiry, and sends it to the user's institutional email.
    Used for registration verification and password reset.
    """
    try:
        # Generate a 6-digit verification code
        verification_code = str(random.randint(100000, 999999))
        user.verification_code = verification_code
        user.verification_expiry = now() + datetime.timedelta(minutes=10)
        user.save()

        # Prepare the email template using the generated verification code
        template = render_to_string('email_template.html', {
            'email': settings.EMAIL_HOST_USER,
            'message': f"Your verification code is: {verification_code}. It expires in 10 minutes."
        })

        subject = "AITS Account Verification Code"

        # Create and send the email
        email_message = EmailMessage(
            subject,
            template,
            settings.EMAIL_HOST_USER,  # Sender email address
            [user.institutional_email]  # Recipient's institutional email
        )
        email_message.fail_silently = False
        email_message.send()  # Actually send the email

        return True

    except Exception as e:
        print(f"[ERROR] Email sending failed: {e}")
        return False

def send_gmail_notification(user, subject, message):
    """Send an email notification to the user's personal Gmail."""
    try:
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,  # Temporary sender email for development
            [user.email],  # sends to gmail for password resets and forgot password
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"[ERROR] Email sending failed: {e}")
        return False
