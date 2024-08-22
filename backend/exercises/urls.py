from django.urls import path, include 
from .views import QuestionListView, CheckAnswerView, QuestionRetrieveView, TestRetrieveView, TestListView, check_test

urlpatterns = [
    path('questions/', QuestionListView.as_view(), name='question-list'),
    path('question/<int:pk>', QuestionRetrieveView.as_view(), name='question-get'),
    path('test/<int:pk>', TestRetrieveView.as_view(), name='test-get'),
    path('tests/', TestListView.as_view(), name='test-list'),
    path('answer/<int:pk>', CheckAnswerView.as_view(), name='answer-get'),
    path('check-test/', check_test, name='check-test')
]
