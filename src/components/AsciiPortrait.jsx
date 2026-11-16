import {useEffect,useRef} from 'react';
const RAMP=' .:-=+*#%@',CW=8,CH=12;
export default function AsciiPortrait(){
 const ref=useRef();
 useEffect(()=>{const c=ref.current,x=c.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2);
  let cols,rows,cells,base,raf,src=null,W,Hh;const m={x:-999,y:-999};
  const build=()=>{W=c.parentElement.clientWidth;cols=Math.floor(W/CW);Hh=Math.round(W*1.25);rows=Math.floor(Hh/CH);Hh=rows*CH;c.width=W*dpr;c.height=Hh*dpr;c.style.width=W+'px';c.style.height=Hh+'px';
   const o=document.createElement('canvas');o.width=cols;o.height=rows;const q=o.getContext('2d');q.fillStyle='#000';q.fillRect(0,0,cols,rows);
   if(src){const r=(cols*CW)/(rows*CH),ir=src.width/src.height;let sw=src.width,sh=src.height;if(ir>r)sw=sh*r;else sh=sw/r;q.drawImage(src,(src.width-sw)/2,(src.height-sh)/2,sw,sh,0,0,cols,rows)}
   else{q.fillStyle='#fff';q.font=`700 ${cols*.95}px "Pixelify Sans",monospace`;q.textAlign='center';q.textBaseline='middle';q.setTransform(1,0,0,2/3,0,0);q.fillText('M',cols/2,rows*.75)}
   const d=q.getImageData(0,0,cols,rows).data;cells=[];
   for(let k=0;k<cols*rows;k++){const l=(d[k*4]+d[k*4+1]+d[k*4+2])/765;cells.push(l>.12?{l,ch:src?RAMP[Math.min(9,Math.floor(l*9.99))]:'%@'[Math.random()*2|0]}:{l:0,ch:Math.random()<.14?'.':' '})}
   base=document.createElement('canvas');base.width=W*dpr;base.height=Hh*dpr;const b=base.getContext('2d');b.scale(dpr,dpr);b.font='12px JetBrains Mono,monospace';b.textBaseline='middle';
   cells.forEach((p,k)=>{if(p.ch===' ')return;b.fillStyle=p.l?`rgba(216,212,199,${.55+p.l*.45})`:'rgba(216,212,199,.25)';b.fillText(p.ch,(k%cols)*CW,Math.floor(k/cols)*CH+CH/2)})};
  const rip=[];
  const loop=()=>{raf=requestAnimationFrame(loop);x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,Hh);x.drawImage(base,0,0,W,Hh);x.font='12px JetBrains Mono,monospace';x.textBaseline='middle';
   const put=(i,j,a,p)=>{x.fillStyle='#0e0e0e';x.fillRect(i*CW,j*CH,CW,CH);x.fillStyle=`rgba(255,255,255,${.4+a*.6})`;x.fillText(p.l?'@%#*+'[Math.random()*5|0]:'.:+·'[Math.random()*4|0],i*CW,j*CH+CH/2)};
   for(let n=0;n<30;n++){const i=Math.random()*cols|0,j=Math.random()*rows|0,p=cells[j*cols+i];if(p&&p.l)put(i,j,.2,p)}
   for(let k=rip.length-1;k>=0;k--){rip[k].t+=.016;if(rip[k].t>1.5)rip.splice(k,1)}
   if(m.x<-900&&!rip.length)return;
   for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const px=i*CW+4,py=j*CH+6;let a=0;
    if(m.x>-900){const d=Math.hypot(px-m.x,py-m.y);if(d<90)a=1-d/90}
    for(const r of rip){const d=Math.hypot(px-r.x,py-r.y),w=Math.abs(d-r.t*500);if(w<28)a=Math.max(a,(1-w/28)*(1-r.t/1.5))}
    if(a>0)put(i,j,a,cells[j*cols+i])}};
  const go=()=>{build()};document.fonts.load('700 40px "Pixelify Sans"').then(go,go);
  const mv=e=>{const r=c.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top},ml=()=>{m.x=m.y=-999};
  c.addEventListener('click',e=>{const r=c.getBoundingClientRect();rip.push({x:e.clientX-r.left,y:e.clientY-r.top,t:0})});c.addEventListener('mousemove',mv);c.addEventListener('mouseleave',ml);addEventListener('resize',go);raf=requestAnimationFrame(loop);
  return()=>{cancelAnimationFrame(raf);c.removeEventListener('mousemove',mv);c.removeEventListener('mouseleave',ml);removeEventListener('resize',go)}},[]);
 return <canvas ref={ref} data-hover style={{display:'block'}}/>;
}
