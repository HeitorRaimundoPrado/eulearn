
from django.urls import path
from .views import ChatListView

urlpatterns = [
    path('user-chats/', ChatListView.as_view(), name="user-chats")
]
