// HIVI.gaming — Auth Module
(function(){

// Admin email whitelist — add your email(s) here
const ADMIN_EMAILS = [
  'admin@hivi.gaming',
  // Add your Google account email below:
  // 'your-email@gmail.com',
];

let currentUser = null;
let authReadyResolve;
const authReady = new Promise(r => { authReadyResolve = r; });

function syncUserProfile(user){
  if(!user || !FIREBASE.db || !FIREBASE.db.collection) return Promise.resolve();

  const now = firebase.firestore.FieldValue.serverTimestamp();
  const fullName = user.displayName || (user.email ? user.email.split('@')[0] : 'Player');

  return FIREBASE.db.collection('users').doc(user.uid).set({
    uid: user.uid,
    full_name: fullName,
    email: user.email || '',
    bio: 'New challenger in the simulation arena.',
    avatar_url: user.photoURL || '',
    level: 1,
    stats: {
      trust: 0,
      econ_power: 0,
      momentum: 0
    },
    last_login_at: now,
    updated_at: now,
    created_at: now
  }, { merge: true }).catch((e) => {
    console.error('Failed to sync user profile:', e);
  });
}

function init(){
  FIREBASE.auth.onAuthStateChanged(async user => {
    currentUser = user;
    if(user) {
      await syncUserProfile(user);
    }
    updateAuthUI();
    authReadyResolve();
    // Re-evaluate current route
    if(window.Router) window.Router.refresh();
  });

  // Complete OAuth redirect flow when popup is blocked/unavailable.
  FIREBASE.auth.getRedirectResult().catch((e) => {
    console.error('Redirect sign-in error:', e);
  });
}

function signInWithGoogle(){
  const provider = new firebase.auth.GoogleAuthProvider();
  return FIREBASE.auth.signInWithPopup(provider);
}

function signInWithGoogleRedirect(){
  const provider = new firebase.auth.GoogleAuthProvider();
  return FIREBASE.auth.signInWithRedirect(provider);
}

function signOut(){
  return FIREBASE.auth.signOut().then(() => {
    window.location.hash = '#/login';
  }).catch(() => {
    currentUser = null;
    updateAuthUI();
    window.location.hash = '#/login';
  });
}

function mockSignIn(){
  currentUser = { email: 'admin@hivi.gaming', displayName: 'Local Dev User', photoURL: '' };
  updateAuthUI();
  authReadyResolve();
}

function getUser(){ return currentUser; }
function isAuthenticated(){ return !!currentUser; }
function isAdmin(){
  if(!currentUser) return false;
  return ADMIN_EMAILS.includes(currentUser.email);
}

function updateAuthUI(){
  const navAuth = document.getElementById('nav-auth');
  const navAdmin = document.getElementById('nav-admin');
  const navUser = document.getElementById('nav-user-info');
  if(!navAuth) return;

  if(currentUser){
    navAuth.innerHTML = `<button id="btn-signout" class="topbar-btn-text" onclick="Auth.signOut()">Sign Out</button>`;
    if(navUser){
      navUser.innerHTML = `
        <img src="${currentUser.photoURL || ''}" alt="" class="nav-avatar" onerror="this.style.display='none'"/>
        <span class="nav-username">${currentUser.displayName || currentUser.email}</span>`;
      navUser.classList.remove('hidden');
    }
    if(navAdmin){
      navAdmin.classList.toggle('hidden', !isAdmin());
    }
  } else {
    navAuth.innerHTML = `<a href="#/login" class="topbar-btn-text">Sign In</a>`;
    if(navUser) navUser.classList.add('hidden');
    if(navAdmin) navAdmin.classList.add('hidden');
  }
}

window.Auth = {
  init,
  signInWithGoogle,
  signInWithGoogleRedirect,
  signOut,
  mockSignIn,
  getUser,
  isAuthenticated,
  isAdmin,
  authReady
};
})();
