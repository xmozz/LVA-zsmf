# Content specification

This is the contract between the content files in `data/` and the trainer app.
It is deliberately general: the course name, units, topics, origins, exam
format and interface language live in `data/course.js`, not in this file or in
the app code.

Read this file completely before writing content. `EXTENDING.md` explains how
to add a new item type if the six built-in types do not fit the subject.

---

## 1. Where content lives

Every content file is a classic script (no modules, no imports, no build step)
that appends item objects to one global array:

```js
(function () {
  const R = String.raw;
  const add = (...items) => (window.TRAINER_BANK = window.TRAINER_BANK || []).push(...items);

  add(
    { id: "u1-tf-01", type: "tf", lecture: 1, topic: "foundations", origin: "slides",
      source: "Unit 1, slide 12", difficulty: 1,
      statement: R`Every non-empty finite set of integers has a smallest element.`,
      answer: true,
      explanation: R`Take the finitely many elements and compare them one by one; a finite non-empty list has a minimum. The empty set is the exception, which is why it is excluded.` }
  );
})();
```

`String.raw` is the normal way to write text because it preserves backslashes
in LaTeX. The helper names `R` and `add` are conventions, not requirements.

`data/manifest.js` lists the files to load:

```js
window.TRAINER_DATA_FILES = [
  { file: "unit-1.js", prefixes: ["u1-"] },
  { file: "unit-2.js", prefixes: ["u2-"] },
  { file: "exams.js", prefixes: ["ex-"] },
  { file: "exercises.js", prefixes: ["es-"] }
];
```

A plain string (`"unit-1.js"`) is also accepted. `prefixes` is documentation
for the self-test: every id in that file should start with one of them.

For every listed `X.js` the loader also tries `X-b.js`, `X-c.js`, … up to
`X-y.js`, so long files can be split without editing the manifest. Missing
continuations are silent. `data/_sample.js` is special: it loads only when no
real content was found or the URL contains `?sample=1`.

### Ids

- `id` is required, unique across all files, and matches `[a-z0-9-]+`.
- Use the file's prefix plus a local number or slug: `u1-tf-03`, `ex-2024-q2`,
  `es-sheet3-p1`.
- Recommended unit convention: `u<unit-id>-...` (for example `u1-`,
  `u2-`). A unit id may be a number or a short string; the self-test checks
  the `u<id>-` convention when it sees it.
- Duplicate ids are reported; the first item wins.
- Ids are persistent: progress is stored under them. Do not renumber items
  after students have used the trainer.

---

## 2. Common fields

| Field | Required | Value |
| --- | --- | --- |
| `id` | yes | unique lowercase slug |
| `type` | yes | `note`, `card`, `tf`, `mc`, `gap` or `problem` |
| `lecture` | yes | id of a unit from `COURSE.units` (number or string) |
| `topic` | yes | id of a topic from `COURSE.topics`; unknown ids are shown as “Other” and reported |
| `origin` | yes | id of an origin from `COURSE.origins` (`slides`, `exam`, … — whatever the course defines) |
| `source` | yes | human-readable citation, e.g. “Unit 3, slides 12–15”, “Old exam 2024, Q2(a)” |
| `difficulty` | yes | `1` recall, `2` application, `3` transfer / exam-level |
| `mock` | problems only | `true` if the item is suitable for the mock exam; `false` or omitted otherwise |

The field is called `lecture` for historical reasons. It holds the **id of a
unit**, which may be a lecture, a week, a chapter or anything else the course
configuration defines. The UI label comes from `COURSE.units` and the
`filter_unit` interface string.

Show where the item comes from. A student revising should be able to find the
original slide or exam question, and a reviewer should be able to check the
key against the source.

---

## 3. Item types

### `note` — revision notes

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | inline markup |
| `body` | yes | block markup; the main text |
| `order` | recommended | number; lower first within a unit |

Notes are the only place where a student can learn material that no question
covers. Write them so that a student who reads only the notes knows everything
examinable in that unit. Use headings, lists, tables, code and figures where
they help. The notes reader groups by unit and tracks “read”.

### `card` — flashcard

| Field | Required | Notes |
| --- | --- | --- |
| `front` | yes | prompt, block markup |
| `back` | yes | answer, block markup |

Cards are scheduled unseen-first, then mistakes; “knew it” is recorded as a
correct answer. Cards you did not know come back later in the same session.

### `tf` — true/false statement

| Field | Required | Notes |
| --- | --- | --- |
| `statement` | yes | exactly one statement, block markup |
| `answer` | yes | boolean `true` or `false` — **not** the string `"true"` |
| `explanation` | yes (may be `""`) | why the answer is what it is |

The drill scores +1 / −1 / 0 with a floor of 0 by default; the mock section
scoring rule can differ. A statement should be unambiguously true or false on
the material of the course, not a matter of taste. If it needs an official
exam key to decide, say so in the explanation.

### `mc` — multiple choice

| Field | Required | Notes |
| --- | --- | --- |
| `question` | yes | block markup |
| `options` | yes | array of 3–5 strings; each option is inline markup |
| `correct` | yes | zero-based index into `options` |
| `explanation` | yes (may be `""`) | why the correct option is correct and the others are not |

Exactly one option must be correct. Distractors should be plausible mistakes,
not obvious nonsense. Options are shuffled? No — the order is preserved so
that explanations can refer to “option 3”. Do not make the correct option
stand out by length or formatting.

### `gap` — fill-the-gap definition

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | inline markup, e.g. “Continuous function” |
| `points` | yes | positive number, normally 3 or 5 |
| `text` | yes | block markup with `<gap>…</gap>` blanks |
| `note` | optional | block markup shown after all blanks are revealed |

The student types into each blank, reveals the expected content and marks each
blank right or wrong. Score = `points × right / blanks`. Use gaps for formal
definitions, theorem statements, invariants and formulas that could be asked
as a “state the definition” question.

#### Gap rules

- At least one `<gap>…</gap>`; 2–7 is the comfortable range (the self-test
  warns outside it, and treats zero as fatal).
- Tags must balance, must not nest, and must not be empty.
- **Never open a gap inside maths.** This is fatal: the renderer cannot place
  an input inside a formula.
  - Wrong: `$f(x) = <gap>x^2</gap>$`
  - Right: `$f(x) = $<gap>$x^2$</gap>` or, better, put the whole formula in
    the gap: `<gap>$f(x) = x^2$</gap>`
- Maths inside the gap content is fine: `<gap>$x \in \mathbb{R}$</gap>`.
- Inline code inside a gap is fine: `<gap>[[map(f, xs)]]</gap>`.
- The visible blank is self-marked, so one blank may accept a phrase, a
  formula or a line of code.
- Points are per item, not per blank. A 5-point item with 5 blanks gives one
  point per correct blank.

### `problem` — open problem with hints and rubric

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | inline markup |
| `statement` | yes (may be `""`) | shared text above the parts |
| `parts` | yes | non-empty array, see below |
| `mock` | recommended | `true` if suitable for the mock exam |

Each part:

| Field | Required | Notes |
| --- | --- | --- |
| `label` | recommended | `"a"`, `"b"`, …; defaults to a, b, c |
| `points` | yes | positive number |
| `prompt` | yes | block markup, the actual question |
| `hints` | yes | array of strings, easiest first; may be empty but the self-test warns |
| `solution` | yes | block markup, written like a full-marks answer |
| `rubric` | yes | array of `{points, text}`; points must sum exactly to `points` |

The student writes an answer, reveals hints one at a time, then the model
solution, then ticks rubric rows. A part score is capped at its points; a
problem is “solved” at 80 % or more. Rubric rows are what a grader would
award, not cosmetic steps: “defines the distinguisher and shows it is
efficient”, “both directions of the equivalence”, “correct units”.

A model solution is not a hint and not a sketch. It should be the answer a
student could copy to get full marks, including the sentence that justifies
the final step. If the official solution exists, follow its structure and
notation; if it is wrong or incomplete, do not reproduce the error.

`mock: true` marks a problem as exam-like enough for the mock blueprint. The
mock picker prefers unused problems and avoids repeating topics; the
blueprint decides how many and how many points.

---

## 4. Text markup

All text fields use the same small markup language. The renderer escapes HTML;
raw HTML tags are shown as text and the self-test reports them.

### Blocks

- A blank line starts a new paragraph. Single newlines inside a paragraph
  collapse to a space.
- `### Heading` produces a subheading. Two hashes map to a level-3 heading;
  three or four hashes map to level-4 (the visual difference is small).
- `- item` or `• item` is an unordered list; `1. item` or `1) item` is an
  ordered list. Consecutive lines continue the current list item.
- A display formula on its own line (`$$…$$`) is its own block.
- Pipe tables and figures are block elements (see below).

### Inline

- `**bold**`
- `*italic*`
- `$inline maths$`
- `$$display maths$$` (normally on its own line)
- `[[inline code]]`

Maths is rendered by KaTeX. The app falls back to raw LaTeX if KaTeX cannot
be loaded; the self-test requires KaTeX. Do not use `$` as a currency symbol;
write “USD” or escape it as `\$`.

### Code

Inline code uses double square brackets:

```
Call [[shelfLabel("L", 12)]] and compare the result.
```

A fenced code block uses tildes, optionally followed by a language name:

```
~~~js
function shelfLabel(section, number) {
  return section + "-" + number;
}
~~~
```

The fence line is three or more tildes. Code is monospace with preserved
whitespace and horizontal scrolling; there is no syntax highlighting. Maths
and markup are **not** processed inside code.

Two escapes are available **inside code only**, because content files are
`String.raw` template literals and must not contain a backtick or the
two-character sequence dollar-brace:

| Write | Renders as |
| --- | --- |
| `@@` | a backtick |
| `$@` | a dollar sign |

So a JavaScript template literal is written `$@{name}` inside code, and a
Markdown code span is written `@@like this@@`. Outside code these sequences
are ordinary text.

### Figures

```
![A bay with three shelves and a reserved aisle](assets/bay.svg)
```

- The figure must be alone on its line.
- The path must be relative and must start with `assets/`. `http(s)://`,
  absolute paths, `..` and other directories are rejected by the renderer and
  reported by the self-test. This keeps the trainer working from `file://`
  without network access. Use file names without spaces.
- The caption is the alt text; it is rendered as a `<figcaption>`.
- PNG, JPEG, SVG, GIF and WebP work in browsers. Prefer SVG for diagrams and
  PNG for screenshots. Keep files small; the trainer is opened by double-click.
- Figures are allowed in notes, question text, explanations, hints and model
  solutions.

### Tables

```
| Field | Type | Required |
| --- | --- | :---: |
| shelf mark | text | yes |
| loan class | one of *short*, *normal*, *reference* | yes |
```

- The first row is the header; the second row is a separator of dashes with
  optional colons (`:---`, `---:`, `:---:`).
- Cells may contain inline markup, maths and inline code. They may not contain
  block elements.
- A table is a block: put a blank line before and after it.
- Tables are intended for notes, explanations and solutions. They also work
  in question text, but do not make a question depend on a wide table.

---

## 5. The two hard rules

Content files are JavaScript. Two character sequences break a whole file
silently, so they are forbidden in every text field:

1. **Never a backtick** (`` ` ``). The file wrapper uses a template literal;
   an unescaped backtick ends it early. Use `@@` inside code, or a normal
   quoted string in JavaScript for prose that needs one.
2. **Never the two characters `$` and `{` next to each other** (`${`). In a
   template literal this starts an interpolation. Use `$@` inside code. If
   prose really needs it, build that field as a normal quoted string in
   JavaScript.

The self-test reports both as errors. A content file that contains either
may fail to load at all, which is why these are checked before anything is
shown to the student.

Also avoid literal HTML tags outside maths and code (`<div>`, `<br>`, …).
They are escaped and shown as text, and the self-test reports them. The only
tags with meaning are `<gap>` and `</gap>` inside `gap.text`.

---

## 6. Validation

`js/bank.js` validates every item when the app starts and again in
`selftest.html`. Three levels exist:

| Level | Meaning | App behaviour |
| --- | --- | --- |
| fatal | the item cannot be used | item is skipped and reported |
| error | contract violation the app can tolerate | item is used, reported in Settings and the self-test |
| warning | style or soft rule | item is used, reported in the self-test |

Examples of fatal: unknown `type`, unknown unit, missing required field, a
non-boolean `tf.answer`, a gap opened inside maths, a problem part without a
point value. Examples of error: unknown topic (shown under “Other”), missing
`source`, rubric points that do not sum to the part, a literal HTML tag.
Examples of warning: a short mock problem, fewer than two gaps, odd `**`.

The app never dies because of one bad item or one missing file. A missing
content file is listed in a notice and in Settings; a malformed item is
skipped. The self-test is the authoritative check and must report zero errors
before hand-over.

---

## 7. How items relate to the course configuration

`data/course.js` defines:

- `id` — also the localStorage namespace (`trainer-<id>`); two trainers opened
  from `file://` share one storage and must not overwrite each other.
- `title`, `subtitle`, `courseName` — branding.
- `exam` — name, local date (`YYYY-MM-DD`) and the dashboard summary.
- `units` — ordered `{id, label, title}`; items point at `id` with `lecture`.
- `topics` — ordered `{id, label}`; filters, dashboard matrices and weak-topic
  ranking use these.
- `origins` — ordered `{id, label}`; `source` is free text on top of this.
- `blueprint` — the mock exam, as data (see below).
- `ui` — every student-facing interface string.

An item must not hard-code a course name, a unit title, a topic label or an
origin label. Those come from the configuration. The content file names and
id prefixes are free, but must be listed in `manifest.js`.

### Blueprint

The mock exam is assembled from an ordered list of sections:

```js
blueprint: {
  title: "Mock exam",
  minutes: 60,
  intro: "Same shape as the real exam: …",
  sections: [
    { id: "tf", label: "Q1", type: "tf", count: 10, spread: "topic",
      scoring: { kind: "plusminus", plus: 1, minus: 1, blank: 0, floor: 0 },
      instructions: "Correct +1, incorrect −1, blank 0." },
    { id: "def", label: "Q2", type: "gap", count: 1,
      filters: { topics: ["security-definitions"], points: [5, 5] },
      scoring: { kind: "proportional" },
      instructions: "Fill in every blank." },
    { id: "problems", label: "Q3", type: "problem",
      pointsTarget: 15, pointsMin: 13, pointsMax: 17, countTarget: 3, countMax: 5,
      filters: { mock: true },
      scoring: { kind: "rubric" },
      instructions: "Write complete answers." }
  ]
}
```

- `count` picks exactly that many items. `spread: "topic"` or `"unit"` draws
  round-robin across the taxonomy.
- `pointsTarget`/`pointsMin`/`pointsMax`/`countTarget`/`countMax` pick a
  subset of point-bearing items whose totals fit the real exam.
- `filters` may restrict `topics`, `units`/`lectures`, `origins`,
  `difficulty`, `points: [min, max]` and, for problems, `mock: true`.
- `scoring.kind` is `plusminus`, `peritem`, `proportional` or `rubric`.
- If a section cannot be filled, the mock leaves it out and shows why; the
  self-test warns. A course with no true/false part simply has no `tf`
  section. A course with four calculation problems can express that with one
  `problem` section and `count: 4`.
- Problems used in earlier mocks are avoided when possible.

`data/course.js` contains a working demo configuration and a complete English
interface table. Translate the `ui` table for a course taught in another
language; values may contain HTML, and `{placeholders}` are filled by the app.

---

## 8. Checklist for a content file

- [ ] Classic script, appends to `window.TRAINER_BANK`, no imports.
- [ ] Listed in `data/manifest.js` (or is a continuation `X-b.js`).
- [ ] Every id unique, lowercase, prefixed.
- [ ] `lecture` is a configured unit id.
- [ ] `topic` and `origin` are configured ids.
- [ ] `source` cites slide / exam / exercise precisely.
- [ ] No backtick and no `$`+`{` sequence anywhere.
- [ ] Maths balanced, no gap opened inside maths.
- [ ] Code uses `@@` and `$@` where a backtick or dollar-brace is meant.
- [ ] Figures are relative `assets/…` paths and exist.
- [ ] Rubric points sum to the part's points.
- [ ] Mock problems are marked `mock: true`; gap points match the blueprint
      filter if the blueprint restricts them.
- [ ] `selftest.html` reports zero errors.

For a new item type, read `EXTENDING.md`.
