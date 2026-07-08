/**
 * Kapitel 3 - Sprite-Animation
 * Musterloesung
 *
 * Eine Animation ist nichts weiter als: mehrere Frames eines Sprite-
 * Sheets schnell genug nacheinander zeigen. Dieses Beispiel zeigt beide
 * in Ninja Fight benoetigten Varianten:
 * - eine ENDLOS laufende Animation (Walk, per Modulo)
 * - eine EINMALIGE Animation, die am letzten Frame stehen bleibt (Jump)
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

const heroSheet = new Image();
heroSheet.src = "assets/hero.png";

const CELL_W = 160;
const CELL_H = 150;

// entspricht CHARACTER_SHEET.states in Ninja Fight
const STATES = {
  Walk: { row: 1, count: 8 },
  Jump: { row: 2, count: 8 },
};

const FPS = 10; // Frames der Animation pro Sekunde (nicht zu verwechseln mit der Bildwiederholrate!)

// linke Figur: laeuft endlos
let walkTime = 0;

// rechte Figur: springt einmal, wenn man auf den Knopf klickt
let jumping = false;
let jumpTime = 0;

function drawFrame(state, frameIndex, x, y) {
  const def = STATES[state];
  const sx = frameIndex * CELL_W;
  const sy = def.row * CELL_H;
  ctx.drawImage(heroSheet, sx, sy, CELL_W, CELL_H, x, y, CELL_W, CELL_H);
}

let lastTime = 0;

function update(dt) {
  walkTime += dt;

  if (jumping) {
    jumpTime += dt;
    const totalFrames = STATES.Jump.count;
    const rawFrame = Math.floor(jumpTime * FPS);
    if (rawFrame >= totalFrames) {
      jumping = false; // Animation fertig, bleibt am letzten Frame stehen
    }
  }
}

function render() {
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);

  if (!heroSheet.complete || heroSheet.naturalWidth === 0) return;

  // Endlos-Animation: Modulo sorgt dafuer, dass der Frame-Index immer
  // wieder von vorn beginnt (0,1,2,...,7,0,1,2,...)
  const walkFrame = Math.floor(walkTime * FPS) % STATES.Walk.count;
  drawFrame("Walk", walkFrame, 60, 30);

  // Einmalige Animation: Math.min() sorgt dafuer, dass der Frame-Index
  // nie ueber den letzten Frame hinausgeht - die Animation "haengt" am
  // letzten Frame, statt von vorn zu beginnen.
  const jumpFrame = Math.min(Math.floor(jumpTime * FPS), STATES.Jump.count - 1);
  drawFrame("Jump", jumpFrame, 260, 30);

  ctx.fillStyle = "#93a4b3";
  ctx.font = "12px monospace";
  ctx.fillText("Walk (endlos)", 60, 195);
  ctx.fillText("Jump (einmalig)", 260, 195);
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

document.getElementById("jump-btn").addEventListener("click", () => {
  jumping = true;
  jumpTime = 0;
});

requestAnimationFrame(loop);
