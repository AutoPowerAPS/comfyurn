/* Comfyurn · product catalogue (fictional). Single source of truth for names, prices and specs.
   Optional per product: made (made to order, no stock held), was (price before a sale), qty (units in stock), eta (restock date when qty is 0), feats (feature badges) */
(function(){
'use strict';
const COL={stone:'#E9E2D2',sand:'#D9C7A6',sea:'#9FC6C8',ink:'#51666E',oak:'#C8A67A',rose:'#E3C0B8',white:'#F6F4EE',rattan:'#D2B07D',teal:'#6BB3B6'};
const PRODUCTS=[
 {id:'haven',name:'Haven',desc:'3-seat sofa, washed linen',type:'sofa',room:'living',price:2400,rate:4.8,rev:312,cols:['stone','sea','ink'],tags:['oak'],pop:1,isNew:0,qty:14,feats:['Removable cover'],spec:{Frame:'Kiln-dried oak, dowel joints',Seat:'35 kg/m³ foam, hand-tied springs',Cover:'Linen blend 280 gsm, removable',Warranty:'25 yr frame · 10 yr foam'}},
 {id:'haven-l',name:'Haven L',desc:'Corner sofa, chaise right',type:'sectional',room:'living',price:3650,rate:4.7,rev:148,cols:['stone','ink'],tags:['oak'],pop:4,isNew:0,qty:6,feats:['Removable cover'],spec:{Frame:'Kiln-dried oak, corner blocks',Seat:'35 kg/m³ foam, hand-tied springs',Cover:'Linen blend 280 gsm, removable',Warranty:'25 yr frame · 10 yr foam'}},
 {id:'drift',name:'Drift',desc:'Lounge armchair, bouclé',type:'armchair',room:'living',price:1290,rate:4.9,rev:204,cols:['white','sand','rose'],tags:['oak'],pop:2,isNew:1,qty:3,spec:{Frame:'Solid oak, steam-bent arms',Seat:'40 kg/m³ foam, fiber wrap',Cover:'Wool bouclé 520 gsm',Warranty:'15 yr frame'}},
 {id:'shore',name:'Shore',desc:'Coffee table, solid oak 120 cm',type:'coffee',room:'living',price:1900,rate:4.6,rev:96,cols:['oak','ink'],tags:['oak'],pop:6,isNew:0,qty:9,spec:{Top:'Solid oak, 32 mm, oiled',Joints:'Mortise and tenon',Finish:'Hardwax oil, food safe',Warranty:'25 yr'}},
 {id:'pebble',name:'Pebble',desc:'Round side table, 45 cm',type:'side',room:'living',price:340,rate:4.5,rev:88,cols:['oak','stone'],tags:['oak'],pop:9,isNew:1,was:420,qty:22,spec:{Top:'Solid oak, 24 mm',Base:'Turned oak column',Finish:'Hardwax oil',Warranty:'10 yr'}},
 {id:'tide',name:'Tide',desc:'King bed with slatted base',type:'bed',room:'bedroom',price:3100,rate:4.8,rev:176,cols:['stone','oak'],tags:['oak'],pop:3,isNew:0,qty:5,spec:{Frame:'Solid oak, 25 yr frame',Base:'28 oak slats',Headboard:'Linen, removable cover','Fits mattress':'King, 193 × 203 cm'}},
 {id:'tide-m',name:'Tide Rest',desc:'Pocket-spring mattress, king',type:'mattress',room:'bedroom',price:2600,rate:4.7,rev:231,cols:['white','stone','sand'],tags:[],pop:5,isNew:0,qty:11,feats:['100-night trial'],spec:{Springs:'1,000 wrapped, 7 zones',Comfort:'5 cm memory foam, 50 kg/m³',Edge:'40 kg/m³ support rim',Trial:'100 nights'}},
 {id:'cove',name:'Cove',desc:'Bedside table, 1 drawer',type:'night',room:'bedroom',price:460,rate:4.6,rev:64,cols:['oak','white'],tags:['oak'],pop:11,isNew:0,qty:18,feats:['Soft close'],spec:{Body:'Solid oak, 18 mm',Drawer:'Dovetail joints, soft close',Finish:'Hardwax oil',Warranty:'10 yr'}},
 {id:'harbor',name:'Harbor',desc:'Wardrobe, 2 doors, 200 cm',type:'wardrobe',room:'bedroom',price:2750,rate:4.4,rev:41,cols:['white','oak'],tags:['oak'],pop:12,isNew:1,made:1,feats:['Soft close'],spec:{Carcass:'Oak veneer on birch ply',Doors:'Solid oak frame, soft close',Inside:'Rail, 4 shelves, 2 drawers',Warranty:'15 yr'}},
 {id:'reef',name:'Reef',desc:'Bar stool, rattan seat',type:'stool',room:'kitchen',price:680,rate:4.7,rev:122,cols:['rattan','ink'],tags:['oak'],pop:7,isNew:0,qty:61,feats:['Footrest'],spec:{Frame:'Solid oak, 4 legs + footrest',Seat:'Hand-woven rattan',Height:'Seat 75 cm',Warranty:'10 yr'}},
 {id:'quarry',name:'Quarry',desc:'Kitchen island, stone top',type:'island',room:'kitchen',price:4200,rate:4.8,rev:37,cols:['stone','ink'],tags:[],pop:14,isNew:1,made:1,feats:['Stone top'],spec:{Top:'Honed limestone, 30 mm',Body:'Oak veneer on birch ply',Storage:'3 drawers, 2 cupboards',Warranty:'15 yr'}},
 {id:'table8',name:'Long Table',desc:'Dining table, seats 8',type:'dining',room:'kitchen',price:2300,rate:4.7,rev:59,cols:['oak','ink','white'],tags:['oak'],pop:10,isNew:0,qty:0,eta:'2026-11-20',feats:['Seats 8'],spec:{Top:'Solid oak, 40 mm, 220 cm',Joints:'Mortise and tenon',Finish:'Hardwax oil, food safe',Warranty:'25 yr'}},
 {id:'porch',name:'Porch',desc:'Rocking chair, teak',type:'rocker',room:'balcony',price:820,rate:4.9,rev:83,cols:['oak','white'],tags:['out'],pop:8,isNew:0,qty:8,spec:{Frame:'Solid teak, outdoor grade',Cushion:'Quick-dry foam, UV fabric',Hardware:'Marine stainless steel',Warranty:'10 yr outdoor'}},
 {id:'nest',name:'Nest',desc:'Hanging swing chair, rattan',type:'swing',room:'balcony',price:640,rate:4.6,rev:72,cols:['stone','rattan'],tags:['out'],pop:13,isNew:0,qty:16,feats:['Up to 130 kg'],spec:{Body:'Synthetic rattan, UV safe',Frame:'Powder-coated steel',Load:'Up to 130 kg',Warranty:'5 yr outdoor'}},
 {id:'dune',name:'Dune',desc:'Sun lounger, adjustable',type:'lounger',room:'balcony',price:420,rate:4.4,rev:46,cols:['white','sea'],tags:['out'],pop:17,isNew:1,made:1,was:560,feats:['5 back positions'],spec:{Frame:'Solid teak, outdoor grade',Back:'5 positions',Sling:'Quick-dry mesh',Warranty:'5 yr outdoor'}},
 {id:'lumen',name:'Lumen',desc:'Table lamp, linen shade',type:'lamp',room:'decor',price:190,rate:4.7,rev:140,cols:['stone','sea'],tags:['oak'],pop:15,isNew:0,qty:40,spec:{Base:'Turned oak',Shade:'Pleated linen',Bulb:'E27, warm 2700K',Cable:'Fabric, 2 m'}},
 {id:'halo',name:'Halo',desc:'Pendant light, 40 cm',type:'pendant',room:'decor',price:260,rate:4.5,rev:52,cols:['white','ink'],tags:[],pop:19,isNew:1,was:340,qty:30,feats:['Adjustable drop'],spec:{Shade:'Spun aluminium, matte',Drop:'Adjustable, up to 150 cm',Bulb:'E27, warm 2700K',Warranty:'5 yr'}},
 {id:'urn',name:'Urn',desc:'Ceramic vase, 34 cm',type:'vase',room:'decor',price:85,rate:4.8,rev:210,cols:['white','sea','rose'],tags:[],pop:16,isNew:0,qty:85,feats:['Hand thrown'],spec:{Material:'Stoneware, hand thrown',Glaze:'Matte, watertight',Height:'34 cm',Care:'Hand wash'}},
 {id:'sandbar',name:'Sandbar',desc:'Flatweave rug, 200 × 300',type:'rug',room:'decor',price:540,rate:4.6,rev:77,cols:['sand','stone'],tags:[],pop:18,isNew:0,was:690,qty:12,feats:['Reversible'],spec:{Fiber:'Jute and wool',Weave:'Hand-loomed flatweave',Backing:'None, reversible',Care:'Vacuum, spot clean'}},
 {id:'arch',name:'Arch',desc:'Floor mirror, oak frame',type:'mirror',room:'decor',price:390,rate:4.7,rev:65,cols:['oak','white'],tags:['oak'],pop:20,isNew:0,qty:7,spec:{Frame:'Solid oak, 30 mm',Glass:'5 mm, copper-free',Size:'60 × 170 cm',Warranty:'10 yr'}},
 {id:'cloud',name:'Cloud',desc:'Linen cushion cover, 50 cm',type:'cushion',room:'decor',price:39,rate:4.6,rev:308,cols:['stone','sea','rose','ink'],tags:[],pop:21,isNew:0,qty:120,feats:['Machine washable'],spec:{Fabric:'Washed linen',Closure:'Hidden zip',Insert:'Sold separately',Care:'Machine wash 40°'}},
 {id:'tidewrap',name:'Tidewrap',desc:'Cotton throw, 130 × 170',type:'throw',room:'decor',price:95,rate:4.8,rev:119,cols:['sand','sea'],tags:[],pop:22,isNew:1,was:125,qty:2,spec:{Fabric:'Organic cotton waffle',Edge:'Knotted fringe',Weight:'480 gsm',Care:'Machine wash 30°'}}
];
/* sizes for the specification table: W × D × H, plus seat height and weight where they matter */
const DIMS={
 haven:{size:'220 × 95 × 82 cm',seat:'44 cm',weight:'68 kg'},'haven-l':{size:'290 × 180 × 82 cm',seat:'44 cm',weight:'104 kg'},
 drift:{size:'82 × 86 × 78 cm',seat:'42 cm',weight:'22 kg'},shore:{size:'120 × 65 × 38 cm',weight:'34 kg'},
 pebble:{size:'45 × 45 × 52 cm',weight:'9 kg'},tide:{size:'213 × 223 × 110 cm',weight:'82 kg'},
 'tide-m':{size:'193 × 203 × 28 cm',weight:'48 kg'},cove:{size:'50 × 40 × 55 cm',weight:'14 kg'},
 harbor:{size:'200 × 62 × 220 cm',weight:'140 kg'},reef:{size:'46 × 50 × 105 cm',seat:'75 cm',weight:'7 kg'},
 quarry:{size:'240 × 100 × 92 cm',weight:'310 kg'},table8:{size:'220 × 100 × 75 cm',weight:'72 kg'},
 porch:{size:'66 × 94 × 98 cm',seat:'42 cm',weight:'16 kg'},nest:{size:'95 × 70 × 130 cm',weight:'18 kg'},
 dune:{size:'70 × 195 × 85 cm',weight:'21 kg'},lumen:{size:'30 × 30 × 52 cm',weight:'3 kg'},
 halo:{size:'40 × 40 × 28 cm',weight:'2 kg'},urn:{size:'18 × 18 × 34 cm',weight:'1.6 kg'},
 sandbar:{size:'200 × 300 cm',weight:'9 kg'},arch:{size:'60 × 4 × 170 cm',weight:'19 kg'},
 cloud:{size:'50 × 50 cm',weight:'0.2 kg'},tidewrap:{size:'130 × 170 cm',weight:'0.9 kg'}
};
/* one short "about" paragraph per product type */
const ABOUT={
 sofa:'A deep, low sofa built around a solid oak frame. The seat is dense foam over hand-tied springs, and the linen cover zips off for washing.',
 sectional:'The corner version of our Haven sofa, with a long chaise for stretching out. Same oak frame, same foam numbers, more room.',
 armchair:'A rounded lounge chair with steam-bent oak arms. Small enough for a reading corner, deep enough to fall asleep in.',
 coffee:'A low table cut from solid oak and joined with mortise and tenon. Oiled, not lacquered, so marks can be sanded out.',
 side:'A small round table on a turned oak column. Sized for a lamp, a cup and a book.',
 bed:'A solid oak king bed on 28 oak slats, with a linen headboard you can unzip and wash.',
 mattress:'A pocket-spring mattress with a memory foam top and a firm edge, so the whole surface feels the same.',
 night:'A bedside table with one dovetailed drawer that closes softly.',
 wardrobe:'A tall two-door wardrobe with a hanging rail, four shelves and two drawers behind solid oak doors.',
 stool:'A bar stool with a hand-woven rattan seat on an oak frame, with a footrest at the right height.',
 island:'A freestanding kitchen island with a honed limestone top and storage on both sides.',
 dining:'A long oak dining table that seats eight, joined the old way so it never wobbles.',
 rocker:'A teak rocking chair made for outdoor life, with quick-dry cushions and marine stainless fixings.',
 swing:'A hanging swing chair in UV-safe rattan on a powder-coated steel frame.',
 lounger:'A teak sun lounger with five back positions and a quick-dry sling.',
 lamp:'A table lamp with a turned oak base and a pleated linen shade that gives warm, soft light.',
 pendant:'A spun aluminium pendant with an adjustable drop, for over a table or an island.',
 vase:'A hand-thrown stoneware vase with a matte, watertight glaze.',
 rug:'A hand-loomed flatweave rug in jute and wool. Reversible, so it wears evenly.',
 mirror:'A tall floor mirror in a solid oak frame, with copper-free glass that will not spot.',
 cushion:'A washed linen cushion cover with a hidden zip. It gets softer every wash.',
 throw:'An organic cotton waffle throw with a knotted fringe.'
};
/* care advice per product type, used when a product has no Care spec of its own */
const CARE={
 sofa:'Plump the cushions weekly. Unzip the linen cover and wash it at 30°, then refit it while slightly damp.',
 sectional:'Plump the cushions weekly. Unzip the linen cover and wash it at 30°, then refit it while slightly damp.',
 armchair:'Vacuum the bouclé gently with a brush head. Spot clean with mild soap and cool water.',
 coffee:'Wipe with a damp cloth and dry. Refresh the hardwax oil once a year; light marks sand out.',
 side:'Wipe with a damp cloth and dry. Refresh the hardwax oil once a year.',
 bed:'Dust the oak with a dry cloth. Unzip and wash the headboard cover at 30°.',
 mattress:'Turn it head to foot every three months for the first year. Use a protector and air it when you change the sheets.',
 night:'Wipe with a damp cloth and dry. Refresh the hardwax oil once a year.',
 wardrobe:'Wipe with a soft dry cloth. Keep it a little away from radiators.',
 stool:'Wipe the oak with a damp cloth. Brush dust out of the rattan weave with a soft brush.',
 island:'Seal the limestone once a year. Wipe up wine, lemon and oil quickly, they can mark honed stone.',
 dining:'Wipe with a damp cloth and dry. Refresh the hardwax oil once a year; light marks sand out.',
 rocker:'Rinse with fresh water after salty or dusty days. Store the cushions dry.',
 swing:'Rinse with fresh water after salty days. Check the hanging point every season.',
 lounger:'Rinse with fresh water after salty or dusty days. Let the sling dry in the sun.',
 lamp:'Unplug before cleaning. Dust the shade with a soft brush and the base with a dry cloth.',
 pendant:'Switch off at the wall, then dust with a soft dry cloth. No sprays on the matte finish.',
 rug:'Vacuum without a beater bar. Blot spills, do not rub.',
 mirror:'Clean the glass with a cloth and water only. Dust the oak frame dry.',
 throw:'Machine wash at 30° and dry flat.'
};
/* crops of the suite photos that show a product in the room */
const PHOTOS={
 'haven-l':{src:'assets/images/suite.webp',pos:'86% 100%',size:'320%'},
 quarry:{src:'assets/images/suite.webp',pos:'67% 68%',size:'320%'},
 reef:{src:'assets/images/suite.webp',pos:'62% 72%',size:'320%'},
 tide:{src:'assets/images/suite.webp',pos:'51% 59%',size:'320%'},
 harbor:{src:'assets/images/suite.webp',pos:'50% 34%',size:'320%'},
 porch:{src:'assets/images/balcony.webp',pos:'0% 100%',size:'300%'},
 nest:{src:'assets/images/balcony.webp',pos:'18% 57%',size:'300%'}
};
const ROOMS=[['all','All products'],['living','Living room'],['bedroom','Bedroom'],['kitchen','Kitchen and dining'],['balcony','Balcony'],['decor','Lighting and decor']];
const TILES=[['sofa','Sofas'],['armchair','Armchairs'],['coffee','Tables'],['bed','Beds'],['mattress','Mattresses'],['wardrobe','Storage'],['stool','Bar stools'],['rocker','Outdoor'],['lamp','Lighting'],['vase','Decor']];
const TILE_TYPES={sofa:['sofa','sectional'],armchair:['armchair'],coffee:['coffee','side','dining','island'],bed:['bed'],mattress:['mattress'],wardrobe:['wardrobe','night'],stool:['stool'],rocker:['rocker','swing','lounger'],lamp:['lamp','pendant'],vase:['vase','rug','mirror','cushion','throw']};

window.CF=window.CF||{};
Object.assign(window.CF,{COL,PRODUCTS,ROOMS,TILES,TILE_TYPES,DIMS,ABOUT,CARE,PHOTOS});
})();
