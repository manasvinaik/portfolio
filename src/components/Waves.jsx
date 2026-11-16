import {useEffect,useRef} from 'react';
const SH=['#e8e4d8','#bdb9ac','#8f8c82'],CW=12,RH=4,H=300;
export default function Waves(){
 const ref=useRef();
 useEffect(()=>{const c=ref.current,x=c.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2);let W,raf,t=0,mx=-999,last=performance.now();
  const size=()=>{W=c.parentElement.clientWidth;c.width=W*dpr;c.height=H*dpr;c.style.width=W+'px';c.style.height=H+'px'};size();
  const mv=e=>{const r=c.getBoundingClientRect();mx=e.clientX-r.left;if(e.clientY<r.top-150||e.clientY>r.bottom+50)mx=-999};
  const loop=now=>{raf=requestAnimationFrame(loop);t+=Math.min(.05,(now-last)/1000);last=now;
   x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);x.font='12px JetBrains Mono,monospace';x.textAlign='center';x.textBaseline='middle';
   const hy=70;x.fillStyle='#d8d4c7';for(let i=0;i<W;i+=8)x.fillText('-',i,hy);
   const dxm=(t*70)%(W+80)-40;for(let i=0;i<5;i++)x.fillText('=',dxm-12-i*8,hy);x.font='22px JetBrains Mono,monospace';x.fillText('◆',dxm,hy);x.font='12px JetBrains Mono,monospace';
   x.fillStyle='#8a877d';for(let i=0,k=0;i<W;i+=137,k++)x.fillRect(i+10,hy-40+(k%2)*10+Math.sin(t*2+k)*2,3,5);
   for(let k=0;k<3;k++){const b=186+k*57,cols=Math.ceil(W/CW);
    for(let i=0;i<cols;i++){const px=i*CW;let h=(Math.sin(i*.07+t*.7+k*2)*.5+.5)*.6+(Math.sin(i*.17-t*1.1+k)*.5+.5)*.4;h+=.4*Math.exp(-(((px-mx)/150)**2));
     if(Math.sin(i*.05+k*2.7+t*.15)>.82){x.fillStyle='#d8d4c7';x.fillText((i+Math.floor(t*3))%2?'x':'~',px+CW/2,b-10);continue}
     const n=Math.max(1,Math.round(h*12));x.fillStyle=SH[k];x.fillRect(px,b-n*RH,CW-1,n*RH)}}};
  raf=requestAnimationFrame(loop);addEventListener('mousemove',mv);addEventListener('resize',size);
  return()=>{cancelAnimationFrame(raf);removeEventListener('mousemove',mv);removeEventListener('resize',size)}},[]);
 return <div className="waves"><canvas ref={ref}/></div>;
}
