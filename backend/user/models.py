from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    rating = models.DecimalField(max_digits=10, decimal_places=2, default=1000, editable=False)
    institution = models.CharField(50)
    bio = models.CharField(200)
    avatar_url = models.CharField(300)

