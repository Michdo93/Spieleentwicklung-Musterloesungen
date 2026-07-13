# Ninja Fight - Kapitel 14: Gegner-KI: Kampf & Gegnertypen

Musterloesung zu Kapitel 14 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 13 auf (Kopie + Erweiterung).

## Was hier neu dazugekommen ist

- `ENEMY_TYPES`/`HP_BY_TYPE` fuer alle vier Gegnertypen (Blue, Green,
  Red, White) - auch wenn unsere zwei Level bisher nur Blue und Green
  verwenden
- `updateEnemyCombat()`: Entscheidungsbaum nach Abstand - Nahkampf
  zuerst, dann Fernkampf, dann Schwert
- Gegner koennen den Helden jetzt tatsaechlich verletzen
  (`heroTakeDamage()`)
- Shuriken treffen jeden ausser dem Werfer - Friendly Fire zwischen
  Gegnern ist damit automatisch moeglich, sobald ein Level mehrere
  Gegnertypen gleichzeitig enthaelt

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Dateien

```
Kapitel14/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/sprites/
        ├── hero.png
        ├── blue.png
        ├── green.png
        ├── red.png
        ├── white.png
        └── tiles.png
```
