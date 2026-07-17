/**
 * Ninja Fight - Kapitel 2: Sprites zeichnen
 * Musterlösung (korrigiert)
 *
 * WICHTIGE KORREKTUR gegenüber der ersten Fassung dieses Kapitels:
 * Der Held wurde bislang in voller Zellgröße (160x150) gezeichnet und
 * beim Spiegeln um die Mitte des AUSGESCHNITTENEN Bereichs gedreht
 * (-CELL_W/2). Das ist falsch - die Figur selbst sitzt nicht zentriert
 * in ihrer Zelle (Platz für ausholende Frames wie Schwerthiebe). Die
 * Spiegelachse muss der tatsächliche "Fußpunkt" der Figur sein -
 * exakt CHARACTER_SHEET.anchorX/anchorY im fertigen Spiel. Außerdem
 * wird die Figur mit SPRITE_SCALE (0.45) auf ihre echte Anzeigegröße
 * heruntergerechnet, statt die volle Zellgröße zu verwenden.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const STAGE_W = canvas.width;
const STAGE_H = canvas.height;

const heroSheet = new Image();
heroSheet.src = "assets/img/sprites/hero.png";

const tileSheet = new Image();
tileSheet.src = "assets/img/sprites/tiles.png";

const CELL_W = 160;
const CELL_H = 150;

// entspricht CHARACTER_SHEET.anchorX/anchorY + SPRITE_SCALE in render.js:
// der "Fußpunkt" der Figur innerhalb ihrer Zelle, und die
// Anzeige-Skalierung gegenüber der nativen Sprite-Auflösung.
const ANCHOR_X = 30;
const ANCHOR_Y = 145;
const SPRITE_SCALE = 0.45;
const DRAW_W = CELL_W * SPRITE_SCALE; // 72px
const DRAW_H = CELL_H * SPRITE_SCALE; // 67.5px

const TILE_SHEET = {
  cellW: 42,
  cellH: 66,
  tiles: {
    Floor: { row: 0, w: 41, h: 21 },
  },
};

const FLOOR_Y = STAGE_H - 21;

// hero.x/hero.y sind ab jetzt der Fußpunkt der Figur auf der Bühne -
// nicht mehr die linke obere Ecke der Sprite-Zelle. Das entspricht
// genau der Bedeutung von Hero.x/Hero.y im fertigen Spiel.
const hero = {
  x: STAGE_W / 2,
  y: FLOOR_Y,
  facing: 1, // 1 = blickt nach rechts, -1 = blickt nach links
};

function drawTile(name, x, y) {
  const def = TILE_SHEET.tiles[name];
  const sx = (TILE_SHEET.cellW - def.w) / 2;
  const sy = def.row * TILE_SHEET.cellH + (TILE_SHEET.cellH - def.h) / 2;
  ctx.drawImage(tileSheet, sx, sy, def.w, def.h, x, y, def.w, def.h);
}

// Zeichnet den ersten Idle-Frame des Helden bei (x, y) = Fußpunkt.
// Die Spiegelachse (translate VOR scale) ist derselbe Fußpunkt, den
// wir auch im unveränderten Fall verwenden - dadurch bleibt die Figur
// beim Spiegeln exakt an derselben Stelle stehen, statt seitlich zu
// "springen".
function drawHero(x, y, facing) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.drawImage(
    heroSheet, 0, 0, CELL_W, CELL_H,
    -ANCHOR_X * SPRITE_SCALE, -ANCHOR_Y * SPRITE_SCALE, DRAW_W, DRAW_H
  );
  ctx.restore();
}

let lastTime = 0;

function update(dt) {
  // in Kapitel 2 bewegt sich noch nichts
}

function render() {
  ctx.fillStyle = "#bfe8ea";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);

  if (!tileSheet.complete || tileSheet.naturalWidth === 0) return;
  if (!heroSheet.complete || heroSheet.naturalWidth === 0) return;

  const floorY = FLOOR_Y;
  for (let x = 0; x < STAGE_W; x += 41) {
    drawTile("Floor", x, floorY);
  }

  // Zwei Helden nebeneinander: einmal normal, einmal gespiegelt - so
  // sieht man beide Blickrichtungen mit demselben Bildmaterial, jetzt
  // in der korrekten Größe und ohne Versatz beim Spiegeln.
  drawHero(hero.x - 90, hero.y, 1);
  drawHero(hero.x + 90, hero.y, -1);
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
