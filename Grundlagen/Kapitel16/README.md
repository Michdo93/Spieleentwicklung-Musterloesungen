# Kapitel 16 - HUD & Spielstatus

Musterloesung zu Kapitel 16 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

- `drawHealthBar()`: ein Hintergrundrechteck plus ein proportional
  skaliertes Rechteck - mehr steckt nicht hinter einem Lebensbalken
- Ein DOM-Overlay (`#hud`) fuer Text-HUD-Elemente (Leben, Punkte,
  Zeit) statt alles auf den Canvas zu zeichnen
- `updateHudText()` wird JEDEN Frame aufgerufen, nicht nur bei
  Ereignissen - robuster gegen vergessene Aktualisierungsstellen

## Dateien

```
Kapitel16/
├── index.html
├── style.css
└── script.js
```
