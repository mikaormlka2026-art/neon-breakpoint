import {CFG} from "./config.js";import {clamp} from "./engine.js";
export class Weapons{
 constructor(){this.list=CFG.weapons.map(w=>({...w,ammo:w.mag,reserve:w.reserve,last:0,reloading:0,kick:0,flash:0}));this.index=0}
 get current(){return this.list[this.index]}
 update(dt,input,player,world,engine,audio){let w=this.current;w.kick=Math.max(0,w.kick-dt*4);w.flash=Math.max(0,w.flash-dt*8);if(w.reloading>0){w.reloading-=dt;if(w.reloading<=0){let n=Math.min(w.mag-w.ammo,w.reserve);w.ammo+=n;w.reserve-=n}}
  for(let i=0;i<4;i++)if(input.pressed("Digit"+(i+1)))this.index=i;
  if(input.pressed("KeyR"))this.reload(audio);
  w=this.current;if(input.mouse.fire&&performance.now()/1000-w.last>=w.rate&&w.reloading<=0)this.fire(player,world,engine,audio);
 }
 reload(audio){let w=this.current;if(w.reloading>0||w.ammo===w.mag||w.reserve<=0)return;w.reloading=w.reload;audio.reload()}
 fire(p,world,engine,audio){let w=this.current;w.last=performance.now()/1000;if(w.ammo<=0){audio.tone(90,.05,"square",.025,-30);return}w.ammo--;w.kick=Math.min(1,w.kick+w.recoil*10);w.flash=1;audio.shot(w);engine.shake=Math.max(engine.shake,w.recoil*4);
 for(let k=0;k<w.pellets;k++){let a=p.angle+(Math.random()-.5)*w.spread*2+(Math.random()-.5)*w.recoil*.12;let hit=null,best=w.range;
  for(const e of world.enemies){if(e.hp<=0)continue;let dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy);if(d>best)continue;let da=Math.atan2(dy,dx)-a;da=Math.atan2(Math.sin(da),Math.cos(da));if(Math.abs(da)<Math.atan2(e.radius,d)){let wall=engine.cast(p.x,p.y,a,d);if(wall>=d-.12){best=d;hit=e}}}
  if(hit){hit.hp-=w.damage;hit.flash=.1;let dx=hit.x-p.x,dy=hit.y-p.y,n=Math.hypot(dx,dy)||1;hit.vx+=dx/n*w.damage*.009;hit.vy+=dy/n*w.damage*.009;engine.particle(hit.x,hit.y,w.color,9,w.damage/22);audio.hit();world.hit=true;if(hit.hp<=0){p.score+=100*p.combo;p.combo=Math.min(8,p.combo+1);p.comboTimer=3;world.kills++;engine.particle(hit.x,hit.y,hit.color,22,1.8)}}
 }
 }
}
