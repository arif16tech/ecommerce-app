const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Calculate cart total
const calculateTotal = (items) => {
  return items.reduce((sum, item) => {
    return sum + item.productId.price * item.quantity;
  }, 0);
};

// Get or Create Cart
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// Get user cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.productId');
    
    if (!cart) {
      return res.json({ success: true, cart: [], total: 0 });
    }

    const validItems = cart.items.filter(item => item.productId);
    const total = calculateTotal(validItems);

    res.json({ success: true, cart: validItems, total });
  } catch (error) {
    console.error(error);
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

    const cart = await getOrCreateCart(req.user._id);

    const index = cart.items.findIndex(
      item => item.productId.toString() === productId && item.size === size
    );

    if (index > -1) {
      const newQty = cart.items[index].quantity + quantity;

      if (sizeStock.stock < newQty)
        return res.status(400).json({ success: false, message: 'Stock limit reached' });

      cart.items[index].quantity = newQty;
    } else {
      cart.items.push({ productId, size, quantity });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.productId');
    const total = calculateTotal(updatedCart.items);

    res.json({
      success: true,
      message: 'Item added',
      cart: updatedCart.items,
      total
    });

  } catch (error) {
    console.error(error);
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

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart)
      return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.find(
      i => i.productId.toString() === productId && i.size === size
    );

    if (!item)
      return res.status(404).json({ success: false, message: 'Item not in cart' });

    item.quantity = quantity;

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.productId');
    const total = calculateTotal(updatedCart.items);

    res.json({
      success: true,
      message: 'Cart updated',
      cart: updatedCart.items,
      total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId, size } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart)
      return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(
      item => !(item.productId.toString() === productId && item.size === size)
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.productId');
    const total = calculateTotal(updatedCart.items);

    res.json({
      success: true,
      message: 'Item removed',
      cart: updatedCart.items,
      total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Remove failed' });
  }
};

// Clear full cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Cart cleared',
      cart: [],
      total: 0
    });

  } catch (error) {
    console.error(error);
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