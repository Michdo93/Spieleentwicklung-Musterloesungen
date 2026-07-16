/**
 * Ninja Fight - Kapitel 5: Bewegung & Schwerkraft
 * Musterlösung
 *
 * Baut auf Kapitel 4 auf. Jetzt bewegt sich der Held tatsächlich:
 * links/rechts per WALK_SPEED, Sprung + Schwerkraft per
 * GRAVITY/JUMP_SPEED - exakt die Werte und Logik aus Hero.update() im
 * fertigen Spiel, jetzt mit der korrekten Größe und Spiegelachse
 * aus Kapitel 2. Gelandet wird vorerst auf einem festen Boden; echte
 * Plattformen mit Lücken dazwischen kommen erst in Kapitel 6.
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

// dieselben Werte wie im fertigen Spiel (dort in render.js)
const GRAVITY = 1400;     // px/s²
const JUMP_SPEED = 620;   // px/s (Anfangsgeschwindigkeit nach oben)
const WALK_SPEED = 160;
// Sicherheitsabstand zum Bühnenrand, GEMESSEN an den tatsächlich
// sichtbaren Pixeln des Sprites (nicht an der vollen, größtenteils
// transparenten 160x150-Zelle!) - siehe Buch, Kapitel 5, für die
// genaue Messung. Ohne diesen Puffer würde die Figur am äußersten
// Rand knapp über den Bildschirmrand hinausragen.
const EDGE_MARGIN = 20; // Pixel

const FLOOR_Y = STAGE_H - 21;

const CHARACTER_STATES = {
  Idle: { row: 0, count: 8, loop: true },
  Walk: { row: 1, count: 8, loop: true },
  Jump: { row: 2, count: 8, loop: false },
};
const FPS = 8;

// hero.x/hero.y = Fußpunkt der Figur (siehe Kapitel 2)
const hero = {
  x: STAGE_W / 2,
  y: FLOOR_Y,
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
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.drawImage(
    heroSheet, sx, sy, CELL_W, CELL_H,
    -ANCHOR_X * SPRITE_SCALE, -ANCHOR_Y * SPRITE_SCALE, DRAW_W, DRAW_H
  );
  ctx.restore();
}

// entspricht moveHorizontal() aus Hero.as/entities.js
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
  hero.x = Math.max(EDGE_MARGIN, Math.min(STAGE_W - EDGE_MARGIN, hero.x));
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
  if (nextY >= FLOOR_Y && hero.vy >= 0) {
    hero.y = FLOOR_Y;
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
