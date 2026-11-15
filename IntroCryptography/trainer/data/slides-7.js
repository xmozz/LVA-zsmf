(function () {
  const R = String.raw;
  const add = (...items) => (window.CRYPTO_BANK = window.CRYPTO_BANK || []).push(...items);

  // ===================================================================
  // Lecture 7 — notes
  // ===================================================================
  add(
    { id: "l7-note-recap", type: "note", lecture: 7, topic: "cpa-prf", origin: "slides",
      source: "Lecture 7, slides 2–7 and 12", difficulty: 1,
      title: "Recap: CPA-security, PRFs and Construction 3.28",
      order: 10,
      body: R`### Adversary goals and power

Kerckhoffs: the adversary knows the scheme. The goal we protect against is the weakest one: obtaining **any** information about the plaintext. The adversary's power grows from "sees ciphertexts" (EAV) to "chooses plaintexts" (CPA) to "can also ask for decryptions" (CCA, this lecture).

### CPA-security (Definition 3.21)

In $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)$: $k \gets \mathsf{Gen}(1^n)$, $b \gets \{0,1\}$; $\mathcal{A}$ gets $1^n$ and an encryption oracle $\mathsf{Enc}_k(\cdot)$ (before **and** after the challenge), outputs $m_0, m_1$ with $|m_0| = |m_1|$, receives $c \gets \mathsf{Enc}_k(m_b)$ and outputs $b'$; the experiment outputs 1 iff $b' = b$. $\Pi$ is CPA-secure if for every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with

$$\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n).$$

### PRF (Definition 3.24)

$F$ is a PRF if for all p.p.t. $\mathcal{D}$ there is a negligible $\varepsilon$ with

$$\Big|\Pr_{k \gets \{0,1\}^n}[\mathcal{D}^{F_k(\cdot)}(1^n) = 1] - \Pr_{f \gets \mathsf{Func}_n}[\mathcal{D}^{f(\cdot)}(1^n) = 1]\Big| \le \varepsilon(n).$$

### Construction 3.28 (CPA-secure encryption of $n$-bit messages from a PRF)

- $\mathsf{Gen}(1^n)$: $k \gets \{0,1\}^n$.
- $\mathsf{Enc}_k(m)$: $r \gets \{0,1\}^n$, return $c := (r, F_k(r) \oplus m)$.
- $\mathsf{Dec}_k((c_0, c_1))$: return $m := F_k(c_0) \oplus c_1$.

### Proof idea (Theorem 3.29)

1. Replace $F_k$ by a truly random $f \gets \mathsf{Func}_n$ ("ideal game"). By PRF security the winning probabilities differ by at most $\varepsilon(n)$.
2. In the ideal game the challenge is $(r^*, f(r^*) \oplus m_b)$. If $f(r^*)$ is never used elsewhere it is a fresh uniform pad (one-time pad), so $\mathcal{A}$ wins with probability exactly $\tfrac12$.
3. $f(r^*)$ is used elsewhere only if $r^*$ equals one of the at most $q(n)$ values $r_i$ of the encryption queries: probability at most $q(n)/2^n$.

$$\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n) + \frac{q(n)}{2^n}.$$

### Longer messages

Split $m$ into $n$-bit blocks and encrypt each block with Construction 3.28: still CPA-secure (CPA-security implies multi-message security), but $|c| = 2|m|$. Using $r, r+1, r+2, \dots$ instead of fresh $r_i$ for each block gives $|c| = |m| + n$: this is **CTR mode**.

**Exam trap:** the bound contains $q(n)/2^n$ because of a possible repetition of $r$; forgetting this term (claiming "exactly $\tfrac12$ in the ideal game") is wrong.` },

    { id: "l7-note-ecb", type: "note", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slides 9–11", difficulty: 1,
      title: "ECB mode (electronic code book)",
      order: 20,
      body: R`A **block-cipher mode of operation** encrypts messages longer than $n$ bits with a PRP/block cipher $F$. The message is divided into $t$ blocks of $n$ bits $m_1, \dots, m_t$ (with padding if necessary).

### Definition

$$\begin{aligned} \mathsf{Enc}_k(m_1, \dots, m_t) &:= F_k(m_1), \dots, F_k(m_t) \\ \mathsf{Dec}_k(c_1, \dots, c_t) &:= F_k^{-1}(c_1), \dots, F_k^{-1}(c_t) \end{aligned}$$

Decryption needs $F_k^{-1}$, so $F$ must be a **permutation** (PRP). No IV; ciphertext length equals message length.

### Security

- **Deterministic** $\Rightarrow$ **not CPA-secure** (query $m_0$ to the encryption oracle and compare with the challenge).
- Worse: **not even EAV-secure**. If $m_i = m_j$ then $c_i = c_j$, so patterns of the plaintext appear in the ciphertext (the ECB-encrypted Matterhorn picture is still recognisable).

### The EAV attack (slide 11)

Use $2n$-bit challenge messages $m_0 := 0^n \| 0^n$ and $m_1 := 0^n \| 1^n$. Given $c = c_1 \| c_2$, output $b' := 0$ iff $c_1 = c_2$.

- $b = 0$: $c_1 = c_2 = F_k(0^n)$, so $b' = 0$.
- $b = 1$: $c_1 = F_k(0^n) \neq F_k(1^n) = c_2$ since $F_k$ is a permutation, so $b' = 1$.

$\mathcal{A}$ wins with probability $1$, which is not $\le \tfrac12 + \mathsf{negl}(n)$. "Do not use!"

**Exam trap:** restricted to **single-block** messages, ECB is just $\mathsf{Enc}_k(m) = F_k(m)$, which is EAV-secure for a PRP (Lecture 6) but still not CPA-secure. The EAV attack needs at least two blocks.` },

    { id: "l7-note-ctr", type: "note", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slides 12–13", difficulty: 1,
      title: "CTR mode (counter mode)",
      order: 30,
      body: R`### Definition ($F$ a PRF, $m_i \in \{0,1\}^n$)

$\mathsf{Enc}_k(m_1, \dots, m_t)$:

1. sample $ctr \gets \{0,1\}^n$ uniformly;
2. for $i = 1, \dots, t$: $c_i := F_k(ctr + i) \oplus m_i$;
3. return $c_0 := ctr, c_1, \dots, c_t$.

$\mathsf{Dec}_k(c_0, c_1, \dots, c_t)$: for $i = 1, \dots, t$: $m_i := F_k(c_0 + i) \oplus c_i$; return $m_1, \dots, m_t$.

(The addition $ctr + i$ is on $n$-bit strings read as integers modulo $2^n$.)

Correctness: $F_k(c_0 + i) \oplus c_i = F_k(ctr + i) \oplus F_k(ctr + i) \oplus m_i = m_i$.

### Properties

- **$F$ need not be invertible: a PRF suffices**, since both $\mathsf{Enc}$ and $\mathsf{Dec}$ only evaluate $F_k$ forwards.
- Can be viewed as a **stream cipher**: the key stream $F_k(ctr+1) \| F_k(ctr+2) \| \dots$ is XORed onto the message.
- **Parallelisable** (both encryption and decryption): each block only needs its own counter value. The key stream can even be precomputed before the message is known.
- Ciphertext expansion: one block, $|c| = |m| + n$ (optimal; Construction 3.28 applied blockwise has $|c| = 2|m|$).
- **Theorem 3.33.** If $F$ is pseudorandom, then CTR mode is CPA-secure.

### Proof idea and the role of the counter

Replace $F_k$ by a random function $f$. Each encryption uses the input range $ctr+1, \dots, ctr+t$. If the range of the challenge never overlaps the ranges of the encryption queries, the challenge pad consists of fresh uniform values (one-time pad). Since every $ctr$ is uniform and $n$ is big enough, the probability of an overlap is negligible.

### What goes wrong with bad counters

- **Repeated counter** ($ctr' = ctr$): both ciphertexts use the same pad, so $c_i \oplus c'_i = m_i \oplus m'_i$ (two-time pad). In the CPA game: query $m_0$, compare.
- **Fixed counter** (e.g. always $0^n$): encryption becomes deterministic $\Rightarrow$ not CPA-secure.
- **Distinct but overlapping counters** (e.g. $ctr' = ctr + 1$): $F_k(ctr' + i) = F_k(ctr + i + 1)$, so the second pad is the first one shifted by one block. "Different counters" is **not** enough; the ranges must not overlap (random counters achieve this with overwhelming probability).

### Not CCA-secure

Flipping bits of $c_i$ flips exactly the same bits of $m_i$ (malleable). See the CCA notes.` },

    { id: "l7-note-cbc", type: "note", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 14", difficulty: 1,
      title: "CBC mode (cipher block chaining)",
      order: 40,
      body: R`### Definition ($F$ a PRP, $m_i \in \{0,1\}^n$)

$\mathsf{Enc}_k(m_1, \dots, m_t)$:

1. sample $c_0 \gets \{0,1\}^n$ uniformly (the **initialization vector**, IV);
2. for $i = 1, \dots, t$: $c_i := F_k(m_i \oplus c_{i-1})$;
3. return $c_0, c_1, \dots, c_t$.

$\mathsf{Dec}_k(c_0, c_1, \dots, c_t)$: for $i = 1, \dots, t$: $m_i := F_k^{-1}(c_i) \oplus c_{i-1}$; return $m_1, \dots, m_t$.

Correctness: $F_k^{-1}(c_i) \oplus c_{i-1} = F_k^{-1}(F_k(m_i \oplus c_{i-1})) \oplus c_{i-1} = m_i$.

### Properties

- Decryption uses $F_k^{-1}$: $F$ must be a **pseudorandom permutation** (a PRF that is not a permutation is not enough, decryption would not be well defined).
- **Theorem 3.32.** If $F$ is a pseudorandom permutation, then CBC mode is CPA-secure.
- Ciphertext expansion: one block ($|c| = |m| + n$).
- **Encryption is sequential**: $c_i$ needs $c_{i-1}$. **Decryption is parallelisable**: all $c_{i-1}$ are part of the ciphertext.
- Used in SSL/TLS (with padding, see the padding-oracle attack).

### Why the IV must be uniform (exam variants, not on the slides)

- **Fixed IV**: encryption is deterministic $\Rightarrow$ not CPA-secure (encrypting the same message twice gives the same ciphertext; more generally, equal message prefixes give equal ciphertext prefixes).
- **Predictable IV**, e.g. **chained CBC** where the IV of the next encryption is the last ciphertext block of the previous one: the adversary knows the next IV $v$ before choosing $m_0$. If it saw $c'_1 = F_k(m' \oplus c'_0)$ earlier, it chooses $m_0 := m' \oplus c'_0 \oplus v$, so that $m_0 \oplus v = m' \oplus c'_0$ and the challenge block equals $c'_1$ iff $b = 0$.

### Not CCA-secure

Flipping a bit of $c_0$ flips the same bit of $m_1$ (and nothing else). See the CCA notes.` },

    { id: "l7-note-ofb", type: "note", lecture: 7, topic: "modes", origin: "slides",
      source: "Exercise 5, Q4 (OFB figure); Lecture 7, slides 13–14 for comparison", difficulty: 1,
      title: "OFB mode (output feedback) — as introduced in the exercises",
      order: 50,
      body: R`OFB is not on the lecture slides; it was introduced on Exercise sheet 5 by a figure: the IV is fed into the block cipher, each output is fed into the next block-cipher call, and every output is XORed onto one plaintext block. The IV is sampled uniformly and sent as the 0-th ciphertext block.

### Definition ($m = m_1 \| \dots \| m_t$, $m_i \in \{0,1\}^n$)

$\mathsf{Enc}_k(m)$: sample $c_0 \gets \{0,1\}^n$; set $x_0 := c_0$ and $x_i := F_k(x_{i-1})$ for $i = 1, \dots, t$; set $c_i := x_i \oplus m_i$; return $c_0 \| c_1 \| \dots \| c_t$.

$\mathsf{Dec}_k(c_0 \| \dots \| c_t)$: set $x_0 := c_0$, $x_i := F_k(x_{i-1})$; return $m_i := x_i \oplus c_i$ for $i = 1, \dots, t$.

Correctness: decryption recomputes the same $x_i$ from $c_0$, and $x_i \oplus (x_i \oplus m_i) = m_i$.

### Properties

- Only $F_k$ forwards: **no inverse needed**, a PRF suffices.
- Like CTR, a **stream cipher**: the key stream $x_1, x_2, \dots$ depends only on the IV and the key, so it can be **precomputed**, but computing it is **sequential** ($x_i$ needs $x_{i-1}$), unlike CTR.
- With a uniform IV and $F$ a PRF, OFB can be shown CPA-secure (Katz–Lindell; not proven in the lecture).
- A repeated IV gives the same key stream (two-time pad).
- One flipped bit in $c_i$ ($i \ge 1$) flips exactly that bit of $m_i$; no error propagation.
- **Not CCA-secure**: for a one-block challenge $(c_0, c_1)$, query $\mathsf{Dec}_k(c_0, c_1 \oplus \Delta) = m_b \oplus \Delta$.` },

    { id: "l7-note-compare", type: "note", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slides 9–14, 19–20; Exercise 5", difficulty: 2,
      title: "Comparison of the modes ECB, CTR, CBC, OFB",
      order: 60,
      body: R`### Formulas at a glance

- **ECB:** $c_i = F_k(m_i)$; $m_i = F_k^{-1}(c_i)$.
- **CTR:** $c_0 = ctr$ uniform, $c_i = F_k(ctr + i) \oplus m_i$; $m_i = F_k(c_0 + i) \oplus c_i$.
- **CBC:** $c_0 = IV$ uniform, $c_i = F_k(m_i \oplus c_{i-1})$; $m_i = F_k^{-1}(c_i) \oplus c_{i-1}$.
- **OFB:** $c_0 = IV$ uniform, $x_0 = c_0$, $x_i = F_k(x_{i-1})$, $c_i = x_i \oplus m_i$; $m_i = x_i \oplus c_i$.

### Does the mode need $F^{-1}$ (i.e. a PRP)?

- ECB: yes. CBC: yes.
- CTR: no, a PRF suffices. OFB: no, a PRF suffices. (Same for Construction 3.28.)

### Security (with $F$ a PRP / PRF as required)

- ECB: deterministic; not CPA-secure and not even EAV-secure (for messages of at least two blocks).
- CTR: CPA-secure (Theorem 3.33). Not CCA-secure.
- CBC: CPA-secure (Theorem 3.32). Not CCA-secure.
- OFB: CPA-secure (Katz–Lindell). Not CCA-secure.
- **None** of the schemes seen so far is CCA-secure: they are all malleable.

### IV / counter requirements

- ECB: no IV (that is exactly why it is deterministic).
- CTR: uniform $ctr$; a repeated counter, or overlapping ranges $ctr+1..ctr+t$, reuses pad blocks.
- CBC: uniform IV; a fixed IV makes it deterministic, a predictable IV (e.g. chained) breaks CPA-security.
- OFB: uniform IV; a repeated IV reuses the whole key stream.

### Parallelism

- ECB: encryption and decryption parallel.
- CTR: encryption and decryption parallel (random access to any block).
- CBC: encryption sequential, decryption parallel.
- OFB: key stream sequential (but can be precomputed before the message is known).

### Ciphertext expansion

ECB: none. CTR, CBC, OFB: one block ($|c| = |m| + n$). Construction 3.28 per block: $|c| = 2|m|$.

### One flipped bit in ciphertext block $c_i$, $i \ge 1$

- ECB: $m_i$ garbled (random-looking), all other blocks correct.
- CTR: exactly the same bit of $m_i$ flipped, nothing else.
- CBC: $m_i$ garbled **and** the same bit of $m_{i+1}$ flipped; $m_{i+2}, \dots$ correct.
- OFB: exactly the same bit of $m_i$ flipped, nothing else.

### One flipped bit in $c_0$ (IV / counter)

- CTR: all blocks decrypted with wrong pads, so (with overwhelming probability) all blocks wrong.
- CBC: the same bit of $m_1$ flipped, all other blocks correct.
- OFB: the whole key stream changes, all blocks wrong.

**Exam trap:** "error propagation" is a reliability property; it says nothing about CCA-security. CTR has no error propagation and is malleable for exactly that reason.` },

    { id: "l7-note-cca-def", type: "note", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slides 16–18", difficulty: 1,
      title: "Chosen-ciphertext attacks and CCA-security (Definition 5.1)",
      order: 70,
      body: R`### Motivation

- **Eavesdropping attack:** the adversary only sees $c$.
- **Chosen-plaintext attack:** the adversary can get encryptions $c_i \gets \mathsf{Enc}_k(m_i)$ of messages of its choice.
- **Active adversaries:** the adversary can also inject a modified $c'$ into the channel and observe (part of) what the receiver does with $m' = \mathsf{Dec}_k(c')$.
- **Chosen-ciphertext attack:** the adversary can additionally get decryptions $m_i = \mathsf{Dec}_k(c_i)$ of ciphertexts of its choice.

### The experiment $\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n)$

1. $k \gets \mathsf{Gen}(1^n)$.
2. $\mathcal{A}$ gets $1^n$ and oracle access to $\mathsf{Enc}_k(\cdot)$ **and** $\mathsf{Dec}_k(\cdot)$.
3. $\mathcal{A}$ outputs $m_0, m_1$ with $|m_0| = |m_1|$.
4. $b \gets \{0,1\}$; the challenge $c^* \gets \mathsf{Enc}_k(m_b)$ is given to $\mathcal{A}$.
5. $\mathcal{A}$ keeps access to both oracles, **except that it may not query $\mathsf{Dec}_k$ on $c^*$ itself**.
6. $\mathcal{A}$ outputs $b'$; the experiment outputs $1$ iff $b' = b$.

**Definition 5.1.** $\Pi$ is secure against chosen-ciphertext attacks (CCA-secure) if for every p.p.t. $\mathcal{A}$ there exists a negligible $\varepsilon$ such that

$$\Pr[\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n).$$

### What $\mathcal{A}$ may and may not do

- May query $\mathsf{Enc}_k$ on anything, including $m_0$ and $m_1$, before and after the challenge.
- May query $\mathsf{Dec}_k$ on **any** ciphertext before the challenge.
- After the challenge: may query $\mathsf{Dec}_k$ on any $c \neq c^*$, even one that differs from $c^*$ in a single bit.
- May **not** query $\mathsf{Dec}_k(c^*)$: otherwise every scheme would be trivially broken.

### Relations

CCA $\Rightarrow$ CPA $\Rightarrow$ EAV: a CCA adversary can simply ignore its decryption oracle (and a CPA adversary its encryption oracle). The converses fail: CTR and CBC are CPA-secure but not CCA-secure.

**Exam trap:** the only restriction is $c \neq c^*$; the decryption oracle answers ciphertexts that are "obviously related" to $c^*$. That is exactly what the attacks exploit.` },

    { id: "l7-note-cca-attacks", type: "note", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slides 19–20", difficulty: 2,
      title: "Why Construction 3.28, CTR and CBC are not CCA-secure",
      order: 80,
      body: R`All attacks follow the same pattern: take the challenge $c^*$, change it into a different ciphertext $c'$ whose decryption is $m_b \oplus \Delta$ for a known $\Delta \neq 0^n$, ask the decryption oracle (allowed since $c' \neq c^*$), and remove $\Delta$. Use one-block messages $m_0 := 0^n$, $m_1 := 1^n$ and $\Delta := 0^{n-1}1$ (any $\Delta \neq 0^n$ works).

### Construction 3.28 (slide 19)

Challenge $(r, s)$ with $s = F_k(r) \oplus m_b$. Query

$$\mathsf{Dec}_k((r, s \oplus \Delta)) = F_k(r) \oplus s \oplus \Delta = m_b \oplus \Delta.$$

Output $b' := 0$ iff the answer $\oplus\, \Delta$ equals $m_0$. Wins with probability $1$.

### CTR mode

Challenge $(c_0, c_1)$ with $c_1 = F_k(c_0 + 1) \oplus m_b$. Query $(c_0, c_1 \oplus \Delta)$:

$$\mathsf{Dec}_k(c_0, c_1 \oplus \Delta) = F_k(c_0 + 1) \oplus c_1 \oplus \Delta = m_b \oplus \Delta.$$

### CBC mode

Challenge $(c_0, c_1)$ with $c_1 = F_k(m_b \oplus c_0)$. Flip the **IV**: query $(c_0 \oplus \Delta, c_1)$:

$$\mathsf{Dec}_k(c_0 \oplus \Delta, c_1) = F_k^{-1}(c_1) \oplus c_0 \oplus \Delta = m_b \oplus c_0 \oplus c_0 \oplus \Delta = m_b \oplus \Delta.$$

(Flipping $c_1$ instead would garble $m_1$ completely; for two-block messages one can flip a bit of $c_1$ and read the flipped bit in $m_2$.)

### OFB

Same as CTR: query $(c_0, c_1 \oplus \Delta)$ to get $m_b \oplus \Delta$.

### Writing it up in the exam

1. State Definition 5.1.
2. Define $\mathcal{A}$: its messages $m_0 \neq m_1$, the modified ciphertext $c'$, why $c' \neq c^*$ (since $\Delta \neq 0^n$), and its output rule.
3. Compute $\mathsf{Dec}_k(c')$ and show $b' = b$ in both cases $b = 0$ and $b = 1$.
4. Conclude: $\Pr[\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n) = 1] = 1 > \tfrac12 + \varepsilon(n)$ for every negligible $\varepsilon$ (for large $n$), so $\Pi$ is not CCA-secure.

This does not contradict Theorems 3.29, 3.32, 3.33: those only claim CPA-security, where $\mathcal{A}$ has no decryption oracle.` },

    { id: "l7-note-malleability", type: "note", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slides 19–21", difficulty: 1,
      title: "Malleability and the padding-oracle attack",
      order: 90,
      body: R`### Malleability

A scheme is **malleable** if a ciphertext $c$ can be changed into a ciphertext $c'$ of a **related** message (without knowing the key or the message), e.g. $\mathsf{Dec}_k(c') = \mathsf{Dec}_k(c) \oplus \Delta$ for a $\Delta$ of the adversary's choice.

- Construction 3.28, CTR, CBC and OFB are all malleable (bit flips in the ciphertext become predictable bit flips in the plaintext).
- **A CCA-secure scheme must not be malleable** (slide 19): otherwise $\mathcal{A}$ maps $c^*$ to a related $c' \neq c^*$, asks the decryption oracle and learns $m_b$.
- Hence: none of the schemes seen so far is CCA-secure (slide 20).
- CPA-security does **not** imply non-malleability: CTR is CPA-secure and malleable.

### Why it matters (slide 21)

Alice sends "transfer 1 EUR to X". Without knowing the key, the adversary changes the ciphertext so the bank decrypts "transfer 1000 EUR to X". Encryption alone (even CPA-secure) does not prevent this; in general one needs **authentication** to avoid impersonation (later in the course, not midterm material).

### Is CCA too paranoid? The padding-oracle attack (slide 20)

No: the padding-oracle attack against SSL (PKCS7 padding in CBC mode, book Section 5.1.1) is a real chosen-ciphertext attack. The attacker sends modified ciphertexts to the server and **only needs to learn whether decryption succeeded** (whether the padding was valid), not the decrypted message. That is already enough to recover the plaintext.

**Exam trap:** "the attacker can only learn whether decryption succeeded, so CCA attacks are unrealistic" is false; that one bit of information is exactly what the padding oracle gives.` },
  );

  // ===================================================================
  // Lecture 7 — flashcards
  // ===================================================================
  add(
    { id: "l7-card-01", type: "card", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slides 9–10", difficulty: 1,
      front: R`ECB mode: write down $\mathsf{Enc}$ and $\mathsf{Dec}$.`,
      back: R`$\mathsf{Enc}_k(m_1, \dots, m_t) = F_k(m_1), \dots, F_k(m_t)$ and $\mathsf{Dec}_k(c_1, \dots, c_t) = F_k^{-1}(c_1), \dots, F_k^{-1}(c_t)$. Needs a PRP (inverse), no IV, deterministic.` },

    { id: "l7-card-02", type: "card", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 11", difficulty: 2,
      front: R`Why is ECB not even EAV-secure? Give the challenge messages.`,
      back: R`Equal plaintext blocks give equal ciphertext blocks. Take $m_0 := 0^n \| 0^n$, $m_1 := 0^n \| 1^n$; output $b' = 0$ iff $c_1 = c_2$. For $b=0$ always $c_1 = c_2$; for $b=1$ never (since $F_k$ is a permutation). Success probability $1$.` },

    { id: "l7-card-03", type: "card", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 13", difficulty: 1,
      front: R`CTR mode: write down $\mathsf{Enc}$ and $\mathsf{Dec}$.`,
      back: R`$\mathsf{Enc}_k$: $ctr \gets \{0,1\}^n$; $c_i := F_k(ctr + i) \oplus m_i$ for $i = 1..t$; output $c_0 := ctr, c_1, \dots, c_t$. $\mathsf{Dec}_k$: $m_i := F_k(c_0 + i) \oplus c_i$.` },

    { id: "l7-card-04", type: "card", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 13", difficulty: 1,
      front: R`Why does CTR mode only need a PRF, not a PRP? Which theorem gives its security?`,
      back: R`Both $\mathsf{Enc}$ and $\mathsf{Dec}$ evaluate $F_k$ only forwards; $F_k^{-1}$ is never needed. **Theorem 3.33:** if $F$ is pseudorandom, CTR mode is CPA-secure.` },

    { id: "l7-card-05", type: "card", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slides 7, 12, 14", difficulty: 1,
      front: R`Ciphertext expansion: Construction 3.28 applied blockwise vs. CTR vs. CBC?`,
      back: R`Blockwise Construction 3.28: $|c| = 2|m|$ (a fresh $r_i$ per block). CTR and CBC: $|c| = |m| + n$, i.e. one extra block ($ctr$ resp. IV).` },

    { id: "l7-card-06", type: "card", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 13", difficulty: 2,
      front: R`In CTR mode, why is "every encryption uses a different counter" not enough?`,
      back: R`The ranges $ctr+1, \dots, ctr+t$ must not overlap. With $ctr' = ctr + 1$ the second pad is $F_k(ctr+2), F_k(ctr+3), \dots$, i.e. the first pad shifted by one block, so pad blocks are reused. A uniform $ctr$ makes overlaps negligibly likely.` },

    { id: "l7-card-07", type: "card", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 14", difficulty: 1,
      front: R`CBC mode: write down $\mathsf{Enc}$ and $\mathsf{Dec}$.`,
      back: R`$\mathsf{Enc}_k$: $c_0 \gets \{0,1\}^n$ (IV); $c_i := F_k(m_i \oplus c_{i-1})$; output $c_0, c_1, \dots, c_t$. $\mathsf{Dec}_k$: $m_i := F_k^{-1}(c_i) \oplus c_{i-1}$.` },

    { id: "l7-card-08", type: "card", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 14", difficulty: 1,
      front: R`What does CBC require of $F$, and what does Theorem 3.32 say?`,
      back: R`$F$ must be a **pseudorandom permutation** (decryption uses $F_k^{-1}$). Theorem 3.32: if $F$ is a PRP, CBC mode (with uniform IV) is CPA-secure.` },

    { id: "l7-card-09", type: "card", lecture: 7, topic: "modes", origin: "slides",
      source: "Exercise 5, Q4", difficulty: 1,
      front: R`OFB mode: write down $\mathsf{Enc}$ and $\mathsf{Dec}$.`,
      back: R`$c_0 \gets \{0,1\}^n$, $x_0 := c_0$, $x_i := F_k(x_{i-1})$, $c_i := x_i \oplus m_i$. Decryption recomputes $x_i$ from $c_0$ and sets $m_i := x_i \oplus c_i$. No inverse needed.` },

    { id: "l7-card-10", type: "card", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slides 10, 13, 14", difficulty: 2,
      front: R`Which of ECB, CTR, CBC, OFB can encrypt in parallel? Which can decrypt in parallel?`,
      back: R`Parallel encryption: ECB, CTR. Parallel decryption: ECB, CTR, CBC. CBC encryption is sequential ($c_i$ needs $c_{i-1}$); OFB's key stream is sequential ($x_i$ needs $x_{i-1}$) but can be precomputed.` },

    { id: "l7-card-11", type: "card", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slides 10, 13, 14", difficulty: 2,
      front: R`One bit of ciphertext block $c_i$ ($i \ge 1$) is flipped. What happens to the plaintext in ECB, CTR, CBC, OFB?`,
      back: R`ECB: $m_i$ garbled. CTR: same bit of $m_i$ flipped. CBC: $m_i$ garbled and same bit of $m_{i+1}$ flipped. OFB: same bit of $m_i$ flipped. All other blocks are correct.` },

    { id: "l7-card-12", type: "card", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slide 18", difficulty: 1,
      front: R`In $\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n)$: which oracles does $\mathcal{A}$ have, and what is the only restriction?`,
      back: R`$\mathsf{Enc}_k(\cdot)$ and $\mathsf{Dec}_k(\cdot)$, before and after the challenge. Only restriction: after receiving $c^*$, it may not query $\mathsf{Dec}_k(c^*)$.` },

    { id: "l7-card-13", type: "card", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slide 18", difficulty: 1,
      front: R`State Definition 5.1 (CCA-security).`,
      back: R`$\Pi$ is secure against chosen-ciphertext attacks if for every p.p.t. $\mathcal{A}$ there exists a negligible $\varepsilon$ such that $\Pr[\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$.` },

    { id: "l7-card-14", type: "card", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slide 19", difficulty: 2,
      front: R`CCA attack on Construction 3.28: which ciphertext is queried, what comes back?`,
      back: R`Challenge $(r, s)$ with $s = F_k(r) \oplus m_b$. Query $\mathsf{Dec}_k((r, s \oplus \Delta))$ for any $\Delta \neq 0^n$; answer $F_k(r) \oplus s \oplus \Delta = m_b \oplus \Delta$, which reveals $b$.` },

    { id: "l7-card-15", type: "card", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slides 14, 20", difficulty: 2,
      front: R`CCA attack on CBC with one-block messages: what do you change in the challenge $(c_0, c_1)$?`,
      back: R`Flip bits in the IV: query $(c_0 \oplus \Delta, c_1)$, $\Delta \neq 0^n$. Decryption gives $F_k^{-1}(c_1) \oplus c_0 \oplus \Delta = m_b \oplus \Delta$.` },

    { id: "l7-card-16", type: "card", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slides 19–21", difficulty: 1,
      front: R`What is malleability and how does it relate to CCA-security?`,
      back: R`A scheme is malleable if $c$ can be changed into a $c'$ that decrypts to a related message. A CCA-secure scheme must not be malleable. Construction 3.28, CTR and CBC are malleable, so none is CCA-secure (though all are CPA-secure).` },

    { id: "l7-card-17", type: "card", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slide 20", difficulty: 1,
      front: R`What is the padding-oracle attack and what does the attacker need to learn?`,
      back: R`A chosen-ciphertext attack against SSL (PKCS7 padding in CBC mode). The attacker only needs to learn **whether** decryption succeeded (valid padding or not). It shows that CCA-security is not too paranoid.` },

    { id: "l7-card-18", type: "card", lecture: 7, topic: "cpa-prf", origin: "slides",
      source: "Lecture 7, slide 6", difficulty: 2,
      front: R`Proof idea of Theorem 3.29: what are the two steps and where does $q(n)/2^n$ come from?`,
      back: R`(1) Replace $F_k$ by a random $f$: changes the winning probability by at most $\varepsilon(n)$ (PRF security). (2) In the ideal game, $f(r^*)$ is a fresh one-time pad unless $r^*$ equals one of the $\le q(n)$ values $r_i$ used in encryption queries, which has probability $\le q(n)/2^n$. Total: $\le \tfrac12 + \varepsilon(n) + q(n)/2^n$.` },
  );

  // ===================================================================
  // Lecture 7 — true/false
  // ===================================================================
  add(
    { id: "l7-tf-01", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 13", difficulty: 1,
      statement: R`Decryption in CTR mode never evaluates $F_k^{-1}$.`,
      answer: true,
      explanation: R`$\mathsf{Dec}_k$ computes $m_i := F_k(c_0 + i) \oplus c_i$, using $F_k$ only forwards. That is why a PRF suffices for CTR mode.` },

    { id: "l7-tf-02", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 14", difficulty: 1,
      statement: R`CBC mode is still a correct encryption scheme when $F$ is a PRF that is not a permutation, since CBC decryption only evaluates $F_k$ forwards.`,
      answer: false,
      explanation: R`CBC decryption computes $m_i := F_k^{-1}(c_i) \oplus c_{i-1}$ and therefore needs $F_k$ to be invertible. If $F_k$ is not injective, decryption is not well defined.` },

    { id: "l7-tf-03", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 11", difficulty: 1,
      statement: R`ECB mode is CPA-secure if $F$ is a pseudorandom permutation, since every block is encrypted under a pseudorandom permutation.`,
      answer: false,
      explanation: R`ECB is deterministic, and no deterministic scheme is CPA-secure: query $m_0$ to the encryption oracle and compare with the challenge ciphertext.` },

    { id: "l7-tf-04", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 11; Lecture 6, slide 16", difficulty: 2,
      statement: R`If the message space is restricted to single blocks $\{0,1\}^n$ and $F$ is a pseudorandom permutation, ECB mode is EAV-secure.`,
      answer: true,
      explanation: R`For one block, ECB is $\mathsf{Enc}_k(m) = F_k(m)$, which Lecture 6 shows is EAV-secure: $F_k(m_b)$ is indistinguishable from $f(m_b)$ for a uniform permutation $f$, which is uniform regardless of $b$. The ECB attack needs two blocks so that equal blocks can be compared.` },

    { id: "l7-tf-05", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 11", difficulty: 1,
      statement: R`ECB mode instantiated with a pseudorandom permutation is EAV-secure for messages consisting of two blocks.`,
      answer: false,
      explanation: R`With $m_0 = 0^n \| 0^n$ and $m_1 = 0^n \| 1^n$, the two ciphertext blocks are equal iff $b = 0$, so $\mathcal{A}$ wins with probability $1$.` },

    { id: "l7-tf-06", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 14", difficulty: 2,
      statement: R`In CBC mode, encryption of the blocks cannot be parallelised, but decryption can.`,
      answer: true,
      explanation: R`$c_i := F_k(m_i \oplus c_{i-1})$ needs the previous ciphertext block, so encryption is sequential. $m_i := F_k^{-1}(c_i) \oplus c_{i-1}$ only uses ciphertext blocks, which are all known, so all blocks can be decrypted in parallel.` },

    { id: "l7-tf-07", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 13", difficulty: 1,
      statement: R`CTR-mode encryption must be computed sequentially, because each ciphertext block $c_i$ depends on $c_{i-1}$.`,
      answer: false,
      explanation: R`In CTR mode $c_i = F_k(ctr + i) \oplus m_i$ depends only on $ctr$, $i$ and $m_i$, so all blocks can be computed in parallel (the key stream can even be precomputed).` },

    { id: "l7-tf-08", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 12", difficulty: 1,
      statement: R`In CTR mode, the ciphertext of a $t$-block message is exactly one block longer than the message.`,
      answer: true,
      explanation: R`The ciphertext is $c_0, c_1, \dots, c_t$ with $c_0 = ctr$, so $|c| = |m| + n$, which the slides call optimal.` },

    { id: "l7-tf-09", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slides 7, 14", difficulty: 1,
      statement: R`CBC mode has ciphertext expansion $|c| = 2|m|$.`,
      answer: false,
      explanation: R`CBC only adds the IV $c_0$: the expansion is one block, $|c| = |m| + n$. $|c| = 2|m|$ is the expansion of Construction 3.28 applied block by block.` },

    { id: "l7-tf-10", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Variant of Lecture 7, slide 13", difficulty: 2,
      statement: R`CTR mode remains CPA-secure if the counter is fixed to $ctr = 0^n$ in every encryption, as long as the key $k$ is uniform.`,
      answer: false,
      explanation: R`With a fixed counter, encryption is deterministic: every message is XORed with the same pad $F_k(1), F_k(2), \dots$. A CPA adversary encrypts a known message, recovers the pad and decrypts the challenge.` },

    { id: "l7-tf-11", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Variant of Lecture 7, slide 13", difficulty: 3,
      statement: R`For CTR mode to be CPA-secure, it suffices that any two encryptions use different initial counters $ctr$.`,
      answer: false,
      explanation: R`Different counters can still give overlapping ranges: if $ctr' = ctr + 1$, then $F_k(ctr' + i) = F_k(ctr + i + 1)$, so pad blocks are reused. What matters is that the ranges $ctr+1, \dots, ctr+t$ do not overlap, which a uniform $ctr$ ensures with overwhelming probability.` },

    { id: "l7-tf-12", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 13", difficulty: 2,
      statement: R`If two CTR-mode encryptions under the same key happen to use the same counter $ctr$, then $c_1 \oplus c'_1 = m_1 \oplus m'_1$.`,
      answer: true,
      explanation: R`$c_1 \oplus c'_1 = (F_k(ctr + 1) \oplus m_1) \oplus (F_k(ctr + 1) \oplus m'_1) = m_1 \oplus m'_1$: the pad cancels, as with a reused one-time pad key.` },

    { id: "l7-tf-13", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Variant of Lecture 7, slide 14", difficulty: 2,
      statement: R`CBC mode with a fixed, publicly known IV is CPA-secure, because the chaining makes each ciphertext block depend on all previous plaintext blocks.`,
      answer: false,
      explanation: R`With a fixed IV, CBC encryption is deterministic, and no deterministic scheme is CPA-secure: encrypting $m_0$ via the oracle and comparing with the challenge reveals $b$.` },

    { id: "l7-tf-14", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Variant of Lecture 7, slide 14 (chained CBC, Katz–Lindell 3.6.3)", difficulty: 3,
      statement: R`If CBC is implemented so that the IV of each encryption is the last ciphertext block of the previous encryption ("chained CBC"), it is not CPA-secure.`,
      answer: true,
      explanation: R`The adversary knows the next IV $v$ before choosing the challenge. After seeing $c'_1 = F_k(m' \oplus c'_0)$ it picks $m_0 := m' \oplus c'_0 \oplus v$; then the challenge's first block equals $c'_1$ iff $b = 0$.` },

    { id: "l7-tf-15", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 14", difficulty: 2,
      statement: R`In CBC mode, flipping one bit of the IV $c_0$ flips exactly the corresponding bit of $m_1$ and leaves all other plaintext blocks unchanged.`,
      answer: true,
      explanation: R`$m_1 = F_k^{-1}(c_1) \oplus c_0$, so a change of $c_0$ appears as the same change in $m_1$. $c_0$ is used nowhere else in decryption.` },

    { id: "l7-tf-16", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 13", difficulty: 2,
      statement: R`In CTR mode, flipping one bit of ciphertext block $c_2$ causes all subsequent plaintext blocks $m_2, m_3, \dots$ to be decrypted incorrectly.`,
      answer: false,
      explanation: R`$m_i = F_k(c_0 + i) \oplus c_i$ depends only on $c_0$ and $c_i$. Flipping a bit of $c_2$ flips the same bit of $m_2$ and nothing else.` },

    { id: "l7-tf-17", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Exercise 5, Q4 (OFB)", difficulty: 1,
      statement: R`OFB mode requires $F$ to be invertible, because decryption has to undo the block-cipher calls.`,
      answer: false,
      explanation: R`OFB decryption recomputes the key stream $x_i = F_k(x_{i-1})$ from the IV and XORs it onto the ciphertext. Only $F_k$ forwards is used, so a PRF suffices.` },

    { id: "l7-tf-18", type: "tf", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slide 18", difficulty: 1,
      statement: R`In the CCA experiment, the adversary may query the decryption oracle on every ciphertext, including the challenge ciphertext $c^*$.`,
      answer: false,
      explanation: R`After the challenge, decryption queries must satisfy $c \neq c^*$. Otherwise every scheme would be trivially broken.` },

    { id: "l7-tf-19", type: "tf", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slide 18", difficulty: 2,
      statement: R`In the CCA experiment, after receiving $c^*$ the adversary may query the decryption oracle on a ciphertext that differs from $c^*$ in a single bit.`,
      answer: true,
      explanation: R`The only restriction is $c \neq c^*$. A ciphertext differing in one bit is a different ciphertext; this is exactly what the bit-flipping attacks on CTR, CBC and Construction 3.28 use.` },

    { id: "l7-tf-20", type: "tf", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slide 18", difficulty: 1,
      statement: R`In the CCA experiment, the adversary has access to an encryption oracle as well as to a decryption oracle.`,
      answer: true,
      explanation: R`$\mathsf{PrivK}^{\mathsf{cca}}$ extends $\mathsf{PrivK}^{\mathsf{cpa}}$: $\mathcal{A}$ keeps $\mathsf{Enc}_k(\cdot)$ and additionally gets $\mathsf{Dec}_k(\cdot)$, both before and after the challenge.` },

    { id: "l7-tf-21", type: "tf", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slide 19", difficulty: 1,
      statement: R`Construction 3.28 ($\mathsf{Enc}_k(m) = (r, F_k(r) \oplus m)$) is CCA-secure if $F$ is a PRF, because it is CPA-secure by Theorem 3.29.`,
      answer: false,
      explanation: R`CPA-security does not imply CCA-security. Given $(r, s)$, the adversary queries $\mathsf{Dec}_k((r, s \oplus \Delta)) = m_b \oplus \Delta$ and learns $b$.` },

    { id: "l7-tf-22", type: "tf", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slide 18", difficulty: 2,
      statement: R`If a scheme is not CPA-secure, then it is not CCA-secure either.`,
      answer: true,
      explanation: R`This is the contrapositive of CCA $\Rightarrow$ CPA: a CPA adversary is a CCA adversary that never uses its decryption oracle, so it wins the CCA experiment with the same probability.` },

    { id: "l7-tf-23", type: "tf", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slide 20", difficulty: 1,
      statement: R`CBC mode instantiated with a pseudorandom permutation is CCA-secure, since the chaining prevents malleability.`,
      answer: false,
      explanation: R`CBC is malleable: changing the IV to $c_0 \oplus \Delta$ changes $m_1$ to $m_1 \oplus \Delta$. The slides state that none of the schemes so far (CBC, CTR, ...) is CCA-secure.` },

    { id: "l7-tf-24", type: "tf", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slide 19", difficulty: 1,
      statement: R`A CCA-secure encryption scheme must not be malleable.`,
      answer: true,
      explanation: R`If $c^*$ can be changed into a $c' \neq c^*$ of a related message, the adversary asks the decryption oracle for $\mathsf{Dec}_k(c')$ and deduces $m_b$.` },

    { id: "l7-tf-25", type: "tf", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slide 20", difficulty: 1,
      statement: R`The padding-oracle attack requires the attacker to learn the full decryption of the ciphertexts it submits.`,
      answer: false,
      explanation: R`The attacker only needs to learn whether decryption succeeded (whether the padding was valid). That is the point of the slide: even this little information enables a chosen-ciphertext attack.` },

    { id: "l7-tf-26", type: "tf", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slides 13, 20", difficulty: 2,
      statement: R`Every CPA-secure encryption scheme is non-malleable.`,
      answer: false,
      explanation: R`CTR mode is CPA-secure (Theorem 3.33) but malleable: flipping a bit of $c_i$ flips the same bit of $m_i$.` },

    { id: "l7-tf-27", type: "tf", lecture: 7, topic: "cpa-prf", origin: "slides",
      source: "Lecture 7, slide 6", difficulty: 2,
      statement: R`In Theorem 3.29, the term $q(n)/2^n$ bounds the probability that the value $r^*$ used for the challenge ciphertext was also used in one of the adversary's at most $q(n)$ encryption queries.`,
      answer: true,
      explanation: R`In the ideal game the challenge pad $f(r^*)$ is fresh unless $r^*$ hits one of at most $q(n)$ previously used points, which happens with probability at most $q(n)/2^n$.` },

    { id: "l7-tf-28", type: "tf", lecture: 7, topic: "cpa-prf", origin: "slides",
      source: "Lecture 7, slide 6", difficulty: 3,
      statement: R`In the proof of Theorem 3.29, once $F_k$ is replaced by a truly random function $f$, every adversary wins the CPA experiment with probability exactly $\tfrac12$.`,
      answer: false,
      explanation: R`The adversary wins with probability exactly $\tfrac12$ only if $r^*$ is not repeated. An adversary that makes many encryption queries can exploit a repetition of $r^*$, so the bound is $\tfrac12 + q(n)/2^n$.` },

    { id: "l7-tf-29", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 13", difficulty: 1,
      statement: R`Once the key $k$ is fixed, CTR-mode encryption is deterministic.`,
      answer: false,
      explanation: R`$\mathsf{Enc}_k$ samples a fresh uniform $ctr \gets \{0,1\}^n$ in every call, so encrypting the same message twice gives different ciphertexts (with overwhelming probability). This randomness is necessary for CPA-security.` },

    { id: "l7-tf-30", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 11", difficulty: 2,
      statement: R`The attack showing that ECB is insecure works without any encryption-oracle queries.`,
      answer: true,
      explanation: R`The attack only compares the two blocks of the challenge ciphertext for $m_0 = 0^n\|0^n$, $m_1 = 0^n\|1^n$, so it is an eavesdropper attack: ECB is not even EAV-secure.` },
  );

  // ===================================================================
  // Lecture 7 — multiple choice
  // ===================================================================
  add(
    { id: "l7-mc-01", type: "mc", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slides 13–14; Exercise 5", difficulty: 1,
      question: R`Which of the following schemes requires $F$ to be a pseudorandom **permutation** rather than just a PRF?`,
      options: [R`CTR mode`, R`OFB mode`, R`CBC mode`, R`Construction 3.28`],
      correct: 2,
      explanation: R`CBC decryption computes $F_k^{-1}(c_i) \oplus c_{i-1}$. CTR, OFB and Construction 3.28 only evaluate $F_k$ forwards.` },

    { id: "l7-mc-02", type: "mc", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slide 18", difficulty: 1,
      question: R`In $\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n)$, which query is **not** allowed?`,
      options: [
        R`An encryption query on $m_0$ after receiving $c^*$`,
        R`A decryption query on an arbitrary ciphertext before the challenge`,
        R`A decryption query on $c^*$ after receiving $c^*$`,
        R`A decryption query on $c^*$ with its last bit flipped, after receiving $c^*$`],
      correct: 2,
      explanation: R`The only restriction is that $\mathcal{A}$ may not ask for $\mathsf{Dec}_k(c^*)$. All other encryption and decryption queries are allowed.` },

    { id: "l7-mc-03", type: "mc", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slides 12–13", difficulty: 1,
      question: R`A message of $t$ blocks of $n$ bits is encrypted in CTR mode. How long is the ciphertext?`,
      options: [R`$tn$ bits`, R`$(t+1)n$ bits`, R`$2tn$ bits`, R`$(2t+1)n$ bits`],
      correct: 1,
      explanation: R`The ciphertext is $c_0 = ctr$ followed by $c_1, \dots, c_t$: $(t+1)n$ bits, i.e. $|c| = |m| + n$.` },

    { id: "l7-mc-04", type: "mc", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 14", difficulty: 2,
      question: R`A 3-block message is encrypted in CBC mode, giving $c_0, c_1, c_2, c_3$. One bit of $c_2$ is flipped in transit. What does the receiver get?`,
      options: [
        R`Only $m_2$ is wrong (garbled); $m_1$ and $m_3$ are correct`,
        R`$m_2$ is garbled and the same bit of $m_3$ is flipped; $m_1$ is correct`,
        R`$m_2$ and $m_3$ are both completely garbled; $m_1$ is correct`,
        R`Only the same bit of $m_2$ is flipped; everything else is correct`],
      correct: 1,
      explanation: R`$m_2 = F_k^{-1}(c_2) \oplus c_1$ is garbled since $F_k^{-1}$ of a modified block is unrelated. $m_3 = F_k^{-1}(c_3) \oplus c_2$ uses $c_2$ only in the XOR, so exactly that bit flips. $m_1$ does not involve $c_2$.` },

    { id: "l7-mc-05", type: "mc", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slides 11, 13, 14", difficulty: 1,
      question: R`Which mode (with a PRP $F$, messages of several blocks) is **not** EAV-secure?`,
      options: [R`ECB`, R`CTR`, R`CBC`, R`All three are EAV-secure`],
      correct: 0,
      explanation: R`ECB maps equal plaintext blocks to equal ciphertext blocks, which an eavesdropper detects. CTR and CBC are CPA-secure, hence EAV-secure.` },

    { id: "l7-mc-06", type: "mc", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slides 13–14; Exercise 5", difficulty: 2,
      question: R`Which of the following computations can be fully parallelised over the blocks?`,
      options: [R`CBC encryption`, R`OFB key-stream generation`, R`CTR encryption`, R`None of them`],
      correct: 2,
      explanation: R`CTR block $i$ needs only $F_k(ctr + i)$. CBC encryption needs $c_{i-1}$, and OFB needs $x_{i-1}$ to compute $x_i = F_k(x_{i-1})$.` },

    { id: "l7-mc-07", type: "mc", lecture: 7, topic: "cpa-prf", origin: "slides",
      source: "Lecture 7, slide 6", difficulty: 2,
      question: R`Theorem 3.29: for every p.p.t. $\mathcal{A}$ making at most $q(n)$ encryption queries, $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1]$ is at most`,
      options: [
        R`$\tfrac12$`,
        R`$\tfrac12 + \varepsilon(n)$, where $\varepsilon$ is the PRF advantage`,
        R`$\tfrac12 + \varepsilon(n) + q(n)/2^n$`,
        R`$\tfrac12 + q(n) \cdot \varepsilon(n)$`],
      correct: 2,
      explanation: R`$\varepsilon(n)$ accounts for replacing $F_k$ by a random function; $q(n)/2^n$ bounds the probability that the challenge randomness $r^*$ repeats one of the query values $r_i$.` },

    { id: "l7-mc-08", type: "mc", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slide 19", difficulty: 2,
      question: R`Against Construction 3.28 the CCA adversary receives the challenge $(r, s)$ and queries $\mathsf{Dec}_k((r, s \oplus \Delta))$ with $\Delta \neq 0^n$. What does it get back?`,
      options: [R`$m_b$`, R`$m_b \oplus \Delta$`, R`$F_k(r) \oplus \Delta$`, R`Nothing: the query is not allowed`],
      correct: 1,
      explanation: R`$\mathsf{Dec}_k((r, s \oplus \Delta)) = F_k(r) \oplus s \oplus \Delta = m_b \oplus \Delta$. The query is allowed because $(r, s \oplus \Delta) \neq (r, s)$.` },

    { id: "l7-mc-09", type: "mc", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 11", difficulty: 2,
      question: R`Which pair of $2n$-bit challenge messages lets an eavesdropper break ECB with probability $1$ by checking whether the two ciphertext blocks are equal?`,
      options: [
        R`$m_0 = 0^n \| 0^n$, $m_1 = 1^n \| 1^n$`,
        R`$m_0 = 0^n \| 1^n$, $m_1 = 1^n \| 0^n$`,
        R`$m_0 = 0^n \| 0^n$, $m_1 = 0^n \| 1^n$`,
        R`No pair works, because $F_k$ is a pseudorandom permutation`],
      correct: 2,
      explanation: R`Only $m_0$ has two equal blocks, so $c_1 = c_2$ iff $b = 0$. In the first option both messages have equal blocks, in the second neither does.` },

    { id: "l7-mc-10", type: "mc", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slides 19–21", difficulty: 1,
      question: R`What does it mean that an encryption scheme is malleable?`,
      options: [
        R`Its key can be recovered from a few ciphertexts`,
        R`A ciphertext can be changed into a ciphertext of a related message without knowing the key`,
        R`Encryption is deterministic`,
        R`A bit error in the ciphertext propagates to all later plaintext blocks`],
      correct: 1,
      explanation: R`Malleability ("$c$ can be changed into a $c'$ of a related message") is what the CCA attacks exploit; a CCA-secure scheme must not be malleable.` },

    { id: "l7-mc-11", type: "mc", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slides 13, 14, 18–20", difficulty: 2,
      question: R`Which of the following schemes is CCA-secure (with $F$ a PRF resp. PRP as required)?`,
      options: [R`Construction 3.28`, R`CTR mode`, R`CBC mode`, R`None of them`],
      correct: 3,
      explanation: R`All three are CPA-secure but malleable, so none is CCA-secure (slide 20).` },
  );

  // ===================================================================
  // Lecture 7 — fill the gaps
  // ===================================================================
  add(
    { id: "l7-gap-ctr", type: "gap", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 13", difficulty: 1,
      title: "CTR mode", points: 5,
      text: R`Let $F$ be a keyed function with $F_k \colon \{0,1\}^n \to \{0,1\}^n$. CTR mode encrypts $m = m_1, \dots, m_t$ with $m_i \in \{0,1\}^n$ as follows. $\mathsf{Enc}_k(m_1, \dots, m_t)$: sample <gap>$ctr \gets \{0,1\}^n$ uniformly at random</gap>; for $i = 1, \dots, t$ compute <gap>$c_i := F_k(ctr + i) \oplus m_i$</gap>; return <gap>$c_0 := ctr, c_1, \dots, c_t$</gap>.

$\mathsf{Dec}_k(c_0, c_1, \dots, c_t)$: for $i = 1, \dots, t$ compute <gap>$m_i := F_k(c_0 + i) \oplus c_i$</gap> and return $m_1, \dots, m_t$.

Since neither algorithm evaluates $F_k^{-1}$, it suffices that $F$ is <gap>a pseudorandom function (PRF); it need not be invertible</gap>. Theorem 3.33: if $F$ is pseudorandom, then CTR mode is <gap>CPA-secure</gap>.`,
      note: R`Addition $ctr + i$ is modulo $2^n$. CTR is not CCA-secure: it is malleable.` },

    { id: "l7-gap-cbc", type: "gap", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 14", difficulty: 1,
      title: "CBC mode", points: 5,
      text: R`Let $F$ be a keyed permutation on $\{0,1\}^n$. CBC mode encrypts $m_1, \dots, m_t \in \{0,1\}^n$ as follows. $\mathsf{Enc}_k(m_1, \dots, m_t)$: sample <gap>$c_0 \gets \{0,1\}^n$ uniformly at random (the IV)</gap>; for $i = 1, \dots, t$ compute <gap>$c_i := F_k(m_i \oplus c_{i-1})$</gap>; return $c_0, c_1, \dots, c_t$.

$\mathsf{Dec}_k(c_0, c_1, \dots, c_t)$: for $i = 1, \dots, t$ compute <gap>$m_i := F_k^{-1}(c_i) \oplus c_{i-1}$</gap> and return $m_1, \dots, m_t$.

Because decryption needs $F_k^{-1}$, $F$ must be <gap>a pseudorandom permutation (PRP)</gap>. Encryption is <gap>sequential (each block needs the previous ciphertext block)</gap>, while decryption can be parallelised. Theorem 3.32: if $F$ is a PRP, CBC mode is <gap>CPA-secure</gap>.`,
      note: R`Ciphertext expansion is one block. CBC is not CCA-secure: flipping bits of $c_0$ flips the same bits of $m_1$.` },

    { id: "l7-gap-ecb", type: "gap", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slides 9–11", difficulty: 1,
      title: "ECB mode and why it is insecure", points: 3,
      text: R`ECB mode divides $m$ into blocks $m_1, \dots, m_t$ of $n$ bits and computes $\mathsf{Enc}_k(m_1, \dots, m_t) :=$ <gap>$F_k(m_1), \dots, F_k(m_t)$</gap> and $\mathsf{Dec}_k(c_1, \dots, c_t) :=$ <gap>$F_k^{-1}(c_1), \dots, F_k^{-1}(c_t)$</gap>. Because ECB is deterministic it is not CPA-secure, and it is not even EAV-secure: if $m_i = m_j$ then <gap>$c_i = c_j$</gap>, e.g. for challenge messages $m_0 := 0^n \| 0^n$ and $m_1 := 0^n \| 1^n$.`,
      note: R`The adversary outputs $b' = 0$ iff $c_1 = c_2$ and wins with probability $1$.` },

    { id: "l7-gap-eav-cpa-cca", type: "gap", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slides 3, 17–18; Lecture 4, slide 18", difficulty: 2,
      title: "EAV vs. CPA vs. CCA: what changes between the experiments", points: 5,
      text: R`In each of the experiments $\mathsf{PrivK}^{\mathsf{eav}}$, $\mathsf{PrivK}^{\mathsf{cpa}}$ and $\mathsf{PrivK}^{\mathsf{cca}}$, a key $k \gets \mathsf{Gen}(1^n)$ is generated, $\mathcal{A}$ outputs $m_0, m_1$ with $|m_0| = |m_1|$, receives $c \gets \mathsf{Enc}_k(m_b)$ for a uniform bit $b$ and outputs $b'$, and the scheme is secure if every p.p.t. $\mathcal{A}$ has $\Pr[b' = b] \le$ <gap>$\tfrac12 + \varepsilon(n)$ for a negligible $\varepsilon$</gap>.

The experiments differ only in $\mathcal{A}$'s oracle access. In the EAV experiment $\mathcal{A}$ has <gap>no oracle access; it only sees the challenge ciphertext</gap>. In the CPA experiment $\mathcal{A}$ has <gap>access to an encryption oracle $\mathsf{Enc}_k(\cdot)$ before and after the challenge</gap>. In the CCA experiment $\mathcal{A}$ additionally has <gap>access to a decryption oracle $\mathsf{Dec}_k(\cdot)$</gap>, with the single restriction that <gap>after receiving the challenge it may not query $\mathsf{Dec}_k$ on $c$ itself</gap>. Therefore <gap>CCA-security implies CPA-security, which implies EAV-security</gap>.`,
      note: R`Separating examples: the pseudo one-time pad is EAV- but not CPA-secure; CTR/CBC are CPA- but not CCA-secure.` },
  );
})();
