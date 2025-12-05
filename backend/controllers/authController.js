const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { testUser } = require('../mockData');
const mongoose = require('mongoose');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Register user
const register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: 'Serviço temporariamente indisponível. Tente novamente mais tarde.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email 
          ? 'Email já está em uso' 
          : 'Username já está em uso'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      fullName
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({
      message: error.message || 'Erro ao criar usuário'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email e senha são obrigatórios'
      });
    }

    // Check for test user first
    if (email === 'teste@devconnect.com' && password === 'senha123') {
      const token = generateToken(testUser._id);
      
      return res.json({
        success: true,
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: testUser._id,
          username: testUser.username,
          email: testUser.email,
          fullName: testUser.fullName,
          avatar: testUser.avatar,
          bio: testUser.bio,
          skills: testUser.skills,
          githubUrl: testUser.githubUrl,
          linkedinUrl: testUser.linkedinUrl,
          portfolioUrl: testUser.portfolioUrl,
          isVerified: testUser.isVerified
        }
      });
    }

    // Find user and include password for comparison
    try {
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(401).json({
          message: 'Credenciais inválidas'
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Credenciais inválidas'
        });
      }
    } catch (dbError) {
      // If database is not available and not test user
      return res.status(401).json({
        message: 'Credenciais inválidas'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('followers', 'username fullName avatar')
      .populate('following', 'username fullName avatar');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
};

// Google OAuth callback
const googleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }

    // Generate JWT token
    const token = generateToken(req.user._id);

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
};

module.exports = {
  register,
  login,
  getMe,
  googleCallback
};