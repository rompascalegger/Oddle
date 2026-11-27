/* Oddle – Web Worker: rechnet die 10 000 Versuche, damit die Animation flüssig bleibt. */
importScripts('sim.js');

self.onmessage = (e) => {
  const { id, code, trials, batches } = e.data;
  try {
    const res = self.OddleSim.run(code, trials, batches);
    self.postMessage({ id, ok: true, res });
  } catch (err) {
    self.postMessage({ id, ok: false, error: String(err && err.message || err) });
  }
};
