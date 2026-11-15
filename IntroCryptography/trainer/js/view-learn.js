/* Learn: notes reader and flashcards */
(function (global) {
  'use strict';
  var TA = global.TA, esc = TA.esc;

  function tabs(active) {
    return '<div class="subtabs"><a href="#/learn"' + (active === 'notes' ? ' class="active"' : '') + '>Notes</a><a href="#/cards"' +
      (active === 'cards' ? ' class="active"' : '') + '>Flashcards</a></div>';
  }

  function notesByLecture() {
    var by = {};
    TA.ofType('note').forEach(function (n) { (by[n.lecture] = by[n.lecture] || []).push(n); });
    Object.keys(by).forEach(function (l) {
      by[l].sort(function (a, b) { return (a.order - b.order) || (a.id < b.id ? -1 : 1); });
    });
    return by;
  }

  /* ================= Notes ================= */
  TA.views.learn = {
    mount: function (el, r) {
      var by = notesByLecture();
      var lec = parseInt(r.args[0], 10);
      var focusId = r.args[1] || null;
      if (r.query.topic) {
        var hit = TA.ofType('note').filter(function (n) { return TB.topicKey(n.topic) === r.query.topic; })
          .sort(function (a, b) { return a.lecture - b.lecture || a.order - b.order; })[0];
        if (hit) { lec = hit.lecture; focusId = hit.id; }
      }
      if (!(lec >= 1 && lec <= 7)) {
        lec = 1;
        for (var l = 1; l <= 7; l++) {
          if ((by[l] || []).some(function (n) { return !TS.state.notesRead[n.id]; })) { lec = l; break; }
        }
      }
      var notes = by[lec] || [];

      function tocHtml() {
        var s = '<div class="toc-inner"><div class="toc-title">Lectures</div>';
        for (var l = 1; l <= 7; l++) {
          var ns = by[l] || [];
          var read = ns.filter(function (n) { return TS.state.notesRead[n.id]; }).length;
          s += '<a class="toc-lec' + (l === lec ? ' active' : '') + '" href="#/learn/' + l + '"><span>L' + l + ' · ' + esc(TB.LECTURES[l]) + '</span><span class="toc-count">' +
            (ns.length ? read + '/' + ns.length : '–') + '</span></a>';
          if (l === lec && ns.length) {
            s += '<ol class="toc-notes">' + ns.map(function (n) {
              return '<li class="' + (TS.state.notesRead[n.id] ? 'read' : '') + '"><a href="#/learn/' + l + '/' + encodeURIComponent(n.id) + '">' +
                TA.safe(function () { return TA.mdi(n.title); }, n.id) + '</a></li>';
            }).join('') + '</ol>';
          }
        }
        return s + '</div>';
      }

      var body = '<header class="reader-head"><div class="eyebrow">Lecture ' + lec + '</div><h1>' + esc(TB.LECTURES[lec]) + '</h1>' +
        '<p class="dim small" id="read-count"></p></header>';
      if (!notes.length) body += '<p class="dim">No notes for this lecture yet.</p>';
      notes.forEach(function (n) {
        body += '<article class="note" id="note-' + esc(n.id) + '" data-id="' + esc(n.id) + '">' + TA.safe(function () {
          var cross = /^mix-/.test(n.id);
          return '<h2>' + TA.mdi(n.title) + '</h2>' +
            '<div class="meta"><span>' + esc(TA.topicLabel(n.topic)) + '</span>' + (n.source ? '<span>' + esc(n.source) + '</span>' : '') +
            (cross ? '<span class="tag">cross-lecture</span>' : '') + '</div>' +
            '<div class="prose">' + TA.md(n.body) + '</div>';
        }, n.id) + '<div class="note-foot"><button class="btn btn-sm read-toggle" data-id="' + esc(n.id) + '"></button></div></article>';
      });
      var nav = '<div class="reader-nav">' + (lec > 1 ? '<a class="btn" href="#/learn/' + (lec - 1) + '">← Lecture ' + (lec - 1) + '</a>' : '<span></span>') +
        (lec < 7 ? '<a class="btn" href="#/learn/' + (lec + 1) + '">Lecture ' + (lec + 1) + ' →</a>' : '') + '</div>';

      el.innerHTML = tabs('notes') + '<div class="learn"><details class="toc-details"' + (global.innerWidth > 860 ? ' open' : '') +
        '><summary>Contents · Lecture ' + lec + '</summary><nav class="toc" id="toc">' + tocHtml() + '</nav></details><div class="reader">' + body + nav + '</div></div>';

      function refresh() {
        TA.qsa('.read-toggle', el).forEach(function (b) {
          var on = !!TS.state.notesRead[b.getAttribute('data-id')];
          b.textContent = on ? 'Read ✓ (undo)' : 'Mark as read';
          b.classList.toggle('btn-done', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
          var art = b.closest('.note'); if (art) art.classList.toggle('is-read', on);
        });
        var read = notes.filter(function (n) { return TS.state.notesRead[n.id]; }).length;
        var rc = TA.qs('#read-count', el);
        if (rc) rc.textContent = notes.length ? read + ' of ' + notes.length + ' sections read' : '';
        TA.qs('#toc', el).innerHTML = tocHtml();
      }
      refresh();

      el.addEventListener('click', function (e) {
        var b = e.target.closest('.read-toggle');
        if (!b) return;
        var id = b.getAttribute('data-id');
        if (TS.state.notesRead[id]) delete TS.state.notesRead[id];
        else TS.state.notesRead[id] = Date.now();
        TS.save();
        refresh();
      });

      function scrollTo(id) {
        if (!id) { global.scrollTo(0, 0); return; }
        var t = document.getElementById('note-' + id);
        if (t) setTimeout(function () { t.scrollIntoView({ block: 'start' }); }, 0);
      }
      scrollTo(focusId);

      return {
        update: function (r2) {
          var l2 = parseInt(r2.args[0], 10);
          if (r2.query.topic || l2 !== lec || !r2.args[1]) return false;
          scrollTo(r2.args[1]);
          return true;
        }
      };
    }
  };

  /* ================= Flashcards ================= */
  TA.views.cards = {
    mount: function (el, r) {
      var all = TA.ofType('card');
      var S = TS.state.settings;
      var filt = { lecture: r.query.lecture || '', topic: r.query.topic || '', unseen: false, mistakes: false, len: S.cardLen || 20 };
      var sess = null;

      function setup() {
        sess = null;
        var n = TA.applyFilters(all, filt).length;
        el.innerHTML = tabs('cards') + '<section class="card-plain setup"><h1>Flashcards</h1>' +
          TA.filterBar({ items: all, fields: ['lecture', 'topic', 'unseen', 'mistakes', 'len'], values: filt }) +
          '<div class="setup-foot"><span class="dim" id="match">' + n + ' cards match</span><button class="btn btn-primary" id="start"' + (n ? '' : ' disabled') + '>Start ' + TA.kbd('Enter') + '</button></div>' +
          '<p class="small dim">Space flips the card; then ' + TA.kbd('K') + ' knew it, ' + TA.kbd('D') + ' didn’t know. Cards you did not know come back a few cards later.</p></section>';
        el.querySelector('.filters').addEventListener('change', function () {
          filt = TA.readFilters(el);
          var m = TA.applyFilters(all, filt).length;
          TA.qs('#match', el).textContent = m + ' cards match';
          TA.qs('#start', el).disabled = !m;
        });
        TA.qs('#start', el).onclick = start;
      }

      function start() {
        filt = TA.readFilters(el);
        S.cardLen = filt.len; TS.saveSoon();
        var deck = TA.schedule(TA.applyFilters(all, filt), filt.len);
        if (!deck.length) return;
        sess = { deck: deck, i: 0, flipped: false, answered: {}, again: {}, knew: 0, didnt: 0, total: deck.length };
        show();
      }

      function show() {
        if (sess.i >= sess.deck.length) return summary();
        var c = sess.deck[sess.i];
        var html = tabs('cards') + '<div class="drill-top"><span>Card ' + (sess.i + 1) + ' / ' + sess.deck.length + '</span><span>Knew ' + sess.knew + ' · Didn’t ' + sess.didnt +
          '</span><button class="btn btn-sm btn-ghost" id="quit">End session</button></div>';
        html += '<section class="flash' + (sess.flipped ? ' flipped' : '') + '">' + TA.metaLine(c, sess.flipped) +
          '<div class="flash-face prose">' + TA.safe(function () { return TA.md(c.front); }, c.id) + '</div>';
        if (sess.flipped) {
          html += '<hr class="flash-rule"><div class="flash-face prose">' + TA.safe(function () { return TA.md(c.back); }, c.id) + '</div>';
        }
        html += '</section><div class="drill-actions">';
        if (!sess.flipped) html += '<button class="btn btn-primary" data-a="flip">Show answer ' + TA.kbd('Space') + '</button>';
        else html += '<button class="btn btn-bad" data-a="no">Didn’t know ' + TA.kbd('D') + '</button><button class="btn btn-good" data-a="yes">Knew it ' + TA.kbd('K') + '</button>';
        html += '</div>';
        el.innerHTML = html;
        TA.qs('#quit', el).onclick = summary;
        TA.qsa('[data-a]', el).forEach(function (b) {
          b.onclick = function () { act(b.getAttribute('data-a')); };
        });
      }

      function act(a) {
        if (!sess || sess.i >= sess.deck.length) return;
        var c = sess.deck[sess.i];
        if (a === 'flip') { sess.flipped = true; return show(); }
        if (!sess.flipped) return;
        var knew = a === 'yes';
        if (!sess.answered[c.id]) {
          sess.answered[c.id] = true;
          TS.record(c.id, knew);
          if (knew) sess.knew++; else sess.didnt++;
        }
        if (!knew && (sess.again[c.id] || 0) < 2) {
          sess.again[c.id] = (sess.again[c.id] || 0) + 1;
          var pos = Math.min(sess.deck.length, sess.i + 4);
          sess.deck.splice(pos, 0, c);
        }
        sess.i++;
        sess.flipped = false;
        show();
      }

      function summary() {
        if (!sess) return setup();
        var s = sess;
        sess = null;
        el.innerHTML = tabs('cards') + '<section class="card-plain"><h1>Session done</h1><p class="big">Knew <strong>' + s.knew + '</strong> of ' +
          (s.knew + s.didnt) + ' cards on first sight.</p><div class="actions"><button class="btn btn-primary" id="again">New session ' + TA.kbd('Enter') + '</button><a class="btn" href="#/dashboard">Dashboard</a></div></section>';
        TA.qs('#again', el).onclick = setup;
      }

      if (r.query.start) { setup(); start(); } else setup();

      return {
        onKey: function (e) {
          var k = e.key.toLowerCase();
          if (!sess) {
            if (k === 'enter') { e.preventDefault(); var b = TA.qs('#start', el) || TA.qs('#again', el); if (b && !b.disabled) b.click(); }
            return;
          }
          if (k === ' ' || k === 'spacebar') { e.preventDefault(); if (!sess.flipped) act('flip'); }
          else if (k === 'k' || k === 'arrowright' || k === '1') { if (sess.flipped) act('yes'); }
          else if (k === 'd' || k === 'arrowleft' || k === '2') { if (sess.flipped) act('no'); }
          else if (k === 'escape') summary();
        }
      };
    }
  };
})(window);
