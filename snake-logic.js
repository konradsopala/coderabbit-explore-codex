export const GRID_SIZE = 20;
export const INITIAL_DIRECTION = "right";

export function createInitialState(rng = Math.random) {
  const snake = [{ x: 10, y: 10 }];
  const food = spawnFood(snake, GRID_SIZE, rng);
  return {
    snake,
    direction: INITIAL_DIRECTION,
    nextDirection: INITIAL_DIRECTION,
    food,
    score: 0,
    gameOver: false,
    paused: false,
  };
}

export function spawnFood(snake, gridSize, rng = Math.random) {
  const occupied = new Set(snake.map((s) => `${s.x},${s.y}`));
  const free = [];
  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) free.push({ x, y });
    }
  }
  if (free.length === 0) return null;
  const index = Math.floor(rng() * free.length);
  return free[index];
}

export function queueDirection(state, next) {
  const opposite = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };
  if (opposite[state.direction] === next) return state;
  return { ...state, nextDirection: next };
}

function nextHead(head, direction) {
  if (direction === "up") return { x: head.x, y: head.y - 1 };
  if (direction === "down") return { x: head.x, y: head.y + 1 };
  if (direction === "left") return { x: head.x - 1, y: head.y };
  return { x: head.x + 1, y: head.y };
}

function inBounds(point, gridSize) {
  return (
    point.x >= 0 && point.x < gridSize && point.y >= 0 && point.y < gridSize
  );
}

export function step(state, gridSize = GRID_SIZE, rng = Math.random) {
  if (state.gameOver || state.paused) return state;

  const direction = state.nextDirection;
  const head = state.snake[0];
  const newHead = nextHead(head, direction);
  if (!inBounds(newHead, gridSize)) {
    return { ...state, direction, gameOver: true };
  }

  const grows = state.food && newHead.x === state.food.x && newHead.y === state.food.y;
  const tailTrimmedSnake = grows ? state.snake : state.snake.slice(0, -1);
  const selfCollision = tailTrimmedSnake.some(
    (segment) => segment.x === newHead.x && segment.y === newHead.y,
  );
  if (selfCollision) {
    return { ...state, direction, gameOver: true };
  }

  const snake = [newHead, ...tailTrimmedSnake];
  if (grows) {
    return {
      ...state,
      snake,
      direction,
      food: spawnFood(snake, gridSize, rng),
      score: state.score + 1,
    };
  }

  return { ...state, snake, direction };
}

export function togglePause(state) {
  if (state.gameOver) return state;
  return { ...state, paused: !state.paused };
}
