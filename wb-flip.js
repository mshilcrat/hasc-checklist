/* wb-flip.js — TESTING-ONLY admin<->RM preview toggle. View only; never writes DB. */
(function(){
  'use strict';
  var KEY_PREVIEW='hasc_preview';
  var KEY_REAL='hasc_real_role';
  var KEY_ROLE='hasc_role';

  function previewing(){ return sessionStorage.getItem(KEY_PREVIEW)==='rm'; }

  /* While previewing, force RM role for display and blank __rmEmail so the
     checkoff home filter is skipped -> ALL homes + all tasks load. */
  function applyPreview(){
    if(!previewing()) return;
    try{ sessionStorage.setItem(KEY_ROLE,'residence_manager'); }catch(e){}
    try{
      Object.defineProperty(window,'__rmEmail',{configurable:true,enumerable:true,
        get:function(){ return ''; },
        set:function(v){ /* ignore real-session overwrite while previewing */ }});
    }catch(e){ window.__rmEmail=''; }
    /* keep __rmRole non-RM so the email filter never runs (defensive) */
    window.__rmRole='admin';
  }
  applyPreview();
  var n=0, iv=setInterval(function(){ applyPreview(); if(++n>20) clearInterval(iv); },250);

  function flipToRM(){
    var real=sessionStorage.getItem(KEY_ROLE)||'admin';
    sessionStorage.setItem(KEY_REAL,real);
    sessionStorage.setItem(KEY_PREVIEW,'rm');
    sessionStorage.setItem(KEY_ROLE,'residence_manager');
    location.href='wb-checkoff.html';
  }
  function flipToAdmin(){
    var real=sessionStorage.getItem(KEY_REAL)||'admin';
    sessionStorage.removeItem(KEY_PREVIEW);
    sessionStorage.removeItem(KEY_REAL);
    sessionStorage.setItem(KEY_ROLE,real);
    location.href='wb-today.html';
  }

  function wire(){
    var els=document.querySelectorAll('.av, #nav-avatar, .nav-avatar');
    for(var i=0;i<els.length;i++){
      var el=els[i];
      if(el.getAttribute('data-flip-wired')==='1') continue;
      el.setAttribute('data-flip-wired','1');
      el.style.cursor='pointer';
      if(previewing()) el.style.outline='1.6px solid #F5C518';
      el.addEventListener('click',function(ev){ ev.preventDefault(); ev.stopPropagation();
        if(previewing()) flipToAdmin(); else flipToRM(); });
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',wire); else wire();
  var m=0, wi=setInterval(function(){ wire(); if(++m>20) clearInterval(wi); },300);
})();
