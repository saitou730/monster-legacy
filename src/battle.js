window.MLBattle = (() => {
  const D = window.ML_DATA;

  function band(v){
    return v >= 100 ? "LEGACY" : v >= 90 ? "DANGER" : v >= 60 ? "RAGE" : v >= 30 ? "HEAT" : "CALM";
  }

  function actionFor(bossId, vol, turn){
    const b = band(vol);

    if(bossId === "boar"){
      if(vol >= 100) return {name:"大地崩壊突進", type:"aoe", dmg:50, legacy:true, tag:"LEGACY ART"};
      if(b === "DANGER") return {name:"大暴走", type:"aoe", dmg:34, tag:"DANGER"};
      if(b === "RAGE") return {name:"暴走突進", type:"single", dmg:42, target:"flame", tag:"RAGE"};
      if(b === "HEAT") return {name:"地面震動", type:"aoe", dmg:20, tag:"HEAT"};
      return {name:"角突き", type:"single", dmg:30, target:"goura", tag:"CALM"};
    }

    if(bossId === "owl"){
      if(b === "DANGER" || b === "LEGACY") return {name:"雷嵐", type:"aoe", dmg:42, tag:"DANGER"};
      if(b === "RAGE") return {name:"連雷羽", type:"random3", dmg:17, tag:"RAGE"};
      if(b === "HEAT") return {name:"帯電羽撃", type:"single", dmg:30, target:"flame", tag:"HEAT"};
      return {name:"微雷散羽", type:"aoe", dmg:12, tag:"CALM"};
    }

    // Manticore: HEAT+ periodically exposes a clear CRASH opportunity.
    if(b === "DANGER" || b === "LEGACY") return {name:"裂空連牙", type:"random3", dmg:20, tag:"DANGER"};
    if(b === "RAGE") return {name:"獣王爪", type:"single", dmg:44, target:"goura", tag:"RAGE"};
    if(b === "HEAT"){
      return turn % 2 === 0
        ? {name:"飛翔突貫", type:"single", dmg:50, target:"flame", crashable:true, tag:"CRASH CHANCE"}
        : {name:"裂風爪", type:"single", dmg:32, target:"goura", tag:"HEAT"};
    }
    return {name:"翼圧", type:"aoe", dmg:18, tag:"CALM"};
  }

  function createBoss(bossId, party){
    const spec = D.bosses[bossId];
    return {
      id:bossId,
      hp:spec.maxHp,
      maxHp:spec.maxHp,
      vol:spec.initialVol,
      turn:1,
      queue:[],
      party,
      lockedAction:actionFor(bossId, spec.initialVol, 1),
      guard:false,
      evade:false,
      boost:false,
      crash:false,
      skipEnemyNext:false,
      crashCount:0,
      enteredRage:false,
      legacyTriggered:false,
      legacySurvived:false,
      won:false,
      mastery:false
    };
  }

  function masteryCheck(b){
    if(!b.won) return false;
    if(b.id === "boar") return b.legacyTriggered && b.legacySurvived;
    if(b.id === "owl") return !b.enteredRage;
    if(b.id === "manticore") return b.crashCount >= 2;
    return false;
  }

  return { band, actionFor, createBoss, masteryCheck };
})();