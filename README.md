<p align="left"> <img src="https://komarev.com/ghpvc/?username=ScaleHub-Who-Is-Answering&label=Repository%20Views&color=0e75b6&style=flat" alt="ScaleHub-Who-Is-Answering" /> </p>



# ScaleHub - Docker Scaling Learning Platform

A premium, production-grade full-stack application for learning Docker containerization and scaling with JWT authentication, modern UI, and real-time container monitoring.

## 🚀 Features

### Backend (Django + PostgreSQL)
- ✅ JWT Authentication with refresh tokens
- ✅ User registration and profile management
- ✅ Container ID tracking for each request
- ✅ Session history logging
- ✅ RESTful API with Django REST Framework
- ✅ CORS support for cross-origin requests
- ✅ Health check endpoints
- ✅ Gunicorn production server

### Frontend (React + React Router)
- ✅ Modern, premium UI design
- ✅ Smooth animations with Framer Motion
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Real-time container visualization
- ✅ Session tracking and history
- ✅ Profile management
- ✅ Dark theme with gradient effects
- ✅ Toast notifications

### DevOps
- ✅ Docker containerization
- ✅ Docker Compose orchestration
- ✅ Nginx load balancing (round-robin, least-conn)
- ✅ PostgreSQL database
- ✅ Volume persistence
- ✅ Health checks
- ✅ Environment configuration
- ✅ One-click setup scripts

## 📋 Project Structure

```
scalehub/
├── backend/
│   ├── api/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── core/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── nginx/
│   └── default.conf
├── docker-compose.yml
├── .env.example
├── setup.sh
└── README.md
```

## 🛠️ Prerequisites

- Docker Desktop (includes Docker and Docker Compose)
- Git
- Web browser

## 📦 Quick Start

### Option 1: Automated Setup (Recommended)

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```
### Option 2: Manual Setup

```bash
# 1. Create environment file
cp .env.example .env

# 2. Build and start containers
docker-compose up -d --build

# 3. Run migrations
docker-compose exec backend python manage.py migrate

# 4. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api/v1
```

## 🔐 Authentication

Create an account at http://localhost:3000/register or use the API:

```bash
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "password_confirm": "testpass123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

## 🚀 Using the Platform

1. **Dashboard:** Click "Test Scale Connection" to see container IDs
2. **Sessions:** Track your container interactions
3. **Profile:** Manage your account information

## 🐳 Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Scale to 5 backends
docker-compose up -d --scale backend=5

# View running containers
docker-compose ps
```

## 📊 API Endpoints

- `POST /api/v1/auth/register/` - Register
- `POST /api/v1/auth/login/` - Login
- `GET /api/v1/user/profile/` - Get profile
- `PUT /api/v1/user/profile/update/` - Update profile
- `GET /api/v1/user/sessions/` - Get sessions
- `GET /api/v1/scale/test/` - Test endpoint
- `GET /api/v1/health/` - Health check

## 🎨 Frontend Highlights

- Premium gradient design
- Smooth Framer Motion animations
- Responsive layouts
- Dark theme with cyan/pink gradients
- Real-time container visualization
- Session history tracking

## 🔒 Security Features

- JWT token authentication
- CORS headers validation
- Password hashing
- Rate limiting
- SQL injection prevention
- Environment variable separation

## 📚 Learning Outcomes

- Docker containerization
- Container orchestration
- Load balancing with Nginx
- JWT authentication
- RESTful API design
- React component architecture
- Full-stack development

## 📞 Troubleshooting

**Port already in use:**
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

**Database connection error:**
```bash
docker-compose down -v
docker-compose up -d
```

**Frontend can't connect to backend:**
- Check `.env` file `REACT_APP_API_URL`
- Verify backend is running: `docker-compose ps`
- Check CORS settings in `core/settings.py`

## 📄 License

MIT License

## 🤝 Contributing

Contributions welcome! Submit a Pull Request.


<p align="left"> <img src="https://komarev.com/ghpvc/?username=shishirrsiam&label=Profile%20views&color=0e75b6&style=flat" alt="shishirrsiam" /> </p>
