# Ninja Fight - Kapitel 12: Items & Power-Ups

Musterlösung zu Kapitel 12 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

Baut auf Kapitel 11 auf (Kopie + Erweiterung).

## Was hier neu dazugekommen ist

- `PowerUp`-Klasse: fällt mit derselben Schwerkraft wie eine Figur,
  landet auf `level.platforms`
- `setupPowerUpSchedule()`: 3-10 zufällige Items (70% Herz, 20%
  Shuriken, 10% Schwert), die in zeitlichen Abständen ins Level
  fallen (vereinfacht auf einen festen Zeitabstand, da unser Buch das
  Level-Zeitlimit erst in Kapitel 18 einführt)
- `hero.collectPowerUp()`: die drei Effekt-Muster
  (sofortig/befristet/zählbasiert)
- Jeder Kandidat (Held UND Gegner) kann ein Item aufheben

## Ausführen

```bash
python3 -m http.server 8000
```

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
        ├── green.png
        └── tiles.png
```

## Nachträglicher Fix

Die Kollisionsprüfung beim Einsammeln von Power-Ups
(`PowerUp.update()`) verglich `c.y` und `this.y` vorher mit einem
fehlerhaften Versatz (`c.y - 30 - this.y`) - dadurch ließen sich
Items nur beim Durchspringen von unten einsammeln, nicht beim
normalen Hineinlaufen. Behoben auf einen direkten Vergleich
(`c.y - this.y`).
