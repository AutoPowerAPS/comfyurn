/* Comfyurn · booking form: demo success state, nothing is sent */
(function(){
'use strict';
const form=document.getElementById('form'),thanks=document.getElementById('thanks');
form.querySelector('[type=submit]').disabled=false;   // off in the HTML, so the form never submits without JavaScript
form.addEventListener('submit',e=>{
  e.preventDefault();
  const n=form.elements.name,m=form.elements.email;
  const ok=n.value.trim().length>0&&/^\S+@\S+\.\S+$/.test(m.value);
  if(!ok){(n.value.trim()?m:n).focus();return}
  form.style.display='none';thanks.classList.add('show');thanks.focus();
});
})();
