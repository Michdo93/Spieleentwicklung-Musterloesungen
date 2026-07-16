/**
 * Ninja Fight - Kapitel 9: Leitern & Klettern
 * Musterlösung
 *
 * Baut auf Kapitel 6 auf. Statt weniger Testplattformen bauen wir jetzt
 * die ersten beiden ECHTEN Level aus Ninja Fight nach - Koordinaten 1:1
 * aus levels.js übernommen. buildLevel() sortiert die Rohdaten nach
 * Bedeutung; in diesem Kapitel interessieren uns nur Plattformen und
 * Leitern (rein optisch) - Feuer, Messer und Wasser-Kacheln ignorieren
 * wir bewusst noch (kommt in Kapitel 8/9 dazu), man kann also überall
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
// tatsächliche Größe (nicht alle Kacheln sind gleich groß!)
const TILE_SHEET = {
  cellW: 42, cellH: 66,
  tiles: {
    Floor: { row: 0, w: 41, h: 21 },
    WaterGround: { row: 1, w: 40, h: 18 },
    Bridge: { row: 2, w: 36, h: 13 },
    Ladder: { row: 3, w: 25, h: 24 },
    Knives: { row: 4, w: 18, h: 16 },
    Small: { row: 5, w: 41, h: 24 },
    Flame: { row: 9, w: 16, h: 26, count: 8 },
  },
};

const GRAVITY = 1400;
const JUMP_SPEED = 620;
const WALK_SPEED = 160;
// Sicherheitsabstand zum Bühnenrand, GEMESSEN an den tatsächlich
// sichtbaren Pixeln des Sprites (nicht an der vollen, größtenteils
// transparenten 160x150-Zelle!) - siehe Buch, Kapitel 5, für die
// genaue Messung. Ohne diesen Puffer würde die Figur am äußersten
// Rand knapp über den Bildschirmrand hinausragen.
const EDGE_MARGIN = 20;
// Toleranz um den Fußpunkt beim Landetest, GEMESSEN an der
// sichtbaren Breite des Sprites (siehe Buch, Kapitel 6) - solange ein
// sichtbarer Teil der Figur noch über der Plattform ist, gilt sie als
// getragen. Mit einem einzelnen exakten Punkt (ohne Toleranz) fühlt
// sich das Herunterfallen an Kanten spürbar zu früh an, weil man
// optisch noch auf der Plattform zu stehen scheint.
const FOOT_MARGIN = 16;
const CLIMB_SPEED = 110;

// Original-Level-Layouts, 1:1 aus levels.js übernommen. "Bottom" und
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
// Hero.as/entities.js (dort fast wortgleich auch für Enemy).
const HAZARD_TYPES = {
  Flame: { damage: 1, cooldown: 0.6 },
  Knives: { damage: 5, cooldown: 0.6 },
};

// entspricht buildLevel() in render.js: sortiert die flache Rohdatenliste
// einmal nach Bedeutung. Ladder wird hier nur fürs Zeichnen erfasst -
// die eigentliche Kletterlogik kommt erst in Kapitel 9 dazu.
const LADDER_W = 25;
const LADDER_TILE_H = 24;

// entspricht mergeLadderColumns() in render.js: fasst einzelne
// Leiter-Kacheln in derselben Spalte zu EINER zusammenhängenden
// Kletterzone zusammen. "bottom" reicht genau eine Kachelhöhe über
// die letzte Sprosse hinaus - siehe Buch für die echte Bugfix-Story
// dazu (vorher wurde hier fälschlich eine Kachelhöhe zu viel
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
      // Flame.y ist die BASIS der Flamme (Bodenhöhe) - die Flamme
      // wächst nach OBEN, nicht umgekehrt (siehe Buch: häufiger
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
});
document.getElementById("btn-level2").addEventListener("click", () => {
  currentLevelNum = 2;
  level = buildLevel(2);
});

const CHARACTER_STATES = {
  Idle: { row: 0, count: 8, loop: true },
  Walk: { row: 1, count: 8, loop: true },
  Jump: { row: 2, count: 8, loop: false },
};
const FPS = 8;

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
    heroSheet, sx, sy, CELL_W, CELL_H,
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
  hero.x = Math.max(EDGE_MARGIN, Math.min(STAGE_W - EDGE_MARGIN, hero.x));
}

function findLanding(nextY) {
  let best = null;
  level.platforms.forEach((p) => {
    if (hero.x + FOOT_MARGIN > p.x && hero.x - FOOT_MARGIN < p.x + p.w && hero.y <= p.y + 2 && nextY >= p.y) {
      if (!best || p.y < best.y) best = { y: p.y };
    }
  });
  return best;
}

// entspricht checkHazards() in Hero.as/entities.js: prüft, ob der Held
// gerade in einer Gefahrenzone steht, mit Abklingzeit gegen
// Mehrfachschaden im selben Frame-Rhythmus.
function checkHazards(dt) {
  if (hero.invulnTimer <= 0) {
    level.hazards.forEach((hz) => {
      const def = HAZARD_TYPES[hz.type];
      const footX = hero.x, footY = hero.y;
      let hit;
      if (hz.type === "Flame") {
        // hz.y ist die Basis (Bodenkontakt) - die Flamme wächst nach oben
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

let lastTime = 0;
let gameTime = 0;

function update(dt) {
  gameTime += dt;
  hero.animTime += dt;

  // Leiter-Erkennung: in der Zone UND nicht gleichzeitig links/rechts
  // gedrückt -> Klettermodus. Jeden Frame neu berechnet, kein
  // Gedächtnis über mehrere Frames nötig. Verlassen wird die Leiter
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
        // aus dem Level gefallen - zurück an den Start (kein "Sterben" bislang)
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

  const flashing = hero.invulnTimer > 0 && Math.floor(hero.invulnTimer * 10) % 2 === 0;
  if (!flashing) {
    drawHero(hero.x, hero.y, hero.facing, hero.state, hero.animTime);
  }

  ctx.fillStyle = "#2e4057";
  ctx.font = "16px monospace";
  ctx.fillText(`Level ${currentLevelNum}   Leben: ${hero.lifeEnergy}/${hero.maxLifeEnergy}`, 16, 28);
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
