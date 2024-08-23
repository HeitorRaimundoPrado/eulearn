from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserProfileSerializer, UserSerializer
from django.contrib.auth import get_user_model
from subjects.serializers import VotesSerializer
from .models import UserProfile

User = get_user_model()

# Create your views here.
class UserRetrieveView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserProfileRetrieveView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        return UserProfile.objects.get(user=user)


class UserVotesRetrieveView(generics.RetrieveAPIView):
    serializer_class = VotesSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'post'

    def get_queryset(self):
        user = self.request.user
        votes = user.votes

        return votes.all()

