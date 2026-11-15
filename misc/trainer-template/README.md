# Trainer template

This folder is a complete, content-free exam trainer. It opens by
double-clicking `index.html`; there is no build step and no server. The only
external dependency is the KaTeX CDN link the page already has.

The app itself is finished: dashboard, revision notes, flashcards, true/false
drills, multiple-choice quizzes, fill-the-gap definitions, open problems with
hints and rubrics, a timed mock exam that survives a reload, progress in
`localStorage`, filters, keyboard shortcuts and light/dark themes. It loads
course content from classic scripts in `data/`, validates every item and
reports broken content instead of crashing.

The empty folder shows a small fictional demo course so you can see that
everything is alive. The demo is replaced as soon as you list real content
files in `data/manifest.js`.

## What to do

1. Copy this whole folder somewhere private, one copy per course.
2. Put the course materials in `materials/`:

   ```
   materials/slides/       lecture slides (PDF)
   materials/exercises/    exercise sheets, optionally with your solutions
   materials/exams/        old exams and the sample exam
   materials/notes/        handouts, formula sheets, anything else
   ```

   The agent tolerates other layouts, but this is the easiest one.
3. Open an AI coding agent in the copied folder and say:

   **“Build the trainer for course XY.”**

The agent reads `AGENT_PROMPT.md` and does the rest: it takes stock of the
materials, asks for the exam date and any scope boundary it cannot infer,
configures the course, writes and checks the content, runs the self-test,
exercises every mode in a browser, and reports what it verified and what it
left out.

## What is in the folder

| Path | Purpose |
| --- | --- |
| `AGENT_PROMPT.md` | the instructions for the AI agent — the main product |
| `CONTENT_SPEC.md` | contract for content files: item types, fields, markup, hard rules |
| `EXTENDING.md` | recipe for adding an item type, scoring rule or mock section |
| `README.md` | this file |
| `index.html` | the trainer |
| `selftest.html` | validates every item and renders every text field strictly |
| `styles.css` | the look, light and dark |
| `js/` | app code; contains nothing course-specific |
| `data/course.js` | the one course configuration: name, exam, units, topics, origins, blueprint, interface strings |
| `data/manifest.js` | the list of content files to load |
| `data/_sample.js` | fictional demo content, loaded only while no real content exists |
| `assets/` | local figures referenced by content |
| `materials/` | empty; put the course materials here |

## Notes

- Progress is stored per course id (`trainer-<id>`), so several trainers opened
  from `file://` do not overwrite each other.
- Do not rename the course id after students have used the trainer.
- A missing content file or a malformed item is reported and skipped; the app
  still opens. `selftest.html` is the strict check.
- There is no analytics, no network request except the KaTeX CDN, and no
  personal data in the template.
- If the browser blocks `localStorage` for `file://` pages, progress is lost on
  reload; the app shows a notice. A simple static server fixes that if needed.
