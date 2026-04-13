# Fairy Glade Platformer

A tiny 2D side-scrolling platformer prototype inspired by NES-era platform games.
You play as a winged fairy exploring a magical forest with floating platforms,
glowing plants, roaming sprites, and collectible fairy orbs.

## Features

- Side-scrolling camera that follows the player.
- Movement: left/right, jump, and gentle glide (hold jump while falling).
- Gravity + tile collisions for ground and floating platforms.
- Tile-grid level data defined in JavaScript arrays.
- Collectible glowing orbs (collect all to unlock the goal).
- One enemy type that patrols back and forth.
- Win condition: collect all orbs and reach the goal banner.

## Controls

- **Move**: `Arrow Left/Right` or `A/D`
- **Jump**: `Arrow Up`, `W`, or `Space`
- **Glide**: hold a jump key while descending
- **Restart after win/lose message**: press jump key

## Run locally

Because this uses ES modules, run it from a local web server (not `file://`).

### Option 1: Python (most common)

```bash
python3 -m http.server 8000
```

Then open:

- <http://localhost:8000>

### Option 2: Node.js (if you have `npx`)

```bash
npx serve .
```

Open the URL shown in your terminal.

## Project structure

- `index.html` – canvas and bootstrapping.
- `style.css` – simple magical visual style and layout.
- `src/game.js` – game loop, win/lose state, camera, orchestration.
- `src/player.js` – player movement/jump/glide logic.
- `src/physics.js` – tile collision and overlap helpers.
- `src/level.js` – tile map, enemy placement, collectibles.
- `src/enemy.js` – enemy patrol behavior.
- `src/render.js` – all drawing functions.
- `src/input.js` – keyboard input handling.

## Extend ideas

- Add more enemy behaviors.
- Add checkpoints and lives.
- Replace placeholder shapes with sprite sheets.
- Add multiple levels loaded from JSON.
