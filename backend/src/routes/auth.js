import { Router } from 'express';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../config/tokens.js';
import { authenticate } from '../middleware/auth.js';
import { signupValidation, loginValidation } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Signup
router.post('/signup', signupValidation, asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  const existingEmail = await User.findOne({ email }).lean();
  if (existingEmail) throw ApiError.conflict('Email already registered');

  const existingUsername = await User.findOne({ username: username.toLowerCase() }).lean();
  if (existingUsername) throw ApiError.conflict('Username already taken');

  const user = await User.create({ name, username: username.toLowerCase(), email, password });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
  res.status(201).json({ success: true, accessToken, user: user.toPublicJSON() });
}));

// Login
router.post('/login', loginValidation, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
  res.json({ success: true, accessToken, user: user.toPublicJSON() });
}));

// Admin login
router.post('/admin-login', loginValidation, asyncHandler(async (req, res) => {
  const { email, password, secretKey } = req.body;

  if (secretKey !== process.env.ADMIN_SECRET_KEY) {
    throw ApiError.forbidden('Invalid admin secret key');
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  if (user.role !== 'admin') {
    user.role = 'admin';
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
  res.json({ success: true, accessToken, user: user.toPublicJSON() });
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) throw ApiError.unauthorized('Refresh token required');

  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== token) {
    throw ApiError.forbidden('Invalid refresh token — login again');
  }

  const accessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshToken = newRefreshToken;
  await user.save();

  res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
  res.json({ success: true, accessToken });
}));

// Get current user
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toPublicJSON() });
}));

// Update profile
router.patch('/profile', authenticate, asyncHandler(async (req, res) => {
  const { name, username, bio, avatar } = req.body;
  const updates = {};

  if (name) updates.name = name;
  if (bio !== undefined) updates.bio = bio;
  if (avatar) updates.avatar = avatar;

  if (username && username !== req.user.username) {
    const existing = await User.findOne({ username: username.toLowerCase() }).lean();
    if (existing) throw ApiError.conflict('Username already taken');
    updates.username = username.toLowerCase();
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, user: user.toPublicJSON() });
}));

// Change password
router.patch('/change-password', authenticate, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) throw ApiError.badRequest('Both passwords required');
  if (newPassword.length < 6) throw ApiError.badRequest('New password must be at least 6 characters');

  const user = await User.findById(req.user._id);
  if (!(await user.comparePassword(currentPassword))) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated' });
}));

// Logout
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  res.clearCookie('refreshToken', COOKIE_OPTIONS);
  res.json({ success: true, message: 'Logged out' });
}));

// Delete account
router.delete('/account', authenticate, asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.clearCookie('refreshToken', COOKIE_OPTIONS);
  res.json({ success: true, message: 'Account deleted' });
}));

export default router;
