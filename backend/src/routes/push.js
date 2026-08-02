import { Router } from 'express';
import PushSubscription from '../models/PushSubscription.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

// Push subscription management requires an authenticated user.
router.use(authenticate);

// Register (or update) a browser push subscription for the current user.
router.post('/subscribe', asyncHandler(async (req, res) => {
  const { endpoint, keys } = req.body;

  if (typeof endpoint !== 'string' || !/^https:\/\/.+/.test(endpoint)) {
    throw ApiError.badRequest('Invalid push endpoint');
  }
  if (!keys?.p256dh || !keys?.auth) {
    throw ApiError.badRequest('Missing push keys');
  }

  await PushSubscription.findOneAndUpdate(
    { endpoint },
    { user: req.user._id, endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth } },
    { upsert: true, new: true },
  );

  res.json({ success: true, data: { subscribed: true } });
}));

// Remove a subscription by endpoint (e.g. user disabled notifications).
router.post('/unsubscribe', asyncHandler(async (req, res) => {
  const { endpoint } = req.body;
  if (typeof endpoint === 'string') {
    await PushSubscription.deleteOne({ endpoint });
  }
  res.json({ success: true, data: { subscribed: false } });
}));

export default router;
