# Kapitel 7 - Level-Daten & Tile-Rendering

Musterloesung zu Kapitel 7 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

- Level als reine Datenliste (`{ type, x, y }`) statt hartkodierter
  `fillRect()`-Aufrufe
- `buildLevel()` sortiert die flache Rohdatenliste einmal nach
  Bedeutung (Plattform oder nicht)
- Ein Klick auf den Knopf tauscht das komplette Level aus - derselbe
  Zeichencode stellt zwei unterschiedliche Level dar

## Dateien

```
Kapitel07/
├── index.html
├── style.css
└── script.js
```
