/* Unit 6 — TLS & Hybrid Encryption
 * Sources: Lecture VI (TLS) and the Hybrid-Encryption proof deck.
 */
(function () {
  const R = String.raw;
  const add = (...items) => (window.TRAINER_BANK = window.TRAINER_BANK || []).push(...items);

  add(
    /* ---------------- notes ---------------- */
    { id: "u6-note-tls", type: "note", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slides 4–18", difficulty: 2,
      title: "TLS: Handshake, Record Protocol and the Cryptographic Building Blocks",
      order: 10,
      body: R`### What TLS is

**TLS** (RFC 8446) is a protocol for secure communication over a computer network. It encrypts data and ensures **confidentiality**, **integrity** and **authentication**.

Why TLS:

- **Confidentiality:** no eavesdropping on sensitive information during transmission.
- **Integrity:** data is not modified in transit.
- **Authentication:** the identity of the communicating parties is verified; no impersonation or man-in-the-middle attack.

### History

| Year | Version | RFC |
| --- | --- | --- |
| 1994 | SSL 2 (Netscape) | — |
| 1995 | SSL 3 | — |
| 1999 | TLS 1.0 | RFC 2246 |
| 2006 | TLS 1.1 | RFC 4346 |
| 2008 | TLS 1.2 | RFC 5246 |
| 2018 | TLS 1.3 | RFC 8446 |

### Structure: Handshake + Record

**TLS Handshake:**

- authentication of the parties
- negotiation of the cryptographic modes and parameters
- establishment of a shared key

**TLS Record:**

- uses the negotiated parameters
- protects all traffic between the peers

### Handshake (TLS 1.3)

Sequence:

- **ClientHello:** among others [[key_share]], [[signature_algorithms]], [[psk_key_exchange_modes]], [[pre_shared_key]]
- **ServerHello:** [[key_share]], [[pre_shared_key]]
- **Server Params** (encrypted from here on): [[{EncryptedExtensions}]], [[{CertificateRequest}]]
- **ServerAuth:** [[{Certificate*}]] → [[{CertificateVerify*}]] → [[{Finished}]]
- **ClientAuth:** [[{Certificate*}]] → [[{CertificateVerify*}]] → [[{Finished}]]

Here [[*]] means optional and [[{…}]] means encrypted.

**Security design:** The handshake is resistant to tampering — an active attacker must not be able to force the peers to use parameters other than the intended ones (**no downgrade**). Mutual authentication is optionally possible.

### Cryptographic core

1. **Key exchange (ephemeral DH):**
   - Client: $x \leftarrow \mathbb{Z}_p$, sends $g^x$.
   - Server: $y \leftarrow \mathbb{Z}_p$, sends $g^y$.
   - Both: $ss \leftarrow g^{xy}$.
2. **Key derivation:** $K, K', K'', K''' \leftarrow \mathrm{KDF}(ss)$ — several directional keys are derived from one DH secret.
3. **ServerAuth:** $\sigma \leftarrow \mathrm{Sign}(sk_S, \mathrm{transcript})$, then
$$c_S \leftarrow \mathrm{AEAD}(K, \mathrm{cert}[pk_S], \sigma, \mathrm{keyconfirm}_S).$$
4. The server encrypts the certificate and the signature over the transcript. The signature thus binds all handshake messages seen so far.
5. The client decrypts $c_S$, checks $\mathrm{Vrfy}(pk_S,\sigma,\mathrm{transcript})$ and the key-confirmation value.
6. **ClientAuth:** $c_C \leftarrow \mathrm{AEAD}(K'', \mathrm{keyconfirm}_C)$.

The four separate keys $K,K',K'',K'''$ prevent a key from being used in both directions or for two purposes.

### Record Protocol

- Splits traffic into a series of **records**; each is protected independently with the traffic keys.
- Confidentiality + integrity per record (encryption + authentication).
- **Record header:** content type, version, length.
- **Fragment:** at most $2^{14}$ bytes (= 16 KB).
- **MAC:** contains the **sequence number** — prevents reordering and replay.
- Each record is transmitted as $\mathrm{Encrypted}(\mathrm{data} \,\|\, \mathrm{MAC})$ with a record header.

### Cryptographic building blocks

| Primitive | Construction | Guarantee |
| --- | --- | --- |
| AEAD | AES-GCM, AES-CCM, ChaCha20-Poly1305 | message indistinguishability, integrity |
| Signature algorithm | RSA (PKCS, PSS), EdDSA | authentication, integrity |
| Key derivation function | HKDF (built on hash functions), HMAC | key indistinguishability |

**Important:** AES alone is a block cipher and not CPA-secure. It achieves CPA security only in a suitable mode of operation: CBC with a random IV, CTR or authenticated modes such as GCM.`
    },
    { id: "u6-note-attacks", type: "note", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slides 18–25", difficulty: 2,
      title: "Attacks on TLS, Heartbleed and HSTS",
      order: 20,
      body: R`### Attacks

- **Man-in-the-middle (MitM):** the attacker intercepts communication and modifies it.
- **Downgrade attacks:** force older, weaker protocols (e.g. SSL 3.0).
- **Heartbleed:** implementation bug in OpenSSL, data leak.
- **RC4:** originally intended as a stream cipher against CBC attacks, but statistical biases in the keystream allow **partial plaintext recovery** even over HTTPS ⇒ banned in modern TLS versions.
- **TLS stripping:** downgrade from HTTPS to HTTP.

### Countermeasures

- enforce modern versions (TLS 1.2 or 1.3),
- **certificate pinning:** only a known certificate is accepted,
- **HSTS (Strict Transport Security):** enforce HTTPS,
- keep libraries up to date.

### Heartbleed

- Critical vulnerability in **OpenSSL**, discovered in **April 2014**; affected 1.0.1 through 1.0.1f.
- Attackers could read up to **64 KB of memory** of a connected server/client — private keys, passwords, session tokens.
- Slide estimate: around 17% of TLS servers affected.
- The name comes from the TLS **heartbeat** extension.

**Mechanism:** Heartbeat requests (RFC 6520) send a payload plus its length. Vulnerable OpenSSL versions did not validate the length and replied with more bytes than requested.

**Exploit:** Request with 1 byte of payload but a claimed length of 64 KB → the server sends back up to 64 KB of adjacent RAM.

**Fix:** Update to 1.0.1g or later, then regenerate private keys and reissue certificates (the old keys are considered compromised).

**Why this is bad in the long run:** A leaked private key allows **retroactive decryption** of recorded sessions that had **no forward secrecy**. With TLS 1.3 and ephemeral DH, a static key leaked later does not help for past sessions.

### HSTS

HSTS is a security feature: the server header instructs the browser to contact the domain only over HTTPS. It prevents **downgrade/TLS stripping** but does **not** protect against Heartbleed or against a compromised server.

### Why a TLS security proof is hard

- **Complexity:** handshake, record and key derivation are tightly intertwined.
- **Implementation variance:** subtle differences create unforeseen gaps; model ≠ practice.
- **Diverse goals:** authentication, confidentiality, forward secrecy and tamper resistance at the same time.
- **Active attacker:** MitM resistance requires stronger proofs.
- **Backward compatibility:** compatibility features increase complexity.
- **Several assumptions:** secure AEAD, secure key exchange, secure signatures — all of them must hold.

### Security proofs ≠ practice

A proof shows security in a **model**. Real systems have side channels, implementation bugs and protocol interactions that do not occur in the model. This is why formal proofs do not prevent real attacks such as Heartbleed.`
    },
    { id: "u6-note-hybrid", type: "note", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slides 26–38; Lecture VI – Hybrid Encryption, slides 2–12", difficulty: 3,
      title: "Hybrid Encryption: Construction, Ciphertext Entanglement and Proof",
      order: 30,
      body: R`### Idea

Public-key crypto only transports a key; the data is encrypted with symmetric crypto. This is fast and avoids the cost of public-key operations for bulk data.

### Building blocks

- $\Pi_{EG} = (\mathrm{KGen}_{EG}, \mathrm{Enc}_{EG}, \mathrm{Dec}_{EG})$: ElGamal over a cyclic group $G$ of prime order $q$ with generator $g$. $\mathrm{Enc}_{EG}(pk,M) = \langle [y], h^y \cdot M\rangle$ with $y \leftarrow \mathbb{Z}_q$, $pk = h = [x]$, $M \in G$.
- $\Pi_S = (\mathrm{Gen}_S, \mathrm{Enc}_S, \mathrm{Dec}_S)$: CPA-secure symmetric scheme (e.g. AES-GCM). For simplicity, $\mathrm{Gen}_S$ samples a key $K \leftarrow G$; in practice $K$ is mapped to an AES key via a KDF.

**Advantage:**
$$\mathrm{Adv}^{pub}_{A,\Pi} := \left|\Pr[\mathrm{PubK}^{cpa}_{A,\Pi}(\lambda)=1] - \tfrac12\right|, \qquad \mathrm{Adv}^{priv}_{A,\Pi'} := \left|\Pr[\mathrm{PrivK}^{cpa}_{A,\Pi'}(\lambda)=1] - \tfrac12\right|.$$

### Construction

| $\mathrm{KGen}_{Hyb}(\lambda)$ | $\mathrm{Enc}_{Hyb}(pk,m)$ | $\mathrm{Dec}_{Hyb}(sk,\langle c_1,c_2,c\rangle)$ |
| --- | --- | --- |
| $(sk,pk) \leftarrow \mathrm{KGen}_{EG}(1^\lambda)$ | $K \leftarrow G$ | $K := c_2 / c_1^{sk}$ |
| return $(sk,pk)$ | $y \leftarrow \mathbb{Z}_q$ | $m := \mathrm{Dec}_S(K,c)$ |
| | $\langle c_1,c_2\rangle := \langle [y], pk^y \cdot K\rangle$ | return $m$ |
| | $c \leftarrow \mathrm{Enc}_S(K,m)$ | |
| | return $\langle c_1,c_2,c\rangle$ | |

$\langle c_1,c_2\rangle = \mathrm{Enc}_{EG}(pk,K)$ encapsulates the key $K$; $c$ encrypts $m$ under $K$.

### Theorem

If $\Pi_{EG}$ and $\Pi_S$ are CPA-secure, then $\Pi_{Hyb}$ is CPA-secure. More precisely: for every PPT attacker $A$ there exist PPT attackers $B_{EG}$ and $B_S$ such that
$$\mathrm{Adv}^{pub}_{A,\Pi_{Hyb}} \le 2 \cdot \mathrm{Adv}^{pub}_{B_{EG},\Pi_{EG}} + \mathrm{Adv}^{priv}_{B_S,\Pi_S}.$$

### Why not a single reduction to $\Pi_S$?

In the real ciphertext $\langle [y], pk^y \cdot K, \mathrm{Enc}_S(K,m_b)\rangle$, $K$ appears **twice**. A reduction to the CPA security of $\Pi_S$ does not know the challenge key $K$ and cannot compute $pk^y \cdot K$. Therefore:

1. Replace the encapsulated key by an **independent** key (game hop, reduction to $\Pi_{EG}$).
2. Then reduce to $\Pi_S$.

### Game hopping

**$G_0$** is the CPA game of $\Pi_{Hyb}$:

- $(sk,pk) \leftarrow \mathrm{KGen}_{EG}$
- $(m_0,m_1) \leftarrow A(pk)$
- $b \leftarrow \{0,1\}$
- $K_0 \leftarrow G$, $y \leftarrow \mathbb{Z}_q$
- $\langle c_1,c_2\rangle := \langle [y], pk^y \cdot K_0\rangle$
- $c \leftarrow \mathrm{Enc}_S(K_0,m_b)$
- $b' \leftarrow A(\langle c_1,c_2,c\rangle)$

**$G_1$:** Additionally $K_1 \leftarrow G$; $\langle c_1,c_2\rangle := \langle [y], pk^y \cdot K_1\rangle$. The key in the ciphertext is independent of the key in $c$.

**Step 1:** $B_{EG}$ simulates $G_0$ or $G_1$ with its ElGamal challenge. It chooses $K_0,K_1$, sends $(K_0,K_1)$ as the challenge, receives $\langle c_1,c_2\rangle = \mathrm{Enc}_{EG}(pk,K_\beta)$, chooses $b$, computes $c \leftarrow \mathrm{Enc}_S(K_0,m_b)$, and outputs $0$ if $A$ guessed its own challenge bit correctly and $1$ otherwise. For $\beta=0$ $A$ sees $G_0$, for $\beta=1$ $G_1$. Hence
$$\left|\Pr[G_0=1] - \Pr[G_1=1]\right| = 2 \cdot \mathrm{Adv}^{pub}_{B_{EG},\Pi_{EG}}.$$

**Step 2:** $B_S$ simulates $G_1$ with its symmetric CPA challenge. It generates $(sk,pk)$, sends $(m_0,m_1)$ to the challenger, receives $c = \mathrm{Enc}_S(K,m_\beta)$, chooses $K_1,y$ and computes $\langle c_1,c_2\rangle := \langle [y], pk^y \cdot K_1\rangle$. $A$ sees $G_1$; $B_S$ wins exactly when $A$ wins:
$$\Pr[G_1=1] - \tfrac12 = \mathrm{Adv}^{priv}_{B_S,\Pi_S}.$$

**Together:**
$$\mathrm{Adv}^{pub}_{A,\Pi_{Hyb}} = \left|\Pr[G_0=1] - \tfrac12\right| \le \left|\Pr[G_0=1]-\Pr[G_1=1]\right| + \left|\Pr[G_1=1]-\tfrac12\right| = 2 \cdot \mathrm{Adv}^{pub}_{B_{EG},\Pi_{EG}} + \mathrm{Adv}^{priv}_{B_S,\Pi_S}.$$

If both advantages are negligible, the sum is negligible ⇒ hybrid encryption is CPA-secure.

### Relation to TLS

The proof explains only a **small part** of the TLS protocol. A complete TLS proof is highly technical and not part of the lecture. What matters is the pattern: **game hopping + one reduction per hop + triangle inequality**.`
    },

    /* ---------------- cards ---------------- */
    { id: "u6-card-tls-goals", type: "card", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slides 4–5", difficulty: 1,
      front: R`Which three security goals does TLS provide?`,
      back: R`**Confidentiality** (no eavesdropping), **integrity** (no modification) and **authentication** (identity of the parties, no MitM).` },
    { id: "u6-card-tls-parts", type: "card", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slide 7", difficulty: 1,
      front: R`Which two parts does TLS consist of?`,
      back: R`The **handshake** (authentication, negotiation of parameters, key establishment) and the **record protocol** (protects the traffic with the negotiated parameters).` },
    { id: "u6-card-history", type: "card", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slide 6", difficulty: 1,
      front: R`Name the TLS versions and their years.`,
      back: R`SSL 2 (1994), SSL 3 (1995), TLS 1.0 (1999), TLS 1.1 (2006), TLS 1.2 (2008), TLS 1.3 (2018).` },
    { id: "u6-card-handshake", type: "card", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slides 9–11", difficulty: 2,
      front: R`What are the tasks of the TLS handshake?`,
      back: R`Authenticate the parties, negotiate cryptographic modes and parameters, establish shared keying material. It is designed against tampering/downgrade.` },
    { id: "u6-card-tls13-keys", type: "card", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slide 11", difficulty: 2,
      front: R`How are the TLS 1.3 traffic keys created?`,
      back: R`From the ephemeral DH secret $ss=g^{xy}$, four keys are derived via a KDF: $K,K',K'',K'''$. They separate directions and purposes.` },
    { id: "u6-card-serverauth", type: "card", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slide 11", difficulty: 2,
      front: R`What does the server sign in the TLS 1.3 handshake?`,
      back: R`The **transcript** of all handshake messages so far. Certificate and signature are encrypted with AEAD under $K$.` },
    { id: "u6-card-forward-secrecy", type: "card", lecture: 6, topic: "tls", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(xvi)", difficulty: 2,
      front: R`How does TLS 1.3 achieve forward secrecy?`,
      back: R`Through **ephemeral** key-exchange mechanisms (e.g. ephemeral DH). There are no static RSA keys; a long-term key leaked later does not help for past sessions.` },
    { id: "u6-card-record", type: "card", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slides 13–14", difficulty: 2,
      front: R`What does the TLS record protocol do?`,
      back: R`It splits traffic into records, protects each independently with the traffic keys (confidentiality + integrity) and transmits header (content type, version, length) plus encrypted data and MAC.` },
    { id: "u6-card-fragment", type: "card", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slide 14", difficulty: 1,
      front: R`What is the maximum size of a TLS fragment?`,
      back: R`$2^{14}$ bytes = 16 KB.` },
    { id: "u6-card-mac-seq", type: "card", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slide 14", difficulty: 1,
      front: R`Why does the TLS MAC contain the sequence number?`,
      back: R`To prevent reordering and replay of records; each record is bound to its position in the sequence.` },
    { id: "u6-card-aead", type: "card", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slide 16", difficulty: 1,
      front: R`Name three AEAD constructions from TLS 1.3 and their guarantee.`,
      back: R`AES-GCM, AES-CCM and ChaCha20-Poly1305. They provide message indistinguishability and integrity (confidentiality + authenticity).` },
    { id: "u6-card-rc4", type: "card", lecture: 6, topic: "tls", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(iv)", difficulty: 2,
      front: R`Why was RC4 banned in modern TLS versions?`,
      back: R`Practical attacks exploit statistical biases in the RC4 keystream and allow **partial plaintext recovery** even over HTTPS.` },
    { id: "u6-card-heartbleed", type: "card", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slides 20–22", difficulty: 2,
      front: R`What was Heartbleed?`,
      back: R`An OpenSSL bug (2014, versions 1.0.1–1.0.1f): the heartbeat extension did not validate the length. A request with a small payload and a large claimed length made the server return up to 64 KB of RAM — including private keys and tokens.` },
    { id: "u6-card-heartbleed-fix", type: "card", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slide 22", difficulty: 2,
      front: R`What must be done after Heartbleed?`,
      back: R`Update to OpenSSL 1.0.1g+, **regenerate private keys** and reissue certificates; the old keys are considered compromised.` },
    { id: "u6-card-hsts", type: "card", lecture: 6, topic: "tls", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(viii)", difficulty: 1,
      front: R`What is the role of HSTS?`,
      back: R`HSTS enforces HTTPS connections and prevents downgrade/TLS-stripping attacks. It does not protect against Heartbleed.` },
    { id: "u6-card-hybrid", type: "card", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slides 26–27", difficulty: 2,
      front: R`How does hybrid encryption work in TLS?`,
      back: R`Public-key crypto (ElGamal) encapsulates a random symmetric key $K$; the data is encrypted with $K$ using AES. The public-key part is expensive, the symmetric part fast.` },
    { id: "u6-card-entanglement", type: "card", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slide 28", difficulty: 2,
      front: R`What is the ciphertext entanglement problem?`,
      back: R`$K$ appears both in the ElGamal part $\langle c_1,c_2\rangle$ and as the key of $c$. A reduction to the CPA security of AES does not know $K$ and cannot compute $pk^y \cdot K$. Therefore one first needs a game hop with an independent $K'$.` },
    { id: "u6-card-hybrid-bound", type: "card", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI – Hybrid Encryption, slide 4", difficulty: 3,
      front: R`What is the advantage bound for hybrid encryption?`,
      back: R`$\mathrm{Adv}^{pub}_{A,\Pi_{Hyb}} \le 2 \cdot \mathrm{Adv}^{pub}_{B_{EG},\Pi_{EG}} + \mathrm{Adv}^{priv}_{B_S,\Pi_S}$. Two reductions: ElGamal CPA for the key hop, symmetric CPA for the second hop.` },
    { id: "u6-card-shor", type: "card", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slide 43", difficulty: 2,
      front: R`What does Shor's algorithm break?`,
      back: R`It factors large numbers and computes discrete logarithms in polynomial time. It therefore breaks RSA, DDH, CDH and DLog — i.e. key exchange and authentication in TLS (RSA/ECC).` },
    { id: "u6-card-grover", type: "card", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slide 44", difficulty: 2,
      front: R`What does Grover's algorithm do to symmetric crypto?`,
      back: R`It gives a quadratic speedup for unstructured search and thus halves the effective keyspace. Larger symmetric keys are needed; hash-based MACs are affected as well.` },
    { id: "u6-card-kemtls", type: "card", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slide 46", difficulty: 2,
      front: R`How does KEMTLS work?`,
      back: R`It replaces RSA/ECC with quantum-resistant KEMs (Kyber, NTRU) and authenticates via the KEM instead of via quantum-broken signatures. Larger symmetric keys address Grover.` },

    /* ---------------- true / false ---------------- */
    { id: "u6-tf-tls-goals", type: "tf", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slides 4–5", difficulty: 1,
      statement: R`TLS provides confidentiality, integrity and authentication.`,
      answer: true,
      explanation: R`These are the three central security goals from the definition and the motivation.` },
    { id: "u6-tf-handshake-record", type: "tf", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slide 7", difficulty: 1,
      statement: R`The TLS handshake encrypts the application data, and the record protocol negotiates the algorithms.`,
      answer: false,
      explanation: R`It is the other way round: the handshake authenticates, negotiates and establishes keys; the record protocol protects the application data.` },
    { id: "u6-tf-forward-secrecy", type: "tf", lecture: 6, topic: "tls", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(xvi)", difficulty: 2,
      statement: R`TLS 1.3 achieves forward secrecy through exclusively ephemeral key-exchange mechanisms.`,
      answer: true,
      explanation: R`The official solution is (c). Static RSA for key exchange no longer exists in TLS 1.3.` },
    { id: "u6-tf-record-integrity", type: "tf", lecture: 6, topic: "tls", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(xviii)", difficulty: 1,
      statement: R`TLS achieves message integrity in the record protocol through authenticated encryption (AEAD).`,
      answer: true,
      explanation: R`The official solution is (a). AEAD provides confidentiality and integrity.` },
    { id: "u6-tf-aes", type: "tf", lecture: 6, topic: "tls", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(xvii)", difficulty: 1,
      statement: R`AES is already CPA-secure in its default mode.`,
      answer: false,
      explanation: R`AES is a block cipher; CPA security requires a mode of operation (CBC with a random IV, CTR, GCM).` },
    { id: "u6-tf-heartbleed", type: "tf", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slides 20–22", difficulty: 2,
      statement: R`Heartbleed allowed reading up to 64 KB of server or client memory.`,
      answer: true,
      explanation: R`The missing length validation of the heartbeat extension allowed responses with up to 64 KB of adjacent RAM.` },
    { id: "u6-tf-heartbleed-retro", type: "tf", lecture: 6, topic: "tls", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(vi)", difficulty: 2,
      statement: R`A private key leaked through Heartbleed can enable retroactive decryption of past TLS sessions without forward secrecy.`,
      answer: true,
      explanation: R`The official solution is (b). Without forward secrecy the session depends on the long-term key.` },
    { id: "u6-tf-hsts", type: "tf", lecture: 6, topic: "tls", origin: "variant",
      source: "Variant of Lecture VI, slide 18", difficulty: 2,
      statement: R`HSTS also protects against Heartbleed.`,
      answer: false,
      explanation: R`HSTS enforces HTTPS and prevents downgrade/stripping, but not a memory-leak bug in OpenSSL.` },
    { id: "u6-tf-rc4", type: "tf", lecture: 6, topic: "tls", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(iv)", difficulty: 2,
      statement: R`RC4 was banned because statistical biases in the keystream allow partial plaintext recovery.`,
      answer: true,
      explanation: R`The official solution is (a). RC4 was originally seen as a way out of CBC attacks, but turned out to be attackable itself.` },
    { id: "u6-tf-hybrid", type: "tf", lecture: 6, topic: "tls", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(xi)", difficulty: 1,
      statement: R`Hybrid encryption is used because public-key operations are more expensive than symmetric ones and therefore protect only the key.`,
      answer: true,
      explanation: R`The official solution is (b). Public-key crypto encapsulates the symmetric key; the data is encrypted with symmetric crypto.` },
    { id: "u6-tf-hybrid-proof", type: "tf", lecture: 6, topic: "tls", origin: "variant",
      source: "Variant of Lecture VI – Hybrid Encryption, slides 5–11", difficulty: 3,
      statement: R`In the hybrid-encryption proof, a single reduction to the CPA security of AES is sufficient.`,
      answer: false,
      explanation: R`Because of ciphertext entanglement one first needs a game hop to an independent key (reduction to ElGamal), then the reduction to symmetric CPA security.` },
    { id: "u6-tf-shor", type: "tf", lecture: 6, topic: "tls", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(xix)", difficulty: 1,
      statement: R`Shor's algorithm threatens TLS because it factors large numbers and computes discrete logarithms.`,
      answer: true,
      explanation: R`The official solution is (c). RSA and ECC are broken by it.` },
    { id: "u6-tf-pq-latency", type: "tf", lecture: 6, topic: "tls", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(ix)", difficulty: 2,
      statement: R`Post-quantum key exchange can increase handshake latency because keys and messages are larger.`,
      answer: true,
      explanation: R`The official solution is (a). Larger key/message sizes burden the network and latency.` },

    /* ---------------- multiple choice ---------------- */
    { id: "u6-mc-tls-def", type: "mc", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slide 4", difficulty: 1,
      question: R`What is TLS?`,
      options: [
        R`A protocol for secure communication that provides confidentiality, integrity and authentication.`,
        R`A hash function for passwords.`,
        R`A symmetric encryption scheme.`,
        R`A DNS resolver.`
      ],
      correct: 0,
      explanation: R`TLS is a protocol that combines several cryptographic building blocks.` },
    { id: "u6-mc-record", type: "mc", lecture: 6, topic: "tls", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(xv)", difficulty: 1,
      question: R`What is the primary task of the TLS record protocol?`,
      options: [
        R`Negotiate cryptographic algorithms`,
        R`Establish a shared secret`,
        R`Encrypt and authenticate application data`,
        R`Provide forward secrecy during the key exchange`
      ],
      correct: 2,
      explanation: R`The official solution is (c). Negotiation and key establishment are handshake tasks.` },
    { id: "u6-mc-aead", type: "mc", lecture: 6, topic: "tls", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(v)", difficulty: 1,
      question: R`What is the meaning of AEAD in TLS 1.3?`,
      options: [
        R`It replaces the need for public-key encryption.`,
        R`It provides both confidentiality and integrity for transmitted data.`,
        R`It achieves post-quantum security because it is immune to Shor's algorithm.`,
        R`It provides integrity, but not confidentiality.`
      ],
      correct: 1,
      explanation: R`The official solution is (b). AEAD = authenticated encryption with associated data.` },
    { id: "u6-mc-rc4", type: "mc", lecture: 6, topic: "tls", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(iv)", difficulty: 2,
      question: R`Why was RC4 banned in modern TLS versions?`,
      options: [
        R`Because practical attacks exploit statistical biases in the keystream and enable partial plaintext recovery.`,
        R`Because RC4 requires longer keys than TLS allows.`,
        R`Because RC4 cannot be combined with server authentication.`,
        R`Because RC4 ciphertexts are incompatible with session resumption.`
      ],
      correct: 0,
      explanation: R`The official solution is (a).` },
    { id: "u6-mc-heartbleed", type: "mc", lecture: 6, topic: "tls", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(vi)", difficulty: 2,
      question: R`Why was Heartbleed a severe threat to long-term TLS security?`,
      options: [
        R`Because it completely bypassed certificate validation and forged every server identity.`,
        R`Because leaked memory could contain private keys and thus enabled retroactive decryption of sessions without forward secrecy.`,
        R`Because it changed the server's cipher-suite preferences.`,
        R`Because it injected code into the OpenSSL library.`
      ],
      correct: 1,
      explanation: R`The official solution is (b). The core is the key leak and the lack of forward secrecy.` },
    { id: "u6-mc-hsts", type: "mc", lecture: 6, topic: "tls", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(viii)", difficulty: 1,
      question: R`What is the role of HSTS in TLS security?`,
      options: [
        R`It validates certificates during the handshake.`,
        R`It encrypts session cookies.`,
        R`It enforces HTTPS connections and prevents downgrade attacks.`,
        R`It prevents Heartbleed memory leaks.`
      ],
      correct: 2,
      explanation: R`The official solution is (c).` },
    { id: "u6-mc-hybrid", type: "mc", lecture: 6, topic: "tls", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(x)", difficulty: 1,
      question: R`Why does TLS use a hybrid of asymmetric and symmetric cryptography?`,
      options: [
        R`Because together they automatically give twice the security level.`,
        R`Because symmetric encryption alone cannot authenticate the server, and asymmetric alone would be too slow for bulk data.`,
        R`Because symmetric keys cannot be generated securely without RSA.`,
        R`Because asymmetric encryption is only secure with at least one symmetric cipher.`
      ],
      correct: 1,
      explanation: R`The official solution is (b). Asymmetric for key/authentication, symmetric for the data.` },
    { id: "u6-mc-hybrid-why", type: "mc", lecture: 6, topic: "tls", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(xi)", difficulty: 1,
      question: R`Why is hybrid encryption preferred over pure public-key encryption?`,
      options: [
        R`Because symmetric encryption is more easily quantum-resistant.`,
        R`Because public-key operations are more expensive and therefore protect only the symmetric key.`,
        R`Because public-key operations are more expensive and therefore protect only a small part of the message.`,
        R`Because the combination is automatically more secure.`
      ],
      correct: 1,
      explanation: R`The official solution is (b). The public-key part encapsulates the key, not the data.` },
    { id: "u6-mc-pq-shor", type: "mc", lecture: 6, topic: "tls", origin: "variant",
      source: "Variant of Lecture VI, slides 42–46", difficulty: 2,
      question: R`Which TLS building blocks does Shor's algorithm break?`,
      options: [
        R`Only AES`,
        R`RSA, ECC, DDH, CDH and DLog`,
        R`Only hash functions`,
        R`Only HSTS`
      ],
      correct: 1,
      explanation: R`Shor factors and computes discrete logarithms; that breaks the public-key building blocks. AES is weakened by Grover, not broken by Shor.` },
    { id: "u6-mc-pq-grover", type: "mc", lecture: 6, topic: "tls", origin: "variant",
      source: "Variant of Lecture VI, slide 44", difficulty: 2,
      question: R`What follows from Grover's quadratic speedup for symmetric encryption?`,
      options: [
        R`The effective keyspace is halved; larger keys are needed.`,
        R`Symmetric encryption is completely broken.`,
        R`AES is immune to quantum computers.`,
        R`Hash functions are no longer needed.`
      ],
      correct: 0,
      explanation: R`Grover halves the effective security level; larger keys compensate for that.` },
    { id: "u6-mc-pq-kem", type: "mc", lecture: 6, topic: "tls", origin: "variant",
      source: "Variant of Lecture VI, slide 46", difficulty: 2,
      question: R`What is the idea of KEMTLS?`,
      options: [
        R`It replaces TLS with a purely symmetric protocol.`,
        R`It replaces RSA/ECC with quantum-resistant KEMs and authenticates via the KEM instead of via signatures.`,
        R`It only doubles the AES key length.`,
        R`It switches off forward secrecy.`
      ],
      correct: 1,
      explanation: R`KEMTLS uses Kyber/NTRU-style KEMs and avoids quantum-broken signatures.` },
    { id: "u6-mc-tls-proof", type: "mc", lecture: 6, topic: "tls", origin: "exam-2025",
      source: "Midterm 2025/26, Q1(vii)", difficulty: 1,
      question: R`Why do security proofs for cryptographic protocols often not prevent real attacks?`,
      options: [
        R`Because proofs always assume that attackers have unlimited computational power.`,
        R`Because proofs typically argue over idealized models and assumptions, while real systems have side channels, implementation bugs and protocol interactions.`,
        R`Because real attackers only use social engineering.`,
        R`Because proofs only apply to symmetric schemes.`
      ],
      correct: 1,
      explanation: R`The official solution is (b). Model ≠ practice.` },
    { id: "u6-mc-hybrid-entanglement", type: "mc", lecture: 6, topic: "tls", origin: "variant",
      source: "Variant of Lecture VI, slide 28", difficulty: 3,
      question: R`Why is a single reduction to the CPA security of AES not enough for hybrid encryption?`,
      options: [
        R`Because AES is not CPA-secure.`,
        R`Because the key $K$ appears both in the ElGamal part and in $c$, and the reduction does not know $K$.`,
        R`Because ElGamal is not correct.`,
        R`Because the ElGamal part uses no randomness.`
      ],
      correct: 1,
      explanation: R`Ciphertext entanglement prevents a well-formed challenge; one first needs a game hop with an independent key.` },

    /* ---------------- gaps ---------------- */
    { id: "u6-gap-tls", type: "gap", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slides 4–14", difficulty: 2,
      title: "TLS", points: 5,
      text: R`**TLS** is a protocol for secure communication and ensures <gap>confidentiality, integrity and authentication</gap>. It consists of the <gap>handshake</gap> and the <gap>record protocol</gap>. The handshake authenticates the parties, negotiates the parameters and establishes <gap>shared keying material</gap>. The record protocol splits traffic into records and protects each with <gap>the traffic keys</gap>.`,
      note: R`A TLS fragment is at most $2^{14}$ bytes = 16 KB; the MAC contains the sequence number.` },
    { id: "u6-gap-hybrid", type: "gap", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slides 26–30; Lecture VI – Hybrid Encryption, slides 3–4", difficulty: 3,
      title: "Hybrid Encryption", points: 5,
      text: R`In hybrid encryption a random symmetric key $K$ is encapsulated with <gap>ElGamal</gap>: $\langle c_1,c_2\rangle = \langle [y], pk^y \cdot K\rangle$. The message is encrypted with <gap>$\mathrm{Enc}_S(K,m)$</gap>. The problem is <gap>ciphertext entanglement</gap>: $K$ appears twice, and a reduction to $\Pi_S$ does not know $K$. Therefore one first replaces $K$ by <gap>an independent key $K'$</gap> (game hop, reduction to ElGamal) and then reduces to <gap>the CPA security of $\Pi_S$</gap>.`,
      note: R`The bound is $\mathrm{Adv}^{pub}_{A,\Pi_{Hyb}} \le 2 \cdot \mathrm{Adv}^{pub}_{B_{EG},\Pi_{EG}} + \mathrm{Adv}^{priv}_{B_S,\Pi_S}$.` },
    { id: "u6-gap-heartbleed", type: "gap", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slides 20–22", difficulty: 2,
      title: "Heartbleed", points: 4,
      text: R`**Heartbleed** was a bug in <gap>OpenSSL</gap>, discovered in <gap>April 2014</gap>. The <gap>heartbeat extension</gap> did not validate the length; an attacker could read up to <gap>64 KB of memory</gap>. The fix is an update to 1.0.1g+ and the <gap>regeneration of the private keys</gap>.`,
      note: R`Leaked private keys allow retroactive decryption of sessions without forward secrecy.` },
    { id: "u6-gap-pq", type: "gap", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI, slides 42–46", difficulty: 2,
      title: "TLS in a Post-Quantum World", points: 4,
      text: R`**Shor's algorithm** breaks <gap>RSA, ECC, DDH, CDH and DLog</gap>, because it factors and computes discrete logarithms. **Grover's algorithm** gives a <gap>quadratic speedup</gap> for unstructured search and <gap>halves the effective keyspace</gap> of symmetric schemes. **KEMTLS** replaces RSA/ECC with <gap>quantum-resistant KEMs</gap> such as Kyber or NTRU.`,
      note: R`The slide mentions "AES-512"; AES has no 512-bit variant. What is meant is: double the key length, e.g. AES-256 for about 128 bits of PQ security.` },

    /* ---------------- problems ---------------- */
    { id: "u6-prob-hybrid-proof", type: "problem", lecture: 6, topic: "tls", origin: "slides",
      source: "Lecture VI – Hybrid Encryption, slides 2–12", difficulty: 3,
      title: "CPA Security of Hybrid Encryption",
      statement: R`Let $\Pi_{EG}$ be ElGamal over a cyclic group $G$ of prime order $q$ and $\Pi_S$ a CPA-secure symmetric scheme. Hybrid encryption:
$$\mathrm{Enc}_{Hyb}(pk,m):\ K \leftarrow G,\ y \leftarrow \mathbb{Z}_q,\ \langle c_1,c_2\rangle := \langle [y], pk^y \cdot K\rangle,\ c \leftarrow \mathrm{Enc}_S(K,m).$$
Show: if $\Pi_{EG}$ and $\Pi_S$ are CPA-secure, then $\Pi_{Hyb}$ is CPA-secure.`,
      mock: true,
      parts: [
        { label: "a", points: 2,
          prompt: R`Explain ciphertext entanglement and why it prevents a direct reduction to $\Pi_S$.`,
          hints: [R`Where does $K$ appear in the ciphertext?`,
                  R`What does a $\Pi_S$ reduction know about $K$?`],
          solution: R`In the ciphertext $\langle c_1,c_2,c\rangle = \langle [y], pk^y \cdot K, \mathrm{Enc}_S(K,m_b)\rangle$, $K$ appears twice: once in the ElGamal part and once as the key of $c$.

A reduction to the CPA security of $\Pi_S$ receives the challenge ciphertext $c = \mathrm{Enc}_S(K,m_b)$ from the challenger, but does not know $K$. To build $c_1,c_2$ in a well-formed way, it would have to compute $pk^y \cdot K$ — which is impossible without $K$. Therefore it cannot show $A$ a valid hybrid challenge.`,
          rubric: [ { points: 1, text: R`$K$ appears in $c_2$ and in $c$` },
                    { points: 1, text: R`Reduction does not know $K$ / cannot build $pk^y K$` } ] },
        { label: "b", points: 3,
          prompt: R`Define $G_0$ and $G_1$ and describe the first reduction to ElGamal CPA.`,
          hints: [R`$G_0$ is the real hybrid CPA game.`,
                  R`$G_1$ uses an independent key $K_1$ in the ElGamal part.`],
          solution: R`**$G_0$:** $(sk,pk) \leftarrow \mathrm{KGen}_{EG}$; $(m_0,m_1) \leftarrow A(pk)$; $b \leftarrow \{0,1\}$; $K_0 \leftarrow G$; $y \leftarrow \mathbb{Z}_q$; $\langle c_1,c_2\rangle := \langle [y], pk^y K_0\rangle$; $c \leftarrow \mathrm{Enc}_S(K_0,m_b)$; $b' \leftarrow A(\langle c_1,c_2,c\rangle)$.

**$G_1$:** Additionally $K_1 \leftarrow G$; $\langle c_1,c_2\rangle := \langle [y], pk^y K_1\rangle$. The key in the ElGamal part is independent of the key in $c$.

**Reduction $B_{EG}$:** $B_{EG}$ receives $pk$ from the ElGamal CPA challenger. It chooses $K_0,K_1 \leftarrow G$, sends $(K_0,K_1)$ as the challenge and receives $\langle c_1,c_2\rangle = \mathrm{Enc}_{EG}(pk,K_\beta)$. Then it chooses $b \leftarrow \{0,1\}$, computes $c \leftarrow \mathrm{Enc}_S(K_0,m_b)$, and outputs $0$ if $A$ guessed its own challenge bit correctly and $1$ otherwise.

For $\beta=0$, $\langle c_1,c_2\rangle$ is the encryption of $K_0$, i.e. $G_0$. For $\beta=1$, it is the encryption of $K_1$, i.e. $G_1$. Hence
$$\left|\Pr[G_0=1]-\Pr[G_1=1]\right| = 2 \cdot \mathrm{Adv}^{pub}_{B_{EG},\Pi_{EG}}.$$`,
          rubric: [ { points: 1, text: R`$G_0$ correct` },
                    { points: 1, text: R`$G_1$ with independent $K_1$` },
                    { points: 1, text: R`Reduction and probability relation` } ] },
        { label: "c", points: 2,
          prompt: R`Describe the second reduction to $\Pi_S$ and assemble the bound.`,
          hints: [R`In $G_1$ the ElGamal key is independent; $B_S$ can choose $K_1$ itself.`,
                  R`Triangle inequality.`],
          solution: R`**Reduction $B_S$:** $B_S$ generates $(sk,pk) \leftarrow \mathrm{KGen}_{EG}$ and sends $pk$ to $A$. $A$ returns $(m_0,m_1)$; $B_S$ sends the same to its symmetric CPA challenger and receives $c = \mathrm{Enc}_S(K,m_\beta)$. Then $B_S$ chooses $K_1 \leftarrow G$, $y \leftarrow \mathbb{Z}_q$, sets $\langle c_1,c_2\rangle := \langle [y], pk^y K_1\rangle$ and gives $\langle c_1,c_2,c\rangle$ to $A$. $B_S$ outputs $A$'s bit.

In $G_1$ the ElGamal key $K_1$ is independent of the key $K$ in $c$. So $A$ sees exactly $G_1$, and
$$\Pr[G_1=1] - \tfrac12 = \mathrm{Adv}^{priv}_{B_S,\Pi_S}.$$

**Together:**
$$\mathrm{Adv}^{pub}_{A,\Pi_{Hyb}} \le \left|\Pr[G_0=1]-\Pr[G_1=1]\right| + \left|\Pr[G_1=1]-\tfrac12\right| = 2 \cdot \mathrm{Adv}^{pub}_{B_{EG},\Pi_{EG}} + \mathrm{Adv}^{priv}_{B_S,\Pi_S}.$$
If both are negligible, the sum is negligible.`,
          rubric: [ { points: 1, text: R`$B_S$ simulates $G_1$` },
                    { points: 1, text: R`Triangle inequality / bound` } ] }
      ] },
    { id: "u6-prob-tls13", type: "problem", lecture: 6, topic: "tls", origin: "variant",
      source: "Variant of Lecture VI, slides 9–14", difficulty: 2,
      title: "TLS 1.3: Handshake and Forward Secrecy",
      statement: "",
      parts: [
        { label: "a", points: 3,
          prompt: R`Describe the TLS 1.3 handshake in its essential steps and mark which messages are encrypted.`,
          hints: [R`ClientHello and ServerHello are the first messages.`,
                  R`Encryption starts with the Server Params.`],
          solution: R`1. **ClientHello:** [[key_share]], [[signature_algorithms]], [[psk_key_exchange_modes]], possibly [[pre_shared_key]]. Still unencrypted.
2. **ServerHello:** [[key_share]], possibly [[pre_shared_key]]. Still unencrypted.
3. **Server Params:** [[{EncryptedExtensions}]], [[{CertificateRequest}]] — encrypted from here on.
4. **ServerAuth:** [[{Certificate*}]] → [[{CertificateVerify*}]] → [[{Finished}]].
5. **ClientAuth:** [[{Certificate*}]] → [[{CertificateVerify*}]] → [[{Finished}]].

The server signs the transcript; certificate and signature are inside the AEAD ciphertext.`,
          rubric: [ { points: 1, text: R`ClientHello/ServerHello correct` },
                    { points: 1, text: R`Server Params and ServerAuth correct` },
                    { points: 1, text: R`Encryption from Server Params marked` } ] },
        { label: "b", points: 2,
          prompt: R`Why does TLS 1.3 provide forward secrecy, and what would be the difference to static RSA key exchange?`,
          hints: [R`Which kind of DH is used?`,
                  R`What happens if the long-term key leaks later?`],
          solution: R`TLS 1.3 uses **ephemeral** DH values: $g^x$ and $g^y$ are chosen fresh per session, and the key is $g^{xy}$. After the session, $x$ and $y$ are discarded. A long-term signature key leaked later therefore does not allow decryption of past sessions.

With static RSA key exchange, the session key is encrypted with the long-term RSA public key. Whoever later obtains the private key (e.g. through Heartbleed) can decrypt recorded sessions retroactively.`,
          rubric: [ { points: 1, text: R`Ephemeral DH values per session` },
                    { points: 1, text: R`Comparison: static RSA key allows retroactive decryption` } ] },
        { label: "c", points: 2,
          prompt: R`What is the purpose of the four keys $K,K',K'',K'''$?`,
          hints: [R`Why not one key for everything?`,
                  R`Think of directions and purposes.`],
          solution: R`The KDF derives four separate keys from $ss$. In the lecture, $K$ protects the Server Params and ServerAuth, and $K''$ protects ClientAuth; $K'$ and $K'''$ are further derived keys for separate directions/purposes. The exact assignment is implementation-dependent; what matters is **domain separation**: no key is used in both directions or for two purposes. This reduces the attack surface and prevents a message from being reused in another context.`,
          rubric: [ { points: 1, text: R`Several directional keys from the KDF` },
                    { points: 1, text: R`Separation of direction/purpose` } ] }
      ] },
    { id: "u6-prob-heartbleed", type: "problem", lecture: 6, topic: "tls", origin: "variant",
      source: "Variant of Lecture VI, slides 20–22", difficulty: 2,
      title: "Heartbleed: Mechanism and Consequences",
      statement: "",
      parts: [
        { label: "a", points: 3,
          prompt: R`Explain the mechanism of Heartbleed and why it leaks up to 64 KB of memory.`,
          hints: [R`Heartbeat sends payload plus length.`,
                  R`What happens if the length is not validated?`],
          solution: R`The TLS heartbeat extension (RFC 6520) sends a payload and a length indication. Vulnerable OpenSSL versions did not check whether the claimed length matched the actual payload. An attacker sends e.g. 1 byte of payload but claims a length of 64 KB. The server reads 64 KB starting at the payload address and sends it back — including adjacent RAM with private keys, passwords and session tokens.`,
          rubric: [ { points: 1, text: R`Heartbeat payload and length` },
                    { points: 1, text: R`Missing length validation` },
                    { points: 1, text: R`Return of adjacent memory` } ] },
        { label: "b", points: 2,
          prompt: R`Why is a patch alone not enough, and which steps belong to a complete remediation?`,
          hints: [R`What has already happened before the patch is applied?`,
                  R`Are the old keys still trustworthy?`],
          solution: R`The patch prevents new leaks, but an attacker may already have read the private key before it was applied. Therefore one must:

1. Update OpenSSL to 1.0.1g+.
2. **Generate new private keys.**
3. **Reissue certificates** and revoke the old ones.
4. Invalidate sessions/tokens and, if necessary, change passwords.

The patch alone leaves compromised keys valid.`,
          rubric: [ { points: 1, text: R`Patch is not enough because the key may already have leaked` },
                    { points: 1, text: R`Key rotation and certificate reissuance` } ] },
        { label: "c", points: 2,
          prompt: R`Which sessions are particularly endangered by a leaked private key, and how does that relate to forward secrecy?`,
          hints: [R`Which sessions depend on the long-term key?`,
                  R`What does ephemeral DH do differently?`],
          solution: R`Recorded sessions that rely on the long-term RSA key **without forward secrecy** are particularly endangered: whoever has the private key later can reconstruct the session key and decrypt the recording. With ephemeral DH the session key depends on the short-lived $x,y$; the long-term key only signs the transcript. A later key leak then does not help for past sessions.`,
          rubric: [ { points: 1, text: R`Sessions without forward secrecy` },
                    { points: 1, text: R`Ephemeral DH protects past sessions` } ] }
      ] },
    { id: "u6-prob-pq", type: "problem", lecture: 6, topic: "tls", origin: "variant",
      source: "Variant of Lecture VI, slides 42–46", difficulty: 2,
      title: "TLS against Quantum Attackers",
      statement: "",
      parts: [
        { label: "a", points: 2,
          prompt: R`What does Shor break in the TLS handshake, and what are the consequences for authentication and key exchange?`,
          hints: [R`RSA and ECC rely on factoring and DLog, respectively.`,
                  R`The handshake signs the transcript and exchanges DH values.`],
          solution: R`Shor factors large numbers and computes discrete logarithms in polynomial time. It therefore breaks RSA, ECC, DDH, CDH and DLog.

- **Key exchange:** An attacker can compute $x$ from $g^x$, hence $ss=g^{xy}$ and all derived keys.
- **Authentication:** It can forge signatures, because it can compute the signing key from $vk$. ServerAuth/ClientAuth become worthless.

It can therefore decrypt the entire encrypted handshake.`,
          rubric: [ { points: 1, text: R`Key exchange broken` },
                    { points: 1, text: R`Signatures/authentication broken` } ] },
        { label: "b", points: 2,
          prompt: R`What does Grover change, and why is it not enough to enlarge only the symmetric keys?`,
          hints: [R`Grover halves the effective security.`,
                  R`The handshake still needs public-key operations.`],
          solution: R`Grover gives a quadratic speedup for unstructured search and thus halves the effective keyspace of symmetric schemes. Larger symmetric keys (e.g. AES-256 for about 128 bits of PQ security) compensate for that.

That is not enough, however, because the **handshake** still needs public-key crypto for key exchange and authentication. That part is broken by Shor. One must additionally deploy quantum-resistant KEMs/signatures.`,
          rubric: [ { points: 1, text: R`Grover halves effective symmetric security` },
                    { points: 1, text: R`Public-key part remains broken by Shor` } ] },
        { label: "c", points: 3,
          prompt: R`Explain the idea of KEMTLS and how it authenticates without quantum-broken signatures.`,
          hints: [R`A KEM produces a ciphertext and a shared secret.`,
                  R`Only the holder of the private key can decapsulate the KEM ciphertext.`],
          solution: R`KEMTLS replaces RSA/ECC with quantum-resistant **key encapsulation mechanisms** such as Kyber or NTRU. A KEM produces a ciphertext and a shared secret from a public key; only the holder of the corresponding private key can reconstruct the shared secret.

**Authentication without signatures:** The server proves its identity by being able to decapsulate the KEM ciphertext and provide the correct shared secret, or a key-confirmation value derived from it. Only the real server possesses the private key. This avoids the dependency on quantum-broken signatures. In addition, KEMTLS uses larger symmetric keys against Grover.`,
          rubric: [ { points: 1, text: R`KEMs (Kyber/NTRU) instead of RSA/ECC` },
                    { points: 1, text: R`Authentication via decapsulation of the KEM ciphertext` },
                    { points: 1, text: R`Avoiding quantum-broken signatures / larger symmetric keys` } ] }
      ] },
    { id: "u6-prob-record", type: "problem", lecture: 6, topic: "tls", origin: "variant",
      source: "Variant of Lecture VI, slides 13–14", difficulty: 2,
      title: "The TLS Record Protocol",
      statement: "",
      parts: [
        { label: "a", points: 2,
          prompt: R`Describe how the record protocol fragments, protects and transmits data.`,
          hints: [R`Fragment size $2^{14}$ bytes.`,
                  R`Header, encrypted data and MAC.`],
          solution: R`The record protocol splits the data stream into fragments of at most $2^{14}$ bytes (16 KB). Each fragment is protected with the traffic keys: the result is $\mathrm{Encrypted}(\mathrm{data} \,\|\, \mathrm{MAC})$ plus a record header (content type, version, length). Each record is transmitted independently and can be authenticated independently.`,
          rubric: [ { points: 1, text: R`Fragmentation max. 16 KB` },
                    { points: 1, text: R`Header + encrypted data + MAC` } ] },
        { label: "b", points: 2,
          prompt: R`Why does the MAC contain the sequence number, and what does that protect against?`,
          hints: [R`What could an attacker do with recorded records?`,
                  R`Reordering, replay, truncation.`],
          solution: R`The sequence number binds each record to its position in the connection. Otherwise an attacker could feed recorded records in a different order (reordering), repeat them (replay) or omit them (truncation) without the integrity check noticing. With the sequence number, the MAC check fails at a wrong position.`,
          rubric: [ { points: 1, text: R`Binding to position/sequence` },
                    { points: 1, text: R`Reordering/replay/truncation prevented` } ] },
        { label: "c", points: 1,
          prompt: R`Why is encryption alone not enough to protect a record?`,
          hints: [R`What can an active attacker do with a modified ciphertext?`],
          solution: R`Encryption alone provides no integrity. An active attacker can flip ciphertext bits, swap records or replay them. Without a MAC/AEAD the receiver cannot tell whether the record is authentic and at the right position. Therefore TLS combines encryption with authentication (AEAD or MAC).`,
          rubric: [ { points: 1, text: R`No integrity/authenticity without MAC/AEAD` } ] }
      ] }
  );
})();
