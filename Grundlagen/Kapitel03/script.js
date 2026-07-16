/**
 * Kapitel 3 - Sprite-Animation
 * Musterlösung
 *
 * Drei Beispiele: (1) Frames von Hand durchklicken, (2) automatische
 * Wiedergabe mit einstellbarer FPS, (3) mehrere Zustände mit
 * Loop- vs. Einmalig-Verhalten. Zusammen ergeben sie exakt die Logik,
 * die später drawNinja() in Ninja Fight verwendet.
 */

const heroSheet = new Image();
heroSheet.src = "assets/hero.png";

// entspricht CHARACTER_SHEET in Ninja Fight: 8 Spalten, eine Zeile pro
// Zustand, 8 abgetastete Frames pro Zustand
const CELL_W = 160, CELL_H = 150;
const STATES = {
  Idle: { row: 0, count: 8, loop: true },
  Walk: { row: 1, count: 8, loop: true },
  Jump: { row: 2, count: 8, loop: false },
};

function whenReady(fn) {
  if (heroSheet.complete && heroSheet.naturalWidth > 0) fn();
  else heroSheet.addEventListener("load", fn, { once: true });
}

function drawFrame(ctx, state, frame, x, y, scale) {
  const def = STATES[state];
  const sx = frame * CELL_W, sy = def.row * CELL_H;
  ctx.drawImage(heroSheet, sx, sy, CELL_W, CELL_H, x, y, CELL_W * scale, CELL_H * scale);
}

/* ===================================================================
   Beispiel 1: Frame für Frame von Hand durchklicken
   =================================================================== */
(function example1_manual() {
  const canvas = document.getElementById("stage1");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  let frame = 0;

  function draw() {
    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    drawFrame(ctx, "Walk", frame, 20, 10, 0.9);
    ctx.fillStyle = "#93a4b3";
    ctx.font = "12px monospace";
    ctx.fillText(`Frame ${frame + 1} / ${STATES.Walk.count}`, 10, 170);
  }

  document.getElementById("btn-next").addEventListener("click", () => {
    frame = (frame + 1) % STATES.Walk.count;
    draw();
  });
  document.getElementById("btn-prev").addEventListener("click", () => {
    frame = (frame - 1 + STATES.Walk.count) % STATES.Walk.count;
    draw();
  });

  whenReady(draw);
})();

/* ===================================================================
   Beispiel 2: automatische, zeitbasierte Wiedergabe mit FPS-Regler
   Kernzeile (entspricht drawNinja()):
     let frame = Math.floor(t * fps); frame = frame % def.count;
   =================================================================== */
(function example2_auto() {
  const canvas = document.getElementById("stage2");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const fpsSlider = document.getElementById("fps-slider");
  const fpsValue = document.getElementById("fps-value");

  let t = 0, lastTime = 0;

  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    t += dt;

    const fps = Number(fpsSlider.value);
    fpsValue.textContent = fps;
    const frame = Math.floor(t * fps) % STATES.Walk.count;

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    drawFrame(ctx, "Walk", frame, 20, 10, 0.9);
    ctx.fillStyle = "#93a4b3";
    ctx.font = "12px monospace";
    ctx.fillText(`fps = ${fps}`, 10, 170);

    requestAnimationFrame(loop);
  }

  whenReady(() => requestAnimationFrame(loop));
})();

/* ===================================================================
   Beispiel 3: mehrere benannte Zustände - Loop vs. einmalig
   =================================================================== */
(function example3_states() {
  const canvas = document.getElementById("stage3");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  let state = "Idle";
  let t = 0, lastTime = 0;

  function setState(s) {
    state = s;
    t = 0; // bei jedem Zustandswechsel von vorn beginnen
  }

  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    t += dt;

    const def = STATES[state];
    const fps = state === "Idle" ? 6 : state === "Walk" ? 12 : 10;
    let frame = Math.floor(t * fps);
    // Idle/Walk: endlos (Modulo). Jump: einmalig, bleibt am letzten Frame stehen.
    frame = def.loop ? frame % def.count : Math.min(frame, def.count - 1);

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    drawFrame(ctx, state, frame, 20, 10, 0.9);
    ctx.fillStyle = "#93a4b3";
    ctx.font = "12px monospace";
    ctx.fillText(`state = "${state}"`, 10, 170);

    requestAnimationFrame(loop);
  }

  document.getElementById("btn-idle").addEventListener("click", () => setState("Idle"));
  document.getElementById("btn-walk").addEventListener("click", () => setState("Walk"));
  document.getElementById("btn-jump").addEventListener("click", () => setState("Jump"));

  whenReady(() => requestAnimationFrame(loop));
})();
