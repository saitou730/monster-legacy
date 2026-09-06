window.MLTestBattle = (() => {
  function actionFor(turn){
    return turn % 2 === 1
      ? {name:'残響突進',type:'single',dmg:26,target:'flame',tag:'EVADE CHECK'}
      : {name:'震動波',type:'aoe',dmg:13,tag:'STANCE CHECK'};
  }

  function create(party){
    return {
      hp:190,maxHp:190,vol:28,turn:1,queue:[],party,
      lockedAction:actionFor(1),
      evade:false,guard:false,boost:false,
      coreUsed:false,evadeSucceeded:false,won:false
    };
  }

  function complete(t){ return !!(t.won && t.coreUsed && t.evadeSucceeded); }

  return {actionFor,create,complete};
})();
