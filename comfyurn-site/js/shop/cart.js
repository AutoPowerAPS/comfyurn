/* Comfyurn · cart drawer shared by every shop page. Slides in from the right when the bag icon is pressed
   or a piece is added: line items with quantity and remove, order note, subtotal, then Checkout (checkout.html).
   Opens with CF.cart.open(opener). Reads and writes the bag only through CF.store. */
(function(){
'use strict';
const CF=window.CF;
const {art,COL,store}=CF;

const root=document.createElement('div');
root.className='cart';root.hidden=true;
root.innerHTML=`
  <div class="cart-scrim" data-close></div>
  <aside class="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
    <div class="cart-head">
      <h2 id="cartTitle">Your bag <span class="cart-n" id="cartN"></span></h2>
      <button class="ib" type="button" data-close aria-label="Close bag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
    </div>
    <p class="cart-perk">${CF.icons.home}<span>Delivery is included in every price.</span></p>
    <div class="cart-body" id="cartBody"></div>
    <div class="cart-foot" id="cartFoot">
      <details class="cart-note"><summary>Add order note</summary>
        <label for="cartNote" class="vh">Order note</label>
        <textarea id="cartNote" rows="3" maxlength="500" placeholder="Stairs, parking, a delivery window that suits you"></textarea>
      </details>
      <div class="cart-sub"><span>Subtotal</span><b id="cartSub"></b></div>
      <div class="cart-save" id="cartSave" hidden><span>Sale savings</span><b id="cartSaveV"></b></div>
      <p class="cart-small">Prices include ${CF.VAT}% VAT. Delivery options are chosen at checkout, and standard delivery costs nothing extra.</p>
      <a class="btn cart-go" href="checkout.html">Checkout</a>
      <button class="cart-cont" type="button" data-close>Continue shopping</button>
    </div>
  </aside>`;
document.body.appendChild(root);
const $=id=>document.getElementById(id);
const panel=root.querySelector('.cart-panel'),body=$('cartBody'),foot=$('cartFoot'),note=$('cartNote');

const key=i=>i.id+'|'+i.colour;
function lineHTML(i){
  const url=CF.productUrl(i.p),name=CF.esc(CF.colourName(i.colour)),stock=CF.stock(i.p);
  return `<li class="cl" data-k="${CF.esc(key(i))}">
    <a class="cl-ph" href="${url}" tabindex="-1" aria-hidden="true">${art(i.p.type,COL[i.colour])}</a>
    <div class="cl-info">
      <a class="cl-name" href="${url}">${i.p.name}</a>
      <div class="cl-var">${i.p.desc} · ${name}</div>
      ${stock.kind==='in'?'':`<div class="cl-stock">${stock.text}</div>`}
      ${i.qty>1?`<div class="cl-each">${CF.money(i.p.price)} each</div>`:''}
      <div class="cl-row">
        <div class="cl-qty" role="group" aria-label="Quantity of ${i.p.name}">
          <button type="button" data-act="dec" aria-label="One less ${i.p.name}">−</button>
          <output aria-live="polite">${i.qty}</output>
          <button type="button" data-act="inc" aria-label="One more ${i.p.name}" ${store.left(i.id)<=0?'disabled':''}>+</button>
        </div>
        <button class="cl-rm" type="button" data-act="rm" aria-label="Remove ${i.p.name} in ${name}">Remove</button>
      </div>
    </div>
    <div class="cl-price">${CF.money(i.total)}${CF.wasHTML(i.p,i.qty)}</div>
  </li>`;
}

function render(){
  const items=store.items(),n=store.bagCount();
  $('cartN').textContent=n?`(${n})`:'';
  foot.hidden=!items.length;
  body.innerHTML=items.length
    ?`<ul class="cl-list">${items.map(lineHTML).join('')}</ul>`
    :`<div class="cart-empty"><p>Your bag is empty.</p><a class="btn ghost sm" href="products.html">Shop all products</a></div>`;
  $('cartSub').textContent=CF.money(store.subtotal());
  const saved=items.reduce((n,i)=>n+(i.p.was?(i.p.was-i.p.price)*i.qty:0),0);
  $('cartSave').hidden=!saved;$('cartSaveV').textContent=CF.money(saved);
  if(document.activeElement!==note&&!noteDirty)note.value=store.note();
}

/* line controls: rendering replaces the buttons, so put focus back on the same control afterwards */
body.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;
  const k=b.closest('.cl').dataset.k,[id,colour]=k.split('|');
  const line=store.items().find(i=>key(i)===k);if(!line)return;
  const act=b.dataset.act;
  store.setQty(id,colour,act==='inc'?line.qty+1:act==='dec'?line.qty-1:0);
  const same=body.querySelector(`.cl[data-k="${k}"] [data-act="${act}"]`);
  (same&&!same.disabled?same:panel.querySelector('[data-close]')).focus();
});
let nt,noteDirty=false;
// saves only an edit made in this drawer, so a page that never opened the bag cannot blank the note
const saveNote=()=>{clearTimeout(nt);if(!noteDirty)return;noteDirty=false;if(note.value.trim()!==store.note())store.setNote(note.value.trim())};
note.addEventListener('input',()=>{noteDirty=true;clearTimeout(nt);nt=setTimeout(saveNote,250)});
// a pending note must not be lost to a fast Checkout click, a close or leaving the page
root.querySelector('.cart-go').addEventListener('click',saveNote);
addEventListener('pagehide',saveNote);

/* open, close, focus */
let opener=null,closeT;
const isOpen=()=>!root.hidden&&root.classList.contains('open');
function open(from){
  if(isOpen())return;
  clearTimeout(closeT);   // reopened while still sliding out
  opener=from||document.activeElement;
  render();
  root.hidden=false;
  document.documentElement.classList.add('cart-lock');
  requestAnimationFrame(()=>requestAnimationFrame(()=>root.classList.add('open')));
  panel.querySelector('[data-close]').focus();
}
function close(){
  if(!isOpen())return;
  saveNote();
  root.classList.remove('open');
  document.documentElement.classList.remove('cart-lock');
  const done=()=>{root.hidden=true};
  matchMedia('(prefers-reduced-motion:reduce)').matches?done():(closeT=setTimeout(done,420));
  if(opener&&opener.focus)opener.focus();
}
root.addEventListener('click',e=>{if(e.target.closest('[data-close]'))close()});
document.addEventListener('keydown',e=>{
  if(!isOpen())return;
  if(e.key==='Escape'){close();return}
  if(e.key!=='Tab')return;
  // keep Tab inside the drawer while it is open
  const f=[...panel.querySelectorAll('a[href],button:not([disabled]),textarea,summary')].filter(x=>x.offsetParent);
  if(!f.length)return;
  const first=f[0],last=f[f.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
});
store.on(()=>{if(!root.hidden)render()});

CF.cart={open,close};
})();
