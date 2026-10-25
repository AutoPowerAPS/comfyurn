/* Comfyurn · shop grid: rooms, type tiles, filters, sort, search. Cards open product.html */
(function(){
'use strict';
const CF=window.CF;
const {art,COL,ROOMS,TILES,TILE_TYPES,store}=CF;
const P=CF.PRODUCTS;
const $=id=>document.getElementById(id);
const roomFromHash=()=>{const h=location.hash.slice(1);return ROOMS.some(r=>r[0]===h)?h:'all'};
const initialQ=new URLSearchParams(location.search).get('q')||'';
// a search always looks across every room
const state={room:initialQ?'all':roomFromHash(),tile:null,q:initialQ,sort:'pop',price:'any',fNew:false,fOak:false,fOut:false,colour:{}};

/* ---------- price filter labels, in the shop currency ---------- */
$('price').querySelectorAll('option[value*="-"]').forEach(o=>{
  const [a,b]=o.value.split('-').map(Number);
  o.textContent=!a?`Under ${CF.money(b)}`:b>=99999?`Over ${CF.money(a)}`:`${CF.money(a)} to ${CF.money(b)}`;
});

/* ---------- type tiles ---------- */
const card='var(--card)';
$('tiles').innerHTML=TILES.map(([k,l])=>`<button class="tile" type="button" data-tile="${CF.esc(k)}" aria-pressed="false"><div class="ti">${art(k,card)}</div><span>${CF.esc(l)}</span></button>`).join('');

/* ---------- render ---------- */
const cardIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');cardIO.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px'});
function list(){
  const r=P.filter(p=>{
    if(state.room!=='all'&&p.room!==state.room)return false;
    if(state.tile&&!TILE_TYPES[state.tile].includes(p.type))return false;
    if(state.fNew&&!p.isNew)return false;
    if(state.fOak&&!p.tags.includes('oak'))return false;
    if(state.fOut&&!p.tags.includes('out'))return false;
    if(state.price!=='any'){const[a,b]=state.price.split('-').map(Number);if(p.price<a||p.price>=b)return false}
    if(state.q){const q=state.q.toLowerCase();if(!(p.name+' '+p.desc+' '+p.type+' '+p.room).toLowerCase().includes(q))return false}
    return true;
  });
  const by={pop:(a,b)=>a.pop-b.pop,low:(a,b)=>a.price-b.price,high:(a,b)=>b.price-a.price,new:(a,b)=>b.isNew-a.isNew||a.pop-b.pop,rate:(a,b)=>b.rate-a.rate||b.rev-a.rev}[state.sort];
  return r.sort(by);
}
function render(){
  const items=list();
  $('results').textContent=items.length+(items.length===1?' product':' products');
  $('title').textContent=state.tile?TILES.find(t=>t[0]===state.tile)[1]:state.q?`Results for "${state.q}"`:CF.roomLabel(state.room);
  $('crumb').textContent=$('title').textContent;
  CF.header.setActive(state.tile||state.q?'':state.room);
  cardIO.disconnect();   // old cards are about to be replaced; stop watching them
  if(!items.length){$('grid').innerHTML=`<div class="empty"><h2>Nothing matches yet.</h2><p>Try fewer filters, or search for sofa, oak or linen.</p></div>`;return}
  $('grid').innerHTML=items.map(p=>{
    const c=state.colour[p.id]||p.cols[0];
    const url=CF.productUrl(p);
    const stock=CF.stock(p);
    // a sale ends, so it outranks New
    const off=CF.off(p);
    const badge=off?`<span class="badge sale">${off}% off</span>`:p.isNew?'<span class="badge">New</span>':stock.badge?`<span class="badge low">${CF.esc(stock.badge)}</span>`:'';
    return `<article class="card" data-id="${CF.esc(p.id)}">
      <div class="ph"><a class="phlink" href="${url}" aria-label="View ${CF.esc(p.name)}, ${CF.esc(p.desc)}" tabindex="-1"></a>${badge}<button class="ib fav" type="button" data-fav="${CF.esc(p.id)}" aria-pressed="${store.isSaved(p.id)}" aria-label="Save ${CF.esc(p.name)}">${CF.icons.heart}</button>${art(p.type,COL[c])}<button class="add" type="button" data-add="${CF.esc(p.id)}" aria-label="Add ${CF.esc(p.name)} to bag">${CF.icons.bagAdd}<span aria-hidden="true">Add to bag</span></button></div>
      <div class="info">
        <h2 class="name"><a href="${url}">${CF.esc(p.name)}</a></h2>
        <div class="desc">${CF.esc(p.desc)}</div>
        <div class="price">${CF.priceHTML(p.price)}${CF.wasHTML(p)}</div>
        <div class="rate">${CF.stars(p.rate)}<span>${p.rate.toFixed(1)} (${p.rev})</span><span class="vh">Rated ${p.rate} out of 5</span></div>
        ${p.cols.length>1?`<div class="sw" role="group" aria-label="Colour">${p.cols.map(k=>`<button type="button" data-sw="${CF.esc(p.id)}" data-c="${CF.esc(k)}" aria-pressed="${k===c}" aria-label="${CF.esc(CF.colourName(k))}" style="background:${COL[k]}"></button>`).join('')}</div>`:''}
        <div class="row">
          <button class="inside" type="button" data-inside="${CF.esc(p.id)}" aria-expanded="false" aria-controls="sp-${CF.esc(p.id)}">See inside <i aria-hidden="true"></i></button>
        </div>
        <div class="specs" id="sp-${CF.esc(p.id)}"><div><ul>${Object.entries(p.spec).map(([k,v])=>`<li><b>${CF.esc(k)}</b><span>${CF.esc(v)}</span></li>`).join('')}</ul></div></div>
      </div></article>`;
  }).join('');
  $('grid').querySelectorAll('.card').forEach((el,i)=>{el.style.transitionDelay=Math.min(i%4,3)*70+'ms';cardIO.observe(el)});
}

/* ---------- events ---------- */
// header category links change the hash; follow them here
// picking a room clears any search, so the two never fight
addEventListener('hashchange',()=>{state.room=roomFromHash();state.tile=null;state.q='';$('q').value='';$('tiles').querySelectorAll('.tile').forEach(x=>x.setAttribute('aria-pressed','false'));render()});
document.addEventListener('cf:search',e=>{
  state.q=e.detail;
  if(state.q){state.room='all';state.tile=null;$('tiles').querySelectorAll('.tile').forEach(x=>x.setAttribute('aria-pressed','false'));
    if(location.hash)history.replaceState(null,'',location.pathname+location.search)}
  render();
});
$('tiles').addEventListener('click',e=>{const b=e.target.closest('.tile');if(!b)return;const k=b.dataset.tile;state.tile=state.tile===k?null:k;state.room='all';
  if(location.hash)history.replaceState(null,'',location.pathname+location.search);
  $('tiles').querySelectorAll('.tile').forEach(x=>x.setAttribute('aria-pressed',x.dataset.tile===state.tile));render()});
$('sort').addEventListener('change',e=>{state.sort=e.target.value;render()});
$('price').addEventListener('change',e=>{state.price=e.target.value;render()});
['fNew','fOak','fOut'].forEach(k=>$(k).addEventListener('click',e=>{state[k]=!state[k];e.currentTarget.setAttribute('aria-pressed',state[k]);render()}));

$('grid').addEventListener('click',e=>{
  const sw=e.target.closest('[data-sw]');
  if(sw){const p=P.find(x=>x.id===sw.dataset.sw);state.colour[p.id]=sw.dataset.c;const card=sw.closest('.card');
    card.querySelector('svg.art').outerHTML=art(p.type,COL[sw.dataset.c]);card.querySelectorAll('[data-sw]').forEach(x=>x.setAttribute('aria-pressed',x===sw));return}
  const add=e.target.closest('[data-add]');
  if(add){const p=P.find(x=>x.id===add.dataset.add);if(!store.addToBag(p.id,state.colour[p.id]||p.cols[0],1)){CF.toast(CF.stock(p).kind==='out'?`${p.name} is sold out for now.`:`You already have all the ${p.name} pieces we can sell in your bag.`);return}
    add.classList.add('done');setTimeout(()=>add.classList.remove('done'),900);CF.cart.open(add);return}
  const fav=e.target.closest('[data-fav]');
  if(fav){fav.setAttribute('aria-pressed',store.toggleSaved(fav.dataset.fav));return}
  const ins=e.target.closest('[data-inside]');
  if(ins){const open=ins.getAttribute('aria-expanded')!=='true';ins.setAttribute('aria-expanded',open);$('sp-'+ins.dataset.inside).classList.toggle('open',open)}
});

render();
})();
