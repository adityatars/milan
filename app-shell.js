(function(){
  function getTopbar(){
    return document.getElementById('topbar');
  }

  function updateRouteUI(path){
    const onLogin = path === '/login';
    const topbar = getTopbar();
    const sidebar = document.getElementById('sidebar');
    if(topbar){
      topbar.classList.toggle('hidden', onLogin);
      topbar.classList.remove('topbar-hidden');
    }
    if(sidebar) sidebar.classList.toggle('hidden', onLogin);
  }

  window.AppShell = {
    updateRouteUI
  };
})();
