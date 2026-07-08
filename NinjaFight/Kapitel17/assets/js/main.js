/**
 * Ninja Fight - Kapitel 14: Gegner-KI: Kampf & Gegnertypen
 * Musterloesung
 *
 * Baut auf Kapitel 13 auf. Der patrouillierende Gegner greift jetzt
 * auch an - Nahkampf, Fernkampf oder Schwert, je nach Abstand UND
 * Gegnertyp. ENEMY_TYPES/HP_BY_TYPE koppeln Faehigkeiten und
 * Lebenspunkte an den Typ.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const STAGE_W = canvas.width;
const STAGE_H = canvas.height;

const heroSheet = new Image();
heroSheet.src = "assets/img/sprites/hero.png";

const enemySheet = new Image();
enemySheet.src = "assets/img/sprites/green.png";

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
const ENEMY_SPEED = 90;
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
const HAZARD_TYPES = { Flame: { damage: 1, cooldown: 0.6 }, Knives: { damage: 3, cooldown: 0.6 } };
const DAMAGE = { Hit: 1, Kick: 2, Shuriken: 5, Sword: 10 };

// Faehigkeiten und HP sind an den Gegnertyp gekoppelt - ein neuer Typ
// braucht nur einen neuen Eintrag in diesen beiden Tabellen.
const ENEMY_TYPES = {
  Blue: { canShuriken: false, canSword: false },
  Green: { canShuriken: true, canSword: false },
  Red: { canShuriken: false, canSword: true },
  White: { canShuriken: true, canSword: true },
};
const HP_BY_TYPE = { Blue: 10, Green: 20, Red: 30, White: 50 };

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
  const platforms = [], hazards = [], ladderTiles = [];
  raw.forEach((el) => {
    if (PLATFORM_TYPES.has(el.type)) platforms.push({ x: el.x, y: el.y, w: 41 });
    else if (el.type === "Ladder") ladderTiles.push({ x: el.x, y: el.y });
    else if (HAZARD_TYPES[el.type]) {
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
  SwordHit: { row: 7, count: 8, loop: false },
};
const FPS = 8;
const ATTACKS = {
  Hit: { range: 30, damage: 1, duration: 0.35 },
  Kick: { range: 34, damage: 2, duration: 0.35 },
  SwordHit: { range: 46, damage: 10, duration: 0.35 },
};

// entspricht SoundController.as - buendelt Musik und Soundeffekte an
// einem Ort mit gemeinsamer Lautstaerke.
class SoundController {
  constructor() {
    this.gameMusic = new Audio("assets/sounds/Lost-Jungle.mp3");
    this.swordSfx = new Audio("assets/sounds/sword.mp3");
    this.collectSfx = new Audio("assets/sounds/Coins.mp3");
    this.gameMusic.loop = true;
    this.volume = 0.5;
    this.applyVolume();
  }
  applyVolume() {
    [this.gameMusic, this.swordSfx, this.collectSfx].forEach((a) => (a.volume = this.volume));
  }
  playGameMusic() {
    this.gameMusic.currentTime = 0;
    this.gameMusic.play().catch(() => {});
  }
  playSword() {
    this.swordSfx.currentTime = 0;
    this.swordSfx.play().catch(() => {});
  }
  playCollect() {
    this.collectSfx.currentTime = 0;
    this.collectSfx.play().catch(() => {});
  }
}
const sound = new SoundController();
// Browser verlangen eine Nutzerinteraktion, bevor Audio abgespielt werden
// darf - deshalb starten wir die Musik beim ersten Tastendruck.
window.addEventListener("keydown", () => sound.playGameMusic(), { once: true });

const hero = {
  x: 300, y: FLOOR_Y - CELL_H, vy: 0, facing: 1, state: "Idle", animTime: 0,
  onGround: true, onLadder: false, lifeEnergy: 10, maxLifeEnergy: 10, invulnTimer: 0,
  attackTimer: 0, attackHitDone: false, dead: false,
  hasSword: true, swordTimer: 0, hasShuriken: true, shurikenCount: 5,
  collectPowerUp(type) {
    if (type === "Heart") this.lifeEnergy = Math.min(this.maxLifeEnergy, this.lifeEnergy + 2);
    else if (type === "Sword") { this.hasSword = true; this.swordTimer = SWORD_PICKUP_DURATION; }
    else if (type === "Shuriken") { this.hasShuriken = true; this.shurikenCount += 3; }
    sound.playCollect();
  },
};

function heroTakeDamage(dmg) {
  if (hero.invulnTimer > 0) return;
  hero.lifeEnergy = Math.max(0, hero.lifeEnergy - dmg);
  hero.invulnTimer = 0.6;
}

// entspricht Enemy in entities.js - jetzt mit Angriffsentscheidung
const enemy = {
  type: "Green",
  def: ENEMY_TYPES.Green,
  x: 40, y: FLOOR_Y - CELL_H, vy: 0, facing: 1, state: "Idle", animTime: 0,
  onGround: true,
  hp: HP_BY_TYPE.Green, maxHp: HP_BY_TYPE.Green,
  dead: false,
  patrolLeft: 20, patrolRight: 220,
  jumpCooldown: 2 + Math.random() * 2,
  attackCooldown: 1 + Math.random(),
  attackTimer: 0,
  hasShuriken: ENEMY_TYPES.Green.canShuriken,
  shurikenCount: ENEMY_TYPES.Green.canShuriken ? 99 : 0,
  hasSword: ENEMY_TYPES.Green.canSword,
  collectPowerUp() {},
};

function hasSupportAhead(dist) {
  const aheadX = enemy.x + CELL_W / 2 + enemy.facing * dist;
  return level.platforms.some((p) => aheadX > p.x - 4 && aheadX < p.x + p.w + 4 && Math.abs(p.y - (enemy.y + CELL_H)) < 6);
}
function findEnemyLanding(nextY) {
  const footX = enemy.x + CELL_W / 2;
  let best = null;
  level.platforms.forEach((p) => {
    const top = p.y;
    if (footX > p.x && footX < p.x + p.w && enemy.y + CELL_H <= top + 2 && nextY + CELL_H >= top) {
      if (!best || top < best.y) best = { y: top };
    }
  });
  return best;
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
      if (t === hero) {
        if (Math.hypot(hero.x + CELL_W / 2 - this.x, hero.y + 70 - this.y) < 40) {
          heroTakeDamage(DAMAGE.Shuriken); this.dead = true; break;
        }
      } else if (Math.hypot(t.x + CELL_W / 2 - this.x, t.y + 70 - this.y) < 40) {
        // trifft AUCH andere Gegner - Friendly Fire kommt gratis mit,
        // weil wir "jeden ausser dem Werfer" pruefen (Kapitel 11)
        t.hp = Math.max(0, t.hp - DAMAGE.Shuriken);
        if (t.hp === 0) t.dead = true;
        this.dead = true; break;
      }
    }
  }
  draw(ctx) {
    ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.spin);
    const def = TILE_SHEET.tiles.Shuriken;
    ctx.drawImage(tileSheet, (TILE_SHEET.cellW - def.w) / 2, def.row * TILE_SHEET.cellH + (TILE_SHEET.cellH - def.h) / 2, def.w, def.h, -def.w / 2, -def.h / 2, def.w, def.h);
    ctx.restore();
  }
}
let projectiles = [];

// Der eigentliche Entscheidungsbaum aus Enemy.update(): Nahkampf
// zuerst pruefen (kuerzeste Reichweite), dann Fernkampf, dann Schwert.
function updateEnemyCombat(dt) {
  enemy.attackCooldown -= dt;
  if (enemy.attackTimer > 0) { enemy.attackTimer -= dt; return; }
  if (enemy.attackCooldown > 0) return;

  const dist = Math.hypot(hero.x - enemy.x, hero.y - enemy.y);
  if (dist < 260) enemy.facing = hero.x > enemy.x ? 1 : -1;

  if (dist < 40) {
    const useKick = Math.random() < 0.5;
    enemy.state = useKick ? "Kick" : "Hit";
    enemy.animTime = 0;
    enemy.attackTimer = 0.3;
    enemy.attackCooldown = 1.4 + Math.random();
    heroTakeDamage(useKick ? DAMAGE.Kick : DAMAGE.Hit);
  } else if (dist < 260 && enemy.hasShuriken && enemy.shurikenCount > 0 && Math.random() < 0.5) {
    enemy.state = "Throw"; enemy.animTime = 0;
    enemy.attackTimer = 0.3; enemy.attackCooldown = 2 + Math.random() * 1.5;
    projectiles.push(new Projectile(enemy.x + (enemy.facing > 0 ? CELL_W : -10), enemy.y + 70, enemy.facing, enemy));
  } else if (dist < 60 && enemy.hasSword) {
    enemy.state = "Hit"; enemy.animTime = 0; // eigene SwordHit-Animation folgt in einer spaeteren Ausbaustufe
    enemy.attackTimer = 0.3; enemy.attackCooldown = 1.6 + Math.random();
    heroTakeDamage(DAMAGE.Sword);
  }
}

function updateEnemy(dt) {
  if (enemy.dead) return;
  enemy.animTime += dt;
  enemy.jumpCooldown -= dt;

  updateEnemyCombat(dt);

  if (enemy.attackTimer <= 0) {
    const lookAhead = 26;
    const supported = hasSupportAhead(lookAhead);
    if (!supported) { enemy.facing *= -1; }
    else { enemy.x += enemy.facing * ENEMY_SPEED * dt; }
    if (enemy.state !== "Hit" && enemy.state !== "Kick" && enemy.state !== "Throw") enemy.state = "Walk";

    if (enemy.x <= enemy.patrolLeft) { enemy.x = enemy.patrolLeft; enemy.facing = 1; }
    else if (enemy.x >= enemy.patrolRight) { enemy.x = enemy.patrolRight; enemy.facing = -1; }
    else if (supported && enemy.onGround && enemy.jumpCooldown <= 0 && Math.random() < 0.01) {
      enemy.vy = -520; enemy.onGround = false; enemy.jumpCooldown = 2.5 + Math.random() * 2;
    }
  }

  enemy.vy += GRAVITY * dt;
  const nextY = enemy.y + enemy.vy * dt;
  const landing = enemy.vy >= 0 ? findEnemyLanding(nextY) : null;
  if (landing) { enemy.y = landing.y - CELL_H; enemy.vy = 0; enemy.onGround = true; }
  else { enemy.y = nextY; enemy.onGround = false; }
}

function setState(state) {
  if (hero.state === state) return;
  const busy = ["Hit", "Kick", "Throw", "SwordHit"].includes(hero.state) && hero.attackTimer > 0;
  if (busy) return;
  hero.state = state; hero.animTime = 0;
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
  // Mit ausgeruestetem Schwert ersetzt ein kraeftiger Hieb (SwordHit)
  // den einfachen Tritt - groessere Reichweite, deutlich mehr Schaden.
  if (type === "Kick" && hero.hasSword) {
    type = "SwordHit";
    sound.playSword();
  }
  hero.state = type; hero.animTime = 0;
  hero.attackTimer = ATTACKS[type].duration; hero.attackHitDone = false;
}
function throwShuriken() {
  if (hero.attackTimer > 0 || !hero.hasShuriken || hero.shurikenCount <= 0) return;
  hero.shurikenCount -= 1;
  hero.state = "Throw"; hero.animTime = 0; hero.attackTimer = 0.35;
  projectiles.push(new Projectile(hero.x + (hero.facing > 0 ? CELL_W : -10), hero.y + 70, hero.facing, hero));
}

function overlaps(a, b) { return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; }
function rectOf(x, y, w, h) { return { left: x, right: x + w, top: y, bottom: y + h }; }

// entspricht drawHealthBar() in render.js: ein Hintergrundrechteck plus
// ein zweites, proportional zu hp/maxHp skaliertes Rechteck.
function drawHealthBar(ctx, x, y, hp, maxHp) {
  const w = 60, h = 6;
  const pct = Math.max(0, hp / maxHp);
  ctx.save();
  ctx.fillStyle = "rgba(5,7,10,0.7)";
  ctx.fillRect(x - w / 2 - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = "#3a1010";
  ctx.fillRect(x - w / 2, y, w, h);
  ctx.fillStyle = pct > 0.5 ? "#5fe07a" : pct > 0.25 ? "#ffb84d" : "#ff5555";
  ctx.fillRect(x - w / 2, y, w * pct, h);
  ctx.restore();
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
  const sx = frame * CELL_W, sy = def.row * CELL_H;
  ctx.save(); ctx.translate(x + CELL_W / 2, y); ctx.scale(facing, 1);
  ctx.drawImage(sheet, sx, sy, CELL_W, CELL_H, -CELL_W / 2, 0, CELL_W, CELL_H);
  ctx.restore();
}

function moveHorizontal(dt) {
  if (keys.left) { hero.facing = -1; hero.x -= WALK_SPEED * dt; if (hero.state !== "Jump" && !hero.onLadder) setState("Walk"); }
  else if (keys.right) { hero.facing = 1; hero.x += WALK_SPEED * dt; if (hero.state !== "Jump" && !hero.onLadder) setState("Walk"); }
  else if (hero.state === "Walk") setState("Idle");
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
  const footX = hero.x + CELL_W / 2, footY = hero.y + CELL_H;
  if (hero.invulnTimer <= 0) {
    level.hazards.forEach((hz) => {
      const def = HAZARD_TYPES[hz.type];
      if (footX > hz.x && footX < hz.x + hz.w && footY > hz.y && footY < hz.y + hz.h + 6) {
        hero.lifeEnergy = Math.max(0, hero.lifeEnergy - def.damage);
        hero.invulnTimer = def.cooldown;
      }
    });
  }
  if (hero.invulnTimer > 0) hero.invulnTimer -= dt;
}
function checkMeleeHit() {
  if (hero.attackTimer <= 0 || hero.attackHitDone) return;
  if (!["Hit", "Kick", "SwordHit"].includes(hero.state)) return;
  const def = ATTACKS[hero.state];
  const hitBox = rectOf(hero.x + (hero.facing > 0 ? CELL_W : -def.range), hero.y + 60, def.range, 50);
  const enemyBox = rectOf(enemy.x, enemy.y + 40, CELL_W, 80);
  if (!enemy.dead && overlaps(hitBox, enemyBox)) {
    enemy.hp = Math.max(0, enemy.hp - def.damage);
    if (enemy.hp === 0) { enemy.dead = true; points += 100; }
    hero.attackHitDone = true;
  }
}

// entspricht ui.updateHud(): wird JEDEN Frame aufgerufen, nicht nur bei
// Ereignissen - eine vergessene Aktualisierungsstelle wuerde sonst zu
// kurzzeitig falschen Anzeigen fuehren.
function updateHud() {
  document.getElementById("hud-life").textContent = `❤ ${hero.lifeEnergy}`;
  document.getElementById("hud-points").textContent = `Punkte: ${points}`;
  const parts = [];
  if (hero.hasShuriken) parts.push(`✦ ${hero.shurikenCount}`);
  if (hero.hasSword) parts.push(`🗡`);
  document.getElementById("hud-weapons").textContent = parts.join("   ");
  const s = Math.max(0, Math.floor(gameTime));
  const m = Math.floor(s / 60), r = s % 60;
  document.getElementById("hud-time").textContent = `${m}:${String(r).padStart(2, "0")}`;
}

let lastTime = 0;
let gameTime = 0;
let points = 0;

function update(dt) {
  gameTime += dt;
  hero.animTime += dt;

  updateEnemy(dt);

  projectiles.forEach((p) => p.update(dt, [hero, enemy]));
  projectiles = projectiles.filter((p) => !p.dead);

  if (hero.swordTimer > 0) { hero.swordTimer -= dt; if (hero.swordTimer <= 0) hero.hasSword = false; }

  if (hero.attackTimer > 0) {
    hero.attackTimer -= dt;
    checkMeleeHit();
    if (hero.attackTimer <= 0) setState(keys.left || keys.right ? "Walk" : "Idle");
  }

  const footX = hero.x + CELL_W / 2, footY = hero.y + CELL_H;
  const ladderZone = level.ladders.find((l) => footX > l.left - 4 && footX < l.right + 4 && footY > l.top - 6 && footY < l.bottom + 6);
  hero.onLadder = !!ladderZone && !keys.left && !keys.right && hero.attackTimer <= 0;

  if (hero.onLadder) {
    hero.vy = 0;
    if (keys.up) hero.y -= CLIMB_SPEED * dt; else if (keys.down) hero.y += CLIMB_SPEED * dt;
    hero.y = Math.max(ladderZone.top - CELL_H, Math.min(ladderZone.bottom - CELL_H, hero.y));
    hero.onGround = false;
  } else if (hero.attackTimer <= 0) {
    moveHorizontal(dt);
    if (keys.jump && hero.onGround) { hero.vy = -JUMP_SPEED; hero.onGround = false; setState("Jump"); }
  }

  if (!hero.onLadder) {
    hero.vy += GRAVITY * dt;
    const nextY = hero.y + hero.vy * dt;
    const landing = hero.vy >= 0 ? findLanding(nextY) : null;
    if (landing) {
      hero.y = landing.y - CELL_H; hero.vy = 0; hero.onGround = true;
      if (hero.state === "Jump") setState(keys.left || keys.right ? "Walk" : "Idle");
    } else { hero.y = nextY; hero.onGround = false; }
  }

  checkHazards(dt);
  updateHud();
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

  if (!enemy.dead) {
    drawCharacter(enemySheet, enemy.x, enemy.y, enemy.facing, enemy.state, enemy.animTime);
    drawHealthBar(ctx, enemy.x + CELL_W / 2, enemy.y + 15, enemy.hp, enemy.maxHp);
  }

  projectiles.forEach((p) => p.draw(ctx));

  const flashing = hero.invulnTimer > 0 && Math.floor(hero.invulnTimer * 10) % 2 === 0;
  if (!flashing) drawCharacter(heroSheet, hero.x, hero.y, hero.facing, hero.state, hero.animTime);

  ctx.fillStyle = "#2e4057";
  ctx.font = "16px monospace";
  ctx.fillText(`Leben: ${hero.lifeEnergy}/${hero.maxLifeEnergy}  Gegnertyp: ${enemy.type} (HP ${enemy.hp}/${enemy.maxHp})`, 16, 28);
}

// entspricht ui.showScreen(): entfernt "active" von ALLEN Bildschirmen
// und setzt es nur auf den gewuenschten - nie zwei gleichzeitig sichtbar.
let gameState = "start"; // "start" | "game" | "pause"

function showScreen(name) {
  gameState = name;
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  const el = document.getElementById("screen-" + name);
  if (el) el.classList.add("active");
}

function loop(now) {
  if (gameState !== "game") return; // Pause/Start-Bildschirm -> Loop pausiert sich selbst

  if (lastTime === 0) lastTime = now;
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

document.getElementById("btn-play").addEventListener("click", () => {
  showScreen("game");
  lastTime = 0;
  requestAnimationFrame(loop);
});
document.getElementById("btn-resume").addEventListener("click", () => {
  showScreen("game");
  lastTime = 0;
  requestAnimationFrame(loop);
});

window.addEventListener("keydown", (e) => {
  if (e.code !== "Escape") return;
  if (gameState === "game") {
    showScreen("pause");
  } else if (gameState === "pause") {
    showScreen("game");
    lastTime = 0;
    requestAnimationFrame(loop);
  }
});

showScreen("start");
