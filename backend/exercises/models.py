from django.db import models
from django.db.models import Q
from django.db.models.constraints import CheckConstraint
from django.contrib.auth.models import User
from subjects.models import Subject
import uuid

# Create your models here.
class Test(models.Model):
    title = models.CharField(max_length=80)
    author = models.ForeignKey(User, related_name="tests", on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    subject = models.ForeignKey(Subject, related_name="tests", on_delete=models.CASCADE)

class Question(models.Model):
    tests = models.ManyToManyField(Test, blank=True)
    statement = models.TextField(blank=True, null=True)
    statement_img_url = models.CharField(max_length=80, blank=True, null=True)
    author = models.ForeignKey(User, related_name="questions", on_delete=models.SET_NULL, null=True)
    route = models.UUIDField(unique=True, editable=False, default=uuid.uuid4)
    explanation = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    subject = models.ForeignKey(Subject, related_name="questions", on_delete=models.CASCADE)

    class Meta:
        constraints = [
            CheckConstraint(
                check=(
                    (Q(statement__isnull=False) & Q(statement_img_url__isnull=True)) |
                    (Q(statement__isnull=True) & Q(statement_img_url__isnull=False))
                ),
                name="statement_or_statement_img_url_constraint"
            )
        ]

class Answer(models.Model):
    content = models.TextField(blank=True, null=True)
    content_img_url = models.CharField(max_length=80, blank=True, null=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="answers")
    is_correct = models.BooleanField()

    class Meta:
        constraints = [
            CheckConstraint(
                check=(
                    (Q(content__isnull=False) & Q(content_img_url__isnull=True)) |
                    (Q(content__isnull=True) & Q(content_img_url__isnull=False))
                ),
                name="content_or_content_img_url_constraint"
            )
        ]

class QuestionVotes(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    positive = models.BooleanField()
    user = models.ForeignKey(User, related_name="question_votes", on_delete=models.CASCADE)

class TestVotes(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    positive = models.BooleanField()
    user = models.ForeignKey(User, related_name="test_votes", on_delete=models.CASCADE)
