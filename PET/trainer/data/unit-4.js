/* Unit 4 — Cryptographic Foundations
 * Sources: Lecture IV (Cryptographic Preliminaries), Exercise sheet 2.
 */
(function () {
  const R = String.raw;
  const add = (...items) => (window.TRAINER_BANK = window.TRAINER_BANK || []).push(...items);

  add(
    /* ---------------- notes ---------------- */
    { id: "u4-note-encryption", type: "note", lecture: 4, topic: "symmetric", origin: "slides",
      source: "Lecture IV, slides 9-19; Exercise sheet 2, Figure 2 (CPA game)", difficulty: 2,
      title: "Symmetric Encryption and CPA Security",
      order: 10,
      body: R`### Private-Key Encryption Scheme

A scheme $\Pi = (\mathrm{Gen}, \mathrm{Enc}, \mathrm{Dec})$ over the message space $\mathcal{M} = \{0,1\}^*$ consists of three PPT algorithms:

- $k \leftarrow \mathrm{Gen}(1^\lambda)$: key generation, input security parameter $1^\lambda$, output a key $k$ according to some distribution.
- $c \leftarrow \mathrm{Enc}(k,m)$: encryption, input $k$ and $m \in \{0,1\}^*$, output $c \in \mathcal{C}$.
- $m := \mathrm{Dec}(k,c)$: decryption, input $k$ and $c$, output plaintext $m$.

**Correctness:** For every $\lambda$, every $k$ output by $\mathrm{Gen}(1^\lambda)$ and every $m \in \{0,1\}^*$,
$$\mathrm{Dec}(k,\mathrm{Enc}(k,m)) = m.$$

### Why not perfect security?

Perfect, information-theoretic security is impractical in general: the one-time pad requires a key at least as long as the message and must never be reused. Practical definitions balance strong guarantees against efficiency.

Every security definition needs two components:

1. **Security goal:** What is to be achieved? Confidentiality, integrity, authenticity.
2. **Adversarial model:** What capabilities does the attacker have? Access to ciphertexts, chosen plaintexts, computational resources, adaptivity.

### CPA security

**Goal:** No efficient attacker can extract any information about the plaintext from the ciphertext — not even a single bit.

**Model:** The attacker may have arbitrary plaintexts encrypted **before and after** the challenge ciphertext (encryption oracle).

The game $\mathrm{PrivK}^{cpa}_{A,\Pi}(\lambda)$:

1. $k \leftarrow \mathrm{Gen}(1^\lambda)$
2. $(m_0,m_1) \leftarrow A^{\mathrm{Enc}(k,\cdot)}$, with $|m_0| = |m_1|$
3. $b \leftarrow \{0,1\}$
4. $c_b \leftarrow \mathrm{Enc}(k,m_b)$
5. $b' \leftarrow A^{\mathrm{Enc}(k,\cdot)}(c_b)$
6. Output 1 if $b' = b$, otherwise 0.

**Definition:** $\Pi$ is CPA-secure if for every PPT attacker $A$ there exists a negligible function $\mathrm{negl}$ such that
$$\Pr[\mathrm{PrivK}^{cpa}_{A,\Pi}(\lambda) = 1] \le \frac12 + \mathrm{negl}(\lambda).$$

The notation $A^{\mathrm{Enc}(k,\cdot)}$ means: $A$ has access to an encryption oracle that encrypts arbitrary messages without revealing $k$.

### The most important consequence

**CPA security forces randomization.** A deterministic scheme is never CPA-secure: the attacker can send $m_0$ and $m_1$ to the oracle itself and compare the ciphertexts with $c_b$. This is why all constructions include fresh randomness, e.g. a nonce $r$.

### Practical relevance

An attacker interacts with a terminal that sends encrypted messages to a server and tries out inputs. Historical example: in World War II the British laid mines at specific positions so that the Germans would report those positions in encrypted form — known/chosen plaintext provided the entry point for the attack.`
    },
    { id: "u4-note-prf", type: "note", lecture: 4, topic: "prfs", origin: "slides",
      source: "Lecture IV, slides 21–24; Exercise sheet 2, Definition 1", difficulty: 2,
      title: "Pseudorandom Functions (PRFs)",
      order: 20,
      body: R`### Idea

A **keyed, deterministic function** should behave like a truly random function (consistent random sampling) as long as the key is unknown.

Uses:

- A fixed random input produces an efficiently larger, quasi-random output.
- Efficient "blinding" of a message — a basic building block for encryption.
- Applications: encryption, MACs, digital signatures, protocols.

### Formal definition

Let $\mathrm{Func}_n = \{f \mid f: \{0,1\}^n \to \{0,1\}^n\}$ be the set of all functions from $n$ bits to $n$ bits. Let $F: \{0,1\}^\lambda \times \{0,1\}^n \to \{0,1\}^n$ be an efficient, length-preserving, keyed function. $F$ is a **PRF** if for every PPT distinguisher $D$ there exists a negligible function $\mathrm{negl}$ such that
$$\left| \Pr[D^{F(k,\cdot)}(1^\lambda) = 1] - \Pr[D^{f(\cdot)}(1^\lambda) = 1] \right| \le \mathrm{negl}(\lambda),$$
where the first probability is taken over uniform $k \in \{0,1\}^\lambda$ and the second over uniform $f \in \mathrm{Func}_n$ (in each case additionally over the randomness of $D$).

**Intuition:** The distinguisher sees either an oracle for $F(k,\cdot)$ with a random, unknown $k$ or an oracle for a randomly sampled truly random function — it must not be able to tell the two apart.

### Two standard examples

Let $F_k$ be a PRF.

**$F_1(k,x) := F(k,x) \,\|\, 0$** is **not** a PRF. The output is not length-preserving, and the last bit is always 0. A distinguisher simply tests for that.

**$F_2(k,x) := F(k,x \,\|\, 0)$** is a PRF. Restricting to a subset of the inputs does not change indistinguishability: an attacker against $F_2$ can be reduced to an attacker against $F$ that forwards every query $x$ as $x\|0$.

### Reduction pattern

To show that a construction $G$ is a PRF:

1. Assume there is a PPT distinguisher $A$ against $G$.
2. Build a PPT distinguisher $B$ against the underlying PRF $F$ that simulates $A$.
3. Show: if $B$'s oracle is the PRF $F$, then $A$ sees exactly $G$. If it is a truly random function, then $A$ sees a truly random function.
4. Then the advantage of $B$ equals the advantage of $A$ — a contradiction to the PRF assumption.

Important: runtime and success probability must be analyzed explicitly.`
    },
    { id: "u4-note-signatures", type: "note", lecture: 4, topic: "signatures", origin: "slides",
      source: "Lecture IV, slides 26–42; Exercise sheet 2, Problem 5", difficulty: 2,
      title: "Signatures, Hash Functions and Schnorr",
      order: 30,
      body: R`### Digital Signature Scheme

A scheme $\Pi_{DS} = (\mathrm{KGen}_{DS}, \mathrm{Sign}, \mathrm{Vrfy})$ consists of three PPT algorithms:

- $(vk,sk) \leftarrow \mathrm{KGen}_{DS}(1^\lambda)$: verification key $vk$ and signing key $sk$.
- $\sigma \leftarrow \mathrm{Sign}(sk,m)$: signature $\sigma$ for message $m$.
- $0/1 \leftarrow \mathrm{Vrfy}(vk,m,\sigma)$: deterministic; 1 = valid, 0 = invalid.

**Correctness:** For every $\lambda$, every $(vk,sk) \leftarrow \mathrm{KGen}_{DS}(1^\lambda)$, every $m \in \mathcal{M}$ and every $\sigma \leftarrow \mathrm{Sign}(sk,m)$,
$$\mathrm{Vrfy}(vk,m,\mathrm{Sign}(sk,m)) = 1.$$

### Existential Unforgeability (EUF-CMA)

The game:

1. $Q := \emptyset$
2. $(vk,sk) \leftarrow \mathrm{KGen}_{DS}(1^\lambda)$
3. $(m^*,\sigma^*) \leftarrow A^{\mathrm{SigO}(sk,\cdot)}(vk)$
4. $b^* = \mathrm{Vrfy}(vk,m^*,\sigma^*) \wedge ((m^*,\cdot) \notin Q)$
5. Output $b^*$

The oracle $\mathrm{SigO}(sk,m)$ computes $\sigma \leftarrow \mathrm{Sign}(sk,m)$, adds $(m,\sigma)$ to $Q$ and returns $\sigma$.

The attacker may have arbitrarily many messages signed (**chosen message attack**), but wins only with a signature for a message that is **not** in the oracle set $Q$. The definition requires
$$\Pr[\mathrm{EUF\text{-}CMA}_{A,DS}(\lambda) = 1] \le \mathrm{negl}(\lambda).$$

### Hash functions

Hash functions map data of arbitrary length to a fixed "fingerprint" or digest.

Properties:

- **Efficiency:** reduce large data quickly to a manageable size.
- **Data integrity:** the smallest change to the input ⇒ a completely different hash (avalanche effect).
- **Security:** hard to invert; passwords and sensitive data.

Applications: hash tables, digital signatures (hash-and-sign), password storage, blockchain, file-integrity checks.

### Collision resistance

For $H: \mathcal{M} \to \mathcal{R}$ with $|\mathcal{M}| \gg |\mathcal{R}|$, the pigeonhole principle guarantees that collisions exist: $m \ne m'$ with $H(m) = H(m')$. Security means: such pairs are **hard to find**, not that they do not exist.

A hash is a pair of PPT algorithms $(\mathrm{Gen}, H)$:

- $s \leftarrow \mathrm{Gen}(1^\lambda)$: output key $s$.
- $H^s(x)$: there is a polynomial $\ell$ such that $H^s(x) \in \{0,1\}^{\ell(n)}$ for $x \in \{0,1\}^*$. The notation $H^s$ emphasizes that $s$ is **not secret**.

Game $\mathrm{HashColl}_{A,\Pi}(\lambda)$:

1. $s \leftarrow \mathrm{Gen}(1^\lambda)$
2. $(x_0,x_1) \leftarrow A(s)$
3. If $x_0 \ne x_1$ and $H^s(x_0) = H^s(x_1)$: output 1, otherwise 0.

**Definition:** $\Pi$ is collision-resistant if for every PPT attacker $A$ there exists a negligible function $\mathrm{negl}$ such that
$$\Pr[\mathrm{HashColl}_{A,\Pi}(\lambda) = 1] \le \mathrm{negl}(\lambda).$$

**Why keyed?** In practice, hash functions are usually unkeyed. Theoretically this is problematic, because one could hardcode a collision (there is a fixed collision, but the definition demands "hard for all keys"). With keyed hashes one cannot hardcode a collision for every key. In the real world, unkeyed hashes are considered collision-resistant in the sense that colliding pairs are unknown and hard to find.

### Hash-and-Sign

A scheme signs messages of length $\lambda$ — how does one efficiently sign messages of length $\lambda^2$? Hash first: $H(m)$ has fixed length, then sign $H(m)$. Security is inherited from collision resistance: whoever finds two messages with the same hash can transfer a signature from one to the other.

### Schnorr Signature Scheme

Setup: $(G,q,g) \leftarrow \mathcal{G}(1^\lambda)$, $param := (G,q,g)$.

| KGen | Sign($sk,m$) | Vrfy($vk,m,\sigma$) |
| --- | --- | --- |
| $sk \leftarrow \mathbb{Z}_q$ | $r \leftarrow \mathbb{Z}_q$ | $(R,s) := \sigma$ |
| $vk \leftarrow g^{sk}$ | $R \leftarrow g^r$ | $h \leftarrow H(vk,R,m)$ |
| return $(sk,vk)$ | $h \leftarrow H(vk,R,m)$ | return $g^s \stackrel{?}{=} R \cdot vk^h$ |
| | $s \leftarrow sk \cdot h + r$ | |
| | return $(R,s)$ | |

**Correctness:**
$$g^s = g^{sk \cdot h + r} = g^r \cdot (g^{sk})^h = R \cdot vk^h.$$

The nonce $r$ must be fresh for every signature. $h$ binds $vk$, $R$ and $m$, so that the challenge cannot be reused.

### Nonce-reuse attack

If Alice signs two different messages $m_1 \ne m_2$ with the same $r$, we obtain $(R,s_1)$ and $(R,s_2)$ with
$$s_1 = sk \cdot h_1 + r, \qquad s_2 = sk \cdot h_2 + r.$$
Difference:
$$s_1 - s_2 = sk(h_1 - h_2) \pmod q.$$
If $h_1 \ne h_2$, then $h_1 - h_2$ is invertible modulo the prime $q$, so
$$sk = (s_1 - s_2)(h_1 - h_2)^{-1} \pmod q.$$
The signing key is now known and the scheme is broken.

**A constant nonce is fatal:** Even $r \leftarrow F(k,vk)$ is not a solution, because $vk$ is constant and therefore $r$ stays constant.`
    },

    /* ---------------- cards ---------------- */
    { id: "u4-card-cpa-game", type: "card", lecture: 4, topic: "symmetric", origin: "slides",
      source: "Lecture IV, slide 18", difficulty: 2,
      front: R`Describe the CPA game.`,
      back: R`The challenger chooses $k$ and $b$; the attacker may have messages encrypted adaptively, submits $m_0,m_1$ with $|m_0|=|m_1|$, receives $c_b$ and guesses $b'$. It wins if $b'=b$; bound $\tfrac12 + \mathrm{negl}(\lambda)$.` },
    { id: "u4-card-cpa-random", type: "card", lecture: 4, topic: "symmetric", origin: "variant",
      source: "Variant of Lecture IV, slides 18–19", difficulty: 2,
      front: R`Why is a deterministic encryption scheme never CPA-secure?`,
      back: R`The attacker can send $m_0$ and $m_1$ to the encryption oracle itself and compare the resulting ciphertexts with $c_b$. Same message ⇒ same ciphertext, hence trivially distinguishable.` },
    { id: "u4-card-otp", type: "card", lecture: 4, topic: "symmetric", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(xiv)", difficulty: 1,
      front: R`Why is perfect security (one-time pad) impractical for general communication?`,
      back: R`The key must be at least as long as the message and must never be reused.` },
    { id: "u4-card-prf-def", type: "card", lecture: 4, topic: "prfs", origin: "slides",
      source: "Lecture IV, slide 23", difficulty: 2,
      front: R`Define a pseudorandom function (PRF).`,
      back: R`An efficient, length-preserving, keyed function $F$ whose oracle $F(k,\cdot)$ for uniform $k$ is distinguishable from an oracle $f(\cdot)$ for uniform $f \in \mathrm{Func}_n$ by any PPT distinguisher only with negligible advantage.` },
    { id: "u4-card-prf-f1", type: "card", lecture: 4, topic: "prfs", origin: "slides",
      source: "Lecture IV, slide 24", difficulty: 2,
      front: R`Is $F_1(k,x) := F(k,x)\|0$ a PRF if $F$ is a PRF?`,
      back: R`No. The output is not length-preserving and the last bit is always 0; a distinguisher tests exactly that.` },
    { id: "u4-card-prf-f2", type: "card", lecture: 4, topic: "prfs", origin: "slides",
      source: "Lecture IV, slide 24", difficulty: 2,
      front: R`Is $F_2(k,x) := F(k,x\|0)$ a PRF if $F$ is a PRF?`,
      back: R`Yes. Restricting to a subset of the inputs does not change indistinguishability; one reduces to $F$.` },
    { id: "u4-card-prf-key-xor", type: "card", lecture: 4, topic: "prfs", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Problem 2(ii)", difficulty: 3,
      front: R`Is $G_k(x) := F_k(x) \oplus k$ always a PRF if $F$ is a PRF?`,
      back: R`No. Counterexample: let $\tilde F$ be a PRF and set $F_k(x)=0$ for $x=\tilde F_k(0)\oplus k$, and $F_k(x)=\tilde F_k(x)$ otherwise. Then $F$ is a PRF, but $G_k(0)=\tilde F_k(0)\oplus k=:x^\ast$ and $G_k(x^\ast)=k$. A distinguisher queries $0$, then queries the answer, recovers $k$, and checks consistency.` },
    { id: "u4-card-signature-def", type: "card", lecture: 4, topic: "signatures", origin: "slides",
      source: "Lecture IV, slide 26", difficulty: 1,
      front: R`Name the three algorithms of a digital signature scheme.`,
      back: R`$\mathrm{KGen}_{DS}(1^\lambda) \to (vk,sk)$, $\mathrm{Sign}(sk,m) \to \sigma$, $\mathrm{Vrfy}(vk,m,\sigma) \to 0/1$ (deterministic).` },
    { id: "u4-card-euf-cma", type: "card", lecture: 4, topic: "signatures", origin: "slides",
      source: "Lecture IV, slide 28", difficulty: 2,
      front: R`What does EUF-CMA require?`,
      back: R`The attacker may have arbitrarily many messages signed (chosen message attack), but wins only with a valid signature for a message that is not in the oracle set $Q$. For all PPT $A$ the winning probability is negligible.` },
    { id: "u4-card-hash-props", type: "card", lecture: 4, topic: "hashes", origin: "slides",
      source: "Lecture IV, slides 31–32", difficulty: 1,
      front: R`Name three properties of hash functions.`,
      back: R`Efficiency (large data to fixed size), data integrity (avalanche effect) and security (hard to invert).` },
    { id: "u4-card-collision", type: "card", lecture: 4, topic: "hashes", origin: "slides",
      source: "Lecture IV, slides 33–37", difficulty: 2,
      front: R`What does collision resistance mean — and what does it **not** mean?`,
      back: R`It is hard to find two distinct inputs $x_0 \ne x_1$ with $H(x_0)=H(x_1)$. It does **not** mean that no collisions exist; by the pigeonhole principle there always are.` },
    { id: "u4-card-keyed-hash", type: "card", lecture: 4, topic: "hashes", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(xviii)", difficulty: 2,
      front: R`Why are collision-resistant hash functions modeled as keyed?`,
      back: R`A compressing, unkeyed function allows a hardcoded collision. With keyed hashes one cannot hardcode a collision for every key.` },
    { id: "u4-card-hash-sign", type: "card", lecture: 4, topic: "hashes", origin: "slides",
      source: "Lecture IV, slide 29", difficulty: 1,
      front: R`How do you sign messages that are longer than the message length of the scheme?`,
      back: R`Hash-and-sign: first compute $H(m)$ (fixed length), then sign $H(m)$. Security is inherited from collision resistance.` },
    { id: "u4-card-schnorr", type: "card", lecture: 4, topic: "signatures", origin: "slides",
      source: "Lecture IV, slide 42", difficulty: 2,
      front: R`Write down the Schnorr signature scheme.`,
      back: R`$vk=g^{sk}$. Sign: $r \leftarrow \mathbb{Z}_q$, $R=g^r$, $h=H(vk,R,m)$, $s=sk\cdot h+r$. Vrfy: $g^s = R \cdot vk^h$.` },
    { id: "u4-card-schnorr-correct", type: "card", lecture: 4, topic: "signatures", origin: "exercise",
      source: "Exercise sheet 2, Problem 5.1", difficulty: 2,
      front: R`Why is Schnorr correct?`,
      back: R`$g^s = g^{sk\cdot h+r} = g^r \cdot (g^{sk})^h = R \cdot vk^h$.` },
    { id: "u4-card-nonce-reuse", type: "card", lecture: 4, topic: "signatures", origin: "exam-2025",
      source: "Midterm 2025/26, Problem 3(a)", difficulty: 2,
      front: R`What happens in Schnorr if two signatures use the same nonce $r$?`,
      back: R`$s_1-s_2 = sk(h_1-h_2)$, hence $sk = (s_1-s_2)(h_1-h_2)^{-1} \bmod q$. The signing key is known; the scheme is broken.` },
    { id: "u4-card-hash-r-bind", type: "card", lecture: 4, topic: "signatures", origin: "exercise",
      source: "Exercise sheet 2, Problem 5.3", difficulty: 3,
      front: R`Why must the Schnorr challenge contain $R$, i.e. $h=H(vk,R,m)$ instead of $H(vk,m)$?`,
      back: R`Without $R$ one can choose an $s$ for any $m$ and set $R := g^s \cdot vk^{-h}$. Then $g^s = R \cdot vk^h$ holds without anything ever having been signed — a universal forgery.` },

    /* ---------------- true / false ---------------- */
    { id: "u4-tf-correctness", type: "tf", lecture: 4, topic: "symmetric", origin: "slides",
      source: "Lecture IV, slide 12", difficulty: 1,
      statement: R`Correctness of an encryption scheme requires $\mathrm{Dec}(k,\mathrm{Enc}(k,m)) = m$ for all generated keys and all messages.`,
      answer: true,
      explanation: R`This is the perfect-correctness requirement from the lecture.` },
    { id: "u4-tf-deterministic-cpa", type: "tf", lecture: 4, topic: "symmetric", origin: "variant",
      source: "Variant of Lecture IV, slides 18–19", difficulty: 2,
      statement: R`A deterministic encryption scheme can be CPA-secure if the key is long enough.`,
      answer: false,
      explanation: R`The attacker can have the same message encrypted twice and compare the ciphertexts. CPA security forces randomization, regardless of the key length.` },
    { id: "u4-tf-otp", type: "tf", lecture: 4, topic: "symmetric", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(xiv)", difficulty: 1,
      statement: R`Perfect security is impractical for general communication because the key must be at least as long as the message and must never be reused.`,
      answer: true,
      explanation: R`This is the standard argument against the one-time pad.` },
    { id: "u4-tf-prf-length", type: "tf", lecture: 4, topic: "prfs", origin: "variant",
      source: "Variant of Lecture IV, slide 24", difficulty: 2,
      statement: R`$F_1(k,x) = F(k,x)\|0$ is not a PRF because the output is not length-preserving and the last bit is constantly 0.`,
      answer: true,
      explanation: R`Both reasons violate the PRF definition; a distinguisher tests the last bit.` },
    { id: "u4-tf-prf-subset", type: "tf", lecture: 4, topic: "prfs", origin: "slides",
      source: "Lecture IV, slide 24", difficulty: 2,
      statement: R`$F_2(k,x) = F(k,x\|0)$ is a PRF if $F$ is a PRF.`,
      answer: true,
      explanation: R`Restricting to a subset of the inputs preserves indistinguishability; the reduction forwards $x\|0$.` },
    { id: "u4-tf-prf-xor", type: "tf", lecture: 4, topic: "prfs", origin: "exercise",
      source: "Exercise sheet 2, Problem 2.2", difficulty: 3,
      statement: R`$F'(k,x) = F(k,x) \,\|\, F(k,x \oplus 1^n)$ is a PRF if $F$ is a PRF.`,
      answer: false,
      explanation: R`For $x' = x \oplus 1^n$ we have $F'(k,x') = F(k,x')\|F(k,x)$ — the two halves are swapped. A distinguisher notices this immediately.` },
    { id: "u4-tf-prf-halves", type: "tf", lecture: 4, topic: "prfs", origin: "exercise",
      source: "Exercise sheet 2, Problem 2.3", difficulty: 3,
      statement: R`$F'(k,x_1\|x_2) = F(k,x_1)\|F(k,x_2)$ is a PRF if $F$ is a PRF.`,
      answer: false,
      explanation: R`The two halves are not independent: for $x_1 = x_2$ they are equal, and for fixed $x_1$ the first half stays constant as $x_2$ varies.` },
    { id: "u4-tf-euf", type: "tf", lecture: 4, topic: "signatures", origin: "slides",
      source: "Lecture IV, slide 28", difficulty: 1,
      statement: R`In EUF-CMA the attacker also wins if it outputs an already signed message again with a valid signature.`,
      answer: false,
      explanation: R`The message must **not** be in the oracle set $Q$. Outputting an already signed message again is not a forgery.` },
    { id: "u4-tf-hash-collisions", type: "tf", lecture: 4, topic: "hashes", origin: "slides",
      source: "Lecture IV, slide 33", difficulty: 1,
      statement: R`A compressing hash function necessarily has collisions; collision resistance means that they are hard to find.`,
      answer: true,
      explanation: R`The pigeonhole principle guarantees existence; security is about findability.` },
    { id: "u4-tf-keyed-hash", type: "tf", lecture: 4, topic: "hashes", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(xviii)", difficulty: 2,
      statement: R`A compressing, unkeyed hash function allows a hardcoded collision and is therefore modeled as a keyed function in theory.`,
      answer: true,
      explanation: R`The definition demands "hard for all keys"; with keyed hashes one cannot hardcode the same collision for every key.` },
    { id: "u4-tf-sign-large", type: "tf", lecture: 4, topic: "hashes", origin: "variant",
      source: "Variant of Lecture IV, slide 29", difficulty: 1,
      statement: R`In hash-and-sign, the message is hashed first and then the hash is signed.`,
      answer: true,
      explanation: R`This is the standard solution for messages that are longer than the message length of the signature scheme.` },
    { id: "u4-tf-schnorr-vrfy", type: "tf", lecture: 4, topic: "signatures", origin: "slides",
      source: "Lecture IV, slide 42", difficulty: 2,
      statement: R`Schnorr verification checks $g^s = R \cdot vk^h$ with $h = H(vk,R,m)$.`,
      answer: true,
      explanation: R`This follows directly from $s = sk\cdot h + r$ and $R = g^r$.` },
    { id: "u4-tf-nonce-reuse", type: "tf", lecture: 4, topic: "signatures", origin: "exam-2025",
      source: "Midterm 2025/26, Problem 3(a)", difficulty: 2,
      statement: R`Two Schnorr signatures on different messages with the same nonce $r$ allow an observer to compute the signing key.`,
      answer: true,
      explanation: R`$s_1-s_2 = sk(h_1-h_2)$; if $h_1 \ne h_2$, $sk$ is computable.` },
    { id: "u4-tf-constant-nonce", type: "tf", lecture: 4, topic: "signatures", origin: "exam-2025",
      source: "Midterm 2025/26, Problem 3(b)", difficulty: 2,
      statement: R`Deriving $r \leftarrow F(k,vk)$ makes the Schnorr signature secure because $F$ is a PRF.`,
      answer: false,
      explanation: R`$vk$ is constant, so $r$ is constant too. This triggers the nonce-reuse attack; the PRF property does not help.` },

    /* ---------------- multiple choice ---------------- */
    { id: "u4-mc-cpa-requires", type: "mc", lecture: 4, topic: "symmetric", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(xii)", difficulty: 1,
      question: R`What is necessary for a private-key encryption scheme to be CPA-secure?`,
      options: [
        R`Encryption must be deterministic so that the output stays the same for the same key and the same message.`,
        R`Encryption must be randomized so that the same message yields different ciphertexts.`,
        R`Encryption must be randomized in order to hide the plaintext behind a uniform random mask.`,
        R`The encryption algorithm must use a secure PRF.`
      ],
      correct: 1,
      explanation: R`The official solution is (b). Randomization is necessary; a PRF is one possible construction, but not the only one.` },
    { id: "u4-mc-cpa-oracle", type: "mc", lecture: 4, topic: "symmetric", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(xiii)", difficulty: 2,
      question: R`Why may the attacker in the CPA game query the encryption oracle both before and after the challenge ciphertext?`,
      options: [
        R`Because the attacker must help the challenger test the decryption.`,
        R`So that the attacker learns the key distribution.`,
        R`To model realistic scenarios in which attackers continue to interact with the system while they distinguish ciphertexts.`,
        R`Because the challenger needs these queries to choose the challenge bit.`
      ],
      correct: 2,
      explanation: R`The official solution is (c). The oracle models real interaction before and after the target ciphertext.` },
    { id: "u4-mc-prf-def", type: "mc", lecture: 4, topic: "prfs", origin: "variant",
      source: "Variant of Lecture IV, slide 23", difficulty: 1,
      question: R`What is a PRF compared against in the security definition?`,
      options: [
        R`Against a one-time pad`,
        R`Against a uniformly random function from $\mathrm{Func}_n$`,
        R`Against a hash function`,
        R`Against a signature`
      ],
      correct: 1,
      explanation: R`The PRF must be indistinguishable from a truly random function.` },
    { id: "u4-mc-prf-concat", type: "mc", lecture: 4, topic: "prfs", origin: "exercise",
      source: "Exercise sheet 2, Problem 2.4", difficulty: 3,
      question: R`Let $F$ be a PRF. Is $F'(k,x) = F(k,0\|x)\|F(k,1\|x)$ for $x \in \{0,1\}^{n-1}$ a PRF?`,
      options: [
        R`No, because the two halves are always equal.`,
        R`Yes, because the domains $0\|x$ and $1\|x$ are disjoint and the two random functions are independent.`,
        R`No, because the output is too long.`,
        R`Only if $F$ is additionally collision-resistant.`
      ],
      correct: 1,
      explanation: R`Disjoint domains make the two function values independent; the reduction queries $0\|x$ and $1\|x$ and concatenates the answers.` },
    { id: "u4-mc-signature-correctness", type: "mc", lecture: 4, topic: "signatures", origin: "variant",
      source: "Variant of Lecture IV, slide 27", difficulty: 1,
      question: R`What does correctness of a signature scheme require?`,
      options: [
        R`$\mathrm{Vrfy}(vk,m,\mathrm{Sign}(sk,m)) = 1$ for all generated key pairs and messages.`,
        R`Every message has at most one valid signature.`,
        R`The verification key is secret.`,
        R`$\mathrm{Sign}$ is deterministic.`
      ],
      correct: 0,
      explanation: R`Correctness requires that honestly generated signatures are always accepted. Sign may be randomized.` },
    { id: "u4-mc-euf", type: "mc", lecture: 4, topic: "signatures", origin: "slides",
      source: "Lecture IV, slide 28", difficulty: 2,
      question: R`When does the attacker win in the EUF-CMA game?`,
      options: [
        R`If it produces any valid signature.`,
        R`If it produces a valid signature for a message that is not in the oracle set $Q$.`,
        R`If it guesses the signing key.`,
        R`If it calls the oracle more than polynomially many times.`
      ],
      correct: 1,
      explanation: R`The message must be new; already signed messages must not count as a forgery.` },
    { id: "u4-mc-collision", type: "mc", lecture: 4, topic: "hashes", origin: "variant",
      source: "Variant of Lecture IV, slide 37", difficulty: 1,
      question: R`What must an attacker find in the collision-resistance game?`,
      options: [
        R`A key $s$.`,
        R`Two distinct inputs $x_0 \ne x_1$ with $H^s(x_0)=H^s(x_1)$.`,
        R`The output $H^s(x)$ for an arbitrary $x$.`,
        R`A signature for $H^s(x)$.`
      ],
      correct: 1,
      explanation: R`Exactly that is the winning condition of $\mathrm{HashColl}$.` },
    { id: "u4-mc-keyed-hash", type: "mc", lecture: 4, topic: "hashes", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(xviii)", difficulty: 2,
      question: R`Why are collision-resistant hash functions modeled as keyed functions?`,
      options: [
        R`Because a compressing, unkeyed function allows a hardcoded collision.`,
        R`Because the key is necessary in order to compute the function.`,
        R`Because they are a subset of the PRFs and PRFs are keyed.`,
        R`Because the randomness of the key guarantees unpredictable outputs.`
      ],
      correct: 0,
      explanation: R`The official solution is (a). With keyed hashes one cannot hardcode a collision for every key.` },
    { id: "u4-mc-schnorr-purpose", type: "mc", lecture: 4, topic: "signatures", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(xix)", difficulty: 1,
      question: R`Which property contributes most to the provable security of the Schnorr scheme?`,
      options: [
        R`Its efficiency with very short signatures`,
        R`The reduction to a well-studied hardness assumption such as DLP`,
        R`The ability to work without random nonces`,
        R`Compatibility with any hash function in practice`
      ],
      correct: 1,
      explanation: R`The official solution is (b). Security is reduced to the discrete logarithm problem.` },
    { id: "u4-mc-hash-sign", type: "mc", lecture: 4, topic: "hashes", origin: "variant",
      source: "Variant of Lecture IV, slide 29", difficulty: 2,
      question: R`Why is hash-and-sign necessary for long messages?`,
      options: [
        R`Because hash functions encrypt the message.`,
        R`Because the signature scheme only signs messages of fixed length; the hash brings the message to that length.`,
        R`Because the hash replaces the signing key.`,
        R`Because the hash shortens the signature.`
      ],
      correct: 1,
      explanation: R`Hash first, then sign the fixed-length hash; security is inherited from collision resistance.` },
    { id: "u4-mc-nonce-reuse", type: "mc", lecture: 4, topic: "signatures", origin: "variant",
      source: "Variant of Midterm 2025/26, Problem 3", difficulty: 2,
      question: R`Two Schnorr signatures $(R,s_1)$ and $(R,s_2)$ on $m_1 \ne m_2$ with the same $r$ are available. What can an attacker compute?`,
      options: [
        R`Only $R$, nothing more.`,
        R`The signing key $sk = (s_1-s_2)(h_1-h_2)^{-1} \bmod q$.`,
        R`The nonce $r$, but not $sk$.`,
        R`Nothing, because $h_1$ and $h_2$ are hashed.`
      ],
      correct: 1,
      explanation: R`$s_1-s_2 = sk(h_1-h_2)$; if $h_1 \ne h_2$, $sk$ is computable.` },
    { id: "u4-mc-hash-r", type: "mc", lecture: 4, topic: "signatures", origin: "exercise",
      source: "Exercise sheet 2, Problem 5.3", difficulty: 3,
      question: R`What happens if the Schnorr challenge is only $h=H(vk,m)$, i.e. does not bind $R$?`,
      options: [
        R`Nothing, the scheme remains EUF-CMA secure.`,
        R`One can choose $s$ for any message and set $R := g^s \cdot vk^{-h}$; then $(R,s)$ is a valid forgery.`,
        R`The signature becomes longer but more secure.`,
        R`Only the verification key becomes invalid.`
      ],
      correct: 1,
      explanation: R`Then $g^s = R \cdot vk^h$ holds by construction, without anything ever having been signed. That is a universal forgery.` },

    /* ---------------- gaps ---------------- */
    { id: "u4-gap-cpa", type: "gap", lecture: 4, topic: "symmetric", origin: "slides",
      source: "Lecture IV, slides 18–19", difficulty: 2,
      title: "CPA Security", points: 5,
      text: R`A scheme is **CPA-secure** if for every PPT attacker $A$ there exists a negligible function $\mathrm{negl}$ such that <gap>$\Pr[\mathrm{PrivK}^{cpa}_{A,\Pi}(\lambda)=1] \le \tfrac12 + \mathrm{negl}(\lambda)$</gap>. The attacker may use the <gap>encryption oracle</gap> before and after the challenge ciphertext. CPA security forces <gap>randomization</gap>, because a <gap>deterministic</gap> scheme maps equal messages to equal ciphertexts. The historical example from the lecture is <gap>laying mines in World War II</gap>.`,
      note: R`The oracle does not reveal the key; it only encrypts arbitrary messages of the attacker.` },
    { id: "u4-gap-prf", type: "gap", lecture: 4, topic: "prfs", origin: "slides",
      source: "Lecture IV, slide 23", difficulty: 2,
      title: "Pseudorandom Function", points: 4,
      text: R`Let $\mathrm{Func}_n$ be the set <gap>of all functions from $n$ bits to $n$ bits</gap>. An efficient, length-preserving, keyed function $F$ is a **PRF** if for every PPT distinguisher $D$ the distance <gap>$\left|\Pr[D^{F(k,\cdot)}(1^\lambda)=1] - \Pr[D^{f(\cdot)}(1^\lambda)=1]\right|$</gap> is negligible. Here $k$ is <gap>uniform over $\{0,1\}^\lambda$</gap> and $f$ is <gap>uniform over $\mathrm{Func}_n$</gap>.`,
      note: R`$F(k,x)\|0$ is not a PRF; $F(k,x\|0)$ is a PRF.` },
    { id: "u4-gap-euf", type: "gap", lecture: 4, topic: "signatures", origin: "slides",
      source: "Lecture IV, slide 28", difficulty: 2,
      title: "EUF-CMA", points: 4,
      text: R`In the EUF-CMA game the attacker may have arbitrarily many messages signed via the <gap>signing oracle</gap>. The set $Q$ contains <gap>the signed messages</gap>. The attacker wins only if $\mathrm{Vrfy}(vk,m^*,\sigma^*)=1$ and <gap>$m^* \notin Q$</gap>. For all PPT attackers the winning probability must be <gap>negligible</gap>.`,
      note: R`Outputting an already signed message again is not a forgery.` },
    { id: "u4-gap-collision", type: "gap", lecture: 4, topic: "hashes", origin: "slides",
      source: "Lecture IV, slides 36–37", difficulty: 2,
      title: "Collision Resistance", points: 4,
      text: R`A hash is a pair $(\mathrm{Gen},H)$; the key $s$ is <gap>not secret</gap>. In the game $\mathrm{HashColl}$ the challenger chooses <gap>$s \leftarrow \mathrm{Gen}(1^\lambda)$</gap>, and the attacker outputs <gap>$(x_0,x_1)$</gap>. It wins if <gap>$x_0 \ne x_1$ and $H^s(x_0)=H^s(x_1)$</gap>. Collision resistance means that the winning probability is negligible for all PPT attackers.`,
      note: R`One models keyed hashes because an unkeyed compressing function allows a hardcoded collision.` },
    { id: "u4-gap-schnorr", type: "gap", lecture: 4, topic: "signatures", origin: "slides",
      source: "Lecture IV, slide 42", difficulty: 2,
      title: "Schnorr Signature", points: 5,
      text: R`In Schnorr we have $vk = $ <gap>$g^{sk}$</gap>. Signing computes $R = $ <gap>$g^r$</gap>, $h = $ <gap>$H(vk,R,m)$</gap> and $s = $ <gap>$sk \cdot h + r$</gap>. Verification checks <gap>$g^s = R \cdot vk^h$</gap>.`,
      note: R`The nonce $r$ must be fresh for every signature; otherwise $sk = (s_1-s_2)(h_1-h_2)^{-1}$ is computable.` },

    /* ---------------- problems ---------------- */
    { id: "u4-prob-prf-subset", type: "problem", lecture: 4, topic: "prfs", origin: "slides",
      source: "Lecture V, slides 15-19 (example); Variant of Midterm 2024/25, Problem 2", difficulty: 3,
      title: "PRF with Restricted Input",
      statement: R`Let $F: \{0,1\}^\lambda \times \{0,1\}^n \to \{0,1\}^n$ be a pseudorandom function. Define
$$F'(k,x) := F(k, x \,\|\, 0)$$
for $x \in \{0,1\}^{n-1}$.`,
      mock: true,
      parts: [
        { label: "a", points: 2,
          prompt: R`Explain intuitively whether $F'$ is a PRF.`,
          hints: [R`The inputs of $F'$ are a subset of the inputs of $F$.`,
                  R`Could an attacker against $F'$ see anything that it could not see against $F$?`],
          solution: R`$F'$ is a PRF. Restricting to the subset $\{x\|0\}$ does not change indistinguishability: a truly random function restricted to a subset is still a truly random function. An attacker against $F'$ only sees values that an attacker against $F$ could also see.`,
          rubric: [ { points: 1, text: R`Intuition: restriction to a subset` },
                    { points: 1, text: R`Comparison with a truly random function` } ] },
        { label: "b", points: 5,
          prompt: R`Give a formal reduction and analyze runtime and success probability.`,
          hints: [R`Build a distinguisher $B$ against $F$ that simulates $A$ against $F'$.`,
                  R`Answer every query $x$ from $A$ with your own oracle answer on $x\|0$.`],
          solution: R`Suppose there is a PPT distinguisher $A$ against $F'$ with non-negligible advantage $\varepsilon(\lambda)$. Construct $B$ with oracle $O$ (either $F(k,\cdot)$ or $f(\cdot)$):

1. $B$ starts $A$ on $1^\lambda$.
2. For every query $x \in \{0,1\}^{n-1}$ from $A$, $B$ queries its oracle on $x\|0$ and returns the answer to $A$.
3. $A$ outputs a bit $b'$; $B$ outputs the same bit.

**Simulation:** If $O = F(k,\cdot)$, then $A$ sees exactly $F'(k,\cdot) = F(k,x\|0)$. If $O = f(\cdot)$ for a truly random function $f$, then $A$ sees the restriction of $f$ to $\{x\|0\}$, i.e. a truly random function on the restricted domain.

**Runtime:** $B$ runs $A$ and makes exactly one oracle query per query of $A$. If $A$ is PPT, then $B$ is PPT.

**Success probability:**
$$\left|\Pr[B^{F(k,\cdot)}(1^\lambda)=1] - \Pr[B^{f(\cdot)}(1^\lambda)=1]\right| = \left|\Pr[A^{F'(k,\cdot)}(1^\lambda)=1] - \Pr[A^{f'(\cdot)}(1^\lambda)=1]\right| = \varepsilon(\lambda),$$
where $f'$ is the restricted random function. This is a non-negligible advantage against $F$ — a contradiction. Hence $F'$ is a PRF.`,
          rubric: [ { points: 2, text: R`Description of the reduction: query $x$ becomes $x\|0$` },
                    { points: 1, text: R`Argument that $B$ perfectly simulates the view of $A$` },
                    { points: 1, text: R`Runtime analysis: one oracle query per query, PPT` },
                    { points: 1, text: R`Advantage equal to $\varepsilon(\lambda)$ and contradiction` } ] }
      ] },
    { id: "u4-prob-prf-negative", type: "problem", lecture: 4, topic: "prfs", origin: "variant",
      source: "Variant of Lecture IV, slide 24", difficulty: 2,
      title: "Three PRF Candidates",
      statement: R`Let $F$ be a PRF. For each construction, decide whether it is a PRF and justify your answer.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`$G_1(k,x) := F(k,x) \,\|\, 0$.`,
          hints: [R`Consider the length and the last bit.`],
          solution: R`Not a PRF. The output is one bit longer than the input and the last bit is always 0. A truly random function with output length $n+1$ returns a 1 in the last position with probability $\tfrac12$. A distinguisher tests the last bit and wins with advantage close to $\tfrac12$.`,
          rubric: [ { points: 1, text: R`Not a PRF` },
                    { points: 1, text: R`Last bit is constantly 0 / length does not match` } ] },
        { label: "b", points: 2,
          prompt: R`$G_2(k,x) := F(k,x) \,\|\, F(k,x \oplus 1^n)$.`,
          hints: [R`What happens for $x' = x \oplus 1^n$?`,
                  R`Compare the two halves.`],
          solution: R`Not a PRF. For $x' = x \oplus 1^n$ we have
$$G_2(k,x') = F(k,x')\|F(k,x) = F(k,x \oplus 1^n)\|F(k,x),$$
so the two halves of $G_2(k,x)$ are swapped relative to $G_2(k,x')$. A distinguisher queries both inputs and checks whether the halves are swapped. For a truly random function this happens only with negligible probability.`,
          rubric: [ { points: 1, text: R`Not a PRF` },
                    { points: 1, text: R`Swapping distinguisher correct` } ] },
        { label: "c", points: 3,
          prompt: R`$G_3(k,x_1\|x_2) := F(k,x_1) \,\|\, F(k,x_2)$.`,
          hints: [R`Set $x_1 = x_2$.`,
                  R`Keep $x_1$ fixed and vary $x_2$.`],
          solution: R`Not a PRF. Two independent distinguishers:

1. **Equal halves:** For $x_1 = x_2$ we have $G_3(k,x_1\|x_1) = F(k,x_1)\|F(k,x_1)$; both halves are identical. For a truly random function this happens only with probability $2^{-n}$.
2. **Constant first half:** For fixed $x_1$ and varying $x_2$, the first half $F(k,x_1)$ stays constant while the second varies. For a truly random function the first half would be fresh and random for every new query.

Both observations can be checked with polynomially many queries; the advantage is not negligible.`,
          rubric: [ { points: 1, text: R`Not a PRF` },
                    { points: 1, text: R`Distinguisher $x_1=x_2$` },
                    { points: 1, text: R`Distinguisher with constant first half` } ] }
      ] },
    { id: "u4-prob-cpa-prf", type: "problem", lecture: 4, topic: "prfs", origin: "slides",
      source: "Lecture V, slides 4–9", difficulty: 3,
      title: "CPA-Secure Encryption from a PRF",
      statement: R`Let $F$ be a PRF. Define the private-key scheme for messages of length $n$:

- $\mathrm{Gen}(1^\lambda)$: $k \leftarrow \{0,1\}^\lambda$.
- $\mathrm{Enc}(k,m)$: $r \leftarrow \{0,1\}^\lambda$, $c = (r,s) = (r, F(k,r) \oplus m)$.
- $\mathrm{Dec}(k,c)$: parse $(r,s)$, output $F(k,r) \oplus s$.`,
      mock: true,
      parts: [
        { label: "a", points: 2,
          prompt: R`Show correctness.`,
          hints: [R`Substitute the definition of $s$.`],
          solution: R`$\mathrm{Dec}(k,(r,s)) = F(k,r) \oplus s = F(k,r) \oplus F(k,r) \oplus m = m$. The two PRF values cancel out.`,
          rubric: [ { points: 1, text: R`Substituting $s = F(k,r)\oplus m$` },
                    { points: 1, text: R`XOR cancels, result $m$` } ] },
        { label: "b", points: 3,
          prompt: R`Explain the proof idea: why is the scheme CPA-secure if $F$ is a PRF?`,
          hints: [R`In a thought experiment, replace $F(k,\cdot)$ by a truly random function.`,
                  R`With a truly random function, $F(k,r)\oplus m$ is a one-time pad with a fresh $r$.`],
          solution: R`In the CPA game we replace $F(k,\cdot)$ by a truly random function $f$. The difference is negligible by PRF security.

With $f$ we have $s = f(r) \oplus m$. Since $r$ is chosen fresh and uniform and $f$ is a truly random function, $f(r)$ is uniform and independent of $m$. Hence $s$ is a one-time pad with a fresh key: the ciphertext is information-theoretically independent of $m$, so $m_0$ and $m_1$ are indistinguishable. The difference in winning probabilities is bounded by the PRF advantage.`,
          rubric: [ { points: 1, text: R`Replace the PRF by a truly random function` },
                    { points: 1, text: R`$f(r)$ uniform and independent of $m$` },
                    { points: 1, text: R`OTP argument / information-theoretic independence` } ] },
        { label: "c", points: 2,
          prompt: R`What happens if $r$ is kept fixed (e.g. $r=0$)?`,
          hints: [R`Compare two encryptions of the same message.`],
          solution: R`Then the ciphertext is deterministic: $c = F(k,0)\oplus m$. The attacker can have $m_0$ and $m_1$ encrypted itself and compare the ciphertexts with $c_b$. The scheme is not CPA-secure. Fresh $r$ is essential.`,
          rubric: [ { points: 1, text: R`Deterministic / same message, same ciphertext` },
                    { points: 1, text: R`CPA attack by comparison` } ] }
      ] },
    { id: "u4-prob-schnorr-attack", type: "problem", lecture: 4, topic: "signatures", origin: "variant",
      source: "Variant of Midterm 2025/26, Problem 3; Exercise sheet 2, Problem 5", difficulty: 3,
      title: "Schnorr: Correctness, Nonce Reuse and Challenge Binding",
      statement: R`Consider the Schnorr signature scheme from the lecture with $vk = g^{sk}$, $R = g^r$, $h = H(vk,R,m)$ and $s = sk \cdot h + r \pmod q$.`,
      mock: true,
      parts: [
        { label: "a", points: 2,
          prompt: R`Show correctness.`,
          hints: [R`Substitute $s$ into $g^s$.`],
          solution: R`$g^s = g^{sk\cdot h + r} = g^r \cdot (g^{sk})^h = R \cdot vk^h$. Hence verification accepts every honestly generated signature.`,
          rubric: [ { points: 1, text: R`$g^{sk\cdot h+r}$ rearranged correctly` },
                    { points: 1, text: R`$R=g^r$, $vk=g^{sk}$ substituted` } ] },
        { label: "b", points: 3,
          prompt: R`Alice signs $m_1 \ne m_2$ with the same nonce $r$. Show how an observer computes $sk$ and state the success probability.`,
          hints: [R`Subtract the two signature equations.`,
                  R`When is $h_1-h_2$ invertible?`],
          solution: R`We have $s_1 = sk\cdot h_1 + r$ and $s_2 = sk\cdot h_2 + r$, hence
$$s_1-s_2 = sk(h_1-h_2) \pmod q.$$
Since $q$ is prime, $h_1-h_2$ is invertible exactly when $h_1 \ne h_2$. By the assumption of the exercise, two different hash inputs collide only with probability $1/p$ (or $1/q$), so $h_1 \ne h_2$ with probability $1 - 1/q$. Then
$$sk = (s_1-s_2)(h_1-h_2)^{-1} \pmod q.$$
Afterwards the attacker can sign any message; the scheme is broken.`,
          rubric: [ { points: 1, text: R`Equation $s_1-s_2 = sk(h_1-h_2)$` },
                    { points: 1, text: R`Inversion modulo $q$ and formula for $sk$` },
                    { points: 1, text: R`Success probability / hash collision discussed` } ] },
        { label: "c", points: 2,
          prompt: R`Is the scheme still secure if one derives $r \leftarrow F(k,vk)$ with a PRF $F$? Justify your answer.`,
          hints: [R`What is constant about $vk$?`],
          solution: R`No. $vk$ is constant for all signatures of the same Alice, so $r = F(k,vk)$ is constant too. This triggers exactly the nonce-reuse attack from (b). The PRF property does not help, because its input never varies.`,
          rubric: [ { points: 1, text: R`$vk$ constant ⇒ $r$ constant` },
                    { points: 1, text: R`Reference to the nonce-reuse attack` } ] }
      ] },
    { id: "u4-prob-hash-sign", type: "problem", lecture: 4, topic: "hashes", origin: "variant",
      source: "Variant of Lecture IV, slide 29; Midterm 2024/25, Problem 3", difficulty: 3,
      title: "Hash-and-Sign and Mix-and-Match",
      statement: R`A signature scheme $\Sigma$ signs messages of length $\lambda$. To sign longer messages, $m$ is split into blocks $m_1,\dots,m_{2\ell}$ of length $\lambda/2$. The new signature is
$$\mathrm{Sign}'(sk,m) = (\mathrm{Sign}(sk,\langle 1\rangle\|m_1),\dots,\mathrm{Sign}(sk,\langle 2\ell\rangle\|m_{2\ell})),$$
where $\langle i\rangle$ is the $\lambda/2$-bit encoding of $i$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Is this scheme EUF-CMA secure? Explain the intuition.`,
          hints: [R`Can signatures of different messages be combined?`,
                  R`Each block is signed separately.`],
          solution: R`No. An attacker can perform **mix-and-match**: it queries signatures for two messages and assembles a new, never-signed message from their block signatures. The block signatures are valid, because every block is signed individually and together with its position — but the combination is a new message.`,
          rubric: [ { points: 1, text: R`No` },
                    { points: 1, text: R`Mix-and-match idea` } ] },
        { label: "b", points: 3,
          prompt: R`Give the attack formally and analyze runtime and success probability.`,
          hints: [R`Choose two messages that differ in the first block.`,
                  R`Swap the first blocks and the corresponding signatures.`],
          solution: R`The attacker chooses two messages $m = m_1\|m_2\|\cdots\|m_{2\ell}$ and $m' = m_1'\|m_2'\|\cdots\|m_{2\ell}'$ with $m_1 \ne m_1'$. It queries both at the signing oracle and obtains
$$(s_1,\dots,s_{2\ell}) \quad\text{and}\quad (s_1',\dots,s_{2\ell}').$$
Then it outputs
$$m^* = m_1'\|m_2\|\cdots\|m_{2\ell}, \qquad \sigma^* = (s_1',s_2,\dots,s_{2\ell}).$$
Every block $s_i$ is a valid signature for $\langle i\rangle\|m_i$; for the first block, $s_1'$ is valid for $\langle 1\rangle\|m_1'$. Hence $\sigma^*$ verifies for $m^*$.

$m^*$ was never queried, because $m_1' \ne m_1$ and hence $m^* \ne m$; moreover $m^* \ne m'$, because the remaining blocks differ (or one chooses them accordingly). The attacker makes two queries and is efficient; the success probability is 1 (or overwhelming).`,
          rubric: [ { points: 1, text: R`Query two messages` },
                    { points: 1, text: R`Combine blocks and signatures correctly` },
                    { points: 1, text: R`New message, efficiency and success probability` } ] },
        { label: "c", points: 2,
          prompt: R`How does hash-and-sign prevent this problem?`,
          hints: [R`What happens to the entire message before signing?`],
          solution: R`With hash-and-sign, $H(m)$ is first computed over the **entire** message and then the fixed-length hash is signed. A block signature is then not a valid signature for a different overall message. The mix-and-match attack fails because the signature is bound to $H(m)$ and a collision would be required. Security is inherited from the collision resistance of $H$.`,
          rubric: [ { points: 1, text: R`Entire message is hashed` },
                    { points: 1, text: R`Binding to $H(m)$ / collision resistance` } ] }
      ] },
    { id: "u4-prob-collision", type: "problem", lecture: 4, topic: "hashes", origin: "variant",
      source: "Variant of Lecture IV, slides 33–37", difficulty: 2,
      title: "Why Keyed Hash Functions?",
      statement: "",
      parts: [
        { label: "a", points: 2,
          prompt: R`Explain the theoretical problem of an unkeyed, compressing hash function.`,
          hints: [R`There is a fixed collision.`,
                  R`The definition demands "hard for all keys".`],
          solution: R`For an unkeyed function $H: \{0,1\}^* \to \{0,1\}^n$ with $|\text{Input}| > n$, the pigeonhole principle guarantees at least one collision $(x_0,x_1)$. This collision is a fixed fact about the function. In theory an attacker could hardcode it and then always win, regardless of its computational power. The definition "negligible for all PPT attackers" is therefore unachievable if the collision is known.`,
          rubric: [ { points: 1, text: R`Fixed collision exists` },
                    { points: 1, text: R`Hardcoding breaks the definition` } ] },
        { label: "b", points: 2,
          prompt: R`Why does the keyed modeling help, and what does that mean for practice?`,
          hints: [R`The attacker sees the key $s$.`,
                  R`Can one hardcode the same collision for every key?`],
          solution: R`For the keyed hash $H^s$ the challenger chooses $s$ at random; the attacker sees $s$, but cannot hardcode a collision for every possible key. A collision for one concrete key is useless for another key. The definition "hard for all keys" therefore makes sense.

In practice, hash functions are usually unkeyed. One accepts the modeling as an idealization and says: colliding pairs are unknown and hard to find.`,
          rubric: [ { points: 1, text: R`Key chosen at random; hardcoding for all keys impossible` },
                    { points: 1, text: R`Practice: unkeyed, but collisions unknown/hard` } ] }
      ] }
  );
})();
