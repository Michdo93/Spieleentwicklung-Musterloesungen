# Kapitel 15 - Sound & Musik

Musterloesung zu Kapitel 15 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

- Die `SoundController`-Klasse buendelt alle Audio-Objekte an einem
  Ort
- Musikstuecke schliessen sich explizit gegenseitig aus
  (`playMenuMusic()`/`playGameMusic()` pausieren jeweils das andere)
- `currentTime = 0` vor jedem `play()` erlaubt wiederholtes,
  schnelles Ausloesen desselben Soundeffekts
- Eine gemeinsame Lautstaerke beeinflusst alle Audio-Objekte auf
  einmal

## Original-Audiodateien

Alle vier Sounds in diesem Kapitel (`Game-Menu.mp3`, `Lost-Jungle.mp3`,
`sword.mp3`, `Coins.mp3`) sind unveraenderte Original-Assets aus
Ninja Fight.

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
