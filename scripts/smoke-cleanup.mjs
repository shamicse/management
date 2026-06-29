import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const mongoose = require('../backend/node_modules/mongoose');

const MONGO_URI = process.env.SMOKE_MONGO_URI || 'mongodb://localhost:27017/placement_management';

const run = async () => {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  const recruiterIds = await db
    .collection('recruiters')
    .find({ email: /^recruiter_smoke_\d+@example\.com$/ })
    .project({ _id: 1 })
    .toArray();
  const recruiterIdSet = recruiterIds.map((x) => x._id);

  const studentIds = await db
    .collection('students')
    .find({ email: /^student_smoke_\d+@example\.com$/ })
    .project({ _id: 1 })
    .toArray();
  const studentIdSet = studentIds.map((x) => x._id);

  const jobIds = await db
    .collection('jobs')
    .find({ title: /^Smoke Software Engineer \d+$/ })
    .project({ _id: 1 })
    .toArray();
  const jobIdSet = jobIds.map((x) => x._id);

  const appIds = await db
    .collection('applications')
    .find({
      $or: [
        { student: { $in: studentIdSet } },
        { job: { $in: jobIdSet } },
      ],
    })
    .project({ _id: 1 })
    .toArray();
  const appIdSet = appIds.map((x) => x._id);

  const result = {
    interviews: await db.collection('interviews').deleteMany({
      $or: [{ application: { $in: appIdSet } }, { student: { $in: studentIdSet } }, { recruiter: { $in: recruiterIdSet } }],
    }),
    notifications: await db.collection('notifications').deleteMany({
      $or: [{ recipient: { $in: studentIdSet } }, { recipient: { $in: recruiterIdSet } }],
    }),
    applications: await db.collection('applications').deleteMany({ _id: { $in: appIdSet } }),
    jobs: await db.collection('jobs').deleteMany({ _id: { $in: jobIdSet } }),
    refreshTokens: await db.collection('refreshtokens').deleteMany({
      $or: [{ userId: { $in: studentIdSet } }, { userId: { $in: recruiterIdSet } }],
    }),
    students: await db.collection('students').deleteMany({ _id: { $in: studentIdSet } }),
    recruiters: await db.collection('recruiters').deleteMany({ _id: { $in: recruiterIdSet } }),
  };

  await mongoose.disconnect();

  console.log('SMOKE CLEANUP COMPLETED');
  console.log({
    interviews: result.interviews.deletedCount,
    notifications: result.notifications.deletedCount,
    applications: result.applications.deletedCount,
    jobs: result.jobs.deletedCount,
    refreshTokens: result.refreshTokens.deletedCount,
    students: result.students.deletedCount,
    recruiters: result.recruiters.deletedCount,
  });
};

run().catch((err) => {
  console.error('SMOKE CLEANUP FAILED');
  console.error(err.message);
  process.exit(1);
});

