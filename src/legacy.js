window.MLLegacy = (() => {
  const BOSS_TO_CORE = {boar:"unyielding", owl:"quiet_thunder", manticore:"falling_wind"};
  function coreIdForBoss(bossId){ return BOSS_TO_CORE[bossId] || null; }
  function unlockForBoss(state,bossId){
    const id=coreIdForBoss(bossId); if(!id) return null;
    state.legacyCores = state.legacyCores || {};
    const was=!!state.legacyCores[id]; state.legacyCores[id]=true;
    return {id,newlyUnlocked:!was};
  }
  function equippedId(state,uid){ return state.legacyEquipped?.[uid] || null; }
  function equippedCore(data,state,uid){ const id=equippedId(state,uid); return id ? data.legacyCores[id] || null : null; }
  function equip(data,state,uid,coreId){
    if(coreId && !state.legacyCores?.[coreId]) return false;
    if(coreId && !data.legacyCores?.[coreId]) return false;
    state.legacyEquipped = state.legacyEquipped || {};
    state.legacyEquipped[uid]=coreId || null; return true;
  }
  function modifier(data,state,uid,context={}){
    const c=equippedCore(data,state,uid); const out={coreDamageMul:1,coreVolDelta:0,guardSingleMul:1,guardAoeMul:1,stanceHealBonus:0,calmBonus:0,evadeVolDownBonus:0,crashDamageBonus:0};
    if(!c) return out;
    const hp=context.hp??999, maxHp=context.maxHp??999, low=maxHp>0 && hp/maxHp<=0.5;
    if(c.id==='unyielding'){
      if(uid==='goura' && low){out.guardSingleMul=.82;out.guardAoeMul=.89;}
      if(uid==='fire' && low) out.coreDamageMul=1.18;
      if(uid==='leaf' && context.anyAllyLow) out.stanceHealBonus=6;
      if(uid==='flame' && low) out.coreDamageMul=1.10;
    }
    if(c.id==='quiet_thunder'){
      if(uid==='goura') out.coreVolDelta=-2;
      if(uid==='fire') out.coreVolDelta=-3;
      if(uid==='leaf') out.calmBonus=4;
      if(uid==='flame') out.evadeVolDownBonus=3;
    }
    if(c.id==='falling_wind'){
      if(context.crash) out.crashDamageBonus = uid==='leaf'||uid==='flame' ? .20 : .15;
    }
    return out;
  }
  return {coreIdForBoss,unlockForBoss,equippedId,equippedCore,equip,modifier};
})();
