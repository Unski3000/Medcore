import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const htmlFiles = ['index.html', 'medcore-products.html', 'medcore-quote.html', 'medcore-contact.html', 'admin.html'];
const jsonFiles = ['data/products.json', 'data/company.json', 'data/quotations.json'];

for (const file of htmlFiles) {
  const source = await fs.readFile(path.join(root, file), 'utf8');
  if (!source.includes('<!')) throw new Error(`${file} does not look like an HTML document.`);
  const refs = [...source.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)].map((match) => match[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|#|javascript:)/.test(ref) || ref.includes('${')) continue;
    const localPath = ref.split('#')[0].split('?')[0];
    if (!localPath) continue;
    await fs.access(path.join(root, localPath));
  }
}

for (const file of jsonFiles) {
  JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));
}

const products = JSON.parse(await fs.readFile(path.join(root, 'data/products.json'), 'utf8'));
if (!products.length) throw new Error('Product data must not be empty.');
for (const product of products) {
  for (const field of ['id', 'name', 'category', 'price']) {
    if (product[field] === undefined || product[field] === '') throw new Error(`Product ${product.id || '(missing id)'} is missing ${field}.`);
  }
}

console.log(`Build check passed for ${htmlFiles.length} HTML files and ${products.length} products.`);
