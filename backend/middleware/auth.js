const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const { testUser } = require('../mockData');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token de acesso não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'Token inválido' });
      }

      req.user = user;
    } else {
      // Use test user if MongoDB is not available and token is for test user
      if (decoded.id === testUser._id) {
        req.user = testUser;
      } else {
        return res.status(503).json({ message: 'Serviço temporariamente indisponível' });
      }
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = auth;