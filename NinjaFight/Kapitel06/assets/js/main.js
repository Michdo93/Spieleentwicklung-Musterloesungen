/**
 * Ninja Fight - Kapitel 6: Kollision & Plattformen
 * Musterlösung
 *
 * Baut auf Kapitel 5 auf. Statt eines einzigen festen Bodens gibt es
 * jetzt mehrere Plattformen auf unterschiedlichen Höhen -
 * findLanding() sucht bei jedem Frame die passende darunter.
 *
 * Korrektur gegenüber der ersten Fassung dieses Kapitels: Weil
 * hero.x/hero.y seit Kapitel 2 der tatsächliche FUSSPUNKT der Figur
 * sind (nicht mehr die linke obere Sprite-Ecke), ist die Landeprüfung
 * jetzt genauso einfach wie im fertigen Spiel: Wir vergleichen einfach
 * hero.y direkt mit der Plattformhöhe, ganz ohne Umrechnung über
 * Sprite-Breiten/Höhen. Vorher führte genau diese Umrechnung dazu,
 * dass der Held über Plattformen schwebte oder an der falschen Stelle
 * durchfiel.
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

const FLOOR_Y = STAGE_H - 21;

// Jede Plattform: { x, y, w } - y ist die Oberkante, an der der
// Fußpunkt des Helden zum Stehen kommt.
// Breiten bewusst als Vielfache von 41 (Kachelbreite) gewählt: render()
// zeichnet Boden-Kacheln in 41px-Schritten (siehe unten). Wäre die
// Breite KEIN sauberes Vielfaches, würde die letzte gezeichnete
// Kachel über das Ende der Plattform hinausragen - man sähe dann
// Boden, auf dem man laut findLanding() bereits gar nicht mehr stehen
// dürfte (genau das ist beim Testen aufgefallen: die Figur "schwebte"
// sichtbar noch über einer Kachel, fiel dort aber schon herunter).
const platforms = [
  { x: 0, y: FLOOR_Y, w: 9 * 41 },
  { x: 640, y: FLOOR_Y, w: 9 * 41 },
  { x: 440, y: FLOOR_Y - 160, w: 4 * 41 },
  { x: 720, y: FLOOR_Y - 280, w: 4 * 41 },
];

const CHARACTER_STATES = {
  Idle: { row: 0, count: 8, loop: true },
  Walk: { row: 1, count: 8, loop: true },
  Jump: { row: 2, count: 8, loop: false },
};
const FPS = 8;

const hero = {
  x: 150,
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

// entspricht Hero.findLanding(): horizontal über der Plattform, UND
// eben noch drüber, UND jetzt (fast) drauf. hero.x/hero.y sind der
// Fußpunkt - deshalb reicht ein direkter Vergleich, ganz ohne
// Sprite-Maßumrechnung.
function findLanding(nextY) {
  let best = null;
  platforms.forEach((p) => {
    if (hero.x + FOOT_MARGIN > p.x && hero.x - FOOT_MARGIN < p.x + p.w && hero.y <= p.y + 2 && nextY >= p.y) {
      if (!best || p.y < best.y) best = { y: p.y };
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
    hero.y = landing.y;
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

  platforms.forEach((p) => {
    for (let x = p.x; x < p.x + p.w; x += 41) {
      drawTile("Floor", x, p.y);
    }
  });

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
