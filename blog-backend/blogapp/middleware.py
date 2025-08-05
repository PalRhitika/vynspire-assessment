import time
import jwt
from django.http import JsonResponse
from django.conf import settings
from blogapp.models import User
from blogapp.utils import decode_jwt
from django.contrib.auth.models import AnonymousUser

class JWTAuthMiddleware:
  def __init__(self,get_response):
    self.get_response= get_response

  def __call__(self,request):
    start_time=time.time()

    # Default user is Anonymous
    request.user= AnonymousUser()


    #Check authorization header
    auth_header=request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer'):
      token=auth_header.split(' ')[1]
      decoded = decode_jwt(token)
      if decoded == 'expired':
        return JsonResponse({'error':'Token has expired.'}, status=401)
      elif decoded is None:
        return JsonResponse({'error':'Invalid token'},status=401)
      else:
        try:
          user=User.objects.get(id=decoded['user_id'])
          request.user=user
        except User.DoesNotExist:
          return JsonResponse({'error':'User Not Found'},status=401)


    response=self.get_response(request)

    duration =(time.time() - start_time)*1000
    print(f"[{request.method}] {request.path} - {duration:.2f} ms")

    return response
