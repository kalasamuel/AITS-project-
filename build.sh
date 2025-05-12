#!/usr/bin/env bash

if [ ! -f "/app/backend/staticfiles/reactapp/index.html" ]; then

    echo COLLECTING STATIC FILES... && python manage.py collectstatic --noinput
    echo RUNNING MIGRATIONS... && python manage.py makemigrations &&  python manage.py migrate
    
    mv /app/frontend/dist /app/backend/staticfiles/reactapp

fi

echo SPINING UP SERVER...

# Dynamically assigned by heroku
python manage.py runserver 0.0.0.0:${PORT}