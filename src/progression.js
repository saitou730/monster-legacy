window.MLProgression = (() => {
  function next(state){
    const chapterPhase=state.chapter1?.progress?.state;
    if(chapterPhase==='P19_ARCHIVE_UNLOCK') return {screen:'archive',label:'旅の記録を完成する',sub:'JOIN / FUSION / CONTRACT / 不退転をARCHIVEへ',kind:'ARCHIVE'};
    if(chapterPhase==='P20_CHAPTER1_COMPLETE_HOME') return {screen:'home',label:'CHAPTER 1 COMPLETE',sub:'残響の獣 — 次のエリア解放を待つ',kind:'COMPLETE'};
    if(!state.storyComplete) return {screen:'story',label:'CHAPTER 1を進める',sub:`残響の獣 / ${Math.min((state.storyStep||0)+1,6)} of 6`,kind:'STORY'};
    if(!state.joinedBat) return {screen:'hunt',label:'風コウモリをJOIN',sub:'回避 → HP35%以下 → RAGE未満',kind:'HUNT'};
    if(!state.fused) return {screen:'fusion',label:'炎翼リザルを継ぐ',sub:'親2体からHERITAGEを1つずつ選択',kind:'FUSION'};
    if(!state.testComplete) return {screen:'test',label:'NEW SPECIES TEST',sub:'炎翼牙と回避成功を実戦で確認',kind:'TEST'};
    if(!state.supportContract) return {screen:'contract',label:'契約信号を確認',sub:'無料確定契約 → LyraをSUPPORTへ',kind:'CONTRACT'};
    if(!state.mastery?.boar) return {screen:'boss',boss:'boar',label:'荊棘の大猪 MASTERY',sub:'VOL100 → LEGACY ARTを耐えて撃破',kind:'BOSS'};
    if(!state.legacyCores?.unyielding) return {screen:'archive',label:'不退転を受け取る',sub:'大猪の戦い方をLEGACYとして受け継ぐ',kind:'LEGACY'};
    if(!state.mastery?.owl) return {screen:'boss',boss:'owl',label:'雷フクロウ MASTERY',sub:'一度もRAGEへ入れず撃破',kind:'BOSS'};
    if(!state.mastery?.manticore) return {screen:'boss',boss:'manticore',label:'裂空マンティコア MASTERY',sub:'CRASHを2回発生させて撃破',kind:'BOSS'};
    return {screen:'archive',label:'LEGACY ARCHIVE',sub:'3つの残響を仲間へ継ぎ、編成差を試す',kind:'ARCHIVE'};
  }
  return {next};
})();
