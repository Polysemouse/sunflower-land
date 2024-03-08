export type PortalName =
  | "crops-and-chickens"
  | "crop-boom"
  | "bumpkin-fight-club"
  | "bumpkin-board-game"
  | "sfl-world"
  | "maze-run"
  | "board-game"
  | "chicken-rescue";

export const SUPPORTED_PORTALS: PortalName[] = [
  "crops-and-chickens",
  "crop-boom",
  "bumpkin-fight-club",
  "bumpkin-board-game",
  "sfl-world",
  "maze-run",
  "board-game",
  "chicken-rescue",
];

export const MAX_TOTAL_ARCADE_TOKENS = 50;

export const DAILY_ARCADE_TOKENS: Record<PortalName, number> = {
  "crops-and-chickens": 1,
  "crop-boom": 1,
  "bumpkin-fight-club": 1,
  "bumpkin-board-game": 1,
  "sfl-world": 1,
  "maze-run": 1,

  "board-game": 0,
  "chicken-rescue": 0,
};
