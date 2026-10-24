/* Comfyurn · optional scroll click sound, off until the visitor turns it on */
(function(){
'use strict';
const sndBtn=document.getElementById('snd'),sndLabel=sndBtn.querySelector('.sl');
let actx=null,bus=null,noiseBuf=null,soundOn=false;
function initAudio(){
  if(actx)return;
  actx=new (window.AudioContext||window.webkitAudioContext)();
  // warm lofi chain: lowpass + gentle saturation-free gain
  const lp=actx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=7000;lp.Q.value=.4;
  bus=actx.createGain();bus.gain.value=.275;
  bus.connect(lp);lp.connect(actx.destination);
  noiseBuf=actx.createBuffer(1,actx.sampleRate*.06,actx.sampleRate);
  const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);
}
// one dry click: a very short noise tap with no tone, like a scroll wheel detent
function click(speed){
  if(!soundOn||!actx)return;
  const t=actx.currentTime,s=Math.min(1,speed);
  const n=actx.createBufferSource();n.buffer=noiseBuf;n.playbackRate.value=1+Math.random()*.06;
  const hp=actx.createBiquadFilter();hp.type='highpass';hp.frequency.value=1800;hp.Q.value=.7;
  const g=actx.createGain();const peak=.12+s*.12;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+.001);g.gain.exponentialRampToValueAtTime(.0001,t+.018);
  n.connect(hp);hp.connect(g);g.connect(bus);n.start(t);n.stop(t+.03);
}
// ticks: spacing shrinks and tone brightens as scroll speeds up; slow scroll = sparse, soft ticks
let lastY=scrollY,lastT=performance.now(),acc=0,vel=0,lastClickAt=0;
addEventListener('scroll',()=>{
  if(!soundOn)return;
  const now=performance.now(),dy=Math.abs(scrollY-lastY),dt=Math.max(8,now-lastT);
  lastY=scrollY;lastT=now;
  vel=vel*.6+(dy/dt)*.4;                       // px per ms, smoothed
  const speed=Math.min(1,vel/3);               // 0 slow .. 1 fast
  const step=150-speed*105;                     // px per tick: 150 slow, 45 fast
  acc+=dy;
  if(acc>=step&&now-lastClickAt>28){acc=0;lastClickAt=now;click(speed)}
},{passive:true});
function setSound(on){
  soundOn=on;
  if(on){initAudio();actx.resume();click(.3)}
  sndBtn.setAttribute('aria-pressed',on);sndBtn.setAttribute('aria-label',on?'Turn scroll sound off':'Turn scroll sound on');
  sndLabel.textContent=on?'Sound on':'Sound off';
  try{localStorage.setItem('cf-sound',on?'on':'off')}catch(e){}
}
sndBtn.addEventListener('click',()=>setSound(!soundOn));
// remember the choice: browsers only allow audio after a gesture, so a saved "on" re-arms at the first click or key
let wantOn=false;
try{wantOn=localStorage.getItem('cf-sound')==='on'}catch(e){}
if(wantOn){
  const arm=e=>{
    removeEventListener('pointerdown',arm,true);removeEventListener('keydown',arm,true);
    if(!soundOn&&!(e.target.closest&&e.target.closest('#snd')))setSound(true);
  };
  addEventListener('pointerdown',arm,true);addEventListener('keydown',arm,true);
}
document.addEventListener('visibilitychange',()=>{if(actx)document.hidden?actx.suspend():soundOn&&actx.resume()});
})();
