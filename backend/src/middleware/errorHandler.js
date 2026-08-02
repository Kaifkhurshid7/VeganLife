import { logger } from '../utils/logger.js';
import { getSentry } from '../config/sentry.js';

export function globalErrorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
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

  // Multer upload errors (file size, unexpected field) → clean 400
  if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.code === 'LIMIT_FILE_SIZE'
      ? 'File too large — max size is 5MB'
      : 'Upload failed. Please try a different file.';
  }

  // Custom file-filter rejection (non-image files)
  if (err.statusCode === undefined && err.message?.startsWith('Only image files')) {
    statusCode = 400;
    message = err.message;
  }

  // Log server errors and report them to Sentry when configured
  if (statusCode >= 500) {
    logger.error(message, { stack: err.stack, url: req.originalUrl, method: req.method });
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
