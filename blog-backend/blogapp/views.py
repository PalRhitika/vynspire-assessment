
import json
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User,Post
from .utils import generate_jwt
from datetime import datetime
from django.core.paginator import Paginator
# Create your views here.

@csrf_exempt
def register(request):
  if request.method !='POST':
    return JsonResponse({'error':'Method Not Allowed'}, status= 405)
  try:
    data=json.loads(request.body)
    username=data.get('username')
    password=data.get('password')
    first_name = data.get('first_name', '').strip()
    last_name = data.get('last_name', '').strip()

    if not username or not password or not first_name or not last_name:
      return JsonResponse({'error':'All the fields are required.'},status=400)
    if User.objects.filter(username=username).exists():
      return JsonResponse({'error':'Username already exists.'},status=400)
    if len(password) < 8 or not any(char.isdigit() for char in password) or not any(not char.isalnum() for char in password):
      return JsonResponse({'error': 'Password must be at least 8 characters long, contain a number and a special character.'}, status=400)

    user=User.objects.create_user(username=username, password=password, first_name=first_name, last_name= last_name)
    return JsonResponse({'message':'User registered Successfully.'},status=201)
  except Exception as e:
    return JsonResponse({'error':str(e)},status=500)

@csrf_exempt
def login_view(request):
  if request.method !='POST':
    return JsonResponse({'error':'Method Not Allowed'}, status= 405)
  try:
    data=json.loads(request.body)
    username=data.get('username')
    password=data.get('password')
    user=authenticate(request, username=username, password=password)
    if user:
      access_token, refresh_token = generate_jwt(user)
      return JsonResponse({
          'access_token': access_token,
          'refresh_token': refresh_token
      })
    else:
      return JsonResponse({'error':'Invalid credentials'},status=401)
  except Exception as e:
    return JsonResponse({'error':str(e)},status=500)



@csrf_exempt
def posts_list_create(request):
    if request.method == 'GET':
        user = request.user
        if user.is_authenticated:
            posts = Post.objects.filter(author=user).order_by('-created_at')
        else:
            posts = Post.objects.all().order_by('-created_at')
        page_number = request.GET.get('page', 1)
        per_page = request.GET.get('limit', 5)

        paginator = Paginator(posts, per_page)
        page_obj = paginator.get_page(page_number)

        data = [{
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'author': post.author.username,
            'created_at': post.created_at
        } for post in page_obj]

        return JsonResponse({
            'total': paginator.count,
            'pages': paginator.num_pages,
            'current_page': page_obj.number,
            'results': data
        })

    elif request.method == 'POST':
        print(request.user)
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Unauthorized.'}, status=403)
        try:
          data = json.loads(request.body)
          title = data.get('title')
          content = data.get('content')

          if not title or not content:
              return JsonResponse({'error': 'Title and content are required'}, status=400)

          post = Post.objects.create(
              title=title,
              content=content,
              author=request.user
          )

          return JsonResponse({'message': 'Post created', 'post_id': post.id}, status=201)
        except Exception as e:
          return JsonResponse({'error':str(e)},status=500)
    return JsonResponse({'error': 'Invalid method'}, status=405)

@csrf_exempt
def post_detail_update_delete(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post not found'}, status=404)

    if request.method == 'GET':
        data = {
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'author': post.author.username,
            'created_at': post.created_at,
            'updated_at':post.updated_at
        }
        return JsonResponse(data)

    if request.method == 'PUT':
        if not request.user.is_authenticated or post.author != request.user:
            return JsonResponse({'error': 'Unauthorized'}, status=403)
        try:
          data = json.loads(request.body)
          post.title = data.get('title', post.title)
          post.content = data.get('content', post.content)
          post.updated_at=datetime.now()
          post.save()

          return JsonResponse({'message': 'Post updated Successfully'},status=200)
        except Exception as e:
          return JsonResponse({'error':str(e)},status=500)


    if request.method == 'DELETE':
        if not request.user.is_authenticated or post.author != request.user:
            return JsonResponse({'error': 'Unauthorized'}, status=403)

        post.delete()
        return JsonResponse({'message': 'Post deleted'})

    return JsonResponse({'error': 'Invalid method'}, status=405)
















