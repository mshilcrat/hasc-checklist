(function(){
  if(!window.supabase || !window.HASC_CONFIG) return;
  var sb = window.supabase.createClient(window.HASC_CONFIG.SUPABASE_URL, window.HASC_CONFIG.SUPABASE_ANON_KEY);
  window.__hascClient = sb;
  sb.auth.getSession().then(function(res){
    var session = res && res.data ? res.data.session : null;
    if(!session){ location.replace("wb-login.html"); return; }
    var uid = session.user.id;
    return sb.from("profiles").select("role,residences").eq("id", uid).single().then(function(p){
      var row = p && p.data ? p.data : {};
      var role = row.role || "";
      sessionStorage.setItem("hasc_role", role);
      sessionStorage.setItem("hasc_homes", JSON.stringify(row.residences || []));
      var path = location.pathname;
      var adminPages = ["wb-hub-mark2.html","wb-today-mark2.html","wb-insights-mark2.html","wb-documents-mark2.html","wb-checklists-mark2.html","wb-inbox-mark2.html"];
      if(role === "admin"){
        var allowed = adminPages.some(function(pg){ return path.indexOf(pg) !== -1; });
        if(!allowed){ location.replace("wb-hub-mark2.html"); }
      } else {
        if(path.indexOf("wb-checkoff.html") === -1){ location.replace("wb-checkoff.html"); }
      }
    });
  }).catch(function(){ location.replace("wb-login.html"); });
})();
