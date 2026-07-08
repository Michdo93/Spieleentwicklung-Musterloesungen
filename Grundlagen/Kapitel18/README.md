# Kapitel 18 - Highscores & Levelfortschritt

Musterloesung zu Kapitel 18 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Das letzte Kapitel des Buchs.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **Highscores**: eine Liste mit `localStorage` speichern, sortieren,
   auf die Top 10 begrenzen
2. **Sieg oder Niederlage?**: eine interaktive Simulation - ein
   Zeitablauf ist nur DANN eine Niederlage, wenn zusaetzlich noch
   Gegner uebrig sind
3. **`+=` statt `=`**: der Unterschied zwischen einer Formel, die den
   bisherigen Stand ueberschreibt, und einer, die auf ihm aufbaut

## Dateien

```
Kapitel18/
├── index.html
├── style.css
└── script.js
```
