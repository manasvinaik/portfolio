import {useEffect,useRef,useState} from 'react';
const CH='█▓▒░<>/\\|+-_=*#@%&01';
export default function Scramble({text,as:T='span',auto=true,className='',every=0,...p}){
 const [out,setOut]=useState(auto?'':text),ref=useRef(),raf=useRef();
 const run=()=>{cancelAnimationFrame(raf.current);let f=0;const step=()=>{f++;const d=Math.floor(f/2);setOut([...text].map((c,i)=>c===' '?' ':i<d?c:CH[Math.random()*CH.length|0]).join(''));if(d<text.length)raf.current=requestAnimationFrame(step)};step()};
 useEffect(()=>{if(!auto)return;const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){run();io.disconnect()}},{threshold:.3});io.observe(ref.current);return()=>{io.disconnect();cancelAnimationFrame(raf.current)}},[text]);
 useEffect(()=>{if(!every)return;const id=setInterval(run,every);return()=>clearInterval(id)},[text,every]);
 return <T ref={ref} className={className} onMouseEnter={run} aria-label={text} {...p}>{out||'\u00A0'}</T>;
}
