# Kapitel 15 - Sound & Musik

Musterlösung zu Kapitel 15 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

## Ausführen

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **Musik abspielen und wechseln** - Menue-/Spielmusik schließen
   sich gegenseitig aus
2. **Soundeffekte mehrfach auslösen** - `currentTime = 0` vor jedem
   `play()`
3. **Gemeinsame Lautstärke** - ein Regler für Musik UND Soundeffekte

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
