// =========================================================================
// TIMUR PORTFOLIO APP (stable layout)
// - Partials injection (header/footer)
// - Premium theme toggle (dark/light, saved)
// - Active nav + aria-current="page"
// - Soft reveal animations on scroll
// - Reading progress bar (appears after 40px)
// - ✅ Sync CSS vars with REAL header/footer heights (fix overlap forever)
// =========================================================================

const THEME_KEY = "theme";
const SHOW_PROGRESS_AFTER_PX = 40;

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

  const isDark = currentTheme() === "dark";
  const icon = isDark ? "☀️" : "🌙";

  btn.innerHTML = `<span class="toggle-icon" aria-hidden="true">${icon}</span><span class="toggle-text"> Тема</span>`;
  btn.setAttribute("aria-pressed", String(isDark));

  btn.addEventListener("click", () => {
    btn.classList.add("is-animating");
    setTimeout(() => btn.classList.remove("is-animating"), 140);

    btn.classList.toggle("is-flip");

    const next = currentTheme() === "dark" ? "light" : "dark";
    setTheme(next);

    const nextIcon = next === "dark" ? "☀️" : "🌙";
    const iconEl = btn.querySelector(".toggle-icon");
    btn.setAttribute("aria-pressed", String(next === "dark"));

    if (iconEl) {
      setTimeout(() => {
        iconEl.textContent = nextIcon;
        // after theme change footer can wrap -> resync heights
        syncFixedBarsHeights();
      }, 160);
    } else {
      syncFixedBarsHeights();
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

  calcProgress();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", calcProgress);
}

// ------------------ ✅ SYNC REAL HEADER/FOOTER HEIGHTS ------------------
function syncFixedBarsHeights() {
  const root = document.documentElement;

  const header = document.querySelector(".header");
  const footer = document.querySelector(".footer");

  if (header) {
    const h = Math.ceil(header.getBoundingClientRect().height);
    if (h > 0) root.style.setProperty("--header-h", `${h}px`);
  }

  if (footer) {
    const h = Math.ceil(footer.getBoundingClientRect().height);
    if (h > 0) root.style.setProperty("--footer-h", `${h}px`);
  }
}

// Optional: auto-resync when footer/header size changes (wraps)
function observeFixedBars() {
  if (!("ResizeObserver" in window)) return;

  const header = document.querySelector(".header");
  const footer = document.querySelector(".footer");
  if (!header && !footer) return;

  const ro = new ResizeObserver(() => syncFixedBarsHeights());
  if (header) ro.observe(header);
  if (footer) ro.observe(footer);
}

// ------------------ PARTIALS INJECTION ------------------
async function injectPartials() {
  const headerMount = document.querySelector('[data-partial="header"]');
  const footerMount = document.querySelector('[data-partial="footer"]');

  const base = "/portfolio";

  try {
    if (headerMount) {
      const res = await fetch(`${base}/partials/header.html`, { cache: "no-cache" });
      headerMount.innerHTML = await res.text();
    }
    if (footerMount) {
      const res = await fetch(`${base}/partials/footer.html`, { cache: "no-cache" });
      footerMount.innerHTML = await res.text();
    }
  } catch (e) {
    // keep page usable
  }

  // after partials exist
  bindThemeToggle();
  setActiveNav();
  initReadingProgress();
  initReveals();

  // ✅ sync after DOM is painted
  requestAnimationFrame(() => {
    syncFixedBarsHeights();
    observeFixedBars();
  });

  window.addEventListener("resize", () => syncFixedBarsHeights(), { passive: true });
}

injectPartials();