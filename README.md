# 🔁 Project LOOP — AI Customer Feedback Intelligence Platform

> **LOOP** is an enterprise-grade, full-screen AI customer feedback intelligence workspace. It aggregates, parses, and classifies multi-channel customer feedback, identifies emerging thematic clusters, generates executive Voice of Customer (VoC) briefs, and powers evidence-backed Q&A via an offline-resilient Retrieval-Augmented Generation (RAG) assistant.

---

## 🏗️ Monorepo Architecture Overview

```
LOOP-main/
├── backend/    # Next.js 14 API server · Prisma ORM · NextAuth · Gemini / Ollama RAG
├── frontend/   # Next.js 16 (React 19) UI · Tailwind CSS v4 · Recharts · Lucide Icons
├── docs/       # Architecture audit, baseline inventory & production hardening logs
└── vercel.json # Vercel cloud deployment specification
```

---

## ✨ Core Product Capabilities

| Module | Capability & Specification |
|---|---|
| **Full-Screen Workspace** | Fluid, responsive intelligence layout reclaiming horizontal screen real estate, removing heavy border clutter and card nesting. |
| **Data Ingestion & CSV Engine** | High-performance streaming CSV parser with strict MIME/size validation, formula injection (`=,+,-,@,\|`) neutralization, and batch database loading. |
| **Multi-Tenant Isolation & RBAC** | Strict tenant scoping (`workspaceId`) on all server-side queries. Role-Based Access Control enforcing `OWNER`, `ADMIN`, `ANALYST`, and `MEMBER` permissions. |
| **Real Analytics Engine** | Server-backed calculations for volume trends, sentiment breakdown, active theme distribution, and date-range filtering (`7d`, `30d`, `all`). |
| **Ask LOOP (RAG Assistant)** | Vector cosine similarity search over tenant customer tickets, strict prompt injection fencing, and evidence grounding with zero hallucinations. |
| **VoC Executive Briefs** | Automated generation of Voice of Customer summaries, top friction drivers, customer quote citations, and CSV/PDF report exports. |
| **Resilient AI Pipeline** | Dual-provider support (Google Gemini 1.5 Flash & Ollama) with a deterministic heuristic fallback engine ensuring 100% uptime during external API outages. |

---

## 🛠️ Technology Stack

### Backend (`/backend`)
- **Runtime & Framework:** Next.js 14 (App Router), Node.js 18+
- **Language:** TypeScript 5 (Strict Mode)
- **Database & ORM:** Prisma 5 (Dual-compatible: SQLite for zero-setup local dev; PostgreSQL for production cloud)
- **Authentication & Security:** NextAuth v4, Bcrypt password hashing, sliding-window rate limiting, IDOR prevention
- **AI & Retrieval:** Cosine vector embeddings, PromptManager templates, prompt injection fences
- **Testing:** Custom TSX runner, 13 automated unit & integration test suites

### Frontend (`/frontend`)
- **Runtime & Framework:** Next.js 16 (App Router), React 19
- **Styling & Tokens:** Tailwind CSS v4, bespoke design tokens, subtle borders, high contrast
- **Visualizations:** Recharts (responsive, client-mounted, resilient zero-state handling)
- **Client Architecture:** Unified `@/lib/api` client with automatic tenant header injection and error handling

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js 18.x or 20.x
- npm 9+

### 2. Installation
```bash
# Clone and install dependencies
git clone https://github.com/reddy895/Loop.git
cd Loop

# Install Backend
cd backend && npm install

# Install Frontend
cd ../frontend && npm install
```

### 3. Environment Setup
```bash
# Configure Backend
cd backend
cp .env.example .env
npm run db:generate

# Configure Frontend
cd ../frontend
cp .env.example .env.local
```

### 4. Running the Development Servers
```bash
# Terminal 1: Start Backend (Port 3000)
cd backend
npm run dev

# Terminal 2: Start Frontend (Port 3001)
cd frontend
npm run dev
```

Visit **http://localhost:3001/dashboard** in your browser.

---

## 🧪 Quality Gates & Automated Tests

LOOP includes 13 automated test suites covering cryptographic security, schema validation, rate limiting, formula injection, tenant boundaries, CRUD lifecycle, and RAG grounding:

```bash
# Run all frontend unit tests
npm run test:frontend

# Run all backend unit & integration tests
npm run test

# Run entire monorepo quality suite
npm run test:all

# Validate frontend linting compliance
npm run lint

# Validate frontend production build
npm run build
```

### Test Suite Inventory:
**Backend Test Suites (14 Suites):**
1. `[UNIT] Cryptographic Password & Token Salting`
2. `[UNIT] Authentication & Validation Schemas`
3. `[UNIT] Sliding-Window Rate Limiting & Brute-Force`
4. `[UNIT] Spreadsheet Formula Injection Neutralization`
5. `[UNIT] Prompt Injection Neutralization & Fencing`
6. `[UNIT] Deployment Configuration & Production Invariants`
7. `[INTEGRATION] Authentication Lifecycle & Sessions`
8. `[INTEGRATION] Password Reset Lifecycle & Replay Prevention`
9. `[INTEGRATION] Multi-Tenant Isolation & Privilege Spoofing`
10. `[INTEGRATION] Server-Side RBAC Boundaries & Hierarchy`
11. `[INTEGRATION] Feedback CRUD Lifecycle & IDOR Defense`
12. `[INTEGRATION] CSV Ingestion & Multi-Tenant Batch Ingestion`
13. `[INTEGRATION] AI Fallback & Offline RAG Architecture`
14. `[INTEGRATION] Server-Side Date Filtering & RAG Grounding`

**Frontend Test Suites (3 Suites):**
1. `[UNIT] FeedbackCharts Data & Fallback Invariants`
2. `[UNIT] Environment Resolution & API URL Normalization`
3. `[UNIT] Dataset Schema & Seed Integrity Constraints`

---

## ☁️ Vercel Production Deployment

> **Detailed Guide:** See [docs/DEPLOYMENT_GUIDE.md](file:///home/reddy895/Downloads/Loop-main/docs/DEPLOYMENT_GUIDE.md) for complete step-by-step instructions, environment variable tables, and troubleshooting.

### Option A: Monorepo Root Deployment (One-Click)
1. Import the repository directly to [Vercel](https://vercel.com/new).
2. The root `vercel.json` and `package.json` automatically detect and build the Next.js frontend application.
3. No environment variables required for instant demo exploration — the Analysis Dashboard comes preloaded with full intelligence!

### Option B: Independent Microservices Deployment
1. **Frontend UI (Edge / Serverless):**
   - Root Directory: `frontend`
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Instant Analysis Dashboard: Preloaded with 1,482 customer intelligence records, sentiment clustering, and RAG assistant citations.

2. **Backend API (Optional / Cloud Scale):**
   - Root Directory: `backend`
   - Build Command: `npm run postinstall && next build`
   - Output Directory: `.next`
   - Environment Variables:
     - `DATABASE_URL`: `postgresql://...` (Neon, Supabase, RDS)
     - `NEXTAUTH_SECRET`: Strong 32+ character random string
     - `GEMINI_API_KEY`: Google Generative AI API key
     - `NODE_ENV`: `production`

---

## 🔒 Security Best Practices
- **No Client Secrets:** AI keys and database credentials remain strictly server-side.
- **Formula Injection Immunity:** All CSV inputs and exports sanitize leading `=,+,-,@,\|, \t, \r`.
- **Tenant Scoping:** All database operations strictly mandate `where: { workspaceId }`.
- **Prompt Fencing:** External customer feedback strings are neutralized and bounded before inclusion in LLM prompts.
