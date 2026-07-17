# Musterlösungen - HTML5 + Vanilla JS Spieleentwicklung

Begleitrepo zum Buch **"HTML5 + Vanilla JS Spieleentwicklung -
2D-Plattform-Kampfspiel Schritt-für-Schritt"**.

Dieses Repo enthält zu **jedem Kapitel des Buchs zwei fertige,
lauffähige Musterlösungen**:

- **`Grundlagen/`** - das kleine Testprojekt, an dem jedes Kapitel
  zunächst eine neue Technik isoliert und ohne Ablenkung durch das
  große Spielprojekt einführt.
- **`NinjaFight/`** - dasselbe Kapitel, diesmal eingebaut in das
  tatsächliche Spielprojekt. Jedes Kapitel ist eine Kopie des
  vorherigen Kapitel-Ordners plus den in diesem Kapitel neu
  hinzugekommenen änderungen - so läßt sich jeder Zwischenstand des
  Spiels einzeln öffnen und ausprobieren.

Das fertige Spiel am Ende von Kapitel 18 entspricht dem öffentlichen
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
| 17 | Menues & Spielzustände |
| 18 | Highscores & Levelfortschritt |

## Jedes Kapitel lokal ausführen

Kein Build-Schritt, reines HTML/CSS/JS:

```bash
cd Grundlagen/Kapitel01     # oder NinjaFight/Kapitel01, ...
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```

## Status

Alle 19 Kapitel sind vollständig. Kapitel 1-18 für beide Tracks
(Grundlagen und NinjaFight); Kapitel 19 ist das vollständige,
fertige Original-Spiel (siehe `NinjaFight/Kapitel19/`).

## Zugehöriges Buch

Dieses Repo wird im Buch an den passenden Stellen verlinkt, damit man
sich jederzeit die fertige Lösung eines Kapitels herunterladen kann,
statt alles abtippen zu müssen.
