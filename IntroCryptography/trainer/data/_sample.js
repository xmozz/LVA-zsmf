/* Sample content for development and testing (loaded when the bank is empty or with ?sample=1).
 * Ids use the prefix "smp-" (and "mix-smp-" for the cross-lecture note) so they never collide with real content. */
(function () {
  const R = String.raw;
  const add = (...items) => (window.CRYPTO_BANK = window.CRYPTO_BANK || []).push(...items);

  add(
    /* ---------------- notes ---------------- */
    { id: "smp-note-prg-def", type: "note", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slides 6–9 (sample)", difficulty: 1,
      title: "Pseudorandom generators",
      order: 10,
      body: R`### Definition

Let $\ell$ be a polynomial. A deterministic polynomial-time algorithm $G$ is a **pseudorandom generator (PRG)** with expansion factor $\ell$ if

1. **Expansion:** for every $n$ and every $s \in \{0,1\}^n$, $|G(s)| = \ell(n)$ with $\ell(n) > n$.
2. **Pseudorandomness:** for every p.p.t. distinguisher $\mathcal{D}$ there is a negligible function $\varepsilon$ such that

$$\left| \Pr_{s \gets \{0,1\}^n}[\mathcal{D}(G(s)) = 1] - \Pr_{r \gets \{0,1\}^{\ell(n)}}[\mathcal{D}(r) = 1] \right| \le \varepsilon(n).$$

### Intuition

The output of $G$ on a *uniform* seed cannot be told apart from a uniform string of the same length by any efficient test.

### Typical exam trap

- An unbounded distinguisher always wins: the image of $G$ contains at most $2^n$ of the $2^{\ell(n)}$ strings.
- A construction that repeats or reveals structure (e.g. $G(s) \| G(s)$) is not a PRG: test for that structure.`
    },
    { id: "smp-note-otp", type: "note", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 14–20 (sample)", difficulty: 1,
      title: "The one-time pad",
      order: 20,
      body: R`### Scheme

For $\mathcal{M} = \mathcal{K} = \mathcal{C} = \{0,1\}^\ell$: $\mathsf{Gen}$ outputs a uniform $k \in \{0,1\}^\ell$, $\mathsf{Enc}_k(m) = k \oplus m$ and $\mathsf{Dec}_k(c) = k \oplus c$.

### Why it is perfectly secret

For every $m, c \in \{0,1\}^\ell$ there is exactly one key with $k \oplus m = c$, namely $k = m \oplus c$, so
$$\Pr[\mathsf{Enc}_K(m) = c] = \Pr[K = m \oplus c] = 2^{-\ell},$$
which does not depend on $m$.

### Limitations

- The key is as long as the message (Shannon: $|\mathcal{K}| \ge |\mathcal{M}|$ is necessary).
- The key must be used **once**: from $c_1 = k \oplus m_1$ and $c_2 = k \oplus m_2$ one learns $c_1 \oplus c_2 = m_1 \oplus m_2$.`
    },
    { id: "mix-smp-deterministic", type: "note", lecture: 7, topic: "cpa-prf", origin: "slides",
      source: "Lectures 6–7 (sample)", difficulty: 2,
      title: "Deterministic encryption is never CPA-secure",
      order: 90,
      body: R`If $\mathsf{Enc}$ is deterministic and stateless, an adversary with oracle access can encrypt $m_0$ itself and compare.

1. Query the oracle on $m_0$ and receive $c_0 = \mathsf{Enc}_k(m_0)$.
2. Output $m_0, m_1$ with $m_0 \neq m_1$, $|m_0| = |m_1|$, and receive $c = \mathsf{Enc}_k(m_b)$.
3. Output $b' = 0$ iff $c = c_0$.

By correctness $\mathsf{Enc}_k(m_1) \neq \mathsf{Enc}_k(m_0)$, so $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] = 1$. This is why **ECB** mode and $\mathsf{Enc}_k(m) = F_k(m)$ fail, and why CPA-secure schemes are randomized (CBC, CTR with a fresh random IV).`
    },

    /* ---------------- cards ---------------- */
    { id: "smp-card-prg", type: "card", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 6 (sample)", difficulty: 1,
      front: R`What two properties define a PRG $G$?`,
      back: R`**Expansion:** $|G(s)| = \ell(|s|) > |s|$. **Pseudorandomness:** for every p.p.t. $\mathcal{D}$, $\left|\Pr[\mathcal{D}(G(s)) = 1] - \Pr[\mathcal{D}(r) = 1]\right| \le \mathsf{negl}(n)$ for uniform $s \in \{0,1\}^n$, $r \in \{0,1\}^{\ell(n)}$.` },
    { id: "smp-card-kerckhoffs", type: "card", lecture: 1, topic: "principles", origin: "slides",
      source: "Lecture 1 (sample)", difficulty: 1,
      front: R`State *Kerckhoffs' principle*.`,
      back: R`The security of an encryption scheme must not rely on the secrecy of the algorithm; it should hold even if the adversary knows $\mathsf{Gen}$, $\mathsf{Enc}$ and $\mathsf{Dec}$. Only the **key** is secret.` },
    { id: "smp-card-negl", type: "card", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4 (sample)", difficulty: 1,
      front: R`When is a function $\varepsilon \colon \mathbb{N} \to \mathbb{R}_{\ge 0}$ negligible?`,
      back: R`If for every polynomial $p$ there is an $N$ such that $\varepsilon(n) < \frac{1}{p(n)}$ for all $n > N$. Example: $2^{-n}$ is negligible, $1/n^{10}$ is not.` },

    /* ---------------- true / false ---------------- */
    { id: "smp-tf-01", type: "tf", lecture: 5, topic: "prg", origin: "sample",
      source: "Sample midterm, Q1g", difficulty: 2,
      statement: R`If $G \colon \{0,1\}^n \to \{0,1\}^{2n}$ is a PRG, then $G'(x) := G(x) \| G(x)$ is also a PRG.`,
      answer: false,
      explanation: R`$\mathcal{D}$ outputs 1 iff the two halves of its input are equal. This always happens for $G'$, but only with probability $2^{-2n}$ for a uniform $4n$-bit string.` },
    { id: "smp-tf-02", type: "tf", lecture: 6, topic: "cpa-prf", origin: "variant",
      source: "Variant of a standard Q1 statement", difficulty: 2,
      statement: R`A private-key encryption scheme whose $\mathsf{Enc}$ algorithm is deterministic (and stateless) cannot be CPA-secure.`,
      answer: true,
      explanation: R`The adversary queries its oracle on $m_0$, then submits $m_0, m_1$ as challenge and outputs 0 iff the challenge equals the oracle answer; it wins with probability 1.` },
    { id: "smp-tf-03", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "variant",
      source: "Variant on the one-time pad", difficulty: 1,
      statement: R`The one-time pad remains perfectly secret when the same key is used to encrypt two messages.`,
      answer: false,
      explanation: R`From $c_1 = k \oplus m_1$ and $c_2 = k \oplus m_2$ an eavesdropper computes $c_1 \oplus c_2 = m_1 \oplus m_2$; e.g. it learns whether $m_1 = m_2$.` },

    /* ---------------- multiple choice ---------------- */
    { id: "smp-mc-01", type: "mc", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 21 (sample)", difficulty: 1,
      question: R`What is the effective key length of DES?`,
      options: [R`56 bits`, R`64 bits`, R`112 bits`, R`128 bits`],
      correct: 0,
      explanation: R`DES has a 64-bit block and a 64-bit key field of which 8 bits are parity, so the effective key length is 56 bits.` },
    { id: "smp-mc-02", type: "mc", lecture: 7, topic: "modes", origin: "variant",
      source: "Variant on modes of operation", difficulty: 1,
      question: R`Let $F$ be a PRP. Which of these modes of operation is **not** CPA-secure?`,
      options: [R`CBC mode with a uniform IV`, R`CTR mode with a uniform $\mathsf{ctr}$`, R`ECB mode`, R`OFB mode with a uniform IV`],
      correct: 2,
      explanation: R`ECB is deterministic ($c_i = F_k(m_i)$), so equal blocks give equal ciphertext blocks and the generic attack on deterministic encryption applies. The other three are CPA-secure if $F$ is a PRP (or PRF for CTR/OFB).` },
    { id: "smp-mc-03", type: "mc", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, Shannon's theorem (sample)", difficulty: 2,
      question: R`Let $\Pi$ be an encryption scheme with $|\mathcal{M}| = |\mathcal{K}| = |\mathcal{C}|$. By Shannon's theorem, $\Pi$ is perfectly secret if and only if:`,
      options: [
        R`$\mathsf{Gen}$ chooses every key with probability $1/|\mathcal{K}|$, and for all $m \in \mathcal{M}$, $c \in \mathcal{C}$ there is exactly one key $k$ with $\mathsf{Enc}_k(m) = c$.`,
        R`$\mathsf{Enc}$ is randomized.`,
        R`For all $m \in \mathcal{M}$ and $c \in \mathcal{C}$ there is at least one key $k$ with $\mathsf{Enc}_k(m) = c$.`,
        R`$|\mathcal{K}| \ge 2^{128}$.`
      ],
      correct: 0,
      explanation: R`Shannon's theorem (for $|\mathcal{M}| = |\mathcal{K}| = |\mathcal{C}|$): uniform keys **and** a unique key mapping each $m$ to each $c$. Existence of some key alone is not enough if keys are not uniform.` },

    /* ---------------- gaps ---------------- */
    { id: "smp-gap-prf", type: "gap", lecture: 6, topic: "cpa-prf", origin: "sample",
      source: "Sample midterm, Q2", difficulty: 2,
      title: "Pseudorandom function (PRF)", points: 5,
      text: R`An efficient, length-preserving, keyed function $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ is a **PRF** if for every <gap>p.p.t. distinguisher $\mathcal{D}$</gap> there exists <gap>a negligible function $\varepsilon$</gap> such that

$$\left| \Pr[\mathcal{D}^{F_k(\cdot)}(1^n) = 1] - \Pr[\mathcal{D}^{f(\cdot)}(1^n) = 1] \right| \le \varepsilon(n),$$

where $\mathcal{D}$ gets <gap>oracle access</gap> to the function, the first probability is over <gap>the uniform choice of $k \gets \{0,1\}^n$</gap> and the randomness of $\mathcal{D}$, and the second is over <gap>the uniform choice of $f \gets \mathsf{Func}_n$</gap> and the randomness of $\mathcal{D}$.`,
      note: R`$\mathsf{Func}_n$ is the set of all functions $\{0,1\}^n \to \{0,1\}^n$.` },
    { id: "smp-gap-eav", type: "gap", lecture: 4, topic: "computational", origin: "variant",
      source: "Modelled on exam Q2 (EAV-security)", difficulty: 2,
      title: "Indistinguishable encryptions in the presence of an eavesdropper", points: 5,
      text: R`The experiment $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)$:

1. $\mathcal{A}(1^n)$ outputs messages $m_0, m_1$ with <gap>$|m_0| = |m_1|$</gap>.
2. A key $k \gets \mathsf{Gen}(1^n)$ and a uniform bit $b \in \{0,1\}$ are chosen, and <gap>$c \gets \mathsf{Enc}_k(m_b)$</gap> is given to $\mathcal{A}$.
3. $\mathcal{A}$ outputs a bit $b'$; the experiment outputs 1 iff $b' = b$.

$\Pi$ is **EAV-secure** if for all <gap>p.p.t. adversaries $\mathcal{A}$</gap> there is a <gap>negligible function $\mathsf{negl}$</gap> such that for all $n$: <gap>$\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \mathsf{negl}(n)$</gap>.` },
    { id: "smp-gap-perfect", type: "gap", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2 (sample)", difficulty: 1,
      title: "Perfect secrecy", points: 3,
      text: R`An encryption scheme $(\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ with message space $\mathcal{M}$ is **perfectly secret** if for <gap>every probability distribution over $\mathcal{M}$</gap>, every message $m \in \mathcal{M}$ and every ciphertext $c \in \mathcal{C}$ with <gap>$\Pr[C = c] > 0$</gap>:

$$\Pr[M = m \mid C = c] = \Pr[M = m].$$

Equivalently, for all $m, m' \in \mathcal{M}$ and all $c \in \mathcal{C}$: <gap>$\Pr[\mathsf{Enc}_K(m) = c] = \Pr[\mathsf{Enc}_K(m') = c]$</gap>.` },

    /* ---------------- problems ---------------- */
    { id: "smp-prob-prg", type: "problem", lecture: 5, topic: "prg", origin: "variant",
      source: "Modelled on sample midterm Q3", difficulty: 3,
      title: "Repeating and truncating a PRG",
      mock: true,
      statement: R`Let $G \colon \{0,1\}^n \to \{0,1\}^{2n}$ be a PRG.`,
      parts: [
        { label: "a", points: 3,
          prompt: R`Show that $G'(s) := G(s) \| G(s)$ is **not** a PRG.`,
          hints: [R`What structure does every output of $G'$ have that a uniform $4n$-bit string almost never has?`,
                  R`Let $\mathcal{D}$ compare the two halves of its input and compute both probabilities.`],
          solution: R`$G'$ is expanding ($4n > n$), so we must break pseudorandomness. Define $\mathcal{D}$: on input $w \in \{0,1\}^{4n}$, parse $w = w_1 \| w_2$ with $|w_1| = |w_2| = 2n$ and output 1 iff $w_1 = w_2$. $\mathcal{D}$ is clearly p.p.t.

- If $w = G'(s)$ for uniform $s$, then $w_1 = w_2 = G(s)$, so $\Pr[\mathcal{D}(G'(s)) = 1] = 1$.
- If $w$ is uniform in $\{0,1\}^{4n}$, then $\Pr[w_1 = w_2] = 2^{-2n}$.

Hence $\left|\Pr[\mathcal{D}(G'(s)) = 1] - \Pr[\mathcal{D}(r) = 1]\right| = 1 - 2^{-2n}$, which is not negligible. So $G'$ is not a PRG.`,
          rubric: [ { points: 1, text: R`Distinguisher defined precisely (compare the two halves)` },
                    { points: 1, text: R`Both probabilities computed: $1$ and $2^{-2n}$` },
                    { points: 1, text: R`Conclusion: advantage $1 - 2^{-2n}$ is non-negligible` } ] },
        { label: "b", points: 3,
          prompt: R`Let $H(s)$ be the first $n+1$ bits of $G(s)$. Prove by reduction that $H$ is a PRG.`,
          hints: [R`Assume a p.p.t. $\mathcal{D}$ distinguishes $H$ with non-negligible advantage and build $\mathcal{D}'$ against $G$.`,
                  R`$\mathcal{D}'$ gets $y \in \{0,1\}^{2n}$ and runs $\mathcal{D}$ on the first $n+1$ bits of $y$. What is the distribution of those bits in each world?`],
          solution: R`Expansion holds since $n + 1 > n$. Suppose a p.p.t. $\mathcal{D}$ satisfies $\left|\Pr[\mathcal{D}(H(s)) = 1] - \Pr[\mathcal{D}(r) = 1]\right| = \varepsilon(n)$ with $\varepsilon$ non-negligible ($r \gets \{0,1\}^{n+1}$).

Define $\mathcal{D}'$: on input $y \in \{0,1\}^{2n}$, output $\mathcal{D}(y_1 \dots y_{n+1})$. It is p.p.t. since $\mathcal{D}$ is.

- If $y = G(s)$ for uniform $s$, then $y_1 \dots y_{n+1} = H(s)$, so $\Pr[\mathcal{D}'(G(s)) = 1] = \Pr[\mathcal{D}(H(s)) = 1]$.
- If $y$ is uniform in $\{0,1\}^{2n}$, its first $n+1$ bits are uniform in $\{0,1\}^{n+1}$, so $\Pr[\mathcal{D}'(y) = 1] = \Pr[\mathcal{D}(r) = 1]$.

Thus $\left|\Pr[\mathcal{D}'(G(s)) = 1] - \Pr[\mathcal{D}'(y) = 1]\right| = \varepsilon(n)$ is non-negligible, contradicting that $G$ is a PRG. Hence $H$ is a PRG.`,
          rubric: [ { points: 1, text: R`Reduction $\mathcal{D}'$ defined (runs $\mathcal{D}$ on the first $n+1$ bits), p.p.t.` },
                    { points: 1, text: R`Both worlds analysed (pseudorandom and uniform)` },
                    { points: 1, text: R`Conclusion: same advantage, contradiction to $G$ being a PRG` } ] }
      ] },
    { id: "smp-prob-fixedpad", type: "problem", lecture: 6, topic: "cpa-prf", origin: "variant",
      source: "Modelled on midterm problems on CPA-security", difficulty: 2,
      title: "A fixed pseudorandom pad",
      mock: true,
      statement: R`Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ be a PRF. Consider $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ for messages $m \in \{0,1\}^n$: $\mathsf{Gen}(1^n)$ outputs a uniform $k \in \{0,1\}^n$, and
$$\mathsf{Enc}_k(m) := F_k(0^n) \oplus m.$$`,
      parts: [
        { label: "a", points: 1,
          prompt: R`Define $\mathsf{Dec}$ and show correctness.`,
          hints: [R`XOR with the same value twice cancels.`],
          solution: R`$\mathsf{Dec}_k(c) := F_k(0^n) \oplus c$. Then $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = F_k(0^n) \oplus F_k(0^n) \oplus m = m$.`,
          rubric: [ { points: 1, text: R`Correct $\mathsf{Dec}$ and the one-line correctness argument` } ] },
        { label: "b", points: 4,
          prompt: R`Show that $\Pi$ is **not** CPA-secure by giving an adversary and computing its success probability.`,
          hints: [R`The pad $F_k(0^n)$ is the same for every encryption.`,
                  R`One oracle query on $0^n$ reveals the pad.`],
          solution: R`We show $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1]$ is not at most $\tfrac12 + \mathsf{negl}(n)$. Adversary $\mathcal{A}^{\mathsf{Enc}_k(\cdot)}(1^n)$:

1. Query the oracle on $0^n$ and receive $c' = F_k(0^n) \oplus 0^n = F_k(0^n)$.
2. Output $m_0 = 0^n$ and $m_1 = 1^n$; receive $c = F_k(0^n) \oplus m_b$.
3. Compute $c \oplus c' = m_b$ and output $b' = 0$ if $c \oplus c' = 0^n$, else $b' = 1$.

If $b = 0$ then $c \oplus c' = 0^n$ and $\mathcal{A}$ outputs 0; if $b = 1$ then $c \oplus c' = 1^n$ and $\mathcal{A}$ outputs 1. So $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] = 1 > \tfrac12 + \mathsf{negl}(n)$, and $\mathcal{A}$ is clearly p.p.t. Hence $\Pi$ is not CPA-secure.`,
          rubric: [ { points: 1, text: R`Oracle query specified ($0^n$, or any known message)` },
                    { points: 1, text: R`Challenge messages specified ($m_0 \neq m_1$, equal length)` },
                    { points: 1, text: R`Decision rule for $b'$ explained in both cases $b = 0, 1$` },
                    { points: 1, text: R`Success probability $1$ and conclusion` } ] }
      ] },
    { id: "smp-prob-otp-nonzero", type: "problem", lecture: 2, topic: "perfect-secrecy", origin: "variant",
      source: "Modelled on 'is it perfectly secret?' questions", difficulty: 2,
      title: "One-time pad without the all-zero key",
      mock: true,
      statement: R`Let $n \ge 1$ and $\mathcal{M} = \mathcal{C} = \{0,1\}^n$. $\mathsf{Gen}$ outputs a uniform key $k \in \{0,1\}^n \setminus \{0^n\}$, $\mathsf{Enc}_k(m) := k \oplus m$ and $\mathsf{Dec}_k(c) := k \oplus c$.`,
      parts: [
        { label: "a", points: 1,
          prompt: R`Show that the scheme is correct.`,
          hints: [R`Same as for the one-time pad.`],
          solution: R`$\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = k \oplus k \oplus m = m$ for every key $k$.`,
          rubric: [ { points: 1, text: R`Correctness shown` } ] },
        { label: "b", points: 3,
          prompt: R`Is the scheme perfectly secret? Justify in 2–3 sentences with explicit probabilities.`,
          hints: [R`Which ciphertext can $m$ never be encrypted to?`,
                  R`Compare $\Pr[\mathsf{Enc}_K(m) = c]$ for $m = c$ and for some $m' \neq c$.`],
          solution: R`**No.** Take $m = 0^n$, $m' = 1^n$ and $c = 0^n$. Then $\Pr[\mathsf{Enc}_K(0^n) = 0^n] = \Pr[K = 0^n] = 0$, whereas $\Pr[\mathsf{Enc}_K(1^n) = 0^n] = \Pr[K = 1^n] = \frac{1}{2^n - 1} > 0$. Since these differ, the condition $\Pr[\mathsf{Enc}_K(m) = c] = \Pr[\mathsf{Enc}_K(m') = c]$ fails, so the scheme is not perfectly secret. (Alternatively: $|\mathcal{K}| = 2^n - 1 < |\mathcal{M}|$, contradicting Shannon's bound.)`,
          rubric: [ { points: 1, text: R`Correct answer: not perfectly secret` },
                    { points: 1, text: R`Concrete $m, m', c$ chosen` },
                    { points: 1, text: R`Explicit probabilities $0$ and $\frac{1}{2^n-1}$ compared` } ] }
      ] }
  );
})();
