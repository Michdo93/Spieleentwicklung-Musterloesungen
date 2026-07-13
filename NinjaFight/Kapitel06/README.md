# Ninja Fight - Kapitel 6: Kollision & Plattformen

Musterloesung zu Kapitel 6 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 5 auf (Kopie + Erweiterung).

## Korrektur gegenueber der ersten Fassung

Der Held schwebte zuvor sichtbar ueber Plattformen und fiel an der
falschen Stelle durch. Ursache war eine fehlerhafte Umrechnung
zwischen Sprite-Groesse und Plattformhoehe. Seit `hero.x`/`hero.y`
(Kapitel 2) den tatsaechlichen Fusspunkt der Figur bedeuten, ist die
Landepruefung direkt und fehlerfrei - kein Umrechnen mehr noetig.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Dateien

```
Kapitel06/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/sprites/
        ├── hero.png
        └── tiles.png
```

## Nachtraeglicher Fix (korrigiert)

`findLanding()` prueft mit einer Toleranz (`FOOT_MARGIN`) statt eines
exakten Punktvergleichs. Der erste Versuch (6px) war zu klein und
fuehlte sich beim Spielen an, als wuerde man an Kanten zu frueh
herunterfallen, obwohl man optisch noch auf der Plattform stand.
Nach dem Vermessen der sichtbaren Sprite-Breite (siehe Buch) liegt
`FOOT_MARGIN` jetzt bei 16 Pixel.

## Weiterer Fix: Plattformbreiten als Vielfache der Kachelbreite

Die Plattformbreiten (`w: 380`, `w: 200`, `w: 160`) waren keine
sauberen Vielfachen von 41 (Kachelbreite) - die zuletzt gezeichnete
Kachel ragte dadurch sichtbar ueber die Kollisionsgrenze hinaus. Man
sah Boden, auf dem `findLanding()` bereits nicht mehr "darueber"
erkannte, und fiel scheinbar mitten auf sichtbarem Boden herunter.
Jetzt sind alle Breiten als `N * 41` angegeben (`9 * 41`, `4 * 41`).
