import { isRedisEnabled, getRedisClient } from '../config/redis.js';

// TTL cache — Redis-backed when REDIS_URL is set, otherwise a bounded in-memory map.
const memoryCache = new Map(); // key -> { value, expiresAt }
const MEMORY_MAX = 500;

function memGet(key) {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value;
}

function memSet(key, value, ttlMs) {
  if (memoryCache.size >= MEMORY_MAX) {
    const oldest = memoryCache.keys().next().value;
    memoryCache.delete(oldest);
  }
  memoryCache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

// Bounded in-memory fallback — sweep expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryCache) {
    if (entry.expiresAt < now) memoryCache.delete(key);
  }
}, 60 * 1000).unref?.();

async function get(key) {
  if (isRedisEnabled()) {
    const raw = await getRedisClient()?.get(key);
    if (raw == null) return null;
    return JSON.parse(raw);
  }
  return memGet(key);
}

async function set(key, value, ttlMs) {
  if (isRedisEnabled()) {
    await getRedisClient()?.set(key, JSON.stringify(value), 'PX', ttlMs);
  }
  memSet(key, value, ttlMs);
}

async function del(key) {
  if (isRedisEnabled()) {
    await getRedisClient()?.del(key);
  }
  memoryCache.delete(key);
}

// Atomic increment — used as a cache-version counter so invalidation is a single
// key bump instead of a scan-and-delete across many keys.
async function incr(key) {
  if (isRedisEnabled()) {
    return getRedisClient()?.incr(key);
  }
  const next = (memGet(key) || 0) + 1;
  memSet(key, next, 60 * 1000);
  return next;
}

export const cache = { get, set, del, incr };
