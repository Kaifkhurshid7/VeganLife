import webpush from 'web-push';
import { query } from '../db/index.js';

// Configure VAPID once at import time (only when keys are present, so dev runs
// without web push configured are a no-op rather than a crash).
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  );
}

// Send to one subscription, pruning it if the push service reports it as gone
// (404 = unknown endpoint, 410 = unsubscribed). Never throws.
async function sendToOne(sub, payload) {
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload),
    );
  } catch (err) {
    if (err.statusCode === 404 || err.statusCode === 410) {
      await query('delete from push_subscriptions where endpoint = $1', [sub.endpoint]).catch(() => {});
    }
  }
}

// Push to many users (deduped), in a single query for all their devices. No-op
// when push isn't configured. Never throws; callers fire-and-forget.
export async function sendPushToUsers(userIds, payload) {
  if (!process.env.VAPID_PUBLIC_KEY) return;
  const unique = [...new Set((userIds || []).filter(Boolean).map(String))];
  if (unique.length === 0) return;

  const { rows } = await query(
    'select endpoint, p256dh, auth from push_subscriptions where user_id = any($1::uuid[])',
    [unique],
  );
  await Promise.all(rows.map((sub) => sendToOne(sub, payload)));
}

export const sendPushToUser = (userId, payload) => sendPushToUsers([userId], payload);
