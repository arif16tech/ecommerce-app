const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Create new order
const createOrder = async (req, res) => {
  try {
    const { paymentMethod, shippingAddress, stripePaymentIntentId = '', stripeSessionId = '' } = req.body;

    if (!paymentMethod || !['COD', 'Stripe'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Invalid payment method' });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.email || 
        !shippingAddress.phone || !shippingAddress.address || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Complete shipping address required' });
    }

    const user = await User.findById(req.user._id).populate('cart.productId');

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of user.cart) {
      const product = await Product.findById(cartItem.productId._id);

      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found` });
      }

      const sizeStock = product.sizes.find(s => s.size === cartItem.size);
      if (!sizeStock || sizeStock.stock < cartItem.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }

      sizeStock.stock -= cartItem.quantity;
      await product.save();

      orderItems.push({
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        size: cartItem.size,
        quantity: cartItem.quantity
      });

      totalAmount += product.price * cartItem.quantity;
    }

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'Stripe' ? 'Completed' : 'Pending',
      stripePaymentIntentId,
      stripeSessionId,
      orderStatus: 'Pending'
    });

    if (!user.address || !user.phone) {
      user.name = shippingAddress.name || user.name;
      user.phone = shippingAddress.phone;
      user.address = shippingAddress.address;
      user.pincode = shippingAddress.pincode;
    }

    user.cart = [];
    await user.save();

    res.status(201).json({ success: true, message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
};

// Get logged in user's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 }).populate('items.productId');
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order', error: error.message });
  }
};

// Admin can get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('items.productId');

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};

// Admin can update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    if (!orderStatus || !['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update status', error: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
