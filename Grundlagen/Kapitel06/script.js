/**
 * Kapitel 6 - Kollision & Plattformen
 * Musterloesung
 *
 * Statt gegen einen einzigen festen Boden zu landen (Kapitel 5), suchen
 * wir jetzt unter mehreren Plattformen diejenige, auf der die Figur
 * gerade landen wuerde - findLanding(), genau wie im spaeteren Spiel.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

const GRAVITY = 1400;
const JUMP_SPEED = 620;
const WALK_SPEED = 160;
const SIZE = 30; // Breite/Hoehe der Spielfigur (vereinfachtes Quadrat)

// Jede Plattform: { x, y, w } - eine Linie, auf der man landen kann.
// y ist die Oberkante der Plattform.
const platforms = [
  { x: 0, y: H - 20, w: W },       // durchgehender Boden
  { x: 60, y: 190, w: 120 },
  { x: 260, y: 130, w: 120 },
  { x: 340, y: 220, w: 100 },
];

const player = {
  x: 20,
  y: H - 20 - SIZE,
  vy: 0,
  onGround: true,
};

const keys = { left: false, right: false, jump: false };
window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;
  if (e.code === "Space") { keys.jump = true; e.preventDefault(); }
});
window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
  if (e.code === "Space") keys.jump = false;
});

// AABB-Test: zwei Rechtecke ueberlappen sich, wenn sie sich auf BEIDEN
// Achsen gleichzeitig ueberschneiden.
function overlaps(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

// Sucht unter allen Plattformen diejenige, auf der die Figur bei
// nextY landen wuerde: horizontal drueber, gerade eben noch drueber,
// und jetzt (fast) drauf.
function findLanding(nextY) {
  let best = null;
  platforms.forEach((p) => {
    const horizontallyOver = player.x + SIZE > p.x && player.x < p.x + p.w;
    const wasAboveOrLevel = player.y + SIZE <= p.y + 2;
    const nowAtOrBelow = nextY + SIZE >= p.y;
    if (horizontallyOver && wasAboveOrLevel && nowAtOrBelow) {
      if (!best || p.y < best.y) best = p;
    }
  });
  return best;
}

let lastTime = 0;

function update(dt) {
  if (keys.left) player.x -= WALK_SPEED * dt;
  if (keys.right) player.x += WALK_SPEED * dt;
  player.x = Math.max(0, Math.min(W - SIZE, player.x));

  if (keys.jump && player.onGround) {
    player.vy = -JUMP_SPEED;
    player.onGround = false;
  }
  player.vy += GRAVITY * dt;

  const nextY = player.y + player.vy * dt;
  const landing = player.vy >= 0 ? findLanding(nextY) : null;

  if (landing) {
    player.y = landing.y - SIZE;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.y = nextY;
    player.onGround = false;
  }
}

function render() {
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#663300";
  platforms.forEach((p) => ctx.fillRect(p.x, p.y, p.w, 4));

  ctx.fillStyle = player.onGround ? "#5fe0c9" : "#a78bfa";
  ctx.fillRect(player.x, player.y, SIZE, SIZE);
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

canvas.focus();
requestAnimationFrame(loop);
