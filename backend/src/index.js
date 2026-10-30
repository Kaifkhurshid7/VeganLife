import 'dotenv/config'; // load .env before any module reads process.env at import time
import http from 'http';
import { createApp } from './app.js';
import { initDb } from './db/index.js';
import { initSentry } from './config/sentry.js';
import { initRedis } from './config/redis.js';
import { initRealtime } from './realtime/index.js';
import { seedDefaultRooms } from './utils/seedRooms.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 5000;

initSentry();

// Connect to Postgres first. If the connection string or password is wrong we stop
// here with a readable message, instead of serving requests that all fail.
try {
  await initDb();
  logger.info('Postgres connected');
  await seedDefaultRooms();
} catch (err) {
  logger.error(`Database connection failed: ${err.message}`);
  console.error(`\nDatabase connection failed: ${err.message}\n`);
  process.exit(1);
}

const server = http.createServer(createApp());
const redisPubSub = await initRedis();
initRealtime(server, redisPubSub);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, { env: process.env.NODE_ENV });
});
