import {useEffect,useRef,useState} from 'react';
const G='#%&@$*+=<>/\\|{}[]0123456789';
export default function NextLink({label,url,action}){
 const live=useRef(null),raf=useRef(0),[hot,setHot]=useState(false);
 const ext=/^https?:/.test(url||''),text=label+(ext?' ↗':'');
 useEffect(()=>{live.current.textContent=text;return()=>cancelAnimationFrame(raf.current)},[text]);
 const run=()=>{
  const el=live.current;if(!el||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  cancelAnimationFrame(raf.current);
  const t0=performance.now(),ch=[...text],rev=ch.map((_,i)=>80+i*22+Math.random()*120);
  const tick=n=>{const t=n-t0;let out='',done=true;
   ch.forEach((c,i)=>{if(c===' '||t>=rev[i])out+=c;else{done=false;out+=G[(Math.random()*G.length)|0]}});
   el.textContent=out;if(!done)raf.current=requestAnimationFrame(tick)};
  raf.current=requestAnimationFrame(tick);
 };
 const on={onPointerEnter:()=>{setHot(true);run()},onFocus:()=>{setHot(true);run()},onPointerLeave:()=>setHot(false),onBlur:()=>setHot(false)};
 const inner=<><span className="nl__text"><span className="nl__ghost">{text}</span><span className="nl__live" ref={live} aria-hidden="true"/></span><span className="nl__mark" aria-hidden="true">[{hot?'x':' '}]</span></>;
 if(action==='top')return <button className="nl" data-hover {...on} onClick={()=>window.__lenis?window.__lenis.scrollTo(0,{duration:2}):window.scrollTo({top:0,behavior:'smooth'})}>{inner}</button>;
 return <a className="nl" data-hover href={url} {...(ext?{target:'_blank',rel:'noopener noreferrer'}:{})} {...on}>{inner}</a>;
}