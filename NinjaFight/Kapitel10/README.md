# Ninja Fight - Kapitel 10: Nahkampf & Hitboxen

Musterloesung zu Kapitel 10 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 9 auf (Kopie + Erweiterung).

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Steuerung

- Pfeiltasten/WASD: laufen, springen (Leertaste), klettern
- **J**: Schlag (1 Schaden, kurze Reichweite)
- **K**: Tritt (2 Schaden, groessere Reichweite)

## Was hier neu dazugekommen ist

- `Hit` und `Kick` als neue, nicht-endlose Animationszustaende
- `ATTACKS` koppelt Reichweite und Schaden je Angriffsart
- `checkMeleeHit()` (entspricht `hitNearbyEnemies()`): prueft waehrend
  eines laufenden Angriffs, ob die Hitbox den Gegner trifft
- `attackHitDone` verhindert Mehrfachtreffer waehrend einer einzigen
  Angriffsanimation
- Ein einzelner Test-Gegner mit HP-Balken (noch ohne KI - die kommt
  erst in Kapitel 13/14)

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
        └── tiles.png
```
