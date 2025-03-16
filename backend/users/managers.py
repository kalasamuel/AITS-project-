from django.contrib.auth.base_user import BaseUserManager #BaseUserManager provide tool basic functionality for managing users
from django.core.exceptions import ValidationError #for handling errors e.g when something goes wrong (like an invalid email), we'll use this to tell the user what happened
from django.core.validators import validate_email #imports a function that checks if an email address is in the correct format
from django.utils.translation import gettext_lazy as al #for making my application support multiple languages. al allows you to mark text that should be translated later

class CustomUserManager(BaseUserManager):
    def email_validator(self, email):
        """this function takes an email address as input and checks if it's valid"""
        try:
            validate_email(email)
        except:
            raise ValueError(al("You must provide a valid email"))
        
    def create_user(self, first_name, last_name, email, password, **extrafields):
        if not first_name:
            raise ValueError(al("Users must submit a first name"))
        if not last_name:
            raise ValueError(al("Users must submit a last name"))
        if email:
            email=self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(al("BaseUser:and email address is required"))
        
        user = self.model(
            first_name = first_name,
            last_name = last_name,
            email = email,
            **extra_fields
        )

        user.set_password(password)
        extra_fields.setdefault("is_staff",False)
        extra_fields.setdefault("is_superuser",False)

        user.save()

        return user

            
    def create_superuser(self, first_name, last_name, email, password, **extrafields):
        extra_fields.setdefault("is_staff",True)
        extra_fields.setdefault("is_superuser",True)
        extra_fields.setdefault("is_active",True)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError(al("Superusers must have is_superuser=True"))
        
        if extra_fields.get("is_staff") is not True:
            raise ValueError(al("Superusers must have is_staff=True"))

        if not password:
            raise ValueError(al("Superusers must have a password"))
        if email:
            email=self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(al("Admin User:and email address is required"))
   
        user = self.create_user(first_name, last_name, email, password, **extrafields)
        user.save()
        
        return user
