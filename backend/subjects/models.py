from django.db import models
from django.contrib.auth.models import User
import random
import string

def generate_unique_slug():
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=12))

# Create your models here.
class Subject(models.Model):
    description = models.TextField()
    name = models.CharField(max_length=50)
    route = models.CharField(max_length=50)

class Forum(models.Model):
    description = models.TextField()
    is_social = models.BooleanField()

class ForumPost(models.Model):
    title = models.CharField(max_length=100, blank=True)
    content = models.TextField()
    parent_post = models.ForeignKey('self', on_delete=models.CASCADE, null=True)
    author_id = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now_add=True)
    url = models.CharField(unique=True, default=generate_unique_slug)
    votes = models.IntegerField(default=0)

