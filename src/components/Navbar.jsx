import Scramble from './Scramble.jsx';
const L=['projects','experience','tech','about','contact'];
export default function Navbar(){
 const go=(e,id)=>{e.preventDefault();window.__lenis?window.__lenis.scrollTo('#'+id,{offset:-50,duration:1.4}):location.hash=id};
 return <nav className="nav">{L.map(l=><a key={l} href={'#'+l} onClick={e=>go(e,l)}><Scramble auto={false} text={l}/></a>)}</nav>;
}
