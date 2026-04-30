/**
 * NTS — minimal behaviour shim
 * Three things: dark mode toggle, toast auto-dismiss, modal focus trap.
 * Everything else in the design is CSS-only.
 *
 * Usage:
 *   <script src="nts.js" defer></script>
 *
 * Dark mode toggle:
 *   <button onclick="NTS.toggleTheme()">Toggle dark mode</button>
 *   Theme persists to localStorage under key "nts-theme".
 *   Body gets [data-theme="dark"] or [data-theme="light"].
 *
 * Toast:
 *   NTS.toast('Firmware update scheduled', 'success');
 *   NTS.toast('Connection lost', 'error');
 *   Auto-dismisses after 4s. No manual dismiss — per brief.
 *
 * Modal focus trap:
 *   NTS.openModal(document.getElementById('my-modal'));
 *   NTS.closeModal();
 *   Tab/Shift+Tab cycle within modal. Escape closes.
 *   First focusable element receives focus on open.
 */

const NTS = (() => {

  /* ----------------------------------------------------------------
     DARK MODE
     Reads saved preference on page load, applies it, then exposes
     toggleTheme() for button wiring.
  ---------------------------------------------------------------- */
  const THEME_KEY = 'nts-theme';

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    const label = document.getElementById('theme-label');
    if (label) label.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  }

  function toggleTheme() {
    const current = document.body.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));
  }


  /* ----------------------------------------------------------------
     TOAST
     Creates a toast, appends to #nts-toast-region (creates it if
     absent, fixed bottom-right), auto-dismisses after 4s.
     icon is optional — pass a string like '✓' or '✕'.
  ---------------------------------------------------------------- */
  function getToastRegion() {
    let region = document.getElementById('nts-toast-region');
    if (!region) {
      region = document.createElement('div');
      region.id = 'nts-toast-region';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      Object.assign(region.style, {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: '9999',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      });
      document.body.appendChild(region);
    }
    return region;
  }

  function toast(message, type = 'success', icon = null) {
    const region = getToastRegion();
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.style.pointerEvents = 'auto';

    if (icon) {
      const iconEl = document.createElement('span');
      iconEl.className = 'toast-icon';
      iconEl.textContent = icon;
      el.appendChild(iconEl);
    }

    const msg = document.createElement('span');
    msg.className = 'toast-msg';
    msg.textContent = message;
    el.appendChild(msg);

    region.appendChild(el);

    // Auto-dismiss after 4s
    setTimeout(() => {
      el.style.transition = 'opacity 200ms ease-out';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 220);
    }, 4000);
  }


  /* ----------------------------------------------------------------
     MODAL FOCUS TRAP
     Traps Tab/Shift+Tab within the modal. Escape closes.
     Call openModal(el) with the .modal element (not the backdrop).
     Call closeModal() or press Escape to release.
  ---------------------------------------------------------------- */
  const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  let _activeModal = null;
  let _previousFocus = null;
  let _trapHandler = null;

  function openModal(modalEl) {
    _previousFocus = document.activeElement;
    _activeModal = modalEl;

    const focusable = Array.from(modalEl.querySelectorAll(FOCUSABLE));
    if (focusable.length) focusable[0].focus();

    _trapHandler = (e) => {
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key !== 'Tab') return;

      const focusable = Array.from(_activeModal.querySelectorAll(FOCUSABLE));
      if (!focusable.length) { e.preventDefault(); return; }

      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener('keydown', _trapHandler);
  }

  function closeModal() {
    if (_trapHandler) document.removeEventListener('keydown', _trapHandler);
    _trapHandler  = null;
    _activeModal  = null;
    if (_previousFocus) _previousFocus.focus();
    _previousFocus = null;
  }


  /* ----------------------------------------------------------------
     INIT
     Runs on DOMContentLoaded. Applies saved theme, wires up any
     [data-nts-toggle-theme] buttons automatically.
  ---------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    // Auto-wire theme toggle buttons with data-nts-toggle-theme attr
    document.querySelectorAll('[data-nts-toggle-theme]').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    // Auto-wire modal open/close with data-nts-modal-open/close attrs
    document.querySelectorAll('[data-nts-modal-open]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-nts-modal-open');
        const modal = document.getElementById(targetId);
        if (modal) openModal(modal);
      });
    });

    document.querySelectorAll('[data-nts-modal-close]').forEach(btn => {
      btn.addEventListener('click', closeModal);
    });
  });


  return { toggleTheme, toast, openModal, closeModal };

})();
