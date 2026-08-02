// Custom service worker (injectManifest). vite-plugin-pwa replaces
// self.__WB_MANIFEST with the built asset list at compile time.
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Image-heavy third-party origins — cache aggressively, keep bounded.
registerRoute(
  /^https:\/\/images\.unsplash\.com\/.*/i,
  new CacheFirst({
    cacheName: 'unsplash-images',
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 }),
    ],
  }),
);
registerRoute(
  /^https:\/\/fonts\.googleapis\.com\/.*/i,
  new StaleWhileRevalidate({ cacheName: 'google-fonts-stylesheets' }),
);

// Take control of open pages as soon as a new SW activates.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

// Display a push notification from the payload sent by the backend.
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'VeganLife', {
      body: data.body || '',
      icon: data.icon || '/icon-192.png',
      badge: data.badge || '/favicon.svg',
      data: { url: data.url || '/' },
    }),
  );
});

// Clicking a notification focuses an open window at the target (route), or opens one.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const base = url.split('#')[0];
      const matching = list.find((c) => c.url.split('#')[0].endsWith(base));
      if (matching) {
        matching.navigate(url);
        return matching.focus();
      }
      return clients.openWindow(url);
    }),
  );
});

// If the push service rotates our subscription, ask the page to re-register it
// (the page owns the VAPID key and API base).
self.addEventListener('subscriptionchange', (event) => {
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) client.postMessage({ type: 'PUSH_RESUBSCRIBE' });
  })());
});
