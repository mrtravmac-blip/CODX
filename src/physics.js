import { TILE_SIZE, Tile } from "./constants.js";

export function getTileAt(level, x, y) {
  const tx = Math.floor(x / TILE_SIZE);
  const ty = Math.floor(y / TILE_SIZE);
  const row = level.tiles[ty];
  if (!row) return Tile.EMPTY;
  return row[tx] ?? Tile.EMPTY;
}

export function isSolid(tile) {
  return tile === Tile.GROUND || tile === Tile.PLATFORM || tile === Tile.SPIRE;
}

export function resolveCollisions(body, level) {
  body.onGround = false;

  body.x += body.vx * body.dt;
  let left = body.x;
  let right = body.x + body.width;
  let top = body.y;
  let bottom = body.y + body.height;

  if (body.vx > 0) {
    const tileX = right;
    if (
      isSolid(getTileAt(level, tileX, top + 2)) ||
      isSolid(getTileAt(level, tileX, bottom - 2))
    ) {
      body.x = Math.floor(tileX / TILE_SIZE) * TILE_SIZE - body.width - 0.01;
      body.vx = 0;
    }
  } else if (body.vx < 0) {
    const tileX = left;
    if (
      isSolid(getTileAt(level, tileX, top + 2)) ||
      isSolid(getTileAt(level, tileX, bottom - 2))
    ) {
      body.x = Math.floor(tileX / TILE_SIZE + 1) * TILE_SIZE + 0.01;
      body.vx = 0;
    }
  }

  body.y += body.vy * body.dt;
  left = body.x;
  right = body.x + body.width;
  top = body.y;
  bottom = body.y + body.height;

  if (body.vy > 0) {
    const tileY = bottom;
    if (
      isSolid(getTileAt(level, left + 3, tileY)) ||
      isSolid(getTileAt(level, right - 3, tileY))
    ) {
      body.y = Math.floor(tileY / TILE_SIZE) * TILE_SIZE - body.height - 0.01;
      body.vy = 0;
      body.onGround = true;
    }
  } else if (body.vy < 0) {
    const tileY = top;
    if (
      isSolid(getTileAt(level, left + 3, tileY)) ||
      isSolid(getTileAt(level, right - 3, tileY))
    ) {
      body.y = Math.floor(tileY / TILE_SIZE + 1) * TILE_SIZE + 0.01;
      body.vy = 0;
    }
  }
}

export function overlaps(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
