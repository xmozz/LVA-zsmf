(function () {
  const R = String.raw;
  const add = (...items) => (window.CRYPTO_BANK = window.CRYPTO_BANK || []).push(...items);

  // =====================================================================
  // LECTURE 6: CPA-security, PRFs, PRPs, CPA-secure encryption from a PRF
  // =====================================================================

  // ----------------------------- NOTES ---------------------------------
  add(
    { id: "l6-note-cpa", type: "note", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slides 3–6", difficulty: 1,
      title: "Chosen-plaintext attacks and the CPA experiment",
      order: 10,
      body: R`### Why a stronger notion

$\mathsf{PrivK}^{\mathsf{eav}}$ models **single-message** security against a passive eavesdropper. In practice a key encrypts many messages, and the adversary may even **influence which plaintexts get encrypted** (e.g. by making a device encrypt messages of its choice). This is not unrealistic. Recall the adversary's possible power: sees ciphertexts (one or many), has seen plaintext/ciphertext pairs, **has chosen the plaintexts**, can ask for decryptions (lecture 7). Goal of the adversary: obtain **any** information about the plaintext.

### The experiment $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)$ (slide 6)

1. The challenger samples $k \gets \mathsf{Gen}(1^n)$.
2. $\mathcal{A}$ gets $1^n$ and **oracle access to $\mathsf{Enc}_k(\cdot)$**: it may submit any $m$ and receive $\mathsf{Enc}_k(m)$, as often as it likes.
3. $\mathcal{A}$ outputs two messages $m_0, m_1$ with $|m_0| = |m_1|$.
4. The challenger samples $b \gets \{0,1\}$ and gives $c \gets \mathsf{Enc}_k(m_b)$ to $\mathcal{A}$.
5. $\mathcal{A}$ **continues to have oracle access** to $\mathsf{Enc}_k(\cdot)$.
6. $\mathcal{A}$ outputs $b'$. The experiment outputs 1 iff $b' = b$.

### Definition 3.21

$\Pi$ is **secure against chosen-plaintext attacks** (CPA-secure) if for every p.p.t. $\mathcal{A}$ there exists a negligible $\varepsilon(\cdot)$ such that
$$\Pr\bigl[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1\bigr] \le \tfrac12 + \varepsilon(n).$$

### Points that are often asked

- The oracle may be queried **before and after** the challenge, and **on $m_0$ and $m_1$ themselves**; there is no restriction.
- **CPA $\Rightarrow$ EAV:** an EAV adversary is a CPA adversary that makes no oracle queries, so every CPA-secure scheme is EAV-secure. The converse fails (e.g. the pseudo-OTP is EAV-secure but deterministic, hence not CPA-secure).` },

    { id: "l6-note-deterministic", type: "note", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slides 7, 8 and 16", difficulty: 2,
      title: "Deterministic encryption is never CPA-secure; multi-message security",
      order: 20,
      body: R`### The attack (slide 8)

Let $\Pi$ be any scheme with **deterministic** $\mathsf{Enc}$. Adversary $\mathcal{A}$:

1. Pick two distinct messages $m_0 \ne m_1$ of equal length. Query the oracle on $m_0$ and get $c_0 := \mathsf{Enc}_k(m_0)$.
2. Submit $(m_0, m_1)$ as challenge and receive $c^*$.
3. Output $b' := 0$ if $c^* = c_0$, else $b' := 1$.

If $b = 0$ then $c^* = \mathsf{Enc}_k(m_0) = c_0$ (deterministic). If $b = 1$ then $c^* = \mathsf{Enc}_k(m_1) \ne c_0$, because $c_0$ decrypts to $m_0 \ne m_1$ (correctness). So $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] = 1$.

**Only randomized (or stateful) encryption schemes can be CPA-secure.** Consequences:

- The pseudo-OTP $G(k) \oplus m$ is EAV-secure but not CPA-secure.
- Encrypting with a block cipher directly, $\mathsf{Enc}_k(m) := F_k(m)$, $\mathsf{Dec}_k(c) := F_k^{-1}(c)$ for a PRP $F$ (slide 16), is passively secure (EAV-secure, for messages of length $n$) but **not** CPA-secure, since it is deterministic. Hence we need **probabilistic** encryption.
- More generally, in a CPA-secure scheme two encryptions of the same message must differ except with negligible probability: an observer must not be able to tell that the same message was sent twice.

### Multi-message security (slide 7)

One could define a game in which the adversary gets **multiple challenge ciphertexts**: it may submit many pairs $(m_{0,i}, m_{1,i})$ and receives $\mathsf{Enc}_k(m_{b,i})$ for the **same** hidden bit $b$, while also having the encryption oracle.

**Theorem 3.23.** If a private-key encryption scheme is CPA-secure, then it is also **CPA-secure for multiple encryptions**.

So for CPA, single-challenge security already implies multi-challenge security. (For EAV this is false: the pseudo-OTP is EAV-secure but insecure for two messages under one key.)` },

    { id: "l6-note-prf", type: "note", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slides 10–13", difficulty: 2,
      title: "Pseudorandom functions (Definition 3.24)",
      order: 30,
      body: R`### Random functions

$\mathsf{Func}_n := \{ f \colon \{0,1\}^n \to \{0,1\}^n \}$. Writing $f$ down as a table takes $2^n$ entries of $n$ bits, i.e. $n \cdot 2^n$ bits; every $(n 2^n)$-bit string defines a unique function, so $|\mathsf{Func}_n| = 2^{n \cdot 2^n}$. Choosing $f \gets \mathsf{Func}_n$ uniformly is the same as choosing $f(x) \gets \{0,1\}^n$ uniformly and independently for every $x$. **Lazy sampling:** a challenger can sample $f(x)$ only when $x$ is first queried, and reuse it for repeated queries.

### Keyed functions

A **keyed function** $F \colon \{0,1\}^* \times \{0,1\}^* \to \{0,1\}^*$: the key $k$ defines $F_k(x) := F(k, x)$. **Length-preserving:** $|F(k,x)| = |k| = |x|$, so $k \in \{0,1\}^n$ defines $F_k \colon \{0,1\}^n \to \{0,1\}^n$. A PRF is an **efficient** keyed function such that, for **uniform** $k$, $F_k$ is indistinguishable from a **random function**.

### Why oracle access

For a PRG we hand the distinguisher the whole output. For a function this is impossible: the table is **exponentially big**. So the distinguisher gets **oracle access**: it submits inputs $x$ of its choice (adaptively) and receives $F_k(x)$, respectively $f(x)$.

### Definition 3.24

A keyed function $F$ is a **pseudorandom function** (PRF) if for all p.p.t. $\mathcal{D}$ there exists a negligible $\varepsilon(\cdot)$ such that
$$\Bigl|\Pr_{k \gets \{0,1\}^n}\bigl[\mathcal{D}^{F_k(\cdot)}(1^n) = 1\bigr] - \Pr_{f \gets \mathsf{Func}_n}\bigl[\mathcal{D}^{f(\cdot)}(1^n) = 1\bigr]\Bigr| \le \varepsilon(n).$$

### Why the distinguisher does not get the key

If $\mathcal{D}$ knew $k$, it could query any $x$, compute $F_k(x)$ itself and compare: always equal for the oracle $F_k$, equal only with probability $2^{-n}$ for a random $f$. No keyed function could be a PRF. The key, like a PRG seed, must stay **secret**. The function $F$ itself is public (Kerckhoffs).

### Typical traps

- A PRF need **not** be a permutation, and $F_k$ for a fixed **known** key is not random-looking.
- The distinguisher chooses its queries **adaptively** and may repeat them; a random function answers repeated queries consistently.` },

    { id: "l6-note-prf-variants", type: "note", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 13 (applied)", difficulty: 2,
      title: "Is F' a PRF? Distinguishers and reductions",
      order: 40,
      body: R`### Showing F' is NOT a PRF

Give a p.p.t. $\mathcal{D}$ **with its queries**: choose inputs so that the answers of $F'_k$ satisfy a relation that a random function satisfies only with small probability. Compute $\Pr[\mathcal{D}^{F'_k}=1]$ and $\Pr[\mathcal{D}^{f}=1]$ (here $f$ is a random function with the same input and output lengths as $F'$).

### Showing F' IS a PRF

Given a distinguisher $\mathcal{D}'$ for $F'$, build $\mathcal{D}$ with oracle $\mathcal{O}$ (either $F_k$ or $f$) that answers each query of $\mathcal{D}'$ using $\mathcal{O}$. Show: with $\mathcal{O} = F_k$, $\mathcal{D}'$ sees $F'_k$; with $\mathcal{O} = f$, $\mathcal{D}'$ sees a uniformly random function. Then the advantages are equal.

### Catalogue (F a length-preserving PRF, $\bar{x}$ = bitwise complement)

**PRFs:**

- $F'_k(x) := F_k(x) \oplus x$. Reduction answers $x$ with $\mathcal{O}(x) \oplus x$. If $f$ is uniform in $\mathsf{Func}_n$, then $g(x) := f(x) \oplus x$ is uniform in $\mathsf{Func}_n$ too, because $f \mapsto g$ is a bijection on $\mathsf{Func}_n$.
- $F'_k(x) := F_k(\bar{x})$. Reduction answers $x$ with $\mathcal{O}(\bar{x})$; $x \mapsto f(\bar{x})$ is again a uniform function.
- $F'_k(x) := F_k(x) \oplus c$ for a constant $c$, or $F_k(x)$ with output bits in a fixed permuted order.

**Not PRFs:**

- $F'_k(x) := F_k(x) \| F_k(\bar{x})$: query $x$ and $\bar{x}$ (e.g. $0^n$, $1^n$). For $F'_k$ the answers are $a\|b$ and $b\|a$ (halves swapped); for a random function with $2n$-bit outputs this happens with probability $2^{-2n}$.
- $F'_k(x) := F_k(x) \oplus F_k(\bar{x})$: then $F'_k(x) = F'_k(\bar{x})$ always. Query $0^n$ and $1^n$, output 1 iff the answers are equal; a random function gives equal answers with probability $2^{-n}$.
- $F'_k(x) := F_k(0^n) \oplus x$: query $x_1 \ne x_2$ and check $F'_k(x_1) \oplus F'_k(x_2) = x_1 \oplus x_2$ (probability $2^{-n}$ for $f$).
- $F'_k(x) :=$ $F_k(x)$ with the last bit set to 0: one query, check the last bit (probability $\tfrac12$ for $f$).` },

    { id: "l6-note-prp", type: "note", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slides 14 and 16", difficulty: 2,
      title: "Pseudorandom permutations and block ciphers",
      order: 50,
      body: R`### Keyed permutations

$\mathsf{Perm}_n \subset \mathsf{Func}_n$ is the set of permutations (bijections) of $\{0,1\}^n$. A **keyed permutation** satisfies:

- for every $k$, $F_k \colon \{0,1\}^n \to \{0,1\}^n$ is **bijective**, and
- $F_k^{-1}$ is **efficiently computable** (in addition to $F_k$).

### Pseudorandom permutation (PRP)

$F_k$ for uniform $k \gets \{0,1\}^n$ is indistinguishable from a uniform $f \gets \mathsf{Perm}_n$: for all p.p.t. $\mathcal{D}$ there exists a negligible $\varepsilon$ with
$$\Bigl|\Pr_{k \gets \{0,1\}^n}\bigl[\mathcal{D}^{F_k(\cdot)}(1^n) = 1\bigr] - \Pr_{f \gets \mathsf{Perm}_n}\bigl[\mathcal{D}^{f(\cdot)}(1^n) = 1\bigr]\Bigr| \le \varepsilon(n).$$

**Strong PRP** (Katz–Lindell, not on the slides): the same, but $\mathcal{D}$ gets oracle access to **both** $F_k$ and $F_k^{-1}$ (respectively $f$ and $f^{-1}$). This is needed when the adversary can also see inverse evaluations, e.g. decryptions.

### Block ciphers

- Block ciphers (DES, AES) are **practical constructions of PRPs**.
- They have fixed length: $F \colon \{0,1\}^n \times \{0,1\}^{\ell} \to \{0,1\}^{\ell}$ with key length $n$ and **block length** $\ell$.
- Design goal: the best distinguishing attack should take time about $2^n$, i.e. **brute force** over the keys.

### Encrypting with a PRP directly (slide 16)

$\mathsf{Enc}_k(m) := F_k(m)$, $\mathsf{Dec}_k(c) := F_k^{-1}(c)$ needs the inverse, so $F$ must be a permutation. It is passively secure (EAV-secure) but **not CPA-secure**, since it is deterministic. Fix: construct a **probabilistic** scheme (Construction 3.28). Note that Construction 3.28 only evaluates $F_k$ forwards, so a PRF suffices there.` },

    { id: "l6-note-constr328", type: "note", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slides 17 and 21", difficulty: 1,
      title: "CPA-secure encryption from a PRF (Construction 3.28)",
      order: 60,
      body: R`### Idea

Recall the pseudo-OTP: pad $= G(k)$, the same pad every time. Instead, derive a **fresh pad for every encryption** by evaluating a PRF on a **fresh random input** $r$, and send $r$ along.

### Construction 3.28

Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ be a (length-preserving) keyed function.

- $\mathsf{Gen}(1^n)$: sample $k \gets \{0,1\}^n$; return $k$.
- $\mathsf{Enc}_k(m)$ for $m \in \{0,1\}^n$: sample $r \gets \{0,1\}^n$; return $c := \langle r, F_k(r) \oplus m \rangle$.
- $\mathsf{Dec}_k(\langle r, s \rangle)$: return $m := F_k(r) \oplus s$.

**Correctness:** $F_k(r) \oplus (F_k(r) \oplus m) = m$, since $F_k$ is a deterministic function.

**Properties:**

- $r$ is **freshly chosen for every encryption**, so encryption is **probabilistic**: the same $m$ gives different ciphertexts.
- Ciphertexts are $2n$ bits for $n$-bit messages ($r$ is sent in the clear; it is not secret).
- Only $F_k$ is evaluated (never $F_k^{-1}$), so a PRF suffices.

### Theorem 3.29

If $F$ is a pseudorandom function, then Construction 3.28 is a **CPA-secure** private-key encryption scheme for messages of length $n$. More precisely, for every p.p.t. $\mathcal{A}$ making at most $q(n)$ queries,
$$\Pr\bigl[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1\bigr] \le \tfrac12 + \varepsilon(n) + \frac{q(n)}{2^n}.$$

### Why it fails if $r$ is not fresh

If $r$ repeats (e.g. fixed $r$, or $r$ from a small set), two ciphertexts share the pad $F_k(r)$ and $s \oplus s' = m \oplus m'$: an adversary that obtains an oracle ciphertext with the same $r$ as the challenge learns $m_b$.` },

    { id: "l6-note-proof329", type: "note", lecture: 6, topic: "reductions", origin: "slides",
      source: "Lecture 6, slides 19–22", difficulty: 3,
      title: "Proof of Theorem 3.29 (Construction 3.28 is CPA-secure), step by step",
      order: 70,
      body: R`### 1. Assumption

$F$ is a PRF: for every p.p.t. $\mathcal{D}$ there is a negligible $\varepsilon$ with
$$\Bigl|\Pr_{k \gets \{0,1\}^n}\bigl[\mathcal{D}^{F_k(\cdot)}(1^n) = 1\bigr] - \Pr_{f \gets \mathsf{Func}_n}\bigl[\mathcal{D}^{f(\cdot)}(1^n) = 1\bigr]\Bigr| \le \varepsilon(n).$$

### 2. The reduction $\mathcal{D}$ (uses $\mathcal{A}$)

$\mathcal{D}$ has oracle access to $\mathcal{O}$, which is either $F_k$ ($k \gets \{0,1\}^n$) or $f \gets \mathsf{Func}_n$. It runs $\mathcal{A}(1^n)$ and plays the CPA challenger:

- **Encryption query** $m$: sample $r \gets \{0,1\}^n$, query $y := \mathcal{O}(r)$, return $c := \langle r, y \oplus m \rangle$.
- **Challenge query** $m_0, m_1$: sample $r^* \gets \{0,1\}^n$ and $b \gets \{0,1\}$, query $y^* := \mathcal{O}(r^*)$, return $c^* := \langle r^*, y^* \oplus m_b \rangle$.
- When $\mathcal{A}$ outputs $b'$: output $\beta := 1$ iff $b' = b$.

$\mathcal{A}$ p.p.t. $\Rightarrow$ $\mathcal{D}$ p.p.t. (one oracle query and one XOR per query of $\mathcal{A}$).

### 3. Case $\mathcal{O} = F_k$

All ciphertexts are computed exactly as by $\mathsf{Enc}_k$ with a uniform key, so $\mathcal{D}$ simulates $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}$ perfectly:
$$\Pr_k\bigl[\mathcal{D}^{F_k(\cdot)} = 1\bigr] = \Pr\bigl[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1\bigr].$$

### 4. Case $\mathcal{O} = f$ (ideal game)

Now each pad $f(r)$ is uniform for every new $r$. The challenge is $c^* = \langle r^*, f(r^*) \oplus m_b \rangle$. Is the winning probability $\tfrac12$? Only if $f(r^*)$ is **never used elsewhere**: if $r^*$ is also chosen in some encryption query on $m$ with answer $\langle r^*, s \rangle$, then $s \oplus (f(r^*) \oplus m_b) = m \oplus m_b$ and $\mathcal{A}$ learns $m_b$.

Let $R$ ("repeat") be the event that $r^*$ equals the $r_i$ of some encryption query, and let $q(n)$ be a polynomial upper bound on the number of queries. Each $r_i$ is uniform and independent of $r^*$, and the $r_i$ cover at most $q(n)$ points of $\{0,1\}^n$, so by the union bound
$$\Pr[R] \le \frac{q(n)}{2^n}.$$
If $R$ does not occur, $f(r^*)$ is a fresh uniform value that appears only in $c^*$, so $c^*$ is a one-time pad encryption of $m_b$ and $\Pr[\mathcal{D}^{f} = 1 \mid \overline{R}] = \tfrac12$. Hence
$$\Pr_f\bigl[\mathcal{D}^{f(\cdot)} = 1\bigr] = \Pr_f\bigl[\mathcal{D}^{f(\cdot)} = 1 \wedge R\bigr] + \Pr_f\bigl[\mathcal{D}^{f(\cdot)} = 1 \wedge \overline{R}\bigr] \le \Pr[R] + \Pr_f\bigl[\mathcal{D}^{f(\cdot)} = 1 \mid \overline{R}\bigr] \le \frac{q(n)}{2^n} + \frac12.$$

### 5. Putting everything together

$$\Pr\bigl[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1\bigr] = \Pr_k\bigl[\mathcal{D}^{F_k(\cdot)} = 1\bigr] \le \Pr_f\bigl[\mathcal{D}^{f(\cdot)} = 1\bigr] + \varepsilon(n) \le \frac12 + \underbrace{\varepsilon(n) + \frac{q(n)}{2^n}}_{=:\ \varepsilon'(n)}.$$
$\varepsilon'$ is negligible: $\varepsilon$ is negligible and $q(n) \cdot 2^{-n}$ is a polynomial times a negligible function. So $\Pi$ is CPA-secure. $\square$

### Proof idea in one sentence

Real game $\approx$ ideal game (by PRF security, difference $\le \varepsilon(n)$); in the ideal game $\mathcal{A}$ can only win beyond $\tfrac12$ if the challenge randomness $r^*$ collides with an oracle query, which happens with probability $\le q(n)/2^n$.` },

    { id: "l6-note-exam-attack-template", type: "note", lecture: 6, topic: "reductions", origin: "slides",
      source: "Lecture 6, slides 8 and 20 (exam template)", difficulty: 3,
      title: "How to show a scheme is NOT secure in the exam",
      order: 80,
      body: R`Use this skeleton for "Show that $\Pi$ is not EAV-/CPA-secure" (and analogously "show $G'$ is not a PRG", "show $F'$ is not a PRF").

### Step 1: State the definition you violate

"$\Pi$ is CPA-secure if for every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)=1] \le \tfrac12 + \varepsilon(n)$. We give a p.p.t. $\mathcal{A}$ with success probability $\tfrac12 + $ (non-negligible)."

### Step 2: Define the adversary, specifying every value

1. Oracle queries (CPA only): "Query $\mathsf{Enc}_k(\cdot)$ on $m := 0^n$ and receive $c = \dots$".
2. Challenge: "Output $m_0 := 0^n$ and $m_1 := 1^n$" (concrete, distinct, **same length**).
3. Decision rule: "Output $b' := 0$ iff [explicit, efficiently checkable condition], else $b' := 1$."

Never write "choose suitable messages": the graders want concrete values.

### Step 3: Compute what the challenger returns in both cases

- $b = 0$: write out $c^*$ and show the condition holds (with which probability).
- $b = 1$: write out $c^*$ and show the condition fails (with which probability).

### Step 4: Compute the success probability

$$\Pr[\mathsf{PrivK}_{\mathcal{A},\Pi}(n)=1] = \tfrac12 \Pr[b'=0 \mid b=0] + \tfrac12 \Pr[b'=1 \mid b=1].$$
Show it is $\ge \tfrac12 + \delta$ with $\delta$ non-negligible (a constant like $\tfrac12$ or $\tfrac1{512}$, or $1 - 2^{-n}$...). Also note that $\mathcal{A}$ is p.p.t.

### Standard attack patterns

- **Deterministic encryption** (CPA): query $m_0$, challenge $(m_0, m_1)$, compare $c^*$ with the oracle answer.
- **Reused pad / randomness** (even EAV): two blocks or two messages share the same pad $\Rightarrow$ XOR of ciphertext parts = XOR of message parts. Choose messages whose parts are equal in $m_0$ but different in $m_1$.
- **Predictable or small-range randomness** (CPA): query until the oracle reuses the challenge randomness $r^*$; then the pad is known.
- **Leaky counter / state** (CPA): if the counter used in the challenge can be predicted or was already used by an oracle query, reuse that pad.
- **Length or structure leaks**: lengths, parity bits, fixed bits that depend on the message.

### For distinguishers (PRG/PRF)

Same structure: define $\mathcal{D}$ (its queries for a PRF), compute $\Pr[\mathcal{D}=1]$ in the real world (usually 1) and in the random world (usually $2^{-n}$ or $\tfrac12$), conclude that the difference is non-negligible.` },
  );

  // ----------------------------- CARDS ---------------------------------
  add(
    { id: "l6-card-01", type: "card", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 6", difficulty: 1,
      front: R`What can the adversary do in $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)$ that it cannot do in $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)$?`,
      back: R`It has **oracle access to $\mathsf{Enc}_k(\cdot)$** before and after receiving the challenge: it can obtain encryptions of any messages of its choice under the same key.` },
    { id: "l6-card-02", type: "card", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 6", difficulty: 1,
      front: R`State Definition 3.21 (CPA-security).`,
      back: R`$\Pi$ is secure against chosen-plaintext attacks if for every p.p.t. $\mathcal{A}$ there exists a negligible $\varepsilon$ such that $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$.` },
    { id: "l6-card-03", type: "card", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 8", difficulty: 2,
      front: R`Give the CPA attack on any deterministic encryption scheme.`,
      back: R`Query the oracle on $m_0$, get $c_0$. Challenge with $(m_0, m_1)$, $m_1 \ne m_0$, get $c^*$. Output $0$ iff $c^* = c_0$. Success probability 1, since $\mathsf{Enc}_k(m_0) = c_0$ and $\mathsf{Enc}_k(m_1) \ne c_0$ by correctness.` },
    { id: "l6-card-04", type: "card", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 7", difficulty: 1,
      front: R`What does Theorem 3.23 say?`,
      back: R`If a private-key encryption scheme is CPA-secure, then it is also CPA-secure for **multiple encryptions** (the adversary may get many challenge ciphertexts for the same bit $b$).` },
    { id: "l6-card-05", type: "card", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 10", difficulty: 1,
      front: R`What is $\mathsf{Func}_n$, how many bits describe one element, and how large is it?`,
      back: R`The set of all functions $\{0,1\}^n \to \{0,1\}^n$. A function is a table of $2^n$ entries of $n$ bits: $n \cdot 2^n$ bits. Hence $|\mathsf{Func}_n| = 2^{n \cdot 2^n}$.` },
    { id: "l6-card-06", type: "card", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slides 10 and 13", difficulty: 2,
      front: R`What is "lazy sampling" of $f \gets \mathsf{Func}_n$?`,
      back: R`Choosing $f$ uniformly is the same as choosing each $f(x) \gets \{0,1\}^n$ independently. So the challenger can pick $f(x)$ uniformly only when $x$ is queried for the first time, and store it to answer repeated queries consistently.` },
    { id: "l6-card-07", type: "card", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 11", difficulty: 1,
      front: R`What is a keyed function, and when is it length-preserving?`,
      back: R`$F \colon \{0,1\}^* \times \{0,1\}^* \to \{0,1\}^*$; key $k$ defines $F_k(x) := F(k,x)$. Length-preserving: $|F(k,x)| = |k| = |x|$, so $k \in \{0,1\}^n$ gives $F_k \colon \{0,1\}^n \to \{0,1\}^n$.` },
    { id: "l6-card-08", type: "card", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 12", difficulty: 2,
      front: R`Why does a PRF distinguisher get oracle access instead of the function as input?`,
      back: R`The function table has $n \cdot 2^n$ bits, exponentially big, so a p.p.t. distinguisher could not even read it. Instead it adaptively queries inputs $x$ and gets $F_k(x)$ or $f(x)$.` },
    { id: "l6-card-09", type: "card", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 13", difficulty: 2,
      front: R`Why can the key not be given to the PRF distinguisher?`,
      back: R`With $k$, $\mathcal{D}$ queries some $x$ and checks whether the answer equals $F_k(x)$: always true for $F_k$, true with probability $2^{-n}$ for a random $f$. No keyed function would be a PRF.` },
    { id: "l6-card-10", type: "card", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 14", difficulty: 1,
      front: R`What makes a keyed function a keyed permutation, and when is it a PRP?`,
      back: R`Keyed permutation: every $F_k$ is a bijection on $\{0,1\}^n$ and $F_k^{-1}$ is efficiently computable. PRP: for uniform $k \gets \{0,1\}^n$, $F_k$ is indistinguishable (oracle access, p.p.t. $\mathcal{D}$) from a uniform $f \gets \mathsf{Perm}_n$.` },
    { id: "l6-card-11", type: "card", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 14 (KL §3.5.1)", difficulty: 2,
      front: R`What is a strong PRP?`,
      back: R`(Katz–Lindell, not on the slides.) A keyed permutation that is indistinguishable from a uniform permutation even when the distinguisher has oracle access to **both** $F_k$ and $F_k^{-1}$ (respectively $f$ and $f^{-1}$).` },
    { id: "l6-card-12", type: "card", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 14", difficulty: 1,
      front: R`How do block ciphers relate to PRPs, and what is their security goal?`,
      back: R`Block ciphers are practical constructions of PRPs, with fixed lengths $F \colon \{0,1\}^n \times \{0,1\}^\ell \to \{0,1\}^\ell$ ($n$ = key length, $\ell$ = block length). The best distinguishing attack should take time about $2^n$ (brute force).` },
    { id: "l6-card-13", type: "card", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 17", difficulty: 1,
      front: R`State Construction 3.28.`,
      back: R`$F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$. $\mathsf{Gen}$: $k \gets \{0,1\}^n$. $\mathsf{Enc}_k(m)$: $r \gets \{0,1\}^n$, return $\langle r, F_k(r) \oplus m \rangle$. $\mathsf{Dec}_k(\langle r, s \rangle) := F_k(r) \oplus s$.` },
    { id: "l6-card-14", type: "card", lecture: 6, topic: "reductions", origin: "slides",
      source: "Lecture 6, slide 19", difficulty: 2,
      front: R`In the proof of Theorem 3.29, how does $\mathcal{D}$ answer an encryption query $m$ and the challenge $m_0, m_1$?`,
      back: R`Query $m$: pick $r \gets \{0,1\}^n$, ask the oracle for $y = \mathcal{O}(r)$, return $\langle r, y \oplus m \rangle$. Challenge: pick $r^* \gets \{0,1\}^n$ and $b \gets \{0,1\}$, get $y^* = \mathcal{O}(r^*)$, return $\langle r^*, y^* \oplus m_b \rangle$. Finally output 1 iff $b' = b$.` },
    { id: "l6-card-15", type: "card", lecture: 6, topic: "reductions", origin: "slides",
      source: "Lecture 6, slide 20", difficulty: 2,
      front: R`What is the event $R$ in the proof of Theorem 3.29, and how is it bounded?`,
      back: R`$R$ ("repeat"): the challenge randomness $r^*$ is also used in one of $\mathcal{A}$'s encryption queries. With at most $q(n)$ queries, each $r_i$ uniform: $\Pr[R] \le q(n)/2^n$.` },
    { id: "l6-card-16", type: "card", lecture: 6, topic: "reductions", origin: "slides",
      source: "Lecture 6, slides 20–21", difficulty: 2,
      front: R`What is the final bound in the proof of Theorem 3.29?`,
      back: R`$\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)=1] = \Pr[\mathcal{D}^{F_k}=1] \le \Pr[\mathcal{D}^f = 1] + \varepsilon(n) \le \tfrac12 + \varepsilon(n) + q(n)/2^n$, and $\varepsilon'(n) := \varepsilon(n) + q(n) 2^{-n}$ is negligible.` },
  );

  // ------------------------------ TF -----------------------------------
  add(
    { id: "l6-tf-01", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 8", difficulty: 1,
      statement: R`No encryption scheme with a deterministic (and stateless) encryption algorithm is CPA-secure.`,
      answer: true,
      explanation: R`$\mathcal{A}$ queries $m_0$, gets $c_0$, challenges with $(m_0, m_1)$ and outputs 0 iff $c^* = c_0$. This wins with probability 1.` },
    { id: "l6-tf-02", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slides 3–6", difficulty: 1,
      statement: R`Every CPA-secure encryption scheme is also EAV-secure.`,
      answer: true,
      explanation: R`An EAV adversary is a CPA adversary that never uses its encryption oracle, and for such an adversary the two experiments coincide.` },
    { id: "l6-tf-03", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slides 8 and 16", difficulty: 1,
      statement: R`Every EAV-secure encryption scheme is also CPA-secure.`,
      answer: false,
      explanation: R`The pseudo-OTP is EAV-secure (Theorem 3.16) but deterministic, so the standard query-then-compare attack breaks CPA-security.` },
    { id: "l6-tf-04", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 16", difficulty: 1,
      statement: R`If $F$ is a pseudorandom permutation, then $\mathsf{Enc}_k(m) := F_k(m)$, $\mathsf{Dec}_k(c) := F_k^{-1}(c)$ is CPA-secure.`,
      answer: false,
      explanation: R`The scheme is deterministic: query $m_0$, then challenge $(m_0, m_1)$ and compare $c^*$ with $F_k(m_0)$. It is only passively (EAV-)secure.` },
    { id: "l6-tf-05", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 16", difficulty: 2,
      statement: R`If $F$ is a pseudorandom permutation, then $\mathsf{Enc}_k(m) := F_k(m)$ for $m \in \{0,1\}^n$ is EAV-secure.`,
      answer: true,
      explanation: R`The slide calls it passively secure. Replacing $F_k$ by a uniform permutation $f$ costs only a negligible amount, and then $f(m_b)$ is a uniform string independent of $b$, so a single ciphertext reveals nothing.` },
    { id: "l6-tf-06", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 7", difficulty: 1,
      statement: R`A CPA-secure private-key encryption scheme is also CPA-secure for multiple encryptions.`,
      answer: true,
      explanation: R`This is Theorem 3.23: for CPA, single-challenge security implies security when the adversary receives many challenge ciphertexts.` },
    { id: "l6-tf-07", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 6", difficulty: 1,
      statement: R`In $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)$, the adversary can query its encryption oracle only before it outputs $m_0, m_1$.`,
      answer: false,
      explanation: R`$\mathcal{A}$ has oracle access to $\mathsf{Enc}_k(\cdot)$ both before and after it receives the challenge ciphertext.` },
    { id: "l6-tf-08", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 6", difficulty: 2,
      statement: R`In $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)$, the adversary is allowed to query its encryption oracle on $m_0$ and on $m_1$.`,
      answer: true,
      explanation: R`There is no restriction on the oracle queries. This is exactly what the attack on deterministic schemes uses; a secure scheme must be randomized so that these queries do not help.` },
    { id: "l6-tf-09", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 10", difficulty: 1,
      statement: R`The set $\mathsf{Func}_n$ of all functions $\{0,1\}^n \to \{0,1\}^n$ has exactly $2^{n \cdot 2^n}$ elements.`,
      answer: true,
      explanation: R`A function is a table of $2^n$ entries with $n$ bits each, and every $(n 2^n)$-bit string defines a unique function: $(2^n)^{2^n} = 2^{n 2^n}$.` },
    { id: "l6-tf-10", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 13", difficulty: 1,
      statement: R`In the PRF security definition, the distinguisher $\mathcal{D}$ is given the key $k$ and oracle access to either $F_k$ or a random function $f$.`,
      answer: false,
      explanation: R`$\mathcal{D}$ gets only $1^n$ and oracle access. With the key it could compute $F_k(x)$ itself and compare with the oracle's answer, so no keyed function would be a PRF.` },
    { id: "l6-tf-11", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 12", difficulty: 1,
      statement: R`In the PRF security definition, the distinguisher receives the complete function table of $F_k$ (or of $f$) as its input.`,
      answer: false,
      explanation: R`The table has $n \cdot 2^n$ bits, exponentially large. The distinguisher only gets oracle access: it queries inputs of its choice.` },
    { id: "l6-tf-12", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 13 (applied)", difficulty: 2,
      statement: R`If $F$ is a length-preserving PRF, then $F'_k(x) := F_k(x) \oplus x$ is also a PRF.`,
      answer: true,
      explanation: R`The reduction answers $\mathcal{D}'$'s query $x$ with $\mathcal{O}(x) \oplus x$. If $\mathcal{O} = f$ is uniform in $\mathsf{Func}_n$, then $x \mapsto f(x) \oplus x$ is uniform in $\mathsf{Func}_n$ too ($f \mapsto f \oplus \mathrm{id}$ is a bijection), so the advantages are equal.` },
    { id: "l6-tf-13", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 13 (applied)", difficulty: 2,
      statement: R`If $F$ is a length-preserving PRF, then $F'_k(x) := F_k(x) \| F_k(\bar{x})$, where $\bar{x}$ is the bitwise complement of $x$, is also a PRF.`,
      answer: false,
      explanation: R`Query $0^n$ and $1^n$: for $F'_k$ the answers are $a\|b$ and $b\|a$. $\mathcal{D}$ outputs 1 iff the halves are swapped; for a random function with $2n$-bit outputs this happens with probability $2^{-2n}$.` },
    { id: "l6-tf-14", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 13 (applied)", difficulty: 2,
      statement: R`If $F$ is a length-preserving PRF, then $F'_k(x) := F_k(x) \oplus F_k(\bar{x})$ is also a PRF.`,
      answer: false,
      explanation: R`$F'_k(x) = F'_k(\bar{x})$ for every $x$. $\mathcal{D}$ queries $0^n$ and $1^n$ and outputs 1 iff the answers are equal: probability 1 for $F'_k$, $2^{-n}$ for a random function.` },
    { id: "l6-tf-15", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 13 (applied)", difficulty: 2,
      statement: R`If $F$ is a length-preserving PRF, then $F'_k(x) := F_k(\bar{x})$ is also a PRF.`,
      answer: true,
      explanation: R`The reduction answers query $x$ with $\mathcal{O}(\bar{x})$. For a uniform $f$, $x \mapsto f(\bar{x})$ is again a uniform function (complementing permutes the inputs), so the advantages are equal.` },
    { id: "l6-tf-16", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 13 (applied)", difficulty: 2,
      statement: R`If $F$ is a length-preserving PRF, then $F'_k(x) := F_k(0^n) \oplus x$ is also a PRF.`,
      answer: false,
      explanation: R`Query $0^n$ and $1^n$: the answers XOR to $1^n$ for $F'_k$, but only with probability $2^{-n}$ for a random function.` },
    { id: "l6-tf-17", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 13", difficulty: 1,
      statement: R`For a PRF $F$, every function $F_k$ must be a bijection on $\{0,1\}^n$.`,
      answer: false,
      explanation: R`A PRF is compared with a random function from $\mathsf{Func}_n$, which is usually not a permutation. Bijectivity (and an efficient inverse) is required only for keyed permutations/PRPs.` },
    { id: "l6-tf-18", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 21", difficulty: 1,
      statement: R`If $F$ is a PRF, then Construction 3.28, $\mathsf{Enc}_k(m) := \langle r, F_k(r) \oplus m \rangle$ with fresh $r \gets \{0,1\}^n$, is CPA-secure for messages of length $n$.`,
      answer: true,
      explanation: R`This is Theorem 3.29. The adversary's success is at most $\tfrac12 + \varepsilon(n) + q(n)/2^n$, where $\varepsilon$ comes from PRF security and $q(n)/2^n$ bounds a repeat of the challenge randomness.` },
    { id: "l6-tf-19", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 17 (applied)", difficulty: 2,
      statement: R`Construction 3.28 remains CPA-secure if $r$ is fixed to $0^n$ instead of being sampled fresh for every encryption.`,
      answer: false,
      explanation: R`Then $\mathsf{Enc}_k$ is deterministic ($\langle 0^n, F_k(0^n) \oplus m \rangle$), and deterministic schemes are never CPA-secure: query $m_0$ and compare with the challenge.` },
    { id: "l6-tf-20", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slides 16–17", difficulty: 2,
      statement: R`Construction 3.28 requires $F$ to be a pseudorandom permutation, because decryption must invert $F_k$.`,
      answer: false,
      explanation: R`Decryption computes $F_k(r) \oplus s$, i.e. it evaluates $F_k$ forwards on $r$. No inverse is needed, so a PRF suffices.` },
    { id: "l6-tf-21", type: "tf", lecture: 6, topic: "reductions", origin: "slides",
      source: "Lecture 6, slide 20", difficulty: 2,
      statement: R`In the proof of Theorem 3.29, if $\mathcal{A}$ makes at most $q(n)$ encryption queries, the probability that the challenge randomness $r^*$ equals the randomness of some encryption query is at most $q(n)/2^n$.`,
      answer: true,
      explanation: R`Each $r_i$ is uniform in $\{0,1\}^n$ and independent of $r^*$, so $\Pr[r_i = r^*] = 2^{-n}$; the union bound over at most $q(n)$ queries gives $q(n)/2^n$.` },
    { id: "l6-tf-22", type: "tf", lecture: 6, topic: "reductions", origin: "slides",
      source: "Lecture 6, slide 20", difficulty: 2,
      statement: R`In the proof of Theorem 3.29, when the oracle is a random function $f$ and the challenge randomness $r^*$ is not used in any encryption query, $\mathcal{A}$ guesses $b$ correctly with probability exactly $\tfrac12$.`,
      answer: true,
      explanation: R`Then $f(r^*)$ is a uniform value that appears nowhere else, so $f(r^*) \oplus m_b$ is a one-time pad encryption and $\mathcal{A}$'s view is independent of $b$.` },
    { id: "l6-tf-23", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 8 (applied)", difficulty: 3,
      statement: R`If $\Pi$ is CPA-secure with message space $\{0,1\}^n$, then two independent encryptions of $0^n$ under the same key are equal with at most negligible probability.`,
      answer: true,
      explanation: R`Otherwise let $p(n)$ be that non-negligible probability: query $0^n$ to get $c$, challenge with $(0^n, 1^n)$, output 0 iff $c^* = c$. For $b=1$, $c^* \ne c$ by correctness, so the success probability is $\tfrac12 + p(n)/2$.` },
    { id: "l6-tf-24", type: "tf", lecture: 6, topic: "reductions", origin: "slides",
      source: "Lecture 6, slide 19", difficulty: 2,
      statement: R`In the proof of Theorem 3.29, the reduction $\mathcal{D}$ needs to know the PRF key $k$ to answer $\mathcal{A}$'s encryption queries.`,
      answer: false,
      explanation: R`$\mathcal{D}$ answers query $m$ by choosing $r$, asking its oracle for $\mathcal{O}(r)$ and returning $\langle r, \mathcal{O}(r) \oplus m \rangle$. It never knows $k$; that is what lets it use $\mathcal{A}$ against the PRF.` },
  );

  // ------------------------------ MC -----------------------------------
  add(
    { id: "l6-mc-01", type: "mc", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 6", difficulty: 1,
      question: R`When does $\mathcal{A}$ have access to the encryption oracle in $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)$?`,
      options: [R`Never`, R`Only before outputting $m_0, m_1$`, R`Only after receiving the challenge`, R`Both before and after receiving the challenge`],
      correct: 3,
      explanation: R`Definition 3.21: $\mathcal{A}$ has oracle access to $\mathsf{Enc}_k(\cdot)$ throughout the experiment.` },
    { id: "l6-mc-02", type: "mc", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slides 8 and 16", difficulty: 2,
      question: R`Which scheme is EAV-secure but **not** CPA-secure (under the usual assumptions)?`,
      options: [R`Construction 3.28 with a PRF`, R`The pseudo one-time pad with a PRG`, R`The one-time pad used for a single message`, R`None: EAV-security implies CPA-security`],
      correct: 1,
      explanation: R`The pseudo-OTP is EAV-secure by Theorem 3.16 but deterministic, so it is broken by a CPA adversary. Construction 3.28 is CPA-secure.` },
    { id: "l6-mc-03", type: "mc", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 10", difficulty: 1,
      question: R`How many bits does it take to write down an arbitrary $f \in \mathsf{Func}_n$?`,
      options: [R`$n$`, R`$2^n$`, R`$n \cdot 2^n$`, R`$2^{n \cdot 2^n}$`],
      correct: 2,
      explanation: R`$2^n$ table entries of $n$ bits each. $2^{n \cdot 2^n}$ is the number of such functions, not the description length.` },
    { id: "l6-mc-04", type: "mc", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 13 (applied)", difficulty: 2,
      question: R`Let $F$ be a length-preserving PRF and $\bar{x}$ the bitwise complement. Which $F'$ is a PRF?`,
      options: [R`$F'_k(x) := F_k(x) \oplus F_k(\bar{x})$`, R`$F'_k(x) := F_k(x) \oplus x$`, R`$F'_k(x) := F_k(0^n) \oplus x$`, R`$F'_k(x) := F_k(x) \| F_k(\bar{x})$`],
      correct: 1,
      explanation: R`For $F_k(x) \oplus x$ the reduction answers $x$ with $\mathcal{O}(x) \oplus x$, and $f(x) \oplus x$ is a uniform function when $f$ is. The others have checkable relations between the answers on $0^n$ and $1^n$.` },
    { id: "l6-mc-05", type: "mc", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 14", difficulty: 1,
      question: R`What does a keyed permutation require **in addition** to a keyed function?`,
      options: [R`That $F_k$ is a bijection and $F_k^{-1}$ is efficiently computable`, R`That the key is longer than the block`, R`That $F_k(x) \ne x$ for all $x$`, R`That $F$ is a PRF`],
      correct: 0,
      explanation: R`Slide 14: for every $k$, $F_k$ is bijective, and $F_k^{-1}$ is efficiently computable in addition to $F_k$.` },
    { id: "l6-mc-06", type: "mc", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 17", difficulty: 1,
      question: R`In Construction 3.28, how long is the ciphertext of an $n$-bit message?`,
      options: [R`$n$ bits`, R`$n+1$ bits`, R`$2n$ bits`, R`$n \cdot 2^n$ bits`],
      correct: 2,
      explanation: R`$c = \langle r, F_k(r) \oplus m \rangle$ consists of the $n$-bit randomness $r$ and the $n$-bit masked message.` },
    { id: "l6-mc-07", type: "mc", lecture: 6, topic: "reductions", origin: "slides",
      source: "Lecture 6, slides 21–22", difficulty: 2,
      question: R`Which bound on $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)=1]$ does the proof of Theorem 3.29 give ($\mathcal{A}$ makes at most $q(n)$ queries, $\varepsilon$ from PRF security)?`,
      options: [R`$\tfrac12 + \varepsilon(n)$`, R`$\tfrac12 + \varepsilon(n) + q(n)/2^n$`, R`$\tfrac12 + q(n) \cdot \varepsilon(n)$`, R`$\tfrac12 + \varepsilon(n) \cdot q(n)/2^n$`],
      correct: 1,
      explanation: R`$\varepsilon(n)$ is the cost of replacing $F_k$ by $f$; $q(n)/2^n$ bounds the probability of the repeat event $R$; otherwise the adversary has exactly $\tfrac12$.` },
    { id: "l6-mc-08", type: "mc", lecture: 6, topic: "reductions", origin: "slides",
      source: "Lecture 6, slide 20", difficulty: 2,
      question: R`In the ideal game of the proof of Theorem 3.29, why could $\mathcal{A}$ win if $r^*$ is also used in an encryption query on $m$ with answer $\langle r^*, s \rangle$?`,
      options: [R`Because then $\mathcal{A}$ learns the key $k$`, R`Because $s \oplus (f(r^*) \oplus m_b) = m \oplus m_b$ reveals $m_b$`, R`Because $f$ is then a permutation`, R`It could not: the ideal game always gives exactly $\tfrac12$`],
      correct: 1,
      explanation: R`Both ciphertexts use the same pad $f(r^*)$, so XORing the second components cancels it and leaves $m \oplus m_b$; $\mathcal{A}$ knows $m$, hence learns $m_b$.` },
  );

  // ------------------------------ GAP ----------------------------------
  add(
    { id: "l6-gap-cpa", type: "gap", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 6 (Definition 3.21)", difficulty: 2,
      title: "CPA-security", points: 5,
      text: R`A private-key encryption scheme $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ is CPA-secure if for every p.p.t. adversary $\mathcal{A}$ there exists a negligible function $\varepsilon$ such that $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] \le$ <gap>$\tfrac12 + \varepsilon(n)$</gap>, where the experiment $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)$ is defined as follows:

1. A key $k \gets \mathsf{Gen}(1^n)$ is generated.
2. $\mathcal{A}$ is given $1^n$ and <gap>oracle access to $\mathsf{Enc}_k(\cdot)$</gap>.
3. $\mathcal{A}$ outputs a pair of messages $m_0, m_1$ <gap>with $|m_0| = |m_1|$</gap>.
4. A bit $b \gets \{0,1\}$ is sampled and the challenge ciphertext $c \gets \mathsf{Enc}_k(m_b)$ is given to $\mathcal{A}$.
5. $\mathcal{A}$ <gap>continues to have oracle access to $\mathsf{Enc}_k(\cdot)$</gap> and outputs a bit $b'$.
6. The output of the experiment is 1 if and only if <gap>$b' = b$</gap>.`,
      note: R`Compared with $\mathsf{PrivK}^{\mathsf{eav}}$, the only change is the encryption oracle in steps 2 and 5.` },
    { id: "l6-gap-prp", type: "gap", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 14", difficulty: 2,
      title: "Pseudorandom permutation (PRP)", points: 5,
      text: R`A keyed function $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ is a keyed permutation if for every $k$ the function $F_k$ is <gap>a bijection on $\{0,1\}^n$</gap> and <gap>$F_k^{-1}$ is efficiently computable</gap>. It is a pseudorandom permutation if for every <gap>p.p.t. distinguisher $\mathcal{D}$</gap> there exists a negligible function $\varepsilon$ such that
$$\Bigl|\Pr\bigl[\mathcal{D}^{F_k(\cdot)}(1^n) = 1\bigr] - \Pr\bigl[\mathcal{D}^{f(\cdot)}(1^n) = 1\bigr]\Bigr| \le \varepsilon(n),$$
where the first probability is over <gap>a uniform key $k \gets \{0,1\}^n$</gap> and the second over <gap>a uniform permutation $f \gets \mathsf{Perm}_n$</gap>.`,
      note: R`$\mathsf{Perm}_n \subset \mathsf{Func}_n$ is the set of all permutations of $\{0,1\}^n$. For a strong PRP, $\mathcal{D}$ additionally gets the inverse oracle.` },
    { id: "l6-gap-constr328", type: "gap", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slides 17 and 21", difficulty: 2,
      title: "CPA-secure encryption from a PRF (Construction 3.28)", points: 5,
      text: R`Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ be a keyed function. $\mathsf{Gen}(1^n)$ samples $k \gets \{0,1\}^n$. $\mathsf{Enc}_k(m)$ for $m \in \{0,1\}^n$ samples <gap>a fresh uniform $r \gets \{0,1\}^n$</gap> and returns <gap>$c := \langle r, F_k(r) \oplus m \rangle$</gap>. $\mathsf{Dec}_k(\langle r, s \rangle)$ returns <gap>$m := F_k(r) \oplus s$</gap>. Theorem 3.29: if $F$ is <gap>a pseudorandom function</gap>, then the scheme is <gap>CPA-secure</gap> for messages of length $n$.` },
  );

  // ---------------------------- PROBLEMS -------------------------------
  add(
    { id: "l6-prob-prf-variants", type: "problem", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 13 (exam-style variant)", difficulty: 3,
      title: "Is F' a PRF? Two distinguishers and a reduction",
      mock: true,
      statement: R`Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ be a pseudorandom function. For $x \in \{0,1\}^n$ let $\bar{x}$ denote its bitwise complement.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Show that $F'_k(x) := F_k(x) \| F_k(\bar{x})$ (a keyed function with $2n$-bit outputs) is **not** a PRF. Specify the queries of your distinguisher.`,
          hints: [R`Which two inputs give related outputs?`, R`Query $0^n$ and $1^n = \overline{0^n}$ and compare the halves of the two answers.`],
          solution: R`$F'$ is a PRF iff for every p.p.t. $\mathcal{D}$, $\bigl|\Pr[\mathcal{D}^{F'_k(\cdot)}(1^n)=1] - \Pr[\mathcal{D}^{g(\cdot)}(1^n)=1]\bigr|$ is negligible, where $g$ is a uniform function $\{0,1\}^n \to \{0,1\}^{2n}$.

**Distinguisher.** $\mathcal{D}$ queries $x_1 := 0^n$ and $x_2 := 1^n$, receiving $z_1 = a_1 \| b_1$ and $z_2 = a_2 \| b_2$ (halves of $n$ bits). It outputs 1 iff $a_1 = b_2$ and $b_1 = a_2$.

**Real world.** $z_1 = F_k(0^n) \| F_k(1^n)$ and $z_2 = F_k(1^n) \| F_k(0^n)$, so the condition always holds: probability 1.

**Random world.** $g(0^n)$ and $g(1^n)$ are independent uniform $2n$-bit strings, so $z_2 = b_1 \| a_1$ holds with probability $2^{-2n}$.

Advantage $1 - 2^{-2n}$, not negligible. Hence $F'$ is not a PRF.`,
          rubric: [ { points: 1, text: R`Concrete queries $0^n, 1^n$ and the swap test` },
                    { points: 1, text: R`Probabilities 1 vs. $2^{-2n}$ and conclusion` } ] },
        { label: "b", points: 2,
          prompt: R`Show that $F''_k(x) := F_k(x) \oplus F_k(\bar{x})$ is **not** a PRF.`,
          hints: [R`Compare $F''_k(x)$ with $F''_k(\bar{x})$.`],
          solution: R`**Distinguisher.** $\mathcal{D}$ queries $0^n$ and $1^n$, gets $z_1, z_2$, and outputs 1 iff $z_1 = z_2$.

**Real world.** $F''_k(0^n) = F_k(0^n) \oplus F_k(1^n) = F''_k(1^n)$, so $\mathcal{D}$ outputs 1 with probability 1.

**Random world.** For $f \gets \mathsf{Func}_n$, $f(0^n)$ and $f(1^n)$ are independent and uniform, so they are equal with probability $2^{-n}$.

Advantage $1 - 2^{-n}$, not negligible, so $F''$ is not a PRF.`,
          rubric: [ { points: 1, text: R`Queries $0^n$ and $1^n$ (or any $x$ and $\bar{x}$), test for equality` },
                    { points: 1, text: R`Probabilities 1 vs. $2^{-n}$ and conclusion` } ] },
        { label: "c", points: 4,
          prompt: R`Prove, by giving a reduction, that $F^\star_k(x) := F_k(x) \oplus x$ is a PRF.`,
          hints: [R`Let $\mathcal{D}^\star$ be any distinguisher for $F^\star$. Your $\mathcal{D}$ has oracle $\mathcal{O}$ and must answer $\mathcal{D}^\star$'s queries.`, R`Answer query $x$ with $\mathcal{O}(x) \oplus x$.`, R`If $f$ is uniform in $\mathsf{Func}_n$, what is the distribution of $g(x) := f(x) \oplus x$? Is $f \mapsto g$ a bijection?`],
          solution: R`**Assumption.** For every p.p.t. $\mathcal{D}$ there is a negligible $\varepsilon$ with $\bigl|\Pr_{k}[\mathcal{D}^{F_k(\cdot)}(1^n)=1] - \Pr_{f \gets \mathsf{Func}_n}[\mathcal{D}^{f(\cdot)}(1^n)=1]\bigr| \le \varepsilon(n)$.

**Reduction.** Let $\mathcal{D}^\star$ be any p.p.t. distinguisher for $F^\star$. $\mathcal{D}$ with oracle $\mathcal{O}$ runs $\mathcal{D}^\star(1^n)$; whenever $\mathcal{D}^\star$ queries $x$, $\mathcal{D}$ queries $\mathcal{O}(x)$ and returns $\mathcal{O}(x) \oplus x$. Finally $\mathcal{D}$ outputs whatever $\mathcal{D}^\star$ outputs. $\mathcal{D}$ is p.p.t. (one query and one XOR per query of $\mathcal{D}^\star$).

**Real world.** If $\mathcal{O} = F_k$, $\mathcal{D}^\star$ receives $F_k(x) \oplus x = F^\star_k(x)$, so $\Pr[\mathcal{D}^{F_k}=1] = \Pr[(\mathcal{D}^\star)^{F^\star_k}=1]$.

**Random world.** If $\mathcal{O} = f \gets \mathsf{Func}_n$, $\mathcal{D}^\star$ receives $g(x) := f(x) \oplus x$. The map $f \mapsto g$ is a bijection on $\mathsf{Func}_n$ (its inverse is $g \mapsto g \oplus \mathrm{id}$), so $g$ is uniform in $\mathsf{Func}_n$. Hence $\Pr[\mathcal{D}^{f}=1] = \Pr_{g \gets \mathsf{Func}_n}[(\mathcal{D}^\star)^{g}=1]$.

**Conclusion.**
$$\Bigl|\Pr[(\mathcal{D}^\star)^{F^\star_k}=1] - \Pr[(\mathcal{D}^\star)^{g}=1]\Bigr| = \Bigl|\Pr[\mathcal{D}^{F_k}=1] - \Pr[\mathcal{D}^{f}=1]\Bigr| \le \varepsilon(n).$$
As $\mathcal{D}^\star$ was arbitrary, $F^\star$ is a PRF.`,
          rubric: [ { points: 1, text: R`PRF assumption stated; reduction answers $x$ with $\mathcal{O}(x) \oplus x$` },
                    { points: 1, text: R`Reduction p.p.t.; real world gives exactly $F^\star_k$` },
                    { points: 1, text: R`Random world: $f(x) \oplus x$ is a uniform function (bijection argument)` },
                    { points: 1, text: R`Equal advantages, conclusion` } ] },
      ] },

    { id: "l6-prob-not-cpa", type: "problem", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slides 8, 16 and 20 (exam-style variant)", difficulty: 3,
      title: "Three schemes that are not CPA-secure",
      mock: true,
      statement: R`Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ be a PRF (respectively a PRP where stated), $n \ge 8$. In each part $\mathsf{Gen}(1^n)$ returns $k \gets \{0,1\}^n$. Show that the scheme is not CPA-secure by giving an adversary, specifying all values it chooses, and computing its success probability.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`$F$ is a PRP, $\mathsf{Enc}_k(m) := F_k(m)$ and $\mathsf{Dec}_k(c) := F_k^{-1}(c)$ for $m \in \{0,1\}^n$.`,
          hints: [R`The scheme is deterministic.`, R`Ask the oracle for an encryption of one of your challenge messages.`],
          solution: R`**Adversary $\mathcal{A}$.** (1) Query the oracle on $0^n$, receive $c_0 = F_k(0^n)$. (2) Output $m_0 := 0^n$, $m_1 := 1^n$, receive $c^*$. (3) Output $b' := 0$ if $c^* = c_0$, else $b' := 1$.

**$b = 0$:** $c^* = F_k(0^n) = c_0$, so $b' = 0$. **$b = 1$:** $c^* = F_k(1^n) \ne F_k(0^n)$ since $F_k$ is a bijection, so $b' = 1$.

$\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)=1] = 1$, and $1 - \tfrac12$ is not negligible. $\mathcal{A}$ is p.p.t.`,
          rubric: [ { points: 1, text: R`Concrete adversary: oracle query on $m_0$, challenge $(m_0, m_1)$, comparison` },
                    { points: 1, text: R`Both cases analysed (bijectivity for $b=1$), success probability 1` } ] },
        { label: "b", points: 4,
          prompt: R`$\mathsf{Enc}_k(m)$ samples $r' \gets \{0,1\}^8$, sets $r := 0^{n-8} \| r'$ and returns $\langle r, F_k(r) \oplus m \rangle$; $\mathsf{Dec}_k(\langle r, s \rangle) := F_k(r) \oplus s$. Messages are in $\{0,1\}^n$.`,
          hints: [R`How many different values can $r$ take? What happens if an oracle ciphertext has the same $r$ as the challenge?`, R`After the challenge, ask the oracle to encrypt $0^n$: the answer reveals $F_k(r)$ for its $r$.`, R`If the $r$ values match, you know the pad of the challenge; otherwise guess. Compute $\tfrac{1}{256} \cdot 1 + \tfrac{255}{256} \cdot \tfrac12$.`],
          solution: R`**Adversary $\mathcal{A}$.**

1. Output $m_0 := 0^n$, $m_1 := 1^n$, receive $c^* = \langle r^*, s^* \rangle$.
2. Query the oracle on $0^n$, receive $\langle r, s \rangle$ with $s = F_k(r) \oplus 0^n = F_k(r)$.
3. If $r = r^*$: output $b' := 0$ if $s^* = s$, else $b' := 1$. If $r \ne r^*$: output a uniform bit $b'$.

**Analysis.** $r$ and $r^*$ are independent and uniform over a set of $2^8 = 256$ values, so $\Pr[r = r^*] = \tfrac{1}{256}$.

If $r = r^*$: $s^* = F_k(r^*) \oplus m_b = s \oplus m_b$. For $b = 0$, $s^* = s$; for $b = 1$, $s^* = s \oplus 1^n \ne s$. So $\mathcal{A}$ is always correct.

If $r \ne r^*$: $\mathcal{A}$ guesses, correct with probability $\tfrac12$.

$$\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)=1] = \tfrac{1}{256} \cdot 1 + \tfrac{255}{256} \cdot \tfrac12 = \tfrac12 + \tfrac{1}{512}.$$
The advantage $\tfrac{1}{512}$ is a constant, hence not negligible. $\mathcal{A}$ is p.p.t. (Making $n$ oracle queries instead of one raises the success probability to $1 - \tfrac12 (\tfrac{255}{256})^n$.)`,
          rubric: [ { points: 1, text: R`Concrete challenge messages and oracle query on a known message` },
                    { points: 1, text: R`Decision rule using the matching $r$ (and a guess otherwise)` },
                    { points: 1, text: R`Correct analysis of the matching case ($s^* = s \oplus m_b$)` },
                    { points: 1, text: R`Success probability $\tfrac12 + \tfrac1{512}$ (or better), argued non-negligible` } ] },
        { label: "c", points: 3,
          prompt: R`Messages are $m = m^{(1)} \| m^{(2)}$ with $m^{(1)}, m^{(2)} \in \{0,1\}^n$. $\mathsf{Enc}_k(m)$ samples $r \gets \{0,1\}^n$ and returns $\langle r, F_k(r) \oplus m^{(1)}, F_k(r) \oplus m^{(2)} \rangle$.`,
          hints: [R`Both blocks use the same pad.`, R`XOR the two masked blocks. Choose $m_0$ with equal blocks and $m_1$ with different blocks.`],
          solution: R`**Adversary $\mathcal{A}$** (it does not even need the oracle). Output $m_0 := 0^n \| 0^n$ and $m_1 := 0^n \| 1^n$. Receive $c^* = \langle r, s_1, s_2 \rangle$. Output $b' := 0$ if $s_1 = s_2$, else $b' := 1$.

**Analysis.** $s_1 \oplus s_2 = (F_k(r) \oplus m_b^{(1)}) \oplus (F_k(r) \oplus m_b^{(2)}) = m_b^{(1)} \oplus m_b^{(2)}$. For $b = 0$ this is $0^n$, so $s_1 = s_2$ and $b' = 0$. For $b = 1$ it is $1^n$, so $s_1 \ne s_2$ and $b' = 1$.

$\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)=1] = 1$, which is not $\le \tfrac12 + \mathsf{negl}(n)$. (The same adversary even breaks EAV-security.)`,
          rubric: [ { points: 1, text: R`Concrete messages with equal blocks vs. different blocks` },
                    { points: 1, text: R`Observation $s_1 \oplus s_2 = m_b^{(1)} \oplus m_b^{(2)}$ (pad reuse)` },
                    { points: 1, text: R`Both cases and success probability 1` } ] },
      ] },

    { id: "l6-prob-cpa-implies-eav", type: "problem", lecture: 6, topic: "reductions", origin: "slides",
      source: "Lecture 6, slides 3–6 (exam-style variant)", difficulty: 2,
      title: "CPA-security implies EAV-security",
      mock: true,
      statement: R`Let $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ be a private-key encryption scheme.`,
      parts: [
        { label: "a", points: 3,
          prompt: R`Prove that if $\Pi$ is CPA-secure, then $\Pi$ is EAV-secure (computationally indistinguishable in the presence of an eavesdropper).`,
          hints: [R`Start from an arbitrary p.p.t. EAV adversary $\mathcal{A}$.`, R`Can $\mathcal{A}$ be run in the CPA experiment as it is? What does it do with the oracle?`],
          solution: R`**Definitions.** EAV-security: for every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)=1] \le \tfrac12 + \varepsilon(n)$. CPA-security: the same for $\mathsf{PrivK}^{\mathsf{cpa}}$, where $\mathcal{A}$ additionally has oracle access to $\mathsf{Enc}_k(\cdot)$.

**Reduction.** Let $\mathcal{A}$ be any p.p.t. EAV adversary. Define the CPA adversary $\mathcal{A}'$: it runs $\mathcal{A}(1^n)$, forwards $\mathcal{A}$'s messages $m_0, m_1$ as its own challenge, gives the challenge ciphertext $c$ to $\mathcal{A}$, and outputs $\mathcal{A}$'s guess $b'$. It **never queries** its encryption oracle. $\mathcal{A}'$ is p.p.t.

**Analysis.** In $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A}',\Pi}(n)$ the key $k \gets \mathsf{Gen}(1^n)$, the bit $b$ and $c \gets \mathsf{Enc}_k(m_b)$ are generated exactly as in $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)$, and $\mathcal{A}'$ wins iff $\mathcal{A}$ wins. Hence
$$\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)=1] = \Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A}',\Pi}(n)=1] \le \tfrac12 + \varepsilon(n)$$
for the negligible $\varepsilon$ given by CPA-security for $\mathcal{A}'$. Since $\mathcal{A}$ was arbitrary, $\Pi$ is EAV-secure.`,
          rubric: [ { points: 1, text: R`Both definitions stated` },
                    { points: 1, text: R`$\mathcal{A}'$ runs $\mathcal{A}$ and makes no oracle queries; p.p.t.` },
                    { points: 1, text: R`Experiments coincide, so the EAV success is bounded by $\tfrac12 + \varepsilon(n)$` } ] },
      ] },

    { id: "l6-prob-thm329", type: "problem", lecture: 6, topic: "reductions", origin: "slides",
      source: "Lecture 6, slides 17–22 (Theorem 3.29)", difficulty: 3,
      title: "Prove Construction 3.28 CPA-secure",
      mock: true,
      statement: R`Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ be a PRF and $\Pi$ the scheme with $\mathsf{Gen}(1^n)$: $k \gets \{0,1\}^n$; $\mathsf{Enc}_k(m)$: $r \gets \{0,1\}^n$, return $\langle r, F_k(r) \oplus m \rangle$; $\mathsf{Dec}_k(\langle r, s \rangle) := F_k(r) \oplus s$, for messages $m \in \{0,1\}^n$.`,
      parts: [
        { label: "a", points: 1,
          prompt: R`Show that $\Pi$ is correct.`,
          hints: [R`$F_k$ is a deterministic function of $r$.`],
          solution: R`For $c = \langle r, F_k(r) \oplus m \rangle$: $\mathsf{Dec}_k(c) = F_k(r) \oplus F_k(r) \oplus m = 0^n \oplus m = m$, since $F_k(r)$ is the same value in both computations.`,
          rubric: [ { points: 1, text: R`Correct computation` } ] },
        { label: "b", points: 7,
          prompt: R`Prove, by giving a reduction, that $\Pi$ is CPA-secure.`,
          hints: [R`The reduction $\mathcal{D}$ has oracle $\mathcal{O} \in \{F_k, f\}$ and must answer encryption queries and the challenge without knowing $k$.`, R`With $\mathcal{O} = F_k$ the simulation is perfect. With $\mathcal{O} = f$, when can $\mathcal{A}$ do better than $\tfrac12$?`, R`Define the event $R$ that $r^*$ is used in some encryption query, bound $\Pr[R] \le q(n)/2^n$, and show the success probability given $\overline{R}$ is exactly $\tfrac12$.`],
          solution: R`**Goal.** For every p.p.t. $\mathcal{A}$: $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)=1] \le \tfrac12 + \mathsf{negl}(n)$.

**Assumption.** For every p.p.t. $\mathcal{D}$ there is a negligible $\varepsilon$ with
$$\Bigl|\Pr_{k \gets \{0,1\}^n}[\mathcal{D}^{F_k(\cdot)}(1^n)=1] - \Pr_{f \gets \mathsf{Func}_n}[\mathcal{D}^{f(\cdot)}(1^n)=1]\Bigr| \le \varepsilon(n).$$

**Reduction.** Let $\mathcal{A}$ be p.p.t., making at most $q(n)$ encryption queries ($q$ a polynomial). $\mathcal{D}^{\mathcal{O}}(1^n)$ runs $\mathcal{A}(1^n)$ and:

1. On encryption query $m$: sample $r \gets \{0,1\}^n$, return $\langle r, \mathcal{O}(r) \oplus m \rangle$.
2. On challenge $m_0, m_1$: sample $r^* \gets \{0,1\}^n$ and $b \gets \{0,1\}$, return $c^* := \langle r^*, \mathcal{O}(r^*) \oplus m_b \rangle$.
3. Answer further encryption queries as in 1.
4. When $\mathcal{A}$ outputs $b'$: output $1$ iff $b' = b$.

$\mathcal{D}$ is p.p.t.: it runs $\mathcal{A}$ once and does one oracle query and one XOR per query.

**Case $\mathcal{O} = F_k$.** Every ciphertext is exactly $\mathsf{Enc}_k(\cdot)$ with uniform $k$, so
$$\Pr[\mathcal{D}^{F_k(\cdot)}=1] = \Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)=1].$$

**Case $\mathcal{O} = f$.** Let $R$ be the event that $r^* = r_i$ for the randomness $r_i$ of some encryption query. Each $r_i$ is uniform and independent of $r^*$, so by the union bound $\Pr[R] \le q(n) \cdot 2^{-n}$. If $\overline{R}$, then $f(r^*)$ is a uniform value that is used only in $c^*$, so $f(r^*) \oplus m_b$ is a one-time pad encryption; $\mathcal{A}$'s whole view is independent of $b$ and $\Pr[\mathcal{D}^{f}=1 \mid \overline{R}] = \tfrac12$. Therefore
$$\Pr[\mathcal{D}^{f(\cdot)}=1] = \Pr[\mathcal{D}^{f}=1 \wedge R] + \Pr[\mathcal{D}^{f}=1 \wedge \overline{R}] \le \Pr[R] + \Pr[\mathcal{D}^{f}=1 \mid \overline{R}] \le \frac{q(n)}{2^n} + \frac12.$$

**Conclusion.**
$$\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)=1] = \Pr[\mathcal{D}^{F_k}=1] \le \Pr[\mathcal{D}^{f}=1] + \varepsilon(n) \le \frac12 + \varepsilon(n) + \frac{q(n)}{2^n}.$$
$\varepsilon'(n) := \varepsilon(n) + q(n)2^{-n}$ is negligible (sum of negligible functions; polynomial times $2^{-n}$ is negligible). As $\mathcal{A}$ was arbitrary, $\Pi$ is CPA-secure.`,
          rubric: [ { points: 1, text: R`PRF assumption and CPA goal stated` },
                    { points: 2, text: R`Reduction fully specified: answers queries with fresh $r$ and $\mathcal{O}(r)$, builds challenge with own $b$, outputs $[b' = b]$; p.p.t.` },
                    { points: 1, text: R`Case $F_k$: perfect simulation of $\mathsf{PrivK}^{\mathsf{cpa}}$` },
                    { points: 1, text: R`Repeat event $R$ defined and $\Pr[R] \le q(n)/2^n$` },
                    { points: 1, text: R`Given $\overline{R}$: one-time pad, probability exactly $\tfrac12$; hence $\Pr[\mathcal{D}^f=1] \le \tfrac12 + q(n)/2^n$` },
                    { points: 1, text: R`Final inequality chain and negligibility of $\varepsilon'$` } ] },
      ] },

    { id: "l6-prob-fixed-input", type: "problem", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slides 8, 13 and 19 (exam-style variant)", difficulty: 3,
      title: "A PRF-based scheme that is EAV-secure but not CPA-secure",
      mock: true,
      statement: R`Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ be a PRF. Consider $\Pi$ for messages $m = m^{(1)} \| m^{(2)} \in \{0,1\}^{2n}$ (with $m^{(1)}, m^{(2)} \in \{0,1\}^n$): $\mathsf{Gen}(1^n)$ returns $k \gets \{0,1\}^n$, and
$$\mathsf{Enc}_k(m) := \bigl(F_k(0^n) \oplus m^{(1)}\bigr) \,\|\, \bigl(F_k(1^n) \oplus m^{(2)}\bigr).$$
$\mathsf{Dec}_k(c^{(1)} \| c^{(2)}) := (F_k(0^n) \oplus c^{(1)}) \| (F_k(1^n) \oplus c^{(2)})$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Show that $\Pi$ is not CPA-secure.`,
          hints: [R`Is $\mathsf{Enc}$ randomized?`],
          solution: R`$\mathsf{Enc}_k$ is deterministic. **Adversary $\mathcal{A}$:** query the oracle on $0^{2n}$ and receive $c_0$; output $m_0 := 0^{2n}$, $m_1 := 1^{2n}$ and receive $c^*$; output $b' := 0$ iff $c^* = c_0$.

$b = 0$: $c^* = \mathsf{Enc}_k(0^{2n}) = c_0$, so $b' = 0$. $b = 1$: $c^* = c_0 \oplus 1^{2n} \ne c_0$, so $b' = 1$. Thus $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)=1] = 1$, not $\le \tfrac12 + \mathsf{negl}(n)$.`,
          rubric: [ { points: 1, text: R`Concrete adversary with oracle query and challenge messages` },
                    { points: 1, text: R`Both cases and success probability 1` } ] },
        { label: "b", points: 5,
          prompt: R`Prove, by giving a reduction, that $\Pi$ is EAV-secure.`,
          hints: [R`The reduction $\mathcal{D}$ needs only two oracle values. Which ones?`, R`$\mathcal{D}$ queries $p_0 := \mathcal{O}(0^n)$, $p_1 := \mathcal{O}(1^n)$ and uses $p_0 \| p_1$ as the pad.`, R`For a random $f$, $f(0^n)$ and $f(1^n)$ are independent uniform strings (the inputs differ). What scheme do you get?`],
          solution: R`**Assumption.** For every p.p.t. $\mathcal{D}$ there is a negligible $\varepsilon$ with $\bigl|\Pr_k[\mathcal{D}^{F_k(\cdot)}(1^n)=1] - \Pr_{f \gets \mathsf{Func}_n}[\mathcal{D}^{f(\cdot)}(1^n)=1]\bigr| \le \varepsilon(n)$.

**Reduction.** Let $\mathcal{A}$ be any p.p.t. EAV adversary. $\mathcal{D}^{\mathcal{O}}(1^n)$:

1. Query $p_0 := \mathcal{O}(0^n)$ and $p_1 := \mathcal{O}(1^n)$.
2. Run $\mathcal{A}(1^n)$, receive $m_0, m_1 \in \{0,1\}^{2n}$.
3. Sample $b \gets \{0,1\}$ and give $c := (p_0 \oplus m_b^{(1)}) \| (p_1 \oplus m_b^{(2)})$ to $\mathcal{A}$.
4. When $\mathcal{A}$ outputs $b'$, output 1 iff $b' = b$.

$\mathcal{D}$ is p.p.t. (two queries, two XORs, one run of $\mathcal{A}$).

**Case $\mathcal{O} = F_k$.** $c = \mathsf{Enc}_k(m_b)$ for uniform $k$, so $\Pr[\mathcal{D}^{F_k}=1] = \Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)=1]$.

**Case $\mathcal{O} = f$.** Since $0^n \ne 1^n$, $p_0 = f(0^n)$ and $p_1 = f(1^n)$ are independent and uniform in $\{0,1\}^n$, so $p_0 \| p_1$ is uniform in $\{0,1\}^{2n}$ and $c = (p_0 \| p_1) \oplus m_b$ is a one-time pad encryption. $c$ is uniform and independent of $b$, hence $\Pr[\mathcal{D}^{f}=1] = \tfrac12$.

**Conclusion.** $\bigl|\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)=1] - \tfrac12\bigr| \le \varepsilon(n)$, so $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)=1] \le \tfrac12 + \varepsilon(n)$, and $\Pi$ is EAV-secure.`,
          rubric: [ { points: 1, text: R`PRF assumption stated` },
                    { points: 1, text: R`Reduction: queries $\mathcal{O}(0^n), \mathcal{O}(1^n)$, picks $b$, builds $c$, outputs $[b'=b]$; p.p.t.` },
                    { points: 1, text: R`Case $F_k$: perfect simulation of $\mathsf{PrivK}^{\mathsf{eav}}$` },
                    { points: 1, text: R`Case $f$: independent uniform pads (distinct inputs), one-time pad, probability $\tfrac12$` },
                    { points: 1, text: R`Final inequality and conclusion` } ] },
      ] },
  );
})();
