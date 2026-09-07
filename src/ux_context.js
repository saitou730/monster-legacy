(() => {
  'use strict';

  const HOLD_MS = 520;
  const HELP_HIDE_MS = 4200;
  let holdTimer = null;
  let holdTarget = null;
  let suppressClickUntil = 0;
  let helpHideTimer = null;

  const $ = id => document.getElementById(id);
  const q = sel => document.querySelector(sel);
  const qa = sel => [...document.querySelectorAll(sel)];

  function addStyles(){
    if ($('mlUxContextStyle')) return;
    const style = document.createElement('style');
    style.id = 'mlUxContextStyle';
    style.textContent = `
      .mlTechHelp{position:fixed;left:12px;right:12px;bottom:calc(88px + env(safe-area-inset-bottom));z-index:1200;display:none;max-width:520px;margin:auto;padding:14px 15px 15px;border:1px solid rgba(228,197,126,.72);border-radius:15px;background:linear-gradient(180deg,rgba(18,26,39,.98),rgba(7,11,18,.98));box-shadow:0 18px 50px rgba(0,0,0,.48);color:#f4f0e7;pointer-events:none;transform:translateY(8px);opacity:0;transition:.16s ease}
      .mlTechHelp.show{display:block;transform:translateY(0);opacity:1}
      .mlTechHelp .kicker{font-size:10px;letter-spacing:.16em;color:#d9b96f;font-weight:800;margin-bottom:5px}
      .mlTechHelp strong{display:block;font-size:17px;line-height:1.25;margin-bottom:5px}
      .mlTechHelp p{font-size:12px;line-height:1.65;margin:0;color:#d9dee8}
      .mlTechHelp .meta{display:block;margin-top:7px;font-size:10px;color:#9da9ba;letter-spacing:.05em}
      [data-ml-help]{-webkit-touch-callout:none;touch-action:manipulation}
      [data-ml-help].mlHoldArmed{outline:1px solid rgba(223,190,111,.55);outline-offset:2px}
      .stancePreview[data-ml-help]{cursor:help}
      .stancePreview[data-ml-help]::after,.stanceLock[data-ml-help]::after{content:'HOLD';display:inline-flex;margin-left:7px;padding:2px 5px;border:1px solid rgba(225,193,117,.38);border-radius:999px;font-size:8px;letter-spacing:.12em;color:#c9ae70;vertical-align:middle}

      .bootGate.mlPrologue{background:#080d14;overflow:hidden}
      .bootGate.mlPrologue .bootSky{opacity:.35;filter:saturate(.6) brightness(.7)}
      .bootGate.mlPrologue .bootFog{opacity:.75}
      .mlPrologueCard{position:relative;z-index:3;width:min(88vw,420px);margin:auto;padding:22px 20px 20px;border:1px solid rgba(216,185,112,.36);border-radius:20px;background:linear-gradient(180deg,rgba(18,25,36,.84),rgba(7,11,17,.92));box-shadow:0 26px 70px rgba(0,0,0,.52);text-align:left;animation:mlPrologueIn .42s ease both}
      .mlPrologueCard .eyebrow{font-size:10px;letter-spacing:.18em;color:#d7b875;font-weight:800}
      .mlPrologueCard h2{font-size:26px;line-height:1.25;margin:8px 0 10px;color:#f7f2e7}
      .mlPrologueCard p{font-size:13px;line-height:1.8;margin:0;color:#d5dbe4}
      .mlPrologueCard .sceneLine{margin-top:14px;padding:10px 11px;border-left:2px solid #d0ad60;background:rgba(255,255,255,.035);font-size:12px;line-height:1.65;color:#e8dfcb}
      .mlPrologueArt{display:grid;place-items:center;height:160px;margin:10px 0 4px;overflow:hidden;border-radius:14px;background:radial-gradient(circle at 50% 45%,rgba(112,137,169,.22),rgba(0,0,0,.05) 64%)}
      .mlPrologueArt img{width:180px;height:160px;object-fit:contain;filter:drop-shadow(0 16px 20px rgba(0,0,0,.46))}
      .mlPrologueActions{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:17px}
      .mlPrologueDots{display:flex;gap:6px}.mlPrologueDots i{display:block;width:18px;height:3px;border-radius:4px;background:rgba(255,255,255,.18)}.mlPrologueDots i.on{background:#d6b86e}
      .mlPrologueNext{min-height:46px;padding:0 18px;border:1px solid rgba(232,203,139,.72);border-radius:999px;background:linear-gradient(180deg,#d7bc78,#ad8b43);color:#16130c;font-weight:900;letter-spacing:.04em}
      .mlPrologueSkip{position:absolute;right:18px;top:calc(18px + env(safe-area-inset-top));z-index:5;border:0;background:none;color:#aeb7c3;font-size:11px;padding:8px}
      @keyframes mlPrologueIn{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:none}}
      @media (max-width:390px){.mlPrologueCard{padding:18px 16px 17px}.mlPrologueCard h2{font-size:23px}.mlPrologueArt{height:138px}.mlPrologueArt img{height:140px}}
    `;
    document.head.appendChild(style);
  }

  function ensureHelp(){
    let el = $('mlTechHelp');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'mlTechHelp';
    el.className = 'mlTechHelp';
    el.setAttribute('role','status');
    el.setAttribute('aria-live','polite');
    el.innerHTML = '<div class="kicker">TECHNIQUE / LONG PRESS</div><strong></strong><p></p><span class="meta">指を離すと操作へ戻ります</span>';
    document.body.appendChild(el);
    return el;
  }

  function showHelp(info){
    if (!info || !info.title) return;
    const el = ensureHelp();
    el.querySelector('strong').textContent = info.title;
    el.querySelector('p').textContent = info.body || '';
    el.classList.add('show');
    clearTimeout(helpHideTimer);
    helpHideTimer = setTimeout(() => el.classList.remove('show'), HELP_HIDE_MS);
    try { navigator.vibrate?.(12); } catch (_) {}
    try { window.MLPlaytest?.event?.('technique_help_open',{title:info.title,screen:q('.screen.show')?.id||'unknown'}); } catch (_) {}
  }

  function currentScreen(){ return q('.screen.show')?.id || 'home'; }
  function unitByText(text=''){
    const units = Object.values(window.ML_DATA?.units || {});
    return units.find(u => text.includes(u.name)) || null;
  }
  function equipmentByText(text=''){
    const list = Object.values(window.ML_DATA?.equipment || {});
    return list.find(x => text.includes(x.name) || text.includes(x.action)) || null;
  }
  function unitFromElement(el){
    const card = el.closest('.unit,.rosterCard,.loadoutUnitHead,.formationSlot');
    return unitByText(card?.textContent || el.closest('.panel')?.textContent || el.textContent || '');
  }

  function coreHelp(u){
    if (!u) return null;
    return {title:`CORE「${u.core}」`,body:`主攻撃。${u.coreDmg}ダメージを与え、敵VOLTAGEを+${u.coreVol}する。火力だけでなく、次のVOLTAGE帯へ入るかを見て選ぶ。`};
  }
  function roleHelp(u){
    if (!u) return null;
    const body = {
      guard:'防御型ROLE。次の敵攻撃に備えてGUARD状態を作る。NEXTが単体大技・全体攻撃のターンで価値が高い。',
      evade:'回避型ROLE。次の単体NEXTを回避するための準備。敵のTARGETと行動タイプを読んで使う。',
      evadePlus:'強化回避ROLE。次の単体NEXTを回避し、炎翼リザルが回避に成功した場合は敵VOLTAGEも下げる。',
      calm:'制御型ROLE。敵VOLTAGEを-12。RAGE/DANGERへ入れたくない戦いで、火力より帯域管理を優先する。'
    }[u.roleType] || '固有ROLE。NEXTとVOLTAGEを見て、COREとは違う目的で使う。';
    return {title:`ROLE「${u.role}」`,body};
  }
  function equipmentHelp(eq){
    if (!eq) return null;
    const extra = eq.type === 'damage' ? ` ダメージ${eq.dmg}${Number.isFinite(eq.vol)?` / VOL+${eq.vol}`:''}。`
      : eq.type === 'calm' ? ` VOL-${eq.volDown} / HEAL ${eq.heal}。`
      : eq.type === 'evade' ? ' 単体NEXTへの回避準備。'
      : eq.type === 'guard' ? ' GUARD準備。'
      : eq.type === 'reflect' ? ' GUARDしながら一部を反射。' : '';
    return {title:`EQUIPMENT「${eq.name}」`,body:`3つ目のCOMMAND候補。${eq.desc}${extra}CORE/ROLEと役割が重ならないように持ち込む。`};
  }
  function stanceHelp(u){
    if (!u) return {title:'STANCE',body:'毎ターン2体をCOMMANDに選ぶと、選ばなかった1体が自動でSTANCEになる。3体目も「何もしない」のではなく、残す判断として扱う。'};
    const screen=currentScreen();
    if(screen==='hunt'){
      return {title:`STANCE「${u.stance}」`,body:`${u.name}をCOMMANDに選ばず、3体目として残す選択。HUNTでは共鳴条件を作る2 COMMANDを優先し、残り1体をSTANCE枠に回す。`};
    }
    const body = {
      goura:'未選択時に防御STANCEへ入り、BOSS/TESTではGUARDとして敵の攻撃を受ける。重いNEXTを他2体のCOMMANDと両立したいターンに有効。',
      leaf:'未選択時に回復STANCEへ入り、BOSS/TESTでは自身を小回復する。攻撃やVOLTAGE操作を別2体に任せたいターンに有効。',
      flame:'炎翼リザルをCOMMANDに選ばず、滑空姿勢で場に残す。敵NEXTへの対応を別2体に任せるターンで使うSTANCE枠。',
      fire:'火トカゲをCOMMANDに選ばず、火溜めの構えで残す。2 COMMANDを防御・制御へ回したいターンの選択。',
      wind:'風コウモリをCOMMANDに選ばず、滑空姿勢で残す。2 COMMANDを他の役割へ回したいターンの選択。'
    }[u.id] || '選ばなかった1体として場を支えるSTANCE。';
    return {title:`STANCE「${u.stance}」`,body};
  }

  function infoFor(el){
    const explicit = el.dataset.mlHelpType;
    const text = (el.textContent || '').replace(/\s+/g,' ').trim();
    const u = unitFromElement(el) || unitByText(text);
    if (explicit === 'stance' || el.classList.contains('stanceLock') || el.classList.contains('stancePreview') || el.closest('.unit.stance')) return stanceHelp(u || unitByText(el.closest('.panel')?.textContent||''));

    const strong = el.querySelector('b,strong')?.textContent?.trim() || text;
    if (/^CORE\b/.test(strong) || (u && strong.includes(u.core))) return coreHelp(u);
    if (/^ROLE\b/.test(strong) || (u && strong.includes(u.role))) return roleHelp(u);
    const eq = equipmentByText(text);
    if (/^EQUIPMENT\b/.test(strong) || eq) return equipmentHelp(eq);
    return null;
  }

  function decorate(root=document){
    const candidates = [
      ...root.querySelectorAll?.('#sheetBody .skill,.commandTile,.stanceLock,.stancePreview,.unit.stance .btn') || []
    ];
    candidates.forEach(el => {
      if (el.dataset.mlHelp) return;
      const info = infoFor(el);
      if (!info) return;
      el.dataset.mlHelp = '1';
      if (el.classList.contains('stanceLock') || el.classList.contains('stancePreview') || el.closest('.unit.stance')) el.dataset.mlHelpType='stance';
      el.setAttribute('title','長押しで詳細');
    });
  }

  function clearHold(){
    clearTimeout(holdTimer);
    holdTimer = null;
    holdTarget?.classList.remove('mlHoldArmed');
    holdTarget = null;
  }

  function bindLongPress(){
    document.addEventListener('pointerdown', e => {
      const target = e.target.closest?.('[data-ml-help]');
      if (!target) return;
      clearHold();
      holdTarget = target;
      target.classList.add('mlHoldArmed');
      holdTimer = setTimeout(() => {
        const info = infoFor(target);
        if (info){
          suppressClickUntil = Date.now() + 650;
          showHelp(info);
        }
        clearHold();
      }, HOLD_MS);
    }, true);
    ['pointerup','pointercancel','pointerleave'].forEach(type => document.addEventListener(type, clearHold, true));
    document.addEventListener('click', e => {
      if (Date.now() < suppressClickUntil && e.target.closest?.('[data-ml-help]')){
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, true);
  }

  const prologue = [
    {
      eyebrow:'CHAPTER 1 / BEFORE THE GROVE',
      title:'森の外れで、残響が騒ぎ始めた。',
      body:'獣の力は、倒した数ではなく「どう戦ったか」という残響として残る。森の奥で、その残響が乱れている。',
      line:'集落から森へ向かう道。いつもの獣の声に、ひとつだけ違う羽音が混じっていた。'
    },
    {
      eyebrow:'FIRST ENCOUNTER',
      title:'風コウモリは、逃げなかった。',
      body:'こちらを襲うでも、逃げるでもない。まるで「どう動くのか」を見ている。力で押し切れば、この出会いは終わる。',
      line:'倒すのではなく、相手の行動を読み、戦い方を理解する。それがRESONATEへの最初の条件。',
      art:true
    },
    {
      eyebrow:'THE FIRST RULE',
      title:'3体いても、動かすのは2体。',
      body:'敵のNEXTを読む。2体にCOMMANDを出す。残った1体はSTANCEとして場に残る。まずはこの判断を身につけて、もう一度あの風コウモリに会いに行く。',
      line:'STORYで基本を掴む → HUNTで風コウモリとRESONATEする。',
      art:true
    }
  ];

  function freshProgress(){
    try{
      const s=window.MLStorage?.load?.();
      if(!s) return false;
      return !s.storyComplete && Number(s.storyStep||0)===0 && !s.joinedBat && !s.fused && !s.testComplete && !Object.values(s.clears||{}).some(Boolean);
    }catch(_){ return false; }
  }

  function renderPrologue(step){
    const gate=$('bootGate'); if(!gate) return;
    const item=prologue[step];
    gate.classList.add('mlPrologue');
    const content=gate.querySelector('.bootContent');
    if(!content) return;
    content.innerHTML=`<div class="mlPrologueCard">
      <div class="eyebrow">${item.eyebrow}</div>
      <h2>${item.title}</h2>
      ${item.art?'<div class="mlPrologueArt"><img src="assets/battle/wind_bat/idle.png" alt="風コウモリ"></div>':''}
      <p>${item.body}</p>
      <div class="sceneLine">${item.line}</div>
      <div class="mlPrologueActions"><div class="mlPrologueDots">${prologue.map((_,i)=>`<i class="${i===step?'on':''}"></i>`).join('')}</div><button class="mlPrologueNext" type="button">${step===prologue.length-1?'STORYへ':'次へ'}</button></div>
    </div>`;
    content.querySelector('.mlPrologueNext').onclick = () => {
      try{ window.MLPlaytest?.event?.('prologue_step',{step:step+1}); }catch(_){}
      if(step < prologue.length-1) renderPrologue(step+1); else finishPrologue();
    };
    let skip=gate.querySelector('.mlPrologueSkip');
    if(!skip){ skip=document.createElement('button'); skip.className='mlPrologueSkip'; skip.type='button'; skip.textContent='SKIP'; skip.onclick=finishPrologue; gate.appendChild(skip); }
  }

  function finishPrologue(){
    const gate=$('bootGate');
    gate?.classList.add('dismissed');
    gate?.classList.remove('mlPrologue');
    gate?.querySelector('.mlPrologueSkip')?.remove();
    try{ window.MLPlaytest?.event?.('prologue_complete',{entry:'story'}); }catch(_){}
    if(window.ML?.go) window.ML.go('story');
  }

  function bindPrologue(){
    const start=$('bootStart');
    if(!start || start.dataset.mlPrologueBound) return;
    start.dataset.mlPrologueBound='1';
    start.addEventListener('click', e => {
      if(!freshProgress()) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      try{
        const p=window.MLAudio?.enable?.();
        Promise.resolve(p).then(on=>{const b=$('musicBtn');if(b&&on)b.textContent='♫ SOUND ON';}).catch(()=>{});
      }catch(_){}
      try{ window.MLPlaytest?.event?.('prologue_start',{entry:'first_run'}); }catch(_){}
      renderPrologue(0);
    }, true);
  }

  function addStoryNarrative(){
    const beat=$('storyBeat');
    if(!beat || beat.dataset.mlNarrative) return;
    beat.dataset.mlNarrative='1';
    const step = Number(window.MLStorage?.load?.()?.storyStep || 0);
    const lines=[
      '森へ入る前、古い狩人の記録が示したのは一つだけだった。「先に敵を見る」。',
      '風コウモリを傷つけず追うには、三体すべてを動かす必要はない。選ぶことが戦術になる。',
      '動かなかった一体も、戦列から消えるわけではない。残す判断には意味がある。',
      '熱が上がれば敵も変わる。攻めるほど危険になる数字を、味方にする。',
      '森へ持ち込めるのは身体だけではない。道具もまた、一手として戦い方を変える。',
      '準備は終わった。森の奥には、風コウモリだけではない巨大な残響が待っている。'
    ];
    if(lines[step]){
      const n=document.createElement('small');
      n.className='mlStoryNarrative';
      n.style.cssText='display:block;margin-top:7px;color:#c8d0dc;line-height:1.6;font-size:11px';
      n.textContent=lines[step];
      beat.appendChild(n);
    }
  }

  function init(){
    addStyles();
    ensureHelp();
    bindLongPress();
    bindPrologue();
    decorate();
    addStoryNarrative();
    const observer=new MutationObserver(muts=>{
      muts.forEach(m=>m.addedNodes.forEach(n=>{ if(n.nodeType===1){ decorate(n); if(n.id==='storyBeat'||n.querySelector?.('#storyBeat')) addStoryNarrative(); } }));
      decorate();
      if(currentScreen()==='story') addStoryNarrative();
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
