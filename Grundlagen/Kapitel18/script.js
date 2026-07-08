/**
 * Kapitel 18 - Highscores & Levelfortschritt
 * Musterloesung
 *
 * Drei letzte Bausteine: Ergebnisse dauerhaft speichern (localStorage),
 * die Bedingungen fuer Sieg und Niederlage, und der Unterschied
 * zwischen += und = bei einer Formel, die ueber mehrere Level gilt.
 */

// === 1. Highscores mit localStorage ===
const HIGHSCORE_KEY = "grundlagen-ch18-highscores";

function loadHighscoreList() {
  try {
    return JSON.parse(localStorage.getItem(HIGHSCORE_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveHighscoreEntry(name, points) {
  const list = loadHighscoreList();
  list.push({ name: name || "Anonymous", points });
  // absteigend sortieren, dann auf die Top 10 begrenzen - localStorage
  // hat keine eingebaute Sortierung oder Groessenbegrenzung, das
  // erledigen wir selbst vor jedem Speichern.
  list.sort((a, b) => b.points - a.points);
  localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(list.slice(0, 10)));
}

function renderHighscoreList() {
  const list = loadHighscoreList();
  const el = document.getElementById("highscore-list");
  if (list.length === 0) {
    el.textContent = "Noch keine Eintraege.";
    return;
  }
  el.textContent = list.map((e, i) => `${i + 1}. ${e.name} - ${e.points}`).join("\n");
}

document.getElementById("btn-save").addEventListener("click", () => {
  const name = document.getElementById("name-input").value;
  const points = Number(document.getElementById("points-input").value) || 0;
  saveHighscoreEntry(name, points);
  renderHighscoreList();
});

renderHighscoreList();

// === 2. Sieg- oder Niederlage-Bedingungen ===
// Ein Zeitablauf ist NICHT automatisch eine Niederlage - er ist nur
// dann eine, wenn zusaetzlich noch Gegner uebrig sind. Sind alle
// Gegner besiegt, zaehlt Zeitablauf nicht gegen den Spieler.
function evaluateOutcome(hp, timeLeft, enemiesLeft, levelNum, maxLevels) {
  if (hp <= 0) return "Niederlage - keine Lebensenergie mehr";
  if (timeLeft <= 0 && enemiesLeft > 0) return "Niederlage - Zeit abgelaufen, Gegner uebrig";
  if (levelNum >= maxLevels && enemiesLeft === 0) return "Sieg - alle Level geschafft!";
  return "Spiel laeuft weiter";
}

function updateOutcome() {
  const hp = Number(document.getElementById("hp").value);
  const time = Number(document.getElementById("time").value);
  const enemiesLeft = Number(document.getElementById("enemiesLeft").value);
  const levelNum = Number(document.getElementById("levelNum").value);
  document.getElementById("result").textContent = evaluateOutcome(hp, time, enemiesLeft, levelNum, 10);
}
["hp", "time", "enemiesLeft", "levelNum"].forEach((id) => {
  document.getElementById(id).addEventListener("input", updateOutcome);
});
updateOutcome();

// === 3. += statt = bei kumulativen Werten ===
let lifeEnergyWrong = 20;
let lifeEnergyRight = 20;
let levelNum = 1;

function renderCumulative() {
  document.getElementById("cumulative").textContent =
    `Level ${levelNum}  |  falsch (=): ${lifeEnergyWrong}  |  richtig (+=): ${lifeEnergyRight}`;
}
renderCumulative();

document.getElementById("btn-nextlevel").addEventListener("click", () => {
  levelNum++;
  lifeEnergyWrong = 10 * levelNum;  // FALSCH: ueberschreibt den bisherigen Stand jedes Mal
  lifeEnergyRight += 10 * levelNum; // richtig: baut auf dem vorherigen Stand auf
  renderCumulative();
});
document.getElementById("btn-reset").addEventListener("click", () => {
  levelNum = 1;
  lifeEnergyWrong = 20;
  lifeEnergyRight = 20;
  renderCumulative();
});
