/* Constants, item validation and the in-memory bank. Shared by app and selftest. window.TB */
(function (global) {
  'use strict';

  var TOPICS = [
    { id: 'historical', label: 'Historical ciphers', lectures: '1' },
    { id: 'principles', label: 'Principles & syntax', lectures: '1–2' },
    { id: 'perfect-secrecy', label: 'Perfect secrecy & OTP', lectures: '2' },
    { id: 'block-ciphers', label: 'Block ciphers', lectures: '3' },
    { id: 'stream-ciphers', label: 'Stream ciphers', lectures: '4' },
    { id: 'computational', label: 'Computational security', lectures: '4' },
    { id: 'prg', label: 'PRGs & pseudorandomness', lectures: '5' },
    { id: 'reductions', label: 'Proofs by reduction', lectures: '5–6' },
    { id: 'cpa-prf', label: 'CPA security, PRFs, PRPs', lectures: '6' },
    { id: 'modes', label: 'Modes of operation', lectures: '7' },
    { id: 'cca', label: 'CCA security & malleability', lectures: '7' }
  ];
  var OTHER = { id: 'other', label: 'Other', lectures: '' };
  var TOPIC_MAP = {};
  TOPICS.forEach(function (t) { TOPIC_MAP[t.id] = t; });

  var LECTURES = {
    1: 'Introduction & historical ciphers',
    2: 'Perfect secrecy',
    3: 'Block ciphers',
    4: 'Stream ciphers & computational security',
    5: 'Pseudorandomness & reductions',
    6: 'CPA security & PRFs',
    7: 'Modes of operation & CCA'
  };

  var ORIGINS = ['slides', 'exam', 'sample', 'exercise', 'variant'];
  var ORIGIN_LABELS = { slides: 'Slides', exam: 'Old exam', sample: 'Sample midterm', exercise: 'Exercise sheet', variant: 'Variant', other: 'Other' };
  var TYPES = ['note', 'card', 'tf', 'mc', 'gap', 'problem'];
  var TYPE_LABELS = { note: 'Notes', card: 'Flashcards', tf: 'True/False', mc: 'Quiz', gap: 'Definitions', problem: 'Problems' };

  function topicOf(id) { return TOPIC_MAP[id] || OTHER; }
  function topicKey(id) { return TOPIC_MAP[id] ? id : 'other'; }
  function isStr(x) { return typeof x === 'string'; }
  function isNonEmptyStr(x) { return typeof x === 'string' && x.trim() !== ''; }
  function isNum(x) { return typeof x === 'number' && isFinite(x); }

  /* Text fields of an item: [{field, value, kind:'block'|'inline'|'gap'}] */
  function textFields(it) {
    var f = [];
    function add(field, value, kind) { if (isStr(value)) f.push({ field: field, value: value, kind: kind || 'block' }); }
    switch (it.type) {
      case 'note': add('title', it.title, 'inline'); add('body', it.body); break;
      case 'card': add('front', it.front); add('back', it.back); break;
      case 'tf': add('statement', it.statement); add('explanation', it.explanation); break;
      case 'mc':
        add('question', it.question);
        if (Array.isArray(it.options)) it.options.forEach(function (o, i) { add('options[' + i + ']', o, 'inline'); });
        add('explanation', it.explanation);
        break;
      case 'gap': add('title', it.title, 'inline'); add('text', it.text, 'gap'); add('note', it.note); break;
      case 'problem':
        add('title', it.title, 'inline'); add('statement', it.statement);
        if (Array.isArray(it.parts)) it.parts.forEach(function (p, i) {
          if (!p || typeof p !== 'object') return;
          var pre = 'parts[' + i + '].';
          add(pre + 'prompt', p.prompt);
          if (Array.isArray(p.hints)) p.hints.forEach(function (h, j) { add(pre + 'hints[' + j + ']', h); });
          add(pre + 'solution', p.solution);
          if (Array.isArray(p.rubric)) p.rubric.forEach(function (r, j) { if (r) add(pre + 'rubric[' + j + '].text', r.text, 'inline'); });
        });
        break;
    }
    return f;
  }

  /* Gap structural checks. Returns {count, fatal:[], errors:[], warnings:[]} */
  function checkGaps(text) {
    var res = { count: 0, fatal: [], errors: [], warnings: [] };
    var opens = (text.match(/<gap>/g) || []).length;
    var closes = (text.match(/<\/gap>/g) || []).length;
    if (opens !== closes) res.fatal.push('unbalanced gap tags: ' + opens + ' <gap> vs ' + closes + ' </gap>');
    // nesting
    var depth = 0, nested = false, re = /<(\/?)gap>/g, m;
    while ((m = re.exec(text))) {
      depth += m[1] ? -1 : 1;
      if (depth > 1) nested = true;
      if (depth < 0) { res.fatal.push('</gap> before matching <gap>'); depth = 0; }
    }
    if (nested) res.fatal.push('nested gaps');
    // gap opened inside $...$ : count single $ before each <gap>, ignoring $$...$$ and \$
    var noDisplay = text.replace(/\$\$[\s\S]*?\$\$/g, ' ').replace(/\\\$/g, '  ');
    var idx = 0, dollars = 0;
    var gre = /<gap>([\s\S]*?)<\/gap>/g;
    while ((m = gre.exec(noDisplay))) {
      dollars += (noDisplay.slice(idx, m.index).match(/\$/g) || []).length;
      if (dollars % 2 === 1) res.fatal.push('gap ' + (res.count + 1) + ' is opened inside $...$');
      var inner = (m[1].match(/\$/g) || []).length;
      if (inner % 2 === 1) res.fatal.push('gap ' + (res.count + 1) + ' has unbalanced $ inside');
      idx = m.index + m[0].length;
      res.count++;
    }
    if (/<gap>\s*<\/gap>/.test(text)) res.errors.push('empty gap');
    return res;
  }

  /* Validate and normalize. Returns {item (normalized copy or null), fatal:[], errors:[], warnings:[]}.
   * fatal  -> the app cannot use the item (skipped)
   * errors -> contract violation the app tolerates
   * warnings -> style / soft rules */
  function validateItem(raw) {
    var fatal = [], errors = [], warnings = [];
    var r = { item: null, fatal: fatal, errors: errors, warnings: warnings };
    if (!raw || typeof raw !== 'object') { fatal.push('not an object'); return r; }
    var it = {};
    for (var k in raw) if (Object.prototype.hasOwnProperty.call(raw, k)) it[k] = raw[k];

    if (!isNonEmptyStr(it.id)) fatal.push('id: missing or not a string');
    else if (!/^[a-z0-9-]+$/.test(it.id)) errors.push('id: must match [a-z0-9-]+');
    if (TYPES.indexOf(it.type) < 0) fatal.push('type: unknown "' + it.type + '"');

    if (typeof it.lecture === 'string' && /^[1-7]$/.test(it.lecture)) { errors.push('lecture: string instead of integer'); it.lecture = +it.lecture; }
    if (!(isNum(it.lecture) && it.lecture % 1 === 0 && it.lecture >= 1 && it.lecture <= 7)) fatal.push('lecture: must be an integer 1–7 (got ' + JSON.stringify(it.lecture) + ')');

    if (!isNonEmptyStr(it.topic)) { errors.push('topic: missing'); it.topic = 'other'; }
    else if (!TOPIC_MAP[it.topic]) errors.push('topic: unknown "' + it.topic + '" (shown under Other)');
    if (!isNonEmptyStr(it.origin)) { errors.push('origin: missing'); it.origin = 'other'; }
    else if (ORIGINS.indexOf(it.origin) < 0) errors.push('origin: unknown "' + it.origin + '"');
    if (!isNonEmptyStr(it.source)) { errors.push('source: missing'); it.source = ''; }
    if (it.difficulty === undefined) { errors.push('difficulty: missing'); it.difficulty = 2; }
    else if ([1, 2, 3].indexOf(it.difficulty) < 0) { errors.push('difficulty: must be 1, 2 or 3'); it.difficulty = Math.min(3, Math.max(1, Math.round(+it.difficulty) || 2)); }

    if (fatal.length) return r;

    switch (it.type) {
      case 'note':
        if (!isNonEmptyStr(it.body)) fatal.push('body: missing');
        if (!isNonEmptyStr(it.title)) { errors.push('title: missing'); it.title = it.id; }
        if (it.order === undefined) { warnings.push('order: missing'); it.order = 9999; }
        else if (!isNum(it.order)) { errors.push('order: not a number'); it.order = +it.order || 9999; }
        break;
      case 'card':
        if (!isNonEmptyStr(it.front)) fatal.push('front: missing');
        if (!isNonEmptyStr(it.back)) fatal.push('back: missing');
        break;
      case 'tf':
        if (!isNonEmptyStr(it.statement)) fatal.push('statement: missing');
        if (typeof it.answer !== 'boolean') fatal.push('answer: must be boolean true/false (got ' + JSON.stringify(it.answer) + ')');
        if (!isNonEmptyStr(it.explanation)) { errors.push('explanation: missing'); it.explanation = ''; }
        break;
      case 'mc':
        if (!isNonEmptyStr(it.question)) fatal.push('question: missing');
        if (!Array.isArray(it.options) || it.options.length < 2) fatal.push('options: need an array of 3–5 strings');
        else {
          if (it.options.length < 3 || it.options.length > 5) errors.push('options: ' + it.options.length + ' options (contract: 3–5)');
          if (it.options.length > 9) fatal.push('options: too many');
          it.options.forEach(function (o, i) { if (!isStr(o)) fatal.push('options[' + i + ']: not a string'); });
          if (!(isNum(it.correct) && it.correct % 1 === 0 && it.correct >= 0 && it.correct < it.options.length)) fatal.push('correct: must be a valid index (got ' + JSON.stringify(it.correct) + ')');
          var seen = {};
          it.options.forEach(function (o, i) { if (isStr(o)) { var k2 = o.trim(); if (seen[k2]) errors.push('options[' + i + ']: duplicate option'); seen[k2] = 1; } });
        }
        if (!isNonEmptyStr(it.explanation)) { errors.push('explanation: missing'); it.explanation = ''; }
        break;
      case 'gap':
        if (!isNonEmptyStr(it.text)) { fatal.push('text: missing'); break; }
        var g = checkGaps(it.text);
        g.fatal.forEach(function (x) { fatal.push('text: ' + x); });
        g.errors.forEach(function (x) { errors.push('text: ' + x); });
        if (g.count === 0) fatal.push('text: no <gap>...</gap>');
        else if (g.count < 3 || g.count > 7) warnings.push('text: ' + g.count + ' gaps (contract: 3–7)');
        if (!isNonEmptyStr(it.title)) { errors.push('title: missing'); it.title = 'Definition'; }
        if (!(isNum(it.points) && it.points > 0)) { errors.push('points: missing or invalid (using 5)'); it.points = 5; }
        if (it.note !== undefined && !isStr(it.note)) { errors.push('note: not a string'); delete it.note; }
        break;
      case 'problem':
        if (!isNonEmptyStr(it.title)) { errors.push('title: missing'); it.title = it.id; }
        if (it.statement === undefined) { errors.push('statement: missing (use "" if none)'); it.statement = ''; }
        else if (!isStr(it.statement)) { fatal.push('statement: not a string'); }
        if (!Array.isArray(it.parts) || !it.parts.length) { fatal.push('parts: need a non-empty array'); break; }
        var labels = {};
        it.parts = it.parts.map(function (p0, i) {
          var pre = 'parts[' + i + '].';
          if (!p0 || typeof p0 !== 'object') { fatal.push(pre.slice(0, -1) + ': not an object'); return p0; }
          var p = {};
          for (var kk in p0) if (Object.prototype.hasOwnProperty.call(p0, kk)) p[kk] = p0[kk];
          if (!isNonEmptyStr(p.label)) { errors.push(pre + 'label: missing'); p.label = String.fromCharCode(97 + i); }
          if (labels[p.label]) { errors.push(pre + 'label: duplicate "' + p.label + '"'); p.label = p.label + '#' + i; }
          labels[p.label] = 1;
          if (!(isNum(p.points) && p.points > 0)) fatal.push(pre + 'points: must be a positive number');
          if (!isNonEmptyStr(p.prompt)) fatal.push(pre + 'prompt: missing');
          if (!isNonEmptyStr(p.solution)) fatal.push(pre + 'solution: missing');
          if (!Array.isArray(p.hints)) { errors.push(pre + 'hints: must be an array'); p.hints = isStr(p.hints) ? [p.hints] : []; }
          else p.hints = p.hints.filter(function (h, j) { if (!isStr(h)) { errors.push(pre + 'hints[' + j + ']: not a string'); return false; } return true; });
          if (!p.hints.length) warnings.push(pre + 'hints: empty');
          if (!Array.isArray(p.rubric) || !p.rubric.length) { errors.push(pre + 'rubric: missing (a single full-credit item is used)'); p.rubric = [{ points: p.points, text: 'Complete and correct answer' }]; }
          else {
            p.rubric = p.rubric.filter(function (rb, j) {
              if (!rb || !isNum(rb.points) || !isStr(rb.text)) { errors.push(pre + 'rubric[' + j + ']: needs {points:number, text:string}'); return false; }
              return true;
            });
            var sum = p.rubric.reduce(function (a, rb) { return a + rb.points; }, 0);
            if (isNum(p.points) && Math.abs(sum - p.points) > 1e-9) errors.push(pre + 'rubric: points sum to ' + sum + ', part is worth ' + p.points);
          }
          return p;
        });
        if (!fatal.length) {
          it.total = it.parts.reduce(function (a, p) { return a + p.points; }, 0);
          if (it.mock !== undefined && typeof it.mock !== 'boolean') { errors.push('mock: not a boolean'); it.mock = !!it.mock; }
          if (it.mock && (it.total < 3 || it.total > 11)) warnings.push('mock problem worth ' + it.total + ' points (contract: 3–11)');
        }
        break;
    }

    // literal HTML (other than gap tags) outside maths
    textFields(it).forEach(function (f) {
      var t = global.TR ? global.TR.stripMath(f.value) : f.value;
      if (f.kind === 'gap') t = t.replace(/<\/?gap>/g, '');
      var m = /<\/?[a-zA-Z][^>]*>/.exec(t);
      if (m) errors.push(f.field + ': literal HTML "' + m[0].slice(0, 30) + '" (rendered as text)');
      if (/\$\{/.test(f.value)) warnings.push(f.field + ': contains "${"');
      var noMath = global.TR ? global.TR.stripMath(f.value) : f.value;
      if (/(?<!\\)\$/.test(noMath.replace(/<\/?gap>/g, ''))) warnings.push(f.field + ': unmatched $');
    });

    if (!fatal.length) r.item = it;
    return r;
  }

  /* Build the bank from window.CRYPTO_BANK. Returns {items, byId, skipped:[{id,file,reasons}], duplicates:[]} */
  function build(rawList) {
    var items = [], byId = {}, skipped = [], duplicates = [];
    (rawList || []).forEach(function (raw, idx) {
      var res;
      try { res = validateItem(raw); } catch (e) { res = { item: null, fatal: ['validator crashed: ' + e.message], errors: [], warnings: [] }; }
      var id = raw && raw.id ? raw.id : '#' + idx;
      if (!res.item) {
        skipped.push({ id: id, file: raw && raw.__file, reasons: res.fatal });
        if (global.console) console.warn('[trainer] skipping item ' + id + ': ' + res.fatal.join('; '));
        return;
      }
      if (byId[res.item.id]) {
        duplicates.push({ id: res.item.id, file: raw.__file });
        if (global.console) console.warn('[trainer] duplicate id ' + res.item.id + ' (keeping the first)');
        return;
      }
      res.item.__file = raw.__file;
      byId[res.item.id] = res.item;
      items.push(res.item);
    });
    return { items: items, byId: byId, skipped: skipped, duplicates: duplicates };
  }

  global.TB = {
    TOPICS: TOPICS, TOPIC_MAP: TOPIC_MAP, OTHER: OTHER, LECTURES: LECTURES,
    ORIGINS: ORIGINS, ORIGIN_LABELS: ORIGIN_LABELS, TYPES: TYPES, TYPE_LABELS: TYPE_LABELS,
    topicOf: topicOf, topicKey: topicKey, textFields: textFields, checkGaps: checkGaps,
    validateItem: validateItem, build: build
  };
})(window);
