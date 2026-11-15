/* Progress state in localStorage under a key derived from the course id.
 * Several trainers opened from file:// share one localStorage; the id keeps
 * their progress apart. window.TS
 */
(function (global) {
  'use strict';

  var C = global.COURSE || {};
  var KEY = 'trainer-' + String(C.id || 'course');
  var VERSION = 1;
  var LOG_MAX = 5000;
  var ok = true; // localStorage usable

  function fresh() {
    return {
      v: VERSION,
      created: Date.now(),
      items: {},        // id -> {n, ok, bad, skip, streak, last, lastOk}
      notesRead: {},    // id -> timestamp
      problems: {},     // id -> {answers:{label:text}, hints:{label:n}, sol:{label:true}, rubric:{label:[bool]}, t}
      gaps: {},         // id -> {best, last, n}
      log: [],          // [id, 1|0, timestamp]
      mocks: [],        // finished mock results
      mockActive: null,
      settings: { theme: 'system', tfLen: 10, mcLen: 10, gapLen: 3, cardLen: 20, mockMinutes: null, gapOneByOne: false }
    };
  }

  function migrate(s) {
    if (!s || typeof s !== 'object') return fresh();
    if (s.v !== VERSION) {
      // only one version exists so far; keep what is compatible
      var f = fresh();
      for (var k in f) if (s[k] !== undefined && typeof s[k] === typeof f[k]) f[k] = s[k];
      s = f;
    }
    var d = fresh();
    for (var k2 in d) if (s[k2] === undefined || s[k2] === null && k2 !== 'mockActive') s[k2] = d[k2];
    if (!s.settings || typeof s.settings !== 'object') s.settings = d.settings;
    for (var k3 in d.settings) if (s.settings[k3] === undefined) s.settings[k3] = d.settings[k3];
    if (!Array.isArray(s.log)) s.log = [];
    if (!Array.isArray(s.mocks)) s.mocks = [];
    return s;
  }

  var state;
  try {
    var raw = global.localStorage.getItem(KEY);
    state = migrate(raw ? JSON.parse(raw) : null);
  } catch (e) {
    ok = false;
    state = fresh();
  }
  if (state.settings.mockMinutes == null) {
    state.settings.mockMinutes = (C.blueprint && C.blueprint.minutes) || 60;
  }

  var timer = null;
  function save() {
    if (state.log.length > LOG_MAX) state.log = state.log.slice(-LOG_MAX);
    try { global.localStorage.setItem(KEY, JSON.stringify(state)); ok = true; }
    catch (e) { ok = false; if (global.console) console.warn('[trainer] could not save progress', e); }
  }
  function saveSoon() {
    clearTimeout(timer);
    timer = setTimeout(save, 300);
  }
  global.addEventListener('beforeunload', function () { if (timer) { clearTimeout(timer); save(); } });

  function stat(id) { return state.items[id] || null; }

  function record(id, correct) {
    var s = state.items[id] || (state.items[id] = { n: 0, ok: 0, bad: 0, skip: 0, streak: 0, last: 0, lastOk: null });
    s.n++;
    if (correct) { s.ok++; s.streak++; } else { s.bad++; s.streak = 0; }
    s.last = Date.now();
    s.lastOk = !!correct;
    state.log.push([id, correct ? 1 : 0, s.last]);
    save();
  }

  function recordSkip(id) {
    var s = state.items[id] || (state.items[id] = { n: 0, ok: 0, bad: 0, skip: 0, streak: 0, last: 0, lastOk: null });
    s.skip = (s.skip || 0) + 1;
    s.last = Date.now();
    save();
  }

  function mastered(id) { var s = state.items[id]; return !!(s && s.streak >= 2); }
  function seen(id) { return !!state.items[id]; }

  function problem(id) {
    return state.problems[id] || (state.problems[id] = { answers: {}, hints: {}, sol: {}, rubric: {}, t: 0 });
  }

  function exportJSON() {
    return JSON.stringify({ app: String(C.id || 'trainer') + '-trainer', exported: new Date().toISOString(), state: state }, null, 1);
  }

  function importJSON(text) {
    var obj = JSON.parse(text);
    var s = obj && obj.state ? obj.state : obj;
    if (!s || typeof s !== 'object' || !s.items) throw new Error('This file does not look like a trainer progress export.');
    state = migrate(s);
    save();
  }

  function reset() {
    var theme = state.settings.theme;
    state = fresh();
    state.settings.theme = theme;
    state.settings.mockMinutes = (C.blueprint && C.blueprint.minutes) || 60;
    save();
  }

  global.TS = {
    KEY: KEY,
    get state() { return state; },
    get storageOk() { return ok; },
    save: save, saveSoon: saveSoon, stat: stat, record: record, recordSkip: recordSkip,
    mastered: mastered, seen: seen, problem: problem,
    exportJSON: exportJSON, importJSON: importJSON, reset: reset
  };
})(window);
