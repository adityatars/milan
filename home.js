// HIVI.gaming — Homepage
window.HomePage = {
  mount(root){
    const user = Auth.getUser();
    const name = user ? user.displayName || 'there' : 'there';
    
    let perfSection = '';
    const perfDataStr = localStorage.getItem('hivi_last_performance');
    if(perfDataStr) {
      try {
        const p = JSON.parse(perfDataStr);
        perfSection = `
        <!-- PERFORMANCE REPORT -->
        <section class="performance-section" style="padding: 80px 40px; background: var(--bg-card); border-bottom: 2px solid var(--border-dark);">
          <div style="max-width: 800px; margin: 0 auto; text-align: center;">
            <div class="arch-title" style="margin-bottom: 32px;">Recent Performance Report<br/><br/><span style="color:var(--text-muted)">Your latest simulation results.</span></div>
            <div class="card" style="display: flex; flex-direction: column; align-items: center; border: 2px solid ${p.grade.startsWith('A')?'var(--accent-neon)':(p.grade.startsWith('D')?'var(--accent-red)':'var(--accent-purple)')};">
              <h3 style="font-size: 2rem; font-weight: 800; margin-bottom: 8px;">Grade: ${p.grade}</h3>
              <p style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 24px; max-width: 600px;">"${p.verdict}"</p>
              
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; width: 100%; margin-bottom: 24px;">
                <div style="background: var(--bg-primary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
                  <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 800; margin-bottom: 8px;">Trust Sync</div>
                  <div style="font-size: 1.5rem; font-weight: 800;">${p.trust}%</div>
                </div>
                <div style="background: var(--bg-primary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
                  <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 800; margin-bottom: 8px;">Econ Power</div>
                  <div style="font-size: 1.5rem; font-weight: 800;">${p.econ}%</div>
                </div>
                <div style="background: var(--bg-primary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
                  <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 800; margin-bottom: 8px;">Momentum</div>
                  <div style="font-size: 1.5rem; font-weight: 800;">${p.momentum}%</div>
                </div>
              </div>
              
              <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">
                Scenario: ${p.vertical} · ${p.size} · ${p.difficulty} Difficulty · ${p.turns} Turns
              </div>
            </div>
          </div>
        </section>
        `;
      } catch(e) {}
    }

    // Modal Logic
    window.openContactModal = () => {
      BottomSheet.open('contact-sheet');
    };
    window.closeContactModal = () => {
      BottomSheet.close('contact-sheet');
    };
    window.submitContactForm = (e) => {
      e.preventDefault();
      Toast.show('Thank you! Our enterprise team will reach out shortly.', 'success');
      closeContactModal();
    };

    root.innerHTML = `
    <div class="home-page">
      <div class="mesh-bg"></div>
      
      <!-- HERO -->
      <section class="hero-section">
        <div class="hero-gradient"></div>
        <div class="hero-content">
          <!-- Left Column: Copy & Pricing -->
          <div class="hero-left">
            <span class="hero-pretitle">Master the Art of <span class="highlight">Enterprise Sales</span></span>
            <h1 class="hero-title">Level up your closing skills in our high-stakes simulation.</h1>
            <p class="hero-desc">Navigate complex negotiations, outsmart dynamic personas, and secure the deal in a neobrutalist digital arena.</p>
            <div class="hero-actions">
              <a href="#/game" class="btn-primary">Start Simulation</a>
              <a href="#architecture" class="btn-outline" onclick="document.getElementById('architecture').scrollIntoView({behavior:'smooth'});return false;">How It Works</a>
            </div>
            
            <div class="pricing-card-mini" onclick="openContactModal()">
              <div class="pricing-info">
                <h4>Enterprise Training</h4>
                <p>Deploy to your entire sales floor.</p>
              </div>
              <div class="pricing-price">$10<span>/user/mo</span></div>
            </div>
          </div>

        </div>
      </section>

      ${perfSection}

      <!-- ARCHITECTURE -->
      <section class="architecture-section" id="architecture">
        <div class="arch-title">Simulation Architecture<br/><br/><span style="color:var(--text-muted)">Analyze the robust framework powering your sales training environment.</span></div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="fc-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
            </div>
            <div class="fc-title">5 Phases</div>
            <div class="fc-desc">Pipeline Journey</div>
          </div>
          <div class="feature-card purple">
            <div class="fc-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div class="fc-title">10+ Personas</div>
            <div class="fc-desc">Dynamic AI Entities</div>
          </div>
          <div class="feature-card">
            <div class="fc-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3zM12 8v8M8 12h8"></path></svg>
            </div>
            <div class="fc-title">50+ Decisions</div>
            <div class="fc-desc">Branching Logic</div>
          </div>
          <div class="feature-card purple">
            <div class="fc-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            </div>
            <div class="fc-title">3 Metrics</div>
            <div class="fc-desc">Performance Tracking</div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="footer">
        <span class="footer-logo">Sell It</span>
        <span class="footer-copy">© 2026 Sell It • Powered by Web3 Engine</span>
        <div class="footer-links">
          <a href="#">Twitter</a>
          <a href="#">Discord</a>
          <a href="#">Docs</a>
        </div>
      </footer>
    </div>
    
    <!-- CONTACT MODAL -->
    <div id="contact-sheet" class="sheet-overlay hidden" onclick="BottomSheet.closeOnBackdrop(event, 'contact-sheet')">
      <div class="bottom-sheet">
        <button type="button" class="sheet-handle" aria-label="Drag handle"></button>
        <div class="sheet-content">
        <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 8px;">Upgrade to Enterprise</h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px;">Deploy Sell It to your entire sales floor to increase win rates and standardise your training.</p>
        <form onsubmit="submitContactForm(event)" style="display: flex; flex-direction: column; gap: 16px;">
          ${BaseInput.render({ id:'business-name', label:'Business Name', type:'text', required:true, placeholder:'Acme Corp', autocomplete:'organization' })}
          ${BaseInput.render({ id:'work-email', label:'Work Email', type:'email', required:true, placeholder:'you@acme.com', autocomplete:'email', inputmode:'email' })}
          ${BaseInput.render({ id:'sales-team-size', label:'Sales Team Size', as:'select', required:true, options:[
            { value:'1-10 Reps', label:'1-10 Reps' },
            { value:'11-50 Reps', label:'11-50 Reps' },
            { value:'50-200 Reps', label:'50-200 Reps' },
            { value:'200+ Reps', label:'200+ Reps' }
          ]})}
          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px;">
            <button type="button" class="btn-outline" style="padding: 12px 24px;" onclick="closeContactModal()">Cancel</button>
            <button type="submit" class="btn-primary" style="padding: 12px 24px;">Request Access</button>
          </div>
        </form>
        </div>
      </div>
    </div>
    `;
    BaseInput.applyErgonomics(root);
    const contactSheet = document.getElementById('contact-sheet');
    if(contactSheet) BottomSheet.initSheet(contactSheet);
  },

  unmount(){}
};
