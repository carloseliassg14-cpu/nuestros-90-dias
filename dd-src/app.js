/* ------------------------------------------------------------------
   app.js · Día a día — planificador del día y finanzas personales
   Personas: Carlos y Hannah (cada uno con lo suyo, por separado)
   Datos: base de datos del artifact (capacidad "db"); si no está
   disponible, se guarda en este dispositivo (localStorage).
   Gmail: capacidad "mcp" (conector Gmail de quien abre la página).
   © 2026 Carlos Salas González. Todos los derechos reservados.
------------------------------------------------------------------- */
{
"use strict";
const PEOPLE = ["carlos", "hannah"];
const NAMES = { carlos: "Carlos", hannah: "Hannah" };
const CATS = ["train", "study", "work", "health", "personal", "social", "rest", "faith"];
const ECATS = ["market", "food", "fuel", "transport", "subs", "home", "health", "sport", "clothes", "travel", "study", "gifts", "fun", "trading", "shipping", "other"];
const ICATS = ["photo", "closer", "biz", "trading", "salary", "gift", "other"];
const ECOL = { market: "#16a34a", food: "#e5483a", fuel: "#b45309", transport: "#0891b2", subs: "#2563eb", home: "#64748b", health: "#0d9488", sport: "#ea580c", clothes: "#475569", travel: "#0284c7", study: "#1d4ed8", gifts: "#be123c", fun: "#d97706", trading: "#0f766e", shipping: "#a16207", other: "#9ca3af" };
const ICOL = { photo: "#0f766e", closer: "#2563eb", biz: "#a16207", trading: "#0d9488", salary: "#16a34a", gift: "#be123c", other: "#9ca3af" };
const SYM = { CRC: "₡", USD: "$", EUR: "€" };
const DEF_CFG = {
  carlos: { lang: "es", h24: false, base: "CRC", rates: { USD: 445, EUR: 515 }, budget: 0, since: "2026-11-01", lastSync: 0 },
  hannah: { lang: "de", h24: true, base: "EUR", rates: { USD: 445, EUR: 515 }, budget: 0 }
};
const DUR = [15, 30, 45, 60, 90, 120, 180];

/* ---------- small helpers ---------- */
const $ = (id) => document.getElementById(id);
const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = (n) => String(n).padStart(2, "0");
const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseKey = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const mondayOf = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); const w = (x.getDay() + 6) % 7; return addDays(x, -w); };
const toMin = (s) => { const m = /^(\d{1,2}):(\d{2})$/.exec(String(s || "")); return m ? Math.min(1440, +m[1] * 60 + +m[2]) : NaN; };
const toHHMM = (n) => `${pad(Math.floor(Math.min(n, 1439) / 60))}:${pad(Math.min(n, 1439) % 60)}`;
const clone = (o) => JSON.parse(JSON.stringify(o == null ? null : o));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const todayKey = () => keyOf(new Date());
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const timeout = (p, ms) => Promise.race([p, sleep(ms).then(() => null)]);
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

/* ---------- state ---------- */
const HASH2TAB = { "#semana": "week", "#dinero": "money", "#alimentacion": "food", "#entrenamiento": "train" };
const TAB2HASH = { week: "semana", money: "dinero", food: "alimentacion", train: "entrenamiento" };
const EMBED = /[?&]embed=1/.test(location.search);
if (EMBED) document.documentElement.classList.add("embed");
const HC = lsGet("hc90:v1", {}) || {};
const S = {
  person: PEOPLE.includes(HC.person) ? HC.person : PEOPLE.includes(lsGet("dd.person")) ? lsGet("dd.person") : "carlos",
  tab: (() => { const m = /[?&]tab=(day|week|money|food|train)\b/.exec(location.search); return m ? m[1] : HASH2TAB[location.hash] || "day"; })(),
  hDate: todayKey(),
  date: todayKey(),
  base: null,          // weekday (0-6) while editing the base week, else null
  weekBase: false,     // week view shows the base week
  month: todayKey().slice(0, 7),
  filter: "all",
  ready: false, slow: false
};
const D = { plans: {}, tpl: {}, tx: {}, cfg: {} };

const cfgOf = (p = S.person) => {
  const c = Object.assign(clone(DEF_CFG[p]), D.cfg[p] || {});
  c.rates = Object.assign({}, DEF_CFG[p].rates, (D.cfg[p] || {}).rates || {});
  if (!(D.cfg[p] && D.cfg[p].lang) && I18N[HC.lang]) c.lang = HC.lang;
  if (!I18N[c.lang]) c.lang = DEF_CFG[p].lang;
  if (!SYM[c.base]) c.base = DEF_CFG[p].base;
  return c;
};
const T = () => I18N[cfgOf().lang];

/* ---------- time & money formatting ---------- */
function fmtTime(min, h24 = cfgOf().h24) {
  min = Math.max(0, Math.min(1440, Math.round(min)));
  let h = Math.floor(min / 60) % 24, m = min % 60;
  if (min === 1440) { h = 0; }
  if (h24) return `${min === 1440 ? 24 : h}:${pad(m)}`;
  const ap = h < 12 ? "am" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${ap}`;
}
function fmtDur(min) {
  min = Math.max(0, Math.round(min));
  const h = Math.floor(min / 60), m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m}` : `${h} h`;
}
function fmtMoney(v, cur, lang = cfgOf().lang) {
  const d = cur === "CRC" ? 0 : 2;
  const loc = lang === "de" ? "de-DE" : "en-US";
  const n = new Intl.NumberFormat(loc, { minimumFractionDigits: d, maximumFractionDigits: d }).format(Math.abs(v));
  const s = v < 0 ? "−" : "";
  if (lang === "de" && cur === "EUR") return `${s}${n} €`;
  return `${s}${SYM[cur] || cur + " "}${n}`;
}
const toBase = (amt, cur, c = cfgOf()) => {
  const r = { CRC: 1, USD: +c.rates.USD || 1, EUR: +c.rates.EUR || 1 };
  return amt * (r[cur] || 1) / (r[c.base] || 1);
};
function dayLabel(k) {
  const t = T(), d = parseKey(k), tk = todayKey();
  if (k === tk) return t.today;
  if (k === keyOf(addDays(parseKey(tk), 1))) return t.tomorrow;
  if (k === keyOf(addDays(parseKey(tk), -1))) return t.yesterday;
  return `${t.wdLong[d.getDay()]} ${d.getDate()}`;
}
function niceDate(k) {
  const t = T(), d = parseKey(k), L = cfgOf().lang;
  if (L === "de") return `${t.wdLong[d.getDay()]}, ${d.getDate()}. ${t.months[d.getMonth()]}`;
  if (L === "en") return `${t.wdLong[d.getDay()]}, ${t.months[d.getMonth()]} ${d.getDate()}`;
  return `${t.wdLong[d.getDay()]} ${d.getDate()} de ${t.months[d.getMonth()]}`;
}
const shortDate = (k) => { const t = T(), d = parseKey(k), L = cfgOf().lang; return L === "en" ? `${t.months[d.getMonth()].slice(0, 3)} ${d.getDate()}` : L === "de" ? `${d.getDate()}. ${t.months[d.getMonth()].slice(0, 3)}` : `${d.getDate()} ${t.months[d.getMonth()].slice(0, 3)}`; };

/* ---------- storage: cloud (artifact db) or this device ---------- */
const FB_CFG = { apiKey: "AIzaSyB_BUu6ey88OXAo6KTWm0Q3HF1uL9WJCbQ", authDomain: "nuestros-90-dias.firebaseapp.com", projectId: "nuestros-90-dias", storageBucket: "nuestros-90-dias.firebasestorage.app", messagingSenderId: "420233303737", appId: "1:420233303737:web:27829caf35659171542d68" };
const FB_V = "https://www.gstatic.com/firebasejs/10.12.2/";
const Store = {
  db: null, mode: "local", subs: [], fs: null,
  async init() {
    try {
      const code = (() => { try { return localStorage.getItem("hc90:v1:code") || ""; } catch (e) { return ""; } })();
      if (!window.claude && /^[a-z0-9-]{20,64}$/.test(code)) {
        const A = await import(FB_V + "firebase-app.js");
        const F = await import(FB_V + "firebase-firestore.js");
        const app = (A.getApps().find((a) => a.name === "dd")) || A.initializeApp(FB_CFG, "dd");
        let db;
        try { db = F.initializeFirestore(app, { localCache: F.persistentLocalCache({ tabManager: F.persistentMultipleTabManager() }) }); }
        catch (e) { db = F.getFirestore(app); }
        this.fs = { F, db, code }; this.mode = "fire";
        return;
      }
    } catch (e) { this.fs = null; this.mode = "local"; }
    try {
      if (window.claude && typeof window.claude.use === "function") {
        const db = await timeout(window.claude.use("db"), 10000);
        if (db && typeof db.collection === "function") { this.db = db; this.mode = "cloud"; }
      }
    } catch (e) {}
  },
  localAll() { return lsGet("dd.data.v1", { plans: {}, tpl: {}, tx: {}, cfg: {} }); },
  watch(coll, cb, err) {
    if (this.mode === "fire") {
      const { F, db, code } = this.fs;
      return F.onSnapshot(F.collection(db, "couples", code, coll), (snap) => {
        const o = {};
        snap.forEach((d) => { o[d.id] = d.data(); });
        cb(o, { fromCache: snap.metadata.fromCache });
      }, err);
    }
    if (this.mode === "cloud") {
      return this.db.collection(coll).onSnapshot((snap) => {
        const o = {};
        snap.docs.forEach((d) => { if (d.exists) o[d.id] = d.data(); });
        cb(o, snap.metadata || {});
      }, err);
    }
    const fire = () => cb(clone(this.localAll()[coll] || {}), { fromCache: false });
    this.subs.push({ coll, fire });
    setTimeout(fire, 0);
    return () => {};
  },
  async write(coll, id, data) {
    if (this.mode === "fire") {
      const { F, db, code } = this.fs;
      const ref = F.doc(db, "couples", code, coll, id);
      if (data === null) await F.deleteDoc(ref); else await F.setDoc(ref, JSON.parse(JSON.stringify(data)));
      return;
    }
    if (this.mode === "cloud") {
      const ref = this.db.collection(coll).doc(id);
      if (data === null) await ref.delete(); else await ref.set(data);
      return;
    }
    const all = this.localAll();
    all[coll] = all[coll] || {};
    if (data === null) delete all[coll][id]; else all[coll][id] = data;
    lsSet("dd.data.v1", all);
  }
};

// One write at a time per document; the newest pending value wins.
const pend = {}, busy = {};
function put(coll, id, data) {
  if (data === null) delete D[coll][id]; else D[coll][id] = data;
  const k = coll + "/" + id;
  pend[k] = { coll, id, data };
  pump(k);
}
async function pump(k) {
  if (busy[k]) return;
  busy[k] = true;
  while (pend[k]) {
    const w = pend[k]; delete pend[k];
    try { await Store.write(w.coll, w.id, w.data); }
    catch (e) {
      const c = e && e.code;
      if (c === "permission-denied") { toast(T().noPerm); continue; }
      if (c === "unavailable") { await sleep(600 + Math.random() * 600); if (!pend[k]) pend[k] = w; continue; }
      toast(c === "invalid_argument" ? T().noPerm : c === "quota_exceeded" ? T().full : T().writeErr);
    }
  }
  busy[k] = false;
  if (Store.mode === "local") Store.subs.forEach((s) => s.coll === k.split("/")[0] && s.fire());
}

/* ---------- data access ---------- */
const planId = (p, k) => `${p}_${k}`;
const tplId = (p, wd) => `${p}_w${wd}`;
const sortB = (a) => a.slice().sort((x, y) => x.s - y.s || x.e - y.e);
function blocksOf(target) {
  const doc = target.kind === "tpl" ? D.tpl[tplId(S.person, target.wd)] : D.plans[planId(S.person, target.date)];
  return doc && Array.isArray(doc.blocks) ? sortB(doc.blocks.filter((b) => b && isFinite(b.s) && isFinite(b.e))) : [];
}
function setBlocks(target, blocks) {
  blocks = sortB(blocks);
  if (target.kind === "tpl") {
    const id = tplId(S.person, target.wd);
    put("tpl", id, blocks.length ? { person: S.person, wd: target.wd, blocks: blocks.map(({ done, ...b }) => b), updated: Date.now() } : null);
  } else {
    const id = planId(S.person, target.date);
    put("plans", id, blocks.length ? { person: S.person, date: target.date, blocks, updated: Date.now() } : null);
  }
}
const curTarget = () => S.base !== null ? { kind: "tpl", wd: S.base } : { kind: "plan", date: S.date };
const txOf = (p = S.person) => Object.entries(D.tx).filter(([, v]) => v && v.person === p).map(([id, v]) => Object.assign({ id }, v));

/* ---------- toast ---------- */
let toastT = 0;
function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => el.classList.remove("show"), 2600);
}

/* ---------- icons ---------- */
const IC = {
  day: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  week: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  money: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M7 15h4"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  left: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  right: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  sync: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4"/></svg>'
};

/* ---------- top bar & tabs ---------- */
function renderChrome() {
  const t = T();
  document.body.className = "p-" + S.person;
  document.documentElement.lang = t.loc.slice(0, 2);
  document.querySelectorAll(".who button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.p === S.person)));
  $("who").setAttribute("aria-label", t.who);
  $("gear").setAttribute("aria-label", t.settings);
  const tabs = { day: t.tabDay, week: t.tabWeek, money: t.tabMoney, food: t.tabFood, train: t.tabTrain };
  document.querySelectorAll(".tabs button").forEach((b) => {
    b.querySelector("span").textContent = tabs[b.dataset.tab];
    b.setAttribute("aria-current", b.dataset.tab === S.tab ? "page" : "false");
  });
  const st = $("status");
  if (!S.ready) { st.textContent = S.slow ? t.slow : t.loading; st.classList.toggle("warn", S.slow); st.classList.remove("hidden"); }
  else if (S.slow) { st.textContent = t.slow; st.classList.add("warn"); st.classList.remove("hidden"); }
  else st.classList.add("hidden");
}
function render() {
  renderChrome();
  $("v-day").classList.toggle("hidden", S.tab !== "day");
  $("v-week").classList.toggle("hidden", S.tab !== "week");
  $("v-money").classList.toggle("hidden", S.tab !== "money");
  $("v-food").classList.toggle("hidden", S.tab !== "food");
  $("v-train").classList.toggle("hidden", S.tab !== "train");
  if (S.tab === "day") renderDay();
  else if (S.tab === "week") renderWeek();
  else if (S.tab === "food") renderFood();
  else if (S.tab === "train") renderTrain();
  else renderMoney();
}

/* ================================================================
   MI DÍA
================================================================= */
function dialSVG(blocks, isToday, isBase) {
  const R = 98, C = 120, SW = 22;
  const ang = (m) => (m / 1440) * Math.PI * 2 - Math.PI / 2;
  const pt = (a, r) => [C + r * Math.cos(a), C + r * Math.sin(a)];
  const arc = (s, e) => {
    const gap = 0.012, a0 = ang(s) + gap, a1 = Math.max(a0 + 0.01, ang(e) - gap);
    const [x0, y0] = pt(a0, R), [x1, y1] = pt(a1, R);
    return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  };
  const h24 = cfgOf().h24;
  const lab = [[0, h24 ? "0" : "12 am"], [360, h24 ? "6" : "6 am"], [720, h24 ? "12" : "12 pm"], [1080, h24 ? "18" : "6 pm"]];
  let s = `<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="var(--bg)" stroke-width="${SW}"/>`;
  for (let h = 0; h < 24; h++) { const [x0, y0] = pt(ang(h * 60), R + SW / 2 + 3), [x1, y1] = pt(ang(h * 60), R + SW / 2 + (h % 6 ? 6 : 9)); s += `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="var(--soft)" stroke-width="${h % 6 ? 1 : 2}" stroke-linecap="round" opacity=".55"/>`; }
  blocks.forEach((b) => {
    const col = `var(--c-${CATS.includes(b.c) ? b.c : "personal"})`;
    const on = isBase || b.done;
    s += `<path d="${arc(b.s, b.e)}" fill="none" stroke="${col}" stroke-width="${SW}" opacity="${on ? 1 : 0.38}"/>`;
  });
  if (isToday) {
    const a = ang(nowMin()), [x0, y0] = pt(a, R - SW / 2 - 10), [x1, y1] = pt(a, R + SW / 2 + 2);
    s += `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="var(--bad)" stroke-width="3" stroke-linecap="round"/>`;
  }
  lab.forEach(([m, l]) => { const [x, y] = pt(ang(m), R - SW / 2 - 16); s += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="11" font-weight="700" fill="var(--soft)">${l}</text>`; });
  return `<svg viewBox="0 0 240 240" aria-hidden="true">${s}</svg>`;
}

function renderDay() {
  const t = T(), isBase = S.base !== null, target = curTarget();
  const blocks = blocksOf(target);
  const tk = todayKey(), isToday = !isBase && S.date === tk;
  const planned = blocks.reduce((a, b) => a + (b.e - b.s), 0);
  const doneMin = blocks.reduce((a, b) => a + (b.done ? b.e - b.s : 0), 0);
  const doneN = blocks.filter((b) => b.done).length;
  const pct = planned ? Math.round((doneMin / planned) * 100) : 0;
  const nm = nowMin();
  const cur = isToday ? blocks.find((b) => b.s <= nm && nm < b.e) : null;
  const nxt = isToday ? blocks.find((b) => b.s > nm) : blocks[0];

  // week strip
  const mon = mondayOf(parseKey(S.date));
  let strip = `<button class="nav" data-act="wk-prev" aria-label="‹">${IC.left}</button>`;
  for (let i = 0; i < 7; i++) {
    const d = addDays(mon, i), k = keyOf(d);
    const has = !!(D.plans[planId(S.person, k)] && (D.plans[planId(S.person, k)].blocks || []).length);
    strip += `<button class="d${k === tk ? " today" : ""}${has ? " has" : ""}" data-act="pick-day" data-k="${k}" aria-pressed="${k === S.date}" aria-label="${esc(niceDate(k))}"><small>${esc(t.wd[d.getDay()])}</small><b>${d.getDate()}</b><i></i></button>`;
  }
  strip += `<button class="nav" data-act="wk-next" aria-label="›">${IC.right}</button>`;

  const wdName = isBase ? t.wdLong[S.base] : "";
  const head = isBase
    ? `<h1>${esc(t.baseTitle(wdName))}</h1><p class="sub">${esc(t.baseHelp + wdName + ".")}</p>`
    : `<h1>${esc(dayLabel(S.date))}</h1><p class="sub">${esc(niceDate(S.date))}</p><div class="strip">${strip}</div>`;

  const nowBox = isBase ? "" : `<div class="nowbox">
      <div><small>${esc(isToday ? t.now : t.next)}</small><b>${esc(isToday ? (cur ? cur.t : t.nothingNow) : (nxt ? nxt.t : "—"))}</b></div>
      <div><small>${esc(isToday ? t.next : t.blocks(blocks.length))}</small><b>${isToday ? (nxt ? `${esc(fmtTime(nxt.s))} · ${esc(nxt.t)}` : "—") : esc(planned ? fmtDur(planned) : "—")}</b></div>
    </div>`;
  const dialMid = isBase
    ? `<div class="pct" style="font-size:clamp(30px,8vw,40px)">${esc(fmtDur(planned))}</div><div class="lbl">${esc(t.planned)}</div>`
    : `<div class="pct">${planned ? pct : "–"}<small>${planned ? "%" : ""}</small></div><div class="lbl">${esc(blocks.length ? `${doneN} ${t.of} ${blocks.length} ${t.done}` : t.blocks(0))}</div>`;
  const stats = isBase ? "" : `<div class="stats"><div><b>${esc(fmtDur(planned))}</b><small>${esc(t.planned)}</small></div><div><b>${esc(fmtDur(doneMin))}</b><small>${esc(t.doneH)}</small></div><div><b>${esc(fmtDur(planned - doneMin))}</b><small>${esc(t.left)}</small></div></div>`;

  // timeline
  let list = "";
  if (!blocks.length) {
    const hasTpl = !isBase && blocksOf({ kind: "tpl", wd: parseKey(S.date).getDay() }).length;
    list = `<div class="empty"><p><b>${esc(isBase ? t.emptyBase : t.emptyDay)}</b></p><p class="muted">${esc(t.emptyDayHelp)}</p>
      <div class="row" style="justify-content:center;margin-top:14px">${hasTpl ? `<button class="btn pri" data-act="load-base">${esc(t.loadBase)}</button>` : ""}<button class="btn${hasTpl ? "" : " pri"}" data-act="new-block">${IC.plus}${esc(t.add)}</button></div></div>`;
  } else {
    let prevEnd = null, nowPlaced = !isToday;
    const nowRow = `<li class="nowline" aria-hidden="true"><span>${esc(fmtTime(nm))}</span><i></i></li>`;
    blocks.forEach((b) => {
      if (!nowPlaced && nm < b.s) { list += nowRow; nowPlaced = true; }
      if (prevEnd !== null && b.s - prevEnd >= 15) list += `<li class="gap"><span></span><button data-act="new-block" data-s="${prevEnd}" data-e="${Math.min(b.s, prevEnd + 60)}">${esc(t.free)} · ${esc(fmtDur(b.s - prevEnd))} · + ${esc(t.addHere)}</button></li>`;
      const c = CATS.includes(b.c) ? b.c : "personal";
      const on = isToday && b.s <= nm && nm < b.e;
      if (on) nowPlaced = true;
      list += `<li class="blk${b.done && !isBase ? " done" : ""}${on ? " on" : ""}" style="--c:var(--c-${c})">
        <div class="tm"><b>${esc(fmtTime(b.s))}</b><small>${esc(fmtTime(b.e))}</small></div>
        <div class="cd" role="group">
          <span class="sw" aria-hidden="true"></span>
          <button class="tx" data-act="edit-block" data-id="${esc(b.id)}" style="border:0;background:transparent;text-align:left;padding:0;min-height:44px"><span class="tt">${esc(b.t)}</span><span class="mt">${esc(t.cats[c])} · ${esc(fmtDur(b.e - b.s))}${b.n ? " · " + esc(b.n) : ""}</span></button>
          ${isBase ? "" : `<button class="chk" data-act="toggle" data-id="${esc(b.id)}" aria-pressed="${!!b.done}" aria-label="${esc(b.t)}">${IC.check}</button>`}
        </div></li>`;
      prevEnd = Math.max(prevEnd || 0, b.e);
    });
    if (!nowPlaced) list += nowRow;
    list = `<ul class="tl">${list}</ul>`;
  }

  const bar = isBase
    ? `<div class="base-banner"><p>${esc(t.baseHelp + wdName + ".")}</p><button class="btn pri" data-act="base-done">${esc(t.baseDone)}</button></div>`
    : "";
  $("v-day").innerHTML = `${head}${isBase ? "" : jarvisCard(S.date)}
    <div class="dayg">
      <div class="dial-card"><div class="dial">${dialSVG(blocks, isToday, isBase)}<div class="mid">${dialMid}</div></div>${nowBox}${stats}</div>
      <div>${bar}<div class="daybar"><span class="t">${esc(t.blocks(blocks.length))}</span><button class="btn pri" data-act="new-block">${IC.plus}${esc(t.add)}</button><button class="icon-btn" data-act="more" aria-label="${esc(t.more)}">${IC.dots}</button></div>${list}</div>
    </div>`;
}

/* ================================================================
   SEMANA
================================================================= */
function renderWeek() {
  const t = T(), mon = mondayOf(parseKey(S.date)), tk = todayKey();
  const H0 = 300, H1 = 1440, span = H1 - H0;
  const totals = {};
  let rows = "";
  for (let i = 0; i < 7; i++) {
    const d = addDays(mon, i), k = keyOf(d), wd = d.getDay();
    const blocks = S.weekBase ? blocksOf({ kind: "tpl", wd }) : blocksOf({ kind: "plan", date: k });
    const planned = blocks.reduce((a, b) => a + (b.e - b.s), 0);
    const doneMin = blocks.reduce((a, b) => a + (b.done ? b.e - b.s : 0), 0);
    blocks.forEach((b) => { const c = CATS.includes(b.c) ? b.c : "personal"; totals[c] = (totals[c] || 0) + (b.e - b.s); });
    const segs = blocks.map((b) => {
      const s = Math.max(b.s, H0), e = Math.min(b.e, H1); if (e <= s) return "";
      const c = CATS.includes(b.c) ? b.c : "personal";
      return `<i class="${S.weekBase || b.done ? "" : "p"}" style="--c:var(--c-${c});left:${((s - H0) / span * 100).toFixed(2)}%;width:${Math.max(0.6, (e - s) / span * 100).toFixed(2)}%"></i>`;
    }).join("");
    const right = S.weekBase ? `<b>${esc(planned ? fmtDur(planned) : "—")}</b>` : `<b>${planned ? Math.round(doneMin / planned * 100) + "%" : "—"}</b><small>${esc(planned ? fmtDur(planned) : "")}</small>`;
    rows += `<button class="wrow${!S.weekBase && k === tk ? " today" : ""}" data-act="${S.weekBase ? "open-base" : "pick-day"}" data-k="${k}" data-wd="${wd}">
      <span class="wd"><b>${esc(t.wd[wd])}</b><small>${S.weekBase ? "" : esc(shortDate(k))}</small></span>
      <span class="wbar">${segs}</span><span class="pc">${right}</span></button>`;
  }
  const h24 = cfgOf().h24;
  const ax = [300, 720, 1080, 1440].map((m) => `<span>${esc(h24 ? String(m / 60) : fmtTime(m).replace(":00", ""))}</span>`).join("");
  const all = Object.values(totals).reduce((a, b) => a + b, 0);
  const max = Math.max(1, ...Object.values(totals));
  const bars = all ? `<div class="bars">${CATS.filter((c) => totals[c]).sort((a, b) => totals[b] - totals[a]).map((c) => `<div class="bar" style="--c:var(--c-${c})"><span class="nm"><i></i>${esc(t.cats[c])}</span><span class="tr"><i style="width:${(totals[c] / max * 100).toFixed(1)}%"></i></span><span class="v">${esc(fmtDur(totals[c]))}</span></div>`).join("")}</div>` : `<p class="muted">${esc(t.weekEmpty)}</p>`;
  const title = S.weekBase ? t.editBase : t.weekOf(shortDate(keyOf(mon)), shortDate(keyOf(addDays(mon, 6))));
  $("v-week").innerHTML = `<h1>${esc(title)}</h1>
    <div class="row" style="margin:12px 0 16px">
      ${S.weekBase ? "" : `<button class="icon-btn" data-act="wk-prev" aria-label="‹">${IC.left}</button><button class="btn" data-act="wk-today">${esc(t.today)}</button><button class="icon-btn" data-act="wk-next" aria-label="›">${IC.right}</button>`}
      <span style="flex:1"></span>
      <button class="btn${S.weekBase ? " pri" : ""}" data-act="toggle-weekbase" aria-pressed="${S.weekBase}">${esc(S.weekBase ? t.baseDone : t.editBase)}</button>
    </div>
    <div class="wk">${rows}</div>
    <div class="axis" aria-hidden="true"><span></span><div>${ax}</div><span></span></div>
    <h2>${esc(t.weekHours)}</h2>${bars}`;
}

/* ================================================================
   DINERO
================================================================= */
function monthTx(withHidden) {
  return txOf().filter((x) => String(x.date || "").slice(0, 7) === S.month && (withHidden || !x.hidden));
}
function renderMoney() {
  const t = T(), c = cfgOf(), cur = c.base;
  const all = monthTx();
  const exp = all.filter((x) => x.kind !== "income");
  const inc = all.filter((x) => x.kind === "income");
  const sum = (arr) => arr.reduce((a, x) => a + toBase(+x.amount || 0, x.cur, c), 0);
  const pers = exp.filter((x) => (x.scope || "personal") === "personal");
  const spent = sum(pers), income = sum(inc), biz = sum(exp.filter((x) => x.scope === "biz")), back = sum(exp.filter((x) => x.scope === "back"));
  const rev = all.filter((x) => x.rev).length;
  const [y, m] = S.month.split("-").map(Number);
  const mName = `${t.months[m - 1]} ${y}`;

  // budget
  let budget = "";
  if (+c.budget > 0) {
    const p = spent / +c.budget;
    budget = `<div class="budget${p > 1 ? " over" : ""}"><div class="tr"><i style="width:${Math.min(100, p * 100).toFixed(1)}%"></i></div><small>${p > 1 ? esc(t.overBudget) + " · " : ""}${Math.round(p * 100)}% ${esc(t.budgetOf(fmtMoney(+c.budget, cur)))}</small></div>`;
  }
  // per-day chart
  const days = new Date(y, m, 0).getDate();
  const per = Array(days).fill(0);
  pers.forEach((x) => { const d = +String(x.date).slice(8, 10); if (d >= 1 && d <= days) per[d - 1] += toBase(+x.amount || 0, x.cur, c); });
  // by category
  const byCat = {};
  pers.forEach((x) => { const k = ECATS.includes(x.cat) ? x.cat : "other"; byCat[k] = (byCat[k] || 0) + toBase(+x.amount || 0, x.cur, c); });
  const cats = Object.keys(byCat).filter((k) => byCat[k] > 0).sort((a, b) => byCat[b] - byCat[a]);
  const maxC = Math.max(1, ...cats.map((k) => byCat[k]));
  const catBars = cats.length ? `<div class="bars">${cats.map((k) => `<div class="bar" style="--c:${ECOL[k]}"><span class="nm"><i></i>${esc(t.ecats[k])}</span><span class="tr"><i style="width:${(byCat[k] / maxC * 100).toFixed(1)}%"></i></span><span class="v">${esc(fmtMoney(byCat[k], cur))}</span></div>`).join("")}</div>` : `<p class="muted">—</p>`;
  const byM = { card: 0, cash: 0, transfer: 0 };
  pers.forEach((x) => { const k = byM[x.method] !== undefined ? x.method : "card"; byM[k] += toBase(+x.amount || 0, x.cur, c); });
  const methods = `<div class="kpis" style="grid-template-columns:repeat(3,minmax(0,1fr))">${Object.keys(byM).map((k) => `<div><small>${esc(t.methods[k])}</small><b>${esc(fmtMoney(byM[k], cur))}</b></div>`).join("")}</div>`;

  // sync card (only Carlos has bank emails)
  let sync = "";
  if (S.person === "carlos" && !window.claude) {
    const box = c.inbox;
    sync = `<div class="synccard"><b>${esc(t.cards)}</b><p class="muted">${esc(box ? t.jvOn : t.jvOff)}</p>${inboxMsg ? `<p class="msg ok">${esc(inboxMsg)}</p>` : ""}</div>`;
  } else if (S.person === "carlos") {
    const last = c.lastSync ? new Date(c.lastSync) : null;
    const lastTxt = last ? `${shortDate(keyOf(last))} · ${fmtTime(last.getHours() * 60 + last.getMinutes())}` : t.never;
    sync = `<div class="synccard"><div class="row"><b style="flex:1">${esc(t.cards)}</b><button class="btn pri" data-act="sync" id="syncBtn" ${syncing ? "disabled" : ""}>${IC.sync}${esc(syncing ? t.syncing : t.sync)}</button></div>
      <p class="muted">${esc(t.syncHelp)}</p><p class="muted">${esc(t.lastSync(lastTxt))}</p>
      <p class="msg ${syncMsg.kind}" id="syncMsg" role="status">${esc(syncMsg.text)}</p></div>`;
  }

  // list
  const hiddenList = monthTx(true).filter((x) => x.hidden);
  let list = all.slice();
  if (S.filter === "hidden") list = hiddenList.slice();
  else if (S.filter === "rev") list = list.filter((x) => x.rev);
  else if (S.filter === "expense") list = list.filter((x) => x.kind !== "income");
  else if (S.filter === "income") list = list.filter((x) => x.kind === "income");
  list.sort((a, b) => (b.date + (b.time || "")).localeCompare(a.date + (a.time || "")) || (b.created || 0) - (a.created || 0));
  let rows = "", lastDay = "";
  list.forEach((x) => {
    if (x.date !== lastDay) { { const dl = dayLabel(x.date); rows += `<li class="mday">${esc(/\d/.test(dl) ? dl : dl + " · " + shortDate(x.date))}</li>`; } lastDay = x.date; }
    const isInc = x.kind === "income";
    const k = isInc ? (ICATS.includes(x.cat) ? x.cat : "other") : (ECATS.includes(x.cat) ? x.cat : "other");
    const col = isInc ? ICOL[k] : ECOL[k];
    const catName = isInc ? t.icats[k] : t.ecats[k];
    const meta = [catName, isInc ? "" : t.methods[x.method] || t.methods.card, x.card ? "••" + x.card : "", !isInc && x.scope && x.scope !== "personal" ? t.scopes[x.scope] : "", +x.amount < 0 ? t.refund : ""].filter(Boolean).join(" · ");
    const base = toBase(+x.amount || 0, x.cur, c);
    const showOrig = x.cur !== cur;
    rows += `<li><button class="mv${!isInc && x.scope && x.scope !== "personal" ? " off" : ""}" data-act="edit-tx" data-id="${esc(x.id)}">
      <span class="ic${x.rev ? " rev" : ""}" style="--c:${col}">${esc((x.desc || catName || "?").trim().charAt(0).toUpperCase())}</span>
      <span><span class="nm">${esc(x.desc || catName)}</span><span class="mt">${esc(meta)}</span></span>
      <span class="am${isInc ? " in" : ""}">${isInc ? "+" : ""}${esc(fmtMoney(base, cur))}${showOrig ? `<small>${esc(fmtMoney(+x.amount, x.cur))}</small>` : ""}</span></button></li>`;
  });
  const filters = [["all", t.all], ["expense", t.expense], ["income", t.incomeOne]].map(([k, l]) => `<button class="chip" data-act="filter" data-f="${k}" aria-pressed="${S.filter === k}">${esc(l)}</button>`).join("") + (rev ? `<button class="chip revchip" data-act="filter" data-f="rev" aria-pressed="${S.filter === "rev"}">● ${esc(t.review(rev))}</button>` : "") + (hiddenList.length ? `<button class="chip" data-act="filter" data-f="hidden" aria-pressed="${S.filter === "hidden"}">${esc(t.hiddenF(hiddenList.length))}</button>` : "");

  $("v-money").innerHTML = `<div class="mhead"><button class="icon-btn" data-act="m-prev" aria-label="‹">${IC.left}</button><span class="t">${esc(mName)}</span><button class="icon-btn" data-act="m-next" aria-label="›">${IC.right}</button></div>
    <div class="hero">
      <div><div class="lbl">${esc(t.spent)}</div><div class="big">${esc(fmtMoney(spent, cur))}</div>${budget}</div>
      <div class="kpis">
        <div><small>${esc(t.income)}</small><b class="pos">+${esc(fmtMoney(income, cur))}</b></div>
        <div><small>${esc(t.balance)}</small><b class="${income - spent < 0 ? "neg" : "pos"}">${esc(fmtMoney(income - spent, cur))}</b></div>
        ${S.person === "carlos" || biz ? `<div><small>${esc(t.biz)}</small><b>${esc(fmtMoney(biz, cur))}</b></div>` : ""}
        <div><small>${esc(t.back)}</small><b>${esc(fmtMoney(back, cur))}</b></div>
      </div>
    </div>
    <div class="addrow"><button class="btn pri" data-act="new-tx" data-k="expense">${IC.plus}${esc(t.addExpense)}</button><button class="btn" data-act="new-tx" data-k="income">${IC.plus}${esc(t.addIncome)}</button></div>
    ${sync}
    <div class="money-g">
      <div><h2>${esc(t.byCat)}</h2>${catBars}<h2>${esc(t.perDay)}</h2><div class="fig" id="dayFig"><svg role="img" aria-label="${esc(t.perDay)}"></svg></div><h2>${esc(t.byMethod)}</h2>${methods}</div>
      <div><h2>${esc(mName.charAt(0).toUpperCase() + mName.slice(1))}</h2><div class="filters">${filters}</div>
      ${S.filter === "rev" ? `<p class="hint">${esc(t.reviewHelp)}</p>` : S.filter === "hidden" ? `<p class="hint">${esc(t.hiddenHelp)}</p>` : ""}
      ${rows ? `<ul class="mlist">${rows}</ul>` : `<div class="empty" style="margin-top:10px"><p><b>${esc(t.noMoves)}</b></p><p class="muted">${esc(t.noMovesHelp)}</p></div>`}</div>
    </div>`;
  drawDays(per, cur);
}
let figRO = null;
function drawDays(per, cur) {
  const box = $("dayFig"); if (!box) return;
  const svg = box.querySelector("svg");
  const draw = () => {
    const W = box.clientWidth, H = box.clientHeight; if (!W) return;
    const mx = Math.max(...per, 0), n = per.length, padB = 18, padT = 18;
    const bw = W / n, tk = todayKey();
    let s = `<line x1="0" y1="${H - padB}" x2="${W}" y2="${H - padB}" stroke="var(--line)"/>`;
    per.forEach((v, i) => {
      const h = mx > 0 ? Math.max(v > 0 ? 2 : 0, (v / mx) * (H - padB - padT)) : 0;
      const isT = `${S.month}-${pad(i + 1)}` === tk;
      s += `<rect x="${(i * bw + bw * 0.18).toFixed(1)}" y="${(H - padB - h).toFixed(1)}" width="${Math.max(1, bw * 0.64).toFixed(1)}" height="${h.toFixed(1)}" rx="${Math.min(3, bw * 0.3).toFixed(1)}" fill="var(--acc)" opacity="${isT ? 1 : 0.72}"/>`;
    });
    [1, 10, 20, n].forEach((d) => { s += `<text x="${((d - 0.5) * bw).toFixed(1)}" y="${H - 3}" text-anchor="middle">${d}</text>`; });
    if (mx > 0) { const i = per.indexOf(mx); const x = Math.min(W - 4, Math.max(4, (i + 0.5) * bw)); s += `<text x="${x.toFixed(1)}" y="12" text-anchor="${x > W * 0.7 ? "end" : x < W * 0.3 ? "start" : "middle"}" style="fill:var(--ink)">${esc(fmtMoney(mx, cur))}</text>`; }
    svg.innerHTML = s;
  };
  if (figRO) figRO.disconnect();
  figRO = new ResizeObserver(draw); figRO.observe(box); draw();
}

/* ================================================================
   GMAIL → gastos con tarjeta (solo tarjetas de Carlos)
================================================================= */
let syncing = false, syncMsg = { kind: "", text: "" };
function setSync(kind, text) { syncMsg = { kind, text }; const el = $("syncMsg"); if (el) { el.className = "msg " + kind; el.textContent = text; } }
async function syncGmail() {
  if (syncing || S.person !== "carlos") return;
  const t = T();
  syncing = true; setSync("", t.syncing); render();
  let added = 0, skipped = 0;
  try {
    const mcp = window.claude && typeof window.claude.use === "function" ? await timeout(window.claude.use("mcp"), 10000) : null;
    if (!mcp) { setSync("err", t.syncNoMcp); return; }
    const c = cfgOf("carlos");
    const since = /^\d{4}-\d{2}-\d{2}$/.test(c.since || "") ? c.since : "2026-11-01";
    const q = `{from:notificacionbac@baccredomatic.cr from:bncontacto@bncr.fi.cr} after:${since.replace(/-/g, "/")} -subject:OTP`;
    const threads = [];
    let token = null;
    for (let i = 0; i < 10; i++) {
      const r = await mcp.callTool("Gmail", "search_threads", token ? { query: q, pageSize: 50, pageToken: token } : { query: q, pageSize: 50 });
      const p = (r && r.payload) || {};
      (p.threads || []).forEach((th) => threads.push(th));
      token = p.nextPageToken || null;
      if (!token) break;
    }
    const known = (id) => !!D.tx["g_" + id];
    let n = 0;
    for (const th of threads) {
      n++;
      if (n % 3 === 0) setSync("", t.syncProgress(n, threads.length));
      const msgs = Array.isArray(th.messages) ? th.messages : [];
      const total = th.messageCount || msgs.length;
      if (msgs.length && total <= msgs.length && msgs.every((m) => known(m.id))) continue;
      if (total === 1 && msgs.length === 1) {
        const h = String(msgs[0].snippet || "").match(/Hola\s+([A-ZÁÉÍÓÚÑÜ ]+?)\s+A continuaci/);
        if (h && !/CARLOS\s+EL[IÍ]AS\s+SALAS/i.test(h[1])) { skipped++; continue; }
      }
      const full = await mcp.callTool("Gmail", "get_thread", { threadId: th.id, messageFormat: "PLAIN_TEXT" });
      const list = (full && full.payload && full.payload.messages) || [];
      for (const m of list) {
        if (!m || !m.id || known(m.id)) continue;
        const p = Bank.parse(m);
        if (!p) continue;
        if (!Bank.isOwn(p)) { if (p.holder && !/CARLOS/i.test(p.holder)) skipped++; continue; }
        const g = Bank.guess(p.merchant);
        const doc = { person: "carlos", kind: "expense", amount: p.amount, cur: SYM[p.currency] ? p.currency : "USD", desc: p.merchant, cat: g.cat, method: "card", scope: g.scope, date: p.date, time: p.time, card: p.last4, bank: p.bank, src: "gmail", mid: m.id, rev: true, created: Date.now() };
        put("tx", "g_" + m.id, doc);
        added++;
        await sleep(60);
      }
    }
    const cc = clone(D.cfg.carlos || {}) || {};
    cc.since = keyOf(addDays(new Date(), -3));
    cc.lastSync = Date.now();
    put("cfg", "carlos", cc);
    setSync("ok", added || skipped ? t.syncDone(added, skipped) : t.syncNone);
    if (added) S.filter = "rev";
  } catch (e) {
    const code = e && e.code;
    setSync("err", code === "needs_reauth" ? t.syncAuth : code === "server_not_connected" || code === "selection_required" ? t.syncMissing : code === "not_in_manifest" || code === "approval_required" || code === "consent_required" ? t.syncDenied : t.syncErr);
  } finally {
    syncing = false;
    if (S.tab === "money") render();
  }
}

/* ================================================================
   BUZÓN DE JARVIS → gastos con tarjeta (app de los 90 días)
================================================================= */
let inboxMsg = "", inboxBusy = false;
async function importInbox(manual) {
  if (inboxBusy || Store.mode !== "fire" || !S.ready) { if (manual) { calMsg = { kind: "err", text: Store.mode !== "fire" ? "Esta copia no está conectada a la nube de la app." : "Un momento, la app todavía está cargando." }; render(); } return; }
  const box = cfgOf("carlos").inbox;
  if (!box || !/^[a-z0-9-]{24,64}$/.test(box)) { if (manual) { calMsg = { kind: "err", text: "Falta el código del buzón de Jarvis en Ajustes." }; render(); } return; }
  inboxBusy = true;
  let calDays = 0, ops = 0;
  try {
    const { F, db } = Store.fs;
    await seedHannah(box);
    const snap = await F.getDocs(F.collection(db, "inbox", box, "items"));
    let n = 0;
    const rk = (id) => (id.startsWith("op_") ? "0" : "1") + id; // primero los cambios y la semana base, después el calendario
    const docs = snap.docs.slice().sort((x, y) => (rk(x.id) < rk(y.id) ? -1 : 1));
    for (const d of docs) {
      const it = d.data() || {};
      const id = d.id;
      const cm = /^cal_(\d{4}-\d{2}-\d{2})_[A-Za-z0-9]{1,24}$/.exec(id);
      if (cm || /^op_[A-Za-z0-9]{1,24}$/.test(id)) {
        try {
          const j = JSON.parse(String(it.json || "null"));
          if (cm && applyCalDay(cm[1], j)) calDays++;
          if (!cm && applyOp(j)) ops++;
        } catch (e) {}
        try { await F.deleteDoc(d.ref); } catch (e) {}
        continue;
      }
      if (/^g_[A-Za-z0-9]{6,40}$/.test(id) && !D.tx[id] && isFinite(+it.amount) && /^\d{4}-\d{2}-\d{2}$/.test(String(it.date || ""))) {
        const g = Bank.guess(it.desc);
        put("tx", id, { person: "carlos", kind: "expense", amount: +it.amount, cur: SYM[it.cur] ? it.cur : "CRC", desc: String(it.desc || "").slice(0, 80), cat: g.cat, method: "card", scope: g.scope, date: it.date, time: String(it.time || ""), card: String(it.card || ""), bank: String(it.bank || ""), src: "gmail", mid: String(it.mid || ""), rev: true, created: Date.now() });
        n++;
      }
      try { await F.deleteDoc(d.ref); } catch (e) {}
    }
    if (n) { inboxMsg = T().jvNew(n); if (S.person === "carlos" && S.tab === "money") render(); }
    if (calDays) { const cc = clone(D.cfg.carlos || {}) || {}; cc.lastCal = Date.now(); put("cfg", "carlos", cc); }
    if (calDays || ops) calMsg = { kind: "ok", text: `Jarvis acomodó ${calDays ? calDays + (calDays === 1 ? " día" : " días") + " con su Google Calendar" : ""}${calDays && ops ? " y " : ""}${ops ? ops + (ops === 1 ? " cambio que usted pidió" : " cambios que usted pidió") : ""}.` };
    else if (manual) calMsg = { kind: "", text: "Al día: no hay nada nuevo de Jarvis." };
    if (calDays || ops || manual) render();
  } catch (e) { if (manual) { calMsg = { kind: "err", text: "No se pudo revisar el buzón de Jarvis. Intente de nuevo." }; render(); } } finally { inboxBusy = false; }
}
async function seedHannah(box) {
  try {
    if (typeof SEED_H === "undefined" || !SEED_H) return;
    if (Object.values(D.tpl).some((v) => v && v.person === "hannah")) return;
    if ((D.cfg.carlos || {}).seededH) return;
    const raw = Uint8Array.from(atob(SEED_H.ct), (c) => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(SEED_H.iv), (c) => c.charCodeAt(0));
    const kb = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(box));
    const key = await crypto.subtle.importKey("raw", kb, "AES-GCM", false, ["decrypt"]);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, raw);
    const docs = JSON.parse(new TextDecoder().decode(plain));
    for (const [id, doc] of Object.entries(docs)) { put("tpl", id, doc); await sleep(40); }
    const cc = clone(D.cfg.carlos || {}) || {}; cc.person = "carlos"; cc.seededH = true; put("cfg", "carlos", cc);
  } catch (e) {}
}

/* ================================================================
   SHEETS (formularios)
================================================================= */
let sheetCtx = null;
function openSheet(html, ctx) {
  sheetCtx = ctx || null;
  $("sheet").innerHTML = `<div class="grab"></div>${html}`;
  $("sheet").classList.add("open"); $("scrim").classList.add("open");
  $("sheet").setAttribute("aria-hidden", "false");
  const f = $("sheet").querySelector("[data-focus]");
  if (f) setTimeout(() => f.focus(), 80);
}
function closeSheet() {
  $("sheet").classList.remove("open"); $("scrim").classList.remove("open");
  $("sheet").setAttribute("aria-hidden", "true");
  sheetCtx = null;
  render();
}

/* --- block editor --- */
function openBlock(id, preset) {
  const t = T(), target = curTarget();
  const blocks = blocksOf(target);
  const b = id ? blocks.find((x) => x.id === id) : null;
  const last = blocks.length ? blocks[blocks.length - 1].e : null;
  let s = b ? b.s : preset && isFinite(preset.s) ? preset.s : last !== null && last < 1380 ? last : (Math.ceil(nowMin() / 30) * 30) % 1440;
  if (!b && s > 1380) s = 1380;
  let e = b ? b.e : preset && isFinite(preset.e) ? preset.e : Math.min(1440, s + 60);
  const ctx = { id: b ? b.id : null, target, c: b ? b.c : "personal" };
  const sugg = t.sugg.map((x) => `<button type="button" class="chip" data-act="b-sugg" data-v="${esc(x)}">${esc(x)}</button>`).join("");
  const cats = CATS.map((c) => `<button type="button" class="chip cat" style="--c:var(--c-${c})" data-act="b-cat" data-c="${c}" aria-pressed="${ctx.c === c}"><span class="dot"></span>${esc(t.cats[c])}</button>`).join("");
  const durs = DUR.map((d) => `<button type="button" class="chip" data-act="b-dur" data-d="${d}">${esc(fmtDur(d))}</button>`).join("");
  openSheet(`<h3>${esc(b ? t.editBlock : t.newBlock)}</h3>
    <form id="bForm" novalidate>
    <div class="f"><label for="bTitle">${esc(t.title)}</label><input class="fi" id="bTitle" maxlength="80" autocomplete="off" placeholder="${esc(t.titlePh)}" value="${esc(b ? b.t : "")}" ${b ? "" : "data-focus"}></div>
    ${b ? "" : `<div class="chips" style="margin:-4px 0 14px">${sugg}</div>`}
    <div class="f"><span class="lb">${esc(t.type)}</span><div class="chips">${cats}</div></div>
    <div class="two"><div class="f"><label for="bS">${esc(t.start)}</label><input class="fi" type="time" id="bS" value="${toHHMM(s)}" step="300"></div>
    <div class="f"><label for="bE">${esc(t.end)}</label><input class="fi" type="time" id="bE" value="${e >= 1440 ? "23:59" : toHHMM(e)}" step="300"></div></div>
    <div class="f"><span class="lb">${esc(t.duration)}</span><div class="chips">${durs}</div></div>
    <p class="hint" id="bHint"></p>
    <div class="f"><label for="bNote">${esc(t.note)}</label><input class="fi" id="bNote" maxlength="140" placeholder="${esc(t.notePh)}" value="${esc(b && b.n ? b.n : "")}"></div>
    <div class="acts"><button type="submit" class="btn pri">${esc(t.save)}</button>${b ? `<button type="button" class="btn danger" data-act="b-del-ask">${esc(t.delete)}</button>` : `<button type="button" class="btn" data-act="close">${esc(t.cancel)}</button>`}</div>
    <div class="confirm" id="bConfirm"><p>${esc(b ? b.t : "")}</p><div class="row"><button type="button" class="btn danger" data-act="b-del">${esc(t.yesDelete)}</button><button type="button" class="btn" data-act="b-del-no">${esc(t.cancel)}</button></div></div>
    </form>`, Object.assign({ type: "block" }, ctx));
  checkBlock();
}
function readBlock() {
  const s = toMin($("bS").value);
  let e = toMin($("bE").value);
  if (e === 1439) e = 1440;
  return { t: $("bTitle").value.trim(), s, e, n: $("bNote").value.trim() };
}
function checkBlock() {
  const t = T(), h = $("bHint"); if (!h || !sheetCtx) return true;
  const v = readBlock();
  if (!(isFinite(v.s) && isFinite(v.e)) || v.e <= v.s) { h.textContent = t.endBeforeStart; h.className = "hint err"; return false; }
  const other = blocksOf(sheetCtx.target).find((b) => b.id !== sheetCtx.id && b.s < v.e && v.s < b.e);
  h.textContent = other ? t.overlap(other.t) : fmtDur(v.e - v.s);
  h.className = other ? "hint warn" : "hint";
  return true;
}
function saveBlock() {
  const t = T(), v = readBlock();
  if (!v.t) { const h = $("bHint"); h.textContent = t.needTitle; h.className = "hint err"; $("bTitle").focus(); return; }
  if (!checkBlock()) return;
  const blocks = blocksOf(sheetCtx.target).map(clone);
  const i = blocks.findIndex((b) => b.id === sheetCtx.id);
  const nb = { id: sheetCtx.id || uid(), t: v.t, s: v.s, e: v.e, c: sheetCtx.c, done: i >= 0 ? !!blocks[i].done : false };
  if (v.n) nb.n = v.n;
  if (i >= 0) blocks[i] = nb; else blocks.push(nb);
  setBlocks(sheetCtx.target, blocks);
  closeSheet(); render(); toast(t.saved);
}

/* --- more menu --- */
function openMore() {
  const t = T(), target = curTarget(), blocks = blocksOf(target);
  const wd = parseKey(S.date).getDay();
  const hasTpl = blocksOf({ kind: "tpl", wd }).length > 0;
  if (target.kind === "tpl") {
    openSheet(`<h3>${esc(t.more)}</h3><div class="menu">
      <button class="btn danger" data-act="clear-ask" ${blocks.length ? "" : "disabled"}>${esc(t.clearDay)}</button></div>
      <div class="confirm" id="cConfirm"><p>${esc(t.clearConfirm)}</p><div class="row"><button class="btn danger" data-act="clear">${esc(t.yesDelete)}</button><button class="btn" data-act="clear-no">${esc(t.cancel)}</button></div></div>`, { type: "more" });
    return;
  }
  openSheet(`<h3>${esc(niceDate(S.date))}</h3><div class="menu">
    ${hasTpl ? `<button class="btn" data-act="load-base">${esc(t.loadBase)}</button>` : ""}
    <button class="btn" data-act="save-base" ${blocks.length ? "" : "disabled"}>${esc(t.saveAsBase)} · ${esc(t.wdLong[wd])}</button>
    <button class="btn" data-act="copy-pick" ${blocks.length ? "" : "disabled"}>${esc(t.copyTo)}</button>
    <button class="btn" data-act="open-base" data-wd="${wd}">${esc(t.editBase)}</button>
    <button class="btn danger" data-act="clear-ask" ${blocks.length ? "" : "disabled"}>${esc(t.clearDay)}</button></div>
    <p class="hint warn hidden" id="lbWarn" style="margin-top:10px">${esc(t.replaceWarn)}</p>
    <div class="confirm" id="cConfirm"><p>${esc(t.clearConfirm)}</p><div class="row"><button class="btn danger" data-act="clear">${esc(t.yesDelete)}</button><button class="btn" data-act="clear-no">${esc(t.cancel)}</button></div></div>`, { type: "more" });
}
function loadBase(force) {
  const t = T(), wd = parseKey(S.date).getDay();
  const tpl = blocksOf({ kind: "tpl", wd });
  if (!tpl.length) return;
  const cur = blocksOf({ kind: "plan", date: S.date });
  if (cur.length && !force) { const w = $("lbWarn"); if (w) { w.classList.remove("hidden"); w.innerHTML = `${esc(t.replaceWarn)} <button class="btn danger" data-act="load-base-force" style="margin-left:6px">${esc(t.loadBase)}</button>`; } return; }
  setBlocks({ kind: "plan", date: S.date }, tpl.map((b) => Object.assign(clone(b), { id: /^(pl_|cb_)/.test(String(b.id)) ? b.id : uid(), done: false })).concat(cur.filter((b) => String(b.id).startsWith("gc_"))));
  if (S.person === "carlos") reconcileSave(S.date);
  closeSheet(); render(); toast(t.saved);
}
function openCopy() {
  const t = T(), start = parseKey(todayKey());
  let btns = "";
  for (let i = 0; i < 21; i++) {
    const k = keyOf(addDays(start, i)); if (k === S.date) continue;
    const has = blocksOf({ kind: "plan", date: k }).length;
    btns += `<button class="btn" data-act="copy-to" data-k="${k}">${esc(niceDate(k))}${has ? " ·  " + esc(t.blocks(has)) : ""}</button>`;
  }
  openSheet(`<h3>${esc(t.copyPick)}</h3><div class="menu">${btns}</div>
    <div class="confirm" id="cpConfirm"><p>${esc(t.replaceWarn)}</p><div class="row"><button class="btn danger" data-act="copy-force">${esc(t.copyTo)}</button><button class="btn" data-act="copy-no">${esc(t.cancel)}</button></div></div>`, { type: "copy" });
}
function copyTo(k, force) {
  const t = T();
  if (!force && blocksOf({ kind: "plan", date: k }).length) { sheetCtx.k = k; $("cpConfirm").classList.add("show"); $("cpConfirm").scrollIntoView({ block: "nearest" }); return; }
  setBlocks({ kind: "plan", date: k }, blocksOf({ kind: "plan", date: S.date }).map((b) => Object.assign(clone(b), { id: uid(), done: false })));
  closeSheet(); toast(t.copied(niceDate(k)));
}

/* --- transaction editor --- */
function openTx(id, kind) {
  const t = T(), c = cfgOf();
  const x = id ? txOf().find((v) => v.id === id) : null;
  kind = x ? (x.kind === "income" ? "income" : "expense") : kind;
  const ctx = {
    type: "tx", id: x ? x.id : null, kind,
    cat: x ? x.cat : kind === "income" ? "other" : "other",
    method: x ? x.method || "card" : kind === "income" ? "transfer" : "cash",
    scope: x ? x.scope || "personal" : "personal",
    cur: x ? x.cur : c.base
  };
  const tk = todayKey(), nowT = toHHMM(nowMin());
  const inMonth = S.month === tk.slice(0, 7) ? tk : `${S.month}-01`;
  openSheet(`<h3>${esc(x ? t.editMove : kind === "income" ? t.newIncome : t.newExpense)}</h3>
    ${x && x.src === "gmail" ? `<p class="hint">${esc(t.fromMail)} · ${esc(x.bank || "")} · ${esc(t.fromCard(x.card || "····"))}</p>` : ""}
    ${x && x.kind !== "income" ? (x.hidden ? `<div class="menu" style="margin-bottom:14px"><button type="button" class="btn pri" data-act="t-quick" data-v="restore">${esc(t.restore)}</button></div>` : `<div class="menu" style="margin-bottom:14px"><button type="button" class="btn" data-act="t-quick" data-v="mine">✓ ${esc(t.qMine)}</button><button type="button" class="btn" data-act="t-quick" data-v="biz">${esc(t.qBiz)}</button><button type="button" class="btn danger" data-act="t-quick" data-v="remove">${esc(t.qRemove)}</button></div>`) : ""}
    <form id="tForm" novalidate>
    ${x ? "" : `<div class="seg"><button type="button" data-act="t-kind" data-k="expense" aria-pressed="${kind === "expense"}">${esc(t.expense)}</button><button type="button" data-act="t-kind" data-k="income" aria-pressed="${kind === "income"}">${esc(t.incomeOne)}</button></div>`}
    <div class="two" style="grid-template-columns:minmax(0,1.6fr) minmax(0,1fr)"><div class="f"><label for="tAmt">${esc(t.amount)}</label><input class="fi amt" id="tAmt" inputmode="decimal" autocomplete="off" placeholder="0" value="${x ? esc(String(x.amount)) : ""}" ${x ? "" : "data-focus"}></div>
    <div class="f"><label for="tCur">${esc(t.currency)}</label><select class="fi" id="tCur">${Object.keys(SYM).map((k) => `<option value="${k}"${ctx.cur === k ? " selected" : ""}>${SYM[k]} ${k}</option>`).join("")}</select></div></div>
    <div class="f"><label for="tDesc">${esc(t.desc)}</label><input class="fi" id="tDesc" maxlength="80" autocomplete="off" placeholder="${esc(t.descPh)}" value="${esc(x ? x.desc || "" : "")}"></div>
    <div class="f"><span class="lb" id="tCatL">${esc(kind === "income" ? t.source : t.category)}</span><div class="chips" id="tCats"></div></div>
    <div id="tExp">
      <div class="f"><span class="lb">${esc(t.method)}</span><div class="chips" id="tMethods"></div></div>
      <div class="f"><span class="lb">${esc(t.scope)}</span><div class="chips" id="tScopes"></div></div>
    </div>
    <div class="two"><div class="f"><label for="tDate">${esc(t.date)}</label><input class="fi" type="date" id="tDate" value="${esc(x ? x.date : inMonth)}"></div>
    <div class="f"><label for="tTime">${esc(t.time)}</label><input class="fi" type="time" id="tTime" value="${esc(x ? x.time || "" : nowT)}"></div></div>
    <div class="f"><label for="tNote">${esc(t.note)}</label><input class="fi" id="tNote" maxlength="140" placeholder="${esc(t.notePh)}" value="${esc(x && x.note ? x.note : "")}"></div>
    <p class="hint" id="tHint"></p>
    <div class="acts"><button type="submit" class="btn pri">${esc(t.save)}</button>${x ? `<button type="button" class="btn danger" data-act="t-del-ask">${esc(t.delete)}</button>` : `<button type="button" class="btn" data-act="close">${esc(t.cancel)}</button>`}</div>
    <div class="confirm" id="tConfirm"><p>${esc(x ? (x.desc || "") + " · " + fmtMoney(+x.amount, x.cur) : "")}</p><div class="row"><button type="button" class="btn danger" data-act="t-del">${esc(t.yesDelete)}</button><button type="button" class="btn" data-act="t-del-no">${esc(t.cancel)}</button></div></div>
    </form>`, ctx);
  paintTx();
}
function paintTx() {
  const t = T(), x = sheetCtx; if (!x || x.type !== "tx") return;
  const inc = x.kind === "income";
  const list = inc ? ICATS : ECATS, cols = inc ? ICOL : ECOL, names = inc ? t.icats : t.ecats;
  if (!list.includes(x.cat)) x.cat = "other";
  $("tCats").innerHTML = list.map((k) => `<button type="button" class="chip cat" style="--c:${cols[k]}" data-act="t-cat" data-c="${k}" aria-pressed="${x.cat === k}"><span class="dot"></span>${esc(names[k])}</button>`).join("");
  $("tCatL").textContent = inc ? t.source : t.category;
  $("tMethods").innerHTML = ["card", "cash", "transfer"].map((k) => `<button type="button" class="chip" data-act="t-method" data-m="${k}" aria-pressed="${x.method === k}">${esc(t.methods[k])}</button>`).join("");
  $("tScopes").innerHTML = ["personal", "biz", "back"].map((k) => `<button type="button" class="chip" data-act="t-scope" data-s="${k}" aria-pressed="${x.scope === k}">${esc(t.scopes[k])}</button>`).join("");
  $("tExp").classList.toggle("hidden", inc);
  document.querySelectorAll("[data-act=t-kind]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.k === x.kind)));
}
function saveTx() {
  const t = T(), x = sheetCtx;
  const raw = $("tAmt").value.trim();
  let amt = Bank.num(raw.replace(/[^\d.,-]/g, ""));
  const old = x.id ? D.tx[x.id] : null;
  const isRefund = old && +old.amount < 0;
  if (isRefund && isFinite(amt)) amt = -Math.abs(amt);
  if (!isFinite(amt) || (amt <= 0 && !isRefund) || amt === 0) { const h = $("tHint"); h.textContent = t.needAmount; h.className = "hint err"; $("tAmt").focus(); return; }
  const date = /^\d{4}-\d{2}-\d{2}$/.test($("tDate").value) ? $("tDate").value : todayKey();
  const doc = Object.assign(old ? clone(old) : { person: S.person, src: "manual", created: Date.now() }, {
    kind: x.kind, amount: amt, cur: SYM[$("tCur").value] ? $("tCur").value : cfgOf().base,
    desc: $("tDesc").value.trim(), cat: x.cat, date, time: /^\d{2}:\d{2}$/.test($("tTime").value) ? $("tTime").value : "",
    rev: false, updated: Date.now()
  });
  if (x.kind === "income") { delete doc.method; delete doc.scope; doc.method = "transfer"; }
  else { doc.method = x.method; doc.scope = x.scope; }
  const note = $("tNote").value.trim(); if (note) doc.note = note; else delete doc.note;
  put("tx", x.id || "m_" + uid(), doc);
  if (date.slice(0, 7) !== S.month) S.month = date.slice(0, 7);
  closeSheet(); render(); toast(t.saved);
}

/* --- settings --- */
function openSettings() {
  const t = T(), c = cfgOf();
  openSheet(`<h3>${esc(t.settings)} · ${esc(NAMES[S.person])}</h3>
    <div class="f"><span class="lb">${esc(t.lang)}</span><div class="chips">${[["es", "Español"], ["de", "Deutsch"], ["en", "English"]].map(([k, l]) => `<button class="chip" data-act="set" data-k="lang" data-v="${k}" aria-pressed="${c.lang === k}">${l}</button>`).join("")}</div></div>
    <div class="f"><span class="lb">${esc(t.clock)}</span><div class="chips"><button class="chip" data-act="set" data-k="h24" data-v="0" aria-pressed="${!c.h24}">${esc(t.h12)}</button><button class="chip" data-act="set" data-k="h24" data-v="1" aria-pressed="${!!c.h24}">${esc(t.h24)}</button></div></div>
    <div class="f"><span class="lb">${esc(t.baseCur)}</span><div class="chips">${Object.keys(SYM).map((k) => `<button class="chip" data-act="set" data-k="base" data-v="${k}" aria-pressed="${c.base === k}">${SYM[k]} ${k}</button>`).join("")}</div></div>
    <div class="f"><span class="lb">${esc(t.rates)}</span><div class="two"><label class="row" style="gap:6px;flex-wrap:nowrap"><span class="nowrap">1 USD = ₡</span><input class="fi" id="rUSD" inputmode="decimal" value="${esc(c.rates.USD)}"></label><label class="row" style="gap:6px;flex-wrap:nowrap"><span class="nowrap">1 EUR = ₡</span><input class="fi" id="rEUR" inputmode="decimal" value="${esc(c.rates.EUR)}"></label></div><p class="hint" style="margin:0">${esc(t.ratesHelp)}</p></div>
    <div class="f"><label for="sBudget">${esc(t.budget)} (${SYM[c.base]})</label><input class="fi" id="sBudget" inputmode="decimal" value="${esc(c.budget || 0)}"><p class="hint" style="margin:0">${esc(t.budgetHelp)}</p></div>
    ${S.person === "carlos" && Store.mode === "fire" ? `<div class="f"><label for="sBox">${esc(t.jvCode)}</label><input class="fi" id="sBox" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="jv-…" value="${esc(c.inbox || "")}"><p class="hint" style="margin:0">${esc(t.jvHelp)}</p></div>` : ""}
    ${S.person === "carlos" && window.claude ? `<div class="f"><label for="sSince">${esc(t.syncFrom)}</label><input class="fi" type="date" id="sSince" value="${esc(c.since || "2026-11-01")}"></div>` : ""}
    <div class="acts"><button class="btn pri" data-act="set-save">${esc(t.save)}</button><button class="btn" data-act="close">${esc(t.close)}</button></div>
    <div class="f" style="margin-top:20px"><span class="lb">${esc(t.storage)}</span><p style="margin:0">${esc(Store.mode === "local" ? t.local : Store.mode === "fire" ? t.fire : t.cloud)}</p></div>
    <div class="row"><button class="btn" data-act="backup">${esc(t.backup)}</button></div>
    <p class="hint" style="margin-top:16px">${esc(t.rights)}</p>`, { type: "settings" });
}
function setCfg(patch) {
  const c = clone(D.cfg[S.person] || {}) || {};
  Object.assign(c, patch, { person: S.person, updated: Date.now() });
  put("cfg", S.person, c);
}

/*@@PLAN@@*/
/* ================================================================
   EVENTS
================================================================= */
function go(tab) {
  S.tab = tab; S.base = null;
  if (!EMBED) try { history.replaceState(null, "", tab === "day" ? location.pathname + location.search : "#" + TAB2HASH[tab]); } catch (e) {}
  render(); window.scrollTo(0, 0);
}
document.addEventListener("click", (ev) => {
  const el = ev.target.closest("[data-act]"); if (!el || el.disabled) return;
  const a = el.dataset.act, t = T();
  switch (a) {
    case "person": if (S.person !== el.dataset.p) { S.person = el.dataset.p; lsSet("dd.person", S.person); S.base = null; S.filter = "all"; syncMsg = { kind: "", text: "" }; render(); } break;
    case "tab": go(el.dataset.tab); break;
    case "gear": openSettings(); break;
    case "close": closeSheet(); break;
    case "pick-day": S.date = el.dataset.k; S.base = null; if (S.tab !== "day") go("day"); else render(); break;
    case "wk-prev": S.date = keyOf(addDays(parseKey(S.date), -7)); render(); break;
    case "wk-next": S.date = keyOf(addDays(parseKey(S.date), 7)); render(); break;
    case "wk-today": S.date = todayKey(); render(); break;
    case "toggle-weekbase": S.weekBase = !S.weekBase; render(); break;
    case "open-base": closeSheet(); S.base = +el.dataset.wd; S.tab = "day"; render(); window.scrollTo(0, 0); break;
    case "base-done": S.base = null; render(); break;
    case "new-block": openBlock(null, el.dataset.s ? { s: +el.dataset.s, e: +el.dataset.e } : null); break;
    case "edit-block": openBlock(el.dataset.id); break;
    case "toggle": {
      const tg = curTarget(), bl = blocksOf(tg).map(clone), b = bl.find((x) => x.id === el.dataset.id);
      if (b) { b.done = !b.done; setBlocks(tg, bl); render(); if (navigator.vibrate) try { navigator.vibrate(15); } catch (e) {} }
      break;
    }
    case "b-sugg": $("bTitle").value = el.dataset.v; break;
    case "b-cat": sheetCtx.c = el.dataset.c; document.querySelectorAll("[data-act=b-cat]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.c === sheetCtx.c))); break;
    case "b-dur": { const s = toMin($("bS").value); if (isFinite(s)) { const e = Math.min(1440, s + +el.dataset.d); $("bE").value = e >= 1440 ? "23:59" : toHHMM(e); checkBlock(); } break; }
    case "b-del-ask": $("bConfirm").classList.add("show"); break;
    case "b-del-no": $("bConfirm").classList.remove("show"); break;
    case "b-del": setBlocks(sheetCtx.target, blocksOf(sheetCtx.target).filter((b) => b.id !== sheetCtx.id)); closeSheet(); render(); toast(t.deleted); break;
    case "more": openMore(); break;
    case "load-base": if (sheetCtx && sheetCtx.type === "more") loadBase(false); else loadBase(true); break;
    case "load-base-force": loadBase(true); break;
    case "save-base": { const wd = parseKey(S.date).getDay(); setBlocks({ kind: "tpl", wd }, blocksOf({ kind: "plan", date: S.date }).map((b) => Object.assign(clone(b), { id: uid() }))); closeSheet(); toast(t.baseSaved(t.wdLong[wd])); break; }
    case "copy-pick": openCopy(); break;
    case "copy-to": copyTo(el.dataset.k, false); break;
    case "copy-force": copyTo(sheetCtx.k, true); break;
    case "copy-no": $("cpConfirm").classList.remove("show"); break;
    case "clear-ask": $("cConfirm").classList.add("show"); break;
    case "clear-no": $("cConfirm").classList.remove("show"); break;
    case "clear": setBlocks(curTarget(), []); closeSheet(); render(); toast(t.deleted); break;
    case "m-prev": case "m-next": { const [y, m] = S.month.split("-").map(Number); const d = new Date(y, m - 1 + (a === "m-next" ? 1 : -1), 1); S.month = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; S.filter = "all"; render(); break; }
    case "filter": S.filter = el.dataset.f; render(); break;
    case "new-tx": openTx(null, el.dataset.k); break;
    case "edit-tx": openTx(el.dataset.id); break;
    case "t-kind": sheetCtx.kind = el.dataset.k; sheetCtx.cat = "other"; sheetCtx.method = el.dataset.k === "income" ? "transfer" : "cash"; $("sheet").querySelector("h3").textContent = el.dataset.k === "income" ? t.newIncome : t.newExpense; paintTx(); break;
    case "t-cat": sheetCtx.cat = el.dataset.c; paintTx(); break;
    case "t-method": sheetCtx.method = el.dataset.m; paintTx(); break;
    case "t-scope": sheetCtx.scope = el.dataset.s; paintTx(); break;
    case "t-del-ask": $("tConfirm").classList.add("show"); break;
    case "t-del-no": $("tConfirm").classList.remove("show"); break;
    case "t-del": {
      const o = D.tx[sheetCtx.id];
      if (o && o.src === "gmail") put("tx", sheetCtx.id, Object.assign(clone(o), { hidden: true, rev: false, updated: Date.now() }));
      else put("tx", sheetCtx.id, null);
      closeSheet(); render(); toast(o && o.src === "gmail" ? t.removed : t.deleted); break;
    }
    case "t-quick": {
      const o = clone(D.tx[sheetCtx.id]); if (!o) break;
      const v = el.dataset.v;
      if (v === "remove") { o.hidden = true; o.rev = false; }
      else if (v === "restore") { delete o.hidden; o.rev = false; o.scope = "personal"; }
      else { o.scope = v === "biz" ? "biz" : "personal"; o.rev = false; delete o.hidden; }
      o.updated = Date.now();
      put("tx", sheetCtx.id, o);
      if (S.filter === "hidden" && v === "restore") S.filter = "all";
      closeSheet(); render(); toast(v === "remove" ? t.removed : v === "restore" ? t.restored : t.saved); break;
    }
    case "h-day": S.hDate = el.dataset.k; render(); break;
    case "h-tick": { hToggle(S.hDate, el.dataset.key); render(); if (navigator.vibrate) try { navigator.vibrate(15); } catch (e) {} break; }
    case "h-slot": { hSet(S.hDate, { slot: el.dataset.v }); applyToDay(S.hDate); render(); const g = daySched(S.hDate).gym; toast(g ? `Día armado: gym de ${fmtTime(g.s)} a ${fmtTime(g.e)}` : t.saved); break; }
    case "s-open": openSessSheet(); break;
    case "set-ok": S.svUntil = 0; S.dirty = false; setOk(S.hDate, el.dataset.ex, +el.dataset.i, +el.dataset.n, el.dataset.id); render(); break;
    case "exu": setExUnit(S.hDate, el.dataset.ex, el.dataset.v); render(); break;
    case "wu": { lsSet("dd.wu", el.dataset.v); hSet(S.hDate, { wu: el.dataset.v }); render(); break; }
    case "tr-exp": exportTrain(el.dataset.v); break;
    case "it-info": openItemInfo(el.dataset.id); break;
    case "sw-save": saveSwap(el.dataset.id, (($("swT") || {}).value || "").trim()); break;
    case "sw-clear": saveSwap(el.dataset.id, ""); break;
    case "alt-open": openAltSheet(el.dataset.ex); break;
    case "alt-set": setAlt(el.dataset.ex, el.dataset.v); break;
    case "ex-how": openExHow(el.dataset.ex); break;
    case "x-open": openExtraSheet(); break;
    case "x-ns": sheetCtx.ns = +el.dataset.v; document.querySelectorAll("[data-act=x-ns]").forEach((b) => b.setAttribute("aria-pressed", String(b === el))); break;
    case "x-rg": sheetCtx.rg = el.dataset.v; document.querySelectorAll("[data-act=x-rg]").forEach((b) => b.setAttribute("aria-pressed", String(b === el))); break;
    case "x-save": saveExtra(); break;
    case "x-del": delExtra(el.dataset.id); render(); toast(T().deleted); break;
    case "rt-go": restStart(+el.dataset.v, el.dataset.l); break;
    case "rt-add": restAdd(+el.dataset.v); break;
    case "rt-stop": restStop(); break;
    case "rt-pause": restPause(); break;
    case "wt-go": startTimer(el.dataset.kind, el.dataset.n); break;
    case "wk-ok": applyWeek(el.dataset.sig); render(); break;
    case "wk-no": hSet(todayKey(), { wkNo: el.dataset.sig }); render(); break;
    case "s-set": saveSess(+el.dataset.v); render(); break;
    case "g-open": openGymSheet(); break;
    case "g-set": saveGym(el.dataset.v === "" ? null : +el.dataset.v); render(); break;
    case "g-custom": { const v = toMin(($("gTime") || {}).value); if (isFinite(v) && v < 1440) { saveGym(v); render(); } else toast(t.writeErr); break; }
    case "idea-open": openIdeas(el.dataset.m); break;
    case "idea-f": openIdeas(el.dataset.m, el.dataset.v); break;
    case "idea-eat": eatIdea(el.dataset.m, +el.dataset.i); break;
    case "eat-open": openEatSheet(el.dataset.m); break;
    case "eat-save": saveEat(); break;
    case "eat-plan": { const m = el.dataset.m, rest = parseKey(S.hDate).getDay() === 0, mac = PLAN_MAC[m][rest ? "rest" : "train"]; eatAdd(S.hDate, Object.assign({ m, txt: "Lo del plan" }, mac)); render(); toast("Anotado: lo del plan"); break; }
    case "eat-del": eatDel(S.hDate, el.dataset.id); render(); toast(t.deleted); break;
    case "f-open": openFastSheet(el.dataset.w); break;
    case "f-set": saveFast(+el.dataset.v); break;
    case "f-custom": { const v = toMin(($("fTime") || {}).value); if (isFinite(v)) saveFast(v); else toast(t.writeErr); break; }
    case "f-clear": saveFast(null); break;
    case "to-day": applyToDay(S.hDate); render(); toast("Listo: el horario quedó en Mi día"); break;
    case "cal-sync": syncCal(); break;
    case "ci-edit": S.ciEdit = !S.ciEdit; render(); break;
    case "ci-mood": { const k = el.dataset.k || S.date; S.ciEdit = true; hSet(k, { mood: hOf(k).mood === el.dataset.v ? null : el.dataset.v }); render(); break; }
    case "adv-ok": { const k = el.dataset.k || S.date; applyAdvice(k, el.dataset.id); render(); toast("Hecho. Su día quedó ajustado"); break; }
    case "adv-no": { const k = el.dataset.k || S.date; hSet(k, { adv: Object.assign({}, hOf(k).adv || {}, { [el.dataset.id]: "no" }) }); render(); toast("Está bien, seguimos con el plan"); break; }
    case "sync": syncGmail(); break;
    case "set": {
      const k = el.dataset.k, v = el.dataset.v;
      const val = k === "h24" ? v === "1" : v;
      setCfg({ [k]: val });
      if (k === "lang") { openSettings(); render(); }
      else { el.parentNode.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", String(b === el))); render(); }
      break;
    }
    case "set-save": {
      const n = (id) => { const v = Bank.num(($(id) || {}).value || ""); return isFinite(v) && v >= 0 ? v : null; };
      const c = cfgOf(), rates = { USD: n("rUSD") || c.rates.USD, EUR: n("rEUR") || c.rates.EUR };
      const patch = { rates, budget: n("sBudget") || 0 };
      const since = $("sSince"); if (since && /^\d{4}-\d{2}-\d{2}$/.test(since.value)) patch.since = since.value;
      const bx = $("sBox"); if (bx) { const v = bx.value.trim().toLowerCase(); if (!v) patch.inbox = ""; else if (/^[a-z0-9-]{24,64}$/.test(v)) patch.inbox = v; else { toast(t.jvBad); break; } }
      setCfg(patch); closeSheet(); render(); toast(t.saved); if (patch.inbox) setTimeout(importInbox, 400); break;
    }
    case "backup": {
      const data = { person: S.person, exported: new Date().toISOString(), plans: {}, tpl: {}, tx: {}, cfg: D.cfg[S.person] || {} };
      ["plans", "tpl", "tx"].forEach((k) => Object.entries(D[k]).forEach(([id, v]) => { if (v && v.person === S.person) data[k][id] = v; }));
      const txt = JSON.stringify(data, null, 1);
      Promise.resolve().then(() => navigator.clipboard.writeText(txt)).then(() => toast(t.backupDone)).catch(() => toast(t.writeErr));
      break;
    }
  }
});
document.addEventListener("submit", (ev) => {
  ev.preventDefault();
  if (ev.target.id === "bForm") saveBlock();
  else if (ev.target.id === "tForm") saveTx();
});
document.addEventListener("change", (ev) => {
  const cf = ev.target.dataset && ev.target.dataset.cnum;
  if (cf) {
    const k = ev.target.dataset.k || S.date, raw = String(ev.target.value || "").replace(",", ".").trim(), v = parseFloat(raw);
    S.svUntil = Date.now() + 500; setTimeout(flushSet, 550);
    if (cf === "slH" || cf === "slM") {           // horas y minutos por separado → sleepH en horas con decimales
      const hh = String(($("slH") || {}).value || "").trim(), mm = String(($("slM") || {}).value || "").trim();
      const H = hh === "" ? null : parseInt(hh, 10), M = mm === "" ? 0 : parseInt(mm, 10);
      S.ciEdit = true;
      if (H == null && mm === "") hSet(k, { sleepH: null });
      else if (isFinite(H != null ? H : 0) && (H == null || (H >= 0 && H <= 14)) && isFinite(M) && M >= 0 && M <= 59) hSet(k, { sleepH: Math.round(((H || 0) + M / 60) * 100) / 100 });
      else { toast(T().writeErr); return; }
      return;
    }
    const max = cf === "rec" || cf === "sleepP" ? 100 : 14;
    S.ciEdit = true;
    if (raw === "") hSet(k, { [cf]: null });
    else if (isFinite(v) && v >= 0 && v <= max) hSet(k, { [cf]: cf === "sleepP" || cf === "rec" ? Math.round(v) : Math.round(v * 10) / 10 });
    else { toast(T().writeErr); return; }
    S.dirty = true; return;
  }
  const sv = ev.target.dataset && ev.target.dataset.sv;
  if (sv) {
    const d = ev.target.dataset, raw = String(ev.target.value || "").replace(",", ".").trim(), v = sv === "w" ? parseFloat(raw) : parseInt(raw, 10);
    if (raw !== "" && !(isFinite(v) && v >= 0 && v < (sv === "w" ? 1000 : 200))) { toast(T().writeErr); return; }
    S.svUntil = Date.now() + 500;
    setPut(S.hDate, d.ex, +d.i, { [sv]: raw === "" ? null : Math.round(v * 10) / 10 }, +d.n);
    setTimeout(flushSet, 550);
    return;
  }
  const f = ev.target.dataset && ev.target.dataset.hnum; if (!f) return;
  const raw = String(ev.target.value || "").replace(",", ".").trim(), v = parseFloat(raw);
  if (raw === "") hSet(S.hDate, { [f]: null });
  else if (isFinite(v) && v > 0 && v < 400) { hSet(S.hDate, { [f]: Math.round(v * 10) / 10 }); toast(T().saved); }
  else { toast(T().writeErr); return; }
  render();
});
const typingSet = () => { const d = document.activeElement && document.activeElement.dataset; return Date.now() < (S.svUntil || 0) || !!(d && (d.sv || d.cnum || d.hnum)); };
const flushSet = () => { if (S.dirty && !typingSet()) { S.dirty = false; if (!$("sheet").classList.contains("open")) render(); } };
document.addEventListener("focusout", () => { setTimeout(flushSet, 80); setTimeout(flushSet, 600); });
document.addEventListener("input", (ev) => { if (ev.target.id === "bS" || ev.target.id === "bE") checkBlock(); });
$("scrim").addEventListener("click", closeSheet);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && $("sheet").classList.contains("open")) closeSheet(); });
window.addEventListener("hashchange", () => { const tab = HASH2TAB[location.hash] || "day"; if (tab !== S.tab) { S.tab = tab; render(); } });

// keep "now" fresh and roll over at midnight
let lastToday = todayKey();
setInterval(() => {
  const tk = todayKey();
  if (tk !== lastToday) { if (S.date === lastToday) S.date = tk; if (S.hDate === lastToday) S.hDate = tk; lastToday = tk; }
  if ((S.tab === "day" || S.tab === "food") && !$("sheet").classList.contains("open") && !(document.activeElement && document.activeElement.dataset && (document.activeElement.dataset.hnum || document.activeElement.dataset.cnum || document.activeElement.dataset.sv))) render();
}, 60000);
window.addEventListener("message", (e) => {
  if (e.origin !== location.origin || !e.data || e.data.dd === undefined) return;
  if (e.data.dd === "tab" && ["day", "week", "money", "food", "train"].includes(e.data.tab)) { S.tab = e.data.tab; S.base = null; render(); window.scrollTo(0, 0); importInbox(); }
  if (e.data.dd === "person" && PEOPLE.includes(e.data.p) && e.data.p !== S.person) { S.person = e.data.p; S.base = null; S.filter = "all"; render(); }
});
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") importInbox(); if (document.visibilityState === "visible" && !$("sheet").classList.contains("open")) { const tk = todayKey(); if (tk !== lastToday) { if (S.date === lastToday) S.date = tk; lastToday = tk; } render(); } });

/* ================================================================
   BOOT
================================================================= */
(async () => {
  render();
  const slowT = setTimeout(() => { S.slow = true; render(); }, 10000);
  await Store.init();
  const seen = {};
  const mark = (coll, meta) => {
    seen[coll] = seen[coll] || !meta.fromCache;
    if (["plans", "tpl", "tx", "cfg"].every((k) => seen[k])) { S.ready = true; S.slow = false; clearTimeout(slowT); }
  };
  ["plans", "tpl", "tx", "cfg"].forEach((coll) => {
    Store.watch(coll, (data, meta) => {
      // keep local edits still waiting to be written
      const keep = {};
      Object.keys(pend).forEach((k) => { if (k.startsWith(coll + "/")) { const id = k.slice(coll.length + 1); keep[id] = pend[k].data; } });
      D[coll] = data;
      Object.entries(keep).forEach(([id, v]) => { if (v === null) delete D[coll][id]; else D[coll][id] = v; });
      if (!S.ready) { mark(coll, meta); if (S.ready) setTimeout(importInbox, 300); }
      if (typingSet()) { S.dirty = true; renderChrome(); }
      else if (!$("sheet").classList.contains("open")) render(); else renderChrome();
    }, (err) => { S.slow = true; renderChrome(); });
  });
})();
}
