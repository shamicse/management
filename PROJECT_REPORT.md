# PLACEMENT MANAGEMENT SYSTEM
## Complete Project Report & Technical Documentation

**Project Title:** Placement Management System (PlaceHub)  
**Technology Stack:** MERN (MongoDB, Express.js, React, Node.js)  
**Document Version:** 1.0  
**Date:** June 2026  
**Purpose:** Academic submission, viva preparation, deployment reference, and maintenance guide

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Introduction](#2-introduction)
3. [Problem Statement](#3-problem-statement)
4. [Objectives of the Project](#4-objectives-of-the-project)
5. [Scope of the Project](#5-scope-of-the-project)
6. [Existing System vs Proposed System](#6-existing-system-vs-proposed-system)
7. [Stakeholders and User Roles](#7-stakeholders-and-user-roles)
8. [Technology Stack — What, Why, and How](#8-technology-stack--what-why-and-how)
9. [System Architecture](#9-system-architecture)
10. [Project Directory Structure](#10-project-directory-structure)
11. [Database Design](#11-database-design)
12. [Backend Implementation](#12-backend-implementation)
13. [Frontend Implementation](#13-frontend-implementation)
14. [Authentication and Security](#14-authentication-and-security)
15. [Module-Wise Detailed Explanation](#15-module-wise-detailed-explanation)
16. [API Reference with Examples](#16-api-reference-with-examples)
17. [Workflow Diagrams and Use Cases](#17-workflow-diagrams-and-use-cases)
18. [Deployment Guide](#18-deployment-guide)
19. [Testing Strategy and Results](#19-testing-strategy-and-results)
20. [Production Readiness and Scalability](#20-production-readiness-and-scalability)
21. [Screens and UI Pages](#21-screens-and-ui-pages)
22. [Challenges Faced and Solutions](#22-challenges-faced-and-solutions)
23. [Future Enhancements](#23-future-enhancements)
24. [Conclusion](#24-conclusion)
25. [Appendices](#25-appendices)

---

## 1. EXECUTIVE SUMMARY

The **Placement Management System** is a full-stack web application designed to digitize and automate the campus recruitment process in colleges, universities, and training institutes. Traditionally, placement activities such as student registration, resume collection, company communication, interview scheduling, shortlisting, and result announcements are handled manually using spreadsheets, notice boards, emails, and paper records. This manual approach is time-consuming, error-prone, difficult to scale, and lacks transparency.

The proposed system provides a **centralized digital platform** where three primary stakeholders interact:

- **Students** — register, upload resumes, browse jobs, apply online, track application status, view interviews and notifications
- **Recruiters** — register companies, post vacancies, define eligibility criteria, review applicants, shortlist candidates, schedule interviews
- **Administrators (Placement Cell)** — manage users, approve companies, post announcements, generate reports, monitor placement statistics

The system is built using the **MERN stack**:

| Layer | Technology |
|-------|------------|
| Database | MongoDB |
| Backend API | Node.js + Express.js |
| Frontend UI | React 18 + Vite |
| Authentication | JWT + Refresh Tokens |
| File Storage | Cloudinary (with local fallback) |
| Deployment | Docker Compose + Nginx |

Key capabilities include automatic eligibility checking (CGPA, branch, deadline), in-app and email notifications, interview scheduling, company-wise and branch-wise analytics, pagination/search on list views, production-grade logging and metrics, automated smoke/load testing, and CI pipeline integration.

This document serves as a **complete technical and academic report** covering introduction, design, implementation with code examples, deployment, testing, and production considerations — suitable for project submission, viva voce, and future maintenance.

---

## 2. INTRODUCTION

### 2.1 Background

Campus placement is one of the most critical functions of any educational institution. It connects graduating students with employers and directly impacts institutional reputation, student career outcomes, and industry partnerships. Despite its importance, many institutions still rely on fragmented manual processes:

- Student data maintained in Excel sheets
- Resume collection via email or physical copies
- Company approvals handled over phone/email
- Job postings shared on notice boards or WhatsApp groups
- Interview schedules communicated individually
- Final results announced through spreadsheets or posters

As student and company volumes grow, these methods become unsustainable. Data inconsistency, missed deadlines, lack of audit trails, and poor communication between stakeholders create bottlenecks.

### 2.2 What is the Placement Management System?

The Placement Management System (branded **PlaceHub** in the UI) is a **modern web-based application** that automates the entire placement workflow. It provides:

1. A **single source of truth** for students, companies, jobs, applications, and interviews
2. **Role-based access control** ensuring each user sees only relevant functionality
3. **Automated eligibility validation** before job applications are accepted
4. **Real-time status tracking** for applications from "Applied" to "Selected/Rejected"
5. **Digital notifications** for important events
6. **Analytics dashboards** for placement cell reporting

### 2.3 Why This Project Matters

| Benefit | Description |
|---------|-------------|
| Reduced paperwork | All records stored digitally in MongoDB |
| Transparency | Students see real-time application status |
| Efficiency | Recruiters shortlist and schedule in one platform |
| Scalability | Handles growing student/company volumes with pagination |
| Security | JWT auth, password hashing, rate limiting, input validation |
| Auditability | Timestamps, notifications, and structured logs |
| Institutional reporting | Company-wise and branch-wise statistics instantly |

### 2.4 Target Institutions

- Engineering colleges
- Management institutes (MBA)
- Universities
- Skill development centers
- Training institutes
- Polytechnic colleges

---

## 3. PROBLEM STATEMENT

In the traditional placement process:

1. **Student registration** is done on paper or via disconnected Google Forms with no central database.
2. **Resume collection** happens through email, leading to version confusion and storage issues.
3. **Company communication** is informal — placement officers manually coordinate with HR teams.
4. **Job postings** are shared via notice boards; students may miss deadlines.
5. **Eligibility checking** (CGPA, branch, backlogs) is manual and error-prone.
6. **Shortlisting** is done in spreadsheets without student visibility.
7. **Interview scheduling** requires separate emails/calls per candidate.
8. **Result announcements** lack a unified notification mechanism.
9. **Reports** (company-wise, branch-wise placement stats) require manual Excel aggregation.
10. **No security model** — sensitive student data may be shared insecurely.

**Problem:** There is no integrated, secure, scalable digital system to manage the complete placement lifecycle.

**Solution:** Build a MERN-based Placement Management System with role-based modules, automated workflows, and production-ready infrastructure.

---

## 4. OBJECTIVES OF THE PROJECT

### 4.1 Primary Objective

To automate the entire placement workflow and create an efficient digital environment for students, recruiters, and the placement cell.

### 4.2 Specific Objectives

| # | Objective | How Achieved |
|---|-----------|--------------|
| 1 | Reduce manual paperwork | Digital forms, MongoDB storage, resume upload |
| 2 | Centralized database | 9 MongoDB collections with relationships |
| 3 | Online student registration and job applications | Student module + Job module |
| 4 | Recruiter job posting and shortlisting | Recruiter module + application status updates |
| 5 | Admin control over placement activities | Admin module with approvals and reports |
| 6 | Instant reports and statistics | Aggregation pipelines for company/branch reports |
| 7 | Improved communication | Notifications + announcements + email |
| 8 | Secure data handling | bcrypt, JWT, validation, helmet, rate limits |
| 9 | Interview management | Interview scheduling module |
| 10 | Production readiness | Docker, CI, smoke tests, load tests, metrics |

---

## 5. SCOPE OF THE PROJECT

### 5.1 In Scope

- Student registration, login, profile management, resume upload
- Recruiter registration (with admin approval), job posting, applicant management
- Admin dashboard, user management, company approval, announcements, reports
- Job applications with automatic eligibility checking
- Application status workflow: Applied → Shortlisted → Interview → Selected/Rejected
- Interview scheduling (online/offline, meeting link, venue)
- In-app notifications and optional email delivery
- Company-wise and branch-wise placement reports
- Pagination and search on jobs, students, recruiters lists
- Docker deployment, smoke testing, load testing, CI pipeline
- Cloud resume storage via Cloudinary

### 5.2 Out of Scope (Future Work)

- Payment/fee collection for placement training
- Video interview integration (Zoom/Teams SDK)
- Mobile native apps (iOS/Android) — web is responsive
- AI-based resume parsing and job matching
- Multi-campus / multi-tenant SaaS architecture
- SMS/WhatsApp production integration (stubs exist)

---

## 6. EXISTING SYSTEM VS PROPOSED SYSTEM

| Aspect | Existing (Manual) System | Proposed (Digital) System |
|--------|---------------------------|---------------------------|
| Student data | Excel / paper forms | MongoDB `students` collection |
| Resume storage | Email attachments | Cloudinary or local upload |
| Job postings | Notice board, WhatsApp | Recruiter portal with deadlines |
| Eligibility | Manual verification | Automatic CGPA/branch/deadline check |
| Applications | Email / paper | Online apply with status tracking |
| Shortlisting | Spreadsheet | Recruiter updates status in system |
| Interviews | Phone/email scheduling | Interview module with notifications |
| Results | Poster / email blast | Status update + notification |
| Reports | Manual Excel pivot | Admin reports API (aggregation) |
| Security | None / shared files | JWT, bcrypt, role-based access |
| Scalability | Poor | Pagination, Docker, load tested |

---

## 7. STAKEHOLDERS AND USER ROLES

### 7.1 Student

**Who:** Final-year or eligible students seeking campus placement.

**Capabilities:**
- Register with academic details (branch, CGPA)
- Upload resume (PDF/DOC)
- Browse and search job openings
- Apply for eligible jobs
- Track application status
- View scheduled interviews
- Receive notifications

**Default flow:** Register → Verify email → Login → Complete profile → Browse jobs → Apply → Track status

### 7.2 Recruiter

**Who:** Company HR representatives visiting campus for recruitment.

**Capabilities:**
- Register company (pending admin approval)
- Post jobs with eligibility criteria
- View applicants per job
- Update application status (shortlist, interview, select, reject)
- Schedule interviews
- Manage company profile

**Default flow:** Register → Admin approves → Login → Post job → Review applicants → Shortlist → Schedule interview

### 7.3 Administrator (Placement Cell)

**Who:** Placement officer or training & placement cell staff.

**Capabilities:**
- Approve/reject recruiter registrations
- Activate/deactivate students and recruiters
- View all students, recruiters, jobs
- Post announcements (all/students/recruiters)
- Generate company-wise and branch-wise reports
- Monitor dashboard statistics

**Default credentials (seeded):** Username: `admin` | Password: `admin123`

---

## 8. TECHNOLOGY STACK — WHAT, WHY, AND HOW

### 8.1 MongoDB (Database)

**What:** NoSQL document database storing data as BSON (JSON-like) documents in collections.

**Why chosen:**
- Flexible schema — job criteria, notification metadata vary per record
- Fast development — no rigid migrations for academic project iteration
- Native JSON — aligns with JavaScript/Node.js ecosystem
- Horizontal scaling via sharding (production path)
- Mongoose ODM provides validation, middleware, population (joins)

**How used:**
- 9 collections: students, recruiters, admins, jobs, applications, interviews, notifications, announcements, refreshtokens
- Mongoose schemas define field types, validation, indexes
- `populate()` for references (e.g., job → recruiter, application → student)
- Aggregation pipelines for reports

**Example — Student schema with password hashing:**

```javascript
// backend/models/Student.js
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, required: true },
  branch: { type: String, required: true },
  cgpa: { type: Number, required: true, min: 0, max: 10 },
  resume: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
}, { timestamps: true });

studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

---

### 8.2 Express.js (Backend Framework)

**What:** Minimal, unopinionated Node.js web framework for building REST APIs.

**Why chosen:**
- Industry standard for Node.js APIs
- Middleware ecosystem (auth, validation, security, logging)
- Easy routing and JSON handling
- Large community and documentation

**How used:**
- `server.js` as entry point
- Route files per domain (`authRoutes`, `jobRoutes`, etc.)
- Controllers contain business logic
- Middleware chain: helmet → cors → rateLimit → auth → validate → handler

**Example — Server middleware stack:**

```javascript
// backend/server.js (simplified)
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize());  // Prevent NoSQL injection
app.use(hpp());            // Prevent HTTP parameter pollution
app.use('/api', rateLimit({ windowMs: 900000, max: 300 }));
```

---

### 8.3 React (Frontend Library)

**What:** JavaScript library for building component-based user interfaces.

**Why chosen:**
- Component reusability (Navbar, Layout, StatusBadge)
- Virtual DOM for efficient updates
- Huge ecosystem (React Router, Axios)
- Industry demand — MERN is widely used

**How used:**
- Single Page Application (SPA) with React Router v6
- Role-based nested routes in `App.jsx`
- Context API for authentication state (`AuthContext`)
- Axios client with JWT interceptor (`api.js`)
- Page components per role (student/, recruiter/, admin/)

**Example — Protected routing:**

```jsx
// frontend/src/App.jsx
<Route path="/student/*" element={
  <ProtectedRoute role="student">
    <Layout>
      <Routes>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="jobs" element={<StudentJobs />} />
        <Route path="applications" element={<StudentApplications />} />
      </Routes>
    </Layout>
  </ProtectedRoute>
} />
```

---

### 8.4 Node.js (Runtime)

**What:** JavaScript runtime built on Chrome's V8 engine, enabling server-side JavaScript.

**Why chosen:**
- Same language (JavaScript) for frontend and backend
- Non-blocking I/O — good for API servers
- npm ecosystem with extensive packages
- Docker-friendly deployment

**How used:**
- Runs Express server on port 5000
- Handles file uploads via Multer
- Sends emails via Nodemailer
- Runs seed scripts and smoke tests

---

### 8.5 Vite (Frontend Build Tool)

**What:** Next-generation frontend build tool with fast HMR (Hot Module Replacement).

**Why chosen over Create React App:**
- Much faster dev server startup
- Native ES modules
- Optimized production builds
- Simple configuration

**How used:**

```javascript
// frontend/vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
});
```

During development, API calls to `/api/*` are proxied to the backend, avoiding CORS issues.

---

### 8.6 JWT (JSON Web Tokens) — Authentication

**What:** Compact, URL-safe token format for securely transmitting claims between parties.

**Why chosen:**
- Stateless authentication — no server-side sessions
- Works well with SPA architecture
- Supports role embedding in token payload
- Industry standard

**How used:**
- **Access token** (short-lived, 15 min) — sent in `Authorization: Bearer` header
- **Refresh token** (7 days) — stored in httpOnly cookie, rotated on refresh
- `protect` middleware verifies token on protected routes
- `authorize('student')` middleware enforces role

**Example — Token generation:**

```javascript
// backend/middleware/auth.js
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '15m',
  });
};

const generateRefreshToken = (id, role) => {
  return jwt.sign(
    { id, role, type: 'refresh', jti: crypto.randomUUID() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d' }
  );
};
```

---

### 8.7 Supporting Technologies

| Technology | Purpose | Why |
|------------|---------|-----|
| **bcryptjs** | Password hashing | One-way hash, salt rounds = 10 |
| **Zod** | Input validation | Type-safe schema validation for API bodies |
| **Helmet** | HTTP security headers | XSS, clickjacking protection |
| **express-rate-limit** | Rate limiting | Prevent brute force / abuse |
| **express-mongo-sanitize** | NoSQL injection prevention | Strip `$` operators from input |
| **Multer** | File upload handling | Resume uploads |
| **Cloudinary** | Cloud file storage | Scalable resume storage in production |
| **Nodemailer** | Email sending | Verification, password reset, notifications |
| **Pino** | Structured logging | JSON logs for production monitoring |
| **prom-client** | Prometheus metrics | `/metrics` endpoint for observability |
| **Axios** | HTTP client (frontend) | Interceptors for auth token refresh |
| **Docker** | Containerization | Consistent deployment across environments |
| **Nginx** | Reverse proxy (frontend container) | Serves React build, proxies API |
| **GitHub Actions** | CI/CD | Automated build and smoke test on push |
| **autocannon / k6** | Load testing | Performance baseline verification |

---

## 9. SYSTEM ARCHITECTURE

### 9.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│                    (React SPA — Port 3000)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/HTTPS
                             │ /api/*  /uploads/*
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              NGINX (Production) / Vite Proxy (Dev)                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXPRESS.JS API SERVER                         │
│                      (Port 5000)                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │  Auth    │ │  Jobs    │ │  Admin   │ │  Notifications   │ │
│  │  Routes  │ │  Routes  │ │  Routes  │ │  Interviews      │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬─────────┘ │
│       └────────────┴────────────┴─────────────────┘            │
│                         Controllers                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Middleware: helmet, cors, rateLimit, auth, validate      │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ Mongoose ODM
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MONGODB DATABASE                            │
│  students | recruiters | jobs | applications | interviews    │
│  notifications | announcements | admins | refreshtokens        │
└─────────────────────────────────────────────────────────────────┘

External Services:
  ├── Cloudinary (resume storage)
  ├── SMTP Server (email — optional)
  └── Prometheus (metrics scraping — optional)
```

### 9.2 Three-Tier Architecture Mapping

| Tier | Implementation |
|------|----------------|
| Presentation Tier | React frontend (components, pages, routing) |
| Application Tier | Express.js REST API (controllers, middleware) |
| Data Tier | MongoDB (collections, indexes, aggregations) |

### 9.3 Request Flow Example — Student Applies for Job

```
1. Student clicks "Apply" on StudentJobs page
2. Frontend: api.post('/jobs/:id/apply') with Bearer token
3. Axios interceptor attaches JWT from localStorage
4. Express: rateLimit → auth(protect) → authorize('student')
5. jobController.applyForJob():
   a. Fetch job from DB
   b. Fetch student profile
   c. checkEligibility(student, job) — CGPA, branch, deadline
   d. Create Application document
   e. createNotification() — in-app alert to student
6. Response: 201 Created with application object
7. Frontend shows success message
```

---

## 10. PROJECT DIRECTORY STRUCTURE

```
management/
├── .github/workflows/ci.yml       # GitHub Actions CI pipeline
├── backend/
│   ├── config/
│   │   ├── cloudinary.js        # Cloudinary SDK configuration
│   │   ├── db.js                  # MongoDB connection with pool settings
│   │   └── env.js                 # Zod-validated environment variables
│   ├── controllers/               # Business logic per domain
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── interviewController.js
│   │   ├── jobController.js
│   │   ├── notificationController.js
│   │   ├── recruiterController.js
│   │   └── studentController.js
│   ├── middleware/
│   │   ├── auth.js                # JWT protect + authorize + token generation
│   │   ├── upload.js              # Multer + Cloudinary storage
│   │   └── validate.js            # Zod validation middleware
│   ├── models/                    # Mongoose schemas (9 models)
│   ├── routes/                    # Express route definitions
│   ├── utils/
│   │   ├── email.js               # Nodemailer wrapper
│   │   ├── logger.js              # Pino structured logger
│   │   ├── metrics.js             # Prometheus metrics
│   │   ├── notify.js              # Notification creation + email/SMS stubs
│   │   └── tokens.js              # Random token + SHA-256 hashing
│   ├── validators/
│   │   └── authValidators.js      # Zod schemas for auth endpoints
│   ├── Dockerfile
│   ├── seed.js                    # Admin seeder script
│   └── server.js                  # Application entry point
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── context/               # AuthContext provider
│   │   ├── pages/                 # Role-based page components
│   │   │   ├── admin/             # 6 admin pages
│   │   │   ├── recruiter/         # 5 recruiter pages
│   │   │   ├── student/           # 5 student pages
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Notifications.jsx
│   │   ├── services/api.js        # Axios client with refresh interceptor
│   │   ├── App.jsx                # Route definitions
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles
│   ├── Dockerfile                 # Multi-stage: Vite build → Nginx
│   ├── nginx.conf                 # SPA routing + API proxy
│   └── vite.config.js
├── scripts/
│   ├── smoke.mjs                  # End-to-end smoke test
│   ├── smoke-cleanup.mjs
│   ├── smoke-docker.mjs
│   ├── smoke-docker-cleanup.mjs
│   └── load-autocannon.mjs        # Load test script
├── load-tests/k6-health.js        # k6 load test scenario
├── docker-compose.yml
├── package.json                   # Root scripts (smoke, load)
├── README.md                      # Quick start guide
└── PROJECT_REPORT.md              # This document
```

---

## 11. DATABASE DESIGN

### 11.1 Entity-Relationship Overview

```
Student ──────< Application >────── Job ────── Recruiter
   │                │                │
   │                │                │
   └──< Interview   │                │
                    │                │
              Notification      Announcement ─── Admin
```

### 11.2 Collection Details

#### 11.2.1 Students Collection

| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Primary key |
| name | String | Full name |
| email | String | Unique, lowercase |
| password | String | bcrypt hashed |
| phone | String | Contact number |
| branch | String | CSE, ECE, IT, etc. |
| cgpa | Number | 0.0 – 10.0 |
| resume | String | URL or local path |
| isActive | Boolean | Admin can deactivate |
| emailVerified | Boolean | Must be true to login |
| emailVerificationTokenHash | String | Hashed verification token |
| emailVerificationExpiresAt | Date | Token expiry |
| passwordResetTokenHash | String | Hashed reset token |
| passwordResetExpiresAt | Date | Reset token expiry |
| createdAt | Date | Auto timestamp |
| updatedAt | Date | Auto timestamp |

#### 11.2.2 Recruiters Collection

| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Primary key |
| companyName | String | Company name |
| hrName | String | HR contact person |
| email | String | Unique login email |
| password | String | bcrypt hashed |
| phone | String | Optional |
| website | String | Company website |
| description | String | About company |
| isApproved | Boolean | Admin must approve |
| isActive | Boolean | Can be deactivated |
| emailVerified | Boolean | Email verification status |

#### 11.2.3 Jobs Collection

| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Primary key |
| title | String | Job title |
| description | String | Full description |
| salary | String | e.g., "6 LPA" |
| location | String | Job location |
| jobType | Enum | Full-time, Internship, Contract |
| criteria.minCgpa | Number | Minimum CGPA required |
| criteria.branches | [String] | Eligible branches or "All" |
| criteria.maxBacklogs | Number | Maximum allowed backlogs |
| deadline | Date | Application deadline |
| recruiter | ObjectId | Reference to Recruiter |
| isActive | Boolean | Soft delete flag |
| vacancies | Number | Number of openings |

**Example Job document:**

```json
{
  "_id": "65abc123...",
  "title": "Software Engineer",
  "description": "Full-stack development role...",
  "salary": "8 LPA",
  "location": "Bangalore",
  "jobType": "Full-time",
  "criteria": {
    "minCgpa": 7.5,
    "branches": ["CSE", "IT"],
    "maxBacklogs": 0
  },
  "deadline": "2026-07-01T00:00:00.000Z",
  "recruiter": "65abc000...",
  "isActive": true,
  "vacancies": 5
}
```

#### 11.2.4 Applications Collection

| Field | Type | Description |
|-------|------|-------------|
| student | ObjectId | Reference to Student |
| job | ObjectId | Reference to Job |
| status | Enum | Applied, Shortlisted, Interview, Selected, Rejected |
| appliedAt | Date | Application timestamp |
| remarks | String | Recruiter remarks |

**Unique index:** `(student, job)` — prevents duplicate applications.

#### 11.2.5 Interviews Collection

| Field | Type | Description |
|-------|------|-------------|
| application | ObjectId | Unique — one interview per application |
| job | ObjectId | Reference to Job |
| student | ObjectId | Reference to Student |
| recruiter | ObjectId | Reference to Recruiter |
| scheduledAt | Date | Interview date/time |
| mode | Enum | Online, Offline |
| venue | String | Physical location (offline) |
| meetingLink | String | URL (online) |
| notes | String | Additional instructions |
| status | Enum | Scheduled, Rescheduled, Completed, Cancelled |

#### 11.2.6 Notifications Collection

| Field | Type | Description |
|-------|------|-------------|
| recipientRole | Enum | student, recruiter, admin |
| recipient | ObjectId | User ID |
| type | Enum | application_status, interview_scheduled, system, etc. |
| title | String | Notification title |
| message | String | Notification body |
| metadata | Object | Related IDs (jobId, applicationId) |
| channels | Object | inApp, email, sms, whatsapp flags |
| readAt | Date | Null if unread |

#### 11.2.7 Other Collections

- **admins** — username, password (hashed), name
- **announcements** — title, message, targetRole (all/student/recruiter), createdBy
- **refreshtokens** — tokenHash, userId, role, expiresAt, revokedAt (for secure refresh flow)

---

## 12. BACKEND IMPLEMENTATION

### 12.1 Server Entry Point (`server.js`)

The server follows production best practices:

1. **Environment validation** via Zod before startup
2. **Request ID** (`x-request-id`) on every request for tracing
3. **Structured logging** with Pino
4. **Security middleware** chain
5. **Health and readiness** endpoints
6. **Prometheus metrics** at `/metrics`
7. **Graceful shutdown** on SIGINT/SIGTERM

**Health endpoint response:**

```json
GET /api/health
{
  "status": "ok",
  "service": "placement-management-backend",
  "uptimeSec": 3600,
  "timestamp": "2026-06-17T10:30:00.000Z"
}
```

**Readiness endpoint:**

```json
GET /api/ready
{ "status": "ready" }          // 200 when MongoDB connected
{ "status": "not_ready", "mongo": 0 }  // 503 when disconnected
```

### 12.2 Controller Pattern

Business logic is separated into controllers. Example — **Job listing with pagination and search:**

```javascript
// backend/controllers/jobController.js
const getJobs = async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1'), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '8'), 1), 50);
  const skip = (page - 1) * limit;

  const filter = { isActive: true };
  const { branch, jobType, q } = req.query;

  if (branch) filter['criteria.branches'] = { $in: [branch, 'All'] };
  if (jobType) filter.jobType = jobType;
  if (q) {
    const rx = new RegExp(String(q), 'i');
    filter.$or = [{ title: rx }, { description: rx }];
  }

  const [total, jobs] = await Promise.all([
    Job.countDocuments(filter),
    Job.find(filter)
      .populate('recruiter', 'companyName hrName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  res.json({ items: jobs, total, page, limit, pages: Math.ceil(total / limit) });
};
```

**API call example:**

```
GET /api/jobs?page=1&limit=8&q=software&branch=CSE&jobType=Full-time
```

### 12.3 Eligibility Checking Logic

When a student applies for a job, the system automatically validates eligibility:

```javascript
const checkEligibility = (student, job) => {
  if (student.cgpa < job.criteria.minCgpa) {
    return { eligible: false, reason: `Minimum CGPA required: ${job.criteria.minCgpa}` };
  }

  const branches = job.criteria.branches || [];
  if (branches.length > 0 && !branches.includes('All') && !branches.includes(student.branch)) {
    return { eligible: false, reason: `Not eligible for branch: ${student.branch}` };
  }

  if (new Date() > new Date(job.deadline)) {
    return { eligible: false, reason: 'Application deadline has passed' };
  }

  return { eligible: true };
};
```

**Example scenarios:**

| Student CGPA | Student Branch | Job Min CGPA | Job Branches | Result |
|--------------|----------------|--------------|--------------|--------|
| 8.5 | CSE | 7.0 | [CSE, IT] | ✅ Eligible |
| 6.0 | CSE | 7.0 | [CSE] | ❌ CGPA too low |
| 8.0 | MECH | 7.0 | [CSE] | ❌ Branch not eligible |
| 9.0 | CSE | 7.0 | [CSE] | ❌ If deadline passed |

### 12.4 Input Validation with Zod

```javascript
// backend/validators/authValidators.js
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must include a lowercase letter')
  .regex(/[A-Z]/, 'Password must include an uppercase letter')
  .regex(/[0-9]/, 'Password must include a number');

const registerStudentSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(254),
  password: passwordSchema,
  phone: z.string().min(8).max(20),
  branch: z.string().min(2).max(40),
  cgpa: z.number().min(0).max(10),
});
```

Invalid input returns structured error:

```json
{
  "message": "Validation failed",
  "errors": [
    { "path": "password", "message": "Password must include an uppercase letter" }
  ]
}
```

### 12.5 Notification System

```javascript
// backend/utils/notify.js
const createNotification = async ({
  recipientRole, recipient, type, title, message, metadata, channels
}) => {
  const doc = await Notification.create({ ... });

  if (channels.email) {
    await sendEmail({ to: userEmail, subject: title, text: message });
  }
  // SMS and WhatsApp are stubbed for future integration
  return doc;
};
```

**Triggered automatically when:**
- Student applies for a job
- Recruiter updates application status
- Recruiter schedules/updates an interview

---

## 13. FRONTEND IMPLEMENTATION

### 13.1 Application Bootstrap

```jsx
// frontend/src/main.jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

### 13.2 Authentication Context

```jsx
// frontend/src/context/AuthContext.jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  // Persists to localStorage on change
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 13.3 Axios Client with Token Refresh

The frontend automatically refreshes expired access tokens:

```javascript
// frontend/src/services/api.js
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const { data } = await api.post('/auth/refresh');  // Uses httpOnly cookie
      user.token = data.token;
      localStorage.setItem('user', JSON.stringify(user));
      return api(original);  // Retry original request
    }
    return Promise.reject(error);
  }
);
```

### 13.4 Login Page Flow

```jsx
// frontend/src/pages/Login.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  const { data } = await api.post('/auth/login', { email, password, role });
  login(data);  // Store user + token in context/localStorage

  const routes = {
    student: '/student/dashboard',
    recruiter: '/recruiter/dashboard',
    admin: '/admin/dashboard',
  };
  navigate(routes[data.role]);
};
```

### 13.5 Student Jobs Page — Search, Filter, Pagination

The student jobs page demonstrates production UI patterns:

- **Search** by title/description (`q` query param)
- **Filter** by branch and job type
- **Pagination** with Previous/Next controls
- **Apply** button with eligibility error display

```jsx
// Simplified from frontend/src/pages/StudentJobs.jsx
useEffect(() => {
  const params = { page, limit, q, branch, jobType };
  api.get('/jobs', { params }).then((res) => {
    setJobs(res.data.items);
    setPages(res.data.pages);
  });
}, [page, q, branch, jobType]);
```

### 13.6 Recruiter Job Applicants — Interview Scheduling

Recruiters can update application status and schedule interviews inline:

```jsx
// From frontend/src/pages/recruiter/JobApplicants.jsx
const submitSchedule = async () => {
  await api.post(`/interviews/applications/${applicationId}/schedule`, {
    scheduledAt: scheduleForm.scheduledAt,
    mode: scheduleForm.mode,
    meetingLink: scheduleForm.meetingLink,
    venue: scheduleForm.venue,
    notes: scheduleForm.notes,
  });
};
```

### 13.7 UI Component Library

| Component | File | Purpose |
|-----------|------|---------|
| Layout | `Layout.jsx` | Wraps pages with Navbar |
| Navbar | `Navbar.jsx` | Role-based navigation links |
| ProtectedRoute | `ProtectedRoute.jsx` | Redirects unauthenticated users |
| StatusBadge | `StatusBadge.jsx` | Color-coded application status |

**Status badge colors:**
- Applied — blue
- Shortlisted — yellow
- Interview — purple
- Selected — green
- Rejected — red

---

## 14. AUTHENTICATION AND SECURITY

### 14.1 Authentication Flow

```
Registration:
  Student/Recruiter submits form
  → Password validated (Zod: 8+ chars, upper, lower, number)
  → Password hashed (bcrypt, 10 rounds)
  → User saved to MongoDB
  → Verification email sent (token hashed in DB)
  → Refresh token issued (httpOnly cookie)

Login:
  User submits email + password + role
  → Email must be verified (students/recruiters)
  → Recruiter must be admin-approved
  → Password compared with bcrypt
  → Access token (15 min) returned in JSON
  → Refresh token (7 days) set in httpOnly cookie

Token Refresh:
  Access token expires → API returns 401
  → Frontend calls POST /auth/refresh (cookie sent automatically)
  → Old refresh token revoked, new one issued (rotation)
  → New access token returned
  → Original request retried

Logout:
  → Refresh token revoked in DB
  → Cookie cleared
  → localStorage cleared
```

### 14.2 Security Measures Implemented

| Measure | Implementation | Protects Against |
|---------|----------------|------------------|
| bcrypt password hashing | 10 salt rounds | Rainbow table attacks |
| JWT access tokens | Short-lived (15 min) | Token theft window |
| Refresh token rotation | New token on each refresh | Replay attacks |
| httpOnly cookies | Refresh token not accessible via JS | XSS token theft |
| Helmet | Security HTTP headers | XSS, clickjacking |
| Rate limiting | 300 req/15min general, 30/15min auth | Brute force, DDoS |
| mongo-sanitize | Strip `$` from input | NoSQL injection |
| HPP | HTTP Parameter Pollution protection | Parameter tampering |
| Zod validation | Strict input schemas | Invalid/malicious input |
| CORS whitelist | Only allowed origins | Cross-origin attacks |
| Role-based access | authorize() middleware | Privilege escalation |
| Request timeout | 30 second limit | Slowloris / hung requests |
| Env validation | Zod on startup | Misconfiguration |
| Strong password rules | 8+ chars, mixed case, number | Weak passwords |

### 14.3 Email Verification Flow

```
1. User registers → verification token generated (random 32 bytes)
2. Token hashed (SHA-256) and stored in DB with 24h expiry
3. Email sent with link: /login?verifyToken=RAW_TOKEN&role=student&email=...
4. User clicks link → frontend calls POST /api/auth/verify-email
5. Server hashes submitted token, compares with DB hash
6. If match and not expired → emailVerified = true
```

### 14.4 Password Reset Flow

```
1. User requests reset → POST /api/auth/forgot-password
2. Reset token generated, hashed, stored with 15 min expiry
3. Email sent with reset link
4. User submits new password → POST /api/auth/reset-password
5. Password updated, all refresh tokens revoked
```

---

## 15. MODULE-WISE DETAILED EXPLANATION

### 15.1 Student Module

**Pages:** Dashboard, Browse Jobs, My Applications, Interviews, Notifications, Profile

**Workflow:**
1. Register with name, email, password, phone, branch, CGPA
2. Verify email via link
3. Login → redirected to dashboard
4. Upload resume on Profile page (PDF/DOC, max 5MB)
5. Browse jobs with search/filter
6. Click "Apply Now" — system checks eligibility automatically
7. Track status on My Applications page
8. View interview details on Interviews page
9. Read notifications on Notifications page

**Dashboard shows:**
- Total applications count
- Shortlisted count
- Selected count
- Latest job openings
- Recent announcements

### 15.2 Recruiter Module

**Pages:** Dashboard, My Jobs, Post Job, Job Applicants, Notifications, Profile

**Workflow:**
1. Register company (waits for admin approval)
2. After approval, login and access dashboard
3. Post new job with title, description, salary, criteria, deadline
4. View applicants for each job
5. Update status: Applied → Shortlisted → Interview → Selected/Rejected
6. Schedule interview for shortlisted candidates
7. Student receives notification automatically

**Post Job form fields:**
- Title, Description, Salary, Location
- Job Type (Full-time/Internship/Contract)
- Vacancies count
- Application deadline
- Eligibility: Min CGPA, eligible branches (checkboxes), max backlogs

### 15.3 Admin Module

**Pages:** Dashboard, Students, Recruiters, Jobs, Reports, Announcements, Notifications

**Key operations:**
- **Approve recruiters** — pending companies appear in Recruiters page with Approve/Reject buttons
- **Toggle student/recruiter status** — activate or deactivate accounts
- **View reports:**
  - Company-wise: applications, shortlisted, selected, rejected per company
  - Branch-wise: applications, shortlisted, selected, avg CGPA per branch
- **Post announcements** — target all users, students only, or recruiters only

**Dashboard statistics:**
- Total students, recruiters, jobs, applications
- Pending recruiter approvals count
- Application status breakdown (pie chart data)

### 15.4 Job Module

Handles the complete job lifecycle:
- Creation by recruiter
- Public listing with pagination/search
- Eligibility checking on apply
- Application tracking
- Status updates by recruiter
- Soft delete (deactivate) by recruiter

### 15.5 Interview Module

```javascript
// Scheduling creates/updates interview and notifies student
const interview = await Interview.findOneAndUpdate(
  { application: application._id },
  { scheduledAt, mode, venue, meetingLink, notes, status: 'Scheduled' },
  { upsert: true, new: true }
);

// Application status auto-updated to "Interview"
application.status = 'Interview';
await application.save();

// Notification sent to student
await createNotification({
  type: 'interview_scheduled',
  title: 'Interview Scheduled',
  message: `Your interview for "${job.title}" is scheduled on ${date}.`,
  channels: { inApp: true, email: true },
});
```

### 15.6 Report Module

**Company-wise report** uses MongoDB aggregation:

```javascript
// Simplified aggregation pipeline
Application.aggregate([
  { $lookup: { from: 'jobs', localField: 'job', foreignField: '_id', as: 'jobData' } },
  { $unwind: '$jobData' },
  { $lookup: { from: 'recruiters', localField: 'jobData.recruiter', foreignField: '_id', as: 'recruiterData' } },
  { $unwind: '$recruiterData' },
  { $group: {
      _id: '$recruiterData.companyName',
      totalApplications: { $sum: 1 },
      shortlisted: { $sum: { $cond: [{ $eq: ['$status', 'Shortlisted'] }, 1, 0] } },
      selected: { $sum: { $cond: [{ $eq: ['$status', 'Selected'] }, 1, 0] } },
  }},
]);
```

**Sample output:**

| Company | Total Applications | Shortlisted | Selected |
|---------|-------------------|-------------|----------|
| TCS | 45 | 12 | 5 |
| Infosys | 38 | 10 | 4 |
| Wipro | 30 | 8 | 3 |

---

## 16. API REFERENCE WITH EXAMPLES

### 16.1 Authentication APIs

#### Register Student
```http
POST /api/auth/student/register
Content-Type: application/json

{
  "name": "Rahul Sharma",
  "email": "rahul@college.edu",
  "password": "SecurePass1",
  "phone": "9876543210",
  "branch": "CSE",
  "cgpa": 8.5
}
```

**Response (201):**
```json
{
  "_id": "65abc...",
  "name": "Rahul Sharma",
  "email": "rahul@college.edu",
  "branch": "CSE",
  "role": "student",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "emailVerified": false
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "role": "student",
  "email": "rahul@college.edu",
  "password": "SecurePass1"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIs...
```

### 16.2 Job APIs

#### List Jobs (with pagination)
```http
GET /api/jobs?page=1&limit=8&q=engineer&branch=CSE
```

**Response:**
```json
{
  "items": [ { "_id": "...", "title": "Software Engineer", "salary": "8 LPA", ... } ],
  "total": 25,
  "page": 1,
  "limit": 8,
  "pages": 4
}
```

#### Apply for Job
```http
POST /api/jobs/65abc123/apply
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Success (201):** Application object created  
**Error (400):** `{ "message": "Minimum CGPA required: 7.5" }`

#### Update Application Status (Recruiter)
```http
PUT /api/jobs/65abc123/applications/65def456
Authorization: Bearer <recruiter_token>
Content-Type: application/json

{
  "status": "Shortlisted",
  "remarks": "Good profile, proceed to interview"
}
```

### 16.3 Interview APIs

#### Schedule Interview
```http
POST /api/interviews/applications/65def456/schedule
Authorization: Bearer <recruiter_token>

{
  "scheduledAt": "2026-06-20T10:00:00.000Z",
  "mode": "Online",
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "notes": "Technical round — DSA and system design"
}
```

### 16.4 Admin APIs

#### Approve Recruiter
```http
PUT /api/admin/recruiters/65abc789/approve
Authorization: Bearer <admin_token>
```

#### Company-wise Report
```http
GET /api/admin/reports/company
Authorization: Bearer <admin_token>
```

### 16.5 Complete Endpoint Summary

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | /api/auth/student/register | Public | Register student |
| POST | /api/auth/recruiter/register | Public | Register recruiter |
| POST | /api/auth/login | Public | Login |
| POST | /api/auth/refresh | Cookie | Refresh token |
| POST | /api/auth/logout | Public | Logout |
| POST | /api/auth/verify-email | Public | Verify email |
| POST | /api/auth/forgot-password | Public | Request reset |
| POST | /api/auth/reset-password | Public | Reset password |
| GET | /api/students/profile | Student | Get profile |
| PUT | /api/students/profile | Student | Update profile |
| POST | /api/students/resume | Student | Upload resume |
| GET | /api/jobs | Public | List jobs |
| POST | /api/jobs | Recruiter | Create job |
| POST | /api/jobs/:id/apply | Student | Apply |
| GET | /api/jobs/student/applications | Student | My applications |
| GET | /api/jobs/:id/applicants | Recruiter | View applicants |
| PUT | /api/jobs/:jobId/applications/:id | Recruiter | Update status |
| POST | /api/interviews/applications/:id/schedule | Recruiter | Schedule interview |
| GET | /api/interviews/student/me | Student | My interviews |
| GET | /api/notifications/me | Auth | My notifications |
| PUT | /api/notifications/:id/read | Auth | Mark read |
| GET | /api/admin/dashboard | Admin | Dashboard stats |
| GET | /api/admin/reports/company | Admin | Company report |
| GET | /api/admin/reports/branch | Admin | Branch report |
| GET | /api/health | Public | Health check |
| GET | /api/ready | Public | Readiness check |
| GET | /metrics | Public | Prometheus metrics |

---

## 17. WORKFLOW DIAGRAMS AND USE CASES

### 17.1 Complete Placement Workflow

```
[Student Registers] → [Verifies Email] → [Logs In]
        ↓
[Uploads Resume] → [Browses Jobs] → [Applies (eligibility checked)]
        ↓
[Recruiter Posts Job] ← [Admin Approves Recruiter]
        ↓
[Recruiter Views Applicants] → [Shortlists Candidate]
        ↓
[Recruiter Schedules Interview] → [Student Notified]
        ↓
[Interview Conducted] → [Recruiter Updates Status: Selected/Rejected]
        ↓
[Admin Generates Reports] → [Placement Statistics Published]
```

### 17.2 Use Case: Student Applies for Job

**Actor:** Student  
**Precondition:** Student is logged in, email verified, resume uploaded  
**Main Flow:**
1. Student navigates to Browse Jobs
2. System displays paginated job list
3. Student searches/filters jobs
4. Student clicks "Apply Now" on a job
5. System checks eligibility (CGPA, branch, deadline)
6. System creates application with status "Applied"
7. System sends notification to student
8. System displays success message

**Alternate Flow (Not Eligible):**
5a. Eligibility check fails
6a. System displays error message (e.g., "Minimum CGPA required: 7.5")
7a. Application is NOT created

### 17.3 Use Case: Recruiter Shortlists and Schedules Interview

**Actor:** Recruiter  
**Precondition:** Recruiter is approved and logged in, job has applicants  
**Main Flow:**
1. Recruiter navigates to Job Applicants page
2. System displays applicant list with resume links
3. Recruiter changes status to "Shortlisted"
4. Recruiter clicks "Schedule" button
5. Recruiter fills interview form (date, mode, link/venue)
6. System creates interview record
7. System updates application status to "Interview"
8. System notifies student (in-app + email)

---

## 18. DEPLOYMENT GUIDE

### 18.1 Local Development Setup

**Prerequisites:** Node.js 18+, MongoDB

```bash
# 1. Clone and install
cd management/backend && npm install
cp .env.example .env   # Edit MONGODB_URI, JWT_SECRET

cd ../frontend && npm install

# 2. Seed admin
cd ../backend && npm run seed

# 3. Start servers (two terminals)
cd backend && npm run dev    # Port 5000
cd frontend && npm run dev   # Port 3000

# 4. Open http://localhost:3000
```

### 18.2 Docker Deployment

```bash
# Start all services
docker compose up --build -d

# Seed admin
docker compose exec backend npm run seed

# Verify
curl http://localhost:5000/api/health
# Open http://localhost:3000
```

**Docker services:**

| Service | Image/Build | Port | Health Check |
|---------|-------------|------|--------------|
| mongo | mongo:7 | 27017 | mongosh ping |
| backend | ./backend | 5000 | GET /api/ready |
| frontend | ./frontend | 3000→80 | wget localhost |

**Nginx configuration (frontend container):**

```nginx
# Proxies API to backend
location /api/ {
  proxy_pass http://backend:5000/api/;
}

# SPA fallback
location / {
  try_files $uri $uri/ /index.html;
}
```

### 18.3 Production Deployment Checklist

- [ ] Set strong `JWT_SECRET` (32+ random characters)
- [ ] Use MongoDB Atlas with replica set
- [ ] Configure Cloudinary for resume storage
- [ ] Set up SMTP for email delivery
- [ ] Enable HTTPS (TLS certificate)
- [ ] Set `NODE_ENV=production`
- [ ] Configure `CORS_ORIGINS` to production domain
- [ ] Set up Prometheus + Grafana for `/metrics`
- [ ] Configure log aggregation (ELK, Datadog, etc.)
- [ ] Set up automated backups for MongoDB
- [ ] Use secrets manager (not .env files in repo)
- [ ] Run load tests before go-live
- [ ] Set up CI/CD pipeline (GitHub Actions included)

### 18.4 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 5000 | Server port |
| NODE_ENV | No | development | Environment mode |
| MONGODB_URI | Yes | — | MongoDB connection string |
| JWT_SECRET | Yes | — | JWT signing secret (16+ chars) |
| ACCESS_TOKEN_EXPIRE | No | 15m | Access token lifetime |
| REFRESH_TOKEN_EXPIRE | No | 7d | Refresh token lifetime |
| CORS_ORIGINS | No | http://localhost:3000 | Allowed origins (comma-separated) |
| APP_BASE_URL | No | http://localhost:3000 | Frontend URL for email links |
| LOG_LEVEL | No | info | Pino log level |
| RATE_LIMIT_MAX | No | 300 | Max requests per window |
| MONGO_MAX_POOL_SIZE | No | 50 | MongoDB connection pool max |

---

## 19. TESTING STRATEGY AND RESULTS

### 19.1 Testing Levels

| Level | Tool | What is Tested |
|-------|------|----------------|
| Smoke Test | `scripts/smoke.mjs` | Full end-to-end API flow |
| Load Test | autocannon | Health endpoint throughput |
| Load Test (advanced) | k6 | Ramp-up scenario with thresholds |
| CI Test | GitHub Actions | Build + smoke on every push |
| Manual Test | Browser | UI flows per role |

### 19.2 Smoke Test — Full Flow

**Command:** `npm run smoke` or `npm run smoke:docker`

**Steps tested:**
1. ✅ Recruiter registration
2. ✅ Student registration
3. ✅ Email verification + recruiter approval (DB-assisted in test)
4. ✅ Admin login
5. ✅ Recruiter login
6. ✅ Recruiter posts job
7. ✅ Student login
8. ✅ Student applies for job
9. ✅ Recruiter updates status to Interview
10. ✅ Recruiter schedules interview
11. ✅ Student views interviews (count ≥ 1)
12. ✅ Student views notifications (count ≥ 3)

**Sample output:**
```
PASS - Recruiter registration :: 6a327a75...
PASS - Student registration :: 6a327a75...
PASS - Admin login
PASS - Recruiter login
PASS - Recruiter posted job :: 6a327a75...
PASS - Student login
PASS - Student applied for job :: 6a327a75...
PASS - Recruiter updated application status to Interview
PASS - Recruiter scheduled interview :: 6a327a75...
PASS - Student can view interviews :: count=1
PASS - Student can view notifications :: count=3

SMOKE TEST COMPLETED SUCCESSFULLY
```

**Cleanup:** `npm run smoke:cleanup`

### 19.3 Load Test Results

**Command:** `npm run load:health`

**Configuration:** 100 connections, 30 seconds, target `/api/health`

**Results (sample run on Docker backend):**

| Metric | Value |
|--------|-------|
| Requests/sec (avg) | ~2,034 |
| Total requests | ~61,029 |
| Latency avg | 48.63 ms |
| Latency p50 | 44 ms |
| Latency p99 | 87 ms |
| Errors | 0 |
| Timeouts | 0 |

### 19.4 k6 Load Test

```javascript
// load-tests/k6-health.js
export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Ramp up to 50 users
    { duration: '1m', target: 200 },   // Ramp up to 200 users
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],      // <1% errors
    http_req_duration: ['p(95)<500'],      // 95th percentile < 500ms
  },
};
```

**Run:** `k6 run load-tests/k6-health.js`

### 19.5 CI Pipeline

```yaml
# .github/workflows/ci.yml
# Triggers on: push to any branch, pull requests
# Steps:
#   1. Checkout code
#   2. Setup Node.js 22
#   3. Install dependencies (root, backend, frontend)
#   4. Build frontend (production)
#   5. Seed admin in backend
#   6. Start backend server
#   7. Run npm run smoke
```

### 19.6 Manual Test Cases

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | Student registration | Fill form, submit | Account created, verification email sent |
| 2 | Invalid password | Use "weak" password | Validation error displayed |
| 3 | Duplicate email | Register same email twice | "Email already registered" error |
| 4 | Login without verification | Login before verifying email | "Please verify your email" error |
| 5 | Recruiter pending approval | Login before admin approval | "Company not yet approved" error |
| 6 | Apply ineligible job | CGPA below minimum | Eligibility error message |
| 7 | Apply after deadline | Apply to expired job | "Application deadline has passed" |
| 8 | Duplicate application | Apply twice for same job | "Already applied" error |
| 9 | Resume upload | Upload PDF on profile page | Resume URL saved, view link works |
| 10 | Admin approve recruiter | Click Approve on pending recruiter | Recruiter can login |
| 11 | Pagination | Navigate job list pages | Correct page data loads |
| 12 | Search jobs | Type in search box | Filtered results appear |
| 13 | Schedule interview | Fill schedule form | Interview created, student notified |
| 14 | Mark notification read | Click "Mark read" | Notification marked as read |
| 15 | Company report | Admin → Reports | Table with company statistics |

---

## 20. PRODUCTION READINESS AND SCALABILITY

### 20.1 What is Implemented

| Feature | Status | Details |
|---------|--------|---------|
| Environment validation | ✅ | Zod schema on startup |
| Structured logging | ✅ | Pino JSON logs |
| Request tracing | ✅ | x-request-id header |
| Health checks | ✅ | /api/health, /api/ready |
| Metrics | ✅ | Prometheus /metrics |
| Graceful shutdown | ✅ | SIGINT/SIGTERM handling |
| Rate limiting | ✅ | Configurable per route |
| Connection pooling | ✅ | MongoDB pool (5-50) |
| Docker healthchecks | ✅ | All 3 services |
| CI pipeline | ✅ | GitHub Actions |
| Smoke tests | ✅ | One-command E2E |
| Load tests | ✅ | autocannon + k6 |
| Pagination | ✅ | Jobs, students, recruiters |
| Token refresh | ✅ | Rotation with revocation |

### 20.2 Scalability Path for High Traffic

```
Current (Single Instance):
  Docker Compose → 1 backend + 1 MongoDB + 1 Nginx

Recommended (Production):
  Load Balancer (ALB/Nginx)
    ├── Backend Instance 1 (stateless)
    ├── Backend Instance 2 (stateless)
    └── Backend Instance N (auto-scaled)
         ↓
  MongoDB Atlas (Replica Set, M10+)
         ↓
  Redis (session cache, rate limit store)
         ↓
  Cloudinary (resume CDN)
         ↓
  Prometheus + Grafana (monitoring)
```

### 20.3 Key Metrics to Monitor

| Metric | Alert Threshold | Tool |
|--------|-----------------|------|
| API latency p95 | > 500ms | Prometheus |
| Error rate | > 1% | Prometheus |
| MongoDB connections | > 80% pool | Prometheus |
| CPU usage | > 80% | CloudWatch/Datadog |
| Memory usage | > 85% | CloudWatch/Datadog |
| Disk usage (MongoDB) | > 80% | Atlas alerts |
| Failed login attempts | Spike detection | Log analysis |

### 20.4 Honest Assessment

This project is **production-ready for institutional deployment** (single college, hundreds to low thousands of users) with the current implementation. For **millions of users** across multiple institutions, additional infrastructure investment is required:

- Horizontal backend scaling with load balancer
- Managed MongoDB with sharding
- Redis for distributed rate limiting and caching
- CDN for static assets
- Message queue (BullMQ/RabbitMQ) for async notifications
- Multi-region deployment
- Iterative load testing with realistic traffic profiles

The codebase provides the **foundation and tooling** to execute this scaling path.

---

## 21. SCREENS AND UI PAGES

### 21.1 Public Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Hero section, feature cards, CTA buttons |
| Login | `/login` | Role tabs (Student/Recruiter/Admin), form |
| Register | `/register` | Student or Recruiter registration forms |

### 21.2 Student Pages

| Page | Route | Key Features |
|------|-------|--------------|
| Dashboard | `/student/dashboard` | Stats cards, announcements, latest jobs |
| Browse Jobs | `/student/jobs` | Search, filter, pagination, apply button |
| My Applications | `/student/applications` | Status table with badges |
| Interviews | `/student/interviews` | Interview cards with meeting links |
| Notifications | `/student/notifications` | Read/unread, mark all read |
| Profile | `/student/profile` | Edit info, upload resume |

### 21.3 Recruiter Pages

| Page | Route | Key Features |
|------|-------|--------------|
| Dashboard | `/recruiter/dashboard` | Job stats, announcements |
| My Jobs | `/recruiter/jobs` | Search, pagination, deactivate |
| Post Job | `/recruiter/post-job` | Full job form with eligibility |
| Job Applicants | `/recruiter/jobs/:id/applicants` | Status dropdown, schedule form |
| Profile | `/recruiter/profile` | Company info edit |

### 21.4 Admin Pages

| Page | Route | Key Features |
|------|-------|--------------|
| Dashboard | `/admin/dashboard` | System-wide statistics |
| Students | `/admin/students` | Search, pagination, activate/deactivate |
| Recruiters | `/admin/recruiters` | Pending filter, approve/reject |
| Jobs | `/admin/jobs` | All jobs across platform |
| Reports | `/admin/reports` | Company-wise and branch-wise tables |
| Announcements | `/admin/announcements` | Create and view announcements |

---

## 22. CHALLENGES FACED AND SOLUTIONS

| Challenge | Solution |
|-----------|----------|
| Refresh token collision on fast logins | Added unique `jti` (UUID) to JWT payload |
| Email verification blocking smoke tests | DB-assisted verification in test scripts |
| Docker credential helper on Windows | Temporary DOCKER_CONFIG workaround in scripts |
| CORS with cookie-based refresh tokens | `credentials: true` + `withCredentials: true` in Axios |
| Route ordering conflicts (`/:id` vs `/student/applications`) | Placed specific routes before parameterized routes |
| PowerShell command chaining (`&&`) | Used `;` separator or separate script files |
| Cloudinary not configured in dev | Automatic fallback to local disk storage |
| Pagination breaking existing dashboards | Updated frontend to use `res.data.items` pattern |

---

## 23. FUTURE ENHANCEMENTS

1. **Redis caching** — cache frequently accessed job listings
2. **BullMQ job queue** — async email/SMS notification delivery
3. **AI resume parsing** — extract skills, experience automatically
4. **Job recommendation engine** — match students to jobs by profile
5. **Video interview integration** — embed Zoom/Google Meet SDK
6. **Mobile app** — React Native companion app
7. **Multi-tenant SaaS** — support multiple colleges on one platform
8. **Advanced analytics** — placement trends over years, salary analytics
9. **Document verification** — verify academic certificates
10. **WhatsApp/SMS notifications** — production Twilio/Fast2SMS integration

---

## 24. CONCLUSION

The Placement Management System successfully automates the campus recruitment workflow by providing a centralized, secure, and scalable digital platform. Built on the proven MERN stack, it serves three distinct user roles — students, recruiters, and administrators — each with tailored functionality.

**Key achievements:**
- Complete end-to-end placement workflow digitized
- Role-based access control with JWT authentication
- Automatic eligibility checking reduces manual errors
- Real-time notifications improve communication
- Admin reports provide instant placement analytics
- Production-ready infrastructure with Docker, CI, testing, and monitoring
- Comprehensive documentation for maintenance and scaling

The system is suitable for deployment in engineering colleges, management institutes, universities, and training centers. With the production baseline and scaling guidance provided, it can grow from a single-institution deployment to a multi-campus platform with appropriate infrastructure investment.

---

## 25. APPENDICES

### Appendix A: Default Credentials

| Role | Username/Email | Password |
|------|----------------|----------|
| Admin | admin | admin123 |

*Change immediately after first login in production.*

### Appendix B: Supported Branches

CSE, ECE, EEE, MECH, CIVIL, IT, MBA, MCA

### Appendix C: Application Status Flow

```
Applied → Shortlisted → Interview → Selected
                                 → Rejected
```

Any status can transition to Rejected.

### Appendix D: npm Scripts Reference

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | backend | Start with nodemon |
| `npm start` | backend | Production start |
| `npm run seed` | backend | Seed admin user |
| `npm run dev` | frontend | Vite dev server |
| `npm run build` | frontend | Production build |
| `npm run smoke` | root | End-to-end smoke test |
| `npm run smoke:cleanup` | root | Clean smoke data |
| `npm run smoke:docker` | root | Docker smoke test |
| `npm run load:health` | root | Load test health endpoint |

### Appendix E: HTTP Status Codes Used

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Registration, job creation, application |
| 400 | Bad Request | Validation error, eligibility fail, duplicate |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Wrong role, unverified email, unapproved recruiter |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Unhandled exceptions |
| 503 | Service Unavailable | Readiness check failed (DB down) |

### Appendix F: Glossary

| Term | Definition |
|------|------------|
| MERN | MongoDB, Express, React, Node.js |
| JWT | JSON Web Token — authentication standard |
| ODM | Object Document Mapper — Mongoose for MongoDB |
| SPA | Single Page Application |
| CORS | Cross-Origin Resource Sharing |
| bcrypt | Password hashing algorithm |
| Prometheus | Open-source monitoring system |
| Smoke test | Quick end-to-end functionality check |
| Load test | Performance test under concurrent users |
| httpOnly cookie | Cookie not accessible via JavaScript |
| Aggregation | MongoDB pipeline for analytics queries |
| Soft delete | Marking record inactive instead of deleting |
| Upsert | Update if exists, insert if not |

---

---

# PART 2 — EXTENDED TECHNICAL DOCUMENTATION

---

## 26. COMPLETE SERVER.JS WALKTHROUGH

This section explains every major block in `backend/server.js` line by line, because the server file is the backbone of the entire backend.

### 26.1 Startup Sequence

```javascript
require('dotenv').config();           // Load .env variables
const env = require('./config/env');  // Zod-validated environment
const connectDB = require('./config/db');
```

**Why validate env at startup?** If `JWT_SECRET` or `MONGODB_URI` is missing, the server fails immediately with a clear error instead of crashing mid-request at runtime.

### 26.2 Request ID Middleware

```javascript
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('x-request-id', req.id);
  next();
});
```

Every HTTP request gets a unique ID. This ID appears in Pino logs, making it possible to trace a single user action across multiple log lines in production.

### 26.3 CORS Configuration

```javascript
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);  // Allow server-to-server (smoke tests)
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,  // Required for refresh token cookies
}));
```

**Why credentials: true?** The refresh token is stored in an httpOnly cookie. Without `credentials: true` on CORS and `withCredentials: true` on Axios, the browser will not send cookies on cross-origin requests.

### 26.4 Security Middleware Chain

| Order | Middleware | Purpose |
|-------|------------|---------|
| 1 | helmet | Sets security HTTP headers |
| 2 | compression | Gzip response bodies |
| 3 | cookieParser | Parse cookies for refresh tokens |
| 4 | express.json | Parse JSON bodies (1MB limit) |
| 5 | mongoSanitize | Strip `$` and `.` from user input |
| 6 | hpp | Prevent duplicate query parameters |
| 7 | responseTime | Record latency for Prometheus |
| 8 | rateLimit | Throttle abusive clients |

### 26.5 Route Mounting

```javascript
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/interviews', interviewRoutes);
```

Each route file defines endpoints and attaches `protect` + `authorize` middleware where needed.

### 26.6 Health, Readiness, and Metrics

```javascript
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'placement-management-backend',
    uptimeSec: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/ready', (req, res) => {
  const mongoReady = mongoose.connection.readyState === 1;
  if (!mongoReady) return res.status(503).json({ status: 'not_ready', mongo: mongoose.connection.readyState });
  res.json({ status: 'ready' });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

**Health vs Readiness:**
- **Health** (`/api/health`) — process is alive (used by load balancers for liveness)
- **Readiness** (`/api/ready`) — process can serve traffic (MongoDB connected)

Docker healthcheck uses `/api/ready` so the container is not marked healthy until MongoDB is connected.

### 26.7 Graceful Shutdown

```javascript
const shutdown = async (signal) => {
  logger.info({ signal }, 'Shutting down gracefully');
  server.close(async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
```

When Docker stops a container, it sends SIGTERM. Graceful shutdown:
1. Stops accepting new connections
2. Waits for in-flight requests to complete
3. Closes MongoDB connection
4. Exits cleanly

---

## 27. COMPLETE MODEL REFERENCE (ALL 9 MODELS)

### 27.1 Student Model — Full Schema

```javascript
// backend/models/Student.js
{
  name: String (required, trimmed),
  email: String (required, unique, lowercase),
  password: String (required, min 6 chars, bcrypt hashed on save),
  phone: String (required),
  branch: String (required) — e.g., CSE, ECE, IT, MECH, MBA,
  cgpa: Number (required, 0-10),
  resume: String (URL or path, default empty),
  isActive: Boolean (default true),
  emailVerified: Boolean (default false),
  emailVerificationTokenHash: String,
  emailVerificationExpiresAt: Date,
  passwordResetTokenHash: String,
  passwordResetExpiresAt: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Pre-save hook:** When password field is modified, bcrypt hashes it with 10 salt rounds before saving.

**Instance method:** `matchPassword(enteredPassword)` compares plain text with stored hash.

### 27.2 Recruiter Model — Full Schema

```javascript
{
  companyName: String (required),
  hrName: String (required),
  email: String (required, unique, lowercase),
  password: String (required, bcrypt hashed),
  phone: String,
  website: String,
  description: String,
  isApproved: Boolean (default false) — admin must approve,
  isActive: Boolean (default true),
  emailVerified: Boolean (default false),
  emailVerificationTokenHash: String,
  emailVerificationExpiresAt: Date,
  passwordResetTokenHash: String,
  passwordResetExpiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Business rule:** Recruiter cannot login until `isApproved === true` AND `emailVerified === true`.

### 27.3 Admin Model — Full Schema

```javascript
{
  username: String (required, unique),
  password: String (required, bcrypt hashed),
  name: String (default 'Administrator'),
  createdAt: Date,
  updatedAt: Date
}
```

Admin uses **username** (not email) for login. Seeded via `npm run seed`.

### 27.4 Job Model — Full Schema

```javascript
{
  title: String (required),
  description: String (required),
  salary: String (required) — e.g., "6 LPA", "₹40,000/month",
  location: String,
  jobType: Enum ['Full-time', 'Internship', 'Contract'],
  criteria: {
    minCgpa: Number (default 0),
    branches: [String] — empty or ['All'] means all branches,
    maxBacklogs: Number (default 5)
  },
  deadline: Date (required),
  recruiter: ObjectId → Recruiter (required),
  isActive: Boolean (default true),
  vacancies: Number (default 1),
  createdAt: Date,
  updatedAt: Date
}
```

### 27.5 Application Model — Full Schema

```javascript
{
  student: ObjectId → Student (required),
  job: ObjectId → Job (required),
  status: Enum ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
  appliedAt: Date (default now),
  remarks: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Unique compound index:** `{ student: 1, job: 1 }` — prevents duplicate applications.

### 27.6 Interview Model — Full Schema

```javascript
{
  application: ObjectId → Application (unique),
  job: ObjectId → Job,
  student: ObjectId → Student,
  recruiter: ObjectId → Recruiter,
  scheduledAt: Date (required),
  mode: Enum ['Online', 'Offline'],
  venue: String,
  meetingLink: String,
  notes: String,
  status: Enum ['Scheduled', 'Rescheduled', 'Completed', 'Cancelled'],
  createdBy: ObjectId → Recruiter,
  createdAt: Date,
  updatedAt: Date
}
```

**Upsert pattern:** `findOneAndUpdate` with `{ upsert: true }` creates or updates interview for an application.

### 27.7 Notification Model — Full Schema

```javascript
{
  recipientRole: Enum ['student', 'recruiter', 'admin'],
  recipient: ObjectId,
  type: Enum [
    'application_status', 'interview_scheduled', 'interview_updated',
    'job_posted', 'system', 'announcement'
  ],
  title: String (required),
  message: String (required),
  metadata: Object — { jobId, applicationId, interviewId, ... },
  channels: {
    inApp: Boolean,
    email: Boolean,
    sms: Boolean,
    whatsapp: Boolean
  },
  readAt: Date (null = unread),
  createdAt: Date,
  updatedAt: Date
}
```

### 27.8 Announcement Model — Full Schema

```javascript
{
  title: String (required),
  message: String (required),
  targetRole: Enum ['all', 'student', 'recruiter'],
  createdBy: ObjectId → Admin,
  createdAt: Date,
  updatedAt: Date
}
```

Announcements appear on dashboards filtered by `targetRole`.

### 27.9 RefreshToken Model — Full Schema

```javascript
{
  userId: ObjectId (required),
  role: Enum ['student', 'recruiter', 'admin'],
  tokenHash: String (required) — SHA-256 of JWT,
  expiresAt: Date (required),
  revokedAt: Date (null = active),
  createdByIp: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Token rotation:** On refresh, old token is revoked (`revokedAt` set), new token created. Prevents replay attacks.

---

## 28. ROUTE FILES — COMPLETE REFERENCE

### 28.1 authRoutes.js

```javascript
router.post('/student/register', validate(registerStudentSchema), registerStudent);
router.post('/recruiter/register', validate(registerRecruiterSchema), registerRecruiter);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
```

All auth routes are **public** (no `protect` middleware).

### 28.2 studentRoutes.js

```javascript
router.get('/profile', protect, authorize('student'), getProfile);
router.put('/profile', protect, authorize('student'), updateProfile);
router.post('/resume', protect, authorize('student'), upload.single('resume'), uploadResume);
```

### 28.3 jobRoutes.js

```javascript
// Public
router.get('/', getJobs);
router.get('/:id', getJobById);

// Student
router.post('/:id/apply', protect, authorize('student'), applyForJob);
router.get('/student/applications', protect, authorize('student'), getStudentApplications);

// Recruiter
router.post('/', protect, authorize('recruiter'), createJob);
router.get('/recruiter/mine', protect, authorize('recruiter'), getRecruiterJobs);
router.put('/:id', protect, authorize('recruiter'), updateJob);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);
router.get('/:id/applicants', protect, authorize('recruiter'), getJobApplicants);
router.put('/:jobId/applications/:applicationId', protect, authorize('recruiter'), updateApplicationStatus);
```

**Important:** `/student/applications` is defined BEFORE `/:id` to prevent route conflict.

### 28.4 adminRoutes.js

```javascript
router.get('/dashboard', protect, authorize('admin'), getDashboard);
router.get('/students', protect, authorize('admin'), getStudents);
router.put('/students/:id/toggle', protect, authorize('admin'), toggleStudentStatus);
router.get('/recruiters', protect, authorize('admin'), getRecruiters);
router.put('/recruiters/:id/approve', protect, authorize('admin'), approveRecruiter);
router.put('/recruiters/:id/reject', protect, authorize('admin'), rejectRecruiter);
router.put('/recruiters/:id/toggle', protect, authorize('admin'), toggleRecruiterStatus);
router.get('/jobs', protect, authorize('admin'), getAllJobs);
router.get('/reports/company', protect, authorize('admin'), getCompanyReport);
router.get('/reports/branch', protect, authorize('admin'), getBranchReport);
router.post('/announcements', protect, authorize('admin'), createAnnouncement);
router.get('/announcements', protect, authorize('admin'), getAnnouncements);
```

### 28.5 interviewRoutes.js

```javascript
router.post('/applications/:applicationId/schedule', protect, authorize('recruiter'), scheduleInterview);
router.put('/:id', protect, authorize('recruiter'), updateInterview);
router.get('/student/me', protect, authorize('student'), getStudentInterviews);
router.get('/recruiter/me', protect, authorize('recruiter'), getRecruiterInterviews);
```

### 28.6 notificationRoutes.js

```javascript
router.get('/me', protect, getMyNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);
```

---

## 29. CONTROLLER DEEP DIVE — AUTH CONTROLLER

### 29.1 Student Registration Flow

```javascript
const registerStudent = async (req, res) => {
  const { name, email, password, phone, branch, cgpa } = req.body;

  // 1. Check duplicate email
  const exists = await Student.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  // 2. Create student (password auto-hashed by pre-save hook)
  const student = await Student.create({ name, email, password, phone, branch, cgpa });

  // 3. Send verification email
  await sendVerifyEmail({ user: student, role: 'student' });

  // 4. Issue refresh token (httpOnly cookie)
  await issueRefreshToken({ res, userId: student._id, role: 'student', req });

  // 5. Return access token + user info
  res.status(201).json({
    _id: student._id,
    name: student.name,
    email: student.email,
    branch: student.branch,
    role: 'student',
    token: generateToken(student._id, 'student'),
    emailVerified: student.emailVerified,
  });
};
```

### 29.2 Login Flow with All Checks

```javascript
const login = async (req, res) => {
  const { email, password, role } = req.body;

  let user;
  if (role === 'student') user = await Student.findOne({ email });
  else if (role === 'recruiter') user = await Recruiter.findOne({ email });
  else if (role === 'admin') user = await Admin.findOne({ username: email });

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // Student/Recruiter checks
  if (role !== 'admin') {
    if (!user.emailVerified) return res.status(403).json({ message: 'Please verify your email first' });
    if (role === 'recruiter' && !user.isApproved) {
      return res.status(403).json({ message: 'Company not yet approved by admin' });
    }
    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated' });
  }

  const match = await user.matchPassword(password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  await issueRefreshToken({ res, userId: user._id, role, req });

  res.json({
    _id: user._id,
    name: user.name || user.companyName || user.username,
    email: user.email || user.username,
    role,
    token: generateToken(user._id, role),
  });
};
```

### 29.3 Refresh Token Rotation

```javascript
const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const tokenHash = hashToken(token);

  const stored = await RefreshToken.findOne({ tokenHash, revokedAt: null });
  if (!stored) return res.status(401).json({ message: 'Invalid refresh token' });

  // Revoke old token
  stored.revokedAt = new Date();
  await stored.save();

  // Issue new refresh + access tokens
  await issueRefreshToken({ res, userId: stored.userId, role: stored.role, req });

  res.json({
    token: generateToken(stored.userId, stored.role),
    role: stored.role,
  });
};
```

---

## 30. CONTROLLER DEEP DIVE — JOB CONTROLLER

### 30.1 Apply for Job — Complete Logic

```javascript
const applyForJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job || !job.isActive) return res.status(404).json({ message: 'Job not found' });

  const student = await Student.findById(req.user._id);

  // Eligibility check
  const { eligible, reason } = checkEligibility(student, job);
  if (!eligible) return res.status(400).json({ message: reason });

  // Duplicate check
  const existing = await Application.findOne({ student: student._id, job: job._id });
  if (existing) return res.status(400).json({ message: 'Already applied for this job' });

  const application = await Application.create({
    student: student._id,
    job: job._id,
    status: 'Applied',
  });

  await createNotification({
    recipientRole: 'student',
    recipient: student._id,
    type: 'application_status',
    title: 'Application Submitted',
    message: `You applied for "${job.title}". Status: Applied.`,
    metadata: { jobId: String(job._id), applicationId: String(application._id) },
    channels: { inApp: true, email: true },
  });

  res.status(201).json(application);
};
```

### 30.2 Update Application Status

```javascript
const updateApplicationStatus = async (req, res) => {
  const { status, remarks } = req.body;
  const application = await Application.findById(req.params.applicationId);
  if (!application) return res.status(404).json({ message: 'Application not found' });

  const job = await Job.findOne({ _id: application.job, recruiter: req.user._id });
  if (!job) return res.status(404).json({ message: 'Job not found' });

  application.status = status;
  if (remarks) application.remarks = remarks;
  await application.save();

  await createNotification({
    recipientRole: 'student',
    recipient: application.student,
    type: 'application_status',
    title: `Application ${status}`,
    message: `Your application for "${job.title}" is now: ${status}.`,
    metadata: { jobId: String(job._id), applicationId: String(application._id) },
    channels: { inApp: true, email: true },
  });

  res.json(application);
};
```

---

## 31. CONTROLLER DEEP DIVE — ADMIN CONTROLLER

### 31.1 Dashboard Statistics

The admin dashboard aggregates counts in parallel using `Promise.all`:

```javascript
const [totalStudents, totalRecruiters, approvedRecruiters, pendingRecruiters, totalJobs, totalApplications] =
  await Promise.all([
    Student.countDocuments({ isActive: true }),
    Recruiter.countDocuments(),
    Recruiter.countDocuments({ isApproved: true }),
    Recruiter.countDocuments({ isApproved: false }),
    Job.countDocuments({ isActive: true }),
    Application.countDocuments(),
  ]);

const statusBreakdown = await Application.aggregate([
  { $group: { _id: '$status', count: { $sum: 1 } } },
]);
```

**Sample dashboard response:**

```json
{
  "totalStudents": 150,
  "totalRecruiters": 12,
  "approvedRecruiters": 10,
  "pendingRecruiters": 2,
  "totalJobs": 25,
  "totalApplications": 320,
  "statusBreakdown": [
    { "_id": "Applied", "count": 180 },
    { "_id": "Shortlisted", "count": 60 },
    { "_id": "Interview", "count": 40 },
    { "_id": "Selected", "count": 25 },
    { "_id": "Rejected", "count": 15 }
  ]
}
```

### 31.2 Branch-wise Report Aggregation

```javascript
const getBranchReport = async (req, res) => {
  const report = await Application.aggregate([
    { $lookup: { from: 'students', localField: 'student', foreignField: '_id', as: 'studentData' } },
    { $unwind: '$studentData' },
    { $group: {
        _id: '$studentData.branch',
        totalApplications: { $sum: 1 },
        shortlisted: { $sum: { $cond: [{ $eq: ['$status', 'Shortlisted'] }, 1, 0] } },
        selected: { $sum: { $cond: [{ $eq: ['$status', 'Selected'] }, 1, 0] } },
        avgCgpa: { $avg: '$studentData.cgpa' },
    }},
    { $sort: { totalApplications: -1 } },
  ]);
  res.json(report);
};
```

**Sample branch report:**

| Branch | Applications | Shortlisted | Selected | Avg CGPA |
|--------|-------------|-------------|----------|----------|
| CSE | 120 | 35 | 15 | 8.2 |
| IT | 80 | 22 | 10 | 7.9 |
| ECE | 60 | 18 | 8 | 7.6 |
| MECH | 40 | 10 | 5 | 7.4 |

---

## 32. FILE UPLOAD SYSTEM

### 32.1 Multer + Cloudinary Configuration

```javascript
// backend/middleware/upload.js
const storage = process.env.CLOUDINARY_CLOUD_NAME
  ? new CloudinaryStorage({
      cloudinary,
      params: { folder: 'placement-resumes', resource_type: 'raw', format: 'pdf' },
    })
  : multer.diskStorage({
      destination: 'uploads/resumes',
      filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
    });

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PDF and DOC files allowed'));
  },
});
```

### 32.2 Resume Upload Controller

```javascript
const uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const resumeUrl = req.file.path || `/uploads/resumes/${req.file.filename}`;
  const student = await Student.findById(req.user._id);
  student.resume = resumeUrl;
  await student.save();

  res.json({ message: 'Resume uploaded', resume: resumeUrl });
};
```

### 32.3 Frontend Resume Upload

```jsx
const handleResumeUpload = async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('resume', file);

  const { data } = await api.post('/students/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  setResume(data.resume);
};
```

---

## 33. EMAIL SYSTEM

### 33.1 Email Utility

```javascript
// backend/utils/email.js
const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.SMTP_HOST) {
    // Development fallback: log to console
    console.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
    console.log(`[EMAIL] Body: ${text}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, text, html });
};
```

### 33.2 When Emails Are Sent

| Event | Recipient | Subject |
|-------|-----------|---------|
| Registration | Student/Recruiter | Verify your email |
| Forgot password | Student/Recruiter | Reset your password |
| Application submitted | Student | Application Submitted |
| Status update | Student | Application {status} |
| Interview scheduled | Student | Interview Scheduled |
| Interview updated | Student | Interview Updated |

### 33.3 SMTP Configuration (.env)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Placement Cell <noreply@college.edu>
```

---

## 34. FRONTEND — PAGE-BY-PAGE WALKTHROUGH

### 34.1 Landing Page (`Landing.jsx`)

**Purpose:** Marketing page for unauthenticated visitors.

**Sections:**
- Hero banner with "PlaceHub" branding
- Feature cards (Students, Recruiters, Admin)
- Call-to-action buttons (Login, Register)
- Footer with project info

**No API calls** — purely static content.

### 34.2 Login Page (`Login.jsx`)

**State variables:**
- `role` — 'student' | 'recruiter' | 'admin'
- `email` — email or username (admin uses username)
- `password`
- `error`, `loading`

**Role tabs:** Three buttons switch the login form between roles. Admin shows "Username" label instead of "Email".

**On submit:** POST `/api/auth/login` → store user in AuthContext → navigate to role dashboard.

### 34.3 Register Page (`Register.jsx`)

**Two registration forms:**
- Student: name, email, password, phone, branch (dropdown), CGPA
- Recruiter: companyName, hrName, email, password, phone, website, description

**Validation:** Client-side required fields + server-side Zod validation.

### 34.4 Student Dashboard (`StudentDashboard.jsx`)

**API calls on mount:**
```javascript
api.get('/students/profile')           // Student info
api.get('/jobs/student/applications')  // Application count
api.get('/jobs?limit=5')               // Latest jobs
api.get('/admin/announcements')        // Announcements (filtered client-side)
```

**Displays:**
- Welcome message with student name
- Stats cards: Total Applications, Shortlisted, Selected
- Latest job openings (5 cards)
- Recent announcements

### 34.5 Student Jobs (`StudentJobs.jsx`)

**Features:**
- Search input (debounced `q` param)
- Branch filter dropdown
- Job type filter dropdown
- Job cards with title, company, salary, deadline, apply button
- Pagination (Previous/Next)

**Apply flow:**
```javascript
const handleApply = async (jobId) => {
  try {
    await api.post(`/jobs/${jobId}/apply`);
    alert('Application submitted!');
  } catch (err) {
    alert(err.response?.data?.message || 'Application failed');
  }
};
```

### 34.6 Student Applications (`StudentApplications.jsx`)

**Table columns:** Job Title, Company, Applied Date, Status (badge), Remarks

**Status badges:** Color-coded using `StatusBadge` component.

### 34.7 Recruiter Post Job (`PostJob.jsx`)

**Form fields:**
```javascript
const [form, setForm] = useState({
  title: '', description: '', salary: '', location: '',
  jobType: 'Full-time', vacancies: 1, deadline: '',
  criteria: { minCgpa: 0, branches: [], maxBacklogs: 5 },
});
```

**Branch checkboxes:** CSE, ECE, EEE, MECH, CIVIL, IT, MBA, MCA, All

**Submit:** POST `/api/jobs` with form data.

### 34.8 Recruiter Job Applicants (`JobApplicants.jsx`)

**Most complex recruiter page:**
- Lists all applicants for a specific job
- Shows student name, email, branch, CGPA, resume link
- Status dropdown per applicant (Applied → Shortlisted → Interview → Selected → Rejected)
- Inline interview scheduling form (appears when status set to Interview)
- Schedule fields: date/time, mode (Online/Offline), meeting link, venue, notes

### 34.9 Admin Reports (`AdminReports.jsx`)

**Two report tabs:**
1. Company-wise — table with company name, total apps, shortlisted, selected, rejected
2. Branch-wise — table with branch, total apps, shortlisted, selected, avg CGPA

**API calls:**
```javascript
api.get('/admin/reports/company')
api.get('/admin/reports/branch')
```

### 34.10 ProtectedRoute Component

```jsx
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  return children;
};
```

**How it works:**
1. If no user in context → redirect to login
2. If user role doesn't match required role → redirect to login
3. Otherwise → render children (the protected page)

---

## 35. UTILITY MODULES REFERENCE

### 35.1 Token Utilities (`utils/tokens.js`)

```javascript
const crypto = require('crypto');

const createRandomToken = () => crypto.randomBytes(32).toString('hex');

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');
```

**Why hash tokens?** Verification and reset tokens are stored as SHA-256 hashes in the database. Even if the database is compromised, raw tokens cannot be used.

### 35.2 Logger (`utils/logger.js`)

```javascript
const pino = require('pino');
module.exports = pino({ level: process.env.LOG_LEVEL || 'info' });
```

**Sample log output (JSON):**
```json
{"level":30,"time":1718611200000,"requestId":"abc-123","msg":"request completed","res":{"statusCode":200},"responseTime":45}
```

### 35.3 Metrics (`utils/metrics.js`)

```javascript
const promClient = require('prom-client');
const register = new promClient.Registry();

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'HTTP request duration in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
});
```

### 35.4 Environment Validation (`config/env.js`)

```javascript
const { z } = require('zod');

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  ACCESS_TOKEN_EXPIRE: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRE: z.string().default('7d'),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  // ... more fields
});

module.exports = envSchema.parse(process.env);
```

**If validation fails at startup:**
```
ZodError: [
  { "path": ["JWT_SECRET"], "message": "String must contain at least 16 character(s)" }
]
```

---

## 36. DOCKER DEEP DIVE

### 36.1 Backend Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

### 36.2 Frontend Dockerfile (Multi-stage)

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

**Why multi-stage?** Final image contains only Nginx + static files (~25MB), not Node.js build tools (~500MB).

### 36.3 Nginx Configuration

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  # API proxy to backend container
  location /api/ {
    proxy_pass http://backend:5000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  # Uploads proxy
  location /uploads/ {
    proxy_pass http://backend:5000/uploads/;
  }

  # SPA fallback — all other routes serve index.html
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### 36.4 Docker Compose Service Dependencies

```
mongo (healthy) → backend (healthy) → frontend
```

Backend waits for MongoDB healthcheck before starting. Frontend waits for backend readiness. This prevents race conditions where the frontend loads before the API is available.

### 36.5 Docker Smoke Test Script

```javascript
// scripts/smoke-docker.mjs
// 1. Sets DOCKER_CONFIG workaround for Windows credential helper
// 2. Runs: docker compose up --build -d
// 3. Waits for backend healthcheck
// 4. Seeds admin: docker compose exec backend npm run seed
// 5. Runs smoke.mjs against http://localhost:5000/api
// 6. Reports PASS/FAIL
```

**Command:** `npm run smoke:docker`

---

## 37. COMPLETE SMOKE TEST SCRIPT EXPLAINED

```javascript
// scripts/smoke.mjs — Full flow

// Step 1: Register recruiter
const recruiterReg = await req('/auth/recruiter/register', { method: 'POST', body: {...} });

// Step 2: Register student
const studentReg = await req('/auth/student/register', { method: 'POST', body: {...} });

// Step 3: DB-assisted verification (skip email link in automation)
await setDirectFlagsForSmoke();  // Sets emailVerified=true, isApproved=true

// Step 4: Admin login
const adminLogin = await req('/auth/login', { method: 'POST', body: { role: 'admin', email: 'admin', password: 'admin123' } });

// Step 5: Recruiter login
const recruiterLogin = await req('/auth/login', { method: 'POST', body: { role: 'recruiter', email: recruiterEmail, password: PASSWORD } });

// Step 6: Recruiter posts job
const job = await req('/jobs', { method: 'POST', token: recruiterLogin.token, body: {...} });

// Step 7: Student login
const studentLogin = await req('/auth/login', { method: 'POST', body: { role: 'student', email: studentEmail, password: PASSWORD } });

// Step 8: Student applies
const application = await req(`/jobs/${job._id}/apply`, { method: 'POST', token: studentLogin.token });

// Step 9: Recruiter updates status to Interview
await req(`/jobs/${job._id}/applications/${application._id}`, {
  method: 'PUT', token: recruiterLogin.token, body: { status: 'Interview' }
});

// Step 10: Recruiter schedules interview
const interview = await req(`/interviews/applications/${application._id}/schedule`, {
  method: 'POST', token: recruiterLogin.token, body: { scheduledAt: '...', mode: 'Online', meetingLink: '...' }
});

// Step 11: Student views interviews (count >= 1)
const interviews = await req('/interviews/student/me', { token: studentLogin.token });

// Step 12: Student views notifications (count >= 3)
const notifications = await req('/notifications/me', { token: studentLogin.token });
```

---

## 38. LOAD TESTING — DETAILED GUIDE

### 38.1 autocannon Load Test

```javascript
// scripts/load-autocannon.mjs
import autocannon from 'autocannon';

const result = await autocannon({
  url: 'http://localhost:5000/api/health',
  connections: 100,    // 100 concurrent connections
  duration: 30,        // 30 seconds
});

console.log(`Requests/sec: ${result.requests.average}`);
console.log(`Latency avg: ${result.latency.average}ms`);
console.log(`Errors: ${result.errors}`);
console.log(`Timeouts: ${result.timeouts}`);
```

### 38.2 k6 Advanced Load Test

```javascript
// load-tests/k6-health.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 200 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const res = http.get('http://localhost:5000/api/health');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(0.1);
}
```

### 38.3 Interpreting Load Test Results

| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| Requests/sec | > 1000 | 500-1000 | < 500 |
| Latency avg | < 100ms | 100-300ms | > 300ms |
| Latency p99 | < 200ms | 200-500ms | > 500ms |
| Error rate | 0% | < 1% | > 1% |
| Timeouts | 0 | < 10 | > 10 |

**Our baseline:** ~2,034 req/s, 48ms avg latency, 0 errors — well within "Good" range.

---

## 39. STEP-BY-STEP USER MANUALS

### 39.1 Student User Manual

**Step 1: Registration**
1. Open http://localhost:3000
2. Click "Register" or "Get Started"
3. Select "Student" tab
4. Fill: Name, Email, Password (min 8 chars, upper+lower+number), Phone, Branch, CGPA
5. Click "Register"
6. Check email for verification link (or check console in dev mode)
7. Click verification link

**Step 2: Login**
1. Go to Login page
2. Select "Student" tab
3. Enter email and password
4. Click "Sign In"
5. Redirected to Student Dashboard

**Step 3: Upload Resume**
1. Click "Profile" in navigation
2. Click "Choose File" under Resume section
3. Select PDF or DOC file (max 5MB)
4. Click "Upload Resume"
5. Resume link appears

**Step 4: Browse and Apply for Jobs**
1. Click "Browse Jobs" in navigation
2. Use search box to find jobs by title
3. Filter by branch or job type
4. Click "Apply Now" on eligible job
5. Success message appears
6. If not eligible, error explains why (CGPA, branch, deadline)

**Step 5: Track Applications**
1. Click "My Applications"
2. View table with job title, company, date, status
3. Status updates automatically when recruiter acts

**Step 6: View Interviews**
1. Click "Interviews"
2. See scheduled interviews with date, mode, meeting link/venue
3. Click meeting link for online interviews

**Step 7: Check Notifications**
1. Click bell icon or "Notifications"
2. View all notifications
3. Click "Mark as Read" on individual items
4. Click "Mark All Read" to clear all

### 39.2 Recruiter User Manual

**Step 1: Registration**
1. Go to Register page, select "Recruiter" tab
2. Fill: Company Name, HR Name, Email, Password, Phone, Website, Description
3. Click "Register"
4. Verify email
5. Wait for admin approval (status shown on login attempt)

**Step 2: Post a Job**
1. Login after approval
2. Click "Post Job" in navigation
3. Fill: Title, Description, Salary, Location, Job Type, Vacancies, Deadline
4. Set eligibility: Min CGPA, select branches, Max Backlogs
5. Click "Post Job"

**Step 3: Manage Applicants**
1. Click "My Jobs"
2. Click "View Applicants" on a job
3. See list with student details and resume links
4. Change status dropdown: Applied → Shortlisted → Interview → Selected/Rejected

**Step 4: Schedule Interview**
1. On Job Applicants page, set status to "Interview"
2. Schedule form appears
3. Fill: Date/Time, Mode (Online/Offline), Meeting Link or Venue, Notes
4. Click "Schedule Interview"
5. Student receives notification automatically

### 39.3 Admin User Manual

**Step 1: Login**
1. Go to Login page, select "Admin" tab
2. Username: `admin`, Password: `admin123`
3. Click "Sign In"

**Step 2: Approve Recruiters**
1. Click "Recruiters" in navigation
2. Filter "Pending" to see unapproved companies
3. Click "Approve" or "Reject" for each

**Step 3: Manage Students**
1. Click "Students"
2. Search by name, email, or branch
3. Click "Deactivate" to block a student account
4. Click "Activate" to restore access

**Step 4: Generate Reports**
1. Click "Reports"
2. View "Company-wise" tab for per-company statistics
3. View "Branch-wise" tab for per-branch statistics

**Step 5: Post Announcements**
1. Click "Announcements"
2. Fill: Title, Message, Target (All/Students/Recruiters)
3. Click "Post Announcement"
4. Appears on relevant dashboards

---

## 40. TROUBLESHOOTING GUIDE

### 40.1 Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `EADDRINUSE :::5000` | Port 5000 already in use | Stop other Node process or change PORT in .env |
| `MongoServerError: connect ECONNREFUSED` | MongoDB not running | Start MongoDB or use Docker compose |
| `ZodError: JWT_SECRET` | Missing/short JWT secret | Set JWT_SECRET in .env (16+ chars) |
| `Not allowed by CORS` | Frontend origin not in CORS_ORIGINS | Add frontend URL to CORS_ORIGINS |
| `Please verify your email first` | Email not verified | Click verification link in email/console |
| `Company not yet approved` | Admin hasn't approved recruiter | Login as admin, approve recruiter |
| `Minimum CGPA required: X` | Student CGPA below job minimum | Apply to eligible jobs only |
| `Already applied for this job` | Duplicate application | Check My Applications page |
| `Only PDF and DOC files allowed` | Wrong file type for resume | Upload PDF or DOC file |
| Docker backend unhealthy | Old image cached | Run `docker compose up --build` |
| `docker-credential-desktop not found` | Windows Docker credential issue | Use `npm run smoke:docker` (has workaround) |

### 40.2 Development Tips

1. **Check backend logs:** Backend console shows all API requests and errors
2. **Check browser Network tab:** See API calls, status codes, response bodies
3. **Use MongoDB Compass:** Visual database browser at `mongodb://localhost:27017`
4. **Reset database:** Drop `placement_management` database and re-seed
5. **Clear localStorage:** If auth issues persist, clear browser localStorage

### 40.3 Production Debugging

1. **Check `/api/health`** — is the process alive?
2. **Check `/api/ready`** — is MongoDB connected?
3. **Check `/metrics`** — request rates, latency, error counts
4. **Check Pino logs** — structured JSON with request IDs
5. **Check Docker logs:** `docker compose logs backend --tail 100`

---

## 41. VIVA VOCE PREPARATION — 50 QUESTIONS AND ANSWERS

### 41.1 General Questions

**Q1: What is the Placement Management System?**
A: A web-based platform that automates campus recruitment by connecting students, recruiters, and placement cell administrators in a single digital system.

**Q2: Why did you choose the MERN stack?**
A: MERN uses JavaScript throughout (frontend and backend), MongoDB provides flexible schema for varying job criteria, React offers component-based UI, and Express is the industry-standard Node.js API framework.

**Q3: What are the three user roles?**
A: Student, Recruiter, and Admin (Placement Cell).

**Q4: How many database collections are there?**
A: Nine — students, recruiters, admins, jobs, applications, interviews, notifications, announcements, and refreshtokens.

**Q5: What is the application status workflow?**
A: Applied → Shortlisted → Interview → Selected/Rejected.

### 41.2 Technical Questions

**Q6: How is authentication implemented?**
A: JWT access tokens (15 min, Bearer header) + refresh tokens (7 days, httpOnly cookie) with rotation on each refresh.

**Q7: How are passwords stored?**
A: bcrypt hashed with 10 salt rounds. Never stored in plain text.

**Q8: What is the eligibility checking logic?**
A: Before applying, the system checks: student CGPA >= job minCgpa, student branch in job branches (or "All"), and current date <= job deadline.

**Q9: How does pagination work?**
A: API accepts `page` and `limit` query params. Returns `{ items, total, page, limit, pages }`. Frontend uses Previous/Next buttons.

**Q10: What is Zod used for?**
A: Runtime input validation. Schemas define expected types, lengths, and patterns. Returns structured error messages on validation failure.

**Q11: What security measures are implemented?**
A: Helmet, rate limiting, mongo-sanitize, HPP, bcrypt, JWT, httpOnly cookies, CORS whitelist, strong password rules, role-based access.

**Q12: How are notifications sent?**
A: `createNotification()` saves to MongoDB (in-app) and optionally sends email via Nodemailer. SMS/WhatsApp are stubbed.

**Q13: What is the difference between health and readiness endpoints?**
A: Health checks if the process is alive. Readiness checks if MongoDB is connected and the server can serve traffic.

**Q14: How does Docker deployment work?**
A: Three containers — MongoDB, Express backend, Nginx frontend. Healthchecks ensure startup order. `docker compose up --build`.

**Q15: What is graceful shutdown?**
A: On SIGTERM/SIGINT, server stops accepting new connections, waits for in-flight requests, closes MongoDB, then exits.

### 41.3 Database Questions

**Q16: Why MongoDB over SQL?**
A: Flexible schema for varying job criteria and notification metadata. JSON-native alignment with JavaScript. Fast development iteration.

**Q17: How do you prevent duplicate applications?**
A: Unique compound index on `{ student, job }` in Application model.

**Q18: What is Mongoose populate?**
A: Like SQL JOIN — fetches referenced documents. Example: `Job.find().populate('recruiter', 'companyName')`.

**Q19: How are reports generated?**
A: MongoDB aggregation pipelines with `$lookup` (join), `$group` (aggregate), and `$cond` (conditional count).

**Q20: What is soft delete for jobs?**
A: Setting `isActive: false` instead of deleting the document. Preserves application history.

### 41.4 Frontend Questions

**Q21: What is React Router used for?**
A: Client-side routing. Nested routes for role-based pages. `ProtectedRoute` guards authenticated routes.

**Q22: How does token refresh work in the frontend?**
A: Axios response interceptor catches 401, calls `/auth/refresh` (cookie sent automatically), updates localStorage token, retries original request.

**Q23: What is AuthContext?**
A: React Context providing `user`, `login`, `logout` globally. Persists user to localStorage.

**Q24: Why Vite over Create React App?**
A: Faster dev server, native ES modules, optimized builds, simpler configuration.

**Q25: How does the SPA work with Nginx?**
A: Nginx serves `index.html` for all non-API routes (`try_files $uri /index.html`). React Router handles client-side navigation.

### 41.5 Testing Questions

**Q26: What is a smoke test?**
A: Quick end-to-end test verifying the complete user flow works — register, login, post job, apply, schedule interview.

**Q27: What load testing tools are used?**
A: autocannon (Node.js) for quick benchmarks, k6 for advanced scenarios with ramp-up and thresholds.

**Q28: What does CI pipeline do?**
A: GitHub Actions — installs dependencies, builds frontend, seeds admin, starts backend, runs smoke test on every push.

**Q29: What were the load test results?**
A: ~2,034 requests/sec on `/api/health`, 48ms avg latency, 0 errors, 0 timeouts.

**Q30: How do you clean up test data?**
A: `npm run smoke:cleanup` removes smoke test users from MongoDB.

### 41.6 Deployment Questions

**Q31: What environment variables are required?**
A: MONGODB_URI, JWT_SECRET (minimum). Others have sensible defaults.

**Q32: How is resume storage handled in production?**
A: Cloudinary cloud storage when configured. Local disk fallback in development.

**Q33: What is the production deployment checklist?**
A: Strong JWT secret, MongoDB Atlas, Cloudinary, SMTP, HTTPS, CORS origins, monitoring, backups, load testing.

**Q34: How do you scale for high traffic?**
A: Horizontal backend scaling behind load balancer, MongoDB replica set, Redis caching, CDN for static assets.

**Q35: What is Prometheus metrics used for?**
A: `/metrics` endpoint exposes request counts, latency histograms for monitoring with Grafana.

### 41.7 Design Questions

**Q36: What design pattern is used in the backend?**
A: MVC-like — Routes → Controllers → Models. Middleware for cross-cutting concerns (auth, validation, logging).

**Q37: Why separate route and controller files?**
A: Routes define URL mappings and middleware chain. Controllers contain business logic. Separation of concerns.

**Q38: What is the three-tier architecture?**
A: Presentation (React), Application (Express API), Data (MongoDB).

**Q39: How is file upload handled?**
A: Multer middleware accepts multipart form data. Cloudinary storage in production, local disk in development. 5MB limit, PDF/DOC only.

**Q40: What happens when a recruiter is not approved?**
A: Login returns 403 "Company not yet approved by admin". Admin must click Approve on Recruiters page.

### 41.8 Advanced Questions

**Q41: What is refresh token rotation?**
A: Each refresh revokes the old token and issues a new one. Prevents replay attacks if a token is stolen.

**Q42: What is the jti field in refresh tokens?**
A: JWT ID — unique UUID per token. Prevents collision when multiple tokens are generated in the same second.

**Q43: How does email verification work?**
A: Random token generated, SHA-256 hashed and stored with 24h expiry. Email link contains raw token. Server compares hashes.

**Q44: What is express-mongo-sanitize?**
A: Strips `$` and `.` from user input to prevent NoSQL injection attacks.

**Q45: What is HPP middleware?**
A: HTTP Parameter Pollution protection. Prevents duplicate query parameters from causing unexpected behavior.

**Q46: How does the notification metadata field work?**
A: Stores related IDs (jobId, applicationId, interviewId) as JSON. Enables deep-linking in future UI enhancements.

**Q47: What is the upsert pattern in interview scheduling?**
A: `findOneAndUpdate` with `{ upsert: true }` — creates interview if none exists, updates if one already exists for the application.

**Q48: Why httpOnly cookies for refresh tokens?**
A: JavaScript cannot access httpOnly cookies, protecting refresh tokens from XSS attacks.

**Q49: What is the purpose of request ID (x-request-id)?**
A: Unique identifier per request for log tracing. Appears in Pino logs and response headers.

**Q50: What future enhancements are planned?**
A: Redis caching, job queues for async notifications, AI resume parsing, video interview integration, mobile app, multi-tenant SaaS.

---

## 42. SAMPLE DATA DOCUMENTS

### 42.1 Sample Student Document

```json
{
  "_id": "665a1b2c3d4e5f6a7b8c9d0e",
  "name": "Priya Sharma",
  "email": "priya.sharma@college.edu",
  "password": "$2a$10$hashed...",
  "phone": "9876543210",
  "branch": "CSE",
  "cgpa": 8.7,
  "resume": "https://res.cloudinary.com/.../resume.pdf",
  "isActive": true,
  "emailVerified": true,
  "createdAt": "2026-01-15T08:00:00.000Z",
  "updatedAt": "2026-03-20T14:30:00.000Z"
}
```

### 42.2 Sample Job Document

```json
{
  "_id": "665b2c3d4e5f6a7b8c9d0e1f",
  "title": "Full Stack Developer",
  "description": "We are looking for a passionate full-stack developer...",
  "salary": "10 LPA",
  "location": "Hyderabad",
  "jobType": "Full-time",
  "criteria": {
    "minCgpa": 7.5,
    "branches": ["CSE", "IT"],
    "maxBacklogs": 0
  },
  "deadline": "2026-07-15T23:59:59.000Z",
  "recruiter": "665a0a1b2c3d4e5f6a7b8c9d0a",
  "isActive": true,
  "vacancies": 3,
  "createdAt": "2026-06-01T10:00:00.000Z"
}
```

### 42.3 Sample Application Document

```json
{
  "_id": "665c3d4e5f6a7b8c9d0e1f2a",
  "student": "665a1b2c3d4e5f6a7b8c9d0e",
  "job": "665b2c3d4e5f6a7b8c9d0e1f",
  "status": "Shortlisted",
  "appliedAt": "2026-06-10T09:15:00.000Z",
  "remarks": "Strong DSA skills, proceed to technical round",
  "createdAt": "2026-06-10T09:15:00.000Z"
}
```

### 42.4 Sample Interview Document

```json
{
  "_id": "665d4e5f6a7b8c9d0e1f2a3b",
  "application": "665c3d4e5f6a7b8c9d0e1f2a",
  "job": "665b2c3d4e5f6a7b8c9d0e1f",
  "student": "665a1b2c3d4e5f6a7b8c9d0e",
  "recruiter": "665a0a1b2c3d4e5f6a7b8c9d0a",
  "scheduledAt": "2026-06-20T10:00:00.000Z",
  "mode": "Online",
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "venue": "",
  "notes": "Technical round — DSA and system design",
  "status": "Scheduled",
  "createdAt": "2026-06-12T16:00:00.000Z"
}
```

---

## 43. SYSTEM REQUIREMENTS

### 43.1 Hardware Requirements (Development)

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Processor | Intel i3 / AMD Ryzen 3 | Intel i5 / AMD Ryzen 5 |
| RAM | 4 GB | 8 GB |
| Storage | 2 GB free | 5 GB free |
| Network | Internet for npm install | Broadband |

### 43.2 Software Requirements

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18+ (20 recommended) | Runtime |
| npm | 9+ | Package manager |
| MongoDB | 6+ (7 in Docker) | Database |
| Docker Desktop | Latest | Container deployment |
| Git | Latest | Version control |
| Modern browser | Chrome/Firefox/Edge | Frontend access |

### 43.3 Production Server Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 2 GB | 4 GB |
| Storage | 20 GB SSD | 50 GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |
| MongoDB | Atlas M0 (free) | Atlas M10+ |

---

## 44. PROJECT TIMELINE (SUGGESTED)

| Phase | Duration | Activities |
|-------|----------|------------|
| Phase 1: Planning | 1 week | Requirements, ER diagram, tech selection |
| Phase 2: Backend Core | 2 weeks | Models, auth, CRUD APIs |
| Phase 3: Frontend Core | 2 weeks | Pages, routing, API integration |
| Phase 4: Features | 2 weeks | Interviews, notifications, reports |
| Phase 5: Security | 1 week | Validation, rate limits, token refresh |
| Phase 6: Testing | 1 week | Smoke tests, load tests, manual testing |
| Phase 7: Deployment | 1 week | Docker, CI, documentation |
| **Total** | **10 weeks** | |

---

## 45. REFERENCES AND RESOURCES

1. MongoDB Documentation — https://www.mongodb.com/docs/
2. Express.js Guide — https://expressjs.com/
3. React Documentation — https://react.dev/
4. Node.js Documentation — https://nodejs.org/docs/
5. JWT Introduction — https://jwt.io/introduction
6. Mongoose Docs — https://mongoosejs.com/docs/
7. Vite Guide — https://vitejs.dev/guide/
8. Docker Compose — https://docs.docker.com/compose/
9. Zod Validation — https://zod.dev/
10. Prometheus Client — https://github.com/siimon/prom-client
11. autocannon — https://github.com/mcollina/autocannon
12. k6 Load Testing — https://k6.io/docs/
13. Helmet.js — https://helmetjs.github.io/
14. Cloudinary Docs — https://cloudinary.com/documentation
15. Nodemailer — https://nodemailer.com/about/

---

## 46. SOFTWARE ENGINEERING CONCEPTS APPLIED

| Concept | Where Applied |
|---------|---------------|
| MVC Architecture | Routes → Controllers → Models |
| Middleware Pattern | Auth, validation, logging, security |
| Repository Pattern | Mongoose models abstract DB access |
| Observer Pattern | Notifications on status changes |
| Singleton Pattern | Logger, metrics registry |
| Factory Pattern | Token generation functions |
| Strategy Pattern | Cloudinary vs local storage selection |
| Dependency Injection | Config modules imported where needed |
| Separation of Concerns | Frontend/backend/database layers |
| DRY Principle | Reusable components, utility modules |
| SOLID — Single Responsibility | Each controller handles one domain |
| RESTful API Design | Resource-based URLs, HTTP verbs |
| Soft Delete | `isActive` flag instead of hard delete |
| Upsert | Interview scheduling create-or-update |
| Pagination | Offset-based with page/limit/total |
| Token Rotation | Refresh token security |
| Graceful Degradation | Console email fallback without SMTP |
| Health Checks | Liveness and readiness probes |
| Infrastructure as Code | Docker Compose YAML |
| CI/CD | GitHub Actions automated pipeline |

---

## 47. COMPARISON WITH SIMILAR SYSTEMS

| Feature | This System | Traditional Excel | Commercial ERP |
|---------|-------------|-------------------|----------------|
| Cost | Free (open source) | Free | Expensive license |
| Customization | Full source code access | Limited | Vendor-dependent |
| Online access | Yes (web-based) | No (local files) | Yes |
| Real-time updates | Yes | No | Yes |
| Role-based access | Yes | No | Yes |
| Notifications | In-app + email | Manual | Email/SMS |
| Reports | Automated aggregation | Manual pivot tables | Built-in |
| Scalability | Docker + cloud ready | Poor | Enterprise-grade |
| Resume storage | Cloudinary CDN | Local folders | Vendor cloud |
| API access | Full REST API | None | Vendor API |
| Mobile friendly | Responsive web | No | Native apps |

---

## 48. DATA FLOW DIAGRAMS

### 48.1 Level 0 DFD (Context Diagram)

```
                    ┌─────────────────────────┐
                    │                         │
   Students ───────►│  Placement Management   │──────► Notifications
                    │       System            │
   Recruiters ─────►│                         │──────► Reports
                    │                         │
   Admin ──────────►│                         │──────► Email Service
                    │                         │
                    └───────────┬─────────────┘
                                │
                                ▼
                           MongoDB
                         Cloudinary
```

### 48.2 Level 1 DFD — Student Apply Flow

```
Student → [Login] → Auth Module → JWT Token
Student → [Browse Jobs] → Job Module → MongoDB (jobs collection)
Student → [Apply] → Eligibility Check → Application Module → MongoDB (applications)
                                              ↓
                                    Notification Module → Student (in-app + email)
```

### 48.3 Level 1 DFD — Recruiter Workflow

```
Recruiter → [Register] → Auth Module → Pending Approval
Admin → [Approve] → Admin Module → Recruiter activated
Recruiter → [Post Job] → Job Module → MongoDB (jobs)
Recruiter → [View Applicants] → Application Module → MongoDB (applications + students)
Recruiter → [Update Status] → Application Module → Notification Module
Recruiter → [Schedule Interview] → Interview Module → Notification Module
```

---

## 49. ACADEMIC PROJECT SUBMISSION CHECKLIST

- [x] Problem statement and objectives defined
- [x] Literature survey / existing system comparison
- [x] System architecture diagram
- [x] ER diagram / database design (9 collections)
- [x] Technology stack justification
- [x] Frontend implementation (18+ pages)
- [x] Backend implementation (7 controllers, 7 route files)
- [x] Authentication and security features
- [x] API documentation with examples
- [x] User manuals for all three roles
- [x] Testing (smoke, load, manual test cases)
- [x] Deployment guide (local + Docker)
- [x] Source code with proper structure
- [x] README with quick start instructions
- [x] Default admin credentials documented
- [x] Future enhancements listed
- [x] Conclusion and references
- [x] Viva preparation questions
- [x] Production readiness assessment
- [x] CI/CD pipeline

---

## 50. ACKNOWLEDGMENTS

This project was developed as a comprehensive campus placement automation solution using modern web technologies. The MERN stack was chosen for its industry relevance, developer productivity, and scalability potential.

Special thanks to the open-source community for the excellent tools and libraries that made this project possible: MongoDB, Express.js, React, Node.js, Mongoose, JWT, Zod, Helmet, Docker, and many others documented in the References section.

---

**END OF PROJECT REPORT**

*Placement Management System — PlaceHub*  
*Developed using MERN Stack*  
*Total Sections: 50*  
*Document generated: June 2026*  
*For quick start, see README.md*  
*For Word/PDF export: open this file in VS Code and use "Markdown PDF" extension, or paste into Microsoft Word*
