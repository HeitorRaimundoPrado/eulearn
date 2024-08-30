from django.db import models
from django.http import JsonResponse, HttpResponse
from django.core.cache import cache
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from exercises.models import Question, Answer, Test, QuestionVotes, TestVotes
from exercises.serializers import QuestionSerializer, AnswerSerializer, TestCreateSerializer, TestRetrieveSerializer, QuestionSerializerNoExplanation, QuestionVotesSerializer
from exercises.utils import calculate_pq, calculate_rd
from communities.permissions import IsMemberOfCommunity
import json

# Create your views here.
class QuestionListView(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer
    def get_queryset(self):
        queryset = Question.objects.all()
        subj_id = self.request.query_params.get('subject', None)

        if subj_id:
            queryset = queryset.filter(subject=subj_id)

        return queryset

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]

        return [AllowAny()]


class QuestionRetrieveView(generics.RetrieveAPIView):
    queryset = Question.objects.all()

    def get_serializer_class(self):
        return QuestionSerializer


class QuestionVotesCreateView(generics.CreateAPIView):
    queryset = QuestionVotes.objects.all()
    serializer_class = QuestionVotesSerializer
    def get_permissions(self):
        question_id = self.request.data.get('question')
        question = Question.objects.get(id=question_id)

        if question.community:
            return [IsMemberOfCommunity()]

        return [IsAuthenticated()]


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


def check_test(request, test_id):
    """
    Expects an object with each question id as a key and the respective answer id pointed by the user in the body
    Expects the test_id as a dynamic route parameter
    Returns an object with each question id as a key and the attributes:
    correct: boolean -> True if the answer pointed by the user is correct, False otherwise
    explanation: str -> explanation for the question
    user_ans: str -> content of the answer pointed by the user
    correct_ans: int -> id of the correct answer for the question
    """

    body = json.loads(request.body)
    res_list = []

    user_prof = request.user.profile

    test = Test.objects.get(id=test_id)

    for question_id, answer_id in body.items():
        Pq = calculate_pq(question_id)
        RD = calculate_rd(user_prof.rating, Pq)

        res_dict = dict()

        try:
            question = Question.objects.only('answers', 'explanation').get(pk=question_id)

            if not question in test.questions.all():
                return Response({"detail": "You sent a question that is not part of the test"}, status=status.HTTP_400_BAD_REQUEST)


            res_dict['explanation'] = question.explanation

            if not cache.get(f'correct_answers_{question_id}'):
                cache.set(f'correct_answers_{question_id}', 0, timeout=None)

            if not cache.get(f'incorrect_answers_{question_id}'):
                cache.set(f'incorrect_answers_{question_id}', 0, timeout=None)

            flag = False
            for a in question.answers.all():
                if a.id == int(answer_id):
                    flag = True

                if a.is_correct:
                    if a.id == int(answer_id):
                        res_dict['correct'] = True

                    res_dict['correct_ans'] = a.id

            if not flag:
                return Response({"detail": "You sent an answer that is not part of the question"}, status=status.HTTP_400_BAD_REQUEST)

            if not 'correct' in res_dict:
                res_dict['correct'] = False
                if request.user.questions_answered.filter(id=question_id).exists():
                    res_dict['already_answered'] = True

                else:
                    from decimal import Decimal
                    user_prof.rating -= Decimal(0.8) * RD
                    cache.incr(f'incorrect_answers_{question_id}', 1)

            else:
                if request.user.questions_answered.filter(id=question_id).exists():
                    res_dict['already_answered'] = True

                else:
                    cache.incr(f'correct_answers_{question_id}', 1)
                    user_prof.rating += RD


            user_prof.save()

            question.answered_by.add(request.user)
            ans = Answer.objects.only('content').get(pk=answer_id)
            if not 'already_answered' in res_dict:
                res_dict['already_answered'] = False
            res_dict['user_ans'] = ans.content
            res_dict['question'] = question_id
            res_list.append(res_dict)

        except Question.DoesNotExist:
            return Response({"detail": "You sent a question that is not part of the test" }, status=status.HTTP_400_BAD_REQUEST)

    return JsonResponse({ 'test_result': res_list, 'new_rating': user_prof.rating })

def check_question(request, question_id):
    body = json.loads(request.body)

    answer_id = body.get('answer_id')
    Pq = calculate_pq(question_id)
    RD = calculate_rd(user_prof.rating, Pq)

    res_dict = dict()

    question = Question.objects.only('answers', 'explanation').get(pk=question_id)
    res_dict['explanation'] = question.explanation

    if not cache.get(f'correct_answers_{question_id}'):
        cache.set(f'correct_answers_{question_id}', 0, timeout=None)

    if not cache.get(f'incorrect_answers_{question_id}'):
        cache.set(f'incorrect_answers_{question_id}', 0, timeout=None)

    for a in question.answers.all():
        if a.is_correct:
            if a.id == int(answer_id):
                res_dict['correct'] = True

            res_dict['correct_ans'] = a.id


    if not 'correct' in res_dict:
        res_dict['correct'] = False
        if request.user.questions_answered.filter(id=question_id).exists():
            res_dict['already_answered'] = True

        else:
            from decimal import Decimal
            user_prof.rating -= Decimal(0.8) * RD
            cache.incr(f'incorrect_answers_{question_id}', 1)

    else:
        if request.user.questions_answered.filter(id=question_id).exists():
            res_dict['already_answered'] = True

        else:
            cache.incr(f'correct_answers_{question_id}', 1)
            user_prof.rating += RD


    user_prof.save()

    question.answered_by.add(request.user)
    ans = Answer.objects.only('content').get(pk=answer_id)
    if not 'already_answered' in res_dict:
        res_dict['already_answered'] = False
    res_dict['user_ans'] = ans.content
    res_dict['question'] = question_id
    return JsonRespose(res_dict, status=status.HTTP_200_OK)


