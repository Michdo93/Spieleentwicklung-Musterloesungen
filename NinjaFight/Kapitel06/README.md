# Ninja Fight - Kapitel 6: Kollision & Plattformen

Musterloesung zu Kapitel 6 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 5 auf (Kopie + Erweiterung).

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier neu dazugekommen ist

- `platforms` - eine Liste aus mehreren Plattformen auf
  unterschiedlichen Hoehen, statt eines einzigen festen Bodens
- `findLanding()` - sucht bei jedem Frame die passende Plattform
  darunter (horizontal drueber + eben noch drueber + jetzt (fast)
  drauf)
- Der Held kann jetzt zwischen Plattformen springen und ueber eine
  Luecke im Boden fallen

## Dateien

```
Kapitel06/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/sprites/
        ├── hero.png
        └── tiles.png
```
