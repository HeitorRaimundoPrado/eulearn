from django.urls import path
from .views import UserProfileRetrieveView, UserVotesRetrieveView, UserRetrieveView

urlpatterns = [
    path('user-profile/', UserProfileRetrieveView.as_view(), name="user-profile-get"),
    path('user/vote/<int:post>', UserVotesRetrieveView.as_view(), name="user-profile-get"),
    path('user/<int:pk>', UserRetrieveView.as_view(), name="user-get")
]
