import { Router } from 'express';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../config/tokens.js';
import { authenticate } from '../middleware/auth.js';
import { signupValidation, loginValidation } from '../middleware/validate.js';

const router = Router();

// Signup
router.post('/signup', signupValidation, async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(409).json({ message: 'Email already registered' });

    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) return res.status(409).json({ message: 'Username already taken' });

    const user = await User.create({ name, username: username.toLowerCase(), email, password });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ accessToken, user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin login with secret key
router.post('/admin-login', loginValidation, async (req, res) => {
  try {
    const { email, password, secretKey } = req.body;

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Invalid admin secret key' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token required' });

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
});

// Get current user
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});

// Update profile
router.patch('/profile', authenticate, async (req, res) => {
  try {
    const { name, username, bio, avatar } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (avatar) updates.avatar = avatar;

    if (username && username !== req.user.username) {
      const existing = await User.findOne({ username: username.toLowerCase() });
      if (existing) return res.status(409).json({ message: 'Username already taken' });
      updates.username = username.toLowerCase();
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change password
router.patch('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete account
router.delete('/account', authenticate, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.clearCookie('refreshToken');
    res.json({ message: 'Account deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
