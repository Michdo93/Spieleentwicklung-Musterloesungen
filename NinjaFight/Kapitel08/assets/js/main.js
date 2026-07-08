/**
 * Ninja Fight - Kapitel 8: Hindernisse & Gefahren
 * Musterloesung
 *
 * Baut auf Kapitel 7 auf. Das Level bekommt zwei neue Elementtypen:
 * Flame (Feuer) und Knives (Messer) - beide echte Gefahren, im
 * Unterschied zu Wasser (das im fertigen Spiel eine ganz normale
 * Plattform ist, siehe Buch). checkHazards() prueft bei jedem Frame,
 * ob der Held gerade in einer Gefahrenzone steht.
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

// Kenngroessen aus spritedata.js - Flame hat 8 animierte Frames,
// Knives nur einen einzigen, statischen.
const TILE_SHEET = {
  cellW: 42,
  cellH: 66,
  tiles: {
    Floor: { row: 0, w: 41, h: 21 },
    Knives: { row: 4, w: 18, h: 16 },
    Flame: { row: 9, w: 16, h: 26, count: 8 },
  },
};

const GRAVITY = 1400;
const JUMP_SPEED = 620;
const WALK_SPEED = 160;

const FLOOR_Y = STAGE_H - 21;

function floorRun(xStart, xEnd, y) {
  const tiles = [];
  for (let x = xStart; x < xEnd; x += 41) tiles.push({ type: "Floor", x, y });
  return tiles;
}

const LEVELS = {
  1: [
    ...floorRun(0, 400, FLOOR_Y),
    ...floorRun(620, STAGE_W, FLOOR_Y),
    ...floorRun(420, 640, FLOOR_Y - 160),
    ...floorRun(700, 880, FLOOR_Y - 280),
    { type: "Flame", x: 220, y: FLOOR_Y },
    { type: "Knives", x: 320, y: FLOOR_Y },
  ],
};

const PLATFORM_TYPES = new Set(["Floor"]);

// Schaden und Abklingzeit je Gefahrentyp - dasselbe Grundmuster wie im
// Grundlagenprojekt dieses Kapitels.
const HAZARD_TYPES = {
  Flame: { damage: 1, cooldown: 0.6 },
  Knives: { damage: 3, cooldown: 0.6 },
};

function buildLevel(levelNum) {
  const raw = LEVELS[levelNum];
  const platforms = [];
  const hazards = [];

  raw.forEach((el) => {
    if (PLATFORM_TYPES.has(el.type)) {
      platforms.push({ x: el.x, y: el.y, w: 41 });
    } else if (HAZARD_TYPES[el.type]) {
      const def = TILE_SHEET.tiles[el.type];
      hazards.push({ type: el.type, x: el.x, y: el.y - def.h, w: def.w, h: def.h });
    }
    // Leitern (Kapitel 9) kommen hier dazu
  });

  return { platforms, hazards };
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
  lifeEnergy: 10,
  invulnTimer: 0,
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

function drawTile(name, x, y, frame = 0) {
  const def = TILE_SHEET.tiles[name];
  const sx = (frame % (def.count || 1)) * TILE_SHEET.cellW + (TILE_SHEET.cellW - def.w) / 2;
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

// entspricht checkHazards() in Hero.as/entities.js - hier mit dem
// gemeinsamen Schaden+Abklingzeit-Muster aus HAZARD_TYPES
function checkHazards(dt) {
  const footX = hero.x + CELL_W / 2;
  const footY = hero.y + CELL_H;

  if (hero.invulnTimer <= 0) {
    level.hazards.forEach((hz) => {
      const def = HAZARD_TYPES[hz.type];
      const overlapping = footX > hz.x && footX < hz.x + hz.w && footY > hz.y && footY < hz.y + hz.h + 6;
      if (overlapping) {
        hero.lifeEnergy = Math.max(0, hero.lifeEnergy - def.damage);
        hero.invulnTimer = def.cooldown;
      }
    });
  }

  if (hero.invulnTimer > 0) {
    hero.invulnTimer -= dt;
  }
}

let lastTime = 0;
let gameTime = 0;

function update(dt) {
  gameTime += dt;
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

  checkHazards(dt);
}

function render() {
  ctx.fillStyle = "#bfe8ea";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);

  if (!tileSheet.complete || tileSheet.naturalWidth === 0) return;
  if (!heroSheet.complete || heroSheet.naturalWidth === 0) return;

  level.platforms.forEach((p) => drawTile("Floor", p.x, p.y));

  level.hazards.forEach((hz) => {
    const frame = hz.type === "Flame" ? Math.floor(gameTime * 10 + hz.x) : 0;
    drawTile(hz.type, hz.x, hz.y, frame);
  });

  // waehrend der Unverwundbarkeit blinkt der Held leicht
  const flashing = hero.invulnTimer > 0 && Math.floor(hero.invulnTimer * 10) % 2 === 0;
  if (!flashing) {
    drawHero(hero.x, hero.y, hero.facing, hero.state, hero.animTime);
  }

  ctx.fillStyle = "#2e4057";
  ctx.font = "16px monospace";
  ctx.fillText(`Leben: ${hero.lifeEnergy} / 10`, 16, 28);
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
