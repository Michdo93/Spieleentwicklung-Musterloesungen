# Ninja Fight - Kapitel 16: HUD & Spielstatus

Musterloesung zu Kapitel 16 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 15 auf (Kopie + Erweiterung).

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier neu dazugekommen ist

- Ein DOM-Overlay (`#hud`) fuer Leben, Waffen, Punkte und Spielzeit -
  liegt als HTML/CSS ueber dem Canvas
- `drawHealthBar()`: ersetzt die bisherige manuelle Balkenzeichnung
  ueber dem Gegner
- `updateHud()` wird JEDEN Frame aufgerufen (aus `update()`), nicht
  nur bei Ereignissen
- Besiegte Gegner geben Punkte

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
