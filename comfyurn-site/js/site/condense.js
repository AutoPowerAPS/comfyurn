/* Comfyurn · the condensing bar shared by the home nav (js/home/nav-menu.js) and the shop header (js/shop/header.js).
   Full at the top; past MINI_ON px it gets .mini, the folded parts go inert and a menu button opens a panel with the same links.
   It expands only back at the very top (MINI_OFF px). Load after util.js. */
(function(){
'use strict';
const CF=window.CF=window.CF||{};
const MINI_ON=140,MINI_OFF=8,SETTLE=500;
/* o.nav: the bar; o.btn/o.panel: menu button and its panel; o.folded: elements hidden while condensed;
   o.menuFirst()/o.fullFirst(): where focus goes in the open panel / the full bar;
   o.settle: ignore scrolls while the height transition runs (a sticky bar in the page flow moves scrollY as it shrinks);
   o.narrow: a MediaQueryList that keeps the bar condensed while it matches. */
CF.condenseNav=function(o){
  const {nav,btn,panel,folded}=o;
  let mini=false,ticking=false,lockUntil=0;

  function setMenu(open,focusBack){
    if(open===!panel.hidden)return;
    panel.hidden=!open;
    requestAnimationFrame(()=>panel.classList.toggle('open',open));
    btn.setAttribute('aria-expanded',open);
    btn.setAttribute('aria-label',open?'Close menu':'Open menu');
    if(open)o.menuFirst().focus();
    else if(focusBack)btn.focus();
  }
  btn.addEventListener('click',()=>setMenu(panel.hidden));
  panel.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
  // Escape returns focus to the menu button only if it was in the menu; typing in a search box keeps its focus
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)setMenu(false,panel.contains(document.activeElement)||document.activeElement===btn)});
  document.addEventListener('pointerdown',e=>{if(!panel.hidden&&!panel.contains(e.target)&&!btn.contains(e.target))setMenu(false)});

  function setMini(on){
    if(on===mini)return;
    // whatever is about to fold away may hold keyboard focus: hand it to its counterpart in the new state
    const f=document.activeElement,moveFocus=on?folded.some(el=>el.contains(f)):(f===btn||panel.contains(f));
    mini=on;nav.classList.toggle('mini',mini);
    // show the new state's controls, move focus into them, and only then hide the old ones
    if(mini){
      btn.tabIndex=0;btn.setAttribute('aria-hidden','false');
      if(moveFocus)btn.focus({preventScroll:true});
      folded.forEach(el=>el.inert=true);
    }else{
      folded.forEach(el=>el.inert=false);
      if(moveFocus)o.fullFirst().focus({preventScroll:true});
      setMenu(false);
      btn.tabIndex=-1;btn.setAttribute('aria-hidden','true');
    }
  }
  const forced=()=>!!(o.narrow&&o.narrow.matches);
  function onScroll(){
    ticking=false;
    if(forced()){setMini(true);return}
    if(o.settle&&performance.now()<lockUntil){ticking=true;setTimeout(()=>requestAnimationFrame(onScroll),lockUntil-performance.now()+10);return}
    const y=scrollY,want=mini?y>MINI_OFF:y>MINI_ON;
    if(want===mini)return;
    setMini(want);lockUntil=performance.now()+SETTLE;
  }
  // while forced condensed, scrolling cannot change anything
  addEventListener('scroll',()=>{if(!ticking&&!forced()){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
  if(o.narrow)o.narrow.addEventListener('change',()=>{lockUntil=0;onScroll()});
  btn.tabIndex=-1;btn.setAttribute('aria-hidden','true');
  onScroll();
  return {isMini:()=>mini,MINI_OFF};
};
})();
