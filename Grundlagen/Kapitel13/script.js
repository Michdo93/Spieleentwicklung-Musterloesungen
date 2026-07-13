/**
 * Kapitel 13 - Gegner-KI: Bewegung
 * Musterloesung
 *
 * Drei Beispiele: (1) naive Patrouille (faellt von der Plattform),
 * (2) mit Kantenerkennung (hasSupportAhead), (3) plus gelegentliches
 * Springen. Das Original-Ninja-Fight hatte fuer Gegner ueberhaupt
 * keine KI - diese Patrouillenlogik war eine Nacharbeit, die erst
 * beim tatsaechlichen Testen noetig wurde (Gegner fielen zu oft von
 * Plattformen).
 */

const enemySheet = new Image();
enemySheet.src = "assets/blue.png";
const ANCHOR_X = 30, ANCHOR_Y = 145, SPRITE_SCALE = 0.45;
function whenReady(fn) {
  if (enemySheet.complete && enemySheet.naturalWidth > 0) fn();
  else enemySheet.addEventListener("load", fn, { once: true });
}
function drawEnemy(ctx, x, y, facing) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.drawImage(enemySheet, 0, 150, 160, 150, -ANCHOR_X * SPRITE_SCALE, -ANCHOR_Y * SPRITE_SCALE, 160 * SPRITE_SCALE, 150 * SPRITE_SCALE);
  ctx.restore();
}
const GRAVITY = 1400, ENEMY_SPEED = 90;

/* ===================================================================
   Beispiel 1: naive Patrouille - laeuft blind zwischen zwei X-Werten
   hin und her, ohne zu pruefen, ob unter ihr noch Boden ist.
   =================================================================== */
(function example1_naive() {
  const canvas = document.getElementById("stage1");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const platform = { x: 60, y: 180, w: 140 }; // kuerzer als der Patrouillenbereich!
  let x = 90, y = platform.y, vy = 0, facing = 1, onGround = true;
  const patrolLeft = 60, patrolRight = 260; // reicht ueber die Plattform hinaus

  let lastTime = 0;
  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    x += facing * ENEMY_SPEED * dt;
    if (x <= patrolLeft) { x = patrolLeft; facing = 1; }
    if (x >= patrolRight) { x = patrolRight; facing = -1; }

    vy += GRAVITY * dt;
    const nextY = y + vy * dt;
    if (x > platform.x && x < platform.x + platform.w && y <= platform.y + 2 && nextY >= platform.y) {
      y = platform.y; vy = 0; onGround = true;
    } else {
      y = nextY; onGround = false;
      if (y > H + 60) { x = 90; y = platform.y; vy = 0; onGround = true; }
    }

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#663300";
    ctx.fillRect(platform.x, platform.y, platform.w, 8);
    whenReady(() => drawEnemy(ctx, x, y, facing));
    ctx.fillStyle = "#93a4b3";
    ctx.font = "12px monospace";
    ctx.fillText(`onGround = ${onGround}`, 14, 24);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* ===================================================================
   Beispiel 2: mit Kantenerkennung - entspricht hasSupportAhead().
   =================================================================== */
(function example2_edge() {
  const canvas = document.getElementById("stage2");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const platform = { x: 60, y: 180, w: 140 };
  let x = 90, y = platform.y, vy = 0, facing = 1, onGround = true;

  function hasSupportAhead(lookAhead) {
    const aheadX = x + facing * lookAhead;
    return aheadX > platform.x - 4 && aheadX < platform.x + platform.w + 4;
  }

  let lastTime = 0;
  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (!hasSupportAhead(26)) facing *= -1; // Kante erkannt -> umdrehen
    else x += facing * ENEMY_SPEED * dt;

    vy += GRAVITY * dt;
    const nextY = y + vy * dt;
    if (x > platform.x && x < platform.x + platform.w && y <= platform.y + 2 && nextY >= platform.y) {
      y = platform.y; vy = 0; onGround = true;
    } else {
      y = nextY; onGround = false;
    }

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#663300";
    ctx.fillRect(platform.x, platform.y, platform.w, 8);
    whenReady(() => drawEnemy(ctx, x, y, facing));
    ctx.fillStyle = "#93a4b3";
    ctx.font = "12px monospace";
    ctx.fillText(`onGround = ${onGround}  (bleibt immer true)`, 14, 24);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* ===================================================================
   Beispiel 3: gelegentliches Springen - fuer ein lebendigeres
   Verhalten, ohne die Kantenerkennung zu verlieren.
   =================================================================== */
(function example3_jump() {
  const canvas = document.getElementById("stage3");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const platform = { x: 30, y: 180, w: 260 };
  let x = 90, y = platform.y, vy = 0, facing = 1, onGround = true, jumpCooldown = 1;

  function hasSupportAhead(lookAhead) {
    const aheadX = x + facing * lookAhead;
    return aheadX > platform.x - 4 && aheadX < platform.x + platform.w + 4;
  }

  let lastTime = 0;
  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    jumpCooldown -= dt;

    const supported = hasSupportAhead(26);
    if (!supported) facing *= -1;
    else x += facing * ENEMY_SPEED * dt;

    if (supported && onGround && jumpCooldown <= 0 && Math.random() < 0.01) {
      vy = -420; onGround = false; jumpCooldown = 1.5 + Math.random() * 2;
    }

    vy += GRAVITY * dt;
    const nextY = y + vy * dt;
    if (x > platform.x && x < platform.x + platform.w && y <= platform.y + 2 && nextY >= platform.y) {
      y = platform.y; vy = 0; onGround = true;
    } else {
      y = nextY; onGround = false;
    }

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#663300";
    ctx.fillRect(platform.x, platform.y, platform.w, 8);
    whenReady(() => drawEnemy(ctx, x, y, facing));
    ctx.fillStyle = "#93a4b3";
    ctx.font = "12px monospace";
    ctx.fillText(`onGround = ${onGround}`, 14, 24);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
