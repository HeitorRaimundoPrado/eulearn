from django.urls import path, include
from .views import PostListView, SubjectListView, VotesView, SubjectRetrieveView, PostRetrieveView, PostAttachmentUploadView, download_file
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'posts', PostListView, basename='post')

urlpatterns = [
    path('', include(router.urls), name='post-list'),
    path('subjects/', SubjectListView.as_view(), name="subjects-list"),
    path('subject/<int:pk>', SubjectRetrieveView.as_view(), name='subject-get'),
    path('post/<int:pk>', PostRetrieveView.as_view(), name='post-get'),
    path('post-attachment/', PostAttachmentUploadView.as_view(), name='post-attachment-post'),
    path('votes/', VotesView.as_view(), name="votes"),
    path('uploads/<str:file_key>', download_file, name="download-file")
]
