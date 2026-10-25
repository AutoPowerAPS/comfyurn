/* Comfyurn · printable spec sheet (spec.html?id=<id>). One A4 page built from the catalogue:
   name, price, colours, drawing, what is inside, specifications, about, care, delivery and returns.
   "Save as PDF" opens the browser's print dialog, where the visitor can print or save a PDF. */
(function(){
'use strict';
const CF=window.CF;
const {art,COL,ABOUT}=CF;
const $=id=>document.getElementById(id);
const p=CF.PRODUCTS.find(x=>x.id===new URLSearchParams(location.search).get('id'));

if(!p){
  $('sheet').innerHTML='<div class="sp-empty"><h1>We could not find that piece.</h1><p><a href="products.html">See all products</a></p></div>';
  return;
}
document.title=`${p.name} spec sheet | Comfyurn`;
const productUrl=new URL(CF.productUrl(p),location.href).href;
const care=CF.care(p),feats=CF.feats(p);
const today=new Date().toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'});

$('tools').innerHTML=`<a href="${CF.productUrl(p)}">← Back to the ${CF.esc(p.name)}</a><button class="btn sm" type="button" id="printBtn">Save as PDF or print</button>`;
$('printBtn').addEventListener('click',()=>print());

$('sheet').innerHTML=`
  <header class="sp-head">
    <div class="brand"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 13h18v4a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3z M10 20v5M22 20v5M7 13a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3" fill="none" stroke="#1F7A80" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>comfyurn</div>
    <div class="mono">Specification sheet · ${today}</div>
  </header>
  <section class="sp-hero">
    <div class="sp-art">${art(p.type,COL[p.cols[0]])}</div>
    <div class="sp-id">
      <div class="mono">${CF.esc(CF.roomLabel(p.room))}</div>
      <h1>${CF.esc(p.name)}</h1>
      <p class="sp-desc">${CF.esc(p.desc)}</p>
      <p class="sp-price">${CF.money(p.price)}${CF.wasHTML(p)}<span class="mono">VAT and delivery included</span></p>
      <div class="sp-cols">${p.cols.map(c=>`<span><i style="background:${COL[c]}"></i>${CF.esc(CF.colourName(c))}</span>`).join('')}</div>
      ${feats.length?`<ul class="sp-feats">${feats.map(f=>`<li>${CF.esc(f)}</li>`).join('')}</ul>`:''}
    </div>
  </section>
  <section class="sp-grid">
    <div>
      <h2>Specifications</h2>
      <table class="sp-table"><tbody>${CF.specRows(p).map(([k,v])=>`<tr><th scope="row">${CF.esc(k)}</th><td>${CF.esc(v)}</td></tr>`).join('')}</tbody></table>
    </div>
    <div>
      <h2>What is inside</h2>
      <ol class="sp-layers">${CF.layerRows(p).map(([k,v],i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><b>${CF.esc(k)}</b> ${CF.esc(v)}</li>`).join('')}</ol>
    </div>
  </section>
  <section class="sp-text">
    <div><h2>About</h2><p>${CF.esc(ABOUT[p.type]||p.desc)}</p></div>
    <div><h2>Care</h2><p>${CF.esc(care)}</p></div>
    <div><h2>Delivery and returns</h2><p>Delivery is part of the price. Before it ships we confirm it fits through your door and stairs. Live with it for ${CF.esc(CF.trial(p).toLowerCase())}; if it is not right, we collect it and refund you.</p></div>
  </section>
  <footer class="sp-foot">
    <p>${productUrl}</p>
    <p>Comfyurn is a fictional furniture and home decor brand. Products, prices and specs on this sheet are examples.</p>
  </footer>`;
})();
