import {useEffect,useRef} from 'react';
const B=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
const hash=(a,b)=>{const h=Math.sin(a*127.1+b*311.7)*43758.5453;return h-Math.floor(h)};
const F={
 rings:(i,j,t)=>.5+.5*Math.sin(Math.hypot(i-32,j-32)*.55-t*3),
 noise:(i,j,t)=>hash(i+Math.floor(t*5)*7,j),
 waves:(i,j,t)=>.5+.5*Math.sin(i*.2+Math.sin(j*.15+t)*3+t),
 lines:(i,j,t)=>{const r=j>>2;if((j&3)>1)return 0;return (i/64<.15+.75*hash(r,1)+.08*Math.sin(t*2+r))&&(i%9!==4||hash(r,i)>.3)?.95:.05}};
export default function AsciiArt({kind='rings',label,tag}){
 const ref=useRef(),hov=useRef(false);
 useEffect(()=>{const c=ref.current,x=c.getContext('2d'),n=64,s=8;c.width=c.height=n*s;let t=0,last=0,raf;const f=F[kind];
  const draw=now=>{raf=requestAnimationFrame(draw);if(now-last<(hov.current?33:66))return;t+=(now-last)/1000*(hov.current?2.5:.8);last=now;
   x.fillStyle='#0f100f';x.fillRect(0,0,c.width,c.height);x.fillStyle='#e6e3d6';
   for(let j=0;j<n;j++)for(let i=0;i<n;i++)if(f(i,j,t)>(B[j&3][i&3]+.5)/16)x.fillRect(i*s,j*s,s-1,s-1)};
  raf=requestAnimationFrame(draw);return()=>cancelAnimationFrame(raf)},[kind]);
 return <div className="art" onMouseEnter={()=>hov.current=true} onMouseLeave={()=>hov.current=false}><canvas ref={ref}/>{label&&<span className="art-label">{label}</span>}{tag&&<span className="art-tag">{tag}</span>}</div>;
}
