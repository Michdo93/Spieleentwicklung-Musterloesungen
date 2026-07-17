# Ninja Fight - Kapitel 15: Sound & Musik

Musterlösung zu Kapitel 15 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

Baut auf Kapitel 14 auf (Kopie + Erweiterung).

## Ausführen

```bash
python3 -m http.server 8000
```

Musik startet beim ersten Tastendruck (Browser verlangen eine
Nutzerinteraktion, bevor Audio abgespielt werden darf).

## Was hier neu dazugekommen ist

- Die `SoundController`-Klasse (Musik + SFX + gemeinsame Lautstärke)
- Schwerthieb spielt einen Sound (`sound.playSword()`)
- Eingesammelte Power-Ups spielen einen Münz-Sound
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
