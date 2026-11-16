import {useEffect,useRef} from 'react';import Scramble from './Scramble.jsx';import Butterflies from './Butterflies.jsx';import {me} from '../data.js';
const CELL=16,LET='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export default function Hero({ready}){
 const sec=useRef(),cv=useRef();
 useEffect(()=>{
  const c=cv.current,x=c.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2);
  let W,H,cols,rows,glow,rg,chars,base,ripples=[],raf,last=performance.now();const mouse={x:-999,y:-999};
  const setup=()=>{const r=sec.current.getBoundingClientRect();W=r.width;H=r.height;c.width=W*dpr;c.height=H*dpr;c.style.width=W+'px';c.style.height=H+'px';
   cols=Math.ceil(W/CELL);rows=Math.ceil(H/CELL);glow=new Float32Array(cols*rows);rg=new Float32Array(cols*rows);chars=Array.from({length:cols*rows},()=>LET[Math.random()*LET.length|0]);
   base=document.createElement('canvas');base.width=W*dpr;base.height=H*dpr;const b=base.getContext('2d');b.scale(dpr,dpr);b.font='12px JetBrains Mono,monospace';b.textAlign='center';b.textBaseline='middle';b.fillStyle='rgba(232,228,216,.07)';
   for(let j=0;j<rows;j++)for(let i=0;i<cols;i++)b.fillText(chars[j*cols+i],i*CELL+8,j*CELL+8)};
  setup();
  const loop=now=>{raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;
   x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);x.drawImage(base,0,0,W,H);
   for(let k=0;k<glow.length;k++){glow[k]*=.93;rg[k]*=.94}
   const mi=Math.floor(mouse.x/CELL),mj=Math.floor(mouse.y/CELL);
   for(let j=mj-10;j<=mj+10;j++)for(let i=mi-10;i<=mi+10;i++){if(i<0||j<0||i>=cols||j>=rows)continue;const d=Math.hypot(i*CELL+8-mouse.x,j*CELL+8-mouse.y);if(d<150)glow[j*cols+i]=Math.max(glow[j*cols+i],1-d/150)}
   for(let k=ripples.length-1;k>=0;k--){const r=ripples[k];r.t+=dt;if(r.t>1.7){ripples.splice(k,1);continue}const rad=r.t*440,fade=1-r.t/1.7;
    for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const d=Math.hypot(i*CELL+8-r.x,j*CELL+8-r.y);if(Math.abs(d-rad)<CELL*1.5)rg[j*cols+i]=Math.max(rg[j*cols+i],fade)}}
   x.font='12px JetBrains Mono,monospace';x.textAlign='center';x.textBaseline='middle';
   for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const k=j*cols+i,g=glow[k],r=rg[k];
    if(r>.04&&r>=g){x.fillStyle=`rgba(110,165,255,${Math.min(1,r)})`;x.fillText(chars[k],i*CELL+8,j*CELL+8)}
    else if(g>.04){x.fillStyle=`rgba(236,232,220,${Math.min(1,g)*.9})`;x.fillText(chars[k],i*CELL+8,j*CELL+8)}}};
  raf=requestAnimationFrame(loop);
  const pos=e=>{const r=sec.current.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
  const mm=e=>{[mouse.x,mouse.y]=pos(e)},ml=()=>{mouse.x=mouse.y=-999};
  const ck=e=>{if(e.target.closest('a,button'))return;const[px,py]=pos(e);ripples.push({x:px,y:py,t:0})};
  const s=sec.current;s.addEventListener('mousemove',mm);s.addEventListener('mouseleave',ml);s.addEventListener('click',ck);addEventListener('resize',setup);
  return()=>{cancelAnimationFrame(raf);s.removeEventListener('mousemove',mm);s.removeEventListener('mouseleave',ml);s.removeEventListener('click',ck);removeEventListener('resize',setup)}},[]);
 return <header id="top" className="hero" ref={sec}><canvas ref={cv}/><Butterflies/>
  <p className="lure">Move to lure the butterflies. Click to scatter them.</p>
  <div className="hero-text" key={String(ready)}><p className="hi"><Scramble text={me.hello} every={9000}/></p><h1><Scramble text={me.name} every={7000}/></h1><p className="tag">{me.tagline}</p></div></header>;
}
