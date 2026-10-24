/* Comfyurn · bag and saved items, kept in this browser so they follow the visitor across shop pages (demo, nothing is sold) */
(function(){
'use strict';
const CF=window.CF=window.CF||{};
const KEY='cf-shop-v1';
const MAX_QTY=9;   // same cap as the product page stepper
// per product: the cap, or the stock left when that is lower (CF.maxQty in ui.js)
const capFor=id=>{const p=CF.PRODUCTS&&CF.PRODUCTS.find(x=>x.id===id);return p&&CF.maxQty?CF.maxQty(p):MAX_QTY};
// a bag line must use a colour the product is sold in (stored data can be tampered with)
const sells=(id,c)=>{const p=CF.PRODUCTS&&CF.PRODUCTS.find(x=>x.id===id);return !p||p.cols.includes(c)};
// quantities are whole numbers; anything that is not a finite number counts as none
const whole=n=>typeof n==='number'&&Number.isFinite(n)?Math.floor(n):0;
let data={bag:[],saved:[],note:''};
const listeners=[];
function load(){
  let d=null,raw=null;
  try{raw=localStorage.getItem(KEY);d=JSON.parse(raw||'null')}catch(e){}
  // missing or cleared (for example by another tab): start empty rather than keep a stale bag
  const valid=d&&Array.isArray(d.bag)&&Array.isArray(d.saved);
  data=valid?Object.assign({note:''},d):{bag:[],saved:[],note:''};
  let dirty=!valid;
  // drop lines for products the catalogue no longer has, and trim lines to the stock there is now
  if(CF.PRODUCTS){
    const used={};
    data.bag=data.bag.filter(l=>{
      if(!l||typeof l!=='object'||!CF.PRODUCTS.some(p=>p.id===l.id)||!sells(l.id,l.colour)){dirty=true;return false}
      const q=Math.min(l.qty,capFor(l.id)-(used[l.id]||0));
      if(q!==l.qty){dirty=true;l.qty=q}
      used[l.id]=(used[l.id]||0)+Math.max(0,l.qty);
      if(!(l.qty>0)){dirty=true;return false}
      return true;
    });
  }
  // keep storage the same as what the page shows, so a tampered or stale bag does not linger
  if(raw!==null&&dirty)try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}
}
const inBag=id=>data.bag.filter(l=>l.id===id).reduce((n,l)=>n+l.qty,0);
// how many more of a product fit: its cap minus every colour of it already in the bag
const left=id=>Math.max(0,capFor(id)-inBag(id));
function save(){try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}emit()}
function emit(){listeners.forEach(fn=>fn())}
load();
// another tab changed the bag: pick it up
// (a null key means another tab cleared all site data)
addEventListener('storage',e=>{if(e.key===KEY||e.key===null){load();emit()}});

CF.store={
  MAX_QTY,
  on:fn=>listeners.push(fn),
  bagCount:()=>data.bag.reduce((n,l)=>n+l.qty,0),
  left,
  bagLines:()=>data.bag.slice(),
  // returns how many were actually added, which is less than asked when stock runs out
  addToBag(id,colour,qty){
    if(!sells(id,colour))return 0;
    const n=Math.min(whole(qty),left(id));
    if(n<=0)return 0;
    const line=data.bag.find(l=>l.id===id&&l.colour===colour);
    if(line)line.qty+=n;else data.bag.push({id,colour,qty:n});
    save();return n;
  },
  // 0 removes the line; the cart drawer and checkout both go through here
  setQty(id,colour,qty){
    const line=data.bag.find(l=>l.id===id&&l.colour===colour);if(!line)return;
    if(typeof qty!=='number'||!Number.isFinite(qty))return;
    qty=Math.floor(qty);
    if(qty>0)line.qty=Math.min(qty,line.qty+left(id));else data.bag=data.bag.filter(l=>l!==line);
    save();
  },
  // bag lines joined to the catalogue, with line totals; lines whose product no longer exists are skipped
  items:()=>data.bag.map(l=>{const p=CF.PRODUCTS.find(x=>x.id===l.id);return p&&{...l,p,total:p.price*l.qty}}).filter(Boolean),
  subtotal:()=>CF.store.items().reduce((n,i)=>n+i.total,0),
  note:()=>data.note||'',
  setNote(t){data.note=t;save()},
  isSaved:id=>data.saved.includes(id),
  savedIds:()=>data.saved.slice(),
  toggleSaved(id){
    data.saved=data.saved.includes(id)?data.saved.filter(x=>x!==id):data.saved.concat(id);
    save();return data.saved.includes(id);
  }
};
})();
