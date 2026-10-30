import { logger } from '../utils/logger.js';
import { getSentry } from '../config/sentry.js';
import { LIMITS } from '../utils/uploadService.js';

// Postgres error codes -> a clean HTTP answer. Routes check the common cases
// themselves for friendlier messages; this is the safety net for races and bad input.
const PG_UNIQUE = '23505';
const PG_FOREIGN_KEY = '23503';
const PG_CHECK = '23514';
const PG_NOT_NULL = '23502';
const PG_BAD_TEXT_REPRESENTATION = '22P02'; // e.g. not a valid uuid
const PG_STRING_TOO_LONG = '22001';

const UNIQUE_MESSAGES = {
  users_email_key: 'Email already registered',
  users_username_key: 'Username already taken',
  rooms_slug_key: 'A room with that name already exists',
  reports_unique_idx: 'You already reported this',
};

export function globalErrorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];

  switch (err.code) {
    case PG_UNIQUE:
      statusCode = 409;
      message = UNIQUE_MESSAGES[err.constraint] || 'That already exists';
      break;
    case PG_FOREIGN_KEY:
      statusCode = 400;
      message = 'A related item no longer exists';
      break;
    case PG_CHECK:
    case PG_NOT_NULL:
    case PG_STRING_TOO_LONG:
      statusCode = 400;
      message = 'Some of the submitted values are not valid';
      break;
    case PG_BAD_TEXT_REPRESENTATION:
      statusCode = 400;
      message = 'Invalid id';
      break;
    default:
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Multer upload errors (file size, unexpected field) -> clean 400 with the real limit
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      const limit = err.field === 'avatar' ? LIMITS.avatar.maxBytes : LIMITS.post.maxBytes;
      message = `File too large. The maximum is ${limit / (1024 * 1024)} MB.`;
    } else {
      message = 'Upload failed. Please try a different file.';
    }
  }

  // Custom file-filter rejection (non-image files)
  if (err.statusCode === undefined && err.message?.startsWith('Only image files')) {
    statusCode = 400;
    message = err.message;
  }

  // Never leak database internals to the client
  if (statusCode >= 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal server error';
  }

  // Log server errors and report them to Sentry when configured
  if (statusCode >= 500) {
    logger.error(err.message, { stack: err.stack, url: req.originalUrl, method: req.method, code: err.code });
    getSentry()?.captureException(err, { extra: { url: req.originalUrl, method: req.method } });
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length ? errors : undefined,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

// 404 handler
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}
