/* Oddle – Schätz die Chance. Vanilla JS, keine Abhängigkeiten. */
(() => {
  'use strict';

  // ------------------------------------------------------------ Konstanten
  const QS = window.ODDLE_QUESTIONS || [];
  const BY_ID = Object.fromEntries(QS.map((q) => [q.id, q]));
  const LAUNCH = [2026, 11, 27];               // Oddle #1
  const PER_DAY = 5;
  const TRIALS = 10000;
  const BATCHES = 100;
  const SIM_MS = 3000;
  const BONUS = 20;
  const JOKER_COST = 20;
  const STORE = 'oddle:v1';
  const DEV = new URLSearchParams(location.search).has('dev');

  const CATS = {
    wuerfel:    { ic: '🎲', name: 'Würfel',         unit: 'Würfe' },
    karten:     { ic: '🃏', name: 'Karten',         unit: 'Mischungen' },
    muenzen:    { ic: '🪙', name: 'Münzen',         unit: 'Wurfserien' },
    geburtstag: { ic: '🎂', name: 'Geburtstage',    unit: 'Gruppen' },
    casino:     { ic: '🎰', name: 'Lotto & Casino', unit: 'Ziehungen' },
    alltag:     { ic: '☕', name: 'Alltag',         unit: 'Versuche' },
    paradox:    { ic: '🌀', name: 'Paradox',        unit: 'Versuche' },
  };

  // Index = Wochentag (0 = Sonntag)
  const THEMES = [
    { key: 'boss',    name: 'Boss-Sonntag',       sub: 'Vier Aufwärmfragen, zum Schluss eine verschachtelte Boss-Frage.', ic: ['👑', '🌀', '🎯'] },
    { key: 'wuerfel', name: 'Würfel-Montag',      sub: 'Heute rollen vor allem die Würfel.',                              ic: ['🎲', '🎲', '🎲'] },
    { key: 'karten',  name: 'Karten-Dienstag',    sub: 'Gemischt, gezogen, aufgedeckt: Kartenglück.',                     ic: ['🃏', '♠️', '♥️'] },
    { key: 'muenzen', name: 'Münz-Mittwoch',      sub: 'Kopf oder Zahl, und Serien, die keiner erwartet.',               ic: ['🪙', '🪙', '🪙'] },
    { key: 'alltag',  name: 'Alltags-Donnerstag', sub: 'Socken, Lifte, Geburtstage: Zufall im echten Leben.',            ic: ['☕', '🧦', '🎂'] },
    { key: 'paradox', name: 'Paradox-Freitag',    sub: 'Heute lügt das Bauchgefühl besonders gern.',                     ic: ['🌀', '🚪', '🐐'] },
    { key: 'casino',  name: 'Casino-Samstag',     sub: 'Lotto, Roulette und Pokerhände.',                                ic: ['🎰', '🎱', '🃏'] },
  ];
  const WEEKDAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

  const RANKS = [
    { min: 0,     name: 'Münzwerfer' },
    { min: 500,   name: 'Würfelroller' },
    { min: 1500,  name: 'Kartenzähler' },
    { min: 4000,  name: 'Buchmacher' },
    { min: 8000,  name: 'Statistiker' },
    { min: 15000, name: 'Orakel' },
  ];

  // Grössenordnungen für den Hinweis-Joker (in Prozent)
  const BANDS = [[0, 1], [1, 5], [5, 10], [10, 30], [30, 50], [50, 70], [70, 90], [90, 95], [95, 99], [99, 100]];

  // ------------------------------------------------------------ Hilfen
  const $ = (s, el = document) => el.querySelector(s);
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const pad2 = (n) => String(n).padStart(2, '0');
  const thin = (s) => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const comma = (v, d) => v.toFixed(d).replace('.', ',');
  const fmtGuess = (g) => (g < 5 || g > 95) ? comma(g, 1) : String(Math.round(g));
  const fmtTruth = (p) => { const v = p * 100; return (v < 1 || v > 99) ? comma(v, 2) : comma(v, 1); };
  const fmtFrac = (q) => (q.den.length <= 8 ? `${thin(q.num)}/${thin(q.den)}` : '');

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15;
    return h >>> 0;
  }

  // ------------------------------------------------------------ Datum
  let devOffset = 0;
  function todayParts() {
    const d = new Date();
    d.setDate(d.getDate() + devOffset);
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
  }
  const keyOf = ([y, m, d]) => `${y}-${pad2(m)}-${pad2(d)}`;
  const utc = ([y, m, d]) => Date.UTC(y, m - 1, d);
  const partsOfUtc = (u) => { const d = new Date(u); return [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()]; };
  const dayIndex = (p) => Math.round((utc(p) - utc(LAUNCH)) / 864e5);
  const weekday = (p) => new Date(utc(p)).getUTCDay();

  // ------------------------------------------------------------ Tagesplan
  // Deterministisch aus dem Datum: Jeden Tag 2 Fragen zum Wochenthema (sonntags 1 Boss-Frage am Schluss),
  // der Rest gemischt. Es kommen immer die am längsten nicht gespielten Fragen dran, Gleichstand entscheidet der Seed.
  const schedule = [];
  const lastUsed = {};
  function themePool(key) {
    switch (key) {
      case 'alltag': return QS.filter((q) => q.cat === 'alltag' || q.cat === 'geburtstag');
      case 'casino': return QS.filter((q) => q.cat === 'casino' || q.casino);
      case 'boss':   return QS.filter((q) => q.boss);
      default:       return QS.filter((q) => q.cat === key);
    }
  }
  function pickLRU(pool, n, d, taken) {
    return pool.filter((q) => !taken.has(q.id))
      .map((q) => ({ q, k: q.id in lastUsed ? lastUsed[q.id] : -1e9, h: hash(d + ':' + q.id) }))
      .sort((a, b) => a.k - b.k || a.h - b.h)
      .slice(0, n).map((x) => x.q);
  }
  function daySet(idx) {
    for (let d = schedule.length; d <= idx; d++) {
      const theme = THEMES[weekday(partsOfUtc(utc(LAUNCH) + d * 864e5))];
      const taken = new Set();
      const themed = pickLRU(themePool(theme.key), theme.key === 'boss' ? 1 : 2, d, taken);
      themed.forEach((q) => taken.add(q.id));
      const rest = pickLRU(QS, PER_DAY - themed.length, d, taken);
      let order = themed.concat(rest).sort((a, b) => hash('o' + d + a.id) - hash('o' + d + b.id));
      if (theme.key === 'boss') { order = order.filter((q) => q !== themed[0]); order.push(themed[0]); }
      order.forEach((q) => { lastUsed[q.id] = d; });
      schedule.push(order.map((q) => q.id));
    }
    return schedule[idx];
  }

  // ------------------------------------------------------------ Spielstand
  function defaults() {
    return { v: 1, days: {}, settings: { sound: true, vibe: true, expert: false }, seenHelp: false };
  }
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE));
      if (!raw || raw.v !== 1) return defaults();
      const d = defaults();
      return { ...d, ...raw, settings: { ...d.settings, ...(raw.settings || {}) } };
    } catch (e) { return defaults(); }
  }
  const S = load();
  function save() { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { /* privat-Modus */ } }

  let activeKey = null;     // laufender Tag bleibt aktiv, auch wenn um Mitternacht gespielt wird
  function ctx() {
    let p = todayParts();
    if (activeKey && S.days[activeKey] && S.days[activeKey].started && !S.days[activeKey].done) {
      p = activeKey.split('-').map(Number);
    }
    const key = keyOf(p);
    const idx = Math.max(0, dayIndex(p));
    let day = S.days[key];
    if (!day || !day.ids || day.ids.length !== PER_DAY || day.ids.some((id) => !BY_ID[id])) {
      day = { n: idx + 1, ids: daySet(idx).slice(), answers: [], cur: 0, joker: -1, started: false, done: false };
      S.days[key] = day;
    }
    return { key, p, idx, day, theme: THEMES[weekday(p)] };
  }

  // ------------------------------------------------------------ Wertung
  const logit = (p) => Math.log(p / (1 - p));
  function score(g, t) {
    const s = clamp(g / 100, 0.001, 0.999);
    const dist = Math.abs(logit(s) - logit(t));
    const base = Math.round(Math.max(0, 100 - 25 * dist));
    const tol = (t < 0.05 || t > 0.95) ? 0.2 : 1;
    const hit = Math.abs(g - t * 100) <= tol + 1e-9;
    return { base, hit, dist };
  }
  function tier(a) {
    if (a.hit) return 6;
    if (a.base >= 80) return 5;
    if (a.base >= 65) return 4;
    if (a.base >= 45) return 3;
    if (a.base >= 20) return 2;
    return 1;
  }
  const EMOJI = { 6: '🎯', 5: '🟩', 4: '🟩', 3: '🟨', 2: '🟧', 1: '🟥' };
  const TIER_COLOR = { 6: 'var(--yellow)', 5: 'var(--green)', 4: '#9bd96a', 3: 'var(--yellow)', 2: 'var(--orange)', 1: 'var(--red)' };
  const dayTotal = (day) => day.answers.reduce((s, a) => s + (a ? a.pts : 0), 0);

  // ------------------------------------------------------------ Regler-Abbildung
  // Position 0..1000. 0–150: 0,1–5 % (Feinmodus), 150–850: 5–95 % in 1er-Schritten, 850–1000: 95–99,9 % (Feinmodus).
  function posToVal(p) {
    if (p <= 150) return Math.round(1 + (p / 150) * 49) / 10;
    if (p < 850) return Math.round(5 + ((p - 150) / 700) * 90);
    return Math.round(950 + ((p - 850) / 150) * 49) / 10;
  }
  function valToPos(v) {
    if (v <= 5) return ((v * 10 - 1) / 49) * 150;
    if (v < 95) return 150 + ((v - 5) / 90) * 700;
    return 850 + ((v * 10 - 950) / 49) * 150;
  }
  function stepVal(v, dir) {
    const s = dir < 0 ? ((v <= 5 || v > 95) ? 0.1 : 1) : ((v < 5 || v >= 95) ? 0.1 : 1);
    return clamp(Math.round((v + dir * s) * 10) / 10, 0.1, 99.9);
  }
  const isFine = (v) => v < 5 || v > 95;

  // ------------------------------------------------------------ Ton & Vibration
  const Sound = (() => {
    let ac = null, master = null, noiseBuf = null, lastTick = 0;
    function ctxA() {
      if (!S.settings.sound) return null;
      if (!ac) {
        const C = window.AudioContext || window.webkitAudioContext;
        if (!C) return null;
        ac = new C();
        master = ac.createGain();
        master.gain.value = 0.22;
        master.connect(ac.destination);
      }
      if (ac.state === 'suspended') ac.resume();
      return ac;
    }
    function tone(f, dur, type = 'square', vol = 0.3, when = 0, slide = 0) {
      const c = ctxA(); if (!c) return;
      const t = c.currentTime + when;
      const o = c.createOscillator(), g = c.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(f * slide, t + dur);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + dur + 0.02);
    }
    function noise(when, dur, vol, freq) {
      const c = ctxA(); if (!c) return;
      if (!noiseBuf) {
        noiseBuf = c.createBuffer(1, c.sampleRate * 0.6, c.sampleRate);
        const d = noiseBuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      const s = c.createBufferSource(); s.buffer = noiseBuf;
      const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 0.8;
      const g = c.createGain();
      const t = c.currentTime + when;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(f); f.connect(g); g.connect(master);
      s.start(t); s.stop(t + dur + 0.02);
    }
    return {
      tick(v) {
        const now = performance.now();
        if (now - lastTick < 30) return;
        lastTick = now;
        tone(360 + v * 9, 0.028, 'square', 0.1);
      },
      click() { tone(660, 0.05, 'square', 0.14); tone(990, 0.04, 'square', 0.1, 0.04); },
      rattle() { for (let i = 0; i < 6; i++) noise(i * 0.07, 0.04, 0.25, 2200 + Math.random() * 1500); },
      drum(ms) {
        const n = Math.floor(ms / 42);
        for (let i = 0; i < n; i++) noise(i * 0.042, 0.05, 0.08 + 0.32 * (i / n), i % 2 ? 260 : 210);
        noise(ms / 1000, 0.55, 0.55, 3000);
        tone(120, 0.35, 'triangle', 0.5, ms / 1000, 0.5);
      },
      bull() {
        [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.15, 'square', 0.18, i * 0.075));
        tone(2093, 0.55, 'triangle', 0.16, 0.4);
      },
      good() { tone(523, 0.12, 'square', 0.16); tone(784, 0.22, 'square', 0.16, 0.1); },
      meh() { tone(440, 0.14, 'square', 0.14); tone(415, 0.22, 'square', 0.14, 0.12); },
      bad() { tone(300, 0.2, 'sawtooth', 0.12, 0, 0.6); tone(190, 0.32, 'sawtooth', 0.12, 0.16, 0.6); },
    };
  })();
  function vibe(ms) { if (S.settings.vibe && navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) { /* egal */ } } }

  // ------------------------------------------------------------ Simulation (Web Worker mit Rückfall)
  let worker = null, workerOk = true, reqId = 0;
  const pending = new Map();
  function simulate(q) {
    return new Promise((resolve) => {
      const local = () => resolve(window.OddleSim.run(q.sim, TRIALS, BATCHES));
      if (workerOk && window.Worker && location.protocol !== 'file:') {
        try {
          if (!worker) {
            worker = new Worker('js/sim-worker.js?v=1');
            worker.onmessage = (e) => {
              const job = pending.get(e.data.id);
              if (!job) return;
              pending.delete(e.data.id);
              clearTimeout(job.to);
              if (e.data.ok) job.resolve(e.data.res); else job.fail();
            };
            worker.onerror = () => {
              workerOk = false;
              pending.forEach((job) => { clearTimeout(job.to); job.fail(); });
              pending.clear();
            };
          }
          const id = ++reqId;
          const to = setTimeout(() => { if (pending.delete(id)) { workerOk = false; local(); } }, 5000);
          pending.set(id, { resolve, fail: local, to });
          worker.postMessage({ id, code: q.sim, trials: TRIALS, batches: BATCHES });
          return;
        } catch (e) { workerOk = false; }
      }
      setTimeout(local, 0);
    });
  }

  // ------------------------------------------------------------ Szenen
  const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
  const dieHTML = (v, sm) => `<div class="die${sm ? ' sm' : ''}${v === 6 ? ' six' : ''}">${
    Array.from({ length: 9 }, (_, i) => `<i class="${PIPS[v].includes(i) ? 'on' : ''}"></i>`).join('')}</div>`;
  const RANKN = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'B', 'D', 'K'];
  const SUITS = ['♥', '♦', '♠', '♣'];
  const PEOPLE = ['🧑', '👩', '👨', '🧒', '👵', '👴', '👧', '👦', '🧔', '👱'];
  const rint = (n) => Math.floor(Math.random() * n);

  function drawScene(el, sc) {
    const delay = (i, step) => `style="animation-delay:${i * step}ms"`;
    if (sc.t === 'dice') {
      const sm = sc.n > 5;
      el.innerHTML = Array.from({ length: sc.n }, () => dieHTML(1 + rint(6), sm)).join('');
      const dice = [...el.querySelectorAll('.die')];
      dice.forEach((d) => d.classList.add('rolling'));
      Sound.rattle();
      let k = 0;
      const iv = setInterval(() => {
        k++;
        dice.forEach((d) => {
          const v = 1 + rint(6);
          d.className = `die${sm ? ' sm' : ''}${v === 6 ? ' six' : ''}${k < 9 ? ' rolling' : ''}`;
          d.innerHTML = Array.from({ length: 9 }, (_, i) => `<i class="${PIPS[v].includes(i) ? 'on' : ''}"></i>`).join('');
        });
        if (k >= 9) clearInterval(iv);
      }, 95);
    } else if (sc.t === 'coins') {
      const sm = sc.n > 6;
      el.innerHTML = Array.from({ length: sc.n }, (_, i) => {
        const k = Math.random() < 0.5;
        return `<div class="coin flip${sm ? ' sm' : ''}${k ? '' : ' z'}" ${delay(i, 60)}>${k ? 'K' : 'Z'}</div>`;
      }).join('');
    } else if (sc.t === 'cards') {
      const deck = Array.from({ length: 52 }, (_, i) => i).sort(() => Math.random() - 0.5).slice(0, sc.n);
      el.innerHTML = deck.map((c, i) => {
        const s = (c / 13) | 0;
        return `<div class="pcard${s < 2 ? ' red' : ''}" ${delay(i, 90)}>${RANKN[c % 13]}<span>${SUITS[s]}</span></div>`;
      }).join('');
    } else if (sc.t === 'lotto') {
      const nums = [];
      while (nums.length < sc.n) { const x = 1 + rint(49); if (!nums.includes(x)) nums.push(x); }
      el.innerHTML = nums.sort((a, b) => a - b).map((x, i) => `<div class="ball" ${delay(i, 140)}>${x}</div>`).join('');
    } else if (sc.t === 'roulette') {
      el.innerHTML = `<div class="wheel" style="--r:${rint(360)}deg"><b></b></div>`;
    } else if (sc.t === 'people') {
      const dense = sc.n > 12;
      el.innerHTML = `<div class="ppl${dense ? ' dense' : ''}">${
        Array.from({ length: sc.n }, (_, i) => `<span ${delay(i, 25)}>${PEOPLE[rint(PEOPLE.length)]}</span>`).join('')
      }<span ${delay(sc.n, 25)}>🎂</span></div>`;
    } else {
      const items = sc.i || ['❔'];
      const sm = items.length > 5;
      el.innerHTML = items.map((x, i) => `<span class="emo${sm ? ' sm' : ''}" ${delay(i, 80)}>${x}</span>`).join('');
    }
  }

  // ------------------------------------------------------------ Rendering
  const app = $('#app');
  let draft = 50;           // aktueller Reglerwert der laufenden Frage
  let draftFor = null;
  let animToken = 0;
  let countdownTimer = null;

  function render() {
    clearInterval(countdownTimer);
    animToken++;
    const c = ctx();
    renderStrip(c);
    if (c.day.done) return renderSummary(c);
    if (!c.day.started) return renderIntro(c);
    activeKey = c.key;
    renderQuestion(c);
  }

  function streakInfo() {
    const p = todayParts();
    const done = new Set(Object.keys(S.days).filter((k) => S.days[k].done));
    let t = utc(p);
    if (!done.has(keyOf(partsOfUtc(t)))) t -= 864e5;
    let cur = 0;
    while (done.has(keyOf(partsOfUtc(t)))) { cur++; t -= 864e5; }
    const us = [...done].map((k) => utc(k.split('-').map(Number))).sort((a, b) => a - b);
    let best = 0, run = 0, prev = null, goodRun = 0, perfect = false;
    for (const u of us) {
      const consecutive = prev !== null && u - prev === 864e5;
      run = consecutive ? run + 1 : 1;
      best = Math.max(best, run);
      const good = dayTotal(S.days[keyOf(partsOfUtc(u))]) >= 400;
      goodRun = good ? (consecutive ? goodRun + 1 : 1) : 0;
      if (goodRun >= 7) perfect = true;
      prev = u;
    }
    return { cur, best, perfect };
  }

  function renderStrip(c) {
    const st = streakInfo();
    const [, m, d] = c.p;
    $('#strip').innerHTML =
      `<span><b>Oddle #${c.day.n}</b> · ${WEEKDAYS[weekday(c.p)]}, ${d}.${m}.</span>` +
      `<span class="flame${st.cur ? '' : ' off'}" title="Tage in Folge">🔥 ${st.cur}</span>`;
  }

  function renderIntro(c) {
    const th = c.theme;
    app.innerHTML = `
      <section class="card intro">
        <div class="kicker">Fünf Zufallsfragen, für alle dieselben</div>
        <div class="icons">${th.ic.map((x) => `<span>${x}</span>`).join('')}</div>
        <div class="theme">Heute: ${th.name}</div>
        <p class="theme-sub">${th.sub}</p>
        <button class="btn block" id="go">Los geht's</button>
        <ul class="rules">
          <li><span class="n">1</span><span><b>Schätzen:</b> Schieb den Regler auf deine Schätzung. Unter 5 % und über 95 % geht er in Zehntelschritten.</span></li>
          <li><span class="n">2</span><span><b>Einloggen:</b> 10 000 simulierte Versuche regnen ins Histogramm, dann rastet der exakte Wert ein.</span></li>
          <li><span class="n">3</span><span><b>Punkte:</b> bis 100 pro Frage, Volltreffer +20. Gewertet auf der Log-Odds-Skala: 1 % statt 2 % zählt so viel wie 40 % statt 60 %.</span></li>
        </ul>
      </section>`;
    $('#go').onclick = () => {
      Sound.click();
      c.day.started = true;
      activeKey = c.key;
      save();
      render();
    };
  }

  function progressHTML(day) {
    return `<div class="progress">${day.ids.map((_, i) => {
      const a = day.answers[i];
      const cls = a ? 's' + tier(a) : (i === day.cur ? 'cur' : '');
      return `<i class="${cls}"></i>`;
    }).join('')}</div>`;
  }

  function renderQuestion(c) {
    const { day } = c;
    const q = BY_ID[day.ids[day.cur]];
    const cat = CATS[q.cat];
    app.innerHTML = `
      <section class="card qcard">
        ${progressHTML(day)}
        <div class="qhead">
          <span class="chip">${cat.ic} ${cat.name}</span>
          <span class="qno">${q.boss && c.theme.key === 'boss' && day.cur === PER_DAY - 1 ? '👑 BOSS · ' : ''}Frage ${day.cur + 1}/${PER_DAY}</span>
        </div>
        <div class="scene" id="scene" role="img" aria-label="Szenario-Animation, antippen zum Wiederholen"></div>
        <p class="qtext">${q.q}</p>
        <div id="stage"></div>
      </section>`;
    const scene = $('#scene');
    drawScene(scene, q.scene);
    scene.onclick = () => drawScene(scene, q.scene);

    const ans = day.answers[day.cur];
    if (ans) runReveal(c, q, ans, false);
    else renderGuess(c, q);
  }

  function renderGuess(c, q) {
    const { day } = c;
    if (draftFor !== q.id) { draft = 50; draftFor = q.id; }
    const expert = S.settings.expert;
    const jokerHere = day.joker === day.cur;
    const jokerUsedElsewhere = day.joker >= 0 && !jokerHere;
    const ticks = expert ? '' : [[0.1, '0'], [5, '5'], [25, '25'], [50, '50'], [75, '75'], [95, '95'], [99.9, '100']]
      .map(([v, l]) => `<span style="left:${valToPos(v) / 10}%">${l}</span>`).join('');
    $('#stage').innerHTML = `
      <div class="guess">
        <div class="gval${expert ? ' expert' : ''}" id="gval"></div>
        <div class="gmode" id="gmode"></div>
        <div class="slider-row">
          <button class="step-btn" id="minus" aria-label="Schätzung verringern">−</button>
          <div class="track-wrap">
            <div class="track-inner">
              <div class="track-bg"><div class="track-fill" id="fill"></div></div>
              <div class="track-hint" id="hintband" hidden></div>
              <div class="track-ticks">${ticks}</div>
            </div>
            <input type="range" class="range" id="range" min="0" max="1000" step="1" aria-label="Deine Schätzung in Prozent">
          </div>
          <button class="step-btn" id="plus" aria-label="Schätzung erhöhen">+</button>
        </div>
        <div class="hintline" id="hintline"></div>
        <div class="actions">
          <button class="btn ghost joker" id="joker" ${jokerHere || jokerUsedElsewhere ? 'disabled' : ''}
            title="Hinweis-Joker: zeigt die Grössenordnung, kostet 20 Punkte. Einmal pro Tag.">💡 ${jokerUsedElsewhere ? 'weg' : '−20'}</button>
          <button class="btn" id="lock">Einloggen</button>
        </div>
      </div>`;

    const range = $('#range'), gval = $('#gval'), gmode = $('#gmode'), fill = $('#fill');
    let lastDecade = Math.floor(draft / 10);
    function show(fromPos) {
      if (!fromPos) range.value = String(Math.round(valToPos(draft)));
      const pos = +range.value;
      fill.style.width = (pos / 10) + '%';
      gval.innerHTML = expert ? '?' : `${fmtGuess(draft)}<small>%</small>`;
      gmode.innerHTML = expert ? 'Experten-Modus: nur die Position zählt'
        : (isFine(draft) ? '<span class="fine">Feinmodus</span> · Zehntelschritte' : 'Ganze Prozent');
      range.setAttribute('aria-valuetext', `${fmtGuess(draft)} Prozent`);
      const dec = Math.floor(draft / 10);
      if (dec !== lastDecade) { vibe(8); lastDecade = dec; }
    }
    function setVal(v) {
      if (v === draft) return;
      draft = v;
      Sound.tick(v);
      show(false);
    }
    range.addEventListener('input', () => {
      const v = posToVal(+range.value);
      if (v !== draft) { draft = v; Sound.tick(v); }
      show(true);
    });
    range.addEventListener('keydown', (e) => {
      const keys = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 };
      if (e.key in keys) { e.preventDefault(); setVal(stepVal(draft, keys[e.key])); }
      else if (e.key === 'PageUp' || e.key === 'PageDown') {
        e.preventDefault();
        const dir = e.key === 'PageUp' ? 1 : -1;
        setVal(isFine(draft) ? stepVal(draft, dir) : clamp(Math.round(draft + dir * 10), 5, 95));
      } else if (e.key === 'Home') { e.preventDefault(); setVal(0.1); }
      else if (e.key === 'End') { e.preventDefault(); setVal(99.9); }
      else if (e.key === 'Enter') { e.preventDefault(); lock(); }
    });
    // Gedrückt halten wiederholt
    function holdBtn(btn, dir) {
      let t1 = null, t2 = null;
      const stop = () => { clearTimeout(t1); clearInterval(t2); };
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        setVal(stepVal(draft, dir));
        t1 = setTimeout(() => { t2 = setInterval(() => setVal(stepVal(draft, dir)), 70); }, 380);
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, stop));
      btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setVal(stepVal(draft, dir)); } });
    }
    holdBtn($('#minus'), -1);
    holdBtn($('#plus'), 1);

    function showHint() {
      const v = q.p * 100;
      const band = BANDS.find(([, hi]) => v < hi) || BANDS[BANDS.length - 1];
      const hb = $('#hintband');
      const a = valToPos(Math.max(0.1, band[0])), b = valToPos(Math.min(99.9, band[1]));
      hb.style.left = (a / 10) + '%';
      hb.style.width = ((b - a) / 10) + '%';
      hb.hidden = false;
      $('#hintline').textContent = `💡 Hinweis: zwischen ${band[0]} und ${band[1]} %`;
    }
    if (jokerHere) showHint();
    $('#joker').onclick = () => {
      if (day.joker >= 0) return;
      day.joker = day.cur;
      save();
      Sound.click();
      $('#joker').disabled = true;
      showHint();
    };

    function lock() {
      if (day.answers[day.cur]) return;
      const g = draft;
      const sc = score(g, q.p);
      const joker = day.joker === day.cur;
      const pts = Math.max(0, sc.base + (sc.hit ? BONUS : 0) - (joker ? JOKER_COST : 0));
      const ans = { id: q.id, g, base: sc.base, hit: sc.hit, joker, pts };
      day.answers[day.cur] = ans;
      save();
      Sound.click();
      vibe(15);
      runReveal(c, q, ans, true);
    }
    $('#lock').onclick = lock;
    show(false);
  }

  // ------------------------------------------------------------ Auflösung mit Histogramm
  function runReveal(c, q, ans, animate) {
    const token = animToken;
    const unit = CATS[q.cat].unit;
    $('#stage').innerHTML = `
      <div class="simbox">
        <div class="counter">
          <div class="big" id="cnt">…</div>
          <div class="n" id="cntn">Simulation startet …</div>
        </div>
        <canvas class="histo" id="histo" aria-label="Histogramm der Simulation"></canvas>
        <div class="simlegend">
          <span><i style="background:var(--p-400)"></i>je ${thin(TRIALS / BATCHES)} ${unit}</span>
          <span><i style="background:var(--orange)"></i>dein Tipp</span>
          <span><i style="background:var(--cream)"></i>exakter Wert</span>
        </div>
      </div>
      <div id="res"></div>`;
    if (animate) Sound.drum(SIM_MS);
    simulate(q).then((res) => {
      if (token !== animToken) return;
      drawHisto(q, ans, res, animate, token, () => {
        if (token !== animToken) return;
        showResult(c, q, ans, res, animate);
      });
    });
  }

  function drawHisto(q, ans, res, animate, token, done) {
    const cv = $('#histo');
    const cnt = $('#cnt'), cntn = $('#cntn');
    const unit = CATS[q.cat].unit;
    const dpr = window.devicePixelRatio || 1;
    const W = cv.clientWidth || 320, H = cv.clientHeight || 210;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    const g2 = cv.getContext('2d');
    g2.scale(dpr, dpr);

    const per = res.per, t = q.p, g = ans.g / 100;
    const rates = res.batches.map((h) => h / per);
    const sd = Math.sqrt(t * (1 - t) / per);
    let lo = Math.min(g, t - 4 * sd, ...rates), hi = Math.max(g, t + 4 * sd, ...rates);
    let span = Math.max(hi - lo, 0.04);
    const mid = (lo + hi) / 2;
    lo = mid - span / 2 - span * 0.07; hi = mid + span / 2 + span * 0.07;
    if (lo < 0) { hi = Math.min(1, hi - lo); lo = 0; }
    if (hi > 1) { lo = Math.max(0, lo - (hi - 1)); hi = 1; }

    const L = 12, R = 12, T = 40, B = 24;
    const pw = W - L - R, ph = H - T - B;
    const xOf = (r) => L + ((r - lo) / (hi - lo)) * pw;

    // Klassen: diskret (jede mögliche Trefferzahl eine Säule) oder 36 gleich breite Klassen
    const discrete = (hi - lo) * per <= 36;
    const keyOf2 = (r) => discrete ? Math.round(r * per) : clamp(Math.floor(((r - lo) / (hi - lo)) * 36), 0, 35);
    const cx = (k) => discrete ? xOf(k / per) : xOf(lo + ((k + 0.5) * (hi - lo)) / 36);
    const bw = discrete ? Math.min(26, (pw / ((hi - lo) * per)) * 0.78) : Math.max(3, (pw / 36) * 0.84);
    const stacks = new Map();
    const blocks = rates.map((r) => {
      const k = keyOf2(r);
      const s = stacks.get(k) || 0;
      stacks.set(k, s + 1);
      return { k, s };
    });
    const maxS = Math.max(...stacks.values());
    const bh = Math.min(12, ph / maxS);

    const fmtAxis = (r) => comma(r * 100, span < 0.06 ? 1 : 0) + ' %';
    function frame(now, released, landedFrac) {
      g2.clearRect(0, 0, W, H);
      // Achse
      g2.strokeStyle = 'rgba(168,220,217,.35)'; g2.lineWidth = 1;
      g2.beginPath(); g2.moveTo(L, T + ph + 0.5); g2.lineTo(L + pw, T + ph + 0.5); g2.stroke();
      g2.fillStyle = '#9cc3c3'; g2.font = '11px Rubik, system-ui, sans-serif'; g2.textBaseline = 'top';
      for (let i = 0; i <= 4; i++) {
        const r = lo + ((hi - lo) * i) / 4;
        const x = xOf(r);
        g2.textAlign = i === 0 ? 'left' : i === 4 ? 'right' : 'center';
        g2.fillText(fmtAxis(r), x, T + ph + 6);
        g2.fillRect(x - 0.5, T + ph, 1, 4);
      }
      // Blöcke
      for (let i = 0; i < released; i++) {
        const b = blocks[i];
        const target = T + ph - (b.s + 1) * bh;
        let y = target;
        const age = now - i * (2500 / BATCHES);
        if (animate && age < 380) { const k = clamp(age / 380, 0, 1); y = (T - 20) + (target - (T - 20)) * k * k; }
        const x = cx(b.k) - bw / 2;
        g2.fillStyle = rates[i] === 0 && t < 0.05 ? '#1a7683' : '#2f8f9b';
        g2.fillRect(x, y, bw, Math.max(1, bh - (bh > 3 ? 1 : 0)));
      }
      // Tipp
      const xg = xOf(g);
      g2.fillStyle = '#ff8a1f';
      g2.fillRect(xg - 1.5, T - 4, 3, ph + 4);
      label(`Du: ${fmtGuess(ans.g)} %`, xg, 4, '#ff8a1f', '#062a31');
      // Exakter Wert
      if (landedFrac >= 1) {
        const xt = xOf(t);
        g2.fillStyle = '#f5efe2';
        g2.fillRect(xt - 1, T - 4, 2, ph + 4);
        label(`Exakt: ${fmtTruth(t)} %`, xt, 21, '#f5efe2', '#062a31');
      }
    }
    function label(text, x, y, bg, fg) {
      g2.font = '600 12px Rubik, system-ui, sans-serif';
      const w = g2.measureText(text).width + 12;
      const lx = clamp(x - w / 2, 2, W - w - 2);
      g2.fillStyle = bg;
      roundRect(lx, y, w, 16, 5); g2.fill();
      g2.fillStyle = fg; g2.textAlign = 'left'; g2.textBaseline = 'middle';
      g2.fillText(text, lx + 6, y + 8.5);
      g2.textBaseline = 'top';
    }
    function roundRect(x, y, w, h, r) {
      g2.beginPath();
      g2.moveTo(x + r, y); g2.arcTo(x + w, y, x + w, y + h, r); g2.arcTo(x + w, y + h, x, y + h, r);
      g2.arcTo(x, y + h, x, y, r); g2.arcTo(x, y, x + w, y, r); g2.closePath();
    }
    function counterAt(n) {
      let hits = 0;
      for (let i = 0; i < n; i++) hits += res.batches[i];
      const trials = n * per;
      cnt.textContent = trials ? `${comma((hits / trials) * 100, 1)} %` : '0,0 %';
      cntn.innerHTML = `${thin(trials)} / ${thin(res.trials)}<br>${unit}`;
    }
    function finish() {
      frame(1e9, BATCHES, 1);
      cnt.textContent = `${fmtTruth(t)} %`;
      cnt.classList.add('snap');
      const est = res.hits / res.trials;
      cntn.innerHTML = `Simulation ${comma(est * 100, est < 0.01 ? 2 : 1)} %<br>exakter Wert`;
      done();
    }
    if (!animate) { counterAt(BATCHES); finish(); return; }
    const t0 = performance.now();
    function loop(now) {
      if (token !== animToken) return;
      const el = now - t0;
      const released = Math.min(BATCHES, Math.floor(el / (2500 / BATCHES)) + 1);
      counterAt(released);
      if (el >= SIM_MS) { finish(); return; }
      frame(el, released, 0);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  function showResult(c, q, ans, res, animate) {
    const { day } = c;
    const tr = tier(ans);
    const over = ans.g / 100 > q.p;
    const sc = score(ans.g, q.p);
    const factor = Math.exp(sc.dist);
    const pp = Math.abs(ans.g - q.p * 100);
    const frac = fmtFrac(q);
    const verdict = ans.hit
      ? 'Bullseye! Dein Bauchgefühl liegt goldrichtig.'
      : `Du hast ${over ? 'überschätzt' : 'unterschätzt'}: ${comma(pp, pp < 1 ? 2 : 1)} Prozentpunkte daneben, Faktor ${factor >= 10 ? thin(Math.round(factor)) : comma(factor, 1)} in den Odds.`;
    const last = day.cur >= PER_DAY - 1;
    $('#res').innerHTML = `
      <div class="result">
        <div class="pts">
          <div class="num" style="color:${TIER_COLOR[tr]}">+${ans.pts}</div>
          <div class="lbl">Punkte${ans.hit || ans.joker ? ` (Grundwert ${ans.base})` : ''}</div>
          <div class="tags">
            ${ans.hit ? `<span class="chip bull">🎯 Volltreffer +${BONUS}</span>` : ''}
            ${ans.joker ? `<span class="chip">💡 Hinweis −${JOKER_COST}</span>` : ''}
          </div>
        </div>
        <div class="cmp">
          <div class="you"><small>Dein Tipp</small><b>${fmtGuess(ans.g)} %</b></div>
          <div><small>Exakt</small><b>${fmtTruth(q.p)} %</b>${frac ? `<span class="frac"> = ${frac}</span>` : ''}</div>
        </div>
        <div class="verdict">${verdict}</div>
        <details class="how"><summary>Rechenweg</summary><p>${q.how}</p></details>
        <button class="btn block" id="next">${last ? 'Tagesergebnis' : 'Nächste Frage'} →</button>
      </div>`;
    // Fortschrittsbalken aktualisieren
    const prog = $('.progress');
    if (prog) prog.outerHTML = progressHTML(day);
    if (animate) {
      if (ans.hit) { Sound.bull(); confetti(); vibe([20, 40, 20, 40, 60]); }
      else if (tr >= 4) Sound.good();
      else if (tr >= 3) Sound.meh();
      else Sound.bad();
      $('#res').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    const next = $('#next');
    next.onclick = () => {
      Sound.click();
      day.cur++;
      if (day.cur >= PER_DAY) { day.done = true; day.total = dayTotal(day); activeKey = null; }
      save();
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    if (animate) next.focus({ preventScroll: true });
  }

  // ------------------------------------------------------------ Tagesergebnis
  function stats() {
    let points = 0, hits = 0, answered = 0, paradox = 0, played = 0, playedPts = 0;
    for (const k of Object.keys(S.days)) {
      const d = S.days[k];
      for (const a of d.answers) {
        if (!a) continue;
        answered++; points += a.pts;
        if (a.hit) hits++;
        if (BY_ID[a.id] && BY_ID[a.id].cat === 'paradox' && a.base >= 80) paradox++;
      }
      if (d.done) { played++; playedPts += dayTotal(d); }
    }
    const st = streakInfo();
    let rank = RANKS[0], next = null;
    for (let i = 0; i < RANKS.length; i++) if (points >= RANKS[i].min) { rank = RANKS[i]; next = RANKS[i + 1] || null; }
    return { points, hits, answered, paradox, played, avg: played ? Math.round(playedPts / played) : 0, rank, next, ...st };
  }

  function shareText(c) {
    const { day } = c;
    const em = day.answers.map((a) => EMOJI[tier(a)]).join('');
    const st = streakInfo();
    return `Oddle #${day.n} ${em} ${dayTotal(day)}/${PER_DAY * 100}${day.joker >= 0 ? ' 💡' : ''}\n` +
      `${c.theme.name}${st.cur > 1 ? ` · 🔥${st.cur}` : ''}\n` +
      'oddle.dicele.io';
  }

  function renderSummary(c) {
    const { day } = c;
    const total = dayTotal(day);
    const s = stats();
    app.innerHTML = `
      <section class="card summary">
        <div class="no">Oddle #${day.n} · ${c.theme.name}</div>
        <div class="total">${total}<small>/${PER_DAY * 100}</small></div>
        <div class="emojis">${day.answers.map((a) => EMOJI[tier(a)]).join('')}</div>
        <div class="rank">Rang <b>${s.rank.name}</b> · ${thin(s.points)} Punkte gesamt</div>
        <div class="share-row">
          <button class="btn" id="share">Teilen</button>
          <button class="btn ghost" id="sumstats">Statistik</button>
        </div>
        <ul class="qlist">
          ${day.answers.map((a, i) => {
            const q = BY_ID[a.id];
            return `<li data-i="${i}" role="button" tabindex="0" title="Rechenweg anzeigen">
              <span>${CATS[q.cat].ic}</span>
              <span class="t">${q.q}</span>
              <span class="s" style="color:${TIER_COLOR[tier(a)]}">${a.pts}<small>${fmtGuess(a.g)} → ${fmtTruth(q.p)} %</small></span>
            </li>`;
          }).join('')}
        </ul>
        <div class="next">Neue Fragen in<b id="countdown">--:--:--</b></div>
      </section>`;
    $('#share').onclick = () => share(shareText(c));
    $('#sumstats').onclick = openStats;
    app.querySelectorAll('.qlist li').forEach((li) => {
      const open = () => {
        const a = day.answers[+li.dataset.i];
        const q = BY_ID[a.id];
        const frac = fmtFrac(q);
        openModal(`${CATS[q.cat].ic} Rechenweg`, `
          <p><b>${q.q}</b></p>
          <p>Dein Tipp: <b>${fmtGuess(a.g)} %</b> · exakt: <b>${fmtTruth(q.p)} %</b>${frac ? ` (${frac})` : ''} · ${a.pts} Punkte</p>
          <p>${q.how}</p>`);
      };
      li.onclick = open;
      li.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } };
    });
    const tick = () => {
      const now = new Date();
      now.setDate(now.getDate() + devOffset);
      const mid = new Date(now); mid.setHours(24, 0, 0, 0);
      const ms = mid - now;
      if (ms <= 0 || keyOf(todayParts()) !== c.key) { render(); return; }
      const h = Math.floor(ms / 36e5), m = Math.floor((ms % 36e5) / 6e4), sec = Math.floor((ms % 6e4) / 1000);
      const el = $('#countdown');
      if (el) el.textContent = `${pad2(h)}:${pad2(m)}:${pad2(sec)}`;
    };
    tick();
    countdownTimer = setInterval(tick, 1000);
  }

  async function share(text) {
    const coarse = window.matchMedia && matchMedia('(pointer: coarse)').matches;
    if (navigator.share && coarse) {
      try { await navigator.share({ text }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    try {
      await navigator.clipboard.writeText(text);
      toast('Ergebnis kopiert!');
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast('Ergebnis kopiert!'); } catch (e2) { toast('Kopieren nicht möglich'); }
      ta.remove();
    }
  }

  // ------------------------------------------------------------ Modals
  const modal = $('#modal');
  let lastFocus = null;
  function openModal(title, html) {
    lastFocus = document.activeElement;
    $('#modal-title').innerHTML = title;
    $('#modal-body').innerHTML = html;
    modal.hidden = false;
    $('#modal-x').focus();
  }
  function closeModal() {
    modal.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('#modal-x').onclick = closeModal;
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  function openHelp() {
    openModal('So geht Oddle', `
      <p>Jeden Tag gibt es <b>fünf Zufallsfragen</b>, für alle dieselben. Schätz, wie wahrscheinlich das Ereignis ist, und log dich ein. Dann laufen <b>10 000 simulierte Versuche</b> durchs Histogramm und der exakte Wert aus der Kombinatorik rastet ein.</p>
      <ul>
        <li><b>Regler:</b> Unter 5 % und über 95 % schaltet er in den <b>Feinmodus</b> mit Zehntelschritten. Feinjustieren mit − / + oder den Pfeiltasten.</li>
        <li><b>Wertung:</b> Punkte = max(0, 100 − 25 · |logit(Tipp) − logit(Wahrheit)|). Auf der Log-Odds-Skala zählt «1 % statt 2 %» so viel wie «40 % statt 60 %», seltene Ereignisse sind also nicht geschenkt.</li>
        <li><b>Volltreffer:</b> ±1 Prozentpunkt (unter 5 % und über 95 %: ±0,2) bringt <b>+20</b>.</li>
        <li><b>Hinweis-Joker 💡:</b> einmal pro Tag, zeigt die Grössenordnung (z. B. «zwischen 10 und 30 %») und kostet 20 Punkte.</li>
      </ul>
      <p><b>Themen der Woche</b></p>
      <div class="days">
        <span>Mo</span><span>Würfel-Montag</span>
        <span>Di</span><span>Karten-Dienstag</span>
        <span>Mi</span><span>Münz-Mittwoch</span>
        <span>Do</span><span>Alltags-Donnerstag</span>
        <span>Fr</span><span>Paradox-Freitag</span>
        <span>Sa</span><span>Casino-Samstag</span>
        <span>So</span><span>Boss-Sonntag mit verschachtelter Boss-Frage</span>
      </div>
      <p>Neue Fragen um Mitternacht (lokale Zeit). Dein Spielstand bleibt in diesem Browser, ohne Anmeldung und ohne Server.</p>`);
  }

  function openStats() {
    const s = stats();
    const prog = s.next ? clamp((s.points - s.rank.min) / (s.next.min - s.rank.min), 0, 1) : 1;
    const badges = [
      { ic: '🔥', name: '7-Tage-Streak', txt: '7 Tage in Folge gespielt', on: s.best >= 7 },
      { ic: '🎯', name: '10 Volltreffer', txt: `${Math.min(s.hits, 10)}/10 Volltreffer`, on: s.hits >= 10 },
      { ic: '🌀', name: 'Paradox-Jäger', txt: `${Math.min(s.paradox, 5)}/5 Paradoxe mit 80+ Punkten`, on: s.paradox >= 5 },
      { ic: '🏆', name: 'Perfekte Woche', txt: '7 Tage in Folge je 400+ Punkte', on: s.perfect },
    ];
    openModal('Statistik', `
      <div class="stats-grid">
        <div><b>${s.played}</b><small>Tage</small></div>
        <div><b>${s.cur}</b><small>Streak</small></div>
        <div><b>${s.best}</b><small>Bester</small></div>
        <div><b>${s.avg}</b><small>Ø pro Tag</small></div>
      </div>
      <p>Rang: <b>${s.rank.name}</b> · ${thin(s.points)} Punkte · ${s.hits} Volltreffer</p>
      <div class="rankbar"><i style="width:${prog * 100}%"></i></div>
      <p style="font-size:13px;margin-top:2px">${s.next ? `Noch ${thin(s.next.min - s.points)} Punkte bis <b>${s.next.name}</b>` : 'Höchster Rang erreicht. Du bist das Orakel.'}</p>
      <p><b>Ränge:</b> ${RANKS.map((r) => r.name).join(' → ')}</p>
      <div class="badges">${badges.map((b) => `
        <div class="badge${b.on ? ' on' : ''}"><span class="ic">${b.ic}</span><span><b>${b.name}</b>${b.txt}</span></div>`).join('')}
      </div>`);
  }

  function openSettings() {
    const rows = [
      ['sound', 'Ton', 'Chiptune-Ticks, Trommelwirbel, Bullseye'],
      ['vibe', 'Vibration', 'Auf dem Handy bei jedem 10-%-Schritt'],
      ['expert', 'Experten-Modus', 'Regler ohne Zahl und Raster: nur die Position zählt'],
    ];
    openModal('Einstellungen', rows.map(([k, t, d]) => `
      <div class="toggle"><span>${t}<small>${d}</small></span>
        <button class="switch" role="switch" data-k="${k}" aria-checked="${!!S.settings[k]}" aria-label="${t}"></button></div>`).join(''));
    $('#modal-body').querySelectorAll('.switch').forEach((b) => {
      b.onclick = () => {
        const k = b.dataset.k;
        S.settings[k] = !S.settings[k];
        b.setAttribute('aria-checked', String(S.settings[k]));
        save();
        if (k === 'sound' && S.settings.sound) Sound.click();
        if (k === 'expert' && $('#range')) {
          const c = ctx();
          renderGuess(c, BY_ID[c.day.ids[c.day.cur]]);
        }
      };
    });
  }

  $('#btn-help').onclick = openHelp;
  $('#btn-stats').onclick = openStats;
  $('#btn-settings').onclick = openSettings;

  // ------------------------------------------------------------ Toast & Konfetti
  let toastT = null;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(() => { t.hidden = true; }, 1800);
  }

  function confetti() {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = $('#confetti');
    const dpr = window.devicePixelRatio || 1;
    const W = innerWidth, H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    const g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cols = ['#ff8a1f', '#ffd24a', '#f5efe2', '#2f8f9b', '#4fd18b'];
    const ps = Array.from({ length: 150 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * 160, y: H * 0.42,
      vx: (Math.random() - 0.5) * 15, vy: -Math.random() * 15 - 5,
      w: 6 + Math.random() * 6, h: 4 + Math.random() * 4,
      r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
      c: cols[(Math.random() * cols.length) | 0],
    }));
    let f = 0;
    (function step() {
      g.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.vy += 0.42; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        g.save(); g.translate(p.x, p.y); g.rotate(p.r);
        g.fillStyle = p.c; g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        g.restore();
      }
      if (++f < 150) requestAnimationFrame(step); else g.clearRect(0, 0, W, H);
    })();
  }

  // ------------------------------------------------------------ Dev-Werkzeuge (?dev=1)
  if (DEV) {
    const dev = $('#dev');
    dev.hidden = false;
    const draw = () => {
      dev.innerHTML = `<span>${keyOf(todayParts())}</span>
        <button data-a="prev">◀ Tag</button><button data-a="next">Tag ▶</button>
        <button data-a="reset">Heute neu</button><button data-a="wipe">Alles löschen</button>`;
    };
    dev.addEventListener('click', (e) => {
      const a = e.target.dataset && e.target.dataset.a;
      if (!a) return;
      if (a === 'prev') devOffset--;
      if (a === 'next') devOffset++;
      if (a === 'reset') delete S.days[keyOf(todayParts())];
      if (a === 'wipe') { Object.keys(S.days).forEach((k) => delete S.days[k]); }
      activeKey = null; draftFor = null;
      save(); draw(); render();
    });
    draw();
    window.oddle = { S, ctx, daySet, score, posToVal, valToPos, render, QS };
  }

  render();
  if (!S.seenHelp) { S.seenHelp = true; save(); }
})();
