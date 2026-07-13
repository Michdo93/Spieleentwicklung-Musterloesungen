/**
 * Kapitel 12 - Items & Power-Ups
 * Musterloesung
 *
 * Drei Beispiele: (1) ein fallendes Item (dieselbe Schwerkraft wie
 * eine Figur), (2) drei Effekt-Muster (sofortig/befristet/zaehlbar),
 * (3) jeder kann es aufheben, nicht nur der Held.
 */

const tileSheet = new Image(); tileSheet.src = "assets/tiles.png";
const heroSheet = new Image(); heroSheet.src = "assets/hero.png";
const enemySheet = new Image(); enemySheet.src = "assets/blue.png";
const TILES = {
  Sword: { row: 6, w: 17, h: 65 },
  Shuriken: { row: 7, w: 21, h: 21 },
  Heart: { row: 8, w: 35, h: 30 },
};
const ANCHOR_X = 30, ANCHOR_Y = 145, SPRITE_SCALE = 0.45;

function whenReady(fn) {
  const imgs = [tileSheet, heroSheet, enemySheet];
  const ready = () => imgs.every((i) => i.complete && i.naturalWidth > 0);
  if (ready()) fn();
  else imgs.forEach((i) => i.addEventListener("load", () => ready() && fn()));
}
function drawItemTile(ctx, name, x, y) {
  const def = TILES[name];
  const sx = (42 - def.w) / 2, sy = def.row * 66 + (66 - def.h) / 2;
  ctx.drawImage(tileSheet, sx, sy, def.w, def.h, x, y, def.w, def.h);
}
function drawChar(ctx, sheet, x, y, facing = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.drawImage(sheet, 0, 0, 160, 150, -ANCHOR_X * SPRITE_SCALE, -ANCHOR_Y * SPRITE_SCALE, 160 * SPRITE_SCALE, 150 * SPRITE_SCALE);
  ctx.restore();
}

const GRAVITY = 1400;

/* ===================================================================
   Beispiel 1: ein fallendes Item - dieselbe Schwerkraft/Landung wie
   eine Figur (Kapitel 5/6), nur ohne Steuerung.
   =================================================================== */
class PowerUp {
  constructor(type, x, y) {
    this.type = type; this.x = x; this.y = y;
    this.vy = 0; this.landed = false; this.collected = false;
  }
  update(dt, platformY) {
    if (this.collected || this.landed) return;
    this.vy += GRAVITY * dt;
    const nextY = this.y + this.vy * dt;
    if (nextY >= platformY) { this.y = platformY; this.vy = 0; this.landed = true; }
    else this.y = nextY;
  }
}

(function example1_falling() {
  const canvas = document.getElementById("stage1");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const platformY = 160;
  let item = new PowerUp("Heart", W / 2, -30);

  document.getElementById("btn-drop").addEventListener("click", () => {
    item = new PowerUp("Heart", 60 + Math.random() * (W - 120), -30);
  });

  let lastTime = 0;
  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    item.update(dt, platformY);

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#663300";
    ctx.fillRect(0, platformY, W, 8);
    whenReady(() => drawItemTile(ctx, item.type, item.x - 17, item.y - 30));
    ctx.fillStyle = "#93a4b3";
    ctx.font = "12px monospace";
    ctx.fillText(item.landed ? "gelandet - wartet aufs Einsammeln" : "faellt ...", 14, 24);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* ===================================================================
   Beispiel 2: sofortig vs. befristet vs. zaehlbasiert - entspricht
   collectPowerUp() in entities.js.
   =================================================================== */
(function example2_effects() {
  const canvas = document.getElementById("stage2");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const statusEl = document.getElementById("status-display");

  let hp = 5, hasSword = false, swordTimer = 0, shurikenCount = 0;

  function collect(type) {
    if (type === "Heart") hp = Math.min(10, hp + 2); // sofort
    else if (type === "Sword") { hasSword = true; swordTimer = 30; } // befristet
    else if (type === "Shuriken") shurikenCount += 3; // zaehlbasiert
  }
  document.getElementById("btn-heart").addEventListener("click", () => collect("Heart"));
  document.getElementById("btn-sword").addEventListener("click", () => collect("Sword"));
  document.getElementById("btn-shuriken").addEventListener("click", () => collect("Shuriken"));
  document.getElementById("btn-throw").addEventListener("click", () => {
    if (shurikenCount > 0) shurikenCount--;
  });

  let lastTime = 0;
  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    if (hasSword && swordTimer > 0) {
      swordTimer -= dt;
      if (swordTimer <= 0) { hasSword = false; swordTimer = 0; }
    }
    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    statusEl.textContent = `HP: ${hp}/10   Schwert: ${hasSword ? swordTimer.toFixed(1) + "s uebrig" : "keins"}   Shuriken: ${shurikenCount}`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* ===================================================================
   Beispiel 3: jeder kann es aufheben - entspricht PowerUp.update():
   ALLE lebenden Figuren werden auf Kollision geprueft, nicht nur der
   Held.
   =================================================================== */
(function example3_anyone() {
  const canvas = document.getElementById("stage3");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  let item = { x: W / 2, y: 190, collected: false };
  let heroX = 60, enemyX = W - 60, enemyDir = -1;
  const keys = {};
  window.addEventListener("keydown", (e) => { keys[e.code] = true; e.preventDefault(); });
  window.addEventListener("keyup", (e) => (keys[e.code] = false));
  document.getElementById("reset-item-btn").addEventListener("click", () => {
    item = { x: W / 2, y: 190, collected: false };
  });

  let lastTime = 0;
  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (keys["ArrowLeft"]) heroX -= 120 * dt;
    if (keys["ArrowRight"]) heroX += 120 * dt;
    heroX = Math.max(20, Math.min(W - 20, heroX));

    enemyX += enemyDir * 60 * dt;
    if (enemyX < 20 || enemyX > W - 20) enemyDir *= -1;

    // jede lebende Figur wird geprueft - nicht nur der Held
    if (!item.collected) {
      [heroX, enemyX].forEach((x, i) => {
        if (Math.abs(x - item.x) < 24 && Math.abs(190 - item.y) < 24) {
          item.collected = true;
          item.collectedBy = i === 0 ? "Held" : "Gegner";
        }
      });
    }

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#663300";
    ctx.fillRect(0, 200, W, 8);
    whenReady(() => {
      drawChar(ctx, heroSheet, heroX, 200, 1);
      drawChar(ctx, enemySheet, enemyX, 200, -1);
      if (!item.collected) drawItemTile(ctx, "Heart", item.x - 17, item.y - 15);
    });
    ctx.fillStyle = "#93a4b3";
    ctx.font = "12px monospace";
    ctx.fillText(item.collected ? `Eingesammelt von: ${item.collectedBy}` : "noch nicht eingesammelt", 14, 24);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  canvas.addEventListener("click", () => canvas.focus());
})();
