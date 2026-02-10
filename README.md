# Classic Snake

A minimal browser-based implementation of the classic Snake game.

## How the game works

- The board is a fixed 20x20 grid.
- The snake moves one cell per tick.
- Controls:
  - Keyboard: Arrow keys or WASD to move
  - `Space` to pause/resume
  - `R` to restart
  - On-screen arrow buttons for mobile/touch
- Eating food increases snake length and score by 1.
- The game ends if the snake hits a wall or its own body.
- Use the **Restart** button (or `R`) to start over.

## Run locally

### Option 1: quick static server

From the repository root:

```bash
python3 -m http.server 5173
```

Then open:

- `http://localhost:5173`

### Option 2: run tests

```bash
npm test
```

This runs the core game-logic tests (movement, growth, collisions, food placement).

## Project files

- `index.html`: page shell and controls
- `styles.css`: minimal styling
- `snake.js`: browser game loop + rendering + input handling
- `snake-logic.js`: deterministic game state logic
- `snake-logic.test.mjs`: tests for core logic
