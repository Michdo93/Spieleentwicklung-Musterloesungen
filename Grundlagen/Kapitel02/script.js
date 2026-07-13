/**
 * Kapitel 2 - Sprites zeichnen
 * Musterloesung
 *
 * Drei Beispiele: (1) die Grundformen von drawImage(), (2) der
 * Spiegel-Achsen-Fehler und seine Korrektur, (3) Skalierung und
 * Position ueber Regler statt fest im Code.
 */

const heroSheet = new Image();
heroSheet.src = "assets/hero.png";
const CELL_W = 160;
const CELL_H = 150;

heroSheet.addEventListener("load", () => {
  runExample1();
  runExample2();
  runExample3();
});

/* ===================================================================
   Beispiel 1: drawImage() - ganzes Sheet vs. ein ausgeschnittener Frame
   =================================================================== */
function runExample1() {
  const canvas = document.getElementById("stage1");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);

  // Form 1: das GANZE Sheet, verkleinert auf eine feste Zielgroesse
  ctx.drawImage(heroSheet, 0, 0, heroSheet.width, heroSheet.height, 10, 10, 160, 150);
  ctx.strokeStyle = "#ffb84d";
  ctx.strokeRect(10, 10, 160, 150);
  ctx.fillStyle = "#ffb84d";
  ctx.font = "12px monospace";
  ctx.fillText("ganzes Sheet", 10, 178);

  // Form 2: EIN Frame ausschneiden - Zeile 0 (Idle), Spalte 0
  ctx.drawImage(heroSheet, 0, 0, CELL_W, CELL_H, 280, 10, CELL_W, CELL_H);
  ctx.strokeStyle = "#5fe0c9";
  ctx.strokeRect(280, 10, CELL_W, CELL_H);
  ctx.fillStyle = "#5fe0c9";
  ctx.fillText("ein Frame (Zeile 0, Spalte 0)", 280, 178);
}

/* ===================================================================
   Beispiel 2: Spiegeln - falsch vs. richtig
   =================================================================== */
function runExample2() {
  const canvas = document.getElementById("stage2");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);

  const scale = 0.7;
  const dw = CELL_W * scale;
  const dh = CELL_H * scale;

  // FEHLER-URSACHE: Der ausgeschnittene Frame (160x150) ist NICHT
  // symmetrisch um die Spielfigur herum - links und rechts vom Koerper
  // ist unterschiedlich viel Platz, damit auch Frames mit ausholenden
  // Bewegungen (Schwert, Tritt) in dieselbe Zellgroesse passen. Die
  // Mitte des ausgeschnittenen Bereichs (CELL_W/2) ist deshalb NICHT
  // dieselbe Stelle wie die Mitte der Figur selbst.
  //
  // Der echte "Fusspunkt" der Figur innerhalb der Zelle - identisch zu
  // CHARACTER_SHEET.anchorX/anchorY im fertigen Spiel:
  const ANCHOR_X = 30;
  const ANCHOR_Y = 145;

  const groundY = 195;
  const cols = [
    { cx: 90, label: "unveraendert", mirror: false, wrong: false },
    { cx: 280, label: "falsch gespiegelt", mirror: true, wrong: true },
    { cx: 470, label: "richtig gespiegelt", mirror: true, wrong: false },
  ];

  cols.forEach((col) => {
    // Fadenkreuz: zeigt, wo die Figur eigentlich stehen SOLL
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(col.cx, 5);
    ctx.lineTo(col.cx, H - 30);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.save();
    ctx.translate(col.cx, groundY);
    if (col.mirror) ctx.scale(-1, 1);

    if (!col.mirror) {
      // unveraendert: Achse ist automatisch korrekt, da nicht gespiegelt
      ctx.drawImage(heroSheet, 0, 0, CELL_W, CELL_H,
        -ANCHOR_X * scale, -ANCHOR_Y * scale, dw, dh);
    } else if (col.wrong) {
      // FALSCH: Spiegelachse = Mitte des AUSGESCHNITTENEN Bereichs
      ctx.drawImage(heroSheet, 0, 0, CELL_W, CELL_H,
        -dw / 2, -ANCHOR_Y * scale, dw, dh);
    } else {
      // RICHTIG: Spiegelachse = derselbe Fusspunkt wie im unveraenderten Fall
      ctx.drawImage(heroSheet, 0, 0, CELL_W, CELL_H,
        -ANCHOR_X * scale, -ANCHOR_Y * scale, dw, dh);
    }
    ctx.restore();

    ctx.fillStyle = col.wrong ? "#ff6b9d" : "#93a4b3";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(col.label, col.cx, H - 10);
    ctx.textAlign = "left";
  });
}

/* ===================================================================
   Beispiel 3: Skalierung und Position per Regler (statt fest im Code)
   =================================================================== */
function runExample3() {
  const canvas = document.getElementById("stage3");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  const ANCHOR_X = 30;
  const ANCHOR_Y = 145;

  const scaleSlider = document.getElementById("scale-slider");
  const posxSlider = document.getElementById("posx-slider");
  const posySlider = document.getElementById("posy-slider");
  const scaleLabel = document.getElementById("scale-value");

  function render() {
    const scale = Number(scaleSlider.value) / 100;
    const x = Number(posxSlider.value);
    const y = Number(posySlider.value);
    scaleLabel.textContent = Math.round(scale * 100) + "%";

    ctx.fillStyle = "#0b1a24";
    ctx.fillRect(0, 0, W, H);

    const dw = CELL_W * scale;
    const dh = CELL_H * scale;

    ctx.save();
    ctx.translate(x, y);
    ctx.drawImage(heroSheet, 0, 0, CELL_W, CELL_H,
      -ANCHOR_X * scale, -ANCHOR_Y * scale, dw, dh);
    ctx.restore();
  }

  [scaleSlider, posxSlider, posySlider].forEach((el) =>
    el.addEventListener("input", render)
  );
  render();
}
