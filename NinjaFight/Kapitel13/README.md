# Ninja Fight - Kapitel 13: Gegner-KI: Bewegung

Musterloesung zu Kapitel 13 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 12 auf (Kopie + Erweiterung).

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier neu dazugekommen ist

- `updateEnemy()`: der Test-Gegner patrouilliert jetzt selbststaendig
  auf dem Bodenabschnitt
- `hasSupportAhead()`: erkennt die Kante der Plattform, bevor der
  Gegner darueber hinauslaeuft
- Gelegentliches, zufaelliges Springen - nur wenn `supported` true ist
- Patrouillengrenzen (`patrolLeft`/`patrolRight`) als zusaetzliche
  Absicherung

## Dateien

```
Kapitel13/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/sprites/
        ├── hero.png
        ├── blue.png
        └── tiles.png
```
