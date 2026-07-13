# Ninja Fight - Kapitel 10: Nahkampf & Hitboxen

Musterloesung zu Kapitel 10 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 9 auf (Kopie + Erweiterung).

## Steuerung

- Pfeiltasten/WASD: laufen, springen (Leertaste), klettern
- **J**: Schlag, **K**: Tritt, **L**: Schwert (von Anfang an unbegrenzt verfuegbar)

## Was hier neu dazugekommen ist

- 3 Gegner in Level 1 (Blue) und Level 2 (Green) - noch ohne Bewegung/KI
- `Hit`/`Kick`/`SwordHit` als neue Animationszustaende
- `ATTACKS`/`DAMAGE` koppeln Reichweite und Schaden je Angriffsart
- `checkMeleeHit()`: prueft waehrend eines laufenden Angriffs einmalig,
  ob die Hitbox einen Gegner trifft
- Gegner koennen sterben und verschwinden (`en.dead`)
- Eine HTML-Liste **unter** dem Canvas zeigt die Lebenspunkte jedes
  Gegners live an

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Dateien

```
Kapitel10/
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
