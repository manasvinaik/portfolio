import {useEffect,useRef} from 'react';
const CH='█▓▒░<>/\\|+-_=*#@%&01',F=20,BH=36,RH=58,GAP=20,PAD=24;
export default function TechField({items}){
 const ref=useRef();
 useEffect(()=>{const c=ref.current,x=c.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  let W,H,raf,vis=true,last=performance.now(),its=[];const m={x:-999,y:-999};
  const layout=()=>{W=c.parentElement.clientWidth;x.font=F+'px JetBrains Mono,monospace';let cx=PAD,cy=PAD+10;const old=its;
   its=items.map((t,i)=>{const label='[ '+t+' ]',w=x.measureText(label).width+16;if(cx+w>W-PAD){cx=PAD;cy+=RH}
    const o=old[i]||{},it={t,label,w,hx:cx,hy:cy,x:o.x??cx,y:o.y??cy,vx:0,vy:0,s:1,hov:false};cx+=w+GAP;return it});
   H=cy+RH+PAD-10;c.width=W*dpr;c.height=H*dpr;c.style.width=W+'px';c.style.height=H+'px'};
  layout();document.fonts.ready.then(layout);
  const loop=now=>{raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;if(!vis)return;
   x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);
   for(let j=0;j*24<H;j++)for(let i=0;i*24<W;i++){const d=Math.hypot(i*24-m.x,j*24-m.y);x.fillStyle=`rgba(232,228,216,${.1+(d<170?(1-d/170)*.7:0)})`;x.fillRect(i*24,j*24,2,2)}
   x.font=F+'px JetBrains Mono,monospace';x.textBaseline='middle';x.textAlign='left';x.setLineDash([3,3]);
   for(const it of its){
    const cx=it.x+it.w/2,cy=it.y+BH/2,dx=m.x-cx,dy=m.y-cy,d=Math.hypot(dx,dy);
    let tx=it.hx,ty=it.hy;if(!reduce&&d<170&&d>1){const k=(1-d/170)*14;tx+=dx/d*k;ty+=dy/d*k}
    if(!reduce){it.vx=(it.vx+(tx-it.x)*70*dt)*Math.pow(.03,dt);it.vy=(it.vy+(ty-it.y)*70*dt)*Math.pow(.03,dt);it.x+=it.vx*dt;it.y+=it.vy*dt}
    const hov=m.x>=it.x&&m.x<=it.x+it.w&&m.y>=it.y&&m.y<=it.y+BH;if(hov&&!it.hov)it.s=0;it.hov=hov;it.s=hov?Math.min(1,it.s+dt*4):1;
    const n=Math.floor(it.s*it.label.length),txt=it.s<1?[...it.label].map((ch,i)=>i<n||ch===' '?ch:CH[Math.random()*CH.length|0]).join(''):it.label;
    if(hov){x.fillStyle='#e8e4d8';x.fillRect(it.x,it.y,it.w,BH);x.fillStyle='#0e0e0e'}
    else{x.strokeStyle='rgba(216,212,199,.22)';x.strokeRect(it.x+.5,it.y+.5,it.w,BH);x.fillStyle=`rgba(216,212,199,${.5+.5*Math.max(0,1-d/220)})`}
    x.fillText(txt,it.x+8,it.y+BH/2+1)}};
  raf=requestAnimationFrame(loop);
  const mv=e=>{const r=c.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top},lv=()=>{m.x=m.y=-999};
  const ck=e=>{const r=c.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;its.forEach(it=>{const dx=it.x+it.w/2-px,dy=it.y+BH/2-py,d=Math.hypot(dx,dy)||1;if(d<340){const k=(1-d/340)*1100+250;it.vx+=dx/d*k;it.vy+=dy/d*k}})};
  const io=new IntersectionObserver(([e])=>vis=e.isIntersecting);io.observe(c);
  c.addEventListener('pointermove',mv);c.addEventListener('pointerleave',lv);c.addEventListener('click',ck);addEventListener('resize',layout);
  return()=>{cancelAnimationFrame(raf);io.disconnect();c.removeEventListener('pointermove',mv);c.removeEventListener('pointerleave',lv);c.removeEventListener('click',ck);removeEventListener('resize',layout)}},[items]);
 return <div className="techbox"><canvas ref={ref} data-hover/></div>;
}
