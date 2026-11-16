import {useEffect,useState} from 'react';import Lenis from 'lenis';
import Loader from './components/Loader.jsx';import Cursor from './components/Cursor.jsx';import Navbar from './components/Navbar.jsx';
import Timeline from './components/Timeline.jsx';import Waves from './components/Waves.jsx';import Hero from './components/Hero.jsx';
import AsciiArt from './components/AsciiArt.jsx';import AsciiPortrait from './components/AsciiPortrait.jsx';import Scramble from './components/Scramble.jsx';
import NextLink from './components/NextLink.jsx';
import Music from './components/Music.jsx';import TechField from './components/TechField.jsx';import {me,projects,jobs,about,tech,next} from './data.js';
export default function App(){
 const [ready,setReady]=useState(false),[act,setAct]=useState(0),j=jobs[act];
 useEffect(()=>{const l=new Lenis({lerp:.085});window.__lenis=l;let id;const raf=t=>{l.raf(t);id=requestAnimationFrame(raf)};id=requestAnimationFrame(raf);return()=>{cancelAnimationFrame(id);l.destroy()}},[]);
 useEffect(()=>{if(!ready)return;const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&(e.target.classList.add('in'),io.unobserve(e.target))),{threshold:.12});document.querySelectorAll('.rv').forEach(n=>io.observe(n));return()=>io.disconnect()},[ready]);
 return <>{!ready&&<Loader onDone={()=>setReady(true)}/>}<Cursor/><Music/><Navbar/><Hero ready={ready}/>
 <main>
  <section id="projects"><h2><Scramble text="Projects"/></h2><div className="cards">{projects.map(p=>
   <a className="card rv" key={p.title} data-hover href={p.mail?'mailto:'+me.email:p.url} {...(p.mail?{}:{target:'_blank',rel:'noopener noreferrer'})}><AsciiArt kind={p.kind} label={p.title} tag={p.tag}/><p>{p.desc}</p>
    <div className="tags">{p.stack.map(s=><span key={s}>{s}</span>)}</div>
    <span className="open">{p.mail?'[ @ ]':'[ ]'}</span></a>)}</div></section>
  <section id="experience"><h2><Scramble text="Experience"/></h2>
   <p className="cap">Move your cursor. The dino walks to each obstacle and jumps it.</p>
   <Timeline jobs={jobs} onActive={setAct}/>
   <div className="xp"><span className="when">{j.when}</span><div><h3><Scramble key={act} text={j.role+' @ '+j.org}/></h3><ul>{j.pts.map(t=><li key={t}>{t}</li>)}</ul></div><span className="count">{act+1}/{jobs.length}</span></div></section>
  <section id="tech"><h2><Scramble text="Technologies"/></h2><p className="cap">Technologies I've worked with. Click to scatter.</p><TechField items={tech}/></section>
  <section id="about"><div className="about2">
   <div className="rv"><div className="portrait"><AsciiPortrait/></div><p className="cap">Move your cursor over the M. Click to send a ripple.</p></div>
   <div className="rv"><h2><Scramble text="About"/></h2>{about.text.map(t=><p className="lead" key={t}>{t}</p>)}
    <dl className="facts">{about.rows.map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></div></div></section>
  
  <section id="contact"><h2 className="rv"><Scramble text={next.title[0]}/>{' '}<span className="hl"><Scramble text={next.title[1]}/></span></h2>
 <div className="next rv">{next.buttons.map(b=><NextLink key={b.label} {...b}/>)}</div></section>
  <Waves/>
 </main><footer>© {new Date().getFullYear()} {me.name} — built with ascii</footer></>;
}
