# Deployment Configuration for ETROMO

## 1. Supabase Database Setup
1. Log into your [Supabase Dashboard](https://supabase.com).
2. Create a new project (e.g. `etromo-prod`).
3. Open the **SQL Editor** from the left navigation.
4. Copy the entire contents of [`backend/supabase_schema.sql`](file:///D:/Ourcompany/backend/supabase_schema.sql) and click **Run**.
   - This sets up all 21 tables (partners, blogs, products, case studies, team, bookings, contacts, and all B2B client portal tables with foreign keys and indexes).
5. Go to **Project Settings** -> **Database** -> **Connection string** -> **URI** (Transaction Pooler or Direct).
   - Format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
6. Save this as your `DATABASE_URL` environment variable.

---

## 2. Environment Variables (.env)

### Backend (.env / Hosting Provider Environment):
```env
PORT=5000
DATABASE_URL=postgresql://postgres.[your-project-ref]:[your-db-password]@aws-0-[region].pooler.supabase.com:6543/postgres
DATABASE_SSL=true
NODE_ENV=production
```

### Frontend / Web App (.env.production):
```env
# Optional: only needed if backend is hosted on a separate custom domain
# VITE_API_URL=https://api.yourdomain.com
```

---

## 3. Hosting Options & File Upload

### Option A: Render / Railway / Heroku (Unified Full-Stack — Recommended)
- **Build Command**: `npm run build` (builds the Vite React frontend into `web-app/dist`)
- **Start Command**: `npm start` (starts `backend/index.js` which serves APIs at `/api/*` and the static SPA frontend)
- **Environment Variables**: Add `DATABASE_URL` and `NODE_ENV=production`

### Option B: Vercel / Netlify (Frontend) + Render / Railway (Backend)
- **Frontend (web-app)**:
  - Root directory: `web-app`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Add Environment Variable: `VITE_API_URL=https://your-backend.onrender.com`
- **Backend (backend)**:
  - Root directory: `backend`
  - Build command: `npm install`
  - Start command: `node index.js`
  - Add Environment Variable: `DATABASE_URL` pointing to Supabase.
