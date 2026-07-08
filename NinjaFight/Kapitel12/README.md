# Ninja Fight - Kapitel 12: Items & Power-Ups

Musterloesung zu Kapitel 12 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 11 auf (Kopie + Erweiterung).

## Steuerung

- Pfeiltasten/WASD: laufen, springen (Leertaste), klettern
- **J**: Schlag, **K**: Tritt, **L**: Shuriken werfen (braucht zuerst
  aufgesammelte Shuriken!)

## Was hier neu dazugekommen ist

- Die `PowerUp`-Klasse: faellt mit derselben Schwerkraft wie der Held,
  landet auf `level.platforms`
- Drei Items zu Levelbeginn: Herz, Schwert, Shuriken
- Drei Effekt-Muster: **sofortig** (Herz heilt direkt),
  **zeitbegrenzt** (Schwert 30s), **zaehlbegrenzt** (Shuriken-Munition)
- `throwShuriken()` braucht jetzt `hasShuriken`/`shurikenCount` - ohne
  aufgesammelte Shuriken kann nicht mehr geworfen werden
- Items pruefen ALLE Kandidaten (Held und Gegner) - wer zuerst
  ankommt, bekommt das Item

## Dateien

```
Kapitel12/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/sprites/
        ├── hero.png
        ├── blue.png
        └── tiles.png
```
