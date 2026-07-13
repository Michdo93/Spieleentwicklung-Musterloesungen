# Ninja Fight - Kapitel 2: Sprites zeichnen

Musterloesung zu Kapitel 2 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 1 auf (Kopie + Erweiterung).

## Korrektur gegenueber der ersten Fassung

- Der Held wird jetzt in der echten Groesse gezeichnet
  (`SPRITE_SCALE = 0.45` statt volle 160x150px Zellgroesse)
- Die Spiegelachse ist jetzt der tatsaechliche Fusspunkt der Figur
  (`ANCHOR_X = 30, ANCHOR_Y = 145`, identisch zu
  `CHARACTER_SHEET.anchorX/anchorY` im fertigen Spiel) statt der
  Mitte des ausgeschnittenen Zellbereichs
- `hero.x`/`hero.y` bedeuten ab jetzt den Fusspunkt der Figur auf der
  Buehne, nicht mehr die linke obere Ecke der Sprite-Zelle

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Dateien

```
Kapitel02/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/sprites/
        ├── hero.png
        └── tiles.png
```
