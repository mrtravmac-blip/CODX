import { COLORS, TILE_SIZE, Tile } from "./constants.js";

export function draw(ctx, state) {
  const { cameraX, level, player, message } = state;

  const grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  grad.addColorStop(0, COLORS.skyTop);
  grad.addColorStop(1, COLORS.skyBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  drawBackgroundPlants(ctx, cameraX);
  drawTiles(ctx, level, cameraX);
  drawCollectibles(ctx, level.collectibles, cameraX);
  drawEnemies(ctx, level.enemies, cameraX);
  drawGoal(ctx, level.goalX, cameraX);
  drawPlayer(ctx, player, cameraX);
  drawHud(ctx, state);

  if (message) {
    ctx.fillStyle = "rgba(24, 16, 46, 0.8)";
    ctx.fillRect(120, 200, 720, 140);
    ctx.fillStyle = "#fff";
    ctx.font = "36px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText(message, ctx.canvas.width / 2, 280);
  }
}

function drawTiles(ctx, level, cameraX) {
  for (let y = 0; y < level.tiles.length; y++) {
    for (let x = 0; x < level.tiles[y].length; x++) {
      const tile = level.tiles[y][x];
      if (tile === Tile.EMPTY) continue;

      const px = x * TILE_SIZE - cameraX;
      const py = y * TILE_SIZE;

      if (tile === Tile.GROUND) ctx.fillStyle = COLORS.ground;
      if (tile === Tile.PLATFORM) ctx.fillStyle = COLORS.platform;
      if (tile === Tile.SPIRE) ctx.fillStyle = COLORS.spire;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, 8);
    }
  }
}

function drawBackgroundPlants(ctx, cameraX) {
  for (let i = 0; i < 14; i++) {
    const x = i * 220 - (cameraX * 0.35) % 220;
    const baseY = 500;
    ctx.fillStyle = "rgba(173, 255, 227, 0.2)";
    ctx.beginPath();
    ctx.arc(x, baseY, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(140, 255, 199, 0.3)";
    ctx.fillRect(x - 4, baseY - 45, 8, 45);
  }
}

function drawPlayer(ctx, player, cameraX) {
  const x = player.x - cameraX;
  const y = player.y;

  ctx.fillStyle = COLORS.playerWing;
  ctx.beginPath();
  ctx.ellipse(x + 8, y + 15, 12, 7, -0.4 * player.facing, 0, Math.PI * 2);
  ctx.ellipse(x + 20, y + 15, 12, 7, 0.4 * player.facing, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.playerBody;
  ctx.beginPath();
  ctx.roundRect(x, y, player.width, player.height, 10);
  ctx.fill();

  ctx.fillStyle = "#553773";
  ctx.beginPath();
  ctx.arc(x + (player.facing === 1 ? 20 : 8), y + 12, 2.8, 0, Math.PI * 2);
  ctx.fill();
}

function drawCollectibles(ctx, collectibles, cameraX) {
  for (const orb of collectibles) {
    if (orb.collected) continue;

    const pulse = 8 + Math.sin((orb.x + performance.now() * 0.005) * 0.04) * 2;
    ctx.fillStyle = "rgba(155,255,202,0.25)";
    ctx.beginPath();
    ctx.arc(orb.x - cameraX, orb.y, pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = COLORS.orb;
    ctx.beginPath();
    ctx.arc(orb.x - cameraX, orb.y, orb.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawEnemies(ctx, enemies, cameraX) {
  ctx.fillStyle = COLORS.enemy;
  for (const enemy of enemies) {
    ctx.beginPath();
    ctx.roundRect(enemy.x - cameraX, enemy.y, enemy.width, enemy.height, 8);
    ctx.fill();

    ctx.fillStyle = "#612249";
    ctx.fillRect(enemy.x - cameraX + 6, enemy.y + 8, 4, 4);
    ctx.fillRect(enemy.x - cameraX + enemy.width - 10, enemy.y + 8, 4, 4);
    ctx.fillStyle = COLORS.enemy;
  }
}

function drawGoal(ctx, goalX, cameraX) {
  const x = goalX - cameraX;
  ctx.fillStyle = "#ffdb8d";
  ctx.fillRect(x, 320, 6, 170);
  ctx.fillStyle = "#ffe9b7";
  ctx.beginPath();
  ctx.moveTo(x + 6, 330);
  ctx.lineTo(x + 70, 348);
  ctx.lineTo(x + 6, 366);
  ctx.closePath();
  ctx.fill();
}

function drawHud(ctx, state) {
  ctx.fillStyle = "rgba(34, 24, 68, 0.65)";
  ctx.fillRect(20, 18, 220, 54);
  ctx.fillStyle = "#f4efff";
  ctx.font = "22px Trebuchet MS";
  ctx.textAlign = "left";
  ctx.fillText(`Orbs: ${state.collected}/${state.totalOrbs}`, 30, 53);
}
