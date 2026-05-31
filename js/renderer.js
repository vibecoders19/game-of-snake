const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawFood();
  drawSnake();
}

function drawGrid() {
  ctx.fillStyle = '#1a1a3e';
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);
    }
  }
}

function drawFood() {
  const fx = food.x * CELL + CELL / 2;
  const fy = food.y * CELL + CELL / 2;
  ctx.fillStyle = '#e94560';
  ctx.beginPath();
  ctx.arc(fx, fy, CELL / 2 - 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = '#e94560';
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawSnake() {
  snake.forEach((seg, i) => {
    const x = seg.x * CELL + 2;
    const y = seg.y * CELL + 2;
    const size = CELL - 4;
    const radius = i === 0 ? 6 : 4;

    if (i === 0) {
      ctx.fillStyle = '#4ecca3';
      ctx.shadowColor = '#4ecca3';
      ctx.shadowBlur = 8;
    } else {
      const lightness = Math.max(30, 60 - i * 2);
      ctx.fillStyle = `hsl(162, 60%, ${lightness}%)`;
      ctx.shadowBlur = 0;
    }

    roundRect(x, y, size, size, radius);
    ctx.fill();
  });

  ctx.shadowBlur = 0;
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
