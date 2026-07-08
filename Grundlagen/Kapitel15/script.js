/**
 * Kapitel 15 - Sound & Musik
 * Musterloesung
 *
 * SoundController buendelt alle Audio-Objekte an einem Ort: sich
 * gegenseitig ausschliessende Musikstuecke, wiederholt ausloesbare
 * Soundeffekte, und eine gemeinsame Lautstaerke fuer alles zusammen.
 */

class SoundController {
  constructor() {
    this.menuMusic = new Audio("assets/Game-Menu.mp3");
    this.gameMusic = new Audio("assets/Lost-Jungle.mp3");
    this.swordSfx = new Audio("assets/sword.mp3");
    this.collectSfx = new Audio("assets/Coins.mp3");
    this.menuMusic.loop = true;
    this.gameMusic.loop = true;
    this.volume = 0.6;
    this.applyVolume();
  }

  applyVolume() {
    // eine einzige Zuweisung fuer alle Audio-Objekte statt vier
    // einzelnen Lautstaerkereglern
    [this.menuMusic, this.gameMusic, this.swordSfx, this.collectSfx].forEach(
      (a) => (a.volume = this.volume)
    );
  }

  changeVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    this.applyVolume();
  }

  // Musikstuecke schliessen sich explizit gegenseitig aus - der Browser
  // wuerde sonst beide gleichzeitig munter weiterspielen.
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

  // currentTime = 0 VOR jedem play() erlaubt, denselben Soundeffekt
  // beliebig schnell hintereinander erneut auszuloesen - ohne das
  // wuerde ein zweiter Klick vor Ende des ersten Sounds einfach
  // ignoriert (der Sound spielt bereits, play() tut dann nichts).
  playSword() {
    this.swordSfx.currentTime = 0;
    this.swordSfx.play().catch(() => {});
  }
  playCollect() {
    this.collectSfx.currentTime = 0;
    this.collectSfx.play().catch(() => {});
  }
}

const sound = new SoundController();

document.getElementById("btn-menu").addEventListener("click", () => sound.playMenuMusic());
document.getElementById("btn-game").addEventListener("click", () => sound.playGameMusic());
document.getElementById("btn-stop").addEventListener("click", () => sound.stopAll());
document.getElementById("btn-sfx").addEventListener("click", () => sound.playSword());
document.getElementById("volume").addEventListener("input", (e) => {
  sound.changeVolume(Number(e.target.value) / 100);
});
