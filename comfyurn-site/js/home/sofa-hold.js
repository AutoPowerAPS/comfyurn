/* Comfyurn · press-and-hold sofa breakdown (the one interactive moment), and the layer tabs beside it.
   Holding lights each layer tab as its layer lifts; picking a tab dims the other layers in the drawing. Needs tabs.js. */
(function(){
'use strict';
const rm=matchMedia('(prefers-reduced-motion: reduce)');
const hold=document.getElementById('hold'),holdLabel=document.getElementById('holdlabel'),pctEl=document.getElementById('pct');
const layers=[...document.querySelectorAll('.layer')],items=[...document.querySelectorAll('#layers [role="tab"]')];
const lab=document.getElementById('lab');
let holding=false,closing=false,hp=0,hRaf=null,hLast=0,lastPct=-1,lastActive=-2,pinned=false;
// the layer a visitor picked (-1 until they pick one) is dimmed-to only while the sofa is closed: an open sofa shows every layer
// with reduced motion the sofa is pinned open, so a pick made then still highlights its layer (pickedPinned);
// turning reduced motion on or off clears that, and a closed sofa shows the last pick again
let picked=-1,pickedPinned=false,shownPick=null;
// runs every frame of a hold, so it touches the attribute only when the pick shown changes (each write restyles the drawing)
const applyPick=()=>{
  const v=picked>=0&&!closing&&(pinned?pickedPinned:hp<.02&&!holding)?String(picked):null;   // a closing sofa drops the pick (reset)
  if(v===shownPick)return;
  shownPick=v;if(v===null)delete lab.dataset.pick;else lab.dataset.pick=v;
};
const layerTabs=window.CF.tabs(document.getElementById('layers'),(i,tab,first)=>{if(!first){picked=i;pickedPinned=pinned;applyPick()}},document.getElementById('layerPanel'));
const firstTab=Math.max(0,layerTabs.tabs.findIndex(t=>t.getAttribute('aria-selected')==='true'));
function paintSofa(){
  const act=hp>=.999?3:hp<.02?-1:Math.min(3,Math.floor(hp*4));
  layers.forEach((l,i)=>l.setAttribute('transform','translate(0,'+(i*30*hp).toFixed(1)+')'));
  hold.style.setProperty('--hp',hp.toFixed(3));
  const pct=Math.round(hp*100);
  if(pct!==lastPct){lastPct=pct;pctEl.textContent=pct+'%';holdLabel.textContent=hp>=.999?'Open. Press to close':'Hold to open the sofa'}
  if(act!==lastActive){lastActive=act;items.forEach((li,i)=>li.classList.toggle('on',hp>=.999||(act>=0&&i<=act&&hp>0.02)))}
}
function holdTick(now){
  const dt=Math.min(64,now-(hLast||now));hLast=now;
  // a fully open sofa stays open on release; closing runs down to 0 whether or not the press is still held
  if(closing)hp=Math.max(0,hp-dt/1900);else if(holding)hp=Math.min(1,hp+dt/2600);else hp=Math.max(0,hp-dt/1900*(hp>.999?0:1));
  paintSofa();
  if(closing&&hp===0)reset();
  if((closing&&hp>0)||(holding&&hp<1)||(!holding&&hp>0&&hp<.999)){hRaf=requestAnimationFrame(holdTick)}else{hRaf=null;hLast=0}
  applyPick();
}
// a press on a fully open sofa closes it all the way and puts the layer tabs back as they were on load
function holdStart(){if(pinned||closing)return;if(hp>=.999&&!holding){closing=true;hRaf=hRaf??requestAnimationFrame(holdTick);return}holding=true;if(hRaf===null)hRaf=requestAnimationFrame(holdTick)}
function reset(){closing=false;holding=false;picked=-1;pickedPinned=false;layerTabs.select(firstTab)}
function holdEnd(){holding=false;if(closing)return;if(hp<.999&&hRaf===null)hRaf=requestAnimationFrame(holdTick)}
hold.addEventListener('pointerdown',e=>{hold.setPointerCapture(e.pointerId);holdStart()});
['pointerup','pointercancel','lostpointercapture'].forEach(t=>hold.addEventListener(t,holdEnd));
hold.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();holdStart()}});
hold.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter')holdEnd()});
hold.addEventListener('contextmenu',e=>e.preventDefault());
function pinFinal(){pinned=true;closing=false;pickedPinned=false;holding=false;hp=1;paintSofa();applyPick();holdLabel.textContent='The sofa is open';hold.disabled=true;hold.style.opacity=.6}
function unpinFinal(){pinned=false;hold.disabled=false;hold.style.opacity='';hp=0;lastPct=-1;lastActive=-2;paintSofa();applyPick()}
rm.addEventListener('change',e=>{e.matches?pinFinal():unpinFinal()});
paintSofa();
if(rm.matches)pinFinal();
})();
