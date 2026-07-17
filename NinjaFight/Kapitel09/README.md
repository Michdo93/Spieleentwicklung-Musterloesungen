# Ninja Fight - Kapitel 9: Leitern & Klettern

Musterlösung zu Kapitel 9 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

Baut auf Kapitel 8 auf (Kopie + Erweiterung).

## Was hier neu dazugekommen ist

- `mergeLadderColumns()`: fasst einzelne Leiter-Kacheln aus Level 1 zu
  einer zusammenhängenden Kletterzone zusammen
- `hero.onLadder` wird jeden Frame neu berechnet
- Im Klettermodus: Schwerkraft aus, Position direkt per Hoch/Runter
  gesteuert
- `"Climb"` nutzt optisch dieselbe Sprite-Zeile wie `"Jump"` - im
  Original-Flash-Spiel gab es Leitern überhaupt nicht, daher auch
  keine eigene Kletter-Animation

## Ausführen

```bash
python3 -m http.server 8000
```

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
