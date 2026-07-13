# Kapitel 14 - Gegner-KI: Kampf & Gegnertypen

Musterloesung zu Kapitel 14 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **Aggro-Bereich & Angriffsauswahl** - Entscheidungsbaum nach Abstand
2. **Vier Gegnertypen** - Blue/Green/Red/White mit eigenen HP und
   Faehigkeiten
3. **Friendly Fire** - ein Wurf trifft auch andere Gegner, nicht nur
   den Helden

## Dateien

```
Kapitel14/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── hero.png
    ├── blue.png
    ├── green.png
    ├── red.png
    └── white.png
```
