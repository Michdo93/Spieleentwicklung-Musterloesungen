# Ninja Fight - Kapitel 2: Sprites zeichnen

Musterlösung zu Kapitel 2 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

Baut auf Kapitel 1 auf (Kopie + Erweiterung).

## Korrektur gegenüber der ersten Fassung

- Der Held wird jetzt in der echten Größe gezeichnet
  (`SPRITE_SCALE = 0.45` statt volle 160x150px Zellgröße)
- Die Spiegelachse ist jetzt der tatsächliche Fußpunkt der Figur
  (`ANCHOR_X = 30, ANCHOR_Y = 145`, identisch zu
  `CHARACTER_SHEET.anchorX/anchorY` im fertigen Spiel) statt der
  Mitte des ausgeschnittenen Zellbereichs
- `hero.x`/`hero.y` bedeuten ab jetzt den Fußpunkt der Figur auf der
  Bühne, nicht mehr die linke obere Ecke der Sprite-Zelle

## Ausführen

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
