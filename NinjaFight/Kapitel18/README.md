# Ninja Fight - Kapitel 18: Highscores & Levelfortschritt

Musterloesung zu Kapitel 18 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Das letzte Kapitel - baut auf Kapitel 17 auf (Kopie + Erweiterung).

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier neu dazugekommen ist

- Ein Game-Over-Bildschirm mit Highscore-Formular
  (`localStorage`-basiert, sortiert, auf Top 10 begrenzt)
- `endGame()`: wird ausgeloest, sobald `hero.lifeEnergy <= 0` erreicht
- `resetGame()`: setzt Held, Gegner, Punkte und Spielzeit zurueck fuer
  einen Neustart

## Und jetzt?

Alle 18 Kapitel zusammen ergeben ein vollstaendiges, spielbares
Ninja-Fight-Grundgeruest. Wer bis hierhin gefolgt ist, hat jede
einzelne Technik gesehen, die im fertigen Spiel steckt - vom leeren
`<canvas>` in Kapitel 1 bis zur kompletten Spiellogik hier. Das volle,
fertige Spiel mit allen 10 Leveln, allen 4 Gegnertypen und dem
kompletten Men\u00fc-System findest du unter
<https://github.com/Michdo93/NinjaFight>.

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
