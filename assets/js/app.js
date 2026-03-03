// =========================================================================
// TIMUR PORTFOLIO APP (cache-bust + stable layout + mobile)
// - ✅ Forces CSS refresh on iOS/Telegram by appending ?v=BUILD_ID
// - Partials injection (header/footer)
// - Theme toggle (saved)
// - Active nav + aria-current
// - Reveal animations
// - Reading progress
// - ✅ Sync REAL header/footer heights (prevents overlap forever)
// - ✅ Mobile burger menu
// =========================================================================

const BUILD_ID = "2026-03-03-01"; // <- меняй при каждом релизе, если хочешь вручную
const THEME_KEY = "theme";
const SHOW_PROGRESS_AFTER_PX = 40;

// ------------------ ✅ CACHE BUST CSS (iOS fix) ------------------
(function bustCssCache() {
  // ищем все стили, где есть style.css (включая абсолютные/относительные пути)
  const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  const styleLink = links.find((l) => (l.getAttribute("href") || "").includes("assets/css/style.css"));

  if (!styleLink) return;

  const href = styleLink.getAttribute("href") || "";
  // если уже есть v= — не трогаем
  if (href.includes("v=")) return;

  const sep = href.includes("?") ? "&" : "?";
  styleLink.setAttribute("href", `${href}${sep}v=${encodeURIComponent(BUILD_ID)}`);
})();

// ------------------ THEME ------------------
function getSystemTheme() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
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
applyTheme(localStorage.getItem(THEME_KEY) || getSystemTheme());

// ------------------ Active nav + aria-current ------------------
function setActiveNav() {
  const page = document.body.getAttribute("data-page");
  if (!page) return;

  document.querySelectorAll(".nav__link").forEach((a) => {
    const key = a.getAttribute("data-nav");
    const isActive = key === page;
    if (isActive) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

// ------------------ Reveals ------------------
function initReveals() {
  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) return;

  const targets = [
    ...document.querySelectorAll(".hero"),
    ...document.querySelectorAll(".item"),
    ...document.querySelectorAll(".card"),
    ...document.querySelectorAll(".features li"),
    ...document.querySelectorAll("pre"),
  ];

  if (!targets.length) return;

  targets.forEach((el, idx) => {
    el.classList.add("reveal");
    const delay = Math.min(260, idx * 22);
    el.style.setProperty("--delay", `${delay}ms`);
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

// ------------------ Progress ------------------
function initReadingProgress() {
  const bar = document.getElementById("readProgress");
  const wrap = document.querySelector(".progress");
  if (!bar || !wrap) return;

  let ticking = false;

  function calc() {
    const doc = document.documentElement;
    const y = window.scrollY || doc.scrollTop || 0;
    const max = Math.max(1, doc.scrollHeight - doc.clientHeight);

    wrap.classList.toggle("is-visible", y > SHOW_PROGRESS_AFTER_PX);

    const p = Math.min(1, Math.max(0, y / max));
    bar.style.transform = `scaleX(${p})`;

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(calc);
    }
  }

  calc();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", calc);
}

// ------------------ ✅ Sync real fixed bars heights ------------------
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

function observeFixedBars() {
  if (!("ResizeObserver" in window)) return;

  const header = document.querySelector(".header");
  const footer = document.querySelector(".footer");
  if (!header && !footer) return;

  const ro = new ResizeObserver(() => syncFixedBarsHeights());
  if (header) ro.observe(header);
  if (footer) ro.observe(footer);
}

// ------------------ Theme toggle ------------------
function bindThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  const isDark = currentTheme() === "dark";
  btn.setAttribute("aria-pressed", String(isDark));

  const iconEl = btn.querySelector(".toggle-icon");
  if (iconEl) iconEl.textContent = isDark ? "☀️" : "🌙";

  btn.addEventListener("click", () => {
    btn.classList.add("is-animating");
    setTimeout(() => btn.classList.remove("is-animating"), 140);
    btn.classList.toggle("is-flip");

    const next = currentTheme() === "dark" ? "light" : "dark";
    setTheme(next);

    const icon = next === "dark" ? "☀️" : "🌙";
    const iconNode = btn.querySelector(".toggle-icon");
    if (iconNode) setTimeout(() => (iconNode.textContent = icon), 150);

    btn.setAttribute("aria-pressed", String(next === "dark"));

    requestAnimationFrame(() => syncFixedBarsHeights());
  });
}

// ------------------ ✅ Mobile menu ------------------
function initMobileMenu() {
  const toggle = document.getElementById("navToggle");
  const panel = document.getElementById("mobileNav");
  if (!toggle || !panel) return;

  function open() {
    toggle.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add("is-open"));
    document.documentElement.classList.add("nav-open");
    syncFixedBarsHeights();
  }

  function close() {
    toggle.setAttribute("aria-expanded", "false");
    panel.classList.remove("is-open");
    document.documentElement.classList.remove("nav-open");
    setTimeout(() => {
      panel.hidden = true;
      syncFixedBarsHeights();
    }, 180);
  }

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    expanded ? close() : open();
  });

  // close on link click
  panel.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) close();
  });

  // close on outside click
  document.addEventListener("click", (e) => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    if (!expanded) return;
    const inside = e.target.closest(".header");
    if (!inside) close();
  });

  // close on resize to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 860) close();
  });
}

// ------------------ Partials injection ------------------
async function injectPartials() {
  const headerMount = document.querySelector('[data-partial="header"]');
  const footerMount = document.querySelector('[data-partial="footer"]');
  const base = "/portfolio";

  try {
    if (headerMount) {
      const res = await fetch(`${base}/partials/header.html?v=${BUILD_ID}`, { cache: "no-store" });
      headerMount.innerHTML = await res.text();
    }
    if (footerMount) {
      const res = await fetch(`${base}/partials/footer.html?v=${BUILD_ID}`, { cache: "no-store" });
      footerMount.innerHTML = await res.text();
    }
  } catch (e) {}

  bindThemeToggle();
  setActiveNav();
  initReadingProgress();
  initReveals();
  initMobileMenu();

  requestAnimationFrame(() => {
    syncFixedBarsHeights();
    observeFixedBars();
  });

  window.addEventListener("resize", () => syncFixedBarsHeights(), { passive: true });
}

injectPartials();