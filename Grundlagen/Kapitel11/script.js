/**
 * Kapitel 11 - Fernkampf & Projektile
 * Musterloesung
 *
 * Der Unterschied zwischen "eine Wurfanimation abspielen" und "ein
 * Objekt erzeugen, das sich eigenstaendig durch den Raum bewegt": Ein
 * Wurf braucht BEIDES. Die Projectile-Klasse hat eine eigene Position,
 * eigene Geschwindigkeit und ein eigenes update() - unabhaengig davon,
 * wer sie geworfen hat.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

const GROUND_Y = H - 60;
const SIZE = 30;
const SPEED = 140;

class Projectile {
  constructor(x, y, dir, owner) {
    this.x = x;
    this.y = y;
    this.dir = dir; // 1 = nach rechts, -1 = nach links
    this.owner = owner; // wer geworfen hat - wird selbst nicht getroffen
    this.speed = 480;
    this.dead = false;
  }

  update(dt, targets) {
    this.x += this.dir * this.speed * dt;
    if (this.x < -20 || this.x > W + 20) {
      this.dead = true;
      return;
    }

    // trifft jeden AUSSER den Werfer selbst
    for (const t of targets) {
      if (t === this.owner || t.dead) continue;
      if (Math.abs(t.x - this.x) < 20) {
        t.hp = Math.max(0, t.hp - 1);
        if (t.hp === 0) t.dead = true;
        this.dead = true;
        break;
      }
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#5fe0c9";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

const player = {
  x: 60,
  facing: 1,
  y: GROUND_Y + SIZE / 2,
};

const enemy = { x: 320, y: GROUND_Y + SIZE / 2, hp: 3, maxHp: 3, dead: false };

let projectiles = [];

const keys = { left: false, right: false };
window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;
  if (e.code === "KeyL") throwProjectile();
});
window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
});

function throwProjectile() {
  // Wichtig: hier wird ein tatsaechliches OBJEKT erzeugt, nicht nur
  // eine Animation abgespielt. Ohne dieses Objekt wuerde nichts fliegen.
  projectiles.push(new Projectile(player.x + player.facing * SIZE, player.y, player.facing, player));
}

let lastTime = 0;

function update(dt) {
  if (keys.left) { player.facing = -1; player.x -= SPEED * dt; }
  if (keys.right) { player.facing = 1; player.x += SPEED * dt; }
  player.x = Math.max(0, Math.min(W - SIZE, player.x));

  const targets = [enemy];
  projectiles.forEach((p) => p.update(dt, targets));
  projectiles = projectiles.filter((p) => !p.dead);
}

function render() {
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#663300";
  ctx.fillRect(0, GROUND_Y + SIZE, W, 4);

  ctx.fillStyle = "#a78bfa";
  ctx.fillRect(player.x, GROUND_Y, SIZE, SIZE);

  if (!enemy.dead) {
    ctx.fillStyle = "#ffb84d";
    ctx.fillRect(enemy.x, GROUND_Y, SIZE, SIZE);
    ctx.fillStyle = "#3a4a58";
    ctx.fillRect(enemy.x, GROUND_Y - 12, SIZE, 6);
    ctx.fillStyle = "#ff6b9d";
    ctx.fillRect(enemy.x, GROUND_Y - 12, SIZE * (enemy.hp / enemy.maxHp), 6);
  }

  projectiles.forEach((p) => p.draw(ctx));

  ctx.fillStyle = "#93a4b3";
  ctx.font = "13px monospace";
  ctx.fillText(`aktive Projektile: ${projectiles.length}`, 14, 24);
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
