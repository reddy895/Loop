# Project LOOP — Vercel Deployment & Build Configuration Audit

**Audit Date:** October 2026  
**Auditor:** DevOps & Next.js Architecture Team  
**Repository:** [reddy895/LOOP](https://github.com/reddy895/LOOP)  
**Target Environment:** Vercel Production Deployment  

---

## 1. Executive Summary

A deployment audit was conducted to diagnose and resolve the fatal Vercel build failure:
```
Error: No Next.js version detected.
```
Additionally, the non-fatal npm configuration warning:
```
npm WARN config cache-dir is deprecated. Use cache instead.
```
was analyzed to decouple package-manager telemetry from the build-blocking failure.

---

## 2. Root Cause Analysis

### A. The Fatal Error: `Error: No Next.js version detected.`
1. **Framework Detector Mismatch:**
   - In Vercel's build pipeline, `@vercel/frameworks` inspects the project's **Root Directory** (defaults to `.`).
   - The repository root contained a `vercel.json` with `"framework": "nextjs"`.
   - Vercel's Next.js builder checks `package.json` in the specified root directory for `"next"` under `dependencies` or `devDependencies`.
   - The root directory is a monorepo container (`frontend/` and `backend/`). Initially, the root directory had no `next` dependency declared in its `package.json`.
   - Because `@vercel/next` runs **prior** to executing custom `buildCommand` scripts, it failed to find `next` in `./package.json` and immediately halted with `Error: No Next.js version detected.`.

2. **Root Directory Misalignment:**
   - The primary interactive customer-facing application is `frontend/` (Next.js 16, React 19).
   - In Vercel Project Settings, if the **Root Directory** is not explicitly set to `frontend`, Vercel attempts to detect and build from the repository root.
   - For a monorepo, Vercel requires either:
     - **Option 1 (Recommended):** Setting **Root Directory** = `frontend` in Vercel project settings, allowing Vercel to directly detect `frontend/package.json` and `frontend/package-lock.json`.
     - **Option 2:** Setting up full npm workspaces at the repository root with Next.js version synchronization.

### B. The Warning: `npm WARN config cache-dir is deprecated`
- The root `vercel.json` specified `buildCommand: "cd frontend && npm install && npm run build"`.
- Invoking `npm install` manually inside the build container conflicts with Vercel's native install step and triggers legacy cache flag deprecation warnings on npm 9/10.
- **Resolution:** Decouple package installation from build scripts. Rely on Vercel's native install step or use `npm --prefix frontend run build`.

---

## 3. Application Roles in Monorepo

| Directory | Framework | Runtime | Role & Production Strategy |
|---|---|---|---|
| **`frontend/`** | Next.js 16.3.6 (React 19) | Edge / Serverless | **Intended Vercel Target:** Customer Feedback Intelligence Workspace UI, interactive dashboards, Ask LOOP interface, Recharts visualizations. |
| **`backend/`** | Next.js 14.2.35 (React 18) | Node.js Serverless | **API Microservice:** Prisma ORM, NextAuth v4, Zod validation, RAG similarity search. Can be deployed independently with a managed PostgreSQL database (Neon, Supabase, RDS). |

---

## 4. Remediation Matrix

1. **Root Directory Configuration:** Document and configure `frontend` as the primary Vercel Root Directory.
2. **Monorepo Workspaces:** Add `workspaces: ["frontend", "backend"]` to root `package.json` with Next.js declaration so root-level detection succeeds.
3. **Clean Vercel Config:** Remove redundant `npm install` from `buildCommand`. Ensure `outputDirectory` matches `.next`.
4. **Standardize Package Manager:** Declare `packageManager: "npm@10.8.2"` across manifests.
5. **Add Deployment Health Endpoint:** Verify production availability via dedicated `/api/health` probes.
