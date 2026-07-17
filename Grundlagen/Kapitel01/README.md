# Kapitel 1 - Canvas-Grundlagen & Game-Loop

Musterlösung zu Kapitel 1 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

## Ausführen

```bash
python3 -m http.server 8000
```

## Was hier passiert

Drei unabhängige Beispiele, jedes auf seinem eigenen `<canvas>`:

1. **Statisches Zeichnen** - ein einziger Zeichenaufruf, kein Loop
2. **Naiver Loop** - fester Pixel-Schritt pro Frame (bildratenabhängig)
3. **Zeitbasierter Loop** - `SPEED * dt`, läuft auf jedem Bildschirm
   gleich schnell - exakt die Struktur aus `GameManager.loop()` in
   Ninja Fight

## Dateien

```
Kapitel01/
├── index.html
├── style.css
└── script.js
```
