/**
 * Ninja Fight - Kapitel 4: Tastatur- & Maus-Eingabe
 * Musterlösung
 *
 * Baut auf Kapitel 3 auf. A/D oder die Pfeiltasten drehen den Helden
 * um und spielen die Lauf-Animation in die entsprechende Richtung ab,
 * solange die Taste gehalten wird. Die Leertaste löst die
 * Sprung-Animation aus. WICHTIG: Es gibt hier noch KEINERLEI Physik -
 * der Held bleibt die ganze Zeit an derselben Stelle stehen. Es geht
 * in diesem Kapitel nur um das Laden und Ansteuern der Animationen;
 * tatsächliche Bewegung kommt erst in Kapitel 5.
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

function setState(state) {
  if (hero.state === state) return;
  hero.state = state;
  hero.animTime = 0;
}

// entspricht GameManager.keys in Ninja Fight
const keys = { left: false, right: false, up: false, down: false, jump: false };

function keyDown(e) {
  switch (e.code) {
    case "ArrowLeft": case "KeyA": keys.left = true; break;
    case "ArrowRight": case "KeyD": keys.right = true; break;
    case "ArrowUp": case "KeyW": keys.up = true; break;
    case "ArrowDown": case "KeyS": keys.down = true; break;
    case "Space":
      if (!keys.jump) setState("Jump"); // einmalig auslösen, nicht bei jeder Tastenwiederholung neu
      keys.jump = true;
      e.preventDefault();
      break;
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

let lastTime = 0;

function update(dt) {
  hero.animTime += dt;

  // Springt der Held gerade, lassen wir die Animation ungestört zu
  // Ende laufen, bevor wir wieder auf Idle/Walk umschalten.
  if (hero.state === "Jump") {
    const def = CHARACTER_STATES.Jump;
    const finished = hero.animTime >= def.count / FPS;
    if (finished) {
      setState(keys.left || keys.right ? "Walk" : "Idle");
    }
    return;
  }

  // Laufrichtung umdrehen und Walk-Animation abspielen - OHNE die
  // Position tatsächlich zu verändern. Das kommt erst in Kapitel 5.
  if (keys.left) {
    hero.facing = -1;
    setState("Walk");
  } else if (keys.right) {
    hero.facing = 1;
    setState("Walk");
  } else {
    setState("Idle");
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

  ctx.fillStyle = "#2e4057";
  ctx.font = "16px monospace";
  ctx.fillText(`state = "${hero.state}"   facing = ${hero.facing}`, 16, 28);
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
