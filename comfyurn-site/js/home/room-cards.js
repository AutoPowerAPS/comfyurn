/* Comfyurn · suite cards: expand and collapse the pieces list */
(function(){
'use strict';
document.querySelectorAll('.tog').forEach(b=>b.addEventListener('click',()=>{
  const open=b.getAttribute('aria-expanded')!=='true';
  b.setAttribute('aria-expanded',open);
  document.getElementById(b.getAttribute('aria-controls')).classList.toggle('open',open);
}));
})();
