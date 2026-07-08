# Kapitel 10 - Nahkampf & Hitboxen

Musterloesung zu Kapitel 10 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

- Die Trefferzone (Hitbox) liegt immer vor der Figur - ihre Position
  haengt von der Blickrichtung ab (`facing`)
- `attackHitDone` sorgt dafuer, dass ein Angriff trotz mehrerer Frames
  Animationsdauer nur EINMAL trifft
- Reichweite und Schaden sind gekoppelt: der Tritt trifft weiter und
  haerter als der Schlag

## Dateien

```
Kapitel10/
├── index.html
├── style.css
└── script.js
```
