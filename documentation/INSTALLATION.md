# ScaleHub Installation & Setup Guide

This document provides detailed instructions for setting up and running the ScaleHub Docker Scaling Learning Platform.

## Prerequisites Checklist

- [ ] Docker Desktop installed (https://www.docker.com/products/docker-desktop)
- [ ] Git installed
- [ ] At least 4GB free disk space
- [ ] Port 3000, 5432, 8000 available
- [ ] Modern web browser

## Installation Steps

### 1. Clone/Download the Repository

```bash
# If using Git
git clone <repository-url>
cd scalehub

# Or download and extract the ZIP file
```

### 2. Initial Setup

**Option A: Automated Setup (Recommended)**

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Create `.env` file
- Build Docker images
- Start containers
- Run database migrations

**Option B: Manual Setup**

```bash
# Copy environment file
cp .env.example .env

# Build and start containers
docker-compose up -d --build

# Wait 10 seconds for database to initialize
sleep 10

# Run migrations
docker-compose exec backend python manage.py migrate
```

### 3. Initialize Database (Optional)

Create sample test accounts:

**Linux/Mac:**
```bash
chmod +x setup-db.sh
./setup-db.sh
```

Or manually:

```bash
docker-compose exec backend python manage.py shell << EOF
from django.contrib.auth.models import User
from api.models import UserProfile

# Create admin
User.objects.create_superuser('admin', 'admin@scalehub.local', 'admin123')

# Create test users
User.objects.create_user('alice', 'alice@example.com', 'testpass123')
User.objects.create_user('bob', 'bob@example.com', 'testpass123')

print('✓ Users created')
EOF
```

## Accessing the Application

Once setup completes:

1. **Frontend:** http://localhost:3000
2. **Backend API:** http://localhost:8000/api/v1
3. **Database:** localhost:5432 (username: scalinguser)

## First Time Usage

1. Navigate to http://localhost:3000
2. Click "Register" to create an account
3. Fill in your details and submit
4. Login with your new credentials
5. Go to Dashboard
6. Click "Test Scale Connection" button
7. Watch the Container ID change

## Configuration

### Environment Variables

Edit `.env` file to customize:

```env
# Django Configuration
DEBUG=False
SECRET_KEY=your-secret-key

# Database
DB_NAME=scalingdb
DB_USER=scalinguser
DB_PASSWORD=scalingpass123
DB_HOST=db
DB_PORT=5432

# CORS (for frontend)
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Frontend API URL
REACT_APP_API_URL=http://localhost:8000/api/v1
```

### Scaling Backend Services

To test load balancing with multiple containers:

```bash
# Scale to 5 backend instances
docker-compose up -d --scale backend=5

# Scale to 10 backend instances
docker-compose up -d --scale backend=10

# Scale back to 1
docker-compose up -d --scale backend=1
```

## Service Management

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
docker-compose logs -f nginx
```

### Check Service Status
```bash
docker-compose ps
```

## Troubleshooting

### Problem: Port Already in Use

**Windows:**
```batch
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -i :3000
kill -9 <PID>
```

Repeat for ports 8000, 5432 if needed.

### Problem: Database Connection Failed

```bash
# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db

# Complete reset
docker-compose down -v
docker-compose up -d --build
```

### Problem: Frontend Can't Connect to Backend

1. Check backend is running:
```bash
docker-compose ps backend
```

2. Check CORS settings in `backend/core/settings.py`

3. Verify environment variable:
```bash
echo $REACT_APP_API_URL
```

4. Check browser console for errors (F12)

### Problem: Build Failures

```bash
# Clean up everything
docker-compose down
docker system prune -a

# Rebuild
docker-compose up -d --build
```

### Problem: Container Keeps Restarting

```bash
# Check logs
docker-compose logs backend

# Common issues:
# - Database not ready: wait 20 seconds
# - Port conflict: check lsof/netstat
# - Missing dependencies: check requirements.txt
```

## Development Workflow

### Hot Reload Frontend

Changes in `frontend/src/` are automatically reflected:
1. Save file
2. Browser auto-refreshes

### Backend Changes

For backend changes:

```bash
# Rebuild backend image
docker-compose build backend

# Restart backend service
docker-compose up -d backend

# Or fully restart with new image
docker-compose up -d --no-deps backend
```

### Database Migrations

After changing models:

```bash
# Create migration
docker-compose exec backend python manage.py makemigrations

# Apply migration
docker-compose exec backend python manage.py migrate
```

## Security in Production

For production deployment:

1. Change `SECRET_KEY` in `.env`
2. Set `DEBUG=False`
3. Generate new JWT secrets
4. Configure proper CORS_ALLOWED_ORIGINS
5. Use environment variables for sensitive data
6. Enable HTTPS/SSL
7. Set up database backups
8. Configure logging
9. Use stronger database passwords
10. Enable authentication for database

## Performance Optimization

### Database
```bash
# Connect to database and create indexes
docker-compose exec db psql -U scalinguser -d scalingdb
# CREATE INDEX idx_session_user ON api_learningsession(user_id);
```

### Frontend
- Enable caching headers in nginx
- Minify and compress assets
- Use CDN for static files

### Backend
- Enable query caching
- Use database connection pooling
- Implement pagination
- Add database indexes

## Monitoring

### View Resource Usage
```bash
docker stats
```

### View Network Traffic
```bash
docker-compose logs nginx | grep -i "request"
```

### Database Monitoring
```bash
docker-compose exec db psql -U scalinguser -d scalingdb -c "SELECT count(*) FROM api_learningsession;"
```

## Backup and Restore

### Backup Database
```bash
docker-compose exec db pg_dump -U scalinguser scalingdb > backup.sql
```

### Restore Database
```bash
docker-compose exec -T db psql -U scalinguser scalingdb < backup.sql
```

## Advanced Features

### Docker Compose Override

Create `docker-compose.override.yml` for local development:

```yaml
version: '3.9'
services:
  backend:
    environment:
      DEBUG: "True"
    volumes:
      - ./backend:/app
```

### Custom Nginx Configuration

Edit `nginx/default.conf` to customize:
- Rate limiting
- Caching
- SSL/TLS
- Compression
- Headers

### API Rate Limiting

Configured in Nginx:
- 10 requests per second
- Burst of 20 requests
- Per client IP

Adjust in `nginx/default.conf`:
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
```

## Support & Resources

- **Documentation:** See README.md
- **Quick Start:** See QUICKSTART.md
- **API Docs:** http://localhost:8000/api/v1 (when running)
- **Logs:** `docker-compose logs`

## Uninstall

To completely remove the application:

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (data)
docker-compose down -v

# Remove built images
docker rmi scalehub_backend scalehub_frontend

# Delete the directory
rm -rf scalehub/
```

## Next Steps

1. Complete the Quick Start guide in QUICKSTART.md
2. Read the main README.md for detailed feature documentation
3. Explore the API endpoints
4. Try scaling to multiple containers
5. Customize the application to your needs

---

**For more help, refer to:**
- Docker Documentation: https://docs.docker.com
- Django Documentation: https://docs.djangoproject.com
- React Documentation: https://react.dev
