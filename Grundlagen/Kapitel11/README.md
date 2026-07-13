# Kapitel 11 - Fernkampf & Projektile

Musterloesung zu Kapitel 11 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **Nur die Animation** - der Original-Bug aus Ninja Fight: die
   Wurfanimation laeuft, aber es existiert kein Shuriken-Objekt
2. **Ein echtes Projektil-Objekt** - die `Projectile`-Klasse mit
   eigener Position, Geschwindigkeit, `update()`
3. **Kollision + Werfer ausschliessen** - das Projektil trifft jeden
   ausser seinem eigenen Werfer

## Dateien

```
Kapitel11/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── hero.png
    ├── green.png
    └── tiles.png
```
