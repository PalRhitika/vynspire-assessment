import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User
from datetime import datetime

SECRET_KEY=settings.SECRET_KEY

def generate_jwt(user):
    access_payload = {
        'user_id': user.id,
        'exp': datetime.now(timezone.utc) + timedelta(hours=1),
        'iat': datetime.now(timezone.utc),
        'type': 'access'
    }
    refresh_payload = {
        'user_id': user.id,
        'exp': datetime.now(timezone.utc) + timedelta(days=7),
        'iat': datetime.now(timezone.utc),
        'type': 'refresh'
    }

    access_token = jwt.encode(access_payload, SECRET_KEY, algorithm='HS256')
    refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm='HS256')
    return access_token, refresh_token

def decode_jwt(token):
  try:
    payload=jwt.decode(token, SECRET_KEY,algorithms=['HS256'])
    return payload
  except jwt.ExpiredSignatureError:
    return "expired"
  except jwt.InvalidTokenError:
    return None


@csrf_exempt
def refresh_token_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid method'}, status=405)

    data = json.loads(request.body)
    refresh_token = data.get('refresh_token')

    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=['HS256'])
        if payload['type'] != 'refresh':
            return JsonResponse({'error': 'Invalid token type'}, status=401)

        user = User.objects.get(id=payload['user_id'])
        access_token, _ = generate_jwt(user)
        return JsonResponse({'access_token': access_token})

    except jwt.ExpiredSignatureError:
        return JsonResponse({'error': 'Refresh token expired'}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({'error': 'Invalid token'}, status=401)
