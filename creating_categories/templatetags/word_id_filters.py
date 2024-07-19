from django import template
from itsdangerous import URLSafeSerializer
from django.conf import settings

register = template.Library()

@register.filter(name='encrypt_id')
def encrypt_id(default_id):
    ser = URLSafeSerializer(settings.SECRET_KEY)
    return ser.dumps(default_id)

@register.filter(name='decrypt_id')
def decrypt_id(encrypted_id):
    ser = URLSafeSerializer(settings.SECRET_KEY)
    try:
        return ser.loads(encrypted_id)
    except:
        return None
        