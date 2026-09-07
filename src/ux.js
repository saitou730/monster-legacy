(() => {
  'use strict';

  const BUILD = '1.8.4-ux';
  const SAVE_KEY = window.ML_DATA?.saveKey || 'monsterLegacyWeb02';
  const LONG_PRESS_MS = 520;

  const stanceGuides = {
    goura: {
      role: 'RECEIVE',
      summary: '受けるために、あえて動かさない。',
      detail: '2 COMMANDに選ばれなかったターンに「炉守」がSTANCEとして自動発動。敵の攻撃を受ける構えになり、NEXTの対象に合わせて“残す”こと自体が防御判断になる。'
    },
    fire: {
      role: 'RAISE PREP',
      summary: '攻撃役を残し、次の攻め筋を作る。',
      detail: '火トカゲを2 COMMANDに選ばなかった時のSTANCE「火溜め」。このターンは直接動かさず、攻撃役を残す選択として扱う。誰をCOMMANDにするかだけでなく、誰を残すかまで含めて1ターンを設計する。'
    },
    leaf: {
      role: 'RECOVER',
      summary: '動かさずに、立て直しへ回す。',
      detail: '2 COMMANDに選ばれなかったターンに「芽息」がSTANCEとして自動発動。現Vertical Sliceでは自身を小回復し、攻撃や操作枠を使わずに立て直す。'
    },
    wind: {
      role: 'EVADE PREP',
      summary: '単体攻撃を読むための、回避寄りの残し方。',
      detail: '風コウモリを2 COMMANDに選ばなかった時のSTANCE「滑空姿勢」。EVADE系の役割を持つ個体として、NEXTを見ながら“動かす／残す”を判断するための構え。'
    },
    flame: {
      role: 'BURST / EVADE PREP',
      summary: '攻め急がず、次の攻撃機会を作る。',
      detail: '炎翼リザルを2 COMMANDに選ばなかった時のSTANCE「滑空炎」。BURST / EVADEの両面を持つため、毎ターン使うのではなく、NEXTとVOLTAGEを見て残す価値を判断する。'
    }
  };

  function readSave(){
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || '{}') || {}; }
    catch (_) { return {}; }
  }

  function hasProgress(s){
    return !!(
      Number(s.storyStep || 0) > 0 || s.storyComplete || s.joinedBat || s.fused || s.testComplete ||
      Object.values(s.clears || {}).some(Boolean) || Object.values(s.mastery || {}).some(Boolean)
    );
  }

  function unitFromName(name){
    return Object.values(window.ML_DATA?.units || {}).find(u => u.name === name) || null;
  }

  function unitFromCard(card){
    const name = card?.querySelector('.unitTop b')?.textContent?.trim();
    return name ? unitFromName(name) : null;
  }

  function guideFor(unit){
    if(!unit) return null;
    const guide = stanceGuides[unit.id] || {
      role: 'AUTO',
      summary: 'COMMANDに選ばなかった1体も、STANCEとして戦う。',
      detail: '3体のうち2体をCOMMANDに選ぶと、残った1体のSTANCEが自動で確定する。'
    };
    return {unit, guide};
  }

  function openSheet(title, html){
    const sheetTitle = document.getElementById('sheetTitle');
    const sheetBody = document.getElementById('sheetBody');
    const mask = document.getElementById('mask');
    const sheet = document.getElementById('sheet');
    if(!sheetTitle || !sheetBody || !mask || !sheet) return false;
    sheetTitle.textContent = title;
    sheetBody.innerHTML = html;
    mask.classList.add('show');
    sheet.classList.add('show');
    return true;
  }

  function stanceHelpHtml(unit, guide){
    return `<div class="stanceHelpSheet">
      <div class="stanceHelpRule"><span>1 STANCE / AUTO</span><b>2体をCOMMANDに選ぶ → 残り1体が自動発動</b></div>
      <div class="stanceHelpHero"><span>${guide.role}</span><h3>${unit.stance}</h3><p>${guide.summary}</p></div>
      <div class="stanceHelpDetail">${guide.detail}</div>
      <div class="stanceHelpExample"><b>判断の順番</b><span>① NEXTを見る</span><span>② 動かす2体を決める</span><span>③ 残る1体のSTANCEまで確認</span><span>④ EXECUTE</span></div>
    </div>`;
  }

  function showStanceHelp(card){
    const resolved = guideFor(unitFromCard(card));
    if(!resolved) return;
    const {unit, guide} = resolved;
    if(navigator.vibrate) navigator.vibrate(14);
    openSheet(`STANCE — ${unit.name}`, stanceHelpHtml(unit, guide));
    window.MLPlaytest?.event?.('stance_help_open', {unit:unit.id, stance:unit.stance, build:BUILD});
  }

  function decorateUnits(){
    document.querySelectorAll('.unit').forEach(card => {
      const unit = unitFromCard(card);
      if(!unit || card.querySelector('.stanceHoldHint')) return;
      const hint = document.createElement('div');
      hint.className = 'stanceHoldHint';
      hint.textContent = `長押し: STANCE「${unit.stance}」`;
      card.appendChild(hint);
    });
  }

  function augmentCommandSheet(){
    const sheetBody = document.getElementById('sheetBody');
    const title = document.getElementById('sheetTitle');
    if(!sheetBody || !title || sheetBody.querySelector('.stanceSkillGuide')) return;
    if(!sheetBody.querySelector('.skill')) return;
    const unit = unitFromName(title.textContent.trim());
    const resolved = guideFor(unit);
    if(!resolved) return;
    const {guide} = resolved;
    const info = document.createElement('div');
    info.className = 'stanceSkillGuide';
    info.innerHTML = `<div><span>STANCE / AUTO</span><b>${unit.stance}</b></div><p>${guide.summary}</p><small>この個体を2 COMMANDに選ばなかった時に自動発動。長押しで詳細。</small>`;
    info.addEventListener('pointerdown', e => {
      e.stopPropagation();
      showStanceHelpFromUnit(unit);
    }, {once:true});
    sheetBody.appendChild(info);
  }

  function showStanceHelpFromUnit(unit){
    const resolved = guideFor(unit);
    if(!resolved) return;
    openSheet(`STANCE — ${unit.name}`, stanceHelpHtml(unit, resolved.guide));
    window.MLPlaytest?.event?.('stance_help_open', {unit:unit.id, stance:unit.stance, build:BUILD, source:'command_sheet'});
  }

  function bindLongPress(){
    let timer = null;
    let startX = 0;
    let startY = 0;
    let card = null;

    const cancel = () => {
      if(timer) clearTimeout(timer);
      timer = null;
      card = null;
    };

    document.addEventListener('pointerdown', e => {
      const target = e.target.closest('.unitTop, .stanceLock, .stanceHoldHint');
      const nextCard = target?.closest('.unit');
      if(!nextCard) return;
      startX = e.clientX;
      startY = e.clientY;
      card = nextCard;
      timer = setTimeout(() => {
        const active = card;
        timer = null;
        card = null;
        if(active) showStanceHelp(active);
      }, LONG_PRESS_MS);
    }, true);

    document.addEventListener('pointermove', e => {
      if(!timer) return;
      if(Math.abs(e.clientX - startX) > 10 || Math.abs(e.clientY - startY) > 10) cancel();
    }, true);
    document.addEventListener('pointerup', cancel, true);
    document.addEventListener('pointercancel', cancel, true);
    document.addEventListener('scroll', cancel, true);
  }

  function injectStyles(){
    if(document.getElementById('mlUxStyles')) return;
    const style = document.createElement('style');
    style.id = 'mlUxStyles';
    style.textContent = `
      .stanceHoldHint{margin-top:6px;padding:5px 7px;border:1px dashed rgba(229,191,109,.42);border-radius:8px;color:#d9c38b;font-size:8px;line-height:1.25;text-align:center;letter-spacing:.02em;user-select:none}
      .formalUnit.stance .stanceHoldHint,.unit.stance .stanceHoldHint{border-style:solid;background:rgba(229,191,109,.08);color:#f0d58d}
      .stanceSkillGuide{margin-top:9px;padding:10px 11px;border:1px solid rgba(229,191,109,.42);border-radius:12px;background:linear-gradient(145deg,rgba(229,191,109,.09),rgba(17,22,29,.92));cursor:help}
      .stanceSkillGuide>div{display:flex;align-items:center;justify-content:space-between;gap:8px}.stanceSkillGuide span{font-size:8px;color:#d9c27e;letter-spacing:.08em}.stanceSkillGuide b{font-size:12px;color:#f3dfaa}.stanceSkillGuide p{margin:6px 0 3px;font-size:10px;line-height:1.5;color:#d9dde3}.stanceSkillGuide small{font-size:8px;color:#939da9}
      .stanceHelpSheet{display:grid;gap:9px}.stanceHelpRule,.stanceHelpHero,.stanceHelpDetail,.stanceHelpExample{padding:11px 12px;border:1px solid #343c47;border-radius:13px;background:#11161d}.stanceHelpRule span,.stanceHelpHero>span{display:block;font-size:8px;letter-spacing:.1em;color:#d9c27e}.stanceHelpRule b{display:block;margin-top:4px;font-size:11px}.stanceHelpHero{border-color:rgba(229,191,109,.48);background:linear-gradient(145deg,rgba(229,191,109,.10),#11161d)}.stanceHelpHero h3{margin:4px 0;font-size:20px;color:#f2d68b}.stanceHelpHero p,.stanceHelpDetail{font-size:10px;line-height:1.65;color:#d1d6dd}.stanceHelpHero p{margin:0}.stanceHelpExample{display:grid;gap:5px}.stanceHelpExample b{font-size:10px;color:#f0d58d}.stanceHelpExample span{font-size:9px;color:#b8c0ca}
      body.mlFirstRun .nav{opacity:.22;pointer-events:none}body.mlFirstRun .storyBack{visibility:hidden}body.mlFirstRun #story .storyPrelude:after{content:'FIRST JOURNEY — 導入中';display:inline-block;margin-top:8px;padding:5px 8px;border:1px solid rgba(229,191,109,.48);border-radius:999px;color:#e7ca79;font-size:8px;letter-spacing:.08em}
      @media (prefers-reduced-motion:reduce){.stanceHoldHint,.stanceSkillGuide{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function bindFirstRunOnboarding(){
    const boot = document.getElementById('bootStart');
    const gate = document.getElementById('bootGate');
    if(!boot || !gate || !window.ML?.go) return;

    const initial = readSave();
    const fresh = !hasProgress(initial);
    const hint = gate.querySelector('.bootHint');
    if(fresh && hint) hint.textContent = 'CHAPTER 1 / FIRST JOURNEY — STORYから始まる';

    boot.onclick = async () => {
      try { await window.MLAudio?.enable?.(); } catch (_) {}
      gate.classList.add('dismissed');
      const current = readSave();
      const firstRun = !hasProgress(current);
      if(firstRun){
        document.body.classList.add('mlFirstRun');
        sessionStorage.setItem('mlFirstRunActive','1');
        window.ML.go('story');
      }else{
        document.body.classList.remove('mlFirstRun');
        sessionStorage.removeItem('mlFirstRunActive');
        window.ML.go('home');
      }
      window.MLPlaytest?.event?.('game_start', {entry:firstRun?'story':'home', progress:firstRun?'FIRST_JOURNEY':'RETURN', build:BUILD});
    };

    if(sessionStorage.getItem('mlFirstRunActive') === '1' && !readSave().storyComplete){
      document.body.classList.add('mlFirstRun');
    }

    const watcher = setInterval(() => {
      const s = readSave();
      if(s.storyComplete){
        document.body.classList.remove('mlFirstRun');
        sessionStorage.removeItem('mlFirstRunActive');
        clearInterval(watcher);
      }
    }, 300);
  }

  function initObservers(){
    const observer = new MutationObserver(() => {
      decorateUnits();
      augmentCommandSheet();
    });
    observer.observe(document.body, {subtree:true, childList:true});
    decorateUnits();
  }

  injectStyles();
  bindLongPress();
  bindFirstRunOnboarding();
  initObservers();
  window.ML_UX_BUILD = BUILD;
})();
