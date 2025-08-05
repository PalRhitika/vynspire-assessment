from django.urls import path
from .views import register, login_view, posts_list_create, post_detail_update_delete

urlpatterns=[
  path('register/',register),
  path('login/',login_view),
  path('posts/', posts_list_create),
  path('posts/<int:post_id>/', post_detail_update_delete),
]

