/**
 * Ninja Fight - Kapitel 12: Items & Power-Ups
 * Musterloesung
 *
 * Baut auf Kapitel 11 auf. Drei Power-Ups fallen zu Levelbeginn von
 * oben herab und landen auf den vorhandenen Plattformen - mit
 * derselben Schwerkraft/Landungslogik wie der Held selbst, nur ohne
 * eigene Steuerung.
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
    Sword: { row: 6, w: 17, h: 65 },
    Shuriken: { row: 7, w: 21, h: 21 },
    Heart: { row: 8, w: 35, h: 30 },
    Flame: { row: 9, w: 16, h: 26, count: 8 },
  },
};

const GRAVITY = 1400;
const JUMP_SPEED = 620;
const WALK_SPEED = 160;
const CLIMB_SPEED = 110;
const LADDER_W = 25;
const TILE_H = 24;
const SWORD_PICKUP_DURATION = 30;

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

// entspricht der PowerUp-Klasse in entities.js
class PowerUp {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.landed = false;
    this.collected = false;
  }

  update(dt, candidates) {
    if (this.collected) return;

    if (!this.landed) {
      this.vy += GRAVITY * dt;
      const nextY = this.y + this.vy * dt;
      let landing = null;
      level.platforms.forEach((p) => {
        if (this.x > p.x && this.x < p.x + p.w && this.y <= p.y + 2 && nextY >= p.y) {
          if (landing == null || p.y < landing) landing = p.y;
        }
      });
      if (landing != null) { this.y = landing; this.vy = 0; this.landed = true; }
      else this.y = nextY;
    }

    // JEDER Kandidat wird geprueft - dadurch kann auch der Gegner das
    // Item vor der Nase des Helden wegschnappen, ganz ohne Sonderfall.
    for (const c of candidates) {
      if (!c.dead && Math.hypot(c.x + CELL_W / 2 - this.x, c.y + 70 - this.y) < 50) {
        this.collected = true;
        c.collectPowerUp(this.type);
        break;
      }
    }
  }

  draw(ctx) {
    if (this.collected) return;
    const def = TILE_SHEET.tiles[this.type];
    ctx.drawImage(
      tileSheet,
      (TILE_SHEET.cellW - def.w) / 2, def.row * TILE_SHEET.cellH + (TILE_SHEET.cellH - def.h) / 2,
      def.w, def.h,
      this.x - def.w / 2, this.y - def.h, def.w, def.h
    );
  }
}

let items = [
  new PowerUp("Heart", 460, 0),
  new PowerUp("Sword", 720, 0),
  new PowerUp("Shuriken", 300, 0),
];

const hero = {
  x: 150,
  y: FLOOR_Y - CELL_H,
  vy: 0,
  facing: 1,
  state: "Idle",
  animTime: 0,
  onGround: true,
  onLadder: false,
  lifeEnergy: 8,
  maxLifeEnergy: 10,
  invulnTimer: 0,
  attackTimer: 0,
  attackHitDone: false,
  dead: false,
  hasSword: false,
  swordTimer: 0,
  hasShuriken: false,
  shurikenCount: 0,
  // die drei Effekt-Muster: sofortig, zeitbegrenzt, zaehlbegrenzt
  collectPowerUp(type) {
    if (type === "Heart") {
      this.lifeEnergy = Math.min(this.maxLifeEnergy, this.lifeEnergy + 2);
    } else if (type === "Sword") {
      this.hasSword = true;
      this.swordTimer = SWORD_PICKUP_DURATION;
    } else if (type === "Shuriken") {
      this.hasShuriken = true;
      this.shurikenCount += 3;
    }
  },
};

const enemy = {
  x: 480,
  y: FLOOR_Y - CELL_H,
  hp: 5,
  maxHp: 5,
  dead: false,
  collectPowerUp() {
    /* der Test-Gegner ignoriert Power-Ups hier bewusst - im fertigen
       Spiel implementieren echte Gegner dieselbe Methode wie der Held */
  },
};

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

class Projectile {
  constructor(x, y, dir, owner) {
    this.x = x; this.y = y; this.dir = dir; this.owner = owner;
    this.speed = 480; this.spin = 0; this.dead = false;
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
    ctx.drawImage(tileSheet, (TILE_SHEET.cellW - def.w) / 2, def.row * TILE_SHEET.cellH + (TILE_SHEET.cellH - def.h) / 2, def.w, def.h, -def.w / 2, -def.h / 2, def.w, def.h);
    ctx.restore();
  }
}

let projectiles = [];

// Shuriken werfen kostet jetzt Munition (shurikenCount) - ohne
// aufgesammelte Shuriken kann nicht geworfen werden.
function throwShuriken() {
  if (hero.attackTimer > 0) return;
  if (!hero.hasShuriken || hero.shurikenCount <= 0) return;
  hero.shurikenCount -= 1;
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
    hero.facing = -1; hero.x -= WALK_SPEED * dt;
    if (hero.state !== "Jump" && !hero.onLadder) setState("Walk");
  } else if (keys.right) {
    hero.facing = 1; hero.x += WALK_SPEED * dt;
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
  const hitBox = rectOf(hero.x + (hero.facing > 0 ? CELL_W : -def.range), hero.y + 60, def.range, 50);
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

  items.forEach((it) => it.update(dt, [hero, enemy]));
  items = items.filter((it) => !it.collected);

  projectiles.forEach((p) => p.update(dt, [enemy]));
  projectiles = projectiles.filter((p) => !p.dead);

  if (hero.swordTimer > 0) {
    hero.swordTimer -= dt;
    if (hero.swordTimer <= 0) hero.hasSword = false;
  }

  if (hero.attackTimer > 0) {
    hero.attackTimer -= dt;
    checkMeleeHit();
    if (hero.attackTimer <= 0) setState(keys.left || keys.right ? "Walk" : "Idle");
  }

  const footX = hero.x + CELL_W / 2;
  const footY = hero.y + CELL_H;
  const ladderZone = level.ladders.find((l) => footX > l.left - 4 && footX < l.right + 4 && footY > l.top - 6 && footY < l.bottom + 6);
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
      hero.vy = -JUMP_SPEED; hero.onGround = false; setState("Jump");
    }
  }

  if (!hero.onLadder) {
    hero.vy += GRAVITY * dt;
    const nextY = hero.y + hero.vy * dt;
    const landing = hero.vy >= 0 ? findLanding(nextY) : null;
    if (landing) {
      hero.y = landing.y - CELL_H; hero.vy = 0; hero.onGround = true;
      if (hero.state === "Jump") setState(keys.left || keys.right ? "Walk" : "Idle");
    } else {
      hero.y = nextY; hero.onGround = false;
    }
  }

  checkHazards(dt);
}

function render() {
  ctx.fillStyle = "#bfe8ea";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  if (!tileSheet.complete || !heroSheet.complete || !enemySheet.complete) return;

  level.platforms.forEach((p) => drawTile("Floor", p.x, p.y));
  level.ladders.forEach((l) => { for (let y = l.top; y < l.bottom; y += TILE_H) drawTile("Ladder", l.left, y); });
  level.hazards.forEach((hz) => {
    const frame = hz.type === "Flame" ? Math.floor(gameTime * 10 + hz.x) : 0;
    drawTile(hz.type, hz.x, hz.y, frame);
  });

  items.forEach((it) => it.draw(ctx));

  if (!enemy.dead) {
    drawCharacter(enemySheet, enemy.x, enemy.y, -1, "Idle", gameTime);
    ctx.fillStyle = "#3a4a58"; ctx.fillRect(enemy.x + 20, enemy.y - 10, CELL_W - 40, 8);
    ctx.fillStyle = "#ff6b9d"; ctx.fillRect(enemy.x + 20, enemy.y - 10, (CELL_W - 40) * (enemy.hp / enemy.maxHp), 8);
  }

  projectiles.forEach((p) => p.draw(ctx));

  const flashing = hero.invulnTimer > 0 && Math.floor(hero.invulnTimer * 10) % 2 === 0;
  if (!flashing) drawCharacter(heroSheet, hero.x, hero.y, hero.facing, hero.state, hero.animTime);

  ctx.fillStyle = "#2e4057";
  ctx.font = "16px monospace";
  ctx.fillText(
    `Leben: ${hero.lifeEnergy}/${hero.maxLifeEnergy}  Schwert: ${hero.hasSword ? hero.swordTimer.toFixed(0) + "s" : "-"}  Shuriken: ${hero.shurikenCount}`,
    16, 28
  );
}

function loop(now) {
  if (lastTime === 0) lastTime = now;
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
