set -e

# Create the superuser
python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
username = '${DJANGO_SU_NAME}';
email = '${DJANGO_SU_EMAIL}';
password = '${DJANGO_SU_PASSWORD}';
if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
"

# Start Daphne server
daphne backend.asgi:application
