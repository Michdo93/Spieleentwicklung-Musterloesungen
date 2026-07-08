/**
 * Kapitel 5 - Bewegung & Schwerkraft
 * Musterloesung
 *
 * Direkte Positionsaenderung (x += SPEED*dt, siehe Kapitel 4) reicht fuer
 * gleichfoermige Bewegung, aber nicht fuer einen Sprung. Ein Sprung
 * braucht eine eigene GESCHWINDIGKEIT (vy), auf die eine konstante
 * Schwerkraft wirkt - vy waechst jeden Frame ein kleines Stueck.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

// dieselben Werte wie im spaeteren Ninja-Fight-Projekt
const GRAVITY = 1400;    // px/s² - wie schnell die Fallgeschwindigkeit zunimmt
const JUMP_SPEED = 620;  // px/s - Anfangsgeschwindigkeit nach oben
const GROUND_Y = H - 50;
const RADIUS = 15;

const ball = {
  x: W / 2,
  y: GROUND_Y - RADIUS,
  vy: 0,
  onGround: true,
};

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && ball.onGround) {
    ball.vy = -JUMP_SPEED; // einmaliger Anstoss nach oben
    ball.onGround = false;
    e.preventDefault();
  }
});

let lastTime = 0;

function update(dt) {
  // Schwerkraft: die Fallgeschwindigkeit waechst jeden Frame
  ball.vy += GRAVITY * dt;

  const nextY = ball.y + ball.vy * dt;

  // Landung: nur wenn wir uns nach UNTEN bewegen (vy >= 0) und den
  // Boden erreichen oder ueberschreiten wuerden. Ohne die vy>=0-Pruefung
  // wuerde man auch beim Hochfliegen "landen".
  if (nextY >= GROUND_Y - RADIUS && ball.vy >= 0) {
    ball.y = GROUND_Y - RADIUS;
    ball.vy = 0;
    ball.onGround = true;
  } else {
    ball.y = nextY;
    ball.onGround = false;
  }
}

function render() {
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#663300";
  ctx.fillRect(0, GROUND_Y, W, 4);

  ctx.fillStyle = ball.onGround ? "#5fe0c9" : "#a78bfa";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, RADIUS, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#93a4b3";
  ctx.font = "13px monospace";
  ctx.fillText(`vy = ${ball.vy.toFixed(0)} px/s   onGround = ${ball.onGround}`, 14, 24);
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
