import { OFFLINE_FARM } from "features/game/lib/landData";
import { assign, createMachine, Interpreter, State } from "xstate";
import { CONFIG } from "lib/config";
import { decodeToken } from "features/auth/actions/login";
import {
  GAME_SECONDS,
  RESTOCK_ATTEMPTS_SFL,
  UNLIMITED_ATTEMPTS_SFL,
  DAILY_ATTEMPTS,
  SCORE_TABLE,
} from "../CropsAndChickensConstants";
import { GameState } from "features/game/types/game";
import { purchaseMinigameItem } from "features/game/events/minigames/purchaseMinigameItem";
import {
  achievementsUnlocked,
  startAttempt,
  submitScore,
} from "features/portal/lib/portalUtil";
import { getJwt, getUrl, loadPortal } from "features/portal/actions/loadPortal";
import { getAttemptsLeft } from "./cropsAndChickensUtils";
import { unlockMinigameAchievements } from "features/game/events/minigames/unlockMinigameAchievements";
import { CropsAndChickensAchievementName } from "../CropsAndChickensAchievements";
import { submitMinigameScore } from "features/game/events/minigames/submitMinigameScore";
import { startMinigameAttempt } from "features/game/events/minigames/startMinigameAttempt";

export interface Context {
  id: number;
  jwt: string;
  isJoystickActive: boolean;
  isSmallScreen: boolean;
  state: GameState | undefined;
  score: number;
  inventory: number;
  depositedCropIndexes: number[];
  harvestedCropIndexes: number[];
  inventoryCropIndexes: number[];
  endAt: number;
  attemptsLeft: number;
}

type CropHarvestedEvent = {
  type: "CROP_HARVESTED";
  cropIndex: number;
};

type UnlockAchievementsEvent = {
  type: "UNLOCKED_ACHIEVEMENTS";
  achievementNames: CropsAndChickensAchievementName[];
};

type SetIsJoystickActiveEvent = {
  type: "SET_IS_JOYSTICK_ACTIVE";
  isJoystickActive: boolean;
};

type SetIsSmallScreenEvent = {
  type: "SET_IS_SMALL_SCREEN";
  isSmallScreen: boolean;
};

export type PortalEvent =
  | SetIsJoystickActiveEvent
  | SetIsSmallScreenEvent
  | { type: "START" }
  | { type: "CLAIM" }
  | { type: "CANCEL_PURCHASE" }
  | { type: "PURCHASED_RESTOCK" }
  | { type: "PURCHASED_UNLIMITED" }
  | { type: "RETRY" }
  | { type: "CONTINUE" }
  | { type: "END_GAME_EARLY" }
  | { type: "GAME_OVER" }
  | CropHarvestedEvent
  | { type: "CROP_DEPOSITED" }
  | { type: "PLAYER_KILLED" }
  | UnlockAchievementsEvent;

export type PortalState = {
  value:
    | "initialising"
    | "error"
    | "ready"
    | "unauthorised"
    | "loading"
    | "introduction"
    | "playing"
    | "gameOver"
    | "winner"
    | "loser"
    | "complete"
    | "starting"
    | "noAttempts";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  PortalEvent,
  PortalState
>;

export type PortalMachineState = State<Context, PortalEvent, PortalState>;

const resetGameTransition = {
  RETRY: {
    target: "starting",
    actions: assign<Context, any>({
      score: () => 0,
      inventory: () => 0,
      depositedCropIndexes: () => [],
      harvestedCropIndexes: () => [],
      inventoryCropIndexes: () => [],
      endAt: () => 0,
    }),
  },
};

export const portalMachine = createMachine<Context, PortalEvent, PortalState>({
  id: "portalMachine",
  initial: "initialising",
  context: {
    id: 0,
    jwt: getJwt(),

    isJoystickActive: false,
    isSmallScreen: false,

    state: CONFIG.API_URL ? undefined : OFFLINE_FARM,

    score: 0,
    inventory: 0,

    depositedCropIndexes: [],
    harvestedCropIndexes: [],
    inventoryCropIndexes: [],

    attemptsLeft: 0,
    endAt: 0,
  },
  on: {
    SET_IS_JOYSTICK_ACTIVE: {
      actions: assign<Context, any>({
        isJoystickActive: (_: Context, event: SetIsJoystickActiveEvent) => {
          return event.isJoystickActive;
        },
      }),
    },
    SET_IS_SMALL_SCREEN: {
      actions: assign<Context, any>({
        isSmallScreen: (_: Context, event: SetIsSmallScreenEvent) => {
          return event.isSmallScreen;
        },
      }),
    },
    UNLOCKED_ACHIEVEMENTS: {
      actions: assign<Context, any>({
        state: (context: Context, event: UnlockAchievementsEvent) => {
          achievementsUnlocked({ achievementNames: event.achievementNames });
          return unlockMinigameAchievements({
            state: context.state!,
            action: {
              type: "minigame.achievementsUnlocked",
              id: "crops-and-chickens",
              achievementNames: event.achievementNames,
            },
          });
        },
      }) as any,
    },
  },
  states: {
    initialising: {
      always: [
        {
          target: "unauthorised",
          // TODO: Also validate token
          cond: (context) => !!CONFIG.API_URL && !context.jwt,
        },
        {
          target: "loading",
        },
      ],
    },
    loading: {
      id: "loading",
      invoke: {
        src: async (context) => {
          if (!getUrl()) {
            return { game: OFFLINE_FARM, attemptsLeft: DAILY_ATTEMPTS };
          }

          const { farmId } = decodeToken(context.jwt);

          // Load the game data
          const { game } = await loadPortal({
            portalId: CONFIG.PORTAL_APP,
            token: context.jwt,
          });

          const minigame = game.minigames.games["crops-and-chickens"];
          const attemptsLeft = getAttemptsLeft(minigame);

          return { game, farmId, attemptsLeft };
        },
        onDone: [
          {
            target: "introduction",
            actions: assign({
              state: (_: any, event) => event.data.game,
              id: (_: any, event) => event.data.farmId,
              attemptsLeft: (_: any, event) => event.data.attemptsLeft,
            }),
          },
        ],
        onError: {
          target: "error",
        },
      },
    },

    noAttempts: {
      on: {
        CANCEL_PURCHASE: {
          target: "introduction",
        },
        PURCHASED_RESTOCK: {
          target: "introduction",
          actions: assign<Context>({
            state: (context: Context) =>
              purchaseMinigameItem({
                state: context.state!,
                action: {
                  id: "crops-and-chickens",
                  sfl: RESTOCK_ATTEMPTS_SFL,
                  type: "minigame.itemPurchased",
                  items: {},
                },
              }),
          }) as any,
        },
        PURCHASED_UNLIMITED: {
          target: "introduction",
          actions: assign<Context>({
            state: (context: Context) =>
              purchaseMinigameItem({
                state: context.state!,
                action: {
                  id: "crops-and-chickens",
                  sfl: UNLIMITED_ATTEMPTS_SFL,
                  type: "minigame.itemPurchased",
                  items: {},
                },
              }),
          }) as any,
        },
      },
    },

    starting: {
      always: [
        {
          target: "noAttempts",
          cond: (context) => {
            const minigame =
              context.state?.minigames.games["crops-and-chickens"];
            const attemptsLeft = getAttemptsLeft(minigame);

            return attemptsLeft <= 0;
          },
        },
        {
          target: "ready",
        },
      ],
    },

    introduction: {
      on: {
        CONTINUE: {
          target: "starting",
        },
      },
    },

    ready: {
      on: {
        START: {
          target: "playing",
          actions: assign<Context>({
            state: (context: any) => {
              startAttempt();
              return startMinigameAttempt({
                state: context.state,
                action: {
                  type: "minigame.attemptStarted",
                  id: "crops-and-chickens",
                },
              });
            },
            endAt: () => Date.now() + GAME_SECONDS * 1000,
            attemptsLeft: (context: Context) => context.attemptsLeft - 1,
          }) as any,
        },
      },
    },

    playing: {
      on: {
        CROP_HARVESTED: {
          actions: assign<Context, any>({
            inventory: (context: Context, event: CropHarvestedEvent) => {
              const cropPoint = SCORE_TABLE[event.cropIndex].points;
              return context.inventory + cropPoint;
            },
            harvestedCropIndexes: (
              context: Context,
              event: CropHarvestedEvent,
            ) => {
              return [...context.harvestedCropIndexes, event.cropIndex];
            },
            inventoryCropIndexes: (
              context: Context,
              event: CropHarvestedEvent,
            ) => {
              return [...context.inventoryCropIndexes, event.cropIndex];
            },
          }),
        },
        CROP_DEPOSITED: {
          actions: assign<Context, any>({
            score: (context: Context) => {
              return context.score + context.inventory;
            },
            inventory: () => 0,
            depositedCropIndexes: (context: Context) => {
              return [
                ...context.depositedCropIndexes,
                ...context.inventoryCropIndexes,
              ];
            },
            inventoryCropIndexes: () => [],
          }),
        },
        PLAYER_KILLED: {
          actions: assign<Context, any>({
            inventory: () => 0,
            inventoryCropIndexes: () => [],
          }),
        },
        END_GAME_EARLY: {
          actions: assign<Context, any>({
            endAt: () => Date.now(),
          }),
        },
        GAME_OVER: {
          target: "gameOver",
          actions: assign({
            state: (context: any) => {
              submitScore({ score: context.score });
              return submitMinigameScore({
                state: context.state,
                action: {
                  type: "minigame.scoreSubmitted",
                  score: context.score,
                  id: "crops-and-chickens",
                },
              });
            },
          }) as any,
        },
      },
    },

    gameOver: {
      always: [
        {
          // they have already completed the mission before
          target: "complete",
          cond: (context) => {
            const dateKey = new Date().toISOString().slice(0, 10);

            const minigame =
              context.state?.minigames.games["crops-and-chickens"];
            const history = minigame?.history ?? {};

            return !!history[dateKey]?.prizeClaimedAt;
          },
        },

        {
          target: "winner",
          cond: (context) => {
            const prize = context.state?.minigames.prizes["crops-and-chickens"];

            if (!prize) {
              return false;
            }

            return context.score >= prize.score;
          },
        },
        {
          target: "loser",
        },
      ],
    },

    winner: {
      on: resetGameTransition,
    },

    loser: {
      on: resetGameTransition,
    },

    complete: {
      on: resetGameTransition,
    },

    error: {
      on: {
        RETRY: {
          target: "initialising",
        },
      },
    },

    unauthorised: {},
  },
});
