# 🔁 Project LOOP — AI Customer Feedback Intelligence Platform

> An enterprise-grade, production-ready SaaS platform that ingests customer feedback, classifies it with AI, clusters themes, and answers business questions through a RAG-powered assistant.

---

## 🏗️ Architecture Overview

```
Zidio 1/
├── backend/    # Next.js 14 API server · Prisma · PostgreSQL · Gemini AI
└── frontend/   # Next.js 16 React UI · Tailwind CSS · Recharts
```

**Monorepo** — two independent Next.js apps sharing a common domain.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 AI Classification | Auto-classifies feedback sentiment, score, feature area & summary via Gemini / Ollama |
| 🧵 Theme Clustering | Groups feedback into intelligent AI-generated themes |
| 🔍 Ask LOOP (RAG) | Evidence-based Q&A over your feedback corpus — no hallucinations |
| 📊 Analytics & Dashboard | Real-time breakdown charts, trends, and metrics |
| 📄 VoC Reports | Auto-generates Voice of Customer executive reports |
| 🏢 Multi-Tenant RBAC | Workspace isolation with OWNER / ADMIN / ANALYST / VIEWER roles |
| 📤 CSV Import | Batch feedback ingestion via file upload |
| 🧪 Test Suite | Unit + Integration tests with Zod schema validation |

---

## 🛠️ Tech Stack

### Backend (`/backend`)
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| ORM | Prisma + PostgreSQL |
| Auth | NextAuth v4 (Credentials) |
| AI Providers | Google Gemini · Ollama (local) |
| Validation | Zod |
| Logging | Structured JSON logger (with credential redaction) |

### Frontend (`/frontend`)
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google Gemini API key (or local Ollama instance)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Create `backend/.env` from the template:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/project_loop_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-nextauth-key-at-least-16-chars"
GEMINI_API_KEY="your-gemini-api-key-here"
OLLAMA_BASE_URL="http://localhost:11434"
NODE_ENV="development"
```

### 3. Database Setup

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 4. Run Locally

```bash
# Terminal 1 — Backend (port 3000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 3001)
cd frontend && npm run dev
```

### 5. Verify Backend Health

```bash
curl http://localhost:3000/api/health
```

---

## 📡 API Highlights

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | System health check |
| `GET/POST` | `/api/feedback` | List / create feedback |
| `POST` | `/api/feedback/upload` | CSV batch import |
| `POST` | `/api/ai/classify` | AI classification |
| `POST` | `/api/ai/ask` | Ask LOOP RAG Q&A |
| `POST` | `/api/ai/report` | Generate VoC report |
| `GET` | `/api/analytics` | Analytics breakdown |
| `GET` | `/api/dashboard` | Overview metrics |
| `GET/PUT` | `/api/workspace` | Workspace settings |
| `GET/POST` | `/api/members` | Member management |
| `GET` | `/api/themes` | Theme intelligence |

> Full API specs: `backend/docs/API_DOCUMENTATION.md`

---

## 🔐 Role-Based Access Control

| Role | Permissions |
|---|---|
| `OWNER` | Full access + workspace deletion |
| `ADMIN` | Full access |
| `ANALYST` | CRUD feedback, CSV upload, view analytics |
| `VIEWER` | Read-only (`GET` only) |

---

## 🧪 Testing

```bash
cd backend

# Type check
npx tsc --noEmit

# Unit tests (Zod schema validation)
npm test tests/unit/

# Integration tests
npm test tests/integration/
```

---

## 📁 Project Structure (Backend AI Layer)

```
backend/ai/
├── AIService.ts            # Central AI facade + execution metrics
├── AskLoopService.ts       # RAG Assistant (vector search + QA)
├── ClassificationService.ts# Sentiment, score, feature area & summary
├── EmbeddingService.ts     # Embedding generation + Cosine Similarity
├── PromptManager.ts        # Prompt registry, versioning & interpolation
├── PromptTemplates.ts      # Reusable prompt strings
├── ReportService.ts        # VoC executive report generator
├── ResponseParser.ts       # JSON parser + Zod schema fallbacks
└── ThemeService.ts         # AI theme clustering engine
```

---

## 📚 Documentation

- API Documentation: `backend/docs/API_DOCUMENTATION.md`
- Deployment Checklist: `backend/docs/DEPLOYMENT.md`

---

## 📝 License

Private — All rights reserved © Project LOOP / Zidio
