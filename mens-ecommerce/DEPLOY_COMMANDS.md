# ⚡ Quick Deploy Commands

## Frontend (Vercel)
```bash
cd frontend
vercel
# For production:
vercel --prod
```

## Backend (Railway)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

## Or use GitHub Integration
1. Push code to GitHub
2. Connect repository in Vercel/Railway dashboard
3. Automatic deployments on every push!

## Test Build Locally Before Deploying
```bash
# Frontend
cd frontend
npm run build
npm run preview

# Backend
cd backend
npm test
node src/server.js
```
