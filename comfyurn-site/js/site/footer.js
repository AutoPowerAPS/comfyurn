/* Comfyurn · site footer shared by the home and shop pages, laid out like a store footer:
   a newsletter band, then link columns (support, shop by room, get in touch) and a base row.
   Fills <footer class="site-foot" id="foot">; the fictional-brand note already inside it stays as written,
   so it shows even without JavaScript. Room links come from CF.ROOMS (js/data/catalog.js). */
(function(){
'use strict';
const CF=window.CF||{};
const foot=document.getElementById('foot');
if(!foot)return;
const note=foot.querySelector('.foot-note');

const COLS=[
  ['Info and support',[
    ['index.html#inside','What is inside a Comfyurn'],
    ['index.html#rooms','The suite, room by room'],
    ['index.html#questions','Delivery, returns and questions'],
    ['index.html#book','Book a suite tour']
  ]],
  ['Shop',(CF.ROOMS||[['all','All products']]).map(([k,l])=>[k==='all'?'products.html':'products.html#'+k,l])]
];
const chev='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

foot.insertAdjacentHTML('afterbegin',`
  <div class="news">
    <div class="news-in">
      <p class="news-t">Join the <b>Comfyurn</b> list for new pieces and suite events, about once a month.</p>
      <form class="news-f" id="newsForm" novalidate>
        <label for="newsEmail" class="vh">Your email</label>
        <input id="newsEmail" type="email" autocomplete="email" placeholder="Your email" aria-describedby="newsMsg">
        <button class="btn" type="submit">Subscribe</button>
        <p class="news-msg" id="newsMsg" role="status" aria-live="polite"></p>
      </form>
    </div>
  </div>
  <div class="foot-cols">
    ${COLS.map(([t,links],i)=>`<div class="fcol">
      <h2><button type="button" aria-expanded="false" aria-controls="fl${i}">${t}${chev}</button><span>${t}</span></h2>
      <ul id="fl${i}">${links.map(([h,l])=>`<li><a href="${h}">${l}</a></li>`).join('')}</ul>
    </div>`).join('')}
    <div class="fcol visit">
      <h2><span>Visit the suite</span></h2>
      <p>Tell us what you are furnishing. We send the spec cards for those pieces and hold a time for you to sit on them.</p>
      <a class="btn ghost sm" href="index.html#book">Book a tour</a>
    </div>
  </div>`);
note.insertAdjacentHTML('beforebegin','<div class="foot-base"><a class="brand" href="index.html" aria-label="Comfyurn home"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 13h18v4a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3z M10 20v5M22 20v5M7 13a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3" fill="none" stroke="#1F7A80" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>comfyurn</a><span class="mono">© 2026 Comfyurn</span></div>');

/* newsletter: checks the address, then thanks the visitor (demo, nothing is sent) */
const form=document.getElementById('newsForm'),email=document.getElementById('newsEmail'),msg=document.getElementById('newsMsg');
form.addEventListener('submit',e=>{
  e.preventDefault();
  const v=email.value.trim();
  const bad=!v?'Enter your email':!CF.emailOk(v)?'Enter a valid email':'';
  form.classList.toggle('bad',!!bad);email.setAttribute('aria-invalid',!!bad);
  msg.textContent=bad||'Thanks, you are on the list. This is a demo, so nothing was sent.';
  if(bad){email.focus();return}
  email.value='';
  if(CF.signupSeen)CF.signupSeen();   // no need for the popup after signing up here
});

/* on phones each column folds behind its heading; on wider screens the lists are always open (CSS) */
foot.querySelectorAll('.fcol h2 button').forEach(b=>b.addEventListener('click',()=>{
  const open=b.getAttribute('aria-expanded')!=='true';
  b.setAttribute('aria-expanded',open);b.closest('.fcol').classList.toggle('open',open);
}));
})();
