# 🚀 DevOps & Deployment Guide

## 📋 Table of Contents
- [Docker Setup](#docker-setup)
- [CI/CD Pipeline](#cicd-pipeline)
- [MongoDB Backups](#mongodb-backups)
- [Production Deployment](#production-deployment)

---

## 🐳 Docker Setup

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+

### Quick Start

1. **Copy environment file:**
```bash
cp .env.docker.example .env
```

2. **Edit `.env` with your values:**
```bash
nano .env
```

3. **Start all services:**
```bash
docker-compose up -d
```

4. **View logs:**
```bash
docker-compose logs -f
```

5. **Stop all services:**
```bash
docker-compose down
```

### Development Mode

```bash
# Start in development mode with hot-reload
NODE_ENV=development docker-compose up
```

### Production Mode

```bash
# Build and start in production mode
NODE_ENV=production docker-compose up -d --build
```

### Useful Commands

```bash
# View running containers
docker-compose ps

# Restart a service
docker-compose restart backend

# Access backend container shell
docker-compose exec backend sh

# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password123

# View resource usage
docker stats
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline automatically:
- ✅ Runs linting on every push
- ✅ Runs tests on multiple Node.js versions
- ✅ Builds Docker images
- ✅ Pushes images to Docker Hub (on main branch)

### Setup

1. **Add GitHub Secrets:**
   Go to Repository → Settings → Secrets and add:
   - `MONGO_URI_TEST`: Test MongoDB connection string
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password/token

2. **Trigger Workflow:**
   - Push to `main` or `develop` branch
   - Create a Pull Request

3. **View Pipeline:**
   - Go to Actions tab in your GitHub repository

### Manual Trigger

```bash
# Trigger workflow manually via GitHub CLI
gh workflow run ci-cd.yml
```

---

## 💾 MongoDB Backups

### Automatic Backups

The `mongodb-backup` service automatically:
- Creates daily backups
- Stores backups in `./backups` directory
- Removes backups older than 7 days (configurable)

### Manual Backup

**Using Docker:**
```bash
docker-compose exec mongodb-backup sh -c "mongodump --host=mongodb --username=admin --password=password123 --authenticationDatabase=admin --out=/backups/manual-backup-$(date +%Y%m%d)"
```

**Using Script:**
```bash
chmod +x scripts/backup-mongodb.sh
./scripts/backup-mongodb.sh
```

### Restore from Backup

```bash
# List available backups
ls -lh backups/

# Restore from a specific backup
docker-compose exec mongodb mongorestore \
  --host=localhost \
  --username=admin \
  --password=password123 \
  --authenticationDatabase=admin \
  --db=topia_ecommerce \
  /backups/backup-20240101-120000/topia_ecommerce
```

### Backup to Cloud Storage

**AWS S3 Example:**
```bash
# Install AWS CLI in the backup container
# Then add to backup script:
aws s3 sync /backups s3://your-bucket-name/mongodb-backups/
```

---

## 🌐 Production Deployment

### Option 1: VPS Deployment

1. **Install Docker on your server:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

2. **Clone repository:**
```bash
git clone https://github.com/yourusername/topia-ecommerce.git
cd topia-ecommerce
```

3. **Setup environment:**
```bash
cp .env.docker.example .env
nano .env  # Edit with production values
```

4. **Start services:**
```bash
docker-compose -f docker-compose.yml up -d
```

5. **Setup nginx reverse proxy (recommended):**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Cloud Platforms

**Docker Hub + Cloud Platform:**
1. Images are automatically pushed to Docker Hub via CI/CD
2. Pull and run on any cloud platform:
   - AWS ECS
   - Google Cloud Run
   - Azure Container Instances
   - DigitalOcean App Platform

**Example for AWS ECS:**
```bash
# Use images from Docker Hub
docker pull yourusername/topia-backend:latest
docker pull yourusername/topia-frontend:latest
```

---

## 🔒 Security Checklist

- [ ] Change default MongoDB passwords
- [ ] Use strong JWT secret
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Monitor logs
- [ ] Setup automated backups
- [ ] Use environment variables for secrets
- [ ] Enable Docker security scanning
- [ ] Implement rate limiting

---

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:5000/health

# Frontend health
curl http://localhost/health

# MongoDB health
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### Logs

```bash
# View all logs
docker-compose logs

# Follow specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100
```

---

## 🆘 Troubleshooting

### Common Issues

**1. Port already in use:**
```bash
# Change ports in .env file
FRONTEND_PORT=8080
```

**2. MongoDB connection failed:**
```bash
# Check MongoDB is running
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb
```

**3. Out of disk space:**
```bash
# Clean up Docker
docker system prune -a --volumes
```

---

## 📝 Notes

- Backups are stored in `./backups` directory
- MongoDB data persists in Docker volumes
- Uploaded files are stored in `backend_uploads` volume
- Always test in development before deploying to production

---

## 🤝 Support

For issues or questions:
- Create an issue on GitHub
- Check existing documentation
- Review Docker logs

---

**Created with ❤️ for TOPIA E-Commerce**
