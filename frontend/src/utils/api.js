export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// fetch wrapper that prefixes the API base and always sends cookies.
// Auth is cookie-based now (httpOnly), so callers never attach tokens manually.
export function apiFetch(path, options = {}) {
  const { headers, ...rest } = options;
  return fetch(`${API_URL}${path}`, {
    ...rest,
    credentials: 'include',
    headers: headers || {},
  });
}
