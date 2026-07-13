# Ninja Fight - Kapitel 5: Bewegung & Schwerkraft

Musterloesung zu Kapitel 5 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 4 auf (Kopie + Erweiterung).

## Korrektur gegenueber der ersten Fassung

Die Bewegungslogik (Laufen/Idle/Springen) war inhaltlich bereits
richtig - der Folgefehler lag in der Sprite-Darstellung: zu grosse
Anzeige und falsche Spiegelachse. Beides ist jetzt identisch zu
Kapitel 2/3/4 korrigiert (`SPRITE_SCALE = 0.45`,
`ANCHOR_X`/`ANCHOR_Y` als Spiegelachse, `hero.x`/`hero.y` = Fusspunkt).

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Dateien

```
Kapitel05/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/sprites/
        ├── hero.png
        └── tiles.png
```

## Nachtraeglicher Fix

`hero.x` wird jetzt auf `EDGE_MARGIN`/`STAGE_W - EDGE_MARGIN` statt
auf `0`/`STAGE_W` begrenzt - sonst waere je nach Blickrichtung ein
grosser Teil des Sprites am Buehnenrand nicht mehr sichtbar gewesen.
