/* Converted midterm reexam questions — 2025/26 (23 February 2026).
 * The reexam reuses the course's PRF / public-key / key-exchange pattern but
 * with new constructions. Solutions were re-derived; sources are exact.
 */
(function () {
  const R = String.raw;
  const add = (...items) => (window.TRAINER_BANK = window.TRAINER_BANK || []).push(...items);

  add(
    /* ================= multiple choice ================= */
    { id: "ex-2025r-q1-i", type: "mc", lecture: 2, topic: "internet", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(i)", difficulty: 1,
      question: R`What is a limitation of HTTPS in terms of privacy?`,
      options: [
        R`It does not encrypt DNS queries.`,
        R`It only encrypts the browser cache.`,
        R`It is vulnerable to IP address leaks but secures metadata.`,
        R`It cannot provide confidentiality for content transmitted over UDP.`
      ],
      correct: 0,
      explanation: R`Answer: (a). HTTPS protects the HTTP payload, but the DNS lookup is a separate protocol. Unless DoH/DoT is used, intermediaries still see the domains being visited.` },
    { id: "ex-2025r-q1-ii", type: "mc", lecture: 1, topic: "pets", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(ii)", difficulty: 1,
      question: R`How do mix networks improve communication privacy?`,
      options: [
        R`By encrypting the communication content using symmetric keys.`,
        R`By randomly routing messages through multiple intermediate nodes.`,
        R`By obfuscating DNS queries with DoH.`,
        R`By relying on blockchain for peer verification.`
      ],
      correct: 1,
      explanation: R`Answer: (b). Mixes shuffle and route messages through several nodes, so an observer cannot link sender and receiver by timing or path. Encryption protects the layers; the mixing breaks the link.` },
    { id: "ex-2025r-q1-iii", type: "mc", lecture: 5, topic: "public-key", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(iii)", difficulty: 1,
      question: R`In a reduction proof from a primitive $H$ to an underlying primitive $G$ using an effective adversary against $G$, what does the reduction $B$ achieve?`,
      options: [
        R`It independently verifies the security of $G$.`,
        R`It constructs a new encryption scheme to replace $H$.`,
        R`It uses the adversary $A$ to break $H$.`,
        R`It simplifies the problem by ignoring $A$.`
      ],
      correct: 2,
      explanation: R`Answer: (c). A reduction is an algorithm $B$ that uses an alleged attacker $A$ as a subroutine to solve the underlying hard problem. It does not prove $G$ secure and it does not replace $H$.` },
    { id: "ex-2025r-q1-iv", type: "mc", lecture: 3, topic: "censorship", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(iv)", difficulty: 1,
      question: R`Why is the Great Firewall of China an effective censorship tool?`,
      options: [
        R`It leverages blockchain technology for transparency, ensuring users are aware of restrictions.`,
        R`It uses advanced techniques like IP blocking, DNS poisoning, and deep packet inspection.`,
        R`It restricts access by physically disconnecting regions, making content delivery inconsistent.`,
        R`It relies on user cooperation and consent for filtering content, which is often enforced through policies.`
      ],
      correct: 1,
      explanation: R`Answer: (b). The GFW combines several technical layers: IP/port blocking, DNS tampering, deep packet inspection, TCP resets and protocol fingerprinting.` },
    { id: "ex-2025r-q1-v", type: "mc", lecture: 3, topic: "circumvention", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(v)", difficulty: 2,
      question: R`What is the main limitation of domain fronting as a censorship circumvention method?`,
      options: [
        R`It requires advanced hardware to implement, increasing costs.`,
        R`It depends on support from Content Delivery Networks (CDNs), some of which have stopped supporting it due to abuse or policy changes.`,
        R`It exposes user data to public networks.`,
        R`It is illegal in most jurisdictions, creating a significant barrier to adoption.`
      ],
      correct: 1,
      explanation: R`Answer: (b). Fronting works only if the CDN forwards a request whose SNI and HTTP Host differ. CDN operators can disable it; Google stopped allowing it in 2018.` },
    { id: "ex-2025r-q1-vi", type: "mc", lecture: 3, topic: "circumvention", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(vi)", difficulty: 2,
      question: R`How do Fully Encrypted Protocols (FEPs) help in circumventing censorship?`,
      options: [
        R`By using predefined bypass routes that are hardcoded into the protocol and unknown to censors.`,
        R`By making traffic look like normal web requests to trusted services.`,
        R`By fully encrypting both payload and protocol metadata, so censors can only block or allow everything.`,
        R`By dynamically switching encryption keys every few seconds, making decryption infeasible for censors.`
      ],
      correct: 2,
      explanation: R`Answer: (c). FEPs such as obfs4 hide both content and the protocol fingerprint. A censor cannot classify the traffic and must resort to blocking everything or nothing; volume and timing are still observable.` },
    { id: "ex-2025r-q1-vii", type: "mc", lecture: 3, topic: "fingerprinting", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(vii)", difficulty: 1,
      question: R`What is the paradox of fingerprintable privacy-enhancing technologies?`,
      options: [
        R`They mitigate fingerprint tracking but increase website loading times.`,
        R`They work best when only a few people use them.`,
        R`They can make users more identifiable if used by too few people.`,
        R`They only work in certain geographic regions.`
      ],
      correct: 2,
      explanation: R`Answer: (c). A tool that changes the browser configuration can itself become a rare feature. If only few users share that configuration, the defence becomes an identifier.` },
    { id: "ex-2025r-q1-viii", type: "mc", lecture: 4, topic: "symmetric", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(viii)", difficulty: 1,
      question: R`What does CPA security guarantee?`,
      options: [
        R`That a plaintext can be recovered from a ciphertext using only the encryption algorithm.`,
        R`That an adversary cannot distinguish between the encryption of two chosen plaintexts.`,
        R`That the key can be derived from multiple ciphertexts.`,
        R`That an adversary cannot distinguish between the encryption of two chosen plaintexts of the same length.`
      ],
      correct: 3,
      explanation: R`Answer: (d). In the CPA game the challenge messages must have equal length, otherwise the length alone distinguishes them. CPA security hides everything except the length.` },
    { id: "ex-2025r-q1-ix", type: "mc", lecture: 4, topic: "signatures", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(ix)", difficulty: 1,
      question: R`Which of the following is **not** a property of digital signature schemes?`,
      options: [
        R`Correctness: valid signatures are accepted by the verification algorithm.`,
        R`Efficiency: signing and verification operations are computationally feasible.`,
        R`Anonymity: signatures do not reveal the identity of the signer.`,
        R`Unforgeability: adversaries cannot create valid signatures without the signing key.`
      ],
      correct: 2,
      explanation: R`Answer: (c). Ordinary signatures authenticate the signer through $vk$; anonymity is not a required property. Anonymous credentials are a separate primitive.` },
    { id: "ex-2025r-q1-x", type: "mc", lecture: 4, topic: "signatures", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(x)", difficulty: 1,
      question: R`In the Schnorr signature scheme, what is the purpose of the hash function?`,
      options: [
        R`To derive the signing key in the key-generation algorithm.`,
        R`To ensure the signing algorithm is deterministic.`,
        R`To hide the message prior to applying the signing algorithm.`,
        R`To bind the signature to the message and prevent forgery.`
      ],
      correct: 3,
      explanation: R`Answer: (d). The challenge $h=H(vk,R,m)$ depends on the message and on $R$. Without this binding one can choose $s$ and set $R=g^s vk^{-h}$, which forges a signature.` },
    { id: "ex-2025r-q1-xi", type: "mc", lecture: 5, topic: "public-key", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(xi)", difficulty: 2,
      question: R`What does the Decisional Diffie-Hellman (DDH) assumption state?`,
      options: [
        R`It is computationally infeasible to compute $g^{xy}$ given $g^x$ and $g^y$, with uniformly random $x,y \in \mathbb{Z}_p$.`,
        R`It is difficult to distinguish $g^{xy}$ from $g^z$ in a cyclic group for uniformly random $x,y,z \in \mathbb{Z}_p$.`,
        R`It ensures that $g^x$ and $g^y$ are indistinguishable from random strings for uniformly random $x,y \in \mathbb{Z}_p$.`,
        R`It assumes $g^x$ and $g^{xy}$ are equivalent for uniformly random $x,y \in \mathbb{Z}_p$.`
      ],
      correct: 1,
      explanation: R`Answer: (b). DDH is a decision problem: distinguish the real triple $(g^x,g^y,g^{xy})$ from $(g^x,g^y,g^z)$. Computing $g^{xy}$ is CDH.` },
    { id: "ex-2025r-q1-xii", type: "mc", lecture: 5, topic: "public-key", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(xii)", difficulty: 2,
      question: R`In a reduction proof, what is the primary challenge when constructing a reduction $B$ that uses an algorithm $A$ as a subprotocol?`,
      options: [
        R`Ensuring $B$ operates without randomness.`,
        R`Simulating the environment for $A$ while solving the hard problem.`,
        R`Creating a new cryptographic encryption scheme to address specific problem constraints.`,
        R`Avoiding reliance on external oracles to keep the reduction self-contained.`
      ],
      correct: 1,
      explanation: R`Answer: (b). $B$ must answer all of $A$'s queries so that $A$ cannot tell the simulated game from the real one, while using the challenge instance to solve the hard problem.` },
    { id: "ex-2025r-q1-xiii", type: "mc", lecture: 5, topic: "public-key", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(xiii)", difficulty: 1,
      question: R`What security property does public-key encryption achieve that symmetric encryption alone cannot provide?`,
      options: [
        R`Transmitted ciphertext leaks no information about the encrypted message.`,
        R`Protection against chosen-plaintext attacks.`,
        R`More efficient encryption and decryption algorithms.`,
        R`Secure communication between parties without prior key exchange.`
      ],
      correct: 3,
      explanation: R`Answer: (d). Public-key encryption removes the need for a shared secret before communication. Confidentiality and CPA security can also be achieved symmetrically.` },
    { id: "ex-2025r-q1-xiv", type: "mc", lecture: 6, topic: "tls", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(xiv)", difficulty: 1,
      question: R`Which of the following best describes the concept of forward secrecy in cryptographic protocols?`,
      options: [
        R`Preventing attackers from decrypting past communications after a private-key compromise.`,
        R`Encrypting communication headers to protect against eavesdropping by third-party attackers on unsecured channels.`,
        R`Ensuring deterministic key generation for secure exchanges across multiple sessions without added overhead.`,
        R`Securing static keys for long-term use in systems where frequent key rotation is impractical.`
      ],
      correct: 0,
      explanation: R`Answer: (a). With ephemeral key exchange, the session key is never protected by a long-term key alone. A later key leak does not decrypt recorded past sessions.` },
    { id: "ex-2025r-q1-xv", type: "mc", lecture: 6, topic: "tls", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(xv)", difficulty: 1,
      question: R`Which TLS 1.3 building block ensures message integrity and indistinguishability?`,
      options: [
        R`Signature algorithm such as RSA.`,
        R`AEAD.`,
        R`Key derivation function.`,
        R`SHA-256.`
      ],
      correct: 1,
      explanation: R`Answer: (b). AEAD (e.g. AES-GCM or ChaCha20-Poly1305) provides confidentiality and integrity for each record. Signatures authenticate the handshake, and the KDF derives keys.` },
    { id: "ex-2025r-q1-xvi", type: "mc", lecture: 6, topic: "tls", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(xvi)", difficulty: 2,
      question: R`How does KEMTLS provide post-quantum security for TLS?`,
      options: [
        R`By replacing RSA/ECC key exchanges with quantum-resistant KEMs.`,
        R`By encrypting all traffic using AES-128.`,
        R`By increasing the handshake duration for added security.`,
        R`By removing public-key encryption components entirely from the TLS protocol.`
      ],
      correct: 0,
      explanation: R`Answer: (a). KEMTLS replaces the Diffie-Hellman/RSA key establishment with a post-quantum KEM such as Kyber or NTRU. Symmetric primitives are not the bottleneck against Shor.` },
    { id: "ex-2025r-q1-xvii", type: "mc", lecture: 6, topic: "tls", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(xvii)", difficulty: 1,
      question: R`What is the main threat to ECC from quantum computers?`,
      options: [
        R`Collision resistance.`,
        R`Key reusability.`,
        R`Discrete logarithm problem.`,
        R`Block cipher vulnerabilities.`
      ],
      correct: 2,
      explanation: R`Answer: (c). Shor's algorithm solves the elliptic-curve discrete logarithm problem in polynomial time. Grover only gives a quadratic speedup for symmetric search.` },
    { id: "ex-2025r-q1-xviii", type: "mc", lecture: 6, topic: "tls", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(xviii)", difficulty: 1,
      question: R`What was the primary cause of the Heartbleed vulnerability?`,
      options: [
        R`Incorrect certificate validation.`,
        R`Lack of payload length validation in the heartbeat extension.`,
        R`Misuse of public key encryption.`,
        R`Improper initialization of session keys.`
      ],
      correct: 1,
      explanation: R`Answer: (b). OpenSSL trusted the length field of a heartbeat request and copied more bytes than the sender supplied, leaking up to 64 KB of server memory.` },
    { id: "ex-2025r-q1-xix", type: "mc", lecture: 6, topic: "tls", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(xix)", difficulty: 1,
      question: R`How does Grover's algorithm impact symmetric cryptography?`,
      options: [
        R`It breaks collision resistance of hash functions.`,
        R`It factors large integers.`,
        R`It enhances key exchange protocols.`,
        R`It halves the effective bit-security level.`
      ],
      correct: 3,
      explanation: R`Answer: (d). Grover gives a quadratic speedup for unstructured search, so a $k$-bit key has about $k/2$ bits of security against a quantum attacker. Factoring is Shor.` },

    /* ================= problems ================= */
    { id: "ex-2025r-p2", type: "problem", lecture: 4, topic: "prfs", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Problem 2", difficulty: 3,
      title: "Customizing PRFs: A Special Input",
      mock: true,
      statement: R`Let $F:\{0,1\}^\lambda \times \{0,1\}^\lambda \to \{0,1\}^\lambda$ be a PRF and let $a\|b$ denote concatenation. We use a relaxed notion of PRF in which input, output and key lengths need not be equal. Consider
$$F'_{k'}(x) :=
\begin{cases}
F_{k_0}(x\|0) \,\|\, F_{k_0}(x\|1), & x \ne 0,\\
F_{k_0}(x\|0) \,\|\, k_1, & x = 0,
\end{cases}$$
where the key is $k'=(k_0,k_1)$, both parts uniform and independent, and $x \in \{0,1\}^{\lambda-1}$.`,
      parts: [
        { label: "i", points: 2,
          prompt: R`Explain in a few sentences your intuition whether $F'$ is also a PRF.`,
          hints: [R`Where is $k_1$ used?`,
                  R`For $x=0$, the second half is uniform and independent of all other outputs.`,
                  R`For $x\ne 0$, the two halves are evaluations on disjoint inputs.`],
          solution: R`$F'$ **is** a PRF. For $x \ne 0$, the two halves are $F_{k_0}$ evaluated at the distinct inputs $x\|0$ and $x\|1$. For $x=0$, the second half is replaced by $k_1$, which is uniform and independent of $k_0$ and is never used at any other input. Replacing one pseudorandom value by an independent uniform value leaves the output distribution pseudorandom.`,
          rubric: [ { points: 1, text: R`Correct intuition: $F'$ is a PRF` },
                    { points: 1, text: R`$k_1$ is independent and used only at $x=0$` } ] },
        { label: "ii", points: 5,
          prompt: R`Let $F$ be a generic PRF whose key and output lengths are both polynomial in $\lambda$. Is $G_k(x) = F_k(x) \oplus k$ always a secure PRF? Give a formal proof if yes, or a counterexample if no.`,
          hints: [R`You cannot XOR the unknown key into the oracle answers in a reduction.`,
                  R`Build a PRF $F$ with one exceptional input on which the output is $0$.`,
                  R`Use the oracle at $0$ to find that exceptional input.`],
          solution: R`**No.** The construction is not necessarily a PRF.

Let $\tilde F$ be any PRF and define
$$F_k(x) :=
\begin{cases}
0, & x = \tilde F_k(0) \oplus k,\\
\tilde F_k(x), & \text{otherwise}.
\end{cases}$$

**$F$ is a PRF.** The exceptional input $x^\ast := \tilde F_k(0)\oplus k$ is a single point that depends pseudorandomly on the secret key. A PPT adversary making polynomially many queries hits $x^\ast$ only with negligible probability, so $F$ is indistinguishable from $\tilde F$, hence from a random function.

**$G_k(x)=F_k(x)\oplus k$ is not a PRF.** The distinguisher does the following:

1. Query $x=0$ and receive $y = G_k(0) = F_k(0)\oplus k$. Except with negligible probability, $0 \ne x^\ast$, so $F_k(0)=\tilde F_k(0)$ and therefore $y = \tilde F_k(0)\oplus k = x^\ast$.
2. Query $x=y$. Since $y=x^\ast$, we have $F_k(y)=0$, hence the answer is
$$z = G_k(y) = 0 \oplus k = k.$$
3. The distinguisher has recovered the key $k$. With $k$ known, it can evaluate $F_k$ locally on any further input and compare the result with the oracle. For the real $G_k$ the answers are consistent; for a truly random function they are not.

Hence $G$ is distinguishable with overwhelming advantage, while $F$ is a PRF. This is a counterexample to the claim.

**Intuition:** a reduction would have to XOR the unknown key $k$ into every oracle answer. That is exactly what a PRF reduction cannot do, and the counterexample turns this gap into an attack.`,
          rubric: [ { points: 1, text: R`Answer: no, not always a PRF` },
                    { points: 1, text: R`Counterexample $F$ with one exceptional input` },
                    { points: 1, text: R`Argue $F$ is still a PRF (exceptional input hit only negligibly often)` },
                    { points: 1, text: R`Distinguisher: query $0$, then query the returned value, recover $k$` },
                    { points: 1, text: R`Use $k$ to check consistency and distinguish` } ] }
      ] },
    { id: "ex-2025r-p3", type: "problem", lecture: 5, topic: "public-key", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Problem 3", difficulty: 3,
      title: "ElGamal: Linear Functions and Encodings",
      mock: true,
      statement: R`ElGamal over a cyclic group $G$ of prime order $p$ with generator $g$:
$$\mathrm{KGen}: x \leftarrow \mathbb{Z}_p,\; h:=g^x,\; sk:=x,\; pk:=h;$$
$$\mathrm{Enc}(pk,m): y \leftarrow \mathbb{Z}_p,\; c_1:=g^y,\; c_2:=pk^y\cdot m,\; c:=(c_1,c_2);$$
$$\mathrm{Dec}(sk,c): m:=c_2/c_1^x.$$`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Given ciphertexts $c=(c_1,c_2)$ and $c'=(c_1',c_2')$ encrypting $m,m'\in G$, derive an encryption of $m^\alpha (m')^\beta$ for fixed $\alpha,\beta \in \mathbb{Z}_p$. Explain whether the scheme needs to be modified.`,
          hints: [R`ElGamal is multiplicatively homomorphic: multiply the two ciphertexts component by component.`,
                  R`For a power, raise both components to the same exponent.`,
                  R`The new randomness is $\alpha y + \beta y'$.`],
          solution: R`No modification is needed. Write
$$c=(g^y,\; pk^y m), \qquad c'=(g^{y'},\; pk^{y'} m').$$
Then
$$c^\alpha := (c_1^\alpha,c_2^\alpha) = (g^{\alpha y},\; pk^{\alpha y}m^\alpha),$$
and analogously for $c'^\beta$. Component-wise multiplication gives
$$c_{\mathrm{new}} := (c_1^\alpha c_1'^\beta,\; c_2^\alpha c_2'^\beta)
= \bigl(g^{\alpha y+\beta y'},\; pk^{\alpha y+\beta y'}m^\alpha m'^\beta\bigr).$$
This is a valid ElGamal encryption of $m^\alpha m'^\beta$ with randomness $y_{\mathrm{new}}=\alpha y+\beta y' \pmod p$. If $(\alpha,\beta)\ne(0,0)$, at least one exponent is nonzero, so $y_{\mathrm{new}}$ is uniform; if both are zero, the result is the trivial encryption of $1$.`,
          rubric: [ { points: 1, text: R`Component-wise multiplication / exponentiation` },
                    { points: 1, text: R`Show the result encrypts $m^\alpha m'^\beta$ with randomness $\alpha y+\beta y'$` } ] },
        { label: "b", points: 4,
          prompt: R`The plaintext space should be $S=\{0,1,\dots,\lambda^c\}$ for a small constant $c$, instead of group elements. Explain how to encrypt $m\in S$, and give a high-level argument that the resulting scheme is CPA-secure.`,
          hints: [R`Map an integer $m$ to the group element $g^m$.`,
                  R`After decryption you recover $g^m$; the set $S$ is polynomially large.`,
                  R`CPA security of ElGamal only needs the message to be a group element.`],
          solution: R`Encode $m\in S$ as the group element $g^m$ and run ordinary ElGamal on that group element:
$$c = \bigl(g^y,\; pk^y \cdot g^m\bigr).$$
Decryption yields
$$\frac{c_2}{c_1^x} = \frac{pk^y g^m}{g^{xy}} = g^m.$$
Because $|S| = \lambda^c+1$ is polynomial in $\lambda$, the receiver recovers $m$ from $g^m$ by brute force over $S$ in time $O(\lambda^c)$.

**CPA security.** The encoding $m \mapsto g^m$ is deterministic but public and injective on $S$. Any CPA adversary against the modified scheme can be turned into a CPA adversary against ordinary ElGamal: whenever it submits challenge messages $m_0,m_1$, the reduction submits $g^{m_0},g^{m_1}$ instead. The challenge ciphertext is distributed exactly as in the modified scheme. Since ordinary ElGamal is CPA-secure under DDH, so is the encoded variant. The brute-force decoding is done only by the honest receiver and does not help the adversary.`,
          rubric: [ { points: 1, text: R`Encode $m$ as $g^m$` },
                    { points: 1, text: R`Correctness: decrypt to $g^m$ and brute-force over $S$` },
                    { points: 1, text: R`Reduction to ordinary ElGamal on group elements` },
                    { points: 1, text: R`CPA security inherited from DDH` } ] },
        { label: "c", points: 1,
          prompt: R`Would the same solution work if the plaintext space were all of $\mathbb{Z}_p$? Motivate your answer.`,
          hints: [R`How large is the search space now?`,
                  R`What would the receiver have to compute to recover $m$ from $g^m$?`],
          solution: R`No. The receiver would have to recover an arbitrary $m\in\mathbb{Z}_p$ from $g^m$, which is exactly the discrete logarithm problem. Under the DLP assumption this is infeasible; brute force over all of $\mathbb{Z}_p$ takes exponential time. The polynomial-size search space was essential for decoding.`,
          rubric: [ { points: 1, text: R`No; decoding becomes a discrete logarithm / exponential search` } ] }
      ] },
    { id: "ex-2025r-p4", type: "problem", lecture: 5, topic: "public-key", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Problem 4", difficulty: 3,
      title: "Key Exchange with a Helpful Eavesdropper",
      mock: true,
      statement: R`Consider standard Diffie-Hellman: $A$ samples $x\leftarrow\mathbb{Z}_p$ and sends $[x]$, $B$ samples $y\leftarrow\mathbb{Z}_p$ and sends $[y]$, and both compute $[xy]$, where $[a]:=g^a$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Suppose an eavesdropper has an efficient black-box algorithm $C$ that on input $[x],[y]$ outputs $[xy]$ with non-negligible probability. Is the key exchange still secure? Prove it or give an attack.`,
          hints: [R`$C$ solves the computational Diffie-Hellman problem.`,
                  R`The eavesdropper can compute the real key and compare it with the received one.`],
          solution: R`No, the protocol is **not** secure. The eavesdropper sees $[x]$ and $[y]$ in the transcript. It runs $C([x],[y])$ and obtains $[xy]$ with non-negligible probability. In the eavesdropper game the received key is either the real key $[xy]$ or an independent uniform group element. The adversary simply checks whether the received key equals $C([x],[y])$.

Its advantage is non-negligible (essentially the success probability of $C$), so the key exchange is broken. Equivalently, $C$ solves CDH, which makes DDH easy.`,
          rubric: [ { points: 1, text: R`No; $C$ computes the shared key` },
                    { points: 1, text: R`Compare the received key with $C([x],[y])$` } ] },
        { label: "b", points: 3,
          prompt: R`Now suppose the eavesdropper has an efficient black-box algorithm $C$ that on input $[x]$ returns $1$ if $x$ is even and $0$ otherwise. Is the key exchange still secure? Prove it or give an attack.`,
          hints: [R`Use $C$ to learn the parity of $x$, $y$, and the key exponent.`,
                  R`For the real key, $z=xy$; for a random key, $z$ is independent.`,
                  R`Compare $\operatorname{parity}(z)$ with $\operatorname{parity}(x)\operatorname{parity}(y)$.`],
          solution: R`No, the protocol is **not** secure. The parity oracle breaks DDH. Given a DDH tuple $([x],[y],[z])$, the adversary computes
$$p_x := C([x]), \qquad p_y := C([y]), \qquad p_z := C([z]).$$

- If $z=xy$, then $z$ is even exactly when $x$ or $y$ is even, i.e.
$$p_z = p_x \cdot p_y \pmod 2.$$
- If $z$ is uniform and independent, then $p_z$ is an independent uniform bit, so the equality holds only with probability about $1/2$.

The distinguisher outputs “real” if $p_z = p_x p_y \pmod 2$ and “random” otherwise. Its advantage is about $1/2$, which is not negligible. Hence DDH is easy and the key exchange is insecure.

*Caveat:* this is the intended exam-level parity attack. It treats $C$ as returning the parity of the sampled integer exponent. In a prime-order group the parity of an exponent is not a group invariant ($g^x=g^{x+q}$ with odd $q$); a fully rigorous treatment would need a group of even order or a restricted-exponent model. The argument below follows the same interpretation.`,
          rubric: [ { points: 1, text: R`No; use $C$ on $[x],[y],[z]$` },
                    { points: 1, text: R`Real key: $p_z=p_xp_y$` },
                    { points: 1, text: R`Random key: equality only with probability $1/2$` } ] },
        { label: "c", points: 2,
          prompt: R`Does the answer to (b) change if $A$ and $B$ both sample only exponents that are multiples of $4$? Motivate your answer.`,
          hints: [R`What does $C$ return on a multiple of $4$?`,
                  R`What about the exponent $xy$ of the real key?`,
                  R`What about a random group element?`],
          solution: R`No, the protocol remains insecure. Write $x=4a$ and $y=4b$. Then $xy=16ab$ is even, so for the real key
$$C([xy]) = 0.$$
For a random key $[z]$, the exponent $z$ is odd with probability about $1/2$, in which case $C([z])=1$. The distinguisher therefore rejects whenever $C$ returns $1$ and guesses “real” otherwise. Its advantage is still about $1/2$.

Restricting to multiples of $4$ makes $C$ useless on the transcript components $[x],[y]$, but it does not make the real shared exponent random: it is always even. The parity of the key still leaks whether the key is real or random.

*Caveat:* the argument assumes that the parity oracle is well defined on group elements (for example in a group of even order, where parity is a group invariant). In a prime-order group where exponents are only defined modulo $q$, the oracle must be interpreted through a fixed representative; the intended exam answer is the parity/DDH attack above.`,
          rubric: [ { points: 1, text: R`No; real exponent $xy=16ab$ is even` },
                    { points: 1, text: R`Random key has odd exponent with probability $1/2$; distinguisher still works` } ] }
      ] }
  );
})();
