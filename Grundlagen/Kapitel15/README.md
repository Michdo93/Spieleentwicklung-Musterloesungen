# Kapitel 15 - Sound & Musik

Musterloesung zu Kapitel 15 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **Musik abspielen und wechseln** - Menue-/Spielmusik schliessen
   sich gegenseitig aus
2. **Soundeffekte mehrfach ausloesen** - `currentTime = 0` vor jedem
   `play()`
3. **Gemeinsame Lautstaerke** - ein Regler fuer Musik UND Soundeffekte

## Dateien

```
Kapitel15/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── Game-Menu.mp3
    ├── Lost-Jungle.mp3
    ├── sword.mp3
    └── Coins.mp3
```
