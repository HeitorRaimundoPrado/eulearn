from rest_framework import serializers
from .models import ForumPost, Subject, Votes, PostAttachment
from django.http import FileResponse, Http404
from django.conf import settings
import boto3
from botocore.exceptions import NoCredentialsError
from django.core.cache import cache

class PostAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostAttachment
        fields = ['file', 'uploaded_at', 'post']

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumPost
        fields = ['title', 'content', 'parent_post', 'private', 'community', 'id', 'subject']

class PostDetailSerializer(serializers.ModelSerializer):
    net_votes = serializers.SerializerMethodField()
    attachments = PostAttachmentSerializer(many=True)
    answers = serializers.PrimaryKeyRelatedField(many=True, queryset=ForumPost.objects.all(), required=False)

    class Meta:
        model = ForumPost
        fields = '__all__'

    def get_net_votes(self, obj):
        cache_key = f'net_votes_{obj.id}'
        return cache.get(cache_key, 0)

    def get_answers(self, obj):
        return ForumPost.objects.filter(parent_post=obj).all()


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class VotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Votes
        fields = ['positive', 'post']

class VotesDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Votes
        fields = '__all__'



