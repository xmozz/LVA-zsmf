(function () {
  const R = String.raw;
  const add = (...items) => (window.CRYPTO_BANK = window.CRYPTO_BANK || []).push(...items);

  // =====================================================================
  // LECTURE 5: pseudorandomness, PRGs, proofs by reduction, pseudo-OTP
  // =====================================================================

  // ----------------------------- NOTES ---------------------------------
  add(
    { id: "l5-note-pseudorandomness", type: "note", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slides 3–5", difficulty: 1,
      title: "Randomness and pseudorandomness",
      order: 10,
      body: R`### Randomness is a property of distributions

Which of $0000000000000000$ and $0110110010110110$ is "random"? If sampled uniformly from $\{0,1\}^{16}$, **both** appear with probability exactly $2^{-16}$. So it makes no sense to call a single string random: randomness is a property of a **distribution**.

A **distribution** on $n$-bit strings is a function $D \colon \{0,1\}^n \to [0,1]$ with $\sum_{x \in \{0,1\}^n} D(x) = 1$. The **uniform distribution** is $U_n \colon x \mapsto 2^{-n}$. Notation: $x \gets D$ means "sample $x$ according to $D$".

### From statistical tests to all efficient tests

Historically, $D$ was called pseudorandom if it passed a list of statistical tests $T_1, T_2, \dots$:
$$\Pr_{x \gets D}[T_i(x) = 1] \approx \Pr_{x \gets U_n}[T_i(x) = 1] \quad \text{for } i = 1, 2, \dots$$
In cryptography we do not know which test the adversary will use, so a pseudorandom distribution must pass **all efficient tests**.

### Concrete version

$D$ is $(t, \varepsilon)$-**pseudorandom** if for all $\mathcal{A}$ running in time at most $t$:
$$\Bigl|\Pr_{x \gets D}[\mathcal{A}(x) = 1] - \Pr_{x \gets U_n}[\mathcal{A}(x) = 1]\Bigr| \le \varepsilon.$$

### Asymptotic version

Take a **sequence** of distributions $\{D_n\}_{n \in \mathbb{N}}$ with $D_n$ a distribution on $\{0,1\}^{\ell(n)}$ for a polynomial $\ell$. It is **pseudorandom** if for all p.p.t. $\mathcal{A}$ there exists a negligible $\varepsilon(\cdot)$ such that
$$\Bigl|\Pr_{x \gets D_n}[\mathcal{A}(x) = 1] - \Pr_{x \gets U_{\ell(n)}}[\mathcal{A}(x) = 1]\Bigr| \le \varepsilon(n).$$

### Typical trap

A pseudorandom distribution is in general **far from uniform** in the statistical sense (e.g. it may only hit a tiny fraction of all strings). Pseudorandom means only that **no efficient** algorithm can tell the difference with non-negligible advantage.` },

    { id: "l5-note-prg-def", type: "note", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slides 6–8", difficulty: 1,
      title: "Pseudorandom generators (Definition 3.14)",
      order: 20,
      body: R`### Idea

A **pseudorandom generator** (PRG) is a **deterministic** polynomial-time algorithm that takes a short **uniform seed** and expands it into a **longer** output that looks uniform: from a "few" truly random bits we get lots of pseudorandom bits. Practical example on the slides: the stream cipher Trivium, $\{0,1\}^{80} \to \{0,1\}^{2^{64}}$.

### Definition 3.14

A deterministic poly-time algorithm $G$ with $|G(x)| = \ell(|x|)$ for all $x$ is a **pseudorandom generator** if it is

- **expanding:** $\ell(n) > n$ for all $n$, and
- **pseudorandom:** the sequence of distributions $\{G(U_n)\}_{n \in \mathbb{N}}$ is pseudorandom,

that is, for all p.p.t. $\mathcal{D}$ there exists a negligible $\varepsilon(\cdot)$ such that
$$\Bigl|\Pr_{s \gets U_n}[\mathcal{D}(G(s)) = 1] - \Pr_{y \gets U_{\ell(n)}}[\mathcal{D}(y) = 1]\Bigr| \le \varepsilon(n).$$
$\ell$ is called the **expansion factor**.

### The distinguishing game (slide 8)

- **Real world:** the challenger picks $s \gets \{0,1\}^n$ and gives $G(s)$ to $\mathcal{D}$; $\mathcal{D}$ outputs a bit.
- **Random world:** the challenger picks $y \gets \{0,1\}^{\ell(n)}$ and gives $y$ to $\mathcal{D}$; $\mathcal{D}$ outputs a bit.

$G$ is a PRG iff every p.p.t. $\mathcal{D}$ outputs 1 with almost the same probability in both worlds: the two worlds are **computationally indistinguishable**.

### Things to note

- $G$ defines a **sequence** of distributions $G(U_1), G(U_2), \dots$; security is asymptotic in the seed length $n$.
- $G(U_n)$ has support of size at most $2^n$, which is at most a $2^{n - \ell(n)} \le \tfrac12$ fraction of $\{0,1\}^{\ell(n)}$. So $G(U_n)$ is **never** uniform; it only *looks* uniform to efficient observers.
- The seed must be **uniform and secret**: given $s$, anyone can recompute $G(s)$.
- Both conditions are needed: an algorithm with $\ell(n) = n$ (e.g. the identity) gives perfectly uniform output but is **not** a PRG because it does not expand.` },

    { id: "l5-note-prg-limits", type: "note", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slides 7 and 9", difficulty: 2,
      title: "Limits of PRGs: unbounded distinguishers and existence",
      order: 30,
      body: R`### No PRG is secure against unbounded distinguishers

The restriction to **p.p.t.** distinguishers is essential. Consider the (exponential-time) distinguisher

$\mathcal{D}(y)$: output 1 iff there is a seed $s \in \{0,1\}^n$ with $G(s) = y$ (try all $2^n$ seeds).

- Real world: $y = G(s)$ is always in the range of $G$, so $\Pr[\mathcal{D}(G(s)) = 1] = 1$.
- Random world: the range of $G$ has at most $2^n$ elements, so
$$\Pr_{y \gets U_{\ell(n)}}[\mathcal{D}(y) = 1] \le \frac{2^n}{2^{\ell(n)}} \le \frac{2^n}{2^{n+1}} = \frac12.$$

The advantage is at least $\tfrac12$, so $G(U_n)$ is **statistically far** from uniform. This $\mathcal{D}$ runs in time about $2^n$, hence is not p.p.t. and does not contradict the definition. Pseudorandomness is a purely **computational** notion.

### Do PRGs exist?

- We **do not know**. Existence of a PRG implies $P \ne NP$, so a proof would solve a famous open problem.
- PRGs can be constructed from weak assumptions: **one-way functions** (easy to compute, hard to invert, e.g. multiplying primes $p, q$ to $N = pq$ is easy, factoring $N$ is hard) imply PRGs.
- In this lecture we **assume** certain constructions are PRGs and then **use** them to build encryption schemes that overcome the shortcomings of perfectly secret schemes (long keys).` },

    { id: "l5-note-prg-closure", type: "note", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slides 7–8 (applied)", difficulty: 2,
      title: "Is G' a PRG? What follows from G being a PRG",
      order: 40,
      body: R`Exam Q1 often asks: "if $G$ is a PRG, is $G'$ a PRG?" Decide with one of two tools.

### Tool 1: G' is NOT a PRG, give a distinguisher

Find an **efficiently checkable relation** that **always** holds for $G'(s)$ but holds only with probability $\le \tfrac12$ (often negligible) for a uniform string. Then $\mathcal{D}$ outputs 1 iff the relation holds; its advantage is non-negligible. Also check **expansion**: if $|G'(s)| \le |s|$, $G'$ is not a PRG by definition.

### Tool 2: G' IS a PRG, give a reduction

Given any p.p.t. $\mathcal{D}'$ against $G'$, build $\mathcal{D}$ against $G$: on input $y$, transform $y$ with an efficient map $T$ and output $\mathcal{D}'(T(y))$. Show that $T(G(s)) = G'(s)$ and that $T(\text{uniform})$ is uniform. Then the advantages are equal.

### Catalogue (G a PRG with expansion factor $\ell$)

**PRGs:**

- $G'(s) := G(s) \oplus c$ for a fixed string $c$, e.g. $c = 1^{\ell(n)}$ (XOR with a constant is a bijection, so uniform stays uniform).
- $G'(s) :=$ the bits of $G(s)$ in a fixed permuted order (e.g. reversed).
- $G'(s) := G(s)$ with some output bits dropped, **as long as** the output is still longer than $n$.
- $G'(s) := G(\bar{s})$ (or $G(\pi(s))$ for any efficient bijection $\pi$ on seeds): $\bar{s}$ is uniform when $s$ is.
- $G'(s_1 \| s_2) := G(s_1) \| G(s_2)$ (hybrid argument with two steps).
- $G'(s) := G(G(s))$ when $G$ is length-doubling (two steps: replace $G(s)$ by a uniform $2n$-bit seed, then use security of $G$ on seed length $2n$).

**Not PRGs:**

- $G'(s) := G(s) \| G(s)$: the two halves are equal; a uniform string has equal halves with probability $2^{-\ell(n)}$.
- $G'(s) := G(s) \| s$: $\mathcal{D}$ parses $y \| s'$ and checks $G(s') = y$.
- $G'(s) := G(s) \| 0$: the last bit is always 0 (advantage $\tfrac12$).
- $G'(s) :=$ first $n$ bits of $G(s)$: not expanding.
- $G'(s) := G(0^n)$ (ignores the seed): $\mathcal{D}$ checks $y = G(0^n)$.

### What does and does not follow

- **Follows:** every efficiently testable property has almost the same probability for $G(s)$ as for a uniform string, e.g. each output bit equals 1 with probability $\tfrac12 \pm \mathsf{negl}(n)$.
- **Does not follow:** $G(U_n)$ is uniform (it never is); $G$ stays secure if the seed is revealed or reused; $G$ is secure against unbounded distinguishers.` },

    { id: "l5-note-reductions", type: "note", lecture: 5, topic: "reductions", origin: "slides",
      source: "Lecture 5, slide 11", difficulty: 2,
      title: "Proofs by reduction: the general recipe",
      order: 50,
      body: R`### Goal

We want to show: **problem hard to solve $\Rightarrow$ construction hard to break.** Since we cannot prove unconditional hardness, we prove the contrapositive in algorithmic form.

### Recipe (slide 11)

1. **Assume** the problem is hard: no efficient algorithm solves it (e.g. $G$ is a PRG: no p.p.t. $\mathcal{D}$ distinguishes $G(U_n)$ from $U_{\ell(n)}$).
2. **Assume** there exists an efficient adversary $\mathcal{A}$ against the construction (e.g. wins $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}$ with probability $\tfrac12 + $ non-negligible).
3. **Construct** an algorithm $\mathcal{A}'$ (the **reduction**) against the problem that uses $\mathcal{A}$ as a subroutine: $\mathcal{A}'$ receives an **instance of the problem**, turns it into an **instance of the construction** for $\mathcal{A}$, and turns $\mathcal{A}$'s **break** into a **solution** of the problem.
4. Show $\mathcal{A}'$ is efficient and succeeds with non-negligible probability. This contradicts step 1, so **no such $\mathcal{A}$ exists**. Q.E.D.

### Equivalent direct form (used in the proofs)

"For every p.p.t. $\mathcal{A}$ we build a p.p.t. $\mathcal{A}'$ with $\mathsf{Adv}_{\mathcal{A}'}(\text{problem}) \ge \mathsf{Adv}_{\mathcal{A}}(\text{construction}) - \text{something negligible}$. Since the left side is negligible, so is the right."

### Key points for full marks

- The reduction goes **from** the adversary against the construction **to** an algorithm against the assumption, never the other way round.
- The reduction must be **p.p.t.**: it may only do polynomial extra work besides running $\mathcal{A}$ once.
- The reduction must **perfectly simulate** (or simulate up to a bounded error) the experiment that $\mathcal{A}$ expects, without knowing secrets it does not have (e.g. the seed or the key).
- Analyse **both worlds** of the assumption (pseudorandom vs. truly random) separately.` },

    { id: "l5-note-pseudo-otp", type: "note", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slides 13 and 19", difficulty: 1,
      title: "The pseudo one-time pad (Construction 3.17)",
      order: 60,
      body: R`### Motivation

The one-time pad is perfectly secret but needs a key as long as the message (Shannon). Idea: use a **short** key as a PRG seed and use the PRG output as a **pseudorandom pad**.

### Construction 3.17

Let $G$ be a PRG with $|G(k)| = \ell(|k|)$. Security parameter $n$, message space $\mathcal{M} = \{0,1\}^{\ell(n)}$.

- $\mathsf{Gen}(1^n)$: $k \gets \{0,1\}^n$; return $k$.
- $\mathsf{Enc}_k(m)$: return $c := G(k) \oplus m$.
- $\mathsf{Dec}_k(c)$: return $m := G(k) \oplus c$.

**Correctness:** $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = G(k) \oplus G(k) \oplus m = m$.

### Theorem 3.16

If $G$ is a PRG, then the pseudo one-time pad is **computationally indistinguishable in the presence of an eavesdropper** (EAV-secure, Definition 3.8): for every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$.

### What it does NOT give (slide 19)

- **Not perfectly secret:** the key ($n$ bits) is shorter than the message ($\ell(n) > n$ bits), so Shannon's bound $|\mathcal{K}| \ge |\mathcal{M}|$ is violated.
- **Security rests on two things:** the **assumption** (what if $G$ is not pseudorandom?) and the **definition** (what if EAV-security is not strong enough?).
- **Key reuse breaks it:** $\mathsf{Enc}$ is deterministic, so encrypting $m, m'$ with the same key gives $c \oplus c' = m \oplus m'$. Example from the slide: knowing that $m \in \{\text{"B"}, \text{"S"}\}$ and $m' \in \{\text{"Y"}, \text{"N"}\}$, the XOR $m \oplus m'$ reveals the combination. EAV-security is a **single-message** notion.` },

    { id: "l5-note-pseudo-otp-proof", type: "note", lecture: 5, topic: "reductions", origin: "slides",
      source: "Lecture 5, slides 14–18", difficulty: 3,
      title: "Proof of Theorem 3.16 (pseudo-OTP is EAV-secure), step by step",
      order: 70,
      body: R`### 0. What we want

For every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$, where in $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)$ for the pseudo-OTP: $k \gets \{0,1\}^n$, $\mathcal{A}$ outputs $m_0, m_1$, $b \gets \{0,1\}$, $c := G(k) \oplus m_b$, $\mathcal{A}$ outputs $b'$, result is 1 iff $b' = b$.

### 1. The assumption

$G$ is a PRG: for every p.p.t. $\mathcal{A}'$ there is a negligible $\varepsilon$ with
$$\Bigl|\Pr_{k \gets U_n}[\mathcal{A}'(G(k)) = 1] - \Pr_{y \gets U_{\ell(n)}}[\mathcal{A}'(y) = 1]\Bigr| \le \varepsilon(n).$$

### 2. The reduction $\mathcal{A}'$ (uses $\mathcal{A}$)

$\mathcal{A}'$ gets a string $y \in \{0,1\}^{\ell(n)}$ (either $y = G(k)$ for $k \gets \{0,1\}^n$, or $y \gets \{0,1\}^{\ell(n)}$):

1. Run $\mathcal{A}(1^n)$ and receive $m_0, m_1$.
2. Choose $b \gets \{0,1\}$ and give $c := y \oplus m_b$ to $\mathcal{A}$.
3. Receive $b'$ from $\mathcal{A}$; output $\beta := 1$ iff $b' = b$.

$\mathcal{A}$ p.p.t. $\Rightarrow$ $\mathcal{A}'$ p.p.t. (one run of $\mathcal{A}$ plus one XOR).

### 3. Case 1: $y = G(k)$ with $k \gets \{0,1\}^n$

Then $k$ is distributed exactly like the output of $\mathsf{Gen}$ and $c = G(k) \oplus m_b = \mathsf{Enc}_k(m_b)$. So $\mathcal{A}'$ perfectly simulates $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}$ and outputs 1 exactly when $\mathcal{A}$ wins:
$$\Pr_{k \gets U_n}[\mathcal{A}'(G(k)) = 1] = \Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1].$$

### 4. Case 2: $y \gets \{0,1\}^{\ell(n)}$ uniform

Then $c = y \oplus m_b$ is a **one-time pad** encryption, so $c$ is uniform and independent of $b$. Whatever $\mathcal{A}$ does, $\Pr[b' = b] = \tfrac12$:
$$\Pr_{y \gets U_{\ell(n)}}[\mathcal{A}'(y) = 1] = \tfrac12.$$

### 5. Conclusion

Plug both cases into the PRG inequality (which holds for this particular $\mathcal{A}'$):
$$\Bigl|\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] - \tfrac12\Bigr| \le \varepsilon(n) \quad\Rightarrow\quad \Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n).$$
Since $\mathcal{A}$ was an arbitrary p.p.t. adversary, $\Pi$ is EAV-secure. $\square$

### Remember the order

For **any** p.p.t. $\mathcal{A}$ we built **one** p.p.t. $\mathcal{A}'$; PRG security then gives **a** negligible $\varepsilon$ for this $\mathcal{A}'$, and that $\varepsilon$ is the one we use for $\mathcal{A}$.` },

    { id: "l5-note-exam-reduction-template", type: "note", lecture: 5, topic: "reductions", origin: "slides",
      source: "Lecture 5, slides 11–18 (exam template)", difficulty: 3,
      title: "How to write a reduction proof in the exam",
      order: 80,
      body: R`Use this skeleton for "Prove by giving a reduction that ... is secure if $G$ is a PRG / $F$ is a PRF". Each step is usually worth points.

### Step 1: State the assumption precisely

"Since $G$ is a PRG, for every p.p.t. $\mathcal{D}$ there is a negligible $\varepsilon$ such that $\bigl|\Pr_{s \gets \{0,1\}^n}[\mathcal{D}(G(s)) = 1] - \Pr_{y \gets \{0,1\}^{\ell(n)}}[\mathcal{D}(y) = 1]\bigr| \le \varepsilon(n)$." (For a PRF: the oracle version with $F_k$ vs. $f \gets \mathsf{Func}_n$.)

### Step 2: State what you must show

"Let $\mathcal{A}$ be any p.p.t. adversary against $\Pi$ (or distinguisher against $G'$). We show $\Pr[\mathsf{PrivK}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \mathsf{negl}(n)$."

### Step 3: Define the reduction

"We define $\mathcal{D}$ which gets input $y$ (or oracle access to $\mathcal{O}$, which is $F_k$ or $f$; $\mathcal{D}$ does not know which):"

1. Run $\mathcal{A}(1^n)$, playing the challenger for $\mathcal{A}$.
2. Answer each of $\mathcal{A}$'s queries using $y$ / the oracle in place of $G(k)$ / $F_k$ (say exactly how).
3. When $\mathcal{A}$ outputs $m_0, m_1$: choose $b \gets \{0,1\}$ yourself and build the challenge with $y$ / the oracle.
4. When $\mathcal{A}$ outputs $b'$: output $1$ iff $b' = b$.

"$\mathcal{D}$ is p.p.t. since $\mathcal{A}$ is, and $\mathcal{D}$ does only polynomially many extra operations."

### Step 4: Real world

"If $y = G(s)$ / $\mathcal{O} = F_k$, then $\mathcal{D}$ simulates $\mathsf{PrivK}_{\mathcal{A},\Pi}$ perfectly, hence $\Pr[\mathcal{D} = 1] = \Pr[\mathsf{PrivK}_{\mathcal{A},\Pi}(n) = 1]$."

### Step 5: Random world

"If $y$ is uniform / $\mathcal{O} = f$, then [argument: one-time pad, or fresh random values unless a bad event occurs], hence $\Pr[\mathcal{D} = 1] = \tfrac12$ (or $\le \tfrac12 + q(n)/2^n$)."

### Step 6: Conclude

Combine with Step 1:
$$\Pr[\mathsf{PrivK}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n) \;(+\, q(n)/2^n),$$
which is $\tfrac12$ plus a negligible function, since sums of negligible functions are negligible. "As $\mathcal{A}$ was arbitrary, $\Pi$ is secure."

### Variant: proving $G'$ is a PRG

Here $\mathcal{D}$ gets $y$, computes $T(y)$, runs $\mathcal{D}'(T(y))$ and outputs what $\mathcal{D}'$ outputs. Show $T(G(s)) = G'(s)$ (real world) and $T(U_{\ell(n)})$ is uniform on the output length of $G'$ (random world). Then the advantages are equal, so $\mathcal{D}'$'s advantage is at most $\varepsilon(n)$.

### Frequent point losses

- Reduction in the wrong direction, or $\mathcal{D}$ uses the seed/key it does not have.
- Forgetting to say who picks $b$ ($\mathcal{D}$ picks it!).
- Forgetting to argue $\mathcal{D}$ is p.p.t.
- Only analysing the real world, or claiming "exactly $\tfrac12$" in the random world without a reason.` },
  );

  // ----------------------------- CARDS ---------------------------------
  add(
    { id: "l5-card-01", type: "card", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 3", difficulty: 1,
      front: R`Is the string $0^{16}$ "less random" than $0110110010110110$?`,
      back: R`No. Randomness is a property of **distributions**, not strings. Under $U_{16}$ both strings have probability exactly $2^{-16}$.` },
    { id: "l5-card-02", type: "card", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 3", difficulty: 1,
      front: R`What is a distribution on $n$-bit strings, and what is $U_n$?`,
      back: R`A function $D \colon \{0,1\}^n \to [0,1]$ with $\sum_{x} D(x) = 1$. The uniform distribution is $U_n(x) = 2^{-n}$ for all $x \in \{0,1\}^n$.` },
    { id: "l5-card-03", type: "card", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 4", difficulty: 1,
      front: R`Why is "passes these statistical tests" not good enough as a definition of pseudorandomness in cryptography?`,
      back: R`We do not know which test the adversary uses. A pseudorandom distribution must therefore pass **all efficient** tests (all p.p.t. distinguishers).` },
    { id: "l5-card-04", type: "card", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 5", difficulty: 1,
      front: R`When is a distribution $D$ on $\{0,1\}^n$ $(t,\varepsilon)$-pseudorandom?`,
      back: R`If for all $\mathcal{A}$ running in time at most $t$: $\bigl|\Pr_{x \gets D}[\mathcal{A}(x)=1] - \Pr_{x \gets U_n}[\mathcal{A}(x)=1]\bigr| \le \varepsilon$.` },
    { id: "l5-card-05", type: "card", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 5", difficulty: 2,
      front: R`When is a sequence of distributions $\{D_n\}_{n\in\mathbb{N}}$ (with $D_n$ on $\{0,1\}^{\ell(n)}$) pseudorandom?`,
      back: R`If for all p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\bigl|\Pr_{x \gets D_n}[\mathcal{A}(x)=1] - \Pr_{x \gets U_{\ell(n)}}[\mathcal{A}(x)=1]\bigr| \le \varepsilon(n)$.` },
    { id: "l5-card-06", type: "card", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7", difficulty: 1,
      front: R`What two properties define a PRG $G$ (Definition 3.14)?`,
      back: R`$G$ is a deterministic poly-time algorithm with $|G(x)| = \ell(|x|)$ that is **expanding**, $\ell(n) > n$ for all $n$, and **pseudorandom**: for all p.p.t. $\mathcal{D}$ there is a negligible $\varepsilon$ with $\bigl|\Pr_{s \gets U_n}[\mathcal{D}(G(s))=1] - \Pr_{y \gets U_{\ell(n)}}[\mathcal{D}(y)=1]\bigr| \le \varepsilon(n)$.` },
    { id: "l5-card-07", type: "card", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7", difficulty: 2,
      front: R`Why is $G(U_n)$ never the uniform distribution on $\{0,1\}^{\ell(n)}$?`,
      back: R`$G$ is deterministic, so $G(U_n)$ has at most $2^n$ possible outputs, i.e. at most a $2^n/2^{\ell(n)} \le \tfrac12$ fraction of $\{0,1\}^{\ell(n)}$. Uniform would need all $2^{\ell(n)}$ strings.` },
    { id: "l5-card-08", type: "card", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7 (KL §3.3.1)", difficulty: 2,
      front: R`Give the unbounded distinguisher that breaks every PRG and its advantage.`,
      back: R`$\mathcal{D}(y)$: output 1 iff some $s \in \{0,1\}^n$ has $G(s) = y$ (try all $2^n$ seeds). It outputs 1 always on $G(s)$, and with probability at most $2^n/2^{\ell(n)} \le \tfrac12$ on a uniform $y$. Advantage $\ge \tfrac12$, but it runs in time about $2^n$, so it is not p.p.t.` },
    { id: "l5-card-09", type: "card", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 9", difficulty: 1,
      front: R`Do PRGs exist? From what can they be built?`,
      back: R`Unknown: the existence of a PRG would imply $P \ne NP$. PRGs can be built from **one-way functions** (e.g. based on the hardness of factoring). The lecture **assumes** certain constructions are PRGs.` },
    { id: "l5-card-10", type: "card", lecture: 5, topic: "reductions", origin: "slides",
      source: "Lecture 5, slide 11", difficulty: 2,
      front: R`Describe the logic of a proof by reduction.`,
      back: R`To show "problem hard $\Rightarrow$ construction hard to break": assume an efficient adversary $\mathcal{A}$ breaks the construction; build an efficient algorithm $\mathcal{A}'$ that uses $\mathcal{A}$ to solve the problem (it maps a problem instance to a construction instance and $\mathcal{A}$'s break to a solution). This contradicts the hardness assumption, so no such $\mathcal{A}$ exists.` },
    { id: "l5-card-11", type: "card", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 13", difficulty: 1,
      front: R`State the pseudo one-time pad (Construction 3.17).`,
      back: R`$\mathsf{Gen}(1^n)$: $k \gets \{0,1\}^n$. $\mathsf{Enc}_k(m) := G(k) \oplus m$. $\mathsf{Dec}_k(c) := G(k) \oplus c$. Messages have length $\ell(n)$, where $G$ is a PRG with expansion factor $\ell$.` },
    { id: "l5-card-12", type: "card", lecture: 5, topic: "reductions", origin: "slides",
      source: "Lecture 5, slide 16", difficulty: 2,
      front: R`In the proof of Theorem 3.16, what does the reduction $\mathcal{A}'$ do on input $y$?`,
      back: R`Run $\mathcal{A}(1^n)$ to get $m_0, m_1$; pick $b \gets \{0,1\}$; give $c := y \oplus m_b$ to $\mathcal{A}$; when $\mathcal{A}$ outputs $b'$, output $\beta := 1$ iff $b' = b$.` },
    { id: "l5-card-13", type: "card", lecture: 5, topic: "reductions", origin: "slides",
      source: "Lecture 5, slide 17", difficulty: 2,
      front: R`What are the two cases in the proof of Theorem 3.16 and what probability does each give?`,
      back: R`**Case 1** $y = G(k)$: $\mathcal{A}'$ simulates $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}$ exactly, so $\Pr[\mathcal{A}'(G(k))=1] = \Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)=1]$. **Case 2** $y$ uniform: $c$ is a one-time pad encryption, so $\Pr[\mathcal{A}'(y)=1] = \tfrac12$.` },
    { id: "l5-card-14", type: "card", lecture: 5, topic: "reductions", origin: "slides",
      source: "Lecture 5, slide 18", difficulty: 2,
      front: R`What is the final inequality in the proof of Theorem 3.16?`,
      back: R`From $\bigl|\Pr[\mathcal{A}'(G(k))=1] - \Pr[\mathcal{A}'(y)=1]\bigr| \le \varepsilon(n)$ we get $\bigl|\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)=1] - \tfrac12\bigr| \le \varepsilon(n)$, hence $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)=1] \le \tfrac12 + \varepsilon(n)$.` },
    { id: "l5-card-15", type: "card", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 19", difficulty: 2,
      front: R`Why must a pseudo-OTP key not be used twice?`,
      back: R`Encryption is deterministic: $c = G(k) \oplus m$ and $c' = G(k) \oplus m'$ give $c \oplus c' = m \oplus m'$, which leaks information about the messages (e.g. whether they are equal).` },
    { id: "l5-card-16", type: "card", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 19", difficulty: 2,
      front: R`Theorem 3.16 rests on two things that could go wrong. Which?`,
      back: R`The **assumption** ($G$ might not be pseudorandom) and the **definition** (EAV-security might not be strong enough for the application, e.g. it says nothing about encrypting several messages with one key).` },
  );

  // ------------------------------ TF -----------------------------------
  add(
    { id: "l5-tf-01", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7", difficulty: 1,
      statement: R`A PRG may use fresh internal randomness in addition to its seed, as long as its output is pseudorandom.`,
      answer: false,
      explanation: R`By Definition 3.14 a PRG is a **deterministic** poly-time algorithm: the seed is its only source of randomness, and the same seed always gives the same output.` },
    { id: "l5-tf-02", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 3", difficulty: 1,
      statement: R`When sampling uniformly from $\{0,1\}^{16}$, the string $0^{16}$ is less likely to be drawn than the string $0110110010110110$.`,
      answer: false,
      explanation: R`Under the uniform distribution every 16-bit string has probability exactly $2^{-16}$. Randomness is a property of distributions, not of individual strings.` },
    { id: "l5-tf-03", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 4", difficulty: 1,
      statement: R`In cryptography, a distribution is called pseudorandom if it passes a fixed, publicly known list of statistical tests.`,
      answer: false,
      explanation: R`We do not know which test the adversary uses, so a pseudorandom distribution must fool **all** efficient (p.p.t.) tests, not a fixed list.` },
    { id: "l5-tf-04", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7", difficulty: 2,
      statement: R`If $G$ is a PRG with expansion factor $\ell$, then $G(s)$ for $s \gets \{0,1\}^n$ is uniformly distributed over $\{0,1\}^{\ell(n)}$.`,
      answer: false,
      explanation: R`$G(U_n)$ takes at most $2^n < 2^{\ell(n)}$ values, so it misses at least half of all strings. It is only computationally indistinguishable from uniform.` },
    { id: "l5-tf-05", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7 (KL §3.3.1)", difficulty: 2,
      statement: R`There exist PRGs whose output cannot be distinguished from uniform even by distinguishers with unbounded running time.`,
      answer: false,
      explanation: R`The distinguisher that outputs 1 iff $y = G(s)$ for some seed $s$ (trying all $2^n$ seeds) outputs 1 always on $G(s)$, but with probability at most $2^n/2^{\ell(n)} \le \tfrac12$ on uniform $y$.` },
    { id: "l5-tf-06", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 9", difficulty: 1,
      statement: R`If PRGs exist, then $P \ne NP$.`,
      answer: true,
      explanation: R`Stated on the slides: $\exists$ PRG $\Rightarrow P \ne NP$. This is why the existence of PRGs is unproven and we have to assume it.` },
    { id: "l5-tf-07", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7", difficulty: 2,
      statement: R`A deterministic poly-time algorithm $G$ with $|G(s)| = |s|$ whose output $G(s)$ is uniformly distributed for uniform $s$ is a PRG.`,
      answer: false,
      explanation: R`A PRG must also be **expanding**: $\ell(n) > n$. The identity function has uniform output but does not expand, so it is not a PRG.` },
    { id: "l5-tf-08", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7 (applied)", difficulty: 2,
      statement: R`If $G \colon \{0,1\}^n \to \{0,1\}^{2n}$ is a PRG, then $G'(s) := G(s) \| s$ is also a PRG.`,
      answer: false,
      explanation: R`$\mathcal{D}$ parses its $3n$-bit input as $y \| s'$ with $|s'| = n$ and outputs 1 iff $G(s') = y$. This always holds for $G'(s)$ but only with probability at most $2^n/2^{2n} = 2^{-n}$ for a uniform string.` },
    { id: "l5-tf-09", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7 (applied)", difficulty: 2,
      statement: R`If $G$ is a PRG with expansion factor $\ell$, then $G'(s) := G(s) \oplus 1^{\ell(n)}$ is also a PRG.`,
      answer: true,
      explanation: R`Reduction: $\mathcal{D}(y) := \mathcal{D}'(y \oplus 1^{\ell(n)})$. On $y = G(s)$ it feeds $\mathcal{D}'$ exactly $G'(s)$; on uniform $y$ it feeds a uniform string (flipping all bits is a bijection). So $\mathcal{D}'$ has the same advantage as $\mathcal{D}$.` },
    { id: "l5-tf-10", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7 (applied)", difficulty: 3,
      statement: R`If $G \colon \{0,1\}^n \to \{0,1\}^{\ell(n)}$ is a PRG, then $G' \colon \{0,1\}^{2n} \to \{0,1\}^{2\ell(n)}$, $G'(s_1 \| s_2) := G(s_1) \| G(s_2)$ with $|s_1| = |s_2| = n$, is also a PRG.`,
      answer: true,
      explanation: R`Hybrid argument: $G(s_1)\|G(s_2) \approx y_1 \| G(s_2) \approx y_1 \| y_2$. Each step is a reduction to $G$ (the reduction samples the other half itself), and the sum of two negligible advantages is negligible. $G'$ expands since $2\ell(n) > 2n$.` },
    { id: "l5-tf-11", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7 (applied)", difficulty: 2,
      statement: R`If $G \colon \{0,1\}^n \to \{0,1\}^{n+1}$ is a PRG, then $G'(s) :=$ the first $n$ bits of $G(s)$ is also a PRG.`,
      answer: false,
      explanation: R`$|G'(s)| = n = |s|$, so $G'$ is not expanding and hence not a PRG by definition (even though its output is still pseudorandom).` },
    { id: "l5-tf-12", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7 (applied)", difficulty: 2,
      statement: R`If $G \colon \{0,1\}^n \to \{0,1\}^{2n}$ is a PRG, then $G'(s) :=$ $G(s)$ with its first bit removed is also a PRG.`,
      answer: true,
      explanation: R`$|G'(s)| = 2n - 1 > n$, so $G'$ expands. Reduction: $\mathcal{D}(y)$ drops the first bit of $y$ and runs $\mathcal{D}'$; a uniform $2n$-bit string with one bit removed is uniform on $2n-1$ bits, so the advantages are equal.` },
    { id: "l5-tf-13", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7 (applied)", difficulty: 2,
      statement: R`If $G$ is a PRG, then $G'(s) := G(\bar{s})$, where $\bar{s}$ is the bitwise complement of $s$, is also a PRG.`,
      answer: true,
      explanation: R`If $s$ is uniform then so is $\bar{s}$, hence $G'(U_n)$ and $G(U_n)$ are the **same** distribution. Any distinguisher for $G'$ is a distinguisher for $G$ with the same advantage.` },
    { id: "l5-tf-14", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7 (applied)", difficulty: 2,
      statement: R`If $G$ is a PRG with expansion factor $\ell$, then $G'(s) := G(s) \| 0$ (one zero bit appended) is also a PRG.`,
      answer: false,
      explanation: R`$\mathcal{D}$ outputs 1 iff the last bit is 0: probability 1 for $G'(s)$, probability $\tfrac12$ for a uniform $(\ell(n)+1)$-bit string. Advantage $\tfrac12$ is not negligible.` },
    { id: "l5-tf-15", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7 (applied)", difficulty: 2,
      statement: R`If $G$ is a PRG, then $G'(s) :=$ the bits of $G(s)$ in reverse order is also a PRG.`,
      answer: true,
      explanation: R`Reduction: $\mathcal{D}(y)$ reverses $y$ and runs $\mathcal{D}'$. Reversal maps $G(s)$ to $G'(s)$ and a uniform string to a uniform string, so the advantages are equal.` },
    { id: "l5-tf-16", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7 (applied)", difficulty: 3,
      statement: R`If $G$ is a PRG with $|G(s)| = 2|s|$ for all $s$, then $G'(s) := G(G(s))$, mapping $n$ bits to $4n$ bits, is also a PRG.`,
      answer: true,
      explanation: R`Two steps: (1) $G(G(s)) \approx G(u)$ for uniform $u \in \{0,1\}^{2n}$, by the reduction $\mathcal{D}(y) := \mathcal{D}'(G(y))$ against $G$ on seed length $n$; (2) $G(u) \approx$ uniform $4n$ bits by security of $G$ on seed length $2n$. Both gaps are negligible.` },
    { id: "l5-tf-17", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7 (applied)", difficulty: 2,
      statement: R`If $G$ is a PRG, then for every fixed position $i$, the probability that the $i$-th bit of $G(s)$ equals 1 (for uniform $s$) differs from $\tfrac12$ by at most a negligible amount.`,
      answer: true,
      explanation: R`Otherwise the distinguisher "output the $i$-th bit of $y$" would have non-negligible advantage, since that bit of a uniform string is 1 with probability exactly $\tfrac12$.` },
    { id: "l5-tf-18", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slides 13–19", difficulty: 1,
      statement: R`The pseudo one-time pad (Construction 3.17) is perfectly secret if $G$ is a PRG.`,
      answer: false,
      explanation: R`Keys have $n$ bits but messages have $\ell(n) > n$ bits, so $|\mathcal{K}| < |\mathcal{M}|$ and by Shannon's bound the scheme cannot be perfectly secret. It is only EAV-secure (Theorem 3.16).` },
    { id: "l5-tf-19", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 19", difficulty: 1,
      statement: R`If $G$ is a PRG, then the pseudo one-time pad is computationally indistinguishable in the presence of an eavesdropper.`,
      answer: true,
      explanation: R`This is Theorem 3.16, proved by reduction to the pseudorandomness of $G$: replacing $G(k)$ by a uniform pad turns the scheme into the one-time pad, where the adversary wins with probability exactly $\tfrac12$.` },
    { id: "l5-tf-20", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 19", difficulty: 2,
      statement: R`The pseudo one-time pad stays secure if the same key is used to encrypt two different messages.`,
      answer: false,
      explanation: R`$c = G(k) \oplus m$ and $c' = G(k) \oplus m'$ give $c \oplus c' = m \oplus m'$. For instance an eavesdropper sees whether $m = m'$ by checking $c = c'$.` },
    { id: "l5-tf-21", type: "tf", lecture: 5, topic: "reductions", origin: "slides",
      source: "Lecture 5, slide 11", difficulty: 2,
      statement: R`To prove that a scheme $\Pi$ is secure if $G$ is a PRG, one constructs, from any p.p.t. distinguisher against $G$, an adversary against $\Pi$.`,
      answer: false,
      explanation: R`The direction is reversed: from any p.p.t. adversary $\mathcal{A}$ against $\Pi$ we build a distinguisher $\mathcal{A}'$ against $G$ (which uses $\mathcal{A}$ as a subroutine).` },
    { id: "l5-tf-22", type: "tf", lecture: 5, topic: "reductions", origin: "slides",
      source: "Lecture 5, slide 17", difficulty: 2,
      statement: R`In the proof of Theorem 3.16, when the reduction $\mathcal{A}'$ receives a uniform string $y \gets \{0,1\}^{\ell(n)}$, it outputs 1 with probability exactly $\tfrac12$, whatever $\mathcal{A}$ does.`,
      answer: true,
      explanation: R`Then $c = y \oplus m_b$ is a one-time pad ciphertext, uniform and independent of $b$. So $\mathcal{A}$'s guess $b'$ is independent of $b$ and $\Pr[b' = b] = \tfrac12$.` },
    { id: "l5-tf-23", type: "tf", lecture: 5, topic: "reductions", origin: "slides",
      source: "Lecture 5, slides 11 and 16", difficulty: 2,
      statement: R`In a security proof by reduction, the reduction may run in exponential time, as long as the adversary it uses is p.p.t.`,
      answer: false,
      explanation: R`The hardness assumption only rules out **efficient** algorithms, so the reduction must be p.p.t. itself ("$\mathcal{A}$ p.p.t. $\Rightarrow \mathcal{A}'$ p.p.t."). An exponential-time reduction contradicts nothing.` },
  );

  // ------------------------------ MC -----------------------------------
  add(
    { id: "l5-mc-01", type: "mc", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7", difficulty: 1,
      question: R`Which of the following is **not** part of the definition of a PRG $G$?`,
      options: [R`$G$ is deterministic and runs in polynomial time`, R`$\ell(n) > n$ for all $n$`, R`$G$ is injective`, R`$\{G(U_n)\}_{n}$ is pseudorandom`],
      correct: 2,
      explanation: R`Definition 3.14 requires a deterministic poly-time algorithm that is expanding and pseudorandom. Injectivity is not required.` },
    { id: "l5-mc-02", type: "mc", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7 (KL §3.3.1)", difficulty: 2,
      question: R`$G \colon \{0,1\}^n \to \{0,1\}^{n+1}$ is a PRG. The brute-force distinguisher outputs 1 iff its input lies in the range of $G$. What is an upper bound on its probability of outputting 1 on a uniform input?`,
      options: [R`$2^{-n}$`, R`$\tfrac12$`, R`$1 - 2^{-n}$`, R`$\varepsilon(n)$ for a negligible $\varepsilon$`],
      correct: 1,
      explanation: R`The range has at most $2^n$ elements out of $2^{n+1}$, so the probability is at most $2^n/2^{n+1} = \tfrac12$. On $G(s)$ it outputs 1 always, so the advantage is at least $\tfrac12$.` },
    { id: "l5-mc-03", type: "mc", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7 (applied)", difficulty: 2,
      question: R`Let $G \colon \{0,1\}^n \to \{0,1\}^{2n}$ be a PRG. Which $G'$ is a PRG?`,
      options: [R`$G'(s) := G(s) \| G(s)$`, R`$G'(s) := G(s) \| s$`, R`$G'(s) :=$ the first $n$ bits of $G(s)$`, R`$G'(s) := G(s) \oplus (1010\dots10)$`],
      correct: 3,
      explanation: R`XOR with a fixed string is a bijection, so the reduction $\mathcal{D}(y) := \mathcal{D}'(y \oplus 1010\dots10)$ works. The first two have checkable relations (equal halves; $G(s') = y$), the third is not expanding.` },
    { id: "l5-mc-04", type: "mc", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 13", difficulty: 1,
      question: R`In the pseudo one-time pad with PRG $G$ of expansion factor $\ell$ and security parameter $n$, what is the message space?`,
      options: [R`$\{0,1\}^n$`, R`$\{0,1\}^{\ell(n)}$`, R`$\{0,1\}^{2n}$`, R`$\{0,1\}^*$`],
      correct: 1,
      explanation: R`$\mathsf{Enc}_k(m) = G(k) \oplus m$ with $|G(k)| = \ell(n)$, so messages have length exactly $\ell(n)$, longer than the $n$-bit key.` },
    { id: "l5-mc-05", type: "mc", lecture: 5, topic: "reductions", origin: "slides",
      source: "Lecture 5, slide 16", difficulty: 2,
      question: R`In the proof of Theorem 3.16, what does the reduction $\mathcal{A}'$ give to $\mathcal{A}$ as the challenge ciphertext?`,
      options: [R`$G(y) \oplus m_b$`, R`$y \oplus m_b$ for a bit $b$ chosen by $\mathcal{A}'$`, R`$y \oplus m_0 \oplus m_1$`, R`$G(k) \oplus m_b$ for a key $k$ chosen by $\mathcal{A}'$`],
      correct: 1,
      explanation: R`$\mathcal{A}'$ uses its input $y$ in place of $G(k)$: $c := y \oplus m_b$ with $b \gets \{0,1\}$ chosen by $\mathcal{A}'$. It cannot use $G(k)$ because it does not know $k$; and it must know $b$ to check $b' = b$.` },
    { id: "l5-mc-06", type: "mc", lecture: 5, topic: "reductions", origin: "slides",
      source: "Lecture 5, slide 18", difficulty: 2,
      question: R`Which conclusion follows directly from $\bigl|\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)=1] - \tfrac12\bigr| \le \varepsilon(n)$?`,
      options: [R`$\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)=1] = \tfrac12$`, R`$\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)=1] \le \tfrac12 + \varepsilon(n)$`, R`$\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)=1] \le \varepsilon(n)$`, R`$\Pi$ is perfectly secret`],
      correct: 1,
      explanation: R`Dropping the absolute value gives the upper bound $\tfrac12 + \varepsilon(n)$, which is exactly the EAV-security condition (Definition 3.8).` },
    { id: "l5-mc-07", type: "mc", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 19", difficulty: 2,
      question: R`Two messages are encrypted with the pseudo-OTP under the same key: $c = G(k) \oplus m$, $c' = G(k) \oplus m'$. What does an eavesdropper learn directly?`,
      options: [R`$k$`, R`$G(k)$`, R`$m \oplus m'$`, R`Nothing, by Theorem 3.16`],
      correct: 2,
      explanation: R`$c \oplus c' = m \oplus m'$. Theorem 3.16 only covers a single encryption per key.` },
    { id: "l5-mc-08", type: "mc", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 5", difficulty: 2,
      question: R`What is quantified how in the asymptotic definition of a pseudorandom sequence $\{D_n\}$?`,
      options: [R`There exists a p.p.t. $\mathcal{A}$ such that for all negligible $\varepsilon$ ...`, R`For all p.p.t. $\mathcal{A}$ there exists a negligible $\varepsilon$ such that ...`, R`There exists a negligible $\varepsilon$ such that for all algorithms $\mathcal{A}$ ...`, R`For all algorithms $\mathcal{A}$ running in time at most $t$ ...`],
      correct: 1,
      explanation: R`"For all p.p.t. $\mathcal{A}$ there exists a negligible $\varepsilon(\cdot)$ s.t. the advantage is at most $\varepsilon(n)$." The last option is the concrete $(t,\varepsilon)$ version; unbounded algorithms are not allowed.` },
  );

  // ------------------------------ GAP ----------------------------------
  add(
    { id: "l5-gap-prg", type: "gap", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7 (Definition 3.14)", difficulty: 2,
      title: "Pseudorandom generator (PRG)", points: 5,
      text: R`A <gap>deterministic polynomial-time</gap> algorithm $G$ with $|G(s)| = \ell(|s|)$ for all $s$ is a pseudorandom generator if it is expanding, i.e. <gap>$\ell(n) > n$ for all $n$</gap>, and pseudorandom, i.e. for every <gap>p.p.t. distinguisher $\mathcal{D}$</gap> there exists <gap>a negligible function $\varepsilon$</gap> such that
$$\Bigl|\Pr[\mathcal{D}(G(s)) = 1] - \Pr[\mathcal{D}(y) = 1]\Bigr| \le \varepsilon(n),$$
where the first probability is over <gap>a uniform seed $s \gets \{0,1\}^n$</gap> and the second over <gap>a uniform string $y \gets \{0,1\}^{\ell(n)}$</gap>.`,
      note: R`Both probabilities are also over the randomness of $\mathcal{D}$. $\ell$ is the expansion factor.` },
    { id: "l5-gap-pseudo-otp", type: "gap", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slides 13 and 19", difficulty: 2,
      title: "Pseudo one-time pad (Construction 3.17)", points: 5,
      text: R`Let $G$ be a PRG with expansion factor $\ell$. The pseudo one-time pad for messages of length <gap>$\ell(n)$</gap> is defined as follows. $\mathsf{Gen}(1^n)$ returns <gap>a uniform key $k \gets \{0,1\}^n$</gap>. $\mathsf{Enc}_k(m)$ returns <gap>$c := G(k) \oplus m$</gap>. $\mathsf{Dec}_k(c)$ returns <gap>$m := G(k) \oplus c$</gap>. If $G$ is a PRG, the scheme is <gap>computationally indistinguishable in the presence of an eavesdropper (EAV-secure)</gap>, but it is not perfectly secret because the key is shorter than the message.` },
  );

  // ---------------------------- PROBLEMS -------------------------------
  add(
    { id: "l5-prob-prg-variants", type: "problem", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slides 7–8 (exam-style variant)", difficulty: 3,
      title: "Is G' a PRG? An attack and a reduction",
      mock: true,
      statement: R`Let $G \colon \{0,1\}^n \to \{0,1\}^{2n}$ be a pseudorandom generator (PRG).`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Show that $G_1 \colon \{0,1\}^n \to \{0,1\}^{3n}$, $G_1(s) := G(s) \| s$, is **not** a PRG.`,
          hints: [R`$G$ is public. What can a distinguisher compute from the last $n$ bits?`, R`Check whether the first $2n$ bits equal $G$ applied to the last $n$ bits; count how many $3n$-bit strings satisfy this.`],
          solution: R`$G_1$ is a PRG iff for every p.p.t. $\mathcal{D}$ the advantage $\bigl|\Pr_{s \gets \{0,1\}^n}[\mathcal{D}(G_1(s))=1] - \Pr_{z \gets \{0,1\}^{3n}}[\mathcal{D}(z)=1]\bigr|$ is negligible.

**Distinguisher.** $\mathcal{D}(z)$: parse $z = y \| s'$ with $|y| = 2n$, $|s'| = n$. Output 1 iff $G(s') = y$. $\mathcal{D}$ is p.p.t. since $G$ is poly-time.

**Real world.** For $z = G_1(s) = G(s) \| s$ we get $s' = s$ and $y = G(s)$, so $\mathcal{D}$ always outputs 1: $\Pr[\mathcal{D}(G_1(s))=1] = 1$.

**Random world.** For uniform $z$, $s'$ and $y$ are independent and uniform, so $\Pr[G(s') = y] = 2^{-2n}$.

The advantage is $1 - 2^{-2n} \ge \tfrac12$, which is not negligible. Hence $G_1$ is not a PRG.`,
          rubric: [ { points: 1, text: R`Correct distinguisher: parse $y\|s'$ and check $G(s') = y$` },
                    { points: 1, text: R`Both probabilities computed (1 and $2^{-2n}$) and conclusion that the advantage is non-negligible` } ] },
        { label: "b", points: 4,
          prompt: R`Prove, by giving a reduction, that $G_2 \colon \{0,1\}^n \to \{0,1\}^{2n}$, $G_2(s) := G(s) \oplus 1^{2n}$ (all output bits flipped), is a PRG.`,
          hints: [R`Expansion is immediate. For pseudorandomness, start from an arbitrary p.p.t. distinguisher $\mathcal{D}'$ for $G_2$.`, R`Build $\mathcal{D}$ for $G$: on input $y$, feed $\mathcal{D}'$ something computed from $y$.`, R`$\mathcal{D}(y) := \mathcal{D}'(y \oplus 1^{2n})$. What is $y \oplus 1^{2n}$ when $y = G(s)$, and when $y$ is uniform?`],
          solution: R`**Expansion.** $|G_2(s)| = 2n > n$, and $G_2$ is deterministic and poly-time.

**Assumption.** $G$ is a PRG: for every p.p.t. $\mathcal{D}$ there is a negligible $\varepsilon$ with
$$\Bigl|\Pr_{s \gets \{0,1\}^n}[\mathcal{D}(G(s))=1] - \Pr_{y \gets \{0,1\}^{2n}}[\mathcal{D}(y)=1]\Bigr| \le \varepsilon(n).$$

**Reduction.** Let $\mathcal{D}'$ be any p.p.t. distinguisher for $G_2$. Define $\mathcal{D}$: on input $y \in \{0,1\}^{2n}$, compute $z := y \oplus 1^{2n}$, run $\mathcal{D}'(z)$ and output whatever $\mathcal{D}'$ outputs. $\mathcal{D}$ is p.p.t. (one XOR plus one run of $\mathcal{D}'$).

**Real world.** If $y = G(s)$ with $s$ uniform, then $z = G(s) \oplus 1^{2n} = G_2(s)$, so $\Pr[\mathcal{D}(G(s))=1] = \Pr[\mathcal{D}'(G_2(s))=1]$.

**Random world.** If $y$ is uniform on $\{0,1\}^{2n}$, then $z = y \oplus 1^{2n}$ is uniform as well (the map $y \mapsto y \oplus 1^{2n}$ is a bijection), so $\Pr[\mathcal{D}(y)=1] = \Pr_{z \gets \{0,1\}^{2n}}[\mathcal{D}'(z)=1]$.

**Conclusion.**
$$\Bigl|\Pr[\mathcal{D}'(G_2(s))=1] - \Pr[\mathcal{D}'(z)=1]\Bigr| = \Bigl|\Pr[\mathcal{D}(G(s))=1] - \Pr[\mathcal{D}(y)=1]\Bigr| \le \varepsilon(n).$$
Since $\mathcal{D}'$ was arbitrary, $G_2$ is a PRG.`,
          rubric: [ { points: 1, text: R`States the PRG assumption for $G$ and checks expansion` },
                    { points: 1, text: R`Correct reduction $\mathcal{D}(y) := \mathcal{D}'(y \oplus 1^{2n})$, argued p.p.t.` },
                    { points: 1, text: R`Both worlds analysed: real gives $G_2(s)$, random stays uniform (bijection)` },
                    { points: 1, text: R`Final inequality and conclusion` } ] },
      ] },

    { id: "l5-prob-truncate", type: "problem", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 7 (exam-style variant)", difficulty: 3,
      title: "Dropping the last output bit of a PRG",
      mock: true,
      statement: R`Let $G$ be a PRG with expansion factor $\ell$. For $y \in \{0,1\}^{m}$ let $\mathsf{trunc}(y)$ denote the first $m - 1$ bits of $y$. Define $G'(s) := \mathsf{trunc}(G(s))$.`,
      parts: [
        { label: "a", points: 4,
          prompt: R`Assume $\ell(n) \ge n + 2$ for all $n$. Prove, by giving a reduction, that $G'$ is a PRG.`,
          hints: [R`Check expansion first: $|G'(s)| = \ell(n) - 1$.`, R`Given a distinguisher $\mathcal{D}'$ for $G'$, the distinguisher for $G$ can simply throw away one bit of its input.`, R`If $y$ is uniform on $\ell(n)$ bits, what is the distribution of its first $\ell(n)-1$ bits?`],
          solution: R`**Expansion.** $|G'(s)| = \ell(n) - 1 \ge n + 1 > n$; $G'$ is deterministic and poly-time.

**Assumption.** For every p.p.t. $\mathcal{D}$ there is a negligible $\varepsilon$ with $\bigl|\Pr_{s \gets \{0,1\}^n}[\mathcal{D}(G(s))=1] - \Pr_{y \gets \{0,1\}^{\ell(n)}}[\mathcal{D}(y)=1]\bigr| \le \varepsilon(n)$.

**Reduction.** Let $\mathcal{D}'$ be any p.p.t. distinguisher for $G'$. $\mathcal{D}$ on input $y \in \{0,1\}^{\ell(n)}$: compute $z := \mathsf{trunc}(y)$, output $\mathcal{D}'(z)$. Clearly p.p.t.

**Real world.** $y = G(s)$ gives $z = \mathsf{trunc}(G(s)) = G'(s)$.

**Random world.** $y$ uniform on $\{0,1\}^{\ell(n)}$ gives $z$ uniform on $\{0,1\}^{\ell(n)-1}$: each of the $2^{\ell(n)-1}$ values of $z$ has exactly two preimages, so probability $2 \cdot 2^{-\ell(n)} = 2^{-(\ell(n)-1)}$.

**Conclusion.** $\bigl|\Pr[\mathcal{D}'(G'(s))=1] - \Pr_{z \gets \{0,1\}^{\ell(n)-1}}[\mathcal{D}'(z)=1]\bigr| = \bigl|\Pr[\mathcal{D}(G(s))=1] - \Pr[\mathcal{D}(y)=1]\bigr| \le \varepsilon(n)$. Hence $G'$ is a PRG.`,
          rubric: [ { points: 1, text: R`Expansion $\ell(n) - 1 > n$ checked` },
                    { points: 1, text: R`Reduction $\mathcal{D}(y) := \mathcal{D}'(\mathsf{trunc}(y))$, p.p.t.` },
                    { points: 1, text: R`Real world gives $G'(s)$; truncated uniform string is uniform (with reason)` },
                    { points: 1, text: R`Inequality chain and conclusion` } ] },
        { label: "b", points: 1,
          prompt: R`Now let $\ell(n) = n + 1$. Is $G'$ a PRG? Justify in one or two sentences.`,
          hints: [R`Look at the definition, not at pseudorandomness.`],
          solution: R`No. Then $|G'(s)| = n = |s|$, so $G'$ is not **expanding** and violates Definition 3.14, even though its output is still pseudorandom by the argument of part a.`,
          rubric: [ { points: 1, text: R`"No" with the reason that $G'$ does not expand` } ] },
      ] },

    { id: "l5-prob-pseudo-otp", type: "problem", lecture: 5, topic: "reductions", origin: "slides",
      source: "Lecture 5, slides 13–18 (Theorem 3.16)", difficulty: 3,
      title: "Prove that the pseudo one-time pad is EAV-secure",
      mock: true,
      statement: R`Let $G$ be a PRG with expansion factor $\ell$, and let $\Pi$ be the pseudo one-time pad: $\mathsf{Gen}(1^n)$ returns $k \gets \{0,1\}^n$, $\mathsf{Enc}_k(m) := G(k) \oplus m$ and $\mathsf{Dec}_k(c) := G(k) \oplus c$ for $m, c \in \{0,1\}^{\ell(n)}$.`,
      parts: [
        { label: "a", points: 1,
          prompt: R`Show that $\Pi$ is correct.`,
          hints: [R`XOR the same pad twice.`],
          solution: R`For every $k$ and $m$: $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = G(k) \oplus (G(k) \oplus m) = (G(k) \oplus G(k)) \oplus m = 0^{\ell(n)} \oplus m = m$, using that $G$ is deterministic so both sides compute the same pad.`,
          rubric: [ { points: 1, text: R`Correct computation using $G(k) \oplus G(k) = 0^{\ell(n)}$` } ] },
        { label: "b", points: 6,
          prompt: R`Prove, by giving a reduction, that $\Pi$ is computationally indistinguishable in the presence of an eavesdropper.`,
          hints: [R`Write down the PRG assumption and what EAV-security requires.`, R`The reduction gets $y$ and must play the EAV challenger for $\mathcal{A}$ without knowing any key. Where does $y$ go?`, R`Use $c := y \oplus m_b$ with $b$ chosen by the reduction. Then analyse $y = G(k)$ and $y$ uniform (one-time pad).`],
          solution: R`**Goal.** For every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)=1] \le \tfrac12 + \varepsilon(n)$.

**Assumption.** $G$ is a PRG: for every p.p.t. $\mathcal{D}$ there is a negligible $\varepsilon$ with
$$\Bigl|\Pr_{k \gets \{0,1\}^n}[\mathcal{D}(G(k))=1] - \Pr_{y \gets \{0,1\}^{\ell(n)}}[\mathcal{D}(y)=1]\Bigr| \le \varepsilon(n).$$

**Reduction.** Let $\mathcal{A}$ be any p.p.t. adversary. Define $\mathcal{D}$ on input $y \in \{0,1\}^{\ell(n)}$:

1. Run $\mathcal{A}(1^n)$ and obtain $m_0, m_1 \in \{0,1\}^{\ell(n)}$.
2. Sample $b \gets \{0,1\}$ and give $c := y \oplus m_b$ to $\mathcal{A}$.
3. When $\mathcal{A}$ outputs $b'$, output $1$ if $b' = b$ and $0$ otherwise.

$\mathcal{D}$ is p.p.t. because $\mathcal{A}$ is and $\mathcal{D}$ only adds one XOR and one comparison.

**Case 1: $y = G(k)$, $k \gets \{0,1\}^n$.** $k$ has the same distribution as the output of $\mathsf{Gen}(1^n)$ and $c = G(k) \oplus m_b = \mathsf{Enc}_k(m_b)$. So $\mathcal{A}$'s view is exactly as in $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)$, and $\mathcal{D}$ outputs 1 iff $\mathcal{A}$ wins:
$$\Pr[\mathcal{D}(G(k))=1] = \Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)=1].$$

**Case 2: $y \gets \{0,1\}^{\ell(n)}$.** Now $c = y \oplus m_b$ is a one-time pad encryption with a fresh uniform key, so $c$ is uniform on $\{0,1\}^{\ell(n)}$ and independent of $b$. Hence $b'$ is independent of $b$ and
$$\Pr[\mathcal{D}(y)=1] = \Pr[b' = b] = \tfrac12.$$

**Conclusion.** By the PRG assumption applied to $\mathcal{D}$:
$$\Bigl|\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)=1] - \tfrac12\Bigr| \le \varepsilon(n), \quad\text{so}\quad \Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)=1] \le \tfrac12 + \varepsilon(n).$$
As $\mathcal{A}$ was arbitrary, $\Pi$ is EAV-secure.`,
          rubric: [ { points: 1, text: R`PRG assumption and EAV goal stated correctly` },
                    { points: 2, text: R`Reduction fully specified: runs $\mathcal{A}$, picks $b$ itself, uses $c := y \oplus m_b$, outputs $[b' = b]$; argued p.p.t.` },
                    { points: 1, text: R`Case $y = G(k)$: perfect simulation, probability equals $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)=1]$` },
                    { points: 1, text: R`Case $y$ uniform: one-time pad, probability exactly $\tfrac12$` },
                    { points: 1, text: R`Final inequality $\le \tfrac12 + \varepsilon(n)$ and conclusion` } ] },
      ] },

    { id: "l5-prob-hybrid", type: "problem", lecture: 5, topic: "reductions", origin: "slides",
      source: "Lecture 5, slides 7 and 11 (exam-style variant)", difficulty: 3,
      title: "Two independent PRG outputs: a two-step hybrid",
      mock: false,
      statement: R`Let $G \colon \{0,1\}^n \to \{0,1\}^{\ell(n)}$ be a PRG. Define $G' \colon \{0,1\}^{2n} \to \{0,1\}^{2\ell(n)}$ by $G'(s_1 \| s_2) := G(s_1) \| G(s_2)$ with $|s_1| = |s_2| = n$.`,
      parts: [
        { label: "a", points: 6,
          prompt: R`Prove that $G'$ is a PRG.`,
          hints: [R`A single reduction cannot replace both halves at once. Introduce an intermediate distribution.`, R`Consider $H_0 = G(s_1)\|G(s_2)$, $H_1 = y_1 \| G(s_2)$, $H_2 = y_1 \| y_2$ with $y_1, y_2$ uniform.`, R`$\mathcal{D}_1(y)$ samples $s_2$ itself and runs $\mathcal{D}'(y \| G(s_2))$; $\mathcal{D}_2(y)$ samples $y_1$ itself and runs $\mathcal{D}'(y_1 \| y)$. Then use the triangle inequality.`],
          solution: R`**Expansion.** $|G'(s_1\|s_2)| = 2\ell(n) > 2n$; $G'$ is deterministic poly-time.

**Assumption.** For every p.p.t. $\mathcal{D}$ there is a negligible $\varepsilon$ with $\bigl|\Pr[\mathcal{D}(G(s))=1] - \Pr[\mathcal{D}(y)=1]\bigr| \le \varepsilon(n)$ for $s \gets \{0,1\}^n$, $y \gets \{0,1\}^{\ell(n)}$.

Let $\mathcal{D}'$ be any p.p.t. distinguisher for $G'$. Define the three distributions (all variables uniform and independent)
$$H_0 = G(s_1)\|G(s_2), \qquad H_1 = y_1\|G(s_2), \qquad H_2 = y_1\|y_2,$$
and $p_i := \Pr[\mathcal{D}'(H_i)=1]$. $H_0$ is the output of $G'$ on a uniform seed and $H_2$ is uniform on $\{0,1\}^{2\ell(n)}$, so we must bound $|p_0 - p_2|$.

**Step 1 ($H_0$ vs. $H_1$).** $\mathcal{D}_1$ on input $y$: sample $s_2 \gets \{0,1\}^n$, output $\mathcal{D}'(y \| G(s_2))$. If $y = G(s_1)$, $\mathcal{D}'$ sees $H_0$; if $y$ uniform, it sees $H_1$. So $|p_0 - p_1| \le \varepsilon_1(n)$ for a negligible $\varepsilon_1$.

**Step 2 ($H_1$ vs. $H_2$).** $\mathcal{D}_2$ on input $y$: sample $y_1 \gets \{0,1\}^{\ell(n)}$, output $\mathcal{D}'(y_1 \| y)$. If $y = G(s_2)$, $\mathcal{D}'$ sees $H_1$; if $y$ uniform, it sees $H_2$. So $|p_1 - p_2| \le \varepsilon_2(n)$ for a negligible $\varepsilon_2$.

Both $\mathcal{D}_1, \mathcal{D}_2$ are p.p.t.

**Conclusion.** By the triangle inequality
$$|p_0 - p_2| \le |p_0 - p_1| + |p_1 - p_2| \le \varepsilon_1(n) + \varepsilon_2(n),$$
which is negligible. Since the seed length of $G'$ is $2n$ and a function negligible in $n$ is also negligible in $2n$, $G'$ is a PRG.`,
          rubric: [ { points: 1, text: R`Expansion and assumption stated` },
                    { points: 1, text: R`Hybrid distributions $H_0, H_1, H_2$ defined` },
                    { points: 1, text: R`Reduction $\mathcal{D}_1$ (samples $s_2$ itself) with both cases` },
                    { points: 1, text: R`Reduction $\mathcal{D}_2$ (samples $y_1$ itself) with both cases` },
                    { points: 1, text: R`Both reductions argued p.p.t.` },
                    { points: 1, text: R`Triangle inequality, sum of negligibles is negligible, conclusion` } ] },
      ] },
  );
})();
