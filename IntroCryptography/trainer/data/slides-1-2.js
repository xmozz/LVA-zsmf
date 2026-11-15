(function () {
  const R = String.raw;
  const add = (...items) => (window.CRYPTO_BANK = window.CRYPTO_BANK || []).push(...items);

  // =====================================================================
  // LECTURE 1: introduction, private-key syntax, Kerckhoffs, historical ciphers
  // =====================================================================

  // ---------------------------- notes ----------------------------------
  add(
    { id: "l1-note-intro", type: "note", lecture: 1, topic: "principles", origin: "slides",
      source: "Lecture 1, slides 11–15", difficulty: 1,
      title: "Cryptography: history, scope and goals",
      order: 10,
      body: R`### From art to science

- Encryption of messages has been used since ancient times (Caesar, Spartans).
- Until the 1970s cryptography was essentially used by the military and governments.
- In the mid-1970s DES became a public encryption standard; cryptography entered everyday use (computers, phones).
- In the 20th century a **rigorous approach** developed: cryptography is now a **science**.

### What modern cryptography covers

Classically, cryptography meant **private-key encryption**: secret communication between parties that **share a secret** (the key). Modern cryptography is much broader: authentication and integrity (Wi-Fi, passwords), public-key cryptography (https, digital signatures, software updates), e-cash and cryptocurrencies, and advanced topics (identity-based encryption, multiparty computation, fully homomorphic encryption, zero-knowledge proofs). Katz–Lindell (§1.1) describe modern cryptography as the study of *mathematical techniques* for securing digital information, systems and distributed computations against adversarial attacks.

### Map of the course

- **Secrecy, private-key:** private-key encryption (built from block ciphers / PRFs).
- **Integrity, private-key:** message authentication codes.
- **Secrecy, public-key:** public-key encryption (built from number theory).
- **Integrity, public-key:** digital signatures (number theory, hash functions).

Reference book: Katz, Lindell, *Introduction to Modern Cryptography*, 3rd edition.

### Goals

- **Understand** cryptography as used in the real world (the schemes actually deployed) and with a rigorous approach (the "provable security" paradigm).
- **Use** cryptography: know which **primitives** exist and which precise **security guarantees** they provide.` },

    { id: "l1-note-syntax", type: "note", lecture: 1, topic: "principles", origin: "slides",
      source: "Lecture 1, slides 17–18", difficulty: 1,
      title: "Private-key encryption: syntax and correctness",
      order: 20,
      body: R`### Setting

Private-key ("symmetric") encryption: Alice encrypts a message $m$ with key $k$ and sends the ciphertext $c$ over a public channel, where an adversary may see it. Bob decrypts $c$ with the **same** key $k$. The key is produced by $\mathsf{Gen}$ and shared over a **secure channel** beforehand.

### Definition (§1.2)

A **private-key encryption scheme** is defined by a **message space** $\mathcal{M}$ and three algorithms $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$:

- $\mathsf{Gen}$ (key generation) is **probabilistic** and outputs a key $k$.
- $\mathsf{Enc}$ (encryption) takes a key $k$ and a message (plaintext) $m$ and outputs a ciphertext $c$; we write $c \gets \mathsf{Enc}_k(m)$ (the arrow means $\mathsf{Enc}$ may be randomized).
- $\mathsf{Dec}$ (decryption) takes a key $k$ and a ciphertext $c$ and outputs a message; we write $m := \mathsf{Dec}_k(c)$ (the $:=$ means $\mathsf{Dec}$ is deterministic).

The set of all keys $\mathsf{Gen}$ can output is the key space $\mathcal{K}$; the set of possible ciphertexts is $\mathcal{C}$.

### Correctness

$$\text{For all } k \gets \mathsf{Gen} \text{ and all } m \in \mathcal{M}: \quad \mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m.$$

Correctness must hold **always** (for every key, every message and every random choice of $\mathsf{Enc}$), not just with high probability.

### Exam traps

- Encryption **may be randomized**; it is key generation that must be probabilistic. Decryption is deterministic.
- A consequence of correctness: for a fixed key, $\mathsf{Enc}_k$ is injective on $\mathcal{M}$ (two different messages can never give the same ciphertext under the same key), so $|\mathcal{C}| \ge |\mathcal{M}|$.` },

    { id: "l1-note-kerckhoffs", type: "note", lecture: 1, topic: "principles", origin: "slides",
      source: "Lecture 1, slide 19; Lecture 2, slide 10", difficulty: 1,
      title: "Kerckhoffs' principle",
      order: 30,
      body: R`### Statement (Kerckhoffs, 1883, *La cryptographie militaire*)

$\mathsf{Enc}$ and $\mathsf{Dec}$ are **public**, and the secrecy of $m$, given $c$, depends **entirely on the secrecy of the key** $k$. In Kerckhoffs' words: the system should not require secrecy, and it should not be a problem if it falls into enemy hands. Short form used in lecture 2: *the adversary knows the scheme.*

### Arguments

1. It is **easier to keep keys secret** than algorithms: algorithms do not stay secret (reverse engineering, insiders).
2. It is **easier to replace a key** than a whole scheme once something leaks.
3. Public schemes can be **standardized**: this gives compatibility between implementations and allows **public scrutiny** (many experts look for weaknesses).

Examples on the slide of proprietary "secret" designs that were reverse-engineered and broken: the GSM ciphers and Mifare Classic (Crypto-1).

### Consequence for security definitions

Every security definition in this course assumes the adversary knows $\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec}$; only the key (and the random choices) are hidden. "Security by obscurity" is not security.` },

    { id: "l1-note-scytale", type: "note", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slides 21–22", difficulty: 1,
      title: "Permutation ciphers: the scytale",
      order: 40,
      body: R`### Scytale (Spartans)

A strip of leather is wound around a rod; the message is written along the rod, then the strip is unwound. The **key is the circumference** of the rod.

Equivalent description used on the slide with key $k$: write the message row by row into $k$ rows (each row has $\lceil n/k \rceil$ letters), then read the grid **column by column**.

Example from the slide, plaintext amhurtbadlyhelp ("I am hurt badly, help"):

- $k = 3$: rows amhur / tbadl / yhelp, ciphertext atymbhhaeudlrlp.
- $k = 4$: rows amhu / rtba / dlyh / elp, ciphertext ardemtllhbypuah.

### Permutation (transposition) ciphers

The key defines a **rearranging** of the message: the letters stay the same, only their positions change. The scytale can realise only **certain** permutations (one per possible circumference), so the key space is tiny: an attacker simply tries all plausible $k$ (brute force).

### Exam facts

- A permutation cipher does **not** change which letters occur, so the letter frequencies of the ciphertext equal those of the plaintext.
- Permutation ciphers are a different family from substitution ciphers (which replace letters by other letters).` },

    { id: "l1-note-substitution", type: "note", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slides 23–24", difficulty: 1,
      title: "Monoalphabetic substitution and shift ciphers",
      order: 50,
      body: R`### Monoalphabetic substitution (e.g. Caesar cipher, ROT13)

Alphabet $\Sigma = \{A, \dots, Z\}$. The key is a **bijection** $\pi \colon \Sigma \to \Sigma$ (a permutation of the alphabet, e.g. A to K, B to X, C to M, ...).

$$\begin{aligned} \mathsf{Enc}(\pi, m_1 m_2 \dots m_n) &= \pi(m_1)\pi(m_2)\dots\pi(m_n) \\ \mathsf{Dec}(\pi, c_1 c_2 \dots c_n) &= \pi^{-1}(c_1)\pi^{-1}(c_2)\dots\pi^{-1}(c_n) \end{aligned}$$

"Mono" = one fixed substitution for every position, so equal plaintext letters always give equal ciphertext letters. Number of keys: $26! > 2^{88}$.

### Shift ciphers (a subset of substitution ciphers)

Identify $A \sim 0, B \sim 1, \dots, Z \sim 25$. Key $k \in \{0, \dots, 25\}$, applied letter by letter:

$$\mathsf{Enc}(k, m) := (m + k) \bmod 26, \qquad \mathsf{Dec}(k, c) := (c - k) \bmod 26.$$

- **Caesar cipher:** $k = 3$ (A to D, B to E, ...).
- **ROT13:** $k = 13$; since $13 + 13 = 26 \equiv 0$, encrypting twice gives back the plaintext.
- Only **26 keys**; the shift cipher is the special case of substitution where $\pi(x) = x + k \bmod 26$.

### Exam traps

- Composing two shifts with keys $k_1, k_2$ is again a shift with key $k_1 + k_2 \bmod 26$: no extra security.
- Huge key space ($26!$) does not make substitution secure: see frequency analysis.` },

    { id: "l1-note-cryptanalysis", type: "note", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slides 25–26", difficulty: 1,
      title: "Cryptanalysis: brute force and frequency analysis",
      order: 60,
      body: R`### Breaking shift ciphers: brute force

There are only 26 keys. Given $c$, try every key $k$ and check which $m = \mathsf{Dec}(k, c)$ makes sense. This is a **brute-force attack** (exhaustive search).

**Lesson:** the key space must be large enough. Examples from the slide:

- $2^{48}$: Mifare Crypto-1 (48-bit key), breakable on a phone.
- $2^{56}$: DES, breakable on a laptop.
- $2^{128}$ or $2^{256}$: key space of AES, out of reach of exhaustive search.

### Breaking monoalphabetic substitution: statistical analysis

Every letter is replaced by an arbitrary other letter, so there are $26!$ keys (more than $2^{88}$): brute force is infeasible. But the substitution keeps the **letter frequencies**: the most frequent ciphertext letter most likely encrypts the most frequent plaintext letter. In English, e is by far the most frequent letter (about 12.7%), followed by t (about 9.1%) and a (about 8.2%). Matching frequencies (then pairs, common words) recovers $\pi$.

### Lesson

A large key space is **necessary but not sufficient** for security. Monoalphabetic substitution has a huge key space and is still trivially broken by frequency analysis.` },

    { id: "l1-note-polyalphabetic", type: "note", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slides 27–28", difficulty: 1,
      title: "Polyalphabetic substitution: Vigenère and Vernam",
      order: 70,
      body: R`### Polyalphabetic substitution

Key: a tuple of permutations $k = (\pi_1, \dots, \pi_\ell)$. The substitution used depends on the **position**:

$$\mathsf{Enc}(k, m_1 m_2 \dots m_n) = \pi_1(m_1)\pi_2(m_2)\dots\pi_\ell(m_\ell)\pi_1(m_{\ell+1})\dots$$

With arbitrary permutations the key space is $(26!)^\ell$.

### Vigenère cipher (1553), a special polyalphabetic cipher

Each $\pi_i$ is a **shift**; the key is a word whose letters give the shifts, repeated over the message ("the key repeats"). Slide example, key CLE (shifts 2, 11, 4):

- plaintext MESSAGECLAIR, key CLECLECLECLE, ciphertext OPWULKGNPCTV.

The same plaintext letter can give different ciphertext letters (the two S in MESSAGE become W and U). Key space for period $\ell$: $26^\ell$.

**Cryptanalysis: statistical attacks.** All letters at positions $i, i+\ell, i+2\ell, \dots$ are shifted by the same amount, so once the period $\ell$ is known, the ciphertext splits into $\ell$ streams, each a shift cipher, which is broken by frequency analysis. (The period can be found by trying $\ell = 1, 2, 3, \dots$; the book also describes Kasiski's method and the index of coincidence.)

### Vernam cipher (cf. one-time pad)

Key: a **random** sequence of letters of the **same length** as the message; $c_i := (m_i + k_i) \bmod 26$. Slide example: PLAINTEXT with key ABADGWTAB gives PMALTPXXU.

Because the key is random and as long as the message, **every** ciphertext of the right length can come from **every** plaintext of that length (the slide shows both PLAINTEXT and DIFFERENT encrypting to ENCRYPTED under suitable keys). This is the letter version of the one-time pad (lecture 2) and is perfectly secret when each key is used only once.` },

    { id: "l1-note-overview", type: "note", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 29 (overview), slides 21–28", difficulty: 1,
      title: "Overview of historical ciphers, key spaces and attacks",
      order: 80,
      body: R`### Two families

- **Permutation** (of message blocks or letters): the letters are rearranged. Example: scytale (few possible permutations).
- **Substitution** (of message blocks or letters by others):
  - *Monoalphabetic:* shift (Caesar) or random bijection.
  - *Polyalphabetic* (substitute depends on the location): Vigenère (the key "repeats") or Vernam (long key).

### Summary for revision

- **Scytale:** key = circumference; few keys; break by trying all circumferences. Letter frequencies unchanged.
- **Shift / Caesar:** key $k \in \{0, \dots, 25\}$, 26 keys; break by brute force (try all 26).
- **Monoalphabetic substitution:** key = permutation $\pi$ of the alphabet, $26! > 2^{88}$ keys; break by frequency analysis.
- **Vigenère with period $\ell$:** $26^\ell$ keys; find $\ell$, then frequency analysis on each of the $\ell$ shift-cipher streams.
- **General polyalphabetic with $\ell$ permutations:** $(26!)^\ell$ keys; same idea, frequency analysis per position class.
- **Vernam (one-time pad on letters):** random key as long as the message; secure if the key is truly random and used once (perfect secrecy, lecture 2).

### Morals

1. Kerckhoffs: the attacker knows which cipher is used.
2. Key space must be large (brute force), but that is **not enough** (frequency analysis).
3. Designing ciphers by intuition fails; we need **definitions** and **proofs** (lecture 2).` }
  );

  // ---------------------------- cards ----------------------------------
  add(
    { id: "l1-card-01", type: "card", lecture: 1, topic: "principles", origin: "slides",
      source: "Lecture 1, slide 18", difficulty: 1,
      front: R`What defines a private-key encryption scheme?`,
      back: R`A message space $\mathcal{M}$ and three algorithms: $\mathsf{Gen}$ (probabilistic, outputs a key $k$), $\mathsf{Enc}$ (takes $k$ and $m$, outputs $c \gets \mathsf{Enc}_k(m)$), $\mathsf{Dec}$ (takes $k$ and $c$, outputs $m := \mathsf{Dec}_k(c)$).` },
    { id: "l1-card-02", type: "card", lecture: 1, topic: "principles", origin: "slides",
      source: "Lecture 1, slide 18", difficulty: 1,
      front: R`State the correctness condition of a private-key encryption scheme.`,
      back: R`For all $k \gets \mathsf{Gen}$ and all $m \in \mathcal{M}$: $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$. It must hold always, not just with high probability.` },
    { id: "l1-card-03", type: "card", lecture: 1, topic: "principles", origin: "slides",
      source: "Lecture 1, slide 19", difficulty: 1,
      front: R`State Kerckhoffs' principle.`,
      back: R`$\mathsf{Enc}$ and $\mathsf{Dec}$ are public, and the secrecy of $m$, given $c$, depends entirely on the secrecy of the key $k$. (The system must stay secure even if it falls into enemy hands.)` },
    { id: "l1-card-04", type: "card", lecture: 1, topic: "principles", origin: "slides",
      source: "Lecture 1, slide 19", difficulty: 1,
      front: R`Give the three arguments for Kerckhoffs' principle.`,
      back: R`1. Keys are easier to keep secret than algorithms (reverse engineering). 2. A key is easier to replace than a scheme. 3. Public schemes can be standardized: compatibility and public scrutiny.` },
    { id: "l1-card-05", type: "card", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 24", difficulty: 1,
      front: R`Shift cipher: key space, encryption and decryption.`,
      back: R`With $A \sim 0, \dots, Z \sim 25$: key $k \in \{0, \dots, 25\}$, $\mathsf{Enc}(k, m) := (m + k) \bmod 26$, $\mathsf{Dec}(k, c) := (c - k) \bmod 26$, letter by letter. Caesar uses $k = 3$.` },
    { id: "l1-card-06", type: "card", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 25", difficulty: 1,
      front: R`How is the shift cipher broken, and what is the general lesson?`,
      back: R`Brute force (exhaustive search): only 26 keys, try them all and see which decryption makes sense. Lesson: the key space must be large enough.` },
    { id: "l1-card-07", type: "card", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 23", difficulty: 1,
      front: R`Monoalphabetic substitution cipher: what is the key and how do Enc/Dec work?`,
      back: R`Key: a bijection $\pi \colon \Sigma \to \Sigma$. $\mathsf{Enc}(\pi, m_1 \dots m_n) = \pi(m_1)\dots\pi(m_n)$, $\mathsf{Dec}(\pi, c_1 \dots c_n) = \pi^{-1}(c_1)\dots\pi^{-1}(c_n)$.` },
    { id: "l1-card-08", type: "card", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 26", difficulty: 1,
      front: R`How many keys does the monoalphabetic substitution cipher (26 letters) have, and how is it broken?`,
      back: R`$26!$ keys (more than $2^{88}$), so brute force is infeasible. It is broken by statistical analysis: letter frequencies are preserved (e is the most frequent English letter, about 12.7%).` },
    { id: "l1-card-09", type: "card", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 25", difficulty: 1,
      front: R`Key-space examples from the slides: Mifare Crypto-1, DES, AES.`,
      back: R`Mifare Crypto-1: 48-bit key, $2^{48}$, breakable on a phone. DES: $2^{56}$, breakable on a laptop. AES: $2^{128}$ or $2^{256}$.` },
    { id: "l1-card-10", type: "card", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 27", difficulty: 1,
      front: R`What is a polyalphabetic substitution cipher?`,
      back: R`Key $k = (\pi_1, \dots, \pi_\ell)$; position $i$ is encrypted with $\pi_{((i-1) \bmod \ell) + 1}$: $\mathsf{Enc}(k, m_1 m_2 \dots) = \pi_1(m_1)\dots\pi_\ell(m_\ell)\pi_1(m_{\ell+1})\dots$ The substitute depends on the location.` },
    { id: "l1-card-11", type: "card", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 27", difficulty: 2,
      front: R`How is the Vigenère cipher broken?`,
      back: R`Statistical attack: find the period $\ell$; letters at positions $i, i+\ell, i+2\ell, \dots$ are all shifted by the same key letter, so each of the $\ell$ streams is a shift cipher, broken by frequency analysis.` },
    { id: "l1-card-12", type: "card", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 28", difficulty: 1,
      front: R`Vernam cipher: key and encryption rule.`,
      back: R`The key is a random letter sequence of the same length as the message; $c_i := (m_i + k_i) \bmod 26$. It is the letter version of the one-time pad.` },
    { id: "l1-card-13", type: "card", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slides 21–22", difficulty: 1,
      front: R`Scytale: what kind of cipher is it and what is the key?`,
      back: R`A permutation (transposition) cipher of the Spartans; the key is the circumference of the rod. Only a few permutations are possible, so trying all keys breaks it.` },
    { id: "l1-card-14", type: "card", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 29", difficulty: 1,
      front: R`Permutation cipher vs. substitution cipher?`,
      back: R`Permutation: rearranges the positions of letters/blocks, letters themselves unchanged. Substitution: replaces letters/blocks by others (monoalphabetic: fixed map; polyalphabetic: map depends on the position).` },
    { id: "l1-card-15", type: "card", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slides 24–29", difficulty: 2,
      front: R`Key-space sizes: shift, substitution, Vigenère with period $\ell$, general polyalphabetic with $\ell$ permutations.`,
      back: R`Shift: $26$. Substitution: $26!$. Vigenère: $26^\ell$. General polyalphabetic: $(26!)^\ell$.` },
    { id: "l1-card-16", type: "card", lecture: 1, topic: "principles", origin: "slides",
      source: "Lecture 1, slide 14", difficulty: 1,
      front: R`Name the four basic primitives in the secrecy/integrity times private-key/public-key map.`,
      back: R`Private-key encryption (secrecy, private-key), MACs (integrity, private-key), public-key encryption (secrecy, public-key), digital signatures (integrity, public-key).` }
  );

  // ---------------------------- true/false -----------------------------
  add(
    { id: "l1-tf-01", type: "tf", lecture: 1, topic: "principles", origin: "slides",
      source: "Lecture 1, slide 19", difficulty: 1,
      statement: R`According to Kerckhoffs' principle, the security of an encryption scheme should rely only on the secrecy of the key, not on the secrecy of the algorithms $\mathsf{Enc}$ and $\mathsf{Dec}$.`,
      answer: true,
      explanation: R`This is exactly the principle: $\mathsf{Enc}$ and $\mathsf{Dec}$ are public, and the secrecy of $m$ given $c$ depends entirely on the secrecy of $k$.` },
    { id: "l1-tf-02", type: "tf", lecture: 1, topic: "principles", origin: "slides",
      source: "Lecture 1, slide 19", difficulty: 1,
      statement: R`Kerckhoffs' principle recommends keeping the encryption algorithm secret as an additional layer of protection, since an attacker who does not know the algorithm cannot attack it.`,
      answer: false,
      explanation: R`The principle says the opposite: the scheme should not require secrecy. Algorithms do not stay secret (reverse engineering, e.g. Mifare Crypto-1 and the GSM ciphers), while public schemes benefit from standardization and public scrutiny.` },
    { id: "l1-tf-03", type: "tf", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 26", difficulty: 1,
      statement: R`The monoalphabetic substitution cipher over the 26-letter alphabet has more than $2^{88}$ keys.`,
      answer: true,
      explanation: R`A key is a permutation of the alphabet, so there are $26! \approx 4 \cdot 10^{26}$ keys, and $2^{88} \approx 3.1 \cdot 10^{26} < 26!$.` },
    { id: "l1-tf-04", type: "tf", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slides 25–26", difficulty: 2,
      statement: R`Since its key space is larger than $2^{88}$, the monoalphabetic substitution cipher is secure against any realistic attacker who only sees a long ciphertext.`,
      answer: false,
      explanation: R`The key space only stops brute force. Substitution keeps letter frequencies, so frequency analysis recovers the key from a long ciphertext.` },
    { id: "l1-tf-05", type: "tf", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slides 25–26", difficulty: 2,
      statement: R`A large key space is necessary, but not sufficient, for an encryption scheme to be secure.`,
      answer: true,
      explanation: R`Necessary: a small key space is broken by brute force (shift cipher, 26 keys). Not sufficient: monoalphabetic substitution has $26!$ keys and is broken by frequency analysis.` },
    { id: "l1-tf-06", type: "tf", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 24", difficulty: 1,
      statement: R`Every shift cipher is a monoalphabetic substitution cipher.`,
      answer: true,
      explanation: R`A shift by $k$ is the particular bijection $\pi(x) = (x + k) \bmod 26$, applied to every letter. The slide writes "shift ciphers $\subseteq$ substitution ciphers".` },
    { id: "l1-tf-07", type: "tf", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 24", difficulty: 2,
      statement: R`Encrypting a message twice with the shift cipher, under two independently chosen keys $k_1$ and $k_2$, gives a cipher with $26^2$ effectively different keys.`,
      answer: false,
      explanation: R`The composition is $(m + k_1 + k_2) \bmod 26$, a single shift with key $k_1 + k_2 \bmod 26$. There are still only 26 different encryption functions, so brute force over 26 keys still works.` },
    { id: "l1-tf-08", type: "tf", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 23", difficulty: 1,
      statement: R`ROT13 is the shift cipher with key $k = 13$, and encrypting a text twice with ROT13 returns the original text.`,
      answer: true,
      explanation: R`ROT13 shifts every letter by 13; applying it twice shifts by $26 \equiv 0 \pmod{26}$.` },
    { id: "l1-tf-09", type: "tf", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 25", difficulty: 1,
      statement: R`A brute-force attack on the shift cipher has to try $26!$ keys.`,
      answer: false,
      explanation: R`The shift cipher has only the 26 keys $k \in \{0, \dots, 25\}$. $26!$ is the number of keys of general monoalphabetic substitution.` },
    { id: "l1-tf-10", type: "tf", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slides 21–22", difficulty: 1,
      statement: R`The scytale is a substitution cipher in which every letter is replaced by the letter $k$ positions further in the alphabet.`,
      answer: false,
      explanation: R`The scytale is a permutation (transposition) cipher: it rearranges the letters; its key is the circumference of the rod. The described cipher is the shift cipher.` },
    { id: "l1-tf-11", type: "tf", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slides 22, 29", difficulty: 2,
      statement: R`For any permutation (transposition) cipher, each letter occurs exactly as often in the ciphertext as in the plaintext.`,
      answer: true,
      explanation: R`A permutation cipher only changes the positions of the letters, not the letters themselves, so the multiset of letters, and hence the letter frequencies, are unchanged.` },
    { id: "l1-tf-12", type: "tf", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 27", difficulty: 2,
      statement: R`In the Vigenère cipher, two equal plaintext letters are always encrypted to two equal ciphertext letters.`,
      answer: false,
      explanation: R`The shift depends on the position modulo the key length. In the slide example MESSAGECLAIR with key CLE, the two S are encrypted to W and U.` },
    { id: "l1-tf-13", type: "tf", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 27", difficulty: 2,
      statement: R`Once the key length $\ell$ of a Vigenère ciphertext is known, breaking it reduces to breaking $\ell$ independent shift ciphers.`,
      answer: true,
      explanation: R`All letters at positions $i, i+\ell, i+2\ell, \dots$ are shifted by the same key letter, so each of these $\ell$ streams is a shift-cipher ciphertext, which frequency analysis (or trying 26 shifts) breaks.` },
    { id: "l1-tf-14", type: "tf", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 27", difficulty: 1,
      statement: R`A Vigenère cipher whose key consists of a single letter is exactly a shift cipher.`,
      answer: true,
      explanation: R`With period $\ell = 1$ every position is shifted by the same amount, which is the definition of the shift cipher.` },
    { id: "l1-tf-15", type: "tf", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 27", difficulty: 2,
      statement: R`A polyalphabetic substitution cipher with key $k = (\pi_1, \dots, \pi_\ell)$, where each $\pi_i$ is an arbitrary permutation of the 26 letters, has $(26!)^\ell$ keys.`,
      answer: true,
      explanation: R`Each of the $\ell$ permutations can be chosen independently among the $26!$ permutations of the alphabet.` },
    { id: "l1-tf-16", type: "tf", lecture: 1, topic: "principles", origin: "slides",
      source: "Lecture 1, slide 18", difficulty: 2,
      statement: R`Correctness of a private-key encryption scheme only requires that $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$ holds with overwhelming probability over the choice of the key.`,
      answer: false,
      explanation: R`The lecture's definition requires $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$ for all $k \gets \mathsf{Gen}$ and all $m \in \mathcal{M}$, i.e. always.` },
    { id: "l1-tf-17", type: "tf", lecture: 1, topic: "principles", origin: "slides",
      source: "Lecture 1, slides 17–18", difficulty: 1,
      statement: R`In private-key encryption, the sender encrypts with one key and the receiver decrypts with a different, related key.`,
      answer: false,
      explanation: R`Private-key ("symmetric") encryption uses the same key $k$ for $\mathsf{Enc}$ and $\mathsf{Dec}$; it is shared beforehand over a secure channel. Different keys for encryption and decryption are the public-key setting.` },
    { id: "l1-tf-18", type: "tf", lecture: 1, topic: "principles", origin: "slides",
      source: "Lecture 1, slide 18", difficulty: 1,
      statement: R`In the syntax of private-key encryption, the key-generation algorithm $\mathsf{Gen}$ is probabilistic.`,
      answer: true,
      explanation: R`The definition states that $\mathsf{Gen}$ is probabilistic and outputs a key $k$; a deterministic $\mathsf{Gen}$ would always output the same, hence publicly known, key.` },
    { id: "l1-tf-19", type: "tf", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 25", difficulty: 1,
      statement: R`According to the lecture, a key space of size $2^{56}$, as in DES, is today large enough to resist exhaustive key search.`,
      answer: false,
      explanation: R`The slide lists $2^{56}$ (DES) as breakable on a laptop. Modern ciphers such as AES use key spaces of $2^{128}$ or $2^{256}$.` },
    { id: "l1-tf-20", type: "tf", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 24", difficulty: 1,
      statement: R`In the shift cipher, the key is a bijection $\pi$ chosen uniformly from all permutations of the alphabet.`,
      answer: false,
      explanation: R`That is the general monoalphabetic substitution cipher. In the shift cipher the key is a number $k \in \{0, \dots, 25\}$ and $\pi(x) = (x + k) \bmod 26$.` },
    { id: "l1-tf-21", type: "tf", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 28", difficulty: 2,
      statement: R`In the Vernam cipher with a uniformly random key as long as the message, every ciphertext of length $n$ can arise from every plaintext of length $n$.`,
      answer: true,
      explanation: R`For plaintext $m$ and ciphertext $c$ the key $k_i := (c_i - m_i) \bmod 26$ maps $m$ to $c$. This is why the slide can encrypt both PLAINTEXT and DIFFERENT to ENCRYPTED.` },
    { id: "l1-tf-22", type: "tf", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slides 23, 27", difficulty: 2,
      statement: R`Frequency analysis on single letters works against the Vigenère cipher exactly as against a monoalphabetic substitution cipher, without first determining the key length.`,
      answer: false,
      explanation: R`Different positions use different shifts, so the frequencies of the whole ciphertext are flattened. One first has to find the period $\ell$ and then analyse each of the $\ell$ streams separately.` }
  );

  // ---------------------------- multiple choice ------------------------
  add(
    { id: "l1-mc-01", type: "mc", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 26", difficulty: 1,
      question: R`How many keys does the monoalphabetic substitution cipher over the alphabet $\{A, \dots, Z\}$ have?`,
      options: [R`$26$`, R`$26!$`, R`$2^{26}$`, R`$26^{26}$`],
      correct: 1,
      explanation: R`A key is a bijection $\pi \colon \Sigma \to \Sigma$, i.e. a permutation of 26 letters, and there are $26!$ of them ($> 2^{88}$). $26^{26}$ would count all functions, including non-invertible ones.` },
    { id: "l1-mc-02", type: "mc", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slides 25–26", difficulty: 1,
      question: R`Which attack breaks the monoalphabetic substitution cipher efficiently, given a long English ciphertext?`,
      options: [R`Exhaustive key search over all keys`, R`Frequency analysis of the ciphertext letters`, R`Trying all 26 shifts`, R`None: its key space is too large`],
      correct: 1,
      explanation: R`The key space $26!$ is too large for exhaustive search, and a general permutation is not a shift. But the substitution preserves letter frequencies, so statistical analysis recovers $\pi$.` },
    { id: "l1-mc-03", type: "mc", lecture: 1, topic: "principles", origin: "slides",
      source: "Lecture 1, slide 19", difficulty: 1,
      question: R`Which of the following is **not** an argument for Kerckhoffs' principle given in the lecture?`,
      options: [R`It is easier to keep a key secret than an algorithm.`, R`It is easier to replace a key than a scheme.`, R`Public schemes can be standardized and publicly scrutinized.`, R`A secret algorithm makes a scheme provably secure.`],
      correct: 3,
      explanation: R`The first three are the arguments on the slide. Secrecy of the algorithm gives no provable security at all; security must come from the key alone.` },
    { id: "l1-mc-04", type: "mc", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 27", difficulty: 2,
      question: R`Using $A \sim 0, \dots, Z \sim 25$, what is the Vigenère encryption of HELLO under the key AB?`,
      options: [R`HFLMO`, R`IFMMP`, R`HELLO`, R`HFMMP`],
      correct: 0,
      explanation: R`The key AB means shifts $0, 1, 0, 1, 0$: H+0 = H, E+1 = F, L+0 = L, L+1 = M, O+0 = O, giving HFLMO.` },
    { id: "l1-mc-05", type: "mc", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 21", difficulty: 2,
      question: R`Scytale with key $k = 3$: write ATTACKATDAWN row by row into 3 rows (4 letters each) and read the grid column by column. What is the ciphertext?`,
      options: [R`ACDTKATAWATN`, R`ATTACKATDAWN`, R`ATDTAAWTACKN`, R`NWADTAKCATTA`],
      correct: 0,
      explanation: R`Rows: ATTA / CKAT / DAWN. Columns: ACD, TKA, TAW, ATN, so the ciphertext is ACDTKATAWATN.` },
    { id: "l1-mc-06", type: "mc", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 24", difficulty: 1,
      question: R`The Caesar cipher ($k = 3$) gives the ciphertext KHOOR. What is the plaintext?`,
      options: [R`NKRRU`, R`HELLO`, R`GDKKN`, R`JGNNQ`],
      correct: 1,
      explanation: R`Decrypt with $(c - 3) \bmod 26$: K to H, H to E, O to L, O to L, R to O.` },
    { id: "l1-mc-07", type: "mc", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slides 21–29", difficulty: 1,
      question: R`Which of the following ciphers is polyalphabetic?`,
      options: [R`Caesar cipher`, R`ROT13`, R`Vigenère cipher`, R`Scytale`],
      correct: 2,
      explanation: R`In the Vigenère cipher the shift depends on the position. Caesar and ROT13 are monoalphabetic shift ciphers; the scytale is a permutation cipher.` },
    { id: "l1-mc-08", type: "mc", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slide 25", difficulty: 1,
      question: R`According to the lecture, which key space is small enough to be searched exhaustively on a mobile phone?`,
      options: [R`$2^{48}$ (Mifare Crypto-1)`, R`$2^{88}$ (substitution cipher)`, R`$2^{128}$ (AES-128)`, R`$2^{256}$ (AES-256)`],
      correct: 0,
      explanation: R`The slide: $2^{48}$ (Mifare Crypto-1) breakable on a phone, $2^{56}$ (DES) on a laptop, while $2^{128}$ and $2^{256}$ are AES key spaces.` },
    { id: "l1-mc-09", type: "mc", lecture: 1, topic: "principles", origin: "slides",
      source: "Lecture 1, slide 18", difficulty: 2,
      question: R`Which statement about the algorithms of a private-key encryption scheme matches the lecture's definition?`,
      options: [R`$\mathsf{Gen}$ is deterministic, $\mathsf{Enc}$ is probabilistic.`, R`$\mathsf{Gen}$ is probabilistic, $\mathsf{Enc}$ may be probabilistic, $\mathsf{Dec}$ is deterministic.`, R`All three algorithms must be deterministic.`, R`$\mathsf{Dec}$ may be probabilistic as long as it is correct with high probability.`],
      correct: 1,
      explanation: R`$\mathsf{Gen}$ is probabilistic; encryption is written $c \gets \mathsf{Enc}_k(m)$ (may be randomized); decryption is written $m := \mathsf{Dec}_k(c)$ (deterministic) and must always be correct.` }
  );

  // ---------------------------- gaps -----------------------------------
  add(
    { id: "l1-gap-syntax", type: "gap", lecture: 1, topic: "principles", origin: "slides",
      source: "Lecture 1, slide 18", difficulty: 1,
      title: "Private-key encryption scheme (syntax and correctness)", points: 5,
      text: R`A private-key encryption scheme is defined by a <gap>message space $\mathcal{M}$</gap> and three algorithms:

- $\mathsf{Gen}$ (key generation) is <gap>probabilistic</gap> and outputs a key $k$.
- $\mathsf{Enc}$ (encryption) takes <gap>a key $k$ and a message $m$</gap> and outputs a ciphertext $c \gets \mathsf{Enc}_k(m)$.
- $\mathsf{Dec}$ (decryption) takes a key $k$ and a ciphertext $c$ and outputs a message $m := \mathsf{Dec}_k(c)$.

**Correctness:** for <gap>all $k \gets \mathsf{Gen}$ and all $m \in \mathcal{M}$</gap>: <gap>$\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$</gap>.`,
      note: R`Correctness must hold always, not just with high probability. $\mathsf{Enc}$ may be randomized; $\mathsf{Dec}$ is deterministic.` },
    { id: "l1-gap-shift", type: "gap", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slides 24–25", difficulty: 1,
      title: "Shift cipher", points: 5,
      text: R`Identify the letters $A, \dots, Z$ with $0, \dots, 25$. The shift cipher has key space <gap>$\{0, \dots, 25\}$</gap>. Encryption of a letter is <gap>$\mathsf{Enc}(k, m) := (m + k) \bmod 26$</gap> and decryption is <gap>$\mathsf{Dec}(k, c) := (c - k) \bmod 26$</gap>. The Caesar cipher is the special case <gap>$k = 3$</gap>. Since there are only 26 keys, the shift cipher is broken by <gap>a brute-force attack (exhaustive key search)</gap>.` }
  );

  // ---------------------------- problems -------------------------------
  add(
    { id: "l1-prob-shift", type: "problem", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slides 23–26", difficulty: 2,
      title: "Shift cipher: decryption, brute force, key spaces",
      mock: false,
      statement: R`Identify $A, \dots, Z$ with $0, \dots, 25$. The shift cipher encrypts letter by letter with $\mathsf{Enc}(k, m) = (m + k) \bmod 26$.`,
      parts: [
        { label: "a", points: 1,
          prompt: R`Decrypt the Caesar ciphertext WKLVLVHDVB (key $k = 3$).`,
          hints: [R`Shift every letter back by 3.`, R`W becomes T, K becomes H, ...`],
          solution: R`$\mathsf{Dec}(3, c) = (c - 3) \bmod 26$ letter by letter: W to T, K to H, L to I, V to S, L to I, V to S, H to E, D to A, V to S, B to Y (since $1 - 3 = -2 \equiv 24$). Plaintext: THISISEASY ("this is easy").`,
          rubric: [ { points: 1, text: R`Correct plaintext THISISEASY, including the wrap-around B to Y` } ] },
        { label: "b", points: 2,
          prompt: R`You intercept the shift-cipher ciphertext HAAHJR with an unknown key. Describe the attack and find the key and the plaintext.`,
          hints: [R`How many keys are there?`, R`The pattern of letters 1 and 4 being equal, and 2 and 3 being equal, survives encryption.`, R`Try the key that maps A to H.`],
          solution: R`There are only 26 keys, so we use a **brute-force attack**: decrypt with every $k \in \{0, \dots, 25\}$ and keep the decryption that makes sense. For $k = 7$ ($A \mapsto H$): H to A, A to T ($0 - 7 \equiv 19$), A to T, H to A, J to C, R to K, giving ATTACK. All other keys give meaningless strings, so the key is $k = 7$ and the plaintext is ATTACK.`,
          rubric: [ { points: 1, text: R`Describes exhaustive search over the 26 keys, choosing the meaningful decryption` },
                    { points: 1, text: R`Finds $k = 7$ and plaintext ATTACK` } ] },
        { label: "c", points: 2,
          prompt: R`Give the number of keys of (i) the shift cipher, (ii) the monoalphabetic substitution cipher, (iii) the Vigenère cipher with period 5. Explain why (ii) is insecure despite its key space.`,
          hints: [R`A substitution key is a permutation of the alphabet.`, R`Vigenère: each of the 5 key letters is a shift.`, R`What does a substitution cipher not change about the text?`],
          solution: R`(i) 26. (ii) $26! > 2^{88}$, the number of permutations of the alphabet. (iii) $26^5$, one shift per key position.

The substitution cipher is insecure although brute force is infeasible: it maps every occurrence of a letter to the same ciphertext letter, so **letter frequencies are preserved**. Matching the most frequent ciphertext letters with the most frequent English letters (e, t, a, ...) reveals $\pi$. A large key space is necessary but not sufficient.`,
          rubric: [ { points: 1, text: R`All three key-space sizes correct ($26$, $26!$, $26^5$)` },
                    { points: 1, text: R`Explains frequency analysis: letter frequencies are preserved` } ] }
      ] },

    { id: "l1-prob-vigenere", type: "problem", lecture: 1, topic: "historical", origin: "slides",
      source: "Lecture 1, slides 21–29", difficulty: 2,
      title: "Vigenère and scytale",
      mock: false,
      statement: R`Identify $A, \dots, Z$ with $0, \dots, 25$.`,
      parts: [
        { label: "a", points: 1,
          prompt: R`Encrypt CRYPTO with the Vigenère cipher under the key KEY.`,
          hints: [R`K, E, Y are the shifts 10, 4, 24, repeated.`],
          solution: R`Shifts $10, 4, 24, 10, 4, 24$: C$(2) + 10 = 12$ (M), R$(17) + 4 = 21$ (V), Y$(24) + 24 = 48 \equiv 22$ (W), P$(15) + 10 = 25$ (Z), T$(19) + 4 = 23$ (X), O$(14) + 24 = 38 \equiv 12$ (M). Ciphertext: MVWZXM.`,
          rubric: [ { points: 1, text: R`Correct ciphertext MVWZXM` } ] },
        { label: "b", points: 2,
          prompt: R`An attacker has a long English Vigenère ciphertext and knows that the key has length $\ell = 3$. Explain how she recovers the key.`,
          hints: [R`Which positions are shifted by the same key letter?`, R`Each such group is a ciphertext of which cipher?`],
          solution: R`Split the ciphertext into 3 streams: positions $1, 4, 7, \dots$, positions $2, 5, 8, \dots$ and positions $3, 6, 9, \dots$. Within one stream every letter was shifted by the same key letter, so each stream is a **shift-cipher** ciphertext of (a sample of) English text. For each stream, find the most frequent letter, which most likely encrypts e (or compare the full frequency distribution with English, or simply try all 26 shifts per stream); the difference gives that key letter. Together the three shifts give the key.`,
          rubric: [ { points: 1, text: R`Splits into $\ell = 3$ streams of positions congruent mod 3, each a shift cipher` },
                    { points: 1, text: R`Recovers each shift by frequency analysis (or trying 26 shifts per stream)` } ] },
        { label: "c", points: 1,
          prompt: R`Why does single-letter frequency analysis not reveal anything about the key of a scytale, and how is a scytale broken instead?`,
          hints: [R`Does the scytale change any letter?`],
          solution: R`The scytale is a permutation (transposition) cipher: it only rearranges the letters, so the ciphertext has exactly the same letter frequencies as the plaintext and they carry no information about the key. It is broken by brute force: only a few circumferences $k$ are possible, so one tries each $k$ (write the ciphertext column by column into $k$ rows and read the rows) until readable text appears.`,
          rubric: [ { points: 1, text: R`Frequencies unchanged by a permutation; break by trying the few possible circumferences` } ] }
      ] }
  );

  // =====================================================================
  // LECTURE 2: modern cryptography, OTP, perfect secrecy, Shannon
  // =====================================================================

  // ---------------------------- notes ----------------------------------
  add(
    { id: "l2-note-provable", type: "note", lecture: 2, topic: "principles", origin: "slides",
      source: "Lecture 2, slides 2–8", difficulty: 1,
      title: "Modern cryptography and provable security",
      order: 10,
      body: R`### Milestones (slide 2)

Vernam cipher (1917); information theory and perfect secrecy (Shannon 1949); DES encryption standard (Feistel, 1977); public-key cryptography (Diffie, Hellman 1976); RSA (1978); semantic security (Goldwasser, Micali 1984); digital signatures (Goldwasser, Micali, Rivest 1986); later AES (2000), SHA-2, SHA-3. Around 1980 cryptography turned from an **art** into a **science**.

### Provable security (a.k.a. reductionist security)

Three ingredients:

1. **Definitions:** what is the *security goal* and what is the *threat model* (e.g. "find the message, after seeing several encryptions"). Definitions let us understand what we want to achieve, evaluate and compare schemes, and use schemes as components (modularity).
2. **Assumptions:** precisely stated computational assumptions, i.e. the impossibility of solving a certain problem *efficiently* (e.g. factoring large integers is hard). Being precise allows them to be studied, validated and compared.
3. **Security proof:** a mathematical proof that the construction achieves the *definition* under the *assumptions*.

### Why assumptions are needed

Security of any (interesting) cryptographic scheme **implies $P \neq NP$**, which nobody can prove; hence security proofs need **hardness assumptions**. Public-key crypto relies on "mathematical" assumptions (factoring, discrete logarithm, ...); symmetric crypto is typically **ad hoc** (e.g. "DES/AES is secure").

### A provably secure scheme can still fail if

- the **assumption was wrong** (e.g. quantum computers efficiently factor), or
- the **definition did not reflect the real requirements** (e.g. the scheme is secure when a key is used only once, but the adversary saw two ciphertexts).

**Advantages:** well-defined problems to analyse; the security of a *new* scheme is based on *well-studied* assumptions.` },

    { id: "l2-note-secdefs", type: "note", lecture: 2, topic: "principles", origin: "slides",
      source: "Lecture 2, slide 10", difficulty: 1,
      title: "Security definitions: adversary goals and power",
      order: 20,
      body: R`A security definition fixes (i) what counts as a break (the adversary's **goal**) and (ii) what the adversary can do (its **power**). By **Kerckhoffs' principle** the adversary always knows the scheme.

### Adversary's goals (from weak to strong requirement)

- Find the key? Not enough: $\mathsf{Enc}(k, m) := m$ hides the key perfectly but reveals the message.
- Recover the plaintext? Not enough: $\mathsf{Enc}(k, m_1 \| m_2) := \mathsf{AES}(k, m_1) \| m_2$ may prevent recovering all of $m$, yet reveals half of it.
- Guess a single letter of the plaintext? Still not enough.
- **Obtain any information about the plaintext**: this is what a good definition must rule out.

### Adversary's power (threat models)

- Sees ciphertexts, one or many (ciphertext-only / eavesdropping).
- Has seen plaintext/ciphertext pairs (known-plaintext attack).
- Has chosen the plaintexts (chosen-plaintext attack, CPA).
- ... and can ask for decryptions (chosen-ciphertext attack, CCA).

Perfect secrecy (this lecture) uses the strongest goal and the weakest power: the adversary sees **one** ciphertext but has **unbounded** computing power.` },

    { id: "l2-note-otp", type: "note", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 12–13", difficulty: 1,
      title: "The one-time pad",
      order: 30,
      body: R`### Background

Used for the "red phone" between the Kremlin and the White House. Perfectly secure (if used correctly) but **not practical**.

### XOR

$x \oplus y = (x + y) \bmod 2$: $0 \oplus 0 = 0$, $0 \oplus 1 = 1 \oplus 0 = 1$, $1 \oplus 1 = 0$. On bit strings it is applied bitwise. Key rules: $x \oplus x = 0^\ell$, $x \oplus 0^\ell = x$, XOR is associative and commutative.

### The scheme (message space $\mathcal{M} := \{0,1\}^\ell$)

- $\mathsf{Gen}(\ell)$: choose a **uniformly random** $\ell$-bit string $k \gets \{0,1\}^\ell$ and return it.
- $\mathsf{Enc}(k, m)$ for $k, m \in \{0,1\}^\ell$: $c_i := k_i \oplus m_i$ for $i = 1, \dots, \ell$, i.e. $c := k \oplus m$.
- $\mathsf{Dec}(k, c)$ for $k, c \in \{0,1\}^\ell$: $m_i := k_i \oplus c_i$, i.e. $m := k \oplus c$.

So $\mathcal{K} = \mathcal{M} = \mathcal{C} = \{0,1\}^\ell$.

### Correctness

$$\mathsf{Dec}(k, \mathsf{Enc}(k, m)) = k \oplus (k \oplus m) = (k \oplus k) \oplus m = 0^\ell \oplus m = m.$$

Example from the slide: $m = 000111101$, $k = 100101100$, $c = 100010001$. The letter version (Vernam) is $c_i = (m_i + k_i) \bmod 26$.

Security? We first need a **definition**: perfect secrecy.` },

    { id: "l2-note-probability", type: "note", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 14 (Katz–Lindell §A.3)", difficulty: 1,
      title: "Probability toolkit for perfect secrecy",
      order: 40,
      body: R`- **Random variable** $X$; $\Pr[X = x]$ is the probability that $X$ takes value $x$.
- **Conditional probability:**
$$\Pr[X = x \mid Y = y] := \frac{\Pr[X = x \wedge Y = y]}{\Pr[Y = y]} \quad (\text{needs } \Pr[Y = y] > 0).$$
- **Bayes' theorem:**
$$\Pr[X = x \mid Y = y] = \Pr[Y = y \mid X = x] \cdot \frac{\Pr[X = x]}{\Pr[Y = y]}.$$
- **Independence:** if $X$ and $Y$ are independent then for all $x, y$: $\Pr[X = x \mid Y = y] = \Pr[X = x]$.
- **Total probability:** $\sum_{y_i} \Pr[Y = y_i] = 1$, hence
$$\Pr[X = x] = \sum_{y_i} \Pr[X = x \mid Y = y_i] \cdot \Pr[Y = y_i].$$

These three tools (independence of $K$ and $M$, total probability, Bayes) are exactly the steps of the proof that the one-time pad is perfectly secret.` },

    { id: "l2-note-perfect-secrecy", type: "note", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 15–17", difficulty: 2,
      title: "Perfect secrecy: definition and Example 2.1",
      order: 50,
      body: R`### Intuition

*Regardless of any information an attacker already has, a ciphertext should leak no additional information about the underlying plaintext.*

### The random variables

- $M$: the message, representing what the attacker **already knows** about it (its a-priori distribution), e.g. $\Pr[M = \text{buy}] = 0.7$, $\Pr[M = \text{sell}] = 0.3$.
- $K$: the key, $\Pr[K = k] = \Pr[k \gets \mathsf{Gen}]$. **$K$ and $M$ are independent.**
- $C$: the resulting ciphertext: choose $m$ from distribution $M$, $k \gets \mathsf{Gen}$, $c \gets \mathsf{Enc}_k(m)$.

### Example 2.1 (shift cipher, one letter)

$k \in \{0, \dots, 25\}$ uniform. With $\Pr[M = B] = 0.7$, $\Pr[M = D] = 0.3$:
$$\Pr[C = F] = \Pr[M = B \wedge K = 4] + \Pr[M = D \wedge K = 2] = 0.7 \cdot \tfrac{1}{26} + 0.3 \cdot \tfrac{1}{26} = \tfrac{1}{26}.$$
With $\Pr[M = B] = 0.1$, $\Pr[M = D] = 0.9$ and $C = G$ (keys 5 and 3) the result is again $\tfrac{1}{26}$: the ciphertext distribution does not depend on the message distribution.

### Definition 2.3 (perfect secrecy)

An encryption scheme with message space $\mathcal{M}$ is **perfectly secret** if for **every** probability distribution over $\mathcal{M}$, **every** $m \in \mathcal{M}$ and **every** ciphertext $c$ with $\Pr[C = c] > 0$:
$$\Pr[M = m \mid C = c] = \Pr[M = m].$$

The a-posteriori probability (after seeing $c$) equals the a-priori probability. **Adversary's power:** sees only **one** ciphertext; no bound on its computing time.

### Equivalent formulation (Katz–Lindell Lemma 2.5, often used in exercises)

$\Pi$ is perfectly secret iff for all $m, m' \in \mathcal{M}$ and all $c \in \mathcal{C}$:
$$\Pr[\mathsf{Enc}_K(m) = c] = \Pr[\mathsf{Enc}_K(m') = c],$$
probability over $K \gets \mathsf{Gen}$ and the randomness of $\mathsf{Enc}$. In words: the ciphertext distribution is the same for every message.

### How to show a scheme is NOT perfectly secret

Pick a concrete distribution (usually uniform over $\mathcal{M}$), a message $m$ and a ciphertext $c$ with $\Pr[C = c] > 0$ such that $\Pr[M = m \mid C = c] \neq \Pr[M = m]$. Typical case: $c$ can never be an encryption of $m$, so $\Pr[M = m \mid C = c] = 0 < \Pr[M = m]$.

### Exam traps

- "For every distribution": checking only the uniform distribution is not enough to *prove* perfect secrecy (though one bad distribution is enough to *disprove* it).
- Only ciphertexts with $\Pr[C = c] > 0$ are considered (otherwise the conditional probability is undefined).` },

    { id: "l2-note-perfect-indist", type: "note", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 4, slides 10–11 (Def. 2.6, Lemma 2.7)", difficulty: 2,
      title: "Perfect indistinguishability (Def. 2.6) and Lemma 2.7",
      order: 60,
      body: R`(These slides open lecture 4, but the material is §2 of Katz–Lindell and belongs with perfect secrecy.)

### The adversarial indistinguishability experiment $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}$, for $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$

1. The adversary $\mathcal{A}$ outputs two messages $m_0, m_1 \in \mathcal{M}$.
2. The challenger generates $k \gets \mathsf{Gen}$, chooses a uniform bit $b \gets \{0,1\}$, computes $c \gets \mathsf{Enc}_k(m_b)$ and gives $c$ to $\mathcal{A}$.
3. $\mathcal{A}$ outputs a bit $b'$.
4. $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi} = 1$ iff $b' = b$ (and 0 otherwise).

### Definition 2.6

$\Pi$ is **perfectly indistinguishable** if for **every** adversary $\mathcal{A}$:
$$\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi} = 1] = \tfrac12.$$

No adversary, even with unlimited computing power, can do better than guessing $b$. There is **no** negligible slack here and no security parameter; the computational version (lecture 4) relaxes to p.p.t. adversaries and $\le \tfrac12 + \mathsf{negl}(n)$.

### Lemma 2.7

An encryption scheme is perfectly secret **if and only if** it is perfectly indistinguishable.

**Proof idea.** If $\Pi$ is perfectly secret, the ciphertext distribution is the same for $m_0$ and $m_1$ (Lemma 2.5), so $c$ is independent of $b$ and every $\mathcal{A}$ wins with probability exactly $\tfrac12$. Conversely, if $\Pi$ is not perfectly secret, there are $m_0, m_1, c^*$ with $p_0 := \Pr[\mathsf{Enc}_K(m_0) = c^*] > p_1 := \Pr[\mathsf{Enc}_K(m_1) = c^*]$; the adversary that outputs $m_0, m_1$ and then $b' = 0$ iff $c = c^*$ wins with probability $\tfrac12 p_0 + \tfrac12 (1 - p_1) = \tfrac12 + \tfrac12(p_0 - p_1) > \tfrac12$.` },

    { id: "l2-note-otp-proof", type: "note", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 18", difficulty: 3,
      title: "Theorem 2.10: the one-time pad is perfectly secret (proof)",
      order: 70,
      body: R`**Theorem 2.10.** The one-time pad ($\mathsf{Gen}(\ell)$: $k \gets \{0,1\}^\ell$; $\mathsf{Enc}_k(m) := k \oplus m$; $\mathsf{Dec}_k(c) := k \oplus c$) is perfectly secret, i.e. for all distributions $M$ and all $m, c$ (with $\Pr[C = c] > 0$): $\Pr[M = m \mid C = c] = \Pr[M = m]$.

### Proof

Keys are uniform, so
$$\Pr[K = k] = 1/2^\ell \text{ for all } k. \qquad (1)$$

Let the distribution $M$, the message $m$ and the ciphertext $c$ be arbitrary but fixed. Then
$$\begin{aligned} \Pr[C = c \mid M = m] &= \Pr[K \oplus M = c \mid M = m] = \Pr[K \oplus m = c \mid M = m] \\ &= \Pr[K = m \oplus c \mid M = m] \overset{K, M \text{ indep.}}{=} \Pr[K = m \oplus c] \overset{(1)}{=} 1/2^\ell. \qquad (2) \end{aligned}$$

By total probability,
$$\Pr[C = c] = \sum_{m'} \Pr[C = c \mid M = m'] \cdot \Pr[M = m'] \overset{(2)}{=} \frac{1}{2^\ell} \sum_{m'} \Pr[M = m'] = 1/2^\ell. \qquad (3)$$

By Bayes,
$$\Pr[M = m \mid C = c] = \frac{\Pr[C = c \mid M = m] \cdot \Pr[M = m]}{\Pr[C = c]} \overset{(2),(3)}{=} \Pr[M = m]. \qquad \square$$

### What to remember

- The proof needs exactly: uniform key, independence of $K$ and $M$, and the fact that for every $m, c$ there is exactly one key $k = m \oplus c$.
- Side result (3): the OTP ciphertext is **uniform** over $\{0,1\}^\ell$, whatever the message distribution.
- The same proof works for the shift cipher on a single letter (one-time pad over $\{0, \dots, 25\}$ with addition mod 26) and for the Vernam cipher on letters.` },

    { id: "l2-note-key-reuse", type: "note", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 19–20", difficulty: 2,
      title: "Using the one-time pad twice, and its drawbacks",
      order: 80,
      body: R`### What if the key is used twice?

$$c = k \oplus m, \quad c' = k \oplus m' \quad \Rightarrow \quad c \oplus c' = \underbrace{k \oplus k}_{= 0^\ell} \oplus m \oplus m' = m \oplus m'.$$

The adversary learns $m \oplus m'$ without knowing $k$. This is bad: e.g. if $m$ is "buy" or "sell" (encoded B or S) and $m'$ is "yes" or "no" (encoded Y or N), and the four possible values of $m \oplus m'$ are distinct, then $c \oplus c'$ reveals **both** messages. More generally, if one of the two messages is known, the other one is revealed, and so is the key ($k = c \oplus m$).

In terms of the definition: encrypting two $\ell$-bit messages with one $\ell$-bit key is a scheme with $2^{2\ell}$ message pairs but only $2^\ell$ keys, so by Theorem 2.11 it cannot be perfectly secret.

### Drawbacks of the one-time pad

- the key is as **long** as the message;
- the key can only be used **once**.

Consequences: it requires long truly random values, and creates problems of key distribution and key destruction.

Lecture 2, slide 21 shows these drawbacks are not specific to the OTP: they hold **for any perfectly secret encryption scheme**.` },

    { id: "l2-note-limitations", type: "note", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 21", difficulty: 3,
      title: "Limitations of perfect secrecy: Theorem 2.11 and Shannon's theorem",
      order: 90,
      body: R`### Theorem 2.11

For any perfectly secret encryption scheme: $|\mathcal{K}| \ge |\mathcal{M}|$.

**Proof idea.** Suppose $|\mathcal{K}| < |\mathcal{M}|$. Take $M$ uniform over $\mathcal{M}$ and a ciphertext $c$ with $\Pr[C = c] > 0$. Let $\mathcal{M}(c) := \{\mathsf{Dec}_k(c) : k \in \mathcal{K}\}$ be the set of messages $c$ could decrypt to. Then $|\mathcal{M}(c)| \le |\mathcal{K}| < |\mathcal{M}|$, so some $m' \in \mathcal{M}$ is not in $\mathcal{M}(c)$. By correctness, if $c$ were an encryption of $m'$ under some key $k$, then $m' = \mathsf{Dec}_k(c) \in \mathcal{M}(c)$; hence $\Pr[M = m' \mid C = c] = 0 \neq 1/|\mathcal{M}| = \Pr[M = m']$, contradicting perfect secrecy.

For $\mathcal{M} = \{0,1\}^\ell$ this means keys must have at least $\ell$ bits: the key is as long as the message, and it can only be used once (two messages under one key are a message space of size $2^{2\ell}$).

### Theorem 2.12 (Shannon)

An encryption scheme with $|\mathcal{M}| = |\mathcal{K}| = |\mathcal{C}|$ is perfectly secret **if and only if**

1. every key is **equiprobable** (chosen with probability $1/|\mathcal{K}|$ by $\mathsf{Gen}$), **and**
2. for all $m \in \mathcal{M}$ and $c \in \mathcal{C}$ there is a **unique** key $k$ such that $\mathsf{Enc}_k(m) = c$.

**Proof idea** (for deterministic $\mathsf{Enc}$). ($\Leftarrow$) As for the OTP: $\Pr[C = c \mid M = m] = \Pr[K = k_{m,c}] = 1/|\mathcal{K}|$ for every $m$, so $\Pr[C = c] = 1/|\mathcal{K}|$ and Bayes gives $\Pr[M = m \mid C = c] = \Pr[M = m]$. ($\Rightarrow$) Perfect secrecy forces every $c \in \mathcal{C}$ to be reachable from every $m$; since $|\mathcal{K}| = |\mathcal{C}|$, for fixed $m$ the map $k \mapsto \mathsf{Enc}_k(m)$ is a bijection, giving uniqueness. For fixed $c$, the keys $k_{m,c}$ are distinct for distinct $m$ (correctness) and so run through all of $\mathcal{K}$; perfect secrecy gives $\Pr[K = k_{m,c}] = \Pr[C = c \mid M = m] = \Pr[C = c]$ for all $m$, so all keys are equally likely.

### Exam traps

- Shannon needs **both** conditions; uniqueness of the key alone (with non-uniform keys) is not enough. Example: $\mathsf{Enc}_k(m) = (m + k) \bmod 3$ with a biased key.
- Shannon only applies when $|\mathcal{M}| = |\mathcal{K}| = |\mathcal{C}|$. A perfectly secret scheme with $|\mathcal{K}| > |\mathcal{M}|$ need not have uniform keys (e.g. an OTP key with an extra, ignored, biased bit).
- Theorem 2.11 is a necessary condition only: $|\mathcal{K}| \ge |\mathcal{M}|$ does not imply perfect secrecy.

### Moral

Perfect secrecy gives security against adversaries with **infinite power**, but forces long, single-use keys. For **practical** schemes we settle for security against **bounded** adversaries: computational security (lecture 4).` }
  );

  // ---------------------------- cards ----------------------------------
  add(
    { id: "l2-card-01", type: "card", lecture: 2, topic: "principles", origin: "slides",
      source: "Lecture 2, slide 5", difficulty: 1,
      front: R`What are the three ingredients of provable security?`,
      back: R`**Definitions** (security goal and threat model), **assumptions** (precise computational hardness assumptions) and a **security proof** that the construction achieves the definition under the assumptions.` },
    { id: "l2-card-02", type: "card", lecture: 2, topic: "principles", origin: "slides",
      source: "Lecture 2, slide 8", difficulty: 1,
      front: R`Why can a provably secure scheme still fail in practice?`,
      back: R`The assumption was wrong (e.g. quantum computers factor efficiently), or the definition did not reflect the real requirements (e.g. secure when the key is used once, but the adversary saw two ciphertexts).` },
    { id: "l2-card-03", type: "card", lecture: 2, topic: "principles", origin: "slides",
      source: "Lecture 2, slide 7", difficulty: 2,
      front: R`Why does cryptography need hardness assumptions?`,
      back: R`Security of any interesting cryptographic scheme implies $P \neq NP$, which is unproven. So proofs must assume that certain problems cannot be solved efficiently.` },
    { id: "l2-card-04", type: "card", lecture: 2, topic: "principles", origin: "slides",
      source: "Lecture 2, slide 10", difficulty: 2,
      front: R`Why is "the adversary cannot find the key" a bad security goal?`,
      back: R`$\mathsf{Enc}(k, m) := m$ never reveals the key but reveals the whole message. The right goal: the adversary obtains no information about the plaintext.` },
    { id: "l2-card-05", type: "card", lecture: 2, topic: "principles", origin: "slides",
      source: "Lecture 2, slide 10", difficulty: 2,
      front: R`Why is "the adversary cannot recover the whole plaintext" a bad security goal?`,
      back: R`$\mathsf{Enc}(k, m_1 \| m_2) := \mathsf{AES}(k, m_1) \| m_2$ may hide $m_1$, so the full plaintext is not recovered, yet it reveals $m_2$, half of the message.` },
    { id: "l2-card-06", type: "card", lecture: 2, topic: "principles", origin: "slides",
      source: "Lecture 2, slide 10", difficulty: 1,
      front: R`List the levels of adversarial power from the lecture.`,
      back: R`Sees ciphertexts (one or many); has seen plaintext/ciphertext pairs; has chosen the plaintexts; and can additionally ask for decryptions.` },
    { id: "l2-card-07", type: "card", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 13", difficulty: 1,
      front: R`Define the one-time pad.`,
      back: R`$\mathcal{M} = \mathcal{K} = \mathcal{C} = \{0,1\}^\ell$. $\mathsf{Gen}$: uniform $k \gets \{0,1\}^\ell$. $\mathsf{Enc}_k(m) := k \oplus m$. $\mathsf{Dec}_k(c) := k \oplus c$. Correct since $k \oplus k \oplus m = m$.` },
    { id: "l2-card-08", type: "card", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 17", difficulty: 1,
      front: R`State the definition of perfect secrecy (Def. 2.3).`,
      back: R`For every probability distribution over $\mathcal{M}$, every $m \in \mathcal{M}$ and every $c$ with $\Pr[C = c] > 0$: $\Pr[M = m \mid C = c] = \Pr[M = m]$.` },
    { id: "l2-card-09", type: "card", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 4, slides 10–11 (Def. 2.6)", difficulty: 2,
      front: R`Define perfect indistinguishability.`,
      back: R`In $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}$: $\mathcal{A}$ outputs $m_0, m_1 \in \mathcal{M}$; $k \gets \mathsf{Gen}$, $b \gets \{0,1\}$, $c \gets \mathsf{Enc}_k(m_b)$ given to $\mathcal{A}$; $\mathcal{A}$ outputs $b'$; output 1 iff $b' = b$. $\Pi$ is perfectly indistinguishable if for every $\mathcal{A}$: $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi} = 1] = \tfrac12$. By Lemma 2.7 this is equivalent to perfect secrecy.` },
    { id: "l2-card-10", type: "card", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 18", difficulty: 2,
      front: R`What are the three steps of the proof that the OTP is perfectly secret?`,
      back: R`(1) $\Pr[C = c \mid M = m] = \Pr[K = m \oplus c] = 2^{-\ell}$ (independence of $K$ and $M$, uniform key). (2) Total probability: $\Pr[C = c] = 2^{-\ell}$. (3) Bayes: $\Pr[M = m \mid C = c] = \Pr[M = m]$.` },
    { id: "l2-card-11", type: "card", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 19", difficulty: 1,
      front: R`What does an eavesdropper learn if the OTP key is used for two messages $m, m'$?`,
      back: R`$c \oplus c' = (k \oplus m) \oplus (k \oplus m') = m \oplus m'$. If one message is known, the other (and the key) follow; often both can be deduced from $m \oplus m'$ alone.` },
    { id: "l2-card-12", type: "card", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 20–21", difficulty: 1,
      front: R`What are the two drawbacks of the one-time pad, and do they apply to other perfectly secret schemes?`,
      back: R`The key is as long as the message, and it can be used only once (hence long true randomness, key distribution, key destruction). By Theorem 2.11 these hold for any perfectly secret scheme.` },
    { id: "l2-card-13", type: "card", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 21", difficulty: 1,
      front: R`State Theorem 2.11.`,
      back: R`For any perfectly secret encryption scheme, $|\mathcal{K}| \ge |\mathcal{M}|$.` },
    { id: "l2-card-14", type: "card", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 21", difficulty: 1,
      front: R`State Shannon's theorem (Theorem 2.12).`,
      back: R`A scheme with $|\mathcal{M}| = |\mathcal{K}| = |\mathcal{C}|$ is perfectly secret iff (1) every key is equiprobable and (2) for all $m$ and $c$ there is a unique $k$ with $\mathsf{Enc}_k(m) = c$.` },
    { id: "l2-card-15", type: "card", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 14", difficulty: 1,
      front: R`State Bayes' theorem and the law of total probability.`,
      back: R`$\Pr[X = x \mid Y = y] = \Pr[Y = y \mid X = x] \cdot \Pr[X = x] / \Pr[Y = y]$. $\Pr[X = x] = \sum_{y_i} \Pr[X = x \mid Y = y_i] \cdot \Pr[Y = y_i]$.` },
    { id: "l2-card-16", type: "card", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 15–17", difficulty: 2,
      front: R`How do you show that a scheme is NOT perfectly secret?`,
      back: R`Give one distribution over $\mathcal{M}$ (e.g. uniform), a message $m$ and a ciphertext $c$ with $\Pr[C = c] > 0$ such that $\Pr[M = m \mid C = c] \neq \Pr[M = m]$, typically $0$ because $c$ can never encrypt $m$.` },
    { id: "l2-card-17", type: "card", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 17, 21", difficulty: 2,
      front: R`Against which adversaries is a perfectly secret scheme secure, and what is the price?`,
      back: R`Against adversaries with unlimited computing power who see one ciphertext. Price: keys at least as long as messages, used only once. Practical schemes therefore aim for security against bounded adversaries.` }
  );

  // ---------------------------- true/false -----------------------------
  add(
    { id: "l2-tf-01", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 17", difficulty: 2,
      statement: R`To prove that a scheme is perfectly secret, it suffices to find one probability distribution over $\mathcal{M}$ for which $\Pr[M = m \mid C = c] = \Pr[M = m]$ holds for all $m$ and all $c$ with $\Pr[C = c] > 0$.`,
      answer: false,
      explanation: R`Definition 2.3 quantifies over every probability distribution over $\mathcal{M}$. For the distribution that puts all probability on a single message $m^*$, the equation holds for every scheme, even $\mathsf{Enc}_k(m) := m$. One distribution only suffices to **disprove** perfect secrecy.` },
    { id: "l2-tf-02", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 19", difficulty: 1,
      statement: R`The one-time pad remains perfectly secret if the same key is used to encrypt two different messages.`,
      answer: false,
      explanation: R`From $c = k \oplus m$ and $c' = k \oplus m'$ the adversary computes $c \oplus c' = m \oplus m'$. Formally, two $\ell$-bit messages with one $\ell$-bit key violate $|\mathcal{K}| \ge |\mathcal{M}|$ ($2^\ell < 2^{2\ell}$).` },
    { id: "l2-tf-03", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 21", difficulty: 1,
      statement: R`Every perfectly secret encryption scheme satisfies $|\mathcal{K}| \ge |\mathcal{M}|$.`,
      answer: true,
      explanation: R`This is Theorem 2.11: if $|\mathcal{K}| < |\mathcal{M}|$, a ciphertext can decrypt to at most $|\mathcal{K}|$ messages, so some message has a-posteriori probability 0 under the uniform distribution.` },
    { id: "l2-tf-04", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 21", difficulty: 1,
      statement: R`Every encryption scheme with $|\mathcal{K}| \ge |\mathcal{M}|$ is perfectly secret.`,
      answer: false,
      explanation: R`Theorem 2.11 is only a necessary condition. Counterexample: $\mathsf{Enc}_k(m) := m$ with any large key space is correct but reveals $m$ completely.` },
    { id: "l2-tf-05", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 21", difficulty: 3,
      statement: R`In every perfectly secret encryption scheme, $\mathsf{Gen}$ chooses every key in $\mathcal{K}$ with the same probability.`,
      answer: false,
      explanation: R`Shannon's theorem forces uniform keys only when $|\mathcal{M}| = |\mathcal{K}| = |\mathcal{C}|$. Counterexample: OTP key $k \in \{0,1\}^\ell$ plus an extra bit chosen with probability $3/4$ for 0, which $\mathsf{Enc}$ ignores; still $\Pr[C = c \mid M = m] = 2^{-\ell}$, so it is perfectly secret, but keys are not equiprobable.` },
    { id: "l2-tf-06", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 17 (Katz–Lindell Lemma 2.5)", difficulty: 2,
      statement: R`If $\Pi$ is perfectly secret, then for all $m, m' \in \mathcal{M}$ and every ciphertext $c$: $\Pr[\mathsf{Enc}_K(m) = c] = \Pr[\mathsf{Enc}_K(m') = c]$, where the probability is over $K \gets \mathsf{Gen}$ and the randomness of $\mathsf{Enc}$.`,
      answer: true,
      explanation: R`This is the equivalent formulation of perfect secrecy (Lemma 2.5 in Katz–Lindell): the ciphertext distribution does not depend on the message. If it differed for some $m, m', c$, then under the uniform distribution on $\{m, m'\}$ observing $c$ would change the probability of $m$.` },
    { id: "l2-tf-07", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 21", difficulty: 1,
      statement: R`Perfect secrecy holds even against adversaries with unbounded computational power.`,
      answer: true,
      explanation: R`The definition is purely probabilistic and does not restrict the adversary's running time; the slide stresses security "against adversaries with infinite power".` },
    { id: "l2-tf-08", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 17, 19", difficulty: 2,
      statement: R`Perfect secrecy guarantees security even when the adversary sees several ciphertexts encrypted under the same key.`,
      answer: false,
      explanation: R`The definition considers a single ciphertext ("adversary's power: only sees one ciphertext"). The OTP is perfectly secret, yet two ciphertexts under one key reveal $m \oplus m'$.` },
    { id: "l2-tf-09", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 18", difficulty: 2,
      statement: R`For every distribution over the message space, the one-time-pad ciphertext $C$ is uniformly distributed over $\{0,1\}^\ell$.`,
      answer: true,
      explanation: R`In the proof of Theorem 2.10, $\Pr[C = c] = \sum_{m'} \Pr[K = m' \oplus c] \Pr[M = m'] = 2^{-\ell}$ for every $c$, independently of the message distribution.` },
    { id: "l2-tf-10", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 13, 19", difficulty: 2,
      statement: R`Given one plaintext/ciphertext pair $(m, c)$ of the one-time pad, the key can be computed.`,
      answer: true,
      explanation: R`$c = k \oplus m$ gives $k = m \oplus c$. This does not contradict perfect secrecy (which covers one ciphertext and an unknown message), but it shows why the key must never be reused.` },
    { id: "l2-tf-11", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 13, 17", difficulty: 2,
      statement: R`The one-time pad with keys chosen uniformly from $\{0,1\}^\ell \setminus \{0^\ell\}$ (so that a message is never "encrypted to itself") is perfectly secret.`,
      answer: false,
      explanation: R`Now $c = m$ is impossible, so for uniform $M$ we get $\Pr[M = c \mid C = c] = 0 \neq 2^{-\ell} = \Pr[M = c]$. The ciphertext reveals that the message is not $c$.` },
    { id: "l2-tf-12", type: "tf", lecture: 2, topic: "principles", origin: "slides",
      source: "Lecture 2, slide 7", difficulty: 1,
      statement: R`According to the lecture, the security of any (interesting) cryptographic scheme implies $P \neq NP$.`,
      answer: true,
      explanation: R`This is stated on slide 7; it is why security proofs need hardness assumptions, since $P \neq NP$ is unproven.` },
    { id: "l2-tf-13", type: "tf", lecture: 2, topic: "principles", origin: "slides",
      source: "Lecture 2, slide 8", difficulty: 1,
      statement: R`A scheme with a correct security proof can never be broken in practice.`,
      answer: false,
      explanation: R`It can fail if the assumption was wrong (e.g. quantum computers factor efficiently) or if the definition did not reflect the real requirements (e.g. key used twice although the definition covers one use).` },
    { id: "l2-tf-14", type: "tf", lecture: 2, topic: "principles", origin: "slides",
      source: "Lecture 2, slide 7", difficulty: 1,
      statement: R`Symmetric-key cryptography is typically based on mathematical assumptions such as the hardness of factoring, whereas public-key cryptography is typically based on ad-hoc assumptions.`,
      answer: false,
      explanation: R`It is the other way round: public-key crypto relies on "mathematical" problems (factoring, discrete logarithm), symmetric crypto is typically ad hoc (e.g. assuming AES is secure).` },
    { id: "l2-tf-15", type: "tf", lecture: 2, topic: "principles", origin: "slides",
      source: "Lecture 2, slide 10", difficulty: 2,
      statement: R`A scheme from which no adversary can recover the key is necessarily secure.`,
      answer: false,
      explanation: R`$\mathsf{Enc}(k, m) := m$ never reveals the key but reveals the message. A good definition requires that the adversary learns no information about the plaintext.` },
    { id: "l2-tf-16", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 4, slides 10–11 (Def. 2.6)", difficulty: 2,
      statement: R`A scheme is perfectly indistinguishable if every adversary wins $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}$ with probability at most $\tfrac12 + \varepsilon$ for some negligible $\varepsilon$.`,
      answer: false,
      explanation: R`Perfect indistinguishability requires success probability exactly $\tfrac12$ for every (unbounded) adversary. The $\tfrac12 + \mathsf{negl}(n)$ bound for p.p.t. adversaries is the weaker computational notion (EAV-security).` },
    { id: "l2-tf-17", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 15–16", difficulty: 2,
      statement: R`For the shift cipher on single letters with uniform key, $\Pr[C = c] = \tfrac{1}{26}$ for every letter $c$, whatever the distribution of $M$.`,
      answer: true,
      explanation: R`For each message letter $m$ exactly one key ($c - m \bmod 26$) gives $c$, so $\Pr[C = c] = \sum_m \Pr[M = m] \cdot \tfrac{1}{26} = \tfrac{1}{26}$ (Example 2.1).` },
    { id: "l2-tf-18", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 15–21", difficulty: 2,
      statement: R`The shift cipher with a uniform key $k \in \{0, \dots, 25\}$, applied letter by letter to two-letter messages, is perfectly secret.`,
      answer: false,
      explanation: R`Both letters are shifted by the same $k$, so $c = $ AB can never come from $m = $ AA: $\Pr[M = \text{AA} \mid C = \text{AB}] = 0 \neq \Pr[M = \text{AA}]$ for uniform $M$. Also $|\mathcal{K}| = 26 < 676 = |\mathcal{M}|$.` },
    { id: "l2-tf-19", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 1, slides 27–28; Lecture 2, slide 18", difficulty: 2,
      statement: R`A Vigenère cipher whose key letters are chosen independently and uniformly, with key length equal to the message length, is perfectly secret for a single message of that length.`,
      answer: true,
      explanation: R`This is the Vernam cipher, a one-time pad over $\{0, \dots, 25\}$: for each $m, c$ there is exactly one key, chosen with probability $26^{-n}$, so the OTP proof applies (or Shannon's theorem with $|\mathcal{M}| = |\mathcal{K}| = |\mathcal{C}| = 26^n$).` },
    { id: "l2-tf-20", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 20–21", difficulty: 1,
      statement: R`Long keys that can only be used once are a weakness of the one-time pad specifically; other perfectly secret schemes can encrypt $\ell$-bit messages with shorter keys.`,
      answer: false,
      explanation: R`The slide stresses that these drawbacks hold for any perfectly secret scheme: by Theorem 2.11, $|\mathcal{K}| \ge |\mathcal{M}| = 2^\ell$, so keys need at least $\ell$ bits.` },
    { id: "l2-tf-21", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 1, slide 18; Lecture 2, slide 21", difficulty: 3,
      statement: R`There exists a perfectly secret encryption scheme with $|\mathcal{C}| > |\mathcal{K}|$.`,
      answer: true,
      explanation: R`$\mathsf{Enc}$ may be randomized: $\mathsf{Enc}_k(m) := (k \oplus m, r)$ for a fresh uniform bit $r$ is correct and perfectly secret ($\Pr[C = (c, r) \mid M = m] = 2^{-\ell} \cdot \tfrac12$ for all $m$), with $|\mathcal{C}| = 2^{\ell+1} > 2^\ell = |\mathcal{K}|$. Shannon's theorem does not apply since $|\mathcal{K}| \neq |\mathcal{C}|$.` },
    { id: "l2-tf-22", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 21", difficulty: 2,
      statement: R`Consider $\mathcal{M} = \mathcal{K} = \mathcal{C} = \{0, 1, 2\}$ with $\mathsf{Enc}_k(m) = (m + k) \bmod 3$. If $\mathsf{Gen}$ outputs $k = 0$ with probability $\tfrac12$ and $k = 1, 2$ with probability $\tfrac14$ each, the scheme is perfectly secret, because for all $m, c$ there is a unique key with $\mathsf{Enc}_k(m) = c$.`,
      answer: false,
      explanation: R`Shannon's theorem requires both conditions; here the keys are not equiprobable. For uniform $M$: $\Pr[C = 0] = \tfrac13$ and $\Pr[M = 0 \mid C = 0] = \tfrac{(1/2)(1/3)}{1/3} = \tfrac12 \neq \tfrac13$.` },
    { id: "l2-tf-23", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 17; Lecture 1, slide 23", difficulty: 3,
      statement: R`The monoalphabetic substitution cipher with a uniformly random permutation $\pi$ is perfectly secret for the message space of single letters $\{A, \dots, Z\}$.`,
      answer: true,
      explanation: R`For any letters $m, c$, exactly $25!$ of the $26!$ permutations map $m$ to $c$, so $\Pr[\mathsf{Enc}_K(m) = c] = \tfrac{1}{26}$ for every $m$: the ciphertext distribution is independent of the message. (Shannon does not apply since $|\mathcal{K}| = 26! \neq 26$, but perfect secrecy holds.)` },
    { id: "l2-tf-24", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 15", difficulty: 1,
      statement: R`In the setting of perfect secrecy, the key $K$ and the message $M$ are assumed to be independent random variables.`,
      answer: true,
      explanation: R`The slide states this assumption explicitly: the key is generated by $\mathsf{Gen}$ independently of the message. The OTP proof uses it in the step $\Pr[K = m \oplus c \mid M = m] = \Pr[K = m \oplus c]$.` }
  );

  // ---------------------------- multiple choice ------------------------
  add(
    { id: "l2-mc-01", type: "mc", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 17", difficulty: 1,
      question: R`Which condition defines perfect secrecy (for every distribution over $\mathcal{M}$, every $m \in \mathcal{M}$ and every $c$ with $\Pr[C = c] > 0$)?`,
      options: [R`$\Pr[C = c \mid M = m] = \Pr[M = m]$`, R`$\Pr[M = m \mid C = c] = \Pr[M = m]$`, R`$\Pr[M = m \mid C = c] = 1/|\mathcal{M}|$`, R`$\Pr[C = c] = 1/|\mathcal{C}|$`],
      correct: 1,
      explanation: R`Definition 2.3: the a-posteriori probability of every message equals its a-priori probability. Option C would only make sense for the uniform distribution, and option D (uniform ciphertexts) is a property of the OTP, not the definition.` },
    { id: "l2-mc-02", type: "mc", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 15–16 (variant of Example 2.1)", difficulty: 2,
      question: R`Shift cipher on one letter with uniform key $k \in \{0, \dots, 25\}$. Let $\Pr[M = B] = 0.4$ and $\Pr[M = D] = 0.6$. What is $\Pr[C = H]$?`,
      options: [R`$0.4 \cdot \tfrac{1}{26}$`, R`$0.6 \cdot \tfrac{1}{26}$`, R`$\tfrac{1}{26}$`, R`$\tfrac{2}{26}$`],
      correct: 2,
      explanation: R`$\Pr[C = H] = \Pr[M = B \wedge K = 6] + \Pr[M = D \wedge K = 4] = (0.4 + 0.6) \cdot \tfrac{1}{26} = \tfrac{1}{26}$, using independence of $M$ and $K$.` },
    { id: "l2-mc-03", type: "mc", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 15–17 (variant of Example 2.1)", difficulty: 2,
      question: R`In the same setting ($\Pr[M = B] = 0.4$, $\Pr[M = D] = 0.6$, uniform shift key), what is $\Pr[M = B \mid C = H]$?`,
      options: [R`$0.4$`, R`$0.5$`, R`$\tfrac{1}{26}$`, R`$0.6$`],
      correct: 0,
      explanation: R`Bayes: $\Pr[M = B \mid C = H] = \frac{\Pr[C = H \mid M = B] \Pr[M = B]}{\Pr[C = H]} = \frac{(1/26) \cdot 0.4}{1/26} = 0.4$. Seeing the ciphertext does not change the probability: perfect secrecy.` },
    { id: "l2-mc-04", type: "mc", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 19", difficulty: 1,
      question: R`Two messages $m, m'$ are encrypted with the one-time pad under the same key, giving $c$ and $c'$. What does $c \oplus c'$ equal?`,
      options: [R`$k$`, R`$m \oplus m'$`, R`$k \oplus m \oplus m'$`, R`a uniformly random string independent of $m, m'$`],
      correct: 1,
      explanation: R`$c \oplus c' = k \oplus m \oplus k \oplus m' = (k \oplus k) \oplus m \oplus m' = m \oplus m'$.` },
    { id: "l2-mc-05", type: "mc", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 21", difficulty: 2,
      question: R`What is the minimum number of key bits a perfectly secret scheme needs in order to encrypt arbitrary messages from $\{0,1\}^{100}$?`,
      options: [R`$50$`, R`$64$`, R`$100$`, R`$128$`],
      correct: 2,
      explanation: R`By Theorem 2.11, $|\mathcal{K}| \ge |\mathcal{M}| = 2^{100}$, so keys need at least 100 bits; the one-time pad achieves exactly 100.` },
    { id: "l2-mc-06", type: "mc", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 13, 17, 21", difficulty: 2,
      question: R`Which of these schemes is perfectly secret?`,
      options: [R`The OTP on $\{0,1\}^\ell$ with key chosen uniformly from $\{0,1\}^\ell \setminus \{0^\ell\}$`, R`The shift cipher with uniform key applied to two-letter messages`, R`The OTP on $\{0,1\}^\ell$ ($\ell \ge 2$) with key chosen uniformly from $\{0^\ell, 1^\ell\}$`, R`The shift cipher with uniform key applied to single-letter messages`],
      correct: 3,
      explanation: R`Single-letter shift cipher: for each $m, c$ exactly one key, and keys are uniform, so Shannon's theorem applies. A: $c = m$ impossible. B: AA never encrypts to AB. C: only 2 keys for $2^\ell > 2$ messages, violating Theorem 2.11.` },
    { id: "l2-mc-07", type: "mc", lecture: 2, topic: "principles", origin: "slides",
      source: "Lecture 2, slide 8", difficulty: 1,
      question: R`Which of the following is a reason, named in the lecture, why a provably secure scheme can fail in practice?`,
      options: [R`The adversary knows the encryption algorithm.`, R`The underlying hardness assumption turns out to be false.`, R`The key was generated by $\mathsf{Gen}$.`, R`The security proof uses a reduction.`],
      correct: 1,
      explanation: R`A proof only guarantees security under its assumptions and for its definition: a wrong assumption (e.g. quantum computers factoring) or a definition that misses real requirements breaks it. Knowing the algorithm is already part of the model (Kerckhoffs).` },
    { id: "l2-mc-08", type: "mc", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 21", difficulty: 2,
      question: R`Let $|\mathcal{M}| = |\mathcal{K}| = |\mathcal{C}|$. By Shannon's theorem, the scheme is perfectly secret if and only if ...`,
      options: [R`for all $m, c$ there is a unique $k$ with $\mathsf{Enc}_k(m) = c$.`, R`every key is equiprobable.`, R`every key is equiprobable and for all $m, c$ there is a unique $k$ with $\mathsf{Enc}_k(m) = c$.`, R`every key is equiprobable and the ciphertexts are uniform for the uniform message distribution.`],
      correct: 2,
      explanation: R`Both conditions are required. Uniqueness alone fails with a biased key; equiprobable keys alone fail e.g. for $\mathsf{Enc}_k(m) := m$ (no key maps $m$ to $c \neq m$).` },
    { id: "l2-mc-09", type: "mc", lecture: 2, topic: "principles", origin: "slides",
      source: "Lecture 2, slide 10", difficulty: 1,
      question: R`What should a good security definition for encryption guarantee that the adversary cannot do?`,
      options: [R`Find the key`, R`Recover the entire plaintext`, R`Guess the first letter of the plaintext with certainty`, R`Obtain any information about the plaintext`],
      correct: 3,
      explanation: R`The weaker goals are inadequate: $\mathsf{Enc}(k, m) := m$ hides the key, and $\mathsf{AES}(k, m_1) \| m_2$ may hide the full plaintext while leaking half of it. The goal highlighted on the slide is "obtain any information about the plaintext".` }
  );

  // ---------------------------- gaps -----------------------------------
  add(
    { id: "l2-gap-perfect-secrecy", type: "gap", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 15–17 (Def. 2.3)", difficulty: 1,
      title: "Perfect secrecy", points: 5,
      text: R`Let $M$ be the random variable for the message, $K$ the key chosen by $\mathsf{Gen}$ <gap>independently of $M$</gap>, and $C$ the resulting ciphertext $c \gets \mathsf{Enc}_K(M)$.

An encryption scheme $(\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ with message space $\mathcal{M}$ is **perfectly secret** if for <gap>every probability distribution over $\mathcal{M}$</gap>, every <gap>$m \in \mathcal{M}$</gap> and every ciphertext $c$ with <gap>$\Pr[C = c] > 0$</gap>:

<gap>$\Pr[M = m \mid C = c] = \Pr[M = m]$</gap>.`,
      note: R`Equivalent: $\Pr[\mathsf{Enc}_K(m) = c] = \Pr[\mathsf{Enc}_K(m') = c]$ for all $m, m', c$. The adversary sees only one ciphertext and is computationally unbounded.` },
    { id: "l2-gap-perfect-indist", type: "gap", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 4, slides 10–11 (Def. 2.6)", difficulty: 2,
      title: "Perfect indistinguishability", points: 5,
      text: R`The adversarial indistinguishability experiment $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}$ for $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$:

1. $\mathcal{A}$ outputs <gap>a pair of messages $m_0, m_1 \in \mathcal{M}$</gap>.
2. A key <gap>$k \gets \mathsf{Gen}$</gap> is generated and a <gap>uniform bit $b \gets \{0,1\}$</gap> is chosen.
3. The challenge ciphertext <gap>$c \gets \mathsf{Enc}_k(m_b)$</gap> is given to $\mathcal{A}$.
4. $\mathcal{A}$ outputs a bit $b'$. The output of the experiment is 1 iff $b' = b$.

$\Pi$ is **perfectly indistinguishable** if for every adversary $\mathcal{A}$: <gap>$\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi} = 1] = \tfrac12$</gap>.`,
      note: R`Lemma 2.7: perfectly secret iff perfectly indistinguishable. No restriction on $\mathcal{A}$'s running time and no negligible slack.` },
    { id: "l2-gap-otp", type: "gap", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 12–13, 18", difficulty: 1,
      title: "One-time pad", points: 5,
      text: R`The one-time pad has message space $\mathcal{M} :=$ <gap>$\{0,1\}^\ell$</gap>.

- $\mathsf{Gen}(\ell)$: <gap>choose a uniformly random $k \gets \{0,1\}^\ell$</gap> and return $k$.
- $\mathsf{Enc}_k(m) :=$ <gap>$k \oplus m$</gap>.
- $\mathsf{Dec}_k(c) :=$ <gap>$k \oplus c$</gap>.

Correctness: $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = k \oplus (k \oplus m) = m$ because <gap>$k \oplus k = 0^\ell$</gap>. By Theorem 2.10 the one-time pad is perfectly secret.` },
    { id: "l2-gap-shannon", type: "gap", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 21 (Thm. 2.11, 2.12)", difficulty: 2,
      title: "Limitations of perfect secrecy and Shannon's theorem", points: 5,
      text: R`**Theorem 2.11.** For any perfectly secret encryption scheme: <gap>$|\mathcal{K}| \ge |\mathcal{M}|$</gap>.

**Theorem 2.12 (Shannon).** An encryption scheme with <gap>$|\mathcal{M}| = |\mathcal{K}| = |\mathcal{C}|$</gap> is perfectly secret <gap>if and only if</gap>

- <gap>every key is equiprobable (chosen with probability $1/|\mathcal{K}|$ by $\mathsf{Gen}$)</gap>, and
- <gap>for all $m \in \mathcal{M}$ and $c \in \mathcal{C}$ there is a unique key $k$ such that $\mathsf{Enc}_k(m) = c$</gap>.`,
      note: R`Both conditions are needed. Consequence: the key is as long as the message and can only be used once, for any perfectly secret scheme.` }
  );

  // ---------------------------- problems -------------------------------
  add(
    { id: "l2-prob-biased-mod3", type: "problem", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 17, 21 (variant)", difficulty: 2,
      title: "Addition mod 3 with a biased key",
      mock: true,
      statement: R`Let $\mathcal{M} = \mathcal{K} = \mathcal{C} = \{0, 1, 2\}$. $\mathsf{Gen}$ outputs $k = 0$ with probability $\tfrac12$ and $k = 1$, $k = 2$ with probability $\tfrac14$ each. $\mathsf{Enc}_k(m) := (m + k) \bmod 3$ and $\mathsf{Dec}_k(c) := (c - k) \bmod 3$.`,
      parts: [
        { label: "a", points: 1,
          prompt: R`Show that the scheme is correct.`,
          hints: [R`Compute $\mathsf{Dec}_k(\mathsf{Enc}_k(m))$ modulo 3.`],
          solution: R`For all $k, m \in \{0,1,2\}$: $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = ((m + k) - k) \bmod 3 = m \bmod 3 = m$.`,
          rubric: [ { points: 1, text: R`Correct computation $((m + k) - k) \bmod 3 = m$ for all $k, m$` } ] },
        { label: "b", points: 3,
          prompt: R`Show that the scheme is not perfectly secret. Specify the distribution, the message and the ciphertext you use.`,
          hints: [R`Take the uniform distribution over $\mathcal{M}$.`, R`Which key maps $m$ to $c = 0$, for each $m$?`, R`Compute $\Pr[C = 0]$ by total probability, then $\Pr[M = 0 \mid C = 0]$ by Bayes.`],
          solution: R`Recall: $\Pi$ is perfectly secret iff for every distribution over $\mathcal{M}$, every $m$ and every $c$ with $\Pr[C = c] > 0$: $\Pr[M = m \mid C = c] = \Pr[M = m]$.

Let $M$ be uniform over $\{0,1,2\}$ and consider $m = 0$, $c = 0$. Message $m$ encrypts to $0$ exactly under the key $k = -m \bmod 3$, so (using independence of $K$ and $M$)
$$\Pr[C = 0 \mid M = 0] = \Pr[K = 0] = \tfrac12, \quad \Pr[C = 0 \mid M = 1] = \Pr[K = 2] = \tfrac14, \quad \Pr[C = 0 \mid M = 2] = \Pr[K = 1] = \tfrac14.$$
By total probability, $\Pr[C = 0] = \tfrac13(\tfrac12 + \tfrac14 + \tfrac14) = \tfrac13 > 0$. By Bayes,
$$\Pr[M = 0 \mid C = 0] = \frac{\Pr[C = 0 \mid M = 0] \cdot \Pr[M = 0]}{\Pr[C = 0]} = \frac{\tfrac12 \cdot \tfrac13}{\tfrac13} = \tfrac12 \neq \tfrac13 = \Pr[M = 0].$$
Hence the scheme is not perfectly secret.`,
          rubric: [ { points: 1, text: R`States the definition and fixes an explicit distribution, $m$ and $c$ with $\Pr[C = c] > 0$` },
                    { points: 1, text: R`Correctly computes $\Pr[C = c \mid M = m']$ and $\Pr[C = c]$` },
                    { points: 1, text: R`Concludes with explicit numbers $\Pr[M = m \mid C = c] \neq \Pr[M = m]$` } ] },
        { label: "c", points: 1,
          prompt: R`Which condition of Shannon's theorem is violated? How would you change $\mathsf{Gen}$ to obtain a perfectly secret scheme?`,
          hints: [R`Is the key for given $m, c$ unique? Are the keys equiprobable?`],
          solution: R`Here $|\mathcal{M}| = |\mathcal{K}| = |\mathcal{C}| = 3$ and for every $m, c$ the key $k = (c - m) \bmod 3$ is unique, so the second condition holds; the first condition (every key equiprobable) is violated. If $\mathsf{Gen}$ chooses $k$ uniformly from $\{0,1,2\}$, both conditions hold and the scheme is perfectly secret by Shannon's theorem (it is then a one-time pad over $\mathbb{Z}_3$).`,
          rubric: [ { points: 1, text: R`Identifies non-uniform keys as the violated condition and proposes a uniform key` } ] }
      ] },

    { id: "l2-prob-nonzero-otp", type: "problem", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 13, 17–18 (variant)", difficulty: 3,
      title: "One-time pad without the all-zero key",
      mock: true,
      statement: R`Let $\ell \ge 1$ and consider the one-time pad on $\mathcal{M} = \{0,1\}^\ell$, except that $\mathsf{Gen}$ chooses $k$ uniformly from $\{0,1\}^\ell \setminus \{0^\ell\}$ ("so that no message is sent in the clear"). $\mathsf{Enc}_k(m) := k \oplus m$, $\mathsf{Dec}_k(c) := k \oplus c$.`,
      parts: [
        { label: "a", points: 1,
          prompt: R`Is the scheme correct? Justify briefly.`,
          hints: [R`Does the argument for the ordinary OTP depend on the key distribution?`],
          solution: R`Yes: for every key $k$, $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = k \oplus k \oplus m = m$; the key distribution plays no role.`,
          rubric: [ { points: 1, text: R`Correctness via $k \oplus k = 0^\ell$ for all keys` } ] },
        { label: "b", points: 2,
          prompt: R`Prove that the scheme is not perfectly secret.`,
          hints: [R`When is $\mathsf{Enc}_k(m) = m$?`, R`Use the uniform distribution and the pair $m = c$.`],
          solution: R`Let $M$ be uniform over $\{0,1\}^\ell$ and fix any $c \in \{0,1\}^\ell$. Then $\Pr[C = c] > 0$: pick any $m' \neq c$ (exists since $\ell \ge 1$); the key $m' \oplus c \neq 0^\ell$ has positive probability, so $\Pr[C = c] \ge \Pr[M = m'] \cdot \Pr[K = m' \oplus c] > 0$.

Now consider $m = c$. $\mathsf{Enc}_k(c) = c$ holds only for $k = 0^\ell$, which is never chosen, so $\Pr[M = c \mid C = c] = 0$. But $\Pr[M = c] = 2^{-\ell} > 0$. Hence $\Pr[M = c \mid C = c] \neq \Pr[M = c]$ and the scheme is not perfectly secret.`,
          rubric: [ { points: 1, text: R`Explicit distribution and $c$ with argument that $\Pr[C = c] > 0$` },
                    { points: 1, text: R`$\Pr[M = c \mid C = c] = 0 \neq 2^{-\ell} = \Pr[M = c]$ with reason ($k = 0^\ell$ excluded)` } ] },
        { label: "c", points: 2,
          prompt: R`For uniform $M$, compute $\Pr[M = m \mid C = c]$ for $m \neq c$. How much does the adversary learn?`,
          hints: [R`$\Pr[C = c \mid M = m] = \Pr[K = m \oplus c]$; how many keys are there?`, R`Total probability over the $2^\ell - 1$ messages $m' \neq c$.`],
          solution: R`There are $2^\ell - 1$ keys, each with probability $\tfrac{1}{2^\ell - 1}$. For $m \neq c$: $\Pr[C = c \mid M = m] = \Pr[K = m \oplus c] = \tfrac{1}{2^\ell - 1}$ (since $m \oplus c \neq 0^\ell$), and for $m = c$ it is $0$. Total probability:
$$\Pr[C = c] = \sum_{m' \neq c} \frac{1}{2^\ell} \cdot \frac{1}{2^\ell - 1} = \frac{2^\ell - 1}{2^\ell (2^\ell - 1)} = \frac{1}{2^\ell}.$$
Bayes: $\Pr[M = m \mid C = c] = \dfrac{\frac{1}{2^\ell - 1} \cdot \frac{1}{2^\ell}}{\frac{1}{2^\ell}} = \dfrac{1}{2^\ell - 1}$.

So the adversary learns exactly that $m \neq c$; all other messages remain equally likely. Small leakage, but it violates perfect secrecy.`,
          rubric: [ { points: 1, text: R`Correct $\Pr[C = c \mid M = m]$ and $\Pr[C = c] = 2^{-\ell}$` },
                    { points: 1, text: R`Correct result $\tfrac{1}{2^\ell - 1}$ and interpretation (only $m \neq c$ is learned)` } ] }
      ] },

    { id: "l2-prob-key-reuse", type: "problem", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 19–21 (variant)", difficulty: 2,
      title: "Reusing a one-time pad key",
      mock: true,
      statement: R`Alice encrypts two 4-bit messages with the one-time pad under the **same** key $k \in \{0,1\}^4$. The first message $m_1$ is either $a = 0110$ or $b = 1011$; the second message $m_2$ is either $x = 0011$ or $y = 1100$. Eve sees $c_1 = 1101$ and $c_2 = 0101$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Determine $m_1$, $m_2$ and the key $k$.`,
          hints: [R`Compute $c_1 \oplus c_2$; what does it equal?`, R`Compute the four possible values of $m_1 \oplus m_2$.`],
          solution: R`$c_1 \oplus c_2 = (k \oplus m_1) \oplus (k \oplus m_2) = m_1 \oplus m_2$, and $c_1 \oplus c_2 = 1101 \oplus 0101 = 1000$. The four candidates are $a \oplus x = 0101$, $a \oplus y = 1010$, $b \oplus x = 1000$, $b \oplus y = 0111$; they are all distinct and only $b \oplus x = 1000$ matches. Hence $m_1 = b = 1011$, $m_2 = x = 0011$ and $k = c_1 \oplus m_1 = 1101 \oplus 1011 = 0110$ (check: $k \oplus x = 0110 \oplus 0011 = 0101 = c_2$).`,
          rubric: [ { points: 1, text: R`Uses $c_1 \oplus c_2 = m_1 \oplus m_2$ and computes $1000$` },
                    { points: 1, text: R`Identifies $m_1 = b$, $m_2 = x$ and $k = 0110$` } ] },
        { label: "b", points: 3,
          prompt: R`Let $\Pi_2$ be the scheme that encrypts a pair $(m_1, m_2) \in \{0,1\}^\ell \times \{0,1\}^\ell$ as $(k \oplus m_1, k \oplus m_2)$ with one uniform key $k \in \{0,1\}^\ell$. Prove that $\Pi_2$ is not perfectly secret, directly from the definition.`,
          hints: [R`Which ciphertext pairs can the message pair $(0^\ell, 0^\ell)$ produce?`, R`Choose $c = (c_1, c_2)$ with $c_1 \neq c_2$.`],
          solution: R`Let $M$ be uniform over $\{0,1\}^\ell \times \{0,1\}^\ell$, so $\Pr[M = (m_1, m_2)] = 2^{-2\ell}$. Choose $c = (c_1, c_2)$ with $c_1 \neq c_2$ (possible for $\ell \ge 1$). Then $\Pr[C = c] > 0$: the message pair $(0^\ell, c_1 \oplus c_2)$ under key $k = c_1$ gives $(c_1, c_2)$, and both have positive probability.

The message $m = (0^\ell, 0^\ell)$ always encrypts to $(k, k)$, whose two halves are equal, so it never gives $c$: $\Pr[M = m \mid C = c] = 0 \neq 2^{-2\ell} = \Pr[M = m]$. Hence $\Pi_2$ is not perfectly secret. (Alternatively: $|\mathcal{K}| = 2^\ell < 2^{2\ell} = |\mathcal{M}|$, contradicting Theorem 2.11.)`,
          rubric: [ { points: 1, text: R`Explicit distribution and ciphertext with $\Pr[C = c] > 0$ justified` },
                    { points: 1, text: R`Shows a message with $\Pr[M = m \mid C = c] = 0$ and why` },
                    { points: 1, text: R`Compares with $\Pr[M = m] > 0$ and concludes` } ] }
      ] },

    { id: "l2-prob-shift-proof", type: "problem", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 15–18 (variant of Theorem 2.10)", difficulty: 3,
      title: "Shift cipher modulo n: one symbol vs. two symbols",
      mock: true,
      statement: R`Let $n \ge 2$. $\mathsf{Gen}$ outputs a uniform $k \in \mathbb{Z}_n = \{0, \dots, n-1\}$. For a single symbol $m \in \mathbb{Z}_n$: $\mathsf{Enc}_k(m) := (m + k) \bmod n$, $\mathsf{Dec}_k(c) := (c - k) \bmod n$.`,
      parts: [
        { label: "a", points: 4,
          prompt: R`Prove, directly from the definition of perfect secrecy, that this scheme is perfectly secret for the message space $\mathbb{Z}_n$.`,
          hints: [R`Follow the OTP proof: first compute $\Pr[C = c \mid M = m]$.`, R`Which key maps $m$ to $c$? Use independence of $K$ and $M$.`, R`Then total probability for $\Pr[C = c]$, then Bayes.`],
          solution: R`The key is uniform: $\Pr[K = k] = 1/n$ for all $k \in \mathbb{Z}_n$. Fix an arbitrary distribution of $M$ over $\mathbb{Z}_n$, a message $m$ and a ciphertext $c$ with $\Pr[C = c] > 0$.

1. $\Pr[C = c \mid M = m] = \Pr[(m + K) \bmod n = c \mid M = m] = \Pr[K = (c - m) \bmod n \mid M = m] = \Pr[K = (c - m) \bmod n] = 1/n$, using that $K$ and $M$ are independent.
2. Total probability: $\Pr[C = c] = \sum_{m'} \Pr[C = c \mid M = m'] \Pr[M = m'] = \frac1n \sum_{m'} \Pr[M = m'] = \frac1n$.
3. Bayes: $\Pr[M = m \mid C = c] = \dfrac{\Pr[C = c \mid M = m] \Pr[M = m]}{\Pr[C = c]} = \dfrac{\frac1n \Pr[M = m]}{\frac1n} = \Pr[M = m]$.

Since the distribution, $m$ and $c$ were arbitrary, the scheme is perfectly secret.`,
          rubric: [ { points: 1, text: R`Uniform key $\Pr[K = k] = 1/n$ and arbitrary distribution, $m$, $c$ fixed` },
                    { points: 1, text: R`$\Pr[C = c \mid M = m] = 1/n$ using the unique key $c - m$ and independence` },
                    { points: 1, text: R`$\Pr[C = c] = 1/n$ by total probability` },
                    { points: 1, text: R`Bayes gives $\Pr[M = m \mid C = c] = \Pr[M = m]$` } ] },
        { label: "b", points: 2,
          prompt: R`Now the same key is used for messages of two symbols: $\mathsf{Enc}_k(m_1 m_2) := (m_1 + k \bmod n)(m_2 + k \bmod n)$. Is this scheme perfectly secret for the message space $\mathbb{Z}_n^2$? Prove your answer.`,
          hints: [R`Compare $|\mathcal{K}|$ and $|\mathcal{M}|$.`, R`Or: the difference $c_2 - c_1$ equals $m_2 - m_1$.`],
          solution: R`No. $|\mathcal{K}| = n < n^2 = |\mathcal{M}|$, so by Theorem 2.11 the scheme cannot be perfectly secret.

Direct argument: $c_2 - c_1 \equiv m_2 - m_1 \pmod n$. Take $M$ uniform over $\mathbb{Z}_n^2$, $c = (0, 1)$ (which has $\Pr[C = c] > 0$, e.g. from $m = (0, 1)$ with $k = 0$) and $m = (0, 0)$. Since $(0,0)$ always encrypts to $(k, k)$, $\Pr[M = (0,0) \mid C = (0,1)] = 0 \neq 1/n^2 = \Pr[M = (0,0)]$.`,
          rubric: [ { points: 1, text: R`Correct answer (not perfectly secret) with a valid argument (Theorem 2.11 or explicit $m$, $c$)` },
                    { points: 1, text: R`Argument complete: explicit probabilities, or correct comparison $n < n^2$` } ] }
      ] },

    { id: "l2-prob-thm211", type: "problem", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slide 21 (Theorem 2.11)", difficulty: 3,
      title: "Prove that perfect secrecy needs |K| >= |M|",
      mock: true,
      statement: R`Let $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ be a (correct) encryption scheme with finite message space $\mathcal{M}$ and key space $\mathcal{K}$, where $\mathsf{Dec}$ is deterministic.`,
      parts: [
        { label: "a", points: 4,
          prompt: R`Prove: if $\Pi$ is perfectly secret, then $|\mathcal{K}| \ge |\mathcal{M}|$.`,
          hints: [R`Proof by contradiction: assume $|\mathcal{K}| < |\mathcal{M}|$ and take the uniform distribution.`, R`Fix a ciphertext $c$ with $\Pr[C = c] > 0$. To how many messages can $c$ decrypt?`, R`Define $\mathcal{M}(c) := \{\mathsf{Dec}_k(c) : k \in \mathcal{K}\}$ and find a message outside it.`],
          solution: R`Assume for contradiction that $|\mathcal{K}| < |\mathcal{M}|$. Let $M$ be uniform over $\mathcal{M}$ and fix a ciphertext $c$ with $\Pr[C = c] > 0$.

Define $\mathcal{M}(c) := \{ \mathsf{Dec}_k(c) : k \in \mathcal{K} \}$. Since $\mathsf{Dec}$ is deterministic, $|\mathcal{M}(c)| \le |\mathcal{K}| < |\mathcal{M}|$, so there is a message $m' \in \mathcal{M} \setminus \mathcal{M}(c)$.

If $c$ were output by $\mathsf{Enc}_k(m')$ for some key $k$, correctness would give $\mathsf{Dec}_k(c) = m'$, i.e. $m' \in \mathcal{M}(c)$, a contradiction. Hence $c$ is never an encryption of $m'$, and
$$\Pr[M = m' \mid C = c] = 0 \neq \frac{1}{|\mathcal{M}|} = \Pr[M = m'].$$
This contradicts perfect secrecy, so $|\mathcal{K}| \ge |\mathcal{M}|$.`,
          rubric: [ { points: 1, text: R`Sets up the contradiction with uniform $M$ and $c$ with $\Pr[C = c] > 0$` },
                    { points: 1, text: R`Defines $\mathcal{M}(c)$ and shows $|\mathcal{M}(c)| \le |\mathcal{K}| < |\mathcal{M}|$` },
                    { points: 1, text: R`Uses correctness to show $\Pr[M = m' \mid C = c] = 0$ for $m' \notin \mathcal{M}(c)$` },
                    { points: 1, text: R`Compares with $\Pr[M = m'] = 1/|\mathcal{M}| > 0$ and concludes` } ] }
      ] },

    { id: "l2-prob-table", type: "problem", lecture: 2, topic: "perfect-secrecy", origin: "slides",
      source: "Lecture 2, slides 14–17, 21 (variant)", difficulty: 2,
      title: "Computing a-posteriori probabilities for a small scheme",
      mock: true,
      statement: R`Let $\mathcal{M} = \{a, b\}$, $\mathcal{K} = \{k_1, k_2, k_3\}$ with uniform keys ($\Pr[K = k_i] = \tfrac13$), and $\mathcal{C} = \{0, 1, 2\}$. Scheme $\Pi$ encrypts as follows: $k_1$ maps $a \mapsto 0$, $b \mapsto 1$; $k_2$ maps $a \mapsto 1$, $b \mapsto 2$; $k_3$ maps $a \mapsto 2$, $b \mapsto 0$.

Scheme $\Pi'$ is the same except that $k_3$ maps $a \mapsto 0$, $b \mapsto 2$.

Throughout, $\Pr[M = a] = 0.7$ and $\Pr[M = b] = 0.3$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Is $\Pi$ perfectly secret? Justify. Can Shannon's theorem be applied here?`,
          hints: [R`For each $m$ and $c$, how many keys map $m$ to $c$?`, R`Compare $|\mathcal{M}|$, $|\mathcal{K}|$, $|\mathcal{C}|$.`],
          solution: R`For every $m \in \{a, b\}$ and every $c \in \{0, 1, 2\}$ exactly one key maps $m$ to $c$, so $\Pr[\mathsf{Enc}_K(m) = c] = \tfrac13$ for all $m, c$: the ciphertext distribution does not depend on the message. Hence for any distribution, $\Pr[C = c] = \tfrac13$ and by Bayes $\Pr[M = m \mid C = c] = \frac{(1/3)\Pr[M = m]}{1/3} = \Pr[M = m]$, so $\Pi$ **is** perfectly secret.

Shannon's theorem does not apply, since $|\mathcal{M}| = 2 \neq 3 = |\mathcal{K}| = |\mathcal{C}|$; perfect secrecy is shown directly. (It is consistent with Theorem 2.11: $3 \ge 2$.)`,
          rubric: [ { points: 1, text: R`Shows $\Pr[C = c \mid M = m] = \tfrac13$ for all $m, c$ and concludes perfect secrecy` },
                    { points: 1, text: R`Notes Shannon is not applicable because $|\mathcal{M}| \neq |\mathcal{K}|$` } ] },
        { label: "b", points: 3,
          prompt: R`For $\Pi'$, check correctness and compute $\Pr[M = a \mid C = c]$ for $c = 0, 1, 2$. Is $\Pi'$ perfectly secret?`,
          hints: [R`Correctness: is each key injective on $\{a, b\}$?`, R`$\Pr[C = 0 \mid M = a] = \Pr[K \in \{k_1, k_3\}]$.`, R`Total probability, then Bayes, for each $c$.`],
          solution: R`Correctness holds: under each key, $a$ and $b$ are mapped to different ciphertexts, so decryption is well defined.

Conditional probabilities: $\Pr[C = 0 \mid M = a] = \tfrac23$ ($k_1, k_3$), $\Pr[C = 1 \mid M = a] = \tfrac13$ ($k_2$), $\Pr[C = 2 \mid M = a] = 0$; $\Pr[C = 0 \mid M = b] = 0$, $\Pr[C = 1 \mid M = b] = \tfrac13$ ($k_1$), $\Pr[C = 2 \mid M = b] = \tfrac23$ ($k_2, k_3$).

Total probability: $\Pr[C = 0] = 0.7 \cdot \tfrac23 = \tfrac{7}{15}$, $\Pr[C = 1] = 0.7 \cdot \tfrac13 + 0.3 \cdot \tfrac13 = \tfrac13$, $\Pr[C = 2] = 0.3 \cdot \tfrac23 = \tfrac15$.

Bayes: $\Pr[M = a \mid C = 0] = \frac{(2/3) \cdot 0.7}{7/15} = 1$, $\Pr[M = a \mid C = 1] = \frac{(1/3) \cdot 0.7}{1/3} = 0.7$, $\Pr[M = a \mid C = 2] = 0$.

Since e.g. $\Pr[M = a \mid C = 0] = 1 \neq 0.7 = \Pr[M = a]$, $\Pi'$ is not perfectly secret: ciphertexts 0 and 2 reveal the message completely.`,
          rubric: [ { points: 1, text: R`Correctness checked and all $\Pr[C = c \mid M = m]$ correct` },
                    { points: 1, text: R`$\Pr[C = c]$ for all three $c$ correct ($\tfrac{7}{15}, \tfrac13, \tfrac15$)` },
                    { points: 1, text: R`Posteriors $1, 0.7, 0$ and conclusion: not perfectly secret` } ] }
      ] }
  );
})();
