from rest_framework import serializers
from .models import Bookmark
from subjects.models import ForumPost
from subjects.serializers import PostSerializer
from exercises.models import Test, Question
from exercises.serializers import QuestionSerializerNoExplanation, TestMinimalSerializer
from django.contrib.contenttypes.models import ContentType

models = {
    'test': Test,
    'question': Question,
    'post': ForumPost
}

inv_models = dict()

for key, value in models.items():
    inv_models[value] = key
    
class BookmarkSerializer(serializers.ModelSerializer):
    content_object = serializers.SerializerMethodField()
    content_type = serializers.SerializerMethodField()
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta: # type: ignore
        model = Bookmark
        fields = ['id', 'user', 'content_object', 'content_type', 'object_id']
        

    def to_internal_value(self, data):

        content_type = data.pop('content_type')
        content_type_model = models.get(content_type)
        if not content_type_model:
            return
        
        data['content_type'] = ContentType.objects.get_for_model(content_type_model).id
        return super().to_internal_value(data)

    def validate(self, attrs):
        return attrs


    def get_content_type(self, obj): 
        content_type = ContentType.objects.get_for_id(obj.content_type_id).model_class()
        return inv_models.get(content_type)

    def get_content_object(self, obj):
        serializers_dict = {
                ForumPost: PostSerializer,
                Test: TestMinimalSerializer,
                Question: QuestionSerializerNoExplanation
        }
        serializer_class = serializers_dict.get(obj.content_type.model_class())
        if serializer_class:
            serializer = serializer_class(obj.content_object)
            return serializer.data

        raise serializers.ValidationError(f"No serializer found for {obj.content_type.model_class()}")


