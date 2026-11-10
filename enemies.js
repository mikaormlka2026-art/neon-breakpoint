import {CFG} from "./config.js";import {dist} from "./engine.js";
export class World{
 constructor(){this.enemies=[];this.kills=0;this.hit=false;this.spawn()}
 spawn(){const add=(type,x,y)=>{let c=CFG.enemy[type];this.enemies.push({type,x,y,vx:0,vy:0,hp:c.hp,maxHp:c.hp,speed:c.speed,damage:c.damage,range:c.range,rate:c.rate,color:c.color,radius:c.radius,attack:Math.random(),flash:0,phase:0})};
 add("runner",8.5,3.5);add("runner",13.5,4.5);add("gunner",15.5,10.5);add("brute",5.5,13.5);add("gunner",10.5,14.5);add("runner",17,13);this.bossSpawned=false}
 update(dt,p,engine,audio){for(const e of this.enemies){if(e.hp<=0)continue;let d=dist(e,p),dx=p.x-e.x,dy=p.y-e.y,n=d||1,ux=dx/n,uy=dy/n;e.attack-=dt;e.flash=Math.max(0,e.flash-dt);e.vx*=Math.exp(-5*dt);e.vy*=Math.exp(-5*dt);
 if(e.type==="gunner"){if(d>5){e.vx+=ux*e.speed*dt*2;e.vy+=uy*e.speed*dt*2}else if(d<3){e.vx-=ux*e.speed*dt*2;e.vy-=uy*e.speed*dt*2}if(d<e.range&&e.attack<=0){e.attack=e.rate;this.enemyShot(e,p,engine,audio)}}
 else {if(d>e.range*.8){e.vx+=ux*e.speed*dt*3;e.vy+=uy*e.speed*dt*3}if(d<e.range&&e.attack<=0){e.attack=e.rate;if(p.invuln<=0){p.damage(e.damage);engine.shake=Math.max(engine.shake,.5);audio.tone(70,.15,"sawtooth",.08,-40)}}}
 let nx=e.x+e.vx*dt,ny=e.y+e.vy*dt;if(!engine.wall(nx, e.y))e.x=nx;if(!engine.wall(e.x,ny))e.y=ny;
 }
 if(this.enemies.filter(e=>e.hp>0).length===0&&!this.bossSpawned){this.bossSpawned=true;this.enemies.push({...CFG.enemy.warden,type:"warden",x:16.5,y:8.5,vx:0,vy:0,maxHp:CFG.enemy.warden.hp,attack:.5,flash:0,phase:0});this.boss=true}
 let boss=this.enemies.find(e=>e.type==="warden"&&e.hp>0);if(boss){let d=dist(boss,p),dx=p.x-boss.x,dy=p.y-boss.y,n=d||1;boss.attack-=dt;boss.vx+=(dx/n*boss.speed*.8-boss.vx)*dt;boss.vy+=(dy/n*boss.speed*.8-boss.vy)*dt;if(d<boss.range&&boss.attack<=0){boss.attack=boss.rate;this.enemyShot(boss,p,engine,audio);if(d<2.1)p.damage(14)}let nx=boss.x+boss.vx*dt,ny=boss.y+boss.vy*dt;if(!engine.wall(nx,boss.y))boss.x=nx;if(!engine.wall(boss.x,ny))boss.y=ny}
 }
 enemyShot(e,p,engine,audio){let d=dist(e,p);if(d<e.range&&engine.cast(e.x,e.y,Math.atan2(p.y-e.y,p.x-e.x),d) >= d-.2){p.damage(e.damage);engine.shake=Math.max(engine.shake,.25);audio.tone(120,.09,"square",.04,-70)}}
}
