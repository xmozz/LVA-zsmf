/* Exercise sheet 2, PRF constructions 2.2–2.4 as full proof/counterexample
 * problems. Q1, Q2.1, Q3, Q4 and Q5 are already covered in the unit files and
 * in exercises.js; this file fills the remaining proof gap.
 */
(function () {
  const R = String.raw;
  const add = (...items) => (window.TRAINER_BANK = window.TRAINER_BANK || []).push(...items);

  add(
    { id: "es-ue2-q2bcd", type: "problem", lecture: 4, topic: "prfs", origin: "exercise",
      source: "Exercise sheet 2, Problems 2.2–2.4", difficulty: 3,
      title: "Three More PRF Constructions",
      statement: R`Let $F:\{0,1\}^\lambda \times \{0,1\}^n \to \{0,1\}^n$ be a PRF and let $a\|b$ denote concatenation. Decide for each construction whether it is a PRF and prove your answer.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`$F'(k,x) := F(k,x) \,\|\, F(k,x \oplus 1^n)$ for $x \in \{0,1\}^n$.`,
          hints: [R`Query both $x$ and $x \oplus 1^n$.`,
                  R`What happens to the two halves?`],
          solution: R`**Not a PRF.** Query $x$ and $x' := x \oplus 1^n$. Then
$$F'(k,x) = F(k,x) \,\|\, F(k,x'), \qquad F'(k,x') = F(k,x') \,\|\, F(k,x).$$
The two answers are the same two halves in swapped order. A truly random function would produce two independent uniform $2n$-bit strings; the probability that they are exact swaps is $2^{-2n}$. The distinguisher checks the swap relation and wins with overwhelming advantage.`,
          rubric: [ { points: 1, text: R`Not a PRF` },
                    { points: 1, text: R`Query $x$ and $x\oplus 1^n$; the halves are swapped` } ] },
        { label: "b", points: 2,
          prompt: R`$F'(k,x_1\|x_2) := F(k,x_1) \,\|\, F(k,x_2)$ for $x_1,x_2 \in \{0,1\}^n$.`,
          hints: [R`Choose $x_1=x_2$.`,
                  R`What do the two halves of the answer look like?`],
          solution: R`**Not a PRF.** Query the single input $x\|x$. Then
$$F'(k,x\|x) = F(k,x) \,\|\, F(k,x),$$
so the two halves are always equal. A truly random function outputs two independent uniform $n$-bit strings; they are equal only with probability $2^{-n}$. The distinguisher checks whether the halves are equal and wins with overwhelming advantage.

Equivalently, for fixed $x_1$, the first half of $F'(k,x_1\|x_2)=F(k,x_1)$ does not depend on $x_2$, which a random function would not do.`,
          rubric: [ { points: 1, text: R`Not a PRF` },
                    { points: 1, text: R`Query $x\|x$: the two halves are equal` } ] },
        { label: "c", points: 2,
          prompt: R`$F'(k,x) := F(k,0\|x) \,\|\, F(k,1\|x)$ for $x \in \{0,1\}^{n-1}$.`,
          hints: [R`Use the PRF oracle on $0\|x$ and $1\|x$.`,
                  R`The two input domains are disjoint; what does that imply for a random function?`],
          solution: R`**Yes, $F'$ is a PRF.** Let $B$ have oracle access to either $F(k,\cdot)$ or a truly random function $f$. On a query $x$, $B$ queries its oracle on $0\|x$ and $1\|x$, receives $y_0,y_1$, and returns $y_0\|y_1$.

**Simulation.** If the oracle is $F(k,\cdot)$, $B$ answers exactly $F'(k,x)$. If the oracle is $f$, then for every fixed $x$ the inputs $0\|x$ and $1\|x$ are distinct, so $f(0\|x)$ and $f(1\|x)$ are independent uniform. For different queries $x\ne x'$ all inputs $0\|x,1\|x,0\|x',1\|x'$ are distinct as well, so all answers are independent. Hence $A$ sees a truly random function.

**Runtime and advantage.** $B$ makes exactly two oracle queries per query of $A$ and otherwise only concatenates. If $A$ is PPT, so is $B$. The advantages are equal, so a non-negligible advantage against $F'$ would contradict the PRF property of $F$.`,
          rubric: [ { points: 1, text: R`Yes, a PRF; reduction queries $0\|x$ and $1\|x$` },
                    { points: 1, text: R`Disjoint domains make the answers independent for a random function` } ] }
      ] }
  );
})();
