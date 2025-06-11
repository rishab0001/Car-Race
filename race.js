const startBtn = document.getElementById('startBtn');
const gameArea = document.getElementById('gameArea');
const scoreEl = document.getElementById('score');

let player = { speed: 5, score: 0, x: 0, y: 0 };
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

startBtn.addEventListener('click', startGame);
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function startGame() {
  startBtn.style.display = 'none';
  gameArea.innerHTML = '';
  player.score = 0;

  // Add road lines
  for (let i = 0; i < 5; i++) {
    let line = document.createElement('div');
    line.classList.add('line');
    line.y = i * 150;
    line.style.top = line.y + 'px';
    gameArea.appendChild(line);
  }

  // Add player car
  let car = document.createElement('div');
  car.setAttribute('class', 'car');
  gameArea.appendChild(car);
  player.x = car.offsetLeft;
  player.y = car.offsetTop;
  player.element = car;

  // Add enemies
  for (let i = 0; i < 3; i++) {
    let enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -300 * (i + 1);
    enemy.style.top = enemy.y + 'px';
    enemy.style.left = Math.floor(Math.random() * 350) + 'px';
    gameArea.appendChild(enemy);
  }

  window.requestAnimationFrame(playGame);
}

function playGame() {
  let car = player.element;
  let lines = document.querySelectorAll('.line');
  let enemies = document.querySelectorAll('.enemy');

  // Move road lines
  lines.forEach(line => {
    line.y += player.speed;
    if (line.y >= 600) line.y = -100;
    line.style.top = line.y + 'px';
  });

  // Move enemies
  enemies.forEach(enemy => {
    enemy.y += player.speed;
    if (enemy.y >= 600) {
      enemy.y = -300;
      enemy.style.left = Math.floor(Math.random() * 350) + 'px';
    }
    enemy.style.top = enemy.y + 'px';

    // Collision detection
    if (isCollide(car, enemy)) {
      endGame();
      return;
    }
  });

  // Movement
  if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
  if (keys.ArrowDown && player.y < 500) player.y += player.speed;
  if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
  if (keys.ArrowRight && player.x < 350) player.x += player.speed;

  car.style.top = player.y + 'px';
  car.style.left = player.x + 'px';

  player.score++;
  scoreEl.innerText = 'Score: ' + player.score;

  window.requestAnimationFrame(playGame);
}

function isCollide(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();
  return !(
    aRect.top > bRect.bottom ||
    aRect.bottom < bRect.top ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function endGame() {
  startBtn.style.display = 'block';
  startBtn.innerText = 'Restart';
  gameArea.innerHTML += `<div style="color:white; font-size: 24px; text-align: center; margin-top: 250px;">Game Over<br>Score: ${player.score}</div>`;
}