import {useEffect,useRef,useState} from 'react';import {music} from '../data.js';
const B='▁▂▃▄▅▆▇█';
export default function Music(){
 const a=useRef(),[on,setOn]=useState(false),[bars,setBars]=useState('▁▁▁▁▁');
 useEffect(()=>{if(!on){setBars('▁▁▁▁▁');return}const id=setInterval(()=>setBars([...Array(5)].map(()=>B[Math.random()*8|0]).join('')),140);return()=>clearInterval(id)},[on]);
 const toggle=()=>{const e=a.current;if(on){e.pause();setOn(false)}else e.play().then(()=>setOn(true)).catch(()=>{})};
 return <><audio ref={a} src={music.src} loop preload="none"/>
  <button className="music" onClick={toggle} aria-label={on?'Pause music':'Play music'} data-hover>{on?'[ ❚❚ ':'[ ▶ '}{bars} ]<span className="mt"> {music.title}</span></button></>;
}
