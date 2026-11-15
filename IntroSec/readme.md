# IntroSec

- `IntroSec_T1_zsmf.pdf` – Zusammenfassung für den 1. Test
- `IntroSec_T2_zsmf.pdf` – Zusammenfassung für den 2. Test
- [`trainer/`](trainer) – interaktiver Trainer (Single-Choice, 2. Test / Kapitel 8–14)

## Trainer selbst hosten

Der Ordner [`trainer/`](trainer) ist eine komplett eigenständige, statische Seite (HTML + JS, kein Build, kein Backend):

- **Lokal:** einfach [`trainer/index.html`](trainer/index.html) im Browser öffnen – funktioniert auch per Doppelklick von der Festplatte.
- **Mit lokalem Server:** im Ordner `trainer` z. B. `python -m http.server` ausführen und <http://localhost:8000> öffnen.
- **Online:** den kompletten Ordner `trainer` unverändert auf einen beliebigen statischen Webspace kopieren (GitHub Pages, Netlify, nginx, …).

Der Lernfortschritt wird nur lokal im Browser (`localStorage`) gespeichert – es werden keine Daten übertragen.
