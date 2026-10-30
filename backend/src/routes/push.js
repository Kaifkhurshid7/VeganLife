import { Router } from 'express';
import { query } from '../db/index.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

// Push subscription management requires an authenticated user.
router.use(authenticate);

const MAX_DEVICES_PER_USER = 20;

// Register (or update) a browser push subscription for the current user.
router.post('/subscribe', asyncHandler(async (req, res) => {
  const { endpoint, keys } = req.body;
  if (typeof endpoint !== 'string' || endpoint.length > 1000 || !/^https:\/\/.+/.test(endpoint)) {
    throw ApiError.badRequest('Invalid push endpoint');
  }
  if (!keys?.p256dh || !keys?.auth) {
    throw ApiError.badRequest('Missing push keys');
  }

  // endpoint is globally unique, so re-subscribing the same browser just updates the row
  await query(
    `insert into push_subscriptions (user_id, endpoint, p256dh, auth)
     values ($1, $2, $3, $4)
     on conflict (endpoint) do update set user_id = excluded.user_id, p256dh = excluded.p256dh, auth = excluded.auth`,
    [req.user.id, endpoint, String(keys.p256dh), String(keys.auth)],
  );

  // Keep only the newest devices if someone registers a lot of them
  await query(
    `delete from push_subscriptions
      where user_id = $1
        and id not in (select id from push_subscriptions where user_id = $1 order by created_at desc limit $2)`,
    [req.user.id, MAX_DEVICES_PER_USER],
  );

  res.json({ success: true, data: { subscribed: true } });
}));

// Remove a subscription by endpoint (e.g. user disabled notifications).
router.post('/unsubscribe', asyncHandler(async (req, res) => {
  const { endpoint } = req.body;
  if (typeof endpoint === 'string') {
    // Only the owner can remove their own subscription
    await query('delete from push_subscriptions where endpoint = $1 and user_id = $2', [endpoint, req.user.id]);
  }
  res.json({ success: true, data: { subscribed: false } });
}));

export default router;
