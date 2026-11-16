/**
 * Blue morpho butterflies on migration (JS port).
 * Each lobe (forewing, hindwing) is a fan in polar coordinates around its root on the body.
 * Raised wings are foreshortened across the body: the sampler unfolds v by how open the wings are (the flap).
 * Flight: hold course + decaying random-walk flutter + thrust pulse per downstroke + occasional glides.
 */
import {SHARED_TUNING} from './flock.js';
import {INK_BODY,INK_DARK,INK_SHIMMER,INK_SPOT,ink} from './ink.js';
import {clamp,frac,rand,TAU} from './math.js';

const FORE={from:-0.3,to:1.0,reach:0.56,peak:0.55,round:0.5,scallop:0};
const HIND={from:-1.45,to:0.15,reach:0.44,peak:0.48,round:0.42,scallop:0.04};
const FORE_ROOT=0.06,HIND_ROOT=-0.02;
const BODY=[30,30,42];
const FLAP_HZ=2.6,GLIDE=0.35,FLUTTER=1.3;

function lobeReach(l,phi,t=(phi-l.from)/(l.to-l.from)){
 if(t<=0||t>=1)return 0;
 const s=t<l.peak?(t/l.peak)*0.5:0.5+((t-l.peak)/(1-l.peak))*0.5;
 const R=l.reach*Math.pow(Math.sin(Math.PI*s),l.round);
 return l.scallop?R*(1-l.scallop*(0.5+0.5*Math.cos(t*Math.PI*14))):R;
}
function bodyHalfWidth(u){
 if(u>0.17||u<-0.32)return 0;
 if(u>0.11)return Math.sqrt(Math.max(0,0.03*0.03-(u-0.14)**2));
 if(u>-0.04)return 0.034;
 return 0.03*(1-0.6*((-0.04-u)/0.28));
}
const lobe={t:0,r:0};
function inLobe(l,du,vw){
 const phi=Math.atan2(du,vw),t=(phi-l.from)/(l.to-l.from),R=lobeReach(l,phi,t),r=Math.hypot(du,vw);
 if(r>R)return false;
 lobe.t=t;lobe.r=r/R;return true;
}

const DEFAULTS={...SHARED_TUNING,density:1.05,speed:1.05,sway:0,spread:0,size:1.25,farthest:0.18,farBias:1.7,grip:5,separation:700,trail:1.55,trailFade:0.15,flutter:0,glide:2.75,flapRate:1};

export const butterflies={
 defaults:DEFAULTS,
 area:25000, // ← screen px² per butterfly (lower = more butterflies)
 max:56,     // ← most butterflies ever on screen
 scale:1,speed:90,

 create:(c)=>({...c,phase:rand(0,TAU),open:1,glide:0,glideUntil:0,flutterX:0,flutterY:0}),
 enter(b){b.flutterX=0;b.flutterY=0},

 update(b,flock,dt){
  const k=flock.tuning,t=flock.time,cruise=flock.cruise(b),acc=flock.begin();
  flock.steer(b,flock.heading+b.bias*k.spread,cruise,k.grip);
  const kick=Math.sqrt(dt)*520*FLUTTER*k.flutter*(1-0.8*b.glide)*(0.5+0.5*b.depth);
  b.flutterX+=-b.flutterX*3*dt+(Math.random()*2-1)*kick;
  b.flutterY+=-b.flutterY*3*dt+(Math.random()*2-1)*kick;
  acc.x+=b.flutterX;acc.y+=b.flutterY;
  const down=Math.max(0,-Math.sin(b.phase))*(1-b.glide);
  acc.x+=Math.cos(b.heading)*down*cruise*1.4;
  acc.y+=Math.sin(b.heading)*down*cruise*1.4;
  flock.separate(b);
  const speed=flock.move(b,dt,cruise*2.2);
  if(flock.passed(b))flock.reenter(b);
  if(speed>12)flock.face(b,dt);
  if(b.glide<0.5&&t>b.glideUntil&&speed>cruise*0.5&&Math.random()<GLIDE*k.glide*dt)b.glideUntil=t+rand(0.5,1.4);
  b.glide+=((t<b.glideUntil?1:0)-b.glide)*Math.min(1,dt*6);
  const urgency=clamp(speed/(cruise*2),0,1);
  b.phase+=dt*TAU*FLAP_HZ*k.flapRate*(0.8+0.6*urgency)*(1-0.9*b.glide);
  const beat=Math.pow(0.5+0.5*Math.cos(b.phase),0.8);
  b.open=0.1+0.9*(beat*(1-b.glide)+0.96*b.glide);
 },

 startle(b,dx,dy,strength,flock){
  const k=strength*950*(0.4+0.6*b.depth);
  b.vx+=dx*k;b.vy+=dy*k;
  b.startledUntil=flock.time+rand(1.4,2.4);
  b.glideUntil=0;
 },

 draw(b,pen){
  const S=b.span,open=Math.max(0.08,b.open),ink$=pen.ink;
  const pose={x:b.x,y:b.y,heading:b.heading+0.06*Math.sin(b.phase),span:S,depth:b.depth,id:b.id};
  const minBody=pen.cw*0.4;
  pen.shape(pose,0.75,(u,v)=>{
   const av=Math.abs(v),bw=bodyHalfWidth(u);
   if(bw>0&&av*S<=Math.max(bw*S,minBody)){ink(ink$,...BODY,INK_BODY);return true}
   const vw=av/open;let part;
   if(inLobe(FORE,u-FORE_ROOT,vw))part=0;
   else if(inLobe(HIND,u-HIND_ROOT,vw))part=1;
   else return false;
   const {t,r}=lobe;
   if(r>0.86){
    if(part===0&&r<0.95&&Math.abs(frac(t*5)-0.5)<0.14)ink(ink$,236,240,255,INK_SPOT);
    else ink(ink$,22,28,62,INK_DARK);
   }else if(r<0.08)ink(ink$,26,44,110,INK_DARK);
   else if(part===0&&t>0.9)ink(ink$,30,50,120,INK_DARK);
   else ink(ink$,50+70*r,135+60*r,255,INK_SHIMMER);
   return true;
  },{light:0.6+0.4*b.open,tilt:b.open*3});

  const sway=0.012*Math.sin(pen.t*3+b.id);
  for(const side of [-1,1])pen.lineBody(pose,0.16,0.012*side,0.37+sway,(0.12+sway)*side,pen.contrast,S>120?'o':undefined);

  const stroke=Math.max(0,-Math.sin(b.phase))*(1-b.glide);
  const phi=FORE.from+(FORE.to-FORE.from)*FORE.peak;
  const tipU=FORE_ROOT+Math.sin(phi)*FORE.reach*0.95,tipV=Math.cos(phi)*FORE.reach*0.95*b.open;
  const at={x:0,y:0};
  for(const side of [-1,1]){pen.toWorld(pose,tipU,tipV*side,at);pen.shed(at.x,at.y,(0.02+0.1*stroke)*b.depth)}
 },
};
