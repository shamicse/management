# Placement Management System

A modern web-based application built with the **MERN stack** (MongoDB, Express.js, React, Node.js) to automate and simplify the campus recruitment process for colleges, universities, and educational institutions.

> **Full project report:** See [PROJECT_REPORT.md](./PROJECT_REPORT.md) for the complete technical documentation (50+ sections): introduction, architecture, database design, backend/frontend implementation with code examples, API reference, deployment, testing, user manuals, viva questions, and more. Suitable for academic submission and viva preparation.

> **Errors & troubleshooting:** See [ERRORS_AND_FIXES.md](./ERRORS_AND_FIXES.md) for detailed explanations of common errors (loading stuck, Server Error, CORS, port conflicts) and how they were fixed.

## Features

- **Student Module** — Register, manage profile, upload resume, apply for jobs, track application status
- **Recruiter Module** — Register company, post jobs, define eligibility criteria, shortlist candidates
- **Admin Module** — Manage users, approve companies, generate reports, post announcements
- **Job Module** — Job creation, eligibility checking (CGPA, branch, deadline), application management
- **Report Module** — Company-wise and branch-wise placement statistics
- **Interview Module** — Recruiters schedule interviews; students view interview details (time/mode/link/venue)
- **Notifications Module** — In-app notifications + (optional) email delivery for important events
- **Cloud Resume Storage** — Resume uploads support Cloudinary (with local fallback for development)

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router, Vite, Axios |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB (Mongoose ODM)              |
| Auth       | JWT access tokens + refresh tokens (httpOnly cookies) |
| File Upload| Multer + Cloudinary (raw file upload) |

## Project Structure

```
management/
├── backend/
│   ├── config/         # Database connection
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth & file upload
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── uploads/        # Resume storage
│   ├── server.js       # Entry point
│   └── seed.js         # Admin seeder
├── frontend/
│   └── src/
│       ├── components/ # Reusable UI components
│       ├── context/    # Auth context
│       ├── pages/      # Role-based pages
│       └── services/   # API client
└── README.md
```

## Database Collections

| Collection     | Key Fields                                              |
|----------------|---------------------------------------------------------|
| Students       | name, email, phone, branch, cgpa, resume                |
| Recruiters     | companyName, hrName, email, isApproved                  |
| Jobs           | title, salary, criteria, deadline, recruiter            |
| Applications   | student, job, status (Applied/Shortlisted/Selected)     |
| Admin          | username, password                                      |
| Announcements  | title, message, targetRole                              |
| Interviews     | application, scheduledAt, mode, venue/meetingLink       |
| Notifications  | recipient, title, type, message, readAt                 |
| RefreshTokens  | hashed refresh tokens (rotation + revocation)           |

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string

## Setup Instructions

### 1. Clone and install dependencies

```bash
cd management

# Backend
cd backend
npm install
cp .env.example .env    # Edit MONGODB_URI if needed

# Frontend
cd ../frontend
npm install
```

### 1.1 Environment variables (important)

In `backend/.env`, configure (at minimum):
- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGINS` (default `http://localhost:3000`)
- `APP_BASE_URL` (default `http://localhost:3000`)

In `frontend/.env`, configure:
- `VITE_API_BASE_URL` (default `/api`)

For local development, `/api` works because Vite proxies requests to `http://localhost:5000`.
For a Cloudflare Pages/Wrangler frontend deployment, keep `VITE_API_BASE_URL=/api` and set the Pages environment variable `BACKEND_ORIGIN` to the deployed backend origin, for example:

```env
BACKEND_ORIGIN=https://your-backend.example.com
```

Cloudflare Pages only deploys the React frontend from this repo. The Express/Mongo backend must also be deployed to a Node.js host, and that backend must include the Pages URL in `CORS_ORIGINS`:

```env
CORS_ORIGINS=https://your-pages-site.pages.dev
APP_BASE_URL=https://your-pages-site.pages.dev
```

If production uses a new MongoDB database, run `npm run seed` against that production database once so the default admin account exists there.

Optional email (if not set, emails are logged to backend console):
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`

Optional Cloudinary resume storage:
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `CLOUDINARY_RESUME_FOLDER` (default `placement/resumes`)

If Cloudinary env vars are missing, the app automatically falls back to local resume storage in `backend/uploads/resumes`.

### 2. Seed the admin account

```bash
cd backend
npm run seed
```

Default admin credentials:
- **Username:** `admin`
- **Password:** `admin123`

### 3. Start the servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker (optional)

If you want to run everything using Docker:

1. Start containers:

```bash
docker compose up --build
```

2. Seed the admin user (inside the backend container):

```bash
docker compose exec backend npm run seed
```

Then open `http://localhost:3000`.

## Smoke Test (one command)

After backend + frontend + mongo are running:

```bash
npm run smoke
```

This runs a full end-to-end verification:
- recruiter register/login + job post
- student register/login + apply
- status update + interview schedule
- student interview + notification fetch
- includes DB-assisted smoke setup for email verification and recruiter approval

Cleanup smoke test data:

```bash
npm run smoke:cleanup
```

Docker one-click smoke (starts stack, seeds admin, runs smoke):

```bash
npm run smoke:docker
```

If `docker` is not in PATH, set `DOCKER_EXE` first:

```bash
set DOCKER_EXE=C:\Program Files\Docker\Docker\resources\bin\docker.exe
npm run smoke:docker
```

Docker smoke cleanup:

```bash
npm run smoke:docker:cleanup
```

## Production Readiness Baseline

The backend now includes:
- **Env validation** via Zod (`backend/config/env.js`)
- **Structured JSON logging** via Pino
- **Request IDs** (`x-request-id`) for tracing
- **Metrics endpoint** at `GET /metrics` (Prometheus format)
- **Liveness**: `GET /api/health`
- **Readiness**: `GET /api/ready` (checks MongoDB connection state)
- **Graceful shutdown** for `SIGINT` / `SIGTERM`
- **Configurable timeouts/rate limits/pool sizes** via env

### New environment variables

In addition to existing values, you can tune:
- `NODE_ENV`
- `LOG_LEVEL`
- `REQUEST_TIMEOUT_MS`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`
- `AUTH_RATE_LIMIT_MAX`
- `MONGO_MAX_POOL_SIZE`
- `MONGO_MIN_POOL_SIZE`

## Load Testing

Quick local load test on health endpoint:

```bash
npm run load:health
```

Adjust with env variables:
- `LOAD_URL` (default `http://localhost:5000/api/health`)
- `LOAD_CONNECTIONS` (default `100`)
- `LOAD_DURATION_SEC` (default `30`)

Advanced scenario test (requires k6 installed):

```bash
k6 run load-tests/k6-health.js
```

## CI Pipeline

GitHub Actions workflow is included at:
- `.github/workflows/ci.yml`

CI does:
- install root/backend/frontend dependencies
- frontend production build
- seed backend
- run automated smoke test against Mongo service

## Hosting & Scale Guidance

For high-scale production deployment:
- Use **managed MongoDB** (Atlas) with replica set, backups, and alerts.
- Run backend as **multiple stateless replicas** behind a load balancer.
- Put **TLS termination + WAF/CDN** in front (Cloudflare / AWS ALB + WAF).
- Scrape `/metrics` with Prometheus and use Grafana dashboards/alerts.
- Track p95/p99 latency, error rates, saturation (CPU/memory/pool), and queue depths.
- Use blue/green or canary deployments with automatic rollback.
- Store secrets in a managed secret vault (not plain env files in repo).

> Important: “ready for millions” requires iterative load-testing + infra tuning with real traffic profiles. This codebase now includes a strong production baseline and tooling to run that process.

## API Endpoints

| Method | Endpoint                              | Access    | Description                |
|--------|---------------------------------------|-----------|----------------------------|
| POST   | `/api/auth/student/register`          | Public    | Student registration       |
| POST   | `/api/auth/recruiter/register`        | Public    | Recruiter registration     |
| POST   | `/api/auth/login`                     | Public    | Login (all roles)          |
| POST   | `/api/auth/refresh`                   | Cookie    | Rotate refresh token + new access token |
| POST   | `/api/auth/logout`                    | Cookie    | Logout (revoke refresh token) |
| POST   | `/api/auth/verify-email`              | Public    | Verify email (student/recruiter) |
| POST   | `/api/auth/resend-verification`       | Public    | Resend verification email |
| POST   | `/api/auth/forgot-password`           | Public    | Send reset link |
| POST   | `/api/auth/reset-password`            | Public    | Reset password |
| GET    | `/api/jobs`                           | Public    | List active jobs           |
| POST   | `/api/jobs/:id/apply`                | Student   | Apply for a job            |
| GET    | `/api/jobs/student/applications`      | Student   | My applications            |
| POST   | `/api/jobs`                           | Recruiter | Create job posting         |
| GET    | `/api/jobs/:id/applicants`            | Recruiter | View applicants            |
| PUT    | `/api/jobs/:jobId/applications/:id`   | Recruiter | Update application status  |
| POST   | `/api/interviews/applications/:applicationId/schedule` | Recruiter | Schedule interview |
| PUT    | `/api/interviews/:id`                 | Recruiter | Update interview |
| GET    | `/api/interviews/student/me`          | Student   | My interviews |
| GET    | `/api/interviews/recruiter/me`        | Recruiter | My interviews |
| GET    | `/api/notifications/me`               | Auth      | List my notifications |
| PUT    | `/api/notifications/:id/read`         | Auth      | Mark notification read |
| PUT    | `/api/notifications/me/read-all`      | Auth      | Mark all read |
| GET    | `/api/admin/dashboard`                | Admin     | Dashboard statistics       |
| PUT    | `/api/admin/recruiters/:id/approve`   | Admin     | Approve recruiter          |
| GET    | `/api/admin/reports/company`          | Admin     | Company-wise report        |
| GET    | `/api/admin/reports/branch`           | Admin     | Branch-wise report         |

## Pagination & Search (jobs / admin lists)

Some list endpoints support pagination and search. They return:
`{ items, total, page, limit, pages }`

- `GET /api/jobs`: `page`, `limit`, `q`, `branch`, `jobType`
- `GET /api/jobs/recruiter/mine`: `page`, `limit`, `q`
- `GET /api/admin/students`: `page`, `limit`, `q`, `branch`
- `GET /api/admin/recruiters`: `page`, `limit`, `q`, `pending=true`

## User Roles

| Role      | Capabilities                                                    |
|-----------|-----------------------------------------------------------------|
| Student   | Profile, resume upload, job browsing, applications              |
| Recruiter | Company profile, job posting, applicant review & shortlisting   |
| Admin     | User management, company approval, reports, announcements       |

## License

This project is developed for educational purposes.
