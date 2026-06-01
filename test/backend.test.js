import assert from 'node:assert/strict';
import { mkdtemp, cp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';

let server;
let baseUrl;
let tempDataDir;

before(async () => {
  process.env.NODE_ENV = 'test';
  tempDataDir = await mkdtemp(path.join(tmpdir(), 'medcore-data-'));
  await cp('data', tempDataDir, { recursive: true });
  process.env.MEDCORE_DATA_DIR = tempDataDir;
  const { app } = await import('../server.js');
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
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
  const response = await fetch(`${baseUrl}/api/quotations`, {
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
  const quotes = await (await fetch(`${baseUrl}/api/quotations`)).json();
  assert.ok(quotes.length > 0);
  const response = await fetch(`${baseUrl}/api/quotations/${quotes[0].id}/html`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Quotation/);
  assert.match(html, /Company logo/);
  assert.match(html, /Company address line 1/);
});
