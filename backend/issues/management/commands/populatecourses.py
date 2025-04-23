from django.core.management.base import BaseCommand
from issues.models import Course, COURSES, COURSE_CODES

class Command(BaseCommand):
    help = 'Populates the Course model with predefined Makerere University courses'

    def handle(self, *args, **options):
        added = 0
        for code, _ in COURSE_CODES:
            name = dict(COURSES).get(code, code)
            course, created = Course.objects.get_or_create(code=code, name=name)
            if created:
                added += 1
                self.stdout.write(self.style.SUCCESS(f"Added: {code} - {name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Exists: {code} - {name}"))

        self.stdout.write(self.style.SUCCESS(f"\nFinished populating. Total new courses added: {added}"))
