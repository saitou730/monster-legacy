// Long press is optional; visible info buttons and keyboard activation expose the same text.
(()=>{
  let timer=null,origin=null,suppressClick=false;
  const clear=()=>{clearTimeout(timer);timer=null;};
  const read=el=>el.dataset.helpUnit?{uid:el.dataset.helpUnit,kind:el.dataset.helpKind,context:el.dataset.helpContext||'boss'}:
    {uid:el.dataset.uid,kind:el.dataset.kind,context:el.dataset.sheetAction==='pickHunt'?'hunt':el.dataset.sheetAction==='pickTest'?'test':'boss'};
  const show=el=>{const d=read(el);ML.skillHelp(d.uid,d.kind,d.context);};
  document.addEventListener('pointerdown',e=>{
    clear();suppressClick=false;
    const el=e.target.closest('[data-help-unit],[data-sheet-action]');
    if(!el||e.button!==0)return;
    origin={x:e.clientX,y:e.clientY};
    timer=setTimeout(()=>{timer=null;suppressClick=true;show(el);},500);
  });
  document.addEventListener('pointermove',e=>{if(origin&&Math.hypot(e.clientX-origin.x,e.clientY-origin.y)>10)clear();});
  document.addEventListener('pointerup',clear);
  document.addEventListener('pointercancel',()=>{clear();origin=null;});
  document.addEventListener('scroll',clear,true);
  document.addEventListener('click',e=>{
    if(suppressClick){suppressClick=false;e.preventDefault();e.stopImmediatePropagation();return;}
    const el=e.target.closest('.skillInfo');
    if(el){e.preventDefault();e.stopImmediatePropagation();show(el);}
  },true);
  document.addEventListener('contextmenu',e=>{if(e.target.closest('[data-help-unit],[data-sheet-action]'))e.preventDefault();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')ML.closeSkillHelp();});
})();
