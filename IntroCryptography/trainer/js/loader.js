/* Loads the data files listed in data/manifest.js with classic <script> tags (works on file://).
 * Files load one after another so that items and errors can be attributed to a file.
 * For every listed file X.js, the continuation files X-b.js, X-c.js, ... are tried as well
 * (the contract allows content agents to split long files); missing continuations are silent.
 * window.TL.load(options, callback(report))
 */
(function (global) {
  'use strict';

  var DEFAULT_FILES = ['slides-1-2.js', 'slides-3-4.js', 'slides-5-6.js', 'slides-7.js', 'exams.js', 'exercises.js'];

  function load(opts, done) {
    opts = opts || {};
    var base = opts.base || 'data/';
    var listed = Array.isArray(global.CRYPTO_DATA_FILES) ? global.CRYPTO_DATA_FILES.slice() : DEFAULT_FILES.slice();
    var report = {
      manifestFound: Array.isArray(global.CRYPTO_DATA_FILES),
      files: [],      // {name, status:'ok'|'missing'|'error'|'empty', items, errors:[]}
      failed: [],     // subset of files with problems (non-optional)
      sample: false
    };
    if (!Array.isArray(global.CRYPTO_BANK)) global.CRYPTO_BANK = [];
    var queue = listed.map(function (n) { return { name: String(n), optional: false }; });
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
      if (!Array.isArray(global.CRYPTO_BANK)) global.CRYPTO_BANK = [];
      var before = global.CRYPTO_BANK.length;
      var rec = { name: f.name, optional: f.optional, status: 'ok', items: 0, errors: [] };
      current = rec;
      var s = document.createElement('script');
      s.src = base + f.name;
      s.async = false;
      var settled = false;
      s.onload = function () {
        if (settled) return; settled = true;
        current = null;
        var bank = Array.isArray(global.CRYPTO_BANK) ? global.CRYPTO_BANK : (global.CRYPTO_BANK = []);
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
        if (!opts.noContinuations && f.name !== '_sample.js') queue.unshift({ name: contName(f.name), optional: true });
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
        (opts.sample !== 'never' && (!global.CRYPTO_BANK.length || /[?&]sample=1\b/.test(global.location.search)));
      if (wantSample && !done_['_sample.js']) {
        report.sample = true;
        queue.push({ name: '_sample.js', optional: false });
        return next();
      }
      global.removeEventListener('error', onRuntimeError);
      done(report);
    }

    next();
  }

  global.TL = { load: load, DEFAULT_FILES: DEFAULT_FILES };
})(window);
