/* Problems: list and problem view with hints, model solution and rubric self-grading */
(function (global) {
  'use strict';
  var TA = global.TA, esc = TA.esc, T = TA.t;

  function partScore(part, checks) {
    var s = 0;
    (part.rubric || []).forEach(function (rb, j) { if (checks && checks[j]) s += rb.points; });
    return Math.min(s, part.points);
  }

  TA.problemScore = function (it) {
    var ps = TS.state.problems[it.id];
    var score = 0;
    it.parts.forEach(function (p) { score += partScore(p, ps && ps.rubric[p.label]); });
    return { score: score, total: it.total, graded: !!(ps && Object.keys(ps.rubric).length) };
  };

  TA.problemStatus = function (it) {
    var ps = TS.state.problems[it.id];
    if (!ps) return 'new';
    var sc = TA.problemScore(it);
    if (sc.graded && sc.score >= 0.8 * sc.total) return 'solved';
    var touched = sc.graded || Object.keys(ps.sol).length || Object.keys(ps.hints).some(function (k) { return ps.hints[k] > 0; }) ||
      Object.keys(ps.answers).some(function (k) { return (ps.answers[k] || '').trim(); });
    return touched ? 'attempted' : 'new';
  };

  function statusLabel(st) { return st === 'solved' ? T('status_solved') : st === 'attempted' ? T('status_attempted') : T('status_new'); }
  function chip(st) { return '<span class="chip chip-' + st + '">' + esc(statusLabel(st)) + '</span>'; }

  var listFilt = { lecture: '', topic: '', origin: '', difficulty: '', status: '' };

  function listView(el, r) {
    var all = TA.ofType('problem');
    ['lecture', 'topic', 'origin', 'difficulty', 'status'].forEach(function (k) { if (r.query[k] !== undefined) listFilt[k] = r.query[k]; });
    function render() {
      var list = TA.applyFilters(all, listFilt).filter(function (it) { return !listFilt.status || TA.problemStatus(it) === listFilt.status; });
      list.sort(function (a, b) { return TB.unitIndex(a.lecture) - TB.unitIndex(b.lecture) || (a.source < b.source ? -1 : a.source > b.source ? 1 : 0); });
      TA._problemList = list.map(function (it) { return it.id; });
      var html = '<section class="card-plain setup"><h1>' + esc(T('problems_title')) + '</h1><p class="dim">' + esc(T('problems_intro')) + '</p>' +
        TA.filterBar({ items: all, fields: ['lecture', 'topic', 'origin', 'difficulty', 'status'], values: listFilt }) + '</section>';
      html += '<section class="card-plain">' + (list.length ? '<div class="table-wrap"><table class="list problems"><thead><tr><th>' + esc(T('table_problem')) + '</th><th>' + esc(T('table_source')) + '</th><th>' + esc(T('table_topic')) + '</th><th class="num">' + esc(T('table_points')) + '</th><th>' + esc(T('table_status')) + '</th></tr></thead><tbody>' +
        list.map(function (it) {
          var st = TA.problemStatus(it), sc = TA.problemScore(it);
          return '<tr><td><a href="#/problems/' + encodeURIComponent(it.id) + '">' + TA.safe(function () { return TA.mdi(it.title); }, it.id) + '</a>' +
            (it.mock ? ' <span class="tag">' + esc(T('problem_mock_tag')) + '</span>' : '') + ' <span class="dim small">' + esc(TB.unitLabel(it.lecture)) + ' · ' + esc(T('problem_difficulty', { n: it.difficulty })) + '</span></td><td class="small">' + esc(it.source) + '</td><td class="small">' +
            esc(TA.topicLabel(it.topic)) + '</td><td class="num">' + TA.fmtNum(it.total) + '</td><td>' + chip(st) + (sc.graded ? ' <span class="small dim">' + TA.fmtNum(sc.score) + '/' + TA.fmtNum(sc.total) + '</span>' : '') + '</td></tr>';
        }).join('') + '</tbody></table></div>' : '<p class="dim">' + esc(T('problems_none')) + '</p>') + '</section>';
      el.innerHTML = html;
      el.querySelector('.filters').addEventListener('change', function () {
        var v = TA.readFilters(el);
        Object.keys(listFilt).forEach(function (k) { listFilt[k] = v[k] || ''; });
        render();
      });
    }
    render();
    return {};
  }

  function problemView(el, it) {
    var ps = TS.problem(it.id);
    var ids = TA._problemList || TA.ofType('problem').map(function (p) { return p.id; });
    var pos = ids.indexOf(it.id);

    function header() {
      var sc = TA.problemScore(it);
      return '<span>' + chip(TA.problemStatus(it)) + '</span><span>' + T('problem_self_graded', { score: TA.fmtNum(sc.score), total: TA.fmtNum(sc.total) }) + '</span>';
    }

    var html = '<div class="crumbs"><a href="#/problems">' + esc(T('problems_all')) + '</a><span class="crumb-nav">' +
      (pos > 0 ? '<a href="#/problems/' + encodeURIComponent(ids[pos - 1]) + '">' + esc(T('problem_previous')) + '</a>' : '') +
      (pos >= 0 && pos < ids.length - 1 ? '<a href="#/problems/' + encodeURIComponent(ids[pos + 1]) + '">' + esc(T('problem_next')) + '</a>' : '') + '</span></div>';
    html += '<article class="problem">' + TA.safe(function () {
      var h = '<header class="problem-head"><h1>' + TA.mdi(it.title) + '</h1>' + TA.metaLine(it, true) +
        '<div class="problem-score" id="pscore">' + header() + '</div></header>';
      if (it.statement) h += '<div class="prose statement">' + TA.md(it.statement) + '</div>';
      it.parts.forEach(function (p, pi) {
        h += '<section class="part" data-part="' + pi + '"><h2 class="part-head"><span>(' + esc(p.label) + ')</span><span class="pts">' +
          esc(T(p.points === 1 ? 'problem_points' : 'problem_points_plural', { n: TA.fmtNum(p.points) })) + '</span></h2>' +
          '<div class="prose">' + TA.safe(function () { return TA.md(p.prompt); }, it.id + ' prompt') + '</div>' +
          '<label class="ta-label">' + esc(T('problem_your_answer')) + '<textarea class="answer" data-label="' + esc(p.label) + '" rows="6" placeholder="' + esc(T('problem_answer_ph')) + '">' +
          esc(ps.answers[p.label] || '') + '</textarea></label>' +
          '<div class="part-tools" data-pi="' + pi + '"></div></section>';
      });
      return h;
    }, it.id) + '<div class="problem-foot"><button class="btn btn-ghost btn-sm" id="preset">' + esc(T('problem_reset')) + '</button></div></article>';
    el.innerHTML = html;

    function tools(pi) {
      var p = it.parts[pi];
      var box = TA.qs('.part-tools[data-pi="' + pi + '"]', el);
      if (!box) return;
      var nh = ps.hints[p.label] || 0;
      var h = '';
      if (p.hints.length) {
        h += '<div class="hints">' + p.hints.slice(0, nh).map(function (x, j) {
          return '<div class="hint"><span class="hint-label">' + esc(T('problem_hint', { n: j + 1 })) + '</span><div class="prose">' + TA.safe(function () { return TA.md(x); }, 'hint') + '</div></div>';
        }).join('') + '</div>';
      }
      h += '<div class="part-btns">';
      if (nh < p.hints.length) h += '<button class="btn btn-sm" data-hint="' + pi + '">' + esc(T('problem_show_hint', { n: nh + 1, total: p.hints.length })) + '</button>';
      if (!ps.sol[p.label]) h += '<button class="btn btn-sm btn-primary" data-sol="' + pi + '">' + esc(T('problem_show_solution')) + '</button>';
      h += '</div>';
      if (ps.sol[p.label]) {
        var checks = ps.rubric[p.label] || [];
        h += '<div class="solution"><div class="sol-label">' + esc(T('problem_model_solution')) + '</div><div class="prose">' + TA.safe(function () { return TA.md(p.solution); }, 'solution') + '</div></div>' +
          '<fieldset class="rubric"><legend>' + esc(T('problem_grade')) + '</legend>' + p.rubric.map(function (rb, j) {
            return '<label class="rubric-row"><input type="checkbox" data-rb="' + pi + ':' + j + '"' + (checks[j] ? ' checked' : '') + '><span class="rb-pts">' + TA.fmtNum(rb.points) +
              '</span><span class="rb-text">' + TA.safe(function () { return TA.mdi(rb.text); }, 'rubric') + '</span></label>';
          }).join('') + '<div class="rubric-total">' + T('problem_part_score', { score: TA.fmtNum(partScore(p, checks)), points: TA.fmtNum(p.points) }) + '</div></fieldset>';
      }
      box.innerHTML = h;
    }
    it.parts.forEach(function (p, pi) { tools(pi); });

    function touch() { ps.t = Date.now(); TS.save(); TA.qs('#pscore', el).innerHTML = header(); }

    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-hint],[data-sol]');
      if (!b) return;
      if (b.hasAttribute('data-hint')) {
        var pi = +b.getAttribute('data-hint'), lab = it.parts[pi].label;
        ps.hints[lab] = (ps.hints[lab] || 0) + 1;
        touch(); tools(pi);
      } else {
        var pj = +b.getAttribute('data-sol');
        ps.sol[it.parts[pj].label] = true;
        touch(); tools(pj);
      }
    });
    el.addEventListener('change', function (e) {
      var c = e.target;
      if (!c.hasAttribute || !c.hasAttribute('data-rb')) return;
      var parts = c.getAttribute('data-rb').split(':');
      var pi = +parts[0], j = +parts[1], lab = it.parts[pi].label;
      var arr = ps.rubric[lab] || (ps.rubric[lab] = []);
      arr[j] = c.checked;
      touch();
      var tot = c.closest('.rubric') && c.closest('.rubric').querySelector('.rubric-total strong');
      if (tot) tot.textContent = TA.fmtNum(partScore(it.parts[pi], arr));
    });
    el.addEventListener('input', function (e) {
      var t = e.target;
      if (!t.classList || !t.classList.contains('answer')) return;
      ps.answers[t.getAttribute('data-label')] = t.value;
      ps.t = Date.now();
      TS.saveSoon();
    });
    TA.qs('#preset', el).onclick = function () {
      if (!global.confirm(T('problem_reset_confirm'))) return;
      delete TS.state.problems[it.id];
      TS.save();
      TA.route();
    };
    return {};
  }

  TA.views.problems = {
    mount: function (el, r) {
      if (r.args[0]) {
        var it = TA.bank.byId[r.args[0]];
        if (it && it.type === 'problem') return problemView(el, it);
        el.innerHTML = '<section class="card-plain"><p>' + esc(T('problem_not_found', { id: r.args[0] })) + '</p><a class="btn" href="#/problems">' + esc(T('problems_all')) + '</a></section>';
        return {};
      }
      return listView(el, r);
    }
  };
})(window);
