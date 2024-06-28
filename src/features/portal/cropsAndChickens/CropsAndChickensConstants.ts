import { SQUARE_WIDTH } from "features/game/lib/constants";
import { InventoryItemName } from "features/game/types/game";

export const UNLIMITED_ATTEMPTS_SFL = 5;
export const RESTOCK_ATTEMPTS_SFL = 1;
export const WEEKLY_ATTEMPTS = 5;

export const GAME_SECONDS = 120;

export const PLAYER_WALKING_SPEED = 50;

export const SPRITE_FRAME_RATE = 10;

export const TIME_TICKING_SECONDS = 10;

export const BOARD_OFFSET = SQUARE_WIDTH * 2;
export const BOARD_WIDTH = SQUARE_WIDTH * 52;

export const DEPOSIT_CHEST_XY = BOARD_WIDTH + BOARD_OFFSET - SQUARE_WIDTH / 2;

export const PLAYER_MIN_XY = BOARD_WIDTH * 0.5 + BOARD_OFFSET;
export const PLAYER_MAX_XY = BOARD_WIDTH * 1.5 + BOARD_OFFSET;

export const DEPOSIT_INDICATOR_PLAYER_DISTANCE = 50;

export const TOTAL_CROP_TYPES = 11;

export const CROP_DEPOSIT_AREA_DIMENSIONS = {
  x: 51 * SQUARE_WIDTH,
  y: 51 * SQUARE_WIDTH,
  width: 5 * SQUARE_WIDTH,
  height: 5 * SQUARE_WIDTH,
};

export const PLAYER_DEATH_SPRITE_PROPERTIES = {
  frames: 10,
  frameWidth: 15,
  frameHeight: 22,
};

export const CHICKEN_SPRITE_PROPERTIES = {
  frames: 6,
  frameWidth: 13,
  frameHeight: 14,
};

export const CHICKEN_SPEEDS = {
  forwardMin: 40,
  forwardMax: 80,
  sidewaysMax: 6,
};

export const HUNTER_CHICKEN_INITIAL_DISTANCE = 100;
export const HUNTER_CHICKEN_SPEED_MULTIPLIER = 0.8;

export const SCORE_TABLE: {
  [key: number]: {
    item: InventoryItemName;
    points: number;
  };
} = {
  0: { item: "Sunflower", points: 1 },
  1: { item: "Potato", points: 2 },
  2: { item: "Pumpkin", points: 5 },
  3: { item: "Carrot", points: 10 },
  4: { item: "Cabbage", points: 20 },
  5: { item: "Beetroot", points: 50 },
  6: { item: "Cauliflower", points: 100 },
  7: { item: "Parsnip", points: 250 },
  8: { item: "Radish", points: 1000 },
  9: { item: "Wheat", points: 2500 },
  10: { item: "Kale", points: 10000 },
};

// the crops positions in board coordinates
export const CROP_SPAWN_CONFIGURATIONS: {
  cropIndex: number;
  x: number;
  y: number;
}[] = [
  // layer 1
  { cropIndex: 0, x: 48, y: 45 },
  { cropIndex: 0, x: 52, y: 45 },
  { cropIndex: 0, x: 56, y: 45 },
  { cropIndex: 1, x: 60, y: 45 },
  // ---
  { cropIndex: 0, x: 61, y: 48 },
  { cropIndex: 0, x: 61, y: 52 },
  { cropIndex: 0, x: 61, y: 56 },
  { cropIndex: 1, x: 61, y: 60 },
  // ---
  { cropIndex: 0, x: 58, y: 61 },
  { cropIndex: 0, x: 54, y: 61 },
  { cropIndex: 0, x: 50, y: 61 },
  { cropIndex: 1, x: 46, y: 61 },
  // ---
  { cropIndex: 0, x: 45, y: 58 },
  { cropIndex: 0, x: 45, y: 54 },
  { cropIndex: 0, x: 45, y: 50 },
  { cropIndex: 1, x: 45, y: 46 },

  // layer 2
  { cropIndex: 3, x: 42, y: 41 },
  { cropIndex: 2, x: 46, y: 41 },
  { cropIndex: 1, x: 50, y: 41 },
  { cropIndex: 1, x: 54, y: 41 },
  { cropIndex: 1, x: 58, y: 41 },
  { cropIndex: 2, x: 62, y: 41 },
  // ---
  { cropIndex: 3, x: 65, y: 42 },
  { cropIndex: 2, x: 65, y: 46 },
  { cropIndex: 1, x: 65, y: 50 },
  { cropIndex: 1, x: 65, y: 54 },
  { cropIndex: 1, x: 65, y: 58 },
  { cropIndex: 2, x: 65, y: 62 },
  // ---
  { cropIndex: 3, x: 64, y: 65 },
  { cropIndex: 2, x: 60, y: 65 },
  { cropIndex: 1, x: 56, y: 65 },
  { cropIndex: 1, x: 52, y: 65 },
  { cropIndex: 1, x: 48, y: 65 },
  { cropIndex: 2, x: 44, y: 65 },
  // ---
  { cropIndex: 3, x: 41, y: 64 },
  { cropIndex: 2, x: 41, y: 60 },
  { cropIndex: 1, x: 41, y: 56 },
  { cropIndex: 1, x: 41, y: 52 },
  { cropIndex: 1, x: 41, y: 48 },
  { cropIndex: 2, x: 41, y: 44 },

  // layer 3
  { cropIndex: 4, x: 40, y: 37 },
  { cropIndex: 3, x: 44, y: 37 },
  { cropIndex: 2, x: 48, y: 37 },
  { cropIndex: 2, x: 52, y: 37 },
  { cropIndex: 2, x: 56, y: 37 },
  { cropIndex: 3, x: 60, y: 37 },
  { cropIndex: 4, x: 64, y: 37 },
  { cropIndex: 5, x: 68, y: 37 },
  // ---
  { cropIndex: 4, x: 69, y: 40 },
  { cropIndex: 3, x: 69, y: 44 },
  { cropIndex: 2, x: 69, y: 48 },
  { cropIndex: 2, x: 69, y: 52 },
  { cropIndex: 2, x: 69, y: 56 },
  { cropIndex: 3, x: 69, y: 60 },
  { cropIndex: 4, x: 69, y: 64 },
  { cropIndex: 5, x: 69, y: 68 },
  // ---
  { cropIndex: 4, x: 66, y: 69 },
  { cropIndex: 3, x: 62, y: 69 },
  { cropIndex: 2, x: 58, y: 69 },
  { cropIndex: 2, x: 54, y: 69 },
  { cropIndex: 2, x: 50, y: 69 },
  { cropIndex: 3, x: 46, y: 69 },
  { cropIndex: 4, x: 42, y: 69 },
  { cropIndex: 5, x: 38, y: 69 },
  // ---
  { cropIndex: 4, x: 37, y: 66 },
  { cropIndex: 3, x: 37, y: 62 },
  { cropIndex: 2, x: 37, y: 58 },
  { cropIndex: 2, x: 37, y: 54 },
  { cropIndex: 2, x: 37, y: 50 },
  { cropIndex: 3, x: 37, y: 46 },
  { cropIndex: 4, x: 37, y: 42 },
  { cropIndex: 5, x: 37, y: 38 },

  // layer 4
  { cropIndex: 7, x: 34, y: 33 },
  { cropIndex: 6, x: 38, y: 33 },
  { cropIndex: 5, x: 42, y: 33 },
  { cropIndex: 4, x: 46, y: 33 },
  { cropIndex: 4, x: 50, y: 33 },
  { cropIndex: 4, x: 54, y: 33 },
  { cropIndex: 4, x: 58, y: 33 },
  { cropIndex: 4, x: 62, y: 33 },
  { cropIndex: 5, x: 66, y: 33 },
  { cropIndex: 6, x: 70, y: 33 },
  // ---
  { cropIndex: 7, x: 73, y: 34 },
  { cropIndex: 6, x: 73, y: 38 },
  { cropIndex: 5, x: 73, y: 42 },
  { cropIndex: 4, x: 73, y: 46 },
  { cropIndex: 4, x: 73, y: 50 },
  { cropIndex: 4, x: 73, y: 54 },
  { cropIndex: 4, x: 73, y: 58 },
  { cropIndex: 4, x: 73, y: 62 },
  { cropIndex: 5, x: 73, y: 66 },
  { cropIndex: 6, x: 73, y: 70 },
  // ---
  { cropIndex: 7, x: 72, y: 73 },
  { cropIndex: 6, x: 68, y: 73 },
  { cropIndex: 5, x: 64, y: 73 },
  { cropIndex: 4, x: 60, y: 73 },
  { cropIndex: 4, x: 56, y: 73 },
  { cropIndex: 4, x: 52, y: 73 },
  { cropIndex: 4, x: 48, y: 73 },
  { cropIndex: 4, x: 44, y: 73 },
  { cropIndex: 5, x: 40, y: 73 },
  { cropIndex: 6, x: 36, y: 73 },
  // ---
  { cropIndex: 7, x: 33, y: 72 },
  { cropIndex: 6, x: 33, y: 68 },
  { cropIndex: 5, x: 33, y: 64 },
  { cropIndex: 4, x: 33, y: 60 },
  { cropIndex: 4, x: 33, y: 56 },
  { cropIndex: 4, x: 33, y: 52 },
  { cropIndex: 4, x: 33, y: 48 },
  { cropIndex: 4, x: 33, y: 44 },
  { cropIndex: 5, x: 33, y: 40 },
  { cropIndex: 6, x: 33, y: 36 },

  // layer 5
  { cropIndex: 8, x: 32, y: 29 },
  { cropIndex: 7, x: 36, y: 29 },
  { cropIndex: 6, x: 40, y: 29 },
  { cropIndex: 6, x: 44, y: 29 },
  { cropIndex: 6, x: 48, y: 29 },
  { cropIndex: 6, x: 52, y: 29 },
  { cropIndex: 6, x: 56, y: 29 },
  { cropIndex: 6, x: 60, y: 29 },
  { cropIndex: 6, x: 64, y: 29 },
  { cropIndex: 7, x: 68, y: 29 },
  { cropIndex: 8, x: 72, y: 29 },
  { cropIndex: 9, x: 76, y: 29 },
  // ---
  { cropIndex: 8, x: 77, y: 32 },
  { cropIndex: 7, x: 77, y: 36 },
  { cropIndex: 6, x: 77, y: 40 },
  { cropIndex: 6, x: 77, y: 44 },
  { cropIndex: 6, x: 77, y: 48 },
  { cropIndex: 6, x: 77, y: 52 },
  { cropIndex: 6, x: 77, y: 56 },
  { cropIndex: 6, x: 77, y: 60 },
  { cropIndex: 6, x: 77, y: 64 },
  { cropIndex: 7, x: 77, y: 68 },
  { cropIndex: 8, x: 77, y: 72 },
  { cropIndex: 9, x: 77, y: 76 },
  // ---
  { cropIndex: 8, x: 74, y: 77 },
  { cropIndex: 7, x: 70, y: 77 },
  { cropIndex: 6, x: 66, y: 77 },
  { cropIndex: 6, x: 62, y: 77 },
  { cropIndex: 6, x: 58, y: 77 },
  { cropIndex: 6, x: 54, y: 77 },
  { cropIndex: 6, x: 50, y: 77 },
  { cropIndex: 6, x: 46, y: 77 },
  { cropIndex: 6, x: 42, y: 77 },
  { cropIndex: 7, x: 38, y: 77 },
  { cropIndex: 8, x: 34, y: 77 },
  { cropIndex: 9, x: 30, y: 77 },
  // ---
  { cropIndex: 8, x: 29, y: 74 },
  { cropIndex: 7, x: 29, y: 70 },
  { cropIndex: 6, x: 29, y: 66 },
  { cropIndex: 6, x: 29, y: 62 },
  { cropIndex: 6, x: 29, y: 58 },
  { cropIndex: 6, x: 29, y: 54 },
  { cropIndex: 6, x: 29, y: 50 },
  { cropIndex: 6, x: 29, y: 46 },
  { cropIndex: 6, x: 29, y: 42 },
  { cropIndex: 7, x: 29, y: 38 },
  { cropIndex: 8, x: 29, y: 34 },
  { cropIndex: 9, x: 29, y: 30 },

  // layer 6
  { cropIndex: 10, x: 27, y: 27 },
];

// the number of chickens per track in board coordinates
export const CHICKEN_SPAWN_CONFIGURATIONS: { count: number; track: number }[] =
  [
    { count: 15, track: 29 },
    { count: 10, track: 33 },
    { count: 6, track: 37 },
    { count: 3, track: 41 },
    { count: 1, track: 45 },
    { count: 1, track: 61 },
    { count: 3, track: 65 },
    { count: 6, track: 69 },
    { count: 10, track: 73 },
    { count: 15, track: 77 },
  ];
