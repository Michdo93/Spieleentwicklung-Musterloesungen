/**
 * Kapitel 16 - HUD & Spielstatus
 * Musterloesung
 *
 * Drei Beispiele: (1) die richtige Balkenposition ueber dem Fusspunkt
 * (echte Lektion aus der Praxis), (2) HUD-Text als DOM-Overlay,
 * (3) wann aktualisiert sich das HUD - jeden Frame statt nur bei
 * Ereignissen.
 */

const enemySheet = new Image();
enemySheet.src = "assets/red.png";
function whenReady(fn) {
  if (enemySheet.complete && enemySheet.naturalWidth > 0) fn();
  else enemySheet.addEventListener("load", fn, { once: true });
}
function drawEnemy(ctx, x, y) {
  ctx.drawImage(enemySheet, 0, 0, 160, 150, x - 30, y - 62, 60, 62);
}

// entspricht drawHealthBar() in render.js - hier mit einstellbarer
// Ausrichtung, um links/mittig/rechts zu vergleichen
function drawHealthBar(ctx, x, y, hp, maxHp, align = "center") {
  const w = 40, h = 5;
  const pct = Math.max(0, hp / maxHp);
  let left;
  if (align === "left") left = x;
  else if (align === "right") left = x - w;
  else left = x - w / 2; // "center" - Standard in Ninja Fight

  ctx.fillStyle = "rgba(5,7,10,0.7)";
  ctx.fillRect(left - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = "#3a1010";
  ctx.fillRect(left, y, w, h);
  ctx.fillStyle = pct > 0.5 ? "#5fe07a" : pct > 0.25 ? "#ffb84d" : "#ff5555";
  ctx.fillRect(left, y, w * pct, h);

  // Referenzlinie: markiert x selbst
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.moveTo(x, y - 6);
  ctx.lineTo(x, y + h + 4);
  ctx.stroke();
}

/* ===================================================================
   Beispiel 1: die richtige Balkenposition. Die Sprite-Hoehe ist groesser
   als man vermuten wuerde - ein zu kleiner Abstand legt den Balken
   mitten in den Kopf.
   =================================================================== */
(function example1_position() {
  const canvas = document.getElementById("stage1");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  let offset = 40, align = "center";

  function draw() {
    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    whenReady(() => drawEnemy(ctx, W / 2, 150));
    drawHealthBar(ctx, W / 2, 150 - offset, 6, 10, align);
    ctx.fillStyle = offset < 61 ? "#ff6b6b" : "#5fe0c9";
    ctx.font = "12px monospace";
    ctx.fillText(`Abstand: ${offset}px  ${offset < 61 ? "(im Kopf!)" : "(richtig)"}  Ausrichtung: ${align}`, 10, 24);
  }
  document.getElementById("offset-slider").addEventListener("input", (e) => {
    offset = Number(e.target.value);
    draw();
  });
  document.querySelectorAll("[data-align]").forEach((b) => {
    b.addEventListener("click", () => {
      align = b.dataset.align;
      document.querySelectorAll("[data-align]").forEach((x) => x.classList.remove("btn-active"));
      b.classList.add("btn-active");
      draw();
    });
  });
  whenReady(draw);
})();

/* ===================================================================
   Beispiel 2: HUD-Text als DOM-Overlay
   =================================================================== */
(function example2_text() {
  let points = 0, time = 120;
  document.getElementById("btn-add-point").addEventListener("click", () => {
    points++;
    updateHud();
  });
  function updateHud() {
    document.getElementById("hud-points").textContent = `Punkte: ${points}`;
    document.getElementById("hud-time").textContent = `Zeit: ${Math.ceil(time)}s`;
  }
  let lastTime = 0;
  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    time = Math.max(0, time - dt);
    updateHud();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* ===================================================================
   Beispiel 3: wann aktualisiert sich das HUD? Jeden Frame aufzurufen
   ist robuster als es nur an einzelnen Stellen zu tun.
   =================================================================== */
(function example3_timing() {
  let shurikenCount = 3;
  // "nur bei Ereignis aktualisiert" - wird absichtlich NIE neu gesetzt
  document.getElementById("hud-stale").textContent = `Shuriken: ${shurikenCount}`;

  document.getElementById("btn-use-shuriken").addEventListener("click", () => {
    shurikenCount = Math.max(0, shurikenCount - 1);
  });

  function loop() {
    // "jeden Frame aktualisiert" - immer korrekt
    document.getElementById("hud-live").textContent = `Shuriken: ${shurikenCount}`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
