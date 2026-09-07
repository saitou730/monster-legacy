/* Presentation only: never selects commands, advances Chapter 1 or writes saves. */
(() => {
  'use strict';
  const topics = {
    next: ['NEXT', '敵の次の行動を読む', '敵の次の行動は、ターン開始時に固定されます。コマンドを選び直しても、この予告は変わりません。', '攻撃の対象と内容を見てから、動かす2体を選びましょう。'],
    command: ['2 COMMAND', '動かすのは2体', '3体のうち2体に行動を指示します。残る1体は、そのターンのSTANCEを担当します。', '誰を動かすかと、誰を支えに残すかをセットで考えましょう。'],
    stance: ['STANCE', '選ばなかった1体が支える', '2 COMMANDで選ばなかった1体がSTANCEを担当します。3つ目のコマンドを使って選ぶものではありません。', 'どの効果が発動するかはモンスターごとに異なります。行動する2体を変えると、STANCEの担当も変わります。'],
    resonate: ['RESONATE', '倒さずに仲間にする', '単体攻撃を回避し、相手のHPを35%以下にし、VOLTAGEをRAGE未満に保つと共鳴条件を満たします。', 'RESONATEは1 COMMANDを使い、条件を満たせば確定で成功します。']
  };
  const scenes = {
    P02_FIRST_BATTLE: ['next', 'command', 'stance'],
    P03_BOAR_FIRST_ENCOUNTER: ['next', 'stance'],
    P07_HUNT_WIND_BAT: ['next', 'resonate'],
    P12_NEW_SPECIES_TEST: ['command', 'stance'],
    P17_BOAR_MASTERY: ['next', 'stance']
  };
  const host = document.querySelector('.phone');
  const view = document.querySelector('#view');
  const state = document.querySelector('#state');
  if (!host || !view || !state) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'battle-help-dialog';
  dialog.setAttribute('aria-labelledby', 'battle-help-title');
  dialog.innerHTML = '<div class="battle-help-content"><p class="battle-help-label"></p><h2 id="battle-help-title"></h2><p class="battle-help-body"></p><p class="battle-help-tip"></p><button type="button" class="battle-help-close">閉じる</button></div>';
  host.append(dialog);
  let origin = null;
  let timer = null;
  let press = null;
  let consumed = null;
  const close = () => dialog.close();
  dialog.querySelector('.battle-help-close').addEventListener('click', close);
  dialog.addEventListener('click', event => {
    const r = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) close();
  });
  dialog.addEventListener('close', () => {
    if (origin?.isConnected) origin.focus({ preventScroll: true });
  });
  function open(button) {
    const data = topics[button.dataset.battleHelp];
    if (!data || dialog.open) return;
    origin = button;
    ['.battle-help-label', '#battle-help-title', '.battle-help-body', '.battle-help-tip'].forEach((selector, i) => {
      dialog.querySelector(selector).textContent = data[i];
    });
    dialog.showModal();
    dialog.querySelector('.battle-help-close').focus({ preventScroll: true });
  }
  function cancelPress() { clearTimeout(timer); timer = null; press = null; }
  document.addEventListener('pointerdown', event => {
    cancelPress(); consumed = null;
    const button = event.target.closest('[data-battle-help]');
    if (!button || !event.isPrimary || event.button !== 0) return;
    press = { id: event.pointerId, x: event.clientX, y: event.clientY, button };
    timer = setTimeout(() => {
      consumed = button;
      cancelPress();
      open(button);
    }, 500);
  });
  document.addEventListener('pointermove', event => {
    if (press && event.pointerId === press.id && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 10) {
      consumed = press.button;
      cancelPress();
    }
  });
  document.addEventListener('pointerup', cancelPress);
  document.addEventListener('pointercancel', () => { if (press) consumed = press.button; cancelPress(); });
  document.addEventListener('scroll', () => { if (press) consumed = press.button; cancelPress(); }, true);
  window.addEventListener('blur', cancelPress);
  document.addEventListener('visibilitychange', cancelPress);
  document.addEventListener('contextmenu', event => {
    if (event.target.closest('[data-battle-help]')) event.preventDefault();
  });
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-battle-help]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    if (consumed === button && event.detail !== 0) { consumed = null; return; }
    consumed = null;
    open(button);
  }, true);
  function mount() {
    cancelPress();
    if (dialog.open) close();
    view.querySelector('.battle-context')?.remove();
    const keys = scenes[state.textContent];
    if (!keys) return;
    const section = document.createElement('section');
    section.className = 'battle-context';
    section.setAttribute('aria-label', '戦闘のヒント');
    const hint = document.createElement('p');
    hint.textContent = 'タップ・長押しで確認';
    section.append(hint);
    const row = document.createElement('div');
    row.className = 'battle-context-actions';
    keys.forEach(key => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.battleHelp = key;
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-label', `${topics[key][0]}の説明`);
      button.textContent = `${topics[key][0]} ？`;
      row.append(button);
    });
    section.append(row);
    view.prepend(section);
  }
  new MutationObserver(mount).observe(state, { childList: true, characterData: true, subtree: true });
  mount();
})();
