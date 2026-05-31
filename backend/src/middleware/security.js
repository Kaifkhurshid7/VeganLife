import rateLimit from 'express-rate-limit';

// Strict rate limit for auth routes (login, signup, password reset)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { success: false, message: 'Too many authentication attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limit
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limit for post creation / comments
export const postLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Posting too fast. Wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Sanitize user input to prevent NoSQL injection
export function sanitizeInput(req, res, next) {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        // Block nested objects with $ keys
        for (const nestedKey of Object.keys(obj[key])) {
          if (nestedKey.startsWith('$')) {
            delete obj[key][nestedKey];
          }
        }
      }
    }
    return obj;
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  next();
}

// XSS prevention — strip HTML tags from string inputs
export function xssClean(req, res, next) {
  const stripTags = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '');
  };

  const cleanObj = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'string') {
        obj[key] = stripTags(obj[key]);
      } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        cleanObj(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) req.body = cleanObj(req.body);
  next();
}
