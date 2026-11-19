/* Converted midterm questions — 2024/25 and 2025/26.
 * Official sample solutions were used and re-derived; sources are exact.
 */
(function () {
  const R = String.raw;
  const add = (...items) => (window.TRAINER_BANK = window.TRAINER_BANK || []).push(...items);

  add(
    /* ================= 2024/25 — multiple choice not already in unit files ================= */
    { id: "ex-2024-q1-i", type: "mc", lecture: 2, topic: "internet", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(i)", difficulty: 1,
      question: R`Why is it important to secure DNS queries with encryption protocols like DoT or DoH?`,
      options: [
        R`DNS queries contain sensitive data, such as the contents of encrypted messages.`,
        R`DNS queries are the only part of the internet communication chain visible to end users.`,
        R`Unencrypted DNS queries expose visited domains to intermediaries, enabling tracking and censorship.`,
        R`Without encryption, DNS servers are unable to process requests reliably.`
      ],
      correct: 2,
      explanation: R`Official solution: (c). DNS is plaintext over UDP/53; the ISP and other intermediaries see the domains being visited. DoT/DoH encrypt the query but do not solve the resolver problem.` },
    { id: "ex-2024-q1-v", type: "mc", lecture: 4, topic: "symmetric", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(v)", difficulty: 2,
      question: R`In the CPA-Secure Encryption scheme from PRFs, what guarantees the randomness of the ciphertext?`,
      options: [
        R`The use of a key generator that outputs random keys.`,
        R`A uniformly random $r$ value that is input in a PRF to blind the message.`,
        R`Encryption using AES in CBC mode.`,
        R`The deterministic nature of PRFs.`
      ],
      correct: 1,
      explanation: R`Official solution: (b). The fresh nonce $r$ randomises $c=(r,F(k,r)\oplus m)$; without a fresh $r$ the scheme would be deterministic and not CPA-secure.` },
    { id: "ex-2024-q1-vi", type: "mc", lecture: 3, topic: "fingerprinting", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(vi)", difficulty: 2,
      question: R`How can HSTS fingerprinting track users even after they clear their cookies?`,
      options: [
        R`By using malicious JavaScript injections to rewrite browser configurations.`,
        R`By persisting HSTS settings in the browser's local storage indefinitely.`,
        R`By checking cached HSTS states for predefined domains in the browser.`,
        R`By modifying the browser's TLS certificate chain to create a unique identifier.`
      ],
      correct: 2,
      explanation: R`Official solution: (c). HSTS lives in its own browser cache, not in cookies; the per-subdomain HTTP to HTTPS upgrade supplies the bits.` },
    { id: "ex-2024-q1-vii", type: "mc", lecture: 3, topic: "circumvention", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(vii)", difficulty: 2,
      question: R`What is a significant limitation of Fully Encrypted Protocols (FEPs) like obfs4?`,
      options: [
        R`They are easily detected by modern deep packet inspection tools.`,
        R`They rely on DNS resolution, making them vulnerable to poisoning.`,
        R`They can only disguise the content, not the traffic volume.`,
        R`They require widespread adoption to be effective.`
      ],
      correct: 2,
      explanation: R`Official solution: (c). FEPs hide content and the protocol fingerprint, but volume and timing remain observable.` },
    { id: "ex-2024-q1-ix", type: "mc", lecture: 3, topic: "fp-defense", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(ix)", difficulty: 2,
      question: R`Why might privacy tools like ad blockers paradoxically increase the uniqueness of a user's fingerprint?`,
      options: [
        R`They disable features that obfuscate the browser's default settings.`,
        R`They introduce distinctive patterns in blocked requests that can be tracked.`,
        R`They modify the browser's User-Agent string to include identifiable information.`,
        R`They rely on non-standard HTTP methods that are easily detected.`
      ],
      correct: 1,
      explanation: R`Official solution: (b). The blocking pattern itself can be a rare feature — an example of the paradox of fingerprintable PETs.` },
    { id: "ex-2024-q1-x", type: "mc", lecture: 5, topic: "public-key", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(x)", difficulty: 2,
      question: R`In the Diffie-Hellman Key Exchange protocol, why is $g^{xy}$ secure under the Decisional Diffie-Hellman assumption?`,
      options: [
        R`Because the exponentiation is computationally intensive.`,
        R`Because it is computationally indistinguishable from a random element in the group.`,
        R`Because the values $g^x$ and $g^y$ are not revealed.`,
        R`Because $g^{xy}$ does not depend on $g^x$ or $g^y$.`
      ],
      correct: 1,
      explanation: R`Official solution: (b). This is precisely the DDH assumption: $g^{xy}$ cannot be distinguished from a random group element $g^z$.` },
    { id: "ex-2024-q1-xvi", type: "mc", lecture: 6, topic: "tls", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(xvi)", difficulty: 2,
      question: R`How does TLS 1.3 ensure forward secrecy?`,
      options: [
        R`By using static RSA for key exchange.`,
        R`By encrypting handshake messages after ServerHello.`,
        R`By employing only ephemeral key exchange mechanisms.`,
        R`By applying AEAD ciphers to session resumption keys.`
      ],
      correct: 2,
      explanation: R`Official solution: (c). TLS 1.3 uses only ephemeral key exchange mechanisms; a long-term key leaked later does not help with past sessions.` },
    { id: "ex-2024-q1-xvii", type: "mc", lecture: 6, topic: "tls", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(xvii)", difficulty: 1,
      question: R`Why is AES in its default mode not CPA-secure?`,
      options: [
        R`It lacks sufficient key entropy.`,
        R`To achieve CPA security, it needs to be used in a mode of operation.`,
        R`It does not provide message integrity.`,
        R`It uses stream ciphers instead of block ciphers.`
      ],
      correct: 1,
      explanation: R`Official solution: (b). AES is a block cipher; CPA security only arises through a mode of operation (CBC with a random IV, CTR, GCM).` },
    { id: "ex-2024-q1-xviii", type: "mc", lecture: 6, topic: "tls", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(xviii)", difficulty: 1,
      question: R`How does TLS achieve message integrity in its record protocol?`,
      options: [
        R`By using authenticated encryption.`,
        R`By using static RSA for authentication.`,
        R`By negotiating cipher suites during the handshake.`,
        R`By employing key encapsulation mechanisms.`
      ],
      correct: 0,
      explanation: R`Official solution: (a). AEAD provides confidentiality and integrity; the MAC additionally covers the sequence number.` },
    { id: "ex-2024-q1-xix", type: "mc", lecture: 6, topic: "tls", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(xix)", difficulty: 1,
      question: R`How does Shor's algorithm threaten the security of TLS?`,
      options: [
        R`It can decrypt AEAD ciphers.`,
        R`It reduces the effective key space of symmetric ciphers.`,
        R`It factors large integers used in RSA and ECC.`,
        R`It enables efficient brute-force attacks on AES.`
      ],
      correct: 2,
      explanation: R`Official solution: (c). Shor breaks RSA/ECC/DDH/DLog; Grover is the relevant one for symmetric primitives.` },

    /* ================= 2025/26 — multiple choice not already in unit files ================= */
    { id: "ex-2025-q1-ii", type: "mc", lecture: 3, topic: "circumvention", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(ii)", difficulty: 2,
      question: R`Which of the following protocols most closely fits the definition of a Fully Encrypted Protocol (FEP), meaning that both payload and protocol metadata are deliberately obfuscated to resist traffic classification?`,
      options: [
        R`HTTPS, because it encrypts payloads but still exposes handshake and header metadata.`,
        R`WireGuard, because it encrypts all packets but retains highly recognizable packet-size and timing patterns.`,
        R`OBFS4 is preferred because it deliberately hides protocol fingerprints, making the traffic appear as random, high-entropy data.`,
        R`TLS 1.3, because it encrypts more of the handshake than previous versions.`
      ],
      correct: 2,
      explanation: R`Official solution: (c). OBFS4 obfuscates the protocol fingerprint; HTTPS, WireGuard and TLS still reveal metadata or patterns.` },
    { id: "ex-2025-q1-iii", type: "mc", lecture: 5, topic: "public-key", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(iii)", difficulty: 1,
      question: R`In many public-key encryption schemes, why is randomness essential during encryption?`,
      options: [
        R`To ensure that the ciphertext grows linearly with the length of the message.`,
        R`To prevent an adversary from predicting the public key used in each encryption.`,
        R`To guarantee that encrypting the same plaintext under the same public key produces different ciphertexts, preventing deterministic leakage.`,
        R`To allow the receiver to reconstruct the secret key during decryption.`
      ],
      correct: 2,
      explanation: R`Official solution: (c). Without fresh randomisation encryption would be deterministic and CPA attacks by comparison would be possible.` },
    { id: "ex-2025-q1-ix", type: "mc", lecture: 6, topic: "tls", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(ix)", difficulty: 2,
      question: R`What is one of the primary challenges in integrating post-quantum security into TLS?`,
      options: [
        R`Post-quantum key exchange algorithms often have larger key sizes or message sizes, which can increase handshake latency and strain existing network infrastructure.`,
        R`Hash-based signature schemes cannot be used in TLS because they provide no mechanism for certificate-based authentication.`,
        R`Quantum-resistant algorithms require trusted hardware support, which most TLS endpoints do not provide.`,
        R`Classical cipher suites must be removed entirely before any post-quantum mechanisms can be deployed safely.`
      ],
      correct: 0,
      explanation: R`Official solution: (a). Larger keys and messages increase latency and bandwidth usage; coexistence is possible.` },
    { id: "ex-2025-q1-xiv", type: "mc", lecture: 4, topic: "symmetric", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(xiv)", difficulty: 1,
      question: R`Which statement best describes why perfect security (e.g., One-Time Pad) is impractical for general communication?`,
      options: [
        R`Perfectly secure schemes such as One-Time Pad cannot be formally proven secure.`,
        R`Symmetric keys cannot be generated randomly in practice.`,
        R`Perfect security provides no authentication guarantees.`,
        R`They require secret keys as long as the message and must never reuse keys.`
      ],
      correct: 3,
      explanation: R`Official solution: (d). The OTP needs a key at least as long as the message and must never be reused.` },
    { id: "ex-2025-q1-xv", type: "mc", lecture: 5, topic: "public-key", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(xv)", difficulty: 2,
      question: R`What does the Decisional Diffie-Hellman (DDH) assumption state?`,
      options: [
        R`It is computationally infeasible to compute $g^{ab}$ given $g^a$ and $g^b$, with uniformly random $a,b \in \mathbb{Z}_p$.`,
        R`It is difficult to distinguish $g^{xy}$ from $g^z$ in a cyclic group for uniformly random $x,y,z \in \mathbb{Z}_p$.`,
        R`It ensures that $g^x$ and $g^y$ are indistinguishable from random strings for uniformly random $x,y \in \mathbb{Z}_p$.`,
        R`It assumes $g^x$ and $g^{xy}$ are equivalent for uniformly random $x,y \in \mathbb{Z}_p$.`
      ],
      correct: 1,
      explanation: R`Official solution: (b). DDH is the indistinguishability of $g^{xy}$ and $g^z$; computing $g^{ab}$ is CDH.` },
    { id: "ex-2025-q1-xvi", type: "mc", lecture: 4, topic: "symmetric", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(xvi)", difficulty: 2,
      question: R`Why must a cryptographic security definition explicitly describe the adversary's capabilities?`,
      options: [
        R`So that encryption keys can be automatically generated based on the adversary's strength.`,
        R`So that the adversary can be forced to attack in a predictable manner.`,
        R`To ensure the scheme remains compatible with classical and quantum attackers.`,
        R`Because the strength of the security guarantee depends on what the adversary can observe, access, or influence.`
      ],
      correct: 3,
      explanation: R`Official solution: (d). The adversarial model is part of the definition; the guarantee depends on the capabilities of the attacker.` },
    { id: "ex-2025-q1-xvii", type: "mc", lecture: 4, topic: "symmetric", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(xvii)", difficulty: 1,
      question: R`What is the purpose of defining specific security goals for a cryptographic scheme?`,
      options: [
        R`To allow cryptographers to reuse security proofs between unrelated schemes.`,
        R`To precisely state what the scheme should protect against, enabling meaningful evaluation of whether a construction meets those goals.`,
        R`To limit the adversary's ability to adapt during an attack.`,
        R`To ensure that performance is always prioritized over security.`
      ],
      correct: 1,
      explanation: R`Official solution: (b). A security goal makes the guarantee checkable and comparable.` },

    /* ================= 2024/25 — problems ================= */
    { id: "ex-2024-p2", type: "problem", lecture: 4, topic: "prfs", origin: "exam-2024",
      source: "Midterm 2024/25, Problem 2", difficulty: 3,
      title: "Customizing PRFs",
      mock: true,
      statement: R`Let $F: \{0,1\}^\lambda \times \{0,1\}^n \to \{0,1\}^n$ be a pseudorandom function. We use a slightly relaxed definition in which the input, output and key lengths need not be equal. Consider the candidate
$$F'_k(x) := F_k(0 \,\|\, x) \oplus F_k(1 \,\|\, x)$$
for $x \in \{0,1\}^{n-1}$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Explain in a few sentences your intuition whether $F'$ is also a PRF.`,
          hints: [R`The inputs $0\|x$ and $1\|x$ lie in disjoint subsets.`,
                  R`How does a truly random function behave on disjoint subsets?`],
          solution: R`$F'$ is a PRF. For a truly random function $f$, the two evaluations $f(0\|x)$ and $f(1\|x)$ are independent, because the inputs differ for every $x$ and the two input domains are disjoint. The XOR of two independent uniform values is again uniform. A reduction can query both values at the PRF oracle and XOR them.`,
          rubric: [ { points: 1, text: R`Correct intuition: $F'$ is a PRF` },
                    { points: 1, text: R`Argument via disjoint input domains / independence` } ] },
        { label: "b", points: 5,
          prompt: R`Give a formal proof by reduction to the PRF property of $F$. Analyse runtime and success probability.`,
          hints: [R`Build a distinguisher $B$ against $F$ that simulates $A$ against $F'$.`,
                  R`Answer every query $x$ with $y_0 \oplus y_1$, where $y_0$ is the answer to $0\|x$ and $y_1$ is the answer to $1\|x$.`],
          solution: R`Suppose there is a PPT distinguisher $A$ against $F'$ with non-negligible advantage $\varepsilon(\lambda)$. Construct $B$ with oracle $O$ (either $F(k,\cdot)$ or a truly random function $f$):

1. $B$ starts $A$ on $1^\lambda$.
2. For every query $x$ of $A$, $B$ queries its oracle on $0\|x$ and $1\|x$ and obtains $y_0,y_1$. It returns $y := y_0 \oplus y_1$ to $A$.
3. $A$ outputs $b'$; $B$ outputs $b'$.

**Simulation:** If $O=F(k,\cdot)$, $A$ sees exactly $F'_k(x)=F_k(0\|x)\oplus F_k(1\|x)$. If $O=f(\cdot)$ for a truly random function, then $f(0\|x)$ and $f(1\|x)$ are independent uniform for every fixed $x$, because the inputs differ. The XOR is uniform. For different $x$ the inputs involved are disjoint as well, so the answers are independent. $A$ therefore sees a truly random function.

**Runtime:** $B$ runs $A$ once and makes exactly two oracle queries per query of $A$. If $A$ is PPT, $B$ is PPT.

**Success probability:**
$$\left|\Pr[B^{F(k,\cdot)}(1^\lambda)=1] - \Pr[B^{f(\cdot)}(1^\lambda)=1]\right| = \varepsilon(\lambda).$$
This is a non-negligible advantage against $F$ — a contradiction. Hence $F'$ is a PRF.`,
          rubric: [ { points: 2, text: R`Reduction: two queries $0\|x$, $1\|x$, answer XOR` },
                    { points: 1, text: R`Simulation correct for both oracle cases` },
                    { points: 1, text: R`Runtime: two queries per query, PPT` },
                    { points: 1, text: R`Advantage equals $\varepsilon(\lambda)$ / contradiction` } ] }
      ] },
    { id: "ex-2024-p3", type: "problem", lecture: 4, topic: "signatures", origin: "exam-2024",
      source: "Midterm 2024/25, Problem 3", difficulty: 3,
      title: "Signing Large Messages",
      mock: true,
      statement: R`Let $\Sigma = (\mathrm{KGen}, \mathrm{Sign}, \mathrm{Vrfy})$ be a signature scheme for messages of length $\lambda$. Let $\langle i\rangle$ denote the $\lambda/2$-bit encoding of $i$. Define $\Sigma'$ for messages of length $\ell\lambda$ by
$$\mathrm{Sign}'(sk,m) = (\mathrm{Sign}(sk,\langle 1\rangle\|m_1),\dots,\mathrm{Sign}(sk,\langle 2\ell\rangle\|m_{2\ell})),$$
where $m = m_1\|\cdots\|m_{2\ell}$ with $|m_i| = \lambda/2$. Verification checks all $2\ell$ signatures.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Explain in a few sentences your intuition whether $\Sigma'$ is existentially unforgeable under chosen-message attack.`,
          hints: [R`Each block is signed separately.`,
                  R`Can signatures of two messages be combined?`],
          solution: R`$\Sigma'$ is **not** secure. An adversary can mount a **mix-and-match** attack: it has two messages signed and assembles a new message, which was never signed, from the block signatures. The individual block signatures remain valid because each block is signed together with its position.`,
          rubric: [ { points: 1, text: R`Correct intuition: not secure` },
                    { points: 1, text: R`Mix-and-match / combining block signatures` } ] },
        { label: "b", points: 5,
          prompt: R`Give a formal attack and analyse runtime and success probability.`,
          hints: [R`Choose two messages that differ in the first block and in at least one other block.`,
                  R`Swap the first block and its associated signature.`],
          solution: R`The adversary $A$ chooses two messages
$$m = m_1\|m_2\|\cdots\|m_{2\ell}, \qquad m' = m_1'\|m_2'\|\cdots\|m_{2\ell}'$$
with $m_1 \ne m_1'$ and $m_2 \ne m_2'$. It queries both at the signing oracle and obtains
$$s = (s_1,\dots,s_{2\ell}), \qquad s' = (s_1',\dots,s_{2\ell}').$$
Then it outputs
$$m^* = m_1'\|m_2\|\cdots\|m_{2\ell}, \qquad \sigma^* = (s_1',s_2,\dots,s_{2\ell}).$$

**Correctness:** $s_1'$ is a valid signature for $\langle 1\rangle\|m_1'$; for $i \ge 2$, $s_i$ is a valid signature for $\langle i\rangle\|m_i$. Hence $\sigma^*$ verifies for $m^*$.

**New message:** $m^* \ne m$, because $m_1' \ne m_1$. $m^* \ne m'$, because $m_2 \ne m_2'$. Hence $m^*$ was never queried.

**Runtime:** two oracle queries, no other work; $A$ is PPT.

**Success probability:** $A$ wins with probability 1 (or overwhelmingly, if one adapts the choice of blocks).`,
          rubric: [ { points: 2, text: R`Description of the adversary: two messages, swap blocks` },
                    { points: 1, text: R`Proof that $m^*$ is new` },
                    { points: 1, text: R`Runtime: two queries, PPT` },
                    { points: 1, text: R`Success probability 1 / overwhelming` } ] }
      ] },
    { id: "ex-2024-p4", type: "problem", lecture: 5, topic: "public-key", origin: "exam-2024",
      source: "Midterm 2024/25, Problem 4", difficulty: 3,
      title: "A Shared Secret Amongst Groups",
      mock: true,
      statement: R`Three parties $A,B,C$ want to compute a shared secret via DDH. The only public transcript is $([sk_A],[sk_B],[sk_C])$; all other messages travel over pairwise secure channels. The protocol:

- $A$ sends $[sk_A]$ to $B$ and $C$.
- $B$ sends $[sk_A sk_B],[sk_B]$ to $C$.
- $C$ sends $[sk_B sk_C]$ to $A$ and $[sk_A sk_C]$ to $B$.
- All of them compute $[sk_A sk_B sk_C]$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Explain intuitively whether the protocol is secure against an eavesdropper.`,
          hints: [R`The adversary only sees the three public keys.`,
                  R`Can this be reduced to a DDH tuple?`],
          solution: R`The protocol is secure. The adversary only sees $[sk_A],[sk_B],[sk_C]$ and the shared secret $[sk_A sk_B sk_C]$. Structurally this is a DDH problem with three exponents: given $[x],[y],[w]$, one must distinguish $[xyw]$ from a random group element. One can embed a DDH tuple $([x],[y],[z])$ and choose $[w]$ oneself.`,
          rubric: [ { points: 1, text: R`Intuition: secure` },
                    { points: 1, text: R`Reference to DDH / embedding a DDH tuple` } ] },
        { label: "b", points: 5,
          prompt: R`Give a formal reduction to DDH and analyse runtime and success probability.`,
          hints: [R`$B$ receives $([x],[y],[z])$.`,
                  R`Choose $w$ yourself, set $[sk_A]=[x]$, $[sk_B]=[y]$, $[sk_C]=[w]$ and the key $[z \cdot w]$.`],
          solution: R`Suppose there is a PPT adversary $A$ against the protocol with non-negligible advantage $\varepsilon(\lambda)$. Construct the DDH distinguisher $B$:

1. $B$ receives a DDH tuple $([x],[y],[z])$ (either $z=xy$ or $z$ uniform).
2. $B$ chooses $w \leftarrow \mathbb{Z}_q$.
3. $B$ sets $[sk_A] := [x]$, $[sk_B] := [y]$, $[sk_C] := [w]$ and the key $[k] := [z \cdot w]$.
4. $B$ gives $A$ the transcript $([x],[y],[w])$ and the key $[z w]$.
5. $B$ outputs $A$'s bit.

**Case $z=xy$:** $[z w] = [xyw]$ is the real shared secret; $A$ sees the real protocol.

**Case $z$ uniform:** $z w$ is uniform (for $w \ne 0$), so $[z w]$ is a uniform group element; $A$ sees the random game.

**Runtime:** $B$ samples one element, computes one multiplication and one exponentiation, and runs $A$ once; $B$ is PPT.

**Success probability:** The advantage of $B$ against DDH is exactly $\varepsilon(\lambda)$. Contradiction to the DDH assumption.`,
          rubric: [ { points: 2, text: R`Reduction: $[x],[y],[w]$ and key $[z w]$` },
                    { points: 1, text: R`Case $z=xy$: real protocol` },
                    { points: 1, text: R`Case $z$ uniform: uniform key` },
                    { points: 1, text: R`Runtime and advantage` } ] }
      ] },

    /* ================= 2025/26 — problems ================= */
    { id: "ex-2025-p2", type: "problem", lecture: 4, topic: "prfs", origin: "exam-2025",
      source: "Midterm 2025/26, Problem 2", difficulty: 3,
      title: "Pseudorandom Functions: weak and selective",
      mock: true,
      statement: R`$F$ is **selectively secure** if every PPT adversary that fixes all queries before seeing oracle outputs cannot distinguish $F(k,\cdot)$ from a random function.

$F$ is **weakly pseudorandom** if, for uniform, independent $x_1,\dots,x_q$, no PPT adversary can distinguish
$$(x_1,F(k,x_1),\dots,x_q,F(k,x_q)) \quad\text{from}\quad (x_1,f(x_1),\dots,x_q,f(x_q)).$$`,
      parts: [
        { label: "i", points: 2,
          prompt: R`Are weak PRFs a superset of selective PRFs? Prove or disprove.`,
          hints: [R`Assume that $F$ is selectively secure.`,
                  R`Turn a weak adversary into a selective one: it chooses the $x_i$ itself and queries them at the oracle.`],
          solution: R`**Yes.** Every selectively secure PRF is a weak PRF.

Let $F$ be selectively secure. Suppose there is a PPT adversary $A$ that breaks weak pseudorandomness with non-negligible advantage $\varepsilon$. Construct a selective adversary $A'$:

1. $A'$ chooses $q$ uniform, independent $x_1,\dots,x_q$ and fixes them as its queries.
2. $A'$ queries its oracle on all $x_i$ and obtains $y_i$.
3. $A'$ gives $(x_1,y_1,\dots,x_q,y_q)$ to $A$ and outputs $A$'s bit.

If the oracle is $F(k,\cdot)$, $A$ sees exactly the weak distribution with $F(k,x_i)$; if it is a truly random function, $A$ sees the weak distribution with $f(x_i)$. The advantage of $A'$ is $\varepsilon$, a contradiction to selective security. Hence $F$ is weakly pseudorandom.`,
          rubric: [ { points: 1, text: R`Answer: yes, selective ⇒ weak` },
                    { points: 1, text: R`Reduction: choose the $x_i$ oneself and query the oracle` } ] },
        { label: "ii", points: 2,
          prompt: R`Are selective PRFs a superset of weak PRFs? Prove or disprove. (Hint: what happens if one modifies a PRF $F$ and sets one output to a fixed value?)`,
          hints: [R`Construct $G$ that returns a constant output on a particular input.`,
                  R`For uniform $x_i$ this input is hit only with negligible probability.`],
          solution: R`**No.** Let $F$ be a PRF. Define
$$G(k,x) := \begin{cases} 0 & x = 0^n \\ F(k,x) & x \ne 0^n \end{cases}.$$

$G$ is **not** selectively secure: the adversary queries $x=0^n$ and checks whether the answer is 0. For $G$ it always is 0; for a truly random function only with probability $2^{-n}$.

However, $G$ is **weakly pseudorandom**: the uniform $x_i$ hit $0^n$ only with probability $q \cdot 2^{-n}$, which is negligible. Conditioned on no $x_i = 0^n$, only $F(k,x_i)$ is evaluated at uniform points, and the output is pseudorandom. Hence $G$ is weak but not selective.`,
          rubric: [ { points: 1, text: R`Answer: no, counterexample $G$` },
                    { points: 1, text: R`Reasoning: $0^n$ is hit only negligibly often under uniform queries` } ] },
        { label: "iii", points: 3,
          prompt: R`Consider the private-key CPA scheme from the lecture: $c=(r,s)=(r,F(k,r)\oplus m)$. What happens if $F$ is replaced by a **weak** PRF? Does the scheme remain secure? Justify with intuition and a proof sketch or a counterexample.`,
          hints: [R`In this scheme $F$ is only evaluated on uniform $r$.`,
                  R`That is exactly the strength of a weak PRF.`],
          solution: R`**Yes, the scheme remains CPA-secure.**

**Intuition:** In the scheme $F$ is only ever evaluated on $r$, and $r$ is chosen uniformly and freshly for every encryption. Exactly this distribution — uniform inputs — is what the weak-PRF definition covers. On uniform inputs a weak PRF is indistinguishable from a truly random function.

**Proof sketch:** Suppose there is a PPT adversary $A$ with non-negligible advantage against the scheme instantiated with a weak PRF $F$. Construct a distinguisher $B$ against the weak-PRF property:

1. $B$ simulates the CPA game for $A$: it does not choose $k$ itself but uses its weak-PRF oracle for the evaluation $F(k,r)$.
2. For every encryption query, $B$ chooses a fresh uniform $r$, queries the oracle on $r$ and computes $s=F(k,r)\oplus m$.
3. For the challenge $(m_0,m_1)$, $B$ chooses $b$ and a fresh $r$, queries the oracle and forms $c_b=(r,F(k,r)\oplus m_b)$.
4. $B$ outputs $A$'s bit.

If the oracle is the weak PRF $F(k,\cdot)$, $A$ sees the real scheme. If it is a truly random function, $F(k,r)\oplus m_b$ is a one-time pad with fresh $r$, hence information-theoretically independent of $m_b$; $A$ has no advantage. Thus the advantage of $B$ equals the advantage of $A$ — a contradiction to the weak-PRF assumption.`,
          rubric: [ { points: 1, text: R`Correct intuition: only uniform $r$` },
                    { points: 1, text: R`Reduction / simulation of the CPA game` },
                    { points: 1, text: R`OTP argument for a truly random function` } ] }
      ] },
    { id: "ex-2025-p3", type: "problem", lecture: 4, topic: "signatures", origin: "exam-2025",
      source: "Midterm 2025/26, Problem 3", difficulty: 3,
      title: "Schnorr Signatures and Bad Nonces",
      mock: true,
      statement: R`Consider the Schnorr signature scheme from the lecture: $vk=g^{sk}$, $R=g^r$, $h=H(vk,R,m)$, $s=sk\cdot h+r \pmod p$, verification $g^s=R\cdot vk^h$. Alice has a bad entropy source. For the purposes of this problem: for distinct $x,y$, $H(x)=H(y)$ only with probability $1/p$.`,
      parts: [
        { label: "a", points: 3,
          prompt: R`Alice outputs two signatures $(R,s_1)$ and $(R,s_2)$ on $m_1 \ne m_2$ with the same nonce $r$. Is this a weakness? Give the attack.`,
          hints: [R`Subtract the two signature equations.`,
                  R`When is $h_1-h_2$ invertible modulo $p$?`],
          solution: R`Yes, this is a weakness. We have
$$s_1 = sk \cdot h_1 + r, \qquad s_2 = sk \cdot h_2 + r \pmod p.$$
Hence
$$s_1-s_2 = sk(h_1-h_2) \pmod p.$$
With probability $1 - 1/p$ we have $h_1 \ne h_2$; then $h_1-h_2$ is invertible modulo the prime $p$, and
$$sk = (s_1-s_2)(h_1-h_2)^{-1} \pmod p.$$
The adversary thus learns the signing key and can sign any message.`,
          rubric: [ { points: 1, text: R`Correct intuition: yes, a weakness` },
                    { points: 2, text: R`Equation $s_1-s_2=sk(h_1-h_2)$ and computation of $sk$` } ] },
        { label: "b", points: 2,
          prompt: R`Alice tries to fix this by deriving $r \leftarrow F(k,vk)$ with a PRF $F$. Is the resulting scheme unforgeable? If yes, explain why; otherwise give an attack.`,
          hints: [R`What about $vk$ is constant across all of Alice's signatures?`],
          solution: R`No. $vk$ is constant, so $r=F(k,vk)$ is constant across all signatures as well. Hence exactly the nonce-reuse attack from (a) applies: an adversary has two different messages signed and computes $sk$ from the two signatures. The PRF property does not help, because the input never varies.`,
          rubric: [ { points: 1, text: R`Correct intuition: no` },
                    { points: 1, text: R`$vk$ constant ⇒ $r$ constant ⇒ nonce-reuse attack` } ] },
        { label: "c", points: 2,
          prompt: R`Alice tries a further strategy: she samples $s \leftarrow \mathbb{Z}_p$, publishes $h=g^s$, samples $r \leftarrow \mathbb{Z}_p$ per signature, computes $(a,b)=(g^r,h^r)$ and sets $r_1=f(a)$, $r_2=f(b)$ for an efficiently computable bijection $f:G\to\mathbb{Z}_p$. She uses $r_1$ for one signature and $r_2$ for the next. Is the scheme unforgeable? Give your intuition.`,
          hints: [R`Under DDH, $a=g^r$ and $b=h^r$ are pseudorandom.`,
                  R`$f$ is bijective, so $r_1,r_2$ become uniform when $a,b$ are pseudorandom.`],
          solution: R`Yes, the scheme is unforgeable. Under DDH, $(a,b)=(g^r,h^r)$ is pseudorandom, hence indistinguishable from two independent uniform group elements. Since $f$ is bijective, $r_1=f(a)$ and $r_2=f(b)$ are then uniform and independent in $\mathbb{Z}_p$.

The scheme is therefore computationally indistinguishable from two ordinary Schnorr signatures with fresh, uniform nonces. The standard Schnorr scheme is unforgeable under DLP; hence the tweaked version is unforgeable as well.`,
          rubric: [ { points: 1, text: R`DDH ⇒ $a,b$ pseudorandom; $f$ bijective ⇒ $r_1,r_2$ uniform` },
                    { points: 1, text: R`Indistinguishable from ordinary Schnorr ⇒ unforgeable` } ] }
      ] },
    { id: "ex-2025-p4", type: "problem", lecture: 5, topic: "public-key", origin: "exam-2025",
      source: "Midterm 2025/26, Problem 4", difficulty: 3,
      title: "A Shared Secret With Picky Parties",
      mock: true,
      statement: R`Two parties $A,B$ run DH key exchange but sample only **even** exponents:
$$x \leftarrow \mathbb{Z}_p \cap \{x \in \mathbb{Z} \mid x \equiv 0 \pmod 2\}, \qquad y \text{ analogously}.$$
$A$ sends $[x]$, $B$ sends $[y]$, and both compute $[xy]$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Explain intuitively whether the resulting protocol is secure against an eavesdropper.`,
          hints: [R`The set of allowed exponents is still large.`,
                  R`An adversary against the tweaked scheme could break the original.`],
          solution: R`Yes, the protocol is secure. The set of even exponents is large (roughly half of $\mathbb{Z}_p$). If there were an adversary against the tweaked scheme, one could apply it to the original scheme: a truly uniform exponent is even with good probability, and the distribution of even exponents makes up a large part of the original distribution. Security is therefore inherited from the DDH security of the original protocol.`,
          rubric: [ { points: 1, text: R`Intuition: secure` },
                    { points: 1, text: R`The set of even exponents is large / reduction to the original` } ] },
        { label: "b", points: 4,
          prompt: R`Give a formal proof via a DDH reduction or an attack. Analyse runtime and success probability.`,
          hints: [R`$B$ receives a DDH tuple $([x],[y],[z])$ and forwards it to $A$.`,
                  R`With probability about $1/4$, $x$ and $y$ are both even.`],
          solution: R`Suppose there is a PPT adversary $A$ against the tweaked protocol with advantage $\varepsilon(\lambda)$. Construct the DDH distinguisher $B$:

1. $B$ receives $([x],[y],[z])$.
2. $B$ forwards $([x],[y],[z])$ to $A$ as the transcript and key.
3. $B$ outputs $A$'s bit.

**Case $z=xy$:** If $x$ and $y$ are both even, this is exactly the tweaked protocol; $A$ sees the real distribution. The probability that both are even is
$$\frac{p+1}{2p} \cdot \frac{p+1}{2p} = \frac14\left(1+\frac1p\right)^2 > \frac14.$$

**Case $z$ uniform:** $[z]$ is a uniform group element; $A$ sees the random game.

**Success probability:** With probability at least $1/4$, $B$ simulates the real tweaked protocol perfectly; in the remaining cases $A$ has no advantage (resp. the contribution is $\tfrac12$). Hence the advantage of $B$ is at least
$$\frac14\left(\frac12+\varepsilon\right) + \frac34\cdot\frac12 - \frac12 = \frac{\varepsilon}{4},$$
which is not negligible. **Runtime:** $B$ only runs $A$ and forwards elements; $B$ is PPT. Contradiction to the DDH assumption.

**Caveat:** this is the official solution's argument, and it is informal at this point. $B$ cannot detect whether $x$ and $y$ are even, because parity is not a group invariant ($g^x = g^{x+p}$). The claim that $A$ has no advantage on the remaining transcripts is therefore not derived from DDH alone. A fully rigorous proof would need a restricted-exponent DDH assumption or a different embedding. For the exam, the intended answer is “secure” with the reduction above; if you are asked for full rigour, state this caveat.`,
          rubric: [ { points: 1, text: R`Reduction: forward the DDH tuple` },
                    { points: 1, text: R`Case $z=xy$: real protocol for even exponents` },
                    { points: 1, text: R`Probability $>1/4$ that both are even` },
                    { points: 1, text: R`Advantage $\varepsilon/4$ and runtime` } ] },
        { label: "c", points: 1,
          prompt: R`Now let $p \equiv -1 \pmod c$ for a small constant $c$. $A$ and $B$ sample from $S = \mathbb{Z}_p \cap \{x \in \mathbb{Z} \mid x \equiv 0 \pmod{(p+1)/c}\}$. Is the scheme secure? Explain your intuition.`,
          hints: [R`How large is $S$?`,
                  R`What can an adversary do if the set has only $O(c)$ elements?`],
          solution: R`No, the scheme is not secure. From $p \equiv -1 \pmod c$ it follows that $c \mid (p+1)$. The set $S$ consists of the multiples of $(p+1)/c$ in $\mathbb{Z}_p$: these are $0, (p+1)/c, \dots, (c-1)(p+1)/c$, so exactly $|S| = c$ values. Since $c$ is constant, an adversary can simply guess $x$ and $y$; the success probability is at least $1/c^2$, which is not negligible. It can therefore compute the shared secret $[xy]$.

The official solution gives the loose upper bound $|S| \le c(p+1)/p = c(1+1/p)$; the exact count is $c$. Either way, $|S|$ is constant and the exponents are guessable.`,
          rubric: [ { points: 1, text: R`No; $|S| = c$, exponents guessable` } ] }
      ] }
  );
})();
