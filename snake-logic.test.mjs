import test from "node:test";
import assert from "node:assert/strict";
import {
  GRID_SIZE,
  queueDirection,
  spawnFood,
  step,
} from "./snake-logic.js";

test("moves one cell in current direction", () => {
  const state = {
    snake: [{ x: 3, y: 3 }],
    direction: "right",
    nextDirection: "right",
    food: { x: 8, y: 8 },
    score: 0,
    gameOver: false,
    paused: false,
  };
  const next = step(state, GRID_SIZE, () => 0);
  assert.deepEqual(next.snake[0], { x: 4, y: 3 });
  assert.equal(next.gameOver, false);
});

test("grows and increments score when eating food", () => {
  const state = {
    snake: [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ],
    direction: "right",
    nextDirection: "right",
    food: { x: 3, y: 2 },
    score: 0,
    gameOver: false,
    paused: false,
  };
  const next = step(state, GRID_SIZE, () => 0);
  assert.equal(next.snake.length, 3);
  assert.equal(next.score, 1);
  assert.notEqual(next.food, null);
});

test("wall collision sets game over", () => {
  const state = {
    snake: [{ x: GRID_SIZE - 1, y: 1 }],
    direction: "right",
    nextDirection: "right",
    food: { x: 0, y: 0 },
    score: 0,
    gameOver: false,
    paused: false,
  };
  const next = step(state, GRID_SIZE, () => 0);
  assert.equal(next.gameOver, true);
});

test("self collision sets game over", () => {
  const state = {
    snake: [
      { x: 3, y: 3 },
      { x: 2, y: 3 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
    ],
    direction: "down",
    nextDirection: "left",
    food: { x: 9, y: 9 },
    score: 0,
    gameOver: false,
    paused: false,
  };
  const next = step(state, GRID_SIZE, () => 0);
  assert.equal(next.gameOver, true);
});

test("food placement avoids snake body", () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];
  const food = spawnFood(snake, 3, () => 0);
  assert.deepEqual(food, { x: 0, y: 1 });
});

test("prevents immediate reverse direction", () => {
  const state = {
    snake: [{ x: 1, y: 1 }],
    direction: "right",
    nextDirection: "right",
    food: { x: 3, y: 3 },
    score: 0,
    gameOver: false,
    paused: false,
  };
  const next = queueDirection(state, "left");
  assert.equal(next.nextDirection, "right");
});
