# Errors & Fixes — Placement Management System

This document explains the main errors encountered during development and testing of this project, **why they happened**, and **how they were fixed**. Use it for debugging, viva preparation, or future maintenance.

---

## Table of Contents

1. [Pages Stuck on "Loading..."](#1-pages-stuck-on-loading)
2. [Notifications / Interviews Show "Try Again"](#2-notifications--interviews-show-try-again)
3. [Login & Register Show "Server Error"](#3-login--register-show-server-error)
4. [CORS Blocked Origin (127.0.0.1 vs localhost)](#4-cors-blocked-origin-127001-vs-localhost)
5. [Backend Crash: EADDRINUSE Port 5000](#5-backend-crash-eaddrinuse-port-5000)
6. [Infinite Token Refresh Loop](#6-infinite-token-refresh-loop)
7. [Register Shows "Server Error" (Zod v4 Bug)](#7-register-shows-server-error-zod-v4-bug)
8. [Profile / Interviews / Applications — "Access Denied"](#8-profile--interviews--applications--access-denied)
9. [Logged Out Automatically After a Few Minutes](#9-logged-out-automatically-after-a-few-minutes)
10. [Quick Diagnostic Checklist](#10-quick-diagnostic-checklist)
11. [How to Verify Everything Works](#11-how-to-verify-everything-works)

---

## 1. Pages Stuck on "Loading..."

### Symptoms

These pages never finished loading and stayed on text like:

- `Loading profile...`
- `Loading notifications...`
- `Loading interviews...`
- `Loading applications...`

Empty states such as **"No notifications yet"** or **"No interviews scheduled yet"** never appeared.

### Affected Pages

| Page | File |
|------|------|
| Student Profile | `frontend/src/pages/student/StudentProfile.jsx` |
| Notifications | `frontend/src/pages/Notifications.jsx` |
| Student Interviews | `frontend/src/pages/student/StudentInterviews.jsx` |
| Student Applications | `frontend/src/pages/student/StudentApplications.jsx` |
| Recruiter Profile | `frontend/src/pages/recruiter/RecruiterProfile.jsx` |

### Root Cause

Two separate issues combined:

**A) No error handling on API calls**

Original code looked like this:

```javascript
useEffect(() => {
  api.get('/notifications/me').then((res) => {
    setData(res.data);
    setLoading(false);  // only runs on SUCCESS
  });
  // No .catch() — if API fails, loading stays true forever
}, []);
```

If the API request failed (401, 500, network error, CORS), `setLoading(false)` was **never called**, so the UI remained on "Loading..." indefinitely.

**B) Infinite refresh loop in Axios interceptor**

When the access token expired, the Axios response interceptor in `frontend/src/services/api.js` retried **every** `401` response — including failures from `/auth/refresh` itself. That created an endless loop where the promise never resolved.

### Solution

**1. Added proper `try / catch / finally` on every data-fetching page:**

```javascript
const load = useCallback(async () => {
  setLoading(true);
  setError('');
  try {
    const { data } = await api.get('/notifications/me');
    setData(data);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to load notifications');
  } finally {
    setLoading(false);  // ALWAYS runs
  }
}, []);
```

**2. Created shared UI components:**

| Component | Purpose |
|-----------|---------|
| `PageLoader.jsx` | Animated spinner while loading |
| `EmptyState.jsx` | Friendly message when list is empty |
| `ErrorState.jsx` | Error message + "Try Again" button |

**3. Fixed the Axios interceptor** (see [Section 6](#6-infinite-token-refresh-loop)).

### Files Changed

- `frontend/src/services/api.js`
- `frontend/src/components/PageLoader.jsx` (new)
- `frontend/src/components/EmptyState.jsx` (new)
- `frontend/src/components/ErrorState.jsx` (new)
- `frontend/src/pages/student/StudentProfile.jsx`
- `frontend/src/pages/student/StudentApplications.jsx`
- `frontend/src/pages/student/StudentInterviews.jsx`
- `frontend/src/pages/Notifications.jsx`
- `frontend/src/pages/recruiter/RecruiterProfile.jsx`
- `frontend/src/index.css` (loader + empty state styles)

---

## 2. Notifications / Interviews Show "Try Again"

### Symptoms

After the loading fix, pages showed an error card:

```
Something went wrong
Server Error
[ Try Again ]
```

Clicking **Try Again** repeated the same error.

### Root Cause

This was a **downstream effect** of the CORS and backend crash issues (Sections 3–5). The frontend correctly surfaced the error, but the underlying API call was still failing with HTTP 500.

Typical failure chain:

```
Browser → POST /api/auth/login (or GET /api/notifications/me)
       → Backend rejects request (CORS or crashed server)
       → Returns 500 { "message": "Server Error" }
       → Frontend shows ErrorState with "Try Again"
```

### Solution

Fixing CORS and restarting the backend resolved the API failures. The "Try Again" button then worked and empty states appeared correctly.

### What Users Should Do After a Fix

1. Hard refresh the browser (`Ctrl + Shift + R`)
2. Clear `localStorage` key `user` (old invalid token)
3. Log in again
4. Revisit Notifications / Interviews / Applications — they should show empty states or real data

---

## 3. Login & Register Show "Server Error"

### Symptoms

- Login form submitted → red alert: **"Server Error"**
- Student or recruiter registration → **"Server Error"** or **"Registration failed"**
- Direct API tests from terminal sometimes worked, but browser requests failed

### Root Cause

The global Express error handler in `backend/server.js` converted **all unhandled errors** into a generic response:

```javascript
// Before fix
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = status === 500 ? 'Server Error' : err.message;
  res.status(status).json({ message });
});
```

When CORS rejected a request, the `cors` middleware called:

```javascript
return cb(new Error('Not allowed by CORS'));
```

That error bubbled to the handler above and became:

```json
HTTP 500
{ "message": "Server Error" }
```

So the real problem (**CORS origin not allowed**) was hidden behind a vague message.

### Solution

**1. Fixed CORS** to allow both `localhost` and `127.0.0.1` (see Section 4).

**2. Added a dedicated CORS error response:**

```javascript
app.use((err, req, res, next) => {
  if (err.message?.startsWith('CORS blocked origin:')) {
    return res.status(403).json({
      message: 'This site origin is not allowed. Use http://localhost:3000 or add your URL to CORS_ORIGINS.',
    });
  }
  // ... other errors
});
```

**3. Improved frontend login/register error messages:**

```javascript
if (!err.response) {
  setError('Cannot reach server. Make sure the backend is running on port 5000.');
} else {
  setError(err.response.data.message || 'Login failed');
}
```

### Files Changed

- `backend/server.js`
- `backend/config/cors.js` (new)
- `backend/.env`
- `backend/.env.example`
- `docker-compose.yml`
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Register.jsx`

---

## 4. CORS Blocked Origin (127.0.0.1 vs localhost)

### Symptoms

| URL in browser | Result |
|----------------|--------|
| `http://localhost:3000` | Sometimes worked |
| `http://127.0.0.1:3000` | **Server Error** on all API calls |

### What is CORS?

**CORS (Cross-Origin Resource Sharing)** is a browser security feature. When JavaScript on `http://127.0.0.1:3000` calls an API, the browser sends:

```
Origin: http://127.0.0.1:3000
```

The backend must explicitly allow that origin, or the browser blocks the response.

### Why It Failed

Original `.env` only allowed one origin:

```env
CORS_ORIGINS=http://localhost:3000
```

`http://127.0.0.1:3000` is a **different origin** from `http://localhost:3000` (even though they point to the same machine). The backend rejected it.

### How We Reproduced It

```powershell
# This FAILED (500 Server Error)
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Headers @{ Origin = "http://127.0.0.1:3000" } `
  -Body '{"email":"admin","password":"admin123","role":"admin"}' `
  -ContentType "application/json"

# This WORKED (200 OK)
# Same request with Origin: http://localhost:3000
```

### Solution

**1. Created `backend/config/cors.js`:**

```javascript
const LOCAL_DEV_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  // In development, allow any localhost / 127.0.0.1 port
  if (env.NODE_ENV === 'development' && LOCAL_DEV_ORIGIN.test(origin)) return true;
  return false;
};
```

**2. Updated `backend/.env`:**

```env
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

**3. Updated `docker-compose.yml` for production Docker:**

```yaml
CORS_ORIGINS: http://localhost:3000,http://127.0.0.1:3000
```

### Diagram

```
BEFORE (broken):
  Browser @ 127.0.0.1:3000
       │  Origin: http://127.0.0.1:3000
       ▼
  Vite proxy → Backend :5000
       │  CORS check: NOT in allowed list
       ▼
  ❌ 500 Server Error

AFTER (fixed):
  Browser @ 127.0.0.1:3000
       │  Origin: http://127.0.0.1:3000
       ▼
  Vite proxy → Backend :5000
       │  CORS check: matches dev regex OR explicit list
       ▼
  ✅ 200 OK
```

---

## 5. Backend Crash: EADDRINUSE Port 5000

### Symptoms

- API suddenly stopped working
- Terminal showed:

```
Error: listen EADDRINUSE: address already in use :::5000
[nodemon] app crashed - waiting for file changes before starting...
```

- Health check still responded (from an **old** process still holding port 5000)
- New code changes (including CORS fix) were **not** active

### Root Cause

When `nodemon` restarted after file changes, the **previous Node process did not release port 5000** fast enough (or a duplicate `node server.js` was still running). The new server could not bind to the port and crashed.

Meanwhile, the **old server** (without CORS fixes) kept serving requests — making debugging confusing.

### Solution

**1. Kill the process on port 5000 (Windows PowerShell):**

```powershell
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
```

**2. Restart the backend cleanly:**

```bash
cd backend
npm run dev
```

**3. Confirm server started:**

```bash
# Should return {"status":"ok",...}
curl http://localhost:5000/api/health
```

### Prevention Tips

- Run only **one** backend instance at a time
- Before `npm run dev`, check port 5000 is free
- If using Docker **and** local Node backend, stop one — both use port 5000
- After code changes, check terminal for `Server started` (not `EADDRINUSE`)

---

## 6. Infinite Token Refresh Loop

### Symptoms

- Protected pages hung on "Loading..." even when backend was healthy
- Browser Network tab showed many repeated calls to `/api/auth/refresh`
- Never reached empty state or data

### Root Cause

The Axios response interceptor retried on **every** `401`:

```javascript
// BEFORE (buggy)
if (error.response?.status === 401 && !original?._retry) {
  original._retry = true;
  const { data } = await api.post('/auth/refresh');  // if THIS returns 401...
  // ...refresh request also hits interceptor → tries refresh again → infinite loop
}
```

When the refresh token was missing or expired:

1. API call → `401`
2. Interceptor calls `/auth/refresh` → `401`
3. Refresh failure also hits interceptor → calls `/auth/refresh` again
4. Loop never ends → page stuck loading

### Solution

**Skip refresh retry for auth endpoints:**

```javascript
const AUTH_SKIP_REFRESH = ['/auth/refresh', '/auth/login'];

if (
  error.response?.status !== 401 ||
  original?._retry ||
  shouldSkipRefresh(original?.url)
) {
  return Promise.reject(error);
}
```

**Also fixed queued requests** when refresh fails — they now reject instead of hanging:

```javascript
const onRefreshFailed = (error) => {
  pending.forEach((cb) => cb(null, error));
  pending = [];
};
```

### File Changed

- `frontend/src/services/api.js`

---

## 7. Register Shows "Server Error" (Zod v4 Bug)

### Symptoms

- Register form filled correctly → red alert: **"Server Error"**
- Happens especially when password is weak (e.g. `password123` without uppercase)
- Backend log shows:

```
TypeError: Cannot read properties of undefined (reading 'map')
    at backend/middleware/validate.js:15
```

### Root Cause

The project uses **Zod v4**, which stores validation errors in `err.issues`.

The validation middleware was written for **Zod v3**, which used `err.errors`:

```javascript
// BUGGY (Zod v3 API on Zod v4)
errors: err.errors.map(...)  // err.errors is undefined → crash → 500 Server Error
```

When password validation failed, instead of returning a helpful `400` message like *"Password must include an uppercase letter"*, the server crashed and returned generic **"Server Error"**.

### Solution

**Fixed `backend/middleware/validate.js`:**

```javascript
const formatZodIssues = (err) => {
  const issues = err.issues || err.errors || [];  // works on Zod v3 and v4
  return issues.map((e) => ({
    path: Array.isArray(e.path) ? e.path.join('.') : String(e.path ?? ''),
    message: e.message,
  }));
};
```

**Frontend improvements:**

- Register page shows validation messages clearly
- Password hint added: `Min 8 characters with uppercase, lowercase, and a number (e.g. StrongPass1)`

### Password Rules

| Rule | Example |
|------|---------|
| Min 8 characters | `StrongPass1` ✅ |
| One lowercase letter | `password` ❌ |
| One uppercase letter | `PASSWORD1` ❌ (no lowercase) |
| One number | `StrongPass` ❌ (no number) |

### Files Changed

- `backend/middleware/validate.js`
- `frontend/src/pages/Register.jsx`
- `frontend/src/pages/Login.jsx`

---

## 8. Profile / Interviews / Applications — "Access Denied"

### Symptoms

- **Notifications page** works fine ✅
- **Profile**, **My Interviews**, **My Applications** show:

```
Something went wrong
Access denied
[ Try Again ]
```

### Why Notifications Work But Other Pages Don't

| Page | API endpoint | Auth required |
|------|--------------|---------------|
| Notifications | `GET /api/notifications/me` | `protect` only (any logged-in role) |
| Profile | `GET /api/students/profile` | `protect` + **`authorize('student')`** |
| Applications | `GET /api/jobs/student/applications` | `protect` + **`authorize('student')`** |
| Interviews | `GET /api/interviews/student/me` | `protect` + **`authorize('student')`** |

Notifications accept **student, recruiter, or admin** tokens.

Profile, applications, and interviews require a JWT with **`role: 'student'`**.

If your token belongs to **admin** or **recruiter**, you get `403 Access denied`.

### Root Causes

**A) Logged in as admin, viewing student-only APIs**

Admin token + student-only route = `403 Access denied`.

**B) Stale session / mixed roles (most common)**

This happens when:

1. You register/login as **student** in one tab
2. You login as **admin** in another tab (or without logging out)
3. `localStorage` updates to admin token, but React state in the first tab still shows **student**
4. You see student navbar/pages, but API sends **admin JWT** → Access denied on student endpoints
5. Notifications still work because they don't check role

**C) Stale refresh cookie after logout**

1. Login as student → refresh cookie saved
2. Logout only cleared `localStorage` (cookie remained)
3. Login as admin → admin token in storage, old student cookie in browser
4. Token refresh can restore wrong role/token combination

### Solution

**1. Backend — clear stale cookies on every login:**

```javascript
// authController.js — login()
clearRefreshCookie(res);  // always clear old session first
if (role !== 'admin') {
  await issueRefreshToken({ res, userId: user._id, role, req });
}
```

**2. Frontend — logout now calls API to clear refresh cookie:**

```javascript
// AuthContext.jsx
const logout = async () => {
  await api.post('/auth/logout');  // clears httpOnly cookie
  setUser(null);
};
```

**3. Frontend — sync auth across tabs:**

`AuthContext` listens to `storage`, `focus`, and `auth-sync` events so all tabs use the same role/token.

**4. Login clears old session first:**

```javascript
await api.post('/auth/logout');  // before new login
const { data } = await api.post('/auth/login', { email, password, role });
```

**5. Better error UI with "Log out & sign in" button** when session mismatch is detected.

### What You Should Do Now

1. Click **Logout** in the navbar (top right)
2. Go to **Login** → select **Student** tab
3. Login with your student email and password (`StrongPass1` or similar)
4. If email not verified, check backend terminal for verification link
5. Revisit Profile / Applications / Interviews — should show data or empty states

**If you were testing as admin:** use admin pages only (`/admin/*`). Admin does not have student profile/applications/interviews.

### Files Changed

- `backend/controllers/authController.js`
- `backend/middleware/auth.js`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/services/api.js`
- `frontend/src/utils/authSync.js` (new)
- `frontend/src/components/ErrorState.jsx`
- `frontend/src/components/Navbar.jsx`
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/student/StudentProfile.jsx`
- `frontend/src/pages/student/StudentApplications.jsx`
- `frontend/src/pages/student/StudentInterviews.jsx`

---

## 9. Logged Out Automatically After a Few Minutes

### Symptoms

- You log in successfully, use the app for a while, then get sent back to the **Login** page
- Happens after roughly **15 minutes** of use or idle time (before the fix)
- Navbar shows you as logged out; `localStorage` `user` entry is cleared
- May happen faster if you have **multiple browser tabs** open

### Root Cause

Three issues combined:

**A) Short-lived access token (15 minutes)**

The JWT access token stored in `localStorage` expired after `ACCESS_TOKEN_EXPIRE=15m`. When it expired, the next API call returned `401` and triggered a silent refresh using the httpOnly refresh cookie.

**B) No proactive token refresh**

The app only tried to refresh **after** a request failed with `401`. If refresh failed (see C), the interceptor cleared `localStorage` and logged you out. There was no background timer to renew the token before expiry.

**C) Refresh cookie path + multi-tab rotation**

- Refresh cookie was scoped to `path: '/api/auth'`, which could be unreliable in some proxy/browser setups
- When two tabs refreshed at the same time, token rotation revoked the old refresh token; the losing tab got `401` and cleared the session

### Solution

**1. Proactive session refresh** (`frontend/src/utils/sessionRefresh.js`)

- Decodes JWT expiry and refreshes **2 minutes before** the access token expires
- Also refreshes on **window focus** when the token is within 5 minutes of expiry
- Wired into `AuthContext` so it runs for the whole session

**2. Longer access token for development**

```env
ACCESS_TOKEN_EXPIRE=1h
```

Refresh token still lasts 7 days (`REFRESH_TOKEN_EXPIRE=7d`), so you stay logged in across browser restarts as long as the refresh cookie is valid.

**3. Hardened refresh flow**

- Refresh cookie path changed to `/` (sent on all API routes)
- Axios interceptor retries refresh once on `401` (handles another tab rotating the token)
- Backend allows a **60-second grace window** for recently rotated refresh tokens

### What You Should Do Now

1. **Restart the backend** after pulling changes (reads new `ACCESS_TOKEN_EXPIRE`)
2. **Log out and log in again** once (gets a fresh refresh cookie with `path: /`)
3. Stay on one origin — use either `localhost:3000` or `127.0.0.1:3000`, not both interchangeably

### Files Changed

- `frontend/src/utils/sessionRefresh.js` (new)
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/services/api.js`
- `backend/controllers/authController.js`
- `backend/.env` / `backend/.env.example`
- `backend/config/env.js`

---

## 10. Quick Diagnostic Checklist

Use this when something breaks:

| Step | Check | Command / Action |
|------|-------|------------------|
| 1 | Is backend running? | `curl http://localhost:5000/api/health` |
| 2 | Is MongoDB connected? | `curl http://localhost:5000/api/ready` |
| 3 | Port 5000 conflict? | Look for `EADDRINUSE` in backend terminal |
| 4 | Which URL are you using? | Prefer `http://localhost:3000` or `http://127.0.0.1:3000` (both work after fix) |
| 5 | CORS issue? | DevTools → Network → failed request → check response |
| 6 | Stale login token? | DevTools → Application → Local Storage → delete `user` |
| 7 | Docker vs local conflict? | Don't run Docker backend and `npm run dev` both on port 5000 |
| 8 | Frontend proxy working? | DevTools → request URL should be `/api/...` not `:5000` directly |

### Common Error Messages

| Message | Likely Cause | Fix |
|---------|--------------|-----|
| `Server Error` | CORS blocked, or unhandled backend error | Check origin URL; restart backend |
| `Loading...` forever | API failed without catch (old code) or refresh loop | Pull latest code; clear localStorage |
| `Try Again` on data pages | Backend down or auth failed | Restart backend; log in again |
| `Cannot reach server` | Backend not running | `cd backend && npm run dev` |
| `Please verify your email` | Student/recruiter email not verified | Click verification link or verify in DB |
| `Company not yet approved` | Recruiter pending admin approval | Login as admin → approve recruiter |
| `EADDRINUSE :::5000` | Port already in use | Kill process on 5000; restart |
| Redirected to login after idle | Access token expired; refresh failed | Log in again; see [Section 9](#9-logged-out-automatically-after-a-few-minutes) |

---

## 11. How to Verify Everything Works

### Start the stack

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# Expect: "MongoDB connected" and "Server started"

# Terminal 2 — Frontend
cd frontend
npm run dev
# Expect: Local: http://localhost:3000
```

### Test login (both origins)

Open in browser:

- `http://localhost:3000/login`
- `http://127.0.0.1:3000/login`

Admin credentials: `admin` / `admin123`

### Test empty states (student)

1. Register a new student (password: `StrongPass1` or similar with upper/lower/number)
2. Verify email (check backend console for link if SMTP not configured)
3. Visit:
   - `/student/applications` → "No applications yet"
   - `/student/interviews` → "No interviews scheduled yet"
   - `/student/notifications` → may show notifications from registration

### Run automated smoke test

```bash
npm run smoke
```

Expected output ends with:

```
SMOKE TEST COMPLETED SUCCESSFULLY
```

---

## Summary

| # | Error | Root Cause | Fix |
|---|-------|------------|-----|
| 1 | Pages stuck on Loading | No `catch/finally`; refresh loop | Error handling + shared components |
| 2 | Try Again on data pages | API returning 500 | Fixed CORS + restarted backend |
| 3 | Login Server Error | CORS rejected `127.0.0.1` origin | Expanded CORS config |
| 4 | 127.0.0.1 vs localhost | Only `localhost` in `CORS_ORIGINS` | Added both + dev regex |
| 5 | EADDRINUSE port 5000 | Old process held port after restart | Kill port 5000; restart backend |
| 6 | Infinite refresh loop | `/auth/refresh` 401 re-triggered interceptor | Skip auth routes in interceptor |
| 7 | Register Server Error | Zod v4 `issues` vs v3 `errors` crash | Fixed `validate.js` + password hints |
| 8 | Access denied on student pages | Wrong role token / stale session | Logout API, cookie clear, tab sync |
| 9 | Auto logout after minutes | 15m token expiry; no proactive refresh | Session refresh timer + 1h token + cookie fix |

---

## Related Files

| File | Role |
|------|------|
| `README.md` | Project setup and quick start |
| `PROJECT_REPORT.md` | Full technical documentation |
| `backend/.env.example` | Environment variable reference |
| `backend/config/cors.js` | CORS allow-list logic |
| `frontend/src/utils/authSync.js` | Cross-tab auth sync + error messages |
| `frontend/src/utils/sessionRefresh.js` | Proactive JWT refresh before expiry |
| `scripts/smoke.mjs` | End-to-end API verification |

---

*Last updated: June 2026*
