/**
 * Kapitel 7 - Level-Daten & Tile-Rendering
 * Musterloesung
 *
 * Level als reine DATEN beschreiben ({ type, x, y }), statt sie im Code
 * hart zu verdrahten. buildLevel() sortiert die flache Rohdatenliste
 * einmal nach Bedeutung (Plattform oder nicht) - der Rest des Spiels
 * muss nie wieder rohe Typnamen anfassen.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

// Zwei komplett unterschiedliche Level, rein als Daten beschrieben.
// "Floor" und "Gap" sind reine Bezeichner - was sie bedeuten, entscheidet
// erst buildLevel().
const LEVELS = {
  1: [
    { type: "Floor", x: 0, y: 240 },
    { type: "Floor", x: 40, y: 240 },
    { type: "Floor", x: 80, y: 240 },
    { type: "Floor", x: 160, y: 240 },
    { type: "Floor", x: 200, y: 240 },
    { type: "Floor", x: 240, y: 240 },
    { type: "Floor", x: 320, y: 180 },
    { type: "Floor", x: 360, y: 180 },
    { type: "Floor", x: 400, y: 180 },
    { type: "Floor", x: 440, y: 240 },
  ],
  2: [
    { type: "Floor", x: 0, y: 240 },
    { type: "Floor", x: 40, y: 240 },
    { type: "Floor", x: 200, y: 200 },
    { type: "Floor", x: 240, y: 200 },
    { type: "Floor", x: 280, y: 200 },
    { type: "Floor", x: 380, y: 140 },
    { type: "Floor", x: 420, y: 140 },
    { type: "Floor", x: 0, y: 100 },
    { type: "Floor", x: 40, y: 100 },
  ],
};

const PLATFORM_TYPES = new Set(["Floor"]);
const TILE_W = 40, TILE_H = 12;

// Trennt "was steht wo" (Rohdaten) von "was bedeutet das" (Kategorien).
// In Ninja Fight uebernimmt genau diese Funktion buildLevel() in
// render.js - dort mit deutlich mehr Kategorien (Leitern, Gefahren, ...).
function buildLevel(levelNum) {
  const raw = LEVELS[levelNum];
  const platforms = [];

  raw.forEach((el) => {
    if (PLATFORM_TYPES.has(el.type)) {
      platforms.push({ x: el.x, y: el.y, w: TILE_W, h: TILE_H });
    }
    // weitere Kategorien (Leitern, Gefahren, ...) kaemen hier dazu
  });

  return { platforms };
}

let currentLevelNum = 1;
let level = buildLevel(currentLevelNum);

document.getElementById("switch-btn").addEventListener("click", () => {
  currentLevelNum = currentLevelNum === 1 ? 2 : 1;
  level = buildLevel(currentLevelNum);
});

function render() {
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);

  // Immer derselbe Zeichencode - unabhaengig davon, welches Level
  // gerade aktiv ist.
  ctx.fillStyle = "#663300";
  level.platforms.forEach((p) => {
    ctx.fillRect(p.x, p.y, p.w, p.h);
  });

  ctx.fillStyle = "#93a4b3";
  ctx.font = "13px monospace";
  ctx.fillText(`Level ${currentLevelNum}`, 14, 24);
}

function loop() {
  render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
