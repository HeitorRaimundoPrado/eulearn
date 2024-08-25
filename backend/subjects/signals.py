from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import F
from django.core.cache import cache
from .models import Votes

@receiver(post_save, sender=Votes)
def update_net_votes_cache(sender, instance, created, **kwargs):
    cache_key = f'net_votes_{instance.post_id}'

    if not cache.get(cache_key):
        cache.set(cache_key, 0, timeout=None)

    if created:
        if instance.positive:
            cache.incr(cache_key, 1)

        else:
            cache.decr(cache_key, 1)

    else:
        old_instance = sender.objects.get(pk=instance.pk)
        if old_instance.positive != instance.positive:
            if instance.positive:
                cache.incr(cache_key, 2)

            else:
                cache.decr(cache_key, 2)


@receiver(post_delete, sender=Votes)
def update_net_votes_cache_on_delete(sender, instance, **kwargs):
    cache_key = f'net_votes_{instance.post_id}'

    if instance.positive:
        cache.decr(cache_key, 1)

    else:
        cache.incr(cache_key, 1)

