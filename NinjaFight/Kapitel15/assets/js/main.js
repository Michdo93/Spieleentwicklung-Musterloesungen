/**
 * Ninja Fight - Kapitel 7: Level-Daten & Tile-Rendering
 * Musterloesung
 *
 * Baut auf Kapitel 6 auf. Statt weniger Testplattformen bauen wir jetzt
 * die ersten beiden ECHTEN Level aus Ninja Fight nach - Koordinaten 1:1
 * aus levels.js uebernommen. buildLevel() sortiert die Rohdaten nach
 * Bedeutung; in diesem Kapitel interessieren uns nur Plattformen und
 * Leitern (rein optisch) - Feuer, Messer und Wasser-Kacheln ignorieren
 * wir bewusst noch (kommt in Kapitel 8/9 dazu), man kann also ueberall
 * problemlos stehen.
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

// entspricht TILE_SHEET in spritedata.js - je Kacheltyp seine eigene,
// tatsaechliche Groesse (nicht alle Kacheln sind gleich gross!)
const TILE_SHEET = {
  cellW: 42, cellH: 66,
  tiles: {
    Floor: { row: 0, w: 41, h: 21 },
    WaterGround: { row: 1, w: 40, h: 18 },
    Bridge: { row: 2, w: 36, h: 13 },
    Ladder: { row: 3, w: 25, h: 24 },
    Knives: { row: 4, w: 18, h: 16 },
    Small: { row: 5, w: 41, h: 24 },
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

// Original-Level-Layouts, 1:1 aus levels.js uebernommen. "Bottom" und
// "WaterTop" sind rein dekorativ (keine eigene Kollision), "Flame" und
// "Knives" sind Gefahren - beides ignorieren wir in diesem Kapitel noch.
const LEVELS = {
  1: [
    { type: "WaterGround", x: 760.0, y: 434.1 },
    { type: "WaterGround", x: 800.0, y: 434.1 },
    { type: "WaterGround", x: 840.0, y: 434.1 },
    { type: "WaterGround", x: 880.0, y: 434.1 },
    { type: "WaterGround", x: 920.0, y: 434.1 },
    { type: "Floor", x: 0.0, y: 414.1 },
    { type: "Floor", x: 40.0, y: 414.1 },
    { type: "Floor", x: 80.0, y: 413.8 },
    { type: "Floor", x: 120.0, y: 414.1 },
    { type: "Floor", x: 160.0, y: 414.1 },
    { type: "Floor", x: 200.0, y: 414.1 },
    { type: "Floor", x: 240.0, y: 414.1 },
    { type: "Floor", x: 280.0, y: 414.1 },
    { type: "Floor", x: 320.0, y: 414.1 },
    { type: "Floor", x: 360.0, y: 414.0 },
    { type: "Floor", x: 400.0, y: 414.0 },
    { type: "Floor", x: 440.0, y: 414.1 },
    { type: "Floor", x: 480.0, y: 413.9 },
    { type: "Floor", x: 520.0, y: 413.9 },
    { type: "Floor", x: 560.0, y: 414.0 },
    { type: "Floor", x: 600.0, y: 413.9 },
    { type: "Floor", x: 640.0, y: 413.9 },
    { type: "Floor", x: 680.0, y: 413.9 },
    { type: "Floor", x: 720.0, y: 413.9 },
    { type: "Floor", x: 959.8, y: 414.1 },
    { type: "Floor", x: 999.8, y: 413.9 },
    { type: "Bottom", x: 429.0, y: 316.9 },
    { type: "Bottom", x: 548.3, y: 316.9 },
    { type: "Floor", x: 429.0, y: 297.6 },
    { type: "Floor", x: 548.3, y: 297.6 },
    { type: "Bottom", x: 700.1, y: 316.4 },
    { type: "Bottom", x: 740.1, y: 316.4 },
    { type: "Floor", x: 700.1, y: 297.6 },
    { type: "Floor", x: 736.6, y: 297.6 },
    { type: "Floor", x: 776.2, y: 297.6 },
    { type: "Small", x: 37.8, y: 361.4 },
    { type: "Small", x: 77.8, y: 361.4 },
    { type: "Small", x: 117.8, y: 361.4 },
    { type: "Small", x: 157.8, y: 361.4 },
    { type: "Small", x: 169.2, y: 309.6 },
    { type: "Small", x: 209.2, y: 309.6 },
    { type: "Small", x: 249.2, y: 309.6 },
    { type: "Small", x: 289.2, y: 309.6 },
    { type: "Small", x: 469.0, y: 316.9 },
    { type: "Small", x: 508.8, y: 316.9 },
    { type: "Small", x: 329.2, y: 309.6 },
    { type: "WaterTop", x: 760.0, y: 415.8 },
    { type: "WaterTop", x: 800.0, y: 415.6 },
    { type: "WaterTop", x: 840.0, y: 415.9 },
    { type: "WaterTop", x: 879.8, y: 415.8 },
    { type: "WaterTop", x: 919.8, y: 415.9 },
    { type: "Flame", x: 589.7, y: 298.4 },
    { type: "Flame", x: 433.4, y: 414.4 },
    { type: "Flame", x: 73.5, y: 360.2 },
    { type: "Bridge", x: 664.0, y: 298.5 },
    { type: "Bridge", x: 628.0, y: 298.5 },
    { type: "Knives", x: 481.4, y: 299.9 },
    { type: "Knives", x: 497.9, y: 299.9 },
    { type: "Ladder", x: 726.5, y: 389.8 },
    { type: "Ladder", x: 726.5, y: 365.8 },
    { type: "Ladder", x: 726.5, y: 341.8 },
    { type: "Ladder", x: 726.5, y: 317.9 },
    { type: "Ladder", x: 726.5, y: 293.4 },
    { type: "Small", x: 588.0, y: 298.6 },
  ],
  2: [
    { type: "Floor", x: 0.0, y: 414.1 },
    { type: "Floor", x: 40.0, y: 414.1 },
    { type: "Floor", x: 80.0, y: 413.8 },
    { type: "Floor", x: 120.0, y: 414.1 },
    { type: "Floor", x: 160.0, y: 414.1 },
    { type: "Floor", x: 200.0, y: 414.1 },
    { type: "Floor", x: 240.0, y: 414.1 },
    { type: "Floor", x: 280.0, y: 414.1 },
    { type: "Floor", x: 320.0, y: 414.1 },
    { type: "Floor", x: 360.0, y: 414.0 },
    { type: "Floor", x: 400.0, y: 414.0 },
    { type: "Floor", x: 440.0, y: 414.1 },
    { type: "Floor", x: 480.0, y: 413.9 },
    { type: "Floor", x: 520.0, y: 413.9 },
    { type: "Floor", x: 560.0, y: 414.0 },
    { type: "Floor", x: 600.0, y: 413.9 },
    { type: "Floor", x: 640.0, y: 413.9 },
    { type: "Floor", x: 680.0, y: 413.9 },
    { type: "Floor", x: 720.0, y: 413.9 },
    { type: "Floor", x: 959.8, y: 414.1 },
    { type: "Floor", x: 999.8, y: 413.9 },
    { type: "Bottom", x: 429.0, y: 316.9 },
    { type: "Floor", x: 429.0, y: 297.6 },
    { type: "Small", x: 37.8, y: 361.4 },
    { type: "Small", x: 77.8, y: 361.4 },
    { type: "Small", x: 117.8, y: 361.4 },
    { type: "Small", x: 157.8, y: 361.4 },
    { type: "Small", x: 169.2, y: 309.6 },
    { type: "Small", x: 209.2, y: 309.6 },
    { type: "Small", x: 249.2, y: 309.6 },
    { type: "Small", x: 289.2, y: 309.6 },
    { type: "Small", x: 469.0, y: 316.9 },
    { type: "Small", x: 508.8, y: 316.9 },
    { type: "Small", x: 329.2, y: 309.6 },
    { type: "WaterTop", x: 760.0, y: 415.8 },
    { type: "WaterTop", x: 800.0, y: 415.6 },
    { type: "WaterTop", x: 840.0, y: 415.9 },
    { type: "WaterTop", x: 879.8, y: 415.8 },
    { type: "WaterTop", x: 919.8, y: 415.9 },
    { type: "Flame", x: 433.4, y: 414.4 },
    { type: "Flame", x: 73.5, y: 360.2 },
    { type: "Knives", x: 481.4, y: 299.9 },
    { type: "Knives", x: 497.9, y: 299.9 },
    { type: "WaterGround", x: 760.0, y: 434.1 },
    { type: "WaterGround", x: 800.0, y: 434.1 },
    { type: "WaterGround", x: 840.0, y: 434.1 },
    { type: "WaterGround", x: 880.0, y: 434.1 },
    { type: "WaterGround", x: 920.0, y: 434.1 },
  ],
};

const PLATFORM_TYPES = new Set(["Floor", "Bridge", "Small", "WaterGround"]);
// Schaden und Abklingzeit je Gefahrentyp - entspricht checkHazards() in
// Hero.as/entities.js (dort fast wortgleich auch fuer Enemy).
const HAZARD_TYPES = {
  Flame: { damage: 1, cooldown: 0.6 },
  Knives: { damage: 5, cooldown: 0.6 },
};

// entspricht buildLevel() in render.js: sortiert die flache Rohdatenliste
// einmal nach Bedeutung. Ladder wird hier nur fuers Zeichnen erfasst -
// die eigentliche Kletterlogik kommt erst in Kapitel 9 dazu.
const LADDER_W = 25;
const LADDER_TILE_H = 24;

// entspricht mergeLadderColumns() in render.js: fasst einzelne
// Leiter-Kacheln in derselben Spalte zu EINER zusammenhaengenden
// Kletterzone zusammen. "bottom" reicht genau eine Kachelhoehe ueber
// die letzte Sprosse hinaus - siehe Buch fuer die echte Bugfix-Story
// dazu (vorher wurde hier faelschlich eine Kachelhoehe zu viel
// addiert, wodurch Held und Gegner am Leiterende ins Leere fielen).
function mergeLadderColumns(tiles) {
  const groups = [];
  tiles.forEach((t) => {
    let g = groups.find((g) => Math.abs(g.x - t.x) < 8);
    if (!g) { g = { x: t.x, minY: t.y, maxY: t.y }; groups.push(g); }
    else { g.minY = Math.min(g.minY, t.y); g.maxY = Math.max(g.maxY, t.y); }
  });
  return groups.map((g) => ({ left: g.x, right: g.x + LADDER_W, top: g.minY, bottom: g.maxY + LADDER_TILE_H }));
}

function buildLevel(levelNum) {
  const raw = LEVELS[levelNum];
  const platforms = [];
  const ladderTiles = [];
  const hazards = [];

  raw.forEach((el) => {
    if (PLATFORM_TYPES.has(el.type)) {
      const size = TILE_SHEET.tiles[el.type];
      platforms.push({ type: el.type, x: el.x, y: el.y, w: size.w, h: size.h });
    } else if (el.type === "Ladder") {
      ladderTiles.push({ x: el.x, y: el.y });
    } else if (HAZARD_TYPES[el.type]) {
      // Flame.y ist die BASIS der Flamme (Bodenhoehe) - die Flamme
      // waechst nach OBEN, nicht umgekehrt (siehe Buch: haeufiger
      // Bugfix-Hinweis in der echten Entwicklung von Ninja Fight).
      const size = TILE_SHEET.tiles[el.type];
      hazards.push({ type: el.type, x: el.x, y: el.y, w: size.w, h: size.h });
    }
    // Bottom/WaterTop: weiterhin rein dekorativ, bleiben ignoriert
  });

  return { platforms, ladders: mergeLadderColumns(ladderTiles), hazards };
}

let level = buildLevel(1);
let currentLevelNum = 1;

document.getElementById("btn-level1").addEventListener("click", () => {
  currentLevelNum = 1;
  level = buildLevel(1);
  enemies = spawnEnemies(1);
  powerUps = [];
  setupPowerUpSchedule();
});
document.getElementById("btn-level2").addEventListener("click", () => {
  currentLevelNum = 2;
  level = buildLevel(2);
  enemies = spawnEnemies(2);
  powerUps = [];
  setupPowerUpSchedule();
});

// entspricht SoundController.as - buendelt Musik und Soundeffekte an
// einem Ort mit gemeinsamer Lautstaerke.
class SoundController {
  constructor() {
    this.gameMusic = new Audio("assets/sounds/Lost-Jungle.mp3");
    this.swordSfx = new Audio("assets/sounds/sword.mp3");
    this.coinsSfx = new Audio("assets/sounds/Coins.mp3");
    this.gameMusic.loop = true;
    this.volume = 0.5;
    this.applyVolume();
  }
  applyVolume() {
    [this.gameMusic, this.swordSfx, this.coinsSfx].forEach((a) => (a.volume = this.volume));
  }
  playGameMusic() {
    this.gameMusic.currentTime = 0;
    this.gameMusic.play().catch(() => {});
  }
  playSword() {
    this.swordSfx.currentTime = 0;
    this.swordSfx.play().catch(() => {});
  }
  playCoins() {
    this.coinsSfx.currentTime = 0;
    this.coinsSfx.play().catch(() => {});
  }
}
const sound = new SoundController();
// Browser verlangen eine Nutzerinteraktion, bevor Audio abgespielt
// werden darf - deshalb starten wir die Musik beim ersten Tastendruck.
window.addEventListener("keydown", () => sound.playGameMusic(), { once: true });

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

// entspricht DAMAGE in entities.js
const DAMAGE = { Hit: 1, Kick: 2, Sword: 10, Shuriken: 5 };
const ATTACKS = {
  Hit: { range: 30, damage: DAMAGE.Hit, duration: 0.35 },
  Kick: { range: 34, damage: DAMAGE.Kick, duration: 0.35 },
  SwordHit: { range: 46, damage: DAMAGE.Sword, duration: 0.35 },
};

const hero = {
  x: 60,
  y: 414.1,
  vy: 0,
  facing: 1,
  state: "Idle",
  animTime: 0,
  onGround: true,
  lifeEnergy: 10,
  maxLifeEnergy: 10,
  invulnTimer: 0,
  onLadder: false,
  hasSword: true, // von Anfang an unbegrenzt verfuegbar (Kapitel 10)
  hasShuriken: true,
  shurikenCount: 100, // von Anfang an dabei (Kapitel 11)
  attackTimer: 0,
  attackHitDone: false,
  // entspricht collectPowerUp() in entities.js - drei Effekt-Muster:
  // sofortig, zeitbegrenzt, zaehlbegrenzt
  collectPowerUp(type) {
    if (type === "Heart") {
      this.lifeEnergy = Math.min(this.maxLifeEnergy, this.lifeEnergy + 2);
    } else if (type === "Sword") {
      this.hasSword = true; // hier bereits dauerhaft vorhanden (Kapitel 10)
    } else if (type === "Shuriken") {
      this.hasShuriken = true;
      this.shurikenCount += 3;
    }
    sound.playCoins();
  },
};

// entspricht dem Enemy-Spawn in gamemanager.js: Level 1 = Blue, Level 2
// = Green, hier vereinfacht auf je 3 Gegner ohne Bewegung/KI (kommt
// erst in Kapitel 13/14). Positionen bewusst abseits der Flamme bei
// x=433 im Hauptboden gewaehlt.
const ENEMY_SHEETS = {
  Blue: (() => { const i = new Image(); i.src = "assets/img/sprites/blue.png"; return i; })(),
  Green: (() => { const i = new Image(); i.src = "assets/img/sprites/green.png"; return i; })(),
  Red: (() => { const i = new Image(); i.src = "assets/img/sprites/red.png"; return i; })(),
  White: (() => { const i = new Image(); i.src = "assets/img/sprites/white.png"; return i; })(),
};
const ENEMY_TYPE_BY_LEVEL = { 1: "Blue", 2: "Green" };
const ENEMY_X_POSITIONS = [520, 620, 700];

// entspricht ENEMY_TYPES + HP_BY_TYPE in entities.js - Faehigkeiten und
// Lebenspunkte sind an den Typ gekoppelt, nicht an einzelne Instanzen.
// Alle vier Typen sind hier bereits vollstaendig hinterlegt, auch wenn
// unsere zwei Level bisher nur Blue und Green verwenden.
const ENEMY_TYPES = {
  Blue: { canShuriken: false, canSword: false },
  Green: { canShuriken: true, canSword: false },
  Red: { canShuriken: false, canSword: true },
  White: { canShuriken: true, canSword: true },
};
const HP_BY_TYPE = { Blue: 10, Green: 20, Red: 30, White: 50 };

function spawnEnemies(levelNum) {
  const type = ENEMY_TYPE_BY_LEVEL[levelNum];
  const hp = HP_BY_TYPE[type];
  return ENEMY_X_POSITIONS.map((x) => ({
    type,
    x, y: 414.1,
    facing: -1,
    state: "Idle",
    animTime: Math.random() * 2,
    hp, maxHp: hp,
    dead: false,
    vy: 0,
    onGround: true,
    patrolLeft: x - 60,
    patrolRight: x + 60,
    jumpCooldown: 1 + Math.random() * 2,
    attackCooldown: 1 + Math.random(),
    attackTimer: 0,
    hasShuriken: ENEMY_TYPES[type].canShuriken,
    shurikenCount: ENEMY_TYPES[type].canShuriken ? Infinity : 0,
    hasSword: ENEMY_TYPES[type].canSword,
    collectPowerUp() { /* Gegner ignorieren Power-Ups vorerst */ },
  }));
}
let enemies = spawnEnemies(1);

const ENEMY_SPEED = 90;

// entspricht hasSupportAhead() aus entities.js: prueft, ob ein Stueck
// voraus (in Blickrichtung) noch eine Plattform ist.
function hasSupportAhead(en, lookAhead) {
  const aheadX = en.x + en.facing * lookAhead;
  return level.platforms.some((p) => aheadX > p.x - 4 && aheadX < p.x + p.w + 4 && Math.abs(p.y - en.y) < 6);
}

function findEnemyLanding(en, nextY) {
  let best = null;
  level.platforms.forEach((p) => {
    if (en.x > p.x && en.x < p.x + p.w && en.y <= p.y + 2 && nextY >= p.y) {
      if (!best || p.y < best.y) best = { y: p.y };
    }
  });
  return best;
}

// entspricht der Bewegungslogik in Enemy.update(): Patrouille mit
// Kantenerkennung und gelegentlichem Sprung.
// entspricht dem Entscheidungsbaum in Enemy.update(): Nahkampf zuerst
// pruefen (kuerzeste Reichweite), dann Fernkampf, dann Schwert.
function updateEnemyCombat(en, dt) {
  en.attackCooldown -= dt;
  if (en.attackTimer > 0) { en.attackTimer -= dt; return; }
  if (en.attackCooldown > 0) return;

  const dist = Math.hypot(hero.x - en.x, hero.y - en.y);
  if (dist < 260) en.facing = hero.x > en.x ? 1 : -1;

  if (dist < 40) {
    const useKick = Math.random() < 0.5;
    en.state = useKick ? "Kick" : "Hit";
    en.animTime = 0;
    en.attackTimer = 0.3;
    en.attackCooldown = 1.4 + Math.random();
    heroTakeDamage(useKick ? DAMAGE.Kick : DAMAGE.Hit);
  } else if (dist < 260 && en.hasShuriken && en.shurikenCount > 0 && Math.random() < 0.5) {
    en.state = "Throw"; en.animTime = 0;
    en.attackTimer = 0.3; en.attackCooldown = 2 + Math.random() * 1.5;
    projectiles.push(new Projectile(en.x + en.facing * 18, en.y - 30, en.facing, en));
  } else if (dist < 60 && en.hasSword) {
    en.state = "SwordHit"; en.animTime = 0;
    en.attackTimer = 0.3; en.attackCooldown = 1.6 + Math.random();
    heroTakeDamage(DAMAGE.Sword);
  }
}

function updateEnemy(en, dt) {
  if (en.dead) return;
  en.animTime += dt;
  en.jumpCooldown -= dt;

  updateEnemyCombat(en, dt);

  if (en.attackTimer <= 0) {
    const supported = hasSupportAhead(en, 26);
    if (!supported) {
      en.facing *= -1;
    } else {
      en.x += en.facing * ENEMY_SPEED * dt;
    }
    if (!["Hit", "Kick", "SwordHit", "Throw"].includes(en.state)) en.state = "Walk";

    if (en.x <= en.patrolLeft) { en.x = en.patrolLeft; en.facing = 1; }
    else if (en.x >= en.patrolRight) { en.x = en.patrolRight; en.facing = -1; }
    else if (supported && en.onGround && en.jumpCooldown <= 0 && Math.random() < 0.01) {
      en.vy = -520; en.onGround = false; en.jumpCooldown = 2 + Math.random() * 2;
    }
  }

  en.vy += GRAVITY * dt;
  const nextY = en.y + en.vy * dt;
  const landing = en.vy >= 0 ? findEnemyLanding(en, nextY) : null;
  if (landing) { en.y = landing.y; en.vy = 0; en.onGround = true; }
  else { en.y = nextY; en.onGround = false; }
}

function setState(state) {
  if (hero.state === state) return;
  const busy = ["Hit", "Kick", "SwordHit", "Throw"].includes(hero.state) && hero.attackTimer > 0;
  if (busy) return;
  hero.state = state;
  hero.animTime = 0;
}

function startAttack(type) {
  if (hero.attackTimer > 0) return;
  if (type === "SwordHit") sound.playSword();
  hero.state = type;
  hero.animTime = 0;
  hero.attackTimer = ATTACKS[type].duration;
  hero.attackHitDone = false;
}

// entspricht der Projectile-Klasse in entities.js: eigene Position,
// eigene Geschwindigkeit, eigenes update() - unabhaengig vom Werfer.
// entspricht der PowerUp-Klasse in entities.js: faellt mit derselben
// Schwerkraft wie eine Figur, landet auf einer Plattform - nur ohne
// eigene Steuerung.
class PowerUp {
  constructor(type, x, y) {
    this.type = type; this.x = x; this.y = y;
    this.vy = 0; this.landed = false; this.collected = false;
  }
  update(dt, candidates) {
    if (this.collected) return;
    if (!this.landed) {
      this.vy += GRAVITY * dt;
      const nextY = this.y + this.vy * dt;
      let landingY = null;
      level.platforms.forEach((p) => {
        if (this.x > p.x && this.x < p.x + p.w && this.y <= p.y + 2 && nextY >= p.y) {
          if (landingY == null || p.y < landingY) landingY = p.y;
        }
      });
      if (landingY != null) { this.y = landingY; this.vy = 0; this.landed = true; }
      else this.y = nextY;
    }
    // JEDER Kandidat wird geprueft - dadurch kann auch ein Gegner das
    // Item vor der Nase des Helden wegschnappen.
    for (const c of candidates) {
      if (!c.dead && Math.hypot(c.x - this.x, c.y - 30 - this.y) < 30) {
        this.collected = true;
        if (c.collectPowerUp) c.collectPowerUp(this.type);
        break;
      }
    }
  }
  draw() {
    if (this.collected) return;
    const def = TILE_SHEET.tiles[this.type];
    const sx = (TILE_SHEET.cellW - def.w) / 2, sy = def.row * TILE_SHEET.cellH + (TILE_SHEET.cellH - def.h) / 2;
    ctx.drawImage(tileSheet, sx, sy, def.w, def.h, this.x - def.w / 2, this.y - def.h, def.w, def.h);
  }
}
let powerUps = [];

// entspricht setupPowerUpSchedule() in gamemanager.js. Vereinfachung:
// wir haben in diesem Buch noch kein Level-Zeitlimit (kommt in
// Kapitel 18), daher verwenden wir hier einen festen Zeitabstand statt
// timeLeft/(count+1).
let powerUpQueue = [];
let powerUpCountdown = 0;
const POWERUP_TIME_STEP = 9;

function setupPowerUpSchedule() {
  const count = 3 + Math.floor(Math.random() * 8); // 3..10, wie im Original
  powerUpQueue = [];
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    const type = r < 0.7 ? "Heart" : r < 0.9 ? "Shuriken" : "Sword";
    powerUpQueue.push(type);
  }
  powerUpCountdown = 0;
}
setupPowerUpSchedule();

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
      const box = rectOf(t.x - 13, t.y - 58, 26, 58);
      if (this.x > box.left && this.x < box.right && this.y > box.top && this.y < box.bottom) {
        if (t === hero) {
          heroTakeDamage(DAMAGE.Shuriken);
        } else {
          t.hp = Math.max(0, t.hp - DAMAGE.Shuriken);
          if (t.hp === 0) t.dead = true;
        }
        this.dead = true;
        break;
      }
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.spin);
    const def = TILE_SHEET.tiles.Shuriken;
    ctx.drawImage(tileSheet, (TILE_SHEET.cellW - def.w) / 2, def.row * TILE_SHEET.cellH + (TILE_SHEET.cellH - def.h) / 2, def.w, def.h, -def.w / 2, -def.h / 2, def.w, def.h);
    ctx.restore();
  }
}
let projectiles = [];

// entspricht useShuriken() in Hero.as/entities.js
function throwShuriken() {
  if (hero.attackTimer > 0) return;
  if (!hero.hasShuriken || hero.shurikenCount <= 0) return;
  hero.shurikenCount--;
  if (hero.shurikenCount <= 0) hero.hasShuriken = false;
  hero.state = "Throw";
  hero.animTime = 0;
  hero.attackTimer = 0.35;
  const spawnX = hero.x + hero.facing * 18;
  projectiles.push(new Projectile(spawnX, hero.y - 30, hero.facing, hero));
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
    case "KeyL": if (hero.hasSword) startAttack("SwordHit"); break;
    case "KeyU": throwShuriken(); break;
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

function drawCharacter(sheet, x, y, facing, state, animTime) {
  // entspricht drawNinja(): "Climb" hat keine eigene Animation, nutzt
  // optisch dieselbe Zeile wie "Jump"
  const spriteState = state === "Climb" ? "Jump" : state;
  const def = CHARACTER_STATES[spriteState];
  const rawFrame = Math.floor(animTime * FPS);
  const frame = def.loop ? rawFrame % def.count : Math.min(rawFrame, def.count - 1);
  const sx = frame * CELL_W;
  const sy = def.row * CELL_H;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.drawImage(
    sheet, sx, sy, CELL_W, CELL_H,
    -ANCHOR_X * SPRITE_SCALE, -ANCHOR_Y * SPRITE_SCALE, DRAW_W, DRAW_H
  );
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
  hero.x = Math.max(0, Math.min(STAGE_W, hero.x));
}

function findLanding(nextY) {
  let best = null;
  level.platforms.forEach((p) => {
    if (hero.x > p.x && hero.x < p.x + p.w && hero.y <= p.y + 2 && nextY >= p.y) {
      if (!best || p.y < best.y) best = { y: p.y };
    }
  });
  return best;
}

// entspricht checkHazards() in Hero.as/entities.js: prueft, ob der Held
// gerade in einer Gefahrenzone steht, mit Abklingzeit gegen
// Mehrfachschaden im selben Frame-Rhythmus.
// entspricht overlaps()/rectOf() in render.js
function rectOf(x, y, w, h) { return { left: x, right: x + w, top: y, bottom: y + h }; }
function overlaps(a, b) { return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; }

// gemeinsame Schadensfunktion fuer den Helden - nutzt denselben
// invulnTimer-Mechanismus wie checkHazards()
function heroTakeDamage(dmg) {
  if (hero.invulnTimer > 0) return;
  hero.lifeEnergy = Math.max(0, hero.lifeEnergy - dmg);
  hero.invulnTimer = 0.6;
}

function checkHazards(dt) {
  if (hero.invulnTimer <= 0) {
    level.hazards.forEach((hz) => {
      const def = HAZARD_TYPES[hz.type];
      const footX = hero.x, footY = hero.y;
      let hit;
      if (hz.type === "Flame") {
        // hz.y ist die Basis (Bodenkontakt) - die Flamme waechst nach oben
        hit = footX > hz.x - 2 && footX < hz.x + hz.w && footY > hz.y - hz.h && footY <= hz.y + 4;
      } else {
        hit = footX > hz.x && footX < hz.x + hz.w && footY > hz.y && footY < hz.y + hz.h + 6;
      }
      if (hit) {
        hero.lifeEnergy = Math.max(0, hero.lifeEnergy - def.damage);
        hero.invulnTimer = def.cooldown;
      }
    });
  }
  if (hero.invulnTimer > 0) hero.invulnTimer -= dt;
}

// entspricht hitNearbyEnemies() in Hero.update(): waehrend eines
// laufenden Angriffs EINMAL pruefen, ob die Hitbox einen Gegner trifft.
function checkMeleeHit() {
  if (hero.attackTimer <= 0 || hero.attackHitDone) return;
  if (!["Hit", "Kick", "SwordHit"].includes(hero.state)) return;

  const def = ATTACKS[hero.state];
  const hitBox = rectOf(
    hero.x + (hero.facing > 0 ? 0 : -def.range),
    hero.y - 40, def.range, 30
  );
  for (const en of enemies) {
    if (en.dead) continue;
    const enemyBox = rectOf(en.x - 13, en.y - 58, 26, 58);
    if (overlaps(hitBox, enemyBox)) {
      en.hp = Math.max(0, en.hp - def.damage);
      if (en.hp === 0) en.dead = true;
      hero.attackHitDone = true;
      break;
    }
  }
}

let lastTime = 0;
let gameTime = 0;

function update(dt) {
  gameTime += dt;
  hero.animTime += dt;

  if (hero.attackTimer > 0) {
    hero.attackTimer -= dt;
    checkMeleeHit();
    if (hero.attackTimer <= 0) setState(keys.left || keys.right ? "Walk" : "Idle");
  }

  enemies.forEach((en) => updateEnemy(en, dt));

  projectiles.forEach((p) => p.update(dt, [hero, ...enemies]));
  projectiles = projectiles.filter((p) => !p.dead);

  // entspricht dem Power-Up-Teil von GameManager.update()
  powerUpCountdown += dt;
  if (powerUpQueue.length > 0 && powerUpCountdown >= POWERUP_TIME_STEP) {
    powerUpCountdown = 0;
    const type = powerUpQueue.shift();
    const x = 120 + Math.random() * (STAGE_W - 240);
    powerUps.push(new PowerUp(type, x, -20));
  }
  const candidates = [hero, ...enemies];
  powerUps.forEach((p) => p.update(dt, candidates));
  powerUps = powerUps.filter((p) => !p.collected);

  // Leiter-Erkennung: in der Zone UND nicht gleichzeitig links/rechts
  // gedrueckt -> Klettermodus. Jeden Frame neu berechnet, kein
  // Gedaechtnis ueber mehrere Frames noetig. Verlassen wird die Leiter
  // durch seitliche Bewegung, dann greift sofort wieder die normale
  // Physik.
  const ladderZone = level.ladders.find(
    (l) => hero.x > l.left - 4 && hero.x < l.right + 4 && hero.y > l.top - 6 && hero.y < l.bottom + 6
  );
  hero.onLadder = !!ladderZone && !keys.left && !keys.right;

  if (hero.onLadder) {
    hero.vy = 0;
    if (keys.up) hero.y -= CLIMB_SPEED * dt;
    else if (keys.down) hero.y += CLIMB_SPEED * dt;
    hero.y = Math.max(ladderZone.top, Math.min(ladderZone.bottom, hero.y));
    setState("Climb");
  } else {
    moveHorizontal(dt);
  }

  if (!hero.onLadder) {
    if (keys.jump && hero.onGround) {
      hero.vy = -JUMP_SPEED;
      hero.onGround = false;
      setState("Jump");
    }
    hero.vy += GRAVITY * dt;

    const nextY = hero.y + hero.vy * dt;
    const landing = hero.vy >= 0 ? findLanding(nextY) : null;

    if (landing) {
      hero.y = landing.y;
      hero.vy = 0;
      hero.onGround = true;
      if (hero.state === "Jump") setState(keys.left || keys.right ? "Walk" : "Idle");
    } else {
      hero.y = nextY;
      hero.onGround = false;
      if (hero.y > STAGE_H + 60) {
        // aus dem Level gefallen - zurueck an den Start (kein "Sterben" bislang)
        hero.x = 60; hero.y = 414.1; hero.vy = 0;
      }
    }
  } else {
    hero.onGround = false;
  }

  checkHazards(dt);
}

function render() {
  ctx.fillStyle = "#bfe8ea";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);

  if (!tileSheet.complete || tileSheet.naturalWidth === 0) return;
  if (!heroSheet.complete || heroSheet.naturalWidth === 0) return;

  level.platforms.forEach((p) => drawTile(p.type, p.x, p.y));
  level.ladders.forEach((l) => {
    for (let y = l.top; y < l.bottom; y += LADDER_TILE_H) drawTile("Ladder", l.left, y);
  });
  level.hazards.forEach((hz) => {
    const frame = hz.type === "Flame" ? Math.floor(gameTime * 10 + hz.x) : 0;
    const y = hz.type === "Flame" ? hz.y - hz.h : hz.y;
    drawTile(hz.type, hz.x, y, frame);
  });

  enemies.forEach((en) => {
    if (en.dead) return;
    const sheet = ENEMY_SHEETS[en.type];
    if (!sheet.complete || sheet.naturalWidth === 0) return;
    drawCharacter(sheet, en.x, en.y, en.facing, en.state, en.animTime);
  });

  powerUps.forEach((p) => p.draw());
  projectiles.forEach((p) => p.draw());

  const flashing = hero.invulnTimer > 0 && Math.floor(hero.invulnTimer * 10) % 2 === 0;
  if (!flashing) {
    drawCharacter(heroSheet, hero.x, hero.y, hero.facing, hero.state, hero.animTime);
  }

  ctx.fillStyle = "#2e4057";
  ctx.font = "16px monospace";
  ctx.fillText(`Level ${currentLevelNum}   Leben: ${hero.lifeEnergy}/${hero.maxLifeEnergy}   Shuriken: ${hero.shurikenCount}   (J Schlag, K Tritt, L Schwert, U Shuriken)`, 16, 28);

  const hpList = document.getElementById("enemy-hp-list");
  hpList.textContent = "";
  enemies.forEach((en, i) => {
    const span = document.createElement("span");
    span.textContent = en.dead ? `Gegner ${i + 1}: besiegt` : `Gegner ${i + 1} (${en.type}): ${en.hp}/${en.maxHp} HP`;
    hpList.appendChild(span);
  });
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
