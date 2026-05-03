// HIVI.gaming — Game Engine (refactored for SPA lifecycle)
(function(){
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

let G = {};
let _listeners = [];

function resetState(){
  G = {
    vertical: null, size: null, difficulty: null,
    phase: 1, turn: 0, lastChoice: null,
    trust: 50, econ: 50, momentum: 50,
    history: [], phaseStep: 0
  };
}

function addListener(el, evt, fn){
  if(!el) return;
  el.addEventListener(evt, fn);
  _listeners.push({el, evt, fn});
}

function init(){
  try {
    resetState();
    initSetup();
    initFreetext();
    initModals();
  } catch (e) {
    Toast.show("Error in GameEngine.init: " + e.message, "error", { duration: 5000, position: "top" });
    console.error(e);
  }
}

function destroy(){
  _listeners.forEach(({el,evt,fn}) => el.removeEventListener(evt,fn));
  _listeners = [];
}

// ── Setup ──
function initSetup(){
  ['vertical','size','difficulty'].forEach(cat => {
    const opts = $$(`#${cat}-options .option-btn`);
    opts.forEach(btn => {
      addListener(btn, 'click', () => {
        opts.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        G[cat] = btn.dataset.value;
        updateSummary();
      });
    });
  });
  const launchBtn = $('#btn-launch');
  if(launchBtn) addListener(launchBtn, 'click', launchGame);
}

function updateSummary(){
  const s = $('#setup-summary');
  const b = $('#btn-launch');
  if(G.vertical) $('#summary-vertical').textContent = G.vertical;
  if(G.size) $('#summary-size').textContent = G.size;
  if(G.difficulty) $('#summary-difficulty').textContent = G.difficulty;
  if(G.vertical && G.size && G.difficulty){
    s.classList.remove('hidden');
    b.classList.remove('disabled');
    b.disabled = false;
  }
}

function launchGame(){
  $('#setup-screen').classList.add('hidden');
  $('#game-screen').classList.remove('hidden');
  setPhase(1);
  updateMetrics();
  updateIntel();
  showPhaseIntro(1);
}

function setPhase(p){
  G.phase = p;
  G.phaseStep = 0;
  $$('.phase-pill').forEach(pill => {
    const pn = +pill.dataset.phase;
    pill.classList.remove('active','completed');
    if(pn < p) pill.classList.add('completed');
    if(pn === p) pill.classList.add('active');
  });
  $$('.phase-connector').forEach((c,i) => {
    c.classList.toggle('active', i < p-1);
  });
}

function setPersona(phase){
  // Persona metadata is now shown in chat, not a dedicated panel
}

function updateMetrics(){
  G.trust = clamp(G.trust,0,100);
  G.econ = clamp(G.econ,0,100);
  G.momentum = clamp(G.momentum,0,100);
  if($('#bar-trust')) $('#bar-trust').style.width = G.trust+'%';
  if($('#bar-econ')) $('#bar-econ').style.width = G.econ+'%';
  if($('#bar-momentum')) $('#bar-momentum').style.width = G.momentum+'%';
  if($('#val-trust')) $('#val-trust').textContent = G.trust+'%';
  if($('#val-econ')) $('#val-econ').textContent = G.econ+'%';
  if($('#val-momentum')) $('#val-momentum').textContent = G.momentum+'%';
}

function updateIntel(){
  if($('#current-phase-display')) $('#current-phase-display').textContent = G.phase;
}

function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }

// ── Messages ──
function addMessage(sender, text, emoji){
  const feed = $('#message-feed');
  if(!feed) return;
  const isUser = sender==='You';
  const div = document.createElement('div');
  div.className = 'message'+(isUser?' user':'');
  div.innerHTML = `<div class="msg-avatar">${emoji||(isUser?'👤':'🤖')}</div><div class="msg-body"><div class="msg-name">${sender}</div><div class="msg-text">${text}</div></div>`;
  feed.appendChild(div);
  scrollToBottom();
}

function addSystemMessage(text){
  const feed = $('#message-feed');
  if(!feed) return;
  const div = document.createElement('div');
  div.className = 'message';
  div.innerHTML = `<div class="msg-avatar">🎮</div><div class="msg-body"><div class="msg-name">HIVI Simulation</div><div class="msg-text">${text}</div></div>`;
  feed.appendChild(div);
  scrollToBottom();
}

function showTyping(){
  removeTyping();
  const feed = $('#message-feed');
  if(!feed) return;
  const div = document.createElement('div');
  div.className='message'; div.id='typing-msg';
  div.innerHTML=`<div class="msg-avatar">🤖</div><div class="msg-body"><div class="msg-name">...</div><div class="msg-text" style="padding:12px 20px;">typing...</div></div>`;
  feed.appendChild(div);
  scrollToBottom();
  return div;
}

function removeTyping(){ const t=$('#typing-msg'); if(t)t.remove(); }

function scrollToBottom(){
  const s=$('#conversation-scroll');
  if(!s) return;
  requestAnimationFrame(()=>{
    setTimeout(()=>{ s.scrollTop = s.scrollHeight; }, 100);
  });
}

// ── Toast Notifications ──
function showToast(label, delta){
  const container = document.getElementById('toast-container');
  if(!container) return;
  const isPos = delta > 0;
  const isNeutral = delta === 0;
  const toast = document.createElement('div');
  toast.className = `stat-toast ${isNeutral ? 'neutral' : (isPos ? 'positive' : 'negative')}`;
  const arrow = isNeutral ? '→' : (isPos ? '▲' : '▼');
  const sign = delta > 0 ? '+' : '';
  toast.textContent = `${arrow} ${label} ${sign}${delta}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}

// ── Floating Combat Text ──
function spawnFloatingText(trackId, valueString, type){
  const track = document.getElementById(trackId);
  if(!track) return;
  const span = document.createElement('span');
  span.className = `combat-float ${type}`;
  span.textContent = valueString;
  track.appendChild(span);
  setTimeout(() => span.remove(), 850);
}

// ── Opponent Dossier ──
function updateDossier(phase){
  const persona = PERSONAS[phase] && PERSONAS[phase][0];
  if(!persona) return;
  const avatar  = document.getElementById('dossier-avatar');
  const name    = document.getElementById('dossier-name');
  const title   = document.getElementById('dossier-title');
  if(avatar) avatar.textContent = persona.emoji || '?';
  if(name)   name.textContent   = persona.name;
  if(title)  title.textContent  = `${persona.title} — ${persona.type}`;
  updateMoodPill();
}

function updateMoodPill(){
  const pill = document.getElementById('mood-pill');
  if(!pill) return;
  pill.className = 'mood-pill';
  if(G.trust >= 65){
    pill.classList.add('mood-engaged');
    pill.textContent = '● Engaged';
  } else if(G.trust >= 35){
    pill.classList.add('mood-skeptical');
    pill.textContent = '● Skeptical';
  } else {
    pill.classList.add('mood-hostile');
    pill.textContent = '● Hostile';
  }
}

// ── Choices ──
function showChoices(choices){
  const c=$('#choices-container');
  if(!c) return;
  c.innerHTML='';
  choices.forEach((ch,i)=>{
    const btn=document.createElement('button');
    btn.className='choice-btn';
    btn.innerHTML=`<span class="choice-key">${String.fromCharCode(65+i)}</span><span>${ch.text}</span>`;
    btn.addEventListener('click',()=>handleChoice(ch));
    c.appendChild(btn);
  });
  scrollToBottom();
}

function clearChoices(){ const c=$('#choices-container'); if(c) c.innerHTML=''; }

function handleChoice(choice){
  clearChoices();
  G.turn++;
  addMessage('You', choice.text);
  const posDiff = G.difficulty==='Elite'?0.6 : G.difficulty==='Advanced'?0.8 : 1;
  const negDiff = G.difficulty==='Elite'?1.5 : G.difficulty==='Advanced'?1.2 : 1;
  const dt = Math.round(choice.trust * (choice.trust >= 0 ? posDiff : negDiff));
  const de = Math.round(choice.econ * (choice.econ >= 0 ? posDiff : negDiff));
  const dm = Math.round(choice.momentum * (choice.momentum >= 0 ? posDiff : negDiff));
  G.trust += dt; G.econ += de; G.momentum += dm;
  G.lastChoice = choice.id;
  G.history.push({phase:G.phase, choice:choice.id, turn:G.turn});
  updateMetrics();
  updateIntel();
  updateMoodPill();
  // Fire toast notifications
  setTimeout(() => showToast('🤝 Trust', dt), 100);
  setTimeout(() => showToast('💰 Econ', de), 350);
  setTimeout(() => showToast('🚀 Momentum', dm), 600);
  // Fire floating combat text on bars
  setTimeout(() => spawnFloatingText('track-trust',    (dt>=0?'+':'')+dt,    dt>0?'pos':dt<0?'neg':'neu'), 120);
  setTimeout(() => spawnFloatingText('track-econ',     (de>=0?'+':'')+de,    de>0?'pos':de<0?'neg':'neu'), 370);
  setTimeout(() => spawnFloatingText('track-momentum', (dm>=0?'+':'')+dm,    dm>0?'pos':dm<0?'neg':'neu'), 620);
  showCoach(choice.coach, choice.tag, dt, de, dm);
  G.phaseStep++;
  setTimeout(()=>advanceScenario(), 1200);
}

// ── Free text ──
function initFreetext(){
  addListener($('#btn-send-freetext'),'click',sendFreetext);
  addListener($('#freetext-input'),'keydown',e=>{
    if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendFreetext(); }
  });
}

function sendFreetext(){
  const inp=$('#freetext-input');
  if(!inp) return;
  const text=inp.value.trim();
  if(!text)return;
  inp.value='';
  clearChoices();
  G.turn++;
  addMessage('You', text);
  const dt=5, de=5, dm=5;
  G.trust+=dt; G.econ+=de; G.momentum+=dm;
  G.history.push({phase:G.phase, choice:'freetext', turn:G.turn});
  updateMetrics(); updateIntel();
  showCoach("You went off-script with a custom response. In real enterprise sales, this shows confidence — but make sure your message always ties back to the prospect's stated pain points.", "📝 Custom Response", dt,de,dm);
  G.phaseStep++;
  setTimeout(()=>advanceScenario(), 1200);
}

// ── Coach ──
function showCoach(text, tag, dt, de, dm){
  const cc=$('#coach-content');
  if(!cc) return;
  const isPos = (dt+de+dm)>=0;
  const icon = isPos ? '✓' : '⚠';
  const colorClass = isPos ? 'success' : 'error';
  const div = document.createElement('div');
  div.className = `feedback-card ${colorClass}`;
  div.innerHTML = `<div class="feedback-icon">${icon}</div><div class="fb-content"><h4>${tag||'Analysis'}</h4><p>${text}</p></div>`;
  cc.prepend(div);
}

// ── Scenario Flow ──
function showPhaseIntro(phase){
  const info = PHASE_INFO[phase];
  if(!info) return;
  addSystemMessage(`<strong>Phase ${phase}: ${info.name}</strong> — <em>${info.subtitle}</em><br>${info.desc}`);
  updateDossier(phase);
  setTimeout(()=>{
    const sc = SCENARIOS[phase];
    if(!sc) { endGame(); return; }
    showTyping();
    setTimeout(()=>{
      removeTyping();
      const persona = PERSONAS[phase][0];
      addMessage(persona.name, sc.opening(G.vertical, G.size), persona.emoji);
      showChoices(sc.choices);
    }, 1000);
  }, 800);
}

function advanceScenario(){
  const currentPhase = G.phase;
  const sc = SCENARIOS[currentPhase];
  if(!sc){ endGame(); return; }
  if(G.phaseStep===1 && typeof sc.follow === 'function'){
    const followData = sc.follow(G.lastChoice, G.vertical, G.size);
    if(followData && followData.choices){
      showTyping();
      setTimeout(()=>{
        removeTyping();
        const persona = PERSONAS[currentPhase][0];
        addMessage(persona.name, followData.text, persona.emoji);
        showChoices(followData.choices);
      }, 1000);
      return;
    }
  }
  if(currentPhase < 5){
    const nextPhase = currentPhase + 1;
    addSystemMessage(`<strong>Phase ${currentPhase} Complete.</strong> Your scores earned you advancement. Transitioning to Phase ${nextPhase}...`);
    setTimeout(()=>{
      G.phase = nextPhase;
      G.phaseStep = 0;
      setPhase(nextPhase);
      showPhaseIntro(nextPhase);
    }, 1500);
  } else {
    endGame();
  }
}

// ── End Game ──
function endGame(){
  const avg = Math.round((G.trust+G.econ+G.momentum)/3);
  let grade, verdict;
  if(avg>=92){ grade='A+'; verdict='Elite Closer. You navigated an incredibly hostile environment with absolute precision.'; }
  else if(avg>=80){ grade='B+'; verdict='Solid Rep. You survived the gauntlet and closed the deal, but left some margin on the table.'; }
  else if(avg>=65){ grade='C+'; verdict='Mediocre. The deal scraped through, but you lost control of the negotiation and sacrificed too much margin.'; }
  else { grade='D'; verdict='Deal Lost. Critical mistakes in trust-building and strategic navigation caused the account to go dark.'; }
  // Save performance to localStorage
  const performanceData = {
    grade, verdict, trust: G.trust, econ: G.econ, momentum: G.momentum,
    turns: G.turn, vertical: G.vertical, size: G.size, difficulty: G.difficulty,
    date: new Date().toISOString()
  };
  localStorage.setItem('hivi_last_performance', JSON.stringify(performanceData));

  BottomSheet.open('gameover-modal');
  const gc=$('#gameover-content');
  if(gc) gc.innerHTML=`
    <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px;">Simulation Complete</h2>
    <p style="color: var(--text-secondary); margin-bottom: 24px;">${verdict}</p>
    <div class="final-grade" style="font-size: 4.5rem; font-weight: 900; color: ${avg>=80?'var(--accent-neon-dark)':(avg>=65?'var(--text-primary)':'var(--accent-red)')}; margin-bottom: 24px;">${grade}</div>
    <div style="background: var(--bg-primary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-light); margin-bottom: 32px;">
      <p style="font-weight: 800; margin-bottom: 12px; font-size: 1.1rem;">Final Scores</p>
      <div style="display: flex; justify-content: space-around; font-weight: 700;">
        <span>🤝 Trust: ${G.trust}</span>
        <span>💰 Econ Value: ${G.econ}</span>
        <span>🚀 Momentum: ${G.momentum}</span>
      </div>
      <div style="color:var(--text-muted); font-size:0.8rem; margin-top:12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">
        ${G.turn} turns · ${G.vertical} · ${G.size} · ${G.difficulty}
      </div>
    </div>
    <div style="display: flex; gap: 16px; justify-content: center;">
      <button class="btn-outline" onclick="BottomSheet.close('gameover-modal'); Router.navigate('/game'); window.GameEngine.init();">Play Again</button>
      <button class="btn-primary" onclick="BottomSheet.close('gameover-modal'); Router.navigate('/home')">View Performance Report</button>
    </div>`;
}

// ── Modals ──
function initModals(){
  addListener($('#btn-metrics'),'click',()=>{
    const m=$('#metrics-modal');
    if(!m) return;
    m.classList.remove('hidden');
    const colors={trust:'#8b5cf6',econ:'#10b981',momentum:'#06b6d4'};
    const mb=$('#metrics-body');
    if(mb) mb.innerHTML=['trust','econ','momentum'].map(k=>{
      const labels={trust:'🤝 Trust',econ:'💰 Economic Value',momentum:'🚀 Momentum'};
      return `<div class="metric-detail"><div class="metric-detail-label">${labels[k]}</div><div class="metric-detail-bar"><div class="metric-detail-fill" style="width:${G[k]}%;background:${colors[k]}"></div></div><div class="metric-detail-val" style="color:${colors[k]}">${G[k]} / 100</div></div>`;
    }).join('');
  });
  addListener($('#close-metrics'),'click',()=>{ const m=$('#metrics-modal'); if(m) m.classList.add('hidden'); });
  addListener($('#metrics-modal'),'click',e=>{ if(e.target.id==='metrics-modal'){ const m=$('#metrics-modal'); if(m) m.classList.add('hidden'); }});
}

window.GameEngine = { init, destroy };
})();
