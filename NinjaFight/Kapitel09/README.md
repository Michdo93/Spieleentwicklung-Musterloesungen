# Ninja Fight - Kapitel 9: Leitern & Klettern

Musterloesung zu Kapitel 9 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 8 auf (Kopie + Erweiterung).

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier neu dazugekommen ist

- Eine Leiter (`Ladder`-Kacheln) verbindet den Boden mit der
  schwebenden Plattform
- `mergeLadderColumns()` fasst einzelne Leiter-Kacheln zu einer
  zusammenhaengenden Kletterzone zusammen
- Der Held erkennt jeden Frame neu, ob er sich in der Leiterzone
  befindet UND nicht gleichzeitig links/rechts gedrueckt wird
  (`hero.onLadder`)
- Im Klettermodus: Schwerkraft aus, Position direkt per Hoch/Runter
  gesteuert, begrenzt auf die Leiterzone

## Dateien

```
Kapitel09/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/sprites/
        ├── hero.png
        └── tiles.png
```
