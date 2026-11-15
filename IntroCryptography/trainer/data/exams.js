(function () {
  const R = String.raw;
  const add = (...items) => (window.CRYPTO_BANK = window.CRYPTO_BANK || []).push(...items);

  // ===================================================================
  // Sample midterm (this year): Q1 true/false
  // ===================================================================
  add(
    { id: "ex-sample-tf-a", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "sample",
      source: "Sample midterm, Q1a", difficulty: 2,
      statement: R`The Caesar cipher with the single-letter message space $\{\mathtt{A}, \dots, \mathtt{Z}\}$ is perfectly secret.`,
      answer: true,
      explanation: R`With a uniform key $k \in \{0,\dots,25\}$ and a single letter, $|\mathcal{M}| = |\mathcal{K}| = |\mathcal{C}| = 26$, every key is equiprobable and for every $m, c$ there is exactly one key with $\mathsf{Enc}_k(m) = c$ (namely $k = c - m \bmod 26$). By Shannon's theorem it is perfectly secret: it is a one-time pad over $\mathbb{Z}_{26}$.` },

    { id: "ex-sample-tf-b", type: "tf", lecture: 3, topic: "block-ciphers", origin: "sample",
      source: "Sample midterm, Q1b", difficulty: 1,
      statement: R`In a substitution-permutation network (SPN), the substitution function must be invertible, otherwise the SPN is not invertible.`,
      answer: true,
      explanation: R`Decrypting an SPN runs every round backwards, which needs $S^{-1}$ for each S-box (and the inverse of the permutation layer). A non-invertible S-box loses information, so the whole SPN would not be a permutation. (Contrast: a Feistel network does not need invertible round functions.)` },

    { id: "ex-sample-tf-c", type: "tf", lecture: 4, topic: "stream-ciphers", origin: "sample",
      source: "Sample midterm, Q1c", difficulty: 1,
      statement: R`Stream ciphers must apply a complex non-linear transformation when mixing the key stream with the plaintext in order to be secure.`,
      answer: false,
      explanation: R`Stream ciphers simply XOR the key stream with the plaintext, $c_i = m_i \oplus s_i$, exactly like the one-time pad. Security comes from the key stream being pseudorandom, not from the mixing step.` },

    { id: "ex-sample-tf-d", type: "tf", lecture: 4, topic: "computational", origin: "sample",
      source: "Sample midterm, Q1d", difficulty: 2,
      statement: R`If $f(n)$ is a negligible function, then $f(n)^n$ is also negligible.`,
      answer: true,
      explanation: R`Since $f$ is negligible, $0 \le f(n) < 1$ for all large $n$, hence $f(n)^n \le f(n)$ for all $n \ge 1$ from that point on. A function bounded by a negligible function is negligible.` },

    { id: "ex-sample-tf-e", type: "tf", lecture: 4, topic: "computational", origin: "sample",
      source: "Sample midterm, Q1e", difficulty: 3,
      statement: R`There are encryption schemes for the message space $\{0,1\}^\ast$ that can be EAV-secure even when dropping the requirement $|m_0| = |m_1|$ in the security experiment.`,
      answer: false,
      explanation: R`Encryption cannot hide the message length. $\mathsf{Enc}_k(0)$ has length at most some polynomial $q(n)$; by correctness, ciphertexts of distinct messages are distinct, so a uniform message of length $q(n)+n+1$ has a ciphertext of length at most $q(n)$ with probability below $2^{-n}$. An adversary with $m_0 = 0$ and such an $m_1$ that outputs $0$ iff $|c| \le q(n)$ wins with probability close to 1.` },

    { id: "ex-sample-tf-f", type: "tf", lecture: 5, topic: "prg", origin: "sample",
      source: "Sample midterm, Q1f", difficulty: 1,
      statement: R`A pseudorandom generator (PRG) is a deterministic algorithm.`,
      answer: true,
      explanation: R`By Definition 3.14 a PRG is a deterministic polynomial-time algorithm: all randomness comes from the uniform seed, and the same seed always gives the same output (which is what lets sender and receiver both compute $G(k)$).` },

    { id: "ex-sample-tf-g", type: "tf", lecture: 5, topic: "prg", origin: "sample",
      source: "Sample midterm, Q1g", difficulty: 2,
      statement: R`If $G \colon \{0,1\}^n \to \{0,1\}^{2n}$ is a PRG, then $G' \colon \{0,1\}^n \to \{0,1\}^{4n}$ defined as $G'(x) := G(x) \| G(x)$ is also a PRG.`,
      answer: false,
      explanation: R`$\mathcal{D}$ outputs 1 iff the first $2n$ bits of its input equal the last $2n$ bits. On $G'(x)$ this always happens; on a uniform $4n$-bit string only with probability $2^{-2n}$. The distinguishing advantage $1 - 2^{-2n}$ is not negligible.` },

    { id: "ex-sample-tf-h", type: "tf", lecture: 7, topic: "modes", origin: "sample",
      source: "Sample midterm, Q1h", difficulty: 2,
      statement: R`ECB mode is EAV-secure when instantiated with a pseudorandom permutation (PRP).`,
      answer: false,
      explanation: R`ECB encrypts equal blocks to equal ciphertext blocks. With $m_0 = 0^n \| 0^n$ and $m_1 = 0^n \| 1^n$ the adversary outputs 0 iff $c_1 = c_2$; since $F_k$ is a permutation this is correct with probability 1, even with a single (eavesdropped) ciphertext.` },

    { id: "ex-sample-tf-i", type: "tf", lecture: 7, topic: "modes", origin: "sample",
      source: "Sample midterm, Q1i", difficulty: 1,
      statement: R`Unlike CBC mode, CTR mode can be instantiated with a PRF rather than a PRP.`,
      answer: true,
      explanation: R`CBC decryption computes $m_i = F_k^{-1}(c_i) \oplus c_{i-1}$, so $F_k$ must be invertible. CTR decryption computes $m_i = F_k(c_0 + i) \oplus c_i$, using $F_k$ only in the forward direction, so a PRF suffices (Theorem 3.33).` },

    { id: "ex-sample-tf-j", type: "tf", lecture: 7, topic: "cca", origin: "sample",
      source: "Sample midterm, Q1j", difficulty: 1,
      statement: R`Every CCA-secure encryption scheme is also CPA-secure.`,
      answer: true,
      explanation: R`A CPA adversary is a CCA adversary that simply never uses its decryption oracle, so any CPA attack is also a CCA attack. Hence CCA-security implies CPA-security (which implies EAV-security).` },
  );

  // ===================================================================
  // Sample midterm: Q2 PRF definition
  // ===================================================================
  add(
    { id: "ex-sample-gap-prf", type: "gap", lecture: 6, topic: "cpa-prf", origin: "sample",
      source: "Sample midterm, Q2", difficulty: 2,
      title: "Pseudorandom function (PRF)", points: 5,
      text: R`Fill in the gaps. A keyed function $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ is a pseudorandom function (PRF) if for every <gap>p.p.t. distinguisher $\mathcal{D}$</gap>, there exists <gap>a negligible function $\varepsilon(\cdot)$</gap> such that

<gap>$\left|\Pr\big[\mathcal{D}^{F_k(\cdot)}(1^n) = 1\big] - \Pr\big[\mathcal{D}^{f(\cdot)}(1^n) = 1\big]\right| \le \varepsilon(n)$</gap>,

where the left probability is over <gap>the uniform choice of the key $k \gets \{0,1\}^n$</gap> (and the randomness of $\mathcal{D}$), and the right probability is over <gap>the uniform choice of the function $f \gets \mathsf{Func}_n$</gap> (and the randomness of $\mathcal{D}$).`,
      note: R`$\mathsf{Func}_n$ is the set of all functions $\{0,1\}^n \to \{0,1\}^n$. $\mathcal{D}$ only gets **oracle access** to $F_k$ or $f$; it never sees $k$. This is Definition 3.24.` },
  );

  // ===================================================================
  // Sample midterm: Q3 perfect secrecy (2+2)
  // ===================================================================
  add(
    { id: "ex-sample-q3", type: "problem", lecture: 2, topic: "perfect-secrecy", origin: "sample",
      source: "Sample midterm, Q3", difficulty: 3,
      title: "Variable-length one-time pad and padding",
      mock: true,
      statement: R`Consider the following encryption scheme $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ for the message space $\{0,1\}^{\le \ell}$, i.e., all non-empty binary strings of length at most $\ell$: $\mathsf{Gen}$ chooses a uniform key $k \gets \{0,1\}^\ell$, $\mathsf{Enc}_k(m) := k_{|m|} \oplus m$, and $\mathsf{Dec}_k(c) := k_{|c|} \oplus c$, where $k_j$ denotes the first $j$ bits of $k$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Prove that $\Pi$ is not perfectly secret.`,
          hints: [
            R`What does the ciphertext reveal about the message for certain? Compare $|c|$ and $|m|$.`,
            R`Pick a distribution over two messages of different lengths, e.g. uniform over $\{0, 00\}$ (this needs $\ell \ge 2$).`,
            R`For a ciphertext $c$ of length 2, compute $\Pr[M = 0 \mid C = c]$ and compare it with $\Pr[M = 0]$.`
          ],
          solution: R`Recall: $\Pi$ is perfectly secret if for every distribution over $\mathcal{M}$, every $m \in \mathcal{M}$ and every $c$ with $\Pr[C = c] > 0$ we have $\Pr[M = m \mid C = c] = \Pr[M = m]$.

Let $\ell \ge 2$ (for $\ell = 1$ the scheme is exactly the one-time pad on one bit and *is* perfectly secret). Encryption preserves length: $|\mathsf{Enc}_k(m)| = |m|$ for every key.

Take $M$ uniform over $\{0, 00\}$, so $\Pr[M = 0] = \tfrac12$, and take $c := 00$. Then
$$\Pr[C = 00] \ge \Pr[M = 00] \cdot \Pr[K_2 = 00] = \tfrac12 \cdot \tfrac14 > 0,$$
where $K_2$ are the first two key bits. But $c$ has length 2, and the one-bit message $0$ only produces ciphertexts of length 1, so
$$\Pr[M = 0 \mid C = 00] = 0 \neq \tfrac12 = \Pr[M = 0].$$
Hence $\Pi$ is not perfectly secret.

(Equally fine: $M$ uniform over all of $\{0,1\}^{\le \ell}$, any $m$ with $|m| < \ell$ and any $c \in \{0,1\}^\ell$: then $\Pr[M = m \mid C = c] = 0$ but $\Pr[M = m] = 1/(2^{\ell+1}-2) > 0$.)`,
          rubric: [
            { points: 1, text: R`Chooses a concrete distribution over $\mathcal{M}$ and a ciphertext $c$ with $\Pr[C = c] > 0$, exploiting that the ciphertext length equals the message length` },
            { points: 1, text: R`Computes $\Pr[M = m \mid C = c] = 0 \neq \Pr[M = m]$ and concludes via the definition` }
          ] },
        { label: "b", points: 2,
          prompt: R`Consider the following method for padding messages of length $\le \ell$ to a fixed length of $\ell + 1$:

$\mathsf{Pad}(m)$: return $m' := m \| 1 \| 0^{\ell - |m|}$, i.e., append a 1 and enough 0s such that $|m'| = \ell + 1$.

$\mathsf{Unpad}(m')$: parse $m'$ as $m \| 1 \| 0^{\ast}$ (the last 1 marks the end of $m$) and return $m$.

By incorporating this padding scheme, we obtain the modified scheme $\Pi' = (\mathsf{Gen}', \mathsf{Enc}', \mathsf{Dec}')$ where $\mathsf{Gen}'$ chooses a uniform key $k \gets \{0,1\}^{\ell+1}$, $\mathsf{Enc}'_k(m) := k \oplus \mathsf{Pad}(m)$, and $\mathsf{Dec}'_k(c) := \mathsf{Unpad}(k \oplus c)$. Is $\Pi'$ perfectly secret? Justify your answer in at most 2–3 sentences.`,
          hints: [
            R`What is the length of every ciphertext now?`,
            R`Fix $m$ and $c \in \{0,1\}^{\ell+1}$. For how many keys is $\mathsf{Enc}'_k(m) = c$?`
          ],
          solution: R`**Yes.** Every ciphertext has length $\ell + 1$, and $\Pi'$ is just the one-time pad on $\{0,1\}^{\ell+1}$ applied to $\mathsf{Pad}(m)$, where $\mathsf{Pad}$ is injective. Concretely, for every $m$ and every $c \in \{0,1\}^{\ell+1}$, $\Pr[\mathsf{Enc}'_K(m) = c] = \Pr[K = \mathsf{Pad}(m) \oplus c] = 2^{-(\ell+1)}$, which does not depend on $m$; so by Bayes $\Pr[C = c] = 2^{-(\ell+1)}$ and $\Pr[M = m \mid C = c] = \Pr[M = m]$ for every distribution over messages.`,
          rubric: [
            { points: 1, text: R`Answers "yes, perfectly secret"` },
            { points: 1, text: R`Justifies: fixed length $\ell+1$ / one-time pad on the injective $\mathsf{Pad}(m)$, i.e. $\Pr[\mathsf{Enc}'_K(m) = c] = 2^{-(\ell+1)}$ independent of $m$` }
          ] }
      ] },
  );

  // ===================================================================
  // Sample midterm: Q4 stateful CTR (2+4+5)
  // ===================================================================
  add(
    { id: "ex-sample-q4", type: "problem", lecture: 7, topic: "modes", origin: "sample",
      source: "Sample midterm, Q4", difficulty: 3,
      title: "Stateful CTR mode",
      mock: true,
      statement: R`Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ be a pseudorandom function (PRF), and let $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ be the following *stateful* variant of counter (CTR) mode encryption:

- $\mathsf{Gen}(1^n)$: return $k \gets \{0,1\}^n$, $ctr := 0$.
- $\mathsf{Enc}_{k,ctr}(m)$: parse $m = m_1 \| \dots \| m_\ell$ with $m_i \in \{0,1\}^n$. For $i = 1, \dots, \ell$ compute $c_i := F_k(ctr + i) \oplus m_i$. Set $c_0 := ctr$, and then update $ctr := ctr + 1$. Return $c := c_0 \| c_1 \| \dots \| c_\ell$.

(Counter values are $n$-bit strings, addition is modulo $2^n$.)`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Define the (stateless) decryption algorithm $\mathsf{Dec}_k(c)$ and show correctness.`,
          hints: [
            R`Which value does the first block $c_0$ carry?`,
            R`Recompute the same pads $F_k(c_0 + i)$ and XOR them away.`
          ],
          solution: R`$\mathsf{Dec}_k(c)$: parse $c = c_0 \| c_1 \| \dots \| c_\ell$ with $c_i \in \{0,1\}^n$. For $i = 1, \dots, \ell$ compute $m_i := F_k(c_0 + i) \oplus c_i$. Return $m := m_1 \| \dots \| m_\ell$.

No state is needed, since the counter used for encryption is sent as $c_0$.

**Correctness.** If $c = \mathsf{Enc}_{k,ctr}(m)$ then $c_0 = ctr$ and $c_i = F_k(ctr + i) \oplus m_i$, so
$$F_k(c_0 + i) \oplus c_i = F_k(ctr + i) \oplus F_k(ctr + i) \oplus m_i = m_i$$
for every $i$, hence $\mathsf{Dec}_k(c) = m$.`,
          rubric: [
            { points: 1, text: R`Correct $\mathsf{Dec}$ that reads the counter from $c_0$ and computes $m_i := F_k(c_0+i) \oplus c_i$` },
            { points: 1, text: R`Correctness shown: $F_k(ctr+i) \oplus F_k(ctr+i) \oplus m_i = m_i$` }
          ] },
        { label: "b", points: 4,
          prompt: R`Show that $\Pi$ is not CPA-secure, where in the security experiment $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)$ every call to the encryption algorithm $\mathsf{Enc}_k(\cdot)$ updates the state $ctr$ as above.`,
          hints: [
            R`The counter only increases by 1 per encryption, but a message of $\ell$ blocks uses $\ell$ counter values. What happens when two consecutive encryptions have two blocks each?`,
            R`Query the encryption oracle once on $0^n \| 0^n$ before the challenge. Which pad values do you learn, and which pads will the challenge use?`,
            R`The query gives $F_k(1), F_k(2)$; the challenge uses $F_k(2), F_k(3)$. Compare the matching blocks.`
          ],
          solution: R`$\Pi$ is CPA-secure if for every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$. We give an $\mathcal{A}$ that wins with probability 1.

**Adversary $\mathcal{A}$:**
1. Query the encryption oracle on $m := 0^n \| 0^n$. Since $ctr = 0$, the answer is $c = c_0 \| c_1 \| c_2 = 0 \| F_k(1) \| F_k(2)$; afterwards $ctr = 1$.
2. Output the challenge messages $m_0 := 0^n \| 0^n$ and $m_1 := 1^n \| 0^n$ (equal length $2n$). Receive $c^\ast = c^\ast_0 \| c^\ast_1 \| c^\ast_2$.
3. Output $b' := 0$ if $c^\ast_1 = c_2$, and $b' := 1$ otherwise.

**Analysis.** The challenge is encrypted with $ctr = 1$, so $c^\ast_1 = F_k(2) \oplus m_{b,1}$.
- If $b = 0$: $c^\ast_1 = F_k(2) \oplus 0^n = F_k(2) = c_2$, so $\mathcal{A}$ outputs $0$.
- If $b = 1$: $c^\ast_1 = F_k(2) \oplus 1^n \neq F_k(2) = c_2$, so $\mathcal{A}$ outputs $1$.

$\mathcal{A}$ makes one query and compares two strings, so it is p.p.t., and $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] = 1$. Since $1 - \tfrac12 = \tfrac12$ is not negligible, $\Pi$ is not CPA-secure.

(Why two-block messages: with one-block messages every encryption uses a single fresh counter value, which is exactly why part c works.)`,
          rubric: [
            { points: 1, text: R`Encryption query that reveals pad values the challenge will reuse (e.g. $0^n \| 0^n$ giving $F_k(1), F_k(2)$), with the counter state tracked correctly` },
            { points: 1, text: R`Concrete challenge messages of equal length, all values specified` },
            { points: 1, text: R`Correct output rule and computation of $c^\ast$ in both cases $b = 0$ and $b = 1$` },
            { points: 1, text: R`Success probability 1, so advantage $\tfrac12$ is not negligible; conclusion` }
          ] },
        { label: "c", points: 5,
          prompt: R`Prove, by giving a reduction, that $\Pi$ is CPA-secure when restricting the message space to $\{0,1\}^n$.`,
          hints: [
            R`Build a distinguisher $\mathcal{D}$ with oracle $\mathcal{O}$ (either $F_k$ or a random $f$) that plays the CPA challenger for $\mathcal{A}$, keeping the counter itself and using $\mathcal{O}(ctr+1)$ as the pad.`,
            R`With $\mathcal{O} = F_k$ the simulation is exactly $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)$. With $\mathcal{O} = f$: which counter values are used by the $q$ queries and the challenge? Can any of them repeat?`,
            R`The challenge pad $f(j)$ is at a point $j$ never queried before or after, so it is uniform and independent of everything $\mathcal{A}$ sees: the challenge is a one-time-pad encryption, and $\mathcal{A}$ wins with probability exactly $\tfrac12$.`
          ],
          solution: R`**Assumption.** $F$ is a PRF: for every p.p.t. $\mathcal{D}$ there is a negligible $\varepsilon$ with
$$\left|\Pr_{k \gets \{0,1\}^n}\big[\mathcal{D}^{F_k(\cdot)}(1^n) = 1\big] - \Pr_{f \gets \mathsf{Func}_n}\big[\mathcal{D}^{f(\cdot)}(1^n) = 1\big]\right| \le \varepsilon(n).$$

**Reduction.** Let $\mathcal{A}$ be any p.p.t. adversary against $\Pi$ (messages in $\{0,1\}^n$). Define $\mathcal{D}^{\mathcal{O}}(1^n)$:
1. Set $ctr := 0$ and run $\mathcal{A}(1^n)$.
2. When $\mathcal{A}$ queries $m \in \{0,1\}^n$: query $y := \mathcal{O}(ctr + 1)$, return $c := ctr \| (y \oplus m)$ to $\mathcal{A}$, set $ctr := ctr + 1$.
3. When $\mathcal{A}$ outputs $m_0, m_1 \in \{0,1\}^n$: choose $b \gets \{0,1\}$, query $y := \mathcal{O}(ctr+1)$, give $c^\ast := ctr \| (y \oplus m_b)$ to $\mathcal{A}$, set $ctr := ctr + 1$.
4. Answer further queries as in step 2.
5. When $\mathcal{A}$ outputs $b'$: output $1$ if $b' = b$, else $0$.

$\mathcal{D}$ is p.p.t.: it runs $\mathcal{A}$ and does one oracle query and one XOR per encryption.

**Pseudorandom world ($\mathcal{O} = F_k$, $k$ uniform).** $\mathcal{D}$ computes every ciphertext exactly as $\mathsf{Enc}_{k,ctr}$ does, with the same counter updates, so $\mathcal{A}$'s view is exactly as in the real experiment:
$$\Pr\big[\mathcal{D}^{F_k(\cdot)}(1^n) = 1\big] = \Pr\big[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1\big].$$

**Random world ($\mathcal{O} = f \gets \mathsf{Func}_n$).** Every message is a single block, so every encryption uses exactly one counter value and then increments the counter by 1. Let $q(n)$ be a polynomial bound on the number of encryption queries of $\mathcal{A}$. The oracle is queried on $1, 2, 3, \dots$, at most $q(n)+1$ values in total, which are pairwise distinct as long as $q(n) + 1 < 2^n$ (no wrap-around modulo $2^n$), which holds for all sufficiently large $n$. Hence the challenge point $j$ is queried exactly once, and $f(j)$ is uniform and independent of all other values $f(i)$, i.e. of everything else $\mathcal{A}$ sees. So $c^\ast = j \| (f(j) \oplus m_b)$, where $j$ does not depend on $b$, is a one-time-pad encryption of $m_b$: its distribution is the same for $b = 0$ and $b = 1$. Therefore $\mathcal{A}$'s output is independent of $b$ and
$$\Pr\big[\mathcal{D}^{f(\cdot)}(1^n) = 1\big] = \tfrac12.$$

**Conclusion.** Combining both worlds with the PRF assumption,
$$\Pr\big[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1\big] - \tfrac12 = \Pr\big[\mathcal{D}^{F_k(\cdot)}(1^n) = 1\big] - \Pr\big[\mathcal{D}^{f(\cdot)}(1^n) = 1\big] \le \varepsilon(n),$$
so $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$ for every p.p.t. $\mathcal{A}$: $\Pi$ restricted to $\{0,1\}^n$ is CPA-secure. (Unlike Construction 3.28, no collision term $q(n)/2^n$ appears: the counter values are distinct with certainty.)`,
          rubric: [
            { points: 1, text: R`Defines $\mathcal{D}^{\mathcal{O}}$ that keeps the counter and answers queries and the challenge with $ctr \| \mathcal{O}(ctr+1) \oplus m$; outputs 1 iff $b' = b$; argues p.p.t.` },
            { points: 1, text: R`Pseudorandom world: perfect simulation, $\Pr[\mathcal{D}^{F_k} = 1] = \Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1]$` },
            { points: 2, text: R`Random world: the counter values $1, 2, \dots, q+1$ are pairwise distinct, so the challenge pad is fresh and uniform, $c^\ast$ is independent of $b$, and $\Pr[\mathcal{D}^{f} = 1] = \tfrac12$` },
            { points: 1, text: R`Final inequality $\Pr[\mathsf{PrivK}^{\mathsf{cpa}} = 1] \le \tfrac12 + \varepsilon(n)$ from the PRF assumption` }
          ] }
      ] },
  );

  // ===================================================================
  // Midterm 2025-12-03: Q1 true/false (official key)
  // ===================================================================
  add(
    { id: "ex-mt25-tf-a", type: "tf", lecture: 4, topic: "principles", origin: "exam",
      source: "Midterm 2025-12-03, Q1a", difficulty: 1,
      statement: R`In an encryption scheme, key generation is a randomized algorithm, but encryption and decryption must be deterministic to ensure ciphertexts can be uniquely decrypted.`,
      answer: false,
      explanation: R`Encryption may be (and for CPA-security must be) randomized, e.g. $\mathsf{Enc}_k(m) = (r, F_k(r) \oplus m)$ with fresh $r$. Only decryption is (w.l.o.g.) deterministic; correctness just requires that different messages never share a ciphertext.` },

    { id: "ex-mt25-tf-b", type: "tf", lecture: 1, topic: "historical", origin: "exam",
      source: "Midterm 2025-12-03, Q1b", difficulty: 1,
      statement: R`Unlike monoalphabetic substitution ciphers (such as the Caesar cipher), polyalphabetic substitution ciphers (such as the Vigenère cipher) are immune to frequency analysis.`,
      answer: false,
      explanation: R`Vigenère with key period $t$ is $t$ interleaved shift ciphers. Once $t$ is found (e.g. by looking for repeated patterns or by trying periods), every $t$-th letter is encrypted with the same shift and can be broken by frequency analysis.` },

    { id: "ex-mt25-tf-c", type: "tf", lecture: 4, topic: "perfect-secrecy", origin: "exam",
      source: "Midterm 2025-12-03, Q1c", difficulty: 1,
      statement: R`Every perfectly secret encryption scheme is perfectly indistinguishable, and vice versa.`,
      answer: true,
      explanation: R`This is Lemma 2.7: $\Pi$ is perfectly secret if and only if $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi} = 1] = \tfrac12$ for every (even unbounded) adversary $\mathcal{A}$.` },

    { id: "ex-mt25-tf-d", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "exam",
      source: "Midterm 2025-12-03, Q1d", difficulty: 3,
      statement: R`According to Shannon's theorem, an encryption scheme $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ with $|\mathcal{M}| = |\mathcal{K}| = |\mathcal{C}|$ is perfectly secret if for every $m \in \mathcal{M}$, $c \in \mathcal{C}$, there is a unique key $k \in \mathcal{K}$ such that $\mathsf{Enc}_k(m) = c$.`,
      answer: false,
      explanation: R`Shannon's theorem needs **two** conditions: every key is chosen with equal probability $1/|\mathcal{K}|$ **and** the unique-key condition. The statement drops the first one. Counterexample: the one-bit one-time pad with $\Pr[K=0] = \tfrac34$ has a unique key for each $(m,c)$, but for uniform $M$, $\Pr[M = 0 \mid C = 0] = \tfrac34 \neq \tfrac12$.` },

    { id: "ex-mt25-tf-e", type: "tf", lecture: 3, topic: "block-ciphers", origin: "exam",
      source: "Midterm 2025-12-03, Q1e", difficulty: 1,
      statement: R`Even if any of the round functions in a Feistel network are not invertible, the Feistel network as a whole is still invertible.`,
      answer: true,
      explanation: R`A round maps $(L_{i-1}, R_{i-1})$ to $(L_i, R_i) = (R_{i-1}, L_{i-1} \oplus f_{k_i}(R_{i-1}))$, and is inverted by $R_{i-1} = L_i$, $L_{i-1} = R_i \oplus f_{k_i}(L_i)$. This only evaluates $f_{k_i}$ forwards, so $f_{k_i}$ need not be invertible (DES uses non-invertible round functions).` },

    { id: "ex-mt25-tf-f", type: "tf", lecture: 3, topic: "block-ciphers", origin: "exam",
      source: "Midterm 2025-12-03, Q1f", difficulty: 2,
      statement: R`A meet-in-the-middle attack allows an attacker to break a double-key cipher $E'_{(k,k')} := E_{k'} \circ E_k$ with approximately square root of the time complexity of a brute-force attack on $E'$.`,
      answer: true,
      explanation: R`With $n$-bit keys $k, k'$, brute force on $E'$ tries $2^{2n}$ key pairs. Meet-in-the-middle tabulates $E_k(x)$ for all $k$ and computes $E^{-1}_{k'}(y)$ for all $k'$: about $2 \cdot 2^n$ evaluations (plus $2^n$ memory), i.e. roughly $\sqrt{2^{2n}}$ up to a factor 2. For 2DES: $2^{57}$ instead of $2^{112}$.` },

    { id: "ex-mt25-tf-g", type: "tf", lecture: 3, topic: "block-ciphers", origin: "exam",
      source: "Midterm 2025-12-03, Q1g", difficulty: 1,
      statement: R`The AES block cipher is a substitution-permutation network.`,
      answer: true,
      explanation: R`AES rounds consist of byte substitution (one S-box, confusion), ShiftRows and MixColumns (diffusion) and round-key addition: an SPN with an invertible round function, not a Feistel network.` },

    { id: "ex-mt25-tf-h", type: "tf", lecture: 4, topic: "computational", origin: "exam",
      source: "Midterm 2025-12-03, Q1h", difficulty: 2,
      statement: R`If $f(n)$ is a negligible function, then $n^{|f(n)|}$ is negligible.`,
      answer: false,
      explanation: R`For $n \ge 1$ and $|f(n)| \ge 0$ we have $n^{|f(n)|} \ge n^0 = 1$, so it never drops below $1/p(n)$; in fact $n^{|f(n)|} \to 1$. (Do not confuse with $f(n)^n$, which is negligible.)` },

    { id: "ex-mt25-tf-i", type: "tf", lecture: 7, topic: "modes", origin: "exam",
      source: "Midterm 2025-12-03, Q1i", difficulty: 1,
      statement: R`The block-cipher modes of operation ECB, CBC, and CTR are all EAV-secure (i.e., computationally indistinguishable in the presence of an eavesdropper).`,
      answer: false,
      explanation: R`ECB is not even EAV-secure: equal plaintext blocks give equal ciphertext blocks, so $m_0 = 0^n \| 0^n$ and $m_1 = 0^n \| 1^n$ are told apart by checking $c_1 = c_2$. (CBC and CTR with random IV are CPA-secure, hence EAV-secure.)` },

    { id: "ex-mt25-tf-j", type: "tf", lecture: 7, topic: "modes", origin: "exam",
      source: "Midterm 2025-12-03, Q1j", difficulty: 3,
      statement: R`CTR mode is secure even with non-random IVs, as long as a different IV is used whenever calling the encryption algorithm Enc.`,
      answer: false,
      explanation: R`What matters is that no counter value $ctr + i$ is ever used twice, not that the IVs differ. With IVs $0, 1, 2, \dots$ and two-block messages, the first encryption uses $F_k(1), F_k(2)$ and the next one $F_k(2), F_k(3)$: the pad $F_k(2)$ is reused, giving the CPA attack of sample midterm Q4b.` },
  );

  // ===================================================================
  // Midterm 2025-12-03: Q2 CCA definition (gaps exactly as on the exam)
  // ===================================================================
  add(
    { id: "ex-mt25-gap-cca", type: "gap", lecture: 7, topic: "cca", origin: "exam",
      source: "Midterm 2025-12-03, Q2", difficulty: 2,
      title: "CCA-security", points: 5,
      text: R`Fill in the gaps. A private-key encryption scheme $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ is CCA-secure, i.e., *secure against chosen-ciphertext attacks*, if for every p.p.t. adversary $\mathcal{A}$, there exists a negligible function $\varepsilon(\cdot)$ such that $\Pr[\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n) = 1] \le$ <gap>$\tfrac12 + \varepsilon(n)$</gap>, where the experiment $\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n)$ is defined as follows:

1. A key $k \gets \mathsf{Gen}(1^n)$ is generated.
2. $\mathcal{A}$ is given $1^n$ and access to <gap>an encryption oracle $\mathsf{Enc}_k(\cdot)$ and a decryption oracle $\mathsf{Dec}_k(\cdot)$</gap>.
3. $\mathcal{A}$ outputs a pair of messages $m_0, m_1$ <gap>of the same length, $|m_0| = |m_1|$</gap>.
4. A bit $b \gets \{0,1\}$ is sampled and the challenge ciphertext $c^\ast := \mathsf{Enc}_k(m_b)$ is given to $\mathcal{A}$.
5. $\mathcal{A}$ continues to have the same access as in step 2, but <gap>is not allowed to query the decryption oracle on the challenge ciphertext $c^\ast$</gap>.
6. $\mathcal{A}$ outputs a bit $b' \in \{0,1\}$. The output of the experiment is 1 if and only if <gap>$b' = b$</gap>.`,
      note: R`Definition 5.1. Without the restriction in step 5 the definition is unachievable ($\mathcal{A}$ would just decrypt $c^\ast$). Removing both decryption oracles gives exactly the CPA experiment.` },
  );

  // ===================================================================
  // Midterm 2025-12-03: Q3 PRG with parity (2+4)
  // ===================================================================
  add(
    { id: "ex-mt25-q3", type: "problem", lecture: 5, topic: "prg", origin: "exam",
      source: "Midterm 2025-12-03, Q3", difficulty: 3,
      title: "PRG-based encryption with a parity selector",
      mock: true,
      statement: R`Let $G \colon \{0,1\}^n \to \{0,1\}^{2n}$ be a pseudorandom generator (PRG). For any binary string $x$, let $p(x) \in \{0,1\}$ denote its parity, i.e., whether the number of 1s in $x$ is even (0) or odd (1). Consider the following encryption scheme $\Pi$ for messages of length $n$:

- $\mathsf{Gen}(1^n)$: return $k \gets \{0,1\}^n$.
- $\mathsf{Enc}_k(m)$: compute $k_0 \| k_1 := G(k)$ with $k_i \in \{0,1\}^n$. Let $r := k_{p(m)}$ and return $c := m \oplus r \oplus (p(r) \| 0^{n-1})$.
- $\mathsf{Dec}_k(c)$: compute $k_0 \| k_1 := G(k)$. Let $s := k_{p(c)}$ and return $m := c \oplus s \oplus (p(s) \| 0^{n-1})$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Show that $\Pi$ is a correct encryption scheme. Hint: what is the parity of $r \oplus (p(r) \| 0^{n-1})$?`,
          hints: [
            R`XOR-ing $p(r) \| 0^{n-1}$ flips the first bit exactly when $p(r) = 1$. What does that do to the number of 1s?`,
            R`Parity is linear: $p(x \oplus y) = p(x) \oplus p(y)$. Use it to compare $p(c)$ with $p(m)$.`,
            R`If $p(c) = p(m)$, then the decryptor picks $s = r$.`
          ],
          solution: R`Let $w := r \oplus (p(r) \| 0^{n-1})$. If $p(r) = 0$ then $w = r$ has parity 0. If $p(r) = 1$ then $w$ is $r$ with its first bit flipped, which changes the number of 1s by one, so $p(w) = 0$. In both cases $p(w) = 0$.

Parity is linear, $p(x \oplus y) = p(x) \oplus p(y)$, so for $c = m \oplus w$:
$$p(c) = p(m) \oplus p(w) = p(m).$$
Hence $\mathsf{Dec}$ computes the same $G(k) = k_0 \| k_1$ and selects $s = k_{p(c)} = k_{p(m)} = r$, and then
$$c \oplus s \oplus (p(s) \| 0^{n-1}) = m \oplus r \oplus (p(r) \| 0^{n-1}) \oplus r \oplus (p(r) \| 0^{n-1}) = m.$$
So $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$ for all $k, m$.`,
          rubric: [
            { points: 1, text: R`Shows $p(r \oplus (p(r) \| 0^{n-1})) = 0$ and hence $p(c) = p(m)$ by linearity of parity` },
            { points: 1, text: R`Concludes $s = r$ and that the XORs cancel to give $m$` }
          ] },
        { label: "b", points: 4,
          prompt: R`Show that $\Pi$ is not EAV-secure. Make sure to specify the initial values of all variables you use!`,
          hints: [
            R`Part a showed that some property of $m$ survives encryption unchanged.`,
            R`$p(c) = p(m)$ for every key. Choose two messages of the same length with different parities.`,
            R`For instance $m_0 = 0^n$ and $m_1 = 1 \| 0^{n-1}$; output $b' := p(c)$.`
          ],
          solution: R`$\Pi$ is EAV-secure if for every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$.

By part a, $p(\mathsf{Enc}_k(m)) = p(m)$ for every key $k$: the ciphertext reveals the parity of the message.

**Adversary $\mathcal{A}(1^n)$:**
1. Output $m_0 := 0^n$ (parity 0) and $m_1 := 1 \| 0^{n-1}$ (parity 1); both have length $n$.
2. On receiving $c$, output $b' := p(c)$.

**Analysis.** If $b = 0$ then $p(c) = p(m_0) = 0$ and $\mathcal{A}$ outputs 0. If $b = 1$ then $p(c) = p(m_1) = 1$ and $\mathcal{A}$ outputs 1. So $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] = 1$, independently of $G$ and $k$. $\mathcal{A}$ only counts bits, so it is p.p.t. Since $1 > \tfrac12 + \varepsilon(n)$ for every negligible $\varepsilon$ and large $n$, $\Pi$ is not EAV-secure.`,
          rubric: [
            { points: 1, text: R`Identifies the leak $p(c) = p(m)$` },
            { points: 1, text: R`Specifies concrete $m_0, m_1$ of equal length and different parity` },
            { points: 1, text: R`Specifies the output rule $b' := p(c)$ and analyses both cases of $b$` },
            { points: 1, text: R`Success probability 1, not $\le \tfrac12 + \mathsf{negl}(n)$; conclusion` }
          ] }
      ] },
  );

  // ===================================================================
  // Final exam 2024-01-26: Q1 a-e
  // ===================================================================
  add(
    { id: "ex-fe24-tf-a", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "exam",
      source: "Final exam 2024-01-26, Q1a", difficulty: 1,
      statement: R`An unbounded adversary can break a perfectly secret encryption scheme.`,
      answer: false,
      explanation: R`Perfect secrecy is information-theoretic: $\Pr[M = m \mid C = c] = \Pr[M = m]$, so the ciphertext carries no information about the message, and no amount of computing power helps (perfect indistinguishability holds for every adversary).` },

    { id: "ex-fe24-tf-b", type: "tf", lecture: 4, topic: "computational", origin: "exam",
      source: "Final exam 2024-01-26, Q1b", difficulty: 2,
      statement: R`$f(n) = n^{-\frac{1}{n}}$ is negligible.`,
      answer: false,
      explanation: R`$n^{-1/n} = 2^{-(\log n)/n} \to 2^0 = 1$, and $n^{-1/n} \ge \tfrac12$ for all $n \ge 1$. So it is not smaller than $1/p(n)$ for, e.g., $p(n) = 4$. (The memory protocol writes $1^{-1/n} = 1$, also not negligible.)` },

    { id: "ex-fe24-tf-c", type: "tf", lecture: 3, topic: "block-ciphers", origin: "exam",
      source: "Final exam 2024-01-26, Q1c", difficulty: 1,
      statement: R`DES has longer keys than AES.`,
      answer: false,
      explanation: R`DES has 56-bit keys (64-bit blocks); AES has 128-, 192- or 256-bit keys (128-bit blocks).` },

    { id: "ex-fe24-tf-d", type: "tf", lecture: 7, topic: "modes", origin: "exam",
      source: "Final exam 2024-01-26, Q1d", difficulty: 1,
      statement: R`The block-cipher modes of operation ECB, CBC, and CTR are all CPA-secure.`,
      answer: false,
      explanation: R`ECB is deterministic, and no deterministic (stateless) scheme is CPA-secure: query $m_0$, then compare with the challenge ciphertext. CBC and CTR with uniform IV are CPA-secure (Theorems 3.32 and 3.33).` },

    { id: "ex-fe24-tf-e", type: "tf", lecture: 7, topic: "cca", origin: "exam",
      source: "Final exam 2024-01-26, Q1e", difficulty: 1,
      statement: R`The block-cipher modes of operation CBC and CTR are CCA-secure.`,
      answer: false,
      explanation: R`Both are malleable. In CTR, flipping a bit of $c_1$ flips the same bit of $m_1$; in CBC, flipping a bit of the IV $c_0$ flips the same bit of $m_1$. Querying the decryption oracle on such a modified challenge ($\neq c^\ast$) reveals $m_b$.` },
  );

  // ===================================================================
  // Final exam 2024-01-26: Q2 a-c
  // ===================================================================
  add(
    { id: "ex-fe24-q2", type: "problem", lecture: 7, topic: "cca", origin: "exam",
      source: "Final exam 2024-01-26, Q2a-c", difficulty: 2,
      title: "From CCA to CPA; the one-time pad",
      mock: true,
      statement: R`A private-key encryption scheme $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ is CCA-secure if for every p.p.t. adversary $\mathcal{A}$ there exists a negligible function $\varepsilon(\cdot)$ such that $\Pr[\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$, with $\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n)$ defined as follows:

1. A key $k \gets \mathsf{Gen}(1^n)$ is generated. $\mathcal{A}$ is given $1^n$ and oracle access to $\mathsf{Enc}_k(\cdot)$ and $\mathsf{Dec}_k(\cdot)$.
2. $\mathcal{A}$ outputs a pair of messages $m_0, m_1$ with $|m_0| = |m_1|$.
3. A bit $b \gets \{0,1\}$ is sampled and the challenge ciphertext $c^\ast := \mathsf{Enc}_k(m_b)$ is given to $\mathcal{A}$.
4. $\mathcal{A}$ continues to have access to $\mathsf{Enc}_k(\cdot)$ and $\mathsf{Dec}_k(\cdot)$, but is not allowed to query the latter on $c^\ast$.
5. $\mathcal{A}$ outputs a bit $b' \in \{0,1\}$. The output of the experiment is 1 iff $b' = b$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Which modifications to the definition of CCA-security are necessary to obtain CPA-security?`,
          hints: [
            R`What extra power does a CCA adversary have compared to a CPA adversary?`,
            R`Remove that power everywhere it appears, and anything that only exists because of it.`
          ],
          solution: R`Remove the decryption oracle: in step 1, $\mathcal{A}$ only gets oracle access to $\mathsf{Enc}_k(\cdot)$; in step 4, $\mathcal{A}$ continues to have access to $\mathsf{Enc}_k(\cdot)$ only, and the restriction "not allowed to query $\mathsf{Dec}_k$ on $c^\ast$" disappears with it. Everything else stays the same: p.p.t. $\mathcal{A}$, $|m_0| = |m_1|$, $c^\ast := \mathsf{Enc}_k(m_b)$, output 1 iff $b' = b$, and the bound $\tfrac12 + \varepsilon(n)$; the experiment is then called $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)$.`,
          rubric: [
            { points: 1, text: R`Removes $\mathsf{Dec}_k(\cdot)$ from step 1 and from step 4 (keeping $\mathsf{Enc}_k(\cdot)$ in both)` },
            { points: 1, text: R`Drops the restriction on $c^\ast$ and states that everything else is unchanged` }
          ] },
        { label: "b", points: 4,
          prompt: R`Define the one-time pad encryption by specifying the key space, the message space, and all 3 algorithms.`,
          hints: [
            R`Everything lives in $\{0,1\}^\ell$ for a fixed length $\ell$.`,
            R`The key must be uniform; encryption and decryption are the same XOR operation.`
          ],
          solution: R`Fix a length $\ell$ (e.g. $\ell = n$).
- Key space $\mathcal{K} = \{0,1\}^\ell$, message space $\mathcal{M} = \{0,1\}^\ell$ (and ciphertext space $\mathcal{C} = \{0,1\}^\ell$).
- $\mathsf{Gen}$: choose $k \gets \{0,1\}^\ell$ uniformly at random and return $k$.
- $\mathsf{Enc}_k(m)$: return $c := k \oplus m$ (bitwise XOR).
- $\mathsf{Dec}_k(c)$: return $m := k \oplus c$.

Correctness: $k \oplus (k \oplus m) = (k \oplus k) \oplus m = 0^\ell \oplus m = m$.`,
          rubric: [
            { points: 1, text: R`$\mathcal{K} = \mathcal{M} = \{0,1\}^\ell$` },
            { points: 1, text: R`$\mathsf{Gen}$ samples $k$ **uniformly** from $\{0,1\}^\ell$` },
            { points: 1, text: R`$\mathsf{Enc}_k(m) := k \oplus m$` },
            { points: 1, text: R`$\mathsf{Dec}_k(c) := k \oplus c$` }
          ] },
        { label: "c", points: 3,
          prompt: R`Is the one-time pad encryption scheme CPA-secure? Justify your answer.`,
          hints: [
            R`Is $\mathsf{Enc}$ randomized?`,
            R`What does a single encryption-oracle answer $c = k \oplus m$ reveal?`,
            R`Query $m_0$ before the challenge and compare.`
          ],
          solution: R`**No.** The one-time pad is perfectly secret, but only for a single message; its encryption is deterministic, and no deterministic scheme is CPA-secure.

**Adversary $\mathcal{A}$** (with $\ell = n$): query the encryption oracle on $m_0 := 0^n$ and receive $c_0 = k \oplus 0^n = k$. Output the challenge messages $m_0 = 0^n$, $m_1 = 1^n$, receive $c^\ast = k \oplus m_b$, and output $b' := 0$ if $c^\ast = c_0$, else $b' := 1$.

If $b = 0$, $c^\ast = k = c_0$; if $b = 1$, $c^\ast = k \oplus 1^n \neq c_0$. So $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] = 1$, which is not $\le \tfrac12 + \mathsf{negl}(n)$. (In fact the first query reveals the whole key $k$.)`,
          rubric: [
            { points: 1, text: R`Answer "no" with the reason (deterministic encryption / the key is learned from one plaintext-ciphertext pair)` },
            { points: 1, text: R`Concrete adversary: encryption query, challenge messages, output rule` },
            { points: 1, text: R`Success probability 1 computed and conclusion` }
          ] }
      ] },

    { id: "ex-fe24-q2c-cca", type: "problem", lecture: 7, topic: "cca", origin: "exam",
      source: "Final exam 2024-01-26, Q2c (memory-protocol version)", difficulty: 2,
      title: "Is the one-time pad CCA-secure?",
      mock: false,
      statement: R`The memory protocol of the 26 January 2024 exam asks this version of Q2c.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Is the one-time pad CCA-secure? Justify your answer.`,
          hints: [
            R`How do CCA-security and CPA-security relate?`,
            R`Alternatively, attack directly with a decryption query on a ciphertext different from $c^\ast$.`
          ],
          solution: R`**No.** Every CCA-secure scheme is CPA-secure (a CPA adversary is a CCA adversary that never asks for decryptions), and the one-time pad is not CPA-secure (it is deterministic; one encryption query on $0^n$ returns the key).

A direct CCA attack: output $m_0 = 0^n$, $m_1 = 1^n$, receive $c^\ast = k \oplus m_b$, query the decryption oracle on $c' := c^\ast \oplus 0^{n-1}1 \neq c^\ast$, which returns $k \oplus c' = m_b \oplus 0^{n-1}1$; flip the last bit back to get $m_b$ and output $b$. This succeeds with probability 1 (the one-time pad is malleable).`,
          rubric: [
            { points: 1, text: R`Answer "no"` },
            { points: 1, text: R`Valid justification: CCA implies CPA and the OTP is not CPA-secure, or a direct attack with a decryption query on some $c' \neq c^\ast$` }
          ] }
      ] },
  );

  // ===================================================================
  // Final exam 2021-02-02: Q1 (one-round Feistel, AES), Q2 a/c/d, Q3a
  // ===================================================================
  add(
    { id: "ex-fe21-q1", type: "problem", lecture: 3, topic: "block-ciphers", origin: "exam",
      source: "Final exam 2021-02-02, Q1", difficulty: 2,
      title: "One-round DES",
      mock: true,
      statement: R`Recall one round of a Feistel network: on input $L_0 \| R_0$ (two 32-bit halves for DES) and round key $k_1$ it outputs $L_1 \| R_1$ with
$$L_1 := R_0, \qquad R_1 := L_0 \oplus f_{k_1}(R_0).$$`,
      parts: [
        { label: "a", points: 5,
          prompt: R`A developer suggests making DES more efficient by running only **one** round of it, that is, one round of a Feistel network. Explain why this does not even satisfy *indistinguishability in the presence of an eavesdropper* by **specifying an adversary**.`,
          hints: [
            R`Look at the left half of the output. Does it depend on the key?`,
            R`$L_1 = R_0$: half of the plaintext is copied into the ciphertext in the clear.`,
            R`Choose two 64-bit messages that differ only in the right half.`
          ],
          solution: R`In one Feistel round the left output half is $L_1 = R_0$: the right half of the plaintext appears unchanged in the ciphertext, whatever the key.

Recall EAV-security: for every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$.

**Adversary $\mathcal{A}$:**
1. Output $m_0 := 0^{32} \| 0^{32}$ and $m_1 := 0^{32} \| 1^{32}$ (both 64 bits).
2. Receive $c = L_1 \| R_1$. Output $b' := 0$ if $L_1 = 0^{32}$, and $b' := 1$ otherwise.

**Analysis.** If $b = 0$, then $R_0 = 0^{32}$, so $L_1 = 0^{32}$ and $\mathcal{A}$ outputs 0. If $b = 1$, then $R_0 = 1^{32}$, so $L_1 = 1^{32} \neq 0^{32}$ and $\mathcal{A}$ outputs 1. Hence $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi} = 1] = 1$, far above $\tfrac12 + \mathsf{negl}$: one-round DES is not EAV-secure. The attack does not even look at $f$ or $k_1$.`,
          rubric: [
            { points: 1, text: R`Observes $L_1 = R_0$: the right plaintext half appears in the clear` },
            { points: 1, text: R`Concrete equal-length $m_0, m_1$ differing in the right half` },
            { points: 1, text: R`Output rule based on $L_1$` },
            { points: 1, text: R`Analysis of both cases $b = 0$ and $b = 1$` },
            { points: 1, text: R`Success probability 1, contradiction to EAV-security stated` }
          ] },
        { label: "b", points: 1,
          prompt: R`Does AES also use a Feistel network?`,
          hints: [ R`What does each AES round consist of, and is the round function invertible?` ],
          solution: R`**No.** AES is a substitution-permutation network: each round applies byte substitution (S-box), ShiftRows, MixColumns and round-key addition to the whole 128-bit state, and every step is invertible.`,
          rubric: [ { points: 1, text: R`"No, AES is an SPN"` } ] }
      ] },

    { id: "ex-fe21-q2", type: "problem", lecture: 4, topic: "computational", origin: "exam",
      source: "Final exam 2021-02-02, Q2a, c, d", difficulty: 2,
      title: "Short justification questions",
      mock: true,
      statement: R`Answer and justify briefly. (Part b of the original exam, on groups, is out of scope.)`,
      parts: [
        { label: "a", points: 1,
          prompt: R`Let $p$ be a positive polynomial. Is the function $f(n) := p(n) \cdot 2^{-\log n}$ negligible?`,
          hints: [ R`Simplify $2^{-\log n}$ (log base 2).` ],
          solution: R`**No.** $2^{-\log n} = 1/n$, so $f(n) = p(n)/n$. Since $p$ is positive, $p(n) \ge c$ for some constant $c > 0$ and all large $n$, so $f(n) \ge c/n > 1/n^2$ for all large $n$: $f$ is not smaller than $1/q(n)$ for $q(n) = n^2$. (With natural log, $2^{-\ln n} = n^{-\ln 2}$, still only polynomially small.)`,
          rubric: [ { points: 1, text: R`"No" with $2^{-\log n} = 1/n$, so $f$ is inverse-polynomial at best` } ] },
        { label: "c", points: 3,
          prompt: R`Does every provably secure (but not necessarily practical) encryption scheme have to assume the hardness of a computational problem? **Justify** your answer.`,
          hints: [
            R`Think of a scheme from lecture 2 whose security proof uses no assumption at all.`,
            R`When are assumptions unavoidable? Think about the key length compared to the message length.`
          ],
          solution: R`**No.** The one-time pad is perfectly secret, and this is proven unconditionally (Theorem 2.10): the proof uses only probability theory, and security holds even against unbounded adversaries. It is not practical, since the key must be as long as the message and can be used only once (Theorem 2.11: $|\mathcal{K}| \ge |\mathcal{M}|$).

Assumptions are needed for *computational* security with keys shorter than the messages (e.g. the pseudo one-time pad or Construction 3.28): proving such a scheme secure unconditionally would imply $\mathsf{P} \neq \mathsf{NP}$, so its security proof must rely on an assumption such as the existence of PRGs or PRFs.`,
          rubric: [
            { points: 1, text: R`Answer "no"` },
            { points: 1, text: R`Example: the one-time pad / perfect secrecy, proven without assumptions` },
            { points: 1, text: R`Explains that practical (short-key, computationally secure) schemes do need assumptions, since a proof would imply $\mathsf{P} \neq \mathsf{NP}$` }
          ] },
        { label: "d", points: 3,
          prompt: R`Consider an encryption scheme with message space $\{0,1\}^n$ and ciphertext space $\{0,1\}^\ell$. Why must we have $\ell \ge n$?`,
          hints: [
            R`Fix a key $k$. Can two different messages share a ciphertext?`,
            R`Correctness makes the encryption map (for each fixed key) injective. Count.`
          ],
          solution: R`Fix any key $k$. By correctness, $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$ for all $m$, and $\mathsf{Dec}_k$ is a (deterministic) function. So two different messages $m \neq m'$ can never produce the same ciphertext: otherwise $\mathsf{Dec}_k(c)$ would have to equal both $m$ and $m'$. (If $\mathsf{Enc}$ is randomized, the sets of possible ciphertexts of different messages are disjoint and non-empty.)

Hence for fixed $k$ the encryption gives an injective map from $\{0,1\}^n$ into $\{0,1\}^\ell$, which requires $2^\ell = |\mathcal{C}| \ge |\mathcal{M}| = 2^n$, i.e. $\ell \ge n$.`,
          rubric: [
            { points: 1, text: R`Uses correctness (decryption must recover $m$)` },
            { points: 1, text: R`Concludes that for a fixed key distinct messages have distinct (disjoint sets of) ciphertexts` },
            { points: 1, text: R`Counting: $2^\ell \ge 2^n$, hence $\ell \ge n$` }
          ] }
      ] },

    { id: "ex-fe21-q3a", type: "problem", lecture: 6, topic: "cpa-prf", origin: "exam",
      source: "Final exam 2021-02-02, Q3a", difficulty: 3,
      title: "PRF encryption for short messages",
      mock: true,
      statement: R`An engineer proposes the following symmetric encryption scheme for **short** messages, based on a pseudorandom function $F \colon \{0,1\}^n \times \{0,1\}^\ell \to \{0,1\}^\ell$: to encrypt a message $m \in \{0,1\}^\ell$ using key $k \in \{0,1\}^n$, choose $r \gets \{0,1\}^\ell$ and return the ciphertext $c := F_k(r) \oplus m$.`,
      parts: [
        { label: "a", points: 3,
          prompt: R`Would you recommend using the scheme if CCA-security is *not* required? **Justify** your answer.`,
          hints: [
            R`First check correctness: what does the receiver need in order to decrypt $c$?`,
            R`Suppose $r$ is sent along, $c = (r, F_k(r) \oplus m)$ as in Construction 3.28. Its security proof loses $q(n)/2^{|r|}$. How long is $r$ here?`,
            R`For short messages, $|r| = \ell$ is small, so after polynomially many encryptions an $r$ repeats with non-negligible probability, and a repeated $r$ means a repeated pad.`
          ],
          solution: R`**No.**

1. **Not correct as stated.** The ciphertext $c = F_k(r) \oplus m$ does not contain $r$, and $r$ is fresh and uniform, so the receiver cannot recompute $F_k(r)$ and cannot decrypt. At the very least $r$ must be sent: $c := (r, F_k(r) \oplus m)$.

2. **Even with $r$ sent, short messages make it insecure.** This is Construction 3.28 with input and output length $\ell$. Its security bound is $\tfrac12 + \varepsilon(n) + q(n)/2^{\ell}$: the term $q(n)/2^\ell$ is the probability that the challenge's $r$ was already used. For short messages ($\ell$ small, e.g. constant or $O(\log n)$) this is not negligible. Concretely, a CPA adversary queries $\mathsf{Enc}_k(0^\ell)$ many times and stores the pairs $(r_i, F_k(r_i))$; if the challenge $(r^\ast, s^\ast)$ has $r^\ast = r_i$ for some $i$, it computes $m_b = s^\ast \oplus F_k(r_i)$ and wins. With $2^\ell$ polynomial in $n$, this happens with non-negligible (even close to 1) probability. In practice, with e.g. $\ell = 32$, the birthday bound gives a repeated $r$ after about $2^{16}$ encryptions, and $c \oplus c' = m \oplus m'$ leaks plaintext information.

**Recommendation:** use a long random value, $r \gets \{0,1\}^n$, with a PRF on $n$-bit inputs (pad the short message to $n$ bits), and send $r$: then Theorem 3.29 gives CPA-security.`,
          rubric: [
            { points: 1, text: R`Notes that $r$ is not part of the ciphertext, so decryption is impossible; $r$ must be sent` },
            { points: 1, text: R`Explains that $|r| = \ell$ is short, so $r$ repeats with non-negligible probability ($q/2^\ell$ or birthday bound), and a repeat reuses the pad / breaks CPA-security` },
            { points: 1, text: R`Clear verdict "do not use", with a fix (long $r \gets \{0,1\}^n$ sent with the ciphertext)` }
          ] }
      ] },
  );

  // ===================================================================
  // Final exam 2025-01-31: Q1 c, f, i, j, l
  // ===================================================================
  add(
    { id: "ex-fe25-tf-c", type: "tf", lecture: 3, topic: "block-ciphers", origin: "exam",
      source: "Final exam 2025-01-31, Q1c", difficulty: 1,
      statement: R`The permutation layer of a SPN cipher provides confusion.`,
      answer: false,
      explanation: R`Shannon's principles: substitution (the S-boxes) provides **confusion**, the permutation (mixing) layer provides **diffusion**, spreading each input bit over many output bits.` },

    { id: "ex-fe25-tf-f", type: "tf", lecture: 3, topic: "block-ciphers", origin: "exam",
      source: "Final exam 2025-01-31, Q1f", difficulty: 1,
      statement: R`The S-box of a substitution-permutation network (SPN) must be kept secret.`,
      answer: false,
      explanation: R`By Kerckhoffs' principle the whole algorithm, including the S-boxes, is public; only the key is secret. The AES S-box is published in the standard.` },

    { id: "ex-fe25-tf-i", type: "tf", lecture: 7, topic: "cca", origin: "exam",
      source: "Final exam 2025-01-31, Q1i", difficulty: 1,
      statement: R`The one-time pad is secure against chosen-ciphertext attacks (CCA-secure).`,
      answer: false,
      explanation: R`It is not even CPA-secure (encryption is deterministic; one query on $0^n$ reveals the key), and it is malleable: decrypting $c^\ast \oplus 0^{n-1}1 \neq c^\ast$ returns $m_b \oplus 0^{n-1}1$.` },

    { id: "ex-fe25-tf-j", type: "tf", lecture: 3, topic: "block-ciphers", origin: "exam",
      source: "Final exam 2025-01-31, Q1j", difficulty: 1,
      statement: R`Even if any of the round functions in a Feistel network are not invertible, the network itself is nevertheless invertible.`,
      answer: true,
      explanation: R`Each round is inverted by $R_{i-1} = L_i$ and $L_{i-1} = R_i \oplus f_{k_i}(L_i)$, which only evaluates $f_{k_i}$ forwards. DES uses non-invertible round functions.` },

    { id: "ex-fe25-tf-l", type: "tf", lecture: 7, topic: "modes", origin: "exam",
      source: "Final exam 2025-01-31, Q1l", difficulty: 1,
      statement: R`Electronic code book (ECB) encryption is secure against chosen-plaintext attacks (CPA-secure).`,
      answer: false,
      explanation: R`ECB is deterministic, so it is not CPA-secure (query $m_0$ and compare with the challenge); it is not even EAV-secure, because equal plaintext blocks give equal ciphertext blocks.` },
  );

  // ===================================================================
  // Final exam 2025-01-31: Q2 (CBC decryption, CBC not CCA, cascade)
  // ===================================================================
  add(
    { id: "ex-fe25-q2", type: "problem", lecture: 7, topic: "modes", origin: "exam",
      source: "Final exam 2025-01-31, Q2", difficulty: 3,
      title: "CBC mode and cascade encryption",
      mock: true,
      statement: R`Let $F$ be a block cipher. Recall the CBC mode of operation which, given a key $k$ and an $\ell$-block message $m_1, \dots, m_\ell$, samples a uniform $c_0$, and then encrypts the $i$-th message block as $c_i := F_k(m_i \oplus c_{i-1})$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Show how to decrypt a 3-block ciphertext $c_0, c_1, c_2$ that was encrypted with CBC mode.`,
          hints: [
            R`How many message blocks does a ciphertext with blocks $c_0, c_1, c_2$ have? What is $c_0$?`,
            R`Undo $F_k$ with $F_k^{-1}$ and then undo the XOR with the previous ciphertext block.`
          ],
          solution: R`$c_0$ is the IV, so the message has two blocks:
$$m_1 := F_k^{-1}(c_1) \oplus c_0, \qquad m_2 := F_k^{-1}(c_2) \oplus c_1,$$
and the output is $m_1 \| m_2$. This is correct since $F_k^{-1}(c_i) \oplus c_{i-1} = F_k^{-1}(F_k(m_i \oplus c_{i-1})) \oplus c_{i-1} = m_i$. (This needs $F_k^{-1}$, so $F$ must be a permutation.)`,
          rubric: [
            { points: 1, text: R`Uses $F_k^{-1}$ and recognises $c_0$ as the IV (two message blocks)` },
            { points: 1, text: R`Both formulas $m_1 = F_k^{-1}(c_1) \oplus c_0$, $m_2 = F_k^{-1}(c_2) \oplus c_1$` }
          ] },
        { label: "b", points: 5,
          prompt: R`Show that CBC mode is not CCA-secure.`,
          hints: [
            R`In the CCA game you may decrypt any ciphertext except $c^\ast$ itself. Can you change $c^\ast$ a little so that the decryption is still related to $m_b$?`,
            R`$m_1 = F_k^{-1}(c_1) \oplus c_0$: what happens to $m_1$ if you flip a bit of the IV $c_0$?`,
            R`Use one-block challenge messages, query $\mathsf{Dec}_k(c_0 \oplus 0^{n-1}1, c_1)$ and flip the bit back.`
          ],
          solution: R`CCA-security (Definition 5.1): for every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$, where $\mathcal{A}$ has encryption and decryption oracles but may not decrypt $c^\ast$.

**Adversary $\mathcal{A}$:**
1. Output $m_0 := 0^n$ and $m_1 := 1^n$ (one block each). Receive $c^\ast = (c_0, c_1)$ with $c_1 = F_k(m_b \oplus c_0)$.
2. Query the decryption oracle on $c' := (c_0 \oplus 0^{n-1}1,\ c_1)$. This is allowed since $c' \neq c^\ast$. Receive $m'$.
3. Output $b' := 0$ if $m' \oplus 0^{n-1}1 = 0^n$, and $b' := 1$ otherwise.

**Analysis.** The oracle returns
$$m' = F_k^{-1}(c_1) \oplus c_0 \oplus 0^{n-1}1 = (m_b \oplus c_0) \oplus c_0 \oplus 0^{n-1}1 = m_b \oplus 0^{n-1}1,$$
so $m' \oplus 0^{n-1}1 = m_b$. If $b = 0$ this is $0^n$ and $\mathcal{A}$ outputs 0; if $b = 1$ it is $1^n$ and $\mathcal{A}$ outputs 1. Thus $\Pr[\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\mathrm{CBC}}(n) = 1] = 1$, which is not $\le \tfrac12 + \mathsf{negl}(n)$. $\mathcal{A}$ is clearly p.p.t. Hence CBC is not CCA-secure: it is malleable.`,
          rubric: [
            { points: 1, text: R`States the CCA definition / restriction that $c^\ast$ itself may not be decrypted` },
            { points: 1, text: R`Concrete challenge messages of equal length` },
            { points: 1, text: R`Modified ciphertext $c' \neq c^\ast$ (e.g. IV with a flipped bit) queried to $\mathsf{Dec}_k$` },
            { points: 1, text: R`Computes $\mathsf{Dec}_k(c') = m_b \oplus 0^{n-1}1$` },
            { points: 1, text: R`Output rule, success probability 1, conclusion` }
          ] },
        { label: "c", points: 4,
          prompt: R`Let $\Pi_1 = (\mathsf{Gen}_1, \mathsf{Enc}_1, \mathsf{Dec}_1)$ and $\Pi_2 = (\mathsf{Gen}_2, \mathsf{Enc}_2, \mathsf{Dec}_2)$ be two encryption schemes. Define the encryption scheme $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ as follows:

- $\mathsf{Gen}(1^n)$: run $k_1 \gets \mathsf{Gen}_1(1^n)$ and $k_2 \gets \mathsf{Gen}_2(1^n)$. Return $(k_1, k_2)$.
- $\mathsf{Enc}_{(k_1,k_2)}(m)$: return $c := \mathsf{Enc}_{2,k_2}(\mathsf{Enc}_{1,k_1}(m))$.
- $\mathsf{Dec}_{(k_1,k_2)}(c)$: return $m := \mathsf{Dec}_{1,k_1}(\mathsf{Dec}_{2,k_2}(c))$.

Prove that if $\Pi_1$ and $\Pi_2$ are CPA-secure then $\Pi$ is also CPA-secure. (Hint: reduce the security of $\Pi$ to the security of *either* $\Pi_1$ or $\Pi_2$.)`,
          hints: [
            R`Build $\mathcal{A}'$ against $\Pi_1$ from an adversary $\mathcal{A}$ against $\Pi$. Which key can $\mathcal{A}'$ generate on its own?`,
            R`$\mathcal{A}'$ samples $k_2$ itself. For each query $m$ of $\mathcal{A}$, it asks its own oracle for $\mathsf{Enc}_{1,k_1}(m)$ and then applies $\mathsf{Enc}_{2,k_2}$ itself. The challenge is handled the same way.`,
            R`The simulation is perfect, so both adversaries win with the same probability. (Reducing to $\Pi_2$ instead is possible but needs $|\mathsf{Enc}_1(m_0)| = |\mathsf{Enc}_1(m_1)|$.)`
          ],
          solution: R`We reduce to the CPA-security of $\Pi_1$. Let $\mathcal{A}$ be any p.p.t. adversary against $\Pi$. Define $\mathcal{A}'$, which plays $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A}',\Pi_1}(n)$ with oracle $\mathsf{Enc}_{1,k_1}(\cdot)$:
1. Run $k_2 \gets \mathsf{Gen}_2(1^n)$ and start $\mathcal{A}(1^n)$.
2. When $\mathcal{A}$ queries $m$: query the own oracle to get $c' \gets \mathsf{Enc}_{1,k_1}(m)$ and return $c := \mathsf{Enc}_{2,k_2}(c')$ (computed with fresh randomness).
3. When $\mathcal{A}$ outputs $m_0, m_1$ (with $|m_0| = |m_1|$): output the same $m_0, m_1$ as $\mathcal{A}'$'s challenge. On receiving $d^\ast \gets \mathsf{Enc}_{1,k_1}(m_b)$, give $c^\ast := \mathsf{Enc}_{2,k_2}(d^\ast)$ to $\mathcal{A}$.
4. Answer further queries as in step 2. When $\mathcal{A}$ outputs $b'$, output $b'$.

$\mathcal{A}'$ is p.p.t.: it runs $\mathcal{A}$ plus $\mathsf{Gen}_2$ once and $\mathsf{Enc}_2$ once per query.

**Analysis.** $k_1$ (from $\mathcal{A}'$'s challenger) and $k_2$ are distributed exactly as in $\mathsf{Gen}$, every answer is $\mathsf{Enc}_{2,k_2}(\mathsf{Enc}_{1,k_1}(m)) = \mathsf{Enc}_{(k_1,k_2)}(m)$, and $c^\ast = \mathsf{Enc}_{(k_1,k_2)}(m_b)$ for the challenger's bit $b$. So $\mathcal{A}$'s view is exactly as in $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)$, and $\mathcal{A}'$ wins iff $\mathcal{A}$ wins:
$$\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] = \Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A}',\Pi_1}(n) = 1] \le \tfrac12 + \varepsilon(n)$$
for a negligible $\varepsilon$, by CPA-security of $\Pi_1$. Hence $\Pi$ is CPA-secure. (This only used that $\Pi_1$ is CPA-secure.)

*Alternative (reduction to $\Pi_2$):* $\mathcal{A}''$ samples $k_1$, answers queries with $\mathsf{Enc}_{2,k_2}(\mathsf{Enc}_{1,k_1}(m))$ via its oracle, and submits $\mathsf{Enc}_{1,k_1}(m_0), \mathsf{Enc}_{1,k_1}(m_1)$ as its challenge. This is only a valid challenge if these two have the same length, e.g. when the ciphertext length of $\Pi_1$ depends only on the message length.`,
          rubric: [
            { points: 1, text: R`Defines $\mathcal{A}'$ against $\Pi_1$ (or $\Pi_2$) that generates the other key itself` },
            { points: 1, text: R`Correct simulation of encryption queries and of the challenge (forwarding $m_0, m_1$ and wrapping $d^\ast$)` },
            { points: 1, text: R`Argues the simulation is perfect, so the winning probabilities are equal; $\mathcal{A}'$ is p.p.t.` },
            { points: 1, text: R`Concludes $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi} = 1] \le \tfrac12 + \varepsilon(n)$` }
          ] }
      ] },
  );
})();
