const overlay = document.getElementById('overlay');
const scoreDisplay = document.getElementById('score-display');
const bestDisplay = document.getElementById('best-display');

function updateScoreDisplay() {
  scoreDisplay.textContent = score;
  bestDisplay.textContent = best;
}

function showGameOver() {
  overlay.innerHTML = `
    <h2>GAME OVER</h2>
    <p class="final-score">Score: ${score}</p>
    <p style="color:#888">Best: ${best}</p>
    <button id="restart-btn">Play Again</button>
    <p style="font-size:0.8rem;color:#555">Press R to restart</p>
  `;
  overlay.style.display = 'flex';
  document.getElementById('restart-btn').addEventListener('click', init);
}
