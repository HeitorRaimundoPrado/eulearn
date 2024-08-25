"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

from django.core.asgi import get_asgi_application

django_asgi_application = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from chat_messages import routing
from backend.middleware import JWTAuthMiddleware


application = ProtocolTypeRouter({
    "http": django_asgi_application,
    "websocket": AuthMiddlewareStack(
        JWTAuthMiddleware(
            URLRouter(
                routing.websocket_urlpatterns
            )
        )
    ),
})
