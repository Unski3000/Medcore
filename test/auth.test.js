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

test('rotation at capacity revokes only the replaced session and preserves the limit', async () => {
  // Frozen time prevents sessions expiring while exercising the real password verifier.
  const auth = createAuth(env, () => 1000);
  const cookies = [];
  let setCookie;
  const res = { setHeader(name, value) { if (name === 'Set-Cookie') setCookie = value; } };
  const request = (index, cookie) => ({ method: 'GET', headers: { origin: env.MEDCORE_ORIGIN, cookie }, socket: { remoteAddress: `client-${Math.floor(index / 10)}` } });
  for (let index = 0; index < 1000; index++) {
    await auth.login(request(index), res, { username: 'staff', password });
    cookies.push(setCookie.split(';')[0]);
  }
  const replacement = request(1000, cookies[0]);
  await assert.rejects(auth.login(replacement, res, { username: 'staff', password: 'wrong' }), { status: 401 });
  assert.equal(auth.requireStaff(replacement).username, 'staff');
  for (const cookie of [undefined, 'medcore_session=forged']) {
    await assert.rejects(auth.login(request(1000, cookie), res, { username: 'staff', password }), { status: 503 });
  }
  const session = await auth.login(replacement, res, { username: 'staff', password });
  const newCookie = setCookie.split(';')[0];
  assert.notEqual(newCookie, cookies[0]);
  assert.throws(() => auth.requireStaff(replacement), { status: 401 });
  assert.equal(auth.requireStaff(request(1000, newCookie)).csrfToken, session.csrfToken);
  for (const cookie of cookies.slice(1)) assert.equal(auth.requireStaff(request(1000, cookie)).username, 'staff');
  await assert.rejects(auth.login(request(1000), res, { username: 'staff', password }), { status: 503 });
});
