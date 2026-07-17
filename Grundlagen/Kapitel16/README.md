# Kapitel 16 - HUD & Spielstatus

Musterlösung zu Kapitel 16 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

## Ausführen

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **Die richtige Balkenposition** - ein zu kleiner Abstand legt den
   Lebensbalken mitten in den Kopf der Figur
2. **HUD-Text als DOM-Overlay**
3. **Wann aktualisiert sich das HUD?** - jeden Frame ist robuster als
   nur bei Ereignissen

## Dateien

```
Kapitel16/
├── index.html
├── style.css
├── script.js
└── assets/red.png
```
