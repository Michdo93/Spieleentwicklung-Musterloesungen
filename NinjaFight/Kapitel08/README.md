# Ninja Fight - Kapitel 8: Hindernisse & Gefahren

Musterloesung zu Kapitel 8 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 7 auf (Kopie + Erweiterung).

## Was hier neu dazugekommen ist

- `HAZARD_TYPES` (Flame: 1 Schaden, Knives: 5 Schaden, je 0,6s
  Abklingzeit)
- `buildLevel()` sortiert Flame/Knives jetzt zusaetzlich in
  `level.hazards`
- `checkHazards()` prueft jeden Frame, ob der Held in einer
  Gefahrenzone steht
- Der Held blinkt kurz waehrend der Unverwundbarkeit
- HUD-Zeile zeigt die verbleibende Lebensenergie

**Wichtig:** Sterben und Game Over gibt es in diesem Kapitel noch
nicht - der Held verliert nur Lebenspunkte, auch bei 0 passiert noch
nichts weiter.

## Ausfuehren

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
