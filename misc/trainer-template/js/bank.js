/* Course-derived constants, UI strings, item validation and the in-memory bank.
 * Shared by app and selftest. window.TB
 */
(function (global) {
  'use strict';

  var C = global.COURSE || {};
  var UNITS = (C.units || []).slice();
  var UNIT_MAP = {};
  UNITS.forEach(function (u, i) { u.__index = i; UNIT_MAP[String(u.id)] = u; });

  var TOPICS = (C.topics || []).slice();
  var OTHER = { id: 'other', label: 'Other' };
  var TOPIC_MAP = {};
  TOPICS.forEach(function (t) { TOPIC_MAP[t.id] = t; });

  var ORIGINS = (C.origins || []).map(function (o) { return o.id; });
  var ORIGIN_LABELS = {};
  (C.origins || []).forEach(function (o) { ORIGIN_LABELS[o.id] = o.label; });
  if (ORIGINS.indexOf('other') < 0) { ORIGINS.push('other'); ORIGIN_LABELS.other = 'Other'; }

  var TYPES = global.TT ? global.TT.ids() : ['note', 'card', 'tf', 'mc', 'gap', 'problem'];

  /* UI string lookup with {placeholders}. Works without TA (selftest). */
  function t(key, vars) {
    var s = (C.ui && C.ui[key] != null) ? String(C.ui[key]) : key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? String(vars[k]) : m; });
    return s;
  }

  var TYPE_LABELS = {};
  TYPES.forEach(function (id) {
    var key = 'type_' + id;
    TYPE_LABELS[id] = (C.ui && C.ui[key] != null) ? C.ui[key] : id.charAt(0).toUpperCase() + id.slice(1);
  });
  OTHER.label = t('topic_other');
  ORIGIN_LABELS.other = t('origin_other');

  function unitOf(id) {
    var u = UNIT_MAP[String(id)];
    return u || null;
  }
  function unitLabel(id) {
    var u = unitOf(id);
    return u ? (u.label || ('U' + u.id)) : String(id == null ? '' : id);
  }
  function unitIndex(id) {
    var u = unitOf(id);
    return u ? u.__index : 9999;
  }
  function unitTitle(id) {
    var u = unitOf(id);
    return u ? u.title : '';
  }
  function topicOf(id) { return TOPIC_MAP[id] || OTHER; }
  function topicKey(id) { return TOPIC_MAP[id] ? id : 'other'; }
  function originLabel(id) { return ORIGIN_LABELS[id] || id; }
  function isStr(x) { return typeof x === 'string'; }
  function isNonEmptyStr(x) { return typeof x === 'string' && x.trim() !== ''; }
  function isNum(x) { return typeof x === 'number' && isFinite(x); }

  /* Text fields of an item, delegated to the type registry. */
  function textFields(it) {
    return global.TT ? global.TT.textFields(it) : [];
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
    // gap opened inside display maths (check spans, so a gap between two
    // display blocks is not mistaken for one inside them)
    var dspans = [], dm, dre = /\$\$[\s\S]*?\$\$/g;
    while ((dm = dre.exec(text))) dspans.push([dm.index, dm.index + dm[0].length]);
    var gpos = /<gap>/g;
    while ((dm = gpos.exec(text))) {
      if (dspans.some(function (sp) { return dm.index > sp[0] && dm.index < sp[1]; })) {
        res.fatal.push('gap ' + (res.count + 1) + ' is opened inside $$...$$');
        break;
      }
    }
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

  /* Validate and normalize. Returns {item, fatal:[], errors:[], warnings:[]}.
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
    if (!global.TT || !global.TT.has(it.type)) { fatal.push('type: unknown "' + it.type + '"'); return r; }

    // unit: a course unit id (number or short string)
    if (typeof it.lecture === 'string' && unitOf(it.lecture) && typeof unitOf(it.lecture).id === 'number') {
      errors.push('lecture: string instead of integer');
      it.lecture = +it.lecture;
    }
    if (!unitOf(it.lecture)) fatal.push('lecture: must be the id of a configured unit (got ' + JSON.stringify(it.lecture) + ')');

    if (!isNonEmptyStr(it.topic)) { errors.push('topic: missing'); it.topic = 'other'; }
    else if (!TOPIC_MAP[it.topic]) errors.push('topic: unknown "' + it.topic + '" (shown under Other)');
    if (!isNonEmptyStr(it.origin)) { errors.push('origin: missing'); it.origin = 'other'; }
    else if (ORIGINS.indexOf(it.origin) < 0) { errors.push('origin: unknown "' + it.origin + '"'); it.origin = 'other'; }
    if (!isNonEmptyStr(it.source)) { errors.push('source: missing'); it.source = ''; }
    if (it.difficulty === undefined) { errors.push('difficulty: missing'); it.difficulty = 2; }
    else if ([1, 2, 3].indexOf(it.difficulty) < 0) { errors.push('difficulty: must be 1, 2 or 3'); it.difficulty = Math.min(3, Math.max(1, Math.round(+it.difficulty) || 2)); }

    if (fatal.length) return r;

    global.TT.get(it.type).validate(it, function (m) { fatal.push(m); }, function (m) { errors.push(m); }, function (m) { warnings.push(m); });

    // hard text rules and literal HTML outside maths/code
    textFields(it).forEach(function (f) {
      var plain = global.TR ? global.TR.stripMath(f.value) : f.value;
      var m = /<\/?[a-zA-Z][^>]*>/.exec(plain);
      if (m) errors.push(f.field + ': literal HTML "' + m[0].slice(0, 30) + '" (rendered as text)');
      if (f.value.indexOf('\u0060') >= 0) errors.push(f.field + ': contains a backtick (forbidden in content files)');
      if (f.value.indexOf('${') >= 0) errors.push(f.field + ': contains "${" (forbidden in content files)');
      if (/(?<!\\)\$/.test(plain)) warnings.push(f.field + ': unmatched $');
    });

    if (!fatal.length) r.item = it;
    return r;
  }

  /* Build the bank from window.TRAINER_BANK. */
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
    COURSE: C, UNITS: UNITS, UNIT_MAP: UNIT_MAP,
    TOPICS: TOPICS, TOPIC_MAP: TOPIC_MAP, OTHER: OTHER,
    ORIGINS: ORIGINS, ORIGIN_LABELS: ORIGIN_LABELS,
    TYPES: TYPES, TYPE_LABELS: TYPE_LABELS,
    t: t,
    unitOf: unitOf, unitLabel: unitLabel, unitIndex: unitIndex, unitTitle: unitTitle,
    topicOf: topicOf, topicKey: topicKey, originLabel: originLabel,
    textFields: textFields, checkGaps: checkGaps,
    validateItem: validateItem, build: build
  };
})(window);
