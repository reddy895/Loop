# Project LOOP – Production Deployment & Operations Guide

This guide provides step-by-step instructions for deploying and running **Project LOOP Backend** in a production environment.

---

## 1. Environment Variable Guide

Ensure all required environment variables are set in your production environment (`.env.production` or Cloud provider secret manager):

| Variable Name | Required | Example / Format | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | `postgresql://user:pass@host:5432/loop_db?sslmode=require` | PostgreSQL database connection string |
| `NEXTAUTH_URL` | Yes | `https://api.yourdomain.com` | Base URL for NextAuth authentication callback |
| `NEXTAUTH_SECRET` | Yes | `min-16-char-super-random-secret-key` | Encryption secret for JWT sessions |
| `GEMINI_API_KEY` | Optional* | `AIzaSy...` | Google Gemini AI API key |
| `OLLAMA_BASE_URL` | Optional* | `http://localhost:11434` | Base URL for local Ollama server |
| `OLLAMA_MODEL` | Optional | `llama3.2` | Target model for Ollama (`llama3.2`, `qwen2.5`, `gemma`) |
| `NODE_ENV` | Yes | `production` | Environment mode (`production`, `development`, `test`) |

*\* Note: At least ONE AI Provider (`GEMINI_API_KEY` or `OLLAMA_BASE_URL`) must be configured during startup.*

---

## 2. Production Pre-Deployment Checklist

- [x] Environment variables validated ONCE during application startup via Zod.
- [x] Database URL configured with SSL connection parameters (`sslmode=require`).
- [x] NextAuth secret randomized and securely generated (min 16 characters).
- [x] Security headers applied to out-going HTTP responses.
- [x] Rate limiting configured on Auth, AI, CSV, and Report endpoints.
- [x] Multi-tenant workspace isolation verified on all queries.
- [x] `npx tsc --noEmit` verified with 0 compilation errors.

---

## 3. Local & Server Build Instructions

### Step 1: Install Production Dependencies
```bash
npm ci --only=production
```

### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

### Step 3: Compile Production Next.js Bundle
```bash
npm run build
```

### Step 4: Start Production Server
```bash
npm run start
```

---

## 4. Operational Monitoring & Health Check

The backend includes an active health check endpoint to monitor database readiness, AI provider health, and request latency:

```bash
curl -X GET https://api.yourdomain.com/api/health
```

Expected HTTP 200 Payload:
```json
{
  "success": true,
  "message": "Backend operational health check passed.",
  "data": {
    "status": "UP",
    "service": "Project LOOP AI Feedback Intelligence Platform",
    "version": "1.0.0",
    "environment": "production",
    "database": "HEALTHY",
    "aiProvider": {
      "providerName": "Google Gemini AI",
      "status": "ONLINE"
    }
  }
}
```
