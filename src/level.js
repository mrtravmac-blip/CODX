import { TILE_SIZE, Tile } from "./constants.js";

export function createLevel() {
  const rows = [
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000000000000000000",
    "00000000000022200000000000000000",
    "00000000000000000000000000000000",
    "00000000000000000022000000000000",
    "00000000000000000000000000000000",
    "00000000000220000000000000000000",
    "00000000000000000000000330000000",
    "00000022000000000000000000000000",
    "00000000000000002220000000000000",
    "00000000000000000000000000000000",
    "00111000000000000000000000011100",
    "11111111111111111111111111111111",
  ];

  const tiles = rows.map((row) =>
    [...row].map((char) => {
      if (char === "1") return Tile.GROUND;
      if (char === "2") return Tile.PLATFORM;
      if (char === "3") return Tile.SPIRE;
      return Tile.EMPTY;
    }),
  );

  const collectibles = [
    orb(8, 8),
    orb(13, 2),
    orb(19, 4),
    orb(23, 9),
    orb(29, 11),
  ];

  const enemies = [
    {
      x: 14 * TILE_SIZE,
      y: 11 * TILE_SIZE,
      width: 30,
      height: 28,
      vx: 90,
      minX: 12 * TILE_SIZE,
      maxX: 18 * TILE_SIZE,
    },
  ];

  return {
    tiles,
    width: tiles[0].length * TILE_SIZE,
    height: tiles.length * TILE_SIZE,
    start: { x: TILE_SIZE * 2, y: TILE_SIZE * 10 },
    goalX: TILE_SIZE * 30,
    collectibles,
    enemies,
  };
}

function orb(tx, ty) {
  return {
    x: tx * TILE_SIZE + TILE_SIZE / 2,
    y: ty * TILE_SIZE + TILE_SIZE / 2,
    radius: 11,
    collected: false,
  };
}
