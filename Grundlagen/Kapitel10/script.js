/**
 * Kapitel 10 - Nahkampf & Hitboxen
 * Musterloesung
 *
 * Eine Trefferzone (Hitbox) liegt immer VOR der Figur - ihre Position
 * haengt von der Blickrichtung ab. Ein Sperr-Flag (attackHitDone)
 * verhindert, dass eine mehrere Frames dauernde Angriffsanimation
 * mehrfach trifft.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

const SPEED = 140;
const GROUND_Y = H - 60;
const SIZE = 30;

// Reichweite und Schaden sind bewusst gekoppelt: ein Tritt trifft
// weiter UND haerter als ein einfacher Schlag.
const ATTACKS = {
  Hit: { range: 30, damage: 1, duration: 0.35 },
  Kick: { range: 44, damage: 2, duration: 0.35 },
};

function overlaps(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}
function rectOf(x, y, w, h) {
  return { left: x, right: x + w, top: y, bottom: y + h };
}

const player = {
  x: 60,
  facing: 1,
  attackType: null, // "Hit" oder "Kick", waehrend ein Angriff laeuft
  attackTimer: 0,
  attackHitDone: false,
};

const enemy = {
  x: 300,
  hp: 5,
  maxHp: 5,
};

const keys = { left: false, right: false };
window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;
  if (e.code === "KeyJ") startAttack("Hit");
  if (e.code === "KeyK") startAttack("Kick");
});
window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
});

function startAttack(type) {
  // ein bereits laufender Angriff wird nicht durch einen neuen unterbrochen
  if (player.attackType) return;
  player.attackType = type;
  player.attackTimer = ATTACKS[type].duration;
  player.attackHitDone = false;
}

let lastTime = 0;

function update(dt) {
  if (!player.attackType) {
    if (keys.left) { player.facing = -1; player.x -= SPEED * dt; }
    if (keys.right) { player.facing = 1; player.x += SPEED * dt; }
    player.x = Math.max(0, Math.min(W - SIZE, player.x));
  }

  if (player.attackType) {
    const def = ATTACKS[player.attackType];

    // Die Hitbox liegt vor der Figur - je nach Blickrichtung links
    // oder rechts von ihr.
    const hitBox = rectOf(
      player.x + (player.facing > 0 ? SIZE : -def.range),
      GROUND_Y,
      def.range,
      SIZE
    );
    const enemyBox = rectOf(enemy.x, GROUND_Y, SIZE, SIZE);

    // attackHitDone sorgt dafuer, dass EIN Angriff auch nur EINMAL
    // trifft, obwohl die Animation mehrere Frames dauert (attackTimer
    // laeuft ueber mehrere update()-Aufrufe).
    if (!player.attackHitDone && enemy.hp > 0 && overlaps(hitBox, enemyBox)) {
      enemy.hp = Math.max(0, enemy.hp - def.damage);
      player.attackHitDone = true;
    }

    player.attackTimer -= dt;
    if (player.attackTimer <= 0) {
      player.attackType = null;
    }
  }
}

function render() {
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#663300";
  ctx.fillRect(0, GROUND_Y + SIZE, W, 4);

  // Hitbox waehrend eines Angriffs sichtbar machen (nur zur Anschauung -
  // im fertigen Spiel unsichtbar)
  if (player.attackType) {
    const def = ATTACKS[player.attackType];
    const hbX = player.x + (player.facing > 0 ? SIZE : -def.range);
    ctx.fillStyle = "rgba(255,107,157,0.35)";
    ctx.fillRect(hbX, GROUND_Y, def.range, SIZE);
  }

  ctx.fillStyle = "#a78bfa";
  ctx.fillRect(player.x, GROUND_Y, SIZE, SIZE);

  ctx.fillStyle = enemy.hp > 0 ? "#5fe0c9" : "#3a4a58";
  ctx.fillRect(enemy.x, GROUND_Y, SIZE, SIZE);

  // HP-Balken des Gegners
  ctx.fillStyle = "#3a4a58";
  ctx.fillRect(enemy.x, GROUND_Y - 12, SIZE, 6);
  ctx.fillStyle = "#ff6b9d";
  ctx.fillRect(enemy.x, GROUND_Y - 12, SIZE * (enemy.hp / enemy.maxHp), 6);

  ctx.fillStyle = "#93a4b3";
  ctx.font = "13px monospace";
  ctx.fillText(`Gegner-HP: ${enemy.hp} / ${enemy.maxHp}`, 14, 24);
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
