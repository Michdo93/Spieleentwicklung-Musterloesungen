# Ninja Fight - Kapitel 17: Menüs & Spielzustände

Musterloesung zu Kapitel 17 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 16 auf (Kopie + Erweiterung).

## Was hier neu dazugekommen ist

- Start-, Spiel- und Pause-Bildschirm als sich gegenseitig
  ausschliessende Zustaende (`showScreen()`)
- Der Game-Loop laeuft nur noch im Zustand `"game"` - im Pause- oder
  Start-Zustand plant er sich selbst nicht erneut ein
- ESC-Taste und Buttons loesen denselben Zustandswechsel aus

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Dateien

```
Kapitel17/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    ├── sounds/...
    └── img/sprites/...
```
