/* Home nav: full at the top, condensed (.mini) after scrolling (always at 550px and narrower), with a menu button for the folded links.
   The condensing itself is shared with the shop header (js/site/condense.js). */
(()=>{
'use strict';
const nav=document.getElementById('nav'),panel=document.getElementById('navPanel'),links=nav.querySelector('.nlwrap');
// at 550px and narrower the links row cannot show all five links, so the nav stays condensed there
const narrow=matchMedia('(max-width:550px)');
// a phone opens already condensed: skip the fold animation on that first paint
if(narrow.matches){nav.classList.add('instant');requestAnimationFrame(()=>requestAnimationFrame(()=>nav.classList.remove('instant')))}
// the nav is fixed, so its height change never moves the page: no settle lock needed
CF.condenseNav({nav,btn:document.getElementById('navBtn'),panel,folded:[links],narrow,
  menuFirst:()=>panel.querySelector('a'),fullFirst:()=>links.querySelector('a')});
})();
