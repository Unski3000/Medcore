import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../assets/js/admin.js', import.meta.url), 'utf8');
const response = (status, data) => ({ ok: status < 400, status, json: async () => data });

for (const probeResult of ['anonymous', 'network failure', 'existing session']) {
  test(`early login waits for initial probe: ${probeResult}`, async () => {
    const elements = new Map();
    const get = (id) => {
      if (!elements.has(id)) elements.set(id, {
        value: '', textContent: '', style: {}, hidden: false, handlers: {},
        addEventListener(event, handler) { this.handlers[event] = handler; },
        append() {}, reset() {
          if (id === 'loginForm') { get('username').value = ''; get('password').value = ''; }
        }
      });
      return elements.get(id);
    };
    let ready, resolveProbe, rejectProbe;
    const probe = new Promise((resolve, reject) => { resolveProbe = resolve; rejectProbe = reject; });
    const calls = [];
    runInNewContext(source, {
      document: { getElementById: get, addEventListener(event, handler) { ready = handler; } },
      window: { MedCoreSecurity: { clear() {}, el() { return { append() {} }; } } },
      setTimeout() {},
      fetch: async (path, options) => {
        calls.push({ path, options });
        if (path === '/api/auth/session') return probe;
        if (path === '/api/auth/login') return response(200, { username: 'staff', csrfToken: 'new-token' });
        return response(200, path === '/api/company' ? {} : []);
      }
    });
    ready();
    get('username').value = 'staff'; get('password').value = 'test-password';
    const submitted = get('loginForm').handlers.submit({ preventDefault() {} });
    assert.equal(calls.filter((c) => c.path === '/api/auth/login').length, 0);
    if (probeResult === 'network failure') rejectProbe(new Error('Offline'));
    else resolveProbe(probeResult === 'anonymous'
      ? response(401, { error: 'Staff sign-in required.' })
      : response(200, { username: 'previous-staff', csrfToken: 'old-token' }));
    await submitted;
    const login = calls.find((c) => c.path === '/api/auth/login');
    assert.deepEqual(JSON.parse(login.options.body), { username: 'staff', password: 'test-password' });
    assert.equal(get('staffPanel').hidden, false);
    assert.equal(get('loginPanel').hidden, true);
    assert.equal(get('staffName').textContent, 'staff');
    assert.equal(get('loginError').textContent, '');
    assert.equal(get('password').value, '');
    assert.equal(get('loginButton').disabled, false);
    assert.equal(calls.at(-1).options.headers['X-CSRF-Token'], 'new-token');
  });
}
