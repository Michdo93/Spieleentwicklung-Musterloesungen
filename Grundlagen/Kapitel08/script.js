/**
 * Kapitel 8 - Hindernisse & Gefahren
 * Musterloesung
 *
 * checkHazards(): nicht jedes auffaellige Level-Element ist gefaehrlich
 * (Wasser sieht gefaehrlich aus, ist aber nur eine normale Plattform),
 * und kontinuierlicher Schaden braucht eine Abklingzeit (invulnTimer) -
 * sonst wuerde ein 60fps-Loop auch 60 Treffer pro Sekunde verursachen.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

const SPEED = 160;
const SIZE = 26;
const GROUND_Y = H - 50;

// Zonen im Level. "Water" ist bewusst KEINE Gefahr - nur zur Anschauung,
// dass nicht jedes auffaellige Element automatisch schadet.
const zones = [
  { type: "Water", x: 40, w: 100, color: "#3b82c4" },
  { type: "Flame", x: 220, w: 60, color: "#ffb84d" },
  { type: "Knives", x: 360, w: 60, color: "#93a4b3" },
];

// Schadenswert und Abklingzeit je Gefahrentyp. Neue Gefahren lassen sich
// spaeter mit minimalem Zusatzcode einfuehren, sobald dieses Grundmuster
// (Schaden + Abklingzeit) einmal steht.
const HAZARDS = {
  Flame: { damage: 1, cooldown: 0.6 },
  Knives: { damage: 3, cooldown: 0.6 },
};

const player = {
  x: 20,
  hp: 10,
  invulnTimer: 0,
};

const keys = { left: false, right: false };
window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;
});
window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
});

// Prueft, ob die Spielfigur gerade in einer Gefahrenzone steht. WICHTIG:
// erst pruefen (und ggf. Schaden zufuegen), DANN am Ende des Frames den
// Timer runterzaehlen - nicht umgekehrt.
function checkHazards(dt) {
  if (player.invulnTimer <= 0) {
    zones.forEach((zone) => {
      const def = HAZARDS[zone.type];
      if (!def) return; // z.B. "Water" hat keinen Eintrag in HAZARDS -> keine Gefahr

      const overlapping = player.x + SIZE > zone.x && player.x < zone.x + zone.w;
      if (overlapping) {
        player.hp = Math.max(0, player.hp - def.damage);
        player.invulnTimer = def.cooldown;
      }
    });
  }

  if (player.invulnTimer > 0) {
    player.invulnTimer -= dt;
  }
}

let lastTime = 0;

function update(dt) {
  if (keys.left) player.x -= SPEED * dt;
  if (keys.right) player.x += SPEED * dt;
  player.x = Math.max(0, Math.min(W - SIZE, player.x));

  checkHazards(dt);
}

function render() {
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#663300";
  ctx.fillRect(0, GROUND_Y + SIZE, W, 4);

  zones.forEach((zone) => {
    ctx.fillStyle = zone.color;
    ctx.fillRect(zone.x, GROUND_Y, zone.w, SIZE);
  });

  // waehrend der Unverwundbarkeit blinkt die Figur leicht, damit man
  // sieht, dass gerade kein weiterer Treffer registriert wird
  const flashing = player.invulnTimer > 0 && Math.floor(player.invulnTimer * 10) % 2 === 0;
  ctx.fillStyle = flashing ? "#ffffff" : "#a78bfa";
  ctx.fillRect(player.x, GROUND_Y, SIZE, SIZE);

  ctx.fillStyle = "#93a4b3";
  ctx.font = "14px monospace";
  ctx.fillText(`HP: ${player.hp} / 10`, 14, 24);
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
