/**
 * Kapitel 18 - Highscores & Levelfortschritt
 * Musterloesung
 *
 * Drei Beispiele: (1) Highscores mit localStorage, (2) Sieg- oder
 * Niederlage-Bedingungen, (3) kumulative Lebenspunkte ueber mehrere
 * Level hinweg.
 */

/* ===================================================================
   Beispiel 1: Highscores mit localStorage
   =================================================================== */
const HIGHSCORE_KEY = "grundlagen-ch18-highscores";

function loadHighscores() {
  try { return JSON.parse(localStorage.getItem(HIGHSCORE_KEY) || "[]"); }
  catch (e) { return []; }
}
function saveHighscore(name, points, level) {
  const list = loadHighscores();
  list.push({ name: name || "Anonymous", points, level });
  list.sort((a, b) => b.points - a.points);
  localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(list.slice(0, 10)));
}
function renderHighscores() {
  const list = loadHighscores();
  const el = document.getElementById("highscore-list");
  el.textContent = list.length === 0
    ? "Noch keine Eintraege."
    : list.map((e, i) => `${i + 1}. ${e.name} - ${e.points} Punkte (Level ${e.level})`).join("\n");
}
document.getElementById("btn-save-score").addEventListener("click", () => {
  const name = document.getElementById("score-name").value.trim() || "Spieler";
  const points = Math.floor(Math.random() * 50) + 1;
  const level = Math.floor(Math.random() * 10) + 1;
  saveHighscore(name, points, level);
  renderHighscores();
});
document.getElementById("btn-clear-scores").addEventListener("click", () => {
  localStorage.removeItem(HIGHSCORE_KEY);
  renderHighscores();
});
renderHighscores();

/* ===================================================================
   Beispiel 2: Sieg oder Niederlage? - entspricht winGame() vs.
   endGame() in GameManager. Ein Zeitablauf ist nur DANN eine
   Niederlage, wenn zusaetzlich noch Gegner uebrig sind.
   =================================================================== */
function evaluateOutcome(levelNum, maxLevels, heroAlive, enemiesRemaining, timeUp) {
  if (!heroAlive) return { won: false, reason: "Der Held ist gestorben." };
  if (timeUp && enemiesRemaining > 0) return { won: false, reason: "Zeit abgelaufen, aber noch Gegner uebrig." };
  if (levelNum >= maxLevels) return { won: true, reason: "Alle Level ohne Tod abgeschlossen!" };
  return { won: null, reason: "Spiel laeuft noch weiter." };
}
function updateOutcomeDisplay() {
  const levelNum = Number(document.getElementById("sim-level").value);
  const heroAlive = document.getElementById("sim-alive").checked;
  const enemiesRemaining = Number(document.getElementById("sim-enemies").value);
  const timeUp = document.getElementById("sim-timeup").checked;
  const result = evaluateOutcome(levelNum, 10, heroAlive, enemiesRemaining, timeUp);
  const el = document.getElementById("outcome-display");
  el.textContent = result.won === true ? `SIEG - ${result.reason}` : result.won === false ? `NIEDERLAGE - ${result.reason}` : `Spiel laeuft - ${result.reason}`;
  el.style.color = result.won === true ? "#5fe0c9" : result.won === false ? "#ff6b6b" : "#93a4b3";
}
["sim-level", "sim-alive", "sim-enemies", "sim-timeup"].forEach((id) =>
  document.getElementById(id).addEventListener("input", updateOutcomeDisplay)
);
updateOutcomeDisplay();

/* ===================================================================
   Beispiel 3: kumulative Lebenspunkte ueber Level - entspricht
   this.lifeEnergy += 10 * levelNum in nextLevel(). += statt = ist
   hier der entscheidende Unterschied.
   =================================================================== */
let lifeEnergy = 0, levelNum = 0;
function nextLevel() {
  levelNum++;
  lifeEnergy += 10 * levelNum; // aufaddieren, NICHT zuruecksetzen
  logLife(`Level ${levelNum}: +${10 * levelNum} -> Lebensenergie insgesamt: ${lifeEnergy}`);
}
function takeDamage() {
  lifeEnergy = Math.max(0, lifeEnergy - 7);
  logLife(`Schaden genommen (-7) -> Lebensenergie: ${lifeEnergy}`);
}
function logLife(msg) {
  const el = document.getElementById("life-log");
  el.textContent = msg + "\n" + el.textContent;
}
document.getElementById("btn-next-level").addEventListener("click", nextLevel);
document.getElementById("btn-take-damage").addEventListener("click", takeDamage);
