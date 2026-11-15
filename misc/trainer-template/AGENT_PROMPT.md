# Build the trainer for this course

You are an AI coding agent working in a copy of a trainer template. The user
has put course materials somewhere in this folder and asked you to build an
exam trainer for their course. They may have said no more than “build the
trainer for course XY”. The exam may be days away.

Your job is not to design an app. The app is already here and already works:
the dashboard, notes and flashcards, true/false drill, quiz, fill-the-gap
definitions, open problems with hints and rubrics, the timed mock exam,
scheduling, progress storage, themes and the self-test are all implemented.
Your job is to turn this empty shell into **their** course: configure it, read
their materials, write the content, check the answer keys, and hand over a
trainer that would actually help them on the day.

Unless the subject genuinely needs a new item type or scoring rule, the files
you change are `data/course.js`, `data/manifest.js`, the content files in
`data/`, `assets/`, and nothing else. Do not rewrite the app to fit one course.
If the subject needs an extension, use `EXTENDING.md` and keep the self-test in
step.

Everything you need is in this folder. Read these before writing anything:

- `CONTENT_SPEC.md` — the contract between content files and the app. This is
  the mechanical reference; do not guess its rules.
- `EXTENDING.md` — how to add an item type or a scoring rule if the subject
  needs one.
- `data/course.js` — the single course configuration: name, exam, units,
  topics, origins, blueprint and every interface string.
- `data/_sample.js` — the demo content. It shows every item type and every
  field, on a deliberately fictional topic. Replace it with real content, do
  not extend it into a second course.
- `js/types.js`, `js/bank.js`, `js/blueprint.js` — where item types are
  validated, scheduled and assembled into a mock exam.
- `selftest.html` — the authoritative content check.

You may not be able to spawn subagents. That changes how you organise the
work, not what the result must contain. You are allowed to use the shell, read
PDFs, render pages to images, run a headless browser and inspect the result.
Do not add dependencies to the template: it must keep working by
double-clicking `index.html`, with only the KaTeX CDN link it already has.

---

## 1. Take stock before you write

Start by listing the folder. The user may have used the proposed layout

```
materials/slides/       lecture slides, one PDF or several
materials/exercises/    exercise sheets, possibly with the student's solutions
materials/exams/        old exams and sample exams
materials/notes/        anything else: handouts, formula sheets, recordings
```

or they may have dropped files in the root, in a zip-like folder, or in a
single PDF. Tolerate deviations; do not move their files around without a
reason. Write down what you found, what is readable and what is missing.

Work out these five things from the materials before you write an item:

1. **Examinable scope.** Which units, chapters or lectures does the exam cover?
   Old exams are the best evidence, but they often cover more than the current
   course. Scope first: converting an out-of-scope old question wastes time and
   creates a trainer that teaches the wrong thing.
2. **Exam date.** The countdown needs a real local date. If no date is in the
   materials, ask the user. This is one of the few things you cannot infer.
3. **Exam format.** Section order, item types, counts, points, negative
   marking, floors, time limit, whether students choose among questions,
   whether a formula sheet is allowed. The sample exam and the old exams are
   better evidence than a prose description; a course handbook is a fallback.
4. **Language.** The language of the slides and exams is the default for both
   content and interface. If the user asks for another language, follow them.
5. **Level and style.** Are questions computational, proof-based, essay-like,
   code-reading, definition-recall? Match the real exam, not an idealised
   course.

Read the table of contents of every slide deck and the first page of every
exam. Build a small inventory: file, pages, unit, type, whether it has
solutions, whether it is in scope. If the user's materials include a course
description or an exam regulations page, read it too; it often settles the
format questions.

Ask the user only what stays open. Typically that is the exam date, and the
scope boundary when old exams cover earlier or later material than the current
course. If the date in the materials is already past, or the folder contains
several semesters, ask which exam this trainer is for. If there is no old exam
and no sample exam, the format is the other thing you may have to ask about;
otherwise infer it from the exercise sheets and the course handbook. Ask these
questions together, at the start, not one at a time in the middle of the work.
If the user does not answer, state the assumption in the final report and in a
comment in `data/course.js`, and proceed. Do not ask for permission to start,
for a topic list you can derive, or for design taste.

State every assumption explicitly: “scope = units 1–7 because the sample exam
only cites those”, “exam has no true/false part because neither old exam has
one”, “the 2023 exam is out of scope because it predates the syllabus change”.
An assumption the user can see and correct is much better than a silent guess.

---

## 2. Read the sources properly

Slides and exams are usually PDFs, and ordinary text extraction destroys the
thing that matters: formulas become `p q`, tables lose their columns, figures
disappear, subscripts and superscripts move onto the wrong line. If the
materials are PPTX, DOCX or images, export the pages to PDF or images first.
If you write content from extracted text alone you will produce
plausible-looking but wrong mathematics.

Read PDFs as **rendered pages**. Render each page to an image at a resolution
at which you can read subscripts (typically 150–200 dpi), look at the page, and
only then transcribe. Tools such as `pdftoppm`, `mutool draw` or a browser
screenshot are fine; use whatever is installed. Work unit by unit and keep the
page number in your notes. For a dense page, crop or zoom the formula region.
If a formula is still ambiguous, do not guess it; leave the item out or ask.

Exercise sheets written by the student are different. Their submitted
solutions are **drafts to be verified**, not answer keys. They may be correct,
partly correct, or confidently wrong. Derive the answer yourself; where the
submission differs, work out who is right. Report the discrepancies in the
final report; do not silently copy a wrong line into a model solution.

Where an official solution exists, it wins on matters of exam convention, but
you still have to understand it. If the official key and your derivation
disagree, redo both; if the official key is wrong or relies on a convention
the course does not state, say so in the explanation and in the report. “The
official solution says X” is not a substitute for an argument.

Keep track of material errors as you go: a typo on a slide, a missing case in
an exercise, a formula with the wrong sign. Use the corrected version in the
trainer and report the error. Do not reproduce it just because it is printed.

---

## 3. Configure the course

Open `data/course.js`. This is the only file that should contain course-specific
names, units, topics, dates and format text.

**Identity and storage.** Set `id`, `title`, `subtitle` and `courseName`. The
id is also the localStorage namespace (`trainer-<id>`), so it must be unique
and must stay stable once students have progress. Two trainers opened from
`file://` share one localStorage; a wrong id means they overwrite each other.
Do not leave the template's demo id or demo title in the delivered course.

**Exam.** Set `exam.name`, `exam.date` (`YYYY-MM-DD`, local time) and
`exam.summary` — the one or two sentences on the dashboard that tell the
student what the exam is. If there is no date, use `null` and say why.

**Units.** Order the teaching units as the course does. A unit can be a
lecture, a week, a chapter, a module; its `id` may be a number or a short
string (`1`, `"w3"`, `"A"`), and its `label` is what appears in the interface.
Do not force a lecture numbering that the course does not use. Every item's
`lecture` field must be one of these ids. Give each unit a title a student
recognises from the slides.

**Topics.** Choose a taxonomy of roughly 8–15 topics that a student would use
to diagnose weaknesses (“integration by parts”, not “Unit 4”). Topics should
cut across units where that is natural. Do not create one topic per slide, and
do not reuse the unit titles as topics unless the course really is organised
that way. The dashboard ranks weak topics, so the labels must be meaningful
when they appear alone.

**Origins.** Keep the origin ids that describe the real sources: slides, old
exam, sample exam, exercise sheet, variant. Translate their labels. A variant
is a fresh question modelled on an exam question; an old exam question is a
conversion. The distinction matters when the student wants to practise the
real thing.

**Blueprint.** Rebuild the mock exam to imitate the real one. This is data, not
code:

- one section per real exam part, in the real order;
- `type` and either `count` or a points target/range and count target/range;
- `scoring.kind` matching the real marking (`plusminus` for +1/−1/0,
  `peritem`, `proportional`, `rubric`);
- `filters` for restrictions the real exam imposes (for example a definition
  question that always comes from one topic family, or problems that are always
  marked `mock: true`);
- `spread` if the real exam draws evenly across topics or units;
- `instructions` in the student's language, describing that part as the exam
  does.

If the real exam has no true/false part, delete that section. If it has four
calculation problems and nothing else, write one problem section with
`count: 4`. If it has a choice (“answer 2 of 4”), the current blueprint has no
`choose` field; either add one to `js/blueprint.js` and `js/view-mock.js` as a
small extension, or approximate it with the fixed number the student must
answer and say so. Do not silently turn a choice exam into a fixed exam
without telling the student.

The mock total is computed from the sections; it does not have to be a round
number the app assumes. The demo blueprint is only an example, not a template
for the real format.

**Interface language.** Translate the `ui` table, or fill it if the course is
not in English. Every student-facing string in the app comes from this table.
Values may contain HTML and `{placeholders}`. Keep the placeholders. If you
add a new item type, add its label and its view's strings here too. Do not
translate `selftest.html` (it is a developer tool), and do not hard-code German
or English sentences in a view.

**Do this early.** With an empty `manifest.js`, the app loads the demo content;
that is a useful way to see the shell. Once you have a first content file,
list it in `data/manifest.js` with its id prefixes and check that the demo
content disappears. If it does not, the manifest or the loading order is
wrong.

---

## 4. Plan the content before writing items

The reference build gives a useful sense of scale. Seven slide decks (206
slides), four old exams, one sample exam and four exercise sheets became
640 items: 62 notes, 126 flashcards, 284 true/false, 63 multiple choice,
30 gap definitions and 75 problems. Per unit that was roughly 8 notes,
16 cards, 20 or more closed questions, 8 multiple-choice, 2–5 gap items and
4–9 problems.

That is calibration, not a quota to copy blindly. A course with 12 short units
should not get 8 notes per unit; a course with 4 dense units may need more. Use
these principles instead:

- **Coverage first.** Every examinable unit needs revision notes complete
  enough that a student who reads only them knows the material; flashcards for
  the facts and distinctions worth memorising; closed questions in the style
  of the real exam; gap items for every formal definition or statement that
  could be asked; and open problems for the skills the exam actually tests.
- **Exam fidelity beats volume.** A hundred invented true/false statements
  that do not resemble the real exam are less useful than thirty that do.
  Look at the old exams' phrasing, length, notation and trap style.
- **Spacing.** Mix difficulty within a unit: recall, one-step application,
  then the exam-level step. A unit with only hard problems is unusable before
  the student has revised; a unit with only flashcards does not train the exam
  skill.
- **Cross-unit items.** Some questions genuinely combine units. Put them in the
  later unit and say so in `source`; do not duplicate them.

Write a short content plan in your working notes (not necessarily in the
delivered folder): unit → file → id prefix → notes/cards/tf/mc/gaps/problems →
sources to convert. Keep a coverage table for the old exams and exercise
sheets: source question → item id → converted / skipped (and why). This is also
the brief you give a subagent. It prevents two agents writing the same question
and makes the final count checkable.

---

## 5. Produce the content

Work unit by unit, or split units among agents, but keep the same standards
everywhere.

**Revision notes.** These are the backbone. Write them as a student would want
them the night before: definitions, the main theorem or method, a worked
example, the traps, and the notation the exam uses. Use headings, lists,
tables, formulas, code and figures where they help. Do not write a slide
transcript. If the slides are thin, say what is examinable and what is
background. If a whole unit's slide deck is missing, build only what the exams,
exercises and remaining materials actually evidence, say what is missing in the
notes and the report, and do not pad the unit with invented material. If a proof is examinable, give its skeleton and the key step, not
just the statement. A student who reads only the notes should not be surprised
by an exam question. If the course allows a formula sheet, reproduce it in the
notes (or say exactly which formulas it contains); that is part of knowing what
the exam gives away and what it does not.

**Flashcards.** One fact, distinction or formula per card. The front should be
answerable without context; the back should be short enough to recall. Do not
turn a whole problem into a card. Prefer “state the condition under which …”
and “what is the difference between …” over trivia.

**Closed questions.** Write them in the exact style of the real exam. If the
exam asks ten true/false statements with one subtle false statement, do that.
If it asks multiple choice with four plausible options, make the distractors
plausible mistakes, not jokes. Every statement must be unambiguously true or
false on the course material; “sometimes true” is not a true/false item.
Every multiple-choice question has exactly one correct option. The explanation
must say why the answer is right and, where useful, why the tempting wrong
option is wrong.

**Fill-the-gap definitions.** Take every formal definition, theorem statement,
invariant or formula that could be asked as “state …” and turn it into a gap
item. Put the blanks on the words that carry the meaning, not on filler. A
5-point definition should have enough blanks to distinguish a student who
knows the definition from one who has memorised the shape. Keep maths inside
the gap or outside it; never open a gap inside a formula. Add a `note` with the
subtle point or the equivalent formulation.

**Open problems.** Convert the real exam problems and the exercise-sheet
problems that are in scope. Give each part a prompt, two or three hints that
escalate (first a nudge, then the key idea, then the computation), a model
solution written the way a full-marks answer looks, and a rubric whose points
sum to the part. The rubric is a grading aid: each row should be a checkable
achievement, not “good answer”. Add fresh variants of the exam's problem types
so the student practises the skill rather than memorising the instance. Mark
the exam-like ones `mock: true`.

**Convert every in-scope question from the old exams, the sample exam and the
exercise sheets.** Cite the exact source in `source` (“Old exam 2024, Q3(b)”,
“Exercise sheet 2, Q4”). Skip out-of-scope questions and say why in the final
report; do not silently drop them. If an exercise submission disagrees with
your derivation, resolve it and report it.

**Label anything beyond the materials.** A useful extension is allowed, but
the student must know it is not from the course: put “beyond the course
materials” in `source` or in the explanation. Do not present an invented
theorem as course content.

**Figures and code.** Copy figures into `assets/` with descriptive file names
and reference them as `assets/name.svg`; never use a remote URL. Recreate a
simple diagram if the original is a low-quality screenshot. Use code blocks
for programs, pseudo-code and command lines, and inline code for identifiers.
Remember the content-file escapes: `@@` for a backtick and `$@` for a dollar
sign inside code. Keep tables for comparisons, truth tables, rubrics and
worked numeric examples.

**Language.** Write content in the language of the materials unless the user
asked otherwise, and keep the interface in the same language. Use the course's
notation; do not translate variable names or standard symbols.

---

## 6. Hold the quality bar

A wrong answer key is worse than a missing question. A student who learns a
false statement from the trainer loses marks and trust; a student who never
sees a question loses only practice. This is the reason for the checks below,
and the reason you should apply them to cases this prompt did not foresee.

- **Derive every answer independently.** For a calculation, do it twice, or by
  a different method. For a true/false statement, try to construct a
  counterexample; if you cannot, explain why it is true. For a multiple-choice
  question, verify that the intended option is correct and that at least one
  distractor is wrong for a reason you can state. For a proof, check both
  directions and the quantifiers.
- **Official keys win where they exist**, but only after you understand them.
  If the official solution and your derivation still disagree, say so in the
  explanation and the report; do not silently pick one.
- **Leave uncertain items out.** If a slide is ambiguous, a formula is
  unreadable, or a statement depends on a convention the course never states,
  omit the item and note the gap. Do not fill the gap with a guess dressed as
  confidence.
- **Do not invent scope.** If the exam covers units 1–5, do not write items
  from unit 7 because the slide deck is interesting. If the old exam includes a
  question on a topic the current slides dropped, do not convert it.
- **Report material errors, do not reproduce them.** Correct the trainer,
  explain the correction in the item if it matters, and tell the student in the
  final report.
- **Check the mechanical invariants.** Rubric points sum to the part; gap tags
  balance and are not inside maths; every answer is a boolean where a boolean
  is expected; every id is unique and points at a real unit, topic and origin;
  no backtick and no dollar-brace sequence anywhere; every figure exists. The
  self-test catches most of this, but run it, do not assume it.
- **Do not confuse a style warning with a content error.** The self-test warns,
  for example, when a mock problem is worth more than 11 points. That 3–11
  rule is a template style rule, not a cap: if the real exam has 12-point
  problems, keep 12-point problems and mention the warning in the report.
  Never shrink a faithful item just to silence a style warning; fix the item if
  it is genuinely wrong, otherwise record the warning.
- **Independent review of answer keys is not optional.** The reference build
  had one wrong key among 347 closed questions — a statement marked false that
  is true on closer inspection. If you work alone, do a separate review pass
  after a break, reading only the item and the source, not your first answer.
  If you use subagents, the agent that wrote an item is not the only one who
  checks it.

Record what you verified and how. “I checked the keys” is not a verification
claim; “re-derived all 212 true/false answers from the slides, found and fixed
three” is.

---

## 7. Adapt to the subject

The six item types came from a proof-based mathematics course. They are a
starting point, not a law. Decide the mix from what the exam actually asks:

- If the exam is **calculation-heavy**, most items should be open problems
  with worked solutions and rubrics, plus short numeric or symbolic checks.
  True/false statements about theorems are less useful than “compute this”.
  Consider a numeric-answer type with a tolerance, following `EXTENDING.md`.
- If the exam is **programming**, code blocks and code-reading questions
  matter more than prose flashcards. Add an item type for “what does this
  program print?” or use multiple choice with code options if that matches the
  exam. Model solutions should be runnable or at least syntactically complete.
- If the exam is **essay-based**, the open-problem type with a rubric is the
  main vehicle: prompts that ask for an argument, model answers with structure,
  and rubrics that reward thesis, evidence, counter-argument and conclusion.
  Gap items can cover definitions and key dates; true/false is usually a poor
  fit unless the exam uses it.
- If the exam is **memorisation-heavy**, invest in notes and flashcards, and
  use gap items for exact statements. Keep closed questions factual and
  unambiguous; do not invent “trick” questions the exam would not ask.

The judgement criterion is always the same: what will the student have to do
in the exam, and what is the smallest set of practice that trains it? A
trainer that mirrors the exam's question forms is worth more than one that
uses all six types for completeness.

When you change the mix, change the blueprint with it. A course with no
true/false section should have no true/false section in the mock, even if the
demo does. A course whose exam is four problems should have a mock of four
problems. If you add an item type, follow the registration, validation,
rendering, scheduling and scoring steps in `EXTENDING.md`, and add a demo item
or a test item so the self-test exercises it. Keep the self-test in step; an
unvalidated new type is a hole in the quality bar.

The app's scheduling and mastery rules are subject-neutral: unseen first, then
mistakes, two correct answers in a row to master. Keep them unless the subject
demands a different notion of mastery; if you change them, change the progress
text on the dashboard too so the student is not lied to.

---

## 8. Organise the work

**With subagents.** Write the course configuration and the content plan first.
Then split by groups of units (for example units 1–2, 3–4, 5–6, 7), one agent
for old exams plus the sample exam, and one for exercise sheets. Give each
agent:

- the path to `CONTENT_SPEC.md` and the course configuration;
- its exact units/topics and the file it owns;
- its id prefix and the sources (file, pages, question numbers);
- the quota and the exam style;
- the instruction to read PDFs as rendered pages, derive every answer, cite
  sources, and not touch the app or another agent's file.

Agents write into separately owned files. Continuation files (`unit-1-b.js`,
`unit-1-c.js`, …) let one agent split a long unit without touching the
manifest. The orchestrator writes `data/manifest.js`, reviews answer keys,
checks overlaps, wires the files together and runs the self-test. Reviewing
keys is the orchestrator's job, not a formality: re-derive the closed answers
and sample the solutions.

**Without subagents.** Do the same work in the same order, sequentially, but
keep the separation: finish a unit, then review it before moving on; keep a
review pass at the end where you read the items against the sources rather
than against your memory. Do not skip the independent-check pass because you
are alone; it is even more important.

Either way, write the contract and the plan before the content. The reference
build made parallel work possible by writing the contract first; the template
already provides the contract, but the plan and the id map are still yours.

Keep an eye on the clock. The student needs a working trainer more than a
perfect one. Get the configuration and a complete unit working end-to-end
early, then broaden. A trainer with six excellent units and one thin unit is
better than six half-finished units and no mock exam.

---

## 9. Verify before handing over

Do these checks by running the trainer, not by reading the code.

1. **Self-test at zero errors.** Open `selftest.html` from `file://`. It loads
   `data/course.js`, `data/manifest.js` and every listed file (plus
   continuations), validates every item and renders every text field with
   KaTeX in strict mode. Zero errors is the bar. Warnings need a look: an
   unknown topic, a rubric sum, a short mock problem or a unit with no items
   can be harmless or can be a real gap. Fix what matters and report what
   remains. For a headless run, the page exposes `window.SELFTEST_RESULT`
   with `done`, `ok`, `errors` and `warnings` when it has finished.
2. **Every mode.** Open the dashboard, read a note, flip a flashcard, answer a
   true/false drill, a quiz, a gap definition (type, reveal, mark), and an open
   problem (hint, model solution, rubric). Check that the filters, keyboard
   shortcuts, theme switch and progress bars behave. If a mode has no items,
   confirm it is gone from the navigation rather than showing an empty screen.
3. **One complete mock exam.** Start it, answer every part, hand in, mark the
   gaps, grade the problems with the rubric, save the result. Check the score
   arithmetic against the blueprint and the real exam's points: the section
   maxima, the total and the time limit should all be the ones the course uses,
   not the demo's. Start a second mock, reload in the middle, and confirm the
   timer and answers survive. Then finish or discard it.
4. **From `file://` and from a static server.** Double-click `index.html`.
   Everything must work without fetch, modules, a build step or a server. Then
   serve the folder over a simple static server and confirm the same; a path
   that only works over HTTP is a broken deliverable.
5. **Content features actually used.** If the course uses code, figures or
   tables, open an item containing each in both themes and check that it
   renders, that the figure loads from `assets/`, and that the table is
   readable on a narrow window. Figures are lazy-loaded, so scroll one into
   view before concluding that it failed. Do not trust the self-test alone for
   layout.
6. **No personal data.** Search the whole delivered folder for the student's
   name, matriculation number, e-mail address, local paths and any other
   personal data. Exercise submissions often contain a name in the header;
   cite them as “student submission, sheet 3” instead. Do not leave extracted
   text dumps or screenshots with personal data in the folder. The user's
   original materials may stay where they are, but do not copy personal data
   from them into content, assets or filenames.
7. **No old course content.** If you started from the demo, confirm that no
   demo item is loaded alongside the real content (the manifest should list
   real files, and `_sample.js` should not appear in the bank). The demo file
   may stay in the folder as a reference, but it must not be mixed into the
   student's trainer.
8. **Configuration-driven.** Change one value in `data/course.js` (a unit
   title, the exam name, a blueprint count) and confirm the interface follows
   without touching `js/`, `index.html`, `selftest.html` or `styles.css`. If it
   does not, you have hard-coded something. Also search those files for the
   course name, unit titles and topic labels; they belong only in
   `data/course.js` and the content files.

If you add a new item type, also test its boundary cases, its empty/skip path,
its reload path and its mock section. If you cannot run a browser, say exactly
which checks you could not run; do not claim them.

---

## 10. Report honestly

The final message to the user should be short and useful, not a victory lap.
Include:

- what was built: units, item counts by type, the mock blueprint and its
  points/time, and the language;
- what materials were used and what was left out, with reasons (out of scope,
  unreadable, duplicate, uncertain);
- what you verified and how (self-test result, modes exercised, mock completed,
  `file://` tested), and what you could not verify;
- every assumption you made (exam date, scope boundary, format inference);
- errors found in the materials and in the student's own submissions;
- any content that goes beyond the materials and is labelled as such;
- known weaknesses: a thin unit, a missing item type, a mock part that is only
  approximated, warnings left in the self-test.

Do not say “all answers are correct”. Say what you checked and what remains
uncertain. The student is going to rely on this under time pressure; honesty
about a gap is more valuable than a confident claim.

---

## Reference notes from the original build

These are calibration and warnings, not rules to copy.

- Seven slide decks (206 slides), four old exams, one sample exam and four
  exercise sheets became 640 items: 62 notes, 126 flashcards, 284 true/false,
  63 multiple choice, 30 gap items, 75 problems. Per lecture: about 8 notes,
  16 cards, 20+ closed questions, 8 multiple choice, 2–5 gap items, 4–9
  problems.
- Six content agents and one app agent worked in parallel, each for 10–20
  minutes, against a contract written first. Writing the contract before the
  content is what made parallel work possible.
- The orchestrator re-derived all 347 closed-question answers and found one
  wrong key: a statement marked false that is true on closer inspection.
  Independent review of answer keys is not optional.
- Content agents found two errors on the lecture slides and several gaps in
  the student's submitted solutions. Both were worth reporting.
- Real exams contain traps that only make sense with the official key. Where
  an official solution exists, it wins, and the explanation says why.
- Material from old exams often exceeds the current scope. Decide scope first;
  it avoids hundreds of irrelevant items.
- Mechanical failure modes: a backtick or a dollar-brace inside a text breaks
  or alters a whole file; a gap opened inside maths cannot be rendered; an
  asterisk in maths can be mistaken for emphasis; rubric points that do not sum
  to the part's points. The self-test catches these, which is why it is run
  before anything is shown to the student.
- The mock exam is only convincing if it draws from the same kinds of question
  as the real one. The reference had to restrict its definition question to one
  topic family for that reason; the blueprint filters exist to express that
  restriction. Use them for your course's equivalent restriction.

## Practical mechanics, once more

- Content goes in `data/` as classic scripts appending to
  `window.TRAINER_BANK`; list each file in `data/manifest.js` with its id
  prefixes. Continuations are `X-b.js`, `X-c.js`, … and need no manifest entry.
- One item per object, using the fields and markup in `CONTENT_SPEC.md`.
  Common fields are `id`, `type`, `lecture` (unit id), `topic`, `origin`,
  `source`, `difficulty`. Problems can set `mock: true`.
- Never write a backtick or the two characters dollar-brace in a text field.
  Inside code, `@@` is a backtick and `$@` is a dollar sign.
- Figures live in `assets/` and are referenced as `![caption](assets/file.svg)`
  on their own line. No remote URLs.
- Tables are pipe tables with a separator row; they work in notes,
  explanations, prompts and solutions.
- If you add a new type, read `EXTENDING.md` and keep `selftest.html` in step.
- Do not add a build step, a framework, a package or a server. The deliverable
  is a folder that opens by double-clicking `index.html`.
- Do not change the course `id` after students have progress: it is the
  storage key.
- Do not commit or push unless the user asks.
