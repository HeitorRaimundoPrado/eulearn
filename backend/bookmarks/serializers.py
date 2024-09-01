from rest_framework import serializers
from .models import Bookmark
from subjects.models import ForumPost
from subjects.serializers import PostSerializer
from exercises.models import Test, Question
from exercises.serializers import QuestionSerializerNoExplanation, TestMinimalSerializer
from django.contrib.contenttypes.models import ContentType

class BookmarkSerializer(serializers.ModelSerializer):
    content_object = serializers.SerializerMethodField()
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Bookmark
        fields = ['id', 'user', 'content_object', 'content_type', 'object_id']

    def to_internal_value(self, data):
        models = {
            'test': Test,
            'question': Question,
            'post': ForumPost
        }

        content_type = data.pop('content_type')
        data['content_type'] = ContentType.objects.get_for_model(models.get(content_type)).id
        return super().to_internal_value(data)

    def validate(self, data):
        print("calling validate")
        return data


    def get_content_object(self, obj):
        serializers = {
                ForumPost: PostSerializer,
                Test: TestMinimalSerializer,
                Question: QuestionSerializerNoExplanation
        }
        serializer_class = serializers.get(obj.content_type.model_class())
        if serializer_class:
            serializer = serializer_class(obj.content_object)
            return serializer.data

        raise serializers.ValidationError(f"No serializer found for {obj.content_type.model_class()}")


