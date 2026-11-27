/* Oddle – Simulationskern.
 * Läuft im Web Worker (sim-worker.js), als Rückfall im Hauptthread und in tools/check.html.
 * Eine Frage liefert in "sim" einen Funktionsrumpf, der pro Versuch true/false zurückgibt
 * (oder null, wenn die Bedingung der Frage nicht erfüllt ist – der Versuch zählt dann nicht).
 */
(function (root) {
  'use strict';

  const rnd = Math.random;
  const int = (n) => Math.floor(rnd() * n);
  const die = () => 1 + int(6);
  const coin = () => rnd() < 0.5;            // true = Kopf (bzw. Junge)
  const rank = (c) => c % 13;                // 0 = Ass, 10 = Bube, 11 = Dame, 12 = König
  const suit = (c) => (c / 13) | 0;          // 0 = Herz

  function perm(n) {
    const a = new Array(n);
    for (let i = 0; i < n; i++) a[i] = i;
    for (let i = n - 1; i > 0; i--) {
      const j = int(i + 1);
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // k verschiedene Zahlen aus 1..n (partielles Fisher-Yates)
  function sample(n, k) {
    const a = new Array(n);
    for (let i = 0; i < n; i++) a[i] = i + 1;
    for (let i = 0; i < k; i++) {
      const j = i + int(n - i);
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a.slice(0, k);
  }

  // k verschiedene Karten 0..51
  const hand = (k) => sample(52, k).map((x) => x - 1);

  function distinct(arr) {
    for (let i = 0; i < arr.length; i++)
      for (let j = i + 1; j < arr.length; j++)
        if (arr[i] === arr[j]) return false;
    return true;
  }

  // Häufigkeiten von f(x), absteigend sortiert, z. B. [3,1,1]
  function counts(arr, f) {
    const m = new Map();
    for (const x of arr) { const k = f(x); m.set(k, (m.get(k) || 0) + 1); }
    return [...m.values()].sort((a, b) => b - a);
  }

  const HELPERS = { rnd, int, die, coin, rank, suit, perm, sample, hand, distinct, counts };
  const NAMES = Object.keys(HELPERS);
  const VALUES = NAMES.map((k) => HELPERS[k]);

  function compile(code) {
    const f = new Function(...NAMES, '"use strict";\n' + code);
    return () => f(...VALUES);
  }

  /* Führt `trials` gültige Versuche aus, aufgeteilt in `batches` gleich grosse Pakete.
   * Rückgabe: { hits, trials, batches: [Treffer je Paket], attempts } */
  function run(code, trials, batches) {
    trials = trials || 10000;
    batches = batches || 100;
    const per = Math.ceil(trials / batches);
    const trial = compile(code);
    const out = new Array(batches).fill(0);
    let hits = 0, valid = 0, attempts = 0;
    const cap = trials * 400;
    while (valid < per * batches && attempts < cap) {
      attempts++;
      const r = trial();
      if (r === null || r === undefined) continue;
      if (r) { hits++; out[(valid / per) | 0]++; }
      valid++;
    }
    return { hits, trials: valid, per, batches: out, attempts };
  }

  root.OddleSim = { run, compile, HELPERS };
})(typeof self !== 'undefined' ? self : this);
