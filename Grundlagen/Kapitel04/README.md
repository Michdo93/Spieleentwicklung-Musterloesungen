# Kapitel 4 - Tastatur- & Maus-Eingabe

Musterloesung zu Kapitel 4 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

- Das Key-State-Muster: `keydown`/`keyup` setzen nur Flags in einem
  `keys`-Objekt, der Game-Loop fragt sie jeden Frame ab - dadurch
  bewegt sich das Quadrat, solange eine Taste GEHALTEN wird
- `e.code` statt `e.key` (physische Taste statt layoutabhaengigem
  Zeichen)
- Mausklick-Koordinaten per `getBoundingClientRect()` in
  Canvas-Koordinaten umrechnen, dann ein Rechteck-Trefftest

## Dateien

```
Kapitel04/
├── index.html
├── style.css
└── script.js
```
