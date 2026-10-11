import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { createAuth, hashPassword } from '../auth.js';
const password = randomBytes(24).toString('hex');
const users = [{ username: 'staff', passwordHash: hashPassword(password), role: 'staff' }];
const env = { NODE_ENV: 'production', MEDCORE_ORIGIN: 'https://medcore.example', MEDCORE_STAFF_USERS: JSON.stringify(users), MEDCORE_SESSION_TTL_SECONDS: '60' };

test('configuration fails closed without valid staff hashes, role, origin and TTL', () => {
  for (const changes of [
    { MEDCORE_STAFF_USERS: '' }, { MEDCORE_STAFF_USERS: '[]' }, { MEDCORE_STAFF_USERS: 'invalid' },
    { MEDCORE_STAFF_USERS: JSON.stringify([{ ...users[0], role: 'customer' }]) },
    { MEDCORE_STAFF_USERS: JSON.stringify([{ ...users[0], passwordHash: password }]) },
    { MEDCORE_STAFF_USERS: JSON.stringify([...users, ...users]) },
    { MEDCORE_ORIGIN: '' }, { MEDCORE_ORIGIN: 'http://medcore.example' },
    { MEDCORE_ORIGIN: 'https://medcore.example/path' }, { MEDCORE_SESSION_TTL_SECONDS: '0' }
  ]) assert.throws(() => createAuth({ ...env, ...changes }));
});

test('secure cookie, session rotation, expiry, and logout invalidation', async () => {
  let now = 1000; const auth = createAuth(env, () => now);
  let setCookie;
  const res = { setHeader(name, value) { if (name === 'Set-Cookie') setCookie = value; } };
  const req = { method: 'POST', headers: { origin: env.MEDCORE_ORIGIN }, socket: { remoteAddress: '127.0.0.1' } };
  await auth.login(req, res, { username: 'staff', password });
  assert.match(setCookie, /; Secure$/);
  const oldCookie = setCookie.split(';')[0]; req.headers.cookie = oldCookie;
  const session = await auth.login(req, res, { username: 'staff', password });
  assert.throws(() => auth.requireStaff({ ...req, method: 'GET' }), { status: 401 });
  req.headers.cookie = setCookie.split(';')[0]; req.headers['x-csrf-token'] = session.csrfToken;
  assert.equal(auth.requireStaff(req).username, 'staff');
  now += 60001;
  assert.throws(() => auth.requireStaff(req), { status: 401 });
  const next = await auth.login(req, res, { username: 'staff', password });
  req.headers.cookie = setCookie.split(';')[0]; req.headers['x-csrf-token'] = next.csrfToken;
  auth.logout(req, res); assert.match(setCookie, /Max-Age=0/);
  assert.throws(() => auth.requireStaff(req), { status: 401 });
});
