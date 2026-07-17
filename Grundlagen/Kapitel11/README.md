# Kapitel 11 - Fernkampf & Projektile

Musterlösung zu Kapitel 11 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

## Ausführen

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **Nur die Animation** - der Original-Bug aus Ninja Fight: die
   Wurfanimation läuft, aber es existiert kein Shuriken-Objekt
2. **Ein echtes Projektil-Objekt** - die `Projectile`-Klasse mit
   eigener Position, Geschwindigkeit, `update()`
3. **Kollision + Werfer ausschließen** - das Projektil trifft jeden
   außer seinem eigenen Werfer

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
