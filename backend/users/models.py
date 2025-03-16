from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as al
from .managers import CustomUserManager

# Create your models here.

class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(al("First name"), max_length=100)
    last_name = models.CharField(al("Last Name"), max_length=100)
    email = models.EmailField(al("Email Address"), max_length=255, unique=True)
    is_staff = models.BooleanField(default = False)
    is_active = models.BooleanField(default = False)
    date_joined = models.DateTimeField(al(""), auto_now=False, auto_now_add=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = CustomUserManager

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="customuser_set",
        related_query_name="user",
    )

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="customuser_set",
        related_query_name="user",
    )

    class Meta:
        verbose_name = al("User")
        verbose_name_plural = al("Users")

    def __str__(self):
        return self.email
    
    @property
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"   