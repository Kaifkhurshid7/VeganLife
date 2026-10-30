import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query, one } from '../db/index.js';
import { USER_COLS, userJson } from '../db/mappers.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../config/tokens.js';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, accessCookieOptions, refreshCookieOptions } from '../config/cookies.js';
import { authenticate, loadUser } from '../middleware/auth.js';
import { avatarLimiter } from '../middleware/security.js';
import { signupValidation, loginValidation, profileUpdateValidation, changePasswordValidation } from '../middleware/validate.js';
import { avatarUpload } from '../config/multer.js';
import { saveUpload, deleteStoredImage } from '../utils/uploadService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

const BCRYPT_ROUNDS = 12;

// Emails listed in ADMIN_EMAILS (comma separated, set on the server) are made
// admins the moment they sign up or log in. That is how the first admin is
// created; after that, admins can promote others from the admin panel. It only
// ever promotes: removing an email from the list does not demote anyone.
function adminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

const isBootstrapAdmin = (email) => adminEmails().includes(String(email).toLowerCase());

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
  const uname = username.toLowerCase();

  // One indexed look-up tells us which of the two was taken, for a precise message
  const taken = await one(
    'select (lower(email) = lower($1)) as email_taken, (username = $2) as username_taken from users where lower(email) = lower($1) or username = $2 limit 1',
    [email, uname],
  );
  if (taken?.email_taken) throw ApiError.conflict('Email already registered');
  if (taken?.username_taken) throw ApiError.conflict('Username already taken');

  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const role = isBootstrapAdmin(email) ? 'admin' : 'user';

  // A unique-index race (two signups at once) surfaces as 23505 -> 409 in the error handler
  const created = await one(
    'insert into users (name, username, email, password_hash, role, last_login) values ($1, $2, $3, $4, $5, public.now_ms()) returning id',
    [name, uname, email, hash, role],
  );

  const accessToken = generateAccessToken(created.id);
  const refreshToken = generateRefreshToken(created.id);
  await query('update users set refresh_token = $2 where id = $1', [created.id, refreshToken]);

  setAuthCookies(res, accessToken, refreshToken);
  res.status(201).json({ success: true, accessToken, user: await loadUser(created.id) });
}));

// Login
router.post('/login', loginValidation, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const row = await one('select id, email, password_hash, role from users where lower(email) = lower($1)', [email]);
  // Compare against a throwaway hash when the email is unknown, so response time
  // does not reveal whether an account exists
  const ok = await bcrypt.compare(password, row?.password_hash || '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv');
  if (!row || !ok) throw ApiError.unauthorized('Invalid email or password');

  const accessToken = generateAccessToken(row.id);
  const refreshToken = generateRefreshToken(row.id);
  const role = row.role !== 'admin' && isBootstrapAdmin(row.email) ? 'admin' : row.role;

  await query(
    'update users set refresh_token = $2, last_login = public.now_ms(), role = $3 where id = $1',
    [row.id, refreshToken, role],
  );

  setAuthCookies(res, accessToken, refreshToken);
  res.json({ success: true, accessToken, user: await loadUser(row.id) });
}));

// Refresh token (rotation: each refresh issues a new refresh token)
router.post('/refresh', asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) throw ApiError.unauthorized('Refresh token required');

  const decoded = verifyRefreshToken(token);
  const row = await one('select id, refresh_token from users where id = $1', [decoded.id]);

  if (!row || row.refresh_token !== token) {
    throw ApiError.forbidden('Invalid refresh token — login again');
  }

  const accessToken = generateAccessToken(row.id);
  const newRefreshToken = generateRefreshToken(row.id);

  await query('update users set refresh_token = $2 where id = $1', [row.id, newRefreshToken]);

  setAuthCookies(res, accessToken, newRefreshToken);
  res.json({ success: true, accessToken });
}));

// Get current user
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
}));

// Update profile (name, username, bio, avatar — all optional, validated)
router.patch('/profile', authenticate, profileUpdateValidation, asyncHandler(async (req, res) => {
  const { name, username, bio, avatar } = req.body;
  const sets = [];
  const params = [req.user.id];
  const add = (column, value) => {
    params.push(value);
    sets.push(`${column} = $${params.length}`);
  };

  if (name) add('name', name);
  if (bio !== undefined) add('bio', bio);
  if (avatar) add('avatar', avatar);

  if (username && username.toLowerCase() !== req.user.username) {
    const uname = username.toLowerCase();
    const existing = await one('select 1 as x from users where username = $1', [uname]);
    if (existing) throw ApiError.conflict('Username already taken');
    add('username', uname);
  }

  if (sets.length) await query(`update users set ${sets.join(', ')} where id = $1`, params);
  res.json({ success: true, user: await loadUser(req.user.id) });
}));

// Upload a profile photo.
// Limits: 2 MB, JPEG/PNG/WebP, 64x64 minimum, 10 uploads per hour. The file is
// verified from its real header, decoded, cropped to a 512x512 square, stripped of
// metadata (GPS, camera) and stored as WebP; the previous photo is deleted.
router.post('/avatar', authenticate, avatarLimiter, avatarUpload.single('avatar'), asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No image file uploaded');

  const previous = await one('select avatar from users where id = $1', [req.user.id]);
  const avatar = await saveUpload(req.file, 'avatar', req.user.id);
  await query('update users set avatar = $2 where id = $1', [req.user.id, avatar]);

  if (previous?.avatar && previous.avatar !== avatar) deleteStoredImage(previous.avatar);
  res.json({ success: true, avatar, user: await loadUser(req.user.id) });
}));

// Remove the profile photo
router.delete('/avatar', authenticate, asyncHandler(async (req, res) => {
  const previous = await one('select avatar from users where id = $1', [req.user.id]);
  await query("update users set avatar = '' where id = $1", [req.user.id]);
  if (previous?.avatar) deleteStoredImage(previous.avatar);
  res.json({ success: true, user: await loadUser(req.user.id) });
}));

// Change password
router.patch('/change-password', authenticate, changePasswordValidation, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (newPassword === currentPassword) {
    throw ApiError.badRequest('New password must be different from the current password');
  }

  const row = await one('select password_hash from users where id = $1', [req.user.id]);
  if (!(await bcrypt.compare(currentPassword, row.password_hash))) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  const hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await query('update users set password_hash = $2 where id = $1', [req.user.id, hash]);
  res.json({ success: true, message: 'Password updated' });
}));

// Logout
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  await query('update users set refresh_token = null where id = $1', [req.user.id]);
  clearAuthCookies(res);
  res.json({ success: true, message: 'Logged out' });
}));

// Delete account. Foreign keys cascade: the user's posts, comments, votes, follows,
// messages and so on are removed by the database, and the counters on other
// people's posts are corrected by triggers.
router.delete('/account', authenticate, asyncHandler(async (req, res) => {
  const previous = await one('select avatar from users where id = $1', [req.user.id]);
  await query('delete from users where id = $1', [req.user.id]);
  if (previous?.avatar) deleteStoredImage(previous.avatar);
  clearAuthCookies(res);
  res.json({ success: true, message: 'Account deleted' });
}));

export default router;
