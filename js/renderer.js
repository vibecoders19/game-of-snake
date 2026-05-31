const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawFood();
  drawSnake();
}

function drawGrid() {
  // Subtle checkerboard depth
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      if ((x + y) % 2 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.012)';
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }
  }
  // Faint grid lines
  ctx.strokeStyle = 'rgba(78, 204, 163, 0.045)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CELL, 0);
    ctx.lineTo(x * CELL, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * CELL);
    ctx.lineTo(canvas.width, y * CELL);
    ctx.stroke();
  }
}

function drawFood() {
  const cx = food.x * CELL + CELL / 2;
  const cy = food.y * CELL + CELL / 2;
  const r = CELL / 2 - 3;

  // Outer glow
  ctx.shadowColor = '#e94560';
  ctx.shadowBlur = 18;

  // 3D sphere gradient (light source top-left)
  const grad = ctx.createRadialGradient(
    cx - r * 0.35, cy - r * 0.35, r * 0.05,
    cx, cy, r
  );
  grad.addColorStop(0,   '#ff8fa3');
  grad.addColorStop(0.4, '#e94560');
  grad.addColorStop(1,   '#7a001c');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Specular shine
  ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.28, cy - r * 0.28, r * 0.28, r * 0.18, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  // Stem
  ctx.strokeStyle = '#3d2010';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, cy - r + 1);
  ctx.quadraticCurveTo(cx + r * 0.4, cy - r - r * 0.4, cx + r * 0.25, cy - r - r * 0.55);
  ctx.stroke();
}

function drawSnake() {
  // Draw tail-to-head so the head renders on top
  for (let i = snake.length - 1; i >= 0; i--) {
    const seg = snake[i];
    const x = seg.x * CELL + 2;
    const y = seg.y * CELL + 2;
    const size = CELL - 4;
    const isHead = i === 0;
    const radius = isHead ? 7 : 5;

    const baseLightness = Math.max(18, 52 - i * 1.6);

    // Segment fill gradient (top-left light source)
    const grad = ctx.createLinearGradient(x, y, x + size, y + size);
    if (isHead) {
      grad.addColorStop(0, '#7fffd8');
      grad.addColorStop(0.45, '#4ecca3');
      grad.addColorStop(1, '#1e8060');
      ctx.shadowColor = '#4ecca3';
      ctx.shadowBlur = 12;
    } else {
      grad.addColorStop(0, `hsl(162, 62%, ${Math.min(65, baseLightness + 12)}%)`);
      grad.addColorStop(1, `hsl(162, 62%, ${Math.max(12, baseLightness - 10)}%)`);
      ctx.shadowBlur = 0;
    }

    ctx.fillStyle = grad;
    roundRect(x, y, size, size, radius);
    ctx.fill();

    // Top-left highlight for 3D roundness
    ctx.fillStyle = 'rgba(255, 255, 255, 0.13)';
    roundRect(x + 2, y + 2, size * 0.52, size * 0.42, radius - 1);
    ctx.fill();

    // Scale ring on body segments
    if (!isHead) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size * 0.28, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.shadowBlur = 0;
  drawSnakeEyes();
}

function drawSnakeEyes() {
  if (!snake || snake.length === 0) return;
  const head = snake[0];
  const cx = head.x * CELL + CELL / 2;
  const cy = head.y * CELL + CELL / 2;
  const eyeR = 2.2;
  const spread = 3.2;

  let positions;
  if      (dir.x ===  1) positions = [{ x: cx + 3.5, y: cy - spread }, { x: cx + 3.5, y: cy + spread }];
  else if (dir.x === -1) positions = [{ x: cx - 3.5, y: cy - spread }, { x: cx - 3.5, y: cy + spread }];
  else if (dir.y === -1) positions = [{ x: cx - spread, y: cy - 3.5 }, { x: cx + spread, y: cy - 3.5 }];
  else                   positions = [{ x: cx - spread, y: cy + 3.5 }, { x: cx + spread, y: cy + 3.5 }];

  positions.forEach(p => {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, eyeR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.arc(p.x + 0.5, p.y + 0.5, eyeR * 0.55, 0, Math.PI * 2);
    ctx.fill();
  });
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
