# Ninja Fight - Kapitel 3: Sprite-Animation

Musterloesung zu Kapitel 3 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 2 auf (Kopie + Erweiterung).

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier neu dazugekommen ist

- `CHARACTER_STATES` beschreibt Zeile und Frame-Anzahl je
  Animationszustand (bisher nur `Idle`)
- `drawHero()` spielt jetzt die Idle-Animation endlos ab, statt nur
  den ersten Frame zu zeichnen (`frame = Math.floor(animTime * FPS) % count`)
- Der Held bekommt ein echtes Zustandsobjekt (`x`, `y`, `facing`,
  `state`, `animTime`) statt einzelner loser Variablen

## Dateien

```
Kapitel03/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/sprites/
        ├── hero.png
        └── tiles.png
```
