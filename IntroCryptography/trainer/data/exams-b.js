(function () {
  const R = String.raw;
  const add = (...items) => (window.CRYPTO_BANK = window.CRYPTO_BANK || []).push(...items);

  // ===================================================================
  // Variant true/false statements (modelled on exam Q1)
  // ===================================================================
  add(
    { id: "ex-var-tf-01", type: "tf", lecture: 1, topic: "historical", origin: "variant",
      source: "Variant of Midterm 2025-12-03, Q1b", difficulty: 1,
      statement: R`The shift cipher on English text can be broken by exhaustive key search, because it has only 26 keys.`,
      answer: true,
      explanation: R`Try all 26 shifts and pick the one that gives meaningful text (or the one whose letter frequencies match English). The key space is far too small.` },

    { id: "ex-var-tf-02", type: "tf", lecture: 1, topic: "historical", origin: "variant",
      source: "Variant of Midterm 2025-12-03, Q1b", difficulty: 1,
      statement: R`A monoalphabetic substitution cipher over the 26-letter alphabet is secure against ciphertext-only attacks, since its key space has size $26! \approx 2^{88}$.`,
      answer: false,
      explanation: R`A large key space is necessary but not sufficient. Each plaintext letter is always mapped to the same ciphertext letter, so letter frequencies are preserved and frequency analysis recovers the key without searching the key space.` },

    { id: "ex-var-tf-03", type: "tf", lecture: 2, topic: "principles", origin: "variant",
      source: "Variant of Final exam 2025-01-31, Q1f", difficulty: 1,
      statement: R`Kerckhoffs' principle demands that the security of an encryption scheme relies only on the secrecy of the key, not on the secrecy of the algorithm.`,
      answer: true,
      explanation: R`The adversary is assumed to know the scheme ("the adversary knows the scheme"). Only the key is secret, which makes the scheme easier to analyse, standardise and replace if compromised.` },

    { id: "ex-var-tf-04", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "variant",
      source: "Variant of Sample midterm, Q1a", difficulty: 1,
      statement: R`The one-time pad remains perfectly secret if the same key is used to encrypt two messages.`,
      answer: false,
      explanation: R`From $c = k \oplus m$ and $c' = k \oplus m'$ the adversary computes $c \oplus c' = m \oplus m'$, which leaks information about the messages (e.g. whether they are equal).` },

    { id: "ex-var-tf-05", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "variant",
      source: "Variant of Midterm 2025-12-03, Q1d", difficulty: 2,
      statement: R`There is a perfectly secret encryption scheme with message space $\{0,1\}^n$ and key space $\{0,1\}^{n-1}$.`,
      answer: false,
      explanation: R`Theorem 2.11: every perfectly secret scheme has $|\mathcal{K}| \ge |\mathcal{M}|$, but here $2^{n-1} < 2^n$. (For fixed $c$, at most $2^{n-1}$ messages can decrypt from $c$, so some $m$ has $\Pr[M = m \mid C = c] = 0$.)` },

    { id: "ex-var-tf-06", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "variant",
      source: "Variant of Midterm 2025-12-03, Q1c", difficulty: 2,
      statement: R`An encryption scheme is perfectly secret if and only if, for every probability distribution over $\mathcal{M}$, the random variables $M$ and $C$ are independent.`,
      answer: true,
      explanation: R`The definition requires $\Pr[M = m \mid C = c] = \Pr[M = m]$ for all $m$ and all $c$ with $\Pr[C = c] > 0$, which is exactly independence of $M$ and $C$.` },

    { id: "ex-var-tf-07", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "variant",
      source: "Variant of Sample midterm, Q1a", difficulty: 2,
      statement: R`The shift cipher is perfectly secret for two-letter messages if one uniform key $k \in \{0, \dots, 25\}$ is used to shift both letters.`,
      answer: false,
      explanation: R`$c_1 - c_2 \equiv m_1 - m_2 \pmod{26}$ is revealed. With $M$ uniform over $\{\mathtt{AA}, \mathtt{AB}\}$, a ciphertext with two equal letters gives $\Pr[M = \mathtt{AB} \mid C = c] = 0 \neq \tfrac12$.` },

    { id: "ex-var-tf-08", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "variant",
      source: "Variant of Midterm 2025-12-03, Q1d", difficulty: 2,
      statement: R`The one-time pad on $\{0,1\}^\ell$ remains perfectly secret if $\mathsf{Gen}$ samples the key uniformly from $\{0,1\}^\ell \setminus \{0^\ell\}$.`,
      answer: false,
      explanation: R`Now $c \neq m$ always. For uniform $M$ and any $c$ (which has $\Pr[C = c] = 2^{-\ell} > 0$), $\Pr[M = c \mid C = c] = 0 \neq 2^{-\ell} = \Pr[M = c]$. (Also $|\mathcal{K}| < |\mathcal{M}|$.)` },

    { id: "ex-var-tf-09", type: "tf", lecture: 3, topic: "block-ciphers", origin: "variant",
      source: "Variant of Final exam 2024-01-26, Q1c", difficulty: 1,
      statement: R`DES has a block length of 64 bits and a key length of 56 bits.`,
      answer: true,
      explanation: R`Those are the DES parameters; the 56-bit key is what makes exhaustive search feasible today.` },

    { id: "ex-var-tf-10", type: "tf", lecture: 3, topic: "block-ciphers", origin: "variant",
      source: "Variant of Midterm 2025-12-03, Q1f", difficulty: 2,
      statement: R`Double encryption $\mathsf{DES}_{k_2}(\mathsf{DES}_{k_1}(x))$ with two independent 56-bit keys provides about 112 bits of security against key recovery.`,
      answer: false,
      explanation: R`Meet-in-the-middle tabulates $\mathsf{DES}_{k_1}(x)$ for all $k_1$ and matches against $\mathsf{DES}^{-1}_{k_2}(y)$ for all $k_2$: about $2^{57}$ evaluations and $2^{56}$ memory, so roughly 57 bits, not 112.` },

    { id: "ex-var-tf-11", type: "tf", lecture: 3, topic: "block-ciphers", origin: "variant",
      source: "Variant of Midterm 2025-12-03, Q1e", difficulty: 1,
      statement: R`To decrypt with a Feistel network, one applies the rounds with the round keys in reverse order, evaluating the round functions $f_{k_i}$ only in the forward direction.`,
      answer: true,
      explanation: R`$R_{i-1} = L_i$ and $L_{i-1} = R_i \oplus f_{k_i}(L_i)$, going from the last round to the first. No $f_{k_i}^{-1}$ is needed.` },

    { id: "ex-var-tf-12", type: "tf", lecture: 3, topic: "block-ciphers", origin: "variant",
      source: "Variant of Final exam 2025-01-31, Q1c", difficulty: 1,
      statement: R`In 3DES, $y = \mathsf{DES}_{k_1}(\mathsf{DES}^{-1}_{k_2}(\mathsf{DES}_{k_1}(x)))$, the middle step is a decryption so that setting $k_1 = k_2$ gives single DES.`,
      answer: true,
      explanation: R`With $k_1 = k_2$ the first two steps cancel and $y = \mathsf{DES}_{k_1}(x)$: backwards compatibility with single DES.` },

    { id: "ex-var-tf-13", type: "tf", lecture: 4, topic: "stream-ciphers", origin: "variant",
      source: "Variant of Sample midterm, Q1c", difficulty: 1,
      statement: R`A stream cipher can safely encrypt two different messages with the same key (and no IV), because its key stream is pseudorandom.`,
      answer: false,
      explanation: R`The same key gives the same key stream $s$, so $c \oplus c' = m \oplus m'$, exactly as with a reused one-time pad. Each message needs a fresh key stream (fresh key or IV).` },

    { id: "ex-var-tf-14", type: "tf", lecture: 4, topic: "stream-ciphers", origin: "variant",
      source: "Variant of Sample midterm, Q1c", difficulty: 1,
      statement: R`A linear-feedback shift register (LFSR) is very efficient in hardware, but because it is linear, a single LFSR is not a secure key-stream generator.`,
      answer: true,
      explanation: R`The output satisfies a linear recurrence, so a short piece of key stream determines the feedback and the state (linear algebra), and then the whole key stream. Practical designs combine several LFSRs non-linearly.` },

    { id: "ex-var-tf-15", type: "tf", lecture: 4, topic: "computational", origin: "variant",
      source: "Variant of Final exam 2024-01-26, Q1b", difficulty: 2,
      statement: R`The function $f(n) = 2^{-\sqrt{n}}$ is negligible.`,
      answer: true,
      explanation: R`For every constant $c$, $2^{-\sqrt n} < n^{-c}$ for all sufficiently large $n$, since $\sqrt n$ grows faster than $c \log n$. It is one of the lecture's examples of a negligible function.` },

    { id: "ex-var-tf-16", type: "tf", lecture: 4, topic: "computational", origin: "variant",
      source: "Variant of Final exam 2021-02-02, Q2a", difficulty: 2,
      statement: R`The function $f(n) = 2^{-100 \log n}$ (log base 2) is negligible.`,
      answer: false,
      explanation: R`$2^{-100 \log n} = n^{-100}$, an inverse polynomial. It is not smaller than $1/p(n)$ for $p(n) = n^{101}$.` },

    { id: "ex-var-tf-17", type: "tf", lecture: 4, topic: "computational", origin: "variant",
      source: "Variant of Sample midterm, Q1d", difficulty: 2,
      statement: R`If $\varepsilon_1$ and $\varepsilon_2$ are negligible functions, then $\varepsilon_1(n) + \varepsilon_2(n)$ is negligible.`,
      answer: true,
      explanation: R`For a polynomial $p$, take $N$ such that $\varepsilon_1(n), \varepsilon_2(n) < 1/(2p(n))$ for $n > N$; then the sum is $< 1/p(n)$. This is what lets reductions add up several negligible terms.` },

    { id: "ex-var-tf-18", type: "tf", lecture: 4, topic: "computational", origin: "variant",
      source: "Variant of Sample midterm, Q1e", difficulty: 1,
      statement: R`EAV-security (computational indistinguishability in the presence of an eavesdropper) guarantees that a ciphertext hides the length of the message.`,
      answer: false,
      explanation: R`The experiment requires $|m_0| = |m_1|$ precisely because encryption in general cannot hide the plaintext length; even the one-time pad reveals it.` },

    { id: "ex-var-tf-19", type: "tf", lecture: 4, topic: "computational", origin: "variant",
      source: "Variant of Midterm 2025-12-03, Q1c", difficulty: 2,
      statement: R`Every perfectly indistinguishable encryption scheme is also EAV-secure (computationally indistinguishable in the presence of an eavesdropper).`,
      answer: true,
      explanation: R`Perfect indistinguishability gives $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi} = 1] = \tfrac12$ for **every** adversary, in particular for every p.p.t. one, so the bound $\tfrac12 + \varepsilon(n)$ holds with $\varepsilon = 0$.` },

    { id: "ex-var-tf-20", type: "tf", lecture: 5, topic: "prg", origin: "variant",
      source: "Variant of Sample midterm, Q1g", difficulty: 2,
      statement: R`If $G$ is a PRG with expansion factor $\ell(n) \ge n + 1$, then the algorithm $G'$ that outputs only the first $n + 1$ bits of $G(s)$ is also a PRG.`,
      answer: true,
      explanation: R`$G'$ still expands. A distinguisher $\mathcal{D}'$ for $G'$ yields $\mathcal{D}$ for $G$: on input $y$, run $\mathcal{D}'$ on the first $n+1$ bits of $y$. For uniform $y$ these bits are uniform, so $\mathcal{D}$ has the same advantage as $\mathcal{D}'$.` },

    { id: "ex-var-tf-21", type: "tf", lecture: 5, topic: "prg", origin: "variant",
      source: "Variant of Sample midterm, Q1g", difficulty: 2,
      statement: R`If $G \colon \{0,1\}^n \to \{0,1\}^{2n}$ is a PRG, then $G'(s) := G(s) \| p(G(s))$, where $p$ denotes the parity (XOR of all bits), is a PRG.`,
      answer: false,
      explanation: R`$\mathcal{D}$ outputs 1 iff the last bit of its $(2n+1)$-bit input equals the parity of the first $2n$ bits. This always holds for $G'(s)$ but only with probability $\tfrac12$ for a uniform string: advantage $\tfrac12$.` },

    { id: "ex-var-tf-22", type: "tf", lecture: 5, topic: "prg", origin: "variant",
      source: "Variant of Midterm 2025-12-03, Q1c", difficulty: 2,
      statement: R`The pseudo one-time pad (Construction 3.17, $c := G(k) \oplus m$ with $k \in \{0,1\}^n$, $m \in \{0,1\}^{\ell(n)}$, $\ell(n) > n$) is perfectly secret if $G$ is a PRG.`,
      answer: false,
      explanation: R`Its key space is smaller than its message space, so by Theorem 2.11 it cannot be perfectly secret (an unbounded adversary can test all $2^n$ seeds). It is only computationally (EAV-)secure.` },

    { id: "ex-var-tf-23", type: "tf", lecture: 5, topic: "prg", origin: "variant",
      source: "Variant of Final exam 2024-01-26, Q1d", difficulty: 2,
      statement: R`If $G$ is a PRG, the pseudo one-time pad is EAV-secure, but it is not CPA-secure.`,
      answer: true,
      explanation: R`EAV-security is Theorem 3.16. But encryption is deterministic: query $m_0$, get $G(k) \oplus m_0$, and compare with the challenge ciphertext. This wins with probability 1.` },

    { id: "ex-var-tf-24", type: "tf", lecture: 6, topic: "cpa-prf", origin: "variant",
      source: "Variant of Final exam 2025-01-31, Q1l", difficulty: 1,
      statement: R`There is no CPA-secure private-key encryption scheme whose encryption algorithm is deterministic and stateless.`,
      answer: true,
      explanation: R`For such a scheme the adversary queries $\mathsf{Enc}_k(m_0)$, then submits $m_0, m_1$ ($m_0 \neq m_1$) and outputs 0 iff the challenge equals the query answer. By correctness $\mathsf{Enc}_k(m_1) \neq \mathsf{Enc}_k(m_0)$, so it wins with probability 1.` },

    { id: "ex-var-tf-25", type: "tf", lecture: 6, topic: "cpa-prf", origin: "variant",
      source: "Variant of Sample midterm, Q1g", difficulty: 2,
      statement: R`If $F$ is a PRF, then $F'_k(x) := F_k(x) \oplus x$ is also a PRF.`,
      answer: true,
      explanation: R`A distinguisher $\mathcal{D}'$ for $F'$ gives $\mathcal{D}$ for $F$, which answers each query $x$ with $\mathcal{O}(x) \oplus x$. If $\mathcal{O} = F_k$ this is $F'_k$; if $\mathcal{O} = f$ is random, then $x \mapsto f(x) \oplus x$ is again a uniformly random function. So the advantages are equal.` },

    { id: "ex-var-tf-26", type: "tf", lecture: 6, topic: "cpa-prf", origin: "variant",
      source: "Variant of Sample midterm, Q1g", difficulty: 2,
      statement: R`If $F$ is a PRF, then $F'_k(x) := F_k(x) \oplus F_k(\overline{x})$ is also a PRF, where $\overline{x}$ is the bitwise complement of $x$.`,
      answer: false,
      explanation: R`$F'_k(x) = F'_k(\overline{x})$ for every $x$. $\mathcal{D}$ queries $0^n$ and $1^n$ and outputs 1 iff the answers are equal: probability 1 for $F'_k$, but only $2^{-n}$ for a random function.` },

    { id: "ex-var-tf-27", type: "tf", lecture: 6, topic: "cpa-prf", origin: "variant",
      source: "Variant of Final exam 2021-02-02, Q3a", difficulty: 2,
      statement: R`Construction 3.28, $\mathsf{Enc}_k(m) := (r, F_k(r) \oplus m)$, remains CPA-secure if $r := 0^n$ is used in every encryption instead of a uniform $r$.`,
      answer: false,
      explanation: R`Then encryption is deterministic, $c = (0^n, F_k(0^n) \oplus m)$, and any deterministic stateless scheme is broken by querying $m_0$ and comparing with the challenge.` },

    { id: "ex-var-tf-28", type: "tf", lecture: 6, topic: "cpa-prf", origin: "variant",
      source: "Variant of Final exam 2024-01-26, Q2a", difficulty: 1,
      statement: R`If a private-key encryption scheme is CPA-secure, then it is also CPA-secure for multiple encryptions (several challenge ciphertexts).`,
      answer: true,
      explanation: R`This is Theorem 3.23: single-challenge CPA-security implies multi-message CPA-security. (For EAV-security the analogous statement is false: the pseudo one-time pad is EAV-secure but not secure for two messages.)` },

    { id: "ex-var-tf-29", type: "tf", lecture: 7, topic: "modes", origin: "variant",
      source: "Variant of Midterm 2025-12-03, Q1j", difficulty: 2,
      statement: R`CBC mode remains CPA-secure if the IV is fixed to $c_0 := 0^n$ for every encryption.`,
      answer: false,
      explanation: R`With a fixed IV, CBC is deterministic: querying $m_0$ and comparing with the challenge ciphertext wins with probability 1.` },

    { id: "ex-var-tf-30", type: "tf", lecture: 7, topic: "modes", origin: "variant",
      source: "Variant of Sample midterm, Q1i", difficulty: 1,
      statement: R`In CBC mode (and in randomized CTR mode), the ciphertext of an $\ell$-block message consists of $\ell + 1$ blocks.`,
      answer: true,
      explanation: R`The extra block $c_0$ is the uniform IV (respectively the initial counter), which the receiver needs for decryption. The ciphertext expansion is one block, compared with $|c| = 2|m|$ for block-wise Construction 3.28.` },

    { id: "ex-var-tf-31", type: "tf", lecture: 7, topic: "cca", origin: "variant",
      source: "Variant of Final exam 2025-01-31, Q1i", difficulty: 2,
      statement: R`If, given any ciphertext $c$ of a message $m \in \{0,1\}^n$, one can efficiently compute a ciphertext $c' \neq c$ with $\mathsf{Dec}_k(c') = m \oplus 0^{n-1}1$ without knowing $k$, then the scheme is not CCA-secure.`,
      answer: true,
      explanation: R`The adversary submits $m_0 = 0^n$, $m_1 = 1^n$, transforms $c^\ast$ into $c' \neq c^\ast$, asks the decryption oracle for $\mathsf{Dec}_k(c') = m_b \oplus 0^{n-1}1$, and recovers $b$ with probability 1. CCA-secure schemes must be non-malleable.` },

    { id: "ex-var-tf-32", type: "tf", lecture: 7, topic: "cca", origin: "variant",
      source: "Variant of Final exam 2024-01-26, Q1e", difficulty: 1,
      statement: R`Construction 3.28, $\mathsf{Enc}_k(m) := (r, F_k(r) \oplus m)$, is CCA-secure if $F$ is a PRF.`,
      answer: false,
      explanation: R`It is CPA-secure but malleable: on challenge $(r, s)$, query $\mathsf{Dec}_k(r, s \oplus \Delta)$ for any $\Delta \neq 0^n$ and obtain $m_b \oplus \Delta$, which reveals $b$.` },
  );

  // ===================================================================
  // Variant gap definitions (Q2 slot)
  // ===================================================================
  add(
    { id: "ex-var-gap-eav", type: "gap", lecture: 4, topic: "computational", origin: "variant",
      source: "Variant of Midterm 2025-12-03, Q2 (Definition 3.8)", difficulty: 2,
      title: "EAV-security (indistinguishability in the presence of an eavesdropper)", points: 5,
      text: R`Fill in the gaps. A private-key encryption scheme $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ is (computationally) indistinguishable in the presence of an eavesdropper (EAV-secure) if for every <gap>p.p.t. adversary $\mathcal{A}$</gap> there exists a negligible function $\varepsilon(\cdot)$ such that $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le$ <gap>$\tfrac12 + \varepsilon(n)$</gap>, where the experiment $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)$ is defined as follows:

1. $\mathcal{A}$ is given $1^n$ and outputs a pair of messages $m_0, m_1$ <gap>with $|m_0| = |m_1|$</gap>.
2. A key $k \gets \mathsf{Gen}(1^n)$ and a bit $b \gets \{0,1\}$ are sampled, and <gap>the challenge ciphertext $c \gets \mathsf{Enc}_k(m_b)$</gap> is given to $\mathcal{A}$.
3. $\mathcal{A}$ outputs a bit $b'$. The output of the experiment is 1 if and only if <gap>$b' = b$</gap>.`,
      note: R`No oracles at all: the adversary only sees one ciphertext. Compared to CPA, the encryption oracle is missing.` },

    { id: "ex-var-gap-cpa", type: "gap", lecture: 6, topic: "cpa-prf", origin: "variant",
      source: "Variant of Midterm 2025-12-03, Q2 (Definition 3.21)", difficulty: 2,
      title: "CPA-security", points: 5,
      text: R`Fill in the gaps. A private-key encryption scheme $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ is CPA-secure, i.e., *secure against chosen-plaintext attacks*, if for every <gap>p.p.t. adversary $\mathcal{A}$</gap> there exists <gap>a negligible function $\varepsilon(\cdot)$</gap> such that $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$, where the experiment $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)$ is defined as follows:

1. A key $k \gets \mathsf{Gen}(1^n)$ is generated.
2. $\mathcal{A}$ is given $1^n$ and <gap>oracle access to $\mathsf{Enc}_k(\cdot)$</gap>.
3. $\mathcal{A}$ outputs a pair of messages $m_0, m_1$ with $|m_0| = |m_1|$.
4. A bit $b \gets \{0,1\}$ is sampled and <gap>the challenge ciphertext $c \gets \mathsf{Enc}_k(m_b)$</gap> is given to $\mathcal{A}$.
5. $\mathcal{A}$ <gap>continues to have oracle access to $\mathsf{Enc}_k(\cdot)$</gap>.
6. $\mathcal{A}$ outputs a bit $b'$. The output of the experiment is 1 if and only if <gap>$b' = b$</gap>.`,
      note: R`The adversary may even query the oracle on $m_0$ or $m_1$; that is why deterministic schemes cannot be CPA-secure.` },

    { id: "ex-var-gap-prg", type: "gap", lecture: 5, topic: "prg", origin: "variant",
      source: "Variant of Sample midterm, Q2 (Definition 3.14)", difficulty: 2,
      title: "Pseudorandom generator (PRG)", points: 5,
      text: R`Fill in the gaps. Let $\ell$ be a polynomial and let $G$ be a <gap>deterministic polynomial-time algorithm</gap> such that $|G(s)| = \ell(|s|)$ for every input $s$. $G$ is a pseudorandom generator (PRG) if

1. (expansion) <gap>$\ell(n) > n$ for every $n$</gap>, and
2. (pseudorandomness) for every <gap>p.p.t. distinguisher $\mathcal{D}$</gap> there exists a negligible function $\varepsilon(\cdot)$ such that

<gap>$\left|\Pr\big[\mathcal{D}(G(s)) = 1\big] - \Pr\big[\mathcal{D}(r) = 1\big]\right| \le \varepsilon(n)$</gap>,

where the first probability is over <gap>a uniform seed $s \gets \{0,1\}^n$</gap> (and the randomness of $\mathcal{D}$) and the second over <gap>a uniform string $r \gets \{0,1\}^{\ell(n)}$</gap> (and the randomness of $\mathcal{D}$).`,
      note: R`$\ell$ is the expansion factor. The seed must be uniform and secret; $G$ itself is public (Kerckhoffs).` },

    { id: "ex-var-gap-prp", type: "gap", lecture: 6, topic: "cpa-prf", origin: "variant",
      source: "Variant of Sample midterm, Q2 (PRP, lecture 6)", difficulty: 2,
      title: "Pseudorandom permutation (PRP)", points: 5,
      text: R`Fill in the gaps. A keyed function $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ is a keyed permutation if for every key $k$ the function $F_k$ is <gap>a bijection on $\{0,1\}^n$</gap>, and both $F_k$ and <gap>its inverse $F_k^{-1}$</gap> are efficiently computable. $F$ is a pseudorandom permutation (PRP) if for every <gap>p.p.t. distinguisher $\mathcal{D}$</gap> there exists a negligible function $\varepsilon(\cdot)$ such that

$$\left|\Pr\big[\mathcal{D}^{F_k(\cdot)}(1^n) = 1\big] - \Pr\big[\mathcal{D}^{f(\cdot)}(1^n) = 1\big]\right| \le \varepsilon(n),$$

where the first probability is over <gap>a uniform key $k \gets \{0,1\}^n$</gap> and the second over <gap>a uniform permutation $f \gets \mathsf{Perm}_n$</gap> (the set of all permutations of $\{0,1\}^n$), and the randomness of $\mathcal{D}$.`,
      note: R`Block ciphers are the practical instantiations of PRPs. CBC needs a PRP (decryption uses $F_k^{-1}$); CTR only needs a PRF.` },

    { id: "ex-var-gap-ps", type: "gap", lecture: 2, topic: "perfect-secrecy", origin: "variant",
      source: "Variant of Midterm 2025-12-03, Q2 (Definition 2.3)", difficulty: 1,
      title: "Perfect secrecy", points: 5,
      text: R`Fill in the gaps. Let $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ be an encryption scheme with message space $\mathcal{M}$. Let $M$ be a random variable for the message, $K$ a random variable for the key output by $\mathsf{Gen}$, where $K$ and $M$ are <gap>independent</gap>, and let $C$ be the random variable for the resulting ciphertext $\mathsf{Enc}_K(M)$.

$\Pi$ is perfectly secret if for <gap>every probability distribution over $\mathcal{M}$</gap>, every message $m \in \mathcal{M}$ and every ciphertext $c$ with <gap>$\Pr[C = c] > 0$</gap>:

<gap>$\Pr[M = m \mid C = c] = \Pr[M = m]$</gap>.

Theorem 2.11: for every perfectly secret scheme, <gap>$|\mathcal{K}| \ge |\mathcal{M}|$</gap>.`,
      note: R`Intuition: the ciphertext gives no additional information about the message, whatever the adversary already knew (the prior distribution). The adversary sees only one ciphertext but may be computationally unbounded.` },

    { id: "ex-var-gap-pi", type: "gap", lecture: 4, topic: "perfect-secrecy", origin: "variant",
      source: "Variant of Midterm 2025-12-03, Q2 (Definition 2.6)", difficulty: 2,
      title: "Perfect indistinguishability", points: 5,
      text: R`Fill in the gaps. For an encryption scheme $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ with message space $\mathcal{M}$ and an adversary $\mathcal{A}$, the experiment $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}$ is:

1. $\mathcal{A}$ outputs a pair of messages <gap>$m_0, m_1 \in \mathcal{M}$</gap>.
2. A key $k \gets \mathsf{Gen}$ and a bit $b \gets \{0,1\}$ are chosen, and <gap>$c \gets \mathsf{Enc}_k(m_b)$</gap> is given to $\mathcal{A}$.
3. $\mathcal{A}$ outputs $b'$; the output of the experiment is 1 iff $b' = b$.

$\Pi$ is perfectly indistinguishable if for <gap>every adversary $\mathcal{A}$ (no bound on its running time)</gap>:

<gap>$\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi} = 1] = \tfrac12$</gap>.

Lemma 2.7: $\Pi$ is perfectly indistinguishable if and only if <gap>it is perfectly secret</gap>.`,
      note: R`The computational version (Definition 3.8) changes three things: only p.p.t. adversaries, $\le \tfrac12 + \varepsilon(n)$ with negligible $\varepsilon$, and a security parameter $1^n$ with $|m_0| = |m_1|$.` },

    { id: "ex-var-gap-negl", type: "gap", lecture: 4, topic: "computational", origin: "variant",
      source: "Variant of Final exam 2021-02-02, Q2a (Definition 3.4)", difficulty: 1,
      title: "Negligible function", points: 5,
      text: R`Fill in the gaps. A function $f \colon \mathbb{N} \to \mathbb{R}^{+}$ is negligible if for every <gap>positive polynomial $p$</gap> there exists <gap>an $N \in \mathbb{N}$</gap> such that for all <gap>$n > N$</gap>:

<gap>$f(n) < \frac{1}{p(n)}$</gap>.

Example: $2^{-n}$ and $n^{-\log n}$ are negligible, while <gap>$n^{-10}$ (any inverse polynomial)</gap> is not.`,
      note: R`Equivalently: for every constant $c$, $f(n) < n^{-c}$ for all sufficiently large $n$. Closure: if $\varepsilon$ is negligible and $p$ a polynomial, then $p(n) \cdot \varepsilon(n)$ is negligible.` },
  );

  // ===================================================================
  // Variant problems
  // ===================================================================

  // (a) perfect secrecy ------------------------------------------------
  add(
    { id: "ex-var-p01", type: "problem", lecture: 2, topic: "perfect-secrecy", origin: "variant",
      source: "Variant of Sample midterm, Q3", difficulty: 3,
      title: "Two modified one-time pads",
      mock: true,
      statement: R`Let $\ell \ge 1$ and $\mathcal{M} = \{0,1\}^\ell$. For a bit string $x$, let $p(x)$ be its parity (XOR of all bits).`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Scheme $\Pi_a$: $\mathsf{Gen}$ samples $k$ uniformly from $\{0,1\}^\ell \setminus \{0^\ell\}$; $\mathsf{Enc}_k(m) := k \oplus m$; $\mathsf{Dec}_k(c) := k \oplus c$. Prove that $\Pi_a$ is not perfectly secret.`,
          hints: [
            R`Which ciphertext can never be produced from a given message $m$?`,
            R`Since $k \neq 0^\ell$, $c \neq m$ always. Take $M$ uniform and look at $\Pr[M = c \mid C = c]$.`
          ],
          solution: R`Take $M$ uniform over $\{0,1\}^\ell$ and fix any $c \in \{0,1\}^\ell$. Then
$$\Pr[C = c] = \sum_{m} \Pr[M = m] \Pr[K = m \oplus c] = \sum_{m \neq c} 2^{-\ell} \cdot \frac{1}{2^\ell - 1} = 2^{-\ell} > 0.$$
Since $K \neq 0^\ell$, encrypting $m = c$ would need $K = 0^\ell$, so $\Pr[M = c \mid C = c] = 0$, while $\Pr[M = c] = 2^{-\ell} > 0$. Hence $\Pr[M = c \mid C = c] \neq \Pr[M = c]$, and $\Pi_a$ is not perfectly secret.

(Alternatively: $|\mathcal{K}| = 2^\ell - 1 < 2^\ell = |\mathcal{M}|$, contradicting Theorem 2.11.)`,
          rubric: [
            { points: 1, text: R`Concrete distribution and ciphertext $c$ with $\Pr[C = c] > 0$` },
            { points: 1, text: R`Shows $\Pr[M = c \mid C = c] = 0 \neq \Pr[M = c]$ (or correctly applies $|\mathcal{K}| \ge |\mathcal{M}|$)` }
          ] },
        { label: "b", points: 2,
          prompt: R`Scheme $\Pi_b$: $\mathsf{Gen}$ samples $k \gets \{0,1\}^\ell$ uniformly; $\mathsf{Enc}_k(m) := (k \oplus m,\ p(k))$; $\mathsf{Dec}_k(c_1, \beta) := k \oplus c_1$. Is $\Pi_b$ perfectly secret? Justify your answer in 2–3 sentences.`,
          hints: [
            R`The parity is linear: $p(k \oplus m) = p(k) \oplus p(m)$.`,
            R`From $(c_1, \beta)$ one can compute $p(c_1) \oplus \beta$. What is that?`
          ],
          solution: R`**No.** From a ciphertext $(c_1, \beta)$ anyone can compute $p(c_1) \oplus \beta = p(k) \oplus p(m) \oplus p(k) = p(m)$, so the parity of the message leaks. Concretely, for $M$ uniform over $\{0^\ell, 1 0^{\ell-1}\}$ and $c = (0^\ell, 0)$ (produced by $m = 0^\ell$, $k = 0^\ell$, so $\Pr[C = c] = 2^{-\ell-1} > 0$) we get $\Pr[M = 10^{\ell-1} \mid C = c] = 0 \neq \tfrac12$.`,
          rubric: [
            { points: 1, text: R`Answer "no" and identifies that $p(m) = p(c_1) \oplus \beta$ leaks` },
            { points: 1, text: R`Concrete distribution / probabilities showing the definition fails` }
          ] }
      ] },

    { id: "ex-var-p02", type: "problem", lecture: 2, topic: "perfect-secrecy", origin: "variant",
      source: "Variant of Sample midterm, Q3 and Q1a", difficulty: 2,
      title: "Perfectly secret or not?",
      mock: true,
      statement: R`Decide for each scheme whether it is perfectly secret and prove your answer.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`$\mathcal{M} = \mathcal{K} = \{0,1\}^\ell$, $\mathsf{Gen}$ samples $k$ uniformly, $\mathsf{Enc}_k(m) := k \oplus m \oplus 1^\ell$, $\mathsf{Dec}_k(c) := k \oplus c \oplus 1^\ell$.`,
          hints: [
            R`For fixed $m$ and $c$, how many keys map $m$ to $c$?`,
            R`Compute $\Pr[C = c \mid M = m]$, then $\Pr[C = c]$, then use Bayes.`
          ],
          solution: R`**Perfectly secret.** Fix any distribution over $\mathcal{M}$, any $m$ with $\Pr[M = m] > 0$ and any $c$. Since $K$ and $M$ are independent,
$$\Pr[C = c \mid M = m] = \Pr[K = m \oplus c \oplus 1^\ell] = 2^{-\ell}.$$
By total probability, $\Pr[C = c] = \sum_{m'} 2^{-\ell} \Pr[M = m'] = 2^{-\ell}$, and by Bayes
$$\Pr[M = m \mid C = c] = \frac{\Pr[C = c \mid M = m] \Pr[M = m]}{\Pr[C = c]} = \frac{2^{-\ell} \Pr[M = m]}{2^{-\ell}} = \Pr[M = m].$$
(For $\Pr[M = m] = 0$ both sides are 0.) This is the one-time pad with key $k \oplus 1^\ell$, which is again uniform.`,
          rubric: [
            { points: 1, text: R`Answer "yes" with $\Pr[C = c \mid M = m] = 2^{-\ell}$ independent of $m$` },
            { points: 1, text: R`Completes the argument via Bayes (or the equivalent $\Pr[\mathsf{Enc}_K(m) = c] = \Pr[\mathsf{Enc}_K(m') = c]$)` }
          ] },
        { label: "b", points: 2,
          prompt: R`$\mathcal{M} = \mathcal{K} = \mathcal{C} = \{0, 1, \dots, 25\}$, $\mathsf{Gen}$ samples $k$ uniformly, $\mathsf{Enc}_k(m) := (m + 2k) \bmod 26$, $\mathsf{Dec}_k(c) := (c - 2k) \bmod 26$.`,
          hints: [
            R`26 is even. What happens to the parity of $m$ when you add $2k$ and reduce modulo 26?`,
            R`Choose a distribution over one even and one odd message.`
          ],
          solution: R`**Not perfectly secret.** Since $2k$ and $26$ are even, $c = m + 2k - 26j$ always has the same parity as $m$: the ciphertext reveals whether $m$ is even. Take $M$ uniform over $\{0, 1\}$ and $c = 0$: $\Pr[C = 0] \ge \Pr[M = 0] \Pr[K = 0] = \tfrac12 \cdot \tfrac1{26} > 0$, but an odd message never yields the even ciphertext 0, so $\Pr[M = 1 \mid C = 0] = 0 \neq \tfrac12 = \Pr[M = 1]$.

(Note that $|\mathcal{K}| = |\mathcal{M}|$, so Theorem 2.11 alone does not decide this: only 13 different shifts $2k \bmod 26$ actually occur.)`,
          rubric: [
            { points: 1, text: R`Answer "no" with the parity leak (only even shifts)` },
            { points: 1, text: R`Concrete distribution, $c$ with $\Pr[C = c] > 0$ and $\Pr[M = m \mid C = c] \neq \Pr[M = m]$` }
          ] }
      ] },
  );

  // (b) PRG-based schemes ------------------------------------------------
  add(
    { id: "ex-var-p03", type: "problem", lecture: 5, topic: "prg", origin: "variant",
      source: "Variant of Midterm 2025-12-03, Q3", difficulty: 3,
      title: "PRG-based encryption with an end-bit selector",
      mock: true,
      statement: R`Let $G \colon \{0,1\}^n \to \{0,1\}^{2n}$ be a PRG and $n \ge 2$. For $x = x_1 x_2 \dots x_n \in \{0,1\}^n$ let $q(x) := x_1 \oplus x_n$ (XOR of the first and the last bit). Consider the scheme $\Pi$ for messages $m \in \{0,1\}^n$:

- $\mathsf{Gen}(1^n)$: return $k \gets \{0,1\}^n$.
- $\mathsf{Enc}_k(m)$: compute $k_0 \| k_1 := G(k)$ with $k_i \in \{0,1\}^n$. Let $r := k_{q(m)}$ and return $c := m \oplus r \oplus (q(r) \| 0^{n-1})$.
- $\mathsf{Dec}_k(c)$: compute $k_0 \| k_1 := G(k)$. Let $s := k_{q(c)}$ and return $m := c \oplus s \oplus (q(s) \| 0^{n-1})$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Show that $\Pi$ is correct. Hint: what is $q(r \oplus (q(r) \| 0^{n-1}))$?`,
          hints: [
            R`XOR-ing $q(r) \| 0^{n-1}$ changes only the first bit. Since $n \ge 2$, the last bit is unchanged.`,
            R`$q$ is linear: $q(x \oplus y) = q(x) \oplus q(y)$. Compare $q(c)$ and $q(m)$.`
          ],
          solution: R`Let $w := r \oplus (q(r) \| 0^{n-1})$. Its first bit is $w_1 = r_1 \oplus q(r) = r_1 \oplus r_1 \oplus r_n = r_n$, and (as $n \ge 2$) its last bit is $w_n = r_n$. Hence $q(w) = r_n \oplus r_n = 0$.

$q$ is linear, so $q(c) = q(m \oplus w) = q(m) \oplus q(w) = q(m)$. Therefore $\mathsf{Dec}$ selects $s = k_{q(c)} = k_{q(m)} = r$ and computes
$$c \oplus s \oplus (q(s) \| 0^{n-1}) = m \oplus w \oplus w = m.$$`,
          rubric: [
            { points: 1, text: R`Shows $q(w) = 0$ and hence $q(c) = q(m)$` },
            { points: 1, text: R`Concludes $s = r$ and recovers $m$` }
          ] },
        { label: "b", points: 4,
          prompt: R`Show that $\Pi$ is not EAV-secure. Specify the values of all variables you use.`,
          hints: [
            R`Part a shows that $q(c) = q(m)$ for every key.`,
            R`Pick $m_0, m_1$ of length $n$ with $q(m_0) = 0$ and $q(m_1) = 1$.`
          ],
          solution: R`EAV-security requires $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$ for every p.p.t. $\mathcal{A}$ and a negligible $\varepsilon$.

**Adversary $\mathcal{A}(1^n)$:**
1. Output $m_0 := 0^n$ (so $q(m_0) = 0 \oplus 0 = 0$) and $m_1 := 1 0^{n-1}$ (so $q(m_1) = 1 \oplus 0 = 1$).
2. On input $c = c_1 \dots c_n$, output $b' := c_1 \oplus c_n = q(c)$.

**Analysis.** By part a, $q(c) = q(m_b) = b$, so $b' = b$ always: $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] = 1$. $\mathcal{A}$ runs in constant time. Since $1 > \tfrac12 + \varepsilon(n)$ for large $n$, $\Pi$ is not EAV-secure, no matter how good $G$ is.`,
          rubric: [
            { points: 1, text: R`Identifies the invariant $q(c) = q(m)$` },
            { points: 1, text: R`Concrete $m_0, m_1$ of equal length with different $q$-values` },
            { points: 1, text: R`Output rule $b' := c_1 \oplus c_n$, both cases analysed` },
            { points: 1, text: R`Success probability 1, conclusion` }
          ] }
      ] },

    { id: "ex-var-p04", type: "problem", lecture: 5, topic: "reductions", origin: "variant",
      source: "Variant of the pseudo one-time pad proof (Theorem 3.16) and Midterm 2025-12-03, Q3", difficulty: 3,
      title: "Pseudo one-time pad on a repeated message",
      mock: true,
      statement: R`Let $G \colon \{0,1\}^n \to \{0,1\}^{2n}$ be a PRG. Consider the scheme $\Pi$ for messages $m \in \{0,1\}^n$: $\mathsf{Gen}(1^n)$ returns $k \gets \{0,1\}^n$, and $\mathsf{Enc}_k(m) := G(k) \oplus (m \| m)$.`,
      parts: [
        { label: "a", points: 1,
          prompt: R`Define $\mathsf{Dec}_k(c)$ and show correctness.`,
          hints: [ R`XOR with $G(k)$ again gives $m \| m$.` ],
          solution: R`$\mathsf{Dec}_k(c)$: compute $x := c \oplus G(k)$ and return the first $n$ bits of $x$. Since $G$ is deterministic, $c \oplus G(k) = G(k) \oplus (m \| m) \oplus G(k) = m \| m$, whose first half is $m$.`,
          rubric: [ { points: 1, text: R`Correct $\mathsf{Dec}$ with the cancellation argument` } ] },
        { label: "b", points: 5,
          prompt: R`Prove, by giving a reduction, that $\Pi$ is EAV-secure.`,
          hints: [
            R`From an EAV adversary $\mathcal{A}$ build a distinguisher $\mathcal{D}$ that gets $y \in \{0,1\}^{2n}$ and uses it in place of $G(k)$.`,
            R`If $y = G(k)$, $\mathcal{D}$ simulates $\mathsf{PrivK}^{\mathsf{eav}}$ perfectly. If $y$ is uniform, what is the distribution of $y \oplus (m_b \| m_b)$?`,
            R`A uniform $y$ XOR a fixed string is uniform, independent of $b$, so $\mathcal{A}$ wins with probability exactly $\tfrac12$.`
          ],
          solution: R`**Assumption.** $G$ is a PRG: for every p.p.t. $\mathcal{D}$ there is a negligible $\varepsilon$ with
$$\left|\Pr_{s \gets \{0,1\}^n}[\mathcal{D}(G(s)) = 1] - \Pr_{y \gets \{0,1\}^{2n}}[\mathcal{D}(y) = 1]\right| \le \varepsilon(n).$$

**Reduction.** Let $\mathcal{A}$ be a p.p.t. EAV adversary. $\mathcal{D}$ on input $y \in \{0,1\}^{2n}$:
1. Run $\mathcal{A}(1^n)$ to get $m_0, m_1 \in \{0,1\}^n$.
2. Choose $b \gets \{0,1\}$, give $c := y \oplus (m_b \| m_b)$ to $\mathcal{A}$.
3. When $\mathcal{A}$ outputs $b'$, output $1$ if $b' = b$, else $0$.

$\mathcal{D}$ is p.p.t. since $\mathcal{A}$ is and $\mathcal{D}$ only adds one XOR.

**Pseudorandom case** ($y = G(s)$ for uniform $s$): $c = G(s) \oplus (m_b \| m_b) = \mathsf{Enc}_s(m_b)$ with a uniform key, exactly as in the experiment, so $\Pr[\mathcal{D}(G(s)) = 1] = \Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1]$.

**Random case** ($y$ uniform in $\{0,1\}^{2n}$): $c = y \oplus (m_b \| m_b)$ is uniform in $\{0,1\}^{2n}$ for both values of $b$ (one-time pad on $2n$ bits), so $\mathcal{A}$'s view is independent of $b$ and $\Pr[\mathcal{D}(y) = 1] = \tfrac12$.

**Conclusion.** $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] - \tfrac12 \le \varepsilon(n)$, i.e. $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$ for every p.p.t. $\mathcal{A}$, so $\Pi$ is EAV-secure.`,
          rubric: [
            { points: 1, text: R`States the PRG assumption precisely` },
            { points: 1, text: R`Defines $\mathcal{D}$: runs $\mathcal{A}$, encrypts $m_b$ with $y$, outputs 1 iff $b' = b$; p.p.t.` },
            { points: 1, text: R`Pseudorandom case: perfect simulation of $\mathsf{PrivK}^{\mathsf{eav}}$` },
            { points: 1, text: R`Random case: $c$ uniform and independent of $b$, probability exactly $\tfrac12$` },
            { points: 1, text: R`Final inequality and conclusion` }
          ] },
        { label: "c", points: 2,
          prompt: R`Show that $\Pi$ is not CPA-secure.`,
          hints: [ R`Is $\mathsf{Enc}$ randomized?` ],
          solution: R`$\mathsf{Enc}$ is deterministic. $\mathcal{A}$ queries its encryption oracle on $0^n$ and receives $c_0 = G(k) \oplus 0^{2n}$. It outputs $m_0 := 0^n$, $m_1 := 1^n$, receives $c^\ast$ and outputs $b' := 0$ iff $c^\ast = c_0$. If $b = 1$, $c^\ast = c_0 \oplus 1^{2n} \neq c_0$. So $\mathcal{A}$ wins with probability 1, and $\Pi$ is not CPA-secure.`,
          rubric: [
            { points: 1, text: R`Concrete adversary using an encryption query on $m_0$` },
            { points: 1, text: R`Analysis: success probability 1 because encryption is deterministic` }
          ] }
      ] },
  );

  // (c) modified / stateful modes ----------------------------------------
  add(
    { id: "ex-var-p05", type: "problem", lecture: 7, topic: "modes", origin: "variant",
      source: "Variant of Sample midterm, Q4 (stateful mode)", difficulty: 3,
      title: "CBC with chained IV",
      mock: true,
      statement: R`Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ be a pseudorandom permutation (block cipher). Consider the following *stateful* variant of CBC mode, in which each encryption uses the last ciphertext block of the previous encryption as its IV:

- $\mathsf{Gen}(1^n)$: return $k \gets \{0,1\}^n$ and the state $IV \gets \{0,1\}^n$ (uniform).
- $\mathsf{Enc}_{k,IV}(m)$: parse $m = m_1 \| \dots \| m_\ell$ with $m_i \in \{0,1\}^n$. Set $c_0 := IV$ and $c_i := F_k(m_i \oplus c_{i-1})$ for $i = 1, \dots, \ell$. Update $IV := c_\ell$ and return $c := c_0 \| c_1 \| \dots \| c_\ell$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Define the (stateless) decryption algorithm $\mathsf{Dec}_k(c)$ and show correctness.`,
          hints: [ R`The IV used is sent as $c_0$. Invert $F_k$ block by block.` ],
          solution: R`$\mathsf{Dec}_k(c)$: parse $c = c_0 \| c_1 \| \dots \| c_\ell$; for $i = 1, \dots, \ell$ compute $m_i := F_k^{-1}(c_i) \oplus c_{i-1}$; return $m_1 \| \dots \| m_\ell$.

Correctness: $F_k^{-1}(c_i) \oplus c_{i-1} = F_k^{-1}(F_k(m_i \oplus c_{i-1})) \oplus c_{i-1} = m_i$. The state is not needed since $c_0$ is part of the ciphertext.`,
          rubric: [
            { points: 1, text: R`Correct $\mathsf{Dec}$ using $F_k^{-1}$ and $c_0$` },
            { points: 1, text: R`Correctness computation` }
          ] },
        { label: "b", points: 4,
          prompt: R`Show that $\Pi$ is not CPA-secure (in $\mathsf{PrivK}^{\mathsf{cpa}}$, every encryption, including the challenge, updates the state as above).`,
          hints: [
            R`After an encryption query, the adversary knows the IV that the challenge encryption will use.`,
            R`Query $0^n$ to get $(c_0, c_1)$ with $c_1 = F_k(c_0)$; the challenge will use IV $c_1$.`,
            R`Choose $m_0$ such that $m_0 \oplus c_1 = c_0$: then the challenge block is $F_k(c_0) = c_1$, a value you already know.`
          ],
          solution: R`**Adversary $\mathcal{A}$:**
1. Query the encryption oracle on $0^n$ and receive $(c_0, c_1)$ with $c_1 = F_k(0^n \oplus c_0) = F_k(c_0)$. Now the state is $IV = c_1$.
2. Output $m_0 := c_0 \oplus c_1$ and $m_1 := c_0 \oplus c_1 \oplus 1^n$ (both one block). Receive $c^\ast = (c^\ast_0, c^\ast_1)$ with $c^\ast_0 = c_1$ and $c^\ast_1 = F_k(m_b \oplus c_1)$.
3. Output $b' := 0$ if $c^\ast_1 = c_1$, else $b' := 1$.

**Analysis.**
- $b = 0$: $c^\ast_1 = F_k(c_0 \oplus c_1 \oplus c_1) = F_k(c_0) = c_1$, so $\mathcal{A}$ outputs 0.
- $b = 1$: $c^\ast_1 = F_k(c_0 \oplus 1^n) \neq F_k(c_0) = c_1$, since $F_k$ is a permutation and $c_0 \oplus 1^n \neq c_0$; $\mathcal{A}$ outputs 1.

So $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] = 1 > \tfrac12 + \mathsf{negl}(n)$, and $\Pi$ is not CPA-secure. (The problem is that the IV is predictable, not that it repeats.)`,
          rubric: [
            { points: 1, text: R`Encryption query and observation that the next IV ($c_1$) is known` },
            { points: 1, text: R`Challenge messages chosen relative to the known IV, all values specified` },
            { points: 1, text: R`Computation of $c^\ast_1$ for $b = 0$ and $b = 1$ (using injectivity of $F_k$)` },
            { points: 1, text: R`Success probability 1, conclusion` }
          ] },
        { label: "c", points: 1,
          prompt: R`In the stateful CTR mode of the sample midterm (Q4), restricting messages to one block made the scheme CPA-secure. Does restricting $\Pi$ to messages in $\{0,1\}^n$ help here? One sentence.`,
          hints: [ R`How many blocks did the attack in part b use?` ],
          solution: R`**No:** the attack in part b only uses one-block messages, because the weakness is the predictable IV, which the adversary can cancel by choosing $m_0 := c_0 \oplus c_1$, not an overlap of pads.`,
          rubric: [ { points: 1, text: R`"No", with the reason: the attack already uses one-block messages / predictable IV` } ] }
      ] },

    { id: "ex-var-p06", type: "problem", lecture: 7, topic: "modes", origin: "variant",
      source: "Variant of Sample midterm, Q4", difficulty: 3,
      title: "Stateful CTR mode done right",
      mock: true,
      statement: R`Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ be a PRF. Consider the following stateful variant of CTR mode, where the counter advances by the number of blocks:

- $\mathsf{Gen}(1^n)$: return $k \gets \{0,1\}^n$ and the state $ctr := 0$.
- $\mathsf{Enc}_{k,ctr}(m)$: parse $m = m_1 \| \dots \| m_\ell$ with $m_i \in \{0,1\}^n$. For $i = 1, \dots, \ell$ compute $c_i := F_k(ctr + i) \oplus m_i$. Set $c_0 := ctr$, update $ctr := ctr + \ell$, and return $c := c_0 \| c_1 \| \dots \| c_\ell$.

(Counters are $n$-bit strings, addition is modulo $2^n$.)`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Define the stateless decryption algorithm and show correctness.`,
          hints: [ R`As in CTR mode: $c_0$ carries the counter.` ],
          solution: R`$\mathsf{Dec}_k(c)$: parse $c = c_0 \| c_1 \| \dots \| c_\ell$, compute $m_i := F_k(c_0 + i) \oplus c_i$ for $i = 1, \dots, \ell$, and return $m_1 \| \dots \| m_\ell$.

Correctness: for $c = \mathsf{Enc}_{k,ctr}(m)$ we have $c_0 = ctr$, hence $F_k(c_0 + i) \oplus c_i = F_k(ctr + i) \oplus F_k(ctr + i) \oplus m_i = m_i$.`,
          rubric: [
            { points: 1, text: R`Correct $\mathsf{Dec}$` },
            { points: 1, text: R`Correctness computation` }
          ] },
        { label: "b", points: 5,
          prompt: R`Prove, by giving a reduction to the PRF security of $F$, that $\Pi$ is CPA-secure (for messages of any number of blocks).`,
          hints: [
            R`$\mathcal{D}^{\mathcal{O}}$ keeps the counter itself and uses $\mathcal{O}(ctr + i)$ as the pads.`,
            R`Which counter values are used across all encryptions? Encryption number $j$ uses $ctr_j + 1, \dots, ctr_j + \ell_j$ and $ctr_{j+1} = ctr_j + \ell_j$.`,
            R`All values are distinct as long as the total number of blocks is below $2^n$, so the challenge pads are fresh uniform values. Also note that $|m_0| = |m_1|$, so the counter after the challenge does not depend on $b$.`
          ],
          solution: R`**Assumption.** For every p.p.t. $\mathcal{D}$ there is a negligible $\varepsilon$ with $\left|\Pr[\mathcal{D}^{F_k(\cdot)}(1^n) = 1] - \Pr[\mathcal{D}^{f(\cdot)}(1^n) = 1]\right| \le \varepsilon(n)$, for $k \gets \{0,1\}^n$ and $f \gets \mathsf{Func}_n$.

**Reduction.** Given a p.p.t. CPA adversary $\mathcal{A}$, define $\mathcal{D}^{\mathcal{O}}(1^n)$:
1. Set $ctr := 0$ and run $\mathcal{A}(1^n)$.
2. On a query $m = m_1 \| \dots \| m_\ell$: return $ctr \| (\mathcal{O}(ctr+1) \oplus m_1) \| \dots \| (\mathcal{O}(ctr+\ell) \oplus m_\ell)$ and set $ctr := ctr + \ell$.
3. On challenge $m_0, m_1$ (both $\ell^\ast$ blocks): choose $b \gets \{0,1\}$ and answer as in step 2 with $m_b$.
4. Answer further queries as in step 2; when $\mathcal{A}$ outputs $b'$, output 1 iff $b' = b$.

$\mathcal{D}$ is p.p.t.: one oracle call and one XOR per block.

**Pseudorandom world.** With $\mathcal{O} = F_k$ the simulation is exactly $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)$, so $\Pr[\mathcal{D}^{F_k} = 1] = \Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1]$.

**Random world.** Let $t(n)$ be a polynomial bound on the total number of blocks in all of $\mathcal{A}$'s queries and the challenge. Encryption $j$ uses the counter values $ctr_j + 1, \dots, ctr_j + \ell_j$, and $ctr_{j+1} = ctr_j + \ell_j$, so over the whole run the oracle is queried exactly on $1, 2, \dots, T$ with $T \le t(n)$, each value once, without wrap-around as long as $t(n) < 2^n$ (true for all sufficiently large $n$). The challenge's counter values are therefore never used elsewhere, so its pads $f(ctr^\ast + 1), \dots, f(ctr^\ast + \ell^\ast)$ are uniform and independent of everything else $\mathcal{A}$ sees. Moreover $c^\ast_0 = ctr^\ast$ and the later counter values do not depend on $b$ (because $|m_0| = |m_1|$). Hence $c^\ast$ is a one-time-pad encryption of $m_b$ and $\mathcal{A}$'s view is independent of $b$: $\Pr[\mathcal{D}^{f} = 1] = \tfrac12$.

**Conclusion.** $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] = \Pr[\mathcal{D}^{F_k} = 1] \le \Pr[\mathcal{D}^{f} = 1] + \varepsilon(n) = \tfrac12 + \varepsilon(n)$, so $\Pi$ is CPA-secure.`,
          rubric: [
            { points: 1, text: R`Reduction $\mathcal{D}^{\mathcal{O}}$ with own counter, per-block oracle calls, output 1 iff $b' = b$, p.p.t.` },
            { points: 1, text: R`Pseudorandom world equals the real experiment` },
            { points: 2, text: R`Random world: all counter values distinct (no overlap, no wrap-around), challenge pads fresh, view independent of $b$, probability $\tfrac12$` },
            { points: 1, text: R`Final inequality` }
          ] }
      ] },

    { id: "ex-var-p07", type: "problem", lecture: 6, topic: "cpa-prf", origin: "variant",
      source: "Variant of Sample midterm, Q4 and Construction 3.28", difficulty: 3,
      title: "CTR mode with a frozen counter",
      mock: true,
      statement: R`Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ be a PRF. A developer "simplifies" CTR mode by not incrementing the counter:

- $\mathsf{Gen}(1^n)$: return $k \gets \{0,1\}^n$.
- $\mathsf{Enc}_k(m)$: parse $m = m_1 \| \dots \| m_\ell$ with $m_i \in \{0,1\}^n$. Choose $r \gets \{0,1\}^n$ and return $c := r \| (F_k(r) \oplus m_1) \| \dots \| (F_k(r) \oplus m_\ell)$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Define $\mathsf{Dec}_k(c)$ and show correctness.`,
          hints: [ R`All blocks use the same pad $F_k(c_0)$.` ],
          solution: R`$\mathsf{Dec}_k(c)$: parse $c = c_0 \| c_1 \| \dots \| c_\ell$, compute $y := F_k(c_0)$ and $m_i := y \oplus c_i$, return $m_1 \| \dots \| m_\ell$. Correct since $c_0 = r$ and $F_k(r) \oplus F_k(r) \oplus m_i = m_i$.`,
          rubric: [
            { points: 1, text: R`Correct $\mathsf{Dec}$` },
            { points: 1, text: R`Correctness computation` }
          ] },
        { label: "b", points: 3,
          prompt: R`Show that $\Pi$ is not even EAV-secure (and therefore not CPA-secure).`,
          hints: [
            R`Within one ciphertext, how are equal message blocks encrypted?`,
            R`$c_1 \oplus c_2 = m_1 \oplus m_2$.`
          ],
          solution: R`**Adversary $\mathcal{A}$:** output $m_0 := 0^n \| 0^n$ and $m_1 := 0^n \| 1^n$. On $c = c_0 \| c_1 \| c_2$, output $b' := 0$ if $c_1 = c_2$, else $b' := 1$.

Since $c_1 \oplus c_2 = m_{b,1} \oplus m_{b,2}$: if $b = 0$ then $c_1 = c_2$; if $b = 1$ then $c_1 \oplus c_2 = 1^n$, so $c_1 \neq c_2$. Thus $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] = 1$, and $\Pi$ is not EAV-secure. Since CPA-security implies EAV-security, it is not CPA-secure either.`,
          rubric: [
            { points: 1, text: R`Concrete two-block $m_0, m_1$ of equal length` },
            { points: 1, text: R`Output rule comparing $c_1, c_2$ with both cases analysed` },
            { points: 1, text: R`Probability 1, conclusion for EAV and hence CPA` }
          ] },
        { label: "c", points: 5,
          prompt: R`Prove, by giving a reduction, that $\Pi$ is CPA-secure when the message space is restricted to $\{0,1\}^n$.`,
          hints: [
            R`For one-block messages, $\Pi$ is exactly Construction 3.28. Reproduce its proof.`,
            R`In the random world, the challenge pad $f(r^\ast)$ is fresh unless $r^\ast$ equals one of the $r_i$ used in the queries.`,
            R`$\Pr[\text{repeat}] \le q(n)/2^n$; conditioned on no repeat, $\mathcal{A}$ wins with probability exactly $\tfrac12$.`
          ],
          solution: R`For $m \in \{0,1\}^n$ the scheme is $\mathsf{Enc}_k(m) = (r, F_k(r) \oplus m)$, i.e. Construction 3.28.

**Reduction.** For a p.p.t. CPA adversary $\mathcal{A}$ making at most $q(n)$ queries, define $\mathcal{D}^{\mathcal{O}}(1^n)$: run $\mathcal{A}(1^n)$; answer each query $m$ by choosing $r \gets \{0,1\}^n$ and returning $(r, \mathcal{O}(r) \oplus m)$; on challenge $m_0, m_1$ choose $b \gets \{0,1\}$, $r^\ast \gets \{0,1\}^n$ and return $(r^\ast, \mathcal{O}(r^\ast) \oplus m_b)$; output 1 iff $\mathcal{A}$ outputs $b' = b$. $\mathcal{D}$ is p.p.t.

**Pseudorandom world.** With $\mathcal{O} = F_k$ this is exactly the CPA experiment: $\Pr[\mathcal{D}^{F_k} = 1] = \Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1]$.

**Random world.** Let $\mathsf{Repeat}$ be the event that $r^\ast$ equals one of the values $r_i$ used to answer $\mathcal{A}$'s queries (before or after the challenge). Each $r_i$ is uniform and independent of $r^\ast$, so $\Pr[\mathsf{Repeat}] \le q(n)/2^n$. If $\mathsf{Repeat}$ does not occur, $f(r^\ast)$ is uniform and independent of everything else $\mathcal{A}$ sees, so $c^\ast$ is a one-time pad encryption and $\Pr[\mathcal{D}^f = 1 \mid \neg\mathsf{Repeat}] = \tfrac12$. Hence
$$\Pr[\mathcal{D}^{f} = 1] \le \Pr[\mathsf{Repeat}] + \Pr[\mathcal{D}^{f} = 1 \mid \neg\mathsf{Repeat}] \le \frac{q(n)}{2^n} + \frac12.$$

**Conclusion.** By the PRF assumption,
$$\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] \le \Pr[\mathcal{D}^{f} = 1] + \varepsilon(n) \le \tfrac12 + \varepsilon(n) + \frac{q(n)}{2^n},$$
and $\varepsilon(n) + q(n)/2^n$ is negligible. So $\Pi$ restricted to $\{0,1\}^n$ is CPA-secure.`,
          rubric: [
            { points: 1, text: R`Reduction $\mathcal{D}^{\mathcal{O}}$ simulating queries and the challenge with fresh $r$; output 1 iff $b' = b$; p.p.t.` },
            { points: 1, text: R`Pseudorandom world equals the real experiment` },
            { points: 2, text: R`Random world: repeat event with $\Pr \le q(n)/2^n$; otherwise fresh pad, probability $\tfrac12$` },
            { points: 1, text: R`Final bound $\tfrac12 + \varepsilon(n) + q(n)/2^n$, noted to be negligible` }
          ] }
      ] },
  );

  // (d) reductions -------------------------------------------------------
  add(
    { id: "ex-var-p08", type: "problem", lecture: 6, topic: "reductions", origin: "variant",
      source: "Variant of Final exam 2025-01-31, Q2c", difficulty: 3,
      title: "Masking the message before encrypting",
      mock: true,
      statement: R`Let $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ be an encryption scheme for messages in $\{0,1\}^n$. Define $\Pi' = (\mathsf{Gen}, \mathsf{Enc}', \mathsf{Dec}')$ by
$$\mathsf{Enc}'_k(m): \text{ choose } r \gets \{0,1\}^n \text{ and return } (r,\ \mathsf{Enc}_k(m \oplus r)).$$`,
      parts: [
        { label: "a", points: 1,
          prompt: R`Define $\mathsf{Dec}'$ and show correctness.`,
          hints: [ R`Decrypt with $\mathsf{Dec}_k$, then remove the mask.` ],
          solution: R`$\mathsf{Dec}'_k(r, c) := \mathsf{Dec}_k(c) \oplus r$. By correctness of $\Pi$, $\mathsf{Dec}_k(\mathsf{Enc}_k(m \oplus r)) \oplus r = m \oplus r \oplus r = m$.`,
          rubric: [ { points: 1, text: R`Correct $\mathsf{Dec}'$ and correctness argument` } ] },
        { label: "b", points: 4,
          prompt: R`Prove, by giving a reduction, that if $\Pi$ is CPA-secure then $\Pi'$ is CPA-secure.`,
          hints: [
            R`$\mathcal{A}'$ against $\Pi$ runs $\mathcal{A}$ against $\Pi'$. It can choose the masks $r$ itself.`,
            R`For the challenge, pick $r^\ast$ and submit $m_0 \oplus r^\ast$, $m_1 \oplus r^\ast$ (still of equal length).`,
            R`The simulation is perfect, so the winning probabilities are equal.`
          ],
          solution: R`Let $\mathcal{A}$ be a p.p.t. adversary against $\Pi'$. Define $\mathcal{A}'$ against $\Pi$, with oracle $\mathsf{Enc}_k(\cdot)$:
1. Run $\mathcal{A}(1^n)$.
2. On a query $m$: choose $r \gets \{0,1\}^n$, query the oracle on $m \oplus r$ to get $c$, return $(r, c)$.
3. On $\mathcal{A}$'s challenge $m_0, m_1$: choose $r^\ast \gets \{0,1\}^n$ and output $m_0 \oplus r^\ast,\ m_1 \oplus r^\ast$ as own challenge (both $n$ bits). On receiving $c^\ast = \mathsf{Enc}_k(m_b \oplus r^\ast)$, give $(r^\ast, c^\ast)$ to $\mathcal{A}$.
4. Answer later queries as in step 2. Output whatever $\mathcal{A}$ outputs.

$\mathcal{A}'$ is p.p.t. (one sample and one XOR per query). Every answer has exactly the distribution of $\mathsf{Enc}'_k(m)$, and the challenge equals $\mathsf{Enc}'_k(m_b)$ for the challenger's bit $b$, so $\mathcal{A}$'s view is identical to $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi'}(n)$ and $\mathcal{A}'$ wins iff $\mathcal{A}$ wins:
$$\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi'}(n) = 1] = \Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A}',\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n).$$`,
          rubric: [
            { points: 1, text: R`Defines $\mathcal{A}'$ that samples masks and uses its oracle for encryption queries` },
            { points: 1, text: R`Challenge handled by submitting $m_0 \oplus r^\ast, m_1 \oplus r^\ast$ and returning $(r^\ast, c^\ast)$` },
            { points: 1, text: R`Argues perfect simulation and p.p.t.` },
            { points: 1, text: R`Concludes with the inequality from CPA-security of $\Pi$` }
          ] },
        { label: "c", points: 2,
          prompt: R`Show that the statement fails if $\Pi$ is only EAV-secure: give an EAV-secure $\Pi$ for which $\Pi'$ is not CPA-secure.`,
          hints: [ R`Take $\Pi$ to be the one-time pad with $\ell = n$.` ],
          solution: R`Let $\Pi$ be the one-time pad on $\{0,1\}^n$, which is perfectly secret and hence EAV-secure. Then $\mathsf{Enc}'_k(m) = (r, k \oplus m \oplus r)$. A CPA adversary queries $0^n$, receives $(r, s)$ and computes $k = s \oplus r$. It submits $m_0 = 0^n$, $m_1 = 1^n$, receives $(r^\ast, s^\ast)$, computes $m_b = s^\ast \oplus k \oplus r^\ast$ and outputs $b$. It wins with probability 1, so $\Pi'$ is not CPA-secure.`,
          rubric: [
            { points: 1, text: R`Choice of an EAV-secure $\Pi$ (e.g. OTP) and the key-recovery query` },
            { points: 1, text: R`Complete attack with success probability 1` }
          ] }
      ] },

    { id: "ex-var-p09", type: "problem", lecture: 6, topic: "cpa-prf", origin: "variant",
      source: "Variant of Construction 3.28 / Final exam 2021-02-02, Q3a", difficulty: 3,
      title: "Construction 3.28 with a deterministic tag",
      mock: true,
      statement: R`Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ be a PRF. For messages $m \in \{0,1\}^n$ consider
$$\mathsf{Enc}_k(m): \ r \gets \{0,1\}^n;\ \text{return } c := (r,\ F_k(r) \oplus m,\ F_k(m)),$$
with $\mathsf{Gen}(1^n)$ returning $k \gets \{0,1\}^n$ and $\mathsf{Dec}_k(r, s, t) := F_k(r) \oplus s$.`,
      parts: [
        { label: "a", points: 3,
          prompt: R`Show that $\Pi$ is not CPA-secure.`,
          hints: [
            R`Which part of the ciphertext is a deterministic function of $m$?`,
            R`Query $0^n$ and compare the third component with the challenge's.`,
            R`If $b = 1$, the adversary errs only if $F_k(1^n) = F_k(0^n)$. Why is that negligible?`
          ],
          solution: R`**Adversary $\mathcal{A}$:** query the encryption oracle on $0^n$ and keep the third component $t' = F_k(0^n)$. Output $m_0 := 0^n$, $m_1 := 1^n$; on $c^\ast = (r, s, t)$ output $b' := 0$ if $t = t'$, else $b' := 1$.

**Analysis.** If $b = 0$, $t = F_k(0^n) = t'$, so $\mathcal{A}$ is always right. If $b = 1$, $t = F_k(1^n)$, and $\mathcal{A}$ is wrong only if $F_k(1^n) = F_k(0^n)$. Let $\delta(n) := \Pr_k[F_k(0^n) = F_k(1^n)]$. The distinguisher that queries $0^n$ and $1^n$ and outputs 1 iff the answers are equal outputs 1 with probability $\delta(n)$ for $F_k$ and $2^{-n}$ for a random $f$, so $\delta(n) \le 2^{-n} + \varepsilon(n)$ is negligible. Hence
$$\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] = \tfrac12 \cdot 1 + \tfrac12 (1 - \delta(n)) = 1 - \tfrac{\delta(n)}{2},$$
which is not $\le \tfrac12 + \mathsf{negl}(n)$. So $\Pi$ is not CPA-secure.`,
          rubric: [
            { points: 1, text: R`Adversary with an encryption query and comparison of the deterministic component $F_k(m)$` },
            { points: 1, text: R`Analysis of both cases of $b$` },
            { points: 1, text: R`Handles the collision $F_k(0^n) = F_k(1^n)$ (negligible) and concludes` }
          ] },
        { label: "b", points: 5,
          prompt: R`Prove, by giving a reduction to the PRF, that $\Pi$ is EAV-secure.`,
          hints: [
            R`$\mathcal{D}^{\mathcal{O}}$ runs $\mathcal{A}$, picks $b$ and $r$, and builds $c = (r, \mathcal{O}(r) \oplus m_b, \mathcal{O}(m_b))$.`,
            R`With a random $f$: if $r \notin \{m_0, m_1\}$, then $f(r)$ and $f(m_b)$ are two independent uniform values.`,
            R`Bound the bad event $r \in \{m_0, m_1\}$ by $2/2^n$.`
          ],
          solution: R`**Reduction.** For a p.p.t. EAV adversary $\mathcal{A}$, let $\mathcal{D}^{\mathcal{O}}(1^n)$ run $\mathcal{A}(1^n)$ to get $m_0, m_1$, choose $b \gets \{0,1\}$ and $r \gets \{0,1\}^n$, give $c := (r, \mathcal{O}(r) \oplus m_b, \mathcal{O}(m_b))$ to $\mathcal{A}$, and output 1 iff $\mathcal{A}$ outputs $b' = b$. $\mathcal{D}$ makes two oracle queries and is p.p.t.

**Pseudorandom world.** With $\mathcal{O} = F_k$, $c = \mathsf{Enc}_k(m_b)$ exactly, so $\Pr[\mathcal{D}^{F_k} = 1] = \Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1]$.

**Random world.** Let $E$ be the event $r \in \{m_0, m_1\}$; since $r$ is uniform and independent of $m_0, m_1$, $\Pr[E] \le 2/2^n$, and $E$ does not depend on $b$. If $E$ does not occur, then $r \neq m_b$, so $f(r)$ and $f(m_b)$ are independent and uniform. Then $(f(r) \oplus m_b, f(m_b))$ is a pair of independent uniform strings, whatever $b$ is, so $c$ is independent of $b$ and $\Pr[\mathcal{D}^f = 1 \mid \neg E] = \tfrac12$. Hence $\Pr[\mathcal{D}^f = 1] \le \tfrac12 + 2^{1-n}$.

**Conclusion.** $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + 2^{1-n} + \varepsilon(n)$, which is $\tfrac12$ plus a negligible function. So $\Pi$ is EAV-secure, but by part a not CPA-secure: a deterministic component is harmless against an eavesdropper who sees a single ciphertext, but fatal under chosen-plaintext attacks.`,
          rubric: [
            { points: 1, text: R`Reduction $\mathcal{D}^{\mathcal{O}}$ constructing the full ciphertext; p.p.t.` },
            { points: 1, text: R`Pseudorandom world equals $\mathsf{PrivK}^{\mathsf{eav}}$` },
            { points: 2, text: R`Random world: bad event $r \in \{m_0, m_1\}$ with probability $\le 2/2^n$; otherwise two independent uniform values, probability $\tfrac12$` },
            { points: 1, text: R`Final bound $\tfrac12 + 2^{1-n} + \varepsilon(n)$ and conclusion` }
          ] }
      ] },
  );

  // (e) attacks ----------------------------------------------------------
  add(
    { id: "ex-var-p10", type: "problem", lecture: 7, topic: "cca", origin: "variant",
      source: "Variant of Final exam 2025-01-31, Q2b", difficulty: 3,
      title: "CTR mode and a parity check are not CCA-secure",
      mock: true,
      statement: R`Recall randomized CTR mode with a PRF $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$: $\mathsf{Enc}_k(m_1 \| \dots \| m_\ell)$ samples $ctr \gets \{0,1\}^n$, computes $c_i := F_k(ctr + i) \oplus m_i$ and returns $(ctr, c_1, \dots, c_\ell)$.`,
      parts: [
        { label: "a", points: 4,
          prompt: R`Show that CTR mode is not CCA-secure.`,
          hints: [
            R`CTR encryption XORs a pad onto the message. What does flipping a ciphertext bit do?`,
            R`Flip the last bit of $c_1$ in the challenge and ask the decryption oracle.`
          ],
          solution: R`**Adversary $\mathcal{A}$:**
1. Output $m_0 := 0^n$, $m_1 := 1^n$ (one block each); receive $c^\ast = (ctr, c_1)$ with $c_1 = F_k(ctr + 1) \oplus m_b$.
2. Query the decryption oracle on $c' := (ctr, c_1 \oplus 0^{n-1}1)$, which is allowed since $c' \neq c^\ast$. Receive $m' = F_k(ctr+1) \oplus c_1 \oplus 0^{n-1}1 = m_b \oplus 0^{n-1}1$.
3. Output $b' := 0$ if $m' = 0^{n-1}1$, and $b' := 1$ otherwise.

If $b = 0$ then $m' = 0^{n-1}1$; if $b = 1$ then $m' = 1^{n-1}0 \neq 0^{n-1}1$. So $\Pr[\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\mathrm{CTR}}(n) = 1] = 1$, and CTR mode is not CCA-secure.`,
          rubric: [
            { points: 1, text: R`Concrete challenge messages` },
            { points: 1, text: R`Valid decryption query on a modified ciphertext $c' \neq c^\ast$` },
            { points: 1, text: R`Correct computation of the oracle answer $m_b \oplus 0^{n-1}1$` },
            { points: 1, text: R`Output rule, success probability 1, conclusion` }
          ] },
        { label: "b", points: 4,
          prompt: R`To stop such attacks, a developer adds a parity check. Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^{n+1}$ be a PRF with $(n+1)$-bit outputs, and let $p(m)$ be the parity of $m$. For $m \in \{0,1\}^n$:

$\mathsf{Enc}_k(m)$: $r \gets \{0,1\}^n$; return $(r,\ F_k(r) \oplus (m \| p(m)))$.

$\mathsf{Dec}_k(r, s)$: compute $x := F_k(r) \oplus s$ and parse $x = m \| \beta$ with $\beta \in \{0,1\}$; if $\beta = p(m)$ return $m$, else return $\bot$.

Show that this scheme is still not CCA-secure.`,
          hints: [
            R`Flipping one message bit flips the parity. Which ciphertext bits do you have to flip so that the check still passes?`,
            R`Flip the first bit of the message part and the parity bit at the same time: XOR $s$ with $1 0^{n-1} \| 1$.`
          ],
          solution: R`Let $\Delta := 1 0^{n-1} \| 1 \in \{0,1\}^{n+1}$.

**Adversary $\mathcal{A}$:**
1. Output $m_0 := 0^n$, $m_1 := 1^n$; receive $c^\ast = (r, s)$ with $s = F_k(r) \oplus (m_b \| p(m_b))$.
2. Query the decryption oracle on $(r, s \oplus \Delta) \neq c^\ast$.
3. The oracle computes $x = (m_b \oplus 1 0^{n-1}) \| (p(m_b) \oplus 1)$. Since flipping one bit flips the parity, $p(m_b \oplus 1 0^{n-1}) = p(m_b) \oplus 1$, so the check passes and the answer is $m' = m_b \oplus 1 0^{n-1}$.
4. Output $b' := 0$ if $m' \oplus 1 0^{n-1} = 0^n$, else $b' := 1$.

$m' \oplus 10^{n-1} = m_b$, so $\mathcal{A}$ wins with probability 1. A linear check such as parity can be updated by the adversary along with the message, so it does not prevent malleability.`,
          rubric: [
            { points: 1, text: R`Concrete challenge messages` },
            { points: 1, text: R`Modification $\Delta$ that flips a message bit and the parity bit together` },
            { points: 1, text: R`Shows the check passes and the oracle returns $m_b \oplus 10^{n-1}$` },
            { points: 1, text: R`Output rule and success probability 1` }
          ] }
      ] },

    { id: "ex-var-p11", type: "problem", lecture: 6, topic: "cpa-prf", origin: "variant",
      source: "Variant of Final exam 2021-02-02, Q3a", difficulty: 3,
      title: "Construction 3.28 with too little randomness",
      mock: true,
      statement: R`Let $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ be a PRF. To save randomness, an engineer modifies Construction 3.28: for $m \in \{0,1\}^n$, $\mathsf{Enc}_k(m)$ chooses $r$ uniformly from $\{0, 1, \dots, n-1\}$ (encoded as an $n$-bit string) and returns $(r, F_k(r) \oplus m)$.`,
      parts: [
        { label: "a", points: 1,
          prompt: R`Define $\mathsf{Dec}_k$ and show correctness.`,
          hints: [ R`Same as Construction 3.28.` ],
          solution: R`$\mathsf{Dec}_k(r, s) := F_k(r) \oplus s$; correct since $F_k(r) \oplus F_k(r) \oplus m = m$.`,
          rubric: [ { points: 1, text: R`Correct $\mathsf{Dec}$ and correctness` } ] },
        { label: "b", points: 4,
          prompt: R`Show that the scheme is not CPA-secure.`,
          hints: [
            R`How likely is it that the challenge reuses the $r$ of an earlier encryption query?`,
            R`With a single query on $0^n$ you learn $F_k(r_1)$; the challenge has $r^\ast = r_1$ with probability $1/n$.`,
            R`If $r^\ast = r_1$ you win for sure, otherwise guess. Is the advantage $\tfrac1{2n}$ negligible?`
          ],
          solution: R`**Adversary $\mathcal{A}$:**
1. Query the encryption oracle on $0^n$, receive $(r_1, s_1)$ with $s_1 = F_k(r_1)$.
2. Output $m_0 := 0^n$, $m_1 := 1^n$; receive $(r^\ast, s^\ast)$ with $s^\ast = F_k(r^\ast) \oplus m_b$.
3. If $r^\ast = r_1$: output $b' := 0$ if $s^\ast = s_1$, else $b' := 1$. If $r^\ast \neq r_1$: output a uniform bit $b'$.

**Analysis.** $r^\ast$ is uniform in $\{0, \dots, n-1\}$ and independent of $r_1$, so $\Pr[r^\ast = r_1] = 1/n$. If $r^\ast = r_1$, then $s^\ast = s_1 \oplus m_b$, which equals $s_1$ iff $b = 0$, so $\mathcal{A}$ is always right. Otherwise it is right with probability $\tfrac12$. Hence
$$\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] = \frac1n \cdot 1 + \Big(1 - \frac1n\Big) \cdot \frac12 = \frac12 + \frac1{2n}.$$
$\tfrac1{2n}$ is not negligible (it is not smaller than $1/n^2$ for any $n \ge 2$), so the scheme is not CPA-secure. (With $n^2$ queries instead of one, $\mathcal{A}$ wins with probability $\ge 1 - e^{-n}/2$.)`,
          rubric: [
            { points: 1, text: R`Encryption query that reveals $F_k(r_1)$, concrete challenge messages` },
            { points: 1, text: R`Output rule handling both $r^\ast = r_1$ and $r^\ast \neq r_1$` },
            { points: 1, text: R`Computes $\Pr[r^\ast = r_1] = 1/n$ and the success probability $\tfrac12 + \tfrac1{2n}$` },
            { points: 1, text: R`Argues $\tfrac1{2n}$ is not negligible; conclusion` }
          ] },
        { label: "c", points: 1,
          prompt: R`Which step of the proof of Theorem 3.29 fails for this scheme?`,
          hints: [ R`Look at the bound on the repeat event.` ],
          solution: R`The bound on the event $\mathsf{Repeat}$ (the challenge's $r$ was already used): it becomes $q(n)/n$ instead of $q(n)/2^n$, which is not negligible, so the final bound $\tfrac12 + \varepsilon(n) + q(n)/n$ does not prove security.`,
          rubric: [ { points: 1, text: R`Identifies the repeat probability $q(n)/n$ as non-negligible` } ] }
      ] },
  );
})();
