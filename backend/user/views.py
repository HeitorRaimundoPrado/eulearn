from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserProfileSerializer, UserSerializer
from django.contrib.auth import get_user_model
from subjects.serializers import VotesSerializer
from .models import UserProfile
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

User = get_user_model()

# Create your views here.
class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            print(request.data)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

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

