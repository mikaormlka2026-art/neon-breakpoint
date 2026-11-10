import {Input} from "./input.js";import {Engine} from "./engine.js";import {Player} from "./player.js";import {Weapons} from "./weapons.js";import {World} from "./enemies.js";import {AudioEngine} from "./audio.js";
const $=id=>document.getElementById(id),canvas=$("game"),engine=new Engine(canvas),input=new Input(canvas),audio=new AudioEngine();
let player,world,weapons,state="menu",last=0,toastTimer=0;
function reset(){player=new Player();world=new World();weapons=new Weapons();$("hud").classList.remove("hidden");$("bossbar").classList.add("hidden");$("end").classList.add("hidden");$("pause").classList.add("hidden");state="playing";last=performance.now();$("menu").classList.add("hidden");}
$("play").onclick=()=>{audio.init();reset();canvas.requestPointerLock?.()};
$("resume").onclick=()=>{state="playing";$("pause").classList.add("hidden");last=performance.now();canvas.requestPointerLock?.()};
$("restart").onclick=reset;$("again").onclick=reset;
$("volume").oninput=e=>audio.setVolume(+e.target.value/100);$("shake").oninput=e=>{engine.shake=0;import("./config.js").then(m=>m.CFG.camera.shake=+e.target.value/100)};
document.addEventListener("pointerlockchange",()=>{});
function end(win){state="end";$("end").classList.remove("hidden");$("endtag").textContent=win?"OBJECTIF ATTEINT":"SIGNAL PERDU";$("endtitle").textContent=win?"WARDEN NEUTRALISÉ":"ÉCHEC DE LA MISSION";$("endcopy").textContent=`Éliminations : ${world.kills} · Score : ${player.score}`;document.exitPointerLock?.()}
function update(dt){if(state!=="playing")return;
 if(input.pressed("Escape")){state="pause";$("pause").classList.remove("hidden");document.exitPointerLock?.();return}
 if(document.pointerLockElement===canvas){player.angle+=(input.mouse.x-innerWidth/2)*.0000;/* pointer movement handled below */}
 player.update(dt,input,engine,audio);weapons.update(dt,input,player,world,engine,audio);world.update(dt,player,engine,audio);engine.updateFX(dt);
 if(world.boss){$("bossbar").classList.remove("hidden");let b=world.enemies.find(e=>e.type==="warden");if(b){$("bosshealth").style.width=Math.max(0,b.hp/b.maxHp*100)+"%";if(b.hp<=0){end(true);return}}}
 if(player.hp<=0){end(false);return}
 if(world.kills>0&&toastTimer<=0){$("toast").textContent="MENACE ÉLIMINÉE";$("toast").style.opacity=1;toastTimer=1}
 toastTimer-=dt;if(toastTimer<=0)$("toast").style.opacity=0;
 $("healthbar").style.width=player.hp+"%";$("healthnum").textContent=Math.ceil(player.hp);$("ammo").textContent=weapons.current.ammo;$("reserve").textContent=weapons.current.reserve;$("weaponname").textContent=weapons.current.name+" / "+weapons.current.type;$("style").textContent="STYLE ×"+player.combo;
 let cross=22+(Math.hypot(player.vx,player.vy)*2)+(weapons.current.kick*35);$("crosshair").style.transform=`translate(-50%,-50%) scale(${cross/22})`;
}
let lastMouse=0;
canvas.addEventListener("mousemove",e=>{if(document.pointerLockElement===canvas){player&&(player.angle+=e.movementX*.0022);}});
function frame(t){let dt=Math.min(.033,(t-last)/1000||0);last=t;update(dt);if(player&&state!=="menu")engine.render(player,world,weapons.current,dt);else{let c=engine.ctx,w=engine.w,h=engine.h;c.fillStyle="#07111a";c.fillRect(0,0,w,h);for(let i=0;i<40;i++){c.fillStyle=`rgba(85,246,228,${Math.random()*.08})`;c.fillRect(Math.random()*w,Math.random()*h,2,2)}}requestAnimationFrame(frame)}
requestAnimationFrame(frame);
