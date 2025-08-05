from django.test import TestCase, Client
from .models import User, Post
import json

class BlogTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='rhitika', password='test123')
        self.token = self._get_token()

    def _get_token(self):
        res = self.client.post('/login/', json.dumps({
            'username': 'rhitika',
            'password': 'test123'
        }), content_type='application/json')
        return json.loads(res.content)['access_token']

    def test_register(self):
        response = self.client.post('/register/', json.dumps({
            'username': 'newuser',
            'password': 'newpass'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_get_posts_unauth(self):
        res = self.client.get('/posts/')
        self.assertEqual(res.status_code, 200)

    def test_create_post_auth(self):
        res = self.client.post('/posts/', json.dumps({
            'title': 'Test Title',
            'content': 'Test Content'
        }), content_type='application/json',
        HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.assertEqual(res.status_code, 201)

    def test_invalid_token(self):
        res = self.client.post('/posts/', json.dumps({
            'title': 'Oops',
            'content': 'Nope'
        }), content_type='application/json',
        HTTP_AUTHORIZATION='Bearer fake.token.here')
        self.assertEqual(res.status_code, 401)
