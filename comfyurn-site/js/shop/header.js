/* Comfyurn · shop header shared by every shop page.
   Full at the top; after scrolling it condenses to menu, logo, search, saved and bag (js/site/condense.js).
   The menu button (shown only when condensed) opens the room links the condensed bar hides.
   Also owns the shared icons (CF.icons) and the toast. Pages mark themselves with <body data-page="shop|product">. */
(function(){
'use strict';
const CF=window.CF;
const top=document.getElementById('top');
const onShop=document.body.dataset.page==='shop';
const heartPath='<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>';
const ic=CF.icons={
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  heart:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true">${heartPath}</svg>`,
  bag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
  bagAdd:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8M12 11.5v5M9.5 14h5"/></svg>',
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11l8-6 8 6v8H4z"/><path d="M10 19v-5h4v5"/></svg>',
  truck:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6.5h11v9H3zM14 9.5h3.6l3.4 3.4v2.6h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path class="m1" d="M4 7h16"/><path class="m2" d="M4 12h16"/><path class="m3" d="M4 17h16"/></svg>'
};
const roomLinks=CF.ROOMS.map(([k,l])=>`<a class="cat" href="products.html${k==='all'?'':'#'+k}" data-room="${k}">${l}</a>`).join('');
top.innerHTML=`
  <div class="announce" id="announce"><p>VAT and delivery included on every piece<span aria-hidden="true"> · </span><a href="index.html#book">Book a suite tour</a><button class="an-x" type="button" aria-label="Hide this message"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></p></div>
  <div class="bar1">
    <button class="ib menu" id="menuBtn" type="button" aria-expanded="false" aria-controls="menuPanel" aria-label="Open menu" tabindex="-1">${ic.menu}</button>
    <a class="brand" href="index.html" aria-label="Comfyurn home">
      <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 13h18v4a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3z M10 20v5M22 20v5M7 13a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3" fill="none" stroke="#1F7A80" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      comfyurn
    </a>
    <form class="search" role="search" action="products.html" id="searchForm">
      <label for="q" class="vh">Search products</label>
      ${ic.search}
      <input id="q" name="q" type="search" placeholder="What are you looking for?" autocomplete="off">
    </form>
    <div class="icons">
      <button class="an-tab" type="button" aria-controls="announce" aria-expanded="true">${ic.truck}<span>VAT and delivery included</span></button>
      <a class="ib" id="favBtn" href="saved.html" aria-label="Saved items">${ic.heart}<span class="count" id="favCount">0</span></a>
      <button class="ib" id="bagBtn" type="button" aria-label="Bag">${ic.bag}<span class="count" id="bagCount">0</span></button>
    </div>
  </div>
  <div class="catwrap"><nav class="cats" aria-label="Product categories" id="cats">${roomLinks}</nav></div>
  <div class="menu-panel" id="menuPanel" hidden>
    <nav aria-label="Shop menu">
      <div class="mono">Shop by room</div>
      <div class="menu-links">${roomLinks}</div>
    </nav>
  </div>`;

/* active category, mirrored in the bar and the menu */
CF.header={setActive(room){top.querySelectorAll('.cat').forEach(a=>{
  if(a.dataset.room===room)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
})}};
CF.header.setActive(top.dataset.active||'all');

/* search: live on the shop page, otherwise it opens the shop with ?q= */
const q=document.getElementById('q');
const params=new URLSearchParams(location.search);
if(params.get('q'))q.value=params.get('q');
let qt;
const sendSearch=()=>document.dispatchEvent(new CustomEvent('cf:search',{detail:q.value.trim()}));
q.addEventListener('input',()=>{if(!onShop)return;clearTimeout(qt);qt=setTimeout(sendSearch,160)});
document.getElementById('searchForm').addEventListener('submit',e=>{if(onShop){e.preventDefault();sendSearch()}});

/* toast */
const toastEl=document.createElement('div');
toastEl.className='toast';toastEl.setAttribute('role','status');toastEl.setAttribute('aria-live','polite');
toastEl.innerHTML='<span></span><a href="index.html#book">Book a tour</a>';
document.body.appendChild(toastEl);
let toastT;
CF.toast=msg=>{toastEl.firstChild.textContent=msg;toastEl.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>toastEl.classList.remove('show'),2800)};

/* counts follow the store */
const bagCount=document.getElementById('bagCount'),favCount=document.getElementById('favCount'),bagBtn=document.getElementById('bagBtn'),favBtn=document.getElementById('favBtn');
let lastBag=-1,lastFav=-1;
function setCount(el,n,last){el.textContent=n;el.classList.toggle('on',n>0);if(last>=0&&n!==last){el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump')}}
function counts(){
  const b=CF.store.bagCount(),f=CF.store.savedIds().length;
  setCount(bagCount,b,lastBag);setCount(favCount,f,lastFav);lastBag=b;lastFav=f;
  bagBtn.setAttribute('aria-label','Bag, '+b+(b===1?' item':' items'));
  favBtn.setAttribute('aria-label','Saved items, '+f);
}
CF.store.on(counts);counts();
// the drawer itself lives in cart.js, which loads after this file
bagBtn.addEventListener('click',e=>CF.cart.open(e.currentTarget));

/* condensing bar and its menu: shared with the home nav (js/site/condense.js).
   The header is sticky, so its height change moves scrollY; the settle lock keeps it from flipping on and off. */
const menuBtn=document.getElementById('menuBtn'),panel=document.getElementById('menuPanel');
const catwrap=top.querySelector('.catwrap'),anTab=top.querySelector('.an-tab');
const bar=CF.condenseNav({nav:top,btn:menuBtn,panel,folded:[catwrap,anTab],settle:true,
  menuFirst:()=>panel.querySelector('.cat[aria-current]')||panel.querySelector('a'),
  fullFirst:()=>catwrap.querySelector('.cat[aria-current]')||catwrap.querySelector('a')});
const MINI_OFF=bar.MINI_OFF;

/* announcement bar: folds away after 10 s on screen or on its close button, and stays folded for the visit.
   The timer pauses while the pointer or focus is on the bar, or the tab is hidden, so nobody loses it unseen. If the 10 s run out
   while the visitor is scrolled down, the fold waits until they are back at the top, so the page never jumps mid-read.
   Once folded, a button in the full header's icon row brings it back; reopened, it stays until closed. */
const an=top.querySelector('.announce'),anX=an.querySelector('.an-x'),AN_KEY='cf-announce',AN_SHOW=10000;
let anT,anLeft=AN_SHOW,anStart=0,anOn=false,anAuto=true,anDue=false;
const anBusy=()=>an.matches(':hover')||an.contains(document.activeElement);
const anFold=()=>{if(scrollY>MINI_OFF||anBusy())anDue=true;else hideAnnounce(false)};
const anRun=()=>{if(anOn||!anAuto)return;if(anDue)return anFold();anOn=true;anStart=performance.now();anT=setTimeout(()=>{anOn=false;anLeft=0;anFold()},anLeft)};
const anPause=()=>{if(!anOn)return;anOn=false;clearTimeout(anT);anLeft=Math.max(0,anLeft-(performance.now()-anStart))};
function setAnnounce(open){
  an.classList.toggle('gone',!open);an.inert=!open;
  top.classList.toggle('an-off',!open);
  anTab.setAttribute('aria-expanded',open);
  try{open?sessionStorage.removeItem(AN_KEY):sessionStorage.setItem(AN_KEY,'hidden')}catch(e){}
}
function hideAnnounce(fromUser){
  if(an.classList.contains('gone'))return;
  anPause();anAuto=false;anDue=false;removeEventListener('scroll',anAtTop);
  const hadFocus=fromUser&&an.contains(document.activeElement),toTab=hadFocus&&!bar.isMini();
  // keep keyboard users in place: the tab takes over the focus the close button had,
  // and appears at once (no slide-in) so the focus ring is never on a zero-width button
  if(toTab)top.classList.add('an-instant');
  setAnnounce(false);
  if(hadFocus)(toTab?anTab:menuBtn).focus();
  if(toTab)requestAnimationFrame(()=>requestAnimationFrame(()=>top.classList.remove('an-instant')));
}
anX.addEventListener('click',()=>hideAnnounce(true));
anTab.addEventListener('click',()=>{an.classList.remove('instant');setAnnounce(true);anX.focus()});
an.addEventListener('pointerenter',anPause);an.addEventListener('pointerleave',()=>{if(!an.contains(document.activeElement))anRun()});
an.addEventListener('focusin',anPause);an.addEventListener('focusout',e=>{if(!an.contains(e.relatedTarget)&&!an.matches(':hover'))anRun()});
function anAtTop(){if(anDue&&scrollY<=MINI_OFF&&!anBusy())hideAnnounce(false)}
addEventListener('scroll',anAtTop,{passive:true});
// a background tab does not count as time on screen
document.addEventListener('visibilitychange',()=>{if(document.hidden)anPause();else if(!anBusy())anRun()});
let anWasHidden=false;try{anWasHidden=sessionStorage.getItem(AN_KEY)==='hidden'}catch(e){}
// already folded on an earlier page: show the folded state at once, with no slide-in of the reopen button
if(anWasHidden){an.classList.add('instant');top.classList.add('an-instant');anAuto=false;setAnnounce(false);requestAnimationFrame(()=>requestAnimationFrame(()=>top.classList.remove('an-instant')))}
else if(!document.hidden)anRun();

/* publish the header height so sticky toolbars sit right under it (the open menu overlays, it does not push).
   While the header animates, write it only on the toolbars that use it; the page root gets it once things settle,
   so each frame restyles two elements instead of the whole product grid. */
const bar1=top.querySelector('.bar1'),root=document.documentElement;
let hhT,sticky=[],stickyDone=false;
const hh=()=>(an.offsetHeight+bar1.offsetHeight+catwrap.offsetHeight+1)+'px';
function setHH(){
  const v=hh();
  // page scripts render the toolbars after this file runs: look until they exist (or the page has loaded), then reuse
  if(!stickyDone){sticky=[...document.querySelectorAll('.tools,.buy')];stickyDone=sticky.length>0||document.readyState==='complete'}
  for(const el of sticky)el.style.setProperty('--hh',v);
  clearTimeout(hhT);hhT=setTimeout(()=>root.style.setProperty('--hh',v),150);
}
new ResizeObserver(setHH).observe(top);
root.style.setProperty('--hh',hh());
})();
