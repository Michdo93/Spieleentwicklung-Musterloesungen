# Ninja Fight - Kapitel 5: Bewegung & Schwerkraft

Musterloesung zu Kapitel 5 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 4 auf (Kopie + Erweiterung).

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier neu dazugekommen ist

- Der Held bewegt sich jetzt tatsaechlich: `keys.left`/`keys.right`
  bewegen ihn mit `WALK_SPEED`, `keys.jump` (Leertaste) loest einen
  Sprung aus
- Schwerkraft (`GRAVITY`) und Sprunggeschwindigkeit (`JUMP_SPEED`) -
  identische Werte wie im fertigen Spiel
- Animationszustand wechselt automatisch zwischen `Idle`, `Walk` und
  `Jump`
- Gelandet wird vorerst auf einem festen Boden (`GROUND_TOP_Y`) -
  echte Plattformen mit Luecken folgen in Kapitel 6

## Dateien

```
Kapitel05/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/sprites/
        ├── hero.png
        └── tiles.png
```
