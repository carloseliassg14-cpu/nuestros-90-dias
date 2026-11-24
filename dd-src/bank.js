/* ------------------------------------------------------------------
   bank.js · Lectura de correos de BAC Credomatic y Banco Nacional (CR)
   Funciones puras: no tocan la red ni la página. Se prueban solas.
   © 2026 Carlos Salas González. Todos los derechos reservados.
------------------------------------------------------------------- */
const Bank = (() => {
  // Tarjetas propias de Carlos (solo últimos 4 dígitos, nunca el número completo)
  const OWN_CARDS = { "0699": "AMEX", "0235": "Mastercard", "3188": "Visa BN" };
  const OWNER_RE = /CARLOS\s+EL[IÍ]AS\s+SALAS/i;

  const MONTHS = { jan:1, ene:1, feb:2, mar:3, apr:4, abr:4, may:5, jun:6, jul:7, aug:8, ago:8, sep:9, set:9, oct:10, nov:11, dec:12, dic:12 };

  const pad = (n) => String(n).padStart(2, "0");

  // "10,000.00" -> 10000 · "3.259,80" -> 3259.8 · "13.09" -> 13.09
  function num(s) {
    s = String(s || "").trim();
    if (!s) return NaN;
    if (/,\d{2}$/.test(s) && s.indexOf(".") !== -1 && s.lastIndexOf(".") < s.lastIndexOf(",")) s = s.replace(/\./g, "").replace(",", ".");
    else if (/^\d{1,3}(\.\d{3})+,\d{2}$/.test(s)) s = s.replace(/\./g, "").replace(",", ".");
    else if (/^\d+,\d{2}$/.test(s)) s = s.replace(",", ".");
    else s = s.replace(/,/g, "");
    return Number(s);
  }

  function dateFrom(mon, day, year, hh, mm) {
    const m = MONTHS[String(mon).slice(0, 3).toLowerCase()];
    if (!m) return null;
    return { date: `${year}-${pad(m)}-${pad(day)}`, time: `${pad(hh)}:${pad(mm)}` };
  }

  const clean = (s) => String(s || "").replace(/\*/g, "").replace(/\s+/g, " ").trim();

  /**
   * msg: { id, subject, sender, plaintextBody, snippet, date }
   * Devuelve null si no es un comprobante de compra que se pueda leer.
   */
  function parse(msg) {
    if (!msg) return null;
    const subject = String(msg.subject || "");
    const sender = String(msg.sender || "");
    const body = String(msg.plaintextBody || msg.snippet || "");
    const isBAC = /baccredomatic/i.test(sender) || /Notificaci[oó]n de transacci[oó]n/i.test(subject);
    const isBN = /bncr\.fi\.cr/i.test(sender) || /Voucher Digital/i.test(subject);
    if (!isBAC && !isBN) return null;
    if (isBN && /OTP|Comprobaci[oó]n de Seguridad/i.test(subject)) return null;

    const out = { bank: isBAC ? "BAC" : "BN", holder: "", last4: "", merchant: "", currency: "", amount: NaN, date: "", time: "", type: "COMPRA" };

    if (isBAC) {
      const h = body.match(/Hola\s+([A-ZÁÉÍÓÚÑÜ][A-ZÁÉÍÓÚÑÜ ]+?)\s*(?:#|A continuaci|\||\n)/);
      if (h) out.holder = clean(h[1]);
      const c = body.match(/Comercio:\s*\|?\s*([^|\n]+?)\s*(?:\||\n)/);
      if (c) out.merchant = clean(c[1]);
      const a = body.match(/Monto:\s*\|?\s*([A-Z]{3})\s*([\d.,]+)/);
      if (a) { out.currency = a[1]; out.amount = num(a[2]); }
      const t = body.match(/Tipo de Transacci[oó]n:\s*\|?\s*([^|\n]+?)\s*(?:\||\n)/);
      if (t) out.type = clean(t[1]).toUpperCase();
      const f = body.match(/Fecha:\s*\|?\s*([A-Za-zÁÉÍÓÚáéíóú]{3})[a-záéíóú]*\.?\s+(\d{1,2}),?\s*(\d{4}),?\s*(\d{1,2}):(\d{2})/);
      if (f) Object.assign(out, dateFrom(f[1], f[2], f[3], f[4], f[5]) || {});
      if (!out.merchant) { const s = subject.match(/transacci[oó]n\s+(.+?)\s+\d{2}-\d{2}-\d{4}/i); if (s) out.merchant = clean(s[1]); }
      if (!out.date) { const s = subject.match(/(\d{2})-(\d{2})-(\d{4})\s*-\s*(\d{1,2}):(\d{2})/); if (s) { out.date = `${s[3]}-${s[2]}-${s[1]}`; out.time = `${pad(s[4])}:${s[5]}`; } }
    } else {
      const h = body.match(/se[ñn]or\(a\):\s*\*?\s*([A-ZÁÉÍÓÚÑÜ][A-ZÁÉÍÓÚÑÜ ]+?)\s*\*?\s*(?:\n|Reciba)/);
      if (h) out.holder = clean(h[1]);
      const k = body.match(/comprobante de\s*\*?\s*([A-ZÁÉÍÓÚÑ ]+?)\s*\*?\s*realizada/i);
      if (k) out.type = clean(k[1]).toUpperCase();
      const c = body.match(/realizada en\s*\*?(.+?)\*?\s+el\s+\*?\d/i);
      if (c) out.merchant = clean(c[1]);
      const a = body.match(/TOTAL:\s*([A-Z]{3})\s*([\d.,]+)/);
      if (a) { out.currency = a[1]; out.amount = num(a[2]); }
      const f = body.match(/([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),\s*(\d{4})\s*-\s*(\d{1,2}):(\d{2})/);
      if (f) Object.assign(out, dateFrom(f[1], f[2], f[3], f[4], f[5]) || {});
    }

    const card = body.match(/\*{3,}\s*(\d{4})/);
    if (card) out.last4 = card[1];
    if (out.currency === "CRC" || out.currency === "COL") out.currency = "CRC";
    if (!out.currency || !isFinite(out.amount) || !out.date) return null;
    if (/DEVOLUC|REVERS|ANULAC|CR[EÉ]DITO/.test(out.type)) out.amount = -Math.abs(out.amount);
    return out;
  }

  // ¿Es una compra de Carlos con una de sus tarjetas? (las extensiones de papá, Derek, Manfred y Yehudy quedan fuera)
  function isOwn(p) {
    if (!p) return false;
    const nameOk = OWNER_RE.test(p.holder || "");
    const cardOk = !!OWN_CARDS[p.last4];
    return nameOk && (cardOk || !p.last4);
  }

  // Sugerencia de categoría y destino según el comercio
  const RULES = [
    ["fuel", /\b(GAS|GASOLIN|PETROL|SERVICENTRO|DELTA|TEXACO|PUMA ENERGY|UNO ?PETROL|SHELL|GULF)\b|MI GAS/],
    ["market", /SUPER|MAXI|WALMART|PALI\b|MAS X MENOS|AUTO ?MERCADO|CARNICER|VERDULER|MARKET|PRICESMART|FRESH|MEGASUPER|PERIMERCADO|ABASTECEDOR|MINISUPER|FERIA/],
    ["food", /SODA|REST|SUBWAY|KFC|MCDONAL|PIZZA|CAFE|COFFEE|GUACAMOLE|BURGER|TACO|POLLO|STARBUCKS|SUSHI|PANADER|HELAD|BAR\b|WENDY|TACO BELL|SPOON|PIPS|BRUNCH|FOOD/],
    ["transport", /UBER|DIDI|INDRIVE|PEAJE|PARQUEO|PARKING|RITEVE|MARCHAMO|BUS\b|TAXI|AUTOPIST|GLOBOVIA/],
    ["subs", /CAPCUT|NETFLIX|SPOTIFY|APPLE|ITUNES|GOOGLE|ADOBE|SKOOL|CLAUDE|ANTHROPIC|OPENAI|CHATGPT|CANVA|ICLOUD|YOUTUBE|NOTION|PRIME|DISNEY|HBO|MICROSOFT|DROPBOX|FATHOM|CALENDLY|WINDSOR/],
    ["home", /TELECABLE|KOLBI|\bICE\b|CNFL|\bAYA\b|ASADA|LIBERTY|CLARO|MOVISTAR|ADMINISTRACION|COOPEGUANACASTE|ESPH|JASEC|ALQUILER/],
    ["travel", /LATAM|AVIANCA|COPA AIR|AIRBNB|BOOKING|HOTEL|VOLARIS|IBERIA|LUFTHANSA|CONDOR|JETBLUE|UNITED|AMERICAN AIR|EXPEDIA|HOSTEL|SANSA/],
    ["health", /FARMAC|CLINIC|HOSPITAL|LABORATORIO|LAB\b|DENT|OPTIC|MEDIC|FISIO/],
    ["sport", /GYM|FITNESS|BIKE|SPORT|DEPORT|DECATHLON|CROSSFIT/],
    ["clothes", /ZARA|H&M|NIKE|ADIDAS|PULL|BERSHKA|FOREVER|SHEIN|ROPA|TIENDA/],
    ["trading", /LUCID|TRADOVATE|NINJATRADER|RITHMIC|TOPSTEP|TRADINGVIEW|APEX/],
    ["shipping", /CORREOS DE COSTA RICA|CORREOS CR|\bDHL\b|FEDEX|AEROPOST|BOX ?CORP/],
  ];
  function guess(merchant) {
    const m = String(merchant || "").toUpperCase();
    let cat = "other";
    for (const [c, re] of RULES) if (re.test(m)) { cat = c; break; }
    let scope = "personal";
    if (/INSIDE ?506/.test(m) || cat === "shipping") scope = "biz";
    return { cat, scope };
  }

  return { parse, isOwn, guess, num, OWN_CARDS };
})();
if (typeof module !== "undefined") module.exports = Bank;
