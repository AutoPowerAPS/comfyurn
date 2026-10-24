/* Comfyurn · help button on the home and shop pages, in the spot where stores put live chat.
   Opens a small panel of common questions with answers from the site's own copy. No live agent. */
(function(){
'use strict';
const QA=[
  ['Does delivery cost extra?','No. Delivery and 13% VAT are part of every price. Before it ships we confirm the piece fits through your door and your stairs.'],
  ['How long does delivery take?','In-stock pieces arrive in 1 to 2 weeks. Made-to-order pieces take 4 to 6 weeks, and pre-orders ship after their restock date.'],
  ['How do I pay?','Cash on delivery for now, in cash or by card machine. Card and mobile wallet payments arrive with the live shop.'],
  ['What if I do not like it?','Sit on it for thirty days. If it is not right, we collect it and refund you.'],
  ['Can I see a piece before I buy?','Yes. Book a suite tour and sit on everything, lift the frames and open the drawers.'],
  ['Do you sell to businesses?','Yes. Open any product, then "Trade and bulk orders" under its specifications.']
];
const wrap=document.createElement('div');
wrap.className='help';
wrap.innerHTML=`
  <div class="help-p" id="helpP" role="dialog" aria-labelledby="helpH" hidden>
    <div class="help-head"><h2 id="helpH">Hi, how can we help?</h2><button class="help-x" type="button" aria-label="Close help">×</button></div>
    <div class="help-list">${QA.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
    <div class="help-foot"><p>Answers to common questions. There is no live agent in this demo.</p><a class="btn sm" href="index.html#book">Book a suite tour</a></div>
  </div>
  <button class="help-b" type="button" aria-expanded="false" aria-controls="helpP" aria-label="Help">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/></svg>
  </button>`;
document.body.appendChild(wrap);
const btn=wrap.querySelector('.help-b'),panel=wrap.querySelector('.help-p');
function set(open,focusBack){
  panel.hidden=!open;btn.setAttribute('aria-expanded',open);btn.setAttribute('aria-label',open?'Close help':'Help');
  if(open)panel.querySelector('summary').focus();else if(focusBack)btn.focus();
}
btn.addEventListener('click',()=>set(panel.hidden));
wrap.querySelector('.help-x').addEventListener('click',()=>set(false,true));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)set(false,true)});
document.addEventListener('pointerdown',e=>{if(!panel.hidden&&!wrap.contains(e.target))set(false)});
})();
