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
