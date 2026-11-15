(function () {
  const R = String.raw;
  const add = (...items) => (window.CRYPTO_BANK = window.CRYPTO_BANK || []).push(...items);

  // ===================== Exercise sheet 2 =====================

  add(
    { id: "es-s2-q1", type: "problem", lecture: 2, topic: "perfect-secrecy", origin: "exercise",
      source: "Exercise 2, Q1", difficulty: 1,
      title: "Bayes' theorem",
      mock: false,
      statement: R`Let $X$ and $Y$ be random variables.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Prove Bayes' theorem: if $\Pr[X = x] > 0$ and $\Pr[Y = y] > 0$, then

$$\Pr[X = x \mid Y = y] = \Pr[Y = y \mid X = x] \cdot \frac{\Pr[X = x]}{\Pr[Y = y]}.$$`,
          hints: [
            R`Start from the definition of conditional probability.`,
            R`Write both $\Pr[X=x \mid Y=y]$ and $\Pr[Y=y \mid X=x]$ in terms of the joint probability $\Pr[X=x \wedge Y=y]$.`
          ],
          solution: R`By the definition of conditional probability (both conditioning events have positive probability):

$$\Pr[X=x \mid Y=y] = \frac{\Pr[X=x \wedge Y=y]}{\Pr[Y=y]}, \qquad \Pr[Y=y \mid X=x] = \frac{\Pr[X=x \wedge Y=y]}{\Pr[X=x]}.$$

The second equation gives $\Pr[X=x \wedge Y=y] = \Pr[Y=y \mid X=x]\cdot \Pr[X=x]$. Substituting this into the first equation:

$$\Pr[X=x \mid Y=y] = \frac{\Pr[Y=y \mid X=x]\cdot\Pr[X=x]}{\Pr[Y=y]} = \Pr[Y=y \mid X=x]\cdot\frac{\Pr[X=x]}{\Pr[Y=y]}. \qquad \blacksquare$$`,
          rubric: [
            { points: 1, text: R`Both conditional probabilities written via the joint probability (using positivity of the conditioning events)` },
            { points: 1, text: R`Correct substitution yielding the claim` }
          ] }
      ] },

    { id: "es-s2-q2", type: "problem", lecture: 2, topic: "perfect-secrecy", origin: "exercise",
      source: "Exercise 2, Q2", difficulty: 2,
      title: "Perfect secrecy of three small schemes",
      mock: true,
      statement: R`Recall (Def. 2.3): an encryption scheme $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ with message space $\mathcal{M}$ is **perfectly secret** if for every probability distribution over $\mathcal{M}$, every message $m \in \mathcal{M}$ and every ciphertext $c \in \mathcal{C}$ with $\Pr[C = c] > 0$:

$$\Pr[M = m \mid C = c] = \Pr[M = m].$$

(Equivalently: for all $m, m' \in \mathcal{M}$ and all $c \in \mathcal{C}$, $\Pr[\mathsf{Enc}_K(m) = c] = \Pr[\mathsf{Enc}_K(m') = c]$, where $K \gets \mathsf{Gen}$.) The key $K$ is chosen independently of the message $M$.

To refute perfect secrecy it suffices to exhibit one distribution on $\mathcal{M}$ (e.g. the uniform one) for which the definition fails.

The one-time pad over $\{0,1\}^\ell$: $\mathsf{Gen}$ outputs a uniform $k \in \{0,1\}^\ell$, $\mathsf{Enc}_k(m) := k \oplus m$, $\mathsf{Dec}_k(c) := k \oplus c$.

For each of the following schemes, prove or refute that it is perfectly secret.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`The one-time pad without the all-zero key, i.e. $\mathsf{Gen}$ chooses $k$ uniformly from $\{0,1\}^\ell \setminus \{0^\ell\}$.`,
          hints: [
            R`Which key would be needed to encrypt $0^\ell$ to $0^\ell$?`,
            R`Look at the ciphertext $c = 0^\ell$: which message can it never come from?`,
            R`Under the uniform message distribution, compare $\Pr[M = 0^\ell \mid C = 0^\ell]$ with $\Pr[M = 0^\ell]$.`
          ],
          solution: R`**Not perfectly secret.**

Take $M$ uniform on $\{0,1\}^\ell$, so $\Pr[M = 0^\ell] = 2^{-\ell}$. Consider $c = 0^\ell$. We have $\Pr[C = 0^\ell] > 0$: e.g. $m = 1^\ell$, $k = 1^\ell$ (an allowed key) gives $c = 0^\ell$, so $\Pr[C=0^\ell] \ge \Pr[M=1^\ell]\Pr[K=1^\ell] > 0$.

But $\mathsf{Enc}_k(0^\ell) = k \oplus 0^\ell = k \neq 0^\ell$ for every allowed key $k$, so the message $0^\ell$ is never encrypted to $0^\ell$. Hence

$$\Pr[M = 0^\ell \mid C = 0^\ell] = 0 \neq 2^{-\ell} = \Pr[M = 0^\ell],$$

violating Def. 2.3.`,
          rubric: [
            { points: 1, text: R`Concrete distribution and concrete $m, c$ chosen (e.g. uniform $M$, $m = c = 0^\ell$), with $\Pr[C=c] > 0$` },
            { points: 1, text: R`Shows $\Pr[M=0^\ell \mid C=0^\ell] = 0 \neq 2^{-\ell}$ because the zero key is excluded` }
          ] },
        { label: "b", points: 2,
          prompt: R`$\mathcal{M} = \mathcal{K} = \{1, -1\}$, $\mathsf{Gen}$ chooses a key uniformly, $\mathsf{Enc}_k(m) := m \cdot k$, $\mathsf{Dec}_k(c) := c \cdot k$.`,
          hints: [
            R`For fixed $m$ and $c$, how many keys satisfy $m \cdot k = c$?`,
            R`Show $\Pr[C = c \mid M = m] = \tfrac12$ for all $m, c \in \{1,-1\}$, then use Bayes.`
          ],
          solution: R`**Perfectly secret.** (Correctness: $c \cdot k = m k^2 = m$ since $k^2 = 1$.)

Fix any distribution on $\mathcal{M}$ and $m, c \in \{1,-1\}$ with $\Pr[M=m] > 0$. Since $m^2 = 1$, $m \cdot k = c \iff k = c \cdot m$, so exactly one key maps $m$ to $c$. As $K$ is uniform and independent of $M$:

$$\Pr[C = c \mid M = m] = \Pr[K = c\cdot m] = \tfrac12.$$

By the law of total probability, $\Pr[C = c] = \sum_{m'} \Pr[C=c \mid M=m']\Pr[M=m'] = \tfrac12$ (sum over $m'$ with $\Pr[M=m']>0$). By Bayes:

$$\Pr[M = m \mid C = c] = \frac{\Pr[C = c \mid M = m]\,\Pr[M = m]}{\Pr[C = c]} = \frac{\tfrac12 \Pr[M=m]}{\tfrac12} = \Pr[M = m].$$

If $\Pr[M=m] = 0$, both sides are $0$. Hence the scheme is perfectly secret. (It is just the one-time pad over the group $(\{1,-1\}, \cdot)$.)`,
          rubric: [
            { points: 1, text: R`$\Pr[C=c \mid M=m] = \Pr[K = c m] = \tfrac12$ for all $m, c$ (unique key, independence of $K$ and $M$)` },
            { points: 1, text: R`Concludes $\Pr[M=m \mid C=c] = \Pr[M=m]$ via $\Pr[C=c]=\tfrac12$ and Bayes (or via the equivalent condition)` }
          ] },
        { label: "c", points: 2,
          prompt: R`$\mathcal{M} = \mathcal{K} = \{1, 2, 4, 8, 16\}$, $\mathsf{Gen}$ chooses a key uniformly, $\mathsf{Enc}_k(m) := m \cdot k$ (integer multiplication), $\mathsf{Dec}_k(c) := c \cdot k^{-1}$.`,
          hints: [
            R`Products of two elements of the set are powers of two between $1$ and $256$. Are they all equally "reachable"?`,
            R`Which pairs $(m, k)$ give $c = 256$ (or $c = 1$)?`,
            R`Under uniform $M$, compute $\Pr[M = 16 \mid C = 256]$.`
          ],
          solution: R`**Not perfectly secret.**

Take $M$ uniform, so $\Pr[M = 16] = \tfrac15$. The ciphertext $c = 256$ arises only from $m = k = 16$ (since $256 = 2^8$ and all elements are at most $2^4$). So $\Pr[C = 256] = \Pr[M=16]\Pr[K=16] = \tfrac1{25} > 0$ and

$$\Pr[M = 16 \mid C = 256] = \frac{\Pr[M=16 \wedge K=16]}{\Pr[C=256]} = 1 \neq \tfrac15 = \Pr[M = 16].$$

(Equivalently: $\Pr[\mathsf{Enc}_K(16) = 256] = \tfrac15$ but $\Pr[\mathsf{Enc}_K(1) = 256] = 0$. Another valid witness: $c = 128$ comes only from $(m,k) \in \{(8,16),(16,8)\}$, giving $\Pr[M = 16 \mid C = 128] = \tfrac12 \neq \tfrac15$.)`,
          rubric: [
            { points: 1, text: R`Concrete distribution and ciphertext with $\Pr[C=c] > 0$ (e.g. uniform $M$, $c = 256$)` },
            { points: 1, text: R`Correct computation showing $\Pr[M=m \mid C=c] \neq \Pr[M=m]$` }
          ] }
      ] },

    { id: "es-s2-q3", type: "problem", lecture: 2, topic: "perfect-secrecy", origin: "exercise",
      source: "Exercise 2, Q3", difficulty: 2,
      title: "Perfect secrecy implies equal ciphertext distributions",
      mock: true,
      statement: R`Recall (Def. 2.3): $\Pi$ with message space $\mathcal{M}$ and ciphertext space $\mathcal{C}$ is perfectly secret if for every probability distribution over $\mathcal{M}$, every $m \in \mathcal{M}$ and every $c \in \mathcal{C}$ with $\Pr[C=c] > 0$: $\Pr[M = m \mid C = c] = \Pr[M = m]$.`,
      parts: [
        { label: "a", points: 3,
          prompt: R`Prove: for every perfectly secret scheme, every probability distribution on $\mathcal{M}$, every $m, m' \in \mathcal{M}$ with $\Pr[M = m] > 0$ and $\Pr[M = m'] > 0$, and every $c \in \mathcal{C}$,

$$\Pr[C = c \mid M = m] = \Pr[C = c \mid M = m'].$$`,
          hints: [
            R`Show the stronger statement $\Pr[C = c \mid M = m] = \Pr[C = c]$.`,
            R`Apply Bayes' theorem to $\Pr[M = m \mid C = c]$ and use perfect secrecy.`,
            R`Do not forget the case $\Pr[C = c] = 0$, where the definition says nothing.`
          ],
          solution: R`Fix a distribution and $m, m', c$ as in the claim. We show $\Pr[C=c \mid M=m] = \Pr[C=c]$; the same argument for $m'$ then gives the claim.

**Case $\Pr[C = c] > 0$.** By Bayes and perfect secrecy:

$$\Pr[C=c \mid M=m] = \frac{\Pr[M=m \mid C=c]\,\Pr[C=c]}{\Pr[M=m]} = \frac{\Pr[M=m]\,\Pr[C=c]}{\Pr[M=m]} = \Pr[C=c].$$

**Case $\Pr[C = c] = 0$.** Then $\Pr[C=c \wedge M=m] \le \Pr[C=c] = 0$, so

$$\Pr[C=c \mid M=m] = \frac{\Pr[C=c \wedge M=m]}{\Pr[M=m]} = 0 = \Pr[C=c].$$

In both cases $\Pr[C=c \mid M=m] = \Pr[C=c]$, and likewise $\Pr[C=c \mid M=m'] = \Pr[C=c]$. Hence $\Pr[C=c \mid M=m] = \Pr[C=c \mid M=m']$. $\blacksquare$`,
          rubric: [
            { points: 2, text: R`Case $\Pr[C=c]>0$: Bayes plus perfect secrecy gives $\Pr[C=c \mid M=m] = \Pr[C=c]$ (and the same for $m'$)` },
            { points: 1, text: R`Case $\Pr[C=c]=0$ handled: both conditional probabilities are $0$` }
          ] }
      ] },

    { id: "es-tf-s2-q2-a", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "exercise",
      source: "Exercise 2, Q2a", difficulty: 2,
      statement: R`The one-time pad over $\{0,1\}^\ell$ remains perfectly secret if $\mathsf{Gen}$ chooses the key uniformly from $\{0,1\}^\ell \setminus \{0^\ell\}$.`,
      answer: false,
      explanation: R`The message $0^\ell$ can then never be encrypted to $0^\ell$. Under uniform $M$: $\Pr[M = 0^\ell \mid C = 0^\ell] = 0 \neq 2^{-\ell} = \Pr[M = 0^\ell]$.` },
    { id: "es-tf-s2-q2-c", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "exercise",
      source: "Exercise 2, Q2c", difficulty: 2,
      statement: R`Let $\mathcal{M} = \mathcal{K} = \{1,2,4,8,16\}$, $K$ uniform and $\mathsf{Enc}_k(m) := m \cdot k$ (integer multiplication). This scheme is perfectly secret.`,
      answer: false,
      explanation: R`The ciphertext $256$ only arises from $m = k = 16$, so under uniform $M$ we get $\Pr[M = 16 \mid C = 256] = 1 \neq \tfrac15$. (Contrast: over $\{1,-1\}$ with multiplication the scheme is a one-time pad and perfectly secret.)` },
    { id: "es-tf-s2-q3", type: "tf", lecture: 2, topic: "perfect-secrecy", origin: "exercise",
      source: "Exercise 2, Q3", difficulty: 2,
      statement: R`If $\Pi$ is perfectly secret, then for all $m, m' \in \mathcal{M}$ and every $c \in \mathcal{C}$: $\Pr[\mathsf{Enc}_K(m) = c] = \Pr[\mathsf{Enc}_K(m') = c]$, where the probability is over $K \gets \mathsf{Gen}$ and the randomness of $\mathsf{Enc}$.`,
      answer: true,
      explanation: R`Take any distribution on $\mathcal{M}$ giving positive probability to $m$ and $m'$. Since $K$ is independent of $M$, $\Pr[\mathsf{Enc}_K(m) = c] = \Pr[C=c \mid M=m]$, and perfect secrecy plus Bayes gives $\Pr[C=c \mid M=m] = \Pr[C=c] = \Pr[C=c \mid M=m']$.` }
  );

  // ===================== Exercise sheet 3 =====================

  add(
    { id: "es-s3-q1", type: "problem", lecture: 2, topic: "perfect-secrecy", origin: "exercise",
      source: "Exercise 3, Q1", difficulty: 2,
      title: "Is DES perfectly secret?",
      mock: true,
      statement: R`Consider the encryption scheme $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ based on the DES block cipher: $\mathsf{Gen}$ samples a uniform 56-bit DES key, $\mathsf{Enc}_k$ is DES under key $k$ (a permutation of $\{0,1\}^{64}$), and $\mathsf{Dec}_k$ is its inverse. So $\mathcal{K} = \{0,1\}^{56}$ and $\mathcal{M} = \mathcal{C} = \{0,1\}^{64}$.

Recall (Def. 2.3): $\Pi$ is perfectly secret if for every distribution over $\mathcal{M}$, every $m \in \mathcal{M}$ and every $c \in \mathcal{C}$ with $\Pr[C=c]>0$: $\Pr[M=m \mid C=c] = \Pr[M=m]$.`,
      parts: [
        { label: "a", points: 3,
          prompt: R`Prove or refute that $\Pi$ is perfectly secret.`,
          hints: [
            R`Compare $|\mathcal{K}|$ with $|\mathcal{M}|$ and $|\mathcal{C}|$.`,
            R`Fix one message $m'$. How many different ciphertexts can $m'$ be encrypted to?`,
            R`Pick a ciphertext $c'$ that $m'$ can never be encrypted to, and look at $\Pr[M = m' \mid C = c']$ under uniform $M$.`
          ],
          solution: R`**Not perfectly secret** (this is the argument behind Shannon's bound $|\mathcal{K}| \ge |\mathcal{M}|$).

Take $M$ uniform on $\{0,1\}^{64}$, so $\Pr[M=m] = 2^{-64}$ for all $m$. Fix any message $m'$ and let $X := \{\mathsf{Enc}_k(m') : k \in \mathcal{K}\}$. Then $|X| \le |\mathcal{K}| = 2^{56} < 2^{64} = |\mathcal{C}|$, so there is a $c' \in \mathcal{C} \setminus X$.

$\Pr[C = c'] > 0$: for any key $k$, $\mathsf{Enc}_k$ is a permutation, so $c' = \mathsf{Enc}_k(m)$ for $m := \mathsf{Dec}_k(c')$, hence $\Pr[C=c'] \ge 2^{-56}\cdot 2^{-64} > 0$.

Since no key encrypts $m'$ to $c'$:

$$\Pr[M = m' \mid C = c'] = 0 \neq 2^{-64} = \Pr[M = m'].$$

So Def. 2.3 is violated.`,
          rubric: [
            { points: 1, text: R`Counting argument: $m'$ has at most $2^{56} < 2^{64}$ possible ciphertexts, so some $c'$ is unreachable from $m'$` },
            { points: 1, text: R`Concrete distribution (uniform) and $\Pr[C=c'] > 0$ argued` },
            { points: 1, text: R`Conclusion $\Pr[M=m' \mid C=c'] = 0 \neq 2^{-64}$` }
          ] }
      ] },

    { id: "es-s3-q2", type: "problem", lecture: 3, topic: "block-ciphers", origin: "exercise",
      source: "Exercise 3, Q2", difficulty: 2,
      title: "Feistel networks: inversion and distinguishing few rounds",
      mock: true,
      statement: R`An $r$-round Feistel network on $2n$-bit inputs uses a keyed round function $f$ with round keys $k_1, \dots, k_r$, where $f_{k_i} \colon \{0,1\}^n \to \{0,1\}^n$ need not be invertible. The input is $(L_0, R_0)$ with $L_0, R_0 \in \{0,1\}^n$, and round $i = 1, \dots, r$ computes

$$L_i := R_{i-1}, \qquad R_i := L_{i-1} \oplus f_{k_i}(R_{i-1}).$$

The output is $(L_r, R_r)$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`For any number of rounds $r$ and any round function $f$, show that the entire sequence $(L_i, R_i)_{0 \le i \le r}$ can be computed given $f$, the round keys $k_1, \dots, k_r$, and an arbitrary single pair $(L_j, R_j)$, $0 \le j \le r$.`,
          hints: [
            R`Going forward from $(L_j, R_j)$ is just evaluating the network. What about going backward?`,
            R`Solve the round equations for $(L_{i-1}, R_{i-1})$ in terms of $(L_i, R_i)$. Note that $R_{i-1} = L_i$ is already known.`
          ],
          solution: R`**Forward** ($i = j+1, \dots, r$): compute $L_i := R_{i-1}$ and $R_i := L_{i-1} \oplus f_{k_i}(R_{i-1})$, which only needs $f$, $k_i$ and $(L_{i-1}, R_{i-1})$.

**Backward** ($i = j, j-1, \dots, 1$): from $L_i = R_{i-1}$ we get $R_{i-1} = L_i$. XORing $R_i = L_{i-1} \oplus f_{k_i}(R_{i-1})$ with $f_{k_i}(R_{i-1})$ gives

$$R_{i-1} = L_i, \qquad L_{i-1} = R_i \oplus f_{k_i}(R_{i-1}) = R_i \oplus f_{k_i}(L_i).$$

This only evaluates $f_{k_i}$ in the forward direction, so $f$ need not be invertible.

Starting from $(L_j, R_j)$, the forward rule yields $(L_{j+1}, R_{j+1}), \dots, (L_r, R_r)$ and the backward rule yields $(L_{j-1}, R_{j-1}), \dots, (L_0, R_0)$. (The cases $j = 0$ and $j = r$ use only one direction.)`,
          rubric: [
            { points: 1, text: R`Correct backward step $R_{i-1} = L_i$, $L_{i-1} = R_i \oplus f_{k_i}(L_i)$, derived from the round equations` },
            { points: 1, text: R`Combines forward and backward steps from an arbitrary index $j$ to obtain the whole sequence` }
          ] },
        { label: "b", points: 2,
          prompt: R`An attacker knows the input $(L_0, R_0) \in \{0,1\}^{2n}$ of a **1-round** Feistel network and is given either the correct output $(L_1, R_1)$ or a uniformly random string $y \gets \{0,1\}^{2n}$. Show that, even if the round function is chosen uniformly at random, the attacker can efficiently distinguish the two cases.`,
          hints: [
            R`One half of the output does not depend on $f$ at all.`,
            R`$L_1 = R_0$. How likely is it that the first half of a uniform string equals $R_0$?`
          ],
          solution: R`Distinguisher $\mathcal{D}$: on input $y = (y_L, y_R)$ with $y_L, y_R \in \{0,1\}^n$, output $1$ iff $y_L = R_0$.

- Real output: $y_L = L_1 = R_0$ for every round function, so $\Pr[\mathcal{D} = 1] = 1$.
- Uniform $y$: $y_L$ is uniform in $\{0,1\}^n$, so $\Pr[\mathcal{D} = 1] = 2^{-n}$.

The distinguishing advantage is $1 - 2^{-n}$, which is not negligible. $\mathcal{D}$ makes one comparison of $n$ bits, so it is efficient, and it never needs to know $f$.`,
          rubric: [
            { points: 1, text: R`Distinguisher compares the left half of the output with $R_0$` },
            { points: 1, text: R`Probabilities $1$ (real) and $2^{-n}$ (random) computed; advantage $1 - 2^{-n}$` }
          ] },
        { label: "c", points: 2,
          prompt: R`Now the attacker may **choose** two inputs $(L_0, R_0) \neq (L_0', R_0')$ of a **2-round** Feistel network and is given either the correct outputs $(L_2, R_2), (L_2', R_2')$ or two independent uniform strings $y, y' \gets \{0,1\}^{2n}$. Show how to distinguish the two cases (again even for a uniformly random round function).`,
          hints: [
            R`Write $L_2$ in terms of the input. Which part of it depends on $f$?`,
            R`$L_2 = R_1 = L_0 \oplus f_{k_1}(R_0)$. Choose the inputs so that the $f$-part cancels in $L_2 \oplus L_2'$.`
          ],
          solution: R`Choose $R_0 = R_0'$ and $L_0 \neq L_0'$, e.g. $(L_0, R_0) = (0^n, 0^n)$ and $(L_0', R_0') = (1^n, 0^n)$. For 2 rounds,

$$L_2 = R_1 = L_0 \oplus f_{k_1}(R_0), \qquad L_2' = R_1' = L_0' \oplus f_{k_1}(R_0') = L_0' \oplus f_{k_1}(R_0),$$

so $L_2 \oplus L_2' = L_0 \oplus L_0'$, independently of $f$.

Distinguisher $\mathcal{D}$: given $y = (y_L, y_R)$ and $y' = (y_L', y_R')$, output $1$ iff $y_L \oplus y_L' = L_0 \oplus L_0'$.

- Real outputs: always true, $\Pr[\mathcal{D} = 1] = 1$.
- Uniform $y, y'$: $y_L \oplus y_L'$ is uniform in $\{0,1\}^n$ (for every fixed $y_L$, $y_L'$ is uniform), so $\Pr[\mathcal{D} = 1] = 2^{-n}$.

Advantage $1 - 2^{-n}$, not negligible; $\mathcal{D}$ is clearly efficient.`,
          rubric: [
            { points: 1, text: R`Inputs chosen with $R_0 = R_0'$, $L_0 \neq L_0'$, and the relation $L_2 \oplus L_2' = L_0 \oplus L_0'$ derived` },
            { points: 1, text: R`Distinguisher tests this relation; probabilities $1$ vs. $2^{-n}$ computed` }
          ] }
      ] },

    { id: "es-s3-q3", type: "problem", lecture: 3, topic: "block-ciphers", origin: "exercise",
      source: "Exercise 3, Q3", difficulty: 2,
      title: "SPN with reordered steps",
      mock: true,
      statement: R`In a standard substitution-permutation network (SPN) on $n$-bit blocks, round $i$ consists of a key-addition step $K_i$ ($x \mapsto x \oplus k_i$ with round key $k_i$), a substitution step $S_i$ (a public bijection, applying S-boxes to small blocks), and a permutation step $P_i$ (a public bijection mixing the bits), in that order. Consider a modified design with $r$ rounds where first all key-addition steps $K_1, \dots, K_r$ are applied, then all substitution steps $S_1, \dots, S_r$, and finally all permutation steps $P_1, \dots, P_r$.`,
      parts: [
        { label: "a", points: 3,
          prompt: R`Show that an attacker who knows a single plaintext-ciphertext pair can decrypt any ciphertext, regardless of the number of rounds.`,
          hints: [
            R`What is the combined effect of all key-addition steps when nothing happens in between?`,
            R`$m \oplus k_1 \oplus \dots \oplus k_r = m \oplus k^*$ for a single unknown $k^* \in \{0,1\}^n$. The remaining steps are public bijections.`,
            R`Write the cipher as $c = P(S(m \oplus k^*))$ with public invertible $P, S$, and solve for $k^*$.`
          ],
          solution: R`Let $k^* := k_1 \oplus \dots \oplus k_r$, $S := S_r \circ \dots \circ S_1$ and $P := P_r \circ \dots \circ P_1$. Applying all key additions in a row gives $m \oplus k_1 \oplus \dots \oplus k_r = m \oplus k^*$, so the whole cipher is

$$c = P\bigl(S(m \oplus k^*)\bigr).$$

$S$ and $P$ are compositions of public bijections, hence public bijections with efficiently computable inverses $S^{-1} = S_1^{-1} \circ \dots \circ S_r^{-1}$ and $P^{-1} = P_1^{-1} \circ \dots \circ P_r^{-1}$. The only secret is $k^* \in \{0,1\}^n$.

Given one known pair $(m, c)$ the attacker computes

$$k^* = S^{-1}\bigl(P^{-1}(c)\bigr) \oplus m,$$

and then decrypts any ciphertext $c'$ as $m' = S^{-1}\bigl(P^{-1}(c')\bigr) \oplus k^*$. This works for every number of rounds $r$. (The attacker does not learn the individual $k_i$, but does not need them.)`,
          rubric: [
            { points: 1, text: R`Collapses all key additions into one effective key $k^* = k_1 \oplus \dots \oplus k_r$` },
            { points: 1, text: R`Observes that the substitutions and permutations compose to public, invertible maps, so $c = P(S(m \oplus k^*))$` },
            { points: 1, text: R`Recovers $k^*$ from one pair and gives the decryption formula for any $c'$` }
          ] }
      ] },

    { id: "es-s3-q4", type: "problem", lecture: 3, topic: "block-ciphers", origin: "exercise",
      source: "Exercise 3, Q4", difficulty: 2,
      title: "Two-key SPN: key recovery with 2^n trials",
      mock: true,
      statement: R`Consider the cipher

$$E_{k_1, k_2}(x) := P\bigl(S(x \oplus k_1)\bigr) \oplus k_2,$$

where $k_1, k_2 \in \{0,1\}^n$ and $S$, $P$ are public and invertible.`,
      parts: [
        { label: "a", points: 3,
          prompt: R`Given a list of known plaintext-ciphertext pairs encrypted under the secret key $(k_1, k_2)$, show how to recover the key by testing at most $2^n$ candidate keys (instead of all $2^{2n}$).`,
          hints: [
            R`If you knew $k_1$, could you compute $k_2$ from a single pair?`,
            R`From $(m, c)$: $k_2 = P(S(m \oplus k_1)) \oplus c$. So guess only $k_1$.`,
            R`A candidate derived from $(m, c)$ always fits $(m, c)$; check it against the other pairs.`
          ],
          solution: R`Let $(m, c)$ be one known pair. Since $c = P(S(m \oplus k_1)) \oplus k_2$, we have

$$k_2 = P\bigl(S(m \oplus k_1)\bigr) \oplus c,$$

so $k_2$ is determined by $k_1$ and one pair.

**Attack.** For each $\hat k_1 \in \{0,1\}^n$:

1. compute $\hat k_2 := P(S(m \oplus \hat k_1)) \oplus c$;
2. check whether $E_{\hat k_1, \hat k_2}(m') = c'$ for the other known pairs $(m', c')$; output $(\hat k_1, \hat k_2)$ if all checks pass.

**Correctness.** For $\hat k_1 = k_1$ we get exactly $\hat k_2 = k_2$, which passes all checks, so the true key is always among the survivors. The candidate built from $(m,c)$ fits $(m,c)$ by construction, so only the other pairs filter out wrong candidates; with a few pairs a wrong candidate survives only with small probability (heuristically about $2^{-n}$ per extra pair).

**Cost.** Exactly one candidate $(\hat k_1, \hat k_2)$ per value of $\hat k_1$, i.e. at most $2^n$ candidate keys instead of $2^{2n}$.`,
          rubric: [
            { points: 1, text: R`Observes that $k_2 = P(S(m \oplus k_1)) \oplus c$ is determined by $k_1$ and one pair` },
            { points: 1, text: R`Enumerates only $\hat k_1$ ($2^n$ candidates) and derives $\hat k_2$` },
            { points: 1, text: R`Verifies candidates on further pairs and argues the correct key survives` }
          ] }
      ] },

    { id: "es-s3-q5", type: "problem", lecture: 4, topic: "stream-ciphers", origin: "exercise",
      source: "Exercise 3, Q5", difficulty: 2,
      title: "Period of a 4-bit LFSR",
      mock: true,
      statement: R`The **period** of a linear-feedback shift register (LFSR) for an initial state $s_0$ is the number of distinct states it cycles through before $s_0$ repeats. Consider the 4-bit LFSR with state $(x_3, x_2, x_1, x_0)$ and update rule

$$(x_3', x_2', x_1', x_0') := (x_0 \oplus x_1 \oplus x_3,\; x_3,\; x_2,\; x_1).$$`,
      parts: [
        { label: "a", points: 3,
          prompt: R`Find the maximum period of this LFSR, i.e. the longest period over all initial states. Justify your answer.`,
          hints: [
            R`Try a concrete state such as $0001$ and iterate.`,
            R`To show no state has a longer period, apply the update symbolically to a general state $(x_3, x_2, x_1, x_0)$ several times.`,
            R`After 6 steps the general state returns to itself.`
          ],
          solution: R`**Upper bound.** Apply the update symbolically (writing $a \oplus b$ for XOR). States after $t$ steps:

- $t=1$: $(x_0 \oplus x_1 \oplus x_3,\ x_3,\ x_2,\ x_1)$
- $t=2$: $(x_0 \oplus x_2 \oplus x_3,\ x_0 \oplus x_1 \oplus x_3,\ x_3,\ x_2)$
- $t=3$: $(x_0,\ x_0 \oplus x_2 \oplus x_3,\ x_0 \oplus x_1 \oplus x_3,\ x_3)$
- $t=4$: $(x_1,\ x_0,\ x_0 \oplus x_2 \oplus x_3,\ x_0 \oplus x_1 \oplus x_3)$
- $t=5$: $(x_2,\ x_1,\ x_0,\ x_0 \oplus x_2 \oplus x_3)$
- $t=6$: $(x_3,\ x_2,\ x_1,\ x_0)$

(E.g. at $t=3$ the new bit is $x_2 \oplus x_3 \oplus (x_0 \oplus x_2 \oplus x_3) = x_0$.) So every state returns after 6 steps and every period divides 6; in particular no period exceeds 6.

**Lower bound.** Starting from $0001$ (written $x_3x_2x_1x_0$):

$$0001 \to 1000 \to 1100 \to 1110 \to 0111 \to 0011 \to 0001,$$

six distinct states. Hence the **maximum period is 6**.

(For completeness, the 16 states split into cycles of lengths $1$ ($0000$), $1$ ($1111$), $2$ ($0101, 1010$), $3$ ($0010, 1001, 0100$), $3$ ($0110, 1011, 1101$) and $6$ (above). A maximal-length 4-bit LFSR would have period $15$; this one does not.)`,
          rubric: [
            { points: 1, text: R`Exhibits a state with period 6 (correct iteration)` },
            { points: 2, text: R`Shows no period exceeds 6 (symbolic iteration returning after 6 steps, or complete cycle decomposition)` }
          ] }
      ] },

    { id: "es-s3-q6", type: "problem", lecture: 4, topic: "computational", origin: "exercise",
      source: "Exercise 3, Q6", difficulty: 2,
      title: "Which functions are negligible?",
      mock: true,
      statement: R`Recall (Def. 3.4): a function $f \colon \mathbb{N} \to \mathbb{R}_{\ge 0}$ is **negligible** if for every positive polynomial $p$ there exists $N$ such that $f(n) < \frac{1}{p(n)}$ for all $n > N$.

For each function, state whether it is negligible and justify your answer.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`$f(n) = \dfrac{1}{n!}$.`,
          hints: [
            R`Compare $n!$ with an exponential function.`,
            R`$n! \ge 2^n$ for all $n \ge 4$, and $2^{-n}$ is negligible.`
          ],
          solution: R`**Negligible.** By induction $n! \ge 2^n$ for all $n \ge 4$ ($4! = 24 \ge 16$, and $(n+1)! = (n+1)\,n! \ge 2 \cdot 2^n$). Hence $0 \le f(n) \le 2^{-n}$ for $n \ge 4$.

$2^{-n}$ is negligible: for a polynomial $p$, $p(n) < 2^n$ for all large $n$, i.e. $2^{-n} < 1/p(n)$. So for every positive polynomial $p$ there is $N$ with $f(n) \le 2^{-n} < 1/p(n)$ for $n > N$, and $f$ is negligible.`,
          rubric: [
            { points: 1, text: R`Correct answer with a valid bound such as $n! \ge 2^n$ (or $n! > n^c$ eventually, for every $c$)` },
            { points: 1, text: R`Concludes via Def. 3.4 (e.g. a function dominated by a negligible function is negligible)` }
          ] },
        { label: "b", points: 2,
          prompt: R`$f(n) = 2^{-128} / n$.`,
          hints: [
            R`$2^{128}$ is a huge but **constant** factor.`,
            R`Is $p(n) := 2^{128} \cdot n$ a polynomial? Compare $f(n)$ with $1/p(n)$.`
          ],
          solution: R`**Not negligible.** Take the positive polynomial $p(n) := 2^{128} \cdot n$ (a constant times $n$). Then $f(n) = \frac{1}{p(n)}$ for all $n$, so $f(n) < \frac{1}{p(n)}$ holds for no $n$ at all, and Def. 3.4 fails for this $p$.

(Equivalently with $p(n) = n^2$: $f(n) \ge 1/n^2$ for all $n \ge 2^{128}$.) Asymptotically, a constant factor does not matter: $f(n)$ behaves like $1/n$.`,
          rubric: [
            { points: 1, text: R`Correct answer: not negligible` },
            { points: 1, text: R`Explicit polynomial $p$ with $f(n) \ge 1/p(n)$ for infinitely many (here all large) $n$` }
          ] },
        { label: "c", points: 2,
          prompt: R`$f(n) = f_1(n) / f_2(n)$, where $f_1, f_2$ are negligible functions (with $f_2(n) > 0$ for all $n$).`,
          hints: [
            R`The answer is not the same for all choices of $f_1, f_2$.`,
            R`Try $f_1 = f_2$, and then $f_1 = 2^{-2n}$, $f_2 = 2^{-n}$.`
          ],
          solution: R`**Not necessarily negligible; it depends on $f_1, f_2$.**

- $f_1(n) = f_2(n) = 2^{-n}$ (both negligible): $f(n) = 1$, which is not negligible (take $p(n) = 1$: $1 < 1$ never holds).
- $f_1(n) = 2^{-2n}$, $f_2(n) = 2^{-n}$ (both negligible): $f(n) = 2^{-n}$, which is negligible.

So the quotient of two negligible functions can be negligible or not; in general it is **not** guaranteed to be negligible.`,
          rubric: [
            { points: 1, text: R`Counterexample where $f_1/f_2$ is not negligible (e.g. $f_1 = f_2$)` },
            { points: 1, text: R`States that the answer depends on the choice (example where it is negligible), i.e. "not necessarily"` }
          ] }
      ] },

    { id: "es-s3-q7", type: "problem", lecture: 4, topic: "perfect-secrecy", origin: "exercise",
      source: "Exercise 3, Q7", difficulty: 3,
      title: "Perfect indistinguishability implies perfect secrecy",
      mock: true,
      statement: R`The experiment $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}$: $\mathcal{A}$ outputs $m_0, m_1 \in \mathcal{M}$; the challenger samples $k \gets \mathsf{Gen}$ and a uniform $b \in \{0,1\}$ and gives $c \gets \mathsf{Enc}_k(m_b)$ to $\mathcal{A}$; $\mathcal{A}$ outputs $b'$; the experiment outputs $1$ iff $b' = b$.

$\Pi$ is **perfectly indistinguishable** if for every adversary $\mathcal{A}$ (no running-time bound): $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi} = 1] = \tfrac12$.

You may use: if $\Pi$ is not perfectly secret, then there are $m_0, m_1 \in \mathcal{M}$ and $c \in \mathcal{C}$ with $\Pr[\mathsf{Enc}_K(m_0) = c] > \Pr[\mathsf{Enc}_K(m_1) = c]$ (probability over $K \gets \mathsf{Gen}$ and the randomness of $\mathsf{Enc}$).`,
      parts: [
        { label: "a", points: 4,
          prompt: R`Prove the "if" direction of Lemma 2.7: if $\Pi$ is perfectly indistinguishable, then it is perfectly secret.`,
          hints: [
            R`Prove the contrapositive: from "not perfectly secret" build an adversary that wins with probability $> \tfrac12$.`,
            R`Let $\mathcal{A}$ output the messages $m_0, m_1$ from the given fact.`,
            R`$\mathcal{A}$ outputs $b' = 0$ iff the challenge ciphertext equals the special $c$. Compute both conditional success probabilities.`
          ],
          solution: R`We prove the contrapositive. Assume $\Pi$ is not perfectly secret. Then there are $m_0, m_1, c$ with

$$p_0 := \Pr[\mathsf{Enc}_K(m_0) = c] > \Pr[\mathsf{Enc}_K(m_1) = c] =: p_1.$$

**Adversary $\mathcal{A}$:**

1. Output $m_0, m_1$.
2. On challenge $\hat c$: output $b' := 0$ if $\hat c = c$, else $b' := 1$.

**Analysis.** The challenger uses a uniform $b$ and $\hat c \gets \mathsf{Enc}_k(m_b)$.

- $b = 0$: $\Pr[b' = 0 \mid b = 0] = \Pr[\mathsf{Enc}_K(m_0) = c] = p_0$.
- $b = 1$: $\Pr[b' = 1 \mid b = 1] = \Pr[\mathsf{Enc}_K(m_1) \neq c] = 1 - p_1$.

Hence

$$\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi} = 1] = \tfrac12 p_0 + \tfrac12 (1 - p_1) = \tfrac12 + \tfrac12 (p_0 - p_1) > \tfrac12.$$

So $\Pi$ is not perfectly indistinguishable. By contraposition, perfect indistinguishability implies perfect secrecy. $\blacksquare$`,
          rubric: [
            { points: 1, text: R`Contrapositive set up; messages $m_0, m_1$ and ciphertext $c$ with $p_0 > p_1$ taken from the given fact` },
            { points: 1, text: R`Adversary fully specified (outputs $m_0, m_1$; guesses $0$ iff $\hat c = c$)` },
            { points: 1, text: R`Conditional probabilities $p_0$ and $1 - p_1$ computed correctly` },
            { points: 1, text: R`Total $\tfrac12 + \tfrac12(p_0 - p_1) > \tfrac12$ and conclusion` }
          ] }
      ] },

    { id: "es-s3-q8", type: "problem", lecture: 4, topic: "computational", origin: "exercise",
      source: "Exercise 3, Q8", difficulty: 3,
      title: "Why the EAV game requires equal-length messages",
      mock: true,
      statement: R`Recall (Def. 3.8): $\Pi$ is EAV-secure if for every p.p.t. $\mathcal{A}$ there is a negligible $\varepsilon$ with $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n) = 1] \le \tfrac12 + \varepsilon(n)$. In $\mathsf{PrivK}^{\mathsf{eav}}_{\mathcal{A},\Pi}(n)$, $\mathcal{A}(1^n)$ outputs $m_0, m_1$ with $|m_0| = |m_1|$; the challenger samples $k \gets \mathsf{Gen}(1^n)$, uniform $b$, and gives $c \gets \mathsf{Enc}_k(m_b)$ to $\mathcal{A}$; $\mathcal{A}$ outputs $b'$; the output is $1$ iff $b' = b$.

Let $\mathsf{PrivK}^{\mathsf{eav'}}_{\mathcal{A},\Pi}(n)$ be the same experiment **without** the restriction $|m_0| = |m_1|$. The scheme is assumed to be correct: $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$ always.`,
      parts: [
        { label: "a", points: 5,
          prompt: R`Prove that no encryption scheme $\Pi$ with $\mathcal{M} = \{0,1\}^*$ can satisfy Def. 3.8 with respect to $\mathsf{PrivK}^{\mathsf{eav'}}$.

Hint: let $\ell(n)$ be a polynomial upper bound on the length of a ciphertext of a 1-bit message.`,
          hints: [
            R`Make one message very short and one longer than any short ciphertext can "hold".`,
            R`Let $m_0 \in \{0,1\}$ and $m_1$ uniform in $\{0,1\}^{\ell(n)+2}$; guess by the length of $c$.`,
            R`By correctness, under a fixed key distinct messages have disjoint sets of possible ciphertexts. Count the strings of length at most $\ell(n)$.`
          ],
          solution: R`Since $\mathsf{Enc}$ is p.p.t., there is a polynomial $\ell(n)$ bounding the length of every ciphertext of a 1-bit message under keys from $\mathsf{Gen}(1^n)$.

**Adversary $\mathcal{A}$** in $\mathsf{PrivK}^{\mathsf{eav'}}$:

1. Output $m_0 := 0$ (one bit) and a uniformly random $m_1 \gets \{0,1\}^{\ell(n)+2}$.
2. On challenge $c$: output $b' := 0$ if $|c| \le \ell(n)$, else $b' := 1$.

$\mathcal{A}$ is p.p.t. because $\ell$ is a polynomial.

**$b = 0$:** $|c| \le \ell(n)$ always, so $\Pr[b' = 0 \mid b = 0] = 1$.

**$b = 1$:** Fix any key $k$. By correctness, two distinct messages can never have a common ciphertext under $k$, so the sets of possible ciphertexts of different messages are disjoint. There are only $\sum_{i=0}^{\ell(n)} 2^i = 2^{\ell(n)+1} - 1$ strings of length at most $\ell(n)$, hence at most $2^{\ell(n)+1} - 1$ of the $2^{\ell(n)+2}$ messages of length $\ell(n)+2$ have **any** ciphertext of length $\le \ell(n)$. As $m_1$ is uniform and independent of $k$:

$$\Pr[|c| \le \ell(n) \mid b = 1] \le \frac{2^{\ell(n)+1} - 1}{2^{\ell(n)+2}} < \frac12, \qquad\text{so}\qquad \Pr[b' = 1 \mid b = 1] > \frac12.$$

**Total:**

$$\Pr[\mathsf{PrivK}^{\mathsf{eav'}}_{\mathcal{A},\Pi}(n) = 1] = \tfrac12 \cdot 1 + \tfrac12 \Pr[b'=1 \mid b=1] > \tfrac12 + \tfrac14 = \tfrac34.$$

If Def. 3.8 held, we would need $\tfrac34 < \tfrac12 + \varepsilon(n)$, i.e. $\varepsilon(n) > \tfrac14$ for all $n$; but a negligible $\varepsilon$ satisfies $\varepsilon(n) < \tfrac14$ for all large $n$ (take $p(n) = 4$). Contradiction, so no such $\Pi$ exists. $\blacksquare$`,
          rubric: [
            { points: 1, text: R`Adversary fully specified: $m_0$ one bit, $m_1$ uniform of length $\ell(n)+2$, decision by $|c| \le \ell(n)$` },
            { points: 1, text: R`Case $b=0$: always correct since $|c| \le \ell(n)$` },
            { points: 2, text: R`Case $b=1$: counting argument via correctness (disjoint ciphertext sets, at most $2^{\ell(n)+1}-1$ short strings) giving $\Pr[\text{correct}] > \tfrac12$` },
            { points: 1, text: R`Total success $> \tfrac34$ and conclusion that $\tfrac14$ is not negligible` }
          ] }
      ] },

    // ---- T/F items for sheet 3 ----
    { id: "es-tf-s3-q1", type: "tf", lecture: 3, topic: "perfect-secrecy", origin: "exercise",
      source: "Exercise 3, Q1", difficulty: 1,
      statement: R`Encrypting a single 64-bit block with DES under a uniformly random 56-bit key is a perfectly secret encryption scheme.`,
      answer: false,
      explanation: R`$|\mathcal{K}| = 2^{56} < 2^{64} = |\mathcal{M}|$, so by Shannon's bound it cannot be perfectly secret: a fixed message reaches at most $2^{56}$ ciphertexts, and for an unreachable $c'$ we get $\Pr[M = m' \mid C = c'] = 0 \neq \Pr[M = m']$.` },
    { id: "es-tf-s3-q2-a", type: "tf", lecture: 3, topic: "block-ciphers", origin: "exercise",
      source: "Exercise 3, Q2a", difficulty: 1,
      statement: R`To decrypt with a Feistel network, the round functions $f_{k_i}$ must be invertible.`,
      answer: false,
      explanation: R`Decryption uses $R_{i-1} = L_i$ and $L_{i-1} = R_i \oplus f_{k_i}(L_i)$, which only evaluates $f_{k_i}$ forwards. A Feistel network is a permutation for any round function.` },
    { id: "es-tf-s3-q2-c", type: "tf", lecture: 3, topic: "block-ciphers", origin: "exercise",
      source: "Exercise 3, Q2c", difficulty: 2,
      statement: R`Even if the round functions are uniformly random, the outputs of a 2-round Feistel network on two inputs chosen by the adversary can be distinguished from two independent uniform strings with advantage $1 - 2^{-n}$.`,
      answer: true,
      explanation: R`Choose $R_0 = R_0'$ and $L_0 \neq L_0'$. Then $L_2 \oplus L_2' = L_0 \oplus L_0'$ always, whereas for uniform strings the XOR of the left halves matches with probability $2^{-n}$.` },
    { id: "es-tf-s3-q3", type: "tf", lecture: 3, topic: "block-ciphers", origin: "exercise",
      source: "Exercise 3, Q3", difficulty: 2,
      statement: R`If an SPN applies all key-addition steps first, then all substitution steps and then all permutation steps, a single known plaintext-ciphertext pair suffices to decrypt every ciphertext, no matter how many rounds are used.`,
      answer: true,
      explanation: R`The cipher collapses to $c = P(S(m \oplus k^*))$ with $k^* = k_1 \oplus \dots \oplus k_r$ and public bijections $P, S$, so $k^* = S^{-1}(P^{-1}(c)) \oplus m$ from one pair.` },
    { id: "es-tf-s3-q4", type: "tf", lecture: 3, topic: "block-ciphers", origin: "exercise",
      source: "Exercise 3, Q4", difficulty: 2,
      statement: R`For $E_{k_1,k_2}(x) = P(S(x \oplus k_1)) \oplus k_2$ with $k_1, k_2 \in \{0,1\}^n$ and public invertible $S, P$, recovering the key from known plaintext-ciphertext pairs requires testing about $2^{2n}$ candidate keys.`,
      answer: false,
      explanation: R`Guess only $k_1$; one known pair $(m,c)$ then determines $k_2 = P(S(m \oplus k_1)) \oplus c$. Checking each candidate on further pairs needs only $2^n$ candidates.` },
    { id: "es-tf-s3-q5", type: "tf", lecture: 4, topic: "stream-ciphers", origin: "exercise",
      source: "Exercise 3, Q5", difficulty: 2,
      statement: R`The 4-bit LFSR with update $(x_3', x_2', x_1', x_0') := (x_0 \oplus x_1 \oplus x_3, x_3, x_2, x_1)$ has maximum period $15$.`,
      answer: false,
      explanation: R`Iterating symbolically, every state returns to itself after 6 steps; the maximum period is $6$ (e.g. $0001 \to 1000 \to 1100 \to 1110 \to 0111 \to 0011 \to 0001$).` },
    { id: "es-tf-s3-q6-b", type: "tf", lecture: 4, topic: "computational", origin: "exercise",
      source: "Exercise 3, Q6b", difficulty: 1,
      statement: R`The function $f(n) = 2^{-128}/n$ is negligible.`,
      answer: false,
      explanation: R`For the polynomial $p(n) = 2^{128} n$ we have $f(n) = 1/p(n)$, never $< 1/p(n)$. Constant factors do not matter asymptotically; $f$ behaves like $1/n$.` },
    { id: "es-tf-s3-q6-c", type: "tf", lecture: 4, topic: "computational", origin: "exercise",
      source: "Exercise 3, Q6c", difficulty: 2,
      statement: R`If $f_1$ and $f_2$ are negligible and $f_2(n) > 0$ for all $n$, then $f_1/f_2$ is negligible.`,
      answer: false,
      explanation: R`Counterexample: $f_1 = f_2 = 2^{-n}$ gives $f_1/f_2 = 1$, which is not negligible. (Sums and polynomial multiples of negligible functions are negligible; quotients need not be.)` },
    { id: "es-tf-s3-q7", type: "tf", lecture: 4, topic: "perfect-secrecy", origin: "exercise",
      source: "Exercise 3, Q7", difficulty: 2,
      statement: R`Every perfectly indistinguishable encryption scheme is perfectly secret.`,
      answer: true,
      explanation: R`Lemma 2.7 (both directions hold). If $\Pi$ were not perfectly secret, there would be $m_0, m_1, c$ with $\Pr[\mathsf{Enc}_K(m_0)=c] > \Pr[\mathsf{Enc}_K(m_1)=c]$, and the adversary guessing $0$ iff it sees $c$ wins with probability $> \tfrac12$.` },
    { id: "es-tf-s3-q8", type: "tf", lecture: 4, topic: "computational", origin: "exercise",
      source: "Exercise 3, Q8", difficulty: 2,
      statement: R`If the EAV experiment allowed $|m_0| \neq |m_1|$, then no encryption scheme with message space $\{0,1\}^*$ could be EAV-secure.`,
      answer: true,
      explanation: R`Take $m_0$ one bit and $m_1$ uniform of length $\ell(n)+2$, where $\ell(n)$ bounds 1-bit ciphertext lengths. By correctness fewer than half of the long messages can have short ciphertexts, so guessing by $|c|$ wins with probability $> \tfrac34$. Ciphertexts must leak the message length.` }
  );
})();
