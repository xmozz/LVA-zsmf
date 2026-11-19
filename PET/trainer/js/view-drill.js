/* Generic drill view for types with a `drill` adapter (true/false, quiz, ...).
 * Also the mixed "mistakes" drill. */
(function (global) {
  'use strict';
  var TA = global.TA, esc = TA.esc, T = TA.t;

  function adapterFor(it) { var d = TT.get(it.type); return d && d.drill; }

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

        function pool() { var f = Object.assign({}, filt); if (cfg.forceMistakes) f.mistakes = true; return TA.applyFilters(all, f); }
        function nounMany() {
          if (cfg.nounManyKey) return T(cfg.nounManyKey);
          var d = TT.get(cfg.types[0]);
          return T(d && d.drill ? d.drill.nounManyKey : 'noun_item_many');
        }
        function nounOne(it) {
          var ad = adapterFor(it);
          return ad ? T(ad.nounOneKey) : T('noun_item_one');
        }
        function matchText(n) { return T(n === 1 ? 'match_one' : 'match_many', { n: n, noun: nounMany() }); }

        function setup() {
          sess = null;
          var n = pool().length;
          var fields = ['lecture', 'topic', 'origin'].concat(cfg.forceMistakes ? [] : ['unseen', 'mistakes']).concat(['len']);
          el.innerHTML = '<section class="card-plain setup"><h1>' + esc(T(cfg.titleKey)) + '</h1><p class="dim">' + esc(T(cfg.introKey)) + '</p>' +
            TA.filterBar({ items: all, fields: fields, values: filt }) +
            '<div class="setup-foot"><span class="dim" id="match">' + matchText(n) + '</span><button class="btn btn-primary" id="start"' + (n ? '' : ' disabled') + '>' + esc(T('start')) + ' ' + TA.kbd('Enter') + '</button></div>' +
            (cfg.forceMistakes && !n ? '<p>' + esc(T('drill_no_mistakes')) + '</p>' : '') +
            '</section>';
          function upd() {
            filt = TA.readFilters(el);
            var m = pool().length;
            TA.qs('#match', el).textContent = matchText(m);
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
          sess = { list: chosen, i: 0, answers: [], answered: false };
          show();
        }

        function scoreLine() {
          var a = sess.answers;
          if (cfg.types.length === 1) {
            var d = TT.get(cfg.types[0]);
            if (d && d.drill && d.drill.scoreLine) return d.drill.scoreLine(a, sess.list);
          }
          var right = a.filter(function (x) { return x.correct === true; }).length;
          return T('drill_correct_of', { right: right, n: a.length });
        }

        function show() {
          if (sess.i >= sess.list.length) return summary();
          var it = sess.list[sess.i];
          var ans = sess.answered ? sess.answers[sess.answers.length - 1] : null;
          var ad = adapterFor(it);
          var noun = nounOne(it);
          var html = '<div class="drill-top"><span>' + esc(T('drill_counter', { noun: noun, i: sess.i + 1, n: sess.list.length })) + '</span><span>' + scoreLine() +
            '</span><button class="btn btn-sm btn-ghost" id="quit">' + esc(T('drill_end')) + ' ' + TA.kbd('Esc') + '</button></div>';
          html += '<section class="drill-card' + (ans ? (ans.correct === true ? ' is-right' : ans.correct === false ? ' is-wrong' : ' is-skip') : '') + '">' +
            TA.metaLine(it, false) + TA.safe(function () { return body(it, ad, ans); }, it.id) + '</section>';
          el.innerHTML = html;
          TA.qs('#quit', el).onclick = summary;
          TA.qsa('[data-ans]', el).forEach(function (b) {
            b.onclick = function () { answer(b.getAttribute('data-ans')); };
          });
          var nx = TA.qs('#next', el);
          if (nx) nx.onclick = next;
        }

        function body(it, ad, ans) {
          if (!ad) return '<div class="render-error">' + esc(T('no_view_for_type', { type: it.type })) + '</div>';
          var h = ad.prompt(it);
          if (!ans) {
            h += ad.controls(it);
          } else {
            if (ad.reveal) h += ad.reveal(it, ans);
            var verdict = ans.correct === true ? T('drill_correct') : ans.correct === false ? T('drill_incorrect') : T('drill_skipped');
            h += '<div class="feedback"><div class="verdict">' + esc(verdict) + (ad.pointsText ? ad.pointsText(it, ans) : '') + '</div>';
            h += ad.feedback(it, ans);
            if (it.explanation) h += '<div class="prose explanation">' + TA.md(it.explanation) + '</div>';
            h += '<div class="source">' + esc(T('source_line', { source: it.source || '—' })) + '</div></div>' +
              '<div class="drill-actions"><button class="btn btn-primary" id="next">' + (sess.i + 1 < sess.list.length ? esc(T('drill_next')) : esc(T('drill_finish'))) + ' ' + TA.kbd('Enter') + '</button></div>';
          }
          return h;
        }

        function answer(v) {
          if (!sess || sess.answered) return;
          var it = sess.list[sess.i];
          var ad = adapterFor(it);
          if (!ad) return;
          var given = ad.parse(v, it);
          if (given === undefined) return;
          var correct = given === null ? null : ad.isCorrect(it, given);
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
          var html = '<section class="card-plain"><h1>' + esc(T('drill_summary')) + '</h1>';
          var d = cfg.types.length === 1 ? TT.get(cfg.types[0]) : null;
          if (d && d.drill && d.drill.summary) html += d.drill.summary(a, s.list);
          else html += '<p class="big">' + T('drill_mc_summary', { right: right, n: a.length, wrong: wrong, skipped: a.length - right - wrong }) + '</p>';
          html += '<div class="actions"><button class="btn btn-primary" id="again">' + esc(T('new_session')) + ' ' + TA.kbd('Enter') + '</button>' +
            (wrong ? '<button class="btn" id="redo">' + esc(T('drill_redo_wrong', { n: wrong })) + '</button>' : '') +
            '<a class="btn" href="#/dashboard">' + esc(T('back_dashboard')) + '</a></div></section>';
          html += '<ol class="review-list">' + a.map(function (x) {
            var it = x.item, ad = adapterFor(it);
            return '<li class="review ' + (x.correct === true ? 'is-right' : x.correct === false ? 'is-wrong' : 'is-skip') + '">' + TA.safe(function () {
              return TA.metaLine(it, true) + (ad ? ad.review(it, x) : '');
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
            var it = sess.list[sess.i], ad = adapterFor(it);
            if (!ad) return;
            if (k === 's') { answer('skip'); return; }
            if (ad.keys && ad.keys[k]) { answer(ad.keys[k]); return; }
            if (ad.numericKeys && /^[1-9]$/.test(k)) answer(String(parseInt(k, 10) - 1));
          }
        };
      }
    };
  }

  TA.views.tf = makeDrill({ types: ['tf'], titleKey: 'drill_title_tf', introKey: 'drill_intro_tf', lenKey: 'tfLen' });
  TA.views.mc = makeDrill({ types: ['mc'], titleKey: 'drill_title_mc', introKey: 'drill_intro_mc', lenKey: 'mcLen' });
  TA.views.mistakes = makeDrill({
    types: ['tf', 'mc'], titleKey: 'drill_title_mistakes', introKey: 'drill_intro_mistakes',
    lenKey: 'tfLen', forceMistakes: true, nounManyKey: 'noun_item_many'
  });
})(window);
