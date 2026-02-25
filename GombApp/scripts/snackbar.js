let hideTimeout;

function ensureSnackbarElement() {
  let el = document.getElementById('snackbar');
  if (!el) {
    el = document.createElement('div');
    el.id = 'snackbar';
    el.className = 'snackbar info';
    document.body.appendChild(el);
  }
  return el;
}

export function showSnackbar(message, type = 'info', duration = 4000) {
  const el = ensureSnackbarElement();

  el.textContent = message;

  el.classList.remove('info', 'success', 'error', 'show');
  if (type) {
    el.classList.add(type);
  }


  void el.offsetWidth;

  el.classList.add('show');

  if (hideTimeout) {
    clearTimeout(hideTimeout);
  }

  hideTimeout = setTimeout(() => {
    el.classList.remove('show');
  }, duration);
}

export function showConfirmSnackbar(message, onConfirm, onCancel) {
  const el = ensureSnackbarElement();
  
  // Clear any auto-hide timeout
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
  
  // Create backdrop
  let backdrop = document.getElementById('snackbar-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'snackbar-backdrop';
    backdrop.className = 'snackbar-backdrop';
    document.body.appendChild(backdrop);
  }
  
  // Build the confirm snackbar HTML
  el.innerHTML = `
    <div class="snackbar-message">${message}</div>
    <div class="snackbar-buttons">
      <button class="snackbar-btn snackbar-btn-cancel" id="snackbar-cancel">Mégse</button>
      <button class="snackbar-btn snackbar-btn-confirm" id="snackbar-confirm">OK</button>
    </div>
  `;
  
  el.classList.remove('info', 'success', 'error', 'show');
  el.classList.add('confirm');
  
  void el.offsetWidth;
  
  // Show backdrop
  backdrop.classList.add('show');
  
  el.classList.add('show');
  
  // Add event listeners
  const confirmBtn = el.querySelector('#snackbar-confirm');
  const cancelBtn = el.querySelector('#snackbar-cancel');
  
  const cleanup = () => {
    const backdrop = document.getElementById('snackbar-backdrop');
    if (backdrop) {
      backdrop.classList.remove('show');
    }
    el.classList.remove('show');
    setTimeout(() => {
      el.innerHTML = '';
      el.classList.remove('confirm');
    }, 300);
  };
  
  confirmBtn.addEventListener('click', () => {
    cleanup();
    if (onConfirm) onConfirm();
  }, { once: true });
  
  cancelBtn.addEventListener('click', () => {
    cleanup();
    if (onCancel) onCancel();
  }, { once: true });
}
