/* Comfyurn · press-and-hold sofa breakdown (the one interactive moment) */
(function(){
'use strict';
const rm=matchMedia('(prefers-reduced-motion: reduce)');
const hold=document.getElementById('hold'),holdLabel=document.getElementById('holdlabel'),pctEl=document.getElementById('pct');
const layers=[...document.querySelectorAll('.layer')],items=[...document.querySelectorAll('#layers li')];
let holding=false,hp=0,hRaf=null,hLast=0,lastPct=-1,lastActive=-2,pinned=false;
function paintSofa(){
  const act=hp>=.999?3:hp<.02?-1:Math.min(3,Math.floor(hp*4));
  layers.forEach((l,i)=>l.setAttribute('transform','translate(0,'+(i*30*hp).toFixed(1)+')'));
  hold.style.setProperty('--hp',hp.toFixed(3));
  const pct=Math.round(hp*100);
  if(pct!==lastPct){lastPct=pct;pctEl.textContent=pct+'%';holdLabel.textContent=hp>=.999?'Open. Hold again to close':'Hold to open the sofa'}
  if(act!==lastActive){lastActive=act;items.forEach((li,i)=>li.classList.toggle('on',hp>=.999||(act>=0&&i<=act&&hp>0.02)))}
}
function holdTick(now){
  const dt=Math.min(64,now-(hLast||now));hLast=now;
  if(holding)hp=Math.min(1,hp+dt/2600);else hp=Math.max(0,hp-dt/1900*(hp>.999?0:1));
  paintSofa();
  if((holding&&hp<1)||(!holding&&hp>0&&hp<.999)){hRaf=requestAnimationFrame(holdTick)}else{hRaf=null;hLast=0}
}
function holdStart(){if(pinned)return;if(hp>=.999&&!holding){hp=.998}holding=true;if(hRaf===null)hRaf=requestAnimationFrame(holdTick)}
function holdEnd(){holding=false;if(hp<.999&&hRaf===null)hRaf=requestAnimationFrame(holdTick)}
hold.addEventListener('pointerdown',e=>{hold.setPointerCapture(e.pointerId);holdStart()});
['pointerup','pointercancel','lostpointercapture'].forEach(t=>hold.addEventListener(t,holdEnd));
hold.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();holdStart()}});
hold.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter')holdEnd()});
hold.addEventListener('contextmenu',e=>e.preventDefault());
function pinFinal(){pinned=true;holding=false;hp=1;paintSofa();holdLabel.textContent='The sofa is open';hold.disabled=true;hold.style.opacity=.6}
function unpinFinal(){pinned=false;hold.disabled=false;hold.style.opacity='';hp=0;lastPct=-1;lastActive=-2;paintSofa()}
rm.addEventListener('change',e=>{e.matches?pinFinal():unpinFinal()});
paintSofa();
if(rm.matches)pinFinal();
})();
