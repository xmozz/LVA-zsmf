/* App core: helpers, bank access, scheduling, router, shell. window.TA */
(function (global) {
  'use strict';

  var TA = global.TA = global.TA || {};
  TA.views = TA.views || {};

  var C = global.COURSE || {};
  var T = TA.t = global.TB.t;

  function parseExamDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  var EXAM_DATE = parseExamDate(C.exam && C.exam.date);
  TA.EXAM_DATE = EXAM_DATE;
  TA.examName = (C.exam && C.exam.name) || 'exam';
  TA.examSummary = (C.exam && C.exam.summary) || '';

  /* ---------- small helpers ---------- */
  var esc = TA.esc = TR.esc;
  TA.md = function (s) { return TR.renderText(s, {}); };
  TA.mdi = function (s) { return TR.renderInline(s, {}); };

  TA.shuffle = function (a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  TA.qs = function (sel, root) { return (root || document).querySelector(sel); };
  TA.qsa = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  TA.pct = function (a, b) { return b ? Math.round(100 * a / b) : 0; };
  TA.fmtNum = function (x) { return (Math.round(x * 100) / 100).toString(); };
  TA.fmtDate = function (t) {
    var d = new Date(t);
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) + ' ' +
      d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };
  TA.kbd = function (k) { return '<kbd>' + esc(k) + '</kbd>'; };

  /* Safe render: one bad item never breaks a view. */
  TA.safe = function (fn, label) {
    try { return fn(); }
    catch (e) {
      console.error('[trainer] render error' + (label ? ' in ' + label : ''), e);
      return '<div class="render-error">' + esc(T('render_error', { label: label || T('this_item') })) + ': ' + esc(e.message) + '</div>';
    }
  };

  /* ---------- bank ---------- */
  TA.bank = { items: [], byId: {}, skipped: [], duplicates: [] };
  TA.ofType = function (type) { return TA.bank.items.filter(function (it) { return it.type === type; }); };
  TA.typeLabel = function (id) { return TB.TYPE_LABELS[id] || id; };
  TA.topicLabel = function (id) { return TB.topicOf(id).label; };
  TA.topicsPresent = function (items) {
    var keys = {};
    items.forEach(function (it) { keys[TB.topicKey(it.topic)] = 1; });
    var list = TB.TOPICS.filter(function (t) { return keys[t.id]; });
    if (keys.other) list.push(TB.OTHER);
    return list;
  };
  TA.unitsPresent = function (items) {
    var keys = {};
    items.forEach(function (it) { keys[String(it.lecture)] = 1; });
    return TB.UNITS.filter(function (u) { return keys[String(u.id)]; });
  };
  TA.isDemo = function () { return TA.bank.items.some(function (it) { return it.__file === '_sample.js'; }); };
  TA.hasRealContent = function () { return TA.bank.items.some(function (it) { return it.__file !== '_sample.js'; }); };

  TA.isMistake = function (id) {
    var s = TS.stat(id);
    return !!(s && s.bad > 0 && s.streak < 2);
  };

  /* Filtering. f: {lecture, topic, origin, difficulty, unseen, mistakes} */
  TA.applyFilters = function (items, f) {
    f = f || {};
    return items.filter(function (it) {
      if (f.lecture && String(it.lecture) !== String(f.lecture)) return false;
      if (f.topic && TB.topicKey(it.topic) !== f.topic) return false;
      if (f.origin && it.origin !== f.origin) return false;
      if (f.difficulty && String(it.difficulty) !== String(f.difficulty)) return false;
      if (f.unseen && TS.seen(it.id)) return false;
      if (f.mistakes && !TA.isMistake(it.id)) return false;
      return true;
    });
  };

  /* Scheduling: unseen first, then previously wrong, then the rest (not mastered, least recent first). */
  TA.schedule = function (items, n) {
    var unseen = [], wrong = [], rest = [];
    items.forEach(function (it) {
      var s = TS.stat(it.id);
      if (!s) unseen.push(it);
      else if (s.lastOk === false || (s.bad > 0 && s.streak < 2)) wrong.push(it);
      else rest.push(it);
    });
    rest = TA.shuffle(rest);
    rest.sort(function (a, b) {
      var ma = TS.mastered(a.id) ? 1 : 0, mb = TS.mastered(b.id) ? 1 : 0;
      if (ma !== mb) return ma - mb;
      return (TS.stat(a.id).last || 0) - (TS.stat(b.id).last || 0);
    });
    var ordered = TA.shuffle(unseen).concat(TA.shuffle(wrong), rest);
    return TA.shuffle(ordered.slice(0, n));
  };

  /* ---------- filter bar ---------- */
  function opt(v, label, cur) { return '<option value="' + esc(v) + '"' + (String(cur) === String(v) ? ' selected' : '') + '>' + esc(label) + '</option>'; }

  /* cfg: {items, fields:[...], values:{}} */
  TA.filterBar = function (cfg) {
    var v = cfg.values || {};
    var items = cfg.items || [];
    var out = '<div class="filters">';
    cfg.fields.forEach(function (f) {
      if (f === 'lecture') {
        out += '<label class="fld"><span>' + esc(T('filter_unit')) + '</span><select data-f="lecture">' + opt('', T('filter_all'), v.lecture) +
          TA.unitsPresent(items).map(function (u) { return opt(u.id, (u.label || u.id) + ' · ' + u.title, v.lecture); }).join('') + '</select></label>';
      } else if (f === 'topic') {
        out += '<label class="fld"><span>' + esc(T('filter_topic')) + '</span><select data-f="topic">' + opt('', T('filter_all'), v.topic) +
          TA.topicsPresent(items).map(function (t) { return opt(t.id, t.label, v.topic); }).join('') + '</select></label>';
      } else if (f === 'origin') {
        var os = {}; items.forEach(function (it) { os[it.origin] = 1; });
        out += '<label class="fld"><span>' + esc(T('filter_origin')) + '</span><select data-f="origin">' + opt('', T('filter_all'), v.origin) +
          Object.keys(os).sort().map(function (o) { return opt(o, TB.originLabel(o), v.origin); }).join('') + '</select></label>';
      } else if (f === 'difficulty') {
        out += '<label class="fld"><span>' + esc(T('filter_difficulty')) + '</span><select data-f="difficulty">' + opt('', T('filter_all'), v.difficulty) +
          opt(1, T('diff_1'), v.difficulty) + opt(2, T('diff_2'), v.difficulty) + opt(3, T('diff_3'), v.difficulty) + '</select></label>';
      } else if (f === 'status') {
        out += '<label class="fld"><span>' + esc(T('filter_status')) + '</span><select data-f="status">' + opt('', T('filter_all'), v.status) +
          opt('new', T('status_new'), v.status) + opt('attempted', T('status_attempted'), v.status) + opt('solved', T('status_solved'), v.status) + '</select></label>';
      } else if (f === 'unseen') {
        out += '<label class="chk"><input type="checkbox" data-f="unseen"' + (v.unseen ? ' checked' : '') + '> ' + esc(T('filter_unseen')) + '</label>';
      } else if (f === 'mistakes') {
        out += '<label class="chk"><input type="checkbox" data-f="mistakes"' + (v.mistakes ? ' checked' : '') + '> ' + esc(T('filter_mistakes')) + '</label>';
      } else if (f === 'len') {
        out += '<label class="fld fld-num"><span>' + esc(T('filter_length')) + '</span><input type="number" min="1" max="200" data-f="len" value="' + esc(v.len || 10) + '"></label>';
      }
    });
    return out + '</div>';
  };
  TA.readFilters = function (root) {
    var v = {};
    TA.qsa('[data-f]', root).forEach(function (el) {
      var k = el.getAttribute('data-f');
      v[k] = el.type === 'checkbox' ? el.checked : el.value;
    });
    if (v.len !== undefined) v.len = Math.max(1, Math.min(200, parseInt(v.len, 10) || 10));
    return v;
  };

  /* ---------- meta line ---------- */
  TA.metaLine = function (it, withSource) {
    var bits = [esc(TB.unitLabel(it.lecture)), esc(TA.topicLabel(it.topic)), esc(TB.originLabel(it.origin))];
    if (withSource && it.source) bits.push(esc(it.source));
    return '<div class="meta">' + bits.map(function (b) { return '<span>' + b + '</span>'; }).join('') + '</div>';
  };

  /* ---------- countdown ---------- */
  TA.daysLeft = function () {
    if (!EXAM_DATE) return null;
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((EXAM_DATE - today) / 86400000);
  };
  TA.countdownText = function () {
    var d = TA.daysLeft();
    if (d === null) return '';
    if (d > 1) return T('countdown_days', { n: d, exam: TA.examName });
    if (d === 1) return T('countdown_one_day', { exam: TA.examName });
    if (d === 0) return T('countdown_today', { exam: TA.examName });
    return T('countdown_over', { exam: TA.examName });
  };

  /* ---------- notices ---------- */
  TA.notice = function (id, html, kind) {
    var box = document.getElementById('notices');
    if (!box) return;
    var dkey = 'dismiss-' + String(C.id || '') + '-' + id;
    try { if (sessionStorage.getItem(dkey)) return; } catch (e) { /* ignore */ }
    var el = document.createElement('div');
    el.className = 'notice notice-' + (kind || 'info');
    el.innerHTML = '<div class="notice-body">' + html + '</div><button class="btn-x" aria-label="' + esc(T('dismiss')) + '" title="' + esc(T('dismiss')) + '">×</button>';
    el.querySelector('.btn-x').onclick = function () {
      el.remove();
      try { sessionStorage.setItem(dkey, '1'); } catch (e) { /* ignore */ }
    };
    box.appendChild(el);
  };

  /* ---------- theme ---------- */
  TA.applyTheme = function () {
    var t = TS.state.settings.theme;
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
    var b = document.getElementById('theme-btn');
    if (b) b.textContent = t === 'light' ? T('theme_light') : t === 'dark' ? T('theme_dark') : T('theme_auto');
  };
  TA.cycleTheme = function () {
    var order = ['system', 'light', 'dark'];
    var t = TS.state.settings.theme;
    TS.state.settings.theme = order[(order.indexOf(t) + 1) % 3];
    TS.save();
    TA.applyTheme();
  };

  /* ---------- router ---------- */
  TA.parseHash = function () {
    var h = (global.location.hash || '').replace(/^#\/?/, '');
    var qi = h.indexOf('?');
    var q = {};
    if (qi >= 0) {
      h.slice(qi + 1).split('&').forEach(function (kv) {
        if (!kv) return;
        var p = kv.split('=');
        q[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '');
      });
      h = h.slice(0, qi);
    }
    var parts = h.split('/').filter(Boolean).map(decodeURIComponent);
    return { name: parts[0] || 'dashboard', args: parts.slice(1), query: q };
  };
  TA.go = function (hash) { if (global.location.hash === hash) TA.route(); else global.location.hash = hash; };
  /* Replace hash without re-rendering (for state that is already on screen). */
  TA.setHashSilently = function (hash) {
    if (global.location.hash === hash) return;
    try { history.replaceState(null, '', hash); }
    catch (e) { TA._silent = hash; global.location.hash = hash; }
  };

  var NAV = [];
  var NAV_ALIAS = { cards: 'learn', mistakes: 'tf', settings: 'settings' };

  function mockAvailable() {
    if (!global.BP || !C.blueprint) return false;
    return (C.blueprint.sections || []).some(function (sec) { return BP.canFill(sec, TA.bank.items); });
  }

  TA.buildNav = function () {
    var out = [['dashboard', T('nav_dashboard')]];
    if (TA.ofType('note').length || TA.ofType('card').length) out.push(['learn', T('nav_learn')]);
    TT.all().forEach(function (def) {
      if (def.nav !== false && def.route && TA.ofType(def.id).length && (def.mode === 'drill' || def.mode === 'view')) {
        out.push([def.route, T(def.labelKey)]);
      }
    });
    if (TA.ofType('gap').length) out.push(['gap', T('nav_gap')]);
    if (TA.ofType('problem').length) out.push(['problems', T('nav_problems')]);
    if (mockAvailable()) out.push(['mock', T('nav_mock')]);
    NAV = out;
    return out;
  };

  var current = null; // {name, view}

  TA.route = function () {
    var r = TA.parseHash();
    var view = TA.views[r.name];
    if (!view) { r = { name: 'dashboard', args: [], query: {} }; view = TA.views.dashboard; }
    var navName = NAV_ALIAS[r.name] || r.name;
    TA.qsa('#nav a').forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-nav') === navName); });
    if (current && current.view && current.name === r.name && typeof current.view.update === 'function') {
      if (current.view.update(r) !== false) return;
    }
    if (current && current.view && current.view.destroy) { try { current.view.destroy(); } catch (e) { console.error(e); } }
    var main = document.getElementById('view');
    main.innerHTML = '';
    main.className = 'view view-' + r.name;
    // fresh host element per mount, so listeners of the previous view are dropped with it
    var host = document.createElement('div');
    host.className = 'view-host';
    main.appendChild(host);
    var inst = null;
    try { inst = view.mount(host, r) || {}; }
    catch (e) {
      console.error('[trainer] view error', e);
      host.innerHTML = '<div class="render-error">' + esc(T('view_failed')) + ': ' + esc(e.message) + '</div>';
      inst = {};
    }
    current = { name: r.name, view: inst };
    global.scrollTo(0, 0);
  };

  function onKey(e) {
    if (!current || !current.view || !current.view.onKey) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target;
    var tag = t && t.tagName;
    if ((tag === 'INPUT' && t.type !== 'checkbox' && t.type !== 'radio') || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) {
      if (e.key !== 'Escape') return;
    }
    if (tag === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) return; // native activation
    current.view.onKey(e);
  }

  /* ---------- shell ---------- */
  TA.renderShell = function () {
    var nav = document.getElementById('nav');
    nav.setAttribute('aria-label', T('nav_modes'));
    nav.innerHTML = TA.buildNav().map(function (n) { return '<a href="#/' + n[0] + '" data-nav="' + n[0] + '">' + n[1] + '</a>'; }).join('');
    document.title = [C.title, C.subtitle].filter(Boolean).join(' ') || 'Trainer';
    if (C.lang) document.documentElement.lang = C.lang;
    var brand = document.getElementById('brand');
    if (brand) {
      brand.innerHTML = esc(C.title || 'Trainer') + ' <span>' + esc(C.subtitle || '') + '</span>' +
        (TA.isDemo() && !TA.hasRealContent() ? ' <span class="demo-tag">' + esc(T('demo_badge')) + '</span>' : '');
      brand.href = '#/dashboard';
    }
    var cd = document.getElementById('countdown');
    cd.textContent = TA.countdownText();
    cd.style.display = TA.countdownText() ? '' : 'none';
    document.getElementById('theme-btn').onclick = TA.cycleTheme;
    var set = document.getElementById('settings-btn');
    if (set) { set.textContent = T('settings'); set.title = T('settings'); }
    TA.applyTheme();
    var bar = document.querySelector('.topbar');
    function setH() { document.documentElement.style.setProperty('--topbar-h', bar.offsetHeight + 'px'); }
    setH();
    global.addEventListener('resize', setH);
  };

  TA.boot = function (report) {
    TA.loadReport = report;
    TA.bank = TB.build(global.TRAINER_BANK || []);
    TA.renderShell();

    if (!TR.hasKatex()) TA.notice('katex', T('notice_katex'), 'warn');
    if (!TS.storageOk) TA.notice('storage', T('notice_storage'), 'warn');
    if (!report.manifestFound) TA.notice('manifest', T('notice_manifest'), 'warn');
    if (report.failed.length) {
      TA.notice('files-' + report.failed.map(function (f) { return f.name; }).join(','),
        T('notice_files') + '<ul>' + report.failed.map(function (f) {
          var why = f.status === 'missing' ? T('notice_file_missing')
            : f.status === 'empty' ? T('notice_file_empty')
            : T('notice_file_error', {
              detail: f.errors.length ? T('notice_file_error_detail', { message: esc(f.errors[0]) }) : '',
              items: f.items ? T('notice_file_error_items', { n: f.items }) : ''
            });
          return '<li><code>data/' + esc(f.name) + '</code> — ' + why + '</li>';
        }).join('') + '</ul>', 'warn');
    }
    if (TA.bank.skipped.length || TA.bank.duplicates.length) {
      var bits = [];
      if (TA.bank.skipped.length) bits.push(T('notice_items_skipped', { n: TA.bank.skipped.length }));
      if (TA.bank.duplicates.length) bits.push(T('notice_duplicates', { n: TA.bank.duplicates.length }));
      TA.notice('skipped-' + TA.bank.skipped.length + '-' + TA.bank.duplicates.length,
        bits.join(', ') + '. ' + T('notice_details'), 'info');
    }
    if (report.sample) {
      TA.notice('sample', T('notice_sample', {
        why: TA.hasRealContent() ? T('notice_sample_alongside') : T('notice_sample_empty')
      }) + ' ' + T('demo_notice'), 'info');
    }

    document.addEventListener('keydown', onKey);
    global.addEventListener('hashchange', function () {
      if (TA._silent && global.location.hash === TA._silent) { TA._silent = null; return; }
      TA._silent = null;
      TA.route();
    });
    if (EXAM_DATE) setInterval(function () { document.getElementById('countdown').textContent = TA.countdownText(); }, 60000);
    TA.route();
  };
})(window);
