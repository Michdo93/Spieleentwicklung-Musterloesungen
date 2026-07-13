# Ninja Fight - Kapitel 4: Tastatur- & Maus-Eingabe

Musterloesung zu Kapitel 4 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Baut auf Kapitel 3 auf (Kopie + Erweiterung).

## Wichtig: noch keine Physik!

Der Held bewegt sich in diesem Kapitel **nicht** von der Stelle - es
geht nur um das Laden und Ansteuern der Animationen. Echte Bewegung
kommt erst in Kapitel 5.

## Steuerung

- **A/D oder Pfeiltasten links/rechts halten**: Blickrichtung dreht
  sich um, Walk-Animation spielt ab (Position bleibt gleich!)
- **Leertaste**: Sprung-Animation (einmalig, dann zurueck zu Idle/Walk)

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Dateien

```
Kapitel04/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/sprites/
        ├── hero.png
        └── tiles.png
```
