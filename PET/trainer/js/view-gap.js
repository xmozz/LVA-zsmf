/* Definitions (gap) mode. Also exports TA.gapBlankHtml helpers used by the mock. */
(function (global) {
  'use strict';
  var TA = global.TA, esc = TA.esc, T = TA.t;

  /* Render a gap item. st: {attempts:{}, revealed:{i:true}, marks:{i:bool}, inputs:bool}
   * Returns {html, count} */
  TA.renderGapItem = function (it, st) {
    var res = TR.renderGapText(it.text, {}, function (i, html) {
      var num = '<span class="gap-num">' + (i + 1) + '</span>';
      if (st.revealed[i]) {
        var m = st.marks[i];
        return '<span class="gap revealed' + (m === true ? ' mark-right' : m === false ? ' mark-wrong' : '') + '">' + num + '<span class="gap-ans">' + html + '</span></span>';
      }
      if (st.inputs) {
        return '<span class="gap">' + num + '<input class="gap-in" data-i="' + i + '"' + (st.gapId ? ' data-gap="' + esc(st.gapId) + '"' : '') + ' value="' + esc(st.attempts[i] || '') +
          '" placeholder="…" autocomplete="off" spellcheck="false" aria-label="' + esc(T('gap_blank_aria', { n: i + 1 })) + '"></span>';
      }
      return '<span class="gap gap-hidden">' + num + '<span class="gap-blank"></span></span>';
    });
    return { html: res.html, count: res.gaps.length, gaps: res.gaps };
  };

  /* Table for marking revealed blanks. */
  TA.gapMarkTable = function (it, st, count, readonly) {
    var gaps = TR.renderGapText(it.text, {}, function () { return ''; }).gaps;
    var rows = '';
    for (var i = 0; i < count; i++) {
      if (!st.revealed[i]) continue;
      var m = st.marks[i];
      rows += '<tr class="' + (m === true ? 'row-right' : m === false ? 'row-wrong' : '') + '"><td class="gap-num-cell">' + (i + 1) + '</td><td class="attempt">' +
        (st.attempts[i] ? esc(st.attempts[i]) : '<span class="dim">—</span>') + '</td><td>' + TA.mdi(gaps[i]) + '</td><td class="mark-cell">' +
        (readonly ? (m === true ? esc(T('gap_mark_right')) : m === false ? esc(T('gap_mark_wrong')) : '') :
          '<button class="btn btn-sm mark' + (m === true ? ' on-right' : '') + '" data-mark="' + i + '"' + (st.gapId ? ' data-gap="' + esc(st.gapId) + '"' : '') + ' data-v="1">' + esc(T('gap_mark_right')) + '</button>' +
          '<button class="btn btn-sm mark' + (m === false ? ' on-wrong' : '') + '" data-mark="' + i + '"' + (st.gapId ? ' data-gap="' + esc(st.gapId) + '"' : '') + ' data-v="0">' + esc(T('gap_mark_wrong')) + '</button>') + '</td></tr>';
    }
    if (!rows) return '';
    return '<div class="table-wrap"><table class="list gap-table"><thead><tr><th>#</th><th>' + esc(T('gap_attempt')) + '</th><th>' + esc(T('gap_answer')) + '</th><th>' + esc(T('gap_mark')) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  };

  TA.gapScore = function (it, st, count) {
    var right = 0, marked = 0;
    for (var i = 0; i < count; i++) if (st.marks[i] !== undefined) { marked++; if (st.marks[i]) right++; }
    return { right: right, marked: marked, total: count, score: count ? it.points * right / count : 0, complete: marked === count };
  };

  TA.views.gap = {
    mount: function (el, r) {
      var all = TA.ofType('gap');
      var S = TS.state.settings;
      var q = r.query;
      var filt = { lecture: q.lecture || '', topic: q.topic || '', origin: q.origin || '', unseen: false, mistakes: false, len: parseInt(q.len, 10) || S.gapLen || 3 };
      var sess = null;

      function setup() {
        sess = null;
        var list = TA.applyFilters(all, filt);
        var html = '<section class="card-plain setup"><h1>' + esc(T('gap_title')) + '</h1><p class="dim">' + esc(T('gap_intro')) + '</p>' +
          TA.filterBar({ items: all, fields: ['lecture', 'topic', 'origin', 'unseen', 'mistakes', 'len'], values: filt }) +
          '<label class="chk"><input type="checkbox" id="onebyone"' + (S.gapOneByOne ? ' checked' : '') + '> ' + esc(T('gap_one_by_one')) + '</label>' +
          '<div class="setup-foot"><span class="dim">' + T(list.length === 1 ? 'match_one' : 'match_many', { n: list.length, noun: T('type_gap').toLowerCase() }) + '</span>' +
          '<button class="btn btn-primary" id="start"' + (list.length ? '' : ' disabled') + '>' + esc(T('start')) + ' ' + TA.kbd('Enter') + '</button></div></section>';
        html += '<section class="card-plain"><h2>' + esc(T('gap_all')) + '</h2>' + (list.length ? '<table class="list"><thead><tr><th>' + esc(T('table_definition')) + '</th><th>' + esc(T('table_source')) + '</th><th>' + esc(T('table_points')) + '</th><th>' + esc(T('table_best')) + '</th></tr></thead><tbody>' +
          list.slice().sort(function (a, b) { return TB.unitIndex(a.lecture) - TB.unitIndex(b.lecture) || (a.title < b.title ? -1 : 1); }).map(function (it) {
            var g = TS.state.gaps[it.id];
            return '<tr><td><a href="#/gap/' + encodeURIComponent(it.id) + '">' + TA.safe(function () { return TA.mdi(it.title); }, it.id) + '</a> <span class="dim small">' + esc(TB.unitLabel(it.lecture)) + '</span></td><td class="small">' +
              esc(it.source) + '</td><td>' + TA.fmtNum(it.points) + '</td><td>' + (g ? TA.fmtNum(g.best) + ' / ' + TA.fmtNum(it.points) : '<span class="dim">—</span>') + '</td></tr>';
          }).join('') + '</tbody></table>' : '<p class="dim">' + esc(T('gap_none')) + '</p>') + '</section>';
        el.innerHTML = html;
        el.querySelector('.filters').addEventListener('change', function () { filt = TA.readFilters(el); setup(); });
        TA.qs('#onebyone', el).onchange = function () { S.gapOneByOne = this.checked; TS.save(); };
        TA.qs('#start', el).onclick = function () { start(); };
      }

      function start(list) {
        if (TA.qs('.filters', el)) filt = TA.readFilters(el);
        S.gapLen = filt.len; TS.saveSoon();
        var chosen = list || TA.schedule(TA.applyFilters(all, filt), filt.len);
        if (!chosen.length) return;
        sess = { list: chosen, i: 0, results: [] };
        newItemState();
        show();
      }

      function newItemState() { sess.st = { attempts: {}, revealed: {}, marks: {}, inputs: true }; }

      function show() {
        if (sess.i >= sess.list.length) return summary();
        var it = sess.list[sess.i], st = sess.st;
        var rendered;
        var html = '<div class="drill-top"><span>' + esc(T('drill_counter', { noun: T('type_gap'), i: sess.i + 1, n: sess.list.length })) + '</span><span></span><button class="btn btn-sm btn-ghost" id="quit">' + esc(T('drill_end')) + ' ' + TA.kbd('Esc') + '</button></div>';
        html += '<section class="drill-card gap-card">' + TA.safe(function () {
          rendered = TA.renderGapItem(it, st);
          var nRev = Object.keys(st.revealed).length;
          var sc = TA.gapScore(it, st, rendered.count);
          var h = TA.metaLine(it, nRev > 0) + '<h2>' + TA.mdi(it.title) + ' <span class="pts">' + TA.fmtNum(it.points) + ' ' + esc(T('table_points').toLowerCase()) + '</span></h2>' +
            '<div class="prose gap-text">' + rendered.html + '</div>';
          var one = S.gapOneByOne;
          h += '<div class="drill-actions">';
          if (nRev < rendered.count) {
            if (one) h += '<button class="btn btn-primary" id="rev-one">' + esc(T('gap_reveal_one', { n: firstHidden(rendered.count) + 1 })) + ' ' + TA.kbd('N') + '</button>';
            h += '<button class="btn' + (one ? '' : ' btn-primary') + '" id="rev-all">' + esc(T('gap_reveal_all')) + ' ' + TA.kbd('R') + '</button>';
          }
          h += '</div>';
          if (nRev) {
            h += TA.gapMarkTable(it, st, rendered.count, false);
            h += '<div class="gap-score">' + T('gap_marked', { marked: sc.marked, total: rendered.count, score: TA.fmtNum(sc.score), points: TA.fmtNum(it.points) }) + '</div>';
            if (nRev === rendered.count && it.note) h += '<div class="prose explanation">' + TA.md(it.note) + '</div>';
            if (nRev === rendered.count) h += '<div class="source">' + esc(T('source_line', { source: it.source })) + '</div>';
            if (sc.complete) h += '<div class="drill-actions"><button class="btn btn-primary" id="next">' + (sess.i + 1 < sess.list.length ? esc(T('drill_next')) : esc(T('drill_finish'))) + ' ' + TA.kbd('Enter') + '</button></div>';
            else if (nRev === rendered.count) h += '<p class="small dim">' + esc(T('gap_mark_all')) + '</p>';
          }
          return h;
        }, it.id) + '</section>';
        el.innerHTML = html;
        sess.count = rendered ? rendered.count : 0;
        TA.qs('#quit', el).onclick = summary;
        TA.qsa('.gap-in', el).forEach(function (inp) {
          inp.addEventListener('input', function () { st.attempts[inp.getAttribute('data-i')] = inp.value; });
          inp.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); var nxt = TA.qsa('.gap-in', el)[TA.qsa('.gap-in', el).indexOf(inp) + 1]; if (nxt) nxt.focus(); else inp.blur(); }
          });
        });
        var ra = TA.qs('#rev-all', el); if (ra) ra.onclick = revealAll;
        var ro = TA.qs('#rev-one', el); if (ro) ro.onclick = revealOne;
        var nx = TA.qs('#next', el); if (nx) nx.onclick = next;
        TA.qsa('[data-mark]', el).forEach(function (b) {
          b.onclick = function () {
            var i = b.getAttribute('data-mark');
            var v = b.getAttribute('data-v') === '1';
            st.marks[i] = v;
            var y = global.scrollY;
            show();
            global.scrollTo(0, y);
          };
        });
      }

      function firstHidden(n) { for (var i = 0; i < n; i++) if (!sess.st.revealed[i]) return i; return n; }
      function revealAll() { for (var i = 0; i < sess.count; i++) sess.st.revealed[i] = true; show(); }
      function revealOne() { var i = firstHidden(sess.count); if (i < sess.count) { sess.st.revealed[i] = true; var y = global.scrollY; show(); global.scrollTo(0, y); } }

      function next() {
        var it = sess.list[sess.i];
        var sc = TA.gapScore(it, sess.st, sess.count);
        if (!sc.complete) return;
        TS.record(it.id, sc.right === sc.total);
        var g = TS.state.gaps[it.id] || (TS.state.gaps[it.id] = { best: 0, last: 0, n: 0 });
        g.n++; g.last = sc.score; g.best = Math.max(g.best, sc.score);
        TS.save();
        sess.results.push({ item: it, score: sc.score, right: sc.right, total: sc.total });
        sess.i++;
        newItemState();
        show();
        global.scrollTo(0, 0);
      }

      function summary() {
        if (!sess) return setup();
        var s = sess; sess = null;
        var tot = s.results.reduce(function (a, x) { return a + x.score; }, 0);
        var max = s.results.reduce(function (a, x) { return a + x.item.points; }, 0);
        el.innerHTML = '<section class="card-plain"><h1>' + esc(T('gap_summary')) + '</h1><p class="big">' + T('gap_summary_points', { score: TA.fmtNum(tot), max: TA.fmtNum(max) }) + '</p>' +
          (s.results.length ? '<table class="list"><tbody>' + s.results.map(function (x) {
            return '<tr><td><a href="#/gap/' + encodeURIComponent(x.item.id) + '">' + TA.mdi(x.item.title) + '</a></td><td>' + esc(T('gap_blanks', { right: x.right, total: x.total })) + '</td><td><strong>' +
              TA.fmtNum(x.score) + '</strong> / ' + TA.fmtNum(x.item.points) + '</td></tr>';
          }).join('') + '</tbody></table>' : '') +
          '<div class="actions"><button class="btn btn-primary" id="again">' + esc(T('gap_back')) + ' ' + TA.kbd('Enter') + '</button><a class="btn" href="#/dashboard">' + esc(T('back_dashboard')) + '</a></div></section>';
        TA.qs('#again', el).onclick = function () { if (r.args[0]) TA.go('#/gap'); else setup(); };
      }

      if (r.args[0]) {
        var one = TA.bank.byId[r.args[0]];
        if (one && one.type === 'gap') start([one]);
        else { setup(); TA.notice('nogap', esc(T('gap_not_found', { id: r.args[0] })), 'warn'); }
      } else if (q.start) { setup(); start(); }
      else setup();

      return {
        onKey: function (e) {
          var k = e.key.toLowerCase();
          if (!sess) {
            if (k === 'enter') { var b = TA.qs('#start', el) || TA.qs('#again', el); if (b && !b.disabled) { e.preventDefault(); b.click(); } }
            return;
          }
          if (k === 'escape') {
            if (document.activeElement && document.activeElement.classList.contains('gap-in')) { document.activeElement.blur(); return; }
            summary(); return;
          }
          if (k === 'r') revealAll();
          else if (k === 'n') revealOne();
          else if (k === 'enter') { var nx = TA.qs('#next', el); if (nx) { e.preventDefault(); next(); } }
        }
      };
    }
  };
})(window);
