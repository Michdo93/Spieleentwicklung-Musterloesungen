/**
 * Kapitel 12 - Items & Power-Ups
 * Musterloesung
 *
 * Ein Power-Up ist ein kleiner Cousin einer Spielfigur: Es faellt mit
 * derselben Schwerkraft und landet auf derselben Art Plattform - nur
 * ohne eigene Steuerung. Drei grundverschiedene Effekt-Muster: sofortig
 * (Herz), zeitbegrenzt (Schwert), zaehlbegrenzt (Shuriken).
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

const GRAVITY = 1400;
const GROUND_Y = H - 40;
const SIZE = 28;

const COLORS = { Heart: "#ff6b9d", Sword: "#93a4b3", Shuriken: "#5fe0c9" };

class PowerUp {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.landed = false;
    this.collected = false;
  }

  update(dt, candidates) {
    if (this.collected) return;

    // exakt dieselbe Schwerkraft/Landung wie eine Spielfigur - nur ohne
    // Steuerung von aussen
    if (!this.landed) {
      this.vy += GRAVITY * dt;
      const nextY = this.y + this.vy * dt;
      if (nextY >= GROUND_Y - SIZE) {
        this.y = GROUND_Y - SIZE;
        this.vy = 0;
        this.landed = true;
      } else {
        this.y = nextY;
      }
    }

    // JEDER Kandidat wird geprueft, nicht nur der Spieler - dadurch kann
    // auch der Gegner ein Item vor der Nase wegschnappen, ganz ohne
    // Sonderfall-Code.
    for (const c of candidates) {
      if (Math.abs(c.x - this.x) < 26 && Math.abs(c.y - this.y) < 30) {
        this.collected = true;
        c.collectPowerUp(this.type);
        break;
      }
    }
  }

  draw(ctx) {
    if (this.collected) return;
    ctx.fillStyle = COLORS[this.type];
    ctx.fillRect(this.x - SIZE / 2, this.y - SIZE / 2, SIZE, SIZE);
  }
}

function makeCharacter(x, label) {
  return {
    x, y: GROUND_Y - SIZE / 2,
    label,
    hp: 8, maxHp: 10,
    hasSword: false, swordTimer: 0,
    shurikenCount: 0,
    collectPowerUp(type) {
      // drei grundverschiedene Effekt-Muster:
      if (type === "Heart") {
        // 1) SOFORTIG - keine Nachwirkung, direkt angewendet
        this.hp = Math.min(this.maxHp, this.hp + 2);
      } else if (type === "Sword") {
        // 2) ZEITBEGRENZT - eigener Countdown-Timer
        this.hasSword = true;
        this.swordTimer = 8; // Sekunden, in der echten Version 30s
      } else if (type === "Shuriken") {
        // 3) ZAEHLBEGRENZT - Zaehler statt Timer
        this.shurikenCount += 3;
      }
    },
  };
}

const player = makeCharacter(80, "Spieler");
const enemyDummy = makeCharacter(380, "Gegner");

let items = [];

const keys = { left: false, right: false };
window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;
});
window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
});

function dropItem(type) {
  items.push(new PowerUp(type, 200 + Math.random() * 80, 20));
}
document.getElementById("btn-heart").addEventListener("click", () => dropItem("Heart"));
document.getElementById("btn-sword").addEventListener("click", () => dropItem("Sword"));
document.getElementById("btn-shuriken").addEventListener("click", () => dropItem("Shuriken"));

let lastTime = 0;

function update(dt) {
  if (keys.left) player.x -= 160 * dt;
  if (keys.right) player.x += 160 * dt;
  player.x = Math.max(SIZE, Math.min(W - SIZE, player.x));

  if (player.swordTimer > 0) {
    player.swordTimer -= dt;
    if (player.swordTimer <= 0) player.hasSword = false;
  }

  const candidates = [player, enemyDummy];
  items.forEach((it) => it.update(dt, candidates));
  items = items.filter((it) => !it.collected);
}

function drawCharacter(c) {
  ctx.fillStyle = c.hasSword ? "#ffb84d" : "#a78bfa";
  ctx.fillRect(c.x - SIZE / 2, c.y - SIZE / 2, SIZE, SIZE);
  ctx.fillStyle = "#93a4b3";
  ctx.font = "11px monospace";
  ctx.fillText(c.label, c.x - 20, c.y - 22);
}

function render() {
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#663300";
  ctx.fillRect(0, GROUND_Y, W, 4);

  items.forEach((it) => it.draw(ctx));
  drawCharacter(player);
  drawCharacter(enemyDummy);

  ctx.fillStyle = "#93a4b3";
  ctx.font = "13px monospace";
  ctx.fillText(
    `Spieler - HP: ${player.hp}/${player.maxHp}  Schwert: ${player.hasSword ? player.swordTimer.toFixed(1) + "s" : "-"}  Shuriken: ${player.shurikenCount}`,
    14, 24
  );
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
