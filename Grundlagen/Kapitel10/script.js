/**
 * Kapitel 10 - Nahkampf & Hitboxen
 * Musterlösung
 *
 * Drei Beispiele: (1) Trefferzone vor der Figur, (2) attackHitDone
 * verhindert Mehrfachtreffer, (3) unterschiedlicher Schaden/Reichweite
 * je Angriffsart - exakt der Weg, den auch Hero.update() in Ninja
 * Fight geht.
 */

const heroSheet = new Image(); heroSheet.src = "assets/hero.png";
const enemySheet = new Image(); enemySheet.src = "assets/blue.png";
const CELL_W = 160, CELL_H = 150;

// dieselben Werte wie in Kapitel 2 (CHARACTER_SHEET.anchorX/anchorY + SPRITE_SCALE)
const ANCHOR_X = 30, ANCHOR_Y = 145, SPRITE_SCALE = 0.45;
const DRAW_W = CELL_W * SPRITE_SCALE, DRAW_H = CELL_H * SPRITE_SCALE;

function whenReady(fn) {
  const ready = () => heroSheet.complete && heroSheet.naturalWidth > 0 && enemySheet.complete && enemySheet.naturalWidth > 0;
  if (ready()) fn();
  else {
    heroSheet.addEventListener("load", () => ready() && fn());
    enemySheet.addEventListener("load", () => ready() && fn());
  }
}
function drawFrame(ctx, sheet, row, x, y, facing = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.drawImage(sheet, 0, row * CELL_H, CELL_W, CELL_H, -ANCHOR_X * SPRITE_SCALE, -ANCHOR_Y * SPRITE_SCALE, DRAW_W, DRAW_H);
  ctx.restore();
}
function overlaps(a, b) { return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; }
function rectOf(x, y, w, h) { return { left: x, right: x + w, top: y, bottom: y + h }; }

/* ===================================================================
   Beispiel 1: Trefferzone vor der Figur, abhängig von der Blickrichtung
   =================================================================== */
(function example1_hitbox() {
  const canvas = document.getElementById("stage1");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  let facing = 1;

  function draw() {
    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    whenReady(() => drawFrame(ctx, heroSheet, 0, W / 2, 150, facing));

    const range = 46;
    const hitBox = rectOf(W / 2 + (facing > 0 ? 0 : -range), 150 - 40, range, 30);
    ctx.strokeStyle = "#ff6b6b";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.strokeRect(hitBox.left, hitBox.top, range, 30);
    ctx.setLineDash([]);
    ctx.fillStyle = "#93a4b3";
    ctx.font = "13px monospace";
    ctx.fillText(`facing = ${facing}`, 14, 24);
  }
  whenReady(draw);
  document.getElementById("flip-btn").addEventListener("click", () => {
    facing *= -1;
    draw();
  });
})();

/* ===================================================================
   Beispiel 2: attackHitDone - genau ein Treffer pro Angriff. Ohne
   diese Sperre würde jeder einzelne Frame, in dem die Zone
   überlappt, erneut Schaden anrichten.
   =================================================================== */
(function example2_oneHit() {
  const canvas = document.getElementById("stage2");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  let hitsWithoutGuard = 0, hitsWithGuard = 0;
  let attacking = false, attackHitDone = false, attackTimer = 0;

  document.getElementById("attack-btn").addEventListener("click", () => {
    if (attacking) return;
    attacking = true;
    attackHitDone = false;
    attackTimer = 0.3;
  });

  let lastTime = 0;
  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (attacking) {
      attackTimer -= dt;
      hitsWithoutGuard++; // OHNE Sperre: trifft jeden Frame
      if (!attackHitDone) { hitsWithGuard++; attackHitDone = true; } // MIT Sperre: nur einmal
      if (attackTimer <= 0) attacking = false;
    }

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#93a4b3";
    ctx.font = "13px monospace";
    ctx.fillText(`ohne Sperre:  ${hitsWithoutGuard} Treffer`, 20, 40);
    ctx.fillStyle = "#ff6b6b";
    ctx.fillRect(20, 55, Math.min(300, hitsWithoutGuard * 6), 16);
    ctx.fillStyle = "#93a4b3";
    ctx.fillText(`mit attackHitDone:  ${hitsWithGuard} Treffer`, 20, 110);
    ctx.fillStyle = "#5fe0c9";
    ctx.fillRect(20, 125, Math.min(300, hitsWithGuard * 6), 16);
    ctx.fillStyle = attacking ? "#ffb84d" : "#93a4b3";
    ctx.fillText(attacking ? "Angriff läuft ..." : "Bereit - auf 'Angreifen' klicken", 20, 170);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* ===================================================================
   Beispiel 3: unterschiedlicher Schaden je Angriffsart - entspricht
   der DAMAGE-Tabelle aus entities.js
   =================================================================== */
(function example3_damage() {
  const canvas = document.getElementById("stage3");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const hpDisplay = document.getElementById("hp-display");

  const DAMAGE = { Hit: 1, Kick: 2, Sword: 10 };
  const RANGE = { Hit: 30, Kick: 34, Sword: 46 };
  const GAP_FOR = { Hit: 15, Kick: 25, Sword: 38 };

  const heroX = W / 2 - 20;
  let enemyX = W / 2 + 20, enemyHp = 500, attackTimer = 0, attackHitDone = false, currentAttack = null;

  function attack(type) {
    if (attackTimer > 0) return;
    currentAttack = type;
    attackTimer = 0.3;
    attackHitDone = false;
    enemyX = heroX + GAP_FOR[type];
  }
  document.getElementById("btn-hit").addEventListener("click", () => attack("Hit"));
  document.getElementById("btn-kick").addEventListener("click", () => attack("Kick"));
  document.getElementById("btn-sword").addEventListener("click", () => attack("Sword"));
  document.getElementById("reset-btn").addEventListener("click", () => (enemyHp = 500));

  function enemyHurtbox() {
    return rectOf(enemyX - 13, 150 - 58, 26, 58);
  }

  let lastTime = 0;
  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (attackTimer > 0) {
      attackTimer -= dt;
      if (!attackHitDone) {
        const range = RANGE[currentAttack];
        const hitBox = rectOf(heroX, 150 - 40, range, 30);
        if (overlaps(hitBox, enemyHurtbox())) {
          enemyHp = Math.max(0, enemyHp - DAMAGE[currentAttack]);
          attackHitDone = true;
        }
      }
    }

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    whenReady(() => {
      drawFrame(ctx, heroSheet, 0, heroX, 150, 1);
      if (enemyHp > 0) drawFrame(ctx, enemySheet, 0, enemyX, 150, -1);
    });

    const eb = enemyHurtbox();
    ctx.strokeStyle = "#5fb0ff";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(eb.left, eb.top, eb.right - eb.left, eb.bottom - eb.top);
    ctx.setLineDash([]);
    if (attackTimer > 0) {
      const range = RANGE[currentAttack];
      ctx.strokeStyle = "#ff6b6b";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(heroX, 150 - 40, range, 30);
      ctx.setLineDash([]);
    }
    hpDisplay.textContent = `Gegner-HP: ${enemyHp}/500   letzter Angriff: ${currentAttack || "-"}   Abstand: ${(enemyX - heroX).toFixed(0)}px`;

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
