# Ninja Fight - Kapitel 7: Level-Daten & Tile-Rendering

Musterloesung zu Kapitel 7 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 6 auf (Kopie + Erweiterung).

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier neu dazugekommen ist

- `LEVELS` - die hartkodierte `platforms`-Liste aus Kapitel 6 wird
  durch echte Level-Daten ersetzt (entspricht `levels.js`)
- `buildLevel()` sortiert die flache Rohdatenliste einmal nach
  Bedeutung (`PLATFORM_TYPES`) - entspricht `buildLevel()` in
  `render.js`
- Der Rest des Spiels (Bewegung, Kollision, Zeichnen) arbeitet nur
  noch mit `level.platforms`, nie mehr mit rohen Typnamen

## Dateien

```
Kapitel07/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/sprites/
        ├── hero.png
        └── tiles.png
```
