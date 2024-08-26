from django.db import models
from django.db.models.functions import Coalesce
from django.db.models import F, Count, Max, Func, Value, Q
from django.http import JsonResponse
from django.core.cache import cache
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Question, Answer, Test, QuestionVotes, TestVotes
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
        
        user_prof = request.user.profile

        correct_answers = cache.get('correct_answers_{question_id}', 0)
        incorrect_answers = cache.get('incorrect_answers_{question_id}', 0)

        CIMax = cache.get("ci_max", 1)

        CIq = incorrect_answers / max(correct_answers, 1)
        if CIq > CIMax:
            CIMax = CIq
            cache.set('ci_max', CIq)

        NVMax = QuestionVotes.objects.values('question').annotate(
            positive_count=Count('id', filter=Q(positive=True)),
            negative_count=Count('id', filter=Q(positive=False))
        ).annotate(
            ratio=Coalesce(F('positive_count'), Value(1)) / Coalesce(F('negative_count'), Value(1))
        ).aggregate(Max('ratio'))['ratio__max'] or 1

        votes_for_question = QuestionVotes.objects.filter(question=question)
        positive_votes_q = votes_for_question.filter(positive=True).count()
        negative_votes_q = votes_for_question.filter(positive=False).count()

        NVq = positive_votes_q / max(negative_votes_q, 1)

        import math
        print(NVq)
        print(NVMax)
        print(CIq)
        print(CIMax)

        Pq = max(100 * math.sqrt(NVq) / math.sqrt(NVMax) * math.sqrt(CIq) / math.sqrt(CIMax), 10)

        print(Pq)
        PUmax = cache.get('pu_max', 1000)
        Pu = user_prof.rating

        from decimal import Decimal

        RD = Decimal(Pq) * (Decimal(1) - Decimal(Pu) / Decimal(PUmax) * Decimal(0.95) + Decimal(1))

        print(RD)

        
        res_dict['explanation'] = question.explanation
        for a in question.answers.all():
            if a.is_correct:
                if a.id == int(answer_id):
                    res_dict['correct'] = True

                res_dict['correct_ans'] = a.id

        if not 'correct' in res_dict:
            res_dict['correct'] = False
            user_prof.rating -= Decimal(0.8) * RD

        else:
            user_prof.rating += RD

        user_prof.save()

        ans = Answer.objects.only('content').get(pk=answer_id)
        res_dict['user_ans'] = ans.content
        res_dict['question'] = question_id
        res_list.append(res_dict)

    return JsonResponse({ 'test_result': res_list, 'new_rating': user_prof.rating })

