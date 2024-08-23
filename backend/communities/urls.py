from django.urls import path
from .views import CommunityPostListCreateView, CommunityListCreateView, CommunityRetrieveView, JoinCommunityView

urlpatterns = [
    path('community/<int:community_id>/posts/', CommunityPostListCreateView.as_view(), name='community-post-list'),
    path('communities/', CommunityListCreateView.as_view(), name="community-list"),
    path('community/<int:pk>/', CommunityRetrieveView.as_view(), name='community-retrieve'),
    path('join-community/<int:pk>', JoinCommunityView.as_view(), name='join-community')
]
