# Kapitel 8 - Hindernisse & Gefahren

Musterlösung zu Kapitel 8 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

## Ausführen

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **Wasser ist begehbar** - `WaterGround` gehört zu den
   `PLATFORM_TYPES`, keine Gefahr
2. **Feuer** - Schaden über Zeit mit Abklingzeit (`invulnTimer`)
3. **Stacheln** - höherer Einzelschaden, dieselbe Technik

## Dateien

```
Kapitel08/
├── index.html
├── style.css
├── script.js
└── assets/tiles.png
```
