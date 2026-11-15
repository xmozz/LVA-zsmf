/* Shared text renderer for the contract's markup subset.
 * Used by the app (lenient) and by selftest.html (strict: KaTeX throwOnError, errors collected).
 * Classic script: exposes window.TR.
 */
(function (global) {
  'use strict';

  var MS = '\u0002', ME = '\u0003';          // maths placeholder delimiters
  var GS = '\u0001';                          // gap placeholder delimiter

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function hasKatex() {
    return !!(global.katex && typeof global.katex.renderToString === 'function');
  }

  /* opts: { strict: bool, errors: [], warnings: [] } */
  function renderMath(tex, display, opts) {
    opts = opts || {};
    if (!hasKatex()) {
      var raw = display ? '$$' + tex + '$$' : '$' + tex + '$';
      return '<span class="math-raw' + (display ? ' math-raw-display' : '') + '">' + esc(raw) + '</span>';
    }
    var html;
    try {
      html = global.katex.renderToString(tex, {
        displayMode: !!display,
        throwOnError: !!opts.strict,
        strict: opts.strict
          ? function (code, msg) { if (opts.warnings) opts.warnings.push('KaTeX ' + code + ': ' + msg + ' in "' + tex + '"'); return 'ignore'; }
          : 'ignore',
        trust: false
      });
    } catch (e) {
      if (opts.errors) opts.errors.push({ tex: tex, message: String(e && e.message || e) });
      try {
        html = global.katex.renderToString(tex, { displayMode: !!display, throwOnError: false, strict: 'ignore' });
      } catch (e2) {
        html = '<span class="math-raw">' + esc(tex) + '</span>';
      }
    }
    return display ? '<span class="math-display">' + html + '</span>' : html;
  }

  /* Replace maths by placeholders; returns text with placeholders and fills `store`. */
  function extractMath(src, store) {
    src = src.replace(/\$\$([\s\S]+?)\$\$/g, function (m, t) {
      store.push({ tex: t, display: true });
      return MS + (store.length - 1) + ME;
    });
    src = src.replace(/(?<!\\)\$((?:\\[\s\S]|[^$\\])+?)\$/g, function (m, t) {
      store.push({ tex: t, display: false });
      return MS + (store.length - 1) + ME;
    });
    return src.replace(/\\\$/g, '$');
  }

  function restoreMath(html, store, opts) {
    return html.replace(new RegExp(MS + '(\\d+)' + ME, 'g'), function (m, i) {
      var s = store[+i];
      return s ? renderMath(s.tex, s.display, opts) : '';
    });
  }

  /* Bold / italic on already-escaped text (maths are placeholders). */
  function inlineMarkup(s) {
    s = s.replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*\w])\*(?=[^\s*])([^*]*?[^\s*])\*(?![*\w])/g, '$1<em>$2</em>');
    s = s.replace(/(^|[^*\w])\*(?=[^\s*])([^*\s])\*(?![*\w])/g, '$1<em>$2</em>');
    return s;
  }

  var DISPLAY_ONLY = new RegExp('^' + MS + '\\d+' + ME + '$');

  function isDisplayToken(line, store) {
    if (!DISPLAY_ONLY.test(line)) return false;
    var i = +line.slice(1, -1);
    return store[i] && store[i].display;
  }

  /* Block structure on escaped text. */
  function blocks(src, store) {
    var lines = src.split('\n');
    var out = [];
    var cur = null; // {kind:'p'|'ul'|'ol', lines:[], items:[], start}

    function flush() {
      if (!cur) return;
      if (cur.kind === 'p') {
        var text = cur.lines.join(' ').trim();
        if (text) {
          if (isDisplayToken(text, store)) out.push(text);
          else out.push('<p>' + inlineMarkup(text) + '</p>');
        }
      } else {
        var tag = cur.kind;
        var startAttr = (tag === 'ol' && cur.start && cur.start !== 1) ? ' start="' + cur.start + '"' : '';
        out.push('<' + tag + startAttr + '>' + cur.items.map(function (it) {
          return '<li>' + inlineMarkup(it.join(' ').trim()) + '</li>';
        }).join('') + '</' + tag + '>');
      }
      cur = null;
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var t = line.trim();
      if (t === '') { flush(); continue; }
      var m;
      if ((m = /^(#{2,4})\s+(.*)$/.exec(t))) {
        flush();
        var lvl = m[1].length === 2 ? 3 : 4;
        out.push('<h' + lvl + ' class="md-h">' + inlineMarkup(m[2]) + '</h' + lvl + '>');
        continue;
      }
      if ((m = /^[-•]\s+(.*)$/.exec(t))) {
        if (!cur || cur.kind !== 'ul') { flush(); cur = { kind: 'ul', items: [] }; }
        cur.items.push([m[1]]);
        continue;
      }
      if ((m = /^(\d+)[.)]\s+(.*)$/.exec(t))) {
        if (!cur || cur.kind !== 'ol') { flush(); cur = { kind: 'ol', items: [], start: +m[1] }; }
        cur.items.push([m[2]]);
        continue;
      }
      if (isDisplayToken(t, store)) {
        // display maths line: its own block, even without surrounding blank lines
        if (cur && cur.kind !== 'p') {
          cur.items[cur.items.length - 1].push(t); // keep inside list item
          continue;
        }
        flush();
        out.push(t);
        continue;
      }
      if (cur && (cur.kind === 'ul' || cur.kind === 'ol')) {
        cur.items[cur.items.length - 1].push(t); // lazy continuation
        continue;
      }
      if (!cur) cur = { kind: 'p', lines: [] };
      cur.lines.push(t);
    }
    flush();
    return out.join('\n');
  }

  function normalize(src) {
    return String(src == null ? '' : src).replace(/\r\n?/g, '\n');
  }

  /* Full block rendering. */
  function renderText(src, opts) {
    var store = [];
    var s = extractMath(normalize(src), store);
    s = esc(s);
    return restoreMath(blocks(s, store), store, opts);
  }

  /* Inline rendering (no paragraphs): titles, options, gap contents. */
  function renderInline(src, opts) {
    var store = [];
    var s = extractMath(normalize(src).replace(/\s*\n\s*/g, ' '), store);
    s = inlineMarkup(esc(s));
    return restoreMath(s, store, opts);
  }

  /* Split gap text. Returns { gaps: [raw content], html } where each blank is produced by
   * blankFn(index, renderedContentHtml, rawContent). */
  function renderGapText(src, opts, blankFn) {
    var parts = normalize(src).split(/<gap>([\s\S]*?)<\/gap>/);
    var gaps = [];
    var joined = '';
    for (var i = 0; i < parts.length; i++) {
      if (i % 2) { gaps.push(parts[i]); joined += GS + (gaps.length - 1) + GS; }
      else joined += parts[i];
    }
    var html = renderText(joined, opts);
    var found = 0;
    html = html.replace(new RegExp(GS + '(\\d+)' + GS, 'g'), function (m, k) {
      found++;
      return blankFn(+k, renderInline(gaps[+k], opts), gaps[+k]);
    });
    if (found !== gaps.length && opts && opts.errors) {
      opts.errors.push({ tex: '', message: 'Only ' + found + ' of ' + gaps.length + ' gaps could be placed (gap inside maths?)' });
    }
    return { html: html, gaps: gaps, placed: found };
  }

  /* Text with maths removed: for checks like "literal HTML outside maths". */
  function stripMath(src) {
    var store = [];
    return extractMath(normalize(src).replace(/\\\$/g, '  '), store).replace(new RegExp(MS + '\\d+' + ME, 'g'), ' ');
  }

  global.TR = {
    esc: esc,
    hasKatex: hasKatex,
    renderText: renderText,
    renderInline: renderInline,
    renderGapText: renderGapText,
    renderMath: renderMath,
    stripMath: stripMath
  };
})(window);
