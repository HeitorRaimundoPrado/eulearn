from django.urls import path, include 
from .views.main import QuestionListView, CheckAnswerView, QuestionRetrieveView, TestRetrieveView, TestListView, check_test, check_question
from .views.votes import QuestionVotesCreateView, TestVotesCreateView

urlpatterns = [
    path('questions/', QuestionListView.as_view(), name='question-list'),
    path('question/<int:pk>', QuestionRetrieveView.as_view(), name='question-get'),
    path('test/<int:pk>', TestRetrieveView.as_view(), name='test-get'),
    path('tests/', TestListView.as_view(), name='test-list'),
    path('answer/<int:pk>', CheckAnswerView.as_view(), name='answer-get'),
    path('check-test/<int:test_id>', check_test, name='check-test'),
    path('check-answer/<int:question_id>', check_question, name='check-question'),
    path('question-vote/', QuestionVotesCreateView.as_view(), name='create-question-vote'),
    path('test-vote/', TestVotesCreateView.as_view(), name='create-test-vote'),
]
