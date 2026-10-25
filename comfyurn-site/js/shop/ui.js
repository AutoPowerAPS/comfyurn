/* Comfyurn · small shared helpers for shop pages: price format, stars, product links, stock lines */
(function(){
'use strict';
const CF=window.CF=window.CF||{};
// prices are shown as Nepali rupees with lakh grouping (large figures read 3,24,000); 13% VAT is inside every price.
// The catalogue numbers were kept as they were when the currency changed.
CF.CUR='Rs.';CF.CODE='NPR';
CF.fmt=n=>n.toLocaleString('en-IN');
// whole rupees, or two decimal places (paisa) when a discount or VAT leaves a fraction
CF.money=n=>{n=Math.round(n*100)/100;return CF.CUR+' '+(n%1?n.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2}):CF.fmt(n))};
// display price with a small raised currency sign, as on cards and the product page
CF.priceHTML=n=>`<sup>${CF.CUR}</sup>${CF.fmt(n)}`;
CF.VAT=13;
CF.vatIn=n=>Math.round(n*CF.VAT/(100+CF.VAT)*100)/100;   // the VAT part of a VAT-inclusive amount
const INK=CF.token('--ink','#121816'),INK2=CF.token('--ink-2','#4A524F'),INK3=CF.token('--ink-3','#8A918E');   // SVG colours from base.css
const star=f=>`<svg viewBox="0 0 24 24"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z" fill="${f?INK:'none'}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
CF.stars=r=>`<span class="stars" aria-hidden="true">${[1,2,3,4,5].map(i=>star(r>=i-.25)).join('')}</span>`;
// product pages live inside the room they were opened from, like collections/<room>/products/<id>
CF.productUrl=(p,room)=>`product.html?id=${encodeURIComponent(p.id)}&room=${encodeURIComponent(room||p.room)}`;
CF.colourName=k=>k.charAt(0).toUpperCase()+k.slice(1);
CF.roomLabel=k=>(CF.ROOMS.find(r=>r[0]===k)||CF.ROOMS[0])[1];
// dates in the catalogue are YYYY-MM-DD; shown as "20 November"
CF.date=iso=>new Date(iso+'T12:00:00').toLocaleDateString('en-AU',{day:'numeric',month:'long'});
// fictional stock rule, the only place it lives: made-to-order pieces hold no stock,
// the rest show their count, run low, go on pre-order until a restock date, or sell out
CF.stock=p=>{
  if(p.made)return {kind:'made',badge:'Made to order',text:'Made to order. Ships in 4 to 6 weeks.'};
  if(!p.qty)return p.eta?{kind:'eta',badge:'Pre-order',text:`Restocking. Order now, ships after ${CF.date(p.eta)}.`}:{kind:'out',badge:'Sold out',text:'Sold out for now.'};
  if(p.qty<=5)return {kind:'low',badge:`Only ${p.qty} left`,text:`Only ${p.qty} left in stock. Delivered in 1 to 2 weeks.`};
  return {kind:'in',badge:'',text:`In stock: ${p.qty} available. Delivered in 1 to 2 weeks.`};
};
// how many one shopper can put in the bag: the stepper cap, or fewer when stock is short
CF.maxQty=p=>{
  const cap=CF.store?CF.store.MAX_QTY:9;
  if(p.made||(!p.qty&&p.eta))return cap;   // made to order or pre-order: no stock limit
  return Math.min(cap,p.qty||0);            // sold out gives 0
};
// sale: percent off the was price, and the price line with the old price struck through
CF.off=p=>p.was?Math.round((1-p.price/p.was)*100):0;
CF.wasHTML=(p,qty=1)=>p.was?`<s><span class="vh">Was </span>${CF.money(p.was*qty)}</s>`:'';
// feature badges: solid oak and outdoor tags first, then the product's own
CF.feats=p=>[].concat(p.tags.includes('oak')?['Solid oak']:[],p.tags.includes('out')?['Outdoor safe']:[],p.feats||[]);
// spec rows: sizes from DIMS first, then the product's own specs minus rows that would repeat the sizes
CF.specRows=p=>{
  const d=CF.DIMS[p.id]||{};
  return [['Size (W × D × H)',d.size],['Seat height',d.seat],['Weight',d.weight]].filter(r=>r[1])
    .concat(Object.entries(p.spec).filter(([k])=>!(d.size&&/^(size|height)$/i.test(k))));
};
// physical layers only: promises (warranty, care, trial) and measurements (size, height) are not parts
CF.layerRows=p=>Object.entries(p.spec).filter(([k])=>!/warranty|care|trial|size|height|fits/i.test(k)).slice(0,5);
const LAYER_FILLS=['#F4EFE4','#DCE5E4','#9FB9C2','#C8A67A','#51666E'];
CF.insideArt=p=>{
  const rows=CF.layerRows(p);
  const h=22,gap=12,y0=(130-(rows.length*h+(rows.length-1)*gap))/2;
  return `<svg class="art" viewBox="0 0 200 130" role="img" aria-label="${CF.esc(`Layers of the ${p.name}: ${rows.map(r=>r[0]).join(', ')}`)}">${rows.map(([k],i)=>{
    const y=y0+i*(h+gap);
    // one group per layer, so a picked layer tab can dim the others (product page Inside band)
    return `<g class="layer" data-i="${i}"><rect x="70" y="${y}" width="112" height="${h}" rx="2" fill="${LAYER_FILLS[i]}" stroke="${INK3}" stroke-width="1"/>
      <text x="64" y="${y+h/2+3}" text-anchor="end" font-family="DM Mono, monospace" font-size="7.5" letter-spacing=".6" fill="${INK2}">${String(i+1).padStart(2,'0')} ${CF.esc(k.toUpperCase())}</text></g>`;
  }).join('')}</svg>`;
};
// the trial a product offers: its own Trial spec, otherwise the standard thirty days
CF.trial=p=>p.spec.Trial||'Thirty days';
// a review saved in this browser is shown only when every field has the shape the review form writes:
// rating 1 to 5, a YYYY-MM-DD date, text fields as text, a colour the product is sold in (stored data can be tampered with)
CF.reviewOk=(r,p)=>!!r&&typeof r==='object'&&Number.isInteger(r.r)&&r.r>=1&&r.r<=5&&
  typeof r.d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(r.d)&&['t','b','n'].every(k=>typeof r[k]==='string')&&
  (r.colour===undefined||p.cols.includes(r.colour));
// the n pieces with the most reviews, ties broken by popularity; the list passed in is left as it was
CF.mostReviewed=(list,n)=>[...list].sort((a,b)=>b.rev-a.rev||a.pop-b.pop).slice(0,n);
// the n most popular pieces of one room (every piece when n is left out), and the lowest price in a list of pieces (0 for none)
CF.roomPicks=(room,n)=>CF.PRODUCTS.filter(p=>p.room===room).sort((a,b)=>a.pop-b.pop).slice(0,n);
CF.lowestPrice=list=>list.length?Math.min(...list.map(p=>p.price)):0;
// the one square product tile (home carousel and room thumbs, product page rows): line art on the studio grey until
// photos arrive, name, price. {desc:true} adds the description and a struck sale price.
CF.tileHTML=(p,o={})=>`<a class="ptile" href="${CF.esc(CF.productUrl(p))}"><span class="pt-ph">${CF.ART&&CF.ART[p.type]?CF.art(p.type,CF.COL[p.cols[0]]||CF.COL.stone):''}</span><span class="pt-name">${CF.esc(p.name)}</span>${o.desc?`<span class="pt-desc">${CF.esc(p.desc)}</span>`:''}<span class="pt-price">${CF.money(p.price)}${o.desc?CF.wasHTML(p):''}</span></a>`;
// care advice: the product's own Care spec, then the advice for its type, then a safe default
CF.care=p=>p.spec.Care||CF.CARE[p.type]||'Dust with a soft dry cloth.';
})();
