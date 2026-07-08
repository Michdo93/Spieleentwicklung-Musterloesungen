# Kapitel 17 - Menüs & Spielzustände

Musterloesung zu Kapitel 17 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

- `showScreen(name)`: entfernt "active" von allen Bildschirmen, setzt
  es nur auf den gewuenschten - nie zwei gleichzeitig sichtbar
- Der Bug-Modus-Schalter reproduziert einen echten CSS-Fehler: eine
  gemeinsame `.screen`-Basisklasse verdunkelte urspruenglich auch den
  Spielbildschirm selbst
- Der Fix: ein ID-Selektor (`#screen-game.active`) hat hoehere
  Spezifitaet als die Klassenregel und gewinnt daher unabhaengig von
  der Reihenfolge im Stylesheet
- ESC-Taste und Buttons loesen denselben Zustandswechsel aus

## Dateien

```
Kapitel17/
├── index.html
├── style.css
└── script.js
```
