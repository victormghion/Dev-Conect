const express = require('express');
const {
  getUserProfile,
  updateProfile,
  toggleFollow,
  searchUsers,
  getSuggestedUsers
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/users/search
// @desc    Search users
// @access  Public
router.get('/search', searchUsers);

// @route   GET /api/users/suggested
// @desc    Get suggested users to follow
// @access  Private
router.get('/suggested', auth, getSuggestedUsers);

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Public
router.get('/:id', getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, upload.single('avatar'), updateProfile);

// @route   POST /api/users/:userId/follow
// @desc    Follow/Unfollow user
// @access  Private
router.post('/:userId/follow', auth, toggleFollow);

module.exports = router;