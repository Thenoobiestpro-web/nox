console.log("Nox loaded, enjoy your new tab!, this was made possible by Fluxio, check out his work at: https://github.com/Thenoobiestpro-web");

/* ─── CONFIG ────────────────────────────────────────── */
const PRESETS = {
  gradient1: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
  gradient2: "linear-gradient(135deg,#1a0000,#6b1010,#e05c00)",
  gradient3: "linear-gradient(135deg,#0a1628,#0d3b2e,#1a6b3c)",
  gradient4: "linear-gradient(135deg,#141e30,#243b55)",
  gradient5: "linear-gradient(135deg,#360033,#0b8793)",
  gradient6: "linear-gradient(135deg,#1c1c1c,#4a3728,#8b6b4a)",
  gradient7: "linear-gradient(135deg,#0a192f,#112240,#1d3557)",
  gradient8: "#0a0a0a"
};

const defaultConfig = {
  theme: "auto",
  engine: "google",
  blur: 30,
  tint: 28,
  accent: "#7aa2ff",
  showClock: true,
  showGreeting: true,
  showSeconds: false,
  greeting: "Good to see you",
  wallpaper: null,
  preset: "gradient1",
  clockSize: 56,
};

function load() {
  const saved = localStorage.getItem("Nox");
  return saved ? { ...defaultConfig, ...JSON.parse(saved) } : { ...defaultConfig };
}

let config = load();

const $ = (id) => document.getElementById(id);

/* ─── TYPING ANIMATION ──────────────────────────────── */
const phrases = [
  "Search quietly…",
  "What's on your mind?",
  "Find something…",
  "Where to?",
  "Ask anything…",
  "Go anywhere…",
  "Curious about something?",
];

let phraseIdx = 0;
let charIdx = 0;
let deleting = false;
let typingTimer;

const placeholderEl = $("placeholder-text");

function runTyper() {
  const current = phrases[phraseIdx];

  if (!deleting) {
    charIdx++;
    placeholderEl.innerHTML = current.slice(0, charIdx) + '<span class="typed-cursor"></span>';

    if (charIdx === current.length) {
      deleting = true;
      typingTimer = setTimeout(runTyper, 2200);
    } else {
      typingTimer = setTimeout(runTyper, 68);
    }
  } else {
    charIdx--;
    placeholderEl.innerHTML = current.slice(0, charIdx) + '<span class="typed-cursor"></span>';

    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingTimer = setTimeout(runTyper, 320);
    } else {
      typingTimer = setTimeout(runTyper, 38);
    }
  }
}

runTyper();

/* placeholder visibility is now handled entirely by CSS :focus-within */

/* ─── CLOCK ─────────────────────────────────────────── */
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');

  $("clock").textContent = config.showSeconds ? `${h}:${m}:${s}` : `${h}:${m}`;
  $("date-line").textContent = `${DAYS[now.getDay()]}  ·  ${MONTHS[now.getMonth()]} ${now.getDate()}`;
}

setInterval(updateClock, 1000);
updateClock();

/* ─── BACKGROUND ────────────────────────────────────── */
function applyBackground() {
  const el = $("wallpaper");

  if (config.wallpaper) {
    el.style.background = `url(${config.wallpaper}) center/cover no-repeat`;
  } else if (config.preset && PRESETS[config.preset]) {
    el.style.backgroundImage = "";
    el.style.background = PRESETS[config.preset];
  } else {
    el.style.backgroundImage = "";
    el.style.background = PRESETS.gradient1;
  }
}

/* ─── APPLY ALL SETTINGS ─────────────────────────────── */

function showToast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText = `
    position:fixed; bottom:80px; left:50%; transform:translateX(-50%);
    background:rgba(20,20,30,0.92); color:rgba(255,255,255,0.85);
    font-size:13px; padding:10px 18px; border-radius:99px;
    border:1px solid rgba(255,255,255,0.1); backdrop-filter:blur(12px);
    z-index:999; white-space:nowrap; pointer-events:none;
    animation:fadeToast 3s ease forwards;
  `;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function applySettings() {
  /* overlay */
  $("overlay").style.backdropFilter = `blur(${config.blur}px)`;
  $("overlay").style.webkitBackdropFilter = `blur(${config.blur}px)`;
  $("overlay").style.background = `rgba(0,0,0,${config.tint / 100})`;

  /* widgets visibility */
  $("clock").style.display    = config.showClock    ? "block" : "none";
  $("greeting").style.display = config.showGreeting ? "block" : "none";

  /* clock size */
  $("clock").style.fontSize = config.clockSize + "px";

  /* greeting text */
  $("greeting").textContent = config.greeting;

  /* accent */
  document.body.style.setProperty("--accent", config.accent);
  document.body.style.setProperty("--accent-glow", hexToRgba(config.accent, 0.35));

  /* engine pills */
  document.querySelectorAll(".pill").forEach(p => {
    p.classList.toggle("active", p.dataset.engine === config.engine);
  });

  /* preset selection highlight */
  document.querySelectorAll(".preset").forEach(p => {
    p.classList.toggle("selected", p.dataset.preset === config.preset && !config.wallpaper);
  });

  /* sync controls */
  $("theme").value         = config.theme;
  $("blur").value          = config.blur;
  $("blur-val").textContent = config.blur;
  $("tint").value          = config.tint;
  $("accent").value        = config.accent;
  $("clockToggle").checked  = config.showClock;
  $("greetToggle").checked  = config.showGreeting;
  $("secondsToggle").checked = config.showSeconds;
  $("customGreeting").value = config.greeting;
  $("fontsize").value       = config.clockSize;

  applyBackground();
}

function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

function save() {
  try {
    localStorage.setItem("Nox", JSON.stringify(config));
  } catch (e) {
    const slim = { ...config, wallpaper: null };
    localStorage.setItem("Nox", JSON.stringify(slim));
    showToast("Wallpaper too large to save — it'll reset on refresh.");
  }
}

/* ─── SEARCH ────────────────────────────────────────── */
function isLikelyURL(str) {
  if (/^https?:\/\//i.test(str)) return true;   // already has protocol
  if (/\s/.test(str)) return false;             // spaces = definitely a search
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+([\/?#].*)?$/i.test(str); // looks like a domain
}

$("search").addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const raw = e.target.value.trim();
  if (!raw) return;

  if (isLikelyURL(raw)) {
    window.location.href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    return;
  }

  const q = encodeURIComponent(raw);
  const engines = {
    google:     `https://www.google.com/search?q=${q}`,
    duckduckgo: `https://duckduckgo.com/?q=${q}`,
    brave:      `https://search.brave.com/search?q=${q}`,
    bing:       `https://www.bing.com/search?q=${q}`,
    startpage:  `https://www.startpage.com/do/search?q=${q}`
  };

  window.location.href = engines[config.engine] || engines.google;
});

/* engine pills */
document.querySelectorAll(".pill").forEach(pill => {
  pill.addEventListener("click", () => {
    config.engine = pill.dataset.engine;
    save();
    applySettings();
  });
});

/* ─── SETTINGS PANEL ────────────────────────────────── */
$("settings-btn").onclick = () => {
  const panel = $("settings-panel");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
};

$("close-settings").onclick = () => {
  $("settings-panel").style.display = "none";
};

/* close on outside click */
document.addEventListener("click", (e) => {
  const panel = $("settings-panel");
  if (panel.style.display === "block" &&
      !panel.contains(e.target) &&
      e.target !== $("settings-btn") &&
      !$("settings-btn").contains(e.target)) {
    panel.style.display = "none";
  }
});

/* ─── CONTROLS ──────────────────────────────────────── */
$("blur").oninput = (e) => {
  config.blur = +e.target.value;
  $("blur-val").textContent = config.blur;
  applySettings(); save();
};

$("tint").oninput = (e) => {
  config.tint = +e.target.value;
  applySettings(); save();
};

$("theme").onchange  = (e) => { config.theme  = e.target.value; save(); };

$("accent").oninput = (e) => {
  config.accent = e.target.value;
  applySettings(); save();
};

$("clockToggle").onchange  = (e) => { config.showClock    = e.target.checked; applySettings(); save(); };
$("greetToggle").onchange  = (e) => { config.showGreeting = e.target.checked; applySettings(); save(); };
$("secondsToggle").onchange = (e) => { config.showSeconds  = e.target.checked; applySettings(); save(); };

$("customGreeting").oninput = (e) => { config.greeting = e.target.value; applySettings(); save(); };

$("fontsize").onchange = (e) => { config.clockSize = +e.target.value; applySettings(); save(); };

/* ─── PRESETS ───────────────────────────────────────── */
document.querySelectorAll(".preset").forEach(p => {
  p.addEventListener("click", () => {
    config.preset   = p.dataset.preset;
    config.wallpaper = null;
    applySettings(); save();
  });
});

/* ─── WALLPAPER UPLOAD ──────────────────────────────── */
$("wallpaperUpload").onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const max = 1920;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    canvas.width  = img.width  * scale;
    canvas.height = img.height * scale;
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    config.wallpaper = canvas.toDataURL("image/jpeg", 0.82);
    config.preset    = null;
    URL.revokeObjectURL(url);
    applySettings(); save();
    showToast("Wallpaper set — may not persist on refresh.");
  };
  img.src = url;
};

$("removeWallpaper").onclick = () => {
  config.wallpaper = null;
  config.preset    = "gradient1";
  applySettings(); save();
};

/* ─── IMPORT / EXPORT ───────────────────────────────── */
$("exportBtn").onclick = () => {
  $("importBox").value = JSON.stringify(config, null, 2);
};

$("importBtn").onclick = () => {
  try {
    config = { ...defaultConfig, ...JSON.parse($("importBox").value) };
    save();
    applySettings();
  } catch (e) {
    alert("Invalid JSON — check the format and try again.");
  }
};

/* ─── SUGGESTIONS ───────────────────────────────────── */
const suggestEl = $("suggestions");
let activeSuggestion = -1;
let suggestDebounce;
let currentSuggestions = [];

function renderSuggestions(items, query) {
  if (!items.length) { hideSuggestions(); return; }
  currentSuggestions = items;
  activeSuggestion = -1;

  suggestEl.innerHTML = items.map((text, i) => {
    const lower = text.toLowerCase();
    const q = query.toLowerCase();
    const idx = lower.indexOf(q);
    let label = text;
    if (idx !== -1) {
      label = text.slice(0, idx)
        + `<span class="suggestion-match">${text.slice(idx, idx + q.length)}</span>`
        + text.slice(idx + q.length);
    }
    return `
      <div class="suggestion-item" data-index="${i}" style="animation-delay:${i * 0.04}s">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>${label}</span>
      </div>`;
  }).join("");

  suggestEl.style.display = "block";
  requestAnimationFrame(() => suggestEl.classList.add("visible"));

  suggestEl.querySelectorAll(".suggestion-item").forEach(el => {
    el.addEventListener("mousedown", (e) => {
      e.preventDefault();
      const text = currentSuggestions[+el.dataset.index];
      $("search").value = text;
      hideSuggestions();
      $("search").dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    });
  });
}

function hideSuggestions() {
  suggestEl.classList.remove("visible");
  setTimeout(() => {
    suggestEl.style.display = "none";
    suggestEl.innerHTML = "";
    activeSuggestion = -1;
    currentSuggestions = [];
  }, 200);
}

async function fetchSuggestions(query) {
  if (!query) { hideSuggestions(); return; }
  try {
    const target = encodeURIComponent(
      `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=list`
    );
    const res = await fetch(
      `https://corsproxy.io/?url=${target}`,
      { signal: AbortSignal.timeout(2500) }
    );
    if (!res.ok) throw new Error("bad response");
    const data = await res.json();
    renderSuggestions((data[1] || []).slice(0, 6), query);
  } catch {
    hideSuggestions();
  }
}

$("search").addEventListener("input", () => {
  const val = $("search").value;
  $("search-wrap").classList.toggle("has-value", val.length > 0);
  clearTimeout(suggestDebounce);
  suggestDebounce = setTimeout(() => fetchSuggestions(val.trim()), 0);
});

$("search").addEventListener("keydown", (e) => {
  if (suggestEl.style.display !== "block") return;
  const items = suggestEl.querySelectorAll(".suggestion-item");
  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeSuggestion = Math.min(activeSuggestion + 1, items.length - 1);
    items.forEach((el, i) => el.classList.toggle("active", i === activeSuggestion));
    if (activeSuggestion >= 0) $("search").value = currentSuggestions[activeSuggestion];
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeSuggestion = Math.max(activeSuggestion - 1, -1);
    items.forEach((el, i) => el.classList.toggle("active", i === activeSuggestion));
    if (activeSuggestion >= 0) $("search").value = currentSuggestions[activeSuggestion];
  } else if (e.key === "Escape") {
    hideSuggestions();
  }
});

$("search").addEventListener("blur", () => {
  setTimeout(hideSuggestions, 150);
});

/* ─── TUTORIAL TABS ─────────────────────────────────── */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tutorial-content").forEach(c => c.style.display = "none");
    btn.classList.add("active");
    $("tab-" + btn.dataset.tab).style.display = "block";
  });
});

/* ─── INIT ──────────────────────────────────────────── */
applySettings();
