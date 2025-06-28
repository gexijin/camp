const game = document.getElementById("game");
const dino = document.getElementById("dino");
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");

let velocityY = 0;
let gravity = -0.5;
let jumpStrength = 12;
let isOnGround = true;
let score = 0;
let gameTime = 0;
let gameRunning = true; // Start immediately
let speed = 5;
let difficultyLevel = 1;
let obstacleTimers = [];
let speedInterval;
let timerInterval;
let jumpStarted = false;
let wasInAir = false;

dino.className = "shape1"; // default shape

startGame(); // start immediately

function startGame() {
  createObstacleGroup();
  speedInterval = setInterval(increaseDifficulty, 15000);
  startTimer();
  requestAnimationFrame(applyPhysics);
}

// ...rest of your existing code unchanged...
