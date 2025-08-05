from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
  pass
  def __str__(self):
    return self.username

class Post(models.Model):
  title =models.CharField(max_length=255)
  content = models.TextField()
  author= models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
  created_at=models.DateTimeField(auto_now_add=True)
  updated_at=models.DateTimeField(null=True, blank=True)

  def __str__(self):
    return self.title

