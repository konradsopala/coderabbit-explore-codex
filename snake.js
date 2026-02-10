import {
  GRID_SIZE,
  createInitialState,
  queueDirection,
  step,
  togglePause,
} from "./snake-logic.js";

const board = document.getElementById("board");
const scoreEl = document.getElementById("score");
const statusEl = document.getElementById("status");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
const controls = document.querySelector(".controls");

const TICK_MS = 130;
const cells = [];

let state = createInitialState();
let timerId = null;

function buildBoard() {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    fragment.appendChild(cell);
    cells.push(cell);
  }
  board.appendChild(fragment);
}

function idx(x, y) {
  return y * GRID_SIZE + x;
}

function render() {
  cells.forEach((cell) => {
    cell.classList.remove("snake", "food");
  });

  state.snake.forEach((segment) => {
    cells[idx(segment.x, segment.y)].classList.add("snake");
  });

  if (state.food) {
    cells[idx(state.food.x, state.food.y)].classList.add("food");
  }

  scoreEl.textContent = String(state.score);
  if (state.gameOver) {
    statusEl.textContent = "Game Over";
  } else if (state.paused) {
    statusEl.textContent = "Paused";
  } else {
    statusEl.textContent = "Running";
  }
  pauseBtn.textContent = state.paused ? "Resume" : "Pause";
}

function onDirection(next) {
  state = queueDirection(state, next);
}

function restart() {
  state = createInitialState();
  render();
}

function tick() {
  state = step(state, GRID_SIZE);
  render();
}

function startLoop() {
  timerId = window.setInterval(tick, TICK_MS);
}

function bindKeyboard() {
  const map = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    a: "left",
    s: "down",
    d: "right",
  };

  document.addEventListener("keydown", (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (key === " " || key === "Spacebar") {
      event.preventDefault();
      state = togglePause(state);
      render();
      return;
    }
    if (key === "r") {
      restart();
      return;
    }
    const dir = map[key];
    if (!dir) return;
    event.preventDefault();
    onDirection(dir);
  });
}

function bindButtons() {
  pauseBtn.addEventListener("click", () => {
    state = togglePause(state);
    render();
  });
  restartBtn.addEventListener("click", restart);
  controls.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const dir = target.dataset.dir;
    if (dir) onDirection(dir);
  });
}

function init() {
  if (timerId !== null) window.clearInterval(timerId);
  buildBoard();
  bindKeyboard();
  bindButtons();
  render();
  startLoop();
}

init();
