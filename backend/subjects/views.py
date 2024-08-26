from rest_framework import generics, viewsets, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from django.db import models
from communities.permissions import IsMemberOfCommunity
from .models import ForumPost, Subject, Votes, PostAttachment
from .serializers import PostSerializer, SubjectSerializer, PostDetailSerializer, VotesSerializer, VotesDetailSerializer, PostAttachmentSerializer
from django.http import HttpResponse, Http404
from django.conf import settings
import boto3
from botocore.exceptions import NoCredentialsError

class PostAttachmentUploadView(APIView):
    parser_classes = [MultiPartParser]
    def post(self, request, *args, **kwargs):
        serializer = PostAttachmentSerializer(data=request.data)
        if serializer.is_valid():
            file_instance = serializer.save()
            return Response({'file_id': file_instance.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostRetrieveView(generics.RetrieveAPIView):
    serializer_class = PostDetailSerializer
    permission_classes = [IsMemberOfCommunity]
    queryset = ForumPost.objects.all()
        

class PostPaginationClass(PageNumberPagination):
    page_size = 40

class PostListView(viewsets.ModelViewSet):
    pagination_class = PostPaginationClass

    def get_queryset(self):
        queryset = ForumPost.objects.order_by('-created_at').filter(private=False).all()
        
        author = self.request.query_params.get('author_id')
        subj = self.request.query_params.get('subj')

        if author:
            queryset = queryset.filter(author=author)

        if subj:
            queryset = queryset.filter(subject=subj)

        return queryset


    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'update':
            return PostSerializer

        return PostDetailSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            if self.request.data.get('community'):
                return [IsMemberOfCommunity()]
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
    permission_classes = [AllowAny]

class VotesView(generics.ListCreateAPIView):
    queryset = Votes.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return VotesSerializer

        return VotesDetailSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            post_id = self.request.data.get('post')
            post = ForumPost.objects.get(id=post_id)

            if post.community:
                return [IsMemberOfCommunity()]

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



def download_file(request, file_key):
    s3_client = boto3.client(
        's3',
        endpoint_url=settings.AWS_S3_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
    )
    
    try:
        file_url = s3_client.generate_presigned_url('get_object',
            Params={'Bucket': settings.AWS_STORAGE_BUCKET_NAME, 'Key': file_key},
            ExpiresIn=3600)
        
        response = HttpResponse()
        response['Location'] = file_url
        response.status_code = 302
        return response

    except NoCredentialsError:
        raise Http404("File not found or invalid credentials")
