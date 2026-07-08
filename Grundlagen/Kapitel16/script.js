/**
 * Kapitel 16 - HUD & Spielstatus
 * Musterloesung
 *
 * Ein Lebensbalken ist im Kern nur ein zweites, proportional skaliertes
 * Rechteck ueber einem Hintergrundrechteck. Die eigentliche Arbeit ist,
 * den richtigen Abstand ueber dem Kopf der Figur zu finden - und das
 * DOM-HUD zuverlaessig aktuell zu halten.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

const GROUND_Y = H - 60;
const SIZE = 30;

// drawHealthBar(): ein Hintergrundrechteck (dunkel, mit kleinem Rand)
// plus ein zweites Rechteck, dessen Breite proportional zu hp/maxHp
// skaliert - mehr steckt nicht dahinter.
function drawHealthBar(ctx, x, y, hp, maxHp) {
  const w = 30, h = 4;
  const pct = Math.max(0, hp / maxHp);
  ctx.save();
  ctx.fillStyle = "rgba(5,7,10,0.7)";
  ctx.fillRect(x - w / 2 - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = "#3a1010";
  ctx.fillRect(x - w / 2, y, w, h);
  ctx.fillStyle = pct > 0.5 ? "#5fe07a" : pct > 0.25 ? "#ffb84d" : "#ff5555";
  ctx.fillRect(x - w / 2, y, w * pct, h);
  ctx.restore();
}

const enemy = {
  x: 100,
  hp: 7,
  maxHp: 10,
  dir: 1,
};

let points = 0;
let elapsed = 0;

function updateHudText() {
  // JEDEN Frame aktualisieren ist robuster, als es nur an einzelnen
  // Stellen (z.B. nur beim Punktezuwachs) zu tun - eine vergessene
  // Stelle wuerde sonst kurzzeitig einen falschen Wert anzeigen.
  document.getElementById("hud-life").textContent = `❤ 10`;
  document.getElementById("hud-points").textContent = `Punkte: ${points}`;
  const m = Math.floor(elapsed / 60);
  const s = Math.floor(elapsed % 60);
  document.getElementById("hud-time").textContent = `${m}:${String(s).padStart(2, "0")}`;
}

let lastTime = 0;

function update(dt) {
  elapsed += dt;
  points += Math.floor(dt * 10); // steigt kontinuierlich, nur zur Anschauung

  enemy.x += enemy.dir * 60 * dt;
  if (enemy.x < 60 || enemy.x > W - 60) enemy.dir *= -1;
}

function render() {
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#663300";
  ctx.fillRect(0, GROUND_Y + SIZE, W, 4);

  ctx.fillStyle = "#ffb84d";
  ctx.fillRect(enemy.x - SIZE / 2, GROUND_Y, SIZE, SIZE);

  // Der Balken sitzt ueber dem sichtbaren Kopf der Figur - bei einem
  // 30px hohen Rechteck reichen wenige Pixel Abstand. Bei einem echten
  // Sprite (siehe Teil B) ist dieser Abstand deutlich groesser, weil um
  // die eigentliche Figur herum viel leerer/transparenter Raum liegt.
  drawHealthBar(ctx, enemy.x, GROUND_Y - 10, enemy.hp, enemy.maxHp);

  updateHudText();
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
