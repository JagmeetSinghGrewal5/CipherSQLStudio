# 🚀 Vercel Deployment Guide for CipherSQLStudio

This guide will help you deploy both the frontend and backend of CipherSQLStudio to Vercel.

## 📋 Prerequisites

- [Vercel Account](https://vercel.com) (free tier works)
- [GitHub Repository](https://github.com/JagmeetSinghGrewal5/CipherSQLStudio) (already set up)
- Neon PostgreSQL database (already configured)
- MongoDB Atlas database (already configured)

## 🔧 Backend Deployment

### Step 1: Deploy Backend to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import from GitHub:**
   - Select your repository: `JagmeetSinghGrewal5/CipherSQLStudio`
   - **Root Directory:** `backend`
   - **Framework Preset:** Other
   - **Build Command:** `npm run vercel-build`
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

### Step 2: Configure Backend Environment Variables

In your Vercel project settings, add these environment variables:

```env
NODE_ENV=production
PORT=5000

# PostgreSQL - Neon
POSTGRES_HOST=ep-sweet-mountain-ahofezlf-pooler.c-3.us-east-1.aws.neon.tech
POSTGRES_PORT=5432
POSTGRES_DB=neondb
POSTGRES_USER=neondb_owner
POSTGRES_PASSWORD=npg_c9G8uXrMAQEC
DATABASE_URL=postgresql://neondb_owner:npg_c9G8uXrMAQEC@ep-sweet-mountain-ahofezlf-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# MongoDB - Atlas
MONGODB_URI=mongodb+srv://jagmeet2779048_db_user:MS1Zi0DWnk4JbJs3@cluster0.c2hpgml.mongodb.net/ciphersqlstudio?retryWrites=true&w=majority&appName=Cluster0

# JWT (IMPORTANT: Change this!)
JWT_SECRET=your-super-secure-jwt-secret-key-for-production-change-this-to-something-random
JWT_EXPIRES_IN=7d

# Optional: LLM Integration
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
```

### Step 3: Deploy Backend

1. **Click "Deploy"**
2. **Wait for deployment to complete**
3. **Note your backend URL** (e.g., `https://your-backend.vercel.app`)
4. **Test the API:** Visit `https://your-backend.vercel.app/api/health`

## 🎨 Frontend Deployment

### Step 1: Deploy Frontend to Vercel

1. **Create a new Vercel project**
2. **Import from GitHub:**
   - Select your repository: `JagmeetSinghGrewal5/CipherSQLStudio`
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

### Step 2: Configure Frontend Environment Variables

In your Vercel project settings, add:

```env
REACT_APP_API_URL=https://your-backend-deployment.vercel.app/api
GENERATE_SOURCEMAP=false
CI=false
```

**⚠️ Important:** Replace `your-backend-deployment.vercel.app` with your actual backend URL from Step 3 above.

### Step 3: Deploy Frontend

1. **Click "Deploy"**
2. **Wait for deployment to complete**
3. **Your app will be live!** (e.g., `https://your-frontend.vercel.app`)

## 🔄 Automatic Deployments

Both projects will automatically redeploy when you push to your GitHub repository:
- **Backend:** Redeploys on changes to `backend/` folder
- **Frontend:** Redeploys on changes to `frontend/` folder

## 🧪 Testing Your Deployment

### Backend Testing
```bash
# Health check
curl https://your-backend.vercel.app/api/health

# Get assignments
curl https://your-backend.vercel.app/api/assignments
```

### Frontend Testing
1. Visit your frontend URL
2. Browse assignments
3. Try executing a SQL query
4. Test login/registration
5. Check progress tracking

## 🔧 Troubleshooting

### Common Issues:

**1. CORS Errors:**
- Make sure your backend CORS is configured to allow your frontend domain
- Update CORS settings in `backend/server.js` if needed

**2. Database Connection Issues:**
- Verify all environment variables are set correctly
- Check that Neon and MongoDB Atlas allow connections from Vercel IPs

**3. Build Failures:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

**4. API Not Found:**
- Ensure `REACT_APP_API_URL` points to correct backend URL
- Check that backend routes are working

### Environment Variables Checklist:

**Backend:**
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` (PostgreSQL)
- [ ] `MONGODB_URI` (MongoDB)
- [ ] `JWT_SECRET` (secure random string)

**Frontend:**
- [ ] `REACT_APP_API_URL` (backend URL)
- [ ] `GENERATE_SOURCEMAP=false`

## 🎉 Success!

Once deployed, your CipherSQLStudio will be:
- ✅ **Globally accessible** via Vercel's CDN
- ✅ **Automatically scaling** based on usage
- ✅ **Using production databases** (Neon + Atlas)
- ✅ **Continuously deployed** from GitHub

## 📱 Sharing Your Project

Your deployed URLs:
- **Frontend:** `https://your-frontend.vercel.app`
- **Backend API:** `https://your-backend.vercel.app`

Share the frontend URL with others to showcase your SQL learning platform!

---

**Need help?** Check the [Vercel Documentation](https://vercel.com/docs) or create an issue in your GitHub repository.