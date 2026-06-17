/* wb-guard.js — single shared login guard for the admin side.
   Requires Supabase JS + wb-config.js loaded before this file. */
(function(){
  try{
    if(!window.supabase || !window.HASC_CONFIG){ return; }
    var sb = window.supabase.createClient(window.HASC_CONFIG.SUPABASE_URL, window.HASC_CONFIG.SUPABASE_ANON_KEY);
    window.__hascClient = sb;
    sb.auth.getSession().then(function(res){
      var session = res && res.data && res.data.session;
      if(!session){ location.replace("wb-login.html"); return; }
      try{
        var uid = session.user.id;
        sb.from("profiles").select("role,residences").eq("id", uid).single().then(function(p){
          if(p && p.data){
            try{
              sessionStorage.setItem("hasc_role", p.data.role || "");
              sessionStorage.setItem("hasc_homes", JSON.stringify(p.data.residences || []));
            }catch(e){}
          }
        });
      }catch(e){}
    }).catch(function(){ location.replace("wb-login.html"); });
  }catch(e){ /* fail open is unsafe; redirect to login */ location.replace("wb-login.html"); }
})();
