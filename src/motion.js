window.MLMotion = (() => {
  let enabled = true;
  const timers = new WeakMap();
  const byId = id => document.getElementById(id);

  function setEnabled(v){ enabled = !!v; }

  function clearTimer(el){
    const t = timers.get(el);
    if(t) clearTimeout(t);
    timers.delete(el);
  }

  function ensureFx(stage){
    let layer = stage?.querySelector('.fxLayer');
    if(!layer && stage){
      layer = document.createElement('div');
      layer.className = 'fxLayer';
      stage.appendChild(layer);
    }
    return layer;
  }

  function ensureAtmosphere(stageId){
    const stage = byId(stageId);
    if(!stage) return;
    let atm = stage.querySelector('.battleAtmosphere');
    if(!atm){
      atm = document.createElement('div');
      atm.className = 'battleAtmosphere';
      stage.prepend(atm);
    }
    let particles = stage.querySelector('.motionParticles');
    if(!particles){
      particles = document.createElement('div');
      particles.className = 'motionParticles';
      for(let i=0;i<14;i++){
        const s=document.createElement('i');
        s.style.setProperty('--x',`${7 + ((i*31)%88)}%`);
        s.style.setProperty('--y',`${8 + ((i*43)%80)}%`);
        s.style.setProperty('--d',`${4.2 + (i%5)*.8}s`);
        s.style.setProperty('--delay',`${-(i%7)*.67}s`);
        s.style.setProperty('--s',`${2 + (i%3)}px`);
        s.style.setProperty('--drift',`${-10 + (i%6)*4}px`);
        particles.appendChild(s);
      }
      stage.appendChild(particles);
    }
  }

  function setBand(stageId, band='CALM'){
    const stage=byId(stageId);
    if(!stage) return;
    ensureAtmosphere(stageId);
    ['calm','heat','rage','danger','legacy'].forEach(x=>stage.classList.remove(`vol-${x}`));
    stage.classList.add(`vol-${String(band).toLowerCase()}`);
    stage.dataset.volBand=String(band).toUpperCase();
  }

  function camera(stageId, strength='light'){
    if(!enabled) return;
    const stage=byId(stageId); if(!stage) return;
    ['camera-light','camera-medium','camera-heavy'].forEach(c=>stage.classList.remove(c));
    void stage.offsetWidth;
    stage.classList.add(`camera-${strength}`);
    clearTimer(stage);
    const ms=strength==='heavy'?420:strength==='medium'?300:220;
    timers.set(stage,setTimeout(()=>stage.classList.remove(`camera-${strength}`),ms));
  }

  function hitStop(stageId, ms=72){
    if(!enabled) return;
    const stage=byId(stageId); if(!stage) return;
    stage.classList.add('hitStop');
    setTimeout(()=>stage.classList.remove('hitStop'),ms);
  }

  function burst(stageId, type='hit', x=50, y=43){
    if(!enabled) return;
    const stage=byId(stageId); if(!stage) return;
    const layer=ensureFx(stage); if(!layer) return;
    const b=document.createElement('div');
    b.className=`impactBurst ${type}`;
    b.style.left=`${x}%`; b.style.top=`${y}%`;
    for(let i=0;i<7;i++){
      const r=document.createElement('i');
      r.style.setProperty('--r',`${i*360/7}deg`);
      b.appendChild(r);
    }
    layer.appendChild(b);
    setTimeout(()=>b.remove(),620);
  }

  function legacyFreeze(stageId, ms=150){
    if(!enabled) return;
    const stage=byId(stageId); if(!stage) return;
    stage.classList.add('legacyFreeze');
    setTimeout(()=>{
      stage.classList.remove('legacyFreeze');
      stage.classList.add('legacySurge');
      setTimeout(()=>stage.classList.remove('legacySurge'),620);
    },ms);
  }

  function clearTelegraph(stage){
    ['telegraph-single','telegraph-aoe','telegraph-random3','telegraph-legacy','telegraph-crash'].forEach(c=>stage.classList.remove(c));
  }

  function telegraph({stageId,imgId,dir,bossId,action,band,skipped=false}){
    const stage=byId(stageId), img=byId(imgId);
    if(!stage || !img || !dir) return;
    clearTelegraph(stage);
    if(skipped){
      stage.classList.add('telegraph-crash');
      img.src=MLAsset(`${dir}/hit.png`);
      return;
    }
    const type=action?.legacy?'legacy':action?.type||'single';
    stage.classList.add(`telegraph-${type}`);
    stage.dataset.telegraph=type;
    let pose='idle';
    if(action?.legacy || String(band).toUpperCase()==='LEGACY' || String(band).toUpperCase()==='DANGER') pose='danger';
    else if((bossId==='owl'||bossId==='manticore')) pose='attack_prep';
    else if(bossId==='boar'||bossId==='wind') pose='stance';
    img.onerror=()=>{ img.onerror=null; img.src=MLAsset(`${dir}/idle.png`); };
    img.src=MLAsset(`${dir}/${pose}.png`);
  }

  function animateAlly({el,img,battle,kind='CORE',delay=0}){
    if(!enabled || !el || !img || !battle) return;
    setTimeout(()=>{
      el.classList.add(kind==='ROLE'?'allyWindupRole':'allyWindup');
      img.src=MLAsset(`${battle}/stance.png`);
    },delay);
    setTimeout(()=>{
      el.classList.remove('allyWindup','allyWindupRole');
      el.classList.add(kind==='EQUIPMENT'?'allyCast':'allyStrike');
      img.src=MLAsset(`${battle}/attack.png`);
    },delay+120);
    setTimeout(()=>{
      el.classList.remove('allyStrike','allyCast');
      img.src=MLAsset(`${battle}/idle.png`);
    },delay+500);
  }

  function impactAlly({el,img,battle,down=false,delay=0}){
    if(!enabled || !el || !img || !battle) return;
    setTimeout(()=>{
      el.classList.add('allyImpact');
      img.src=MLAsset(`${battle}/hit.png`);
    },delay);
    setTimeout(()=>{
      el.classList.remove('allyImpact');
      img.src=MLAsset(`${battle}/${down?'danger':'idle'}.png`);
    },delay+390);
  }


  function orderFeedback(stageId,uid,stanceUid,count=1){
    if(!enabled) return;
    const stage=byId(stageId); if(!stage) return;
    stage.querySelectorAll('.fieldAlly.orderPulse,.fieldAlly.stancePulse').forEach(el=>el.classList.remove('orderPulse','stancePulse'));
    const actor=byId(`field-${uid}`);
    if(actor){ actor.classList.add('orderPulse'); setTimeout(()=>actor.classList.remove('orderPulse'),360); }
    if(count>=2 && stanceUid){
      const st=byId(`field-${stanceUid}`);
      if(st){ st.classList.add('stancePulse'); setTimeout(()=>st.classList.remove('stancePulse'),520); }
    }
    stage.classList.remove('decisionBeat'); void stage.offsetWidth; stage.classList.add('decisionBeat');
    setTimeout(()=>stage.classList.remove('decisionBeat'),430);
  }

  function targetForecast(stageId,action,party=[]){
    const stage=byId(stageId); if(!stage) return;
    stage.querySelectorAll('.fieldAlly.forecastTarget').forEach(el=>el.classList.remove('forecastTarget'));
    stage.classList.toggle('forecastAoe',action?.type==='aoe');
    stage.classList.toggle('forecastRandom',action?.type==='random3');
    if(action?.type==='single' && action?.target){
      const el=byId(`field-${action.target}`);
      if(el) el.classList.add('forecastTarget');
    }
  }


  function bossIntent(stageId,bossId,action){
    if(!enabled) return;
    const stage=byId(stageId); if(!stage) return;
    ['intent-boar','intent-owl','intent-manticore','intent-single','intent-aoe','intent-random3','intent-legacy'].forEach(c=>stage.classList.remove(c));
    if(bossId) stage.classList.add(`intent-${bossId}`);
    const type=action?.legacy?'legacy':action?.type||'single';
    stage.classList.add(`intent-${type}`);
  }

  function focus(stageId,mode='neutral',targetId=null){
    if(!enabled) return;
    const stage=byId(stageId); if(!stage) return;
    ['focus-enemy','focus-party','focus-target','focus-wide','focus-neutral'].forEach(c=>stage.classList.remove(c));
    stage.classList.add(`focus-${mode}`);
    stage.querySelectorAll('.fieldAlly.focused').forEach(el=>el.classList.remove('focused'));
    if(targetId){ const t=byId(`field-${targetId}`); if(t) t.classList.add('focused'); }
    setTimeout(()=>{stage.classList.remove(`focus-${mode}`);stage.querySelectorAll('.fieldAlly.focused').forEach(el=>el.classList.remove('focused'));},mode==='enemy'?520:460);
  }

  function slashTrail(stageId,kind='ally',x=50,y=46){
    if(!enabled) return;
    const stage=byId(stageId); if(!stage) return;
    const layer=ensureFx(stage); if(!layer) return;
    const t=document.createElement('div');
    t.className=`motionTrail ${kind}`; t.style.left=`${x}%`; t.style.top=`${y}%`;
    layer.appendChild(t); setTimeout(()=>t.remove(),560);
  }

  function joinCinematic(stageId='huntStage'){
    if(!enabled) return;
    const stage=byId(stageId); if(!stage) return;
    stage.classList.add('joinCinematic');
    burst(stageId,'join',50,42); camera(stageId,'medium');
    setTimeout(()=>stage.classList.remove('joinCinematic'),1050);
  }

  function fusionCinematic(el){
    if(!enabled || !el) return;
    el.classList.remove('fusionCinematic'); void el.offsetWidth; el.classList.add('fusionCinematic');
    setTimeout(()=>el.classList.remove('fusionCinematic'),1350);
  }

  function enemyStrike(stageId, type='single'){
    if(!enabled) return;
    const stage=byId(stageId); if(!stage) return;
    stage.classList.remove('enemyStrikeSingle','enemyStrikeAoe','enemyStrikeRandom');
    void stage.offsetWidth;
    const cls=type==='aoe'?'enemyStrikeAoe':type==='random3'?'enemyStrikeRandom':'enemyStrikeSingle';
    stage.classList.add(cls);
    setTimeout(()=>stage.classList.remove(cls),650);
  }


  function enemyWarning(stageId, action={}, skipped=false){
    if(!enabled) return;
    const stage=byId(stageId); if(!stage) return;
    stage.classList.remove('enemy-read','enemy-read-aoe','enemy-read-random','enemy-read-skip');
    stage.querySelectorAll('.fieldAlly.enemyThreat').forEach(el=>el.classList.remove('enemyThreat'));
    stage.classList.add('enemy-read');
    if(skipped){ stage.classList.add('enemy-read-skip'); }
    else if(action.type==='aoe'){
      stage.classList.add('enemy-read-aoe');
      stage.querySelectorAll('.fieldAlly').forEach(el=>el.classList.add('enemyThreat'));
    }else if(action.type==='random3'){
      stage.classList.add('enemy-read-random');
      stage.querySelectorAll('.fieldAlly').forEach(el=>el.classList.add('enemyThreat'));
    }else{
      const id=action.target;
      const el=id?stage.querySelector(`[id="field-${id}"]`):null;
      if(el) el.classList.add('enemyThreat');
    }
    setTimeout(()=>{
      stage.classList.remove('enemy-read','enemy-read-aoe','enemy-read-random','enemy-read-skip');
      stage.querySelectorAll('.fieldAlly.enemyThreat').forEach(el=>el.classList.remove('enemyThreat'));
    },1700);
  }

  function enemyImpactBeat(stageId, action={}){
    if(!enabled) return;
    const stage=byId(stageId); if(!stage) return;
    stage.classList.add('enemy-impact-beat');
    setTimeout(()=>stage.classList.remove('enemy-impact-beat'),520);
  }

  return {setEnabled,ensureAtmosphere,setBand,camera,hitStop,burst,legacyFreeze,telegraph,animateAlly,impactAlly,enemyStrike,orderFeedback,targetForecast,bossIntent,focus,slashTrail,joinCinematic,fusionCinematic,enemyWarning,enemyImpactBeat};
})();
