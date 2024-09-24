from django.views import View
from django.http import JsonResponse
from .models import Message, Attachment
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response

User = get_user_model()

# Create your views here.
class UploadAttachmentView(View):
    def post(self, request, *args, **kwargs):
        file = request.FILES['file']
        message_id = request.POST['message_id']
        message = Message.objects.get(id=message_id)

        attachment = Attachment.objects.create(
            message=message,
            file=file
        )

        return JsonResponse({
            'status': 'success',
            'file_url': attachment.file.url
        })

class ChatListView(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user

        receivers = Message.objects.filter(sender=user).values_list('recipient', flat=True).distinct()

        senders = Message.objects.filter(recipient=user).values_list('sender', flat=True).distinct()

        user_ids = set(receivers).union(set(senders))

        users = User.objects.filter(id__in=user_ids)
        user_list = [{'id': u.id, 'username': u.username} for u in users]

        return Response(user_list)
