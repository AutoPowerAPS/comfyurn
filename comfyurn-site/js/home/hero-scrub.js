/* Comfyurn · scroll-scrubbed hero video. Engineering follows 10k-websites/references/scrub-pipeline.md */
(function(){
'use strict';
const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
const smooth=(p,e0,e1)=>{const t=clamp((p-e0)/(e1-e0),0,1);return t*t*(3-2*t)};

/* ---------- hero: split text ---------- */
function rng(seed){let s=seed>>>0;return()=>(s=(s*1664525+1013904223)>>>0)/4294967296}
const bands=[...document.querySelectorAll('.band')].map((el,n)=>{
  const h=el.querySelector('[data-split]');
  // words in reading order (CF.wordRuns); the italic part of a word stays in <em>
  const parts=[],tw=document.createTreeWalker(h,NodeFilter.SHOW_TEXT);
  for(let t;(t=tw.nextNode());)parts.push({t:t.nodeValue,em:!!t.parentElement.closest('em')});   // any depth of markup
  const words=window.CF.wordRuns(parts);
  const r=rng(11+n);
  h.setAttribute('aria-label',words.map(w=>w.map(p=>p.t).join('')).join(' '));
  h.textContent='';
  words.forEach((w,i)=>{
    const s=document.createElement('span');
    s.className='w';s.setAttribute('aria-hidden','true');
    s.style.setProperty('--th',(i/words.length*.4+r()*.04).toFixed(3));
    for(const piece of w){if(piece.em){const e=document.createElement('em');e.textContent=piece.t;s.appendChild(e)}else s.append(piece.t)}
    h.appendChild(s);
  });
  return{el,a:+el.dataset.a,b:+el.dataset.b,last:el.hasAttribute('data-last'),first:n===0,op:-1,k:-1,kb:-1,live:false};
});

/* ---------- hero: scrub ---------- */
const hero=document.getElementById('hero'),video=document.getElementById('vid'),stage=document.getElementById('stage');
const posterEl=document.getElementById('poster'),ring=document.getElementById('ring'),cue=document.getElementById('cue');
// two cuts of the same walk-through: wide for landscape screens, a 9:16 crop of the centre lane for portrait ones (phones)
const CUTS={wide:{url:'assets/video/hero-scrub.mp4',bytes:1979131,poster:'assets/images/hero-poster.webp'},
  tall:{url:'assets/video/hero-scrub-portrait.mp4',bytes:436226,poster:'assets/images/hero-poster-portrait.webp'}};
const PORTRAIT=matchMedia('(orientation: portrait)');
const cut=()=>PORTRAIT.matches?CUTS.tall:CUTS.wide;
let loadedCut=null,gen=0,ctrlNow=null;
let target=0,shown=0,rafId=null,lastTick=0,heroOnScreen=true,loadK=0,seekBusy=false,pendingTime=null,started=false,inited=false;
// the stage is 100svh, so the phone address bar sliding in and out does not shift the progress
const heroProgress=()=>{const r=hero.getBoundingClientRect();const range=hero.offsetHeight-stage.offsetHeight;return range>0?clamp(-r.top/range,0,1):0};
new IntersectionObserver(es=>{heroOnScreen=es[0].isIntersecting;if(heroOnScreen&&scrubOn&&rafId===null)rafId=requestAnimationFrame(tick)}).observe(hero);

/* pause button: holds the video on its frame while the captions keep following the scroll; play catches it up */
const pauseBtn=document.getElementById('heroPause');let paused=false;
pauseBtn.addEventListener('click',()=>{
  paused=!paused;
  pauseBtn.setAttribute('aria-pressed',paused);   // one fixed label, "Pause the video": pressed means paused
  if(!paused)requestSeek(shown*video.duration);
});

function requestSeek(t){
  if(!video.duration||paused)return;
  if(seekBusy){pendingTime=t;return}
  seekBusy=true;video.currentTime=t;
}
video.addEventListener('seeked',()=>{seekBusy=false;if(pendingTime!==null){const t=pendingTime;pendingTime=null;requestSeek(t)}});
video.addEventListener('error',()=>{seekBusy=false;pendingTime=null;stage.classList.add('video-failed')});

function updateCaptions(p){
  for(const b of bands){
    const f=Math.min(.02,(b.b-b.a)/3);
    let op=b.first?1-smooth(p,b.b-f,b.b):b.last?smooth(p,b.a,b.a+f):smooth(p,b.a,b.a+f)*(1-smooth(p,b.b-f,b.b));
    if(p>=b.b&&b.last)op=1;
    const ramp=Math.min(.025,(b.b-b.a)*.35);
    let k=clamp((p-b.a)/ramp,0,1);
    if(b.first)k=Math.max(k,loadK);
    const kb=b.last?clamp((k-.78)*5,0,1):0;
    op=Math.round(op*100)/100;k=Math.round(k*125)/125;
    if(op!==b.op){b.op=op;b.el.style.opacity=op}
    if(k!==b.k){b.k=k;b.el.style.setProperty('--k',k)}
    if(b.last&&kb!==b.kb){b.kb=kb;b.el.style.setProperty('--kb',kb)}
    const live=op>.6;
    if(live!==b.live){b.live=live;b.el.classList.toggle('live',live)}
  }
  const c=p<.04?1:0;if(cue._c!==c){cue._c=c;cue.style.opacity=c}
}
function tick(now){
  const dt=Math.min(100,now-(lastTick||now));lastTick=now;
  shown+=(target-shown)*(1-Math.pow(1-.16,dt/16.667));
  if(Math.abs(target-shown)<.0005){shown=target;rafId=null;lastTick=0}
  else if(heroOnScreen)rafId=requestAnimationFrame(tick);else rafId=null;
  requestSeek(shown*video.duration);
  updateCaptions(shown);
}
function onScroll(){target=heroProgress();if(rafId===null&&heroOnScreen)rafId=requestAnimationFrame(tick)}

async function loadHeroBlob(c){
  const my=++gen;if(ctrlNow)ctrlNow.abort();
  const ctrl=ctrlNow=new AbortController();let wd=setTimeout(()=>ctrl.abort(),20000);
  const res=await fetch(c.url,{priority:'low',signal:ctrl.signal});
  const total=Number(res.headers.get('Content-Length'))||c.bytes;
  const reader=res.body.getReader();const chunks=[];let got=0,lastRing=0;
  for(;;){
    const{done,value}=await reader.read();if(done)break;
    clearTimeout(wd);wd=setTimeout(()=>ctrl.abort(),20000);
    chunks.push(value);got+=value.length;
    const frac=Math.min(1,got/total),now=performance.now();
    if(now-lastRing>100||frac===1){lastRing=now;ring.style.setProperty('--ld',Math.round(126*(1-frac)))}
  }
  clearTimeout(wd);if(my!==gen)return;   // a rotation asked for the other cut meanwhile
  ring.style.setProperty('--ld',0);loadedCut=c;
  if(video.src.startsWith('blob:'))URL.revokeObjectURL(video.src);
  video.src=URL.createObjectURL(new Blob(chunks,{type:'video/mp4'}));video.load();
  video.addEventListener('canplay',()=>{requestSeek(heroProgress()*video.duration);stage.classList.add('video-ready')},{once:true});
}
function failVideo(e){if(e&&e.name==='AbortError'&&ctrlNow&&!ctrlNow.signal.aborted)return;stage.classList.add('video-failed')}
function startBlobFetch(){if(started)return;started=true;const c=cut();loadHeroBlob(c).catch(e=>{if(c===cut())failVideo(e)})}
function initHeroOnce(){
  if(inited)return;inited=true;
  const c=cut();
  posterEl.style.backgroundImage=`url('${c.poster}')`;
  const im=new Image();im.onload=startBlobFetch;im.onerror=startBlobFetch;im.src=c.poster;
  setTimeout(startBlobFetch,4000);
  const t0=performance.now();
  (function ramp(now){
    loadK=clamp((now-t0)/1100,0,1);loadK=loadK*loadK*(3-2*loadK);
    updateCaptions(shown);
    if(loadK<1)requestAnimationFrame(ramp);
  })(t0);
}

// the screens that get the still hero instead: only reduced motion. Phones and tablets scrub the portrait cut.
// index.html preloads each poster only when none of these match (keep both in step)
const GATES=window.CF.HERO_GATES=['(prefers-reduced-motion: reduce)'];
// turning the screen swaps to the cut that fits it
PORTRAIT.addEventListener('change',()=>{
  if(!inited||!scrubOn||cut()===loadedCut)return;
  const c=cut();posterEl.style.backgroundImage=`url('${c.poster}')`;
  stage.classList.remove('video-ready','video-failed');
  loadHeroBlob(c).catch(e=>{if(c===cut())failVideo(e)});
});
let scrubOn=false;
function enableScrub(){
  if(scrubOn)return;scrubOn=true;
  initHeroOnce();
  addEventListener('scroll',onScroll,{passive:true});
  bands.forEach(b=>{b.op=-1;b.k=-1;b.kb=-1});
  target=heroProgress();shown=target;updateCaptions(shown);onScroll();
}
function disableScrub(){
  if(!scrubOn)return;scrubOn=false;
  removeEventListener('scroll',onScroll);
  if(rafId!==null){cancelAnimationFrame(rafId);rafId=null}
}
function applyHeroMode(){GATES.some(q=>matchMedia(q).matches)?disableScrub():enableScrub()}
const MQLS=GATES.map(q=>matchMedia(q));
MQLS.forEach(m=>m.addEventListener('change',applyHeroMode));
addEventListener('resize',()=>{if(scrubOn){target=heroProgress();onScroll()}});
applyHeroMode();
})();
