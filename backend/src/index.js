import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { authLimiter, apiLimiter, sanitizeInput, xssClean } from './middleware/security.js';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS — allow frontend origin with credentials
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing with size limits
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

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

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/posts', postRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(globalErrorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, { env: process.env.NODE_ENV });
});
