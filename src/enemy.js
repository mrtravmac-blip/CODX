import { overlaps } from "./physics.js";

export function updateEnemies(level, dt) {
  for (const enemy of level.enemies) {
    enemy.x += enemy.vx * dt;
    if (enemy.x < enemy.minX) {
      enemy.x = enemy.minX;
      enemy.vx *= -1;
    }
    if (enemy.x + enemy.width > enemy.maxX) {
      enemy.x = enemy.maxX - enemy.width;
      enemy.vx *= -1;
    }
  }
}

export function playerHitEnemy(player, level) {
  return level.enemies.some((enemy) => overlaps(player, enemy));
}
