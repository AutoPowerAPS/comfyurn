/* Comfyurn · saved items page (saved.html): every product saved with the heart, with Add to bag and Remove.
   Reads and writes only through CF.store, so the header count and other tabs stay in step. */
(function(){
'use strict';
const CF=window.CF;
const {art,COL,store}=CF;
const grid=document.getElementById('saved'),tools=document.getElementById('savedTools');

function render(){
  const items=store.savedIds().map(id=>CF.PRODUCTS.find(p=>p.id===id)).filter(Boolean);
  tools.innerHTML=items.length?`<span class="results" role="status">${items.length} saved piece${items.length>1?'s':''}</span><button class="btn sm" type="button" id="addAll">Add all to bag</button>`:'';
  if(!items.length){grid.innerHTML='<div class="empty"><h2>Nothing saved yet.</h2><p>Tap the heart on any product to keep it here. <a href="products.html">Browse all products</a>.</p></div>';return}
  grid.innerHTML=items.map(p=>{
    const url=CF.productUrl(p),stock=CF.stock(p),left=store.left(p.id),off=CF.off(p);
    return `<article class="card in" data-id="${p.id}">
      <div class="ph"><a class="phlink" href="${url}" aria-label="View ${p.name}, ${p.desc}" tabindex="-1"></a>${off?`<span class="badge sale">${off}% off</span>`:stock.badge?`<span class="badge low">${stock.badge}</span>`:''}${art(p.type,COL[p.cols[0]])}</div>
      <div class="info">
        <h2 class="name"><a href="${url}">${p.name}</a></h2>
        <div class="desc">${p.desc}</div>
        <div class="price">${CF.priceHTML(p.price)}${CF.wasHTML(p)}</div>
        <div class="saved-stock">${stock.text}</div>
        <div class="row">
          <button class="btn sm" type="button" data-add="${p.id}" ${left?'':'disabled'}>${left?'Add to bag':stock.kind==='out'?'Sold out':'All in your bag'}</button>
          <button class="saved-rm" type="button" data-rm="${p.id}" aria-label="Remove ${p.name} from saved">Remove</button>
        </div>
      </div></article>`;
  }).join('');
}
grid.addEventListener('click',e=>{
  const add=e.target.closest('[data-add]');
  if(add){
    const p=CF.PRODUCTS.find(x=>x.id===add.dataset.add);
    // adding redraws the grid, so hand the drawer the new button to return focus to
    if(store.addToBag(p.id,p.cols[0],1)){
      const card=grid.querySelector(`[data-id="${p.id}"]`),btn=card&&card.querySelector('[data-add]');
      // at the stock limit the redrawn button is disabled, so return focus to the product name instead
      CF.cart.open(btn&&!btn.disabled?btn:card?card.querySelector('.name a'):document.getElementById('main'));
    }
    return}
  const rm=e.target.closest('[data-rm]');
  if(rm){
    const next=rm.closest('.card').nextElementSibling||rm.closest('.card').previousElementSibling;
    const nextId=next&&next.dataset.id;
    store.toggleSaved(rm.dataset.rm);
    // keep keyboard focus nearby after the card disappears
    const target=nextId&&grid.querySelector(`[data-id="${nextId}"] [data-rm]`);(target||document.getElementById('main')).focus();
  }
});
tools.addEventListener('click',e=>{
  if(e.target.id!=='addAll')return;
  const added=store.savedIds().reduce((n,id)=>{const p=CF.PRODUCTS.find(x=>x.id===id);return n+(p?store.addToBag(id,p.cols[0],1):0)},0);
  if(added)CF.cart.open(document.getElementById('addAll')||document.getElementById('main'));else CF.toast('Everything saved is already in your bag, or sold out.');
});
store.on(render);
render();
})();
