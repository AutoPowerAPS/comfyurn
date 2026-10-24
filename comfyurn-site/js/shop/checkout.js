/* Comfyurn · checkout page (checkout.html). Two columns, laid out like a hosted store checkout:
   the form on the left (contact, delivery or pickup, address, delivery method, payment, place order)
   and the order summary on the right (lines, discount code, totals). On phones the summary folds into
   a bar at the top. Reads the bag from CF.store; placing an order shows a confirmation and empties the bag.
   Demo: no payment is taken and nothing leaves the browser. */
(function(){
'use strict';
const CF=window.CF;
const {art,COL,store}=CF;
const $=id=>document.getElementById(id);
const esc=CF.esc;
const money=CF.money;
const plural=(n,w)=>n+' '+w+(n===1?'':'s');

/* countries: labels, regions and postcode rules change with the country, like a real checkout */
const COUNTRIES={
  NP:{name:'Nepal',city:'City or municipality',region:'Province',post:'Postal code',postRe:/^\d{5}$/,postMode:'numeric',district:true,
    regions:['Koshi','Madhesh','Bagmati','Gandaki','Lumbini','Karnali','Sudurpashchim']},
  AU:{name:'Australia',city:'Suburb',region:'State/territory',post:'Postcode',postRe:/^\d{4}$/,postMode:'numeric',
    regions:['Australian Capital Territory','New South Wales','Northern Territory','Queensland','South Australia','Tasmania','Victoria','Western Australia']},
  NZ:{name:'New Zealand',city:'City',region:'Region',post:'Postcode',postRe:/^\d{4}$/,postMode:'numeric'},
  US:{name:'United States',city:'City',region:'State',post:'ZIP code',postRe:/^\d{5}(-\d{4})?$/,postMode:'text'}
};
// demo discount codes, percent off the subtotal
const CODES={WELCOME10:10};
const SAVE_KEY='cf-checkout-v1';
const saved=(()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')||{}}catch(e){return {}}})();

const items=store.items();
const snapshot=JSON.stringify(items.map(i=>[i.id,i.colour,i.qty]));
let stale=false,placing=false;   // placing: this tab is emptying the bag for its own order
const page=$('co');
if(!items.length){
  page.innerHTML='<div class="co-empty"><h1>Your bag is empty.</h1><p>Add a piece or two, then come back to check out.</p><a class="btn" href="products.html">Shop all products</a></div>';
  return;
}

/* ---------- form pieces ---------- */
// text field with a floating label; data-req holds the message shown when it is left empty
// small "?" toggletip, opened by hover, focus or click; used in fields and the summary
const tip=(id,about,text)=>`<span class="tip"><button class="tip-b" type="button" aria-label="More information about ${about}" aria-expanded="false" aria-controls="tip-${id}">?</button><span class="tip-t" id="tip-${id}" role="tooltip">${text}</span></span>`;
function field(id,label,o={}){
  return `<div class="f${o.cls?' '+o.cls:''}${o.tip?' has-tip':''}"${o.ship?' data-ship':''}>
    <input id="${id}" name="${id}" type="${o.type||'text'}" placeholder=" " autocomplete="${o.auto||'off'}"${o.req?` data-req="${o.req}"`:''}${o.mode?` inputmode="${o.mode}"`:''} value="${esc(saved[id]||'')}" aria-describedby="${id}-err">
    <label for="${id}">${label}</label>${o.tip?tip(id,label.toLowerCase(),o.tip):''}<p class="f-err" id="${id}-err"></p></div>`;
}
function select(id,label,opts,o={}){
  return `<div class="f sel${o.cls?' '+o.cls:''}"${o.ship?' data-ship':''}>
    <select id="${id}" name="${id}" autocomplete="${o.auto||'off'}"${o.req?` data-req="${o.req}"`:''} aria-describedby="${id}-err">${opts}</select>
    <label for="${id}">${label}</label><p class="f-err" id="${id}-err"></p></div>`;
}
// one address block, used for delivery (s) and billing (b)
function address(pre,section){
  const a=section+' ';
  return `<div class="f-grid" id="${pre}addr">
    ${select(pre+'country','Country/Region',Object.entries(COUNTRIES).map(([k,c])=>`<option value="${k}">${c.name}</option>`).join(''),{auto:a+'country',ship:true})}
    ${field(pre+'first','First name',{cls:'half',auto:a+'given-name',req:'Enter a first name'})}
    ${field(pre+'last','Last name',{cls:'half',auto:a+'family-name',req:'Enter a last name'})}
    ${field(pre+'company','Company (optional)',{auto:a+'organization',ship:true})}
    ${field(pre+'addr1','Address',{auto:a+'address-line1',req:'Enter an address',ship:true})}
    ${field(pre+'addr2','Apartment, suite, etc. (optional)',{auto:a+'address-line2',ship:true})}
    ${field(pre+'district','District',{auto:a+'address-level3',req:'Enter a district',ship:true,cls:'district'})}
    ${field(pre+'city','City',{cls:'third',auto:a+'address-level2',req:'Enter a city',ship:true})}
    <div class="f third" data-ship data-region="${pre}"></div>
    ${field(pre+'post','Postcode',{cls:'third',auto:a+'postal-code',req:'Enter a postcode',ship:true})}
  </div>`;
}
// the region box and city/postcode labels follow the chosen country
// on first build it restores the saved region; after a country change the old region no longer applies
function applyCountry(pre,changed){
  const c=COUNTRIES[$(pre+'country').value];
  const box=page.querySelector(`[data-region="${pre}"]`);
  const keep=changed?'':(saved[pre+'region']||'');
  const req=`Select a ${c.region.toLowerCase()}`;
  box.innerHTML=c.regions
    ?`<select id="${pre}region" name="${pre}region" autocomplete="${pre==='s'?'shipping':'billing'} address-level1" data-req="${req}" aria-describedby="${pre}region-err"><option value="">Choose one</option>${c.regions.map(r=>`<option${r===keep?' selected':''}>${r}</option>`).join('')}</select><label for="${pre}region">${c.region}</label><p class="f-err" id="${pre}region-err"></p>`
    :`<input id="${pre}region" name="${pre}region" placeholder=" " autocomplete="${pre==='s'?'shipping':'billing'} address-level1" data-req="Enter a ${c.region.toLowerCase()}" value="${esc(keep)}" aria-describedby="${pre}region-err"><label for="${pre}region">${c.region}</label><p class="f-err" id="${pre}region-err"></p>`;
  box.classList.toggle('sel',!!c.regions);
  box.classList.remove('bad');
  $(pre+'post').inputMode=c.postMode;
  // only Nepal asks for a district; hidden fields are skipped by validation
  $(pre+'district').closest('.f').hidden=!c.district;
  page.querySelector(`label[for="${pre}city"]`).textContent=c.city;
  page.querySelector(`label[for="${pre}post"]`).textContent=c.post;
  $(pre+'city').dataset.req='Enter a '+c.city.toLowerCase();
  $(pre+'post').dataset.req='Enter a '+c.post.toLowerCase();
}

/* ---------- order maths ---------- */
// the slowest piece sets the date: a restock date, then made to order, then in stock
const madeToOrder=items.some(i=>CF.stock(i.p).kind==='made');
const restock=items.filter(i=>CF.stock(i.p).kind==='eta').map(i=>i.p.eta).sort().pop();
// made to order can take up to six weeks; a restock date only leads when it is later than that
const madeBy=new Date(Date.now()+42*864e5).toISOString().slice(0,10);
const restockLeads=restock&&(!madeToOrder||restock>madeBy);
const leadTime=restockLeads?`Ships after ${CF.date(restock)}, when restocked pieces arrive`
  :madeToOrder?'Arrives in 4 to 6 weeks, some pieces are made to order':'Arrives in 1 to 2 weeks';
// pickup waits for the slowest piece too
const pickupWhen=restockLeads?`Ready to collect after ${CF.date(restock)}, when restocked pieces arrive`
  :madeToOrder?'Ready to collect when your made-to-order pieces are finished, about 4 to 6 weeks':'Ready to collect in 2 days';
const METHODS=[
  {id:'door',name:'Doorstep delivery',note:`${leadTime}. Two-person team, to your front door.`},
  {id:'room',name:'Room of choice and assembly',note:`${leadTime}. Carried in, built, packaging taken away.`}
];
let code='',pct=0;
const subtotal=store.subtotal();
const count=items.reduce((n,i)=>n+i.qty,0);
const totals=()=>{const off=Math.round(subtotal*pct)/100;return {off,total:subtotal-off}};

/* ---------- page ---------- */
const lines=items.map(i=>`<li class="sl">
  <div class="sl-ph">${art(i.p.type,COL[i.colour])}<span class="sl-q"><span class="vh">Quantity </span>${i.qty}</span></div>
  <div class="sl-info"><div class="sl-name">${i.p.name}</div><div class="sl-var">${i.p.desc} · ${esc(CF.colourName(i.colour))}</div></div>
  <div class="sl-price">${money(i.total)}${CF.wasHTML(i.p,i.qty)}</div></li>`).join('');
const note=store.note();

page.innerHTML=`
<button class="co-toggle" id="coToggle" type="button" aria-expanded="false" aria-controls="coSummary">
  <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg><span id="coToggleL">Show order summary</span><i aria-hidden="true"></i></span>
  <b class="js-total"></b>
</button>
<div class="co-grid">
  <section class="co-main" aria-label="Checkout">
    <form id="coForm" novalidate>
      <div class="express" aria-labelledby="exH">
        <p class="mono" id="exH">Express checkout</p>
        <div class="ex-btns"><button type="button" disabled>eSewa</button><button type="button" disabled>Khalti</button></div>
        <p class="ex-note">Wallet payments arrive with the live shop. In this demo, use cash on delivery below.</p>
        <div class="or" aria-hidden="true"><span>or</span></div>
      </div>
      <div class="co-sec">
        <div class="co-h"><h2>Contact</h2><button class="co-sign" type="button" id="signBtn" aria-expanded="false" aria-controls="signNote">Sign in</button></div>
        <p class="sign-note" id="signNote" hidden>Accounts arrive with the live shop. Until then, tick "Save this information for next time" and this browser will remember your details.</p>
        ${field('email','Email',{type:'email',auto:'email',req:'Enter an email',mode:'email',tip:'Used for your order confirmation, nothing else unless you tick the box below.'})}
        <label class="chk"><input type="checkbox" id="news" ${saved.news?'checked':''}><span>Email me about new pieces and suite events</span></label>
      </div>

      <div class="co-sec">
        <h2>Delivery</h2>
        <div class="ways" role="radiogroup" aria-label="Choose a delivery method">
          <label class="way"><input type="radio" name="way" value="ship" checked><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg><span>Delivery</span></label>
          <label class="way"><input type="radio" name="way" value="pickup"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11l8-6 8 6v8H4z"/><path d="M10 19v-5h4v5"/></svg><span>Pick up</span></label>
        </div>
        <div class="pickup" id="pickup" hidden>
          <b>Comfyurn suite</b><em>Free</em>
          <p>${pickupWhen}. We text you when it is waiting, and help you load it.</p>
        </div>
        ${address('s','shipping')}
        <div class="f-grid">
          ${field('phone','Phone',{type:'tel',auto:'tel',req:'Enter a phone number',mode:'tel',tip:'Only used to reach you about this order, for example to agree a delivery time.'})}
          ${select('access','Stairs at the address',`<option value="ground">Ground floor, no stairs</option><option value="lift">Upstairs, with a lift</option><option value="stairs">Upstairs, stairs only</option>`,{ship:true})}
        </div>
        <label class="chk"><input type="checkbox" id="remember" ${saved.email?'checked':''}><span>Save this information for next time</span></label>
      </div>

      <div class="co-sec" data-ship>
        <h2>Delivery method</h2>
        <p class="co-wait" id="methodWait">Enter your delivery address to see delivery options.</p>
        <div class="methods" id="methods" hidden>${METHODS.map((m,i)=>`<label class="method"><input type="radio" name="method" value="${m.id}"${i?'':' checked'}><span><b>${m.name}</b><small>${m.note}</small></span><em>Included</em></label>`).join('')}</div>
      </div>

      <div class="co-sec">
        <h2>Payment</h2>
        <p class="co-safe"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>Nothing you enter here leaves this browser.</p>
        <div class="methods pays" role="radiogroup" aria-label="Payment method">
          <label class="method"><input type="radio" name="pay" value="cod" checked><span><b>Cash on delivery</b><small id="codNote">Pay in cash or by card machine when it arrives.</small></span></label>
          <label class="method off"><input type="radio" name="pay" value="card" disabled><span><b>Card</b><small>Visa and Mastercard, when the live shop opens</small></span><em>Soon</em></label>
          <div class="card-mock" aria-hidden="true">
            <input disabled placeholder="Card number"><input disabled placeholder="Expiry (MM / YY)"><input disabled placeholder="Security code"><input disabled placeholder="Name on card">
          </div>
          <label class="method off"><input type="radio" name="pay" value="wallet" disabled><span><b>Mobile wallet</b><small>eSewa and Khalti, when the live shop opens</small></span><em>Soon</em></label>
        </div>
        <p class="co-sub">Demo: only cash on delivery works here, and nothing is charged or delivered.</p>
        <div class="bill" id="billChoice">
          <h3>Billing address</h3>
          <div class="methods">
            <label class="method"><input type="radio" name="bill" value="same" checked><span><b>Same as delivery address</b></span></label>
            <label class="method"><input type="radio" name="bill" value="diff"><span><b>Use a different billing address</b></span></label>
          </div>
        </div>
        <div id="billing" hidden>${address('b','billing')}</div>
      </div>

      ${note?`<div class="co-sec"><h2>Order note</h2><p class="co-sub">${esc(note)}</p></div>`:''}

      <button class="btn co-pay wait" id="payBtn" type="submit">Place order<span class="js-total"></span></button>
      <p class="co-small">By placing the order you agree that nothing will be charged or delivered. Comfyurn is a demo.</p>
      <div class="co-links"><button type="button" id="policyBtn" aria-haspopup="dialog">Terms and policies</button></div>
    </form>
  </section>

  <aside class="co-side" id="coSummary" aria-label="Order summary">
    <div class="co-side-in">
      <h2 class="vh">Order summary</h2>
      <div class="sl-wrap" id="slWrap"><ul class="sl-list" id="slList" tabindex="-1" aria-label="Items in your order">${lines}</ul></div>
      <p class="sl-more" id="slMore" hidden>Scroll for more items</p>
      <form class="code" id="codeForm" novalidate>
        <div class="f"><input id="code" name="code" placeholder=" " autocomplete="off" aria-describedby="code-err"><label for="code">Discount code</label><p class="f-err" id="code-err"></p></div>
        <button class="btn ghost sm" id="codeBtn" type="submit" disabled>Apply</button>
      </form>
      <dl class="tot">
        <div><dt>Subtotal · ${plural(count,'item')}</dt><dd>${money(subtotal)}</dd></div>
        <div id="offRow" hidden><dt>Discount <span class="tag" id="offTag"></span></dt><dd id="off"></dd></div>
        <div><dt><span id="shipL">Delivery</span>${tip('ship','delivery','Delivery and showroom costs are part of every price, not a surprise at checkout. Before it ships we confirm it fits through your door and stairs.')}</dt><dd id="shipV">Included</dd></div>
        <div class="grand"><dt>Total</dt><dd><span class="cur">${CF.CODE}</span><span class="js-total"></span></dd></div>
        <div class="vat-row"><dt>Including <span id="vatV"></span> VAT (${CF.VAT}%)</dt><dd></dd></div>
      </dl>
    </div>
  </aside>
</div>
<dialog class="policy" id="policy" aria-labelledby="policyH">
  <div class="policy-head"><h2 id="policyH">Terms and policies</h2><button class="ib" type="button" id="policyX" aria-label="Close">×</button></div>
  <div class="policy-body">
    <h3>Delivery</h3><p>Delivery and showroom costs are part of the price, not a surprise at checkout. Before you pay, we confirm the piece fits through your door and your stairs.</p>
    <h3>Returns</h3><p>Sit on it for thirty days. If it is not right, we collect it and refund you.</p>
    <h3>Privacy</h3><p>This demo keeps your bag and, if you ask it to, your details in this browser only. Nothing is sent anywhere.</p>
    <h3>Terms</h3><p>Comfyurn is a fictional brand. Orders placed here are not real: nothing is charged and nothing is delivered.</p>
  </div>
</dialog>`;

/* ---------- behaviour ---------- */
const form=$('coForm');
const visible=el=>!el.closest('[hidden]');
['s','b'].forEach(pre=>{
  if(COUNTRIES[saved[pre+'country']])$(pre+'country').value=saved[pre+'country'];
  applyCountry(pre);
  $(pre+'country').addEventListener('change',()=>{
    applyCountry(pre,true);syncMethods();
    const post=$(pre+'post');if(post.value.trim()||post.closest('.f').classList.contains('bad'))check(post);
  });
});

function paintTotals(){
  const t=totals();
  document.querySelectorAll('.js-total').forEach(el=>el.textContent=money(t.total));
  $('vatV').textContent=money(CF.vatIn(t.total));
  $('offRow').hidden=!pct;
  if(pct){$('off').textContent='−'+money(t.off);$('offTag').textContent=code}
}
paintTotals();

// delivery or pickup: pickup hides the address and delivery method, and always needs a billing address
const way=()=>form.querySelector('[name="way"]:checked').value;
function syncWay(){
  const pick=way()==='pickup';
  $('pickup').hidden=!pick;
  form.querySelectorAll('[data-ship]').forEach(el=>{if(!el.closest('#billing'))el.hidden=pick});
  // showing the delivery fields again must not bring back District for a country that has none
  if(!pick)$('sdistrict').closest('.f').hidden=!COUNTRIES[$('scountry').value].district;
  $('billChoice').hidden=pick;
  $('billing').hidden=!(pick||form.querySelector('[name="bill"]:checked').value==='diff');
  $('shipL').textContent=pick?'Pickup':'Delivery';
  $('shipV').textContent=pick?'Free':'Included';
  $('codNote').textContent=pick?'Pay in cash or by card machine when you collect it.':'Pay in cash or by card machine when it arrives.';
  syncMethods();syncReady();
}
form.querySelectorAll('[name="way"]').forEach(r=>r.addEventListener('change',syncWay));
form.querySelectorAll('[name="bill"]').forEach(r=>r.addEventListener('change',syncWay));

// delivery methods appear once the address is filled in, as on a hosted checkout
function addressReady(){
  const c=COUNTRIES[$('scountry').value];
  return ['saddr1','scity','sregion'].concat(c.district?['sdistrict']:[]).every(id=>$(id).value.trim())&&c.postRe.test($('spost').value.trim());
}
function syncMethods(){const ok=addressReady();$('methods').hidden=!ok;$('methodWait').hidden=ok}
form.addEventListener('input',e=>{
  if(/^s(addr1|district|city|region|post)$/.test(e.target.id))syncMethods();
  if(e.target.closest('.f.bad'))check(e.target);   // clear an error as soon as it is fixed
});
form.addEventListener('change',e=>{if(e.target.id==='sregion')syncMethods()});
// check a field when the shopper leaves it, but only once something is typed, so tabbing past stays quiet
form.addEventListener('focusout',e=>{const el=e.target;if(el.dataset&&el.dataset.req&&el.value.trim())check(el)});
// the button looks ready once every visible required field has something in it; it always submits, so errors can show
function syncReady(){$('payBtn').classList.toggle('wait',stale||[...form.querySelectorAll('input[data-req],select[data-req]')].filter(visible).some(el=>!el.value.trim()))}
form.addEventListener('input',syncReady);form.addEventListener('change',syncReady);
syncWay();

/* validation: messages under each field, focus moves to the first problem */
function rule(el){
  const v=el.value.trim();
  if(!v)return el.dataset.req||'';
  if(el.type==='email'&&!CF.emailOk(v))return 'Enter a valid email';
  if(el.type==='tel'&&v.replace(/\D/g,'').length<8)return 'Enter a valid phone number';
  const m=el.id.match(/^([sb])post$/);
  if(m&&!COUNTRIES[$(m[1]+'country').value].postRe.test(v))return 'Enter a valid '+COUNTRIES[$(m[1]+'country').value].post.toLowerCase();
  return '';
}
function check(el){
  const msg=rule(el),box=el.closest('.f');
  box.classList.toggle('bad',!!msg);
  el.setAttribute('aria-invalid',!!msg);
  $(el.id+'-err').textContent=msg;
  return !msg;
}
form.addEventListener('submit',e=>{
  e.preventDefault();
  if(stale){$('staleNote').focus();return}
  const fields=[...form.querySelectorAll('input[data-req],select[data-req]')].filter(visible);
  const bad=fields.filter(el=>!check(el));
  if(bad.length){bad[0].focus();return}
  place();
});

/* discount code */
$('codeForm').addEventListener('submit',e=>{
  e.preventDefault();
  const el=$('code'),v=el.value.trim().toUpperCase(),box=el.closest('.f');
  const msg=!v?'Enter a discount code':CODES[v]?'':'That code is not valid. Check the spelling and try again.';
  box.classList.toggle('bad',!!msg);el.setAttribute('aria-invalid',!!msg);$('code-err').textContent=msg;
  if(msg)return;
  code=v;pct=CODES[v];el.value='';$('codeBtn').disabled=true;paintTotals();
});
$('code').addEventListener('input',e=>{$('codeBtn').disabled=!e.target.value.trim()});

/* toggletips: hover and focus show them (CSS), a click pins one open, Escape or a click elsewhere closes it */
function closeTips(except){page.querySelectorAll('.tip.open').forEach(t=>{if(t!==except){t.classList.remove('open');t.querySelector('.tip-b').setAttribute('aria-expanded','false')}})}
page.addEventListener('click',e=>{
  const b=e.target.closest('.tip-b');const t=b&&b.closest('.tip');
  closeTips(t);
  if(t){const open=!t.classList.contains('open');t.classList.toggle('open',open);b.setAttribute('aria-expanded',open)}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeTips()});

/* long orders scroll inside the summary, with a hint until the end is reached */
const slList=$('slList'),slMore=$('slMore');
function syncMore(){const over=slList.scrollHeight>slList.clientHeight+2;slList.tabIndex=over?0:-1;slMore.hidden=!over||slList.scrollTop+slList.clientHeight>=slList.scrollHeight-4}
slList.addEventListener('scroll',syncMore,{passive:true});new ResizeObserver(syncMore).observe(slList);syncMore();

/* terms and policies */
const policy=$('policy');
$('policyBtn').addEventListener('click',()=>policy.showModal());
$('policyX').addEventListener('click',()=>policy.close());
policy.addEventListener('click',e=>{if(e.target===policy)policy.close()});   // click on the backdrop

/* the bag changed in another tab: say so and hold the order until checkout is refreshed */
store.on(()=>{
  if(stale||placing||!$('coForm'))return;
  if(JSON.stringify(store.items().map(i=>[i.id,i.colour,i.qty]))===snapshot)return;
  stale=true;
  form.insertAdjacentHTML('afterbegin','<div class="stale" id="staleNote" role="alert" tabindex="-1"><b>Your bag changed in another tab.</b> <button type="button" class="btn sm" id="staleBtn">Refresh checkout</button></div>');
  $('staleBtn').addEventListener('click',()=>location.reload());
  $('payBtn').classList.add('wait');
});

/* sign in: explains that accounts come with the live shop */
$('signBtn').addEventListener('click',e=>{const open=$('signNote').hidden;$('signNote').hidden=!open;e.currentTarget.setAttribute('aria-expanded',open)});

/* phone summary toggle */
const tog=$('coToggle'),side=$('coSummary');
tog.addEventListener('click',()=>{
  const open=tog.getAttribute('aria-expanded')!=='true';
  tog.setAttribute('aria-expanded',open);side.classList.toggle('open',open);
  $('coToggleL').textContent=open?'Hide order summary':'Show order summary';
});

/* ---------- place the order ---------- */
function place(){
  const val=id=>$(id)?$(id).value.trim():'';
  const pick=way()==='pickup';
  if($('remember').checked){
    const keep={news:$('news').checked};
    ['email','phone','scountry','sfirst','slast','scompany','saddr1','saddr2','sdistrict','scity','sregion','spost'].forEach(id=>keep[id]=val(id));
    try{localStorage.setItem(SAVE_KEY,JSON.stringify(keep))}catch(e){}
  }else{try{localStorage.removeItem(SAVE_KEY)}catch(e){}}

  const method=pick?null:METHODS.find(m=>m.id===form.querySelector('[name="method"]:checked').value);
  const where=pick?'Pick up at the Comfyurn suite'
    :[val('saddr1'),val('saddr2'),[val('scity'),$('sdistrict').closest('[hidden]')?'':val('sdistrict')].filter(Boolean).join(', '),[val('sregion'),val('spost')].filter(Boolean).join(' '),COUNTRIES[val('scountry')].name].filter(Boolean).map(esc).join('<br>');
  const num='CF-'+String(Date.now()).slice(-6);
  const t=totals();
  placing=true;
  items.forEach(i=>{const now=store.items().find(x=>x.id===i.id&&x.colour===i.colour);if(now)store.setQty(i.id,i.colour,now.qty-i.qty)});
  if(store.note()===note)store.setNote('');

  page.innerHTML=`<div class="co-done">
    <svg class="tick" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15 24.5l6 6 12-13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <p class="mono">Order ${num}</p>
    <h1 tabindex="-1" id="doneH">Thank you, ${esc(val('sfirst'))}.</h1>
    <p class="co-sub">Your order is confirmed. This is a demo, so nothing was charged and nothing will be delivered. A real order would send a confirmation to <b>${esc(val('email'))}</b>.</p>
    <div class="done-grid">
      <div><h3>${pick?'Pickup':'Delivery to'}</h3><p>${esc(val('sfirst'))} ${esc(val('slast'))}<br>${where}</p></div>
      <div><h3>Method</h3><p>${pick?'Pick up at the suite':method.name}<br>${pick?pickupWhen:leadTime}</p></div>
      <div><h3>Contact</h3><p>${esc(val('email'))}<br>${esc(val('phone'))}</p></div>
      <div><h3>Payment</h3><p>${pick?'Cash or card on collection':'Cash or card on delivery'}<br>Nothing is charged in this demo</p></div>
      <div><h3>Total</h3><p>${money(t.total)}${pct?` after ${code}`:''}, VAT included<br>${plural(count,'item')}</p></div>
    </div>
    <a class="btn" href="products.html">Continue shopping</a>
  </div>`;
  scrollTo(0,0);
  $('doneH').focus();
  document.title='Order confirmed | Comfyurn';
}
})();
