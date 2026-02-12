# Snake (Next.js Rewrite)

Classic Snake implemented as a minimal Next.js app using the App Router.

## How the game works

- Board size: fixed `20x20` grid.
- Tick loop: snake advances one cell every tick.
- Controls:
  - Keyboard: Arrow keys or `WASD`
  - `Space`: pause/resume
  - `R`: restart
  - On-screen directional buttons for touch/mobile
- Eating food increases snake length and score by `1`.
- Game over occurs on wall collision or self collision.
- Restart resets snake, direction, score, and food.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open:

- [http://localhost:3000](http://localhost:3000)

## Test core game logic

```bash
npm test
```

The tests cover movement, growth, collisions, food placement, and direction reversal rules.

## Structure

- `app/page.js`: page entry
- `app/components/SnakeGame.jsx`: client game UI + input + tick loop
- `app/globals.css`: minimal styling
- `lib/snake-logic.js`: deterministic game-state logic
- `tests/snake-logic.test.mjs`: unit tests for core logic
