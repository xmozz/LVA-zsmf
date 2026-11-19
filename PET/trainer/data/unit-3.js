/* Unit 3 — Fingerprinting & Censorship
 * Sources: Lecture III (Fingerprinting & Censorship), Exercise sheet 1.
 */
(function () {
  const R = String.raw;
  const add = (...items) => (window.TRAINER_BANK = window.TRAINER_BANK || []).push(...items);

  add(
    /* ---------------- notes ---------------- */
    { id: "u3-note-fingerprinting", type: "note", lecture: 3, topic: "fingerprinting", origin: "slides",
      source: "Lecture III, slides 5–21; Exercise sheet 1, Preliminaries", difficulty: 2,
      title: "Fingerprinting: canvas, HSTS and entropy",
      order: 10,
      body: R`### Definition

**Fingerprinting** (Eckersley, 2010) is the collection of information about a device, browser or connection in order to create a unique identifier — tracking or identification **without cookies**.

**Fingerprinting circumvention** (Zuckerman, 2010) refers to privacy tools or techniques that limit or obscure the collected information in order to prevent unique identification.

### What identifies you

Tracking remains possible even without an IP address and without cookies. Typical features:

- geolocation, clock skew (deviations in system time)
- battery status, audio settings
- screen resolution, installed fonts
- operating system, browser language

This produces a **device fingerprint** that allows tracking across sessions and websites.

### Why fingerprinting is possible

1. **Device and browser diversity:** every combination of fonts, resolution, GPU, etc. is almost unique.
2. **Technical information leak:** browsers reveal plug-ins, fonts and battery; JavaScript, HTML5 APIs and WebRTC expose further details.
3. **Legal/regulatory gaps:** unlike cookies, fingerprinting requires no consent in many jurisdictions; there is no robust global regulation.

### Canvas fingerprinting

Flow:

1. JavaScript draws (invisibly) text or an image onto an HTML5 [[<canvas>]] element.
2. **Pixel data extraction:** the RGB values are read out.
3. **Hashing** (e.g. SHA-256) produces the fingerprint.

Why it works: anti-aliasing, font smoothing, OS, browser and GPU lead to minimally different pixels. The same code produces different hashes on different devices.

Special feature: **no state is stored on the device**. That makes canvas fingerprinting harder to block than cookies and enables cross-site tracking without consent. Princeton study: found on more than 14,000 out of 1 million websites.

Countermeasures: privacy browsers or extensions that block canvas access; the Tor Browser warns on canvas access.

### HSTS fingerprinting (supercookie)

**HSTS** (HTTP Strict Transport Security) is actually a security feature: the server header instructs the browser to contact the domain only over HTTPS, and the browser remembers this.

Abuse:

1. The tracker creates HSTS entries for many subdomains, e.g. [[id-0.tracker-domain.de]], [[id-1.tracker-domain.de]], …
2. On the next visit, the page requests [[http://id-N.tracker-domain.de]].
3. The browser upgrades to HTTPS exactly when HSTS is cached. That yields one bit per subdomain.

With 32 subdomains there are $2^{32} \approx 4.29 \cdot 10^9$ combinations. The HSTS cache survives cookie deletion; any website can query the subdomains. Result: long-term cross-site tracking.

### Entropy (Exercise sheet 1)

A browser fingerprint is a random variable $X$ over the population. A value $x$ occurs with probability $p(x)$.

**Surprisal:** $I(x) = -\log_2 p(x)$ bits.

**Entropy:**
$$H(X) = \sum_x p(x) I(x) = -\sum_x p(x) \log_2 p(x).$$

Interpretation: a browser with surprisal $I$ shares its value with the fraction $2^{-I}$ of the population.

Properties:

- $0 \le H(X) \le \log_2 k$ for $k$ possible values; equality on the right holds exactly for a uniform distribution.
- For $N$ browsers no fingerprint carries more than $\log_2 N$ bits, because every browser would then already be unique.
- If $X$ and $Y$ are independent, $H(X,Y) = H(X) + H(Y)$. In general $H(X,Y) \le H(X) + H(Y)$, with strict inequality under correlation.

Example: values $a,b,c,d$ with probabilities $\tfrac12, \tfrac14, \tfrac18, \tfrac18$ have
$$H = \tfrac12 \cdot 1 + \tfrac14 \cdot 2 + \tfrac18 \cdot 3 + \tfrac18 \cdot 3 = 1.75 \text{ bits},$$
less than $\log_2 4 = 2$ bits of the uniform distribution. A browser with value $c$ has surprisal 3 bits and shares it with one in 8 browsers.`
    },
    { id: "u3-note-fp-defense", type: "note", lecture: 3, topic: "fp-defense", origin: "slides",
      source: "Lecture III, slides 23–28", difficulty: 2,
      title: "Fingerprint protection and the paradox of fingerprintable PETs",
      order: 20,
      body: R`### Browsers

**Firefox:**

- tracking prevention based on the Disconnect rule set
- enhanced tracking prevention with a separate cookie context
- Multi-Account Containers (separating banking, work and private use)

**Brave:**

- randomises fingerprints
- Tor tabs (better than private mode alone)
- “Brave Rewards” as a privacy-respecting ad ecosystem

### Extensions

| Tool | Approach | Weakness |
| --- | --- | --- |
| AdBlock Plus | blocks ads via CSS | “Acceptable Ads” enabled by default since 2012 |
| Ghostery | detects/blocks trackers, social-plugin overlay | usability, business model (Cliqz) |
| EFF Privacy Badger | heuristic, tests DNT | maintaining the whitelist |
| Disconnect.me | open-source rule set, basis for Firefox private mode | mobile VPN is paid |
| uBlock Origin | open-source wide-spectrum blocker, performance | overblocking, filter maintenance |

**Empirical evidence (Merzdovnik et al.):** blockers strongly reduce canvas, font and WebRTC tracking, but **none blocks everything**. “All Combined” performs best.

### Paradox of fingerprintable PETs (Eckersley, PETS 2010)

Some anti-fingerprinting techniques are **self-defeating** if too few people use them: the PET itself then makes you more distinguishable. This applies to some techniques, not to others.

Examples:

- A browser that randomly alters canvas output creates a new, rare pattern.
- An extension that blocks certain requests leaves a recognisable blocking pattern.
- A technique used by very many people, by contrast, can disappear in the crowd.

### The exam logic

Fingerprint protection is an arms race:

1. The more entropy a feature has, the more strongly it identifies.
2. Normalisation reduces entropy but may cost functionality.
3. A protection used by only a few can itself become a fingerprint.
4. That is why techniques are combined and the size of the anonymity set is assessed, not just “is the tracker blocked?”.`
    },
    { id: "u3-note-censorship", type: "note", lecture: 3, topic: "censorship", origin: "slides",
      source: "Lecture III, slides 35–70", difficulty: 2,
      title: "Censorship, the GFW and circumvention",
      order: 30,
      body: R`### Definitions

**Censorship** (Siebert, 1952): suppression or prohibition of speech, communication or information that authorities or institutions regard as harmful, sensitive or inconvenient.

**Circumvention** (Zuckerman, 2010): tools, technologies and techniques for evading censorship and gaining access to restricted or controlled information.

### Why Internet censorship is possible

- **Centralized control:** governments and ISPs control central infrastructure and can block at choke points.
- **Technical vulnerabilities:** DNS manipulation, IP blocking, deep packet inspection.
- **Legal frameworks:** laws enforce content regulation; tech companies and ISPs cooperate; jurisdictions enable cross-border censorship.

Motivations: moral, military, political, religious, corporate. Who decides: individuals (self-censorship), corporations (ISPs, platforms), state-level actors.

### Detection vs. blocking

| Detection | Blocking |
| --- | --- |
| observing the destination IP | IP null routing |
| analysing the SNI | TCP RST injection |
| inspecting DNS query contents | DNS response injection |
| proxy protocol signatures | HTTP redirect injection |
| filtering plaintext keywords | packet dropping |

### TCP RST injection

Normal flow: SYN → SYN-ACK → ACK → data (+ ACKs).

A legitimate **RST** terminates a connection immediately and frees resources. In the attack, the censor monitors the traffic and injects a **forged RST**. The connection breaks; subsequent data are dropped. The censor only has to recognise the flow, not understand the content.

### Further techniques

- **Network/routing:** DoS against destination servers, BGP hijacking, network disconnection.
- **Special software:** TomSkype (China-modified Skype), GreenDam (filtering software).
- **Service providers:** search engine indexing (removing sites from the index), deplatforming.
- **XSS for censorship:** injected scripts modify or block content at the browser level, targeted per user/group and harder to detect than network blocking. Examples: Tunisia 2011 (credentials injected for Gmail/Yahoo/Facebook), Comcast 2014 (ads in Xfinity WiFi traffic).
- **URL filtering:** the most common method worldwide; at ISP level (blacklists), in companies/schools/libraries, often combined with DNS tampering or TLS interception. Bypass: VPN, Tor, DoH.

### Censorship measurement

- **Large-scale studies:** inspect packet traffic, detect DNS tampering, IP blacklisting and keyword filtering.
- **Longitudinal:** censorship evolves with circumvention tools.
- **Tools:** OONI (Open Observatory of Network Interference), censorship analyser (IP filters, DNS poisoning, DPI).

### Great Firewall of China

Purpose: large-scale censorship and surveillance. Mechanisms:

- blocking of websites/content (social media, news)
- keyword filtering
- IP blocking and **overblocking**
- traffic analysis and manipulation (e.g. forged IPs)
- targets: foreign sites, politically sensitive content, encrypted traffic (Tor/VPNs)

**Overblocking:** the rule [[*torproject.org]] also blocks [[theventilatorproject.org]] and [[mentorproject.org]] because they match the suffix.

**Geoblocking:** the view from outside and from inside differ.

**Forged IPs:** the GFW injects forged IP addresses, but inconsistently. Those who recognise the patterns can bypass it with a high success rate (research: 99 %).

**Cat and mouse:** censorship and circumvention co-evolve. On the censorship side: DNS hijacking, keyword filtering, static IP blocking, TOM-Skype, active probing, anti-VPN, machine learning, Great Cannon. On the circumvention side: OpenVPN, Freegate, Tor, Psiphon, Tor bridges, obfuscated protocols, Astrill.

### Domain fronting

Idea: the client connects to an **allowed front domain** that is hosted on the same CDN as the actually forbidden target. DNS and the TLS handshake (SNI) show the allowed domain; the encrypted HTTP request contains [[Host: forbidden.example]].

Requirement: front and target domain are on the same CDN. In 2023, 22 of 30 CDNs still allowed domain fronting; Google stopped it in 2018.

**ECH (Encrypted Client Hello)** encrypts the SNI so that network observers no longer see the hostname in the TLS handshake.

### Fully Encrypted Protocols (FEPs)

FEPs encrypt **all** data end to end and **obfuscate** the protocol. Examples: obfs4, meek (over cloud services), Shadowsocks (SOCKS5 proxy).

Effect: the censor cannot distinguish legitimate from disguised traffic. Then it can only block **everything** or allow **everything** — and overblocking is expensive. Keyword and pattern matching come to nothing.

Limit: FEPs hide the content and the protocol fingerprint, but **not traffic volume and timing**.`
    },

    /* ---------------- cards ---------------- */
    { id: "u3-card-fp-def", type: "card", lecture: 3, topic: "fingerprinting", origin: "slides",
      source: "Lecture III, slide 5", difficulty: 1,
      front: R`Define fingerprinting (Eckersley, 2010).`,
      back: R`The collection of information about a device, browser or connection in order to create a unique identifier — tracking or identification **without cookies**.` },
    { id: "u3-card-identifies", type: "card", lecture: 3, topic: "fingerprinting", origin: "slides",
      source: "Lecture III, slide 7", difficulty: 1,
      front: R`Name six features that form a device fingerprint.`,
      back: R`Geolocation, clock skew, battery status, audio settings, screen resolution, installed fonts, OS, browser language — at least six of these.` },
    { id: "u3-card-why-possible", type: "card", lecture: 3, topic: "fingerprinting", origin: "slides",
      source: "Lecture III, slide 8", difficulty: 2,
      front: R`Why is fingerprinting possible? Name the three reasons given in the lecture.`,
      back: R`Device/browser diversity, technical information leak (JS, HTML5, WebRTC) and legal/regulatory gaps (no consent required, no global regulation).` },
    { id: "u3-card-canvas", type: "card", lecture: 3, topic: "fingerprinting", origin: "slides",
      source: "Lecture III, slides 10–14", difficulty: 2,
      front: R`How does canvas fingerprinting work?`,
      back: R`JavaScript draws text/an image onto an HTML5 [[<canvas>]]. The pixels are read out and hashed (e.g. SHA-256). Rendering differences due to OS, browser, GPU, fonts and anti-aliasing produce a different hash per device.` },
    { id: "u3-card-canvas-why", type: "card", lecture: 3, topic: "fingerprinting", origin: "slides",
      source: "Lecture III, slide 11", difficulty: 2,
      front: R`Why is canvas fingerprinting harder to block than cookies?`,
      back: R`**No state is stored on the device**. There is nothing that could be deleted like a cookie; the fingerprint is recomputed on every visit.` },
    { id: "u3-card-hsts", type: "card", lecture: 3, topic: "fingerprinting", origin: "slides",
      source: "Lecture III, slides 17–21", difficulty: 2,
      front: R`How does HSTS fingerprinting work?`,
      back: R`The tracker creates HSTS entries for many subdomains. Later it requests [[http://id-N…]]; the browser upgrades to HTTPS exactly when HSTS is cached. Each subdomain yields one bit; the cache survives cookie deletion.` },
    { id: "u3-card-hsts-bits", type: "card", lecture: 3, topic: "fingerprinting", origin: "slides",
      source: "Lecture III, slide 18", difficulty: 2,
      front: R`How many combinations do 32 HSTS subdomains yield?`,
      back: R`$2^{32} \approx 4.29$ billion — enough for a practically unique supercookie.` },
    { id: "u3-card-entropy", type: "card", lecture: 3, topic: "fingerprinting", origin: "exercise",
      source: "Exercise sheet 1, Preliminaries", difficulty: 2,
      front: R`Define the surprisal and the entropy of a fingerprint.`,
      back: R`$I(x) = -\log_2 p(x)$ bits; $H(X) = -\sum_x p(x)\log_2 p(x)$. A value with surprisal $I$ is shared by a fraction $2^{-I}$ of the population.` },
    { id: "u3-card-entropy-bound", type: "card", lecture: 3, topic: "fingerprinting", origin: "exercise",
      source: "Exercise sheet 1, Preliminaries", difficulty: 2,
      front: R`Why does no fingerprint carry more than $\log_2 N$ bits when $N$ browsers exist?`,
      back: R`$\log_2 N$ bits already make every browser unique. A feature measurable on the browser cannot deliver more entropy than that.` },
    { id: "u3-card-blockers", type: "card", lecture: 3, topic: "fp-defense", origin: "slides",
      source: "Lecture III, slides 23–26", difficulty: 2,
      front: R`Do browser extensions block fingerprinting completely?`,
      back: R`No. Studies show a strong reduction of canvas, font and WebRTC tracking, but **none blocks everything**. “All Combined” is best.` },
    { id: "u3-card-paradox", type: "card", lecture: 3, topic: "fp-defense", origin: "slides",
      source: "Lecture III, slide 27", difficulty: 2,
      front: R`What is the paradox of fingerprintable PETs?`,
      back: R`Some anti-fingerprinting techniques are self-defeating if too few people use them: the PET itself then makes you more distinguishable. This applies to some techniques, not to others.` },
    { id: "u3-card-censorship-def", type: "card", lecture: 3, topic: "censorship", origin: "slides",
      source: "Lecture III, slide 35", difficulty: 1,
      front: R`Define censorship (Siebert, 1952).`,
      back: R`Suppression or prohibition of speech, communication or information that authorities or institutions regard as harmful, sensitive or inconvenient.` },
    { id: "u3-card-detection-blocking", type: "card", lecture: 3, topic: "censorship", origin: "slides",
      source: "Lecture III, slide 42", difficulty: 2,
      front: R`Name three detection and three blocking methods each.`,
      back: R`**Detection:** destination IP, SNI, DNS query contents, proxy signatures, plaintext keywords. **Blocking:** IP null routing, TCP RST injection, DNS response injection, HTTP redirect injection, packet dropping.` },
    { id: "u3-card-rst", type: "card", lecture: 3, topic: "censorship", origin: "slides",
      source: "Lecture III, slides 43–45", difficulty: 2,
      front: R`How does TCP RST injection work?`,
      back: R`The censor monitors the traffic and injects a forged RST packet. The connection breaks immediately; subsequent data are dropped. The censor only has to recognise the flow.` },
    { id: "u3-card-gfw", type: "card", lecture: 3, topic: "censorship", origin: "slides",
      source: "Lecture III, slides 56–60", difficulty: 2,
      front: R`Name four mechanisms of the Great Firewall.`,
      back: R`Blocking of websites/content, keyword filtering, IP blocking and overblocking, traffic analysis/manipulation (forged IPs), anti-VPN/active probing.` },
    { id: "u3-card-overblocking", type: "card", lecture: 3, topic: "censorship", origin: "slides",
      source: "Lecture III, slide 58", difficulty: 1,
      front: R`Why does the rule [[*torproject.org]] also block [[mentorproject.org]]?`,
      back: R`Because it matches the suffix (suffix match). Such overblocking rules hit uninvolved domains.` },
    { id: "u3-card-domain-fronting", type: "card", lecture: 3, topic: "circumvention", origin: "slides",
      source: "Lecture III, slides 63–66", difficulty: 2,
      front: R`How does domain fronting work?`,
      back: R`DNS and the TLS SNI show an allowed front domain that is hosted on the same CDN as the target. The encrypted HTTP request contains [[Host: forbidden.example]]. The censor sees only the allowed domain.` },
    { id: "u3-card-ech", type: "card", lecture: 3, topic: "circumvention", origin: "slides",
      source: "Lecture III, slide 64", difficulty: 2,
      front: R`What does Encrypted Client Hello (ECH) change?`,
      back: R`ECH encrypts the SNI. Network observers no longer see the hostname in the TLS handshake; domain fronting becomes less necessary as a result, but metadata remain partly visible.` },
    { id: "u3-card-fep", type: "card", lecture: 3, topic: "circumvention", origin: "slides",
      source: "Lecture III, slides 67–69", difficulty: 2,
      front: R`Why are Fully Encrypted Protocols (FEPs) effective against censorship?`,
      back: R`They encrypt and obfuscate the entire traffic so that the censor cannot distinguish legitimate from disguised traffic. It would have to block everything or allow everything; pattern matching fails.` },
    { id: "u3-card-fep-limit", type: "card", lecture: 3, topic: "circumvention", origin: "variant",
      source: "Variant of Lecture III, slides 67–69", difficulty: 2,
      front: R`What do FEPs such as obfs4 **not** hide?`,
      back: R`Traffic volume and timing. They hide the content and the protocol fingerprint, but an observer can still analyse volumes and timing patterns.` },

    /* ---------------- true / false ---------------- */
    { id: "u3-tf-cookies", type: "tf", lecture: 3, topic: "fingerprinting", origin: "slides",
      source: "Lecture III, slide 7", difficulty: 1,
      statement: R`Fingerprinting can track users even when the IP address and cookies have been deleted.`,
      answer: true,
      explanation: R`The fingerprint is based on system properties such as fonts, resolution and GPU and persists without stored state.` },
    { id: "u3-tf-canvas-no-state", type: "tf", lecture: 3, topic: "fingerprinting", origin: "slides",
      source: "Lecture III, slide 11", difficulty: 1,
      statement: R`Canvas fingerprinting stores an identifier permanently on the device.`,
      answer: false,
      explanation: R`No state is stored; the fingerprint is recomputed from the rendered pixels on every visit. That is exactly what makes it harder to block.` },
    { id: "u3-tf-canvas-same", type: "tf", lecture: 3, topic: "fingerprinting", origin: "variant",
      source: "Variant of Lecture III, slides 14–16", difficulty: 2,
      statement: R`Two devices with an identical browser version are guaranteed to produce the same hash for the same canvas code.`,
      answer: false,
      explanation: R`GPU, drivers, OS, fonts, anti-aliasing and font smoothing can change the pixels. That is why the hashes are often different.` },
    { id: "u3-tf-hsts", type: "tf", lecture: 3, topic: "fingerprinting", origin: "slides",
      source: "Lecture III, slides 17–21", difficulty: 2,
      statement: R`HSTS fingerprinting exploits the fact that the browser keeps cached HSTS entries even after cookies are deleted.`,
      answer: true,
      explanation: R`The HSTS cache persists; the HTTP→HTTPS upgrade per subdomain yields one bit.` },
    { id: "u3-tf-hsts-count", type: "tf", lecture: 3, topic: "fingerprinting", origin: "slides",
      source: "Lecture III, slide 18", difficulty: 2,
      statement: R`With 32 HSTS subdomains, more than 4 billion different fingerprints can be formed.`,
      answer: true,
      explanation: R`$2^{32} \approx 4.29 \cdot 10^9$.` },
    { id: "u3-tf-entropy-uniform", type: "tf", lecture: 3, topic: "fingerprinting", origin: "exercise",
      source: "Exercise sheet 1, Preliminaries", difficulty: 2,
      statement: R`For $k$ possible values, the entropy is maximal exactly when the distribution is uniform.`,
      answer: true,
      explanation: R`The maximum entropy is $\log_2 k$ and is attained exactly under uniformity.` },
    { id: "u3-tf-entropy-independent", type: "tf", lecture: 3, topic: "fingerprinting", origin: "exercise",
      source: "Exercise sheet 1, Preliminaries", difficulty: 2,
      statement: R`For arbitrary random variables $X$ and $Y$, $H(X,Y) = H(X) + H(Y)$ always holds.`,
      answer: false,
      explanation: R`That holds only under independence. Under correlation $H(X,Y) < H(X) + H(Y)$; for example, OS and installed fonts are correlated.` },
    { id: "u3-tf-blocker-all", type: "tf", lecture: 3, topic: "fp-defense", origin: "slides",
      source: "Lecture III, slide 26", difficulty: 1,
      statement: R`A single ad blocker blocks all fingerprinting services.`,
      answer: false,
      explanation: R`The study shows a strong reduction, but none blocks everything; combining several tools is best.` },
    { id: "u3-tf-paradox", type: "tf", lecture: 3, topic: "fp-defense", origin: "slides",
      source: "Lecture III, slide 27", difficulty: 2,
      statement: R`The paradox of fingerprintable PETs states that an anti-fingerprinting tool can itself become a fingerprint if too few people use it.`,
      answer: true,
      explanation: R`That is exactly the point: some techniques are self-defeating when their user base is too small.` },
    { id: "u3-tf-rst", type: "tf", lecture: 3, topic: "censorship", origin: "slides",
      source: "Lecture III, slides 44–45", difficulty: 2,
      statement: R`In a TCP RST injection attack, the censor has to decrypt the content of the connection in order to terminate it.`,
      answer: false,
      explanation: R`It only has to recognise the flow and inject a forged RST; the content is irrelevant for that.` },
    { id: "u3-tf-overblocking", type: "tf", lecture: 3, topic: "censorship", origin: "slides",
      source: "Lecture III, slide 58", difficulty: 1,
      statement: R`Overblocking through suffix matching can hit domains that share only a suffix with the forbidden name.`,
      answer: true,
      explanation: R`[[*torproject.org]] also hits [[theventilatorproject.org]] and [[mentorproject.org]].` },
    { id: "u3-tf-fronting-requirement", type: "tf", lecture: 3, topic: "circumvention", origin: "slides",
      source: "Lecture III, slide 63", difficulty: 2,
      statement: R`Domain fronting only works if the front and target domains are hosted on the same CDN.`,
      answer: true,
      explanation: R`The CDN must serve both domains so that DNS and SNI can point to the front while the Host header names the target.` },
    { id: "u3-tf-ech", type: "tf", lecture: 3, topic: "circumvention", origin: "slides",
      source: "Lecture III, slide 64", difficulty: 2,
      statement: R`Encrypted Client Hello encrypts the SNI and thereby hides the hostname in the TLS handshake.`,
      answer: true,
      explanation: R`ECH protects the SNI; this also changes the role of domain fronting.` },
    { id: "u3-tf-fep-volume", type: "tf", lecture: 3, topic: "circumvention", origin: "variant",
      source: "Variant of Lecture III, slides 67–69", difficulty: 2,
      statement: R`FEPs such as obfs4 also hide traffic volume and timing completely.`,
      answer: false,
      explanation: R`They hide the content and the protocol fingerprint, but volume and timing remain observable.` },

    /* ---------------- multiple choice ---------------- */
    { id: "u3-mc-fp-def", type: "mc", lecture: 3, topic: "fingerprinting", origin: "slides",
      source: "Lecture III, slide 5", difficulty: 1,
      question: R`What is fingerprinting?`,
      options: [
        R`Storing a cookie on the user's device.`,
        R`Collecting device, browser or connection information in order to form an identifier without cookies.`,
        R`Encrypting DNS queries.`,
        R`Blocking advertising on a website.`
      ],
      correct: 1,
      explanation: R`Fingerprinting creates an identifier from features of the system — without cookies.` },
    { id: "u3-mc-canvas-hash", type: "mc", lecture: 3, topic: "fingerprinting", origin: "slides",
      source: "Lecture III, slide 14", difficulty: 2,
      question: R`Why do two devices with the same canvas code produce different hashes?`,
      options: [
        R`Because the hash is chosen at random.`,
        R`Because OS, GPU, drivers, fonts and anti-aliasing change the rendering minimally.`,
        R`Because the browser rewrites the canvas code every time.`,
        R`Because SHA-256 is implemented differently on every device.`
      ],
      correct: 1,
      explanation: R`The pixels differ because of the rendering; the hash turns them into a stable fingerprint.` },
    { id: "u3-mc-hsts-bit", type: "mc", lecture: 3, topic: "fingerprinting", origin: "variant",
      source: "Variant of Lecture III, slides 20–21", difficulty: 2,
      question: R`How does an HSTS fingerprint read out one bit?`,
      options: [
        R`It queries [[navigator.cookieEnabled]].`,
        R`It requests [[http://id-N…]] and observes whether the browser upgrades to HTTPS.`,
        R`It reads the size of the browser cache.`,
        R`It sends a TCP RST to the subdomain.`
      ],
      correct: 1,
      explanation: R`The HTTP→HTTPS upgrade shows whether HSTS is cached for that subdomain.` },
    { id: "u3-mc-entropy", type: "mc", lecture: 3, topic: "fingerprinting", origin: "exercise",
      source: "Exercise sheet 1, Preliminaries (example)", difficulty: 2,
      question: R`Four values have probabilities $\tfrac12, \tfrac14, \tfrac18, \tfrac18$. What is the entropy?`,
      options: [R`$1.5$ bits`, R`$1.75$ bits`, R`$2$ bits`, R`$3$ bits`],
      correct: 1,
      explanation: R`$H = \tfrac12 \cdot 1 + \tfrac14 \cdot 2 + \tfrac18 \cdot 3 + \tfrac18 \cdot 3 = 1.75$ bits.` },
    { id: "u3-mc-entropy-bound", type: "mc", lecture: 3, topic: "fingerprinting", origin: "exercise",
      source: "Exercise sheet 1, Problem 2", difficulty: 2,
      question: R`The four attributes have individual entropies $10$, $4.83$, $3.04$ and $13.9$ bits. What follows for $N = 470161$?`,
      options: [
        R`The sum is smaller than $\log_2 N$; the attributes are independent.`,
        R`The sum is larger than $\log_2 N \approx 18.84$; at least two attributes must be correlated.`,
        R`The sum is exactly $\log_2 N$; every browser is unique.`,
        R`The entropy of the combination is always the maximum of the individual entropies.`
      ],
      correct: 1,
      explanation: R`$10 + 4.83 + 3.04 + 13.9 = 31.77 > 18.84$. A measurable fingerprint cannot deliver more than $\log_2 N$ bits; the independence assumption is violated.` },
    { id: "u3-mc-paradox", type: "mc", lecture: 3, topic: "fp-defense", origin: "slides",
      source: "Lecture III, slide 27", difficulty: 2,
      question: R`What does the paradox of fingerprintable PETs state?`,
      options: [
        R`PETs are always ineffective.`,
        R`An anti-fingerprinting tool can itself become a fingerprint if too few people use it.`,
        R`Fingerprinting is only possible with cookies.`,
        R`Every extension automatically increases anonymity.`
      ],
      correct: 1,
      explanation: R`The rarity of the technique can shrink the anonymity set; the PET becomes self-defeating.` },
    { id: "u3-mc-censorship-def", type: "mc", lecture: 3, topic: "censorship", origin: "slides",
      source: "Lecture III, slide 35", difficulty: 1,
      question: R`What is censorship according to Siebert (1952)?`,
      options: [
        R`Encrypting communication.`,
        R`The suppression or prohibition of speech, communication or information by authorities.`,
        R`Circumventing filters.`,
        R`Blocking advertising.`
      ],
      correct: 1,
      explanation: R`The definition emphasises suppression by authorities or institutions.` },
    { id: "u3-mc-rst", type: "mc", lecture: 3, topic: "censorship", origin: "variant",
      source: "Variant of Lecture III, slides 43–45", difficulty: 2,
      question: R`What happens in a TCP RST injection?`,
      options: [
        R`The censor decrypts the TLS traffic.`,
        R`A forged RST packet terminates the connection; further data are dropped.`,
        R`The DNS resolver returns a wrong IP.`,
        R`The browser is redirected to an HTTPS page.`
      ],
      correct: 1,
      explanation: R`RST terminates the connection immediately. DNS response injection and HTTP redirect injection are different techniques.` },
    { id: "u3-mc-gfw-overblock", type: "mc", lecture: 3, topic: "censorship", origin: "slides",
      source: "Lecture III, slide 58", difficulty: 1,
      question: R`Why does the GFW rule [[*torproject.org]] also block [[mentorproject.org]]?`,
      options: [
        R`Because the domains share the same server.`,
        R`Because the rule matches the suffix and thereby causes overblocking.`,
        R`Because [[mentorproject.org]] is a Tor relay.`,
        R`Because DNS always blocks all subdomains.`
      ],
      correct: 1,
      explanation: R`The suffix match is the cause of the overblocking.` },
    { id: "u3-mc-domain-fronting", type: "mc", lecture: 3, topic: "circumvention", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(viii)", difficulty: 1,
      question: R`How does domain fronting circumvent censorship mechanisms?`,
      options: [
        R`By changing the source IP address during packet transmission.`,
        R`By routing requests through allowed domains and hiding the target domain in the HTTP header.`,
        R`By encrypting all DNS queries and responses.`,
        R`By spoofing the TLS handshake to look like a trusted domain.`
      ],
      correct: 1,
      explanation: R`The official solution is (b): the SNI shows the allowed front, the Host header the target.` },
    { id: "u3-mc-fep", type: "mc", lecture: 3, topic: "circumvention", origin: "slides",
      source: "Lecture III, slides 67–69", difficulty: 2,
      question: R`Which statement about FEPs is correct?`,
      options: [
        R`FEPs encrypt only the content, not the protocol.`,
        R`FEPs encrypt and obfuscate the traffic so that the censor can only block everything or nothing.`,
        R`FEPs make traffic volume and timing invisible.`,
        R`FEPs are identical to domain fronting.`
      ],
      correct: 1,
      explanation: R`FEPs hide the content and the protocol fingerprint; volume and timing remain visible.` },
    { id: "u3-mc-https-sni", type: "mc", lecture: 3, topic: "censorship", origin: "variant",
      source: "Variant of Lecture II, slide 45; Lecture III, slide 42", difficulty: 2,
      question: R`Why can a censor filter HTTPS connections based on the SNI?`,
      options: [
        R`Because HTTPS encrypts the SNI together with the content.`,
        R`Because the SNI is visible in the initial TLS handshake.`,
        R`Because TLS does not use encryption.`,
        R`Because the browser stores the hostname in a cookie.`
      ],
      correct: 1,
      explanation: R`The SNI is in the initial handshake and visible to DPI as long as ECH is not used.` },

    /* ---------------- gaps ---------------- */
    { id: "u3-gap-fingerprinting", type: "gap", lecture: 3, topic: "fingerprinting", origin: "slides",
      source: "Lecture III, slides 5–14", difficulty: 2,
      title: "Fingerprinting", points: 5,
      text: R`**Fingerprinting** is the collection of information about a device, browser or connection in order to create <gap>a unique identifier</gap> — without <gap>cookies</gap>. Canvas fingerprinting draws text or images onto an HTML5 [[<canvas>]], reads out <gap>the pixels/RGB values</gap> and <gap>hashes them</gap> (e.g. with SHA-256). It stores <gap>no state on the device</gap> and is therefore harder to block than cookies.`,
      note: R`Rendering differences due to OS, browser, GPU, fonts and anti-aliasing make the hash differ per device.` },
    { id: "u3-gap-hsts", type: "gap", lecture: 3, topic: "fingerprinting", origin: "slides",
      source: "Lecture III, slides 17–21", difficulty: 2,
      title: "HSTS fingerprinting", points: 4,
      text: R`In HSTS fingerprinting the tracker creates HSTS entries for many <gap>subdomains</gap>. On the next visit it requests <gap>http://id-N…</gap>; the browser upgrades to HTTPS exactly when <gap>HSTS is cached</gap>. That yields <gap>one bit per subdomain</gap>. The HSTS cache survives cookie deletion.`,
      note: R`32 subdomains yield $2^{32} \approx 4.29$ billion combinations.` },
    { id: "u3-gap-censorship", type: "gap", lecture: 3, topic: "censorship", origin: "slides",
      source: "Lecture III, slides 35–45", difficulty: 2,
      title: "Censorship and TCP RST", points: 4,
      text: R`**Censorship** is the <gap>suppression or prohibition</gap> of speech, communication or information by authorities. Censorship consists of <gap>detection</gap> and <gap>blocking</gap>. In a TCP RST injection the censor monitors the traffic and injects <gap>a forged RST packet</gap>, which terminates the connection immediately.`,
      note: R`The censor does not need to decrypt the content; it is enough to recognise the flow.` },
    { id: "u3-gap-entropy", type: "gap", lecture: 3, topic: "fingerprinting", origin: "exercise",
      source: "Exercise sheet 1, Preliminaries", difficulty: 2,
      title: "Surprisal and entropy", points: 4,
      text: R`The surprisal of a value $x$ is <gap>$I(x) = -\log_2 p(x)$</gap>. The entropy is <gap>$H(X) = -\sum_x p(x)\log_2 p(x)$</gap>. A value with surprisal $I$ is shared by a fraction <gap>$2^{-I}$</gap> of the population. For $N$ browsers the bound <gap>$H(X) \le \log_2 N$</gap> holds.`,
      note: R`Equality at $\log_2 k$ holds exactly for the uniform distribution; for independent attributes the entropies add up.` },

    /* ---------------- problems ---------------- */
    { id: "u3-prob-entropy", type: "problem", lecture: 3, topic: "fingerprinting", origin: "exercise",
      source: "Exercise sheet 1, Problem 2", difficulty: 3,
      title: "Fingerprint entropy: Panopticlick",
      statement: R`Eckersley's Panopticlick study collected fingerprints from $N = 470{,}161$ browsers. The measured entropies were:

| Attribute | Entropy $H$ (bits) |
| --- | ---: |
| User agent | 10.0 |
| Screen size and colour depth | 4.83 |
| Time zone | 3.04 |
| Installed fonts | 13.9 |`,
      parts: [
        { label: "a", points: 2,
          prompt: R`What fraction of browsers does a typical browser share its value with for each attribute? Use the interpretation via surprisal.`,
          hints: [R`A value with surprisal $I$ is shared by $2^{-I}$ of the population.`,
                  R`For a specific value $x$, the share is $p(x)=2^{-I(x)}$. The rule of thumb $2^{-H}$ describes the effective anonymity-set fraction, not the probability of the most likely value.`],
          solution: R`Effective anonymity-set fraction: $2^{-H}$. For a specific value, use $2^{-I(x)}$; the table below reports $2^{-H}$ as the rule-of-thumb anonymity set.

| Attribute | $H$ | $2^{-H}$ |
| --- | ---: | ---: |
| User agent | 10.0 | $2^{-10} \approx 0.001$ |
| Screen size and colour depth | 4.83 | $2^{-4.83} \approx 0.035$ |
| Time zone | 3.04 | $2^{-3.04} \approx 0.122$ |
| Installed fonts | 13.9 | $2^{-13.9} \approx 6.5 \cdot 10^{-5}$ |

The effective anonymity set is smallest for fonts (and the user agent); the time zone is the least distinguishing.`,
          rubric: [ { points: 1, text: R`Interpretation $2^{-H}$ used correctly` },
                    { points: 1, text: R`At least two values computed sensibly` } ] },
        { label: "b", points: 2,
          prompt: R`Compute the entropy of the combination under independence and compare it with $\log_2 N$.`,
          hints: [R`Add the four entropies.`,
                  R`Compute $\log_2(470161)$.`],
          solution: R`Under independence:
$$H = 10.0 + 4.83 + 3.04 + 13.9 = 31.77 \text{ bits}.$$
The bound is
$$\log_2 N = \log_2 470161 \approx 18.84 \text{ bits}.$$
The sum is therefore about $1.7$ times the theoretical upper bound. That cannot be right: a feature measurable on the browser cannot deliver more than $\log_2 N$ bits, because every browser would then be unique. The attributes are in reality **correlated** (e.g. OS and fonts), hence $H(X,Y) < H(X) + H(Y)$.`,
          rubric: [ { points: 1, text: R`Sum $31.77$ bits` },
                    { points: 1, text: R`Comparison with $\log_2 N \approx 18.84$ and conclusion of correlation` } ] },
        { label: "c", points: 3,
          prompt: R`Which two attributes should a browser normalise first, and what does this normalisation cost the user?`,
          hints: [R`Normalise the attributes with the highest entropy.`,
                  R`What happens when fonts or the user agent are made uniform?`],
          solution: R`First **installed fonts** (13.9 bits) and **user agent** (10.0 bits), because they carry the most entropy and thus identify most strongly.

Costs:
- **Fonts:** fewer fonts can change the layout, force web fonts or make texts harder to read; some applications expect particular fonts.
- **User agent:** websites may misidentify the browser, get wrong feature detection or refuse content.
- In general: normalisation reduces functionality and can itself create a rare pattern (paradox of fingerprintable PETs) if only few people use it.

The order is a trade-off: high entropy first, but every normalisation must actually enlarge the anonymity set.`,
          rubric: [ { points: 1, text: R`Fonts and user agent as first candidates` },
                    { points: 1, text: R`At least one concrete loss of functionality` },
                    { points: 1, text: R`Trade-off / paradox or anonymity set mentioned` } ] }
      ] },
    { id: "u3-prob-canvas", type: "problem", lecture: 3, topic: "fingerprinting", origin: "exercise",
      source: "Exercise sheet 1, Problem 3", difficulty: 2,
      title: "Canvas fingerprinting by hand",
      statement: "",
      parts: [
        { label: "a", points: 3,
          prompt: R`Explain why two machines with an identical browser version can still produce different canvas hashes.`,
          hints: [R`The browser does not draw itself, it delegates to the system.`,
                  R`Think of the GPU, drivers, font rendering and anti-aliasing.`],
          solution: R`The canvas code is the same, but the **rendering** runs through different systems: operating system, graphics card, drivers, installed fonts, font smoothing and anti-aliasing. These components set the pixels slightly differently. Reading out the RGB values therefore yields different byte sequences; the hash (e.g. SHA-256) turns them into different fingerprints. Even a graphics driver update can change the hash.`,
          rubric: [ { points: 1, text: R`Rendering pipeline (OS/GPU/drivers) as the cause` },
                    { points: 1, text: R`Fonts/anti-aliasing/font smoothing named` },
                    { points: 1, text: R`Pixels → hash as identifier explained` } ] },
        { label: "b", points: 3,
          prompt: R`Is randomly altering the canvas output per website a fingerprinting protection or a new fingerprint? Relate this to the paradox of fingerprintable PETs.`,
          hints: [R`What happens if only a few browsers randomise the output?`,
                  R`A random pattern can itself be rare.`],
          solution: R`It can be both. Randomisation destroys the **stable** canvas fingerprint across websites, because every site sees a different output. But:

- If only a few browsers randomise, the randomisation itself is a rare feature. A tracker can detect it and place the users in a small anonymity set.
- If many browsers use the same technique, the effect disappears in the crowd and the technique can be an effective protection.

This is exactly the **paradox of fingerprintable PETs**: a protection used too rarely makes you more distinguishable. Randomisation is therefore not an automatic protection; it must be shared by a large user base and must not be compensated by other features.`,
          rubric: [ { points: 1, text: R`Randomisation destroys the stable cross-site fingerprint` },
                    { points: 1, text: R`Rarity can itself become a fingerprint` },
                    { points: 1, text: R`Paradox correctly applied` } ] }
      ] },
    { id: "u3-prob-measurement", type: "problem", lecture: 3, topic: "censorship", origin: "exercise",
      source: "Exercise sheet 1, Problem 4", difficulty: 3,
      title: "Measuring censorship: distinguishing three causes",
      statement: R`A measurement platform reports that a domain is unreachable from one vantage point.`,
      parts: [
        { label: "a", points: 3,
          prompt: R`Name three different technical causes from the lecture — at least one at DNS level and one at TCP level.`,
          hints: [R`DNS tampering, IP blocking and RST injection are three candidates.`,
                  R`A fourth cause would be packet dropping or a BGP problem.`],
          solution: R`Examples:

1. **DNS level:** DNS response injection/tampering — the resolver returns a wrong IP or NXDOMAIN.
2. **IP level:** IP null routing/blackholing — the destination IP is unreachable although DNS is correct.
3. **TCP level:** TCP RST injection — the connection is established but terminated by a forged RST.
4. **DPI/keyword filtering:** packets are dropped based on SNI, Host or keywords.
5. **BGP hijacking/routing:** the traffic is redirected or sent into a void.`,
          rubric: [ { points: 1, text: R`DNS cause correct` },
                    { points: 1, text: R`TCP cause correct` },
                    { points: 1, text: R`Third cause correct and distinguishable from the others` } ] },
        { label: "b", points: 3,
          prompt: R`Describe an experiment for each cause that distinguishes it from the others.`,
          hints: [R`Compare DNS answers from a local and a trusted resolver.`,
                  R`Connect directly to the IP, with and without the correct SNI.`],
          solution: R`1. **DNS:** query the same domain via a local resolver and via a trusted resolver (e.g. via DoH from outside). Different answers (wrong IP, NXDOMAIN) indicate DNS tampering.
2. **IP:** use the correct IP directly (without DNS) and test [[ping]]/TCP connect. If the IP is unreachable although DNS was correct, that points to IP blocking/null routing.
3. **TCP/RST:** establish a TCP connection and observe whether an RST arrives after the handshake or data disappear. An RST directly after the SYN/ACK without a server-side cause is a strong signal.
4. **DPI/keyword:** vary the SNI and the Host header. If the connection is aborted with a forbidden SNI but not with a neutral SNI, DPI is at work.
5. **BGP:** compare [[traceroute]] from several vantage points. A deviating path through an unexpected AS suggests BGP hijacking.

Important: a single experiment is rarely enough; one combines several vantage points and repeats the measurement.`,
          rubric: [ { points: 1, text: R`DNS experiment (resolver comparison)` },
                    { points: 1, text: R`IP/TCP experiment (direct IP, RST observation)` },
                    { points: 1, text: R`At least one further experiment (SNI/Host, traceroute)` } ] }
      ] },
    { id: "u3-prob-fronting", type: "problem", lecture: 3, topic: "circumvention", origin: "exercise",
      source: "Exercise sheet 1, Problem 5", difficulty: 3,
      title: "Domain fronting with SNI and Host",
      statement: R`A client wants to reach [[forbidden.example]] through a CDN that also hosts [[allowed.example]].`,
      parts: [
        { label: "a", points: 3,
          prompt: R`Explain the flow with DNS, TLS SNI and HTTP Host. Which fields can a censor read, and which not?`,
          hints: [R`DNS and SNI lie outside the encrypted HTTP request.`,
                  R`The Host header lies inside TLS.`],
          solution: R`Flow:
1. The client resolves [[allowed.example]] via DNS and receives the IP of the CDN. The censor sees this DNS query and the IP.
2. The TLS handshake uses [[SNI: allowed.example]]. Without ECH the SNI is visible in plaintext.
3. Inside the encrypted HTTPS request there is [[Host: forbidden.example]]. The censor does not see it.

Readable for the censor: DNS (allowed.example), destination IP, SNI (allowed.example), timing and volume.
Not readable: the HTTP Host header and the content.

The mismatch between SNI and Host is exactly what domain fronting exploits. A censor that can compare SNI and Host would recognise the fronting connection — which is why ECH matters.`,
          rubric: [ { points: 1, text: R`DNS and SNI show the front domain` },
                    { points: 1, text: R`Host header is encrypted and shows the target` },
                    { points: 1, text: R`Readable/not readable correctly separated` } ] },
        { label: "b", points: 2,
          prompt: R`Why can the censor not simply block the entire CDN? And what does ECH change?`,
          hints: [R`The CDN hosts many legitimate services.`,
                  R`ECH encrypts the SNI.`],
          solution: R`The CDN hosts many legitimate services; a block would hit all of them (overblocking) and would be politically and economically expensive. The censor would therefore either have to allow the CDN or accept a large collateral damage.

**ECH** encrypts the inner SNI. The censor then no longer sees the true target hostname; an outer/cover SNI may remain visible. Domain fronting becomes less necessary as a result; however, destination IP, timing and volume remain visible, and the censor can try to detect or block ECH itself.`,
          rubric: [ { points: 1, text: R`Overblocking cost of blocking the CDN` },
                    { points: 1, text: R`ECH encrypts SNI; limits remain` } ] },
        { label: "c", points: 1,
          prompt: R`Name one condition that must hold for domain fronting to work at all.`,
          hints: [R`Where must front and target be located?`],
          solution: R`Front and target domain must be on the same CDN (or the CDN must serve both hosts), so that DNS/SNI can point to the front while the Host header names the target.`,
          rubric: [ { points: 1, text: R`Same CDN / both domains on the same CDN endpoint` } ] }
      ] },
    { id: "u3-prob-hsts", type: "problem", lecture: 3, topic: "fingerprinting", origin: "variant",
      source: "Variant of Lecture III, slides 17–21", difficulty: 2,
      title: "Constructing an HSTS supercookie",
      statement: "",
      parts: [
        { label: "a", points: 3,
          prompt: R`Describe how a tracker with $n$ subdomains builds an $n$-bit fingerprint and later reads it out.`,
          hints: [R`First visit: set HSTS for selected subdomains.`,
                  R`Second visit: observe the HTTP requests.`],
          solution: R`**Building:** the tracker chooses a secret bit pattern $b_1,\dots,b_n$. For every subdomain $i$ with $b_i = 1$ it sends an HTTPS response with [[Strict-Transport-Security: max-age=...]]. The browser then caches HSTS for that subdomain. For $b_i = 0$ it sets no HSTS header.

**Reading:** on a later visit the page requests [[http://id-i.tracker-domain.de]] for all $i$. If HSTS is cached, the browser upgrades to HTTPS; otherwise the connection stays HTTP. The tracker observes the upgrade and reconstructs $b_i$. With $n = 32$ there are $2^{32}$ possible values.

The cache survives cookie deletion because HSTS is separate browser state.`,
          rubric: [ { points: 1, text: R`Setting the HSTS entries per subdomain` },
                    { points: 1, text: R`Reading via the HTTP→HTTPS upgrade` },
                    { points: 1, text: R`Bit pattern / 2^n combinations` } ] },
        { label: "b", points: 2,
          prompt: R`Why is this particularly persistent tracking, and what countermeasure remains?`,
          hints: [R`What happens when cookies are deleted?`,
                  R`HSTS is a security feature; can it simply be switched off?`],
          solution: R`HSTS lives outside the cookie store and survives clearing cookies and normal browser restarts until its max-age expires. Any website can query the subdomains, so the identifier is usable cross-site. Private/incognito behaviour is browser-dependent and is not a reliable part of this claim.

Countermeasures: delete the HSTS cache when closing the browser or via the settings (depending on the browser), use privacy browsers with HSTS storage isolated per container/site, or make HSTS fingerprinting harder for the browser. Switching HSTS off across the board is not a good solution, because HSTS protects against downgrade/stripping attacks.`,
          rubric: [ { points: 1, text: R`Survives cookie deletion / is cross-site` },
                    { points: 1, text: R`Countermeasure without switching HSTS off completely` } ] }
      ] },
    { id: "u3-prob-fep", type: "problem", lecture: 3, topic: "circumvention", origin: "variant",
      source: "Variant of Lecture III, slides 67–69", difficulty: 2,
      title: "FEPs against censorship",
      statement: "",
      parts: [
        { label: "a", points: 2,
          prompt: R`Explain why a censor faces the dilemma of “block everything or allow everything” with an FEP.`,
          hints: [R`The censor cannot distinguish legitimate from disguised traffic.`,
                  R`What does overblocking cost?`],
          solution: R`An FEP encrypts and obfuscates the traffic so that, to the censor, it looks like other, legitimate data. The censor cannot tell which connection belongs to the forbidden service. If it blocks all similar connections, it hits many legitimate services (overblocking); if it allows them, it also lets the FEP through. Because overblocking is so expensive, it has an incentive to allow rather than block.`,
          rubric: [ { points: 1, text: R`Legitimate/disguised indistinguishable` },
                    { points: 1, text: R`Overblocking cost as the reason for “rather allow”` } ] },
        { label: "b", points: 2,
          prompt: R`Name two limits of FEPs and, for each, one observation a censor can still make.`,
          hints: [R`Volume and timing remain visible.`,
                  R`The destination IP can also remain visible.`],
          solution: R`Limits:
1. **Traffic volume and timing** remain visible; a censor can recognise patterns (e.g. large uploads at certain times).
2. **Destination IP and reachability** remain partly visible; the censor can block the endpoint even without understanding the protocol.
3. **Active probing:** the censor can contact the endpoint itself and try to recognise the FEP.
4. **Metadata** such as connection duration and packet sizes may be classifiable.

An FEP is therefore not an invisibility spell but increases the cost and uncertainty for the censor.`,
          rubric: [ { points: 1, text: R`Two concrete limits` },
                    { points: 1, text: R`One suitable observation for each` } ] }
      ] }
  );
})();
