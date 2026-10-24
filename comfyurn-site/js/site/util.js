/* Comfyurn · tiny helpers every page can use: safe text for HTML, and the one email rule. Load before other site scripts. */
(function(){
'use strict';
const CF=window.CF=window.CF||{};
// anything a visitor typed goes through this before it is put into HTML
CF.esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
CF.emailOk=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
})();
