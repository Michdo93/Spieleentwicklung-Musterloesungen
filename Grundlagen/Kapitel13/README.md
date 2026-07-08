# Kapitel 13 - Gegner-KI: Bewegung

Musterloesung zu Kapitel 13 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

- `hasSupportAhead()`: prueft VOR jedem Schritt, ob voraus noch Boden
  ist - unabhaengig von der tatsaechlichen Plattformlaenge
- Feste Patrouillengrenzen (`patrolLeft`/`patrolRight`) allein reichen
  nicht - sie wissen nichts von der Plattformgeometrie
- Zufaelliges Springen respektiert immer zuerst die
  Kantenerkennung (`supported`), sonst wuerde es die eigentliche
  Absicherung unterlaufen

## Dateien

```
Kapitel13/
├── index.html
├── style.css
└── script.js
```
