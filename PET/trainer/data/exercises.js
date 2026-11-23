/* Exercise sheet conversions that are not already covered in the unit files.
 * UE1 Q1–Q5 -> unit 2/3; UE2 Q1, Q3, Q4 -> unit 4/5; UE2 Q2.2–Q2.4 ->
 * exercises-ue2.js; UE2 Q2.1 and Q5 -> this file.
 */
(function () {
  const R = String.raw;
  const add = (...items) => (window.TRAINER_BANK = window.TRAINER_BANK || []).push(...items);

  add(
    { id: "es-ue2-q2a", type: "problem", lecture: 4, topic: "prfs", origin: "exercise",
      source: "Exercise sheet 2, Problem 2.1", difficulty: 2,
      title: "PRF with an XOR Permutation",
      statement: R`Let $F$ be a PRF. Define $F'(k,x) := F(k, x \oplus 1^n)$ for $x \in \{0,1\}^n$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Is $F'$ a PRF? Prove or disprove.`,
          hints: [R`The map $x \mapsto x \oplus 1^n$ is a bijection.`,
                  R`Can a distinguisher against $F'$ see the value $F(k,x)$ directly?`],
          solution: R`Yes. The map $\pi(x) = x \oplus 1^n$ is a bijection on $\{0,1\}^n$. A distinguisher $A$ against $F'$ can be reduced to a distinguisher $B$ against $F$: for every query $x$, $B$ queries its oracle on $\pi(x)$ and returns the answer to $A$.

If the oracle is $F(k,\cdot)$, $A$ sees exactly $F(k,\pi(x)) = F'(k,x)$. If the oracle is a truly random function $f$, then $f \circ \pi$ is a truly random function as well, because $\pi$ is bijective. The advantages are equal; $F'$ is a PRF.`,
          rubric: [ { points: 1, text: R`Yes; $\pi$ is a bijection` },
                    { points: 1, text: R`Reduction: query $\pi(x)$ / the random function stays random` } ] }
      ] },
    { id: "es-ue2-q5b", type: "problem", lecture: 4, topic: "signatures", origin: "exercise",
      source: "Exercise sheet 2, Problem 5.2", difficulty: 3,
      title: "Which Hardness Assumption Does Schnorr Need?",
      statement: "",
      parts: [
        { label: "a", points: 3,
          prompt: R`Which hardness assumption from the lecture is necessary for the EUF-CMA security of Schnorr? Show that it is necessary.`,
          hints: [R`The signing key is $sk$ with $vk=g^{sk}$.`,
                  R`What can a DLP solver do with $vk$?`],
          solution: R`The necessary assumption is the **Discrete Logarithm Problem (DLP)**. Suppose there is a PPT DLP solver $D$. Then an adversary can compute the signing key
$$sk := D(G,q,g,vk)$$
from $vk$. With $sk$ it can produce a valid signature for every message $m$:
$r \leftarrow \mathbb{Z}_q$, $R=g^r$, $h=H(vk,R,m)$, $s=sk\cdot h+r$. Hence EUF-CMA is broken.

So: if DLP is easy, Schnorr is not EUF-CMA secure. The security of the scheme rests on DLP (or the underlying assumption).`,
          rubric: [ { points: 1, text: R`DLP as the necessary assumption` },
                    { points: 1, text: R`A DLP solver computes $sk$ from $vk$` },
                    { points: 1, text: R`With $sk$, forge arbitrary signatures` } ] }
      ] },
    { id: "es-ue2-q5c", type: "problem", lecture: 4, topic: "signatures", origin: "exercise",
      source: "Exercise sheet 2, Problem 5.3", difficulty: 3,
      title: "Schnorr Without Binding to $R$",
      statement: R`A redesign computes the challenge as $h := H(vk,m)$ in Sign and Vrfy; $R$ is no longer hashed.`,
      parts: [
        { label: "a", points: 4,
          prompt: R`Is the redesign EUF-CMA secure? Prove it or give an attack.`,
          hints: [R`Verification checks $g^s = R \cdot vk^h$.`,
                  R`Can you define $R$ to match a chosen $s$?`],
          solution: R`No, the redesign is **not** EUF-CMA secure. For any message $m$:

1. Compute $h := H(vk,m)$.
2. Choose $s \leftarrow \mathbb{Z}_q$ arbitrarily.
3. Set $R := g^s \cdot vk^{-h}$.

Then
$$R \cdot vk^h = g^s \cdot vk^{-h} \cdot vk^h = g^s,$$
so $(R,s)$ is a valid signature for $m$. The adversary never used the signing oracle and can forge for any message. This is a universal forgery.

The attack works because $R$ is not bound to the challenge: one can choose $R$ after the fact so that the verification equation holds.`,
          rubric: [ { points: 1, text: R`No, not secure` },
                    { points: 1, text: R`Compute $h=H(vk,m)$, choose $s$` },
                    { points: 1, text: R`$R := g^s vk^{-h}$` },
                    { points: 1, text: R`Verify $g^s = R vk^h$` } ] }
      ] },
    { id: "es-ue2-q5d", type: "problem", lecture: 4, topic: "signatures", origin: "exercise",
      source: "Exercise sheet 2, Problem 5.4", difficulty: 2,
      title: "Nonce Reuse and the EUF-CMA Model",
      statement: R`A buggy implementation of the original Schnorr scheme signs two different messages $m_1 \ne m_2$ with the same nonce $r$ and outputs $(R,s_1)$ and $(R,s_2)$.`,
      parts: [
        { label: "a", points: 2,
          prompt: R`What can an observer of the two signatures do?`,
          hints: [R`Subtract the equations.`,
                  R`$h_1 \ne h_2$ with overwhelming probability.`],
          solution: R`The observer computes $s_1-s_2 = sk(h_1-h_2) \pmod q$ and from that
$$sk = (s_1-s_2)(h_1-h_2)^{-1} \pmod q,$$
provided that $h_1 \ne h_2$ (which holds with probability $1-1/q$). With $sk$ it can forge arbitrary signatures.`,
          rubric: [ { points: 1, text: R`Difference of the signatures` },
                    { points: 1, text: R`Compute $sk$` } ] },
        { label: "b", points: 2,
          prompt: R`Does this contradict the EUF-CMA security of the scheme?`,
          hints: [R`What does EUF-CMA assume about the nonce?`,
                  R`Is a buggy implementation part of the scheme?`],
          solution: R`No, this does not contradict the EUF-CMA security of the **scheme**. EUF-CMA models a correctly implemented signing oracle that uses a fresh, uniform nonce for every signature. The buggy implementation violates this assumption; the attack exploits an implementation flaw, not a break of the mathematical scheme. In practice it is still fatal — which is why deterministic nonce schemes (RFC 6979) and careful randomness sources matter.`,
          rubric: [ { points: 1, text: R`No, EUF-CMA assumes fresh nonces` },
                    { points: 1, text: R`Implementation flaw vs. scheme` } ] }
      ] }
  );
})();
