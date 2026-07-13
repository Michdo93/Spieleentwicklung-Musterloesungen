/**
 * Kapitel 5 - Bewegung & Schwerkraft
 * Musterloesung
 *
 * Drei Beispiele: (1) Position vs. Geschwindigkeit, (2) Schwerkraft,
 * (3) der vollstaendige Sprung - exakt der Weg, den auch
 * Hero.update() in Ninja Fight geht.
 */

// dieselben Werte wie in Ninja Fight (render.js)
const GRAVITY = 1400;   // px/s² - wie schnell die Fallgeschwindigkeit zunimmt
const JUMP_SPEED = 620; // px/s - Anfangsgeschwindigkeit nach oben

/* ===================================================================
   Beispiel 1: Position vs. Geschwindigkeit
   Direkt die Position zu veraendern (wie in Kapitel 4) funktioniert
   fuer gleichfoermige Bewegung - aber Beschleunigung braucht einen
   eigenen Geschwindigkeitswert, der sich selbst veraendert.
   =================================================================== */
(function example1_velocity() {
  const canvas = document.getElementById("stage1");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  let xConst = 40, xAccel = 40, vxAccel = 0;
  let lastTime = 0;

  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    xConst += 90 * dt; // konstante Geschwindigkeit
    vxAccel += 60 * dt; // die Geschwindigkeit selbst waechst
    xAccel += vxAccel * dt;
    if (xConst > W - 30) xConst = 40;
    if (xAccel > W - 30) { xAccel = 40; vxAccel = 0; }

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#5fe0c9";
    ctx.fillRect(xConst - 15, 60, 30, 30);
    ctx.fillStyle = "#ffb84d";
    ctx.fillRect(xAccel - 15, 160, 30, 30);
    ctx.fillStyle = "#93a4b3";
    ctx.font = "13px monospace";
    ctx.fillText("konstante Geschwindigkeit", 14, 50);
    ctx.fillText(`beschleunigt - v = ${vxAccel.toFixed(0)}px/s`, 14, 150);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* ===================================================================
   Beispiel 2: Schwerkraft - die Geschwindigkeit waechst jeden Frame
   =================================================================== */
(function example2_gravity() {
  const canvas = document.getElementById("stage2");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const GROUND_Y = 220;

  let y = 20, vy = 0;
  let lastTime = 0;

  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    vy += GRAVITY * dt;
    y += vy * dt;
    if (y > GROUND_Y - 15) { y = GROUND_Y - 15; vy = 0; }

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#663300";
    ctx.fillRect(0, GROUND_Y, W, 4);
    ctx.fillStyle = "#ffb84d";
    ctx.beginPath();
    ctx.arc(W / 2, y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#93a4b3";
    ctx.font = "13px monospace";
    ctx.fillText(`vy = ${vy.toFixed(0)} px/s`, 14, 24);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* ===================================================================
   Beispiel 3: der vollstaendige Sprung - exakt Hero.update() aus
   Ninja Fight: Space setzt vy auf einen negativen Anfangswert (nach
   oben), danach uebernimmt dieselbe Schwerkraft wie in Beispiel 2.
   =================================================================== */
(function example3_jump() {
  const canvas = document.getElementById("stage3");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const GROUND_Y = 220;

  let y = GROUND_Y - 15, vy = 0, onGround = true;
  let lastTime = 0;

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && onGround) {
      vy = -JUMP_SPEED;
      onGround = false;
      e.preventDefault();
    }
  });

  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    // entspricht exakt dem Sprung-Teil aus Hero.update()
    vy += GRAVITY * dt;
    const nextY = y + vy * dt;
    if (nextY >= GROUND_Y - 15 && vy >= 0) {
      y = GROUND_Y - 15;
      vy = 0;
      onGround = true;
    } else {
      y = nextY;
      onGround = false;
    }

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#663300";
    ctx.fillRect(0, GROUND_Y, W, 4);
    ctx.fillStyle = onGround ? "#5fe0c9" : "#a78bfa";
    ctx.beginPath();
    ctx.arc(W / 2, y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#93a4b3";
    ctx.font = "13px monospace";
    ctx.fillText(`vy = ${vy.toFixed(0)} px/s   onGround = ${onGround}`, 14, 24);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  canvas.addEventListener("click", () => canvas.focus());
})();
