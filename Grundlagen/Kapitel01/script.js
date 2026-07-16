/**
 * Kapitel 1 - Canvas-Grundlagen & Game-Loop
 * Musterlösung
 *
 * Drei Beispiele, die parallel und unabhängig voneinander laufen -
 * jedes auf seinem eigenen <canvas>. Zusammen zeigen sie den Weg vom
 * Standbild zum zeitbasierten Game-Loop, wie er in Ninja Fight
 * (GameManager.loop()) tatsächlich verwendet wird.
 */

/* ===================================================================
   Beispiel 1: Statisches Zeichnen - kein Loop, nur ein einziger Aufruf
   =================================================================== */
(function example1_static() {
  const canvas = document.getElementById("stage-static");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#5fe0c9";
  ctx.fillRect(80, 70, 60, 60);
  ctx.strokeStyle = "#0a0e14";
  ctx.lineWidth = 2;
  ctx.strokeRect(80, 70, 60, 60);

  // Das war's - es gibt keinen weiteren Aufruf, also bleibt das Bild
  // für immer genau so stehen, wie es hier einmal gezeichnet wurde.
})();

/* ===================================================================
   Beispiel 2: Naiver Loop - ein fester Pixel-Schritt pro Frame.
   Das Problem: Die Geschwindigkeit hängt von der Bildrate ab. Auf
   einem 30-Hz-Bildschirm wäre das Quadrat nur halb so schnell wie
   bei 60 Hz.
   =================================================================== */
(function example2_naive() {
  const canvas = document.getElementById("stage-naive");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const hint = document.getElementById("hint-naive");
  hint.textContent = "square.x += 2 pro Frame - bei 60fps doppelt so schnell wie bei 30fps. Genau das Problem, das Beispiel 3 löst.";

  let x = 40;

  function frame() {
    x += 2; // fester Schritt, unabhängig von der tatsächlich vergangenen Zeit
    if (x > W - 60) x = 40;

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#ffb84d";
    ctx.fillRect(x, 70, 60, 60);
    ctx.strokeStyle = "#0a0e14";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, 70, 60, 60);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* ===================================================================
   Beispiel 3: Zeitbasierter Loop - dieselbe Struktur wie in Ninja
   Fight (GameManager.loop): Zeitdifferenz seit dem letzten Frame
   berechnen, Bewegung mit dieser Differenz (dt) statt mit einem
   festen Wert skalieren. Läuft auf jedem Bildschirm gleich schnell.
   =================================================================== */
(function example3_timed() {
  const canvas = document.getElementById("stage-timed");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const hint = document.getElementById("hint-timed");
  hint.textContent = "square.x += SPEED * dt - dieselbe Struktur wie GameManager.loop() in Ninja Fight. Läuft bei jeder Bildrate gleich schnell.";

  const SPEED = 140; // Pixel pro Sekunde, nicht pro Frame
  let x = 40;
  let lastTime = 0;

  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05); // Sekunden seit letztem Frame
    lastTime = now;

    x += SPEED * dt;
    if (x > W - 60) x = 40;

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#a78bfa";
    ctx.fillRect(x, 70, 60, 60);
    ctx.strokeStyle = "#0a0e14";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, 70, 60, 60);
    ctx.fillStyle = "#93a4b3";
    ctx.font = "13px monospace";
    ctx.fillText(`dt = ${dt.toFixed(4)}s`, 14, 24);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
