# Kapitel 12 - Items & Power-Ups

Musterloesung zu Kapitel 12 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

- Die `PowerUp`-Klasse: faellt mit derselben Schwerkraft wie eine
  Spielfigur, landet auf dem Boden - nur ohne eigene Steuerung
- Drei Effekt-Muster: **sofortig** (Herz, direkt angewendet),
  **zeitbegrenzt** (Schwert, eigener Countdown-Timer),
  **zaehlbegrenzt** (Shuriken, Munitionszaehler)
- Die Kollisionspruefung laeuft gegen ALLE Kandidaten (Spieler UND
  Gegner) - dadurch kann jeder das Item zuerst erreichen

## Dateien

```
Kapitel12/
├── index.html
├── style.css
└── script.js
```
