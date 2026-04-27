const express = require('express');
const router = express.Router();
const passport = require('passport');
const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 OTP requests per window
  message: { success: false, message: 'Too many OTP requests, please try again later.' }
});

const {
  register,
  login,
  logout,
  getProfile,
  checkAuth,
  updateProfile,
  verifyEmail,
  resendOTP,
  forgotPassword,
  resetPassword,
  googleAuthCallback
} = require('../controllers/authController');

// Middleware for protected routes
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', otpLimiter, resendOTP);
router.post('/login', login);
router.get('/check', checkAuth);

router.post('/forgot-password', otpLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), googleAuthCallback);

// Protected routes
router.post('/logout', authMiddleware, logout);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;