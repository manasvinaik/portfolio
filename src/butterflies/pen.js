import {INK_SHIMMER,INK_DARK,INK_BODY,newInk} from './ink.js';
/** Turns the butterfly's shape functions into pixel cells on a canvas. Set pen.ctx / pen.cw / pen.alpha before each draw. */
export function createPen(getTrail,addDust){
 return {ink:newInk(),t:0,cw:6,ctx:null,layer:0,alpha:1,contrast:'rgba(215,228,255,.9)',
  shape(p,_thr,fn,o={}){const S=p.span,cw=this.cw,R=S*.7,c=Math.cos(p.heading),s=Math.sin(p.heading),ctx=this.ctx,i=this.ink,L=o.light??1;
   for(let gy=Math.floor((p.y-R)/cw);gy<=Math.ceil((p.y+R)/cw);gy++)for(let gx=Math.floor((p.x-R)/cw);gx<=Math.ceil((p.x+R)/cw);gx++){
    const dx=(gx+.5)*cw-p.x,dy=(gy+.5)*cw-p.y;if(!fn((dx*c+dy*s)/S,(-dx*s+dy*c)/S))continue;
    let r=i.r,g=i.g,b=i.b;
    if(i.kind===INK_SHIMMER){const m=L*(.82+.18*Math.sin(this.t*5+gx*1.3+gy*1.9));r*=m;g*=m;b*=m}
    else if(i.kind===INK_DARK||i.kind===INK_BODY){r+=38;g+=44;b+=70}
    ctx.fillStyle=`rgba(${r|0},${g|0},${b|0},${this.alpha})`;ctx.fillRect(gx*cw,gy*cw,cw-1,cw-1)}},
  toWorld(p,u,v,o){const S=p.span,c=Math.cos(p.heading),s=Math.sin(p.heading);o.x=p.x+S*(u*c-v*s);o.y=p.y+S*(u*s+v*c)},
  lineBody(p,u0,v0,u1,v1,col){const a={x:0,y:0},b={x:0,y:0},cw=this.cw;this.toWorld(p,u0,v0,a);this.toWorld(p,u1,v1,b);
   const n=Math.max(2,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/cw));this.ctx.fillStyle=col;
   for(let k=0;k<=n;k++)this.ctx.fillRect(Math.floor((a.x+(b.x-a.x)*k/n)/cw)*cw,Math.floor((a.y+(b.y-a.y)*k/n)/cw)*cw,cw-1,cw-1)},
  shed(x,y,a){if(Math.random()<a*7*getTrail())addDust({x,y,life:1,cw:this.cw,layer:this.layer,a:this.alpha})}};
}
