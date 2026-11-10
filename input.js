export class Input{
 constructor(canvas){this.keys=new Set();this.down=new Set();this.mouse={x:0,y:0,fire:false,aim:false};this.lock=false;
  addEventListener("keydown",e=>{if(!this.keys.has(e.code))this.down.add(e.code);this.keys.add(e.code);if(["Space","ArrowUp","ArrowDown"].includes(e.code))e.preventDefault();});
  addEventListener("keyup",e=>this.keys.delete(e.code));
  addEventListener("blur",()=>{this.keys.clear();this.mouse.fire=false;});
  canvas.addEventListener("mousemove",e=>{this.mouse.x=e.clientX;this.mouse.y=e.clientY;});
  canvas.addEventListener("mousedown",e=>{if(e.button===0)this.mouse.fire=true;if(e.button===2)this.mouse.aim=true;});
  addEventListener("mouseup",e=>{if(e.button===0)this.mouse.fire=false;if(e.button===2)this.mouse.aim=false;});
  canvas.addEventListener("contextmenu",e=>e.preventDefault());
 }
 held(k){return this.keys.has(k)} pressed(k){const v=this.down.has(k);this.down.delete(k);return v}
 clear(){this.down.clear()}
}
