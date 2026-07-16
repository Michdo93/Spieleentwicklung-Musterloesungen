/**
 * Kapitel 17 - Menüs & Spielzustände
 * Musterlösung
 *
 * Drei Beispiele: (1) showScreen() - nur ein Bildschirm ist je aktiv,
 * (2) ein echter CSS-Spezifitäts-Bug aus der Entwicklung von Ninja
 * Fight, (3) ESC pausiert und setzt fort.
 */

/* ===================================================================
   Beispiel 1: showScreen() - entfernt "active" von ALLEN Bildschirmen,
   setzt es nur auf den gewünschten.
   =================================================================== */
(function example1_showScreen() {
  function showScreen(name) {
    document.querySelectorAll("#mock-frame-1 .mock-screen").forEach((s) => s.classList.remove("active"));
    const el = document.getElementById("mock-" + name);
    if (el) el.classList.add("active");
    document.getElementById("current-screen-label").textContent = `aktueller Bildschirm: "${name}"`;
  }
  ["start", "pause", "settings"].forEach((name) => {
    document.getElementById("btn-screen-" + name).addEventListener("click", () => showScreen(name));
  });
})();

/* ===================================================================
   Beispiel 2: der echte Bug - eine gemeinsame .screen-Basisklasse
   verdunkelte versehentlich auch den Spielbildschirm selbst, der
   während des Spiels über dem Canvas liegt. Der Fix: ein ID-Selektor
   (#screen-game) hat höhere Spezifität als die Klassenregel.
   =================================================================== */
(function example2_bug() {
  document.getElementById("btn-toggle-bug").addEventListener("click", () => {
    const frame = document.getElementById("mock-frame-2");
    frame.classList.toggle("bug-active");
    const buggy = frame.classList.contains("bug-active");
    document.getElementById("bug-status").textContent = buggy
      ? "FEHLERHAFT: #screen-game erbt den dunklen Hintergrund der Basisklasse .screen"
      : "KORRIGIERT: #screen-game { background: none; } überschreibt die Basisklasse gezielt";
  });
})();

/* ===================================================================
   Beispiel 3: ESC pausiert und setzt fort - echte Tastatursteuerung
   für Zustandswechsel, nicht nur Buttons.
   =================================================================== */
(function example3_esc() {
  let gameRunning = false;

  function startMockGame() {
    gameRunning = true;
    document.getElementById("mock-frame-3").classList.remove("paused");
    document.getElementById("esc-status").textContent = "Spiel läuft - ESC drücken zum Pausieren";
  }
  function toggleEscPause() {
    if (!gameRunning) return;
    const frame = document.getElementById("mock-frame-3");
    frame.classList.toggle("paused");
    const paused = frame.classList.contains("paused");
    document.getElementById("esc-status").textContent = paused
      ? "Pausiert - ESC oder 'Weiter' zum Fortsetzen"
      : "Spiel läuft - ESC drücken zum Pausieren";
  }

  document.getElementById("btn-start-game").addEventListener("click", startMockGame);
  document.getElementById("btn-resume").addEventListener("click", toggleEscPause);
  window.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
      toggleEscPause();
      e.preventDefault();
    }
  });
})();
