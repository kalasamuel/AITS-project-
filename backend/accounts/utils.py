import random
import datetime
from django.core.mail import send_mail
from django.utils.timezone import now
from django.conf import settings

def send_verification_email(user, subject):
    """
    Generates a verification code, sets an expiry, and sends it to the user's institutional email.
    Used for registration verification and password reset.
    """
    try:
        # Generate 6-digit verification code
        verification_code = str(random.randint(100000, 999999))
        user.verification_code = verification_code
        user.verification_expiry = now() + datetime.timedelta(minutes=10)
        user.save()

        # Email content
        email_message = f"Your verification code is: {verification_code}. It expires in 10 minutes."

        # Send email
        send_mail(
            subject,
            email_message,
            settings.EMAIL_HOST_USER,  # aits.mak.ac@gmail.com is the email sender
            [user.institutional_email],  #email receiver
            fail_silently=False,
        )
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
