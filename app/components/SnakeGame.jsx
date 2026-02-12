"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GRID_SIZE,
  createInitialState,
  queueDirection,
  step,
  togglePause,
} from "../../lib/snake-logic";

const TICK_MS = 130;

export default function SnakeGame() {
  const [state, setState] = useState(() => createInitialState());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setState((current) => step(current, GRID_SIZE));
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, []);

  const onDirection = useCallback((direction) => {
    setState((current) => queueDirection(current, direction));
  }, []);

  const onRestart = useCallback(() => {
    setState(createInitialState());
  }, []);

  const onPause = useCallback(() => {
    setState((current) => togglePause(current));
  }, []);

  useEffect(() => {
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

    const onKeyDown = (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === " " || key === "Spacebar") {
        event.preventDefault();
        onPause();
        return;
      }
      if (key === "r") {
        onRestart();
        return;
      }
      const direction = map[key];
      if (!direction) return;
      event.preventDefault();
      onDirection(direction);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onDirection, onPause, onRestart]);

  const snakeSet = useMemo(() => {
    return new Set(state.snake.map((segment) => `${segment.x},${segment.y}`));
  }, [state.snake]);

  const cells = useMemo(() => {
    const all = [];
    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        const key = `${x},${y}`;
        const isSnake = snakeSet.has(key);
        const isFood = state.food && state.food.x === x && state.food.y === y;
        all.push({ key, isSnake, isFood });
      }
    }
    return all;
  }, [snakeSet, state.food]);

  const status = state.gameOver ? "Game Over" : state.paused ? "Paused" : "Running";

  return (
    <section>
      <div className="hud">
        <p>Score: <span>{state.score}</span></p>
        <p>Status: <span>{status}</span></p>
      </div>

      <div className="board-wrap" aria-label="Snake board" role="grid">
        <div className="board">
          {cells.map((cell) => (
            <div
              key={cell.key}
              className={`cell${cell.isSnake ? " snake" : ""}${cell.isFood ? " food" : ""}`}
            />
          ))}
        </div>
      </div>

      <div className="actions">
        <button type="button" onClick={onPause}>{state.paused ? "Resume" : "Pause"}</button>
        <button type="button" onClick={onRestart}>Restart</button>
      </div>

      <div className="controls" aria-label="Touch controls">
        <div />
        <button type="button" onClick={() => onDirection("up")}>↑</button>
        <div />
        <button type="button" onClick={() => onDirection("left")}>←</button>
        <button type="button" onClick={() => onDirection("down")}>↓</button>
        <button type="button" onClick={() => onDirection("right")}>→</button>
      </div>

      <p className="help">Controls: Arrow keys / WASD, Space to pause, R to restart.</p>
    </section>
  );
}
