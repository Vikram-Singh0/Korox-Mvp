# KOROX Deployment Guide 🚀

Complete deployment instructions for KOROX frontend (Vercel) and backend (Render).

---

## ✅ Current Status

- **Backend**: Deployed on Render → `https://korox-mvp.onrender.com`
- **Frontend**: Ready to deploy on Vercel
- **Environment**: Backend URL configured in frontend `.env.local`

---

## 🎯 Quick Deploy Checklist

### Frontend → Vercel

1. **Install Vercel CLI** (if not already installed):
   ```powershell
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```powershell
   vercel login
   ```

3. **Deploy from frontend directory**:
   ```powershell
   cd frontend
   vercel --prod
   ```
   
   Or deploy via Vercel Dashboard:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repo: `Vikram-Singh0/Korox-Mvp`
   - Set **Root Directory**: `frontend`
   - Framework: Next.js (auto-detected)
   - Click **Deploy**

4. **Add Environment Variable in Vercel**:
   - Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**
   - Add:
     ```
     Key:   NEXT_PUBLIC_API_URL
     Value: https://korox-mvp.onrender.com
     ```
   - Apply to: **Production, Preview, Development**
   - Click **Save**

5. **Redeploy** (after adding env var):
   - Go to **Deployments** tab
   - Click **⋮** on latest deployment → **Redeploy**
   - Or push a new commit to trigger auto-deploy

---

## 🔧 Backend Configuration (Render)

Your backend is already deployed, but here's the configuration reference:

### Render Service Settings

| Setting | Value |
|---------|-------|
| **Build Command** | `npm install --include=dev && tsc` |
| **Start Command** | `npm start` |
| **Root Directory** | `backend` |
| **Environment** | Node.js 22.x |

### Environment Variables (on Render)

Add these in **Render Dashboard → Service → Environment**:

```bash
PORT=4000
NODE_ENV=production
NPM_CONFIG_PRODUCTION=false  # Ensures devDependencies installed during build
```

Add any additional secrets from your `.env` file (RPC endpoints, API keys, etc.)

---

## 🌐 CORS Configuration

Your backend already has CORS enabled for all origins:

```typescript
app.use(cors());
```

For production, you can optionally restrict to your Vercel domain:

```typescript
app.use(cors({
  origin: ["https://your-frontend.vercel.app"],
  credentials: true
}));
```

---

## 🧪 Testing After Deployment

### Test Backend (Render)

```powershell
# Health check
curl https://korox-mvp.onrender.com/

# Get supported chains
curl https://korox-mvp.onrender.com/api/chains
```

### Test Frontend → Backend Connection

1. Open your deployed Vercel URL
2. Open browser DevTools → **Console** tab
3. Fill out the intent form and submit
4. Check **Network** tab for requests to:
   ```
   https://korox-mvp.onrender.com/api/intents/solve
   ```
5. Verify response status is `200 OK`

---

## 📦 Local Development

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

### Backend

```powershell
cd backend
npm install
npm run build
npm start
```

Backend runs on: `http://localhost:4000`

To use local backend in frontend development:
- Update `frontend/.env.local`:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:4000
  ```

---

## 🚨 Troubleshooting

### Frontend can't connect to backend

**Check:**
1. Environment variable is set in Vercel: `NEXT_PUBLIC_API_URL`
2. Redeployed after adding env var
3. Backend is running (test: `curl https://korox-mvp.onrender.com/`)
4. CORS is enabled on backend
5. Browser console shows correct API URL in network requests

### Backend build fails on Render

**Solution:**
- Ensure `NPM_CONFIG_PRODUCTION=false` is set in Render environment variables
- Or use build command: `npm install --include=dev && tsc`

### Render service goes to sleep (free tier)

**Issue:** Free Render services sleep after 15 min of inactivity
**Solution:**
- Upgrade to paid tier for 24/7 uptime
- Or implement a keep-alive ping service

---

## 📝 Deployment Commands Reference

### Push code changes
```powershell
git add .
git commit -m "Deploy updates"
git push origin main
```

### Rebuild frontend locally
```powershell
cd frontend
npm run build
```

### Rebuild backend locally
```powershell
cd backend
npm run build
```

---

## 🎉 Post-Deployment

Once deployed:

1. **Test the full flow**:
   - Visit your Vercel URL
   - Submit a test intent (e.g., Asset Hub → Hydration, 10 WND)
   - Verify optimal route is returned

2. **Monitor logs**:
   - **Vercel**: Dashboard → Functions tab → View logs
   - **Render**: Dashboard → Logs tab

3. **Set up custom domain** (optional):
   - Vercel: Settings → Domains
   - Render: Settings → Custom Domain

---

## 🔗 Useful Links

- **Backend (Render)**: https://korox-mvp.onrender.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **GitHub Repo**: https://github.com/Vikram-Singh0/Korox-Mvp

---

**Need Help?** Check:
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Next.js Env Vars: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
