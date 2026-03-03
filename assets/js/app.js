// =========================================================================
// TIMUR PORTFOLIO APP
// - Partials injection (header/footer)
// - Premium theme toggle (dark/light, saved)
// - Active nav + aria-current="page"
// - Soft reveal animations on scroll
// - Reading progress bar (appears after 40px)
// =========================================================================

const THEME_KEY = "theme";
const SHOW_PROGRESS_AFTER_PX = 40;

// ------------------ THEME ------------------
function getSystemTheme() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
function getSavedTheme() {
  return localStorage.getItem(THEME_KEY);
}
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}
function setTheme(theme) {
  applyTheme(theme);
  localStorage.setItem(THEME_KEY, theme);
}
function currentTheme() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

// Init theme ASAP
applyTheme(getSavedTheme() || getSystemTheme());

// ------------------ NAV ACTIVE + aria-current ------------------
function setActiveNav() {
  const page = document.body.getAttribute("data-page");
  if (!page) return;

  document.querySelectorAll(".nav__link").forEach((a) => {
    const key = a.getAttribute("data-nav");
    const isActive = key === page;

    a.classList.toggle("is-active", isActive);
    if (isActive) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

// ------------------ REVEALS ------------------
function initReveals() {
  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) return;

  const targets = [
    ...document.querySelectorAll(".hero"),
    ...document.querySelectorAll(".item"),
    ...document.querySelectorAll(".features li"),
    ...document.querySelectorAll("pre"),
  ];

  if (!targets.length) return;

  targets.forEach((el, idx) => {
    el.classList.add("reveal");
    const isHero = el.classList.contains("hero");
    const delay = isHero ? 0 : Math.min(240, idx * 25);
    el.style.setProperty("--delay", `${delay}ms`);
    el.dataset.delay = "1";
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
  );

  targets.forEach((el) => io.observe(el));
}

// ------------------ THEME TOGGLE (micro animation) ------------------
function bindThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  // Wrap icon in span for flip animation
  // If already wrapped (after partial re-inject or hot reload), keep it
  const raw = btn.textContent.trim();
  const isDark = currentTheme() === "dark";
  const icon = isDark ? "☀️" : "🌙";

  btn.innerHTML = `<span class="toggle-icon" aria-hidden="true">${icon}</span><span class="toggle-text"> Тема</span>`;
  btn.setAttribute("aria-pressed", String(isDark));

  btn.addEventListener("click", () => {
    // premium press
    btn.classList.add("is-animating");
    setTimeout(() => btn.classList.remove("is-animating"), 140);

    // flip icon
    btn.classList.toggle("is-flip");

    const next = currentTheme() === "dark" ? "light" : "dark";
    setTheme(next);

    // update icon after short delay to match flip
    const nextIcon = next === "dark" ? "☀️" : "🌙";
    const iconEl = btn.querySelector(".toggle-icon");
    const pressed = next === "dark";
    btn.setAttribute("aria-pressed", String(pressed));

    if (iconEl) {
      setTimeout(() => {
        iconEl.textContent = nextIcon;
      }, 160);
    }
  });
}

// ------------------ READING PROGRESS ------------------
function initReadingProgress() {
  const bar = document.getElementById("readProgress");
  const wrap = document.querySelector(".progress");
  if (!bar || !wrap) return;

  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let ticking = false;

  function calcProgress() {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop || 0;
    const scrollHeight = doc.scrollHeight - window.innerHeight;

    // show/hide after threshold
    const show = scrollTop > SHOW_PROGRESS_AFTER_PX;
    wrap.classList.toggle("is-visible", show);

    const p = scrollHeight <= 0 ? 0 : Math.min(1, Math.max(0, scrollTop / scrollHeight));
    bar.style.transform = `scaleX(${p})`;

    ticking = false;
  }

  function onScroll() {
    if (reduceMotion) return;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(calcProgress);
    }
  }

  // initial
  calcProgress();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", calcProgress);
}

// ------------------ PARTIALS INJECTION ------------------
async function injectPartials() {
  const headerMount = document.querySelector('[data-partial="header"]');
  const footerMount = document.querySelector('[data-partial="footer"]');

  // IMPORTANT: change if repo name differs
  const base = "/portfolio";

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
    // If partials fail (e.g. file://), keep page usable.
  }

  bindThemeToggle();
  setActiveNav();
  initReadingProgress();
  initReveals();
}

injectPartials();