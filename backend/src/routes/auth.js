const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, sensitiveOperation } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', validateRegister, asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
    });
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password
  });

  // Generate token
  const token = generateToken(user._id);

  // Update login history
  user.loginHistory.unshift({
    timestamp: new Date(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  await user.save();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        preferences: user.preferences
      },
      token
    }
  });
}));

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated. Please contact support.'
    });
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Generate token
  const token = generateToken(user._id);

  // Update login history
  user.loginHistory.unshift({
    timestamp: new Date(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Keep only last 10 login records
  if (user.loginHistory.length > 10) {
    user.loginHistory = user.loginHistory.slice(0, 10);
  }

  await user.save();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        preferences: user.preferences
      },
      token
    }
  });
}));

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', auth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('favorites.movies', 'title poster type year rating')
    .populate('favorites.music', 'title artist cover type year rating')
    .populate('favorites.games', 'title cover developer year rating')
    .populate('favorites.books', 'title author cover type year rating');

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        preferences: user.preferences,
        favorites: user.favorites,
        watchHistory: user.watchHistory.slice(0, 20), // Last 20 items
        loginHistory: user.loginHistory.slice(0, 5), // Last 5 logins
        createdAt: user.createdAt
      }
    }
  });
}));

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', auth, asyncHandler(async (req, res) => {
  const { username, avatar, preferences } = req.body;
  
  const user = await User.findById(req.user._id);

  // Check if username is taken by another user
  if (username && username !== user.username) {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken'
      });
    }
    user.username = username;
  }

  if (avatar) user.avatar = avatar;
  if (preferences) {
    user.preferences = { ...user.preferences, ...preferences };
  }

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        preferences: user.preferences
      }
    }
  });
}));

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
router.put('/password', auth, sensitiveOperation, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long'
    });
  }

  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
}));

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', auth, asyncHandler(async (req, res) => {
  // In a more sophisticated setup, you might maintain a blacklist of tokens
  // For now, we'll just send a success response
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
router.post('/refresh', auth, asyncHandler(async (req, res) => {
  // Generate new token
  const token = generateToken(req.user._id);

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: { token }
  });
}));

// @desc    Delete account
// @route   DELETE /api/auth/account
// @access  Private
router.delete('/account', auth, sensitiveOperation, asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Password is required to delete account'
    });
  }

  const user = await User.findById(req.user._id).select('+password');

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Password is incorrect'
    });
  }

  // Soft delete - deactivate account instead of removing
  user.isActive = false;
  user.email = `deleted_${Date.now()}_${user.email}`;
  user.username = `deleted_${Date.now()}_${user.username}`;
  await user.save();

  res.json({
    success: true,
    message: 'Account deleted successfully'
  });
}));

module.exports = router;