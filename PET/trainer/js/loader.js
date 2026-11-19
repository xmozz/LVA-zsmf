/* Loads the data files listed in data/manifest.js with classic <script> tags
 * (works on file://). Files load one after another so that items and errors
 * can be attributed to a file.
 *
 * manifest.js sets window.TRAINER_DATA_FILES to an array of either
 *   'unit-1.js'
 * or
 *   { file: 'unit-1.js', prefixes: ['u1-'] }
 * For every listed file X.js, the continuation files X-b.js, X-c.js, ... are
 * tried as well; missing continuations are silent. data/_sample.js is loaded
 * only when the bank is empty or the URL contains ?sample=1.
 *
 * window.TL.load({sample:'force'|'never'}, callback(report))
 */
(function (global) {
  'use strict';

  var SAMPLE = '_sample.js';

  function normalizeList(list) {
    if (!Array.isArray(list)) return [];
    return list.map(function (entry) {
      if (typeof entry === 'string') return { file: entry, prefixes: [] };
      if (entry && typeof entry.file === 'string') return { file: entry.file, prefixes: Array.isArray(entry.prefixes) ? entry.prefixes : [] };
      return null;
    }).filter(Boolean);
  }

  function load(opts, done) {
    opts = opts || {};
    var base = opts.base || 'data/';
    var listed = normalizeList(global.TRAINER_DATA_FILES);
    var report = {
      manifestFound: Array.isArray(global.TRAINER_DATA_FILES),
      listed: listed,
      files: [],      // {name, status:'ok'|'missing'|'error'|'empty', items, errors}
      failed: [],     // subset of files with problems (non-optional)
      sample: false
    };
    if (!Array.isArray(global.TRAINER_BANK)) global.TRAINER_BANK = [];
    var queue = listed.map(function (e) { return { name: e.file, prefixes: e.prefixes, optional: false }; });
    var done_ = {};
    var current = null;

    function onRuntimeError(e) {
      if (current && e && typeof e.message === 'string') {
        current.errors.push(e.message + (e.lineno ? ' (line ' + e.lineno + ')' : ''));
      }
    }
    global.addEventListener('error', onRuntimeError);

    function contName(name) {
      var m = /^(.*)-([b-y])\.js$/.exec(name);
      if (m) return m[1] + '-' + String.fromCharCode(m[2].charCodeAt(0) + 1) + '.js';
      return name.replace(/\.js$/, '') + '-b.js';
    }

    function next() {
      var f = queue.shift();
      if (!f) return finish();
      if (done_[f.name]) return next();
      done_[f.name] = true;
      if (!Array.isArray(global.TRAINER_BANK)) global.TRAINER_BANK = [];
      var before = global.TRAINER_BANK.length;
      var rec = { name: f.name, optional: f.optional, status: 'ok', items: 0, errors: [] };
      current = rec;
      var s = document.createElement('script');
      s.src = base + f.name;
      s.async = false;
      var settled = false;
      s.onload = function () {
        if (settled) return; settled = true;
        current = null;
        var bank = Array.isArray(global.TRAINER_BANK) ? global.TRAINER_BANK : (global.TRAINER_BANK = []);
        for (var i = before; i < bank.length; i++) {
          if (bank[i] && typeof bank[i] === 'object') {
            try { bank[i].__file = f.name; } catch (e) { /* frozen */ }
          }
        }
        rec.items = bank.length - before;
        if (rec.errors.length) rec.status = 'error';
        else if (!rec.items) rec.status = 'empty';
        report.files.push(rec);
        if (rec.status !== 'ok') report.failed.push(rec);
        if (!opts.noContinuations && f.name !== SAMPLE) queue.unshift({ name: contName(f.name), prefixes: f.prefixes, optional: true });
        next();
      };
      s.onerror = function () {
        if (settled) return; settled = true;
        current = null;
        rec.status = 'missing';
        if (!f.optional) { report.files.push(rec); report.failed.push(rec); }
        s.parentNode && s.parentNode.removeChild(s);
        next();
      };
      document.head.appendChild(s);
    }

    function finish() {
      var wantSample = opts.sample === 'force' ||
        (opts.sample !== 'never' && (!global.TRAINER_BANK.length || /[?&]sample=1\b/.test(global.location.search)));
      if (wantSample && !done_[SAMPLE]) {
        report.sample = true;
        queue.push({ name: SAMPLE, prefixes: ['smp-', 'mix-smp-'], optional: false });
        return next();
      }
      global.removeEventListener('error', onRuntimeError);
      done(report);
    }

    next();
  }

  global.TL = { load: load, normalizeList: normalizeList, SAMPLE: SAMPLE };
})(window);
