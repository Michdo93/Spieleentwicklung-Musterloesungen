/**
 * Kapitel 11 - Fernkampf & Projektile
 * Musterloesung
 *
 * Drei Beispiele: (1) nur die Wurfanimation - der Original-Bug aus
 * Ninja Fight (KnownBugs #1: kein Shuriken existierte als eigenes
 * Objekt), (2) ein echtes Projectile-Objekt, (3) Kollision mit
 * Werferausschluss.
 */

const heroSheet = new Image(); heroSheet.src = "assets/hero.png";
const enemySheet = new Image(); enemySheet.src = "assets/green.png";
const tileSheet = new Image(); tileSheet.src = "assets/tiles.png";
const CELL_W = 160, CELL_H = 150;
const ANCHOR_X = 30, ANCHOR_Y = 145, SPRITE_SCALE = 0.45;
const DRAW_W = CELL_W * SPRITE_SCALE, DRAW_H = CELL_H * SPRITE_SCALE;

function whenReady(fn) {
  const imgs = [heroSheet, enemySheet, tileSheet];
  const ready = () => imgs.every((i) => i.complete && i.naturalWidth > 0);
  if (ready()) fn();
  else imgs.forEach((i) => i.addEventListener("load", () => ready() && fn()));
}
function drawChar(ctx, sheet, row, x, y, facing = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.drawImage(sheet, 0, row * CELL_H, CELL_W, CELL_H, -ANCHOR_X * SPRITE_SCALE, -ANCHOR_Y * SPRITE_SCALE, DRAW_W, DRAW_H);
  ctx.restore();
}
function drawShuriken(ctx, x, y, spin) {
  const sx = (42 - 21) / 2, sy = 7 * 66 + (66 - 21) / 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(spin);
  // helle Kreisflaeche als Kontrast hinter dem dunklen Original-Sprite
  ctx.fillStyle = "rgba(230,236,240,0.9)";
  ctx.beginPath();
  ctx.arc(0, 0, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.drawImage(tileSheet, sx, sy, 21, 21, -10, -10, 21, 21);
  ctx.restore();
}

/* ===================================================================
   Beispiel 1: nur die Animation - der Original-Bug aus Ninja Fight.
   doAction("Throw") spielt die Wurfbewegung ab, aber es entsteht
   nirgends ein Objekt, das sich bewegt. Nichts fliegt.
   =================================================================== */
(function example1_animationOnly() {
  const canvas = document.getElementById("stage1");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  let throwing = false, t = 0;

  document.getElementById("btn-throw1").addEventListener("click", () => {
    throwing = true;
    t = 0;
  });

  let lastTime = 0;
  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    if (throwing) { t += dt; if (t > 0.5) throwing = false; }

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    whenReady(() => {
      drawChar(ctx, heroSheet, throwing ? 5 : 0, W / 2 - 60, 150, 1);
      drawChar(ctx, enemySheet, 0, W / 2 + 90, 150, -1);
    });
    ctx.fillStyle = "#93a4b3";
    ctx.font = "12px monospace";
    ctx.fillText("Wo ist das Shuriken? Es existiert nirgends im Code.", 20, 30);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* ===================================================================
   Beispiel 2: ein echtes Projektil-Objekt - entspricht der
   Projectile-Klasse in entities.js.
   =================================================================== */
class Projectile {
  constructor(x, y, dir) {
    this.x = x; this.y = y; this.dir = dir;
    this.speed = 480; this.spin = 0; this.dead = false;
  }
  update(dt, W) {
    this.x += this.dir * this.speed * dt;
    this.spin += dt * 20;
    if (this.x < -20 || this.x > W + 20) this.dead = true;
  }
}

(function example2_projectile() {
  const canvas = document.getElementById("stage2");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  let projectiles = [];
  let throwing = false, throwT = 0;

  document.getElementById("btn-throw2").addEventListener("click", () => {
    projectiles.push(new Projectile(W / 2 - 40, 130, 1));
    throwing = true;
    throwT = 0;
  });

  let lastTime = 0;
  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    if (throwing) { throwT += dt; if (throwT > 0.5) throwing = false; }

    projectiles.forEach((p) => p.update(dt, W));
    projectiles = projectiles.filter((p) => !p.dead);

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    whenReady(() => drawChar(ctx, heroSheet, throwing ? 5 : 0, W / 2 - 60, 150, 1));
    projectiles.forEach((p) => drawShuriken(ctx, p.x, p.y, p.spin));
    ctx.fillStyle = "#93a4b3";
    ctx.font = "12px monospace";
    ctx.fillText(`aktive Projektile: ${projectiles.length}`, 20, 30);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* ===================================================================
   Beispiel 3: Kollision + Werfer ausschliessen - entspricht
   Projectile.update() in Ninja Fight.
   =================================================================== */
(function example3_collision() {
  const canvas = document.getElementById("stage3");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  const enemy = { x: W / 2 + 90, y: 150, hp: 100 };
  let projectiles = [];
  let throwing = false, throwT = 0;

  document.getElementById("btn-throw3").addEventListener("click", () => {
    projectiles.push(new Projectile(W / 2 - 40, 130, 1));
    throwing = true;
    throwT = 0;
  });
  document.getElementById("reset-btn3").addEventListener("click", () => (enemy.hp = 100));

  function hurtboxAt() {
    return { x: enemy.x, y: enemy.y - 30, r: 20 };
  }

  let lastTime = 0;
  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    if (throwing) { throwT += dt; if (throwT > 0.5) throwing = false; }

    const hb = hurtboxAt();
    projectiles.forEach((p) => {
      p.update(dt, W);
      if (!p.dead && enemy.hp > 0 && Math.hypot(hb.x - p.x, hb.y - p.y) < hb.r) {
        enemy.hp -= 1;
        p.dead = true;
      }
    });
    projectiles = projectiles.filter((p) => !p.dead);

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    whenReady(() => {
      drawChar(ctx, heroSheet, throwing ? 5 : 0, W / 2 - 60, 150, 1);
      if (enemy.hp > 0) drawChar(ctx, enemySheet, 0, enemy.x, enemy.y, -1);
    });
    if (enemy.hp > 0) {
      ctx.strokeStyle = "#5fb0ff";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(hb.x, hb.y, hb.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    projectiles.forEach((p) => drawShuriken(ctx, p.x, p.y, p.spin));
    ctx.fillStyle = "#93a4b3";
    ctx.font = "12px monospace";
    ctx.fillText(`Gegner-HP: ${enemy.hp}/100`, 20, 30);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
