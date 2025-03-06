// select canvas element
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Ball object
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  velocityX: 5,
  velocityY: 5,
  speed: 7,
  color: "WHITE",
};

// User Paddle (Player 1)
const user = {
  x: 0,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0,
  color: "WHITE",
  dy: 0,
};

// Player 2 Paddle
const player2 = {
  x: canvas.width - 10,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0,
  color: "WHITE",
  dy: 0,
};

// NET
const net = {
  x: (canvas.width - 2) / 2,
  y: 0,
  height: 10,
  width: 2,
  color: "WHITE",
};

// draw functions
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawArc(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawNet() {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
  }
}

function drawText(text, x, y) {
  ctx.fillStyle = "#FFF";
  ctx.font = "75px fantasy";
  ctx.fillText(text, x, y);
}

function collision(b, p) {
  return (
    p.x < b.x + b.radius &&
    p.x + p.width > b.x - b.radius &&
    p.y < b.y + b.radius &&
    p.y + p.height > b.y - b.radius
  );
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.velocityX = -ball.velocityX;
  ball.speed = 7;
}

function checkWin() {
  if (user.score === 10 || player2.score === 10) {
    clearInterval(loop);
    document.body.innerHTML = `<div class='win-screen'>${user.score === 10 ? "Player 1" : "Player 2"} Wins!<br><button onclick='location.reload()'>Play Again</button></div>`;
  }
}

function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  user.y += user.dy;
  player2.y += player2.dy;

  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.velocityY = -ball.velocityY;
  }

  let player = ball.x < canvas.width / 2 ? user : player2;

  if (collision(ball, player)) {
    let collidePoint = ball.y - (player.y + player.height / 2);
    collidePoint /= player.height / 2;
    let angleRad = (Math.PI / 4) * collidePoint;
    let direction = ball.x < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);
    ball.speed += 0.2;
  }

  if (ball.x - ball.radius < 0) {
    player2.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    resetBall();
  }

  checkWin();
}

function render() {
  drawRect(0, 0, canvas.width, canvas.height, "#000");
  drawText(user.score, canvas.width / 4, canvas.height / 5);
  drawText(player2.score, (3 * canvas.width) / 4, canvas.height / 5);
  drawNet();
  drawRect(user.x, user.y, user.width, user.height, user.color);
  drawRect(player2.x, player2.y, player2.width, player2.height, player2.color);
  drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function game() {
  update();
  render();
}

// Keyboard controls
window.addEventListener("keydown", (e) => {
  if (e.key === "w") user.dy = -8;
  if (e.key === "s") user.dy = 8;
  if (e.key === "ArrowUp") player2.dy = -8;
  if (e.key === "ArrowDown") player2.dy = 8;
});

window.addEventListener("keyup", (e) => {
  if (e.key === "w" || e.key === "s") user.dy = 0;
  if (e.key === "ArrowUp" || e.key === "ArrowDown") player2.dy = 0;
});

// Start game only when button is clicked
let loop;
document.getElementById("startButton").addEventListener("click", function () {
  this.style.display = "none"; // Hide the button
  canvas.style.display = "block"; // Show the canvas
  loop = setInterval(game, 1000 / 50); // Start the game loop
});
