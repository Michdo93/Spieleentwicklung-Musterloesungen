# Kapitel 2 - Sprites zeichnen

Musterloesung zu Kapitel 2 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **drawImage()-Grundformen** - ganzes Sheet vs. ein ausgeschnittener Frame
2. **Spiegeln - falsch vs. richtig**: die Spiegelachse muss der
   tatsaechliche "Fusspunkt" der Figur sein, nicht die Mitte des
   ausgeschnittenen Zellbereichs. Falsch gespiegelt "springt" die
   Figur seitlich; richtig gespiegelt bleibt sie exakt an derselben
   Stelle
3. **Skalierung und Position per Regler** - dieselbe Zeichenlogik,
   aber Groesse/Position kommen aus Reglern statt fest im Code zu
   stehen

## Dateien

```
Kapitel02/
├── index.html
├── style.css
├── script.js
└── assets/hero.png
```
