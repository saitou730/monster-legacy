window.MLFusion = (() => {
  const TRAITS = {
    a: {
      '昂火牙': {id:'rising_fire_fang', name:'昂火牙', source:'火トカゲ', effect:'CORE VOL+2 / Damage+4%'},
      '火走り': {id:'fire_run', name:'火走り', source:'火トカゲ', effect:'STANCE後の次攻撃+10%'}
    },
    b: {
      '風影': {id:'wind_shadow', name:'風影', source:'風コウモリ', effect:'回避成功で敵VOL-4'},
      '滑空姿勢': {id:'glide_form', name:'滑空姿勢', source:'風コウモリ', effect:'STANCE後回避補正+15%'}
    }
  };

  function getTrait(side,name){ return TRAITS[side]?.[name] || Object.values(TRAITS[side] || {})[0] || null; }

  function preview(aName,bName){
    const a=getTrait('a',aName), b=getTrait('b',bName);
    return {
      recipeId:'special_fire_wind_001',
      parents:[
        {id:'fire_hino', species:'火トカゲ', individual:'ヒノ', consumed:true},
        {id:'wind_phil', species:'風コウモリ', individual:'フィル', consumed:true}
      ],
      result:{id:'flame', species:'炎翼リザル', tier:'T3 SPECIAL'},
      heritage:[a,b].filter(Boolean),
      growthEchoRatio:0.6,
      resultRandom:false,
      equipmentReturned:true,
      legacyCoreReturned:true
    };
  }

  function execute(state,aName,bName){
    if(!state.joinedBat || state.fused) return {ok:false, reason:state.fused?'already_fused':'missing_parent'};
    const p=preview(aName,bName);
    state.fused=true;
    state.testComplete=false;
    state.fusion={
      ...(state.fusion||{}),
      heritageA:p.heritage[0]?.name || aName,
      heritageB:p.heritage[1]?.name || bName,
      growthEcho:p.growthEchoRatio,
      lastRecipe:p.recipeId,
      lineageHistory:[...(state.fusion?.lineageHistory||[]),{
        at:new Date().toISOString(),
        parents:p.parents.map(x=>({species:x.species,individual:x.individual})),
        result:p.result.species,
        heritage:p.heritage.map(x=>x.name),
        growthEcho:p.growthEchoRatio
      }]
    };
    return {ok:true, preview:p};
  }

  return {TRAITS,getTrait,preview,execute};
})();
