export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// fetch wrapper that prefixes the API base and always sends cookies.
// Auth is cookie-based now (httpOnly), so callers never attach tokens manually.

// Access tokens live in a short-lived httpOnly cookie (15 min). When one expires
// mid-session, every authenticated request comes back 401 with "Access token
// required". To make that transparent, we rotate via the refresh cookie once and
// retry the request. This module is the single place that knows how to do that,
// so apiFetch (used by every page) and AuthContext both get it for free.

let refreshPromise = null;

// Rotate tokens via the refresh cookie. Concurrent 401s share the same in-flight
// request, so N failing requests trigger exactly one rotation (the backend
// rotates the refresh token, so it must only ever run once).
export function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Token refresh failed');
        return res.json();
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// Endpoints whose 401 means "bad credentials", not "session expired" — retrying
// them after a refresh would just resend the same bad input. Everything else can
// safely be retried once after a silent rotation.
function shouldRetryAfter401(path) {
  const noRetry = ['/auth/login', '/auth/signup', '/auth/admin-login', '/auth/refresh'];
  return !noRetry.some((p) => path === p || path.startsWith(`${p}/`));
}

// Low-level fetch with one transparent token refresh + retry on 401. The retried
// request is a plain fetch (no interceptor), so a dead session can never loop.
async function fetchWithRetry(path, init) {
  let res = await fetch(`${API_URL}${path}`, init);

  if (res.status === 401 && shouldRetryAfter401(path)) {
    try {
      await refreshAccessToken();
      res = await fetch(`${API_URL}${path}`, init);
    } catch {
      // No valid refresh cookie — fall through with the original 401.
    }
  }

  return res;
}

export function apiFetch(path, options = {}) {
  const { headers, ...rest } = options;
  return fetchWithRetry(path, {
    ...rest,
    credentials: 'include',
    headers: headers || {},
  });
}
