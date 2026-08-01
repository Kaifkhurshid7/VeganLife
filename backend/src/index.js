import 'dotenv/config'; // load .env before any module reads process.env at import time
import http from 'http';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { initSentry } from './config/sentry.js';
import { initRedis } from './config/redis.js';
import { initRealtime } from './realtime/index.js';
import { seedDefaultRooms } from './utils/seedRooms.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 5000;

initSentry();

// Connect to MongoDB, then ensure the default chat rooms exist
connectDB().then(seedDefaultRooms);

const server = http.createServer(createApp());
const redisPubSub = await initRedis();
initRealtime(server, redisPubSub);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, { env: process.env.NODE_ENV });
});
