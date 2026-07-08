/**
 * Kapitel 13 - Gegner-KI: Bewegung
 * Musterloesung
 *
 * Feste Patrouillengrenzen allein wissen nichts von der tatsaechlichen
 * Plattformgeometrie - ein Gegner mit nur festen Grenzen wuerde ueber
 * die Kante einer kuerzeren Plattform hinauslaufen und fallen.
 * hasSupportAhead() prueft VOR jedem Schritt, ob voraus noch Boden ist.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

const GRAVITY = 1400;
const ENEMY_SPEED = 90;
const SIZE = 28;

// EINE Plattform, die schmaler ist als die Patrouillengrenzen unten.
// Ohne Kantenerkennung wuerde der Gegner bis zu patrolRight/patrolLeft
// laufen und dabei ueber den Rand der Plattform hinausfallen.
const platforms = [
  { x: 100, y: H - 40, w: 280 },
];

const enemy = {
  x: 220,
  y: H - 40 - SIZE,
  vy: 0,
  facing: 1,
  onGround: true,
  patrolLeft: 20,
  patrolRight: 460,
  jumpCooldown: 2 + Math.random() * 2,
};

// Prueft, ob "dist" Pixel voraus (in Blickrichtung) noch eine Plattform
// ist. Ohne diese Pruefung liefe der Gegner blind ueber jede Kante.
function hasSupportAhead(dist) {
  const aheadX = enemy.x + enemy.facing * dist;
  return platforms.some((p) => aheadX > p.x - 4 && aheadX < p.x + p.w + 4 && Math.abs(p.y - (enemy.y + SIZE)) < 6);
}

function findLanding(nextY) {
  let best = null;
  platforms.forEach((p) => {
    const over = enemy.x + SIZE > p.x && enemy.x < p.x + p.w;
    const wasAbove = enemy.y + SIZE <= p.y + 2;
    const nowBelow = nextY + SIZE >= p.y;
    if (over && wasAbove && nowBelow) {
      if (!best || p.y < best.y) best = p;
    }
  });
  return best;
}

let lastTime = 0;

function update(dt) {
  enemy.jumpCooldown -= dt;

  const lookAhead = 22;
  const supported = hasSupportAhead(lookAhead);

  if (!supported) {
    // Kante erkannt -> umdrehen, statt blind weiterzulaufen und zu fallen
    enemy.facing *= -1;
  } else {
    enemy.x += enemy.facing * ENEMY_SPEED * dt;
  }

  if (enemy.x <= enemy.patrolLeft) { enemy.x = enemy.patrolLeft; enemy.facing = 1; }
  else if (enemy.x >= enemy.patrolRight - SIZE) { enemy.x = enemy.patrolRight - SIZE; enemy.facing = -1; }

  // zufaelliges Springen - WICHTIG: nur wenn "supported" true ist. Ein
  // Zufallssprung ohne diese Pruefung wuerde die Kantenerkennung
  // unterlaufen und den Gegner doch noch von der Plattform werfen.
  if (supported && enemy.onGround && enemy.jumpCooldown <= 0 && Math.random() < 0.01) {
    enemy.vy = -520;
    enemy.onGround = false;
    enemy.jumpCooldown = 2 + Math.random() * 2;
  }

  enemy.vy += GRAVITY * dt;
  const nextY = enemy.y + enemy.vy * dt;
  const landing = enemy.vy >= 0 ? findLanding(nextY) : null;
  if (landing) {
    enemy.y = landing.y - SIZE;
    enemy.vy = 0;
    enemy.onGround = true;
  } else {
    enemy.y = nextY;
    enemy.onGround = false;
  }
}

function render() {
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#663300";
  platforms.forEach((p) => ctx.fillRect(p.x, p.y, p.w, 4));

  ctx.fillStyle = "#ffb84d";
  ctx.fillRect(enemy.x, enemy.y, SIZE, SIZE);
  // Blickrichtung als kleiner Pfeil zur Anschauung
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(enemy.x + (enemy.facing > 0 ? SIZE - 4 : 0), enemy.y + SIZE / 2 - 2, 4, 4);
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
