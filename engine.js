import {CFG,MAP} from "./config.js";
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export class Engine{
 constructor(canvas){this.c=canvas;this.ctx=canvas.getContext("2d",{alpha:false});this.resize();addEventListener("resize",()=>this.resize());this.z=new Float32Array(1200);this.shake=0;this.shakeX=0;this.shakeY=0;this.particles=[];this.time=0}
 resize(){this.w=this.c.width=Math.floor(innerWidth*Math.min(devicePixelRatio||1,1.5));this.h=this.c.height=Math.floor(innerHeight*Math.min(devicePixelRatio||1,1.5));this.ctx.imageSmoothingEnabled=true}
 wall(x,y){let mx=Math.floor(x),my=Math.floor(y);if(my<0||mx<0||my>=MAP.length||mx>=MAP[0].length)return 1;return +MAP[my][mx][0]}
 particle(x,y,color,n=8,power=1){for(let i=0;i<n;i++){let a=Math.random()*Math.PI*2,s=(.4+Math.random()*2.4)*power;this.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.25+Math.random()*.5,max:.75,color,size:1+Math.random()*3})}}
 updateFX(dt){for(let i=this.particles.length-1;i>=0;i--){let p=this.particles[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.08,dt);p.vy*=Math.pow(.08,dt);p.life-=dt;if(p.life<=0)this.particles.splice(i,1)}this.shake=Math.max(0,this.shake-dt*2.8);this.shakeX=(Math.random()-.5)*this.shake*18;this.shakeY=(Math.random()-.5)*this.shake*18}
 cast(x,y,a,max=18){let c=Math.cos(a),s=Math.sin(a),d=0;while(d<max){d+=.035;if(this.wall(x+c*d,y+s*d))return d}return max}
 render(p,world,weapon,dt){
  const c=this.ctx,w=this.w,h=this.h,half=h/2;this.time+=dt;c.save();c.translate(this.shakeX*(CFG.camera.shake),this.shakeY*(CFG.camera.shake));
  let sky=c.createLinearGradient(0,0,0,half);sky.addColorStop(0,"#07111d");sky.addColorStop(1,"#172d3a");c.fillStyle=sky;c.fillRect(0,0,w,half);
  let floor=c.createLinearGradient(0,half,0,h);floor.addColorStop(0,"#17232b");floor.addColorStop(1,"#05090e");c.fillStyle=floor;c.fillRect(0,half,w,half);
  // floor perspective grid
  c.strokeStyle="#31515b22";c.lineWidth=1;for(let i=1;i<13;i++){let yy=half+(i/13)**2*half;c.beginPath();c.moveTo(0,yy);c.lineTo(w,yy);c.stroke()}
  const fov=Math.PI/2.9,cols=Math.min(900,Math.floor(w/2));this.z.length=cols;
  for(let x=0;x<cols;x++){let a=p.angle+(x/cols-.5)*fov,d=this.cast(p.x,p.y,a);d*=Math.cos(a-p.angle);this.z[x]=d;let wh=Math.min(h*2,h/(d+.001)*.82),y=half-wh/2;let shade=clamp(1-d/14,.12,1);let side=(Math.floor((p.x+Math.cos(a)*d)*2)%2);let r=18+Math.floor(shade*24),g=47+Math.floor(shade*70),b=57+Math.floor(shade*76);c.fillStyle=`rgb(${r+side*3},${g+side*5},${b+side*6})`;c.fillRect(x*w/cols,y,w/cols+1,wh);if(x%Math.max(1,Math.floor(cols/100))===0){c.fillStyle=`rgba(85,246,228,${shade*.07})`;c.fillRect(x*w/cols,y,w/cols+1,wh)}}
  // sprites sorted far to near
  let sprites=world.enemies.filter(e=>e.hp>0).map(e=>({e,d:Math.hypot(e.x-p.x,e.y-p.y)})).sort((a,b)=>b.d-a.d);
  for(const s of sprites){let e=s.e,dx=e.x-p.x,dy=e.y-p.y,a=Math.atan2(dy,dx)-p.angle;a=Math.atan2(Math.sin(a),Math.cos(a));if(Math.abs(a)>fov*.62||s.d<.1)continue;let sx=(.5+a/fov)*w,sz=Math.min(h*1.2,h/(s.d+.1)*.7),sy=half-sz*.12;let idx=Math.floor(sx/w*cols);if(idx>=0&&idx<cols&&s.d>this.z[clamp(idx,0,cols-1)]+.12)continue;
   c.save();c.translate(sx,sy);let glow=e.type==="warden"?"#ff416d":e.color;c.shadowColor=glow;c.shadowBlur=e.type==="warden"?28:13;
   c.fillStyle=glow;c.beginPath();c.ellipse(0,0,sz*.24,sz*.43,0,0,Math.PI*2);c.fill();c.shadowBlur=0;c.fillStyle="#101a23";c.fillRect(-sz*.16,-sz*.23,sz*.32,sz*.28);c.fillStyle="#eaffff";c.fillRect(-sz*.1,-sz*.18,sz*.055,sz*.035);c.fillRect(sz*.045,-sz*.18,sz*.055,sz*.035);
   c.fillStyle="#293943";c.fillRect(-sz*.27,sz*.25,sz*.54,sz*.08);c.fillStyle="#ff6178";c.fillRect(-sz*.27,sz*.25,sz*.54*clamp(e.hp/e.maxHp,0,1),sz*.08);c.restore();
  }
  for(const q of this.particles){let sx=(q.x-p.x)*24+w/2,sy=(q.y-p.y)*24+half;c.globalAlpha=clamp(q.life/q.max,0,1);c.fillStyle=q.color;c.fillRect(sx,sy,q.size,q.size)}c.globalAlpha=1;
  // weapon view model
  let bob=Math.sin(this.time*10)*3*(Math.hypot(p.vx,p.vy)>1?1:0),kick=weapon.kick||0;
  c.translate(w*.5,h*.87+bob+kick*75);c.rotate((p.lean||0)*-.04);
  c.fillStyle="#101a22";c.beginPath();c.moveTo(-w*.12, h*.2);c.lineTo(-w*.085,-h*.08);c.lineTo(w*.055,-h*.11);c.lineTo(w*.12,h*.2);c.fill();
  c.fillStyle=weapon.color;c.shadowColor=weapon.color;c.shadowBlur=18;c.fillRect(-w*.035,-h*.15,w*.07,h*.13);c.shadowBlur=0;c.fillStyle="#293e49";c.fillRect(-w*.055,-h*.025,w*.11,h*.14);
  if(weapon.flash>0){c.globalAlpha=weapon.flash;c.fillStyle=weapon.color;c.shadowColor=weapon.color;c.shadowBlur=40;c.beginPath();c.moveTo(0,-h*.2);c.lineTo(-w*.045,-h*.31);c.lineTo(0,-h*.4);c.lineTo(w*.045,-h*.31);c.fill();c.shadowBlur=0;c.globalAlpha=1}
  c.restore();
  // vignette
  let vg=c.createRadialGradient(w/2,h/2,h*.15,w/2,h/2,h*.78);vg.addColorStop(.55,"#0000");vg.addColorStop(1,"#02060bd9");c.fillStyle=vg;c.fillRect(0,0,w,h);
 }
}
