from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from subjects.serializers import PostSerializer
from .permissions import IsMemberOfCommunity
from .serializers import CommunitySerializer
from subjects.models import ForumPost
from .models import Community

# Create your views here.
class CommunityPostPaginationClass(PageNumberPagination):
    page_size = 40

class CommunityPostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsMemberOfCommunity]
    pagination_class = CommunityPostPaginationClass

    def get_queryset(self):
        community_id = self.kwargs.get('community_id')
        return ForumPost.objects.filter(community=community_id)

    def perform_create(self):
        community_id = self.kwargs.get('community_id')
        serializer.save(author=self.request.user, community=community_id)

class CommunityListCreateView(generics.ListCreateAPIView):
    serializer_class = CommunitySerializer
    queryset = Community.objects.all()

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]

        return [AllowAny()]

    def perform_create(self, serializer):
        community = serializer.save()

        community.users_joined.add(self.request.user)
        community.creator = self.request.user
        return community.save()


class CommunityRetrieveView(generics.RetrieveAPIView):
    serializer_class = CommunitySerializer
    queryset = Community.objects.all()
    permission_classes = [AllowAny]



class JoinCommunityView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            community = Community.objects.get(id=pk)

        except Community.DoesNotExist:
            return Response({'detail': 'Community not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user in community.users_joined.all():
            return Response({'detail': 'User is already a member of this community.'}, status=status.HTTP_400_BAD_REQUEST)

        if not community.check_password(request.data.get('password')):
            return Response({'detail': 'Wrong Password'}, status=status.HTTP_403_FORBIDDEN)

        community.users_joined.add(request.user)

        serializer = CommunitySerializer(community, context={'request': request})

        community.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

