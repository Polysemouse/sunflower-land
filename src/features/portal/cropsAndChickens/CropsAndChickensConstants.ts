import { SQUARE_WIDTH } from "features/game/lib/constants";

export const UNLIMITED_ATTEMPTS_SFL = 3;
export const RESTOCK_ATTEMPTS_SFL = 1;
export const DAILY_ATTEMPTS = 5;

export const WEEKLY_MISSION_EXTRA_ATTEMPTS_GOAL = 10000;
export const WEEKLY_MISSION_EXTRA_ATTEMPTS = 2;

export const ZOOM_OUT_SCALE = 2;
export const JOYSTICK_RADIUS = 45;
export const JOYSTICK_FORCE_MIN = 6;

export const GAME_SECONDS = 120;

export const PLAYER_WALKING_SPEED = 50;

export const SPRITE_FRAME_RATE = 10;

export const TIME_TICKING_PREPARATION_SECONDS = 30;
export const TIME_TICKING_SECONDS = 10;

export const BOARD_WIDTH = SQUARE_WIDTH * 52;

export const DEPOSIT_CHEST_XY = BOARD_WIDTH - SQUARE_WIDTH / 2;

export const PLAYER_MIN_XY = BOARD_WIDTH * 0.5;
export const PLAYER_MAX_XY = BOARD_WIDTH * 1.5;

export const DEPOSIT_INDICATOR_PLAYER_DISTANCE = 50;

export const TOTAL_CROP_TYPES = 11;

export const HALLOWEEN_PLAYER_OPACITY = 0.7;

export const CROP_DEPOSIT_AREA_DIMENSIONS = {
  x: 49 * SQUARE_WIDTH,
  y: 49 * SQUARE_WIDTH,
  width: 5 * SQUARE_WIDTH,
  height: 5 * SQUARE_WIDTH,
};

export const PLAYER_DEATH_SPRITE_PROPERTIES = {
  frames: 10,
  frameWidth: 15,
  frameHeight: 22,
};

export const CHICKEN_DEATH_SPRITE_PROPERTIES = {
  frames: 10,
  frameWidth: 15,
  frameHeight: 15,
};

export const CHICKEN_SPRITE_PROPERTIES = {
  frames: 6,
  landingFrame: 4,
  frameWidth: 15,
  frameHeight: 18,
};

export const CHICKEN_SPEEDS = {
  forwardMin: 40,
  forwardMax: 80,
  maxCircularAngleOffset: 6 * (Math.PI / 180),
  maxStraightAngleOffset: 3 * (Math.PI / 180),
};

export const HUNTER_CHICKEN_INITIAL_DISTANCE = 100;
export const HUNTER_CHICKEN_SPEED_MULTIPLIER = 0.8;

export const CHICKEN_RESPAWNING_RADIUS = 16;

export type CropsAndChickensCropName =
  | "Sunflower"
  | "Potato"
  | "Pumpkin"
  | "Carrot"
  | "Cabbage"
  | "Beetroot"
  | "Cauliflower"
  | "Parsnip"
  | "Radish"
  | "Wheat"
  | "Kale";

export const CROP_TO_INDEX: { [key in CropsAndChickensCropName]?: number } = {
  Sunflower: 0,
  Potato: 1,
  Pumpkin: 2,
  Carrot: 3,
  Cabbage: 4,
  Beetroot: 5,
  Cauliflower: 6,
  Parsnip: 7,
  Radish: 8,
  Wheat: 9,
  Kale: 10,
};

export const INDEX_TO_CROP: { [key: number]: CropsAndChickensCropName } = {
  0: "Sunflower",
  1: "Potato",
  2: "Pumpkin",
  3: "Carrot",
  4: "Cabbage",
  5: "Beetroot",
  6: "Cauliflower",
  7: "Parsnip",
  8: "Radish",
  9: "Wheat",
  10: "Kale",
};

export const SCORE_TABLE: {
  [key: number]: {
    item: CropsAndChickensCropName;
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
  { cropIndex: 0, x: 46, y: 43 },
  { cropIndex: 0, x: 50, y: 43 },
  { cropIndex: 0, x: 54, y: 43 },
  { cropIndex: 1, x: 58, y: 43 },
  // ---
  { cropIndex: 0, x: 59, y: 46 },
  { cropIndex: 0, x: 59, y: 50 },
  { cropIndex: 0, x: 59, y: 54 },
  { cropIndex: 1, x: 59, y: 58 },
  // ---
  { cropIndex: 0, x: 56, y: 59 },
  { cropIndex: 0, x: 52, y: 59 },
  { cropIndex: 0, x: 48, y: 59 },
  { cropIndex: 1, x: 44, y: 59 },
  // ---
  { cropIndex: 0, x: 43, y: 56 },
  { cropIndex: 0, x: 43, y: 52 },
  { cropIndex: 0, x: 43, y: 48 },
  { cropIndex: 1, x: 43, y: 44 },

  // layer 2
  { cropIndex: 3, x: 40, y: 39 },
  { cropIndex: 2, x: 44, y: 39 },
  { cropIndex: 1, x: 48, y: 39 },
  { cropIndex: 1, x: 52, y: 39 },
  { cropIndex: 1, x: 56, y: 39 },
  { cropIndex: 2, x: 60, y: 39 },
  // ---
  { cropIndex: 3, x: 63, y: 40 },
  { cropIndex: 2, x: 63, y: 44 },
  { cropIndex: 1, x: 63, y: 48 },
  { cropIndex: 1, x: 63, y: 52 },
  { cropIndex: 1, x: 63, y: 56 },
  { cropIndex: 2, x: 63, y: 60 },
  // ---
  { cropIndex: 3, x: 62, y: 63 },
  { cropIndex: 2, x: 58, y: 63 },
  { cropIndex: 1, x: 54, y: 63 },
  { cropIndex: 1, x: 50, y: 63 },
  { cropIndex: 1, x: 46, y: 63 },
  { cropIndex: 2, x: 42, y: 63 },
  // ---
  { cropIndex: 3, x: 39, y: 62 },
  { cropIndex: 2, x: 39, y: 58 },
  { cropIndex: 1, x: 39, y: 54 },
  { cropIndex: 1, x: 39, y: 50 },
  { cropIndex: 1, x: 39, y: 46 },
  { cropIndex: 2, x: 39, y: 42 },

  // layer 3
  { cropIndex: 4, x: 38, y: 35 },
  { cropIndex: 3, x: 42, y: 35 },
  { cropIndex: 2, x: 46, y: 35 },
  { cropIndex: 2, x: 50, y: 35 },
  { cropIndex: 2, x: 54, y: 35 },
  { cropIndex: 3, x: 58, y: 35 },
  { cropIndex: 4, x: 62, y: 35 },
  { cropIndex: 5, x: 66, y: 35 },
  // ---
  { cropIndex: 4, x: 67, y: 38 },
  { cropIndex: 3, x: 67, y: 42 },
  { cropIndex: 2, x: 67, y: 46 },
  { cropIndex: 2, x: 67, y: 50 },
  { cropIndex: 2, x: 67, y: 54 },
  { cropIndex: 3, x: 67, y: 58 },
  { cropIndex: 4, x: 67, y: 62 },
  { cropIndex: 5, x: 67, y: 66 },
  // ---
  { cropIndex: 4, x: 64, y: 67 },
  { cropIndex: 3, x: 60, y: 67 },
  { cropIndex: 2, x: 56, y: 67 },
  { cropIndex: 2, x: 52, y: 67 },
  { cropIndex: 2, x: 48, y: 67 },
  { cropIndex: 3, x: 44, y: 67 },
  { cropIndex: 4, x: 40, y: 67 },
  { cropIndex: 5, x: 36, y: 67 },
  // ---
  { cropIndex: 4, x: 35, y: 64 },
  { cropIndex: 3, x: 35, y: 60 },
  { cropIndex: 2, x: 35, y: 56 },
  { cropIndex: 2, x: 35, y: 52 },
  { cropIndex: 2, x: 35, y: 48 },
  { cropIndex: 3, x: 35, y: 44 },
  { cropIndex: 4, x: 35, y: 40 },
  { cropIndex: 5, x: 35, y: 36 },

  // layer 4
  { cropIndex: 7, x: 32, y: 31 },
  { cropIndex: 6, x: 36, y: 31 },
  { cropIndex: 5, x: 40, y: 31 },
  { cropIndex: 4, x: 44, y: 31 },
  { cropIndex: 4, x: 48, y: 31 },
  { cropIndex: 4, x: 52, y: 31 },
  { cropIndex: 4, x: 56, y: 31 },
  { cropIndex: 4, x: 60, y: 31 },
  { cropIndex: 5, x: 64, y: 31 },
  { cropIndex: 6, x: 68, y: 31 },
  // ---
  { cropIndex: 7, x: 71, y: 32 },
  { cropIndex: 6, x: 71, y: 36 },
  { cropIndex: 5, x: 71, y: 40 },
  { cropIndex: 4, x: 71, y: 44 },
  { cropIndex: 4, x: 71, y: 48 },
  { cropIndex: 4, x: 71, y: 52 },
  { cropIndex: 4, x: 71, y: 56 },
  { cropIndex: 4, x: 71, y: 60 },
  { cropIndex: 5, x: 71, y: 64 },
  { cropIndex: 6, x: 71, y: 68 },
  // ---
  { cropIndex: 7, x: 70, y: 71 },
  { cropIndex: 6, x: 66, y: 71 },
  { cropIndex: 5, x: 62, y: 71 },
  { cropIndex: 4, x: 58, y: 71 },
  { cropIndex: 4, x: 54, y: 71 },
  { cropIndex: 4, x: 50, y: 71 },
  { cropIndex: 4, x: 46, y: 71 },
  { cropIndex: 4, x: 42, y: 71 },
  { cropIndex: 5, x: 38, y: 71 },
  { cropIndex: 6, x: 34, y: 71 },
  // ---
  { cropIndex: 7, x: 31, y: 70 },
  { cropIndex: 6, x: 31, y: 66 },
  { cropIndex: 5, x: 31, y: 62 },
  { cropIndex: 4, x: 31, y: 58 },
  { cropIndex: 4, x: 31, y: 54 },
  { cropIndex: 4, x: 31, y: 50 },
  { cropIndex: 4, x: 31, y: 46 },
  { cropIndex: 4, x: 31, y: 42 },
  { cropIndex: 5, x: 31, y: 38 },
  { cropIndex: 6, x: 31, y: 34 },

  // layer 5
  { cropIndex: 8, x: 30, y: 27 },
  { cropIndex: 7, x: 34, y: 27 },
  { cropIndex: 6, x: 38, y: 27 },
  { cropIndex: 6, x: 42, y: 27 },
  { cropIndex: 6, x: 46, y: 27 },
  { cropIndex: 6, x: 50, y: 27 },
  { cropIndex: 6, x: 54, y: 27 },
  { cropIndex: 6, x: 58, y: 27 },
  { cropIndex: 6, x: 62, y: 27 },
  { cropIndex: 7, x: 66, y: 27 },
  { cropIndex: 8, x: 70, y: 27 },
  { cropIndex: 9, x: 74, y: 27 },
  // ---
  { cropIndex: 8, x: 75, y: 30 },
  { cropIndex: 7, x: 75, y: 34 },
  { cropIndex: 6, x: 75, y: 38 },
  { cropIndex: 6, x: 75, y: 42 },
  { cropIndex: 6, x: 75, y: 46 },
  { cropIndex: 6, x: 75, y: 50 },
  { cropIndex: 6, x: 75, y: 54 },
  { cropIndex: 6, x: 75, y: 58 },
  { cropIndex: 6, x: 75, y: 62 },
  { cropIndex: 7, x: 75, y: 66 },
  { cropIndex: 8, x: 75, y: 70 },
  { cropIndex: 9, x: 75, y: 74 },
  // ---
  { cropIndex: 8, x: 72, y: 75 },
  { cropIndex: 7, x: 68, y: 75 },
  { cropIndex: 6, x: 64, y: 75 },
  { cropIndex: 6, x: 60, y: 75 },
  { cropIndex: 6, x: 56, y: 75 },
  { cropIndex: 6, x: 52, y: 75 },
  { cropIndex: 6, x: 48, y: 75 },
  { cropIndex: 6, x: 44, y: 75 },
  { cropIndex: 6, x: 40, y: 75 },
  { cropIndex: 7, x: 36, y: 75 },
  { cropIndex: 8, x: 32, y: 75 },
  { cropIndex: 9, x: 28, y: 75 },
  // ---
  { cropIndex: 8, x: 27, y: 72 },
  { cropIndex: 7, x: 27, y: 68 },
  { cropIndex: 6, x: 27, y: 64 },
  { cropIndex: 6, x: 27, y: 60 },
  { cropIndex: 6, x: 27, y: 56 },
  { cropIndex: 6, x: 27, y: 52 },
  { cropIndex: 6, x: 27, y: 48 },
  { cropIndex: 6, x: 27, y: 44 },
  { cropIndex: 6, x: 27, y: 40 },
  { cropIndex: 7, x: 27, y: 36 },
  { cropIndex: 8, x: 27, y: 32 },
  { cropIndex: 9, x: 27, y: 28 },

  // layer 6
  { cropIndex: 10, x: 25, y: 25 },
];

// the number of chickens per straight rail in board coordinates
export const NORMAL_CHICKEN_STRAIGHT_RAIL_CONFIGURATIONS: {
  count: number;
  rail: number;
}[] = [
  { count: 15, rail: 27 },
  { count: 10, rail: 31 },
  { count: 6, rail: 35 },
  { count: 3, rail: 39 },
  { count: 1, rail: 43 },
  { count: 1, rail: 59 },
  { count: 3, rail: 63 },
  { count: 6, rail: 67 },
  { count: 10, rail: 71 },
  { count: 15, rail: 75 },
];

// the number of chickens per circular rail in radii in board coordinates
export const NORMAL_CHICKEN_CIRCULAR_RAIL_CONFIGURATIONS: {
  count: number;
  rail: number;
}[] = [
  { count: 30, rail: 37 },
  { count: 20, rail: 30.5 },
  { count: 12, rail: 24 },
  { count: 6, rail: 17.5 },
  { count: 2, rail: 11 },
];
