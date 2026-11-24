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
    { id: "m3", t: "Cena", at: 1080, p: "200 g de pollo, res magra o pescado", pE: "2 palmas de su mano", c: "300 g de camote o papa, o 5 tortillas de maíz", cE: "2 puños, o 5 tortillas", cRest: "300 g de camote o papa, o 5 tortillas de maíz", cRestE: "2 puños, o 5 tortillas", v: "1–2 tazas de verdura", vE: "2 puños o medio plato", f: "1 cucharada de aceite de oliva", fE: "1 cucharada sopera", end: 1170 }
  ],
  // 0 = domingo … 6 = sábado
  menu: [
    ["Huevos con pollo, papa pequeña y espinaca (sin fruta)", "Pescado, ensalada grande y ½ camote"],
    ["Pollo, papa, brócoli y aguacate. Fruta: papaya", "Pargo, camote, ensalada verde y aceite de oliva"],
    ["Res, papa, frijoles y vainica", "Pollo, papa al horno, zanahoria y ayote"],
    ["Pollo, camote, espinaca y aguacate. Fruta: banano", "Res molida, yuca, chayote y pico de gallo"],
    ["Salmón, papa y brócoli", "Pollo, camote, ensalada y aceite de oliva"],
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
  carbs: [["Papa", "175 g", "1 puño grande"], ["Camote", "150 g", "1 puño"], ["Yuca, ñampí o tiquisque", "80 g", "½ puño"], ["Tortillas de maíz", "2½ tortillas", "2½ tortillas medianas"], ["Galletas de arroz (inflado)", "4 galletas", "4 galletas"], ["Plátano maduro, al horno o cocido", "100 g", "½ plátano mediano"], ["Avena (en crudo)", "45 g", "½ taza"], ["Banano", "1 mediano", "1 mediano"], ["Papaya o piña", "2 tazas", "2 puños"], ["Frijoles", "¾ de taza (+11 g de proteína)", "¾ de taza"]],
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

/* ---------- ideas de comida (Costa Rica): en la calle o en la casa ----------
   Números aproximados con valores estándar de los alimentos (cocidos). Meta por comida: 40–70 g de proteína. */
const I = (t, where, w, what, p, c, f, kcal, tip) => ({ t, where, w, what, p, c, f, kcal, tip });
const IDEAS = {
  m2: [
    I("Yogur griego, banano y maní", "calle", "Sin pesar", "2 vasos de yogur griego natural (≈300 g) + 1 banano + 1 bolsita de maní sin sal (≈30 g)", 39, 44, 14, 460, "Busque el yogur que diga 9 g o más de proteína por cada 100 g y sin azúcar añadida."),
    I("Pollo rostizado y fruta", "calle", "Sin pesar", "½ pechuga de pollo rostizado sin piel (≈150 g) + 1 banano + 1 manzana", 46, 52, 6, 440, "El pollo rostizado del súper (Maxi Palí, Más x Menos, Walmart) es de lo más fácil en la calle. Quítele la piel."),
    I("Atún, huevos duros y tortillas", "calle", "Sin pesar", "1 lata de atún en agua + 2 huevos duros + 4 tortillas de maíz", 43, 49, 14, 500, "Lleve los huevos ya hervidos de la casa. Busque latas de atún que abren sin abrelatas."),
    I("Batido de proteína y banano", "calle", "Sin pesar", "1 medida de proteína en polvo (≈30 g) en 300 ml de leche descremada + 1 banano + 1 cucharada de maní", 39, 47, 9, 410, "Opcional. La proteína en polvo es práctica cuando no llega con comida (ISSN). Revise la etiqueta: 20–25 g de proteína por medida y poca azúcar."),
    I("Pavo, queso y tortillas", "calle", "Sin pesar", "100 g de jamón de pavo + 60 g de queso tierno o Turrialba + 3 tortillas + 1 fruta", 34, 59, 16, 520, "Escoja el jamón que diga pechuga de pavo y no tenga mucho sodio."),
    I("Huevos duros, leche y banano", "calle", "Sin pesar", "4 huevos duros + 1 cajita de leche descremada (250 ml) + 1 banano", 34, 41, 20, 480, ""),
    I("Huevos, yogur, banano y avena", "casa", "Con balanza", "3 huevos duros + 170 g de yogur griego + 1 banano + 40 g de avena", 41, 62, 18, 570, "La del plan. Ideal 1 a 2 horas antes del gym."),
    I("Pollo desmechado con plátano maduro", "casa", "Con balanza", "130 g de pollo desmechado + 100 g de plátano maduro al horno", 41, 31, 5, 335, ""),
    I("Pechuga, frijoles y aguacate", "casa", "Con balanza", "100 g de pechuga a la plancha + ¾ de taza de frijoles + ¼ de aguacate", 41, 33, 9, 390, ""),
    I("Huevos con papa y tortilla", "casa", "A ojo", "3 huevos revueltos con poco aceite + 150 g de papa en cubos + 1 tortilla de maíz + 1 vaso de leche descremada", 31, 50, 17, 500, "Con la leche llega a la proteína."),
    I("Yogur griego con piña y maní", "casa", "Con balanza", "300 g de yogur griego + 1 taza de piña + 15 g de maní", 35, 36, 7, 350, ""),
    I("Omelette con queso y banano", "casa", "A ojo", "3 huevos + 2 claras + 40 g de queso tierno, espinaca y tomate + 1 banano", 33, 30, 20, 475, ""),
    I("Tostadas con atún y aguacate", "casa", "A ojo", "2 rebanadas de pan integral + 1 lata de atún + ¼ de aguacate + tomate y limón", 32, 29, 8, 320, "Si el gym es pesado, agregue 1 fruta."),
    I("Ceviche de pescado con galletas", "casa", "Con balanza", "Ceviche de 150 g de pescado (sin pepino) + 1 taza de papaya + 4 galletas de soda", 34, 39, 5, 330, ""),
    I("Carne molida con yuca", "casa", "Con balanza", "110 g de carne molida magra + 80 g de yuca + pico de gallo", 30, 34, 9, 345, "")
  ],
  m1: [
    I("Casado limpio en la soda (sin arroz)", "calle", "A ojo", "Pida pollo o pescado a la plancha (porción doble si se puede), frijoles, papas o picadillo en lugar del arroz y ensalada sin aderezo. Sin frito ni maduro frito.", 65, 75, 22, 800, "Números estimados: en la soda no se puede pesar. Pida la ensalada sin mayonesa."),
    I("Pollo rostizado con papas", "calle", "Sin pesar", "1 pechuga de pollo rostizado sin piel + papas asadas o en puré (sin mantequilla) + ensalada + 1 fruta", 66, 95, 10, 760, ""),
    I("Casado limpio en la casa (sin arroz)", "casa", "Con balanza", "200 g de pechuga a la plancha + 250 g de papa + 130 g de frijoles + 50 g de plátano maduro + ensalada con 1 cucharadita de aceite", 77, 100, 14, 860, ""),
    I("Bistec de res con yuca", "casa", "Con balanza", "200 g de bistec de res magro + 250 g de yuca + ensalada + 1 fruta", 60, 118, 15, 880, ""),
    I("Pescado con camote", "casa", "Con balanza", "220 g de pescado (tilapia o corvina) + 350 g de camote + verdura + ½ aguacate", 56, 82, 13, 680, "Agregue 1 fruta en días de gym fuerte.")
  ],
  m3: [
    I("Pollo rostizado con ensalada y papa", "calle", "Sin pesar", "1 pechuga de pollo rostizado sin piel + ensalada del súper (sin aderezo cremoso) + 1 papa asada", 60, 40, 10, 500, "Si entrenó fuerte hoy, agregue 1 tortilla o 1 fruta."),
    I("Pollo en salsa con camote", "casa", "Con balanza", "200 g de pollo desmechado en salsa de tomate con chile dulce, zanahoria y culantro + 300 g de camote + 1 cucharadita de aceite", 67, 68, 13, 685, ""),
    I("Tacos de carne molida", "casa", "Con balanza", "180 g de carne molida magra + 4 tortillas de maíz + pico de gallo + ¼ de aguacate", 53, 54, 23, 650, ""),
    I("Pescado al ajillo con papa", "casa", "Con balanza", "200 g de pescado + 300 g de papa + verdura + 1 cucharada de aceite de oliva con ajo", 50, 65, 17, 610, ""),
    I("Huevos rancheros con frijoles", "casa", "A ojo", "4 huevos + 3 claras + ¾ de taza de frijoles + 2 tortillas + pico de gallo", 48, 57, 22, 650, "")
  ]
};
IDEAS.x = IDEAS.m2;
const SHOP = [
  ["Proteína", "pechuga de pollo, huevos, atún en agua, yogur griego natural sin azúcar, carne molida magra, pescado (tilapia o corvina), queso tierno o Turrialba, jamón de pechuga de pavo, leche descremada, proteína en polvo (opcional)"],
  ["Carbohidrato", "papa, camote, yuca, plátano maduro, frijoles, tortillas de maíz, galletas de arroz inflado, avena, pan integral, banano, piña, papaya, manzana (nunca arroz)"],
  ["Grasa buena", "maní sin sal, aguacate, aceite de oliva"],
  ["Verdura", "espinaca, tomate, cebolla morada, chile dulce, brócoli, zanahoria, culantro y limón (sin pepino)"]
];
function ideasBtn(m) { return IDEAS[m] ? `<button type="button" class="btn sm idea" data-act="idea-open" data-m="${m}">💡 Ideas</button>` : ""; }
function openIdeas(m, flt) {
  const L = IDEAS[m] || [], f = flt || "all";
  const meta = { m1: "Comida 1: 60–75 g de proteína", m2: "Merienda: 35–45 g de proteína", m3: "Cena: 50–70 g de proteína", x: "Algo rápido: apunte a 30 g o más de proteína" }[m];
  const chips = [["all", "Todas"], ["calle", "En la calle"], ["casa", "En la casa"]].map(([v, l]) => `<button type="button" class="chip" data-act="idea-f" data-m="${m}" data-v="${v}" aria-pressed="${f === v}">${l}</button>`).join("");
  const cards = L.map((x, i) => ({ x, i })).filter(({ x }) => f === "all" || x.where === f).map(({ x, i }) => `<div class="icard">
      <div class="ih"><b>${esc(x.t)}</b><span class="tgs"><i class="tg">${x.where === "calle" ? "En la calle" : "En la casa"}</i><i class="tg">${esc(x.w)}</i></span></div>
      <p>${esc(x.what)}</p>
      <p class="imac">Proteína <b>${x.p} g</b> · Carbo ${x.c} g · Grasa ${x.f} g · ${x.kcal} kcal <small>(aprox.)</small></p>
      ${x.tip ? `<p class="itip">${esc(x.tip)}</p>` : ""}
      <button type="button" class="btn sm" data-act="idea-eat" data-m="${m}" data-i="${i}">Comí esto</button></div>`).join("");
  const shop = `<details class="hdet"><summary>Lista del súper para tener en la casa</summary><ul class="hol">${SHOP.map(([a, b]) => `<li><b>${esc(a)}:</b> ${esc(b)}</li>`).join("")}</ul><p class="hnote">Todo se consigue en Maxi Palí, Compre Bien, Más x Menos, Walmart o Pequeño Mundo.</p></details>`;
  openSheet(`<h3>Ideas: ${esc(MEAL_NAME[m] || "comida")}</h3><p class="hint">${esc(meta)}. Toque "Comí esto" y queda anotado con sus números.</p>
    <div class="chips" style="margin-bottom:12px">${chips}</div><div class="ilist">${cards}</div>${shop}
    <div class="acts"><button type="button" class="btn" data-act="close">Cerrar</button></div>`, { type: "ideas", m });
}
function eatIdea(m, i) {
  const x = (IDEAS[m] || [])[i]; if (!x) return;
  eatAdd(S.hDate, { m, txt: x.t + ": " + x.what, p: x.p, c: x.c, f: x.f, kcal: x.kcal, at: S.hDate === todayKey() ? nowMin() : null });
  closeSheet(); render(); toast("Anotado: " + x.t);
}

function eatDel(k, id) { hSet(k, { eat: eatOf(k).filter((e) => e.id !== id) }); }
function eatList(k, m) {
  const L = eatOf(k).filter((e) => e.m === m);
  const rows = L.map((e) => {
    const nums = ["p", "c", "f"].filter((x) => has(e[x])).map((x) => `${({ p: "P", c: "C", f: "G" })[x]} ${e[x]} g`).concat(has(e.kcal) ? [`${e.kcal} kcal`] : []);
    return `<li><div><span>${e.at != null ? `<b>${esc(fmtTime(e.at))}</b> · ` : ""}${esc(e.txt || "(sin descripción)")}</span><small>${nums.length ? esc(nums.join(" · ")) : "Sin números: dígale a Jarvis y él lo calcula"}${e.src === "jarvis" ? " · anotado por Jarvis" : ""}</small></div><button type="button" class="eatx" data-act="eat-del" data-id="${esc(e.id)}" aria-label="Borrar">×</button></li>`;
  }).join("");
  return `<div class="eat">${rows ? `<span class="eath">Lo que comió</span><ul>${rows}</ul>` : ""}<div class="eatb"><button type="button" class="btn sm" data-act="eat-open" data-m="${m}">+ Anotar lo que comí</button>${m !== "x" && !L.length ? `<button type="button" class="btn sm" data-act="eat-plan" data-m="${m}">Comí lo del plan</button>` : ""}${ideasBtn(m)}</div></div>`;
}
function openEatSheet(m) {
  const k = S.hDate, isToday = k === todayKey();
  openSheet(`<h3>${esc(MEAL_NAME[m] || "Anotar comida")}: ¿qué comió?</h3><p class="hint">Escríbalo como se lo diría a alguien, por ejemplo: "2 empanadas de pollo y un café negro". Los números son opcionales: si no los sabe, déjelos vacíos y dígale a Jarvis, él lo calcula y lo anota aquí.</p>
    <div class="f"><label for="eTxt">Qué comió</label><textarea id="eTxt" class="fi" rows="3" maxlength="300" placeholder="Ej.: pollo a la plancha con papa, frijoles y ensalada"></textarea></div>
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
  { t: "Hombros y abdomen", kind: "gym", ex: [["Press militar", "4 × 6–8"], ["Elevaciones laterales", "4 × 12–15"], ["Face pull", "3 × 15"], ["Pájaros (deltoide posterior)", "3 × 12–15"], ["Curl-up de McGill", "3 × 6 (10 s cada una)"], ["Elevación de piernas colgado", "3 × 10–12"]], close: [{ id: "z2", t: "Zona 2 · 20 min", n: "Tope 140 lpm: bici o caminata en inclinación" }] },
  { t: "Circuito híbrido tipo Hyrox", kind: "gym", ex: [["Remo 500 m o bici 1 km", "4–5 rondas"], ["Zancadas con peso", "20"], ["Wall balls", "15"], ["Burpees", "10"], ["Cargadas con kettlebell", "10"]], note: "Descanse 2 min entre rondas.", close: [{ id: "core", t: "Core · 10 min" }] }
];
const CORE = [["Plancha lateral", "3 × 20–30 s por lado"], ["Bird dog", "6 por lado, 10 s cada una"], ["Dead bug", "3 × 10 por lado"], ["Pallof press", "3 × 10 por lado"]];  // Core que protege la columna (McGill, U. de Waterloo): sin flexión repetida
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
const sessDay = (k) => verOf(k).T[sessOf(k)];
const sessIn = (kk, k) => (verOf(kk) === verOf(k) ? sessOf(kk) : V1TO2[sessOf(kk)]);   // sesión de kk contada en la versión del plan de k
const isRestDay = (k) => sessDay(k).kind === "rest";
const didTrain = (k) => { const h = hOf(k); return Object.keys(h.done || {}).some((x) => x.startsWith("t_")) || Object.values(h.sets || {}).some((L) => (L || []).some((y) => y && y.ok)); };
function weekSess(k) {        // { índice de TRAIN: fecha en que se hizo } en la semana (lun–dom) de k
  const mon = mondayOf(parseKey(k)), out = {};
  for (let i = 0; i < 7; i++) { const kk = keyOf(addDays(mon, i)); if (kk !== k && didTrain(kk)) out[sessIn(kk, k)] = kk; }
  return out;
}
function pendingSess(k) {     // sesiones de gym de días anteriores de esta semana que no se hicieron
  if (k > todayKey()) return [];
  const mon = mondayOf(parseKey(k)), made = weekSess(k), out = [];
  for (let kk = keyOf(mon); kk < k; kk = nextKey(kk)) {
    const ix = verOf(kk) === verOf(k) ? planIx(kk) : V1TO2[planIx(kk)];
    if (verOf(k).T[ix].kind !== "rest" && made[ix] == null && !didTrain(kk) && sessOf(k) !== ix && daysBetween(PLAN_START, kk) >= 0) out.push({ ix, k: kk });
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
      gym = { s: gs, e: Math.min(gs + gymDur(k), 1439) };
      m2 = open + 210; m3 = closeT - 60;
    } else if (gs >= closeT - 30) {                      // después de cerrar la ventana
      mode = "late"; gym = { s: gs, e: Math.min(gs + gymDur(k), 1439) };
      m2 = open + 210; m3 = closeT - 45;
    } else {
      gym = { s: gs, e: Math.min(gs + gymDur(k), 1439) };
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
    <details class="hdet"><summary>Por qué este plan (la evidencia)</summary><ul class="hol">
      <li><b>Proteína 165–175 g (≈ 2.0–2.2 g por kg):</b> la Sociedad Internacional de Nutrición Deportiva (ISSN) recomienda 1.4–2.0 g/kg para ganar músculo, y hasta 2.3–3.1 g/kg de masa magra cuando se pierde grasa. Usted está en la zona alta, que es la que protege el músculo mientras baja grasa.</li>
      <li><b>3 comidas con 40–70 g de proteína:</b> cada comida pasa de 0.4 g/kg, la dosis que maximiza la síntesis de músculo por comida.</li>
      <li><b>Ayuno 16:8:</b> los meta-análisis de comer en ventana con pesas muestran menos grasa y el músculo se mantiene, siempre que la proteína sea alta. Por eso la proteína es lo primero en cada plato.</li>
      <li><b>Grasa 70–80 g (≈ 25–30 % de las calorías):</b> dentro del rango que recomiendan los estudios de recomposición (15–30 %). El resto es carbohidrato para rendir en el gym.</li>
      <li><b>Calorías:</b> un poco por debajo de lo que gasta. Meta: bajar 0.25–0.5 kg por semana. Más rápido se pierde más músculo, según la revisión de Helms y cols. Cada 2 semanas se ajusta con su peso real.</li>
      <li><b>Creatina 3–5 g:</b> el suplemento con más evidencia para fuerza y músculo (ISSN).</li>
      <li><b>Magnesio en la noche:</b> la evidencia para el sueño es de baja calidad. Es barato y seguro en dosis normales; tómelo si le ayuda, pero no es lo que hace la diferencia: dormir 7.5 h o más sí.</li></ul></details>
    <details class="hdet"><summary>Qué tortilla y qué galleta comprar (nunca arroz)</summary><ul class="hol">
      <li><b>Tortilla:</b> de maíz, de las delgadas de tortillería o del súper (≈30 g cada una, ≈12 g de carbohidrato). Que la etiqueta diga solo maíz, cal y agua. Evite las de harina de trigo: tienen más grasa y calorías por unidad.</li>
      <li><b>Galletas:</b> galletas de arroz inflado (≈7 g de carbohidrato cada una) o galletas integrales con menos de 3 g de azúcar por porción. Sirven para la merienda o para completar el carbohidrato.</li>
      <li><b>Arroz:</b> no está en su plan. Donde un plato tico trae arroz, cámbielo por papa, camote, yuca o tortillas.</li></ul></details>
    <details class="hdet"><summary>Lista del súper para tener en la casa</summary><ul class="hol">${SHOP.map(([a, b]) => `<li><b>${esc(a)}:</b> ${esc(b)}</li>`).join("")}</ul><p class="hnote">En cada comida, el botón 💡 Ideas le da opciones para la calle y para la casa.</p></details>
    <details class="hdet"><summary>Cómo pesar con su balanza (Gynipot GY-A09)</summary><ol class="hol"><li>Enciéndala con ⏻/T y revise que diga <b>g</b>; si no, toque UNIT hasta que salga.</li><li>Ponga el plato vacío y toque ⏻/T: queda en 0 (tara).</li><li>Sirva la proteína hasta el número del plan; toque ⏻/T otra vez y sirva el carbohidrato.</li><li>Pese la comida ya cocida. Mide de 2 en 2 g y hasta 5 kg: sirve para todo, incluso los 15 g de maní.</li><li>Si los números saltan o se apaga sola, cambie las 2 baterías AAA.</li></ol></details>
    <details class="hdet"><summary>8 meriendas limpias</summary><ol class="hol">${FOOD.snacks.map((s) => `<li>${esc(s)}</li>`).join("")}</ol></details>
    <details class="hdet"><summary>Intercambios de carbohidrato (≈ 30 g cada uno)</summary>${tbl(FOOD.carbs, "Alimento", "Cocido")}</details>
    <details class="hdet"><summary>Intercambios de proteína (≈ 30 g cada uno)</summary>${tbl(FOOD.prots, "Alimento", "Cocido")}</details>
    <details class="hdet"><summary>Menú de la semana</summary>${`<table class="htbl"><thead><tr><th>Día</th><th>Comida 1</th><th>Cena</th></tr></thead><tbody>${[1, 2, 3, 4, 5, 6, 0].map((i) => `<tr${i === wd ? ' class="cur"' : ""}><td>${esc(t.wdLong[i])}</td><td>${esc(FOOD.menu[i][0])}</td><td>${esc(FOOD.menu[i][1])}</td></tr>`).join("")}</tbody></table>`}</details>
    <p class="hfoot muted">Cuando la familia cocine otra cosa: pese la proteína, use los intercambios para el carbohidrato y llene el resto del plato con verdura.</p>`;
}

/* ---------- cambiar la sesión del día ---------- */
function sessLine(k) {
  const six = sessOf(k), moved = six !== planIx(k), day = verOf(k).T[six];
  return `<button type="button" class="gymline" data-act="s-open"><span><small>¿Qué entrena hoy?</small><b>${esc(day.t)}</b><em>${moved ? "Cambiado · el plan decía " + esc(verOf(k).T[planIx(k)].t) : "La del plan de hoy"}</em></span><span class="gch">Cambiar</span></button>`;
}
function pendBanner(k) {
  const p = pendingSess(k);
  if (!p.length || k !== todayKey()) return "";
  const last = p[p.length - 1];
  return `<div class="pend"><div><b>Quedó pendiente: ${esc(verOf(k).T[last.ix].t)}</b><span>Le tocaba el ${esc(niceDate(last.k))} y no la marcó. Si la hace hoy, la de hoy (${esc(sessDay(k).t)}) queda para otro día de la semana.</span></div><button type="button" class="btn pri sm" data-act="s-set" data-v="${last.ix}">Hacerla hoy</button></div>`;
}
const SESS_ORDER = [1, 2, 3, 4, 5, 6, 0];
function sessWarn(k, ix) {
  const V = verOf(k), day = V.T[ix], prevIx = sessIn(prevKey(k), k), made = weekSess(k);
  const w = [], didY = didTrain(prevKey(k)), legs = (x) => V.legs.includes(x);
  if (made[ix] != null && day.kind !== "rest") w.push(`Ya la hizo el ${niceDate(made[ix])}`);
  if (didY && prevIx === ix && day.kind !== "rest") w.push("La hizo ayer: el músculo necesita 48 h");
  else if (didY && legs(ix) && legs(prevIx)) w.push("Ayer también cargó piernas: mejor dejar 48 h entre días de pierna");
  return w;
}
function openSessSheet() {
  const k = S.hDate, cur = sessOf(k), pix = planIx(k), pend = pendingSess(k).map((x) => x.ix), made = weekSess(k);
  const rows = SESS_ORDER.map((ix) => {
    const d = verOf(k).T[ix], w = sessWarn(k, ix);
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
  toast(recWeek(k) ? `Hoy: ${verOf(k).T[ix].t}. Mire cómo le recomiendo la semana` : `Hoy: ${verOf(k).T[ix].t}`);
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
const clashIn = (V) => (a, b) => !!(a && b && (a === b || (V.legs.includes(a) && V.legs.includes(b))));
function perms(a) { if (a.length <= 1) return [a.slice()]; const out = []; a.forEach((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).forEach((p) => out.push([x].concat(p)))); return out; }
function recWeek(k) {
  if (k !== todayKey() || S.person !== "carlos") return null;
  const mon = mondayOf(parseKey(k)), idx = (parseKey(k).getDay() + 6) % 7;   // 0 = lunes
  if (idx >= 5) return null;                                                 // sábado y domingo: no hay semana que acomodar
  const keys = Array.from({ length: 7 }, (_, i) => keyOf(addDays(mon, i)));
  const covered = new Set();
  const V = verOf(k), clash = clashIn(V);
  keys.slice(0, idx).forEach((kk) => { if (didTrain(kk)) covered.add(sessIn(kk, k)); });
  covered.add(sessOf(k));
  const fut = keys.slice(idx + 1, 6);                                        // hasta el sábado; el domingo queda de descanso
  let want = V.prio.filter((x) => !covered.has(x));
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
  while (!best && want.some((x) => x)) {      // si no hay forma sin juntar días de pierna, se suelta otra sesión
    const j = want.map((x) => !!x).lastIndexOf(true); skipped.unshift(want[j]); want[j] = 0;
    perms(want).forEach((p) => {
      let prev = sessOf(k), ok = true, sc = 0;
      p.forEach((x, i) => { if (clash(prev, x)) ok = false; prev = x; const day = idx + 2 + i; sc += x ? Math.abs(((x + 6) % 7) - (day - 1)) : 0; });
      if (ok && sc < bestScore) { best = p; bestScore = sc; }
    });
  }
  if (!best) return null;
  const curSet = new Set(cur), problem = cur.some((x) => x && covered.has(x)) || want.some((x) => x && !curSet.has(x));
  if (!problem || JSON.stringify(best) === JSON.stringify(cur)) return null;
  return { days: fut.map((kk, i) => ({ k: kk, ix: best[i], was: cur[i] })), skipped, sig: k + ":" + best.join("") };
}
function weekCard(k) {
  const r = recWeek(k);
  if (!r || hOf(k).wkNo === r.sig) return "";
  const V = verOf(k), today = sessDay(k), moved = sessOf(k) !== planIx(k);
  const rows = r.days.map((d) => `<li${d.ix !== d.was ? ' class="chg"' : ""}><span>${esc(T().wd[parseKey(d.k).getDay()])}</span><b>${esc(V.T[d.ix].t)}</b>${d.ix !== d.was ? `<small>antes: <s>${esc(V.T[d.was].t)}</s></small>` : ""}</li>`).join("") + `<li><span>${esc(T().wd[0])}</span><b>Descanso activo</b></li>`;
  const skip = r.skipped.length ? `<p class="wkskip">Esta semana se salta: <b>${esc(r.skipped.map((x) => V.T[x].t).join(", "))}</b>${r.skipped.length === 1 && V.why[r.skipped[0]] ? ` (${esc(V.why[r.skipped[0]])})` : ""}. ${r.skipped.length > 1 ? "No las meta" : "No la meta"} el domingo: el descanso vale más.</p>` : "";
  return `<section class="jcard wk" aria-label="Jarvis"><div class="jh"><span class="jdot" aria-hidden="true">J</span><b>Así le recomiendo la semana</b></div>
    <p class="wkhead">Hoy entrena <b>${esc(today.t)}</b>${moved ? `, que tocaba el ${esc(T().wdLong[sessOf(k)].toLowerCase())}` : ""}. Para hacer todas las sesiones sin repetir y sin poner dos días de pierna seguidos:</p>
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
  return `<p class="coach"><b>Jarvis:</b> ${esc(verOf(k).tip[ix] || "")}</p>`;
}


function trainItems(k) {
  const day = sessDay(k), items = [];
  if (day.kind !== "rest") items.push(MOB);
  const alt = hOf(k).alt || {};
  (day.ex || []).forEach(([n, r], i) => items.push(alt[n] ? { id: "ex" + i, t: alt[n], r, orig: n } : { id: "ex" + i, t: n, r }));
  (day.items || []).forEach((x) => items.push(x));
  (day.close || []).forEach((x) => items.push(x));
  items.push(STR_ITEM);
  return items.concat(extrasOf(k));
}

/* ---------- ejercicios extra (fuera del plan) ---------- */
// h.extra = [{ id, t, n, ns, rg }]
const extrasOf = (k) => (Array.isArray(hOf(k).extra) ? hOf(k).extra : []).map((e) => ({ id: "x_" + e.id, xid: e.id, t: e.t, n: e.n, r: `${e.ns} × ${e.rg}`, extra: true }));
function openExtraSheet() {
  openSheet(`<h3>Ejercicio extra</h3><p class="hint">Lo que hizo fuera del plan, por ejemplo porque un amigo lo propuso. Queda guardado con sus series para tenerlo en cuenta.</p><p class="coach"><b>Jarvis:</b> si es del mismo músculo de hoy, máximo 2 o 3 series. Más que eso le quita recuperación para la sesión siguiente.</p>
    <div class="f"><label for="xT">Ejercicio</label><input id="xT" class="fi" maxlength="60" placeholder="Ej.: Press de pecho en máquina"></div>
    <div class="f"><label for="xN">Máquina o detalle (opcional)</label><input id="xN" class="fi" maxlength="100" placeholder="Ej.: máquina Hammer, agarre cerrado"></div>
    <div class="f"><span class="lb">Series</span><div class="chips">${[2, 3, 4, 5].map((n) => `<button type="button" class="chip" data-act="x-ns" data-v="${n}" aria-pressed="${n === 3}">${n}</button>`).join("")}</div></div>
    <div class="f"><span class="lb">Repeticiones objetivo</span><div class="chips">${["6–8", "8–10", "10–12", "12–15", "15–20"].map((r) => `<button type="button" class="chip" data-act="x-rg" data-v="${r}" aria-pressed="${r === "10–12"}">${r}</button>`).join("")}</div></div>
    <div class="acts"><button type="button" class="btn" data-act="close">Cancelar</button><button type="button" class="btn pri" data-act="x-save">Agregar</button></div>`, { type: "extra", ns: 3, rg: "10–12" });
}
function saveExtra() {
  const x = sheetCtx; if (!x || x.type !== "extra") return;
  const t = (($("xT") || {}).value || "").trim(), n = (($("xN") || {}).value || "").trim();
  if (!t) { toast("Escriba el nombre del ejercicio"); return; }
  const L = (hOf(S.hDate).extra || []).slice();
  if (L.some((e) => e.t.toLowerCase() === t.toLowerCase()) || trainItems(S.hDate).some((e) => !e.extra && e.t.toLowerCase() === t.toLowerCase())) { toast("Ese ejercicio ya está en la sesión"); return; }
  L.push({ id: uid(), t: t.slice(0, 60), n: n.slice(0, 100), ns: x.ns, rg: x.rg });
  hSet(S.hDate, { extra: L.slice(0, 15) });
  closeSheet(); render(); toast("Ejercicio agregado");
}
function delExtra(id) {
  const k = S.hDate, h = hOf(k), e = (h.extra || []).find((y) => y.id === id); if (!e) return;
  const sets = clone(h.sets || {}); delete sets[e.t];
  const done = Object.assign({}, h.done || {}); delete done["t_x_" + id];
  hSet(k, { extra: (h.extra || []).filter((y) => y.id !== id), sets, done });
}


/* ---------- cómo se hace cada ejercicio ---------- */
// Fotos: Free Exercise DB (dominio público, Unlicense), copiadas en /ex/<id>_0.jpg y _1.jpg
const EXI = {
  "Press de banca": { img: "Barbell_Bench_Press_-_Medium_Grip", m: "Pecho, tríceps y hombro delantero", how: ["Acostado, ojos debajo de la barra, pies firmes en el piso y omóplatos juntos y hacia abajo.", "Agarre un poco más ancho que los hombros. Baje la barra controlada hasta la parte baja del pecho, codos a unos 45° del cuerpo.", "Empuje hacia arriba y un poco hacia atrás, sin despegar los glúteos del banco."], err: "Abrir los codos a 90° (lastima el hombro) o rebotar la barra en el pecho." },
  "Press inclinado con mancuernas": { img: "Incline_Dumbbell_Press", m: "Parte alta del pecho y hombro delantero", how: ["Banco a 30°, no más: más inclinado trabaja sobre todo hombro.", "Mancuernas a los lados del pecho, codos un poco por debajo de los hombros.", "Empuje hacia arriba juntando las mancuernas sin chocarlas. Baje en 2 segundos."], err: "Banco muy inclinado o bajar las mancuernas sin control." },
  "Fondos": { img: "Dips_-_Chest_Version", m: "Pecho bajo y tríceps", how: ["En las paralelas, brazos estirados, cuerpo un poco inclinado hacia adelante.", "Baje doblando los codos hasta que los brazos queden paralelos al piso.", "Suba empujando sin bloquear de golpe los codos."], err: "Bajar demasiado: si le molesta el hombro, quédese más arriba." },
  "Aperturas en polea": { img: "Cable_Crossover", m: "Pecho", how: ["Poleas arriba, un paso adelante, codos un poco doblados y fijos.", "Junte las manos al frente y abajo como si abrazara un árbol.", "Regrese lento hasta sentir el estiramiento del pecho."], err: "Doblar y estirar los codos: se vuelve un press y deja de trabajar el pecho." },
  "Extensión de tríceps en polea": { img: "Triceps_Pushdown", m: "Tríceps", how: ["De frente a la polea alta, codos pegados al cuerpo.", "Empuje hacia abajo hasta estirar por completo los brazos.", "Suba solo hasta que el antebrazo quede paralelo al piso. Los codos no se mueven."], err: "Separar los codos del cuerpo o tirar con el peso del cuerpo." },
  "Press francés": { img: "Lying_Triceps_Press", m: "Tríceps", how: ["Acostado en el banco, barra Z o mancuernas arriba con los brazos estirados.", "Doble solo los codos y baje el peso hacia la frente o un poco detrás de la cabeza.", "Estire los brazos sin mover los codos de su sitio."], err: "Abrir los codos hacia los lados o mover los hombros." },
  "Dominadas": { img: "Pullups", m: "Espalda (dorsal) y bíceps", how: ["Agarre un poco más ancho que los hombros, palmas hacia adelante.", "Baje los hombros primero y jale los codos hacia las costillas hasta pasar la barbilla de la barra.", "Baje controlado hasta estirar los brazos."], err: "Balancearse o hacer medias repeticiones. Si no salen, use la máquina asistida o una banda." },
  "Remo con barra": { img: "Bent_Over_Barbell_Row", m: "Espalda media, dorsal y bíceps", how: ["Rodillas un poco dobladas, torso inclinado a unos 45°, espalda recta.", "Jale la barra hacia el ombligo llevando los codos atrás.", "Apriete la espalda un segundo arriba y baje controlado."], err: "Redondear la espalda baja o levantar el torso para subir más peso." },
  "Jalón al pecho": { img: "Wide-Grip_Lat_Pulldown", m: "Dorsal ancho y bíceps", how: ["Sentado con las piernas trabadas, agarre ancho.", "Saque el pecho y jale la barra hasta la parte alta del pecho, codos hacia abajo y atrás.", "Suba lento hasta estirar los brazos."], err: "Echarse muy hacia atrás o jalar detrás de la nuca." },
  "Remo con mancuerna": { img: "One-Arm_Dumbbell_Row", m: "Dorsal y espalda media", how: ["Una rodilla y una mano en el banco, espalda plana.", "Jale la mancuerna hacia la cadera, no hacia el hombro.", "Baje hasta estirar el brazo y sentir la espalda."], err: "Girar el torso para subir el peso." },
  "Curl con barra": { img: "Barbell_Curl", m: "Bíceps", how: ["De pie, codos pegados al cuerpo, agarre al ancho de los hombros.", "Suba la barra doblando solo los codos.", "Baje en 2 a 3 segundos hasta estirar los brazos."], err: "Balancear el cuerpo para subir la barra." },
  "Curl martillo": { img: "Hammer_Curls", m: "Bíceps y antebrazo (braquial)", how: ["Mancuernas con las palmas mirándose, como si agarrara un martillo.", "Suba sin girar la muñeca, codos fijos.", "Baje controlado."], err: "Mover los codos hacia adelante." },
  "Sentadilla": { img: "Barbell_Squat", m: "Cuádriceps, glúteos y core", how: ["Barra sobre la parte alta de la espalda, pies al ancho de los hombros, puntas un poco abiertas.", "Respire, apriete el abdomen y baje como si se sentara, rodillas en la dirección de los pies.", "Baje hasta que el muslo quede paralelo al piso o un poco más, y suba empujando con todo el pie."], err: "Que las rodillas se vayan hacia adentro o que la espalda baja se redondee abajo." },
  "Peso muerto rumano": { img: "Romanian_Deadlift", m: "Femorales, glúteos y espalda baja", how: ["De pie con la barra, rodillas apenas dobladas y fijas.", "Lleve la cadera hacia atrás y baje la barra pegada a las piernas, espalda recta.", "Baje hasta sentir que estiran los femorales (más o menos debajo de la rodilla) y suba empujando la cadera al frente."], err: "Redondear la espalda o convertirlo en sentadilla doblando mucho las rodillas." },
  "Prensa": { img: "Leg_Press", m: "Cuádriceps y glúteos", how: ["Espalda y cadera pegadas al respaldo, pies al ancho de los hombros en la mitad de la plataforma.", "Baje hasta que las rodillas lleguen a unos 90° sin que se despegue la cadera.", "Empuje sin bloquear las rodillas arriba."], err: "Bajar tanto que la cadera se despega del asiento: carga la espalda baja." },
  "Zancadas": { img: "Dumbbell_Lunges", m: "Cuádriceps y glúteos", how: ["Mancuernas a los lados, un paso largo al frente.", "Baje hasta que la rodilla de atrás casi toque el piso, torso recto.", "Empuje con el talón de adelante para volver o avanzar."], err: "Paso muy corto: la rodilla de adelante se va muy por delante del pie." },
  "Curl femoral": { img: "Lying_Leg_Curls", m: "Femorales", how: ["Acostado boca abajo, el rodillo justo arriba de los talones.", "Doble las rodillas llevando los talones hacia los glúteos.", "Baje lento, sin dejar caer el peso."], err: "Levantar la cadera del banco para ayudarse." },
  "Pantorrilla": { img: "Standing_Calf_Raises", m: "Pantorrillas", how: ["Puntas en el borde de un escalón o la máquina, talones al aire.", "Baje los talones lo más que pueda y sostenga 1 segundo.", "Suba lo más alto posible y apriete arriba."], err: "Rebotar rápido: la pantorrilla crece con el estiramiento y la pausa." },
  "Press militar": { img: "Standing_Military_Press", m: "Hombros y tríceps", how: ["De pie, barra a la altura de la clavícula, glúteos y abdomen apretados.", "Empuje la barra hacia arriba y meta la cabeza por debajo cuando pase la cara.", "Baje controlado a la clavícula."], err: "Arquear mucho la espalda baja para empujar." },
  "Elevaciones laterales": { img: "Side_Lateral_Raise", m: "Hombro lateral", how: ["De pie, mancuernas a los lados, codos un poco doblados.", "Suba los brazos hacia los lados hasta la altura de los hombros, como si echara agua de una jarra.", "Baje en 2 a 3 segundos."], err: "Subir con impulso o pasar de la altura del hombro con mucho peso." },
  "Face pull": { img: "Face_Pull", m: "Hombro posterior y manguito rotador", how: ["Polea a la altura de la cara con cuerda.", "Jale hacia la cara separando las manos, codos altos.", "Termine con las manos a los lados de las orejas y regrese lento."], err: "Jalar hacia el pecho con los codos abajo: se vuelve un remo." },
  "Pájaros (deltoide posterior)": { img: "Seated_Bent-Over_Rear_Delt_Raise", m: "Hombro posterior", how: ["Sentado e inclinado hacia adelante con el pecho cerca de las piernas.", "Abra los brazos hacia los lados con los codos un poco doblados.", "Baje controlado. Peso liviano."], err: "Jalar con la espalda en vez del hombro." },
  "Encogimientos": { img: "Crunches", m: "Abdomen", how: ["Encogimiento abdominal (crunch): acostado, rodillas dobladas, manos a los lados de la cabeza.", "Despegue los hombros del piso apretando el abdomen, sin jalar el cuello.", "Baje lento sin descansar del todo arriba."], err: "Jalar la cabeza con las manos." },
  "Elevación de piernas colgado": { img: "Hanging_Leg_Raise", m: "Abdomen bajo", how: ["Colgado de la barra, brazos estirados.", "Suba las piernas (dobladas o rectas) inclinando la pelvis hacia arriba.", "Baje lento sin balancearse."], err: "Balancearse: el impulso hace el trabajo y no el abdomen." },
  "Remo 500 m o bici 1 km": { img: "Rowing_Stationary", m: "Cuerpo completo y cardio", how: ["En el remo: primero empujan las piernas, después se inclina un poco el torso y al final jalan los brazos.", "Regrese al revés: brazos, torso y piernas.", "Ritmo que pueda sostener en todas las rondas."], err: "Jalar solo con los brazos." },
  "Zancadas con peso": { img: "Dumbbell_Lunges", m: "Piernas y glúteos", how: ["Mancuernas o kettlebells a los lados.", "Pasos largos, rodilla de atrás cerca del piso.", "Torso recto todo el tiempo."], err: "Pasos cortos y torso inclinado." },
  "Wall balls": { img: "", m: "Piernas, hombros y cardio", how: ["De frente a la pared con una pelota medicinal al pecho.", "Haga una sentadilla completa y, al subir, lance la pelota a una marca alta en la pared.", "Atrápela y baje directo a la siguiente sentadilla."], err: "No bajar completo en la sentadilla." },
  "Burpees": { img: "", m: "Cuerpo completo y cardio", how: ["De pie, baje y ponga las manos en el piso.", "Salte con los pies atrás, pecho al piso.", "Suba, traiga los pies a las manos y salte con las manos arriba."], err: "Arquear la espalda baja al llegar al piso." },
  "Cargadas con kettlebell": { img: "One-Arm_Kettlebell_Clean", m: "Cadera, espalda y hombros", how: ["Kettlebell entre los pies, cadera atrás, espalda recta.", "Empuje la cadera al frente con fuerza y lleve la pesa pegada al cuerpo hasta el hombro.", "La pesa rueda alrededor de la mano, sin golpear el antebrazo."], err: "Subirla con el brazo en vez de con la cadera." },
  "Plancha": { img: "Plank", m: "Core", how: ["Antebrazos en el piso, codos debajo de los hombros.", "Cuerpo recto de la cabeza a los talones, glúteos y abdomen apretados.", "Respire normal y aguante el tiempo."], err: "Cadera muy alta o hundida." },
  "Dead bug": { img: "Dead_Bug", m: "Core (abdomen profundo)", how: ["Boca arriba, brazos al techo, rodillas a 90°.", "Pegue la espalda baja al piso y estire un brazo y la pierna contraria.", "Vuelva y cambie de lado, lento."], err: "Que la espalda baja se despegue del piso." },
  "Pallof press": { img: "Pallof_Press", m: "Core (antirrotación)", how: ["De lado a la polea a la altura del pecho, agarre con las dos manos.", "Estire los brazos al frente sin dejar que el cuerpo gire.", "Sostenga 2 segundos y regrese."], err: "Girar el torso hacia la polea." },
  "Rueda abdominal": { img: "Ab_Roller", m: "Core completo", how: ["De rodillas con la rueda bajo los hombros.", "Ruede hacia adelante con el abdomen apretado y la espalda sin hundirse.", "Vuelva jalando con el abdomen."], err: "Ir más lejos de lo que puede controlar: la espalda baja se hunde." }
};
const exImg = (id, n) => `ex/${id}_${n}.jpg`;
function exThumb(x) {
  const e = EXI[x.t]; if (!e) return "";
  return `<button type="button" class="exth" data-act="ex-how" data-ex="${esc(x.t)}" aria-label="Cómo se hace ${esc(x.t)}">${e.img ? `<img src="${exImg(e.img, 1)}" alt="" loading="lazy">` : `<span>?</span>`}</button>`;
}
function openExHow(name) {
  const e = EXI[name]; if (!e) return;
  const yt = "https://www.youtube.com/results?search_query=" + encodeURIComponent("cómo hacer " + name + " técnica correcta");
  openSheet(`<h3>${esc(name)}</h3><p class="hint">${esc(e.m)}</p>
    ${e.img ? `<div class="exanim"><img src="${exImg(e.img, 0)}" alt="Posición inicial de ${esc(name)}"><img src="${exImg(e.img, 1)}" alt="Posición final de ${esc(name)}"></div>` : ""}
    <ol class="hol exhow">${e.how.map((h) => `<li>${esc(h)}</li>`).join("")}</ol>
    <p class="exerr"><b>Error común:</b> ${esc(e.err)}</p>
    ${HOLDS[name] ? `<div class="wtrow">${timerBtn("hold", name, "Iniciar: " + holdTxt(name))}</div>` : Object.values(PLAN_V2.str).concat(Object.values(PLAN_V1.str)).some((L) => L.includes(name)) ? `<div class="wtrow">${timerBtn("str", name, "Iniciar: 2 × 30 s por lado")}</div>` : ""}
    <div class="acts"><a class="btn" href="${yt}" target="_blank" rel="noopener">Ver videos</a><button type="button" class="btn pri" data-act="close">Entendido</button></div>
    ${e.img ? `<p class="hfoot muted">Fotos: Free Exercise DB (dominio público).</p>` : ""}`, { type: "exhow" });
}

/* ---------- series: peso y repeticiones de cada serie ---------- */
// h.sets = { "Press de banca": [{ w, r, ok }] } · h.wu = "kg" | "lb"
const nSets = (r) => { const m = /^(\d+)\s*×/.exec(String(r || "")); return m ? +m[1] : 0; };
const repGoal = (r) => { const m = /×\s*([\d–-]+)/.exec(String(r || "")); return m ? m[1] : ""; };
const wUnit = (k) => hOf(k).wu || lsGet("dd.wu", "kg");
// unidad de cada ejercicio: la que escogió ese día, si no la que usó la última vez, si no la general
const exUnit = (k, name) => ((hOf(k).exu || {})[name]) || (lsGet("dd.exu", {})[name]) || (lastSets(name, k) || {}).u || wUnit(k);
function setExUnit(k, name, u) {
  const m = lsGet("dd.exu", {}); m[name] = u; lsSet("dd.exu", m);
  hSet(k, { exu: Object.assign({}, hOf(k).exu || {}, { [name]: u }) });
}
const setsOf = (k, name) => ((hOf(k).sets || {})[name] || []);
function lastSets(name, beforeKey) {          // la última vez que hizo ese ejercicio
  let best = null;
  Object.entries(D.plans).forEach(([id, v]) => {
    if (!id.startsWith("h_carlos_") || !v || !v.sets || !v.date || v.date >= beforeKey) return;
    const L = (v.sets[name] || []).filter((x) => has(x.w) || has(x.r));
    if (L.length && (!best || v.date > best.date)) best = { date: v.date, sets: L, u: (v.exu || {})[name] || v.wu || "kg" };
  });
  return best;
}
function setPut(k, name, i, patch, total) {
  const all = clone(hOf(k).sets || {}), L = (all[name] || []).slice();
  while (L.length < total) L.push({});
  L[i] = Object.assign({}, L[i], patch);
  Object.keys(L[i]).forEach((x) => { if (L[i][x] == null || L[i][x] === "") delete L[i][x]; });
  all[name] = L;
  const patchH = { sets: all };
  if (!hOf(k).wu) patchH.wu = wUnit(k);
  if (!(hOf(k).exu || {})[name]) patchH.exu = Object.assign({}, hOf(k).exu || {}, { [name]: exUnit(k, name) });
  hSet(k, patchH);
}
function setsBlock(k, x, total) {
  const L = setsOf(k, x.t), last = lastSets(x.t, k), u = exUnit(k, x.t), goal = repGoal(x.r);
  const lastTxt = last ? `La vez pasada (${esc(shortDate(last.date))}): ${esc(last.sets.map((s) => `${has(s.w) ? fmtNum(s.w, s.w % 1 ? 1 : 0) : "—"}${last.u === u ? "" : " " + last.u} × ${has(s.r) ? s.r : "—"}`).join(" · "))}${last.u === u ? " " + u : ""}` : "Primera vez: escoja un peso con el que llegue a " + esc(goal) + " repeticiones dejando 1 o 2 en reserva.";
  const rows = Array.from({ length: total }, (_, i) => {
    const c = L[i] || {}, ph = (last && last.sets[i]) || L[i - 1] || {};
    return `<div class="set${c.ok ? " ok" : ""}"><span class="sn">${i + 1}</span>
      <label class="sf"><input class="fi" type="number" inputmode="decimal" step="0.5" min="0" data-sv="w" data-ex="${esc(x.t)}" data-i="${i}" data-n="${total}" value="${has(c.w) ? esc(c.w) : ""}" placeholder="${has(ph.w) ? esc(ph.w) : ""}" aria-label="Peso serie ${i + 1}"><small>${u}</small></label>
      <label class="sf"><input class="fi" type="number" inputmode="numeric" step="1" min="0" data-sv="r" data-ex="${esc(x.t)}" data-i="${i}" data-n="${total}" value="${has(c.r) ? esc(c.r) : ""}" placeholder="${has(ph.r) ? esc(ph.r) : esc(String(goal).split(/[–-]/).pop())}" aria-label="Repeticiones serie ${i + 1}"><small>reps</small></label>
      <button type="button" class="hchk sm${c.ok ? " on" : ""}" data-act="set-ok" data-ex="${esc(x.t)}" data-i="${i}" data-n="${total}" data-id="${x.id}" aria-pressed="${!!c.ok}" aria-label="Serie ${i + 1} hecha">${IC.check}</button></div>`;
  }).join("");
  const useg = `<div class="useg sm" role="group" aria-label="Unidad de ${esc(x.t)}"><button type="button" data-act="exu" data-ex="${esc(x.t)}" data-v="kg" aria-pressed="${u === "kg"}">kg</button><button type="button" data-act="exu" data-ex="${esc(x.t)}" data-v="lb" aria-pressed="${u === "lb"}">lb</button></div>`;
  return `<div class="sets"><div class="shd"><p class="slast">${lastTxt}</p>${useg}</div>${rows}${HOLDS[x.t] ? timerBtn("hold", x.t, "Sostener: " + holdTxt(x.t) + " · iniciar") : ""}<button type="button" class="rtbtn" data-act="rt-go" data-v="${restFor(x)}" data-l="${esc(x.t)}">⏱ Descanso entre series: ${fmtClock(restFor(x))} min · iniciar</button></div>`;
}
function setOk(k, name, i, total, exId) {
  const items0 = trainItems(k), x0 = items0.find((y) => y.t === name);
  const L = setsOf(k, name), c = L[i] || {}, on = !c.ok;
  const patch = { ok: on };
  if (on) {                       // si no escribió nada, toma lo de la vez pasada o la serie anterior
    const last = lastSets(name, k), ph = (last && last.sets[i]) || L[i - 1] || {};
    const row = document.querySelector(`.set input[data-sv="w"][data-i="${i}"][data-ex="${CSS.escape(name)}"]`);
    const rowR = document.querySelector(`.set input[data-sv="r"][data-i="${i}"][data-ex="${CSS.escape(name)}"]`);
    const tw = row && row.value !== "" ? parseFloat(row.value) : null, tr = rowR && rowR.value !== "" ? parseInt(rowR.value, 10) : null;
    patch.w = has(tw) ? tw : has(c.w) ? c.w : has(ph.w) ? ph.w : null;
    const gTop = parseInt(String(repGoal((trainItems(k).find((y) => y.t === name) || {}).r || "")).split(/[–-]/).pop(), 10);
    patch.r = has(tr) ? tr : has(c.r) ? c.r : has(ph.r) ? ph.r : has(gTop) ? gTop : null;
  }
  setPut(k, name, i, patch, total);
  const after = setsOf(k, name), all = after.length >= total && after.slice(0, total).every((x) => x && x.ok);
  const done = Object.assign({}, hOf(k).done || {});
  if (all) done["t_" + exId] = true; else delete done["t_" + exId];
  hSet(k, { done });
  if (on && navigator.vibrate) try { navigator.vibrate(15); } catch (e) {}
  if (on && x0) restAfterSet(k, x0, i, total, items0);
  else if (!on) restStop();
}
function unitSeg(k) {
  const u = wUnit(k);
  return `<div class="useg" role="group" aria-label="Unidad de peso"><span>Unidad general</span><button type="button" data-act="wu" data-v="kg" aria-pressed="${u === "kg"}">kg</button><button type="button" data-act="wu" data-v="lb" aria-pressed="${u === "lb"}">lb</button></div>`;
}
function trainRows() {            // todas las series guardadas, para exportar
  const out = [["Fecha", "Sesión", "Ejercicio", "Serie", "Peso", "Unidad", "Repeticiones", "Hecha"]];
  Object.entries(D.plans).filter(([id, v]) => id.startsWith("h_carlos_") && v && v.sets).sort((a, b) => (a[1].date < b[1].date ? -1 : 1)).forEach(([, v]) => {
    const ses = verOf(v.date).T[Number.isInteger(v.sess) ? v.sess : parseKey(v.date).getDay()].t, xs = {}; (v.extra || []).forEach((e) => { xs[e.t] = e; });
    Object.entries(v.sets).forEach(([ex, L]) => (L || []).forEach((x, i) => { if (x && (has(x.w) || has(x.r) || x.ok)) out.push([v.date, ses, xs[ex] ? `${ex} (extra${xs[ex].n ? ": " + xs[ex].n : ""})` : ex, i + 1, has(x.w) ? x.w : "", (v.exu || {})[ex] || v.wu || "kg", has(x.r) ? x.r : "", x.ok ? "sí" : "no"]); }));
  });
  return out;
}
function exportTrain(mode) {
  const rows = trainRows();
  if (rows.length < 2) { toast("Todavía no hay series anotadas"); return; }
  if (mode === "copy") {
    const txt = rows.map((r) => r.join("\t")).join("\n");
    (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast(`Copiado: ${rows.length - 1} series. Péguelo en el chat o en una hoja`), () => toast(T().writeErr));
    return;
  }
  const csv = "﻿" + rows.map((r) => r.map((c) => /[",;\n]/.test(String(c)) ? `"${String(c).replace(/"/g, '""')}"` : c).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  a.download = `entrenos-carlos-${todayKey()}.csv`;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  toast(`Descargado: ${rows.length - 1} series`);
}


/* ---------- descanso entre series (cronómetro) ---------- */
// Evidencia: más de 60 s da algo más de músculo; pasar de 90 s ya casi no cambia la hipertrofia (Singer, Schoenfeld y cols., 2024).
// En básicos pesados de 6–8 repeticiones se descansa más para mantener el peso (2.5 min); en aislamiento, 90 s; core, 60 s.
const HEAVY_RE = /press de banca|press inclinado|dominadas|remo con barra|sentadilla|peso muerto|press militar|prensa|fondos|hip thrust/i;
const restFor = (x) => /plancha|dead bug|pallof|rueda|core/i.test(x.t) ? 60 : HEAVY_RE.test(x.orig || x.t) ? 150 : 90;
const NEXT_EX_REST = 120;           // al cambiar de ejercicio: 2 min para preparar la máquina y calentar
const fmtClock = (sec) => `${Math.floor(sec / 60)}:${String(Math.max(0, sec % 60)).padStart(2, "0")}`;
let RT = null, rtTick = null, actx = null;
// RT = { title, phases:[{sec, label, kind:"rest"|"work"}], i, end (ms), left (si está en pausa), osc }
function tone(t0, freqs) {
  freqs.forEach(([d, f]) => {
    const o = actx.createOscillator(), g = actx.createGain();
    o.frequency.value = f; o.connect(g); g.connect(actx.destination);
    g.gain.setValueAtTime(0.0001, t0 + d); g.gain.exponentialRampToValueAtTime(0.35, t0 + d + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 0.2);
    o.start(t0 + d); o.stop(t0 + d + 0.22); RT.osc.push(o);
  });
}
function schedBeeps() {                 // un pitido al cambiar de fase y tres al terminar todo
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    let t = (RT.end - Date.now()) / 1000;
    for (let j = RT.i; j < RT.phases.length; j++) {
      if (j > RT.i) t += RT.phases[j].sec;
      const last = j === RT.phases.length - 1;
      tone(actx.currentTime + Math.max(0, t), last ? [[0, 880], [0.25, 880], [0.5, 1175]] : [[0, 1047], [0.18, 1319]]);
    }
  } catch (e) {}
}
function killBeeps() { if (RT) { (RT.osc || []).forEach((o) => { try { o.stop(); } catch (e) {} }); RT.osc = []; } }
function runSeq(phases, title) {
  restStop(true);
  RT = { title, phases, i: 0, end: Date.now() + phases[0].sec * 1000, osc: [] };
  schedBeeps();
  rtTick = setInterval(restPaint, 250);
  restPaint();
}
function restStart(sec, label) { runSeq([{ sec, label, kind: "rest" }], "Descanso"); }
function restAdd(d) {
  if (!RT || RT.left != null) return;
  killBeeps();
  RT.end = Math.max(Date.now() + 5000, RT.end + d * 1000); RT.phases[RT.i].sec = Math.max(5, RT.phases[RT.i].sec + d); RT.done = false;
  schedBeeps(); restPaint();
}
function restPause() {
  if (!RT || RT.done) return;
  if (RT.left == null) { RT.left = Math.max(0, RT.end - Date.now()); killBeeps(); }
  else { RT.end = Date.now() + RT.left; RT.left = null; schedBeeps(); }
  restPaint();
}
function restStop(quiet) {
  killBeeps();
  RT = null; clearInterval(rtTick); rtTick = null;
  const el = document.getElementById("restbar"); if (el) el.classList.remove("show");
}
function restPaint() {
  let el = document.getElementById("restbar");
  if (!el) { el = document.createElement("div"); el.id = "restbar"; el.className = "restbar"; el.setAttribute("role", "timer"); document.body.appendChild(el); }
  if (!RT) { el.classList.remove("show"); return; }
  let ms = RT.left != null ? RT.left : RT.end - Date.now();
  while (ms <= 0 && !RT.done && RT.left == null) {            // pasa a la siguiente fase
    if (RT.i < RT.phases.length - 1) { RT.i++; RT.end += RT.phases[RT.i].sec * 1000; ms = RT.end - Date.now(); if (navigator.vibrate) try { navigator.vibrate(200); } catch (e) {} }
    else { RT.done = true; if (navigator.vibrate) try { navigator.vibrate([300, 150, 300, 150, 300]); } catch (e) {} setTimeout(() => { if (RT && RT.done) restStop(); }, 20000); }
  }
  const ph = RT.phases[RT.i], left = Math.max(0, Math.ceil(ms / 1000)), rest = ph.kind === "rest", multi = RT.phases.length > 1;
  const pct = Math.min(100, Math.max(0, 100 - (ms / 1000 / ph.sec) * 100));
  el.className = "restbar show" + (RT.done ? " done" : rest ? "" : " work");
  const step = multi ? ` · ${RT.i + 1} de ${RT.phases.length}` : "";
  el.innerHTML = RT.done
    ? `<div class="rtx"><b>${RT.title === "Descanso" ? "¡A la siguiente serie!" : "¡Terminado!"}</b><small>${esc(RT.title === "Descanso" ? ph.label : RT.title)}</small></div><button type="button" class="btn pri sm" data-act="rt-stop">Listo</button>`
    : `<div class="rtx"><small>${esc(rest ? (RT.title === "Descanso" ? "Descanso · " + ph.label : ph.label) : RT.title + " · " + ph.label)}${esc(step)}</small><b>${fmtClock(left)}</b></div><div class="rtb">${rest && !multi ? `<button type="button" class="btn sm" data-act="rt-add" data-v="-15">−15 s</button><button type="button" class="btn sm" data-act="rt-add" data-v="15">+15 s</button>` : `<button type="button" class="btn sm" data-act="rt-pause">${RT.left != null ? "Seguir" : "Pausa"}</button>`}<button type="button" class="btn sm" data-act="rt-stop">${rest && !multi ? "Saltar" : "Parar"}</button></div><i style="width:${pct}%"></i>`;
}

/* ---------- cronómetro de ejercicio: lo que se hace por tiempo ---------- */
const HOLDS = {     // sostener: segundos, por lado, repeticiones por serie
  "Plancha lateral": { sec: 30, sides: true, reps: 1, sets: 3 },
  "Plancha": { sec: 40, reps: 1, sets: 3 },
  "Bird dog": { sec: 10, sides: true, reps: 6, sets: 1 },
  "Curl-up de McGill": { sec: 10, reps: 6, sets: 1 }
};
function holdSeq(name) {
  const h = HOLDS[name]; if (!h) return null;
  const out = [], sides = h.sides ? ["lado izquierdo", "lado derecho"] : [""];
  for (let s = 0; s < h.sets; s++) {
    sides.forEach((sd, si) => {
      for (let r = 0; r < h.reps; r++) {
        out.push({ sec: h.sec, kind: "work", label: `${h.reps > 1 ? "rep " + (r + 1) + (sd ? " · " : "") : ""}${sd || "sostenga"}` });
        const lastOfSide = r === h.reps - 1;
        if (!lastOfSide) out.push({ sec: 3, kind: "rest", label: "suelte y respire" });
        else if (si < sides.length - 1) out.push({ sec: 5, kind: "rest", label: "cambie de lado" });
      }
    });
    if (s < h.sets - 1) out.push({ sec: 30, kind: "rest", label: "descanso entre series" });
  }
  return out;
}
const holdTxt = (name) => { const h = HOLDS[name]; return h ? `${h.sets > 1 ? h.sets + " × " : ""}${h.reps > 1 ? h.reps + " × " : ""}${h.sec} s${h.sides ? " por lado" : ""}` : ""; };
function stretchSeq(name) {
  const o = [];
  for (let r = 1; r <= 2; r++) { o.push({ sec: 30, kind: "work", label: `vez ${r} · un lado` }, { sec: 5, kind: "rest", label: "cambie de lado" }, { sec: 30, kind: "work", label: `vez ${r} · otro lado` }); if (r === 1) o.push({ sec: 10, kind: "rest", label: "suelte" }); }
  return o;
}
function itemSeq(x) {   // cardio, movilidad, core y caminata: por minutos
  if (/Intervalos/.test(x.t)) { const o = [{ sec: 300, kind: "work", label: "calentar suave" }]; for (let i = 1; i <= 8; i++) o.push({ sec: 60, kind: "work", label: `ronda ${i} de 8 · ¡FUERTE!` }, { sec: 120, kind: "rest", label: `ronda ${i} de 8 · suave` }); return o; }
  const m = /(\d+)(?:\s*[–-]\s*(\d+))?\s*min/.exec(x.t); if (!m) return null;
  return [{ sec: +m[1] * 60, kind: "work", label: m[2] ? `${m[1]} min (hasta ${m[2]} si se siente bien)` : `${m[1]} min` }];
}
function timerBtn(kind, name, label) { return `<button type="button" class="rtbtn go" data-act="wt-go" data-kind="${kind}" data-n="${esc(name)}">⏱ ${esc(label)}</button>`; }
function startTimer(kind, name) {
  const k = S.hDate;
  let seq = null, title = name;
  if (kind === "hold") seq = holdSeq(name);
  else if (kind === "str") seq = stretchSeq(name);
  else { const x = trainItems(k).find((y) => y.id === name); if (x) { seq = itemSeq(x); title = x.t.split(" · ")[0]; } }
  if (!seq) return;
  if (typeof closeSheet === "function" && $("sheet").classList.contains("open")) closeSheet();
  runSeq(seq, title);
}
function restAfterSet(k, x, i, total, items) {
  if (k !== todayKey()) return;
  if (i < total - 1) { restStart(restFor(x), `${x.t}: serie ${i + 2} de ${total}`); return; }
  const ix = items.findIndex((y) => y.t === x.t), nx = items.slice(ix + 1).find((y) => nSets(y.r));
  if (nx) restStart(NEXT_EX_REST, `Ahora: ${nx.t}`);
}


/* ---------- progreso del día y de la semana, y duración estimada ---------- */
function itemMin(x, day, isFirstEx) {
  const ns = nSets(x.r);
  if (ns) return ns * 0.75 + (ns - 1) * restFor(x) / 60 + NEXT_EX_REST / 60;          // 45 s por serie + descansos + cambio de ejercicio
  if (/Hyrox/.test(day.t) && x.id.startsWith("ex")) return isFirstEx ? 4.5 * 7 : 0;   // 4–5 rondas de ≈5 min + 2 min de descanso
  if (/Intervalos/.test(x.t)) return 8 * 3 + 5;
  const m = /(\d+)(?:\s*[–-]\s*(\d+))?\s*min/.exec(x.t);
  return m ? (m[2] ? (+m[1] + +m[2]) / 2 : +m[1]) : 5;
}
function dayProg(k) {
  const day = sessDay(k), h = hOf(k), done = h.done || {};
  const items = trainItems(k).filter((x) => !x.extra);
  let tot = 0, ok = 0, est = 0, left = 0, firstEx = true;
  items.forEach((x) => {
    const ns = nSets(x.r), min = itemMin(x, day, firstEx && x.id.startsWith("ex"));
    if (x.id.startsWith("ex")) firstEx = false;
    const u = ns || 1, sOk = ns ? Math.min(ns, setsOf(k, x.t).filter((y) => y && y.ok).length) : 0;
    const d = done["t_" + x.id] ? u : ns ? sOk : 0;
    const sw = !!(h.swap || {})[x.id];          // lo cambió por otra actividad: no cuenta en el tiempo del gym
    tot += u; ok += d; if (!sw) { est += min; left += min * (1 - d / u); }
  });
  return { pct: tot ? Math.round((ok / tot) * 100) : 0, ok, tot, est: Math.round(est), left: Math.round(left) };
}
const round5 = (m) => Math.ceil(m / 5) * 5;
const gymDur = (k) => Math.min(150, Math.max(40, round5(dayProg(k).est)));
function weekProg(k) {
  const mon = mondayOf(parseKey(k)), tk = todayKey();
  const days = Array.from({ length: 7 }, (_, i) => { const kk = keyOf(addDays(mon, i)); return { k: kk, wd: parseKey(kk).getDay(), p: dayProg(kk).pct, fut: kk > tk, t: sessDay(kk).t }; });
  const pct = Math.round(days.reduce((a, d) => a + d.p, 0) / 7);
  return { days, pct, full: days.filter((d) => d.p >= 100).length };
}
function weekBar(k) {
  const w = weekProg(k), t = T();
  const segs = w.days.map((d) => `<button type="button" class="wseg${d.k === k ? " cur" : ""}${d.p >= 100 ? " full" : ""}${d.fut ? " fut" : ""}" data-act="h-day" data-k="${d.k}" aria-label="${esc(t.wdLong[d.wd])}: ${esc(d.t)}, ${d.p} %"><i><em style="height:${d.p}%"></em></i><small>${esc(t.wd[d.wd])}</small></button>`).join("");
  const msg = w.pct >= 100 ? "Semana perfecta: cumplió el 100 % del plan." : w.full ? `${w.full} de 7 días completos.` : "Todavía no completa ningún día esta semana.";
  return `<div class="wprog"><div class="wph"><b>Esta semana</b><span>${w.pct} %</span></div><div class="pbar"><i style="width:${w.pct}%"></i></div><div class="wsegs">${segs}</div><p class="hnote">${esc(msg)} El domingo de descanso activo también cuenta.</p></div>`;
}
function dayBar(k) {
  const p = dayProg(k), day = sessDay(k);
  const left = p.pct >= 100 ? "Sesión completa." : p.ok ? `Le faltan unos ${fmtDur(p.left)}.` : "";
  return `<div class="dprog"><div class="wph"><b>Hoy ${p.pct} %</b><span>${p.ok} de ${p.tot} ${day.kind === "rest" ? "tareas" : "series y tareas"}</span></div><div class="pbar"><i style="width:${p.pct}%"></i></div><p class="hnote">Duración estimada: <b>${fmtDur(round5(p.est))}</b>${day.kind === "rest" ? "" : " contando los descansos entre series"}. ${left}</p></div>`;
}



/* ---------- estiramientos al final de cada día (mínimo 2) ---------- */
// ACSM: estático, hasta sentir tensión sin dolor, 10–30 s y 2–4 repeticiones; lo ideal es a diario. Va al final, no antes de entrenar.
const STR_ITEM = { id: "str", t: "Estiramientos · 5 min", n: "Mínimo 2 de los 3, al terminar" };
Object.assign(EXI, {
  "Pecho y hombro con palo": { img: "Chest_And_Front_Of_Shoulder_Stretch", m: "Pecho y hombro delantero", how: ["De pie, agarre un palo, toalla o banda detrás de la espalda con las manos más anchas que los hombros.", "Saque el pecho y suba los brazos hacia atrás despacio hasta sentir el estiramiento en el pecho.", "Sin palo: apoye el antebrazo en el marco de una puerta y gire el cuerpo hacia el otro lado."], err: "Arquear la espalda baja en vez de abrir el pecho." },
  "Tríceps detrás de la cabeza": { img: "Triceps_Stretch", m: "Tríceps", how: ["Lleve una mano detrás de la cabeza, hacia la espalda.", "Con la otra mano, jale suave el codo hacia atrás y hacia la cabeza.", "Cambie de brazo."], err: "Jalar fuerte o meter la cabeza hacia adelante." },
  "Hombro cruzado": { img: "Shoulder_Stretch", m: "Hombro posterior", how: ["Cruce un brazo estirado frente al pecho.", "Con el otro brazo, acérquelo al pecho por encima del codo.", "Hombros abajo, sin subirlos a las orejas. Cambie de lado."], err: "Jalar desde la muñeca o el codo: se carga la articulación." },
  "Dorsal en la pared": { img: "One_Arm_Against_Wall", m: "Dorsal ancho y costado", how: ["De lado o de frente a la pared, mano apoyada arriba.", "Lleve la cadera hacia atrás o hacia el otro lado hasta sentir el costado de la espalda.", "Respire profundo hacia ese lado. Cambie de brazo."], err: "Encoger el hombro hacia la oreja." },
  "Bíceps de pie": { img: "Standing_Biceps_Stretch", m: "Bíceps y pecho", how: ["De pie, entrelace los dedos detrás de la espalda.", "Estire los brazos y gire las palmas hacia abajo.", "Suba un poco las manos hasta sentir el bíceps y el pecho."], err: "Inclinar el torso hacia adelante." },
  "Postura del niño": { img: "Childs_Pose", m: "Espalda baja, dorsal y cadera", how: ["De rodillas, siéntese sobre los talones.", "Lleve el pecho hacia el piso con los brazos estirados al frente.", "Respire lento y suelte la espalda en cada exhalación."], err: "Aguantar la respiración: aquí se trata de soltar." },
  "Flexor de cadera arrodillado": { img: "Kneeling_Hip_Flexor", m: "Flexor de cadera y cuádriceps", how: ["Una rodilla en el piso y el otro pie adelante, como en una zancada.", "Apriete el glúteo de la pierna de atrás y lleve la cadera un poco al frente.", "Siente el estiramiento al frente de la cadera. Cambie de lado."], err: "Arquear la espalda baja en vez de apretar el glúteo." },
  "Femoral sentado": { img: "Seated_Floor_Hamstring_Stretch", m: "Femorales y pantorrilla", how: ["Sentado, una pierna estirada y la otra doblada con el pie en el muslo.", "Con la espalda recta, inclínese desde la cadera hacia el pie.", "Llegue hasta sentir tensión, no dolor. Cambie de lado."], err: "Redondear la espalda para llegar más lejos." },
  "Glúteo en figura 4": { img: "Ankle_On_The_Knee", m: "Glúteo y piriforme", how: ["Boca arriba, rodillas dobladas.", "Ponga un tobillo sobre la rodilla contraria, como un 4.", "Acerque la pierna de abajo al pecho hasta sentir el glúteo. Cambie de lado."], err: "Despegar la cabeza y los hombros del piso." },
  "Cuádriceps con pie en banco": { img: "Standing_Elevated_Quad_Stretch", m: "Cuádriceps y flexor de cadera", how: ["De espaldas a un banco, apoye el empeine de un pie atrás.", "Doble la rodilla de adelante y baje la cadera despacio.", "Torso recto. Sin banco: de pie, agarre el tobillo y lleve el talón al glúteo."], err: "Inclinar el torso hacia adelante." },
  "Pantorrilla en la pared": { img: "Calf_Stretch_Hands_Against_Wall", m: "Pantorrilla", how: ["Manos en la pared, una pierna atrás estirada y el talón en el piso.", "Lleve la cadera hacia la pared hasta sentir la pantorrilla.", "Después doble un poco la rodilla de atrás para estirar la parte baja. Cambie de lado."], err: "Levantar el talón de atrás." }
});
const STR = {   // 3 por sesión, según lo que se trabajó
  0: ["Glúteo en figura 4", "Femoral sentado", "Postura del niño"],
  1: ["Pecho y hombro con palo", "Tríceps detrás de la cabeza", "Hombro cruzado"],
  2: ["Dorsal en la pared", "Bíceps de pie", "Postura del niño"],
  3: ["Flexor de cadera arrodillado", "Femoral sentado", "Glúteo en figura 4"],
  4: ["Cuádriceps con pie en banco", "Pantorrilla en la pared", "Femoral sentado"],
  5: ["Hombro cruzado", "Pecho y hombro con palo", "Dorsal en la pared"],
  6: ["Flexor de cadera arrodillado", "Cuádriceps con pie en banco", "Postura del niño"]
};


/* ---------- core que protege la columna ---------- */
Object.assign(EXI, {
  "Curl-up de McGill": { img: "", m: "Abdomen sin doblar la espalda baja", how: ["Boca arriba, una rodilla doblada y la otra pierna estirada. Manos debajo de la espalda baja para mantener su curva.", "Despegue apenas la cabeza y los hombros del piso, sin doblar el cuello ni la espalda baja, y sostenga 10 segundos.", "Baje, respire y repita. Cambie de pierna a la mitad."], err: "Subir mucho: no es un abdominal tradicional, el movimiento es de pocos centímetros." },
  "Plancha lateral": { img: "Side_Bridge", m: "Oblicuos y cuadrado lumbar (lo que estabiliza la espalda)", how: ["De lado, apoyado en el antebrazo, codo debajo del hombro.", "Suba la cadera hasta que el cuerpo quede recto.", "Sostenga y cambie de lado. Más fácil: con la rodilla de abajo en el piso."], err: "Dejar caer la cadera o girar el pecho hacia el piso." },
  "Bird dog": { img: "", m: "Espalda baja, glúteos y control del core", how: ["En cuatro apoyos, espalda recta como una mesa.", "Estire un brazo al frente y la pierna contraria atrás, sin que se mueva la espalda, y sostenga 10 segundos.", "Vuelva y cambie de lado."], err: "Subir mucho la pierna y arquear la espalda." },
  "Hip thrust con barra": { img: "Barbell_Hip_Thrust", eq: "Barra y banco", m: "Glúteos y femorales", why: "Mismo músculo sin cargar la espalda baja.", how: ["Espalda alta apoyada en un banco, barra sobre la cadera (con almohadilla).", "Empuje la cadera hacia arriba hasta quedar recto de rodillas a hombros.", "Apriete los glúteos 1 segundo arriba y baje controlado."], err: "Arquear la espalda baja arriba en vez de apretar glúteos." }
});

/* ---------- cambiar un ejercicio por otro (máquina ocupada) ---------- */
// A(nombre, foto, equipo, músculo, por qué sirve, [pasos], error común)
const A = (img, eq, m, why, how, err) => ({ img, eq, m, why, how, err });
Object.assign(EXI, {
  "Press de banca con mancuernas": A("Dumbbell_Bench_Press", "Mancuernas", "Pecho y tríceps", "El mismo empuje, con más recorrido.", ["Acostado, mancuernas a los lados del pecho, omóplatos juntos.", "Empuje hacia arriba juntándolas sin chocarlas.", "Baje en 2 segundos hasta sentir el pecho estirado."], "Bajar sin control o abrir los codos a 90°."),
  "Press de pecho en máquina": A("Machine_Bench_Press", "Máquina", "Pecho y tríceps", "Más estable: puede ir pesado sin compañero.", ["Ajuste el asiento para que los agarres queden a la altura media del pecho.", "Empuje sin bloquear los codos.", "Regrese lento hasta sentir el estiramiento."], "Asiento muy alto: el hombro hace el trabajo."),
  "Flexiones": A("Pushups", "Sin máquina", "Pecho, tríceps y core", "Se hace en cualquier lado. Si salen fácil, póngase un disco en la espalda.", ["Manos un poco más anchas que los hombros, cuerpo recto.", "Baje el pecho casi al piso, codos a 45°.", "Empuje sin dejar caer la cadera."], "Cadera hundida o medias repeticiones."),
  "Press inclinado con barra": A("Barbell_Incline_Bench_Press_-_Medium_Grip", "Barra", "Parte alta del pecho", "El mismo ángulo, con barra.", ["Banco a 30°, agarre un poco más ancho que los hombros.", "Baje la barra a la parte alta del pecho.", "Empuje hacia arriba sin despegar los glúteos."], "Banco muy inclinado: trabaja más el hombro."),
  "Press inclinado en Smith": A("Smith_Machine_Incline_Bench_Press", "Máquina Smith", "Parte alta del pecho", "Guiado: más seguro si entrena solo.", ["Banco a 30° debajo de la barra.", "Baje a la parte alta del pecho.", "Empuje y trabe la barra al terminar."], "Banco mal ubicado: la barra baja al cuello."),
  "Aperturas inclinadas": A("Incline_Dumbbell_Flyes", "Mancuernas", "Parte alta del pecho", "Aísla el pecho alto si el press está ocupado.", ["Banco a 30°, mancuernas arriba con codos un poco doblados.", "Abra los brazos en arco hasta sentir el pecho.", "Cierre como si abrazara un árbol."], "Doblar mucho los codos: se vuelve un press."),
  "Fondos en banco": A("Bench_Dips", "Banco", "Tríceps y pecho", "Sin paralelas: solo un banco.", ["Manos en el borde del banco, piernas al frente.", "Baje doblando los codos hasta 90°.", "Empuje hasta estirar los brazos."], "Bajar demasiado: carga el hombro."),
  "Press cerrado": A("Close-Grip_Barbell_Bench_Press", "Barra", "Tríceps y pecho", "Tríceps con barra: se puede ir pesado y progresar fácil.", ["Agarre al ancho de los hombros, codos pegados.", "Baje la barra a la parte baja del pecho.", "Empuje con los tríceps."], "Agarre demasiado cerrado: lastima las muñecas."),
  "Fondos en máquina": A("Dip_Machine", "Máquina", "Tríceps y pecho", "Puede escoger el peso.", ["Siéntese con los agarres a los lados.", "Empuje hacia abajo hasta estirar los brazos.", "Suba lento hasta 90°."], "Encoger los hombros hacia las orejas."),
  "Aperturas con mancuernas": A("Dumbbell_Flyes", "Mancuernas", "Pecho", "Mismo movimiento, sin polea.", ["Acostado en banco plano, mancuernas arriba, codos un poco doblados.", "Abra en arco hasta sentir el pecho estirado.", "Cierre sin chocar las mancuernas."], "Bajar demasiado con mucho peso."),
  "Pec deck (mariposa)": A("Butterfly", "Máquina", "Pecho", "Muy estable, ideal para terminar el pecho.", ["Asiento con los agarres a la altura del pecho.", "Junte los brazos al frente apretando el pecho.", "Abra lento hasta sentir el estiramiento."], "Dejar que el peso jale los brazos atrás de golpe."),
  "Cruce en polea baja": A("Low_Cable_Crossover", "Polea", "Parte alta del pecho", "La misma polea pero desde abajo.", ["Poleas abajo, un paso adelante.", "Suba las manos al frente hasta la altura de los ojos.", "Baje lento."], "Jalar con los bíceps."),
  "Extensión con cuerda": A("Triceps_Pushdown_-_Rope_Attachment", "Polea", "Tríceps", "Misma polea, otro agarre.", ["Codos pegados al cuerpo.", "Empuje hacia abajo y separe la cuerda al final.", "Suba hasta 90°."], "Mover los codos."),
  "Patada de tríceps": A("Tricep_Dumbbell_Kickback", "Mancuerna", "Tríceps", "Solo necesita una mancuerna y un banco.", ["Apoyado en un banco, brazo pegado al cuerpo y codo a 90°.", "Estire el brazo hacia atrás.", "Vuelva lento sin mover el codo."], "Balancear el brazo."),
  "Extensión sobre la cabeza con mancuerna": A("Standing_Dumbbell_Triceps_Extension", "Mancuerna", "Tríceps (cabeza larga)", "Estira mucho el tríceps: muy buena para crecer.", ["Mancuerna con las dos manos detrás de la cabeza.", "Estire los brazos hacia el techo.", "Baje lento, codos apuntando al frente."], "Abrir los codos hacia los lados."),
  "Extensión sobre la cabeza en polea": A("Cable_Rope_Overhead_Triceps_Extension", "Polea", "Tríceps (cabeza larga)", "Lo más parecido al press francés.", ["De espaldas a la polea, cuerda detrás de la cabeza.", "Estire los brazos al frente y arriba.", "Regrese lento hasta sentir el tríceps."], "Mover los hombros en vez de los codos."),
  "Dominadas supinas": A("Chin-Up", "Barra", "Dorsal y bíceps", "Palmas hacia usted: un poco más fácil.", ["Agarre al ancho de los hombros, palmas hacia usted.", "Jale hasta pasar la barbilla.", "Baje controlado."], "Balancearse."),
  "Dominadas asistidas": A("Band_Assisted_Pull-Up", "Banda o máquina", "Dorsal y bíceps", "Si no le salen las repeticiones completas.", ["Banda en la barra y debajo de la rodilla, o máquina asistida.", "Jale hasta pasar la barbilla.", "Baje lento."], "Usar tanta ayuda que no cuesta."),
  "Jalón agarre neutro": A("V-Bar_Pulldown", "Polea", "Dorsal", "El jalón más amigable con el hombro.", ["Agarre en V, pecho afuera.", "Jale hasta el pecho llevando los codos abajo.", "Suba lento."], "Echarse muy atrás."),
  "Remo en polea sentado": A("Seated_Cable_Rows", "Polea", "Espalda media y dorsal", "Sin cargar la espalda baja.", ["Sentado, espalda recta, rodillas un poco dobladas.", "Jale hacia el ombligo apretando la espalda.", "Regrese estirando los brazos sin encorvarse."], "Balancear el torso."),
  "Remo en T": A("T-Bar_Row_with_Handle", "Barra T o máquina", "Espalda media", "El mismo remo, más estable.", ["Pecho afuera, torso inclinado.", "Jale el agarre hacia el pecho bajo.", "Baje controlado."], "Redondear la espalda."),
  "Remo con mancuernas en banco inclinado": A("Dumbbell_Incline_Row", "Mancuernas", "Espalda media", "El pecho apoyado: cero carga en la espalda baja.", ["Boca abajo en banco a 30°.", "Jale las mancuernas hacia la cadera.", "Apriete arriba y baje."], "Despegar el pecho del banco."),
  "Jalón agarre cerrado": A("Close-Grip_Front_Lat_Pulldown", "Polea", "Dorsal", "Mismo jalón, otro agarre.", ["Agarre cerrado, pecho afuera.", "Jale hasta el pecho.", "Suba lento."], "Jalar con los brazos y no con la espalda."),
  "Pullover en polea": A("Straight-Arm_Pulldown", "Polea", "Dorsal", "Aísla el dorsal sin bíceps.", ["De pie frente a la polea alta, brazos casi rectos.", "Lleve la barra hasta los muslos.", "Suba lento."], "Doblar los codos."),
  "Remo en polea a una mano": A("Seated_One-arm_Cable_Pulley_Rows", "Polea", "Dorsal", "Igual al remo con mancuerna, con polea.", ["Sentado, un brazo a la vez.", "Jale hacia la cadera.", "Estire el brazo al regresar."], "Girar el torso."),
  "Remo alto en máquina": A("Leverage_High_Row", "Máquina", "Espalda", "Estable, sin buscar mancuerna.", ["Pecho contra el apoyo.", "Jale los agarres hacia atrás.", "Regrese lento."], "Encoger los hombros."),
  "Remo invertido": A("Inverted_Row", "Barra o Smith", "Espalda y bíceps", "Con su peso corporal.", ["Debajo de una barra baja, cuerpo recto.", "Jale el pecho hacia la barra.", "Baje lento."], "Cadera caída."),
  "Curl con mancuernas": A("Dumbbell_Bicep_Curl", "Mancuernas", "Bíceps", "Lo mismo, con mancuernas.", ["Codos pegados.", "Suba girando la palma hacia arriba.", "Baje lento."], "Balancear el cuerpo."),
  "Curl en polea": A("Standing_Biceps_Cable_Curl", "Polea", "Bíceps", "Tensión constante en todo el recorrido.", ["De frente a la polea baja.", "Suba doblando los codos.", "Baje lento."], "Mover los codos al frente."),
  "Curl predicador": A("Preacher_Curl", "Banco predicador", "Bíceps", "No se puede hacer trampa.", ["Brazos apoyados en el cojín.", "Suba la barra sin despegar los brazos.", "Baje casi hasta estirar."], "Bajar de golpe al final."),
  "Curl martillo con cuerda": A("Cable_Hammer_Curls_-_Rope_Attachment", "Polea", "Bíceps y antebrazo", "Martillo en polea.", ["Cuerda en la polea baja, palmas mirándose.", "Suba sin girar las muñecas.", "Baje lento."], "Codos adelante."),
  "Curl martillo cruzado": A("Cross_Body_Hammer_Curl", "Mancuernas", "Braquial y antebrazo", "Variante del martillo.", ["Suba la mancuerna cruzando hacia el hombro contrario.", "Codo fijo.", "Alterne brazos."], "Girar el torso."),
  "Curl invertido": A("Reverse_Barbell_Curl", "Barra", "Antebrazo y braquial", "Trabaja lo mismo que el martillo.", ["Agarre la barra con palmas hacia abajo.", "Suba sin mover los codos.", "Baje lento."], "Usar mucho peso."),
  "Sentadilla goblet": A("Goblet_Squat", "Mancuerna", "Cuádriceps y glúteos", "Con una sola mancuerna, técnica más fácil.", ["Mancuerna pegada al pecho.", "Baje entre las piernas, torso recto.", "Suba empujando con los talones."], "Rodillas hacia adentro."),
  "Sentadilla en Smith": A("Smith_Machine_Squat", "Máquina Smith", "Cuádriceps y glúteos", "Guiada: puede ir pesado solo.", ["Pies un poco adelante de la barra.", "Baje hasta paralelo.", "Suba sin bloquear las rodillas."], "Pies muy atrás: carga las rodillas."),
  "Hack squat": A("Hack_Squat", "Máquina", "Cuádriceps", "Mucho cuádriceps sin cargar la espalda.", ["Espalda pegada al respaldo, pies al ancho de los hombros.", "Baje hasta 90° o más.", "Empuje sin bloquear."], "Despegar los talones."),
  "Peso muerto rumano con mancuernas": A("Stiff-Legged_Dumbbell_Deadlift", "Mancuernas", "Femorales y glúteos", "El mismo movimiento, con mancuernas.", ["Mancuernas al frente de los muslos, rodillas apenas dobladas.", "Cadera atrás, espalda recta, baje hasta sentir los femorales.", "Suba empujando la cadera."], "Redondear la espalda."),
  "Buenos días": A("Good_Morning", "Barra", "Femorales y espalda baja", "Mismo patrón de cadera, con barra en la espalda.", ["Barra en la espalda alta, rodillas un poco dobladas.", "Incline el torso llevando la cadera atrás.", "Suba apretando glúteos. Peso liviano."], "Mucho peso o espalda redonda."),
  "Pull through en polea": A("Pull_Through", "Polea", "Glúteos y femorales", "Patrón de cadera muy seguro.", ["De espaldas a la polea baja, cuerda entre las piernas.", "Cadera atrás con la espalda recta.", "Empuje la cadera al frente apretando glúteos."], "Jalar con los brazos."),
  "Sentadilla búlgara": A("Split_Squat_with_Dumbbells", "Mancuernas y banco", "Cuádriceps y glúteos", "Una pierna a la vez: trabaja mucho con poco peso.", ["Pie de atrás apoyado en un banco.", "Baje hasta que la rodilla de atrás casi toque el piso.", "Suba con la pierna de adelante."], "Pie de adelante muy cerca del banco."),
  "Extensión de cuádriceps": A("Leg_Extensions", "Máquina", "Cuádriceps", "Aísla el cuádriceps.", ["Rodilla alineada con el eje de la máquina.", "Estire las piernas y apriete arriba 1 segundo.", "Baje lento."], "Subir con impulso."),
  "Step-up con mancuernas": A("Dumbbell_Step_Ups", "Mancuernas y cajón", "Cuádriceps y glúteos", "Cambia las zancadas por subir a un cajón.", ["Un pie completo arriba del cajón.", "Suba empujando con esa pierna.", "Baje controlado."], "Impulsarse con la pierna de abajo."),
  "Zancada hacia atrás": A("Dumbbell_Rear_Lunge", "Mancuernas", "Cuádriceps y glúteos", "Más fácil para las rodillas.", ["Dé un paso largo hacia atrás.", "Baje hasta casi tocar la rodilla.", "Vuelva empujando con la pierna de adelante."], "Paso corto."),
  "Curl femoral sentado": A("Seated_Leg_Curl", "Máquina", "Femorales", "Igual, en otra máquina.", ["Rodillas alineadas con el eje, cojín arriba de los talones.", "Doble las rodillas hacia abajo.", "Suba lento."], "Mover la cadera."),
  "Curl femoral de pie": A("Standing_Leg_Curl", "Máquina", "Femorales", "Una pierna a la vez.", ["De pie en la máquina.", "Lleve el talón hacia el glúteo.", "Baje lento."], "Inclinar el torso."),
  "Pantorrilla sentado": A("Seated_Calf_Raise", "Máquina", "Pantorrilla (sóleo)", "Otra máquina de pantorrilla.", ["Cojín sobre los muslos, puntas en el borde.", "Baje los talones y suba al máximo.", "Pausa arriba."], "Rebotar."),
  "Pantorrilla en prensa": A("Calf_Press_On_The_Leg_Press_Machine", "Prensa", "Pantorrilla", "Use la prensa si está libre.", ["Puntas en el borde de la plataforma, piernas estiradas.", "Empuje con las puntas.", "Baje lento."], "Doblar las rodillas."),
  "Pantorrilla con mancuerna": A("Dumbbell_Seated_One-Leg_Calf_Raise", "Mancuerna", "Pantorrilla", "Solo una mancuerna y un escalón.", ["Sentado, mancuerna sobre la rodilla, punta en un escalón.", "Suba el talón al máximo.", "Baje lento."], "Recorrido corto."),
  "Press de hombro con mancuernas": A("Dumbbell_Shoulder_Press", "Mancuernas", "Hombros y tríceps", "El mismo empuje, sentado.", ["Sentado, mancuernas a la altura de las orejas.", "Empuje hacia arriba.", "Baje controlado."], "Arquear la espalda."),
  "Press de hombro en máquina": A("Machine_Shoulder_Military_Press", "Máquina", "Hombros", "Estable y seguro.", ["Agarres a la altura de los hombros.", "Empuje sin bloquear.", "Baje lento."], "Asiento muy bajo."),
  "Press Arnold": A("Arnold_Dumbbell_Press", "Mancuernas", "Hombros completos", "Trabaja también el hombro de adelante.", ["Mancuernas al frente con palmas hacia usted.", "Suba girando las palmas hacia afuera.", "Baje girando de vuelta."], "Ir muy rápido."),
  "Elevaciones laterales sentado": A("Seated_Side_Lateral_Raise", "Mancuernas", "Hombro lateral", "Sin poder hacer trampa con el cuerpo.", ["Sentado, mancuernas a los lados.", "Suba hasta la altura de los hombros.", "Baje lento."], "Subir con impulso."),
  "Elevación lateral en polea": A("Cable_Seated_Lateral_Raise", "Polea", "Hombro lateral", "Tensión constante.", ["Polea baja al lado contrario.", "Suba el brazo hacia el lado hasta el hombro.", "Baje lento."], "Encoger el hombro."),
  "Elevación lateral con banda": A("Lateral_Raise_-_With_Bands", "Banda", "Hombro lateral", "Se hace en cualquier lado.", ["Pise la banda.", "Suba los brazos hacia los lados.", "Baje lento."], "Banda muy dura."),
  "Pájaros en polea": A("Cable_Rear_Delt_Fly", "Polea", "Hombro posterior", "Lo mismo que el face pull, en polea cruzada.", ["Poleas a la altura de los hombros, cruzadas.", "Abra los brazos hacia atrás.", "Regrese lento."], "Jalar con la espalda."),
  "Pec deck invertido": A("Reverse_Machine_Flyes", "Máquina", "Hombro posterior", "Muy estable.", ["De frente al respaldo.", "Abra los brazos hacia atrás.", "Regrese lento."], "Mucho peso."),
  "Separación con banda": A("Band_Pull_Apart", "Banda", "Hombro posterior y espalda alta", "Sin máquina.", ["Banda al frente, brazos estirados.", "Separe las manos hasta tocar el pecho.", "Regrese lento."], "Doblar los codos."),
  "Pájaros con pecho apoyado": A("Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench", "Mancuernas", "Hombro posterior", "Cabeza apoyada: no se puede hacer trampa.", ["Inclinado con la frente en un banco.", "Abra los brazos.", "Baje lento."], "Jalar con la espalda."),
  "Crunch en polea": A("Cable_Crunch", "Polea", "Abdomen", "Le puede subir peso.", ["De rodillas frente a la polea alta, cuerda a los lados de la cabeza.", "Doble el torso hacia las rodillas con el abdomen.", "Suba lento."], "Jalar con los brazos."),
  "Crunch en máquina": A("Ab_Crunch_Machine", "Máquina", "Abdomen", "Estable.", ["Ajuste el asiento.", "Doble el torso con el abdomen.", "Regrese lento."], "Usar impulso."),
  "Bicicleta abdominal": A("Air_Bike", "Sin máquina", "Abdomen y oblicuos", "Sin máquina.", ["Boca arriba, manos en la cabeza.", "Lleve el codo a la rodilla contraria y alterne.", "Lento y controlado."], "Jalar el cuello."),
  "Elevación de rodillas en paralelas": A("Knee_Hip_Raise_On_Parallel_Bars", "Paralelas", "Abdomen bajo", "Más estable que colgado.", ["Apoyado en los antebrazos.", "Suba las rodillas al pecho.", "Baje lento."], "Balancearse."),
  "Elevación de piernas acostado": A("Flat_Bench_Lying_Leg_Raise", "Banco", "Abdomen bajo", "Sin barra.", ["Acostado en un banco, manos detrás de la cabeza agarrando el banco.", "Suba las piernas hasta 90°.", "Baje lento sin tocar."], "Arquear la espalda baja."),
  "Elevación de cadera acostado": A("Bent-Knee_Hip_Raise", "Piso", "Abdomen bajo", "La más fácil de las tres.", ["Boca arriba, rodillas dobladas.", "Suba la cadera del piso llevando las rodillas al pecho.", "Baje lento."], "Usar impulso.")
});
const ALT = {
  "Press de banca": ["Press de banca con mancuernas", "Press de pecho en máquina", "Flexiones"],
  "Press inclinado con mancuernas": ["Press inclinado con barra", "Press inclinado en Smith", "Aperturas inclinadas"],
  "Fondos": ["Fondos en máquina", "Press cerrado", "Fondos en banco"],
  "Aperturas en polea": ["Pec deck (mariposa)", "Aperturas con mancuernas", "Cruce en polea baja"],
  "Extensión de tríceps en polea": ["Extensión con cuerda", "Extensión sobre la cabeza con mancuerna", "Patada de tríceps"],
  "Press francés": ["Extensión sobre la cabeza en polea", "Extensión sobre la cabeza con mancuerna", "Press cerrado"],
  "Dominadas": ["Dominadas supinas", "Jalón agarre neutro", "Dominadas asistidas"],
  "Remo con barra": ["Remo en polea sentado", "Remo en T", "Remo con mancuernas en banco inclinado"],
  "Jalón al pecho": ["Jalón agarre cerrado", "Dominadas asistidas", "Pullover en polea"],
  "Remo con mancuerna": ["Remo en polea a una mano", "Remo alto en máquina", "Remo invertido"],
  "Curl con barra": ["Curl con mancuernas", "Curl en polea", "Curl predicador"],
  "Curl martillo": ["Curl martillo con cuerda", "Curl martillo cruzado", "Curl invertido"],
  "Sentadilla": ["Hack squat", "Sentadilla en Smith", "Sentadilla goblet"],
  "Peso muerto rumano": ["Peso muerto rumano con mancuernas", "Pull through en polea", "Hip thrust con barra"],
  "Prensa": ["Hack squat", "Sentadilla búlgara", "Extensión de cuádriceps"],
  "Zancadas": ["Sentadilla búlgara", "Zancada hacia atrás", "Step-up con mancuernas"],
  "Curl femoral": ["Curl femoral sentado", "Curl femoral de pie", "Peso muerto rumano con mancuernas"],
  "Pantorrilla": ["Pantorrilla en prensa", "Pantorrilla sentado", "Pantorrilla con mancuerna"],
  "Press militar": ["Press de hombro con mancuernas", "Press de hombro en máquina", "Press Arnold"],
  "Elevaciones laterales": ["Elevación lateral en polea", "Elevaciones laterales sentado", "Elevación lateral con banda"],
  "Face pull": ["Pájaros en polea", "Pec deck invertido", "Separación con banda"],
  "Pájaros (deltoide posterior)": ["Pec deck invertido", "Pájaros en polea", "Pájaros con pecho apoyado"],
  "Curl-up de McGill": ["Dead bug", "Plancha lateral", "Bird dog"],
  "Elevación de piernas colgado": ["Elevación de rodillas en paralelas", "Elevación de piernas acostado", "Elevación de cadera acostado"]
};
const altOf = (k) => hOf(k).alt || {};
function altChip(k, x) {
  const orig = x.orig || x.t; if (!ALT[orig]) return "";
  if (x.orig) return `<button type="button" class="altchip on" data-act="alt-open" data-ex="${esc(orig)}"><span class="ai">⇄</span><span><b>Cambiado</b><small>En lugar de ${esc(orig)} · tocar para cambiar o volver</small></span></button>`;
  return `<button type="button" class="altchip" data-act="alt-open" data-ex="${esc(orig)}"><span class="ai">⇄</span><span><b>¿Máquina ocupada?</b><small>Toque y le doy 3 opciones para el mismo músculo</small></span></button>`;
}
function openAltSheet(orig) {
  const k = S.hDate, cur = altOf(k)[orig] || orig, e0 = EXI[orig];
  const card = (n, isOrig) => {
    const e = EXI[n] || {};
    return `<button type="button" class="altcard${cur === n ? " cur" : ""}" data-act="alt-set" data-ex="${esc(orig)}" data-v="${esc(isOrig ? "" : n)}">
      <span class="altimg">${e.img ? `<img src="${exImg(e.img, 0)}" alt="" loading="lazy"><img src="${exImg(e.img, 1)}" alt="" loading="lazy">` : ""}</span>
      <span class="altt"><b>${esc(n)}</b>${e.eq ? `<i class="tg">${esc(e.eq)}</i>` : ""}<small>${esc(isOrig ? "El del plan" : e.why || e.m || "")}</small></span>
      <span class="altgo">${cur === n ? "Hoy" : "Usar"}</span></button>`;
  };
  openSheet(`<h3>Cambiar ${esc(orig)}</h3><p class="hint">Mismo músculo${e0 ? " (" + esc(e0.m.toLowerCase()) + ")" : ""}, mismas series y repeticiones. Solo cambia la máquina.</p>
    <div class="altlist">${ALT[orig].map((n) => card(n, false)).join("")}</div>
    ${cur !== orig ? `<div class="altback">${card(orig, true)}</div>` : ""}
    <p class="hnote">El cambio es solo para hoy. Sus pesos se guardan con el nombre del ejercicio que hizo, así "La vez pasada" no se mezcla.</p>
    <div class="acts"><button type="button" class="btn" data-act="close">Cerrar</button></div>`, { type: "alt", orig });
}
function setAlt(orig, v) {
  const k = S.hDate, alt = Object.assign({}, altOf(k));
  if (v) alt[orig] = v; else delete alt[orig];
  hSet(k, { alt });
  closeSheet(); render(); toast(v ? `Hoy: ${v} en lugar de ${orig}` : `De vuelta a ${orig}`);
}

/* ---------- PLAN v2 (desde el miércoles 25 nov 2026): torso / pierna, cada músculo 2 veces por semana ----------
   Base: Schoenfeld, Ogborn y Krieger (2016): entrenar cada músculo 2 veces por semana da más hipertrofia que 1;
   volumen de ≈10–20 series por músculo a la semana (Schoenfeld 2017; Pelland y cols. 2024);
   descansos > 60–90 s (Singer y cols. 2024); core sin flexión repetida (McGill, U. de Waterloo);
   días de pierna y circuito separados por 48 h. */
const V2_START = "2026-11-25";
const T2 = [
  TRAIN[0],
  { t: "Pierna A · fuerza", kind: "gym", ex: [["Sentadilla", "4 × 6–8"], ["Peso muerto rumano", "3 × 8"], ["Prensa", "3 × 10–12"], ["Curl femoral", "3 × 10–12"], ["Pantorrilla", "4 × 12–15"]], close: [{ id: "core", t: "Core · 10 min" }] },
  { t: "Torso A · pecho y espalda", kind: "gym", ex: [["Press de banca", "4 × 6–8"], ["Dominadas", "4 × 6–10"], ["Press inclinado con mancuernas", "3 × 8–10"], ["Remo con mancuerna", "3 × 10 por lado"], ["Elevaciones laterales", "3 × 12–15"], ["Extensión de tríceps en polea", "3 × 10–12"]], close: [{ id: "z2", t: "Zona 2 · 20 min", n: "Tope 140 lpm: bici o caminata en inclinación" }] },
  { t: "Circuito híbrido tipo Hyrox", kind: "gym", ex: [["Remo 500 m o bici 1 km", "4–5 rondas"], ["Zancadas con peso", "20"], ["Wall balls", "15"], ["Burpees", "10"], ["Cargadas con kettlebell", "10"]], note: "Ritmo controlado: la técnica manda sobre la velocidad. Descanse 2 min entre rondas. Si prefiere, cámbielo por intervalos.", close: [{ id: "core", t: "Core · 10 min" }] },
  { t: "Torso B · hombros y brazos", kind: "gym", ex: [["Press militar", "4 × 6–8"], ["Jalón al pecho", "3 × 10–12"], ["Fondos", "3 × 8–12"], ["Remo con barra", "3 × 8"], ["Face pull", "3 × 15"], ["Curl con barra", "3 × 8–10"], ["Press francés", "3 × 10–12"]], close: [{ id: "z2", t: "Zona 2 · 20 min", n: "Tope 140 lpm: bici o caminata en inclinación" }] },
  { t: "Pierna B · glúteo y abdomen", kind: "gym", ex: [["Hip thrust con barra", "4 × 8–10"], ["Sentadilla búlgara", "3 × 8–10 por pierna"], ["Curl femoral", "3 × 10–12"], ["Extensión de cuádriceps", "2 × 12–15"], ["Pantorrilla", "3 × 12–15"], ["Curl-up de McGill", "3 × 6 (10 s cada una)"], ["Elevación de piernas colgado", "3 × 10–12"]], close: [{ id: "mob15", t: "Movilidad · 15 min" }] },
  TRAIN[4]
];
const V1TO2 = { 0: 0, 1: 2, 2: 2, 3: 1, 4: 6, 5: 4, 6: 3 };   // sesión vieja → la parecida del plan nuevo
const PLAN_V1 = { T: TRAIN, prio: SESS_PRIO, why: SESS_WHY, tip: SESS_TIP, str: STR, legs: [3, 6] };
const PLAN_V2 = {
  T: T2, legs: [1, 3, 5],
  prio: [1, 2, 4, 5, 3, 6],   // si no caben todas: se cae primero la zona 2 larga y después el circuito
  why: { 6: "es la que menos afecta ganar músculo", 3: "el circuito es lo más fácil de soltar" },
  tip: {
    0: SESS_TIP[0],
    1: "Sentadilla primero, con energía. Profundidad hasta paralelo con la espalda neutra; si se redondea abajo, baje el peso.",
    2: "Banca y dominadas pesadas al inicio. Deje 1 o 2 repeticiones en reserva: el objetivo es progresar semana a semana, no llegar al fallo.",
    3: "Ritmo constante y técnica limpia en cada estación. Si la técnica se rompe, baje el ritmo: así no hay lesión.",
    4: "Press militar con glúteos y abdomen apretados, sin arquear la espalda. Los brazos al final, cuando el resto ya está hecho.",
    5: "Hip thrust: apriete el glúteo arriba 1 segundo. En la búlgara, pie de adelante lejos del banco para cuidar la rodilla.",
    6: SESS_TIP[4]
  },
  str: {
    0: STR[0],
    1: ["Flexor de cadera arrodillado", "Femoral sentado", "Glúteo en figura 4"],
    2: ["Pecho y hombro con palo", "Dorsal en la pared", "Tríceps detrás de la cabeza"],
    3: ["Flexor de cadera arrodillado", "Cuádriceps con pie en banco", "Postura del niño"],
    4: ["Hombro cruzado", "Bíceps de pie", "Dorsal en la pared"],
    5: ["Glúteo en figura 4", "Cuádriceps con pie en banco", "Pantorrilla en la pared"],
    6: STR[4]
  }
};
const verOf = (k) => (k >= V2_START ? PLAN_V2 : PLAN_V1);
Object.assign(EXI, {
  "Puente de glúteo con barra": { img: "Barbell_Glute_Bridge", eq: "Barra", m: "Glúteos", why: "Igual al hip thrust, desde el piso: no necesita banco.", how: ["Acostado boca arriba, barra sobre la cadera con almohadilla.", "Empuje la cadera hacia arriba apretando los glúteos.", "Baje controlado sin tocar del todo el piso."], err: "Empujar con la espalda baja en vez de con el glúteo." }
});
Object.assign(ALT, {
  "Hip thrust con barra": ["Puente de glúteo con barra", "Pull through en polea", "Peso muerto rumano con mancuernas"],
  "Sentadilla búlgara": ["Zancada hacia atrás", "Step-up con mancuernas", "Hack squat"],
  "Extensión de cuádriceps": ["Sentadilla goblet", "Hack squat", "Zancada hacia atrás"]
});

/* ---------- explicación de cardio, core y movilidad, y "lo cambié por otra actividad" ---------- */
const MOB_EX = [["Gato-vaca", "10 lentas, columna completa"], ["Rotación torácica en 4 apoyos", "8 por lado"], ["Cadera 90/90", "6 por lado"], ["Sentadilla profunda sostenida", "30–45 s, talones al piso"], ["Tobillo a la pared", "10 por lado, rodilla pasa la punta del pie"], ["Círculos de hombro con banda o palo", "10 adelante y 10 atrás"]];
const ITEM_INFO = {
  z2: { m: "Cardio suave para quemar grasa sin quitarle recuperación a las pesas.", how: ["Escoja uno: bici estática, elíptica o caminar rápido en la caminadora con inclinación de 8 a 12 %.", "Pulso entre 120 y 140 lpm. Prueba fácil: puede hablar en frases completas, pero no cantar.", "Si el pulso pasa de 140, baje la velocidad o la inclinación. Trotar casi siempre lo saca de zona 2."], err: "Ir demasiado rápido: deja de ser zona 2 y cansa para la sesión de mañana.", swap: true },
  int: { m: "El único cardio fuerte de la semana: mejora la condición y quema muchas calorías en poco tiempo.", how: ["Caliente 5 min suave.", "8 rondas: 1 min fuerte (casi al máximo, no puede hablar) y 2 min suave.", "Bici, remo o caminadora. En caminadora, mejor subir la inclinación que correr muy rápido."], err: "Hacer el minuto fuerte a medias: si puede hablar, no es fuerte.", swap: true },
  core: { m: "Abdomen y zona media firmes: protegen la espalda y ayudan a que se marque el abdomen.", how: ["Haga los 4 ejercicios en circuito, sin descanso entre uno y otro.", "Descanse 1 min al final de cada vuelta. Haga 3 vueltas; si solo tiene 10 minutos, haga 2.", "Toque cada ejercicio para ver cómo se hace."], err: "Hacerlo rápido y sin control. En el core manda la técnica.", list: () => CORE },
  mob: { m: "Prepara cadera, tobillo, columna y hombros para entrenar sin lesiones.", how: ["Hágala antes de la primera serie, sin peso.", "Movimientos lentos y controlados, respirando.", "Si algo duele, no fuerce: llegue hasta donde se sienta cómodo."], err: "Saltársela por apuro. Son los minutos que evitan una lesión.", list: () => MOB_EX },
  str: { m: "Al terminar, con el músculo caliente. Mejoran la flexibilidad y ayudan a soltar la tensión.", how: ["Haga mínimo 2 de los 3; si tiene tiempo, los 3.", "Sostenga cada uno 30 segundos por lado y repítalo 2 veces.", "Llegue hasta sentir tensión, nunca dolor, y respire lento. Sin rebotes."], err: "Rebotar o forzar hasta que duela. Estirar no previene lesiones por sí solo: lo que gana es movilidad.", list: () => verOf(S.hDate).str[sessOf(S.hDate)].map((n) => [n, "2 × 30 s por lado"]) },
  walk: { m: "Descanso activo: mueve la sangre y ayuda a recuperarse sin cansar.", how: ["Camine a un ritmo cómodo, puede ser afuera o en la caminadora.", "Puede hablar sin problema todo el tiempo.", "Ideal después de comer o al final de la tarde."], err: "Convertirlo en una caminata fuerte o en trote: hoy toca recuperar.", swap: true }
};
const infoKey = (id) => id === "str" ? "str" : /^z2/.test(id) ? "z2" : /^int/.test(id) ? "int" : /^core/.test(id) ? "core" : /^mob/.test(id) ? "mob" : /^walk/.test(id) ? "walk" : null;
function openItemInfo(id) {
  const k = S.hDate, x = trainItems(k).find((y) => y.id === id), key = infoKey(id), e = ITEM_INFO[key];
  if (!x || !e) return;
  const sw = (hOf(k).swap || {})[id];
  const tb = (a) => key === "str" ? timerBtn("str", a, "2 × 30 s") : HOLDS[a] ? timerBtn("hold", a, holdTxt(a)) : "";
  const list = e.list ? `<table class="htbl"><tbody>${e.list().map(([a, b]) => `<tr><td>${EXI[a] ? `<button type="button" class="exlink" data-act="ex-how" data-ex="${esc(a)}">${esc(a)} ›</button>` : esc(a)}<div>${tb(a)}</div></td><td>${esc(b)}</td></tr>`).join("")}</tbody></table>` : "";
  openSheet(`<h3>${esc(x.t)}</h3><p class="hint">${esc(e.m)}</p>${list}
    <ol class="hol exhow">${e.how.map((h) => `<li>${esc(h)}</li>`).join("")}</ol>
    <p class="exerr"><b>Error común:</b> ${esc(e.err)}</p>
    ${key !== "str" && itemSeq(x) ? `<div class="wtrow">${timerBtn("item", x.id, "Iniciar " + (/Intervalos/.test(x.t) ? "intervalos (29 min)" : fmtClock(itemSeq(x)[0].sec)))}</div>` : ""}
    ${e.swap ? `<div class="f"><label for="swT">${sw ? "Hoy lo cambió por" : "¿Hoy hace otra actividad en lugar de esto?"}</label><div class="row"><input id="swT" class="fi" maxlength="40" placeholder="Ej.: artes marciales, fútbol, natación" value="${esc(sw || "")}" style="flex:1"><button type="button" class="btn" data-act="sw-save" data-id="${esc(id)}">${sw ? "Guardar" : "Cambiar"}</button></div>${sw ? `<button type="button" class="exlink sm" data-act="sw-clear" data-id="${esc(id)}" style="margin-top:8px">Quitar el cambio</button>` : ""}</div>` : ""}
    <div class="acts"><button type="button" class="btn pri" data-act="close">Entendido</button></div>`, { type: "info", id });
}
function saveSwap(id, txt) {
  const k = S.hDate, h = hOf(k), swap = Object.assign({}, h.swap || {}), done = Object.assign({}, h.done || {});
  if (txt) { swap[id] = txt.slice(0, 40); done["t_" + id] = true; } else { delete swap[id]; delete done["t_" + id]; }
  hSet(k, { swap, done });
  closeSheet(); render(); toast(txt ? `Listo: hoy ${txt.toLowerCase()} en lugar de ${(trainItems(k).find((y) => y.id === id) || {}).t || "esto"}` : "Cambio quitado");
}

/* ---------- ENTRENAMIENTO ---------- */
function renderTrain() {
  const t = T();
  if (S.person !== "carlos") { $("v-train").innerHTML = noPlan(t.tabTrainLong); return; }
  const k = S.hDate, d = parseKey(k), wd = d.getDay(), six = sessOf(k), day = verOf(k).T[six], h = hOf(k), done = h.done || {};
  const sc0 = daySched(k), ag = blocksOf({ kind: "plan", date: k }).find((b) => b.id === "pl_gym"), sc = Object.assign({}, sc0, { gym: ag ? { s: ag.s, e: ag.e } : sc0.gym }), wi = weekInfo(k), deload = wi.cyc === 4 && daysBetween(PLAN_START, k) >= 0;
  const items = [];
  if (day.kind !== "rest") items.push(MOB);
  const alt = hOf(k).alt || {};
  (day.ex || []).forEach(([n, r], i) => items.push(alt[n] ? { id: "ex" + i, t: alt[n], r, orig: n } : { id: "ex" + i, t: n, r }));
  (day.items || []).forEach((x) => items.push(x));
  (day.close || []).forEach((x) => items.push(x));
  items.push(STR_ITEM);
  const nDone = items.filter((x) => done["t_" + x.id]).length;
  const xList = extrasOf(k).map((x) => {
    const ns = nSets(x.r), nOk = setsOf(k, x.t).filter((y) => y && y.ok).length;
    return `<li class="hl hasets${done["t_" + x.id] ? " ok" : ""}"><div class="htx"><b class="ht">${esc(x.t)}</b><span class="hr">${ns} series de ${esc(repGoal(x.r))} repeticiones · ${nOk}/${ns}</span>${x.n ? `<span class="hn">${esc(x.n)}</span>` : ""}</div><button type="button" class="eatx" data-act="x-del" data-id="${esc(x.xid)}" aria-label="Quitar ejercicio">×</button>${setsBlock(k, x, ns)}</li>`;
  }).join("");
  const list = items.map((x) => {
    const ns = nSets(x.r), rr = ns ? `${ns} series de ${repGoal(x.r)} repeticiones` : x.r;
    const nOk = ns ? setsOf(k, x.t).filter((y) => y && y.ok).length : 0;
    return `<li class="hl${done["t_" + x.id] ? " ok" : ""}${ns ? " hasets" : ""}">${exThumb(x)}<div class="htx"><b class="ht">${esc(x.t)}</b>${rr ? `<span class="hr">${esc(rr)}${ns ? ` · ${nOk}/${ns}` : ""}</span>` : ""}${x.n ? `<span class="hn">${esc(x.n)}</span>` : ""}${EXI[x.t] ? `<button type="button" class="exlink sm" data-act="ex-how" data-ex="${esc(x.t)}">Cómo se hace ›</button>` : infoKey(x.id) ? `<button type="button" class="exlink sm" data-act="it-info" data-id="${esc(x.id)}">${(h.swap || {})[x.id] ? "Cambiado por: " + esc(h.swap[x.id]) + " ›" : infoKey(x.id) === "core" ? "Qué ejercicios hacer ›" : infoKey(x.id) === "str" ? "Cuáles hoy: " + esc(verOf(k).str[six].slice(0, 2).join(", ").toLowerCase()) + "… ›" : infoKey(x.id) === "mob" ? "Qué movimientos hacer ›" : ITEM_INFO[infoKey(x.id)].swap ? "Cómo se hace · o cámbielo por otra actividad ›" : "Cómo se hace ›"}</button>` : ""}</div>${tick(!!done["t_" + x.id], "h-tick", `data-key="t_${x.id}"`, x.t)}${ns ? setsBlock(k, x, ns) : ""}${!ns && x.id !== "str" && !(h.swap || {})[x.id] && itemSeq(x) ? `<div class="wtrow">${timerBtn("item", x.id, /Intervalos/.test(x.t) ? "Iniciar intervalos (29 min, con aviso en cada cambio)" : "Iniciar " + fmtClock(itemSeq(x)[0].sec))}</div>` : ""}${altChip(k, x)}</li>`;
  }).join("");

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
    return `<button class="wtr${kk === k ? " cur" : ""}" data-act="h-day" data-k="${kk}"><b>${esc(t.wd[i])}</b><span>${esc(verOf(kk).T[sx].t)}${moved ? ` <em class="mv">cambiado</em>` : ""}${didTrain(kk) ? " ✓" : ""}</span></button>`;
  }).join("");

  $("v-train").innerHTML = `
    <h1>${esc(t.tabTrainLong)}</h1>
    <p class="sub">Semana ${wi.n} · bloque ${wi.cyc} de 4${sc.gym ? " · gym de " + esc(fmtTime(sc.gym.s)) + " a " + esc(fmtTime(sc.gym.e)) : ""}</p>
    ${dayPicker(k, "h-day")}
    ${advOnly(k)}
    ${pendBanner(k)}
    ${pendingSess(k).length && k === todayKey() ? "" : weekCard(k)}
    ${weekBar(k)}
    ${deload ? `<div class="base-banner" style="margin-top:14px"><p><b>Semana suave.</b> Quite 1 serie por ejercicio y baje el peso un 10 %. Es parte del plan: así se recupera y sigue subiendo.</p></div>` : ""}
    <div class="hhero">
      <div class="fastbox ${day.kind === "rest" ? "open" : "fast"}"><b>${esc(dayLabel(k))}: ${esc(day.t)}</b><span>${day.kind === "rest" ? "Día de descanso activo" : (sc.gym ? esc(fmtTime(sc.gym.s)) + (sc.slot === "am" ? " en ayunas" : " ya comido") + " · " : "") + "unos " + fmtDur(round5(dayProg(k).est))}</span></div>
      ${sessLine(k)}
      ${slotSeg(k)}
      ${dayBar(k)}
      ${day.note ? `<p class="hnote">${esc(day.note)}</p>` : ""}
      ${coachTip(k)}
    </div>
    <h2>Sesión <span class="cnt">${nDone}/${items.length}</span></h2>
    <div class="shead"><p class="hnote">Anote el peso y las repeticiones de cada serie y toque ✓. Si deja vacío, ✓ copia lo de la vez pasada. Cada ejercicio tiene su kg o lb, según la máquina. Al marcar ✓ arranca el descanso: 2:30 en los pesados, 1:30 en los demás. Toque la foto de un ejercicio para ver cómo se hace.</p>${unitSeg(k)}</div>
    <ul class="hlist2">${list}</ul>
    ${xList ? `<h2>Extra <span class="cnt">fuera del plan</span></h2><ul class="hlist2">${xList}</ul><p class="hnote">Extras del mismo músculo de hoy: máximo 2 o 3 series en total.</p>` : ""}
    <div class="row" style="margin-top:10px"><button type="button" class="btn" data-act="x-open">+ Agregar ejercicio extra</button></div>
    <h2>Chequeos de ${esc(dayLabel(k).toLowerCase())}</h2>
    <ul class="hlist2">${checks}</ul>
    <div class="tgt out" style="margin-top:12px"><div><small>Promedio de peso, esta semana</small><b>${avg != null ? esc(fmtNum(avg)) + " kg" : "—"}</b></div><div><small>Contra la semana pasada</small><b class="${diff == null ? "" : diff <= 0 ? "pos" : "neg"}">${diff != null ? (diff > 0 ? "+" : "") + esc(fmtNum(diff, 2)) + " kg" : "—"}</b></div><div><small>Cintura</small><b>${waist ? esc(fmtNum(waist.v)) + " cm" : "—"}</b></div><div><small>Meta</small><b>−0.25 a −0.5 kg/sem</b></div></div>
    <h2>Próximos chequeos</h2>
    <ul class="up">${up.join("")}</ul>
    <h2>La semana</h2>
    <div class="wtrs">${week}</div>
    <h2>Mis datos</h2>
    <div class="row exp"><button type="button" class="btn" data-act="tr-exp" data-v="csv">Descargar entrenos (Excel)</button><button type="button" class="btn" data-act="tr-exp" data-v="copy">Copiar entrenos</button></div>
    <p class="hnote">Todas las series con fecha, sesión, peso y repeticiones, para mandárselas a quien las necesite.</p>
    <h2>Guía</h2>
    <details class="hdet"><summary>Por qué este plan (la evidencia)</summary><ul class="hol">
      <li><b>Cada músculo 2 veces por semana:</b> el meta-análisis de Schoenfeld, Ogborn y Krieger (2016) encontró que entrenar un músculo 2 veces a la semana da más músculo que 1 vez. Por eso desde el 25 de noviembre la rutina es torso / pierna.</li>
      <li><b>≈ 10–20 series por músculo a la semana:</b> más series dan más músculo, hasta cierto punto (Schoenfeld 2017; Pelland y cols. 2024). El plan está en esa zona sin pasarse.</li>
      <li><b>1 o 2 repeticiones en reserva:</b> se progresa sin ir al fallo en los ejercicios pesados, que es donde más se rompe la técnica.</li>
      <li><b>Descansos de 1:30 a 2:30:</b> más de 60–90 s da más músculo (Singer, Schoenfeld y cols. 2024).</li>
      <li><b>Core sin abdominales tradicionales:</b> el Dr. Stuart McGill (U. de Waterloo) demostró que doblar la columna una y otra vez es el mecanismo de lesión de disco. Por eso el core es plancha lateral, bird dog, dead bug, pallof y curl-up de McGill.</li>
      <li><b>Nunca 2 días de pierna seguidos:</b> pierna A, circuito y pierna B quedan separados por 48 h para que el cuerpo recupere.</li>
      <li><b>Seguridad:</b> el entrenamiento con pesas tradicional es de las formas de ejercicio con menos lesiones (≈ 0.2–1 por cada 1,000 horas). Lo que más protege es la técnica, la progresión gradual y no entrenar con dolor.</li></ul></details>
    <details class="hdet"><summary>Cuánto descansar entre series (y por qué)</summary>
      <table class="htbl"><thead><tr><th>Tipo de ejercicio</th><th>Descanso</th></tr></thead><tbody>
      <tr><td>Básicos pesados: press de banca e inclinado, dominadas, remo con barra, sentadilla, peso muerto, prensa, fondos, press militar</td><td>2:30</td></tr>
      <tr><td>Aislamiento: aperturas, curls, extensiones, laterales, face pull</td><td>1:30</td></tr>
      <tr><td>Core</td><td>1:00</td></tr>
      <tr><td>Al cambiar de ejercicio</td><td>2:00</td></tr></tbody></table>
      <ul class="hol"><li><b>La evidencia:</b> la revisión más reciente de Schoenfeld y su equipo (2024) encontró que descansar más de 60 s da algo más de músculo, y que pasar de 90 s ya casi no cambia el resultado.</li>
      <li><b>Por qué 2:30 en los pesados:</b> no es que el músculo crezca más por descansar. Es para que mantenga el peso y las repeticiones en todas las series.</li>
      <li><b>El cronómetro</b> arranca solo cuando marca ✓ en una serie. Al terminar suena y vibra (el teléfono no puede estar en silencio). También lo puede arrancar con el botón ⏱ de cada ejercicio.</li></ul></details>
    <details class="hdet"><summary>Ejercicios extra con amigos</summary><ul class="hol"><li>Anótelos con "+ Agregar ejercicio extra": nombre, máquina y series. Quedan guardados con peso y repeticiones, y salen marcados como "(extra)" al descargar sus entrenos.</li>
      <li><b>Consejo de entrenador:</b> si el extra es del mismo músculo del día, máximo 2 o 3 series. Más que eso le quita recuperación para la sesión siguiente del plan.</li></ul></details>
    <details class="hdet"><summary>Core (4 ejercicios que protegen la columna)</summary><table class="htbl"><tbody>${CORE.map(([a, b]) => `<tr><td>${EXI[a] ? `<button type="button" class="exlink" data-act="ex-how" data-ex="${esc(a)}">${esc(a)} ›</button>` : esc(a)}</td><td>${esc(b)}</td></tr>`).join("")}</tbody></table></details>
    <details class="hdet"><summary>Cómo progresar</summary><ul class="hol">
      <li>Descanso entre series: 2:30 min en los básicos pesados (press, dominadas, remos, sentadilla, peso muerto, prensa, fondos), 1:30 min en los de aislamiento y 1 min en el core. Al cambiar de ejercicio, 2 min. El cronómetro arranca solo cuando marca ✓ en una serie.</li>
      <li>Al terminar todos los días: mínimo 2 estiramientos de 30 s por lado, 2 veces. La guía de la ACSM recomienda estirar a diario, sostener 10 a 30 s y repetir de 2 a 4 veces. Antes de entrenar va la movilidad, no estiramientos largos.</li>
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
