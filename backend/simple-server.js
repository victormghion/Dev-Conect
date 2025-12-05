const express = require('express');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({
    success: true,
    message: 'DevConnect API is running!',
    timestamp: new Date().toISOString()
  });
});

// Test posts endpoint
app.get('/api/posts', (req, res) => {
  console.log('Posts requested');
  res.json({
    success: true,
    posts: [
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
    ]
  });
});

const PORT = process.env.PORT || 12001;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
});

module.exports = server;