/**
 * Kapitel 4 - Tastatur- & Maus-Eingabe
 * Musterloesung
 *
 * Vier Beispiele: (1) rohe Events beobachten, (2) das Key-State-Objekt
 * fuer fluessige Bewegung, (3) Maus-Klick-Trefftest, (4) beides
 * kombiniert - genau der Weg, den auch GameManager.keys in Ninja
 * Fight gegangen ist.
 */

/* ===================================================================
   Beispiel 1: Rohe Tastatur-Events beobachten
   =================================================================== */
(function example1_rawEvents() {
  const canvas = document.getElementById("stage1");
  const ctx = canvas.getContext("2d");
  const log = document.getElementById("log1");

  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#93a4b3";
  ctx.font = "14px monospace";
  ctx.fillText("Tippe eine beliebige Taste ...", 20, canvas.height / 2);

  function trace(msg) {
    log.textContent = msg + "\n" + log.textContent;
  }

  window.addEventListener("keydown", (e) => {
    trace(`keydown:  key="${e.key}"  code="${e.code}"`);
  });
  window.addEventListener("keyup", (e) => {
    trace(`keyup:    key="${e.key}"  code="${e.code}"`);
  });
})();

/* ===================================================================
   Beispiel 2: Key-State-Objekt - exakt GameManager.keys in Ninja
   Fight. keydown setzt ein Flag auf true, keyup wieder auf false; der
   Game-Loop fragt die Flags jeden Frame ab, statt auf Events zu
   reagieren.
   =================================================================== */
(function example2_keyState() {
  const canvas = document.getElementById("stage2");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

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

  let x = W / 2, y = H / 2;
  const SPEED = 180;
  let lastTime = 0;

  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    // der Loop fragt nur die Flags ab - er weiss nichts von Events
    if (keys.left) x -= SPEED * dt;
    if (keys.right) x += SPEED * dt;
    if (keys.up) y -= SPEED * dt;
    if (keys.down) y += SPEED * dt;
    x = Math.max(20, Math.min(W - 20, x));
    y = Math.max(20, Math.min(H - 20, y));

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#5fe0c9";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#93a4b3";
    ctx.font = "13px monospace";
    ctx.fillText(
      `keys = { left:${keys.left}, right:${keys.right}, up:${keys.up}, down:${keys.down} }`,
      14, 24
    );

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  canvas.addEventListener("click", () => canvas.focus());
})();

/* ===================================================================
   Beispiel 3: Maus-Klicks erkennen - derselbe Rechteck-Trefftest wie
   spaeter bei der Charakter-Auswahl per Klick oder bei jedem
   Menue-Button.
   =================================================================== */
(function example3_click() {
  const canvas = document.getElementById("stage3");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const log = document.getElementById("log3");

  const box = { x: W / 2 - 60, y: H / 2 - 40, w: 120, h: 80 };

  function draw(hover) {
    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = hover ? "#ffb84d" : "#5fe0c9";
    ctx.fillRect(box.x, box.y, box.w, box.h);
    ctx.strokeStyle = "#0a0e14";
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.w, box.h);
    ctx.fillStyle = "#0a0e14";
    ctx.font = "13px monospace";
    ctx.fillText("Klick mich", box.x + 18, box.y + box.h / 2 + 4);
  }
  draw(false);

  // WICHTIG: e.clientX/Y sind Bildschirmkoordinaten - man muss die
  // Position des Canvas auf der Seite abziehen, sonst passt der
  // Trefftest nicht, sobald das Canvas nicht bei (0,0) beginnt.
  function toCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
  function isInside(p) {
    return p.x > box.x && p.x < box.x + box.w && p.y > box.y && p.y < box.y + box.h;
  }

  canvas.addEventListener("mousemove", (e) => draw(isInside(toCanvasCoords(e))));
  canvas.addEventListener("click", (e) => {
    const p = toCanvasCoords(e);
    const hit = isInside(p);
    log.textContent = `Klick bei (${p.x.toFixed(0)}, ${p.y.toFixed(0)}) - ${hit ? "GETROFFEN" : "daneben"}\n` + log.textContent;
  });
})();

/* ===================================================================
   Beispiel 4: Kombiniert - Key-State-Steuerung + Klick-Erkennung
   =================================================================== */
(function example4_combined() {
  const canvas = document.getElementById("stage4");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  const SPEED = 200;
  const SIZE = 50;
  const square = { x: W / 2 - SIZE / 2, y: H / 2 - SIZE / 2 };
  const COLORS = ["#a78bfa", "#5fe0c9", "#ffb84d", "#ff6b9d"];
  let colorIndex = 0;

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

  canvas.addEventListener("click", (e) => {
    canvas.focus();
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const hit = mx >= square.x && mx <= square.x + SIZE && my >= square.y && my <= square.y + SIZE;
    if (hit) {
      colorIndex = (colorIndex + 1) % COLORS.length;
    }
  });

  let lastTime = 0;
  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (keys.left) square.x -= SPEED * dt;
    if (keys.right) square.x += SPEED * dt;
    if (keys.up) square.y -= SPEED * dt;
    if (keys.down) square.y += SPEED * dt;
    square.x = Math.max(0, Math.min(W - SIZE, square.x));
    square.y = Math.max(0, Math.min(H - SIZE, square.y));

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = COLORS[colorIndex];
    ctx.fillRect(square.x, square.y, SIZE, SIZE);
    ctx.strokeStyle = "#0a0e14";
    ctx.lineWidth = 2;
    ctx.strokeRect(square.x, square.y, SIZE, SIZE);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
