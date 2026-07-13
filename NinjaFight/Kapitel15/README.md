# Ninja Fight - Kapitel 15: Sound & Musik

Musterloesung zu Kapitel 15 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 14 auf (Kopie + Erweiterung).

## Ausfuehren

```bash
python3 -m http.server 8000
```

Musik startet beim ersten Tastendruck (Browser verlangen eine
Nutzerinteraktion, bevor Audio abgespielt werden darf).

## Was hier neu dazugekommen ist

- Die `SoundController`-Klasse (Musik + SFX + gemeinsame Lautstaerke)
- Schwerthieb spielt einen Sound (`sound.playSword()`)
- Eingesammelte Power-Ups spielen einen Muenz-Sound
  (`sound.playCoins()`)

## Dateien

```
Kapitel15/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    ├── sounds/
    │   ├── Lost-Jungle.mp3
    │   ├── sword.mp3
    │   └── Coins.mp3
    └── img/sprites/...
```
