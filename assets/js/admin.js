(() => {
  'use strict';
  const S = window.MedCoreSecurity;
  let products = [];
  const byId = (id) => document.getElementById(id);
  const money = (n, c = 'KES') => `${c} ${Number(n).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  function toast(msg) { const el = byId('toast'); el.textContent = msg; el.style.display = 'block'; setTimeout(() => { el.style.display = 'none'; }, 2600); }
  async function api(path, options = {}) { const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...options }); if (!res.ok) { const err = await res.json().catch(() => ({ error: 'Request failed' })); throw new Error(err.error || 'Request failed'); } return res.status === 204 ? null : res.json(); }
  function addCell(row, text, className='') { const td = S.el('td', { className }); td.textContent = text; row.append(td); return td; }
  function statusPill(text, on) { return S.el('span', { className: `pill${on ? ' on' : ''}`, text }); }
  async function loadProducts() {
    products = await api('/api/products?admin=true');
    const select = byId('quoteProduct'); S.clear(select);
    products.filter((p) => p.active).forEach((p) => select.append(S.el('option', { value: p.id, text: `${p.name} — ${money(p.price)}` })));
    const tbody = byId('productRows'); S.clear(tbody);
    products.forEach((p) => {
      const row = S.el('tr');
      const productCell = addCell(row, '');
      productCell.append(S.el('strong', { text: p.name }), document.createElement('br'), S.el('span', { className: 'muted', text: p.code || p.id }));
      addCell(row, p.category); addCell(row, money(p.price));
      const status = addCell(row, ''); status.append(statusPill(p.active ? 'Visible' : 'Hidden', p.active), ' ', statusPill(p.featured ? 'Featured' : 'Standard', p.featured));
      const action = addCell(row, ''); const edit = S.el('button', { className: 'ghost', type: 'button', text: 'Edit' }); edit.addEventListener('click', () => editProduct(p.id)); action.append(edit);
      tbody.append(row);
    });
  }
  async function loadCompany() { const c = await api('/api/company'); byId('companyName').value=c.name||''; byId('companyCurrency').value=c.currency||'KES'; byId('companyEmail').value=c.email||''; byId('companyPhone').value=c.phone||''; byId('companyTax').value=c.taxRate??0.16; byId('companyAddress').value=(c.addressLines||[]).join('\n'); }
  async function loadQuotes() {
    const quotes = await api('/api/quotations'); const tbody = byId('quoteRows'); S.clear(tbody);
    if (!quotes.length) { const row=S.el('tr'); const td=addCell(row,'No quotations yet.','muted'); td.colSpan=3; tbody.append(row); return; }
    quotes.slice(0,8).forEach((q) => { const row=S.el('tr'); const id=addCell(row,''); id.append(document.createTextNode(q.id), document.createElement('br'), S.el('span',{className:'muted', text:new Date(q.createdAt).toLocaleDateString()})); addCell(row,money(q.total,q.currency)); const linkCell=addCell(row,''); linkCell.append(S.el('a',{href:`/api/quotations/${encodeURIComponent(q.id)}/html`, target:'_blank', rel:'noopener', text:'Open'})); tbody.append(row); });
  }
  function editProduct(id) { const p = products.find((x) => x.id === id); if (!p) return; byId('productId').value=p.id; byId('productName').value=p.name; byId('productCategory').value=p.category; byId('productCode').value=p.code||''; byId('productPrice').value=p.price; byId('productUnit').value=p.unit||'unit'; byId('productSort').value=p.sortOrder||''; byId('productImage').value=p.imageUrl||''; byId('productDescription').value=p.description||''; byId('productActive').checked=p.active; byId('productFeatured').checked=p.featured; byId('productTaxable').checked=p.taxable!==false; window.scrollTo({top:0,behavior:'smooth'}); }
  function resetProductForm() { byId('productForm').reset(); byId('productId').value=''; byId('productActive').checked=true; byId('productTaxable').checked=true; byId('productFeatured').checked=false; }
  function validProductPayload(payload) { return S.isValid(payload.name,'organisation') && S.isValid(payload.category,'subject') && S.isValid(String(payload.price),'price') && (!payload.code || S.isValid(payload.code,'productCode')) && (!payload.imageUrl || S.isValid(payload.imageUrl,'url')); }
  document.addEventListener('DOMContentLoaded', () => {
    byId('newProductButton')?.addEventListener('click', resetProductForm);
    byId('productForm').addEventListener('submit', async (e) => { e.preventDefault(); const payload={ id:byId('productId').value||undefined, name:byId('productName').value.trim(), category:byId('productCategory').value.trim(), code:byId('productCode').value.trim(), price:Number(byId('productPrice').value), unit:byId('productUnit').value.trim()||'unit', sortOrder:Number(byId('productSort').value||9999), imageUrl:byId('productImage').value.trim(), description:byId('productDescription').value.trim(), active:byId('productActive').checked, featured:byId('productFeatured').checked, taxable:byId('productTaxable').checked }; if(!validProductPayload(payload)){ toast('Check product fields for valid values.'); return; } await api(payload.id?`/api/products/${encodeURIComponent(payload.id)}`:'/api/products',{method:payload.id?'PUT':'POST',body:JSON.stringify(payload)}); toast('Product saved'); resetProductForm(); loadProducts(); });
    byId('companyForm').addEventListener('submit', async (e) => { e.preventDefault(); if(!S.isValid(byId('companyEmail').value,'email') || !S.isValid(byId('companyPhone').value,'phone') || !S.isValid(String(byId('companyTax').value),'price')){ toast('Check company email, phone, and tax rate.'); return; } await api('/api/company',{method:'PUT',body:JSON.stringify({name:byId('companyName').value.trim(),currency:byId('companyCurrency').value.trim(),email:byId('companyEmail').value.trim(),phone:byId('companyPhone').value.trim(),taxRate:Number(byId('companyTax').value),addressLines:byId('companyAddress').value.split('\n').map((x)=>x.trim()).filter(Boolean)})}); toast('Company settings saved'); });
    byId('quoteForm').addEventListener('submit', async (e) => { e.preventDefault(); if(!S.isValid(byId('customerName').value,'name') || (byId('customerEmail').value && !S.isValid(byId('customerEmail').value,'email')) || !S.isValid(byId('quoteQty').value,'quantity')){ toast('Check quotation customer and quantity fields.'); return; } const quote=await api('/api/quotations',{method:'POST',body:JSON.stringify({customer:{name:byId('customerName').value.trim(),organisation:byId('customerOrg').value.trim(),email:byId('customerEmail').value.trim(),phone:byId('customerPhone').value.trim(),address:byId('customerAddress').value.trim()},items:[{productId:byId('quoteProduct').value,quantity:Number(byId('quoteQty').value)}],notes:byId('quoteNotes').value.trim()})}); const ql=byId('quoteLink'); ql.style.display='block'; S.clear(ql); ql.append(S.el('strong',{text:quote.id}), document.createTextNode(` generated. Total: ${money(quote.total,quote.currency)} · `), S.el('a',{href:quote.links.html,target:'_blank',rel:'noopener',text:'Open printable quote'})); loadQuotes(); });
    Promise.all([loadProducts(), loadCompany(), loadQuotes()]).catch((err) => toast(err.message));
  });
})();
