# Kapitel 1 - Canvas-Grundlagen & Game-Loop

Musterloesung zu Kapitel 1 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

Kein Build-Schritt noetig. Einfach `index.html` in einem lokalen Webserver
oeffnen, z. B.:

```bash
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```

(Ein einfacher Doppelklick auf `index.html` funktioniert bei diesem
Kapitel zwar auch, ab Kapitel 2 brauchen wir wegen `fetch()`/Bildladen
aber durchgehend einen lokalen Server - daher gewoehnen wir uns das am
besten gleich von Anfang an an.)

## Was hier passiert

- Ein `<canvas>`-Element mit 2D-Kontext
- Ein zeitbasierter Game-Loop (`requestAnimationFrame` + `dt`)
- Ein Quadrat, das sich mit konstanter Geschwindigkeit (Pixel/Sekunde)
  bewegt - unabhaengig von der Bildwiederholrate des Bildschirms

## Dateien

```
Kapitel01/
├── index.html
├── style.css
└── script.js
```
