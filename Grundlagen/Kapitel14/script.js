/**
 * Kapitel 14 - Gegner-KI: Kampf & Gegnertypen
 * Musterloesung
 *
 * Ein einfacher Entscheidungsbaum nach Abstand reicht fuer
 * glaubwuerdiges Angriffsverhalten - Nahkampf zuerst pruefen, dann
 * Fernkampf, dann Schwert. Faehigkeiten und HP lassen sich sauber an
 * den Gegnertyp koppeln, statt fuer jeden Typ eigenen Code zu
 * schreiben.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

const GROUND_Y = H - 60;
const SIZE = 30;
const SPEED = 140;

// Faehigkeiten und HP sind an den TYP gekoppelt, nicht an einzelne
// Instanzen - ein neuer Gegnertyp braucht nur einen neuen Eintrag.
const ENEMY_TYPES = {
  Blue: { canShuriken: false, canSword: false, color: "#3b82c4" },
  Green: { canShuriken: true, canSword: false, color: "#22c55e" },
  White: { canShuriken: true, canSword: true, color: "#e5e7eb" },
};
const HP_BY_TYPE = { Blue: 10, Green: 20, White: 50 };

function overlaps(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}
function rectOf(x, y, w, h) {
  return { left: x, right: x + w, top: y, bottom: y + h };
}

const player = { x: 60, hp: 20 };

let enemy = makeEnemy("Blue");

function makeEnemy(type) {
  return {
    type,
    def: ENEMY_TYPES[type],
    x: 320,
    hp: HP_BY_TYPE[type],
    maxHp: HP_BY_TYPE[type],
    shurikenCount: ENEMY_TYPES[type].canShuriken ? 99 : 0,
    attackCooldown: 0,
    lastAction: "-",
  };
}

document.querySelectorAll("button[data-type]").forEach((btn) => {
  btn.addEventListener("click", () => { enemy = makeEnemy(btn.dataset.type); });
});

const keys = { left: false, right: false };
window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;
});
window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
});

// Der eigentliche Entscheidungsbaum: NAHKAMPF zuerst pruefen (kuerzeste
// Reichweite, staerkste Bindung), dann Fernkampf, dann Schwert. Diese
// Reihenfolge ist wichtig - ein Gegner in Schlagreichweite sollte
// zuschlagen, nicht erst ueberlegen, ob er lieber wirft.
function decideAttack(dist) {
  if (dist < 40) return "Nahkampf";
  if (dist < 220 && enemy.def.canShuriken) return "Shuriken";
  if (dist < 60 && enemy.def.canSword) return "Schwert"; // greift nur, wenn Shuriken nicht verfuegbar ist (Pruefreihenfolge!)
  return null;
}

let lastTime = 0;

function update(dt) {
  if (keys.left) player.x -= SPEED * dt;
  if (keys.right) player.x += SPEED * dt;
  player.x = Math.max(0, Math.min(W - SIZE, player.x));

  enemy.attackCooldown -= dt;
  const dist = Math.abs(player.x - enemy.x);

  if (enemy.attackCooldown <= 0) {
    const action = decideAttack(dist);
    if (action) {
      enemy.lastAction = `${action} (Abstand ${dist.toFixed(0)}px)`;
      enemy.attackCooldown = 1 + Math.random();
    } else {
      enemy.lastAction = "wartet (ausser Reichweite)";
    }
  }
}

function render() {
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#663300";
  ctx.fillRect(0, GROUND_Y + SIZE, W, 4);

  ctx.fillStyle = "#a78bfa";
  ctx.fillRect(player.x, GROUND_Y, SIZE, SIZE);

  ctx.fillStyle = enemy.def.color;
  ctx.fillRect(enemy.x, GROUND_Y, SIZE, SIZE);

  ctx.fillStyle = "#3a4a58";
  ctx.fillRect(enemy.x, GROUND_Y - 12, SIZE, 6);
  ctx.fillStyle = "#ff6b9d";
  ctx.fillRect(enemy.x, GROUND_Y - 12, SIZE * (enemy.hp / enemy.maxHp), 6);

  ctx.fillStyle = "#93a4b3";
  ctx.font = "13px monospace";
  ctx.fillText(`Typ: ${enemy.type}  HP: ${enemy.hp}/${enemy.maxHp}`, 14, 24);
  ctx.fillText(`Aktion: ${enemy.lastAction}`, 14, 42);
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
