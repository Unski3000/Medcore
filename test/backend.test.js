import { randomBytes } from 'node:crypto';
import { hashPassword } from '../auth.js';
import assert from 'node:assert/strict';
import { mkdtemp, cp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';

const password = randomBytes(24).toString('hex');
let cookie;
let csrfToken;
let server;
async function staffFetch(url, options = {}) {
  return fetch(url, { ...options, headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000', Cookie: cookie, 'X-CSRF-Token': csrfToken, ...options.headers } });
}
let baseUrl;
let tempDataDir;

before(async () => {
  process.env.NODE_ENV = 'test';
  process.env.MEDCORE_ORIGIN = 'http://localhost:3000';
  process.env.MEDCORE_STAFF_USERS = JSON.stringify([{ username: 'tester', passwordHash: hashPassword(password), role: 'staff' }]);
  tempDataDir = await mkdtemp(path.join(tmpdir(), 'medcore-data-'));
  await cp('data', tempDataDir, { recursive: true });
  process.env.MEDCORE_DATA_DIR = tempDataDir;
  const { app } = await import('../server.js');
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  const login = await fetch(`${baseUrl}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: process.env.MEDCORE_ORIGIN }, body: JSON.stringify({ username: 'tester', password }) });
  assert.equal(login.status, 200);
  cookie = login.headers.get('set-cookie').split(';')[0];
  csrfToken = (await login.json()).csrfToken;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  await rm(tempDataDir, { recursive: true, force: true });
});

test('serves active products for the frontend', async () => {
  const response = await fetch(`${baseUrl}/api/products`);
  assert.equal(response.status, 200);
  const products = await response.json();
  assert.ok(products.length > 0);
  assert.ok(products.every((product) => product.id && product.name && product.cat));
});

test('creates quotations with calculated tax and totals', async () => {
  const products = await (await fetch(`${baseUrl}/api/products`)).json();
  const product = products[0];
  const response = await staffFetch(`${baseUrl}/api/quotations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: { name: 'Test Buyer', organisation: 'Test Clinic', email: 'buyer@example.com' },
      items: [{ productId: product.id, quantity: 2 }]
    })
  });
  assert.equal(response.status, 201);
  const quote = await response.json();
  assert.equal(quote.subtotal, Number((product.price * 2).toFixed(2)));
  assert.equal(quote.taxAmount, Number((quote.subtotal * quote.taxRate).toFixed(2)));
  assert.equal(quote.total, Number((quote.subtotal + quote.taxAmount).toFixed(2)));
  assert.match(quote.links.html, /^\/api\/quotations\/.+\/html$/);
});

test('serves printable quotation HTML with logo and address block', async () => {
  const quotes = await (await staffFetch(`${baseUrl}/api/quotations`)).json();
  assert.ok(quotes.length > 0);
  const response = await staffFetch(`${baseUrl}/api/quotations/${quotes[0].id}/html`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Quotation/);
  assert.match(html, /Company logo/);
  assert.match(html, /Company address line 1/);
  for (const suffix of ['', '/html']) {
    const denied = await fetch(`${baseUrl}/api/quotations/${quotes[0].id}${suffix}`);
    assert.equal(denied.status, 401);
    assert.ok(!(await denied.text()).includes('Test Buyer'));
  }
});


test('private endpoints deny anonymous and forged sessions before reading data', async () => {
  for (const [method, endpoint] of [
    ['GET', '/api/products?admin=true'], ['POST', '/api/products'],
    ['PUT', '/api/products/anything'], ['DELETE', '/api/products/anything'],
    ['GET', '/api/company'], ['PUT', '/api/company'],
    ['GET', '/api/quotations'], ['POST', '/api/quotations'],
    ['GET', '/api/quotations/anything'], ['GET', '/api/quotations/anything/html'],
    ['GET', '/api/auth/session'], ['POST', '/api/auth/logout'],
    ['GET', '/api/products?admin=false&admin=true']
  ]) {
    for (const headers of [{}, { Cookie: 'medcore_session=forged' }]) {
      const response = await fetch(baseUrl + endpoint, { method, headers });
      assert.equal(response.status, 401, `${method} ${endpoint}`);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.equal(response.headers.get('access-control-allow-origin'), null);
    }
  }
});

test('staff can manage products and company settings', async () => {
  const created = await staffFetch(baseUrl + '/api/products', { method: 'POST', body: JSON.stringify({ id: 'security-test', name: 'Hidden test', category: 'Test', price: 20, active: false }) });
  assert.equal(created.status, 201);
  const publicProducts = await (await fetch(baseUrl + '/api/products')).json();
  assert.ok(!publicProducts.some((p) => p.id === 'security-test'));
  const privateProducts = await (await staffFetch(baseUrl + '/api/products?admin=true')).json();
  assert.ok(privateProducts.some((p) => p.id === 'security-test'));
  assert.equal((await staffFetch(baseUrl + '/api/products/security-test', { method: 'PUT', body: JSON.stringify({ price: 30 }) })).status, 200);
  assert.equal((await staffFetch(baseUrl + '/api/products/security-test', { method: 'DELETE' })).status, 204);
  assert.equal((await staffFetch(baseUrl + '/api/company', { method: 'PUT', body: JSON.stringify({ currency: 'KES' }) })).status, 200);
});

test('staff session requires CSRF token and exact origin for mutations', async () => {
  for (const headers of [
    { 'X-CSRF-Token': '' }, { 'X-CSRF-Token': 'forged' },
    { Origin: 'https://attacker.example' }, { Origin: '' }, { 'Sec-Fetch-Site': 'cross-site' }
  ]) {
    assert.equal((await staffFetch(baseUrl + '/api/company', { method: 'PUT', body: '{}', headers })).status, 403);
    assert.equal((await staffFetch(baseUrl + '/api/auth/logout', { method: 'POST', headers })).status, 403);
  }
});

test('private repository and JSON paths are never served, including encoded variants', async () => {
  for (const endpoint of ['/data/quotations.json', '/data/company.json', '/data/products.json', '/%64ata/company.json', '/assets/../data/company.json', '/assets/%2e%2e/data/company.json', '/assets%2f..%2fdata%2fcompany.json', '/%2e%2e%2fserver.js', '/server.js', '/auth.js', '/package.json', '/.env', '/.git/config', '/README.md', '/test/backend.test.js', '/assets/js/../../data/company.json']) {
    for (const headers of [{}, { Cookie: cookie }]) assert.equal((await fetch(baseUrl + endpoint, { headers })).status, 404, endpoint);
  }
  assert.equal((await fetch(baseUrl + '/%ZZ')).status, 400);
  for (const endpoint of ['/', '/admin', '/admin.html', '/assets/js/admin.js', '/medcore-products.html']) assert.equal((await fetch(baseUrl + endpoint)).status, 200, endpoint);
});

test('invalid and oversized request bodies are rejected without internal error details', async () => {
  assert.equal((await staffFetch(baseUrl + '/api/company', { method: 'PUT', body: '{' })).status, 400);
  assert.equal((await staffFetch(baseUrl + '/api/company', { method: 'PUT', body: 'null' })).status, 400);
  assert.equal((await staffFetch(baseUrl + '/api/company', { method: 'PUT', body: '{}', headers: { 'Content-Type': 'text/plain' } })).status, 415);
  assert.equal((await staffFetch(baseUrl + '/api/company', { method: 'PUT', body: JSON.stringify({ large: 'x'.repeat(70000) }) })).status, 413);
});

test('login rejects bad credentials and cross-origin requests; logout revokes session', async () => {
  const login = (username, pass, origin = process.env.MEDCORE_ORIGIN) => fetch(baseUrl + '/api/auth/login', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password: pass }) });
  assert.equal((await login('tester', password, 'https://attacker.example')).status, 403);
  const badPassword = await login('tester', 'wrong');
  const unknownUser = await login('unknown', 'wrong');
  assert.equal(badPassword.status, 401); assert.equal(unknownUser.status, 401);
  assert.deepEqual(await badPassword.json(), await unknownUser.json());
  const response = await login('tester', password);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('set-cookie'), /HttpOnly; SameSite=Strict/);
  const otherCookie = response.headers.get('set-cookie').split(';')[0];
  const otherCsrf = (await response.json()).csrfToken;
  assert.equal((await fetch(baseUrl + '/api/auth/logout', { method: 'POST', headers: { Cookie: otherCookie, Origin: process.env.MEDCORE_ORIGIN, 'X-CSRF-Token': otherCsrf } })).status, 204);
  assert.equal((await fetch(baseUrl + '/api/quotations', { headers: { Cookie: otherCookie } })).status, 401);
  for (let i = 0; i < 7; i++) await login('tester', 'wrong');
  const limited = await login('tester', password);
  assert.equal(limited.status, 429); assert.ok(limited.headers.get('retry-after'));
});
