/* Comfyurn · customer reviews on the product page, laid out like a store review widget:
   score summary with a star breakdown, Write a review, search, sort, colour and star filters, the review list.
   Fills <section id="reviews"> that product.js leaves for it (CF.current.p). Example reviews come from
   js/data/reviews.js; reviews a visitor writes are kept in this browser only (demo, nothing is sent). */
(function(){
'use strict';
const CF=window.CF;
const box=document.getElementById('reviews');
if(!box||!CF.current)return;
const p=CF.current.p;
const KEY='cf-reviews-v1';
const esc=CF.esc;
const $=id=>document.getElementById(id);

function loadMine(){try{const list=JSON.parse(localStorage.getItem(KEY)||'{}')[p.id];return Array.isArray(list)?list.filter(r=>CF.reviewOk(r,p)):[]}catch(e){return []}}
function saveMine(list){try{const all=JSON.parse(localStorage.getItem(KEY)||'{}');all[p.id]=list;localStorage.setItem(KEY,JSON.stringify(all))}catch(e){}}
let mine=loadMine();
const examples=(CF.REVIEWS[p.id]||[]).map(r=>({...r,colour:p.cols[r.c%p.cols.length],verified:true}));
const all=()=>mine.map(r=>({...r,own:true})).concat(examples);

/* the summary uses the catalogue score and count; the breakdown is spread to match that average */
function breakdown(rate,count){
  const base={4:.15,3:.04,2:.02,1:.02};             // shape below five stars
  // .37 = how far that shape pulls the mean below 5; capped so the lower stars never exceed the count (.23 = their share)
  const f=Math.min(Math.max(0,(5-rate)/.37),1/.23);
  const n={};let used=0;
  [4,3,2,1].forEach(k=>{n[k]=Math.min(Math.round(base[k]*f*count),count-used);used+=n[k]});
  n[5]=Math.max(0,count-used);
  return n;
}
function summary(){
  const n=breakdown(p.rate,p.rev);
  mine.forEach(r=>n[r.r]++);
  const count=p.rev+mine.length;
  const avg=(p.rate*p.rev+mine.reduce((s,r)=>s+r.r,0))/count;
  return {n,count,avg};
}

/* "3 weeks ago" from a YYYY-MM-DD date */
function ago(iso){
  const days=Math.max(0,Math.round((Date.now()-new Date(iso+'T12:00:00'))/864e5));
  if(days<1)return 'Today';
  if(days<7)return days===1?'Yesterday':days+' days ago';
  if(days<30){const w=Math.round(days/7);return w===1?'1 week ago':w+' weeks ago'}
  if(days<365){const m=Math.round(days/30);return m===1?'1 month ago':m+' months ago'}
  const y=Math.round(days/365);return y===1?'1 year ago':y+' years ago';
}
const check='<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="currentColor"/><path d="m4.8 8.2 2.1 2.1 4.3-4.6" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* ---------- layout ---------- */
box.innerHTML=`
  <div class="row-head"><div><div class="mono">Customer reviews</div><h2 id="rvH">What owners say.</h2></div></div>
  <div class="rv-top">
    <div class="rv-score" id="rvScore"></div>
    <div class="rv-bars" id="rvBars" role="group" aria-label="Filter by star rating"></div>
    <div class="rv-cta"><p>Own a ${CF.esc(p.name)}? Tell other people how it lives.</p><button class="btn" type="button" id="rvWrite" aria-haspopup="dialog">Write a review</button></div>
  </div>
  <p class="rv-note">Example reviews. Comfyurn is a fictional brand, so these were written for this demo, and reviews you add stay in this browser.</p>
  <div class="rv-tools">
    <div class="rv-search"><label for="rvQ" class="vh">Search reviews</label><input id="rvQ" type="search" placeholder="Search reviews" autocomplete="off"></div>
    <label class="pill sel"><span class="vh">Sort reviews</span><select id="rvSort"><option value="rel">Most relevant</option><option value="new">Most recent</option><option value="high">Highest rating</option><option value="low">Lowest rating</option></select></label>
    ${p.cols.length>1?`<label class="pill sel"><span class="vh">Colour</span><select id="rvCol"><option value="">All colours</option>${p.cols.map(c=>`<option value="${c}">${CF.colourName(c)}</option>`).join('')}</select></label>`:''}
    <button class="pill rv-chip" type="button" id="rvStarChip" hidden></button>
  </div>
  <p class="rv-count" id="rvCount" role="status" aria-live="polite"></p>
  <ol class="rv-list" id="rvList"></ol>

  <dialog class="rv-dlg" id="rvDlg" aria-labelledby="rvDlgH">
    <form id="rvForm" novalidate>
      <div class="rv-dlg-head"><h2 id="rvDlgH">Review the ${CF.esc(p.name)}</h2><button class="ib" type="button" id="rvX" aria-label="Close">×</button></div>
      <div class="rv-dlg-body">
        <fieldset class="rv-stars-in"><legend>Your rating</legend>
          ${[1,2,3,4,5].map(k=>`<input type="radio" name="rvR" id="rvR${k}" value="${k}"><label for="rvR${k}" title="${k} star${k>1?'s':''}"><span class="vh">${k} star${k>1?'s':''}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"/></svg></label>`).join('')}
          <p class="fld-err" id="rvR-err"></p>
        </fieldset>
        ${p.cols.length>1?`<label class="fld">Colour you have<select id="rvC">${p.cols.map(c=>`<option value="${c}">${CF.colourName(c)}</option>`).join('')}</select></label>`:''}
        <label class="fld">Title<input id="rvT" maxlength="80" placeholder="Sum it up in a few words"><span class="fld-err" id="rvT-err"></span></label>
        <label class="fld">Review<textarea id="rvB" rows="4" maxlength="1200" placeholder="How does it sit, look and wear?"></textarea><span class="fld-err" id="rvB-err"></span></label>
        <div class="fld-two">
          <label class="fld">Name<input id="rvN" autocomplete="name" maxlength="40" placeholder="Shown as first name and initial"><span class="fld-err" id="rvN-err"></span></label>
          <label class="fld">Email<input id="rvE" type="email" autocomplete="email" placeholder="Never shown"><span class="fld-err" id="rvE-err"></span></label>
        </div>
        <p class="fld-small">Demo: your review is saved in this browser only and is not sent anywhere.</p>
        <button class="btn" type="submit">Post review</button>
      </div>
    </form>
  </dialog>`;

/* ---------- render ---------- */
const state={q:'',sort:'rel',col:'',star:0};
function paintSummary(){
  const s=summary();
  $('rvScore').innerHTML=`<b>${s.avg.toFixed(1)}</b><span class="rv-of">/ 5</span>${CF.stars(s.avg)}<span class="rv-total">${CF.fmt(s.count)} reviews</span>`;
  $('rvBars').innerHTML=[5,4,3,2,1].map(k=>{
    const pct=s.count?Math.round(s.n[k]/s.count*100):0;
    return `<button type="button" class="rv-bar" data-star="${k}" aria-pressed="${state.star===k}" aria-label="${k} stars: ${s.n[k]} reviews. Show only ${k} star reviews"><span>${k} ★</span><i><b style="width:${pct}%"></b></i><span>${CF.fmt(s.n[k])}</span></button>`;
  }).join('');
}
function list(){
  const q=state.q.toLowerCase();
  const r=all().filter(x=>(!state.col||x.colour===state.col)&&(!state.star||x.r===state.star)&&(!q||(x.t+' '+x.b).toLowerCase().includes(q)));
  const by={rel:(a,b)=>(!!b.own-!!a.own)||(b.r-a.r)||(b.b.length-a.b.length),new:(a,b)=>b.d.localeCompare(a.d),high:(a,b)=>b.r-a.r||b.d.localeCompare(a.d),low:(a,b)=>a.r-b.r||b.d.localeCompare(a.d)}[state.sort];
  return r.sort(by);
}
function paintList(){
  const r=list(),total=all().length;
  $('rvCount').textContent=r.length===total?`Showing all ${total} reviews written for this demo`:`Showing ${r.length} of ${total} reviews`;
  $('rvStarChip').hidden=!state.star;
  if(state.star)$('rvStarChip').innerHTML=`${state.star} stars only <span aria-hidden="true">×</span><span class="vh">, clear</span>`;
  $('rvList').innerHTML=r.length?r.map(x=>`<li class="rv">
    <div class="rv-h">${CF.stars(x.r)}<span class="vh">${esc(x.r)} out of 5 stars</span><time datetime="${esc(x.d)}">${esc(ago(x.d))}</time></div>
    <h3>${esc(x.t)}</h3>
    <div class="rv-who"><span>${esc(x.n)}</span>${x.own?'<span class="rv-own">Your review, saved in this browser</span>':`<span class="rv-ver">${check}Verified buyer</span>`}</div>
    <p>${esc(x.b)}</p>
    ${p.cols.length>1?`<div class="rv-var">Colour: ${esc(CF.colourName(x.colour))}</div>`:''}
  </li>`).join(''):`<li class="rv-none"><p>No reviews match.</p><button class="btn ghost sm" type="button" id="rvClear">Clear filters</button></li>`;
}
function paint(){paintSummary();paintList()}
paint();

/* ---------- filters ---------- */
let qt;
$('rvQ').addEventListener('input',e=>{clearTimeout(qt);qt=setTimeout(()=>{state.q=e.target.value.trim();paintList()},160)});
$('rvSort').addEventListener('change',e=>{state.sort=e.target.value;paintList()});
if($('rvCol'))$('rvCol').addEventListener('change',e=>{state.col=e.target.value;paintList()});
$('rvBars').addEventListener('click',e=>{
  const b=e.target.closest('.rv-bar');if(!b)return;
  const k=+b.dataset.star;state.star=state.star===k?0:k;paint();
  $('rvBars').querySelector(`[data-star="${k}"]`).focus();
});
$('rvStarChip').addEventListener('click',()=>{state.star=0;paint();$('rvBars').querySelector('.rv-bar').focus()});
$('rvList').addEventListener('click',e=>{
  if(e.target.id!=='rvClear')return;
  state.q='';state.col='';state.star=0;$('rvQ').value='';if($('rvCol'))$('rvCol').value='';paint();$('rvQ').focus();
});

/* ---------- write a review ---------- */
const dlg=$('rvDlg'),form=$('rvForm');
$('rvWrite').addEventListener('click',()=>{dlg.showModal();form.querySelector('input[name="rvR"]').focus()});
$('rvX').addEventListener('click',()=>dlg.close());
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});   // backdrop
function err(id,msg){$(id+'-err').textContent=msg;const el=$(id);if(el)el.setAttribute('aria-invalid',!!msg);return !msg}
form.addEventListener('submit',e=>{
  e.preventDefault();
  const r=+(form.querySelector('input[name="rvR"]:checked')||{}).value||0;
  const t=$('rvT').value.trim(),b=$('rvB').value.trim(),n=$('rvN').value.trim(),em=$('rvE').value.trim();
  const ok=[
    err('rvR',r?'':'Choose a star rating'),
    err('rvT',t?'':'Enter a title'),
    err('rvB',b.length>=20?'':b?'Tell us a little more, at least 20 characters':'Enter your review'),
    err('rvN',n?'':'Enter your name'),
    err('rvE',!em?'Enter an email':CF.emailOk(em)?'':'Enter a valid email')
  ];
  const first=['rvR1','rvT','rvB','rvN','rvE'][ok.indexOf(false)];
  if(first){$(first).focus();return}
  // shown as first name and initial, like the examples
  const parts=n.split(/\s+/);const shown=parts[0][0].toUpperCase()+parts[0].slice(1)+(parts[1]?' '+parts[1][0].toUpperCase()+'.':'');
  const today=new Date();const d=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
  mine=[{r,t,b,n:shown,d,colour:$('rvC')?$('rvC').value:p.cols[0]}].concat(mine);
  saveMine(mine);
  form.reset();dlg.close();
  state.q='';state.col='';state.star=0;state.sort='rel';$('rvQ').value='';$('rvSort').value='rel';if($('rvCol'))$('rvCol').value='';
  paint();
  const added=$('rvList').querySelector('.rv');added.classList.add('rv-new');added.setAttribute('tabindex','-1');added.focus();
  if(CF.toast)CF.toast('Thanks for your review. It is saved in this browser only.');
});
})();
