# Ninja Fight - Kapitel 4: Tastatur- & Maus-Eingabe

Musterloesung zu Kapitel 4 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 3 auf (Kopie + Erweiterung).

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier neu dazugekommen ist

- `keys` - das Key-State-Objekt (entspricht `GameManager.keys` in
  Ninja Fight), befuellt per `keydown`/`keyup`
- Ein Mausklick-Trefftest: Klickst du auf den Helden, dreht er sich
  probeweise um (`hero.facing *= -1`)
- Eine Debug-Zeile zeigt an, welche Tasten gerade gedrueckt sind

Der Held bewegt sich hier **noch nicht** - `keys` wird zwar befuellt,
aber erst in Kapitel 5 tatsaechlich fuer Bewegung ausgewertet.

## Dateien

```
Kapitel04/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/sprites/
        ├── hero.png
        └── tiles.png
```
