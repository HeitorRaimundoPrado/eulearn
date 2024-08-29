from django.urls import path
from .views import BookmarkListView, UserBookmarkDetailView, BookmarkDeleteView

urlpatterns = [
    path('bookmarks/', BookmarkListView.as_view(), name="bookmarks-list"),
    path('user-bookmark/', UserBookmarkDetailView.as_view(), name="current-user-bookmark-detail"),
    path('bookmarks/delete/', BookmarkDeleteView.as_view(), name="bookmark-delete")
]
