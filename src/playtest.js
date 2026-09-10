window.MLPlaytest = (() => {
  const KEY = 'monsterLegacyPlaytestV070';
  const VERSION = '0.7.0';
  const cap = 500;
  const safeGet = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) { return null; } };
  const safeSet = v => { try { localStorage.setItem(KEY, JSON.stringify(v)); return true; } catch (_) { return false; } };
  const uid = () => `pt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  const now = () => Date.now();
  const fresh = () => ({
    schema:1, build:VERSION, sessionId:uid(), startedAt:now(), endedAt:null,
    events:[], first:{}, counters:{commandChanges:0, bossExecutes:0, bossReplays:0},
    survey:null, submitted:false, flags:{}, source:'standard'
  });
  let session = safeGet();
  if (!session || session.build !== VERSION) session = fresh();

  function persist(){ safeSet(session); }
  function ensure(){ if(!session){ session=fresh(); persist(); } return session; }
  function event(type, data={}){
    ensure();
    const t=now();
    session.events.push({type,t,msFromStart:t-session.startedAt,...data});
    if(session.events.length>cap) session.events=session.events.slice(-cap);
    if(session.first[type] == null) session.first[type]=t-session.startedAt;
    persist();
  }
  function inc(key, amount=1){ ensure(); session.counters[key]=(session.counters[key]||0)+amount; persist(); }
  function restart(source='manual'){ session=fresh(); session.source=source; event('session_start',{source}); return session; }
  function query(){ try{return new URLSearchParams(location.search);}catch(_){return new URLSearchParams();} }
  function testerMode(){ return query().get('tester')==='1'; }
  function startTesterMode(){
    if(!testerMode()) return false;
    ensure();
    if(!session.flags) session.flags={};
    if(!session.flags.testerModeStarted){
      restart('external_tester_kit');
      session.flags.testerModeStarted=true;
      session.source='external_tester_kit';
      persist();
      event('tester_mode_start',{build:VERSION});
    }
    let ribbon=document.getElementById('testerModeRibbon');
    if(!ribbon){
      ribbon=document.createElement('div');
      ribbon.id='testerModeRibbon';
      ribbon.className='testerModeRibbon';
      ribbon.innerHTML='<b>FIRST-TIME PLAYTEST</b><span>STORYから開始。答えを調べず、そのまま感じた通りに遊んでください。</span>';
      document.body.appendChild(ribbon);
    }
    setTimeout(()=>{ if(window.ML&&typeof ML.go==='function') ML.go('story'); },40);
    return true;
  }
  function elapsed(){ return Math.max(0,(session.endedAt||now())-session.startedAt); }
  function metrics(){
    const ev=type=>session.events.filter(x=>x.type===type);
    const survey=session.survey||{};
    const correct=[survey.qNext==='turn_start',survey.qCommands==='2',survey.qStance==='stance',survey.qVoltage==='legacy'].filter(Boolean).length;
    return {
      sessionId:session.sessionId,
      build:session.build,
      elapsedMs:elapsed(),
      chapterSteps:ev('story_step_complete').length,
      firstBossMs:session.first.boss_open ?? null,
      firstTwoCommandsMs:session.first.two_commands_locked ?? null,
      bossExecutes:session.counters.bossExecutes||0,
      commandChanges:session.counters.commandChanges||0,
      bossReplays:session.counters.bossReplays||0,
      bossClears:ev('boss_clear').length,
      masteryClears:ev('boss_clear').filter(x=>x.mastery).length,
      comprehensionCorrect:survey ? correct : null,
      comprehensionTotal:survey ? 4 : null,
      replayIntent:survey.replayIntent ? Number(survey.replayIntent) : null,
      clarity:survey.clarity ? Number(survey.clarity) : null,
      submitted:!!session.submitted
    };
  }
  function survey(values){
    session.survey={...values,answeredAt:now()};
    session.submitted=true;
    session.endedAt=now();
    event('survey_submit',{
      comprehension:metrics().comprehensionCorrect,
      replayIntent:Number(values.replayIntent||0),clarity:Number(values.clarity||0)
    });
    renderHomeSummary();
  }
  function json(){ return JSON.stringify({session,metrics:metrics()},null,2); }
  function download(){
    const blob=new Blob([json()],{type:'application/json'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a');
    a.href=url; a.download=`MONSTER_LEGACY_PLAYTEST_${session.sessionId}.json`; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function summaryText(){
    const m=metrics();
    const score=m.comprehensionCorrect==null?'未回答':`${m.comprehensionCorrect}/4`;
    return `Build ${m.build} / 理解度 ${score} / Replay ${m.replayIntent??'-'}/5 / Clarity ${m.clarity??'-'}/5 / Boss turns ${m.bossExecutes}`;
  }
  function renderHomeSummary(){
    const el=document.getElementById('playtestSummary');
    if(el) el.textContent=summaryText();
    const btn=document.getElementById('playtestSurveyBtn');
    if(btn){ btn.textContent=session.submitted?'回答済み':'感触を記録'; btn.disabled=!!session.submitted; }
  }
  let surveyReturnFocus=null;
  function showSurvey(){
    const modal=document.getElementById('playtestModal');
    if(!modal || session.submitted) return;
    surveyReturnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
    modal.classList.add('show'); modal.setAttribute('aria-hidden','false');
    requestAnimationFrame(()=>document.getElementById('playtestClose')?.focus({preventScroll:true}));
  }
  function hideSurvey(){
    const modal=document.getElementById('playtestModal');
    if(modal){modal.classList.remove('show');modal.setAttribute('aria-hidden','true');}
    const target=surveyReturnFocus; surveyReturnFocus=null;
    if(target?.isConnected) requestAnimationFrame(()=>target.focus({preventScroll:true}));
  }
  function bind(){
    const start=document.getElementById('playtestStartBtn');
    if(start) start.addEventListener('click',()=>{restart('manual'); renderHomeSummary(); event('playtest_ready');});
    const exportBtn=document.getElementById('playtestExportBtn'); if(exportBtn) exportBtn.addEventListener('click',download);
    const surveyBtn=document.getElementById('playtestSurveyBtn'); if(surveyBtn) surveyBtn.addEventListener('click',showSurvey);
    const close=document.getElementById('playtestClose'); if(close) close.addEventListener('click',hideSurvey);
    const modal=document.getElementById('playtestModal');
    if(modal) modal.addEventListener('click',e=>{ if(e.target===modal) hideSurvey(); });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') hideSurvey(); });
    const form=document.getElementById('playtestForm');
    if(form) form.addEventListener('submit',e=>{
      e.preventDefault(); const fd=new FormData(form); const v=Object.fromEntries(fd.entries());
      if(!v.qNext||!v.qCommands||!v.qStance||!v.qVoltage||!v.replayIntent||!v.clarity){
        const msg=document.getElementById('playtestFormMsg'); if(msg) msg.textContent='全項目を回答してください。'; return;
      }
      survey(v); const msg=document.getElementById('playtestFormMsg'); if(msg) msg.textContent='記録しました。結果JSONをEXPORTできます。';
      setTimeout(hideSurvey,700);
    });
    renderHomeSummary();
    startTesterMode();
  }
  if(!session.events.length) event('session_start',{source:'load'});
  return {event,inc,restart,metrics,survey,download,summaryText,renderHomeSummary,showSurvey,hideSurvey,bind,testerMode,startTesterMode,json};
})();
