/* wb-flip.js - invisible RM/Admin preview toggle (testing only, no DB changes) */
(function(){
  var PREVIEW_KEY="hasc_preview";
  var REAL_ROLE_KEY="hasc_real_role";

  function previewing(){ return sessionStorage.getItem(PREVIEW_KEY)==="rm"; }

  function enforce(){
    if(previewing()){
      if(sessionStorage.getItem(REAL_ROLE_KEY)===null){
        sessionStorage.setItem(REAL_ROLE_KEY, sessionStorage.getItem("hasc_role")||"admin");
      }
      if(sessionStorage.getItem("hasc_role")!=="residence_manager"){
        sessionStorage.setItem("hasc_role","residence_manager");
      }
    }
  }
  enforce();
  var t=setInterval(enforce, 250);
  setTimeout(function(){clearInterval(t);}, 4000);

  function flipToRM(){
    sessionStorage.setItem(REAL_ROLE_KEY, sessionStorage.getItem("hasc_role")||"admin");
    sessionStorage.setItem(PREVIEW_KEY,"rm");
    sessionStorage.setItem("hasc_role","residence_manager");
    location.href="wb-checkoff.html";
  }
  function flipToAdmin(){
    var real=sessionStorage.getItem(REAL_ROLE_KEY)||"admin";
    sessionStorage.removeItem(PREVIEW_KEY);
    sessionStorage.removeItem(REAL_ROLE_KEY);
    sessionStorage.setItem("hasc_role", real);
    location.href="wb-today.html";
  }

  function wire(){
    var av=document.querySelector(".av, #nav-avatar, .nav-avatar");
    if(!av){ return false; }
    if(av.dataset.flipWired){ return true; }
    av.dataset.flipWired="1";
    av.addEventListener("click", function(e){
      e.preventDefault(); e.stopPropagation();
      if(previewing()){ flipToAdmin(); } else { flipToRM(); }
    });
    if(previewing()){ av.style.outline="2px solid #F5C518"; av.style.outlineOffset="1px"; }
    return true;
  }

  if(!wire()){
    var w=setInterval(function(){ if(wire()){ clearInterval(w); } }, 200);
    setTimeout(function(){ clearInterval(w); }, 6000);
  }
})();
