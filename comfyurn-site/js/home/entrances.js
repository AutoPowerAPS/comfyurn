/* Comfyurn · scroll-reveal entrances: adds .in to .reveal blocks, pauses loops on hidden tabs */
(function(){
'use strict';
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){
    e.target.classList.add('in');
    setTimeout(()=>e.target.querySelectorAll('.part').forEach(p=>p.classList.add('done')),2200);
    io.unobserve(e.target);
  }
}),{threshold:.14});
document.querySelectorAll('.reveal,#stack,#money').forEach(el=>io.observe(el));
document.addEventListener('visibilitychange',()=>document.body.classList.toggle('paused',document.hidden));
})();
