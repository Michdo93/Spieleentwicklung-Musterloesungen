/**
 * Kapitel 1 - Canvas-Grundlagen & Game-Loop
 * Musterloesung
 *
 * Zeitbasierter Game-Loop: Die Bewegung wird nicht in "Pixel pro Frame",
 * sondern in "Pixel pro Sekunde" angegeben. Dazu messen wir bei jedem
 * Frame die tatsaechlich vergangene Zeit (dt) und skalieren die Bewegung
 * damit. So laeuft das Spiel auf jedem Bildschirm gleich schnell,
 * unabhaengig von dessen Bildwiederholrate.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

const SPEED = 140; // Pixel pro Sekunde

const square = {
  x: 40,
  y: 105,
  size: 60,
};

let lastTime = 0;

function update(dt) {
  square.x += SPEED * dt;
  if (square.x > W - square.size) {
    square.x = 40;
  }
}

function render() {
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#a78bfa";
  ctx.fillRect(square.x, square.y, square.size, square.size);
  ctx.strokeStyle = "#0a0e14";
  ctx.lineWidth = 2;
  ctx.strokeRect(square.x, square.y, square.size, square.size);
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
