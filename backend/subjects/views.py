from rest_framework import generics, viewsets, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.exceptions import NotFound, ValidationError
from django.db import models
from .models import ForumPost, Subject, Votes
from .serializers import PostSerializer, SubjectSerializer, PostDetailSerializer, VotesSerializer, VotesDetailSerializer

class PostRetrieveView(generics.RetrieveAPIView):
    serializer_class = PostDetailSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = ForumPost.objects.annotate(
            net_votes = models.functions.Coalesce(
                models.Sum(
                    models.Case(
                        models.When(votes__positive=True, then=1),
                        models.When(votes__positive=False, then=-1),
                        output_field=models.IntegerField(),
                    )
                ),
                0
            )
        ).order_by('-created_at')
        
        author = self.request.query_params.get('author_id')
        url = self.request.query_params.get('url')

        if author:
            queryset = queryset.filter(author=author)

        if url:
            queryset = queryset.filter(url=url)

        return queryset

class PostPaginationClass(PageNumberPagination):
    page_size = 40

class PostListView(viewsets.ModelViewSet):
    pagination_class = PostPaginationClass

    def get_queryset(self):
        queryset = ForumPost.objects.annotate(
            net_votes = models.functions.Coalesce(
                models.Sum(
                    models.Case(
                        models.When(votes__positive=True, then=1),
                        models.When(votes__positive=False, then=-1),
                        output_field=models.IntegerField(),
                    )
                ),
                0
            )
        ).order_by('-created_at')
        
        author = self.request.query_params.get('author_id')
        url = self.request.query_params.get('url')

        if author:
            queryset = queryset.filter(author=author)

        if url:
            queryset = queryset.filter(url=url)

        return queryset


    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'update':
            return PostSerializer

        return PostDetailSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]

        return [AllowAny()]

    def perform_create(self, serializer):
        serializer.save(author_id=self.request.user)


class SubjectListView(generics.ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAdminUser()]

        return [AllowAny()]

class SubjectRetrieveView(generics.RetrieveAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class VotesView(generics.ListCreateAPIView):
    queryset = Votes.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return VotesSerializer

        return VotesDetailSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]

        return [AllowAny()]

    
    def perform_create(self, serializer):
        user = self.request.user
        post_id = self.request.data.get('post')
        positive = self.request.data.get('positive')
        
        try:
            post = ForumPost.objects.get(id=post_id)

        except ForumPost.DoesNotExist:
            raise NotFound('Post not found')

        existing_vote = Votes.objects.filter(user=user, post=post).first()
        if existing_vote:
            if existing_vote.positive == positive:
                raise ValidationError('You have already voted this way')

            else:
                existing_vote.delete()

        serializer.save(user=user)

        serializer.save(user=self.request.user)
