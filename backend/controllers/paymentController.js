const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const User = require('../models/User');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');


// Calculate cart total
const calculateTotal = (cart) => {
  return cart.reduce((sum, item) => {
    return sum + item.productId.price * item.quantity;
  }, 0);
};


// Create stripe checkout session
const createCheckoutSession = async (req, res) => {
  try {

    const { shippingAddress } = req.body;

    if (!shippingAddress?.name || !shippingAddress?.email || !shippingAddress?.phone ||
        !shippingAddress?.address || !shippingAddress?.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address required'
      });
    }

    const userCart = await Cart.findOne({ user: req.user._id }).populate('items.productId');

    if (!userCart || !userCart.items || !userCart.items.length) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Prepare stripe line items
    const lineItems = userCart.items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: `${item.productId.name} (Size: ${item.size})`,
          images: [item.productId.image]
        },
        unit_amount: Math.round(item.productId.price * 100)
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,

      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout`,

      customer_email: shippingAddress.email,

      metadata: {
        userId: req.user._id.toString(),
        shippingName: shippingAddress.name,
        shippingEmail: shippingAddress.email,
        shippingPhone: shippingAddress.phone,
        shippingAddress: shippingAddress.address,
        shippingPincode: shippingAddress.pincode
      }
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });

  } catch {
    res.status(500).json({
      success: false,
      message: 'Checkout session creation failed'
    });
  }
};



// Verify stripe payment and create order
const verifySession = async (req, res) => {
  try {

    const { sessionId } = req.body;

    if (!sessionId)
      return res.status(400).json({ success: false, message: 'Session ID required' });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid')
      return res.status(400).json({ success: false, message: 'Payment not completed' });

    // Prevent duplicate orders
    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });

    if (existingOrder)
      return res.json({ success: true, order: existingOrder });

    const {
      userId,
      shippingName,
      shippingEmail,
      shippingPhone,
      shippingAddress,
      shippingPincode
    } = session.metadata;

    const userCart = await Cart.findOne({ user: userId }).populate('items.productId');

    if (!userCart || !userCart.items || !userCart.items.length)
      return res.status(400).json({ success: false, message: 'Cart empty' });

    const orderItems = [];
    let totalAmount = 0;

    // Validate stock and prepare order items
    for (const item of userCart.items) {

      const product = await Product.findById(item.productId._id);

      const sizeStock = product.sizes.find(s => s.size === item.size);

      if (!sizeStock || sizeStock.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      sizeStock.stock -= item.quantity;
      await product.save();

      orderItems.push({
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        size: item.size,
        quantity: item.quantity
      });

      totalAmount += product.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      userId: user._id,
      items: orderItems,
      totalAmount,

      shippingAddress: {
        name: shippingName,
        email: shippingEmail,
        phone: shippingPhone,
        address: shippingAddress,
        pincode: shippingPincode
      },

      paymentMethod: 'Stripe',
      paymentStatus: 'Completed',

      stripePaymentIntentId: session.payment_intent,
      stripeSessionId: sessionId,

      orderStatus: 'Pending'
    });

    // Save shipping to user profile
    const user = await User.findById(userId);
    if (!user.address || !user.phone) {
      user.name = shippingName || user.name;
      user.phone = shippingPhone;
      user.address = shippingAddress;
      user.pincode = shippingPincode;
      await user.save();
    }

    // Clear cart
    userCart.items = [];
    await userCart.save();

    res.status(201).json({
      success: true,
      message: 'Payment verified',
      order
    });

  } catch {
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
};


module.exports = {
  createCheckoutSession,
  verifySession
};