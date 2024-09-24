from typing import List
from django.db.models.base import ModelBase
from django.db.models import QuerySet
from django.http import JsonResponse
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.serializers import Serializer
from bookmarks.models import Bookmark
from bookmarks.serializers import BookmarkSerializer
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from subjects.models import ForumPost
from exercises.models import Question, Test
from rest_framework import status

# Create your views here.
class BookmarkListView(generics.ListCreateAPIView):
    serializer_class = BookmarkSerializer

    def get_permissions(self) -> List:
        if self.request.method == "POST":
            return [IsAuthenticated()]


        return [AllowAny()]
    
    def get_queryset(self) -> QuerySet[Bookmark]:
        queryset =  Bookmark.objects.filter(user=self.request.user).all()
        return queryset

        



class UserBookmarkDetailView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        models: dict[str, ModelBase] = {
            'test': Test,
            'question': Question,
            'post': ForumPost
        }

        content_type = models.get(request.query_params.get('content_type'))

        if not content_type:
            return JsonResponse({
                "detail": "Couldn't find the type of bookmark specified"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        content_type = ContentType.objects.get_for_model(content_type).id
        object_id = request.query_params.get('object_id')


        try:
            bookmark = Bookmark.objects.get(
                user=request.user,
                content_type_id=content_type,
                object_id=object_id
            )

        except Bookmark.DoesNotExist:
            return Response({"detail": "Bookmark not found."}, status=status.HTTP_404_NOT_FOUND)

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

        
        content_type = models.get(request.query_params.get('content_type', ''))

        import json
        
        if not content_type:
            return Response(json.dumps({
                "detail": "Couldn't find the type of bookmark specified"
            }), status=status.HTTP_400_BAD_REQUEST)
        

        content_type_id = ContentType.objects.get_for_model(content_type).id
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

