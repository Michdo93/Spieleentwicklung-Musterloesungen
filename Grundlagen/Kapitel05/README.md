# Kapitel 5 - Bewegung & Schwerkraft

Musterloesung zu Kapitel 5 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **Position vs. Geschwindigkeit** - konstante Geschwindigkeit
   (`x += SPEED*dt`) vs. Beschleunigung (`vx` waechst selbst)
2. **Schwerkraft** - `vy += GRAVITY*dt`, `y += vy*dt`
3. **Der vollstaendige Sprung** - Leertaste setzt `vy = -JUMP_SPEED`,
   danach uebernimmt dieselbe Schwerkraft

## Dateien

```
Kapitel05/
├── index.html
├── style.css
└── script.js
```
