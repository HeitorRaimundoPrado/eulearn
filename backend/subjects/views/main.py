import json
import boto3
from rest_framework import generics, viewsets, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from django.db import models
from django.core.files.storage import default_storage
from communities.permissions import IsMemberOfCommunity
from subjects.models import ForumPost, Subject, PostAttachment
from subjects.serializers import PostSerializer, SubjectSerializer, PostDetailSerializer, PostAttachmentSerializer
from django.http import HttpResponse, Http404
from django.conf import settings
from django.urls import reverse
from botocore.exceptions import NoCredentialsError


class PostRetrieveView(generics.RetrieveAPIView):
    serializer_class = PostDetailSerializer
    permission_classes = [IsMemberOfCommunity]
    queryset = ForumPost.objects.all()
        

class PostPaginationClass(PageNumberPagination):
    page_size = 40

class PostListView(viewsets.ModelViewSet):
    pagination_class = PostPaginationClass
    parser_class = [MultiPartParser]

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

    def create(self, request, *args, **kwargs):
        def update_image_urls(content, uploaded_files):
            """
            Recursively traverse the Slate.js content and replace local image URLs with S3 URLs.
            """
            for node in content:
                if node.get('type') == 'image' and 'url' in node:
                    file_name = node['file_name']
                    print("file_name")
                    print(file_name)
                    print(uploaded_files)
                    if file_name in uploaded_files:
                        node['url'] =  uploaded_files[file_name].url
                        print(node['url'])

                if 'children' in node:
                    update_image_urls(node['children'], uploaded_files)
            return content


        context = super().get_serializer_context()
        context['request'] = self.request
        serializer = PostSerializer(data=request.data, context=context)
        if serializer.is_valid():
            post = serializer.save(author_id=self.request.user)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        files = request.FILES.getlist('files')
        uploaded_files = {}

        if len(files) != len(set(files)): 
            return JsonResponse({'detail': 'You have two files with the same name in this post. That is not allowed'}, status=status.HTTP_400_BAD_REQUEST)

        for file in files:
            pa = PostAttachment.objects.create(
                post=post,
                file=file,
            )

            
            uploaded_files[file.name] = pa.file
            pa.save()

        content = json.loads(request.data.get('content', '[]'))
        post.save()
        updated_content = json.dumps(update_image_urls(content, uploaded_files))
        post.content = updated_content
        post.save()

        return Response(PostSerializer(post).data, status=status.HTTP_201_CREATED)


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
