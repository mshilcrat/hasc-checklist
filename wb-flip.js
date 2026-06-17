/* wb-flip.js — TESTING-ONLY admin<->RM preview toggle. View only; never writes DB. */
(function(){
  'use strict';
  var PREVIEW_EMAIL='ykluger@hasccenter.org';
  var KEY_PREVIEW='hasc_preview';
  var KEY_REAL='hasc_real_role';
  var KEY_ROLE='hasc_role';
  var KEY_PEMAIL='hasc_preview_email';

  function previewing(){ return sessionStorage.getItem(KEY_PREVIEW)==='rm'; }

  /* When previewing, force the RM email + role so checkoff loads that RM's homes. */
  function applyPreview(){
    if(!previewing()) return;
    try{ sessionStorage.setItem(KEY_ROLE,'residence_manager'); }catch(e){}
    var em=sessionStorage.getItem(KEY_PEMAIL)||PREVIEW_EMAIL;
    try{
      Object.defineProperty(window,'__rmEmail',{configurable:true,enumerable:true,
        get:function(){ return em; },
        set:function(v){ /* ignore real-session overwrite while previewing */ }});
    }catch(e){ window.__rmEmail=em; }
    window.__rmRole='residence_manager';
  }
  applyPreview();
  /* Re-assert for a few seconds to beat async session boot. */
  var n=0, iv=setInterval(function(){ applyPreview(); if(++n>20) clearInterval(iv); },250);

  function flipToRM(){
    var real=sessionStorage.getItem(KEY_ROLE)||'admin';
    sessionStorage.setItem(KEY_REAL,real);
    sessionStorage.setItem(KEY_PREVIEW,'rm');
    sessionStorage.setItem(KEY_ROLE,'residence_manager');
    sessionStorage.setItem(KEY_PEMAIL,PREVIEW_EMAIL);
    location.href='wb-checkoff.html';
  }
  function flipToAdmin(){
    var real=sessionStorage.getItem(KEY_REAL)||'admin';
    sessionStorage.removeItem(KEY_PREVIEW);
    sessionStorage.removeItem(KEY_REAL);
    sessionStorage.removeItem(KEY_PEMAIL);
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
  /* Avatar may render late (checkoff builds header via JS) — re-wire for a bit. */
  var m=0, wi=setInterval(function(){ wire(); if(++m>20) clearInterval(wi); },300);
})();
