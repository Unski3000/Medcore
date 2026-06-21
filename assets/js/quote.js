
// ── DATA ──────────────────────────────────────────────────────────────
const PRODUCTS = {
  "Large Devices": [
    { id:"LD1", name:"MRI System (1.5T)", unit:"per unit",
      tiers:[{min:1,max:2,price:820000},{min:3,max:5,price:775000},{min:6,max:999,price:720000}]},
    { id:"LD2", name:"CT Scanner (64-Slice)", unit:"per unit",
      tiers:[{min:1,max:2,price:310000},{min:3,max:5,price:285000},{min:6,max:999,price:260000}]},
    { id:"LD3", name:"Digital X-Ray System", unit:"per unit",
      tiers:[{min:1,max:2,price:48000},{min:3,max:5,price:42000},{min:6,max:999,price:37000}]},
    { id:"LD4", name:"ICU Ventilator", unit:"per unit",
      tiers:[{min:1,max:5,price:26000},{min:6,max:20,price:23000},{min:21,max:999,price:19500}]},
    { id:"LD5", name:"Surgical Table (Electric)", unit:"per unit",
      tiers:[{min:1,max:3,price:22000},{min:4,max:10,price:19000},{min:11,max:999,price:16500}]},
  ],
  "Medium Devices": [
    { id:"MD1", name:"Ultrasound Machine (Portable)", unit:"per unit",
      tiers:[{min:1,max:3,price:36000},{min:4,max:10,price:31000},{min:11,max:999,price:26000}]},
    { id:"MD2", name:"Defibrillator (AED+Manual)", unit:"per unit",
      tiers:[{min:1,max:5,price:8500},{min:6,max:15,price:7400},{min:16,max:999,price:6300}]},
    { id:"MD3", name:"12-Lead ECG System", unit:"per unit",
      tiers:[{min:1,max:5,price:4800},{min:6,max:20,price:4200},{min:21,max:999,price:3600}]},
    { id:"MD4", name:"Infusion Pump (Volumetric)", unit:"per unit",
      tiers:[{min:1,max:10,price:3600},{min:11,max:30,price:3100},{min:31,max:999,price:2600}]},
    { id:"MD5", name:"Hematology Analyzer (5-Part)", unit:"per unit",
      tiers:[{min:1,max:2,price:18000},{min:3,max:6,price:16000},{min:7,max:999,price:14000}]},
  ],
  "Small Devices": [
    { id:"SD1", name:"Pulse Oximeter", unit:"per unit",
      tiers:[{min:1,max:20,price:155},{min:21,max:100,price:125},{min:101,max:9999,price:98}]},
    { id:"SD2", name:"Blood Glucose Meter", unit:"per unit",
      tiers:[{min:1,max:20,price:85},{min:21,max:100,price:68},{min:101,max:9999,price:52}]},
    { id:"SD3", name:"Nebulizer (Compressor)", unit:"per unit",
      tiers:[{min:1,max:20,price:210},{min:21,max:100,price:175},{min:101,max:9999,price:145}]},
    { id:"SD4", name:"Digital Thermometer", unit:"per unit",
      tiers:[{min:1,max:50,price:28},{min:51,max:200,price:22},{min:201,max:9999,price:16}]},
    { id:"SD5", name:"Digital Blood Pressure Monitor", unit:"per unit",
      tiers:[{min:1,max:20,price:180},{min:21,max:100,price:150},{min:101,max:9999,price:120}]},
  ],
  "Consumables": [
    { id:"CO1", name:"Latex Exam Gloves", unit:"per box (100 pcs)",
      tiers:[{min:1,max:50,price:12},{min:51,max:200,price:9.5},{min:201,max:9999,price:7.5}]},
    { id:"CO2", name:"Disposable Syringes", unit:"per box (100 pcs)",
      tiers:[{min:1,max:50,price:16},{min:51,max:200,price:13},{min:201,max:9999,price:9.5}]},
    { id:"CO3", name:"IV Infusion Sets", unit:"per box (50 pcs)",
      tiers:[{min:1,max:50,price:46},{min:51,max:200,price:39},{min:201,max:9999,price:31}]},
    { id:"CO4", name:"Wound Care Kit", unit:"per kit",
      tiers:[{min:1,max:50,price:36},{min:51,max:200,price:29},{min:201,max:9999,price:23}]},
    { id:"CO5", name:"Surgical Face Masks", unit:"per box (50 pcs)",
      tiers:[{min:1,max:100,price:8},{min:101,max:500,price:6.5},{min:501,max:9999,price:5}]},
    { id:"CO6", name:"Diagnostic Rapid Test Kits", unit:"per box (25 pcs)",
      tiers:[{min:1,max:50,price:55},{min:51,max:200,price:46},{min:201,max:9999,price:38}]},
  ]
};


const S = window.MedCoreSecurity;
const cart = {};
let activeCategory = Object.keys(PRODUCTS)[0];
function byId(id){ return document.getElementById(id); }
function fmt(n){ return 'KES '+Number(n).toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2}); }
function getPrice(product, qty){ if(!qty||qty<1) return product.tiers[0].price; for(const t of product.tiers){ if(qty>=t.min && qty<=t.max) return t.price; } return product.tiers[product.tiers.length-1].price; }
function getTierLabel(t){ return t.max>=9000 ? `${t.min}+` : t.min===t.max ? `${t.min}` : `${t.min}–${t.max}`; }
function getProductById(id){ for(const cat of Object.values(PRODUCTS)){ const p=cat.find((x)=>x.id===id); if(p) return p; } }
function getProductCategory(id){ return Object.entries(PRODUCTS).find(([,ps])=>ps.find((x)=>x.id===id))?.[0] || ''; }
function renderProducts(){
  const tabsEl = byId('catTabs'); S.clear(tabsEl);
  Object.keys(PRODUCTS).forEach((cat)=>{ const tab=S.el('button',{className:`cat-tab${cat===activeCategory?' active':''}`, type:'button', text:cat}); tab.addEventListener('click',()=>{activeCategory=cat; renderProducts();}); tabsEl.append(tab); });
  const tableEl = byId('productTable'); S.clear(tableEl);
  const table=S.el('table',{className:'products-table'}); const thead=S.el('thead'); const hr=S.el('tr'); ['Product','Volume Pricing Tiers','Quantity','Unit Price','Line Total',''].forEach((h,i)=>hr.append(S.el('th',{className:i===1?'hide-mobile':'', text:h}))); thead.append(hr); table.append(thead);
  const tbody=S.el('tbody');
  PRODUCTS[activeCategory].forEach((p)=>{ const qty=cart[p.id]||0; const price=getPrice(p,qty); const total=qty*price; const row=S.el('tr',{id:`row-${p.id}`});
    const nameCell=S.el('td'); nameCell.append(S.el('div',{className:'prod-name',text:p.name}), S.el('div',{className:'prod-unit',text:p.unit})); row.append(nameCell);
    const tiersCell=S.el('td',{className:'hide-mobile'}); const tiers=S.el('div',{className:'tiers'}); p.tiers.forEach((t)=>tiers.append(S.el('span',{className:`tier${qty>=t.min&&qty<=t.max?' active-tier':''}`,text:`${getTierLabel(t)}: ${fmt(t.price)}`}))); tiersCell.append(tiers); row.append(tiersCell);
    const qtyInput=S.el('input',{className:'qty-input',type:'number',min:'0',value:qty||'',placeholder:'0'}); qtyInput.id=`qty-${p.id}`; qtyInput.addEventListener('input',()=>updateQty(p.id,qtyInput.value)); qtyInput.addEventListener('change',()=>updateQty(p.id,qtyInput.value)); row.append(S.el('td',{},[qtyInput]));
    row.append(S.el('td',{},[S.el('span',{className:'unit-price',id:`up-${p.id}`,text:qty>0?fmt(price):'—'})]));
    row.append(S.el('td',{},[S.el('span',{className:'line-total',id:`lt-${p.id}`,text:qty>0?fmt(total):'—'})]));
    const add=S.el('button',{className:`add-btn${qty>0?' added':''}`,type:'button',id:`addbtn-${p.id}`,text:qty>0?'✓':'+'}); add.addEventListener('click',()=>quickAdd(p.id)); row.append(S.el('td',{},[add])); tbody.append(row);
  });
  table.append(tbody); tableEl.append(table); updateCartBar();
}
function updateQty(id, rawVal){ const qty=parseInt(rawVal,10)||0; if(qty>0) cart[id]=qty; else delete cart[id]; const p=getProductById(id); const price=getPrice(p,qty); byId(`up-${id}`).textContent=qty>0?fmt(price):'—'; byId(`lt-${id}`).textContent=qty>0?fmt(qty*price):'—'; const btn=byId(`addbtn-${id}`); btn.textContent=qty>0?'✓':'+'; btn.className='add-btn'+(qty>0?' added':''); document.querySelectorAll(`#row-${CSS.escape(id)} .tier`).forEach((el,i)=>{ el.className='tier'+(qty>=p.tiers[i].min&&qty<=p.tiers[i].max?' active-tier':''); }); updateCartBar(); }
function quickAdd(id){ const inp=byId(`qty-${id}`); if(!inp.value||parseInt(inp.value,10)===0){ inp.value=1; updateQty(id,1); } }
function updateCartBar(){ const count=Object.keys(cart).length; const total=Object.entries(cart).reduce((s,[id,q])=>{ const p=getProductById(id); return s+q*getPrice(p,q); },0); byId('cartCount').textContent=count; byId('cartBadge').textContent=count+' line'+(count!==1?'s':''); byId('cartTotal').textContent=fmt(total); byId('toStep3Btn').disabled=count===0; }
function setStep(n){ [1,2,3].forEach((i)=>{ byId(`step${i}`).style.display=i===n?'block':'none'; const s=byId(`s${i}`); s.className='step'+(i===n?' active':i<n?' done':''); }); [1,2].forEach((i)=>{ byId(`line${i}`).className='step-line'+(i<n?' done':''); }); window.scrollTo({top:0,behavior:'smooth'}); }
function validateStep1(){ const fields=[['firstName','First name','name'],['lastName','Last name','name'],['organisation','Organisation','organisation'],['facilityType','Facility type','subject'],['email','Email','email'],['phone','Phone','phone'],['country','Country','subject']]; let ok=true; fields.forEach(([id,label,pattern])=>{ const el=byId(id); const err=byId(`err-${id}`); const value=el.value.trim(); if(!value){el.classList.add('error'); err.textContent=`${label} is required.`; ok=false;} else if(!S.isValid(value,pattern)){el.classList.add('error'); err.textContent=`Enter a valid ${label.toLowerCase()}.`; ok=false;} else {el.classList.remove('error'); err.textContent='';} }); return ok; }
function goStep2(){ if(!validateStep1()) return; setStep(2); renderProducts(); }
function goStep3(){ if(Object.keys(cart).length===0) return; const d=getCustomerData(); renderReviewDetails(d); renderReviewItems(); setStep(3); }
function getCustomerData(){ return { name:`${byId('firstName').value.trim()} ${byId('lastName').value.trim()}`, org:byId('organisation').value.trim(), type:byId('facilityType').value.trim(), email:byId('email').value.trim(), phone:byId('phone').value.trim(), country:byId('country').value.trim(), delivery:byId('deliveryDate').value||'Flexible', notes:byId('notes').value.trim()||'None' }; }
function renderReviewDetails(d){ const r=byId('reviewDetails'); S.clear(r); [['Full Name',d.name],['Organisation',d.org],['Facility Type',d.type],['Email',d.email],['Phone',d.phone],['Country',d.country],['Desired Delivery',d.delivery],['Notes',d.notes]].forEach(([label,val])=>{ const f=S.el('div',{className:'review-field'}); f.append(S.el('label',{text:label}), S.el('p',{text:val})); r.append(f); }); }
function renderReviewItems(){ const body=byId('reviewItems'); S.clear(body); let subtotal=0; Object.entries(cart).forEach(([id,qty])=>{ const p=getProductById(id); const pr=getPrice(p,qty); const tot=qty*pr; subtotal+=tot; const row=S.el('tr'); row.append(S.el('td',{},[S.el('strong',{text:p.name})]), S.el('td',{className:'hide-mobile',text:getProductCategory(id)}), S.el('td',{text:qty.toLocaleString()}), S.el('td',{text:fmt(pr)}), S.el('td',{},[S.el('strong',{text:fmt(tot)})])); body.append(row); }); const listPrice=Object.entries(cart).reduce((s,[id,q])=>{ const p=getProductById(id); return s+q*p.tiers[0].price; },0); const savings=listPrice-subtotal; const savingsPct=listPrice>0?Math.round(savings/listPrice*100):0; const totals=byId('totalsBox'); S.clear(totals); const addRow=(label,val,cls='')=>{ const div=S.el('div',{className:`totals-row${cls}`}); div.append(S.el('span',{text:label}), S.el('span',{className:'totals-val',text:val})); totals.append(div); }; addRow('List Price (Tier 1)',fmt(listPrice)); if(savings>0) addRow(`Volume Discount (-${savingsPct}%)`,`-${fmt(savings)}`); addRow('Estimated Total',fmt(subtotal),' grand'); totals.append(S.el('div',{text:'All prices in KES. Excludes shipping, taxes, and installation unless quoted separately.'})); totals.lastChild.style.cssText='font-size:12px;color:var(--text-light);margin-top:10px;'; }
function submitQuote(){ const d=getCustomerData(); let body='MEDCORE SOLUTIONS — QUOTE REQUEST\n'; body+='='.repeat(50)+'\n\n'; body+=`CUSTOMER DETAILS\n${'-'.repeat(30)}\nName:           ${d.name}\nOrganisation:   ${d.org}\nFacility Type:  ${d.type}\nEmail:          ${d.email}\nPhone:          ${d.phone}\nCountry:        ${d.country}\nDelivery Date:  ${d.delivery}\nNotes:          ${d.notes}\n\nREQUESTED PRODUCTS\n${'-'.repeat(30)}\n`; let subtotal=0; Object.entries(cart).forEach(([id,qty])=>{ const p=getProductById(id); const pr=getPrice(p,qty); const tot=qty*pr; subtotal+=tot; body+=`• ${p.name} (${p.unit})\n  Qty: ${qty}  |  Unit Price: ${fmt(pr)}  |  Line Total: ${fmt(tot)}\n`; }); body+=`\n${'='.repeat(50)}\nESTIMATED TOTAL: ${fmt(subtotal)}\n(Prices indicative — subject to final confirmation)\n\nPlease respond within 24 business hours with a formal proposal.\n`; const ref='MC-'+Math.random().toString(36).substr(2,6).toUpperCase(); window.location.href=`mailto:sales@medcoresolutions.com?subject=${encodeURIComponent(`Quote Request — ${d.org} [${ref}]`)}&body=${encodeURIComponent(body)}`; setTimeout(()=>{ byId('step3').style.display='none'; byId('stepper').style.display='none'; byId('successScreen').style.display='block'; byId('refNumber').textContent=ref; },600); }
document.addEventListener('DOMContentLoaded',()=>{ byId('nextStepBtn')?.addEventListener('click',goStep2); byId('backStep1Btn')?.addEventListener('click',()=>setStep(1)); byId('toStep3Btn')?.addEventListener('click',goStep3); byId('editProductsBtn')?.addEventListener('click',()=>{setStep(2); renderProducts();}); byId('submitQuoteBtn')?.addEventListener('click',submitQuote); byId('printSummaryBtn')?.addEventListener('click',()=>window.print()); renderProducts(); });
