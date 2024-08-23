import jwt
from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        token = None
        for param in scope['query_string'].decode().split("&"):
            if param.startswith('token='):
                token = param.split('=')[-1]
                break

        if token:
            user = await self.get_user_from_token(token)
            scope['user'] = user

        else:
            scope['user'] = AnonymousUser()

        return await self.inner(scope, receive, send)

    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')

            if user_id:
                from django.contrib.auth import get_user_model
                User = get_user_model()

                try:
                    return User.objects.get(id=user_id)

                except User.DoesNotExist:
                    return AnonymousUser()

            return AnonymousUser()

        except jwt.ExpiredSignatureError:
            return AnonymousUser()

        except jwt.PyJWTError:
            return AnonymousUser()


