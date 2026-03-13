const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const sendCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
};

// crrate user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be 6+ chars' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: 'User already exists' });

    const user = await User.create({ name, email, password });

    const token = createToken(user);
    sendCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'User registered',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

// login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email & password required' });

    const user = await User.findOne({ email }).select('+password');

    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = createToken(user);
    sendCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// logout user
const logout = async (req, res) => {
  res.cookie('token', '', { httpOnly: true, maxAge: 0 });

  res.json({
    success: true,
    message: 'Logged out'
  });
};

// get user profile
const getProfile = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

// check auth status
const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token)
      return res.json({ success: true, authenticated: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');

    if (!user)
      return res.json({ success: true, authenticated: false });

    res.json({
      success: true,
      authenticated: true,
      user
    });

  } catch {
    res.json({ success: true, authenticated: false });
  }
};

// update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, pincode } = req.body;

    const user = await User.findById(req.user._id);

    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (pincode) user.pincode = pincode;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated',
      user
    });

  } catch {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  checkAuth,
  updateProfile
};