/* Shared text renderer for the contract's markup subset.
 * Used by the app (lenient) and by selftest.html (strict: KaTeX throwOnError, errors collected).
 * Classic script: exposes window.TR.
 *
 * Markup: paragraphs, headings (###), lists, **bold**, *italic*, $maths$,
 * $$display maths$$, [[inline code]], ~~~ fenced code blocks ~~~,
 * ![caption](assets/image.png) figures and pipe tables.
 * Inside code, @@ stands for a backtick and $@ for a dollar sign (so the
 * forbidden sequences never appear in a String.raw template literal).
 */
(function (global) {
  'use strict';

  var MS = '\u0002', ME = '\u0003';          // maths placeholder delimiters
  var GS = '\u0001';                          // gap placeholder delimiter
  var IS = '\u0004', IE = '\u0005';          // inline code placeholders
  var BS = '\u0006', BE = '\u0007';          // block code placeholders

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

  function normalize(src) {
    return String(src == null ? '' : src).replace(/\r\n?/g, '\n');
  }

  /* ---------- code ---------- */
  function codeText(s) {
    return s.replace(/\$@/g, '$').replace(/@@/g, '`');
  }

  function renderCode(code, lang) {
    return '<pre class="code-block"' + (lang ? ' data-lang="' + esc(lang) + '"' : '') +
      '><code>' + esc(codeText(code)) + '</code></pre>';
  }

  /* Fenced blocks: a line of three or more tildes opens/closes. */
  function extractFences(src, store, opts) {
    var lines = src.split('\n'), out = [], i = 0;
    while (i < lines.length) {
      var m = /^\s{0,3}(~~~+)\s*([\w+#.-]*)\s*$/.exec(lines[i]);
      if (!m) { out.push(lines[i++]); continue; }
      var fence = m[1], body = [], j = i + 1, closed = false;
      while (j < lines.length) {
        if (new RegExp('^\\s{0,3}' + fence + '\\s*$').test(lines[j])) { closed = true; break; }
        body.push(lines[j++]);
      }
      if (!closed && opts && opts.errors) opts.errors.push({ tex: '', message: 'unclosed code block' });
      store.push({ code: body.join('\n'), lang: m[2] || '' });
      out.push(BS + (store.length - 1) + BE);
      i = closed ? j + 1 : j;
    }
    return out.join('\n');
  }

  function extractInlineCode(src, store) {
    return src.replace(/\[\[([\s\S]+?)\]\]/g, function (m, code) {
      store.push(code);
      return IS + (store.length - 1) + IE;
    });
  }

  /* ---------- maths ---------- */
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

  function restoreInlineCode(html, store) {
    return html.replace(new RegExp(IS + '(\\d+)' + IE, 'g'), function (m, i) {
      return store[+i] == null ? '' : '<code>' + esc(codeText(store[+i])) + '</code>';
    });
  }

  function restoreBlockCode(html, store) {
    return html.replace(new RegExp(BS + '(\\d+)' + BE, 'g'), function (m, i) {
      var b = store[+i];
      return b ? renderCode(b.code, b.lang) : '';
    });
  }

  /* Remove code regions and maths: for checks on plain text. */
  function stripCode(src) {
    src = normalize(src);
    var dummy = [];
    src = extractFences(src, dummy, {});
    src = extractInlineCode(src, dummy);
    return src.replace(new RegExp(BS + '\\d+' + BE, 'g'), ' ')
      .replace(new RegExp(IS + '\\d+' + IE, 'g'), ' ');
  }

  function stripMath(src) {
    var store = [];
    var s = extractMath(stripCode(src).replace(/\\\$/g, '  '), store);
    s = s.replace(new RegExp(MS + '\\d+' + ME, 'g'), ' ');
    return s.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/<gap>|<\/gap>/g, '');
  }

  /* ---------- inline markup ---------- */
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

  /* ---------- figures & tables ---------- */
  function safeAsset(src) {
    return /^assets\/[A-Za-z0-9._\/-]+$/.test(src) && src.indexOf('..') < 0;
  }

  function figureHtml(alt, src, opts) {
    if (!safeAsset(src)) {
      if (opts && opts.errors) opts.errors.push({ tex: '', message: 'figure path must be a relative assets/... path: ' + src });
      return '<span class="figure-error">[figure: ' + esc(alt || src) + ']</span>';
    }
    return '<figure class="md-figure"><img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy">' +
      (alt ? '<figcaption>' + inlineMarkup(esc(alt)) + '</figcaption>' : '') + '</figure>';
  }

  function splitRow(line) {
    var t = line.trim();
    if (t.charAt(0) === '|') t = t.slice(1);
    if (t.charAt(t.length - 1) === '|') t = t.slice(0, -1);
    return t.split('|').map(function (c) { return c.trim(); });
  }

  function isSeparator(line) {
    if (!/^\s*\|?[\s:|-]+\|?\s*$/.test(line) || line.indexOf('-') < 0) return false;
    return splitRow(line).every(function (c) { return /^:?-{2,}:?$/.test(c); });
  }

  function alignOf(cell) {
    var a = cell.charAt(0) === ':', b = cell.charAt(cell.length - 1) === ':';
    if (a && b) return 'center';
    if (b) return 'right';
    if (a) return 'left';
    return '';
  }

  function tableHtml(rows, aligns) {
    var head = rows[0], body = rows.slice(1);
    function cell(tag, text, i) {
      var al = aligns[i] ? ' style="text-align:' + aligns[i] + '"' : '';
      return '<' + tag + al + '>' + inlineMarkup(text) + '</' + tag + '>';
    }
    return '<div class="table-wrap"><table class="md-table"><thead><tr>' +
      head.map(function (c, i) { return cell('th', c, i); }).join('') + '</tr></thead><tbody>' +
      body.map(function (r) {
        return '<tr>' + head.map(function (_, i) { return cell('td', r[i] == null ? '' : r[i], i); }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
  }

  /* Block structure on escaped text. */
  function blocks(src, store, opts) {
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

      // fenced code block placeholder: own block
      if (new RegExp('^' + BS + '\\d+' + BE + '$').test(t)) { flush(); out.push(t); continue; }

      // figure: own block
      if ((m = /^!\[([^\]]*)\]\(([^)\s]+)\)$/.exec(t))) {
        flush();
        out.push(figureHtml(m[1], m[2], opts));
        continue;
      }

      // pipe table: header line followed by a separator line
      if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && isSeparator(lines[i + 1])) {
        flush();
        var rows = [splitRow(line)];
        var aligns = splitRow(lines[i + 1]).map(alignOf);
        i += 2;
        while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { rows.push(splitRow(lines[i])); i++; }
        i--;
        out.push(tableHtml(rows, aligns));
        continue;
      }

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

  /* Full block rendering. */
  function renderText(src, opts) {
    opts = opts || {};
    var fences = [], inline = [], math = [];
    var s = normalize(src);
    s = extractFences(s, fences, opts);
    s = extractInlineCode(s, inline);
    s = extractMath(s, math);
    s = esc(s);
    var html = blocks(s, math, opts);
    html = restoreMath(html, math, opts);
    html = restoreInlineCode(html, inline);
    html = restoreBlockCode(html, fences);
    return html;
  }

  /* Inline rendering (no paragraphs): titles, options, gap contents. */
  function renderInline(src, opts) {
    opts = opts || {};
    var inline = [], math = [];
    var s = normalize(src).replace(/\s*\n\s*/g, ' ');
    s = extractInlineCode(s, inline);
    s = extractMath(s, math);
    s = esc(s);
    s = inlineMarkup(s);
    s = restoreMath(s, math, opts);
    s = restoreInlineCode(s, inline);
    return s;
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
      opts.errors.push({ tex: '', message: 'Only ' + found + ' of ' + gaps.length + ' gaps could be placed (gap inside maths or code?)' });
    }
    return { html: html, gaps: gaps, placed: found };
  }

  global.TR = {
    esc: esc,
    hasKatex: hasKatex,
    renderText: renderText,
    renderInline: renderInline,
    renderGapText: renderGapText,
    renderMath: renderMath,
    safeAsset: safeAsset,
    stripMath: stripMath,
    stripCode: stripCode
  };
})(window);
