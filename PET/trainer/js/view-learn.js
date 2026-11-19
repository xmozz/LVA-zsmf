/* Learn: notes reader and flashcards */
(function (global) {
  'use strict';
  var TA = global.TA, esc = TA.esc, T = TA.t;

  function tabs(active) {
    var hasNotes = TA.ofType('note').length, hasCards = TA.ofType('card').length;
    return '<div class="subtabs">' +
      (hasNotes ? '<a href="#/learn"' + (active === 'notes' ? ' class="active"' : '') + '>' + esc(T('learn_notes')) + '</a>' : '') +
      (hasCards ? '<a href="#/cards"' + (active === 'cards' ? ' class="active"' : '') + '>' + esc(T('learn_cards')) + '</a>' : '') +
      '</div>';
  }

  function notesByUnit() {
    var by = {};
    TA.ofType('note').forEach(function (n) { (by[String(n.lecture)] = by[String(n.lecture)] || []).push(n); });
    Object.keys(by).forEach(function (l) {
      by[l].sort(function (a, b) { return (a.order - b.order) || (a.id < b.id ? -1 : 1); });
    });
    return by;
  }

  function unitById(id) { return TB.UNITS.filter(function (u) { return String(u.id) === String(id); })[0]; }

  /* ================= Notes ================= */
  TA.views.learn = {
    mount: function (el, r) {
      var by = notesByUnit();
      var units = TB.UNITS.length ? TB.UNITS : TA.unitsPresent(TA.ofType('note'));
      var cur = units.filter(function (u) { return String(u.id) === String(r.args[0]); })[0];
      var focusId = r.args[1] || null;
      if (r.query.topic) {
        var hit = TA.ofType('note').filter(function (n) { return TB.topicKey(n.topic) === r.query.topic; })
          .sort(function (a, b) { return TB.unitIndex(a.lecture) - TB.unitIndex(b.lecture) || a.order - b.order; })[0];
        if (hit) { cur = unitById(hit.lecture); focusId = hit.id; }
      }
      if (!cur) {
        cur = units.filter(function (u) {
          return (by[String(u.id)] || []).some(function (n) { return !TS.state.notesRead[n.id]; });
        })[0] || units[0];
      }
      var lec = cur ? cur.id : null;
      var notes = lec === null ? [] : (by[String(lec)] || []);

      function tocHtml() {
        var s = '<div class="toc-inner"><div class="toc-title">' + esc(T('learn_contents')) + '</div>';
        units.forEach(function (u) {
          var ns = by[String(u.id)] || [];
          var read = ns.filter(function (n) { return TS.state.notesRead[n.id]; }).length;
          var active = String(u.id) === String(lec);
          s += '<a class="toc-lec' + (active ? ' active' : '') + '" href="#/learn/' + encodeURIComponent(u.id) + '"><span>' + esc(u.label || u.id) + ' · ' + esc(u.title) + '</span><span class="toc-count">' +
            (ns.length ? read + '/' + ns.length : '–') + '</span></a>';
          if (active && ns.length) {
            s += '<ol class="toc-notes">' + ns.map(function (n) {
              return '<li class="' + (TS.state.notesRead[n.id] ? 'read' : '') + '"><a href="#/learn/' + encodeURIComponent(u.id) + '/' + encodeURIComponent(n.id) + '">' +
                TA.safe(function () { return TA.mdi(n.title); }, n.id) + '</a></li>';
            }).join('') + '</ol>';
          }
        });
        return s + '</div>';
      }

      var body = cur ? '<header class="reader-head"><div class="eyebrow">' + esc(T('unit_label', { n: cur.id })) + '</div><h1>' + esc(cur.title) + '</h1>' +
        '<p class="dim small" id="read-count"></p></header>' : '';
      if (!notes.length) body += '<p class="dim">' + esc(T('learn_no_notes')) + '</p>';
      notes.forEach(function (n) {
        body += '<article class="note" id="note-' + esc(n.id) + '" data-id="' + esc(n.id) + '">' + TA.safe(function () {
          return '<h2>' + TA.mdi(n.title) + '</h2>' +
            '<div class="meta"><span>' + esc(TA.topicLabel(n.topic)) + '</span>' + (n.source ? '<span>' + esc(n.source) + '</span>' : '') + '</div>' +
            '<div class="prose">' + TA.md(n.body) + '</div>';
        }, n.id) + '<div class="note-foot"><button class="btn btn-sm read-toggle" data-id="' + esc(n.id) + '"></button></div></article>';
      });

      var idx = cur ? units.map(function (u) { return String(u.id); }).indexOf(String(cur.id)) : -1;
      var prev = idx > 0 ? units[idx - 1] : null;
      var next = idx >= 0 && idx < units.length - 1 ? units[idx + 1] : null;
      var nav = '<div class="reader-nav">' +
        (prev ? '<a class="btn" href="#/learn/' + encodeURIComponent(prev.id) + '">' + esc(T('learn_prev_unit', { n: prev.label || prev.id })) + '</a>' : '<span></span>') +
        (next ? '<a class="btn" href="#/learn/' + encodeURIComponent(next.id) + '">' + esc(T('learn_next_unit', { n: next.label || next.id })) + '</a>' : '') + '</div>';

      el.innerHTML = tabs('notes') + '<div class="learn"><details class="toc-details"' + (global.innerWidth > 860 ? ' open' : '') +
        '><summary>' + esc(T('learn_contents_unit', { n: cur ? cur.id : '–' })) + '</summary><nav class="toc" id="toc">' + tocHtml() + '</nav></details><div class="reader">' + body + nav + '</div></div>';

      function refresh() {
        TA.qsa('.read-toggle', el).forEach(function (b) {
          var on = !!TS.state.notesRead[b.getAttribute('data-id')];
          b.textContent = on ? T('learn_read_undo') : T('learn_mark_read');
          b.classList.toggle('btn-done', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
          var art = b.closest('.note'); if (art) art.classList.toggle('is-read', on);
        });
        var read = notes.filter(function (n) { return TS.state.notesRead[n.id]; }).length;
        var rc = TA.qs('#read-count', el);
        if (rc) rc.textContent = notes.length ? T('learn_sections_read', { read: read, total: notes.length }) : '';
        var toc = TA.qs('#toc', el); if (toc) toc.innerHTML = tocHtml();
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
          var l2 = r2.args[0];
          if (r2.query.topic || (l2 != null && String(l2) !== String(lec)) || !r2.args[1]) return false;
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

      function matchText(n) { return T(n === 1 ? 'match_one' : 'match_many', { n: n, noun: T('noun_item_many') }); }

      function setup() {
        sess = null;
        var n = TA.applyFilters(all, filt).length;
        el.innerHTML = tabs('cards') + '<section class="card-plain setup"><h1>' + esc(T('cards_title')) + '</h1>' +
          TA.filterBar({ items: all, fields: ['lecture', 'topic', 'unseen', 'mistakes', 'len'], values: filt }) +
          '<div class="setup-foot"><span class="dim" id="match">' + matchText(n) + '</span><button class="btn btn-primary" id="start"' + (n ? '' : ' disabled') + '>' + esc(T('cards_start')) + ' ' + TA.kbd('Enter') + '</button></div>' +
          '<p class="small dim">' + esc(T('cards_help')) + '</p></section>';
        el.querySelector('.filters').addEventListener('change', function () {
          filt = TA.readFilters(el);
          var m = TA.applyFilters(all, filt).length;
          TA.qs('#match', el).textContent = matchText(m);
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
        var html = tabs('cards') + '<div class="drill-top"><span>' + esc(T('cards_counter', { i: sess.i + 1, n: sess.deck.length })) + '</span><span>' +
          esc(T('cards_tally', { knew: sess.knew, didnt: sess.didnt })) +
          '</span><button class="btn btn-sm btn-ghost" id="quit">' + esc(T('cards_end')) + '</button></div>';
        html += '<section class="flash' + (sess.flipped ? ' flipped' : '') + '">' + TA.metaLine(c, sess.flipped) +
          '<div class="flash-face prose">' + TA.safe(function () { return TA.md(c.front); }, c.id) + '</div>';
        if (sess.flipped) {
          html += '<hr class="flash-rule"><div class="flash-face prose">' + TA.safe(function () { return TA.md(c.back); }, c.id) + '</div>';
        }
        html += '</section><div class="drill-actions">';
        if (!sess.flipped) html += '<button class="btn btn-primary" data-a="flip">' + esc(T('cards_flip')) + ' ' + TA.kbd('Space') + '</button>';
        else html += '<button class="btn btn-bad" data-a="no">' + esc(T('cards_didnt')) + ' ' + TA.kbd('D') + '</button><button class="btn btn-good" data-a="yes">' + esc(T('cards_knew')) + ' ' + TA.kbd('K') + '</button>';
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
        el.innerHTML = tabs('cards') + '<section class="card-plain"><h1>' + esc(T('cards_done')) + '</h1><p class="big">' +
          T('cards_done_text', { knew: s.knew, total: s.knew + s.didnt }) + '</p><div class="actions"><button class="btn btn-primary" id="again">' + esc(T('new_session')) + ' ' + TA.kbd('Enter') + '</button>' +
          '<a class="btn" href="#/dashboard">' + esc(T('back_dashboard')) + '</a></div></section>';
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
