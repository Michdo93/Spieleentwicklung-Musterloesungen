# Ninja Fight - Kapitel 2: Sprites zeichnen

Musterloesung zu Kapitel 2 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 1 auf (Kopie + Erweiterung).

## Ausfuehren

```bash
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```

## Was hier neu dazugekommen ist

- `drawTile()` - zeichnet Level-Kacheln aus dem gemeinsamen
  `tiles.png`-Sheet; eine Reihe Boden-Kacheln laeuft jetzt ueber die
  gesamte Buehnenbreite
- `drawHero()` - kann den Helden jetzt auch gespiegelt (nach links
  blickend) zeichnen, per `translate()` + `scale(-1, 1)`

## Dateien

```
Kapitel02/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/sprites/
        ├── hero.png
        └── tiles.png
```
