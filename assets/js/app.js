// ====================== THEME ======================
const saved = localStorage.getItem('theme');
const systemPrefersDark =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const initialTheme = saved || (systemPrefersDark ? 'dark' : 'light');
applyTheme(initialTheme);

function applyTheme(mode) {
  if (mode === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  else document.documentElement.removeAttribute('data-theme');
}

function updateToggleLabel(btn) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.textContent = isDark ? '☀️ Тема' : '🌙 Тема';
  btn.setAttribute('aria-pressed', String(isDark));
}

// Bind theme button (may appear after partial injection)
function bindThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  updateToggleLabel(btn);
  btn.addEventListener('click', () => {
    const now =
      document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'light'
        : 'dark';

    applyTheme(now);
    localStorage.setItem('theme', now);
    updateToggleLabel(btn);
  }, { once: true });
}

// ====================== NAV ACTIVE ======================
function setActiveNav() {
  const page = document.body.getAttribute('data-page');
  if (!page) return;

  document.querySelectorAll('.nav__link').forEach(a => {
    const key = a.getAttribute('data-nav');
    a.classList.toggle('is-active', key === page);
  });
}

// ====================== PARTIALS INJECTION ======================
// Works on GitHub Pages / any server.
// If you open files directly via file://, fetch may be blocked.
// Use "Live Server" extension in VS Code for local dev.
async function injectPartials() {
  const headerMount = document.querySelector('[data-partial="header"]');
  const footerMount = document.querySelector('[data-partial="footer"]');

  const base = '/portfolio'; // <-- IMPORTANT: change if repo name is different

  try {
    if (headerMount) {
      const res = await fetch(`${base}/partials/header.html`);
      headerMount.innerHTML = await res.text();
    }
    if (footerMount) {
      const res = await fetch(`${base}/partials/footer.html`);
      footerMount.innerHTML = await res.text();
    }
  } catch (e) {
    // If partials failed (e.g. file://), do nothing.
    // You can still keep header/footer directly in pages if you prefer.
  }

  bindThemeToggle();
  setActiveNav();
}

injectPartials();