import {CFG} from "./config.js";import {clamp} from "./engine.js";
export class Player{
 constructor(){this.x=1.5;this.y=1.5;this.vx=0;this.vy=0;this.angle=0;this.hp=100;this.z=0;this.vz=0;this.grounded=true;this.dash=0;this.slide=0;this.cool=0;this.invuln=0;this.lean=0;this.score=0;this.combo=1;this.comboTimer=0}
 update(dt,input,engine,audio){let ix=(input.held("KeyD")?1:0)-(input.held("KeyA")?1:0),iy=(input.held("KeyW")?1:0)-(input.held("KeyS")?1:0),len=Math.hypot(ix,iy)||1;ix/=len;iy/=len;
 let ca=Math.cos(this.angle),sa=Math.sin(this.angle),wx=-ix*sa+iy*ca,wy=ix*ca+iy*sa;
 if(input.pressed("Space")&&this.grounded){this.vz=CFG.player.jump;this.grounded=false;audio.tone(190,.1,"sine",.05,180)}
 if(input.pressed("KeyQ")&&this.cool<=0){this.dash=.16;this.cool=.8;let n=Math.hypot(wx,wy);if(n<.1){wx=ca;wy=sa}else{wx/=n;wy/=n}this.vx=wx*CFG.player.dashSpeed;this.vy=wy*CFG.player.dashSpeed;audio.dash();engine.shake=Math.max(engine.shake,.35)}
 if(input.pressed("KeyC")&&this.grounded&&Math.hypot(this.vx,this.vy)>2){this.slide=.55;audio.noise(.2,.07,500)}
 let sprint=input.held("ShiftLeft")||input.held("ShiftRight"),speed=CFG.player.maxSpeed*(sprint?CFG.player.sprint:1);if(this.slide>0)speed=CFG.player.slideSpeed;
 if(this.dash<=0){let ac=CFG.player.accel*(this.grounded?1:CFG.player.air);this.vx+=(wx*speed-this.vx)*Math.min(1,ac*dt);this.vy+=(wy*speed-this.vy)*Math.min(1,ac*dt);if(!ix&&!iy){this.vx*=Math.exp(-CFG.player.friction*dt);this.vy*=Math.exp(-CFG.player.friction*dt)}}
 let nx=this.x+this.vx*dt,ny=this.y+this.vy*dt,r=CFG.player.radius;
 if(!engine.wall(nx-r,this.y)&&!engine.wall(nx+r,this.y))this.x=nx;else this.vx*=-.22;
 if(!engine.wall(this.x,ny-r)&&!engine.wall(this.x,ny+r))this.y=ny;else this.vy*=-.22;
 if(!this.grounded){this.vz-=CFG.player.gravity*dt;this.z+=this.vz*dt;if(this.z<=0){this.z=0;this.vz=0;this.grounded=true;engine.shake=Math.max(engine.shake,.18);engine.particle(this.x,this.y,"#9ab9bd",7,.7)}}
 this.dash=Math.max(0,this.dash-dt);this.slide=Math.max(0,this.slide-dt);this.cool=Math.max(0,this.cool-dt);this.invuln=Math.max(0,this.invuln-dt);this.comboTimer=Math.max(0,this.comboTimer-dt);if(this.comboTimer===0)this.combo=1;this.lean+=(clamp(this.vx*-.025,-.1,.1)-this.lean)*dt*5;
 }
 damage(n){if(this.invuln>0)return;this.hp=Math.max(0,this.hp-n);this.invuln=.5}
}
