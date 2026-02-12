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
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  const free = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const point = `${x},${y}`;
      if (!occupied.has(point)) free.push({ x, y });
    }
  }

  if (free.length === 0) return null;
  const index = Math.floor(rng() * free.length);
  return free[index];
}

export function queueDirection(state, nextDirection) {
  const opposite = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };
  if (opposite[state.direction] === nextDirection) return state;
  return { ...state, nextDirection };
}

function getNextHead(head, direction) {
  if (direction === "up") return { x: head.x, y: head.y - 1 };
  if (direction === "down") return { x: head.x, y: head.y + 1 };
  if (direction === "left") return { x: head.x - 1, y: head.y };
  return { x: head.x + 1, y: head.y };
}

function isInBounds(point, gridSize) {
  return point.x >= 0 && point.x < gridSize && point.y >= 0 && point.y < gridSize;
}

export function step(state, gridSize = GRID_SIZE, rng = Math.random) {
  if (state.gameOver || state.paused) return state;

  const direction = state.nextDirection;
  const head = state.snake[0];
  const nextHead = getNextHead(head, direction);

  if (!isInBounds(nextHead, gridSize)) {
    return { ...state, direction, gameOver: true };
  }

  const grows = Boolean(state.food) && nextHead.x === state.food.x && nextHead.y === state.food.y;
  const movedBody = grows ? state.snake : state.snake.slice(0, -1);
  const hitsBody = movedBody.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);

  if (hitsBody) {
    return { ...state, direction, gameOver: true };
  }

  const nextSnake = [nextHead, ...movedBody];

  if (grows) {
    return {
      ...state,
      snake: nextSnake,
      direction,
      food: spawnFood(nextSnake, gridSize, rng),
      score: state.score + 1,
    };
  }

  return {
    ...state,
    snake: nextSnake,
    direction,
  };
}

export function togglePause(state) {
  if (state.gameOver) return state;
  return { ...state, paused: !state.paused };
}
