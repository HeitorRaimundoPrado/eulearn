from django.db import models
from django.db.models import Q
from django.db.models.constraints import CheckConstraint
from django.contrib.auth.models import User
from subjects.models import Subject
from communities.models import Community
from bookmarks.models import Bookmarkable

# Create your models here.
class Test(Bookmarkable):
    title = models.CharField(max_length=80)
    author = models.ForeignKey(User, related_name="tests", on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    subject = models.ForeignKey(Subject, related_name="tests", on_delete=models.CASCADE, null=True, blank=True)
    community = models.ForeignKey(Community, related_name="tests", on_delete=models.CASCADE, null=True, blank=True)
    theme = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        constraints = [
            CheckConstraint(
                check=(
                    (Q(subject__isnull=False) & Q(community__isnull=True)) |
                    (Q(subject__isnull=True) & Q(community__isnull=False))
                ),
                name="test_subject_or_community_constraint"
            ),

            CheckConstraint(
                check=(
                    Q(subject__isnull=False) | Q(theme__isnull=True)
                ),
                name="test_theme_only_in_community_constraint"
            )
        ]

class Question(Bookmarkable):
    tests = models.ManyToManyField(Test, blank=True, related_name="questions")
    statement = models.TextField(blank=True, null=True)
    statement_img_url = models.CharField(max_length=80, blank=True, null=True)
    author = models.ForeignKey(User, related_name="questions_authored", on_delete=models.SET_NULL, null=True)
    explanation = models.TextField(blank=True, null=True)
    community = models.ForeignKey(Community, blank=True, null=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    subject = models.ForeignKey(Subject, related_name="questions", on_delete=models.CASCADE, null=True, blank=True)
    answered_by = models.ManyToManyField(User, related_name="questions_answered")
    theme = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        constraints = [
            CheckConstraint(
                check=(
                    (Q(statement__isnull=False) & Q(statement_img_url__isnull=True)) |
                    (Q(statement__isnull=True) & Q(statement_img_url__isnull=False))
                ),
                name="statement_or_statement_img_url_constraint"
            ),

            CheckConstraint(
                check=(
                    (Q(subject__isnull=False) & Q(community__isnull=True)) |
                    (Q(subject__isnull=True) & Q(community__isnull=False))
                ),
                name="question_subject_or_community_constraint"
            ),

            CheckConstraint(
                check=(
                    Q(subject__isnull=False) | Q(theme__isnull=True)
                ),
                name="question_theme_only_in_community_constraint"
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

