# Kapitel 9 - Leitern & Klettern

Musterloesung zu Kapitel 9 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **Der echte Bug** - eine versehentlich doppelt addierte Kachelhoehe
   laesst die Figur am Leiterende ins Leere fallen
2. **Die Korrektur** - die Zone endet exakt auf Plattformhoehe
3. **Vollstaendige Integration** - Laufen, Springen und Klettern
   kombiniert zwischen zwei Plattformen

## Dateien

```
Kapitel09/
├── index.html
├── style.css
└── script.js
```
