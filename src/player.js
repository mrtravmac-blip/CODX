import { GRAVITY } from "./constants.js";
import { resolveCollisions } from "./physics.js";

export function createPlayer(start) {
  return {
    x: start.x,
    y: start.y,
    width: 28,
    height: 34,
    vx: 0,
    vy: 0,
    speed: 280,
    jumpSpeed: 620,
    glideGravity: 450,
    onGround: false,
    facing: 1,
    dt: 0,
  };
}

export function updatePlayer(player, input, level, dt) {
  player.dt = dt;

  const direction = (input.left() ? -1 : 0) + (input.right() ? 1 : 0);
  player.vx = direction * player.speed;

  if (direction !== 0) player.facing = direction;

  if (input.jump() && player.onGround) {
    player.vy = -player.jumpSpeed;
    player.onGround = false;
  }

  const gravity = !player.onGround && input.jump() && player.vy > 0 ? player.glideGravity : GRAVITY;
  player.vy += gravity * dt;

  resolveCollisions(player, level);
}
