/* Demo content for the empty template. Neutral, obviously fictional, and
 * loaded only while no real content exists (or with ?sample=1).
 *
 * It exercises every item type and every field of CONTENT_SPEC.md: maths,
 * inline code, a fenced code block, a figure from assets/, a table, hints,
 * model solutions and rubrics. Ids use the prefix "smp-" (and "mix-smp-" for
 * the cross-unit note) so they never collide with real content.
 */
(function () {
  const R = String.raw;
  const add = (...items) => (window.TRAINER_BANK = window.TRAINER_BANK || []).push(...items);

  add(
    /* ---------------- notes ---------------- */
    { id: "smp-note-shelf-marks", type: "note", lecture: 1, topic: "catalogues", origin: "slides",
      source: "Demo notes, unit 1, slides 2–5", difficulty: 1,
      title: "Shelf marks and catalogue entries",
      order: 10,
      body: R`### What a shelf mark is

A **shelf mark** is a pair $(s, n)$: a section letter $s \in \{\mathrm{A}, \dots, \mathrm{Z}\}$ and a positive integer $n$. It is written with a hyphen, for example [[L-12]] or [[A-3]]. The pair is the *address* of one physical shelf; it is not the title of a book.

### Catalogue entries

Every catalogue entry has these fields:

| Field | Type | Required |
| --- | --- | :---: |
| shelf mark | section letter and number | yes |
| title | text | yes |
| author | text | no |
| loan class | one of *short*, *normal*, *reference* | yes |

The shelf label is produced by a tiny function:

~~~js
function shelfLabel(section, number) {
  return section + "-" + number;
}
const example = shelfLabel("L", 12); // "L-12"
const template = @@shelf-$@{number}@@; // a template literal
~~~

### Capacity of a bay

A bay has width $W$ measured in shelf units and each shelf occupies $D$ units, with one unit reserved for the aisle. The number of shelves that fit is

$$C(W, D) = \left\lfloor \frac{W - 1}{D} \right\rfloor.$$

For $W = 25$ and $D = 4$ this gives $C = 6$.

![A bay with three shelves and an aisle; the dashed line marks the usable width](assets/demo-figure.svg)

### Why the pair matters

Two different books may share a title, but two shelves may not share a mark. This is what makes a shelf mark usable as an address.`
    },
    { id: "smp-note-loans", type: "note", lecture: 2, topic: "borrowing", origin: "slides",
      source: "Demo notes, unit 2, slides 7–9", difficulty: 1,
      title: "Loan periods and renewals",
      order: 10,
      body: R`### The standard loan

A normal loan lasts $P = 14$ days and may be renewed **once** for another 14 days. A short loan lasts 3 days and cannot be renewed. A reference copy never leaves the reading room.

### When a renewal is refused

A renewal is refused if any of these holds:

1. the item is reserved by another reader;
2. the loan has already been renewed once;
3. the loan is overdue.

### Due date

If a loan starts on day $d$ and lasts $P$ days, the due date is day $d + P$. Renewing once moves it to day $d + 2P$. With $P = 14$ a normal loan started on day 3 is due on day 17, or day 31 after one renewal.

The rule can be written as a guard clause:

~~~js
function canRenew(loan) {
  if (loan.reserved || loan.renewals >= 1 || loan.overdue) return false;
  return true;
}
~~~

### A common mistake

A reservation does not shorten the current loan; it only blocks a renewal. The current reader keeps the book until the due date.`
    },
    { id: "smp-note-inventory", type: "note", lecture: 3, topic: "inventory", origin: "slides",
      source: "Demo notes, unit 3, slides 11–13", difficulty: 2,
      title: "Inventory counts",
      order: 10,
      body: R`### Counting a section

Let $a_s$ be the number of items recorded on shelf $s$ and $c_s$ the number counted by hand. The **variance** of the section is

$$V = \sum_{s \in \mathcal{S}} (c_s - a_s).$$

A positive variance means more items were found than recorded; a negative variance means fewer.

### A worked example

| Shelf | Recorded $a_s$ | Counted $c_s$ | Difference |
| --- | ---: | ---: | ---: |
| A-1 | 40 | 42 | +2 |
| A-2 | 38 | 35 | −3 |
| A-3 | 51 | 51 | 0 |

Here $V = 2 - 3 + 0 = -1$: one item is missing overall, even though one shelf has a surplus.

### Tolerance

A section is **balanced** if $|V| \le t$, where $t$ is the tolerance in the course configuration. With $t = 2$ the example above is balanced. A tolerance is not a licence to ignore a large local error: the per-shelf differences still have to be investigated.`
    },
    { id: "mix-smp-reconcile", type: "note", lecture: 3, topic: "inventory", origin: "variant",
      source: "Cross-unit demo note", difficulty: 2,
      title: "Reconciling a shelf mark with an inventory count",
      order: 90,
      body: R`A shelf mark identifies a shelf; an inventory count identifies how many items are on it. The two are linked but independent.

- A wrong shelf mark moves an item to the wrong row of the count.
- A wrong count does not change the shelf mark.

When a count disagrees with the catalogue, first check the shelf mark, then recount, then record the variance. Do not "fix" the catalogue to match a single count: the count may be the error.`
    },

    /* ---------------- cards ---------------- */
    { id: "smp-card-shelf-mark", type: "card", lecture: 1, topic: "catalogues", origin: "slides",
      source: "Demo notes, unit 1", difficulty: 1,
      front: R`What is a shelf mark?`,
      back: R`A pair $(s, n)$ of a section letter and a positive integer, written [[L-12]]. It is the address of one shelf, not a book title.` },
    { id: "smp-card-renewal", type: "card", lecture: 2, topic: "borrowing", origin: "slides",
      source: "Demo notes, unit 2", difficulty: 1,
      front: R`Name the three reasons a renewal is refused.`,
      back: R`The item is reserved; it has already been renewed once; the loan is overdue.` },
    { id: "smp-card-variance", type: "card", lecture: 3, topic: "inventory", origin: "slides",
      source: "Demo notes, unit 3", difficulty: 2,
      front: R`A section has recorded counts $a_s$ and counted values $c_s$. Give the variance $V$ and say what a negative value means.`,
      back: R`$V = \sum_s (c_s - a_s)$. A negative $V$ means fewer items were counted than recorded.` },

    /* ---------------- true / false ---------------- */
    { id: "smp-tf-shelf-unique", type: "tf", lecture: 1, topic: "catalogues", origin: "sample",
      source: "Demo sample exam, Q1a", difficulty: 1,
      statement: R`Two different shelves may share the same shelf mark.`,
      answer: false,
      explanation: R`A shelf mark is an address. If two shelves shared one, the mark would not identify a unique shelf; the catalogue could not say where an item is.` },
    { id: "smp-tf-renew-twice", type: "tf", lecture: 2, topic: "borrowing", origin: "variant",
      source: "Variant of the renewal rule", difficulty: 1,
      statement: R`A normal loan may be renewed twice if nobody has reserved the item.`,
      answer: false,
      explanation: R`The rule allows **one** renewal. A second renewal is refused regardless of reservations.` },
    { id: "smp-tf-variance-zero", type: "tf", lecture: 3, topic: "inventory", origin: "sample",
      source: "Demo sample exam, Q1b", difficulty: 2,
      statement: R`If the total variance of a section is $0$, then every shelf in the section has difference $0$.`,
      answer: false,
      explanation: R`Positive and negative differences can cancel. For example $c_1 - a_1 = +2$ and $c_2 - a_2 = -2$ give $V = 0$ although both shelves are wrong.` },

    /* ---------------- multiple choice ---------------- */
    { id: "smp-mc-required-field", type: "mc", lecture: 1, topic: "catalogues", origin: "sample",
      source: "Demo sample exam, Q2", difficulty: 1,
      question: R`Which catalogue field is **not** required for a valid entry?`,
      options: [R`Shelf mark`, R`Title`, R`Author`, R`Loan class`],
      correct: 2,
      explanation: R`The author may be unknown (for anonymous works). The shelf mark, title and loan class are required.` },
    { id: "smp-mc-capacity", type: "mc", lecture: 1, topic: "catalogues", origin: "variant",
      source: "Variant on bay capacity", difficulty: 2,
      question: R`A bay has width $W = 25$ and each shelf needs $D = 4$ units, with one unit reserved for the aisle. How many shelves fit?`,
      options: [R`$5$`, R`$6$`, R`$7$`, R`$8$`],
      correct: 1,
      explanation: R`$C = \lfloor (25 - 1) / 4 \rfloor = \lfloor 6 \rfloor = 6$.` },
    { id: "smp-mc-renewal-refused", type: "mc", lecture: 2, topic: "borrowing", origin: "exercise",
      source: "Demo exercise sheet, Q3", difficulty: 1,
      question: R`A normal loan is overdue and has never been renewed. May it be renewed?`,
      options: [R`Yes, because it was never renewed.`, R`Yes, if the reader pays a fee.`, R`No, because it is overdue.`, R`Only if the item is not reserved.`],
      correct: 2,
      explanation: R`Being overdue is by itself a reason to refuse a renewal. The renewal count and reservations are separate conditions.` },

    /* ---------------- gaps ---------------- */
    { id: "smp-gap-shelf-mark", type: "gap", lecture: 1, topic: "catalogues", origin: "sample",
      source: "Demo sample exam, Q3", difficulty: 1,
      title: "Shelf mark", points: 3,
      text: R`A **shelf mark** is a pair $(s, n)$ where <gap>$s \in \{\mathrm{A}, \dots, \mathrm{Z}\}$ is a section letter</gap> and <gap>$n$ is a positive integer</gap>. It is written with <gap>a hyphen</gap> between the two components.`,
      note: R`The pair is the address of a shelf, not the title of a book.` },
    { id: "smp-gap-loan", type: "gap", lecture: 2, topic: "borrowing", origin: "variant",
      source: "Modelled on the demo definition question", difficulty: 1,
      title: "Normal loan", points: 3,
      text: R`A **normal loan** lasts <gap>$P = 14$ days</gap> and may be renewed <gap>once</gap> for another <gap>$P$ days</gap>. A renewal is refused if the item is reserved, already renewed once, or <gap>overdue</gap>.`,
      note: R`A reservation blocks the renewal but does not shorten the current loan.` },
    { id: "smp-gap-variance", type: "gap", lecture: 3, topic: "inventory", origin: "slides",
      source: "Demo notes, unit 3", difficulty: 2,
      title: "Inventory variance", points: 3,
      text: R`For a section $\mathcal{S}$ with recorded counts $a_s$ and counted values $c_s$, the **variance** is <gap>$V = \sum_{s \in \mathcal{S}} (c_s - a_s)$</gap>. A positive value means <gap>more items were found than recorded</gap>, and a negative value means <gap>fewer items were found than recorded</gap>. The section is balanced if <gap>$|V| \le t$</gap>, where $t$ is the tolerance.`,
      note: R`A zero total does not imply that every shelf is correct; local differences can cancel.` },

    /* ---------------- problems ---------------- */
    { id: "smp-prob-bay", type: "problem", lecture: 1, topic: "catalogues", origin: "variant",
      source: "Modelled on demo sample exam, problem 1", difficulty: 2,
      title: "Fitting shelves into a bay",
      mock: true,
      statement: R`A bay has width $W$ shelf units. Every shelf occupies $D$ units and one unit is reserved for the aisle, so the number of shelves is
$$C(W, D) = \left\lfloor \frac{W - 1}{D} \right\rfloor.$$
The catalogue also uses shelf marks $(s, n)$ with $1 \le n \le C(W, D)$; the helper [[shelfLabel("L", 12)]] produces [[L-12]].

![A bay with three shelves and a reserved aisle](assets/demo-figure.svg)`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Compute $C(25, 4)$ and $C(26, 4)$. Explain in one sentence why the answers differ.`,
          hints: [R`Evaluate the floor of $(W - 1) / D$ for both widths.`,
                  R`Compare the fractional parts before taking the floor.`],
          solution: R`For $W = 25$: $(25 - 1)/4 = 24/4 = 6$, so $C = 6$. For $W = 26$: $(26 - 1)/4 = 25/4 = 6.25$, so $C = 6$.

Both bays fit six shelves. The extra unit is not enough for a seventh shelf, so it remains unused.

~~~js
const shelves = (W, D) => Math.floor((W - 1) / D);
shelves(25, 4); // 6
shelves(26, 4); // 6
~~~`,
          rubric: [ { points: 1, text: R`Both values computed: $C(25,4) = 6$ and $C(26,4) = 6$` },
                    { points: 1, text: R`Explanation refers to the floor / the unused unit` } ] },
        { label: "b", points: 2,
          prompt: R`A shelf mark is $(s, n)$ with $n$ in the range above. For $W = 25$, $D = 4$ and sections $\mathrm{A}, \mathrm{B}$, how many distinct shelf marks exist? The allowed numbers are:

| Section | Allowed $n$ |
| --- | --- |
| A | $1, \dots, 6$ |
| B | $1, \dots, 6$ |

Justify the count.`,
          hints: [R`Count the allowed numbers $n$ first.`,
                  R`Each section contributes the same number of marks.`],
          solution: R`With $C(25,4) = 6$, the allowed numbers are $n = 1, \dots, 6$, so each section has six marks. There are two sections, hence

| Section | Marks |
| --- | ---: |
| A | 6 |
| B | 6 |

In total $2 \cdot 6 = 12$ distinct shelf marks.

![The two sections of the example bay](assets/demo-figure.svg)`,
          rubric: [ { points: 1, text: R`Allowed $n$ identified as $1, \dots, 6$` },
                    { points: 1, text: R`$2 \cdot 6 = 12$ with a clear justification` } ] }
      ] },
    { id: "smp-prob-loan", type: "problem", lecture: 2, topic: "borrowing", origin: "variant",
      source: "Modelled on demo sample exam, problem 2", difficulty: 2,
      title: "A loan schedule",
      mock: true,
      statement: R`A normal loan lasts $P = 14$ days and may be renewed once. A loan starts on day $d$; after $r \in \{0, 1\}$ renewals its due date is $d + (r + 1)P$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`A loan starts on day $3$ and is renewed once. Give its due date and the number of days between start and due date.`,
          hints: [R`Substitute $d = 3$, $r = 1$, $P = 14$.`],
          solution: R`The due date is $3 + (1 + 1) \cdot 14 = 3 + 28 = 31$. The loan therefore runs for $28$ days from day $3$ to day $31$.`,
          rubric: [ { points: 1, text: R`Due date $31$` },
                    { points: 1, text: R`Duration $28$ days, not $31$` } ] },
        { label: "b", points: 2,
          prompt: R`The item is reserved on day $10$. Is a renewal on day $12$ allowed? Answer with the rule and with the resulting due date if it is allowed.`,
          hints: [R`Check the three refusal conditions one by one.`,
                  R`If a renewal is refused, the due date does not move.`],
          solution: R`No. The item is reserved, which is one of the three refusal conditions. The current loan is unaffected by the reservation, so it still ends on day $3 + 14 = 17$; a renewal would have moved the due date to day $31$, but it is not allowed.`,
          rubric: [ { points: 1, text: R`Answer no, citing the reservation` },
                    { points: 1, text: R`Due date remains day $17$` } ] }
      ] },
    { id: "smp-prob-inventory", type: "problem", lecture: 3, topic: "inventory", origin: "exercise",
      source: "Demo exercise sheet, Q4", difficulty: 2,
      title: "Reading an inventory variance",
      mock: true,
      statement: R`A section has two shelves. The recorded and counted values are $a_1 = 40$, $c_1 = 42$ and $a_2 = 38$, $c_2 = 35$.`,
      parts: [
        { label: "a", points: 1,
          prompt: R`Compute the variance $V$.`,
          hints: [R`Add the two differences $c_s - a_s$.`],
          solution: R`$V = (42 - 40) + (35 - 38) = 2 - 3 = -1$.`,
          rubric: [ { points: 1, text: R`$V = -1$ with the two differences shown` } ] },
        { label: "b", points: 2,
          prompt: R`Is the section balanced for tolerance $t = 2$? Does the answer mean that no shelf needs checking? Explain both answers.`,
          hints: [R`Compare $|V|$ with $t$.`,
                  R`Look at the individual differences, not only their sum.`],
          solution: R`Since $|V| = 1 \le 2$, the section is balanced by the tolerance rule. This does **not** mean that both shelves are correct: shelf 1 has a surplus of 2 and shelf 2 a deficit of 3, and the errors happen to nearly cancel. Both shelves still need to be investigated; the tolerance only decides whether the section is escalated as a whole.`,
          rubric: [ { points: 1, text: R`Balanced, because $|{-1}| \le 2$` },
                    { points: 1, text: R`Local differences $+2$ and $-3$ still require checking` } ] }
      ] }
  );
})();
