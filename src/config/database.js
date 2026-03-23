const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (e) {
    console.error('MongoDB connection error:', e);
    process.exit(1);
  }
};

module.exports = connectDB;
