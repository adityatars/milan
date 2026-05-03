(function(){
  const VELOCITY_THRESHOLD = 0.9; // px/ms
  const RELEASE_SPRING = 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)';

  function initSheet(overlay){
    if(!overlay || overlay.dataset.sheetReady === '1') return;
    overlay.dataset.sheetReady = '1';

    const sheet = overlay.querySelector('.bottom-sheet');
    const handle = overlay.querySelector('.sheet-handle');
    if(!sheet || !handle) return;

    let startY = 0;
    let startTime = 0;
    let currentY = 0;
    let lastY = 0;
    let lastTime = 0;
    let deltaY = 0;
    let velocity = 0;
    let dragging = false;

    function pointerY(e){
      return e.touches ? e.touches[0].clientY : e.clientY;
    }

    function onStart(e){
      dragging = true;
      startY = pointerY(e);
      currentY = startY;
      lastY = startY;
      startTime = performance.now();
      lastTime = startTime;
      deltaY = 0;
      velocity = 0;
      sheet.style.transition = 'none';
    }

    function onMove(e){
      if(!dragging) return;
      currentY = pointerY(e);
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const dy = currentY - lastY;
      velocity = dy / dt;
      lastY = currentY;
      lastTime = now;
      deltaY = Math.max(0, currentY - startY);
      sheet.style.transform = `translateY(${deltaY}px)`;
    }

    function onEnd(){
      if(!dragging) return;
      dragging = false;
      const sheetHeight = sheet.getBoundingClientRect().height || 1;
      const dragRatio = deltaY / sheetHeight;
      const totalDt = Math.max(1, performance.now() - startTime);
      const avgVelocity = deltaY / totalDt;
      const releaseVelocity = Math.max(velocity, avgVelocity);
      const shouldClose = releaseVelocity > VELOCITY_THRESHOLD || dragRatio > 0.5;

      sheet.style.transition = RELEASE_SPRING;
      if(shouldClose){
        sheet.style.transform = `translateY(${sheetHeight + 24}px)`;
        close(overlay.id);
      } else {
        sheet.style.transform = '';
      }
    }

    handle.addEventListener('touchstart', onStart, { passive: true });
    handle.addEventListener('touchmove', onMove, { passive: true });
    handle.addEventListener('touchend', onEnd);
    handle.addEventListener('touchcancel', onEnd);
    handle.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
  }

  function open(id){
    const overlay = document.getElementById(id);
    if(!overlay) return;
    initSheet(overlay);
    const sheet = overlay.querySelector('.bottom-sheet');
    if(sheet){
      sheet.style.transition = '';
      sheet.style.transform = '';
    }
    overlay.classList.remove('hidden');
    requestAnimationFrame(() => overlay.classList.add('sheet-open'));
  }

  function close(id){
    const overlay = document.getElementById(id);
    if(!overlay) return;
    overlay.classList.remove('sheet-open');
    const sheet = overlay.querySelector('.bottom-sheet');
    if(sheet) sheet.style.transform = '';
    window.setTimeout(() => overlay.classList.add('hidden'), 220);
  }

  function closeOnBackdrop(event, id){
    if(event.target && event.target.id === id){
      close(id);
    }
  }

  function confirm(opts){
    const id = `sheet-confirm-${Date.now()}`;
    const title = opts.title || 'Please confirm';
    const message = opts.message || 'Are you sure?';
    const confirmLabel = opts.confirmLabel || 'Confirm';
    const cancelLabel = opts.cancelLabel || 'Cancel';

    const overlay = document.createElement('div');
    overlay.id = id;
    overlay.className = 'sheet-overlay hidden';
    overlay.innerHTML = `
      <div class="bottom-sheet confirm-sheet">
        <button type="button" class="sheet-handle" aria-label="Drag handle"></button>
        <div class="sheet-content">
          <h3>${title}</h3>
          <p>${message}</p>
          <div class="sheet-actions">
            <button type="button" class="btn-outline" data-act="cancel">${cancelLabel}</button>
            <button type="button" class="btn-primary" data-act="confirm">${confirmLabel}</button>
          </div>
        </div>
      </div>
    `;
    overlay.addEventListener('click', (e) => {
      if(e.target.id === id) close(id);
    });
    document.body.appendChild(overlay);
    initSheet(overlay);

    return new Promise((resolve) => {
      overlay.querySelector('[data-act="cancel"]').addEventListener('click', () => {
        close(id);
        window.setTimeout(() => overlay.remove(), 240);
        resolve(false);
      });
      overlay.querySelector('[data-act="confirm"]').addEventListener('click', () => {
        close(id);
        window.setTimeout(() => overlay.remove(), 240);
        resolve(true);
      });
      open(id);
    });
  }

  window.BottomSheet = { open, close, closeOnBackdrop, confirm, initSheet };
})();
