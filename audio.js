export class AudioEngine{
 constructor(){this.ctx=null;this.master=.65;this.music=null}
 init(){if(!this.ctx){this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.bus=this.ctx.createGain();this.bus.gain.value=this.master;this.bus.connect(this.ctx.destination);this.ambience();}}
 tone(freq,dur=.08,type="sawtooth",vol=.08,slide=0){if(!this.ctx)return;let o=this.ctx.createOscillator(),g=this.ctx.createGain(),t=this.ctx.currentTime;o.type=type;o.frequency.setValueAtTime(freq,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,freq+slide),t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(this.bus);o.start(t);o.stop(t+dur)}
 noise(dur=.12,vol=.12,filter=1200){if(!this.ctx)return;let n=Math.floor(this.ctx.sampleRate*dur),b=this.ctx.createBuffer(1,n,this.ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);let s=this.ctx.createBufferSource(),f=this.ctx.createBiquadFilter(),g=this.ctx.createGain();s.buffer=b;f.type="lowpass";f.frequency.value=filter;g.gain.value=vol;s.connect(f);f.connect(g);g.connect(this.bus);s.start()}
 shot(w){this.tone(w.sound,.11,"sawtooth",.10,-w.sound*.55);this.noise(.07,.09,2600)}
 hit(){this.tone(620,.055,"square",.035,-260)}
 dash(){this.noise(.18,.12,900);this.tone(280,.16,"sine",.06,500)}
 reload(){this.tone(440,.045,"square",.035,-160);setTimeout(()=>this.tone(620,.06,"square",.035,100),180)}
 boom(){this.noise(.5,.22,500);this.tone(75,.4,"sine",.16,-55)}
 ambience(){let o=this.ctx.createOscillator(),g=this.ctx.createGain(),f=this.ctx.createBiquadFilter();o.type="sine";o.frequency.value=48;g.gain.value=.018;f.type="lowpass";f.frequency.value=100;o.connect(f);f.connect(g);g.connect(this.bus);o.start()}
 setVolume(v){this.master=v;if(this.bus)this.bus.gain.value=v}
}
