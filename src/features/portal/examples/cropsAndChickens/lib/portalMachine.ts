import { OFFLINE_FARM } from "features/game/lib/landData";
import { GameState } from "features/game/types/game";
import { assign, createMachine, Interpreter, State } from "xstate";
import { loadPortal } from "../actions/loadPortal";
import { CONFIG } from "lib/config";
import { claimArcadeToken } from "../actions/claimArcadeToken";
import { Client, Room } from "colyseus.js";
import { PlazaRoomState } from "features/world/types/Room";
import { SPAWNS } from "features/world/lib/spawn";
import { decodeToken } from "features/auth/actions/login";
import { GAME_SECONDS } from "../CropsAndChickensConstants";

const getJWT = () => {
  const code = new URLSearchParams(window.location.search).get("jwt");

  return code ?? undefined;
};

const getServer = () => {
  const code = new URLSearchParams(window.location.search).get("server");

  return code;
};

export interface Context {
  id: number;

  inventoryScore: number;
  depositedScore: number;
  endAt: number;

  jwt?: string;
  state?: GameState;
  mmoServer?: Room<PlazaRoomState>;
}

type CropHarvestedEvent = {
  type: "CROP_HARVESTED";
  points: number;
};

export type PortalEvent =
  | { type: "START" }
  | { type: "CLAIM" }
  | { type: "RETRY" }
  | { type: "CONTINUE" }
  | { type: "GAME_OVER" }
  | CropHarvestedEvent
  | { type: "CROP_DEPOSITED" }
  | { type: "KILL_PLAYER" };

export type PortalState = {
  value:
    | "initialising"
    | "error"
    | "idle"
    | "ready"
    | "unauthorised"
    | "loading"
    | "claiming"
    | "completed"
    | "introduction"
    | "playing"
    | "gameOver";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  PortalEvent,
  PortalState
>;

export type PortalMachineState = State<Context, PortalEvent, PortalState>;

export const portalMachine = createMachine<Context, PortalEvent, PortalState>({
  id: "portalMachine",
  initial: "initialising",
  context: {
    id: 0,
    jwt: getJWT(),
    state: CONFIG.API_URL ? undefined : OFFLINE_FARM,

    inventoryScore: 0,
    depositedScore: 0,
    endAt: 0,
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
          if (!CONFIG.API_URL) {
            return { game: OFFLINE_FARM };
          }

          const { farmId } = decodeToken(context.jwt as string);

          // Load the game data
          const { game } = await loadPortal({
            portalId: CONFIG.PORTAL_APP,
            token: context.jwt as string,
          });

          // Join the MMO Server
          let mmoServer: Room<PlazaRoomState> | undefined;
          const serverName = getServer() ?? "sunflorea_bliss";
          const mmoUrl = CONFIG.ROOM_URL;

          if (serverName && mmoUrl) {
            const client = new Client(mmoUrl);

            mmoServer = await client?.joinOrCreate<PlazaRoomState>(serverName, {
              jwt: context.jwt,
              bumpkin: game?.bumpkin,
              farmId,
              x: SPAWNS().crops_and_chickens.default.x,
              y: SPAWNS().crops_and_chickens.default.y,
              sceneId: "crops_and_chickens",
              experience: game.bumpkin?.experience ?? 0,
            });
          }

          return { game, mmoServer, farmId };
        },
        onDone: [
          {
            target: "introduction",
            actions: assign({
              state: (_: any, event) => event.data.game,
              mmoServer: (_: any, event) => event.data.mmoServer,
              id: (_: any, event) => event.data.farmId,
            }),
          },
        ],
        onError: {
          target: "error",
        },
      },
    },

    introduction: {
      on: {
        CONTINUE: {
          target: "ready",
        },
      },
    },

    ready: {
      on: {
        START: {
          target: "playing",
          actions: assign<Context, any>({
            endAt: () => Date.now() + GAME_SECONDS * 1000,
          }),
        },
      },
    },
    playing: {
      on: {
        CROP_HARVESTED: {
          actions: assign<Context, any>({
            inventoryScore: (context: Context, event: CropHarvestedEvent) => {
              return context.inventoryScore + event.points;
            },
          }),
        },
        CROP_DEPOSITED: {
          actions: assign<Context, any>({
            depositedScore: (context: Context) => {
              return context.depositedScore + context.inventoryScore;
            },
            inventoryScore: () => 0,
          }),
        },
        KILL_PLAYER: {
          actions: assign<Context, any>({
            inventoryScore: () => 0,
          }),
        },
        GAME_OVER: {
          target: "gameOver",
        },
      },
    },
    gameOver: {
      on: {
        RETRY: {
          target: "ready",
          actions: assign<Context, any>({
            inventoryScore: () => 0,
            depositedScore: () => 0,
            endAt: () => 0,
          }),
        },
        CLAIM: {
          target: "claiming",
        },
      },
    },
    claiming: {
      id: "claiming",
      invoke: {
        src: async (context) => {
          const { game } = await claimArcadeToken({
            token: context.jwt as string,
          });

          return { game };
        },
        onDone: [
          {
            target: "completed",
            actions: assign<Context, any>({
              state: (_: any, event) => event.data.game,
            }),
          },
        ],
        onError: [
          {
            target: "error",
          },
        ],
      },
    },

    completed: {
      on: {},
    },
    error: {
      on: {
        RETRY: {
          target: "initialising",
          actions: assign<Context, any>({
            inventoryScore: () => 0,
            depositedScore: () => 0,
            endAt: () => 0,
          }),
        },
      },
    },
    unauthorised: {},
  },
});
