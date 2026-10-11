import { randomBytes, scryptSync, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const deriveKey = promisify(scrypt);
const COOKIE = 'medcore_session';
const fail = (status, message) => Object.assign(new Error(message), { status });

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString('hex')}`;
}

export function createAuth(env = process.env, now = Date.now) {
  let users;
  try { users = JSON.parse(env.MEDCORE_STAFF_USERS || 'null'); } catch { /* validated below */ }
  if (!Array.isArray(users) || !users.length || users.some((u) =>
    !u || typeof u.username !== 'string' || !/^[A-Za-z0-9_.@-]{1,100}$/.test(u.username) ||
    u.role !== 'staff' || !/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(u.passwordHash)) ||
    new Set(users.map((u) => u.username)).size !== users.length) {
    throw new Error('Configure MEDCORE_STAFF_USERS with unique usernames, scrypt password hashes, and role "staff".');
  }
  const production = env.NODE_ENV === 'production';
  const origin = env.MEDCORE_ORIGIN;
  if (!origin || new URL(origin).origin !== origin ||
      (production ? !origin.startsWith('https://') : !/^https?:\/\//.test(origin))) {
    throw new Error('MEDCORE_ORIGIN must be an exact origin; production requires HTTPS.');
  }
  const ttl = Number(env.MEDCORE_SESSION_TTL_SECONDS || 28800);
  if (!Number.isInteger(ttl) || ttl < 60 || ttl > 86400) throw new Error('Session TTL must be 60–86400 seconds.');
  const sessions = new Map();
  const attempts = new Map();
  const dummyHash = hashPassword(randomBytes(32).toString('hex'));
  function cookie(token, maxAge) {
    return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${production || origin.startsWith('https://') ? '; Secure' : ''}`;
  }
  function token(req) { return (req.headers.cookie || '').split(';').map((s) => s.trim()).find((s) => s.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1); }
  function prune() {
    for (const [key, value] of sessions) if (value.expires <= now()) sessions.delete(key);
    for (const [key, value] of attempts) if (value.expires <= now()) attempts.delete(key);
  }
  function session(req) {
    prune();
    return sessions.get(token(req));
  }
  function checkOrigin(req) {
    if (req.headers.origin !== origin || req.headers['sec-fetch-site'] === 'cross-site') throw fail(403, 'Invalid request origin.');
  }
  function requireStaff(req) {
    const current = session(req);
    if (!current) throw fail(401, 'Staff sign-in required.');
    if (current.role !== 'staff') throw fail(403, 'Staff access required.');
    if (!['GET', 'HEAD'].includes(req.method)) {
      checkOrigin(req);
      if (req.headers['x-csrf-token'] !== current.csrfToken) throw fail(403, 'Invalid CSRF token.');
    }
    return current;
  }
  async function login(req, res, body) {
    checkOrigin(req);
    prune();
    // Use the socket address, never an untrusted X-Forwarded-For header.
    const key = req.socket.remoteAddress;
    let bucket = attempts.get(key);
    if (!bucket) {
      if (attempts.size >= 1000) throw fail(429, 'Too many sign-in attempts. Try again later.');
      bucket = { count: 0, expires: now() + 15 * 60 * 1000 }; attempts.set(key, bucket);
    }
    if (++bucket.count > 10) { res.setHeader('Retry-After', Math.ceil((bucket.expires - now()) / 1000)); throw fail(429, 'Too many sign-in attempts. Try again later.'); }
    const user = users.find((u) => u.username === body.username);
    const [, salt, expected] = (user?.passwordHash || dummyHash).split('$');
    const password = typeof body.password === 'string' && Buffer.byteLength(body.password) <= 1024 ? body.password : '';
    const actual = await deriveKey(password, salt, 64);
    if (!timingSafeEqual(actual, Buffer.from(expected, 'hex')) || !user) throw fail(401, 'Invalid username or password.');
    if (sessions.size >= 1000) throw fail(503, 'Session capacity reached. Try again later.');
    sessions.delete(token(req));
    const id = randomBytes(32).toString('hex');
    const current = { username: user.username, role: user.role, csrfToken: randomBytes(32).toString('hex'), expires: now() + ttl * 1000 };
    sessions.set(id, current);
    res.setHeader('Set-Cookie', cookie(id, ttl));
    return { username: current.username, csrfToken: current.csrfToken };
  }
  function logout(req, res) { requireStaff(req); sessions.delete(token(req)); res.setHeader('Set-Cookie', cookie('', 0)); }
  return { login, logout, requireStaff, checkOrigin };
}
