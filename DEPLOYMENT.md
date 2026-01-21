# Deployment Guide

## Backend Deployment (Railway)

1. **Create Railway Account**: Go to [railway.app](https://railway.app)
2. **Connect GitHub**: Link your GitHub repository
3. **Deploy Backend**:
   - Select `backend` folder
   - Add environment variables:
     ```
     PORT=3333
     DB_HOST=your_mysql_host
     DB_USER=your_mysql_user
     DB_PASSWORD=your_mysql_password
     DB_NAME=realtime_notes_app
     JWT_SECRET=your_jwt_secret
     ```
4. **Add MySQL Database**: Railway → Add Service → MySQL
5. **Run Setup**: Execute `node setup-db.js` once

## Frontend Deployment (Vercel)

1. **Create Vercel Account**: Go to [vercel.com](https://vercel.com)
2. **Import Project**: Connect GitHub repository
3. **Configure**:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   ```
   VITE_BACKEND_URL=https://your-railway-backend-url.railway.app
   ```

## Alternative: Netlify Frontend

1. **Create Netlify Account**: Go to [netlify.com](https://netlify.com)
2. **Deploy**: Drag `frontend/dist` folder or connect GitHub
3. **Environment Variables**:
   ```
   VITE_BACKEND_URL=https://your-railway-backend-url.railway.app
   ```

## Post-Deployment

1. Update CORS in backend `server.js`:
   ```js
   app.use(cors({
     origin: ["https://your-frontend-url.vercel.app", "http://localhost:5173"],
     credentials: true
   }));
   ```

2. Test the application:
   - Register new user
   - Create notes
   - Test real-time collaboration