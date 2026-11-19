/* Unit 5 — Public-Key Crypto and Reductions
 * Sources: Lecture V (Public Key Crypto and Security Reductions), Exercise sheet 2.
 */
(function () {
  const R = String.raw;
  const add = (...items) => (window.TRAINER_BANK = window.TRAINER_BANK || []).push(...items);

  add(
    /* ---------------- notes ---------------- */
    { id: "u5-note-reductions", type: "note", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slides 4–19", difficulty: 2,
      title: "Security Reductions: The Proof Pattern",
      order: 10,
      body: R`### The idea

Let $H$ be a known primitive or a hardness assumption. A new primitive $G$ is constructed from $H$; $G$ uses $H$ and is supposed to have certain properties.

Proof by contradiction:

1. **Assumption:** There is an efficient attacker $A$ against $G$.
2. **Construction:** From $A$ one builds an efficient attacker $B$ against $H$ that uses $A$ as a subroutine.
3. **Contradiction:** $H$ is secure ⇒ $B$ cannot exist ⇒ $A$ cannot exist either ⇒ $G$ is secure.

### How to build the reduction

1. Start from the security game of the known primitive $H$ and the interfaces expected by $A$ (encryption/decryption oracle, PRF/PRG oracle or their random equivalents; direct interaction with the challenger).
2. $B$ simulates **all** interfaces for $A$, so that $A$ does not notice that it is running inside another algorithm.
3. $B$ solves the underlying hard problem using $A$'s output. This is the difficult part.

### What is graded in the exam

A complete reduction always contains:

- **Description of $B$:** What does $B$ do with its input? How does $B$ answer $A$'s queries?
- **Simulation:** Why does $A$ see exactly the game $G$? Case distinction according to the challenger's hidden bit.
- **Runtime:** $B$ is PPT if $A$ is PPT; the number of oracle queries is polynomial.
- **Success probability:** The advantage of $B$ is at least a constant fraction of the advantage of $A$ (or equal to it).
- **Conclusion:** Contradiction to the assumption that $H$ is secure.

### Example: $F'(k,x) := F(k,x\|0)$ is a PRF

A distinguisher $D'$ against $F'$ becomes a distinguisher $D$ against $F$: $D$ answers every query $x$ from $D'$ with its own oracle answer on $x\|0$. If the oracle is $F(k,\cdot)$, then $D'$ sees exactly $F'(k,\cdot)$. If it is a truly random function, then $D'$ sees a random function on the subset $\{x\|0\}$. The advantages are identical ⇒ no advantage for $D'$.

### Typical mistakes

- The simulation works only for one bit of the challenger, not for both.
- $B$ runs $A$ only once without justifying why one run suffices (amplification is needed if the advantage is small).
- The runtime is not analyzed.
- The conclusion "$A$ does not exist" is stated without the contradiction to the assumption.
- An attack is called "impossible" without computing the success probability.`
    },
    { id: "u5-note-dh", type: "note", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slides 18-35; Exercise sheet 2, Problems 3-4", difficulty: 3,
      title: "Diffie-Hellman, DDH and DLog",
      order: 20,
      body: R`### Key Exchange

A key-exchange protocol $\Pi$ has two requirements:

- **Correctness:** Both sides compute the same key, $k_A = k_B = k$.
- **Security (intuitively):** $\Pi$ is secure if $k$ is completely unknown to the attacker.

### Eavesdropper game

$\mathrm{KE}^{eav}_{A,\Pi}(\lambda)$:

1. $(\mathrm{trans}, k) \leftarrow \langle A(1^\lambda), B(1^\lambda) \rangle$
2. $b \leftarrow \{0,1\}$
3. If $b=0$: $k' \leftarrow k$; if $b=1$: $k' \leftarrow \{0,1\}^\lambda$
4. $b' \leftarrow A(k', \mathrm{trans})$
5. Output 1 if $b'=b$, otherwise 0.

**Definition:** $\Pi$ is secure against an eavesdropper if for every PPT attacker $A$ there exists a negligible function $\mathrm{negl}$ such that
$$\Pr[\mathrm{KE}^{eav}_{A,\Pi}(\lambda)=1] \le \frac12 + \mathrm{negl}(\lambda).$$

### Diffie-Hellman Key Exchange

$(G,q,g) \leftarrow \mathrm{Gen}(1^\lambda)$.

1. Alice: $x \leftarrow \mathbb{Z}_q$, $h_A \leftarrow g^x$, sends $(G,q,g,h_A)$.
2. Bob: $y \leftarrow \mathbb{Z}_q$, $h_B \leftarrow g^y$, sends $h_B$.
3. Alice: $k_A \leftarrow h_B^x$. Bob: $k_B \leftarrow h_A^y$.

**Correctness:**
$$k_A = h_B^x = (g^y)^x = g^{xy}, \qquad k_B = h_A^y = (g^x)^y = g^{xy}.$$

### The modified game $\mathrm{KE}'^{eav}$

In the real DH protocol the key is a **group element** $g^{xy}$, not a uniform $n$-bit string. Therefore the lecture uses a modified experiment: for $b=1$ the attacker receives a $k'$ drawn uniformly from $G$ instead of a uniform bit string.

**Theorem:** If DDH is hard relative to $\mathrm{Gen}$, then the DH protocol is secure against eavesdroppers (with respect to $\mathrm{KE}'^{eav}$).

### DDH

The **Decisional Diffie-Hellman** problem is hard relative to $\mathrm{Gen}$ if for all PPT algorithms $A$ there exists a negligible function $\mathrm{negl}$ such that
$$\left|\Pr[A(G,q,g,g^x,g^y,g^z)=1] - \Pr[A(G,q,g,g^x,g^y,g^{xy})=1]\right| \le \mathrm{negl}(\lambda),$$
where $(G,q,g) \leftarrow \mathrm{Gen}(1^\lambda)$ and $x,y,z \in \mathbb{Z}_q$ are uniform.

**Intuition:** An attacker cannot distinguish $g^{xy}$ from a random group element $g^z$.

### DLog

The **Discrete Logarithm** problem is hard relative to $\mathrm{Gen}$ if for all PPT algorithms $A$
$$\Pr[\mathrm{DLog}_{A,\mathrm{Gen}}(\lambda)=1] \le \mathrm{negl}(\lambda),$$
where $\mathrm{DLog}$ on input $(G,q,g,h)$ requires an $x$ with $g^x=h$.

### Where do the assumptions hold?

**Cyclic groups of prime order:**

- DLog is hardest there (Pohlig-Hellman does not apply).
- DDH is **easy** if the group order $q$ has small prime factors.
- Finding generators is easy: every element is a generator.

**$\mathbb{Z}_p^*$ and subgroups:**

- Problem: DDH is in general **not hard** in $\mathbb{Z}_p^*$.
- Solution: work in subgroups of $\mathbb{Z}_p^*$. Let $p = rq + 1$ with $p,q$ prime — then $\mathbb{Z}_p^*$ has a subgroup of order $q$.

### Relations

- **DDH hard ⇒ CDH hard.** If CDH were easy, one could compute $g^{xy}$ and compare it with $g^z$; DDH would be easy.
- **CDH hard ⇒ DLog hard.** If DLog were easy, one could compute $x$ from $g^x$ and then $(g^y)^x = g^{xy}$; CDH would be easy.
- The converses do not hold in general.`
    },
    { id: "u5-note-elgamal", type: "note", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slides 29–35; Exercise sheet 2, Problem 1", difficulty: 3,
      title: "Public-Key Encryption and ElGamal",
      order: 30,
      body: R`### Public-Key Encryption Scheme

Three PPT algorithms:

- $(sk,pk) \leftarrow \mathrm{KGen}(1^\lambda)$: private key $sk$, public key $pk$.
- $c \leftarrow \mathrm{Enc}(pk,m)$: encrypt with the public key.
- $m \leftarrow \mathrm{Dec}(sk,c)$: decrypt with $sk$; $\mathrm{Dec}$ is w.l.o.g. deterministic.

**Correctness:** For every $\lambda$, every $(sk,pk)$ output by $\mathrm{KGen}(1^\lambda)$ and every $m \in \{0,1\}^*$,
$$\mathrm{Dec}(sk,\mathrm{Enc}(pk,m)) = m.$$

### CPA game for PKE

$\mathrm{PubK}^{cpa}_{A,\Pi}(\lambda)$:

1. $(sk,pk) \leftarrow \mathrm{KGen}(1^\lambda)$
2. $(m_0,m_1) \leftarrow A(pk)$, with $|m_0|=|m_1|$
3. $b \leftarrow \{0,1\}$
4. $c_b \leftarrow \mathrm{Enc}(pk,m_b)$
5. $b' \leftarrow A(c_b)$
6. Output $b' = b$

**Difference from the private-key case:** The attacker knows $pk$ and can therefore encrypt itself — an encryption oracle is superfluous.

### Notation of the lecture

- $g^x = [x]$ for group elements with known generator $g$.
- $x \leftarrow X$: uniform sampling.
- $\mathrm{negl}(\lambda)$: for every $k \in \mathbb{N}$ there exists a $\lambda_0$ such that $|\mathrm{negl}(\lambda)| \le \lambda^{-k}$ for all $\lambda \ge \lambda_0$.

### ElGamal

| KGen($\lambda$) | Enc($pk,m$) | Dec($sk,c$) |
| --- | --- | --- |
| $(G,q,g) \leftarrow \mathrm{Pgen}(1^\lambda)$ | $m \in G$ | $(c_1,c_2) := c$ |
| $x \leftarrow \mathbb{Z}_q$ | $y \leftarrow \mathbb{Z}_q$ | $m := c_2 / c_1^x$ |
| $h := [x]$ | $c_1 := [y]$ | return $m$ |
| $sk := \langle G,q,g,x\rangle$ | $c_2 := pk^y \cdot m$ | |
| $pk := \langle G,q,g,h\rangle$ | return $(c_1,c_2)$ | |

**Correctness:**
$$\frac{c_2}{c_1^x} = \frac{pk^y \cdot m}{g^{xy}} = \frac{g^{xy} \cdot m}{g^{xy}} = m.$$

**Structure:** $c_1$ is a DH value (ephemeral), and $c_2$ masks $m$ with the shared secret $pk^y = g^{xy}$ — the same idea as the DH key exchange, only as encryption.

### Security

**Theorem:** If DDH is hard relative to $\mathrm{Gen}$, then ElGamal is CPA-secure.

**Reduction (Exercise sheet 2, Problem 1):** $B$ receives a DDH tuple $(G,q,g,g^x,g^y,g^z)$ and sets $pk := g^x$. $A$ returns $m_0,m_1$. $B$ chooses $b$, sets $c_1 := g^y$ and $c_2 := g^z \cdot m_b$, and sends $(c_1,c_2)$ to $A$. If $A$ outputs $b'$, then $B$ outputs $0$ when $b'=b$ and $1$ otherwise.

- If $z = xy$, then $(c_1,c_2)$ is a real ElGamal encryption of $m_b$.
- If $z$ is uniform, then $g^z$ is uniform and so is $g^z \cdot m_b$; the ciphertext contains no information about $m_b$.

The advantage of $B$ against DDH is exactly the advantage of $A$ against ElGamal. $B$ is PPT: it runs $A$ once and performs one group multiplication $Z \cdot m_b$; the group elements come from the DDH tuple, so no exponentiation is needed.

### Why the converse does not hold automatically

ElGamal is CPA-secure under DDH, but not automatically CCA-secure: an attacker with a decryption oracle can modify the ciphertext and observe the answer. For the lecture the CPA reduction suffices.`
    },

    /* ---------------- cards ---------------- */
    { id: "u5-card-reduction", type: "card", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slide 10", difficulty: 1,
      front: R`What is the goal of a security reduction?`,
      back: R`To turn an attacker $A$ against the new primitive $G$ into an efficient attacker $B$ against the known primitive $H$. Because $H$ is secure, $A$ cannot exist.` },
    { id: "u5-card-reduction-steps", type: "card", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slides 11–14", difficulty: 2,
      front: R`Name the four components of a complete reduction.`,
      back: R`Description of $B$; simulation of $A$'s view; runtime analysis; analysis of the success probability (plus contradiction).` },
    { id: "u5-card-dh", type: "card", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slide 21", difficulty: 1,
      front: R`How does the Diffie-Hellman key exchange work?`,
      back: R`Alice chooses $x$, sends $g^x$; Bob chooses $y$, sends $g^y$; both compute $g^{xy}$. Correctness: $(g^y)^x = (g^x)^y$.` },
    { id: "u5-card-ke-eav", type: "card", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slides 19–20", difficulty: 2,
      front: R`What does eavesdropper security of a key-exchange protocol require?`,
      back: R`The attacker sees the transcript and receives either the real key or a uniform key. It may distinguish the two only with advantage $\mathrm{negl}(\lambda)$; $\Pr[\mathrm{KE}^{eav}=1] \le \tfrac12 + \mathrm{negl}(\lambda)$.` },
    { id: "u5-card-ke-prime", type: "card", lecture: 5, topic: "public-key", origin: "variant",
      source: "Variant of Lecture V, slide 22", difficulty: 2,
      front: R`Why does the theorem use $\mathrm{KE}'^{eav}$ instead of $\mathrm{KE}^{eav}$?`,
      back: R`The DH key is a group element $g^{xy}$, not a uniform bit string. $\mathrm{KE}'^{eav}$ replaces it for $b=1$ by a uniform group element, matching the DDH distribution.` },
    { id: "u5-card-ddh", type: "card", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slide 24", difficulty: 2,
      front: R`Define the DDH assumption.`,
      back: R`For all PPT $A$, $\left|\Pr[A(g,g^x,g^y,g^z)=1] - \Pr[A(g,g^x,g^y,g^{xy})=1]\right|$ is negligible, with uniform $x,y,z \in \mathbb{Z}_q$.` },
    { id: "u5-card-dlog", type: "card", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slides 25–26", difficulty: 1,
      front: R`What does the Discrete Logarithm problem require?`,
      back: R`Given input $(G,q,g,h)$, find an $x$ with $g^x = h$. It is hard if every PPT attacker succeeds only with negligible probability.` },
    { id: "u5-card-ddh-cdh", type: "card", lecture: 5, topic: "public-key", origin: "exercise",
      source: "Exercise sheet 2, Problem 3", difficulty: 2,
      front: R`What relation holds between DDH, CDH and DLog?`,
      back: R`DDH hard ⇒ CDH hard ⇒ DLog hard. The converses do not hold in general.` },
    { id: "u5-card-ddh-zp", type: "card", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slide 27; Exercise sheet 2, Problem 3.2", difficulty: 3,
      front: R`Why is DDH in general not hard in $\mathbb{Z}_p^*$?`,
      back: R`The Legendre symbol reveals the parity of the exponent: $h^{(p-1)/2}=1$ exactly when the exponent is even. From this one can distinguish $g^{xy}$ from $g^z$. In the prime-order subgroup $q$ this leak disappears.` },
    { id: "u5-card-prime-order", type: "card", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slide 27", difficulty: 2,
      front: R`Why does one work in a prime-order subgroup $q \mid p-1$?`,
      back: R`DDH is not hard in $\mathbb{Z}_p^*$. Let $p = rq+1$ with $p,q$ prime; then $\mathbb{Z}_p^*$ has a subgroup of order $q$ in which DDH is a meaningful assumption.` },
    { id: "u5-card-pke", type: "card", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slide 29", difficulty: 1,
      front: R`Name the three algorithms of a public-key encryption scheme.`,
      back: R`$\mathrm{KGen}(1^\lambda) \to (sk,pk)$, $\mathrm{Enc}(pk,m) \to c$, $\mathrm{Dec}(sk,c) \to m$.` },
    { id: "u5-card-pke-cpa", type: "card", lecture: 5, topic: "public-key", origin: "variant",
      source: "Variant of Lecture V, slide 31", difficulty: 2,
      front: R`Why does the PKE-CPA game not need an encryption oracle?`,
      back: R`The attacker knows $pk$ and can encrypt itself. Public encryption replaces the oracle.` },
    { id: "u5-card-elgamal", type: "card", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slide 35", difficulty: 2,
      front: R`Write down ElGamal encryption.`,
      back: R`$pk = g^x$, $sk=x$. Enc: $y \leftarrow \mathbb{Z}_q$, $c_1 = g^y$, $c_2 = pk^y \cdot m$. Dec: $m = c_2 / c_1^x$.` },
    { id: "u5-card-elgamal-correct", type: "card", lecture: 5, topic: "public-key", origin: "exercise",
      source: "Exercise sheet 2, Problem 1", difficulty: 2,
      front: R`Why is ElGamal correct?`,
      back: R`$c_2/c_1^x = (pk^y \cdot m)/(g^y)^x = (g^{xy} \cdot m)/g^{xy} = m$. Decryption exactly inverts encryption.` },
    { id: "u5-card-elgamal-cpa", type: "card", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slide 35; Exercise sheet 2, Problem 1", difficulty: 3,
      front: R`How does one reduce the CPA security of ElGamal to DDH?`,
      back: R`$B$ sets $pk=g^x$, receives $m_0,m_1$, chooses $b$, sets $c_1=g^y$, $c_2=g^z m_b$. For $z=xy$ this is a real encryption, for uniform $z$ a random element. $B$ outputs $0$ if $A$ guessed its own challenge bit correctly and $1$ otherwise.` },
    { id: "u5-card-elgamal-ddh", type: "card", lecture: 5, topic: "public-key", origin: "variant",
      source: "Variant of Lecture V, slide 35", difficulty: 2,
      front: R`Under which assumption is ElGamal CPA-secure?`,
      back: R`Under DDH. ElGamal encryption is exactly a DDH tuple with a masked message.` },

    /* ---------------- true / false ---------------- */
    { id: "u5-tf-reduction", type: "tf", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slide 10", difficulty: 1,
      statement: R`A security reduction shows that an attacker against the new scheme yields an attacker against a primitive assumed to be secure.`,
      answer: true,
      explanation: R`This is the principle of contradiction: if the new scheme were broken, the old primitive would be broken as well.` },
    { id: "u5-tf-reduction-runtime", type: "tf", lecture: 5, topic: "public-key", origin: "variant",
      source: "Variant of Lecture V, slides 11–14", difficulty: 2,
      statement: R`For a complete reduction it suffices to describe the construction of $B$; runtime and success probability are optional.`,
      answer: false,
      explanation: R`Both analyses are mandatory. Without them it is not shown that $B$ is efficient and has a non-negligible advantage.` },
    { id: "u5-tf-dh-correct", type: "tf", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slide 21", difficulty: 1,
      statement: R`In the Diffie-Hellman key exchange both sides compute $g^{xy}$.`,
      answer: true,
      explanation: R`Alice computes $(g^y)^x$, Bob $(g^x)^y$; both are $g^{xy}$.` },
    { id: "u5-tf-ke-bitstring", type: "tf", lecture: 5, topic: "public-key", origin: "variant",
      source: "Variant of Lecture V, slide 22", difficulty: 2,
      statement: R`The DH key $g^{xy}$ is a uniform $n$-bit string.`,
      answer: false,
      explanation: R`It is a group element. This is why the theorem uses the modified game $\mathrm{KE}'^{eav}$ with a uniform group element.` },
    { id: "u5-tf-ddh", type: "tf", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slide 24", difficulty: 1,
      statement: R`DDH states that $g^{xy}$ is hard to distinguish from a random group element $g^z$.`,
      answer: true,
      explanation: R`This is the Decisional-DH assumption; it is an indistinguishability assumption.` },
    { id: "u5-tf-dlog-search", type: "tf", lecture: 5, topic: "public-key", origin: "variant",
      source: "Variant of Lecture V, slides 25–26", difficulty: 1,
      statement: R`DLog is a search problem, DDH a decision problem.`,
      answer: true,
      explanation: R`DLog requires computing $x$ from $g^x$; DDH requires distinguishing two distributions.` },
    { id: "u5-tf-ddh-cdh", type: "tf", lecture: 5, topic: "public-key", origin: "exercise",
      source: "Exercise sheet 2, Problem 3", difficulty: 2,
      statement: R`If DDH is hard, then CDH is hard as well.`,
      answer: true,
      explanation: R`If CDH were easy, one could compute $g^{xy}$ and decide DDH by comparison with $g^z$.` },
    { id: "u5-tf-cdh-dlog", type: "tf", lecture: 5, topic: "public-key", origin: "exercise",
      source: "Exercise sheet 2, Problem 3", difficulty: 2,
      statement: R`If CDH is hard, then DLog is hard as well.`,
      answer: true,
      explanation: R`If DLog were easy, one could compute $x$ from $g^x$ and then compute $g^{xy}$; CDH would be easy.` },
    { id: "u5-tf-ddh-zp", type: "tf", lecture: 5, topic: "public-key", origin: "exercise",
      source: "Exercise sheet 2, Problem 3.2", difficulty: 3,
      statement: R`DDH is in general hard in $\mathbb{Z}_p^*$ because the group is cyclic.`,
      answer: false,
      explanation: R`The cyclic structure alone does not help. The Legendre symbol leaks the parity of the exponent; that is why DDH is in general not hard in $\mathbb{Z}_p^*$.` },
    { id: "u5-tf-prime-subgroup", type: "tf", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slide 27", difficulty: 2,
      statement: R`For $p = rq+1$ with $p,q$ prime, $\mathbb{Z}_p^*$ has a subgroup of order $q$.`,
      answer: true,
      explanation: R`This is the standard construction for using DDH in a prime-order subgroup.` },
    { id: "u5-tf-pke-oracle", type: "tf", lecture: 5, topic: "public-key", origin: "variant",
      source: "Variant of Lecture V, slide 31", difficulty: 2,
      statement: R`In the PKE-CPA game the attacker needs an encryption oracle because it does not know the public key.`,
      answer: false,
      explanation: R`The attacker knows $pk$ and can encrypt itself. The oracle is superfluous.` },
    { id: "u5-tf-elgamal-correct", type: "tf", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slide 35", difficulty: 1,
      statement: R`ElGamal is correct because $c_2/c_1^x = m$.`,
      answer: true,
      explanation: R`$c_2/c_1^x = (g^{xy}m)/g^{xy} = m$.` },
    { id: "u5-tf-elgamal-cpa", type: "tf", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slide 35; Exercise sheet 2, Problem 1", difficulty: 2,
      statement: R`ElGamal is CPA-secure under the DDH assumption.`,
      answer: true,
      explanation: R`The reduction maps a DDH tuple to an ElGamal challenge.` },
    { id: "u5-tf-elgamal-cca", type: "tf", lecture: 5, topic: "public-key", origin: "variant",
      source: "Variant of Lecture V, slide 35", difficulty: 2,
      statement: R`CCA security follows automatically from the CPA security of ElGamal.`,
      answer: false,
      explanation: R`CPA security is weaker than CCA. A decryption oracle can enable additional attacks; the lecture only shows CPA.` },

    /* ---------------- multiple choice ---------------- */
    { id: "u5-mc-reduction", type: "mc", lecture: 5, topic: "public-key", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(i)", difficulty: 1,
      question: R`What is the central idea of a security proof by reduction?`,
      options: [
        R`Build a simulator that imitates all actions of the attacker and shows that it cannot distinguish under any input distribution.`,
        R`Assume that an efficient attacker breaks the scheme and turn it into an algorithm that violates an underlying hardness assumption.`,
        R`Map every attack to an indistinguishable execution in the random-oracle model.`,
        R`Make the advantage negligible for every attacker by restricting the oracle queries.`
      ],
      correct: 1,
      explanation: R`The official solution is (b). The reduction transforms an attacker into a solver of the hardness assumption.` },
    { id: "u5-mc-dh-key", type: "mc", lecture: 5, topic: "public-key", origin: "variant",
      source: "Variant of Lecture V, slide 21", difficulty: 1,
      question: R`Which key does Alice compute in the DH key exchange if she has $x$ and Bob's $g^y$?`,
      options: [R`$g^x$`, R`$g^y$`, R`$g^{xy}$`, R`$g^{x+y}$`],
      correct: 2,
      explanation: R`Alice computes $(g^y)^x = g^{xy}$.` },
    { id: "u5-mc-ke-security", type: "mc", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slides 19–20", difficulty: 2,
      question: R`What does the attacker receive in the eavesdropper game in addition to the transcript?`,
      options: [
        R`Always the real key`,
        R`Always a uniform bit string`,
        R`Depending on the bit, the real key or a uniform key, and must guess the bit`,
        R`Alice's private key`
      ],
      correct: 2,
      explanation: R`For $b=0$ the real key, for $b=1$ a uniform one; the attacker must guess $b$.` },
    { id: "u5-mc-ddh", type: "mc", lecture: 5, topic: "public-key", origin: "variant",
      source: "Variant of Lecture V, slide 24", difficulty: 1,
      question: R`Which two distributions must a DDH attacker distinguish?`,
      options: [
        R`$(g^x,g^y,g^{xy})$ and $(g^x,g^y,g^z)$`,
        R`$(g^x,g^y)$ and $(g^{x+y})$`,
        R`$(g^x,g^y,g^z)$ and $(g^x,g^y,g^{x+y})$`,
        R`$(g,g^x)$ and $(g,g^{x^2})$`
      ],
      correct: 0,
      explanation: R`DDH compares the real DH triple with a random group element.` },
    { id: "u5-mc-dlog", type: "mc", lecture: 5, topic: "public-key", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(xi)", difficulty: 1,
      question: R`What is the essential difference between DDH and DLog?`,
      options: [
        R`DDH assumes the hardness of the discrete logarithm, DLog the indistinguishability of group elements.`,
        R`DDH assumes the indistinguishability of group elements, DLog the hardness of computing the discrete logarithm.`,
        R`DDH is harder to break than DLog.`,
        R`DLog is a decision problem, DDH a search problem.`
      ],
      correct: 1,
      explanation: R`The official solution is (b). DDH is decisional, DLog computational.` },
    { id: "u5-mc-ddh-zp", type: "mc", lecture: 5, topic: "public-key", origin: "exercise",
      source: "Exercise sheet 2, Problem 3.2", difficulty: 3,
      question: R`Why is DDH in general not hard in $\mathbb{Z}_p^*$?`,
      options: [
        R`Because $\mathbb{Z}_p^*$ is not cyclic.`,
        R`Because the Legendre symbol reveals the parity of the exponent and thus makes $g^{xy}$ distinguishable from $g^z$.`,
        R`Because $p$ is always even.`,
        R`Because DLog is easy in $\mathbb{Z}_p^*$.`
      ],
      correct: 1,
      explanation: R`$h^{(p-1)/2}=1$ exactly when the exponent is even. That suffices for a DDH distinguisher.` },
    { id: "u5-mc-elgamal", type: "mc", lecture: 5, topic: "public-key", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(xii)", difficulty: 1,
      question: R`Why is ElGamal correct?`,
      options: [
        R`Because decryption exactly inverts the encryption steps using the private key.`,
        R`Because the ciphertext is generated deterministically.`,
        R`Because the scheme uses a secure PRF.`,
        R`Because $c_2$ does not depend on the randomness $y$.`
      ],
      correct: 0,
      explanation: R`The official solution is (a). $c_2/c_1^x = m$; decryption inverts encryption.` },
    { id: "u5-mc-pke-cpa", type: "mc", lecture: 5, topic: "public-key", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(xiii)", difficulty: 2,
      question: R`What guarantees the indistinguishability of $c_0$ and $c_1$ in the CPA game for public-key encryption?`,
      options: [
        R`The ciphertext is generated with a unique session key per encryption.`,
        R`The attacker has no access to the private key.`,
        R`The encryption function is deterministic.`,
        R`The encryption function hides all information about the plaintext except its length.`
      ],
      correct: 3,
      explanation: R`The official solution is (d). CPA security means that the ciphertext reveals nothing but the length.` },
    { id: "u5-mc-dlog-assumption", type: "mc", lecture: 5, topic: "public-key", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(xiv)", difficulty: 2,
      question: R`What is a primary limitation of the discrete-logarithm assumption in certain groups?`,
      options: [
        R`It is not defined for cyclic groups of prime order.`,
        R`It assumes that group elements are indistinguishable from random strings.`,
        R`It does not hold in general in groups of composite order.`,
        R`It cannot be used for the security of symmetric encryption.`
      ],
      correct: 2,
      explanation: R`The official solution is (c). In groups of composite order Pohlig-Hellman can attack; prime order is the safe choice.` },
    { id: "u5-mc-elgamal-cipher", type: "mc", lecture: 5, topic: "public-key", origin: "variant",
      source: "Variant of Lecture V, slide 35", difficulty: 2,
      question: R`What role does $c_1 = g^y$ play in ElGamal?`,
      options: [
        R`It is the masked message.`,
        R`It is the ephemeral DH value with which the receiver computes $c_1^x = g^{xy}$.`,
        R`It is the receiver's private key.`,
        R`It is the signature of the message.`
      ],
      correct: 1,
      explanation: R`$c_1$ allows the receiver to compute the shared secret $g^{xy}$ with $x$ and to unmask $c_2$.` },
    { id: "u5-mc-prime-order", type: "mc", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slide 27", difficulty: 2,
      question: R`Why does one choose a prime-order subgroup $q$ for DDH?`,
      options: [
        R`Because DDH is in general easy in $\mathbb{Z}_p^*$ and the prime-order subgroup avoids the Legendre leak.`,
        R`Because DLog is easy in $\mathbb{Z}_p^*$.`,
        R`Because prime order automatically guarantees CPA security.`,
        R`Because then one does not need exponentiation.`
      ],
      correct: 0,
      explanation: R`The prime-order subgroup is the standard solution against the Legendre attack on DDH in $\mathbb{Z}_p^*$.` },
    { id: "u5-mc-reduction-analysis", type: "mc", lecture: 5, topic: "public-key", origin: "variant",
      source: "Variant of Lecture V, slides 11–14", difficulty: 2,
      question: R`Which statement does **not** belong in a complete reduction?`,
      options: [
        R`The description of how $B$ answers $A$'s queries.`,
        R`The runtime analysis of $B$.`,
        R`The analysis of the success probability.`,
        R`The claim that $A$ does not exist for practical reasons, without a contradiction to the assumption.`
      ],
      correct: 3,
      explanation: R`The conclusion must run via the contradiction to the security of $H$, not via a practical claim.` },

    /* ---------------- gaps ---------------- */
    { id: "u5-gap-ddh", type: "gap", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slide 24", difficulty: 2,
      title: "Decisional Diffie-Hellman", points: 4,
      text: R`DDH is hard relative to $\mathrm{Gen}$ if for all PPT algorithms $A$ the distance <gap>$\left|\Pr[A(G,q,g,g^x,g^y,g^z)=1] - \Pr[A(G,q,g,g^x,g^y,g^{xy})=1]\right|$</gap> is negligible, where <gap>$(G,q,g) \leftarrow \mathrm{Gen}(1^\lambda)$</gap> and <gap>$x,y,z \in \mathbb{Z}_q$ are uniform</gap>. DDH is a <gap>decision problem</gap>.`,
      note: R`DLog is the corresponding search problem: compute $x$ from $g^x$.` },
    { id: "u5-gap-dlog", type: "gap", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slides 25–26", difficulty: 2,
      title: "Discrete Logarithm", points: 3,
      text: R`In the $\mathrm{DLog}$ game $A$ receives <gap>$(G,q,g,h)$</gap> and outputs <gap>an $x$ with $g^x=h$</gap>. The problem is hard if <gap>$\Pr[\mathrm{DLog}_{A,\mathrm{Gen}}(\lambda)=1] \le \mathrm{negl}(\lambda)$</gap> for all PPT $A$.`,
      note: R`DLog is hardest in cyclic groups of prime order; Pohlig-Hellman applies when there are small prime factors.` },
    { id: "u5-gap-elgamal", type: "gap", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slide 35", difficulty: 2,
      title: "ElGamal", points: 5,
      text: R`In ElGamal $pk = $ <gap>$g^x$</gap> and $sk = x$. Encryption: $y \leftarrow \mathbb{Z}_q$, <gap>$c_1 = g^y$</gap>, <gap>$c_2 = pk^y \cdot m$</gap>. Decryption: <gap>$m = c_2 / c_1^x$</gap>. CPA security follows from <gap>DDH</gap>.`,
      note: R`$c_1$ is the ephemeral DH value; $c_2$ masks $m$ with $g^{xy}$.` },
    { id: "u5-gap-ke", type: "gap", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slides 19–22", difficulty: 2,
      title: "Eavesdropper Security", points: 4,
      text: R`A key-exchange protocol is secure against an eavesdropper if for every PPT attacker $A$ <gap>$\Pr[\mathrm{KE}^{eav}_{A,\Pi}(\lambda)=1] \le \tfrac12 + \mathrm{negl}(\lambda)$</gap>. In the modified game $\mathrm{KE}'^{eav}$ the attacker receives for $b=1$ <gap>a uniform group element</gap> instead of a uniform bit string. The theorem reduces security to <gap>DDH</gap> and requires <gap>a runtime and advantage analysis</gap>.`,
      note: R`The real DH key is a group element; that is why $\mathrm{KE}'^{eav}$ is the appropriate formulation.` },
    { id: "u5-gap-reduction", type: "gap", lecture: 5, topic: "public-key", origin: "slides",
      source: "Lecture V, slides 10–14", difficulty: 2,
      title: "Reduction Proof", points: 4,
      text: R`In a reduction one assumes a PPT attacker <gap>$A$ against the new primitive $G$</gap> and builds from it a PPT attacker <gap>$B$ against the known primitive $H$</gap>. $B$ must <gap>perfectly simulate</gap> the view of $A$. Then one analyzes <gap>runtime and success probability</gap>. The contradiction to the security of $H$ shows that $A$ does not exist.`,
      note: R`Without the analysis of runtime and advantage the proof is incomplete.` },

    /* ---------------- problems ---------------- */
    { id: "u5-prob-elgamal-cpa", type: "problem", lecture: 5, topic: "public-key", origin: "exercise",
      source: "Exercise sheet 2, Problem 1", difficulty: 3,
      title: "ElGamal is CPA-Secure under DDH",
      statement: R`Let $\Pi_{EG} = (\mathrm{KGen}, \mathrm{Enc}, \mathrm{Dec})$ be the ElGamal scheme over a cyclic group $G$ of prime order $q$ with generator $g$. Prove: if DDH is hard relative to $\mathrm{Gen}$, then $\Pi_{EG}$ is CPA-secure.`,
      mock: true,
      parts: [
        { label: "a", points: 2,
          prompt: R`Describe the reduction: how does $B$ turn a DDH tuple into an ElGamal challenge for $A$?`,
          hints: [R`$B$ receives $(G,q,g,g^x,g^y,g^z)$ and must set $pk$.`,
                  R`$A$ returns $m_0,m_1$; $B$ chooses $b$.`],
          solution: R`$B$ receives a DDH tuple $(G,q,g,X,Y,Z) = (G,q,g,g^x,g^y,g^z)$.

1. $B$ sets $pk := X = g^x$ and sends $pk$ to $A$.
2. $A$ returns $m_0,m_1$ with $|m_0|=|m_1|$.
3. $B$ chooses $b \leftarrow \{0,1\}$ and sets $c_1 := Y = g^y$, $c_2 := Z \cdot m_b$.
4. $B$ sends $(c_1,c_2)$ to $A$.
5. $A$ outputs $b'$; $B$ outputs $0$ if $b'=b$, and $1$ otherwise.

$B$ thus simulates exactly the CPA game, without knowing $x$ or $y$.`,
          rubric: [ { points: 1, text: R`$pk := g^x$` },
                    { points: 1, text: R`$c_1 := g^y$, $c_2 := g^z \cdot m_b$` } ] },
        { label: "b", points: 3,
          prompt: R`Show the case distinction: what does $A$ see if $z=xy$, and what if $z$ is uniform?`,
          hints: [R`For $z=xy$ we have $c_2 = g^{xy} m_b$.`,
                  R`For uniform $z$, $g^z$ is uniform; multiplication by $m_b$ is a bijection.`],
          solution: R`**Case $z = xy$:** $c_1 = g^y$, $c_2 = g^{xy} \cdot m_b = pk^y \cdot m_b$. This is exactly a real ElGamal encryption of $m_b$ under $pk$. $A$ sees the CPA game with $b$.

**Case $z$ uniform:** $g^z$ is uniform in $G$. For fixed $m_b \in G$ the map $u \mapsto u \cdot m_b$ is a bijection (Lemma 1.1), so $c_2$ is uniform in $G$ and independent of $m_b$. $A$ sees a ciphertext that contains no information about $b$; its advantage is 0.

With this mapping, when $z=xy$, $B$ outputs $0$ with probability $\tfrac12+\varepsilon_A$; when $z$ is uniform, $B$ outputs $1$ with probability $\tfrac12$. Hence the advantage of $B$ against DDH is exactly the advantage of $A$ against ElGamal.`,
          rubric: [ { points: 1, text: R`Case $z=xy$: real encryption` },
                    { points: 1, text: R`Case $z$ uniform: $c_2$ uniform/independent` },
                    { points: 1, text: R`Advantages equated` } ] },
        { label: "c", points: 2,
          prompt: R`Analyze the runtime and success probability of $B$.`,
          hints: [R`$B$ performs one group multiplication $Z \cdot m_b$; the tuple already contains the group elements.`,
                  R`$B$ runs $A$ once.`],
          solution: R`**Runtime:** $B$ runs $A$ once, performs one multiplication $Z \cdot m_b$ and no other expensive operations (the group elements come ready-made from the DDH tuple). If $A$ is PPT, then $B$ is PPT.

**Success probability:** Let $\varepsilon_A$ be the advantage of $A$ in the ElGamal CPA game. Then
$$\left|\Pr[B(G,q,g,g^x,g^y,g^{xy})=1] - \Pr[B(G,q,g,g^x,g^y,g^z)=1]\right| = \varepsilon_A.$$
So the DDH advantage of $B$ is at least $\varepsilon_A$. If $\varepsilon_A$ is not negligible, then the DDH advantage is not negligible either — a contradiction.`,
          rubric: [ { points: 1, text: R`Runtime: $A$ once, polynomial` },
                    { points: 1, text: R`Advantage $\varepsilon_A$ / contradiction to DDH` } ] }
      ] },
    { id: "u5-prob-dh-eav", type: "problem", lecture: 5, topic: "public-key", origin: "exercise",
      source: "Exercise sheet 2, Problem 4", difficulty: 3,
      title: "DH Key Exchange is Secure under DDH",
      statement: R`Consider the Diffie-Hellman key-exchange protocol. Prove: if DDH is hard relative to $\mathrm{Gen}$, then the protocol is secure in the modified eavesdropper game $\mathrm{KE}'^{eav}$.`,
      mock: true,
      parts: [
        { label: "a", points: 3,
          prompt: R`Describe the reduction. How does $B$ produce the transcript and the key $k'$ without knowing $x$ and $y$?`,
          hints: [R`$B$ receives $(g^x,g^y,g^z)$ and sets $h_A := g^x$, $h_B := g^y$, $k' := g^z$.`,
                  R`The transcript is $(G,q,g,g^x,g^y)$.`],
          solution: R`$B$ receives a DDH tuple $(G,q,g,X,Y,Z)=(G,q,g,g^x,g^y,g^z)$.

1. $B$ sets the transcript $\mathrm{trans} := (G,q,g,X,Y)$.
2. $B$ sets $k' := Z$.
3. $B$ gives $(\mathrm{trans}, k')$ to $A$.
4. $B$ outputs $A$'s bit.

$B$ does not know $x$ and $y$, and it does not need to.`,
          rubric: [ { points: 1, text: R`Transcript from $g^x,g^y$` },
                    { points: 1, text: R`Key $k' := g^z$` },
                    { points: 1, text: R`$B$ outputs $A$'s bit` } ] },
        { label: "b", points: 3,
          prompt: R`Show that $B$ perfectly simulates the two cases of $\mathrm{KE}'^{eav}$, and analyze runtime and advantage.`,
          hints: [R`$b=0$: real DH key $g^{xy}$.`,
                  R`$b=1$: uniform group element.`],
          solution: R`**Case $z=xy$:** $k'=g^{xy}$ is the real DH key. $A$ sees $\mathrm{KE}'^{eav}$ with $b=0$.

**Case $z$ uniform:** $k'=g^z$ is a uniform group element. $A$ sees $\mathrm{KE}'^{eav}$ with $b=1$.

Hence
$$\Pr[B^{DDH}(1^\lambda)=1] = \Pr[\mathrm{KE}'^{eav}_{A,\Pi}(\lambda)=1],$$
and the advantage of $B$ is exactly the advantage of $A$. $B$ runs $A$ once, performs no exponentiations (the elements are given) and is PPT. Contradiction to the DDH assumption.`,
          rubric: [ { points: 1, text: R`$z=xy$: real key / $b=0$` },
                    { points: 1, text: R`$z$ uniform: uniform group element / $b=1$` },
                    { points: 1, text: R`Runtime and advantage equal` } ] },
        { label: "c", points: 1,
          prompt: R`Why does the theorem use $\mathrm{KE}'^{eav}$ instead of $\mathrm{KE}^{eav}$?`,
          hints: [R`What kind of object is $g^{xy}$?`],
          solution: R`$g^{xy}$ is a group element, not a uniform bit string. $\mathrm{KE}'^{eav}$ replaces the key for $b=1$ by a uniform group element from $G$; only then does the distribution match the DDH assumption.`,
          rubric: [ { points: 1, text: R`DH key is a group element, not a bit string` } ] }
      ] },
    { id: "u5-prob-ddh-relations", type: "problem", lecture: 5, topic: "public-key", origin: "exercise",
      source: "Exercise sheet 2, Problem 3", difficulty: 3,
      title: "DDH, CDH and DLog",
      statement: R`Let $\mathrm{GGen}(1^\lambda)$ be a group generator that outputs a cyclic group $G$ of prime order $q$ with generator $g$. The CDH game gives $(G,q,g,g^x,g^y)$ and requires $g^{xy}$.`,
      mock: true,
      parts: [
        { label: "a", points: 3,
          prompt: R`Show: if DDH is hard, then CDH is hard. Give the reduction and its analysis.`,
          hints: [R`Suppose there is a CDH solver $C$.`,
                  R`Build a DDH distinguisher from it: compute $g^{xy}$ and compare with $g^z$.`],
          solution: R`Suppose there is a PPT CDH solver $C$ with non-negligible success. Construct the DDH distinguisher $B$:

1. $B$ receives $(G,q,g,X,Y,Z)$.
2. $B$ computes $W := C(G,q,g,X,Y)$.
3. $B$ outputs 1 if $W = Z$, otherwise 0.

**Case $Z=g^{xy}$:** $C$ computes $g^{xy}$ (with non-negligible probability), so $W=Z$ and $B$ outputs 1.

**Case $Z=g^z$ uniform:** $W=g^{xy}$ is a fixed group element; the probability that $Z$ equals $W$ is $1/q$, which is negligible.

Hence $B$ distinguishes the two distributions with non-negligible advantage — a contradiction to DDH. $B$ is PPT, because $C$ is PPT.`,
          rubric: [ { points: 1, text: R`DDH distinguisher $B$ from CDH solver` },
                    { points: 1, text: R`Case $Z=g^{xy}$: $B$ outputs 1` },
                    { points: 1, text: R`Case $Z$ uniform: hit probability $1/q$` } ] },
        { label: "b", points: 3,
          prompt: R`Show: if CDH is hard, then DLog is hard.`,
          hints: [R`Suppose there is a DLog solver $D$.`,
                  R`Compute $x$ from $g^x$ and then $(g^y)^x$.`],
          solution: R`Suppose there is a PPT DLog solver $D$. Construct the CDH solver $B$:

1. $B$ receives $(G,q,g,X,Y)$.
2. $B$ computes $x := D(G,q,g,X)$.
3. $B$ outputs $Y^x = g^{xy}$.

$B$ is PPT, because $D$ is PPT, and it computes $g^{xy}$ with the same probability with which $D$ finds the discrete logarithm. If that probability is not negligible, CDH is broken — a contradiction.`,
          rubric: [ { points: 1, text: R`$x := D(G,q,g,g^x)$` },
                    { points: 1, text: R`$Y^x = g^{xy}$` },
                    { points: 1, text: R`Runtime and success probability` } ] },
        { label: "c", points: 1,
          prompt: R`Does the converse "CDH hard ⇒ DDH hard" hold? Briefly justify.`,
          hints: [R`DDH is stronger than CDH.`,
                  R`There are groups in which CDH is hard but DDH is easy.`],
          solution: R`No, not in general. DDH is a stronger assumption than CDH. In $\mathbb{Z}_p^*$, for example, CDH can be hard while DDH is easy via the Legendre symbol. DDH hard ⇒ CDH hard, but not conversely.`,
          rubric: [ { points: 1, text: R`No; DDH stronger than CDH / counterexample $\mathbb{Z}_p^*$` } ] }
      ] },
    { id: "u5-prob-ddh-zp", type: "problem", lecture: 5, topic: "public-key", origin: "exercise",
      source: "Exercise sheet 2, Problem 3.2", difficulty: 3,
      title: "DDH is not Hard in $\mathbb{Z}_p^*$",
      statement: R`Let $p>2$ be prime and $g$ a generator of $\mathbb{Z}_p^*$, a cyclic group of even order $p-1$. For $h=g^a$ we have: $h^{(p-1)/2}=1$ exactly when $a$ is even.`,
      parts: [
        { label: "a", points: 3,
          prompt: R`Construct a DDH distinguisher for $\mathbb{Z}_p^*$ and compute its advantage.`,
          hints: [R`Compute the parity of $x$, $y$ and $z$ via the Legendre symbol.`,
                  R`Use the **odd** indicator: $\mathrm{odd}(a)=1$ if $a$ is odd, otherwise 0. For $z=xy \bmod (p-1)$, $\mathrm{odd}(z)=\mathrm{odd}(x)\cdot\mathrm{odd}(y)$.`],
          solution: R`Define $\mathrm{odd}(a) := 1$ if $a$ is odd, otherwise 0. From $h^{(p-1)/2}=1$ exactly when $a$ is even, one can compute $\mathrm{odd}(a)$.

The distinguisher $B$ receives $(G,q,g,X,Y,Z)$ and computes $o_x := \mathrm{odd}(x)$, $o_y := \mathrm{odd}(y)$, $o_z := \mathrm{odd}(z)$. It outputs 1 if $o_z = o_x \cdot o_y$, otherwise 0.

**Case $z = xy \bmod (p-1)$:** $xy$ is odd exactly when both factors are odd. So $o_z = o_x o_y$ always holds; $B$ outputs 1.

**Case $z$ uniform:** $o_z$ is 1 with probability $\tfrac12$. Independently of $o_x o_y$, it agrees with probability $\tfrac12$. So $B$ outputs 1 with probability $\tfrac12$.

The advantage is
$$\left|\Pr[B=1 \mid z=xy] - \Pr[B=1 \mid z \text{ uniform}]\right| = \left|1 - \tfrac12\right| = \tfrac12,$$
which is not negligible. Hence DDH is not hard in $\mathbb{Z}_p^*$.`,
          rubric: [ { points: 1, text: R`Parity via $h^{(p-1)/2}$` },
                    { points: 1, text: R`Distinguisher $o_z = o_x o_y$` },
                    { points: 1, text: R`Advantage $\tfrac12$` } ] },
        { label: "b", points: 2,
          prompt: R`Why does the prime-order subgroup $q$ with $p = rq+1$ help?`,
          hints: [R`Which Legendre symbol do elements of the subgroup have?`,
                  R`Does the parity leak disappear?`],
          solution: R`In the subgroup $G$ of order $q$, for every $h \in G$: $h^{(p-1)/2} = 1$, because $q$ divides $(p-1)/2$ (for $p=rq+1$ with $r$ even). The Legendre symbol is therefore constant 1 on $G$ and reveals no parity. The attack above does not work there; DDH can be a meaningful assumption.`,
          rubric: [ { points: 1, text: R`Legendre symbol is constant on the subgroup` },
                    { points: 1, text: R`Parity leak disappears` } ] }
      ] },
    { id: "u5-prob-elgamal-correct", type: "problem", lecture: 5, topic: "public-key", origin: "variant",
      source: "Variant of Lecture V, slide 35", difficulty: 2,
      title: "ElGamal: Correctness and Ciphertext Structure",
      statement: "",
      parts: [
        { label: "a", points: 2,
          prompt: R`Show the correctness of ElGamal.`,
          hints: [R`Substitute $c_1=g^y$, $c_2=pk^y m$ and $pk=g^x$.`],
          solution: R`$$\frac{c_2}{c_1^x} = \frac{pk^y \cdot m}{(g^y)^x} = \frac{(g^x)^y \cdot m}{g^{xy}} = \frac{g^{xy} \cdot m}{g^{xy}} = m.$$
Decryption exactly inverts encryption.`,
          rubric: [ { points: 1, text: R`Substituting $c_1,c_2,pk$` },
                    { points: 1, text: R`$g^{xy}$ cancels, result $m$` } ] },
        { label: "b", points: 3,
          prompt: R`Explain the role of $c_1$ and $c_2$ and why encryption without a fresh $y$ would be insecure.`,
          hints: [R`$c_1$ is an ephemeral DH value.`,
                  R`Without a fresh $y$ the ciphertext would be deterministic.`],
          solution: R`$c_1 = g^y$ is the ephemeral DH value. With the private key $x$ the receiver computes $c_1^x = g^{xy}$, the shared secret. $c_2 = pk^y \cdot m = g^{xy} \cdot m$ masks the message with this secret.

Without a fresh $y$ (e.g. a fixed $y$) the encryption would be deterministic: the same message and the same public key would give the same ciphertext. A CPA attacker could encrypt $m_0,m_1$ itself and compare them with the challenge. Fresh $y$ is therefore essential.`,
          rubric: [ { points: 1, text: R`$c_1$ ephemeral, $c_1^x$ shared secret` },
                    { points: 1, text: R`$c_2$ masks $m$` },
                    { points: 1, text: R`Without fresh $y$ deterministic / CPA attack` } ] }
      ] },
    { id: "u5-prob-reduction-template", type: "problem", lecture: 5, topic: "public-key", origin: "variant",
      source: "Variant of Lecture V, slides 10–14", difficulty: 2,
      title: "Writing Down a Reduction Completely",
      statement: "",
      parts: [
        { label: "a", points: 3,
          prompt: R`Name the four components of a complete reduction and explain what has to be shown in each.`,
          hints: [R`Description, simulation, runtime, success probability.`,
                  R`The conclusion is the contradiction.`],
          solution: R`1. **Description of $B$:** What does $B$ receive as input, how does it answer $A$'s queries, what does it output?
2. **Simulation:** Show for both cases of the challenger bit that $A$ sees exactly the distribution of the game $G$.
3. **Runtime:** $B$ is PPT if $A$ is PPT; the number of queries and computations is polynomial.
4. **Success probability:** The advantage of $B$ against $H$ is at least a constant fraction (often equal to) the advantage of $A$ against $G$.
5. **Conclusion:** Contradiction to the security of $H$; hence $A$ does not exist and $G$ is secure.`,
          rubric: [ { points: 1, text: R`Description and simulation` },
                    { points: 1, text: R`Runtime` },
                    { points: 1, text: R`Success probability and contradiction` } ] },
        { label: "b", points: 2,
          prompt: R`Why is it not enough to say only that "$B$ simulates $A$ perfectly"?`,
          hints: [R`Which two quantitative statements are missing?`],
          solution: R`The **runtime** (is $B$ efficient?) and the **success probability** (is the advantage non-negligible?) are missing. Without these two statements it is not shown that $B$ actually breaks the hardness assumption. The simulation alone is only half of the reduction.`,
          rubric: [ { points: 1, text: R`Runtime missing` },
                    { points: 1, text: R`Advantage/success probability missing` } ] }
      ] }
  );
})();
