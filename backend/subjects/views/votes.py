
from rest_framework import generics
from subjects.models import Votes, ForumPost
from subjects.serializers import VotesSerializer, VotesDetailSerializer
from communities.permissions import IsMemberOfCommunity
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound, ValidationError

class VotesView(generics.CreateAPIView):
    queryset = Votes.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return VotesSerializer

        return VotesDetailSerializer

    def get_permissions(self):
        post_id = self.request.data.get('post')
        post = ForumPost.objects.get(id=post_id)

        if post.community:
            return [IsMemberOfCommunity()]

        return [IsAuthenticated()]


    
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

        serializer.save(user=self.request.user)
