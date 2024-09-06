from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
User._meta.get_field('email')._unique = True

class UserSettings(models.Model):
    # Notifications
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="settings")
    email_notifications = models.BooleanField(default=False)
    dm_notifications = models.BooleanField(default=True)
    forum_answers_notifications = models.BooleanField(default=True)
    private_community_activity_notifications = models.BooleanField(default=True)

    # Visibility
    blocked_users = models.ManyToManyField(User)

    # Interface
    THEME_CHOICES = {
            "DRK": "Dark",
            "LHT": "Light"
    }

    theme = models.CharField(max_length=3, choices=THEME_CHOICES, default="DRK")
    font_size = models.IntegerField(default=12, validators=[
        MinValueValidator(8),
        MaxValueValidator(32)
    ])

    LANGUAGE_CHOICES = {
            "PT-BR": "Português (Brasil)",
            "EN-US": "English (US)"
    }
    
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, default="PT-BR")


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    rating = models.DecimalField(max_digits=10, decimal_places=2, default=1000, editable=False)
    institution = models.CharField(50)
    bio = models.CharField(200)
    avatar_url = models.FileField(upload_to="pfps", blank=True, null=True, editable=False)

