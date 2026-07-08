# Ninja Fight - Kapitel 1: Canvas-Grundlagen & Game-Loop

Musterloesung zu Kapitel 1 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Dies ist der allererste Baustein des Ninja-Fight-Spiels, das ab diesem
Kapitel ueber alle 18 Kapitel hinweg Schritt fuer Schritt entsteht.
Jedes weitere Kapitel ist eine Kopie dieses Ordners mit den jeweils neu
hinzugekommenen Aenderungen.

## Ausfuehren

```bash
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```

## Was hier passiert

- Canvas in der finalen Spielaufloesung (1024x576)
- Derselbe zeitbasierte Game-Loop wie im Grundlagen-Projekt dieses Kapitels
- Der Held wird als Standbild (erster Idle-Frame des Sprite-Sheets)
  in die Mitte der Buehne gezeichnet

## Dateien

```
Kapitel01/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/sprites/
        ├── hero.png
        └── tiles.png
```

## Herkunft der Assets

`hero.png` und `tiles.png` stammen aus dem finalen
[Ninja-Fight-Projekt](https://github.com/Michdo93/NinjaFight). Alle
Sprites und Sounds fuer alle Kapitel liegen gesammelt im Ordner
[`/Materialien`](../../Materialien) dieses Repos.
