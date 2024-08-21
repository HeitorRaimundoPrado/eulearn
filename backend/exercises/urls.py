from django.urls import path, include
from .views import QuestionListView, CheckAnswerView

urlpatterns = [
    path('questions/', QuestionListView.as_view(), name='question-list'),
    path('answers/<int:pk>', CheckAnswerView.as_view(), name='answer-get')
]
