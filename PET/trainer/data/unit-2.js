/* Unit 2 — The Internet and privacy on the web
 * Sources: Lecture II (Internet and Privacy in the Web).
 */
(function () {
  const R = String.raw;
  const add = (...items) => (window.TRAINER_BANK = window.TRAINER_BANK || []).push(...items);

  add(
    /* ---------------- notes ---------------- */
    { id: "u2-note-internet", type: "note", lecture: 2, topic: "internet", origin: "slides",
      source: "Lecture II, slides 22–38", difficulty: 1,
      title: "How the Internet works — the infrastructure behind the web",
      order: 10,
      body: R`### Topology

A fully meshed network does not scale: the lecture describes $n$ computers as needing on the order of $n^2$ connections (exactly $n(n-1)/2$ undirected links). That is why there are intermediate stations:

| Component | Task |
| --- | --- |
| Router | forwards data between networks, reduces direct connections, optimises paths |
| Server | centralises resources and storage, serves many devices |
| ISP | connects local networks (households, companies) to the Internet |
| Network Service Provider / Backbone | connects ISPs and large networks; submarine cables and satellites |

### Message delivery

- **Redundant:** multiple paths, no single points of failure.
- **Dynamic routing:** paths change with network load; the route is not predictable.
- **No privacy:** intermediaries see the traffic. That is the design price for scalability.

### IP addresses

Every device needs an address so that it can be addressed.

- **IPv4:** 32 bits, e.g. [[192.168.1.1]].
- **IPv6:** 128 bits, e.g. [[2001:0db8::1]].

[[traceroute]] makes the path visible: every hop is a router with its own IP.

### DNS — the telephone book

DNS translates domain names ([[example.com]]) into IP addresses ([[93.184.215.14]]).

Flow: the user types a domain → the DNS server returns the IP → the browser contacts the server via the IP.

Hierarchy:

1. **Root servers**
2. **TLD servers** ([[.com]], [[.org]], [[.edu]], [[.at]])
3. **authoritative servers**

[[host tuwien.at]] shows an A record ([[128.130.35.76]]) and MX records (mail servers with priority 10/20).

### HTTP

HTTP is the HyperText Transfer Protocol. It transports data between web server and client and runs over TCP/IP.

- Request methods: [[GET]], [[POST]], [[PUT]], [[DELETE]].
- Response: status code plus content.

Example:

~~~text
> GET / HTTP/1.1
> Host: tuwien.at
> User-Agent: curl/8.7.1
> Accept: */*

< HTTP/1.1 301 Moved Permanently
< location: https://tuwien.at/
~~~

HTTP is **unencrypted**. Intermediaries see the request, the headers and the content. The 301 to HTTPS is the usual first step towards securing it.

### E-mail: SMTP, IMAP, POP3

| Protocol | Task |
| --- | --- |
| SMTP | send from client to mail server; deliver from mail server to mail server |
| IMAP | read and manage mails directly on the server |
| POP3 | download mails, typically deleting them on the server |

SMTP is a line-based protocol ([[HELO]], [[MAIL FROM]], [[RCPT TO]], [[DATA]], [[.]]). Via [[telnet mail.example.com 25]] it is visible in plaintext.

**Important:** TLS/SSL protects only the transport between client and server. The mail servers can still read the content. End-to-end encryption is therefore **not** provided.

### Internet vs. web

- **Internet:** global network of connected computers, infrastructure for data exchange (e-mail, games, …).
- **Web:** a service on the Internet, accesses websites via HTTP/HTTPS.

In short: the Internet is the infrastructure, the web is a service on top of it.`
    },
    { id: "u2-note-tracking", type: "note", lecture: 2, topic: "web-tracking", origin: "slides",
      source: "Lecture II, slides 40–47", difficulty: 2,
      title: "Who sees what? DNS tracking, HTTPS leaks and rerouting",
      order: 20,
      body: R`### Three observers with different views

| Observer | What they see |
| --- | --- |
| ISP | via DNS the domains visited; with HTTP also the content |
| Website | which content a particular user retrieves (cookie, login) |
| Ad networks / social media | content across many websites (cookies, fingerprints) |

### DNS tracking

DNS is a plaintext protocol over **UDP port 53**. Requests are visible:

- in the same WLAN,
- at the ISP,
- in transit.

**DNS hijacking** is used for censorship, ad injection and attacks.

Even a third-party DNS provider (e.g. [[8.8.8.8]]) helps only to a limited extent: deep packet inspection and the **recursive resolver** still see the queries.

### Network leaks with HTTP and HTTPS

**HTTP (unencrypted):**

- the requested website and the complete page content,
- including auth tokens,
- trivial to monitor with transparent HTTP proxies.

**HTTPS:**

- the content is protected,
- but the **hostname leaks in the initial TLS handshake (SNI, unless ECH is used)**,
- DPI can therefore monitor and censor HTTPS,
- **metadata** (destination server, data volume, timing) remain visible.

### Rerouting attacks (BGP)

The decentralised architecture allows several paths. **BGP** (Border Gateway Protocol) lets ISPs dynamically choose the “best” path — and therefore also a wrong one.

Even HTTPS exposes metadata: destination server and data volume.

| Example | Year | Incident |
| --- | --- | --- |
| China reroute | 2010 | a Chinese ISP routed global traffic through China |
| Amazon Route 53 hijack | 2018 | a BGP hijack redirected DNS traffic; cryptocurrency was stolen |
| Google traffic hijack | 2018 | a BGP leak routed Google traffic through China and Russia |

### What a VPN changes

A VPN encrypts traffic up to the VPN provider. The local ISP then sees only the connection to the VPN. **The VPN provider** instead sees the destination and the volume; with HTTPS the content stays protected, the metadata does not. A VPN is therefore a shift of trust, not anonymity as such.`
    },
    { id: "u2-note-encrypted", type: "note", lecture: 2, topic: "web-tracking", origin: "slides",
      source: "Lecture II, slides 43–44, 48–50", difficulty: 2,
      title: "Encrypted DNS and encrypted e-mail",
      order: 30,
      body: R`### DoT and DoH

| | DoT (DNS over TLS, 2016) | DoH (DNS over HTTPS, 2018) |
| --- | --- | --- |
| Transport | DNS wrapped in TLS | DNS as HTTPS |
| Port | tcp/853 | HTTPS (443) |
| Visibility | the dedicated port is easy to block/detect | not distinguishable by port, but the DoH endpoint can still be identified and blocked by IP, domain or SNI |
| Support | Android ≥ 9, iOS ≥ 14, Windows 10, systemd | major browsers and many mobile apps |

**Remaining problems (both):**

- The **recursive resolver** still sees all queries.
- A malicious DNS provider is just as bad as the ISP.
- Encrypted DNS does not hide which IP address you contact afterwards.

### Encrypted e-mail

Why:

- **Confidentiality:** content cannot be read along the way.
- **Integrity:** no modification in transit.
- **Authentication:** no spoofing of the sender.

Standards:

| Standard | Basis |
| --- | --- |
| PGP/GPG | public-key cryptography for encrypting and signing |
| S/MIME | digital certificates for encrypting and signing |

### Why usability is poor

- **Complex setup:** generate, share and manage keys or certificates.
- **Compatibility:** not every client supports PGP/S/MIME natively.
- **Key management:** a lost private key means no access; secure distribution is difficult.
- **Lack of user knowledge:** leads to misuse or circumvention.

### The decisive distinction

**Transport encryption** (TLS between client and mail server) protects the link. **End-to-end encryption** (PGP/S/MIME) protects the content also from the mail servers. One does not replace the other.`
    },

    /* ---------------- cards ---------------- */
    { id: "u2-card-ip", type: "card", lecture: 2, topic: "internet", origin: "slides",
      source: "Lecture II, slide 27", difficulty: 1,
      front: R`How long are IPv4 and IPv6 addresses?`,
      back: R`IPv4: **32 bits** (e.g. [[192.168.1.1]]). IPv6: **128 bits** (e.g. [[2001:0db8::1]]).` },
    { id: "u2-card-dns", type: "card", lecture: 2, topic: "internet", origin: "slides",
      source: "Lecture II, slide 29", difficulty: 1,
      front: R`What does DNS do, and how is it structured hierarchically?`,
      back: R`DNS translates domain names into IP addresses. Hierarchy: root servers → TLD servers ([[.com]], [[.at]], …) → authoritative servers.` },
    { id: "u2-card-http", type: "card", lecture: 2, topic: "internet", origin: "slides",
      source: "Lecture II, slide 31", difficulty: 1,
      front: R`Name the four HTTP methods of the lecture and their task.`,
      back: R`[[GET]] request data, [[POST]] send data, [[PUT]] update resources, [[DELETE]] delete resources.` },
    { id: "u2-card-email-protocols", type: "card", lecture: 2, topic: "internet", origin: "slides",
      source: "Lecture II, slide 34", difficulty: 1,
      front: R`What do SMTP, IMAP and POP3 stand for?`,
      back: R`SMTP: send e-mail (client → server, server → server). IMAP: read/manage mails on the server. POP3: download mails, typically deleting them on the server.` },
    { id: "u2-card-email-tls", type: "card", lecture: 2, topic: "internet", origin: "slides",
      source: "Lecture II, slide 37", difficulty: 2,
      front: R`Does TLS in mail transport protect the content from the mail servers?`,
      back: R`No. TLS protects only the transport between client and server. The mail servers can still read the content; that requires end-to-end encryption such as PGP or S/MIME.` },
    { id: "u2-card-internet-web", type: "card", lecture: 2, topic: "internet", origin: "slides",
      source: "Lecture II, slide 38", difficulty: 1,
      front: R`What is the difference between the Internet and the web?`,
      back: R`The **Internet** is the infrastructure of connected computers; the **web** is a service on top of it that provides websites via HTTP/HTTPS.` },
    { id: "u2-card-observers", type: "card", lecture: 2, topic: "web-tracking", origin: "slides",
      source: "Lecture II, slide 40", difficulty: 1,
      front: R`Which three observers does the lecture distinguish on the web?`,
      back: R`**ISP** (DNS, with HTTP also content), **website** (content of a particular user), **ad networks/social media** (content across many websites).` },
    { id: "u2-card-dns-port", type: "card", lecture: 2, topic: "web-tracking", origin: "slides",
      source: "Lecture II, slide 41", difficulty: 1,
      front: R`Why is DNS a tracking problem?`,
      back: R`DNS is plaintext over **UDP port 53**. Requests are visible in the same WLAN, at the ISP and in transit — even with a third-party DNS provider, the recursive resolver remains an observation point.` },
    { id: "u2-card-dot-doh", type: "card", lecture: 2, topic: "web-tracking", origin: "slides",
      source: "Lecture II, slide 43", difficulty: 2,
      front: R`Compare DoT and DoH.`,
      back: R`**DoT:** DNS in TLS, tcp/853 — dedicated port, easy to block/detect. **DoH:** DNS as HTTPS on 443 — not distinguishable by port, but the DoH endpoint can still be identified and blocked by IP, domain or SNI. Both still let the recursive resolver see the queries.` },
    { id: "u2-card-sni", type: "card", lecture: 2, topic: "web-tracking", origin: "slides",
      source: "Lecture II, slide 45", difficulty: 2,
      front: R`What leaks with HTTPS despite encryption?`,
      back: R`The **hostname in the SNI** of the initial TLS handshake (unless ECH is used) as well as metadata such as destination server, data volume and timing.` },
    { id: "u2-card-bgp", type: "card", lecture: 2, topic: "web-tracking", origin: "slides",
      source: "Lecture II, slides 46–47", difficulty: 2,
      front: R`Why are rerouting attacks a privacy problem despite HTTPS?`,
      back: R`BGP allows traffic to be routed over a different path. Even if the content is encrypted, **metadata** remain visible: destination server, timing and volume.` },
    { id: "u2-card-email-crypto", type: "card", lecture: 2, topic: "web-tracking", origin: "slides",
      source: "Lecture II, slide 49", difficulty: 1,
      front: R`Name the two e-mail encryption standards of the lecture.`,
      back: R`**PGP/GPG** (public-key cryptography) and **S/MIME** (digital certificates).` },
    { id: "u2-card-email-usability", type: "card", lecture: 2, topic: "web-tracking", origin: "slides",
      source: "Lecture II, slide 50", difficulty: 1,
      front: R`Name four usability problems of encrypted e-mail.`,
      back: R`Complex setup, missing client compatibility, key management (a lost key means no access) and lack of user knowledge.` },
    { id: "u2-card-vpn", type: "card", lecture: 2, topic: "web-tracking", origin: "variant",
      source: "Exercise sheet 1, Problem 1 (debrief)", difficulty: 2,
      front: R`What does a VPN change about observations, and what does it not?`,
      back: R`The local ISP sees only the VPN endpoint; the **VPN provider** sees destination and volume. With HTTPS the content stays protected, the **metadata does not**. A VPN shifts trust, it does not create anonymity.` },

    /* ---------------- true / false ---------------- */
    { id: "u2-tf-full-mesh", type: "tf", lecture: 2, topic: "internet", origin: "slides",
      source: "Lecture II, slide 22", difficulty: 1,
      statement: R`A fully meshed network with $n$ computers needs $\Theta(n^2)$ connections and therefore scales poorly.`,
      answer: true,
      explanation: R`A full mesh has $n(n-1)/2$ undirected links, which is $\Theta(n^2)$. The lecture uses $n^2$ as the order of magnitude; that is why routers and hierarchical networks exist.` },
    { id: "u2-tf-dns-hierarchy", type: "tf", lecture: 2, topic: "internet", origin: "slides",
      source: "Lecture II, slide 29", difficulty: 1,
      statement: R`The DNS hierarchy consists of root servers, TLD servers and authoritative servers.`,
      answer: true,
      explanation: R`That is how DNS is structured; TLDs are e.g. [[.com]], [[.org]], [[.at]].` },
    { id: "u2-tf-http-methods", type: "tf", lecture: 2, topic: "internet", origin: "variant",
      source: "Variant of Lecture II, slide 31", difficulty: 1,
      statement: R`[[POST]] is used to request data from a server, while [[GET]] sends data to the server.`,
      answer: false,
      explanation: R`It is the other way round: [[GET]] requests data, [[POST]] sends data.` },
    { id: "u2-tf-email-tls", type: "tf", lecture: 2, topic: "internet", origin: "slides",
      source: "Lecture II, slide 37", difficulty: 1,
      statement: R`TLS between client and mail server prevents the mail server from reading the content of the e-mail.`,
      answer: false,
      explanation: R`TLS protects only the transport. The mail server decrypts and can read the content; end-to-end encryption would be needed.` },
    { id: "u2-tf-internet-web", type: "tf", lecture: 2, topic: "internet", origin: "slides",
      source: "Lecture II, slide 38", difficulty: 1,
      statement: R`The web is the infrastructure on which the Internet runs as a service.`,
      answer: false,
      explanation: R`The other way round: the Internet is the infrastructure, the web is a service on top of it.` },
    { id: "u2-tf-dns-plain", type: "tf", lecture: 2, topic: "web-tracking", origin: "slides",
      source: "Lecture II, slide 41", difficulty: 1,
      statement: R`DNS queries are plaintext over UDP port 53 by default and therefore visible to the ISP.`,
      answer: true,
      explanation: R`They are visible in the same WLAN, at the ISP and in transit, unless DNS is encrypted.` },
    { id: "u2-tf-doh-resolver", type: "tf", lecture: 2, topic: "web-tracking", origin: "variant",
      source: "Variant of Lecture II, slide 44", difficulty: 2,
      statement: R`DoH solves the problem that the recursive DNS resolver sees all queries.`,
      answer: false,
      explanation: R`DoH hides the query from the local network and the ISP, but the recursive resolver (and a malicious DNS provider) still sees it.` },
    { id: "u2-tf-dot-block", type: "tf", lecture: 2, topic: "web-tracking", origin: "slides",
      source: "Lecture II, slide 43", difficulty: 1,
      statement: R`DoT runs on a dedicated port (tcp/853) and is therefore easier to block or detect than DoH.`,
      answer: true,
      explanation: R`DoH runs as HTTPS on 443 and is barely distinguishable from normal web traffic.` },
    { id: "u2-tf-https-sni", type: "tf", lecture: 2, topic: "web-tracking", origin: "slides",
      source: "Lecture II, slide 45", difficulty: 2,
      statement: R`With HTTPS, the hostname in the initial TLS handshake (SNI) is visible to an observer unless Encrypted Client Hello (ECH) is used.`,
      answer: true,
      explanation: R`Without ECH the SNI is in the clear, which is why DPI can monitor and censor HTTPS even though the content is encrypted. ECH encrypts the inner SNI; an outer cover SNI may remain visible.` },
    { id: "u2-tf-bgp-metadata", type: "tf", lecture: 2, topic: "web-tracking", origin: "variant",
      source: "Variant of Lecture II, slides 46–47", difficulty: 2,
      statement: R`A BGP rerouting attack can break the confidentiality of HTTPS content because it routes traffic over a different path.`,
      answer: false,
      explanation: R`With HTTPS the content stays protected. The attack exposes **metadata** such as destination server, timing and volume — not the plaintext.` },
    { id: "u2-tf-pgp", type: "tf", lecture: 2, topic: "web-tracking", origin: "slides",
      source: "Lecture II, slide 49", difficulty: 1,
      statement: R`PGP/GPG and S/MIME can protect e-mail content end to end.`,
      answer: true,
      explanation: R`PGP/GPG uses public-key cryptography, S/MIME digital certificates. Both encrypt and sign the content.` },
    { id: "u2-tf-email-usability", type: "tf", lecture: 2, topic: "web-tracking", origin: "slides",
      source: "Lecture II, slide 50", difficulty: 1,
      statement: R`A lost private key with end-to-end encrypted e-mail typically means losing access to old messages.`,
      answer: true,
      explanation: R`Without the private key the content cannot be decrypted; that is a central key-management hurdle.` },

    /* ---------------- multiple choice ---------------- */
    { id: "u2-mc-roles", type: "mc", lecture: 2, topic: "internet", origin: "slides",
      source: "Lecture II, slides 23–25", difficulty: 1,
      question: R`What is the task of a router in the network topology?`,
      options: [
        R`It stores websites centrally and answers requests.`,
        R`It forwards data between networks and optimises paths.`,
        R`It translates domain names into IP addresses.`,
        R`It encrypts e-mail content end to end.`
      ],
      correct: 1,
      explanation: R`Routers forward data between networks, reduce direct connections and optimise paths. DNS does name resolution; servers centralise resources.` },
    { id: "u2-mc-traceroute", type: "mc", lecture: 2, topic: "internet", origin: "slides",
      source: "Lecture II, slide 28", difficulty: 2,
      question: R`What does [[traceroute tuwien.at]] show?`,
      options: [
        R`The content of the website in plaintext`,
        R`The sequence of router hops with their IP addresses along the path`,
        R`The DNS hierarchy from the root to the authoritative server`,
        R`The encrypted TLS records of the connection`
      ],
      correct: 1,
      explanation: R`[[traceroute]] shows the hops and their IP addresses; every hop is a router.` },
    { id: "u2-mc-dns-role", type: "mc", lecture: 2, topic: "internet", origin: "variant",
      source: "Variant of Lecture II, slide 29", difficulty: 1,
      question: R`What is the task of DNS?`,
      options: [
        R`Translating domain names into IP addresses`,
        R`Encrypting HTTP requests`,
        R`Sending e-mails from the client to the server`,
        R`Routing traffic between routers`
      ],
      correct: 0,
      explanation: R`DNS is name resolution — the “telephone book” of the Internet.` },
    { id: "u2-mc-smtp", type: "mc", lecture: 2, topic: "internet", origin: "variant",
      source: "Variant of Lecture II, slide 34", difficulty: 1,
      question: R`Which protocol is used to send an e-mail from the client to the mail server?`,
      options: [R`IMAP`, R`POP3`, R`SMTP`, R`DNS`],
      correct: 2,
      explanation: R`SMTP sends; IMAP reads/manages on the server; POP3 downloads.` },
    { id: "u2-mc-http-leak", type: "mc", lecture: 2, topic: "web-tracking", origin: "slides",
      source: "Lecture II, slide 45", difficulty: 2,
      question: R`What is visible to a transparent proxy on an HTTP connection?`,
      options: [
        R`Only the IP address of the server`,
        R`Only the hostname, not the path`,
        R`The requested website, the complete path and the page content including auth tokens`,
        R`Only encrypted metadata`
      ],
      correct: 2,
      explanation: R`HTTP is unencrypted; a transparent proxy can read the request, the headers and the content.` },
    { id: "u2-mc-dot-port", type: "mc", lecture: 2, topic: "web-tracking", origin: "slides",
      source: "Lecture II, slide 43", difficulty: 2,
      question: R`On which port does DNS over TLS (DoT) run?`,
      options: [R`UDP/53`, R`TCP/443`, R`TCP/853`, R`TCP/80`],
      correct: 2,
      explanation: R`DoT uses tcp/853; classic DNS uses UDP/53, DoH uses HTTPS on 443.` },
    { id: "u2-mc-doh", type: "mc", lecture: 2, topic: "web-tracking", origin: "variant",
      source: "Variant of Lecture II, slides 43–44", difficulty: 2,
      question: R`Why is DoH harder to block than DoT?`,
      options: [
        R`Because DoH does not use encryption.`,
        R`Because DoH runs as HTTPS on port 443 and is barely distinguishable from normal web traffic.`,
        R`Because DoH is supported only by Android.`,
        R`Because DoH disables the recursive resolver.`
      ],
      correct: 1,
      explanation: R`DoH is embedded in HTTPS; the dedicated port of DoT makes that easier to recognise.` },
    { id: "u2-mc-sni", type: "mc", lecture: 2, topic: "web-tracking", origin: "slides",
      source: "Lecture II, slide 45", difficulty: 2,
      question: R`Which information leaks with HTTPS in the initial handshake?`,
      options: [
        R`The complete page content`,
        R`The user's password`,
        R`The hostname via SNI`,
        R`The server's private key`
      ],
      correct: 2,
      explanation: R`The hostname is in the SNI. Content is encrypted; metadata remain visible.` },
    { id: "u2-mc-rerouting", type: "mc", lecture: 2, topic: "web-tracking", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(ii)", difficulty: 1,
      question: R`What is the primary privacy problem of rerouting attacks, even when HTTPS is used?`,
      options: [
        R`Rerouting attacks fully decrypt HTTPS traffic during transit.`,
        R`They expose metadata such as destination server, timing and traffic volume.`,
        R`Rerouting attacks require the cooperation of the victim's device.`,
        R`HTTPS encrypts routing metadata, so rerouting attacks have no privacy impact.`
      ],
      correct: 1,
      explanation: R`The official solution is (b). HTTPS protects the content, not the metadata.` },
    { id: "u2-mc-dns-doh-risk", type: "mc", lecture: 2, topic: "web-tracking", origin: "exam-2024",
      source: "Midterm 2024/25, Q1(iii)", difficulty: 2,
      question: R`What is the fundamental privacy risk of DNS, even when DNS over HTTPS (DoH) is used?`,
      options: [
        R`Encryption slows down DNS resolution and thus creates delays.`,
        R`DoH cannot prevent data leaks at the level of the recursive resolver.`,
        R`The initial DNS queries reveal the entire browser history to the ISP.`,
        R`DoH requires public DNS servers, which are fundamentally insecure.`
      ],
      correct: 1,
      explanation: R`The official solution is (b). The recursive resolver still sees the queries; that is the remaining observation point.` },

    /* ---------------- gaps ---------------- */
    { id: "u2-gap-dot-doh", type: "gap", lecture: 2, topic: "web-tracking", origin: "slides",
      source: "Lecture II, slides 43–44", difficulty: 2,
      title: "DoT and DoH", points: 5,
      text: R`**DoT** (DNS over TLS, 2016) wraps DNS in TLS and uses the port <gap>tcp/853</gap>. The dedicated port makes DoT <gap>easy to block and detect</gap>. **DoH** (DNS over HTTPS, 2018) transports DNS queries <gap>as HTTPS</gap> and is therefore barely distinguishable from normal web traffic. With both approaches, <gap>the recursive resolver</gap> still sees the queries; in addition, a <gap>malicious DNS provider</gap> remains a problem.`,
      note: R`Encrypted DNS hides the query from the local network and the ISP, but not from the resolver you choose yourself.` },
    { id: "u2-gap-dns", type: "gap", lecture: 2, topic: "internet", origin: "slides",
      source: "Lecture II, slide 29", difficulty: 1,
      title: "DNS hierarchy", points: 3,
      text: R`DNS translates <gap>domain names</gap> into <gap>IP addresses</gap>. The hierarchy consists of <gap>root servers</gap>, TLD servers and authoritative servers.`,
      note: R`Examples of TLDs are [[.com]], [[.org]], [[.edu]] and [[.at]].` },
    { id: "u2-gap-email", type: "gap", lecture: 2, topic: "internet", origin: "slides",
      source: "Lecture II, slides 34–37", difficulty: 2,
      title: "E-mail protocols and TLS", points: 4,
      text: R`**SMTP** is used to <gap>send</gap> e-mails; **IMAP** reads and manages mails <gap>directly on the server</gap>; **POP3** <gap>downloads mails</gap> and typically deletes them on the server. TLS in mail transport protects <gap>only the transport between client and server</gap>, not the content from the mail servers.`,
      note: R`To protect against the mail servers one needs end-to-end encryption, e.g. PGP/GPG or S/MIME.` },

    /* ---------------- problems ---------------- */
    { id: "u2-prob-trace-visit", type: "problem", lecture: 2, topic: "web-tracking", origin: "exercise",
      source: "Exercise sheet 1, Problem 1", difficulty: 3,
      title: "Who sees what: a visit to a news site",
      statement: R`A user visits a news site that embeds three third parties: an ad network, a font CDN and a social plugin. Consider six parties: the news site itself, the three third parties, the DNS resolver and the ISP.`,
      parts: [
        { label: "a", points: 4,
          prompt: R`List, for each of the parties involved, what they learn with and without encrypted DNS, and with and without HTTPS.`,
          hints: [R`Separate name resolution (DNS) from transport (HTTP/HTTPS) and content.`,
                  R`A third party sees its own request but not automatically the whole page.`],
          solution: R`Separate the question into two independent dimensions: who sees the **DNS query**, and who sees the **HTTP content and connection metadata**.

**DNS visibility**

| Setup | Local network / ISP | Recursive resolver |
| --- | --- | --- |
| plain DNS | sees every queried domain | sees every query it resolves |
| DoT / DoH | sees only the connection to the resolver / DoH endpoint | still sees every query it resolves |

Encrypted DNS hides the query from the local network and the on-path ISP. It does **not** hide it from the recursive resolver you choose.

**Content and metadata**

| Party | without HTTPS | with HTTPS |
| --- | --- | --- |
| News site | request, IP, cookies, page content it serves | same; HTTPS protects the content in transit, not from the news site |
| Ad network | its own requests, cookie/fingerprint, referrer, ad payload it serves | same; its payload is protected in transit, not from the ad network |
| Font CDN | its own requests, IP, referrer | same; HTTPS protects its responses in transit |
| Social plugin | its own requests, cookie/fingerprint, referrer | same; HTTPS protects its responses in transit |
| DNS resolver | all domains it resolves | all domains it resolves; DoH/DoT does not hide them from the resolver |
| ISP | HTTP Host header, path, content, auth tokens; destination IPs | destination IPs, SNI (unless ECH), timing and volume; **no** page content |

The Host header and the SNI are different fields: the Host header is inside HTTP and is visible with plain HTTP; the SNI is in the TLS handshake and remains visible with HTTPS unless ECH is used. HTTPS protects content from network observers, not from the endpoint that serves it.`,
          rubric: [ { points: 1, text: R`DNS resolver and ISP correctly separated` },
                    { points: 1, text: R`Three third parties with their respective view` },
                    { points: 1, text: R`HTTPS protects content, not metadata` },
                    { points: 1, text: R`Encrypted DNS hides the query, not the connection` } ] },
        { label: "b", points: 3,
          prompt: R`A VPN routes all traffic encrypted to a provider, which then contacts the destinations. Which observations survive the VPN?`,
          hints: [R`Think about who sees the traffic after the VPN endpoint.`,
                  R`The VPN provider becomes the new observer.`],
          solution: R`The local ISP sees only the connection to the VPN endpoint. **The VPN provider** instead sees destination IPs, SNI, timing and volume — with HTTPS not the content. The third parties still see their own requests and cookies/fingerprints. A VPN thus shifts trust to the provider; it prevents neither tracking via cookies/fingerprints nor the visibility of metadata at the VPN exit.`,
          rubric: [ { points: 1, text: R`Local ISP sees only the VPN endpoint` },
                    { points: 1, text: R`VPN provider as new observer of metadata` },
                    { points: 1, text: R`Cookies/fingerprints and content are not automatically protected` } ] }
      ] },
    { id: "u2-prob-encrypted-dns", type: "problem", lecture: 2, topic: "web-tracking", origin: "variant",
      source: "Variant of Lecture II, slides 41–44", difficulty: 2,
      title: "DoT, DoH and the resolver",
      statement: "",
      parts: [
        { label: "a", points: 2,
          prompt: R`Compare DoT and DoH with respect to detectability and blockability by a censor.`,
          hints: [R`Which port is used?`,
                  R`Why is a dedicated port convenient for a censor?`],
          solution: R`DoT runs on tcp/853. A censor can specifically filter this port or recognise the TLS handshake. DoH runs as HTTPS on 443 and is therefore barely distinguishable from normal web traffic; blocking it would affect many legitimate HTTPS connections. DoH is therefore harder to block, but not invisible.`,
          rubric: [ { points: 1, text: R`DoT: dedicated port 853, easy to recognise/block` },
                    { points: 1, text: R`DoH: HTTPS on 443, hard to distinguish` } ] },
        { label: "b", points: 3,
          prompt: R`Explain why DoH does not fully solve DNS privacy either. Name two remaining observation points.`,
          hints: [R`Who answers the query in the end?`,
                  R`What happens after name resolution?`],
          solution: R`DoH hides the query from the local network and the ISP, but not from the **recursive resolver** that actually resolves it. If one chooses a malicious or cooperating DNS provider, that provider is just as well informed as the ISP was before. In addition, the subsequent connection remains visible: destination IP, SNI, timing and volume. DNS privacy is therefore only part of web privacy.`,
          rubric: [ { points: 1, text: R`Recursive resolver sees the query` },
                    { points: 1, text: R`Malicious DNS provider as a problem` },
                    { points: 1, text: R`Connection metadata remain visible` } ] }
      ] },
    { id: "u2-prob-email", type: "problem", lecture: 2, topic: "web-tracking", origin: "variant",
      source: "Variant of Lecture II, slides 48–50", difficulty: 2,
      title: "Encrypted e-mail in practice",
      statement: "",
      parts: [
        { label: "a", points: 2,
          prompt: R`A company enables TLS between its mail clients and the mail server. Which security goals does it achieve, and which not?`,
          hints: [R`TLS protects the link.`,
                  R`Who decrypts at the mail server?`],
          solution: R`TLS achieves **confidentiality** and **integrity** on the transport path between client and mail server as well as some authentication of the server. It does **not** achieve protection from the mail server itself: the server decrypts the message and can read, store or forward it. End-to-end confidentiality towards the provider is therefore not provided.`,
          rubric: [ { points: 1, text: R`Transport confidentiality and integrity named` },
                    { points: 1, text: R`Mail server can still read the content` } ] },
        { label: "b", points: 3,
          prompt: R`Name three concrete usability hurdles of PGP/S/MIME and one possible countermeasure each.`,
          hints: [R`Think of setup, key management and client support.`,
                  R`A countermeasure must actually address the hurdle.`],
          solution: R`1. **Complex setup:** generate, publish and import keys. Countermeasure: automatic key generation and distribution in the client, good defaults.
2. **Key management:** losing the private key means losing access; secure distribution is difficult. Countermeasure: recovery/backup, hardware tokens, clear rotation.
3. **Missing compatibility:** not every client supports PGP/S/MIME natively. Countermeasure: integration into standard clients, fallback with a clear warning.
Further: lack of user knowledge (training), missing end-to-end support at the recipient.`,
          rubric: [ { points: 1, text: R`Three concrete hurdles` },
                    { points: 1, text: R`Suitable countermeasures` },
                    { points: 1, text: R`Reference to key management or setup clearly recognisable` } ] }
      ] },
    { id: "u2-prob-rerouting", type: "problem", lecture: 2, topic: "web-tracking", origin: "variant",
      source: "Variant of Lecture II, slides 46-47 (part b is enrichment beyond the slides)", difficulty: 3,
      title: "BGP rerouting and metadata",
      statement: "",
      parts: [
        { label: "a", points: 2,
          prompt: R`Explain how a BGP rerouting attack works and why HTTPS does not prevent it.`,
          hints: [R`BGP chooses paths between autonomous systems.`,
                  R`What remains visible with HTTPS?`],
          solution: R`BGP allows an ISP or attacker to announce an attractive path for a prefix and thereby redirect traffic through itself (hijack or leak). HTTPS protects the **content** end to end, but the redirected traffic still shows the attacker **metadata**: source and destination IP, timing, volume and possibly the SNI. The attacker can derive communication relationships from this even without decrypting the content.`,
          rubric: [ { points: 1, text: R`BGP path announcement / redirection explained` },
                    { points: 1, text: R`HTTPS protects content, not metadata` } ] },
        { label: "b", points: 2,
          prompt: R`Name two countermeasures against rerouting attacks and explain what they help against.`,
          hints: [R`Beyond the course materials: RPKI signs routing information.`,
                  R`Encrypted DNS and TLS connections do not prevent redirection, but they can hide some metadata.`],
          solution: R`1. **RPKI/ROA (beyond the course materials):** cryptographic attestation of prefix-to-AS mappings; prevents false routes if all routers validate.
2. **Monitoring/anomaly detection (also beyond the slides):** detects sudden path changes and enables a quick response.
In addition: **multi-path/anycast** increases resilience, and **Encrypted Client Hello (ECH)** hides the SNI — but does not prevent the redirection itself.`,
          rubric: [ { points: 1, text: R`Two concrete measures` },
                    { points: 1, text: R`Effect of each correctly explained` } ] }
      ] }
  );
})();
