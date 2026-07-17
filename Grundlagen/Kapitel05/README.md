# Kapitel 5 - Bewegung & Schwerkraft

Musterlösung zu Kapitel 5 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

## Ausführen

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **Position vs. Geschwindigkeit** - konstante Geschwindigkeit
   (`x += SPEED*dt`) vs. Beschleunigung (`vx` wächst selbst)
2. **Schwerkraft** - `vy += GRAVITY*dt`, `y += vy*dt`
3. **Der vollständige Sprung** - Leertaste setzt `vy = -JUMP_SPEED`,
   danach übernimmt dieselbe Schwerkraft

## Dateien

```
Kapitel05/
├── index.html
├── style.css
└── script.js
```
