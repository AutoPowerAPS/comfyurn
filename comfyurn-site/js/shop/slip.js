/* Comfyurn · order slip (checkout confirmation). Builds a PDF record of a placed order with jsPDF.
   jsPDF (js/vendor/jspdf.umd.min.js) is loaded only when the customer asks for the slip, so checkout stays light.
   Everything goes in as plain text through doc.text(): nothing the customer typed is read as HTML.
   The PDF's built-in Helvetica only draws Latin-1, so other letters become "?" rather than garbage. */
(function(){
'use strict';
const CF=window.CF;
const LIB='js/vendor/jspdf.umd.min.js';

// one line of safe text: no control or direction-override characters, Latin-1 only
const text=s=>{
  s=String(s??'').replace(/[\r\n\t]+/g,' ').replace(/[\u2013\u2014]/g,'-').replace(/[\u2018\u2019]/g,"'").replace(/[\u201C\u201D]/g,'"');
  return [...s].filter(c=>!/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2066-\u2069]/.test(c))
    .map(c=>c.codePointAt(0)>255?'?':c).join('');
};
const file=num=>'Comfyurn-'+(text(num).replace(/[^A-Za-z0-9-]/g,'').replace(/^-+/,'')||'order')+'.pdf';
const day=iso=>{const d=new Date(String(iso)+'T12:00:00');return isNaN(d)?'':d.toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'})};
// the customer's own calendar day as YYYY-MM-DD (toISOString would give the UTC day)
const today=(d=new Date())=>[d.getFullYear(),d.getMonth()+1,d.getDate()].map((n,i)=>String(n).padStart(i?2:4,'0')).join('-');
const num=n=>Number.isFinite(+n)?+n:0;

// the slip as a list of lines: k is the kind (title, meta, head, text, item, sum, total, note), l left text, r right text
function lines(o){
  o=o||{};
  const its=Array.isArray(o.items)?o.items:[];
  const out=[{k:'title',l:'Comfyurn'},{k:'meta',l:'Order '+text(o.num),r:day(o.date)}];
  const block=(h,rows)=>{out.push({k:'head',l:h});rows.filter(r=>text(r)).forEach(r=>out.push({k:'text',l:text(r)}))};
  block(o.pickup?'Pickup':'Delivery to',[o.name,...(o.pickup?['Comfyurn suite']:(Array.isArray(o.where)?o.where:[]))]);
  block('Method',[o.method,o.when]);
  block('Contact',[o.email,o.phone]);
  block('Payment',[o.payment]);
  out.push({k:'head',l:'Items'});
  its.forEach(i=>out.push({k:'item',l:`${text(i&&i.name)} · ${text(i&&i.colour)} × ${num(i&&i.qty)}`,r:CF.money(num(i&&i.total))}));
  out.push({k:'sum',l:'Subtotal',r:CF.money(num(o.subtotal))});
  if(o.code&&num(o.off))out.push({k:'sum',l:'Discount '+text(o.code),r:'- '+CF.money(num(o.off))});
  out.push({k:'total',l:'Total, VAT included',r:CF.money(num(o.total))});
  out.push({k:'sum',l:`VAT ${CF.VAT}% inside the total`,r:CF.money(CF.vatIn(num(o.total)))});
  out.push({k:'note',l:'Demo order, nothing charged. Keep this slip as your record.'});
  return out;
}

// lay the lines out on A4 pages; long text wraps, a full page starts the next
const STYLE={title:[22,'bold',14],meta:[10,'normal',10],head:[8,'bold',9],text:[11,'normal',5.6],item:[11,'normal',6.4],sum:[10,'normal',6],total:[12,'bold',8],note:[9,'italic',10]};
function build(o,JsPDF){
  const doc=new JsPDF({unit:'mm',format:'a4'});
  const M=18,W=210-2*M,BOTTOM=297-M,RIGHT=34;
  let y=M+4;
  lines(o).forEach(l=>{
    const [size,face,lead]=STYLE[l.k];
    doc.setFont('helvetica',face);doc.setFontSize(size);
    const wrap=doc.splitTextToSize(text(l.l).replace(/·/g,'-').replace(/×/g,'x'),l.r?W-RIGHT:W);
    if(l.k==='head'||l.k==='total')y+=4;
    wrap.forEach((w,n)=>{
      if(y>BOTTOM){doc.addPage();y=M+4}
      doc.text(w,M,y);
      if(n===0&&l.r)doc.text(text(l.r),M+W,y,{align:'right'});
      y+=size*.42;
    });
    y+=lead-size*.42;
  });
  return doc;
}

// load jsPDF once; a failed load can be tried again
let loading=null;
function load(){
  if(window.jspdf)return Promise.resolve(window.jspdf);
  return loading||(loading=new Promise((ok,fail)=>{
    const s=document.createElement('script');
    s.src=LIB;
    s.onload=()=>window.jspdf?ok(window.jspdf):fail(new Error('jsPDF missing'));
    s.onerror=()=>{s.remove();fail(new Error('jsPDF failed to load'))};
    document.head.append(s);
  }).catch(e=>{loading=null;throw e}));
}
const save=o=>load().then(J=>build(o,J.jsPDF).save(file(o.num)));

CF.slip={text,file,today,lines,build,load,save};
})();
