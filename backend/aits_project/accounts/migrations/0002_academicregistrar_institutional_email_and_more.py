# Generated by Django 5.1.6 on 2025-03-13 08:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='academicregistrar',
            name='Institutional_Email',
            field=models.EmailField(default='', max_length=254),
        ),
        migrations.AddField(
            model_name='lecturer',
            name='Institutional_Email',
            field=models.EmailField(default='', max_length=254),
        ),
        migrations.AddField(
            model_name='student',
            name='Institutional_Email',
            field=models.EmailField(default='', max_length=254),
        ),
        migrations.AlterField(
            model_name='student',
            name='Department',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='accounts.department'),
        ),
    ]
