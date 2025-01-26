import {
  createEnemy,
  createHero,
  createTorch,
  drawScenario,
  initStage,
  resetCanvas,
} from "./draw.js";
import { music } from "./sounds.js";

const FPS = 50;
const enemies = [];
let torch = null;
let hero = null;

function initialize() {
  initStage();
  torch = createTorch(0, 0);
  hero = createHero();
  enemies.push(createEnemy(2, 7));
  enemies.push(createEnemy(6, 7));
  enemies.push(createEnemy(7, 4));

  music.play();

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      hero.moveDown();
    }
    if (event.key === "ArrowUp") {
      hero.moveUp();
    }
    if (event.key === "ArrowRight") {
      hero.moveRight();
    }
    if (event.key === "ArrowLeft") {
      hero.moveLeft();
    }
  });

  setInterval(run, 1000 / FPS);
}

function run() {
  resetCanvas();
  drawScenario();
  torch.draw();
  hero.draw();

  for (let c = 0; c < enemies.length; c++) {
    enemies[c].moves();
    enemies[c].draw();
  }
}

initialize();
