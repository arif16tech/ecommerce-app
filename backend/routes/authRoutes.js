const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  getProfile,
  checkAuth,
  updateProfile
} = require('../controllers/authController');

// Middleware for protected routes
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/check', checkAuth);

// Protected routes
router.post('/logout', authMiddleware, logout);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;