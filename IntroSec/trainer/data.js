window._trainerData_introSec = [
  {
    "section": "Prepared Statements",
    "question": "Prepared statements protect against SQL injection by stripping out dangerous keywords (like SELECT) and special characters (such as single quotes) from any user-supplied parameters before embedding them into the query.",
    "type": "tf",
    "answer": false,
    "explanation": "Prepared Statements filtern oder entfernen keine Zeichen. Sie verhindern SQL-Injection, indem sie Code und Daten strikt trennen, sodass die Eingaben nur als literale Werte und nicht als Teil des ausführbaren SQL-Befehls interpretiert werden."
  },
  {
    "section": "Prepared Statements",
    "question": "Prepared statements can successfully prevent blind SQL injection attacks, but they are ineffective against the more sophisticated totally blind SQL injection variant.",
    "type": "tf",
    "answer": false,
    "explanation": "Prepared Statements sind gegen jede Form von SQL-Injection effektiv, einschließlich (totally) blind SQL-Injections, da die zugrundeliegende Schwachstelle – das Vermischen von Logik und Daten – vollständig behoben wird."
  },
  {
    "section": "Prepared Statements",
    "question": "There are certain SQL contexts — such as dynamically specifying a table or column name — where parameterized placeholders in prepared statements cannot be used, depending on the specific database driver and SQL variant.",
    "type": "tf",
    "answer": true,
    "explanation": "Platzhalter (?) in Prepared Statements können typischerweise nur für Variablen und Werte genutzt werden. Sie können nicht zur dynamischen Übergabe von Tabellen- oder Spaltennamen (SQL Identifiern) verwendet werden."
  },
  {
    "section": "Prepared Statements",
    "question": "The PHP snippet below correctly implements prepared statements: the variable $db holds the database connection object, and the query is safely constructed by concatenating user input as shown: $query = \"INSERT INTO logs (message) VALUES ('\" . $_POST[\"msg\"] . \"')\"; followed by $db->prepare($query) and $sth->execute().",
    "type": "tf",
    "answer": false,
    "explanation": "Dieser Code konkateniert die Benutzereingabe ($_POST[\"msg\"]) direkt in den Abfragestring, anstatt einen Platzhalter zu verwenden. Dadurch bleibt die Abfrage anfällig für SQL-Injection. Ein korrekter Aufruf müsste Parameterbindung (z.B. bindParam oder bindValue) nutzen."
  },
  {
    "section": "Content Security Policy (CSP)",
    "question": "A Content Security Policy (CSP) can effectively prevent Cross-Site Request Forgery (CSRF) attacks when properly configured.",
    "type": "tf",
    "answer": false,
    "explanation": "CSP regelt primär die Ausführung und das Laden von Ressourcen. Zum Schutz vor CSRF werden andere Mechanismen wie Anti-CSRF-Tokens oder SameSite-Attribute bei Cookies eingesetzt."
  },
  {
    "section": "Content Security Policy (CSP)",
    "question": "A Content Security Policy (CSP) is primarily designed to detect and mitigate Cross-Site Scripting (XSS) attacks by controlling which resources can be executed on a page.",
    "type": "tf",
    "answer": true,
    "explanation": "Die Vermeidung und Abschwächung von Cross-Site Scripting (XSS) ist der primäre Einsatzzweck einer Content Security Policy, z.B. durch das Blockieren von Inline-Skripten."
  },
  {
    "section": "Content Security Policy (CSP)",
    "question": "A Content Security Policy (CSP) can mitigate Clickjacking attacks through the use of the frame-ancestors directive, which restricts which origins may embed the page in an iframe.",
    "type": "tf",
    "answer": true,
    "explanation": "CSP kann über die Direktive 'frame-ancestors' steuern, welche fremden Domains die eigene Seite in einem iFrame laden dürfen, und ist somit effektiv gegen Clickjacking."
  },
  {
    "section": "Content Security Policy (CSP)",
    "question": "A Content Security Policy (CSP) provides effective protection against SQL injection attacks by blocking malicious database queries from the client side.",
    "type": "tf",
    "answer": false,
    "explanation": "CSP ist ein clientseitiger Browserschutz. SQL-Injection ist eine serverseitige Schwachstelle in der Datenbankabfrage."
  },
  {
    "section": "Information Flow Control",
    "question": "A program p satisfies non-interference as soon as we can identify a single pair of low-equivalent input states for which the corresponding output states after termination are also low-equivalent.",
    "type": "tf",
    "answer": false,
    "explanation": "Non-Interference erfordert, dass die Bedingung für *alle* möglichen Paare von low-äquivalenten Eingabespeichern erfüllt sein muss, nicht nur für mindestens ein existierendes Paar."
  },
  {
    "section": "Information Flow Control",
    "question": "Static information flow analysis provides a compile-time mechanism to guarantee that a program adheres to the non-interference property.",
    "type": "tf",
    "answer": true,
    "explanation": "Information Flow Control (IFC) (z.B. mittels statischer Typsysteme) ist ein Standardverfahren, um Non-Interference-Eigenschaften eines Programms bereits zur Compile-Zeit sicherzustellen."
  },
  {
    "section": "Information Flow Control",
    "question": "The assignment l := h - h (with l classified as low and h classified as high) preserves non-interference because the result of the subtraction is always zero regardless of h's secret value.",
    "type": "tf",
    "answer": true,
    "explanation": "Die Berechnung 'h - h' evaluiert stets zu 0, unabhängig vom tatsächlichen, geheimen Wert von h. Somit leakt keine Information über den 'high'-Wert in die 'low'-Variable l. Das Programm erfüllt damit Non-Interference."
  },
  {
    "section": "Information Flow Control",
    "question": "An explicit information flow occurs whenever a low-security variable is modified inside a conditional branch that depends on a high-security variable.",
    "type": "tf",
    "answer": false,
    "explanation": "Die Beschreibung (Modifikation einer Low-Variable innerhalb eines von High abhängigen Kontrollflusses) definiert einen *impliziten* Informationsfluss. Ein *expliziter* Fluss entsteht durch direkte Zuweisung (z. B. l := h), nicht über eine Konditionale."
  },
  {
    "section": "Information Flow Control",
    "question": "Static Type Systems can be utilized to mathematically prove that a program adheres to Noninterference.",
    "type": "tf",
    "answer": true,
    "explanation": "Statische Informationsflusskontrolle (Static Information Flow Control) nutzt oft Typsysteme (Type Systems), um den Code zur Compile-Zeit zu analysieren und Noninterference formal zu garantieren, ohne das Programm ausführen zu müssen."
  },
  {
    "section": "Information Flow Control",
    "question": "An explicit information flow happens when a low-security variable's assignment depends on a high-security variable within a conditional branch (e.g., `if (secret) { pub = 1; }`).",
    "type": "tf",
    "answer": false,
    "explanation": "Das beschriebene Szenario über eine Kontrollflussstruktur (Control Flow) ist die klassische Definition eines impliziten Informationsflusses (Implicit Information Flow). Ein expliziter Fluss wäre eine direkte Zuweisung wie `pub = secret`."
  },
  {
    "section": "Information Flow Control",
    "question": "The statement `public_var := secret_var * 0` violates noninterference because a high-security variable is directly part of the arithmetic expression assigned to a low-security variable.",
    "type": "tf",
    "answer": false,
    "explanation": "Obwohl die High-Variable syntaktisch vorkommt, evaluiert der Ausdruck semantisch immer zu 0. Da der Endzustand von `public_var` somit völlig unabhängig vom tatsächlichen Wert der `secret_var` ist, tritt kein Leak auf. Noninterference ist erfüllt."
  },
  {
    "section": "Information Flow Control",
    "question": "Typical dynamic taint analysis implementations completely prevent all implicit information flows without generating false positives.",
    "type": "tf",
    "answer": false,
    "explanation": "Dynamische Taint-Analyse hat große Schwierigkeiten mit Implicit Flows (Kontrollfluss-Abhängigkeiten). Werden diese streng getrackt, führt dies zu massivem Overhead und Over-Tainting (viele False Positives). Daher ignorieren viele praktische Implementierungen implizite Flüsse."
  },
  {
    "section": "Memory Protection & Exploitation",
    "question": "Return-Oriented Programming (ROP) is successfully mitigated by enabling the NX bit (Data Execution Prevention) on the stack.",
    "type": "tf",
    "answer": false,
    "explanation": "ROP (Code-Reuse Attack) wurde exakt dafür entwickelt, DEP/NX zu umgehen. Da keine neuen Instruktionen auf den Stack geschrieben werden, sondern lediglich Return-Pointer auf bereits ausführbare Code-Snippets (Gadgets) in der libc verbogen werden, greift DEP hier nicht."
  },
  {
    "section": "Memory Protection & Exploitation",
    "question": "Setting the stack to non-executable (NX) successfully prevents classic buffer overflows where the attacker injects and executes custom shellcode directly on the stack.",
    "type": "tf",
    "answer": true,
    "explanation": "Das ist der Hauptzweck von DEP/NX (Data Execution Prevention). Die CPU weigert sich, Instruktionen in Speicherbereichen auszuführen, die als Datenbereich (wie Stack oder Heap) markiert sind, was klassische Shellcode-Injections blockiert."
  },
  {
    "section": "Memory Protection & Exploitation",
    "question": "For optimal protection against brute-force guessing, the stack canary value is regenerated from scratch by the kernel on each and every function invocation at runtime.",
    "type": "tf",
    "answer": false,
    "explanation": "Aus Performancegründen wird der Canary-Wert (Master Canary) nur einmalig beim Start des Programms oder Threads generiert. Bei Funktionsaufrufen wird dieser selbe Wert lediglich in den jeweiligen Stack Frame kopiert, nicht neu generiert."
  },
  {
    "section": "Memory Protection & Exploitation",
    "question": "Format string vulnerabilities are strictly limited to memory disclosure (leaking data) and cannot be used to modify memory contents.",
    "type": "tf",
    "answer": false,
    "explanation": "Durch den Format-Spezifikator `%n` (schreibt die Anzahl der bisher ausgegebenen Bytes an eine Pointer-Adresse) können Format String Vulnerabilities durchaus für gezielte Schreibzugriffe (Arbitrary Memory Write) missbraucht werden."
  },
  {
    "section": "Memory Protection & Exploitation",
    "question": "Dereferencing a dangling pointer after the associated heap memory was freed with `free()` leads to a Use-After-Free (UAF) vulnerability.",
    "type": "tf",
    "answer": true,
    "explanation": "Wenn ein Pointer nach dem Aufruf von `free()` nicht auf `NULL` gesetzt wird und später im Programmablauf (z.B. durch einen Alias-Pointer) erneut dereferenziert wird, liegt ein klassischer Use-After-Free vor. Dies kann zur Codeausführung (RCE) führen."
  },
  {
    "section": "Memory Protection & Exploitation",
    "question": "Address Space Layout Randomization (ASLR) protects against buffer overflows by randomizing the stack canary value on every execution.",
    "type": "tf",
    "answer": false,
    "explanation": "ASLR und Stack Canaries sind zwei völlig unterschiedliche Schutzmechanismen. ASLR randomisiert die Basisadressen von Speichersegmenten (Stack, Heap, Libraries), um das Auffinden von Gadgets/Shellcode zu erschweren, berührt aber nicht die Generierung von Canaries."
  },
  {
    "section": "Memory Protection & Exploitation",
    "question": "A NOP sled consists of a sequence of NOP (0x90) instructions placed before shellcode to increase the chance of successful exploitation when the exact stack address is unknown.",
    "type": "tf",
    "answer": true,
    "explanation": "Ein NOP Sled ist eine Kette von 0x90-Instruktionen (No Operation). Da die genaue Stack-Adresse schwer vorherzusagen ist, erhöht der Sled die Wahrscheinlichkeit, dass der Sprung irgendwo in den Sled trifft und zur Shellcode-Ausführung 'rutscht'."
  },
  {
    "section": "Memory Protection & Exploitation",
    "question": "The least significant byte of a stack canary is typically set to 0x00 to prevent reading the canary via string functions.",
    "type": "tf",
    "answer": true,
    "explanation": "Das niederwertigste Byte des Stack-Canaries ist standardmäßig 0x00. Dadurch wird verhindert, dass String-Funktionen (z.B. puts, printf mit %s) den Canary bei einem Buffer Over-read ausgeben, da diese am Null-Byte terminieren."
  },
  {
    "section": "Memory Protection & Exploitation",
    "question": "ASLR randomizes the base addresses of stack, heap, and libraries. However, without PIE, the base address of the main executable remains fixed.",
    "type": "tf",
    "answer": true,
    "explanation": "ASLR randomisiert die Basisadressen von Stack, Heap und Bibliotheken. Ohne PIE (Position-Independent Executable) bleibt die Basisadresse des Hauptprogramms (ELF) jedoch konstant, was ROP-Gadgets im .text-Segment weiterhin auf festen Adressen nutzbar macht."
  },
  {
    "section": "Memory Protection & Exploitation",
    "question": "A ROP chain works by chaining together gadgets that end with a `ret` instruction, allowing an attacker to execute arbitrary code without injecting new code.",
    "type": "tf",
    "answer": true,
    "explanation": "ROP (Return-Oriented Programming) verkettet kurze, mit `ret` endende Code-Sequenzen (Gadgets). Jedes `ret` holt die Adresse des nächsten Gadgets vom Stack, sodass der Angreifer beliebige Berechnungen durchführen kann, ohne neuen Code zu injizieren."
  },
  {
    "section": "Memory Protection & Exploitation",
    "question": "Return-to-libc (ret2libc) is a technique used to bypass NX/DEP by reusing existing functions from the C standard library.",
    "type": "tf",
    "answer": true,
    "explanation": "Ret2libc ist eine Unterform von ROP, bei der direkt in Bibliotheksfunktionen der glibc (z.B. system(), open()) gesprungen wird. Da die glibc riesig ist, findet man dort nahezu alle benötigten Funktionen und Gadgets."
  },
  {
    "section": "Memory Protection & Exploitation",
    "question": "In format string vulnerabilities, the `%n` format specifier can be used to write the number of bytes printed so far to a memory address.",
    "type": "tf",
    "answer": true,
    "explanation": "Der Specifier %n schreibt die Anzahl der bereits von printf ausgegebenen Bytes an die als Parameter übergebene Speicheradresse. In Kombination mit Padding und Direct Parameter Access kann ein Angreifer damit beliebige Werte an beliebige Adressen schreiben (Arbitrary Memory Write)."
  },
  {
    "section": "Memory Protection & Exploitation",
    "question": "A TOCTOU (Time-of-Check-Time-of-Use) race condition occurs when a program checks a permission and then uses a resource, allowing an attacker to swap the resource in between.",
    "type": "tf",
    "answer": true,
    "explanation": "TOCTOU ist eine klassische Race Condition: Das Programm prüft zuerst Berechtigungen (Check) und nutzt die Datei kurz darauf (Use). In diesem Zeitfenster kann ein Angreifer die Datei durch einen Symlink ersetzen (z.B. auf /etc/passwd)."
  },
  {
    "section": "Memory Protection & Exploitation",
    "question": "A function pointer clobbering attack overwrites a function pointer on the stack to redirect control flow when the function is called.",
    "type": "tf",
    "answer": true,
    "explanation": "Beim Function Pointer Clobbering wird ein auf dem Stack gespeicherter Funktionszeiger überschrieben. Ruft das Programm diesen Zeiger auf, springt es zur Adresse des Angreifers und der Kontrollfluss ist gekapert."
  },
  {
    "section": "Memory Protection & Exploitation",
    "question": "The `__stack_chk_fail` function is automatically called when the stack canary is corrupted, preventing exploitation.",
    "type": "tf",
    "answer": true,
    "explanation": "Wenn der Stack Canary bei der Rückkehr aus einer Funktion nicht mehr mit dem ursprünglichen Wert übereinstimmt, ruft das Programm __stack_chk_fail auf und bricht kontrolliert ab, bevor der manipulierte Rücksprungpointer angesprungen wird."
  },
  {
    "section": "Same Origin Policy (SOP) & CORS",
    "question": "Under the Same Origin Policy, two origins are considered identical as long as they share the same second-level domain — for example, `https://shop.example.com` and `https://api.example.com` would be treated as the same origin.",
    "type": "tf",
    "answer": false,
    "explanation": "Die Same Origin Policy (SOP) verlangt einen exakten Match von Schema, Port und Host. Subdomains (wie `shop` vs. `api`) gelten als unterschiedliche Origins (Cross-Origin). Ohne passenden CORS-Header wird das Auslesen der Antwort vom Browser blockiert."
  },
  {
    "section": "Same Origin Policy (SOP) & CORS",
    "question": "Two URLs sharing the same protocol (HTTP) and host, but running on different ports (e.g., 80 vs 8080), are considered to belong to the exact same origin.",
    "type": "tf",
    "answer": false,
    "explanation": "Der Port ist ein integraler Bestandteil der Origin-Definition. Eine Abweichung im Port führt zwangsläufig zu einem Origin-Mismatch."
  },
  {
    "section": "Same Origin Policy (SOP) & CORS",
    "question": "The Same Origin Policy prevents a script on `https://site-a.com` from loading a public image hosted on `https://site-b.com` into its own DOM via an `<img>` tag.",
    "type": "tf",
    "answer": false,
    "explanation": "Das Einbetten von Ressourcen (Cross-Origin Embedding), wie Bildern (`<img>`), Skripten (`<script>`) oder Stylesheets, ist standardmäßig erlaubt. Die SOP blockiert nur das programmatische Auslesen fremder Dateninhalte."
  },
  {
    "section": "Same Origin Policy (SOP) & CORS",
    "question": "Setting the `Access-Control-Allow-Origin: *` header on a sensitive API endpoint allows any malicious website to read the data via AJAX, assuming no authentication cookies are required.",
    "type": "tf",
    "answer": true,
    "explanation": "Die Wildcard `*` bei CORS hebt die SOP-Beschränkungen für das Lesen faktisch auf. Jede beliebige externe Origin darf den Response auslesen. Wenn die API keine Autorisierung verlangt, sind die Daten für Angreifer komplett offen."
  },
  {
    "section": "Web Security",
    "question": "If a cookie is set with `SameSite=Strict`, it will be included in the request when a user follows a standard `<a>` link from an external site to your domain.",
    "type": "tf",
    "answer": false,
    "explanation": "Das Flag `SameSite=Strict` ist maximal restriktiv. Der Cookie wird niemals bei domainübergreifenden Anfragen (Cross-Site Requests) gesendet – nicht einmal bei einer sicheren Top-Level Navigation wie einem normalen Link-Klick. Dafür bräuchte man `SameSite=Lax`."
  },
  {
    "section": "Web Security",
    "question": "A cookie configured with `SameSite=Lax` will be sent when a third-party website loads your site's resources in the background (e.g., via an `<img>` tag or XMLHTTPRequest).",
    "type": "tf",
    "answer": false,
    "explanation": "`SameSite=Lax` erlaubt das Senden des Cookies bei Cross-Site Requests ausschließlich bei Top-Level Navigationen (z.B. der User klickt einen Link). Hintergrundanfragen (Subrequests) wie Bilder oder AJAX sind davon ausgenommen."
  },
  {
    "section": "Web Security",
    "question": "Stripping the exact string `../` from user input using a single replacement function (like `replace(\"../\", \"\")`) is a secure and complete method to prevent directory traversal attacks.",
    "type": "tf",
    "answer": false,
    "explanation": "Diese Art der Blacklist-Bereinigung ist hochgradig unsicher. Angreifer können den Filter leicht umgehen, z.B. durch Eingaben wie `....//` (nach dem Löschen von `../` bleibt ein erneutes `../` übrig) oder durch URL-Encoding."
  },
  {
    "section": "Web Security",
    "question": "An `HttpOnly` flag on a session cookie prevents the browser from sending it during Cross-Site Request Forgery (CSRF) attacks.",
    "type": "tf",
    "answer": false,
    "explanation": "`HttpOnly` schützt den Cookie ausschließlich vor dem clientseitigen Auslesen durch JavaScript (Mitigation gegen XSS). Der Browser sendet den Cookie bei CSRF-Requests trotzdem automatisch mit. Gegen CSRF hilft das `SameSite`-Attribut."
  },
  {
    "section": "Web Security",
    "question": "SSRF (Server-Side Request Forgery) allows an attacker to force a vulnerable server to make requests to unintended targets, including internal services like localhost.",
    "type": "tf",
    "answer": true,
    "explanation": "Bei SSRF zwingt der Angreifer den Server dazu, HTTP-Anfragen an unerwartete Ziele zu senden (z.B. localhost, interne Netzwerke, file://-Protokoll). Dies kann zum Zugriff auf private APIs oder Cloud-Metadaten führen."
  },
  {
    "section": "Web Security",
    "question": "NoSQL injection attacks work by manipulating the structure of query objects, such as using MongoDB operators like `$ne` (not equal).",
    "type": "tf",
    "answer": true,
    "explanation": "NoSQL-Injection nutzt die strukturierte JSON-Abfragesprache von Datenbanken wie MongoDB. Ein Operator wie $ne ('not equal') in einem Passwort-Feld kann z.B. einen Login Bypass auslösen: password[$ne]=wrongpassword."
  },
  {
    "section": "Web Security",
    "question": "The `__Host-` cookie prefix guarantees that a cookie is bound to a specific host and cannot be overwritten by subdomains.",
    "type": "tf",
    "answer": true,
    "explanation": "Der __Host--Präfix wird vom Browser nur akzeptiert, wenn das Cookie das Secure-Flag hat, von HTTPS stammt, kein Domain-Attribut gesetzt ist und der Pfad auf / gesetzt ist. Dadurch ist es fest an den exakten Host gebunden."
  },
  {
    "section": "Web Security",
    "question": "Same-origin requests never require a CORS preflight (OPTIONS) request.",
    "type": "tf",
    "answer": true,
    "explanation": "CORS-Preflight-Requests (OPTIONS) sind für Cross-Origin Requests relevant, nicht für Same-Origin Requests. Bei Same-Origin gibt es keine SOP-Beschränkung, daher ist kein CORS-Mechanismus nötig."
  },
  {
    "section": "Web Security",
    "question": "Session fixation attacks can be prevented by generating a new session ID after a successful login.",
    "type": "tf",
    "answer": true,
    "explanation": "Session Fixation wird verhindert, indem die Webanwendung nach jedem Privilegienwechsel (insb. nach erfolgreichem Login) die alte Session-ID verwirft und eine komplett neue ID generiert."
  },
  {
    "section": "Android Security",
    "question": "An Android application can arbitrarily access and read cookies set inside its own embedded WebView using the `CookieManager` API, regardless of which third-party website is currently loaded.",
    "type": "tf",
    "answer": true,
    "explanation": "Die Host-App besitzt vollständige Kontrolle über die Instanz der eingebetteten WebView. Es existiert keine Sandbox zwischen der WebView und der App, weshalb die App via `CookieManager` auf alle Session-Cookies der aufgerufenen Seiten zugreifen kann (Sicherheitsrisiko bei OAuth-Logins via WebView)."
  },
  {
    "section": "Android Security",
    "question": "Exposing Android Java objects to a WebView via the `addJavascriptInterface` method can lead to Remote Code Execution if a malicious webpage is loaded.",
    "type": "tf",
    "answer": true,
    "explanation": "Durch `addJavascriptInterface` können Methoden von Java/Kotlin-Objekten direkt von JavaScript aus aufgerufen werden. Wenn eine unsichere oder vom Angreifer kontrollierte Seite geladen wird, kann dieser die App-Logik manipulieren, was bei älteren APIs direkt RCE zur Folge hatte."
  },
  {
    "section": "Program Analysis",
    "question": "A static analysis tool is considered 'sound' if it guarantees to find all actual vulnerabilities, even if it produces false positives in the process.",
    "type": "tf",
    "answer": true,
    "explanation": "Soundness (Korrektheit) bedeutet in der Programmanalyse typischerweise, dass keine echten Fehler übersehen werden (Zero False Negatives, Über-Approximation). Das Tool darf dafür False Positives (Fehlalarme) generieren."
  },
  {
    "section": "Program Analysis",
    "question": "If a vulnerability scanner has 100% Completeness, it means it will systematically find every single vulnerability without exception.",
    "type": "tf",
    "answer": false,
    "explanation": "Completeness (Vollständigkeit) bedeutet in der Analyse-Theorie, dass jeder vom Tool gemeldete Fehler auch tatsächlich ein echter Fehler ist (Zero False Positives, Unter-Approximation). Es garantiert nicht, dass *alle* Fehler gefunden werden (das wäre Soundness)."
  },
  {
    "section": "Program Analysis",
    "question": "Symbolic execution avoids the 'Path Explosion' problem by dynamically executing the program with a single set of concrete random inputs.",
    "type": "tf",
    "answer": false,
    "explanation": "Die Beschreibung (Ausführung mit konkreten, zufälligen Werten) definiert Fuzzing. Symbolic Execution analysiert hingegen alle möglichen Pfade mittels SMT-Solvern und leidet fundamental unter dem Path Explosion Problem bei komplexen Verzweigungen."
  },
  {
    "section": "Program Analysis",
    "question": "A static analysis tool is considered 'sound' if it never reports a vulnerability when the program is actually secure (no false positives).",
    "type": "tf",
    "answer": false,
    "explanation": "Soundness (Korrektheit) bedeutet, dass das Tool keine echten Fehler übersieht (keine False Negatives). Es darf dafür False Positives (Fehlalarme) produzieren. Die Beschreibung trifft auf Completeness (Vollständigkeit) zu."
  },
  {
    "section": "Program Analysis",
    "question": "Dynamic taint analysis tracks data from unsafe sources (sources) to critical operations (sinks) by marking data as 'tainted'.",
    "type": "tf",
    "answer": true,
    "explanation": "Taint Analysis verfolgt den Informationsfluss von unsicheren Quellen (Sources, z.B. User-Input) zu kritischen Senken (Sinks, z.B. printf oder exec). Jeder von einer Source beeinflusste Wert wird als 'tainted' markiert."
  },
  {
    "section": "Program Analysis",
    "question": "Undertainting (false negatives) in taint analysis occurs when values are incorrectly marked as safe, potentially missing actual attacks.",
    "type": "tf",
    "answer": true,
    "explanation": "Undertainting bedeutet, dass tatsächlich unsichere Werte fälschlicherweise als 'untainted' (sicher) eingestuft werden. Dies führt zu False Negatives, bei denen Angriffe nicht erkannt werden."
  },
  {
    "section": "Binary Analysis",
    "question": "In C, strings are terminated by a null byte ('\\0'), which marks the end of the string.",
    "type": "tf",
    "answer": true,
    "explanation": "C-Strings sind char-Arrays, die mit einem Null-Byte ('\\0', ASCII 0) terminiert sein müssen. String-Funktionen wie strlen() oder strcpy() erkennen das Ende des Strings an diesem Terminator."
  },
  {
    "section": "Binary Analysis",
    "question": "The stack in x86-64 grows towards higher memory addresses.",
    "type": "tf",
    "answer": false,
    "explanation": "Der Stack wächst nach unten, also zu niedrigeren Speicheradressen hin. Neu auf den Stack gelegte Werte (PUSH) liegen auf kleineren Adressen als die zuvor abgelegten."
  },
  {
    "section": "Binary Analysis",
    "question": "On a 64-bit architecture, all pointers are 64 bits (8 bytes) wide, regardless of the data type they point to.",
    "type": "tf",
    "answer": true,
    "explanation": "In einer 64-Bit-Architektur sind Speicheradressen 64 Bit (8 Byte) groß, daher belegt jeder Pointer unabhängig vom Datentyp, auf den er zeigt, immer 8 Byte."
  },
  {
    "section": "Binary Analysis",
    "question": "Little-endian byte ordering stores the most significant byte at the lowest memory address.",
    "type": "tf",
    "answer": false,
    "explanation": "Little-Endian (Standard bei x86) speichert das niederwertigste Byte (Least Significant Byte) an der niedrigsten Speicheradresse. Der Wert 0x0000cafe wird also als fe ca 00 00 abgelegt."
  },
  {
    "section": "Binary Analysis",
    "question": "The `.text` section of an ELF binary is typically mapped with read and execute permissions (r-x), but not write permission.",
    "type": "tf",
    "answer": true,
    "explanation": "Die .text-Sektion enthält den ausführbaren Maschinencode und ist daher als r-x (read, execute) markiert. Schreibrechte fehlen, um eine Modifikation des Codes zur Laufzeit zu verhindern."
  },
  {
    "section": "Binary Analysis",
    "question": "The `file` command can be used to determine whether a binary is 32-bit or 64-bit and whether it uses little-endian or big-endian byte ordering.",
    "type": "tf",
    "answer": true,
    "explanation": "Der Befehl `file <binary>` gibt Informationen über die Architektur (32/64-Bit), Endianness und den Link-Typ einer Binärdatei aus."
  },
  {
    "section": "Binary Analysis",
    "question": "The instruction `mov rax, [0x1234]` copies the constant value 0x1234 into the rax register.",
    "type": "tf",
    "answer": false,
    "explanation": "Dies ist ein Memory-Direct-Adressierungsmodus: Es wird der Wert geladen, der an der Speicheradresse 0x1234 steht (die eckigen Klammern bedeuten Speicherzugriff). Ein Immediate-Wert wird ohne Klammern geladen: `mov rax, 0x1234`."
  },
  {
    "section": "Binary Analysis",
    "question": "The RBP register (Base Pointer) serves as a reference point for accessing local variables and function arguments within a stack frame.",
    "type": "tf",
    "answer": true,
    "explanation": "RBP (Base Pointer / Stack Frame Pointer) dient als konstante Referenzadresse für den Zugriff auf lokale Variablen und Funktionsargumente innerhalb eines Stack-Frames."
  },
  {
    "section": "Symbolic Execution",
    "question": "SMT (Satisfiability Modulo Theories) extends SAT solving by allowing symbols to have specific interpretations such as arithmetic or bit-vectors.",
    "type": "tf",
    "answer": true,
    "explanation": "SMT erweitert SAT-Formeln um spezifische Interpretationen wie lineare Arithmetik, Arrays oder Bit-Vektoren. Dadurch können maschinennahe Berechnungen modelliert werden, z.B. mit Z3."
  },
  {
    "section": "Symbolic Execution",
    "question": "An SMT formula is 'valid' if it is true under at least one possible interpretation of its variables.",
    "type": "tf",
    "answer": false,
    "explanation": "Valid (gültig) bedeutet, dass eine Formel unter *jeder* beliebigen Interpretation wahr ist. Erfüllbar (satisfiable) bedeutet, dass es mindestens eine Interpretation gibt, die sie wahr macht."
  },
  {
    "section": "Symbolic Execution",
    "question": "The angr binary analysis framework uses the Z3 theorem prover for constraint solving during symbolic execution.",
    "type": "tf",
    "answer": true,
    "explanation": "angr ist ein Open-Source Python-Framework für Binäranalyse. Es nutzt Z3 (via claripy) als SMT-Solver, um Constraints zu lösen und zu prüfen, ob bestimmte Programmzustände erreichbar sind."
  },
  {
    "section": "Symbolic Execution",
    "question": "Path explosion is a major challenge in symbolic execution where the number of execution paths grows exponentially with the number of branches.",
    "type": "tf",
    "answer": true,
    "explanation": "Path Explosion ist ein fundamentales Problem der symbolischen Ausführung: Bei jeder Verzweigung (if/else) gabelt sich die Ausführung, was bei vielen Verzweigungen oder Schleifen zu exponentiell wachsenden Pfadanzahlen führt."
  },
  {
    "section": "Symbolic Execution",
    "question": "Z3 can only solve formulas with mathematical integers and cannot model real machine arithmetic with overflows.",
    "type": "tf",
    "answer": false,
    "explanation": "Z3 unterstützt auch BitVectors (BitVec), die reale Maschinenzahlen mit exakter Wortbreite (z.B. 32 Bit) modellieren. Dies ist wichtig für die Binäranalyse, da Überläufe und arithmetische Effekte realitätsgetreu abgebildet werden."
  },
  {
    "section": "Symbolic Execution",
    "question": "A SimProcedure in angr is a Python summary of a function that replaces the real function during symbolic execution to improve performance.",
    "type": "tf",
    "answer": true,
    "explanation": "SimProcedures sind in Python geschriebene Zusammenfassungen von Funktionen, die anstelle der echten Funktion ausgeführt werden. Sie dienen dazu, komplexe oder langwierige Funktionen zu überspringen und die Analyse effizienter zu machen."
  },
];

