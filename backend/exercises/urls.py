from django.urls import path, include
from .views import QuestionListView

urlpatterns = [
    path('questions/', QuestionListView.as_view(), name='question-list'),
]
