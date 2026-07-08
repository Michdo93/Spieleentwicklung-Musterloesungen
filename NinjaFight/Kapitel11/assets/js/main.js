/**
 * Ninja Fight - Kapitel 11: Fernkampf & Projektile
 * Musterloesung
 *
 * Baut auf Kapitel 10 auf. Der Held kann jetzt Shuriken werfen (L) -
 * jedes geworfene Shuriken ist ein eigenstaendiges Projectile-Objekt
 * mit eigener Position und eigenem update(), nicht nur eine
 * Wurfanimation ohne echtes fliegendes Objekt.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const STAGE_W = canvas.width;
const STAGE_H = canvas.height;

const heroSheet = new Image();
heroSheet.src = "assets/img/sprites/hero.png";

const enemySheet = new Image();
enemySheet.src = "assets/img/sprites/blue.png";

const tileSheet = new Image();
tileSheet.src = "assets/img/sprites/tiles.png";

const CELL_W = 160;
const CELL_H = 150;

const TILE_SHEET = {
  cellW: 42,
  cellH: 66,
  tiles: {
    Floor: { row: 0, w: 41, h: 21 },
    Ladder: { row: 3, w: 25, h: 24 },
    Knives: { row: 4, w: 18, h: 16 },
    Shuriken: { row: 7, w: 21, h: 21 },
    Flame: { row: 9, w: 16, h: 26, count: 8 },
  },
};

const GRAVITY = 1400;
const JUMP_SPEED = 620;
const WALK_SPEED = 160;
const CLIMB_SPEED = 110;
const LADDER_W = 25;
const TILE_H = 24;

const FLOOR_Y = STAGE_H - 21;

function floorRun(xStart, xEnd, y) {
  const tiles = [];
  for (let x = xStart; x < xEnd; x += 41) tiles.push({ type: "Floor", x, y });
  return tiles;
}
function ladderRun(x, yTop, yBottom) {
  const tiles = [];
  for (let y = yBottom - TILE_H; y >= yTop; y -= TILE_H) tiles.push({ type: "Ladder", x, y });
  return tiles;
}

const LEVELS = {
  1: [
    ...floorRun(0, 400, FLOOR_Y),
    ...floorRun(620, STAGE_W, FLOOR_Y),
    ...floorRun(420, 640, FLOOR_Y - 160),
    ...floorRun(700, 880, FLOOR_Y - 280),
    ...ladderRun(500, FLOOR_Y - 160, FLOOR_Y),
    { type: "Flame", x: 220, y: FLOOR_Y },
    { type: "Knives", x: 320, y: FLOOR_Y },
  ],
};

const PLATFORM_TYPES = new Set(["Floor"]);
const HAZARD_TYPES = {
  Flame: { damage: 1, cooldown: 0.6 },
  Knives: { damage: 3, cooldown: 0.6 },
};
const DAMAGE = { Hit: 1, Kick: 2, Shuriken: 5 };

function mergeLadderColumns(tiles) {
  const groups = [];
  tiles.forEach((t) => {
    let g = groups.find((g) => Math.abs(g.x - t.x) < 8);
    if (!g) { g = { x: t.x, minY: t.y, maxY: t.y }; groups.push(g); }
    else { g.minY = Math.min(g.minY, t.y); g.maxY = Math.max(g.maxY, t.y); }
  });
  return groups.map((g) => ({ left: g.x, right: g.x + LADDER_W, top: g.minY, bottom: g.maxY + TILE_H }));
}

function buildLevel(levelNum) {
  const raw = LEVELS[levelNum];
  const platforms = [];
  const hazards = [];
  const ladderTiles = [];

  raw.forEach((el) => {
    if (PLATFORM_TYPES.has(el.type)) {
      platforms.push({ x: el.x, y: el.y, w: 41 });
    } else if (el.type === "Ladder") {
      ladderTiles.push({ x: el.x, y: el.y });
    } else if (HAZARD_TYPES[el.type]) {
      const def = TILE_SHEET.tiles[el.type];
      hazards.push({ type: el.type, x: el.x, y: el.y - def.h, w: def.w, h: def.h });
    }
  });

  return { platforms, hazards, ladders: mergeLadderColumns(ladderTiles) };
}

const level = buildLevel(1);

const CHARACTER_STATES = {
  Idle: { row: 0, count: 8, loop: true },
  Walk: { row: 1, count: 8, loop: true },
  Jump: { row: 2, count: 8, loop: false },
  Hit: { row: 3, count: 8, loop: false },
  Kick: { row: 4, count: 8, loop: false },
  Throw: { row: 5, count: 8, loop: false },
};
const FPS = 8;

const ATTACKS = {
  Hit: { range: 30, damage: 1, duration: 0.35 },
  Kick: { range: 34, damage: 2, duration: 0.35 },
};

const hero = {
  x: 150,
  y: FLOOR_Y - CELL_H,
  vy: 0,
  facing: 1,
  state: "Idle",
  animTime: 0,
  onGround: true,
  onLadder: false,
  lifeEnergy: 10,
  invulnTimer: 0,
  attackTimer: 0,
  attackHitDone: false,
};

const enemy = {
  x: 480,
  y: FLOOR_Y - CELL_H,
  hp: 5,
  maxHp: 5,
  dead: false,
};

// entspricht der Projectile-Klasse in entities.js
class Projectile {
  constructor(x, y, dir, owner) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.owner = owner; // wird selbst nicht getroffen (verhindert Selbsttreffer)
    this.speed = 480;
    this.spin = 0;
    this.dead = false;
  }

  update(dt, targets) {
    this.x += this.dir * this.speed * dt;
    this.spin += dt * 20;
    if (this.x < -20 || this.x > STAGE_W + 20) { this.dead = true; return; }

    for (const t of targets) {
      if (t === this.owner || t.dead) continue;
      if (Math.hypot(t.x + CELL_W / 2 - this.x, t.y + 70 - this.y) < 40) {
        t.hp = Math.max(0, t.hp - DAMAGE.Shuriken);
        if (t.hp === 0) t.dead = true;
        this.dead = true;
        break;
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.spin);
    const def = TILE_SHEET.tiles.Shuriken;
    ctx.drawImage(
      tileSheet,
      (TILE_SHEET.cellW - def.w) / 2, def.row * TILE_SHEET.cellH + (TILE_SHEET.cellH - def.h) / 2,
      def.w, def.h,
      -def.w / 2, -def.h / 2, def.w, def.h
    );
    ctx.restore();
  }
}

let projectiles = [];

function setState(state) {
  if (hero.state === state) return;
  const busy = ["Hit", "Kick", "Throw"].includes(hero.state) && hero.attackTimer > 0;
  if (busy) return;
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
    case "KeyJ": startAttack("Hit"); break;
    case "KeyK": startAttack("Kick"); break;
    case "KeyL": throwShuriken(); break;
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

function startAttack(type) {
  if (hero.attackTimer > 0) return;
  hero.state = type;
  hero.animTime = 0;
  hero.attackTimer = ATTACKS[type].duration;
  hero.attackHitDone = false;
}

// Wichtig: hier entsteht ein ECHTES Objekt, das eigenstaendig
// weiterfliegt - nicht nur die Wurfanimation.
function throwShuriken() {
  if (hero.attackTimer > 0) return;
  hero.state = "Throw";
  hero.animTime = 0;
  hero.attackTimer = 0.35;
  const spawnX = hero.x + (hero.facing > 0 ? CELL_W : -10);
  projectiles.push(new Projectile(spawnX, hero.y + 70, hero.facing, hero));
}

function overlaps(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}
function rectOf(x, y, w, h) {
  return { left: x, right: x + w, top: y, bottom: y + h };
}

function drawTile(name, x, y, frame = 0) {
  const def = TILE_SHEET.tiles[name];
  const sx = (frame % (def.count || 1)) * TILE_SHEET.cellW + (TILE_SHEET.cellW - def.w) / 2;
  const sy = def.row * TILE_SHEET.cellH + (TILE_SHEET.cellH - def.h) / 2;
  ctx.drawImage(tileSheet, sx, sy, def.w, def.h, x, y, def.w, def.h);
}

function drawCharacter(sheet, x, y, facing, state, animTime) {
  const def = CHARACTER_STATES[state];
  const rawFrame = Math.floor(animTime * FPS);
  const frame = def.loop ? rawFrame % def.count : Math.min(rawFrame, def.count - 1);
  const sx = frame * CELL_W;
  const sy = def.row * CELL_H;

  ctx.save();
  ctx.translate(x + CELL_W / 2, y);
  ctx.scale(facing, 1);
  ctx.drawImage(sheet, sx, sy, CELL_W, CELL_H, -CELL_W / 2, 0, CELL_W, CELL_H);
  ctx.restore();
}

function moveHorizontal(dt) {
  if (keys.left) {
    hero.facing = -1;
    hero.x -= WALK_SPEED * dt;
    if (hero.state !== "Jump" && !hero.onLadder) setState("Walk");
  } else if (keys.right) {
    hero.facing = 1;
    hero.x += WALK_SPEED * dt;
    if (hero.state !== "Jump" && !hero.onLadder) setState("Walk");
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
  if (hero.invulnTimer > 0) hero.invulnTimer -= dt;
}

function checkMeleeHit() {
  if (hero.attackTimer <= 0 || hero.attackHitDone) return;
  if (!["Hit", "Kick"].includes(hero.state)) return;

  const def = ATTACKS[hero.state];
  const hitBox = rectOf(
    hero.x + (hero.facing > 0 ? CELL_W : -def.range),
    hero.y + 60, def.range, 50
  );
  const enemyBox = rectOf(enemy.x, enemy.y + 40, CELL_W, 80);

  if (!enemy.dead && overlaps(hitBox, enemyBox)) {
    enemy.hp = Math.max(0, enemy.hp - def.damage);
    if (enemy.hp === 0) enemy.dead = true;
    hero.attackHitDone = true;
  }
}

let lastTime = 0;
let gameTime = 0;

function update(dt) {
  gameTime += dt;
  hero.animTime += dt;

  projectiles.forEach((p) => p.update(dt, [enemy]));
  projectiles = projectiles.filter((p) => !p.dead);

  if (hero.attackTimer > 0) {
    hero.attackTimer -= dt;
    checkMeleeHit();
    if (hero.attackTimer <= 0) setState(keys.left || keys.right ? "Walk" : "Idle");
  }

  const footX = hero.x + CELL_W / 2;
  const footY = hero.y + CELL_H;
  const ladderZone = level.ladders.find(
    (l) => footX > l.left - 4 && footX < l.right + 4 && footY > l.top - 6 && footY < l.bottom + 6
  );
  hero.onLadder = !!ladderZone && !keys.left && !keys.right && hero.attackTimer <= 0;

  if (hero.onLadder) {
    hero.vy = 0;
    if (keys.up) hero.y -= CLIMB_SPEED * dt;
    else if (keys.down) hero.y += CLIMB_SPEED * dt;
    hero.y = Math.max(ladderZone.top - CELL_H, Math.min(ladderZone.bottom - CELL_H, hero.y));
    hero.onGround = false;
  } else if (hero.attackTimer <= 0) {
    moveHorizontal(dt);
    if (keys.jump && hero.onGround) {
      hero.vy = -JUMP_SPEED;
      hero.onGround = false;
      setState("Jump");
    }
  }

  if (!hero.onLadder) {
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

  checkHazards(dt);
}

function render() {
  ctx.fillStyle = "#bfe8ea";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);

  if (!tileSheet.complete || !heroSheet.complete || !enemySheet.complete) return;

  level.platforms.forEach((p) => drawTile("Floor", p.x, p.y));
  level.ladders.forEach((l) => {
    for (let y = l.top; y < l.bottom; y += TILE_H) drawTile("Ladder", l.left, y);
  });
  level.hazards.forEach((hz) => {
    const frame = hz.type === "Flame" ? Math.floor(gameTime * 10 + hz.x) : 0;
    drawTile(hz.type, hz.x, hz.y, frame);
  });

  if (!enemy.dead) {
    drawCharacter(enemySheet, enemy.x, enemy.y, -1, "Idle", gameTime);
    ctx.fillStyle = "#3a4a58";
    ctx.fillRect(enemy.x + 20, enemy.y - 10, CELL_W - 40, 8);
    ctx.fillStyle = "#ff6b9d";
    ctx.fillRect(enemy.x + 20, enemy.y - 10, (CELL_W - 40) * (enemy.hp / enemy.maxHp), 8);
  }

  projectiles.forEach((p) => p.draw(ctx));

  const flashing = hero.invulnTimer > 0 && Math.floor(hero.invulnTimer * 10) % 2 === 0;
  if (!flashing) {
    drawCharacter(heroSheet, hero.x, hero.y, hero.facing, hero.state, hero.animTime);
  }

  ctx.fillStyle = "#2e4057";
  ctx.font = "16px monospace";
  ctx.fillText(`Leben: ${hero.lifeEnergy} / 10   (J Schlag, K Tritt, L Shuriken)`, 16, 28);
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
