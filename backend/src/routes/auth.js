import { Router } from 'express';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../config/tokens.js';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, accessCookieOptions, refreshCookieOptions } from '../config/cookies.js';
import { authenticate } from '../middleware/auth.js';
import { signupValidation, loginValidation, profileUpdateValidation, changePasswordValidation } from '../middleware/validate.js';
import { upload } from '../config/multer.js';
import { uploadImage } from '../utils/uploadService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

// Set both tokens as httpOnly cookies; the access token is also returned in the
// body for non-browser clients (tests, API consumers).
function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, accessCookieOptions);
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshCookieOptions);
}

function clearAuthCookies(res) {
  res.clearCookie(ACCESS_TOKEN_COOKIE, accessCookieOptions);
  res.clearCookie(REFRESH_TOKEN_COOKIE, refreshCookieOptions);
}

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

  setAuthCookies(res, accessToken, refreshToken);
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

  setAuthCookies(res, accessToken, refreshToken);
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

  setAuthCookies(res, accessToken, refreshToken);
  res.json({ success: true, accessToken, user: user.toPublicJSON() });
}));

// Refresh token (rotation: each refresh issues a new refresh token)
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

  setAuthCookies(res, accessToken, newRefreshToken);
  res.json({ success: true, accessToken });
}));

// Get current user
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toPublicJSON() });
}));

// Update profile (name, username, bio, avatar — all optional, validated)
router.patch('/profile', authenticate, profileUpdateValidation, asyncHandler(async (req, res) => {
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

// Upload avatar — image file → Cloudinary (or local uploads/ in dev), persisted
router.post('/avatar', authenticate, upload.single('avatar'), asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No image file uploaded');

  const avatar = await uploadImage(req.file);
  const user = await User.findById(req.user._id);
  user.avatar = avatar;
  await user.save();

  res.json({ success: true, avatar, user: user.toPublicJSON() });
}));

// Change password
router.patch('/change-password', authenticate, changePasswordValidation, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (newPassword === currentPassword) {
    throw ApiError.badRequest('New password must be different from the current password');
  }

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
  clearAuthCookies(res);
  res.json({ success: true, message: 'Logged out' });
}));

// Delete account
router.delete('/account', authenticate, asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  clearAuthCookies(res);
  res.json({ success: true, message: 'Account deleted' });
}));

export default router;
