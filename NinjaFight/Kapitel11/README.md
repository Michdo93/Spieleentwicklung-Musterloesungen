# Ninja Fight - Kapitel 11: Fernkampf & Projektile

Musterloesung zu Kapitel 11 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 10 auf (Kopie + Erweiterung).

## Steuerung

- Pfeiltasten/WASD: laufen, springen (Leertaste), klettern
- **J**: Schlag, **K**: Tritt, **L**: Shuriken werfen

## Was hier neu dazugekommen ist

- Die `Projectile`-Klasse: eigene Position, eigene Geschwindigkeit,
  eigenes `update()` - unabhaengig vom Werfer
- `Throw` als neuer, nicht-endloser Animationszustand
- Jedes geworfene Shuriken ist ein echtes Objekt in einem
  `projectiles`-Array, nicht nur eine Wurfanimation
- Ein Projektil kennt seinen Werfer (`owner`) und trifft ihn nicht

## Dateien

```
Kapitel11/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/sprites/
        ├── hero.png
        ├── blue.png
        └── tiles.png
```
