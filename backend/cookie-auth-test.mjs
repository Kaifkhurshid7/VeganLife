// Verifies httpOnly-cookie auth: cookies set on login, used for authed requests,
// refresh rotation, 401 without a cookie, CORS blocking, and account cleanup.
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Post from './src/models/Post.js';

const API = 'http://localhost:5000/api';
const ts = Date.now();
const user = { name: 'Cookie Test', username: `cookiet${ts}`, email: `cookiet${ts}@test.dev`, password: 'test123456' };

let failures = 0;
const check = (label, ok) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`); if (!ok) failures++; };

function extractCookies(headers) {
  const out = {};
  const setCookies = typeof headers.getSetCookie === 'function'
    ? headers.getSetCookie()
    : [headers.get('set-cookie')].filter(Boolean);
  for (const line of setCookies) {
    const [nameValue] = line.split(';');
    const idx = nameValue.indexOf('=');
    if (idx > -1) out[nameValue.slice(0, idx).trim()] = nameValue.slice(idx + 1).trim();
  }
  return out;
}

async function req(path, { method = 'GET', body, cookies, origin } = {}) {
  const headers = {};
  if (cookies) headers.Cookie = cookies;
  if (origin) headers.Origin = origin;
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return { res, json: await res.json().catch(() => ({})) };
}

let r = await req('/auth/signup', { method: 'POST', body: user });
check('signup sets cookies', !!r.res.headers.get('set-cookie'));
check('signup returns user', r.json.user?.username === user.username);
const cookies = extractCookies(r.res.headers);
const accessCookie = `accessToken=${cookies.accessToken}`;
const refreshCookie = `refreshToken=${cookies.refreshToken}`;

r = await req('/auth/me', { cookies: accessCookie });
check('GET /auth/me with cookie -> user', r.res.ok && r.json.user?.username === user.username);

r = await req('/auth/me');
check('GET /auth/me without cookie -> 401', r.res.status === 401);

r = await req('/auth/refresh', { method: 'POST', cookies: refreshCookie });
check('refresh via refresh cookie works', r.res.ok);

r = await req('/posts', { method: 'POST', cookies: accessCookie, body: { title: `Cookie post ${ts}`, content: 'auth via cookie', category: 'General' } });
check('authenticated POST /posts via cookie', r.res.status === 201 && r.json.data?._id);

r = await req('/posts', { origin: 'http://evil.example.com' });
check('unknown origin blocked by CORS', r.res.status >= 400);

r = await req('/auth/account', { method: 'DELETE', cookies: accessCookie });
check('delete account via cookie', r.res.ok);

// Self-cleanup the orphaned test post
await mongoose.connect(process.env.MONGODB_URI);
const del = await Post.deleteMany({ title: /^Cookie post/ });
console.log(`Cleaned up ${del.deletedCount} test post(s)`);
await mongoose.disconnect();

console.log(failures === 0 ? '\nALL TESTS PASSED' : `\n${failures} TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
