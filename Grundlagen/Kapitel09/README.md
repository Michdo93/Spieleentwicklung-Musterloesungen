# Kapitel 9 - Leitern & Klettern

Musterloesung zu Kapitel 9 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

- Klettern als dritter Bewegungszustand neben Laufen und Springen
- Innerhalb der Leiterzone: Schwerkraft aus, Position direkt per
  Hoch/Runter gesteuert, begrenzt auf die Leiterzone
- `onLadder` wird jeden Frame neu berechnet (kein Zustand ueber
  mehrere Frames noetig) - nur wenn man sich in der Zone befindet UND
  nicht gleichzeitig links/rechts gedrueckt wird

## Dateien

```
Kapitel09/
├── index.html
├── style.css
└── script.js
```
