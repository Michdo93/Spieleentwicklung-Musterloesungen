/**
 * Kapitel 7 - Level-Daten & Tile-Rendering
 * Musterlösung
 *
 * Drei Beispiele: (1) hartkodiert vs. Daten, (2) buildLevel() sortiert
 * Rohdaten nach Bedeutung, (3) derselbe Zeichencode für einen anderen
 * Level - exakt wie levels.js/buildLevel() in Ninja Fight.
 */

const tileSheet = new Image();
tileSheet.src = "assets/tiles.png";

// entspricht TILE_SHEET in spritedata.js - eine Zeile pro Kacheltyp
const TILE_CELL_W = 42, TILE_CELL_H = 66;
const TILES = {
  Floor: { row: 0, w: 41, h: 21 },
  WaterGround: { row: 1, w: 40, h: 18 },
  Bridge: { row: 2, w: 36, h: 13 },
  Ladder: { row: 3, w: 25, h: 24 },
  Knives: { row: 4, w: 18, h: 16 },
};

function whenReady(fn) {
  if (tileSheet.complete && tileSheet.naturalWidth > 0) fn();
  else tileSheet.addEventListener("load", fn, { once: true });
}
function drawTile(ctx, name, x, y) {
  const def = TILES[name];
  if (!def) return;
  const sx = (TILE_CELL_W - def.w) / 2, sy = def.row * TILE_CELL_H + (TILE_CELL_H - def.h) / 2;
  ctx.drawImage(tileSheet, sx, sy, def.w, def.h, x, y, def.w, def.h);
}

/* ===================================================================
   Beispiel 1: hartkodiert vs. Daten - derselbe Level, zwei Schreibweisen
   =================================================================== */
(function example1_compare() {
  const canvas = document.getElementById("stage1");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  whenReady(() => {
    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);

    // "hartkodiert" - genau wie Kapitel 6, Beispiel 3
    ctx.fillStyle = "#663300";
    ctx.fillRect(20, 60, 150, 10);
    ctx.fillRect(220, 100, 120, 10);
    ctx.fillStyle = "#93a4b3";
    ctx.font = "11px monospace";
    ctx.fillText("hartkodiert:", 20, 45);
    ctx.fillText("fillRect(20,60,150,10)", 20, 90);
    ctx.fillText("fillRect(220,100,120,10)", 20, 105);

    // "Daten" - dieselben zwei Plattformen, aber als Liste beschrieben
    const LEVEL_DATA = [
      { type: "Floor", x: 260, y: 60 },
      { type: "Floor", x: 300, y: 60 },
      { type: "Floor", x: 340, y: 60 },
      { type: "Bridge", x: 380, y: 130 },
      { type: "Bridge", x: 416, y: 130 },
    ];
    LEVEL_DATA.forEach((el) => drawTile(ctx, el.type, el.x, el.y));
    ctx.fillText("aus Daten gezeichnet:", 260, 45);
  });
})();

/* ===================================================================
   Beispiel 2: buildLevel() - Rohdaten nach Typ sortieren
   entspricht 1:1 buildLevel() in render.js: eine flache Liste aus
   {type,x,y}-Objekten wird in Kategorien aufgeteilt, die jeweils ihre
   eigene Bedeutung haben.
   =================================================================== */
const SAMPLE_LEVEL = [
  { type: "Floor", x: 20, y: 200 }, { type: "Floor", x: 61, y: 200 },
  { type: "Floor", x: 102, y: 200 }, { type: "Knives", x: 150, y: 184 },
  { type: "Floor", x: 190, y: 200 }, { type: "Floor", x: 231, y: 200 },
  { type: "Ladder", x: 260, y: 130 }, { type: "Ladder", x: 260, y: 154 },
  { type: "Floor", x: 280, y: 200 }, { type: "WaterGround", x: 321, y: 202 },
  { type: "WaterGround", x: 361, y: 202 }, { type: "Floor", x: 401, y: 200 },
];

function buildLevel(raw) {
  const platforms = [], ladders = [], hazards = [];
  const PLATFORM_TYPES = new Set(["Floor", "WaterGround", "Bridge"]);
  raw.forEach((el) => {
    if (PLATFORM_TYPES.has(el.type)) platforms.push(el);
    else if (el.type === "Ladder") ladders.push(el);
    else if (el.type === "Knives") hazards.push(el);
  });
  return { platforms, ladders, hazards };
}

(function example2_buildLevel() {
  const canvas = document.getElementById("stage2");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  whenReady(() => {
    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    SAMPLE_LEVEL.forEach((el) => drawTile(ctx, el.type, el.x, el.y));

    const level = buildLevel(SAMPLE_LEVEL);
    ctx.fillStyle = "#93a4b3";
    ctx.font = "12px monospace";
    ctx.fillText(
      `platforms: ${level.platforms.length}   ladders: ${level.ladders.length}   hazards: ${level.hazards.length}`,
      20, 30
    );
    ctx.fillText("(dieselbe flache Liste, jetzt nach Bedeutung sortiert)", 20, 250);
  });
})();

/* ===================================================================
   Beispiel 3: derselbe Level-Renderer für einen ANDEREN Level
   Der Witz an Daten statt Code: buildLevel()/drawTile() bleiben
   unverändert, nur die Datenliste wird ausgetauscht.
   =================================================================== */
const LEVEL_B = [
  { type: "Floor", x: 20, y: 220 }, { type: "Floor", x: 61, y: 220 },
  { type: "WaterGround", x: 102, y: 222 }, { type: "WaterGround", x: 142, y: 222 },
  { type: "WaterGround", x: 182, y: 222 }, { type: "Floor", x: 222, y: 220 },
  { type: "Ladder", x: 240, y: 150 }, { type: "Ladder", x: 240, y: 174 },
  { type: "Bridge", x: 270, y: 140 }, { type: "Bridge", x: 306, y: 140 },
  { type: "Bridge", x: 342, y: 140 }, { type: "Knives", x: 60, y: 204 },
  { type: "Floor", x: 380, y: 220 }, { type: "Floor", x: 421, y: 220 },
];

(function example3_swap() {
  const canvas = document.getElementById("stage3");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  let showingB = true;

  function draw() {
    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    const data = showingB ? LEVEL_B : SAMPLE_LEVEL;
    data.forEach((el) => drawTile(ctx, el.type, el.x, el.y));
    ctx.fillStyle = "#93a4b3";
    ctx.font = "12px monospace";
    ctx.fillText(showingB ? "LEVEL_B" : "SAMPLE_LEVEL", 20, 30);
  }
  whenReady(draw);

  document.getElementById("swap-btn").addEventListener("click", () => {
    showingB = !showingB;
    draw();
  });
})();
