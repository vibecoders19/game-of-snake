let snake, dir, nextDir, food, score, best, gameLoop, running;
best = 0;

function init() {
  snake = [
    { x: 10, y: 10 },
    { x: 9,  y: 10 },
    { x: 8,  y: 10 },
  ];
  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score = 0;
  running = true;
  updateScoreDisplay();
  placeFood();
  overlay.style.display = 'none';
  clearInterval(gameLoop);
  gameLoop = setInterval(tick, TICK_MS);
}

function placeFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  food = pos;
}

function tick() {
  dir = nextDir;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    return endGame();
  }
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    return endGame();
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    if (score > best) best = score;
    updateScoreDisplay();
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function endGame() {
  running = false;
  clearInterval(gameLoop);
  showGameOver();
}

// Draw the empty board on page load and wire up the start button
ctx.fillStyle = '#080a14';
ctx.fillRect(0, 0, canvas.width, canvas.height);

document.getElementById('restart-btn').addEventListener('click', init);
