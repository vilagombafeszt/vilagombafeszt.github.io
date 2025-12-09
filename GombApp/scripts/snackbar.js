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

/**
 * Show a snackbar message.
 * @param {string} message - Text to display.
 * @param {('info'|'success'|'error')} [type='info'] - Visual style.
 * @param {number} [duration=3000] - Visible time in ms.
 */
export function showSnackbar(message, type = 'info', duration = 3000) {
  const el = ensureSnackbarElement();

  el.textContent = message;

  el.classList.remove('info', 'success', 'error', 'show');
  if (type) {
    el.classList.add(type);
  }

  // Force reflow so animation can restart
  // eslint-disable-next-line no-unused-expressions
  void el.offsetWidth;

  el.classList.add('show');

  if (hideTimeout) {
    clearTimeout(hideTimeout);
  }

  hideTimeout = setTimeout(() => {
    el.classList.remove('show');
  }, duration);
}
