// Escape = circle , chase = rectangle , random = square
//--------------Globals---------------
let animationId;

// Current enemies on canvas
let currentEscapes = 0;
let currentChasers = 0;
let currentRandoms = 0;

// Time interval
let spawnInterval = 5000;
let scoreInterval = 1000;

//------------------- Documetent Elements -------------------

// Select canvas
const canvas = document.querySelector("canvas");

// Select points
const points = document.querySelector("#points");

// Select fixed div
const fixed = document.querySelector(".fixed");

// header Points
const headerPoints = document.querySelector("h1");

// Select header
const startPanel = document.querySelector(".header");
// gameOver Panel
const gameOverPanel = document.querySelector(".bg-white");

// Select header
const button = document.getElementById("start");

/*
  ------------------- Canvas Init ------------------------
*/

// Initialize canvas's boundries
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.7;
canvas.style.backgroundColor = "lightblue";
canvas.style.marginTop = "14px";

// Create canvas API
const ctx = canvas.getContext("2d");

//------------Classes-----------------
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  setPositionX(x) {
    this.x = x;
  }
  setPositionY(y) {
    this.y = y;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class GameManager {
  constructor() {}

  deleteAllEnemies() {
    while (espaces.length > 0) {
      espaces.pop();
    }
    while (chases.length > 0) {
      chases.pop();
    }
    while (randoms.length > 0) {
      randoms.pop();
    }
  }

  colorPicker() {
    var prefix = "#";
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    this.color = prefix + randomColor;
  }

  setSpeed() {
    this.speed = {
      x: (Math.random() * (Math.cos(this.angle) * 2 + 3) - 3) / 100000000,

      y: (Math.random() * (Math.sin(this.angle) * 2 + 1) - 1) / 100000000,
    };
  }
}

class enemyElements {
  constructor(x, y, color, speed) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = speed;
    this.collidingWithBorder = false;
  }
  update() {
    this.draw();
    const newX = this.x + this.speed.x / 100000000;
    const newY = this.y + this.speed.y / 100000000;
    if (newX > 40 && newX < canvas.width - 15) {
      this.x = this.x + this.speed.x;
    } else {
      this.collidingWithBorder = true;
    }
    if (newY > 21 && newY < canvas.height - 40) {
      this.y = this.y + this.speed.y;
    } else {
      this.collidingWithBorder = true;
    }
    this.move();
  }
}

// Chase (rectangle)
class Chase extends enemyElements {
  constructor(x, y, color, speed, recWidth, recHeight) {
    super(x, y, color, speed);
    this.recWidth = recWidth;
    this.recHeight = recHeight;
  }

  draw() {
    ctx.beginPath();

    // design your upcoming shape
    ctx.fillRect(this.x, this.y, this.recWidth, this.recHeight);

    // shape style
    ctx.fillStyle = this.color;

    ctx.fill();
  }

  hitTarget() {
    cancelAnimationFrame(animationId);
    manager.deleteAllEnemies();
    headerPoints.textContent = score.textContent;
    fixed.style.display = "flex";
    gameOverPanel.style.display = "flex";
  }

  setChaserRadius() {
    this.radius = Math.random() * (80 - 30) + 30;
  }

  setColor(color) {
    this.color = color;
  }

  setChaserRecHeightAndHeight() {
    this.recHeight = Math.random() * (50 - 10) + 10;
    this.recWidth = Math.random() * (100 - 10) + 10;
  }

  setChaserPosition() {
    if (Math.random() < 0.5) {
      this.x =
        Math.random() < 0.5
          ? Math.abs(0 - this.radius * 2)
          : Math.abs(canvas.width * 0.7 + this.radius);
      this.y = Math.abs(Math.random() * canvas.height * 0.7);
    } else {
      this.x = Math.abs(Math.random() * canvas.width * 0.7);
      this.y =
        Math.random() < 0.5
          ? Math.abs(0 - this.radius)
          : Math.abs(canvas.height * 0.7 + this.radius);
    }
  }

  initChaserAngle() {
    this.angle = Math.atan2(player.y + this.y, player.x + this.x);
  }

  move() {
    this.initChaserAngle();
    this.setChaserRadius();
    this.setChaserPosition();
    this.setChaserRecHeightAndHeight();
  }
}

//Escape
class Escape extends enemyElements {
  constructor(x, y, square, color, speed) {
    super(x, y, color, speed);
    this.square = square;
  }

  draw() {
    // specify that you want to start drawing
    ctx.beginPath();

    // design your upcoming shape
    ctx.fillRect(this.x, this.y, this.square, this.square);

    // shape style
    ctx.fillStyle = this.color;

    // finally draw
    ctx.fill();
  }

  hitTarget() {
    score.textContent = parseInt(score.textContent) + 5;
    manager.setRandomPosition;
    ctx.fillRect(this.x, this.y, this.square, this.square);
  }

  setEscapeRadius() {
    this.radius = Math.random() * (80 - 30) + 30;
  }

  setEscapePosition() {
    if (Math.random() < 0.5) {
      this.x =
        Math.random() < 0.5
          ? Math.abs(0 - this.radius)
          : Math.abs(player.x + this.radius * 2);
      this.y = Math.random() * player.y + this.radius;
    } else {
      this.x = Math.random() * player.x;
      this.y =
        Math.random() < 0.5
          ? Math.abs(0 - this.radius)
          : player.y + 2 * this.radius;
    }
  }

  initEscapeAngle() {
    this.angle = Math.atan2(this.y - player.y, this.x - player.x);
  }

  move() {
    this.setEscapeRadius();
    this.setEscapePosition();
    this.initEscapeAngle();
  }
}

class Random extends enemyElements {
  constructor(x, y, radius, color, speed) {
    super(x, y, color, speed);
    this.radius = radius;
  }

  draw() {
    // specify that you want to start drawing
    ctx.beginPath();

    // design your upcoming shape
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

    // shape style
    ctx.fillStyle = this.color;

    // finally draw
    ctx.fill();
  }

  hitTarget() {
    cancelAnimationFrame(animationId);
    manager.deleteAllEnemies();
    headerPoints.textContent = score.textContent;
    fixed.style.display = "flex";
    gameOverPanel.style.display = "flex";
  }

  initRandomsAngle() {
    this.angle = Math.atan2(
      this.y - Math.random() * (canvas.height * 0.9),
      this.x - Math.random() * (canvas.width * 0.9)
    );
  }

  setRandomPosition() {
    this.x = Math.random() * (canvas.width * 0.9);
    this.y = Math.random() * (canvas.height * 0.9);
    // console.log(this.x, this.y);
  }

  setRandomRadius() {
    this.radius = Math.random() * (40 - 20) + 20;
  }

  move() {
    this.initRandomsAngle();
    this.setRandomPosition();
    this.setRandomRadius();
  }
}

// enemy elements Arrays
const espaces = [];
const chases = [];
const randoms = [];
const player = new Player(ctx.width / 2, ctx.height / 2, 10, "pink");
let manager = new GameManager();

//---------------------- Event Listener -----------------------
// Listens to the mouse

window.addEventListener("mousemove", (event) => {
  const x = event.clientX;
  const y = event.clientY;
  if (x > 0 && x < canvas.width) {
    player.setPositionX(x);
  }
  if (y > 0 && y < canvas.height) {
    player.setPositionY(y);
  }
});

function startScore() {
  setInterval(() => {
    score.textContent = parseInt(score.textContent) + 1;
  }, scoreInterval);
  setInterval(() => {
    animate();
  }, 10000);
}

function restartGame() {
  location.reload();
}
function animate() {
  // Request animation
  animationId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();

  // update the position of each chaser
  chases.forEach((chase, index) => {
    chase.update();
    const dist1 = Math.hypot(
      player.getPosition().x - chase.x,
      player.getPosition().y - chase.y
    );

    if (dist1 - player.radius * 2 < 1) {
      setTimeout(() => {
        // Game Over!
        chase.hitTarget();
        manager.deleteAllEnemies();
      }, 0);
    }
  });

  // update the position of each escape
  espaces.forEach((escape, index) => {
    escape.update();
    const dist2 = Math.hypot(player.x + escape.x, player.y + escape.y);

    if (dist2 - player.radius < 10) {
      setTimeout(() => {
        espaces.splice(index, 1);
        escape.hitTarget();
      }, 0);
    }
  });

  // update the position of each random
  randoms.forEach((random, index) => {
    random.update();

    const dist3 = Math.hypot(player.x - random.x, player.y - random.y);

    if (dist3 - random.radius - player.radius < 1) {
      setTimeout(() => {
        // Game Over!
        manager.deleteAllEnemies();
        random.hitTarget();
      }, 0);
    }
  });
}

function spawnChasers() {
  let maxEnemies = 10;

  let interval = setInterval(() => {
    currentChasers += 1;

    manager.setSpeed();
    manager.colorPicker();
    let a_chase;
    chases.push(
      (a_chase = new Chase(0, 0, manager.color, manager.speed, 0, 0))
    );
    if (currentChasers === maxEnemies) {
      clearInterval(interval);
    }
  }, spawnInterval);
}
function spawnEscapes() {
  let maxEnemies = 10;

  let interval = setInterval(() => {
    currentEscapes += 1;
    manager.setSpeed();
    manager.colorPicker();
    let an_escape;
    espaces.push(
      (an_escape = new Escape(0, 0, (0, 0), manager.color, manager.speed))
    );
    if (currentEscapes === maxEnemies) {
      clearInterval(interval);
    }
  }, spawnInterval);
}

function spawnRandoms() {
  let maxEnemies = 10;

  let interval = setInterval(() => {
    currentRandoms += 1;
    manager.setSpeed();
    manager.colorPicker();
    let a_random;
    // circle
    randoms.push(
      (a_random = new Random(0, 0, 0, manager.color, manager.speed))
    );

    if (currentRandoms === maxEnemies) {
      clearInterval(interval);
    }
  }, spawnInterval);
}

function startGame() {
  fixed.style.display = "none";

  //score
  startScore();
  //animate
  animate();

  // for the spawning of the chasers
  spawnChasers();

  // for the spawning of the escapers
  spawnEscapes();

  // for the spawning of the randoms
  spawnRandoms();
}
