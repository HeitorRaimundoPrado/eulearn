from django.urls import path
from .views import UserProfileRetrieveView, UserVotesRetrieveView

urlpatterns = [
    path('user-profile/', UserProfileRetrieveView.as_view(), name="user-profile-get"),
    path('user/vote/<int:post>', UserVotesRetrieveView.as_view(), name="user-profile-get")
]
