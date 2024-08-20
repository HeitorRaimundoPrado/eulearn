from django.urls import path, include
from .views import PostListView, SubjectListView, VotesView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'posts', PostListView, basename='post')

urlpatterns = [
    path('', include(router.urls), name='post-list'),
    path('subjects/', SubjectListView.as_view(), name="subjects-list"),
    path('votes/', VotesView.as_view(), name="votes")
]
