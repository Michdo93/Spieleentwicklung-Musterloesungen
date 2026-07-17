# Ninja Fight - Kapitel 3: Sprite-Animation

Musterlösung zu Kapitel 3 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

Baut auf Kapitel 2 auf (Kopie + Erweiterung).

## Was hier neu dazugekommen ist

- `CHARACTER_STATES` bereits mit allen drei Zuständen (Idle/Walk/Jump)
  vorbereitet - angesteuert wird bislang nur Idle
- `drawHero()` spielt die Idle-Animation jetzt endlos ab statt nur den
  ersten Frame zu zeichnen
- `hero.state`/`hero.animTime` als neue Felder am Held-Objekt

## Ausführen

```bash
python3 -m http.server 8000
```

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
