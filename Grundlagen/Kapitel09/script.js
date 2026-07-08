/**
 * Kapitel 9 - Leitern & Klettern
 * Musterloesung
 *
 * Klettern ist ein dritter Bewegungszustand neben Laufen und Springen:
 * Innerhalb einer Leiterzone schalten wir die Schwerkraft ab und steuern
 * die Position direkt per Tastatur - begrenzt auf die Leiterzone.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

const GRAVITY = 1400;
const JUMP_SPEED = 620;
const WALK_SPEED = 160;
const CLIMB_SPEED = 110;
const SIZE = 28;

const platforms = [
  { x: 0, y: H - 20, w: 160 },
  { x: 320, y: H - 20, w: 160 },
  { x: 60, y: 100, w: 160 },
];

// Eine Leiterzone verbindet zwei Plattformen. left/right begrenzen die
// Breite, top/bottom die Hoehe, innerhalb derer geklettert werden kann.
const ladder = { left: 110, right: 150, top: 100, bottom: H - 20 };

const player = {
  x: 20,
  y: H - 20 - SIZE,
  vy: 0,
  onGround: true,
  onLadder: false,
};

const keys = { left: false, right: false, up: false, down: false, jump: false };
window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;
  if (e.code === "ArrowUp" || e.code === "KeyW") keys.up = true;
  if (e.code === "ArrowDown" || e.code === "KeyS") keys.down = true;
  if (e.code === "Space") { keys.jump = true; e.preventDefault(); }
});
window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
  if (e.code === "ArrowUp" || e.code === "KeyW") keys.up = false;
  if (e.code === "ArrowDown" || e.code === "KeyS") keys.down = false;
  if (e.code === "Space") keys.jump = false;
});

function findLanding(nextY) {
  let best = null;
  platforms.forEach((p) => {
    const over = player.x + SIZE > p.x && player.x < p.x + p.w;
    const wasAbove = player.y + SIZE <= p.y + 2;
    const nowBelow = nextY + SIZE >= p.y;
    if (over && wasAbove && nowBelow) {
      if (!best || p.y < best.y) best = p;
    }
  });
  return best;
}

let lastTime = 0;

function update(dt) {
  const midX = player.x + SIZE / 2;
  const midY = player.y + SIZE / 2;

  // In der Leiterzone, UND nur hoch/runter gedrueckt (nicht gleichzeitig
  // links/rechts) -> Klettermodus. Kein Frame-Gedaechtnis noetig: der
  // Zustand ergibt sich jeden Frame neu aus der aktuellen Situation.
  const inLadderZone =
    midX > ladder.left - 4 && midX < ladder.right + 4 &&
    midY > ladder.top - 6 && midY < ladder.bottom + 6;
  player.onLadder = inLadderZone && !keys.left && !keys.right;

  if (player.onLadder) {
    player.vy = 0;
    if (keys.up) player.y -= CLIMB_SPEED * dt;
    else if (keys.down) player.y += CLIMB_SPEED * dt;
    player.y = Math.max(ladder.top, Math.min(ladder.bottom - SIZE, player.y));
    player.onGround = false;
  } else {
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
}

function render() {
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#663300";
  platforms.forEach((p) => ctx.fillRect(p.x, p.y, p.w, 4));

  ctx.fillStyle = "#8a6b3a";
  ctx.fillRect(ladder.left, ladder.top, ladder.right - ladder.left, ladder.bottom - ladder.top);

  ctx.fillStyle = player.onLadder ? "#ffb84d" : player.onGround ? "#5fe0c9" : "#a78bfa";
  ctx.fillRect(player.x, player.y, SIZE, SIZE);

  ctx.fillStyle = "#93a4b3";
  ctx.font = "13px monospace";
  ctx.fillText(`onLadder = ${player.onLadder}`, 14, 24);
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
