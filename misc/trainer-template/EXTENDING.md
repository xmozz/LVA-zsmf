# Adding an item type

The six built-in types cover prose, maths, definitions and open problems. They
are not a closed list: a statistics course may want a numeric-answer type, a
programming course a “predict the output” type, a language course a
free-text-with-keywords type. This file is the recipe.

The rule of thumb:

- If the answer is a **choice** (true/false, one of several options, a short
  fixed answer), add a `drill` adapter and reuse `js/view-drill.js`.
- If the answer is **free-form** (a number, a program, a paragraph), write a
  small dedicated view and register it in `TA.views`.
- If the type belongs in the mock exam, add a branch to the three places in
  `js/view-mock.js` listed below.

Do not edit the existing six types unless the course genuinely needs different
behaviour from all of them; adding a seventh is cheaper and safer.

---

## 1. Register the type

Create `js/type-<name>.js` and load it **after** `js/types.js` and **before**
`js/bank.js` in both `index.html` and `selftest.html`. Or append the
`TT.define(...)` call to `js/types.js` if it is tiny.

```js
(function (global) {
  'use strict';
  var TT = global.TT;

  TT.define({
    id: 'numeric',
    labelKey: 'type_numeric',       // key in COURSE.ui
    mode: 'view',                   // 'drill', 'view', 'learn', 'gap', 'problems'
    route: 'numeric',               // hash route: #/numeric
    lengthKey: 'numericLen',        // session length saved in settings
    nav: true,                      // show in the nav when items exist

    /* F = fatal (skip the item), E = error (use and report), W = warning */
    validate: function (it, F, E, W) {
      if (!TT.nonEmpty(it.question)) F('question: missing');
      if (typeof it.answer !== 'number' || !isFinite(it.answer)) F('answer: must be a number');
      if (it.tolerance == null) { E('tolerance: missing (using 0)'); it.tolerance = 0; }
      else if (typeof it.tolerance !== 'number' || it.tolerance < 0) { E('tolerance: must be a non-negative number'); it.tolerance = 0; }
      if (!TT.nonEmpty(it.unitLabel)) { E('unitLabel: missing (using "")'); it.unitLabel = ''; }
      if (!TT.nonEmpty(it.explanation)) { E('explanation: missing'); it.explanation = ''; }
    },

    /* Every text field the renderer and the self-test must visit. */
    textFields: function (it) {
      return [
        { field: 'question', value: it.question, kind: 'block' },
        { field: 'explanation', value: it.explanation, kind: 'block' }
      ];
    },

    /* Optional; the default is TS.seen / TS.mastered. */
    progress: function (it) {
      return { seen: global.TS.seen(it.id), mastered: global.TS.mastered(it.id) };
    }
  });
})(window);
```

The common fields (`id`, `type`, `lecture`, `topic`, `origin`, `source`,
`difficulty`) are validated in `js/bank.js` before your `validate` runs. Your
validator only handles the type-specific fields. It may normalise values in
place (`it.tolerance = 0`).

`TT.define` also feeds `TB.TYPES` and `TB.TYPE_LABELS`, so:

- the self-test counts the new type and renders its text fields;
- the dashboard shows a progress row;
- the filters work without changes;
- `js/view-mock.js` and the blueprint can use it as a section type.

Add the UI label to `COURSE.ui`:

```js
type_numeric: 'Numeric answers',
numericLen: 10
```

Placeholder text, button labels and feedback strings for the new view also go
into `COURSE.ui`; do not hard-code a language in the view.

---

## 2. A simple choice type: reuse the drill engine

If the new type can be answered with buttons that carry a `data-ans` value,
give it a `drill` adapter and set `mode: 'drill'`:

```js
TT.define({
  id: 'output',
  labelKey: 'type_output',
  mode: 'drill',
  route: 'output',
  lengthKey: 'outputLen',
  nav: true,
  validate: function (it, F) {
    if (!TT.nonEmpty(it.code)) F('code: missing');
    if (typeof it.answer !== 'string') F('answer: must be a string');
    if (!Array.isArray(it.options) || it.options.length < 2) F('options: missing');
  },
  textFields: function (it) {
    return [{ field: 'code', value: it.code, kind: 'block' }].concat(
      it.options.map(function (o, i) { return { field: 'options[' + i + ']', value: o, kind: 'inline' }; })
    );
  },
  drill: {
    titleKey: 'drill_title_output',
    introKey: 'drill_intro_output',
    nounOneKey: 'noun_item_one',
    nounManyKey: 'noun_item_many',
    prompt: function (it) { return global.TA.md(it.code); },
    controls: function (it) {
      return '<div class="opts">' + it.options.map(function (o, i) {
        return '<button class="opt" data-ans="' + i + '"><span class="opt-key">' + (i + 1) + '</span><span class="opt-text">' + global.TA.mdi(o) + '</span></button>';
      }).join('') + '</div>';
    },
    reveal: function (it, ans) { /* optional highlighted options after answering */ },
    parse: function (v, it) { return v === 'skip' ? null : +v; },
    isCorrect: function (it, given) { return it.options[given] === it.answer; },
    pointsText: function () { return ''; },
    feedback: function (it) { return '<div>' + global.TA.t('drill_correct_option', { n: it.options.indexOf(it.answer) + 1 }) + '</div>'; },
    keys: {},
    numericKeys: true,
    scoreLine: function (answers) { return global.TA.t('drill_correct_of', { right: answers.filter(function (x) { return x.correct; }).length, n: answers.length }); },
    summary: function (answers) { /* one paragraph of HTML */ return ''; },
    review: function (it, x) { /* one review card */ return ''; }
  }
});
```

`js/view-drill.js` already provides the setup screen, filters, scheduling,
keyboard shortcuts, session summary, “redo wrong”, progress recording and the
review list. You only supply the adapter.

`#/mistakes` is a mixed drill over `tf` and `mc`. If the new type should join
it, add its id to `cfg.types` in `js/view-drill.js`.

---

## 3. A free-form type: write a view

Create `js/view-<name>.js` and register it:

```js
TA.views.numeric = {
  mount: function (el, r) {
    var items = TA.ofType('numeric');
    var n = parseInt(r.query.len, 10) || TS.state.settings.numericLen || 10;
    var deck = TA.schedule(items, n);
    // render the setup or the current item, record answers with:
    //   TS.record(item.id, correct)        // updates streak / mastery / log
    //   TS.recordSkip(item.id)             // optional
    //   TS.saveSoon()                      // after text input
    // return { onKey: function (e) { … }, destroy: function () { … } }
  }
};
```

Add `<script src="js/view-numeric.js"></script>` to `index.html` (and to
`selftest.html` only if the view also contributes validation; normally it does
not). With `mode: 'view'`, `nav: true` and `route: 'numeric'`, the nav entry
appears automatically when the first numeric item exists.

Useful helpers, all in `js/core.js`:

| Helper | Purpose |
| --- | --- |
| `TA.schedule(items, n)` | unseen first, then mistakes, then least-recently-seen |
| `TA.applyFilters(items, f)` | unit / topic / origin / difficulty / unseen / mistakes |
| `TA.filterBar({items, fields, values})` | the standard filter row |
| `TA.metaLine(item, withSource)` | unit · topic · origin · source |
| `TA.safe(fn, label)` | render one item without breaking the view |
| `TA.md(text)` / `TA.mdi(text)` | block / inline text renderer |
| `TS.record`, `TS.recordSkip` | progress, streak, log |
| `TS.mastered`, `TS.seen` | two correct answers in a row / any attempt |

Free-form answers are not machine-checked by default. Either compare
numerically with a tolerance, or reveal a model answer and let the student
self-mark (the `problem`/`gap` pattern). Do not pretend that a string
comparison is an objective grader for prose.

---

## 4. Make the self-test learn about it

No change is normally needed: `selftest.html` iterates `TB.TYPES`, calls
`TT.get(type).textFields(item)` and renders every field strictly. It also
validates every item through `TB.validateItem`, which calls your `validate`.

If the type needs an extra structural check that the text renderer cannot
express (for example “the numeric answer must lie inside the stated interval”),
add it to `validate` and push a message through `F`, `E` or `W`. That keeps the
app and the self-test in step automatically.

Add a handful of items to `data/_sample.js` only while developing; the
template's demo set should not grow into a second course.

---

## 5. Add it to the mock exam

The mock is blueprint-driven, so a section can use the new type as soon as
`view-mock.js` knows how to render and score it. Three places:

1. `sectionScore(sec)` in `js/view-mock.js` — add a branch that computes
   `{score, max, rows}` from `sec`'s answer state.
2. `examBody(sec)` — render the paper form. Store the student's answer in
   `sec.answers[itemId]`, `sec.text[itemId]`, or a new map on the section
   object; the whole paper is serialised to `localStorage`, so the state must
   be JSON-safe.
3. `reviewSection(sec, n)` — render the review card and the marking controls.
   Reuse the existing event delegation (`data-*` attributes), or add a
   `data-num` handler next to the `data-tf` / `data-mc` handlers.

If the type uses a new scoring rule, also add it to `BP.sectionMax` in
`js/blueprint.js` and to the `scoring.kind` list in `CONTENT_SPEC.md`.

Then the course configuration can say:

```js
{ id: "calc", label: "Q2", type: "numeric", count: 5,
  scoring: { kind: "peritem", points: 2 },
  instructions: "Give the value to two decimal places." }
```

The paper is selected by `js/blueprint.js`, which filters by type and the
optional `filters` block. Count-based sections work for any type; point-based
sections use `item.points` (or `item.total` for problems).

---

## 6. Keep the quality bar

A new type is a new place for a wrong answer key. Test it with:

- a correct answer at the boundary (tolerance, rounding, trailing spaces);
- a wrong answer that looks plausible;
- an empty answer and a skip;
- a reload in the middle of a session;
- one full mock exam containing the type;
- the self-test with a deliberately broken item.

If the type cannot be checked objectively, say so in the item text and use
self-marking rather than a fake key. A missing question is better than a
question whose key is wrong.
