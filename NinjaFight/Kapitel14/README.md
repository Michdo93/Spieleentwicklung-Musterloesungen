# Ninja Fight - Kapitel 14: Gegner-KI: Kampf & Gegnertypen

Musterloesung zu Kapitel 14 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 13 auf (Kopie + Erweiterung). Der Gegner ist jetzt
vom Typ `Green` (kann Shuriken werfen).

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier neu dazugekommen ist

- `ENEMY_TYPES`/`HP_BY_TYPE`: Faehigkeiten und Lebenspunkte an den
  Gegnertyp gekoppelt (Blue/Green/Red/White)
- `updateEnemyCombat()`: Entscheidungsbaum nach Abstand - Nahkampf
  zuerst, dann Fernkampf, dann Schwert
- Der Gegner kann den Helden jetzt tatsaechlich verletzen
  (`heroTakeDamage()`)
- Shuriken treffen jeden ausser dem Werfer - dadurch bringt derselbe
  Code aus Kapitel 11 Friendly Fire zwischen mehreren Gegnern gratis
  mit

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
        └── tiles.png
```
