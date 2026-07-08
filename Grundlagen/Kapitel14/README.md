# Kapitel 14 - Gegner-KI: Kampf & Gegnertypen

Musterloesung zu Kapitel 14 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

- `ENEMY_TYPES`/`HP_BY_TYPE`: Faehigkeiten und Lebenspunkte an den
  Gegnertyp gekoppelt, statt eigenen Code pro Typ zu schreiben
- `decideAttack()`: ein einfacher Entscheidungsbaum nach Abstand -
  Nahkampf zuerst pruefen, dann Fernkampf, dann Schwert
- Drei Gegnertypen mit unterschiedlichen Faehigkeiten und HP

## Dateien

```
Kapitel14/
├── index.html
├── style.css
└── script.js
```
