# Ninja Fight - Kapitel 18: Highscores & Levelfortschritt

Musterlösung zu Kapitel 18 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

Das letzte Kapitel des 18-Kapitel-Grundgerüsts - baut auf Kapitel 17
auf (Kopie + Erweiterung).

## Was hier neu dazugekommen ist

- Ein Game-Over/Sieg-Bildschirm mit Highscore-Formular
  (`localStorage`-basiert, sortiert, auf Top 10 begrenzt)
- `endGame(won, reason)`: Niederlage bei `hero.lifeEnergy <= 0`, Sieg
  wenn in Level 2 alle Gegner besiegt sind
- `resetGame()`: setzt Held, Gegner, Punkte, Level und Power-Ups
  zurück für einen Neustart

## Ausführen

```bash
python3 -m http.server 8000
```

## Und jetzt?

Damit ist das 18-Kapitel-Grundgerüst von Ninja Fight komplett. Das
allerletzte Kapitel des Buchs (Kapitel 19) gleicht unser
selbstgebautes Spiel Schritt für Schritt an das tatsächliche
Original an - inklusive aller zehn Level, aller vier Gegnertypen im
Zusammenspiel und dem vollständigen Menüsystem.

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
