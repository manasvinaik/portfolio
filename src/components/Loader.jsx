import {useEffect,useState} from 'react';
export default function Loader({onDone}){
 const [p,setP]=useState(0),[out,setOut]=useState(false);
 useEffect(()=>{let v=0,id;const tick=()=>{v=Math.min(100,v+Math.random()*7+1);setP(v);if(v<100)id=setTimeout(tick,60);else setTimeout(()=>{setOut(true);setTimeout(onDone,700)},350)};tick();return()=>clearTimeout(id)},[]);
 const n=30,k=Math.floor(p/100*n);
 return <div className={'loader'+(out?' out':'')}><div className="pf">LOADING</div><div className="bar">[{'█'.repeat(k)}{'░'.repeat(n-k)}] {String(Math.floor(p)).padStart(3,'0')}%</div></div>;
}
