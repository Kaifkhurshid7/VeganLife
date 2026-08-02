import { apiFetch } from './api';

// VAPID public key is safe to ship to the browser (only the private key is secret).
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

// The applicationServerKey the browser needs is a Uint8Array derived from the
// base64url VAPID key the push service gave us.
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i += 1) binary += String.fromCharCode(bytes[i]);
  return window.btoa(binary);
}

async function sendSubscriptionToServer(subscription) {
  if (!subscription) return false;
  try {
    const res = await apiFetch('/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
          auth: arrayBufferToBase64(subscription.getKey('auth')),
        },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Ask for permission, subscribe the service worker, and register the subscription
// with the backend. Returns { supported, state } for the caller to render UI.
export async function requestPushPermission() {
  const unsupported = !('serviceWorker' in navigator) || !('PushManager' in window);
  if (unsupported || !VAPID_PUBLIC_KEY) {
    return { supported: false, state: Notification?.permission || 'unsupported' };
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return { supported: true, state: permission };

  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();
  const subscription = existing || await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  await sendSubscriptionToServer(subscription);

  // The service worker pings us when the push service rotates the subscription.
  navigator.serviceWorker.addEventListener('message', async (event) => {
    if (event.data?.type === 'PUSH_RESUBSCRIBE') {
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sendSubscriptionToServer(sub);
    }
  });

  return { supported: true, state: permission };
}

export { VAPID_PUBLIC_KEY };
