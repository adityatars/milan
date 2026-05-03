// HIVI.gaming — Login Page
window.LoginPage = {
  mount(root){
    root.innerHTML = `
    <div class="home-page" style="display:flex; align-items:center; justify-content:center; height:100vh;">
      <div class="mesh-bg"></div>
      <div class="card" style="max-width: 440px; width: 90%; text-align: center; position: relative; z-index: 1;">
        <div class="login-logo" style="margin-bottom:24px; display:flex; justify-content:center;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 72" fill="none" style="height:60px;">
            <path d="M6 56 L22 16 L34 16 L18 56 Z" fill="#2563eb"/>
            <path d="M22 56 L38 16 L50 16 L34 56 Z" fill="#2563eb"/>
            <polygon points="32,4 58,4 58,30" fill="#2563eb"/>
            <text x="66" y="38" font-family="Arial Black, sans-serif" font-weight="900" font-size="26" fill="#2563eb">SELL</text>
            <text x="66" y="66" font-family="Arial Black, sans-serif" font-weight="900" font-size="26" fill="#2563eb">IT</text>
          </svg>
        </div>
        <p style="font-size: 0.9rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 24px; font-weight: 700;">Enterprise Sales Simulation Engine</p>
        <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 32px;">Train in high-stakes enterprise sales through immersive, AI-powered simulations designed for top-tier business schools.</p>
        <button id="btn-google-signin" class="btn-outline" style="width: 100%; border-color: var(--border-dark); color: var(--text-primary);" onclick="LoginPage.handleSignIn()">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Sign in with Google</span>
        </button>
        <p style="margin-top: 24px; font-size: 0.75rem; color: var(--text-muted);">By signing in, you agree to our Terms of Service</p>
      </div>
    </div>`;
    BaseInput.applyErgonomics(root);
  },

  async handleSignIn(){
    const btn = document.getElementById('btn-google-signin');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Signing in...';
    try {
      await Auth.signInWithGoogle();
      Router.navigate('/home');
    } catch(e){
      console.error('Sign-in error:', e);
      if(e.code === 'auth/popup-blocked' || e.code === 'auth/cancelled-popup-request'){
        try {
          await Auth.signInWithGoogleRedirect();
          return;
        } catch(redirectError){
          console.error('Redirect fallback error:', redirectError);
          e = redirectError;
        }
      }

      btn.disabled = false;
      btn.querySelector('span').textContent = 'Sign in with Google';

      if(e.code !== 'auth/popup-closed-by-user'){
        if(e.code === 'auth/unauthorized-domain'){
          Toast.show('Google Sign-In failed: this domain is not authorized in Firebase Auth. Add your Netlify domain in Firebase Authentication settings.', 'error', { duration: 5000, position: 'top' });
          return;
        }
        Toast.show('Sign-in failed: ' + e.message, 'error', { duration: 4200, position: 'top' });
      }
    }
  },

  handleDevSignIn(){
    Auth.mockSignIn();
    Router.navigate('/home');
  },

  _spawnParticles(){
    const c = document.getElementById('loginParticles');
    if(!c) return;
    for(let i = 0; i < 30; i++){
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random()*100+'%';
      p.style.top = 60+Math.random()*40+'%';
      p.style.animationDelay = Math.random()*4+'s';
      p.style.background = Math.random()>0.5?'#8b5cf6':'#06b6d4';
      c.appendChild(p);
    }
  },

  unmount(){}
};
