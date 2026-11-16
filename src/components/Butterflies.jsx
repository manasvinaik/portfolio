import {useEffect,useRef} from 'react';
import {Flock} from '../butterflies/flock.js';import {butterflies} from '../butterflies/butterflies.js';
import {createPen} from '../butterflies/pen.js';import {prefersReduced} from '../lib/scramble.js';
// Draws the morpho flock as pixel cells on two canvases: far ones behind the hero text, near ones in front.
export default function Butterflies(){
 const backRef=useRef(),frontRef=useRef();
 useEffect(()=>{
  const cb=backRef.current,cf=frontRef.current,xb=cb.getContext('2d'),xf=cf.getContext('2d'),reduced=prefersReduced();
  const flock=new Flock(butterflies,{...butterflies.defaults});let dust=[],W=0,H=0,raf=0,last=performance.now(),vis=true,acc=0;
  const pen=createPen(()=>flock.tuning.trail,d=>{if(dust.length<700)dust.push(d)});
  const render=t=>{xb.clearRect(0,0,W,H);xf.clearRect(0,0,W,H);pen.t=t;
   for(const d of dust){const ctx=d.layer?xf:xb;ctx.fillStyle=`rgba(96,156,255,${Math.max(0,d.life)*.5*d.a})`;ctx.fillRect(Math.round(d.x/d.cw)*d.cw,Math.round(d.y/d.cw)*d.cw,d.cw-1,d.cw-1)}
   for(const c of flock.creatures){pen.layer=c.depth<.5?0:1;pen.ctx=pen.layer?xf:xb;pen.cw=Math.max(3,Math.min(10,Math.round(c.span/16)));pen.alpha=.5+.5*c.depth;butterflies.draw(c,pen)}};
  const resize=()=>{const r=cb.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);W=r.width;H=r.height;
   [cb,cf].forEach(c=>{c.width=W*dpr;c.height=H*dpr;c.getContext('2d').setTransform(dpr,0,0,dpr,0,0)});if(W>0&&H>0)flock.resize(W,H);if(reduced)render(0)};
  const loop=now=>{raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;if(!vis||document.hidden||!flock.width)return;
   acc+=dt;let n=0;while(acc>=1/60&&n<4){flock.step(1/60);acc-=1/60;n++}if(n===4)acc=0;const rate=flock.tuning.trailFade*8;for(const d of dust)d.life-=dt*rate;dust=dust.filter(d=>d.life>0);render(now/1000)};
  const onMove=e=>{const r=cb.getBoundingClientRect(),p=flock.pointer;p.x=e.clientX-r.left;p.y=e.clientY-r.top;p.on=p.y>=0&&p.y<=r.height};
  const onLeave=()=>{flock.pointer.on=false};
  const onDown=e=>{if(e.target.closest&&e.target.closest('a,button'))return;const r=cb.getBoundingClientRect(),y=e.clientY-r.top;if(y<0||y>r.height)return;flock.startle(e.clientX-r.left,y)};
  const ro=new ResizeObserver(resize);ro.observe(cb);resize();
  const io=new IntersectionObserver(([e])=>{vis=e.isIntersecting});io.observe(cb);
  if(!reduced){addEventListener('pointermove',onMove);addEventListener('pointerdown',onDown);document.documentElement.addEventListener('mouseleave',onLeave);raf=requestAnimationFrame(loop)}
  return()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();removeEventListener('pointermove',onMove);removeEventListener('pointerdown',onDown);document.documentElement.removeEventListener('mouseleave',onLeave)}},[]);
 return <><canvas ref={backRef} className="bfly bfly--back" aria-hidden="true"/><canvas ref={frontRef} className="bfly bfly--front" aria-hidden="true"/></>;
}
