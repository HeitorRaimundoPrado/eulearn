from rest_framework import serializers
from .models import ForumPost, Subject, Votes

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumPost
        fields = ['title', 'content', 'parent_post', 'private', 'community', 'id']

class PostDetailSerializer(serializers.ModelSerializer):
    net_votes = serializers.IntegerField()
    class Meta:
        model = ForumPost
        fields = '__all__'

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
