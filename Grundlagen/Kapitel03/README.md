# Kapitel 3 - Sprite-Animation

Musterlösung zu Kapitel 3 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

## Ausführen

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **Von Hand durchklicken** - Frame für Frame per Button, zeigt: eine
   Animation ist nur eine Liste von Posen
2. **Automatisch mit FPS-Regler** - `frame = Math.floor(t*fps) % count`,
   Geschwindigkeit live einstellbar
3. **Mehrere Zustände** - Idle/Walk (endlos) vs. Jump (einmalig, bleibt
   am letzten Frame stehen)

## Dateien

```
Kapitel03/
├── index.html
├── style.css
├── script.js
└── assets/hero.png
```
