// ============ Тема ============

// Читаем сохранённую тему: 'light' | 'dark' | null
const saved = localStorage.getItem('theme');

// Если сохранённой нет — берём системную как стартовую
const systemPrefersDark = window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

const initialTheme = saved || (systemPrefersDark ? 'dark' : 'light');
applyTheme(initialTheme);

// Навесим на кнопку
const btn = document.getElementById('themeToggle');
if (btn) {
    updateToggleLabel();
    btn.addEventListener('click', () => {
        const now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(now);
        localStorage.setItem('theme', now);
        updateToggleLabel();
    });
}

function applyTheme(mode) {
    if (mode === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme'); // light по умолчанию
    }
}

function updateToggleLabel() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (btn) btn.textContent = isDark ? '☀️ Тема' : '🌙 Тема';
}

// ============ Удобный переход с index по Enter/Space ============
if (location.pathname.endsWith('index.html') || location.pathname.endsWith('/')) {
    document.addEventListener('keydown', (e) => {
        if (['Enter', ' '].includes(e.key)) {
            window.location.href = 'portfolio.html';
        }
    });
}