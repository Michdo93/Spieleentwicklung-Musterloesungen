/**
 * Kapitel 15 - Sound & Musik
 * Musterlösung
 *
 * SoundController bündelt Musik und Soundeffekte an einem Ort: sich
 * gegenseitig ausschließende Musikstücke, wiederholt auslösbare
 * Soundeffekte, und eine gemeinsame Lautstärke für alles zusammen.
 */

class SoundController {
  constructor() {
    this.menuMusic = new Audio("assets/Game-Menu.mp3");
    this.gameMusic = new Audio("assets/Lost-Jungle.mp3");
    this.swordSfx = new Audio("assets/sword.mp3");
    this.coinsSfx = new Audio("assets/Coins.mp3");
    this.menuMusic.loop = true;
    this.gameMusic.loop = true;
    this.volume = 0.6;
    this.applyVolume();
  }

  applyVolume() {
    [this.menuMusic, this.gameMusic, this.swordSfx, this.coinsSfx].forEach(
      (a) => (a.volume = this.volume)
    );
  }
  changeVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    this.applyVolume();
  }

  // WICHTIG: die jeweils andere Musik zuerst stoppen - sonst würden
  // Menü- und Spielmusik gleichzeitig übereinander laufen
  playMenuMusic() {
    this.gameMusic.pause();
    this.menuMusic.currentTime = 0;
    this.menuMusic.play().catch(() => {});
  }
  playGameMusic() {
    this.menuMusic.pause();
    this.gameMusic.currentTime = 0;
    this.gameMusic.play().catch(() => {});
  }
  stopAll() {
    this.menuMusic.pause();
    this.gameMusic.pause();
  }

  // currentTime = 0 vor jedem Abspielen erlaubt schnelles
  // Nacheinander-Auslösen, ohne auf das Ende des vorigen Sounds warten
  // zu müssen
  playSword() {
    this.swordSfx.currentTime = 0;
    this.swordSfx.play().catch(() => {});
  }
  playCoins() {
    this.coinsSfx.currentTime = 0;
    this.coinsSfx.play().catch(() => {});
  }
}

const sound = new SoundController();

/* ===================================================================
   Beispiel 1: Musik abspielen und zwischen Menü/Spiel wechseln
   =================================================================== */
document.getElementById("btn-menu-music").addEventListener("click", () => {
  sound.playMenuMusic();
  document.getElementById("music-status").textContent = "Menü-Musik läuft";
});
document.getElementById("btn-game-music").addEventListener("click", () => {
  sound.playGameMusic();
  document.getElementById("music-status").textContent = "Spiel-Musik läuft";
});
document.getElementById("btn-stop-music").addEventListener("click", () => {
  sound.stopAll();
  document.getElementById("music-status").textContent = "Musik gestoppt";
});

/* ===================================================================
   Beispiel 2: Soundeffekte - mehrfach schnell hintereinander auslösbar
   =================================================================== */
let swordCount = 0, coinsCount = 0;
function updateSfxDisplay() {
  document.getElementById("sfx-count").textContent =
    `Schwert: ${swordCount}x   Münzen: ${coinsCount}x (beide unabhängig zählbar, auch mehrfach schnell hintereinander)`;
}
document.getElementById("btn-sword-sfx").addEventListener("click", () => {
  sound.playSword();
  swordCount++;
  updateSfxDisplay();
});
document.getElementById("btn-coins-sfx").addEventListener("click", () => {
  sound.playCoins();
  coinsCount++;
  updateSfxDisplay();
});
updateSfxDisplay();

/* ===================================================================
   Beispiel 3: gemeinsame Lautstärke für alles
   =================================================================== */
document.getElementById("volume-slider").addEventListener("input", (e) => {
  sound.changeVolume(Number(e.target.value) / 100);
  document.getElementById("volume-value").textContent = `${e.target.value}%`;
});
document.getElementById("btn-test-volume").addEventListener("click", () => sound.playSword());
