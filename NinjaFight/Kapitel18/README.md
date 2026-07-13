# Ninja Fight - Kapitel 18: Highscores & Levelfortschritt

Musterloesung zu Kapitel 18 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Das letzte Kapitel des 18-Kapitel-Grundgeruests - baut auf Kapitel 17
auf (Kopie + Erweiterung).

## Was hier neu dazugekommen ist

- Ein Game-Over/Sieg-Bildschirm mit Highscore-Formular
  (`localStorage`-basiert, sortiert, auf Top 10 begrenzt)
- `endGame(won, reason)`: Niederlage bei `hero.lifeEnergy <= 0`, Sieg
  wenn in Level 2 alle Gegner besiegt sind
- `resetGame()`: setzt Held, Gegner, Punkte, Level und Power-Ups
  zurueck fuer einen Neustart

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Und jetzt?

Damit ist das 18-Kapitel-Grundgeruest von Ninja Fight komplett. Das
allerletzte Kapitel des Buchs (Kapitel 19) gleicht unser
selbstgebautes Spiel Schritt fuer Schritt an das tatsaechliche
Original an - inklusive aller zehn Level, aller vier Gegnertypen im
Zusammenspiel und dem vollstaendigen Menuesystem.

## Dateien

```
Kapitel18/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    ├── sounds/...
    └── img/sprites/...
```
