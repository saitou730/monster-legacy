window.ML = (() => {
  const D = window.ML_DATA;
  const U = D.units;
  const $ = id => document.getElementById(id);
  const state = MLStorage.load();
  const params = new URLSearchParams(location.search);
  document.body.classList.toggle("directorMode", params.has("director") || params.has("tester"));

  let hunt = null;
  let testBattle = null;
  let boss = null;
  let resolvingBossTurn = false;
  let resolvingHuntTurn = false;
  let resolvingTestTurn = false;
  const heritageAlias = {昂火牙:"火炎適応",火走り:"牙撃強化",風影:"風読み",滑空姿勢:"回避反応"};
  const traits = {
    a:heritageAlias[state.fusion?.heritageA] || state.fusion?.heritageA || "火炎適応",
    b:heritageAlias[state.fusion?.heritageB] || state.fusion?.heritageB || "風読み"
  };
  function safeLocalGet(key){ try{return window.localStorage?.getItem(key) ?? null;}catch(_){return null;} }
  function safeLocalSet(key,value){ try{window.localStorage?.setItem(key,value);return true;}catch(_){return false;} }
  let motionEnabled = safeLocalGet("mlMotion") !== "off";

  function haptic(ms=18){
    if(motionEnabled && navigator.vibrate) navigator.vibrate(ms);
  }

  function animateStage(stageId, type, duration=520){
    if(!motionEnabled) return;
    const el = $(stageId);
    if(!el) return;
    ["anim-idle","anim-attack","anim-hit","anim-stance","anim-danger","anim-crash"].forEach(c=>el.classList.remove(c));
    void el.offsetWidth;
    el.classList.add(`anim-${type}`);
    if(type !== "idle" && type !== "danger"){
      setTimeout(()=>{
        el.classList.remove(`anim-${type}`);
        el.classList.add("anim-idle");
      }, duration);
    }
  }

  function shakeMain(){
    if(!motionEnabled) return;
    const el = document.querySelector("main");
    el.classList.remove("screenShake");
    void el.offsetWidth;
    el.classList.add("screenShake");
    setTimeout(()=>el.classList.remove("screenShake"),300);
  }

  function setMotionUI(){
    if(window.MLMotion) MLMotion.setEnabled(motionEnabled);
    document.body.classList.toggle("motionOff",!motionEnabled);
    const b = $("motionBtn");
    b.textContent = motionEnabled ? "MOTION ON" : "MOTION OFF";
    b.setAttribute("aria-pressed", String(motionEnabled));
    document.querySelectorAll(".battleArt,.lockedStage").forEach(el=>{
      if(motionEnabled && !el.classList.contains("placeholder")) el.classList.add("anim-idle");
      else el.classList.remove("anim-idle","anim-danger");
    });
  }


  function addFx(stageId, text, cls="damagePop"){
    const stage = $(stageId);
    if(!stage) return;
    let layer = stage.querySelector(".fxLayer");
    if(!layer){
      layer = document.createElement("div");
      layer.className = "fxLayer";
      stage.appendChild(layer);
    }
    const el = document.createElement("div");
    el.className = cls;
    el.textContent = text;
    layer.appendChild(el);
    setTimeout(()=>el.remove(),850);
  }

  function flashStage(stageId, type="hit"){
    const stage = $(stageId);
    if(!stage || !motionEnabled) return;
    let layer = stage.querySelector(".fxLayer");
    if(!layer){
      layer=document.createElement("div"); layer.className="fxLayer"; stage.appendChild(layer);
    }
    const flash=document.createElement("div");
    flash.className=`fxFlash ${type}`;
    layer.appendChild(flash);
    setTimeout(()=>flash.remove(),700);
  }

  function callout(text,type=""){
    const el=$("bossCallout");
    if(!el) return;
    el.textContent=text;
    el.className=`battleCallout ${type}`;
    void el.offsetWidth;
    el.classList.add("show");
    setTimeout(()=>el.className="battleCallout",900);
  }

  function pulseNext(){
    const el=$("bossNextCard");
    if(!el) return;
    el.classList.remove("lockedPulse");
    void el.offsetWidth;
    el.classList.add("lockedPulse");
  }

  function cloneUnit(id){
    const x = U[id];
    return {...x, hp:x.maxHp};
  }

  function availablePartyIds(){
    const ids=["goura","leaf"];
    if(state.fused) ids.splice(1,0,"flame");
    else { ids.splice(1,0,"fire"); if(state.joinedBat) ids.push("wind"); }
    return ids.filter(id=>D.units[id]);
  }

  function normalizeParty(){
    const avail=availablePartyIds();
    let ids=Array.isArray(state.party)?state.party.filter(id=>avail.includes(id)):[];
    ids=[...new Set(ids)];
    if(state.fused){ ids=ids.filter(id=>id!=="fire"&&id!=="wind"); if(!ids.includes("flame")) ids.splice(Math.min(1,ids.length),0,"flame"); }
    for(const id of avail) if(ids.length<3&&!ids.includes(id)) ids.push(id);
    ids=ids.slice(0,3);
    state.party=ids;
    return ids;
  }

  function currentParty(){ return normalizeParty().map(cloneUnit); }

  function save(){
    normalizeParty();
    MLStorage.save(state);
    renderOwned();
    lockFuse();
    renderHome();
    renderArchive();
  }

  async function chapterEvent(event,payload={}){
    try{
      if(!window.MLChapter1){
        await Promise.race([
          new Promise(resolve=>window.addEventListener("mlchapter1ready",resolve,{once:true})),
          new Promise((_,reject)=>setTimeout(()=>reject(new Error("Chapter 1 controller unavailable")),3000))
        ]);
      }
      const chapter=MLChapter1.migrateRootChapter(state);
      if(chapter.progress.receipts?.includes(event)) return true;
      if(!MLChapter1.canApplyEvent(chapter,event)) throw new Error(`Chapter 1 event out of order: ${event}`);
      const next=MLChapter1.applyRootChapterEvent(state,event,payload);
      if(!MLStorage.save(next)) throw new Error("Chapter 1 save failed");
      Object.assign(state,next);
      return true;
    }catch(error){
      console.error(error);
      toast("進行を保存できませんでした。もう一度お試しください。");
      return false;
    }
  }

  async function chapterPhase(){
    if(!window.MLChapter1){
      await Promise.race([
        new Promise(resolve=>window.addEventListener("mlchapter1ready",resolve,{once:true})),
        new Promise((_,reject)=>setTimeout(()=>reject(new Error("Chapter 1 controller unavailable")),3000))
      ]);
    }
    return MLChapter1.migrateRootChapter(state).progress.state;
  }

  function toast(text){
    const el = $("toast");
    el.textContent = text;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 1450);
  }

  function go(id,{chapterReady=false}={}){
    if(id === "hunt" && !chapterReady){ void routeHunt(); return; }
    if(id === "test" && !state.fused) id = "fusion";
    if(window.MLPlaytest){ MLPlaytest.event("screen_view",{screen:id}); if(id==="boss") MLPlaytest.event("boss_open",{boss:state.selectedBoss}); }
    document.body.classList.toggle("bossMode", id === "boss");
    document.body.classList.toggle("storyMode", id === "story");
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("show","screenTransition"));
    $(id).classList.add("show","screenTransition");
    setTimeout(()=>$(id)?.classList.remove("screenTransition"),320);
    document.querySelectorAll(".nav button").forEach(b => b.classList.toggle("on", b.dataset.go === id));
    closeSheet();

    state.lastScreen = id;
    MLStorage.save(state);

    if(id === "home") renderHome();
    if(id === "story") renderStory();
    if(id === "hunt") renderHunt();
    if(id === "party"){ renderOwned(); renderLoadout(); }
    if(id === "fusion") lockFuse();
    if(id === "test") renderTest();
    if(id === "contract") void renderContract();
    if(id === "boss") renderBoss();
    if(id === "archive") renderArchive();
  }

  async function routeHunt(){
    let phase;
    try{ phase=await chapterPhase(); }
    catch(error){ console.error(error); toast("進行を読み込めませんでした。"); return; }
    if(phase === "P05_HOME_FIRST_ARRIVAL"){
      showJourneyResult({
        eyebrow:"HUNT BRIEF / WIND TRACE",title:"力ではなく、開口を探す。",
        body:"荊棘の大猪を崩すには、攻撃を受け流す仲間が必要だ。<br>風の痕跡を追い、風コウモリの戦い方を理解しよう。",
        meta:"TARGET  風コウモリ\nJOIN  EVADE → HP35%以下 → RAGE未満 → RESONATE",
        art:`<img src="${MLAsset('assets/battle/wind_bat/idle.png')}" alt="風コウモリ">`,
        primary:"HUNTを受ける",onPrimary:async()=>{
          if(!await chapterEvent("HUNT_BRIEF_ACCEPT")) return;
          await routeHunt();
        }
      });
      return;
    }
    if(phase === "P06_HUNT_BRIEF"){
      if(!await chapterEvent("HUNT_START")) return;
    }
    go("hunt",{chapterReady:true});
  }

  function showJoinResult(){
    showJourneyResult({
      eyebrow:"RESONANCE / JOIN COMPLETE", title:"風コウモリが仲間になった",
      body:"戦い方を理解したことで、風コウモリが自ら同行を選んだ。<br>次は3体編成へ加え、関係を戦い方に変える。",
      meta:"JOIN METHOD  RESONATE\nROLE  EVADE / 風翼系\nNEXT  PARTY CONFIRM",
      art:`<img src="${MLAsset('assets/battle/wind_bat/idle.png')}" alt="風コウモリ">`,
      primary:"JOINを確認してPARTYへ", onPrimary:async()=>{
        if(!await chapterEvent("JOIN_RESULT_ACK")) return;
        go("party");
      }
    });
  }

  async function resumeChapterRoute(){
    let phase;
    try{ phase=await chapterPhase(); }catch(_){ go("home"); return; }
    if(phase==="P06_HUNT_BRIEF" || phase==="P07_HUNT_WIND_BAT"){ await routeHunt(); return; }
    if(phase==="P08_JOIN_RESULT"){ go("home"); showJoinResult(); return; }
    if(phase==="P09_PARTY_REBUILD"){ go("party"); return; }
    if(phase==="P10_FUSION_INTRO" || phase==="P11_FUSION_FLAME_WING"){ go("fusion"); return; }
    if(phase==="P12_NEW_SPECIES_TEST"){ go("test"); return; }
    if(phase==="P13_SUMMON_UNLOCK" || phase==="P14_SUMMON_TUTORIAL" || phase==="P15_CONTRACT_EQUIP"){ go("contract"); return; }
    go("home");
  }

  document.querySelectorAll(".nav button").forEach(b => b.onclick = () => go(b.dataset.go));

  function demo(v){
    v = Number(v);
    $("homeV").textContent = v;
    const b = MLAudio.band(v);
    const item = D.bands.find(x => x.name === b);
    $("bandDemo").textContent = b === "LEGACY" ? "LEGACY ART" : b;
    $("bandDesc").textContent = item ? item.desc : "";

    ["l1","l2","l3","l4","l5"].forEach(id => $(id).classList.remove("live"));
    $("l1").classList.add("live");
    if(v >= 30) $("l2").classList.add("live");
    if(v >= 60) $("l3").classList.add("live");
    if(v >= 90) $("l4").classList.add("live");
    if(v >= 100) $("l5").classList.add("live");
    MLAudio.setVoltage(v);
  }

  $("volDemo").oninput = e => demo(e.target.value);
  let audioGestureArmed = true;
  async function enableGameAudio(){
    if(!window.MLAudio) return false;
    const on = await MLAudio.enable();
    if($("musicBtn")) $("musicBtn").textContent = on ? "♫ SOUND ON" : "♫ SOUND OFF";
    if(on) demo($("volDemo")?.value ?? boss?.vol ?? 18);
    return on;
  }
  const unlockAudioOnGesture = async () => {
    if(!audioGestureArmed) return;
    audioGestureArmed=false;
    await enableGameAudio();
    document.removeEventListener("pointerdown",unlockAudioOnGesture,true);
    document.removeEventListener("keydown",unlockAudioOnGesture,true);
  };
  document.addEventListener("pointerdown",unlockAudioOnGesture,true);
  document.addEventListener("keydown",unlockAudioOnGesture,true);

  $("musicBtn").onclick = async (e) => {
    e.stopPropagation();
    audioGestureArmed=false;
    const on = await MLAudio.toggle();
    $("musicBtn").textContent = on ? "♫ SOUND ON" : "♫ SOUND OFF";
    if(on) demo($("volDemo").value);
  };


  function showIntro(){
    showJourneyResult({eyebrow:"CHAPTER 1 — 残響の獣",title:"森の奥で、獣が応える。",
      body:"ゴウラ、火トカゲ、葉ウサギと、最初の探索へ。<br>敵の次の動きを読み、動かす2体と、支える1体を決めよう。",
      meta:"予告を知る → 風コウモリを仲間に → 炎翼リザルへ合体",
      art:`<img src="${MLAsset('assets/battle/goura/idle.png')}" alt="ゴウラ">`,
      primary:"最初の探索へ",onPrimary:async()=>{
        if(!await chapterEvent("START")) return;
        state.introSeen=true;save();go("story");
      }});
  }

  const bootStart=$("bootStart");
  if(bootStart){
    bootStart.onclick=async()=>{
      await enableGameAudio();
      $("bootGate")?.classList.add("dismissed");
      if(!state.introSeen && !state.storyStep && !state.storyComplete && !state.joinedBat && !state.fused){ showIntro(); } else { await resumeChapterRoute(); }
      if(window.MLPlaytest) MLPlaytest.event("game_start",{entry:"home",progress:MLProgression.next(state).kind});
    };
  }

  $("motionBtn").onclick = () => {
    motionEnabled = !motionEnabled;
    safeLocalSet("mlMotion", motionEnabled ? "on" : "off");
    setMotionUI();
    haptic(12);
  };

  $("continueBtn").onclick = () => { const n=MLProgression.next(state); if(n.boss){state.selectedBoss=n.boss;boss=MLBattle.createBoss(n.boss,currentParty());} go(n.screen); };
  $("journeyGoBtn").onclick = () => { const n=MLProgression.next(state); if(n.boss){state.selectedBoss=n.boss;boss=MLBattle.createBoss(n.boss,currentParty());} go(n.screen); };
  $("resetSaveBtn").onclick = () => {
    if(confirm("Vertical Sliceの進行を初期化しますか？")){
      MLStorage.reset();
      location.reload();
    }
  };

  function renderHome(){
    const items = [
      ["STORY", state.storyComplete],
      ["JOIN", state.joinedBat],
      ["FUSION", state.fused],
      ["TEST", state.testComplete],
      ["BOAR", state.mastery.boar],
      ["OWL", state.mastery.owl],
      ["MANTICORE", state.mastery.manticore]
    ];
    $("progressStrip").innerHTML = items.map(x =>
      `<span class="progressPill ${x[1] ? "done" : ""}">${x[1] ? "✓ " : ""}${x[0]}</span>`
    ).join("");
    const n=MLProgression.next(state);
    $("homeObjective").textContent = n.label;
    $("homeObjectiveSub").textContent = n.sub;
    $("journeyGoBtn").textContent = n.kind === "BOSS" ? "挑む ›" : n.kind === "ARCHIVE" ? "開く ›" : "進む ›";
    $("continueBtn").textContent = n.kind === "ARCHIVE" ? "OPEN ARCHIVE" : "CONTINUE";

    const route = [
      {id:"story",label:"STORY",sub:"残響の獣",done:!!state.storyComplete, unlocked:true},
      {id:"hunt",label:"HUNT",sub:"風コウモリ",done:!!state.joinedBat, unlocked:!!state.storyComplete},
      {id:"party",label:"PARTY",sub:"編成",done:!!state.joinedBat, unlocked:!!state.storyComplete},
      {id:"fusion",label:"FUSION",sub:"炎翼リザル",done:!!state.fused, unlocked:!!state.joinedBat},
      {id:"test",label:"TEST",sub:"新種試験",done:!!state.testComplete, unlocked:!!state.fused},
      {id:"contract",label:"CONTRACT",sub:"Lyra Support",done:state.supportContract==="lyra_vell", unlocked:!!state.testComplete},
      {id:"boss",label:"BOSS",sub:"残響継承",done:!!state.mastery?.boar, unlocked:!!state.testComplete}
    ];
    const nextId = n.screen;
    const routeEl=$("journeyRoute");
    if(routeEl){
      routeEl.innerHTML=route.map(r=>`<button class="journeyNode ${r.done?'done':''} ${!r.unlocked?'locked':''} ${r.id===nextId?'current':''}" ${r.unlocked?'': 'disabled'} onclick="ML.goJourney('${r.id}')"><b>${r.done?'✓ ':''}${r.label}</b><small>${r.sub}</small></button>`).join('');
    }
    const partyEl=$("homePartyPreview");
    if(partyEl){
      partyEl.innerHTML=currentParty().map(u=>`<div class="homePartyUnit"><img src="${MLAsset(`${u.battle}/idle.png`)}" alt="${u.name}"><b>${u.name}</b><small>${u.role}</small></div>`).join('');
    }
    const hero=document.querySelector(".journeyHeroCopy");
    if(hero){
      hero.querySelectorAll(".homeReturnNotice").forEach(x=>x.remove());
      if(state.storyComplete||state.joinedBat||state.fused||state.testComplete||Object.values(state.mastery||{}).some(Boolean)){
        const note=document.createElement("div"); note.className="homeReturnNotice"; note.textContent=`進行記録を更新しました。次は「${n.label}」。`; hero.appendChild(note);
      }
    }


    // v1.6 — HOME keeps visible evidence of the player's journey.
    const homeScreen=$("home");
    const mastered=Object.entries(state.mastery||{}).filter(([,v])=>!!v).map(([id])=>id);
    const legacyUnlocked=Object.entries(state.legacyCores||{}).filter(([,v])=>!!v).map(([id])=>id);
    if(homeScreen){
      homeScreen.classList.toggle("homeHasJoin",!!state.joinedBat);
      homeScreen.classList.toggle("homeHasFusion",!!state.fused);
      homeScreen.classList.toggle("homeHasLegacy",legacyUnlocked.length>0);
      homeScreen.classList.toggle("homeChapterComplete",mastered.length===3);
    }
    const legacyShelf=$("homeLegacyShelf");
    if(legacyShelf){
      const order=["unyielding","quiet_thunder","falling_wind"];
      legacyShelf.innerHTML=order.map(id=>{
        const core=D.legacyCores[id], unlocked=!!state.legacyCores?.[id];
        return `<div class="homeLegacyCore ${unlocked?"unlocked":"locked"}"><span>${unlocked?"✦":"◇"}</span><b>${unlocked?core.name:"未継承"}</b><small>${unlocked?core.source:"残響未取得"}</small></div>`;
      }).join("");
    }
    if($("homeLegacyCount")) $("homeLegacyCount").textContent=`${legacyUnlocked.length} / 3`;
    if($("homeLineageTitle")){
      $("homeLineageTitle").textContent=state.fused?"火トカゲ × 風コウモリ → 炎翼リザル":state.joinedBat?"火トカゲ × 風コウモリ":"未形成";
      $("homeLineageSub").textContent=state.fused
        ? `HERITAGE ${state.fusion?.heritageA||"昂火牙"} ＋ ${state.fusion?.heritageB||"風影"} / Growth Echo ${Math.round((state.fusion?.growthEcho||.6)*100)}%`
        : state.joinedBat?"FUSION LABで親2体からHERITAGEを選ぶ。":"JOINした仲間から、新しい系譜が始まる。";
    }
    if($("homeFieldRecord")){
      $("homeFieldRecord").textContent=`${state.joinedBat?1:0} JOIN / ${state.fused?1:0} FUSION / ${mastered.length} MASTERY`;
      $("homeFieldSub").textContent=mastered.length===3?"CHAPTER 1の3つの残響を記録済み。"
        : legacyUnlocked.length?`最新の継承: ${D.legacyCores[legacyUnlocked[legacyUnlocked.length-1]]?.name||"LEGACY"}`
        : state.fused?"新種の戦い方を記録中。":state.joinedBat?"風コウモリとの共鳴を記録済み。":"まだ最初の出会いの前。";
    }
    if(partyEl){
      partyEl.innerHTML=currentParty().map(u=>{
        const core=MLLegacy.equippedCore(D,state,u.id), eq=equippedFor(u.id);
        return `<div class="homePartyUnit"><img src="${MLAsset(`${u.battle}/idle.png`)}" alt="${u.name}"><b>${u.name}</b><small>${u.role}</small><em>${core?`LEGACY ${core.name}`:eq.name}</em></div>`;
      }).join("");
    }
  }

  function goJourney(id){
    if(id==="boss"){
      const next=MLProgression.next(state);
      const bossId=next.boss || (state.testComplete ? "boar" : state.selectedBoss);
      state.selectedBoss=bossId;
      boss=MLBattle.createBoss(bossId,currentParty());
      MLStorage.save(state);
    }
    go(id);
  }

  function openSheet(title, html){
    $("sheetTitle").textContent = title;
    $("sheetBody").innerHTML = html;
    $("mask").classList.add("show");
    $("sheet").classList.add("show");
  }
  function closeSheet(){
    $("mask").classList.remove("show");
    $("sheet").classList.remove("show");
  }
  $("mask").onclick = closeSheet;
  // v1.8.2 — mobile-safe delegated sheet controls. Inline onclick was unreliable on some Android content:// viewers.
  $("sheetBody").addEventListener("click", (e) => {
    const b=e.target.closest("[data-sheet-action]");
    if(!b) return;
    e.preventDefault();
    e.stopPropagation();
    const action=b.dataset.sheetAction, uid=b.dataset.uid, kind=b.dataset.kind;
    if(action==="pickHunt") pickHunt(uid,kind);
    else if(action==="pickTest") pickTest(uid,kind);
    else if(action==="pickBoss") pickBoss(uid,kind);
  });

  // v1.5 — every major activity now resolves into an explicit result beat.
  let resultPrimaryAction=null;
  function showJourneyResult({eyebrow="JOURNEY COMPLETE",title,body,meta="",art="",primary="CONTINUE",onPrimary=null}){
    const root=$("journeyResult"); if(!root) return;
    $("journeyResultEyebrow").textContent=eyebrow;
    $("journeyResultTitle").textContent=title||"COMPLETE";
    $("journeyResultBody").innerHTML=body||"";
    $("journeyResultMeta").textContent=meta||"";
    $("journeyResultMeta").style.display=meta?"block":"none";
    $("journeyResultArt").innerHTML=art||"";
    $("journeyResultArt").style.display=art?"grid":"none";
    $("journeyResultPrimary").textContent=primary;
    resultPrimaryAction=onPrimary;
    root.classList.add("show"); root.setAttribute("aria-hidden","false");
    haptic([12,20]);
  }
  function closeJourneyResult(){
    const root=$("journeyResult"); if(!root) return;
    root.classList.remove("show"); root.setAttribute("aria-hidden","true"); resultPrimaryAction=null;
  }
  if($("journeyResultPrimary")) $("journeyResultPrimary").onclick=()=>{const fn=resultPrimaryAction;closeJourneyResult();if(fn)fn();};
  if($("journeyResultHome")) $("journeyResultHome").onclick=()=>{closeJourneyResult();go("home");};

  function stanceId(party, queue){
    if(queue.length !== 2) return null;
    const used = new Set(queue.map(q => q.uid));
    return party.find(u => !used.has(u.id))?.id || null;
  }

  function unitHtml(u, ctx){
    const selected = ctx.selected === u.id ? "active" : "";
    const stance = ctx.stance === u.id ? "stance" : "";
    const stateLabel = stance ? "STANCE" : selected ? "COMMAND" : "READY";
    const spriteState = stance ? "stance" : "idle";
    return `<div class="panel unit ${selected} ${stance}">
      <div class="unitTop">${u.battle ? `<img class="unitSprite" src="${MLAsset(`${u.battle}/${spriteState}.png`)}" alt="">` : ""}<b>${u.name}</b><span class="unitStateBadge">${stateLabel}</span></div>
      <div class="small">${u.core} / ${u.role}</div>${helpButton(u.id,"STANCE",ctx.fn==="ML.openHunt"?"hunt":"test")}
      <div class="mini"><i style="width:${100*u.hp/u.maxHp}%"></i></div>
      <div class="small">${u.hp}/${u.maxHp}</div>
      <button class="btn" style="width:100%;padding:7px;margin-top:6px" onclick="${ctx.fn}('${u.id}')">${stance ? "STANCE" : selected ? "SELECTED" : "COMMAND"}</button>
    </div>`;
  }

  function stanceText(uid,context="boss"){
    if(uid==="goura") return context==="boss"?"未選択で発動。このターンの味方への単体ダメージを45%、全体・連続攻撃を30%軽減。ROLEの炉守と重複しません。":"現在のHUNTでは固有の軽減効果は未実装です。";
    if(uid==="leaf") return context==="boss"?"未選択で発動。このターン、自分のHPを6回復。装備したLEGACYで回復量が増える場合があります。":"現在のHUNTでは固有の回復効果は未実装です。";
    if(uid==="flame" && context!=="boss") return "この練習戦では固有STANCE効果は未実装です。BOSSでは次の炎翼牙を強化します。";
    if(uid==="flame") return "未選択で次のCOREを準備。次に使う炎翼牙のダメージ+12%、VOLTAGE上昇+2。重複蓄積しません。";
    return "未選択の1体として待機します。この個体の固有STANCE効果は現行ビルドでは未実装です。";
  }
  function skillHelp(uid,kind,context="boss"){
    const u=D.units[uid];if(!u)return;
    const eq=equippedFor(uid);
    const title=kind==="STANCE"?u.stance:kind==="CORE"?u.core:kind==="ROLE"?u.role:eq.action;
    let detail=kind==="STANCE"?stanceText(uid,context):kind==="CORE"?`敵へ基礎${u.coreDmg}ダメージ / VOL +${u.coreVol}。敵の状態やLEGACYで実際の値は変わります。`:kind==="ROLE"?(u.roleType==="calm"?"敵VOLTAGEを12下げる。現在のNEXTは変わらず、次ターンの予告に影響します。":u.roleType==="guard"?"味方を守る準備。BOSSでは単体45%、全体・連続攻撃30%軽減。HUNTでは未実装です。":"次の単体攻撃を回避する準備。全体攻撃には無効。BOSSでは火トカゲ・炎翼リザルが対象のときに有効です。"):
      eq.type==="damage"?`${eq.desc} 基礎${eq.dmg}ダメージ / VOL +${eq.vol}。`:eq.desc;
    openSheet(`${u.name} / ${kind}「${title}」`,`<div class="skillExplanation"><p>${detail}</p><p>${kind==="STANCE"?"COMMANDを2体分選ぶと、残った1体に自動で割り当てられます。STANCE自体をCOMMANDとして選ぶ必要はありません。":"この説明を開いてもCOMMANDは選択されません。閉じてから使う技をタップしてください。"}</p><button class="btn primary" onclick="ML.closeSkillHelp()">説明を閉じる</button></div>`);
  }
  function helpButton(uid,kind,context){return `<button type="button" class="skillInfo" data-help-unit="${uid}" data-help-kind="${kind}" data-help-context="${context}" aria-label="${D.units[uid].name} ${kind}の説明">ⓘ ${kind==="STANCE"?"STANCEの効果":"効果"}</button>`;}

  function bossUnitHtml(u, stanceUid){
    const queued = boss.queue.find(q=>q.uid===u.id);
    const selected = !!queued;
    const stance = stanceUid === u.id;
    const stateLabel = stance ? "STANCE" : selected ? "COMMAND" : "READY";
    const spriteState = stance ? "stance" : "idle";
    const eq = equippedFor(u.id);
    const hpPct = Math.max(0,Math.round(100*u.hp/u.maxHp));
    const disabled = stance || u.hp<=0 || boss.won || resolvingBossTurn;
    const tile=(kind,glyph,name)=>`<div class="skillWithHelp"><button data-help-unit="${u.id}" data-help-kind="${kind}" data-help-context="boss" class="commandTile ${queued?.kind===kind?"on":""}" ${disabled?"disabled":""} onclick="ML.pickBoss('${u.id}','${kind}')" aria-label="${u.name} ${name}"><span>${glyph}</span><b>${name}</b></button>${helpButton(u.id,kind,"boss")}</div>`;
    return `<div class="panel unit formalUnit ${selected?"active":""} ${stance?"stance":""} ${u.hp<=0?"ko":""}">
      <div class="unitTop">${u.battle ? `<img class="unitSprite" src="${MLAsset(`${u.battle}/${spriteState}.png`)}" alt="">` : ""}<div class="unitIdentity"><b>${u.name}</b><span class="unitStateBadge">${stateLabel}</span></div></div>
      ${helpButton(u.id,"STANCE","boss")}
      <div class="formalHp"><span>HP</span><div class="mini"><i style="width:${hpPct}%"></i></div><small>${u.hp}/${u.maxHp}</small></div>
      ${MLLegacy.equippedCore(D,state,u.id)?`<div class="equipmentTag legacyTag">LEGACY ${MLLegacy.equippedCore(D,state,u.id).name}</div>`:""}
      ${stance ? `<div class="stanceLock"><span>STANCE</span><b>${u.stance}</b><small>${stanceText(u.id)}</small></div>` : `<div class="commandTiles">${tile("CORE","◆",u.core)}${tile("ROLE","◇",u.role)}${tile("EQUIPMENT","✦",eq.name)}</div>`}
    </div>`;
  }

  // ---------- LEGACY ARCHIVE / CODEX ----------
  let archiveMode="legacy";
  function unitSprite(uid){ const u=D.units[uid]; return MLAsset(`${u.battle}/idle.png`); }
  function legacyStatus(uid,coreId){ return state.legacyEquipped?.[uid]===coreId; }
  function setLegacy(uid,coreId){
    if(!MLLegacy.equip(D,state,uid,coreId)) return;
    save();
    toast(coreId ? `${D.units[uid].name} ← ${D.legacyCores[coreId].name}` : `${D.units[uid].name} の継承解除`);
    if(boss && boss.party.some(u=>u.id===uid)) renderBoss();
  }
  function renderArchive(){
    const legacy=$('archiveLegacy'), codex=$('archiveCodex');
    if(!legacy||!codex) return;
    document.querySelectorAll('[data-archive-tab]').forEach(b=>b.classList.toggle('on',b.dataset.archiveTab===archiveMode));
    legacy.hidden=archiveMode!=="legacy"; codex.hidden=archiveMode!=="codex";
    const partyIds=currentParty().map(u=>u.id);
    legacy.innerHTML=`<div class="legacyGrid">${Object.values(D.legacyCores).map(c=>{
      const owned=!!state.legacyCores?.[c.id];
      return `<div class="legacyCard ${owned?'':'locked'}"><div class="legacyCardHead"><div><div class="legacySource">${c.source} / MASTERY REMNANT</div><div class="legacyCoreName">${owned?c.name:'？？？'}</div></div><span class="${owned?'coreEquipped':''}">${owned?'ACQUIRED':'LOCKED'}</span></div><div class="legacyTheme">${owned?c.theme:'Boss MASTERYを達成すると、戦い方の残響を継承できる。'}</div>${partyIds.map(uid=>{const u=D.units[uid],on=legacyStatus(uid,c.id);return `<div class="legacyUnitRow"><img src="${unitSprite(uid)}" alt=""><div><b>${u.name}</b><small>${owned?c.effects[uid]||'この個体用の翻訳効果':'未解析'}</small></div><button class="btn ${on?'primary':''}" ${owned?'':'disabled'} onclick="ML.setLegacy('${uid}',${on?'null':`'${c.id}'`})">${on?'EQUIPPED':'継ぐ'}</button></div>`}).join('')}</div>`;
    }).join('')}</div>`;
    const codexEntries=[
      ['goura','ゴウラ','炉甲系 / RECEIVE'],['fire','火トカゲ','焔牙系 / RAISE'],['leaf','葉ウサギ','森芽系 / CONTROL'],['wind','風コウモリ','風翼系 / EVADE'],['flame','炎翼リザル','T3 SPECIAL / FUSION'],['boar','荊棘の大猪','古種系 / RAISE・RECEIVE'],['owl','雷フクロウ','古種系 / SUPPRESS'],['manticore','裂空マンティコア','古種系 / READ・DODGE・CRASH']
    ];
    const imgFor=id=> id==='wind'?MLAsset('assets/battle/wind_bat/idle.png'):id==='boar'?MLAsset(D.bosses.boar.art):id==='owl'?MLAsset(D.bosses.owl.art):id==='manticore'?MLAsset(D.bosses.manticore.art):MLAsset(`${D.units[id].battle}/idle.png`);
    const seen=id=> id==='wind'?state.joinedBat:id==='flame'?state.fused:(['boar','owl','manticore'].includes(id)?(state.clears[id]||state.mastery[id]):true);
    codex.innerHTML=`<div class="codexGrid">${codexEntries.map(([id,name,meta])=>`<div class="codexCard"><span class="codexTag">${seen(id)?'REGISTERED':'ENCOUNTER DATA'}</span><img src="${imgFor(id)}" alt=""><b>${name}</b><small>${meta}</small></div>`).join('')}</div>`;
  }
  function archiveTab(mode){ archiveMode=mode; renderArchive(); }

  // ---------- STORY / CHAPTER 1 ----------
  function completeStoryStep(step){
    if(state.storyStep === step){
      if(window.MLPlaytest) MLPlaytest.event("story_step_complete",{step,lesson:D.story.chapter1.lessons[step]?.title||""});
      state.storyStep = Math.min(6, step+1);
      if(state.storyStep >= 6) state.storyComplete = true;
      save();
      haptic(18);
      renderStory();
    }
  }

  function storyLesson(index,title,body){
    const done = index < state.storyStep || state.storyComplete;
    return `<div class="storyMission ${done?"done":"active"}">
      <div class="storyMissionHead"><span>${String(index+1).padStart(2,"0")}</span><div><div class="eyebrow">PLAYABLE BEAT</div><b>${title.replace(/^\d+\s*/,"")}</b></div><em>${done?"COMPLETE":"ACTIVE"}</em></div>
      ${body}
    </div>`;
  }

  function renderStory(){
    const lessons=D.story.chapter1.lessons;
    const step=Math.min(state.storyComplete?5:state.storyStep,5);
    $("storyProgress").innerHTML=lessons.map((_,i)=>`<span class="storyDot ${(i<state.storyStep||state.storyComplete)?"done":""} ${i===step&&!state.storyComplete?"active":""}"></span>`).join("");
    const beats=[
      "朽ちた森に、獣の足音が残っている。先に読む。動くのはそのあとだ。",
      "三体すべては動かせない。誰を動かすか、その選択自体が戦術になる。",
      "選ばなかった一体も戦っている。残る一体はSTANCEとして場を支える。",
      "力を上げるほど敵も危険になる。VOLTAGEは資源であり、脅威でもある。",
      "装備は数値ではない。次の戦いへ持ち込む、もう一つのCOMMANDだ。",
      "荊棘の大猪。今はまだ受け切れない。生きて戻り、戦い方を探せ。"
    ];
    if($("storyBeat")) $("storyBeat").innerHTML=`<span>MISSION ${String(step+1).padStart(2,"0")}</span><strong>${beats[step]}</strong>`;

    const nextBody = `<div class="storyBattleDemo">
      <div class="storyEnemy"><img src="assets/battle/boar/idle.png" alt="荊棘の大猪"><span>TRAINING TARGET</span></div>
      <div class="storyNextPanel"><div class="eyebrow">NEXT ACTION — TURN LOCK</div><b>裂牙 → ゴウラ</b><small>この予告はCOMMAND選択中も変わらない。</small></div>
      <button class="btn primary storyPrimary" onclick="ML.storyNext()">予告を読んで行動を決める</button>
    </div>`;
    const cmdBody = `<div class="storyBattleDemo"><div class="storyRule"><b>2 / 3</b><span>毎ターン動かせるのは2体</span></div><div class="storyPartyChoices three">
      <button onclick="ML.storyCmd(this)" data-unit="goura"><img src="assets/battle/goura/idle.png" alt=""><b>ゴウラ</b><span>GUARD</span></button>
      <button onclick="ML.storyCmd(this)" data-unit="fire"><img src="assets/battle/fire/idle.png" alt=""><b>火トカゲ</b><span>ATTACK</span></button>
      <button onclick="ML.storyCmd(this)" data-unit="leaf"><img src="assets/battle/leaf/idle.png" alt=""><b>葉ウサギ</b><span>CONTROL</span></button>
    </div><div id="storyCmdMsg" class="storyDecision">0 / 2 COMMAND — 2体を選択</div></div>`;
    const stanceBody = `<div class="storyBattleDemo"><div class="storyRule"><b>1 STANCE</b><span>未選択の1体が自動で場を支える</span></div><div class="storyPartyChoices two">
      <button onclick="ML.storyStance('goura')"><img src="assets/battle/goura/stance.png" alt=""><b>ゴウラを残す</b><span>炉守 / RECEIVE</span></button>
      <button onclick="ML.storyStance('leaf')"><img src="assets/battle/leaf/stance.png" alt=""><b>葉ウサギを残す</b><span>芽息 / RECOVER</span></button>
    </div><div id="storyStanceMsg" class="storyDecision">残す1体で、ターンの意味が変わる。</div></div>`;
    const volBody = `<div class="storyBattleDemo"><div class="storyVoltage"><div><span>VOLTAGE</span><strong id="storyVolNumber">48</strong><em id="storyVolBand">HEAT</em></div><div class="volTutor formal"><i id="storyVolBar" style="width:48%"></i></div></div><div id="storyVolText" class="storyDecision">VOL 48 / HEAT。雷フクロウならRAGEへ入れない判断が必要。</div><div class="storyChoiceRow"><button onclick="ML.storyVol('attack')">火牙 <small>VOL +8</small></button><button onclick="ML.storyVol('calm')">鎮めの風 <small>VOL -12</small></button></div></div>`;
    const eqBody = `<div class="storyBattleDemo"><div class="storyRule"><b>EQUIPMENT</b><span>能力値ではなく“技”を持ち込む</span></div><div class="storyEquipChoice"><button onclick="ML.storyEquip('spear')"><span class="eqSigil">✦</span><b>追撃の槍</b><small>40 DMG / VOL +8</small></button><button onclick="ML.storyEquip('bell')"><span class="eqSigil">◉</span><b>鎮静の鈴</b><small>VOL -14 / 小回復</small></button></div><div id="storyEquipMsg" class="storyDecision">想定敵：雷フクロウ。RAGEを避けるなら、どちらを持ち込む？</div></div>`;
    const bossBody = `<div class="storyBossReveal"><img src="assets/battle/boar/danger.png" alt="荊棘の大猪"><div class="storyBossCopy"><div class="eyebrow">FIRST ENCOUNTER / RETREAT</div><h3>荊棘の大猪</h3><p>判断は間違っていない。それでも、今の力では受け切れない。<br>倒される前に自分で撤退し、HOMEで次の手掛かりを探そう。</p><button class="btn primary storyPrimary" onclick="ML.storyBoss()">撤退する</button></div></div>`;
    const bodies=[nextBody,cmdBody,stanceBody,volBody,eqBody,bossBody];
    $("storyLessons").innerHTML=storyLesson(step,lessons[step].title,bodies[step]);
  }

  let storyCmdSet=new Set();
  let storyVolValue=48;
  async function storyNext(){
    if(!await chapterEvent("PROLOGUE_COMPLETE")) return;
    completeStoryStep(0);
  }
  function storyCmd(btn){
    if(state.storyStep!==1) return;
    btn.classList.toggle("selected");
    const key=btn.textContent;
    if(storyCmdSet.has(key)) storyCmdSet.delete(key); else storyCmdSet.add(key);
    if(storyCmdSet.size>2){ storyCmdSet.delete(key); btn.classList.remove("selected"); }
    const msg=$("storyCmdMsg");
    if(msg) msg.textContent=`${storyCmdSet.size} / 2 COMMAND`;
    if(storyCmdSet.size===2){ if(window.MLPlaytest) MLPlaytest.event("two_commands_locked",{context:"chapter1"}); setTimeout(()=>{storyCmdSet.clear();completeStoryStep(1)},250); }
  }
  function storyStance(id){
    if(state.storyStep!==2) return;
    if(window.MLPlaytest) MLPlaytest.event("stance_understood",{unit:id,context:"chapter1"});
    const msg=$("storyStanceMsg");
    if(msg) msg.textContent=id==="goura" ? "ゴウラ STANCE「炉守」— 受ける準備。" : "葉ウサギ STANCE「芽息」— 小回復。";
    setTimeout(()=>completeStoryStep(2),450);
  }
  function storyVol(type){
    if(state.storyStep!==3) return;
    if(window.MLPlaytest) MLPlaytest.event("voltage_choice",{choice:type,context:"chapter1",before:storyVolValue});
    if(type==="attack") storyVolValue=Math.min(100,storyVolValue+8);
    else storyVolValue=Math.max(0,storyVolValue-12);
    const b=MLBattle.band(storyVolValue);
    if($("storyVolBar")) $("storyVolBar").style.width=storyVolValue+"%";
    if($("storyVolNumber")) $("storyVolNumber").textContent=storyVolValue;
    if($("storyVolBand")) $("storyVolBand").textContent=b;
    if($("storyVolText")) $("storyVolText").textContent=`VOL ${storyVolValue} / ${b}。${storyVolValue>=60?"RAGEに入った。抑える必要がある。":"RAGE未満を維持中。"}`;
    if(type==="calm" && storyVolValue<48) setTimeout(()=>completeStoryStep(3),350);
  }
  function storyEquip(kind){
    if(state.storyStep!==4) return;
    if(window.MLPlaytest) MLPlaytest.event("equipment_choice",{equipment:kind,context:"chapter1"});
    const msg=$("storyEquipMsg");
    if(kind==="bell"){
      if(msg) msg.textContent="正解：鎮静の鈴。SUPPRESS戦では火力より帯域管理が価値になる。";
      setTimeout(async()=>{
        if(await chapterEvent("FIRST_BATTLE_COMPLETE")) completeStoryStep(4);
      },500);
    }else{
      if(msg) msg.textContent="追撃の槍は強いがVOL+8。雷フクロウではRAGE突入を早める。";
    }
  }
  async function storyBoss(){
    if(state.storyStep===5){
      if(!await chapterEvent("BOAR_RETREAT")) return;
      completeStoryStep(5);
      state.selectedBoss="boar";
      MLStorage.save(state);
      showJourneyResult({
        eyebrow:"FIRST ENCOUNTER / RETREAT SUCCESS",title:"まだ、分からなかっただけ。",
        body:"荊棘の大猪から距離を取り、3体とも無事に戻った。<br>HOMEで風裂谷の反応を確認し、戦い方を増やそう。",
        meta:"NEXT  HOME → HUNT → 風コウモリ JOIN",
        art:`<img src="${MLAsset('assets/battle/boar/idle.png')}" alt="荊棘の大猪">`,
        primary:"HOMEへ戻る",onPrimary:async()=>{
          if(!await chapterEvent("HOME_FIRST_ARRIVAL")) return;
          go("home");
        }
      });
    }else if(state.storyComplete){
      state.selectedBoss="boar"; MLStorage.save(state); selectBoss("boar"); go("boss");
    }
  }

  function renderMiniFieldParty(holderId,party,queue,stanceUid,prefix){
    const holder=$(holderId); if(!holder) return;
    const selected=new Set(queue.map(q=>q.uid));
    holder.innerHTML=party.map(u=>{
      const isStance=stanceUid===u.id, isCommand=selected.has(u.id);
      const stateName=isStance?'stance':'idle';
      return `<div id="${prefix}-${u.id}" class="fieldAlly ${isStance?'stance':''} ${isCommand?'command':''} ${u.hp<=0?'ko':''}">${u.battle?`<img id="${prefix}Img-${u.id}" src="${MLAsset(`${u.battle}/${stateName}.png`)}" alt="${u.name}">`:''}<span class="fieldState">${isStance?'STANCE':isCommand?'COMMAND':'READY'}</span></div>`;
    }).join('');
  }

  function animateMiniFieldCommands(prefix,party,queue){
    if(!window.MLMotion) return;
    queue.forEach((q,i)=>{
      const u=party.find(x=>x.id===q.uid), el=$(`${prefix}-${q.uid}`), img=$(`${prefix}Img-${q.uid}`);
      if(u&&el&&img&&u.battle) MLMotion.animateAlly({el,img,battle:u.battle,kind:q.kind,delay:i*115});
    });
  }

  function impactMiniField(prefix,party,ids){
    if(!window.MLMotion) return;
    ids.forEach((id,i)=>{
      const u=party.find(x=>x.id===id),el=$(`${prefix}-${id}`),img=$(`${prefix}Img-${id}`);
      if(u&&el&&img&&u.battle) MLMotion.impactAlly({el,img,battle:u.battle,down:u.hp<=0,delay:i*45});
    });
  }

  // ---------- HUNT ----------
  function freshHunt(){
    return {
      hp:120, maxHp:120, vol:18, queue:[],
      party:[cloneUnit("goura"), cloneUnit("fire"), cloneUnit("leaf")],
      evadeReady:false, evaded:false, ready:false
    };
  }

  function renderHunt(){
    if(!hunt) hunt = freshHunt();
    $("huntHpText").textContent = `${hunt.hp} / ${hunt.maxHp}`;
    $("huntHp").style.width = `${100*hunt.hp/hunt.maxHp}%`;
    $("huntVolText").textContent = hunt.vol;
    $("huntVol").style.width = hunt.vol + "%";
    const huntBand = MLBattle.band(hunt.vol);
    if($("huntStickyHpText")) $("huntStickyHpText").textContent = `HP ${hunt.hp} / ${hunt.maxHp}`;
    if($("huntStickyVolText")) $("huntStickyVolText").textContent = `VOL ${hunt.vol}`;
    if($("huntStickyHp")) $("huntStickyHp").style.width = `${100*hunt.hp/hunt.maxHp}%`;
    if($("huntStickyVol")) $("huntStickyVol").style.width = `${Math.max(2,hunt.vol)}%`;
    if($("huntBandBadge")){ $("huntBandBadge").textContent = huntBand; $("huntBandBadge").className = `bandBadge ${huntBand.toLowerCase()}`; }

    const st = stanceId(hunt.party, hunt.queue);
    $("huntParty").innerHTML = hunt.party.map(u => unitHtml(u,{
      selected:hunt.queue.find(q => q.uid === u.id)?.uid,
      stance:st, fn:"ML.openHunt"
    })).join("");
    renderMiniFieldParty("huntFieldParty",hunt.party,hunt.queue,st,"huntField");
    if(window.MLMotion){ MLMotion.setBand("huntStage",MLBattle.band(hunt.vol)); MLMotion.ensureAtmosphere("huntStage"); if(!resolvingHuntTurn) MLMotion.telegraph({stageId:"huntStage",imgId:"huntEnemySprite",dir:"assets/battle/wind_bat",bossId:"wind",action:{type:"single"},band:MLBattle.band(hunt.vol)}); }

    $("huntQueue").innerHTML = hunt.queue.length
      ? hunt.queue.map((q,i)=>`<div class="ql"><span>${i+1}. ${q.name}</span><span>${q.kind}</span><button class="removeCmd" onclick="ML.removeHunt(${i})">取消</button></div>`).join("")
      : "2つのCOMMANDを選択";
    $("huntCommandCount").innerHTML = `<span>COMMAND</span><strong>${hunt.queue.length} / 2</strong>`;
    $("huntStancePreview").innerHTML = st
      ? `<strong>${hunt.party.find(x=>x.id===st)?.name || ""} → STANCE</strong> ${hunt.party.find(x=>x.id===st)?.stance || ""}`
      : "2人を選ぶと、残り1体のSTANCEが発動。";
    $("huntExec").disabled = hunt.queue.length !== 2 || resolvingHuntTurn;
    $("huntExec").classList.toggle("executeReady",hunt.queue.length===2&&!resolvingHuntTurn);
    $("joinBtn").style.display = hunt.ready ? "inline-flex" : "none";
    $("huntCond").textContent = hunt.ready
      ? "RESONANCE READY — 1 COMMANDで確定JOIN"
      : hunt.evaded
        ? "回避成功済み。HP35%以下・RAGE未満まで追い込む。"
        : "単体攻撃の回避成功が必要。";
    MLAudio.setVoltage(hunt.vol);
  }

  function openHunt(uid){
    const existing = hunt.queue.findIndex(q=>q.uid===uid);
    if(existing>=0){ removeHunt(existing); return; }
    if(hunt.queue.length>=2) return;
    const u = hunt.party.find(x=>x.id===uid);
    const eq=equippedFor(uid);
    openSheet(u.name,
      `<button class="skill" data-sheet-action="pickHunt" data-uid="${uid}" data-kind="CORE"><b>CORE ${u.core}</b><div class="small">${u.coreDmg} Damage / VOL+${u.coreVol}</div></button>
       <button class="skill" data-sheet-action="pickHunt" data-uid="${uid}" data-kind="ROLE"><b>ROLE ${u.role}</b><div class="small">${roleText(u.roleType)}</div></button>
       <button class="skill" data-sheet-action="pickHunt" data-uid="${uid}" data-kind="EQUIPMENT"><b>EQUIPMENT ${eq.name}</b><div class="small">${eq.desc}</div></button>`);
  }

  function roleText(type){
    return {
      guard:"被ダメージを抑える",
      evade:"次の単体攻撃を回避",
      evadePlus:"次の単体攻撃を回避 / 成功でVOL-6",
      calm:"敵VOLTAGE -12"
    }[type] || type;
  }

  function removeHunt(index){
    hunt.queue.splice(index,1);
    haptic(8);
    renderHunt();
  }

  function pickHunt(uid, kind){
    const u = hunt.party.find(x=>x.id===uid);
    if(!u || hunt.queue.length>=2 || hunt.queue.some(q=>q.uid===uid)) return;
    hunt.queue.push({uid,kind,name:u.name});
    MLAudio.event(hunt.queue.length===2 ? "stance" : "select");
    if(hunt.queue.length===2) setTimeout(()=>MLAudio.event("command"),70);
    closeSheet();
    renderHunt();
  }

  $("huntExec").onclick = () => {
    if(resolvingHuntTurn || hunt.queue.length!==2) return;
    MLAudio.event("execute");
    const log = [];
    const queueSnapshot=hunt.queue.map(q=>({...q}));
    const stanceSnapshot=stanceId(hunt.party,hunt.queue);
    resolvingHuntTurn=true;
    renderHunt();
    haptic(16);
    animateMiniFieldCommands("huntField",hunt.party,queueSnapshot);
    if(window.MLMotion){ MLMotion.telegraph({stageId:"huntStage",imgId:"huntEnemySprite",dir:"assets/battle/wind_bat",bossId:"wind",action:{type:"single"},band:MLBattle.band(hunt.vol)}); }

    for(const q of hunt.queue){
      const u = hunt.party.find(x=>x.id===q.uid);
      if(q.kind === "CORE"){
        hunt.hp = Math.max(0, hunt.hp-u.coreDmg);
        hunt.vol = Math.min(100, hunt.vol+u.coreVol);
        log.push(`${u.name} ${u.core}: ${u.coreDmg} / VOL+${u.coreVol}`);
      }else if(q.kind==="EQUIPMENT"){
        const eq=equippedFor(u.id);
        MLAudio.event("equipment");
        if(eq.type==="damage"){ hunt.hp=Math.max(0,hunt.hp-eq.dmg); hunt.vol=Math.min(100,hunt.vol+eq.vol); log.push(`${u.name} ${eq.action}: ${eq.dmg} / VOL+${eq.vol}`); }
        else if(eq.type==="calm"){ hunt.vol=Math.max(0,hunt.vol-eq.volDown); u.hp=Math.min(u.maxHp,u.hp+eq.heal); log.push(`${u.name} ${eq.action}: VOL-${eq.volDown} / HEAL ${eq.heal}`); }
        else if(eq.type==="evade"){ hunt.evadeReady=true; log.push(`${u.name} ${eq.action}: 回避準備`); }
        else { log.push(`${u.name} ${eq.action}`); }
      }else if(u.roleType === "evade"){
        hunt.evadeReady = true; log.push(`${u.name} ${u.role}: 回避準備`);
      }else if(u.roleType === "calm"){
        hunt.vol = Math.max(0,hunt.vol-12); log.push(`${u.name} ${u.role}: VOL-12`);
      }else{
        log.push(`${u.name} ${u.role}`);
      }
    }

    setTimeout(()=>{
      if(window.MLMotion){ MLMotion.burst("huntStage","hit",50,42); MLMotion.hitStop("huntStage",70); MLMotion.camera("huntStage","light"); }
      addFx("huntStage",queueSnapshot.map(q=>hunt.party.find(u=>u.id===q.uid)?.coreDmg||'').filter(Boolean).join(' + ') || 'HIT');
      flashStage("huntStage","hit"); MLAudio.event("hit");
    },300);

    setTimeout(()=>{
      setSpriteState("huntStage","huntEnemySprite","assets/battle/wind_bat","attack");
      if(window.MLMotion){ MLMotion.enemyStrike("huntStage","single"); MLMotion.camera("huntStage","medium"); }
      if(hunt.evadeReady){
        hunt.evaded = true;
        hunt.evadeReady = false;
        log.push("裂風急降下 → 回避成功！");
        if(window.MLMotion) MLMotion.burst("huntStage","crash",50,64);
        haptic([18,24]);
      }else{
        const fire = hunt.party.find(x=>x.id==="fire");
        fire.hp = Math.max(1,fire.hp-18);
        log.push("裂風急降下 → 火トカゲ 18");
        impactMiniField("huntField",hunt.party,["fire"]);
      }
    },650);

    const lethal = hunt.hp <= 0;
    const resonanceQualified = hunt.evaded && hunt.vol < 60;
    if(lethal && resonanceQualified){
      // HUNT is recognition, not a kill check: a qualified target holds at 1 HP and opens RESONATE.
      hunt.hp = 1;
      hunt.ready = true;
      log.push("RESONANCE LIMIT — 風コウモリは戦闘を止め、応答を待っている。");
    }else{
      hunt.ready = hunt.evaded && hunt.hp <= 42 && hunt.vol < 60 && hunt.hp > 0;
    }
    setTimeout(()=>{
      if(hunt.ready) toast("RESONANCE READY");
      hunt.queue = [];
      $("huntLog").innerHTML = log.concat($("huntLog").innerHTML ? [$("huntLog").innerHTML] : []).join("<br>");
      resolvingHuntTurn=false;
      renderHunt();
      if(lethal && !resonanceQualified){
        const why = !hunt.evaded ? "回避条件を満たす前に追い込みすぎた。" : `VOLTAGE ${hunt.vol} — RAGE未満まで鎮める必要がある。`;
        setTimeout(()=>showJourneyResult({
          eyebrow:"FIELD RESONANCE / LOST", title:"共鳴が切れた",
          body:`風コウモリは戦線を離脱した。<br>${why}<br><br>HUNTでは倒すことではなく、条件を満たしてRESONATEする。`,
          meta:`TARGET HP 0\nRESONANCE  FAILED\nNEXT  RETRY HUNT`,
          art:`<img src="${MLAsset('assets/battle/wind_bat/idle.png')}" alt="風コウモリ">`,
          primary:"HUNTをやり直す", onPrimary:()=>{hunt=freshHunt(); renderHunt(); go("hunt");}
        }),180);
      }
    },1120);
  };

  $("joinBtn").onclick = async () => {
    if(!hunt?.ready) return;
    const jb=$("joinBtn"); if(jb) jb.disabled=true;
    if(!await chapterEvent("WIND_BAT_JOIN")){
      if(jb) jb.disabled=false;
      return;
    }
    save();
    MLAudio.event("join"); toast("JOIN COMPLETE — 風コウモリ");
    if(window.MLMotion) MLMotion.joinCinematic("huntStage");
    if(jb) jb.textContent="RESONANCE CONNECTED";
    setTimeout(showJoinResult,900);
  };

  // ---------- PARTY / FUSION ----------
  function equippedFor(uid){
    const fallback = uid === "leaf" ? "calm_bell" : uid === "goura" ? "taunt_shield" : "pursuit_spear";
    const id = state.equipment?.[uid] || fallback;
    return D.equipment[id] || D.equipment[fallback] || Object.values(D.equipment)[0];
  }

  function setEquipment(uid,equipmentId){
    if(!D.units[uid] || !D.equipment[equipmentId]) return;
    state.equipment = {...(state.equipment || {}), [uid]:equipmentId};
    save();
    renderOwned(); renderLoadout(); renderHome();
    if(boss && boss.party.some(u=>u.id===uid)) renderBoss();
    toast(`${D.units[uid].name} → ${D.equipment[equipmentId].name}`);
  }

  function setPartyLegacy(uid,coreId){
    if(!D.units[uid]) return;
    const next=coreId || null;
    if(next && !state.legacyCores?.[next]) return;
    if(!MLLegacy.equip(D,state,uid,next)) return;
    save();
    renderOwned(); renderLoadout(); renderHome(); renderArchive();
    if(boss && boss.party.some(u=>u.id===uid)) renderBoss();
    toast(next ? `${D.units[uid].name} ← LEGACY ${D.legacyCores[next].name}` : `${D.units[uid].name} のLEGACYを解除`);
  }

  let partyFocus=0;
  function setPartyFocus(index){ partyFocus=Math.max(0,Math.min(2,Number(index)||0)); renderOwned(); renderLoadout(); }
  function assignParty(uid){
    const avail=availablePartyIds(); if(!avail.includes(uid)) return;
    const ids=normalizeParty().slice();
    const existing=ids.indexOf(uid);
    if(existing>=0){ partyFocus=existing; renderOwned(); return; }
    ids[partyFocus]=uid;
    if(new Set(ids).size<3) return;
    state.party=ids; save();
    toast(`${D.units[uid].name}をSLOT ${partyFocus+1}へ編成`);
  }

  async function confirmParty(){
    const ids=normalizeParty();
    if(ids.length!==3 || !ids.includes("wind")){
      toast("風コウモリを含む3体を編成してください。");
      return;
    }
    const phase=await chapterPhase().catch(()=>null);
    if(phase==="P09_PARTY_REBUILD" && !await chapterEvent("PARTY_REBUILD_COMPLETE")) return;
    go("fusion");
  }

  function formationSummary(){
    const ids=normalizeParty(), units=ids.map(id=>D.units[id]);
    const tags=units.map(u=>u.roleType);
    const guard=tags.some(x=>x==='guard'), calm=tags.some(x=>x==='calm'), evade=tags.some(x=>String(x).startsWith('evade'));
    return `${guard?'RECEIVE ✓':'RECEIVE —'} / ${calm?'CONTROL ✓':'CONTROL —'} / ${evade?'EVADE ✓':'EVADE —'}`;
  }

  function renderLoadout(){
    const holder=$("loadoutList"), focus=$("loadoutFocus");
    if(!holder) return;
    const ids=normalizeParty(), uid=ids[partyFocus] || ids[0], unit=D.units[uid];
    const selected=equippedFor(uid), core=MLLegacy.equippedCore(D,state,uid);
    if($("loadoutFocusTitle")) $("loadoutFocusTitle").textContent=`SLOT ${partyFocus+1} — ${unit.name}`;
    if(focus){
      const eqButtons=Object.values(D.equipment).map(eq=>`<button class="loadoutChoice ${eq.id===selected.id?'on':''}" onclick="ML.setEquipment('${uid}','${eq.id}')"><span>${eq.category}</span><b>${eq.name}</b><small>${eq.action} / ${eq.desc}</small></button>`).join('');
      const ownedCores=Object.values(D.legacyCores).filter(c=>state.legacyCores?.[c.id]);
      const legacyButtons=[`<button class="legacyChoice ${!core?'on':''}" onclick="ML.setPartyLegacy('${uid}',null)"><b>NO LEGACY</b><small>装備しない</small></button>`,...ownedCores.map(c=>`<button class="legacyChoice ${core?.id===c.id?'on':''}" onclick="ML.setPartyLegacy('${uid}','${c.id}')"><b>${c.name}</b><small>${c.effects[uid]||'この個体には未解析'}</small></button>`)].join('');
      focus.innerHTML=`<div class="loadoutUnitHead"><img src="${MLAsset(`${unit.battle}/idle.png`)}" alt="${unit.name}"><div><div class="eyebrow">${unit.role} / STANCE ${unit.stance}</div><b>${unit.name}</b><small>CORE ${unit.core} + ROLE ${unit.role} + EQUIPMENT ${selected.action}</small></div></div><div class="loadoutSectionLabel">EQUIPMENT — 3rd COMMAND</div><div class="loadoutChoiceGrid">${eqButtons}</div><div class="loadoutSectionLabel">LEGACY — inherited battle logic</div><div class="legacyChoiceGrid">${legacyButtons}</div><div class="loadoutEffectPreview"><span>ACTIVE LOADOUT</span><b>${selected.name}${core?` + LEGACY「${core.name}」`:''}</b><small>${core?(core.effects[uid]||core.theme):'LEGACY未装備。EQUIPMENTのCOMMANDだけを持ち込む。'}</small></div>`;
    }
    holder.innerHTML=ids.map((id,i)=>{
      const u=D.units[id], eq=equippedFor(id), c=MLLegacy.equippedCore(D,state,id);
      return `<button class="loadoutMatrixRow ${i===partyFocus?'focus':''}" onclick="ML.setPartyFocus(${i})"><span>SLOT ${i+1}</span><img src="${MLAsset(`${u.battle}/idle.png`)}" alt="${u.name}"><div><b>${u.name}</b><small>${eq.category} ${eq.name}</small></div><em>${c?`LEGACY ${c.name}`:'NO LEGACY'}</em></button>`;
    }).join('');
  }

  function renderOwned(){
    const holder=$("ownedList"); if(!holder) return;
    const partyIds=normalizeParty();
    const slots=$("formationSlots");
    if(slots){
      slots.innerHTML=partyIds.map((uid,i)=>{const u=D.units[uid],eq=equippedFor(uid),core=MLLegacy.equippedCore(D,state,uid);return `<button class="formationSlot ${partyFocus===i?'focus':''}" onclick="ML.setPartyFocus(${i})"><span>SLOT ${i+1}</span><img src="${MLAsset(`${u.battle}/idle.png`)}" alt="${u.name}"><b>${u.name}</b><small>${u.role} / ${core?`LEGACY ${core.name}`:eq.name}</small></button>`}).join('');
    }
    if($("formationSummary")) $("formationSummary").textContent=formationSummary();
    holder.innerHTML=availablePartyIds().map(uid=>{
      const u=D.units[uid], active=partyIds.includes(uid), slot=partyIds.indexOf(uid);
      return `<div class="rosterCard ${active?'active':''}"><img src="${MLAsset(`${u.battle}/idle.png`)}" alt="${u.name}"><div><b>${u.name}</b><small>${u.role} / STANCE ${u.stance}</small></div><button class="btn ${active?'primary':''}" onclick="ML.assignParty('${uid}')">${active?`SLOT ${slot+1}`:`SLOT ${partyFocus+1}へ`}</button></div>`;
    }).join('');
  }


  document.querySelectorAll(".trait").forEach(b => b.onclick = () => {
    const s = b.dataset.side;
    document.querySelectorAll(`.trait[data-side="${s}"]`).forEach(x=>x.classList.remove("on"));
    b.classList.add("on");
    traits[s] = b.dataset.trait;
    state.fusion = {...(state.fusion||{}), heritageA:traits.a, heritageB:traits.b};
    MLStorage.save(state);
    $("heritageText").textContent = `${traits.a} ＋ ${traits.b}`;
  });

  function lockFuse(){
    const b = $("fuseBtn");
    if(!state.joinedBat){ b.disabled=true; b.textContent="風コウモリのJOINが必要"; return; }
    if(!state.fused){ b.disabled=false; b.textContent="この2体を継ぐ"; return; }
    if(!state.testComplete){ b.disabled=false; b.textContent="NEW SPECIES TESTへ"; return; }
    b.disabled=true; b.textContent="TEST COMPLETE";
  }

  $("fuseBtn").onclick = async () => {
    if(!state.joinedBat) return;
    if(state.fused){ go("test"); return; }
    const preview=MLFusion.preview(traits.a,traits.b);
    if(!confirm(`火トカゲ「ヒノ」と風コウモリ「フィル」は戻りません。\nHERITAGE: ${preview.heritage.map(x=>x.name).join(" + ")}\nこの2体を継ぎますか？`)) return;
    const phase=await chapterPhase().catch(()=>null);
    if(phase==="P10_FUSION_INTRO" && !await chapterEvent("FUSION_INTRO_ACK")) return;
    if(!await chapterEvent("FUSION_FLAME_WING_COMPLETE",{heritageA:traits.a,heritageB:traits.b})) return;
    save();
    MLAudio.setVoltage(100,true);
    const fusionArt=document.querySelector(".fusionArt");
    if(fusionArt && motionEnabled){
      fusionArt.classList.remove("fusionReveal"); void fusionArt.offsetWidth; fusionArt.classList.add("fusionReveal");
      if(window.MLMotion) MLMotion.fusionCinematic(fusionArt);
    }
    toast("炎翼リザル 誕生 — HERITAGE継承完了");
    testBattle = null;
    setTimeout(()=>showJourneyResult({
      eyebrow:"SPECIAL FUSION / BIRTH", title:"炎翼リザル",
      body:"火トカゲ「ヒノ」と風コウモリ「フィル」の系譜を継いだ新種。親の外見を混ぜるのではなく、種族として固定された姿にHERITAGEが残る。",
      meta:`LINEAGE  ヒノ × フィル → 炎翼リザル\nHERITAGE  ${traits.a} + ${traits.b}\nGROWTH ECHO  約60%`,
      art:`<img src="${MLAsset('assets/art/flame_lizard.png')}" alt="炎翼リザル">`,
      primary:"NEW SPECIES TEST", onPrimary:()=>go("test")
    }),1100);
  };

  // ---------- NEW SPECIES TEST ----------
  function freshTest(){
    const t=MLTestBattle.create([cloneUnit("goura"),cloneUnit("flame"),cloneUnit("leaf")]);
    if(state.testComplete){ t.hp=0; t.coreUsed=true; t.evadeSucceeded=true; t.won=true; }
    return t;
  }

  function renderTest(){
    if(!state.fused) return;
    if(!testBattle) testBattle=freshTest();
    const t=testBattle;
    $("testHpText").textContent=`${t.hp} / ${t.maxHp}`;
    $("testHp").style.width=`${Math.max(0,100*t.hp/t.maxHp)}%`;
    $("testVolText").textContent=`${t.vol} / ${MLBattle.band(t.vol)}`;
    $("testVol").style.width=`${t.vol}%`;
    $("testNextName").textContent=`${t.lockedAction.name}${t.lockedAction.type==="single"?" → 炎翼リザル":" → ALL"}`;
    $("testNextTag").textContent=t.lockedAction.tag;
    const st=stanceId(t.party,t.queue);
    $("testParty").innerHTML=t.party.map(u=>unitHtml(u,{selected:t.queue.find(q=>q.uid===u.id)?.uid,stance:st,fn:"ML.openTest"})).join("");
    renderMiniFieldParty("testFieldParty",t.party,t.queue,st,"testField");
    if(window.MLMotion){ MLMotion.setBand("testStage",MLBattle.band(t.vol)); MLMotion.ensureAtmosphere("testStage"); }
    $("testQueue").innerHTML=t.queue.length?t.queue.map((q,i)=>`<div class="ql"><span>${i+1}. ${q.name}</span><span>${q.kind}</span><button class="removeCmd" onclick="ML.removeTest(${i})">取消</button></div>`).join(""):"2つのCOMMANDを選択";
    $("testCommandCount").innerHTML=`<span>COMMAND</span><strong>${t.queue.length} / 2</strong>`;
    $("testStancePreview").innerHTML=st?`<strong>${t.party.find(x=>x.id===st)?.name} → STANCE</strong> ${t.party.find(x=>x.id===st)?.stance}`:"2人を選ぶと、残り1体のSTANCEが発動。";
    $("testObjectives").innerHTML=`<span class="objectiveChip ${t.coreUsed?"done":""}">${t.coreUsed?"✓":"○"} 炎翼牙</span><span class="objectiveChip ${t.evadeSucceeded?"done":""}">${t.evadeSucceeded?"✓":"○"} 回避成功</span><span class="objectiveChip ${t.won?"done":""}">${t.won?"✓":"○"} 撃破</span>`;
    $("testExec").disabled=t.queue.length!==2 || t.won || resolvingTestTurn;
    $("testExec").classList.toggle("executeReady",t.queue.length===2&&!t.won&&!resolvingTestTurn);
    $("testResult").hidden=!state.testComplete;
    MLAudio.setVoltage(t.vol);
  }

  function openTest(uid){
    if(!testBattle || testBattle.won) return;
    const existing=testBattle.queue.findIndex(q=>q.uid===uid);
    if(existing>=0){ removeTest(existing); return; }
    if(testBattle.queue.length>=2) return;
    const u=testBattle.party.find(x=>x.id===uid), eq=equippedFor(uid);
    openSheet(u.name,`<button class="skill" data-sheet-action="pickTest" data-uid="${uid}" data-kind="CORE"><b>CORE ${u.core}</b><div class="small">${u.coreDmg} Damage / VOL+${u.coreVol}</div></button><button class="skill" data-sheet-action="pickTest" data-uid="${uid}" data-kind="ROLE"><b>ROLE ${u.role}</b><div class="small">${roleText(u.roleType)}</div></button><button class="skill" data-sheet-action="pickTest" data-uid="${uid}" data-kind="EQUIPMENT"><b>EQUIPMENT ${eq.name}</b><div class="small">${eq.desc}</div></button>`);
  }

  function removeTest(i){ testBattle.queue.splice(i,1); haptic(8); renderTest(); }
  function pickTest(uid,kind){
    const u=testBattle.party.find(x=>x.id===uid);
    if(!u || testBattle.queue.length>=2 || testBattle.queue.some(q=>q.uid===uid)) return;
    testBattle.queue.push({uid,kind,name:u.name});
    MLAudio.event(testBattle.queue.length===2?"stance":"select"); closeSheet(); haptic(10); renderTest();
  }

  $("testExec").onclick=async()=>{
    const t=testBattle; if(!t || t.queue.length!==2 || t.won || resolvingTestTurn) return;
    MLAudio.event("execute"); haptic(18);
    resolvingTestTurn=true; renderTest();
    const queueSnapshot=t.queue.map(q=>({...q}));
    animateMiniFieldCommands("testField",t.party,queueSnapshot);
    let guard=false,evade=false,boost=false,total=0;
    const st=stanceId(t.party,t.queue);
    if(st==="goura") guard=true;
    if(st==="flame") boost=true;
    if(st==="leaf"){ const leaf=t.party.find(x=>x.id==="leaf"); leaf.hp=Math.min(leaf.maxHp,leaf.hp+6); }
    const log=[];
    for(const q of t.queue){
      const u=t.party.find(x=>x.id===q.uid);
      if(q.kind==="CORE"){
        let dmg=u.coreDmg, vol=u.coreVol;
        if(u.id==="flame"){ t.coreUsed=true; if(boost){dmg=Math.round(dmg*1.12);vol+=2;} }
        t.hp-=dmg; total+=dmg; t.vol=Math.min(100,t.vol+vol); log.push(`${u.name} ${u.core}: ${dmg}`);
      }else if(q.kind==="ROLE"){
        if(u.roleType==="guard") guard=true;
        else if(u.roleType==="calm") t.vol=Math.max(0,t.vol-12);
        else evade=true;
        log.push(`${u.name} ${u.role}`);
      }else{
        const eq=equippedFor(u.id); MLAudio.event("equipment");
        if(eq.type==="damage"){t.hp-=eq.dmg; total+=eq.dmg; t.vol=Math.min(100,t.vol+(eq.vol||0));}
        else if(eq.type==="calm"){t.vol=Math.max(0,t.vol-eq.volDown);u.hp=Math.min(u.maxHp,u.hp+eq.heal);}
        else if(eq.type==="evade") evade=true;
        else if(eq.type==="guard"||eq.type==="reflect") guard=true;
        log.push(`${u.name} ${eq.action}`);
      }
    }
    setTimeout(()=>{if(total>0){addFx("testStage",String(total));flashStage("testStage","hit");MLAudio.event("hit");if(window.MLMotion){MLMotion.burst("testStage","hit",50,39);MLMotion.hitStop("testStage",72);MLMotion.camera("testStage","light");}}},300);
    if(t.hp<=0 && !(t.coreUsed&&t.evadeSucceeded)){t.hp=1;log.push("試験条件未達：炎翼牙と回避成功の両方を確認するまで残響体が再構成。");}
    const a=t.lockedAction;
    setTimeout(()=>{
      if(window.MLMotion) MLMotion.camera("testStage",a.type==='aoe'?'medium':'light');
      if(a.type==="single"){
        const flame=t.party.find(x=>x.id==="flame");
        if(evade){t.evadeSucceeded=true;t.vol=Math.max(0,t.vol-6);log.push(`${a.name} → 炎翼リザル 回避成功 / VOL-6`);calloutTest("EVADE");if(window.MLMotion) MLMotion.burst("testStage","crash",54,62);}
        else{let d=guard?Math.round(a.dmg*.55):a.dmg;flame.hp=Math.max(1,flame.hp-d);log.push(`${a.name} → 炎翼リザル ${d}`);impactMiniField("testField",t.party,["flame"]);}
      }else{
        t.party.forEach(u=>u.hp=Math.max(1,u.hp-(guard?Math.round(a.dmg*.7):a.dmg))); log.push(`${a.name} → 全体`);impactMiniField("testField",t.party,t.party.map(u=>u.id));
      }
    },650);
    if(t.hp<=0 && t.coreUsed && t.evadeSucceeded){
      if(await chapterEvent("NEW_SPECIES_TEST_COMPLETE")){t.hp=0;t.won=true;save();}
      else t.hp=1;
    }
    t.turn+=1;t.queue=[];t.lockedAction=MLTestBattle.actionFor(t.turn);
    setTimeout(()=>{
      if(t.won){
        toast("NEW SPECIES TEST COMPLETE");
        showJourneyResult({
          eyebrow:"SPECIES TEST COMPLETE", title:"戦い方を確認した",
          body:"炎翼リザルのCOREと回避を実戦で確認。新種を含む3体編成を記録し、HOMEに届いた契約信号を確認する。",
          meta:"CHECK  炎翼牙 ✓\nCHECK  EVADE ✓\nPARTY  ゴウラ / 炎翼リザル / 葉ウサギ",
          art:`<img src="${MLAsset('assets/art/flame_lizard.png')}" alt="炎翼リザル">`,
          primary:"HOMEへ", onPrimary:()=>advanceFromTest()
        });
      }
      $("testLog").innerHTML=log.concat($("testLog").innerHTML?[$("testLog").innerHTML]:[]).join("<br>");
      resolvingTestTurn=false; renderTest();
    },1120);
  };

  function calloutTest(text){ addFx("testStage",text,"damagePop vol"); }
  function advanceFromTest(){ go("contract"); }

  async function renderContract(){
    const phase=await chapterPhase().catch(()=>null);
    const owned=!!state.contracts?.lyra_vell;
    const equipped=state.supportContract==="lyra_vell";
    $("contractUnlock").hidden=phase!=="P13_SUMMON_UNLOCK";
    $("contractSummon").hidden=phase!=="P14_SUMMON_TUTORIAL";
    $("contractEquip").hidden=!owned || equipped;
    $("contractComplete").hidden=!equipped;
    $("contractStatus").textContent=equipped?"SUPPORT EQUIPPED":owned?"CONTRACT ACQUIRED":"SIGNAL DETECTED";
    $("contractPartyProof").textContent=`MONSTER PARTY ${normalizeParty().length} / 3 — 契約者は編成外`;
  }

  async function acknowledgeContract(){
    if(await chapterEvent("SUMMON_UNLOCK_ACK")){ haptic(12); await renderContract(); }
  }

  async function summonLyra(){
    if(!await chapterEvent("SUMMON_TUTORIAL_COMPLETE")) return;
    haptic(24); MLAudio.event("legacy"); await renderContract();
    toast("CONTRACT ACQUIRED — LYRA");
  }

  async function equipLyra(){
    if(!await chapterEvent("CONTRACT_EQUIP_COMPLETE")) return;
    haptic(18); save(); await renderContract();
    toast("LYRAをSUPPORTへ設定");
  }


  // ---------- BOSS ----------
  function selectBoss(id){
    if(resolvingBossTurn) return;
    if(!D.bosses[id]) return;
    if(window.MLPlaytest) MLPlaytest.event("boss_select",{boss:id});
    state.selectedBoss = id;
    MLStorage.save(state);
    boss = MLBattle.createBoss(id,currentParty());
    closeSheet();
    renderBoss();
  }

  function openBossSelect(){
    const items=Object.values(D.bosses).map((b,i)=>`<button class="skill bossChoice" onclick="ML.selectBoss('${b.id}')">${b.icon?`<img src="${b.icon}" alt="">`:''}<span><b>BOSS ${i+1} — ${b.name}</b><div class="small">${b.title} / ${b.artStatus}</div></span></button>`).join("");
    openSheet("BOSS SELECT",items);
  }

  function renderBossTabs(){
    const allBosses=Object.values(D.bosses);
    const idx=allBosses.findIndex(b=>b.id===state.selectedBoss);
    if($("bossIndexLabel")) $("bossIndexLabel").textContent=`${Math.max(0,idx)+1}/${allBosses.length}`;
    $("bossTabs").innerHTML = allBosses.map(b =>
      `<button class="${state.selectedBoss===b.id?"on":""}" onclick="ML.selectBoss('${b.id}')">${b.name}<br><span>${b.title}</span></button>`
    ).join("");
  }

  function setSpriteState(stageId, imgId, dir, stateName, fallback="idle"){
    const stage = $(stageId), img = $(imgId);
    if(!stage || !img || !dir) return;
    const next = MLAsset(`${dir}/${stateName}.png`);
    img.onerror = () => {
      img.onerror = null;
      img.src = MLAsset(`${dir}/${fallback}.png`);
    };
    img.src = next;
  }

  function renderBossArt(spec){
    const stage = $("bossStage");
    const scene = $("bossScene");
    if(spec.battle){
      const backdrop = spec.backdrop || (spec.id === "boar" ? "assets/art/thorn_boar.png" : "");
      stage.className = `lockedStage combatStage anim-idle boss-${spec.id}`;
      stage.innerHTML = `${backdrop ? `<div class="battleBackdrop battleBackdropFar" style="background-image:url('${MLAsset(backdrop)}')"></div><div class="battleBackdrop battleBackdropMid" style="background-image:url('${MLAsset(backdrop)}')"></div><div class="battleBackdrop battleBackdropGround" style="background-image:url('${MLAsset(backdrop)}')"></div>` : ""}
        <div class="battleAtmosphere"></div>
        <div class="battleDepth battleDepthBack"></div><div class="battleDepth battleDepthFront"></div>
        <div class="cinematicHaze cinematicHazeA"></div><div class="cinematicHaze cinematicHazeB"></div>
        <div class="bossGroundShadow"></div><div class="bossIntentHalo"></div>
        <img id="bossEnemySprite" class="enemySprite" src="${MLAsset(`${spec.battle}/idle.png`)}" alt="${spec.name}">
        <div id="bossFieldParty" class="fieldParty"></div>
        <div class="battlePerspectiveFloor"></div>
        <div id="bossFx" class="fxLayer"></div>
        <div id="bossCallout" class="battleCallout"></div>
        <span class="artLockTag">OFFICIAL DESIGN LOCK</span>`;
      scene.style.backgroundImage = "none";
      scene.style.background = "radial-gradient(circle at 50% 15%,#26364f,#090d14 65%)";
      if(window.MLMotion) MLMotion.ensureAtmosphere("bossStage");
    }else{
      stage.className = "battleArt combatStage placeholder";
      const sigil = spec.id === "owl" ? "⚡" : "✦";
      stage.innerHTML = `<div class="artPending"><div class="sigil">${sigil}</div><strong>${spec.name}</strong><span>DESIGN LOCKED — BATTLE ASSET PENDING</span></div>
        <div id="bossFx" class="fxLayer"></div><div id="bossCallout" class="battleCallout"></div>`;
      scene.style.backgroundImage = "none";
      scene.style.background = "radial-gradient(circle at 50% 15%,#26364f,#090d14 65%)";
    }
  }

  function renderBossFieldParty(stanceUid){
    const holder = $("bossFieldParty");
    if(!holder) return;
    const selected = new Set(boss.queue.map(q=>q.uid));
    holder.innerHTML = boss.party.map(u=>{
      const isStance = stanceUid === u.id;
      const isCommand = selected.has(u.id);
      const stateName = isStance ? "stance" : "idle";
      const stateLabel = u.hp<=0 ? "DOWN" : isStance ? "STANCE" : isCommand ? "COMMAND" : "READY";
      const classes = `fieldAlly ${isStance?"stance":""} ${isCommand?"command":""} ${u.hp<=0?"ko":""}`;
      return `<div id="field-${u.id}" class="${classes}">
        ${u.battle ? `<img id="fieldImg-${u.id}" src="${MLAsset(`${u.battle}/${stateName}.png`)}" alt="${u.name}">` : ""}
        <span class="fieldState">${stateLabel}</span>
      </div>`;
    }).join("");
  }

  function animateFieldCommand(queueSnapshot, stanceUid){
    if(!queueSnapshot || !$("bossFieldParty")) return;
    if(stanceUid){
      const st = boss.party.find(u=>u.id===stanceUid);
      const img = $(`fieldImg-${stanceUid}`);
      if(st && img && st.battle) img.src = MLAsset(`${st.battle}/stance.png`);
    }
    queueSnapshot.forEach((q,i)=>{
      const u=boss.party.find(x=>x.id===q.uid),el=$(`field-${q.uid}`),img=$(`fieldImg-${q.uid}`);
      if(!u||!el||!img||!u.battle) return;
      if(window.MLMotion) MLMotion.animateAlly({el,img,battle:u.battle,kind:q.kind,delay:55+i*115});
      else{
        setTimeout(()=>{el.classList.add("actor");img.src=MLAsset(`${u.battle}/attack.png`);},70+i*120);
        setTimeout(()=>{el.classList.remove("actor");img.src=MLAsset(`${u.battle}/idle.png`);},520+i*120);
      }
    });
  }

  function animateFieldImpact(action){
    if(!$("bossFieldParty") || !action) return;
    let targets=[];
    if(action.type==="single" && action.target) targets=[action.target];
    else if(action.type==="aoe" || action.type==="random3") targets=boss.party.filter(u=>u.hp>0).map(u=>u.id);
    targets.forEach((id,i)=>{
      const u=boss.party.find(x=>x.id===id);
      const el=$(`field-${id}`), img=$(`fieldImg-${id}`);
      if(!u || !el || !img || !u.battle) return;
      if(window.MLMotion) MLMotion.impactAlly({el,img,battle:u.battle,down:u.hp<=0,delay:80+i*55});
      else{
        setTimeout(()=>{el.classList.add("impacted");img.src=MLAsset(`${u.battle}/hit.png`);},80+i*55);
        setTimeout(()=>{el.classList.remove("impacted");img.src=MLAsset(`${u.battle}/${u.hp<=0?"danger":"idle"}.png`);},420+i*55);
      }
    });
  }


  function syncBossImpactHud(){
    $("bossHpText").textContent = `${boss.hp} / ${boss.maxHp}`;
    $("bossHp").style.width = `${100*boss.hp/boss.maxHp}%`;
    if($("bossVolText")) $("bossVolText").textContent = `${boss.vol} — ${MLBattle.band(boss.vol)}`;
    if($("bossVol")) $("bossVol").style.width = boss.vol+"%";
    const voltageBand = MLBattle.band(boss.vol);
    if($("bossVoltageBig")) $("bossVoltageBig").textContent = boss.vol;
    if($("bossVoltageBand")) $("bossVoltageBand").textContent = voltageBand === "LEGACY" ? "LEGACY" : voltageBand;
    const voltageSeal = document.querySelector(".voltageSeal");
    if(voltageSeal) voltageSeal.className = `voltageSeal ${voltageBand.toLowerCase()} ${boss.vol>=90?"danger":""}`;

    $("bossParty").innerHTML = boss.party.map(u=>bossUnitHtml(u,stanceId(boss.party,boss.queue))).join("");
    $("bossStage").classList.toggle("dangerVignette",boss.vol>=90);
    $("bossDangerBanner")?.classList.toggle("show",boss.vol>=90);
    if(window.MLMotion) MLMotion.setBand("bossStage",MLBattle.band(boss.vol));
    MLAudio.setVoltage(boss.vol);
  }

  function renderBoss(){
    if(!boss || boss.id !== state.selectedBoss) boss = MLBattle.createBoss(state.selectedBoss,currentParty());
    const spec = D.bosses[boss.id];
    renderBossTabs();
    renderBossArt(spec);
    if(spec.battle && motionEnabled){
      $("bossStage").classList.add(boss.vol >= 90 ? "anim-danger" : "anim-idle");
    }

    $("bossTitle").textContent = `${spec.title} / ${spec.artStatus}`;
    $("bossName").textContent = spec.name;
    if($("bossTurnNo")) $("bossTurnNo").textContent = String(boss.turn).padStart(2,"0");
    $("bossHpText").textContent = `${boss.hp} / ${boss.maxHp}`;
    $("bossHp").style.width = `${100*boss.hp/boss.maxHp}%`;
    if($("bossVolText")) $("bossVolText").textContent = `${boss.vol} — ${MLBattle.band(boss.vol)}`;
    if($("bossVol")) $("bossVol").style.width = boss.vol+"%";
    const voltageBand = MLBattle.band(boss.vol);
    if($("bossVoltageBig")) $("bossVoltageBig").textContent = boss.vol;
    if($("bossVoltageBand")) $("bossVoltageBand").textContent = voltageBand === "LEGACY" ? "LEGACY" : voltageBand;
    const voltageSeal = document.querySelector(".voltageSeal");
    if(voltageSeal) voltageSeal.className = `voltageSeal ${voltageBand.toLowerCase()} ${boss.vol>=90?"danger":""}`;

    $("bossMastery").innerHTML = `<b>MASTERY</b><div class="small">${spec.mastery}</div><div class="small">REWARD: ${spec.reward}</div><div class="small" style="margin-top:4px">${spec.guide}</div>`;
    $("bossNext").textContent = boss.skipEnemyNext ? "CRASH — NEXT SKIP" : boss.lockedAction.name;
    const currentBand = MLBattle.band(boss.vol);
    if(window.MLMotion){
      MLMotion.setBand("bossStage",currentBand);
      if(spec.battle && !resolvingBossTurn && !boss.won){
        MLMotion.telegraph({stageId:"bossStage",imgId:"bossEnemySprite",dir:spec.battle,bossId:boss.id,action:boss.lockedAction,band:currentBand,skipped:boss.skipEnemyNext});
        MLMotion.bossIntent("bossStage",boss.id,boss.lockedAction);
        MLMotion.targetForecast("bossStage",boss.lockedAction,boss.party);
      }
    }
    $("bossNextCard").className = `panel next combatNext ${currentBand.toLowerCase()}`;
    const badge = $("bossBandBadge");
    badge.textContent = currentBand === "LEGACY" ? "LEGACY ART" : currentBand;
    badge.className = "bandBadge " + currentBand.toLowerCase();
    $("bossNextInfo").textContent = boss.skipEnemyNext
      ? "敵は体勢を崩している。次の敵行動を失う / 被ダメージ+50%"
      : `${boss.lockedAction.tag || ""} / ${boss.lockedAction.type==="aoe"?"全体":boss.lockedAction.type==="random3"?"ランダム3Hit":"単体"}`;
    const targetName = boss.lockedAction.type==="aoe" ? "ALL" :
      boss.lockedAction.type==="random3" ? "RANDOM ×3" :
      (boss.party.find(x=>x.id===boss.lockedAction.target)?.name || "TARGET");
    $("bossTarget").innerHTML = `<span class="targetChip ${boss.lockedAction.type==="aoe"?"aoe":""}">TARGET: ${targetName}</span>`;

    const st = stanceId(boss.party,boss.queue);
    $("bossParty").innerHTML = boss.party.map(u=>bossUnitHtml(u,st)).join("");
    renderBossFieldParty(st);
    if(window.MLMotion) MLMotion.targetForecast("bossStage",boss.lockedAction,boss.party);

    $("bossQueue").innerHTML = boss.queue.length
      ? boss.queue.map((q,i)=>`<div class="ql"><span>${i+1}. ${q.name}</span><span>${q.kind}</span><button class="removeCmd" onclick="ML.removeBoss(${i})">取消</button></div>`).join("")
      : "2つのCOMMANDを選択";
    $("bossCommandCount").innerHTML = `<span>COMMAND</span><strong>${boss.queue.length} / 2</strong>`;
    $("bossStancePreview").innerHTML = st
      ? `<strong>${boss.party.find(x=>x.id===st)?.name || ""} → STANCE</strong> ${boss.party.find(x=>x.id===st)?.stance || ""}`
      : "2人を選ぶと、残り1体のSTANCEが発動。";
    $("bossExec").disabled = boss.queue.length !== 2 || boss.won || resolvingBossTurn;
    $("bossExec").textContent = boss.won ? "BOSS CLEAR" : resolvingBossTurn ? "RESOLVING..." : `EXECUTE ${boss.queue.length}/2`;
    $("bossExec").classList.toggle("executeReady",boss.queue.length===2&&!boss.won&&!resolvingBossTurn);

    const allBossCleared = Object.values(state.clears).every(Boolean);
    const storedMastery=!!state.mastery?.[boss.id];
    const coreId=MLLegacy.coreIdForBoss(boss.id), core=coreId?D.legacyCores[coreId]:null;
    $("bossResult").innerHTML = boss.won
      ? `<div class="bossReward"><div class="eyebrow">${boss.mastery||storedMastery?"MASTERY COMPLETE":"BOSS CLEAR"}</div><div class="rewardName">${boss.mastery||storedMastery?`LEGACY CORE「${core?.name||"—"}」`:"MASTERY未達"}</div><div class="small">${boss.mastery||storedMastery?(core?.theme||""):D.bosses[boss.id].mastery}</div>${allBossCleared?`<div class="coreClear">THREE BOSS CORE CLEAR<br><small>RAISE / SUPPRESS / CRASH の3戦術を突破</small></div>`:""}<div class="bossResultActions">${boss.mastery||storedMastery?'<button class="btn primary" onclick="ML.go(\'archive\')">残響を継ぐ</button>':'<button class="btn primary" onclick="ML.resetBoss()">MASTERY再戦</button>'}<button class="btn" onclick="ML.openBossSelect()">別Boss</button></div></div>`
      : "";
    $("bossTelemetry").innerHTML = `<b>TURN ${boss.turn}</b> / VOL ${boss.vol} / CRASH ${boss.crashCount} / RAGE ${boss.enteredRage?"ENTERED":"AVOIDED"} / LEGACY ${boss.legacyTriggered?"TRIGGERED":"—"}`;
    $("bossStage").classList.toggle("dangerVignette",boss.vol>=90);
    const dangerBanner=$("bossDangerBanner");
    if(dangerBanner) dangerBanner.classList.toggle("show",boss.vol>=90);

    MLAudio.setVoltage(boss.vol);
  }

  function openBoss(uid){
    if(resolvingBossTurn) return;
    const existing=boss.queue.findIndex(q=>q.uid===uid);
    if(existing>=0){ removeBoss(existing); return; }
    if(boss.queue.length>=2 || boss.won) return;
    const u = boss.party.find(x=>x.id===uid);
    const eq=equippedFor(uid);
    openSheet(u.name,
      `<button class="skill" data-sheet-action="pickBoss" data-uid="${uid}" data-kind="CORE"><b>CORE ${u.core}</b><div class="small">${u.coreDmg} Damage / VOL+${u.coreVol}</div></button>
       <button class="skill" data-sheet-action="pickBoss" data-uid="${uid}" data-kind="ROLE"><b>ROLE ${u.role}</b><div class="small">${roleText(u.roleType)}</div></button>
       <button class="skill" data-sheet-action="pickBoss" data-uid="${uid}" data-kind="EQUIPMENT"><b>EQUIPMENT ${eq.name}</b><div class="small">${eq.desc}</div></button>`);
  }

  function removeBoss(index){
    if(resolvingBossTurn) return;
    boss.queue.splice(index,1);
    haptic(8);
    renderBoss();
  }

  function pickBoss(uid,kind){
    if(resolvingBossTurn || boss.won) return;
    if(window.MLPlaytest) MLPlaytest.inc("commandChanges",1);
    const before=boss.queue.length;
    const u = boss.party.find(x=>x.id===uid);
    if(!u || u.hp<=0) return;
    const existing=boss.queue.findIndex(q=>q.uid===uid);
    if(existing>=0){
      if(boss.queue[existing].kind===kind){ boss.queue.splice(existing,1); }
      else boss.queue[existing]={uid,kind,name:u.name};
    }else{
      if(boss.queue.length>=2) return;
      boss.queue.push({uid,kind,name:u.name});
    }
    MLAudio.event(boss.queue.length===2 && before!==2 ? "stance" : "select");
    if(boss.queue.length===2 && before!==2){
      if(window.MLPlaytest) MLPlaytest.event("two_commands_locked",{context:"boss",boss:boss.id,turn:boss.turn,stance:stanceId(boss.party,boss.queue)});
      setTimeout(()=>MLAudio.event("command"),70);
    }
    closeSheet();
    haptic(10);
    renderBoss();
    if(window.MLMotion){
      const st=stanceId(boss.party,boss.queue);
      setTimeout(()=>MLMotion.orderFeedback("bossStage",uid,st,boss.queue.length),20);
    }
  }

  function damageBoss(base){
    const mul = boss.crash ? 1.5 : 1;
    return Math.round(base*mul);
  }

  function applyPlayerCommands(log){
    let totalDamage=0;
    boss.guard = false;
    boss.evade = false;
    boss.boost = false;
    boss.reflect = false;

    const st = stanceId(boss.party,boss.queue);
    if(st === "goura"){ boss.guard = true; log.push("STANCE ゴウラ: 炉守"); }
    if(st === "leaf"){
      const leaf = boss.party.find(x=>x.id==="leaf");
      const lm=MLLegacy.modifier(D,state,"leaf",{hp:leaf.hp,maxHp:leaf.maxHp,anyAllyLow:boss.party.some(x=>x.hp/x.maxHp<=.5),crash:boss.crash});
      const heal=6+lm.stanceHealBonus;
      leaf.hp = Math.min(leaf.maxHp,leaf.hp+heal);
      log.push(`STANCE 葉ウサギ: 芽息 HEAL ${heal}${lm.stanceHealBonus?" / LEGACY":""}`);
    }
    if(st === "flame"){ const f=boss.party.find(u=>u.id==="flame"); if(f) f.stanceCoreReady=true; log.push("STANCE 炎翼リザル: 滑空炎"); }

    for(const q of boss.queue){
      const u = boss.party.find(x=>x.id===q.uid);
      if(q.kind === "CORE"){
        const lm=MLLegacy.modifier(D,state,u.id,{hp:u.hp,maxHp:u.maxHp,anyAllyLow:boss.party.some(x=>x.hp/x.maxHp<=.5),crash:boss.crash});
        let d = Math.round(u.coreDmg*lm.coreDamageMul);
        let vv = Math.max(0,u.coreVol+lm.coreVolDelta);
        if(u.id==="flame" && u.stanceCoreReady){ d=Math.round(d*1.12); vv+=2; u.stanceCoreReady=false; }
        if(u.id==="flame" && boss.vol>=30 && boss.vol<90) d=Math.round(d*1.10);
        if(lm.crashDamageBonus && boss.crash) d=Math.round(d*(1+lm.crashDamageBonus));
        d = damageBoss(d);
        boss.hp = Math.max(0,boss.hp-d);
        totalDamage += d;
        boss.vol = Math.min(100,boss.vol+vv);
        log.push(`${u.name} ${u.core}: ${d}${boss.crash?" (CRASH +50%)":""} / VOL+${vv}`);
      }else if(q.kind==="EQUIPMENT"){
        const eq=equippedFor(u.id);
        MLAudio.event("equipment");
        if(eq.type==="damage"){
          let d=eq.dmg;
          if(eq.id==="pursuit_spear" && boss.vol>=60) d=Math.round(d*1.20);
          d=damageBoss(d);
          boss.hp=Math.max(0,boss.hp-d); totalDamage+=d;
          boss.vol=Math.min(100,boss.vol+(eq.vol||0));
          log.push(`${u.name} ${eq.action}: ${d} / VOL+${eq.vol||0}`);
        }else if(eq.type==="calm"){
          const lm=MLLegacy.modifier(D,state,u.id,{hp:u.hp,maxHp:u.maxHp,crash:boss.crash});
          const down=eq.volDown+lm.calmBonus;
          boss.vol=Math.max(0,boss.vol-down);
          u.hp=Math.min(u.maxHp,u.hp+eq.heal);
          log.push(`${u.name} ${eq.action}: VOL-${down} / HEAL ${eq.heal}${lm.calmBonus?" / LEGACY":""}`);
        }else if(eq.type==="evade"){
          boss.evade=true; log.push(`${u.name} ${eq.action}: 回避準備`);
        }else if(eq.type==="guard"){
          boss.guard=true; log.push(`${u.name} ${eq.action}: GUARD`);
        }else if(eq.type==="reflect"){
          boss.guard=true; boss.reflect=true; log.push(`${u.name} ${eq.action}: REFLECT準備`);
        }
      }else if(u.roleType==="guard"){
        boss.guard = true; log.push(`${u.name} ${u.role}`);
      }else if(u.roleType==="calm"){
        const lm=MLLegacy.modifier(D,state,u.id,{hp:u.hp,maxHp:u.maxHp,crash:boss.crash});
        const down=12+lm.calmBonus;
        boss.vol = Math.max(0,boss.vol-down); log.push(`${u.name} ${u.role}: VOL-${down}${lm.calmBonus?" / LEGACY":""}`);
      }else{
        boss.evade = true; log.push(`${u.name} ${u.role}: 回避準備`);
      }
    }
    if(boss.vol >= 60) boss.enteredRage = true;
    return totalDamage;
  }

  function hurtTarget(targetId,dmg,log,name){
    let target = boss.party.find(x=>x.id===targetId);
    if(!target || target.hp<=0) target = boss.party.find(x=>x.hp>0) || boss.party[0];

    const lm=MLLegacy.modifier(D,state,target.id,{hp:target.hp,maxHp:target.maxHp,crash:boss.crash});
    const canEvade = boss.evade && (target.id==="fire" || target.id==="flame");
    if(canEvade){
      if(target.id==="flame") boss.vol = Math.max(0,boss.vol-(6+lm.evadeVolDownBonus));
      log.push(`${name} → ${target.name} 回避成功`);
      return true;
    }

    let d = dmg;
    if(boss.guard){
      let gm=.55;
      if(target.id==="goura" && lm.guardSingleMul<1) gm*=lm.guardSingleMul;
      d = Math.round(d*gm);
    }
    target.hp = Math.max(0,target.hp-d);
    log.push(`${name} → ${target.name} ${d}`);
    if(boss.reflect){ const r=Math.max(6,Math.round(d*.35)); boss.hp=Math.max(0,boss.hp-r); log.push(`REFLECT → ${r}`); }
    return false;
  }

  function enemyAction(log){
    if(boss.skipEnemyNext){
      log.push("CRASH: 敵行動スキップ");
      boss.skipEnemyNext = false;
      boss.crash = false;
      return;
    }

    const a = boss.lockedAction;
    if(a.legacy){
      boss.legacyTriggered = true;
      callout("LEGACY ART","legacy"); MLAudio.event("legacy");
      flashStage("bossStage","legacy");
      if(window.MLMotion) MLMotion.legacyFreeze("bossStage",150);
      haptic(45);
    }

    if(a.type === "single"){
      const dodged = hurtTarget(a.target || "goura",a.dmg,log,a.name);
      if(a.crashable && dodged){
        boss.crash = true;
        boss.skipEnemyNext = true;
        boss.crashCount += 1;
        log.push(`CRASH ×${boss.crashCount} — 次の敵行動SKIP / 被ダメージ+50%`);
        callout(`CRASH ×${boss.crashCount}`,"crash"); MLAudio.event("crash");
        haptic([25,40,25]);
      }
    }else if(a.type === "aoe"){
      let reflected=0;
      boss.party.forEach(u=>{
        let d = a.dmg;
        if(boss.guard){
          let gm=.70;
          const g=boss.party.find(x=>x.id==="goura");
          if(g&&g.hp>0){const glm=MLLegacy.modifier(D,state,"goura",{hp:g.hp,maxHp:g.maxHp,crash:boss.crash});gm*=glm.guardAoeMul;}
          d=Math.round(d*gm);
        }
        u.hp=Math.max(0,u.hp-d);
        if(boss.reflect) reflected+=Math.max(2,Math.round(d*.12));
      });
      if(reflected){ boss.hp=Math.max(0,boss.hp-reflected); log.push(`REFLECT → ${reflected}`); }
      log.push(`${a.name} → 全体 ${boss.guard?"(GUARD軽減)":""}`);
    }else if(a.type === "random3"){
      const alive = boss.party.filter(u=>u.hp>0);
      for(let i=0;i<3;i++){
        const t=alive[i%alive.length];
        let d=a.dmg;
        if(boss.guard){
          let gm=.70; const g=boss.party.find(x=>x.id==="goura");
          if(g&&g.hp>0){const glm=MLLegacy.modifier(D,state,"goura",{hp:g.hp,maxHp:g.maxHp,crash:boss.crash});gm*=glm.guardAoeMul;}
          d=Math.round(d*gm);
        }
        t.hp=Math.max(0,t.hp-d);
      }
      log.push(`${a.name} → ランダム3Hit`);
    }

    if(a.legacy && boss.party.some(u=>u.hp>0)){
      boss.legacySurvived = true;
      if(boss.id==="boar"){
        boss.vol = 65;
        log.push("LEGACY ART RESOLVED → VOL 65 / RAGE");
      }
    }
  }

  $("bossExec").onclick = () => {
    if(resolvingBossTurn || boss.queue.length !== 2 || boss.won) return;
    if(window.MLPlaytest){ MLPlaytest.inc("bossExecutes",1); MLPlaytest.event("boss_turn_execute",{boss:boss.id,turn:boss.turn,vol:boss.vol,commands:boss.queue.map(q=>({uid:q.uid,kind:q.kind})),stance:stanceId(boss.party,boss.queue)}); }
    MLAudio.event("execute");
    resolvingBossTurn = true;
    $("bossExec").disabled = true;
    $("bossExec").textContent = "RESOLVING...";

    const log = [];
    const queueSnapshot = boss.queue.map(q=>({...q}));
    const stanceSnapshot = stanceId(boss.party,boss.queue);
    const enemyLocked = {...boss.lockedAction};
    const enemyWasSkipped = boss.skipEnemyNext;

    haptic(20);
    animateFieldCommand(queueSnapshot, stanceSnapshot);
    if(window.MLMotion){
      MLMotion.focus("bossStage","party",queueSnapshot[0]?.uid);
      setTimeout(()=>MLMotion.slashTrail("bossStage","ally",48,43),250);
    }
    const totalDamage = applyPlayerCommands(log);

    if(totalDamage>0){
      setTimeout(()=>{
        syncBossImpactHud();
        addFx("bossStage",String(totalDamage));
        flashStage("bossStage","hit");
        setSpriteState("bossStage","bossEnemySprite",D.bosses[boss.id].battle,"hit");
        animateStage("bossStage","hit",360);
        if(window.MLMotion){ MLMotion.burst("bossStage",boss.crash?"crash":"hit",50,40); MLMotion.hitStop("bossStage",92); MLMotion.camera("bossStage",totalDamage>=80?"medium":"light"); }
        MLAudio.event("hit");
      },340);
    }
    const volDeltaText = boss.vol>=90 ? "DANGER" : MLBattle.band(boss.vol);
    setTimeout(()=>{syncBossImpactHud();addFx("bossStage",volDeltaText,"damagePop vol");},430);

    if(boss.hp <= 0){
      setTimeout(()=>{
        finishBoss(log);
        resolvingBossTurn = false;
        renderBoss();
      },760);
      return;
    }

    // v1.3.2: clearly separate PLAYER RESOLVE -> ENEMY READ -> ENEMY IMPACT -> NEXT TURN.
    // Patch releases must not move the permanent UI layout; readability is temporal only.
    setTimeout(()=>{
      const label = enemyWasSkipped ? "ENEMY ACTION — CRASH" : `ENEMY ACTION — ${enemyLocked.name||"NEXT"}`;
      callout(label, enemyWasSkipped ? "crash" : (enemyLocked.legacy ? "legacy" : "next"));
      if(window.MLMotion){
        MLMotion.focus("bossStage","enemy",enemyLocked.target||null);
        if(MLMotion.enemyWarning) MLMotion.enemyWarning("bossStage",enemyLocked,enemyWasSkipped);
      }
      MLAudio.event(enemyWasSkipped ? "crash" : "band");
    },1350);

    // Anticipation pose is shown before damage is applied.
    setTimeout(()=>{
      if(D.bosses[boss.id].battle){
        setSpriteState("bossStage","bossEnemySprite",D.bosses[boss.id].battle,enemyWasSkipped ? "hit" : (boss.id === "boar" ? "stance" : "attack_prep"));
      }
      animateStage("bossStage", enemyWasSkipped ? "crash" : "attack", 980);
      if(window.MLMotion){
        MLMotion.focus("bossStage","enemy",enemyLocked.target||null);
        if(!enemyWasSkipped) MLMotion.slashTrail("bossStage",boss.id,50,55);
        if(enemyLocked.legacy) MLMotion.legacyFreeze("bossStage",190);
      }
      if(!enemyWasSkipped) MLAudio.event(enemyLocked.legacy ? "legacy" : "command");
    },1950);

    // Damage lands in a separate beat so the player can identify the action and target first.
    setTimeout(()=>{
      if(D.bosses[boss.id].battle){
        setSpriteState("bossStage","bossEnemySprite",D.bosses[boss.id].battle,enemyWasSkipped ? "hit" : "attack");
      }
      if(window.MLMotion){
        MLMotion.enemyStrike("bossStage",enemyLocked.type);
        if(MLMotion.enemyImpactBeat) MLMotion.enemyImpactBeat("bossStage",enemyLocked);
      }
      if(!enemyWasSkipped) MLAudio.event("hit");
      enemyAction(log);
      syncBossImpactHud();
      if(!enemyWasSkipped){
        animateFieldImpact(enemyLocked);
        if(window.MLMotion){ MLMotion.camera("bossStage",enemyLocked.legacy?"heavy":enemyLocked.type==="aoe"||enemyLocked.type==="random3"?"medium":"light"); MLMotion.burst("bossStage",enemyLocked.legacy?"legacy":"hit",50,68); }
        // Camera motion stays on the battlefield; NEXT and controls remain still.
      }
    },2450);

    setTimeout(()=>{
      const spec=D.bosses[boss.id];
      if(spec.battle && $("bossEnemySprite")){
        setSpriteState("bossStage","bossEnemySprite",spec.battle,boss.vol>=90 ? "danger" : "idle");
      }

      if(!boss.party.some(u=>u.hp>0)){
        log.push("PARTY DOWN — 再戦してください");
        boss.queue=[];
        $("bossLog").innerHTML=log.concat($("bossLog").innerHTML?[$("bossLog").innerHTML]:[]).join("<br>");
        resolvingBossTurn = false;
        renderBoss();
        return;
      }

      if(boss.hp<=0){ finishBoss(log); resolvingBossTurn=false; renderBoss(); return; }

      // NEXT remains locked during player commands; recalculate only after current enemy action resolves.
      boss.turn += 1;
      boss.lockedAction = MLBattle.actionFor(boss.id,boss.vol,boss.turn);
      boss.queue = [];
      $("bossLog").innerHTML = log.concat($("bossLog").innerHTML?[$("bossLog").innerHTML]:[]).join("<br>");
      resolvingBossTurn = false;
      renderBoss();
      setTimeout(pulseNext,80);
    },3850);
  };

  function finishBoss(log){
    boss.won = true;
    boss.mastery = MLBattle.masteryCheck(boss);
    if(window.MLPlaytest) MLPlaytest.event("boss_clear",{boss:boss.id,turn:boss.turn,vol:boss.vol,mastery:boss.mastery,legacySurvived:!!boss.legacySurvived,crashCount:boss.crashCount});
    state.clears[boss.id] = true;
    let rewardUnlock=null;
    if(boss.mastery){ state.mastery[boss.id] = true; rewardUnlock=MLLegacy.unlockForBoss(state,boss.id); }
    save();
    log.push(`BOSS CLEAR${boss.mastery?" / MASTERY COMPLETE":""}`);
    $("bossLog").innerHTML = log.concat($("bossLog").innerHTML?[$("bossLog").innerHTML]:[]).join("<br>");
    toast(boss.mastery ? "MASTERY COMPLETE" : "BOSS CLEAR");
    const result=$('bossResult');
    if(result){
      const coreId=rewardUnlock?.id||MLLegacy.coreIdForBoss(boss.id), core=coreId?D.legacyCores[coreId]:null;
      result.innerHTML=`<div class="bossReward"><div class="eyebrow">${boss.mastery?'MASTERY REWARD':'BATTLE RECORD'}</div><div class="rewardName">${boss.mastery&&core?`LEGACY CORE「${core.name}」`:'MASTERY条件を満たして再戦'}</div><div class="small">${boss.mastery&&core?core.theme:D.bosses[boss.id].mastery}</div><div class="bossResultActions">${boss.mastery?'<button class="btn primary" onclick="ML.go(\'archive\')">残響を継ぐ</button>':'<button class="btn primary" onclick="ML.resetBoss()">MASTERY再戦</button>'}<button class="btn" onclick="ML.openBossSelect()">別Boss</button></div></div>`;
    }
    if(boss.mastery){
      const coreId=rewardUnlock?.id||MLLegacy.coreIdForBoss(boss.id), core=coreId?D.legacyCores[coreId]:null;
      setTimeout(()=>showJourneyResult({
        eyebrow:"BOSS MASTERY / LEGACY ACQUIRED", title:core?`LEGACY CORE「${core.name}」`:"MASTERY COMPLETE",
        body:core?`Bossの戦い方そのものを残響として獲得した。<br>${core.theme}`:"Mastery条件を達成した。",
        meta:`BOSS  ${D.bosses[boss.id].name}\nMASTERy  COMPLETE\nNEXT  LEGACY ARCHIVE`,
        art:`<img src="${MLAsset(D.bosses[boss.id].art)}" alt="${D.bosses[boss.id].name}">`,
        primary:"LEGACY ARCHIVE", onPrimary:()=>go("archive")
      }),760);
    }
    if(window.MLPlaytest && boss.id==="boar") setTimeout(()=>MLPlaytest.showSurvey(),1700);
  }

  function resetBoss(){
    if(resolvingBossTurn) return;
    if(window.MLPlaytest){ MLPlaytest.inc("bossReplays",1); MLPlaytest.event("boss_replay",{boss:state.selectedBoss}); }
    resolvingBossTurn = false;
    boss = MLBattle.createBoss(state.selectedBoss,currentParty());
    $("bossLog").innerHTML="";
    renderBoss();
    toast("BOSS REPLAY");
  }

  // INIT
  hunt=freshHunt();
  if(state.fused) testBattle=freshTest();
  boss=MLBattle.createBoss(state.selectedBoss,currentParty());
  document.body.classList.remove("bossMode","storyMode");
  state.lastScreen="home";
  MLStorage.save(state);
  renderHome(); renderStory(); renderHunt(); renderOwned(); renderLoadout(); renderArchive(); lockFuse(); if(state.fused) renderTest(); renderBoss(); demo(18); setMotionUI();
  go("home");
  if(window.MLPlaytest){ MLPlaytest.bind(); MLPlaytest.event("app_ready",{screen:state.lastScreen||"home"}); }

  return {closeSkillHelp:closeSheet,skillHelp,showIntro,go,goJourney,storyNext,storyCmd,storyStance,storyVol,storyEquip,storyBoss,setEquipment,setPartyLegacy,setPartyFocus,assignParty,confirmParty,setLegacy,archiveTab,openHunt,pickHunt,removeHunt,openTest,pickTest,removeTest,advanceFromTest,acknowledgeContract,summonLyra,equipLyra,selectBoss,openBossSelect,openBoss,pickBoss,removeBoss,resetBoss};
})();
