import Redis from 'ioredis';

// Optional shared infrastructure. Setting REDIS_URL enables multi-instance rate
// limiting, a shared TTL cache, and the socket.io Redis adapter. Without it,
// everything falls back to in-memory — which is fine for a single instance.
const url = process.env.REDIS_URL;
let pubClient = null;
let subClient = null;

export function isRedisEnabled() {
  return !!url;
}

export async function initRedis() {
  if (!url) return null;
  try {
    pubClient = new Redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: null,
      retryStrategy: (times) => (times > 5 ? null : Math.min(times * 200, 2000)), // give up quickly if down
    });
    subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    pubClient.on('error', (err) => console.error('Redis error:', err.message));
    console.log('Redis connected');
    return { pub: pubClient, sub: subClient };
  } catch (err) {
    console.error('Redis unavailable — falling back to in-memory:', err.message);
    pubClient = null;
    subClient = null;
    return null;
  }
}

export function getRedisPubSub() {
  if (!pubClient) return null;
  return { pub: pubClient, sub: subClient };
}

export function getRedisClient() {
  return pubClient;
}
