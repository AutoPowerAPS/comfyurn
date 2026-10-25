/* Comfyurn · tiny helpers every page can use: safe text for HTML, the one email rule, design tokens for SVG, and the
   word splitter for animated headlines. Load before other site scripts. */
(function(){
'use strict';
const CF=window.CF=window.CF||{};
// anything a visitor typed goes through this before it is put into HTML
CF.esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
CF.emailOk=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
// read a colour token from base.css, for SVG colours that cannot use var(). The value goes into markup, so only a plain
// hex colour passes: anything else (a stylesheet we do not control could set --ink to markup) gives the fallback
CF.token=(name,fallback='')=>{
  let v='';try{v=getComputedStyle(document.documentElement).getPropertyValue(name).trim()}catch(e){}
  return /^#[0-9a-f]{3,8}$/i.test(v)?v:fallback;
};
// split text pieces ({t,em}) into words; a word may span pieces, so "un<em>zip</em>." stays one word with its italic part
CF.wordRuns=parts=>{
  const words=[];let cur=[];
  const end=()=>{if(cur.length)words.push(cur);cur=[]};
  for(const {t,em} of parts)t.split(/(\s+)/).forEach(s=>{if(!s)return;if(/^\s+$/.test(s))end();else cur.push({t:s,em})});
  end();
  return words;
};
})();
