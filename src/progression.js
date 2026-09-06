window.MLProgression = (() => {
  function next(state){
    if(!state.storyComplete) return {screen:'story',label:'CHAPTER 1を進める',sub:`残響の獣 / ${Math.min((state.storyStep||0)+1,6)} of 6`,kind:'STORY'};
    if(!state.joinedBat) return {screen:'hunt',label:'風コウモリをJOIN',sub:'回避 → HP35%以下 → RAGE未満',kind:'HUNT'};
    if(!state.fused) return {screen:'fusion',label:'炎翼リザルを継ぐ',sub:'親2体からHERITAGEを1つずつ選択',kind:'FUSION'};
    if(!state.testComplete) return {screen:'test',label:'NEW SPECIES TEST',sub:'炎翼牙と回避成功を実戦で確認',kind:'TEST'};
    if(!state.mastery?.boar) return {screen:'boss',boss:'boar',label:'荊棘の大猪 MASTERY',sub:'VOL100 → LEGACY ARTを耐えて撃破',kind:'BOSS'};
    if(!state.mastery?.owl) return {screen:'boss',boss:'owl',label:'雷フクロウ MASTERY',sub:'一度もRAGEへ入れず撃破',kind:'BOSS'};
    if(!state.mastery?.manticore) return {screen:'boss',boss:'manticore',label:'裂空マンティコア MASTERY',sub:'CRASHを2回発生させて撃破',kind:'BOSS'};
    return {screen:'archive',label:'LEGACY ARCHIVE',sub:'3つの残響を仲間へ継ぎ、編成差を試す',kind:'ARCHIVE'};
  }
  return {next};
})();
