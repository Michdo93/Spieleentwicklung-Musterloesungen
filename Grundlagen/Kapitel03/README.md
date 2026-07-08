# Kapitel 3 - Sprite-Animation

Musterloesung zu Kapitel 3 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```

## Was hier passiert

- Eine endlos laufende Animation (Walk) per `frame % count`
- Eine einmalige Animation (Jump), die am letzten Frame stehen bleibt,
  per `Math.min(frame, count - 1)`
- Beide Varianten nutzen dieselbe zeitbasierte Formel:
  `frame = Math.floor(t * fps)`

## Dateien

```
Kapitel03/
├── index.html
├── style.css
├── script.js
└── assets/hero.png
```
