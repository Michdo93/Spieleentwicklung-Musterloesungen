# Kapitel 2 - Sprites zeichnen

Musterloesung zu Kapitel 2 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```

## Was hier passiert

- Ein Bild laden und mit `drawImage()` zeichnen - in seinen zwei
  wichtigsten Formen: das ganze Bild, und ein ausgeschnittener Frame
  daraus (Quellrechteck + Zielrechteck)
- Eine Figur per `translate()` + `scale(-1, 1)` spiegeln, ohne ein
  zweites Bild zu brauchen

## Dateien

```
Kapitel02/
├── index.html
├── style.css
├── script.js
└── assets/hero.png   echtes Sprite-Sheet aus Ninja Fight
```
