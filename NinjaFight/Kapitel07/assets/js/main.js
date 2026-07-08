/**
 * Ninja Fight - Kapitel 7: Level-Daten & Tile-Rendering
 * Musterloesung
 *
 * Baut auf Kapitel 6 auf. Die in Kapitel 6 hartkodierte platforms-Liste
 * wird ersetzt durch echte Level-DATEN (LEVELS, wie in levels.js) plus
 * buildLevel(), das die Rohdaten einmal nach Bedeutung sortiert - exakt
 * das Prinzip aus render.js im fertigen Spiel.
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

const GRAVITY = 1400;
const JUMP_SPEED = 620;
const WALK_SPEED = 160;

const FLOOR_Y = STAGE_H - 21;

// Kleiner Helfer, NUR um die Leveldaten unten kompakt zu formulieren -
// buildLevel() bekommt am Ende ohnehin eine flache Liste einzelner
// Kacheln, genau wie levels.js im fertigen Spiel.
function floorRun(xStart, xEnd, y) {
  const tiles = [];
  for (let x = xStart; x < xEnd; x += 41) tiles.push({ type: "Floor", x, y });
  return tiles;
}

// Rohe Level-Daten: eine flache Liste aus { type, x, y }. Diese Liste
// entspricht LEVELS in levels.js - dort aus den Original-Leveldaten
// des Spiels extrahiert.
const LEVELS = {
  1: [
    ...floorRun(0, 400, FLOOR_Y),
    ...floorRun(620, STAGE_W, FLOOR_Y),
    ...floorRun(420, 640, FLOOR_Y - 160),
    ...floorRun(700, 880, FLOOR_Y - 280),
  ],
};

const PLATFORM_TYPES = new Set(["Floor"]);

// Sortiert die flache Rohdatenliste einmal nach Bedeutung. Der Rest des
// Spiels arbeitet nur noch mit level.platforms - nie wieder mit rohen
// Typnamen aus LEVELS.
function buildLevel(levelNum) {
  const raw = LEVELS[levelNum];
  const platforms = [];

  raw.forEach((el) => {
    if (PLATFORM_TYPES.has(el.type)) {
      platforms.push({ x: el.x, y: el.y, w: 41 });
    }
    // Leitern (Kapitel 9) und Gefahren (Kapitel 8) kommen hier dazu
  });

  return { platforms };
}

const level = buildLevel(1);

const CHARACTER_STATES = {
  Idle: { row: 0, count: 8, loop: true },
  Walk: { row: 1, count: 8, loop: true },
  Jump: { row: 2, count: 8, loop: false },
};
const FPS = 8;

const hero = {
  x: 150,
  y: FLOOR_Y - CELL_H,
  vy: 0,
  facing: 1,
  state: "Idle",
  animTime: 0,
  onGround: true,
};

function setState(state) {
  if (hero.state === state) return;
  hero.state = state;
  hero.animTime = 0;
}

const keys = { left: false, right: false, up: false, down: false, jump: false };
function keyDown(e) {
  switch (e.code) {
    case "ArrowLeft": case "KeyA": keys.left = true; break;
    case "ArrowRight": case "KeyD": keys.right = true; break;
    case "ArrowUp": case "KeyW": keys.up = true; break;
    case "ArrowDown": case "KeyS": keys.down = true; break;
    case "Space": keys.jump = true; e.preventDefault(); break;
  }
}
function keyUp(e) {
  switch (e.code) {
    case "ArrowLeft": case "KeyA": keys.left = false; break;
    case "ArrowRight": case "KeyD": keys.right = false; break;
    case "ArrowUp": case "KeyW": keys.up = false; break;
    case "ArrowDown": case "KeyS": keys.down = false; break;
    case "Space": keys.jump = false; break;
  }
}
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

function drawTile(name, x, y) {
  const def = TILE_SHEET.tiles[name];
  const sx = (TILE_SHEET.cellW - def.w) / 2;
  const sy = def.row * TILE_SHEET.cellH + (TILE_SHEET.cellH - def.h) / 2;
  ctx.drawImage(tileSheet, sx, sy, def.w, def.h, x, y, def.w, def.h);
}

function drawHero(x, y, facing, state, animTime) {
  const def = CHARACTER_STATES[state];
  const rawFrame = Math.floor(animTime * FPS);
  const frame = def.loop ? rawFrame % def.count : Math.min(rawFrame, def.count - 1);
  const sx = frame * CELL_W;
  const sy = def.row * CELL_H;

  ctx.save();
  ctx.translate(x + CELL_W / 2, y);
  ctx.scale(facing, 1);
  ctx.drawImage(heroSheet, sx, sy, CELL_W, CELL_H, -CELL_W / 2, 0, CELL_W, CELL_H);
  ctx.restore();
}

function moveHorizontal(dt) {
  if (keys.left) {
    hero.facing = -1;
    hero.x -= WALK_SPEED * dt;
    if (hero.state !== "Jump") setState("Walk");
  } else if (keys.right) {
    hero.facing = 1;
    hero.x += WALK_SPEED * dt;
    if (hero.state !== "Jump") setState("Walk");
  } else if (hero.state === "Walk") {
    setState("Idle");
  }
  hero.x = Math.max(0, Math.min(STAGE_W - CELL_W, hero.x));
}

function findLanding(nextY) {
  const footX = hero.x + CELL_W / 2;
  let best = null;
  level.platforms.forEach((p) => {
    const top = p.y;
    if (footX > p.x && footX < p.x + p.w && hero.y + CELL_H <= top + 2 && nextY + CELL_H >= top) {
      if (!best || top < best.y) best = { y: top };
    }
  });
  return best;
}

let lastTime = 0;

function update(dt) {
  hero.animTime += dt;

  moveHorizontal(dt);

  if (keys.jump && hero.onGround) {
    hero.vy = -JUMP_SPEED;
    hero.onGround = false;
    setState("Jump");
  }
  hero.vy += GRAVITY * dt;

  const nextY = hero.y + hero.vy * dt;
  const landing = hero.vy >= 0 ? findLanding(nextY) : null;

  if (landing) {
    hero.y = landing.y - CELL_H;
    hero.vy = 0;
    hero.onGround = true;
    if (hero.state === "Jump") setState(keys.left || keys.right ? "Walk" : "Idle");
  } else {
    hero.y = nextY;
    hero.onGround = false;
  }
}

function render() {
  ctx.fillStyle = "#bfe8ea";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);

  if (!tileSheet.complete || tileSheet.naturalWidth === 0) return;
  if (!heroSheet.complete || heroSheet.naturalWidth === 0) return;

  level.platforms.forEach((p) => drawTile("Floor", p.x, p.y));

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
