# Kapitel 2 - Sprites zeichnen

Musterlösung zu Kapitel 2 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

## Ausführen

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **drawImage()-Grundformen** - ganzes Sheet vs. ein ausgeschnittener Frame
2. **Spiegeln - falsch vs. richtig**: die Spiegelachse muss der
   tatsächliche "Fußpunkt" der Figur sein, nicht die Mitte des
   ausgeschnittenen Zellbereichs. Falsch gespiegelt "springt" die
   Figur seitlich; richtig gespiegelt bleibt sie exakt an derselben
   Stelle
3. **Skalierung und Position per Regler** - dieselbe Zeichenlogik,
   aber Größe/Position kommen aus Reglern statt fest im Code zu
   stehen

## Dateien

```
Kapitel02/
├── index.html
├── style.css
├── script.js
└── assets/hero.png
```
