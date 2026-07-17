# Ninja Fight - Kapitel 16: HUD & Spielstatus

Musterlösung zu Kapitel 16 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

Baut auf Kapitel 15 auf (Kopie + Erweiterung).

## Was hier neu dazugekommen ist

- `drawHealthBar()`: Lebensbalken über jedem Gegnerkopf
- Ein DOM-Overlay (`#hud`) für Leben, Waffen, Punkte und Level
- `updateHud()` wird JEDEN Frame aufgerufen (aus `update()`)
- Besiegte Gegner geben Punkte

## Ausführen

```bash
python3 -m http.server 8000
```

## Dateien

```
Kapitel16/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    ├── sounds/...
    └── img/sprites/...
```
