/**
 * Kapitel 9 - Leitern & Klettern
 * Musterlösung
 *
 * Drei Beispiele: (1) der echte Bug (Leiterzone zu groß berechnet),
 * (2) die Korrektur, (3) vollständige Integration mit Laufen und
 * Springen - genau der Weg, den auch mergeLadderColumns()/Hero.update()
 * in Ninja Fight gehen.
 */

const GRAVITY = 1400, JUMP_SPEED = 620, CLIMB_SPEED = 110;

function drawLadderScene(ctx, W, H, platformY, ladder, x, y, climbing) {
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#663300";
  ctx.fillRect(0, 40, 40, platformY - 40 + 10);
  ctx.fillRect(0, 40, 200, 10);
  ctx.fillRect(0, platformY, 200, 10);

  ctx.strokeStyle = "#ffb84d";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.strokeRect(ladder.left, ladder.top, ladder.right - ladder.left, ladder.bottom - ladder.top);
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(255,184,77,0.15)";
  ctx.fillRect(ladder.left, ladder.top, ladder.right - ladder.left, ladder.bottom - ladder.top);

  ctx.strokeStyle = "#845232";
  ctx.lineWidth = 2;
  for (let ry = ladder.top + 6; ry < ladder.bottom - 4; ry += 10) {
    ctx.beginPath();
    ctx.moveTo(ladder.left + 2, ry);
    ctx.lineTo(ladder.right - 2, ry);
    ctx.stroke();
  }

  ctx.fillStyle = climbing ? "#a78bfa" : "#5fe0c9";
  ctx.beginPath();
  ctx.arc(x, y, 12, 0, Math.PI * 2);
  ctx.fill();
}

/* ===================================================================
   Beispiel 1: die zu groß berechnete Leiter-Zone - der echte Bug.
   In einer früheren Version wurde beim Zusammenfassen der Leiter-
   Sprossen zu einer Zone versehentlich ZWEIMAL eine Kachelhöhe
   addiert - die Zone reichte dadurch weit unter den Boden.
   =================================================================== */
(function example1_bug() {
  const canvas = document.getElementById("stage1");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  const platformY = 200;
  const rungTop = 80, rungBottom = 160;
  // FALSCH: hier wird die Kachelhöhe (24) UND zusätzlich noch einmal
  // eine ganze Kachelhöhe drauf addiert
  const ladder = { left: 80, right: 105, top: rungTop, bottom: rungBottom + 24 + 24 };

  let x = 92, y = rungTop, vy = 0, onLadder = false;
  const keys = {};
  window.addEventListener("keydown", (e) => { keys[e.code] = true; e.preventDefault(); });
  window.addEventListener("keyup", (e) => (keys[e.code] = false));

  let lastTime = 0;
  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    const inZone = x > ladder.left - 4 && x < ladder.right + 4 && y > ladder.top - 6 && y < ladder.bottom + 6;
    onLadder = inZone && !keys["ArrowLeft"] && !keys["ArrowRight"];

    if (onLadder) {
      vy = 0;
      if (keys["ArrowUp"]) y -= CLIMB_SPEED * dt;
      else if (keys["ArrowDown"]) y += CLIMB_SPEED * dt;
      y = Math.max(ladder.top, Math.min(ladder.bottom, y)); // die FALSCHE (zu große) Zone
    } else {
      if (keys["ArrowLeft"]) x -= 100 * dt;
      if (keys["ArrowRight"]) x += 100 * dt;
    }

    if (!onLadder) {
      vy += GRAVITY * dt;
      const nextY = y + vy * dt;
      if (nextY >= platformY && y <= platformY + 2 && vy >= 0) { y = platformY; vy = 0; }
      else { y = nextY; if (y > H + 40) { x = 92; y = rungTop; vy = 0; } }
    }

    drawLadderScene(ctx, W, H, platformY, ladder, x, y, onLadder);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  canvas.addEventListener("click", () => canvas.focus());
})();

/* ===================================================================
   Beispiel 2: die korrigierte Zone - bottom endet exakt auf
   Plattformhöhe.
   =================================================================== */
(function example2_fixed() {
  const canvas = document.getElementById("stage2");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  const platformY = 200;
  const rungTop = 80, rungBottom = 160;
  // RICHTIG: die Zone endet genau eine Sprossen-Distanz unter der
  // letzten Sprosse - exakt auf Plattformhöhe
  const ladder = { left: 80, right: 105, top: rungTop, bottom: rungBottom + 24 };

  let x = 92, y = rungTop, vy = 0, onLadder = false;
  const keys = {};
  window.addEventListener("keydown", (e) => { keys[e.code] = true; e.preventDefault(); });
  window.addEventListener("keyup", (e) => (keys[e.code] = false));

  let lastTime = 0;
  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    const inZone = x > ladder.left - 4 && x < ladder.right + 4 && y > ladder.top - 6 && y < ladder.bottom + 6;
    onLadder = inZone && !keys["ArrowLeft"] && !keys["ArrowRight"];

    if (onLadder) {
      vy = 0;
      if (keys["ArrowUp"]) y -= CLIMB_SPEED * dt;
      else if (keys["ArrowDown"]) y += CLIMB_SPEED * dt;
      y = Math.max(ladder.top, Math.min(ladder.bottom, y));
    } else {
      if (keys["ArrowLeft"]) x -= 100 * dt;
      if (keys["ArrowRight"]) x += 100 * dt;
    }

    if (!onLadder) {
      vy += GRAVITY * dt;
      const nextY = y + vy * dt;
      if (nextY >= platformY && y <= platformY + 2 && vy >= 0) { y = platformY; vy = 0; }
      else { y = nextY; if (y > H + 40) { x = 92; y = rungTop; vy = 0; } }
    }

    drawLadderScene(ctx, W, H, platformY, ladder, x, y, onLadder);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  canvas.addEventListener("click", () => canvas.focus());
})();

/* ===================================================================
   Beispiel 3: vollständige Integration - Leiter verbindet zwei
   Plattformen, freies Laufen/Springen/Klettern kombiniert.
   =================================================================== */
(function example3_full() {
  const canvas = document.getElementById("stage3");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  const platforms = [{ y: 200, x: 0, w: 200 }, { y: 90, x: 160, w: 200 }];
  const ladder = { left: 175, right: 200, top: 90, bottom: 200 };
  let x = 40, y = 190, vy = 0, onLadder = false, onGround = false;
  const keys = {};
  window.addEventListener("keydown", (e) => { keys[e.code] = true; e.preventDefault(); });
  window.addEventListener("keyup", (e) => (keys[e.code] = false));

  function findLanding(nextY) {
    let best = null;
    platforms.forEach((p) => {
      if (x > p.x && x < p.x + p.w && y <= p.y + 2 && nextY >= p.y) {
        if (!best || p.y < best.y) best = { y: p.y };
      }
    });
    return best;
  }

  let lastTime = 0;
  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    const inZone = x > ladder.left - 4 && x < ladder.right + 4 && y > ladder.top - 6 && y < ladder.bottom + 6;
    onLadder = inZone && !keys["ArrowLeft"] && !keys["ArrowRight"];

    if (onLadder) {
      vy = 0;
      if (keys["ArrowUp"]) y -= CLIMB_SPEED * dt;
      else if (keys["ArrowDown"]) y += CLIMB_SPEED * dt;
      y = Math.max(ladder.top, Math.min(ladder.bottom, y));
    } else {
      if (keys["ArrowLeft"]) x -= 130 * dt;
      if (keys["ArrowRight"]) x += 130 * dt;
      x = Math.max(10, Math.min(W - 10, x));
    }

    if (!onLadder) {
      if (keys["Space"] && onGround) { vy = -JUMP_SPEED; onGround = false; }
      vy += GRAVITY * dt;
      const nextY = y + vy * dt;
      const landing = findLanding(nextY);
      if (landing && vy >= 0) { y = landing.y; vy = 0; onGround = true; }
      else { y = nextY; onGround = false; if (y > H + 40) { x = 40; y = 190; vy = 0; } }
    } else {
      onGround = false;
    }

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#663300";
    platforms.forEach((p) => ctx.fillRect(p.x, p.y, p.w, 10));
    ctx.strokeStyle = "#845232";
    ctx.lineWidth = 2;
    for (let ry = ladder.top + 6; ry < ladder.bottom; ry += 10) {
      ctx.beginPath();
      ctx.moveTo(ladder.left + 4, ry);
      ctx.lineTo(ladder.right - 4, ry);
      ctx.stroke();
    }
    ctx.fillStyle = onLadder ? "#a78bfa" : "#5fe0c9";
    ctx.beginPath();
    ctx.arc(x, y - 6, 12, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  canvas.addEventListener("click", () => canvas.focus());
})();
