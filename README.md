# Musterloesungen - HTML5 + Vanilla JS Spieleentwicklung

Begleitrepo zum Buch **"HTML5 + Vanilla JS Spieleentwicklung -
2D-Plattform-Kampfspiel Schritt-fuer-Schritt"**.

Dieses Repo enthaelt zu **jedem Kapitel des Buchs zwei fertige,
lauffaehige Musterloesungen**:

- **`Grundlagen/`** - das kleine Testprojekt, an dem jedes Kapitel
  zunaechst eine neue Technik isoliert und ohne Ablenkung durch das
  grosse Spielprojekt einfuehrt.
- **`NinjaFight/`** - dasselbe Kapitel, diesmal eingebaut in das
  tatsaechliche Spielprojekt. Jedes Kapitel ist eine Kopie des
  vorherigen Kapitel-Ordners plus den in diesem Kapitel neu
  hinzugekommenen Aenderungen - so laesst sich jeder Zwischenstand des
  Spiels einzeln oeffnen und ausprobieren.

Das fertige Spiel am Ende von Kapitel 18 entspricht dem oeffentlichen
[Ninja-Fight-Projekt](https://github.com/Michdo93/NinjaFight).

## Aufbau

```
/
├── Grundlagen/
│   ├── Kapitel01/   Canvas-Grundlagen & Game-Loop
│   ├── Kapitel02/   Sprites zeichnen
│   ├── Kapitel03/   Sprite-Animation
│   ├── ...
│   └── Kapitel18/   Highscores & Levelfortschritt
├── NinjaFight/
│   ├── Kapitel01/   ... (gleiche Kapitelliste wie oben)
│   └── ...
└── Materialien/
    ├── sprites/       alle im Buch verwendeten Sprite-Sheets
    └── sounds/        alle im Buch verwendeten Sound-Dateien
```

## Kapitelliste

| # | Kapitel |
|---|---------|
| 01 | Canvas-Grundlagen & Game-Loop |
| 02 | Sprites zeichnen |
| 03 | Sprite-Animation |
| 04 | Tastatur- & Maus-Eingabe |
| 05 | Bewegung & Schwerkraft |
| 06 | Kollision & Plattformen |
| 07 | Level-Daten & Tile-Rendering |
| 08 | Hindernisse & Gefahren |
| 09 | Leitern & Klettern |
| 10 | Nahkampf & Hitboxen |
| 11 | Fernkampf & Projektile |
| 12 | Items & Power-Ups |
| 13 | Gegner-KI: Bewegung |
| 14 | Gegner-KI: Kampf & Gegnertypen |
| 15 | Sound & Musik |
| 16 | HUD & Spielstatus |
| 17 | Menues & Spielzustaende |
| 18 | Highscores & Levelfortschritt |

## Jedes Kapitel lokal ausfuehren

Kein Build-Schritt, reines HTML/CSS/JS:

```bash
cd Grundlagen/Kapitel01     # oder NinjaFight/Kapitel01, ...
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```

## Status

- [x] Kapitel 1 - vollstaendig (beide Tracks)
- [x] Kapitel 2 - vollstaendig (beide Tracks)
- [x] Kapitel 3 - vollstaendig (beide Tracks)
- [x] Kapitel 4 - vollstaendig (beide Tracks)
- [x] Kapitel 5 - vollstaendig (beide Tracks)
- [x] Kapitel 6 - vollstaendig (beide Tracks)
- [x] Kapitel 7 - vollstaendig (beide Tracks)
- [x] Kapitel 8 - vollstaendig (beide Tracks)
- [x] Kapitel 9 - vollstaendig (beide Tracks)
- [x] Kapitel 10 - vollstaendig (beide Tracks)
- [x] Kapitel 11 - vollstaendig (beide Tracks)
- [x] Kapitel 12 - vollstaendig (beide Tracks)
- [ ] Kapitel 13-18 - folgen nach demselben Prinzip

## Zugehoeriges Buch

Dieses Repo wird im Buch an den passenden Stellen verlinkt, damit man
sich jederzeit die fertige Loesung eines Kapitels herunterladen kann,
statt alles abtippen zu muessen.
