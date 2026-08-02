import webpush from 'web-push';
import PushSubscription from '../models/PushSubscription.js';

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
    await webpush.sendNotification(sub, JSON.stringify(payload));
  } catch (err) {
    if (err.statusCode === 404 || err.statusCode === 410) {
      await PushSubscription.deleteOne({ endpoint: sub.endpoint }).catch(() => {});
    }
  }
}

// Push to every device a single user has registered. No-op when push isn't
// configured. Never throws — callers fire-and-forget.
export async function sendPushToUser(userId, payload) {
  if (!process.env.VAPID_PUBLIC_KEY) return;
  const subs = await PushSubscription.find({ user: userId }).lean();
  await Promise.all(subs.map((sub) => sendToOne(sub, payload)));
}

// Push to many users (deduped). Never throws.
export async function sendPushToUsers(userIds, payload) {
  const unique = [...new Set(userIds.filter(Boolean).map(String))];
  await Promise.all(unique.map((id) => sendPushToUser(id, payload)));
}
