const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const Admin = require('./models/Admin');

const createAdmin = async () => {
  await mongoose.connect('mongodb://localhost:27017/foodbridge');

  const existing = await Admin.findOne({ email: 'admin@foodbridge.com' });
  if (existing) {
    console.log('Admin already exists');
    process.exit();
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = new Admin({
    name: 'FoodBridge Admin',
    email: 'admin@foodbridge.com',
    password: hashedPassword
  });

  await admin.save();
  console.log('Admin account created: admin@foodbridge.com / admin123');
  process.exit();
};

createAdmin();