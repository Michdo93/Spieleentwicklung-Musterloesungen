/**
 * Ninja Fight - Kapitel 1: Canvas-Grundlagen & Game-Loop
 * Musterlösung
 *
 * Noch kein Sprung, keine Bewegung, keine Eingabe - nur das Fundament,
 * auf dem alle folgenden Kapitel aufbauen: das <canvas>, sein
 * Zeichenkontext und ein zeitbasierter Game-Loop, der den Helden als
 * Standbild auf die Bühne zeichnet.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const STAGE_W = canvas.width;
const STAGE_H = canvas.height;

// Das Spriteheet des Helden. Im fertigen Spiel liegt diese Zuordnung in
// spritedata.js - hier reicht uns vorerst die reine Bildgröße:
// 8 Spalten x 8 Zeilen, jede Zelle 160x150 Pixel, Zeile 0 = "Idle".
const heroSheet = new Image();
heroSheet.src = "assets/img/sprites/hero.png";

const CELL_W = 160;
const CELL_H = 150;

const hero = {
  x: STAGE_W / 2 - CELL_W / 2,
  y: STAGE_H / 2 - CELL_H / 2,
};

let lastTime = 0;

function update(dt) {
  // in Kapitel 1 bewegt sich noch nichts - update() existiert schon,
  // damit die Struktur ab jetzt für jedes weitere Kapitel gleich bleibt
}

function render() {
  ctx.fillStyle = "#bfe8ea";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);

  if (heroSheet.complete && heroSheet.naturalWidth > 0) {
    // Zeile 0, Spalte 0 des Spritesheets = erster Idle-Frame
    ctx.drawImage(
      heroSheet,
      0, 0, CELL_W, CELL_H,
      hero.x, hero.y, CELL_W, CELL_H
    );
  }
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
