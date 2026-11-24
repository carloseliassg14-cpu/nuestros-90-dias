/* ================================================================
   ALIMENTACIÓN y ENTRENAMIENTO · plan de Carlos (24 nov 2026)
   Fuente: "Plan de entrenamiento y alimentación — Carlos" (Jarvis)
================================================================= */
const PLAN_START = "2026-11-23"; // lunes de la semana 1
const DEF_OPEN = 690;   // 11:30 am: primera comida si no hay dato de ayer
const MAX_CLOSE = 1170; // 7:30 pm: cerrar la ventana a más tardar
const FAST_M = 960;     // 16 h de ayuno
const WIN_M = 480;      // ventana de 8 h

const FOOD = {
  targets: {
    train: { kcal: "≈ 2,400", p: "165–175 g", c: "210–240 g", f: "70–80 g" },
    rest: { kcal: "≈ 2,050", p: "165–175 g", c: "140–160 g", f: "80–85 g" }
  },
  meals: [
    { id: "m1", t: "Comida 1", at: 690, p: "200 g de pollo, res magra o pescado", pE: "2 palmas de su mano (grosor de la palma, sin dedos)", c: "350 g de papa o camote + 1 fruta", cE: "2 puños cerrados + 1 fruta mediana", cRest: "350 g de papa o camote (sin fruta)", cRestE: "2 puños cerrados (sin fruta)", v: "1–2 tazas de verdura", vE: "2 puños o medio plato", f: "½ aguacate pequeño", fE: "½ aguacate pequeño" },
    { id: "m2", t: "Merienda", at: 870, p: "3 huevos + 170 g de yogur griego natural", pE: "3 huevos + ¾ de taza de yogur", c: "1 banano + 40 g de avena", cE: "1 banano + ½ taza de avena en crudo", cRest: "1 banano (sin avena)", cRestE: "1 banano (sin avena)", v: "", f: "15 g de maní natural", fE: "1 puñito (2 cucharadas)" },
    { id: "m3", t: "Cena", at: 1080, p: "200 g de pollo, res magra o pescado", pE: "2 palmas de su mano", c: "300 g de camote o papa, o 200 g de arroz", cE: "2 puños, o 1¼ tazas de arroz cocido", cRest: "300 g de camote o papa, o 200 g de arroz", cRestE: "2 puños, o 1¼ tazas de arroz cocido", v: "1–2 tazas de verdura", vE: "2 puños o medio plato", f: "1 cucharada de aceite de oliva", fE: "1 cucharada sopera", end: 1170 }
  ],
  // 0 = domingo … 6 = sábado
  menu: [
    ["Huevos con pollo, papa pequeña y espinaca (sin fruta)", "Pescado, ensalada grande y ½ camote"],
    ["Pollo, papa, brócoli y aguacate. Fruta: papaya", "Pargo, camote, ensalada verde y aceite de oliva"],
    ["Res, arroz, frijoles y vainica", "Pollo, papa al horno, zanahoria y ayote"],
    ["Pollo, camote, espinaca y aguacate. Fruta: banano", "Res molida, yuca, chayote y pico de gallo"],
    ["Salmón, papa y brócoli", "Pollo, arroz, ensalada y aceite de oliva"],
    ["Res, camote, vainica y aguacate. Fruta: piña", "Tilapia, papa, ayote y zanahoria"],
    ["Pollo, plátano maduro, frijoles y ensalada", "Res, camote, brócoli y aceite de oliva"]
  ],
  snacks: [
    "3 huevos duros, 170 g de yogur griego, 1 banano y 40 g de avena",
    "1 lata de atún con 300 g de camote, tomate, cebolla morada y limón",
    "130 g de pollo desmechado con 100 g de plátano maduro al horno",
    "Ceviche de 150 g de pescado (sin pepino) con 1 taza de papaya",
    "300 g de yogur griego con 1 taza de piña y 15 g de maní",
    "110 g de carne molida magra con 80 g de yuca y pico de gallo",
    "Omelette de 3 huevos con espinaca y tomate, más 1 banano",
    "100 g de pechuga a la plancha, ¾ de taza de frijoles y ¼ de aguacate"
  ],
  habits: [
    { id: "crea", t: "Creatina · 3–5 g", n: "Con la comida 1" },
    { id: "mag", t: "Magnesio bisglicinato · 200–400 mg", n: "A las 8:00 pm, una hora antes de dormir" },
    { id: "agua", t: "Agua · 3 a 4 litros", n: "Más si suda mucho" },
    { id: "sleep", t: "Acostarse entre 9:00 y 9:30 pm", n: "Máximo 10:00 pm, para levantarse entre 5:30 y 6:00 am" },
    { id: "verd", t: "Verdura en las 3 comidas", n: "Sin límite" },
    { id: "cafe", t: "Último café antes de las 12:00 pm", n: "Se acuesta a las 9:00 pm: así no le daña el sueño" }
  ],
  carbs: [["Papa", "175 g", "1 puño grande"], ["Camote", "150 g", "1 puño"], ["Yuca, ñampí o tiquisque", "80 g", "½ puño"], ["Arroz", "105 g", "⅔ de taza"], ["Plátano maduro, al horno o cocido", "100 g", "½ plátano mediano"], ["Avena (en crudo)", "45 g", "½ taza"], ["Banano", "1 mediano", "1 mediano"], ["Papaya o piña", "2 tazas", "2 puños"], ["Frijoles", "¾ de taza (+11 g de proteína)", "¾ de taza"]],
  prots: [["Pechuga de pollo", "100 g", "1 palma"], ["Res magra (lomo, posta, molida 90/10)", "110 g", "1 palma"], ["Pescado blanco (tilapia, pargo, dorado)", "130 g", "1 palma grande"], ["Salmón", "110 g", "1 palma"], ["Atún en agua, escurrido", "1 lata (≈ 120 g)", "1 lata"], ["Huevos enteros", "5 (máximo 4 a 5 por día)", "5 huevos"], ["Yogur griego natural sin azúcar", "300 g", "1¼ tazas"]]
};

// Lo que trae cada comida del plan, aproximado (para "Comí lo del plan")
const PLAN_MAC = {
  m1: { train: { p: 71, c: 104, f: 18, kcal: 860 }, rest: { p: 70, c: 79, f: 18, kcal: 760 } },
  m2: { train: { p: 45, c: 62, f: 25, kcal: 650 }, rest: { p: 40, c: 35, f: 22, kcal: 500 } },
  m3: { train: { p: 69, c: 65, f: 21, kcal: 725 }, rest: { p: 69, c: 65, f: 21, kcal: 725 } }
};
const TGT_NUM = { train: { kcal: 2400, p: 170, c: 225, f: 75 }, rest: { kcal: 2050, p: 170, c: 150, f: 82 } };
const MEAL_NAME = { m1: "Comida 1", m2: "Merienda", m3: "Cena", x: "Fuera del plan" };
const eatOf = (k) => (Array.isArray(hOf(k).eat) ? hOf(k).eat : []);
function eatTotals(k) {
  const L = eatOf(k), t = { p: 0, c: 0, f: 0, kcal: 0, n: L.length, sinNum: 0 };
  L.forEach((e) => {
    const any = ["p", "c", "f", "kcal"].some((x) => has(e[x]));
    if (!any) { t.sinNum++; return; }
    ["p", "c", "f"].forEach((x) => { if (has(e[x])) t[x] += +e[x]; });
    t.kcal += has(e.kcal) ? +e.kcal : (+e.p || 0) * 4 + (+e.c || 0) * 4 + (+e.f || 0) * 9;
  });
  return t;
}
function eatAdd(k, entry) {
  const L = eatOf(k).map(clone);
  const e = { id: uid(), m: MEAL_NAME[entry.m] ? entry.m : "x", txt: String(entry.txt || "").slice(0, 300), src: entry.src || "app", ts: Date.now() };
  ["p", "c", "f", "kcal"].forEach((x) => { const v = Math.round(+entry[x]); if (entry[x] !== "" && entry[x] != null && isFinite(v) && v >= 0 && v < 5000) e[x] = v; });
  if (has(entry.at) && entry.at >= 0 && entry.at < 1440) e.at = Math.round(+entry.at);
  if (!e.txt && !["p", "c", "f", "kcal"].some((x) => has(e[x]))) return false;
  L.push(e);
  const done = Object.assign({}, hOf(k).done || {});
  if (e.m !== "x") done[e.m] = true;
  hSet(k, { eat: L.slice(-40), done });
  return true;
}
function eatDel(k, id) { hSet(k, { eat: eatOf(k).filter((e) => e.id !== id) }); }
function eatList(k, m) {
  const L = eatOf(k).filter((e) => e.m === m);
  const rows = L.map((e) => {
    const nums = ["p", "c", "f"].filter((x) => has(e[x])).map((x) => `${({ p: "P", c: "C", f: "G" })[x]} ${e[x]} g`).concat(has(e.kcal) ? [`${e.kcal} kcal`] : []);
    return `<li><div><span>${e.at != null ? `<b>${esc(fmtTime(e.at))}</b> · ` : ""}${esc(e.txt || "(sin descripción)")}</span><small>${nums.length ? esc(nums.join(" · ")) : "Sin números: dígale a Jarvis y él lo calcula"}${e.src === "jarvis" ? " · anotado por Jarvis" : ""}</small></div><button type="button" class="eatx" data-act="eat-del" data-id="${esc(e.id)}" aria-label="Borrar">×</button></li>`;
  }).join("");
  return `<div class="eat">${rows ? `<span class="eath">Lo que comió</span><ul>${rows}</ul>` : ""}<div class="eatb"><button type="button" class="btn sm" data-act="eat-open" data-m="${m}">+ Anotar lo que comí</button>${m !== "x" && !L.length ? `<button type="button" class="btn sm" data-act="eat-plan" data-m="${m}">Comí lo del plan</button>` : ""}</div></div>`;
}
function openEatSheet(m) {
  const k = S.hDate, isToday = k === todayKey();
  openSheet(`<h3>${esc(MEAL_NAME[m] || "Anotar comida")}: ¿qué comió?</h3><p class="hint">Escríbalo como se lo diría a alguien, por ejemplo: "2 empanadas de pollo y un café negro". Los números son opcionales: si no los sabe, déjelos vacíos y dígale a Jarvis, él lo calcula y lo anota aquí.</p>
    <div class="f"><label for="eTxt">Qué comió</label><textarea id="eTxt" class="fi" rows="3" maxlength="300" placeholder="Ej.: casado de pollo con arroz, frijoles y ensalada"></textarea></div>
    <div class="f"><label for="eAt">Hora (opcional)</label><input id="eAt" class="fi" type="time" value="${isToday ? toHHMM(nowMin()) : ""}"></div>
    <div class="f"><span class="lb">Números (opcional)</span><div class="eatnum"><label>Proteína g<input id="eP" class="fi" type="number" inputmode="numeric" min="0"></label><label>Carbo g<input id="eC" class="fi" type="number" inputmode="numeric" min="0"></label><label>Grasa g<input id="eF" class="fi" type="number" inputmode="numeric" min="0"></label><label>kcal<input id="eK" class="fi" type="number" inputmode="numeric" min="0"></label></div></div>
    <div class="acts"><button type="button" class="btn" data-act="close">Cancelar</button><button type="button" class="btn pri" data-act="eat-save">Guardar</button></div>`, { type: "eat", m });
}
function saveEat() {
  const x = sheetCtx; if (!x || x.type !== "eat") return;
  const v = (id) => ($(id) || {}).value;
  const ok = eatAdd(S.hDate, { m: x.m, txt: (v("eTxt") || "").trim(), at: toMin(v("eAt")), p: v("eP"), c: v("eC"), f: v("eF"), kcal: v("eK") });
  if (!ok) { toast("Escriba qué comió o algún número"); return; }
  closeSheet(); render(); toast("Anotado");
}
function eatSummary(k, rest) {
  const t = eatTotals(k), g = TGT_NUM[rest ? "rest" : "train"];
  if (!t.n) return `<p class="hnote">Todavía no ha anotado nada hoy. Debajo de cada comida puede tocar <b>Comí lo del plan</b> o anotar lo que comió de verdad.</p>`;
  const bar = (lb, v, goal, u) => `<div class="eatbar"><span>${lb}</span><i><em style="width:${Math.min(100, Math.round((v / goal) * 100))}%"></em></i><b>${Math.round(v)}${u} <small>de ${goal}${u}</small></b></div>`;
  return `<div class="eatsum"><b class="eatst">Lo anotado ${k === todayKey() ? "hoy" : "este día"}</b>${bar("Calorías", t.kcal, g.kcal, "")}${bar("Proteína", t.p, g.p, " g")}${bar("Carbo", t.c, g.c, " g")}${bar("Grasa", t.f, g.f, " g")}${t.sinNum ? `<p class="hnote">${t.sinNum} ${t.sinNum === 1 ? "anotación no tiene" : "anotaciones no tienen"} números todavía: no cuentan en el total hasta que Jarvis las calcule.</p>` : ""}</div>`;
}

const MOB = { id: "mob", t: "Movilidad de entrada · 10 min", n: "Cadera, tobillo, columna torácica, hombro" };
const TRAIN = [
  { t: "Descanso activo", kind: "rest", items: [{ id: "walk", t: "Caminar suave · 30–60 min" }, { id: "mob20", t: "Movilidad · 20 min" }], note: "Nada de pesas ni cardio fuerte. Cuenta como su día de descanso." },
  { t: "Pecho y tríceps", kind: "gym", ex: [["Press de banca", "4 × 6–8"], ["Press inclinado con mancuernas", "3 × 8–10"], ["Fondos", "3 × 8–12"], ["Aperturas en polea", "3 × 12–15"], ["Extensión de tríceps en polea", "3 × 10–12"], ["Press francés", "3 × 10–12"]], close: [{ id: "z2", t: "Zona 2 · 20 min", n: "Tope 140 lpm: bici o caminata en inclinación" }, { id: "core", t: "Core · 10 min" }] },
  { t: "Espalda y bíceps", kind: "gym", ex: [["Dominadas", "4 × 6–10"], ["Remo con barra", "4 × 8"], ["Jalón al pecho", "3 × 10–12"], ["Remo con mancuerna", "3 × 10 por lado"], ["Curl con barra", "3 × 8–10"], ["Curl martillo", "3 × 10–12"]], close: [{ id: "int", t: "Intervalos · 8 × (1 min fuerte + 2 min suave)" }] },
  { t: "Piernas", kind: "gym", ex: [["Sentadilla", "4 × 6–8"], ["Peso muerto rumano", "3 × 8"], ["Prensa", "3 × 10–12"], ["Zancadas", "3 × 10 por pierna"], ["Curl femoral", "3 × 12"], ["Pantorrilla", "4 × 12–15"]], close: [{ id: "mob15", t: "Movilidad · 15 min" }] },
  { t: "Zona 2 larga", kind: "cardio", items: [{ id: "z2l", t: "Zona 2 · 45–60 min", n: "Tope 140 lpm. Si trotando pasa de 140, camine en inclinación o use la bici" }, { id: "core15", t: "Core · 15 min" }, { id: "mob15", t: "Movilidad · 15 min" }], note: "Sin pesas." },
  { t: "Hombros y abdomen", kind: "gym", ex: [["Press militar", "4 × 6–8"], ["Elevaciones laterales", "4 × 12–15"], ["Face pull", "3 × 15"], ["Pájaros (deltoide posterior)", "3 × 12–15"], ["Encogimientos", "3 × 10–12"], ["Elevación de piernas colgado", "3 × 10–12"]], close: [{ id: "z2", t: "Zona 2 · 20 min", n: "Tope 140 lpm: bici o caminata en inclinación" }] },
  { t: "Circuito híbrido tipo Hyrox", kind: "gym", ex: [["Remo 500 m o bici 1 km", "4–5 rondas"], ["Zancadas con peso", "20"], ["Wall balls", "15"], ["Burpees", "10"], ["Cargadas con kettlebell", "10"]], note: "Descanse 2 min entre rondas.", close: [{ id: "core", t: "Core · 10 min" }] }
];
const CORE = [["Plancha", "3 × 40 s"], ["Dead bug", "3 × 10 por lado"], ["Pallof press", "3 × 10 por lado"], ["Rueda abdominal", "3 × 8–10"]];
const RULES = [
  ["Baja más de 0.7 kg por semana", "+30 g de carbohidrato al día"],
  ["El peso y la cintura no se mueven", "−150 kcal (≈ −40 g de carbohidrato) o +10 min de zona 2"],
  ["La fuerza baja", "Revisar el sueño primero y después subir el carbohidrato"],
  ["Duerme menos de 7 h varios días", "Se quita la segunda sesión hasta recuperarse"]
];

/* ---------- health data (collection "health": carlos_YYYY-MM-DD) ---------- */
const hId = (p, k) => `h_${p}_${k}`; // datos de salud del día, guardados junto a los planes
const hOf = (k, p = S.person) => D.plans[hId(p, k)] || { person: p, date: k, done: {} };
function hSet(k, patch) {
  const cur = clone(hOf(k)); cur.done = cur.done || {};
  Object.assign(cur, patch, { person: S.person, date: k, updated: Date.now() });
  put("plans", hId(S.person, k), cur);
}
function hToggle(k, key) {
  const cur = clone(hOf(k)); cur.done = cur.done || {};
  if (cur.done[key]) delete cur.done[key]; else cur.done[key] = true;
  hSet(k, { done: cur.done });
}
const daysBetween = (a, b) => Math.round((parseKey(b) - parseKey(a)) / 86400000);
function weekInfo(k) {
  const n = Math.floor(daysBetween(PLAN_START, k) / 7) + 1;
  return { n: Math.max(1, n), cyc: n < 1 ? 1 : ((n - 1) % 4) + 1 };
}
/* ---------- horario del día según gym (mañana/tarde) y ayuno real ---------- */
const prevKey = (k) => keyOf(addDays(parseKey(k), -1));
const nextKey = (k) => keyOf(addDays(parseKey(k), 1));
const has = (v) => v != null && isFinite(v);
function plannedOpen(k) {
  const pc = hOf(prevKey(k)).closeAt;
  return has(pc) ? Math.min(1439, Math.max(0, pc + FAST_M - 1440)) : DEF_OPEN;
}
/* Qué sesión entrena un día: la del plan (por día de la semana) o la que Carlos escogió (h.sess = índice de TRAIN) */
const planIx = (k) => parseKey(k).getDay();
const sessOf = (k) => { const v = hOf(k).sess; return Number.isInteger(v) && v >= 0 && v <= 6 ? v : planIx(k); };
const sessDay = (k) => TRAIN[sessOf(k)];
const isRestDay = (k) => sessDay(k).kind === "rest";
const didTrain = (k) => Object.keys(hOf(k).done || {}).some((x) => x.startsWith("t_"));
function weekSess(k) {        // { índice de TRAIN: fecha en que se hizo } en la semana (lun–dom) de k
  const mon = mondayOf(parseKey(k)), out = {};
  for (let i = 0; i < 7; i++) { const kk = keyOf(addDays(mon, i)); if (kk !== k && didTrain(kk)) out[sessOf(kk)] = kk; }
  return out;
}
function pendingSess(k) {     // sesiones de gym de días anteriores de esta semana que no se hicieron
  if (k > todayKey()) return [];
  const mon = mondayOf(parseKey(k)), made = weekSess(k), out = [];
  for (let kk = keyOf(mon); kk < k; kk = nextKey(kk)) {
    const ix = planIx(kk);
    if (TRAIN[ix].kind !== "rest" && made[ix] == null && !didTrain(kk) && sessOf(k) !== ix && daysBetween(PLAN_START, kk) >= 0) out.push({ ix, k: kk });
  }
  return out;
}
const GYM_DEF = { am: 390, pm: 960 };        // 6:30 am en ayunas · 4:00 pm ya comido
function gymStart(k) {                       // null = hoy no va
  const h = hOf(k);
  if (h.gymAt === -1) return null;
  if (has(h.gymAt)) return h.gymAt;
  return GYM_DEF[h.slot === "am" ? "am" : "pm"];
}
function daySched(k) {
  const h = hOf(k), wd = parseKey(k).getDay();
  const open = has(h.breakAt) ? h.breakAt : plannedOpen(k);
  const closeT = Math.max(open + 240, Math.min(open + WIN_M, MAX_CLOSE));
  const rd = isRestDay(k), gs = rd ? null : gymStart(k), set = has(h.gymAt) && h.gymAt >= 0;
  let gym = null, m2 = open + 210, m3 = closeT - 60, slot = "pm", mode = "none";
  if (gs != null) {
    if (gs < open) {                                     // antes de comer: en ayunas
      slot = "am"; mode = "fasted";
      gym = { s: gs, e: Math.min(gs + 75, 1439) };
      m2 = open + 210; m3 = closeT - 60;
    } else if (gs >= closeT - 30) {                      // después de cerrar la ventana
      mode = "late"; gym = { s: gs, e: Math.min(gs + 90, 1439) };
      m2 = open + 210; m3 = closeT - 45;
    } else {
      gym = { s: gs, e: gs + 90 };
      if (gs - open >= 150) {                            // merienda antes del gym (pre-entreno)
        mode = "pre"; m2 = Math.max(open + 150, gs - 90);
        m3 = Math.max(Math.min(gym.e + 30, closeT - 45), m2 + 120);
      } else {                                           // gym poco después de la comida 1: merienda de recuperación
        mode = "post"; m2 = gym.e + 20;
        m3 = Math.max(m2 + 150, closeT - 45);
      }
      m3 = Math.min(m3, closeT - 30);
      if (m2 > m3 - 90) m2 = Math.max(open + 120, m3 - 90);
    }
  }
  return { slot, mode, set, open, closeT, gym, m: [open, m2, m3], walk: rd ? { s: 960, e: 1020 } : null };
}
function planBlocks(k) {
  const sc = daySched(k), day = sessDay(k), B = [];
  B.push({ id: "pl_m1", t: "Comida 1 · romper el ayuno", s: sc.m[0], e: sc.m[0] + 45, c: "health" });
  B.push({ id: "pl_m2", t: "Merienda", s: sc.m[1], e: sc.m[1] + 30, c: "health" });
  if (sc.gym) { const g = { id: "pl_gym", t: "Gym: " + day.t, s: sc.gym.s, e: sc.gym.e, c: "train", n: sc.mode === "fasted" ? "En ayunas" : sc.mode === "post" ? "Merienda de recuperación al salir" : "" }; if (sc.set) g.fx = true; B.push(g); }
  if (sc.gym) { const s2 = sc.gym.s >= 720 ? 360 : 1020; B.push({ id: "pl_s2", t: "Sesión 2 (opcional) · zona 2 suave o movilidad", s: s2, e: s2 + 40, c: "train", n: "Tope 140 lpm (bici o caminata, no correr fuerte). Solo si durmió 7.5 h o más y WHOOP está en verde" }); }
  if (sc.walk) B.push({ id: "pl_walk", t: "Caminar suave + movilidad", s: sc.walk.s, e: sc.walk.e, c: "train" });
  const ca = hOf(k).closeAt, cEnd = has(ca) ? ca : sc.closeT;
  B.push({ id: "pl_m3", t: "Cena · cerrar la ventana", s: Math.min(sc.m[2], cEnd - 30), e: Math.max(Math.min(sc.m[2], cEnd - 30) + 30, cEnd), c: "health", n: (has(ca) ? "Terminó a las " : "Terminar a las ") + fmtTime(cEnd) });
  B.push({ id: "pl_mag", t: "Magnesio y pantallas abajo", s: 1200, e: 1215, c: "health" });
  B.push({ id: "pl_sleep", t: "A dormir (máximo 10:00 pm)", s: 1260, e: 1290, c: "rest" });
  return B.map((b) => { if (!b.n) delete b.n; return b; });
}
function applyToDay(k) {
  const tg = { kind: "plan", date: k };
  const prev = blocksOf(tg), doneMap = {};
  prev.forEach((b) => { if (String(b.id).startsWith("pl_") && b.done) doneMap[b.id] = true; });
  const keep = prev.filter((b) => !String(b.id).startsWith("pl_"));
  setBlocks(tg, keep.concat(planBlocks(k).map((b) => Object.assign(b, doneMap[b.id] ? { done: true } : {}))));
  if (typeof reconcileSave === "function") reconcileSave(k);
}
const hasPlanBlocks = (k) => blocksOf({ kind: "plan", date: k }).some((b) => String(b.id).startsWith("pl_"));
function refreshDays(k) { [k, nextKey(k)].forEach((kk) => { if (hasPlanBlocks(kk)) applyToDay(kk); }); }

function fastNow() {
  const k = todayKey(), m = nowMin(), sc = daySched(k), h = hOf(k), pc = hOf(prevKey(k)).closeAt;
  const since = has(pc) ? pc - 1440 : null;
  if (has(h.closeAt)) return { cls: "fast", h: "Ayuno en curso", d: `Terminó de comer a las ${fmtTime(h.closeAt)}. Mañana puede comer a las ${fmtTime(Math.min(1439, h.closeAt + FAST_M - 1440))}.` };
  if (has(h.breakAt)) {
    const fl = has(pc) ? h.breakAt + 1440 - pc : null;
    if (m < sc.closeT) return { cls: "open", h: "Ventana abierta", d: `Rompió el ayuno a las ${fmtTime(h.breakAt)}${fl != null ? ` (ayuno de ${fmtDur(fl)})` : ""}. Cierre a las ${fmtTime(sc.closeT)}: faltan ${fmtDur(sc.closeT - m)}.` };
    return { cls: "warn", h: "Ya pasó la hora de cierre", d: `Lo recomendado era cerrar a las ${fmtTime(sc.closeT)}. Toque "Terminé de comer" cuando acabe.` };
  }
  if (m < sc.open) return { cls: "fast", h: "En ayuno", d: `Puede comer a las ${fmtTime(sc.open)}: faltan ${fmtDur(sc.open - m)}.${since != null ? ` Lleva ${fmtDur(m - since)}.` : ""}` };
  return { cls: "open", h: "Ya puede comer", d: `${since != null ? `Lleva ${fmtDur(m - since)} de ayuno. ` : ""}Toque "Rompí el ayuno" cuando coma.` };
}
function fastPast(k) {
  const h = hOf(k), sc = daySched(k), pc = hOf(prevKey(k)).closeAt;
  if (k > todayKey()) return { cls: "", h: dayLabel(k), d: `Plan: comer a las ${fmtTime(sc.open)} y cerrar a las ${fmtTime(sc.closeT)}.` };
  const fl = has(h.breakAt) && has(pc) ? h.breakAt + 1440 - pc : null;
  return { cls: "", h: dayLabel(k), d: `${has(h.breakAt) ? "Rompió el ayuno a las " + fmtTime(h.breakAt) : "Sin hora de romper el ayuno"}${fl != null ? ` (ayuno de ${fmtDur(fl)})` : ""} · ${has(h.closeAt) ? "terminó a las " + fmtTime(h.closeAt) : "sin hora de cierre"}.` };
}
function slotSeg(k) {
  const sc = daySched(k), h = hOf(k);
  if (isRestDay(k)) return `<p class="hnote"><b>${parseKey(k).getDay() === 0 ? "Domingo" : "Hoy"}:</b> descanso activo, sin gym.</p>`;
  const lbl = h.gymAt === -1 ? "Hoy no voy" : sc.gym ? fmtTime(sc.gym.s) + (sc.set ? "" : " (sugerido)") : "—";
  const why = { fasted: "en ayunas, antes de comer", pre: "merienda antes del gym", post: "merienda de recuperación al salir", late: "después de cerrar la ventana", none: "" }[sc.mode];
  return `<button type="button" class="gymline" data-act="g-open"><span><small>¿A qué hora va hoy al gym?</small><b>${esc(lbl)}</b>${why ? `<em>${esc(why)}</em>` : ""}</span><span class="gch">Cambiar</span></button>`;
}
function openGymSheet() {
  const k = S.hDate, h = hOf(k), sc = daySched(k), cur = h.gymAt;
  const opts = [360, 390, 420, 720, 750, 780, 810, 900, 960, 1020];
  const chips = opts.map((v) => `<button type="button" class="chip" data-act="g-set" data-v="${v}" aria-pressed="${cur === v}">${esc(fmtTime(v))}</button>`).join("");
  openSheet(`<h3>¿A qué hora va al gym?</h3><p class="hint">Las comidas y el resto del día se acomodan solos a esa hora. Hoy come de ${esc(fmtTime(sc.open))} a ${esc(fmtTime(sc.closeT))}.</p>
    <div class="f"><span class="lb">Horas rápidas</span><div class="chips">${chips}</div></div>
    <div class="f"><label for="gTime">Otra hora</label><div class="row"><input id="gTime" class="fi" type="time" value="${has(cur) && cur >= 0 ? toHHMM(cur) : ""}" style="flex:1"><button type="button" class="btn" data-act="g-custom">Guardar</button></div></div>
    <div class="acts"><button type="button" class="btn" data-act="g-set" data-v="-1">Hoy no voy</button>${has(cur) ? `<button type="button" class="btn" data-act="g-set" data-v="">Volver a la sugerida</button>` : ""}<button type="button" class="btn" data-act="close">Cancelar</button></div>`, { type: "gym" });
}
function saveGym(v) {
  const k = S.hDate;
  hSet(k, { gymAt: v });
  applyToDay(k);
  closeSheet();
  const sc = daySched(k);
  toast(v === -1 ? "Listo: hoy sin gym" : sc.gym ? `Día armado: gym a las ${fmtTime(sc.gym.s)}, merienda a las ${fmtTime(sc.m[1])}, cena a las ${fmtTime(sc.m[2])}` : T().saved);
}
function timeline(k) {
  const act = blocksOf({ kind: "plan", date: k }).filter((b) => /^pl_(m[123]|gym|walk)$/.test(b.id));
  return `<ol class="tline">${(act.length ? act : planBlocks(k)).filter((b) => b.id !== "pl_mag" && b.id !== "pl_sleep" && b.id !== "pl_s2").sort((a, b) => a.s - b.s).map((b) => `<li><b>${esc(fmtTime(b.s))}</b><span>${esc(b.t)}${b.id === "pl_gym" || b.id === "pl_walk" ? " · hasta " + esc(fmtTime(b.e)) : b.id === "pl_m3" && b.n ? " · " + esc(b.n.toLowerCase()) : ""}</span></li>`).join("")}</ol>`;
}
function openFastSheet(which) {
  const k = S.hDate, h = hOf(k), sc = daySched(k), isToday = k === todayKey(), m = nowMin();
  const cur = which === "break" ? h.breakAt : h.closeAt;
  const opts = which === "break" ? [sc.open - 30, sc.open, sc.open + 30, sc.open + 60] : [1080, 1110, 1140, 1170, 1200];
  const chips = opts.filter((v) => v >= 0 && v < 1440).map((v) => `<button type="button" class="chip" data-act="f-set" data-v="${v}" aria-pressed="${cur === v}">${esc(fmtTime(v))}</button>`).join("");
  const title = which === "break" ? "¿A qué hora rompió el ayuno?" : "¿A qué hora terminó de comer?";
  const help = which === "break" ? `Según el plan, hoy podía comer desde las ${fmtTime(sc.open)}.` : "Con esa hora se calcula a qué hora puede comer mañana (16 h después).";
  openSheet(`<h3>${esc(title)}</h3><p class="hint">${esc(help)}</p>
    ${isToday ? `<div class="menu" style="margin-bottom:14px"><button type="button" class="btn pri" data-act="f-set" data-v="${m}">Ahora · ${esc(fmtTime(m))}</button></div>` : ""}
    <div class="f"><span class="lb">Horas rápidas</span><div class="chips">${chips}</div></div>
    <div class="f"><label for="fTime">Otra hora</label><div class="row"><input id="fTime" class="fi" type="time" value="${has(cur) ? toHHMM(cur) : ""}" style="flex:1"><button type="button" class="btn" data-act="f-custom">Guardar</button></div></div>
    <div class="acts">${has(cur) ? `<button type="button" class="btn danger" data-act="f-clear">Borrar hora</button>` : ""}<button type="button" class="btn" data-act="close">Cancelar</button></div>`, { type: "fast", which });
}
function saveFast(v) {
  const k = S.hDate, which = sheetCtx && sheetCtx.which; if (!which) return;
  hSet(k, { [which === "break" ? "breakAt" : "closeAt"]: v });
  refreshDays(k);
  closeSheet();
  if (v == null) toast(T().deleted);
  else if (which === "close") toast(`Listo. Mañana puede comer a las ${fmtTime(Math.min(1439, v + FAST_M - 1440))}`);
  else toast(`Ayuno roto a las ${fmtTime(v)}`);
}

const isReview = (k) => { const d = daysBetween("2026-12-07", k); return d >= 0 && d % 14 === 0; };

/* checks due on a given day (Carlos) */
function checksFor(k) {
  const wd = parseKey(k).getDay(), out = [];
  out.push({ id: "whoop", kind: "tick", t: "Revisar WHOOP al despertar", n: "Si durmió 7.5 h o más (acostándose a las 9:00–9:30 pm) y está en verde, puede hacer la sesión 2 (suave). En rojo, solo zona 2 suave o movilidad." });
  if (wd === 1 || wd === 3 || wd === 5) out.push({ id: "weight", kind: "num", unit: "kg", t: "Peso en ayunas", n: "Después del baño. Lo que cuenta es el promedio de la semana." });
  if (wd === 1) out.push({ id: "waist", kind: "num", unit: "cm", t: "Cintura", n: "A la altura del ombligo, sin meter el abdomen." });
  if (wd === 0) out.push({ id: "photo", kind: "tick", t: "Foto de progreso", n: "Misma luz y misma pose cada semana." });
  if (isReview(k)) out.push({ id: "review", kind: "tick", t: "Revisión de 2 semanas con Jarvis", n: "Pásele a Jarvis el promedio de peso, la cintura y cómo va la fuerza: se ajusta la comida con las reglas de ajuste." });
  return out;
}
function checkDone(k, c) { const h = hOf(k); return c.kind === "num" ? isFinite(+h[c.id]) && h[c.id] !== "" && h[c.id] != null : !!(h.done || {})[c.id]; }

function weekAvg(monKey) {
  const vals = [];
  for (let i = 0; i < 7; i++) { const v = +hOf(keyOf(addDays(parseKey(monKey), i))).weight; if (isFinite(v) && v > 0) vals.push(v); }
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}
function lastVal(field, beforeKey) {
  let best = null;
  Object.entries(D.plans).forEach(([id, h]) => { if (!id.startsWith("h_")) return; if (h && h.person === S.person && isFinite(+h[field]) && +h[field] > 0 && (!beforeKey || h.date <= beforeKey) && (!best || h.date > best.date)) best = h; });
  return best ? { v: +best[field], date: best.date } : null;
}

const fmtNum = (v, d = 1) => (Math.round(v * 10 ** d) / 10 ** d).toLocaleString(T().loc, { minimumFractionDigits: d, maximumFractionDigits: d });
const tick = (on, act, attrs, label) => `<button type="button" class="hchk${on ? " on" : ""}" data-act="${act}" ${attrs} aria-pressed="${on}" aria-label="${esc(label)}">${IC.check}</button>`;

function noPlan(title) {
  const t = T();
  return `<h1>${esc(title)}</h1><div class="empty" style="margin-top:18px"><p><b>${esc(t.noPlan)}</b></p><p class="muted">${esc(t.noPlanHelp)}</p></div>`;
}

function dayPicker(k, act) {
  const t = T(), mon = mondayOf(parseKey(k)), tk = todayKey();
  let s = `<div class="strip">`;
  s += `<button class="nav" data-act="${act}" data-k="${keyOf(addDays(mon, -7))}" aria-label="‹">${IC.left}</button>`;
  for (let i = 0; i < 7; i++) {
    const d = addDays(mon, i), kk = keyOf(d);
    s += `<button class="d${kk === tk ? " today" : ""}" data-act="${act}" data-k="${kk}" aria-pressed="${kk === k}" aria-label="${esc(niceDate(kk))}"><small>${esc(t.wd[d.getDay()])}</small><b>${d.getDate()}</b><i></i></button>`;
  }
  s += `<button class="nav" data-act="${act}" data-k="${keyOf(addDays(mon, 7))}" aria-label="›">${IC.right}</button></div>`;
  return s;
}

/* ---------- ALIMENTACIÓN ---------- */
function renderFood() {
  const t = T();
  if (S.person !== "carlos") { $("v-food").innerHTML = noPlan(t.tabFoodLong); return; }
  const k = S.hDate, d = parseKey(k), wd = d.getDay(), rest = isRestDay(k);
  const tg = FOOD.targets[rest ? "rest" : "train"], h = hOf(k), done = h.done || {};
  const fs = k === todayKey() ? fastNow() : fastPast(k), sc = daySched(k), h2 = hOf(k);
  const snackIx = Math.floor(daysBetween("2026-01-01", k)) % FOOD.snacks.length;
  const mealsDone = FOOD.meals.filter((x) => done[x.id]).length, habDone = FOOD.habits.filter((x) => done[x.id]).length;

  const meals = FOOD.meals.map((x, i) => {
    const sug = x.id === "m1" ? FOOD.menu[wd][0] : x.id === "m3" ? FOOD.menu[wd][1] : FOOD.snacks[(snackIx + 8) % 8];
    return `<li class="hcard${done[x.id] ? " ok" : ""}">
      <div class="hrow"><div class="htx"><span class="hk">${esc(fmtTime(sc.m[i]))}${x.id === "m3" ? " – " + esc(fmtTime(sc.closeT)) : ""}</span><b class="ht">${esc(x.t)}</b></div>${tick(!!done[x.id], "h-tick", `data-key="${x.id}"`, x.t)}</div>
      <p class="sug"><span class="muted">Hoy:</span> ${esc(sug)}</p>
      ${x.id === "m2" ? `<dl class="macro"><div><dt>Meta</dt><dd>35–40 g de proteína y algo de carbohidrato${rest ? " (descanso: sin avena)" : ""}. Puede usar cualquiera de las 8 meriendas de la guía.</dd></div></dl>` : `<dl class="macro"><div><dt>Proteína</dt><dd>${esc(x.p)}<span class="eye">A ojo: ${esc(x.pE)}</span></dd></div><div><dt>Carbohidrato</dt><dd>${esc(rest ? x.cRest : x.c)}<span class="eye">A ojo: ${esc(rest ? x.cRestE : x.cE)}</span></dd></div>${x.v ? `<div><dt>Verdura</dt><dd>${esc(x.v)}<span class="eye">A ojo: ${esc(x.vE)}</span></dd></div>` : ""}<div><dt>Grasa</dt><dd>${esc(x.f)}<span class="eye">A ojo: ${esc(x.fE)}</span></dd></div></dl>`}
      ${eatList(k, x.id)}
    </li>`;
  }).join("");

  const habits = FOOD.habits.map((x) => `<li class="hl${done[x.id] ? " ok" : ""}"><div class="htx"><b class="ht">${esc(x.t)}</b><span class="hn">${esc(x.n)}</span></div>${tick(!!done[x.id], "h-tick", `data-key="${x.id}"`, x.t)}</li>`).join("");
  const tbl = (rows, h1, h2) => `<table class="htbl"><thead><tr><th>${h1}</th><th>${h2}</th><th>A ojo</th></tr></thead><tbody>${rows.map(([a, b, c]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td><td>${esc(c || "")}</td></tr>`).join("")}</tbody></table>`;

  $("v-food").innerHTML = `
    <h1>${esc(t.tabFoodLong)}</h1>
    <p class="sub">Ayuno de 16 h · hoy: comer de ${esc(fmtTime(sc.open))} a ${esc(fmtTime(sc.closeT))}</p>
    ${dayPicker(k, "h-day")}
    <div class="hhero">
      <div class="fastbox ${fs.cls}"><b>${esc(fs.h)}</b><span>${esc(fs.d)}</span></div>
      <div class="fbtns"><button type="button" class="btn${has(h2.breakAt) ? "" : " pri"}" data-act="f-open" data-w="break">${has(h2.breakAt) ? "Rompí el ayuno · " + esc(fmtTime(h2.breakAt)) : "Rompí el ayuno"}</button><button type="button" class="btn${has(h2.breakAt) && !has(h2.closeAt) ? " pri" : ""}" data-act="f-open" data-w="close">${has(h2.closeAt) ? "Terminé · " + esc(fmtTime(h2.closeAt)) : "Terminé de comer"}</button></div>
      ${slotSeg(k)}
      <div class="tgt"><div><small>Calorías</small><b>${esc(tg.kcal)}</b></div><div><small>Proteína</small><b>${esc(tg.p)}</b></div><div><small>Carbohidrato</small><b>${esc(tg.c)}</b></div><div><small>Grasa</small><b>${esc(tg.f)}</b></div></div>
      <p class="hnote">${rest ? "Día de descanso: sin fruta en la comida 1 ni avena en la merienda." : "Con balanza: todo se pesa ya cocido. Sin balanza: use su mano (palma = proteína, puño = carbohidrato, pulgar = grasa)."}</p>
    </div>
    <h2>Horario de ${esc(dayLabel(k).toLowerCase())}</h2>
    ${timeline(k)}
    <div class="row" style="margin-top:10px"><button type="button" class="btn" data-act="to-day">${hasPlanBlocks(k) ? "Actualizar Mi día con este horario" : "Poner este horario en Mi día"}</button></div>
    <h2>Comidas de ${esc(dayLabel(k).toLowerCase())} <span class="cnt">${mealsDone}/3</span></h2>
    ${eatSummary(k, rest)}
    <ul class="hlist">${meals}<li class="hcard"><div class="hrow"><div class="htx"><span class="hk">Cuando sea</span><b class="ht">Algo fuera del plan</b></div></div><p class="sug muted">Algo rápido mientras trabajaba, un fresco, una galleta… todo cuenta.</p>${eatList(k, "x")}</li></ul>
    <h2>Hábitos del día <span class="cnt">${habDone}/${FOOD.habits.length}</span></h2>
    <ul class="hlist2">${habits}</ul>
    <h2>Guía</h2>
    <details class="hdet"><summary>Cómo pesar con su balanza (Gynipot GY-A09)</summary><ol class="hol"><li>Enciéndala con ⏻/T y revise que diga <b>g</b>; si no, toque UNIT hasta que salga.</li><li>Ponga el plato vacío y toque ⏻/T: queda en 0 (tara).</li><li>Sirva la proteína hasta el número del plan; toque ⏻/T otra vez y sirva el carbohidrato.</li><li>Pese la comida ya cocida. Mide de 2 en 2 g y hasta 5 kg: sirve para todo, incluso los 15 g de maní.</li><li>Si los números saltan o se apaga sola, cambie las 2 baterías AAA.</li></ol></details>
    <details class="hdet"><summary>8 meriendas limpias</summary><ol class="hol">${FOOD.snacks.map((s) => `<li>${esc(s)}</li>`).join("")}</ol></details>
    <details class="hdet"><summary>Intercambios de carbohidrato (≈ 30 g cada uno)</summary>${tbl(FOOD.carbs, "Alimento", "Cocido")}</details>
    <details class="hdet"><summary>Intercambios de proteína (≈ 30 g cada uno)</summary>${tbl(FOOD.prots, "Alimento", "Cocido")}</details>
    <details class="hdet"><summary>Menú de la semana</summary>${`<table class="htbl"><thead><tr><th>Día</th><th>Comida 1</th><th>Cena</th></tr></thead><tbody>${[1, 2, 3, 4, 5, 6, 0].map((i) => `<tr${i === wd ? ' class="cur"' : ""}><td>${esc(t.wdLong[i])}</td><td>${esc(FOOD.menu[i][0])}</td><td>${esc(FOOD.menu[i][1])}</td></tr>`).join("")}</tbody></table>`}</details>
    <p class="hfoot muted">Cuando la familia cocine otra cosa: pese la proteína, use los intercambios para el carbohidrato y llene el resto del plato con verdura.</p>`;
}

/* ---------- cambiar la sesión del día ---------- */
function sessLine(k) {
  const six = sessOf(k), moved = six !== planIx(k), day = TRAIN[six];
  return `<button type="button" class="gymline" data-act="s-open"><span><small>¿Qué entrena hoy?</small><b>${esc(day.t)}</b><em>${moved ? "Cambiado · el plan decía " + esc(TRAIN[planIx(k)].t) : "La del plan de hoy"}</em></span><span class="gch">Cambiar</span></button>`;
}
function pendBanner(k) {
  const p = pendingSess(k);
  if (!p.length || k !== todayKey()) return "";
  const last = p[p.length - 1];
  return `<div class="pend"><div><b>Quedó pendiente: ${esc(TRAIN[last.ix].t)}</b><span>Le tocaba el ${esc(niceDate(last.k))} y no la marcó. Si la hace hoy, la de hoy (${esc(TRAIN[sessOf(k)].t)}) queda para otro día de la semana.</span></div><button type="button" class="btn pri sm" data-act="s-set" data-v="${last.ix}">Hacerla hoy</button></div>`;
}
const SESS_ORDER = [1, 2, 3, 4, 5, 6, 0];
function sessWarn(k, ix) {
  const day = TRAIN[ix], prev = sessDay(prevKey(k)), made = weekSess(k);
  const w = [];
  if (made[ix] != null && day.kind !== "rest") w.push(`Ya la hizo el ${niceDate(made[ix])}`);
  if (day.kind === "gym" && prev.t === day.t && didTrain(prevKey(k))) w.push("La hizo ayer: el músculo necesita 48 h");
  if (/Piernas/.test(day.t) && /Hyrox/.test(prev.t) && didTrain(prevKey(k))) w.push("Ayer hizo circuito: las piernas van a estar cansadas");
  if (/Hyrox/.test(day.t) && /Piernas/.test(prev.t) && didTrain(prevKey(k))) w.push("Ayer hizo piernas: el circuito le va a costar más");
  return w;
}
function openSessSheet() {
  const k = S.hDate, cur = sessOf(k), pix = planIx(k), pend = pendingSess(k).map((x) => x.ix), made = weekSess(k);
  const rows = SESS_ORDER.map((ix) => {
    const d = TRAIN[ix], w = sessWarn(k, ix);
    const tags = [ix === pix ? `<i class="tg">Plan de hoy</i>` : "", pend.includes(ix) ? `<i class="tg pd">Pendiente</i>` : "", made[ix] != null && d.kind !== "rest" ? `<i class="tg ok">Hecha ✓</i>` : ""].join("");
    const what = d.ex ? d.ex.slice(0, 3).map((e) => e[0]).join(", ") + (d.ex.length > 3 ? "…" : "") : (d.items || []).map((x) => x.t.split(" · ")[0]).join(", ");
    return `<button type="button" class="sopt" data-act="s-set" data-v="${ix}" aria-pressed="${cur === ix}"><span class="sday">${esc(T().wd[ix])}</span><span class="sbody"><b>${esc(d.t)}</b><small>${esc(what)}</small>${tags ? `<span class="tgs">${tags}</span>` : ""}${w.length ? `<span class="swarn">${esc(w.join(" · "))}</span>` : ""}</span></button>`;
  }).join("");
  openSheet(`<h3>¿Qué entrena hoy?</h3><p class="hint">Son las mismas sesiones del plan, solo cambia el día. La regla: en la semana se hacen todas una vez. Si mueve una, la que quita hoy hágala otro día.</p><div class="sopts">${rows}</div>
    <div class="acts">${cur !== pix ? `<button type="button" class="btn" data-act="s-set" data-v="${pix}">Volver a la del plan</button>` : ""}<button type="button" class="btn" data-act="close">Cerrar</button></div>`, { type: "sess" });
}
function saveSess(ix) {
  const k = S.hDate, cur = sessOf(k);
  if (ix === cur) { closeSheet(); return; }
  const done = Object.assign({}, hOf(k).done || {});
  Object.keys(done).forEach((x) => { if (x.startsWith("t_")) delete done[x]; });
  hSet(k, { sess: ix === planIx(k) ? null : ix, done });
  applyToDay(k);
  closeSheet();
  toast(recWeek(k) ? `Hoy: ${TRAIN[ix].t}. Mire cómo le recomiendo la semana` : `Hoy: ${TRAIN[ix].t}`);
}


/* ---------- el entrenador: cómo queda la semana cuando se mueve una sesión ---------- */
const SESS_PRIO = [1, 2, 3, 5, 6, 4];   // si no caben todas, se cae primero la zona 2 larga
const SESS_WHY = { 4: "es la que menos afecta ganar músculo", 6: "el circuito es lo más fácil de soltar después de la zona 2", 5: "", 3: "", 2: "", 1: "" };
const SESS_TIP = {
  0: "Camine suave y estire. El músculo crece cuando descansa: hoy también es parte del plan.",
  1: "Empiece por el press de banca con el pecho fresco. Deje 1 o 2 repeticiones en reserva en cada serie.",
  2: "En dominadas y remo, jale con los codos y apriete la espalda arriba un segundo. Más control, menos impulso.",
  3: "Sentadilla primero, cuando tiene más energía. Si la espalda baja se redondea, baje el peso.",
  4: "Zona 2 es suave: tiene que poder hablar. Si pasa de 140 lpm, baje el ritmo.",
  5: "Elevaciones laterales con peso que controle: los hombros crecen con técnica, no con impulso.",
  6: "Ritmo constante en todas las rondas. Si en la ronda 3 ya no puede, salió muy rápido."
};
const clash = (a, b) => a && b && (a === b || (a === 3 && b === 6) || (a === 6 && b === 3));
function perms(a) { if (a.length <= 1) return [a.slice()]; const out = []; a.forEach((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).forEach((p) => out.push([x].concat(p)))); return out; }
function recWeek(k) {
  if (k !== todayKey() || S.person !== "carlos") return null;
  const mon = mondayOf(parseKey(k)), idx = (parseKey(k).getDay() + 6) % 7;   // 0 = lunes
  if (idx >= 5) return null;                                                 // sábado y domingo: no hay semana que acomodar
  const keys = Array.from({ length: 7 }, (_, i) => keyOf(addDays(mon, i)));
  const covered = new Set();
  keys.slice(0, idx).forEach((kk) => { if (didTrain(kk)) covered.add(sessOf(kk)); });
  covered.add(sessOf(k));
  const fut = keys.slice(idx + 1, 6);                                        // hasta el sábado; el domingo queda de descanso
  let want = SESS_PRIO.filter((x) => !covered.has(x));
  const skipped = want.slice(fut.length);
  want = want.slice(0, fut.length);
  while (want.length < fut.length) want.push(0);
  const cur = fut.map(sessOf);
  let best = null, bestScore = Infinity;
  perms(want).forEach((p) => {
    let prev = sessOf(k), ok = true, sc = 0;
    p.forEach((x, i) => { if (clash(prev, x)) ok = false; prev = x; const day = idx + 2 + i; sc += x ? Math.abs(((x + 6) % 7) - (day - 1)) : 0; });
    if (ok && sc < bestScore) { best = p; bestScore = sc; }
  });
  if (!best) return null;
  const curSet = new Set(cur), problem = cur.some((x) => x && covered.has(x)) || want.some((x) => x && !curSet.has(x));
  if (!problem || JSON.stringify(best) === JSON.stringify(cur)) return null;
  return { days: fut.map((kk, i) => ({ k: kk, ix: best[i], was: cur[i] })), skipped, sig: k + ":" + best.join("") };
}
function weekCard(k) {
  const r = recWeek(k);
  if (!r || hOf(k).wkNo === r.sig) return "";
  const today = sessDay(k), moved = sessOf(k) !== planIx(k);
  const rows = r.days.map((d) => `<li${d.ix !== d.was ? ' class="chg"' : ""}><span>${esc(T().wd[parseKey(d.k).getDay()])}</span><b>${esc(TRAIN[d.ix].t)}</b>${d.ix !== d.was ? `<small>antes: <s>${esc(TRAIN[d.was].t)}</s></small>` : ""}</li>`).join("") + `<li><span>${esc(T().wd[0])}</span><b>Descanso activo</b></li>`;
  const skip = r.skipped.length ? `<p class="wkskip">Esta semana se salta: <b>${esc(r.skipped.map((x) => TRAIN[x].t).join(", "))}</b>${r.skipped.length === 1 && SESS_WHY[r.skipped[0]] ? ` (${esc(SESS_WHY[r.skipped[0]])})` : ""}. No la meta el domingo: el descanso vale más.</p>` : "";
  return `<section class="jcard wk" aria-label="Jarvis"><div class="jh"><span class="jdot" aria-hidden="true">J</span><b>Así le recomiendo la semana</b></div>
    <p class="wkhead">Hoy entrena <b>${esc(today.t)}</b>${moved ? `, que tocaba el ${esc(T().wdLong[sessOf(k)].toLowerCase())}` : ""}. Para hacer todas las sesiones sin repetir y sin juntar piernas con el circuito:</p>
    <ol class="wkl">${rows}</ol>${skip}
    <div class="advb"><button type="button" class="btn pri" data-act="wk-ok" data-sig="${esc(r.sig)}">Acomodar la semana así</button><button type="button" class="btn" data-act="wk-no" data-sig="${esc(r.sig)}">Dejarla como está</button></div></section>`;
}
function applyWeek(sig) {
  const k = todayKey(), r = recWeek(k);
  if (!r || r.sig !== sig) return;
  r.days.forEach((d) => {
    if (d.ix === d.was) return;
    hSet(d.k, { sess: d.ix === planIx(d.k) ? null : d.ix });
    if (hasPlanBlocks(d.k)) applyToDay(d.k);
  });
  toast("Semana acomodada");
}
function coachTip(k) {
  const ix = sessOf(k);
  return `<p class="coach"><b>Jarvis:</b> ${esc(SESS_TIP[ix] || "")}</p>`;
}

/* ---------- ENTRENAMIENTO ---------- */
function renderTrain() {
  const t = T();
  if (S.person !== "carlos") { $("v-train").innerHTML = noPlan(t.tabTrainLong); return; }
  const k = S.hDate, d = parseKey(k), wd = d.getDay(), six = sessOf(k), day = TRAIN[six], h = hOf(k), done = h.done || {};
  const sc0 = daySched(k), ag = blocksOf({ kind: "plan", date: k }).find((b) => b.id === "pl_gym"), sc = Object.assign({}, sc0, { gym: ag ? { s: ag.s, e: ag.e } : sc0.gym }), wi = weekInfo(k), deload = wi.cyc === 4 && daysBetween(PLAN_START, k) >= 0;
  const items = [];
  if (day.kind !== "rest") items.push(MOB);
  (day.ex || []).forEach(([n, r], i) => items.push({ id: "ex" + i, t: n, r }));
  (day.items || []).forEach((x) => items.push(x));
  (day.close || []).forEach((x) => items.push(x));
  const nDone = items.filter((x) => done["t_" + x.id]).length;
  const list = items.map((x) => `<li class="hl${done["t_" + x.id] ? " ok" : ""}"><div class="htx"><b class="ht">${esc(x.t)}</b>${x.r ? `<span class="hr">${esc(x.r)}</span>` : ""}${x.n ? `<span class="hn">${esc(x.n)}</span>` : ""}</div>${tick(!!done["t_" + x.id], "h-tick", `data-key="t_${x.id}"`, x.t)}</li>`).join("");

  const checks = checksFor(k).map((c) => {
    const ok = checkDone(k, c);
    if (c.kind === "num") {
      const prev = lastVal(c.id, keyOf(addDays(d, -1)));
      return `<li class="hl${ok ? " ok" : ""}"><div class="htx"><b class="ht">${esc(c.t)}</b><span class="hn">${esc(c.n)}${prev ? ` Último: ${esc(fmtNum(prev.v))} ${c.unit} (${esc(shortDate(prev.date))}).` : ""}</span></div>
        <label class="numin"><input type="number" inputmode="decimal" step="0.1" min="0" class="fi" data-hnum="${c.id}" value="${h[c.id] != null ? esc(h[c.id]) : ""}" aria-label="${esc(c.t)}"><span>${c.unit}</span></label></li>`;
    }
    return `<li class="hl${ok ? " ok" : ""}"><div class="htx"><b class="ht">${esc(c.t)}</b><span class="hn">${esc(c.n)}</span></div>${tick(ok, "h-tick", `data-key="${c.id}"`, c.t)}</li>`;
  }).join("");

  // upcoming (next 14 days, from tomorrow), non-daily checks + deload start
  const up = [];
  for (let i = 1; i <= 14 && up.length < 6; i++) {
    const kk = keyOf(addDays(d, i)), cs = checksFor(kk).filter((c) => c.id !== "whoop");
    const w = weekInfo(kk);
    if (parseKey(kk).getDay() === 1 && w.cyc === 4) cs.unshift({ t: "Empieza la semana suave" });
    if (cs.length) up.push(`<li><span class="ud">${esc(niceDate(kk).charAt(0).toUpperCase() + niceDate(kk).slice(1))}</span><span>${esc(cs.map((c) => c.t).join(" · "))}</span></li>`);
  }

  // weight summary
  const mon = keyOf(mondayOf(d)), avg = weekAvg(mon), prevAvg = weekAvg(keyOf(addDays(parseKey(mon), -7)));
  const waist = lastVal("waist", k);
  const diff = avg != null && prevAvg != null ? avg - prevAvg : null;

  const week = [1, 2, 3, 4, 5, 6, 0].map((i) => {
    const kk = keyOf(addDays(mondayOf(d), (i + 6) % 7));
    const sx = sessOf(kk), moved = sx !== i;
    return `<button class="wtr${kk === k ? " cur" : ""}" data-act="h-day" data-k="${kk}"><b>${esc(t.wd[i])}</b><span>${esc(TRAIN[sx].t)}${moved ? ` <em class="mv">cambiado</em>` : ""}${didTrain(kk) ? " ✓" : ""}</span></button>`;
  }).join("");

  $("v-train").innerHTML = `
    <h1>${esc(t.tabTrainLong)}</h1>
    <p class="sub">Semana ${wi.n} · bloque ${wi.cyc} de 4${sc.gym ? " · gym de " + esc(fmtTime(sc.gym.s)) + " a " + esc(fmtTime(sc.gym.e)) : ""}</p>
    ${dayPicker(k, "h-day")}
    ${advOnly(k)}
    ${pendBanner(k)}
    ${pendingSess(k).length && k === todayKey() ? "" : weekCard(k)}
    ${deload ? `<div class="base-banner" style="margin-top:14px"><p><b>Semana suave.</b> Quite 1 serie por ejercicio y baje el peso un 10 %. Es parte del plan: así se recupera y sigue subiendo.</p></div>` : ""}
    <div class="hhero">
      <div class="fastbox ${day.kind === "rest" ? "open" : "fast"}"><b>${esc(dayLabel(k))}: ${esc(day.t)}</b><span>${day.kind === "rest" ? "Día de descanso activo" : (sc.gym ? esc(fmtTime(sc.gym.s)) + (sc.slot === "am" ? " en ayunas" : " ya comido") + " · " : "") + nDone + " de " + items.length + " hechos"}</span></div>
      ${sessLine(k)}
      ${slotSeg(k)}
      <div class="pbar"><i style="width:${items.length ? Math.round(nDone / items.length * 100) : 0}%"></i></div>
      ${day.note ? `<p class="hnote">${esc(day.note)}</p>` : ""}
      ${coachTip(k)}
    </div>
    <h2>Sesión <span class="cnt">${nDone}/${items.length}</span></h2>
    <ul class="hlist2">${list}</ul>
    <h2>Chequeos de ${esc(dayLabel(k).toLowerCase())}</h2>
    <ul class="hlist2">${checks}</ul>
    <div class="tgt out" style="margin-top:12px"><div><small>Promedio de peso, esta semana</small><b>${avg != null ? esc(fmtNum(avg)) + " kg" : "—"}</b></div><div><small>Contra la semana pasada</small><b class="${diff == null ? "" : diff <= 0 ? "pos" : "neg"}">${diff != null ? (diff > 0 ? "+" : "") + esc(fmtNum(diff, 2)) + " kg" : "—"}</b></div><div><small>Cintura</small><b>${waist ? esc(fmtNum(waist.v)) + " cm" : "—"}</b></div><div><small>Meta</small><b>−0.25 a −0.5 kg/sem</b></div></div>
    <h2>Próximos chequeos</h2>
    <ul class="up">${up.join("")}</ul>
    <h2>La semana</h2>
    <div class="wtrs">${week}</div>
    <h2>Guía</h2>
    <details class="hdet"><summary>Core (cierre de lunes, jueves y sábado)</summary><table class="htbl"><tbody>${CORE.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join("")}</tbody></table></details>
    <details class="hdet"><summary>Cómo progresar</summary><ul class="hol">
      <li>Deje 1 o 2 repeticiones en reserva en cada serie. No entrene al fallo, salvo en la última serie de los ejercicios de aislamiento.</li>
      <li>Cuando complete el tope de repeticiones en todas las series, suba el peso entre 2.5 y 5 %.</li>
      <li>La zona 2 sube 5 minutos por semana. Cada 4ª semana es más suave.</li>
      <li>Zona 2: tope de 140 lpm, a un ritmo en el que puede hablar en frases completas. Sus carreras van a 150–163 lpm, que es zona 3–4: para la zona 2 use bici, elíptica o caminata en inclinación.</li><li>El único cardio fuerte de la semana son los intervalos del martes.</li>
      <li>Segunda sesión: solo si durmió 7.5 h o más y WHOOP está en verde, máximo 3 veces por semana y siempre suave.</li></ul></details>
    <details class="hdet"><summary>Reglas de ajuste (si pasa 2 semanas seguidas)</summary><table class="htbl"><thead><tr><th>Si pasa esto</th><th>Qué se cambia</th></tr></thead><tbody>${RULES.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join("")}</tbody></table></details>
    <p class="hfoot muted">Si siente dolor que no se quita, mareos o palpitaciones, vaya al médico.</p>`;
}

/* ================================================================
   GOOGLE CALENDAR + JARVIS (acomodar el día solo)
   - Trae los eventos de Google Calendar (solo lectura) y los mete en Mi día.
   - Si un evento choca con un bloque movible (gym, estudio, inside506…),
     mueve ese bloque al hueco libre más cercano y deja una nota.
   - Clases de inglés / SalesX / roleplays cuentan como esos bloques.
   - Chequeo de la mañana (WHOOP, sueño, ánimo) → consejos con
     "Hacerle caso" o "Lo voy a hacer igual".
================================================================= */
const FIXED_IDS = ["cb_grat", "pl_mag", "pl_sleep"];
const SOFT_RE = /^cb_(libre|fam|p\d|bano|prep)/;
const PRIO = ["pl_gym", "pl_walk", "pl_m1", "pl_m3", "pl_m2", "cb_closer", "cb_ia", "cb_506a", "cb_ing", "cb_rev", "cb_506b", "pl_s2"];
const KIND_INFO = {
  class: { c: "study", n: "Clase en vivo" },
  english: { c: "study", n: "Clase de inglés: cuenta como su inglés del día" },
  closer: { c: "work", n: "Sesión de closer: cuenta como su bloque de closer" },
  roleplay: { c: "work", n: "Roleplay agendado: este no se mueve" },
  event: { c: "work", n: "Compromiso de Google Calendar" }
};
let calMsg = { kind: "", text: "" };

const isGc = (b) => String(b.id).startsWith("gc_");
const isMovable = (b) => /^(pl_|cb_)/.test(String(b.id)) && !FIXED_IDS.includes(b.id) && !isGc(b) && !b.fx;
const isMeal = (b) => /^pl_m[123]$/.test(b.id);

function calKind(ev) {
  const sum = String(ev.summary || ""), all = sum + " " + String(ev.description || "");
  if (/role\s?play/i.test(all)) return "roleplay";
  if (/salesx|closer/i.test(sum)) return "closer";
  if (/english|ingl[eé]s/i.test(sum)) return "english";
  if (/la tribu|skool|clase/i.test(all)) return "class";
  return "event";
}
/* ---------- reconcile: fixed events win, movable blocks find the nearest free slot ---------- */
function winFor(b, pref, k) {
  const sc = daySched(k);
  switch (b.id) {
    case "pl_m1": return [pref[0] - 30, pref[0] + 120];
    case "pl_m2": return [pref[0] - 120, pref[0] + 120];
    case "pl_m3": return [pref[0] - 150, Math.max(pref[1], sc.closeT)];
    case "pl_gym": return [330, 1170];
    case "pl_walk": return [360, 1170];
    default: return String(b.id).startsWith("cb_rp_") ? [pref[0] - 180, pref[1]] : [330, Math.max(pref[1], 1170)];
  }
}
function reconcile(k, input) {
  let bl = input.map(clone);
  const notes = [];
  const gc = bl.filter(isGc);
  const classMin = gc.filter((b) => b.k === "class").reduce((a, b) => a + b.e - b.s, 0);
  const eng = gc.find((b) => b.k === "english"), clo = gc.find((b) => b.k === "closer"), rps = gc.filter((b) => b.k === "roleplay");

  // 1) credits: classes count as the blocks they replace
  bl = bl.filter((b) => {
    if (b.id === "cb_ing" && eng) { notes.push(`"${eng.t}" cuenta como su inglés de hoy: quité el bloque de inglés.`); return false; }
    if (b.id === "cb_closer" && (rps.length || clo)) {
      notes.push(rps.length ? `Tiene roleplay a las ${fmtTime(rps[0].s)}: el bloque de closer se cambió por prepararlo.` : `"${clo.t}" cuenta como su bloque de closer.`);
      return false;
    }
    if (String(b.id).startsWith("cb_rp_") && !rps.some((r) => "cb_rp_" + r.id === b.id)) return false;
    return true;
  });
  rps.forEach((r) => {
    const id = "cb_rp_" + r.id;
    if (!bl.some((b) => b.id === id)) bl.push({ id, t: "Preparar el roleplay", s: Math.max(0, r.s - 30), e: r.s, c: "work", n: "Pídale a Jarvis: prepárame para el roleplay", done: false });
  });
  const ia = bl.find((b) => b.id === "cb_ia");
  let iaDur = null;
  if (ia) {
    const pref = ia.o || [ia.s, ia.e], full = pref[1] - pref[0];
    if (classMin >= 60 && full > 60) { iaDur = 60; notes.push(`Hoy tiene ${fmtDur(classMin)} de clases en vivo: el estudio de IA por su cuenta baja a 1 h.`); }
  }

  // 2) place fixed things first
  const occ = []; // [s, e, isClass, name]
  const overlaps = (s, e, ignoreClass) => occ.find(([a, b2, cls]) => !(ignoreClass && cls) && s < b2 && a < e);
  const fixed = bl.filter((b) => !isMovable(b));
  fixed.sort((a, b) => a.s - b.s);
  fixed.forEach((b) => {
    const hit = overlaps(b.s, b.e, false);
    if (hit && (isGc(b) || b.fx) && (hit[4] || hit[5])) notes.push(`Choque: "${b.t}" y "${hit[3]}" son a la misma hora. Escoja uno.`);
    occ.push([b.s, b.e, isGc(b) && (b.k === "class" || b.k === "english"), b.t, isGc(b), !!b.fx]);
  });
  fixed.filter((b) => isGc(b) && b.e > 1290).forEach((b) => notes.push(`"${b.t}" termina a las ${fmtTime(b.e)}: acuéstese apenas termine.`));

  // 3) movable blocks, by priority
  const rank = (b) => { const i = PRIO.indexOf(b.id); return i < 0 ? (String(b.id).startsWith("cb_rp_") ? 4.5 : PRIO.length - 1.5) : i; };
  const mov = bl.filter(isMovable).sort((a, b) => rank(a) - rank(b));
  const placed = [];
  mov.forEach((b) => {
    const pref = b.o || [b.s, b.e];
    let dur = pref[1] - pref[0];
    if (b.id === "cb_ia" && iaDur) dur = iaDur;
    const ign = isMeal(b);
    const soft = SOFT_RE.test(b.id);
    const tryAt = (s, d) => !overlaps(s, s + d, ign);
    let s0 = null, d0 = dur;
    if (tryAt(pref[0], dur)) s0 = pref[0];
    else if (soft) return; // bloques libres o de transición: si chocan, se quitan sin aviso
    else {
      const [w0, w1] = winFor(b, pref, k);
      const durs = isMeal(b) ? [dur, Math.min(dur, 45), 30] : /^cb_(ia|506a|506b)$/.test(b.id) ? [dur, Math.max(30, Math.round(dur / 2 / 15) * 15)] : [dur];
      for (const d of durs) {
        const cands = [];
        for (let c = Math.max(0, w0); c + d <= Math.min(1440, w1); c += 15) cands.push(c);
        cands.sort((x, y) => Math.abs(x - pref[0]) - Math.abs(y - pref[0]) || y - x);
        const hit = cands.find((c) => tryAt(c, d));
        if (hit != null) { s0 = hit; d0 = d; break; }
      }
    }
    if (s0 == null) {
      if (!soft) notes.push(`No cupo hoy: "${b.t}". Si lo quiere hacer, búsquele espacio a mano.`);
      return;
    }
    const why = overlaps(pref[0], pref[0] + dur, ign);
    if (!soft && (s0 !== pref[0] || d0 !== pref[1] - pref[0]) && !(b.id === "cb_ia" && iaDur && s0 === pref[0] && d0 === iaDur)) {
      const moved = s0 !== pref[0];
      notes.push(moved
        ? `Moví "${b.t}" de ${fmtTime(pref[0])} a ${fmtTime(s0)}${why ? ` porque se cruza con "${why[3]}"` : ""}.`
        : `Acorté "${b.t}" a ${fmtDur(d0)} para que quepa.`);
    }
    const nb = Object.assign(b, { s: s0, e: s0 + d0 });
    if (s0 === pref[0] && d0 === pref[1] - pref[0]) delete nb.o; else nb.o = pref;
    occ.push([nb.s, nb.e, false, nb.t]);
    placed.push(nb);
  });
  return { blocks: sortB(fixed.concat(placed)), notes };
}
function reconcileSave(k) {
  const tg = { kind: "plan", date: k }, cur = blocksOf(tg);
  if (!cur.length) return;
  const r = reconcile(k, cur);
  if (JSON.stringify(sortB(cur)) !== JSON.stringify(r.blocks)) setBlocks(tg, r.blocks);
  const old = JSON.stringify(hOf(k).notes || []);
  if (old !== JSON.stringify(r.notes)) hSet(k, { notes: r.notes });
}

/* ---------- calendario: lo trae Jarvis al buzón (inbox) cada mañana y cuando Carlos le pide un cambio ---------- */
// Cada item del buzón "cal_AAAA-MM-DD_<n>" trae { json: '[{"id","t","s","e","k"}…]' } con los eventos de ese día.
function applyCalDay(k, list) {
  const sp = S.person; S.person = "carlos";
  try { return applyCalDay_(k, list); } finally { S.person = sp; }
}
function applyCalDay_(k, list) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(k) || !Array.isArray(list)) return false;
  const tg = { kind: "plan", date: k };
  const seenEv = {};
  const fresh = list.filter((x) => { if (!x || !isFinite(+x.s) || !isFinite(+x.e) || +x.e <= +x.s) return false; const key = String(x.t || "").trim().toLowerCase() + "|" + Math.round(+x.s) + "|" + Math.round(+x.e); if (seenEv[key]) return false; return (seenEv[key] = true); }).slice(0, 40).map((x) => {
    const kind = KIND_INFO[x.k] ? x.k : "event", info = KIND_INFO[kind];
    const id = "gc_" + String(x.id || uid()).replace(/[^a-zA-Z0-9]/g, "").slice(0, 40);
    return { id, t: String(x.t || "Evento").slice(0, 80), s: Math.max(0, Math.min(1440, Math.round(+x.s))), e: Math.max(0, Math.min(1440, Math.round(+x.e))), c: info.c, k: kind, n: info.n + (x.pend ? " · sin confirmar" : "") };
  });
  const prev = blocksOf(tg);
  let bl = prev;
  if (!bl.length) {
    const tpl = blocksOf({ kind: "tpl", wd: parseKey(k).getDay() });
    if (!tpl.length && !fresh.length) return false;
    bl = tpl.map((b) => Object.assign(clone(b), { id: /^(pl_|cb_)/.test(String(b.id)) ? b.id : uid(), done: false }));
  }
  const doneOf = {}; bl.forEach((b) => { if (isGc(b) && b.done) doneOf[b.id] = true; });
  const next = bl.filter((b) => !isGc(b)).concat(fresh.map((b) => Object.assign(b, { done: !!doneOf[b.id] })));
  const r = reconcile(k, next);
  if (JSON.stringify(prev) !== JSON.stringify(r.blocks)) setBlocks(tg, r.blocks);
  if (JSON.stringify(hOf(k).notes || []) !== JSON.stringify(r.notes)) hSet(k, { notes: r.notes });
  return true;
}
/* Cambios que Carlos le pide a Jarvis en el chat: item "op_<n>" con { date, add:[{t,s,e,c,n}], remove:["título o id"], slot:"am"|"pm", gym:<minutos>|-1, eat:[{m:"m1|m2|m3|x",txt,at,p,c,f,kcal}], eatReplace:["m1"] } */
function applyOp(o) {
  // Semana base nueva: { tpl: { "0": [bloques], … "6": [bloques] } }
  if (o && o.tpl && typeof o.tpl === "object") {
    let n = 0;
    Object.keys(o.tpl).forEach((wd) => {
      const w = +wd, list = o.tpl[wd];
      if (!(w >= 0 && w <= 6) || !Array.isArray(list)) return;
      const blocks = list.filter((x) => x && isFinite(+x.s) && isFinite(+x.e) && +x.e > +x.s && +x.s >= 0 && +x.e <= 1440).slice(0, 40)
        .map((x) => { const b = { id: /^(pl_|cb_)[a-z0-9_]{1,20}$/.test(String(x.id)) ? x.id : uid(), t: String(x.t || "Bloque").slice(0, 80), s: Math.round(+x.s), e: Math.round(+x.e), c: CATS.includes(x.c) ? x.c : "personal" }; if (x.n) b.n = String(x.n).slice(0, 120); return b; });
      if (blocks.length) { put("tpl", tplId("carlos", w), { person: "carlos", wd: w, blocks: sortB(blocks), updated: Date.now(), src: "Jarvis" }); n++; }
    });
    return n > 0;
  }
  const k = o && o.date;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(k || ""))) return false;
  const sp = S.person; S.person = "carlos";
  try {
    const tg = { kind: "plan", date: k };
    if (o.slot === "am" || o.slot === "pm") { hSet(k, { slot: o.slot }); applyToDay(k); }
    if (o.gym === -1 || (isFinite(+o.gym) && o.gym !== null && o.gym !== "" && +o.gym >= 0 && +o.gym < 1440)) { hSet(k, { gymAt: Math.round(+o.gym) }); applyToDay(k); }
    if (Number.isInteger(o.sess) && o.sess >= 0 && o.sess <= 6) { hSet(k, { sess: o.sess === planIx(k) ? null : o.sess }); applyToDay(k); }
    if (Array.isArray(o.eat)) {
      if (Array.isArray(o.eatReplace)) hSet(k, { eat: eatOf(k).filter((e) => !(e.src === "jarvis" && o.eatReplace.includes(e.m))) });
      o.eat.slice(0, 20).forEach((e) => eatAdd(k, Object.assign({}, e, { src: "jarvis" })));
      if (!o.add && !o.remove && !o.slot && o.gym == null && o.sess == null) return true;
    }
    let bl = blocksOf(tg);
    if (!bl.length) bl = blocksOf({ kind: "tpl", wd: parseKey(k).getDay() }).map((b) => Object.assign(clone(b), { id: /^(pl_|cb_)/.test(String(b.id)) ? b.id : uid(), done: false }));
    const rm = (Array.isArray(o.remove) ? o.remove : []).map((x) => String(x).toLowerCase());
    bl = bl.filter((b) => !rm.some((x) => x === String(b.id).toLowerCase() || String(b.t).toLowerCase().includes(x)));
    (Array.isArray(o.add) ? o.add : []).slice(0, 20).forEach((x) => {
      const s = Math.round(+x.s), e = Math.round(+x.e);
      if (!(isFinite(s) && isFinite(e) && e > s && s >= 0 && e <= 1440)) return;
      const b = { id: "jv_" + uid(), t: String(x.t || "Bloque").slice(0, 80), s, e, c: CATS.includes(x.c) ? x.c : "personal", done: false };
      if (x.n) b.n = String(x.n).slice(0, 120);
      bl.push(b);
    });
    const r = reconcile(k, bl);
    setBlocks(tg, r.blocks);
    hSet(k, { notes: r.notes });
    return true;
  } finally { S.person = sp; }
}
function syncCal() { calMsg = { kind: "", text: "Buscando lo nuevo que dejó Jarvis…" }; render(); importInbox(true); }
function maybeAutoSync() { if (typeof importInbox === "function") importInbox(); }

/* ---------- Jarvis: morning check-in and advice ---------- */
const MOODS = [["good", "Con energía"], ["ok", "Normal"], ["tired", "Cansado"], ["stress", "Muy estresado"]];
function advice(k) {
  const h = hOf(k), bl = blocksOf({ kind: "plan", date: k }), adv = h.adv || {}, out = [];
  const rec = has(h.rec) ? +h.rec : null, sl = has(h.sleepH) ? +h.sleepH : null, mood = h.mood;
  const why = [];
  if (rec != null && rec < 34) why.push(`recuperación en rojo (${rec} %)`);
  if (sl != null && sl < 6) why.push(`solo ${fmtNum(sl)} h de sueño`);
  if (mood === "stress") why.push("mucho estrés");
  const red = why.length > 0;
  const whyY = [];
  if (!red) {
    if (rec != null && rec < 67) whyY.push(`recuperación en amarillo (${rec} %)`);
    if (sl != null && sl < 7) whyY.push(`${fmtNum(sl)} h de sueño`);
    if (mood === "tired") whyY.push("se siente cansado");
  }
  const gym = bl.find((b) => b.id === "pl_gym");
  if (red && gym && !/recuper/i.test(gym.t)) out.push({ id: "rest", t: "Hoy no entrene fuerte", d: `Tiene ${why.join(", ")}. Entrenar pesado hoy le quita más de lo que le da: cambie el gym por 30 min de caminata suave y movilidad.`, act: "Cambiar el gym por caminata y movilidad" });
  if ((red || whyY.length) && bl.some((b) => b.id === "pl_s2")) out.push({ id: "nos2", t: "Hoy sin sesión 2", d: `Con ${(red ? why : whyY).join(", ")}, la segunda sesión suma cansancio y no músculo.`, act: "Quitar la sesión 2" });
  const work = bl.filter((b) => b.c === "work" || b.c === "study").reduce((a, b) => a + b.e - b.s, 0);
  const fixedMin = bl.filter(isGc).reduce((a, b) => a + b.e - b.s, 0);
  const drop = bl.find((b) => b.id === "cb_506b") || bl.find((b) => b.id === "cb_506a");
  if (drop && (work >= 480 || (red && work >= 360))) out.push({ id: "load", t: "Día muy cargado", d: `Tiene ${fmtDur(work)} de trabajo y estudio${fixedMin ? `, ${fmtDur(fixedMin)} de compromisos fijos` : ""}. Mejor quite un bloque y haga bien lo demás.`, act: `Quitar "${drop.t}"`, drop: drop.id });
  return out.filter((a) => !adv[a.id]);
}
function applyAdvice(k, id) {
  const tg = { kind: "plan", date: k }, a = advice(k).find((x) => x.id === id);
  let bl = blocksOf(tg).map(clone);
  if (id === "rest") bl = bl.filter((b) => b.id !== "pl_s2").map((b) => b.id === "pl_gym" ? Object.assign(b, { t: "Caminar suave + movilidad (recuperación)", e: b.s + 40, n: "Jarvis: hoy toca recuperar" }) : b);
  if (id === "nos2") bl = bl.filter((b) => b.id !== "pl_s2");
  if (id === "load" && a && a.drop) bl = bl.filter((b) => b.id !== a.drop);
  setBlocks(tg, bl);
  const adv = Object.assign({}, hOf(k).adv || {}, { [id]: "ok" });
  hSet(k, { adv });
}
function jarvisCard(k) {
  if (S.person !== "carlos" || S.base !== null) return "";
  const h = hOf(k), isToday = k === todayKey(), notes = h.notes || [], adv = advice(k);
  const last = +((D.cfg.carlos || {}).lastCal || 0);
  const filled = !!(h.mood || has(h.rec) || has(h.sleepH));
  const moodTxt = (MOODS.find(([v]) => v === h.mood) || [, ""])[1];
  let ci = "";
  if (isToday && filled && !S.ciEdit) {
    ci = `<div class="cisum"><span>Amaneció: ${esc([moodTxt.toLowerCase(), has(h.rec) ? h.rec + " % de recuperación" : "", has(h.sleepH) ? fmtNum(+h.sleepH) + " h de sueño" : ""].filter(Boolean).join(" · "))}</span><button type="button" class="btn" data-act="ci-edit">Cambiar</button></div>`;
  } else if (isToday) {
    ci = `<div class="ci"><b class="ciq">¿Cómo amaneció? Jarvis ajusta el día con esto.</b>
      <div class="chips">${MOODS.map(([v, l]) => `<button type="button" class="chip" data-act="ci-mood" data-k="${k}" data-v="${v}" aria-pressed="${h.mood === v}">${esc(l)}</button>`).join("")}</div>
      <div class="two"><label class="cin"><span>Recuperación WHOOP</span><span class="numin"><input type="number" inputmode="numeric" min="0" max="100" class="fi" data-cnum="rec" data-k="${k}" value="${has(h.rec) ? esc(h.rec) : ""}" aria-label="Recuperación WHOOP en %"><span>%</span></span></label>
      <label class="cin"><span>Horas de sueño</span><span class="numin"><input type="number" inputmode="decimal" step="0.1" min="0" max="14" class="fi" data-cnum="sleepH" data-k="${k}" value="${has(h.sleepH) ? esc(h.sleepH) : ""}" aria-label="Horas de sueño"><span>h</span></span></label></div>
      ${filled ? `<div><button type="button" class="btn" data-act="ci-edit">Listo</button></div>` : ""}</div>`;
  }
  const advH = adv.map((a) => `<div class="adv"><b>${esc(a.t)}</b><p>${esc(a.d)}</p><div class="advb"><button type="button" class="btn pri" data-act="adv-ok" data-k="${k}" data-id="${a.id}">${esc(a.act)}</button><button type="button" class="btn" data-act="adv-no" data-k="${k}" data-id="${a.id}">Lo voy a hacer igual</button></div></div>`).join("");
  const urgent = notes.some((n) => /^(Choque|No cupo)/.test(n));
  const notesH = notes.length ? `<details class="jdet"${urgent ? " open" : ""}><summary>${urgent ? "Revise: " : ""}Jarvis acomodó ${notes.length === 1 ? "1 cosa" : notes.length + " cosas"} este día</summary><ul class="jnotes">${notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></details>` : "";
  const lt = new Date(last), lastTxt = last ? `Google Calendar: Jarvis lo pasó ${keyOf(lt) === todayKey() ? "hoy" : "el " + shortDate(keyOf(lt))} a las ${fmtTime(lt.getHours() * 60 + lt.getMinutes())}` : "Google Calendar: Jarvis lo pasa cada mañana a las 5:27 am";
  const sync = `<div class="jsync"><span class="${esc(calMsg.kind)}">${esc(calMsg.text || lastTxt)}</span><button type="button" class="btn" data-act="cal-sync">${IC.sync}Actualizar</button></div>`;
  return `<section class="jcard" aria-label="Jarvis"><div class="jh"><span class="jdot" aria-hidden="true">J</span><b>Jarvis</b></div>${advH}${ci}${notesH}${sync}</section>`;
}
function advOnly(k) {
  if (S.person !== "carlos") return "";
  const adv = advice(k);
  return adv.length ? `<section class="jcard" aria-label="Jarvis"><div class="jh"><span class="jdot" aria-hidden="true">J</span><b>Jarvis</b></div>${adv.map((a) => `<div class="adv"><b>${esc(a.t)}</b><p>${esc(a.d)}</p><div class="advb"><button type="button" class="btn pri" data-act="adv-ok" data-k="${k}" data-id="${a.id}">${esc(a.act)}</button><button type="button" class="btn" data-act="adv-no" data-k="${k}" data-id="${a.id}">Lo voy a hacer igual</button></div></div>`).join("")}</section>` : "";
}
if (/[?&]jvtest=1/.test(location.search)) window.__jv = { applyCalDay, applyOp };
