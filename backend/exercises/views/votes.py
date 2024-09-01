
from rest_framework import generics
from exercises.models import QuestionVotes, TestVotes, Test, Question
from exercises.serializers import QuestionVotesSerializer, TestVotesSerializer
from communities.permissions import IsMemberOfCommunity
from rest_framework.permissions import IsAuthenticated

class QuestionVotesCreateView(generics.CreateAPIView):
    queryset = QuestionVotes.objects.all()
    serializer_class = QuestionVotesSerializer
    def get_permissions(self):
        question_id = self.request.data.get('question')
        question = Question.objects.get(id=question_id)

        if question.community:
            return [IsMemberOfCommunity()]

        return [IsAuthenticated()]

class TestVotesCreateView(generics.CreateAPIView):
    queryset = TestVotes.objects.all()
    serializer_class = TestVotesSerializer
    def get_permissions(self):
        test_id = self.request.data.get('test')
        test = Test.objects.get(id=test)

        if question.community:
            return [IsMemberOfCommunity()]

        return [IsAuthenticated()]
