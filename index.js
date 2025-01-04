const canvas = document.getElementById("canvas");
const scoreDiv = document.getElementById("score");
const button_section = document.getElementById("button-section");
const settings = document.getElementById("settings");
const game_music = document.getElementById("game_music");
const sfx = document.querySelector(".sfxOn");
const gameover = document.querySelector(".gameover");
const ctx = canvas.getContext("2d");
const foodAudio = new Audio("../music/food.mp3");
const gameOverAudio = new Audio("../music/gameover.mp3");
const moveAudio = new Audio("../music/move.mp3");
const gameMusic = new Audio("../music/music.mp3");

const blockSize = 15; // Size of each snake block
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const speed = 120;
let score = 0;
let interval;
let snake = [
  { x: blockSize * 3, y: canvasHeight / 2 },
  { x: blockSize * 2, y: canvasHeight / 2 },
  { x: blockSize, y: canvasHeight / 2 },
];
let direction = { x: blockSize, y: 0 }; // snake movement direction

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    // Arrow Keys (for movement)
    case "ArrowUp":
    case "w":
      if (direction.y === 0) {
        // Allow up only if not moving vertically
        direction = { x: 0, y: -blockSize };
        if (sfx.innerHTML === "ON") {
          moveAudio.play();
        }
      }
      break;
    case "ArrowDown":
    case "s":
      if (direction.y === 0) {
        // Allow down only if not moving vertically
        direction = { x: 0, y: blockSize };
        if (sfx.innerHTML === "ON") {
          moveAudio.play();
        }
      }
      break;
    case "ArrowRight":
    case "d":
      if (direction.x === 0) {
        // Allow right only if not moving horizontally
        direction = { x: blockSize, y: 0 };
        if (sfx.innerHTML === "ON") {
          moveAudio.play();
        }
      }
      break;
    case "ArrowLeft":
    case "a":
      if (direction.x === 0) {
        // Allow left only if not moving horizontally
        direction = { x: -blockSize, y: 0 };
        if (sfx.innerHTML === "ON") {
          moveAudio.play();
        }
      }
      break;
    default:
      break;
  }
});

// functions inside gameloop
function drawSnake() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "green"; // Snake color
  ctx.strokeStyle = "black";
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i].x, snake[i].y, blockSize, blockSize);
    ctx.strokeRect(snake[i].x, snake[i].y, blockSize, blockSize);
  }
}

function moveSnake() {
  let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head); //insert new head of snake
  if (!foodEaten()) {
    snake.pop(); // removes the tail of snake
  }
}

function snakeFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(generateFood.x, generateFood.y, blockSize, blockSize);
}

let generateFood = snakeFoodLocation();
function snakeFoodLocation() {
  let x = Math.floor(Math.random() * (canvasWidth / blockSize)) * blockSize;
  let y = Math.floor(Math.random() * (canvasHeight / blockSize)) * blockSize;
  return { x, y };
}

function foodEaten() {
  if (snake[0].x === generateFood.x && snake[0].y === generateFood.y) {
    return true;
  } else return false;
}

drawSnake(); // snake is drawn before game starts

// main function
function gameLoop() {
  if (game_music.innerHTML === "ON") {
    gameMusic.play();
  }
  scoreDiv.innerHTML = `Score : ${score}`;
  button_section.style.display = "none";
  interval = setInterval(updateGame, speed);
}

function updateGame() {
  moveSnake();
  drawSnake();
  snakeFood();
  if (foodEaten()) {
    if (sfx.innerHTML === "ON") {
      foodAudio.play();
    }
    generateFood = snakeFoodLocation(); // regenerates food when eaten
    score++;
    scoreDiv.innerHTML = `Score : ${score}`;
  }

  if (
    snake[0].x < 0 ||
    snake[0].x >= canvasWidth || // collision with walls
    snake[0].y < 0 ||
    snake[0].y >= canvasHeight || // collision with walls
    snake
      .slice(1)
      .some((segment) => segment.x === snake[0].x && segment.y === snake[0].y) // collision with body
  ) {
    gameOver();
  }
}

function resetgame() {
  snake = [
    { x: blockSize * 3, y: canvasHeight / 2 },
    { x: blockSize * 2, y: canvasHeight / 2 },
    { x: blockSize, y: canvasHeight / 2 },
  ];

  // Reset the direction to the initial movement (moving to the right)
  direction = { x: blockSize, y: 0 };

  // Reset the score
  score = 0;
  scoreDiv.innerHTML = `Score : ${score}`;
  drawSnake();
  button_section.style.display = "flex";
  document.querySelector("#start-button").innerHTML = "Restart Game";

  window.removeEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      gameover.style.visibility = "hidden";
    }
  });
}

function gameOver() {
  gameMusic.pause();
  if (sfx.innerHTML === "ON") {
    gameOverAudio.play();
  }
  clearInterval(interval);
  gameover.style.visibility = "visible";

  // Add the keydown event listener (on Enter key)
  gameOverKeyListener = () => {
    gameover.style.visibility = "hidden";
    resetgame();

    window.removeEventListener("keydown", gameOverKeyListener);
  };
  window.addEventListener("keydown", gameOverKeyListener);

  // window.addEventListener("keydown",(e)=>{
  //   if(e.key === "Enter"){
  //     gameover.style.visibility = "hidden";
  //     resetgame();
  //   }
  // })
}

function setting() {
  button_section.style.display = "none";
  settings.style.visibility = "visible";
  document.querySelector(".cross_icon").style.visibility = "visible";
}
function closeSettings() {
  button_section.style.display = "flex";
  settings.style.visibility = "hidden";
  document.querySelector(".cross_icon").style.visibility = "hidden";
}

function music() {
  const musicOn = document.querySelector(".musicOn");
  // Toggle the 'musicOff' class on the clicked button
  musicOn.classList.toggle("musicOff");

  // Toggle the inner HTML between "ON" and "OFF"
  if (musicOn.innerHTML === "ON") {
    musicOn.innerHTML = "OFF";
    // Save state to localStorage
    localStorage.setItem("musicState", "OFF");
  } else {
    musicOn.innerHTML = "ON";
    // Save state to localStorage
    localStorage.setItem("musicState", "ON");
  }
}

function Sfx() {
  const sfxOn = document.querySelector(".sfxOn");
  // Toggle the 'sfxOff' class on the clicked button
  sfxOn.classList.toggle("sfxOff");

  // Toggle the inner HTML between "ON" and "OFF"
  if (sfxOn.innerHTML === "ON") {
    sfxOn.innerHTML = "OFF";
    // Save state to localStorage
    localStorage.setItem("sfxState", "OFF");
  } else {
    sfxOn.innerHTML = "ON";
    // Save state to localStorage
    localStorage.setItem("sfxState", "ON");
  }
}

// Load the saved states from localStorage when the page loads
window.addEventListener("load", () => {
  // Check and apply the saved state for music
  const savedMusicState = localStorage.getItem("musicState");
  const musicOn = document.querySelector(".musicOn");
  if (savedMusicState === "OFF") {
    musicOn.innerHTML = "OFF";
    musicOn.classList.add("musicOff");
    game_music.innerHTML = "OFF";
  } else {
    musicOn.innerHTML = "ON";
    musicOn.classList.remove("musicOff");
    game_music.innerHTML = "ON";
  }

  // Check and apply the saved state for SFX
  const savedSfxState = localStorage.getItem("sfxState");
  const sfxOn = document.querySelector(".sfxOn");
  if (savedSfxState === "OFF") {
    sfxOn.innerHTML = "OFF";
    sfxOn.classList.add("sfxOff");
  } else {
    sfxOn.innerHTML = "ON";
    sfxOn.classList.remove("sfxOff");
  }
});
