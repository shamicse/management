import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const mongoose = require('../backend/node_modules/mongoose');

const API_BASE = process.env.SMOKE_API_BASE || 'http://localhost:5000/api';
const MONGO_URI = process.env.SMOKE_MONGO_URI || 'mongodb://localhost:27017/placement_management';
const ADMIN_USERNAME = process.env.SMOKE_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.SMOKE_ADMIN_PASSWORD || 'admin123';
const PASSWORD = process.env.SMOKE_TEST_PASSWORD || 'StrongPass1';

const suffix = Date.now().toString().slice(-6);
const recruiterEmail = `recruiter_smoke_${suffix}@example.com`;
const studentEmail = `student_smoke_${suffix}@example.com`;

const req = async (path, { method = 'GET', token, body } = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    throw new Error(`${method} ${path} failed (${res.status}): ${JSON.stringify(json)}`);
  }
  return json;
};

const step = (title, extra = '') => {
  console.log(`PASS - ${title}${extra ? ` :: ${extra}` : ''}`);
};

const setDirectFlagsForSmoke = async () => {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;
  await db.collection('recruiters').updateOne(
    { email: recruiterEmail },
    { $set: { emailVerified: true, isApproved: true } }
  );
  await db.collection('students').updateOne({ email: studentEmail }, { $set: { emailVerified: true } });
  await mongoose.disconnect();
};

try {
  console.log(`Smoke base: ${API_BASE}`);
  console.log(`Smoke users: ${recruiterEmail}, ${studentEmail}`);

  const recruiterReg = await req('/auth/recruiter/register', {
    method: 'POST',
    body: {
      companyName: `Smoke Corp ${suffix}`,
      hrName: 'Smoke Recruiter',
      email: recruiterEmail,
      password: PASSWORD,
      phone: '9999999999',
      website: 'https://example.com',
      description: 'Automated smoke recruiter',
    },
  });
  step('Recruiter registration', recruiterReg._id);

  const studentReg = await req('/auth/student/register', {
    method: 'POST',
    body: {
      name: `Smoke Student ${suffix}`,
      email: studentEmail,
      password: PASSWORD,
      phone: '8888888888',
      branch: 'CSE',
      cgpa: 8.7,
    },
  });
  step('Student registration', studentReg._id);

  await setDirectFlagsForSmoke();
  step('Email verification + recruiter approval (DB-assisted smoke setup)');

  const adminLogin = await req('/auth/login', {
    method: 'POST',
    body: { role: 'admin', email: ADMIN_USERNAME, password: ADMIN_PASSWORD },
  });
  step('Admin login');

  const recruiterLogin = await req('/auth/login', {
    method: 'POST',
    body: { role: 'recruiter', email: recruiterEmail, password: PASSWORD },
  });
  step('Recruiter login');

  const job = await req('/jobs', {
    method: 'POST',
    token: recruiterLogin.token,
    body: {
      title: `Smoke Software Engineer ${suffix}`,
      description: 'Smoke test job posting',
      salary: '8 LPA',
      location: 'Remote',
      jobType: 'Full-time',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      criteria: { minCgpa: 7, branches: ['CSE', 'IT'], maxBacklogs: 0 },
      vacancies: 2,
    },
  });
  step('Recruiter posted job', job._id);

  const studentLogin = await req('/auth/login', {
    method: 'POST',
    body: { role: 'student', email: studentEmail, password: PASSWORD },
  });
  step('Student login');

  const app = await req(`/jobs/${job._id}/apply`, {
    method: 'POST',
    token: studentLogin.token,
  });
  step('Student applied for job', app._id);

  await req(`/jobs/${job._id}/applications/${app._id}`, {
    method: 'PUT',
    token: recruiterLogin.token,
    body: { status: 'Interview', remarks: 'Smoke interview round' },
  });
  step('Recruiter updated application status to Interview');

  const interview = await req(`/interviews/applications/${app._id}/schedule`, {
    method: 'POST',
    token: recruiterLogin.token,
    body: {
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      mode: 'Online',
      meetingLink: 'https://meet.google.com/smoke-test',
      notes: 'Smoke test interview notes',
    },
  });
  step('Recruiter scheduled interview', interview._id);

  const interviews = await req('/interviews/student/me', { token: studentLogin.token });
  step('Student can view interviews', `count=${interviews.length}`);

  const notifications = await req('/notifications/me', { token: studentLogin.token });
  step('Student can view notifications', `count=${(notifications.items || []).length}`);

  console.log('\nSMOKE TEST COMPLETED SUCCESSFULLY');
  console.log(`Use npm run smoke:cleanup to remove smoke data for suffix ${suffix}.`);
} catch (err) {
  console.error('\nSMOKE TEST FAILED');
  console.error(err.message);
  process.exit(1);
}

