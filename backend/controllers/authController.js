const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const createAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Short-lived Access Token
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET, // Fallback for now
    { expiresIn: '30d' } // Long-lived Refresh Token
  );
};

const sendAuthCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  };

  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
};

const storeRefreshToken = async (user, refreshTokenStr) => {
  const hashedToken = crypto.createHash('sha256').update(refreshTokenStr).digest('hex');
  user.refreshTokens.push({
    token: hashedToken,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  });
  await user.save();
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
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
    if (existingUser) {
      if (!existingUser.isVerified) {
        return res.status(400).json({ success: false, message: 'User exists but not verified. Please verify your email.' });
      }
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const otp = generateOTP();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    const user = await User.create({ 
      name, 
      email, 
      password,
      isVerified: false,
      otp: otpHash,
      otpExpires
    });

    try {
      await sendEmail({
        email: user.email,
        subject: 'StyleStore - Verify your email',
        message: `Your verification OTP is: ${otp}. It is valid for 10 minutes.`,
        html: `<h2>Welcome to StyleStore!</h2><p>Your verification OTP is: <strong>${otp}</strong></p><p>It is valid for 10 minutes.</p>`
      });
    } catch (err) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      return res.status(500).json({ success: false, message: 'Could not send email' });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for the OTP.'
    });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

// Verify Email OTP
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ success: false, message: 'Email and OTP required' });

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    const user = await User.findOne({ 
      email,
      otp: otpHash,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    await storeRefreshToken(user, refreshToken);

    sendAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    console.error('Verify Email Error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ success: false, message: 'User already verified' });

    const otp = generateOTP();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    
    user.otp = otpHash;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'StyleStore - Verify your email',
      message: `Your new verification OTP is: ${otp}. It is valid for 10 minutes.`,
      html: `<h2>Welcome to StyleStore!</h2><p>Your new verification OTP is: <strong>${otp}</strong></p><p>It is valid for 10 minutes.</p>`
    });

    res.status(200).json({ success: true, message: 'OTP resent successfully' });
  } catch (error) {
    console.error('Resend OTP Error:', error);
    res.status(500).json({ success: false, message: 'Failed to resend OTP' });
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

    // Ensure email is verified before login
    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Email not verified. Please verify your email first.', requiresVerification: true });
    }

    if (!user.password) {
       return res.status(401).json({ success: false, message: 'Please login using your Google account.' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    await storeRefreshToken(user, refreshToken);

    sendAuthCookies(res, accessToken, refreshToken);

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
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// Google OAuth Callback Handler
const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user;
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    await storeRefreshToken(user, refreshToken);
    
    sendAuthCookies(res, accessToken, refreshToken);
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=auth_failed`);
  }
};

// logout user
const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (refreshToken) {
    try {
      const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await User.updateOne(
        { refreshTokens: { $elemMatch: { token: hashedToken } } },
        { $pull: { refreshTokens: { token: hashedToken } } }
      );
    } catch (err) {
      console.error('Logout Token Revocation Error:', err);
    }
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    maxAge: 0,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  };

  res.cookie('accessToken', '', cookieOptions);
  res.cookie('refreshToken', '', cookieOptions);

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
    const accessToken = req.cookies.accessToken;

    if (!accessToken)
      return res.status(401).json({ success: false, message: 'Access token missing' });

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');

    if (!user)
      return res.json({ success: true, authenticated: false });

    res.json({
      success: true,
      authenticated: true,
      user
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired', expired: true });
    }
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Refresh Token
const refreshTokenHandler = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) return res.status(401).json({ success: false, message: 'No refresh token provided' });

    // Find user with this token
    const hashedToken = crypto.createHash('sha256').update(oldRefreshToken).digest('hex');
    const user = await User.findOne({ 'refreshTokens.token': hashedToken });

    if (!user) {
      // Possible token reuse attack
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    // Verify token signature
    const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
    try {
      jwt.verify(oldRefreshToken, secret);
    } catch (err) {
      // Token expired or invalid signature, remove it
      user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== hashedToken);
      await user.save();
      return res.status(401).json({ success: false, message: 'Refresh token expired' });
    }

    // Remove old token (Rotation)
    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== hashedToken);

    // Generate new tokens
    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);
    
    // Store new refresh token
    const newHashedToken = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    user.refreshTokens.push({
      token: newHashedToken,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
    });

    await user.save();
    sendAuthCookies(res, newAccessToken, newRefreshToken);

    res.json({ success: true, message: 'Tokens refreshed successfully' });
  } catch (error) {
    console.error('Refresh Token Error:', error);
    res.status(500).json({ success: false, message: 'Failed to refresh token' });
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

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: 'No user found with this email' });

    // Ignore Google-only accounts
    if (user.googleId && !user.password) {
      return res.status(400).json({ success: false, message: 'This account uses Google Login. Reset password is not applicable.' });
    }

    const otp = generateOTP();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    
    user.resetPasswordOtp = otpHash;
    user.resetPasswordOtpExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'StyleStore - Password Reset',
      message: `Your password reset OTP is: ${otp}. It is valid for 15 minutes.`,
      html: `<h2>Password Reset Request</h2><p>Your password reset OTP is: <strong>${otp}</strong></p><p>It is valid for 15 minutes.</p>`
    });

    res.status(200).json({ success: true, message: 'Password reset OTP sent to email' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send reset email' });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be 6+ chars' });
    }

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    const user = await User.findOne({
      email,
      resetPasswordOtp: otpHash,
      resetPasswordOtpExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully. You can now login.' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
};

module.exports = {
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
  googleAuthCallback,
  refreshTokenHandler
};