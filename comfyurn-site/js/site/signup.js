/* Comfyurn · "Join the list" email popup on the home and shop pages, like a store signup popup.
   Shows once per visitor, 15 seconds in, and never over another dialog or the open bag.
   Subscribing in the footer counts too. Demo: nothing is sent. */
(function(){
'use strict';
const CF=window.CF;
const KEY='cf-signup-v1';
const seen=()=>{try{return !!localStorage.getItem(KEY)}catch(e){return true}};
const markSeen=()=>{try{localStorage.setItem(KEY,'1')}catch(e){}};
CF.signupSeen=markSeen;   // footer.js calls this after a footer signup
if(seen())return;

const dlg=document.createElement('dialog');
dlg.className='signup';dlg.setAttribute('aria-labelledby','suH');
dlg.innerHTML=`
  <div class="su-img" aria-hidden="true"></div>
  <form class="su-body" id="suForm" novalidate>
    <button class="su-x" type="button" id="suX" aria-label="Close">×</button>
    <h2 id="suH">Join the Comfyurn list.</h2>
    <p>New pieces, suite events and the odd sale, about once a month.</p>
    <label class="vh" for="suName">First name</label><input id="suName" autocomplete="given-name" placeholder="First name">
    <label class="vh" for="suEmail">Email</label><input id="suEmail" type="email" autocomplete="email" placeholder="Email" aria-describedby="suMsg">
    <p class="su-msg" id="suMsg" role="status"></p>
    <button class="btn" type="submit">Join the list</button>
    <button class="su-no" type="button" id="suNo">No thanks</button>
  </form>`;
document.body.appendChild(dlg);
const $=id=>document.getElementById(id);
const close=()=>dlg.close();
$('suX').addEventListener('click',close);$('suNo').addEventListener('click',close);
dlg.addEventListener('click',e=>{if(e.target===dlg)close()});
$('suForm').addEventListener('submit',e=>{
  e.preventDefault();
  const v=$('suEmail').value.trim();
  const bad=!v?'Enter your email':!CF.emailOk(v)?'Enter a valid email':'';
  $('suMsg').textContent=bad;$('suEmail').setAttribute('aria-invalid',!!bad);
  if(bad){$('suEmail').focus();return}
  const name=$('suName').value.trim();
  $('suForm').innerHTML=`<button class="su-x" type="button" aria-label="Close">×</button><h2 tabindex="-1">Thanks${name?', '+CF.esc(name):''}.</h2><p>You are on the list. This is a demo, so nothing was sent.</p><button class="btn" type="button">Back to the shop</button>`;
  $('suForm').querySelectorAll('button').forEach(b=>b.addEventListener('click',close));
  $('suForm').querySelector('h2').focus();
});

// wait for a quiet moment: no other dialog, no open bag
function tryShow(){
  if(seen())return;
  if(document.querySelector('dialog[open]')||document.querySelector('.cart.open')||document.querySelector('.help-p:not([hidden])')){setTimeout(tryShow,8000);return}
  markSeen();dlg.showModal();$('suName').focus();
}
setTimeout(tryShow,15000);
})();
