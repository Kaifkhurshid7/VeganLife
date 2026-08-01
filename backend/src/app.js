import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { authLimiter, apiLimiter, sanitizeInput, xssClean } from './middleware/security.js';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import collectionsRoutes from './routes/collections.js';
import roomsRoutes from './routes/rooms.js';

// Build the Express app without binding a port, so tests can mount it directly.
export function createApp() {
  const app = express();

  // Security headers
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  // CORS — allow frontend origin with credentials
  const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim());

  app.use(cors({
    origin(origin, callback) {
      // No origin = same-origin/non-browser request (curl, tests)
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Body parsing with size limits
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));
  app.use(cookieParser());

  // Serve static files (locally uploaded images)
  app.use('/uploads', express.static('uploads'));

  // Input sanitization (NoSQL injection + XSS)
  app.use(sanitizeInput);
  app.use(xssClean);

  // General API rate limit
  app.use('/api', apiLimiter);

  // Request logging (production-friendly)
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`, { ip: req.ip });
    next();
  });

  // Routes
  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/collections', collectionsRoutes);
  app.use('/api/rooms', roomsRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ success: true, status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
  });

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(globalErrorHandler);

  return app;
}
