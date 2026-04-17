require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const { User } = require('./initDB');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/librarydb';

const insertAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@booklib.com';

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin already exists!');
      await mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await User.create({
      name:     'Admin',
      email,
      date:     '1991-08-31',
      password: hashedPassword,
      role:     'admin',
    });

    console.log('Admin inserted successfully!');
    console.log('Email:   ', email);
    console.log('Password:', 'admin123');

  } catch (err) {
    console.log('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
};

insertAdmin();