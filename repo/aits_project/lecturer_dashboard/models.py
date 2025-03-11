from django.db import models


class Lecturer(models.Model):
    lecturer_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    password = models.CharField(max_length=255)
#fn
    def __str__(self):
        return self.name

