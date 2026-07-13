/**
 * Ninja Fight - Kapitel 3: Sprite-Animation
 * Musterloesung
 *
 * Baut auf Kapitel 2 auf. Neu: drawHero() spielt jetzt die
 * Idle-Animation endlos ab, statt nur den ersten Frame zu zeichnen.
 * Walk und Jump sind in CHARACTER_STATES bereits vorbereitet, auch
 * wenn wir sie erst ab Kapitel 4/5 tatsaechlich ansteuern - so muessen
 * wir dann nur noch die Tasten-Events ergaenzen, statt die
 * Animationslogik selbst nochmal anzufassen.
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
const ANCHOR_X = 30;
const ANCHOR_Y = 145;
const SPRITE_SCALE = 0.45;
const DRAW_W = CELL_W * SPRITE_SCALE;
const DRAW_H = CELL_H * SPRITE_SCALE;

const TILE_SHEET = {
  cellW: 42,
  cellH: 66,
  tiles: {
    Floor: { row: 0, w: 41, h: 21 },
  },
};

const FLOOR_Y = STAGE_H - 21;

// bereits alle drei Zustaende vorbereitet - Walk/Jump werden erst ab
// Kapitel 4/5 tatsaechlich ausgeloest
const CHARACTER_STATES = {
  Idle: { row: 0, count: 8, loop: true },
  Walk: { row: 1, count: 8, loop: true },
  Jump: { row: 2, count: 8, loop: false },
};
const FPS = 8;

const hero = {
  x: STAGE_W / 2,
  y: FLOOR_Y,
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

// Zeichnet den Helden in seinem aktuellen Animationszustand, bei
// (x, y) = Fusspunkt. Der Frame-Index laeuft per Modulo endlos durch
// (fuer Idle passend, da Idle keinen definierten Anfang/Ende hat).
function drawHero(x, y, facing, state, animTime) {
  const def = CHARACTER_STATES[state];
  const rawFrame = Math.floor(animTime * FPS);
  const frame = def.loop ? rawFrame % def.count : Math.min(rawFrame, def.count - 1);
  const sx = frame * CELL_W;
  const sy = def.row * CELL_H;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.drawImage(
    heroSheet, sx, sy, CELL_W, CELL_H,
    -ANCHOR_X * SPRITE_SCALE, -ANCHOR_Y * SPRITE_SCALE, DRAW_W, DRAW_H
  );
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

  for (let x = 0; x < STAGE_W; x += 41) {
    drawTile("Floor", x, FLOOR_Y);
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
