# Project LOOP – REST API Documentation

Comprehensive enterprise REST API specification for **Project LOOP – AI Customer Feedback Intelligence Platform**.

---

## Standard JSON Response Formats

### Success Response Format (HTTP 200 / 201)
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { ... }
}
```

### Error Response Format (HTTP 400 / 401 / 403 / 404 / 429 / 500)
```json
{
  "success": false,
  "message": "Error description message.",
  "errors": [
    "Field '[content]' Feedback content is required."
  ]
}
```

---

## Role-Based Access Control (RBAC) Matrix

| User Role | Feedback CRUD | CSV Import | Simulation | Themes & Analytics | Workspace Config | Member Management |
|---|---|---|---|---|---|---|
| **OWNER / ADMIN** | Read / Write / Delete | Yes | Yes | Full Access | Full Access | Full Access |
| **ANALYST** | Read / Write / Delete | Yes | Yes | Full Access | Read Only | Read Only |
| **VIEWER** | Read Only | No | No | Read Only | Read Only | Read Only |

---

## 1. System Health Endpoint

### `GET /api/health`
Verifies backend operational status, database connectivity, AI provider readiness, and response latency.

- **Authentication**: None (Public)
- **Response**:
```json
{
  "success": true,
  "message": "Backend operational health check passed.",
  "data": {
    "status": "UP",
    "service": "Project LOOP AI Feedback Intelligence Platform",
    "version": "1.0.0",
    "environment": "development",
    "serverTime": "2026-08-06T11:15:00.000Z",
    "uptimeSeconds": 342,
    "responseTimeMs": 12,
    "database": "HEALTHY",
    "aiProvider": {
      "providerName": "Google Gemini AI",
      "status": "ONLINE"
    }
  }
}
```

---

## 2. Feedback Module Endpoints

### `GET /api/feedback`
List workspace feedback records with pagination, keyword search, multi-field filtering, and sorting.

- **Authentication**: Required (`x-workspace-id`, `x-user-role`)
- **Query Parameters**:
  - `page` (number, default: 1)
  - `limit` (number, default: 10, max: 100)
  - `search` (string, optional - keyword search across content, customer label, source)
  - `channel` (string, optional - e.g. "Website", "App Store", "Play Store", "Support Ticket", "Survey")
  - `status` (string, optional - "NEW", "UNDER_REVIEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED")
  - `sentiment` (string, optional - "POSITIVE", "NEUTRAL", "NEGATIVE")
  - `themeId` (string, optional)
  - `customer` (string, optional)
  - `sortBy` (string, default: "newest" - "newest", "oldest", "sentiment", "channel", "status", "customer")
  - `sortOrder` (string, default: "desc" - "asc", "desc")
- **Example Response**:
```json
{
  "success": true,
  "message": "Feedback records retrieved successfully.",
  "data": {
    "items": [
      {
        "id": "fb_1",
        "workspaceId": "ws_default",
        "content": "The new analytics dashboard is incredibly fast!",
        "channel": "Website",
        "status": "NEW",
        "customerLabel": "Enterprise User",
        "source": "Web Application",
        "sentiment": "POSITIVE",
        "sentimentScore": 0.92,
        "themeId": "thm_1",
        "themeName": "UI & Usability",
        "isDeleted": false,
        "createdAt": "2026-08-05T11:00:00.000Z",
        "updatedAt": "2026-08-05T11:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 1,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
}
```

### `POST /api/feedback`
Ingest new customer feedback into the workspace. Automatically runs AI auto-classification and assigns status `"NEW"`.

- **Authentication**: Required (`ADMIN`, `ANALYST`, `OWNER`)
- **Request Body**:
```json
{
  "content": "Mobile app crashes when opening settings menu.",
  "channel": "App Store",
  "customerLabel": "VIP Customer",
  "source": "iOS Mobile App"
}
```
- **Response**: HTTP 201 Created

### `PATCH /api/feedback/:id`
Update an existing feedback record.

- **Authentication**: Required (`ADMIN`, `ANALYST`, `OWNER`)
- **Path Parameters**: `id` (Feedback Record ID)
- **Request Body**:
```json
{
  "status": "RESOLVED",
  "content": "Updated feedback text content"
}
```

### `DELETE /api/feedback/:id`
Soft-delete a feedback record (`isDeleted: true`).

- **Authentication**: Required (`ADMIN`, `ANALYST`, `OWNER`)

### `POST /api/feedback/upload`
Bulk import customer feedback from CSV payload.

- **Authentication**: Required (`ADMIN`, `ANALYST`, `OWNER`)
- **Headers**: `Content-Type: multipart/form-data` OR `application/json`
- **Request Body (JSON)**:
```json
{
  "csvContent": "content,channel,customerlabel\n\"Great app UI\",Website,\"VIP User\""
}
```
- **Response**:
```json
{
  "success": true,
  "message": "CSV feedback batch import completed.",
  "data": {
    "importedCount": 1,
    "failedCount": 0,
    "totalProcessed": 1,
    "errors": [],
    "importedFeedback": [...]
  }
}
```

### `POST /api/feedback/simulate`
Generate realistic demo feedback across channels.

- **Authentication**: Required (`ADMIN`, `ANALYST`, `OWNER`)
- **Request Body**:
```json
{
  "count": 5,
  "channels": ["Play Store", "App Store", "Website", "Support Ticket", "Survey"]
}
```

---

## 3. Theme Module Endpoints

### `GET /api/themes`
List workspace themes with aggregated feedback counts and trend predictions.

### `GET /api/themes/:id`
Retrieve theme details, associated paginated feedback, total counts, and sentiment percentage breakdown.

---

## 4. Workspace Module Endpoints

### `GET /api/workspace`
Retrieve active workspace details, member counts, feedback counts, and report counts.

### `PATCH /api/workspace`
Update workspace configuration (`ADMIN` / `OWNER` only).

---

## 5. Member Module Endpoints

### `GET /api/members`
List workspace members with role filtering and pagination.

### `POST /api/members`
Invite new workspace member (`ADMIN` / `OWNER` only).

### `PATCH /api/members/:id`
Update member role or status (`ADMIN` / `OWNER` only).

### `DELETE /api/members/:id`
Remove member from workspace (`ADMIN` / `OWNER` only).

---

## 6. Analytics Module Endpoints

### `GET /api/dashboard`
Returns high-level dashboard metrics, top themes, recent feedback, and daily volume/sentiment trends.

### `GET /api/analytics`
Returns volume over time (14 days), theme distribution percentages, sentiment distribution percentages, weekly trends, and monthly trends.

---

## 7. AI Intelligence Endpoints

### `POST /api/ai/classify`
Reclassify feedback by `feedbackId` or raw `content` text.

### `POST /api/ai/ask`
Execute Ask LOOP RAG question answering over workspace feedback evidence.
- **Request Body**:
```json
{
  "question": "What are customers saying about mobile app crashes?"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Ask LOOP query executed successfully.",
  "data": {
    "answer": "Customers report crashes on Android when accessing settings.",
    "evidence": [
      { "feedbackId": "fb_2", "quote": "Mobile app crashed twice on Android", "channel": "App Store" }
    ],
    "feedbackIds": ["fb_2"],
    "confidence": 0.91
  }
}
```

### `POST /api/ai/report`
Generate Voice of Customer (VoC) executive report.
- **Request Body**:
```json
{
  "forceRefresh": false
}
```
