# 📝 Vynspire Blog

A full stack blog application built with Django (backend) and React (frontend).
Supports authentication, post creation/editing, pagination, and more.

---

## 🚀 Tech Stack

- **Backend**: Django (custom user model, JWT auth, SQLite)
- **Frontend**: React (Vite, Zustand, Tailwind CSS)
- **Auth**: JWT (Access + Refresh tokens with auto-refresh)

---

## 📁 Project Structure

```
vynspire-blog/
├── blog-backend/         # Django project
├── blog-frontend/        # React project (Vite)
└── README.md
```

---

## ⚙️ Setup Instructions

### 🔙 Backend

```bash
cd blog-backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

> Runs on: http://localhost:8000

---

### 🌐 Frontend

```bash
cd blog-frontend
npm install
npm run dev
```

> Runs on: http://localhost:5173

Make sure to create a `.env` file inside `frontend/`:

```
VITE_API_URL=http://localhost:8000
```
**Also Make sure to run both server (frontend and backend) to make this application fully functional**
---

## 🧪 Features

- Register / Login with validation
- JWT-based authentication with refresh tokens
- Create, update, delete blog posts
- Edit/delete only your own posts
- View all public posts
- Pagination, loading shimmer, toast notifications
- Persistent login (auto-refresh token)

---

## 📦 Deployment Notes

- Monorepo ready for Vercel (frontend) + Render (backend)
- Backend CORS must allow your frontend domain
- Use `.env` to store secrets/URLs (not included in repo)

---


