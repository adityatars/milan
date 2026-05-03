// HIVI.gaming — SPA Router
(function(){

const routes = {};
let currentPage = null;

function register(path, handler){
  routes[path] = handler;
}

function navigate(path){
  window.location.hash = path;
}

function getHash(){
  return window.location.hash.slice(1) || '/home';
}

async function resolve(){
  await Auth.authReady;
  const path = getHash();
  const route = routes[path];

  // Route guards
  if((path === '/game' || path === '/admin') && !Auth.isAuthenticated()){
    navigate('/login');
    return;
  }
  if(path === '/admin' && !Auth.isAdmin()){
    navigate('/home');
    return;
  }
  if(path === '/login' && Auth.isAuthenticated()){
    navigate('/home');
    return;
  }

  // Unmount current page
  if(currentPage && currentPage.unmount) currentPage.unmount();

  // Mount new page
  const root = document.getElementById('page-root');
  if(!root) return;

  if(route){
    currentPage = route;
    root.innerHTML = '';
    route.mount(root);
  } else {
    navigate('/home');
  }

  // Update topbar visibility
  if(window.AppShell && window.AppShell.updateRouteUI){
    window.AppShell.updateRouteUI(path);
  }

  // Update active nav
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + path);
  });
}

function refresh(){ resolve(); }

window.addEventListener('hashchange', resolve);

window.Router = { register, navigate, resolve, refresh, getHash };
})();
