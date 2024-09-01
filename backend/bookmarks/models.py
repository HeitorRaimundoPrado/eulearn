from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError

# Create your models here.
class Bookmarkable(models.Model):
    class Meta:
        abstract = True

class BookmarkableObjectField(models.ForeignKey):
    def validate(self, value, model_instance):
        super().validate(value, model_instance)
        if not isinstance(value, Bookmarkable):
            raise ValidationError("The content object must be a bookmarkable object.")

class Bookmark(models.Model):
    object_id = models.PositiveIntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_object = GenericForeignKey()
    content_type = BookmarkableObjectField(ContentType, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'object_id', 'content_type')
