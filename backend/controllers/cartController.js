const User = require('../models/User');
const Product = require('../models/Product');

// Calculate cart total
const calculateTotal = (cart) => {
  return cart.reduce((sum, item) => {
    return sum + item.productId.price * item.quantity;
  }, 0);
};

// Get user cart
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.productId');

    const cart = user.cart.filter(item => item.productId);
    const total = calculateTotal(cart);

    res.json({ success: true, cart, total });

  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch cart' });
  }
};

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { productId, size, quantity = 1 } = req.body;

    if (!productId || !size)
      return res.status(400).json({ success: false, message: 'productId & size required' });

    const product = await Product.findById(productId);

    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });

    const sizeStock = product.sizes.find(s => s.size === size);

    if (!sizeStock || sizeStock.stock < quantity)
      return res.status(400).json({ success: false, message: 'Insufficient stock' });

    const user = await User.findById(req.user._id);

    const index = user.cart.findIndex(
      item => item.productId.toString() === productId && item.size === size
    );

    if (index > -1) {
      const newQty = user.cart[index].quantity + quantity;

      if (sizeStock.stock < newQty)
        return res.status(400).json({ success: false, message: 'Stock limit reached' });

      user.cart[index].quantity = newQty;

    } else {
      user.cart.push({ productId, size, quantity });
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('cart.productId');
    const total = calculateTotal(updatedUser.cart);

    res.json({
      success: true,
      message: 'Item added',
      cart: updatedUser.cart,
      total
    });

  } catch {
    res.status(500).json({ success: false, message: 'Add to cart failed' });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;

    const product = await Product.findById(productId);

    const sizeStock = product.sizes.find(s => s.size === size);

    if (!sizeStock || sizeStock.stock < quantity)
      return res.status(400).json({ success: false, message: 'Insufficient stock' });

    const user = await User.findById(req.user._id);

    const item = user.cart.find(
      i => i.productId.toString() === productId && i.size === size
    );

    if (!item)
      return res.status(404).json({ success: false, message: 'Item not in cart' });

    item.quantity = quantity;

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('cart.productId');
    const total = calculateTotal(updatedUser.cart);

    res.json({
      success: true,
      message: 'Cart updated',
      cart: updatedUser.cart,
      total
    });

  } catch {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId, size } = req.params;

    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      item => !(item.productId.toString() === productId && item.size === size)
    );

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('cart.productId');
    const total = calculateTotal(updatedUser.cart);

    res.json({
      success: true,
      message: 'Item removed',
      cart: updatedUser.cart,
      total
    });

  } catch {
    res.status(500).json({ success: false, message: 'Remove failed' });
  }
};

// Clear full cart
const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      cart: [],
      total: 0
    });

  } catch {
    res.status(500).json({ success: false, message: 'Clear cart failed' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};