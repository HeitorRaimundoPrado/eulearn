from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Question, Answer
from .serializers import QuestionSerializer, AnswerSerializer

# Create your views here.
class QuestionListView(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]

        return [AllowAny()]

    def get_queryset(self):
        queryset = Question.objects.all()
        
        if not self.request.query_params.get('get_explanation', '0') == '1':
            queryset = queryset.defer('explanation')

        else:
            queryset = queryset.values('explanation')

        route = self.request.query_params.get('route')
        if route: 
            queryset = queryset.filter(route=route)

        return queryset

class CheckAnswerView(generics.RetrieveAPIView):
    queryset = Answer.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = AnswerSerializer


