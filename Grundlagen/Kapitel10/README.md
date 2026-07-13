# Kapitel 10 - Nahkampf & Hitboxen

Musterloesung zu Kapitel 10 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **Trefferzone vor der Figur** - abhaengig von der Blickrichtung
2. **attackHitDone** - verhindert Mehrfachtreffer waehrend einer
   Angriffsanimation
3. **Unterschiedlicher Schaden je Angriffsart** - Schlag/Tritt/Schwert
   mit je eigener Reichweite und Schadenswert

## Dateien

```
Kapitel10/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── hero.png
    └── blue.png
```
