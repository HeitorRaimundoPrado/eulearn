from django.db import models
from django.http import JsonResponse
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Question, Answer, Test
from .serializers import QuestionSerializer, AnswerSerializer, TestCreateSerializer, TestRetrieveSerializer, QuestionSerializerNoExplanation
import json

# Create your views here.
class QuestionListView(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]

        return [AllowAny()]


class QuestionRetrieveView(generics.RetrieveAPIView):
    queryset = Question.objects.all()

    def get_serializer_class(self):

        if self.request.query_params.get('get_explanation', '0') != '1':
            return QuestionSerializerNoExplanation

        return QuestionSerializer

class TestListView(generics.ListCreateAPIView):
    def get_queryset(self):
        return Test.objects.prefetch_related(
            models.Prefetch('questions', queryset=Question.objects.defer('explanation'))
        )

    def get_serializer_class(self):
        if self.request.method == "GET":
            return TestRetrieveSerializer

        return TestCreateSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]

        return [AllowAny()]


class TestRetrieveView(generics.RetrieveAPIView):
    queryset = Test.objects.all()
    serializer_class = TestRetrieveSerializer

class CheckAnswerView(generics.RetrieveAPIView):
    queryset = Answer.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = AnswerSerializer


def check_test(request):
    """
    Expects an object with each question id as a key and the respective answer id pointed by the user
    Returns an object with each question id as a key and the attributes:
    correct: boolean -> True if the answer pointed by the user is correct, False otherwise
    explanation: str -> explanation for the question
    user_ans: str -> content of the answer pointed by the user
    correct_ans: int -> id of the correct answer for the question
    """

    body = json.loads(request.body)
    res_list = []

    for question_id, answer_id in body.items():
        res_dict = dict()
        question = Question.objects.only('answers', 'explanation').get(pk=question_id)
        res_dict['explanation'] = question.explanation
        for a in question.answers.all():
            if a.is_correct:
                if a.id == int(answer_id):
                    res_dict['correct'] = True

                res_dict['correct_ans'] = a.id

        if not 'correct' in res_dict:
            res_dict['correct'] = False

        ans = Answer.objects.only('content').get(pk=answer_id)
        res_dict['user_ans'] = ans.content
        res_dict['question'] = question_id
        res_list.append(res_dict)

    return JsonResponse({ 'test_result': res_list})

