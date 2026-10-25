/* Comfyurn · tab rows (home "Shop by room" and "Inside the sofa", the product page Inside band).
   CF.tabs(list,onSelect,panel) wires a role="tablist": click or arrow keys select a tab, only the selected tab is in the
   Tab order (roving tabindex), and onSelect(index,tab,first) runs on every pick; first is true when the pick came from code
   (the setup call, or select() on the returned object), false for a visitor's click or key. With a panel, the panel is labelled by the picked tab and shows only its child with the same
   data-i (without JavaScript every child shows). A list marked aria-orientation="vertical" also moves with ArrowUp and
   ArrowDown. A list with no tabs is left alone. Load after util.js. */
(function(){
'use strict';
const CF=window.CF=window.CF||{};
// the tab an arrow, Home or End key moves to in a row of n tabs; -1 for any other key.
// A vertical list adds ArrowDown and ArrowUp; left and right keep working there too.
CF.tabNext=(key,i,n,vertical)=>{
  if(vertical&&key==='ArrowDown')key='ArrowRight';
  if(vertical&&key==='ArrowUp')key='ArrowLeft';
  return key==='ArrowRight'?(i+1)%n:key==='ArrowLeft'?(i-1+n)%n:key==='Home'?0:key==='End'?n-1:-1;
};
CF.tabs=(list,onSelect,panel)=>{
  const tabs=[...list.querySelectorAll('[role="tab"]')],vertical=list.getAttribute('aria-orientation')==='vertical';
  if(!tabs.length)return {select(){},tabs};
  const texts=panel?[...panel.querySelectorAll(':scope>[data-i]')]:[];
  const select=(i,focus,first)=>{
    tabs.forEach((t,k)=>{t.setAttribute('aria-selected',k===i);t.tabIndex=k===i?0:-1});
    if(focus)tabs[i].focus();
    if(panel){panel.setAttribute('aria-labelledby',tabs[i].id);texts.forEach(t=>{t.hidden=+t.dataset.i!==i})}
    onSelect(i,tabs[i],!!first);
  };
  // a click focuses its tab too: Safari does not focus a clicked button, and the arrow keys need a focused tab
  tabs.forEach((t,i)=>t.addEventListener('click',()=>select(i,true)));
  list.addEventListener('keydown',e=>{
    const i=tabs.indexOf(document.activeElement);if(i<0)return;
    const next=CF.tabNext(e.key,i,tabs.length,vertical);if(next<0)return;
    e.preventDefault();select(next,true);
  });
  const first=Math.max(0,tabs.findIndex(t=>t.getAttribute('aria-selected')==='true'));
  select(first,false,true);
  return {select:i=>select(i,false,true),tabs};
};
})();
