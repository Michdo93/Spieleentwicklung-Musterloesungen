/**
 * Kapitel 4 - Tastatur- & Maus-Eingabe
 * Musterloesung
 *
 * Das Key-State-Muster: Tastatur-Events setzen nur Flags in einem
 * Objekt (keys), der Game-Loop fragt diese Flags jeden Frame ab. So
 * bewegt sich das Quadrat, SOLANGE eine Taste gehalten wird - nicht nur
 * einmal pro Tastendruck.
 *
 * Dazu: ein einfacher Maus-Trefftest, um zu erkennen, ob innerhalb
 * eines Rechtecks geklickt wurde.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

const SPEED = 200; // Pixel pro Sekunde

const square = {
  x: W / 2 - 30,
  y: H / 2 - 30,
  size: 60,
  color: "#a78bfa",
};

// Key-State-Objekt: keydown setzt ein Flag auf true, keyup wieder auf
// false. Die eigentliche Bewegung fragt nur diese Flags ab - sie weiss
// nichts von Tastatur-Events.
const keys = { left: false, right: false, up: false, down: false };

function keyDown(e) {
  switch (e.code) {
    case "ArrowLeft": case "KeyA": keys.left = true; break;
    case "ArrowRight": case "KeyD": keys.right = true; break;
    case "ArrowUp": case "KeyW": keys.up = true; break;
    case "ArrowDown": case "KeyS": keys.down = true; break;
  }
}
function keyUp(e) {
  switch (e.code) {
    case "ArrowLeft": case "KeyA": keys.left = false; break;
    case "ArrowRight": case "KeyD": keys.right = false; break;
    case "ArrowUp": case "KeyW": keys.up = false; break;
    case "ArrowDown": case "KeyS": keys.down = false; break;
  }
}
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

// Mausklick: Koordinaten des Klicks muessen erst von
// "Pixel im Browserfenster" in "Pixel auf dem Canvas" umgerechnet
// werden, bevor ein Trefftest Sinn ergibt.
const COLORS = ["#a78bfa", "#5fe0c9", "#ffb84d", "#ff6b9d"];
let colorIndex = 0;

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const hit =
    mouseX >= square.x && mouseX <= square.x + square.size &&
    mouseY >= square.y && mouseY <= square.y + square.size;

  if (hit) {
    colorIndex = (colorIndex + 1) % COLORS.length;
    square.color = COLORS[colorIndex];
  }
});

let lastTime = 0;

function update(dt) {
  if (keys.left) square.x -= SPEED * dt;
  if (keys.right) square.x += SPEED * dt;
  if (keys.up) square.y -= SPEED * dt;
  if (keys.down) square.y += SPEED * dt;

  // nicht ueber den Rand hinauslaufen
  square.x = Math.max(0, Math.min(W - square.size, square.x));
  square.y = Math.max(0, Math.min(H - square.size, square.y));
}

function render() {
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = square.color;
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
