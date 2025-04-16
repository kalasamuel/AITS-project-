# Generated by Django 5.1.5 on 2025-04-15 15:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='issue',
            name='department',
            field=models.CharField(choices=[('cocis', 'College of Computing and Information Sciences (COCIS)'), ('cedat', 'College of Engineering, Design, Art and Technology (CEDAT)'), ('chuss', 'College of Humanities and Social Sciences (CHUSS)'), ('conas', 'College of Natural Sciences (CONAS)'), ('law', 'School of Law'), ('cobams', 'College of Business and Management Sciences (COBAMS)'), ('cees', 'College of Education and External Studies (CEES)'), ('cahs', 'College of Agricultural and Environmental Sciences (CAES)'), ('chs', 'College of Health Sciences (CHS)'), ('vet', 'College of Veterinary Medicine, Animal Resources and Biosecurity (COVAB)')], default=None, max_length=100),
        ),
        migrations.AlterField(
            model_name='course',
            name='code',
            field=models.CharField(choices=[('BSCS', 'BSCS'), ('BIT', 'BIT'), ('BSE', 'BSE'), ('BBA', 'BBA'), ('LLB', 'LLB'), ('BME', 'BME'), ('BEE', 'BEE'), ('BCE', 'BCE'), ('BFA', 'BFA'), ('BEd', 'BEd'), ('BSc', 'BSc'), ('BPH', 'BPH'), ('BVM', 'BVM'), ('BAG', 'BAG'), ('BNS', 'BNS'), ('BPHARM', 'BPHARM'), ('BDS', 'BDS'), ('BSTAT', 'BSTAT'), ('BPS', 'BPS'), ('BHRM', 'BHRM'), ('BPA', 'BPA'), ('BDEV', 'BDEV'), ('BPSY', 'BPSY'), ('BAS', 'BAS'), ('BAE', 'BAE'), ('BMC', 'BMC'), ('BIS', 'BIS'), ('BENV', 'BENV'), ('BLS', 'BLS'), ('BAGRIC', 'BAGRIC'), ('BFOOD', 'BFOOD'), ('BFORE', 'BFORE'), ('BTOUR', 'BTOUR'), ('BHM', 'BHM'), ('BARCH', 'BARCH'), ('BPLAN', 'BPLAN')], max_length=20, unique=True),
        ),
        migrations.AlterField(
            model_name='course',
            name='name',
            field=models.CharField(choices=[('BSCS', 'Bachelor of Science in Computer Science'), ('BIT', 'Bachelor of Information Technology'), ('BSE', 'Bachelor of Software Engineering'), ('BBA', 'Bachelor of Business Administration'), ('LLB', 'Bachelor of Laws'), ('BME', 'Bachelor of Mechanical Engineering'), ('BEE', 'Bachelor of Electrical Engineering'), ('BCE', 'Bachelor of Civil Engineering'), ('BFA', 'Bachelor of Fine Arts'), ('BEd', 'Bachelor of Education'), ('BSc', 'Bachelor of Science'), ('BPH', 'Bachelor of Public Health'), ('BVM', 'Bachelor of Veterinary Medicine'), ('BAG', 'Bachelor of Agricultural Sciences'), ('BNS', 'Bachelor of Nursing Sciences'), ('BPHARM', 'Bachelor of Pharmacy'), ('BDS', 'Bachelor of Dental Surgery'), ('BSTAT', 'Bachelor of Statistics'), ('BPS', 'Bachelor of Procurement and Supply Chain Management'), ('BHRM', 'Bachelor of Human Resource Management'), ('BPA', 'Bachelor of Public Administration'), ('BDEV', 'Bachelor of Development Studies'), ('BPSY', 'Bachelor of Psychology'), ('BAS', 'Bachelor of Arts in Social Sciences'), ('BAE', 'Bachelor of Arts in Economics'), ('BMC', 'Bachelor of Mass Communication'), ('BIS', 'Bachelor of Information Systems'), ('BENV', 'Bachelor of Environmental Science'), ('BLS', 'Bachelor of Library and Information Science'), ('BAGRIC', 'Bachelor of Agricultural Engineering'), ('BFOOD', 'Bachelor of Food Science and Technology'), ('BFORE', 'Bachelor of Forestry'), ('BTOUR', 'Bachelor of Tourism'), ('BHM', 'Bachelor of Hospitality Management'), ('BARCH', 'Bachelor of Architecture'), ('BPLAN', 'Bachelor of Urban and Regional Planning')], max_length=255),
        ),
        migrations.AlterField(
            model_name='issue',
            name='issue_type',
            field=models.CharField(choices=[('missing_marks', 'Missing Marks'), ('wrong_registration_number', 'Wrong Registration Number'), ('wrong_marks', 'Wrong Marks'), ('other', 'Other')], max_length=50),
        ),
    ]
