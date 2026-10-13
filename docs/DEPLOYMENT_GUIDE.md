# 🚀 Project LOOP — Complete Vercel Deployment & Production Guide

This guide provides end-to-end instructions for deploying Project LOOP to Vercel and production cloud providers, detailing monorepo architecture, environment variables, build configuration, and troubleshooting procedures.

---

## 📋 Pre-Deployment Checklist

- [ ] Clean local git checkout with all 20 production hardening commits applied.
- [ ] Local build validation passed:
  - `npm --prefix frontend run build` (Next.js 16.3.6 / Turbopack with 18 static routes)
  - `npm --prefix backend run build` (Next.js 14.2.35 / Prisma Client generation)
- [ ] All 14 master unit and integration test suites pass (`npm run test`).
- [ ] No hardcoded localhost references in production runtime bundles.
- [ ] Production secret credentials (`NEXTAUTH_SECRET`, `GEMINI_API_KEY`, `DATABASE_URL`) safely secured in Vercel project environment variables.

---

## 🎯 Deployment Architecture Options

### Option 1: Vercel Root Directory Set to `frontend` (Recommended)

This is the standard and cleanest configuration for Vercel:

1. **Import Project:** In Vercel, select **Add New Project** and choose `reddy895/LOOP`.
2. **Root Directory:** Set **Root Directory** to `frontend`.
3. **Framework Preset:** Vercel automatically selects `Next.js`.
4. **Build Command:** Leave as default (`next build` or `npm run build`).
5. **Output Directory:** Leave as default (`.next`).
6. **Environment Variables:**
   | Variable | Required | Example | Description |
   |---|---|---|---|
   | `NEXT_PUBLIC_APP_URL` | Optional | `https://loop-intelligence.vercel.app` | Canonical public URL of your deployment |
   | `NEXT_PUBLIC_API_URL` | Optional | `https://api.loop.yourcompany.com/api` | Optional remote backend API (defaults to relative `/api`) |
7. **Deploy:** Click **Deploy**. Vercel detects Next.js 16, executes Turbopack, and publishes the full-screen Analysis Dashboard.

---

### Option 2: Monorepo Root Deployment (`.`)

If deploying from the repository root without altering Vercel's default Root Directory:

- Root [package.json](file:///home/reddy895/Downloads/Loop-main/package.json) defines npm workspaces (`workspaces: ["frontend", "backend"]`) and declares `next: "^16.3.6"`.
- Root [vercel.json](file:///home/reddy895/Downloads/Loop-main/vercel.json) specifies:
  ```json
  {
    "version": 2,
    "framework": "nextjs",
    "buildCommand": "npm --prefix frontend run build",
    "outputDirectory": "frontend/.next",
    "cleanUrls": true
  }
  ```
- This satisfies Vercel's framework detector (`@vercel/next`) at the repository root and builds the intended frontend application seamlessly.

---

## 🗄️ Backend API & Database Service Setup

If deploying the backend service (`backend/`):

1. **Vercel Project Setup:**
   - Create a second Vercel Project pointing to `reddy895/LOOP`.
   - Set **Root Directory** to `backend`.
   - Set **Build Command** to `npm run build` (`prisma generate && next build`).
2. **Database Provisioning:**
   - Provision a managed PostgreSQL instance (e.g., Neon, Supabase, AWS RDS, Railway).
   - Apply migrations:
     ```bash
     cd backend
     npx prisma migrate deploy
     ```
3. **Backend Environment Variables:**
   | Variable | Required | Description |
   |---|---|---|
   | `DATABASE_URL` | **Yes** | PostgreSQL connection URL with pooling (`postgresql://...`) |
   | `NEXTAUTH_SECRET` | **Yes** | 32+ character high-entropy cryptographic secret |
   | `NEXTAUTH_URL` | Optional | Canonical production backend URL |
   | `GEMINI_API_KEY` | Optional | Google Gemini 1.5 Flash API key (falls back gracefully to offline heuristic engine if omitted) |
   | `NODE_ENV` | **Yes** | `production` |

---

## 🛠️ Root Cause Diagnosis of Common Errors

### 1. `Error: No Next.js version detected`
- **Root Cause:** Occurs when Vercel's project Root Directory is set to `.` (the monorepo root), but root `package.json` does not declare `next` under `dependencies`. Vercel's Next.js builder checks `./package.json` before executing any build scripts.
- **Resolution:**
  1. Preferred: Set **Root Directory** to `frontend` in Vercel project settings.
  2. Alternative: Retain root `.`, which now declares npm workspaces and `next: "^16.3.6"` in the root `package.json`.

### 2. `npm WARN config cache-dir is deprecated`
- **Root Cause:** A deprecated configuration in npm 10 or an inline `cd frontend && npm install` in build scripts that invoked npm's internal cache flags within the container.
- **Resolution:** Standardized `.npmrc` with `engine-strict=true`, declared `packageManager: npm@10.8.2`, and eliminated nested `npm install` calls in `vercel.json`.

---

## 🔍 Post-Deployment Verification

1. Navigate to `/dashboard` — Verify KPI cards, volume chart, sentiment breakdown, and theme cluster bars render cleanly.
2. Open `/workspace` — Verify the full-width analysis workspace loads with ticket inspection drawers.
3. Test CSV Ingestion — Click **Retrieve CSV** to switch between Enterprise, App Store, and Zendesk datasets.
4. Test Ask LOOP — Query the RAG assistant to verify evidence citations and answer synthesis.
