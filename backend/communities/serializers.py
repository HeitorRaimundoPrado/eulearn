
from rest_framework import serializers
from .models import Community
from subjects.serializers import PostSerializer


class CommunitySerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    posts = PostSerializer(many=True, read_only=True)
    current_user_is_member = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = '__all__'
        read_only_fields = ['users_joined']
        extra_kwargs = {
            'password_hash': {'write_only': True},
        }

    def create(self, data):
        password = data.pop('password')
        community = Community.objects.create(**data)
        community.set_password(password)
        return community

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        request = self.context.get('request')
        
        if request and request.user not in instance.users_joined.all():
            representation.pop('posts')

        return representation

    def get_current_user_is_member(self, obj):
        request = self.context.get('request') 

        user = request.user
        return user in obj.users_joined.all()
