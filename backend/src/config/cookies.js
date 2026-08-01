// httpOnly cookie config — tokens never touch localStorage, so an XSS payload
// can't exfiltrate a session. Cross-origin production needs SameSite=None + Secure.
const isProd = () => process.env.NODE_ENV === 'production';

export const ACCESS_TOKEN_COOKIE = 'accessToken';
export const REFRESH_TOKEN_COOKIE = 'refreshToken';

export const accessCookieOptions = {
  httpOnly: true,
  secure: isProd(),
  sameSite: isProd() ? 'none' : 'lax',
  maxAge: 15 * 60 * 1000, // 15m, matches access token TTL
  path: '/',
};

export const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd(),
  sameSite: isProd() ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7d, matches refresh token TTL
  path: '/',
};
