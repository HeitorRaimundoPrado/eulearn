from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Bookmark
from .serializers import BookmarkSerializer
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from subjects.models import ForumPost
from exercises.models import Question, Test
from rest_framework import status

# Create your views here.
class BookmarkListView(generics.ListCreateAPIView):
    serializer_class = BookmarkSerializer
    queryset = Bookmark.objects.all()

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]

        return [AllowAny()]


class UserBookmarkDetailView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        models = {
            'test': Test,
            'question': Question,
            'post': ForumPost
        }

        content_type = ContentType.objects.get_for_model(models.get(request.query_params.get('content_type'))).id
        object_id = request.query_params.get('object_id')


        try:
            bookmark = Bookmark.objects.get(
                user=request.user,
                content_type_id=content_type,
                object_id=object_id
            )

        except Bookmark.DoesNotExist:
            return Response({"detail": "Bookmark not found."}, status=404)

        serializer = BookmarkSerializer(bookmark)
        return Response(serializer.data)



class BookmarkDeleteView(generics.DestroyAPIView):
    queryset = Bookmark.objects.all()
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        models = {
            'test': Test,
            'question': Question,
            'post': ForumPost
        }

        content_type_id = ContentType.objects.get_for_model(models.get(request.query_params.get('content_type'))).id
        object_id = request.query_params.get('object_id')

        try:
            bookmark = Bookmark.objects.get(
                user=request.user,
                content_type_id=content_type_id,
                object_id=object_id
            )
        except Bookmark.DoesNotExist:
            return Response({"detail": "Bookmark not found."}, status=status.HTTP_404_NOT_FOUND)

        bookmark.delete()
        return Response({"detail": "Bookmark deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

