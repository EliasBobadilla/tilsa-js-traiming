import { sound1, sound2, sound3 } from "./sounds.js";

const SIZE = 50;
const TILE_SIZE = 32;

const STAGE = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 0, 2, 2, 0],
  [0, 0, 2, 2, 2, 2, 2, 0, 0, 2, 0, 0, 2, 0, 0],
  [0, 0, 2, 0, 0, 0, 2, 2, 0, 2, 2, 2, 2, 0, 0],
  [0, 0, 2, 2, 2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
  [0, 2, 2, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
  [0, 0, 2, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 0],
  [0, 2, 2, 2, 0, 0, 2, 0, 0, 0, 1, 0, 0, 2, 0],
  [0, 2, 2, 3, 0, 0, 2, 0, 0, 2, 2, 2, 2, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

let tileMap = null;
let canvas = null;
let ctx = null;

const initStage = () => {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  tileMap = new Image();
  tileMap.src = "assets/tilemap.png";
};

const createTorch = (x, y) => {
  const delay = 10;
  let counter = 0;
  let frame = 0;

  const handleCounter = () => {
    if (counter < delay) {
      counter++;
      return;
    }
    counter = 0;
  };

  const handleFrame = () => {
    if (frame < 3) {
      frame++;
      return;
    }
    frame = 0;
  };

  return {
    draw: () => {
      handleCounter();
      handleFrame();

      ctx.drawImage(
        tileMap,
        frame * TILE_SIZE,
        64,
        TILE_SIZE,
        TILE_SIZE,
        SIZE * x,
        SIZE * y,
        SIZE,
        SIZE
      );
    },
  };
};

const drawScenario = () => {
  for (let y = 0; y < STAGE.length; y++) {
    for (let x = 0; x < STAGE[0].length; x++) {
      const dx = STAGE[y][x];
      ctx.drawImage(
        tileMap,
        dx * TILE_SIZE,
        0,
        TILE_SIZE,
        TILE_SIZE,
        SIZE * x,
        SIZE * y,
        SIZE,
        SIZE
      );
    }
  }
};

const createEnemy = (x, y) => {
  let route = Math.floor(Math.random() * 4);
  let delay = 50;
  let counter = 0;

  const checkCollision = (x, y) => {
    return STAGE[y][x] == 0;
  };

  return {
    draw: () => {
      ctx.drawImage(
        tileMap,
        0,
        TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
        x * SIZE,
        y * SIZE,
        SIZE,
        SIZE
      );
    },
    moves: (collisionWithHero) => {
      collisionWithHero(x, y);

      if (counter < delay) {
        counter++;
      } else {
        counter = 0;

        if (route == 0) {
          // up
          if (checkCollision(x, y - 1) === false) {
            y--;
          } else {
            route = Math.floor(Math.random() * 4);
          }
        }

        if (route === 1) {
          // down
          if (checkCollision(x, y + 1) === false) {
            y++;
          } else {
            route = Math.floor(Math.random() * 4);
          }
        }

        if (route === 2) {
          //left
          if (checkCollision(x - 1, y) === false) {
            x--;
          } else {
            route = Math.floor(Math.random() * 4);
          }
        }

        if (route === 3) {
          //right
          if (checkCollision(x + 1, y) === false) {
            x++;
          } else {
            route = Math.floor(Math.random() * 4);
          }
        }
      }
    },
  };
};

const resetCanvas = () => {
  canvas.width = 750;
  canvas.height = 500;
};

const createHero = () => {
  let x = 1;
  let y = 1;
  let key = false;

  // the hero died
  const resetHero = () => {
    sound1.play();
    alert("Has perdido!!");
    x = 1;
    y = 1;
    key = false;
    STAGE[8][3] = 3;
    document.getElementById("message").innerHTML = "";
  };

  const margins = (x, y) => {
    return STAGE[y][x] == 0;
  };

  const victory = () => {
    sound3.play();
    alert("Has ganado!!");
    x = 1;
    y = 1;
    key = false;
    STAGE[8][3] = 3;
    document.getElementById("message").innerHTML = "";
  };

  const objectsLogic = () => {
    const obj = STAGE[y][x];

    // key logic
    if (obj === 3) {
      key = true;
      STAGE[y][x] = 2;
      sound2.play();
      document.getElementById("message").innerHTML = "Has obtenido la key!!!";
    }

    // door logic
    if (obj === 1) {
      if (key === true) {
        victory();
      } else {
        alert("Te falta la key! No puedes pasar");
      }
    }
  };

  return {
    draw: () => {
      ctx.drawImage(tileMap, 32, 32, 32, 32, x * SIZE, y * SIZE, SIZE, SIZE);
    },
    checkCollision: (xAxis, yAxis) => {
      if (x === xAxis && y === yAxis) {
        resetHero();
      }
    },
    moveUp: () => {
      if (margins(x, y - 1) === false) {
        y--;
        objectsLogic();
      }
    },
    moveDown: () => {
      if (margins(x, y + 1) === false) {
        y++;
        objectsLogic();
      }
    },
    moveLeft: () => {
      if (margins(x - 1, y) === false) {
        x--;
        objectsLogic();
      }
    },
    moveRight: () => {
      if (margins(x + 1, y) === false) {
        x++;
        objectsLogic();
      }
    },
  };
};

export {
  createEnemy,
  createHero,
  createTorch,
  drawScenario,
  initStage,
  resetCanvas
};

