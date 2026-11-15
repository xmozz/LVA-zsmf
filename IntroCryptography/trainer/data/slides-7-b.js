(function () {
  const R = String.raw;
  const add = (...items) => (window.CRYPTO_BANK = window.CRYPTO_BANK || []).push(...items);

  // ===================================================================
  // Lecture 7 — problems
  // ===================================================================
  add(
    { id: "l7-prob-cbc-correctness", type: "problem", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 14 (exam-style variant)", difficulty: 2,
      title: "CBC mode: decryption, correctness, structure",
      mock: true,
      statement: R`Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ be a pseudorandom permutation. A message $m = m_1 \| m_2 \| m_3$ with $m_i \in \{0,1\}^n$ is encrypted in CBC mode: $\mathsf{Enc}_k$ samples $c_0 \gets \{0,1\}^n$, computes $c_i := F_k(m_i \oplus c_{i-1})$ for $i = 1, 2, 3$ and outputs $c = c_0 \| c_1 \| c_2 \| c_3$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Define $\mathsf{Dec}_k(c_0 \| c_1 \| c_2 \| c_3)$ and show correctness.`,
          hints: [R`Undo the last operation of encryption first: what is applied to $m_i \oplus c_{i-1}$?`,
                  R`Apply $F_k^{-1}$ to $c_i$ and XOR the previous ciphertext block (for $i = 1$ this is the IV $c_0$).`],
          solution: R`$\mathsf{Dec}_k(c_0 \| c_1 \| c_2 \| c_3)$: for $i = 1, 2, 3$ compute $m_i := F_k^{-1}(c_i) \oplus c_{i-1}$ and return $m_1 \| m_2 \| m_3$. (All $c_{i-1}$, including the IV $c_0$, are part of the ciphertext.)

**Correctness.** Let $c = \mathsf{Enc}_k(m_1 \| m_2 \| m_3)$. For every $i \in \{1,2,3\}$, since $F_k^{-1}(F_k(x)) = x$ for a permutation:

$$F_k^{-1}(c_i) \oplus c_{i-1} = F_k^{-1}\big(F_k(m_i \oplus c_{i-1})\big) \oplus c_{i-1} = m_i \oplus c_{i-1} \oplus c_{i-1} = m_i.$$

Hence $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$ for every key and message.`,
          rubric: [ { points: 1, text: R`Correct $\mathsf{Dec}$: $m_i := F_k^{-1}(c_i) \oplus c_{i-1}$, using the IV $c_0$ for the first block` },
                    { points: 1, text: R`Correctness computation using $F_k^{-1}(F_k(x)) = x$ and $c_{i-1} \oplus c_{i-1} = 0^n$` } ] },
        { label: "b", points: 1,
          prompt: R`Why does CBC need a pseudorandom **permutation**, while CTR mode works with any PRF?`,
          hints: [R`Which algorithm in CBC uses $F_k^{-1}$? Does any algorithm of CTR?`],
          solution: R`CBC decryption evaluates $F_k^{-1}$, which only exists (and is efficiently computable) if $F_k$ is a permutation; for a non-injective $F_k$ two different values $m_i \oplus c_{i-1}$ could give the same $c_i$, and decryption would not be well defined. CTR computes $c_i = F_k(ctr + i) \oplus m_i$ and $m_i = F_k(c_0 + i) \oplus c_i$, i.e. it only evaluates $F_k$ forwards, so any PRF suffices.`,
          rubric: [ { points: 1, text: R`Says CBC decryption needs $F_k^{-1}$ (bijectivity), whereas CTR only uses $F_k$ forwards` } ] },
        { label: "c", points: 1,
          prompt: R`Can CBC encryption be parallelised over the blocks? Can CBC decryption? Justify briefly.`,
          hints: [R`Which values does block $i$ need in each direction, and are they available at the start?`],
          solution: R`Encryption cannot be parallelised: $c_i = F_k(m_i \oplus c_{i-1})$ needs $c_{i-1}$, which is only known after block $i-1$ has been encrypted. Decryption can be parallelised: $m_i = F_k^{-1}(c_i) \oplus c_{i-1}$ only uses ciphertext blocks, all of which are given, so all $m_i$ can be computed simultaneously.`,
          rubric: [ { points: 1, text: R`Encryption sequential and decryption parallel, each with the correct reason` } ] },
      ] },

    { id: "l7-prob-ecb-eav", type: "problem", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 11", difficulty: 2,
      title: "ECB mode is not EAV-secure",
      mock: true,
      statement: R`Let $F$ be a pseudorandom permutation on $\{0,1\}^n$ and let $\Pi$ be ECB mode: $\mathsf{Enc}_k(m_1, \dots, m_t) := F_k(m_1), \dots, F_k(m_t)$ and $\mathsf{Dec}_k(c_1, \dots, c_t) := F_k^{-1}(c_1), \dots, F_k^{-1}(c_t)$.`,
      parts: [
        { label: "a", points: 3,
          prompt: R`Show that $\Pi$ is not EAV-secure (Definition 3.8). Specify all values your adversary chooses.`,
          hints: [R`ECB is deterministic per block. What happens with two equal plaintext blocks?`,
                  R`Choose one challenge message with two equal blocks and one with two different blocks.`,
                  R`$m_0 := 0^n \| 0^n$, $m_1 := 0^n \| 1^n$; compare the two ciphertext blocks.`],
          solution: R`Recall: $\Pi$ is EAV-secure if for every p.p.t. $\mathcal{A}$ there exists a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$.

**Adversary $\mathcal{A}(1^n)$:**

1. Output $m_0 := 0^n \| 0^n$ and $m_1 := 0^n \| 1^n$ (both $2n$ bits, so $|m_0| = |m_1|$).
2. Receive $c = c_1 \| c_2 \gets \mathsf{Enc}_k(m_b)$.
3. Output $b' := 0$ if $c_1 = c_2$, and $b' := 1$ otherwise.

$\mathcal{A}$ runs in polynomial time (one comparison).

**Analysis.**

- $b = 0$: $c_1 = F_k(0^n) = c_2$, so $\mathcal{A}$ outputs $b' = 0 = b$.
- $b = 1$: $c_1 = F_k(0^n)$ and $c_2 = F_k(1^n)$. Since $F_k$ is a permutation (injective) and $0^n \neq 1^n$, $c_1 \neq c_2$, so $\mathcal{A}$ outputs $b' = 1 = b$.

Hence $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] = 1$. If $\Pi$ were EAV-secure, then $1 \le \tfrac12 + \varepsilon(n)$, i.e. $\varepsilon(n) \ge \tfrac12$ for all $n$, which is not negligible. So $\Pi$ is not EAV-secure.`,
          rubric: [ { points: 1, text: R`Valid challenge messages of equal length: one with equal blocks, one with distinct blocks` },
                    { points: 1, text: R`Decision rule ($c_1 = c_2$) and correct analysis of both cases, using that $F_k$ is injective` },
                    { points: 1, text: R`Success probability $1$ and conclusion that $\tfrac12$ is not negligible` } ] },
      ] },

    { id: "l7-prob-ctr-fixed", type: "problem", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 13 (exam-style variant)", difficulty: 3,
      title: "CTR mode with a fixed counter",
      mock: true,
      statement: R`Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ be a PRF. Consider the following broken variant $\Pi$ of CTR mode, in which the counter is always $0^n$: $\mathsf{Gen}(1^n)$ returns $k \gets \{0,1\}^n$. $\mathsf{Enc}_k(m_1, \dots, m_t)$ sets $c_0 := 0^n$ and $c_i := F_k(c_0 + i) \oplus m_i$ (i.e. $c_i = F_k(i) \oplus m_i$) for $i = 1, \dots, t$, and returns $c_0, c_1, \dots, c_t$. $\mathsf{Dec}_k$ is as in CTR mode. Messages have at most polynomially many blocks.`,
      parts: [
        { label: "a", points: 3,
          prompt: R`Show that $\Pi$ is not CPA-secure (Definition 3.21). Specify all values your adversary chooses.`,
          hints: [R`Is $\mathsf{Enc}_k$ randomised?`,
                  R`Every encryption of a one-block message uses the pad $F_k(1)$. Can you learn it from one oracle query?`],
          solution: R`Recall: $\Pi$ is CPA-secure if for every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$.

**Adversary $\mathcal{A}(1^n)$:**

1. Query the encryption oracle on $m' := 0^n$ and receive $(c'_0, c'_1) = (0^n, F_k(1) \oplus 0^n)$. Set $p := c'_1 \oplus m' = F_k(1)$.
2. Output the challenge messages $m_0 := 0^n$ and $m_1 := 1^n$.
3. Receive $c^* = (c^*_0, c^*_1)$ with $c^*_1 = F_k(1) \oplus m_b$. Compute $x := c^*_1 \oplus p$.
4. Output $b' := 0$ if $x = 0^n$ and $b' := 1$ otherwise.

**Analysis.** Since the counter is fixed, the challenge uses the same pad: $x = F_k(1) \oplus m_b \oplus F_k(1) = m_b$.

- $b = 0$: $x = 0^n$, so $b' = 0$.
- $b = 1$: $x = 1^n \neq 0^n$, so $b' = 1$.

$\mathcal{A}$ is p.p.t. (one query, two XORs) and $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] = 1$. Since $1 - \tfrac12 = \tfrac12$ is not negligible, $\Pi$ is not CPA-secure.`,
          rubric: [ { points: 1, text: R`Encryption query and recovery of the pad $F_k(1)$ (or direct comparison with the challenge)` },
                    { points: 1, text: R`Challenge messages $m_0 \neq m_1$ of equal length, decision rule, analysis of both $b = 0$ and $b = 1$` },
                    { points: 1, text: R`Success probability $1$, conclusion via the definition` } ] },
        { label: "b", points: 2,
          prompt: R`Is $\Pi$ EAV-secure? Justify your answer in 2–3 sentences (no full proof required).`,
          hints: [R`In the EAV game only one message is encrypted. Which pad does it use?`,
                  R`Compare with the pseudo one-time pad (Construction 3.17).`],
          solution: R`**Yes.** In the EAV experiment only the single challenge $m_b$ (with $t$ blocks) is encrypted, with the pad $F_k(1) \| F_k(2) \| \dots \| F_k(t)$; the inputs $1, \dots, t$ are distinct, so if $F_k$ were a truly random function this pad would be uniform and $\Pi$ would be a one-time pad, giving success probability exactly $\tfrac12$. Since $F$ is a PRF, a reduction $\mathcal{D}$ (query $1, \dots, t$, encrypt $m_b$ with the answers, output 1 iff $b' = b$) shows that $\mathcal{A}$'s success probability differs from $\tfrac12$ by at most a negligible amount, exactly as in the proof for the pseudo one-time pad. Only reuse of the pad across several encryptions, which the CPA adversary has, breaks $\Pi$.`,
          rubric: [ { points: 1, text: R`Answer "yes" with the observation that a single encryption uses the pad $F_k(1), \dots, F_k(t)$ on distinct inputs` },
                    { points: 1, text: R`Justification: pad indistinguishable from uniform by PRF security, so $\Pi$ behaves like a one-time pad (pseudo-OTP style reduction)` } ] },
      ] },

    { id: "l7-prob-cbc-chained", type: "problem", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slide 14 (variant: chained CBC, Katz–Lindell 3.6.3)", difficulty: 3,
      title: "Chained CBC (predictable IV) is not CPA-secure",
      mock: true,
      statement: R`Let $F$ be a pseudorandom permutation on $\{0,1\}^n$. Consider the following **stateful** variant $\Pi$ of CBC mode. $\mathsf{Gen}(1^n)$ samples $k \gets \{0,1\}^n$ and an initial state $v \gets \{0,1\}^n$. $\mathsf{Enc}_{k,v}(m_1, \dots, m_t)$ sets $c_0 := v$, computes $c_i := F_k(m_i \oplus c_{i-1})$ for $i = 1, \dots, t$, updates the state to $v := c_t$ and returns $c_0, c_1, \dots, c_t$. (So the IV of every encryption is the last ciphertext block of the previous encryption.) $\mathsf{Dec}_k$ is as in CBC mode. In $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)$ every call to $\mathsf{Enc}$, including the one producing the challenge, uses and updates the state $v$.`,
      parts: [
        { label: "a", points: 4,
          prompt: R`Show that $\Pi$ is not CPA-secure. Specify all values your adversary chooses.`,
          hints: [R`After one encryption query, does $\mathcal{A}$ know the IV that the challenge ciphertext will use?`,
                  R`Try to make the input $m_b \oplus c^*_0$ of $F_k$ in the challenge equal to an input whose output you have already seen.`,
                  R`Query $m' := 0^n$, getting $c'_1 = F_k(c'_0)$. Choose $m_0 := c'_0 \oplus c'_1$.`],
          solution: R`Recall: $\Pi$ is CPA-secure if for every p.p.t. $\mathcal{A}$ there exists a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$.

**Adversary $\mathcal{A}(1^n)$:**

1. Query the encryption oracle on $m' := 0^n$ (one block). Receive $(c'_0, c'_1)$ with $c'_1 = F_k(0^n \oplus c'_0) = F_k(c'_0)$. Now the state is $v = c'_1$, which $\mathcal{A}$ knows.
2. Output the challenge messages $m_0 := c'_0 \oplus c'_1$ and $m_1 := c'_0 \oplus c'_1 \oplus 1^n$ (both $n$ bits, $m_0 \neq m_1$).
3. Receive $c^* = (c^*_0, c^*_1)$, where $c^*_0 = v = c'_1$ and $c^*_1 = F_k(m_b \oplus c'_1)$.
4. Output $b' := 0$ if $c^*_1 = c'_1$ and $b' := 1$ otherwise.

**Analysis.**

- $b = 0$: $m_0 \oplus c'_1 = c'_0$, so $c^*_1 = F_k(c'_0) = c'_1$ and $b' = 0$.
- $b = 1$: $m_1 \oplus c'_1 = c'_0 \oplus 1^n \neq c'_0$. Since $F_k$ is a permutation, $c^*_1 = F_k(c'_0 \oplus 1^n) \neq F_k(c'_0) = c'_1$, so $b' = 1$.

$\mathcal{A}$ is p.p.t. (one query, a few XORs and a comparison) and $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] = 1$. As $\tfrac12$ is not negligible, no negligible $\varepsilon$ satisfies the definition: $\Pi$ is not CPA-secure.`,
          rubric: [ { points: 1, text: R`Encryption query and the observation that the next IV ($c'_1$) is known to $\mathcal{A}$` },
                    { points: 1, text: R`Challenge messages chosen so that $m_0 \oplus c'_1$ equals an earlier $F_k$-input, with $m_0 \neq m_1$` },
                    { points: 1, text: R`Decision rule and correct analysis of both cases (permutation for $b = 1$)` },
                    { points: 1, text: R`Success probability $1$ and conclusion` } ] },
        { label: "b", points: 1,
          prompt: R`Why does this attack fail against standard CBC mode with a fresh uniform IV?`,
          hints: [R`When is the IV of the challenge chosen, relative to $m_0$?`],
          solution: R`In standard CBC the IV $c^*_0$ of the challenge is sampled uniformly **after** $\mathcal{A}$ has fixed $m_0$. Then $m_0 \oplus c^*_0$ equals a previously used $F_k$-input only with probability at most $q(n)/2^n$ (negligible), so $\mathcal{A}$ cannot force a repeated input to $F_k$.`,
          rubric: [ { points: 1, text: R`IV is uniform and unknown when $m_0$ is chosen, so a repeated $F_k$-input occurs only with negligible probability` } ] },
      ] },

    { id: "l7-prob-cbc-cca", type: "problem", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slides 14, 18–20", difficulty: 3,
      title: "CBC mode is not CCA-secure",
      mock: true,
      statement: R`Let $F$ be a pseudorandom permutation and let $\Pi$ be CBC mode (Lecture 7, slide 14): $\mathsf{Enc}_k$ samples $c_0 \gets \{0,1\}^n$, sets $c_i := F_k(m_i \oplus c_{i-1})$, and $\mathsf{Dec}_k$ computes $m_i := F_k^{-1}(c_i) \oplus c_{i-1}$.`,
      parts: [
        { label: "a", points: 4,
          prompt: R`Show that $\Pi$ is not CCA-secure (Definition 5.1). Specify all values your adversary chooses.`,
          hints: [R`Use one-block challenge messages. Which ciphertext block enters $m_1$ only through an XOR?`,
                  R`Modify the IV: what is $\mathsf{Dec}_k(c_0 \oplus \Delta, c_1)$?`],
          solution: R`Recall: $\Pi$ is CCA-secure if for every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$, where $\mathcal{A}$ has oracles $\mathsf{Enc}_k(\cdot)$ and $\mathsf{Dec}_k(\cdot)$ but may not query $\mathsf{Dec}_k(c^*)$.

**Adversary $\mathcal{A}(1^n)$:**

1. Output $m_0 := 0^n$ and $m_1 := 1^n$.
2. Receive $c^* = (c_0, c_1)$ with $c_1 = F_k(m_b \oplus c_0)$.
3. Let $\Delta := 0^{n-1}1$ and query the decryption oracle on $c' := (c_0 \oplus \Delta, c_1)$. This is allowed, since $\Delta \neq 0^n$ implies $c' \neq c^*$. Receive $m'$.
4. Output $b' := 0$ if $m' \oplus \Delta = 0^n$, and $b' := 1$ otherwise.

**Analysis.**

$$m' = F_k^{-1}(c_1) \oplus c_0 \oplus \Delta = (m_b \oplus c_0) \oplus c_0 \oplus \Delta = m_b \oplus \Delta,$$

so $m' \oplus \Delta = m_b$. For $b = 0$ this is $0^n$ and $\mathcal{A}$ outputs $0$; for $b = 1$ it is $1^n \neq 0^n$ and $\mathcal{A}$ outputs $1$.

$\mathcal{A}$ is p.p.t. and $\Pr[\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n) = 1] = 1$, which is not $\le \tfrac12 + \varepsilon(n)$ for any negligible $\varepsilon$. Hence CBC is not CCA-secure.`,
          rubric: [ { points: 1, text: R`Challenge messages $m_0 \neq m_1$ of equal length, definition recalled` },
                    { points: 1, text: R`Modified ciphertext $c' \neq c^*$ specified explicitly, with the argument why the query is allowed` },
                    { points: 1, text: R`Correct computation $\mathsf{Dec}_k(c') = m_b \oplus \Delta$` },
                    { points: 1, text: R`Decision rule, both cases, success probability $1$, conclusion` } ] },
      ] },

    { id: "l7-prob-ctr-cca", type: "problem", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slides 13, 18–20", difficulty: 3,
      title: "Construction 3.28 and CTR mode are not CCA-secure",
      mock: true,
      statement: R`Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ be a PRF. Construction 3.28 encrypts $m \in \{0,1\}^n$ as $(r, F_k(r) \oplus m)$ for $r \gets \{0,1\}^n$ and decrypts $(c_0, c_1)$ as $F_k(c_0) \oplus c_1$. CTR mode is as on Lecture 7, slide 13.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Show that Construction 3.28 is not CCA-secure.`,
          hints: [R`Flip a bit of the second component of the challenge.`],
          solution: R`$\mathcal{A}$ outputs $m_0 := 0^n$, $m_1 := 1^n$ and receives $c^* = (r, s)$ with $s = F_k(r) \oplus m_b$. It picks $\Delta := 0^{n-1}1$ and queries $\mathsf{Dec}_k((r, s \oplus \Delta))$, which is allowed since $(r, s \oplus \Delta) \neq (r, s)$. The answer is

$$F_k(r) \oplus s \oplus \Delta = F_k(r) \oplus F_k(r) \oplus m_b \oplus \Delta = m_b \oplus \Delta.$$

$\mathcal{A}$ outputs $b' := 0$ iff answer $\oplus\, \Delta = 0^n$. Then $b' = b$ always, so $\Pr[\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n) = 1] = 1 > \tfrac12 + \varepsilon(n)$ for every negligible $\varepsilon$ and large $n$: not CCA-secure.`,
          rubric: [ { points: 1, text: R`Messages, allowed query $(r, s \oplus \Delta) \neq c^*$ and its answer $m_b \oplus \Delta$` },
                    { points: 1, text: R`Decision rule, success probability $1$, conclusion` } ] },
        { label: "b", points: 3,
          prompt: R`Show that CTR mode is not CCA-secure, using challenge messages of **two** blocks. Specify all values your adversary chooses.`,
          hints: [R`Modify only one block of the challenge ciphertext; what does the decryption oracle return for the other block?`,
                  R`Query $(c_0, c_1, c_2 \oplus \Delta)$.`],
          solution: R`Recall Definition 5.1 (as in (a)).

**Adversary $\mathcal{A}(1^n)$:**

1. Output $m_0 := 0^n \| 0^n$ and $m_1 := 1^n \| 1^n$.
2. Receive $c^* = (c_0, c_1, c_2)$ with $c_i = F_k(c_0 + i) \oplus m_{b,i}$, where $m_{b,i}$ is the $i$-th block of $m_b$.
3. With $\Delta := 0^{n-1}1$, query the decryption oracle on $c' := (c_0, c_1, c_2 \oplus \Delta)$. Allowed, since $c' \neq c^*$. Receive $m' = m'_1 \| m'_2$.
4. Output $b' := 0$ if $m'_1 = 0^n$ and $b' := 1$ otherwise.

**Analysis.** $m'_1 = F_k(c_0 + 1) \oplus c_1 = m_{b,1}$ and $m'_2 = F_k(c_0 + 2) \oplus c_2 \oplus \Delta = m_{b,2} \oplus \Delta$. So $m'_1 = 0^n$ if $b = 0$ and $m'_1 = 1^n$ if $b = 1$; $\mathcal{A}$ always outputs $b' = b$.

Hence $\Pr[\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n) = 1] = 1$, which is not $\le \tfrac12 + \varepsilon(n)$ for a negligible $\varepsilon$: CTR mode is not CCA-secure.`,
          rubric: [ { points: 1, text: R`Two-block messages $m_0 \neq m_1$ and an explicit modified ciphertext $c' \neq c^*$` },
                    { points: 1, text: R`Correct decryption of $c'$ (unchanged blocks decrypt to $m_b$'s blocks, the flipped block to block $\oplus\, \Delta$)` },
                    { points: 1, text: R`Decision rule, both cases, probability $1$, conclusion` } ] },
        { label: "c", points: 1,
          prompt: R`Why do these attacks not contradict Theorem 3.29 and Theorem 3.33?`,
          hints: [R`What exactly do those theorems claim?`],
          solution: R`Theorems 3.29 and 3.33 only claim **CPA-security**. In $\mathsf{PrivK}^{\mathsf{cpa}}$ the adversary has no decryption oracle, and the attacks above rely on one. CPA-security does not imply CCA-security; both schemes are malleable.`,
          rubric: [ { points: 1, text: R`The theorems only give CPA-security; the attacks need the decryption oracle (CPA does not imply CCA)` } ] },
      ] },

    { id: "l7-prob-mode-xor-chain", type: "problem", lecture: 7, topic: "modes", origin: "slides",
      source: "Variant modelled on Lecture 7, slides 14, 18–19", difficulty: 3,
      title: "Home-made mode: c_i := F_k(m_i XOR c_{i-1}) XOR c_{i-1}",
      mock: true,
      statement: R`Let $F$ be a keyed function on $\{0,1\}^n$. Consider the following mode $\Pi$ for messages $m = m_1 \| \dots \| m_t$ with $m_i \in \{0,1\}^n$: $\mathsf{Gen}(1^n)$ returns $k \gets \{0,1\}^n$. $\mathsf{Enc}_k(m)$ samples $c_0 \gets \{0,1\}^n$, computes

$$c_i := F_k(m_i \oplus c_{i-1}) \oplus c_{i-1} \quad \text{for } i = 1, \dots, t,$$

and returns $c_0 \| c_1 \| \dots \| c_t$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Define $\mathsf{Dec}_k(c_0 \| \dots \| c_t)$ and show correctness.`,
          hints: [R`First remove the outer XOR with $c_{i-1}$, which is known to the decryptor.`,
                  R`$c_i \oplus c_{i-1} = F_k(m_i \oplus c_{i-1})$.`],
          solution: R`$\mathsf{Dec}_k(c_0 \| \dots \| c_t)$: for $i = 1, \dots, t$ compute $m_i := F_k^{-1}(c_i \oplus c_{i-1}) \oplus c_{i-1}$; return $m_1 \| \dots \| m_t$.

**Correctness.** For $c = \mathsf{Enc}_k(m)$ and every $i$: $c_i \oplus c_{i-1} = F_k(m_i \oplus c_{i-1})$, hence

$$F_k^{-1}(c_i \oplus c_{i-1}) \oplus c_{i-1} = F_k^{-1}\big(F_k(m_i \oplus c_{i-1})\big) \oplus c_{i-1} = m_i \oplus c_{i-1} \oplus c_{i-1} = m_i.$$`,
          rubric: [ { points: 1, text: R`Correct $\mathsf{Dec}$: $m_i := F_k^{-1}(c_i \oplus c_{i-1}) \oplus c_{i-1}$` },
                    { points: 1, text: R`Correctness computation` } ] },
        { label: "b", points: 1,
          prompt: R`Must $F$ be invertible (a PRP), or does a PRF suffice? Justify.`,
          hints: [R`Look at your decryption algorithm.`],
          solution: R`$F$ must be a (pseudorandom) **permutation**: decryption evaluates $F_k^{-1}$ on $c_i \oplus c_{i-1}$ to recover $m_i \oplus c_{i-1}$. With a non-injective $F_k$, two different values of $m_i$ could give the same $c_i$ (for the same $c_{i-1}$), so decryption would not be well defined.`,
          rubric: [ { points: 1, text: R`PRP needed, because decryption uses $F_k^{-1}$` } ] },
        { label: "c", points: 3,
          prompt: R`Show that $\Pi$ is not CCA-secure (Definition 5.1). Specify all values your adversary chooses.`,
          hints: [R`Use one-block messages; the challenge is $(c_0, c_1)$.`,
                  R`Find a change of $(c_0, c_1)$ that keeps $c_1 \oplus c_0$ unchanged but changes the outer XOR.`,
                  R`Query $(c_0 \oplus \Delta, c_1 \oplus \Delta)$.`],
          solution: R`Recall: $\Pi$ is CCA-secure if for every p.p.t. $\mathcal{A}$ there exists a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$.

**Adversary $\mathcal{A}(1^n)$:**

1. Output $m_0 := 0^n$, $m_1 := 1^n$.
2. Receive $c^* = (c_0, c_1)$ with $c_1 = F_k(m_b \oplus c_0) \oplus c_0$.
3. With $\Delta := 0^{n-1}1$, query the decryption oracle on $c' := (c_0 \oplus \Delta, c_1 \oplus \Delta)$; allowed since $c' \neq c^*$. Receive $m'$.
4. Output $b' := 0$ if $m' \oplus \Delta = 0^n$, else $b' := 1$.

**Analysis.** $(c_1 \oplus \Delta) \oplus (c_0 \oplus \Delta) = c_1 \oplus c_0 = F_k(m_b \oplus c_0)$, so

$$m' = F_k^{-1}\big(F_k(m_b \oplus c_0)\big) \oplus c_0 \oplus \Delta = m_b \oplus \Delta.$$

Thus $m' \oplus \Delta = m_b$, and $\mathcal{A}$ outputs $b' = b$ in both cases $b = 0$ ($m_b = 0^n$) and $b = 1$ ($m_b = 1^n \neq 0^n$). So $\Pr[\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n) = 1] = 1$, which exceeds $\tfrac12 + \varepsilon(n)$ for every negligible $\varepsilon$ (for large $n$): $\Pi$ is not CCA-secure.`,
          rubric: [ { points: 1, text: R`Messages and a valid modified ciphertext $c' \neq c^*$ (e.g. both blocks XORed with the same $\Delta$)` },
                    { points: 1, text: R`Correct computation $\mathsf{Dec}_k(c') = m_b \oplus \Delta$` },
                    { points: 1, text: R`Decision rule, both cases, probability $1$, conclusion` } ] },
      ] },

    { id: "l7-prob-mode-ctr-chain", type: "problem", lecture: 7, topic: "modes", origin: "slides",
      source: "Variant modelled on Lecture 7, slides 13, 18–19", difficulty: 3,
      title: "Home-made mode: c_i := F_k(IV + i) XOR m_i XOR m_{i-1}",
      mock: true,
      statement: R`Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ be a PRF. Consider the mode $\Pi$ for $m = m_1 \| \dots \| m_t$ with $m_i \in \{0,1\}^n$: $\mathsf{Gen}(1^n)$ returns $k \gets \{0,1\}^n$. $\mathsf{Enc}_k(m)$ samples $IV \gets \{0,1\}^n$, sets $m_0 := 0^n$, $c_0 := IV$ and

$$c_i := F_k(IV + i) \oplus m_i \oplus m_{i-1} \quad \text{for } i = 1, \dots, t,$$

and returns $c_0 \| c_1 \| \dots \| c_t$ (addition modulo $2^n$).`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Define $\mathsf{Dec}_k(c_0 \| \dots \| c_t)$ and show correctness.`,
          hints: [R`Decrypt the blocks in order $i = 1, 2, \dots$; when you decrypt block $i$ you already know $m_{i-1}$.`],
          solution: R`$\mathsf{Dec}_k(c_0 \| \dots \| c_t)$: set $m_0 := 0^n$; for $i = 1, \dots, t$ (in this order) compute $m_i := c_i \oplus F_k(c_0 + i) \oplus m_{i-1}$; return $m_1 \| \dots \| m_t$.

**Correctness** by induction on $i$. For $i = 0$, $m_0 = 0^n$ in both algorithms. If block $i-1$ was decrypted correctly, then with $c_0 = IV$:

$$c_i \oplus F_k(c_0 + i) \oplus m_{i-1} = F_k(IV + i) \oplus m_i \oplus m_{i-1} \oplus F_k(IV + i) \oplus m_{i-1} = m_i.$$`,
          rubric: [ { points: 1, text: R`Correct sequential $\mathsf{Dec}$ using $c_0$ as $IV$ and the previously recovered $m_{i-1}$ (with $m_0 = 0^n$)` },
                    { points: 1, text: R`Correctness computation (inductive over the blocks)` } ] },
        { label: "b", points: 1,
          prompt: R`Must $F$ be invertible? Justify.`,
          hints: [R`Does your $\mathsf{Dec}$ use $F_k^{-1}$?`],
          solution: R`No. Both encryption and decryption only evaluate $F_k$ forwards (on $IV + i$), so a PRF suffices, as in CTR mode.`,
          rubric: [ { points: 1, text: R`No inverse needed; only $F_k$ is evaluated forwards` } ] },
        { label: "c", points: 1,
          prompt: R`A 4-block message is encrypted and bit $j$ of $c_2$ is flipped in transit. Which plaintext blocks are decrypted incorrectly, and how?`,
          hints: [R`The error enters $m_2$; which later computations use $m_2$?`],
          solution: R`$m_1$ is correct. $m_2 = c_2 \oplus F_k(c_0 + 2) \oplus m_1$ has bit $j$ flipped. Then $m_3 = c_3 \oplus F_k(c_0 + 3) \oplus m_2$ also gets bit $j$ flipped, and likewise $m_4$. So $m_2, m_3, m_4$ each have exactly bit $j$ flipped: the error propagates to all later blocks (unlike plain CTR).`,
          rubric: [ { points: 1, text: R`$m_1$ correct; $m_2, m_3, m_4$ each have exactly bit $j$ flipped` } ] },
        { label: "d", points: 2,
          prompt: R`Show that $\Pi$ is not CCA-secure. Specify all values your adversary chooses.`,
          hints: [R`For one-block messages, $\Pi$ coincides with CTR mode.`],
          solution: R`**Adversary $\mathcal{A}(1^n)$:** output $m_0 := 0^n$, $m_1 := 1^n$; receive $c^* = (c_0, c_1)$ with $c_1 = F_k(c_0 + 1) \oplus m_b \oplus 0^n$. With $\Delta := 0^{n-1}1$, query $\mathsf{Dec}_k$ on $c' := (c_0, c_1 \oplus \Delta) \neq c^*$ (allowed) and receive

$$m' = c_1 \oplus \Delta \oplus F_k(c_0 + 1) \oplus 0^n = m_b \oplus \Delta.$$

Output $b' := 0$ iff $m' \oplus \Delta = 0^n$. Then $b' = b$ for both $b = 0$ and $b = 1$, so $\Pr[\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n) = 1] = 1$, which is not $\le \tfrac12 + \varepsilon(n)$ for any negligible $\varepsilon$. Hence $\Pi$ is not CCA-secure.`,
          rubric: [ { points: 1, text: R`Explicit messages and allowed modified ciphertext; computation $\mathsf{Dec}_k(c') = m_b \oplus \Delta$` },
                    { points: 1, text: R`Decision rule, probability $1$, conclusion` } ] },
        { label: "e", points: 1,
          prompt: R`Is $\Pi$ CPA-secure? Answer in 2–3 sentences (no full proof).`,
          hints: [R`Write $m'_i := m_i \oplus m_{i-1}$. What is $\Pi$ applied to $m$, in terms of CTR mode?`],
          solution: R`**Yes.** $\mathsf{Enc}_k(m)$ is exactly CTR-mode encryption of $T(m) := (m_1 \oplus m_0) \| (m_2 \oplus m_1) \| \dots \| (m_t \oplus m_{t-1})$, where $T$ is an efficiently computable, length-preserving map that does not depend on the key. A CPA adversary against $\Pi$ can therefore be turned into one against CTR (apply $T$ to every query and to $m_0, m_1$; $T$ is injective, so distinct challenge messages stay distinct) with the same success probability, and CTR is CPA-secure by Theorem 3.33.`,
          rubric: [ { points: 1, text: R`"Yes", justified by reduction to CTR mode via the message transformation $T$` } ] },
      ] },

    { id: "l7-prob-bitflip", type: "problem", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 7, slides 10, 13, 14; Exercise 5 (OFB)", difficulty: 2,
      title: "Effect of a flipped ciphertext bit in each mode",
      mock: false,
      statement: R`A message $m = m_1 \| m_2 \| m_3 \| m_4$ ($m_i \in \{0,1\}^n$) is encrypted under a key $k$ in a mode of operation; the ciphertext is $c_0 \| c_1 \| c_2 \| c_3 \| c_4$ (for ECB: $c_1 \| \dots \| c_4$). In each part, exactly one bit, bit $j$, of the named ciphertext block is flipped before decryption. Describe precisely which plaintext blocks change and how.`,
      parts: [
        { label: "a", points: 1,
          prompt: R`ECB, bit $j$ of $c_2$ flipped.`,
          hints: [R`$m_i = F_k^{-1}(c_i)$.`],
          solution: R`Only $m_2$ changes: it becomes $F_k^{-1}(c_2 \oplus e_j)$, a value unrelated to $m_2$ (garbled, pseudorandom-looking), where $e_j$ is the string with a single 1 at position $j$. $m_1, m_3, m_4$ are correct.`,
          rubric: [ { points: 1, text: R`Only $m_2$ affected, and it is garbled (not just one bit)` } ] },
        { label: "b", points: 1,
          prompt: R`CTR, (i) bit $j$ of $c_2$ flipped; (ii) bit $j$ of $c_0$ flipped.`,
          hints: [R`$m_i = F_k(c_0 + i) \oplus c_i$. Which inputs of $F_k$ change in (ii)?`],
          solution: R`(i) Exactly bit $j$ of $m_2$ flips; all other blocks are correct. (ii) All blocks are decrypted with the pads $F_k(c_0' + i)$ for a different counter $c_0'$; these are (pseudo)random values unrelated to the correct pads, so with overwhelming probability all of $m_1, \dots, m_4$ are wrong.`,
          rubric: [ { points: 1, text: R`(i) only bit $j$ of $m_2$; (ii) all blocks wrong` } ] },
        { label: "c", points: 2,
          prompt: R`CBC, (i) bit $j$ of $c_2$ flipped; (ii) bit $j$ of $c_0$ flipped.`,
          hints: [R`$c_2$ is used twice in decryption: in $m_2 = F_k^{-1}(c_2) \oplus c_1$ and in $m_3 = F_k^{-1}(c_3) \oplus c_2$.`],
          solution: R`(i) $m_2 = F_k^{-1}(c_2 \oplus e_j) \oplus c_1$ is garbled. $m_3 = F_k^{-1}(c_3) \oplus c_2 \oplus e_j$ has exactly bit $j$ flipped. $m_1$ and $m_4$ are correct (they do not involve $c_2$).

(ii) $c_0$ is only used in $m_1 = F_k^{-1}(c_1) \oplus c_0$, so exactly bit $j$ of $m_1$ flips and all other blocks are correct. (This is the malleability used in the CCA attack on CBC.)`,
          rubric: [ { points: 1, text: R`(i) $m_2$ garbled, bit $j$ of $m_3$ flipped, $m_1$ and $m_4$ correct` },
                    { points: 1, text: R`(ii) only bit $j$ of $m_1$ flipped` } ] },
        { label: "d", points: 1,
          prompt: R`OFB (as in Exercise 5), (i) bit $j$ of $c_2$ flipped; (ii) bit $j$ of $c_0$ flipped.`,
          hints: [R`The key stream $x_i = F_k(x_{i-1})$, $x_0 = c_0$, does not depend on $c_1, \dots, c_4$.`],
          solution: R`(i) Exactly bit $j$ of $m_2 = x_2 \oplus c_2$ flips; all other blocks are correct, since the key stream depends only on $c_0$. (ii) The whole key stream $x_1, x_2, \dots$ is computed from a different starting value, so with overwhelming probability all blocks are wrong.`,
          rubric: [ { points: 1, text: R`(i) only bit $j$ of $m_2$; (ii) all blocks wrong` } ] },
      ] },
  );

  // ===================================================================
  // Cross-lecture — notes
  // ===================================================================
  add(
    { id: "mix-note-notions-map", type: "note", lecture: 7, topic: "cca", origin: "slides",
      source: "Lectures 2, 4, 5, 6, 7 (Defs 2.3, 2.6, 3.8, 3.21, 5.1; Thms 2.11, 3.13, 3.16, 3.23)", difficulty: 2,
      title: "Map of security notions",
      order: 200,
      body: R`### The notions

- **Perfect secrecy** (Def. 2.3): for every distribution over $\mathcal{M}$, every $m$ and every $c$ with $\Pr[C = c] > 0$: $\Pr[M = m \mid C = c] = \Pr[M = m]$.
- **Perfect indistinguishability** (Def. 2.6): every adversary (no running-time bound) wins $\mathsf{PrivK}^{\mathsf{eav}}$ with probability exactly $\tfrac12$. Lemma 2.7: equivalent to perfect secrecy.
- **EAV-security** (Def. 3.8): every **p.p.t.** adversary wins $\mathsf{PrivK}^{\mathsf{eav}}$ with probability $\le \tfrac12 + \varepsilon(n)$, $\varepsilon$ negligible. Theorem 3.13: equivalent to semantic security.
- **CPA-security** (Def. 3.21): same bound, adversary also has an encryption oracle. Theorem 3.23: implies CPA-security for multiple encryptions.
- **CCA-security** (Def. 5.1): same bound, adversary has encryption and decryption oracles (no $\mathsf{Dec}_k(c^*)$).

### Implications

$$\text{CCA} \Rightarrow \text{CPA} \Rightarrow \text{EAV} \Leftarrow \text{perfect secrecy}$$

- CCA $\Rightarrow$ CPA $\Rightarrow$ EAV: a stronger adversary can always ignore its extra oracles.
- Perfect $\Rightarrow$ EAV: if every adversary wins with probability exactly $\tfrac12$, then in particular every p.p.t. adversary does ($\varepsilon = 0$).

### Why the converses fail (separating examples)

- **EAV $\not\Rightarrow$ perfect:** the pseudo one-time pad (Construction 3.17) with $|k| = n < \ell(n) = |m|$ is EAV-secure (Theorem 3.16), but $|\mathcal{K}| < |\mathcal{M}|$, so by Theorem 2.11 it is not perfectly secret.
- **EAV $\not\Rightarrow$ CPA:** the pseudo one-time pad (or $\mathsf{Enc}_k(m) = F_k(m)$ for a PRP) is deterministic, and no deterministic scheme is CPA-secure (query $m_0$, compare with the challenge).
- **Perfect $\not\Rightarrow$ CPA:** the one-time pad is perfectly secret but deterministic: query $m$, get $k \oplus m$, recover $k$.
- **CPA $\not\Rightarrow$ perfect:** CTR mode on $2n$-bit messages is CPA-secure (Theorem 3.33) but has $|\mathcal{K}| = 2^n < 2^{2n} = |\mathcal{M}|$.
- **CPA $\not\Rightarrow$ CCA:** Construction 3.28, CTR and CBC are CPA-secure but malleable, hence not CCA-secure.
- **EAV (single message) $\not\Rightarrow$ multi-message security:** reusing the pseudo-OTP key gives $c \oplus c' = m \oplus m'$.

So perfect secrecy and CPA-security are **incomparable**: neither implies the other.

### The two relaxations from perfect to computational

1. Only **efficient** (p.p.t.) adversaries are considered.
2. They may succeed with a **negligible** advantage.

Both are needed: an unbounded adversary can try all keys, and a p.p.t. adversary can guess the key with probability $2^{-n}$.` },

    { id: "mix-note-primitives", type: "note", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lectures 4, 5, 6, 7 (Constructions 3.17, 3.28; Thms 3.16, 3.29, 3.32, 3.33)", difficulty: 2,
      title: "Which primitive gives what",
      order: 900,
      body: R`### PRG $G$ (Def. 3.14): short seed $\to$ long pseudorandom string

- **Pseudo one-time pad** (Construction 3.17): $\mathsf{Enc}_k(m) = G(k) \oplus m$, $\mathsf{Dec}_k(c) = G(k) \oplus c$.
- EAV-secure if $G$ is a PRG (Theorem 3.16), with keys shorter than messages.
- Deterministic $\Rightarrow$ **not CPA-secure**, key must not be reused.
- **Stream ciphers** (Lecture 4) are practical key-stream generators used in exactly this way: $c_i = m_i \oplus s_i$.

### PRF $F$ (Def. 3.24): keyed function indistinguishable from a random function

- **Construction 3.28**: $\mathsf{Enc}_k(m) = (r, F_k(r) \oplus m)$, CPA-secure (Theorem 3.29) for $n$-bit messages.
- **CTR mode**: $c_i = F_k(ctr + i) \oplus m_i$, CPA-secure (Theorem 3.33), $|c| = |m| + n$; a stream cipher built from a PRF.
- **OFB mode** (exercises): key stream $x_i = F_k(x_{i-1})$.
- All of these use $F_k$ only forwards: **no inverse needed**.

### PRP $F$ (Lecture 6, slide 14): keyed permutation, $F_k$ and $F_k^{-1}$ efficient, indistinguishable from a uniform permutation

- **CBC mode**: $c_i = F_k(m_i \oplus c_{i-1})$, decryption uses $F_k^{-1}$; CPA-secure (Theorem 3.32).
- **ECB mode** and $\mathsf{Enc}_k(m) = F_k(m)$: deterministic. $F_k(m)$ on single blocks is EAV-secure but not CPA-secure; ECB on several blocks is not even EAV-secure.
- **Block ciphers** (DES, AES; Lecture 3) are the practical constructions of PRPs; the modes are how one actually encrypts with them. In practice CTR is also run with a block cipher.

### What none of them gives

**CCA-security.** Every scheme above is malleable. (Achieving CCA-security needs authentication, which is beyond the midterm.)

### Recurring proof pattern

To prove a scheme built from primitive $P$ secure: build a distinguisher $\mathcal{D}$ for $P$ from an adversary $\mathcal{A}$ for the scheme; in the "real" world $\mathcal{D}$ simulates the scheme exactly, in the "random" world the scheme becomes a one-time pad (success $\tfrac12$, up to a negligible bad event such as a repeated $r$).` },

    { id: "mix-note-cheatsheet", type: "note", lecture: 7, topic: "cca", origin: "slides",
      source: "Lectures 2–7: all formal definitions", difficulty: 1,
      title: "Exam cheat sheet: all definitions (lectures 2–7)",
      order: 210,
      body: R`### Private-key encryption (Def. 3.7)

Three p.p.t. algorithms: $k \gets \mathsf{Gen}(1^n)$ with $|k| \ge n$; $c \gets \mathsf{Enc}_k(m)$ for $m \in \{0,1\}^*$ (possibly randomised); $m := \mathsf{Dec}_k(c)$ (deterministic w.l.o.g.). **Correctness:** $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$ for all $k$, $m$.

### Perfect secrecy (Def. 2.3)

For every probability distribution over $\mathcal{M}$, every $m \in \mathcal{M}$ and every $c \in \mathcal{C}$ with $\Pr[C = c] > 0$: $\Pr[M = m \mid C = c] = \Pr[M = m]$.

### Perfect indistinguishability (Def. 2.6)

For every $\mathcal{A}$: $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi} = 1] = \tfrac12$. **Lemma 2.7:** equivalent to perfect secrecy.

### Results on perfect secrecy

- **Theorem 2.10:** the one-time pad ($\mathsf{Enc}_k(m) = k \oplus m$, $k$ uniform in $\{0,1\}^\ell$) is perfectly secret.
- **Theorem 2.11:** every perfectly secret scheme has $|\mathcal{K}| \ge |\mathcal{M}|$.
- **Theorem 2.12 (Shannon):** if $|\mathcal{M}| = |\mathcal{K}| = |\mathcal{C}|$, the scheme is perfectly secret **iff** every key is chosen with probability $1/|\mathcal{K}|$ **and** for all $m, c$ there is a unique $k$ with $\mathsf{Enc}_k(m) = c$.

### Negligible function (Def. 3.4)

$f \colon \mathbb{N} \to \mathbb{R}^+$ is negligible if for every positive polynomial $p$ there is an $N$ such that for all $n > N$: $f(n) < 1/p(n)$.

### EAV-security (Def. 3.8)

$\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)$: $k \gets \mathsf{Gen}(1^n)$; $\mathcal{A}(1^n)$ outputs $m_0, m_1$ with $|m_0| = |m_1|$; $b \gets \{0,1\}$, $c \gets \mathsf{Enc}_k(m_b)$ given to $\mathcal{A}$; $\mathcal{A}$ outputs $b'$; output 1 iff $b' = b$. $\Pi$ is EAV-secure if for every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$. **Theorem 3.13:** equivalent to semantic security.

### PRG (Def. 3.14)

A deterministic poly-time $G$ with $|G(s)| = \ell(|s|)$ is a PRG if (1) **expanding:** $\ell(n) > n$, and (2) **pseudorandom:** for every p.p.t. $\mathcal{D}$ there is a negligible $\varepsilon$ with

$$\Big|\Pr_{s \gets \{0,1\}^n}[\mathcal{D}(G(s)) = 1] - \Pr_{y \gets \{0,1\}^{\ell(n)}}[\mathcal{D}(y) = 1]\Big| \le \varepsilon(n).$$

### Pseudo one-time pad (Construction 3.17, Theorem 3.16)

$k \gets \{0,1\}^n$, $\mathsf{Enc}_k(m) = G(k) \oplus m$, $\mathsf{Dec}_k(c) = G(k) \oplus c$ for $m \in \{0,1\}^{\ell(n)}$. EAV-secure if $G$ is a PRG.

### CPA-security (Def. 3.21)

$\mathsf{PrivK}^{\mathsf{cpa}}$: as $\mathsf{PrivK}^{\mathsf{eav}}$, but $\mathcal{A}$ has oracle access to $\mathsf{Enc}_k(\cdot)$ before and after the challenge. Secure if $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$. **Theorem 3.23:** CPA-secure $\Rightarrow$ CPA-secure for multiple encryptions. Only randomised (or stateful) encryption can be CPA-secure.

### PRF (Def. 3.24)

An efficient keyed function $F$ (length-preserving: $F_k \colon \{0,1\}^n \to \{0,1\}^n$ for $k \in \{0,1\}^n$) is a PRF if for every p.p.t. $\mathcal{D}$ there is a negligible $\varepsilon$ with

$$\Big|\Pr_{k \gets \{0,1\}^n}[\mathcal{D}^{F_k(\cdot)}(1^n) = 1] - \Pr_{f \gets \mathsf{Func}_n}[\mathcal{D}^{f(\cdot)}(1^n) = 1]\Big| \le \varepsilon(n),$$

where $\mathsf{Func}_n$ is the set of all functions $\{0,1\}^n \to \{0,1\}^n$.

### PRP (Lecture 6, slide 14)

A keyed permutation ($F_k$ bijective, $F_k$ and $F_k^{-1}$ efficiently computable) such that $F_k$ for uniform $k$ is indistinguishable (same inequality) from a uniform $f \gets \mathsf{Perm}_n$, the set of permutations of $\{0,1\}^n$.

### CPA-secure constructions

- **Construction 3.28 / Theorem 3.29:** $\mathsf{Enc}_k(m) = (r, F_k(r) \oplus m)$, $r \gets \{0,1\}^n$; CPA-secure if $F$ is a PRF; $\Pr \le \tfrac12 + \varepsilon(n) + q(n)/2^n$.
- **Theorem 3.33:** CTR mode is CPA-secure if $F$ is a PRF.
- **Theorem 3.32:** CBC mode is CPA-secure if $F$ is a PRP.

### CCA-security (Def. 5.1)

$\mathsf{PrivK}^{\mathsf{cca}}$: as $\mathsf{PrivK}^{\mathsf{cpa}}$, but $\mathcal{A}$ also has a decryption oracle $\mathsf{Dec}_k(\cdot)$, which after the challenge answers every $c \neq c^*$. Secure if $\Pr[\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$ for every p.p.t. $\mathcal{A}$ and a negligible $\varepsilon$.` },
  );

  // ===================================================================
  // Cross-lecture — true/false
  // ===================================================================
  add(
    { id: "mix-tf-01", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slides 10–12, 18", difficulty: 2,
      statement: R`Perfect indistinguishability implies computational indistinguishability in the presence of an eavesdropper (EAV-security).`,
      answer: true,
      explanation: R`Perfect indistinguishability means every adversary wins $\mathsf{PrivK}^{\mathsf{eav}}$ with probability exactly $\tfrac12$; in particular every p.p.t. adversary does, so the EAV bound holds with $\varepsilon = 0$.` },

    { id: "mix-tf-02", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slides 13, 19; Lecture 2, Theorem 2.11", difficulty: 2,
      statement: R`Every EAV-secure encryption scheme is perfectly secret.`,
      answer: false,
      explanation: R`The pseudo one-time pad with key length $n$ and message length $\ell(n) > n$ is EAV-secure (Theorem 3.16), but $|\mathcal{K}| < |\mathcal{M}|$, so it cannot be perfectly secret (Theorem 2.11).` },

    { id: "mix-tf-03", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 8; Lecture 2, Theorem 2.10", difficulty: 2,
      statement: R`The one-time pad is CPA-secure, since it is perfectly secret.`,
      answer: false,
      explanation: R`The one-time pad is deterministic: a CPA adversary queries $m$, gets $k \oplus m$ and recovers $k$ (or simply compares $\mathsf{Enc}_k(m_0)$ with the challenge). Perfect secrecy only concerns a single encryption.` },

    { id: "mix-tf-04", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slide 19; Lecture 6, slide 8", difficulty: 2,
      statement: R`If $G$ is a PRG, the pseudo one-time pad (Construction 3.17) is EAV-secure but not CPA-secure.`,
      answer: true,
      explanation: R`EAV-security is Theorem 3.16. $\mathsf{Enc}_k(m) = G(k) \oplus m$ is deterministic, so it is not CPA-secure: query $m_0$ and compare with the challenge.` },

    { id: "mix-tf-05", type: "tf", lecture: 7, topic: "cca", origin: "slides",
      source: "Lecture 7, slides 13, 20", difficulty: 1,
      statement: R`Every CPA-secure encryption scheme is CCA-secure.`,
      answer: false,
      explanation: R`CTR mode is CPA-secure (Theorem 3.33) but not CCA-secure: flipping a bit of $c_1$ in the challenge and asking the decryption oracle reveals $m_b \oplus \Delta$.` },

    { id: "mix-tf-06", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 20", difficulty: 1,
      statement: R`A private-key encryption scheme that is EAV-secure is also semantically secure in the presence of an eavesdropper.`,
      answer: true,
      explanation: R`Theorem 3.13: semantic security (in the presence of an eavesdropper) is equivalent to computational indistinguishability in the presence of an eavesdropper.` },

    { id: "mix-tf-07", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 5, slide 19; Lecture 6, slides 3, 7", difficulty: 2,
      statement: R`EAV-security implies security when the same key is used to encrypt several messages.`,
      answer: false,
      explanation: R`The pseudo one-time pad is EAV-secure, but reusing the key gives $c \oplus c' = m \oplus m'$. That is why the stronger notion of CPA-security is introduced, which does imply multi-message security (Theorem 3.23).` },

    { id: "mix-tf-08", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 7", difficulty: 1,
      statement: R`If a private-key encryption scheme is CPA-secure, then it is also CPA-secure for multiple encryptions.`,
      answer: true,
      explanation: R`This is Theorem 3.23. Intuitively, a CPA adversary can produce the other ciphertexts itself with its encryption oracle.` },

    { id: "mix-tf-09", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, Theorem 2.11", difficulty: 1,
      statement: R`A perfectly secret encryption scheme may use keys that are shorter than its messages, as long as the keys are chosen uniformly.`,
      answer: false,
      explanation: R`Theorem 2.11: every perfectly secret scheme has $|\mathcal{K}| \ge |\mathcal{M}|$. Short keys are only possible for computational security (e.g. the pseudo one-time pad).` },

    { id: "mix-tf-10", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slides 12–15", difficulty: 1,
      statement: R`Computational security tolerates a negligible success advantage of efficient adversaries, while perfect secrecy tolerates no advantage at all, even for unbounded adversaries.`,
      answer: true,
      explanation: R`These are exactly the two relaxations from perfect to computational security: only p.p.t. adversaries, and success $\tfrac12 + \varepsilon(n)$ with $\varepsilon$ negligible instead of exactly $\tfrac12$.` },

    { id: "mix-tf-11", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slides 8, 16", difficulty: 2,
      statement: R`A stateless encryption scheme with deterministic $\mathsf{Enc}$ can be CPA-secure if the underlying block cipher is a pseudorandom permutation.`,
      answer: false,
      explanation: R`For any deterministic (stateless) scheme, $\mathcal{A}$ queries $m_0$, gets $c_1$, and outputs $0$ iff the challenge equals $c_1$: success probability $1$. The quality of the primitive does not matter.` },

    { id: "mix-tf-12", type: "tf", lecture: 7, topic: "modes", origin: "slides",
      source: "Lecture 6, slide 17; Lecture 7, slides 13–14", difficulty: 1,
      statement: R`Construction 3.28 and CTR mode only need $F$ to be a PRF, whereas CBC mode needs $F$ to be a PRP.`,
      answer: true,
      explanation: R`Construction 3.28 and CTR evaluate $F_k$ only forwards; CBC decryption uses $F_k^{-1}$.` },

    { id: "mix-tf-13", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 5, slides 6–7", difficulty: 1,
      statement: R`A PRG is a randomised algorithm: on the same seed it may output different strings.`,
      answer: false,
      explanation: R`A PRG is a deterministic polynomial-time algorithm (Def. 3.14). All randomness comes from the uniform seed.` },

    { id: "mix-tf-14", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 14", difficulty: 1,
      statement: R`In the lecture, block ciphers such as AES are viewed as practical constructions of pseudorandom permutations.`,
      answer: true,
      explanation: R`Lecture 6, slide 14: "Block ciphers: practical constructions of PRPs" (with a fixed block length).` },

    { id: "mix-tf-15", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 16", difficulty: 2,
      statement: R`For a pseudorandom permutation $F$, the scheme $\mathsf{Enc}_k(m) := F_k(m)$, $\mathsf{Dec}_k(c) := F_k^{-1}(c)$ for $m \in \{0,1\}^n$ is CPA-secure.`,
      answer: false,
      explanation: R`It is EAV-secure (passively secure), but deterministic, hence not CPA-secure: query $m_0$ and compare $F_k(m_0)$ with the challenge.` },

    { id: "mix-tf-16", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slide 18", difficulty: 1,
      statement: R`In the EAV experiment $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)$, the adversary has no oracle access; it only sees the challenge ciphertext.`,
      answer: true,
      explanation: R`$\mathcal{A}$ outputs $m_0, m_1$, receives $c \gets \mathsf{Enc}_k(m_b)$ and outputs $b'$. Encryption-oracle access is what the CPA experiment adds.` },

    { id: "mix-tf-17", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 13", difficulty: 1,
      statement: R`In the PRF security definition, the distinguisher $\mathcal{D}$ is given the key $k$ together with oracle access to $F_k$.`,
      answer: false,
      explanation: R`$\mathcal{D}$ only gets oracle access to $F_k(\cdot)$ (for a secret uniform $k$) or to a random $f$. With the key, $\mathcal{D}$ could evaluate $F_k$ itself and trivially distinguish.` },

    { id: "mix-tf-18", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 10", difficulty: 2,
      statement: R`$\mathsf{Func}_n$, the set of all functions $\{0,1\}^n \to \{0,1\}^n$, has $2^{n \cdot 2^n}$ elements.`,
      answer: true,
      explanation: R`Each of the $2^n$ inputs is mapped to one of $2^n$ outputs: $(2^n)^{2^n} = 2^{n \cdot 2^n}$. Equivalently, a function is described by an $n \cdot 2^n$-bit table.` },

    { id: "mix-tf-19", type: "tf", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slides 15, 18", difficulty: 2,
      statement: R`If some p.p.t. adversary wins $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)$ with probability $\tfrac12 + 2^{-n/2}$, then $\Pi$ is not EAV-secure.`,
      answer: false,
      explanation: R`$2^{-n/2}$ is negligible, so this adversary is consistent with the definition ($\varepsilon(n) := 2^{-n/2}$). To break EAV-security one needs a non-negligible advantage.` },

    { id: "mix-tf-20", type: "tf", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 4, slide 15; Lecture 6, slide 6", difficulty: 2,
      statement: R`If some p.p.t. adversary wins $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)$ with probability $\tfrac12 + \tfrac{1}{n^2}$, then $\Pi$ is not CPA-secure.`,
      answer: true,
      explanation: R`CPA-security would require a negligible $\varepsilon$ with $\varepsilon(n) \ge 1/n^2$ for all $n$, but for the polynomial $p(n) = n^2$ a negligible function is eventually below $1/p(n)$. Contradiction.` },

    { id: "mix-tf-21", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 4, slides 10–11", difficulty: 2,
      statement: R`A scheme is perfectly indistinguishable if every p.p.t. adversary wins $\mathsf{PrivK}^{\mathsf{eav}}$ with probability at most $\tfrac12 + \varepsilon(n)$ for a negligible $\varepsilon$.`,
      answer: false,
      explanation: R`That is the computational notion (Def. 3.8). Perfect indistinguishability (Def. 2.6) requires success probability exactly $\tfrac12$ for every adversary, without any bound on its running time.` },

    { id: "mix-tf-22", type: "tf", lecture: 5, topic: "prg", origin: "slides",
      source: "Lecture 2, Theorem 2.10; Lecture 5, slide 19", difficulty: 2,
      statement: R`A scheme with deterministic encryption can be EAV-secure.`,
      answer: true,
      explanation: R`The one-time pad and the pseudo one-time pad are deterministic and EAV-secure. Determinism only rules out CPA-security, where the adversary can encrypt $m_0$ itself.` },
  );

  // ===================================================================
  // Cross-lecture — flashcards
  // ===================================================================
  add(
    { id: "mix-card-01", type: "card", lecture: 7, topic: "cca", origin: "slides",
      source: "Lectures 2, 4, 6, 7", difficulty: 2,
      front: R`Give the implications between perfect secrecy, EAV, CPA and CCA, with a separating example for each failing converse.`,
      back: R`CCA $\Rightarrow$ CPA $\Rightarrow$ EAV $\Leftarrow$ perfect. EAV $\not\Rightarrow$ CPA and EAV $\not\Rightarrow$ perfect: pseudo-OTP. Perfect $\not\Rightarrow$ CPA: OTP. CPA $\not\Rightarrow$ perfect: CTR on $2n$-bit messages. CPA $\not\Rightarrow$ CCA: CTR, CBC, Construction 3.28.` },

    { id: "mix-card-02", type: "card", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lecture 6, slide 8", difficulty: 1,
      front: R`Why can no deterministic (stateless) encryption scheme be CPA-secure? Give the attack.`,
      back: R`$\mathcal{A}$ queries $m_0$ to the encryption oracle and gets $c_1 = \mathsf{Enc}_k(m_0)$; it outputs $m_0, m_1$ ($m_0 \neq m_1$) and outputs $b' = 0$ iff the challenge equals $c_1$. Success probability $1$.` },

    { id: "mix-card-03", type: "card", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lectures 5–7", difficulty: 1,
      front: R`Which primitive is used for: pseudo-OTP, Construction 3.28, CTR, CBC, ECB?`,
      back: R`Pseudo-OTP: PRG. Construction 3.28 and CTR: PRF. CBC and ECB: PRP (they need $F_k^{-1}$). Block ciphers are the practical PRPs.` },

    { id: "mix-card-04", type: "card", lecture: 4, topic: "computational", origin: "slides",
      source: "Lecture 4, slides 12–15", difficulty: 1,
      front: R`What are the two relaxations from perfect secrecy to computational security?`,
      back: R`(1) Only efficient (p.p.t.) adversaries are considered. (2) They may succeed with negligible probability, i.e. win with probability $\le \tfrac12 + \varepsilon(n)$ instead of exactly $\tfrac12$.` },

    { id: "mix-card-05", type: "card", lecture: 6, topic: "cpa-prf", origin: "slides",
      source: "Lectures 5–6", difficulty: 2,
      front: R`PRG vs. PRF vs. PRP: what does the distinguisher get in each definition?`,
      back: R`PRG: a single string, either $G(s)$ for uniform $s$ or a uniform $\ell(n)$-bit string. PRF: oracle access to $F_k$ (secret uniform $k$) or to a uniform $f \in \mathsf{Func}_n$. PRP: oracle access to $F_k$ or to a uniform permutation $f \in \mathsf{Perm}_n$.` },

    { id: "mix-card-06", type: "card", lecture: 7, topic: "modes", origin: "slides",
      source: "Lectures 2, 5, 6, 7", difficulty: 2,
      front: R`Which notions do these schemes satisfy: OTP, pseudo-OTP, $F_k(m)$ for one block, Construction 3.28, ECB, CTR, CBC?`,
      back: R`OTP: perfect (hence EAV), not CPA. Pseudo-OTP: EAV, not CPA. $F_k(m)$: EAV, not CPA. Construction 3.28, CTR, CBC: CPA (hence EAV), not CCA. ECB (several blocks): not even EAV. None is CCA-secure.` },

    { id: "mix-card-07", type: "card", lecture: 7, topic: "cca", origin: "slides",
      source: "Lectures 5–7 (proof structure)", difficulty: 2,
      front: R`Checklist for a "show $\Pi$ is not X-secure" answer.`,
      back: R`(1) State the definition. (2) Define $\mathcal{A}$ step by step, with all values it chooses (queries, $m_0 \neq m_1$ of equal length, modified ciphertexts and why they are allowed). (3) Compute what $\mathcal{A}$ sees for $b = 0$ and $b = 1$. (4) Success probability (often $1$), which is not $\le \tfrac12 + \mathsf{negl}(n)$.` },

    { id: "mix-card-08", type: "card", lecture: 5, topic: "reductions", origin: "slides",
      source: "Lecture 5, slides 11–18; Lecture 6, slides 18–21", difficulty: 2,
      front: R`Checklist for a security proof by reduction (e.g. to a PRG or PRF).`,
      back: R`(1) State the assumption. (2) Given any p.p.t. $\mathcal{A}$, build $\mathcal{D}$ that simulates the experiment for $\mathcal{A}$ using its challenge/oracle, and outputs 1 iff $b' = b$. (3) $\mathcal{D}$ is p.p.t. (4) Real case: $\Pr[\mathcal{D} = 1] = \Pr[\mathsf{PrivK} = 1]$. (5) Random case: one-time pad, $\Pr[\mathcal{D} = 1] \le \tfrac12$ (+ negligible bad event). (6) Combine with the assumption's inequality.` },
  );
})();
