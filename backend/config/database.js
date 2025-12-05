const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    console.log('⚠️  Continuing without database - using mock data');
    // Don't exit the process, continue with mock data
  }
};

module.exports = connectDB;