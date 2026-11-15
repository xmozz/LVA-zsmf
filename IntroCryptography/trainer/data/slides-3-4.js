(function () {
  const R = String.raw;
  const add = (...items) => (window.CRYPTO_BANK = window.CRYPTO_BANK || []).push(...items);

  // ===================== LECTURE 3: BLOCK CIPHERS — NOTES =====================
  add(
    { id: "l3-note-block-cipher-goal", type: "note", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slides 3-4", difficulty: 1,
      title: "Block ciphers and their security goal",
      order: 10,
      body: R`### What a block cipher is

A **block cipher** is a keyed function $F$ that, for every key $k$, is a permutation $F_k \colon \{0,1\}^\ell \to \{0,1\}^\ell$ on blocks of a fixed size $\ell$ (the **block length**). It maps an input block $x$ to an output block $y = F_k(x)$, and both $F_k$ and $F_k^{-1}$ must be efficiently computable. Block ciphers are the main **building block** of private-key encryption schemes, MACs, etc. A block cipher by itself is *not* an encryption scheme; it is used inside modes of operation (later lectures).

### Setting (Kerckhoffs)

The adversary knows the algorithm $F$ and has **seen (chosen) plaintext/ciphertext pairs** $(x, F_k(x))$. Only the key is secret.

### Generic attacks and what they force

- **Exhaustive key search:** try all keys until $F_k(x) = y$. So the key space must be large: $\ge 2^{128}$ keys. (Even at $10^{18}$ keys per second, $2^{128}$ keys take longer than the age of the universe.)
- **Dictionary attacks:** collect a table of $x/y$ pairs. So the block size $\ell$ must be large: $\ge 64$ bits.

### Ideal cipher

In the **ideal cipher** every key defines an independent, uniformly **random permutation** of $\{0,1\}^\ell$. After seeing some $x/y$ pairs, an adversary learns nothing about the other pairs (beyond that they are different values), so security is "ideal". But there are $(2^\ell)!$ permutations; for $\ell = 64$ describing one needs $\log_2((2^{64})!) \approx 2^{70}$ bits (about 150 million TB). Impractical.

**Contrast with the one-time pad** $F_k(x) = x \oplus k$: a single $x/y$ pair reveals $k = x \oplus y$ and hence **all** pairs.

### Goal

Construct an **efficiently computable** keyed permutation $F$ with **short** keys that **"behaves" like the ideal cipher**.`
    },
    { id: "l3-note-spn", type: "note", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slides 5-7", difficulty: 1,
      title: "Confusion, diffusion and substitution-permutation networks",
      order: 20,
      body: R`### Shannon's goals

- **Confusion:** the relation between input $x$ and output $y$ is "obscured". Achieved by **substitution** (S-boxes).
- **Diffusion:** every bit of $y$ depends on many bits of $x$. Achieved by **permutation** (mixing bit positions).

Trap: do not swap them. Confusion is about obscuring the relation (non-linearity), diffusion is about spreading the influence of each input bit.

### One round of an SPN

1. **Key mixing:** XOR the state with a subkey: $x_i \oplus k_i$.
2. **Substitution:** split the (e.g. 64-bit) state into small (e.g. 8-bit) blocks and apply an S-box to each block.
3. **Permutation (mixing):** permute/mix the output bits of all S-boxes so that each S-box's output feeds several S-boxes in the next round.
4. Start again (next round).

Instead of key-dependent substitutions $y_i := S_i(x_i)$, one uses a **fixed public S-box** $S$ and puts the key in front of it: $y_i := S(x_i \oplus k_i)$. For example, AES uses one $S \colon \{0,1\}^8 \to \{0,1\}^8$.

### S-boxes

The **S-box** (substitution box) is the central component of block ciphers; it adds **confusion (non-linearity)**. If all S-boxes were affine, the whole cipher would be an affine map of the plaintext for each key, and could be broken with linear algebra.

### Iterative encryption

The cipher proceeds in **rounds**. Round $i$ applies an **invertible** function $f_{k_i} \colon \{0,1\}^\ell \to \{0,1\}^\ell$, where $k_i$ is a **subkey** derived from the master key $k$ (key schedule). The whole cipher is the composition of the rounds.

### Why the S-boxes must be invertible

In an SPN, decryption runs every round backwards: undo the permutation, apply $S^{-1}$ to each block, XOR the subkey. If an S-box is not a bijection, two different inputs give the same output and the SPN is no longer a permutation, so decryption is impossible. (Contrast: Feistel networks do *not* need invertible round functions.)`
    },
    { id: "l3-note-feistel", type: "note", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 10", difficulty: 2,
      title: "Feistel networks",
      order: 30,
      body: R`### One Feistel round

The state is split into a left and a right half, $(L_{i-1}, R_{i-1})$. Round $i$ uses a round function $f_{k_i}$ keyed with subkey $k_i$:

$$L_i = R_{i-1}, \qquad R_i = L_{i-1} \oplus f_{k_i}(R_{i-1}).$$

The right half is fed through $f_{k_i}$, the result is XORed onto the left half, and the halves are swapped.

### Inversion (decryption)

Given $(L_i, R_i)$:

$$R_{i-1} = L_i, \qquad L_{i-1} = R_i \oplus f_{k_i}(L_i).$$

Check: $R_i \oplus f_{k_i}(L_i) = L_{i-1} \oplus f_{k_i}(R_{i-1}) \oplus f_{k_i}(R_{i-1}) = L_{i-1}$.

To decrypt an $r$-round Feistel network, apply this inverse round for $i = r, r-1, \dots, 1$, i.e. use the subkeys in **reverse order**.

### Must $f$ be invertible? No.

Decryption only evaluates $f_{k_i}$ in the **forward** direction (on $L_i = R_{i-1}$, which is known). So the round function may be an arbitrary, even non-injective, function, and every Feistel network is still a permutation. This is exactly why DES can use a non-invertible round function (expansion $32 \to 48$ bits followed by S-boxes $6 \to 4$ bits).

### Exam traps

- "A Feistel network is invertible only if all round functions are invertible": **false**.
- One round leaves $R_{i-1}$ in the clear as $L_i$: a 1-round Feistel network is trivially distinguishable from a random permutation (and as an encryption scheme it is not EAV-secure).
- Two rounds: for two inputs with the same right half, the XOR of the left output halves equals the XOR of the left input halves, so two chosen plaintexts distinguish it from a random permutation.`
    },
    { id: "l3-note-des", type: "note", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slides 9, 11", difficulty: 1,
      title: "DES (Data Encryption Standard)",
      order: 40,
      body: R`### History

- Motivated by commercial applications. 1972: call by NBS (now NIST). 1974: candidates, among them **Lucifer** by IBM (Feistel).
- The NSA "helped": key length reduced from 128 to **56 bits**, giving DES.
- 1977: standard published (but the design criteria were kept secret). Standard prolonged until 1999.

### Parameters

- **Block size: 64 bits.** **Key size: 56 bits.**
- **16 rounds** of a **Feistel network**, plus an initial permutation IP and a final permutation FP (which add no security).

### The DES round function $f_i$ (on a 32-bit half)

1. **Expansion** $32 \to 48$ bits (some bits are duplicated).
2. **XOR with the 48-bit round subkey.**
3. **8 different S-boxes in parallel**, each a lookup table mapping 6 bits to 4 bits ($8 \cdot 4 = 32$ output bits).
4. **Permutation** (P-box) of the 32 bits.

Because of the expansion, the round function is **not invertible**; this is fine since DES is a Feistel network. Inside the round function, DES has the S-box/permutation (SP) structure, so the slides describe DES as "S-P network, iterated cipher, Feistel structure".`
    },
    { id: "l3-note-des-attacks", type: "note", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 12", difficulty: 1,
      title: "Attacks on DES",
      order: 50,
      body: R`### Differential cryptanalysis (Biham and Shamir, 1990)

- **Chosen-plaintext** attack. Against DES it needs $2^{47}$ ciphertexts for **chosen** plaintexts.
- Impractical, but it shows a (theoretical) weakness. It was already known to IBM/NSA in the 1970s, and DES was designed to resist it.

### Linear cryptanalysis (Matsui, 1993)

- **Known-plaintext** attack. Against DES it needs $2^{43}$ plaintext/ciphertext pairs.

### Best attack in practice: exhaustive key search

The design withstood cryptanalysis, but the **56-bit key is too short**:

- 1997: 69 days (thousands of computers).
- 1999: *Deep Crack* (dedicated ASIC hardware): 22 hours.
- Now: minutes (with preprocessing).

Trap: "differential = chosen plaintext, linear = known plaintext". Do not swap them.`
    },
    { id: "l3-note-mitm", type: "note", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 13", difficulty: 2,
      title: "Double encryption and the meet-in-the-middle attack",
      order: 60,
      body: R`### Idea: longer keys by encrypting twice

$$y = F_{k_2}\bigl(F_{k_1}(x)\bigr), \qquad \text{key } (k_1, k_2) \text{ of } 2 \cdot 56 = 112 \text{ bits}.$$

Brute force over both keys would cost $2^{112}$. But double encryption does **not** give 112-bit security.

### Meet-in-the-middle attack

Given a pair $(x, y)$ with $y = F_{k_2}(F_{k_1}(x))$, we have
$$F_{k_1}(x) = F_{k_2}^{-1}(y).$$

1. For **all** $k_1$: compute $F_{k_1}(x)$ and store $(F_{k_1}(x), k_1)$ in a table (sorted or hashed by the first entry).
2. For **all** $k_2$: compute $F_{k_2}^{-1}(y)$ and look it up in the table.
3. Every **match** $F_{k_1}(x) = F_{k_2}^{-1}(y)$ gives a candidate key $(k_1, k_2)$.

### Complexity for double DES

- **Space:** $2^{56}$ table entries.
- **Time:** $2^{56} + 2^{56} = 2^{57}$ DES / DES$^{-1}$ evaluations (plus table lookups).

So double DES is only about as strong as a 57-bit cipher: **insecure**. In general, for $\kappa$-bit keys the attack costs time about $2^{\kappa+1}$ instead of $2^{2\kappa}$, and space $2^\kappa$.

### False matches

A wrong key pair matches by chance with probability about $2^{-64}$ (block length 64). With $2^{112}$ key pairs, about $2^{112-64} = 2^{48}$ candidates survive one pair; checking them against a second pair $(x', y')$ leaves about $2^{48-64} < 1$ wrong candidates, so a couple of pairs suffice to identify the key.`
    },
    { id: "l3-note-3des", type: "note", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 14", difficulty: 1,
      title: "Triple DES",
      order: 70,
      body: R`### Definition

Encrypt three times, with two keys, in the pattern encrypt-decrypt-encrypt:

$$y = \mathsf{DES}_{k_1}\Bigl(\mathsf{DES}^{-1}_{k_2}\bigl(\mathsf{DES}_{k_1}(x)\bigr)\Bigr).$$

- **Keys:** 112 bits ($k_1, k_2$). **Security:** 112 bits (NIST estimates 80 bits). Still used.

### Why only two keys?

Because a **meet-in-the-middle attack with $2^{112}$** work is possible anyway on triple encryption (meet after the first or second layer), so a third independent key would not raise security beyond about 112 bits.

### Why $\mathsf{DES}^{-1}$ in the middle?

**Backwards compatibility:** with $k_1 = k_2$ the first two layers cancel, $\mathsf{DES}_{k_1}(\mathsf{DES}^{-1}_{k_1}(\mathsf{DES}_{k_1}(x))) = \mathsf{DES}_{k_1}(x)$, so 3DES hardware can also do single DES.`
    },
    { id: "l3-note-aes", type: "note", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slides 16-21", difficulty: 1,
      title: "AES (Rijndael) and DES versus AES",
      order: 80,
      body: R`### AES parameters

AES (Advanced Encryption Standard) is **Rijndael**, designed by Rijmen and Daemen, chosen in an open NIST competition and standardized in 2001.

- **Block length: 128 bits** (16 bytes $x_0, \dots, x_{15}$, arranged as a $4 \times 4$ byte matrix, the *state*), for every key length.
- **Key length: 128, 192 or 256 bits**, with **10, 12 or 14 rounds** respectively.
- AES is a **substitution-permutation network** (not a Feistel network), and its round function is **invertible**.

### The four operations of a round

1. **Byte substitution (SubBytes)** — **confusion**. One fixed S-box $S \colon \{0,1\}^8 \to \{0,1\}^8$ applied to each byte. (Lookup: the first 4 bits of the byte select the row, the last 4 the column of the S-box table.) Definition: interpret the byte $a = (a_0,\dots,a_7)$ as $a_7X^7 + \dots + a_1X + a_0$ in $\mathrm{GF}(2^8) = \mathbb{Z}_2[X]/(X^8+X^4+X^3+X+1)$, take its inverse $a'$ in $\mathrm{GF}(2^8)$, and output $b = M a' + v$ for a fixed $8\times 8$ bit matrix $M$ and constant vector $v$ (an affine map).
2. **Shift rows (ShiftRows)** — **diffusion**. Row $i$ of the state is rotated left by $i$ positions ($i = 0,1,2,3$).
3. **Mix columns (MixColumns)** — **diffusion**. Each column is multiplied by a fixed $4 \times 4$ matrix over $\mathrm{GF}(2^8)$:
$$\begin{pmatrix} b_{0,j}\\ b_{1,j}\\ b_{2,j}\\ b_{3,j}\end{pmatrix} = \begin{pmatrix} 2&3&1&1\\ 1&2&3&1\\ 1&1&2&3\\ 3&1&1&2\end{pmatrix}\begin{pmatrix} a_{0,j}\\ a_{1,j}\\ a_{2,j}\\ a_{3,j}\end{pmatrix}, \quad 0 \le j \le 3.$$
4. **Round key addition (AddRoundKey)**: XOR the state with the 16-byte round key $k_0, \dots, k_{15}$. Round keys are derived from the key by the key schedule (RotWord, SubWord, Rcon). A round key is also added before the first round.

### Attacks on AES

- 2009: related-key attack with complexity $2^{99.5}$.
- 2011: biclique attack (a meet-in-the-middle technique), faster than brute force: $2^{126.2}$ AES calls to recover an AES-128 key. Still far from practical.

### DES versus AES

- **Structure:** DES is an iterated S-P network inside a **Feistel structure**; AES is an iterated **S-P network**.
- **Sizes:** DES has 64-bit blocks and 56-bit keys; AES has 128-bit blocks and 128-, 192- or 256-bit keys.
- **S-boxes:** DES uses **8 different** S-boxes; AES uses **1** S-box.
- **Round function:** DES has a **non-invertible** round function; AES has an **invertible** one.
- **Implementation:** DES is optimized for hardware; AES for "byte-oriented" implementations.
- **Design:** DES had **secret** design criteria; AES had an **open** design and evaluation.`
    },
  );

  // ===================== LECTURE 3: CARDS =====================
  add(
    { id: "l3-card-01", type: "card", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slides 3-4", difficulty: 1,
      front: R`What is a block cipher?`,
      back: R`A keyed function $F$ such that for every key $k$, $F_k \colon \{0,1\}^\ell \to \{0,1\}^\ell$ is a **permutation** of fixed-size blocks, with $F_k$ and $F_k^{-1}$ efficiently computable. It is a building block for encryption schemes and MACs, not an encryption scheme itself.` },
    { id: "l3-card-02", type: "card", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 4", difficulty: 1,
      front: R`What is the ideal cipher, and why can it not be used in practice?`,
      back: R`Each key defines an independent uniformly random permutation of $\{0,1\}^\ell$. Security is ideal, but there are $(2^\ell)!$ permutations, so for $\ell = 64$ a key would need about $2^{70}$ bits.` },
    { id: "l3-card-03", type: "card", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 4", difficulty: 1,
      front: R`State the design goal for block ciphers from the lecture.`,
      back: R`Construct an **efficiently computable** keyed permutation $F$ with **short** keys that **behaves like the ideal cipher**.` },
    { id: "l3-card-04", type: "card", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 3", difficulty: 1,
      front: R`Which two generic attacks on block ciphers are named, and what does each force?`,
      back: R`**Exhaustive key search** forces a large key space ($\ge 2^{128}$ keys). **Dictionary attacks** force a large block size ($\ell \ge 64$ bits).` },
    { id: "l3-card-05", type: "card", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 5", difficulty: 1,
      front: R`Confusion vs. diffusion: define each and say which primitive achieves it.`,
      back: R`**Confusion:** the relation between $x$ and $y$ is obscured; achieved by **substitution** (S-boxes, non-linearity). **Diffusion:** every bit of $y$ depends on many bits of $x$; achieved by **permutation**/mixing.` },
    { id: "l3-card-06", type: "card", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slides 6-7", difficulty: 1,
      front: R`What happens in one round of a substitution-permutation network?`,
      back: R`XOR the state with a round subkey; split it into small blocks (e.g. 8 bits) and apply the fixed S-box to each, $y_i := S(x_i \oplus k_i)$; then permute/mix the output bits. Repeat for the next round.` },
    { id: "l3-card-07", type: "card", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 7", difficulty: 2,
      front: R`Why must the S-boxes of an SPN be invertible?`,
      back: R`Decryption runs each round backwards and must apply $S^{-1}$. A non-injective S-box maps two inputs to the same output, so the SPN would not be a permutation and could not be decrypted.` },
    { id: "l3-card-08", type: "card", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 10", difficulty: 1,
      front: R`Give the equations of one Feistel round and of its inverse.`,
      back: R`Forward: $L_i = R_{i-1}$, $R_i = L_{i-1} \oplus f_{k_i}(R_{i-1})$. Inverse: $R_{i-1} = L_i$, $L_{i-1} = R_i \oplus f_{k_i}(L_i)$.` },
    { id: "l3-card-09", type: "card", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 10", difficulty: 2,
      front: R`Does the round function of a Feistel network have to be invertible? Why?`,
      back: R`No. Inverting a round only needs $f_{k_i}(L_i)$, an evaluation of $f$ in the forward direction on a known value. So any function $f$ gives a permutation.` },
    { id: "l3-card-10", type: "card", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slides 9, 11", difficulty: 1,
      front: R`DES: block size, key size, number of rounds, structure?`,
      back: R`64-bit blocks, 56-bit keys, 16 rounds of a Feistel network (plus initial and final permutation).` },
    { id: "l3-card-11", type: "card", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 11", difficulty: 1,
      front: R`What are the four steps of the DES round function?`,
      back: R`Expansion $32 \to 48$ bits; XOR with the 48-bit subkey; 8 different S-boxes in parallel (lookup tables, $6 \to 4$ bits); permutation of the 32 output bits.` },
    { id: "l3-card-12", type: "card", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 12", difficulty: 1,
      front: R`Differential vs. linear cryptanalysis of DES: who, when, which attack type, how much data?`,
      back: R`**Differential** (Biham–Shamir 1990): chosen-plaintext, $2^{47}$ chosen plaintexts. **Linear** (Matsui 1993): known-plaintext, $2^{43}$ pairs. The best practical attack is still exhaustive key search.` },
    { id: "l3-card-13", type: "card", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 13", difficulty: 2,
      front: R`Describe the meet-in-the-middle attack on double DES and its cost.`,
      back: R`From $y = F_{k_2}(F_{k_1}(x))$ get $F_{k_1}(x) = F_{k_2}^{-1}(y)$. Tabulate $F_{k_1}(x)$ for all $k_1$, compute $F_{k_2}^{-1}(y)$ for all $k_2$ and look for matches. Space $2^{56}$, time $2^{57}$ DES/DES$^{-1}$ evaluations instead of $2^{112}$.` },
    { id: "l3-card-14", type: "card", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 14", difficulty: 1,
      front: R`Define Triple DES. Why two keys, and why $\mathsf{DES}^{-1}$ in the middle?`,
      back: R`$y = \mathsf{DES}_{k_1}(\mathsf{DES}^{-1}_{k_2}(\mathsf{DES}_{k_1}(x)))$; 112-bit key, 112-bit security (NIST: 80). Two keys because meet-in-the-middle with $2^{112}$ is possible anyway. $\mathsf{DES}^{-1}$ for backwards compatibility: $k_1 = k_2$ gives single DES.` },
    { id: "l3-card-15", type: "card", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 17", difficulty: 1,
      front: R`AES: block length, key lengths, numbers of rounds?`,
      back: R`128-bit blocks (16 bytes, a $4\times4$ byte state). Keys of 128, 192 or 256 bits with 10, 12 or 14 rounds.` },
    { id: "l3-card-16", type: "card", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slides 17-20", difficulty: 1,
      front: R`Name the four operations of an AES round and what each contributes.`,
      back: R`**SubBytes** (byte substitution with the S-box): confusion. **ShiftRows** (row $i$ rotated left by $i$): diffusion. **MixColumns** (each column times a fixed matrix over $\mathrm{GF}(2^8)$): diffusion. **AddRoundKey** (XOR the round key).` },
    { id: "l3-card-17", type: "card", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 18", difficulty: 2,
      front: R`How is the AES S-box defined?`,
      back: R`Interpret the byte as an element $a$ of $\mathrm{GF}(2^8) = \mathbb{Z}_2[X]/(X^8+X^4+X^3+X+1)$, take its inverse $a'$, and apply a fixed affine map over $\mathrm{GF}(2)$: $b = M a' + v$.` },
    { id: "l3-card-18", type: "card", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 16", difficulty: 1,
      front: R`List the main differences between DES and AES given in the lecture.`,
      back: R`DES: Feistel structure, 64-bit blocks, 56-bit keys, 8 different S-boxes, non-invertible round function, hardware-oriented, secret design. AES: SPN, 128-bit blocks, 128/192/256-bit keys, 1 S-box, invertible round function, byte-oriented, open design (NIST competition, 2001).` },
  );

  // ===================== LECTURE 3: TRUE/FALSE =====================
  add(
    { id: "l3-tf-01", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 11", difficulty: 1,
      statement: R`DES has a block length of 64 bits, a key length of 56 bits and 16 rounds.`,
      answer: true,
      explanation: R`These are exactly the DES parameters: a 16-round Feistel network on 64-bit blocks with a 56-bit key.` },
    { id: "l3-tf-02", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 10", difficulty: 2,
      statement: R`In a Feistel network, all round functions $f_{k_i}$ must be invertible, otherwise the network cannot be decrypted.`,
      answer: false,
      explanation: R`Inversion computes $R_{i-1} = L_i$ and $L_{i-1} = R_i \oplus f_{k_i}(L_i)$, which only evaluates $f_{k_i}$ forwards. Any round function gives an invertible Feistel network (DES uses a non-invertible one).` },
    { id: "l3-tf-03", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 7", difficulty: 2,
      statement: R`In a substitution-permutation network, the S-boxes need not be bijective, because the key mixing step $x_i \oplus k_i$ is already invertible.`,
      answer: false,
      explanation: R`Decryption must apply $S^{-1}$ to undo each substitution. If $S$ is not injective, two different states map to the same output and the SPN is not a permutation, whatever the key mixing does.` },
    { id: "l3-tf-04", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 16", difficulty: 1,
      statement: R`AES is built as a Feistel network, like DES.`,
      answer: false,
      explanation: R`AES (Rijndael) is a substitution-permutation network with an invertible round function. DES is the one with a Feistel structure.` },
    { id: "l3-tf-05", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slides 16-18", difficulty: 1,
      statement: R`AES uses a single fixed S-box, which is applied to every byte of the state.`,
      answer: true,
      explanation: R`The slide comparison says DES uses 8 different S-boxes while AES uses 1 S-box $S \colon \{0,1\}^8 \to \{0,1\}^8$, applied bytewise in SubBytes.` },
    { id: "l3-tf-06", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 17", difficulty: 1,
      statement: R`AES with a 256-bit key uses 14 rounds.`,
      answer: true,
      explanation: R`AES uses 10, 12 or 14 rounds for 128-, 192- or 256-bit keys respectively.` },
    { id: "l3-tf-07", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slides 16-17", difficulty: 1,
      statement: R`The block length of AES grows with the key length: 128, 192 or 256 bits.`,
      answer: false,
      explanation: R`The AES block length is always 128 bits (16 bytes). Only the key length (128/192/256) and the number of rounds (10/12/14) vary.` },
    { id: "l3-tf-08", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 13", difficulty: 2,
      statement: R`Double DES, $y = \mathsf{DES}_{k_2}(\mathsf{DES}_{k_1}(x))$ with independent 56-bit keys, requires about $2^{112}$ operations to recover the key from known plaintext/ciphertext pairs.`,
      answer: false,
      explanation: R`The meet-in-the-middle attack recovers $(k_1,k_2)$ with about $2^{57}$ DES/DES$^{-1}$ evaluations and $2^{56}$ storage, by matching $\mathsf{DES}_{k_1}(x)$ against $\mathsf{DES}^{-1}_{k_2}(y)$.` },
    { id: "l3-tf-09", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 13", difficulty: 2,
      statement: R`The meet-in-the-middle attack on double DES needs memory for about $2^{56}$ table entries.`,
      answer: true,
      explanation: R`It stores $F_{k_1}(x)$ for all $2^{56}$ keys $k_1$ and then looks up $F_{k_2}^{-1}(y)$ for every $k_2$: space $2^{56}$, time $2^{57}$.` },
    { id: "l3-tf-10", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 14", difficulty: 2,
      statement: R`For Triple DES $y = \mathsf{DES}_{k_1}(\mathsf{DES}^{-1}_{k_2}(\mathsf{DES}_{k_1}(x)))$, choosing $k_1 = k_2$ gives ordinary single DES with key $k_1$.`,
      answer: true,
      explanation: R`With $k_2 = k_1$ the inner $\mathsf{DES}^{-1}_{k_1}$ cancels the first $\mathsf{DES}_{k_1}$, leaving $\mathsf{DES}_{k_1}(x)$. This backwards compatibility is the reason for the encrypt-decrypt-encrypt pattern.` },
    { id: "l3-tf-11", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 14", difficulty: 2,
      statement: R`Triple DES uses only two keys because a meet-in-the-middle attack with about $2^{112}$ work is possible on triple encryption anyway, so a third independent key would not add much security.`,
      answer: true,
      explanation: R`This is the slide's justification: meeting in the middle after one of the layers costs about $2^{112}$, which matches the security of the 112-bit two-key variant.` },
    { id: "l3-tf-12", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 12", difficulty: 1,
      statement: R`Differential cryptanalysis is a known-plaintext attack, while linear cryptanalysis requires chosen plaintexts.`,
      answer: false,
      explanation: R`It is the other way round: differential cryptanalysis (Biham–Shamir) needs chosen plaintexts ($2^{47}$ for DES), linear cryptanalysis (Matsui) is a known-plaintext attack ($2^{43}$ pairs for DES).` },
    { id: "l3-tf-13", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 12", difficulty: 1,
      statement: R`Linear cryptanalysis of DES requires about $2^{43}$ known plaintext/ciphertext pairs.`,
      answer: true,
      explanation: R`Matsui's linear cryptanalysis (1993) is a known-plaintext attack needing $2^{43}$ pairs. It is impractical; the best practical attack on DES is exhaustive key search.` },
    { id: "l3-tf-14", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 5", difficulty: 1,
      statement: R`Confusion (in Shannon's sense) means that every output bit depends on many input bits.`,
      answer: false,
      explanation: R`That is **diffusion** (achieved by permutation). Confusion means the relation between input and output is obscured; it is achieved by substitution (S-boxes).` },
    { id: "l3-tf-15", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 4", difficulty: 2,
      statement: R`Describing a uniformly random permutation of $\{0,1\}^{64}$, as the ideal cipher would require, takes about $2^{70}$ bits.`,
      answer: true,
      explanation: R`There are $(2^{64})!$ permutations, and $\log_2((2^{64})!) \approx 2^{64}(64 - \log_2 e) \approx 2^{70}$ bits. That is why the ideal cipher is impractical and we want short keys.` },
    { id: "l3-tf-16", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 4", difficulty: 1,
      statement: R`For the keyed permutation $F_k(x) = x \oplus k$ (the one-time pad), a single input/output pair determines $F_k$ on all inputs.`,
      answer: true,
      explanation: R`From one pair $(x, y)$ we get $k = x \oplus y$, hence $F_k(x') = x' \oplus k$ for every $x'$. An ideal cipher, in contrast, reveals nothing about the other pairs.` },
    { id: "l3-tf-17", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slides 11, 16", difficulty: 1,
      statement: R`The DES round function is invertible.`,
      answer: false,
      explanation: R`It expands 32 bits to 48 and its S-boxes map 6 bits to 4, so it is not invertible. This is fine because DES is a Feistel network.` },
    { id: "l3-tf-18", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 11", difficulty: 1,
      statement: R`In the DES round function, the 32-bit half block is expanded to 48 bits before it is XORed with the round key.`,
      answer: true,
      explanation: R`The round function is: expansion $32 \to 48$, XOR with the 48-bit subkey, 8 S-boxes in parallel, permutation.` },
    { id: "l3-tf-19", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 21", difficulty: 1,
      statement: R`The 2011 biclique attack recovers an AES-128 key with about $2^{126.2}$ AES computations, which is faster than brute force.`,
      answer: true,
      explanation: R`This is the slide's statement. The gain over brute force ($2^{128}$) is tiny, so AES is not broken in practice.` },
    { id: "l3-tf-20", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 13", difficulty: 2,
      statement: R`The meet-in-the-middle attack on double encryption only needs to evaluate the block cipher $F$ in the forward direction.`,
      answer: false,
      explanation: R`It matches $F_{k_1}(x)$ against $F_{k_2}^{-1}(y)$, so it needs $F^{-1}$ for the second half. For a block cipher $F^{-1}$ is efficiently computable, which is what makes the attack work.` },
    { id: "l3-tf-21", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slides 5-7", difficulty: 3,
      statement: R`If the S-box of an SPN were an affine function over $\mathrm{GF}(2)$, then for every fixed key the whole SPN would be an affine function of the plaintext.`,
      answer: true,
      explanation: R`Key XOR, bit permutations and affine S-boxes are all affine maps, and a composition of affine maps is affine. This is why the S-box must add non-linearity (confusion).` },
    { id: "l3-tf-22", type: "tf", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 3", difficulty: 2,
      statement: R`A block cipher with a 16-bit block length is fine as long as the key is long enough to rule out exhaustive key search.`,
      answer: false,
      explanation: R`With small blocks a dictionary attack works: an adversary can collect a table of all (or most) $x/y$ pairs without knowing the key. The lecture requires a block size of at least 64 bits.` },
  );

  // ===================== LECTURE 3: MULTIPLE CHOICE =====================
  add(
    { id: "l3-mc-01", type: "mc", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 11", difficulty: 1,
      question: R`Which parameters does DES have?`,
      options: [R`64-bit blocks, 56-bit key, 16 rounds`, R`64-bit blocks, 64-bit key, 10 rounds`, R`128-bit blocks, 56-bit key, 16 rounds`, R`56-bit blocks, 64-bit key, 16 rounds`],
      correct: 0,
      explanation: R`DES: 64-bit block, 56-bit key, 16 Feistel rounds. (The NSA had the key reduced from 128 to 56 bits.)` },
    { id: "l3-mc-02", type: "mc", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 13", difficulty: 2,
      question: R`What is the time complexity of the meet-in-the-middle attack on double DES given one plaintext/ciphertext pair?`,
      options: [R`About $2^{28}$ DES evaluations`, R`About $2^{57}$ DES/DES$^{-1}$ evaluations`, R`About $2^{112}$ DES evaluations`, R`About $2^{64}$ DES evaluations`],
      correct: 1,
      explanation: R`$2^{56}$ forward evaluations to build the table plus $2^{56}$ inverse evaluations to search it, $2^{57}$ in total, with $2^{56}$ memory.` },
    { id: "l3-mc-03", type: "mc", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 17", difficulty: 1,
      question: R`Which AES operation provides confusion?`,
      options: [R`ShiftRows`, R`MixColumns`, R`SubBytes (byte substitution)`, R`AddRoundKey`],
      correct: 2,
      explanation: R`The S-box (byte substitution) is the non-linear component and provides confusion; ShiftRows and MixColumns provide diffusion.` },
    { id: "l3-mc-04", type: "mc", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 14", difficulty: 1,
      question: R`Why does Triple DES use $\mathsf{DES}^{-1}_{k_2}$ in the middle layer?`,
      options: [R`Because DES encryption cannot be applied twice in a row`, R`To prevent the meet-in-the-middle attack`, R`For backwards compatibility: with $k_1 = k_2$ it computes single DES`, R`Because $\mathsf{DES}^{-1}$ is faster than DES`],
      correct: 2,
      explanation: R`If $k_1 = k_2$, the first two layers cancel and $\mathsf{DES}_{k_1}(x)$ remains, so 3DES implementations can also do single DES.` },
    { id: "l3-mc-05", type: "mc", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 10", difficulty: 2,
      question: R`One Feistel round maps $(L_{i-1}, R_{i-1})$ to $(L_i, R_i) = (R_{i-1},\, L_{i-1} \oplus f_{k_i}(R_{i-1}))$. How is it inverted?`,
      options: [R`$R_{i-1} = L_i$, $L_{i-1} = R_i \oplus f_{k_i}(L_i)$`, R`$R_{i-1} = R_i$, $L_{i-1} = L_i \oplus f_{k_i}(R_i)$`, R`$R_{i-1} = L_i$, $L_{i-1} = f_{k_i}^{-1}(R_i)$`, R`$L_{i-1} = L_i$, $R_{i-1} = R_i \oplus f_{k_i}(L_i)$`],
      correct: 0,
      explanation: R`$L_i = R_{i-1}$ gives $R_{i-1}$ directly; then $R_i \oplus f_{k_i}(L_i) = L_{i-1} \oplus f_{k_i}(R_{i-1}) \oplus f_{k_i}(R_{i-1}) = L_{i-1}$. No $f^{-1}$ is needed.` },
    { id: "l3-mc-06", type: "mc", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 17", difficulty: 1,
      question: R`How many rounds does AES use with a 192-bit key?`,
      options: [R`10`, R`12`, R`14`, R`16`],
      correct: 1,
      explanation: R`10, 12 and 14 rounds for 128-, 192- and 256-bit keys. (16 rounds is DES.)` },
    { id: "l3-mc-07", type: "mc", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 12", difficulty: 1,
      question: R`Which attack is the best known *practical* attack on DES?`,
      options: [R`Differential cryptanalysis with $2^{47}$ chosen plaintexts`, R`Linear cryptanalysis with $2^{43}$ known pairs`, R`Exhaustive key search over $2^{56}$ keys`, R`Meet-in-the-middle with $2^{28}$ work`],
      correct: 2,
      explanation: R`The design withstood cryptanalysis; the weakness is the short key. Exhaustive search took 69 days in 1997, 22 hours with Deep Crack in 1999, and minutes today.` },
    { id: "l3-mc-08", type: "mc", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 16", difficulty: 1,
      question: R`Which statement about DES and AES is correct?`,
      options: [R`DES has an invertible round function, AES a non-invertible one`, R`Both use 8 different S-boxes`, R`AES has an invertible round function and was designed in an open competition`, R`Both have 128-bit blocks`],
      correct: 2,
      explanation: R`AES: SPN with invertible round function, 1 S-box, 128-bit blocks, open NIST competition (2001). DES: Feistel, non-invertible round function, 8 S-boxes, 64-bit blocks, secret design criteria.` },
    { id: "l3-mc-09", type: "mc", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 4", difficulty: 2,
      question: R`How many keys does the ideal cipher on $\ell$-bit blocks have, i.e. how many permutations of $\{0,1\}^\ell$ are there?`,
      options: [R`$2^\ell$`, R`$2^{2\ell}$`, R`$(2^\ell)!$`, R`$\ell!$`],
      correct: 2,
      explanation: R`A permutation of a set of size $2^\ell$ is one of $(2^\ell)!$ orderings. For $\ell = 64$ an index into them needs about $2^{70}$ bits.` },
  );

  // ===================== LECTURE 3: GAPS =====================
  add(
    { id: "l3-gap-feistel", type: "gap", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 10", difficulty: 2,
      title: "Feistel round and its inverse", points: 5,
      text: R`One round of a Feistel network takes the halves $(L_{i-1}, R_{i-1})$ and a round function $f_{k_i}$ keyed with <gap>the subkey $k_i$ derived from the master key $k$</gap>. It outputs $(L_i, R_i)$ with $L_i =$ <gap>$R_{i-1}$</gap> and $R_i =$ <gap>$L_{i-1} \oplus f_{k_i}(R_{i-1})$</gap>.

To invert the round, compute $R_{i-1} =$ <gap>$L_i$</gap> and $L_{i-1} =$ <gap>$R_i \oplus f_{k_i}(L_i)$</gap>. Therefore the round function $f_{k_i}$ <gap>does not need to be invertible</gap>, because decryption only evaluates it in the forward direction.`,
      note: R`An $r$-round Feistel network is decrypted by applying the inverse round for $i = r, \dots, 1$, i.e. with the subkeys in reverse order.` },
    { id: "l3-gap-mitm", type: "gap", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 13", difficulty: 2,
      title: "Meet-in-the-middle attack on double DES", points: 5,
      text: R`Let $y = F_{k_2}(F_{k_1}(x))$ be double DES. Since this implies <gap>$F_{k_1}(x) = F_{k_2}^{-1}(y)$</gap>, the attacker computes and stores <gap>$F_{k_1}(x)$ for all keys $k_1$</gap>, then computes <gap>$F_{k_2}^{-1}(y)$ for all keys $k_2$</gap> and outputs every pair $(k_1, k_2)$ for which the two values match. This needs space <gap>$2^{56}$</gap> and time <gap>$2^{57}$ DES/DES$^{-1}$ evaluations</gap>, instead of the $2^{112}$ of brute force over both keys.` },
  );

  // ===================== LECTURE 3: PROBLEMS =====================
  add(
    { id: "l3-prob-feistel-invert", type: "problem", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slide 10 (exercise in the style of the exam)", difficulty: 2,
      title: "Inverting a 3-round Feistel network",
      mock: true,
      statement: R`Consider a 3-round Feistel network on 8-bit blocks, split into 4-bit halves $(L_0, R_0)$. Round $i$ computes $L_i = R_{i-1}$ and $R_i = L_{i-1} \oplus f_{k_i}(R_{i-1})$ with the round function
$$f_{k_i}(x) := x \wedge k_i \quad \text{(bitwise AND)},$$
and subkeys $k_1 = 1010$, $k_2 = 0110$, $k_3 = 1111$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Give the formulas for one inverse round, and explain in which order the subkeys are used to decrypt the 3-round network.`,
          hints: [R`Which half of the output is just a copy of an input half?`, R`$R_i \oplus f_{k_i}(L_i)$: substitute $L_i = R_{i-1}$.`],
          solution: R`From $L_i = R_{i-1}$ we get $R_{i-1} = L_i$. Then
$$R_i \oplus f_{k_i}(L_i) = L_{i-1} \oplus f_{k_i}(R_{i-1}) \oplus f_{k_i}(R_{i-1}) = L_{i-1}.$$
So the inverse round is $R_{i-1} = L_i$, $L_{i-1} = R_i \oplus f_{k_i}(L_i)$. To decrypt $(L_3, R_3)$ we apply it for $i = 3, 2, 1$, i.e. with subkeys $k_3, k_2, k_1$ (reverse order).`,
          rubric: [ { points: 1, text: R`Correct inverse round formulas $R_{i-1} = L_i$, $L_{i-1} = R_i \oplus f_{k_i}(L_i)$ (with a short check)` },
                    { points: 1, text: R`Subkeys used in reverse order $k_3, k_2, k_1$` } ] },
        { label: "b", points: 2,
          prompt: R`Decrypt the ciphertext $(L_3, R_3) = (0001, 1101)$.`,
          hints: [R`Start with $R_2 = L_3$ and $L_2 = R_3 \oplus (L_3 \wedge k_3)$.`, R`$L_3 \wedge k_3 = 0001 \wedge 1111 = 0001$.`],
          solution: R`Round 3 inverse: $R_2 = L_3 = 0001$, $L_2 = R_3 \oplus (L_3 \wedge k_3) = 1101 \oplus (0001 \wedge 1111) = 1101 \oplus 0001 = 1100$.

Round 2 inverse: $R_1 = L_2 = 1100$, $L_1 = R_2 \oplus (L_2 \wedge k_2) = 0001 \oplus (1100 \wedge 0110) = 0001 \oplus 0100 = 0101$.

Round 1 inverse: $R_0 = L_1 = 0101$, $L_0 = R_1 \oplus (L_1 \wedge k_1) = 1100 \oplus (0101 \wedge 1010) = 1100 \oplus 0000 = 1100$.

Plaintext: $(L_0, R_0) = (1100, 0101)$. (Check by encrypting: $(1100,0101) \to (0101,1100) \to (1100,0001) \to (0001,1101)$.)`,
          rubric: [ { points: 1, text: R`Correct intermediate values $(L_2,R_2) = (1100,0001)$ and $(L_1,R_1) = (0101,1100)$` },
                    { points: 1, text: R`Correct plaintext $(1100, 0101)$` } ] },
        { label: "c", points: 1,
          prompt: R`Is the round function $f_{k_1}$ invertible? Why does this not matter?`,
          hints: [R`Try $f_{k_1}(0101)$ and $f_{k_1}(0000)$.`],
          solution: R`No: $f_{k_1}(0101) = 0101 \wedge 1010 = 0000 = f_{k_1}(0000)$, so $f_{k_1}$ is not injective. It does not matter because decryption only evaluates $f_{k_i}$ forwards (on $L_i$), so a Feistel network is a permutation for any round functions.`,
          rubric: [ { points: 1, text: R`Counterexample to injectivity and the reason (only forward evaluation needed)` } ] },
      ] },
    { id: "l3-prob-mitm", type: "problem", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slides 13-14 (exercise in the style of the exam)", difficulty: 2,
      title: "Meet-in-the-middle attack on double encryption",
      mock: true,
      statement: R`Let $F$ be a block cipher with 56-bit keys and 64-bit blocks (e.g. DES), and define double encryption with key $(k_1, k_2)$ as
$$F'_{k_1,k_2}(x) := F_{k_2}\bigl(F_{k_1}(x)\bigr).$$
The attacker knows some plaintext/ciphertext pairs $(x, y)$ with $y = F'_{k_1,k_2}(x)$ and can evaluate $F$ and $F^{-1}$ for any key.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Describe the meet-in-the-middle attack that recovers $(k_1, k_2)$.`,
          hints: [R`Apply $F_{k_2}^{-1}$ to both sides of $y = F_{k_2}(F_{k_1}(x))$.`, R`One side depends only on $k_1$, the other only on $k_2$.`],
          solution: R`From $y = F_{k_2}(F_{k_1}(x))$ we get $F_{k_1}(x) = F_{k_2}^{-1}(y)$: the "middle value" can be computed from the left using only $k_1$ and from the right using only $k_2$.

1. For every $k_1 \in \{0,1\}^{56}$ compute $z = F_{k_1}(x)$ and store $(z, k_1)$ in a table sorted (or hashed) by $z$.
2. For every $k_2 \in \{0,1\}^{56}$ compute $z' = F_{k_2}^{-1}(y)$ and look $z'$ up in the table.
3. For each match $z = z'$ output the candidate $(k_1, k_2)$. The real key is among the candidates.`,
          rubric: [ { points: 1, text: R`Key equation $F_{k_1}(x) = F_{k_2}^{-1}(y)$` },
                    { points: 1, text: R`Table of $F_{k_1}(x)$ over all $k_1$, lookups of $F_{k_2}^{-1}(y)$ over all $k_2$, matches give candidates` } ] },
        { label: "b", points: 2,
          prompt: R`State the time and space cost of the attack and compare it with brute force on $(k_1, k_2)$.`,
          hints: [R`Count evaluations of $F$ and of $F^{-1}$ separately.`],
          solution: R`Time: $2^{56}$ evaluations of $F$ plus $2^{56}$ evaluations of $F^{-1}$, i.e. $2^{57}$ (plus $2^{56}$ table lookups, each cheap with sorting or hashing). Space: $2^{56}$ table entries. Brute force over the 112-bit key would need about $2^{112}$ evaluations. So double encryption only gives about 57 bits of security instead of 112; it is insecure.`,
          rubric: [ { points: 1, text: R`Time $2^{57}$ and space $2^{56}$` },
                    { points: 1, text: R`Comparison with $2^{112}$ for brute force and conclusion` } ] },
        { label: "c", points: 2,
          prompt: R`Heuristically (modelling $F$ as an ideal cipher), how many wrong candidate pairs survive one known pair, and how does the attacker single out the right key?`,
          hints: [R`For a wrong pair $(k_1,k_2)$, the chance that two 64-bit values coincide is about $2^{-64}$.`, R`Check each candidate against a second pair $(x', y')$.`],
          solution: R`There are $2^{112}$ key pairs and a wrong pair matches with probability about $2^{-64}$, so about $2^{112-64} = 2^{48}$ wrong candidates survive. Testing each candidate on a second pair $(x', y')$ keeps a wrong candidate with probability about $2^{-64}$, so about $2^{48} \cdot 2^{-64} = 2^{-16}$ wrong candidates are expected to remain: with two (or three, to be safe) pairs, the surviving candidate is the right key. The extra test costs only $2 \cdot 2^{48}$ evaluations, negligible compared with $2^{57}$.`,
          rubric: [ { points: 1, text: R`About $2^{48}$ false candidates after one pair` },
                    { points: 1, text: R`Filtering with a second pair leaves about $2^{-16}$ expected wrong candidates` } ] },
      ] },
    { id: "l3-prob-feistel-2round", type: "problem", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slides 4, 10 (exercise in the style of the exam)", difficulty: 3,
      title: "A 2-round Feistel network does not behave like an ideal cipher",
      mock: false,
      statement: R`Consider a 2-round Feistel network on $2n$-bit blocks with round functions $f_1, f_2 \colon \{0,1\}^n \to \{0,1\}^n$. The adversary may choose plaintexts and obtain their encryptions, and wants to tell whether it is talking to this Feistel network (with unknown $f_1, f_2$) or to a uniformly random permutation of $\{0,1\}^{2n}$.`,
      parts: [
        { label: "a", points: 1,
          prompt: R`Write the output $(L_2, R_2)$ in terms of the input $(L_0, R_0)$.`,
          hints: [R`Apply the round equations twice.`],
          solution: R`$L_1 = R_0$, $R_1 = L_0 \oplus f_1(R_0)$, so
$$L_2 = R_1 = L_0 \oplus f_1(R_0), \qquad R_2 = L_1 \oplus f_2(R_1) = R_0 \oplus f_2\bigl(L_0 \oplus f_1(R_0)\bigr).$$`,
          rubric: [ { points: 1, text: R`Correct expressions for $L_2$ and $R_2$` } ] },
        { label: "b", points: 2,
          prompt: R`Give a distinguisher that uses two chosen plaintexts, and compute how often it is fooled by a random permutation.`,
          hints: [R`Take two inputs with the same right half.`, R`Then $f_1(R_0)$ cancels in $L_2 \oplus L_2'$.`],
          solution: R`Query $(L_0, R_0) = (0^n, 0^n)$ and $(L_0', R_0') = (1^n, 0^n)$, receiving $(L_2, R_2)$ and $(L_2', R_2')$. Output "Feistel" iff $L_2 \oplus L_2' = 1^n$.

Feistel: $L_2 \oplus L_2' = (0^n \oplus f_1(0^n)) \oplus (1^n \oplus f_1(0^n)) = 1^n$ always, so it answers "Feistel" with probability 1.

Random permutation: the second output is uniform among the $2^{2n} - 1$ values different from the first. Exactly $2^n$ of them have left half $L_2 \oplus 1^n$ (none equals the first output since $1^n \ne 0^n$), so the test passes with probability $2^n/(2^{2n}-1) \approx 2^{-n}$. The difference $1 - 2^n/(2^{2n}-1)$ is close to 1.`,
          rubric: [ { points: 1, text: R`Two queries with equal right halves, test $L_2 \oplus L_2' = L_0 \oplus L_0'$, and why it always holds for Feistel` },
                    { points: 1, text: R`Probability about $2^{-n}$ for a random permutation` } ] },
        { label: "c", points: 1,
          prompt: R`Suppose $f_1, f_2$ are independent uniformly random functions. Why does a single ciphertext of a single chosen plaintext not help the adversary here?`,
          hints: [R`Look at the distribution of $L_2$ and then of $R_2$ given $L_2$.`],
          solution: R`For a fixed input, $L_2 = L_0 \oplus f_1(R_0)$ is uniform because $f_1(R_0)$ is uniform. Given $L_2$, $R_2 = R_0 \oplus f_2(L_2)$ is uniform because $f_2$ is an independent random function. So one output is a uniform $2n$-bit string, exactly as for a random permutation; the attack needs the relation between two outputs.`,
          rubric: [ { points: 1, text: R`Single output is uniform (argument via $f_1(R_0)$ and $f_2(L_2)$)` } ] },
      ] },
    { id: "l3-prob-spn-weak", type: "problem", lecture: 3, topic: "block-ciphers", origin: "slides",
      source: "Lecture 3, slides 6-7 (exercise in the style of the exam)", difficulty: 2,
      title: "Why an SPN needs key mixing, S-boxes and several rounds",
      mock: false,
      statement: R`Consider 64-bit blocks split into 8 bytes $x = x_1 \| \dots \| x_8$, a fixed public S-box $S \colon \{0,1\}^8 \to \{0,1\}^8$ and a fixed public bit permutation $P$ of $\{0,1\}^{64}$. All of $S$, $S^{-1}$, $P$, $P^{-1}$ are known to the adversary (Kerckhoffs).`,
      parts: [
        { label: "a", points: 1,
          prompt: R`Why is $F(x) := P\bigl(S(x_1) \| \dots \| S(x_8)\bigr)$, i.e. an SPN round without key mixing, useless as a block cipher?`,
          hints: [R`What secret does the adversary not know?`],
          solution: R`$F$ uses no key at all. Anyone can compute $F^{-1}(y)$ by applying $P^{-1}$ and then $S^{-1}$ to each byte, so every ciphertext can be decrypted by the adversary.`,
          rubric: [ { points: 1, text: R`No key; adversary inverts with the public $P^{-1}$ and $S^{-1}$` } ] },
        { label: "b", points: 2,
          prompt: R`Now take one round with key mixing, $F_k(x) := P\bigl(S(x_1 \oplus k_1) \| \dots \| S(x_8 \oplus k_8)\bigr)$ with a 64-bit key $k = k_1 \| \dots \| k_8$. Show how to recover $k$ from one known pair $(x, y = F_k(x))$.`,
          hints: [R`Peel off $P$ and $S$, which are public.`],
          solution: R`Compute $z := P^{-1}(y)$ and split $z = z_1 \| \dots \| z_8$. Then $z_i = S(x_i \oplus k_i)$, so $x_i \oplus k_i = S^{-1}(z_i)$ and
$$k_i = S^{-1}(z_i) \oplus x_i \quad \text{for } i = 1, \dots, 8.$$
This recovers the full key with 8 S-box inversions. A single round is therefore useless; real SPNs use many rounds with different subkeys so that the key bits are not exposed.`,
          rubric: [ { points: 1, text: R`Undo $P$ and $S$: $x_i \oplus k_i = S^{-1}(z_i)$` },
                    { points: 1, text: R`Key $k_i = S^{-1}(z_i) \oplus x_i$ recovered from a single pair` } ] },
        { label: "c", points: 1,
          prompt: R`Suppose $S$ is not a bijection. What goes wrong with $F_k$ from (b)?`,
          hints: [R`Is $F_k$ still a permutation?`],
          solution: R`If $S(a) = S(a')$ for $a \ne a'$, then the inputs $x$ and $x'$ that differ only in byte 1, with $x_1 \oplus k_1 = a$ and $x_1' \oplus k_1 = a'$, give $F_k(x) = F_k(x')$. So $F_k$ is not injective, hence not a permutation, and ciphertexts cannot be uniquely decrypted.`,
          rubric: [ { points: 1, text: R`Collision in $S$ gives a collision of $F_k$; no unique decryption` } ] },
      ] },
  );
})();
