# Ninja Fight - Kapitel 11: Fernkampf & Projektile

Musterlösung zu Kapitel 11 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

Baut auf Kapitel 10 auf (Kopie + Erweiterung).

## Steuerung

- Pfeiltasten/WASD: laufen, springen (Leertaste), klettern
- **J**: Schlag, **K**: Tritt, **L**: Schwert, **U**: Shuriken werfen

## Was hier neu dazugekommen ist

- Der Held hat von Anfang an **100 Shuriken** dabei
- `Projectile`-Klasse: eigene Position, eigene Geschwindigkeit,
  eigenes `update()`, kennt seinen Werfer
- `throwShuriken()` verbraucht ein Shuriken und erzeugt ein echtes
  Projektil (nicht nur die Wurfanimation - siehe Buch für die echte
  Bug-Geschichte dazu)
- `Throw` als neuer Animationszustand

## Ausführen

```bash
python3 -m http.server 8000
```

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
        ├── green.png
        └── tiles.png
```
