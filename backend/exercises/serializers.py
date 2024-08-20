from rest_framework import serializers
from .models import Test, Answer, Question, QuestionVotes, TestVotes


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['content', 'content_img_url', 'is_correct']



class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, context={'skip_question_validation': True })

    class Meta:
        model = Question
        fields = '__all__'

    def create(self, validated_data):
        answer_data = validated_data.pop('answers')
        question = Question.objects.create(**validated_data)

        for answer in answer_data:
            Answer.objects.create(question=question, **answer)

        return question



class TestSerializer(serializers.ModelSerializer):
    question_set = QuestionSerializer(many=True)

    class Meta:
        model = Test
        fields = "__all__"

class QuestionVotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionVotes
        fields = '__all__'


class TestVotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestVotes
        fields = '__all__'
