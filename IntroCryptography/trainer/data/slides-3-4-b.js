(function () {
  const R = String.raw;
  const add = (...items) => (window.CRYPTO_BANK = window.CRYPTO_BANK || []).push(...items);

  // ===================== LECTURE 4: NOTES =====================
  add(
    { id: "l4-note-stream", type: "note", lecture: 4, topic: "stream-ciphers", origin: "slides",
      source: "Lecture 4, slides 3-5", difficulty: 1,
      title: "Stream ciphers",
      order: 10,
      body: R`### Key stream generator

A **key stream generator** takes a (short) random string, the key or **seed**, and produces a potentially infinite string $s_1 s_2 s_3 \dots$ that *seems* random: the **key stream**.

### Encryption and decryption

Like the one-time pad, but the long random key is replaced by a **pseudorandom** string generated from a random seed:

$$\text{Encryption: } c_i = m_i \oplus s_i, \qquad \text{Decryption: } m_i = c_i \oplus s_i.$$

Both parties run the same generator on the same key, so they obtain the same key stream. Security comes entirely from the key stream looking random; the combining step is a plain XOR, as in the one-time pad (no complex non-linear mixing of key stream and plaintext is needed).

### Implementations

- **Linear-feedback shift register (LFSR):** a register whose new bit is the XOR of some fixed positions; it shifts by one and outputs one bit per step. Very efficient in hardware, but **linear, hence attacks**.
- **Combinations of LFSRs**, e.g. A5/1 (GSM): broken.
- **RC4** (used in WEP): broken.
- **Block cipher in a mode of operation** (later lectures).

Trap: the key stream must never be reused for two messages; then $c \oplus c' = m \oplus m'$, as with a reused one-time pad key.`
    },
    { id: "l4-note-provable", type: "note", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slides 7-9", difficulty: 1,
      title: "Provable security, syntax and threat models",
      order: 20,
      body: R`### Provable (reductionist) security

- **Definitions:** what is the *security goal* and what is the *threat model* (e.g. indistinguishability under chosen-plaintext attack).
- **Assumptions:** computational assumptions (e.g. factoring large integers is hard).
- **Security proof:** a mathematical proof that the construction achieves the *definition* under the *assumptions*.

### Syntax of an encryption scheme

Key space $\mathcal{K}$, plaintext space $\mathcal{M}$, ciphertext space $\mathcal{C}$.

- $\mathsf{Gen}$: outputs a key in $\mathcal{K}$ (randomized).
- $\mathsf{Enc} \colon \mathcal{K} \times \mathcal{M} \to \mathcal{C}$ (possibly randomized).
- $\mathsf{Dec} \colon \mathcal{K} \times \mathcal{C} \to \mathcal{M}$ (deterministic).
- **Correctness:** $\forall k \in \mathcal{K}\ \forall m \in \mathcal{M} \colon \mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$.

Trap: encryption may well be randomized; correctness only needs decryption to recover $m$.

### Threat model (Kerckhoffs: the adversary knows the scheme)

**Adversary's goal:** not "find the key", not "recover the plaintext", not even "guess a single letter", but **obtain *any* information about the plaintext**.

**Adversary's power**, from weakest to strongest:

- sees ciphertexts only: **ciphertext-only attack ("eavesdropping")**;
- has seen plaintext/ciphertext pairs (known-plaintext attack);
- has chosen the plaintexts: **chosen-plaintext attack**;
- can also ask for decryptions: **chosen-ciphertext attack**.

This lecture formalizes the eavesdropping (EAV) setting.`
    },
    { id: "l4-note-why-computational", type: "note", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slides 10-13", difficulty: 1,
      title: "From perfect to computational security; the concrete approach",
      order: 30,
      body: R`### Recap: perfect indistinguishability

The experiment $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}$: $\mathcal{A}$ outputs $m_0, m_1 \in \mathcal{M}$; the challenger picks $k \gets \mathsf{Gen}$, $b \gets \{0,1\}$ and returns $c \gets \mathsf{Enc}_k(m_b)$; $\mathcal{A}$ outputs $b'$; the output is 1 iff $b' = b$. **Def. 2.6:** $\Pi$ is *perfectly indistinguishable* if for **every** $\mathcal{A}$: $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi} = 1] = \tfrac12$. **Lemma 2.7:** perfectly secret $\iff$ perfectly indistinguishable.

### Why relax perfect secrecy?

Perfect secrecy requires (Shannon) a key **as long as the message** that can be **used only once**: not practical.

**Computational security relaxes this in two ways:**

1. Only **computationally bounded** adversaries are considered. (Brute-forcing keys at one key per clock cycle: a PC does about $2^{57}$ keys per year, a supercomputer about $2^{86}$, and all of it since the Big Bang about $2^{120}$.)
2. Adversaries may succeed with **very small probability**. (A failure probability of $2^{-60}$ is less likely than the sender being struck by lightning.)

### Concrete approach

"Any adversary running in time at most $t$ succeeds with probability at most $\varepsilon$." Example: $\Pi$ is **$(t, \varepsilon)$-indistinguishable** if for all adversaries $\mathcal{A}$ running in time at most $t$:
$$\Pr\bigl[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi} = 1\bigr] \le \tfrac12 + \varepsilon.$$

Trap: the bound is $\tfrac12 + \varepsilon$, not $\varepsilon$ (guessing already wins with probability $\tfrac12$).

- (+) relevant for real-world applications;
- (−) security cannot be adjusted;
- (−) not robust: which computational model is used to count $t$ (Turing machines? RAM? which CPU, how many)?`
    },
    { id: "l4-note-asymptotic", type: "note", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slides 14-16", difficulty: 1,
      title: "The asymptotic approach and p.p.t. adversaries",
      order: 40,
      body: R`### Asymptotic approach

- There is a **security parameter** $n \in \mathbb{N}$, known to everyone (think: key length; bigger $n$ means more secure).
- Running times (of the users and of $\mathcal{A}$) and success probabilities are **functions of $n$**.
- $t$ becomes "**probabilistic polynomial time in $n$**" and $\varepsilon$ becomes "**negligible in $n$**".

### Probabilistic polynomial time (p.p.t.)

An algorithm is p.p.t. if there is a polynomial $p$ such that, on input of length $n$, it runs in time at most $p(n)$, and it may make random choices (like $\mathsf{Gen}$). Honest users and adversaries are both assumed p.p.t.

**Why this is robust (strong Church–Turing thesis):** every physically realizable computation can be simulated on a Turing machine with at most **polynomial slowdown**. So "everything that can realistically be computed can be computed in (probabilistic) polynomial time", independent of the machine model.

### Example 3.3: why the asymptotic view makes sense

Suppose honest parties need $10^6 \cdot n^2$ cycles, and an adversary running $10^8 \cdot n^4$ cycles succeeds with probability at most $2^{-n/2}$.

- 2 GHz CPUs, $n = 80$: honest parties need 3.2 s; the adversary needs about 3 weeks and succeeds with probability $2^{-40}$.
- 8 GHz CPUs, $n = 160$: honest parties again need 3.2 s; the adversary needs about 13 weeks and succeeds only with probability $2^{-80}$.

Increasing $n$ increases the running time of the algorithms only *moderately* (polynomially), but the adversary's success probability decreases *fast*.`
    },
    { id: "l4-note-negligible", type: "note", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 2,
      title: "Negligible functions",
      order: 50,
      body: R`### Definition (Def. 3.4)

$f \colon \mathbb{N} \to \mathbb{R}^+$ is **negligible** if for every positive polynomial $p$ there exists $N$ such that for all $n > N$:
$$f(n) < \frac{1}{p(n)}.$$
Equivalently: for every constant $c$, $f(n) < n^{-c}$ for all sufficiently large $n$. "Negligible" means: smaller than every inverse polynomial, **eventually** (small $n$ do not matter).

### Standard examples (negligible)

$2^{-n}$, $\;2^{-\sqrt{n}}$, $\;n^{-\log n} = 2^{-(\log n)^2}$: each is $< n^{-c}$ for any $c$ for sufficiently large $n$. Also $n^{-\log \log n}$.

### Standard non-examples

- $1/n^{100}$ (or any $1/p(n)$): take $p(n) = n^{101}$; then $n^{-100} < n^{-101}$ never holds.
- $2^{-\log n} = 1/n$ (with $\log = \log_2$).
- $f(n) = 2^{-n}$ for even $n$ and $1/n$ for odd $n$: fails the condition for infinitely many $n$.

### Closure properties

- If $p, q$ are polynomials, then $p \cdot q$ and $p(q(\cdot))$ are polynomials.
- If $p$ is a polynomial and $\mu$ is negligible, then $p \cdot \mu$ is negligible.
- If $f, g$ are negligible, then $f + g$ is negligible (use $\frac{1}{2p}$ for each), and $f \cdot g$ is negligible.

### Useful facts for exam true/false questions

- If $f$ is negligible then $f(n) < 1$ for large $n$, so $f(n)^k \le f(n)$ for every $k \ge 1$; hence $f(n)^2$, $f(n)^n$, $f(n)^{\log n}$ are negligible.
- $\sqrt{f(n)}$ is negligible: $f(n) < 1/p(n)^2$ eventually, so $\sqrt{f(n)} < 1/p(n)$.
- Multiplying by a **super-polynomial** factor can destroy negligibility: $f(n) = n^{-\log n}$ is negligible but $n^{\log n} f(n) = 1$ is not.
- Shrinking the argument can destroy it: $f(n) = 2^{-n}$ is negligible, but $f(\lceil\log n\rceil) \ge \frac{1}{2n}$ is not.
- Functions that tend to 1 are not negligible: since $n f(n) \to 0$, e.g. $n^{-f(n)} \to 1$ and $2^{n f(n)} \to 1$.`
    },
    { id: "l4-note-syntax", type: "note", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 17", difficulty: 1,
      title: "Parametrized encryption schemes (Def. 3.7)",
      order: 60,
      body: R`### Definition 3.7

A **private-key encryption scheme** consists of three **probabilistic polynomial-time** algorithms:

- $k \gets \mathsf{Gen}(1^n)$: takes the security parameter **in unary** and returns a key $k$ with $|k| \ge n$.
- $c \gets \mathsf{Enc}_k(m)$: takes a key and a message $m \in \{0,1\}^{*}$ (arbitrary length) and returns a ciphertext.
- $m := \mathsf{Dec}_k(c)$: $\mathsf{Dec}$ is w.l.o.g. **deterministic**.

Correctness: $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$ for every key output by $\mathsf{Gen}(1^n)$ and every message.

### Why $1^n$ in unary?

Running time is measured in the length of the input. On input $1^n$ (length $n$), a polynomial-time $\mathsf{Gen}$ may run in time polynomial in $n$. Given $n$ in binary (length about $\log n$), "polynomial time" would only allow time polynomial in $\log n$.`
    },
    { id: "l4-note-eav", type: "note", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 18", difficulty: 2,
      title: "EAV-security: computational indistinguishability for an eavesdropper",
      order: 70,
      body: R`### The experiment $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)$

1. $\mathcal{A}$ is given $1^n$ and outputs two messages $m_0, m_1$ with $|m_0| = |m_1|$.
2. A key $k \gets \mathsf{Gen}(1^n)$ and a uniform bit $b \gets \{0,1\}$ are chosen, and the challenge ciphertext $c \gets \mathsf{Enc}_k(m_b)$ is given to $\mathcal{A}$.
3. $\mathcal{A}$ outputs a bit $b'$.
4. The output of the experiment is 1 iff $b' = b$ (and 0 otherwise).

### Definition 3.8

$\Pi$ is **(computationally) indistinguishable in the presence of an eavesdropper** (EAV-secure) if for every **p.p.t.** adversary $\mathcal{A}$ there exists a **negligible** function $\varepsilon$ such that
$$\Pr\bigl[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1\bigr] \le \tfrac12 + \varepsilon(n).$$

### Differences from perfect indistinguishability

- only **p.p.t.** adversaries instead of all adversaries;
- success probability may exceed $\tfrac12$ by a **negligible** amount instead of being exactly $\tfrac12$;
- the experiment is parametrized by $n$ and requires $|m_0| = |m_1|$.

### How to show a scheme is NOT EAV-secure

Give a concrete p.p.t. adversary: specify $m_0, m_1$ explicitly, say how $b'$ is computed from $c$, compute $\Pr[b' = b]$ in the cases $b = 0$ and $b = 1$, and show the total exceeds $\tfrac12$ by a non-negligible amount (e.g. it is 1).

### Facts

- A random guess $b'$ wins with probability exactly $\tfrac12$, so "$\le \tfrac12 + \varepsilon(n)$" is the meaningful bound.
- There is **no encryption oracle** in the EAV experiment (that is CPA), and the adversary sees exactly **one** ciphertext. So deterministic encryption can be EAV-secure: the one-time pad on $\{0,1\}^n$ with $\mathsf{Gen}(1^n)$ uniform in $\{0,1\}^n$ is EAV-secure (every adversary wins with probability exactly $\tfrac12$).`
    },
    { id: "l4-note-length", type: "note", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 19", difficulty: 2,
      title: "Plaintext length and the condition |m0| = |m1|",
      order: 80,
      body: R`### Why the experiment requires $|m_0| = |m_1|$

- We want schemes that encrypt **arbitrary-length** messages ($m \in \{0,1\}^{*}$).
- Even the one-time pad reveals the message length.
- Encryption, in general, does **not** hide the plaintext length; this is **not possible**, and the definition reflects it by only asking $\mathcal{A}$ to distinguish messages of equal length.

Why impossible: for a fixed key, distinct messages must have disjoint sets of ciphertexts (decryption is deterministic and correct). There are fewer than $2^{L+1}$ bit strings of length $\le L$, so most long messages must have long ciphertexts, while a short message (e.g. a single bit) has ciphertexts of length at most a polynomial $q(n)$. An adversary submitting a 1-bit $m_0$ and a uniformly random $m_1$ of length $q(n)+2$ and guessing from $|c|$ wins with probability $> \tfrac34$.

### Leaking the length can be a problem

Examples: the answer "yes" vs. "no"; database search results. This has to be **taken care of by other means** (e.g. padding all messages to a fixed length).`
    },
    { id: "l4-note-semantic", type: "note", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 20", difficulty: 2,
      title: "Semantic security",
      order: 90,
      body: R`### What does indistinguishability guarantee?

The intuitive goal: "the ciphertext leaks nothing to a **poly-time** adversary, except with **negligible** probability". This is formalized as **semantic security** (Katz–Lindell, Def. 3.12; not stated formally on the slides).

Idea of the definition: whatever a p.p.t. adversary $\mathcal{A}$ can compute about the plaintext $m$ (any function $f(m)$) from the ciphertext $\mathsf{Enc}_k(m)$ and some side information $h(m)$, a p.p.t. simulator $\mathcal{A}'$ can compute about as well **without** the ciphertext, given only $h(m)$ and the length $|m|$. Formally, for every p.p.t. $\mathcal{A}$ there is a p.p.t. $\mathcal{A}'$ such that for every p.p.t. message sampler and all polynomial-time functions $f, h$,
$$\Bigl|\Pr\bigl[\mathcal{A}(1^n, \mathsf{Enc}_k(m), h(m)) = f(m)\bigr] - \Pr\bigl[\mathcal{A}'(1^n, |m|, h(m)) = f(m)\bigr]\Bigr| \le \mathsf{negl}(n).$$

### Theorem 3.13

A private-key encryption scheme is **semantically secure** (in the presence of an eavesdropper) **if and only if** it is **computationally indistinguishable** (in the presence of an eavesdropper), i.e. EAV-secure.

So it suffices to work with the simpler indistinguishability definition: an EAV-secure ciphertext reveals no information (beyond the length) that a p.p.t. adversary could exploit with more than negligible advantage.`
    },
  );

  // ===================== LECTURE 4: CARDS =====================
  add(
    { id: "l4-card-01", type: "card", lecture: 4, topic: "stream-ciphers", origin: "slides",
      source: "Lecture 4, slide 3", difficulty: 1,
      front: R`How does a stream cipher encrypt and decrypt?`,
      back: R`A key stream generator expands the key (seed) into a pseudorandom key stream $s_1 s_2 \dots$. Encryption: $c_i = m_i \oplus s_i$; decryption: $m_i = c_i \oplus s_i$. Like the one-time pad with a pseudorandom instead of a truly random pad.` },
    { id: "l4-card-02", type: "card", lecture: 4, topic: "stream-ciphers", origin: "slides",
      source: "Lecture 4, slides 4-5", difficulty: 1,
      front: R`Name the stream cipher implementations from the lecture and their status.`,
      back: R`LFSRs: very efficient in hardware, but linear, hence attacks. Combinations of LFSRs, e.g. A5/1 (GSM): broken. RC4 (used in WEP): broken. Block ciphers in a mode of operation (later).` },
    { id: "l4-card-03", type: "card", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 7", difficulty: 1,
      front: R`What are the three ingredients of provable security?`,
      back: R`**Definitions** (security goal and threat model), **assumptions** (computational, e.g. factoring is hard), and a **security proof** that the construction achieves the definition under the assumptions.` },
    { id: "l4-card-04", type: "card", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 9", difficulty: 1,
      front: R`What is the adversary's goal in modern security definitions, and which attack settings (powers) are distinguished?`,
      back: R`Goal: obtain **any** information about the plaintext. Powers: ciphertext-only ("eavesdropping"), known plaintext/ciphertext pairs, chosen-plaintext attack, chosen-ciphertext attack.` },
    { id: "l4-card-05", type: "card", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 12", difficulty: 1,
      front: R`Which two limitations of perfect secrecy motivate computational security, and which two relaxations are made?`,
      back: R`Perfect secrecy needs a key as long as the message that can be used only once. Relaxations: (1) only computationally bounded adversaries; (2) adversaries may succeed with very small probability.` },
    { id: "l4-card-06", type: "card", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 13", difficulty: 1,
      front: R`When is a scheme $(t, \varepsilon)$-indistinguishable? Pros and cons of this concrete approach?`,
      back: R`If every adversary running in time at most $t$ has $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi} = 1] \le \tfrac12 + \varepsilon$. Pro: relevant for real-world applications. Cons: security cannot be adjusted; not robust (which computational model?).` },
    { id: "l4-card-07", type: "card", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slides 14-15", difficulty: 1,
      front: R`What is the asymptotic approach?`,
      back: R`There is a security parameter $n$ known to everyone; running times and success probabilities are functions of $n$. Users and adversaries run in probabilistic polynomial time in $n$, and security may fail only with probability negligible in $n$.` },
    { id: "l4-card-08", type: "card", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 1,
      front: R`Define "probabilistic polynomial time" and state the strong Church–Turing thesis.`,
      back: R`p.p.t.: there is a polynomial $p$ such that on inputs of length $n$ the algorithm runs in time at most $p(n)$, and it may make random choices. Strong Church–Turing thesis: every physically realizable computation can be simulated on a Turing machine with at most polynomial slowdown.` },
    { id: "l4-card-09", type: "card", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 1,
      front: R`Define a negligible function (Def. 3.4).`,
      back: R`$f \colon \mathbb{N} \to \mathbb{R}^+$ is negligible if for every positive polynomial $p$ there exists $N$ such that for all $n > N$: $f(n) < \frac{1}{p(n)}$.` },
    { id: "l4-card-10", type: "card", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 1,
      front: R`Give three negligible functions from the slides and the closure properties.`,
      back: R`$2^{-n}$, $2^{-\sqrt n}$, $n^{-\log n}$ (each $< n^{-c}$ for every $c$, for large $n$). Closure: products and compositions of polynomials are polynomials; polynomial times negligible is negligible.` },
    { id: "l4-card-11", type: "card", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 16", difficulty: 2,
      front: R`Example 3.3: what happens when $n$ goes from 80 to 160 and CPUs get 4 times faster?`,
      back: R`Honest parties ($10^6 n^2$ cycles) still need 3.2 s. The adversary ($10^8 n^4$ cycles) needs about 13 instead of 3 weeks, and its success probability $2^{-n/2}$ drops from $2^{-40}$ to $2^{-80}$.` },
    { id: "l4-card-12", type: "card", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 17", difficulty: 1,
      front: R`State Definition 3.7 (private-key encryption scheme).`,
      back: R`Three p.p.t. algorithms: $k \gets \mathsf{Gen}(1^n)$ with $|k| \ge n$; $c \gets \mathsf{Enc}_k(m)$ for $m \in \{0,1\}^{*}$; $m := \mathsf{Dec}_k(c)$, w.l.o.g. deterministic. Correctness: $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$.` },
    { id: "l4-card-13", type: "card", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 18", difficulty: 1,
      front: R`Describe the experiment $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)$.`,
      back: R`$\mathcal{A}(1^n)$ outputs $m_0, m_1$ with $|m_0| = |m_1|$. Challenger: $k \gets \mathsf{Gen}(1^n)$, $b \gets \{0,1\}$, gives $c \gets \mathsf{Enc}_k(m_b)$ to $\mathcal{A}$. $\mathcal{A}$ outputs $b'$; the experiment outputs 1 iff $b' = b$.` },
    { id: "l4-card-14", type: "card", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 18", difficulty: 1,
      front: R`When is $\Pi$ EAV-secure (Def. 3.8)?`,
      back: R`If for every p.p.t. adversary $\mathcal{A}$ there exists a negligible $\varepsilon$ such that $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$.` },
    { id: "l4-card-15", type: "card", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 19", difficulty: 2,
      front: R`Why does the EAV experiment require $|m_0| = |m_1|$?`,
      back: R`Encryption of arbitrary-length messages cannot hide the plaintext length (even the one-time pad reveals it). Without the condition no scheme for $\{0,1\}^{*}$ could be secure, so the definition only demands hiding everything except the length.` },
    { id: "l4-card-16", type: "card", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 20", difficulty: 1,
      front: R`What does Theorem 3.13 say?`,
      back: R`A private-key encryption scheme is semantically secure (in the presence of an eavesdropper) if and only if it is computationally indistinguishable (EAV-secure).` },
    { id: "l4-card-17", type: "card", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slides 10-11", difficulty: 1,
      front: R`Define perfect indistinguishability (Def. 2.6) and state its relation to perfect secrecy.`,
      back: R`$\Pi$ is perfectly indistinguishable if for **every** $\mathcal{A}$: $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi} = 1] = \tfrac12$. Lemma 2.7: perfectly secret $\iff$ perfectly indistinguishable.` },
  );

  // ===================== LECTURE 4: TRUE/FALSE =====================
  add(
    { id: "l4-tf-01", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 1,
      statement: R`The function $f(n) = 2^{-\sqrt{n}}$ is negligible.`,
      answer: true,
      explanation: R`For every $c$, $n^c \cdot 2^{-\sqrt n} = 2^{c \log n - \sqrt n} \to 0$ because $\sqrt n$ grows faster than $c \log n$. It is one of the slide's examples.` },
    { id: "l4-tf-02", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 2,
      statement: R`The function $f(n) = n^{-\log n}$ is negligible.`,
      answer: true,
      explanation: R`$n^c \cdot n^{-\log n} = n^{c - \log n} < n^{-1}$ as soon as $\log n > c + 1$. So $f(n) < n^{-c}$ eventually for every $c$; it is a slide example.` },
    { id: "l4-tf-03", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 1,
      statement: R`The function $f(n) = 1/n^{100}$ is negligible.`,
      answer: false,
      explanation: R`For $p(n) = n^{101}$ we would need $n^{-100} < n^{-101}$, which fails for all $n \ge 1$. An inverse polynomial is never negligible.` },
    { id: "l4-tf-04", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 2,
      statement: R`If $f$ is negligible, then $g(n) := \sqrt{f(n)}$ is negligible.`,
      answer: true,
      explanation: R`Given a positive polynomial $p$, apply negligibility of $f$ to the polynomial $p^2$: eventually $f(n) < 1/p(n)^2$, so $\sqrt{f(n)} < 1/p(n)$.` },
    { id: "l4-tf-05", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 2,
      statement: R`If $f$ and $g$ are negligible, then $f + g$ is negligible.`,
      answer: true,
      explanation: R`For a positive polynomial $p$, eventually $f(n) < \frac{1}{2p(n)}$ and $g(n) < \frac{1}{2p(n)}$ (since $2p$ is a positive polynomial), so $f(n) + g(n) < \frac{1}{p(n)}$.` },
    { id: "l4-tf-06", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 3,
      statement: R`If $f$ is negligible, then $g(n) := n^{\log n} \cdot f(n)$ is negligible.`,
      answer: false,
      explanation: R`$n^{\log n}$ is not a polynomial. Take $f(n) = n^{-\log n}$, which is negligible; then $g(n) = 1$, which is not. Closure only holds for polynomial factors.` },
    { id: "l4-tf-07", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 2,
      statement: R`The function $f(n) = 2^{-\log n}$ (with $\log = \log_2$) is negligible.`,
      answer: false,
      explanation: R`$2^{-\log n} = 1/n$, an inverse polynomial, which is not negligible (take $p(n) = n^2$).` },
    { id: "l4-tf-08", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 3,
      statement: R`If $f$ is negligible, then $g(n) := f(\lceil \log n \rceil)$ is negligible.`,
      answer: false,
      explanation: R`Counterexample: $f(n) = 2^{-n}$ is negligible, but $g(n) = 2^{-\lceil \log n \rceil} \ge 2^{-\log n - 1} = \frac{1}{2n}$, which is not negligible.` },
    { id: "l4-tf-09", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 3,
      statement: R`If $f$ is negligible, then $g(n) := n^{-f(n)}$ is negligible.`,
      answer: false,
      explanation: R`$g(n) = 2^{-f(n)\log n}$ and $f(n)\log n \to 0$ (as $f(n) < 1/n$ eventually), so $g(n) \to 1$. A function tending to 1 is not negligible.` },
    { id: "l4-tf-10", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 2,
      statement: R`The function $f$ with $f(n) = 2^{-n}$ for even $n$ and $f(n) = 1/n$ for odd $n$ is negligible.`,
      answer: false,
      explanation: R`For $p(n) = n^2$, $f(n) = 1/n \ge 1/n^2$ for every odd $n$, so no $N$ works: the condition must hold for **all** $n > N$, not just infinitely many.` },
    { id: "l4-tf-11", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 3,
      statement: R`The function $f(n) = n^{-\log \log n}$ is negligible.`,
      answer: true,
      explanation: R`For any $c$, $n^c \cdot f(n) = n^{c - \log\log n} \le n^{-1}$ once $\log \log n \ge c+1$. Since $\log\log n \to \infty$, $f$ eventually drops below every inverse polynomial (even though it decays slowly).` },
    { id: "l4-tf-12", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 1,
      statement: R`The function $f(n) = n^{100} \cdot 2^{-\sqrt{n}}$ is negligible.`,
      answer: true,
      explanation: R`$2^{-\sqrt n}$ is negligible and a polynomial times a negligible function is negligible (closure property).` },
    { id: "l4-tf-13", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 2,
      statement: R`A function $f \colon \mathbb{N} \to \mathbb{R}^+$ is negligible iff for every positive polynomial $p$ we have $f(n) < 1/p(n)$ for **all** $n \in \mathbb{N}$.`,
      answer: false,
      explanation: R`The definition only requires $f(n) < 1/p(n)$ for all $n > N$ for some $N$. With "all $n$", even $2^{-n}$ would fail: for $p(n) = 4$ and $n = 1$, $2^{-1} \not< \frac14$.` },
    { id: "l4-tf-14", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 3,
      statement: R`If $f$ is negligible, then $g(n) := 2^{f(n)} - 1$ is negligible.`,
      answer: true,
      explanation: R`For $0 \le x \le 1$ we have $2^x - 1 \le x$ (the function $2^x$ is convex and agrees with $1 + x$ at $x = 0$ and $x = 1$). Since $f(n) \le 1$ eventually, $0 < g(n) \le f(n)$ eventually, so $g$ is negligible.` },
    { id: "l4-tf-15", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 18", difficulty: 1,
      statement: R`EAV-security requires that every p.p.t. adversary wins $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)$ with probability exactly $\tfrac12$.`,
      answer: false,
      explanation: R`That is perfect indistinguishability (for all adversaries). EAV-security allows $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$ with $\varepsilon$ negligible, and only for p.p.t. $\mathcal{A}$.` },
    { id: "l4-tf-16", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slides 11, 18", difficulty: 2,
      statement: R`The one-time pad with $\mathsf{Gen}(1^n)$ outputting a uniform $k \in \{0,1\}^n$ and message space $\{0,1\}^n$ is EAV-secure.`,
      answer: true,
      explanation: R`For every $m_0, m_1$, the ciphertext $k \oplus m_b$ is uniform and independent of $b$, so every adversary (p.p.t. or not) wins with probability exactly $\tfrac12$, and the bound $\tfrac12 + \varepsilon(n)$ holds for any negligible $\varepsilon$.` },
    { id: "l4-tf-17", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 18", difficulty: 1,
      statement: R`The definition of EAV-security quantifies over all adversaries, including those running in exponential time.`,
      answer: false,
      explanation: R`Only p.p.t. adversaries are considered; this is the first relaxation of computational security. An exponential-time adversary can, e.g., try all keys.` },
    { id: "l4-tf-18", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 18", difficulty: 1,
      statement: R`In the experiment $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)$ the adversary has access to an encryption oracle $\mathsf{Enc}_k(\cdot)$.`,
      answer: false,
      explanation: R`In the EAV experiment the adversary only gets the single challenge ciphertext $c \gets \mathsf{Enc}_k(m_b)$. An encryption oracle is given in the CPA experiment.` },
    { id: "l4-tf-19", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 18", difficulty: 2,
      statement: R`Every EAV-secure encryption scheme must have a randomized encryption algorithm.`,
      answer: false,
      explanation: R`The EAV adversary sees only one ciphertext. The one-time pad has deterministic encryption and is EAV-secure. (Randomized or stateful encryption becomes necessary for CPA-security.)` },
    { id: "l4-tf-20", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 17", difficulty: 2,
      statement: R`$\mathsf{Gen}$ receives the security parameter in unary, $1^n$, so that a polynomial-time $\mathsf{Gen}$ may run in time polynomial in $n$.`,
      answer: true,
      explanation: R`Running time is measured in the input length. Input $1^n$ has length $n$; the binary encoding of $n$ would only have length about $\log n$.` },
    { id: "l4-tf-21", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 13", difficulty: 2,
      statement: R`A scheme is $(t, \varepsilon)$-indistinguishable if every adversary running in time at most $t$ wins the indistinguishability experiment with probability at most $\varepsilon$.`,
      answer: false,
      explanation: R`The bound is $\tfrac12 + \varepsilon$, not $\varepsilon$: guessing $b'$ at random already wins with probability $\tfrac12$.` },
    { id: "l4-tf-22", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 20", difficulty: 1,
      statement: R`A private-key encryption scheme is semantically secure in the presence of an eavesdropper if and only if it is EAV-secure.`,
      answer: true,
      explanation: R`This is Theorem 3.13: semantic security and computational indistinguishability (both for an eavesdropper) are equivalent.` },
    { id: "l4-tf-23", type: "tf", lecture: 4, topic: "stream-ciphers", origin: "slides",
      source: "Lecture 4, slide 3", difficulty: 1,
      statement: R`In a stream cipher, encryption computes $c_i = m_i \oplus s_i$ from the key stream $s_i$, and decryption performs the same operation $m_i = c_i \oplus s_i$.`,
      answer: true,
      explanation: R`Both parties generate the same key stream from the key, and XOR is its own inverse, exactly as in the one-time pad.` },
    { id: "l4-tf-24", type: "tf", lecture: 4, topic: "stream-ciphers", origin: "slides",
      source: "Lecture 4, slide 4", difficulty: 1,
      statement: R`A single linear-feedback shift register is a good key stream generator, because its linearity makes it resistant to attacks.`,
      answer: false,
      explanation: R`LFSRs are very efficient in hardware, but their linearity is exactly what enables attacks. Even combinations of LFSRs such as A5/1 (GSM) are broken.` },
    { id: "l4-tf-25", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 19", difficulty: 1,
      statement: R`The one-time pad hides the length of the encrypted message.`,
      answer: false,
      explanation: R`The ciphertext $m \oplus k$ has exactly the length of $m$. The slides note that even the one-time pad reveals the message length, which is why the EAV experiment requires $|m_0| = |m_1|$.` },
    { id: "l4-tf-26", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 1,
      statement: R`The strong Church–Turing thesis states that every physically realizable computation can be simulated on a Turing machine with at most polynomial slowdown.`,
      answer: true,
      explanation: R`This is the statement on the slide; it justifies modelling efficient adversaries as p.p.t. algorithms independently of the machine model.` },
    { id: "l4-tf-27", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 18", difficulty: 2,
      statement: R`If some p.p.t. adversary wins $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)$ with probability $\tfrac12 + \frac{1}{n^3}$ for all $n$, then $\Pi$ is not EAV-secure.`,
      answer: true,
      explanation: R`Any $\varepsilon$ with $\tfrac12 + \frac{1}{n^3} \le \tfrac12 + \varepsilon(n)$ satisfies $\varepsilon(n) \ge n^{-3}$ for all $n$, so it is not negligible. A non-negligible advantage, however small, breaks EAV-security.` },
  );

  // ===================== LECTURE 4: MULTIPLE CHOICE =====================
  add(
    { id: "l4-mc-01", type: "mc", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 2,
      question: R`Which of the following functions is negligible?`,
      options: [R`$n^{-1000}$`, R`$2^{-\log n}$`, R`$1/\log n$`, R`$n^{-\log n}$`],
      correct: 3,
      explanation: R`$n^{-\log n}$ eventually drops below every $n^{-c}$. The others are $\ge$ an inverse polynomial: $n^{-1000}$, $2^{-\log n} = 1/n$, and $1/\log n \ge 1/n$.` },
    { id: "l4-mc-02", type: "mc", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 18", difficulty: 1,
      question: R`What does $\mathcal{A}$ send to the challenger in $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)$?`,
      options: [R`A single message $m$`, R`Two messages $m_0, m_1$ with $|m_0| = |m_1|$`, R`Two messages $m_0, m_1$ of arbitrary lengths`, R`Polynomially many encryption queries, then $m_0, m_1$`],
      correct: 1,
      explanation: R`$\mathcal{A}$ outputs two equal-length messages and receives $c \gets \mathsf{Enc}_k(m_b)$. There are no encryption queries in the EAV setting (that is CPA).` },
    { id: "l4-mc-03", type: "mc", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 18", difficulty: 1,
      question: R`Which condition defines EAV-security of $\Pi$?`,
      options: [R`For every adversary $\mathcal{A}$: $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] = \tfrac12$`, R`For every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \varepsilon(n)$`, R`For every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$`, R`There is a negligible $\varepsilon$ such that some p.p.t. $\mathcal{A}$ has $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \ge \tfrac12 - \varepsilon(n)$`],
      correct: 2,
      explanation: R`Def. 3.8: for every p.p.t. adversary there exists a negligible $\varepsilon$ such that the success probability is at most $\tfrac12 + \varepsilon(n)$. The first option is perfect indistinguishability; the second is impossible because guessing wins with probability $\tfrac12$.` },
    { id: "l4-mc-04", type: "mc", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 16", difficulty: 2,
      question: R`In Example 3.3 (honest parties: $10^6 n^2$ cycles; adversary: $10^8 n^4$ cycles, success $\le 2^{-n/2}$), $n$ is raised from 80 to 160 while CPUs become 4 times faster. What happens?`,
      options: [R`Honest parties take 4 times longer; the adversary's success probability is unchanged`, R`Honest parties still take 3.2 s; the adversary takes about 4 times longer and succeeds only with probability $2^{-80}$ instead of $2^{-40}$`, R`Both honest parties and the adversary take 16 times longer`, R`Honest parties still take 3.2 s; the adversary's success probability doubles`],
      correct: 1,
      explanation: R`$n^2$ grows by 4, cancelled by the 4 times faster CPU; $n^4$ grows by 16, so the adversary needs 4 times longer (about 13 instead of 3 weeks), and $2^{-n/2}$ drops from $2^{-40}$ to $2^{-80}$.` },
    { id: "l4-mc-05", type: "mc", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 17", difficulty: 2,
      question: R`Why does $\mathsf{Gen}$ take $1^n$ rather than $n$ as input?`,
      options: [R`So that the key is guaranteed to be uniformly random`, R`So that a polynomial-time $\mathsf{Gen}$ may run in time polynomial in $n$, since running time is measured in the input length`, R`So that the adversary cannot learn $n$`, R`Because $\mathsf{Gen}$ must output exactly $n$ bits`],
      correct: 1,
      explanation: R`Input $1^n$ has length $n$. The security parameter is known to everyone, and keys only need $|k| \ge n$.` },
    { id: "l4-mc-06", type: "mc", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 3,
      question: R`Let $f, g$ be negligible. Which function is **not** necessarily negligible?`,
      options: [R`$f(n) + g(n)$`, R`$f(n) \cdot g(n)$`, R`$n^3 \cdot f(n)$`, R`$f(n) / g(n)$`],
      correct: 3,
      explanation: R`With $f = g$ the quotient is 1. Sums and polynomial multiples of negligible functions are negligible, and $f \cdot g \le f$ once $g(n) < 1$.` },
    { id: "l4-mc-07", type: "mc", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 13", difficulty: 1,
      question: R`Which is listed on the slides as an advantage of the concrete $(t, \varepsilon)$ approach?`,
      options: [R`It is robust with respect to the computational model`, R`Its security level can be adjusted`, R`It is relevant for real-world applications`, R`It does not need any notion of running time`],
      correct: 2,
      explanation: R`Pro: relevant for real-world applications. Cons: security cannot be adjusted, and it is not robust (which computational model is used to count $t$?).` },
    { id: "l4-mc-08", type: "mc", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 19", difficulty: 1,
      question: R`Why is $|m_0| = |m_1|$ required in the EAV experiment?`,
      options: [R`Because the one-time pad can only encrypt messages of length $n$`, R`Because encryption of arbitrary-length messages cannot hide the plaintext length in general`, R`To make the proofs by reduction simpler`, R`Because $\mathsf{Enc}$ must be deterministic`],
      correct: 1,
      explanation: R`Hiding the length is not possible in general (even the one-time pad reveals it), so the definition only asks to hide everything else. Length leakage must be handled by other means, e.g. padding.` },
    { id: "l4-mc-09", type: "mc", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 9", difficulty: 1,
      question: R`Which attack setting does EAV-security model?`,
      options: [R`Ciphertext-only attack (eavesdropping)`, R`Known-plaintext attack`, R`Chosen-plaintext attack`, R`Chosen-ciphertext attack`],
      correct: 0,
      explanation: R`The eavesdropper only sees a ciphertext. Chosen-plaintext and chosen-ciphertext attacks are modelled by CPA- and CCA-security.` },
  );

  // ===================== LECTURE 4: GAPS =====================
  add(
    { id: "l4-gap-negligible", type: "gap", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15", difficulty: 1,
      title: "Negligible function (Def. 3.4)", points: 5,
      text: R`A function $f \colon \mathbb{N} \to \mathbb{R}^+$ is negligible if for <gap>every positive polynomial $p$</gap> there exists <gap>$N$</gap> such that <gap>for all $n > N$</gap> it holds that <gap>$f(n) < \frac{1}{p(n)}$</gap>. Equivalently, for every constant $c$, <gap>$f(n) < n^{-c}$ for all sufficiently large $n$</gap>.`,
      note: R`Examples: $2^{-n}$, $2^{-\sqrt n}$, $n^{-\log n}$. Polynomial times negligible is negligible.` },
    { id: "l4-gap-eav", type: "gap", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 18", difficulty: 2,
      title: "EAV-security and the experiment PrivK-eav (Def. 3.8)", points: 5,
      text: R`A private-key encryption scheme $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ is indistinguishable in the presence of an eavesdropper (EAV-secure) if for every <gap>p.p.t. adversary $\mathcal{A}$</gap> there exists a negligible function $\varepsilon$ such that $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le$ <gap>$\tfrac12 + \varepsilon(n)$</gap>, where the experiment $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)$ is defined as follows:

1. $\mathcal{A}$ is given $1^n$ and outputs a pair of messages $m_0, m_1$ <gap>with $|m_0| = |m_1|$</gap>.
2. A key <gap>$k \gets \mathsf{Gen}(1^n)$</gap> is generated and a uniform bit $b \gets \{0,1\}$ is chosen.
3. The challenge ciphertext <gap>$c \gets \mathsf{Enc}_k(m_b)$</gap> is given to $\mathcal{A}$.
4. $\mathcal{A}$ outputs a bit $b'$. The output of the experiment is 1 if and only if <gap>$b' = b$</gap>.`,
      note: R`Unlike CPA-security, the adversary gets no encryption oracle; it sees exactly one ciphertext.` },
    { id: "l4-gap-syntax", type: "gap", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 17", difficulty: 1,
      title: "Private-key encryption scheme (Def. 3.7)", points: 5,
      text: R`A private-key encryption scheme consists of three <gap>probabilistic polynomial-time</gap> algorithms. $\mathsf{Gen}$ takes as input <gap>the security parameter in unary, $1^n$,</gap> and returns a key $k$ with <gap>$|k| \ge n$</gap>. $\mathsf{Enc}$ takes a key $k$ and a message <gap>$m \in \{0,1\}^{*}$</gap> and returns a ciphertext $c$. $\mathsf{Dec}$ takes a key and a ciphertext, is w.l.o.g. <gap>deterministic</gap>, and returns $m := \mathsf{Dec}_k(c)$. Correctness requires <gap>$\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$ for every key $k$ output by $\mathsf{Gen}(1^n)$ and every message $m$</gap>.` },
    { id: "l4-gap-concrete", type: "gap", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slides 13-15", difficulty: 1,
      title: "Concrete vs. asymptotic security", points: 5,
      text: R`In the concrete approach, $\Pi$ is $(t, \varepsilon)$-indistinguishable if for all adversaries $\mathcal{A}$ <gap>running in time at most $t$</gap> we have <gap>$\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi} = 1] \le \tfrac12 + \varepsilon$</gap>. In the asymptotic approach there is a security parameter $n$ <gap>known to everyone</gap>; the running time bound $t$ is replaced by <gap>probabilistic polynomial time in $n$</gap>, and $\varepsilon$ is replaced by <gap>a function negligible in $n$</gap>.` },
  );

  // ===================== LECTURE 4: PROBLEMS =====================
  add(
    { id: "l4-prob-feistel1-eav", type: "problem", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 18 and Lecture 3, slide 10 (exercise in the style of the exam)", difficulty: 2,
      title: "One-round Feistel encryption is not EAV-secure",
      mock: true,
      statement: R`Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ be any keyed function (it may even be a PRF). Consider the scheme $\Pi$ for messages in $\{0,1\}^{2n}$:

- $\mathsf{Gen}(1^n)$: return $k \gets \{0,1\}^n$ uniformly.
- $\mathsf{Enc}_k(m)$: parse $m = L \| R$ with $L, R \in \{0,1\}^n$ and return $c := R \,\|\, (L \oplus F_k(R))$.

That is, $\mathsf{Enc}_k$ is one round of a Feistel network with round function $F_k$.`,
      parts: [
        { label: "a", points: 1,
          prompt: R`Define $\mathsf{Dec}_k(c)$ and show correctness.`,
          hints: [R`The first half of $c$ is $R$ in the clear.`],
          solution: R`$\mathsf{Dec}_k(c)$: parse $c = c_1 \| c_2$ with $c_1, c_2 \in \{0,1\}^n$ and return $(c_2 \oplus F_k(c_1)) \,\|\, c_1$.

Correctness: for $c = \mathsf{Enc}_k(L \| R)$ we have $c_1 = R$ and $c_2 = L \oplus F_k(R)$, so $c_2 \oplus F_k(c_1) = L \oplus F_k(R) \oplus F_k(R) = L$ and $\mathsf{Dec}_k(c) = L \| R$.`,
          rubric: [ { points: 1, text: R`Correct $\mathsf{Dec}$ and the cancellation $F_k(R) \oplus F_k(R) = 0^n$` } ] },
        { label: "b", points: 3,
          prompt: R`Show that $\Pi$ is not EAV-secure. Specify all values your adversary chooses.`,
          hints: [R`Which part of the plaintext appears unchanged in the ciphertext?`, R`Choose $m_0, m_1$ that differ in the right half.`],
          solution: R`Recall: $\Pi$ is EAV-secure if for every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$.

Adversary $\mathcal{A}(1^n)$:

1. Output $m_0 := 0^n \| 0^n$ and $m_1 := 0^n \| 1^n$ (both of length $2n$).
2. On receiving $c = c_1 \| c_2$ with $c_1, c_2 \in \{0,1\}^n$, output $b' := 0$ if $c_1 = 0^n$ and $b' := 1$ otherwise.

Analysis:

- $b = 0$: $c = \mathsf{Enc}_k(0^n \| 0^n) = 0^n \,\|\, F_k(0^n)$, so $c_1 = 0^n$ and $\mathcal{A}$ outputs $b' = 0$.
- $b = 1$: $c = \mathsf{Enc}_k(0^n \| 1^n) = 1^n \,\|\, F_k(1^n)$, so $c_1 = 1^n \neq 0^n$ and $\mathcal{A}$ outputs $b' = 1$.

Hence $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] = 1$. $\mathcal{A}$ clearly runs in polynomial time. Since $1 - \tfrac12 = \tfrac12$ is not negligible, no negligible $\varepsilon$ satisfies the definition, so $\Pi$ is not EAV-secure (independently of how good $F$ is).`,
          rubric: [ { points: 1, text: R`Explicit equal-length messages $m_0, m_1$ differing in the right half` },
                    { points: 1, text: R`Correct decision rule and ciphertexts computed for $b = 0$ and $b = 1$` },
                    { points: 1, text: R`Success probability 1, comparison with $\tfrac12 + \mathsf{negl}(n)$, conclusion` } ] },
      ] },
    { id: "l4-prob-keyreuse-eav", type: "problem", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 18 (exercise in the style of the exam)", difficulty: 2,
      title: "Reusing a short pad is not EAV-secure",
      mock: true,
      statement: R`Consider the following scheme $\Pi$ for messages $m \in \{0,1\}^{2n}$, which uses an $n$-bit one-time-pad key twice:

- $\mathsf{Gen}(1^n)$: return $k \gets \{0,1\}^n$ uniformly.
- $\mathsf{Enc}_k(m) := m \oplus (k \| k)$.
- $\mathsf{Dec}_k(c) := c \oplus (k \| k)$.`,
      parts: [
        { label: "a", points: 1,
          prompt: R`Show that $\Pi$ is correct.`,
          hints: [R`XOR the same value twice.`],
          solution: R`$\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m \oplus (k\|k) \oplus (k\|k) = m$ for every $k \in \{0,1\}^n$ and $m \in \{0,1\}^{2n}$.`,
          rubric: [ { points: 1, text: R`Correct computation $m \oplus (k\|k) \oplus (k\|k) = m$` } ] },
        { label: "b", points: 3,
          prompt: R`Show that $\Pi$ is not EAV-secure. Specify all values your adversary chooses.`,
          hints: [R`What is $c_1 \oplus c_2$ for $c = c_1 \| c_2$?`, R`$c_1 \oplus c_2 = m_1' \oplus m_2'$ where $m = m_1' \| m_2'$ are the halves of the plaintext.`],
          solution: R`Recall: $\Pi$ is EAV-secure if for every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$.

Adversary $\mathcal{A}(1^n)$:

1. Output $m_0 := 0^n \| 0^n$ and $m_1 := 0^n \| 1^n$.
2. On receiving $c = c_1 \| c_2$ ($c_1, c_2 \in \{0,1\}^n$), output $b' := 0$ if $c_1 = c_2$, and $b' := 1$ otherwise.

Analysis:

- $b = 0$: $c = (0^n \oplus k) \| (0^n \oplus k) = k \| k$, so $c_1 = c_2$ and $b' = 0$.
- $b = 1$: $c = k \| (1^n \oplus k)$, so $c_1 \oplus c_2 = 1^n \neq 0^n$, i.e. $c_1 \neq c_2$, and $b' = 1$.

So $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] = 1$, and $\mathcal{A}$ is clearly p.p.t. As $\tfrac12$ is not negligible, $\Pi$ is not EAV-secure.`,
          rubric: [ { points: 1, text: R`Explicit equal-length messages whose halves XOR to different values` },
                    { points: 1, text: R`Decision rule based on $c_1 = c_2$; ciphertexts computed for $b = 0$ and $b = 1$` },
                    { points: 1, text: R`Success probability 1 and conclusion against $\tfrac12 + \mathsf{negl}(n)$` } ] },
      ] },
    { id: "l4-prob-negligible", type: "problem", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 15 (exercise in the style of the exam)", difficulty: 3,
      title: "Prove or refute: negligible functions",
      mock: true,
      statement: R`Recall: $f \colon \mathbb{N} \to \mathbb{R}^+$ is negligible if for every positive polynomial $p$ there exists $N$ such that $f(n) < \frac{1}{p(n)}$ for all $n > N$. Prove or refute each statement directly from this definition.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`$f(n) = 2^{-\sqrt{n}}$ is negligible.`,
          hints: [R`Every positive polynomial is eventually at most $n^{c}$ for some constant $c$.`, R`Compare exponents: $\sqrt n$ vs. $c \log n$.`],
          solution: R`True. Let $p$ be a positive polynomial of degree $d$. Since $p(n)/n^{d+1} \to 0$, there is $N_0$ with $p(n) \le n^{d+1}$ for all $n > N_0$. Moreover $\frac{(d+1)\log n}{\sqrt n} \to 0$, so there is $N_1$ with $\sqrt{n} > (d+1)\log n$ for all $n > N_1$, i.e. $2^{-\sqrt n} < 2^{-(d+1)\log n} = n^{-(d+1)}$. For $N := \max(N_0, N_1)$ and all $n > N$:
$$2^{-\sqrt n} < n^{-(d+1)} \le \frac{1}{p(n)}.$$`,
          rubric: [ { points: 1, text: R`Bounds $p(n) \le n^{c}$ for large $n$ (any valid polynomial bound)` },
                    { points: 1, text: R`Shows $2^{-\sqrt n} < n^{-c}$ for large $n$ via $\sqrt n > c\log n$, and concludes with an explicit $N$` } ] },
        { label: "b", points: 1,
          prompt: R`$g(n) = n^{-100}$ is negligible.`,
          hints: [R`Find one polynomial for which the condition fails for all $n$.`],
          solution: R`False. Take $p(n) = n^{101}$. Then $g(n) < \frac{1}{p(n)}$ would mean $n^{-100} < n^{-101}$, i.e. $n < 1$, which fails for every $n \ge 1$. So no $N$ exists.`,
          rubric: [ { points: 1, text: R`Explicit polynomial (e.g. $n^{101}$) for which the condition fails for all $n$` } ] },
        { label: "c", points: 2,
          prompt: R`If $f$ and $g$ are negligible, then $h := f + g$ is negligible.`,
          hints: [R`Use the definition for $f$ and $g$ with the polynomial $2p$.`],
          solution: R`True. Let $p$ be a positive polynomial; then $2p$ is a positive polynomial. Since $f$ is negligible there is $N_f$ with $f(n) < \frac{1}{2p(n)}$ for $n > N_f$, and similarly $N_g$ for $g$. For $N := \max(N_f, N_g)$ and all $n > N$:
$$h(n) = f(n) + g(n) < \frac{1}{2p(n)} + \frac{1}{2p(n)} = \frac{1}{p(n)}.$$`,
          rubric: [ { points: 1, text: R`Applies the definition of $f$ and $g$ with $2p$ (or equivalent)` },
                    { points: 1, text: R`Takes $N = \max(N_f, N_g)$ and concludes $h(n) < 1/p(n)$` } ] },
        { label: "d", points: 1,
          prompt: R`If $f$ is negligible, then $n^{\log n} \cdot f(n)$ is negligible.`,
          hints: [R`Is $n^{\log n}$ a polynomial? Use an example from the slides.`],
          solution: R`False. $f(n) = n^{-\log n}$ is negligible (slide example), but $n^{\log n} \cdot f(n) = 1$, and $1 < \frac{1}{p(n)}$ fails for $p(n) = n$ and all $n \ge 1$. The closure property only covers multiplication by a polynomial, and $n^{\log n}$ is super-polynomial.`,
          rubric: [ { points: 1, text: R`Valid counterexample with justification` } ] },
      ] },
    { id: "l4-prob-length", type: "problem", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 19 (exercise in the style of the exam)", difficulty: 3,
      title: "Without |m0| = |m1|, no scheme is EAV-secure",
      mock: true,
      statement: R`Let $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ be any correct private-key encryption scheme with message space $\{0,1\}^{*}$ and bit-string ciphertexts (Def. 3.7). Consider the modified experiment in which $\mathcal{A}$ may output $m_0, m_1$ of **different** lengths. Show that there is a p.p.t. adversary that wins this modified experiment with probability greater than $\tfrac34$.`,
      parts: [
        { label: "a", points: 1,
          prompt: R`Show that there is a polynomial $q$ such that $|\mathsf{Enc}_k(0)| \le q(n)$ for every key $k$ output by $\mathsf{Gen}(1^n)$ (here $0$ is the 1-bit message).`,
          hints: [R`An algorithm cannot write more output bits than it has time steps.`],
          solution: R`$\mathsf{Gen}$ is p.p.t., so $|k|$ is at most polynomial in $n$. $\mathsf{Enc}$ is p.p.t., so on input $(k, 0)$ it runs in time polynomial in $|k| + 1$, hence polynomial in $n$. The output length is at most the running time, so $|\mathsf{Enc}_k(0)| \le q(n)$ for some polynomial $q$.`,
          rubric: [ { points: 1, text: R`Length bound from the polynomial running time of $\mathsf{Gen}$ and $\mathsf{Enc}$` } ] },
        { label: "b", points: 2,
          prompt: R`Fix a key $k$ and let $L := q(n)$. Show that for a uniformly random $m \in \{0,1\}^{L+2}$, $\Pr[|\mathsf{Enc}_k(m)| \le L] < \tfrac12$.`,
          hints: [R`Correctness with a deterministic $\mathsf{Dec}$: can one ciphertext be an encryption of two different messages?`, R`Count the bit strings of length at most $L$.`],
          solution: R`By correctness, any ciphertext $c$ that $\mathsf{Enc}_k(m)$ can output satisfies $\mathsf{Dec}_k(c) = m$; as $\mathsf{Dec}$ is deterministic, each $c$ can be output for at most one message. Hence for each $c$, $\sum_m \Pr[\mathsf{Enc}_k(m) = c] \le 1$. Let $S$ be the set of bit strings of length at most $L$, so $|S| = 2^{L+1} - 1$. Then
$$\sum_{m \in \{0,1\}^{L+2}} \Pr[|\mathsf{Enc}_k(m)| \le L] = \sum_{c \in S} \sum_{m} \Pr[\mathsf{Enc}_k(m) = c] \le |S| < 2^{L+1}.$$
Dividing by the $2^{L+2}$ messages: for uniform $m$, $\Pr[|\mathsf{Enc}_k(m)| \le L] < \frac{2^{L+1}}{2^{L+2}} = \frac12$.`,
          rubric: [ { points: 1, text: R`Each ciphertext belongs to at most one message (correctness, deterministic $\mathsf{Dec}$)` },
                    { points: 1, text: R`Counting of the at most $2^{L+1}-1$ short strings, giving probability $< \tfrac12$` } ] },
        { label: "c", points: 1,
          prompt: R`Give the adversary and compute its success probability.`,
          hints: [R`Decide based on $|c|$ only.`],
          solution: R`$\mathcal{A}(1^n)$: output $m_0 := 0$ (one bit) and a uniformly random $m_1 \in \{0,1\}^{q(n)+2}$. On receiving $c$, output $b' := 0$ if $|c| \le q(n)$ and $b' := 1$ otherwise. $\mathcal{A}$ is p.p.t.

If $b = 0$, then $|c| \le q(n)$ by (a), so $\mathcal{A}$ is always right. If $b = 1$, by (b) (applied for every fixed key) $|c| > q(n)$ with probability $> \tfrac12$. So
$$\Pr[\text{win}] > \tfrac12 \cdot 1 + \tfrac12 \cdot \tfrac12 = \tfrac34,$$
which exceeds $\tfrac12$ by a non-negligible amount. Hence without $|m_0| = |m_1|$ no scheme for $\{0,1\}^{*}$ could be secure, which is why the definition requires equal lengths.`,
          rubric: [ { points: 1, text: R`Adversary with explicit messages and length test, and success probability $> \tfrac34$` } ] },
      ] },
  );
})();
