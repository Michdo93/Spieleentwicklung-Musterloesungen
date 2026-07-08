# Kapitel 6 - Kollision & Plattformen

Musterloesung zu Kapitel 6 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

- Der AABB-Kollisionstest (`overlaps()`): zwei Rechtecke ueberlappen
  sich, wenn sie sich auf beiden Achsen gleichzeitig ueberschneiden
- `findLanding()`: sucht unter mehreren Plattformen diejenige, auf der
  die Figur gerade landen wuerde
- Landen auf mehreren Plattformen unterschiedlicher Hoehe statt nur
  auf einem einzigen festen Boden

## Dateien

```
Kapitel06/
├── index.html
├── style.css
└── script.js
```
