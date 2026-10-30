// Opaque keyset-pagination cursors. The client just echoes back what it was given.
// Keyset pagination reads "the rows after this one" with a single index range scan,
// so page 500 costs the same as page 1 (OFFSET would scan and discard 10,000 rows)
// and rows never get skipped or duplicated when new posts arrive mid-scroll.

export function encodeCursor(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

export function decodeCursor(raw) {
  if (!raw || typeof raw !== 'string' || raw.length > 400) return null;
  try {
    const value = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'));
    return value && typeof value === 'object' ? value : null;
  } catch {
    return null;
  }
}

/** Safe positive integer from a query string, clamped. */
export function intParam(value, { min = 1, max = 100, fallback }) {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}
