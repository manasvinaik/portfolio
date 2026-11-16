import {useEffect,useRef} from 'react';
const R=['        █▀████▄','        ███████','        ████▀▀▀','▄      ▄████▀▀ ','█▄   ▄██████▀█ ',' ▀██████████   ','   ▀████████   '];
const L=[['      ██ ██    ','      ██▄      '],['      ██ ██    ','         ██▄   ']];
const CAC=['  ███  ','█ ███ █','█▄███▄█','  ███  ','  ███  '];
const flip=s=>[...s].reverse().map(c=>c==='▌'?'▐':c==='▐'?'▌':c).join('');
const DW=92,H=210;
export default function Timeline({jobs,onActive}){
 const cv=useRef();
 useEffect(()=>{const c=cv.current,x=c.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2),sec=c.closest('section');
  let W,raf,t=0,dx=20,tx=20,dir=1,y=0,vy=0,off=0,act=0,last=performance.now();
  const size=()=>{W=c.parentElement.clientWidth;c.width=W*dpr;c.height=H*dpr;c.style.width=W+'px';c.style.height=H+'px'};size();
  const mv=e=>{const r=c.getBoundingClientRect();tx=Math.max(0,Math.min(W-DW,e.clientX-r.left-DW/2))};
  const mxOf=i=>(i+1)/(jobs.length+1)*W,hop=()=>{if(y===0)vy=-400};
  const loop=now=>{raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;t+=dt;
   const d=tx-dx,mov=Math.abs(d)>3;dx+=d*Math.min(1,dt*4);if(mov){dir=d>0?1:-1;off+=-dir*90*dt}
   const cx=dx+DW/2;
   if(mov&&y===0&&jobs.some((_,i)=>{const dd=(mxOf(i)-cx)*dir;return dd>15&&dd<70}))hop();
   vy+=900*dt;y+=vy*dt;if(y>=0){y=0;vy=0}
   x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);x.textBaseline='top';x.font='12px JetBrains Mono,monospace';x.textAlign='center';
   const gy=H-50;x.fillStyle='#d8d4c7';for(let i=0;i<W;i+=8)x.fillText(i%32===0?'=':'-',i,gy);
   x.fillStyle='#55534c';for(let i=-1;i<W/16+1;i++)x.fillText(i%3?'.':':',((i*16+off)%(W+16)+W+16)%(W+16),gy+16);
   jobs.forEach((j,i)=>{const mx=mxOf(i);if(Math.abs(cx-mx)<DW*.55&&i!==act){act=i;onActive(i)}
    const on=i===act;x.fillStyle=on?'#fff':'#6f6d65';CAC.forEach((s,k)=>x.fillText(s,mx,gy-50+k*10));
    x.fillText(j.when.split(' – ')[0],mx,gy+34);
    if(on){x.fillStyle='#fff';const w=(j.role.length+2)*7.2,lx=Math.max(w/2,Math.min(W-w/2,mx));x.fillText('> '+j.role,lx,gy-118)}});
   x.textAlign='left';const fr=mov?Math.floor(t*10)%2:0,lines=[...R,...L[fr]].map(s=>dir<0?flip(s):s);x.fillStyle='#fff';
   lines.forEach((s,k)=>x.fillText(s,dx,gy-lines.length*10+k*10+y+2))};
  raf=requestAnimationFrame(loop);sec.addEventListener('mousemove',mv);c.addEventListener('click',hop);addEventListener('resize',size);
  return()=>{cancelAnimationFrame(raf);sec.removeEventListener('mousemove',mv);c.removeEventListener('click',hop);removeEventListener('resize',size)}},[]);
 return <div className="tl"><canvas ref={cv} data-hover/></div>;
}
