/* Mock midterm: paper selection, timed exam, hand-in, self-grading review, result history */
(function (global) {
  'use strict';
  var TA = global.TA, esc = TA.esc;

  function usedIds() {
    var u = {};
    TS.state.mocks.forEach(function (m) { (m.items || []).forEach(function (id) { u[id] = (u[id] || 0) + 1; }); });
    return u;
  }

  /* 10 T/F spread across topics: round robin over topics; inside a topic unused-in-mock first, then unseen, then wrong, then rest */
  function pickTF(used) {
    var by = {};
    TA.ofType('tf').forEach(function (it) { (by[TB.topicKey(it.topic)] = by[TB.topicKey(it.topic)] || []).push(it); });
    Object.keys(by).forEach(function (k) {
      by[k] = TA.shuffle(by[k]).sort(function (a, b) {
        function key(it) {
          var s = TS.stat(it.id);
          return (used[it.id] ? 4 : 0) + (!s ? 0 : TA.isMistake(it.id) ? 1 : 2);
        }
        return key(a) - key(b);
      });
    });
    var topics = TA.shuffle(Object.keys(by));
    var out = [];
    while (out.length < 10 && topics.some(function (t) { return by[t].length; })) {
      topics.forEach(function (t) { if (out.length < 10 && by[t].length) out.push(by[t].shift()); });
    }
    return TA.shuffle(out);
  }

  function pickGap(used) {
    var all = TA.ofType('gap');
    var five = all.filter(function (g) { return g.points === 5; });
    var pool = five.length ? five : all;
    if (!pool.length) return null;
    /* The real Q2 is always a security definition, so prefer those topics over e.g. cipher mechanics. */
    var SEC = { 'perfect-secrecy': 1, 'computational': 1, 'prg': 1, 'cpa-prf': 1, 'cca': 1 };
    var sec = pool.filter(function (g) { return SEC[g.topic]; });
    if (sec.length) pool = sec;
    var fresh = pool.filter(function (g) { return !used[g.id]; });
    var src = fresh.length ? fresh : pool;
    return src[Math.floor(Math.random() * src.length)];
  }

  /* Problems with mock:true totalling 13–17 (ideally 15), different topics, unused first. */
  function pickProblems(used) {
    var cand = TA.ofType('problem').filter(function (p) { return p.mock === true; });
    if (!cand.length) return { list: [], total: 0 };
    if (cand.length > 36) {
      cand = TA.shuffle(cand).sort(function (a, b) { return (used[a.id] ? 1 : 0) - (used[b.id] ? 1 : 0); }).slice(0, 36);
    }
    var best = null, bestCost = Infinity;
    var n = cand.length;
    function evaluate(set) {
      var tot = 0, topics = {}, dup = 0, u = 0;
      set.forEach(function (p) {
        tot += p.total;
        var k = TB.topicKey(p.topic);
        if (topics[k]) dup++;
        topics[k] = 1;
        if (used[p.id]) u += Math.min(3, used[p.id]);
      });
      var cost = Math.abs(tot - 15) * 3 + (tot < 13 || tot > 17 ? 100 + Math.abs(tot - 15) * 10 : 0) +
        dup * 4 + u * 3 + Math.abs(set.length - 3) * 2 + Math.random() * 2.5;
      if (cost < bestCost) { bestCost = cost; best = { list: set.slice(), total: tot }; }
    }
    var maxK = Math.min(5, n);
    (function rec(start, set, tot) {
      if (set.length >= 1) evaluate(set);
      if (set.length >= maxK || tot >= 17) return;
      for (var i = start; i < n; i++) {
        set.push(cand[i]);
        rec(i + 1, set, tot + cand[i].total);
        set.pop();
      }
    })(0, [], 0);
    return best || { list: [], total: 0 };
  }

  function newPaper(minutes) {
    var used = usedIds();
    var tf = pickTF(used), gap = pickGap(used), pr = pickProblems(used);
    var total = tf.length + (gap ? gap.points : 0) + pr.total;
    var now = Date.now();
    return {
      id: 'm' + now, created: now, startedAt: now, minutes: minutes, endsAt: now + minutes * 60000,
      tf: tf.map(function (x) { return x.id; }), gap: gap ? gap.id : null,
      problems: pr.list.map(function (x) { return x.id; }), total: total, phase: 'exam',
      tfAns: {}, gapAtt: {}, ans: {}, gapMarks: {}, rubric: {}, handedAt: null
    };
  }

  function fmtClock(ms) {
    ms = Math.max(0, ms);
    var s = Math.ceil(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    return (h ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (x < 10 ? '0' : '') + x;
  }

  function items(paper) {
    var by = TA.bank.byId;
    return {
      tf: paper.tf.map(function (id) { return by[id]; }).filter(Boolean),
      gap: paper.gap ? by[paper.gap] || null : null,
      problems: paper.problems.map(function (id) { return by[id]; }).filter(Boolean)
    };
  }

  function tfScore(paper, its) {
    var right = 0, wrong = 0, blank = 0;
    its.tf.forEach(function (it) {
      var a = paper.tfAns[it.id];
      if (a === true || a === false) { if (a === it.answer) right++; else wrong++; } else blank++;
    });
    return { right: right, wrong: wrong, blank: blank, score: Math.max(0, right - wrong), max: its.tf.length };
  }

  function probPartScore(paper, p, part) {
    var c = (paper.rubric[p.id] || {})[part.label] || [];
    var s = 0;
    part.rubric.forEach(function (rb, j) { if (c[j]) s += rb.points; });
    return Math.min(s, part.points);
  }

  function breakdown(paper, its) {
    var parts = [];
    var t = tfScore(paper, its);
    parts.push({ label: 'Q1 T/F', score: t.score, max: t.max });
    var q = 2;
    if (its.gap) {
      var cnt = TR.renderGapText(its.gap.text, {}, function () { return ''; }).gaps.length;
      var sc = TA.gapScore(its.gap, { marks: paper.gapMarks }, cnt);
      parts.push({ label: 'Q' + q, score: sc.score, max: its.gap.points, right: sc.right, count: cnt, marked: sc.marked });
      q++;
    }
    its.problems.forEach(function (p) {
      var s = 0;
      p.parts.forEach(function (part) { s += probPartScore(paper, p, part); });
      parts.push({ label: 'Q' + q, score: s, max: p.total, id: p.id });
      q++;
    });
    var score = parts.reduce(function (a, x) { return a + x.score; }, 0);
    var max = parts.reduce(function (a, x) { return a + x.max; }, 0);
    return { parts: parts, score: score, max: max };
  }

  TA.views.mock = {
    mount: function (el) {
      var timer = null;

      function paper() { return TS.state.mockActive; }

      function intro() {
        var tfN = TA.ofType('tf').length;
        var gaps = TA.ofType('gap'), gap5 = gaps.filter(function (g) { return g.points === 5; }).length;
        var probs = TA.ofType('problem').filter(function (p) { return p.mock === true; }).length;
        var warn = [];
        if (tfN < 10) warn.push('Only ' + tfN + ' true/false statements are available.');
        if (!gaps.length) warn.push('No definition (gap) items are available; Q2 is left out.');
        else if (!gap5) warn.push('No 5-point definition is available; another definition is used.');
        if (!probs) warn.push('No problems are marked as suitable for the mock (mock: true); the problem part is left out.');
        el.innerHTML = '<section class="card-plain setup"><h1>Mock midterm</h1>' +
          '<p>Same structure as the real exam: <strong>Q1</strong> ten true/false statements (+1 / −1 / 0, at least 0), <strong>Q2</strong> a 5-point definition with gaps, ' +
          'then <strong>problems worth about 15 points</strong>. Everything on one page, no hints or solutions until you hand in. Your answers and the timer survive a page reload.</p>' +
          (warn.length ? '<div class="notice notice-warn inline"><ul>' + warn.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul></div>' : '') +
          '<div class="filters"><label class="fld fld-num"><span>Duration (minutes)</span><input type="number" id="mins" min="5" max="300" value="' + (TS.state.settings.mockMinutes || 60) + '"></label></div>' +
          '<div class="setup-foot"><span class="dim small">Problems already used in earlier mocks are avoided when possible.</span><button class="btn btn-primary" id="go"' +
          (tfN || gaps.length || probs ? '' : ' disabled') + '>Start mock midterm</button></div></section>' +
          '<section class="card-plain"><h2>Previous results</h2>' + TA.mockHistoryTable() + '</section>';
        TA.qs('#go', el).onclick = function () {
          var m = Math.max(5, Math.min(300, parseInt(TA.qs('#mins', el).value, 10) || 60));
          TS.state.settings.mockMinutes = m;
          TS.state.mockActive = newPaper(m);
          TS.save();
          render();
        };
      }

      function examView(p) {
        var its = items(p);
        var q = 1;
        var h = '<div class="exam-bar"><div><strong>Mock midterm</strong> <span class="dim">· ' + TA.fmtNum(p.total) + ' points · ' + p.minutes + ' min</span></div>' +
          '<div class="exam-timer" id="timer">' + fmtClock(p.endsAt - Date.now()) + '</div><button class="btn btn-primary" id="handin">Hand in</button></div>';
        h += '<div class="paper">';
        if (its.tf.length) {
          h += '<section class="q"><h2 class="q-head"><span>Question ' + q + '</span><span class="pts">' + its.tf.length + ' points</span></h2>' +
            '<p class="q-instr">Decide for each statement whether it is true or false. Correct answers give +1, incorrect −1, blank 0. The total of this question is at least 0.</p><ol class="tf-paper">' +
            its.tf.map(function (it) {
              var a = p.tfAns[it.id];
              return '<li>' + TA.safe(function () {
                return '<div class="prose">' + TA.md(it.statement) + '</div><div class="tf-choice" role="radiogroup">' +
                  '<label><input type="radio" name="tf-' + esc(it.id) + '" data-tf="' + esc(it.id) + '" value="true"' + (a === true ? ' checked' : '') + '> True</label>' +
                  '<label><input type="radio" name="tf-' + esc(it.id) + '" data-tf="' + esc(it.id) + '" value="false"' + (a === false ? ' checked' : '') + '> False</label>' +
                  '<button class="btn btn-sm btn-ghost" data-clear="' + esc(it.id) + '">Clear</button></div>';
              }, it.id) + '</li>';
            }).join('') + '</ol></section>';
          q++;
        }
        if (its.gap) {
          h += '<section class="q"><h2 class="q-head"><span>Question ' + q + '</span><span class="pts">' + TA.fmtNum(its.gap.points) + ' points</span></h2>' +
            '<p class="q-instr">Fill in the gaps: <strong>' + TA.mdi(its.gap.title) + '</strong></p>' + TA.safe(function () {
              return '<div class="prose gap-text">' + TA.renderGapItem(its.gap, { attempts: p.gapAtt, revealed: {}, marks: {}, inputs: true }).html + '</div>';
            }, its.gap.id) + '</section>';
          q++;
        }
        its.problems.forEach(function (pr) {
          h += '<section class="q"><h2 class="q-head"><span>Question ' + q + ' · ' + TA.mdi(pr.title) + '</span><span class="pts">' + TA.fmtNum(pr.total) + ' points</span></h2>' + TA.safe(function () {
            var x = pr.statement ? '<div class="prose">' + TA.md(pr.statement) + '</div>' : '';
            pr.parts.forEach(function (part) {
              var v = (p.ans[pr.id] || {})[part.label] || '';
              x += '<div class="exam-part"><div class="part-head"><span>(' + esc(part.label) + ')</span><span class="pts">' + TA.fmtNum(part.points) + ' P</span></div><div class="prose">' + TA.md(part.prompt) + '</div>' +
                '<textarea class="answer" rows="7" data-p="' + esc(pr.id) + '" data-label="' + esc(part.label) + '" placeholder="Your answer">' + esc(v) + '</textarea></div>';
            });
            return x;
          }, pr.id) + '</section>';
          q++;
        });
        h += '<div class="paper-end"><button class="btn btn-primary" id="handin2">Hand in</button></div></div>';
        el.innerHTML = h;

        el.addEventListener('change', function (e) {
          var t = e.target;
          if (t.hasAttribute('data-tf')) { p.tfAns[t.getAttribute('data-tf')] = t.value === 'true'; TS.saveSoon(); }
        });
        el.addEventListener('input', function (e) {
          var t = e.target;
          if (t.classList.contains('gap-in')) { p.gapAtt[t.getAttribute('data-i')] = t.value; TS.saveSoon(); }
          else if (t.hasAttribute('data-p')) {
            var pid = t.getAttribute('data-p');
            (p.ans[pid] = p.ans[pid] || {})[t.getAttribute('data-label')] = t.value;
            TS.saveSoon();
          }
        });
        el.addEventListener('click', function (e) {
          var c = e.target.closest('[data-clear]');
          if (!c) return;
          var id = c.getAttribute('data-clear');
          delete p.tfAns[id];
          TA.qsa('input[data-tf]', el).forEach(function (r) { if (r.getAttribute('data-tf') === id) r.checked = false; });
          TS.saveSoon();
        });
        function confirmHandIn() {
          var t = tfScore(p, its);
          if (global.confirm('Hand in now?' + (t.blank ? ' ' + t.blank + ' true/false statement(s) are blank.' : '') + ' You cannot change your answers afterwards.')) handIn(false);
        }
        TA.qs('#handin', el).onclick = confirmHandIn;
        TA.qs('#handin2', el).onclick = confirmHandIn;

        timer = setInterval(function () {
          var left = p.endsAt - Date.now();
          var tEl = TA.qs('#timer', el);
          if (tEl) {
            tEl.textContent = fmtClock(left);
            tEl.classList.toggle('low', left < 5 * 60000);
          }
          if (left <= 0) handIn(true);
        }, 1000);
      }

      function handIn(auto) {
        var p = paper();
        if (!p || p.phase !== 'exam') return;
        clearInterval(timer); timer = null;
        var its = items(p);
        p.phase = 'review';
        p.handedAt = Math.min(Date.now(), p.endsAt);
        p.auto = !!auto;
        its.tf.forEach(function (it) {
          var a = p.tfAns[it.id];
          if (a === true || a === false) TS.record(it.id, a === it.answer);
        });
        TS.save();
        render();
        global.scrollTo(0, 0);
      }

      function reviewView(p) {
        var its = items(p);
        var b = breakdown(p, its);
        var t = tfScore(p, its);
        var q = 1;
        var h = '<div class="exam-bar review"><div><strong>Review</strong> <span class="dim">· grade your open answers with the rubrics</span></div><div class="exam-timer" id="live">' +
          TA.fmtNum(b.score) + ' / ' + TA.fmtNum(b.max) + '</div><button class="btn btn-primary" id="finish">Save result</button></div>';
        if (p.auto) h += '<div class="notice notice-info inline">Time was up; the paper was handed in automatically.</div>';
        h += '<div class="paper">';
        if (its.tf.length) {
          h += '<section class="q"><h2 class="q-head"><span>Question ' + q + ' · True/False</span><span class="pts">' + t.score + ' / ' + t.max + '</span></h2><p class="q-instr">' +
            t.right + ' correct, ' + t.wrong + ' incorrect, ' + t.blank + ' blank (graded automatically).</p><ol class="tf-paper">' +
            its.tf.map(function (it) {
              var a = p.tfAns[it.id];
              var cls = a === undefined ? 'is-skip' : a === it.answer ? 'is-right' : 'is-wrong';
              return '<li class="review ' + cls + '">' + TA.safe(function () {
                return '<div class="prose">' + TA.md(it.statement) + '</div><div class="review-ans">Your answer: <strong>' + (a === true ? 'True' : a === false ? 'False' : 'blank') +
                  '</strong> · Correct: <strong>' + (it.answer ? 'True' : 'False') + '</strong> · ' + (cls === 'is-right' ? '+1' : cls === 'is-wrong' ? '−1' : '0') + '</div>' +
                  (it.explanation ? '<div class="prose explanation">' + TA.md(it.explanation) + '</div>' : '') + '<div class="source">' + esc(it.source) + '</div>';
              }, it.id) + '</li>';
            }).join('') + '</ol></section>';
          q++;
        }
        if (its.gap) {
          var g = its.gap;
          h += '<section class="q" id="q-gap"></section>';
          q++;
        }
        its.problems.forEach(function (pr) {
          h += '<section class="q"><h2 class="q-head"><span>Question ' + q + ' · ' + TA.mdi(pr.title) + '</span><span class="pts" data-ptot="' + esc(pr.id) + '"></span></h2>' + TA.safe(function () {
            var x = (pr.statement ? '<div class="prose">' + TA.md(pr.statement) + '</div>' : '');
            pr.parts.forEach(function (part, pi) {
              var v = (p.ans[pr.id] || {})[part.label] || '';
              var checks = (p.rubric[pr.id] || {})[part.label] || [];
              x += '<div class="exam-part"><div class="part-head"><span>(' + esc(part.label) + ')</span><span class="pts">' + TA.fmtNum(part.points) + ' P</span></div><div class="prose">' + TA.md(part.prompt) + '</div>' +
                '<div class="your-answer"><div class="sol-label">Your answer</div>' + (v.trim() ? '<pre class="answer-text">' + esc(v) + '</pre>' : '<p class="dim">(no answer)</p>') + '</div>' +
                '<div class="solution"><div class="sol-label">Model solution</div><div class="prose">' + TA.md(part.solution) + '</div></div>' +
                '<fieldset class="rubric"><legend>Grade yourself</legend>' + part.rubric.map(function (rb, j) {
                  return '<label class="rubric-row"><input type="checkbox" data-rb="' + esc(pr.id) + '|' + esc(part.label) + '|' + j + '"' + (checks[j] ? ' checked' : '') + '><span class="rb-pts">' +
                    TA.fmtNum(rb.points) + '</span><span class="rb-text">' + TA.mdi(rb.text) + '</span></label>';
                }).join('') + '</fieldset></div>';
            });
            return x + '<div class="source">' + esc(pr.source) + '</div>';
          }, pr.id) + '</section>';
          q++;
        });
        h += '<div class="paper-end"><button class="btn btn-primary" id="finish2">Save result</button></div></div>';
        el.innerHTML = h;

        function gapSection() {
          var box = TA.qs('#q-gap', el);
          if (!box || !its.gap) return;
          var gst = { attempts: p.gapAtt, revealed: {}, marks: p.gapMarks, inputs: false };
          var cnt = TR.renderGapText(its.gap.text, {}, function () { return ''; }).gaps.length;
          for (var i = 0; i < cnt; i++) gst.revealed[i] = true;
          var sc = TA.gapScore(its.gap, gst, cnt);
          var qn = its.tf.length ? 2 : 1;
          box.innerHTML = '<h2 class="q-head"><span>Question ' + qn + ' · ' + TA.mdi(its.gap.title) + '</span><span class="pts">' + TA.fmtNum(sc.score) + ' / ' + TA.fmtNum(its.gap.points) + '</span></h2>' +
            TA.safe(function () {
              return '<div class="prose gap-text">' + TA.renderGapItem(its.gap, gst).html + '</div>' + TA.gapMarkTable(its.gap, gst, cnt, false) +
                '<p class="small dim">Marked ' + sc.marked + ' of ' + cnt + ' blanks; unmarked blanks count as wrong.</p>' +
                (its.gap.note ? '<div class="prose explanation">' + TA.md(its.gap.note) + '</div>' : '') + '<div class="source">' + esc(its.gap.source) + '</div>';
            }, its.gap.id);
        }
        function live() {
          var bb = breakdown(p, its);
          TA.qs('#live', el).textContent = TA.fmtNum(bb.score) + ' / ' + TA.fmtNum(bb.max);
          its.problems.forEach(function (pr) {
            var part = bb.parts.filter(function (x) { return x.id === pr.id; })[0];
            var s = TA.qs('[data-ptot="' + pr.id + '"]', el);
            if (s && part) s.textContent = TA.fmtNum(part.score) + ' / ' + TA.fmtNum(part.max);
          });
        }
        gapSection();
        live();

        el.addEventListener('click', function (e) {
          var m = e.target.closest('[data-mark]');
          if (!m) return;
          p.gapMarks[m.getAttribute('data-mark')] = m.getAttribute('data-v') === '1';
          TS.save();
          gapSection(); live();
        });
        el.addEventListener('change', function (e) {
          var c = e.target;
          if (!c.hasAttribute('data-rb')) return;
          var a = c.getAttribute('data-rb').split('|');
          var r = p.rubric[a[0]] || (p.rubric[a[0]] = {});
          var arr = r[a[1]] || (r[a[1]] = []);
          arr[+a[2]] = c.checked;
          TS.save();
          live();
        });
        function fin() {
          var bb = breakdown(p, its);
          var gapPart = bb.parts.filter(function (x) { return x.count !== undefined; })[0];
          if (gapPart && gapPart.marked < gapPart.count && !global.confirm('Some blanks of the definition are not marked; they count as wrong. Save the result anyway?')) return;
          finish(p, its);
        }
        TA.qs('#finish', el).onclick = fin;
        TA.qs('#finish2', el).onclick = fin;
      }

      function finish(p, its) {
        var b = breakdown(p, its);
        var rec = {
          id: p.id, date: p.handedAt || Date.now(), score: b.score, total: b.max,
          parts: b.parts.map(function (x) { return { label: x.label, score: x.score, max: x.max }; }),
          minutesUsed: Math.round(((p.handedAt || Date.now()) - p.startedAt) / 60000), minutes: p.minutes,
          items: p.tf.concat(p.gap ? [p.gap] : [], p.problems)
        };
        // gap result into item stats
        if (its.gap) {
          var gp = b.parts.filter(function (x) { return x.count !== undefined; })[0];
          TS.record(its.gap.id, gp.right === gp.count);
          var g = TS.state.gaps[its.gap.id] || (TS.state.gaps[its.gap.id] = { best: 0, last: 0, n: 0 });
          g.n++; g.last = gp.score; g.best = Math.max(g.best, gp.score);
        }
        // copy problem answers / grading into the problem's own state if it has none yet
        its.problems.forEach(function (pr) {
          var ps = TS.problem(pr.id);
          pr.parts.forEach(function (part) {
            var a = (p.ans[pr.id] || {})[part.label];
            if (a && !(ps.answers[part.label] || '').trim()) ps.answers[part.label] = a;
            ps.sol[part.label] = true;
            var c = (p.rubric[pr.id] || {})[part.label];
            ps.rubric[part.label] = (c || []).slice();
          });
          ps.t = Date.now();
        });
        TS.state.mocks.push(rec);
        TS.state.mockActive = null;
        TS.save();
        resultView(rec);
      }

      function resultView(rec) {
        el.innerHTML = '<section class="card-plain"><h1>Mock result</h1><p class="big"><strong>' + TA.fmtNum(rec.score) + '</strong> / ' + TA.fmtNum(rec.total) +
          ' points <span class="dim">(' + TA.pct(rec.score, rec.total) + '%)</span></p><table class="list compact"><thead><tr><th>Question</th><th>Score</th><th></th></tr></thead><tbody>' +
          rec.parts.map(function (x) {
            return '<tr><th scope="row">' + esc(x.label) + '</th><td>' + TA.fmtNum(x.score) + ' / ' + TA.fmtNum(x.max) + '</td><td style="width:50%">' +
              TA.progressBar({ total: 100, seen: TA.pct(x.score, x.max), mastered: TA.pct(x.score, x.max) }).replace(/<span class="pbar-num">[\s\S]*?<\/span><\/span>/, '') + '</td></tr>';
          }).join('') + '</tbody></table><p class="small dim">Time used: ' + rec.minutesUsed + ' of ' + rec.minutes + ' minutes. Graded problems are also stored under Problems.</p>' +
          '<div class="actions"><button class="btn btn-primary" id="newmock">Start another mock</button><a class="btn" href="#/dashboard">Dashboard</a></div></section>' +
          '<section class="card-plain"><h2>All results</h2>' + TA.mockHistoryTable() + '</section>';
        TA.qs('#newmock', el).onclick = function () { intro(); };
      }

      function render() {
        clearInterval(timer); timer = null;
        var p = paper();
        // a fresh element so listeners from a previous phase are dropped
        var fresh = el.cloneNode(false);
        el.parentNode.replaceChild(fresh, el);
        el = fresh;
        if (!p) return intro();
        if (p.phase === 'exam') {
          if (Date.now() >= p.endsAt) { p.phase = 'exam'; return handIn(true); }
          return examView(p);
        }
        if (p.phase === 'review') return reviewView(p);
        TS.state.mockActive = null; TS.save();
        intro();
      }

      render();

      return {
        destroy: function () { clearInterval(timer); TS.save(); }
      };
    }
  };
})(window);
