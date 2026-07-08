/**
 * Ninja Fight - Kapitel 3: Sprite-Animation
 * Musterloesung
 *
 * Baut auf Kapitel 2 auf. Neu: drawHero() zeichnet nicht mehr nur den
 * ersten Idle-Frame als Standbild, sondern spielt die komplette
 * Idle-Animation endlos ab - der Held "atmet" jetzt, obwohl er sich
 * noch nicht bewegen kann (das kommt erst in Kapitel 5).
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

const TILE_SHEET = {
  cellW: 42,
  cellH: 66,
  tiles: {
    Floor: { row: 0, w: 41, h: 21 },
  },
};

// entspricht CHARACTER_SHEET.states in Ninja Fight - vorerst nur die
// Zustaende, die wir bereits brauchen
const CHARACTER_STATES = {
  Idle: { row: 0, count: 8 },
};

const FPS = 8; // Animationsgeschwindigkeit (Frames der Animation pro Sekunde)

const hero = {
  x: STAGE_W / 2 - CELL_W / 2,
  y: STAGE_H / 2 - CELL_H / 2 - 40,
  facing: 1,
  state: "Idle",
  animTime: 0,
};

function drawTile(name, x, y) {
  const def = TILE_SHEET.tiles[name];
  const sx = (TILE_SHEET.cellW - def.w) / 2;
  const sy = def.row * TILE_SHEET.cellH + (TILE_SHEET.cellH - def.h) / 2;
  ctx.drawImage(tileSheet, sx, sy, def.w, def.h, x, y, def.w, def.h);
}

// Zeichnet den Helden in seinem aktuellen Animationszustand. Der
// Frame-Index laeuft per Modulo endlos durch - passend fuer Idle, das
// keinen definierten Anfang oder Ende hat.
function drawHero(x, y, facing, state, animTime) {
  const def = CHARACTER_STATES[state];
  const frame = Math.floor(animTime * FPS) % def.count;
  const sx = frame * CELL_W;
  const sy = def.row * CELL_H;

  ctx.save();
  ctx.translate(x + CELL_W / 2, y);
  ctx.scale(facing, 1);
  ctx.drawImage(heroSheet, sx, sy, CELL_W, CELL_H, -CELL_W / 2, 0, CELL_W, CELL_H);
  ctx.restore();
}

let lastTime = 0;

function update(dt) {
  hero.animTime += dt;
}

function render() {
  ctx.fillStyle = "#bfe8ea";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);

  if (!tileSheet.complete || tileSheet.naturalWidth === 0) return;
  if (!heroSheet.complete || heroSheet.naturalWidth === 0) return;

  const floorY = STAGE_H - 21;
  for (let x = 0; x < STAGE_W; x += 41) {
    drawTile("Floor", x, floorY);
  }

  drawHero(hero.x, hero.y, hero.facing, hero.state, hero.animTime);
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
