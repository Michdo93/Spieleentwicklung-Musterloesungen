# Kapitel 11 - Fernkampf & Projektile

Musterloesung zu Kapitel 11 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

- Die `Projectile`-Klasse: eigene Position, eigene Geschwindigkeit,
  eigenes `update()` - unabhaengig vom Werfer
- Ein Wurf braucht ein echtes OBJEKT, nicht nur eine Animation
- Ein Projektil kennt seinen Werfer (`owner`) und trifft diesen nicht
- Projektile ausserhalb des sichtbaren Bereichs werden entfernt

## Dateien

```
Kapitel11/
├── index.html
├── style.css
└── script.js
```
