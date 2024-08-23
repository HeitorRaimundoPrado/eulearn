import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, Attachment
from asgiref.sync import sync_to_async
from django.db.models import Q

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = f"user_{self.scope['user'].id}"
        self.room_group_name = f"chat_{self.room_name}"
        recipient_id = self.scope['url_route']['kwargs']['receiver_id']

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        past_messages = await self.get_past_messages(self.scope['user'].id, recipient_id)

        for message in past_messages:
            await self.send(text_data=json.dumps({
                'message': message.content,
                'message_id': message.id,
                'sender_id': await self.get_user_id_from_message(message),
                'timestamp': message.timestamp.isoformat()
            }))


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        sender_id = self.scope['user'].id
        print(self.scope['user'].id)
        recipient_id = self.scope['url_route']['kwargs']['receiver_id']

        message = await self.create_new_message(sender_id, recipient_id, message)
        
        await self.channel_layer.group_send(
            f"chat_user_{recipient_id}",
            {
                'type': 'chat_message',
                'message': message.content,
                'message_id': message.id,
                'sender_id': sender_id
            }
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message.content,
                'message_id': message.id,
                'sender_id': sender_id
            }
        )

    async def chat_message(self, event):
        message = event['message']
        message_id = event['message_id']
        sender_id = event['sender_id']

        await database_sync_to_async(Message.objects.filter(id=message_id).update)(is_read=True)

        await self.send(text_data=json.dumps({
            'message': message,
            'message_id': message_id,
            'sender_id': sender_id
        }))

    
    @sync_to_async
    def get_past_messages(self, sender_id, receiver_id):
        return list(Message.objects.filter(Q(sender=sender_id, recipient=receiver_id) | Q(sender=receiver_id, recipient=sender_id)).order_by('-timestamp')[:50])

    @sync_to_async
    def create_new_message(self, sender_id, recipient_id, content):
        return Message.objects.create(sender_id=sender_id, recipient_id=recipient_id, content=content, room_name=self.room_name)

    @sync_to_async
    def get_user_id_from_message(self, message):
        return message.sender.id


