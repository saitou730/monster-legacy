// Additive Area 1 receipts. Presentation never grants progress or ownership.
window.MLArea = (() => {
  const order=['entered','discovered','resolved','joined','returned'];
  const LESSONS={read:'read',suppress:'suppress'};
  const APPROACHES={observe:'observe',pressure:'pressure'};

  function persistedArea(state){
    if(typeof window.MLStorage?.load!=='function') return null;
    try{
      const latest=window.MLStorage.load();
      if(latest?.chapter1?.progress?.state!==state?.chapter1?.progress?.state) return null;
      return latest?.area1||null;
    }catch(_){ return null; }
  }

  function read(state){
    const stored=persistedArea(state);
    const a={...(state.area1||{}),...(stored||{})};
    let last=order.reduce((n,k,i)=>a[k]===true?i:n,-1);
    if(state.monsterRoster?.includes('SP-044')) last=Math.max(last,3);
    order.forEach((k,i)=>a[k]=i<=last);
    return a;
  }

  function hunt(state){
    const a=read(state);
    const h=a.hunt||{};
    return {
      lesson: LESSONS[h.lesson]||null,
      approach: APPROACHES[h.approach]||null,
      attempt:{
        rageEntered:!!h.attempt?.rageEntered,
        readProven:!!h.attempt?.readProven,
        suppressProven:!!h.attempt?.suppressProven
      },
      lastFailure:h.lastFailure||null
    };
  }

  function qualified(state){
    const h=hunt(state), a=h.attempt;
    if(!h.lesson || !h.approach || a.rageEntered) return false;
    return h.lesson==='read' ? a.readProven : a.suppressProven;
  }

  function failureReason(state){
    const h=hunt(state), a=h.attempt;
    if(a.rageEntered) return '雷が高まりすぎた。RAGEに入る前にVOLTAGEを抑えて、もう一度挑もう。';
    if(h.lesson==='read' && !a.readProven) return '攻撃はしのいだが、雷フクロウの動きを読み切れていない。守り・回避のSTANCEを活かしてもう一度挑もう。';
    if(h.lesson==='suppress' && !a.suppressProven) return '雷の高まりを抑えきれなかった。HEATからCALMへ戻してみよう。';
    return '狩りの条件がまだ揃っていない。選んだ手がかりを戦いで証明しよう。';
  }

  function commit(state,event,persist){
    if(state.chapter1?.progress?.state!=='P20_CHAPTER1_COMPLETE_HOME') return false;
    const current=read(state);
    if(event==='resolved' && !qualified({...state,area1:current})){
      current.lastFailure=failureReason({...state,area1:current});
      const failed={...state,area1:current};
      persist(failed);
      if(typeof document!=='undefined') setTimeout(()=>showBattleFailure(current.lastFailure),80);
      return false;
    }
    const a=current, i=order.indexOf(event);
    if(i<0 || (i>0&&!a[order[i-1]])) return false;
    a[event]=true;
    if(event==='resolved') a.lastFailure=null;
    const next={...state,area1:a,monsterRoster:[...new Set([...(state.monsterRoster||[]),...(a.joined?['SP-044']:[])])]};
    if(!persist(next)) return false;
    Object.assign(state,next);
    return true;
  }

  function saveHuntPatch(patch){
    if(typeof window.MLStorage?.load!=='function') return false;
    const state=window.MLStorage.load();
    if(state?.chapter1?.progress?.state!=='P20_CHAPTER1_COMPLETE_HOME') return false;
    const a=read(state), previous=a.hunt||{};
    a.hunt={...previous,...patch};
    state.area1=a;
    return !!window.MLStorage.save(state);
  }

  function chooseLesson(value){
    if(!LESSONS[value]) return false;
    const ok=saveHuntPatch({lesson:value,approach:null,attempt:{rageEntered:false,readProven:false,suppressProven:false},lastFailure:null});
    if(ok) paintArea();
    return ok;
  }

  function chooseApproach(value){
    if(!APPROACHES[value]) return false;
    const ok=saveHuntPatch({approach:value,attempt:{rageEntered:false,readProven:false,suppressProven:false},lastFailure:null});
    if(ok) paintArea();
    return ok;
  }

  function confirmDiscovery(){
    if(typeof window.MLStorage?.load!=='function') return false;
    const state=window.MLStorage.load(), h=hunt(state);
    if(!h.lesson || !h.approach) return false;
    if(!commit(state,'discovered',window.MLStorage.save)) return false;
    const committedArea=read(state);
    if(window.ML?.advanceArea) window.ML.advanceArea();
    // Root battle navigation persists its long-lived closure state. Reconcile that write with
    // the authoritative discovery transaction so both ordered receipts and hunt evidence survive.
    const latest=window.MLStorage.load();
    if(latest?.chapter1?.progress?.state==='P20_CHAPTER1_COMPLETE_HOME'){
      latest.area1={...(latest.area1||{}),...committedArea,hunt:{...(committedArea.hunt||{}),lesson:h.lesson,approach:h.approach,attempt:h.attempt,lastFailure:null}};
      window.MLStorage.save(latest);
    }
    return true;
  }

  function persistAttempt(patch){
    if(typeof window.MLStorage?.load!=='function') return;
    const state=window.MLStorage.load(), a=read(state), h=a.hunt||{};
    if(!a.discovered || a.resolved || !h.lesson || !h.approach) return;
    h.attempt={rageEntered:false,readProven:false,suppressProven:false,...(h.attempt||{}),...patch};
    a.hunt=h; state.area1=a; window.MLStorage.save(state);
  }

  function resetAttemptForBattle(){
    persistAttempt({rageEntered:false,readProven:false,suppressProven:false});
    if(typeof window.MLStorage?.load==='function'){
      const state=window.MLStorage.load(), a=read(state), h=a.hunt||{};
      if(a.discovered && !a.resolved && h.lesson && h.approach){
        h.attempt={rageEntered:false,readProven:false,suppressProven:false};
        h.lastFailure=null; a.hunt=h; state.area1=a; window.MLStorage.save(state);
      }
    }
  }

  function activeHuntState(){
    if(typeof window.MLStorage?.load!=='function') return null;
    const state=window.MLStorage.load(), a=read(state), h=a.hunt||{};
    return state?.chapter1?.progress?.state==='P20_CHAPTER1_COMPLETE_HOME' && a.discovered && !a.resolved && h.lesson && h.approach ? {state,a,h}:null;
  }

  function patchBattleFactory(){
    if(!window.MLBattle?.createBoss || window.MLBattle.__owlFunPass) return;
    const original=window.MLBattle.createBoss.bind(window.MLBattle);
    window.MLBattle.createBoss=(bossId,party)=>{
      const base=original(bossId,party);
      const active=bossId==='owl' ? activeHuntState() : null;
      if(!active) return base;
      resetAttemptForBattle();
      if(active.h.approach==='pressure'){
        base.vol=30;
        base.lockedAction=window.MLBattle.actionFor('owl',base.vol,base.turn);
      }
      return new Proxy(base,{
        set(target,prop,value){
          if(prop==='vol'){
            const prev=Number(target.vol), next=Math.max(0,Math.min(100,Number(value)));
            target[prop]=next;
            if(prev>=30 && prev<60 && next<30) persistAttempt({suppressProven:true});
            if(next>=60) persistAttempt({rageEntered:true});
            return true;
          }
          if(prop==='enteredRage' && value) persistAttempt({rageEntered:true});
          if(prop==='turn' && Number(value)>Number(target.turn)){
            const selected=new Set((target.queue||[]).map(q=>q.uid));
            const remaining=(target.party||[]).find(u=>!selected.has(u.id));
            const protectedStance=remaining && (remaining.roleType==='guard' || String(remaining.roleType||'').startsWith('evade'));
            if(target.lockedAction?.type==='single' && protectedStance && (target.party||[]).some(u=>u.hp>0)) persistAttempt({readProven:true});
          }
          target[prop]=value;
          return true;
        }
      });
    };
    window.MLBattle.__owlFunPass=true;
  }

  function showBattleFailure(reason){
    const result=document.getElementById('bossResult');
    if(!result) return;
    result.innerHTML=`<div class="bossReward"><div class="eyebrow">HUNT RETRY</div><div class="rewardName">まだ仲間になる条件を満たしていない</div><div class="small">${reason}</div><div class="bossResultActions"><button class="btn primary" onclick="ML.resetBoss()">すぐ再挑戦</button></div></div>`;
  }

  function paintArea(){
    if(typeof document==='undefined' || typeof window.MLStorage?.load!=='function') return;
    const holder=document.getElementById('areaContent');
    if(!holder) return;
    const state=window.MLStorage.load(), a=read(state), h=hunt(state);
    if(!a.entered || a.returned) return;
    if(a.resolved && !a.joined){
      holder.innerHTML=`<img src="assets/battle/owl/idle.png" alt="雷フクロウ" style="display:block;width:100%;height:240px;object-fit:contain"><div class="eyebrow">HUNT COMPLETE</div><h2>雷フクロウが同行を選んだ</h2><p>探索で選んだ読みを、戦いで証明した。雷フクロウはその判断を認めている。</p><div class="panel pad"><b>雷フクロウ / SP-044</b><div class="small">VOLTAGEを読み、守りと抑制の判断を要求する仲間。現在の3体編成は自動では変わらない。</div></div><button class="btn primary" onclick="ML.advanceArea()">JOINを記録する</button><button class="btn" onclick="ML.go('home')">拠点へ</button>`;
      return;
    }
    if(a.discovered) return;
    const lessonName=h.lesson==='read'?'羽音を追う':h.lesson==='suppress'?'焦げ跡を調べる':'';
    const approachName=h.approach==='observe'?'距離を取って観察する':h.approach==='pressure'?'先回りして圧をかける':'';
    if(!h.lesson){
      holder.innerHTML=`<div class="eyebrow">雷の痕跡 / 1 of 3</div><h2>何を手がかりにする？</h2><p>焦げた枝の奥で、羽音と放電の跡が別方向へ続いている。</p><button class="btn primary" onclick="MLArea.chooseLesson('read')">羽音を追う</button><button class="btn" onclick="MLArea.chooseLesson('suppress')">焦げ跡を調べる</button><button class="btn" onclick="ML.go('home')">拠点へ</button>`;
      return;
    }
    if(!h.approach){
      holder.innerHTML=`<div class="eyebrow">雷の痕跡 / 2 of 3</div><h2>どう近づく？</h2><p>手がかりは「${lessonName}」。雷フクロウの気配が近い。</p><button class="btn primary" onclick="MLArea.chooseApproach('observe')">距離を取って観察する</button><button class="btn" onclick="MLArea.chooseApproach('pressure')">先回りして圧をかける</button><div class="small">先回りすると戦闘開始時からHEAT。危険だが、VOLTAGEを抑える機会をすぐ作れる。</div>`;
      return;
    }
    const lesson=h.lesson==='read'?'予告された単体攻撃を読み、守り・回避のSTANCEを活かす':'HEATまで高まったVOLTAGEを、既存の技でCALMへ戻す';
    const opening=h.approach==='pressure'?'開始時VOLTAGEはHEAT。RAGEへ上げすぎない。':'通常のCALMから開始。VOLTAGEの上がり方を見る。';
    holder.innerHTML=`<img src="assets/battle/owl/idle.png" alt="雷フクロウ" style="display:block;width:100%;height:220px;object-fit:contain"><div class="eyebrow">雷の痕跡 / 3 of 3</div><h2>雷フクロウを捉えた</h2><p><b>${lessonName}</b> → <b>${approachName}</b></p><div class="panel pad"><b>今回の狩り</b><div class="small">${lesson}<br>${opening}<br>共通条件：一度もRAGEに入れずに勝つ。</div></div><button class="btn primary" onclick="MLArea.confirmDiscovery()">この読みで挑む</button><button class="btn" onclick="MLArea.chooseLesson('${h.lesson==='read'?'suppress':'read'}')">手がかりを選び直す</button>`;
  }

  function patchPublicML(){
    if(typeof document==='undefined') return;
    let value=window.ML;
    Object.defineProperty(window,'ML',{
      configurable:true,
      get(){ return value; },
      set(next){
        value=next;
        if(!next || next.__owlFunPass) return;
        const originalGo=next.go?.bind(next), originalAdvance=next.advanceArea?.bind(next);
        if(originalGo) next.go=(id,opts)=>{const r=originalGo(id,opts);if(id==='area')setTimeout(paintArea,0);return r;};
        if(originalAdvance) next.advanceArea=()=>{
          const state=window.MLStorage.load(), a=read(state);
          if(a.entered && !a.discovered){ paintArea(); return; }
          const r=originalAdvance(); setTimeout(paintArea,0); return r;
        };
        next.__owlFunPass=true;
        setTimeout(paintArea,0);
      }
    });
  }

  patchBattleFactory();
  patchPublicML();
  return {read,hunt,qualified,failureReason,commit,chooseLesson,chooseApproach,confirmDiscovery,paintArea};
})();