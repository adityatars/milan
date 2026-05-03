// Sell It — Game Page (Command Center v2)
window.GamePage = {
  mount(root){
    root.innerHTML = `
    <div id="game-wrapper" style="height:100%">
      
      <!-- SETUP SCREEN -->
      <div id="setup-screen" class="screen setup-screen">
        <div class="setup-container" style="max-width:800px; margin:0 auto;">
          <div class="setup-header" style="text-align:center; margin-bottom:40px;">
            <h1 class="command-title">Configure Your Simulation</h1>
            <p class="command-sub">Choose your vertical, target company, and difficulty to begin.</p>
          </div>
          <div class="setup-cards">
            <div class="card setup-card">
              <div class="card-header"><h2 style="font-size:1.2rem; font-weight:800; margin-bottom:4px;">Industry Vertical</h2></div>
              <p class="card-desc">Choose the market you'll be selling into.</p>
              <div class="card-options" id="vertical-options">
                <button class="option-btn" data-value="SaaS"><span class="opt-label">SaaS</span><span class="opt-sub">Cloud Software</span></button>
                <button class="option-btn" data-value="FinTech"><span class="opt-label">FinTech</span><span class="opt-sub">Financial Technology</span></button>
                <button class="option-btn" data-value="Manufacturing"><span class="opt-label">Manufacturing</span><span class="opt-sub">Industrial &amp; Supply</span></button>
                <button class="option-btn" data-value="Healthcare"><span class="opt-label">Healthcare</span><span class="opt-sub">MedTech &amp; Life Sciences</span></button>
                <button class="option-btn" data-value="Cybersecurity"><span class="opt-label">Cybersec</span><span class="opt-sub">InfoSec &amp; Compliance</span></button>
                <button class="option-btn" data-value="Energy"><span class="opt-label">Energy</span><span class="opt-sub">Utilities &amp; CleanTech</span></button>
              </div>
            </div>
            <div class="card setup-card">
              <div class="card-header"><h2 style="font-size:1.2rem; font-weight:800; margin-bottom:4px;">Target Company Size</h2></div>
              <p class="card-desc">The complexity of your deal depends on the org structure.</p>
              <div class="card-options" id="size-options">
                <button class="option-btn" data-value="SMB"><span class="opt-label">SMB</span><span class="opt-sub">50–200 employees</span></button>
                <button class="option-btn" data-value="Mid-Market"><span class="opt-label">Mid-Market</span><span class="opt-sub">200–2,000 employees</span></button>
                <button class="option-btn" data-value="Enterprise"><span class="opt-label">Enterprise</span><span class="opt-sub">2,000–20,000 employees</span></button>
                <button class="option-btn" data-value="Global"><span class="opt-label">Global 500</span><span class="opt-sub">20,000+ employees</span></button>
              </div>
            </div>
            <div class="card setup-card">
              <div class="card-header"><h2 style="font-size:1.2rem; font-weight:800; margin-bottom:4px;">Difficulty Level</h2></div>
              <p class="card-desc">How aggressive will the prospect's objections be?</p>
              <div class="card-options" id="difficulty-options">
                <button class="option-btn" data-value="Standard"><span class="opt-label">Standard</span><span class="opt-sub">Learn the fundamentals</span></button>
                <button class="option-btn" data-value="Advanced"><span class="opt-label">Advanced</span><span class="opt-sub">Realistic pushback</span></button>
                <button class="option-btn" data-value="Elite"><span class="opt-label">Elite</span><span class="opt-sub">Adversarial negotiation</span></button>
              </div>
            </div>
          </div>
          <div class="setup-footer">
            <div id="setup-summary" class="setup-summary hidden" style="margin-bottom:16px;">
              <span id="summary-vertical" class="lvl-pill"></span>
              <span id="summary-size" class="lvl-pill"></span>
              <span id="summary-difficulty" class="lvl-pill"></span>
            </div>
            <button id="btn-launch" class="btn-primary disabled" disabled>Launch Simulation</button>
          </div>
        </div>
      </div>

      <!-- GAME SCREEN -->
      <div id="game-screen" class="screen game-screen hidden">
        <div class="command-header">
          <h1 class="command-title">Command Center</h1>
          <p class="command-sub">Active Simulation: Phase <span id="current-phase-display">1</span></p>
        </div>
        
        <div class="game-layout">
          <!-- Main Arena -->
          <div class="arena-card">

            <!-- OPPONENT DOSSIER -->
            <div class="dossier-header" id="dossier-header">
              <div class="dossier-avatar" id="dossier-avatar">?</div>
              <div class="dossier-info">
                <div class="dossier-name" id="dossier-name">Awaiting Connection...</div>
                <div class="dossier-title" id="dossier-title">Initializing opponent profile</div>
              </div>
              <div class="dossier-right">
                <div class="mood-pill mood-skeptical" id="mood-pill">● Skeptical</div>
              </div>
            </div>

            <div class="conversation-scroll" id="conversation-scroll">
              <div id="message-feed" class="message-feed"></div>
            </div>

            <div class="arena-footer">
              <div id="choices-container" class="choices-container"></div>
              <div class="input-wrapper">
                <input type="text" id="freetext-input" class="freetext-input tactical-input base-input" placeholder="Override with custom response..." autocomplete="off" inputmode="text" />
                <button id="btn-send-freetext" class="btn-send tactical-send">
                  SEND 
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Right Sidebar: Telemetry -->
          <div class="game-sidebar">
            <div class="card telemetry-card">
              <div class="tc-header">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent-purple)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                Telemetry
              </div>
              <div class="metric-block">
                <div class="metric-header">
                  <span class="metric-label">🤝 Trust Sync</span>
                  <span class="metric-val green" id="val-trust">50%</span>
                </div>
                <div class="metric-track" id="track-trust">
                  <div class="metric-fill trust" id="bar-trust" style="width:50%"></div>
                </div>
              </div>
              <div class="metric-block">
                <div class="metric-header">
                  <span class="metric-label">💰 Econ Power</span>
                  <span class="metric-val purple" id="val-econ">50%</span>
                </div>
                <div class="metric-track" id="track-econ">
                  <div class="metric-fill econ" id="bar-econ" style="width:50%"></div>
                </div>
              </div>
              <div class="metric-block" style="margin-bottom:0">
                <div class="metric-header">
                  <span class="metric-label">🚀 Momentum</span>
                  <span class="metric-val purple" id="val-momentum">50%</span>
                </div>
                <div class="metric-track" id="track-momentum">
                  <div class="metric-fill momentum" id="bar-momentum" style="width:50%"></div>
                </div>
              </div>
            </div>

            <div class="feedback-section">
              <h3>Recent Feedback</h3>
              <div id="coach-content">
                <div style="color:var(--text-muted); font-size:0.85rem; font-style:italic;">Make your first move to receive coaching feedback.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- GAME OVER MODAL -->
      <div id="gameover-modal" class="sheet-overlay hidden" onclick="BottomSheet.closeOnBackdrop(event, 'gameover-modal')">
        <div class="bottom-sheet gameover-modal-card">
          <button type="button" class="sheet-handle" aria-label="Drag handle"></button>
          <div class="sheet-content"><div id="gameover-content"></div></div>
        </div>
      </div>
    </div>`;

    BaseInput.applyErgonomics(root);
    const gameOverSheet = document.getElementById('gameover-modal');
    if(gameOverSheet) BottomSheet.initSheet(gameOverSheet);
    if(window.GameEngine) window.GameEngine.init();
  },

  unmount(){
    if(window.GameEngine) window.GameEngine.destroy();
  }
};
