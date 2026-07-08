# Kapitel 5 - Bewegung & Schwerkraft

Musterloesung zu Kapitel 5 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

- Geschwindigkeit (`vy`) als eigener Wert statt direkter
  Positionsaenderung
- Schwerkraft: `vy += GRAVITY * dt` jeden Frame
- Ein Sprung ist keine eigene Physik, nur ein einmaliger Anstoss nach
  oben (`vy = -JUMP_SPEED`), auf den danach dieselbe Schwerkraft wirkt
- Landungspruefung mit `vy >= 0`, damit man nicht beim Hochfliegen
  "landet"

## Dateien

```
Kapitel05/
├── index.html
├── style.css
└── script.js
```
