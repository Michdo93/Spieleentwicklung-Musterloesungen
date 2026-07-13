/**
 * Kapitel 14 - Gegner-KI: Kampf & Gegnertypen
 * Musterloesung
 *
 * Drei Beispiele: (1) Aggro-Bereich & Angriffsauswahl nach Abstand,
 * (2) vier Gegnertypen mit eigenen Faehigkeiten, (3) Friendly Fire
 * zwischen Gegnern - entspricht dem Entscheidungsbaum in
 * Enemy.update() plus ENEMY_TYPES/HP_BY_TYPE aus entities.js.
 */

const sheets = {};
["hero", "blue", "green", "red", "white"].forEach((n) => {
  sheets[n] = new Image();
  sheets[n].src = `assets/${n}.png`;
});
const ANCHOR_X = 30, ANCHOR_Y = 145, SPRITE_SCALE = 0.45;
function whenReady(fn) {
  const ready = () => Object.values(sheets).every((i) => i.complete && i.naturalWidth > 0);
  if (ready()) fn();
  else Object.values(sheets).forEach((i) => i.addEventListener("load", () => ready() && fn()));
}
function drawChar(ctx, name, x, y, facing = 1, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  const s = SPRITE_SCALE * scale;
  ctx.drawImage(sheets[name], 0, 0, 160, 150, -ANCHOR_X * s, -ANCHOR_Y * s, 160 * s, 150 * s);
  ctx.restore();
}

/* ===================================================================
   Beispiel 1: Aggro-Bereich & Angriffsauswahl - entspricht dem
   Entscheidungsbaum in Enemy.update(): nah = Nahkampf, mittel =
   Shuriken (falls vorhanden), nah-mittel = Schwert (falls vorhanden).
   =================================================================== */
(function example1_aggro() {
  const canvas = document.getElementById("stage1");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  let heroX = W / 2 + 120;
  const enemyX = W / 2 - 60;
  const enemyType = { canShuriken: true, canSword: true }; // White: kann beides

  function decide(dist) {
    if (dist < 40) return "Nahkampf (Hit/Kick)";
    if (dist < 260 && enemyType.canShuriken) return "Shuriken werfen";
    if (dist < 60 && enemyType.canSword) return "Schwert";
    return "ausser Reichweite - nur beobachten";
  }
  function draw() {
    const dist = Math.abs(heroX - enemyX);
    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(255,107,107,0.4)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(enemyX, 150, 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,184,77,0.4)";
    ctx.beginPath();
    ctx.arc(enemyX, 150, 260, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    whenReady(() => {
      drawChar(ctx, "hero", heroX, 150, heroX > enemyX ? 1 : -1);
      drawChar(ctx, "white", enemyX, 150, heroX > enemyX ? 1 : -1);
    });
    ctx.fillStyle = "#93a4b3";
    ctx.font = "13px monospace";
    ctx.fillText(`Abstand: ${dist.toFixed(0)}px  ->  ${decide(dist)}`, 14, 24);
  }
  canvas.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    heroX = Math.max(20, Math.min(W - 20, e.clientX - r.left));
    draw();
  });
  whenReady(draw);
})();

/* ===================================================================
   Beispiel 2: vier Gegnertypen, vier Faehigkeitsprofile - entspricht
   ENEMY_TYPES + HP_BY_TYPE aus entities.js.
   =================================================================== */
const ENEMY_TYPES = {
  Blue: { canShuriken: false, canSword: false, hp: 10 },
  Green: { canShuriken: true, canSword: false, hp: 20 },
  Red: { canShuriken: false, canSword: true, hp: 30 },
  White: { canShuriken: true, canSword: true, hp: 50 },
};

(function example2_types() {
  const canvas = document.getElementById("stage2");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  whenReady(() => {
    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    const names = Object.keys(ENEMY_TYPES);
    names.forEach((name, i) => {
      const x = 80 + i * 110;
      drawChar(ctx, name.toLowerCase(), x, 150, 1, 0.9);
      const def = ENEMY_TYPES[name];
      ctx.textAlign = "center";
      ctx.fillStyle = "#93a4b3";
      ctx.font = "12px monospace";
      ctx.fillText(name, x, 175);
      ctx.fillText(`${def.hp} HP`, x, 190);
      ctx.fillStyle = def.canShuriken ? "#ffd23f" : "#3a4657";
      ctx.fillText("Shuriken", x, 204);
      ctx.fillStyle = def.canSword ? "#cccccc" : "#3a4657";
      ctx.fillText("Schwert", x, 218);
      ctx.textAlign = "left";
    });
  });
})();

/* ===================================================================
   Beispiel 3: Friendly Fire - entspricht hitNearbyEnemies()/Projectile
   mit Werfer-Ausschluss: ein Wurf trifft "jeden ausser dem Werfer",
   also auch andere Gegner.
   =================================================================== */
(function example3_friendlyFire() {
  const canvas = document.getElementById("stage3");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  const thrower = { x: 60, y: 150 };
  const bystander = { x: 220, y: 150, hp: 30, type: "red" }; // steht im Weg
  const hero = { x: W - 60, y: 150 };
  let projectiles = [];

  function throwShuriken() {
    projectiles.push({ x: thrower.x + 20, y: 130, dir: 1 });
  }
  document.getElementById("btn-throw").addEventListener("click", throwShuriken);
  document.getElementById("reset-btn").addEventListener("click", () => (bystander.hp = 30));

  let lastTime = 0;
  function loop(now) {
    if (lastTime === 0) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    projectiles.forEach((p) => {
      p.x += p.dir * 480 * dt;
      // trifft JEDEN ausser dem Werfer - hier: den Bystander, der im
      // Weg steht, NICHT den Werfer selbst
      if (!p.dead && bystander.hp > 0 && Math.abs(p.x - bystander.x) < 20) {
        bystander.hp = Math.max(0, bystander.hp - 5);
        p.dead = true;
      }
    });
    projectiles = projectiles.filter((p) => !p.dead && p.x < W + 20);

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);
    whenReady(() => {
      drawChar(ctx, "green", thrower.x, thrower.y, 1);
      if (bystander.hp > 0) drawChar(ctx, bystander.type, bystander.x, bystander.y, 1);
      drawChar(ctx, "hero", hero.x, hero.y, -1);
    });
    ctx.fillStyle = "#5fe0c9";
    projectiles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "#93a4b3";
    ctx.font = "12px monospace";
    ctx.fillText(`Red-HP (Mitgegner): ${bystander.hp}/30`, 14, 24);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
