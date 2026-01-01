# 🚀 Deployment Guide - LastNightPYQs

This guide will walk you through deploying your MERN application to production using **Render** (backend) and **Netlify** (frontend).

---

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ GitHub account
- ✅ MongoDB Atlas account (free tier)
- ✅ Cloudinary account (free tier)
- ✅ Your code pushed to a GitHub repository
- ✅ All environment variables ready

---

## 🗄️ Part 1: MongoDB Atlas Setup

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose the **FREE** tier (M0)
   - Select a cloud provider and region (choose one closest to your users)
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Set privileges to "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is needed for Render to connect

5. **Get Connection String**
   - Go to "Database" and click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `lastnightpyqs`)

---

## ☁️ Part 2: Cloudinary Setup

1. **Create Cloudinary Account**
   - Go to [Cloudinary](https://cloudinary.com/)
   - Sign up for a free account

2. **Get API Credentials**
   - Go to your Dashboard
   - Copy these values:
     - Cloud Name
     - API Key
     - API Secret

---

## 🔧 Part 3: Deploy Backend to Render

### Step 1: Prepare Your Repository

Make sure your backend code is in the `backend` folder and pushed to GitHub.

### Step 2: Create Render Account

1. Go to [Render](https://render.com/)
2. Sign up with your GitHub account

### Step 3: Create New Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:

   **Basic Settings:**
   - **Name**: `lastnightpyqs-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `production-deployment` (or `main`)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

   **Instance Type:**
   - Select **Free** tier

### Step 4: Add Environment Variables

In the "Environment Variables" section, add the following:

| Key | Value |
|-----|-------|
| `PORT` | `3000` |
| `MONGODB_URI` | Your MongoDB connection string from Part 1 |
| `JWT_SECRET` | Generate a random string (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `JWT_EXPIRY` | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `FRONTEND_URL` | Leave empty for now (we'll update this after deploying frontend) |

### Step 5: Deploy

1. Click "Create Web Service"
2. Wait for the deployment to complete (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://lastnightpyqs-backend.onrender.com`
4. **Save this URL** - you'll need it for the frontend!

### Step 6: Test Backend

Visit these URLs to verify:
- `https://your-backend-url.onrender.com/` - Should show "LastNightPYQs API is running"
- `https://your-backend-url.onrender.com/health` - Should return JSON with status "OK"

> **Note**: Render free tier spins down after 15 minutes of inactivity. First request after inactivity may take 30-60 seconds.

---

## 🎨 Part 4: Deploy Frontend to Netlify

### Step 1: Create Netlify Account

1. Go to [Netlify](https://www.netlify.com/)
2. Sign up with your GitHub account

### Step 2: Create New Site

1. Click "Add new site" → "Import an existing project"
2. Choose "Deploy with GitHub"
3. Select your repository
4. Configure build settings:

   **Build Settings:**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   - **Branch to deploy**: `production-deployment` (or `main`)

### Step 3: Add Environment Variables

Before deploying, click "Show advanced" → "New variable"

Add this environment variable:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://your-backend-url.onrender.com/api` (use your Render backend URL from Part 3) |

### Step 4: Deploy

1. Click "Deploy site"
2. Wait for deployment to complete (2-5 minutes)
3. You'll get a URL like: `https://random-name-123.netlify.app`

### Step 5: Custom Domain (Optional)

1. Go to "Site settings" → "Domain management"
2. Click "Add custom domain" to use your own domain
3. Or click "Change site name" to customize the Netlify subdomain

---

## 🔄 Part 5: Update Backend CORS

Now that you have your frontend URL, update the backend:

1. Go back to your Render dashboard
2. Select your backend service
3. Go to "Environment"
4. Add/Update the `FRONTEND_URL` variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-frontend-url.netlify.app` (your actual Netlify URL)
5. Click "Save Changes"
6. Render will automatically redeploy

---

## ✅ Part 6: Verify Everything Works

### Test the Complete Flow:

1. **Visit your frontend URL**
   - The site should load properly

2. **Test Login**
   - Try logging in with admin credentials
   - Check browser console for any errors

3. **Test Paper Upload** (if logged in as admin)
   - Upload a test paper
   - Verify it appears in the list

4. **Test Paper Download**
   - Download a paper
   - Verify the file downloads correctly

5. **Check Browser Console**
   - Open DevTools (F12)
   - Look for any errors in the Console tab
   - Check Network tab to ensure API calls are successful

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend not starting
- Check Render logs: Dashboard → Your Service → Logs
- Verify all environment variables are set correctly
- Ensure MongoDB connection string is correct

**Problem**: CORS errors
- Verify `FRONTEND_URL` is set correctly in Render
- Make sure the URL matches exactly (no trailing slash)

**Problem**: Database connection failed
- Check MongoDB Atlas network access allows 0.0.0.0/0
- Verify connection string has correct password
- Ensure database user has proper permissions

### Frontend Issues

**Problem**: API calls failing
- Check `VITE_API_BASE_URL` is set correctly in Netlify
- Verify backend URL is accessible
- Check browser console for specific error messages

**Problem**: Build fails
- Check Netlify build logs
- Verify all dependencies are in package.json
- Try building locally: `cd frontend && npm run build`

**Problem**: Environment variables not working
- Netlify requires rebuild after changing environment variables
- Go to "Deploys" → "Trigger deploy" → "Clear cache and deploy site"

---

## 🔄 Updating Your Application

### For Code Changes:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin production-deployment
   ```
3. Both Render and Netlify will automatically detect changes and redeploy

### For Environment Variable Changes:

**Render:**
- Update in Dashboard → Environment
- Service will automatically redeploy

**Netlify:**
- Update in Site settings → Environment variables
- Manually trigger a new deploy

---

## 📊 Monitoring

### Render Dashboard
- View logs in real-time
- Monitor service health
- Check deployment history

### Netlify Dashboard
- View build logs
- Monitor site analytics
- Check deployment history

---

## 💡 Tips for Free Tier

1. **Render Free Tier**:
   - Spins down after 15 minutes of inactivity
   - First request may take 30-60 seconds to wake up
   - 750 hours/month free (enough for one service)

2. **Netlify Free Tier**:
   - 100 GB bandwidth/month
   - Unlimited sites
   - Automatic HTTPS

3. **MongoDB Atlas Free Tier**:
   - 512 MB storage
   - Shared RAM
   - Enough for small to medium projects

---

## 🎉 Success!

Your application is now live! Share your URLs:
- **Frontend**: `https://your-app.netlify.app`
- **Backend**: `https://your-app.onrender.com`

Update your GitHub README with these links so others can access your deployed application!

---

## 📝 Next Steps

- Set up custom domain names
- Configure analytics
- Set up monitoring/alerts
- Implement CI/CD improvements
- Add more features!

---

Need help? Check the official documentation:
- [Render Docs](https://render.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
