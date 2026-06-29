require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();

  const existing = await Admin.findOne({ username: 'admin' });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  await Admin.create({
    username: 'admin',
    password: 'admin123',
    name: 'System Administrator',
  });

  console.log('Admin seeded successfully');
  console.log('Username: admin');
  console.log('Password: admin123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
