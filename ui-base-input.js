(function(){
  function render(cfg){
    const id = cfg.id || `inp-${Math.random().toString(36).slice(2, 8)}`;
    const label = cfg.label || '';
    const as = cfg.as || 'input';
    const type = cfg.type || 'text';
    const required = cfg.required ? 'required' : '';
    const placeholder = cfg.placeholder || '';
    const value = cfg.value || '';
    const autocomplete = cfg.autocomplete || '';
    const inputmode = cfg.inputmode || '';
    const rows = cfg.rows || 3;
    const options = cfg.options || [];

    if(as === 'textarea'){
      return `
        <div class="base-input-wrap">
          <label class="base-input-label" for="${id}">${label}</label>
          <textarea id="${id}" class="base-input" rows="${rows}" placeholder="${placeholder}" ${required} autocomplete="${autocomplete}">${value}</textarea>
        </div>
      `;
    }

    if(as === 'select'){
      return `
        <div class="base-input-wrap">
          <label class="base-input-label" for="${id}">${label}</label>
          <select id="${id}" class="base-input" ${required} autocomplete="${autocomplete}">
            ${options.map((o) => `<option value="${o.value}">${o.label}</option>`).join('')}
          </select>
        </div>
      `;
    }

    return `
      <div class="base-input-wrap">
        <label class="base-input-label" for="${id}">${label}</label>
        <input
          id="${id}"
          class="base-input"
          type="${type}"
          placeholder="${placeholder}"
          value="${value}"
          ${required}
          autocomplete="${autocomplete}"
          inputmode="${inputmode}"
        />
      </div>
    `;
  }

  function applyErgonomics(scope){
    const root = scope || document;
    root.querySelectorAll('input, textarea, select').forEach((el) => {
      el.classList.add('base-input');
      el.style.fontSize = '16px';

      if(el.tagName === 'INPUT'){
        const type = (el.getAttribute('type') || 'text').toLowerCase();
        if(type === 'email'){
          if(!el.getAttribute('inputmode')) el.setAttribute('inputmode', 'email');
          if(!el.getAttribute('autocomplete')) el.setAttribute('autocomplete', 'email');
        } else if(type === 'number'){
          if(!el.getAttribute('inputmode')) el.setAttribute('inputmode', 'decimal');
        } else if(type === 'tel'){
          if(!el.getAttribute('inputmode')) el.setAttribute('inputmode', 'tel');
          if(!el.getAttribute('autocomplete')) el.setAttribute('autocomplete', 'tel');
        } else if(type === 'text'){
          if(el.id && el.id.includes('name') && !el.getAttribute('autocomplete')){
            el.setAttribute('autocomplete', 'name');
          }
        }
      }
    });
  }

  window.BaseInput = { render, applyErgonomics };
})();
