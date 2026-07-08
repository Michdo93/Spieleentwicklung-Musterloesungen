# Ninja Fight - Kapitel 8: Hindernisse & Gefahren

Musterloesung zu Kapitel 8 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 7 auf (Kopie + Erweiterung).

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier neu dazugekommen ist

- Zwei neue Level-Elementtypen: `Flame` (Feuer, animiert) und `Knives`
  (Messer, statisch) - beide echte Gefahren
- `HAZARD_TYPES` beschreibt Schaden und Abklingzeit je Gefahrentyp
- `checkHazards()` prueft bei jedem Frame, ob der Held gerade in
  einer Gefahrenzone steht, und zieht ggf. Lebensenergie ab
- Der Held blinkt kurz, waehrend er unverwundbar ist (`invulnTimer`)
- Eine HUD-Zeile zeigt die verbleibende Lebensenergie

## Dateien

```
Kapitel08/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/sprites/
        ├── hero.png
        └── tiles.png
```
