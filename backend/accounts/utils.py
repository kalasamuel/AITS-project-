from django.core.mail import send_mail
from django.conf import settings

def send_verification_email(institutional_email, code):
    """
    Sends verification code to the user's institutional email.
    """
    subject = "AITS Verification Code"
    message = f"Your verification code is: {code}. Enter this code to activate your account."
    sender = settings.EMAIL_HOST_USER

    send_mail(subject, message, sender, [institutional_email], fail_silently=False)

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
