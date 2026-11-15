/* Dashboard view + progress helpers */
(function (global) {
  'use strict';
  var TA = global.TA, esc = TA.esc;

  /* {seen, mastered} for any item */
  TA.itemProgress = function (it) {
    if (it.type === 'note') { var r = !!TS.state.notesRead[it.id]; return { seen: r, mastered: r }; }
    if (it.type === 'problem') {
      var st = TA.problemStatus ? TA.problemStatus(it) : 'new';
      return { seen: st !== 'new', mastered: st === 'solved' };
    }
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
    return '<div class="pbar" title="seen ' + t.seen + ', mastered ' + t.mastered + ' of ' + t.total + '">' +
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

  var TYPES_SHOWN = ['note', 'card', 'tf', 'mc', 'gap', 'problem'];

  function matrix(groups) {
    // groups: [{label, items}]
    return '<div class="table-wrap"><table class="matrix"><thead><tr><th></th>' +
      TYPES_SHOWN.map(function (t) { return '<th>' + TB.TYPE_LABELS[t] + '</th>'; }).join('') + '</tr></thead><tbody>' +
      groups.map(function (g) {
        return '<tr><th scope="row">' + g.label + '</th>' + TYPES_SHOWN.map(function (t) {
          return '<td>' + bar(tally(g.items.filter(function (it) { return it.type === t; }))) + '</td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
  }

  TA.mockHistoryTable = function () {
    var ms = TS.state.mocks;
    if (!ms.length) return '<p class="dim">No mock midterms yet.</p>';
    return '<div class="table-wrap"><table class="list"><thead><tr><th>Date</th><th>Score</th><th>%</th><th>Breakdown</th><th>Time used</th></tr></thead><tbody>' +
      ms.slice().reverse().map(function (m) {
        return '<tr><td>' + esc(TA.fmtDate(m.date)) + '</td><td><strong>' + TA.fmtNum(m.score) + '</strong> / ' + TA.fmtNum(m.total) + '</td><td>' +
          TA.pct(m.score, m.total) + '%</td><td class="small">' + (m.parts || []).map(function (p) {
            return esc(p.label) + ' ' + TA.fmtNum(p.score) + '/' + TA.fmtNum(p.max);
          }).join(' · ') + '</td><td>' + (m.minutesUsed != null ? m.minutesUsed + ' min' : '') + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  };

  TA.views.dashboard = {
    mount: function (el) {
      var items = TA.bank.items;
      var d = TA.daysLeft();
      var mistakes = items.filter(function (it) { return (it.type === 'tf' || it.type === 'mc') && TA.isMistake(it.id); }).length;
      var active = TS.state.mockActive;
      var weak = TA.weakTopics().slice(0, 5);
      var html = '';

      html += '<section class="hero card-plain"><div class="hero-count"><span class="hero-num">' + Math.max(0, d) + '</span><span class="hero-unit">' +
        (d === 1 ? 'day' : 'days') + '</span></div><div><h1>' + esc(TA.countdownText()) + '</h1><p class="dim">Midterm: Wednesday, 18 November 2026 · 30 points · ' +
        'Q1 ten true/false, Q2 a definition with gaps, then three problems.</p></div></section>';

      html += '<section class="actions">';
      if (active && active.phase !== 'done') html += '<a class="btn btn-primary" href="#/mock">Resume mock midterm</a>';
      html += '<a class="btn' + (mistakes ? ' btn-primary' : '') + '" href="#/mistakes?start=1">Drill my mistakes <span class="badge">' + mistakes + '</span></a>' +
        '<a class="btn" href="#/tf?start=1&len=10">10 random T/F</a>' +
        '<a class="btn" href="#/mc?start=1&len=10">10 quiz questions</a>' +
        '<a class="btn" href="#/gap?start=1&len=1">One definition</a>' +
        '<a class="btn" href="#/cards?start=1">Flashcards</a>' +
        (active && active.phase !== 'done' ? '' : '<a class="btn" href="#/mock">Start mock midterm</a>') + '</section>';

      if (!items.length) {
        html += '<section class="card-plain"><p>No content is loaded. Open the page with <code>?sample=1</code> to see sample items.</p></section>';
      }

      html += '<div class="grid2"><section class="card-plain"><h2>Progress</h2><table class="list compact"><tbody>' +
        TYPES_SHOWN.map(function (t) {
          var its = items.filter(function (it) { return it.type === t; });
          var tl = tally(its);
          return '<tr><th scope="row">' + TB.TYPE_LABELS[t] + '</th><td>' + bar(tl) + '</td><td class="small dim">' + tl.seen + ' seen</td></tr>';
        }).join('') + '</tbody></table><p class="small dim">Bars: light = seen, dark = mastered (two correct answers in a row; notes: read; problems: ≥ 80 % self-graded).</p></section>';

      html += '<section class="card-plain"><h2>Weakest topics</h2>';
      if (!weak.length) html += '<p class="dim">Answer a few questions first; topics with at least 3 answers are ranked here.</p>';
      else html += '<table class="list compact"><tbody>' + weak.map(function (w) {
        return '<tr><th scope="row">' + esc(TA.topicLabel(w.topic)) + '</th><td class="small">' + Math.round(100 * w.acc) + '% correct of ' + w.n +
          '</td><td class="right"><a class="btn btn-sm" href="#/tf?start=1&topic=' + encodeURIComponent(w.topic) + '">T/F</a> <a class="btn btn-sm" href="#/learn?topic=' +
          encodeURIComponent(w.topic) + '">Notes</a></td></tr>';
      }).join('') + '</tbody></table>';
      html += '</section></div>';

      var topics = TA.topicsPresent(items);
      html += '<section class="card-plain"><h2>By topic</h2>' + matrix(topics.map(function (t) {
        return { label: esc(t.label), items: items.filter(function (it) { return TB.topicKey(it.topic) === t.id; }) };
      })) + '</section>';
      html += '<section class="card-plain"><h2>By lecture</h2>' + matrix([1, 2, 3, 4, 5, 6, 7].map(function (l) {
        return { label: '<a href="#/learn/' + l + '">L' + l + '</a> <span class="dim small">' + esc(TB.LECTURES[l]) + '</span>', items: items.filter(function (it) { return it.lecture === l; }) };
      })) + '</section>';
      html += '<section class="card-plain"><h2>Mock midterms</h2>' + TA.mockHistoryTable() + '</section>';
      el.innerHTML = html;
      return {};
    }
  };
})(window);
