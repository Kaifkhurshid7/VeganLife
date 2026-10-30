import { verifyAccessToken } from '../config/tokens.js';
import { ACCESS_TOKEN_COOKIE } from '../config/cookies.js';
import { query, isUuid } from '../db/index.js';
import { USER_COLS, userJson } from '../db/mappers.js';

// Prefer the httpOnly access-token cookie (browser clients); fall back to the
// Authorization header for API consumers and tests.
function extractToken(req) {
  const fromCookie = req.cookies?.[ACCESS_TOKEN_COOKIE];
  if (fromCookie) return fromCookie;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) return authHeader.split(' ')[1];
  return null;
}

/**
 * One primary-key lookup. Password hash and refresh token are never selected here.
 * The block/mute lists ride along as two small indexed sub-selects so feed and
 * comment routes can filter without extra round trips.
 */
export async function loadUser(id) {
  if (!isUuid(id)) return null;
  const { rows } = await query(`select ${USER_COLS} from users u where u.id = $1`, [id]);
  return userJson(rows[0]);
}

export async function authenticate(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await loadUser(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // A database failure is a server problem, not a bad login: do not log users out
    return next(error);
  }
}

export function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

export async function optionalAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) return next();

  try {
    const decoded = verifyAccessToken(token);
    const user = await loadUser(decoded.id);
    if (user) req.user = user;
  } catch {
    // An invalid or expired token just means "anonymous" on public routes
  }
  next();
}
