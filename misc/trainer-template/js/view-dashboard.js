/* Dashboard view + progress helpers */
(function (global) {
  'use strict';
  var TA = global.TA, esc = TA.esc, T = TA.t;

  /* {seen, mastered} for any item */
  TA.itemProgress = function (it) {
    var def = TT.get(it.type);
    if (def && typeof def.progress === 'function') return def.progress(it);
    return { seen: TS.seen(it.id), mastered: TS.mastered(it.id) };
  };

  function tally(items) {
    var t = { total: items.length, seen: 0, mastered: 0 };
    items.forEach(function (it) { var p = TA.itemProgress(it); if (p.seen) t.seen++; if (p.mastered) t.mastered++; });
    return t;
  }

  function bar(t) {
    if (!t.total) return '<span class="dim">—</span>';
    var s = TA.pct(t.seen, t.total), m = TA.pct(t.mastered, t.total);
    return '<div class="pbar" title="' + esc(T('dash_seen', { n: t.seen })) + ', ' + t.mastered + ' / ' + t.total + '">' +
      '<div class="pbar-track"><div class="pbar-seen" style="width:' + s + '%"></div><div class="pbar-m" style="width:' + m + '%"></div></div>' +
      '<span class="pbar-num">' + t.mastered + '<span class="dim">/' + t.total + '</span></span></div>';
  }
  TA.progressBar = bar;

  /* Weakest topics from the answer log, recent answers weigh more (half-life 2 days). */
  TA.weakTopics = function () {
    var now = Date.now(), HL = 2 * 86400000;
    var agg = {};
    TS.state.log.forEach(function (e) {
      var it = TA.bank.byId[e[0]];
      if (!it) return;
      var k = TB.topicKey(it.topic);
      var w = Math.pow(0.5, (now - e[2]) / HL);
      var a = agg[k] || (agg[k] = { topic: k, w: 0, wrong: 0, n: 0, ok: 0 });
      a.w += w; a.n++;
      if (e[1]) a.ok++; else a.wrong += w;
    });
    // problems: self-graded fraction counts as one weighted answer per problem
    TA.ofType('problem').forEach(function (p) {
      if (!TA.problemScore) return;
      var sc = TA.problemScore(p);
      if (!sc.graded) return;
      var k = TB.topicKey(p.topic);
      var a = agg[k] || (agg[k] = { topic: k, w: 0, wrong: 0, n: 0, ok: 0 });
      a.w += 1; a.n++; a.wrong += 1 - sc.score / sc.total; a.ok += sc.score / sc.total;
    });
    return Object.keys(agg).map(function (k) {
      var a = agg[k];
      a.err = (a.wrong + 0.5) / (a.w + 1); // smoothed
      a.acc = a.n ? a.ok / a.n : 0;
      return a;
    }).filter(function (a) { return a.n >= 3; }).sort(function (x, y) { return y.err - x.err; });
  };

  function matrix(groups, types) {
    return '<div class="table-wrap"><table class="matrix"><thead><tr><th></th>' +
      types.map(function (t) { return '<th>' + esc(TA.typeLabel(t)) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      groups.map(function (g) {
        return '<tr><th scope="row">' + g.label + '</th>' + types.map(function (t) {
          return '<td>' + bar(tally(g.items.filter(function (it) { return it.type === t; }))) + '</td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
  }

  TA.mockHistoryTable = function () {
    var ms = TS.state.mocks;
    if (!ms.length) return '<p class="dim">' + esc(T('dash_no_mocks')) + '</p>';
    return '<div class="table-wrap"><table class="list"><thead><tr><th>' + esc(T('table_date')) + '</th><th>' + esc(T('table_score')) + '</th><th>' + esc(T('table_percent')) +
      '</th><th>' + esc(T('table_breakdown')) + '</th><th>' + esc(T('table_time_used')) + '</th></tr></thead><tbody>' +
      ms.slice().reverse().map(function (m) {
        return '<tr><td>' + esc(TA.fmtDate(m.date)) + '</td><td><strong>' + TA.fmtNum(m.score) + '</strong> / ' + TA.fmtNum(m.total) + '</td><td>' +
          TA.pct(m.score, m.total) + '%</td><td class="small">' + (m.parts || []).map(function (p) {
            return esc(p.label) + ' ' + TA.fmtNum(p.score) + '/' + TA.fmtNum(p.max);
          }).join(' · ') + '</td><td>' + (m.minutesUsed != null ? m.minutesUsed + ' min' : '') + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  };

  function practiceLink(topic) {
    var t = encodeURIComponent(topic);
    function has(type) { return TA.ofType(type).some(function (it) { return TB.topicKey(it.topic) === topic; }); }
    if (has('tf')) return '#/tf?start=1&topic=' + t;
    if (has('mc')) return '#/mc?start=1&topic=' + t;
    if (has('gap')) return '#/gap?start=1&topic=' + t;
    if (has('problem')) return '#/problems?topic=' + t;
    return '#/learn?topic=' + t;
  }

  TA.views.dashboard = {
    mount: function (el) {
      var items = TA.bank.items;
      var d = TA.daysLeft();
      var types = TB.TYPES.filter(function (t) { return TA.ofType(t).length; });
      var mistakes = items.filter(function (it) { return (it.type === 'tf' || it.type === 'mc') && TA.isMistake(it.id); }).length;
      var active = TS.state.mockActive;
      var weak = TA.weakTopics().slice(0, 5);
      var html = '';

      var heroText = TA.examSummary;
      html += '<section class="hero card-plain">' +
        (d === null ? '' : '<div class="hero-count"><span class="hero-num">' + Math.max(0, d) + '</span><span class="hero-unit">' +
          esc(d === 1 ? T('day') : T('days')) + '</span></div>') +
        '<div><h1>' + esc(TA.countdownText() || TA.examName) + '</h1><p class="dim">' + esc(heroText) + '</p>' +
        (TA.isDemo() && !TA.hasRealContent() ? '<p class="small"><span class="demo-tag">' + esc(T('demo_badge')) + '</span></p>' : '') + '</div></section>';

      html += '<section class="actions">';
      if (active && active.phase !== 'done') html += '<a class="btn btn-primary" href="#/mock">' + esc(T('dash_resume_mock', { exam: TA.examName })) + '</a>';
      if (mistakes) html += '<a class="btn btn-primary" href="#/mistakes?start=1">' + esc(T('dash_drill_mistakes')) + ' <span class="badge">' + mistakes + '</span></a>';
      if (TA.ofType('tf').length) html += '<a class="btn" href="#/tf?start=1&len=10">' + esc(T('dash_random_tf')) + '</a>';
      if (TA.ofType('mc').length) html += '<a class="btn" href="#/mc?start=1&len=10">' + esc(T('dash_quiz')) + '</a>';
      if (TA.ofType('gap').length) html += '<a class="btn" href="#/gap?start=1&len=1">' + esc(T('dash_one_definition')) + '</a>';
      if (TA.ofType('card').length) html += '<a class="btn" href="#/cards?start=1">' + esc(T('dash_flashcards')) + '</a>';
      if (TA.ofType('problem').length) html += '<a class="btn" href="#/problems">' + esc(T('nav_problems')) + '</a>';
      if (TA.buildNav().some(function (n) { return n[0] === 'mock'; }) && !(active && active.phase !== 'done')) {
        html += '<a class="btn" href="#/mock">' + esc(T('dash_start_mock', { exam: TA.examName })) + '</a>';
      }
      html += '</section>';

      if (!items.length) {
        html += '<section class="card-plain"><p>' + T('dash_none') + '</p></section>';
      }

      html += '<div class="grid2"><section class="card-plain"><h2>' + esc(T('dash_progress')) + '</h2><table class="list compact"><tbody>' +
        types.map(function (t) {
          var its = items.filter(function (it) { return it.type === t; });
          var tl = tally(its);
          return '<tr><th scope="row">' + esc(TA.typeLabel(t)) + '</th><td>' + bar(tl) + '</td><td class="small dim">' + esc(T('dash_seen', { n: tl.seen })) + '</td></tr>';
        }).join('') + '</tbody></table><p class="small dim">' + esc(T('dash_progress_note')) + '</p></section>';

      html += '<section class="card-plain"><h2>' + esc(T('dash_weakest')) + '</h2>';
      if (!weak.length) html += '<p class="dim">' + esc(T('dash_weak_empty')) + '</p>';
      else html += '<table class="list compact"><tbody>' + weak.map(function (w) {
        return '<tr><th scope="row">' + esc(TA.topicLabel(w.topic)) + '</th><td class="small">' + Math.round(100 * w.acc) + '% · ' + w.n +
          '</td><td class="right"><a class="btn btn-sm" href="' + practiceLink(w.topic) + '">' + esc(T('start')) + '</a></td></tr>';
      }).join('') + '</tbody></table>';
      html += '</section></div>';

      var topics = TA.topicsPresent(items);
      html += '<section class="card-plain"><h2>' + esc(T('dash_by_topic')) + '</h2>' + matrix(topics.map(function (t) {
        return { label: esc(t.label), items: items.filter(function (it) { return TB.topicKey(it.topic) === t.id; }) };
      }), types) + '</section>';
      html += '<section class="card-plain"><h2>' + esc(T('dash_by_unit')) + '</h2>' + matrix(TA.unitsPresent(items).map(function (u) {
        return { label: '<a href="#/learn/' + encodeURIComponent(u.id) + '">' + esc(u.label || u.id) + '</a> <span class="dim small">' + esc(u.title) + '</span>',
          items: items.filter(function (it) { return String(it.lecture) === String(u.id); }) };
      }), types) + '</section>';
      html += '<section class="card-plain"><h2>' + esc(T('dash_mock_history')) + '</h2>' + TA.mockHistoryTable() + '</section>';
      el.innerHTML = html;
      return {};
    }
  };
})(window);
