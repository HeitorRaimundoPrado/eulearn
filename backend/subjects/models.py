from django.db import models
from django.contrib.auth.models import User
import uuid
import string

# Create your models here.
class Subject(models.Model):
    description = models.TextField()
    name = models.CharField(max_length=50)
    route = models.UUIDField(default=uuid.uuid4, unique=True)

class Forum(models.Model):
    description = models.TextField()
    is_social = models.BooleanField()

class ForumPost(models.Model):
    title = models.CharField(max_length=100, blank=True)
    content = models.TextField()
    parent_post = models.ForeignKey('self', on_delete=models.CASCADE, null=True)
    author_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    route = models.UUIDField(unique=True, default=uuid.uuid4)

class Votes(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="votes")
    positive = models.BooleanField()
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE, related_name="votes")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'post'], name='unique_post_user')
        ]
