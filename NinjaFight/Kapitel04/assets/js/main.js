/**
 * Ninja Fight - Kapitel 4: Tastatur- & Maus-Eingabe
 * Musterloesung
 *
 * Baut auf Kapitel 3 auf. Neu: das keys-Objekt (entspricht
 * GameManager.keys in Ninja Fight) sowie ein einfacher Mausklick-
 * Trefftest auf den Helden. Der Held bewegt sich hier noch NICHT -
 * das kommt erst in Kapitel 5. Hier geht es nur darum, Eingaben
 * zuverlaessig zu erfassen.
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

const CHARACTER_STATES = {
  Idle: { row: 0, count: 8 },
};

const FPS = 8;

const hero = {
  x: STAGE_W / 2 - CELL_W / 2,
  y: STAGE_H / 2 - CELL_H / 2 - 40,
  facing: 1,
  state: "Idle",
  animTime: 0,
};

// entspricht GameManager.keys in Ninja Fight
const keys = { left: false, right: false, up: false, down: false };

function keyDown(e) {
  switch (e.code) {
    case "ArrowLeft": case "KeyA": keys.left = true; break;
    case "ArrowRight": case "KeyD": keys.right = true; break;
    case "ArrowUp": case "KeyW": keys.up = true; break;
    case "ArrowDown": case "KeyS": keys.down = true; break;
  }
}
function keyUp(e) {
  switch (e.code) {
    case "ArrowLeft": case "KeyA": keys.left = false; break;
    case "ArrowRight": case "KeyD": keys.right = false; break;
    case "ArrowUp": case "KeyW": keys.up = false; break;
    case "ArrowDown": case "KeyS": keys.down = false; break;
  }
}
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

// Mausklick auf den Helden erkennen: Koordinaten umrechnen, dann ein
// Rechteck-Trefftest gegen die aktuelle Position des Helden.
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const hit =
    mouseX >= hero.x && mouseX <= hero.x + CELL_W &&
    mouseY >= hero.y && mouseY <= hero.y + CELL_H;

  if (hit) {
    hero.facing *= -1; // Klick auf den Helden dreht ihn probeweise um
  }
});

function drawTile(name, x, y) {
  const def = TILE_SHEET.tiles[name];
  const sx = (TILE_SHEET.cellW - def.w) / 2;
  const sy = def.row * TILE_SHEET.cellH + (TILE_SHEET.cellH - def.h) / 2;
  ctx.drawImage(tileSheet, sx, sy, def.w, def.h, x, y, def.w, def.h);
}

function drawHero(x, y, facing, state, animTime) {
  const def = CHARACTER_STATES[state];
  const frame = Math.floor(animTime * FPS) % def.count;
  const sx = frame * CELL_W;
  const sy = def.row * CELL_H;

  ctx.save();
  ctx.translate(x + CELL_W / 2, y);
  ctx.scale(facing, 1);
  ctx.drawImage(heroSheet, sx, sy, CELL_W, CELL_H, -CELL_W / 2, 0, CELL_W, CELL_H);
  ctx.restore();
}

let lastTime = 0;

function update(dt) {
  hero.animTime += dt;
  // Bewegung selbst kommt erst in Kapitel 5 - hier lesen wir "keys"
  // noch nicht aus, sondern zeigen den Zustand nur zu Testzwecken an.
}

function render() {
  ctx.fillStyle = "#bfe8ea";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);

  if (!tileSheet.complete || tileSheet.naturalWidth === 0) return;
  if (!heroSheet.complete || heroSheet.naturalWidth === 0) return;

  const floorY = STAGE_H - 21;
  for (let x = 0; x < STAGE_W; x += 41) {
    drawTile("Floor", x, floorY);
  }

  drawHero(hero.x, hero.y, hero.facing, hero.state, hero.animTime);

  // Debug-Anzeige: welche Tasten sind gerade gedrueckt?
  const pressed = Object.entries(keys).filter(([, v]) => v).map(([k]) => k);
  ctx.fillStyle = "#2e4057";
  ctx.font = "16px monospace";
  ctx.fillText(
    "gedrueckt: " + (pressed.length ? pressed.join(", ") : "(keine)"),
    16, 28
  );
  ctx.fillText("Klick auf den Helden dreht ihn um", 16, 50);
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
