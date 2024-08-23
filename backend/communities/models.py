from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.
class Community(models.Model):
    name = models.CharField(max_length=80)
    description = models.TextField()
    users_joined = models.ManyToManyField(User, related_name='communities_joined')
    private = models.BooleanField()
    password_hash = models.CharField(max_length=255, blank=True, null=True)  # Store hashed password here
    creator = models.ForeignKey(User, related_name='communities_created', on_delete=models.SET_NULL, null=True, blank=True)

    def set_password(self, password):
        from django.contrib.auth.hashers import make_password
        self.password_hash = make_password(password)

    def check_password(self, password):
        from django.contrib.auth.hashers import check_password
        return check_password(password, self.password_hash)


