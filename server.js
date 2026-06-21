import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = process.env.MEDCORE_DATA_DIR || path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const QUOTATIONS_FILE = path.join(DATA_DIR, 'quotations.json');
const COMPANY_FILE = path.join(DATA_DIR, 'company.json');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };

function htmlEscape(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

async function readJson(file, fallback) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return fallback; throw error; }
}
async function writeJson(file, data) { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`); }
async function readBody(req) {
  let body = '';
  for await (const chunk of req) body += chunk;
  return body ? JSON.parse(body) : {};
}
function send(res, status, data, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS' });
  res.end(type.startsWith('application/json') ? JSON.stringify(data) : data);
}
function noContent(res) { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS' }); res.end(); }

async function readProducts() { return (await readJson(PRODUCTS_FILE, [])).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name)); }
async function readCompany() {
  return readJson(COMPANY_FILE, { name: 'MedCore Solutions', email: 'sales@medcoresolutions.com', phone: '+254 700 000 000', addressLines: ['Company address line 1', 'Company address line 2'], taxRate: 0.16, currency: 'KES', logoSvg: '' });
}
function normalizeProduct(input, existing = {}) {
  const name = String(input.name ?? existing.name ?? '').trim();
  const category = String(input.category ?? existing.category ?? '').trim();
  const price = Number(input.price ?? existing.price);
  if (!name) throw Object.assign(new Error('Product name is required.'), { status: 400 });
  if (!category) throw Object.assign(new Error('Product category is required.'), { status: 400 });
  if (!Number.isFinite(price) || price < 0) throw Object.assign(new Error('Product price must be a positive number.'), { status: 400 });
  return { id: String(input.id ?? existing.id ?? `PRD-${Date.now()}`).trim(), name, category, code: String(input.code ?? existing.code ?? '').trim(), price, unit: String(input.unit ?? existing.unit ?? 'unit').trim(), imageUrl: String(input.imageUrl ?? existing.imageUrl ?? '').trim(), description: String(input.description ?? existing.description ?? '').trim(), active: Boolean(input.active ?? existing.active ?? true), featured: Boolean(input.featured ?? existing.featured ?? false), taxable: Boolean(input.taxable ?? existing.taxable ?? true), sortOrder: Number(input.sortOrder ?? existing.sortOrder ?? 9999), updatedAt: new Date().toISOString() };
}
function publicProduct(product) { return { id: product.id, name: product.name, cat: product.category, category: product.category, code: product.code, price: product.price, img: product.imageUrl, imageUrl: product.imageUrl, desc: product.description, description: product.description, unit: product.unit, featured: product.featured, taxable: product.taxable }; }
function quoteNumber() { return `MCQ-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`; }
function money(amount, currency = 'KES') { return `${currency} ${Number(amount).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }

async function calculateQuotation(payload) {
  const products = await readProducts();
  const company = await readCompany();
  const productMap = new Map(products.map((product) => [product.id, product]));
  const items = Array.isArray(payload.items) ? payload.items : [];
  if (!items.length) throw Object.assign(new Error('At least one quotation item is required.'), { status: 400 });
  const lines = items.map((item) => {
    const product = productMap.get(String(item.productId));
    if (!product || product.active === false) throw Object.assign(new Error(`Unknown or inactive product: ${item.productId}`), { status: 400 });
    const quantity = Number(item.quantity);
    if (!Number.isFinite(quantity) || quantity <= 0) throw Object.assign(new Error(`Invalid quantity for ${product.name}.`), { status: 400 });
    const unitPrice = Number(item.unitPrice ?? product.price);
    const lineSubtotal = quantity * unitPrice;
    const taxable = item.taxable ?? product.taxable ?? true;
    const taxAmount = taxable ? lineSubtotal * Number(company.taxRate ?? 0) : 0;
    return { productId: product.id, code: product.code, name: product.name, unit: product.unit, quantity, unitPrice, taxable, subtotal: Number(lineSubtotal.toFixed(2)), taxAmount: Number(taxAmount.toFixed(2)), total: Number((lineSubtotal + taxAmount).toFixed(2)) };
  });
  const subtotal = Number(lines.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
  const taxAmount = Number(lines.reduce((sum, item) => sum + item.taxAmount, 0).toFixed(2));
  const total = Number((subtotal + taxAmount).toFixed(2));
  const now = new Date().toISOString();
  return { id: quoteNumber(), status: 'draft', createdAt: now, expiresAt: payload.expiresAt || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), company, customer: { name: String(payload.customer?.name ?? '').trim(), organisation: String(payload.customer?.organisation ?? '').trim(), email: String(payload.customer?.email ?? '').trim(), phone: String(payload.customer?.phone ?? '').trim(), address: String(payload.customer?.address ?? '').trim() }, notes: String(payload.notes ?? 'Quotation is subject to product availability and final confirmation.').trim(), currency: company.currency ?? 'KES', taxRate: Number(company.taxRate ?? 0), items: lines, subtotal, taxAmount, total };
}

function quotationHtml(quote) {
  const address = (quote.company.addressLines || []).filter(Boolean).map(htmlEscape).join('<br>');
  const logo = quote.company.logoSvg ? `data:image/svg+xml;base64,${Buffer.from(quote.company.logoSvg).toString('base64')}` : '';
  const rows = quote.items.map((item) => `<tr><td><strong>${htmlEscape(item.name)}</strong><br><span>${htmlEscape(item.code)}</span></td><td>${htmlEscape(item.unit)}</td><td class="num">${item.quantity}</td><td class="num">${money(item.unitPrice, quote.currency)}</td><td class="num">${money(item.taxAmount, quote.currency)}</td><td class="num">${money(item.total, quote.currency)}</td></tr>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; base-uri 'none'; object-src 'none'"><title>${htmlEscape(quote.id)} — Quotation</title><style>body{font-family:Arial,sans-serif;color:#0B1F3A;margin:0;background:#EEF2F7}.quote{max-width:960px;margin:32px auto;background:white;padding:44px;border-radius:18px;box-shadow:0 10px 40px rgba(11,31,58,.12)}header{display:flex;justify-content:space-between;gap:24px;border-bottom:3px solid #0E8C8C;padding-bottom:24px}.brand{display:flex;gap:16px;align-items:center}.brand img{width:72px;height:72px;border-radius:16px}.brand h1{margin:0;font-size:30px}.muted{color:#61738D;line-height:1.6}.title{text-align:right}.title h2{margin:0 0 8px;font-size:32px;color:#0E8C8C}.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:28px 0}.box{border:1px solid #DDE5EF;border-radius:12px;padding:18px}.box h3{margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#0E8C8C}table{width:100%;border-collapse:collapse;margin-top:24px}th{text-align:left;background:#0B1F3A;color:white;padding:12px;font-size:12px;text-transform:uppercase}td{padding:14px 12px;border-bottom:1px solid #DDE5EF}td span{font-size:12px;color:#61738D}.num{text-align:right;white-space:nowrap}.totals{margin-left:auto;margin-top:22px;width:330px}.totals div{display:flex;justify-content:space-between;padding:9px 0}.totals .grand{font-size:20px;font-weight:700;border-top:2px solid #0B1F3A;color:#0E8C8C}.actions{margin:0 auto 40px;max-width:960px;text-align:right}.actions button{background:#0E8C8C;color:white;border:0;border-radius:8px;padding:12px 18px;font-weight:700;cursor:pointer}@media print{body{background:white}.quote{box-shadow:none;margin:0;border-radius:0}.actions{display:none}}</style></head><body><main class="quote"><header><div class="brand">${logo ? `<img alt="Company logo" src="${logo}">` : ''}<div><h1>${htmlEscape(quote.company.name)}</h1><div class="muted">${address}<br>${htmlEscape(quote.company.email)} · ${htmlEscape(quote.company.phone)}</div></div></div><div class="title"><h2>Quotation</h2><div class="muted"><strong>${htmlEscape(quote.id)}</strong><br>Created: ${new Date(quote.createdAt).toLocaleDateString()}<br>Valid until: ${new Date(quote.expiresAt).toLocaleDateString()}</div></div></header><section class="grid"><div class="box"><h3>Prepared for</h3><strong>${htmlEscape(quote.customer.organisation || quote.customer.name)}</strong><div class="muted">${htmlEscape(quote.customer.name)}<br>${htmlEscape(quote.customer.email)}<br>${htmlEscape(quote.customer.phone)}<br>${htmlEscape(quote.customer.address)}</div></div><div class="box"><h3>Notes</h3><div class="muted">${htmlEscape(quote.notes)}</div></div></section><table><thead><tr><th>Item</th><th>Unit</th><th class="num">Qty</th><th class="num">Unit Price</th><th class="num">Tax</th><th class="num">Total</th></tr></thead><tbody>${rows}</tbody></table><section class="totals"><div><span>Subtotal</span><strong>${money(quote.subtotal, quote.currency)}</strong></div><div><span>Tax (${Math.round(quote.taxRate * 100)}%)</span><strong>${money(quote.taxAmount, quote.currency)}</strong></div><div class="grand"><span>Total</span><span>${money(quote.total, quote.currency)}</span></div></section></main><div class="actions"><p>Use your browser print dialog to save this quotation as PDF.</p></div></body></html>`;
}

async function serveStatic(pathname, res) {
  const normalized = pathname === '/' ? '/index.html' : pathname === '/admin' ? '/admin.html' : pathname;
  const filePath = path.join(__dirname, decodeURIComponent(normalized));
  if (!filePath.startsWith(__dirname)) return send(res, 403, { error: 'Forbidden' });
  try { const content = await fs.readFile(filePath); send(res, 200, content, MIME[path.extname(filePath)] || 'application/octet-stream'); }
  catch { send(res, 404, { error: 'Not found' }); }
}

async function route(req, res) {
  if (req.method === 'OPTIONS') return noContent(res);
  const url = new URL(req.url, 'http://localhost');
  const { pathname, searchParams } = url;

  if (pathname === '/api/company' && req.method === 'GET') return send(res, 200, await readCompany());
  if (pathname === '/api/company' && req.method === 'PUT') {
    const body = await readBody(req); const existing = await readCompany();
    const company = { ...existing, ...body, taxRate: Number(body.taxRate ?? existing.taxRate ?? 0.16), addressLines: Array.isArray(body.addressLines) ? body.addressLines.map(String) : existing.addressLines };
    await writeJson(COMPANY_FILE, company); return send(res, 200, company);
  }
  if (pathname === '/api/products' && req.method === 'GET') {
    const admin = searchParams.get('admin') === 'true'; const featured = searchParams.get('featured') === 'true';
    let products = await readProducts(); if (!admin) products = products.filter((product) => product.active !== false); if (featured) products = products.filter((product) => product.featured);
    return send(res, 200, products.map(admin ? (product) => product : publicProduct));
  }
  if (pathname === '/api/products' && req.method === 'POST') {
    const products = await readProducts(); const product = normalizeProduct(await readBody(req), { sortOrder: products.length + 1 });
    if (products.some((item) => item.id === product.id)) throw Object.assign(new Error('Product ID already exists.'), { status: 409 });
    products.push(product); await writeJson(PRODUCTS_FILE, products); return send(res, 201, product);
  }
  const productMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
  if (productMatch && req.method === 'PUT') {
    const products = await readProducts(); const index = products.findIndex((product) => product.id === productMatch[1]);
    if (index === -1) throw Object.assign(new Error('Product not found.'), { status: 404 });
    products[index] = normalizeProduct(await readBody(req), products[index]); await writeJson(PRODUCTS_FILE, products); return send(res, 200, products[index]);
  }
  if (productMatch && req.method === 'DELETE') {
    const products = await readProducts(); const nextProducts = products.filter((product) => product.id !== productMatch[1]);
    if (nextProducts.length === products.length) throw Object.assign(new Error('Product not found.'), { status: 404 });
    await writeJson(PRODUCTS_FILE, nextProducts); return noContent(res);
  }
  if (pathname === '/api/quotations' && req.method === 'POST') {
    const quote = await calculateQuotation(await readBody(req)); const quotes = await readJson(QUOTATIONS_FILE, []);
    quotes.unshift(quote); await writeJson(QUOTATIONS_FILE, quotes); return send(res, 201, { ...quote, links: { html: `/api/quotations/${quote.id}/html` } });
  }
  if (pathname === '/api/quotations' && req.method === 'GET') return send(res, 200, await readJson(QUOTATIONS_FILE, []));
  const quoteMatch = pathname.match(/^\/api\/quotations\/([^/]+)(\/html)?$/);
  if (quoteMatch && req.method === 'GET') {
    const quote = (await readJson(QUOTATIONS_FILE, [])).find((item) => item.id === quoteMatch[1]);
    if (!quote) throw Object.assign(new Error('Quotation not found.'), { status: 404 });
    return quoteMatch[2] ? send(res, 200, quotationHtml(quote), 'text/html; charset=utf-8') : send(res, 200, quote);
  }
  return serveStatic(pathname, res);
}

export function createAppServer() {
  return createServer(async (req, res) => {
    try { await route(req, res); }
    catch (error) { send(res, error.status || 500, { error: error.message || 'Server error' }); }
  });
}

export const app = { listen: (...args) => createAppServer().listen(...args) };

if (process.env.NODE_ENV !== 'test') {
  const port = Number(process.env.PORT || 3000);
  createAppServer().listen(port, () => console.log(`MedCore backend running at http://localhost:${port}`));
}
