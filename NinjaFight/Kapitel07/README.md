# Ninja Fight - Kapitel 7: Level-Daten & Tile-Rendering

Musterlösung zu Kapitel 7 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

Baut auf Kapitel 6 auf (Kopie + Erweiterung).

## Was hier neu dazugekommen ist

- **Die ersten beiden echten Level aus Ninja Fight**, Koordinaten 1:1
  aus `levels.js` übernommen
- `buildLevel()` sortiert die Rohdaten nach Bedeutung
  (`platforms`/`ladders`) - Feuer, Messer und dekorative Elemente
  ignorieren wir hier bewusst noch (Kapitel 8/9)
- Zwei Buttons wechseln zwischen Level 1 und Level 2
- Jeder Plattformtyp (Floor/Bridge/Small/WaterGround) hat seine
  tatsächliche Größe aus `TILE_SHEET`

## Ausführen

```bash
python3 -m http.server 8000
```

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
