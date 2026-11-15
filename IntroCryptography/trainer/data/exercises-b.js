(function () {
  const R = String.raw;
  const add = (...items) => (window.CRYPTO_BANK = window.CRYPTO_BANK || []).push(...items);

  // ===================== Exercise sheet 4 =====================

  add(
    { id: "es-s4-q1", type: "problem", lecture: 5, topic: "prg", origin: "exercise",
      source: "Exercise 4, Q1", difficulty: 2,
      title: "Is G' a PRG?",
      mock: true,
      statement: R`Recall (Def. 3.14): a deterministic polynomial-time algorithm $G$ with $|G(x)| = \ell(|x|)$ is a **pseudorandom generator (PRG)** if

- (expansion) $\ell(n) > n$ for all $n$, and
- (pseudorandomness) for every p.p.t. distinguisher $\mathcal{D}$ there is a negligible $\varepsilon$ such that

$$\Bigl|\Pr_{s \gets \{0,1\}^n}[\mathcal{D}(G(s)) = 1] - \Pr_{y \gets \{0,1\}^{\ell(n)}}[\mathcal{D}(y) = 1]\Bigr| \le \varepsilon(n).$$

Let $G \colon \{0,1\}^n \to \{0,1\}^{2n}$ be a PRG. In each case, prove or refute that $G'$ is a PRG.`,
      parts: [
        { label: "a", points: 1,
          prompt: R`$G'(x) := x$.`,
          hints: [
            R`Check both conditions of the definition separately.`,
            R`What is the output length of $G'$?`
          ],
          solution: R`**Not a PRG.** $|G'(x)| = |x|$, so $\ell(n) = n$ and the expansion condition $\ell(n) > n$ fails. (Its output is even perfectly uniform, but a PRG must stretch its seed.)`,
          rubric: [
            { points: 1, text: R`Not a PRG because it is not expanding ($\ell(n) = n$)` }
          ] },
        { label: "b", points: 2,
          prompt: R`$G'(x) := x \,\|\, \bigoplus_{i=1}^n x_i$, where $x = x_1 \dots x_n$ and $\|$ is concatenation.`,
          hints: [
            R`$G'$ is expanding ($\ell(n) = n+1$). Look for an efficient test that every output of $G'$ passes.`,
            R`The last bit is the parity of the first $n$ bits. How often does a uniform string satisfy that?`
          ],
          solution: R`**Not a PRG** (it is expanding, but not pseudorandom).

Distinguisher $\mathcal{D}$: on input $y = y_1 \dots y_{n+1}$, output $1$ iff $y_{n+1} = \bigoplus_{i=1}^n y_i$. This takes $n$ XORs, so $\mathcal{D}$ is p.p.t.

- $y = G'(s)$, $s$ uniform: the last bit is the parity of the first $n$ bits by construction, so $\Pr[\mathcal{D}(G'(s)) = 1] = 1$.
- $y$ uniform in $\{0,1\}^{n+1}$: for any fixed $y_1 \dots y_n$, exactly one of the two equally likely values of $y_{n+1}$ passes, so $\Pr[\mathcal{D}(y) = 1] = \tfrac12$.

The advantage is $\tfrac12$ for every $n$, which is not negligible (a negligible $\varepsilon$ satisfies $\varepsilon(n) < \tfrac12$ for large $n$). So $G'$ is not pseudorandom.`,
          rubric: [
            { points: 1, text: R`Distinguisher checking the parity bit, specified completely` },
            { points: 1, text: R`Probabilities $1$ and $\tfrac12$, advantage $\tfrac12$ not negligible` }
          ] },
        { label: "c", points: 3,
          prompt: R`$G'(x) := \overline{G(x)}$, the bitwise complement of $G(x)$.`,
          hints: [
            R`Complementing is an efficient bijection on $\{0,1\}^{2n}$. What does it do to a uniform string?`,
            R`Reduction: from any distinguisher $\mathcal{D}$ for $G'$ build $\mathcal{D}'$ for $G$ that complements its input first.`,
            R`Analyse both worlds of $\mathcal{D}'$: $y = G(s)$ and $y$ uniform.`
          ],
          solution: R`**$G'$ is a PRG.** It is deterministic poly-time and $\ell(n) = 2n > n$.

**Reduction.** Let $\mathcal{D}$ be any p.p.t. distinguisher for $G'$. Define $\mathcal{D}'$ for $G$: on input $y \in \{0,1\}^{2n}$, run $\mathcal{D}(\overline{y})$ and output its result. $\mathcal{D}'$ is p.p.t. (one run of $\mathcal{D}$ plus $2n$ bit flips).

- $y = G(s)$ with $s$ uniform: $\overline{y} = \overline{G(s)} = G'(s)$, so $\Pr[\mathcal{D}'(G(s)) = 1] = \Pr[\mathcal{D}(G'(s)) = 1]$.
- $y$ uniform in $\{0,1\}^{2n}$: complementing is a bijection, so $\overline{y}$ is uniform too, and $\Pr[\mathcal{D}'(y) = 1] = \Pr[\mathcal{D}(y) = 1]$.

Since $G$ is a PRG, there is a negligible $\varepsilon$ with

$$\Bigl|\Pr[\mathcal{D}(G'(s)) = 1] - \Pr[\mathcal{D}(y) = 1]\Bigr| = \Bigl|\Pr[\mathcal{D}'(G(s)) = 1] - \Pr[\mathcal{D}'(y) = 1]\Bigr| \le \varepsilon(n).$$

As $\mathcal{D}$ was arbitrary, $G'$ is pseudorandom, hence a PRG.`,
          rubric: [
            { points: 1, text: R`Correct answer; expansion checked; reduction $\mathcal{D}'$ (complement, then run $\mathcal{D}$) defined and p.p.t.` },
            { points: 1, text: R`Both worlds analysed, using that complementation maps uniform to uniform` },
            { points: 1, text: R`Concludes with the inequality from the PRG security of $G$` }
          ] }
      ] },

    { id: "es-s4-q2", type: "problem", lecture: 5, topic: "reductions", origin: "exercise",
      source: "Exercise 4, Q2", difficulty: 3,
      title: "Two independent keys: EAV security via a hybrid argument",
      mock: true,
      statement: R`Let $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ be an EAV-secure encryption scheme for $n$-bit messages (Def. 3.8: for every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$). Define $\Pi'$ for $2n$-bit messages:

- $\mathsf{Gen}'(1^n)$: run $k_1 \gets \mathsf{Gen}(1^n)$, $k_2 \gets \mathsf{Gen}(1^n)$; return $(k_1, k_2)$.
- $\mathsf{Enc}'_{(k_1,k_2)}(m_1 \| m_2)$: return $c_1 \| c_2$ with $c_1 \gets \mathsf{Enc}_{k_1}(m_1)$, $c_2 \gets \mathsf{Enc}_{k_2}(m_2)$.
- $\mathsf{Dec}'_{(k_1,k_2)}(c_1 \| c_2)$: return $\mathsf{Dec}_{k_1}(c_1) \,\|\, \mathsf{Dec}_{k_2}(c_2)$.`,
      parts: [
        { label: "a", points: 6,
          prompt: R`Prove that $\Pi'$ is EAV-secure by a reduction to the EAV-security of $\Pi$.`,
          hints: [
            R`The adversary $\mathcal{A}'$ against $\Pi'$ may choose $m_0 = m_0^1 \| m_0^2$ and $m_1 = m_1^1 \| m_1^2$ that differ in both halves, but your reduction can embed its challenge in only one half.`,
            R`Introduce a "mixed" ciphertext $H_1 = \mathsf{Enc}_{k_1}(m_1^1) \| \mathsf{Enc}_{k_2}(m_0^2)$ between $H_0$ (encryption of $m_0$) and $H_2$ (encryption of $m_1$).`,
            R`Let the reduction pick $i \in \{1,2\}$ at random and embed its challenge in half $i$, producing the other half itself with a key it samples. Then $p_1$ cancels when averaging.`
          ],
          solution: R`Let $\mathcal{A}'$ be any p.p.t. adversary against $\Pi'$, outputting $m_0 = m_0^1 \| m_0^2$, $m_1 = m_1^1 \| m_1^2$ (halves of $n$ bits). With independent $k_1, k_2 \gets \mathsf{Gen}(1^n)$ define the ciphertext distributions

$$\begin{aligned} H_0 &: \mathsf{Enc}_{k_1}(m_0^1) \,\|\, \mathsf{Enc}_{k_2}(m_0^2) \\ H_1 &: \mathsf{Enc}_{k_1}(m_1^1) \,\|\, \mathsf{Enc}_{k_2}(m_0^2) \\ H_2 &: \mathsf{Enc}_{k_1}(m_1^1) \,\|\, \mathsf{Enc}_{k_2}(m_1^2) \end{aligned}$$

and let $p_j := \Pr[\mathcal{A}' \text{ outputs } 1 \text{ when its challenge is distributed as } H_j]$. In $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A}',\Pi'}$ the challenge is $H_0$ if $b=0$ and $H_2$ if $b=1$, so

$$\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A}',\Pi'}(n) = 1] = \tfrac12(1 - p_0) + \tfrac12 p_2 = \tfrac12 + \tfrac12(p_2 - p_0).$$

**Reduction $\mathcal{A}$ against $\Pi$:**

1. Run $\mathcal{A}'(1^n)$ to get $m_0, m_1$. Choose $i \gets \{1,2\}$ uniformly.
2. If $i = 1$: send $(m_0^1, m_1^1)$ to the challenger, receive $c^*$; sample $k_2 \gets \mathsf{Gen}(1^n)$ and set $c := c^* \,\|\, \mathsf{Enc}_{k_2}(m_0^2)$.
3. If $i = 2$: send $(m_0^2, m_1^2)$, receive $c^*$; sample $k_1 \gets \mathsf{Gen}(1^n)$ and set $c := \mathsf{Enc}_{k_1}(m_1^1) \,\|\, c^*$.
4. Give $c$ to $\mathcal{A}'$ and output whatever $\mathcal{A}'$ outputs.

$\mathcal{A}$ is p.p.t. and sends valid equal-length ($n$-bit) messages. Let $\beta$ be its challenger's bit, so $c^* \gets \mathsf{Enc}_k(m^i_\beta)$ with an independent key $k$. Then $\mathcal{A}'$ sees: $i=1, \beta=0$: $H_0$; $i=1, \beta=1$: $H_1$; $i=2, \beta=0$: $H_1$; $i=2, \beta=1$: $H_2$. Hence

$$\Pr[\mathcal{A} \text{ wins} \mid i=1] = \tfrac12 + \tfrac12(p_1 - p_0), \qquad \Pr[\mathcal{A} \text{ wins} \mid i=2] = \tfrac12 + \tfrac12(p_2 - p_1),$$

and averaging over $i$: $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] = \tfrac12 + \tfrac14(p_2 - p_0)$.

By EAV-security of $\Pi$ there is a negligible $\varepsilon$ with $\tfrac14(p_2 - p_0) \le \varepsilon(n)$. Therefore

$$\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A}',\Pi'}(n) = 1] = \tfrac12 + \tfrac12(p_2 - p_0) \le \tfrac12 + 2\varepsilon(n),$$

and $2\varepsilon$ is negligible. Since $\mathcal{A}'$ was arbitrary, $\Pi'$ is EAV-secure. $\blacksquare$

(Equivalently: two reductions $\mathcal{A}_1$, $\mathcal{A}_2$ with fixed $i$ bound $p_1 - p_0$ and $p_2 - p_1$ separately. The independence of $k_1, k_2$ is essential: the reduction can create the other half only because it can sample that key itself.)`,
          rubric: [
            { points: 1, text: R`Identifies the problem (both halves may differ) and defines the hybrid $H_1$ (or two separate reductions)` },
            { points: 2, text: R`Reduction fully specified: embeds its challenge in one half, simulates the other half with a self-sampled independent key, outputs $\mathcal{A}'$'s guess; p.p.t. and valid messages` },
            { points: 2, text: R`Correct analysis of what $\mathcal{A}'$ sees in each case and the resulting success probabilities` },
            { points: 1, text: R`Conclusion: $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A}',\Pi'}=1] \le \tfrac12 + 2\varepsilon(n)$ (or sum of two negligible terms)` }
          ] }
      ] },

    { id: "es-s4-q3", type: "problem", lecture: 5, topic: "prg", origin: "exercise",
      source: "Exercise 4, Q3", difficulty: 3,
      title: "Pseudo one-time pad: EAV-secure only if G is pseudorandom",
      mock: true,
      statement: R`Let $G$ be a deterministic polynomial-time algorithm with $|G(k)| = \ell(n) > n$ for $k \in \{0,1\}^n$. The **pseudo one-time pad** $\Pi$ for messages in $\{0,1\}^{\ell(n)}$: $\mathsf{Gen}(1^n)$ outputs a uniform $k \in \{0,1\}^n$; $\mathsf{Enc}_k(m) := G(k) \oplus m$; $\mathsf{Dec}_k(c) := G(k) \oplus c$.

The lecture proved: if $G$ is a PRG, then $\Pi$ is EAV-secure. ($G$ is pseudorandom if for every p.p.t. $\mathcal{D}$ the advantage $\bigl|\Pr_{k}[\mathcal{D}(G(k)) = 1] - \Pr_{y \gets \{0,1\}^{\ell(n)}}[\mathcal{D}(y) = 1]\bigr|$ is negligible.)`,
      parts: [
        { label: "a", points: 5,
          prompt: R`Show the converse: if $G$ is not pseudorandom, then the pseudo one-time pad is not EAV-secure.`,
          hints: [
            R`Now the reduction runs the other way: build an EAV adversary from a distinguisher $\mathcal{D}$ for $G$.`,
            R`Choose the challenge messages so that one ciphertext is exactly $G(k)$ and the other is uniformly random.`,
            R`Take $m_0 := 0^{\ell(n)}$ and $m_1 := r$ uniform. Then the success probability is $\tfrac12 + \tfrac12(\Pr[\mathcal{D}(G(k))=1] - \Pr[\mathcal{D}(y)=1])$. Mind the sign of the difference.`
          ],
          solution: R`Since $G$ is not pseudorandom, there is a p.p.t. $\mathcal{D}$ whose advantage

$$\delta(n) := \bigl|p_G(n) - p_U(n)\bigr|, \quad p_G := \Pr_k[\mathcal{D}(G(k)) = 1], \quad p_U := \Pr_y[\mathcal{D}(y) = 1]$$

is not negligible. Suppose, for contradiction, that $\Pi$ is EAV-secure.

**Adversary $\mathcal{A}$:**

1. Sample $r \gets \{0,1\}^{\ell(n)}$; output $m_0 := 0^{\ell(n)}$ and $m_1 := r$ (equal lengths).
2. On challenge $c$: run $\beta \gets \mathcal{D}(c)$; output $b' := 0$ if $\beta = 1$ and $b' := 1$ if $\beta = 0$.

$\mathcal{A}$ is p.p.t. Cases:

- $b = 0$: $c = G(k) \oplus 0^{\ell(n)} = G(k)$, so $\Pr[b' = 0 \mid b = 0] = p_G$.
- $b = 1$: $c = G(k) \oplus r$ with $r$ uniform and independent of $k$, so $c$ is uniform (one-time pad); $\Pr[b' = 1 \mid b = 1] = 1 - p_U$.

Hence $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] = \tfrac12 p_G + \tfrac12(1 - p_U) = \tfrac12 + \tfrac12(p_G - p_U)$.

Let $\overline{\mathcal{A}}$ be $\mathcal{A}$ with the output bit flipped; it wins exactly when $\mathcal{A}$ loses: $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\overline{\mathcal{A}},\Pi}(n) = 1] = \tfrac12 + \tfrac12(p_U - p_G)$.

By EAV-security there are negligible $\varepsilon_1, \varepsilon_2$ with $\tfrac12(p_G - p_U) \le \varepsilon_1(n)$ and $\tfrac12(p_U - p_G) \le \varepsilon_2(n)$. Thus

$$\delta(n) = |p_G - p_U| \le 2\varepsilon_1(n) + 2\varepsilon_2(n),$$

which is negligible, contradicting the choice of $\mathcal{D}$. Hence $\Pi$ is not EAV-secure, and together with the lecture's theorem: the pseudo one-time pad is EAV-secure **iff** $G$ is pseudorandom. $\blacksquare$`,
          rubric: [
            { points: 1, text: R`Negation stated correctly: a p.p.t. $\mathcal{D}$ with non-negligible advantage exists` },
            { points: 2, text: R`EAV adversary fully specified: messages $0^{\ell(n)}$ and uniform $r$ (or swapped), runs $\mathcal{D}$ on $c$, maps its output to $b'$` },
            { points: 1, text: R`Both cases analysed ($c = G(k)$ vs. $c$ uniform), success $\tfrac12 + \tfrac12(p_G - p_U)$` },
            { points: 1, text: R`Handles the sign (flipped adversary or absolute value) and concludes the contradiction` }
          ] }
      ] },

    { id: "es-s4-q4", type: "problem", lecture: 6, topic: "cpa-prf", origin: "exercise",
      source: "Exercise 4, Q4", difficulty: 3,
      title: "Is F' a PRF?",
      mock: true,
      statement: R`Recall (Def. 3.24): a keyed function $F \colon \{0,1\}^n \times \{0,1\}^{n} \to \{0,1\}^{n}$ is a **PRF** if for every p.p.t. $\mathcal{D}$ there is a negligible $\varepsilon$ with

$$\Bigl|\Pr_{k \gets \{0,1\}^n}[\mathcal{D}^{F_k(\cdot)}(1^n) = 1] - \Pr_{f \gets \mathsf{Func}_n}[\mathcal{D}^{f(\cdot)}(1^n) = 1]\Bigr| \le \varepsilon(n),$$

where $\mathsf{Func}_n$ is the set of all functions $\{0,1\}^n \to \{0,1\}^n$. For other input/output lengths, $f$ is a uniform function with the matching lengths.

Let $F$ be a PRF. In each case state whether $F'$ is a PRF. If yes, prove it by a reduction to $F$; if not, give a distinguisher and analyse it.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`$F'_k(x) := k \oplus x$, with $F' \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$.`,
          hints: [
            R`The key cancels when you XOR two outputs.`,
            R`Query $0^n$ and $1^n$ and look at $y_1 \oplus y_2$.`
          ],
          solution: R`**Not a PRF.** $\mathcal{D}^{\mathcal{O}}$: query $y_1 := \mathcal{O}(0^n)$, $y_2 := \mathcal{O}(1^n)$; output $1$ iff $y_1 \oplus y_2 = 1^n$.

- $\mathcal{O} = F'_k$: $y_1 \oplus y_2 = (k \oplus 0^n) \oplus (k \oplus 1^n) = 1^n$ always, so $\Pr = 1$.
- $\mathcal{O} = f \gets \mathsf{Func}_n$: $0^n \neq 1^n$, so $y_1, y_2$ are independent and uniform; $\Pr[y_2 = y_1 \oplus 1^n] = 2^{-n}$.

Advantage $1 - 2^{-n} \ge \tfrac12$, not negligible.`,
          rubric: [
            { points: 1, text: R`Distinguisher with two distinct queries testing an XOR relation` },
            { points: 1, text: R`Probabilities $1$ vs. $2^{-n}$; advantage not negligible` }
          ] },
        { label: "b", points: 3,
          prompt: R`$F'_k(x) := F_k(x \| 0) \,\|\, F_k(x \| 1)$, with $F' \colon \{0,1\}^n \times \{0,1\}^{n-1} \to \{0,1\}^{2n}$.`,
          hints: [
            R`Answer each query of a distinguisher for $F'$ with two queries to your own oracle.`,
            R`If your oracle is a random $f \in \mathsf{Func}_n$: do different queries $x \neq x'$ ever use the same input of $f$?`,
            R`The inputs $x\|0, x\|1$ are distinct across distinct $x$, so $x \mapsto f(x\|0)\|f(x\|1)$ is a uniformly random function $\{0,1\}^{n-1} \to \{0,1\}^{2n}$.`
          ],
          solution: R`**$F'$ is a PRF.** Let $\mathcal{D}$ be any p.p.t. distinguisher for $F'$. Define $\mathcal{D}'^{\mathcal{O}}$ (with $\mathcal{O} \colon \{0,1\}^n \to \{0,1\}^n$): run $\mathcal{D}(1^n)$; answer each query $x \in \{0,1\}^{n-1}$ with $\mathcal{O}(x \| 0) \,\|\, \mathcal{O}(x \| 1)$; output what $\mathcal{D}$ outputs. $\mathcal{D}'$ is p.p.t. (twice as many queries).

- $\mathcal{O} = F_k$: every answer equals $F'_k(x)$, so $\Pr[\mathcal{D}'^{F_k} = 1] = \Pr[\mathcal{D}^{F'_k} = 1]$.
- $\mathcal{O} = f \gets \mathsf{Func}_n$: $\mathcal{D}$ sees $g(x) := f(x\|0) \,\|\, f(x\|1)$. The map $x \mapsto \{x\|0, x\|1\}$ uses disjoint inputs of $f$ for distinct $x$, and $f$'s values on distinct inputs are independent and uniform; hence $g$ is a uniformly random function $\{0,1\}^{n-1} \to \{0,1\}^{2n}$. So $\Pr[\mathcal{D}'^{f} = 1] = \Pr[\mathcal{D}^{g} = 1]$ for uniform $g$.

Since $F$ is a PRF, there is a negligible $\varepsilon$ with

$$\bigl|\Pr[\mathcal{D}^{F'_k} = 1] - \Pr[\mathcal{D}^{g} = 1]\bigr| = \bigl|\Pr[\mathcal{D}'^{F_k} = 1] - \Pr[\mathcal{D}'^{f} = 1]\bigr| \le \varepsilon(n).$$

As $\mathcal{D}$ was arbitrary, $F'$ is a PRF.`,
          rubric: [
            { points: 1, text: R`Reduction $\mathcal{D}'$ answering each query with $\mathcal{O}(x\|0)\,\|\,\mathcal{O}(x\|1)$` },
            { points: 1, text: R`Random world argued correctly: distinct queries use disjoint inputs of $f$, so $\mathcal{D}$ sees a uniform function` },
            { points: 1, text: R`Real world matches $F'_k$; conclusion via PRF security of $F$` }
          ] },
        { label: "c", points: 3,
          prompt: R`$F'_k(x) := F_k(x) \,\|\, F_k(F_k(x))$, with $F' \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^{2n}$.`,
          hints: [
            R`The second half of an output is $F_k$ applied to the first half.`,
            R`Query $x$, then query the first half of the answer.`,
            R`For a random function, treat separately the unlucky case where the second query equals the first.`
          ],
          solution: R`**Not a PRF.** $\mathcal{D}^{\mathcal{O}}$: query $y_1 \| z_1 := \mathcal{O}(0^n)$, then $y_2 \| z_2 := \mathcal{O}(y_1)$ (all halves $n$ bits); output $1$ iff $y_2 = z_1$.

- $\mathcal{O} = F'_k$: $y_1 = F_k(0^n)$, $z_1 = F_k(y_1)$ and $y_2 = F_k(y_1) = z_1$. So $\Pr = 1$.
- $\mathcal{O} = g$ uniform from $\{0,1\}^n$ to $\{0,1\}^{2n}$: $y_1 \| z_1$ is uniform.
  - If $y_1 \neq 0^n$: $g(y_1)$ is fresh and independent of $z_1$, so $\Pr[y_2 = z_1] = 2^{-n}$.
  - If $y_1 = 0^n$: $y_2 = y_1 = 0^n$, and $z_1$ is uniform and independent of $y_1$, so $\Pr[z_1 = 0^n] = 2^{-n}$.

  In both cases $\Pr = 2^{-n}$.

Advantage $1 - 2^{-n}$, not negligible.`,
          rubric: [
            { points: 1, text: R`Distinguisher: query $x$, then query the first half of the answer, compare with the second half` },
            { points: 1, text: R`Real case always outputs $1$` },
            { points: 1, text: R`Random case $2^{-n}$, including the repeated-query case $y_1 = 0^n$` }
          ] }
      ] },

    { id: "es-s4-q5", type: "problem", lecture: 6, topic: "cpa-prf", origin: "exercise",
      source: "Exercise 4, Q5", difficulty: 2,
      title: "Every PRP is a PRF",
      mock: true,
      statement: R`$F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ (with each $F_k$ a permutation) is a **pseudorandom permutation (PRP)** if for every p.p.t. $\mathcal{D}$ the quantity $\bigl|\Pr_{k \gets \{0,1\}^n}[\mathcal{D}^{F_k(\cdot)}(1^n) = 1] - \Pr_{\pi \gets \mathsf{Perm}_n}[\mathcal{D}^{\pi(\cdot)}(1^n) = 1]\bigr|$ is negligible, where $\mathsf{Perm}_n$ is the set of permutations of $\{0,1\}^n$. It is a **PRF** if the same holds with $f \gets \mathsf{Func}_n$ in place of $\pi \gets \mathsf{Perm}_n$.

You may use (switching lemma): for any $\mathcal{D}$ making $q = q(n)$ queries,

$$\Bigl|\Pr_{f \gets \mathsf{Func}_n}[\mathcal{D}^{f(\cdot)}(1^n) = 1] - \Pr_{\pi \gets \mathsf{Perm}_n}[\mathcal{D}^{\pi(\cdot)}(1^n) = 1]\Bigr| \le \frac{q^2}{2^{n+1}}.$$`,
      parts: [
        { label: "a", points: 3,
          prompt: R`Prove that if $F$ is a PRP, then $F$ is also a PRF.`,
          hints: [
            R`Insert the random-permutation probability as an intermediate term.`,
            R`Use the triangle inequality $|a + b| \le |a| + |b|$, then bound each term.`
          ],
          solution: R`Let $\mathcal{D}$ be p.p.t.; it makes at most $q(n)$ queries for a polynomial $q$. Write $P_F := \Pr[\mathcal{D}^{F_k} = 1]$, $P_\pi := \Pr[\mathcal{D}^{\pi} = 1]$, $P_f := \Pr[\mathcal{D}^{f} = 1]$. By the triangle inequality,

$$|P_F - P_f| \le |P_F - P_\pi| + |P_\pi - P_f| \le \varepsilon(n) + \frac{q(n)^2}{2^{n+1}},$$

where $\varepsilon$ is negligible because $F$ is a PRP, and the second bound is the switching lemma. Since $q(n)^2$ is a polynomial, $q(n)^2 / 2^{n+1}$ is negligible, and the sum of two negligible functions is negligible. As $\mathcal{D}$ was arbitrary, $F$ is a PRF. $\blacksquare$`,
          rubric: [
            { points: 1, text: R`Hybrid via the random permutation and triangle inequality` },
            { points: 1, text: R`First term bounded by PRP security, second by the switching lemma` },
            { points: 1, text: R`Argues $q(n)^2/2^{n+1}$ negligible because $q$ is polynomial (p.p.t.), and the sum is negligible` }
          ] }
      ] },

    { id: "es-s4-q6", type: "problem", lecture: 6, topic: "cpa-prf", origin: "exercise",
      source: "Exercise 4, Q6", difficulty: 3,
      title: "Two schemes that are not CPA-secure",
      mock: true,
      statement: R`Recall (Def. 3.21): $\Pi$ is **CPA-secure** if for every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$. In $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)$: $k \gets \mathsf{Gen}(1^n)$; $\mathcal{A}$ has oracle access to $\mathsf{Enc}_k(\cdot)$ throughout, outputs $m_0, m_1$ with $|m_0| = |m_1|$, receives $c \gets \mathsf{Enc}_k(m_b)$ for uniform $b$, and outputs $b'$; the output is $1$ iff $b' = b$.

Prove or refute that the following schemes are CPA-secure.`,
      parts: [
        { label: "a", points: 3,
          prompt: R`$F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ is a PRF; messages have length $n$. $\mathsf{Gen}$: uniform $k \in \{0,1\}^n$. $\mathsf{Enc}_k(m)$: choose a uniform **bit** $r \in \{0,1\}$ and return $c := r \,\|\, (F_k(0^{n-1} \| r) \oplus m)$. $\mathsf{Dec}_k(r \| s) := F_k(0^{n-1} \| r) \oplus s$.`,
          hints: [
            R`How many different pads $F_k(0^{n-1} \| r)$ can ever be used?`,
            R`An oracle query on $0^n$ reveals the pad $F_k(0^{n-1} \| r')$ for a random bit $r'$.`,
            R`With probability $\tfrac12$ the oracle's $r'$ equals the challenge's $r$; then compare.`
          ],
          solution: R`**Not CPA-secure.** There are only two pads, $F_k(0^{n-1}\|0)$ and $F_k(0^{n-1}\|1)$.

**Adversary $\mathcal{A}$:**

1. Output $m_0 := 0^n$, $m_1 := 1^n$; receive $c = r \| s$.
2. Query the oracle on $0^n$; receive $r' \| s'$, where $s' = F_k(0^{n-1}\|r')$.
3. If $r' = r$: output $b' := 0$ if $s = s'$, else $b' := 1$. If $r' \neq r$: output a uniform bit.

**Analysis.** $r'$ is uniform and independent of $r$ and $b$, so $E := [r' = r]$ has $\Pr[E] = \tfrac12$. If $E$ occurs, $s' = F_k(0^{n-1}\|r)$ is the challenge pad and $s = s' \oplus m_b$, so $s = s' \iff m_b = 0^n \iff b = 0$: $\mathcal{A}$ is always correct. Otherwise it is correct with probability $\tfrac12$. Hence

$$\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] = \tfrac12 \cdot 1 + \tfrac12 \cdot \tfrac12 = \tfrac34,$$

and $\tfrac14$ is not negligible. (Querying $0^n$ repeatedly until both values of $r'$ have appeared pushes the success probability arbitrarily close to $1$.)`,
          rubric: [
            { points: 1, text: R`Observes that only two pads exist, so an oracle query reuses the challenge pad with probability $\tfrac12$` },
            { points: 1, text: R`Adversary fully specified (challenge messages, oracle query, decision rule)` },
            { points: 1, text: R`Success probability $\tfrac34$ computed and shown to exceed $\tfrac12 + \mathsf{negl}(n)$` }
          ] },
        { label: "b", points: 3,
          prompt: R`$G \colon \{0,1\}^n \to \{0,1\}^{2n}$ is a PRG and $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ a PRP; messages have length $2n$. $\mathsf{Gen}$: uniform $k \in \{0,1\}^n$. $\mathsf{Enc}_k(m_1 \| m_2)$: compute $k_1 \| k_2 := G(k)$ with $k_1, k_2 \in \{0,1\}^n$, return $F_{k_1}(m_1) \,\|\, F_{k_2}(m_2)$. $\mathsf{Dec}_k(c_1 \| c_2) := F^{-1}_{k_1}(c_1) \,\|\, F^{-1}_{k_2}(c_2)$.`,
          hints: [
            R`Does $\mathsf{Enc}_k$ use any fresh randomness?`,
            R`A deterministic scheme can never be CPA-secure: encrypt one of the challenge messages via the oracle.`,
            R`In the standard CPA game the oracle may be queried on any message, including $m_0$. Query $m_0$ before the challenge and compare.`
          ],
          solution: R`**Not CPA-secure**, because $\mathsf{Enc}_k$ is deterministic: $k_1\|k_2 = G(k)$ is fixed by $k$, and $F$ uses no randomness.

**Adversary $\mathcal{A}$:**

1. Query the oracle on $0^{2n}$; receive $c_0 = F_{k_1}(0^n) \,\|\, F_{k_2}(0^n)$.
2. Output $m_0 := 0^{2n}$, $m_1 := 1^{2n}$; receive $c$.
3. Output $b' := 0$ if $c = c_0$, else $b' := 1$.

- $b = 0$: $c = \mathsf{Enc}_k(0^{2n}) = c_0$, so $b' = 0$.
- $b = 1$: $c = F_{k_1}(1^n) \,\|\, F_{k_2}(1^n)$; since $F_{k_1}$ is a permutation and $1^n \neq 0^n$, $F_{k_1}(1^n) \neq F_{k_1}(0^n)$, so $c \neq c_0$ and $b' = 1$.

$\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] = 1 > \tfrac12 + \varepsilon(n)$ for every negligible $\varepsilon$ and large $n$. (The PRG and PRP do not help: no deterministic scheme is CPA-secure.)`,
          rubric: [
            { points: 1, text: R`Identifies determinism of $\mathsf{Enc}$ as the flaw` },
            { points: 1, text: R`Adversary fully specified: oracle query on $m_0$, comparison with the challenge` },
            { points: 1, text: R`Both cases analysed (permutation property for $b=1$), success probability $1$` }
          ] }
      ] },

    // ---- T/F items for sheet 4 ----
    { id: "es-tf-s4-q1-b", type: "tf", lecture: 5, topic: "prg", origin: "exercise",
      source: "Exercise 4, Q1b", difficulty: 1,
      statement: R`The function $G'(x) := x \,\|\, \bigoplus_{i=1}^n x_i$ (the seed followed by its parity bit) is a PRG.`,
      answer: false,
      explanation: R`It is expanding but not pseudorandom: the test "last bit equals parity of the others" always passes on outputs of $G'$, but only with probability $\tfrac12$ on uniform strings.` },
    { id: "es-tf-s4-q1-c", type: "tf", lecture: 5, topic: "prg", origin: "exercise",
      source: "Exercise 4, Q1c", difficulty: 2,
      statement: R`If $G$ is a PRG, then $G'(x) := \overline{G(x)}$ (bitwise complement) is also a PRG.`,
      answer: true,
      explanation: R`A distinguisher for $G'$ yields one for $G$ by complementing its input first; complementation maps $G(s)$ to $G'(s)$ and uniform strings to uniform strings, so the advantages are equal.` },
    { id: "es-tf-s4-q2", type: "tf", lecture: 5, topic: "reductions", origin: "exercise",
      source: "Exercise 4, Q2", difficulty: 2,
      statement: R`If $\Pi$ is EAV-secure for $n$-bit messages, then encrypting $m_1 \| m_2$ as $\mathsf{Enc}_{k_1}(m_1) \,\|\, \mathsf{Enc}_{k_2}(m_2)$ with independent keys $k_1, k_2 \gets \mathsf{Gen}(1^n)$ is EAV-secure for $2n$-bit messages.`,
      answer: true,
      explanation: R`Hybrid argument: switch the challenge from $m_0$ to $m_1$ one half at a time; each step is a single $\Pi$-challenge that the reduction can embed, simulating the other half with a key it samples itself. Total advantage at most twice a negligible function.` },
    { id: "es-tf-s4-q3", type: "tf", lecture: 5, topic: "prg", origin: "exercise",
      source: "Exercise 4, Q3", difficulty: 2,
      statement: R`For an expanding, deterministic polynomial-time $G$, the pseudo one-time pad $\mathsf{Enc}_k(m) = G(k) \oplus m$ is EAV-secure if and only if $G$ is pseudorandom.`,
      answer: true,
      explanation: R`"If" is the lecture theorem. "Only if": with challenge messages $0^{\ell(n)}$ and a uniform $r$, the ciphertext is either $G(k)$ or uniform, so a distinguisher for $G$ directly wins the EAV game with non-negligible advantage.` },
    { id: "es-tf-s4-q4-b", type: "tf", lecture: 6, topic: "cpa-prf", origin: "exercise",
      source: "Exercise 4, Q4b", difficulty: 2,
      statement: R`If $F$ is a PRF, then $F'_k(x) := F_k(x \| 0) \,\|\, F_k(x \| 1)$ for $x \in \{0,1\}^{n-1}$ is a PRF with $2n$-bit outputs.`,
      answer: true,
      explanation: R`Distinct queries $x$ use disjoint inputs $x\|0, x\|1$ of $F_k$; replacing $F_k$ by a random function therefore gives a uniformly random function with $2n$-bit outputs. The reduction answers each query with two oracle queries.` },
    { id: "es-tf-s4-q4-c", type: "tf", lecture: 6, topic: "cpa-prf", origin: "exercise",
      source: "Exercise 4, Q4c", difficulty: 2,
      statement: R`If $F$ is a PRF, then $F'_k(x) := F_k(x) \,\|\, F_k(F_k(x))$ is a PRF.`,
      answer: false,
      explanation: R`Query $0^n$ to get $y_1 \| z_1$, then query $y_1$: for $F'$ the first half of the answer equals $z_1$ always, for a random function only with probability $2^{-n}$.` },
    { id: "es-tf-s4-q5", type: "tf", lecture: 6, topic: "cpa-prf", origin: "exercise",
      source: "Exercise 4, Q5", difficulty: 2,
      statement: R`Every pseudorandom permutation $F \colon \{0,1\}^n \times \{0,1\}^n \to \{0,1\}^n$ is also a pseudorandom function.`,
      answer: true,
      explanation: R`By the triangle inequality, the PRF advantage is at most the PRP advantage plus $q^2/2^{n+1}$ (switching lemma), which is negligible for polynomially many queries $q$.` },
    { id: "es-tf-s4-q6-a", type: "tf", lecture: 6, topic: "cpa-prf", origin: "exercise",
      source: "Exercise 4, Q6a", difficulty: 2,
      statement: R`If $F$ is a PRF, the scheme $\mathsf{Enc}_k(m) := r \,\|\, (F_k(0^{n-1}\|r) \oplus m)$ with a uniformly random single bit $r$ is CPA-secure.`,
      answer: false,
      explanation: R`There are only two pads. An oracle query on $0^n$ reveals the challenge pad with probability $\tfrac12$, giving an adversary with success probability $\tfrac34$. CPA-security needs the randomness to (almost) never repeat.` },
    { id: "es-tf-s4-q6-b", type: "tf", lecture: 6, topic: "cpa-prf", origin: "exercise",
      source: "Exercise 4, Q6b", difficulty: 1,
      statement: R`An encryption scheme whose $\mathsf{Enc}$ algorithm is deterministic cannot be CPA-secure, even if it is built from a PRG and a PRP.`,
      answer: true,
      explanation: R`The adversary queries its oracle on $m_0$ and compares the result with the challenge ciphertext; for $m_0 \neq m_1$ correctness forces $\mathsf{Enc}_k(m_1) \neq \mathsf{Enc}_k(m_0)$, so it wins with probability 1.` }
  );

  // ===================== Exercise sheet 5 =====================

  add(
    { id: "es-s5-q1", type: "problem", lecture: 6, topic: "cpa-prf", origin: "exercise",
      source: "Exercise 5, Q1", difficulty: 3,
      title: "CPA security of F_k(m || r) from a PRP",
      mock: true,
      statement: R`Let $F \colon \{0,1\}^{2n} \times \{0,1\}^{2n} \to \{0,1\}^{2n}$ be a pseudorandom permutation (PRP): for every p.p.t. $\mathcal{D}$ there is a negligible $\varepsilon$ with

$$\Bigl|\Pr_{k \gets \{0,1\}^{2n}}[\mathcal{D}^{F_k(\cdot)}(1^n) = 1] - \Pr_{\pi \gets \mathsf{Perm}_{2n}}[\mathcal{D}^{\pi(\cdot)}(1^n) = 1]\Bigr| \le \varepsilon(n).$$

Consider $\Pi$ for $\mathcal{M} = \{0,1\}^n$:

- $\mathsf{Gen}(1^n)$: uniform $k \in \{0,1\}^{2n}$.
- $\mathsf{Enc}_k(m)$: choose uniform $r \in \{0,1\}^n$ and return $c := F_k(m \| r)$.
- $\mathsf{Dec}_k(c)$: return the first $n$ bits of $F_k^{-1}(c)$.

CPA-security (Def. 3.21): for every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$.

For comparison, the lecture proved CPA-security of Construction 3.28, $\mathsf{Enc}_k(m) = (r, F_k(r) \oplus m)$, by replacing $F_k$ with a random function and bounding the probability that the challenge's $r$ repeats by $q(n)/2^n$.`,
      parts: [
        { label: "a", points: 6,
          prompt: R`Prove that $\Pi$ is CPA-secure.`,
          hints: [
            R`Build a distinguisher $\mathcal{D}^{\mathcal{O}}$ for $F$ that plays the CPA game with $\mathcal{A}$, answering every encryption with $\mathcal{O}(m \| r)$ for a fresh $r$, and outputs 1 iff $\mathcal{A}$ wins.`,
            R`With $\mathcal{O} = F_k$ the simulation is perfect. With $\mathcal{O} = \pi$ random, define the bad event that the challenge randomness $r^*$ also appears in one of $\mathcal{A}$'s oracle queries.`,
            R`If the bad event does not happen, $\pi$ is never evaluated on $m_0\|r^*$ or $m_1\|r^*$ except for the challenge, so the view of $\mathcal{A}$ is independent of $b$. The bad event has probability at most $q(n)/2^n$.`
          ],
          solution: R`(Correctness: $F_k^{-1}(F_k(m\|r)) = m \| r$, whose first $n$ bits are $m$.)

Let $\mathcal{A}$ be any p.p.t. adversary; it makes at most $q(n)$ oracle queries for a polynomial $q$.

**Distinguisher $\mathcal{D}^{\mathcal{O}}(1^n)$**, $\mathcal{O} \colon \{0,1\}^{2n} \to \{0,1\}^{2n}$:

1. Run $\mathcal{A}(1^n)$. Answer each encryption query $m$ by choosing a fresh uniform $r \in \{0,1\}^n$ and returning $\mathcal{O}(m \| r)$.
2. When $\mathcal{A}$ outputs $m_0, m_1$: choose uniform $b \in \{0,1\}$ and $r^* \in \{0,1\}^n$ and give $c^* := \mathcal{O}(m_b \| r^*)$ to $\mathcal{A}$. Keep answering queries as in step 1.
3. When $\mathcal{A}$ outputs $b'$: output $1$ iff $b' = b$.

$\mathcal{D}$ is p.p.t. since $\mathcal{A}$ is.

**Pseudorandom world** $\mathcal{O} = F_k$: all answers and the challenge are distributed exactly as in $\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n)$, so

$$\Pr[\mathcal{D}^{F_k(\cdot)}(1^n) = 1] = \Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1].$$

**Random world** $\mathcal{O} = \pi \gets \mathsf{Perm}_{2n}$: let $\mathsf{Rep}$ be the event that $r^*$ equals the value $r$ used in at least one oracle query (before or after the challenge). Each query uses a fresh uniform $r$, so by the union bound $\Pr[\mathsf{Rep}] \le q(n)/2^n$.

If $\mathsf{Rep}$ does not occur, the inputs of $\pi$ are the distinct query inputs $m\|r$ with $r \neq r^*$ plus the single challenge input $m_b \| r^*$; neither $m_0\|r^*$ nor $m_1\|r^*$ is ever queried. The outputs of a random permutation on distinct inputs form a uniformly random sequence of distinct values, regardless of what those inputs are. So the view of $\mathcal{A}$ is independent of $b$, and $\Pr[b' = b \mid \overline{\mathsf{Rep}}] = \tfrac12$. Hence

$$\Pr[\mathcal{D}^{\pi(\cdot)}(1^n) = 1] \le \Pr[\mathsf{Rep}] + \Pr[b' = b \mid \overline{\mathsf{Rep}}] \le \frac{q(n)}{2^n} + \frac12.$$

**Conclusion.** By PRP security,

$$\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] = \Pr[\mathcal{D}^{F_k}(1^n) = 1] \le \Pr[\mathcal{D}^{\pi}(1^n) = 1] + \varepsilon(n) \le \frac12 + \frac{q(n)}{2^n} + \varepsilon(n).$$

$q(n)/2^n + \varepsilon(n)$ is negligible, so $\Pi$ is CPA-secure. $\blacksquare$`,
          rubric: [
            { points: 2, text: R`Distinguisher $\mathcal{D}$ fully specified: simulates oracle with fresh $r$, embeds challenge $\mathcal{O}(m_b\|r^*)$, outputs 1 iff $\mathcal{A}$ wins; p.p.t.` },
            { points: 1, text: R`Pseudorandom world: perfect simulation, equals $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}=1]$` },
            { points: 2, text: R`Random world: bad event (repeated $r^*$) with probability at most $q(n)/2^n$; otherwise view independent of $b$, success $\tfrac12$` },
            { points: 1, text: R`Inequality chain to $\tfrac12 + q(n)/2^n + \varepsilon(n)$ and negligibility argued` }
          ] }
      ] },

    { id: "es-s5-q2", type: "problem", lecture: 7, topic: "modes", origin: "exercise",
      source: "Exercise 5, Q2", difficulty: 2,
      title: "Error propagation in ECB, CTR and CBC",
      mock: true,
      statement: R`A message $m = m_1 \| m_2 \| m_3$ of three $n$-bit blocks is encrypted with a mode of operation using a block cipher $F$, giving $c_0 \| c_1 \| c_2 \| c_3$. A transmission error flips one random bit of $c_2$. The mode has **error propagation** if then more than one plaintext block (not only the one corresponding to $c_2$) is decrypted incorrectly.

The modes:

- ECB: $c_i := F_k(m_i)$, $m_i := F_k^{-1}(c_i)$ (no $c_0$; ciphertext $c_1 \| c_2 \| c_3$).
- CTR: $c_0 := ctr$ uniform; $c_i := F_k(ctr + i) \oplus m_i$; $m_i := F_k(c_0 + i) \oplus c_i$.
- CBC: $c_0$ uniform (IV); $c_i := F_k(m_i \oplus c_{i-1})$; $m_i := F_k^{-1}(c_i) \oplus c_{i-1}$.

Which modes have error propagation? Justify.`,
      parts: [
        { label: "a", points: 1,
          prompt: R`ECB.`,
          hints: [R`Which ciphertext blocks are used to decrypt $m_i$?`, R`In ECB, $m_i = F_k^{-1}(c_i)$ uses $c_i$ only.`],
          solution: R`**No error propagation.** Each block is decrypted independently, $m_i = F_k^{-1}(c_i)$, so only $m_2 = F_k^{-1}(c_2)$ is affected (and it is garbled completely). $m_1, m_3$ are correct.`,
          rubric: [ { points: 1, text: R`No, with justification that $m_i$ depends only on $c_i$` } ] },
        { label: "b", points: 1,
          prompt: R`CTR.`,
          hints: [R`$c_0$ is not affected. Which blocks use $c_2$?`, R`$m_2 = F_k(c_0 + 2) \oplus c_2$: the flipped bit passes straight through the XOR.`],
          solution: R`**No error propagation.** $m_i = F_k(c_0 + i) \oplus c_i$, and $c_0$ is intact, so only $m_2$ uses $c_2$. In fact only the single corresponding bit of $m_2$ is flipped; $m_1, m_3$ are correct.`,
          rubric: [ { points: 1, text: R`No, with justification ($c_0$ intact, $m_2$ is the only block using $c_2$, exactly one bit flipped)` } ] },
        { label: "c", points: 2,
          prompt: R`CBC.`,
          hints: [
            R`Which two decryption equations contain $c_2$?`,
            R`$c_2$ appears both inside $F_k^{-1}$ (for $m_2$) and as the XOR mask (for $m_3$).`
          ],
          solution: R`**Error propagation.** $c_2$ is used twice:

- $m_2 = F_k^{-1}(c_2) \oplus c_1$: the flipped bit enters $F_k^{-1}$, so $m_2$ is garbled (essentially random).
- $m_3 = F_k^{-1}(c_3) \oplus c_2$: the same bit position of $m_3$ is flipped.

$m_1 = F_k^{-1}(c_1) \oplus c_0$ is unaffected. So two blocks ($m_2$ and $m_3$) are wrong, and the error does not spread further.`,
          rubric: [
            { points: 1, text: R`Yes; $c_2$ appears in the decryption of both $m_2$ and $m_3$` },
            { points: 1, text: R`Precise effect: $m_2$ garbled, $m_3$ has exactly the corresponding bit flipped, $m_1$ correct` }
          ] }
      ] },

    { id: "es-s5-q3", type: "problem", lecture: 7, topic: "modes", origin: "exercise",
      source: "Exercise 5, Q3", difficulty: 2,
      title: "CBC with a fixed IV is not CPA-secure",
      mock: true,
      statement: R`CBC mode with block cipher $F$: for $m = m_1 \| \dots \| m_t$ with $m_i \in \{0,1\}^n$, $\mathsf{Enc}_k(m)$ samples $c_0 \gets \{0,1\}^n$ (the IV), sets $c_i := F_k(m_i \oplus c_{i-1})$ and returns $c_0 \| c_1 \| \dots \| c_t$.

Assume CBC is implemented incorrectly so that the **same IV is used for every encryption**. CPA-security (Def. 3.21): for every p.p.t. $\mathcal{A}$, $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$ for a negligible $\varepsilon$.`,
      parts: [
        { label: "a", points: 4,
          prompt: R`Demonstrate an attack against CPA-security **without querying exactly the same message more than once** (in particular, the encryption oracle may not be queried on the challenge messages $m_0, m_1$).`,
          hints: [
            R`With a fixed IV the scheme is deterministic, but you may not simply query $m_0$. Can a **different** message reveal $\mathsf{Enc}_k(m_0)$?`,
            R`CBC is "prefix-preserving": the first ciphertext block depends only on the IV and the first message block.`,
            R`Query a two-block message $m_1' \| m_2'$, then use the one-block challenge $m_0 := m_1'$.`
          ],
          solution: R`Let $IV$ denote the fixed IV.

**Adversary $\mathcal{A}$:**

1. Choose any $m' = m_1' \| m_2' \in \{0,1\}^{2n}$ (e.g. $0^n \| 0^n$), query the oracle, receive $IV \| c_1' \| c_2'$ with $c_1' = F_k(IV \oplus m_1')$.
2. Output the one-block challenge messages $m_0 := m_1'$ and $m_1 := m_1' \oplus 1^n$ (any value $\neq m_0$). Neither equals the queried two-block message $m'$.
3. Receive $c = IV \| c_1$; output $b' := 0$ if $c_1 = c_1'$, else $b' := 1$.

**Analysis.** $c_1 = F_k(IV \oplus m_b)$.

- $b = 0$: $c_1 = F_k(IV \oplus m_1') = c_1'$, so $b' = 0$.
- $b = 1$: $IV \oplus m_1 \neq IV \oplus m_1'$ and $F_k$ is a permutation, so $c_1 \neq c_1'$ and $b' = 1$.

Thus $\Pr[\mathsf{PrivK}^{\mathsf{cpa}}_{\mathcal{A},\Pi}(n) = 1] = 1$, and $1 \le \tfrac12 + \varepsilon(n)$ would need $\varepsilon(n) \ge \tfrac12$, impossible for negligible $\varepsilon$ and large $n$. So CBC with a fixed IV is not CPA-secure. (The attack does not even need to know $IV$.)`,
          rubric: [
            { points: 1, text: R`Idea: with fixed IV the first block is a deterministic function of $m_1$ (prefix property)` },
            { points: 2, text: R`Adversary fully specified, respecting the restriction (query a longer message sharing the first block with $m_0$)` },
            { points: 1, text: R`Both cases analysed (permutation for $b=1$), success probability 1, conclusion` }
          ] }
      ] },

    { id: "es-s5-q4", type: "problem", lecture: 7, topic: "cca", origin: "exercise",
      source: "Exercise 5, Q4", difficulty: 2,
      title: "OFB mode: decryption and a CCA attack",
      mock: true,
      statement: R`**OFB (output feedback) mode** with a keyed function $F$ on $n$-bit blocks encrypts $m = m_1 \| \dots \| m_\ell$ as follows: sample a uniform $IV \in \{0,1\}^n$ and send it as $c_0 := IV$; set $x_0 := IV$ and $x_i := F_k(x_{i-1})$ for $i = 1, \dots, \ell$ (each block-cipher output is fed into the next block-cipher call); output $c_i := x_i \oplus m_i$. The ciphertext is $c_0 \| c_1 \| \dots \| c_\ell$.

CCA-security (Def. 5.1): in $\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n)$, $\mathcal{A}$ has oracles $\mathsf{Enc}_k(\cdot)$ and $\mathsf{Dec}_k(\cdot)$, outputs $m_0, m_1$ with $|m_0| = |m_1|$, receives $c \gets \mathsf{Enc}_k(m_b)$, may continue to use both oracles but **may not query $\mathsf{Dec}_k$ on $c$ itself**, and outputs $b'$. $\Pi$ is CCA-secure if $\Pr[\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$ for every p.p.t. $\mathcal{A}$ and some negligible $\varepsilon$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Define the correct decryption algorithm $\mathsf{Dec}_k$ for OFB mode and show correctness.`,
          hints: [
            R`The keystream $x_1, x_2, \dots$ depends only on $k$ and $c_0$.`,
            R`Recompute the keystream from $c_0$ and XOR it off. Is $F_k^{-1}$ needed?`
          ],
          solution: R`$\mathsf{Dec}_k(c_0 \| c_1 \| \dots \| c_\ell)$: set $x_0 := c_0$, $x_i := F_k(x_{i-1})$ for $i = 1, \dots, \ell$, and output $m_i := c_i \oplus x_i$, i.e. $m = m_1 \| \dots \| m_\ell$.

**Correctness:** encryption and decryption compute the same keystream $x_i$ from the same $x_0 = c_0 = IV$, so $c_i \oplus x_i = m_i \oplus x_i \oplus x_i = m_i$. Only $F_k$ (not $F_k^{-1}$) is used, so $F$ need not be invertible.`,
          rubric: [
            { points: 1, text: R`Correct $\mathsf{Dec}$: regenerate $x_i$ from $c_0$ via $F_k$, then $m_i = c_i \oplus x_i$` },
            { points: 1, text: R`Correctness argued (same keystream cancels)` }
          ] },
        { label: "b", points: 3,
          prompt: R`Show that OFB mode is not CCA-secure.`,
          hints: [
            R`OFB is a stream cipher: flipping a ciphertext bit flips the same plaintext bit.`,
            R`Modify the challenge slightly and ask the decryption oracle; the modified ciphertext is a legal query.`,
            R`Query $\mathsf{Dec}_k$ on $c_0 \| (c_1 \oplus \Delta)$ for a nonzero $\Delta$, and undo $\Delta$.`
          ],
          solution: R`**Adversary $\mathcal{A}$:**

1. Output one-block messages $m_0 := 0^n$, $m_1 := 1^n$; receive $c = c_0 \| c_1$ with $c_1 = F_k(c_0) \oplus m_b$.
2. Let $\Delta := 0^{n-1}1$ and query $\mathsf{Dec}_k$ on $c' := c_0 \| (c_1 \oplus \Delta)$. This is allowed since $c' \neq c$.
3. Receive $m'$; output $b' := 0$ if $m' \oplus \Delta = 0^n$, else $b' := 1$.

**Analysis.** By the decryption algorithm, $x_1 = F_k(c_0)$ for both $c$ and $c'$, so

$$m' = (c_1 \oplus \Delta) \oplus F_k(c_0) = m_b \oplus F_k(c_0) \oplus \Delta \oplus F_k(c_0) = m_b \oplus \Delta.$$

Hence $m' \oplus \Delta = m_b$, and $\mathcal{A}$ learns $m_b$ exactly; since $m_0 \neq m_1$, it always outputs $b' = b$. So $\Pr[\mathsf{PrivK}^{\mathsf{cca}}_{\mathcal{A},\Pi}(n) = 1] = 1$, which exceeds $\tfrac12 + \varepsilon(n)$ for every negligible $\varepsilon$ and large $n$. OFB is malleable and therefore not CCA-secure.`,
          rubric: [
            { points: 1, text: R`Challenge messages chosen and the modified ciphertext $c' \neq c$ (bit flip in $c_1$) queried to $\mathsf{Dec}_k$` },
            { points: 1, text: R`Computation $\mathsf{Dec}_k(c') = m_b \oplus \Delta$` },
            { points: 1, text: R`Decision rule, success probability 1, conclusion` }
          ] }
      ] },

    // ---- T/F items for sheet 5 ----
    { id: "es-tf-s5-q1", type: "tf", lecture: 6, topic: "cpa-prf", origin: "exercise",
      source: "Exercise 5, Q1", difficulty: 2,
      statement: R`If $F$ is a PRP on $2n$-bit blocks, then $\mathsf{Enc}_k(m) := F_k(m \| r)$ with a fresh uniform $r \in \{0,1\}^n$ is a CPA-secure encryption scheme for $n$-bit messages.`,
      answer: true,
      explanation: R`Replace $F_k$ by a random permutation (PRP security). Unless the challenge's $r$ repeats in some oracle query (probability at most $q(n)/2^n$), the challenge is a fresh random-permutation output independent of $b$.` },
    { id: "es-tf-s5-q2-c", type: "tf", lecture: 7, topic: "modes", origin: "exercise",
      source: "Exercise 5, Q2c", difficulty: 2,
      statement: R`In CBC mode, flipping one bit of ciphertext block $c_2$ affects the decryption of exactly the blocks $m_2$ and $m_3$.`,
      answer: true,
      explanation: R`$m_2 = F_k^{-1}(c_2) \oplus c_1$ is garbled and $m_3 = F_k^{-1}(c_3) \oplus c_2$ gets the same bit flipped; no other block uses $c_2$.` },
    { id: "es-tf-s5-q2-b", type: "tf", lecture: 7, topic: "modes", origin: "exercise",
      source: "Exercise 5, Q2b", difficulty: 2,
      statement: R`In CTR mode, flipping one bit of ciphertext block $c_2$ (with $c_0$ intact) flips exactly one bit of the decrypted message.`,
      answer: true,
      explanation: R`$m_2 = F_k(c_0 + 2) \oplus c_2$, so the flip passes straight through to the same bit of $m_2$; no other block depends on $c_2$.` },
    { id: "es-tf-s5-q3", type: "tf", lecture: 7, topic: "modes", origin: "exercise",
      source: "Exercise 5, Q3", difficulty: 2,
      statement: R`CBC mode in which the same IV is used for every encryption is still CPA-secure, provided that IV is kept secret.`,
      answer: false,
      explanation: R`With a fixed IV, CBC is deterministic. Even without querying a challenge message: query $m_1' \| m_2'$ and use the one-block challenge $m_0 = m_1'$; the challenge's first block equals $c_1'$ iff $b = 0$. Secrecy of the IV is irrelevant.` },
    { id: "es-tf-s5-q4-a", type: "tf", lecture: 7, topic: "modes", origin: "exercise",
      source: "Exercise 5, Q4a", difficulty: 1,
      statement: R`Decryption in OFB mode requires computing $F_k^{-1}$.`,
      answer: false,
      explanation: R`Decryption regenerates the keystream $x_i = F_k(x_{i-1})$ from $x_0 = c_0$ and computes $m_i = c_i \oplus x_i$; only $F_k$ is evaluated, so a PRF suffices.` },
    { id: "es-tf-s5-q4-b", type: "tf", lecture: 7, topic: "cca", origin: "exercise",
      source: "Exercise 5, Q4b", difficulty: 2,
      statement: R`OFB mode instantiated with a pseudorandom function is CCA-secure.`,
      answer: false,
      explanation: R`OFB is malleable: given the challenge $c_0 \| c_1$, query $\mathsf{Dec}_k$ on $c_0 \| (c_1 \oplus \Delta)$, which is a different ciphertext, and obtain $m_b \oplus \Delta$. This reveals $b$ with probability 1.` }
  );
})();
