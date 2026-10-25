/* Comfyurn · home page bands built from the catalogue: the Shop by room tabs, the diptych drawings and the
   Most reviewed carousel. Needs catalog.js, ui.js, line-art.js, tabs.js and carousel.js. The HTML already holds
   the Living room text and the shop links, so the page reads without JavaScript. */
(function(){
'use strict';
const CF=window.CF;

/* shop by room: one panel, refilled when a tab is picked. Crops of the two suite photos (pos = focus point, z = zoom)
   until room photos arrive. The room index.html already shows (Living) is read from that markup, so its photo, crop and
   copy live in one place and the first paint never jumps. */
const ROOM={
  kitchen:{copy:'A stone island and rattan stools that sit well by the sea.',img:'suite.webp',pos:'70% 62%',z:2.1,alt:'The stone kitchen island with rattan bar stools'},
  bedroom:{copy:'An oak king bed and deep wardrobes in one pale, calm finish.',img:'suite.webp',pos:'50% 50%',z:2.52,alt:'The bedroom through the arch: a made bed and tall wardrobes'},
  balcony:{copy:'A rocking chair and a swing built to live in sun, salt, and wind.',img:'balcony.webp',pos:'6% 78%',z:1.43,alt:'The balcony: a rocking chair and a rattan swing by the sea'}
};
const panel=document.getElementById('roomPanel'),list=document.querySelector('#rooms [role="tablist"]');
if(panel&&list){
  const loop=CF.loop(document.getElementById('roomThumbs'),document.getElementById('roomPrev'),document.getElementById('roomNext'),3);
  const img=panel.querySelector('.rp-img img'),from=panel.querySelector('.rp-from'),h=panel.querySelector('h3'),
    copy=panel.querySelector('.rp-txt p'),shop=panel.querySelector('.tlink'),thumbs=panel.querySelector('.rp-thumbs');
  const shown=list.querySelector('[aria-selected="true"]');
  if(shown)ROOM[shown.dataset.room]={copy:copy.textContent,img:img.getAttribute('src').replace('assets/images/',''),
    pos:img.style.objectPosition,z:img.style.getPropertyValue('--z').trim(),alt:img.alt};
  CF.tabs(list,(i,tab)=>{
    const k=tab.dataset.room,r=ROOM[k];
    img.src=`assets/images/${r.img}`;img.alt=r.alt;
    img.style.objectPosition=img.style.transformOrigin=r.pos;img.style.setProperty('--z',r.z);   // zoom toward the room's corner of the photo
    const picks=CF.roomPicks(k),low=CF.lowestPrice(picks);   // one pass over the catalogue for the price and the pieces
    from.textContent=low?'From '+CF.money(low):'';   // an empty room shows no price line
    h.textContent=CF.roomLabel(k);copy.textContent=r.copy;
    shop.href='products.html#'+k;shop.textContent='Shop '+tab.textContent.trim().toLowerCase();
    thumbs.innerHTML=picks.map(p=>CF.tileHTML(p)).join('');   // every piece in the room, as the heading promises
    loop.refresh();   // one row of 3; more pieces loop by arrows or swipe
  },panel);
}

/* diptych: the line drawing on the studio grey until the campaign photos arrive */
document.querySelectorAll('.dp-art[data-art]').forEach(el=>{el.innerHTML=CF.art(el.dataset.art,CF.COL[el.dataset.col])});

/* most reviewed carousel */
const track=document.getElementById('liftTrack');
if(track){
  track.innerHTML=CF.mostReviewed(CF.PRODUCTS,8).map(p=>`<li>${CF.tileHTML(p)}</li>`).join('');
  CF.carousel(track,document.getElementById('liftPrev'),document.getElementById('liftNext'));
}
})();
