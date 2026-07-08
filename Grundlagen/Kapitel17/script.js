/**
 * Kapitel 17 - Menüs & Spielzustände
 * Musterloesung
 *
 * showScreen(name): entfernt "active" von ALLEN Bildschirmen und setzt
 * es nur auf den gewuenschten - nie sind zwei Bildschirme gleichzeitig
 * sichtbar. ESC-Taste und Buttons loesen denselben Zustandswechsel aus.
 */

function showScreen(name) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  const el = document.getElementById("screen-" + name);
  if (el) el.classList.add("active");
}

document.getElementById("btn-play").addEventListener("click", () => showScreen("game"));
document.getElementById("btn-pause").addEventListener("click", () => showScreen("pause"));
document.getElementById("btn-resume").addEventListener("click", () => showScreen("game"));

// Tastatur und Maus loesen denselben Zustandswechsel aus - die
// eigentliche Logik (showScreen) weiss nichts davon, WIE sie
// aufgerufen wurde.
window.addEventListener("keydown", (e) => {
  if (e.code !== "Escape") return;
  const gameActive = document.getElementById("screen-game").classList.contains("active");
  showScreen(gameActive ? "pause" : "game");
});

// Bug-Modus: entfernt die Klasse, die den Fix ermoeglicht (siehe CSS),
// und reproduziert damit exakt den urspruenglichen Fehler.
document.getElementById("bug-toggle").addEventListener("change", (e) => {
  document.body.classList.toggle("show-bug", e.target.checked);
});

showScreen("start");
