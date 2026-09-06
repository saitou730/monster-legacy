window.MLAudio = (() => {
  const STEMS = {
    base: "assets/audio/stems/base_calm.wav",
    heat: "assets/audio/stems/heat_percussion.wav",
    rage: "assets/audio/stems/rage_pulse.wav",
    danger: "assets/audio/stems/danger_choir.wav",
    legacy: "assets/audio/stems/legacy_ritual.wav"
  };
  const SFX = {
    select: "assets/audio/se/ui_select.wav",
    command: "assets/audio/se/command_lock.wav",
    stance: "assets/audio/se/stance.wav",
    execute: "assets/audio/se/execute.wav",
    hit: "assets/audio/se/hit.wav",
    crash: "assets/audio/se/crash.wav",
    equipment: "assets/audio/se/equipment.wav",
    join: "assets/audio/se/join.wav",
    band: "assets/audio/se/band_shift.wav",
    legacy: "assets/audio/se/legacy_art.wav"
  };

  let audio = null;
  let enabled = false;
  let lastBand = "CALM";
  let bootPromise = null;
  let sampleMode = false;

  function band(v){
    v = Math.max(0,Math.min(100,Number(v)||0));
    return v>=100?"LEGACY":v>=90?"DANGER":v>=60?"RAGE":v>=30?"HEAT":"CALM";
  }

  function ramp(node,val,time=.45){
    if(!audio || !node) return;
    const t=audio.ctx.currentTime;
    node.gain.cancelScheduledValues(t);
    node.gain.setValueAtTime(Math.max(.0001,node.gain.value),t);
    node.gain.linearRampToValueAtTime(val,t+time);
  }

  function fallbackTone(name){
    if(!enabled || !audio) return;
    const ctx=audio.ctx, out=audio.sfxBus, t=ctx.currentTime;
    const recipe={
      select:[[440,.08,.035,"sine",0],[660,.12,.025,"triangle",.035]],
      command:[[293.66,.13,.05,"triangle",0],[440,.18,.035,"sine",.045]],
      stance:[[220,.18,.045,"sine",0],[330,.28,.03,"triangle",.04]],
      execute:[[105,.18,.07,"sawtooth",0],[210,.22,.035,"triangle",.03]],
      hit:[[145,.08,.08,"square",0],[92,.12,.05,"triangle",.02]],
      crash:[[98,.2,.11,"sawtooth",0],[65,.32,.08,"triangle",.05],[196,.13,.04,"square",.12]],
      equipment:[[293.66,.08,.045,"sine",0],[440,.13,.05,"triangle",.06]],
      join:[[392,.1,.055,"sine",0],[523.25,.14,.05,"sine",.07],[659.25,.2,.045,"sine",.14]],
      band:[[220,.12,.04,"triangle",0],[440,.24,.035,"sine",.07]],
      legacy:[[130.81,.35,.08,"sine",0],[196,.45,.06,"triangle",.04],[392,.55,.04,"sine",.08]]
    }[name]||[];
    recipe.forEach(([freq,dur,g,type,delay])=>{
      const o=ctx.createOscillator(), gn=ctx.createGain();
      o.type=type; o.frequency.setValueAtTime(freq,t+delay);
      gn.gain.setValueAtTime(.0001,t+delay);
      gn.gain.linearRampToValueAtTime(g,t+delay+.01);
      gn.gain.exponentialRampToValueAtTime(.0001,t+delay+dur);
      o.connect(gn).connect(out); o.start(t+delay); o.stop(t+delay+dur+.03);
    });
  }

  async function decode(url){
    const resolved = window.MLAsset ? window.MLAsset(url) : url;
    const res=await fetch(resolved,{cache:"force-cache"});
    if(!res.ok) throw new Error(`audio ${res.status}`);
    const buf=await res.arrayBuffer();
    return await audio.ctx.decodeAudioData(buf.slice(0));
  }

  function startLoop(key,buffer){
    const source=audio.ctx.createBufferSource();
    source.buffer=buffer; source.loop=true;
    source.connect(audio.stemGain[key]);
    source.start();
    audio.sources[key]=source;
  }

  async function loadSamples(){
    try{
      const stemEntries=await Promise.all(Object.entries(STEMS).map(async ([k,u])=>[k,await decode(u)]));
      const seEntries=await Promise.all(Object.entries(SFX).map(async ([k,u])=>[k,await decode(u)]));
      stemEntries.forEach(([k,b])=>startLoop(k,b));
      seEntries.forEach(([k,b])=>audio.buffers[k]=b);
      sampleMode=true;
      return true;
    }catch(err){
      sampleMode=false;
      console.warn("MONSTER LEGACY audio samples unavailable; oscillator fallback active.",err);
      return false;
    }
  }

  async function boot(){
    if(audio){ await audio.ctx.resume(); return audio; }
    if(bootPromise) return bootPromise;
    bootPromise=(async()=>{
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC) throw new Error("WebAudio unavailable");
      const ctx=new AC();
      const master=ctx.createGain(), musicBus=ctx.createGain(), sfxBus=ctx.createGain();
      master.gain.value=.62; musicBus.gain.value=.72; sfxBus.gain.value=.9;
      musicBus.connect(master); sfxBus.connect(master); master.connect(ctx.destination);
      const stemGain={};
      Object.keys(STEMS).forEach(k=>{const g=ctx.createGain();g.gain.value=0;g.connect(musicBus);stemGain[k]=g;});
      audio={ctx,master,musicBus,sfxBus,stemGain,sources:{},buffers:{},voltage:0};
      await loadSamples();
      await ctx.resume();
      return audio;
    })();
    return bootPromise;
  }

  function playSample(name){
    if(!audio || !sampleMode || !audio.buffers[name]) return false;
    const src=audio.ctx.createBufferSource();
    src.buffer=audio.buffers[name]; src.connect(audio.sfxBus); src.start();
    return true;
  }

  function applyMix(v,force=false){
    if(!audio || !enabled) return;
    const b=band(v);
    audio.voltage=v;
    ramp(audio.stemGain.base,.72,.55);
    ramp(audio.stemGain.heat,v>=30?Math.min(.65,.18+(v-30)/90):0,.45);
    ramp(audio.stemGain.rage,v>=60?Math.min(.72,.18+(v-60)/55):0,.4);
    ramp(audio.stemGain.danger,v>=90?Math.min(.82,.30+(v-90)/18):0,.35);
    ramp(audio.stemGain.legacy,v>=100?.9:0,v>=100?.24:.55);
    if((b!==lastBand && b!=="CALM")||force){ event(b==="LEGACY"?"legacy":"band"); }
    if(b==="LEGACY"){
      ramp(audio.musicBus,.48,.12);
      setTimeout(()=>{if(audio&&enabled)ramp(audio.musicBus,.72,.5)},420);
    }else ramp(audio.musicBus,.72,.45);
    lastBand=b;
  }

  async function setVoltage(v,force=false){
    v=Math.max(0,Math.min(100,Number(v)||0));
    const b=band(v);
    if(!enabled){lastBand=b;return b;}
    try{await boot();applyMix(v,force);}catch(e){console.warn(e)}
    return b;
  }

  async function enable(){
    if(enabled){ if(audio?.ctx?.state === "suspended") await audio.ctx.resume(); return true; }
    enabled=true;
    try{
      await boot();
      applyMix(audio?.voltage||0,true);
      return true;
    }catch(e){
      enabled=false;
      console.warn(e);
      return false;
    }
  }

  async function toggle(){
    if(!enabled) return await enable();
    enabled=false;
    if(audio) await audio.ctx.suspend();
    return false;
  }

  async function event(name){
    if(!enabled) return;
    try{
      await boot();
      if(!playSample(name)) fallbackTone(name);
    }catch(e){ console.warn(e); }
  }

  function isOn(){return enabled}
  function mode(){return sampleMode?"AUTHORED SAMPLE":"SYNTH FALLBACK"}
  function status(){return{enabled,mode:mode(),band:lastBand,loadedSamples:audio?Object.keys(audio.buffers).length:0}}
  return {toggle,enable,setVoltage,band,event,isOn,mode,status};
})();
