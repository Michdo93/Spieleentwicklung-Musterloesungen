# Ninja Fight - Kapitel 12: Items & Power-Ups

Musterloesung zu Kapitel 12 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 11 auf (Kopie + Erweiterung).

## Was hier neu dazugekommen ist

- `PowerUp`-Klasse: faellt mit derselben Schwerkraft wie eine Figur,
  landet auf `level.platforms`
- `setupPowerUpSchedule()`: 3-10 zufaellige Items (70% Herz, 20%
  Shuriken, 10% Schwert), die in zeitlichen Abstaenden ins Level
  fallen (vereinfacht auf einen festen Zeitabstand, da unser Buch das
  Level-Zeitlimit erst in Kapitel 18 einfuehrt)
- `hero.collectPowerUp()`: die drei Effekt-Muster
  (sofortig/befristet/zaehlbasiert)
- Jeder Kandidat (Held UND Gegner) kann ein Item aufheben

## Ausfuehren

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
