/* Comfyurn · product detail page. Reads ?id=<product>&room=<room the visitor came from>
   and builds everything from window.CF.PRODUCTS: gallery, buy box, what is inside,
   specifications, "Style with" and "You may also like". */
(function(){
'use strict';
const CF=window.CF;
const {art,COL,PRODUCTS:P,TILE_TYPES,ABOUT,PHOTOS,store}=CF;
const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.search);
const p=P.find(x=>x.id===params.get('id'));
// the room the visitor came from drives the header, breadcrumb and Style with; default is the product's own room
const asked=params.get('room');
const room=asked&&asked!=='all'&&CF.ROOMS.some(r=>r[0]===asked)?asked:(p&&p.room);

if(!p){
  $('crumbs').innerHTML='<a href="index.html">Comfyurn</a> › <a href="products.html">All products</a>';
  $('pd').innerHTML='<div class="empty"><h1>We could not find that piece.</h1><p>It may have moved. <a href="products.html">See all products</a>.</p></div>';
  document.title='Not found | Comfyurn';
  return;
}

/* ---------- head, crumbs ---------- */
document.title=`${p.name}, ${p.desc} | Comfyurn`;
document.querySelector('meta[name="description"]').setAttribute('content',`${p.name}: ${ABOUT[p.type]||p.desc} ${CF.money(p.price)}.`);
$('top').dataset.active=room;CF.header.setActive(room);
$('crumbs').innerHTML=`<a href="index.html">Comfyurn</a> › <a href="products.html#${room}">${CF.esc(CF.roomLabel(room))}</a> › <span aria-current="page">${CF.esc(p.name)}</span>`;

/* ---------- gallery views ---------- */
// one view per colour, one "what is inside" diagram, and a room photo when we have one
// the layer list and the diagram share these rows (ui.js)
const layerRows=CF.layerRows(p);
const insideSVG=CF.insideArt(p);   // built once: the stage view, its thumbnail and the Inside band share it
const views=p.cols.map(c=>({kind:'colour',c,label:CF.colourName(c)}))
  .concat([{kind:'inside',label:'What is inside'}])
  .concat(PHOTOS[p.id]?[{kind:'photo',label:'In the suite'}]:[]);
function viewHTML(v){
  if(v.kind==='colour')return art(p.type,COL[v.c]);
  if(v.kind==='inside')return insideSVG;
  const ph=PHOTOS[p.id];
  return `<div class="photo" role="img" aria-label="The ${CF.esc(p.name)} in the Comfyurn suite" style="background-image:url(${ph.src});background-position:${ph.pos};background-size:${ph.size}"></div>`;
}
function thumbHTML(v,i){
  const inner=v.kind==='photo'?`<span class="photo" style="background-image:url(${PHOTOS[p.id].src});background-position:${PHOTOS[p.id].pos};background-size:${PHOTOS[p.id].size}"></span>`:viewHTML(v);
  return `<button class="thumb" type="button" data-view="${i}" aria-label="${CF.esc(v.label)}">${inner}</button>`;
}

/* ---------- related ---------- */
const styleWith=P.filter(x=>x.room===room&&x.id!==p.id).sort((a,b)=>a.pop-b.pop).slice(0,4);
const group=Object.values(TILE_TYPES).find(g=>g.includes(p.type))||[p.type];
const taken=new Set([p.id,...styleWith.map(x=>x.id)]);
let alsoLike=P.filter(x=>group.includes(x.type)&&!taken.has(x.id));
alsoLike=alsoLike.concat(P.filter(x=>!taken.has(x.id)&&!alsoLike.includes(x)).sort((a,b)=>Math.abs(a.price-p.price)-Math.abs(b.price-p.price))).slice(0,4);
const mini=x=>CF.tileHTML(x,{desc:true});   // the shared tile (ui.js), with description and sale price

/* ---------- page ---------- */
// suite photo crops of other pieces, this one first when it has its own
const styled=Object.entries(PHOTOS).sort((a,b)=>(b[0]===p.id)-(a[0]===p.id));
const stock=CF.stock(p),feats=CF.feats(p),off=CF.off(p);
const addLabel=stock.kind==='eta'?'Pre-order':'Add to bag';
const warranty=p.spec.Warranty||'';
const specRows=CF.specRows(p);
const care=CF.care(p);
const trial=CF.trial(p);

$('pd').innerHTML=`
<section class="pd-top">
  <div class="gallery">
    <div class="stage-wrap">
      <div class="stage" id="stage" aria-live="polite"></div>
      ${feats.length?`<ul class="feats" aria-label="Features">${feats.map(f=>`<li>${CF.esc(f)}</li>`).join('')}</ul>`:''}
    </div>
    <div class="thumbs" id="thumbs" aria-label="Views">${views.map(thumbHTML).join('')}</div>
  </div>
  <div class="buy">
    ${p.isNew?'<span class="badge">New</span>':''}
    <h1 class="pd-name">${CF.esc(p.name)}</h1>
    <p class="pd-desc">${CF.esc(p.desc)}</p>
    <a class="rate" href="#reviews">${CF.stars(p.rate)}<span>${p.rate.toFixed(1)} · ${p.rev} reviews</span></a>
    <div class="pd-price">${CF.priceHTML(p.price)}${CF.wasHTML(p)}${off?`<span class="off">${off}% off</span>`:''}</div>
    <p class="mono pd-incl">VAT and delivery included</p>
    ${p.cols.length>1?`<div class="opt"><div class="opt-l">Colour: <b id="cname">${CF.esc(CF.colourName(p.cols[0]))}</b></div>
      <div class="sw big" role="group" aria-label="Colour">${p.cols.map((k,i)=>`<button type="button" data-c="${CF.esc(k)}" aria-pressed="${i===0}" aria-label="${CF.esc(CF.colourName(k))}" style="background:${COL[k]}"></button>`).join('')}</div></div>`
      :`<div class="opt"><div class="opt-l">Colour: <b>${CF.esc(CF.colourName(p.cols[0]))}</b></div></div>`}
    <p class="stock ${stock.kind}"><i aria-hidden="true"></i>${CF.esc(stock.text)}</p>
    <div class="buyrow">
      <div class="qty" role="group" aria-label="Quantity">
        <button type="button" id="minus" aria-label="One less">−</button><output id="qty" aria-live="polite">1</output><button type="button" id="plus" aria-label="One more">+</button>
      </div>
      <button class="btn addbig" id="addBtn" type="button">${addLabel}</button>
      <button class="ib fav big" id="saveBtn" type="button" aria-pressed="${store.isSaved(p.id)}" aria-label="Save ${CF.esc(p.name)}">${CF.icons.heart}</button>
    </div>
    <ul class="perks">
      <li>${CF.esc(trial)} at home to decide</li>
      ${warranty?`<li>Warranty: ${CF.esc(warranty)}</li>`:''}
      <li>We check it fits your door before it ships</li>
    </ul>
    <div class="spec-links">
      <a class="spec-link" href="#specs">Product specifications <span aria-hidden="true">↓</span></a>
      <a class="spec-link" href="spec.html?id=${encodeURIComponent(p.id)}" target="_blank" rel="noopener">Download spec sheet <span aria-hidden="true">↗</span></a>
    </div>
  </div>
</section>

${layerRows.length?`<section class="pd-sec pd-inside dark">
  <div class="pi-in">
    <div class="mono">Nothing hidden</div>
    <h2>What is <em>inside</em> the ${CF.esc(p.name)}.</h2>
    <div class="inside-grid">
      <div class="inside-art" id="pdArt">${insideSVG}</div>
      <div>
        <div class="ltabs" id="pdLayers" role="tablist" aria-label="Layers of the ${CF.esc(p.name)}" aria-orientation="vertical">${layerRows.map(([k],i)=>`<button type="button" role="tab" id="pl-${i}" aria-selected="${i===0}" aria-controls="pdLayerPanel" data-i="${i}"${i?' tabindex="-1"':''}><span class="n">${String(i+1).padStart(2,'0')}</span><span class="lt-name">${CF.esc(k)}</span></button>`).join('')}</div>
        <div class="lpanel" id="pdLayerPanel" role="tabpanel" aria-labelledby="pl-0" tabindex="0">${layerRows.map(([k,v],i)=>`<div data-i="${i}"><h3>${CF.esc(k)}</h3><p>${CF.esc(v)}</p></div>`).join('')}</div>
      </div>
    </div>
  </div>
</section>`:''}

<section class="pd-sec pd-specs" id="specs">
  <div class="mono">Specifications</div>
  <h2>The numbers.</h2>
  <div class="spec-grid">
    <table class="spec-table"><caption class="vh">${CF.esc(p.name)} specifications</caption><tbody>
      ${specRows.map(([k,v])=>`<tr><th scope="row">${CF.esc(k)}</th><td>${CF.esc(v)}</td></tr>`).join('')}
    </tbody></table>
    <div class="acc">
      <details open><summary>About this piece</summary><p>${CF.esc(ABOUT[p.type]||p.desc)}</p></details>
      <details><summary>Care</summary><p>${CF.esc(care)}</p></details>
      <details><summary>Delivery and returns</summary><p>Delivery and showroom costs are part of the price, not a surprise at checkout. Before it ships we confirm it fits through your door and stairs. Live with it for ${CF.esc(trial.toLowerCase())}. If it is not right, we collect it and refund you.</p></details>
      <details id="trade"><summary>Trade and bulk orders</summary><div id="tradeBody"></div></details>
    </div>
  </div>
</section>

${styleWith.length?`<section class="pd-sec"><div class="row-head"><div><div class="mono">${CF.esc(CF.roomLabel(room))}</div><h2>Style with.</h2></div><a class="spec-link" href="products.html#${room}">Shop the room →</a></div><div class="minis">${styleWith.map(mini).join('')}</div></section>`:''}

<section class="pd-sec"><div class="row-head"><div><div class="mono">More like this</div><h2>You may also like.</h2></div><a class="spec-link" href="products.html">All products →</a></div><div class="minis">${alsoLike.map(mini).join('')}</div></section>

<section class="pd-sec" id="reviews" aria-labelledby="rvH"></section>

<section class="pd-sec usp" aria-label="Why Comfyurn">
  <a href="index.html#book"><h3>Visit the suite</h3><p>Sit on every piece and lift every frame before you buy.</p><span>Book a tour →</span></a>
  <a href="#specs"><h3>VAT and delivery included</h3><p>The price you see is the price you pay, and we check it fits your door first.</p><span>Delivery and returns →</span></a>
  <a href="#trade" id="tradeLink"><h3>Trade and bulk orders</h3><p>Furnishing a hotel, office or café? Ask about quantities and lead times.</p><span>Send an enquiry →</span></a>
</section>

${styled.length?`<section class="pd-sec"><div class="row-head"><div><div class="mono">As styled</div><h2>In the Comfyurn suite.</h2></div><a class="spec-link" href="index.html#rooms">Shop by room →</a></div>
  <div class="styled">${styled.map(([id,ph])=>{const x=P.find(q=>q.id===id);return `<a class="st" href="${CF.productUrl(x)}"><span class="st-ph" role="img" aria-label="The ${CF.esc(x.name)} in the suite" style="background-image:url(${ph.src});background-position:${ph.pos};background-size:${ph.size}"></span><span class="st-n">${CF.esc(x.name)}</span></a>`}).join('')}</div></section>`:''}`;
// Inside band: picking a layer tab shows its text and dims the other layers of the drawing (tabs.js)
if(layerRows.length)CF.tabs($('pdLayers'),(i,tab,first)=>{if(!first)$('pdArt').dataset.pick=i},$('pdLayerPanel'));
// reviews.js fills #reviews and trade.js fills #tradeBody from this
CF.current={p};
// the trade link opens its fold-out before jumping to it
$('tradeLink').addEventListener('click',()=>{$('trade').open=true});

/* ---------- behaviour ---------- */
let colour=p.cols[0],qty=1;
const stage=$('stage');
function show(i){
  stage.innerHTML=`<div class="view">${viewHTML(views[i])}</div>`;
  $('thumbs').querySelectorAll('.thumb').forEach((t,n)=>t.setAttribute('aria-pressed',n===i));
}
show(0);
$('thumbs').addEventListener('click',e=>{
  const t=e.target.closest('.thumb');if(!t)return;
  const i=+t.dataset.view;
  if(views[i].kind==='colour')setColour(views[i].c,false);
  show(i);
});
function setColour(c,moveView){
  colour=c;
  if($('cname'))$('cname').textContent=CF.colourName(c);
  document.querySelectorAll('.sw.big button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c===c));
  if(moveView!==false)show(views.findIndex(v=>v.kind==='colour'&&v.c===c));
}
document.querySelectorAll('.sw.big button').forEach(b=>b.addEventListener('click',()=>setColour(b.dataset.c)));
// the stepper and button follow what is left after the bag: stock minus every colour already in it
let canAdd=store.left(p.id),flash=false;
const setQty=n=>{qty=Math.max(1,Math.min(Math.max(canAdd,1),n));$('qty').textContent=qty;$('minus').disabled=qty===1;$('plus').disabled=qty>=canAdd};
function syncBuy(){
  canAdd=store.left(p.id);setQty(qty);
  const b=$('addBtn');b.disabled=!canAdd;
  if(!flash)b.textContent=canAdd?addLabel:stock.kind==='out'?'Sold out':'All in your bag';
}
$('minus').addEventListener('click',()=>setQty(qty-1));
$('plus').addEventListener('click',()=>setQty(qty+1));
syncBuy();store.on(syncBuy);
$('addBtn').addEventListener('click',()=>{
  const b=$('addBtn'),asked=qty;
  const n=store.addToBag(p.id,colour,asked);
  if(!n){CF.toast(`You already have all the ${p.name} pieces we can sell in your bag.`);return}
  if(n<asked)CF.toast(`Only ${n} more could be added. That is all the stock we have.`);
  flash=true;b.textContent='Added';b.classList.add('done');
  setTimeout(()=>{flash=false;b.classList.remove('done');syncBuy()},1400);
  CF.cart.open(b);
});
$('saveBtn').addEventListener('click',e=>e.currentTarget.setAttribute('aria-pressed',store.toggleSaved(p.id)));
})();
