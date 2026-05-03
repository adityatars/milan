// HIVI.gaming — Admin Page
window.AdminPage = {
  scenarios: [],

  mount(root){
    const user = Auth.getUser();
    root.innerHTML = `
    <div class="admin-page">
      <div class="admin-container">
        <div class="admin-header">
          <div>
            <h1>Admin <span class="gradient-text">Panel</span></h1>
            <p class="admin-sub">Manage custom scenarios and questions for the simulation.</p>
          </div>
          <div class="admin-user">
            <img src="${user?.photoURL||''}" alt="" class="admin-avatar" onerror="this.style.display='none'"/>
            <span>${user?.displayName||user?.email||'Admin'}</span>
          </div>
        </div>

        <!-- STATS -->
        <div class="admin-stats">
          <div class="admin-stat-card"><span class="asc-num" id="stat-total">0</span><span class="asc-label">Custom Scenarios</span></div>
          <div class="admin-stat-card"><span class="asc-num" id="stat-phases">0</span><span class="asc-label">Phases Covered</span></div>
          <div class="admin-stat-card"><span class="asc-num" id="stat-choices">0</span><span class="asc-label">Total Choices</span></div>
        </div>

        <!-- SCENARIO LIST -->
        <div class="admin-section">
          <div class="admin-section-header">
            <h2>Scenarios</h2>
            <button class="btn-primary btn-sm" onclick="AdminPage.showForm()">+ New Scenario</button>
          </div>
          <div id="scenario-list" class="scenario-list">
            ${AdminPage.renderScenarioSkeletons(3)}
          </div>
        </div>

        <!-- IMPORT/EXPORT -->
        <div class="admin-section">
          <div class="admin-section-header">
            <h2>Import / Export</h2>
          </div>
          <div class="ie-actions">
            <button class="btn-outline btn-sm" onclick="AdminPage.exportScenarios()">📥 Export JSON</button>
            <label class="btn-outline btn-sm ie-upload">
              📤 Import JSON
              <input type="file" accept=".json" onchange="AdminPage.importScenarios(event)" hidden/>
            </label>
          </div>
        </div>
      </div>

      <!-- SCENARIO FORM MODAL -->
      <div id="scenario-form-modal" class="sheet-overlay hidden" onclick="BottomSheet.closeOnBackdrop(event, 'scenario-form-modal')">
        <div class="bottom-sheet admin-form-card">
          <button type="button" class="sheet-handle" aria-label="Drag handle"></button>
          <div class="sheet-content">
          <div class="modal-header">
            <h2 id="form-title">New Scenario</h2>
            <button class="modal-close" onclick="AdminPage.hideForm()">&times;</button>
          </div>
          <div class="modal-body">
            <form id="scenario-form" onsubmit="AdminPage.saveScenario(event)">
              <div class="form-group">
                <label for="sc-phase">Phase</label>
                <select id="sc-phase" required>
                  <option value="1">Phase 1 — General</option>
                  <option value="2">Phase 2 — Psychology</option>
                  <option value="3">Phase 3 — Negotiator ROI</option>
                  <option value="4">Phase 4 — Enterprise</option>
                  <option value="5">Phase 5 — Account Management</option>
                </select>
              </div>
              <div class="form-row">
                <div class="form-group"><label for="sc-persona-name">Persona Name</label><input type="text" id="sc-persona-name" required placeholder="e.g., Sarah Chen" autocomplete="name"/></div>
                <div class="form-group"><label for="sc-persona-title">Title</label><input type="text" id="sc-persona-title" required placeholder="e.g., VP of Operations" autocomplete="organization-title"/></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label for="sc-persona-type">Persona Type</label>
                  <select id="sc-persona-type">
                    <option value="Gatekeeper">Gatekeeper</option>
                    <option value="Decision Maker">Decision Maker</option>
                    <option value="Influencer">Influencer</option>
                    <option value="Champion">Champion</option>
                    <option value="Economic Buyer">Economic Buyer</option>
                    <option value="Legal Blocker">Legal Blocker</option>
                    <option value="Security Gate">Security Gate</option>
                  </select>
                </div>
                <div class="form-group"><label for="sc-persona-emoji">Emoji</label><input type="text" id="sc-persona-emoji" placeholder="👩‍💼" maxlength="4"/></div>
              </div>
              <div class="form-group">
                <label for="sc-opening">Opening Dialogue</label>
                <textarea id="sc-opening" required rows="3" placeholder="The scenario text the prospect will say..."></textarea>
              </div>

              <div class="form-group">
                <label>Choices</label>
                <div id="choices-builder"></div>
                <button type="button" class="btn-outline btn-xs" onclick="AdminPage.addChoiceField()">+ Add Choice</button>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-outline" onclick="AdminPage.hideForm()">Cancel</button>
                <button type="submit" class="btn-primary">Save Scenario</button>
              </div>
            </form>
          </div>
        </div>
        </div>
      </div>
    </div>`;

    this.addChoiceField();
    this.addChoiceField();
    BaseInput.applyErgonomics(root);
    const formSheet = document.getElementById('scenario-form-modal');
    if(formSheet) BottomSheet.initSheet(formSheet);
    this.loadScenarios();
  },

  addChoiceField(){
    const builder = document.getElementById('choices-builder');
    if(!builder) return;
    const idx = builder.children.length;
    const div = document.createElement('div');
    div.className = 'choice-builder-item';
    div.innerHTML = `
      <div class="cbi-header">
        <span class="cbi-label">Choice ${String.fromCharCode(65+idx)}</span>
        <button type="button" class="cbi-remove" onclick="this.closest('.choice-builder-item').remove()">✕</button>
      </div>
      <textarea class="cbi-text base-input" placeholder="Choice text..." rows="2" required></textarea>
      <div class="cbi-scores">
        <div><label>Trust</label><input type="number" class="cbi-trust base-input" value="0" min="-30" max="30" inputmode="numeric"/></div>
        <div><label>Econ</label><input type="number" class="cbi-econ base-input" value="0" min="-30" max="30" inputmode="numeric"/></div>
        <div><label>Momentum</label><input type="number" class="cbi-momentum base-input" value="0" min="-30" max="30" inputmode="numeric"/></div>
      </div>
      <textarea class="cbi-coach base-input" placeholder="Coach's feedback for this choice..." rows="2"></textarea>
      <input type="text" class="cbi-tag base-input" placeholder="Tag (e.g., ✅ Strong Move)" />`;
    builder.appendChild(div);
    BaseInput.applyErgonomics(div);
  },

  showForm(editId){
    this._editId = editId || null;
    document.getElementById('form-title').textContent = editId ? 'Edit Scenario' : 'New Scenario';
    if(editId){
      const sc = this.scenarios.find(s => s.id === editId);
      if(sc) this._populateForm(sc);
    }
    BottomSheet.open('scenario-form-modal');
  },

  hideForm(){
    BottomSheet.close('scenario-form-modal');
    document.getElementById('scenario-form').reset();
    const builder = document.getElementById('choices-builder');
    if(builder) builder.innerHTML = '';
    this.addChoiceField();
    this.addChoiceField();
    this._editId = null;
  },

  _populateForm(sc){
    document.getElementById('sc-phase').value = sc.phase;
    document.getElementById('sc-persona-name').value = sc.persona.name;
    document.getElementById('sc-persona-title').value = sc.persona.title;
    document.getElementById('sc-persona-type').value = sc.persona.type;
    document.getElementById('sc-persona-emoji').value = sc.persona.emoji;
    document.getElementById('sc-opening').value = sc.opening;
    const builder = document.getElementById('choices-builder');
    builder.innerHTML = '';
    sc.choices.forEach(ch => {
      this.addChoiceField();
      const item = builder.lastElementChild;
      item.querySelector('.cbi-text').value = ch.text;
      item.querySelector('.cbi-trust').value = ch.trust;
      item.querySelector('.cbi-econ').value = ch.econ;
      item.querySelector('.cbi-momentum').value = ch.momentum;
      item.querySelector('.cbi-coach').value = ch.coach;
      item.querySelector('.cbi-tag').value = ch.tag;
    });
  },

  saveScenario(e){
    e.preventDefault();
    const choiceEls = document.querySelectorAll('.choice-builder-item');
    const choices = Array.from(choiceEls).map((el, i) => ({
      id: 'custom_' + Date.now() + '_' + i,
      text: el.querySelector('.cbi-text').value,
      trust: parseInt(el.querySelector('.cbi-trust').value) || 0,
      econ: parseInt(el.querySelector('.cbi-econ').value) || 0,
      momentum: parseInt(el.querySelector('.cbi-momentum').value) || 0,
      coach: el.querySelector('.cbi-coach').value || 'No coaching feedback provided.',
      tag: el.querySelector('.cbi-tag').value || '📝 Custom'
    }));

    if(choices.length < 2){
      Toast.show('Please add at least 2 choices.', 'error');
      return;
    }

    const scenario = {
      id: this._editId || 'sc_' + Date.now(),
      phase: parseInt(document.getElementById('sc-phase').value),
      persona: {
        name: document.getElementById('sc-persona-name').value,
        title: document.getElementById('sc-persona-title').value,
        type: document.getElementById('sc-persona-type').value,
        emoji: document.getElementById('sc-persona-emoji').value || '👤'
      },
      opening: document.getElementById('sc-opening').value,
      choices: choices,
      createdAt: new Date().toISOString(),
      createdBy: Auth.getUser()?.email || 'unknown'
    };

    if(this._editId){
      const idx = this.scenarios.findIndex(s => s.id === this._editId);
      if(idx >= 0) this.scenarios[idx] = scenario;
    } else {
      this.scenarios.push(scenario);
    }

    this._saveToFirestore(scenario);
    this.hideForm();
    this.renderList();
    this.updateStats();
  },

  async deleteScenario(id){
    const confirmed = await BottomSheet.confirm({
      title: 'Delete Scenario',
      message: 'Delete this scenario permanently?',
      confirmLabel: 'Delete'
    });
    if(!confirmed) return;
    this.scenarios = this.scenarios.filter(s => s.id !== id);
    this._deleteFromFirestore(id);
    this.renderList();
    this.updateStats();
    Toast.show('Scenario deleted.', 'success');
  },

  async loadScenarios(){
    try {
      const snap = await FIREBASE.db.collection('scenarios').orderBy('createdAt','desc').get();
      this.scenarios = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch(e){
      console.warn('Firestore load failed, using empty list:', e.message);
      this.scenarios = [];
    }
    this.renderList();
    this.updateStats();
  },

  async _saveToFirestore(scenario){
    try {
      await FIREBASE.db.collection('scenarios').doc(scenario.id).set(scenario);
    } catch(e){ console.warn('Firestore save failed:', e.message); }
  },

  async _deleteFromFirestore(id){
    try {
      await FIREBASE.db.collection('scenarios').doc(id).delete();
    } catch(e){ console.warn('Firestore delete failed:', e.message); }
  },

  renderList(){
    const container = document.getElementById('scenario-list');
    if(!container) return;
    if(this.scenarios.length === 0){
      container.innerHTML = '<p class="empty-state">No custom scenarios yet. Click "New Scenario" to create one.</p>';
      return;
    }
    container.innerHTML = this.scenarios.map(sc => `
      <div class="scenario-row">
        <div class="sr-phase">Phase ${sc.phase}</div>
        <div class="sr-info">
          <span class="sr-persona">${sc.persona.emoji} ${sc.persona.name}</span>
          <span class="sr-title">${sc.persona.title} · ${sc.persona.type}</span>
          <span class="sr-meta">${sc.choices.length} choices · ${new Date(sc.createdAt).toLocaleDateString()}</span>
        </div>
        <div class="sr-actions">
          <button class="btn-outline btn-xs" onclick="AdminPage.showForm('${sc.id}')">Edit</button>
          <button class="btn-outline btn-xs btn-danger" onclick="AdminPage.deleteScenario('${sc.id}')">Delete</button>
        </div>
      </div>`).join('');
  },

  updateStats(){
    const el = id => document.getElementById(id);
    if(!el('stat-total')) return;
    el('stat-total').textContent = this.scenarios.length;
    el('stat-phases').textContent = new Set(this.scenarios.map(s => s.phase)).size;
    el('stat-choices').textContent = this.scenarios.reduce((a,s) => a + s.choices.length, 0);
  },

  exportScenarios(){
    const blob = new Blob([JSON.stringify(this.scenarios, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'hivi-scenarios.json';
    a.click();
  },

  importScenarios(e){
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if(Array.isArray(data)){
          data.forEach(sc => {
            sc.id = sc.id || 'sc_' + Date.now() + '_' + Math.random().toString(36).slice(2);
            this.scenarios.push(sc);
            this._saveToFirestore(sc);
          });
          this.renderList();
          this.updateStats();
          Toast.show(`Imported ${data.length} scenarios.`, 'success');
        }
      } catch(err){ Toast.show('Invalid JSON file.', 'error'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  },

  renderScenarioSkeletons(count){
    return Array.from({ length: count }).map(() => `
      <div class="scenario-row skeleton-card">
        <div class="skeleton-line sm"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line md"></div>
      </div>
    `).join('');
  },

  unmount(){}
};
