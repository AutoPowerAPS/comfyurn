/* Comfyurn · horizontal carousels, no autoplay: CF.carousel (a scroll-snap track with previous and next buttons)
   and CF.loop (an endless row of tiles moved by arrows or a swipe).
   CF.carousel(track,prev,next) pages the track by one view. At an end the button there is marked aria-disabled and
   does nothing, but keeps keyboard focus (a disabled button would drop focus to the page). Load after util.js. */
(function(){
'use strict';
const CF=window.CF=window.CF||{};
// whether a track sits at its start or its end; 2px of slack covers sub-pixel scroll positions
CF.edgeState=(left,scrollW,clientW)=>({atStart:left<=2,atEnd:left+clientW>=scrollW-2});
CF.carousel=(track,prev,next)=>{
  const paint=()=>{
    const s=CF.edgeState(track.scrollLeft,track.scrollWidth,track.clientWidth);
    prev.setAttribute('aria-disabled',s.atStart);next.setAttribute('aria-disabled',s.atEnd);
  };
  const page=dir=>track.scrollBy({left:dir*track.clientWidth*.9,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  prev.addEventListener('click',()=>{if(prev.getAttribute('aria-disabled')!=='true')page(-1)});
  next.addEventListener('click',()=>{if(next.getAttribute('aria-disabled')!=='true')page(1)});
  let raf=0;
  const later=()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;paint()})};   // at most one layout read per frame
  track.addEventListener('scroll',later,{passive:true});
  addEventListener('resize',later);
  paint();
  return {paint};
};

/* Endless loop of tiles (home Shop by room): one row shows "visible" tiles; the arrows, or a swipe or mouse drag,
   rotate the row by one or more tiles and wrap around. Tiles outside the row are inert (out of the Tab order and
   hidden from screen readers). With no more tiles than fit, the arrows stay in view but greyed out (aria-disabled,
   so a focused arrow keeps focus) and nothing moves.
   CF.loop(track,prev,next,visible) returns {refresh}; call refresh() after replacing the track's tiles. */
// the order after moving n places forward (negative: back), wrapping around; the list passed in is left as it was
CF.rotate=(list,n)=>{if(!list.length)return [];const k=((n%list.length)+list.length)%list.length;return list.slice(k).concat(list.slice(0,k))};
// tiles to move for a horizontal drag of dx pixels: none under 40px, else at least one, about one per tile width.
// A drag to the left (negative dx) moves forward. max caps it at the tiles waiting outside the row, so a long drag
// never slides past them into an empty strip or round a full lap.
CF.swipeSteps=(dx,tileW,max=Infinity)=>Math.abs(dx)<40?0:-Math.sign(dx)*Math.min(max,Math.max(1,Math.round(Math.abs(dx)/tileW)));
CF.loop=(track,prev,next,visible)=>{
  const still=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  let busy=false,pending=null;   // pending: the finish of the slide that is running, so a refresh can cancel it
  const tiles=()=>[...track.children];
  const settle=()=>tiles().forEach((t,i)=>{t.inert=i>=visible});
  const pitch=()=>{const t=track.children;return t.length>1?t[1].getBoundingClientRect().left-t[0].getBoundingClientRect().left:0};
  const step=n=>{
    const all=tiles();if(busy||!n||all.length<=visible)return;
    const order=CF.rotate(all,n),dist=pitch()*Math.abs(n);
    if(still()){track.append(...order);settle();return}
    busy=true;
    all.forEach(t=>{t.inert=false});   // tiles sliding into view are reachable as soon as they show
    if(n<0){track.style.transition='none';track.prepend(...order.slice(0,-n));track.style.transform=`translateX(${-dist}px)`;track.getBoundingClientRect()}
    track.style.transition='';track.style.transform=n>0?`translateX(${-dist}px)`:'translateX(0)';
    const stop=()=>{track.removeEventListener('transitionend',ended);clearTimeout(safety);pending=null};
    const done=()=>{stop();track.style.transition='none';track.append(...order);track.style.transform='';track.getBoundingClientRect();track.style.transition='';settle();busy=false};
    const safety=setTimeout(done,800);   // in case transitionend never fires (a hidden tab)
    // transitionend bubbles: only the track's own slide ends it, not a tile's hover transition
    const ended=e=>{if(e.target===track&&e.propertyName==='transform')done()};
    track.addEventListener('transitionend',ended);
    pending=stop;
  };
  prev.addEventListener('click',()=>step(-1));
  next.addEventListener('click',()=>step(1));
  // swipe or mouse drag, decided on release. The click that ends a drag is swallowed (only that one, in the same
  // moment), and a gesture the browser takes over for scrolling (pointercancel) is forgotten. The window listeners
  // are there only during a drag, so pointer moves elsewhere on the page cost nothing.
  let x0=null,moved=false,swallow=false;
  const move=e=>{if(Math.abs(e.clientX-x0)>8)moved=true};
  const up=e=>{const dx=e.clientX-x0,was=moved;forget();
    if(was){swallow=true;setTimeout(()=>{swallow=false},0);step(CF.swipeSteps(dx,pitch()||1,tiles().length-visible))}};
  const forget=()=>{x0=null;moved=false;removeEventListener('pointermove',move);removeEventListener('pointerup',up);removeEventListener('pointercancel',forget)};
  track.addEventListener('pointerdown',e=>{if(e.button)return;forget();x0=e.clientX;
    addEventListener('pointermove',move);addEventListener('pointerup',up);addEventListener('pointercancel',forget)});
  track.addEventListener('click',e=>{if(swallow){e.preventDefault();e.stopPropagation();swallow=false}},true);
  track.addEventListener('dragstart',e=>e.preventDefault());
  const refresh=()=>{if(pending)pending();track.style.transition='none';track.style.transform='';track.getBoundingClientRect();track.style.transition='';busy=false;forget();const loops=tiles().length>visible;[prev,next].forEach(b=>{b.hidden=false;b.setAttribute('aria-disabled',!loops)});settle()};
  refresh();
  return {refresh};
};
})();
