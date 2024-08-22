from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import UserProfileSerializer
from subjects.serializers import VotesSerializer
from .models import UserProfile

# Create your views here.
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

