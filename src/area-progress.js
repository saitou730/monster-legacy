// Additive Area 1 receipts. Presentation never grants progress or ownership.
window.MLArea = (() => {
  const order=['entered','discovered','resolved','joined','returned'];
  function read(state){
    const a={...(state.area1||{})};
    let last=order.reduce((n,k,i)=>a[k]===true?i:n,-1);
    if(state.monsterRoster?.includes('SP-044')) last=Math.max(last,3);
    order.forEach((k,i)=>a[k]=i<=last);
    return a;
  }
  function commit(state,event,persist){
    if(state.chapter1?.progress?.state!=='P20_CHAPTER1_COMPLETE_HOME') return false;
    const a=read(state), i=order.indexOf(event);
    if(i<0 || (i>0&&!a[order[i-1]])) return false;
    a[event]=true;
    const next={...state,area1:a,monsterRoster:[...new Set([...(state.monsterRoster||[]),...(a.joined?['SP-044']:[])])]};
    if(!persist(next)) return false;
    Object.assign(state,next);
    return true;
  }
  return {read,commit};
})();
