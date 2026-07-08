/**
 * Ninja Fight - Kapitel 2: Sprites zeichnen
 * Musterloesung
 *
 * Baut auf Kapitel 1 auf. Neu:
 * - drawTile(): zeichnet Level-Kacheln aus dem gemeinsamen tiles.png-Sheet
 * - drawHero(): der Held kann jetzt auch gespiegelt (nach links blickend)
 *   gezeichnet werden - der Grundstein fuer die Bewegungssteuerung ab
 *   Kapitel 5.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const STAGE_W = canvas.width;
const STAGE_H = canvas.height;

const heroSheet = new Image();
heroSheet.src = "assets/img/sprites/hero.png";

const tileSheet = new Image();
tileSheet.src = "assets/img/sprites/tiles.png";

const CELL_W = 160;
const CELL_H = 150;

// Kenngroessen aus tiles.png - identisch zu TILE_SHEET in spritedata.js
const TILE_SHEET = {
  cellW: 42,
  cellH: 66,
  tiles: {
    Floor: { row: 0, w: 41, h: 21 },
  },
};

const hero = {
  x: STAGE_W / 2 - CELL_W / 2,
  y: STAGE_H / 2 - CELL_H / 2 - 40,
  facing: 1, // 1 = blickt nach rechts, -1 = blickt nach links
};

// Zeichnet eine Kachel aus tiles.png. Jede Zelle im Sheet ist groesser
// als die eigentliche Grafik (cellW x cellH), daher zentrieren wir den
// Ausschnitt (sx/sy) innerhalb der Zelle.
function drawTile(name, x, y) {
  const def = TILE_SHEET.tiles[name];
  const sx = (TILE_SHEET.cellW - def.w) / 2;
  const sy = def.row * TILE_SHEET.cellH + (TILE_SHEET.cellH - def.h) / 2;
  ctx.drawImage(tileSheet, sx, sy, def.w, def.h, x, y, def.w, def.h);
}

// Zeichnet den ersten Idle-Frame des Helden. facing = -1 spiegelt die
// Figur horizontal (translate zum Fusspunkt, dann scale(-1,1)).
function drawHero(x, y, facing) {
  ctx.save();
  ctx.translate(x + CELL_W / 2, y);
  ctx.scale(facing, 1);
  ctx.drawImage(heroSheet, 0, 0, CELL_W, CELL_H, -CELL_W / 2, 0, CELL_W, CELL_H);
  ctx.restore();
}

let lastTime = 0;

function update(dt) {
  // in Kapitel 2 bewegt sich noch nichts
}

function render() {
  ctx.fillStyle = "#bfe8ea";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);

  if (!tileSheet.complete || tileSheet.naturalWidth === 0) return;
  if (!heroSheet.complete || heroSheet.naturalWidth === 0) return;

  // Boden: eine Reihe Floor-Kacheln ueber die ganze Buehnenbreite
  const floorY = STAGE_H - 21;
  for (let x = 0; x < STAGE_W; x += 41) {
    drawTile("Floor", x, floorY);
  }

  // Zwei Helden nebeneinander: einmal normal, einmal gespiegelt - so
  // sieht man beide Blickrichtungen mit demselben Bildmaterial.
  drawHero(hero.x - 100, hero.y, 1);
  drawHero(hero.x + 100, hero.y, -1);
}

function loop(now) {
  if (lastTime === 0) {
    lastTime = now;
  }
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  update(dt);
  render();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
