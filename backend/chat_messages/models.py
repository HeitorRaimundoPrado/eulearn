from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class Message(models.Model):
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    room_name = models.CharField(max_length=50)

class Attachment(models.Model):
    message = models.ForeignKey(Message, related_name="attachments", on_delete=models.CASCADE)
    file = models.FileField(upload_to='message_attachments/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
