# Ninja Fight - Kapitel 8: Hindernisse & Gefahren

Musterlösung zu Kapitel 8 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

Baut auf Kapitel 7 auf (Kopie + Erweiterung).

## Was hier neu dazugekommen ist

- `HAZARD_TYPES` (Flame: 1 Schaden, Knives: 5 Schaden, je 0,6s
  Abklingzeit)
- `buildLevel()` sortiert Flame/Knives jetzt zusätzlich in
  `level.hazards`
- `checkHazards()` prüft jeden Frame, ob der Held in einer
  Gefahrenzone steht
- Der Held blinkt kurz während der Unverwundbarkeit
- HUD-Zeile zeigt die verbleibende Lebensenergie

**Wichtig:** Sterben und Game Over gibt es in diesem Kapitel noch
nicht - der Held verliert nur Lebenspunkte, auch bei 0 passiert noch
nichts weiter.

## Ausführen

```bash
python3 -m http.server 8000
```

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
