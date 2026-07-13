# Kapitel 18 - Highscores & Levelfortschritt

Musterloesung zu Kapitel 18 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Das letzte Kapitel des Buchs.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **Highscores mit localStorage** - speichern, sortieren, auf Top 10
   begrenzen
2. **Sieg oder Niederlage?** - Zeitablauf ist nur DANN eine Niederlage,
   wenn zusaetzlich noch Gegner uebrig sind
3. **Kumulative Lebenspunkte** - `+=` statt `=` ueber mehrere Level

## Dateien

```
Kapitel18/
├── index.html
├── style.css
└── script.js
```
