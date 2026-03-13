const express = require('express');
const router = express.Router();
const {
  createCheckoutSession,
  verifySession,
  stripeWebhook
} = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/auth');

// Stripe checkout routes (require authentication)
router.post('/create-checkout-session', authMiddleware, createCheckoutSession);
router.post('/verify-session', authMiddleware, verifySession);

module.exports = router;
