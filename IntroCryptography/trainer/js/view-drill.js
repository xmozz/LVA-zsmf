/* True/False, Quiz (mc) and mixed "mistakes" drills */
(function (global) {
  'use strict';
  var TA = global.TA, esc = TA.esc;

  function tfLabel(v) { return v === true ? 'True' : v === false ? 'False' : 'Skipped'; }

  function makeDrill(cfg) {
    return {
      mount: function (el, r) {
        var all = TA.bank.items.filter(function (it) { return cfg.types.indexOf(it.type) >= 0; });
        var S = TS.state.settings;
        var q = r.query;
        var filt = {
          lecture: q.lecture || '', topic: q.topic || '', origin: q.origin || '',
          unseen: q.unseen === '1', mistakes: cfg.forceMistakes || q.mistakes === '1',
          len: parseInt(q.len, 10) || S[cfg.lenKey] || 10
        };
        var sess = null;
        var lastFilt = null;

        function pool() { var f = Object.assign({}, filt); if (cfg.forceMistakes) f.mistakes = true; return TA.applyFilters(all, f); }

        function setup() {
          sess = null;
          var n = pool().length;
          var fields = ['lecture', 'topic', 'origin'].concat(cfg.forceMistakes ? [] : ['unseen', 'mistakes']).concat(['len']);
          el.innerHTML = '<section class="card-plain setup"><h1>' + cfg.title + '</h1><p class="dim">' + cfg.intro + '</p>' +
            TA.filterBar({ items: all, fields: fields, values: filt }) +
            '<div class="setup-foot"><span class="dim" id="match"></span><button class="btn btn-primary" id="start">Start ' + TA.kbd('Enter') + '</button></div>' +
            (cfg.forceMistakes && !n ? '<p>No open mistakes right now. Items leave this list after two correct answers in a row.</p>' : '') +
            '</section>';
          function upd() {
            filt = TA.readFilters(el);
            var m = pool().length;
            TA.qs('#match', el).textContent = m + ' ' + cfg.noun + (m === 1 ? '' : 's') + ' match';
            TA.qs('#start', el).disabled = !m;
          }
          el.querySelector('.filters').addEventListener('change', upd);
          el.querySelector('.filters').addEventListener('input', upd);
          upd();
          TA.qs('#start', el).onclick = start;
        }

        function start(list) {
          if (TA.qs('.filters', el)) filt = TA.readFilters(el);
          if (cfg.forceMistakes) filt.mistakes = true;
          S[cfg.lenKey] = filt.len; TS.saveSoon();
          var chosen = Array.isArray(list) ? TA.shuffle(list) : TA.schedule(pool(), filt.len);
          if (!chosen.length) return;
          lastFilt = Object.assign({}, filt);
          sess = { list: chosen, i: 0, answers: [], answered: false };
          show();
        }

        function scoreLine() {
          var a = sess.answers;
          var right = a.filter(function (x) { return x.correct === true; }).length;
          var wrong = a.filter(function (x) { return x.correct === false; }).length;
          var tfOnly = cfg.types.length === 1 && cfg.types[0] === 'tf';
          if (tfOnly) return 'Score <strong>' + Math.max(0, right - wrong) + '</strong> <span class="dim small">(+' + right + ' −' + wrong + ')</span>';
          return 'Correct <strong>' + right + '</strong> / ' + a.length;
        }

        function show() {
          if (sess.i >= sess.list.length) return summary();
          var it = sess.list[sess.i];
          var ans = sess.answered ? sess.answers[sess.answers.length - 1] : null;
          var html = '<div class="drill-top"><span>' + cfg.noun.charAt(0).toUpperCase() + cfg.noun.slice(1) + ' ' + (sess.i + 1) + ' / ' + sess.list.length + '</span><span>' + scoreLine() +
            '</span><button class="btn btn-sm btn-ghost" id="quit">End ' + TA.kbd('Esc') + '</button></div>';
          html += '<section class="drill-card' + (ans ? (ans.correct === true ? ' is-right' : ans.correct === false ? ' is-wrong' : ' is-skip') : '') + '">' +
            TA.metaLine(it, false) + TA.safe(function () { return body(it, ans); }, it.id) + '</section>';
          el.innerHTML = html;
          TA.qs('#quit', el).onclick = summary;
          TA.qsa('[data-ans]', el).forEach(function (b) {
            b.onclick = function () { answer(b.getAttribute('data-ans')); };
          });
          var nx = TA.qs('#next', el);
          if (nx) nx.onclick = next;
        }

        function body(it, ans) {
          var h = '';
          if (it.type === 'tf') {
            h += '<div class="statement prose">' + TA.md(it.statement) + '</div>';
            if (!ans) {
              h += '<div class="drill-actions"><button class="btn btn-tf" data-ans="true">True ' + TA.kbd('T') + '</button>' +
                '<button class="btn btn-tf" data-ans="false">False ' + TA.kbd('F') + '</button>' +
                '<button class="btn btn-ghost" data-ans="skip">Skip ' + TA.kbd('S') + '</button></div>';
            }
          } else {
            h += '<div class="statement prose">' + TA.md(it.question) + '</div><div class="opts">' + it.options.map(function (o, i) {
              var cls = 'opt';
              if (ans) {
                if (i === it.correct) cls += ' opt-correct';
                else if (ans.given === i) cls += ' opt-wrong';
              }
              return '<button class="' + cls + '"' + (ans ? ' disabled' : ' data-ans="' + i + '"') + '><span class="opt-key">' + (i + 1) + '</span><span class="opt-text">' +
                TA.mdi(o) + '</span></button>';
            }).join('') + '</div>';
            if (!ans) h += '<div class="drill-actions"><span class="small dim">Keys ' + TA.kbd('1') + '–' + TA.kbd(String(it.options.length)) + '</span><button class="btn btn-ghost" data-ans="skip">Skip ' + TA.kbd('S') + '</button></div>';
          }
          if (ans) {
            var verdict = ans.correct === true ? 'Correct' : ans.correct === false ? 'Incorrect' : 'Skipped';
            var pts = it.type === 'tf' ? (ans.correct === true ? ' · +1' : ans.correct === false ? ' · −1' : ' · 0') : '';
            h += '<div class="feedback"><div class="verdict">' + verdict + pts + '</div>';
            if (it.type === 'tf') h += '<div>The statement is <strong>' + tfLabel(it.answer).toLowerCase() + '</strong>' + (ans.given !== null ? '; you answered ' + tfLabel(ans.given).toLowerCase() : '') + '.</div>';
            else h += '<div>Correct answer: <strong>' + (it.correct + 1) + '</strong></div>';
            if (it.explanation) h += '<div class="prose explanation">' + TA.md(it.explanation) + '</div>';
            h += '<div class="source">Source: ' + esc(it.source || '—') + '</div></div>' +
              '<div class="drill-actions"><button class="btn btn-primary" id="next">' + (sess.i + 1 < sess.list.length ? 'Next' : 'Finish') + ' ' + TA.kbd('Enter') + '</button></div>';
          }
          return h;
        }

        function answer(v) {
          if (!sess || sess.answered) return;
          var it = sess.list[sess.i];
          var given = null;
          if (v !== 'skip') {
            if (it.type === 'tf') given = v === 'true';
            else { given = parseInt(v, 10); if (!(given >= 0 && given < it.options.length)) return; }
          }
          var correct = given === null ? null : (it.type === 'tf' ? given === it.answer : given === it.correct);
          if (correct === null) TS.recordSkip(it.id); else TS.record(it.id, correct);
          sess.answers.push({ item: it, given: given, correct: correct });
          sess.answered = true;
          show();
          var fb = TA.qs('.feedback', el);
          if (fb && fb.getBoundingClientRect().bottom > global.innerHeight) fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }

        function next() {
          if (!sess || !sess.answered) return;
          sess.i++;
          sess.answered = false;
          show();
          global.scrollTo(0, 0);
        }

        function summary() {
          if (!sess) return setup();
          var s = sess;
          sess = null;
          var a = s.answers;
          var right = a.filter(function (x) { return x.correct === true; }).length;
          var wrong = a.filter(function (x) { return x.correct === false; }).length;
          var skipped = a.length - right - wrong;
          var tfOnly = cfg.types.length === 1 && cfg.types[0] === 'tf';
          var html = '<section class="card-plain"><h1>Session summary</h1>';
          if (tfOnly) html += '<p class="big">Exam score <strong>' + Math.max(0, right - wrong) + '</strong> / ' + a.length +
            ' <span class="dim">(' + right + ' correct, ' + wrong + ' incorrect, ' + skipped + ' blank; +1 / −1 / 0, total at least 0)</span></p>';
          else html += '<p class="big"><strong>' + right + '</strong> of ' + a.length + ' correct <span class="dim">(' + wrong + ' incorrect, ' + skipped + ' skipped)</span></p>';
          html += '<div class="actions"><button class="btn btn-primary" id="again">New session ' + TA.kbd('Enter') + '</button>' +
            (wrong ? '<button class="btn" id="redo">Redo the ' + wrong + ' I got wrong</button>' : '') +
            '<a class="btn" href="#/dashboard">Dashboard</a></div></section>';
          html += '<ol class="review-list">' + a.map(function (x) {
            var it = x.item;
            return '<li class="review ' + (x.correct === true ? 'is-right' : x.correct === false ? 'is-wrong' : 'is-skip') + '">' + TA.safe(function () {
              var h = TA.metaLine(it, true);
              if (it.type === 'tf') {
                h += '<div class="prose">' + TA.md(it.statement) + '</div><div class="review-ans">Your answer: <strong>' + tfLabel(x.given) + '</strong> · Correct: <strong>' + tfLabel(it.answer) + '</strong></div>';
              } else {
                h += '<div class="prose">' + TA.md(it.question) + '</div><div class="review-ans">Your answer: <strong>' + (x.given === null ? 'Skipped' : (x.given + 1) + '. ') + '</strong>' +
                  (x.given === null ? '' : TA.mdi(it.options[x.given])) + '<br>Correct: <strong>' + (it.correct + 1) + '.</strong> ' + TA.mdi(it.options[it.correct]) + '</div>';
              }
              if (it.explanation) h += '<div class="prose explanation">' + TA.md(it.explanation) + '</div>';
              return h;
            }, it.id) + '</li>';
          }).join('') + '</ol>';
          el.innerHTML = html;
          TA.qs('#again', el).onclick = function () { setup(); };
          var redo = TA.qs('#redo', el);
          if (redo) redo.onclick = function () { start(a.filter(function (x) { return x.correct === false; }).map(function (x) { return x.item; })); };
          global.scrollTo(0, 0);
        }

        if (q.start) { setup(); if (pool().length) start(); } else setup();

        return {
          onKey: function (e) {
            var k = e.key.toLowerCase();
            if (!sess) {
              if (k === 'enter') { var b = TA.qs('#start', el) || TA.qs('#again', el); if (b && !b.disabled) { e.preventDefault(); b.click(); } }
              return;
            }
            if (k === 'escape') { summary(); return; }
            if (sess.answered) {
              if (k === 'enter' || k === 'n' || k === 'arrowright') { e.preventDefault(); next(); }
              return;
            }
            var it = sess.list[sess.i];
            if (k === 's') { answer('skip'); return; }
            if (it.type === 'tf') {
              if (k === 't') answer('true');
              else if (k === 'f') answer('false');
            } else if (/^[1-9]$/.test(k)) {
              answer(String(parseInt(k, 10) - 1));
            }
          }
        };
      }
    };
  }

  TA.views.tf = makeDrill({
    types: ['tf'], title: 'True / False', noun: 'statement', lenKey: 'tfLen',
    intro: 'Exam Q1 style: +1 for a correct answer, −1 for a wrong one, 0 for skipping; the session total never goes below 0.'
  });
  TA.views.mc = makeDrill({
    types: ['mc'], title: 'Quiz', noun: 'question', lenKey: 'mcLen',
    intro: 'Multiple choice: exactly one option is correct.'
  });
  TA.views.mistakes = makeDrill({
    types: ['tf', 'mc'], title: 'Drill my mistakes', noun: 'item', lenKey: 'tfLen', forceMistakes: true,
    intro: 'True/false statements and quiz questions you have answered wrongly and not yet answered correctly twice in a row.'
  });
})(window);
