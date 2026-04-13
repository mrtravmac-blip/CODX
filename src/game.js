import { TILE_SIZE } from "./constants.js";
import { updateEnemies, playerHitEnemy } from "./enemy.js";
import { createInput } from "./input.js";
import { createLevel } from "./level.js";
import { createPlayer, updatePlayer } from "./player.js";
import { draw } from "./render.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const input = createInput();

let state = newGameState();
let lastTime = performance.now();

requestAnimationFrame(frame);

function frame(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.033);
  lastTime = now;

  if (!state.message) {
    updatePlayer(state.player, input, state.level, dt);
    updateEnemies(state.level, dt);
    collectOrbs();
    updateWinOrLose();
  } else if (input.jump()) {
    state = newGameState();
  }

  const targetCamera = state.player.x - canvas.width * 0.35;
  state.cameraX = clamp(targetCamera, 0, state.level.width - canvas.width);

  draw(ctx, state);
  requestAnimationFrame(frame);
}

function collectOrbs() {
  for (const orb of state.level.collectibles) {
    if (orb.collected) continue;
    const centerX = state.player.x + state.player.width / 2;
    const centerY = state.player.y + state.player.height / 2;
    const dx = centerX - orb.x;
    const dy = centerY - orb.y;
    if (Math.hypot(dx, dy) < orb.radius + 16) {
      orb.collected = true;
      state.collected += 1;
    }
  }
}

function updateWinOrLose() {
  if (playerHitEnemy(state.player, state.level) || state.player.y > state.level.height + TILE_SIZE) {
    state.message = "Ouch! A sprite got you. Press jump to retry.";
    return;
  }

  if (state.player.x + state.player.width >= state.level.goalX && state.collected === state.totalOrbs) {
    state.message = "You restored the glade! Press jump to play again.";
    return;
  }

  if (state.player.x + state.player.width >= state.level.goalX && state.collected < state.totalOrbs) {
    state.message = "The gate needs more fairy dust. Collect every orb!";
  }
}

function newGameState() {
  const level = createLevel();
  return {
    level,
    player: createPlayer(level.start),
    collected: 0,
    totalOrbs: level.collectibles.length,
    cameraX: 0,
    message: "",
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
