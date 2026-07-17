# Kapitel 7 - Level-Daten & Tile-Rendering

Musterlösung zu Kapitel 7 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

## Ausführen

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **Hartkodiert vs. Daten** - derselbe Level, zwei Schreibweisen
2. **buildLevel()** - sortiert eine flache `{type,x,y}`-Liste nach
   Bedeutung (platforms/ladders/hazards)
3. **Level austauschen** - exakt derselbe Zeichencode, nur eine andere
   Datenliste

## Dateien

```
Kapitel07/
├── index.html
├── style.css
├── script.js
└── assets/tiles.png
```
