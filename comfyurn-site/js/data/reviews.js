/* Comfyurn · example customer reviews (fictional, written for the demo; the page says so).
   Per product id: r rating, t title, b text, n name, d date (YYYY-MM-DD), c index into that product's colours.
   The summary score and count come from the catalogue (rate, rev); these are a sample of what a shopper would read. */
(function(){
'use strict';
const REVIEWS={
 haven:[
  {r:5,t:'Deep enough to nap on',b:'We measured three sofas in the suite and this was the one we kept coming back to. The seat is firm at first and settles after a few weeks.',n:'Priya S.',d:'2026-09-02',c:0},
  {r:5,t:'The cover really does unzip',b:'Red wine on day four. Unzipped the seat covers, washed at 30, back on the same evening.',n:'Tom W.',d:'2026-07-18',c:1},
  {r:4,t:'Lovely, a little long for our room',b:'Check the 220 cm. It fits, but only just. The linen is softer than in the photos.',n:'Hannah L.',d:'2026-05-11',c:0},
  {r:5,t:'Lifted the leg in the suite',b:'Did the lift test at the suite and the whole frame came up with it. That sold it.',n:'Marcus O.',d:'2026-02-23',c:2}
 ],
 'haven-l':[
  {r:5,t:'The chaise is the best seat in the house',b:'Long enough to lie flat on, and the corner block means no gap between the two halves.',n:'Ellie R.',d:'2026-08-14',c:0},
  {r:5,t:'Two people, two hours, done',b:'The team checked our stairwell first, then carried it up in two parts and joined it in the room.',n:'Dev P.',d:'2026-06-03',c:1},
  {r:4,t:'Big, in a good way',b:'Takes up more floor than we pictured, so tape it out first. Comfort is excellent.',n:'Grace M.',d:'2026-03-29',c:0},
  {r:5,t:'Same foam as the Haven',b:'We had the Haven before and wanted the same sit in a corner shape. It matches.',n:'Leon K.',d:'2025-12-12',c:1}
 ],
 drift:[
  {r:5,t:'My reading chair now',b:'Small footprint, deep seat, arms at exactly the right height for a cup.',n:'Ana V.',d:'2026-09-20',c:0},
  {r:5,t:'The bouclé is thick',b:'Not the thin loop fabric you see elsewhere. Our cat has tried and failed to pull it.',n:'Jon B.',d:'2026-07-01',c:1},
  {r:5,t:'Bought a second one',b:'The first went in the bedroom, the second by the window. They face each other now.',n:'Sasha T.',d:'2026-04-17',c:2},
  {r:4,t:'Sits upright',b:'More upright than a lounge chair. Great for reading, less so for slouching.',n:'Kieran F.',d:'2026-01-08',c:0}
 ],
 shore:[
  {r:5,t:'Heavy, in a reassuring way',b:'Solid oak all through. You can feel it when you try to slide it.',n:'Maya R.',d:'2026-08-30',c:0},
  {r:5,t:'Marks sand out',b:'A hot mug left a ring. Light sanding and a coat of the oil they include, gone.',n:'Felix H.',d:'2026-05-22',c:0},
  {r:4,t:'Lower than expected',b:'38 cm is low. Fine with our deep sofa, but check yours.',n:'Rosa D.',d:'2026-03-04',c:1},
  {r:5,t:'No wobble at all',b:'Our old table wobbled from day one. This one has not moved.',n:'Ben C.',d:'2025-11-19',c:0}
 ],
 pebble:[
  {r:5,t:'Exactly lamp, cup, book',b:'The size is spot on beside an armchair.',n:'Lucy N.',d:'2026-09-09',c:0},
  {r:4,t:'Pretty, a touch light',b:'Easy to knock with a knee. Lovely grain.',n:'Omar A.',d:'2026-06-26',c:1},
  {r:5,t:'Turned column is beautiful',b:'Photos do not show how smooth the column is.',n:'Isla G.',d:'2026-04-02',c:0},
  {r:4,t:'Good value on sale',b:'Bought two in the sale. Oil finish needed one top-up after a month.',n:'Raj M.',d:'2026-02-14',c:0}
 ],
 tide:[
  {r:5,t:'Silent',b:'No creak, even with two of us and a dog. The slats sit in proper slots.',n:'Chloe E.',d:'2026-08-21',c:0},
  {r:5,t:'Headboard cover washes well',b:'Unzipped it, washed it, it went back on without a fight.',n:'Sam J.',d:'2026-06-10',c:1},
  {r:4,t:'Tall frame',b:'The 110 cm headboard is taller than our old one. Looks great, check your window sill.',n:'Nadia Q.',d:'2026-03-18',c:0},
  {r:5,t:'Built to last',b:'Assembled with bolts into oak, not screws into board.',n:'Will P.',d:'2025-12-30',c:0}
 ],
 'tide-m':[
  {r:5,t:'Edges you can sit on',b:'The support rim means no rolling off when you sit to put socks on.',n:'Ivy L.',d:'2026-09-14',c:0},
  {r:4,t:'Firm for the first fortnight',b:'Felt firm at first, softened up nicely by week three.',n:'George H.',d:'2026-07-07',c:0},
  {r:5,t:'Better sleep, honestly',b:'Fewer wake ups. My partner moves a lot and I barely notice now.',n:'Mei C.',d:'2026-04-25',c:0},
  {r:5,t:'Used the trial, kept it',b:'Glad the 100 nights were there, but we never needed them.',n:'Callum D.',d:'2026-01-31',c:0}
 ],
 cove:[
  {r:5,t:'The drawer closes itself',b:'Soft close works every time. Dovetails are real.',n:'Freya B.',d:'2026-08-05',c:0},
  {r:4,t:'Small drawer',b:'Fits a book, glasses and a charger. Not much more.',n:'Arjun S.',d:'2026-05-30',c:1},
  {r:5,t:'Bought the pair',b:'One each side of the Tide bed. They match the grain well.',n:'Zoe K.',d:'2026-02-19',c:0},
  {r:4,t:'Solid little table',b:'Heavier than it looks. Finish is matte and easy to wipe.',n:'Patrick M.',d:'2025-10-28',c:0}
 ],
 harbor:[
  {r:5,t:'Holds everything',b:'Rail, shelves and the two drawers swallowed two people worth of clothes.',n:'Lena W.',d:'2026-07-23',c:0},
  {r:4,t:'Worth the wait',b:'Made to order, so it took five weeks. They kept us updated.',n:'Hugo F.',d:'2026-04-12',c:1},
  {r:4,t:'Measure your ceiling',b:'220 cm tall. We had 10 cm to spare.',n:'Amira T.',d:'2026-01-20',c:0},
  {r:5,t:'Doors close softly',b:'No slam, and they line up perfectly.',n:'Noah V.',d:'2025-11-05',c:0}
 ],
 reef:[
  {r:5,t:'Footrest at the right height',b:'Most stools get this wrong. Here my feet land on it naturally.',n:'Tess A.',d:'2026-09-17',c:0},
  {r:5,t:'Rattan is tight and even',b:'Hand woven, no loose ends after six months of daily use.',n:'Luca R.',d:'2026-06-29',c:0},
  {r:4,t:'Check your counter height',b:'75 cm seat suits a 90 to 95 cm counter. Ours is 92, perfect.',n:'Erin O.',d:'2026-03-15',c:1},
  {r:5,t:'Bought four',b:'They look great lined up at the island.',n:'Max Y.',d:'2025-12-03',c:0}
 ],
 quarry:[
  {r:5,t:'The stone is stunning',b:'Honed limestone feels soft under the hand. Worth sealing as they say.',n:'Olivia J.',d:'2026-08-08',c:0},
  {r:4,t:'Lemon marked it',b:'Our fault, we left a cut lemon on it. Read the care notes.',n:'Ethan G.',d:'2026-05-03',c:1},
  {r:5,t:'Storage on both sides',b:'Drawers on our side, cupboards on the stool side. Clever.',n:'Ruby H.',d:'2026-02-06',c:0},
  {r:4,t:'Long lead time',b:'Made to order. Six weeks, but the fit and finish are excellent.',n:'Finn C.',d:'2025-10-14',c:0}
 ],
 table8:[
  {r:5,t:'Seats eight properly',b:'Eight adults, no knocking knees on legs.',n:'Clara S.',d:'2026-07-27',c:0},
  {r:5,t:'Does not wobble',b:'Mortise and tenon, you can tell.',n:'Rory P.',d:'2026-05-15',c:0},
  {r:4,t:'Back on pre-order',b:'Was out of stock when we ordered. Arrived on the date they gave us.',n:'Elena D.',d:'2026-02-28',c:0},
  {r:5,t:'Family table',b:'Homework, dinners, jigsaws. Wipes clean every time.',n:'Jamal N.',d:'2025-12-20',c:0}
 ],
 porch:[
  {r:5,t:'Rocks smoothly',b:'Long, slow rock. Sits right on our uneven deck boards.',n:'Harriet L.',d:'2026-09-01',c:0},
  {r:5,t:'Salt air, no rust',b:'Six months by the sea and the fixings still look new.',n:'Ollie M.',d:'2026-06-16',c:0},
  {r:5,t:'Cushion dries fast',b:'Caught in a shower, dry within the hour.',n:'Bea R.',d:'2026-03-24',c:1},
  {r:4,t:'Teak greys over time',b:'Expected, and we like it. Oil it if you want the colour back.',n:'Simon K.',d:'2025-11-30',c:0}
 ],
 nest:[
  {r:5,t:'The kids fight over it',b:'Strong, comfy and it spins just enough.',n:'Kate T.',d:'2026-08-19',c:0},
  {r:4,t:'Get the hanging point checked',b:'We needed a joist. Once hung, it is rock solid.',n:'Dan E.',d:'2026-05-08',c:0},
  {r:5,t:'UV safe is real',b:'A full summer on a sunny balcony and no fading.',n:'Nina F.',d:'2026-02-11',c:0},
  {r:4,t:'Cushion could be thicker',b:'Lovely chair. We added a second cushion.',n:'Theo B.',d:'2025-12-07',c:0}
 ],
 dune:[
  {r:4,t:'Five positions, all useful',b:'Flat for sun, upright for reading.',n:'Mila W.',d:'2026-08-27',c:0},
  {r:5,t:'Sling dries in minutes',b:'Straight from the pool to the lounger, dry by the time we are.',n:'Aaron S.',d:'2026-06-04',c:1},
  {r:4,t:'Heavier than it looks',b:'Teak, so moving it round the balcony takes effort.',n:'Holly C.',d:'2026-03-09',c:0},
  {r:5,t:'Sale price was great',b:'Bought two in the sale. No regrets.',n:'Victor L.',d:'2025-11-22',c:1}
 ],
 lumen:[
  {r:5,t:'Warm, soft light',b:'The linen shade makes 2700K feel like candle light.',n:'June P.',d:'2026-09-11',c:0},
  {r:5,t:'Fabric cable is a nice touch',b:'Two metres was enough to reach the socket behind the sofa.',n:'Alfie R.',d:'2026-06-19',c:1},
  {r:4,t:'Shade a little narrow',b:'Light goes up and down more than sideways. Fine for a side table.',n:'Pia H.',d:'2026-04-06',c:0},
  {r:5,t:'Bought one, then another',b:'Pair on the console now.',n:'Ravi D.',d:'2026-01-13',c:0}
 ],
 halo:[
  {r:5,t:'Perfect over the island',b:'Adjustable drop let us set it just right.',n:'Elsa M.',d:'2026-08-02',c:0},
  {r:4,t:'Matte finish shows fingerprints',b:'Only while fitting it. Looks great once up.',n:'Kai O.',d:'2026-05-26',c:1},
  {r:5,t:'Three in a row',b:'Ordered three for the dining table. They match exactly.',n:'Anya T.',d:'2026-02-21',c:0},
  {r:4,t:'Electrician needed',b:'Not a plug in light, so budget for fitting.',n:'Ross G.',d:'2025-10-30',c:0}
 ],
 urn:[
  {r:5,t:'Truly watertight',b:'Fresh flowers every week, no damp rings on the shelf.',n:'Daisy F.',d:'2026-09-23',c:0},
  {r:5,t:'Every one is slightly different',b:'Hand thrown, so ours has a little lean. We love it.',n:'Leo S.',d:'2026-07-12',c:1},
  {r:5,t:'The sea glaze',b:'The blue is softer in person, very calm.',n:'Mira K.',d:'2026-04-28',c:1},
  {r:4,t:'Smaller than I pictured',b:'34 cm is tall enough for stems, but check the photo scale.',n:'Owen J.',d:'2026-02-02',c:2}
 ],
 sandbar:[
  {r:5,t:'Reversible saves it',b:'Flipped it after a year and it looks new.',n:'Fiona B.',d:'2026-08-25',c:0},
  {r:4,t:'Jute sheds at first',b:'Vacuum a few times in the first fortnight, then it settles.',n:'Theo W.',d:'2026-06-07',c:1},
  {r:5,t:'Texture is lovely underfoot',b:'Wool softens the jute nicely.',n:'Lara P.',d:'2026-03-13',c:0},
  {r:4,t:'Big rug, big parcel',b:'Rolled tight and easy to place.',n:'Ian C.',d:'2025-12-15',c:0}
 ],
 arch:[
  {r:5,t:'Makes the room feel twice as big',b:'Leaned in the hallway, it doubles the light.',n:'Sofia A.',d:'2026-09-05',c:0},
  {r:5,t:'Clear glass',b:'No warping at the edges.',n:'Henry D.',d:'2026-06-22',c:1},
  {r:4,t:'Fix it to the wall',b:'They include a strap. Use it if you have pets or kids.',n:'Maisie L.',d:'2026-04-09',c:0},
  {r:5,t:'Oak frame matches our floor',b:'Same tone as our boards.',n:'Adam R.',d:'2026-01-26',c:0}
 ],
 cloud:[
  {r:5,t:'Softer every wash',b:'They mean it. Three washes in, they feel like old shirts.',n:'Esme T.',d:'2026-09-19',c:1},
  {r:5,t:'Hidden zip is hidden',b:'You really cannot see it.',n:'Jack H.',d:'2026-07-08',c:0},
  {r:4,t:'Insert not included',b:'Says so clearly, but worth noting.',n:'Rosie N.',d:'2026-04-15',c:2},
  {r:5,t:'Mixed the colours',b:'Stone and sea on the Haven look great together.',n:'Zain M.',d:'2026-01-29',c:1}
 ],
 tidewrap:[
  {r:5,t:'Waffle texture is cosy',b:'Light enough for summer evenings, warm enough for winter.',n:'Alice B.',d:'2026-09-08',c:0},
  {r:5,t:'Fringe survived the wash',b:'No fraying after several washes.',n:'Ollie S.',d:'2026-06-30',c:1},
  {r:4,t:'Bit smaller than a blanket',b:'Perfect throw size, not a bed cover.',n:'Mae K.',d:'2026-03-21',c:0},
  {r:5,t:'Bought as a gift, kept it',b:'Too nice to give away.',n:'Ted F.',d:'2025-12-18',c:1}
 ]
};
window.CF=window.CF||{};
window.CF.REVIEWS=REVIEWS;
})();
