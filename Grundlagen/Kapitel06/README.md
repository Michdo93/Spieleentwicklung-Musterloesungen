# Kapitel 6 - Kollision & Plattformen

Musterloesung zu Kapitel 6 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

## Ausführen

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **AABB-Kollision** - `overlaps()`, mit der Maus steuerbar
2. **Landung auf einer Plattform** - `findLanding()`, identisch zur
   Prüfung aus `Hero.findLanding()`
3. **Mehrere Plattformen** - zusaetzlich der Unterschied zwischen
   sichtbarem Sprite (gross) und tatsaechlicher Trefferbox (klein,
   gestrichelt) - reale Figuren sind für Kollisionszwecke fast immer
   kleiner als sie gezeichnet werden

## Dateien

```
Kapitel06/
├── index.html
├── style.css
└── script.js
```
