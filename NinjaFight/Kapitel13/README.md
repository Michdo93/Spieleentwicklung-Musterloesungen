# Ninja Fight - Kapitel 13: Gegner-KI: Bewegung

Musterloesung zu Kapitel 13 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 12 auf (Kopie + Erweiterung).

## Was hier neu dazugekommen ist

- Die 3 Gegner patrouillieren jetzt selbststaendig
- `hasSupportAhead()`: Kantenerkennung, bevor der Gegner ueber eine
  Plattform hinauslaeuft
- Gelegentliches, zufaelliges Springen (nur wenn sicher)
- Eigene Patrouillengrenzen pro Gegner

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Dateien

```
Kapitel13/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/sprites/
        ├── hero.png
        ├── blue.png
        ├── green.png
        └── tiles.png
```
