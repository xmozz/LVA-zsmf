/* Mock exam: blueprint-driven paper, timed exam, hand-in, self-grading review, history.
 * Everything course-specific (sections, points, instruction text) comes from
 * COURSE.blueprint; the picker is in js/blueprint.js. */
(function (global) {
  'use strict';
  var TA = global.TA, esc = TA.esc, T = TA.t;

  function bp() { return (global.COURSE && global.COURSE.blueprint) || { sections: [] }; }
  function sections() { return bp().sections || []; }
  function itemsOf(sec) { return sec.items.map(function (id) { return TA.bank.byId[id]; }).filter(Boolean); }
  function usedIds() {
    var u = {};
    TS.state.mocks.forEach(function (m) { (m.items || []).forEach(function (id) { u[id] = (u[id] || 0) + 1; }); });
    return u;
  }
  function points(n) { return esc(T(n === 1 ? 'problem_points' : 'problem_points_plural', { n: TA.fmtNum(n) })); }

  function newPaper(minutes) {
    var used = usedIds();
    var paper = {
      id: 'm' + Date.now(), created: Date.now(), startedAt: Date.now(), minutes: minutes,
      endsAt: Date.now() + minutes * 60000, phase: 'exam', total: 0,
      sections: []
    };
    sections().forEach(function (def) {
      var pick = BP.pick(def, TA.bank.items, used);
      if (!pick.items.length) return;
      var sec = {
        id: def.id, type: def.type, label: def.label, max: pick.max,
        instructions: def.instructions || '', scoring: def.scoring || {},
        items: pick.items.map(function (x) { return x.id; }),
        answers: {}, text: {}, gapAttempts: {}, gapMarks: {}, rubric: {}
      };
      pick.items.forEach(function (it) { used[it.id] = (used[it.id] || 0) + 1; });
      paper.sections.push(sec);
      paper.total += sec.max;
    });
    return paper;
  }

  function fmtClock(ms) {
    ms = Math.max(0, ms);
    var s = Math.ceil(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    return (h ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (x < 10 ? '0' : '') + x;
  }

  /* ---------- scoring ---------- */
  function sectionScore(sec, detailed) {
    var its = itemsOf(sec);
    var sc = sec.scoring || {};
    var score = 0, max = 0, rows = [];
    if (sec.type === 'tf') {
      var right = 0, wrong = 0, blank = 0;
      its.forEach(function (it) {
        var a = sec.answers[it.id];
        if (a === true || a === false) { if (a === it.answer) right++; else wrong++; } else blank++;
      });
      var plus = sc.plus != null ? sc.plus : 1, minus = sc.minus != null ? sc.minus : 1;
      var bl = sc.blank != null ? sc.blank : 0, floor = sc.floor != null ? sc.floor : 0;
      score = Math.max(floor, right * plus - wrong * minus + blank * bl);
      max = its.length * plus;
      rows.push({ right: right, wrong: wrong, blank: blank });
    } else if (sec.type === 'mc') {
      var r = 0;
      its.forEach(function (it) { if (sec.answers[it.id] === it.correct) r++; });
      score = r * (sc.points != null ? sc.points : 1);
      max = its.length * (sc.points != null ? sc.points : 1);
      rows.push({ right: r, wrong: its.length - r });
    } else if (sec.type === 'gap') {
      its.forEach(function (it) {
        var count = TR.renderGapText(it.text, {}, function () { return ''; }).gaps.length;
        var marks = sec.gapMarks[it.id] || {};
        var g = TA.gapScore(it, { marks: marks }, count);
        score += g.score; max += it.points;
        rows.push({ item: it, right: g.right, count: count, marked: g.marked, score: g.score, max: it.points });
      });
    } else if (sec.type === 'problem') {
      its.forEach(function (it) {
        var s = 0;
        it.parts.forEach(function (part) {
          var checks = (sec.rubric[it.id] || {})[part.label] || [];
          var ps = 0;
          part.rubric.forEach(function (rb, j) { if (checks[j]) ps += rb.points; });
          s += Math.min(ps, part.points);
        });
        score += s; max += it.total;
        rows.push({ item: it, score: s, max: it.total });
      });
    }
    return { score: score, max: max, rows: rows, detailed: detailed };
  }

  function breakdown(paper) {
    var parts = paper.sections.map(function (sec) {
      var s = sectionScore(sec, true);
      return { id: sec.id, label: sec.label, type: sec.type, score: s.score, max: s.max, rows: s.rows };
    });
    return {
      parts: parts,
      score: parts.reduce(function (a, x) { return a + x.score; }, 0),
      max: parts.reduce(function (a, x) { return a + x.max; }, 0)
    };
  }

  TA.views.mock = {
    mount: function (el) {
      var timer = null;
      function paper() { return TS.state.mockActive; }
      function title() { return bp().title || T('mock_title'); }

      function intro() {
        var warnings = [];
        sections().forEach(function (sec) {
          if (!BP.canFill(sec, TA.bank.items)) warnings.push(T('mock_section_missing', { label: sec.label, type: TA.typeLabel(sec.type) }));
          if (sec.type === 'problem' && sec.filters && sec.filters.mock === true &&
              !TA.ofType('problem').some(function (p) { return p.mock === true; }) && TA.ofType('problem').length) {
            warnings.push(T('mock_section_fallback', { label: sec.label }));
          }
        });
        if (!sections().length) warnings.push(T('mock_no_sections'));
        var rows = sections().map(function (sec) {
          var how = sec.count ? sec.count + ' × ' + esc(TA.typeLabel(sec.type))
            : esc(TA.typeLabel(sec.type)) + ' · ' + (sec.pointsMin != null ? sec.pointsMin : '?') + '–' + (sec.pointsMax != null ? sec.pointsMax : '?') + ' ' + esc(T('table_points').toLowerCase());
          return '<tr><th scope="row">' + esc(sec.label) + '</th><td>' + how + '</td><td class="small dim">' + esc(sec.instructions || '') + '</td></tr>';
        }).join('');
        el.innerHTML = '<section class="card-plain setup"><h1>' + esc(title()) + '</h1>' +
          '<p>' + esc(bp().intro || '') + '</p>' +
          (warnings.length ? '<div class="notice notice-warn inline"><ul>' + warnings.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul></div>' : '') +
          (rows ? '<div class="table-wrap"><table class="list compact"><tbody>' + rows + '</tbody></table></div>' : '') +
          '<div class="filters"><label class="fld fld-num"><span>' + esc(T('mock_duration')) + '</span><input type="number" id="mins" min="5" max="' + (bp().maxMinutes || 300) + '" value="' + (TS.state.settings.mockMinutes || bp().minutes || 60) + '"></label></div>' +
          '<div class="setup-foot"><span class="dim small">' + esc(T('mock_used_note')) + '</span><button class="btn btn-primary" id="go"' +
          (sections().some(function (sec) { return BP.canFill(sec, TA.bank.items); }) ? '' : ' disabled') + '>' + esc(T('mock_start', { exam: title() })) + '</button></div></section>' +
          '<section class="card-plain"><h2>' + esc(T('mock_prev_results')) + '</h2>' + TA.mockHistoryTable() + '</section>';
        TA.qs('#go', el).onclick = function () {
          var maxMin = bp().maxMinutes || 300;
          var m = Math.max(5, Math.min(maxMin, parseInt(TA.qs('#mins', el).value, 10) || bp().minutes || 60));
          TS.state.settings.mockMinutes = m;
          TS.state.mockActive = newPaper(m);
          TS.save();
          render();
        };
      }

      function sectionHead(sec, n) {
        return '<h2 class="q-head"><span>' + esc(T('mock_question', { n: n })) + ' · ' + esc(sec.label) + ' · ' + esc(TA.typeLabel(sec.type)) + '</span><span class="pts">' + points(sec.max) + '</span></h2>';
      }

      function examBody(sec) {
        var its = itemsOf(sec);
        var h = '';
        if (sec.type === 'tf') {
          h += '<ol class="tf-paper">' + its.map(function (it) {
            var a = sec.answers[it.id];
            return '<li>' + TA.safe(function () {
              return '<div class="prose">' + TA.md(it.statement) + '</div><div class="tf-choice" role="radiogroup">' +
                '<label><input type="radio" name="tf-' + esc(it.id) + '" data-tf="' + esc(it.id) + '" value="true"' + (a === true ? ' checked' : '') + '> ' + esc(T('drill_true')) + '</label>' +
                '<label><input type="radio" name="tf-' + esc(it.id) + '" data-tf="' + esc(it.id) + '" value="false"' + (a === false ? ' checked' : '') + '> ' + esc(T('drill_false')) + '</label>' +
                '<button class="btn btn-sm btn-ghost" data-clear="' + esc(it.id) + '">' + esc(T('mock_clear')) + '</button></div>';
            }, it.id) + '</li>';
          }).join('') + '</ol>';
        } else if (sec.type === 'mc') {
          h += '<ol class="tf-paper">' + its.map(function (it) {
            var a = sec.answers[it.id];
            return '<li>' + TA.safe(function () {
              return '<div class="prose">' + TA.md(it.question) + '</div><div class="tf-choice tf-choice-col">' + it.options.map(function (o, i) {
                return '<label><input type="radio" name="mc-' + esc(it.id) + '" data-mc="' + esc(it.id) + '" value="' + i + '"' + (a === i ? ' checked' : '') + '> ' + TA.mdi(o) + '</label>';
              }).join('') + '<button class="btn btn-sm btn-ghost" data-clear="' + esc(it.id) + '">' + esc(T('mock_clear')) + '</button></div>';
            }, it.id) + '</li>';
          }).join('') + '</ol>';
        } else if (sec.type === 'gap') {
          its.forEach(function (it) {
            var st = { attempts: sec.gapAttempts[it.id] || (sec.gapAttempts[it.id] = {}), revealed: {}, marks: {}, inputs: true, gapId: it.id };
            h += '<div class="exam-part"><div class="prose"><strong>' + TA.mdi(it.title) + '</strong></div>' + TA.safe(function () {
              return '<div class="prose gap-text">' + TA.renderGapItem(it, st).html + '</div>';
            }, it.id) + '</div>';
          });
        } else if (sec.type === 'problem') {
          its.forEach(function (pr) {
            h += '<div class="exam-part">' + TA.safe(function () {
              var x = pr.statement ? '<div class="prose">' + TA.md(pr.statement) + '</div>' : '';
              pr.parts.forEach(function (part) {
                var v = (sec.text[pr.id] || {})[part.label] || '';
                x += '<div class="exam-part"><div class="part-head"><span>(' + esc(part.label) + ')</span><span class="pts">' + esc(T('mock_points_short', { n: TA.fmtNum(part.points) })) + '</span></div><div class="prose">' + TA.md(part.prompt) + '</div>' +
                  '<textarea class="answer" rows="7" data-p="' + esc(pr.id) + '" data-label="' + esc(part.label) + '" placeholder="' + esc(T('problem_your_answer')) + '">' + esc(v) + '</textarea></div>';
              });
              return x;
            }, pr.id) + '</div>';
          });
        }
        return h;
      }

      function examView(p) {
        var q = 0;
        var h = '<div class="exam-bar"><div><strong>' + esc(title()) + '</strong> <span class="dim">· ' + T('mock_minutes', { points: TA.fmtNum(p.total), minutes: p.minutes }) + '</span></div>' +
          '<div class="exam-timer" id="timer">' + fmtClock(p.endsAt - Date.now()) + '</div><button class="btn btn-primary" id="handin">' + esc(T('mock_hand_in')) + '</button></div>';
        h += '<div class="paper">';
        p.sections.forEach(function (sec) {
          q++;
          h += '<section class="q" data-sec="' + esc(sec.id) + '">' + sectionHead(sec, q) +
            (sec.instructions ? '<p class="q-instr">' + esc(sec.instructions) + '</p>' : '') + examBody(sec) + '</section>';
        });
        h += '<div class="paper-end"><button class="btn btn-primary" id="handin2">' + esc(T('mock_hand_in')) + '</button></div></div>';
        el.innerHTML = h;

        el.addEventListener('change', function (e) {
          var t = e.target;
          if (t.hasAttribute('data-tf')) { secOf(t).answers[t.getAttribute('data-tf')] = t.value === 'true'; TS.saveSoon(); }
          else if (t.hasAttribute('data-mc')) { secOf(t).answers[t.getAttribute('data-mc')] = +t.value; TS.saveSoon(); }
        });
        el.addEventListener('input', function (e) {
          var t = e.target;
          if (t.classList.contains('gap-in')) {
            var sec = secOf(t), gid = t.getAttribute('data-gap');
            var att = sec.gapAttempts[gid] || (sec.gapAttempts[gid] = {});
            att[t.getAttribute('data-i')] = t.value; TS.saveSoon();
          } else if (t.hasAttribute('data-p')) {
            var s2 = secOf(t), pid = t.getAttribute('data-p');
            (s2.text[pid] = s2.text[pid] || {})[t.getAttribute('data-label')] = t.value;
            TS.saveSoon();
          }
        });
        el.addEventListener('click', function (e) {
          var c = e.target.closest('[data-clear]');
          if (!c) return;
          var id = c.getAttribute('data-clear'), sec = secOf(c);
          delete sec.answers[id];
          TA.qsa('input[data-tf], input[data-mc]', el).forEach(function (r) {
            if (r.getAttribute('data-tf') === id || r.getAttribute('data-mc') === id) r.checked = false;
          });
          TS.saveSoon();
        });
        function confirmHandIn() {
          var tfSecs = p.sections.filter(function (s) { return s.type === 'tf'; });
          var blank = 0;
          tfSecs.forEach(function (s) { s.items.forEach(function (id) { var a = s.answers[id]; if (a !== true && a !== false) blank++; }); });
          if (global.confirm(T('mock_confirm_handin', { blank: blank ? T('mock_confirm_blank', { n: blank }) : '' }))) handIn(false);
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

      function secOf(node) {
        var p = paper();
        var box = node.closest ? node.closest('[data-sec]') : null;
        var id = box ? box.getAttribute('data-sec') : null;
        return (p.sections.filter(function (s) { return s.id === id; })[0]) || p.sections[0];
      }

      function handIn(auto) {
        var p = paper();
        if (!p || p.phase !== 'exam') return;
        clearInterval(timer); timer = null;
        p.phase = 'review';
        p.handedAt = Math.min(Date.now(), p.endsAt);
        p.auto = !!auto;
        p.sections.forEach(function (sec) {
          if (sec.type !== 'tf' && sec.type !== 'mc') return;
          itemsOf(sec).forEach(function (it) {
            var a = sec.answers[it.id];
            if (a === undefined) return;
            TS.record(it.id, sec.type === 'tf' ? a === it.answer : a === it.correct);
          });
        });
        TS.save();
        render();
        global.scrollTo(0, 0);
      }

      function reviewSection(sec, n) {
        var its = itemsOf(sec);
        var sc = sectionScore(sec, true);
        var h = '<section class="q" data-sec="' + esc(sec.id) + '">' + sectionHead(sec, n) +
          '<h3 class="small dim" id="score-' + esc(sec.id) + '">' + TA.fmtNum(sc.score) + ' / ' + TA.fmtNum(sc.max) + '</h3>';
        if (sec.type === 'tf') {
          var row = sc.rows[0] || { right: 0, wrong: 0, blank: 0 };
          h += '<p class="q-instr">' + esc(T('mock_graded_auto', { right: row.right, wrong: row.wrong, blank: row.blank })) + '</p><ol class="tf-paper">';
          h += its.map(function (it) {
            var a = sec.answers[it.id];
            var cls = a === undefined ? 'is-skip' : a === it.answer ? 'is-right' : 'is-wrong';
            return '<li class="review ' + cls + '">' + TA.safe(function () {
              return '<div class="prose">' + TA.md(it.statement) + '</div><div class="review-ans">' + esc(T('drill_your_answer')) + ': <strong>' +
                (a === true ? esc(T('drill_true')) : a === false ? esc(T('drill_false')) : esc(T('blank'))) + '</strong> · ' + esc(T('drill_correct_answer')) + ': <strong>' +
                (it.answer ? esc(T('drill_true')) : esc(T('drill_false'))) + '</strong> · ' + (cls === 'is-right' ? '+1' : cls === 'is-wrong' ? '−1' : '0') + '</div>' +
                (it.explanation ? '<div class="prose explanation">' + TA.md(it.explanation) + '</div>' : '') + '<div class="source">' + esc(it.source) + '</div>';
            }, it.id) + '</li>';
          }).join('') + '</ol>';
        } else if (sec.type === 'mc') {
          var r = sc.rows[0] || { right: 0, wrong: 0 };
          h += '<p class="q-instr">' + esc(T('drill_correct_of', { right: r.right, n: its.length })) + '</p><ol class="tf-paper">';
          h += its.map(function (it) {
            var a = sec.answers[it.id];
            var ok = a === it.correct;
            return '<li class="review ' + (a === undefined ? 'is-skip' : ok ? 'is-right' : 'is-wrong') + '">' + TA.safe(function () {
              return '<div class="prose">' + TA.md(it.question) + '</div><div class="review-ans">' + esc(T('drill_your_answer')) + ': <strong>' +
                (a === undefined ? esc(T('drill_skipped')) : (a + 1) + '. ') + '</strong>' + (a === undefined ? '' : TA.mdi(it.options[a])) + '<br>' + esc(T('drill_correct_answer')) + ': <strong>' +
                (it.correct + 1) + '.</strong> ' + TA.mdi(it.options[it.correct]) + '</div>' +
                (it.explanation ? '<div class="prose explanation">' + TA.md(it.explanation) + '</div>' : '') + '<div class="source">' + esc(it.source) + '</div>';
            }, it.id) + '</li>';
          }).join('') + '</ol>';
        } else if (sec.type === 'gap') {
          h += '<div class="gap-review">' + its.map(function (it) {
            var count = TR.renderGapText(it.text, {}, function () { return ''; }).gaps.length;
            var gst = { attempts: sec.gapAttempts[it.id] || {}, revealed: {}, marks: sec.gapMarks[it.id] || {}, inputs: false, gapId: it.id };
            for (var i = 0; i < count; i++) gst.revealed[i] = true;
            var g = TA.gapScore(it, gst, count);
            return TA.safe(function () {
              return '<div class="exam-part"><div class="prose"><strong>' + TA.mdi(it.title) + '</strong></div>' +
                '<div class="prose gap-text">' + TA.renderGapItem(it, gst).html + '</div>' + TA.gapMarkTable(it, gst, count, false) +
                '<p class="small dim">' + esc(T('mock_unmarked', { marked: g.marked, total: count })) + '</p>' +
                (it.note ? '<div class="prose explanation">' + TA.md(it.note) + '</div>' : '') + '<div class="source">' + esc(it.source) + '</div></div>';
            }, it.id);
          }).join('') + '</div>';
        } else if (sec.type === 'problem') {
          h += its.map(function (pr) {
            var prs = sc.rows.filter(function (x) { return x.item.id === pr.id; })[0] || { score: 0, max: pr.total };
            return '<div class="exam-part" data-prob="' + esc(pr.id) + '"><h3 class="q-head"><span>' + TA.mdi(pr.title) + '</span><span class="pts" data-ptot="' + esc(pr.id) + '">' + TA.fmtNum(prs.score) + ' / ' + TA.fmtNum(prs.max) + '</span></h3>' +
              TA.safe(function () {
                var x = pr.statement ? '<div class="prose">' + TA.md(pr.statement) + '</div>' : '';
                pr.parts.forEach(function (part) {
                  var v = (sec.text[pr.id] || {})[part.label] || '';
                  var checks = (sec.rubric[pr.id] || {})[part.label] || [];
                  x += '<div class="exam-part"><div class="part-head"><span>(' + esc(part.label) + ')</span><span class="pts">' + esc(T('mock_points_short', { n: TA.fmtNum(part.points) })) + '</span></div><div class="prose">' + TA.md(part.prompt) + '</div>' +
                    '<div class="your-answer"><div class="sol-label">' + esc(T('problem_your_answer')) + '</div>' + (v.trim() ? '<pre class="answer-text">' + esc(v) + '</pre>' : '<p class="dim">' + esc(T('mock_no_answer')) + '</p>') + '</div>' +
                    '<div class="solution"><div class="sol-label">' + esc(T('problem_model_solution')) + '</div><div class="prose">' + TA.md(part.solution) + '</div></div>' +
                    '<fieldset class="rubric"><legend>' + esc(T('problem_grade')) + '</legend>' + part.rubric.map(function (rb, j) {
                      return '<label class="rubric-row"><input type="checkbox" data-rb="' + esc(sec.id) + '|' + esc(pr.id) + '|' + esc(part.label) + '|' + j + '"' + (checks[j] ? ' checked' : '') + '><span class="rb-pts">' +
                        TA.fmtNum(rb.points) + '</span><span class="rb-text">' + TA.mdi(rb.text) + '</span></label>';
                    }).join('') + '</fieldset></div>';
                });
                return x + '<div class="source">' + esc(pr.source) + '</div>';
              }, pr.id) + '</div>';
          }).join('');
        }
        return h + '</section>';
      }

      function reviewView(p) {
        var b = breakdown(p);
        var q = 0;
        var h = '<div class="exam-bar review"><div><strong>' + esc(T('mock_review')) + '</strong> <span class="dim">· ' + esc(T('mock_review_hint')) + '</span></div><div class="exam-timer" id="live">' +
          TA.fmtNum(b.score) + ' / ' + TA.fmtNum(b.max) + '</div><button class="btn btn-primary" id="finish">' + esc(T('mock_save_result')) + '</button></div>';
        if (p.auto) h += '<div class="notice notice-info inline">' + esc(T('mock_time_up')) + '</div>';
        h += '<div class="paper">';
        p.sections.forEach(function (sec) { q++; h += reviewSection(sec, q); });
        h += '<div class="paper-end"><button class="btn btn-primary" id="finish2">' + esc(T('mock_save_result')) + '</button></div></div>';
        el.innerHTML = h;

        function refreshSection(id) {
          var sec = p.sections.filter(function (s) { return s.id === id; })[0];
          if (!sec) return;
          var n = p.sections.indexOf(sec) + 1;
          var box = TA.qs('[data-sec="' + id + '"]', el);
          if (box) box.outerHTML = reviewSection(sec, n);
        }
        function live() {
          var bb = breakdown(p);
          TA.qs('#live', el).textContent = TA.fmtNum(bb.score) + ' / ' + TA.fmtNum(bb.max);
          bb.parts.forEach(function (part) {
            if (part.type !== 'problem') return;
            part.rows.forEach(function (row) {
              var s = TA.qs('[data-ptot="' + row.item.id + '"]', el);
              if (s) s.textContent = TA.fmtNum(row.score) + ' / ' + TA.fmtNum(row.max);
            });
          });
        }

        el.addEventListener('click', function (e) {
          var m = e.target.closest('[data-mark]');
          if (!m) return;
          var sec = secOf(m);
          var gid = m.getAttribute('data-gap');
          var marks = sec.gapMarks[gid] || (sec.gapMarks[gid] = {});
          marks[m.getAttribute('data-mark')] = m.getAttribute('data-v') === '1';
          TS.save();
          refreshSection(sec.id);
          live();
        });
        el.addEventListener('change', function (e) {
          var c = e.target;
          if (!c.hasAttribute('data-rb')) return;
          var a = c.getAttribute('data-rb').split('|');
          var sec = p.sections.filter(function (s) { return s.id === a[0]; })[0];
          if (!sec) return;
          var r = sec.rubric[a[1]] || (sec.rubric[a[1]] = {});
          var arr = r[a[2]] || (r[a[2]] = []);
          arr[+a[3]] = c.checked;
          TS.save();
          live();
        });
        function fin() {
          var bb = breakdown(p);
          var gapPart = bb.parts.filter(function (x) { return x.type === 'gap'; })[0];
          var unmarked = gapPart && gapPart.rows.some(function (r) { return r.marked < r.count; });
          if (unmarked && !global.confirm(T('mock_unmarked_confirm'))) return;
          finish(p);
        }
        TA.qs('#finish', el).onclick = fin;
        TA.qs('#finish2', el).onclick = fin;
      }

      function finish(p) {
        var b = breakdown(p);
        var rec = {
          id: p.id, date: p.handedAt || Date.now(), score: b.score, total: b.max,
          parts: b.parts.map(function (x) { return { label: x.label, score: x.score, max: x.max }; }),
          minutesUsed: Math.round(((p.handedAt || Date.now()) - p.startedAt) / 60000), minutes: p.minutes,
          items: p.sections.reduce(function (a, s) { return a.concat(s.items); }, [])
        };
        p.sections.forEach(function (sec) {
          if (sec.type === 'gap') {
            itemsOf(sec).forEach(function (it) {
              var count = TR.renderGapText(it.text, {}, function () { return ''; }).gaps.length;
              var g = TA.gapScore(it, { marks: sec.gapMarks[it.id] || {} }, count);
              TS.record(it.id, g.right === g.total);
              var st = TS.state.gaps[it.id] || (TS.state.gaps[it.id] = { best: 0, last: 0, n: 0 });
              st.n++; st.last = g.score; st.best = Math.max(st.best, g.score);
            });
          } else if (sec.type === 'problem') {
            itemsOf(sec).forEach(function (pr) {
              var ps = TS.problem(pr.id);
              pr.parts.forEach(function (part) {
                var a = (sec.text[pr.id] || {})[part.label];
                if (a && !(ps.answers[part.label] || '').trim()) ps.answers[part.label] = a;
                ps.sol[part.label] = true;
                var c = (sec.rubric[pr.id] || {})[part.label];
                ps.rubric[part.label] = (c || []).slice();
              });
              ps.t = Date.now();
            });
          }
        });
        TS.state.mocks.push(rec);
        TS.state.mockActive = null;
        TS.save();
        resultView(rec);
      }

      function resultView(rec) {
        el.innerHTML = '<section class="card-plain"><h1>' + esc(T('mock_result')) + '</h1><p class="big">' +
          T('mock_result_score', { score: TA.fmtNum(rec.score), total: TA.fmtNum(rec.total), pct: TA.pct(rec.score, rec.total) }) + '</p>' +
          '<table class="list compact"><thead><tr><th>' + esc(T('table_question')) + '</th><th>' + esc(T('table_score')) + '</th><th></th></tr></thead><tbody>' +
          rec.parts.map(function (x) {
            return '<tr><th scope="row">' + esc(x.label) + '</th><td>' + TA.fmtNum(x.score) + ' / ' + TA.fmtNum(x.max) + '</td><td style="width:50%">' +
              TA.progressBar({ total: 100, seen: TA.pct(x.score, x.max), mastered: TA.pct(x.score, x.max) }).replace(/<span class="pbar-num">[\s\S]*?<\/span><\/span>/, '') + '</td></tr>';
          }).join('') + '</tbody></table><p class="small dim">' + esc(T('mock_time_used', { used: rec.minutesUsed, total: rec.minutes })) + '</p>' +
          '<div class="actions"><button class="btn btn-primary" id="newmock">' + esc(T('mock_start_another')) + '</button><a class="btn" href="#/dashboard">' + esc(T('back_dashboard')) + '</a></div></section>' +
          '<section class="card-plain"><h2>' + esc(T('mock_all_results')) + '</h2>' + TA.mockHistoryTable() + '</section>';
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
          if (Date.now() >= p.endsAt) return handIn(true);
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
