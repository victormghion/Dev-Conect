const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Basic CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({
    success: true,
    message: 'DevConnect API is running!',
    timestamp: new Date().toISOString()
  });
});

// Mock posts endpoint
app.get('/api/posts', (req, res) => {
  console.log('Posts requested');
  const mockPosts = [
    {
      _id: '1',
      title: 'Meu primeiro projeto React',
      content: 'Acabei de criar minha primeira aplicação React!',
      author: {
        _id: 'test-user',
        name: 'Usuário Teste',
        username: 'teste'
      },
      createdAt: new Date().toISOString(),
      likes: [],
      comments: []
    }
  ];
  
  res.json({
    success: true,
    posts: mockPosts
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 12000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Debug server running on port ${PORT}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});

module.exports = app;