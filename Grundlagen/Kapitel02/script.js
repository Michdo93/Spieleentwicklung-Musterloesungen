/**
 * Kapitel 2 - Sprites zeichnen
 * Musterloesung
 *
 * Zeigt die drei wichtigsten Formen von drawImage() an einem echten
 * Sprite-Sheet: das ganze Bild, ein ausgeschnittener Frame daraus, und
 * derselbe Frame gespiegelt (fuer die andere Blickrichtung).
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

const heroSheet = new Image();
heroSheet.src = "assets/hero.png";

// Kenngroessen des Sheets: 8 Spalten, 8 Zeilen, jede Zelle 160x150px.
// Zeile 0 = Idle, Spalte 0 = erster Frame.
const CELL_W = 160;
const CELL_H = 150;

function clearStage() {
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);
}

function label(text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = "12px monospace";
  ctx.fillText(text, x, y);
}

function draw() {
  clearStage();

  // --- Form 1: drawImage(img, x, y, w, h) - das GANZE Sheet, verkleinert ---
  // Das Original ist 1280x1200px, viel zu gross fuers Canvas. Wir zeichnen
  // es hier absichtlich verkleinert, nur zur Anschauung.
  ctx.drawImage(heroSheet, 0, 0, heroSheet.width, heroSheet.height, 10, 10, 140, 131);
  ctx.strokeStyle = "#ffb84d";
  ctx.strokeRect(10, 10, 140, 131);
  label("ganzes Sheet", 10, 158, "#ffb84d");

  // --- Form 2: drawImage(img, sx,sy,sw,sh, dx,dy,dw,dh) ---
  // Quellrechteck (sx,sy,sw,sh) schneidet nur eine Zelle aus dem Sheet
  // aus: Zeile 0 (Idle), Spalte 0 (erster Frame).
  const sx = 0, sy = 0;
  ctx.drawImage(heroSheet, sx, sy, CELL_W, CELL_H, 190, 10, CELL_W, CELL_H);
  ctx.strokeStyle = "#5fe0c9";
  ctx.strokeRect(190, 10, CELL_W, CELL_H);
  label("ein Frame", 190, 178, "#5fe0c9");

  // --- Form 3: dieselbe Zelle gespiegelt ---
  // Trick: zuerst zum gewuenschten Mittelpunkt verschieben (translate),
  // DANN spiegeln (scale(-1, 1)) und relativ zu (0,0) zeichnen. Wuerde man
  // zuerst spiegeln und dann verschieben, waere die Position falsch.
  ctx.save();
  ctx.translate(380 + CELL_W / 2, 10);
  ctx.scale(-1, 1);
  ctx.drawImage(heroSheet, sx, sy, CELL_W, CELL_H, -CELL_W / 2, 0, CELL_W, CELL_H);
  ctx.restore();
  ctx.strokeStyle = "#a78bfa";
  ctx.strokeRect(380, 10, CELL_W, CELL_H);
  label("gespiegelt", 380, 178, "#a78bfa");
}

heroSheet.addEventListener("load", draw);
