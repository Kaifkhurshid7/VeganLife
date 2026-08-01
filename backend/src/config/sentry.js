import * as Sentry from '@sentry/node';

// Error tracking — active only when SENTRY_DSN is set. Without it the app runs
// normally and errors just fall through to the logger.
let sentry = null;

export function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn || sentry) return sentry;
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
  });
  sentry = Sentry;
  return sentry;
}

export function getSentry() {
  return sentry;
}
