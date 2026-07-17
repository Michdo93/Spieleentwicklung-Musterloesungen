# Kapitel 13 - Gegner-KI: Bewegung

Musterlösung zu Kapitel 13 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

## Ausführen

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **Naive Patrouille** - läuft blind über die Kante einer zu kurzen
   Plattform
2. **Mit Kantenerkennung** - `hasSupportAhead()` verhindert das
3. **Gelegentliches Springen** - nur wenn auch danach noch Boden
   erwartet wird

## Dateien

```
Kapitel13/
├── index.html
├── style.css
├── script.js
└── assets/blue.png
```
