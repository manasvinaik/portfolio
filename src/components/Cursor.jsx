import {useEffect,useRef,useState} from 'react';
export default function Cursor(){
 const el=useRef(),[g,setG]=useState('+');
 useEffect(()=>{if(matchMedia('(pointer:coarse)').matches)return;document.body.classList.add('no-cursor');
  let tx=-100,ty=-100,x=-100,y=-100,raf;
  const mv=e=>{tx=e.clientX;ty=e.clientY;setG(g=>e.target.closest('a,button,[data-hover]')?'[ ]':(g==='*'?g:'+'))};
  const dn=()=>setG('*'),up=e=>setG(e.target.closest('a,button,[data-hover]')?'[ ]':'+');
  const loop=()=>{x+=(tx-x)*.25;y+=(ty-y)*.25;if(el.current)el.current.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;raf=requestAnimationFrame(loop)};loop();
  addEventListener('mousemove',mv);addEventListener('mousedown',dn);addEventListener('mouseup',up);
  return()=>{cancelAnimationFrame(raf);removeEventListener('mousemove',mv);removeEventListener('mousedown',dn);removeEventListener('mouseup',up);document.body.classList.remove('no-cursor')}},[]);
 return <div ref={el} className="cursor">{g}</div>;
}
