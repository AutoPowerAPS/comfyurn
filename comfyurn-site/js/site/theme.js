/* Comfyurn · night mode. A blocking script in <head> (right after the stylesheets) so data-theme is on <html> before first paint.
   No saved choice follows the OS; a saved "dark" or "light" wins. It touches only <html>, the theme-color <meta> and the toggle button.
   CF.themeFrom/themeValid are pure (unit tested); CF.setTheme saves and applies; CF.themeButton wires a toggle. */
(function(){
'use strict';
const CF=window.CF=window.CF||{};
const KEY='cf-theme-v1',root=document.documentElement;
const CANVAS={dark:'#121614',light:'#FAFAF8'};   // fallback for theme-color when the --canvas token cannot be read
const MOON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-icon="moon"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg>';
const SUN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" data-icon="sun"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>';
// only these two exact strings are a choice; anything else in storage (tampered, other case, markup) is ignored
CF.themeValid=v=>v==='dark'||v==='light';
CF.themeFrom=(saved,osDark)=>CF.themeValid(saved)?saved:osDark?'dark':'light';
const mq=typeof matchMedia==='function'?matchMedia('(prefers-color-scheme: dark)'):null;
const saved=()=>{try{return localStorage.getItem(KEY)}catch(e){return null}};
let cur='';
function apply(t){
  const was=cur;cur=t;
  root.setAttribute('data-theme',t);
  // theme-color paints the phone's browser bar: the canvas actually shown, read from the token (a plain hex only)
  let c='';try{c=getComputedStyle(root).getPropertyValue('--canvas').trim()}catch(e){}
  const m=document.querySelector('meta[name="theme-color"]');
  if(m)m.setAttribute('content',/^#[0-9a-f]{6}$/i.test(c)?c:CANVAS[t]);
  if(was&&was!==t)window.dispatchEvent(new CustomEvent('cf:theme',{detail:t}));
}
const resolve=()=>apply(CF.themeFrom(saved(),!!(mq&&mq.matches)));
CF.theme=()=>cur;
CF.setTheme=t=>{
  if(!CF.themeValid(t))return;
  try{localStorage.setItem(KEY,t)}catch(e){}   // storage blocked or full: this page still switches
  apply(t);
};
/* the toggle: aria-pressed means night mode is showing; the moon offers night, the sun offers day */
CF.themeButton=btn=>{
  if(!btn||btn.dataset.wired)return;   // NM-F1: wiring twice would add a second click and the two would cancel out
  btn.dataset.wired='1';
  const sync=()=>{
    const dark=cur==='dark';
    btn.setAttribute('aria-pressed',dark);
    btn.setAttribute('aria-label',dark?'Switch to day mode':'Switch to night mode');
    btn.innerHTML=dark?SUN:MOON;
  };
  btn.addEventListener('click',()=>CF.setTheme(cur==='dark'?'light':'dark'));
  window.addEventListener('cf:theme',sync);
  sync();
};
resolve();
// the OS flips while the page is open: follow it only when the visitor has not chosen
if(mq)mq.addEventListener('change',()=>{if(!CF.themeValid(saved()))resolve()});
// another tab chose (or cleared) a theme
window.addEventListener('storage',e=>{if(e.key===KEY||e.key===null)resolve()});
// wiring waits for the page: header.js builds the shop header's button before DOMContentLoaded
const wire=()=>CF.themeButton(document.getElementById('themeBtn'));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();
