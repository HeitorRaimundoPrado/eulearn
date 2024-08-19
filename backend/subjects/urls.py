from django.urls import path
from .views import PostListView, SubjectListView

urlpatterns = [
    path('posts/', PostListView.as_view(), name='post-list'),
    path('subjects/', SubjectListView.as_view(), name="subjects-list")
]
