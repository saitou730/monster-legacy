window.MLStorage = (() => {
  const KEY = window.ML_DATA.saveKey;
  const defaults = {
    joinedBat:false,
    fused:false,
    testComplete:false,
    fusion:{heritageA:"昂火牙",heritageB:"風影",growthEcho:0.6,lastRecipe:null,lineageHistory:[]},
    lastScreen:"home",
    selectedBoss:"boar",
    storyStep:0,
    storyComplete:false,
    party:["goura","fire","leaf"],
    equipment:{
      goura:"taunt_shield",
      fire:"pursuit_spear",
      flame:"silent_bow",
      wind:"wind_feather",
      leaf:"calm_bell"
    },
    clears:{boar:false, owl:false, manticore:false},
    mastery:{boar:false, owl:false, manticore:false},
    legacyCores:{unyielding:false, quiet_thunder:false, falling_wind:false},
    legacyEquipped:{goura:null, fire:null, leaf:null, wind:null, flame:null}
  };

  function load(){
    try{
      const parsed = JSON.parse(localStorage.getItem(KEY) || "{}");
      return {
        ...defaults,
        ...parsed,
        clears:{...defaults.clears, ...(parsed.clears || {})},
        mastery:{...defaults.mastery, ...(parsed.mastery || {})},
        legacyCores:{...defaults.legacyCores, ...(parsed.legacyCores || {})},
        legacyEquipped:{...defaults.legacyEquipped, ...(parsed.legacyEquipped || {})},
        equipment:{...defaults.equipment, ...(parsed.equipment || {})},
        party:Array.isArray(parsed.party)?parsed.party.slice(0,3):defaults.party.slice(),
        fusion:{...defaults.fusion, ...(parsed.fusion || {}), lineageHistory:[...(parsed.fusion?.lineageHistory || [])]}
      };
    }catch(_){
      return typeof structuredClone === "function" ? structuredClone(defaults) : JSON.parse(JSON.stringify(defaults));
    }
  }

  function save(state){
    try{ localStorage.setItem(KEY, JSON.stringify(state)); return true; }
    catch(_){ return false; }
  }

  function reset(){
    try{ localStorage.removeItem(KEY); return true; }
    catch(_){ return false; }
  }

  return { load, save, reset };
})();