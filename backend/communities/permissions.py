from rest_framework import permissions
from .models import Community
from subjects.models import ForumPost

class IsMemberOfCommunity(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        community_id = request.data.get('community')
        post_id = view.kwargs.get('pk', request.data.get('post'))

        if not community_id and not post_id:
            return False

        if not community_id:
            try:
                post = ForumPost.objects.get(id=post_id)

                if post.community == None:
                    return True

                community = post.community

            except ForumPost.DoesNotExist:
                return False

        else:
            try:
                community = Community.objects.get(id=community_id)

            except Community.DoesNotExist:
                return False

        if not community.private:
            return True

        return request.user in community.users_joined.all()

    def has_permission(self, request, view):
        return True
