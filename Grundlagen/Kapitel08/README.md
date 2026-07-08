# Kapitel 8 - Hindernisse & Gefahren

Musterloesung zu Kapitel 8 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

- `checkHazards()`: prueft, ob die Figur in einer Gefahrenzone steht
- Wasser ist bewusst KEINE Gefahr - nur zur Anschauung, dass nicht
  jedes auffaellige Element automatisch schadet
- Feuer und Stacheln schaden per Abklingzeit (`invulnTimer`), nicht
  bei jedem einzelnen Frame - sonst waeren es bei 60fps auch 60
  Treffer pro Sekunde
- Reihenfolge: erst pruefen/Schaden zufuegen, dann den Timer
  runterzaehlen

## Dateien

```
Kapitel08/
├── index.html
├── style.css
└── script.js
```
