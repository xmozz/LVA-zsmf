/* Unit 1 — Introduction: Privacy & PETs
 * Sources: Lecture I (Introduction), Lecture II (Privacy in the Web).
 */
(function () {
  const R = String.raw;
  const add = (...items) => (window.TRAINER_BANK = window.TRAINER_BANK || []).push(...items);

  add(
    /* ---------------- notes ---------------- */
    { id: "u1-note-privacy", type: "note", lecture: 1, topic: "privacy-foundations", origin: "slides",
      source: "Lecture I, slides 5–10; Lecture II, slides 5–20", difficulty: 1,
      title: "What privacy is — and why it does not mean “nothing to hide”",
      order: 10,
      body: R`### Two classical definitions

**Warren & Brandeis (1890):** Privacy is the *right to be left alone*.

**Westin (1970):** Privacy is the right of the individual to decide what information about themselves is communicated to whom and under what circumstances.

### Three perspectives

| Perspective | Question |
| --- | --- |
| technical | How are data protected technically? |
| sociological | What effect does surveillance have on individuals? |
| political-legal | What effect does it have on society and companies? |

The lecture focuses mainly on the **technical** perspective. Technical PETs address in particular **informational privacy** and **communications privacy**.

### Areas of privacy (non-exhaustive)

- Personal Privacy: Physical, Informational (Medical, Financial, Psychological), Communications
- Territorial Privacy
- Data Privacy
- Organizational Privacy
- Legal Privacy

### “I have nothing to hide”

The argument overlooks that privacy does not only protect secrets but also **freedom of action**: health, political views, finances, relationships, location, communication. Someone with nothing to hide can still be influenced by the mere possibility of being observed.

**Snowden:** “Arguing that you don't care about the right to privacy because you have nothing to hide is no different than saying you don't care about free speech because you have nothing to say.”

### Panopticism, paternalism, surveillance

**Panopticism (Foucault):** a system of power in which people regulate their own behaviour because they assume **possible** observation. The Panopticon has a central watchtower; the inmates do not know when they are actually being watched. The uncertainty produces self-discipline and self-censorship.

**Paternalism:** an action that restricts a person's freedom or autonomy in order to promote their own good (seat-belt laws, smoking bans, mandatory vaccination).

**Surveillance:** observation of activities or communication in order to collect information.

| Form | Example |
| --- | --- |
| mass surveillance | collecting the location data of all mobile phones to find terrorists |
| targeted surveillance | wiretapping a specific suspect |

### Legal framework

- **UDHR:** “No one shall be subjected to arbitrary interference with his privacy, family, home or correspondence.”
- **Article 8 ECHR:** right to respect for private and family life, home and correspondence. It may be restricted if the restriction is provided by law and necessary in a democratic society (national security, public safety, economic well-being, prevention of crime, health/morals, rights of others).

### Documented abuses

- Video surveillance at Schwedenplatz (Vienna, 2005): operators watched people inside their apartments.
- NSA LOVEINT: analysts spied on former partners.
- Commercial spyware: NSO Group, Candiru, HackingTeam, FinFisher.

### Why privacy on the Internet?

- **Global access:** data are reachable from anywhere.
- **Digital footprint:** online actions persist.
- **Behavioural ads:** data are used to influence preferences.
- **Data breaches:** centralised data attracts attackers.
- **Surveillance:** cross-border surveillance is cheap and easy.`
    },
    { id: "u1-note-pets", type: "note", lecture: 1, topic: "pets", origin: "slides",
      source: "Lecture I, slides 8–10; Lecture II, slides 50–53; Midterm 2024/25, Q1(iv)", difficulty: 1,
      title: "Privacy-Enhancing Technologies: definition, taxonomy, limits",
      order: 20,
      body: R`### Definition

**PETs** (van Blarkom, Borking & Olk, 2003) are a system of ICT measures that protect **informational privacy** by **eliminating or minimising** personal data, thereby preventing unnecessary or unwanted processing — **without loss of functionality** of the information system.

In short: tools and methods that protect privacy and minimise data exposure.

### Taxonomy used in the lecture

- **Encryption Technologies**
  - End-to-End Encryption
  - Homomorphic Encryption
- **Anonymous Communication Protocols** (Onion Routing/Tor, Mix Networks)
- **Privacy-Preserving Identity Management** (Decentralized Identifiers, Anonymous Credentials)
- **Privacy-Preserving Data Mining & ML**
- **Trusted Execution Environments (TEEs)**
- **Federated Learning**
- **Data Anonymization & Pseudonymization** (Pseudonymization, Anonymization)
- **Zero-Knowledge Proofs (ZKPs)**
- **Secure Multi-Party Computation (SMPC)**
- **Differential Privacy**

Note the tree structure on the slide: **SMPC**, **ZKPs** and **Differential Privacy** are separate top-level branches, not children of Encryption Technologies. Encryption Technologies contains only End-to-End Encryption and Homomorphic Encryption.

### Limits

Every PET solves only the problem it was designed for:

- Cryptography protects **content**, not **metadata**.
- Anonymization protects **identities**, not **behaviour**.
- A single PET rarely covers the entire attacker model.

That is why techniques are combined — for example TLS + Tor + anonymous credentials.

### Why adoption is hard

The main problem is not missing compatibility but **usability and effort**:

- complex setup (generating, sharing, managing keys),
- lack of native support in clients,
- key management: a lost private key means data loss,
- lack of user knowledge leads to misuse or circumvention.

### Relevance for the exam

The definition requires **both** parts: eliminating/minimising data **and** preserving functionality. A mechanism that achieves privacy only by switching off a feature is not a PET in the sense of the definition.`
    },

    /* ---------------- cards ---------------- */
    { id: "u1-card-warren", type: "card", lecture: 1, topic: "privacy-foundations", origin: "slides",
      source: "Lecture II, slide 5", difficulty: 1,
      front: R`How do Warren & Brandeis (1890) define privacy?`,
      back: R`As the **right to be left alone**.` },
    { id: "u1-card-westin", type: "card", lecture: 1, topic: "privacy-foundations", origin: "slides",
      source: "Lecture II, slide 5", difficulty: 1,
      front: R`How does Westin (1970) define privacy?`,
      back: R`As the right of the individual to decide what information about themselves is communicated to whom and under what circumstances.` },
    { id: "u1-card-perspectives", type: "card", lecture: 1, topic: "privacy-foundations", origin: "slides",
      source: "Lecture II, slide 6", difficulty: 1,
      front: R`Name the three perspectives on privacy.`,
      back: R`**Technical** (how data are protected), **sociological** (effect on individuals), **political-legal** (effect on society and companies).` },
    { id: "u1-card-areas", type: "card", lecture: 1, topic: "privacy-foundations", origin: "slides",
      source: "Lecture I, slide 7", difficulty: 1,
      front: R`Which areas of privacy does the lecture distinguish?`,
      back: R`Personal Privacy (Physical, Informational with Medical/Financial/Psychological, Communications), Territorial, Data, Organizational and Legal Privacy.` },
    { id: "u1-card-panopticism", type: "card", lecture: 1, topic: "privacy-foundations", origin: "slides",
      source: "Lecture II, slides 10–11", difficulty: 2,
      front: R`What does Foucault's panopticism state?`,
      back: R`People regulate their own behaviour because they assume **possible** observation. The uncertainty about whether they are being watched right now produces self-discipline and self-censorship.` },
    { id: "u1-card-paternalism", type: "card", lecture: 1, topic: "privacy-foundations", origin: "slides",
      source: "Lecture II, slide 12", difficulty: 1,
      front: R`What is paternalism?`,
      back: R`An action that restricts a person's freedom or autonomy in order to promote their own good — for example seat-belt laws or smoking bans.` },
    { id: "u1-card-surveillance", type: "card", lecture: 1, topic: "privacy-foundations", origin: "slides",
      source: "Lecture II, slide 13", difficulty: 1,
      front: R`What is the difference between mass surveillance and targeted surveillance?`,
      back: R`**Mass surveillance** observes everyone (e.g. location data of all mobile phones); **targeted surveillance** observes a specific suspect or group.` },
    { id: "u1-card-echr", type: "card", lecture: 1, topic: "privacy-foundations", origin: "slides",
      source: "Lecture II, slides 17–18", difficulty: 1,
      front: R`What does Article 8 ECHR protect, and when may it be interfered with?`,
      back: R`Private and family life, home and correspondence. Interference is only permissible if it is provided by law and necessary in a democratic society (e.g. national security, crime, rights of others).` },
    { id: "u1-card-pet-def", type: "card", lecture: 1, topic: "pets", origin: "slides",
      source: "Lecture I, slide 9; Lecture II, slide 52", difficulty: 1,
      front: R`Define Privacy-Enhancing Technologies (PETs).`,
      back: R`Technologies that protect informational privacy by **eliminating or minimising** personal data without losing the **functionality** of the system.` },
    { id: "u1-card-pet-taxonomy", type: "card", lecture: 1, topic: "pets", origin: "slides",
      source: "Lecture I, slide 9", difficulty: 2,
      front: R`Name the PET categories of the lecture.`,
      back: R`Encryption Technologies (E2EE, HE), Anonymous Communication (Tor, Mix Networks), Privacy-Preserving Identity Management (DIDs, Anonymous Credentials), Privacy-Preserving Data Mining & ML, TEEs, Federated Learning, Anonymization/Pseudonymization, ZKPs, SMPC, Differential Privacy. SMPC, ZKPs and Differential Privacy are separate top-level branches, not part of Encryption Technologies.` },
    { id: "u1-card-mixnets", type: "card", lecture: 1, topic: "pets", origin: "exam-2025-reexam",
      source: "Midterm reexam 2025/26, Q1(ii)", difficulty: 1,
      front: R`How does a mix network improve communication privacy?`,
      back: R`Messages are encrypted in layers and routed through several mixes. Each mix removes one layer, batches messages and forwards them with a delay. Random routing and batching break the link between sender and receiver, so the network hides **metadata** (who talks to whom, when), not only the content.` },
    { id: "u1-card-pet-limits", type: "card", lecture: 1, topic: "pets", origin: "slides",
      source: "Lecture I, slide 10", difficulty: 2,
      front: R`Why is a single PET rarely sufficient?`,
      back: R`Every PET solves only its own problem: crypto protects content, not metadata; anonymization protects identities, not behaviour. Techniques are combined, e.g. TLS + Tor + anonymous credentials.` },
    { id: "u1-card-adoption", type: "card", lecture: 1, topic: "pets", origin: "slides",
      source: "Lecture II, slides 48–50", difficulty: 1,
      front: R`What are the main adoption barriers for PETs?`,
      back: R`Usability and effort: complex setup, key management, lack of native support, lack of user knowledge — not primarily missing compatibility.` },
    { id: "u1-card-metadata", type: "card", lecture: 1, topic: "pets", origin: "slides",
      source: "Lecture I, slide 10", difficulty: 2,
      front: R`Does end-to-end encryption also protect metadata?`,
      back: R`No. It protects the content. Who communicates with whom, when and how much may remain visible.` },

    /* ---------------- true / false ---------------- */
    { id: "u1-tf-secrets-only", type: "tf", lecture: 1, topic: "privacy-foundations", origin: "variant",
      source: "Variant of Lecture II, slide 7", difficulty: 1,
      statement: R`Privacy protects only secrets that one wants to hide from others.`,
      answer: false,
      explanation: R`Privacy also protects ordinary but sensitive areas of life such as health, politics, finances and relationships — and freedom of action, not only secrets.` },
    { id: "u1-tf-panopticism", type: "tf", lecture: 1, topic: "privacy-foundations", origin: "slides",
      source: "Lecture II, slides 10–11", difficulty: 1,
      statement: R`In panopticism, self-discipline arises precisely because the observed person is not sure whether they are being watched right now.`,
      answer: true,
      explanation: R`The central watchtower permits observation at any time; uncertainty about the actual moment leads to self-regulation.` },
    { id: "u1-tf-paternalism", type: "tf", lecture: 1, topic: "privacy-foundations", origin: "slides",
      source: "Lecture II, slide 12", difficulty: 1,
      statement: R`Paternalism restricts a person's autonomy in order to promote their own good.`,
      answer: true,
      explanation: R`That is exactly the definition; examples are seat-belt laws and smoking bans.` },
    { id: "u1-tf-mass-targeted", type: "tf", lecture: 1, topic: "privacy-foundations", origin: "variant",
      source: "Variant of Lecture II, slide 13", difficulty: 1,
      statement: R`Collecting the location data of every mobile phone in a country is an example of targeted surveillance.`,
      answer: false,
      explanation: R`It is **mass surveillance**, because everyone is captured. Targeted surveillance observes a specific suspect or group.` },
    { id: "u1-tf-human-right", type: "tf", lecture: 1, topic: "privacy-foundations", origin: "slides",
      source: "Lecture II, slides 17–18", difficulty: 1,
      statement: R`Privacy is anchored both in the UDHR and in Article 8 of the European Convention on Human Rights.`,
      answer: true,
      explanation: R`The UDHR prohibits arbitrary interference with privacy, family, home and correspondence; Article 8 ECHR protects private and family life, home and correspondence.` },
    { id: "u1-tf-pet-all-data", type: "tf", lecture: 1, topic: "pets", origin: "variant",
      source: "Variant of the PET definition", difficulty: 2,
      statement: R`A PET must completely remove all personal data in order to satisfy the definition.`,
      answer: false,
      explanation: R`The definition allows **eliminating or minimising**. What matters is that unnecessary processing is prevented without losing functionality.` },
    { id: "u1-tf-pet-functionality", type: "tf", lecture: 1, topic: "pets", origin: "slides",
      source: "Lecture I, slide 9", difficulty: 1,
      statement: R`A mechanism that achieves privacy only by switching off a feature is not a PET in the sense of the lecture.`,
      answer: true,
      explanation: R`The definition explicitly includes preserving the functionality of the information system.` },
    { id: "u1-tf-e2ee-metadata", type: "tf", lecture: 1, topic: "pets", origin: "variant",
      source: "Variant of Lecture I, slide 10", difficulty: 2,
      statement: R`End-to-end encryption protects content and metadata equally.`,
      answer: false,
      explanation: R`It protects the content. Metadata such as participants, timing and volume may remain visible; that requires additional techniques such as Tor.` },
    { id: "u1-tf-anonymization", type: "tf", lecture: 1, topic: "pets", origin: "variant",
      source: "Variant of Lecture I, slide 10", difficulty: 2,
      statement: R`Anonymization typically protects a person's identity but not automatically their behaviour.`,
      answer: true,
      explanation: R`Behaviour can create a profile even without a name. That is why anonymization is not the same as behavioural protection.` },
    { id: "u1-tf-adoption-compat", type: "tf", lecture: 1, topic: "pets", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(iv)", difficulty: 1,
      statement: R`The main difficulty in the broad adoption of PETs is their incompatibility with modern encryption standards such as TLS.`,
      answer: false,
      explanation: R`The official solution names usability and missing technical infrastructure as the main barrier. In principle, PETs can be combined with TLS.` },
    { id: "u1-tf-taxonomy", type: "tf", lecture: 1, topic: "pets", origin: "slides",
      source: "Lecture I, slide 9", difficulty: 1,
      statement: R`In the lecture, Homomorphic Encryption, Secure Multi-Party Computation and Zero-Knowledge Proofs all belong to the Encryption Technologies.`,
      answer: false,
      explanation: R`Only End-to-End Encryption and Homomorphic Encryption are children of Encryption Technologies. SMPC and ZKPs are separate top-level PET branches on the slide.` },
    { id: "u1-tf-every-pet", type: "tf", lecture: 1, topic: "pets", origin: "variant",
      source: "Variant of Lecture I, slide 10", difficulty: 1,
      statement: R`Every PET protects against every attacker model.`,
      answer: false,
      explanation: R`Every PET covers only part of the attacker model; that is why several techniques are combined.` },

    /* ---------------- multiple choice ---------------- */
    { id: "u1-mc-pet-def", type: "mc", lecture: 1, topic: "pets", origin: "variant",
      source: "Variant of the PET definition", difficulty: 1,
      question: R`Which statement best describes a PET?`,
      options: [
        R`A mechanism that deletes all data and switches off system features to do so.`,
        R`A technology that eliminates or minimises personal data while preserving functionality.`,
        R`A legal regulation that obliges companies to delete user data.`,
        R`An attack tool that obscures metadata without protecting data.`
      ],
      correct: 1,
      explanation: R`The definition requires both parts: privacy by eliminating/minimising personal data **and** preserving functionality.` },
    { id: "u1-mc-privacy-perspective", type: "mc", lecture: 1, topic: "privacy-foundations", origin: "slides",
      source: "Lecture II, slide 6", difficulty: 1,
      question: R`Which perspective on privacy asks how data are protected technically?`,
      options: [R`the sociological one`, R`the political-legal one`, R`the technical one`, R`the economic one`],
      correct: 2,
      explanation: R`The lecture names technical, sociological and political-legal. The technical perspective is the one of this course.` },
    { id: "u1-mc-panopticism", type: "mc", lecture: 1, topic: "privacy-foundations", origin: "variant",
      source: "Variant of Lecture II, slides 10–11", difficulty: 2,
      question: R`Which situation best illustrates panopticism?`,
      options: [
        R`A person is filmed by a camera around the clock and knows it.`,
        R`A person could be observed at any time and therefore censors themselves.`,
        R`The state bans a particular opinion by law.`,
        R`A company sells user data to advertisers.`
      ],
      correct: 1,
      explanation: R`Panopticism works through the **possibility** of observation: the uncertainty produces self-discipline. Permanent, known observation is not the core.` },
    { id: "u1-mc-surveillance", type: "mc", lecture: 1, topic: "privacy-foundations", origin: "slides",
      source: "Lecture II, slide 13", difficulty: 1,
      question: R`What is the difference between mass and targeted surveillance?`,
      options: [
        R`Mass surveillance observes one person specifically, targeted surveillance observes everyone.`,
        R`Mass surveillance collects broadly from everyone; targeted surveillance is directed at a specific person or group.`,
        R`Targeted surveillance is always legal, mass surveillance always illegal.`,
        R`There is no difference, only different names.`
      ],
      correct: 1,
      explanation: R`Mass surveillance collects data about everyone; targeted surveillance focuses on suspects.` },
    { id: "u1-mc-nothing-to-hide", type: "mc", lecture: 1, topic: "privacy-foundations", origin: "variant",
      source: "Variant of Lecture II, slide 7", difficulty: 2,
      question: R`What does the “I have nothing to hide” argument overlook?`,
      options: [
        R`That privacy is only relevant for criminals.`,
        R`That privacy also protects ordinary sensitive areas of life and freedom of action.`,
        R`That surveillance is always technically impossible.`,
        R`That nobody ever collects data.`
      ],
      correct: 1,
      explanation: R`Even without secrets, people need privacy for health, politics, finances, relationships and free decisions.` },
    { id: "u1-mc-pet-block", type: "mc", lecture: 1, topic: "pets", origin: "slides",
      source: "Lecture I, slide 9", difficulty: 1,
      question: R`Which technique does **not** belong to the PET categories of the lecture?`,
      options: [R`Differential Privacy`, R`Federated Learning`, R`Trusted Execution Environments`, R`Public-key infrastructure without anonymization`],
      correct: 3,
      explanation: R`The PET blocks include DP, FL and TEEs. An ordinary PKI is not a PET block of its own.` },
    { id: "u1-mc-adoption", type: "mc", lecture: 1, topic: "pets", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(iv)", difficulty: 1,
      question: R`Why is the broad adoption of PETs often difficult?`,
      options: [
        R`Because PETs are incompatible with the data protection laws of most countries.`,
        R`Because many PETs require technical knowledge and infrastructure and thus create usability hurdles.`,
        R`Because PETs are incompatible with modern encryption standards such as TLS.`,
        R`Because adoption would require a complete redesign of the Internet architecture.`
      ],
      correct: 1,
      explanation: R`The official solution names usability and missing infrastructure. The other options are too absolute.` },
    { id: "u1-mc-combine", type: "mc", lecture: 1, topic: "pets", origin: "variant",
      source: "Variant of Lecture I, slide 10", difficulty: 2,
      question: R`Why are several PETs combined?`,
      options: [
        R`Because every combination automatically earns more points in the exam.`,
        R`Because a single PET typically covers only part of the attacker model.`,
        R`Because PETs only work together and are ineffective on their own.`,
        R`Because more technology always means more privacy.`
      ],
      correct: 1,
      explanation: R`Crypto protects content, not metadata; anonymization protects identities, not behaviour. The combination covers more.` },

    /* ---------------- gaps ---------------- */
    { id: "u1-gap-pet", type: "gap", lecture: 1, topic: "pets", origin: "slides",
      source: "Lecture I, slide 9; Lecture II, slide 52", difficulty: 2,
      title: "Privacy-Enhancing Technologies (PETs)", points: 5,
      text: R`**PETs** are a system of ICT measures that protects <gap>informational privacy</gap> by <gap>eliminating or minimising</gap> personal data, thereby preventing unnecessary or unwanted processing — <gap>without loss of functionality</gap> of the information system. The lecture's taxonomy includes <gap>Encryption Technologies</gap> and <gap>Anonymous Communication Protocols</gap>, among others.`,
      note: R`The definition requires both: data protection **and** functionality. Merely switching off features does not satisfy it. SMPC and ZKPs are separate top-level branches, not part of Encryption Technologies.` },
    { id: "u1-gap-panopticism", type: "gap", lecture: 1, topic: "privacy-foundations", origin: "slides",
      source: "Lecture II, slides 10–11", difficulty: 2,
      title: "Panopticism", points: 4,
      text: R`**Panopticism** describes a system of power in which individuals regulate their behaviour because they assume <gap>possible observation</gap>. The model is the Panopticon with a <gap>central watchtower</gap> that permits constant observation without the inmates knowing <gap>when they are actually being observed</gap>. This uncertainty leads to <gap>self-discipline and self-censorship</gap>.`,
      note: R`What matters is not actual permanent observation but the uncertainty about the moment.` },
    { id: "u1-gap-westin", type: "gap", lecture: 1, topic: "privacy-foundations", origin: "slides",
      source: "Lecture II, slide 5", difficulty: 1,
      title: "Privacy according to Westin", points: 3,
      text: R`According to **Westin (1970)**, privacy is the right of the individual to decide <gap>what information about themselves</gap> is communicated to <gap>whom</gap> and under <gap>what circumstances</gap>.`,
      note: R`Warren & Brandeis (1890) defined privacy more briefly as the *right to be left alone*.` },

    /* ---------------- problems ---------------- */
    { id: "u1-prob-taxonomy", type: "problem", lecture: 1, topic: "pets", origin: "variant",
      source: "Variant of Lecture I, slides 9–10", difficulty: 2,
      title: "Classifying PETs",
      statement: "",
      parts: [
        { label: "a", points: 2,
          prompt: R`Assign the following techniques to the matching PET category: (1) Tor, (2) Secure Multi-Party Computation, (3) Differential Privacy, (4) Anonymous Credentials.`,
          hints: [R`The categories on slide 9 include Encryption Technologies, Anonymous Communication, Privacy-Preserving Identity Management, SMPC, ZKPs and Differential Privacy.`,
                  R`Tor is not an encryption scheme for content but for communication relationships.`],
          solution: R`1. **Tor** → Anonymous Communication Protocols (Onion Routing).
2. **SMPC** → its own top-level block, Secure Multi-Party Computation.
3. **Differential Privacy** → its own top-level block, Differential Privacy.
4. **Anonymous Credentials** → Privacy-Preserving Identity Management.

SMPC and Differential Privacy are not part of Encryption Technologies; the slide shows them as separate branches.`,
          rubric: [ { points: 1, text: R`Tor and SMPC assigned correctly` },
                    { points: 1, text: R`Differential Privacy and Anonymous Credentials assigned correctly` } ] },
        { label: "b", points: 3,
          prompt: R`For each of the same four techniques, name one privacy goal it primarily protects and one thing it does **not** protect. Use the lecture's warning that crypto protects content but not metadata, and anonymization protects identities but not behaviour.`,
          hints: [R`Tor hides the communication relationship, but it does not by itself make the content unreadable.`,
                  R`SMPC protects the inputs during the computation, not the fact that the parties are computing.`,
                  R`Differential Privacy protects individuals in aggregate statistics, not the raw data.`],
          solution: R`- **Tor:** protects the communication relationship (who talks to whom) from network observers; it does **not** protect the content by itself — use TLS for that.
- **SMPC:** protects the parties' inputs during the joint computation; it does **not** hide the fact that a computation takes place, nor does it automatically protect the output.
- **Differential Privacy:** protects an individual's contribution in aggregate statistics; it does **not** protect the raw data or the fact that a person participated.
- **Anonymous Credentials:** protect identity and attributes beyond the required property; they do **not** protect behaviour after authentication.

This is exactly the lecture's point: each PET solves its own problem, and techniques are combined.`,
          rubric: [ { points: 1, text: R`One privacy goal per technique` },
                    { points: 1, text: R`One clear limitation per technique` },
                    { points: 1, text: R`Links the answer to the lecture's “content vs metadata / identity vs behaviour” warning` } ] }
      ] },
    { id: "u1-prob-nothing-to-hide", type: "problem", lecture: 1, topic: "privacy-foundations", origin: "variant",
      source: "Variant of Lecture II, slides 7–13", difficulty: 2,
      title: "“I have nothing to hide”",
      statement: R`A colleague says: “I have nothing to hide, so I don't need privacy. Surveillance only harms criminals.”`,
      parts: [
        { label: "a", points: 2,
          prompt: R`Refute the statement using the argument of the lecture. Name at least three areas of life that are worth protecting even without secrets.`,
          hints: [R`Privacy protects not only secrets but also ordinary sensitive areas.`,
                  R`Think of health, politics, finances, relationships, location.`],
          solution: R`The statement equates privacy with hiding crimes. The lecture shows that every person needs privacy: **health**, **political views**, **finances**, **relationships/family**, **location** and **communication**. Even someone who does nothing illegal can be blackmailed, discriminated against or manipulated through observation. Privacy protects freedom of action, not only secrets.`,
          rubric: [ { points: 1, text: R`Privacy is not reduced to hiding crimes` },
                    { points: 1, text: R`At least three suitable areas of life named` } ] },
        { label: "b", points: 2,
          prompt: R`Using panopticism, explain why the **possibility** of observation is already harmful even if nobody is actually watching.`,
          hints: [R`The watchtower in the Panopticon is not always occupied.`,
                  R`What does a person do who does not know whether they are being watched?`],
          solution: R`In the Panopticon the inmates cannot tell whether the watchtower is occupied. The **uncertainty** is enough for them to adapt their behaviour: they discipline and censor themselves. Applied to digital surveillance this means: the mere possibility that data are collected and analysed changes opinions, research and communication — even without concrete abuse.`,
          rubric: [ { points: 1, text: R`Uncertainty about actual observation as the mechanism` },
                    { points: 1, text: R`Transfer to self-censorship/behavioural change` } ] },
        { label: "c", points: 2,
          prompt: R`Name a documented example of the misuse of surveillance data and explain what it says about the trade-off “less privacy = more security”.`,
          hints: [R`The slides name Schwedenplatz 2005 and NSA LOVEINT.`,
                  R`Surveillance itself creates risks.`],
          solution: R`Examples: in the video surveillance at **Schwedenplatz (Vienna, 2005)**, operators used the cameras out of boredom to watch people inside their apartments. In **NSA LOVEINT**, analysts spied on former partners. Both cases show that surveillance power is not used only for security. The trade-off is therefore not automatically valid — less privacy can create **more** risk for the people affected.`,
          rubric: [ { points: 1, text: R`One concrete documented example` },
                    { points: 1, text: R`Conclusion that surveillance itself creates risks / the trade-off does not automatically hold` } ] }
      ] },
    { id: "u1-prob-adoption", type: "problem", lecture: 1, topic: "pets", origin: "variant",
      source: "Variant of Lecture II, slides 48–53", difficulty: 3,
      title: "PETs for a telemedicine platform",
      statement: R`A clinic wants to run a telemedicine platform. Physicians should share findings with patients, researchers should compute aggregated statistics, and the platform should store as little personal data centrally as possible.`,
      parts: [
        { label: "a", points: 3,
          prompt: R`Choose three PETs from the taxonomy of the lecture and justify for each which sub-problem it solves.`,
          hints: [R`Separate transport, computation and identity.`,
                  R`For research, nobody needs to see individual records.`],
          solution: R`A sensible example combination:
- **End-to-End Encryption** for communication between physician and patient: contents are unreadable in transit and on the server.
- **Secure Multi-Party Computation** or **Federated Learning** for research: the computation runs over distributed data without a centre seeing all raw data.
- **Anonymous Credentials** for access: the physician proves their authorisation without leaving a complete identity profile.
Alternative: **Differential Privacy** for published statistics, **TEEs** for trusted execution.

The justification is what matters: every PET covers only its sub-problem.`,
          rubric: [ { points: 1, text: R`Three suitable PETs from the lecture` },
                    { points: 1, text: R`Each PET justified with a concrete sub-problem` },
                    { points: 1, text: R`Insight that the combination is necessary` } ] },
        { label: "b", points: 2,
          prompt: R`Name two adoption hurdles that may concretely arise with this platform and one countermeasure each.`,
          hints: [R`Think of key management and usability.`,
                  R`Physicians have little time for complicated key procedures.`],
          solution: R`1. **Key management:** if a physician loses their private key, old messages are no longer readable. Countermeasure: recovery procedures, hardware tokens or key rotation with a clear policy.
2. **Usability/lack of native support:** additional plug-ins or manual steps get bypassed. Countermeasure: integrate PETs into the existing client software and reduce operation to what is necessary.

Further hurdles: lack of user knowledge (training), performance (SMPC is expensive), legal uncertainty.`,
          rubric: [ { points: 1, text: R`Two concrete hurdles` },
                    { points: 1, text: R`Suitable countermeasures` } ] }
      ] }
  );
})();
