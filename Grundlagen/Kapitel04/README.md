# Kapitel 4 - Tastatur- & Maus-Eingabe

Musterloesung zu Kapitel 4 des Buchs
**"HTML5 + Vanilla JS Spieleentwicklung - 2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

## Ausfuehren

```bash
python3 -m http.server 8000
```

## Was hier passiert

1. **Rohe Tastatur-Events** - keydown/keyup, key vs. code, live protokolliert
2. **Key-State-Objekt** - keydown/keyup setzen nur Flags, der Loop
   fragt sie jeden Frame ab (WASD/Pfeiltasten)
3. **Maus-Klicks** - Koordinaten umrechnen, Rechteck-Trefftest, mit
   Klick-Protokoll
4. **Kombiniert** - Steuerung UND Klick-Erkennung in einem Beispiel

## Dateien

```
Kapitel04/
├── index.html
├── style.css
└── script.js
```
