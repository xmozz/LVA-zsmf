/* Item-type registry.
 *
 * Every item type declares here how it is validated, which text fields the
 * renderer and the self-test must visit, how it reports progress and — for
 * simple question types — how the generic drill view presents and scores it.
 *
 * To add a type:
 *   1. define it below (or in a new file loaded after this one) with
 *      id, validate, textFields and progress;
 *   2. give it a practice mode: either a `drill` adapter (see tf / mc) and set
 *      route/lengthKey, or a dedicated view file registered in TA.views and
 *      set mode:'view';
 *   3. add an `exam` adapter if the mock exam may contain it;
 *   4. add its label key to COURSE.ui (type_<id>) — the self-test and file
 *      filters pick the type up from this registry automatically.
 *
 * window.TT
 */
(function (global) {
  'use strict';

  var defs = {}, order = [];

  function isStr(x) { return typeof x === 'string'; }
  function nonEmpty(x) { return typeof x === 'string' && x.trim() !== ''; }
  function num(x) { return typeof x === 'number' && isFinite(x); }

  function define(def) {
    if (!def || !def.id) throw new Error('type definition needs an id');
    if (defs[def.id]) throw new Error('duplicate type ' + def.id);
    defs[def.id] = def;
    order.push(def.id);
  }

  /* Shared helper for textFields implementations. */
  function fields(it, add) {
    function one(field, value, kind) {
      if (typeof value === 'string') add({ field: field, value: value, kind: kind || 'block' });
    }
    add.type = one;
    one.type = one;
    return one;
  }

  function tfLabel(v) {
    var TA = global.TA;
    return v === true ? TA.t('drill_true') : v === false ? TA.t('drill_false') : TA.t('drill_skipped');
  }

  /* ------------------------------------------------------------------ note */
  define({
    id: 'note',
    labelKey: 'type_note',
    progressMode: 'read',
    mode: 'learn',
    nav: false,
    validate: function (it, F, E, W) {
      if (!nonEmpty(it.body)) F('body: missing');
      if (!nonEmpty(it.title)) { E('title: missing'); it.title = it.id; }
      if (it.order === undefined) { W('order: missing'); it.order = 9999; }
      else if (!num(it.order)) { E('order: not a number'); it.order = +it.order || 9999; }
    },
    progress: function (it) {
      var r = !!(global.TS && global.TS.state.notesRead[it.id]);
      return { seen: r, mastered: r };
    },
    textFields: function (it) {
      var f = [];
      fields(it, function (x) { f.push(x); })('title', it.title, 'inline');
      fields(it, function (x) { f.push(x); })('body', it.body);
      return f;
    }
  });

  /* ------------------------------------------------------------------ card */
  define({
    id: 'card',
    labelKey: 'type_card',
    mode: 'learn',
    nav: false,
    validate: function (it, F, E, W) {
      if (!nonEmpty(it.front)) F('front: missing');
      if (!nonEmpty(it.back)) F('back: missing');
    },
    textFields: function (it) {
      return [{ field: 'front', value: it.front, kind: 'block' }, { field: 'back', value: it.back, kind: 'block' }];
    }
  });

  /* -------------------------------------------------------------------- tf */
  define({
    id: 'tf',
    labelKey: 'type_tf',
    mode: 'drill',
    route: 'tf',
    lengthKey: 'tfLen',
    nav: true,
    validate: function (it, F, E, W) {
      if (!nonEmpty(it.statement)) F('statement: missing');
      if (typeof it.answer !== 'boolean') F('answer: must be boolean true/false (got ' + JSON.stringify(it.answer) + ')');
      if (!nonEmpty(it.explanation)) { E('explanation: missing'); it.explanation = ''; }
    },
    textFields: function (it) {
      return [{ field: 'statement', value: it.statement, kind: 'block' },
              { field: 'explanation', value: it.explanation, kind: 'block' }];
    },
    drill: {
      titleKey: 'drill_title_tf',
      introKey: 'drill_intro_tf',
      nounOneKey: 'noun_tf_one',
      nounManyKey: 'noun_tf_many',
      prompt: function (it) { return '<div class="statement prose">' + global.TA.md(it.statement) + '</div>'; },
      controls: function (it) {
        var TA = global.TA;
        return '<div class="drill-actions"><button class="btn btn-tf" data-ans="true">' + TA.t('drill_true') + ' ' + TA.kbd('T') + '</button>' +
          '<button class="btn btn-tf" data-ans="false">' + TA.t('drill_false') + ' ' + TA.kbd('F') + '</button>' +
          '<button class="btn btn-ghost" data-ans="skip">' + TA.t('drill_skip') + ' ' + TA.kbd('S') + '</button></div>';
      },
      parse: function (v, it) {
        if (v === 'skip') return null;
        if (it.type === 'tf') return v === 'true';
        var n = parseInt(v, 10);
        return n >= 0 && n < it.options.length ? n : undefined;
      },
      isCorrect: function (it, given) {
        return it.type === 'tf' ? given === it.answer : given === it.correct;
      },
      pointsText: function (it, ans) {
        return ans.correct === true ? ' · +1' : ans.correct === false ? ' · −1' : ' · 0';
      },
      feedback: function (it, ans) {
        var TA = global.TA;
        if (it.type === 'tf') {
          return '<div>' + (ans.given !== null
            ? TA.t('drill_statement_is_you', { answer: tfLabel(it.answer).toLowerCase(), given: tfLabel(ans.given).toLowerCase() })
            : TA.t('drill_statement_is', { answer: tfLabel(it.answer).toLowerCase() })) + '</div>';
        }
        return '<div>' + TA.t('drill_correct_option', { n: it.correct + 1 }) + '</div>';
      },
      keys: { t: 'true', f: 'false' },
      numericKeys: false,
      scoreLine: function (answers, items) {
        var TA = global.TA;
        if (items.length && items[0].type === 'tf') {
          var right = answers.filter(function (x) { return x.correct === true; }).length;
          var wrong = answers.filter(function (x) { return x.correct === false; }).length;
          return TA.t('drill_score', { score: Math.max(0, right - wrong), right: right, wrong: wrong });
        }
        var r = answers.filter(function (x) { return x.correct === true; }).length;
        return TA.t('drill_correct_of', { right: r, n: answers.length });
      },
      summary: function (answers, items) {
        var TA = global.TA;
        var right = answers.filter(function (x) { return x.correct === true; }).length;
        var wrong = answers.filter(function (x) { return x.correct === false; }).length;
        var blank = answers.length - right - wrong;
        if (items.length && items[0].type === 'tf') {
          return '<p class="big">' + TA.t('drill_tf_summary', { score: Math.max(0, right - wrong), n: answers.length, right: right, wrong: wrong, blank: blank }) + '</p>';
        }
        return '<p class="big">' + TA.t('drill_mc_summary', { right: right, n: answers.length, wrong: wrong, skipped: blank }) + '</p>';
      },
      review: function (it, x) {
        var TA = global.TA;
        var h = '';
        if (it.type === 'tf') {
          h += '<div class="prose">' + TA.md(it.statement) + '</div><div class="review-ans">' +
            TA.t('drill_your_answer') + ': <strong>' + tfLabel(x.given) + '</strong> · ' +
            TA.t('drill_correct_answer') + ': <strong>' + tfLabel(it.answer) + '</strong></div>';
        } else {
          h += '<div class="prose">' + TA.md(it.question) + '</div><div class="review-ans">' +
            TA.t('drill_your_answer') + ': <strong>' + (x.given === null ? TA.t('drill_skipped') : (x.given + 1) + '. ') + '</strong>' +
            (x.given === null ? '' : TA.mdi(it.options[x.given])) + '<br>' +
            TA.t('drill_correct_answer') + ': <strong>' + (it.correct + 1) + '.</strong> ' + TA.mdi(it.options[it.correct]) + '</div>';
        }
        if (it.explanation) h += '<div class="prose explanation">' + TA.md(it.explanation) + '</div>';
        return h;
      }
    }
  });

  /* -------------------------------------------------------------------- mc */
  define({
    id: 'mc',
    labelKey: 'type_mc',
    mode: 'drill',
    route: 'mc',
    lengthKey: 'mcLen',
    nav: true,
    validate: function (it, F, E, W) {
      if (!nonEmpty(it.question)) F('question: missing');
      if (!Array.isArray(it.options) || it.options.length < 2) F('options: need an array of 3–5 strings');
      else {
        if (it.options.length < 3 || it.options.length > 5) E('options: ' + it.options.length + ' options (contract: 3–5)');
        if (it.options.length > 9) F('options: too many');
        it.options.forEach(function (o, i) { if (!isStr(o)) F('options[' + i + ']: not a string'); });
        if (!(num(it.correct) && it.correct % 1 === 0 && it.correct >= 0 && it.correct < it.options.length)) F('correct: must be a valid index (got ' + JSON.stringify(it.correct) + ')');
        var seen = {};
        it.options.forEach(function (o, i) {
          if (isStr(o)) { var k = o.trim(); if (seen[k]) E('options[' + i + ']: duplicate option'); seen[k] = 1; }
        });
      }
      if (!nonEmpty(it.explanation)) { E('explanation: missing'); it.explanation = ''; }
    },
    textFields: function (it) {
      var f = [{ field: 'question', value: it.question, kind: 'block' }];
      if (Array.isArray(it.options)) it.options.forEach(function (o, i) { f.push({ field: 'options[' + i + ']', value: o, kind: 'inline' }); });
      f.push({ field: 'explanation', value: it.explanation, kind: 'block' });
      return f;
    },
    drill: {
      titleKey: 'drill_title_mc',
      introKey: 'drill_intro_mc',
      nounOneKey: 'noun_mc_one',
      nounManyKey: 'noun_mc_many',
      prompt: function (it) {
        var TA = global.TA;
        return '<div class="statement prose">' + TA.md(it.question) + '</div>';
      },
      controls: function (it) {
        var TA = global.TA;
        return '<div class="opts">' + it.options.map(function (o, i) {
          return '<button class="opt" data-ans="' + i + '"><span class="opt-key">' + (i + 1) + '</span><span class="opt-text">' + TA.mdi(o) + '</span></button>';
        }).join('') + '</div>' +
          '<div class="drill-actions"><span class="small dim">Keys ' + TA.kbd('1') + '–' + TA.kbd(String(it.options.length)) + '</span>' +
          '<button class="btn btn-ghost" data-ans="skip">' + TA.t('drill_skip') + ' ' + TA.kbd('S') + '</button></div>';
      },
      reveal: function (it, ans) {
        var TA = global.TA;
        return '<div class="opts">' + it.options.map(function (o, i) {
          var cls = 'opt';
          if (i === it.correct) cls += ' opt-correct';
          else if (ans.given === i) cls += ' opt-wrong';
          return '<span class="' + cls + '"><span class="opt-key">' + (i + 1) + '</span><span class="opt-text">' + TA.mdi(o) + '</span></span>';
        }).join('') + '</div>';
      },
      parse: function (v, it) {
        if (v === 'skip') return null;
        var n = parseInt(v, 10);
        return n >= 0 && n < it.options.length ? n : undefined;
      },
      isCorrect: function (it, given) { return given === it.correct; },
      pointsText: function () { return ''; },
      feedback: function (it) {
        return '<div>' + global.TA.t('drill_correct_option', { n: it.correct + 1 }) + '</div>';
      },
      keys: {},
      numericKeys: true,
      scoreLine: function (answers) {
        var right = answers.filter(function (x) { return x.correct === true; }).length;
        return global.TA.t('drill_correct_of', { right: right, n: answers.length });
      },
      summary: function (answers) {
        var right = answers.filter(function (x) { return x.correct === true; }).length;
        var wrong = answers.filter(function (x) { return x.correct === false; }).length;
        return '<p class="big">' + global.TA.t('drill_mc_summary', { right: right, n: answers.length, wrong: wrong, skipped: answers.length - right - wrong }) + '</p>';
      },
      review: function (it, x) {
        var TA = global.TA;
        return '<div class="prose">' + TA.md(it.question) + '</div><div class="review-ans">' +
          TA.t('drill_your_answer') + ': <strong>' + (x.given === null ? TA.t('drill_skipped') : (x.given + 1) + '. ') + '</strong>' +
          (x.given === null ? '' : TA.mdi(it.options[x.given])) + '<br>' +
          TA.t('drill_correct_answer') + ': <strong>' + (it.correct + 1) + '.</strong> ' + TA.mdi(it.options[it.correct]) + '</div>' +
          (it.explanation ? '<div class="prose explanation">' + TA.md(it.explanation) + '</div>' : '');
      }
    }
  });

  /* ------------------------------------------------------------------- gap */
  define({
    id: 'gap',
    labelKey: 'type_gap',
    mode: 'gap',
    route: 'gap',
    lengthKey: 'gapLen',
    nav: true,
    validate: function (it, F, E, W) {
      if (!nonEmpty(it.text)) { F('text: missing'); return; }
      var g = global.TB ? global.TB.checkGaps(it.text) : { fatal: [], errors: [], warnings: [], count: 0 };
      g.fatal.forEach(function (x) { F('text: ' + x); });
      g.errors.forEach(function (x) { E('text: ' + x); });
      g.warnings.forEach(function (x) { W('text: ' + x); });
      if (g.count === 0) F('text: no <gap>...</gap>');
      else if (g.count < 2 || g.count > 7) W('text: ' + g.count + ' gaps (contract: 2–7)');
      if (!nonEmpty(it.title)) { E('title: missing'); it.title = (global.TB ? global.TB.t('gap_default_title') : 'Definition'); }
      if (!(num(it.points) && it.points > 0)) { E('points: missing or invalid (using 5)'); it.points = 5; }
      if (it.note !== undefined && !isStr(it.note)) { E('note: not a string'); delete it.note; }
    },
    textFields: function (it) {
      var f = [{ field: 'title', value: it.title, kind: 'inline' }, { field: 'text', value: it.text, kind: 'gap' }];
      if (typeof it.note === 'string') f.push({ field: 'note', value: it.note, kind: 'block' });
      return f;
    }
  });

  /* --------------------------------------------------------------- problem */
  define({
    id: 'problem',
    labelKey: 'type_problem',
    mode: 'problems',
    route: 'problems',
    nav: true,
    validate: function (it, F, E, W) {
      if (!nonEmpty(it.title)) { E('title: missing'); it.title = it.id; }
      if (it.statement === undefined) { E('statement: missing (use "" if none)'); it.statement = ''; }
      else if (!isStr(it.statement)) F('statement: not a string');
      if (!Array.isArray(it.parts) || !it.parts.length) { F('parts: need a non-empty array'); return; }
      var labels = {};
      it.parts = it.parts.map(function (p0, i) {
        var pre = 'parts[' + i + '].';
        if (!p0 || typeof p0 !== 'object') { F(pre.slice(0, -1) + ': not an object'); return p0; }
        var p = {};
        for (var k in p0) if (Object.prototype.hasOwnProperty.call(p0, k)) p[k] = p0[k];
        if (!nonEmpty(p.label)) { E(pre + 'label: missing'); p.label = String.fromCharCode(97 + i); }
        if (labels[p.label]) { E(pre + 'label: duplicate "' + p.label + '"'); p.label = p.label + '#' + i; }
        labels[p.label] = 1;
        if (!(num(p.points) && p.points > 0)) F(pre + 'points: must be a positive number');
        if (!nonEmpty(p.prompt)) F(pre + 'prompt: missing');
        if (!nonEmpty(p.solution)) F(pre + 'solution: missing');
        if (!Array.isArray(p.hints)) { E(pre + 'hints: must be an array'); p.hints = isStr(p.hints) ? [p.hints] : []; }
        else p.hints = p.hints.filter(function (h, j) { if (!isStr(h)) { E(pre + 'hints[' + j + ']: not a string'); return false; } return true; });
        if (!p.hints.length) W(pre + 'hints: empty');
        if (!Array.isArray(p.rubric) || !p.rubric.length) {
          E(pre + 'rubric: missing (a single full-credit item is used)');
          p.rubric = [{ points: p.points, text: (global.TB ? global.TB.t('rubric_default') : 'Complete and correct answer') }];
        } else {
          p.rubric = p.rubric.filter(function (rb, j) {
            if (!rb || !num(rb.points) || !isStr(rb.text)) { E(pre + 'rubric[' + j + ']: needs {points:number, text:string}'); return false; }
            return true;
          });
          var sum = p.rubric.reduce(function (a, rb) { return a + rb.points; }, 0);
          if (num(p.points) && Math.abs(sum - p.points) > 1e-9) E(pre + 'rubric: points sum to ' + sum + ', part is worth ' + p.points);
        }
        return p;
      });
      it.total = it.parts.reduce(function (a, p) { return a + (p && num(p.points) ? p.points : 0); }, 0);
      if (it.mock !== undefined && typeof it.mock !== 'boolean') { E('mock: not a boolean'); it.mock = !!it.mock; }
      if (it.mock && (it.total < 3 || it.total > 11)) W('mock problem worth ' + it.total + ' points (contract: 3–11)');
    },
    progress: function (it) {
      var TA = global.TA;
      var st = TA && TA.problemStatus ? TA.problemStatus(it) : 'new';
      return { seen: st !== 'new', mastered: st === 'solved' };
    },
    textFields: function (it) {
      var f = [{ field: 'title', value: it.title, kind: 'inline' }, { field: 'statement', value: it.statement, kind: 'block' }];
      if (Array.isArray(it.parts)) it.parts.forEach(function (p, i) {
        if (!p || typeof p !== 'object') return;
        var pre = 'parts[' + i + '].';
        f.push({ field: pre + 'prompt', value: p.prompt, kind: 'block' });
        if (Array.isArray(p.hints)) p.hints.forEach(function (h, j) { f.push({ field: pre + 'hints[' + j + ']', value: h, kind: 'block' }); });
        f.push({ field: pre + 'solution', value: p.solution, kind: 'block' });
        if (Array.isArray(p.rubric)) p.rubric.forEach(function (r, j) { if (r) f.push({ field: pre + 'rubric[' + j + '].text', value: r.text, kind: 'inline' }); });
      });
      return f;
    }
  });

  global.TT = {
    define: define,
    get: function (id) { return defs[id]; },
    has: function (id) { return !!defs[id]; },
    all: function () { return order.map(function (id) { return defs[id]; }); },
    ids: function () { return order.slice(); },
    textFields: function (it) { var d = defs[it.type]; return d ? d.textFields(it) : []; },
    nonEmpty: nonEmpty,
    isNum: num
  };
})(window);
