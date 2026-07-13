# Kapitel 3 - Sprite-Animation

Musterloesung zu Kapitel 3 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **Von Hand durchklicken** - Frame fuer Frame per Button, zeigt: eine
   Animation ist nur eine Liste von Posen
2. **Automatisch mit FPS-Regler** - `frame = Math.floor(t*fps) % count`,
   Geschwindigkeit live einstellbar
3. **Mehrere Zustaende** - Idle/Walk (endlos) vs. Jump (einmalig, bleibt
   am letzten Frame stehen)

## Dateien

```
Kapitel03/
├── index.html
├── style.css
├── script.js
└── assets/hero.png
```
