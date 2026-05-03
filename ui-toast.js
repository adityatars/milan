(function(){
  let host;
  let queue = [];
  let seq = 0;
  const MAX_VISIBLE = 3;

  function ensureHost(){
    if(host && document.body.contains(host)) return host;
    host = document.createElement('div');
    host.id = 'toast-host';
    host.className = 'toast-host';
    document.body.appendChild(host);
    return host;
  }

  function show(message, type = 'info', opts = {}){
    const container = ensureHost();
    const toast = document.createElement('div');
    const duration = opts.duration || 2800;
    const position = opts.position === 'top' ? 'top' : 'bottom';
    container.classList.toggle('toast-host-top', position === 'top');
    container.classList.toggle('toast-host-bottom', position !== 'top');
    toast.className = `toast toast-${type} toast-${position}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <span class="toast-icon">${iconFor(type)}</span>
      <span class="toast-message">${message}</span>
    `;
    const item = { id: ++seq, el: toast, position, timer: 0, state: 'entering' };
    queue.push(item);
    container.appendChild(toast);
    layout();

    requestAnimationFrame(() => {
      toast.classList.add('toast-enter');
      item.state = 'active';
      layout();
    });

    item.timer = window.setTimeout(() => remove(item.id), duration);
    return item.id;
  }

  function remove(id){
    const item = queue.find((q) => q.id === id);
    if(!item) return;
    clearTimeout(item.timer);
    item.state = 'exiting';
    item.el.classList.remove('toast-enter');
    item.el.classList.add('toast-exit');
    window.setTimeout(() => {
      item.el.remove();
      queue = queue.filter((q) => q.id !== id);
      layout();
    }, 220);
  }

  function layout(){
    if(!host) return;
    const position = host.classList.contains('toast-host-top') ? 'top' : 'bottom';
    const visible = queue.filter((q) => q.position === position).slice(-MAX_VISIBLE);

    queue.forEach((item) => {
      if(item.position !== position){
        item.el.style.opacity = '0';
        return;
      }
      const idx = visible.findIndex((v) => v.id === item.id);
      if(idx === -1){
        item.el.classList.add('toast-pruned');
        item.el.style.setProperty('--index', String(MAX_VISIBLE));
        item.el.style.transform = position === 'top'
          ? 'translate(-50%, -20px) scale(0.92)'
          : 'translate(-50%, 20px) scale(0.92)';
        item.el.style.opacity = '0';
        return;
      }
      item.el.classList.remove('toast-pruned');
      item.el.style.setProperty('--index', String(idx));
      const step = 72;
      const offset = idx * step;
      item.el.style.transform = position === 'top'
        ? `translate(-50%, ${offset}px) scale(calc(1 - 0.05 * var(--index)))`
        : `translate(-50%, ${-offset}px) scale(calc(1 - 0.05 * var(--index)))`;
      item.el.style.opacity = String(Math.max(0.4, 1 - idx * 0.18));
      item.el.style.zIndex = String(100 - idx);
    });
  }

  function iconFor(type){
    if(type === 'success') return '✓';
    if(type === 'error') return '!';
    return 'i';
  }

  window.Toast = { show, remove };
})();
