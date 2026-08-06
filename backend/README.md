# Project LOOP – AI Customer Feedback Intelligence Platform (Backend)

An enterprise-grade, production-ready SaaS backend built using **Next.js 14 App Router**, **TypeScript**, **Prisma**, **PostgreSQL**, **NextAuth**, **Zod**, and **Google Gemini / Ollama AI**.

---

## 📁 Enterprise Folder Structure

```
backend/
├── ai/                   # AI Intelligence Layer
│   ├── AIService.ts              # Central AI facade and execution metrics logger
│   ├── AskLoopService.ts         # RAG Assistant (Vector search, evidence context & QA)
│   ├── ClassificationService.ts  # Sentiment, score, feature area & summary classification
│   ├── EmbeddingService.ts       # Embedding generation & Cosine Similarity vector math
│   ├── PromptManager.ts          # Central prompt registry, versioning & variable interpolator
│   ├── PromptTemplates.ts        # Reusable prompt strings (Classification, Theme, Report, Ask LOOP)
│   ├── ReportService.ts          # Voice of Customer executive report generator
│   ├── ResponseParser.ts         # Markdown cleaner, JSON parser & Zod schema fallbacks
│   └── ThemeService.ts           # AI theme clustering engine
├── app/                  # Next.js 14 App Router API Routes
│   └── api/
│       ├── ai/                   # AI Endpoints (/classify, /ask, /report)
│       ├── analytics/            # Analytics Endpoint (/api/analytics)
│       ├── dashboard/            # Overview Metrics Endpoint (/api/dashboard)
│       ├── feedback/             # Feedback CRUD, CSV Upload & Simulation
│       ├── health/               # Production Health Check (/api/health)
│       ├── members/              # Workspace Member Management
│       ├── themes/               # Theme Intelligence Endpoints
│       └── workspace/            # Workspace Settings Endpoints
├── auth/                 # NextAuth options & credentials configuration
├── config/               # Centralized Zod env validation system
├── constants/            # System constants, HTTP status codes, error messages & roles
├── docs/                 # Production Documentation
│   ├── API_DOCUMENTATION.md      # Comprehensive REST API specifications
│   └── DEPLOYMENT.md             # Production deployment checklist & instructions
├── lib/                  # Prisma Client singleton instantiation
├── logger/               # Centralized enterprise structured JSON logger
├── middleware/           # Multi-tenant workspace isolation, RBAC & Rate Limiting
├── providers/            # AI Provider Interface implementations (Gemini, Ollama, Factory)
├── services/             # Domain Business Logic (Feedback, Theme, Member, Workspace, CSV)
├── tests/                # Enterprise Testing Architecture
│   ├── fixtures/                 # Test data fixtures
│   ├── integration/              # Integration API tests
│   ├── mock/                     # AI & Auth mock utilities
│   └── unit/                     # Zod schema & unit tests
├── types/                # Strongly typed domain model interfaces
├── utils/                # Response formatting, CSV parser, search, date & pagination helpers
└── validators/           # Zod error map configuration & request schemas
```

---

## 🛠️ Key Capabilities & Highlights

1. **Clean Architecture & SOLID Principles**:
   - Route Handlers remain ultra-thin. Business rules reside exclusively inside Services.
   - All AI interactions go through `AIService` facade and the `IAiProvider` interface.

2. **Multi-Tenant Workspace Isolation & RBAC**:
   - Every query automatically enforces `x-workspace-id` isolation.
   - Access control matrix enforced: `ADMIN` / `OWNER` (full access), `ANALYST` (CRUD feedback, CSV upload, analytics), `VIEWER` (strictly read-only `GET`).

3. **Complete REST API Layer**:
   - Feedback CRUD, server-side pagination, keyword search, multi-field filtering, sorting, CSV batch import, demo simulation.
   - Theme intelligence, Workspace management, Member management, Dashboard & Analytics breakdowns.

4. **AI Layer & RAG Engine**:
   - Automatic sentiment & theme classification on feedback ingestion.
   - 64-dimensional Cosine Similarity vector search engine for RAG.
   - Ask LOOP evidence-based QA assistant (strictly prevents hallucination).
   - Voice of Customer (VoC) executive report generator.

5. **Production Observability & Observability**:
   - Structured JSON logging (`timestamp`, `requestId`, `route`, `method`, `status`, `executionTimeMs`).
   - Redacts sensitive credentials (`passwords`, `tokens`, `secrets`, `apiKeys`).
   - Active health check at `GET /api/health` verifying Database and AI Provider state.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in required secrets:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/project_loop_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-nextauth-key-at-least-16-chars"
GEMINI_API_KEY="your-gemini-api-key-here"
OLLAMA_BASE_URL="http://localhost:11434"
NODE_ENV="development"
```

---

## 🚀 Running Locally & Testing

### Typecheck & Compilation
```bash
npx tsc --noEmit
```

### Development Server
```bash
npm run dev
```

### Health Check Verification
```bash
curl http://localhost:3000/api/health
```

---

## 📚 Documentation References
- Detailed API Specs: [docs/API_DOCUMENTATION.md](file:///c:/Users/prave/OneDrive/Downloads/Zidio%201/backend/docs/API_DOCUMENTATION.md)
- Production Deployment Checklist: [docs/DEPLOYMENT.md](file:///c:/Users/prave/OneDrive/Downloads/Zidio%201/backend/docs/DEPLOYMENT.md)
