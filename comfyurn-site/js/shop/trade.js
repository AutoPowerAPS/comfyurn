/* Comfyurn · trade and bulk enquiry form inside the product page's "Trade and bulk orders" fold-out (#tradeBody).
   Checks each field, then thanks the visitor. Demo: nothing is sent. */
(function(){
'use strict';
const CF=window.CF;
const box=document.getElementById('tradeBody');
if(!box||!CF.current)return;
const p=CF.current.p;
const $=id=>document.getElementById(id);
const INDUSTRIES=['Hotel or guest house','Restaurant, bar or café','Office','Interior design or architecture','Builder or developer','School or healthcare','Retail','Other'];

box.innerHTML=`
  <p>Buying for a business? Tell us what you need and our trade team would reply within two working days with pricing and lead times.</p>
  <form class="trade-f" id="tradeForm" novalidate>
    <div class="fld-two">
      <label class="fld">First name<input id="tfFirst" autocomplete="given-name"><span class="fld-err" id="tfFirst-err"></span></label>
      <label class="fld">Last name (optional)<input id="tfLast" autocomplete="family-name"></label>
    </div>
    <div class="fld-two">
      <label class="fld">Mobile<input id="tfPhone" type="tel" inputmode="tel" autocomplete="tel"><span class="fld-err" id="tfPhone-err"></span></label>
      <label class="fld">Email<input id="tfEmail" type="email" autocomplete="email"><span class="fld-err" id="tfEmail-err"></span></label>
    </div>
    <div class="fld-two">
      <label class="fld">Business name<input id="tfBiz" autocomplete="organization"><span class="fld-err" id="tfBiz-err"></span></label>
      <label class="fld">PAN or VAT number<input id="tfPan" inputmode="numeric" maxlength="9" placeholder="9 digits"><span class="fld-err" id="tfPan-err"></span></label>
    </div>
    <div class="fld-two">
      <label class="fld">Industry<select id="tfInd"><option value="">Choose one</option>${INDUSTRIES.map(i=>`<option>${i}</option>`).join('')}</select><span class="fld-err" id="tfInd-err"></span></label>
      <label class="fld">How many ${CF.esc(p.name)}?<input id="tfQty" type="number" min="1" inputmode="numeric" value="10"><span class="fld-err" id="tfQty-err"></span></label>
    </div>
    <label class="fld">Website (optional)<input id="tfWeb" type="url" inputmode="url" autocomplete="url" placeholder="https://"></label>
    <label class="fld">Anything else (optional)<textarea id="tfMsg" rows="3" placeholder="Finishes, deadlines, delivery site"></textarea></label>
    <label class="chk-row"><input type="checkbox" id="tfAgree"><span>I agree to be contacted about this enquiry</span></label>
    <span class="fld-err" id="tfAgree-err"></span>
    <button class="btn" type="submit">Send enquiry</button>
  </form>`;

const form=$('tradeForm');
function err(id,msg){$(id+'-err').textContent=msg;$(id).setAttribute('aria-invalid',!!msg);return !msg}
form.addEventListener('submit',e=>{
  e.preventDefault();
  const v=id=>$(id).value.trim();
  const checks=[
    ['tfFirst',v('tfFirst')?'':'Enter your first name'],
    ['tfPhone',v('tfPhone').replace(/\D/g,'').length>=8?'':v('tfPhone')?'Enter a valid mobile number':'Enter your mobile number'],
    ['tfEmail',!v('tfEmail')?'Enter your email':CF.emailOk(v('tfEmail'))?'':'Enter a valid email'],
    ['tfBiz',v('tfBiz')?'':'Enter your business name'],
    ['tfPan',/^\d{9}$/.test(v('tfPan'))?'':v('tfPan')?'A PAN or VAT number has 9 digits':'Enter your PAN or VAT number'],
    ['tfInd',v('tfInd')?'':'Choose an industry'],
    ['tfQty',+v('tfQty')>=1?'':'Enter how many you need'],
    ['tfAgree',$('tfAgree').checked?'':'Tick the box so we can reply']
  ];
  const bad=checks.filter(([id,msg])=>!err(id,msg));
  if(bad.length){$(bad[0][0]).focus();return}
  box.innerHTML=`<div class="trade-done" role="status" tabindex="-1"><h3>Thank you, ${CF.esc(v('tfFirst'))}.</h3><p>An enquiry for ${CF.esc(v('tfQty'))} × ${CF.esc(p.name)} for ${CF.esc(v('tfBiz'))} would now reach our trade team. This is a demo, so nothing was sent.</p></div>`;
  box.querySelector('.trade-done').focus();
});
})();
