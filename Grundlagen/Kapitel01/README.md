# Kapitel 1 - Canvas-Grundlagen & Game-Loop

Musterloesung zu Kapitel 1 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

Drei unabhaengige Beispiele, jedes auf seinem eigenen `<canvas>`:

1. **Statisches Zeichnen** - ein einziger Zeichenaufruf, kein Loop
2. **Naiver Loop** - fester Pixel-Schritt pro Frame (bildratenabhaengig)
3. **Zeitbasierter Loop** - `SPEED * dt`, laeuft auf jedem Bildschirm
   gleich schnell - exakt die Struktur aus `GameManager.loop()` in
   Ninja Fight

## Dateien

```
Kapitel01/
├── index.html
├── style.css
└── script.js
```
