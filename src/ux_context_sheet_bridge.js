(() => {
  'use strict';

  function decorate(root=document){
    const buttons=[...root.querySelectorAll?.('#sheetBody [data-uid]') || []];
    buttons.forEach(button=>{
      if(button.querySelector('.mlUxUnitBridge')) return;
      const uid=button.dataset.uid;
      const unit=window.ML_DATA?.units?.[uid];
      if(!unit) return;
      const bridge=document.createElement('span');
      bridge.className='mlUxUnitBridge';
      bridge.textContent=unit.name;
      bridge.setAttribute('aria-hidden','true');
      bridge.style.display='none';
      button.appendChild(bridge);
    });
  }

  function init(){
    decorate();
    const observer=new MutationObserver(()=>decorate());
    observer.observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
