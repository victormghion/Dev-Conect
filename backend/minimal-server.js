const express = require('express');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'DevConnect API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

const PORT = 12001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Minimal server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
});